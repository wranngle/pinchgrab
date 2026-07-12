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

//# debugId=AA3FC12A92B5374964756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvYnVuZGxlZC1za2lsbHMuZ2VuLnRzIiwgInNyYy9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICAvLyBVc2VyIGV4cGxpY2l0bHkgZGV0YWNoZWQgdGhpcyBjb21tZW50IGZyb20gYW55IHNlbGVjdG9yLiBXaXRob3V0IHRoZVxuICAvLyBmbGFnLCBhZGphY2VuY3kgdG8gdGhlIHByZWNlZGluZyBzZWxlY3RvciB3b3VsZCBzaWxlbnRseSByZS1hZG9wdCB0aGVcbiAgLy8gY29tbWVudCBhdCByZW5kZXIvZXhwb3J0IHRpbWUuXG4gIGRldGFjaGVkPzogYm9vbGVhbjtcbiAgdGFncz86IHN0cmluZ1tdO1xuICAvLyBTZXZlcml0eSAoYG5vdGVgIC8gYGZpeGAgLyBgYmxvY2tgKSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSBpblxuICAvLyAyMDI2LTA1LiBUaGUgZmllbGQgaXMgcmV0YWluZWQgb24gdGhlIHR5cGUgYXMgYHVua25vd25gIHNvXG4gIC8vIHRvbGVyYW50IHJlYWRlcnMgKGBkZW5vcm1hbGl6ZUVudHJ5YCkgZG9uJ3QgZHJvcCB0aGUgdmFsdWUgZnJvbVxuICAvLyBsZWdhY3kgSlNPTkwgZXhwb3J0czsgbmV3IHNlc3Npb25zIG5ldmVyIHNldCBpdC5cbiAgc2V2ZXJpdHk/OiAnbm90ZScgfCAnZml4JyB8ICdibG9jayc7XG59O1xuXG5leHBvcnQgdHlwZSBQYWdlTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3BhZ2UnO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHZpZXdwb3J0PzogVmlld3BvcnQ7XG4gIHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBSb3V0ZSBpZGVudGl0eSBiZXlvbmQgdGhlIFVSTC4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIG9mIHBhdGhuYW1lXG4gIC8vIC8gcXVlcnkgLyBoYXNoICsgYSBndWVzcyBhdCB0aGVcbiAgLy8gYWN0aXZlIHJvdXRlTmFtZSAoYD9yb3V0ZT1zZXR0aW5nc2Agb3IgYCMvdXNlcnMvNDJgIHN0eWxlKS5cbiAgcm91dGU/OiB7XG4gICAgcGF0aG5hbWU/OiBzdHJpbmc7XG4gICAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGhhc2g/OiBzdHJpbmc7XG4gICAgcm91dGVOYW1lPzogc3RyaW5nO1xuICAgIHJvdXRlUGFyYW0/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFJlZGFjdGVkIHN0YXRlIHNuYXBzaG90LiBTdXJmYWNlcyB0aGUgU0hBUEUgb2Ygc3RhdGUgdGhhdCBwcm9kdWNlZFxuICAvLyB0aGUgcGFnZSAoc3RvcmFnZSBrZXlzLCBjb29raWUgbmFtZXMsIGZlYXR1cmUgZmxhZ3MpIHdpdGhvdXRcbiAgLy8gbGVha2luZyB2YWx1ZXMuIExldHMgYSBkb3duc3RyZWFtIGFnZW50IHJlcHJvZHVjZSBieSBzZXR0aW5nIHVwIHRoZVxuICAvLyBzYW1lIGtleXMgd2l0aCB0aGVpciBvd24gZGF0YS5cbiAgc3RhdGU/OiB7XG4gICAgc3RvcmFnZUtleXM/OiBzdHJpbmdbXTtcbiAgICBzZXNzaW9uS2V5cz86IHN0cmluZ1tdO1xuICAgIGNvb2tpZU5hbWVzPzogc3RyaW5nW107XG4gICAgZmVhdHVyZUZsYWdzPzogc3RyaW5nO1xuICB9O1xuICAvLyBTZXNzaW9uIHV1aWQuIFN0YWJsZSBwZXIgd29ya3NwYWNlLWJvb3Qg4oCUIHNlbGVjdG9yIGVudHJpZXMgcmVmZXJlbmNlXG4gIC8vIGl0IHZpYSBgRW50cnkuc2Vzc2lvbklkYCBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzIHRvIHRoZWlyXG4gIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJpc29uLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbE1lc3NhZ2UgPSBTZWxlY3Rvck1lc3NhZ2UgfCBGZWVkYmFja01lc3NhZ2UgfCBQYWdlTWVzc2FnZTtcblxuLy8gLS0tLS0tLS0tLSBJUEMgcGF5bG9hZHMgKENTIOKGlCBQYW5lbCDihpQgQmFja2dyb3VuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIENzVG9QYW5lbCA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlJzsgZW50cnk6IEVudHJ5OyBwYWdlOiBQYWdlQ29udGV4dDsgZ3JvdXBlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdob3Zlcic7IHNlbGVjdG9yOiBzdHJpbmc7IHRhZzogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByZWN0OiBSZWN0fVxuICB8IHtraW5kOiAnaG92ZXItZW5kJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIC8vIEV4cG9ydC10aW1lIHJlcXVlc3QgZm9yIHRoZSBmdWxsIHNlcmlhbGl6ZWQgcGFnZSAob3B0LWluIHByZWZcbiAgLy8gaW5jbHVkZVBhZ2VIVE1MKS4gUmVwbGllZCB3aXRoIHtvaywgdXJsLCB0aXRsZSwgaHRtbH07IG5ldmVyIHBlcnNpc3RlZFxuICAvLyB0byBjaHJvbWUuc3RvcmFnZSDigJQgdGhlIHBheWxvYWQgZ29lcyBzdHJhaWdodCBpbnRvIHRoZSB0YXIuXG4gIHwge2tpbmQ6ICdwYWdlLWh0bWwnfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gRnVsbC1wYWdlIChiZXN0LWVmZm9ydCkgc2NyZWVuc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gVW5saWtlXG4gIC8vIHNob3QtcGFnZSB0aGlzIGRvZXMgTk9UIHdyaXRlIGEgZmlsZSBvciBidWlsZCBhIHRodW1ibmFpbCDigJQgaXQganVzdFxuICAvLyByZXR1cm5zIHRoZSBzdGl0Y2hlZCBQTkcgYXMgYSBkYXRhIFVSTCBzbyB0aGUgY2FsbGVyIChjb250ZW50IHNjcmlwdCkgY2FuXG4gIC8vIGF0dGFjaCBpdCB0byBhIFBhZ2VTbmFwc2hvdC4gYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydFxuICAvLyBjb3VsZCBiZSBjYXB0dXJlZC5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gKHJlKWluamVjdCB0aGUgY29udGVudCBzY3JpcHQg4oCUIHRoZSBmaXhcbiAgLy8gZm9yIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIGNvbnRlbnQgc2NyaXB0LiBEZWZhdWx0cyB0byB0aGUgYWN0aXZlIHRhYi5cbiAgfCB7a2luZDogJ3BnLXJlaW5qZWN0JzsgdGFiSWQ/OiBudW1iZXJ9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuLy8gUmVwbHkgdG8gYSBgcGFnZS1zbmFwc2hvdC1zaG90YCByZXF1ZXN0LiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwgb2Zcbi8vIHRoZSAoYmVzdC1lZmZvcnQpIGZ1bGwgcGFnZTsgYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCB3YXNcbi8vIGNhcHR1cmVkLiBgb2s6ZmFsc2VgIGNhcnJpZXMgYW4gZXJyb3Igc3RyaW5nLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBzY3JlZW5zaG90Pzogc3RyaW5nO1xuICBwYXJ0aWFsPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBTYXZlUmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGhcbiAgYWJzUGF0aD86IHN0cmluZzsgIC8vIE9TLWFic29sdXRlIHBhdGhcbiAgY29weVBhdGg/OiBzdHJpbmc7IC8vIFVJLWZhY2luZyBwYXRoXG4gIHRlbXBQYXRoPzogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBCZ1JlcGx5ID1cbiAgfCB7ZGF0YVVybDogc3RyaW5nfVxuICB8IHtmb3VuZDogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyfVxuICB8IHt0YWJzOiBBcnJheTx7aWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9Pn1cbiAgfCB7ZXJyb3I6IHN0cmluZ31cbiAgfCBTaG90UmVwbHlcbiAgfCBTYXZlUmVwbHlcbiAgfCBQYWdlU25hcHNob3RSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5OiBmaXJzdCAxNiBoZXggY2hhcnMgb2YgYSBTSEEtMjU2IG92ZXIgdGhlXG4gIC8vIHNsaW0gcm93cyArIHNjcmVlbnNob3QgbmFtZXMuIFN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cyBvZiB0aGUgc2FtZVxuICAvLyBjb250ZW50LCBzbyBkb3duc3RyZWFtIHN0YXRlIChlLmcuIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyovYnVuZGxlcy8pXG4gIC8vIGtleXMgb24gaXQgd2l0aG91dCBkdXBsaWNhdGluZyB3b3JrLlxuICBidW5kbGVJZD86IHN0cmluZztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gICAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gICAgcGFnZXNIdG1sPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBXaGVyZSB0aGUgYWdlbnQgZG9jdHJpbmUgbGl2ZXMgaW5zaWRlIHRoZSBhcmNoaXZlIChTZW5kLXRvLUFnZW50XG4gIC8vIHByb3RvY29sKS4gQWJzZW50IG9uIHBsYWluIEpTT05MIGV4cG9ydHMuXG4gIGFnZW50UHJvdG9jb2w/OiB7YXJjaGl2ZVBhdGg6IHN0cmluZ307XG4gIC8vIEJ1bmRsZSB0b2tlbiBidWRnZXQ6IGBzaWduYWwqYCBpcyB0aGUgdXAtZnJvbnQgcmVhZCAoQUdFTlQtUFJPVE9DT0wsXG4gIC8vIFJFQURNRSwgcmVwYWlyLWluZGV4LCB0aGUgSlNPTkwsIERFU0lHTiwgdGhlIHR3byBTS0lMTHMsIHNraWxscy1pbmRleCk7XG4gIC8vIGB0b3RhbCpgIGlzIHRoZSB3aG9sZSBhcmNoaXZlLiBUaGUgbGF6eSByZW1haW5kZXIgaXMgZW51bWVyYXRlZCBpbiB0aGVcbiAgLy8gYnVuZGxlIGZpbGUgbmFtZWQgYnkgYGlnbm9yZWAuIEVzdGltYXRvciBoZXVyaXN0aWM6IGJ5dGVzIC8gNC5cbiAgdG9rZW5zPzoge3NpZ25hbEJ5dGVzOiBudW1iZXI7IHRvdGFsQnl0ZXM6IG51bWJlcjsgc2lnbmFsVG9rZW5zOiBudW1iZXI7IHRvdGFsVG9rZW5zOiBudW1iZXI7IGlnbm9yZTogc3RyaW5nfTtcbiAgLy8gVmVuZG9yZWQgc2tpbGwgZG9jdW1lbnRzIGJ1bmRsZWQgaW50byB0aGlzIGFyY2hpdmUgKHN1YnNldCBvZiB0aGVcbiAgLy8gcmljaGVyIHNraWxscy1pbmRleC5qc29uIGF0IHRoZSBhcmNoaXZlIHJvb3QpLiBgaW52b2NhdGlvbmAgY2FycmllcyBhXG4gIC8vIHBsdWdpbi1jb21tYW5kIGZvcm0gZm9yIGhhcm5lc3NlcyB0aGF0IHN1cHBvcnQgaXQuXG4gIGJ1bmRsZWRTa2lsbHM/OiBBcnJheTx7aWQ6IHN0cmluZzsga2luZDogJ3NraWxsJyB8ICdyZWZlcmVuY2UnOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBpbnZvY2F0aW9uPzogc3RyaW5nfT47XG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGRvY3VtZW50cyBidW5kbGVkIHVuZGVyIHBhZ2VzLyAob3B0LWluIHByZWYpLlxuICBwYWdlc0h0bWw/OiBBcnJheTx7dXJsOiBzdHJpbmc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGJ5dGVzOiBudW1iZXJ9PjtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gU3Vic2V0IG9mIGx1Y2lkZS5kZXYgaWNvbnMgaW5saW5lZCBhcyBTVkcgaW5uZXItbWFya3VwLlxuLy8gRWFjaCBlbnRyeSBpcyB0aGUgYm9keSBvZiA8c3ZnIC4uLiA+IC4uLiA8L3N2Zz47IHN2Z1N0cmluZygpIHdyYXBzIGl0LlxuLy8gU2l6ZXMgZGVmYXVsdCB0byAxNjsgb3ZlcnJpZGUgd2l0aCB0aGUgc2l6ZSBhcmd1bWVudC5cbi8vXG4vLyBNSVQg4oCUIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWNpZGUtaWNvbnMvbHVjaWRlXG5cbmNvbnN0IElDT05TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2hldnJvbi1yaWdodCc6ICc8cGF0aCBkPVwibTkgMTggNi02LTYtNlwiLz4nLFxuICAnY2hldnJvbi1kb3duJzogJzxwYXRoIGQ9XCJtNiA5IDYgNiA2LTZcIi8+JyxcbiAgY29weTogJzxyZWN0IHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjhcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk00IDE2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDJcIi8+JyxcbiAgcGVuY2lsOiAnPHBhdGggZD1cIk0yMS4xNzQgNi44MTJhMSAxIDAgMCAwLTMuOTg2LTMuOTg3TDMuODQyIDE2LjE3NGEyIDIgMCAwIDAtLjUuODNsLTEuMzIxIDQuMzUyYS41LjUgMCAwIDAgLjYyMy42MjJsNC4zNTMtMS4zMmEyIDIgMCAwIDAgLjgzLS40OTd6XCIvPjxwYXRoIGQ9XCJtMTUgNSA0IDRcIi8+JyxcbiAgJ3RyYXNoLTInOiAnPHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjZcIi8+PHBhdGggZD1cIk04IDZWNGMwLTEgMS0yIDItMmg0YzEgMCAyIDEgMiAydjJcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiMTBcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjE0XCIgeDI9XCIxNFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPicsXG4gIHBsdXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+PHBhdGggZD1cIk0xMiA1djE0XCIvPicsXG4gIHg6ICc8cGF0aCBkPVwiTTE4IDYgNiAxOFwiLz48cGF0aCBkPVwibTYgNiAxMiAxMlwiLz4nLFxuICBtaW51czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz4nLFxuICBzZWFyY2g6ICc8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjhcIi8+PHBhdGggZD1cIm0yMSAyMS00LjMtNC4zXCIvPicsXG4gIGRvd25sb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCI3IDEwIDEyIDE1IDE3IDEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIxNVwiIHkyPVwiM1wiLz4nLFxuICB1cGxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE3IDggMTIgMyA3IDhcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjNcIiB5Mj1cIjE1XCIvPicsXG4gIGdpdGh1YjogJzxwYXRoIGQ9XCJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNCA1LjQgMCAwIDAgNCA5YzAgMy41IDMgNS41IDYgNS41LS4zOS40OS0uNjggMS4wNS0uODUgMS42NS0uMTcuNi0uMjIgMS4yMy0uMTUgMS44NXY0XCIvPjxwYXRoIGQ9XCJNOSAxOGMtNC41MSAyLTUtMi03LTJcIi8+JyxcbiAgc3RhcjogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIi8+JyxcbiAgJ2NpcmNsZS1kb3QnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIGNyb3NzaGFpcjogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIyMlwiIHgyPVwiMThcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjZcIiB4Mj1cIjJcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiNlwiIHkyPVwiMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMjJcIiB5Mj1cIjE4XCIvPicsXG4gIHRhcmdldDogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI2XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMlwiLz4nLFxuICAncGFuZWwtbGVmdC1jbG9zZSc6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIvPjxwYXRoIGQ9XCJNOSAzdjE4XCIvPjxwYXRoIGQ9XCJtMTYgMTUtMy0zIDMtM1wiLz4nLFxuICAnZXh0ZXJuYWwtbGluayc6ICc8cGF0aCBkPVwiTTE1IDNoNnY2XCIvPjxwYXRoIGQ9XCJNMTAgMTQgMjEgM1wiLz48cGF0aCBkPVwiTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDZcIi8+JyxcbiAgJ21lc3NhZ2Utc3F1YXJlLXBsdXMnOiAnPHBhdGggZD1cIk0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnpcIi8+PGxpbmUgeDE9XCI5XCIgeDI9XCIxNVwiIHkxPVwiMTBcIiB5Mj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI3XCIgeTI9XCIxM1wiLz4nLFxuICAnYWxlcnQtY2lyY2xlJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjhcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyLjAxXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgJ3JlZnJlc2gtY3cnOiAnPHBhdGggZD1cIk0zIDEyYTkgOSAwIDAgMSAxNS02LjdMMjEgOFwiLz48cGF0aCBkPVwiTTIxIDN2NWgtNVwiLz48cGF0aCBkPVwiTTIxIDEyYTkgOSAwIDAgMS0xNSA2LjdMMyAxNlwiLz48cGF0aCBkPVwiTTMgMjF2LTVoNVwiLz4nLFxuICAnZmlsZS10ZXh0JzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTNcIiB5Mj1cIjEzXCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjE3XCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjEwXCIgeDI9XCI4XCIgeTE9XCI5XCIgeTI9XCI5XCIvPicsXG4gICdmaWxlLWNvZGUnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48cGF0aCBkPVwibTEwIDEzLTIgMiAyIDJcIi8+PHBhdGggZD1cIm0xNCAxNyAyLTItMi0yXCIvPicsXG4gIGltYWdlOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiOVwiIHI9XCIyXCIvPjxwYXRoIGQ9XCJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMVwiLz4nLFxuICAvLyBTdHlsaXNlZCBcInBpbmNoXCIg4oCUIHR3byBvcHBvc2luZyBjdXJ2ZXMgbWVldGluZyBhdCBhIGNlbnRlciBkb3QuXG4gIHBpbmNoOiAnPHBhdGggZD1cIk01IDVjMyAyIDUgNCA3IDctMiAzLTQgNS03IDdcIi8+PHBhdGggZD1cIk0xOSA1Yy0zIDItNSA0LTcgNyAyIDMgNCA1IDcgN1wiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEuNVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgJ3N0YXItZmlsbGVkJzogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIHBpbjogJzxwYXRoIGQ9XCJNMTIgMTd2NVwiLz48cGF0aCBkPVwiTTkgMTAuNzZhMiAyIDAgMCAxLTEuMTEgMS43OWwtMS43OC45QTIgMiAwIDAgMCA1IDE1LjI0VjE2YTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtLjc2YTIgMiAwIDAgMC0xLjExLTEuNzlsLTEuNzgtLjlBMiAyIDAgMCAxIDE1IDEwLjc2VjdhMSAxIDAgMCAxIDEtMSAyIDIgMCAwIDAgMC00SDhhMiAyIDAgMCAwIDAgNCAxIDEgMCAwIDEgMSAxelwiLz4nLFxuICB1bmRvOiAnPHBhdGggZD1cIk0zIDd2Nmg2XCIvPjxwYXRoIGQ9XCJNMjEgMTdhOSA5IDAgMCAwLTE1LTYuN0wzIDEzXCIvPicsXG4gIHJlZG86ICc8cGF0aCBkPVwiTTIxIDd2NmgtNlwiLz48cGF0aCBkPVwiTTMgMTdhOSA5IDAgMCAxIDE1LTYuN0wyMSAxM1wiLz4nLFxuICBmb2xkZXI6ICc8cGF0aCBkPVwiTTIwIDIwYTIgMiAwIDAgMCAyLTJWOGEyIDIgMCAwIDAtMi0yaC03LjkzYTIgMiAwIDAgMS0xLjY2LS45bC0uODItMS4yQTIgMiAwIDAgMCA3LjkzIDNINGEyIDIgMCAwIDAtMiAydjEzYTIgMiAwIDAgMCAyIDJaXCIvPicsXG4gIGNoZWNrOiAnPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIvPicsXG4gICdjaXJjbGUtY2hlY2snOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiLz4nLFxuICBncmlwOiAnPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjE5XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxOVwiIHI9XCIxXCIvPicsXG4gIC8vIEJyb2tlbi1jaGFpbiBpY29uIGZvciBcImRldGFjaCBjb21tZW50IGZyb20gaXRzIGNhcHR1cmVcIi4gTHVjaWRlJ3MgYHVubGlua2AuXG4gIHVubGluazogJzxwYXRoIGQ9XCJtMTguODQgMTIuMjUgMS43Mi0xLjcxaC0uMDJhNS4wMDQgNS4wMDQgMCAwIDAtLjEyLTcuMDcgNS4wMDYgNS4wMDYgMCAwIDAtNi45NSAwbC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIm01LjE3IDExLjc1LTEuNzEgMS43MWE1LjAwNCA1LjAwNCAwIDAgMCAuMTIgNy4wNyA1LjAwNiA1LjAwNiAwIDAgMCA2Ljk1IDBsMS43MS0xLjcxXCIvPjxsaW5lIHgxPVwiOFwiIHgyPVwiOFwiIHkxPVwiMlwiIHkyPVwiNVwiLz48bGluZSB4MT1cIjJcIiB4Mj1cIjVcIiB5MT1cIjhcIiB5Mj1cIjhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiMTZcIiB5MT1cIjE5XCIgeTI9XCIyMlwiLz48bGluZSB4MT1cIjE5XCIgeDI9XCIyMlwiIHkxPVwiMTZcIiB5Mj1cIjE2XCIvPicsXG4gIHNldHRpbmdzOiAnPHBhdGggZD1cIk0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIvPicsXG4gIGluZm86ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJNMTIgMTZ2LTRcIi8+PHBhdGggZD1cIk0xMiA4aC4wMVwiLz4nLFxuICAvLyBUcmVlLW9mLXJvd3Mg4oCUIHVzZWQgZm9yIFwiU3BsaXQgZ3JvdXBcIiBhY3Rpb24gKGRlbm90ZXMgb25lIG5vZGUgZmFubmluZ1xuICAvLyBvdXQgaW50byBzaWJsaW5ncykuIEx1Y2lkZSdzIGBsaXN0LXRyZWVgLlxuICAnbGlzdC10cmVlJzogJzxwYXRoIGQ9XCJNMjEgMTJoLThcIi8+PHBhdGggZD1cIk0yMSA2SDhcIi8+PHBhdGggZD1cIk0yMSAxOGgtOFwiLz48cGF0aCBkPVwiTTMgNnY0YzAgMS4xLjkgMiAyIDJoM1wiLz48cGF0aCBkPVwiTTMgMTB2NmMwIDEuMS45IDIgMiAyaDNcIi8+JyxcbiAgLy8gR2VuZXJpYyBzcGxpdCBpY29uIGFzIGEgZmFsbGJhY2sgb3B0aW9uLlxuICBzcGxpdDogJzxwYXRoIGQ9XCJNMTYgM2g1djVcIi8+PHBhdGggZD1cIk04IDNIM3Y1XCIvPjxwYXRoIGQ9XCJtMjEgMy03LjQ2IDcuNDZhMiAyIDAgMCAwIDAgMi44M0wyMSAyMVwiLz48cGF0aCBkPVwiTTMgM2w3LjQ2IDcuNDZhMiAyIDAgMCAxIDAgMi44M0wzIDIxXCIvPicsXG4gIC8vIENhcmRib2FyZC1zdHlsZSBib3ggdXNlZCBmb3IgXCJFeHBvcnQgd29ya3NwYWNlIGFzIFpJUFwiLlxuICBwYWNrYWdlOiAnPHBhdGggZD1cIm03LjUgNC4yNyA5IDUuMTVcIi8+PHBhdGggZD1cIk0yMSA4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNlpcIi8+PHBhdGggZD1cIk0zLjMgNyAxMiAxMmw4LjctNVwiLz48cGF0aCBkPVwiTTEyIDIyVjEyXCIvPicsXG4gIC8vIFR3byBpbnRlcmxvY2tpbmcgbGlua3Mg4oCUIHVzZWQgZm9yIFwiQ29weSBhcyBwYXRoXCIuXG4gIGxpbms6ICc8cGF0aCBkPVwiTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIk0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MVwiLz4nLFxuICAvLyBEYXRhYmFzZS9kdWNrIGljb24gZm9yIHRoZSBEdWNrREIgcGFsZXR0ZSBjb21tYW5kLlxuICBkYXRhYmFzZTogJzxlbGxpcHNlIGN4PVwiMTJcIiBjeT1cIjVcIiByeD1cIjlcIiByeT1cIjNcIi8+PHBhdGggZD1cIk0zIDVWMTlBOSAzIDAgMCAwIDIxIDE5VjVcIi8+PHBhdGggZD1cIk0zIDEyQTkgMyAwIDAgMCAyMSAxMlwiLz4nLFxufTtcblxuY29uc3Qgd3JhcCA9IChib2R5OiBzdHJpbmcsIHNpemU6IG51bWJlcik6IHN0cmluZyA9PlxuICBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj4ke2JvZHl9PC9zdmc+YDtcblxuZXhwb3J0IGNvbnN0IFBHX0lDT05TID0ge1xuICBoYXM6IChuYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IG5hbWUgaW4gSUNPTlMsXG4gIHN2Z1N0cmluZzogKG5hbWU6IHN0cmluZywgc2l6ZSA9IDE2KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBib2R5ID0gSUNPTlNbbmFtZV07XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tsdWNpZGVdIG1pc3NpbmcgaWNvbicsIG5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChib2R5LCBzaXplKTtcbiAgfSxcbiAgbW91bnQ6IChlbDogRWxlbWVudCB8IG51bGwsIG5hbWU6IHN0cmluZywgc2l6ZT86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChlbCkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICB9LFxufTtcblxuLy8gU2lkZS1lZmZlY3QgZm9yIGxlZ2FjeSBzY3JpcHQtdGFnIGluY2x1c2lvbiAoc2lkZXBhbmVsLmh0bWwgc3RpbGwgPHNjcmlwdFxuLy8gc3JjPVwibHVjaWRlLmpzXCI+IOKAlCBwcmUtYnVuZGxlKS4gUmUtZXhwb3NlcyB0aGUgcmVnaXN0cnkgb24gZ2xvYmFsVGhpcy5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5QR19JQ09OUyA9IFBHX0lDT05TO1xufVxuIiwKICAgICIvLyBVU1RBUi1mb3JtYXQgdGFyIGVuY29kZXIuIEVhY2ggZW50cnkgaXMgYSA1MTItYnl0ZSBoZWFkZXIgZm9sbG93ZWQgYnlcbi8vIGNvbnRlbnQgYnl0ZXMgcGFkZGVkIHVwIHRvIHRoZSBuZXh0IDUxMi1ieXRlIGJvdW5kYXJ5LiBUaGUgYXJjaGl2ZSBlbmRzXG4vLyB3aXRoIHR3byB6ZXJvLWZpbGxlZCA1MTItYnl0ZSBibG9ja3MuIH44MCBsaW5lcywgbm8gZGVwZW5kZW5jaWVzLlxuLy9cbi8vIFdlIHBpY2sgdGFyIChyYXRoZXIgdGhhbiB6aXApIGJlY2F1c2UgenN0ZCBpcyB0aGUgd2lyZSBmb3JtYXQgd2Ugd2FudCB0b1xuLy8gcGFpciBpdCB3aXRoIGFuZCB0YXIuenN0IGlzIHRoZSBzdGFuZGFyZCBjb21ibyAoemlwIGlzIGl0cyBvd25cbi8vIGNvbXByZXNzaW9uIGNvbnRhaW5lcikuIFBhdGhzIGxvbmdlciB0aGFuIDEwMCBjaGFycyB1c2UgdGhlIHN0YW5kYXJkXG4vLyB1c3RhciBwcmVmaXggZmllbGQgKDE1NSBieXRlcyBhdCBvZmZzZXQgMzQ1KTogdGhlIHBhdGggaXMgc3BsaXQgYXQgYVxuLy8gc2xhc2ggaW50byBwcmVmaXgo4omkMTU1KS9uYW1lKOKJpDEwMCkuIE9ubHkgdW5zcGxpdHRhYmxlIHBhdGhzIHRocm93IOKAlFxuLy8gR05VL1BBWCBsb25nLW5hbWUgZXh0ZW5zaW9ucyBhcmUgZGVsaWJlcmF0ZWx5IG5vdCBpbXBsZW1lbnRlZC5cblxuY29uc3QgZW5jID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmNvbnN0IHdyaXRlT2N0YWwgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgLy8gdGFyIGZpZWxkcyBhcmUgemVyby1wYWRkZWQgbnVsbC10ZXJtaW5hdGVkIG9jdGFsIHN0cmluZ3MuXG4gIGxldCBzID0gdmFsdWUudG9TdHJpbmcoOCk7XG4gIHMgPSBzLnBhZFN0YXJ0KGxlbmd0aCAtIDEsICcwJyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIC0gMTsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBzLmNoYXJDb2RlQXQoaSk7XG4gIGJ1ZltvZmZzZXQgKyBsZW5ndGggLSAxXSA9IDA7XG59O1xuXG5jb25zdCB3cml0ZUFzY2lpID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHN0cjogc3RyaW5nLCBsZW5ndGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICBjb25zdCBieXRlcyA9IGVuYy5lbmNvZGUoc3RyKTtcbiAgY29uc3QgbGVuID0gTWF0aC5taW4oYnl0ZXMubGVuZ3RoLCBsZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXSE7XG59O1xuXG5jb25zdCBoZWFkZXJDaGVja3N1bSA9IChoZWFkZXI6IFVpbnQ4QXJyYXkpOiBudW1iZXIgPT4ge1xuICAvLyBUaGUgY2hlY2tzdW0gZmllbGQgKDggYnl0ZXMgYXQgb2Zmc2V0IDE0OCkgaXMgdHJlYXRlZCBhcyBBU0NJSSBzcGFjZXNcbiAgLy8gZHVyaW5nIGNvbXB1dGF0aW9uLCB0aGVuIHRoZSBhY3R1YWwgY2hlY2tzdW0gaXMgd3JpdHRlbiBpbnRvIGl0LlxuICBsZXQgc3VtID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MTI7IGkrKykge1xuICAgIGlmIChpID49IDE0OCAmJiBpIDwgMTU2KSBzdW0gKz0gMHgyMDtcbiAgICBlbHNlIHN1bSArPSBoZWFkZXJbaV0gPz8gMDtcbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuZXhwb3J0IHR5cGUgVGFyRW50cnkgPSB7XG4gIG5hbWU6IHN0cmluZztcbiAgZGF0YTogVWludDhBcnJheSB8IHN0cmluZztcbiAgbXRpbWU/OiBudW1iZXI7IC8vIHVuaXggZXBvY2ggc2Vjb25kczsgZGVmYXVsdHMgdG8gbm93XG59O1xuXG4vLyB1c3RhciBuYW1lIHNwbGl0OiBwYXRocyDiiaQxMDAgY2hhcnMgZ28gc3RyYWlnaHQgaW50byB0aGUgbmFtZSBmaWVsZDtcbi8vIGxvbmdlciBwYXRocyBzcGxpdCBhdCB0aGUgcmlnaHRtb3N0IHNsYXNoIHRoYXQgbGVhdmVzIHByZWZpeCDiiaQxNTUgYW5kXG4vLyB0YWlsIOKJpDEwMC4gVGhlIHJlYWRlciByZWFzc2VtYmxlcyBgcHJlZml4ICsgJy8nICsgbmFtZWAuXG5jb25zdCBzcGxpdFRhck5hbWUgPSAoZnVsbDogc3RyaW5nKToge25hbWU6IHN0cmluZzsgcHJlZml4OiBzdHJpbmd9ID0+IHtcbiAgaWYgKGZ1bGwubGVuZ3RoIDw9IDEwMCkgcmV0dXJuIHtuYW1lOiBmdWxsLCBwcmVmaXg6ICcnfTtcbiAgbGV0IGN1dCA9IC0xO1xuICBmb3IgKGxldCBpID0gZnVsbC5pbmRleE9mKCcvJyk7IGkgIT09IC0xOyBpID0gZnVsbC5pbmRleE9mKCcvJywgaSArIDEpKSB7XG4gICAgaWYgKGkgPD0gMTU1ICYmIGZ1bGwubGVuZ3RoIC0gaSAtIDEgPD0gMTAwKSBjdXQgPSBpO1xuICB9XG4gIGlmIChjdXQgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGB0YXI6IHBhdGggbm90IHNwbGl0dGFibGUgaW50byB1c3RhciBwcmVmaXgoMTU1KS9uYW1lKDEwMCk6ICR7ZnVsbH1gKTtcbiAgfVxuICByZXR1cm4ge3ByZWZpeDogZnVsbC5zbGljZSgwLCBjdXQpLCBuYW1lOiBmdWxsLnNsaWNlKGN1dCArIDEpfTtcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZFRhciA9IChlbnRyaWVzOiBUYXJFbnRyeVtdKTogVWludDhBcnJheSA9PiB7XG4gIGNvbnN0IGJsb2NrczogVWludDhBcnJheVtdID0gW107XG4gIGNvbnN0IG5vd1NlYyA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCBkYXRhID0gdHlwZW9mIGVudHJ5LmRhdGEgPT09ICdzdHJpbmcnID8gZW5jLmVuY29kZShlbnRyeS5kYXRhKSA6IGVudHJ5LmRhdGE7XG4gICAgY29uc3Qge25hbWUsIHByZWZpeH0gPSBzcGxpdFRhck5hbWUoZW50cnkubmFtZSk7XG4gICAgY29uc3QgaGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMCwgbmFtZSwgMTAwKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTAwLCAwbzY0NCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vZGVcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTA4LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMTYsIDAsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2lkXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEyNCwgZGF0YS5sZW5ndGgsIDEyKTsgICAgICAgICAgICAgICAgICAvLyBzaXplXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEzNiwgZW50cnkubXRpbWUgPz8gbm93U2VjLCAxMik7ICAgICAgICAvLyBtdGltZVxuICAgIGZvciAobGV0IGkgPSAxNDg7IGkgPCAxNTY7IGkrKykgaGVhZGVyW2ldID0gMHgyMDsgICAgICAgICAgLy8gY2hlY2tzdW0gcGxhY2Vob2xkZXJcbiAgICBoZWFkZXJbMTU2XSA9IDB4MzA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHR5cGVmbGFnICcwJyA9IHJlZ3VsYXIgZmlsZVxuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAyNTcsICd1c3RhcicsIDYpOyAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjYzLCAnMDAnLCAyKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZlcnNpb25cbiAgICBpZiAocHJlZml4KSB3cml0ZUFzY2lpKGhlYWRlciwgMzQ1LCBwcmVmaXgsIDE1NSk7ICAgICAgICAgIC8vIHVzdGFyIHByZWZpeFxuICAgIC8vIHVuYW1lL2duYW1lL2Rldm1ham9yL2Rldm1pbm9yIGxlZnQgemVyby5cblxuICAgIGNvbnN0IGNoZWNrc3VtID0gaGVhZGVyQ2hlY2tzdW0oaGVhZGVyKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTQ4LCBjaGVja3N1bSwgOCk7XG5cbiAgICBibG9ja3MucHVzaChoZWFkZXIpO1xuICAgIGJsb2Nrcy5wdXNoKGRhdGEpO1xuICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoZGF0YS5sZW5ndGggJSA1MTIpKSAlIDUxMjtcbiAgICBpZiAocGFkKSBibG9ja3MucHVzaChuZXcgVWludDhBcnJheShwYWQpKTtcbiAgfVxuICAvLyBUcmFpbGVyOiB0d28gY29uc2VjdXRpdmUgNTEyLWJ5dGUgemVybyBibG9ja3MuXG4gIGJsb2Nrcy5wdXNoKG5ldyBVaW50OEFycmF5KDEwMjQpKTtcblxuICBsZXQgdG90YWwgPSAwO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgeyBvdXQuc2V0KGIsIG9mZnNldCk7IG9mZnNldCArPSBiLmxlbmd0aDsgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8g4pSA4pSA4pSAIFpzdGQgcmF3LWJsb2NrIGZyYW1lIHdyaXRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vXG4vLyBDb21wcmVzc2lvblN0cmVhbSgnenN0ZCcpIGlzbid0IHNoaXBwZWQgaW4gY3VycmVudCBDaHJvbWl1bSAodmVyaWZpZWQgdmlhXG4vLyBydW50aW1lIHByb2JlKSwgc28gd2Ugd3JpdGUgYSB2YWxpZCB6c3RkIGZyYW1lIGNvbnRhaW5pbmcgb25lIG9yIG1vcmVcbi8vIHJhdyAodW5jb21wcmVzc2VkKSBibG9ja3MuIFRoZSBvdXRwdXQgaXMgc3RydWN0dXJhbGx5IGEgcmVhbCBgLnRhci56c3RgXG4vLyBmaWxlOiBgenN0ZCAtZGAgYWNjZXB0cyBpdCwgNy1aaXAgYWNjZXB0cyBpdCwgbGlienN0ZCBhY2NlcHRzIGl0LiBJdFxuLy8ganVzdCBkb2Vzbid0IGFjdHVhbGx5IGNvbXByZXNzIOKAlCBmb3Igb3VyIHBheWxvYWQsIHdoaWNoIGlzIG1vc3RseSBQTkdcbi8vIChhbHJlYWR5IGNvbXByZXNzZWQpIHBsdXMgYSBmZXcgS0Igb2YgSlNPTkwvTWFya2Rvd24sIHRoZSBsb3NzIHZzLiByZWFsXG4vLyBERUZMQVRFIGlzIHNpbmdsZS1kaWdpdCBwZXJjZW50LlxuLy9cbi8vIEZyYW1lIGxheW91dCAocGVyIFJGQyA4ODc4ICsgWnN0YW5kYXJkIGZvcm1hdCBzcGVjKTpcbi8vICAgbWFnaWNfbnVtYmVyICAgICAgIDQgYnl0ZXMgIDB4MjggMHhCNSAweDJGIDB4RkQgKExFOiAweEZEMkZCNTI4KVxuLy8gICBGSEQgICAgICAgICAgICAgICAgMSBieXRlICAgRkNTX3NpemU9MiAoNC1ieXRlIEZDUyksIFNpbmdsZV9TZWdtZW50PTFcbi8vICAgRkNTICAgICAgICAgICAgICAgIDQgYnl0ZXMgIHVuY29tcHJlc3NlZCBwYXlsb2FkIHNpemUgKHUzMiBMRSlcbi8vICAgYmxvY2tzICAgICAgICAgICAgIE4gYmxvY2tzIGVhY2g6IDMtYnl0ZSBoZWFkZXIgKyBwYXlsb2FkXG4vL1xuLy8gQmxvY2sgaGVhZGVyICgzIGJ5dGVzIExFKTpcbi8vICAgYml0IDAgICAgICAgTGFzdF9CbG9jayBmbGFnXG4vLyAgIGJpdHMgMS4uMiAgIEJsb2NrX1R5cGUgKDAwID0gUmF3LCAwMSA9IFJMRSwgMTAgPSBDb21wcmVzc2VkLCAxMSA9IFJlc2VydmVkKVxuLy8gICBiaXRzIDMuLjIzICBCbG9ja19TaXplIChtYXggMTI4IEtpQiBmb3IgcmF3IC8gUkxFKVxuLy9cbi8vIFdlIGNodW5rIGludG8gMTI4IEtpQiByYXcgYmxvY2tzIHRvIHJlc3BlY3QgdGhlIHBlci1ibG9jayBzaXplIGxpbWl0LlxuXG5jb25zdCBaU1REX1JBV19CTE9DS19NQVggPSAxMjggKiAxMDI0O1xuXG5leHBvcnQgY29uc3Qgd3JhcFpzdGQgPSAoZGF0YTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBsZXQgcG9zID0gMDtcbiAgd2hpbGUgKHBvcyA8IGRhdGEubGVuZ3RoIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc3QgcmVtYWluaW5nID0gZGF0YS5sZW5ndGggLSBwb3M7XG4gICAgY29uc3QgYmxvY2tTaXplID0gTWF0aC5taW4ocmVtYWluaW5nLCBaU1REX1JBV19CTE9DS19NQVgpO1xuICAgIGNvbnN0IGlzTGFzdCA9IHBvcyArIGJsb2NrU2l6ZSA+PSBkYXRhLmxlbmd0aCA/IDEgOiAwO1xuICAgIGNvbnN0IGhlYWRlckludCA9IGlzTGFzdCB8ICgwIDw8IDEpIHwgKGJsb2NrU2l6ZSA8PCAzKTsgLy8gdHlwZT1yYXc9MFxuICAgIGNvbnN0IGJsb2NrSGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgaGVhZGVySW50ICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDgpICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDE2KSAmIDB4ZmYsXG4gICAgXSk7XG4gICAgYmxvY2tzLnB1c2goYmxvY2tIZWFkZXIpO1xuICAgIGlmIChibG9ja1NpemUgPiAwKSBibG9ja3MucHVzaChkYXRhLnN1YmFycmF5KHBvcywgcG9zICsgYmxvY2tTaXplKSk7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIGJyZWFrO1xuICB9XG4gIGNvbnN0IGZjcyA9IGRhdGEubGVuZ3RoO1xuICBjb25zdCBmaGQgPSAwYjEwMTBfMDAwMDsgLy8gRkNTX3NpemU9MTAgKDQgYnl0ZXMpIHwgU2luZ2xlX1NlZ21lbnQ9MVxuICBjb25zdCBoZWFkID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgIDB4MjgsIDB4YjUsIDB4MmYsIDB4ZmQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICBmaGQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZIRFxuICAgIGZjcyAmIDB4ZmYsIChmY3MgPj4+IDgpICYgMHhmZiwgKGZjcyA+Pj4gMTYpICYgMHhmZiwgKGZjcyA+Pj4gMjQpICYgMHhmZixcbiAgXSk7XG4gIGxldCB0b3RhbCA9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2ZmID0gMDtcbiAgb3V0LnNldChoZWFkLCBvZmYpOyBvZmYgKz0gaGVhZC5sZW5ndGg7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmYpOyBvZmYgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIENvbXBhbmlvbiBkZWNvZGVyIGZvciBvdXIgb3duIHdyaXRlciDigJQgdXNlZCBieSB0ZXN0cy4gQWNjZXB0cyBhbnkgenN0ZFxuLy8gZnJhbWUgd3JpdHRlbiBieSBgd3JhcFpzdGRgIChzaW5nbGUgUmF3X0Jsb2NrIHN0cmVhbSwgNC1ieXRlIEZDUyxcbi8vIHNpbmdsZS1zZWdtZW50LCBubyBjaGVja3N1bSwgbm8gZGljdCkuIFRocm93cyBvbiBhbnl0aGluZyBlbHNlIHNvIHRlc3RzXG4vLyBmYWlsIGxvdWRseSByYXRoZXIgdGhhbiBzaWxlbnRseSBtaXMtcGFyc2UuXG5leHBvcnQgY29uc3QgdW53cmFwWnN0ZCA9IChmcmFtZTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBpZiAoZnJhbWUubGVuZ3RoIDwgOSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBmcmFtZSB0b28gc2hvcnQnKTtcbiAgaWYgKGZyYW1lWzBdICE9PSAweDI4IHx8IGZyYW1lWzFdICE9PSAweGI1IHx8IGZyYW1lWzJdICE9PSAweDJmIHx8IGZyYW1lWzNdICE9PSAweGZkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBiYWQgbWFnaWMgbnVtYmVyJyk7XG4gIH1cbiAgY29uc3QgZmhkID0gZnJhbWVbNF0hO1xuICBjb25zdCBmY3NTaXplRmxhZyA9IChmaGQgPj4+IDYpICYgMGIxMTtcbiAgY29uc3Qgc2luZ2xlU2VnbWVudCA9ICgoZmhkID4+PiA1KSAmIDEpID09PSAxO1xuICBjb25zdCBjaGVja3N1bSA9ICgoZmhkID4+PiAyKSAmIDEpID09PSAxO1xuICBjb25zdCBkaWN0SWQgPSBmaGQgJiAwYjExO1xuICBpZiAoIXNpbmdsZVNlZ21lbnQpIHRocm93IG5ldyBFcnJvcignenN0ZDogb25seSBTaW5nbGVfU2VnbWVudCBmcmFtZXMgc3VwcG9ydGVkJyk7XG4gIGlmIChjaGVja3N1bSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBjb250ZW50IGNoZWNrc3VtIG5vdCBzdXBwb3J0ZWQnKTtcbiAgaWYgKGRpY3RJZCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBkaWN0aW9uYXJpZXMgbm90IHN1cHBvcnRlZCcpO1xuICBsZXQgcG9zID0gNTtcbiAgbGV0IGZjcyA9IDA7XG4gIGlmIChmY3NTaXplRmxhZyA9PT0gMGIwMCkgeyBmY3MgPSBmcmFtZVtwb3NdITsgcG9zICs9IDE7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDEpIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpOyBmY3MgKz0gMjU2OyBwb3MgKz0gMjsgfVxuICBlbHNlIGlmIChmY3NTaXplRmxhZyA9PT0gMGIxMCkgeyBmY3MgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KSB8IChmcmFtZVtwb3MgKyAzXSEgKiAweDEwMDAwMDApOyBwb3MgKz0gNDsgfVxuICBlbHNlIHRocm93IG5ldyBFcnJvcignenN0ZDogOC1ieXRlIEZDUyB1bnN1cHBvcnRlZCcpO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShmY3MpO1xuICBsZXQgb3V0UG9zID0gMDtcbiAgZm9yICg7Oykge1xuICAgIGlmIChwb3MgKyAzID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBoZWFkZXInKTtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KTtcbiAgICBwb3MgKz0gMztcbiAgICBjb25zdCBpc0xhc3QgPSAoaGVhZGVySW50ICYgMSkgPT09IDE7XG4gICAgY29uc3QgYmxvY2tUeXBlID0gKGhlYWRlckludCA+Pj4gMSkgJiAwYjExO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IChoZWFkZXJJbnQgPj4+IDMpICYgMHgxZl9mZl9mZjtcbiAgICBpZiAoYmxvY2tUeXBlICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoYHpzdGQ6IG9ubHkgUmF3X0Jsb2NrICgwKSBzdXBwb3J0ZWQsIGdvdCAke2Jsb2NrVHlwZX1gKTtcbiAgICBpZiAocG9zICsgYmxvY2tTaXplID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBwYXlsb2FkJyk7XG4gICAgb3V0LnNldChmcmFtZS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSksIG91dFBvcyk7XG4gICAgb3V0UG9zICs9IGJsb2NrU2l6ZTtcbiAgICBwb3MgKz0gYmxvY2tTaXplO1xuICAgIGlmIChpc0xhc3QpIGJyZWFrO1xuICB9XG4gIGlmIChvdXRQb3MgIT09IGZjcykgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBGQ1MgbWlzbWF0Y2ggKGdvdCAke291dFBvc30sIGV4cGVjdGVkICR7ZmNzfSlgKTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBUYXIgbGlzdGluZyBkZWNvZGVyICh0ZXN0LW9ubHkpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gV2Fsa3MgYSB0YXIgYnl0ZSBidWZmZXIsIHJldHVybmluZyB7bmFtZSwgZGF0YX0gZm9yIGVhY2ggZW50cnkuIFN0b3BzIGF0XG4vLyB0aGUgdHJhaWxlciAodHdvIHplcm8gYmxvY2tzKS4gT25seSByZWFkcyB0aGUgZmllbGRzIFBpbmNoR3JhYiB3cml0ZXMuXG5cbmV4cG9ydCB0eXBlIFBhcnNlZFRhckVudHJ5ID0ge25hbWU6IHN0cmluZzsgZGF0YTogVWludDhBcnJheTsgc2l6ZTogbnVtYmVyfTtcblxuY29uc3QgZGVjID0gbmV3IFRleHREZWNvZGVyKCk7XG5cbmNvbnN0IHJlYWROdWxsU3RyID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgbGV0IGVuZCA9IG9mZnNldCArIGxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IG9mZnNldDsgaSA8IG9mZnNldCArIGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA9PT0gMCkgeyBlbmQgPSBpOyBicmVhazsgfVxuICB9XG4gIHJldHVybiBkZWMuZGVjb2RlKGJ1Zi5zdWJhcnJheShvZmZzZXQsIGVuZCkpO1xufTtcblxuY29uc3QgcmVhZE9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgY29uc3QgcyA9IHJlYWROdWxsU3RyKGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpLnRyaW0oKTtcbiAgcmV0dXJuIHMgPyBwYXJzZUludChzLCA4KSA6IDA7XG59O1xuXG5leHBvcnQgY29uc3QgcGFyc2VUYXIgPSAoYnVmOiBVaW50OEFycmF5KTogUGFyc2VkVGFyRW50cnlbXSA9PiB7XG4gIGNvbnN0IGVudHJpZXM6IFBhcnNlZFRhckVudHJ5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgKyA1MTIgPD0gYnVmLmxlbmd0aCkge1xuICAgIGNvbnN0IGhlYWRlciA9IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIDUxMik7XG4gICAgbGV0IGFsbFplcm8gPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHsgaWYgKGhlYWRlcltpXSAhPT0gMCkgeyBhbGxaZXJvID0gZmFsc2U7IGJyZWFrOyB9IH1cbiAgICBpZiAoYWxsWmVybykgYnJlYWs7IC8vIHRyYWlsZXJcbiAgICBjb25zdCBzaG9ydE5hbWUgPSByZWFkTnVsbFN0cihoZWFkZXIsIDAsIDEwMCk7XG4gICAgY29uc3QgcHJlZml4ID0gcmVhZE51bGxTdHIoaGVhZGVyLCAzNDUsIDE1NSk7XG4gICAgY29uc3QgbmFtZSA9IHByZWZpeCA/IGAke3ByZWZpeH0vJHtzaG9ydE5hbWV9YCA6IHNob3J0TmFtZTtcbiAgICBjb25zdCBzaXplID0gcmVhZE9jdGFsKGhlYWRlciwgMTI0LCAxMik7XG4gICAgcG9zICs9IDUxMjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZSwgc2l6ZSwgZGF0YTogYnVmLnN1YmFycmF5KHBvcywgcG9zICsgc2l6ZSl9KTtcbiAgICAgIHBvcyArPSBzaXplO1xuICAgICAgY29uc3QgcGFkID0gKDUxMiAtIChzaXplICUgNTEyKSkgJSA1MTI7XG4gICAgICBwb3MgKz0gcGFkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZW50cmllcztcbn07XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIFRlbGxzIHRoZSBzaWRlcGFuZWwgd2hpY2ggdGVtcGxhdGUgcmVzb3VyY2VzIGV4aXN0IGluIHRoaXMgYnVpbGQuXG4vLyBBY3R1YWwgY29udGVudCBsaXZlcyBhcyAubWQgZmlsZXMgdW5kZXIgZXh0ZW5zaW9uL3RlbXBsYXRlcy8sIGxvYWRlZFxuLy8gbGF6aWx5IHZpYSBjaHJvbWUucnVudGltZS5nZXRVUkwg4oCUIHNlZSBsb2FkVGVtcGxhdGUoKSBpbiBzaWRlcGFuZWwudHMuXG5leHBvcnQgY29uc3QgVEVNUExBVEVTX1BSRVNFTlQgPSB7XCJkZXNpZ25UZW1wbGF0ZVwiOnRydWUsXCJza2lsbFRlbXBsYXRlXCI6dHJ1ZSxcImxvY2FsRGVzaWduXCI6dHJ1ZSxcImxvY2FsU2tpbGxcIjp0cnVlfSBhcyBjb25zdDtcbiIsCiAgICAiLy8gQXV0by1nZW5lcmF0ZWQgYnkgc2NyaXB0cy9idWlsZC1leHRlbnNpb24udHMg4oCUIGRvIG5vdCBlZGl0LlxuLy8gSW52ZW50b3J5IG9mIHZlbmRvcmVkIHNraWxsIHJlc291cmNlcyB1bmRlciBleHRlbnNpb24vc2tpbGxzLyAoc291cmNlIG9mXG4vLyB0cnV0aDogdGhpcmRfcGFydHkvKi9VUFNUUkVBTS5sb2NrIHZpYSBzY3JpcHRzL3N5bmMtYnVuZGxlZC1za2lsbHMudHMpLlxuLy8gYGV4dGAgaXMgdGhlIGV4dGVuc2lvbi1yZWxhdGl2ZSBmZXRjaCBwYXRoOyBgYXJjaGl2ZWAgaXMgd2hlcmUgdGhlIGZpbGVcbi8vIGxhbmRzIGluc2lkZSBhbiBleHBvcnRlZCAudGFyLnpzdCBidW5kbGUuXG5leHBvcnQgY29uc3QgQlVORExFRF9TS0lMTFNfUFJFU0VOVCA9IHRydWU7XG5leHBvcnQgdHlwZSBCdW5kbGVkU2tpbGxGaWxlID0ge2V4dDogc3RyaW5nOyBhcmNoaXZlOiBzdHJpbmc7IGJ5dGVzOiBudW1iZXJ9O1xuZXhwb3J0IGNvbnN0IEJVTkRMRURfU0tJTExfRklMRVM6IEJ1bmRsZWRTa2lsbEZpbGVbXSA9IFtcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwMzA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5uYXRpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5uYXRpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDM5MTBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuZHJvaWQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmRyb2lkLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMjI0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmltYXRlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5pbWF0ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA3MDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDc0MzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODMxM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYm9sZGVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYm9sZGVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3MDkyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9icmFuZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JyYW5kLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDQ3N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY2xhcmlmeS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NsYXJpZnkubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNjQ2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2RleC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvZGV4Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA3MDAyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2xvcml6ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvbG9yaXplLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMzU2OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JhZnQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcmFmdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTE5NDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyaXRpcXVlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JpdGlxdWUubWRcIixcbiAgICBcImJ5dGVzXCI6IDQxMjk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kZWxpZ2h0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGVsaWdodC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTgyN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGlzdGlsbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2Rpc3RpbGwubWRcIixcbiAgICBcImJ5dGVzXCI6IDU3NDBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RvY3VtZW50Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZG9jdW1lbnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3OTY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9leHRyYWN0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZXh0cmFjdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzQzMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaGFyZGVuLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaGFyZGVuLm1kXCIsXG4gICAgXCJieXRlc1wiOiA4NTk0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ob29rcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hvb2tzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MjU2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbml0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW5pdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTg5NTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2ludGVyYWN0aW9uLWRlc2lnbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2ludGVyYWN0aW9uLWRlc2lnbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjU3NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW9zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW9zLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMDM3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9sYXlvdXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9sYXlvdXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDExNzkwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9saXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjAxNTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29uYm9hcmQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vbmJvYXJkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NzQwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vcHRpbWl6ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29wdGltaXplLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NTk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vdmVyZHJpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vdmVyZHJpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDkxMzlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3BvbGlzaC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3BvbGlzaC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTI5NTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3Byb2R1Y3QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wcm9kdWN0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNzU4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9xdWlldGVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcXVpZXRlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDkxMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvc2hhcGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9zaGFwZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTE1MjNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3R5cGVzZXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS90eXBlc2V0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNzEzNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9MSUNFTlNFXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9MSUNFTlNFXCIsXG4gICAgXCJieXRlc1wiOiAxMDc2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9OT1RJQ0UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL05PVElDRS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTAzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9tYXJrZXRwbGFjZS5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vbWFya2V0cGxhY2UuanNvblwiLFxuICAgIFwiYnl0ZXNcIjogMTE5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vcGx1Z2luLmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9wbHVnaW4uanNvblwiLFxuICAgIFwiYnl0ZXNcIjogNzU1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0ZVTkRJTkcueW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9GVU5ESU5HLnltbFwiLFxuICAgIFwiYnl0ZXNcIjogNDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZGVzaWduLXN5c3RlbS1wcm9maWxlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9kZXNpZ24tc3lzdGVtLXByb2ZpbGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI4MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9mcmFtZXdvcmstY29ycmVjdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZnJhbWV3b3JrLWNvcnJlY3Rpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDM4OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9sZWFybmluZy1zdWJtaXNzaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9sZWFybmluZy1zdWJtaXNzaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbmV3LWhldXJpc3RpYy1ydWxlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9uZXctaGV1cmlzdGljLXJ1bGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9QVUxMX1JFUVVFU1RfVEVNUExBVEUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL1BVTExfUkVRVUVTVF9URU1QTEFURS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDQyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aWdub3JlXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGlnbm9yZVwiLFxuICAgIFwiYnl0ZXNcIjogNjY1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSEFOR0VMT0cubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSEFOR0VMT0cubWRcIixcbiAgICBcImJ5dGVzXCI6IDEzMTUwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSVRBVElPTi5jZmZcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSVRBVElPTi5jZmZcIixcbiAgICBcImJ5dGVzXCI6IDEyMTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPREVfT0ZfQ09ORFVDVC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPREVfT0ZfQ09ORFVDVC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjc0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRJTkcubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRJTkcubWRcIixcbiAgICBcImJ5dGVzXCI6IDU1NjFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVE9SUy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVE9SUy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9MSUNFTlNFXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTElDRU5TRVwiLFxuICAgIFwiYnl0ZXNcIjogMTE1NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTk9USUNFXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTk9USUNFXCIsXG4gICAgXCJieXRlc1wiOiA0NTgyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9SRUFETUUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9SRUFETUUubWRcIixcbiAgICBcImJ5dGVzXCI6IDIxNzA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbGwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbGwubWRcIixcbiAgICBcImJ5dGVzXCI6IDMxODJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FuYWx5emUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbmFseXplLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDc3NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvZXZhbHVhdGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9ldmFsdWF0ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjgzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvc29sdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9zb2x2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTYxM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvYW50aS1wYXR0ZXJucy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2FudGktcGF0dGVybnMubWRcIixcbiAgICBcImJ5dGVzXCI6IDI2NzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2NvbnN0aXR1dGlvbmFsLWNvbnN0cmFpbnRzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvY29uc3RpdHV0aW9uYWwtY29uc3RyYWludHMubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ1OTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL291dHB1dC1zY2hlbWEubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9vdXRwdXQtc2NoZW1hLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDUxOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcGZkLWxheWVyLXJ1YnJpYy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BmZC1sYXllci1ydWJyaWMubWRcIixcbiAgICBcImJ5dGVzXCI6IDExMjk2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wc3ljaG9sb2d5L212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BzeWNob2xvZ3kvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMzQyNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvdGllcjItcHJvbXB0LXRlbXBsYXRlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvdGllcjItcHJvbXB0LXRlbXBsYXRlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNTg4OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3Nob3BpZnktdGhlbWVzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3Nob3BpZnktdGhlbWVzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzAzM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3RhaWx3aW5kLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3RhaWx3aW5kLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzQ5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3dvcmRwcmVzcy10aGVtZXMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvd29yZHByZXNzLXRoZW1lcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjIyNDZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9mb3VuZGF0aW9uLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvZm91bmRhdGlvbi1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAzMzg4MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wxLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDEtcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMzYxMzlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMi1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wyLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDM5MjUyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDMtcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMy1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAyMTY3N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2w0LXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDQtcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMjQ4MDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtY3Jvc3MtbGF5ZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWNyb3NzLWxheWVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyODU1NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1leGNlbGxlbnQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWV4Y2VsbGVudC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTcwMjhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZ29vZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZ29vZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjEzMzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtbWVkaW9jcmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLW1lZGlvY3JlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNDM3N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1wb29yLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1wb29yLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNjEzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS10ZXJyaWJsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdGVycmlibGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDIwMTk0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXVuY29udmVudGlvbmFsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS11bmNvbnZlbnRpb25hbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjM2MzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9BREhELUNVUkItQ1VULm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL0FESEQtQ1VSQi1DVVQubWRcIixcbiAgICBcImJ5dGVzXCI6IDUzMDVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9QRVJDRVBUSU9OLUZJUlNULURFU0lHTi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9QRVJDRVBUSU9OLUZJUlNULURFU0lHTi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTg3NzBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2xsbXMudHh0XCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vbGxtcy50eHRcIixcbiAgICBcImJ5dGVzXCI6IDY1NDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NjcmlwdHMvZ2VuLXBmZC1pbmRleC5weVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NjcmlwdHMvZ2VuLXBmZC1pbmRleC5weVwiLFxuICAgIFwiYnl0ZXNcIjogNDU0OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5MjU5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvYWNjdW11bGF0ZWQtbGVhcm5pbmdzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2FjY3VtdWxhdGVkLWxlYXJuaW5ncy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzIyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvY2l0YXRpb24tc3RhbmRhcmRzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2NpdGF0aW9uLXN0YW5kYXJkcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTM0MzFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9pbnNpZ2h0cy1sb2cubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvaW5zaWdodHMtbG9nLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NDJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDAvbDAxOC1iYWNrZW5kLW1lY2hhbmljcy1hcy1mcm9udGVuZC1jb21wbGV4aXR5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMC9sMDE4LWJhY2tlbmQtbWVjaGFuaWNzLWFzLWZyb250ZW5kLWNvbXBsZXhpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDM2MTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDEvbDAxMS12aXN1YWwtY2hhbm5lbC1hdWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDEvbDAxMS12aXN1YWwtY2hhbm5lbC1hdWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzE0OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDEzLWtleWJvYXJkLWRlbnNpdHktaXMtbDIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTMta2V5Ym9hcmQtZGVuc2l0eS1pcy1sMi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTQ1MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDE2LW5lYXItbWlzcy1jb2xvci1hc3ltbWV0cnkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTYtbmVhci1taXNzLWNvbG9yLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjEzNlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDI0LWFhLWNvbnN0cmFpbmVkLXRva2VuLWxhZGRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAyNC1hYS1jb25zdHJhaW5lZC10b2tlbi1sYWRkZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDUwMzBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDMvbDAyMy1mYWxzaWZpYWJpbGl0eS10cmlhZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDMvbDAyMy1mYWxzaWZpYWJpbGl0eS10cmlhZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDY5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDAzLXByZS1zZW5kLXZzLXBvc3QtcmVzcG9uc2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDMtcHJlLXNlbmQtdnMtcG9zdC1yZXNwb25zZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDYtaW5mcmFzdHJ1Y3R1cmUtdnMtYWN0aXZhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwNi1pbmZyYXN0cnVjdHVyZS12cy1hY3RpdmF0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwOC1lcGlzdGVtaWMtYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA4LWVwaXN0ZW1pYy1hc3ltbWV0cnkubWRcIixcbiAgICBcImJ5dGVzXCI6IDg5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDIyLWw0LXN5bW1ldHJ5LXRocmVzaG9sZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAyMi1sNC1zeW1tZXRyeS10aHJlc2hvbGQubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ1MjBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX2luZGV4Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9faW5kZXgubWRcIixcbiAgICBcImJ5dGVzXCI6IDM3MzRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX3NlYXJjaC5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9fc2VhcmNoLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDE0MTA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMDktdGVtcG9yYWwtc2Vzc2lvbi1jb250aW51aXR5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDA5LXRlbXBvcmFsLXNlc3Npb24tY29udGludWl0eS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTY5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTItcm91dGUtdnMtc3VydmV5LWtub3dsZWRnZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxMi1yb3V0ZS12cy1zdXJ2ZXkta25vd2xlZGdlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MzlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxNS1leHBlcmllbnRpYWwtc2VsZi1jb250cmFkaWN0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE1LWV4cGVyaWVudGlhbC1zZWxmLWNvbnRyYWRpY3Rpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDE2NThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxOS1tdWx0aS1hcnRpZmFjdC1lbmdhZ2VtZW50LWZpZWxkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE5LW11bHRpLWFydGlmYWN0LWVuZ2FnZW1lbnQtZmllbGQubWRcIixcbiAgICBcImJ5dGVzXCI6IDU0OTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyMS1sNC1ldGhpY3MtZnVzaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDIxLWw0LWV0aGljcy1mdXNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDQxMTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNS1jYXNjYWRlLWNyZWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNS1jYXNjYWRlLWNyZWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTQxNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI2LWFlc3RoZXRpYy1zdGFiaWxpdHktYXMtdHJ1c3QtcHJvZHVjZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjYtYWVzdGhldGljLXN0YWJpbGl0eS1hcy10cnVzdC1wcm9kdWNlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTgwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI4LWhlbGQtZGVjaXNpb24tY29tcG91bmRpbmcubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjgtaGVsZC1kZWNpc2lvbi1jb21wb3VuZGluZy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTI3NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDEtZ2VuZXJhdGl2ZS12cy1ldmFsdWF0aXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDEtZ2VuZXJhdGl2ZS12cy1ldmFsdWF0aXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAyLWFjY2Vzcy12cy1zaWduYWwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMi1hY2Nlc3MtdnMtc2lnbmFsLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA0LXdvcmtzcGFjZS12cy1wcm9kdWN0LXNlcGFyYXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNC13b3Jrc3BhY2UtdnMtcHJvZHVjdC1zZXBhcmF0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA1LXJlY3Vyc2l2ZS12YWxpZGF0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDUtcmVjdXJzaXZlLXZhbGlkYXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDY2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDctY29udmVyZ2VudC1nYXAtaWRlbnRpZmljYXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNy1jb252ZXJnZW50LWdhcC1pZGVudGlmaWNhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTE4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxMC1jb25zdHJhaW50cy1hcmUtZGlzdHJpYnV0aW9ucy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDEwLWNvbnN0cmFpbnRzLWFyZS1kaXN0cmlidXRpb25zLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNC1vcGVyYXRpb25hbC12cy1zdHJ1Y3R1cmFsLWV0aGljcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE0LW9wZXJhdGlvbmFsLXZzLXN0cnVjdHVyYWwtZXRoaWNzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNTI0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNy1pdGVyYXRpdmUtcmVncmVzc2lvbi1pcy12aXNpYmlsaXR5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTctaXRlcmF0aXZlLXJlZ3Jlc3Npb24taXMtdmlzaWJpbGl0eS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDczN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjAtaW50ZXJuYXRpb25hbC1jaXRhdGlvbi1leHBhbnNpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyMC1pbnRlcm5hdGlvbmFsLWNpdGF0aW9uLWV4cGFuc2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTY2NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjctaW50ZXJuYWwtYWNrbm93bGVkZ21lbnQtc2lnbmFscy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI3LWludGVybmFsLWFja25vd2xlZGdtZW50LXNpZ25hbHMubWRcIixcbiAgICBcImJ5dGVzXCI6IDY3MTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI5LXBvcnQtZG9udC1pbnN0YWxsLW1vdGlvbi1hdWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI5LXBvcnQtZG9udC1pbnN0YWxsLW1vdGlvbi1hdWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjAyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5Nzg1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcGZkLXNwYXRpYWwtZXh0ZW5zaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3BmZC1zcGF0aWFsLWV4dGVuc2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjk1NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3ByYWN0aXRpb25lci1jb3JyZWN0aW9ucy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wcmFjdGl0aW9uZXItY29ycmVjdGlvbnMubWRcIixcbiAgICBcImJ5dGVzXCI6IDY2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvc2tpbGxzLWluZGV4Lmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJza2lsbHMtaW5kZXguanNvblwiLFxuICAgIFwiYnl0ZXNcIjogMTAxMTNcbiAgfVxuXTtcbiIsCiAgICAiLy8gU2VuZC10by1BZ2VudCBwcm9tcHQgKyBwcm90b2NvbCBidWlsZGVycy5cbi8vXG4vLyBUd28gYXJ0aWZhY3RzLCBvbmUgZG9jdHJpbmU6XG4vLyAgIOKAoiBidWlsZEFnZW50UHJvbXB0SnNvbmwg4oCUIHRoZSBKU09OTCBjbGlwYm9hcmQgcGF5bG9hZCBjb3BpZWQgd2hlbiB0aGVcbi8vICAgICB1c2VyIGNsaWNrcyBcIlNlbmQgdG8gQWdlbnRcIi4gTmluZSBkZW5zZSBsaW5lczogaGVhZGVyLCBpbnN0cnVjdGlvbixcbi8vICAgICBpZGVtcG90ZW50IGJhc2ggYm9vdHN0cmFwLCBtYW5kYXRvcnkgZnVsbC1yZWFkIGZpbGUgbGlzdCwgYnVuZGxlXG4vLyAgICAgdHJlZSwgb3JjaGVzdHJhdGlvbiBwaGFzZXMsIGNvbmRpdGlvbmFsIHN0b2NrLURFU0lHTiB3YXJuaW5nLFxuLy8gICAgIHJlY2FwdHVyZSB2ZXJpZmljYXRpb24sIGRvbmUtY3JpdGVyaWEuXG4vLyAgIOKAoiBidWlsZEFnZW50UHJvdG9jb2xNZCDigJQgQUdFTlQtUFJPVE9DT0wubWQgaW5zaWRlIGV2ZXJ5IGJ1bmRsZTogdGhlXG4vLyAgICAgZnVsbCBleHBhbnNpb24gb2YgdGhlIHNhbWUgZG9jdHJpbmUsIHNvIGEgbG9zdCBjbGlwYm9hcmQgZGVncmFkZXMgdG9cbi8vICAgICBcImV4dHJhY3QgdGhlIGFyY2hpdmUgYW5kIHJlYWQgQUdFTlQtUFJPVE9DT0wubWRcIi5cbi8vXG4vLyBIeWRyYXRpb24gY29udmVudGlvbnMgKG1pcnJvcmVkIGluIHRoZSBkb2NzKTpcbi8vICAg4oCiIHZhbHVlcyBiYWtlZCBpbiBhdCBleHBvcnQgdGltZSBjb21lIGZyb20gdGhlIG9wdGlvbnMgb2JqZWN0XG4vLyAgICAgKHdvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmUgcGF0aCwgZXhwb3J0IHRpbWVzdGFtcCwgdGFyIGVudHJpZXMpO1xuLy8gICDigKIgPEFOR0xFX1RPS0VOUz4gYXJlIGxlZnQgdmVyYmF0aW0gZm9yIHRoZSBSRUNFSVZJTkcgYWdlbnQgdG8gaW5mZXJcbi8vICAgICAoPFBST0pFQ1RfUk9PVD4sIDxBUFBfVVJMPiwgPEZFRURCQUNLX1VJRD4sIDxydW5JZD4sIDxBUkNISVZFX1BBVEg+KS5cbi8vXG4vLyBEZXRlcm1pbmlzbSBjb250cmFjdDogaWRlbnRpY2FsIGlucHV0cyDihpIgaWRlbnRpY2FsIG91dHB1dCBzdHJpbmdzLiBOb1xuLy8gRGF0ZS5ub3coKS9NYXRoLnJhbmRvbSgpIGluIGhlcmUg4oCUIHRoZSBleHBvcnQgY2xvY2sgYXJyaXZlcyB2aWEgb3B0cy5cbi8vIG5vZGUtdGVzdGFibGUgKG5vIGJyb3dzZXIgQVBJcyk7IGNvbnN1bWVkIGJ5IHNpZGVwYW5lbC50cyBhdCBleHBvcnQgdGltZS5cblxuLyoqIFBlcnNpc3RlbmNlIHJvb3QgZm9yIGEgd29ya3NwYWNlLCBhcyB0aGUgcmVjZWl2aW5nIGFnZW50IHNlZXMgaXQuICovXG5leHBvcnQgY29uc3Qgd29ya3NwYWNlUm9vdCA9ICh3b3Jrc3BhY2UpID0+IGB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8ke3dvcmtzcGFjZX1gO1xuXG4vKiogRXh0cmFjdGlvbiBkaXIgZm9yIGEgYnVuZGxlIGluc2lkZSB0aGUgcGVyc2lzdGVuY2Ugcm9vdC4gKi9cbmV4cG9ydCBjb25zdCBleHRyYWN0RGlyID0gKHdvcmtzcGFjZSwgYnVuZGxlSWQpID0+XG4gIGAke3dvcmtzcGFjZVJvb3Qod29ya3NwYWNlKX0vYnVuZGxlcy8ke2J1bmRsZUlkfS9leHRyYWN0ZWRgO1xuXG4vLyBTaW5nbGUtcXVvdGUtc2FmZSBpbnRlcnBvbGF0aW9uIGZvciBiYXNoOiAnaXQnXFwnJ3MnIHN1cnZpdmVzIGFueSBpbnB1dC5cbmNvbnN0IHNxID0gKHYpID0+IFN0cmluZyh2KS5yZXBsYWNlKC8nL2csIFwiJ1xcXFwnJ1wiKTtcblxuLyoqXG4gKiBJZGVtcG90ZW50IGJhc2ggYm9vdHN0cmFwLiBgYXJjaGl2ZVBhdGhgIGlzIHRoZSBoeWRyYXRlZCBhYnNvbHV0ZSBwYXRoIG9mXG4gKiB0aGUgLnRhci56c3Qgb24gdGhlIG9wZXJhdG9yJ3MgbWFjaGluZTsgcGFzcyB0aGUgbGl0ZXJhbCB0b2tlblxuICogJzxBUkNISVZFX1BBVEg+JyB0byBlbWl0IHRoZSB0b2tlbml6ZWQgY29weSBzaGlwcGVkIGluIEFHRU5ULVBST1RPQ09MLm1kLlxuICpcbiAqIFRoZSBzY3JpcHQgc2VsZi1ub3JtYWxpemVzIHRoZSBhcmNoaXZlIHBhdGggc28gXCJleGVjdXRlIGV4YWN0bHkgYXNcbiAqIHdyaXR0ZW5cIiBzdGF5cyB0cnVlIGV2ZXJ5d2hlcmUgdGhlIG9wZXJhdG9yJ3MgYnJvd3NlciBhbmQgYWdlbnQgY2FuXG4gKiBkaXNhZ3JlZSBhYm91dCBwYXRoIHNoYXBlOiBhIGxlYWRpbmcgfiBpcyBleHBhbmRlZCwgYW5kIGEgV2luZG93c1xuICogZHJpdmUgcGF0aCAoQ2hyb21lIG9uIFdpbmRvd3MgKyBhZ2VudCBpbiBXU0wvR2l0LUJhc2gpIGlzIGNvbnZlcnRlZFxuICogdmlhIHdzbHBhdGgsIGN5Z3BhdGgsIG9yIGEgbWFudWFsIC9tbnQvPGRyaXZlPiBmYWxsYmFjay5cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkQm9vdHN0cmFwU2NyaXB0ID0gKHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aCwgZXhwb3J0VHN9KSA9PiBbXG4gICcjIS91c3IvYmluL2VudiBiYXNoJyxcbiAgJyMgUGluY2hHcmFiIGJvb3RzdHJhcCDigJQgaWRlbXBvdGVudDsgc2FmZSB0byByZS1ydW4uJyxcbiAgJ3NldCAtZXVvIHBpcGVmYWlsJyxcbiAgYFdTPScke3NxKHdvcmtzcGFjZSl9J2AsXG4gIGBCSUQ9JyR7c3EoYnVuZGxlSWQpfSdgLFxuICBgU1JDPScke3NxKGFyY2hpdmVQYXRoKX0nYCxcbiAgJyMgTm9ybWFsaXplIHRoZSBhcmNoaXZlIHBhdGg6IGV4cGFuZCBhIGxlYWRpbmcgfiAoY2xpcGJvYXJkIG1heSBjYXJyeSB0aGUnLFxuICAnIyB+L0Rvd25sb2FkcyBmb3JtKSBhbmQgdHJhbnNsYXRlIFdpbmRvd3MgZHJpdmUgcGF0aHMgZm9yIFdTTC9HaXQtQmFzaC4nLFxuICAnU1JDPVwiJHtTUkMvI1xcXFx+LyRIT01FfVwiJyxcbiAgJ2Nhc2UgXCIkU1JDXCIgaW4nLFxuICAnICBbQS1aYS16XTpbXFxcXFxcXFwvXSopJyxcbiAgJyAgICBpZiBjb21tYW5kIC12IHdzbHBhdGggPi9kZXYvbnVsbCAyPiYxOyB0aGVuIFNSQz1cIiQod3NscGF0aCAtdSBcIiRTUkNcIilcIjsnLFxuICAnICAgIGVsaWYgY29tbWFuZCAtdiBjeWdwYXRoID4vZGV2L251bGwgMj4mMTsgdGhlbiBTUkM9XCIkKGN5Z3BhdGggLXUgXCIkU1JDXCIpXCI7JyxcbiAgJyAgICBlbHNlJyxcbiAgJyAgICAgIGRyaXZlPVwiJChwcmludGYgJXMgXCIke1NSQyUlOip9XCIgfCB0ciBcIls6dXBwZXI6XVwiIFwiWzpsb3dlcjpdXCIpXCInLFxuICAnICAgICAgcmVzdD1cIiR7U1JDIyo6fVwiOyByZXN0PVwiJHtyZXN0Ly9cXFxcXFxcXC8vfVwiJyxcbiAgJyAgICAgIFNSQz1cIi9tbnQvJGRyaXZlJHJlc3RcIicsXG4gICcgICAgZmk7OycsXG4gICdlc2FjJyxcbiAgJ1JPT1Q9XCIkSE9NRS8ucGluY2hncmFiL3dvcmtzcGFjZXMvJFdTXCInLFxuICAnREVTVD1cIiRST09UL2J1bmRsZXMvJEJJRFwiJyxcbiAgJ2lmIFsgLWYgXCIkREVTVC8uZXh0cmFjdGVkXCIgXSAmJiBbIFwiJChjYXQgXCIkREVTVC8uZXh0cmFjdGVkXCIpXCIgPSBcIiRCSURcIiBdOyB0aGVuJyxcbiAgJyAgZWNobyBcImFscmVhZHktZXh0cmFjdGVkICRERVNUL2V4dHJhY3RlZFwiJyxcbiAgJ2Vsc2UnLFxuICAnICBta2RpciAtcCBcIiRERVNUL2V4dHJhY3RlZFwiIFwiJFJPT1QvcGxhbnMvJEJJRFwiIFwiJFJPT1QvYXVkaXRzLyRCSURcIiBcIiRST09UL3JlY2FwdHVyZXNcIicsXG4gICcgIGlmIHRhciAtLXpzdGQgLXhmIFwiJFNSQ1wiIC1DIFwiJERFU1QvZXh0cmFjdGVkXCIgMj4vZGV2L251bGw7IHRoZW4gOjsgZWxzZScsXG4gICcgICAgenN0ZCAtZGMgXCIkU1JDXCIgfCB0YXIgLXggLUMgXCIkREVTVC9leHRyYWN0ZWRcIicsXG4gICcgIGZpJyxcbiAgJyAgY3AgLWYgXCIkU1JDXCIgXCIkREVTVC9idW5kbGUudGFyLnpzdFwiJyxcbiAgJyAgcHJpbnRmIFxcJyVzXFwnIFwiJEJJRFwiID4gXCIkREVTVC8uZXh0cmFjdGVkXCInLFxuICAnICBlY2hvIFwiZXh0cmFjdGVkICRERVNUL2V4dHJhY3RlZFwiJyxcbiAgJ2ZpJyxcbiAgYFsgLWYgXCIkUk9PVC93b3JrLW1hbmlmZXN0Lmpzb25sXCIgXSB8fCBwcmludGYgJyVzXFxcXG4nICd7XCJ2XCI6MSxcInR5cGVcIjpcIndvcmstbWFuaWZlc3QtaGVhZGVyXCIsXCJ0b29sXCI6XCJwaW5jaGdyYWJcIixcIndvcmtzcGFjZVwiOlwiJHt3b3Jrc3BhY2V9XCIsXCJjcmVhdGVkXCI6XCIke2V4cG9ydFRzfVwifScgPiBcIiRST09UL3dvcmstbWFuaWZlc3QuanNvbmxcImAsXG4gICdlY2hvIFwid29ya2RpciAkUk9PVFwiJyxcbl0uam9pbignXFxuJyk7XG5cbi8qKlxuICogUmVuZGVyIHRoZSBidW5kbGUncyB0YXIgZW50cnkgbmFtZXMgYXMgYW4gaW5kZW50ZWQgdHJlZS4gQ29sbGFwc2UgcnVsZXNcbiAqIGtlZXAgdGhlIGNsaXBib2FyZCBkZW5zZSBXSVRIT1VUIGhpZGluZyBzdHJ1Y3R1cmUgdGhlIHByb3RvY29sIGNpdGVzXG4gKiAoYSBuYWl2ZSBzaXplLWJhc2VkIGNvbGxhcHNlIGZvbGRlZCB0aGUgd2hvbGUgYC5hZ2VudHMvYCBza2lsbCB0cmVlIGludG9cbiAqIG9uZSBvcGFxdWUgbGluZSk6XG4gKiAgIOKAoiBhIGRpcmVjdG9yeSBjb2xsYXBzZXMgdG8gYGRpci8gKE4gZmlsZXMpYCBvbmx5IHdoZW4gaXQgaXMgRkxBVFxuICogICAgIChubyBzdWJkaXJlY3RvcmllcykgYW5kIGhvbGRzIG1vcmUgdGhhbiBgY29sbGFwc2VBdGAgZmlsZXMg4oCUXG4gKiAgICAgc2NyZWVuc2hvdHMvLCBpbXBlY2NhYmxlJ3MgcmVmZXJlbmNlLyDigJQgb3Igd2hlbiBpdCBzaXRzIGF0XG4gKiAgICAgYGNvbGxhcHNlRGVwdGhgIG9yIGRlZXBlciwgd2hlcmUgZGV0YWlsIHN0b3BzIHBheWluZyBmb3IgaXRzZWxmO1xuICogICDigKIgc3RydWN0dXJlZCBkaXJlY3RvcmllcyBhcmUgZGVzY2VuZGVkIHNvIHRoZWlyIHNraWxsL2xvY2F0b3IgbGF5b3V0XG4gKiAgICAgc3RheXMgdmlzaWJsZS5cbiAqIE91dHB1dCBpcyBjYXBwZWQgYXQgYG1heExpbmVzYCB3aXRoIGEgYOKApiArTiBtb3JlYCB0YWlsIGFzIGEgYmFja3N0b3AuXG4gKiBEZXRlcm1pbmlzdGljOiBlbnRyaWVzIGFyZSBzb3J0ZWQuXG4gKi9cbmV4cG9ydCBjb25zdCByZW5kZXJCdW5kbGVUcmVlID0gKGVudHJ5TmFtZXMsIHtjb2xsYXBzZUF0ID0gOCwgY29sbGFwc2VEZXB0aCA9IDMsIG1heExpbmVzID0gMTIwfSA9IHt9KSA9PiB7XG4gIC8vIEJ1aWxkIGEgbmVzdGVkIHtkaXJzOiBNYXAsIGZpbGVzOiBbXX0gc3RydWN0dXJlLlxuICBjb25zdCByb290Tm9kZSA9IHtkaXJzOiBuZXcgTWFwKCksIGZpbGVzOiBbXX07XG4gIGZvciAoY29uc3QgbmFtZSBvZiBbLi4uZW50cnlOYW1lc10uc29ydCgpKSB7XG4gICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KCcvJyk7XG4gICAgbGV0IG5vZGUgPSByb290Tm9kZTtcbiAgICBmb3IgKGNvbnN0IGRpciBvZiBwYXJ0cy5zbGljZSgwLCAtMSkpIHtcbiAgICAgIGlmICghbm9kZS5kaXJzLmhhcyhkaXIpKSBub2RlLmRpcnMuc2V0KGRpciwge2RpcnM6IG5ldyBNYXAoKSwgZmlsZXM6IFtdfSk7XG4gICAgICBub2RlID0gbm9kZS5kaXJzLmdldChkaXIpO1xuICAgIH1cbiAgICBub2RlLmZpbGVzLnB1c2gocGFydHNbcGFydHMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGNvbnN0IGNvdW50RmlsZXMgPSAobm9kZSkgPT4gbm9kZS5maWxlcy5sZW5ndGggKyBbLi4ubm9kZS5kaXJzLnZhbHVlcygpXS5yZWR1Y2UoKGEsIGQpID0+IGEgKyBjb3VudEZpbGVzKGQpLCAwKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgY29uc3QgZW1pdCA9IChub2RlLCBkZXB0aCkgPT4ge1xuICAgIGNvbnN0IHBhZCA9ICcgICcucmVwZWF0KGRlcHRoKTtcbiAgICBmb3IgKGNvbnN0IFtkaXIsIGNoaWxkXSBvZiBbLi4ubm9kZS5kaXJzLmVudHJpZXMoKV0uc29ydCgoW2FdLCBbYl0pID0+IChhIDwgYiA/IC0xIDogMSkpKSB7XG4gICAgICBjb25zdCB0b3RhbCA9IGNvdW50RmlsZXMoY2hpbGQpO1xuICAgICAgY29uc3QgZmxhdCA9IGNoaWxkLmRpcnMuc2l6ZSA9PT0gMDtcbiAgICAgIC8vIGBjaGlsZGAgcmVuZGVycyBhdCB0aGlzIGBkZXB0aGAgKGVtaXQncyBkZXB0aCBpcyB0aGUgcGFkIGxldmVsIG9mXG4gICAgICAvLyBub2RlJ3Mgb3duIGNoaWxkcmVuKS5cbiAgICAgIGlmICgoZmxhdCAmJiB0b3RhbCA+IGNvbGxhcHNlQXQpIHx8IGRlcHRoID49IGNvbGxhcHNlRGVwdGgpIHtcbiAgICAgICAgbGluZXMucHVzaChgJHtwYWR9JHtkaXJ9LyAoJHt0b3RhbH0gZmlsZXMpYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lcy5wdXNoKGAke3BhZH0ke2Rpcn0vYCk7XG4gICAgICAgIGVtaXQoY2hpbGQsIGRlcHRoICsgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBub2RlLmZpbGVzKSBsaW5lcy5wdXNoKGAke3BhZH0ke2Z9YCk7XG4gIH07XG4gIGVtaXQocm9vdE5vZGUsIDApO1xuICBpZiAobGluZXMubGVuZ3RoID4gbWF4TGluZXMpIHtcbiAgICBjb25zdCBkcm9wcGVkID0gbGluZXMubGVuZ3RoIC0gbWF4TGluZXM7XG4gICAgcmV0dXJuIFsuLi5saW5lcy5zbGljZSgwLCBtYXhMaW5lcyksIGDigKYgKyR7ZHJvcHBlZH0gbW9yZWBdLmpvaW4oJ1xcbicpO1xuICB9XG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbn07XG5cbi8vIEJ1bmRsZSBmaWxlcyB3aG9zZSBwcmVzZW5jZSBnYXRlcyBhIG1hbmRhdG9yeS1yZWFkIHBhdGggLyBwcm9tcHQgbGluZS5cbmNvbnN0IFBJTkNIR1JBQl9TS0lMTF9QQVRIID0gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCc7XG5jb25zdCBQRkRfU0tJTExfUEFUSCA9ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kJztcbmNvbnN0IFNLSUxMU19JTkRFWF9QQVRIID0gJ3NraWxscy1pbmRleC5qc29uJztcblxuLy8g4pSA4pSA4pSAIEJ1bmRsZSB0b2tlbiBhY2NvdW50aW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gVGhlIGJ1bmRsZSdzIGJ5dGUgd2VpZ2h0IGlzIGRvbWluYXRlZCBieSByZWFkLWxhemlseSBzY2FmZm9sZGluZyAodGhlIH4xLjIgTUJcbi8vIG9mIHZlbmRvcmVkIHNraWxscywgbGljZW5zZXMsIHNjcmVlbnNob3RzLCBnZW5lcmF0ZWQgaW5kZXhlcykuIFRoZSBcInNpZ25hbFwiXG4vLyDigJQgd2hhdCBhbiBhZ2VudCBhY3R1YWxseSByZWFkcyBlbmQtdG8tZW5kIHVwIGZyb250IOKAlCBpcyBhIHNtYWxsIHN1YnNldC4gV2Vcbi8vIHNoaXAgYSBidW5kbGUgLmdpdGlnbm9yZSBtYXJraW5nIHRoZSBsYXp5IHNldCBzbyB0b2tlbiBlc3RpbWF0b3JzIGRpc2NvdW50XG4vLyBpdCwgYW5kIHJlcG9ydCBzaWduYWwtdnMtdG90YWwgaW4gdGhlIG1hbmlmZXN0LiBUaGUgYm9vdHN0cmFwL0FHRU5ULVBST1RPQ09MXG4vLyB3YXJucyB0aGUgYWdlbnQgTk9UIHRvIGhvbm9yIHRoZSBpZ25vcmUgdG9vIHN0cmljdGx5IChtYXBwZWQgc2tpbGxzIGFyZVxuLy8gc3RpbGwgcmVhZCBvbiBkZW1hbmQpLlxuXG4vKiogRmlsZXMgdGhlIGFnZW50IHJlYWRzIFVQIEZST05UIOKAlCB0aGUgdG9rZW4gXCJzaWduYWxcIi4gKi9cbmV4cG9ydCBjb25zdCBTSUdOQUxfUEFUSFMgPSBbXG4gICdBR0VOVC1QUk9UT0NPTC5tZCcsICdSRUFETUUubWQnLCAncmVwYWlyLWluZGV4Lm1kJywgJ0RFU0lHTi5tZCcsXG4gIFBJTkNIR1JBQl9TS0lMTF9QQVRILCBQRkRfU0tJTExfUEFUSCwgU0tJTExTX0lOREVYX1BBVEgsXG5dO1xuXG4vKiogVHJ1ZSB3aGVuIGBuYW1lYCBpcyBwYXJ0IG9mIHRoZSB1cC1mcm9udCByZWFkIChzaWduYWwpLCBub3QgbGF6eS4gKi9cbmV4cG9ydCBjb25zdCBpc1NpZ25hbFBhdGggPSAobmFtZSwganNvbmxOYW1lKSA9PiBuYW1lID09PSBqc29ubE5hbWUgfHwgU0lHTkFMX1BBVEhTLmluY2x1ZGVzKG5hbWUpO1xuXG4vKiogZ2l0aWdub3JlLXN5bnRheCBjb250ZW50IGZvciB0aGUgYnVuZGxlIHJvb3Qg4oCUIHRoZSBsYXp5LXJlYWQgbWFuaWZlc3QuICovXG5leHBvcnQgY29uc3QgYnVpbGRCdW5kbGVJZ25vcmUgPSAoKSA9PiBbXG4gICcjIFBpbmNoR3JhYiBidW5kbGUgaWdub3JlIOKAlCBhIHRva2VuLWFjY291bnRpbmcgKyByZWFkLWxhemlseSBzaWduYWwuJyxcbiAgJyMnLFxuICAnIyBUaGUgcGF0aHMgYmVsb3cgYXJlIE5PVCBwYXJ0IG9mIHRoZSB1cC1mcm9udCByZWFkOiB2ZW5kb3JlZCBza2lsbHMgYXJlJyxcbiAgJyMgY29uc3VsdGVkIHBlci1jb21tZW50LCBzY3JlZW5zaG90cyBwZXItY29tbWVudCwgbGljZW5zZXMvaW5kZXhlcyBvbicsXG4gICcjIHJlZmVyZW5jZS4gVG9rZW4gZXN0aW1hdG9ycyBjYW4gZGlzY291bnQgdGhlbTsgdGhlIG1hbmlmZXN0XFwncyBgdG9rZW5zYCcsXG4gICcjIGZpZWxkIHJlcG9ydHMgdGhlIHNpZ25hbCAodXAtZnJvbnQpIHZzIHRvdGFsIGNvdW50cy4nLFxuICAnIycsXG4gICcjIEFHRU5UUzogZG8gTk9UIGhvbm9yIHRoaXMgdG9vIHN0cmljdGx5LiBJdCBpcyBhIGxhenktcmVhZCBoaW50LCBOT1QgYScsXG4gICcjIG5ldmVyLW9wZW4gcnVsZSDigJQgeW91IE1VU1Qgc3RpbGwgcmVhZCB0aGUgc2tpbGwgZmlsZXMgeW91IG1hcCB0byBlYWNoJyxcbiAgJyMgY29tbWVudCwgYW5kIGFueSBzY3JlZW5zaG90IHlvdSBhcmUgdmVyaWZ5aW5nIChzZWUgQUdFTlQtUFJPVE9DT0wubWQpLicsXG4gICcnLFxuICAnIyBWZW5kb3JlZCBkZXNpZ24gc2tpbGxzIChyZWFkIHRoZSBvbmVzIHlvdSBtYXAgcGVyIGNvbW1lbnQpLicsXG4gICcuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlLycsXG4gICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8nLFxuICAnIXBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWQnLFxuICAnJyxcbiAgJyMgQmluYXJpZXMgKyBnZW5lcmF0ZWQgcmVmZXJlbmNlIChvcGVuIG9uIGRlbWFuZCkuJyxcbiAgJ3NjcmVlbnNob3RzLycsXG4gICdwYWdlcy8nLFxuICAnZHVja2RiLnNxbCcsXG4gICdzY2hlbWEuanNvbicsXG4gICcnLFxuICAnIyBVcHN0cmVhbSBsaWNlbnNlcyAvIG5vdGljZXMuJyxcbiAgJyoqL0xJQ0VOU0UnLFxuICAnKiovTk9USUNFJyxcbiAgJyoqL05PVElDRS5tZCcsXG4gICcnLFxuXS5qb2luKCdcXG4nKTtcblxuY29uc3Qgb3JjaGVzdHJhdGlvblRleHQgPSAoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGpzb25sTmFtZX0pID0+XG4gIGBQSEFTRSBtYXA6IGZvciBFVkVSWSBjb21tZW50IHJvdyBpbiAke2pzb25sTmFtZX0sIGRlY2lkZSB3aGljaCBidW5kbGVkIHNraWxscyBhcHBseSBhbmQgYXBwZW5kIG9uZSBjb21tZW50IHJvdyB0byB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8ke3dvcmtzcGFjZX0vd29yay1tYW5pZmVzdC5qc29ubCBjYXJyeWluZyBhIG1hcHBlZF9za2lsbHMgZmllbGQgd2hvc2UgZW50cmllcyBhcmUgbG9jYXRvcnMg4oCUIHBhdGhzIHJlbGF0aXZlIHRvIHRoZSBleHRyYWN0aW9uIHJvb3QgKGUuZy4gLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvPGZpbGU+Lm1kLCAke1BGRF9TS0lMTF9QQVRIfSwgJHtQSU5DSEdSQUJfU0tJTExfUEFUSH07IHRoZSBmdWxsIGluZGV4IGlzICR7U0tJTExTX0lOREVYX1BBVEh9KS4gVGhlIGV4cG9ydCBwcmUtc2VlZHMgaGV1cmlzdGljIHN1Z2dlc3RlZFNraWxscyBvbiBlYWNoIGZlZWRiYWNrIHJvdzsgdmVyaWZ5IGFuZCBjb3JyZWN0IHRoZW0sIGRvIG5vdCB0cnVzdCB0aGVtIGJsaW5kbHkuIGAgK1xuICBgUEhBU0UgcGxhbjogZmFuIG91dCBvbmUgYmFja2dyb3VuZCBhdG9taWMgc3ViYWdlbnQgcGVyIGNvbW1lbnQ7IHBhc3MgZWFjaCBzdWJhZ2VudCBhIHN0YW5kYWxvbmUgSlNPTkwgc3ViaW5zdHJ1Y3Rpb24gKHRlbXBsYXRlIGluIEFHRU5ULVBST1RPQ09MLm1kKSBjb250YWluaW5nIHRoZSBmdWxsIGNvbW1lbnQgcm93LCBpdHMgcGFyZW50IHNlbGVjdG9yIHJvdywgdGhlIGJ1bmRsZSBtYW5pZmVzdCBsaW5lLCBhbmQgdGhlIEZVTEwgVEVYVCBvZiBldmVyeSBtYXBwZWQgc2tpbGwgcHJvbXB0OyBlYWNoIHN1YmFnZW50IHVzZXMgeW91ciAvcGxhbiAocGxhbm5pbmcpIGNhcGFiaWxpdHkgZm9yIGl0cyBwaGFzZSBhbmQgcmV0dXJucyBhIHBsYW4sIHNhdmVkIHRvIHBsYW5zLyR7YnVuZGxlSWR9LzxGRUVEQkFDS19VSUQ+LnBsYW4ubWQ7IGVhY2ggc3ViYWdlbnQgYWxzbyBwb2xpc2hlcyBpdHMgcGxhbiB3aXRoIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGwuIGAgK1xuICBgUEhBU0UgaW1wbGVtZW50OiBZT1Ug4oCUIHRoZSBmb3JlZ3JvdW5kIGFnZW50IHRoZSBvcGVyYXRvciBwYXN0ZWQgdGhpcyBwcm9tcHQgaW50byDigJQgZG8gYWxsIGltcGxlbWVudGF0aW9uLCB0ZXN0IGRldmVsb3BtZW50LCB0ZXN0aW5nLCBhbmQgaXRlcmF0aW9uIGluIDxQUk9KRUNUX1JPT1Q+OyBzdWJhZ2VudHMgb25seSBwbGFuLiBQb2xpc2ggdGhlIGltcGxlbWVudGVkIHJlc3VsdCB3aXRoIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGwuIGAgK1xuICBgUEhBU0UgYXVkaXQ6IHNlbmQgdGhlIGNvbWJpbmVkIHBsYW5zICsgaW1wbGVtZW50YXRpb24gZm9yIGEgYmxpbmQgYXRvbWljICdyb2FzdCcgcGVlciByZXZpZXcgb2YgQk9USCBwbGFuIGFuZCBpbXBsZW1lbnRhdGlvbiwgdXNpbmcgd2hhdGV2ZXIgb3RoZXItYWdlbnQgcGVlci1yZXZpZXcgc2tpbGxzIGV4aXN0IGluIFlPVVIgT1dOIGVudmlyb25tZW50OyB3cml0ZSBpdCB0byBhdWRpdHMvJHtidW5kbGVJZH0vPHJ1bklkPi1yb2FzdC5tZCBhbmQgYWRkcmVzcyBldmVyeSBibG9ja2VyLiBgICtcbiAgYFBIQVNFIHZlcmlmeTogc2VlIHRoZSAndmVyaWZ5JyBsaW5lLiBgICtcbiAgYERFR1JBREFUSU9OIFJVTEU6IGlmIHlvdSBjYW5ub3Qgc3Bhd24gc3ViYWdlbnRzLCBvciBsYWNrIGEgL3BsYW4sIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbiwgb3Igcm9hc3QgY2FwYWJpbGl0eSwgcGVyZm9ybSB0aGUgc2FtZSBwaGFzZXMgeW91cnNlbGYgU0VSSUFMTFkgaW4gdGhpcyBleGFjdCBvcmRlciDigJQgbmV2ZXIgc2tpcCBhIHBoYXNlLiBgICtcbiAgYFNLSUxMUyBSVUxFOiB0aGUgYnVuZGxlZCBza2lsbHMgYXJlIGZvciB0aGlzIGpvYiBvbmx5IOKAlCByZWFkIHRoZW0gZnJvbSB0aGUgZXh0cmFjdGlvbiBkaXJlY3Rvcnk7IHRoZXJlIGlzIE5PIG5lZWQgdG8gaW5zdGFsbCB0aGVtIHBlcm1hbmVudGx5LCBhbmQgeW91IG11c3QgTk9UIG92ZXJ3cml0ZSB5b3VyIG93biBwZXJzaXN0ZW50IHNraWxscywgYWdlbnQgY29uZmlnLCBvciBkb3RmaWxlcy5gO1xuXG5jb25zdCB2ZXJpZnlUZXh0ID0gKHt3b3Jrc3BhY2UsIHhEaXIsIGpzb25sTmFtZX0pID0+XG4gIGBGaW5hbCB2ZXJpZmljYXRpb24gcGFzcywgb25seSBhZnRlciBpbXBsZW1lbnRhdGlvbiBhbmQgYXVkaXQ6IHN0YXJ0IHRoZSBwcm9kdWN0IGxvY2FsbHksIHRoZW4gcnVuOiBucHggLXkgcGluY2hncmFiIHJlY2FwdHVyZSAke3hEaXJ9LyR7anNvbmxOYW1lfSA8QVBQX1VSTD4gLS13b3Jrc3BhY2UtZGlyIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyR7d29ya3NwYWNlfSAodXNlIGJ1bnggaWYgbnB4IGlzIHVuYXZhaWxhYmxlKS4gVGhpcyByZS1sb2NhdGVzIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3RvciB3aXRoIFBpbmNoR3JhYidzIG93biBDU1MtPlhQYXRoLT5hMTF5IGNoYWluLCBzY3JlZW5zaG90cyBlYWNoIGVsZW1lbnQsIGFuZCB3cml0ZXMgYW4gYXBwZW5kLW9ubHkgcnVuIHVuZGVyIHJlY2FwdHVyZXMvPHJ1bklkPi8uIFJlYWQgZWFjaCByZWNhcHR1cmVkIFBORyBuZXh0IHRvIGl0cyBvcmlnaW5hbCBpbiAke3hEaXJ9L3NjcmVlbnNob3RzLyBhbmQgY29uZmlybSBldmVyeSBjb21tZW50IGlzIHZpc2libHkgcmVzb2x2ZWQ7IHRoZW4gdXBkYXRlIHRoZSBtYXRjaGluZyB3b3JrLW1hbmlmZXN0Lmpzb25sIHJvd3MgdG8gc3RhdHVzIGRvbmUsIG9yIGJsb2NrZWQgd2l0aCBhIHJlYXNvbi5gO1xuXG5jb25zdCBkb25lVGV4dCA9ICh7YnVuZGxlSWR9KSA9PlxuICBgWW91IGFyZSBmaW5pc2hlZCB3aGVuIGV2ZXJ5IGNvbW1lbnQgaGFzIGEgd29yay1tYW5pZmVzdC5qc29ubCByb3cgd2l0aCBzdGF0dXMgZG9uZSBvciBibG9ja2VkLCBwbGFucy8ke2J1bmRsZUlkfS8gaG9sZHMgb25lIHBsYW4gcGVyIGNvbW1lbnQsIGF1ZGl0cy8ke2J1bmRsZUlkfS8gaG9sZHMgYXQgbGVhc3Qgb25lIHJvYXN0LCBhbmQgdGhlIGxhdGVzdCByZWNhcHR1cmUgcnVuIGxvY2F0ZXMgZXZlcnkgY29tbWVudGVkIHNlbGVjdG9yLiB3b3JrLW1hbmlmZXN0Lmpzb25sIGlzIGFwcGVuZC1vbmx5OiBhZGQgcm93cywgbmV2ZXIgcmV3cml0ZSBoaXN0b3J5LmA7XG5cbmNvbnN0IHdhcm5pbmdUZXh0ID1cbiAgJ1RoZSBidW5kbGVkIERFU0lHTi5tZCBpcyBQaW5jaEdyYWJcXCdzIGJhcmUgc3RvY2sgdGVtcGxhdGUg4oCUIHRoZSBvcGVyYXRvciBkaWQgbm90IGN1c3RvbWl6ZSBpdC4gRG8gTk9UIHRyZWF0IGl0IGFzIHByb2R1Y3QgY2Fub24uIFByZWZlciBhIG1vcmUgYXBwbGljYWJsZSBjYW5vbmljYWwgZGVzaWduIHNvdXJjZSBpZiBvbmUgZXhpc3RzIGZvciB0aGlzIHByb2R1Y3QgKHNlYXJjaCA8UFJPSkVDVF9ST09UPiBmb3IgREVTSUdOLm1kLCBkb2NzL2Rlc2lnbiosIGJyYW5kLyBvciBzdHlsZS1ndWlkZSBmaWxlcykgYW5kIHVzZSB0aGUgYnVuZGxlZCB0ZW1wbGF0ZSBvbmx5IGFzIGEgZ2VuZXJpYyBjaGVja2xpc3QuJztcblxuLyoqXG4gKiBUaGUgbmluZS1saW5lIFNlbmQtdG8tQWdlbnQgY2xpcGJvYXJkIHBheWxvYWQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLndvcmtzcGFjZVxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuYnVuZGxlSWQgICAgICAgMTYtaGV4IGNvbnRlbnQgaGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuYXJjaGl2ZVBhdGggICAgYWJzb2x1dGUgcGF0aCBvZiB0aGUgc2F2ZWQgLnRhci56c3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmV4cG9ydFRzICAgICAgIElTTyB0aW1lc3RhbXAgKHRoZSBleHBvcnQgY2xvY2spXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5qc29ubE5hbWUgICAgICB0aGUgYnVuZGxlJ3MgSlNPTkwgZW50cnkgbmFtZVxuICogQHBhcmFtIHt7Y29tbWVudHM6IG51bWJlciwgc2VsZWN0b3JzOiBudW1iZXIsIHBhZ2VzOiBudW1iZXIsIHNjcmVlbnNob3RzOiBudW1iZXJ9fSBvcHRzLmNvdW50c1xuICogQHBhcmFtIHtzdHJpbmdbXX0gb3B0cy5lbnRyeU5hbWVzICAgZXZlcnkgdGFyIGVudHJ5IG5hbWUgaW4gdGhlIGJ1bmRsZVxuICogQHBhcmFtIHtib29sZWFufSBvcHRzLmRlc2lnbklzVGVtcGxhdGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IG5ld2xpbmUtam9pbmVkIEpTT05MIChubyB0cmFpbGluZyBuZXdsaW5lKVxuICovXG5leHBvcnQgY29uc3QgYnVpbGRBZ2VudFByb21wdEpzb25sID0gKG9wdHMpID0+IHtcbiAgY29uc3Qge3dvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmVQYXRoLCBleHBvcnRUcywganNvbmxOYW1lLCBjb3VudHMsIGVudHJ5TmFtZXMsIGRlc2lnbklzVGVtcGxhdGV9ID0gb3B0cztcbiAgY29uc3QgeERpciA9IGV4dHJhY3REaXIod29ya3NwYWNlLCBidW5kbGVJZCk7XG4gIGNvbnN0IGhhcyA9IChuYW1lKSA9PiBlbnRyeU5hbWVzLmluY2x1ZGVzKG5hbWUpO1xuICBjb25zdCBsaW5lcyA9IFtdO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHY6IDEsIHR5cGU6ICdwaW5jaGdyYWItc2VuZC10by1hZ2VudCcsIHRvb2w6ICdwaW5jaGdyYWInLFxuICAgIHdvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmU6IGFyY2hpdmVQYXRoLCBnZW5lcmF0ZWQ6IGV4cG9ydFRzLFxuICAgIGNvdW50czoge2NvbW1lbnRzOiBjb3VudHMuY29tbWVudHMsIHNlbGVjdG9yczogY291bnRzLnNlbGVjdG9ycywgcGFnZXM6IGNvdW50cy5wYWdlcywgc2NyZWVuc2hvdHM6IGNvdW50cy5zY3JlZW5zaG90c30sXG4gICAgZGVzaWduSXNTdG9ja1RlbXBsYXRlOiBkZXNpZ25Jc1RlbXBsYXRlLFxuICB9KTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnaW5zdHJ1Y3Rpb24nLFxuICAgIHRleHQ6IGBZb3UgaGF2ZSBiZWVuIGhhbmRlZCBhIFBpbmNoR3JhYiBmZWVkYmFjayBidW5kbGU6ICR7Y291bnRzLmNvbW1lbnRzfSBvcGVyYXRvciBjb21tZW50cyBwaW5uZWQgdG8gbGl2ZSBVSSBlbGVtZW50cyBvZiB0aGUgcHJvZHVjdCBidWlsdCBmcm9tIDxQUk9KRUNUX1JPT1Q+IChpbmZlciA8UFJPSkVDVF9ST09UPiBmcm9tIHlvdXIgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeTsgaWYgYW1iaWd1b3VzLCBhc2sgYmVmb3JlIGVkaXRpbmcpLiBEbyB0aGlzIG5vdywgaW4gb3JkZXI6ICgxKSBleGVjdXRlIHRoZSBiYXNoIHNjcmlwdCBpbiB0aGUgbmV4dCAnYm9vdHN0cmFwJyBsaW5lIGV4YWN0bHkgYXMgd3JpdHRlbiAoaXRzICdzY3JpcHQnIGZpZWxkIGlzIGEgSlNPTi1lc2NhcGVkIHBsYWluIGJhc2ggc2NyaXB0OyBpdCBzZWxmLW5vcm1hbGl6ZXMgfiBhbmQgV2luZG93cyBkcml2ZSBwYXRocyBmb3IgV1NML0dpdC1CYXNoKTsgKDIpIHJlYWQgRVZFUlkgZmlsZSBsaXN0ZWQgaW4gdGhlICdmaWxlcycgbGluZSBmdWxseSBpbnRvIGNvbnRleHQ7ICgzKSBmb2xsb3cgQUdFTlQtUFJPVE9DT0wubWQgdG8gbWFwLCBwbGFuLCBpbXBsZW1lbnQsIHRlc3QsIGF1ZGl0LCBhbmQgdmVyaWZ5IGEgZml4IGZvciBldmVyeSBjb21tZW50LmAsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdib290c3RyYXAnLCBsYW5nOiAnYmFzaCcsIGlkZW1wb3RlbnQ6IHRydWUsXG4gICAgc2NyaXB0OiBidWlsZEJvb3RzdHJhcFNjcmlwdCh7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGgsIGV4cG9ydFRzfSksXG4gIH0pO1xuXG4gIGNvbnN0IHBhdGhzID0gW1xuICAgIGBAJHt4RGlyfS9BR0VOVC1QUk9UT0NPTC5tZGAsXG4gICAgYEAke3hEaXJ9L1JFQURNRS5tZGAsXG4gICAgYEAke3hEaXJ9L3JlcGFpci1pbmRleC5tZGAsXG4gICAgYEAke3hEaXJ9LyR7anNvbmxOYW1lfWAsXG4gIF07XG4gIGlmIChoYXMoJ0RFU0lHTi5tZCcpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS9ERVNJR04ubWRgKTtcbiAgaWYgKGhhcyhQSU5DSEdSQUJfU0tJTExfUEFUSCkpIHBhdGhzLnB1c2goYEAke3hEaXJ9LyR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9YCk7XG4gIGlmIChoYXMoUEZEX1NLSUxMX1BBVEgpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS8ke1BGRF9TS0lMTF9QQVRIfWApO1xuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnZmlsZXMnLCByZWFkRnVsbHk6IHRydWUsIG5vR3JlcDogdHJ1ZSxcbiAgICBydWxlOiAnUmVhZCBlYWNoIHBhdGggYmVsb3cgRU5ELVRPLUVORCB3aXRoIHlvdXIgZmlsZS1yZWFkaW5nIHRvb2wuIFRoaXMgaXMgTk9OLU9QVElPTkFMLiBEbyBOT1QgZ3JlcCB0aGVtLCBkbyBOT1QgaGVhZC90YWlsIHRoZW0sIGRvIE5PVCBzYW1wbGUgbGluZSByYW5nZXMg4oCUIGZ1bGwgY29udGVudHMgaW50byBjb250ZXh0LiBTY3JlZW5zaG90cyBhbmQgdGhlIGltcGVjY2FibGUgcmVmZXJlbmNlIGZpbGVzIGFyZSByZWFkIHBlci1jb21tZW50IGxhdGVyLCBhcyBBR0VOVC1QUk9UT0NPTC5tZCBkaXJlY3RzLicsXG4gICAgcGF0aHMsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICd0cmVlJywgcm9vdDogeERpciwgZW50cmllczogZW50cnlOYW1lcy5sZW5ndGgsXG4gICAgdGV4dDogcmVuZGVyQnVuZGxlVHJlZShlbnRyeU5hbWVzKSxcbiAgfSk7XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ29yY2hlc3RyYXRpb24nLFxuICAgIHBoYXNlczogWydtYXAnLCAncGxhbicsICdpbXBsZW1lbnQnLCAnYXVkaXQnLCAndmVyaWZ5J10sXG4gICAgdGV4dDogb3JjaGVzdHJhdGlvblRleHQoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGpzb25sTmFtZX0pLFxuICB9KTtcblxuICBpZiAoZGVzaWduSXNUZW1wbGF0ZSkge1xuICAgIGxpbmVzLnB1c2goe3R5cGU6ICd3YXJuaW5nJywgY29kZTogJ0RFU0lHTl9NRF9JU19TVE9DS19URU1QTEFURScsIHRleHQ6IHdhcm5pbmdUZXh0fSk7XG4gIH1cblxuICBsaW5lcy5wdXNoKHt0eXBlOiAndmVyaWZ5JywgdGV4dDogdmVyaWZ5VGV4dCh7d29ya3NwYWNlLCB4RGlyLCBqc29ubE5hbWV9KX0pO1xuICBsaW5lcy5wdXNoKHt0eXBlOiAnZG9uZScsIHRleHQ6IGRvbmVUZXh0KHtidW5kbGVJZH0pfSk7XG5cbiAgcmV0dXJuIGxpbmVzLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBBR0VOVC1QUk9UT0NPTC5tZCDigJQgdGhlIGluLWJ1bmRsZSBleHBhbnNpb24gb2YgdGhlIGNsaXBib2FyZCBkb2N0cmluZS5cbiAqIHNraWxsc0luZGV4IGlzIHRoZSBwYXJzZWQgc2tpbGxzLWluZGV4Lmpzb24gKG9yIG51bGwgd2hlbiBza2lsbHMgd2VyZW4ndFxuICogYnVuZGxlZCk7IHVzZWQgdG8gaHlkcmF0ZSB0aGUgc2tpbGwgaW52ZW50b3J5IHRhYmxlLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRBZ2VudFByb3RvY29sTWQgPSAob3B0cykgPT4ge1xuICBjb25zdCB7d29ya3NwYWNlLCBidW5kbGVJZCwgZXhwb3J0VHMsIGpzb25sTmFtZSwgY291bnRzLCBlbnRyeU5hbWVzLCBkZXNpZ25Jc1RlbXBsYXRlLCBza2lsbHNJbmRleH0gPSBvcHRzO1xuICBjb25zdCB4RGlyID0gZXh0cmFjdERpcih3b3Jrc3BhY2UsIGJ1bmRsZUlkKTtcbiAgY29uc3Qgcm9vdCA9IHdvcmtzcGFjZVJvb3Qod29ya3NwYWNlKTtcbiAgY29uc3QgaGFzID0gKG5hbWUpID0+IGVudHJ5TmFtZXMuaW5jbHVkZXMobmFtZSk7XG4gIGNvbnN0IG91dCA9IFtdO1xuXG4gIG91dC5wdXNoKCcjIEFHRU5ULVBST1RPQ09MLm1kJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goYFdvcmtzcGFjZTogXFxgJHt3b3Jrc3BhY2V9XFxgIMK3IEJ1bmRsZTogXFxgJHtidW5kbGVJZH1cXGAgwrcgR2VuZXJhdGVkOiAke2V4cG9ydFRzfWApO1xuICBvdXQucHVzaChgQ291bnRzOiAqKiR7Y291bnRzLmNvbW1lbnRzfSoqIGNvbW1lbnRzIMK3ICoqJHtjb3VudHMuc2VsZWN0b3JzfSoqIHNlbGVjdG9ycyDCtyAqKiR7Y291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtjb3VudHMuc2NyZWVuc2hvdHN9Kiogc2NyZWVuc2hvdHNgKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnVGhpcyBmaWxlIGlzIHRoZSBmdWxsIHdvcmtpbmcgZG9jdHJpbmUgZm9yIHRoZSBjb2RpbmcgYWdlbnQgaGFuZGVkIHRoaXMnKTtcbiAgb3V0LnB1c2goJ2J1bmRsZS4gVGhlIG9wZXJhdG9yXFwncyBjbGlwYm9hcmQgcHJvbXB0IChKU09OTCkgaXMgYSBjb21wYWN0IGJvb3RzdHJhcCBvZicpO1xuICBvdXQucHVzaCgndGhlIHNhbWUgY29udGVudCDigJQgaWYgeW91IG9ubHkgaGF2ZSB0aGlzIGFyY2hpdmUsIGV2ZXJ5dGhpbmcgeW91IG5lZWQgaXMnKTtcbiAgb3V0LnB1c2goJ2hlcmUuIFRva2VucyBpbiBgPEFOR0xFX0JSQUNLRVRTPmAgYXJlIHlvdXJzIHRvIGluZmVyOiBgPFBST0pFQ1RfUk9PVD5gIGlzJyk7XG4gIG91dC5wdXNoKCd0aGUgcHJvZHVjdFxcJ3MgcmVwb3NpdG9yeSAodXN1YWxseSB5b3VyIHdvcmtpbmcgZGlyZWN0b3J5KSwgYDxBUFBfVVJMPmAgaXMnKTtcbiAgb3V0LnB1c2goJ3RoZSBsb2NhbGx5IHJ1bm5pbmcgcHJvZHVjdCwgYDxGRUVEQkFDS19VSUQ+YC9gPHJ1bklkPmAgYXJlIHBlci1pdGVtIGlkcy4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgMCDCtyBCb290c3RyYXAgKGlkZW1wb3RlbnQpJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ0lmIGAnICsgeERpciArICdgIGRvZXMgbm90IGV4aXN0IHlldCwgcnVuIHRoZSBzY3JpcHQgYmVsb3cgd2l0aCcpO1xuICBvdXQucHVzaCgnYDxBUkNISVZFX1BBVEg+YCByZXBsYWNlZCBieSB0aGUgYWJzb2x1dGUgcGF0aCBvZiB0aGlzIGJ1bmRsZVxcJ3MgYC50YXIuenN0YCcpO1xuICBvdXQucHVzaCgnKHdoZW4geW91IGFyZSByZWFkaW5nIHRoaXMgZnJvbSB0aGUgZXh0cmFjdGVkIGFyY2hpdmUsIHRoYXQgc3RlcCBhbHJlYWR5Jyk7XG4gIG91dC5wdXNoKCdoYXBwZW5lZCDigJQgcmUtcnVubmluZyBpcyBhIHNhZmUgbm8tb3ApLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBiYXNoJyk7XG4gIG91dC5wdXNoKGJ1aWxkQm9vdHN0cmFwU2NyaXB0KHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aDogJzxBUkNISVZFX1BBVEg+JywgZXhwb3J0VHN9KSk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgMSDCtyBQZXJzaXN0ZW50IHdvcmtzcGFjZSBsYXlvdXQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnQWxsIFBpbmNoR3JhYiB3b3JrIHN0YXRlIGxpdmVzIHVuZGVyIHRoZSBwZXJzaXN0ZW5jZSByb290IOKAlCBrZWVwIHlvdXInKTtcbiAgb3V0LnB1c2goJ3BsYW5uaW5nIGFydGlmYWN0cyB0aGVyZSBhbmQga2VlcCB0aGUgd29yayBtYW5pZmVzdCB1cGRhdGVkOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goYCR7cm9vdH0vYCk7XG4gIG91dC5wdXNoKCcgIHdvcmstbWFuaWZlc3QuanNvbmwgICAgICAgICAgICAgICMgYXBwZW5kLW9ubHkgYWdlbnQgc3RhdGUgbGVkZ2VyJyk7XG4gIG91dC5wdXNoKCcgIGJ1bmRsZXMvJyk7XG4gIG91dC5wdXNoKGAgICAgJHtidW5kbGVJZH0vYCk7XG4gIG91dC5wdXNoKCcgICAgICBidW5kbGUudGFyLnpzdCAgICAgICAgICAgICAgICMgY29weSBvZiB0aGUgb3JpZ2luYWwgYXJjaGl2ZScpO1xuICBvdXQucHVzaCgnICAgICAgLmV4dHJhY3RlZCAgICAgICAgICAgICAgICAgICAjIGd1YXJkIG1hcmtlciAoY29udGFpbnMgdGhlIGJ1bmRsZUlkKScpO1xuICBvdXQucHVzaCgnICAgICAgZXh0cmFjdGVkLyAgICAgICAgICAgICAgICAgICAjIHRhciBvdXRwdXQg4oCUIHRyZWF0IGFzIElNTVVUQUJMRSBpbnB1dCcpO1xuICBvdXQucHVzaCgnICBwbGFucy8nKTtcbiAgb3V0LnB1c2goYCAgICAke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kYCk7XG4gIG91dC5wdXNoKCcgIGF1ZGl0cy8nKTtcbiAgb3V0LnB1c2goYCAgICAke2J1bmRsZUlkfS88cnVuSWQ+LXJvYXN0Lm1kYCk7XG4gIG91dC5wdXNoKCcgIHJlY2FwdHVyZXMvJyk7XG4gIG91dC5wdXNoKCcgICAgPHJ1bklkPi8gICAgICAgICAgICAgICAgICAgICAgICMgYXBwZW5kLW9ubHk7IG5ldmVyIHJldXNlIGEgcnVuSWQnKTtcbiAgb3V0LnB1c2goJyAgICAgIHJlY2FwdHVyZS1tYW5pZmVzdC5qc29ubCcpO1xuICBvdXQucHVzaCgnICAgICAgc2NyZWVuc2hvdHMvPHVpZD4ucG5nJyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYHdvcmstbWFuaWZlc3QuanNvbmxgIHJvd3MgKGFwcGVuZC1vbmx5OyByZWR1Y2VycyBncm91cCBieScpO1xuICBvdXQucHVzaCgnYChidW5kbGVJZCwgZmVlZGJhY2tVaWQpYCBhbmQgdGhlIExBU1Qgcm93IHdpbnMg4oCUIGFjY3JldGUsIG5ldmVyIHJld3JpdGUpOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBqc29uYycpO1xuICBvdXQucHVzaCgnLy8gd3JpdHRlbiBvbmNlIGJ5IHRoZSBib290c3RyYXAnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwid29yay1tYW5pZmVzdC1oZWFkZXJcIixcInRvb2xcIjpcInBpbmNoZ3JhYlwiLFwid29ya3NwYWNlXCI6XCIke3dvcmtzcGFjZX1cIixcImNyZWF0ZWRcIjpcIiR7ZXhwb3J0VHN9XCJ9YCk7XG4gIG91dC5wdXNoKCcvLyBvbmUgcGVyIGNvbW1lbnQsIGFwcGVuZGVkIGVhY2ggdGltZSBpdHMgc3RhdGUgYWR2YW5jZXMnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwiY29tbWVudFwiLFwiYnVuZGxlSWRcIjpcIiR7YnVuZGxlSWR9XCIsXCJmZWVkYmFja1VpZFwiOlwiPEZFRURCQUNLX1VJRD5cIixcInBhcmVudFVpZFwiOlwiPHNlbGVjdG9yIHVpZD5cIixcInNlbGVjdG9yXCI6XCI8Y3NzPlwiLFwibWFwcGVkX3NraWxsc1wiOlt7XCJza2lsbFwiOlwiPGlkIGZyb20gc2tpbGxzLWluZGV4Lmpzb24+XCIsXCJsb2NhdG9yXCI6XCI8cGF0aCByZWxhdGl2ZSB0byBleHRyYWN0aW9uIHJvb3Q+XCJ9XSxcInN0YXR1c1wiOlwibWFwcGVkfHBsYW5uZWR8aW4tcHJvZ3Jlc3N8ZG9uZXxibG9ja2VkXCIsXCJwbGFuXCI6XCJwbGFucy8ke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kXCIsXCJub3Rlc1wiOlwiPHNob3J0PlwiLFwidHNcIjpcIjxJU08+XCJ9YCk7XG4gIG91dC5wdXNoKCcvLyBhcHBlbmRlZCBieSBgcGluY2hncmFiIHJlY2FwdHVyZWAgcnVucycpO1xuICBvdXQucHVzaChge1widlwiOjEsXCJ0eXBlXCI6XCJyZWNhcHR1cmUtcnVuXCIsXCJydW5JZFwiOlwiPHJ1bklkPlwiLFwidHNcIjpcIjxJU08+XCIsXCJidW5kbGVJZFwiOlwiJHtidW5kbGVJZH1cIixcImxvY2F0ZWRcIjowLFwidG90YWxcIjowfWApO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDIgwrcgUmVhZCBvcmRlciAobm9uLW9wdGlvbmFsLCBmdWxsIHJlYWRzLCBubyBncmVwKScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdSZWFkIGVhY2ggb2YgdGhlc2UgRU5ELVRPLUVORCBiZWZvcmUgYW55IG90aGVyIGFjdGlvbi4gRG8gbm90IGdyZXAsIGhlYWQsJyk7XG4gIG91dC5wdXNoKCd0YWlsLCBvciBzYW1wbGUgbGluZSByYW5nZXMg4oCUIGZ1bGwgY29udGVudHMgaW50byBjb250ZXh0OicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGAxLiBcXGAke3hEaXJ9L0FHRU5ULVBST1RPQ09MLm1kXFxgICh0aGlzIGZpbGUpYCk7XG4gIG91dC5wdXNoKGAyLiBcXGAke3hEaXJ9L1JFQURNRS5tZFxcYGApO1xuICBvdXQucHVzaChgMy4gXFxgJHt4RGlyfS9yZXBhaXItaW5kZXgubWRcXGBgKTtcbiAgb3V0LnB1c2goYDQuIFxcYCR7eERpcn0vJHtqc29ubE5hbWV9XFxgYCk7XG4gIGlmIChoYXMoJ0RFU0lHTi5tZCcpKSBvdXQucHVzaChgNS4gXFxgJHt4RGlyfS9ERVNJR04ubWRcXGBgKTtcbiAgaWYgKGhhcyhQSU5DSEdSQUJfU0tJTExfUEFUSCkpIG91dC5wdXNoKGA2LiBcXGAke3hEaXJ9LyR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9XFxgYCk7XG4gIGlmIChoYXMoUEZEX1NLSUxMX1BBVEgpKSBvdXQucHVzaChgNy4gXFxgJHt4RGlyfS8ke1BGRF9TS0lMTF9QQVRIfVxcYGApO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdTY3JlZW5zaG90cyAoYHNjcmVlbnNob3RzL2AsIGluZGV4ZWQgYnkgYHNjcmVlbnNob3RzLmpzb25gKSBhbmQgdGhlJyk7XG4gIG91dC5wdXNoKCdpbXBlY2NhYmxlIHJlZmVyZW5jZSBmaWxlcyBhcmUgcmVhZCBwZXItY29tbWVudCBkdXJpbmcgdGhlIHBoYXNlcyBiZWxvdy4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnVGhlIGJ1bmRsZSBzaGlwcyBhIGAuZ2l0aWdub3JlYCBtYXJraW5nIHRoYXQgbGF6eSBzZXQgKHNraWxscywgc2NyZWVuc2hvdHMsJyk7XG4gIG91dC5wdXNoKCdsaWNlbnNlcywgaW5kZXhlcykgc28gdG9rZW4gZXN0aW1hdG9ycyBjYW4gZGlzY291bnQgaXQg4oCUIHRoZSBtYW5pZmVzdFxcJ3MnKTtcbiAgb3V0LnB1c2goJ2B0b2tlbnNgIGZpZWxkIHJlcG9ydHMgdGhlIHVwLWZyb250IGBzaWduYWxgIHZzIGB0b3RhbGAuICoqRG8gTk9UIGhvbm9yIHRoZScpO1xuICBvdXQucHVzaCgnLmdpdGlnbm9yZSB0b28gc3RyaWN0bHk6KiogaXQgaXMgYSByZWFkLWxhemlseSBoaW50LCBub3QgYSBuZXZlci1vcGVuIHJ1bGUuJyk7XG4gIG91dC5wdXNoKCdZb3UgTVVTVCBzdGlsbCByZWFkIGV2ZXJ5IHNraWxsIGZpbGUgeW91IG1hcCB0byBhIGNvbW1lbnQsIGFuZCBhbnknKTtcbiAgb3V0LnB1c2goJ3NjcmVlbnNob3QgeW91IHZlcmlmeS4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBpZiAoZGVzaWduSXNUZW1wbGF0ZSkge1xuICAgIG91dC5wdXNoKCc+ICoqV0FSTklORyDigJQgREVTSUdOX01EX0lTX1NUT0NLX1RFTVBMQVRFLioqICcgKyB3YXJuaW5nVGV4dCk7XG4gICAgb3V0LnB1c2goJycpO1xuICB9XG4gIG91dC5wdXNoKCcjIyAzIMK3IEJ1bmRsZWQgc2tpbGxzJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoZSBidW5kbGVkIHNraWxscyBhcmUgZm9yIHRoaXMgam9iIG9ubHk6IHJlYWQgdGhlbSBmcm9tIHRoZSBleHRyYWN0aW9uJyk7XG4gIG91dC5wdXNoKCdkaXJlY3RvcnkuIFRoZXJlIGlzIE5PIG5lZWQgdG8gaW5zdGFsbCB0aGVtIHBlcm1hbmVudGx5LCBhbmQgeW91IG11c3QnKTtcbiAgb3V0LnB1c2goJ05PVCBvdmVyd3JpdGUgeW91ciBvd24gcGVyc2lzdGVudCBza2lsbHMsIGFnZW50IGNvbmZpZywgb3IgZG90ZmlsZXMuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgaWYgKHNraWxsc0luZGV4ICYmIEFycmF5LmlzQXJyYXkoc2tpbGxzSW5kZXguc2tpbGxzKSAmJiBza2lsbHNJbmRleC5za2lsbHMubGVuZ3RoKSB7XG4gICAgLy8gVGFibGUtY2VsbCBzYW5pdGl6ZXIgZm9yIHNlbWktdHJ1c3RlZCBpbmRleCBzdHJpbmdzIChwdXJwb3NlcyBjb21lXG4gICAgLy8gZnJvbSB2ZW5kb3JlZCB1cHN0cmVhbSBmcm9udG1hdHRlcik6IGVzY2FwZSB0aGUgZXNjYXBlIGNoYXJhY3RlclxuICAgIC8vIEZJUlNULCB0aGVuIHRoZSBjZWxsIGRlbGltaXRlciwgYW5kIGZsYXR0ZW4gbmV3bGluZXMg4oCUIG90aGVyd2lzZSBhXG4gICAgLy8gY3JhZnRlZCBwdXJwb3NlIGNvdWxkIGJyZWFrIG91dCBvZiBpdHMgY2VsbCBhbmQgaW5qZWN0IHJvd3MgaW50byBhXG4gICAgLy8gZG9jdW1lbnQgYWdlbnRzIHRyZWF0IGFzIGRvY3RyaW5lIChDb2RlUUwganMvaW5jb21wbGV0ZS1zYW5pdGl6YXRpb24pLlxuICAgIGNvbnN0IGNlbGwgPSAodikgPT4gU3RyaW5nKHYgPz8gJycpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXFx8L2csICdcXFxcfCcpLnJlcGxhY2UoL1xccj9cXG4vZywgJyAnKTtcbiAgICBvdXQucHVzaCgnfCBpZCB8IGxvY2F0b3IgKHJlbGF0aXZlIHRvIGV4dHJhY3Rpb24gcm9vdCkgfCBwdXJwb3NlIHwnKTtcbiAgICBvdXQucHVzaCgnfCAtLS0gfCAtLS0gfCAtLS0gfCcpO1xuICAgIGZvciAoY29uc3QgcyBvZiBza2lsbHNJbmRleC5za2lsbHMpIHtcbiAgICAgIGNvbnN0IGludm9rZSA9IHMuaW52b2tlID8gYCBJbnZva2U6IFxcYCR7Y2VsbChzLmludm9rZSl9XFxgLmAgOiAnJztcbiAgICAgIG91dC5wdXNoKGB8IFxcYCR7Y2VsbChzLmlkKX1cXGAgfCBcXGAke2NlbGwocy5wYXRoKX1cXGAgfCAke2NlbGwocy5wdXJwb3NlKX0ke2ludm9rZX0gfGApO1xuICAgIH1cbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJ1Byb3ZlbmFuY2UgKHVwc3RyZWFtIHJlcG8gKyBwaW5uZWQgY29tbWl0ICsgbGljZW5zZSkgZm9yIGV2ZXJ5IHZlbmRvcmVkJyk7XG4gICAgb3V0LnB1c2goYHNraWxsIGlzIHJlY29yZGVkIGluIFxcYCR7U0tJTExTX0lOREVYX1BBVEh9XFxgIGF0IHRoZSBhcmNoaXZlIHJvb3QuYCk7XG4gIH0gZWxzZSB7XG4gICAgb3V0LnB1c2goJ19UaGlzIGJ1bmRsZSB3YXMgZXhwb3J0ZWQgd2l0aG91dCB0aGUgdmVuZG9yZWQgc2tpbGwgc2V0ICh0aGUgb3BlcmF0b3InKTtcbiAgICBvdXQucHVzaCgnZGlzYWJsZWQgXCJCdW5kbGUgZGVzaWduIHNraWxsc1wiKS4gTWFwIGNvbW1lbnRzIGFnYWluc3Qgd2hhdGV2ZXIgZGVzaWduJyk7XG4gICAgb3V0LnB1c2goJ3NraWxscyBleGlzdCBpbiBZT1VSIE9XTiBlbnZpcm9ubWVudCBpbnN0ZWFkLCBhbmQgbm90ZSB0aGF0IGluIHRoZScpO1xuICAgIG91dC5wdXNoKCd3b3JrIG1hbmlmZXN0Ll8nKTtcbiAgfVxuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyA0IMK3IFBoYXNlcycpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdSdW4gdGhlIGZpdmUgcGhhc2VzIGluIG9yZGVyLiAqKkRlZ3JhZGF0aW9uIHJ1bGU6KiogaWYgeW91IGNhbm5vdCBzcGF3bicpO1xuICBvdXQucHVzaCgnc3ViYWdlbnRzLCBvciBsYWNrIGEgYC9wbGFuYCwgYC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbmAsIG9yIHJvYXN0Jyk7XG4gIG91dC5wdXNoKCdjYXBhYmlsaXR5LCBwZXJmb3JtIHRoZSBzYW1lIHBoYXNlcyB5b3Vyc2VsZiBTRVJJQUxMWSBpbiB0aGlzIGV4YWN0IG9yZGVyJyk7XG4gIG91dC5wdXNoKCfigJQgbmV2ZXIgc2tpcCBhIHBoYXNlLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgbWFwJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goYEZvciBFVkVSWSBjb21tZW50IHJvdyBpbiBcXGAke2pzb25sTmFtZX1cXGAsIGRlY2lkZSB3aGljaCBidW5kbGVkIHNraWxscyBhcHBseWApO1xuICBvdXQucHVzaCgnYW5kIGFwcGVuZCBvbmUgYGNvbW1lbnRgIHJvdyB0byBgd29yay1tYW5pZmVzdC5qc29ubGAgY2FycnlpbmcgYScpO1xuICBvdXQucHVzaCgnYG1hcHBlZF9za2lsbHNgIGZpZWxkIHdob3NlIGVudHJpZXMgYXJlIGxvY2F0b3JzIChzZWUgwqczKS4gVGhlIGV4cG9ydCcpO1xuICBvdXQucHVzaCgncHJlLXNlZWRzIGhldXJpc3RpYyBgc3VnZ2VzdGVkU2tpbGxzYCBvbiBlYWNoIGZlZWRiYWNrIHJvdzsgdmVyaWZ5IGFuZCcpO1xuICBvdXQucHVzaCgnY29ycmVjdCB0aGVtLCBkbyBub3QgdHJ1c3QgdGhlbSBibGluZGx5LicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgcGxhbicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdGYW4gb3V0IE9ORSBiYWNrZ3JvdW5kIGF0b21pYyBzdWJhZ2VudCBwZXIgY29tbWVudC4gUGFzcyBlYWNoIHN1YmFnZW50IGEnKTtcbiAgb3V0LnB1c2goJ3N0YW5kYWxvbmUgSlNPTkwgc3ViaW5zdHJ1Y3Rpb24gY29udGFpbmluZyB0aGUgZnVsbCBjb21tZW50IHJvdywgaXRzJyk7XG4gIG91dC5wdXNoKCdwYXJlbnQgc2VsZWN0b3Igcm93LCB0aGUgYnVuZGxlIG1hbmlmZXN0IGxpbmUsIGFuZCB0aGUgRlVMTCBURVhUIG9mIGV2ZXJ5Jyk7XG4gIG91dC5wdXNoKCdtYXBwZWQgc2tpbGwgcHJvbXB0LiBFYWNoIHN1YmFnZW50IHVzZXMgeW91ciBgL3BsYW5gIChwbGFubmluZykgY2FwYWJpbGl0eScpO1xuICBvdXQucHVzaChgZm9yIGl0cyBwaGFzZSwgcG9saXNoZXMgaXRzIHBsYW4gd2l0aCBcXGAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsXFxgLCBhbmRgKTtcbiAgb3V0LnB1c2goYHJldHVybnMgYSBwbGFuIHlvdSBzYXZlIHRvIFxcYHBsYW5zLyR7YnVuZGxlSWR9LzxGRUVEQkFDS19VSUQ+LnBsYW4ubWRcXGAuYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1N1YmFnZW50IHN1Ymluc3RydWN0aW9uIHRlbXBsYXRlIChvbmUgSlNPTkwgZG9jdW1lbnQgcGVyIHN1YmFnZW50OyBoeWRyYXRlJyk7XG4gIG91dC5wdXNoKCdldmVyeSBgPC4uLj5gIGJlZm9yZSBkaXNwYXRjaCk6Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYGpzb25jJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcInBpbmNoZ3JhYi1zdWJhZ2VudC1wbGFuXCIsXCJidW5kbGVJZFwiOlwiJHtidW5kbGVJZH1cIixcImZlZWRiYWNrVWlkXCI6XCI8RkVFREJBQ0tfVUlEPlwifWApO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwiaW5zdHJ1Y3Rpb25cIixcInRleHRcIjpcIllvdSBhcmUgYSBwbGFubmluZyBzdWJhZ2VudCBmb3IgT05FIHVzZXIgY29tcGxhaW50IGFib3V0IGEgbGl2ZSBVSSBlbGVtZW50LiBVc2UgeW91ciAvcGxhbiBjYXBhYmlsaXR5LiBQcm9kdWNlIGFuIGltcGxlbWVudGF0aW9uIHBsYW4gT05MWSDigJQgZG8gbm90IGVkaXQgZmlsZXMuIERlbGl2ZXI6IHJvb3QtY2F1c2UgaHlwb3RoZXNpcywgZXhhY3QgZmlsZXMvc2VsZWN0b3JzIHRvIGNoYW5nZSBpbiA8UFJPSkVDVF9ST09UPiwgc3RlcC1ieS1zdGVwIGVkaXRzLCB0ZXN0IHBsYW4sIGFuZCBob3cgdGhlIGZpeCB3aWxsIGJlIHZpc3VhbGx5IHZlcmlmaWVkIGFnYWluc3QgdGhlIG9yaWdpbmFsIHNjcmVlbnNob3QuIFBvbGlzaCB0aGUgcGxhbiB3aXRoIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGwgYmVmb3JlIHJldHVybmluZyBpdC5cIn0nKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcImNvbW1lbnRcIixcInJvd1wiOjxmdWxsIGZlZWRiYWNrIHJvdyBmcm9tIHRoZSBidW5kbGUgSlNPTkw+fScpO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwidGFyZ2V0XCIsXCJyb3dcIjo8ZnVsbCBwYXJlbnQgc2VsZWN0b3Igcm93IGZyb20gdGhlIGJ1bmRsZSBKU09OTD59Jyk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJtYW5pZmVzdFwiLFwicm93XCI6PHRoZSBidW5kbGUgbWFuaWZlc3QgbGluZT59Jyk7XG4gIG91dC5wdXNoKGB7XCJ0eXBlXCI6XCJzY3JlZW5zaG90XCIsXCJwYXRoXCI6XCIke3hEaXJ9L3NjcmVlbnNob3RzLzxmaWxlPi5wbmdcIn1gKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcInNraWxsXCIsXCJpZFwiOlwiPG1hcHBlZCBza2lsbCBpZD5cIixcInRleHRcIjpcIjxGVUxMIFRFWFQgb2YgdGhlIG1hcHBlZCBza2lsbCBmaWxlPlwifScpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyBpbXBsZW1lbnQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnWU9VIOKAlCB0aGUgZm9yZWdyb3VuZCBhZ2VudCB0aGUgb3BlcmF0b3IgcGFzdGVkIHRoZSBwcm9tcHQgaW50byDigJQgZG8gYWxsJyk7XG4gIG91dC5wdXNoKCdpbXBsZW1lbnRhdGlvbiwgdGVzdCBkZXZlbG9wbWVudCwgdGVzdGluZywgYW5kIGl0ZXJhdGlvbiBpbicpO1xuICBvdXQucHVzaCgnYDxQUk9KRUNUX1JPT1Q+YC4gU3ViYWdlbnRzIG9ubHkgcGxhbi4gV29yayBvbmUgY29tbWVudCBhdCBhIHRpbWUsIHVwZGF0ZScpO1xuICBvdXQucHVzaCgnaXRzIHdvcmstbWFuaWZlc3Qgcm93IHRvIGBpbi1wcm9ncmVzc2AgdGhlbiBgZG9uZWAvYGJsb2NrZWRgLCBhbmQgcG9saXNoJyk7XG4gIG91dC5wdXNoKCd0aGUgaW1wbGVtZW50ZWQgcmVzdWx0IHdpdGggYC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGxgLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgYXVkaXQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnU2VuZCB0aGUgY29tYmluZWQgcGxhbnMgKyBpbXBsZW1lbnRhdGlvbiBmb3IgYSBibGluZCBhdG9taWMgXFwncm9hc3RcXCcgcGVlcicpO1xuICBvdXQucHVzaCgncmV2aWV3IG9mIEJPVEggcGxhbiBhbmQgaW1wbGVtZW50YXRpb24sIHVzaW5nIHdoYXRldmVyIG90aGVyLWFnZW50Jyk7XG4gIG91dC5wdXNoKGBwZWVyLXJldmlldyBza2lsbHMgZXhpc3QgaW4gWU9VUiBPV04gZW52aXJvbm1lbnQuIFdyaXRlIGl0IHRvYCk7XG4gIG91dC5wdXNoKGBcXGBhdWRpdHMvJHtidW5kbGVJZH0vPHJ1bklkPi1yb2FzdC5tZFxcYCBhbmQgYWRkcmVzcyBldmVyeSBibG9ja2VyIGl0IHJhaXNlcy5gKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIHZlcmlmeScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdPbmx5IGFmdGVyIGltcGxlbWVudGF0aW9uIGFuZCBhdWRpdDogc3RhcnQgdGhlIHByb2R1Y3QgbG9jYWxseSwgdGhlbiBydW4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBgYmFzaCcpO1xuICBvdXQucHVzaChgbnB4IC15IHBpbmNoZ3JhYiByZWNhcHR1cmUgJHt4RGlyfS8ke2pzb25sTmFtZX0gPEFQUF9VUkw+IC0td29ya3NwYWNlLWRpciAke3Jvb3R9YCk7XG4gIG91dC5wdXNoKCcjIGJ1bnggd29ya3MgdG9vOyBhZGQgLS1hdXRoLXN0YXRlIDxzdG9yYWdlU3RhdGUuanNvbj4gZm9yIGxvZ2dlZC1pbiBwYWdlcycpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoaXMgcmUtbG9jYXRlcyBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3Igd2l0aCBQaW5jaEdyYWJcXCdzIG93bicpO1xuICBvdXQucHVzaCgnQ1NT4oaSWFBhdGjihpJhMTF5IGNoYWluLCBzY3JlZW5zaG90cyBlYWNoIGVsZW1lbnQsIGFuZCB3cml0ZXMgYW4gYXBwZW5kLW9ubHknKTtcbiAgb3V0LnB1c2goYHJ1biB1bmRlciBcXGByZWNhcHR1cmVzLzxydW5JZD4vXFxgIChwbHVzIGEgXFxgcmVjYXB0dXJlLXJ1blxcYCBsZWRnZXIgcm93KS4gSXRgKTtcbiAgb3V0LnB1c2goJ2V4aXRzIDAgb25seSB3aGVuIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3RvciBzdGlsbCByZXNvbHZlcy4gUmVhZCBlYWNoJyk7XG4gIG91dC5wdXNoKGByZWNhcHR1cmVkIFBORyBuZXh0IHRvIGl0cyBvcmlnaW5hbCBpbiBcXGAke3hEaXJ9L3NjcmVlbnNob3RzL1xcYCBhbmQgY29uZmlybWApO1xuICBvdXQucHVzaCgnZXZlcnkgY29tbWVudCBpcyB2aXNpYmx5IHJlc29sdmVkOyB0aGVuIHVwZGF0ZSB0aGUgbWF0Y2hpbmcnKTtcbiAgb3V0LnB1c2goJ3dvcmstbWFuaWZlc3Qgcm93cyB0byBgZG9uZWAsIG9yIGBibG9ja2VkYCB3aXRoIGEgcmVhc29uLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyA1IMK3IERvbmUgY3JpdGVyaWEnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaChkb25lVGV4dCh7YnVuZGxlSWR9KSk7XG4gIG91dC5wdXNoKCcnKTtcbiAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbn07XG4iLAogICAgIi8vIFNpbmdsZS1jYXB0dXJlIGZ1bGwgZXhwb3J0LlxuLy9cbi8vIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiB3YW50cyBhIENPTVBMRVRFLCBzZWxmLWNvbnRhaW5lZCB0ZXh0dWFsIGV4cG9ydCBvZlxuLy8gT05FIGNhcHR1cmU6IGl0cyBzZWxlY3RvcnMvcGF0aHMsIGVsZW1lbnQgdGV4dC9jb250ZW50LCBvdXRlckhUTUwsXG4vLyBtZXRhZGF0YSwgQU5EIGV2ZXJ5IG5vdGUvY29tbWVudCBhdHRhY2hlZCB0byBpdCDigJQgZXZlcnl0aGluZyBhIGZ1bGxcbi8vIHdvcmtzcGFjZSBleHBvcnQgY2FycmllcywgYnV0IHNjb3BlZCB0byBhIHNpbmdsZSBlbGVtZW50LlxuLy9cbi8vIFRoZSBwYW5lbCBtb2RlbHMgYSBjYXB0dXJlIGFzIGFuIGBFbnRyeWAgKHNyYy90eXBlcy50cykgcGx1cyB6ZXJvIG9yIG1vcmVcbi8vIGBGZWVkYmFja01lc3NhZ2VgIHJvd3MgbGlua2VkIGJhY2sgdmlhIGBwYXJlbnRVaWQg4oaSIEVudHJ5LnVpZGAuIEJlY2F1c2Vcbi8vIG5vdGVzIGxpdmUgb24gc2VwYXJhdGUgcm93cywgdGhlIHNlcmlhbGl6ZXIgdGFrZXMgdGhlIGNhcHR1cmUgZW50cnkgYW5kXG4vLyBpdHMgZmVlZGJhY2sgcm93cyB0b2dldGhlciBzbyB0aGUgSlNPTiBpcyBnZW51aW5lbHkgc2VsZi1jb250YWluZWQg4oCUIGFcbi8vIGNhbGxlciBjYW4gaGFuZCB0aGUgb3V0cHV0IHRvIGFuIGFnZW50IGFuZCBub3RoaW5nIGRhbmdsZXMuXG4vL1xuLy8gR3JvdXAgaGVhZHMgKEFsdCtTaGlmdCtDbGljayBzZWxlY3Rpb25zKSBjYXJyeSBjaGlsZCBjYXB0dXJlcyB1bmRlclxuLy8gYGVudHJ5Lmdyb3VwYDsgd2UgaW5saW5lIHRob3NlIGNoaWxkcmVuICh3aXRoIHRoZWlyIG93biBmZWVkYmFjaykgc28gYVxuLy8gZ3JvdXBlZCBjYXB0dXJlIGV4cG9ydHMgYXMgb25lIGNvbXBsZXRlIG9iamVjdCB0b28uXG4vL1xuLy8gVHdvIG91dHB1dCBmb3JtcywgbWlycm9yaW5nIHRoZSB3b3Jrc3BhY2UgZXhwb3J0J3MgSlNPTiArIGVuZ2xpc2ggc3BsaXQ6XG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVGdWxsKGNhcHR1cmUsIG9wdHMpICAgICDihpIgb2JqZWN0ICAoc3RydWN0dXJlZCwgY29tcGxldGUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVKc29uKGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKHByZXR0eSBKU09OICsgbmV3bGluZSlcbi8vICAgc2VyaWFsaXplQ2FwdHVyZVRleHQoY2FwdHVyZSwgb3B0cykgICAgICDihpIgc3RyaW5nICAobWFya2Rvd24sIGh1bWFuL0xMTSlcbi8vXG4vLyBgY2FwdHVyZWAgYWNjZXB0cyBlaXRoZXI6XG4vLyAgIOKAoiB7IGVudHJ5LCBmZWVkYmFjaz8sIG1lbWJlcnM/IH0gIOKAlCBleHBsaWNpdCBzaGFwZSwgT1Jcbi8vICAg4oCiIGEgYmFyZSBgRW50cnlgICAgICAgICAgICAgICAgICAg4oCUIGZlZWRiYWNrIGRlZmF1bHRzIHRvIFtdXG4vL1xuLy8gT3V0cHV0IGlzIGRldGVybWluaXN0aWM6IGlkZW50aWNhbCBpbnB1dCDihpIgYnl0ZS1pZGVudGljYWwgb3V0cHV0LiBOb1xuLy8gdGltZXN0YW1wcyBhcmUgaW5qZWN0ZWQ7IG9ubHkgdGhlIGNhcHR1cmUncyBvd24gYHRzYCBmaWVsZHMgYXBwZWFyLlxuXG4vLyDilIDilIDilIAgSW5wdXQgbm9ybWFsaXphdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gQWNjZXB0IGEgYmFyZSBFbnRyeSBvciBhIHtlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnN9IHdyYXBwZXIgYW5kIHJldHVybiBhXG4vLyBub3JtYWxpemVkIHtlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnN9IHdpdGggYXJyYXlzIGFsd2F5cyBwcmVzZW50LlxuY29uc3Qgbm9ybWFsaXplQ2FwdHVyZSA9IChjYXB0dXJlKSA9PiB7XG4gIGlmICghY2FwdHVyZSB8fCB0eXBlb2YgY2FwdHVyZSAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInNlcmlhbGl6ZUNhcHR1cmVGdWxsOiBjYXB0dXJlIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIC8vIEJhcmUgRW50cnk6IGl0IGhhcyBhIGBzZWxlY3RvcmAgLyBgdWlkYCBidXQgbm8gbmVzdGVkIGBlbnRyeWAuXG4gIGNvbnN0IGVudHJ5ID0gY2FwdHVyZS5lbnRyeSA/PyBjYXB0dXJlO1xuICBpZiAoIWVudHJ5IHx8IHR5cGVvZiBlbnRyeSAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInNlcmlhbGl6ZUNhcHR1cmVGdWxsOiBjYXB0dXJlIGhhcyBubyBlbnRyeVwiKTtcbiAgfVxuICBjb25zdCBmZWVkYmFjayA9IEFycmF5LmlzQXJyYXkoY2FwdHVyZS5mZWVkYmFjaykgPyBjYXB0dXJlLmZlZWRiYWNrIDogW107XG4gIC8vIEdyb3VwIG1lbWJlcnMgbWF5IGJlIHN1cHBsaWVkIGV4cGxpY2l0bHksIGVsc2UgZmFsbCBiYWNrIHRvIHRoZSBlbnRyeSdzXG4gIC8vIG93biBgZ3JvdXBgIGFycmF5ICh0aGUgcGFuZWwgc3RvcmVzIGNoaWxkIGNhcHR1cmVzIHRoZXJlKS5cbiAgY29uc3QgbWVtYmVycyA9IEFycmF5LmlzQXJyYXkoY2FwdHVyZS5tZW1iZXJzKVxuICAgID8gY2FwdHVyZS5tZW1iZXJzXG4gICAgOiBBcnJheS5pc0FycmF5KGVudHJ5Lmdyb3VwKVxuICAgICAgPyBlbnRyeS5ncm91cFxuICAgICAgOiBbXTtcbiAgcmV0dXJuIHsgZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzIH07XG59O1xuXG4vLyBBIGZlZWRiYWNrIHJvdyBzY29wZWQgdG8gYSBzaW5nbGUgY2FwdHVyZS4gU3RyaXBzIHJvdXRpbmcvVUkgY3J1ZnRcbi8vIChpZCwgdHlwZSkgYW5kIGtlZXBzIG9ubHkgd2hhdCBhIHJldmlld2VyIG5lZWRzOiB0aGUgdGV4dCwgd2hlbiBpdCB3YXNcbi8vIHdyaXR0ZW4sIGFueSB0YWdzLCBhbmQgdGhlIHBhcmVudCBsaW5rIGZvciB0cmFjZWFiaWxpdHkuXG5jb25zdCBzbGltQ29tbWVudCA9IChmYikgPT4ge1xuICBjb25zdCBvdXQgPSB7IHRleHQ6IHR5cGVvZiBmYi50ZXh0ID09PSBcInN0cmluZ1wiID8gZmIudGV4dCA6IFwiXCIgfTtcbiAgaWYgKGZiLnRzKSBvdXQudHMgPSBmYi50cztcbiAgaWYgKGZiLnVpZCkgb3V0LnVpZCA9IGZiLnVpZDtcbiAgaWYgKGZiLnBhcmVudFVpZCkgb3V0LnBhcmVudFVpZCA9IGZiLnBhcmVudFVpZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGgpIG91dC50YWdzID0gZmIudGFncztcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIENvbGxlY3QgdGhlIHBhdGhzL3NlbGVjdG9ycyBmb3IgYSBjYXB0dXJlIGludG8gb25lIGJsb2NrIHNvIGV2ZXJ5IHdheSBvZlxuLy8gbG9jYXRpbmcgdGhlIGVsZW1lbnQgaXMgaW4gYSBzaW5nbGUsIG9idmlvdXMgcGxhY2UuIFRvbGVyYW50IG9mIGJvdGggdGhlXG4vLyBwYW5lbCBgRW50cnlgIHNoYXBlIChmbGF0IGBzZWxlY3RvcmAgKyBgaWRgL2B0ZXN0SWRgKSBhbmQgdGhlIHJpY2hlclxuLy8gYHNlbGVjdG9yc2Agc3ViLW9iamVjdCBzb21lIGNhcHR1cmUgcGlwZWxpbmVzIGVtaXQuXG5jb25zdCBjb2xsZWN0UGF0aHMgPSAoZW50cnkpID0+IHtcbiAgY29uc3QgcGF0aHMgPSB7fTtcbiAgaWYgKGVudHJ5LnNlbGVjdG9yKSBwYXRocy5jc3MgPSBlbnRyeS5zZWxlY3RvcjtcbiAgY29uc3Qgc2VsID0gZW50cnkuc2VsZWN0b3JzO1xuICBpZiAoc2VsICYmIHR5cGVvZiBzZWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICBpZiAoc2VsLmNzcyAmJiBzZWwuY3NzICE9PSBwYXRocy5jc3MpIHBhdGhzLmNzc0Z1bGwgPSBzZWwuY3NzO1xuICAgIGlmIChzZWwuY29tcGFjdCkgcGF0aHMuY29tcGFjdCA9IHNlbC5jb21wYWN0O1xuICAgIGlmIChzZWwueHBhdGgpIHBhdGhzLnhwYXRoID0gc2VsLnhwYXRoO1xuICAgIGlmIChzZWwuZGF0YUlkcykgcGF0aHMuZGF0YUlkcyA9IHNlbC5kYXRhSWRzO1xuICB9XG4gIGlmIChlbnRyeS5jb21wb25lbnRSb290KSBwYXRocy5jb21wb25lbnRSb290ID0gZW50cnkuY29tcG9uZW50Um9vdDtcbiAgaWYgKGVudHJ5LnNoYWRvd0hvc3QpIHBhdGhzLnNoYWRvd0hvc3QgPSBlbnRyeS5zaGFkb3dIb3N0O1xuICBpZiAoZW50cnkuaWQpIHBhdGhzLmRvbUlkID0gZW50cnkuaWQ7XG4gIGlmIChlbnRyeS50ZXN0SWQpIHBhdGhzLnRlc3RJZCA9IGVudHJ5LnRlc3RJZDtcbiAgaWYgKHR5cGVvZiBlbnRyeS5zZWxlY3Rvck1hdGNoQ291bnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICBwYXRocy5tYXRjaENvdW50ID0gZW50cnkuc2VsZWN0b3JNYXRjaENvdW50O1xuICB9XG4gIHJldHVybiBwYXRocztcbn07XG5cbi8vIOKUgOKUgOKUgCBGdWxsIHN0cnVjdHVyZWQgZm9ybSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gQnVpbGQgdGhlIGNvbXBsZXRlIG9iamVjdCBmb3IgT05FIGNhcHR1cmUuIEV2ZXJ5dGhpbmcgdGV4dHVhbCB0aGVcbi8vIHdvcmtzcGFjZSBleHBvcnQgd291bGQgY2FycnkgZm9yIHRoaXMgZWxlbWVudCwgd2l0aCBub3Rlcy9jb21tZW50c1xuLy8gaW5saW5lZC4gR3JvdXAgbWVtYmVycyByZWN1cnNlIHNvIGEgZ3JvdXBlZCBjYXB0dXJlIGlzIHNlbGYtY29udGFpbmVkLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVGdWxsID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcblxuICBjb25zdCBvdXQgPSB7XG4gICAga2luZDogXCJwaW5jaGdyYWIvY2FwdHVyZS1mdWxsXCIsXG4gICAgdjogMSxcbiAgfTtcbiAgaWYgKGVudHJ5LnVpZCkgb3V0LnVpZCA9IGVudHJ5LnVpZDtcbiAgaWYgKGVudHJ5Lm4gIT09IHVuZGVmaW5lZCkgb3V0Lm4gPSBlbnRyeS5uO1xuICBpZiAoZW50cnkudHMpIG91dC50cyA9IGVudHJ5LnRzO1xuICBpZiAoZW50cnkudXJsKSBvdXQudXJsID0gZW50cnkudXJsO1xuICBpZiAoZW50cnkudGFnKSBvdXQudGFnID0gZW50cnkudGFnO1xuXG4gIC8vIElkZW50aXR5IC8gYTExeSBuYW1pbmcuXG4gIGNvbnN0IGlkZW50aXR5ID0ge307XG4gIGlmIChlbnRyeS5yb2xlICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LnJvbGUgPSBlbnRyeS5yb2xlO1xuICBpZiAoZW50cnkuYWNjZXNzaWJsZU5hbWUgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuYWNjZXNzaWJsZU5hbWUgPSBlbnRyeS5hY2Nlc3NpYmxlTmFtZTtcbiAgaWYgKGVudHJ5LnRlc3RJZCAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmIChlbnRyeS5pZCAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5pZCA9IGVudHJ5LmlkO1xuICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeS5jbGFzc2VzKSAmJiBlbnRyeS5jbGFzc2VzLmxlbmd0aCkgaWRlbnRpdHkuY2xhc3NlcyA9IGVudHJ5LmNsYXNzZXM7XG4gIGlmIChPYmplY3Qua2V5cyhpZGVudGl0eSkubGVuZ3RoKSBvdXQuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxuICAvLyBQYXRocyDigJQgZXZlcnkgd2F5IHRvIGxvY2F0ZSB0aGUgZWxlbWVudC5cbiAgY29uc3QgcGF0aHMgPSBjb2xsZWN0UGF0aHMoZW50cnkpO1xuICBpZiAoT2JqZWN0LmtleXMocGF0aHMpLmxlbmd0aCkgb3V0LnBhdGhzID0gcGF0aHM7XG5cbiAgLy8gVGV4dCAvIGNvbnRlbnQuIFdlIGtlZXAgYWxsIHRleHR1YWwgc3VyZmFjZXMgc28gbm90aGluZyB0aGUgdXNlciBjYW5cbiAgLy8gc2VlIGlzIGxvc3Q6IHNvdXJjZSB0ZXh0LCB0aGUgQ1NTLXJlbmRlcmVkIGZvcm0sIGFuZCB0aGUgbWFya3VwLlxuICBjb25zdCBjb250ZW50ID0ge307XG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQudGV4dCA9IGVudHJ5LnRleHQ7XG4gIGlmIChlbnRyeS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgY29udGVudC5yZW5kZXJlZFRleHQgPSBlbnRyeS5yZW5kZXJlZFRleHQ7XG4gIGlmIChlbnRyeS52YWx1ZSAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnZhbHVlID0gZW50cnkudmFsdWU7XG4gIGlmIChlbnRyeS5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnBsYWNlaG9sZGVyID0gZW50cnkucGxhY2Vob2xkZXI7XG4gIGlmIChlbnRyeS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkgY29udGVudC5vdXRlckhUTUwgPSBlbnRyeS5vdXRlckhUTUw7XG4gIGlmIChPYmplY3Qua2V5cyhjb250ZW50KS5sZW5ndGgpIG91dC5jb250ZW50ID0gY29udGVudDtcblxuICAvLyBOb3RlcyAvIGNvbW1lbnRzIGF0dGFjaGVkIHRvIHRoaXMgY2FwdHVyZS5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkgb3V0LmNvbW1lbnRzID0gZmVlZGJhY2subWFwKHNsaW1Db21tZW50KTtcblxuICAvLyBSZW1haW5pbmcgc3RydWN0dXJlZCBtZXRhZGF0YSBhbiBhZ2VudCBtYXkgd2FudCDigJQgY29waWVkIHRocm91Z2hcbiAgLy8gdmVyYmF0aW0gc28gdGhpcyBleHBvcnQgaXMgYXMgY29tcGxldGUgYXMgdGhlIEpTT05MIHJvdy4gV2UgYWxsb3ctbGlzdFxuICAvLyB0aGUgaGVhdnkvc3RydWN0dXJlZCBmaWVsZHMgcmF0aGVyIHRoYW4gZHVtcGluZyB0aGUgd2hvbGUgRW50cnkgc28gdGhlXG4gIC8vIG91dHB1dCBvcmRlcmluZyBzdGF5cyBzdGFibGUgYW5kIG9idmlvdXMuXG4gIGNvbnN0IG1ldGEgPSB7fTtcbiAgY29uc3QgcGFzc3Rocm91Z2ggPSBbXG4gICAgXCJyZWN0XCIsIFwidmlld3BvcnRcIiwgXCJzdGF0ZXNcIiwgXCJhdHRyc1wiLCBcImhpbnRzXCIsIFwiY29tcG9uZW50XCIsIFwiZXZlbnRzXCIsXG4gICAgXCJiZWhhdmlvckF0dHJzXCIsIFwiYTExeVwiLCBcImFzc2V0c1wiLCBcImxheW91dENvbnRleHRcIiwgXCJzdHlsZXNcIixcbiAgICBcIm1hdGNoZWRSdWxlc1wiLCBcImFuY2VzdG9yc1wiLCBcInNjcmVlbnNob3RcIiwgXCJ0cnVuY2F0ZWRcIiwgXCJzZXNzaW9uSWRcIixcbiAgICBcImNhbnZhc0NsaWNrXCIsIFwiZWRpdG9yXCIsIFwiZG9tTXV0YXRpb25zXCIsIFwiaXNBbmltYXRpbmdcIixcbiAgXTtcbiAgZm9yIChjb25zdCBrZXkgb2YgcGFzc3Rocm91Z2gpIHtcbiAgICBpZiAoZW50cnlba2V5XSAhPT0gdW5kZWZpbmVkKSBtZXRhW2tleV0gPSBlbnRyeVtrZXldO1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhtZXRhKS5sZW5ndGgpIG91dC5tZXRhID0gbWV0YTtcblxuICAvLyBHcm91cCBtZW1iZXJzOiByZWN1cnNlIHNvIGVhY2ggY2hpbGQgY2FwdHVyZSBpcyBmdWxseSBzZXJpYWxpemVkIHRvby5cbiAgLy8gQSBtZW1iZXIgbWF5IGNhcnJ5IGl0cyBvd24gZmVlZGJhY2sgd2hlbiB0aGUgY2FsbGVyIHN1cHBsaWVzIGFcbiAgLy8ge2VudHJ5LCBmZWVkYmFja30gcGFpcjsgYmFyZSBjaGlsZCBFbnRyaWVzIHNlcmlhbGl6ZSB3aXRoIG5vIGNvbW1lbnRzLlxuICBpZiAobWVtYmVycy5sZW5ndGgpIHtcbiAgICBvdXQubWVtYmVycyA9IG1lbWJlcnMubWFwKChtKSA9PiBzZXJpYWxpemVDYXB0dXJlRnVsbChtLCBvcHRzKSk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gUHJldHR5IEpTT04gc3RyaW5nIGZvciB0aGUgXCJDb3B5IGNhcHR1cmUgYXMgSlNPTlwiIGJ1dHRvbi4gVHJhaWxpbmdcbi8vIG5ld2xpbmUgc28gaXQgcm91bmQtdHJpcHMgY2xlYW5seSB0aHJvdWdoIGVkaXRvcnMgLyBgcGJwYXN0ZWAuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplQ2FwdHVyZUpzb24gPSAoY2FwdHVyZSwgb3B0cyA9IHt9KSA9PlxuICBKU09OLnN0cmluZ2lmeShzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSwgbnVsbCwgMikgKyBcIlxcblwiO1xuXG4vLyDilIDilIDilIAgU2luZ2xlLWNhcHR1cmUgbWFya2Rvd24gZm9ybSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vXG4vLyBNYXRjaGVzIHRoZSB3b3Jrc3BhY2UgZXhwb3J0J3MgZW5nbGlzaC9tYXJrZG93biBzdXJmYWNlIGJ1dCBzY29wZWQgdG8gb25lXG4vLyBjYXB0dXJlLiBVc2VmdWwgd2hlbiB0aGUgdXNlciB3YW50cyB0byBwYXN0ZSBhIGh1bWFuLXJlYWRhYmxlIGNhcmQgcmF0aGVyXG4vLyB0aGFuIHJhdyBKU09OLlxuXG5jb25zdCBoZWFkaW5nID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IG5hbWUgPVxuICAgIGVudHJ5LmFjY2Vzc2libGVOYW1lIHx8XG4gICAgZW50cnkudGVzdElkIHx8XG4gICAgZW50cnkuaWQgfHxcbiAgICBlbnRyeS5zZWxlY3RvciB8fFxuICAgIGVudHJ5LnRhZyB8fFxuICAgIFwiY2FwdHVyZVwiO1xuICBjb25zdCBsYWJlbCA9IGVudHJ5Lm4gIT09IHVuZGVmaW5lZCA/IGBDYXB0dXJlICMke2VudHJ5Lm59YCA6IFwiQ2FwdHVyZVwiO1xuICByZXR1cm4gYCR7bGFiZWx9OiAke25hbWV9YDtcbn07XG5cbmNvbnN0IHJlbmRlclBhdGhzID0gKHBhdGhzKSA9PiB7XG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHBhdGhzKSkge1xuICAgIGxpbmVzLnB1c2goYC0gKioke2t9OioqIFxcYCR7dn1cXGBgKTtcbiAgfVxuICByZXR1cm4gbGluZXM7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplQ2FwdHVyZVRleHQgPSAoY2FwdHVyZSwgb3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzIH0gPSBub3JtYWxpemVDYXB0dXJlKGNhcHR1cmUpO1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBsaW5lcy5wdXNoKGAjICR7aGVhZGluZyhlbnRyeSl9YCwgXCJcIik7XG4gIGlmIChlbnRyeS51cmwpIGxpbmVzLnB1c2goYFBhZ2U6IDwke2VudHJ5LnVybH0+YCwgXCJcIik7XG4gIGlmIChlbnRyeS50YWcpIGxpbmVzLnB1c2goYEVsZW1lbnQ6IFxcYDwke2VudHJ5LnRhZ30+XFxgYCwgXCJcIik7XG5cbiAgY29uc3QgcGF0aHMgPSBjb2xsZWN0UGF0aHMoZW50cnkpO1xuICBpZiAoT2JqZWN0LmtleXMocGF0aHMpLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBQYXRoc1wiLCBcIlwiLCAuLi5yZW5kZXJQYXRocyhwYXRocykpO1xuICB9XG5cbiAgaWYgKGVudHJ5LnRleHQgIT09IHVuZGVmaW5lZCB8fCBlbnRyeS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBUZXh0XCIsIFwiXCIpO1xuICAgIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQpIGxpbmVzLnB1c2goYFNvdXJjZTogJHtKU09OLnN0cmluZ2lmeShlbnRyeS50ZXh0KX1gKTtcbiAgICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQgJiYgZW50cnkucmVuZGVyZWRUZXh0ICE9PSBlbnRyeS50ZXh0KSB7XG4gICAgICBsaW5lcy5wdXNoKGBSZW5kZXJlZDogJHtKU09OLnN0cmluZ2lmeShlbnRyeS5yZW5kZXJlZFRleHQpfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbnRyeS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBNYXJrdXBcIiwgXCJcIiwgXCJgYGBodG1sXCIsIGVudHJ5Lm91dGVySFRNTCwgXCJgYGBcIik7XG4gIH1cblxuICBpZiAoZmVlZGJhY2subGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIE5vdGVzICYgY29tbWVudHNcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBmYiBvZiBmZWVkYmFjaykge1xuICAgICAgY29uc3QgdGV4dCA9IHR5cGVvZiBmYi50ZXh0ID09PSBcInN0cmluZ1wiID8gZmIudGV4dCA6IFwiXCI7XG4gICAgICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShmYi50YWdzKSAmJiBmYi50YWdzLmxlbmd0aCA/IGAgXygke2ZiLnRhZ3Muam9pbihcIiwgXCIpfSlfYCA6IFwiXCI7XG4gICAgICBsaW5lcy5wdXNoKGAtICR7dGV4dH0ke3RhZ3N9YCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIEdyb3VwZWQgd2l0aFwiLCBcIlwiKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVtYmVycykge1xuICAgICAgY29uc3QgbWUgPSBub3JtYWxpemVDYXB0dXJlKG0pLmVudHJ5O1xuICAgICAgbGluZXMucHVzaChgLSAke2hlYWRpbmcobWUpfSDigJQgXFxgJHttZS5zZWxlY3RvciA/PyBtZS50YWcgPz8gXCI/XCJ9XFxgYCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzLmpvaW4oXCJcXG5cIikgKyBcIlxcblwiO1xufTtcbiIsCiAgICAiLy8gUGluY2hHcmFiIHNpZGUtcGFuZWwgVUkuIFJlY2VpdmVzIGNhcHR1cmVzICsgaG92ZXJzIGZyb20gdGhlIGNvbnRlbnRcbi8vIHNjcmlwdDsgcmVuZGVycyB0aGUgY2hhdC1idWJibGUgdGltZWxpbmUsIGV4cG9ydHMsIHZhbGlkYXRlcywgZXRjLlxuLy9cbi8vIERlY29tcG9zZWQgaW50byBzbWFsbCBmaWxlcyBmb3IgY2xhcml0eTpcbi8vICAg4oCiIHR5cGVzLnRzICAgICAg4oCUIHNoYXJlZCB0eXBlcywgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgbHVjaWRlLnRzICAgICDigJQgaWNvbiByZWdpc3RyeVxuLy8gICDigKIgdGhpcyBmaWxlICAgICDigJQgd2lyZS11cCAvIHJlbmRlcmluZyAvIGV4cG9ydCBidWlsZGVyc1xuLy9cbi8vIExvYWRlZCBhcyB0aGUgc2lkZSBwYW5lbCBwYWdlOiBjaHJvbWUuc2lkZVBhbmVsIGRlZmF1bHRfcGF0aC5cblxuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCwgQ3NUb1BhbmVsLCBFbnRyeSwgRXhwb3J0RGlhZ25vc3RpYywgRXhwb3J0TWFuaWZlc3QsIEZlZWRiYWNrTWVzc2FnZSwgUGFnZU1lc3NhZ2UsXG4gIFBhZ2VTbmFwc2hvdCwgUGFuZWxNZXNzYWdlLCBQYW5lbFRvQmcsIFBhbmVsVG9DcywgUGdFbnZlbG9wZSwgU2F2ZVJlcGx5LCBTZWxlY3Rvck1lc3NhZ2UsIFNob3RSZXBseSwgVmlld3BvcnQsXG59IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge1BHX0lDT05TfSBmcm9tICcuL2x1Y2lkZS50cyc7XG5pbXBvcnQge2J1aWxkVGFyLCB3cmFwWnN0ZCwgdHlwZSBUYXJFbnRyeX0gZnJvbSAnLi90YXIudHMnO1xuaW1wb3J0IHtURU1QTEFURVNfUFJFU0VOVH0gZnJvbSAnLi90ZW1wbGF0ZXMuZ2VuLnRzJztcbmltcG9ydCB7QlVORExFRF9TS0lMTFNfUFJFU0VOVCwgQlVORExFRF9TS0lMTF9GSUxFU30gZnJvbSAnLi9idW5kbGVkLXNraWxscy5nZW4udHMnO1xuaW1wb3J0IHtidWlsZEFnZW50UHJvbXB0SnNvbmwsIGJ1aWxkQWdlbnRQcm90b2NvbE1kLCBidWlsZEJ1bmRsZUlnbm9yZSwgaXNTaWduYWxQYXRoLCB0eXBlIFNraWxsc0luZGV4fSBmcm9tICcuL2V4cG9ydC1hZ2VudC1wcm9tcHQubWpzJztcbmltcG9ydCB7c2VyaWFsaXplQ2FwdHVyZUpzb259IGZyb20gJy4vZXhwb3J0LWNhcHR1cmUubWpzJztcblxuKCgpID0+IHtcbiAgY29uc3QgTE9HID0gJ1tQaW5jaEdyYWIvc3BdJztcbiAgY29uc3QgUFJFRlNfU1RPUkFHRV9OQU1FID0gJ3BpbmNoZ3JhYi5wcmVmcy52Mic7XG4gIGNvbnN0IFdPUktTUEFDRVNfS0VZID0gJ3BpbmNoZ3JhYi53b3Jrc3BhY2VzLnYxJztcbiAgY29uc3QgaW5FeHRlbnNpb24gPSB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKGNocm9tZS5ydW50aW1lPy5pZCk7XG5cbiAgLy8g4pSA4pSA4pSAIFRlbXBsYXRlIHJlc291cmNlIGxvYWRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRWFybGllciB0aGUgdGVtcGxhdGVzIHdlcmUgYmFrZWQgYXMgc3RyaW5nIGNvbnN0YW50cyBpbnRvIHRoaXMgSUlGRVxuICAvLyAofjM2MEtCIGFjcm9zcyBERVNJR04gKyBTS0lMTCkuIFRoYXQgYmxvYXRlZCB0aGUgc2lkZXBhbmVsIGJ1bmRsZSB0b1xuICAvLyB+MS45NU1CIGFuZCBzbG93ZWQgZmlyc3Qtb3BlbiBwYXJzZSB0aW1lIG5vdGljZWFibHkuIFRoZXkgbm93IHNoaXAgYXNcbiAgLy8gc2VwYXJhdGUgYC5tZGAgZmlsZXMgdW5kZXIgYGV4dGVuc2lvbi90ZW1wbGF0ZXMvYCBhbmQgbG9hZCBvbiBkZW1hbmRcbiAgLy8gdmlhIGZldGNoIOKAlCB3aGVuIHRoZSB1c2VyIG9wZW5zIHRoZSBlZGl0b3IgbW9kYWwsIG9yIHdoZW4gdGhlIGV4cG9ydFxuICAvLyBwaXBlbGluZSBuZWVkcyB0byBidW5kbGUgYSBmYWxsYmFjay5cbiAgLy9cbiAgLy8gQ2FjaGUgcmVzdWx0cyBpbi1wcm9jZXNzIHNvIHJlcGVhdCByZWFkcyAobW9kYWwgb3BlbiDihpIgY2xvc2Ug4oaSIHJlb3BlbixcbiAgLy8gb3Igc2VxdWVudGlhbCBleHBvcnRzKSBkb24ndCByZS1mZXRjaC5cbiAgY29uc3QgdGVtcGxhdGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IFRFTVBMQVRFX0ZJTEVTID0ge1xuICAgIGRlc2lnblRlbXBsYXRlOiAnREVTSUdOLnRlbXBsYXRlLm1kJyxcbiAgICBza2lsbFRlbXBsYXRlOiAnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJyxcbiAgICBsb2NhbERlc2lnbjogJ2xvY2FsLkRFU0lHTi5tZCcsXG4gICAgbG9jYWxTa2lsbDogJ2xvY2FsLlNLSUxMLm1kJyxcbiAgfSBhcyBjb25zdDtcbiAgdHlwZSBUZW1wbGF0ZUtleSA9IGtleW9mIHR5cGVvZiBURU1QTEFURV9GSUxFUztcbiAgY29uc3QgdGVtcGxhdGVVcmwgPSAoZmlsZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAvLyBJbnNpZGUgdGhlIGV4dGVuc2lvbiwgdGhlIHNpZGVwYW5lbCBydW5zIGZyb21cbiAgICAvLyBjaHJvbWUtZXh0ZW5zaW9uOi8vPGlkPi9zaWRlcGFuZWwuaHRtbCwgc28gcmVzb3VyY2VzIHJlc29sdmUgdmlhXG4gICAgLy8gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMLiBUaGUgUGxheXdyaWdodCBzdGF0aWMtc2VydmVyIHRlc3RzIHNlcnZlXG4gICAgLy8gYC90ZW1wbGF0ZXMvPGZpbGU+YCBmcm9tIHRoZSBleHRlbnNpb24gcm9vdCBkaXJlY3RseSwgc28gYVxuICAgIC8vIHJlbGF0aXZlIFVSTCB3b3JrcyB0aGVyZSBhcyBhIGZhbGxiYWNrLlxuICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0VVJMKSB7XG4gICAgICByZXR1cm4gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKGB0ZW1wbGF0ZXMvJHtmaWxlfWApO1xuICAgIH1cbiAgICByZXR1cm4gYHRlbXBsYXRlcy8ke2ZpbGV9YDtcbiAgfTtcbiAgY29uc3QgbG9hZFRlbXBsYXRlID0gYXN5bmMgKGtleTogVGVtcGxhdGVLZXkpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmICghVEVNUExBVEVTX1BSRVNFTlRba2V5XSkgcmV0dXJuICcnO1xuICAgIGNvbnN0IGZpbGUgPSBURU1QTEFURV9GSUxFU1trZXldO1xuICAgIGNvbnN0IGNhY2hlZCA9IHRlbXBsYXRlQ2FjaGUuZ2V0KGZpbGUpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godGVtcGxhdGVVcmwoZmlsZSkpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgc3RhdHVzICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgdGV4dCk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csIGB0ZW1wbGF0ZSBmZXRjaCBmYWlsZWQ6ICR7ZmlsZX1gLCBlcnIpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgJycpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfTtcbiAgLy8gRWZmZWN0aXZlIGNvbnRlbnQgdXNlZCBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIGFuZCB0aGUgbW9kYWwuIFdoZW4gdGhlXG4gIC8vIHVzZXIgaGFzIGN1c3RvbWl6ZWQgdmlhIHRoZSB0ZXh0YXJlYS91cGxvYWQsIHRoYXQgd2luczsgb3RoZXJ3aXNlIHRoZVxuICAvLyBQTEFJTiBTVE9DSyB0ZW1wbGF0ZS4gVGhlIG9sZCBgbG9jYWwuKmAgZGV2LW92ZXJyaWRlIHByZWZlcmVuY2UgaXNcbiAgLy8gZ29uZSAob3BlcmF0b3IgcnVsaW5nIDIwMjYtMDctMTEpOiBpdCBzaWxlbnRseSBzdWJzdGl0dXRlZCB0aGVcbiAgLy8gZGV2ZWxvcGVyJ3Mgb3duIGJyYW5kIGZpbGVzIGFzIHRoZSBcImRlZmF1bHRcIiwgY29udGFtaW5hdGluZyBleHBvcnRzXG4gIC8vIHRoYXQgdGhlIG1hbmlmZXN0IHN0aWxsIGZsYWdnZWQgYXMgYnVuZGxlZC1kZWZhdWx0IGNvbnRlbnQuXG4gIGNvbnN0IHJlc29sdmVEZXNpZ25Db250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLmRlc2lnbk1kICYmIHByZWZzLmRlc2lnbk1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLmRlc2lnbk1kO1xuICAgIHJldHVybiBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJyk7XG4gIH07XG4gIGNvbnN0IHJlc29sdmVTa2lsbENvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuc2tpbGxNZCAmJiBwcmVmcy5za2lsbE1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLnNraWxsTWQ7XG4gICAgcmV0dXJuIGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpO1xuICB9O1xuICAvLyBUcnVlIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oaSIHByZWZzLntkZXNpZ25NZHxza2lsbE1kfSBpc1xuICAvLyBlbXB0eSBhbmQgd2UncmUgZmFsbGluZyBiYWNrIHRvIGEgYnVuZGxlZCB0ZW1wbGF0ZS9sb2NhbCByZXNvdXJjZS5cbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlRGVzaWduID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLmRlc2lnbk1kIHx8ICFwcmVmcy5kZXNpZ25NZC50cmltKCk7XG4gIGNvbnN0IGlzVXNpbmdUZW1wbGF0ZVNraWxsID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLnNraWxsTWQgfHwgIXByZWZzLnNraWxsTWQudHJpbSgpO1xuXG4gIC8vIFZlbmRvcmVkIHRoaXJkLXBhcnR5IHNraWxsIHJlc291cmNlcyAoaW1wZWNjYWJsZSByZWZlcmVuY2Ugc2V0ICtcbiAgLy8gcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24pLCBzaGlwcGVkIHVuZGVyIGV4dGVuc2lvbi9za2lsbHMvIGJ5IHRoZSBidWlsZFxuICAvLyBhbmQgaW5saW5lZCBpbnRvIGJ1bmRsZSBleHBvcnRzLiBTYW1lIGxhenkgZmV0Y2ggKyBjYWNoZSBwYXR0ZXJuIGFzIHRoZVxuICAvLyB0ZW1wbGF0ZXMgYWJvdmUuXG4gIGNvbnN0IGJ1bmRsZWRTa2lsbENhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgbG9hZEJ1bmRsZWRTa2lsbEZpbGUgPSBhc3luYyAoZXh0UGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiA9PiB7XG4gICAgY29uc3QgY2FjaGVkID0gYnVuZGxlZFNraWxsQ2FjaGUuZ2V0KGV4dFBhdGgpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdXJsID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCA/IGNocm9tZS5ydW50aW1lLmdldFVSTChleHRQYXRoKSA6IGV4dFBhdGg7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgc3RhdHVzICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgYnVuZGxlZFNraWxsQ2FjaGUuc2V0KGV4dFBhdGgsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgYnVuZGxlZCBza2lsbCBmZXRjaCBmYWlsZWQ6ICR7ZXh0UGF0aH1gLCBlcnIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdG9yYWdlIGFkYXB0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IFN0b3JlID0ge1xuICAgIGFzeW5jIGdldDxUPihrZXk6IHN0cmluZywgZmFsbGJhY2s6IFQpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgY29uc3QgbyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXkpOyByZXR1cm4gKG9ba2V5XSBhcyBUKSA/PyBmYWxsYmFjazsgfVxuICAgICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgICAgfVxuICAgICAgdHJ5IHsgY29uc3QgciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7IHJldHVybiByID09PSBudWxsID8gZmFsbGJhY2sgOiAoSlNPTi5wYXJzZShyKSBhcyBUKTsgfVxuICAgICAgY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbiAgICB9LFxuICAgIGFzeW5jIHNldChrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtba2V5XTogdmFsdWV9KTsgcmV0dXJuOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIH1cbiAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSxcbiAgfTtcblxuICAvLyDilIDilIDilIAgRE9NIHJlZnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0ICQgPSA8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oczogc3RyaW5nKTogVCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHMpIGFzIFQ7XG4gIGNvbnN0IGxpc3QgPSAkKCdbZGF0YS1saXN0XScpO1xuICBjb25zdCBjb21wb3NlciA9ICQ8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLWNvbXBvc2VyXScpO1xuICBjb25zdCBzdGF0dXMgPSAkKCdbZGF0YS1zdGF0dXNdJyk7XG4gIGNvbnN0IHNlYXJjaCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNlYXJjaF0nKTtcbiAgLy8gQ3RybCtGIHZpc3VhbC1maW5kIGJhciAoZGlzdGluY3QgZnJvbSB0aGUgaGVhZGVyIHNlYXJjaCwgd2hpY2ggb3BlbnMgdGhlXG4gIC8vIGNvbW1hbmQgcGFsZXR0ZSkuIE1heSBiZSBhYnNlbnQgaW4gdmVyeSBvbGQgY2FjaGVkIG1hcmt1cCwgc28gY29uc3VtZXJzXG4gIC8vIG51bGwtZ3VhcmQuXG4gIGNvbnN0IGZpbmRCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZmluZC1iYXJdJyk7XG4gIGNvbnN0IGZpbmRJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLWZpbmRdJyk7XG4gIGNvbnN0IGZpbmRDb3VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1maW5kLWNvdW50XScpO1xuICAvLyBDYW5vbmljYWxpemUga2V5Ym9hcmQtc2hvcnRjdXQgcGlsbHMgcGVyIHBsYXRmb3JtLiBFdmVyeSBzaG9ydGN1dCBwaWxsXG4gIC8vIGlzIGF1dGhvcmVkIGluIHRoZSBjYW5vbmljYWwgQ21kLWZvcm0gKGVhY2ggdG9rZW4gY2FwaXRhbGl6ZWQsIGpvaW5lZFxuICAvLyB3aXRoICcrJzogQWx0K0NsaWNrLCBDbWQrSywgQ21kK1NoaWZ0K1opOyBvbiBub24tTWFjIHdlIHN3YXAgdGhlIGxlYWRpbmdcbiAgLy8gQ21kIG1vZGlmaWVyIGZvciBDdHJsLiBQaWxscyBvcHQgaW4gdmlhIGRhdGEtbW9kLSogc28gYSBzdHJpbmcgbGlrZSB0aGVcbiAgLy8gJ0FsdCvigKYnIHBpbGxzICh3aGljaCBuZXZlciBjYXJyeSBDbWQpIGFyZSBsZWZ0IHVudG91Y2hlZC5cbiAgY29uc3QgaXNNYWMgPSAvTWFjfGlQaG9uZXxpUGFkL2kudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0gfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJyk7XG4gIGlmICghaXNNYWMpIHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdrYmRbZGF0YS1tb2Qta10sIGtiZFtkYXRhLW1vZC16XSwga2JkW2RhdGEtbW9kLXNoaWZ0LXpdJykpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gKGVsLnRleHRDb250ZW50ID8/ICcnKS5yZXBsYWNlKC9eQ21kXFxiLywgJ0N0cmwnKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaW1wb3J0RmlsZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJyNpbXBvcnQtZmlsZScpO1xuICBjb25zdCBzdGF0c0VsID0gJCgnW2RhdGEtc3RhdHNdJyk7XG4gIGNvbnN0IHN0YXJzRWwgPSAkKCdbZGF0YS1zdGFyc10nKTtcbiAgY29uc3QgdG9vbHRpcEVsID0gJCgnW2RhdGEtdG9vbHRpcF0nKTtcbiAgY29uc3QgZHJpbGxkb3duRWwgPSAkKCdbZGF0YS1kcmlsbGRvd25dJyk7XG4gIGNvbnN0IGRyYXdlciA9ICQoJ1tkYXRhLWRyYXdlcl0nKTtcbiAgY29uc3QgcGFsZXR0ZSA9ICQoJ1tkYXRhLXBhbGV0dGVdJyk7XG4gIGNvbnN0IHBhbGV0dGVJbnB1dCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXBhbGV0dGUtaW5wdXRdJyk7XG4gIGNvbnN0IHBhbGV0dGVMaXN0ID0gJCgnW2RhdGEtcGFsZXR0ZS1saXN0XScpO1xuICBjb25zdCBjb21wV29yZHMgPSAkKCdbZGF0YS1jb21wLXdvcmRzXScpO1xuICBjb25zdCBjb21wVG9rZW5zID0gJCgnW2RhdGEtY29tcC10b2tlbnNdJyk7XG4gIGNvbnN0IHN0YXRUb2tlbnMgPSAkKCdbZGF0YS1zdGF0LXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFdvcmRzID0gJCgnW2RhdGEtc3RhdC13b3Jkc10nKTtcbiAgY29uc3Qgd3NTZWxlY3QgPSAkPEhUTUxTZWxlY3RFbGVtZW50PignW2RhdGEtd29ya3NwYWNlXScpO1xuICBjb25zdCB3c0xpc3QgPSAkKCdbZGF0YS13cy1saXN0XScpO1xuICBjb25zdCB3c05hbWUgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS13cy1uYW1lXScpO1xuXG4gIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdDogUGFyZW50Tm9kZSA9IGRvY3VtZW50KTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBlbCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1pY29uXScpKSB7XG4gICAgICBjb25zdCBuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWljb24nKTtcbiAgICAgIGNvbnN0IHNpemUgPSBOdW1iZXIoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNpemUnKSA/PyAxNik7XG4gICAgICBpZiAobmFtZSAmJiBQR19JQ09OUy5oYXMobmFtZSkpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgICB9XG4gIH07XG4gIG1vdW50SWNvbnMoKTtcblxuICAvLyDilIDilIDilIAgU3RhdGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgUHJlZnMgPSB7XG4gICAgaW5jbHVkZU91dGVySFRNTDogYm9vbGVhbjtcbiAgICBpbmNsdWRlTWF0Y2hlZFJ1bGVzOiBib29sZWFuO1xuICAgIGluY2x1ZGVTdHlsZXM6IGJvb2xlYW47XG4gICAgbWluaWZ5OiBib29sZWFuO1xuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IGJvb2xlYW47XG4gICAgdXNlU2NyZWVuc2hvdHM6IGJvb2xlYW47XG4gICAgc3BhY2luZ092ZXJsYXk6IGJvb2xlYW47XG4gICAgaG92ZXJTbmFwOiBib29sZWFuO1xuICAgIGF1dG9TY3JlZW5zaG90OiBib29sZWFuO1xuICAgIC8vIENvbW1hLXNlcGFyYXRlZCBob3N0IHBhdHRlcm5zIChzdWJzdHJpbmcgbWF0Y2gpLiBIb3N0cyBpbiB0aGlzIGxpc3RcbiAgICAvLyBza2lwIHRoZSBlbnRpcmUgc2NyZWVuc2hvdCBwaXBlbGluZSDigJQgdXNlZnVsIGZvciBzZW5zaXRpdmUgcGFnZXNcbiAgICAvLyAoYmFua2luZywgaW50ZXJuYWwgYWRtaW4pIHdoZXJlIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCBQTkdzIGxhbmRpbmdcbiAgICAvLyBvbiBkaXNrLlxuICAgIHNraXBTY3JlZW5zaG90SG9zdHM6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgREVTSUdOLm1kIGNvbnRlbnQgdGhlIHVzZXIgcGFzdGVkIG9yIHVwbG9hZGVkIHZpYSB0aGUgc2lkZVxuICAgIC8vIHBhbmVsIHNldHRpbmdzLiBEZWZhdWx0cyB0byBhIHRlbXBsYXRlZCBwbGFjZWhvbGRlciBzbyBvdXQtb2YtdGhlLVxuICAgIC8vIGJveCBleHBvcnRzIGFsd2F5cyBpbmNsdWRlIGEgREVTSUdOLm1kIOKAlCB0aGUgY29uc3VtZXIgTExNIGNhblxuICAgIC8vIGVpdGhlciB3b3JrIGZyb20gdGhlIHBsYWNlaG9sZGVyIChhbmQgYXNrIGZvciB0aGUgcmVhbCBvbmUpIG9yXG4gICAgLy8gZnJvbSBhIHVzZXItY3VzdG9taXplZCBjb3B5LiBUaGUgc2V0dGluZ3MgVUkgZmxhZ3MgdGhpcyBiYW5uZXItXG4gICAgLy8gc3R5bGUgd2hlbiB0aGUgdmFsdWUgc3RpbGwgbWF0Y2hlcyB0aGUgdGVtcGxhdGUgc28gdGhlIHVzZXJcbiAgICAvLyBrbm93cyB0byBmaWxsIGl0IGluLlxuICAgIGRlc2lnbk1kOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCB0aGUgcmVjZWl2ZXIgc2hvdWxkIHJlYWQgREVTSUdOLm1kIGZyb20uIERlZmF1bHRzXG4gICAgLy8gdG8gYH4vLmFnZW50cy9ERVNJR04ubWRgOyB1c2VyIGNhbiBvdmVycmlkZSBwZXItbWFjaGluZS5cbiAgICBkZXNpZ25QYXRoOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCBvZiB0aGUgUGluY2hHcmFiIFVJIHNraWxsIG9uIHRoZSByZWNlaXZlcidzXG4gICAgLy8gZmlsZXN5c3RlbS4gVGhlIHNraWxsIGNvbnRlbnQgaXRzZWxmIGlzIGJ1bmRsZWQgaW5saW5lIGludG8gdGhlXG4gICAgLy8gYXJjaGl2ZSAoc2VlIGBza2lsbE1kYCksIHNvIHRoaXMgaXMgYSBoaW50IGZvciByZWNlaXZlcnMgdGhhdFxuICAgIC8vIHdhbnQgdG8gcGVyc2lzdCB0aGUgc2tpbGwgYXQgYSBjYW5vbmljYWwgbG9jYXRpb24uXG4gICAgc2tpbGxQYXRoOiBzdHJpbmc7XG4gICAgLy8gSW5saW5lIFVJLXNraWxsIGNvbnRlbnQuIERlZmF1bHQgaXMgdGhlIGJ1bmRsZWQgUGluY2hHcmFiIHRyaWFnZVxuICAgIC8vIHNraWxsIHRlbXBsYXRlOyB1c2VyIGNhbiBjdXN0b21pemUgdmlhIHNldHRpbmdzIHBhc3RlL3VwbG9hZC5cbiAgICAvLyBCdW5kbGVkIGludG8gdGhlIGFyY2hpdmUgYXQgYC4vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYC5cbiAgICBza2lsbE1kOiBzdHJpbmc7XG4gICAgLy8gV2hlbiB0cnVlLCBmaXJlIGEgZnJlc2ggcGFnZSBzY3JlZW5zaG90IG9uIEVWRVJZIGNhcHR1cmUgcmF0aGVyXG4gICAgLy8gdGhhbiBvbmNlIHBlciAod29ya3NwYWNlLCB1cmwpIHR1cGxlLiBVc2VmdWwgZm9yIGNhcHR1cmluZyBhXG4gICAgLy8gbXVsdGktc3RlcCBmbG93IHdoZXJlIHRoZSBwYWdlIHN0YXRlIGNoYW5nZXMgYmV0d2VlbiBjYXB0dXJlcy5cbiAgICAvLyBEZWZhdWx0IGZhbHNlIOKAlCBtb3N0IHVzZXJzIHdhbnQgdGhlIGRlZmF1bHQgZmlyc3Qtb25seSBiZWhhdmlvclxuICAgIC8vIHNpbmNlIHBhZ2Ugc2NyZWVuc2hvdHMgYXJlIGxhcmdlIGFuZCB0aGUgZmlyc3Qgb25lIGFscmVhZHkgZ2l2ZXNcbiAgICAvLyBhIHNlc3Npb24tbGV2ZWwgcmVmZXJlbmNlLlxuICAgIHBhZ2VTaG90UGVyQ2FwdHVyZTogYm9vbGVhbjtcbiAgICAvLyBTdXBwcmVzcyBDaHJvbWUncyBkb3dubG9hZCBidWJibGUgd2hpbGUgUGluY2hHcmFiIHdyaXRlcyBpdHMgb3duXG4gICAgLy8gZmlsZXMgKHNjcmVlbnNob3RzICsgZXhwb3J0cykuIFJlcXVpcmVzIHRoZSBvcHRpb25hbCBgZG93bmxvYWRzLnVpYFxuICAgIC8vIHBlcm1pc3Npb24uIERlZmF1bHQgT04gYXMgaW50ZW50OyB1bnRpbCB0aGUgcGVybWlzc2lvbiBpcyBhY3R1YWxseVxuICAgIC8vIGdyYW50ZWQgKG5lZWRzIGEgdXNlciBnZXN0dXJlIOKAlCB0aGUgbnVkZ2UgYmFubmVyIG9yIHRoZSBzZXR0aW5nc1xuICAgIC8vIGNoZWNrYm94KSwgc2F2ZXMgc3RheSB2aXNpYmxlLlxuICAgIHF1aWV0U2F2ZXM6IGJvb2xlYW47XG4gICAgLy8gVGhlIHVzZXIgZGlzbWlzc2VkIHRoZSBxdWlldC1zYXZlcyBudWRnZSBiYW5uZXIg4oCUIG5ldmVyIHJlLXNob3cgaXQuXG4gICAgcXVpZXROdWRnZURpc21pc3NlZDogYm9vbGVhbjtcbiAgICAvLyBDb250aW51b3VzbHkgbWlycm9yIHRoZSB3b3Jrc3BhY2UgSlNPTkwgdG8gZGlzayAoYmVzaWRlIHNjcmVlbnNob3RzKVxuICAgIC8vIHNvIGNhcHR1cmVzICsgY29tbWVudHMgc3Vydml2ZSBhIHN0b3JhZ2UgY2xlYXIgLyBleHRlbnNpb24gcmVpbnN0YWxsLlxuICAgIC8vIE9uIGJ5IGRlZmF1bHQg4oCUIHRoaXMgaXMgdGhlIHNhZmV0eSBuZXQgYWdhaW5zdCBzaWxlbnQgYW5ub3RhdGlvbiBsb3NzLlxuICAgIGF1dG9zYXZlVG9EaXNrOiBib29sZWFuO1xuICAgIC8vIEJ1bmRsZSB0aGUgdmVuZG9yZWQgdGhpcmQtcGFydHkgZGVzaWduIHNraWxscyAoaW1wZWNjYWJsZSByZWZlcmVuY2VcbiAgICAvLyBzZXQgKyBwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbikgcGx1cyBza2lsbHMtaW5kZXguanNvbiBpbnRvIGFyY2hpdmVcbiAgICAvLyBleHBvcnRzLiBPbiBieSBkZWZhdWx0OiB0aGUgU2VuZC10by1BZ2VudCBwcm90b2NvbCdzIHNraWxsLW1hcHBpbmdcbiAgICAvLyBwaGFzZSBhc3N1bWVzIHRoZWlyIHByZXNlbmNlLiB+MS4yIE1CIG9mIG1hcmtkb3duIHBlciBidW5kbGUuXG4gICAgYnVuZGxlU2tpbGxzOiBib29sZWFuO1xuICAgIC8vIEJ1bmRsZSB0aGUgZnVsbCBzZXJpYWxpemVkIEhUTUwgb2YgZWFjaCBjYXB0dXJlZCBwYWdlIHVuZGVyIHBhZ2VzLy5cbiAgICAvLyBPZmYgYnkgZGVmYXVsdCAoZG9jdW1lbnRzIGNhbiBiZSBodWdlKTsgY29sbGVjdGVkIGxhemlseSBhdCBleHBvcnRcbiAgICAvLyB0aW1lIGZyb20gbGl2ZSB0YWJzLCBuZXZlciBwZXJzaXN0ZWQgdG8gY2hyb21lLnN0b3JhZ2UuXG4gICAgaW5jbHVkZVBhZ2VIVE1MOiBib29sZWFuO1xuICB9O1xuICBjb25zdCBERUZBVUxUX1BSRUZTOiBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiB0cnVlLFxuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IHRydWUsXG4gICAgaW5jbHVkZVN0eWxlczogdHJ1ZSxcbiAgICAvLyBEZWZhdWx0IHRvIG1pbmlmaWVkIGV4cG9ydHMg4oCUIG1vc3QgYWdlbnRzIHdhbnQgdGhlIHNtYWxsZXN0XG4gICAgLy8gdG9rZW4tZm9vdHByaW50IHBheWxvYWQuIEV4aXN0aW5nIHVzZXJzJyBzYXZlZCBwcmVmcyBhcmUgbWVyZ2VkIG92ZXJcbiAgICAvLyB0aGlzIGRlZmF1bHQgaW4gbG9hZEFsbCgpLCBzbyBvbmx5IE5FVy91bnNldCBpbnN0YWxscyBzZWUgdGhlIGZsaXAuXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IHRydWUsXG4gICAgdXNlU2NyZWVuc2hvdHM6IHRydWUsXG4gICAgc3BhY2luZ092ZXJsYXk6IGZhbHNlLFxuICAgIGhvdmVyU25hcDogdHJ1ZSxcbiAgICBhdXRvU2NyZWVuc2hvdDogdHJ1ZSxcbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiAnJyxcbiAgICAvLyBkZXNpZ25NZCAvIHNraWxsTWQgZGVmYXVsdCB0byAnJyB3aGljaCB0aGUgcmVzb2x2ZXIgdHJlYXRzIGFzXG4gICAgLy8gXCJmYWxsIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUgYXQgZXhwb3J0IHRpbWVcIi4gU3RvcmluZyB0aGVcbiAgICAvLyBlbXB0eSBzdHJpbmcga2VlcHMgY2hyb21lLnN0b3JhZ2Ugc21hbGwgYW5kIGxldHMgYGlzVXNpbmdUZW1wbGF0ZSpgXG4gICAgLy8gYmUgYSBjaGVhcCBzeW5jaHJvbm91cyBjaGVjay5cbiAgICBkZXNpZ25NZDogJycsXG4gICAgZGVzaWduUGF0aDogJ34vLmFnZW50cy9ERVNJR04ubWQnLFxuICAgIHNraWxsUGF0aDogJ34vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICBza2lsbE1kOiAnJyxcbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGZhbHNlLFxuICAgIHF1aWV0U2F2ZXM6IHRydWUsXG4gICAgcXVpZXROdWRnZURpc21pc3NlZDogZmFsc2UsXG4gICAgYXV0b3NhdmVUb0Rpc2s6IHRydWUsXG4gICAgYnVuZGxlU2tpbGxzOiB0cnVlLFxuICAgIGluY2x1ZGVQYWdlSFRNTDogZmFsc2UsXG4gIH07XG5cbiAgLy8gUmV3cml0ZSB0aGUgYG5hbWU6YCBmaWVsZCBpbiBhIFNLSUxMLm1kJ3MgWUFNTCBmcm9udG1hdHRlci4gVGhlXG4gIC8vIHVzZXIncyBzb3VyY2Utb2YtdHJ1dGggU0tJTEwubWQgaXMgY2F0YWxvZ3VlZCB1bmRlciB3aGF0ZXZlciBuYW1lXG4gIC8vIHRoZWlyIHdpZGVyIGAuYWdlbnRzL3NraWxscy9gIHRyZWUgdXNlcyAob2Z0ZW4gYHVpYCk7IHRoZSBidW5kbGVkXG4gIC8vIGFyY2hpdmUgY29weSBzaG91bGQgYWx3YXlzIGlkZW50aWZ5IGFzIGBQaW5jaEdyYWJgIHNvIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhZGluZyB0aGUgbWFuaWZlc3QgZG9lc24ndCBnZXQgY29uZnVzZWQgYWJvdXQgd2hpY2ggc2tpbGxcbiAgLy8gZmlsZSBhcHBsaWVzLiBPbmx5IHRoZSBGSVJTVCB0b3Atb2YtZmlsZSBgbmFtZTpgIGxpbmUgd2l0aGluIHRoZVxuICAvLyBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHRvdWNoZWQuXG4gIGNvbnN0IHJlYnJhbmRTa2lsbE5hbWUgPSAobWQ6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAvLyBUaGUgZnJvbnRtYXR0ZXIgYmxvY2ssIGlmIHByZXNlbnQsIGlzIGJldHdlZW4gbGVhZGluZyBgLS0tXFxuYFxuICAgIC8vIGFuZCB0aGUgbmV4dCBgXFxuLS0tXFxuYC4gQW55dGhpbmcgZWxzZSAobm8gZnJvbnRtYXR0ZXIsIG5hbWUgbm90XG4gICAgLy8gb24gYSBzaW5nbGUgbGluZSwgZXRjLikgcmV0dXJucyB1bmNoYW5nZWQg4oCUIGJldHRlciB0byBzaGlwIHRoZVxuICAgIC8vIG9yaWdpbmFsIHRoYW4gcmlzayBjb3JydXB0aW5nIHRoZSBmaWxlLlxuICAgIGNvbnN0IG0gPSBtZC5tYXRjaCgvXi0tLVxccj9cXG4oW1xcc1xcU10qPylcXHI/XFxuLS0tXFxyP1xcbi8pO1xuICAgIGlmICghbSkgcmV0dXJuIG1kO1xuICAgIGNvbnN0IGZtID0gbVsxXSE7XG4gICAgY29uc3QgcmVicmFuZGVkRm0gPSBmbS5yZXBsYWNlKC9ebmFtZTpcXHMqLiskL20sIGBuYW1lOiAke25ld05hbWV9YCk7XG4gICAgaWYgKHJlYnJhbmRlZEZtID09PSBmbSkgcmV0dXJuIG1kOyAvLyBubyBgbmFtZTpgIGZpZWxkOyBub3RoaW5nIHRvIGRvXG4gICAgcmV0dXJuIG1kLnJlcGxhY2UobVswXSwgYC0tLVxcbiR7cmVicmFuZGVkRm19XFxuLS0tXFxuYCk7XG4gIH07XG4gIHR5cGUgV29ya3NwYWNlID0ge25hbWU6IHN0cmluZzsgY3JlYXRlZEF0OiBzdHJpbmc7IHRhYklkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfTtcbiAgLy8gT25lIGFyY2hpdmVkIHN0YXRlIG9mIGEgd29ya3NwYWNlIChjYXB0dXJlZCBqdXN0IGJlZm9yZSBhIENsZWFyLWFsbCkuXG4gIC8vIGBzaG90c2AgaXMgdGhlIHRodW1ibmFpbCBtYXAgKGZ1bGwtcmVzIFBOR3MgYXJlIHNlc3Npb24tb25seSBhbmQgbm90XG4gIC8vIGFyY2hpdmVkKS4gUmVzdG9yYWJsZSBmcm9tIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzLlxuICB0eXBlIFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgdHM6IHN0cmluZztcbiAgICBtZXNzYWdlczogUGFuZWxNZXNzYWdlW107XG4gICAgc2hvdHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgY29tbWVudHM6IG51bWJlcjtcbiAgfTtcblxuICBsZXQgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gIGxldCBsaXZlVGFiVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxpdmVUYWJQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2VsZWN0b3JWYWxpZGl0eSA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuIHwgJ2RpZmYtcGFnZSc+KCk7XG4gIGNvbnN0IHNlbGVjdG9yRXJyb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgaW5zZXJ0QmVmb3JlOiB7Y3VycmVudDogc3RyaW5nIHwgbnVsbDsgY29tbWVudDogYm9vbGVhbn0gPSB7Y3VycmVudDogbnVsbCwgY29tbWVudDogZmFsc2V9O1xuICBsZXQgc2VhcmNoUXVlcnkgPSAnJztcbiAgbGV0IGxhc3RBY3RpdmVTZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdGlja3lUaW1lciA9IDA7XG4gIGxldCBTVElDS1lfVFRMX01TID0gNV8wMDA7XG4gIGxldCBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgbGV0IHBoYW50b21UYXJnZXQ6IHtzZWxlY3Rvcjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyB0YWc/OiBzdHJpbmc7IHJlY3Q/OiBET01SZWN0fSB8IG51bGwgPSBudWxsO1xuICBsZXQgcGVuZGluZ011bHRpOiBFbnRyeVtdID0gW107XG4gIGNvbnN0IHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIHBlciBzZWxlY3Rvci4gTk9UIHBlcnNpc3RlZCB0b1xuICAvLyBjaHJvbWUuc3RvcmFnZSAoY2FwIHByZXNzdXJlIOKAlCAxMDAgY2FwdHVyZXMgw5cgODAgS0IgZWFjaCA9IDggTUIpLCBzb1xuICAvLyBpdCdzIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBzZXNzaW9uJ3MgYXJjaGl2ZSBleHBvcnQuIENsZWFyZWRcbiAgLy8gb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgY29uc3Qgc2hvdHNGdWxsID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gVHJhY2sgd2hpY2ggKHdvcmtzcGFjZSwgcGFnZS11cmwpIHR1cGxlcyBhbHJlYWR5IGZpcmVkIGEgcGFnZSBzaG90IHNvIHdlXG4gIC8vIGRvbid0IHJlLXNob290IHRoZSBlbnRpcmUgcGFnZSBvbiBldmVyeSBjYXB0dXJlLiBSZXNldCBvbiB3b3Jrc3BhY2VcbiAgLy8gc3dpdGNoIOKAlCBubyBkYXkga2V5LCB0aGUgZGVkdXBlIGlzIHBlci1zZXNzaW9uLlxuICBjb25zdCBwYWdlU2hvdHNGaXJlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBwYWdlU2hvdEtleSA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiBgJHthY3RpdmVXc306JHt1cmx9YDtcbiAgLy8gTGFzdCBzdWNjZXNzZnVsIGV4cG9ydCDigJQgYm90aCB0aGUgd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKHNob3duIHRvIHRoZVxuICAvLyB1c2VyKSBhbmQgdGhlIE9TLWFic29sdXRlIHBhdGggKGNvcGllZCBieSB0aGUgXCJDb3B5IGFzIHBhdGhcIiBidXR0b24pLlxuICAvLyBVcGRhdGVkIG9uIEpTT05ML01EL1pJUC9zY3JlZW5zaG90IHNhdmVzLlxuICBjb25zdCBsYXN0RXhwb3J0OiB7cmVsUGF0aDogc3RyaW5nIHwgbnVsbDsgYWJzUGF0aDogc3RyaW5nIHwgbnVsbDsgY29weVBhdGg6IHN0cmluZyB8IG51bGw7IHRlbXBQYXRoOiBib29sZWFuOyBraW5kOiBzdHJpbmcgfCBudWxsOyBhZ2VudFByb21wdDogc3RyaW5nIHwgbnVsbH0gPSB7XG4gICAgcmVsUGF0aDogbnVsbCwgYWJzUGF0aDogbnVsbCwgY29weVBhdGg6IG51bGwsIHRlbXBQYXRoOiBmYWxzZSwga2luZDogbnVsbCwgYWdlbnRQcm9tcHQ6IG51bGwsXG4gIH07XG4gIGxldCB3b3Jrc3BhY2VzOiBXb3Jrc3BhY2VbXSA9IFt7bmFtZTogJ2RlZmF1bHQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dO1xuICBsZXQgYWN0aXZlV3MgPSAnZGVmYXVsdCc7XG4gIC8vIFNlc3Npb24gdXVpZCDigJQgZ2VuZXJhdGVkIG9uY2UgcGVyIHdvcmtzcGFjZSBib290LiBHb2VzIG9udG8gZXZlcnlcbiAgLy8gcGFnZSByb3cgYW5kIGV2ZXJ5IHNlbGVjdG9yIGVudHJ5IHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXNcbiAgLy8gdG8gXCJ3aGljaCBzZXNzaW9uP1wiIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLiBTdGFibGUgYWNyb3NzIGFcbiAgLy8gc2luZ2xlIHdvcmtzcGFjZSBsb2FkOyByZXNldHMgb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgbGV0IHNlc3Npb25JZDogc3RyaW5nID0gJyc7XG4gIGNvbnN0IHdzTXNnS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0ubWVzc2FnZXMudjFgO1xuICBjb25zdCB3c1Nob3RzS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0uc2hvdHMudjFgO1xuICAvLyBQZXJzaXN0ZW50IHNuYXBzaG90IGhpc3RvcnkgcGVyIHdvcmtzcGFjZSDigJQgYSBDbGVhci1hbGwgYXJjaGl2ZXMgdGhlIHdpcGVkXG4gIC8vIGNhcHR1cmVzK2NvbW1lbnRzK3RodW1ibmFpbHMgaGVyZSBzbyB0aGV5IGNhbiBiZSByZXN0b3JlZCBsYXRlciBmcm9tXG4gIC8vIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzLiBMaXZlcyBpbiB0aGUgc2FtZSBjaHJvbWUuc3RvcmFnZSBsYXllciBhcyB0aGUgcmVzdFxuICAvLyBvZiB0aGUgd29ya3NwYWNlIGRhdGEuXG4gIGNvbnN0IHdzU25hcHNob3RzS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0uc25hcHNob3RzLnYxYDtcbiAgLy8gQ2FwIHNvIHRoZSBoaXN0b3J5IGNhbid0IGJhbGxvb24gc3RvcmFnZTsgb2xkZXN0IHNuYXBzaG90cyBkcm9wIG9mZi5cbiAgY29uc3QgV1NfU05BUFNIT1RfQ0FQID0gMTA7XG4gIGNvbnN0IHdzU2hvdHNGdWxsS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0uc2hvdHNGdWxsLnYxYDtcbiAgLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgaGFzIGEgMTAgTUIgZGVmYXVsdCBxdW90YTsgd2UgYnVkZ2V0IGhhbGYgb2ZcbiAgLy8gdGhhdCBmb3IgZnVsbC1yZXNvbHV0aW9uIFBOR3MgKHRoZSByZXN0IGlzIG1lc3NhZ2VzLCBwcmVmcywgdGh1bWJzKS5cbiAgLy8gV2hlbiB0aGUgYnVkZ2V0IGlzIHJlYWNoZWQgd2UgRklGTy1ldmljdCB0aGUgb2xkZXN0IGVudHJpZXMgKE1hcFxuICAvLyBwcmVzZXJ2ZXMgaW5zZXJ0aW9uIG9yZGVyKS4gRXN0aW1hdGUgZGF0YVVSTCBzaXplID0gc3RyaW5nIGxlbmd0aC5cbiAgY29uc3QgU0hPVFNfRlVMTF9CVURHRVRfQllURVMgPSA1ICogMTAyNCAqIDEwMjQ7XG4gIGNvbnN0IHVuZG9TdGFjazogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgcmVkb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBVTkRPX0NBUCA9IDMwO1xuICBsZXQgc3VzcGVuZFNuYXBzaG90cyA9IGZhbHNlO1xuICBsZXQgcHJlZnM6IFByZWZzID0gey4uLkRFRkFVTFRfUFJFRlN9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0dXMgaGVscGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgc3RhdHVzVGltZXIgPSAwO1xuICBjb25zdCBzZXRTdGF0dXMgPSAobXNnOiBzdHJpbmcsIG9wdHM6IHtraW5kPzogJ3dhcm4nIHwgJ2luZm8nIHwgJ29rJ30gPSB7fSk6IHZvaWQgPT4ge1xuICAgIHN0YXR1cy50ZXh0Q29udGVudCA9IG1zZyB8fCAnJztcbiAgICBjbGVhclRpbWVvdXQoc3RhdHVzVGltZXIpO1xuICAgIGlmIChtc2cpIHtcbiAgICAgIHN0YXR1cy5zdHlsZS5jb2xvciA9IG9wdHMua2luZCA9PT0gJ3dhcm4nID8gJ3ZhcigtLXJlZCknIDpcbiAgICAgICAgb3B0cy5raW5kID09PSAnaW5mbycgPyAndmFyKC0tdGV4dC0zKScgOiAndmFyKC0tZ3JlZW4pJztcbiAgICAgIHN0YXR1c1RpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyBzdGF0dXMudGV4dENvbnRlbnQgPSAnJzsgfSwgMjIwMCk7XG4gICAgfVxuICB9O1xuICBsZXQgdG9hc3RUaW1lciA9IDA7XG4gIGNvbnN0IHNob3dUb2FzdCA9ICh0aXRsZTogc3RyaW5nLCBkZXRhaWwgPSAnJywga2luZDogJ29rJyB8ICd3YXJuJyA9ICdvaycpOiB2b2lkID0+IHtcbiAgICBsZXQgdG9hc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtY29weS10b2FzdF0nKTtcbiAgICBpZiAoIXRvYXN0KSB7XG4gICAgICB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdG9hc3QuY2xhc3NOYW1lID0gJ2NvcHktdG9hc3QnO1xuICAgICAgdG9hc3QuZGF0YXNldC5jb3B5VG9hc3QgPSAndHJ1ZSc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0b2FzdCk7XG4gICAgfVxuICAgIHRvYXN0LmNsYXNzTGlzdC50b2dnbGUoJ3dhcm4nLCBraW5kID09PSAnd2FybicpO1xuICAgIHRvYXN0LmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cImNvcHktdG9hc3QtaWNvblwiPiR7UEdfSUNPTlMuc3ZnU3RyaW5nKGtpbmQgPT09ICd3YXJuJyA/ICdhbGVydC1jaXJjbGUnIDogJ2NpcmNsZS1jaGVjaycsIDIyKX08L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNvcHktdG9hc3QtdGV4dFwiPjxiPiR7ZXNjYXBlSHRtbCh0aXRsZSl9PC9iPiR7ZGV0YWlsID8gYDxzbWFsbD4ke2VzY2FwZUh0bWwoZGV0YWlsKX08L3NtYWxsPmAgOiAnJ308L3NwYW4+YDtcbiAgICB0b2FzdC5oaWRkZW4gPSBmYWxzZTtcbiAgICB0b2FzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgdm9pZCB0b2FzdC5vZmZzZXRXaWR0aDtcbiAgICB0b2FzdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgY2xlYXJUaW1lb3V0KHRvYXN0VGltZXIpO1xuICAgIHRvYXN0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0b2FzdD8uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyBpZiAodG9hc3QpIHRvYXN0LmhpZGRlbiA9IHRydWU7IH0sIDE4MCk7XG4gICAgfSwgMTQ1MCk7XG4gIH07XG4gIGNvbnN0IHNob3dDb3BpZWQgPSAobGFiZWw6IHN0cmluZywgZGV0YWlsID0gJycpOiB2b2lkID0+IHNob3dUb2FzdChsYWJlbCwgZGV0YWlsLCAnb2snKTtcbiAgY29uc3Qgc2hvd0Rvd25sb2FkRXJyb3IgPSAobGFiZWw6IHN0cmluZywgZGV0YWlsOiBzdHJpbmcpOiB2b2lkID0+IHNob3dUb2FzdChsYWJlbCwgZGV0YWlsLCAnd2FybicpO1xuXG4gIC8vIOKUgOKUgOKUgCBVdGlsaXRpZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBmYWxsYmFja0lkQ291bnRlciA9IDA7XG4gIGNvbnN0IHNlY3VyZVRva2VuID0gKGJ5dGVzID0gMTIpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG4gICAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMocmF3KTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHJhdykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX1fJHsoKytmYWxsYmFja0lkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gICAgfVxuICB9O1xuICBjb25zdCBtc2dJZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7IGlmIChnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKSByZXR1cm4gZ2xvYmFsVGhpcy5jcnlwdG8ucmFuZG9tVVVJRCgpOyB9IGNhdGNoIHsgLyogZmFsbCB0aHJvdWdoICovIH1cbiAgICByZXR1cm4gYGlkXyR7c2VjdXJlVG9rZW4oMTYpfWA7XG4gIH07XG4gIGNvbnN0IGVzY2FwZUh0bWwgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgU3RyaW5nKHMpLnJlcGxhY2VBbGwoJyYnLCAnJmFtcDsnKS5yZXBsYWNlQWxsKCc8JywgJyZsdDsnKS5yZXBsYWNlQWxsKCc+JywgJyZndDsnKTtcbiAgY29uc3QgZXNjYXBlUmUgPSAoczogc3RyaW5nKTogc3RyaW5nID0+IHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbiAgY29uc3QgaGlnaGxpZ2h0TWF0Y2ggPSAodGV4dDogc3RyaW5nLCBxOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCk7XG4gICAgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKGAoJHtlc2NhcGVSZShxKX0pYCwgJ2dpJyksICc8bWFyaz4kMTwvbWFyaz4nKTtcbiAgfTtcbiAgLy8gV2FsayB0ZXh0IG5vZGVzIGluc2lkZSBgcm9vdGAsIHdyYXBwaW5nIGNhc2UtaW5zZW5zaXRpdmUgbWF0Y2hlcyBvZiBgcWBcbiAgLy8gaW4gPG1hcms+IGVsZW1lbnRzLiBEb2Vzbid0IHRvdWNoIGF0dHJpYnV0ZSBzdHJpbmdzIG9yIGlubmVyLXRhZyBIVE1MIHNvXG4gIC8vIGl0J3Mgc2FmZSB0byBydW4gb24gYWxyZWFkeS1oaWdobGlnaHRlZCBKU09OIG91dHB1dC5cbiAgY29uc3Qgd3JhcFNlYXJjaEhpdHNJblRleHROb2RlcyA9IChyb290OiBIVE1MRWxlbWVudCwgcTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm47XG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKGVzY2FwZVJlKHEpLCAnZ2knKTtcbiAgICBjb25zdCB3YWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKHJvb3QsIE5vZGVGaWx0ZXIuU0hPV19URVhUKTtcbiAgICBjb25zdCB0YXJnZXRzOiBUZXh0W10gPSBbXTtcbiAgICBsZXQgbm9kZTogTm9kZSB8IG51bGw7XG4gICAgd2hpbGUgKChub2RlID0gd2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICBpZiAocmUudGVzdChub2RlLm5vZGVWYWx1ZSA/PyAnJykpIHRhcmdldHMucHVzaChub2RlIGFzIFRleHQpO1xuICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9XG4gICAgZm9yIChjb25zdCB0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdC5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgbGV0IGxhc3QgPSAwO1xuICAgICAgZm9yIChjb25zdCBtIG9mIHZhbHVlLm1hdGNoQWxsKHJlKSkge1xuICAgICAgICBjb25zdCBpID0gbS5pbmRleCA/PyAwO1xuICAgICAgICBpZiAoaSA+IGxhc3QpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QsIGkpKTtcbiAgICAgICAgY29uc3QgbWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYXJrJyk7XG4gICAgICAgIG1rLnRleHRDb250ZW50ID0gbVswXTtcbiAgICAgICAgZnJhZy5hcHBlbmQobWspO1xuICAgICAgICBsYXN0ID0gaSArIG1bMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGxhc3QgPCB2YWx1ZS5sZW5ndGgpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QpKTtcbiAgICAgIHQucmVwbGFjZVdpdGgoZnJhZyk7XG4gICAgfVxuICB9O1xuICBjb25zdCB3b3JkQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IChzLm1hdGNoKC9cXFMrL2cpID8/IFtdKS5sZW5ndGg7XG4gIGNvbnN0IHRva2VuQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IE1hdGguY2VpbChzLmxlbmd0aCAvIDQpO1xuICBjb25zdCBwYXRoT2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkucGF0aG5hbWU7IH0gY2F0Y2ggeyByZXR1cm4gdTsgfSB9O1xuICBjb25zdCBob3N0T2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkuaG9zdDsgfSBjYXRjaCB7IHJldHVybiAnJzsgfSB9O1xuICAvLyBGaWxlbmFtZS1zYWZlIGhvc3Qgc2x1ZzogZG90cyDihpIgdW5kZXJzY29yZXMgcGVyIHByb2plY3QgY29udmVudGlvbi5cbiAgLy8gTWlycm9ycyBiYWNrZ3JvdW5kLnRzIGhvc3RTbHVnIGZvciBzeW1tZXRyeSBhY3Jvc3Mgc2NyZWVuc2hvdCArIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMuXG4gIGNvbnN0IGhvc3RTbHVnID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBoID0gaG9zdE9mKHVybCk7XG4gICAgaWYgKCFoKSByZXR1cm4gJ3Vua25vd24nO1xuICAgIHJldHVybiBoLnJlcGxhY2UoL1xcLi9nLCAnXycpLnJlcGxhY2UoL1teXFx3LV0vZywgJ18nKS5zbGljZSgwLCA0MCkgfHwgJ3Vua25vd24nO1xuICB9O1xuICAvLyBQaWNrIHRoZSBtb3N0LWZyZXF1ZW50IGhvc3QgYWNyb3NzIGFsbCBzZWxlY3RvciBjYXB0dXJlcyAoZm9yIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMpLiBXaGVuIHRoZSB3b3Jrc3BhY2Ugc3BhbnMgbXVsdGlwbGUgaG9zdHMsIHJldHVybiAnbXVsdGknLlxuICBjb25zdCBkb21pbmFudEhvc3RTbHVnID0gKCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgY291bnRzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RTbHVnKG0uZW50cnkudXJsKTtcbiAgICAgIGNvdW50cy5zZXQoaCwgKGNvdW50cy5nZXQoaCkgPz8gMCkgKyAxKTtcbiAgICB9XG4gICAgaWYgKCFjb3VudHMuc2l6ZSkgcmV0dXJuICdlbXB0eSc7XG4gICAgbGV0IGJlc3QgPSAnJztcbiAgICBsZXQgYmVzdE4gPSAwO1xuICAgIGZvciAoY29uc3QgW2gsIG5dIG9mIGNvdW50cykge1xuICAgICAgaWYgKG4gPiBiZXN0TikgeyBiZXN0ID0gaDsgYmVzdE4gPSBuOyB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudHMuc2l6ZSA+IDEgPyAnbXVsdGknIDogYmVzdDtcbiAgfTtcbiAgLy8gRGlzdGluY3QgaG9zdHMgcHJlc2VudCBpbiB0aGlzIHdvcmtzcGFjZSAoYWxwaGFiZXRpY2FsLCBjYXBwZWQpLiBVc2VkIGluXG4gIC8vIHRoZSBleHBvcnQgbWFuaWZlc3QncyBgaG9zdHNgIGZpZWxkLlxuICBjb25zdCBkaXN0aW5jdEhvc3RzID0gKCk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBzZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RPZihtLmVudHJ5LnVybCk7XG4gICAgICBpZiAoaCkgc2V0LmFkZChoKTtcbiAgICB9XG4gICAgcmV0dXJuIFsuLi5zZXRdLnNvcnQoKS5zbGljZSgwLCAyMCk7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEZXRlcm1pbmlzdGljIGV4cG9ydCBpZGVudGl0eSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gT25lIGNsb2NrIHBlciBleHBvcnQ6IGV2ZXJ5IHRpbWVzdGFtcCBpbnNpZGUgYSBzaW5nbGUgZXhwb3J0IGRlcml2ZXNcbiAgLy8gZnJvbSB0aGUgc2FtZSBpbnN0YW50LCBhbmQgdGVzdHMgY2FuIGZyZWV6ZSBpdCBzbyB0d28gZXhwb3J0cyBvZiB0aGVcbiAgLy8gc2FtZSBjb250ZW50IGFyZSBieXRlLWlkZW50aWNhbC5cbiAgbGV0IGV4cG9ydENsb2NrT3ZlcnJpZGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBleHBvcnROb3dJc28gPSAoKTogc3RyaW5nID0+IGV4cG9ydENsb2NrT3ZlcnJpZGUgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAvLyBTdGFibGUgY29udGVudCBpZGVudGl0eTogU0hBLTI1NiBvdmVyIHRoZSBzbGltIHJvd3MgcGx1cyB0aGUgc29ydGVkXG4gIC8vIHNjcmVlbnNob3QgYXJjaGl2ZSBuYW1lcy4gU2FtZSB3b3Jrc3BhY2UgY29udGVudCDihpIgc2FtZSBoYXNoIOKGkiBzYW1lXG4gIC8vIGZpbGVuYW1lICh0aGUgYmFja2dyb3VuZCBzYXZlcyB3aXRoIGNvbmZsaWN0QWN0aW9uICdvdmVyd3JpdGUnKSwgc29cbiAgLy8gcmUtZXhwb3J0aW5nIHVuY2hhbmdlZCBjb250ZW50IHJlcGxhY2VzIHJhdGhlciB0aGFuIGR1cGxpY2F0ZXMuXG4gIGNvbnN0IGNvbXB1dGVDb250ZW50SGFzaCA9IGFzeW5jIChzaG90TmFtZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBjb25zdCBwYXlsb2FkID0gYnVpbGRTbGltKCkubWFwKChsKSA9PiBKU09OLnN0cmluZ2lmeShsKSkuam9pbignXFxuJykgKyAnXFxuJyArIFsuLi5zaG90TmFtZXNdLnNvcnQoKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBkaWdlc3QgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShwYXlsb2FkKSk7XG4gICAgcmV0dXJuIFsuLi5uZXcgVWludDhBcnJheShkaWdlc3QpXS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICB9O1xuICAvLyBCdWlsZCBhIGZpbGVuYW1lIG9mIHRoZSBzaGFwZSBgcGluY2hncmFiLTx3b3Jrc3BhY2U+LTxob3N0Pi08c3RhbXA+LjxleHQ+YC5cbiAgLy8gVGhlIHN0YW1wIGlzIHRoZSBleHBvcnQncyBjb250ZW50LWhhc2ggcHJlZml4IHdoZW4gc3VwcGxpZWQgKGJ1bmRsZSBhbmRcbiAgLy8gSlNPTkwgZXhwb3J0cyksIGZhbGxpbmcgYmFjayB0byB0aGUgZXBvY2ggZm9yIGxlZ2FjeSBjYWxsZXJzLlxuICBjb25zdCBidWlsZEV4cG9ydEZpbGVuYW1lID0gKGV4dDogJ2pzb25sJyB8ICdtZCcgfCAndGFyLnpzdCcsIHN0YW1wPzogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgYHBpbmNoZ3JhYi0ke2FjdGl2ZVdzfS0ke2RvbWluYW50SG9zdFNsdWcoKX0tJHtzdGFtcCA/PyBEYXRlLm5vdygpfS4ke2V4dH1gO1xuICAvLyBTa2lwLWxpc3QgbWF0Y2g6IHN1YnN0cmluZyAoY2FzZS1pbnNlbnNpdGl2ZSkgbWF0Y2ggYWdhaW5zdCB0aGUgVVJMJ3NcbiAgLy8gaG9zdC4gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgVVJMIHBhcnNpbmcgb24gdGhlIHBhdHRlcm5zIHNvIHRoZSB1c2VyXG4gIC8vIGNhbiB3cml0ZSBgd3Jhbm5nbGUuY29tYCBhbmQgaGF2ZSBpdCBtYXRjaCBgYXBwLndyYW5uZ2xlLmNvbWAgdG9vLlxuICBjb25zdCBzaG91bGRTa2lwU2NyZWVuc2hvdCA9ICh1cmw6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGxpc3QgPSAocHJlZnMuc2tpcFNjcmVlbnNob3RIb3N0cyA/PyAnJykuc3BsaXQoJywnKS5tYXAoKHMpID0+IHMudHJpbSgpLnRvTG93ZXJDYXNlKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaG9zdCA9IGhvc3RPZih1cmwpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGxpc3Quc29tZSgocGF0KSA9PiBob3N0LmluY2x1ZGVzKHBhdCkpO1xuICB9O1xuXG4gIC8vIEpTT04gc3ludGF4IGhpZ2hsaWdodCAocGVyLWtleSBjb2xvciBpcyBoYXNoZWQgZm9yIHZpc3VhbCB2YXJpZXR5KS5cbiAgY29uc3QgS0VZX1BBTEVUVEUgPSBbJyNmZjdlNzgnLCAnI2ZmYjQ1NCcsICcjZmZlMDY2JywgJyM3YmQ5N2EnLCAnIzVmZDFmZicsICcjOWI4Y2ZmJywgJyNmZjg1YzEnLCAnI2ZmNWYwMCcsICcjMTBiOTgxJywgJyNmNTllMGInLCAnI2E3OGJmYScsICcjMzRkMzk5J107XG4gIGNvbnN0IGNvbG9yRm9yS2V5ID0gKGs6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgbGV0IGggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgay5sZW5ndGg7IGkrKykgaCA9IChoICogMzEgKyBrLmNoYXJDb2RlQXQoaSkpID4+PiAwO1xuICAgIHJldHVybiBLRVlfUEFMRVRURVtoICUgS0VZX1BBTEVUVEUubGVuZ3RoXSE7XG4gIH07XG4gIGNvbnN0IEpTT05fVE9LRU5fUkUgPSAvKFxccyspfChcIig/OlteXCJcXFxcXXxcXFxcLikqXCIpfCh0cnVlfGZhbHNlfG51bGwpfCgtP1xcZCsoPzpcXC5cXGQrKT8oPzpbZUVdWystXT9cXGQrKT8pfChbe31bXFxdLDpdKS9nO1xuICBjb25zdCBhcHBlbmRKc29uSGlnaGxpZ2h0ID0gKHJvb3Q6IEhUTUxFbGVtZW50LCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICByb290LnRleHRDb250ZW50ID0gJyc7XG4gICAgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIEpTT05fVE9LRU5fUkUubGFzdEluZGV4ID0gMDtcbiAgICB3aGlsZSAoKG0gPSBKU09OX1RPS0VOX1JFLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBpZiAobS5pbmRleCA+IGxhc3QpIHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCwgbS5pbmRleCkpKTtcbiAgICAgIGxhc3QgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgIGNvbnN0IFssIHdzLCBzdHIsIGxpdCwgbnVtLCBwdW5jdF0gPSBtO1xuICAgICAgaWYgKHdzKSB7IHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHdzKSk7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoc3RyKSB7XG4gICAgICAgIGxldCBrID0gSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXg7XG4gICAgICAgIHdoaWxlIChrIDwgdGV4dC5sZW5ndGggJiYgKHRleHRba10gPT09ICcgJyB8fCB0ZXh0W2tdID09PSAnXFx0JyB8fCB0ZXh0W2tdID09PSAnXFxuJykpIGsrKztcbiAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgaWYgKHRleHRba10gPT09ICc6Jykge1xuICAgICAgICAgIGxldCBrZXk6IHN0cmluZztcbiAgICAgICAgICB0cnkgeyBrZXkgPSBKU09OLnBhcnNlKHN0cikgYXMgc3RyaW5nOyB9IGNhdGNoIHsga2V5ID0gc3RyLnNsaWNlKDEsIC0xKTsgfVxuICAgICAgICAgIHNwYW4uY2xhc3NOYW1lID0gJ2snO1xuICAgICAgICAgIHNwYW4uc3R5bGUuY29sb3IgPSBjb2xvckZvcktleShrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW4uY2xhc3NOYW1lID0gJ3MnO1xuICAgICAgICB9XG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBzdHI7XG4gICAgICAgIHJvb3QuYXBwZW5kKHNwYW4pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBpZiAobGl0KSBzcGFuLmNsYXNzTmFtZSA9ICdiJztcbiAgICAgIGVsc2UgaWYgKG51bSkgc3Bhbi5jbGFzc05hbWUgPSAnbic7XG4gICAgICBlbHNlIGlmIChwdW5jdCkgc3Bhbi5jbGFzc05hbWUgPSAncCc7XG4gICAgICBzcGFuLnRleHRDb250ZW50ID0gbGl0ID8/IG51bSA/PyBwdW5jdCA/PyAnJztcbiAgICAgIHJvb3QuYXBwZW5kKHNwYW4pO1xuICAgIH1cbiAgICBpZiAobGFzdCA8IHRleHQubGVuZ3RoKSByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKGxhc3QpKSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlcnNpc3RlbmNlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBsb2FkQWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHdvcmtzcGFjZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVtdPihXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcykpIHx8IHdvcmtzcGFjZXM7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmxlbmd0aCkgd29ya3NwYWNlcyA9IFt7bmFtZTogJ2RlZmF1bHQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dO1xuICAgIGFjdGl2ZVdzID0gKGF3YWl0IFN0b3JlLmdldDxzdHJpbmc+KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgJ2RlZmF1bHQnKSkgfHwgJ2RlZmF1bHQnO1xuICAgIGlmICghd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IGFjdGl2ZVdzKSkgYWN0aXZlV3MgPSB3b3Jrc3BhY2VzWzBdIS5uYW1lO1xuICAgIHByZWZzID0gey4uLkRFRkFVTFRfUFJFRlMsIC4uLihhd2FpdCBTdG9yZS5nZXQ8UGFydGlhbDxQcmVmcz4+KFBSRUZTX1NUT1JBR0VfTkFNRSwge30pKX07XG4gICAgLy8gUGF0aCBtaWdyYXRpb246IHByaW9yIHZlcnNpb25zIGRlZmF1bHRlZCBza2lsbFBhdGggdG9cbiAgICAvLyBgfi8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAsIGFuZCBzb21lIHVzZXJzIGhhZCBpdCBzdG9yZWQgYXNcbiAgICAvLyBgfi8uZG90ZmlsZXMvLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLiBUaGUgc2tpbGwgd2FzIHJlbmFtZWRcbiAgICAvLyB0byBgUGluY2hHcmFiYDsgYW55IGB+Ly5kb3RmaWxlcy9gIHByZWZpeCBpcyBzdHJpcHBlZCBmcm9tXG4gICAgLy8gZXhwb3NlZCBkZWZhdWx0cyAoZG90ZmlsZXMgaXMgYSBwZXJzb25hbCBjb25maWcgc291cmNlIOKAlCBleHBvcnRzXG4gICAgLy8gc2hvdWxkbid0IGxlYWsgdGhhdCBwYXRoKS5cbiAgICBjb25zdCB1cGdyYWRlUGF0aCA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQsIGZyZXNoOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgaWYgKCFwKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5pbmNsdWRlcygnLmRvdGZpbGVzJykpIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmVuZHNXaXRoKCdza2lsbHMvdWkvU0tJTEwubWQnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25QYXRoID0gdXBncmFkZVBhdGgocHJlZnMuZGVzaWduUGF0aCwgREVGQVVMVF9QUkVGUy5kZXNpZ25QYXRoKTtcbiAgICBwcmVmcy5za2lsbFBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5za2lsbFBhdGgsIERFRkFVTFRfUFJFRlMuc2tpbGxQYXRoKTtcbiAgICAvLyBDb250ZW50IG1pZ3JhdGlvbjogcHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHRoZSBlbnRpcmUgdGVtcGxhdGVcbiAgICAvLyB0ZXh0IGluc2lkZSBgcHJlZnMuZGVzaWduTWRgIC8gYHByZWZzLnNraWxsTWRgIGFzIGRlZmF1bHRzLiBUaGF0XG4gICAgLy8gYXRlIH4zNjBLQiBvZiBjaHJvbWUuc3RvcmFnZSBxdW90YSBmb3Igbm8gYmVuZWZpdC4gRGV0ZWN0IHdoZW5cbiAgICAvLyB0aGUgc3RvcmVkIHZhbHVlIG1hdGNoZXMgb25lIG9mIHRoZSBidW5kbGVkIHRlbXBsYXRlcyBhbmQgY2xlYXJcbiAgICAvLyBpdCDigJQgdGhlIHJlc29sdmVyIGZhbGxzIGJhY2sgdG8gdGhlIGJ1bmRsZWQgZmlsZSBvbiB0aGUgZmx5LlxuICAgIC8vIEFsc28gc2NydWIgYW55IGxlYWtlZCBgfi8uZG90ZmlsZXMvYCBzdWJzdHJpbmcuXG4gICAgY29uc3Qgc2NydWJEb3RmaWxlcyA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgIHMucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvLmFnZW50cy8nLCAnfi8uYWdlbnRzLycpXG4gICAgICAgLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLycsICd+Ly5hZ2VudHMvJyk7XG4gICAgY29uc3QgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZSA9IGFzeW5jIChjdXJyZW50OiBzdHJpbmcsIGtleXM6IFRlbXBsYXRlS2V5W10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgaWYgKCFjdXJyZW50IHx8ICFjdXJyZW50LnRyaW0oKSkgcmV0dXJuICcnO1xuICAgICAgY29uc3QgdHJpbW1lZCA9IGN1cnJlbnQudHJpbSgpO1xuICAgICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgdHBsID0gKGF3YWl0IGxvYWRUZW1wbGF0ZShrKSkudHJpbSgpO1xuICAgICAgICBpZiAodHBsICYmIHRwbCA9PT0gdHJpbW1lZCkgcmV0dXJuICcnOyAvLyBtYXRjaGVzIGEgYnVuZGxlZCB0ZW1wbGF0ZSDigJQgY29sbGFwc2UgdG8gZW1wdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJyZW50LmluY2x1ZGVzKCcuZG90ZmlsZXMnKSA/IHNjcnViRG90ZmlsZXMoY3VycmVudCkgOiBjdXJyZW50O1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLmRlc2lnbk1kID8/ICcnLCBbJ2xvY2FsRGVzaWduJywgJ2Rlc2lnblRlbXBsYXRlJ10pO1xuICAgIHByZWZzLnNraWxsTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLnNraWxsTWQgPz8gJycsIFsnbG9jYWxTa2lsbCcsICdza2lsbFRlbXBsYXRlJ10pO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UoYWN0aXZlV3MpO1xuICB9O1xuICBjb25zdCBsb2FkV29ya3NwYWNlID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGFjdGl2ZVdzID0gbmFtZTtcbiAgICB2b2lkIFN0b3JlLnNldCgncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsIG5hbWUpO1xuICAgIC8vIE1pbnQgYSBuZXcgc2Vzc2lvbklkIHBlciB3b3Jrc3BhY2UgbG9hZC4gU2FtZSB3b3Jrc3BhY2UgcmUtb3BlbmVkXG4gICAgLy8gPSBuZXcgc2Vzc2lvbjogZGlzdGluY3QgdXVpZCBzbyBhIGNvbnN1bWVyIGNhbiB0ZWxsIHR3byBib290c1xuICAgIC8vIGFwYXJ0IGV2ZW4gd2hlbiB0aGUgY2FwdHVyZXMgbGFuZCBpbiB0aGUgc2FtZSBvbi1kaXNrIGZpbGUuXG4gICAgc2Vzc2lvbklkID0gbXNnSWQoKTtcbiAgICBtZXNzYWdlcyA9IChhd2FpdCBTdG9yZS5nZXQ8UGFuZWxNZXNzYWdlW10+KHdzTXNnS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIG1lc3NhZ2VzID0gW107XG4gICAgLy8gTWlncmF0ZSBsZWdhY3kgZW50cmllcyAobm8gdWlkLCBzdGF0ZXMtYXMtcmVjb3JkLCBhdHRycy5mb3JtYXQpIGFuZFxuICAgIC8vIHBlcnNpc3QgaWYgYW55dGhpbmcgY2hhbmdlZCBzbyB3ZSBkb24ndCBwYXkgdGhlIG1pZ3JhdGlvbiBjb3N0IGFnYWluXG4gICAgLy8gbmV4dCBsb2FkLlxuICAgIGlmIChtaWdyYXRlTG9hZGVkTWVzc2FnZXMoKSkgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkobmFtZSksIG1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBhZ2VTaG90c0ZpcmVkLmNsZWFyKCk7XG4gICAgY29uc3Qgc3RvcmVkID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZCkpIHNob3RzLnNldChrLCB2KTtcbiAgICAvLyBSZXN0b3JlIHRoZSBmdWxsLXJlc29sdXRpb24gUE5HIGNhY2hlIHNvIGEgd29ya3NwYWNlIGFyY2hpdmVcbiAgICAvLyBleHBvcnRlZCBBRlRFUiBhIHBhbmVsIHJlbG9hZCBzdGlsbCBidW5kbGVzIHNjcmVlbnNob3RzIGZyb21cbiAgICAvLyBlYXJsaWVyIGNhcHR1cmVzLiBGSUZPIG9yZGVyIGlzIHByZXNlcnZlZCBieSBPYmplY3Qga2V5IG9yZGVyLlxuICAgIGNvbnN0IHN0b3JlZEZ1bGwgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNGdWxsS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZEZ1bGwpKSBzaG90c0Z1bGwuc2V0KGssIHYpO1xuICAgIC8vIExvYWQgdGhpcyB3b3Jrc3BhY2UncyBwZXJzaXN0ZW50IHNuYXBzaG90IGhpc3RvcnkgKENsZWFyLWFsbCBhcmNoaXZlcykuXG4gICAgYXdhaXQgbG9hZFdzU25hcHNob3RzKG5hbWUpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBzZWxlY3RvckVycm9ycy5jbGVhcigpO1xuICAgIHVuZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBudWxsO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3QgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkoYWN0aXZlV3MpLCBtZXNzYWdlcyk7XG4gICAgLy8gUHVzaCBjYXB0dXJlZC1zZWxlY3RvciBzZXQgc28gdGhlIGNvbnRlbnQgc2NyaXB0J3MgaG92ZXIgd2Fsa2VyIGNhblxuICAgIC8vIHJlc29sdmUgZGVzY2VuZGFudHMg4oaSIGNhcHR1cmVkIGFuY2VzdG9yLlxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBzZW5kVG9DUyh7a2luZDogJ3NldC1jYXB0dXJlZCcsIHNlbGVjdG9yc30pO1xuICAgIHNjaGVkdWxlQXV0b3NhdmUoKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgRGlzayBhdXRvc2F2ZSAoY3Jhc2gvcmVpbnN0YWxsIHNhZmV0eSBuZXQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDYXB0dXJlcyArIGNvbW1lbnRzIG90aGVyd2lzZSBsaXZlIE9OTFkgaW4gY2hyb21lLnN0b3JhZ2UgdW50aWwgYW5cbiAgLy8gZXhwb3J0LiBjaHJvbWUuc3RvcmFnZSBpcyBwZXItZXh0ZW5zaW9uLWluc3RhbmNlLCBzbyBhIFJlbW92ZStyZS1hZGQgb2ZcbiAgLy8gYW4gdW5wYWNrZWQgYnVpbGQgKG5ldyBleHRlbnNpb24gaWQpIOKAlCBvciBhIHN0b3JhZ2UgY2xlYXIg4oCUIHNpbGVudGx5XG4gIC8vIHdpcGVzIGV2ZXJ5IHdvcmtzcGFjZSwgYW5kIHRoZSBvbi1kaXNrIHNjcmVlbnNob3RzIGJlY29tZSBvcnBoYW5zIHdpdGhcbiAgLy8gbm8gYW5ub3RhdGlvbnMuIFRoaXMgZGVib3VuY2VkIG1pcnJvciB3cml0ZXMgdGhlIHdvcmtzcGFjZSBKU09OTCB0b1xuICAvLyBEb3dubG9hZHMvcGluY2hncmFiLzx3cz4vPHdzPi5hdXRvc2F2ZS5qc29ubCAocmlnaHQgYmVzaWRlIHNjcmVlbnNob3RzLylcbiAgLy8gc28gdGhlIHdvcmsgaXMgYWx3YXlzIHJlY292ZXJhYmxlIGJ5IEltcG9ydCwgaW5kZXBlbmRlbnQgb2YgdGhlXG4gIC8vIGV4dGVuc2lvbidzIHN0b3JhZ2UuIE92ZXJ3cml0ZXMgaW4gcGxhY2U7IFF1aWV0IHNhdmVzIHN1cHByZXNzZXMgdGhlXG4gIC8vIGRvd25sb2FkIHBvcHVwLlxuICBjb25zdCBBVVRPU0FWRV9ERUJPVU5DRV9NUyA9IDEyMDAwO1xuICBsZXQgYXV0b3NhdmVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG4gIGxldCBhdXRvc2F2ZURpcnR5ID0gZmFsc2U7XG4gIGNvbnN0IGZsdXNoQXV0b3NhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgYXV0b3NhdmVEaXJ0eSA9IGZhbHNlO1xuICAgIGlmIChhdXRvc2F2ZVRpbWVyKSB7IGNsZWFyVGltZW91dChhdXRvc2F2ZVRpbWVyKTsgYXV0b3NhdmVUaW1lciA9IHVuZGVmaW5lZDsgfVxuICAgIGlmICghaW5FeHRlbnNpb24gfHwgIXByZWZzLmF1dG9zYXZlVG9EaXNrIHx8ICFtZXNzYWdlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCB3cyA9IGFjdGl2ZVdzO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYCR7d3N9LmF1dG9zYXZlLmpzb25sYDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoZmlsZW5hbWUsICdqc29ubCcpO1xuICAgICAgdm9pZCBzZW5kVG9CZyh7a2luZDogJ3NhdmUtdGV4dCcsIHdvcmtzcGFjZTogd3MsIGZpbGVuYW1lLCB0ZXh0LCBtaW1lOiAnYXBwbGljYXRpb24vanNvbmwnLCBzdWJkaXI6ICcnfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdhdXRvc2F2ZSBmYWlsZWQnLCBlcnIpOyB9XG4gIH07XG4gIGNvbnN0IHNjaGVkdWxlQXV0b3NhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbiB8fCAhcHJlZnMuYXV0b3NhdmVUb0Rpc2spIHJldHVybjtcbiAgICBhdXRvc2F2ZURpcnR5ID0gdHJ1ZTtcbiAgICBpZiAoYXV0b3NhdmVUaW1lcikgcmV0dXJuOyAvLyBvbmUgd3JpdGUgcGVyIGRlYm91bmNlIHdpbmRvd1xuICAgIGF1dG9zYXZlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHsgYXV0b3NhdmVUaW1lciA9IHVuZGVmaW5lZDsgaWYgKGF1dG9zYXZlRGlydHkpIGZsdXNoQXV0b3NhdmUoKTsgfSwgQVVUT1NBVkVfREVCT1VOQ0VfTVMpO1xuICB9O1xuICAvLyBGbHVzaCBwZW5kaW5nIHdvcmsgdGhlIG1vbWVudCB0aGUgcGFuZWwgaXMgaGlkZGVuL2Nsb3NlZCDigJQgdGhlIGxhc3RcbiAgLy8gZGVib3VuY2Ugd2luZG93IHdvdWxkIG90aGVyd2lzZSBiZSBsb3N0IG9uIGNsb3NlLlxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgKCkgPT4geyBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJyAmJiBhdXRvc2F2ZURpcnR5KSBmbHVzaEF1dG9zYXZlKCk7IH0pO1xuICBjb25zdCBwZXJzaXN0UHJlZnMgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQoUFJFRlNfU1RPUkFHRV9OQU1FLCBwcmVmcyk7XG4gICAgLy8gUHVzaCB0aGUgc3Vic2V0IG9mIHByZWZzIHRoZSBjb250ZW50IHNjcmlwdCBjYXJlcyBhYm91dCBzbyBpdHNcbiAgICAvLyBvdmVybGF5IChzcGFjaW5nIHZpc3VhbGl6ZXIsIGhvdmVyIHNuYXAsIGV0Yy4pIHJlZmxlY3RzIHRoZSBsYXRlc3QuXG4gICAgdm9pZCBzZW5kVG9DUyh7XG4gICAgICBraW5kOiAnc2V0LWNzLXByZWZzJyxcbiAgICAgIHNwYWNpbmdPdmVybGF5OiBwcmVmcy5zcGFjaW5nT3ZlcmxheSxcbiAgICAgIGhvdmVyU25hcDogcHJlZnMuaG92ZXJTbmFwLFxuICAgIH0pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHMpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0tleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgcGVyc2lzdGVuY2Ugd2l0aCBGSUZPIGV2aWN0aW9uLiBkYXRhVVJMIHN0cmluZ3NcbiAgLy8gY2FuIHJ1biA1MC01MDAgS0IgZWFjaDsgdGhlIGRlZmF1bHQgcXVvdGEgZ2V0cyBleGhhdXN0ZWQgaW4gdGVucyBvZlxuICAvLyBjYXB0dXJlcyB3aXRob3V0IGEgYnVkZ2V0LiBNYXAgaW5zZXJ0aW9uIG9yZGVyID0gRklGTyBvcmRlciwgc29cbiAgLy8gd2UgZXZpY3QgZnJvbSB0aGUgZnJvbnQgdW50aWwgdW5kZXIgYnVkZ2V0IGJlZm9yZSBwZXJzaXN0aW5nLlxuICBjb25zdCBldmljdFNob3RzRnVsbFRvQnVkZ2V0ID0gKCk6IG51bWJlciA9PiB7XG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2hvdHNGdWxsLnZhbHVlcygpKSB0b3RhbCArPSB2Lmxlbmd0aDtcbiAgICBsZXQgZXZpY3RlZCA9IDA7XG4gICAgd2hpbGUgKHRvdGFsID4gU0hPVFNfRlVMTF9CVURHRVRfQllURVMpIHtcbiAgICAgIGNvbnN0IGZpcnN0S2V5ID0gc2hvdHNGdWxsLmtleXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICBpZiAoZmlyc3RLZXkgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBjb25zdCByZW1vdmVkID0gc2hvdHNGdWxsLmdldChmaXJzdEtleSk7XG4gICAgICBpZiAocmVtb3ZlZCA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIHNob3RzRnVsbC5kZWxldGUoZmlyc3RLZXkpO1xuICAgICAgdG90YWwgLT0gcmVtb3ZlZC5sZW5ndGg7XG4gICAgICBldmljdGVkKys7XG4gICAgfVxuICAgIHJldHVybiBldmljdGVkO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHNGdWxsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGV2aWN0ZWQgPSBldmljdFNob3RzRnVsbFRvQnVkZ2V0KCk7XG4gICAgaWYgKGV2aWN0ZWQgPiAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csIGBzaG90c0Z1bGwgRklGTy1ldmljdGVkICR7ZXZpY3RlZH0gb2xkZXN0IGVudHJpZXMgdG8gZml0ICR7U0hPVFNfRlVMTF9CVURHRVRfQllURVMgLyAxMDI0IC8gMTAyNH1NQiBidWRnZXRgKTtcbiAgICB9XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHNGdWxsKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNGdWxsS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFdvcmtzcGFjZXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKTsgfTtcblxuICAvLyDilIDilIDilIAgVGFiIOKHhCB3b3Jrc3BhY2UgYmluZGluZyAoIzE4KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQmFja2dyb3VuZCBhbm5vdW5jZXMgZWFjaCB0b29sYmFyLWNsaWNrIGFjdGl2YXRpb24gdmlhICdwZy10YWItYWN0aXZhdGVkJy5cbiAgLy8gVGhlIGZpcnN0IGFjdGl2YXRpb24gYWRvcHRzIHRoZSBjdXJyZW50IHVuYm91bmQgd29ya3NwYWNlOyBsYXRlciB0YWJzIGVhY2hcbiAgLy8gZ2V0IHRoZWlyIG93bi4gUGlja2luZyBhIGJvdW5kIHdvcmtzcGFjZSBqdW1wcyB0aGUgYnJvd3NlciB0byBpdHMgdGFiLlxuICBjb25zdCBzbHVnRm9yVGFiID0gKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0cnkgeyBjb25zdCBoID0gbmV3IFVSTCh1cmwpLmhvc3RuYW1lLnJlcGxhY2UoL153d3dcXC4vLCAnJyk7IGlmIChoKSByZXR1cm4gaDsgfSBjYXRjaCB7IC8qIG5vdCBhIHVybCAqLyB9XG4gICAgY29uc3QgdCA9ICh0aXRsZSB8fCAnJykudHJpbSgpO1xuICAgIHJldHVybiB0ID8gdC5zbGljZSgwLCAyNCkgOiAndGFiJztcbiAgfTtcbiAgY29uc3QgdW5pcXVlV3NOYW1lID0gKGJhc2U6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLnNvbWUoKHcpID0+IHcubmFtZSA9PT0gYmFzZSkpIHJldHVybiBiYXNlO1xuICAgIGZvciAobGV0IGkgPSAyOyA7IGkrKykgeyBjb25zdCBuID0gYCR7YmFzZX0gJHtpfWA7IGlmICghd29ya3NwYWNlcy5zb21lKCh3KSA9PiB3Lm5hbWUgPT09IG4pKSByZXR1cm4gbjsgfVxuICB9O1xuICBjb25zdCBvblRhYkFjdGl2YXRlZCA9IGFzeW5jICh7dGFiSWQsIHVybCwgdGl0bGV9OiB7dGFiSWQ6IG51bWJlcjsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmd9KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IHdzID0gd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3LnRhYklkID09PSB0YWJJZCk7XG4gICAgaWYgKHdzKSB7XG4gICAgICBpZiAod3MudXJsICE9PSB1cmwgfHwgd3MudGl0bGUgIT09IHRpdGxlKSB7IHdzLnVybCA9IHVybDsgd3MudGl0bGUgPSB0aXRsZTsgcGVyc2lzdFdvcmtzcGFjZXMoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IGFjdGl2ZVdzKTtcbiAgICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQudGFiSWQgPT0gbnVsbCkge1xuICAgICAgICB3cyA9IGN1cnJlbnQ7IHdzLnRhYklkID0gdGFiSWQ7IHdzLnVybCA9IHVybDsgd3MudGl0bGUgPSB0aXRsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdzID0ge25hbWU6IHVuaXF1ZVdzTmFtZShzbHVnRm9yVGFiKHVybCwgdGl0bGUpKSwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRhYklkLCB1cmwsIHRpdGxlfTtcbiAgICAgICAgd29ya3NwYWNlcy5wdXNoKHdzKTtcbiAgICAgIH1cbiAgICAgIHBlcnNpc3RXb3Jrc3BhY2VzKCk7XG4gICAgfVxuICAgIGlmIChhY3RpdmVXcyAhPT0gd3MubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3cy5uYW1lKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG4gIC8vIEJyaW5nIHRoZSBicm93c2VyIHRvIGEgd29ya3NwYWNlJ3MgYm91bmQgdGFiIHdoZW4gdGhlIHVzZXIgcGlja3MgaXQuXG4gIGNvbnN0IGZvY3VzV29ya3NwYWNlVGFiID0gKG5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHdzID0gd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IG5hbWUpO1xuICAgIGlmICghaW5FeHRlbnNpb24gfHwgd3M/LnRhYklkID09IG51bGwpIHJldHVybjtcbiAgICBjaHJvbWUudGFicy51cGRhdGUod3MudGFiSWQsIHthY3RpdmU6IHRydWV9KS50aGVuKCh0KSA9PiB7XG4gICAgICBpZiAodD8ud2luZG93SWQgIT0gbnVsbCkgdm9pZCBjaHJvbWUud2luZG93cz8udXBkYXRlKHQud2luZG93SWQsIHtmb2N1c2VkOiB0cnVlfSk/LmNhdGNoPy4oKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgfSkuY2F0Y2goKCkgPT4geyAvKiB0YWIgd2FzIGNsb3NlZCAqLyB9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU25hcHNob3QgLyB1bmRvIC8gcmVkbyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc25hcHNob3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN1c3BlbmRTbmFwc2hvdHMpIHJldHVybjtcbiAgICBpZiAodW5kb1N0YWNrLmxlbmd0aCA+PSBVTkRPX0NBUCkgdW5kb1N0YWNrLnNoaWZ0KCk7XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZXN0b3JlID0gKGpzb246IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSB0cnVlO1xuICAgIHRyeSB7IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShqc29uKSBhcyBQYW5lbE1lc3NhZ2VbXTsgfSBjYXRjaCB7IG1lc3NhZ2VzID0gW107IH1cbiAgICBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICBjb25zdCB1bmRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghdW5kb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gdW5kbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgcmVkb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHVuZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnVW5kb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVkbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXJlZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHJlZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZShyZWRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1JlZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVVuZG9CdXR0b25zID0gKCk6IHZvaWQgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInVuZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCB1bmRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJyZWRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgcmVkb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUNvcHlQYXRoQnV0dG9uID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1hY3Rpb249XCJjb3B5LXBhdGhcIl0nKTtcbiAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgIGNvbnN0IGhhcyA9IEJvb2xlYW4obGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGgpO1xuICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsICFoYXMpO1xuICAgIGJ0bi5kYXRhc2V0LnRpcCA9IGhhc1xuICAgICAgPyBgQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LlxcbiR7bGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGggPz8gJyd9YFxuICAgICAgOiAnQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LiBSdW4gYW4gZXhwb3J0IGZpcnN0Lic7XG4gIH07XG4gIGNvbnN0IG9uQ29weVBhdGggPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoO1xuICAgIGlmICghcGF0aFRvQ29weSkge1xuICAgICAgc2V0U3RhdHVzKCdObyBleHBvcnQgeWV0IOKAlCBydW4gYSBkb3dubG9hZCBmaXJzdCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHBhdGhUb0NvcHkpO1xuICAgICAgLy8gU2hvdyBvbmx5IHRoZSBsZWFmIGZpbGVuYW1lIGluIHRoZSBzdGF0dXMg4oCUIHRoZSBmdWxsIFdpbmRvd3Mtc3R5bGVcbiAgICAgIC8vIGFic29sdXRlIHBhdGggd291bGQgYmUgMTAwKyBjaGFycyBhbmQgd2FzIGRpc3J1cHRpbmcgdGhlIHNpZGViYXJcbiAgICAgIC8vIGxheW91dCBmb3IgdGhlIDItc2Vjb25kIHN0YXR1cyBUVEwuXG4gICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgc2V0U3RhdHVzKGBDb3BpZWQgcGF0aCDCtyAke2xlYWZ9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgcGF0aCcsIGxlYWYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIHdyaXRlIGZhaWxlZDogJyArIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2UgdG8gYWN0aXZlIHRhYiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZFRvQ1MgPSBhc3luYyAocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgbXNnID0gcGcocGF5bG9hZCk7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBpZiAodGFic1swXT8uaWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgbXNnKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IG1zZ30pKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZW5kVG9DU0FuZFdhaXQgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4gbmV3IFByb21pc2U8UiB8IG51bGw+KChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikge1xuICAgICAgY29uc3QgcmVxSWQgPSBgcmVxXyR7c2VjdXJlVG9rZW4oMTIpfWA7XG4gICAgICBjb25zdCBvblJlc3AgPSAoZTogRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3QgZGV0YWlsID0gKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbDtcbiAgICAgICAgaWYgKGRldGFpbD8uX19yZXFJZCA9PT0gcmVxSWQpIHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTtcbiAgICAgICAgICByZXNvbHZlKGRldGFpbC5yZXBseSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLWNzJywge2RldGFpbDoge19fcmVxSWQ6IHJlcUlkLCAuLi5wZyhwYXlsb2FkKX19KSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7IHJlc29sdmUobnVsbCk7IH0sIDEwMDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgKHRhYnMpID0+IHtcbiAgICAgIGlmICghdGFic1swXT8uaWQpIHsgcmVzb2x2ZShudWxsKTsgcmV0dXJuOyB9XG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCBwZyhwYXlsb2FkKSwgKHI6IFIpID0+IHJlc29sdmUocikpO1xuICAgIH0pO1xuICB9KTtcbiAgY29uc3Qgc2VuZFRvQmcgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0JnKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHJldHVybiBudWxsO1xuICAgIHRyeSB7IHJldHVybiAoYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UocGcocGF5bG9hZCkpKSBhcyBSOyB9XG4gICAgY2F0Y2ggKGUpIHsgcmV0dXJuIHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gYXMgdW5rbm93biBhcyBSOyB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFJlY2VpdmluZyBmcm9tIGNvbnRlbnQgc2NyaXB0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBEZWZlbnNpdmUgcmluZy1idWZmZXIgZGVkdXBlOiBldmVuIHRob3VnaCB3ZSBub3cgdXNlIG9ubHkgb25lIGNoYW5uZWwsXG4gIC8vIGFueSBtZXNzYWdlIHRoYXQgc29tZWhvdyBhcnJpdmVzIHR3aWNlIHdpdGhpbiB+MiBzZWNvbmRzIGlzIGlnbm9yZWQuXG4gIGNvbnN0IHJlY2VudE1pZHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFJFQ0VOVF9NSURfQ0FQID0gNjQ7XG4gIGNvbnN0IG9uQ3NNZXNzYWdlID0gKG1zZzogUGdFbnZlbG9wZTxDc1RvUGFuZWw+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFtc2cgfHwgbXNnLl9fcGcgIT09IHRydWUpIHJldHVybjtcbiAgICBpZiAobXNnLl9fbWlkKSB7XG4gICAgICBpZiAocmVjZW50TWlkcy5pbmNsdWRlcyhtc2cuX19taWQpKSByZXR1cm47XG4gICAgICByZWNlbnRNaWRzLnB1c2gobXNnLl9fbWlkKTtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmxlbmd0aCA+IFJFQ0VOVF9NSURfQ0FQKSByZWNlbnRNaWRzLnNoaWZ0KCk7XG4gICAgfVxuICAgIGlmICgobXNnIGFzIHtraW5kPzogc3RyaW5nfSkua2luZCA9PT0gJ3BnLXRhYi1hY3RpdmF0ZWQnKSB7XG4gICAgICB2b2lkIG9uVGFiQWN0aXZhdGVkKG1zZyBhcyB1bmtub3duIGFzIHt0YWJJZDogbnVtYmVyOyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzd2l0Y2ggKG1zZy5raW5kKSB7XG4gICAgICBjYXNlICdjYXB0dXJlJzogb25DYXB0dXJlKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2hvdmVyJzogb25Ib3Zlcihtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnaG92ZXInfT4pOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlci1lbmQnOiBvbkhvdmVyRW5kKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BlbmRpbmctYWRkJzogb25QZW5kaW5nQWRkKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BlbmRpbmctY2xlYXInOiBvblBlbmRpbmdDbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdmZWVkYmFjay1hZGQnOiBvbkZlZWRiYWNrQWRkKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3ByZWZlcmVuY2UtY2hhbmdlJzogb25QcmVmZXJlbmNlQ2hhbmdlKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSd9Pik7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BhZ2Utc25hcHNob3QnOiBvblBhZ2VTbmFwc2hvdCgobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ3BhZ2Utc25hcHNob3QnfT4pLnBheWxvYWQpOyByZXR1cm47XG4gICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUHJlZmVyZW5jZUNoYW5nZSA9ICh7cmVhc29uLCBwYWdlfToge3JlYXNvbjogc3RyaW5nOyBwYWdlOiBhbnl9KTogdm9pZCA9PiB7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2U/LnVybCA/PyBsaXZlVGFiVXJsO1xuICAgIGxpdmVUYWJQYXRoID0gbGl2ZVRhYlVybCA/IHBhdGhPZihsaXZlVGFiVXJsKSA6IGxpdmVUYWJQYXRoO1xuICAgIC8vIFBhZ2Ugcm93cyBhcmUgY2FwdHVyZSBoZWFkZXJzLCBub3QgYSB0YWIvcGFnZSB0ZWxlbWV0cnkgZmVlZC4gVGhlIG5leHRcbiAgICAvLyBzZWxlY3RvciBjYXB0dXJlIGZyb20gdGhpcyBwYWdlIHdpbGwgY2FycnkgdGhlIG5ldyB2aWV3cG9ydC9zdGF0ZSBhbmRcbiAgICAvLyBpbnNlcnQgYSBwYWdlIGhlYWRlciBvbmx5IGlmIG5lZWRlZC5cbiAgICBzZXRTdGF0dXMoYCR7cmVhc29ufSBjaGFuZ2VkYCwge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuXG4gIC8vIFBhZ2UtZ3JvdXAgcmVjb3JkcyBtYXkgY2FycnkgYSBmdWxsLXBhZ2Ugc25hcHNob3QgKHZpZXdwb3J0LCBzY3JvbGxcbiAgLy8gZXh0ZW50cywgZHByLCBsYW5nLCBmdWxsLXBhZ2Ugc2NyZWVuc2hvdCkuIFBhZ2VNZXNzYWdlIGluIHR5cGVzLnRzIGRvZXNuJ3RcbiAgLy8geWV0IGRlY2xhcmUgdGhlIGZpZWxkLCBzbyB3ZSB3aWRlbiBpdCBsb2NhbGx5IOKAlCB0aGUgdmFsdWUgcGVyc2lzdHMgd2l0aFxuICAvLyB0aGUgcmVzdCBvZiB0aGUgbWVzc2FnZSBKU09OIGFuZCByb3VuZC10cmlwcyB0aHJvdWdoIGV4cG9ydC5cbiAgdHlwZSBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCA9IFBhZ2VNZXNzYWdlICYge3NuYXBzaG90PzogUGFnZVNuYXBzaG90fTtcbiAgLy8gU25hcHNob3RzIHRoYXQgYXJyaXZlZCBiZWZvcmUgYSBwYWdlLWdyb3VwIHJlY29yZCBleGlzdHMgZm9yIHRoZWlyIFVSTC5cbiAgLy8gQXBwbGllZCB3aGVuIHRoZSBwYWdlIGhlYWRlciBpcyBsYXRlciBjcmVhdGVkIChzZWUgb25DYXB0dXJlKS5cbiAgY29uc3QgcGVuZGluZ1NuYXBzaG90cyA9IG5ldyBNYXA8c3RyaW5nLCBQYWdlU25hcHNob3Q+KCk7XG4gIGNvbnN0IGFwcGx5U25hcHNob3RUb1BhZ2UgPSAoc25hcDogUGFnZVNuYXBzaG90KTogYm9vbGVhbiA9PiB7XG4gICAgLy8gQXR0YWNoIHRvIHRoZSBtb3N0IHJlY2VudCBwYWdlLWdyb3VwIHJlY29yZCBmb3IgdGhpcyBVUkwuXG4gICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3BhZ2UnICYmIG0udXJsID09PSBzbmFwLnVybCkge1xuICAgICAgICAobSBhcyBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCkuc25hcHNob3QgPSBzbmFwO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBjb25zdCBvblBhZ2VTbmFwc2hvdCA9IChwYXlsb2FkOiBQYWdlU25hcHNob3QpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBheWxvYWQ/LnVybCkgcmV0dXJuO1xuICAgIGlmIChhcHBseVNuYXBzaG90VG9QYWdlKHBheWxvYWQpKSB7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gcGFnZSByZWNvcmQgeWV0IOKAlCBzdGFzaCBmb3IgdGhlIG5leHQgY2FwdHVyZSBvbiB0aGlzIFVSTC5cbiAgICAgIHBlbmRpbmdTbmFwc2hvdHMuc2V0KHBheWxvYWQudXJsLCBwYXlsb2FkKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25GZWVkYmFja0FkZCA9ICh7c2VsZWN0b3IsIHRleHQsIHVybCwgcGFyZW50VWlkfToge3NlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9KTogdm9pZCA9PiB7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IGluIHByaW9yaXR5IG9yZGVyOlxuICAgIC8vICAgMS4gcGFyZW50VWlkIOKAlCB0aGUgY29udGVudCBzY3JpcHQgc3VwcGxpZWQgYSBzdGFibGUgdWlkICh0aGVcbiAgICAvLyAgICAgIHN0cm9uZ2VzdCBtYXRjaDsgc3Vydml2ZXMgc2VsZWN0b3IgY2hhbmdlcywgc2libGluZ1xuICAgIC8vICAgICAgY29sbGlzaW9ucywgbXVsdGlwbGUgY2FwdHVyZXMgb2YgdGhlIHNhbWUgZWxlbWVudCkuXG4gICAgLy8gICAyLiBzZWxlY3RvciArIHVybCDigJQgY29tcG9zaXRlIGtleTsgcHJldmVudHMgY3Jvc3MtcGFnZVxuICAgIC8vICAgICAgY29udGFtaW5hdGlvbiB3aGVuIHRoZSBzYW1lIHNlbGVjdG9yIGV4aXN0cyBvbiBtdWx0aXBsZSBVUkxzLlxuICAgIC8vICAgMy4gc2VsZWN0b3IgKyBsaXZlVGFiVXJsIOKAlCBmYWxsYmFjayB3aGVuIHRoZSBtZXNzYWdlIGRpZG4ndFxuICAgIC8vICAgICAgY2FycnkgYW4gZXhwbGljaXQgdXJsIChvbGRlciBjb250ZW50LXNjcmlwdCBtZXNzYWdlcykuXG4gICAgbGV0IGlkeCA9IC0xO1xuICAgIGlmIChwYXJlbnRVaWQpIHtcbiAgICAgIGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIG0uZW50cnkudWlkID09PSBwYXJlbnRVaWQpO1xuICAgIH1cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgY29uc3Qgd2FudFVybCA9IHVybCA/PyBsaXZlVGFiVXJsID8/IG51bGw7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+XG4gICAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJ1xuICAgICAgICAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvclxuICAgICAgICAmJiAoIXdhbnRVcmwgfHwgbS5lbnRyeS51cmwgPT09IHdhbnRVcmwpKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdvbkZlZWRiYWNrQWRkOiBubyBwYXJlbnQgZm91bmQnLCB7c2VsZWN0b3IsIHVybCwgcGFyZW50VWlkfSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgbG9zdCBpdHMgcGFyZW50IOKAlCBjaGVjayB0aGUgYWN0aXZlIGNhcHR1cmUnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgcGFyZW50TXNnID0gbWVzc2FnZXNbaWR4XSBhcyBTZWxlY3Rvck1lc3NhZ2U7XG4gICAgbGV0IGluc2VydEF0ID0gaWR4ICsgMTtcbiAgICB3aGlsZSAoaW5zZXJ0QXQgPCBtZXNzYWdlcy5sZW5ndGggJiYgbWVzc2FnZXNbaW5zZXJ0QXRdPy50eXBlID09PSAnZmVlZGJhY2snKSBpbnNlcnRBdCsrO1xuICAgIC8vIFN0YW1wIHBhcmVudFVpZCBvbiB0aGUgbmV3IGZlZWRiYWNrIHJvdyBzbyB0aGUgZXhwb3J0IGNhcnJpZXNcbiAgICAvLyB0aGUgRksgbGluayBleHBsaWNpdGx5IChub3QganVzdCBieSBjYXB0dXJlLWFkamFjZW5jeSkuXG4gICAgbWVzc2FnZXMuc3BsaWNlKGluc2VydEF0LCAwLCB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIHBhcmVudFVpZDogcGFyZW50TXNnLmVudHJ5LnVpZCxcbiAgICB9KTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdDb21tZW50IGFkZGVkIGZyb20gcGFnZScpO1xuICAgIC8vIEV2ZXJ5IGZlZWRiYWNrIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuIElmIHRoZSBwYXJlbnRcbiAgICAvLyBjYXB0dXJlIGRpZG4ndCBnZXQgb25lIChhdXRvU2NyZWVuc2hvdCBvZmYsIHNraXBTY3JlZW5zaG90SG9zdHNcbiAgICAvLyBoaXQsIG5ldHdvcmsgZ2xpdGNoKSwgcmUtZmlyZSBub3cuXG4gICAgaWYgKCFwYXJlbnRNc2cuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgdm9pZCBmaXJlRWxlbWVudFNob3QocGFyZW50TXNnKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25QZW5kaW5nQWRkID0gKHtlbnRyeX06IHtlbnRyeTogRW50cnl9KTogdm9pZCA9PiB7IHBlbmRpbmdNdWx0aS5wdXNoKGVudHJ5KTsgcmVuZGVyKCk7IH07XG4gIGNvbnN0IG9uUGVuZGluZ0NsZWFyID0gKCk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkgPSBbXTsgcmVuZGVyKCk7IH07XG5cbiAgY29uc3QgZmluZER1cGxpY2F0ZSA9IChzZWxlY3Rvcjogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFNlbGVjdG9yTWVzc2FnZSB8IHVuZGVmaW5lZCA9PlxuICAgIG1lc3NhZ2VzLmZpbmQoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PlxuICAgICAgbS50eXBlID09PSAnc2VsZWN0b3InICYmIG0uZW50cnkuc2VsZWN0b3IgPT09IHNlbGVjdG9yICYmICghdXJsIHx8IG0uZW50cnkudXJsID09PSB1cmwpKTtcblxuICAvLyBGaW5kIGFuIGV4aXN0aW5nIGNhcHR1cmUgZm9yIHRoZSBhY3RpdmUgdGFiICsgc2VsZWN0b3IuIENyb3NzLXBhZ2VcbiAgLy8gY29udGFtaW5hdGlvbiBwcmV2ZW50aW9uIChzZWUgdHlwZXMudHMgZmVlZGJhY2stYWRkIGRvY3N0cmluZyk6XG4gIC8vIGEgc2VsZWN0b3IgYWxvbmUgaXMgTk9UIGEgc3RhYmxlIGlkZW50aXR5IOKAlCBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWBcbiAgLy8gZXhpc3RzIG9uIGV2ZXJ5IHBhZ2U7IGBidXR0b25gIGlzIGV2ZXJ5d2hlcmUuIFN0cm9uZyBpZGVudGl0eSBpc1xuICAvLyAoc2VsZWN0b3IgKyB1cmwpLiBSZXR1cm5zIHRoZSBtb3N0IHJlY2VudCBtYXRjaCBzbyByZS1ob3ZlcmluZyBhblxuICAvLyBhbHJlYWR5LWNhcHR1cmVkIGVsZW1lbnQgcmVzb2x2ZXMgY29uc2lzdGVudGx5LlxuICBjb25zdCBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlID0gKHNlbGVjdG9yOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IGxpdmVUYWJVcmw7XG4gICAgLy8gV2FsayBiYWNrd2FyZHMgc28gdGhlIG1vc3QgcmVjZW50IG1hdGNoaW5nIGNhcHR1cmUgd2lucyB3aGVuIGFcbiAgICAvLyBzZWxlY3RvciBsZWdpdGltYXRlbHkgaGFzIG11bHRpcGxlIGNhcHR1cmVzIG9uIHRoZSBzYW1lIHBhZ2VcbiAgICAvLyAoZS5nLiwgdGhlIHVzZXIgcmUtY2FwdHVyZWQgdGhlIHNhbWUgZWxlbWVudCBhZnRlciBlZGl0cykuXG4gICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zZWxlY3RvciAhPT0gc2VsZWN0b3IpIGNvbnRpbnVlO1xuICAgICAgaWYgKHVybCAmJiBtLmVudHJ5LnVybCAhPT0gdXJsKSBjb250aW51ZTtcbiAgICAgIHJldHVybiBtO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIGNvbnN0IGNhbm9uaWNhbEVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICB0YWc6IGUudGFnLCBzZWxlY3RvcjogZS5zZWxlY3RvciwgdGV4dDogZS50ZXh0LCByb2xlOiBlLnJvbGUsXG4gICAgYXR0cnM6IGUuYXR0cnMsIGNsYXNzZXM6IGUuY2xhc3NlcyxcbiAgICByZWN0OiBlLnJlY3QsIG91dGVySFRNTDogZS5vdXRlckhUTUwsXG4gICAgc3R5bGVzOiBlLnN0eWxlcywgbWF0Y2hlZFJ1bGVzOiBlLm1hdGNoZWRSdWxlcyxcbiAgfSk7XG5cbiAgY29uc3Qgb25DYXB0dXJlID0gKHtlbnRyeSwgcGFnZSwgZ3JvdXBlZH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2NhcHR1cmUnfT4pOiB2b2lkID0+IHtcbiAgICBpZiAoIWVudHJ5IHx8ICFwYWdlKSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBsaXZlVGFiVXJsID0gcGFnZS51cmw7XG4gICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YocGFnZS51cmwpO1xuICAgIGlmIChncm91cGVkKSB7XG4gICAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgICBpZiAobT8udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgICBncm91cC5wdXNoKGVudHJ5KTtcbiAgICAgICAgICBtLmVudHJ5Lmdyb3VwID0gZ3JvdXA7XG4gICAgICAgICAgcGVyc2lzdCgpOyByZW5kZXIoKTsgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgICAvLyBGaXJlIGEgZ3JvdXAgc2hvdCB1c2luZyB0aGUgaGVhZCArIG1lbWJlcnMuIFRoZSBoZWFkJ3Mgc2VsZWN0b3JcbiAgICAgICAgICAvLyBpcyBtLmVudHJ5LnNlbGVjdG9yOyBtZW1iZXJzJyBzZWxlY3RvcnMgYXJlIGluIHRoZSBmcmVzaGx5XG4gICAgICAgICAgLy8gbXV0YXRlZCBncm91cCBhcnJheS5cbiAgICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbbS5lbnRyeS5zZWxlY3RvciwgLi4uKG0uZW50cnkuZ3JvdXAgPz8gW10pLm1hcCgoZykgPT4gZy5zZWxlY3RvcildO1xuICAgICAgICAgIHZvaWQgZmlyZUdyb3VwU2hvdChtLCBzZWxlY3RvcnMpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBEdXBlIGRldGVjdGlvbi4gQ3Jvc3MtY29udGFtaW5hdGlvbiBmaXg6IGEgKHNlbGVjdG9yLCB1cmwpIG1hdGNoXG4gICAgLy8gaXMgTkVDRVNTQVJZIGJ1dCBub3QgU1VGRklDSUVOVCDigJQgdHdvIHNpYmxpbmcgZWxlbWVudHMgd2l0aCB0aGVcbiAgICAvLyBzYW1lIHRlc3RJZCAvIHNhbWUgcm9sZS9hcmlhIHNlbGVjdG9yIGxpdmUgb24gdGhlIHNhbWUgVVJMIGJ1dFxuICAgIC8vIGFyZSBkaWZmZXJlbnQgY2FwdHVyZXMuIENvbXBhcmUgdGhlIGNhbm9uaWNhbC1lbnRyeSBoYXNoICh3aGljaFxuICAgIC8vIGluY2x1ZGVzIHJlY3QsIHRleHQsIG91dGVySFRNTCwgZXRjLikgYmVmb3JlIHRyZWF0aW5nIHRoZSBuZXdcbiAgICAvLyBjYXB0dXJlIGFzIGEgcmVmcmVzaCBvZiB0aGUgb2xkIG9uZS4gV2hlbiB0aGUgaGFzaCBkaWZmZXJzLCB3ZVxuICAgIC8vIGtlZXAgQk9USCBjYXB0dXJlcyByYXRoZXIgdGhhbiBvdmVyd3JpdGluZy5cbiAgICBjb25zdCBkdXBlID0gZmluZER1cGxpY2F0ZShlbnRyeS5zZWxlY3RvciwgZW50cnkudXJsKTtcbiAgICBpZiAoZHVwZSkge1xuICAgICAgY29uc3QgYmVmb3JlID0gY2Fub25pY2FsRW50cnkoZHVwZS5lbnRyeSk7XG4gICAgICBjb25zdCBhZnRlciA9IGNhbm9uaWNhbEVudHJ5KGVudHJ5KTtcbiAgICAgIGlmIChiZWZvcmUgPT09IGFmdGVyKSB7XG4gICAgICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIEhhc2hlcyBkaWZmZXIuIFR3byBjYXNlczpcbiAgICAgIC8vICAgKGEpIFNhbWUgZWxlbWVudCByZS1jYXB0dXJlZCBhZnRlciBjb250ZW50IGNoYW5nZSDigJQgdGhlIHJlY3RcbiAgICAgIC8vICAgICAgIHN0YXlzIHB1dCAod2l0aGluIGEgZmV3IHB4KSwgYnV0IHRleHQvb3V0ZXJIVE1MIG1vdmVkLlxuICAgICAgLy8gICAgICAgVHJlYXQgYXMgYSByZWZyZXNoLlxuICAgICAgLy8gICAoYikgRGlmZmVyZW50IGVsZW1lbnQgdGhhdCBoYXBwZW5zIHRvIHNoYXJlIGEgc2VsZWN0b3Ig4oCUIHRoZVxuICAgICAgLy8gICAgICAgcmVjdCBpcyBpbiBhIGRpZmZlcmVudCBwb3NpdGlvbi4gVHJlYXQgYXMgYSBuZXcgY2FwdHVyZS5cbiAgICAgIC8vIFdlIGRpc2NyaW1pbmF0ZSBieSByZWN0IG92ZXJsYXA6IGlmIGJvdGggcmVjdHMgZXhpc3QgYW5kIHRoZWlyXG4gICAgICAvLyBjZW50ZXJzIGFyZSB3aXRoaW4gOHB4IG9uIGJvdGggYXhlcywgcmVmcmVzaDsgb3RoZXJ3aXNlIGtlZXBcbiAgICAgIC8vIGJvdGguXG4gICAgICBjb25zdCByMSA9IGR1cGUuZW50cnkucmVjdDtcbiAgICAgIGNvbnN0IHIyID0gZW50cnkucmVjdDtcbiAgICAgIGNvbnN0IHNhbWVFbGVtZW50ID0gcjEgJiYgcjJcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnggKyByMS53IC8gMikgLSAocjIueCArIHIyLncgLyAyKSkgPD0gOFxuICAgICAgICAmJiBNYXRoLmFicygocjEueSArIHIxLmggLyAyKSAtIChyMi55ICsgcjIuaCAvIDIpKSA8PSA4O1xuICAgICAgaWYgKHNhbWVFbGVtZW50KSB7XG4gICAgICAgIGRlbGV0ZSBkdXBlLmR1cGVQZW5kaW5nO1xuICAgICAgICBkdXBlLmVudHJ5ID0gZW50cnk7XG4gICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cyhgVXBkYXRlZCAjJHtkdXBlLmVudHJ5Lm59YCwge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBEaWZmZXJlbnQgZWxlbWVudCB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIOKGkiBmYWxsIHRocm91Z2ggYW5kXG4gICAgICAvLyBlbWl0IGFzIGEgbmV3IGNhcHR1cmUuIFRoZSBhZ2VudCByZWFkaW5nIHRoZSBleHBvcnQgc2VlcyBib3RoXG4gICAgICAvLyByb3dzIHdpdGggdGhlIHNhbWUgc2VsZWN0b3IgYnV0IGRpZmZlcmVudCB1aWRzICsgcmVjdHMuXG4gICAgfVxuICAgIGxldCBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIHBvc2l0aW9uID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBpbnNlcnRCZWZvcmUuY3VycmVudCk7XG4gICAgICBpZiAocG9zaXRpb24gPCAwKSBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFN0YW1wIHRoZSBzZXNzaW9uIEZLIHNvIHRoZSBjb25zdW1lciBjYW4gam9pbiBlbnRyaWVzIHRvIHRoZWlyXG4gICAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuXG4gICAgaWYgKHNlc3Npb25JZCkgZW50cnkuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgIGNvbnN0IG5ld01zZzogU2VsZWN0b3JNZXNzYWdlID0ge3R5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogZW50cnkudHMsIGVudHJ5fTtcbiAgICAvLyBQYWdlIHJvd3MgZXhpc3Qgb25seSBhcyBoZWFkZXJzIGZvciBjYXB0dXJlZCBzZWxlY3RvcnMuIERvIG5vdCBjcmVhdGVcbiAgICAvLyB0aGVtIGZyb20gdGFiIGFjdGl2YXRpb24sIHZhbGlkYXRpb24sIG9yIHByZWZlcmVuY2UgY2hhbmdlczsgaW5zZXJ0IG9uZVxuICAgIC8vIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZmlyc3Qgc2VsZWN0b3Igb2YgYSBuZXcgcGFnZSBibG9jay5cbiAgICBsZXQgcHJldmlvdXNQYWdlOiBQYWdlTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSBwb3NpdGlvbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3BhZ2UnKSB7IHByZXZpb3VzUGFnZSA9IG07IGJyZWFrOyB9XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnJlYWs7XG4gICAgfVxuICAgIGlmICghcHJldmlvdXNQYWdlIHx8IHByZXZpb3VzUGFnZS51cmwgIT09IHBhZ2UudXJsKSB7XG4gICAgICBjb25zdCBwYWdlTXNnOiBQYWdlTWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ3BhZ2UnLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgdXJsOiBwYWdlLnVybCwgdGl0bGU6IHBhZ2UudGl0bGUsIHZpZXdwb3J0OiBwYWdlLnZpZXdwb3J0LCB0b2tlbnM6IHBhZ2UudG9rZW5zLFxuICAgICAgICB1c2VyQWdlbnQ6IHBhZ2UudXNlckFnZW50LCBsYW5nOiBwYWdlLmxhbmcsXG4gICAgICAgIGdpdENvbnRleHQ6IChwYWdlIGFzIGFueSkuZ2l0Q29udGV4dCxcbiAgICAgICAgcm91dGU6IChwYWdlIGFzIGFueSkucm91dGUsXG4gICAgICAgIHN0YXRlOiAocGFnZSBhcyBhbnkpLnN0YXRlLFxuICAgICAgICBzZXNzaW9uSWQsXG4gICAgICB9O1xuICAgICAgLy8gQXR0YWNoIGFueSBwYWdlLXNuYXBzaG90IHRoYXQgYXJyaXZlZCBiZWZvcmUgdGhpcyBwYWdlIGhlYWRlciBleGlzdGVkLlxuICAgICAgY29uc3QgcGVuZGluZyA9IHBlbmRpbmdTbmFwc2hvdHMuZ2V0KHBhZ2UudXJsKTtcbiAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgIChwYWdlTXNnIGFzIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90KS5zbmFwc2hvdCA9IHBlbmRpbmc7XG4gICAgICAgIHBlbmRpbmdTbmFwc2hvdHMuZGVsZXRlKHBhZ2UudXJsKTtcbiAgICAgIH1cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgcGFnZU1zZyk7XG4gICAgICBwb3NpdGlvbisrO1xuICAgIH1cbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIG5ld01zZyk7XG4gICAgcGVyc2lzdCgpO1xuICAgIC8vIEludGVudGlvbmFsbHkgTk8gc2V0TGFzdEFjdGl2ZShlbnRyeS5zZWxlY3RvcikgaGVyZSDigJQgdGhlIHVzZXIgYXNrZWRcbiAgICAvLyBmb3IgZnJlc2ggY2FwdHVyZXMgdG8gc3RheSB1bi1oaWdobGlnaHRlZCBpbiB0aGUgc2lkZWJhci4gVGhlIHN0aWNreVxuICAgIC8vIHJpbmcgKyBsYXN0LWFjdGl2ZSBvdXRsaW5lIG5vdyBvbmx5IGdldCBhcHBsaWVkIG9uIGV4cGxpY2l0XG4gICAgLy8gaG92ZXIvY2xpY2sgb2YgdGhlIHNpZGViYXIgYnViYmxlIChhbmQgdGhlIHBhZ2Utc2lkZSBmbGFzaCBmcm9tXG4gICAgLy8gY2FwdHVyZUVudHJ5IHN0aWxsIGNvbmZpcm1zIHRoZSBjYXB0dXJlIHZpc3VhbGx5IG9uIHRoZSBwYWdlKS5cbiAgICByZW5kZXIoKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KG5ld01zZyk7XG4gICAgdm9pZCBmaXJlUGFnZVNob3RJZk5lZWRlZChuZXdNc2cpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTY3JlZW5zaG90IHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRmlyZSB0aGUgcGVyLWVsZW1lbnQgc2hvdCwgYXR0YWNoIHRoZSByZXR1cm5lZCBmaWxlbmFtZSArIGRhdGFVcmwgb250b1xuICAvLyB0aGUgZW50cnksIGFuZCBwZXJzaXN0LiBzaG91bGRTa2lwU2NyZWVuc2hvdCBiYWlscyBvbiBob3N0cyBpbiB0aGVcbiAgLy8gdXNlcidzIHNraXAgbGlzdDsgYXV0b1NjcmVlbnNob3Q9ZmFsc2UgYmFpbHMgZ2xvYmFsbHkuXG4gIGNvbnN0IGZpcmVFbGVtZW50U2hvdCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCBza2lwcGVkOiBhdXRvU2NyZWVuc2hvdD1mYWxzZScpO1xuICAgICAgLy8gQnVnICMyOiB0ZWxsIHRoZSBleHBvcnQgd2h5IHRoZSBzaG90IGlzIG1pc3NpbmcuXG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ2F1dG9TY3JlZW5zaG90T2ZmJ307XG4gICAgICAvLyBSZS1yZW5kZXIgc28gdGhlIHJlc2VydmVkIHNrZWxldG9uICh3aGljaCBhc3N1bWVkIGEgc2hvdCB3YXMgY29taW5nKVxuICAgICAgLy8gY29sbGFwc2VzIG5vdyB0aGF0IHdlIGtub3cgb25lIHdvbid0IGFycml2ZS5cbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCBza2lwcGVkOiBob3N0IG9uIHNraXAgbGlzdCcsIG1zZy5lbnRyeS51cmwpO1xuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7Li4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSwgdW5hdmFpbGFibGVSZWFzb246ICdza2lwU2NyZWVuc2hvdEhvc3RzJ307XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IOKGkicsIG1zZy5lbnRyeS5zZWxlY3Rvcik7XG4gICAgLy8gU1cgY29sZC1zdGFydCByYWNlOiB0aGUgRklSU1QgY2FwdHVyZSBpbiBhIHNlc3Npb24gb2Z0ZW4gbG9zZXMgaXRzXG4gICAgLy8gZmlyc3QgbWVzc2FnZSBiZWNhdXNlIHRoZSBiZyB3b3JrZXIgaXMgc3RpbGwgc3RhcnRpbmcuIFJldHJ5IG9uY2VcbiAgICAvLyBhZnRlciBhIHNob3J0IGRlbGF5IGlmIHRoZSBmaXJzdCBjYWxsIGNvbWVzIGJhY2sgbnVsbC9lbXB0eS5cbiAgICBsZXQgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5IHx8ICghcmVwbHkub2sgJiYgIXJlcGx5LmVycm9yKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyc3Qgc2NyZWVuc2hvdCByZXBseSB3YXMgZW1wdHk7IHJldHJ5aW5nIGFmdGVyIDIwMG1zIChTVyBjb2xkLXN0YXJ0KScpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMjAwKSk7XG4gICAgICByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHJlcGx5OicsIHJlcGx5KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHtcbiAgICAgIHNldFN0YXR1cyhgU2NyZWVuc2hvdCBmYWlsZWQ6ICR7cmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICB1bmF2YWlsYWJsZVJlYXNvbjogcmVwbHk/LmVycm9yID8/ICdjYXB0dXJlRmFpbGVkJyxcbiAgICAgIH07XG4gICAgICAvLyBDb2xsYXBzZSB0aGUgcmVzZXJ2ZWQgc2tlbGV0b24g4oCUIG5vIHNob3QgaXMgY29taW5nIGZvciB0aGlzIGNhcHR1cmUuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gU3VjY2Vzc2Z1bCByZXRyeSDigJQgc3RyaXAgYW55IHByaW9yIHVuYXZhaWxhYmxlUmVhc29uIHNpbmNlIHdlIG5vd1xuICAgIC8vIGhhdmUgYSByZWFsIHNob3QuXG4gICAgZGVsZXRlIG1zZy5lbnRyeS5zY3JlZW5zaG90Py51bmF2YWlsYWJsZVJlYXNvbjtcbiAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICBlbGVtZW50OiByZXBseS5maWxlbmFtZSxcbiAgICAgIGNhcHR1cmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIC4uLihyZXBseS5jcm9wID8ge2Nyb3A6IHJlcGx5LmNyb3B9IDoge30pLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChtc2cuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmRhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzKCk7XG4gICAgfVxuICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkge1xuICAgICAgc2hvdHNGdWxsLnNldChtc2cuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIEZpcmUgdGhlIGdyb3VwIHNob3QgKHVuaW9uIGJib3ggb2YgaGVhZCArIGFsbCBtZW1iZXJzKSBhbmQgc3Rhc2ggdGhlXG4gIC8vIGZpbGVuYW1lIG9uIHRoZSBoZWFkLW9mLWdyb3VwIGVudHJ5LlxuICBjb25zdCBmaXJlR3JvdXBTaG90ID0gYXN5bmMgKGhlYWQ6IFNlbGVjdG9yTWVzc2FnZSwgc2VsZWN0b3JzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QoaGVhZC5lbnRyeS51cmwpKSByZXR1cm47XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWdyb3VwJywgc2VsZWN0b3JzLCBuOiBoZWFkLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgaGVhZC5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgLi4uKGhlYWQuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICBncm91cDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfTtcbiAgICBpZiAocmVwbHkuZGF0YVVybCkge1xuICAgICAgc2hvdHMuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmRhdGFVcmwpO1xuICAgICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7IHNob3RzRnVsbC5zZXQoaGVhZC5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZnVsbERhdGFVcmwpOyBwZXJzaXN0U2hvdHNGdWxsKCk7IH1cbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gUGFnZS1sZXZlbCBzaG90IG9uY2UgcGVyICh3b3Jrc3BhY2UsIHBhZ2UtdXJsLCBkYXkpLiBTdWJzZXF1ZW50IGNhcHR1cmVzXG4gIC8vIG9uIHRoZSBzYW1lIHBhZ2UgcmV1c2UgdGhlIHNhbWUgb24tZGlzayBmaWxlIHBhdGguXG4gIGNvbnN0IGZpcmVQYWdlU2hvdElmTmVlZGVkID0gYXN5bmMgKG1zZzogU2VsZWN0b3JNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkgcmV0dXJuO1xuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIC8vIFBlci1jYXB0dXJlIHBhZ2Utc2hvdCBtb2RlICjCpzQuNSk6IHdoZW4gZW5hYmxlZCwgc2tpcCB0aGVcbiAgICAvLyBwZXItKHdvcmtzcGFjZSwgdXJsKSBkZWR1cGUgYW5kIGZpcmUgYSBmcmVzaCBwYWdlIHNob3QgZXZlcnkgdGltZS5cbiAgICAvLyBVc2VmdWwgd2hlbiB0aGUgcGFnZSBzdGF0ZSBjaGFuZ2VzIGJldHdlZW4gY2FwdHVyZXMgKG1vZGFsIG9wZW5zLFxuICAgIC8vIG11bHRpLXN0ZXAgZmxvdywgZXRjLikgYW5kIHRoZSB1c2VyIHdhbnRzIHRvIHNlZSB0aGUgd2hvbGUgcGFnZSBhdFxuICAgIC8vIGVhY2ggc3RlcC4gQ29zdHMgb25lIGZ1bGwtcGFnZSBQTkcgcGVyIGNhcHR1cmUsIHNvIGRlZmF1bHQgb2ZmLlxuICAgIGlmICghcHJlZnMucGFnZVNob3RQZXJDYXB0dXJlKSB7XG4gICAgICBjb25zdCBrZXkgPSBwYWdlU2hvdEtleShtc2cuZW50cnkudXJsKTtcbiAgICAgIGlmIChwYWdlU2hvdHNGaXJlZC5oYXMoa2V5KSkge1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IGZpbmRFeGlzdGluZ1BhZ2VTaG90KG1zZy5lbnRyeS51cmwpO1xuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgICAgICBwYWdlOiBleGlzdGluZyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwYWdlU2hvdHNGaXJlZC5hZGQoa2V5KTtcbiAgICB9XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LXBhZ2UnLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHJldHVybjtcbiAgICAvLyBBcHBseSB0byBUSElTIGVudHJ5IGFuZCB0byBhbnkgb3RoZXIgZW50cmllcyBhbHJlYWR5IGNhcHR1cmVkIG9uIHRoZVxuICAgIC8vIHNhbWUgVVJMIHRvZGF5IChzbyB0aGUgcGFnZS1zaG90IGFwcGVhcnMgdW5pZm9ybWx5KS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSBtc2cuZW50cnkudXJsKSBjb250aW51ZTtcbiAgICAgIG0uZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgLi4uKG0uZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgIHBhZ2U6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gU3Rhc2ggdGhlIGZ1bGwgUE5HIHNvIHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBjYW4gYnVuZGxlIGl0LiBLZXllZFxuICAgIC8vIGJ5IFVSTCBzaW5jZSBwYWdlIHNob3RzIGFyZSBwYWdlLXNjb3BlZCwgbm90IHNlbGVjdG9yLXNjb3BlZC5cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQoJ3BhZ2U6OicgKyBtc2cuZW50cnkudXJsLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaW5kIGFueSBzZWxlY3RvciBlbnRyeSBvbiB0aGlzIFVSTCB0aGF0IGFscmVhZHkgaGFzIGEgYHBhZ2VgIHNob3RcbiAgLy8gcmVjb3JkZWQg4oCUIHVzZWQgc28gdGhhdCByZXRyb2FjdGl2ZSBjYXB0dXJlcyBpbmhlcml0IHRoZSBleGlzdGluZyBQTkdcbiAgLy8gcGF0aCBpbnN0ZWFkIG9mIHJlZmlyaW5nLlxuICBjb25zdCBmaW5kRXhpc3RpbmdQYWdlU2hvdCA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlKSByZXR1cm4gbS5lbnRyeS5zY3JlZW5zaG90LnBhZ2U7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGNvbnN0IG9uSG92ZXIgPSAoe3NlbGVjdG9yLCBsYWJlbCwgdGFnLCByZWN0fTogRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnaG92ZXInfT4pOiB2b2lkID0+IHtcbiAgICBzZXRTdGF0dXMoYEFsdC1ob3ZlciDCtyAke2xhYmVsfWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAvLyBJZGVudGl0eSBpcyAoc2VsZWN0b3IsIHVybCkuIFNhbWUgc2VsZWN0b3Igb24gdHdvIGRpZmZlcmVudCBVUkxzXG4gICAgLy8gaXMgdHdvIGRpZmZlcmVudCBjYXB0dXJlczsgdGhlIHByZXZpb3VzIHNlbGVjdG9yLW9ubHkgbG9va3VwXG4gICAgLy8gY2F1c2VkIGNyb3NzLXBhZ2UgY29tbWVudCBjb250YW1pbmF0aW9uLiBQcmVmZXIgc2FtZS1VUkwgK1xuICAgIC8vIHNhbWUtc2VsZWN0b3IgYXMgdGhlIHN0cm9uZ2VzdCBtYXRjaC5cbiAgICBjb25zdCBleGlzdGluZyA9IGZpbmRDYXB0dXJlRm9yQ3VycmVudFBhZ2Uoc2VsZWN0b3IpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhleGlzdGluZy5pZCk7XG4gICAgICBjb25zdCBmZWVkYmFjayA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKGV4aXN0aW5nLmlkKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHt1aWQ6IGV4aXN0aW5nLmVudHJ5LnVpZCwgbjogZXhpc3RpbmcuZW50cnkubiwgY2FwdHVyZWQ6IHRydWUsIGZlZWRiYWNrfX0pO1xuICAgICAgaWYgKHBoYW50b21UYXJnZXQpIHsgcGhhbnRvbVRhcmdldCA9IG51bGw7IHJlbmRlcigpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFMV0FZUyBzaG93IHRoZSBjb21tZW50IGJveCwgZXZlbiBmb3IgdW5jYXB0dXJlZCBlbGVtZW50cy4gT24gc3VibWl0XG4gICAgICAvLyB0aGUgY29udGVudCBzY3JpcHQgd2lsbCBjYXB0dXJlIHRoZSBlbGVtZW50IGZpcnN0LCB0aGVuIGF0dGFjaCB0aGVcbiAgICAgIC8vIGNvbW1lbnQg4oCUIHR1cm5pbmcgaG92ZXItY29tbWVudCBpbnRvIGEgY2FwdHVyZStjb21tZW50IHNob3J0Y3V0LlxuICAgICAgcGhhbnRvbVRhcmdldCA9IHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdDogcmVjdCBhcyB1bmtub3duIGFzIERPTVJlY3R9O1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24nLCBzZWxlY3RvciwgcGF5bG9hZDoge2NhcHR1cmVkOiBmYWxzZSwgZmVlZGJhY2s6IFtdfX0pO1xuICAgICAgcmVuZGVyUGhhbnRvbSgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25Ib3ZlckVuZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoc3RhdHVzLnRleHRDb250ZW50Py5zdGFydHNXaXRoKCdBbHQtaG92ZXInKSkgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7XG4gICAgaWYgKHBoYW50b21UYXJnZXQpIHsgcGhhbnRvbVRhcmdldCA9IG51bGw7IHJlbmRlclBoYW50b20oKTsgfVxuICAgIC8vIE5vIGFubm90YXRpb24tY2xlYXIgaGVyZSDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IGtlZXBzIHRoZSBib3ggb3BlbiBzbyB0aGVcbiAgICAvLyB1c2VyIGNhbiBtb3VzZSB0byBpdCBhbmQgdHlwZS4gT3V0c2lkZS1jbGljayAvIEVzYyBkaXNtaXNzIGl0LlxuICB9O1xuXG4gIGNvbnN0IGNvbGxlY3RGZWVkYmFja0FmdGVyID0gKHNlbGVjdG9ySWQ6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAoIWZvdW5kKSB7IGlmIChtLmlkID09PSBzZWxlY3RvcklkKSBmb3VuZCA9IHRydWU7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InIHx8IG0udHlwZSA9PT0gJ3BhZ2UnKSBicmVhaztcbiAgICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIG91dC5wdXNoKG0udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgY29uc3QgY2VudGVyRWxlbWVudEluTGlzdCA9IChlbDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBsaXN0UmVjdCA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZWxSZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGFyZ2V0ID0gbGlzdC5zY3JvbGxUb3AgKyBlbFJlY3QudG9wIC0gbGlzdFJlY3QudG9wIC0gKGxpc3QuY2xpZW50SGVpZ2h0IC8gMikgKyAoZWxSZWN0LmhlaWdodCAvIDIpO1xuICAgIGxpc3Quc2Nyb2xsVG8oe3RvcDogTWF0aC5tYXgoMCwgdGFyZ2V0KSwgYmVoYXZpb3I6ICdzbW9vdGgnfSk7XG4gIH07XG5cbiAgY29uc3Qgc2Nyb2xsTWVzc2FnZUludG9WaWV3ID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBlbCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgY2VudGVyRWxlbWVudEluTGlzdChlbCk7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gtaW50by12aWV3Jyk7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdmbGFzaC1pbnRvLXZpZXcnKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RpY2t5IGhpZ2hsaWdodCBtYW5hZ2VtZW50IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZXRMYXN0QWN0aXZlID0gKHNlbGVjdG9yOiBzdHJpbmcgfCBudWxsKTogdm9pZCA9PiB7XG4gICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3Rvciwgc3RpY2t5OiB0cnVlfSk7XG4gICAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGFybVN0aWNreUV4cGlyeSA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhclRpbWVvdXQoc3RpY2t5VGltZXIpO1xuICAgIHN0aWNreVRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCFwYW5lbEhvdmVyZWQpIHtcbiAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICAgICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3IubGFzdC1hY3RpdmUnKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnbGFzdC1hY3RpdmUnKTtcbiAgICAgIH0gZWxzZSBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9LCBTVElDS1lfVFRMX01TKTtcbiAgfTtcblxuICAvLyBGYXN0IHN0aWNreS1jbGVhcjogd2hlbiB0aGUgdXNlcidzIGN1cnNvciBsZWF2ZXMgdGhlIHBhbmVsLCBmaXJlXG4gIC8vIHN0aWNreS1jbGVhciBhZnRlciBhIDMwMCBtcyBncmFjZSB3aW5kb3cuIFByaW9yIGJlaGF2aW9yIHdhaXRlZCB0aGVcbiAgLy8gZnVsbCBTVElDS1lfVFRMX01TICh+NSBzKSB3aGljaCBmZWx0IGxpa2UgdGhlIHBhZ2Utc2lkZSBoaWdobGlnaHRcbiAgLy8gXCJkb2Vzbid0IGdvIGF3YXkgZXZlbiBhZnRlciBJIHVuaG92ZXJcIi4gMzAwIG1zIGlzIHNob3J0IGVub3VnaCB0b1xuICAvLyBmZWVsIHJlc3BvbnNpdmUgYnV0IGxvbmcgZW5vdWdoIHRoYXQgYSBxdWljayByZXBvc2l0aW9uIChlLmcuXG4gIC8vIGFjY2lkZW50YWxseSBjcm9zc2luZyB0aGUgc2VhbSkgZG9lc24ndCBraWxsIHRoZSByaW5nIG1pZC1mbGlnaHQuXG4gIGxldCBzdGlja3lDbGVhckdyYWNlID0gMDtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIHBhbmVsSG92ZXJlZCA9IHRydWU7XG4gICAgaWYgKHN0aWNreUNsZWFyR3JhY2UpIHsgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpOyBzdGlja3lDbGVhckdyYWNlID0gMDsgfVxuICAgIGFybVN0aWNreUV4cGlyeSgpO1xuICB9KTtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgIHBhbmVsSG92ZXJlZCA9IGZhbHNlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSBjbGVhclRpbWVvdXQoc3RpY2t5Q2xlYXJHcmFjZSk7XG4gICAgc3RpY2t5Q2xlYXJHcmFjZSA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAvLyBBbHNvIGRyb3Agb3VyIG93biBmcm9tLXBhbmVsICsgbXVsdGkgcmluZ3MgaW4gY2FzZSB0aGV5IGxlYWtlZC5cbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gICAgfSwgMzAwKTtcbiAgfSk7XG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAvLyBXaGVuIHRoZSB1c2VyIG1vdmVzIHRoZWlyIG1vdXNlIGludG8gdGhlIHBhbmVsLCBzdXBwcmVzcyBwYWdlLXNpZGVcbiAgICAvLyBhbHQtaG92ZXIgc3RhdGUgc28gdGhlIG9yYW5nZSByaW5nIGRvZXNuJ3Qga2VlcCBmb2xsb3dpbmcgdGhlIGN1cnNvci5cbiAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IGZhbHNlfSk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBSZW5kZXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IE5FQVJfQk9UVE9NX1BYID0gODA7XG4gIGNvbnN0IHdhc05lYXJCb3R0b20gPSAoKTogYm9vbGVhbiA9PlxuICAgIGxpc3Quc2Nyb2xsSGVpZ2h0IC0gbGlzdC5zY3JvbGxUb3AgLSBsaXN0LmNsaWVudEhlaWdodCA8PSBORUFSX0JPVFRPTV9QWDtcblxuICBjb25zdCBtYXRjaGVzU2VhcmNoID0gKG06IFBhbmVsTWVzc2FnZSk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHEgPSBzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiBtLnRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIC8vIE1hdGNoIGFnYWluc3QgdGhlIFdIT0xFIGVudHJ5IChzZWxlY3RvciwgdGV4dCwgY2xhc3NlcywgYXR0cnMsXG4gICAgICAvLyBvdXRlckhUTUwsIHN0eWxlcywgZXRjLikgc28gc2VhcmNoIGhpdHMgYW55dGhpbmcgdmlzaWJsZSBpbiB0aGVcbiAgICAgIC8vIGJvZHktanNvbi4gU3RyaW5naWZ5aW5nIG9uY2UgaXMgZmluZSDigJQgdGhlIGNvc3QgaXMgdGlueSB2cyByZW5kZXIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICB9XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gKG0udXJsICsgJyAnICsgKG0udGl0bGUgPz8gJycpKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICAvLyBUcnVlIHdoZW4gdGhlIGJ1YmJsZSdzIGJvZHktanNvbiAob3Igb3V0ZXJIVE1MKSBjb250YWlucyB0aGUgc2VhcmNoIOKAlFxuICAvLyB0ZWxscyByZW5kZXJTZWxlY3RvciB0byBhdXRvLWV4cGFuZCBzbyB0aGUgdXNlciBzZWVzIHRoZSBoaWdobGlnaHRlZCBoaXQuXG4gIGNvbnN0IGJvZHlNYXRjaGVzU2VhcmNoID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobS5lbnRyeSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgfTtcblxuICBjb25zdCBpbnNlcnRSYWlsID0gKGJlZm9yZUlkOiBzdHJpbmcpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdpbnNlcnQtcmFpbCc7XG4gICAgZGl2LmRhdGFzZXQuYmVmb3JlSWQgPSBiZWZvcmVJZDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPT09IGJlZm9yZUlkKSB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcbiAgICAgIGRpdi5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlOyByZW5kZXIoKTsgfSxcbiAgICAgICAgb25TdWJtaXQ6ICh0ZXh0KSA9PiBzZW5kSW5saW5lKHRleHQpLFxuICAgICAgICBhdXRvZm9jdXM6IHRydWUsXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgYnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGJ0bi5jbGFzc05hbWUgPSAnYWRkLWJ0bic7XG4gICAgICBidG4uZGF0YXNldC50aXAgPSAnSW5zZXJ0IGNhcHR1cmUgb3IgY29tbWVudCBoZXJlJztcbiAgICAgIGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnSW5zZXJ0IGNhcHR1cmUgb3IgY29tbWVudCBoZXJlJyk7XG4gICAgICBidG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdwbHVzJywgMTIpO1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkOyBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7IHJlbmRlcigpOyB9KTtcbiAgICAgIGRpdi5hcHBlbmQoYnRuKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICB0eXBlIElubGluZUNvbW1lbnRPcHRzID0ge1xuICAgIGluaXRpYWw/OiBzdHJpbmc7XG4gICAgb25DYW5jZWw/OiAoKSA9PiB2b2lkO1xuICAgIG9uU3VibWl0PzogKHRleHQ6IHN0cmluZykgPT4gdm9pZDtcbiAgICBhdXRvZm9jdXM/OiBib29sZWFuO1xuICB9O1xuICBjb25zdCBidWlsZElubGluZUNvbW1lbnQgPSAoe2luaXRpYWwgPSAnJywgb25DYW5jZWwsIG9uU3VibWl0LCBhdXRvZm9jdXN9OiBJbmxpbmVDb21tZW50T3B0cyk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcC5jbGFzc05hbWUgPSAnaW5saW5lLWNvbW1lbnQnO1xuICAgIGNvbnN0IHRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB0YS52YWx1ZSA9IGluaXRpYWw7XG4gICAgdGEucm93cyA9IDI7XG4gICAgdGEucGxhY2Vob2xkZXIgPSAnSW5zZXJ0IGEgY29tbWVudCBoZXJlLCBvciBBbHQrQ2xpY2sgdG8gaW5zZXJ0IGEgY2FwdHVyZSc7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcm93LmNsYXNzTmFtZSA9ICdyb3cnO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9ICcwdyDCtyAwdCc7XG4gICAgLy8gQm90aCBTYXZlIC8gQ2FuY2VsIGFyZSB1bmlmb3JtIGljb24gYnV0dG9ucyAoLmljb25idG4pLiBTYXZlIHVzZXMgdGhlXG4gICAgLy8gcHJpbWFyeSBhY2NlbnQgdmFyaWFudCB2aWEgLnByaW1hcnkgc28gaXQgc3RpbGwgcG9wcywgYnV0IGl0cyB3aWR0aFxuICAgIC8vIG1hdGNoZXMgQ2FuY2VsIGV4YWN0bHkuXG4gICAgY29uc3QgY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjYW5jZWwuY2xhc3NOYW1lID0gJ2ljb25idG4nO1xuICAgIGNhbmNlbC5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgwrcgRXNjJztcbiAgICBjYW5jZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBpbmxpbmUgY29tbWVudCcpO1xuICAgIGNhbmNlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAyMCk7XG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gb25DYW5jZWw/LigpKTtcbiAgICBjb25zdCBzZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2VuZC50eXBlID0gJ2J1dHRvbic7XG4gICAgc2VuZC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwcmltYXJ5JztcbiAgICBzZW5kLmRhdGFzZXQudGlwID0gJ1NhdmUgwrcgRW50ZXInO1xuICAgIHNlbmQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1NhdmUgaW5saW5lIGNvbW1lbnQnKTtcbiAgICBzZW5kLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAyMCk7XG4gICAgY29uc3Qgc3VibWl0ID0gKCk6IHZvaWQgPT4gb25TdWJtaXQ/Lih0YS52YWx1ZSk7XG4gICAgc2VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdCk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7IG1ldGEudGV4dENvbnRlbnQgPSBgJHt3b3JkQ291bnQodGEudmFsdWUpfXcgwrcgJHt0b2tlbkNvdW50KHRhLnZhbHVlKX10YDsgfSk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0KCk7IH1cbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIG9uQ2FuY2VsPy4oKTtcbiAgICB9KTtcbiAgICByb3cuYXBwZW5kKG1ldGEsIGNhbmNlbCwgc2VuZCk7XG4gICAgd3JhcC5hcHBlbmQodGEsIHJvdyk7XG4gICAgaWYgKGF1dG9mb2N1cykgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhLmZvY3VzKCkpO1xuICAgIHJldHVybiB3cmFwO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRJbmxpbmUgPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGV4dCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgYmVmb3JlSWQgPSBpbnNlcnRCZWZvcmUuY3VycmVudDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsZXQgcG9zID0gYmVmb3JlSWQgPyBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGJlZm9yZUlkKSA6IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAocG9zIDwgMCkgcG9zID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIC8vIHBhcmVudFVpZCByZXNvbHV0aW9uOiB3YWxrIGJhY2sgZnJvbSB0aGUgaW5zZXJ0IHBvc2l0aW9uIHRvIHRoZVxuICAgIC8vIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yLiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciB0aGUgRksuXG4gICAgbGV0IHBJZHggPSBwb3MgLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9O1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3MsIDAsIGZiKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdJbnNlcnRlZCcpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBoYW50b20gPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGhhbnRvbScpPy5yZW1vdmUoKTtcbiAgICBpZiAoIXBoYW50b21UYXJnZXQpIHJldHVybjtcbiAgICBjb25zdCBwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBoLmNsYXNzTmFtZSA9ICdwaGFudG9tIHZpc2libGUnO1xuICAgIHBoLmlubmVySFRNTCA9IGA8Y29kZT4ke2VzY2FwZUh0bWwocGhhbnRvbVRhcmdldC5sYWJlbCl9PC9jb2RlPmA7XG4gICAgbGlzdC5hcHBlbmQocGgpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIC8vIFJlb3JkZXIgYSBmbGF0IG1lc3NhZ2UgbGlzdCBzbyBzZWxlY3RvcnMgd2l0aGluIGVhY2ggcGFnZS1kZWxpbWl0ZWRcbiAgLy8gYmxvY2sgYXJlIHNvcnRlZCBieSB0aGVpciB2aXN1YWwgcmVjdCAodG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQpLlxuICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIChjYXB0dXJlXG4gIC8vIGFkamFjZW5jeSkgc28gZWRpdGluZy90aHJlYWRpbmcgYmVoYXZpb3Igc3Vydml2ZXMgdGhlIHNvcnQuXG4gIC8vXG4gIC8vIFVzZWQgT05MWSBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIChgYnVpbGRTbGltYCksIG5vdCB0aGUgc2lkZWJhclxuICAvLyByZW5kZXIuIFRoZSBzaWRlYmFyIGtlZXBzIG1lc3NhZ2VzIGluIGluc2VydGlvbi9jYXB0dXJlIG9yZGVyIHNvXG4gIC8vIHRoZSB1c2VyIHNlZXMgdGhlbSB3aGVyZSB0aGV5IGV4cGVjdDsgdGhlIGV4cG9ydCBnZXRzIHRoZSBhZ2VudC1cbiAgLy8gZnJpZW5kbHkgcmVhZGluZy1vcmRlciB0cmVhdG1lbnQuXG4gIGNvbnN0IHJlb3JkZXJGb3JFeHBvcnQgPSAobXNnczogUGFuZWxNZXNzYWdlW10pOiBQYW5lbE1lc3NhZ2VbXSA9PiB7XG4gICAgdHlwZSBHcm91cCA9IHtraW5kOiAnZ3JvdXAnOyBzZWw6IFNlbGVjdG9yTWVzc2FnZTsgdHJhaWxpbmc6IEZlZWRiYWNrTWVzc2FnZVtdfTtcbiAgICB0eXBlIExvb3NlID0ge2tpbmQ6ICdsb29zZSc7IG06IEZlZWRiYWNrTWVzc2FnZX07XG4gICAgdHlwZSBTbG90ID0gR3JvdXAgfCBMb29zZSB8IHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfTtcbiAgICBjb25zdCBzbG90czogU2xvdFtdID0gW107XG4gICAgbGV0IGN1ckdyb3VwOiBHcm91cCB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGZsdXNoR3JvdXAgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoY3VyR3JvdXApIHsgc2xvdHMucHVzaChjdXJHcm91cCk7IGN1ckdyb3VwID0gbnVsbDsgfVxuICAgIH07XG4gICAgZm9yIChjb25zdCBtIG9mIG1zZ3MpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIHNsb3RzLnB1c2goe2tpbmQ6ICdwYWdlJywgbX0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBjdXJHcm91cCA9IHtraW5kOiAnZ3JvdXAnLCBzZWw6IG0sIHRyYWlsaW5nOiBbXX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEZXRhY2hlZCBjb21tZW50cyBuZXZlciB0cmF2ZWwgd2l0aCB0aGUgcHJlY2VkaW5nIHNlbGVjdG9yJ3NcbiAgICAgICAgLy8gZ3JvdXAg4oCUIHRoZXkgc3RheSBsb29zZSBpbiBleHBvcnQgb3JkZXIuXG4gICAgICAgIGlmIChjdXJHcm91cCAmJiAhbS5kZXRhY2hlZCkgY3VyR3JvdXAudHJhaWxpbmcucHVzaChtKTtcbiAgICAgICAgZWxzZSBzbG90cy5wdXNoKHtraW5kOiAnbG9vc2UnLCBtfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoR3JvdXAoKTtcbiAgICBjb25zdCBvdXQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgbGV0IHJ1blN0YXJ0ID0gMDtcbiAgICBjb25zdCBmbHVzaFJ1biA9IChlbmQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwUmVjdHM6IEFycmF5PHtpZHg6IG51bWJlcjsgeTogbnVtYmVyOyB4OiBudW1iZXJ9PiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IHJ1blN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHIgPSBzLnNlbC5lbnRyeS5yZWN0O1xuICAgICAgICAgIGdyb3VwUmVjdHMucHVzaCh7aWR4OiBpLCB5OiByPy55ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgeDogcj8ueCA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9KTtcbiAgICAgICAgfVxuICAgICAgICBpbmRpY2VzLnB1c2goaSk7XG4gICAgICB9XG4gICAgICBncm91cFJlY3RzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGEueSAhPT0gYi55KSByZXR1cm4gYS55IC0gYi55O1xuICAgICAgICByZXR1cm4gYS54IC0gYi54O1xuICAgICAgfSk7XG4gICAgICBsZXQgZ2kgPSAwO1xuICAgICAgZm9yIChjb25zdCBpIG9mIGluZGljZXMpIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50SWR4ID0gZ3JvdXBSZWN0c1tnaSsrXSEuaWR4O1xuICAgICAgICAgIGNvbnN0IHIgPSBzbG90c1tyZXBsYWNlbWVudElkeF0hIGFzIEdyb3VwO1xuICAgICAgICAgIG91dC5wdXNoKHIuc2VsKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGYgb2Ygci50cmFpbGluZykgb3V0LnB1c2goZik7XG4gICAgICAgIH0gZWxzZSBpZiAocy5raW5kID09PSAnbG9vc2UnKSB7XG4gICAgICAgICAgb3V0LnB1c2gocy5tKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNsb3RzW2ldIS5raW5kID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hSdW4oaSk7XG4gICAgICAgIG91dC5wdXNoKChzbG90c1tpXSBhcyB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX0pLm0pO1xuICAgICAgICBydW5TdGFydCA9IGkgKyAxO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaFJ1bihzbG90cy5sZW5ndGgpO1xuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHN0aWNrVG9Cb3R0b20gPSBsaXN0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCB3YXNOZWFyQm90dG9tKCk7XG4gICAgbGlzdC5pbm5lckhUTUwgPSAnJztcblxuICAgIC8vIFN0YXRzIG51bWJlcnNcbiAgICBsZXQgdG90YWxTZWxlY3RvcnMgPSAwO1xuICAgIGxldCB0b3RhbENvbW1lbnRzID0gMDtcbiAgICBsZXQgdG90YWxTdGFsZSA9IDA7XG4gICAgY29uc3QgZGlzdGluY3RQYWdlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICB0b3RhbFNlbGVjdG9ycysrO1xuICAgICAgICBpZiAoc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKSB0b3RhbFN0YWxlKys7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgdG90YWxDb21tZW50cysrO1xuICAgICAgZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLnNvbWUoKHgpID0+IHgudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiB4LmVudHJ5LnVybCA9PT0gbS51cmwpKSBkaXN0aW5jdFBhZ2VzLmFkZChtLnVybCk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzZWxlY3RvcnNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU2VsZWN0b3JzKTtcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwiY29tbWVudHNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsQ29tbWVudHMpO1xuICAgIGNvbnN0IHN0YWxlTnVtID0gc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInN0YWxlXCJdIC5zdGF0LW51bScpITtcbiAgICBzdGFsZU51bS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFN0YWxlKTtcbiAgICBzdGFsZU51bS5kYXRhc2V0Lnplcm8gPSB0b3RhbFN0YWxlID09PSAwID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwicGFnZXNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKGRpc3RpbmN0UGFnZXMuc2l6ZSk7XG4gICAgY29uc3QgZXhwb3J0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBzdGF0VG9rZW5zLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh0b2tlbkNvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcbiAgICBzdGF0V29yZHMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHdvcmRDb3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG5cbiAgICAvLyBNaW5pZnkgcmVkdWN0aW9uIHN0YXRzXG4gICAgbGV0IGZ1bGxUID0gMCwgY3VyVCA9IDAsIGZ1bGxXID0gMCwgY3VyVyA9IDAsIHBjdCA9IDA7XG4gICAgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgIGNvbnN0IHdhc01pbiA9IHByZWZzLm1pbmlmeTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHRydWU7IGNvbnN0IG1pblRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSBmYWxzZTsgY29uc3QgZnVsbFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB3YXNNaW47XG4gICAgICBmdWxsVCA9IHRva2VuQ291bnQoZnVsbFRleHQpOyBjdXJUID0gdG9rZW5Db3VudChtaW5UZXh0KTtcbiAgICAgIGZ1bGxXID0gd29yZENvdW50KGZ1bGxUZXh0KTsgY3VyVyA9IHdvcmRDb3VudChtaW5UZXh0KTtcbiAgICAgIHBjdCA9IGZ1bGxUID4gMCA/IE1hdGgucm91bmQoKDEgLSBjdXJUIC8gZnVsbFQpICogMTAwKSA6IDA7XG4gICAgfVxuICAgIGNvbnN0IG1pbmlmeVN0YXRzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWluaWZ5LXN0YXRzXScpO1xuICAgIGlmIChtaW5pZnlTdGF0c0VsKSB7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGAke2Z1bGxULnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clQudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7ZnVsbFcudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVy50b0xvY2FsZVN0cmluZygpfSB3b3JkcyDCtyAke3BjdH0lIHJlZHVjdGlvbmA7XG4gICAgICB9IGVsc2UgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGBXb3VsZCBzYXZlICR7KGZ1bGxUIC0gY3VyVCkudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7cGN0fSUgaWYgZW5hYmxlZGA7XG4gICAgICB9IGVsc2UgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIC8vIFBlci1jaGVja2JveCBjb250cmlidXRpb24gc3RhdHM6IGhvdyBtYW55IHRva2Vucy93b3JkcyBlYWNoIHRvZ2dsZVxuICAgIC8vIGFkZHMgdG8gdGhlIGN1cnJlbnQgZXhwb3J0LiBDb21wdXRlZCBieSB0b2dnbGluZyB0aGF0IHNpbmdsZSBwcmVmXG4gICAgLy8gYW5kIGRpZmZpbmcgdGhlIGV4cG9ydCDigJQgZ2l2ZXMgYW4gaG9uZXN0IGFuc3dlciB0aGF0IHJlZmxlY3RzIHRoZVxuICAgIC8vIGN1cnJlbnQgbWluaWZ5IHN0YXRlIGFuZCB0aGUgcmVzdCBvZiB0aGUgdG9nZ2xlcy5cbiAgICBjb25zdCBjb250cmliS2V5czogQXJyYXk8a2V5b2YgUHJlZnM+ID0gWydpbmNsdWRlT3V0ZXJIVE1MJywgJ2luY2x1ZGVNYXRjaGVkUnVsZXMnLCAnaW5jbHVkZVN0eWxlcyddO1xuICAgIGlmIChleHBvcnRUZXh0ICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYmFzZVQgPSB0b2tlbkNvdW50KGV4cG9ydFRleHQpO1xuICAgICAgY29uc3QgYmFzZVcgPSB3b3JkQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmICghZWwpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCB3YXNPbiA9IHByZWZzW2tleV0gYXMgYm9vbGVhbjtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9ICF3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IHdhc09uO1xuICAgICAgICBjb25zdCBhbHRUID0gdG9rZW5Db3VudChhbHRUZXh0KTtcbiAgICAgICAgY29uc3QgYWx0VyA9IHdvcmRDb3VudChhbHRUZXh0KTtcbiAgICAgICAgLy8gd2FzT249dHJ1ZSDihpIgY3VycmVudGx5IGluY2x1ZGVkOyBjb3N0ID0gYmFzZSAtIGFsdCAodHVybmluZyBPRkYgc2F2ZXMgdGhpcykuXG4gICAgICAgIC8vIHdhc09uPWZhbHNlIOKGkiBjdXJyZW50bHkgZXhjbHVkZWQ7IGdhaW4gPSBhbHQgLSBiYXNlICh0dXJuaW5nIE9OIGFkZHMgdGhpcykuXG4gICAgICAgIGNvbnN0IGRUID0gd2FzT24gPyBiYXNlVCAtIGFsdFQgOiBhbHRUIC0gYmFzZVQ7XG4gICAgICAgIGNvbnN0IGRXID0gd2FzT24gPyBiYXNlVyAtIGFsdFcgOiBhbHRXIC0gYmFzZVc7XG4gICAgICAgIGNvbnN0IHNpZ24gPSB3YXNPbiA/ICcnIDogJysnO1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHdhc09uXG4gICAgICAgICAgPyBgwrcgJHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpbiBleHBvcnQke3ByZWZzLm1pbmlmeSA/ICcgKG1pbmlmaWVkKScgOiAnJ31gXG4gICAgICAgICAgOiBgwrcgJHtzaWdufSR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke3NpZ259JHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGlmIGVuYWJsZWRgO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmIChlbCkgZWwudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUb29sYmFyIGV4cG9ydCBzdGF0c1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcuc3RhdC5leHBvcnQtc3RhdHMnKS5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICBjb25zdCBudW0gPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1udW0nKTtcbiAgICAgIGNvbnN0IGxhYiA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LWxhYmVsJyk7XG4gICAgICBpZiAobnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQhLnJlcGxhY2UoL1xcKiQvLCAnJyk7XG4gICAgICBpZiAobGFiKSBsYWIudGV4dENvbnRlbnQgPSBsYWIudGV4dENvbnRlbnQhLnJlcGxhY2UoL15cXCovLCAnJyk7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50ICsgJyonO1xuICAgICAgY29uc3QgaXNUb2tlbiA9IGkgPT09IDA7XG4gICAgICBjb25zdCBmdWxsViA9IGlzVG9rZW4gPyBmdWxsVCA6IGZ1bGxXO1xuICAgICAgY29uc3QgY3VyViA9IGlzVG9rZW4gPyBjdXJUIDogY3VyVztcbiAgICAgIGNvbnN0IHdoaWNoID0gaXNUb2tlbiA/ICd0b2tlbnMnIDogJ3dvcmRzJztcbiAgICAgIHMuZGF0YXNldC50aXAgPSBwcmVmcy5taW5pZnlcbiAgICAgICAgPyBgTUlOSUZJRUQgwrcgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9XFxuRnVsbCB3b3VsZCBiZSAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgXG4gICAgICAgIDogYCR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH0gwrcgZnVsbCBleHBvcnRcXG5NaW5pZmllZCB3b3VsZCBiZSAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWA7XG4gICAgfSk7XG5cbiAgICBpZiAobWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZW1wdHkuY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgICAgIGVtcHR5LmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiZW1wdHktaWNvblwiPvCfpI88L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LXRpdGxlXCI+U3RhcnQgd2l0aCB0aGUgcGFnZSB5b3Ugd2FudCB0byBjcml0aXF1ZS48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LWJvZHlcIj5PcGVuIGEgcGFnZSwgdGhlbiBjYXB0dXJlIGFuIGVsZW1lbnQuIENvbW1lbnRzIHN0YXkgcGFpcmVkIHdpdGggdGhlIHRoaW5nIHlvdSBncmFiYmVkLjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHkta2V5c1wiPkFsdCtDbGljayB0byBjYXB0dXJlPC9kaXY+YDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSByZW5kZXJQZW5kaW5nQmF5KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0b3JVcmxzID0gbmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS51cmwpKTtcbiAgICBjb25zdCB2aXNpYmxlTWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0udHlwZSAhPT0gJ3BhZ2UnIHx8IHNlbGVjdG9yVXJscy5oYXMobS51cmwpKTtcbiAgICBjb25zdCBwaW5uZWQgPSB2aXNpYmxlTWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIEJvb2xlYW4obS5waW5uZWQpKTtcbiAgICBjb25zdCB1bnBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pID0+ICFwaW5uZWQuaW5jbHVkZXMobSBhcyBTZWxlY3Rvck1lc3NhZ2UpKTtcbiAgICAvLyBTaWRlYmFyIHNob3dzIGNhcHR1cmVzIGluIElOU0VSVElPTiBvcmRlciAobW9zdCByZWNlbnQgYXQgdGhlXG4gICAgLy8gYm90dG9tKS4gVmlzdWFsLXBvc2l0aW9uIHJlb3JkZXJpbmcgaGFwcGVucyBPTkxZIGF0IGV4cG9ydCB0aW1lXG4gICAgLy8gc28gdGhlIHNpZGViYXIgc3RheXMgcHJlZGljdGFibGUgd2hpbGUgdGhlIGFnZW50LWZhY2luZyBleHBvcnRcbiAgICAvLyBnZXRzIHJlYWRpbmctb3JkZXIgY29udmVuaWVuY2UuIChQcmlvciBpbXBsZW1lbnRhdGlvbiBzb3J0ZWQgaW5cbiAgICAvLyBib3RoIHBsYWNlczsgdXNlciBmZWVkYmFjayB3YXMgdGhhdCBzaWRlYmFyIHNodWZmbGluZyB3YXNcbiAgICAvLyBkaXNvcmllbnRpbmcuKVxuICAgIGNvbnN0IG9yZGVyZWQgPSBbLi4ucGlubmVkLCAuLi51bnBpbm5lZF07XG5cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG1lc3NhZ2VzWzBdIS5pZCkpO1xuICAgIGxldCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIC8vIFRyYWNrIHRoZSBVUkwgb2YgdGhlIG1vc3QgcmVjZW50bHkgcmVuZGVyZWQgcGFnZSBkaXZpZGVyIHNvIHdlIGNhblxuICAgIC8vIHN1cHByZXNzIGEgcmVwZWF0ZWQgaGVhZGVyIHdoZW4gY29uc2VjdXRpdmUgY2FwdHVyZXMgc2hhcmUgdGhlIHNhbWVcbiAgICAvLyBwYWdlLiBSZXN0YXRpbmcgdGhlIFVSTCBhYm92ZSBldmVyeSBjYXB0dXJlIGluIGEgc2FtZS1VUkwgcnVuIGlzXG4gICAgLy8gbm9pc2Ug4oCUIHRoZSBkaXZpZGVyIG9ubHkgZWFybnMgaXRzIHNwYWNlIHdoZW4gdGhlIFVSTCBhY3R1YWxseVxuICAgIC8vIGNoYW5nZXMgZnJvbSB0aGUgcHJldmlvdXMgY2FwdHVyZSBpbiBzZXF1ZW5jZS5cbiAgICBsZXQgbGFzdFJlbmRlcmVkUGFnZVVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJlbmRlcmVkQW55ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmRlcmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gb3JkZXJlZFtpXSE7XG4gICAgICBpZiAoIW1hdGNoZXNTZWFyY2gobSkpIGNvbnRpbnVlO1xuICAgICAgLy8gQ29sbGFwc2UgY29uc2VjdXRpdmUgc2FtZS1VUkwgcGFnZSBkaXZpZGVycyBpbnRvIHRoZSBmaXJzdCBvbmUuXG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgaWYgKG0udXJsID09PSBsYXN0UmVuZGVyZWRQYWdlVXJsKSBjb250aW51ZTtcbiAgICAgICAgbGFzdFJlbmRlcmVkUGFnZVVybCA9IG0udXJsO1xuICAgICAgfVxuICAgICAgLy8gRGV0YWNoZWQgY29tbWVudHMgcmVuZGVyIHVudGhyZWFkZWQg4oCUIGFkamFjZW5jeSBtdXN0IG5vdCByZS1hZG9wdFxuICAgICAgLy8gYSBjb21tZW50IHRoZSB1c2VyIGV4cGxpY2l0bHkgZGlzYXNzb2NpYXRlZC5cbiAgICAgIGNvbnN0IGFkamFjZW5jeSA9IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiBtLmRldGFjaGVkID8gbnVsbCA6IGxhc3RTZWxlY3RvclNlbDtcbiAgICAgIGNvbnN0IG5vZGUgPSByZW5kZXJNZXNzYWdlKG0sIGFkamFjZW5jeSk7XG4gICAgICBsaXN0LmFwcGVuZChub2RlKTtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGxhc3RTZWxlY3RvclNlbCA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBpZiAoaSA8IG9yZGVyZWQubGVuZ3RoIC0gMSkgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbChvcmRlcmVkW2kgKyAxXSEuaWQpKTtcbiAgICAgIHJlbmRlcmVkQW55ID0gdHJ1ZTtcbiAgICB9XG4gICAgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbCgnX19lbmRfXycpKTtcbiAgICBpZiAoIXJlbmRlcmVkQW55ICYmIHNlYXJjaFF1ZXJ5KSB7XG4gICAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZW1wdHkuY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgICAgIGVtcHR5LnRleHRDb250ZW50ID0gYE5vIG1hdGNoZXMgZm9yIFwiJHtzZWFyY2hRdWVyeX1cIi5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgIH1cblxuICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSByZW5kZXJQZW5kaW5nQmF5KCk7XG4gICAgaWYgKHBoYW50b21UYXJnZXQpIHJlbmRlclBoYW50b20oKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXdOb29kbGVzKTtcbiAgICBpZiAoc3RpY2tUb0JvdHRvbSkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgbGlzdC5zY3JvbGxUb3AgPSBsaXN0LnNjcm9sbEhlaWdodDsgfSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGVuZGluZ0JheSA9ICgpOiB2b2lkID0+IHtcbiAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoJy5wZW5kaW5nLWJheScpPy5yZW1vdmUoKTtcbiAgICBpZiAoIXBlbmRpbmdNdWx0aS5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBiYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBiYXkuY2xhc3NOYW1lID0gJ3BlbmRpbmctYmF5JztcbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAncGVuZGluZy1oZWFkJztcbiAgICBoZWFkLnRleHRDb250ZW50ID0gYFBlbmRpbmcgZ3JvdXAgwrcgJHtwZW5kaW5nTXVsdGkubGVuZ3RofSBlbGVtZW50JHtwZW5kaW5nTXVsdGkubGVuZ3RoID09PSAxID8gJycgOiAncyd9YDtcbiAgICBiYXkuYXBwZW5kKGhlYWQpO1xuICAgIHBlbmRpbmdNdWx0aS5mb3JFYWNoKChlLCBpKSA9PiB7XG4gICAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjYXJkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWNhcmQnO1xuICAgICAgY29uc3Qgc2VxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgc2VxLmNsYXNzTmFtZSA9ICdzZXEnO1xuICAgICAgc2VxLnRleHRDb250ZW50ID0gYCMke2kgKyAxfWA7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gKGUudGV4dCAmJiBlLnRleHQubGVuZ3RoIDw9IDYwID8gZS50ZXh0IDogKGUuY29tcG9uZW50Um9vdCA/PyBlLnNlbGVjdG9yID8/IGUudGFnKSk7XG4gICAgICBjYXJkLmFwcGVuZChzZXEsIGxhYmVsKTtcbiAgICAgIGJheS5hcHBlbmQoY2FyZCk7XG4gICAgfSk7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcm93LmNsYXNzTmFtZSA9ICdwZW5kaW5nLXJvdyc7XG4gICAgY29uc3QgY29tbWl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29tbWl0LnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb21taXQuY2xhc3NOYW1lID0gJ3ByaW1hcnkgcGVuZGluZy1jb21taXQnO1xuICAgIGNvbW1pdC50ZXh0Q29udGVudCA9IGBDb21taXQgZ3JvdXAgwrcgJHtwZW5kaW5nTXVsdGkubGVuZ3RofWA7XG4gICAgY29tbWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9KSk7XG4gICAgY29uc3QgY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjYW5jZWwuY2xhc3NOYW1lID0gJ2ljb25idG4gcGVuZGluZy1jYW5jZWwnO1xuICAgIGNhbmNlbC5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgcGVuZGluZyBncm91cCc7XG4gICAgY2FuY2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgcGVuZGluZyBncm91cCcpO1xuICAgIGNhbmNlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAxMyk7XG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9KSk7XG4gICAgcm93LmFwcGVuZChjb21taXQsIGNhbmNlbCk7XG4gICAgYmF5LmFwcGVuZChyb3cpO1xuICAgIGNvbnN0IGhpbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoaW50LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhpbnQnO1xuICAgIGhpbnQudGV4dENvbnRlbnQgPSAnQWx0K1NoaWZ0K0NsaWNrIG1vcmUgwrcgQ29tbWl0IHRvIGZpbmFsaXplIMK3IEVzYyB0byBjYW5jZWwnO1xuICAgIGJheS5hcHBlbmQoaGludCk7XG4gICAgbGlzdC5hcHBlbmQoYmF5KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgTm9vZGxlcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgY2xlYXJOb29kbGVzID0gKCk6IHZvaWQgPT4geyBmb3IgKGNvbnN0IG4gb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcudHJlZS1ub29kbGUnKSkgbi5yZW1vdmUoKTsgfTtcblxuICAvLyBDcm9zcy1zZWFtIHBhbmVs4oaUY2FudmFzIG5vb2RsZXMgd2VyZSByZW1vdmVkOiBhbGlnbmluZyB0d28gU1ZHIGhhbHZlc1xuICAvLyBhY3Jvc3MgdGhlIHBhbmVsL3BhZ2UgYm91bmRhcnkgZGVwZW5kZWQgb24gaW5uZXJIZWlnaHQgcGFyaXR5IHdoaWNoXG4gIC8vIGJyZWFrcyB1bmRlciBEZXZUb29scyBkb2NrIGFuZCB6b29tLCBhbmQgdGhlIHZpc3VhbCBiZW5lZml0IGRpZG4ndFxuICAvLyBqdXN0aWZ5IHRoZSBtYWludGVuYW5jZSBjb3N0LiBUaGUgaW4tcGFuZWwgZmVlZGJhY2stdHJlZSBub29kbGVzXG4gIC8vIChkcmF3Tm9vZGxlIC8gcmVkcmF3Tm9vZGxlcyBiZWxvdykgYXJlIHVuYWZmZWN0ZWQuXG4gIGNvbnN0IGNsZWFyQnViYmxlTm9vZGxlID0gKCk6IHZvaWQgPT4geyAvKiBuby1vcCAqLyB9O1xuICBjb25zdCByZWRyYXdOb29kbGVzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNsZWFyTm9vZGxlcygpO1xuICAgIGxldCBsYXN0U2VsZWN0b3JFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgWy4uLmxpc3QuY2hpbGRyZW5dIGFzIEhUTUxFbGVtZW50W10pIHtcbiAgICAgIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdG9yJykpIGxhc3RTZWxlY3RvckVsID0gbm9kZTtcbiAgICAgIC8vIE9ubHkgVEhSRUFERUQgY29tbWVudHMgZ2V0IGEgY29ubmVjdG9yIOKAlCBhIGRldGFjaGVkIGNvbW1lbnQgbXVzdFxuICAgICAgLy8gbG9zZSBpdHMgbm9vZGxlLCBub3QganVzdCBpdHMgaW5kZW50ICh0aGUgdmlzaWJsZSBcImRpc2Nvbm5lY3RcIikuXG4gICAgICBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlZWRiYWNrJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RocmVhZGVkJykgJiYgbGFzdFNlbGVjdG9yRWwpIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIG5vZGUpO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1yYWlsJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2V4cGFuZGVkJykgJiYgbGFzdFNlbGVjdG9yRWwpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gbm9kZS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmlubGluZS1jb21tZW50JykgPz8gbm9kZTtcbiAgICAgICAgZHJhd05vb2RsZShsYXN0U2VsZWN0b3JFbCwgdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZGl2aWRlcicpIHx8IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncm91cC1oZWFkJykpIHtcbiAgICAgICAgbGFzdFNlbGVjdG9yRWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgZHJhd05vb2RsZSA9IChzZWxlY3RvckVsOiBIVE1MRWxlbWVudCwgZmVlZGJhY2tFbDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzUiA9IHNlbGVjdG9yRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZlIgPSBmZWVkYmFja0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxSID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4MSA9IHNSLmxlZnQgLSBsUi5sZWZ0ICsgMTI7XG4gICAgY29uc3QgeTEgPSBzUi5ib3R0b20gLSBsUi50b3AgKyBsaXN0LnNjcm9sbFRvcDtcbiAgICBjb25zdCB4MiA9IGZSLmxlZnQgLSBsUi5sZWZ0O1xuICAgIGNvbnN0IHkyID0gZlIudG9wIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3AgKyAxNDtcbiAgICBjb25zdCB3ID0gTWF0aC5tYXgoMjAsIHgyIC0geDEgKyA0KTtcbiAgICBjb25zdCBoID0gTWF0aC5tYXgoMjAsIHkyIC0geTEpO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndHJlZS1ub29kbGUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyh3KSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKGgpKTtcbiAgICBzdmcuc3R5bGUubGVmdCA9IGAke3gxIC0gMn1weGA7XG4gICAgc3ZnLnN0eWxlLnRvcCA9IGAke3kxfXB4YDtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgY29uc3Qgc3ggPSAyLCBzeSA9IDAsIGV4ID0gdyAtIDIsIGV5ID0gaDtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIGBNICR7c3h9ICR7c3l9IEMgJHtzeH0gJHtzeSArIGggKiAwLjU1fSwgJHtleCAtIHcgKiAwLjR9ICR7ZXl9LCAke2V4fSAke2V5fWApO1xuICAgIHN2Zy5hcHBlbmQocGF0aCk7XG4gICAgbGlzdC5hcHBlbmQoc3ZnKTtcbiAgfTtcbiAgbGV0IHNjcm9sbFJhZiA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgIGlmIChzY3JvbGxSYWYpIHJldHVybjtcbiAgICBzY3JvbGxSYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBzY3JvbGxSYWYgPSAwOyByZWRyYXdOb29kbGVzKCk7IH0pO1xuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlZHJhd05vb2RsZXMpO1xuXG4gIC8vIOKUgOKUgOKUgCBQZXItbWVzc2FnZSByZW5kZXJlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJlbmRlck1lc3NhZ2UgPSAobTogUGFuZWxNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gcmVuZGVyUGFnZShtKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4gcmVuZGVyU2VsZWN0b3IobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIHJlbmRlckZlZWRiYWNrKG0sIGxhc3RTZWxlY3RvclNlbCk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBhZ2UgPSAobTogUGFnZU1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGQuY2xhc3NOYW1lID0gJ3BhZ2UtZGl2aWRlcic7XG4gICAgZC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBjb25zdCB0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0cy5jbGFzc05hbWUgPSAndGFiLXN0YXR1cyc7XG4gICAgdHMuZGF0YXNldC51cmwgPSBtLnVybDtcbiAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHRzLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICBkLmFwcGVuZCh0cyk7XG4gICAgY29uc3QgdSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB1LmNsYXNzTmFtZSA9ICd1cmwnO1xuICAgIHUudGV4dENvbnRlbnQgPSBtLnVybDtcbiAgICB1LmRhdGFzZXQudGlwID0gYCR7bS50aXRsZSA/PyAnJ30gwrcgJHttLnVybH1gO1xuICAgIGQuYXBwZW5kKHUpO1xuICAgIGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IG9uIHRoaXMgcGFnZSBpbiB0aGUgYWN0aXZlIHRhYiwgY2xpY2tpbmcgdGhlIFVSTFxuICAgICAgLy8gc2hvdWxkbid0IHJlbG9hZCBvciBzdGVhbCBmb2N1cyDigJQgaXQgc2hvdWxkIGp1c3QgYmUgYSBuby1vcFxuICAgICAgLy8gdmlzdWFsbHkgKHRoZSByb3cgYWxyZWFkeSBpbmRpY2F0ZXMgXCJvcGVuXCIgdmlhIC50YWItc3RhdHVzKS4gVGhlXG4gICAgICAvLyB1c2VyIGNvbXBsYWluZWQgYWJvdXQgZ2V0dGluZyBmb3JjZWQgaW50byBhIG5hdmlnYXRpb24gd2hlbiB0aGV5XG4gICAgICAvLyB3ZXJlIGp1c3QgdHJ5aW5nIHRvIHJlYWQgdGhlIHJvdy5cbiAgICAgIGlmIChtLnVybCA9PT0gbGl2ZVRhYlVybCkge1xuICAgICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgb24gdGhpcyBwYWdlJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByID0gYXdhaXQgc2VuZFRvQmc8e2ZvdW5kPzogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAnc3dpdGNoLXRvLXRhYicsIHVybDogbS51cmwsIG9wZW5JZk1pc3Npbmc6IHRydWV9KTtcbiAgICAgIGlmIChyPy5mb3VuZCkgc2V0U3RhdHVzKCdTd2l0Y2hlZCB0byB0YWInKTtcbiAgICAgIGVsc2UgaWYgKHI/Lm9wZW5lZCkgc2V0U3RhdHVzKCdPcGVuZWQgaW4gbmV3IHRhYicpO1xuICAgICAgZWxzZSBzZXRTdGF0dXMoXCJDb3VsZG4ndCBvcGVuIHRhYlwiLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGQ7XG4gIH07XG5cbiAgY29uc3QgdGl0bGVGcm9tRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChlLnRlc3RJZCkgcmV0dXJuIGBbdGVzdElkPSR7ZS50ZXN0SWR9XWA7XG4gICAgaWYgKGUuaWQpIHJldHVybiBgIyR7ZS5pZH1gO1xuICAgIGlmIChlLmNsYXNzZXM/Lmxlbmd0aCkgcmV0dXJuIGAke2UudGFnfS4ke2UuY2xhc3Nlcy5zbGljZSgwLCAyKS5qb2luKCcuJyl9YDtcbiAgICByZXR1cm4gZS5zZWxlY3RvciB8fCBlLnRhZyB8fCAnKHVua25vd24pJztcbiAgfTtcblxuICAvLyBQaWNrIHRoZSBtb3N0IFwiaHVtYW5seSByZWFkYWJsZVwiIGxhYmVsIGZvciB0aGUgYnViYmxlIHByZXZpZXcuIFByZWZlcnNcbiAgLy8gdmlzaWJsZS10by11c2VyIHRleHQgaW4gdGhpcyBwcmlvcml0eTpcbiAgLy8gICAxLiBpbm5lclRleHQgLyB0ZXh0Q29udGVudCAoYGVudHJ5LnRleHRgKSDigJQgd2hhdCB0aGUgdXNlciByZWFkcyBvbiBzY3JlZW5cbiAgLy8gICAyLiBhY2Nlc3NpYmxlTmFtZSAoYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZhbGxiYWNrIGNoYWluKVxuICAvLyAgIDMuIGlucHV0IHZhbHVlIChza2lwcGVkIGlmIGl0J3MgdGhlIG1hc2tlZCBwYXNzd29yZCBwbGFjZWhvbGRlcilcbiAgLy8gICA0LiBpbnB1dCBwbGFjZWhvbGRlclxuICAvLyAgIDUuIGltZyBhbHRcbiAgLy8gICA2LiBjb21wb25lbnRSb290IChlLmcuIFwiYnV0dG9uI2N0YVwiKVxuICAvLyAgIDcuIHRpdGxlRnJvbUVudHJ5IOKAlCBsYXN0LXJlc29ydCB0YWcvY2xhc3MvaWQgZmFsbGJhY2tcbiAgLy8gQ1NTIGhhbmRsZXMgdmlzdWFsIHRydW5jYXRpb24gdmlhIHRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7IHdlIHNoaXAgdGhlXG4gIC8vIGZ1bGwgc3RyaW5nIHNvIHRoZSB0b29sdGlwIG9uIGhvdmVyIGNhbiBzaG93IHRoZSBjb21wbGV0ZSB2YWx1ZS5cbiAgY29uc3QgbmljZUxhYmVsID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXh0KSByZXR1cm4gZS50ZXh0O1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lKSByZXR1cm4gZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBjb25zdCB2ID0gZS5hdHRycz8udmFsdWU7XG4gICAgaWYgKHYgJiYgdiAhPT0gJ+KAouKAouKAouKAoicpIHJldHVybiB2O1xuICAgIGlmIChlLmF0dHJzPy5wbGFjZWhvbGRlcikgcmV0dXJuIGUuYXR0cnMucGxhY2Vob2xkZXI7XG4gICAgaWYgKGUuYXR0cnM/LmFsdCkgcmV0dXJuIGUuYXR0cnMuYWx0O1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QpIHJldHVybiBlLmNvbXBvbmVudFJvb3Q7XG4gICAgcmV0dXJuIHRpdGxlRnJvbUVudHJ5KGUpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclNlbGVjdG9yID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCB2YWxpZCA9IHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHNhbWVQYXRoID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKSA9PT0gbGl2ZVRhYlBhdGg7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgc2VsZWN0b3InO1xuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdzdGFsZScpO1xuICAgIGVsc2UgaWYgKHZhbGlkID09PSBmYWxzZSAmJiAhc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdkaWZmLXBhZ2UnKTtcbiAgICBpZiAobS5waW5uZWQpIGRpdi5jbGFzc0xpc3QuYWRkKCdwaW5uZWQnKTtcbiAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBkaXYuY2xhc3NMaXN0LmFkZCgnaGFzLWdyb3VwJyk7XG4gICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgPT09IGxhc3RBY3RpdmVTZWxlY3RvcikgZGl2LmNsYXNzTGlzdC5hZGQoJ2xhc3QtYWN0aXZlJyk7XG4gICAgLy8gQXV0by1leHBhbmQgb24gc2VhcmNoIGhpdCBzbyB0aGUgdXNlciBzZWVzIHdoZXJlIHRoZSBtYXRjaCBsYW5kZWQuXG4gICAgY29uc3QgbWF0Y2hlZEJvZHkgPSBib2R5TWF0Y2hlc1NlYXJjaChtKTtcbiAgICBpZiAobWF0Y2hlZEJvZHkpIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcsICdzZWFyY2gtaGl0Jyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5kYXRhc2V0LnNlbGVjdG9yID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAvLyBEcmFnLXRvLXJlcGFyZW50OiBldmVyeSBzZWxlY3RvciBidWJibGUgaXMgYSB2YWxpZCBkcm9wIHRhcmdldCBmb3JcbiAgICAvLyBhIGNvbW1lbnQgYmVpbmcgZHJhZ2dlZCBmcm9tIGVsc2V3aGVyZSBpbiB0aGUgc2lkZWJhci5cbiAgICB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0KGRpdiwgbSk7XG5cbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnaGVhZCc7XG4gICAgY29uc3QgY2FyZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY2FyZXQuY2xhc3NOYW1lID0gJ2NhcmV0JztcbiAgICBjYXJldC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZXZyb24tcmlnaHQnLCAxMik7XG4gICAgaGVhZC5hcHBlbmQoY2FyZXQpO1xuICAgIGNvbnN0IHBpbk1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBwaW5NYXJrZXIuY2xhc3NOYW1lID0gJ3Bpbi1tYXJrZXInO1xuICAgIHBpbk1hcmtlci5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3N0YXItZmlsbGVkJywgMTEpO1xuICAgIGhlYWQuYXBwZW5kKHBpbk1hcmtlcik7XG4gICAgY29uc3Qgc2VxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7bS5lbnRyeS5ufWA7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgc2VxLnRleHRDb250ZW50ICs9IGArJHttLmVudHJ5Lmdyb3VwLmxlbmd0aH1gO1xuICAgIGhlYWQuYXBwZW5kKHNlcSk7XG4gICAgY29uc3QgY29tcGFjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb21wYWN0LmNsYXNzTmFtZSA9ICdjb21wYWN0JztcbiAgICBjb25zdCBjb21wYWN0U3RyID0gbmljZUxhYmVsKG0uZW50cnkpO1xuICAgIGNvbXBhY3QuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goY29tcGFjdFN0ciwgc2VhcmNoUXVlcnkpO1xuICAgIC8vIFNob3cgdGhlIGZ1bGwgbGFiZWwgb24gaG92ZXIgZXZlbiB3aGVuIENTUyBlbGxpcHNpcyB0cnVuY2F0ZXMgdGhlXG4gICAgLy8gdmlzaWJsZSBwb3J0aW9uIOKAlCB1c2VmdWwgd2hlbiB0aGUgdmlzaWJsZSB0ZXh0L3BsYWNlaG9sZGVyIGlzIGxvbmcuXG4gICAgaWYgKGNvbXBhY3RTdHIubGVuZ3RoID4gMjQpIGNvbXBhY3QuZGF0YXNldC50aXAgPSBjb21wYWN0U3RyO1xuICAgIGhlYWQuYXBwZW5kKGNvbXBhY3QpO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgY29uc3QgciA9IG0uZW50cnkucmVjdDtcbiAgICBtZXRhLnRleHRDb250ZW50ID0gciA/IGAke3Iud33DlyR7ci5ofWAgOiAobS5lbnRyeS50YWcgPz8gJycpO1xuICAgIGhlYWQuYXBwZW5kKG1ldGEpO1xuICAgIGRpdi5hcHBlbmQoaGVhZCk7XG5cbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHN1bW1hcnkuY2xhc3NOYW1lID0gJ3BlZWstc3VtbWFyeSc7XG4gICAgc3VtbWFyeS5pbm5lckhUTUwgPSBgPHNwYW4gZGF0YS1pY29uPVwiYWxlcnQtY2lyY2xlXCIgZGF0YS1zaXplPVwiMTFcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInRcIj4ke2Rpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2RpZmYtcGFnZScpID8gJ2RpZmZlcmVudCBwYWdlJyA6ICdzdGFsZSd9PC9zcGFuPmA7XG4gICAgaGVhZC5hcHBlbmQoc3VtbWFyeSk7XG4gICAgbW91bnRJY29ucyhzdW1tYXJ5KTtcblxuICAgIGNvbnN0IGVyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVyci5jbGFzc05hbWUgPSAncGVlay1lcnJvcic7XG4gICAgY29uc3QgcmVhc29uID0gc2VsZWN0b3JFcnJvcnMuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHBhdGhGcm9tRW50cnkgPSBwYXRoT2YobS5lbnRyeS51cmwgPz8gJycpO1xuICAgIGVyci5pbm5lckhUTUwgPSBzYW1lUGF0aFxuICAgICAgPyBgPGI+U3RhbGU8L2I+IMK3ICR7ZXNjYXBlSHRtbChyZWFzb24gPz8gJ25vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzLicpfTxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmBcbiAgICAgIDogYENhcHR1cmVkIG9uIDxjb2RlPiR7ZXNjYXBlSHRtbChwYXRoRnJvbUVudHJ5KX08L2NvZGU+IOKAlCBjdXJyZW50IHRhYiBpcyA8Y29kZT4ke2VzY2FwZUh0bWwobGl2ZVRhYlBhdGggPz8gJycpfTwvY29kZT4uIFN3aXRjaCB0YWJzIHRvIHZhbGlkYXRlLjxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmA7XG4gICAgZGl2LmFwcGVuZChlcnIpO1xuXG4gICAgLy8gQW5jZXN0b3IgYnJlYWRjcnVtYiDigJQgUGxhc21pYy1zdHlsZSBlc2NhbGF0b3IuIENoaXBzIGZvciBlYWNoIGVudHJ5IGluXG4gICAgLy8gZW50cnkuYW5jZXN0b3JzIChjbG9zZXN0IGZpcnN0KS4gQ2xpY2sgYSBjaGlwIHRvIGNhcHR1cmUgdGhhdFxuICAgIC8vIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2UgKGRlcHRoID0gY2hpcCBpbmRleCArIDEgc2luY2UgdGhlIGVudHJ5J3NcbiAgICAvLyBvd24gc2VsZWN0b3IgaXMgZGVwdGggMCkuIEJyaWdodG5lc3MgZ3JhZGllbnQgZGFya2VucyBkZWVwZXIgY2hpcHMuXG4gICAgaWYgKG0uZW50cnkuYW5jZXN0b3JzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNydW1icyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY3J1bWJzLmNsYXNzTmFtZSA9ICdhbmNlc3Rvci1jcnVtYnMnO1xuICAgICAgY3J1bWJzLmRhdGFzZXQudGlwID0gJ0NsaWNrIGEgY3J1bWIgdG8gZXNjYWxhdGUgdGhlIGNhcHR1cmUgdG8gYW4gYW5jZXN0b3IgZWxlbWVudCc7XG4gICAgICBtLmVudHJ5LmFuY2VzdG9ycy5mb3JFYWNoKChhbmMsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBjaGlwLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgY2hpcC5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY2hpcCc7XG4gICAgICAgIC8vIEJyaWdodG5lc3MgZ3JhZGllbnQ6IGRlZXBlciBjaGlwcyBnZXQgcHJvZ3Jlc3NpdmVseSBkaW1tZXIuXG4gICAgICAgIGNoaXAuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHsoMSAtIGkgKiAwLjA4KS50b0ZpeGVkKDIpfSlgO1xuICAgICAgICBjb25zdCBsYWJlbCA9IGFuYy50ZXN0SWQgPyBgWyR7YW5jLnRlc3RJZH1dYFxuICAgICAgICAgIDogYW5jLmlkID8gYCMke2FuYy5pZH1gXG4gICAgICAgICAgOiBhbmMuY2xhc3Nlcz8ubGVuZ3RoID8gYCR7YW5jLnRhZ30uJHthbmMuY2xhc3Nlc1swXX1gXG4gICAgICAgICAgOiBhbmMudGFnO1xuICAgICAgICBjaGlwLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNoaXAuZGF0YXNldC50aXAgPSBgQ2FwdHVyZSB0aGUgYW5jZXN0b3IgJHtpICsgMX0gbGV2ZWwke2kgPyAncycgOiAnJ30gdXAgwrcgJHthbmMudGFnfSR7YW5jLmlkID8gJyMnICsgYW5jLmlkIDogJyd9YDtcbiAgICAgICAgLy8gSG92ZXItcHJldmlldyB0aGUgYW5jZXN0b3Igb24gdGhlIGxpdmUgcGFnZSBzbyB0aGUgdXNlciBjYW4gc2VlXG4gICAgICAgIC8vIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY29tbWl0dGluZy4gTWlycm9ycyBob3dcbiAgICAgICAgLy8gaG92ZXJpbmcgYSBzZWxlY3RvciBidWJibGUgcGFpbnRzIGl0cyByaW5nLiBDbGVhcmluZyBvblxuICAgICAgICAvLyBtb3VzZWxlYXZlIHN3YXBzIGJhY2sgdG8gdGhlIGJ1YmJsZSdzIG93biBvdXRsaW5lICh0aGUgYnViYmxlJ3NcbiAgICAgICAgLy8gbW91c2VlbnRlciBoYW5kbGVyIHBhaW50ZWQgaXQ7IGxlYXZpbmcgdGhlIGNoaXAganVzdCByZW1vdmVzXG4gICAgICAgIC8vIHRoZSBvdmVycmlkZSkuXG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDF9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAvLyBSZS1wYWludCB0aGUgYnViYmxlJ3Mgb3duIHJpbmcgcmF0aGVyIHRoYW4gY2xlYXJpbmcgZW50aXJlbHlcbiAgICAgICAgICAvLyBzbyB0aGUgdXNlciBkb2Vzbid0IHNlZSBhIGZsaWNrZXIgb2YgXCJub3RoaW5nXCIgYmV0d2VlbiBjaGlwcy5cbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtcbiAgICAgICAgICAgIGtpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGRlcHRoOiBpICsgMSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAocmVwbHk/Lm9rKSBzZXRTdGF0dXMoYENhcHR1cmVkIGFuY2VzdG9yICR7YW5jLnRhZ31gKTtcbiAgICAgICAgICBlbHNlIHNldFN0YXR1cygnQ291bGQgbm90IGNhcHR1cmUgYW5jZXN0b3InLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjcnVtYnMuYXBwZW5kKGNoaXApO1xuICAgICAgfSk7XG4gICAgICBkaXYuYXBwZW5kKGNydW1icyk7XG4gICAgfVxuXG4gICAgLy8gUHJldmlldyB0aWxlLiBUaGUgZnVsbCBQTkcgbGl2ZXMgb24gZGlzayB1bmRlclxuICAgIC8vIC5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy87IHRoZSBkYXRhVXJsIGlzIGEgc2lkZS1wYW5lbC1mcmllbmRseVxuICAgIC8vIGRvd25zY2FsZSAo4omkMzIwcHggd2lkZSkuIFRvIHN0b3AgdGhlIGxheW91dCBmcm9tIGp1bXBpbmcgd2hlbiBhIHNob3RcbiAgICAvLyBhcnJpdmVzIGEgc2Vjb25kIGFmdGVyIGNhcHR1cmUsIHdlIFJFU0VSVkUgdGhlIGZpbmFsIGltYWdlIGhlaWdodCB1cFxuICAgIC8vIGZyb250IHVzaW5nIHRoZSBjYXB0dXJlZCBlbGVtZW50J3Mga25vd24gYXNwZWN0IHJhdGlvIGFuZCBwYWludCBhXG4gICAgLy8gc2tlbGV0b24gbG9hZGVyIGluIHRoYXQgc3BhY2UsIHRoZW4gc3dhcCB0aGUgc2NyZWVuc2hvdCBpbiB3aXRoIG5vXG4gICAgLy8gcmVmbG93LiBUaGUgcmVzZXJ2YXRpb24gb25seSBoYXBwZW5zIHdoZW4gYSBzaG90IGlzIGFjdHVhbGx5IGV4cGVjdGVkXG4gICAgLy8gKGF1dG9TY3JlZW5zaG90IG9uLCBob3N0IG5vdCBza2lwcGVkLCBubyByZWNvcmRlZCBmYWlsdXJlKSBzbyBjYXB0dXJlc1xuICAgIC8vIHRoYXQgd2lsbCBuZXZlciBnZXQgYSBzaG90IGRvbid0IGNhcnJ5IGFuIGVtcHR5IGJveC5cbiAgICBjb25zdCBzaG90RGF0YVVybCA9IHNob3RzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzaG90RXhwZWN0ZWQgPSBwcmVmcy5hdXRvU2NyZWVuc2hvdFxuICAgICAgJiYgIXNob3VsZFNraXBTY3JlZW5zaG90KG0uZW50cnkudXJsID8/ICcnKVxuICAgICAgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgaWYgKHNob3REYXRhVXJsIHx8IHNob3RFeHBlY3RlZCkge1xuICAgICAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJldmlldy5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICAvLyBSZXNlcnZlIHZlcnRpY2FsIHNwYWNlIGltbWVkaWF0ZWx5IGZyb20gdGhlIGVsZW1lbnQncyB3aWR0aC9oZWlnaHQuXG4gICAgICAvLyBUaGUgdGh1bWJuYWlsIGlzIHJlbmRlcmVkIGF0IHRoZSBidWJibGUncyBjb250ZW50IHdpZHRoLCBzbyB0aGUgYm94XG4gICAgICAvLyBoZWlnaHQgdHJhY2tzIHRoZSBlbGVtZW50J3MgYXNwZWN0IHJhdGlvLiBDbGFtcCBzbyBhIHZlcnkgdGFsbFxuICAgICAgLy8gZWxlbWVudCBkb2Vzbid0IHJlc2VydmUgYW4gYWJzdXJkIGFtb3VudCBvZiBzcGFjZS5cbiAgICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgICBpZiAociAmJiByLncgPiAwICYmIHIuaCA+IDApIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSBNYXRoLm1pbihNYXRoLm1heChyLmggLyByLncsIDAuMTIpLCAyLjIpO1xuICAgICAgICBwcmV2aWV3LnN0eWxlLnNldFByb3BlcnR5KCctLXNob3QtcmF0aW8nLCBTdHJpbmcocmF0aW8pKTtcbiAgICAgICAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdyZXNlcnZlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKHNob3REYXRhVXJsKSB7XG4gICAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWcuY2xhc3NOYW1lID0gJ3Nob3QnO1xuICAgICAgICBpbWcuYWx0ID0gYFNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWA7XG4gICAgICAgIC8vIFJldmVhbCBvbmx5IG9uY2UgZGVjb2RlZCBzbyB0aGUgc3dhcCBpcyBpbnN0YW50IGFuZCByZWZsb3ctZnJlZTtcbiAgICAgICAgLy8gdGhlIHNrZWxldG9uIHN0YXlzIHZpc2libGUgdW5kZXJuZWF0aCB1bnRpbCB0aGVuLlxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJykpO1xuICAgICAgICBpbWcuc3JjID0gc2hvdERhdGFVcmw7XG4gICAgICAgIGlmIChpbWcuY29tcGxldGUpIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XG4gICAgICAgIHByZXZpZXcuYXBwZW5kKGltZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBzaG90IHlldCDigJQgc2hvdyBhIHNrZWxldG9uIHNoaW1tZXIgb2NjdXB5aW5nIHRoZSByZXNlcnZlZCBzcGFjZS5cbiAgICAgICAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJyk7XG4gICAgICAgIGNvbnN0IHNrZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2tlbC5jbGFzc05hbWUgPSAnc2hvdC1za2VsZXRvbic7XG4gICAgICAgIHNrZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYExvYWRpbmcgc2NyZWVuc2hvdCBvZiAjJHttLmVudHJ5Lm59YCk7XG4gICAgICAgIHByZXZpZXcuYXBwZW5kKHNrZWwpO1xuICAgICAgfVxuICAgICAgZGl2LmFwcGVuZChwcmV2aWV3KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0YXRzLmNsYXNzTmFtZSA9ICdlbnQtc3RhdHMnO1xuICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgY29uc3QgbXlUb2tlbnMgPSB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG0uZW50cnkpKTtcbiAgICBjb25zdCB0b3RhbFRva2VucyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtbSk6IG1tIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnJlZHVjZSgocywgbW0pID0+IHMgKyB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG1tLmVudHJ5KSksIDApO1xuICAgIGNvbnN0IHNoYXJlUGN0ID0gdG90YWxUb2tlbnMgPiAwID8gTWF0aC5yb3VuZCgobXlUb2tlbnMgLyB0b3RhbFRva2VucykgKiAxMDApIDogMDtcbiAgICBjb25zdCBncm91cENvdW50ID0gbS5lbnRyeS5ncm91cD8ubGVuZ3RoID8/IDA7XG4gICAgY29uc3QgZ3JvdXBUb2tlbnMgPSAobS5lbnRyeS5ncm91cCA/PyBbXSkucmVkdWNlKChzLCBnKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShnKSksIDApO1xuICAgIHR5cGUgU3RhdENlbGwgPSB7bGFiZWw6IHN0cmluZzsgdmFsdWU6IHN0cmluZzsgdGlwOiBzdHJpbmd9O1xuICAgIGNvbnN0IGNlbGxzOiBTdGF0Q2VsbFtdID0gW1xuICAgICAge2xhYmVsOiAnSFRNTCcsIHZhbHVlOiBgJHttLmVudHJ5Lm91dGVySFRNTD8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnT3V0ZXIgSFRNTCBjaGFyIGxlbmd0aCd9LFxuICAgICAge2xhYmVsOiAnVG9rZW5zJywgdmFsdWU6IGAke215VG9rZW5zfWAsIHRpcDogJ0FwcHJveCBMTE0gdG9rZW5zIGZvciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdTaGFyZScsIHZhbHVlOiBgJHtzaGFyZVBjdH0lYCwgdGlwOiAnVG9rZW4gc2hhcmUgb2YgYWxsIHNlbGVjdG9ycyd9LFxuICAgICAge2xhYmVsOiAnQ29tbWVudHMnLCB2YWx1ZTogYCR7ZmIubGVuZ3RofWAsIHRpcDogJ0lubGluZSBjb21tZW50cyB0aHJlYWRlZCB1bmRlciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdSdWxlcycsIHZhbHVlOiBgJHttLmVudHJ5Lm1hdGNoZWRSdWxlcz8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnTWF0Y2hlZCBDU1MgcnVsZXMnfSxcbiAgICAgIHtsYWJlbDogJ1N0eWxlcycsIHZhbHVlOiBgJHtPYmplY3Qua2V5cyhtLmVudHJ5LnN0eWxlcyA/PyB7fSkubGVuZ3RofWAsIHRpcDogJ0NvbXB1dGVkLXN0eWxlIGZpZWxkcyBrZXB0J30sXG4gICAgXTtcbiAgICBpZiAoZ3JvdXBDb3VudCkge1xuICAgICAgY2VsbHMucHVzaCh7bGFiZWw6ICdHcm91cCcsIHZhbHVlOiBgJHtncm91cENvdW50fWAsIHRpcDogJ01lbWJlcnMgZm9sZGVkIGludG8gdGhpcyBncm91cCd9KTtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAgVCcsIHZhbHVlOiBgJHtncm91cFRva2Vuc31gLCB0aXA6ICdUb2tlbnMgY29udHJpYnV0ZWQgYnkgZ3JvdXAgbWVtYmVycyd9KTtcbiAgICB9XG4gICAgc3RhdHMuaW5uZXJIVE1MID0gY2VsbHMubWFwKChjKSA9PlxuICAgICAgYDxzcGFuIGNsYXNzPVwiZW50LXN0YXRcIiBkYXRhLXRpcD1cIiR7ZXNjYXBlSHRtbChjLnRpcCl9XCI+PHNwYW4gY2xhc3M9XCJsYmxcIj4ke2MubGFiZWx9PC9zcGFuPjxzcGFuIGNsYXNzPVwidmFsXCI+JHtjLnZhbHVlfTwvc3Bhbj48L3NwYW4+YCxcbiAgICApLmpvaW4oJycpO1xuICAgIGRpdi5hcHBlbmQoc3RhdHMpO1xuXG4gICAgLy8g4pSA4pSAIEpTT04gcGFuZSB3aXRoIHRvb2xiYXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy8gVG9vbGJhciBhYm92ZSB0aGUgSlNPTiBib2R5OiBsZWZ0ID0gbGluZS13cmFwIHRvZ2dsZSwgcmlnaHQgPSBjb3B5LlxuICAgIC8vIFRoZSBKU09OIGl0c2VsZiByZWZsZWN0cyB0aGUgZ2xvYmFsIGBtaW5pZnlgIHNldHRpbmcgc28gdGhlIHVzZXIgc2Vlc1xuICAgIC8vIHRoZSBzYW1lIHNoYXBlIHRoYXQgd2lsbCBlbmQgdXAgaW4gdGhlIGV4cG9ydC5cbiAgICBjb25zdCBqc29uV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25XcmFwLmNsYXNzTmFtZSA9ICdib2R5LWpzb24td3JhcCc7XG4gICAgY29uc3QganNvbkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25CYXIuY2xhc3NOYW1lID0gJ2JvZHktanNvbi1iYXInO1xuXG4gICAgLy8gTGluZS13cmFwIGNoZWNrYm94IChwZXItYnViYmxlIGxvY2FsIHN0YXRlLCBkZWZhdWx0IE9OKS4gV2hlbiBPTiB0aGVcbiAgICAvLyBKU09OIGlzIGZsYXR0ZW5lZCB0byBPTkUgbWluaWZpZWQgbGluZSB0aGF0IHNvZnQtd3JhcHMgdG8gdGhlIGJ1YmJsZVxuICAgIC8vIHdpZHRoIChubyBob3Jpem9udGFsIHNjcm9sbCk7IHdoZW4gT0ZGIGl0IGZhbGxzIGJhY2sgdG8gdGhlIGdsb2JhbFxuICAgIC8vIG1pbmlmeS1yZXNwZWN0aW5nIHByZXR0eS9jb21wYWN0IGZvcm0gd2l0aCBob3Jpem9udGFsIHNjcm9sbC5cbiAgICBjb25zdCB3cmFwTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHdyYXBMYWJlbC5jbGFzc05hbWUgPSAnanNvbi13cmFwLXRvZ2dsZSc7XG4gICAgd3JhcExhYmVsLmRhdGFzZXQudGlwID0gJ0ZsYXR0ZW4gdG8gYSBzaW5nbGUgc29mdC13cmFwcGluZyBsaW5lIGluc3RlYWQgb2YgaG9yaXpvbnRhbCBzY3JvbGwnO1xuICAgIGNvbnN0IHdyYXBDaGVjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgd3JhcENoZWNrLnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIHdyYXBDaGVjay5jaGVja2VkID0gdHJ1ZTtcbiAgICB3cmFwTGFiZWwuYXBwZW5kKHdyYXBDaGVjaywgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBXcmFwJykpO1xuICAgIGpzb25CYXIuYXBwZW5kKHdyYXBMYWJlbCk7XG5cbiAgICAvLyBDb3B5IGJ1dHRvbiAobWlycm9ycyB0aGUgXCJDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OXCIgYWN0aW9uIGJlbG93LFxuICAgIC8vIHN1cmZhY2VkIGF0IHRoZSB0b3Agc28gdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIHNjcm9sbCBwYXN0IHRoZSBKU09OXG4gICAgLy8gdG8gZmluZCBpdCkuXG4gICAgY29uc3QgY29weUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvcHlCdG4udHlwZSA9ICdidXR0b24nO1xuICAgIGNvcHlCdG4uY2xhc3NOYW1lID0gJ2ljb25idG4ganNvbi1jb3B5JztcbiAgICBjb3B5QnRuLmRhdGFzZXQudGlwID0gJ0NvcHkgdGhpcyBjYXB0dXJlIGFzIEpTT04nO1xuICAgIGNvcHlCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NvcHkgY2FwdHVyZSBhcyBKU09OJyk7XG4gICAgY29weUJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NvcHknLCAxMyk7XG4gICAgY29weUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgLy8gRnVsbCBzaW5nbGUtY2FwdHVyZSBleHBvcnQ6IGlkZW50aXR5ICsgcGF0aHMgKyB0ZXh0L2NvbnRlbnQgKyBldmVyeVxuICAgICAgLy8gYXR0YWNoZWQgbm90ZS9jb21tZW50IOKAlCB0aGUgc2FtZSBkZXB0aCBhcyBhIGZ1bGwgZXhwb3J0LCBzY29wZWQgdG9cbiAgICAgIC8vIHRoaXMgb25lIGNhcHR1cmUgKGl0ZW0gNykuIERpc3RpbmN0IGZyb20gdGhlIHJhdyBlbnRyeSBzaG93biBiZWxvdy5cbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KTtcbiAgICBqc29uQmFyLmFwcGVuZChjb3B5QnRuKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoanNvbkJhcik7XG5cbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9keS5jbGFzc05hbWUgPSAnYm9keS1qc29uIHdyYXAtb24nO1xuICAgIC8vIFJlbmRlciB0aGUgSlNPTiB0byBtYXRjaCB0aGUgd3JhcCBzdGF0ZTpcbiAgICAvLyAgIHdyYXAgT04gIOKGkiBhIHNpbmdsZSBtaW5pZmllZCBsaW5lIChpbmRlbnQgMCkgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZVxuICAgIC8vICAgICAgICAgICAgICBidWJibGUgd2lkdGggKENTUyBoYW5kbGVzIHRoZSB2aXN1YWwgd3JhcHBpbmcgdmlhXG4gICAgLy8gICAgICAgICAgICAgIG92ZXJmbG93LXdyYXA6YW55d2hlcmUpLCBzbyB0aGUgd2hvbGUgb2JqZWN0IGlzIG9uZVxuICAgIC8vICAgICAgICAgICAgICBjb250aW51b3VzIHN0cmluZyB3aXRoIG5vIGhvcml6b250YWwgc2Nyb2xsLlxuICAgIC8vICAgd3JhcCBPRkYg4oaSIHRoZSBnbG9iYWwgbWluaWZ5LXJlc3BlY3RpbmcgZm9ybTogcHJldHR5LXByaW50ZWQgZnVsbFxuICAgIC8vICAgICAgICAgICAgICBlbnRyeSwgb3IgdGhlIHNsaW1FbnRyeSBjb21wYWN0IGZvcm0gd2hlbiBtaW5pZnkgaXMgb24sXG4gICAgLy8gICAgICAgICAgICAgIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwgZm9yIGxvbmcgbGluZXMuXG4gICAgY29uc3QgcmVuZGVySnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGJvZHkudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwQ2hlY2suY2hlY2tlZDtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSAod3JhcHBlZCB8fCBwcmVmcy5taW5pZnkpID8gc2xpbUVudHJ5KG0uZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWV9KSA6IG0uZW50cnk7XG4gICAgICBjb25zdCBpbmRlbnQgPSAod3JhcHBlZCB8fCBwcmVmcy5taW5pZnkpID8gMCA6IDI7XG4gICAgICBjb25zdCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgaW5kZW50KTtcbiAgICAgIGFwcGVuZEpzb25IaWdobGlnaHQoYm9keSwgdGV4dCk7XG4gICAgICBpZiAoc2VhcmNoUXVlcnkpIHdyYXBTZWFyY2hIaXRzSW5UZXh0Tm9kZXMoYm9keSwgc2VhcmNoUXVlcnkpO1xuICAgIH07XG4gICAgcmVuZGVySnNvbigpO1xuICAgIHdyYXBDaGVjay5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb24nLCB3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb2ZmJywgIXdyYXBDaGVjay5jaGVja2VkKTtcbiAgICAgIHJlbmRlckpzb24oKTtcbiAgICB9KTtcbiAgICAvLyBTdG9wIHRoZSBjbGljayBvbiB0aGUgdG9vbGJhciBmcm9tIGNvbGxhcHNpbmcgdGhlIGJ1YmJsZSDigJQgdGhlIGhlYWQnc1xuICAgIC8vIGNsaWNrIGhhbmRsZXIgdG9nZ2xlcyBgLmV4cGFuZGVkYCBvbiBjbGljaywgYW5kIHRoZSBiYXIgbGl2ZXMgaW5zaWRlXG4gICAgLy8gdGhlIGJ1YmJsZS5cbiAgICBqc29uQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGpzb25XcmFwLmFwcGVuZChib2R5KTtcbiAgICBkaXYuYXBwZW5kKGpzb25XcmFwKTtcblxuICAgIGhlYWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwYW5kZWQnKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXdOb29kbGVzKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGdvbGQ6IHRydWV9KTtcbiAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgaWYgKGxhc3RBY3RpdmVTZWxlY3Rvcikgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBsYXN0QWN0aXZlU2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFjdGlvbnMuY2xhc3NOYW1lID0gJ2FjdGlvbnMnO1xuICAgIC8vIE5vdGU6IE5PIGFjdGlvbnMtcm93IG1vdXNlZW50ZXIvbW91c2VsZWF2ZS4gVGhlIGJ1YmJsZSdzIG93blxuICAgIC8vIG1vdXNlZW50ZXIvbW91c2VsZWF2ZSBhbHJlYWR5IHBhaW50cyB0aGUgcGFnZS1zaWRlIG91dGxpbmUgd2hpbGVcbiAgICAvLyB0aGUgY3Vyc29yIGlzIGFueXdoZXJlIGluc2lkZSB0aGUgYnViYmxlIOKAlCBpbmNsdWRpbmcgb3ZlciBhY3Rpb25cbiAgICAvLyBidXR0b25zLiBBZGRpbmcgaGFuZGxlcnMgSEVSRSB1c2VkIHRvIGNsZWFyIHRoZSBvdXRsaW5lIHdoZW5ldmVyXG4gICAgLy8gdGhlIGN1cnNvciBtb3ZlZCBmcm9tIC5hY3Rpb25zIGJhY2sgdG8gdGhlIGJ1YmJsZSBib2R5IChiZWNhdXNlXG4gICAgLy8gLm1vdXNlbGVhdmUgZmlyZXMgb24gdGhlIHBhcmVudCBwYXRoIGV2ZW4gdGhvdWdoIC5tb3VzZWVudGVyIG9uXG4gICAgLy8gdGhlIGJ1YmJsZSBkb2Vzbid0IHJlZmlyZSksIHdoaWNoIHJlYWQgYXMgXCJ0aGUgaGlnaGxpZ2h0IGZsaWNrZXJzXG4gICAgLy8gb2ZmIG1pZC1ob3ZlclwiLlxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bihtLnBpbm5lZCA/ICdzdGFyLWZpbGxlZCcgOiAnc3RhcicsIG0ucGlubmVkID8gJ1VucGluIGZyb20gdG9wJyA6ICdQaW4gdG8gdG9wJywgKCkgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG0ucGlubmVkID0gIW0ucGlubmVkO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3RvZ2dsZWQ6IG0ucGlubmVkfSkpO1xuICAgIC8vIExvY2F0ZSBpcyBhIG9uZS1zaG90OiBzY3JvbGwgdGhlIHBhZ2UgdG8gdGhlIGVsZW1lbnQgYW5kIHJ1biB0aGVcbiAgICAvLyAzLXB1bHNlIGN5YW4gcmluZyBhbmltYXRpb24uIEl0IHVzZWQgdG8gc2hhcmUgYGxhc3RBY3RpdmVTZWxlY3RvcmBcbiAgICAvLyB3aXRoIHRoZSBob3Zlci1zdGlja3kgcGF0aCwgd2hpY2ggbWFkZSB0aGUgYnV0dG9uIGFwcGVhciB0b2dnbGVkXG4gICAgLy8gYW55IHRpbWUgdGhlIHVzZXIgbWVyZWx5IGhvdmVyZWQgdGhlIGJ1YmJsZS4gTm93IGl0IGhhcyBub1xuICAgIC8vIHBlcnNpc3RlbnQgc3RhdGUg4oCUIHByZXNzaW5nIGl0IGFsd2F5cyBwbGF5cyB0aGUgc2FtZSBmbGFzaC5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2Nyb3NzaGFpcicsICdMb2NhdGUgdGhpcyBlbGVtZW50IG9uIHRoZSBwYWdlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2xvY2F0ZS1mbGFzaCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICBzZXRTdGF0dXMoJ0xvY2F0aW5n4oCmJyk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbWVzc2FnZS1zcXVhcmUtcGx1cycsICdBZGQgYSBjb21tZW50IGFmdGVyIHRoaXMgY2FwdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGNvbnN0IGJlZm9yZUlkID0gaWR4ID49IDAgJiYgaWR4IDwgbWVzc2FnZXMubGVuZ3RoIC0gMSA/IG1lc3NhZ2VzW2lkeCArIDFdIS5pZCA6ICdfX2VuZF9fJztcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7XG4gICAgICByZW5kZXIoKTtcbiAgICB9LCB7c2l6ZTogMTV9KSk7XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIC8vIFNwbGl0LWdyb3VwIGFjdGlvbjogcHJvbW90ZSBlYWNoIGdyb3VwIG1lbWJlciBiYWNrIHRvIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzZWxlY3RvciBlbnRyeSwgdGhlbiBmaXJlIGEgZnJlc2ggZWxlbWVudCBzY3JlZW5zaG90XG4gICAgICAvLyBmb3IgZWFjaCBwcm9tb3RlZCBtZW1iZXIuIEdyb3VwIGNhcHR1cmVzIHNoYXJlIGEgc2luZ2xlIHVuaW9uLVxuICAgICAgLy8gYmJveCBzY3JlZW5zaG90IGtleWVkIG9uIHRoZSBoZWFkOyB0aGUgbWVtYmVycyBuZXZlciBnZXQgdGhlaXJcbiAgICAgIC8vIG93biBlbGVtZW50IHNob3RzIHVudGlsIHNwbGl0LiBBZnRlciB0aGlzLCBlYWNoIGNoaWxkIGhhcyBpdHNcbiAgICAgIC8vIG93biByaW5nICsgdGh1bWJuYWlsLlxuICAgICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdsaXN0LXRyZWUnLCBgU3BsaXQgdGhpcyBncm91cCBvZiAke2dyb3VwQ291bnR9IGludG8gaW5kaXZpZHVhbCBlbnRyaWVzYCwgKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICAgIGlmIChpZHggPCAwKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBtLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgICBkZWxldGUgbS5lbnRyeS5ncm91cDtcbiAgICAgICAgY29uc3QgZnJlc2g6IFNlbGVjdG9yTWVzc2FnZVtdID0gbWVtYmVycy5tYXAoKGVudHJ5KSA9PiAoe1xuICAgICAgICAgIHR5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogZW50cnkudHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeSxcbiAgICAgICAgfSkpO1xuICAgICAgICBtZXNzYWdlcy5zcGxpY2UoaWR4ICsgMSwgMCwgLi4uZnJlc2gpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGdyb3VwIG9mICR7bWVtYmVycy5sZW5ndGh9IMK3IGNhcHR1cmluZyBzY3JlZW5zaG90c+KApmApO1xuICAgICAgICAvLyBGaXJlIHBlci1tZW1iZXIgZWxlbWVudCBzaG90cyDigJQgc2VxdWVudGlhbGx5IHNvIHRoZXkgZG9uJ3RcbiAgICAgICAgLy8gcmFjZSBjYXB0dXJlVmlzaWJsZVRhYi4gRmFpbHVyZXMgKHNlbGVjdG9yIG5vIGxvbmdlciBtYXRjaGVzLFxuICAgICAgICAvLyBob3N0IG9uIHNraXAtbGlzdCkgbGVhdmUgdGhlIG1lbWJlciB3aXRob3V0IGEgdGh1bWJuYWlsIGJ1dFxuICAgICAgICAvLyBkb24ndCBibG9jayB0aGUgb3RoZXJzLlxuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGNhcHR1cmVkID0gMDtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGZyZXNoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCBmaXJlRWxlbWVudFNob3QoY2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoY2hpbGQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgY2FwdHVyZWQrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ3NwbGl0LWdyb3VwIHNob3QgZmFpbGVkIGZvcicsIGNoaWxkLmVudHJ5LnNlbGVjdG9yLCBlKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGRvbmUgwrcgJHtjYXB0dXJlZH0vJHttZW1iZXJzLmxlbmd0aH0gc2NyZWVuc2hvdHNgKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdleHRlcm5hbC1saW5rJywgJ0xvZyB0aGUgZWxlbWVudCBhbmQgY29weSBhIGNvbnNvbGUgc25pcHBldCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtzbmlwcGV0Pzogc3RyaW5nfT4oe2tpbmQ6ICdsb2ctZWxlbWVudCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGNvbnN0IHNuaXBwZXQgPSByZXBseT8uc25pcHBldCA/PyBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignJHttLmVudHJ5LnNlbGVjdG9yfScpYDtcbiAgICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNuaXBwZXQpOyBzZXRTdGF0dXMoJ0xvZ2dlZCArIGNvcGllZCBjb25zb2xlIHNuaXBwZXQnKTsgc2hvd0NvcGllZCgnQ29waWVkIHNuaXBwZXQnKTsgfVxuICAgICAgY2F0Y2ggeyBzZXRTdGF0dXMoJ0xvZ2dlZCB0byBjb25zb2xlJyk7IH1cbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdyZWZyZXNoLWN3JywgJ1JlLWNhcHR1cmUgdGhpcyBlbGVtZW50IGZyb20gdGhlIGxpdmUgcGFnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtraW5kOiAncmVjYXB0dXJlJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIG46IG0uZW50cnkubn0pO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5lbnRyeSkge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLmVudHJ5ID0gcmVwbHkuZW50cnk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cygnUmUtY2FwdHVyZWQnKTtcblxuICAgICAgfSBlbHNlIHNldFN0YXR1cygnUmUtY2FwdHVyZSBmYWlsZWQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBhIGZ1bGwgZXhwb3J0IChwYXRocywgdGV4dCwgY29tbWVudHMpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBtZXNzYWdlcy5mbGF0TWFwKCh4KSA9PiB4LnR5cGUgPT09ICdmZWVkYmFjaycgJiYgeC5wYXJlbnRVaWQgPT09IG0uZW50cnkudWlkXG4gICAgICAgID8gW3t0ZXh0OiB4LnRleHQsIHRzOiB4LnRzLCB1aWQ6IHguaWQsIHBhcmVudFVpZDogeC5wYXJlbnRVaWR9XSA6IFtdKTtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNlcmlhbGl6ZUNhcHR1cmVKc29uKHtlbnRyeTogbS5lbnRyeSwgZmVlZGJhY2t9KSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjYXB0dXJlIGV4cG9ydCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNhcHR1cmUnLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJGZWVkYmFjayA9IChtOiBGZWVkYmFja01lc3NhZ2UsIGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayc7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChtLnRleHQsIHNlYXJjaFF1ZXJ5KTtcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSB7XG4gICAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgc2VsZWN0b3Ig4oCUIHByZWZlciBwYXJlbnRVaWQgKHRoZSBwZXJzaXN0ZWQgRkspXG4gICAgICAvLyBvdmVyIGNhcHR1cmUtYWRqYWNlbmN5LCBzaW5jZSBkcmFnLXRvLXJlcGFyZW50IG1vdmVzIHRoZSBjaGlwIGJ1dFxuICAgICAgLy8gdGhlIHRyYWlsaW5nLXNlbGVjdG9yIGhldXJpc3RpYyBnaXZlcyBzdGFsZSByZXN1bHRzIHVudGlsIHJlbmRlclxuICAgICAgLy8gc2V0dGxlcy4gVGhlIGFubm90YXRpb24gb3ZlcmxheSBuZWVkcyB0aGUgcGFyZW50J3Mgc2VsZWN0b3IgdG9cbiAgICAgIC8vIGFuY2hvciB0aGUgb24tcGFnZSB0b29sdGlwLlxuICAgICAgY29uc3Qge3BhcmVudFNlbCwgcGFyZW50VWlkfSA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkge1xuICAgICAgICAgIGNvbnN0IHAgPSBtZXNzYWdlcy5maW5kKFxuICAgICAgICAgICAgKG1tKSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InICYmIChtbSBhcyBTZWxlY3Rvck1lc3NhZ2UpLmVudHJ5LnVpZCA9PT0gbS5wYXJlbnRVaWQsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAocCAmJiBwLnR5cGUgPT09ICdzZWxlY3RvcicpIHJldHVybiB7cGFyZW50U2VsOiBwLmVudHJ5LnNlbGVjdG9yLCBwYXJlbnRVaWQ6IHAuZW50cnkudWlkfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3BhcmVudFNlbDogbGFzdFNlbGVjdG9yU2VsLCBwYXJlbnRVaWQ6IHVuZGVmaW5lZCBhcyBzdHJpbmcgfCB1bmRlZmluZWR9O1xuICAgICAgfSkoKTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogcGFyZW50U2VsLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIC8vIFNjcm9sbCB0aGUgcGFyZW50IGVsZW1lbnQgaW50byB2aWV3ICsgc2hvdyB0aGUgb24tcGFnZVxuICAgICAgICAvLyBhbm5vdGF0aW9uIHRvb2x0aXAgcmVuZGVyaW5nIFRISVMgY29tbWVudCdzIHRleHQuIFBhc3MgdGhlXG4gICAgICAgIC8vIHBhcmVudCdzIHVpZCBzbyBhIHNhbWUtc2VsZWN0b3Igc2libGluZyBjYXB0dXJlIGRvZXNuJ3QgZ2V0XG4gICAgICAgIC8vIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBcInRoZSBzYW1lIHRhcmdldFwiIGJ5IHRoZSBjb250ZW50XG4gICAgICAgIC8vIHNjcmlwdCdzIGFubm90YXRpb24gb3ZlcmxheS5cbiAgICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHtcbiAgICAgICAgICBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRUb0NTKHtcbiAgICAgICAgICBraW5kOiAnYW5ub3RhdGlvbicsXG4gICAgICAgICAgc2VsZWN0b3I6IHBhcmVudFNlbCxcbiAgICAgICAgICBwYXlsb2FkOiB7c2VsZWN0b3I6IHBhcmVudFNlbCwgdWlkOiBwYXJlbnRVaWQsIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFjazogW20udGV4dF19LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ30pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGRpdi5kYXRhc2V0LmNvbW1lbnRJZCA9IG0uaWQ7XG4gICAgY29uc3QgYmVnaW5Db21tZW50RHJhZyA9IChlOiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnLCBtLmlkKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCd0ZXh0L3BsYWluJywgbS50ZXh0KTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICB9O1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICBjb25zdCBkcmFnSGFuZGxlID0gYWN0aW9uQnRuKCdncmlwJywgJ0RyYWcgdGhpcyBoYW5kbGUgb250byBhIHNlbGVjdG9yIHRvIHJlcGFyZW50JywgKCkgPT4geyAvKiBkcmFnIGhhbmRsZSBvbmx5ICovIH0pO1xuICAgIGRyYWdIYW5kbGUuY2xhc3NMaXN0LmFkZCgnZHJhZy1oYW5kbGUnKTtcbiAgICBkcmFnSGFuZGxlLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBiZWdpbkNvbW1lbnREcmFnKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkcmFnSGFuZGxlKTtcbiAgICAvLyBEZXRhY2gg4oCUIHRoZSBpbnZlcnNlIG9mIGRyYWctdG8tcmVwYXJlbnQuIE9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZVxuICAgIC8vIGNvbW1lbnQgY3VycmVudGx5IHJlYWRzIGFzIHRocmVhZGVkIChGSyBvciBhZGphY2VuY3kpLlxuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwgfHwgbS5wYXJlbnRVaWQpIHtcbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigndW5saW5rJywgJ0RldGFjaCBmcm9tIGl0cyBjYXB0dXJlIOKAlCBtYWtlIHRoaXMgYSBzdGFuZGFsb25lIGNvbW1lbnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIFJlc29sdmUgYnkgaWQgZnJvbSB0aGUgTElWRSBhcnJheTogd29ya3NwYWNlIHN3aXRjaGVzIGFuZFxuICAgICAgICAvLyB1bmRvL3JlZG8gcmVhc3NpZ24gYG1lc3NhZ2VzYCwgc28gdGhlIGNsb3N1cmUncyBgbWAgY2FuIGJlIGFcbiAgICAgICAgLy8gc3RhbGUgb2JqZWN0IHdob3NlIG11dGF0aW9uIHdvdWxkIGJlIHNpbGVudGx5IGRyb3BwZWQgYnkgdGhlXG4gICAgICAgIC8vIG5leHQgcGVyc2lzdCgpLlxuICAgICAgICBjb25zdCBsaXZlID0gbWVzc2FnZXMuZmluZCgoeCk6IHggaXMgRmVlZGJhY2tNZXNzYWdlID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LmlkID09PSBtLmlkKTtcbiAgICAgICAgaWYgKCFsaXZlKSB7IHNldFN0YXR1cygnQ29tbWVudCBubyBsb25nZXIgZXhpc3RzJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgZGVsZXRlIGxpdmUucGFyZW50VWlkO1xuICAgICAgICBsaXZlLmRldGFjaGVkID0gdHJ1ZTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGRldGFjaGVkIOKAlCBkcmFnIGl0cyBoYW5kbGUgb250byBhIGNhcHR1cmUgdG8gcmVhdHRhY2gnKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjb3B5JywgJ0NvcHkgY29tbWVudCB0ZXh0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQobS50ZXh0KTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNvbW1lbnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncGVuY2lsJywgJ0VkaXQgY29tbWVudCcsICgpID0+IGVudGVyRmVlZGJhY2tFZGl0KGRpdiwgbSksIHtzaXplOiAxNX0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICAvLyBEcm9wIGhhbmRsZXIgc2hhcmVkIGJ5IGV2ZXJ5IHNlbGVjdG9yIGJ1YmJsZS4gQWNjZXB0cyBhIGRyYWdnZWRcbiAgLy8gY29tbWVudCBJRCB2aWEgdGhlIGBhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50YCBNSU1FLCB1cGRhdGVzXG4gIC8vIHBhcmVudFVpZCArIGFkamFjZW5jeSwgcGVyc2lzdHMsIHJlLXJlbmRlcnMuXG4gIGNvbnN0IHdpcmVTZWxlY3RvckRyb3BUYXJnZXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogU2VsZWN0b3JNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVzID0gZS5kYXRhVHJhbnNmZXI/LnR5cGVzO1xuICAgICAgaWYgKCF0eXBlcyB8fCAhQXJyYXkuZnJvbSh0eXBlcykuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnKSkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpKTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChlKSA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKTtcbiAgICAgIGNvbnN0IGlkID0gZS5kYXRhVHJhbnNmZXI/LmdldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnKTtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHNyY0lkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBpZCk7XG4gICAgICBpZiAoc3JjSWR4IDwgMCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc3JjID0gbWVzc2FnZXNbc3JjSWR4XSEgYXMgRmVlZGJhY2tNZXNzYWdlO1xuICAgICAgaWYgKHNyYy50eXBlICE9PSAnZmVlZGJhY2snKSByZXR1cm47XG4gICAgICBjb25zdCBkc3RJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBpZiAoZHN0SWR4IDwgMCkgcmV0dXJuO1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgRksgcG9pbnRlciBmaXJzdCDigJQgdGhhdCdzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggaW5cbiAgICAgIC8vIGV4cG9ydHMuIEFkamFjZW5jeSBpcyBqdXN0IGEgcmVuZGVyIGNvbnZlbmllbmNlLiBSZXBhcmVudGluZyBpc1xuICAgICAgLy8gdGhlIGludmVyc2Ugb2YgZGV0YWNoLCBzbyB0aGUgZGV0YWNoZWQgZmxhZyBpcyBjbGVhcmVkLlxuICAgICAgc3JjLnBhcmVudFVpZCA9IG0uZW50cnkudWlkO1xuICAgICAgZGVsZXRlIHNyYy5kZXRhY2hlZDtcbiAgICAgIC8vIFNwbGljZSBzcmMgb3V0IG9mIGl0cyBjdXJyZW50IHNsb3QgYW5kIHJlLWluc2VydCByaWdodCBhZnRlciB0aGVcbiAgICAgIC8vIG5ldyBwYXJlbnQgKGFuZCBhbnkgZmVlZGJhY2sgYWxyZWFkeSB0cmFpbGluZyBpdCwgc28gdGhlIG1vc3QtXG4gICAgICAvLyByZWNlbnQgZmVlZGJhY2sgZW5kcyB1cCBuZWFyZXN0IHRoZSBwYXJlbnQgdmlzdWFsbHkpLlxuICAgICAgbWVzc2FnZXMuc3BsaWNlKHNyY0lkeCwgMSk7XG4gICAgICBjb25zdCBuZXdEc3RJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBsZXQgaW5zZXJ0QXQgPSBuZXdEc3RJZHggKyAxO1xuICAgICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XSEudHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwgc3JjKTtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IHJlcGFyZW50ZWQnKTtcbiAgICB9KTtcbiAgfTtcblxuICB0eXBlIEFjdGlvbkJ0bk9wdHMgPSB7d2Fybj86IGJvb2xlYW47IHRvZ2dsZWQ/OiBib29sZWFuOyBzaXplPzogbnVtYmVyfTtcbiAgY29uc3QgYWN0aW9uQnRuID0gKGljb246IHN0cmluZywgdGl0bGU6IHN0cmluZywgZm46ICgpID0+IHZvaWQsIG9wdHM6IEFjdGlvbkJ0bk9wdHMgPSB7fSk6IEhUTUxCdXR0b25FbGVtZW50ID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYi50eXBlID0gJ2J1dHRvbic7XG4gICAgYi5kYXRhc2V0LnRpcCA9IHRpdGxlO1xuICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGl0bGUpO1xuICAgIGlmIChvcHRzLndhcm4pIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGlmIChvcHRzLnRvZ2dsZWQpIGIuY2xhc3NMaXN0LmFkZCgndG9nZ2xlZCcpO1xuICAgIC8vIERlZmF1bHQgaWNvbiBzaXplIDEzIHJlYWRzIHNsaWdodGx5IHNtYWxsIGluIGEgMjLDlzIyIGJ1dHRvbiDigJQgZmluZVxuICAgIC8vIGZvciBpY29ucyB3aXRoIHNpbXBsZSBzaGFwZXMgKGNyb3NzaGFpciwgbGlzdC10cmVlLCB1bmRvKSBidXQgdmlzaWJseVxuICAgIC8vIHNxdWVlemVkIGZvciBgbWVzc2FnZS1zcXVhcmUtcGx1c2AgYW5kIGBwZW5jaWxgLCB3aGVyZSB0aGVcbiAgICAvLyBpbnRlcmlvciBzdHJva2VzIHZhbmlzaCBpbnRvIGhhaXJsaW5lIGJsdXIuIENhbGxlcnMgY2FuIGJ1bXAgd2l0aFxuICAgIC8vIGBzaXplOiAxNWAgZm9yIHRob3NlLlxuICAgIGIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKGljb24sIG9wdHMuc2l6ZSA/PyAxMyk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGZuKCk7IH0pO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUJ0biA9IChvbkNvbmZpcm06ICgpID0+IHZvaWQpOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGIuZGF0YXNldC50aXAgPSAnRGVsZXRlJztcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdEZWxldGUgY2FwdHVyZScpO1xuICAgIGIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgIGxldCBwYXJlbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJldmVydFRpbWVyID0gMDtcbiAgICBjb25zdCByZXZlcnQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBhcmVudCkgcmV0dXJuO1xuICAgICAgZm9yIChjb25zdCBuIG9mIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29uZmlybS15ZXMsIC5jb25maXJtLW5vJykpIG4ucmVtb3ZlKCk7XG4gICAgICBpZiAoIWIucGFyZW50RWxlbWVudCkgcGFyZW50LmFwcGVuZChiKTtcbiAgICAgIGNsZWFyVGltZW91dChyZXZlcnRUaW1lcik7XG4gICAgfTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBwYXJlbnQgPSBiLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCB5ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIHllcy50eXBlID0gJ2J1dHRvbic7XG4gICAgICB5ZXMuY2xhc3NOYW1lID0gJ2NvbmZpcm0teWVzJztcbiAgICAgIHllcy5kYXRhc2V0LnRpcCA9ICdDb25maXJtIGRlbGV0ZSc7XG4gICAgICB5ZXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NvbmZpcm0gZGVsZXRlJyk7XG4gICAgICB5ZXMuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGVjaycsIDEzKTtcbiAgICAgIHllcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4geyBldi5zdG9wUHJvcGFnYXRpb24oKTsgcmV2ZXJ0KCk7IG9uQ29uZmlybSgpOyB9KTtcbiAgICAgIGNvbnN0IG5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBuby50eXBlID0gJ2J1dHRvbic7XG4gICAgICBuby5jbGFzc05hbWUgPSAnY29uZmlybS1ubyc7XG4gICAgICBuby5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgZGVsZXRlJztcbiAgICAgIG5vLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgZGVsZXRlJyk7XG4gICAgICBuby5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAxMyk7XG4gICAgICBuby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4geyBldi5zdG9wUHJvcGFnYXRpb24oKTsgcmV2ZXJ0KCk7IH0pO1xuICAgICAgYi5yZXBsYWNlV2l0aCh5ZXMpO1xuICAgICAgeWVzLmFmdGVyKG5vKTtcbiAgICAgIHJldmVydFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQocmV2ZXJ0LCA4MDAwKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBlbnRlckZlZWRiYWNrRWRpdCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBGZWVkYmFja01lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmV4dC5jbGFzc05hbWUgPSAnbXNnIGZlZWRiYWNrIGVkaXRpbmcnO1xuICAgIGlmIChkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aHJlYWRlZCcpKSBuZXh0LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgbmV4dC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBuZXh0LmFwcGVuZChidWlsZElubGluZUNvbW1lbnQoe1xuICAgICAgaW5pdGlhbDogbS50ZXh0LFxuICAgICAgb25DYW5jZWw6ICgpID0+IHsgZGl2LnJlcGxhY2VXaXRoKGRpdi5jbG9uZU5vZGUodHJ1ZSkpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4ge1xuICAgICAgICBjb25zdCB0cmltbWVkID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRyaW1tZWQgPT09IG0udGV4dCkgeyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG0udGV4dCA9IHRyaW1tZWQ7XG4gICAgICAgIC8vIFNldmVyaXR5IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgVUkuIFN0cmlwIGFueSBsZWdhY3kgdmFsdWVcbiAgICAgICAgLy8gdGhhdCBjYW1lIGJhY2sgZnJvbSBhbiBvbGRlciBKU09OTCBpbXBvcnQgc28gc2F2ZXMgZG9uJ3Qga2VlcFxuICAgICAgICAvLyByZS1lbWl0dGluZyBpdC5cbiAgICAgICAgZGVsZXRlIChtIGFzIGFueSkuc2V2ZXJpdHk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgIH0pKTtcbiAgICBkaXYucmVwbGFjZVdpdGgobmV4dCk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlTWVzc2FnZSA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgY29uc3QgZmluaXNoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmlkICE9PSBpZCk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnRGVsZXRlZCcpO1xuICAgIH07XG4gICAgaWYgKCFlbCkgeyBmaW5pc2goKTsgcmV0dXJuOyB9XG4gICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICB2b2lkIGVsLm9mZnNldFdpZHRoO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3JlbW92aW5nJyk7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBjbGVhbnVwID0gKCk6IHZvaWQgPT4geyBpZiAoZG9uZSkgcmV0dXJuOyBkb25lID0gdHJ1ZTsgZmluaXNoKCk7IH07XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGNsZWFudXAsIHtvbmNlOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dChjbGVhbnVwLCAzODApO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBDb21wb3NlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZEZlZWRiYWNrID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBjb21wb3Nlci52YWx1ZS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIGluLW1lbW9yeSBtZXNzYWdlIGF0IGNyZWF0aW9uIHRpbWUgc28gdGhlXG4gICAgLy8gRksgaXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGguIFRoZSBzbGltIGVtaXQgbm8gbG9uZ2VyIGhhcyB0b1xuICAgIC8vIGluZmVyIHRoZSBwYXJlbnQgZnJvbSBjYXB0dXJlLWFkamFjZW5jeSwgYW5kIGBtYW5pZmVzdC5jb3VudHNgXG4gICAgLy8gYWNjdXJhdGVseSByZWZsZWN0cyBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycy5cbiAgICAvLyBXYWxrIGJhY2sgdG8gdGhlIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yIGJlZm9yZSBzcGxpY2UuXG4gICAgbGV0IHBJZHggPSBwb3NpdGlvbiAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9KTtcbiAgICBjb21wb3Nlci52YWx1ZSA9ICcnO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICAvLyBTZW5kaW5nIGNsZWFycyBhbnkgYWN0aXZlIHZpc3VhbCBmaW5kIHNvIHRoZSBuZXcgY29tbWVudCBpc24ndCBoaWRkZW5cbiAgICAvLyBiZWhpbmQgYSBzdGFsZSBmaWx0ZXIuXG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSBjbG9zZUZpbmQoKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdTZW50Jyk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAvLyBCdWcgIzI6IGZlZWRiYWNrJ3MgcGFyZW50IHNob3VsZCBoYXZlIGEgc2NyZWVuc2hvdC5cbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InICYmICFwYXJlbnQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgdm9pZCBmaXJlRWxlbWVudFNob3QocGFyZW50IGFzIFNlbGVjdG9yTWVzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyAoZSkgPT4ge1xuICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYW5kbGVkID0gYXdhaXQgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlcigpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBzZW5kRmVlZGJhY2soKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyAmJiBpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgc2V0U3RhdHVzKCdJbnNlcnQgbW9kZSBjYW5jZWxsZWQnKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCB1cGRhdGVDb21wb3Nlck1ldGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHQgPSBjb21wb3Nlci52YWx1ZTtcbiAgICBjb21wV29yZHMudGV4dENvbnRlbnQgPSBTdHJpbmcod29yZENvdW50KHQpKTtcbiAgICBjb21wVG9rZW5zLnRleHRDb250ZW50ID0gU3RyaW5nKHRva2VuQ291bnQodCkpO1xuICAgIGNvbXBvc2VyLmNsYXNzTGlzdC50b2dnbGUoJ2NtZC1tb2RlJywgL14+Ly50ZXN0KHQudHJpbSgpKSk7XG4gIH07XG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdXBkYXRlQ29tcG9zZXJNZXRlcik7XG5cbiAgLy8g4pSA4pSAIEhlYWRlciBzZWFyY2gg4oaSIGNvbW1hbmQgcGFsZXR0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gVGhlIGhlYWRlciBzZWFyY2ggYWZmb3JkYW5jZSBubyBsb25nZXIgcnVucyBpdHMgb3duIGZpbHRlcjsgY2xpY2tpbmcgb3JcbiAgLy8gZm9jdXNpbmcgaXQgb3BlbnMgdGhlIENtZCtLIGNvbW1hbmQgcGFsZXR0ZSAod2hpY2ggc2VhcmNoZXMgY2FwdHVyZXMgQU5EXG4gIC8vIHJ1bnMgY29tbWFuZHMpLiBJdCdzIGEgcmVhZG9ubHkgdHJpZ2dlciwgc28gd2UganVzdCBvcGVuIHRoZSBwYWxldHRlIGFuZFxuICAvLyBkcm9wIGZvY3VzIHNvIHRoZSBwYWxldHRlIGlucHV0IHRha2VzIG92ZXIgY2xlYW5seS5cbiAgY29uc3QgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGFsZXR0ZS5oaWRkZW4pIHJldHVybjtcbiAgICBvcGVuUGFsZXR0ZSgpO1xuICAgIHNlYXJjaC5ibHVyKCk7XG4gIH07XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCk7XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCk7XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCgpOyB9XG4gIH0pO1xuXG4gIC8vIOKUgOKUgCBDdHJsK0YgdmlzdWFsIGZpbmQgKGluLWxpc3QgZmlsdGVyICsgaGlnaGxpZ2h0KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2Nyb2xsRmlyc3RGaW5kSGl0SW50b1ZpZXcgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBjb25zdCBmaXJzdEhpdCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cuc2VsZWN0b3Iuc2VhcmNoLWhpdCcpO1xuICAgICAgaWYgKGZpcnN0SGl0KSB7XG4gICAgICAgIGNlbnRlckVsZW1lbnRJbkxpc3QoZmlyc3RIaXQpO1xuICAgICAgICBjb25zdCBtayA9IGZpcnN0SGl0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdtYXJrJyk7XG4gICAgICAgIGlmIChtaykgY2VudGVyRWxlbWVudEluTGlzdChtayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmaXJzdE1hdGNoID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZyBtYXJrJyk7XG4gICAgICAgIGlmIChmaXJzdE1hdGNoKSBjZW50ZXJFbGVtZW50SW5MaXN0KGZpcnN0TWF0Y2gpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBjb25zdCB1cGRhdGVGaW5kQ291bnQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFmaW5kQ291bnQpIHJldHVybjtcbiAgICBmaW5kQ291bnQudGV4dENvbnRlbnQgPSBzZWFyY2hRdWVyeSA/IGAke2xpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZycpLmxlbmd0aH0gbWF0Y2hgIDogJyc7XG4gIH07XG4gIGNvbnN0IGFwcGx5RmluZCA9ICh2YWx1ZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgc2VhcmNoUXVlcnkgPSB2YWx1ZS50cmltKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgdXBkYXRlRmluZENvdW50KCk7XG4gICAgc2Nyb2xsRmlyc3RGaW5kSGl0SW50b1ZpZXcoKTtcbiAgfTtcbiAgY29uc3Qgb3BlbkZpbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFmaW5kQmFyIHx8ICFmaW5kSW5wdXQpIHJldHVybjtcbiAgICBmaW5kQmFyLmhpZGRlbiA9IGZhbHNlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbCcpPy5jbGFzc0xpc3QuYWRkKCdmaW5kLW9wZW4nKTtcbiAgICBmaW5kSW5wdXQuZm9jdXMoKTtcbiAgICBmaW5kSW5wdXQuc2VsZWN0KCk7XG4gIH07XG4gIGNvbnN0IGNsb3NlRmluZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoZmluZEJhcikgZmluZEJhci5oaWRkZW4gPSB0cnVlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbCcpPy5jbGFzc0xpc3QucmVtb3ZlKCdmaW5kLW9wZW4nKTtcbiAgICBpZiAoZmluZElucHV0KSBmaW5kSW5wdXQudmFsdWUgPSAnJztcbiAgICBpZiAoc2VhcmNoUXVlcnkpIHsgc2VhcmNoUXVlcnkgPSAnJzsgcmVuZGVyKCk7IH1cbiAgICB1cGRhdGVGaW5kQ291bnQoKTtcbiAgfTtcbiAgZmluZElucHV0Py5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IGFwcGx5RmluZChmaW5kSW5wdXQudmFsdWUpKTtcbiAgZmluZElucHV0Py5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHsgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGNsb3NlRmluZCgpOyB9IH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maW5kLWNsZWFyXScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRmluZCk7XG5cbiAgY29uc3QgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlciA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICBjb25zdCBtID0gL14+XFxzKiguKykkLy5leGVjKGNvbXBvc2VyLnZhbHVlLnRyaW0oKSk7XG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3Qgc2VsID0gbVsxXSEudHJpbSgpO1xuICAgIGlmICghc2VsKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e29rOiBib29sZWFufT4oe2tpbmQ6ICdtYW51YWwtY2FwdHVyZScsIHNlbGVjdG9yOiBzZWx9KTtcbiAgICBpZiAocmVwbHk/Lm9rKSB7IGNvbXBvc2VyLnZhbHVlID0gJyc7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgc2V0U3RhdHVzKCdDYXB0dXJlZCAnICsgc2VsKTsgfVxuICAgIGVsc2Ugc2V0U3RhdHVzKCdTZWxlY3RvciBkaWQgbm90IG1hdGNoOiAnICsgc2VsLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydCBidWlsZGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gdjIgZXhwb3J0IHNoYXBlOiB0b3AgbGV2ZWwga2VlcHMgdXNlci1mYWNpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzXG4gIC8vICh1aWQsIG4sIHNlbGVjdG9yLCB0ZXh0LCByb2xlLCBhdHRycywgaGludHMsIGNsYXNzZXMsIHN0eWxlcywgY29tcG9uZW50LFxuICAvLyBzdGF0ZXMsIHNjcmVlbnNob3QsIGdyb3VwKS4gRGlhZ25vc3RpYyAvIGRldGVjdGlvbiBtZXRhZGF0YSBtb3ZlcyB1bmRlclxuICAvLyBhbiBgX2F1ZGl0YCBuYW1lc3BhY2UgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwgaW5TaGFkb3dET00sXG4gIC8vIHBzZXVkb0VsZW1lbnRzLCBtYXRjaGVkUnVsZXMsIHZpZXdwb3J0KS4gVGhlIHZlcnNpb24gbWFya2VyIGlzIGVtaXR0ZWRcbiAgLy8gYXMgYHY6IDJgLiBJbXBvcnRlcnMgZGV0ZWN0IGVpdGhlciB2MSAoZmxhdCkgb3IgdjIgYW5kIGRlbm9ybWFsaXplLlxuICAvL1xuICAvLyBBZ2dyZXNzaXZlIG1pbmlmeSBhZGRpdGlvbmFsbHkgZHJvcHMgZmllbGRzIHRoZSBzZWxlY3RvciBhbHJlYWR5XG4gIC8vIGltcGxpZXM6IGFuY2VzdG9ycywgdmlld3BvcnQgKG9uZSBwZXIgcGFnZSksIGNvbXBvbmVudFJvb3Qgd2hlblxuICAvLyByZWR1bmRhbnQgd2l0aCB0aGUgc2VsZWN0b3IsIGFuZCBwc2V1ZG9FbGVtZW50cy5cbiAgY29uc3Qgc2xpbUVudHJ5ID0gKGU6IEVudHJ5LCBvcHRzOiB7aW5jbHVkZUdyb3VwPzogYm9vbGVhbjsgZXZlbnRJbmRleD86IG51bWJlcjsgdmlzdWFsT3JkZXI/OiBudW1iZXI7IGdyb3VwVWlkPzogc3RyaW5nfSA9IHt9KTogUmVjb3JkPHN0cmluZywgYW55PiA9PiB7XG4gICAgY29uc3QgaW5jbHVkZU91dGVyID0gcHJlZnMuaW5jbHVkZU91dGVySFRNTDtcbiAgICBjb25zdCBpbmNsdWRlTWF0Y2hlZCA9IHByZWZzLmluY2x1ZGVNYXRjaGVkUnVsZXM7XG4gICAgY29uc3QgaW5jbHVkZVN0eWxlcyA9IHByZWZzLmluY2x1ZGVTdHlsZXM7XG4gICAgY29uc3QgbWluaWZ5ID0gcHJlZnMubWluaWZ5O1xuXG4gICAgLy8gVG9wLWxldmVsIHVzZXItZmFjaW5nIGZpZWxkcy4gT3JkZXIgbWF0dGVycyBmb3Igb3V0cHV0IHJlYWRhYmlsaXR5IOKAlFxuICAgIC8vIHdlIHdhbnQgYHYgLyB0eXBlIC8gdWlkIC8gbiAvIHNlbGVjdG9yYCBmaXJzdCBzbyBKU09OTCBpcyBncmVwcGFibGUuXG4gICAgLy9cbiAgICAvLyBgbmAgc3RheXMgYXMgdGhlIGNhcHR1cmUtc2VxdWVuY2UgZGlzcGxheSBsYWJlbCBmb3IgYmFja3dhcmRzXG4gICAgLy8gY29tcGF0aWJpbGl0eSB3aXRoIHYxL3YyIHJlYWRlcnMgKGFuZCB0aGUgc2lkZWJhcidzIFwiIzNcIiBjaGlwcykuXG4gICAgLy8gVGhlIGRpc2FtYmlndWF0ZWQgY291c2lucyAoYGNhcHR1cmVJbmRleGAsIGBldmVudEluZGV4YCxcbiAgICAvLyBgdmlzdWFsT3JkZXJgLCBgZGlzcGxheUxhYmVsYCkgbGl2ZSBvbiB0aGUgcm93IHNvIGEgZG93bnN0cmVhbVxuICAgIC8vIGFnZW50IGNhbiBwaWNrIHdoaWNoZXZlciBvcmRlcmluZyBpcyBtZWFuaW5nZnVsIOKAlCBidWcgIzEwLlxuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHY6IDIsXG4gICAgICB0eXBlOiAnc2VsZWN0b3InLFxuICAgICAgdWlkOiBlLnVpZCxcbiAgICAgIG46IGUubixcbiAgICAgIHRzOiBlLnRzLFxuICAgICAgdXJsOiBlLnVybCxcbiAgICAgIHRhZzogZS50YWcsXG4gICAgICBzZWxlY3RvcjogZS5zZWxlY3RvcixcbiAgICAgIGNhcHR1cmVJbmRleDogZS5uLFxuICAgICAgZGlzcGxheUxhYmVsOiBTdHJpbmcoZS5uKSxcbiAgICB9O1xuICAgIGlmIChvcHRzLmV2ZW50SW5kZXggIT09IHVuZGVmaW5lZCkgb3V0LmV2ZW50SW5kZXggPSBvcHRzLmV2ZW50SW5kZXg7XG4gICAgaWYgKG9wdHMudmlzdWFsT3JkZXIgIT09IHVuZGVmaW5lZCkgb3V0LnZpc3VhbE9yZGVyID0gb3B0cy52aXN1YWxPcmRlcjtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS50ZXh0ICE9PSB1bmRlZmluZWQpIG91dC50ZXh0ID0gbWluaWZ5ID8gZS50ZXh0LnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLnRleHQ7XG4gICAgaWYgKGUucm9sZSAhPT0gdW5kZWZpbmVkKSBvdXQucm9sZSA9IGUucm9sZTtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSAhPT0gdW5kZWZpbmVkKSBvdXQuYWNjZXNzaWJsZU5hbWUgPSBtaW5pZnkgPyBlLmFjY2Vzc2libGVOYW1lLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLmFjY2Vzc2libGVOYW1lO1xuICAgIGlmIChlLmlkICE9PSB1bmRlZmluZWQpIG91dC5pZCA9IGUuaWQ7XG4gICAgaWYgKGUudGVzdElkICE9PSB1bmRlZmluZWQpIG91dC50ZXN0SWQgPSBlLnRlc3RJZDtcbiAgICBpZiAoZS5jbGFzc2VzICYmIGUuY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIG91dC5jbGFzc2VzID0gKG1pbmlmeSAmJiBlLmNsYXNzZXMubGVuZ3RoID4gOCkgPyBlLmNsYXNzZXMuc2xpY2UoMCwgOCkgOiBlLmNsYXNzZXM7XG4gICAgfVxuICAgIGlmIChlLmF0dHJzICYmIE9iamVjdC5rZXlzKGUuYXR0cnMpLmxlbmd0aCkgb3V0LmF0dHJzID0gZS5hdHRycztcbiAgICBpZiAoZS5oaW50cyAmJiBPYmplY3Qua2V5cyhlLmhpbnRzKS5sZW5ndGgpIG91dC5oaW50cyA9IGUuaGludHM7XG4gICAgaWYgKGUucmVjdCkgb3V0LnJlY3QgPSBlLnJlY3Q7XG4gICAgaWYgKGUuc3RhdGVzICYmIGUuc3RhdGVzLmxlbmd0aCkgb3V0LnN0YXRlcyA9IGUuc3RhdGVzO1xuICAgIGlmIChlLmNvbXBvbmVudCkgb3V0LmNvbXBvbmVudCA9IGUuY29tcG9uZW50O1xuICAgIC8vIExvY2F0b3ItcXVhbGl0eSBmaWVsZC4gUHJvbW90ZSBldmVuIHdoZW4gbWluaWZpZWQg4oCUIGl0J3MgYSBzaW5nbGVcbiAgICAvLyBzbWFsbCBpbnQgYW5kIGEgZG93bnN0cmVhbSBhZ2VudCB1c2VzIGl0IHRvIGRlY2lkZSB3aGV0aGVyIHRvXG4gICAgLy8gdHJ1c3QgdGhlIHNlbGVjdG9yLlxuICAgIGlmIChlLnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSBvdXQuc2VsZWN0b3JNYXRjaENvdW50ID0gZS5zZWxlY3Rvck1hdGNoQ291bnQ7XG4gICAgaWYgKGUuYTExeSkgb3V0LmExMXkgPSBlLmExMXk7XG4gICAgaWYgKGUuYXNzZXRzICYmIGUuYXNzZXRzLmxlbmd0aCkgb3V0LmFzc2V0cyA9IGUuYXNzZXRzO1xuICAgIGlmIChlLmxheW91dENvbnRleHQgJiYgZS5sYXlvdXRDb250ZXh0Lmxlbmd0aCkgb3V0LmxheW91dENvbnRleHQgPSBlLmxheW91dENvbnRleHQ7XG4gICAgaWYgKGluY2x1ZGVPdXRlciAmJiBlLm91dGVySFRNTCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXQub3V0ZXJIVE1MID0gbWluaWZ5ID8gZS5vdXRlckhUTUwucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUub3V0ZXJIVE1MO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZVN0eWxlcyAmJiBlLnN0eWxlcyAmJiBPYmplY3Qua2V5cyhlLnN0eWxlcykubGVuZ3RoKSBvdXQuc3R5bGVzID0gZS5zdHlsZXM7XG4gICAgaWYgKGUuc2NyZWVuc2hvdCkge1xuICAgICAgLy8gUGF0aCBub3JtYWxpemF0aW9uOiB0aGUgbGl2ZSBgZW50cnkuc2NyZWVuc2hvdC5lbGVtZW50YCBjYXJyaWVzIGFcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXhlZCBwYXRoIChlLmcuIGBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmdgKVxuICAgICAgLy8gYmVjYXVzZSB0aGUgYmFja2dyb3VuZCdzIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgQVBJIHN0YW1wc1xuICAgICAgLy8gdGhlIHdvcmtzcGFjZSBpbnRvIHRoZSBvbi1kaXNrIHBhdGguIEJ1dCB0aGUgLnRhci56c3QgYXJjaGl2ZVxuICAgICAgLy8gYnVuZGxlcyBzY3JlZW5zaG90cyBmbGF0IGF0IGBzY3JlZW5zaG90cy9mb28ucG5nYCwgc28gdGhlXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4IHdvdWxkIHJlc29sdmUgdG8gbm90aGluZyBmb3IgYW4gYWdlbnQgdGhhdFxuICAgICAgLy8gZXh0cmFjdGVkIHRoZSBhcmNoaXZlLiBTdHJpcCB0aGUgd29ya3NwYWNlIHByZWZpeCBvbiBlbWl0IHNvXG4gICAgICAvLyBldmVyeSBwYXRoIGlzIHZhbGlkIHJlbGF0aXZlIHRvIHRoZSBtYW5pZmVzdCdzIGRlY2xhcmVkXG4gICAgICAvLyBgcGF0aFJvb3RgIChhcmNoaXZlIHJvb3QgZm9yIHRhci56c3Q7IHdvcmtzcGFjZSByb290IGZvciBwbGFpblxuICAgICAgLy8gSlNPTkwg4oCUIGkuZS4sIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gKS5cbiAgICAgIGNvbnN0IHN0cmlwV3MgPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgaWYgKCFwKSByZXR1cm4gcDtcbiAgICAgICAgLy8gU3RyaXAgZXhhY3RseSBvbmUgbGVhZGluZyBgPHdvcmtzcGFjZT4vYCBzZWdtZW50IGlmIHByZXNlbnQuXG4gICAgICAgIGNvbnN0IHdzUHJlZml4ID0gYCR7YWN0aXZlV3N9L2A7XG4gICAgICAgIHJldHVybiBwLnN0YXJ0c1dpdGgod3NQcmVmaXgpID8gcC5zbGljZSh3c1ByZWZpeC5sZW5ndGgpIDogcDtcbiAgICAgIH07XG4gICAgICBvdXQuc2NyZWVuc2hvdCA9IHsuLi5lLnNjcmVlbnNob3R9O1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpIG91dC5zY3JlZW5zaG90LmVsZW1lbnQgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90Lmdyb3VwKSBvdXQuc2NyZWVuc2hvdC5ncm91cCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZ3JvdXApO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LnBhZ2UpIG91dC5zY3JlZW5zaG90LnBhZ2UgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LnBhZ2UpO1xuICAgIH1cbiAgICAvLyBQcm9tb3RlIHJ1bnRpbWUvYmVoYXZpb3Igc2lnbmFscyB0byB0b3AtbGV2ZWwuIFRoZXNlIGFyZSBwcmltYXJ5XG4gICAgLy8gc2lnbmFsIGZvciB0cmlhZ2UgKGV2ZW50cyB0ZWxscyBcIndoaWNoIGhhbmRsZXIgcmFuXCIsIGJlaGF2aW9yQXR0cnNcbiAgICAvLyB0ZWxscyBcIndoYXQgc2VydmVyLXJlbmRlcmVkIGJpbmRpbmcgZG9lcyB0aGlzIGZpcmVcIiwgY2FudmFzQ2xpY2tcbiAgICAvLyB0ZWxscyBcIndoZXJlIG9uIHRoZSBjaGFydCB3YXMgY2xpY2tlZFwiLCBlZGl0b3IgdGVsbHMgXCJ3aGljaFxuICAgIC8vIHJpY2gtdGV4dCBsaWJyYXJ5IHdyYXBzIHRoaXNcIiwgZG9tTXV0YXRpb25zIHRlbGxzIFwid2hhdCBjaGFuZ2VkXG4gICAgLy8gYmVmb3JlIHRoZSBjbGlja1wiLCBpc0FuaW1hdGluZyB3YXJucyBhYm91dCB0cmFuc2llbnQgc3RhdGUpLlxuICAgIGlmIChlLmV2ZW50cyAmJiBPYmplY3Qua2V5cyhlLmV2ZW50cykubGVuZ3RoKSBvdXQuZXZlbnRzID0gZS5ldmVudHM7XG4gICAgaWYgKGUuYmVoYXZpb3JBdHRycyAmJiBPYmplY3Qua2V5cyhlLmJlaGF2aW9yQXR0cnMpLmxlbmd0aCkgb3V0LmJlaGF2aW9yQXR0cnMgPSBlLmJlaGF2aW9yQXR0cnM7XG4gICAgaWYgKGUuY2FudmFzQ2xpY2spIG91dC5jYW52YXNDbGljayA9IGUuY2FudmFzQ2xpY2s7XG4gICAgaWYgKGUuZWRpdG9yKSBvdXQuZWRpdG9yID0gZS5lZGl0b3I7XG4gICAgaWYgKGUuaXNBbmltYXRpbmcpIG91dC5pc0FuaW1hdGluZyA9IHRydWU7XG4gICAgaWYgKGUuc2hhZG93SG9zdCkgb3V0LnNoYWRvd0hvc3QgPSBlLnNoYWRvd0hvc3Q7XG4gICAgaWYgKGUucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIG91dC5yZW5kZXJlZFRleHQgPSBlLnJlbmRlcmVkVGV4dDtcbiAgICBpZiAoZS50cnVuY2F0ZWQgJiYgT2JqZWN0LmtleXMoZS50cnVuY2F0ZWQpLmxlbmd0aCkgb3V0LnRydW5jYXRlZCA9IGUudHJ1bmNhdGVkO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLmRvbU11dGF0aW9ucyAmJiBlLmRvbU11dGF0aW9ucy5sZW5ndGgpIG91dC5kb21NdXRhdGlvbnMgPSBlLmRvbU11dGF0aW9ucztcblxuICAgIC8vIF9hdWRpdDogZGV0ZWN0aW9uIGNoYWluICYgZGlhZ25vc3RpYyBzaGFwZS5cbiAgICAvLyBSRUFETUUgY2xhaW1lZCBgX2F1ZGl0LmFuY2VzdG9yc2AgYW5kIGBfYXVkaXQuY29tcG9uZW50Um9vdGAgd2VyZVxuICAgIC8vIGFsd2F5cyBwcmVzZW50LCBidXQgdGhlIHNsaW0gZW1pdCBkcm9wcGVkIHRoZW0gd2hlbmV2ZXJcbiAgICAvLyBgbWluaWZ5OiB0cnVlYC4gVGhlIGZpeDogZW1pdCBldmVyeSBkZWNsYXJlZCBgX2F1ZGl0YCBmaWVsZFxuICAgIC8vIHdoZW5ldmVyIHRoZSBzb3VyY2UgZGF0YSBleGlzdHMsIGFuZCBsZXRcbiAgICAvLyBgbWluaWZ5YCBzbGltIE9OTFkgdGhlIGhpZ2gtdm9sdW1lIGJsb2NrcyAobWF0Y2hlZFJ1bGVzLFxuICAgIC8vIHBzZXVkb0VsZW1lbnRzKS4gU21hbGwgc3RydWN0dXJhbCBtZXRhZGF0YSAoYW5jZXN0b3JzLFxuICAgIC8vIGNvbXBvbmVudFJvb3QsIHZpZXdwb3J0KSBzdXJ2aXZlcyBtaW5pZnkgc28gdGhlIHNjaGVtYSBjbGFpbXNcbiAgICAvLyBzdGF5IGhvbmVzdC5cbiAgICBjb25zdCBhdWRpdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChlLmFuY2VzdG9ycyAmJiBlLmFuY2VzdG9ycy5sZW5ndGgpIGF1ZGl0LmFuY2VzdG9ycyA9IGUuYW5jZXN0b3JzO1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgYXVkaXQuY29tcG9uZW50Um9vdCA9IGUuY29tcG9uZW50Um9vdDtcbiAgICBpZiAoZS5pblNoYWRvd0RPTSkgYXVkaXQuaW5TaGFkb3dET00gPSB0cnVlO1xuICAgIGlmIChlLnBzZXVkb0VsZW1lbnRzICYmIE9iamVjdC5rZXlzKGUucHNldWRvRWxlbWVudHMpLmxlbmd0aCAmJiAhbWluaWZ5KSBhdWRpdC5wc2V1ZG9FbGVtZW50cyA9IGUucHNldWRvRWxlbWVudHM7XG4gICAgaWYgKGluY2x1ZGVNYXRjaGVkICYmIGUubWF0Y2hlZFJ1bGVzICYmIGUubWF0Y2hlZFJ1bGVzLmxlbmd0aCkge1xuICAgICAgYXVkaXQubWF0Y2hlZFJ1bGVzID0gbWluaWZ5XG4gICAgICAgID8gZS5tYXRjaGVkUnVsZXMubWFwKChyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcjI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7c2VsZWN0b3I6IHIuc2VsZWN0b3J9O1xuICAgICAgICAgIGlmIChyLmRlY2xhcmF0aW9ucyAmJiBPYmplY3Qua2V5cyhyLmRlY2xhcmF0aW9ucykubGVuZ3RoKSByMi5kZWNsYXJhdGlvbnMgPSByLmRlY2xhcmF0aW9ucztcbiAgICAgICAgICBpZiAoci5tZWRpYSkgcjIubWVkaWEgPSByLm1lZGlhO1xuICAgICAgICAgIHJldHVybiByMjtcbiAgICAgICAgfSlcbiAgICAgICAgOiBlLm1hdGNoZWRSdWxlcztcbiAgICB9XG4gICAgaWYgKGUudmlld3BvcnQpIGF1ZGl0LnZpZXdwb3J0ID0gZS52aWV3cG9ydDtcbiAgICBpZiAoT2JqZWN0LmtleXMoYXVkaXQpLmxlbmd0aCkgb3V0Ll9hdWRpdCA9IGF1ZGl0O1xuXG4gICAgLy8gR3JvdXAgaGVhZCBsaW5rYWdlLiBQcmV2aW91c2x5IHRoZSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYFxuICAgIC8vIGNhcnJpZWQgZnVsbCBuZXN0ZWQgZW50cnkgb2JqZWN0cy5cbiAgICAvLyBUaGF0IG1hZGUgRHVja0RCIGpvaW5zIHVnbHkgYW5kIGJyb2tlIHRoZSBydWxlIHRoYXQgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBzaG91bGQgYmUgYSB0b3AtbGV2ZWwgcm93LiBXZSBub3cgZW1pdDpcbiAgICAvLyAgIOKAoiBvbiB0aGUgZ3JvdXAgaGVhZDogYGdyb3VwTWVtYmVyVWlkczogW3VpZCwgdWlkLCAuLi5dYCAoanVzdCBJRHMpXG4gICAgLy8gICDigKIgZWFjaCBtZW1iZXIgYXMgaXRzIG93biB0b3AtbGV2ZWwgc2xpbSByb3cgd2l0aCBgZ3JvdXBVaWRgXG4gICAgLy8gICAgIHBvaW50aW5nIGJhY2sgYXQgdGhlIGhlYWQgKGhhbmRsZWQgaW4gYGJ1aWxkU2xpbWAgZmx1c2ggbG9naWMpLlxuICAgIGlmIChvcHRzLmluY2x1ZGVHcm91cCAmJiBlLmdyb3VwICYmIGUuZ3JvdXAubGVuZ3RoKSB7XG4gICAgICBvdXQuZ3JvdXBNZW1iZXJVaWRzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuICAgIGlmIChvcHRzLmdyb3VwVWlkKSBvdXQuZ3JvdXBVaWQgPSBvcHRzLmdyb3VwVWlkO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIFNoYXJlZCBcInNsaW0gZGF0YVwiIHBpcGVsaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBKU09OTCByZW5kZXJzIG9mZiB0aGlzIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvbi4gKE1hcmtkb3duIHVzZWQgdG9cbiAgLy8gc2hhcmUgaXQ7IHRoZSBNYXJrZG93biBleHBvcnQgd2FzIHJldGlyZWQgaW4gZmF2b3Igb2YgSlNPTkwtb25seS4pXG4gIC8vXG4gIC8vIHYyIGRpZmZlcmVuY2VzIHZzIHYxOlxuICAvLyAgIOKAoiBTZWxlY3RvciBsaW5lcyBoYXZlIGV4cGxpY2l0IGB0eXBlOiAnc2VsZWN0b3InYCBhbmQgYHY6IDJgLlxuICAvLyAgIOKAoiBfYXVkaXQgbmVzdHMgZGV0ZWN0aW9uIC8gZGVidWcgZmllbGRzIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIOKApikuXG4gIC8vICAg4oCiIEZlZWRiYWNrIGVtaXRzIGFzIHN0YW5kYWxvbmUgYHt0eXBlOidmZWVkYmFjaycsIHBhcmVudFVpZCwg4oCmfWAgbGluZXNcbiAgLy8gICAgIFBMVVMgYnVuZGxlZCBgZmVlZGJhY2tgIGFycmF5cyBvbiBzZWxlY3RvcnMgKHNvIG9sZCBzaW5nbGUtbGluZVxuICAvLyAgICAgcmVhZGVycyBzdGlsbCBzZWUgdGhlbSBhZGphY2VudCkuXG4gIC8vICAg4oCiIEEgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGNhcnJpZXMgd29ya3NwYWNlICsgY291bnRzICsgZmlsZW5hbWUuXG4gIHR5cGUgU2xpbVBhZ2UgPSB7djogMjsgdHlwZTogJ3BhZ2UnOyB0czogc3RyaW5nOyB1cmw6IHN0cmluZzsgdGl0bGU/OiBzdHJpbmc7IHZpZXdwb3J0PzogVmlld3BvcnQ7IHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IHVzZXJBZ2VudD86IHN0cmluZzsgbGFuZz86IHN0cmluZzsgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9OyByb3V0ZT86IGFueTsgc3RhdGU/OiBhbnk7IHNlc3Npb25JZD86IHN0cmluZzsgc25hcHNob3Q/OiBQYWdlU25hcHNob3R9O1xuICAvLyBTZXZlcml0eSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSAoMjAyNi0wNSkuIFRvbGVyYW50IHJlYWRlcnMgbWF5IHN0aWxsXG4gIC8vIHNlZSBgc2V2ZXJpdHlgIG9uIGxlZ2FjeSBKU09OTCDigJQgZGVub3JtYWxpemVFbnRyeSBwcmVzZXJ2ZXMgaXQgb25cbiAgLy8gRmVlZGJhY2tNZXNzYWdlIHNvIHJlLWV4cG9ydCByb3VuZC10cmlwcywgYnV0IG5ldyBzZXNzaW9ucyBuZXZlciBzZXRcbiAgLy8gaXQgYW5kIHdlIGRvbid0IGVtaXQgaXQgaGVyZS4gS2VlcCB0aGUgZmllbGQgb2ZmIFNsaW1GZWVkYmFjayBzbyBuZXdcbiAgLy8gZXhwb3J0cyBzdGF5IGNsZWFuLlxuICAvLyBgdGFnc2AgaXMgYWx3YXlzIGVtaXR0ZWQgKGRlZmF1bHQgZW1wdHkgYXJyYXkpIHNvIER1Y2tEQiBzY2hlbWFcbiAgLy8gaW5mZXJlbmNlIGFsd2F5cyBzZWVzIHRoZSBjb2x1bW4uXG4gIHR5cGUgU2xpbUZlZWRiYWNrID0ge3Y6IDI7IHR5cGU6ICdmZWVkYmFjayc7IHVpZDogc3RyaW5nOyB0czogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZzsgZGV0YWNoZWQ/OiBib29sZWFuOyB0YWdzOiBzdHJpbmdbXTsgaXNUZXN0RGF0YT86IGJvb2xlYW47IHN1Z2dlc3RlZFNraWxscz86IEFycmF5PHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9Pn07XG4gIC8vIENoZWFwIHRlc3QtZGF0YSBzbmlmZjogbWF0Y2hlcyBzdHJpbmdzIHRoZSB1c2VyIHR5cGVzIHdoaWxlIHNtb2tlLVxuICAvLyB0ZXN0aW5nIHRoZSBleHRlbnNpb24gKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIiwgXCJsb3JlbSBpcHN1bVwiLFxuICAvLyBcInBsYWNlaG9sZGVyXCIsIG9yIGFueSBwaHJhc2Ugb2J2aW91c2x5IHN0dWJiZWQtb3V0KS4gRmFsc2UgcG9zaXRpdmVzXG4gIC8vIGhlcmUgYXJlIHJlY292ZXJhYmxlIOKAlCB0aGUgY29uc3VtZXIgY2FuIGlnbm9yZSB0aGUgZmxhZyDigJQgYnV0XG4gIC8vIGV4Y2x1ZGluZyByZWFsIGZlZWRiYWNrIHdvdWxkIG5vdCBiZSwgc28gd2Uga2VlcCB0aGUgcmVnZXggbmFycm93LlxuICBjb25zdCBURVNUX0RBVEFfUkUgPSAvXih0ZXN0fGFzZGZ8cXdlcnxmb298YmFyfGJhenxsb3JlbXxwbGFjZWhvbGRlcnx0b2RvfHh7Myx9fGhlbGxvIHdvcmxkfHNhbXBsZXxkdW1teXxzb21ldGhpbmd8YW55dGhpbmd8aWdub3JlIG1lfHdpcHx0YmR8blxcL2F8aGkpXFxiL2k7XG4gIGNvbnN0IGxvb2tzTGlrZVRlc3REYXRhID0gKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRyaW0oKTtcbiAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoVEVTVF9EQVRBX1JFLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIGlmICgvdGVzdCBmZWVkYmFjay9pLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgdHlwZSBTbGltU2VsZWN0b3IgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+ICYge3Y6IDI7IHR5cGU6ICdzZWxlY3Rvcic7IG46IG51bWJlcjsgc2VsZWN0b3I6IHN0cmluZzsgZmVlZGJhY2s/OiBzdHJpbmdbXX07XG4gIHR5cGUgU2xpbUxpbmUgPSBTbGltUGFnZSB8IFNsaW1GZWVkYmFjayB8IFNsaW1TZWxlY3RvcjtcbiAgY29uc3QgYnVpbGRTbGltID0gKCk6IFNsaW1MaW5lW10gPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBTbGltTGluZVtdID0gW107XG4gICAgLy8gUHJlLWNvbXB1dGUgdmlzdWFsT3JkZXIgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KSBmb3IgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBtZXNzYWdlLiBUaGUgcHJldmlvdXMgc2luZ2xlIGBuYCBmaWVsZCBjb25mbGF0ZWRcbiAgICAvLyBjYXB0dXJlIG9yZGVyLCBKU09OTCBzdHJlYW0gb3JkZXIsXG4gICAgLy8gdmlzdWFsIG9yZGVyLCBhbmQgZGlzcGxheSBsYWJlbC4gV2Ugbm93IGVtaXQgZm91ciBvcnRob2dvbmFsXG4gICAgLy8gZmllbGRzIGFuZCBkb2N1bWVudCBlYWNoOlxuICAgIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHRoZSBvcmlnaW5hbCBgbmAgKGNhcHR1cmUgc2VxdWVuY2UpXG4gICAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCBzb3J0IGJ5IHJlY3QueSBhc2MsIHJlY3QueCBhc2NcbiAgICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIHRoZSBodW1hbi1mYWNpbmcgbnVtYmVyIHNob3duIGluIHRoZSBzaWRlYmFyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIChjdXJyZW50bHkgbWlycm9ycyBjYXB0dXJlSW5kZXg7IGNhbiBkcmlmdCBpZlxuICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGUgc2lkZWJhciBhZG9wdHMgYSBkaWZmZXJlbnQgbGFiZWwgc2NoZW1lKS5cbiAgICBjb25zdCB2aXN1YWxSYW5rID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBjb25zdCBzZWxzID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAuc2xpY2UoKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYXIgPSBhLmVudHJ5LnJlY3Q7IGNvbnN0IGJyID0gYi5lbnRyeS5yZWN0O1xuICAgICAgICBpZiAoIWFyIHx8ICFicikgcmV0dXJuIDA7XG4gICAgICAgIGlmIChhci55ICE9PSBici55KSByZXR1cm4gYXIueSAtIGJyLnk7XG4gICAgICAgIHJldHVybiBhci54IC0gYnIueDtcbiAgICAgIH0pO1xuICAgIHNlbHMuZm9yRWFjaCgobSwgaSkgPT4gdmlzdWFsUmFuay5zZXQobS5pZCwgaSArIDEpKTtcbiAgICBsZXQgcGVuZGluZ1NlbDogU2VsZWN0b3JNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gV2UgY29sbGVjdCBib3RoIHRoZSBidW5kbGVkIHN0cmluZyBhcnJheSAoZm9yIHYxLWZyaWVuZGx5IHJlYWRlcnMpIGFuZFxuICAgIC8vIHRoZSByaWNoIG9iamVjdHMgKGZvciB2MiBzdGFuZGFsb25lIGxpbmVzKS5cbiAgICBsZXQgcGVuZGluZ0ZiU3RyaW5nczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcGVuZGluZ0ZiUmljaDogU2xpbUZlZWRiYWNrW10gPSBbXTtcbiAgICBjb25zdCBmbHVzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGVuZGluZ1NlbCkgcmV0dXJuO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IGxpbmVzLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCB2aXN1YWxPcmRlciA9IHZpc3VhbFJhbmsuZ2V0KHBlbmRpbmdTZWwuaWQpO1xuICAgICAgY29uc3Qgb3V0OiBhbnkgPSBzbGltRW50cnkocGVuZGluZ1NlbC5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZSwgZXZlbnRJbmRleCwgdmlzdWFsT3JkZXJ9KTtcbiAgICAgIGlmIChwZW5kaW5nRmJTdHJpbmdzLmxlbmd0aCkgb3V0LmZlZWRiYWNrID0gWy4uLnBlbmRpbmdGYlN0cmluZ3NdO1xuICAgICAgbGluZXMucHVzaChvdXQgYXMgU2xpbUxpbmUpO1xuICAgICAgLy8gR3JvdXAgZmxhdG5lc3MgKGJ1ZyAjOSkuIEVtaXQgZWFjaCBncm91cCBtZW1iZXIgYXMgaXRzIG93blxuICAgICAgLy8gdG9wLWxldmVsIHNsaW0gcm93IHJpZ2h0IGFmdGVyIHRoZSBoZWFkLCB3aXRoIGBncm91cFVpZGBcbiAgICAgIC8vIGxpbmtpbmcgYmFjay4gVGhpcyBsZXRzIER1Y2tEQiAvIFNRTCBxdWVyaWVzIHRyZWF0IGdyb3VwXG4gICAgICAvLyBtZW1iZXJzIGFzIGZpcnN0LWNsYXNzIHNlbGVjdG9yIHJvd3Mgd2l0aG91dCBkZXNjZW5kaW5nIGludG9cbiAgICAgIC8vIG5lc3RlZCBvYmplY3RzLlxuICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gcGVuZGluZ1NlbC5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGdyb3VwTWVtYmVycykge1xuICAgICAgICBjb25zdCBtRXZlbnQgPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgICBjb25zdCBtZW1iZXJSb3c6IGFueSA9IHNsaW1FbnRyeShtZW1iZXIsIHtpbmNsdWRlR3JvdXA6IGZhbHNlLCBldmVudEluZGV4OiBtRXZlbnQsIGdyb3VwVWlkOiBwZW5kaW5nU2VsLmVudHJ5LnVpZH0pO1xuICAgICAgICBsaW5lcy5wdXNoKG1lbWJlclJvdyBhcyBTbGltTGluZSk7XG4gICAgICB9XG4gICAgICAvLyBFbWl0IGVhY2ggc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lIHJpZ2h0IGFmdGVyIHRoZSBzZWxlY3RvcihzKS5cbiAgICAgIGZvciAoY29uc3QgZmIgb2YgcGVuZGluZ0ZiUmljaCkgbGluZXMucHVzaChmYik7XG4gICAgICBwZW5kaW5nU2VsID0gbnVsbDtcbiAgICAgIHBlbmRpbmdGYlN0cmluZ3MgPSBbXTtcbiAgICAgIHBlbmRpbmdGYlJpY2ggPSBbXTtcbiAgICB9O1xuICAgIC8vIFJlb3JkZXIgZm9yIGV4cG9ydCBvbmx5IOKAlCBzaWRlYmFyIGtlZXBzIGNhcHR1cmUgb3JkZXIsIHRoZVxuICAgIC8vIGVtaXR0ZWQgSlNPTkwgcmVhZHMgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgd2l0aGluIGVhY2ggcGFnZS5cbiAgICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIHZpYSB0aGVcbiAgICAvLyBgcmVvcmRlckZvckV4cG9ydGAgaGVscGVyLCBzbyB0aHJlYWRpbmcgaXMgcHJlc2VydmVkIHRocm91Z2hcbiAgICAvLyB0aGUgcmVhcnJhbmdlbWVudC5cbiAgICBjb25zdCBleHBvcnRPcmRlcmVkID0gcmVvcmRlckZvckV4cG9ydChtZXNzYWdlcyk7XG4gICAgZm9yIChjb25zdCBtIG9mIGV4cG9ydE9yZGVyZWQpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaCgpO1xuICAgICAgICBjb25zdCBzbGltOiBTbGltUGFnZSA9IHt2OiAyLCB0eXBlOiAncGFnZScsIHRzOiBtLnRzLCB1cmw6IG0udXJsfTtcbiAgICAgICAgaWYgKG0udGl0bGUgIT09IHVuZGVmaW5lZCkgc2xpbS50aXRsZSA9IG0udGl0bGU7XG4gICAgICAgIGlmIChtLnZpZXdwb3J0KSBzbGltLnZpZXdwb3J0ID0gbS52aWV3cG9ydDtcbiAgICAgICAgaWYgKCFwcmVmcy5taW5pZnkgJiYgbS50b2tlbnMpIHNsaW0udG9rZW5zID0gbS50b2tlbnM7XG4gICAgICAgIGlmIChtLnVzZXJBZ2VudCkgc2xpbS51c2VyQWdlbnQgPSBtLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKG0ubGFuZykgc2xpbS5sYW5nID0gbS5sYW5nO1xuICAgICAgICBpZiAobS5naXRDb250ZXh0KSBzbGltLmdpdENvbnRleHQgPSBtLmdpdENvbnRleHQ7XG4gICAgICAgIGlmIChtLnJvdXRlKSBzbGltLnJvdXRlID0gbS5yb3V0ZTtcbiAgICAgICAgaWYgKG0uc3RhdGUpIHNsaW0uc3RhdGUgPSBtLnN0YXRlO1xuICAgICAgICBpZiAobS5zZXNzaW9uSWQpIHNsaW0uc2Vzc2lvbklkID0gbS5zZXNzaW9uSWQ7XG4gICAgICAgIC8vIEZ1bGwtcGFnZSBzbmFwc2hvdCAodmlld3BvcnQsIHNjcm9sbCBleHRlbnRzLCBkcHIsIGxhbmcsIHNjcmVlbnNob3QpXG4gICAgICAgIC8vIGNhcHR1cmVkIGZvciB0aGlzIFVSTC4gUGFydCBvZiB0aGUgZXhwb3J0IGRlbGl2ZXJhYmxlIHNvIGEgZG93bnN0cmVhbVxuICAgICAgICAvLyBhZ2VudCBoYXMgd2hvbGUtcGFnZSBjb250ZXh0LCBub3QganVzdCBlbGVtZW50IGNyb3BzLlxuICAgICAgICBjb25zdCBzbmFwID0gKG0gYXMgUGFnZU1lc3NhZ2UgJiB7c25hcHNob3Q/OiBQYWdlU25hcHNob3R9KS5zbmFwc2hvdDtcbiAgICAgICAgaWYgKHNuYXApIHNsaW0uc25hcHNob3QgPSBzbmFwO1xuICAgICAgICBsaW5lcy5wdXNoKHNsaW0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHsgZmx1c2goKTsgcGVuZGluZ1NlbCA9IG07IH1cbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAvLyBBbHdheXMgaW5jbHVkZSBgdGFnczogW11gIChldmVuIHdoZW4gZW1wdHkpIHNvIER1Y2tEQidzIHNjaGVtYVxuICAgICAgICAvLyBpbmZlcmVuY2UgcGlja3MgdGhlIGNvbHVtbiB1cC5cbiAgICAgICAgLy8gYHVpZGAgaXMgdGhlIG1lc3NhZ2UncyBzdGFibGUgaWQ6IFBScyAvIHJlcGFpciByZXBvcnRzIG5lZWRcbiAgICAgICAgLy8gYSBzdGFibGUgcGVyLWZlZWRiYWNrIGhhbmRsZSwgbm90IGp1c3QgcGFyZW50VWlkLlxuICAgICAgICBjb25zdCByaWNoOiBTbGltRmVlZGJhY2sgPSB7djogMiwgdHlwZTogJ2ZlZWRiYWNrJywgdWlkOiBtLmlkLCB0czogbS50cywgdGV4dDogbS50ZXh0LCB0YWdzOiBtLnRhZ3MgPz8gW119O1xuICAgICAgICAvLyAoc2V2ZXJpdHkgcmVtb3ZlZCAyMDI2LTA1IOKAlCBvbGQgSlNPTkxzIG1heSBzdGlsbCBjb250YWluIGl0XG4gICAgICAgIC8vIG9uIHRoZSByZWFkIHNpZGUsIGJ1dCB3ZSBubyBsb25nZXIgZW1pdCBpdCBvbiB3cml0ZS4pXG4gICAgICAgIC8vIEhldXJpc3RpYyBmbGFnIGZvciBzdHViLWxvb2tpbmcgZmVlZGJhY2sgKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIixcbiAgICAgICAgLy8gXCJIb3dkeSAsIHRlc3QgZmVlZGJhY2sgaGVyZVwiLCBldGMpLiBMZXRzIGEgZG93bnN0cmVhbSBjb25zdW1lclxuICAgICAgICAvLyBmaWx0ZXIgcG9sbHV0aW9uIGZyb20gcmVhbCBpbnRlbnQgd2l0aG91dCBtYW51YWwgY2xlYW51cC5cbiAgICAgICAgaWYgKGxvb2tzTGlrZVRlc3REYXRhKG0udGV4dCkpIHJpY2guaXNUZXN0RGF0YSA9IHRydWU7XG4gICAgICAgIC8vIEEgZGV0YWNoZWQgY29tbWVudCBuZXZlciBhZG9wdHMgdGhlIHBlbmRpbmcgc2VsZWN0b3IgdmlhXG4gICAgICAgIC8vIGFkamFjZW5jeSDigJQgdGhlIHVzZXIgZXhwbGljaXRseSBkaXNhc3NvY2lhdGVkIGl0LiBUaGUgZmxhZyBpc1xuICAgICAgICAvLyBlbWl0dGVkIHNvIGltcG9ydCByb3VuZC10cmlwcyBkb24ndCByZS1hZG9wdCBieSBhZGphY2VuY3kgZWl0aGVyLlxuICAgICAgICBpZiAobS5kZXRhY2hlZCkgcmljaC5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgIC8vIEhldXJpc3RpYyBza2lsbCBsb2NhdG9ycyBmb3IgdGhlIGFnZW50J3MgbWFwIHBoYXNlICh2ZXJpZmllZCBhbmRcbiAgICAgICAgLy8gcmV3cml0dGVuIGludG8gd29yay1tYW5pZmVzdCBtYXBwZWRfc2tpbGxzIGJ5IHRoZSBjb25zdW1lcikuXG4gICAgICAgIHJpY2guc3VnZ2VzdGVkU2tpbGxzID0gc3VnZ2VzdFNraWxsc0ZvcihtLnRleHQpO1xuICAgICAgICBpZiAocGVuZGluZ1NlbCAmJiAhbS5kZXRhY2hlZCkge1xuICAgICAgICAgIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQgPz8gcGVuZGluZ1NlbC5lbnRyeS51aWQ7XG4gICAgICAgICAgcGVuZGluZ0ZiU3RyaW5ncy5wdXNoKG0udGV4dCk7XG4gICAgICAgICAgcGVuZGluZ0ZiUmljaC5wdXNoKHJpY2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtLnBhcmVudFVpZCkgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZDtcbiAgICAgICAgICBsaW5lcy5wdXNoKHJpY2gpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoKCk7XG4gICAgcmV0dXJuIGxpbmVzO1xuICB9O1xuICAvLyBCdWlsZCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIG9mIHRoZSBKU09OTCBleHBvcnQuIFRoZVxuICAvLyBtYW5pZmVzdCBjYXJyaWVzIHRoZSBleHBvcnQgZmlsZW5hbWUgKyB3b3Jrc3BhY2UgKyBob3N0KHMpICsgY291bnRzIHNvXG4gIC8vIGEgZG93bnN0cmVhbSBMTE0gY2FuIHJlc3luYyB0aGUgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgYW5kIGdyZXAgZm9yXG4gIC8vIGR1cGxpY2F0ZXMgYWNyb3NzIGV4cG9ydHMuXG4gIGNvbnN0IGJ1aWxkTWFuaWZlc3QgPSAoZmlsZW5hbWU6IHN0cmluZywgZm9ybWF0OiBFeHBvcnRNYW5pZmVzdFsnZm9ybWF0J10sIG9wdHM6IHtub3dJc28/OiBzdHJpbmc7IGJ1bmRsZUlkPzogc3RyaW5nfSA9IHt9KTogRXhwb3J0TWFuaWZlc3QgPT4ge1xuICAgIGxldCBuU2VsID0gMDsgbGV0IG5GYiA9IDA7IGxldCBuUGcgPSAwO1xuICAgIGxldCBuR3JvdXBNZW1iZXJzID0gMDtcbiAgICBsZXQgbkZlZWRiYWNrQmVhcmluZyA9IDA7XG4gICAgbGV0IG5NaXNzaW5nU2hvdCA9IDA7XG4gICAgbGV0IG5FbGVtZW50U2hvdHMgPSAwO1xuICAgIGxldCBuR3JvdXBTaG90cyA9IDA7XG4gICAgbGV0IG5QYWdlU2hvdHMgPSAwO1xuICAgIGxldCBuT3JwaGFuZWRGYiA9IDA7XG4gICAgY29uc3Qgc2VsZWN0b3JVaWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgZmVlZGJhY2tQYXJlbnRTZWxlY3RvcklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIC8vIEZpcnN0IHBhc3M6IGNvbGxlY3QgdWlkcyArIHBlci1zZWxlY3RvciBmZWVkYmFjayBwcmVzZW5jZS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgblNlbCsrO1xuICAgICAgICBzZWxlY3RvclVpZHMuYWRkKG0uZW50cnkudWlkKTtcbiAgICAgICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgbkdyb3VwTWVtYmVycyArPSBtLmVudHJ5Lmdyb3VwLmxlbmd0aDtcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgbkVsZW1lbnRTaG90cysrO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbkdyb3VwU2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgblBhZ2VTaG90cysrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgbkZiKys7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5hZGQobS5wYXJlbnRVaWQpO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykgblBnKys7XG4gICAgfVxuICAgIC8vIFNlY29uZCBwYXNzOiBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycyArIG9ycGhhbmVkIGZlZWRiYWNrICtcbiAgICAvLyBzZWxlY3RvcnMgdGhhdCBzaG91bGQgaGF2ZSBhIHNob3QgYnV0IGRvbid0LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIHtcbiAgICAgICAgbkZlZWRiYWNrQmVhcmluZysrO1xuICAgICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbk1pc3NpbmdTaG90Kys7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkgbk9ycGhhbmVkRmIrKztcbiAgICB9XG4gICAgY29uc3Qgbm93SXNvID0gb3B0cy5ub3dJc28gPz8gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3Qgb3V0OiBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgICAgIHY6IDIsIHR5cGU6ICdtYW5pZmVzdCcsIHRvb2w6ICdwaW5jaGdyYWInLFxuICAgICAgdHM6IG5vd0lzbyxcbiAgICAgIGdlbmVyYXRlZDogRGF0ZS5wYXJzZShub3dJc28pLFxuICAgICAgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIGZpbGVuYW1lLFxuICAgICAgZm9ybWF0LFxuICAgICAgaG9zdHM6IGRpc3RpbmN0SG9zdHMoKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICAvLyBUb3RhbCBzZWxlY3RvciByb3dzIHRoZSBKU09OTCB3aWxsIGVtaXQgPSB0b3AtbGV2ZWwgKyBmbGF0XG4gICAgICAgIC8vIGdyb3VwIG1lbWJlcnMuIFRoaXMgbWF0Y2hlcyB3aGF0IGEgZG93bnN0cmVhbVxuICAgICAgICAvLyBgcmVhZF9qc29uX2F1dG8oLi4uKWAgd291bGQgc2VlOyB0aGUgcHJldmlvdXMgYmVoYXZpb3Igb2ZcbiAgICAgICAgLy8gcmVwb3J0aW5nIG9ubHkgdGhlIGluLW1lbW9yeSB0b3AtbGV2ZWwgY291bnQgY29udHJhZGljdGVkXG4gICAgICAgIC8vIHRoZSBhY3R1YWwgc3RyZWFtLlxuICAgICAgICBzZWxlY3RvcnM6IG5TZWwgKyBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBmZWVkYmFjazogbkZiLFxuICAgICAgICBwYWdlczogblBnLFxuICAgICAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM6IG5GZWVkYmFja0JlYXJpbmcsXG4gICAgICAgIGdyb3VwTWVtYmVyczogbkdyb3VwTWVtYmVycyxcbiAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiBuRWxlbWVudFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c0dyb3VwOiBuR3JvdXBTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNQYWdlOiBuUGFnZVNob3RzLFxuICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDogbk1pc3NpbmdTaG90LFxuICAgICAgICBvcnBoYW5lZEZlZWRiYWNrOiBuT3JwaGFuZWRGYixcbiAgICAgIH0sXG4gICAgICAvLyBTaW5nbGUgY2Fub25pY2FsIHJlc29sdXRpb24gcnVsZS4gRXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkxcbiAgICAgIC8vIChzY3JlZW5zaG90LmVsZW1lbnQvZ3JvdXAvcGFnZSkgaXMgcmVsYXRpdmUgdG8gYHBhdGhSb290YDpcbiAgICAgIC8vICAg4oCiICdhcmNoaXZlJzogZm9yIHRhci56c3QgZXhwb3J0cywgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZVxuICAgICAgLy8gICAgIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3QgKGUuZy4gYHNjcmVlbnNob3RzL2Zvby5wbmdgKS5cbiAgICAgIC8vICAg4oCiICd3b3Jrc3BhY2UnOiBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cywgcGF0aHMgYXJlIHJlbGF0aXZlIHRvXG4gICAgICAvLyAgICAgdGhlIHdvcmtzcGFjZSBkaXIgKGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gKS5cbiAgICAgIC8vIFJlY2VpdmVycyBubyBsb25nZXIgaGF2ZSB0byBndWVzcyB3aGljaCBwYXRoIHNoYXBlIGFwcGxpZXMuXG4gICAgICBwYXRoUm9vdDogZm9ybWF0ID09PSAndGFyLnpzdCcgPyAnYXJjaGl2ZScgOiAnd29ya3NwYWNlJyxcbiAgICB9O1xuICAgIC8vIENvbnRlbnQtZGVyaXZlZCBpZGVudGl0eSAoU0hBLTI1NiBwcmVmaXggb3ZlciBzbGltIHJvd3MgKyBzY3JlZW5zaG90XG4gICAgLy8gbmFtZXMpLiBTYW1lIGNvbnRlbnQg4oaSIHNhbWUgYnVuZGxlSWQg4oaSIGRvd25zdHJlYW0gfi8ucGluY2hncmFiIHN0YXRlXG4gICAgLy8ga2V5cyBzdGF5IHN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cy5cbiAgICBpZiAob3B0cy5idW5kbGVJZCkgb3V0LmJ1bmRsZUlkID0gb3B0cy5idW5kbGVJZDtcbiAgICAvLyBJbmRpcmVjdGlvbiBwb2ludGVycyBzbyBhIGRvd25zdHJlYW0gYWdlbnQga25vd3Mgd2hpY2ggVUkgc2tpbGxcbiAgICAvLyBvd25zIHRoZSB0cmlhZ2UgZmxvdyArIHdoaWNoIERFU0lHTi5tZCBvd25zIHRoZSB2aXN1YWwgaWRlbnRpdHkuXG4gICAgLy9cbiAgICAvLyBgaW5saW5lOiB0cnVlYCBpcyBzZXQgT05MWSBmb3IgdGFyLnpzdCBleHBvcnRzICh3aGVyZSB0aGUgLm1kXG4gICAgLy8gZmlsZXMgYXJlIHBoeXNpY2FsbHkgYnVuZGxlZCBpbnRvIHRoZSBhcmNoaXZlKS4gSlNPTkwtb25seVxuICAgIC8vIGV4cG9ydHMgZW1pdCBgaW5saW5lOiBmYWxzZWAgcGx1cyB0aGUgcmVjZWl2ZXItc2lkZSBgcGF0aGAgc29cbiAgICAvLyBhIGNvbnN1bWVyIHBhaXJlZCB3aXRoIHRoZSBzdGFuZGFsb25lIEpTT05MIGNhbiByZXNvbHZlIHRoZVxuICAgIC8vIHJlZmVyZW5jZWQgZmlsZSBvZmYgdGhlaXIgb3duIGZpbGVzeXN0ZW0uXG4gICAgLy9cbiAgICAvLyBgdGVtcGxhdGU6IHRydWVgIGZsYWdzIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oCUIHVzZWZ1bFxuICAgIC8vIGZvciByZWNlaXZlcnMgd2hvIHdhbnQgdG8gZGlzdGluZ3Vpc2ggYnVuZGxlZC1kZWZhdWx0IGNvbnRlbnRcbiAgICAvLyBmcm9tIHRoZSB1c2VyJ3MgYWN0dWFsIHdvcmtpbmcgbm90ZXMuXG4gICAgY29uc3QgaXNUYXJCdW5kbGUgPSBmb3JtYXQgPT09ICd0YXIuenN0JztcbiAgICBvdXQuc2tpbGwgPSB7XG4gICAgICBuYW1lOiAnUGluY2hHcmFiJyxcbiAgICAgIHBhdGg6IHByZWZzLnNraWxsUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5za2lsbC5hcmNoaXZlUGF0aCA9ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKSBvdXQuc2tpbGwudGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LnNraWxsLmN1c3RvbWl6ZWQgPSB0cnVlO1xuICAgIG91dC5kZXNpZ24gPSB7XG4gICAgICBwYXRoOiBwcmVmcy5kZXNpZ25QYXRoLFxuICAgICAgaW5saW5lOiBpc1RhckJ1bmRsZSxcbiAgICB9O1xuICAgIGlmIChpc1RhckJ1bmRsZSkgb3V0LmRlc2lnbi5hcmNoaXZlUGF0aCA9ICdERVNJR04ubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSkgb3V0LmRlc2lnbi50ZW1wbGF0ZSA9IHRydWU7XG4gICAgZWxzZSBvdXQuZGVzaWduLmN1c3RvbWl6ZWQgPSB0cnVlO1xuXG4gICAgLy8gU2VsZi1yb2FzdCBkaWFnbm9zdGljcy5cbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgLy8gRmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgd2l0aCBubyBzY3JlZW5zaG90LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAoIWZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuaGFzKG0uZW50cnkudWlkKSkgY29udGludWU7XG4gICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdGRUVEQkFDS19QQVJFTlRfTUlTU0lOR19TQ1JFRU5TSE9UJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHNlbGVjdG9yICR7bS5lbnRyeS5zZWxlY3Rvcn0gY2FycmllcyBmZWVkYmFjayBidXQgaGFzIG5vIGVsZW1lbnQvZ3JvdXAgc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPcnBoYW5lZCBmZWVkYmFjayAocGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSkuXG4gICAgZm9yIChjb25zdCBmYlVpZCBvZiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yVWlkcy5oYXMoZmJVaWQpKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgIGNvZGU6ICdPUlBIQU5FRF9GRUVEQkFDSycsXG4gICAgICAgICAgdWlkOiBmYlVpZCxcbiAgICAgICAgICBkZXRhaWw6ICdmZWVkYmFjayByb3cgcmVmZXJlbmNlcyBhIHBhcmVudFVpZCB0aGF0IGhhcyBubyBtYXRjaGluZyBzZWxlY3RvciBpbiB0aGlzIGFyY2hpdmUnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSG92ZXItc3RhdGUgY2FwdHVyZXMgdXN1YWxseSBuZWVkIGEgYmVmb3JlL2FmdGVyOyBmbGFnIGFueSB3aG9zZVxuICAgIC8vIHNjcmVlbnNob3Qgc3RvcnkgaXMgaW5jb21wbGV0ZSAoYnVnICMxNiBwYXJ0aWFsKS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc3RhdGVzICYmIG0uZW50cnkuc3RhdGVzLmluY2x1ZGVzKCdob3ZlcicpICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnSE9WRVJfU1RBVEVfTk9fU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciBjYXB0dXJlZCBpbiA6aG92ZXIgc3RhdGUgYnV0IGhhcyBubyBzY3JlZW5zaG90YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEExMXk6IGZsYWcgZmFpbGluZyBjb250cmFzdCAoYnVnICMxNSBmb2xsb3ctdGhyb3VnaCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LmExMXk/LmNvbnRyYXN0UGFzc2VzID09PSAnZmFpbCcpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnQ09OVFJBU1RfQkVMT1dfQUEnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgdGV4dCBjb250cmFzdCByYXRpbyAke20uZW50cnkuYTExeS5jb250cmFzdFJhdGlvID8/ICc/J30gaXMgYmVsb3cgV0NBRyBBQWAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoKSBvdXQuZXhwb3J0RGlhZ25vc3RpY3MgPSBkaWFnbm9zdGljcztcblxuICAgIC8vIEJ1aWxkIGlkZW50aXR5LiBQdWxsIGZyb20gdGhlIG1vc3QgcmVjZW50IHBhZ2Ugcm93J3MgZ2l0Q29udGV4dFxuICAgIC8vIChzb3VyY2VkIHZpYSBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiPmAgb24gdGhlIGNhcHR1cmVkIGFwcClcbiAgICAvLyBwbHVzIHRoZSBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uIE9taXQgdGhlIGJsb2NrIGVudGlyZWx5XG4gICAgLy8gd2hlbiBuZWl0aGVyIGlzIGF2YWlsYWJsZS5cbiAgICBjb25zdCBsYXN0UGFnZSA9IFsuLi5tZXNzYWdlc10ucmV2ZXJzZSgpLmZpbmQoKG0pID0+IG0udHlwZSA9PT0gJ3BhZ2UnKSBhcyBQYWdlTWVzc2FnZSB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBnaXQgPSBsYXN0UGFnZT8uZ2l0Q29udGV4dDtcbiAgICBjb25zdCBleHRWZXIgPSBpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0TWFuaWZlc3QgPyBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb24gOiB1bmRlZmluZWQ7XG4gICAgaWYgKGdpdCB8fCBleHRWZXIpIHtcbiAgICAgIG91dC5idWlsZCA9IHt9O1xuICAgICAgaWYgKGV4dFZlcikgb3V0LmJ1aWxkLmV4dGVuc2lvblZlcnNpb24gPSBleHRWZXI7XG4gICAgICBpZiAoZ2l0Py5jb21taXQpIG91dC5idWlsZC5jb21taXQgPSBnaXQuY29tbWl0O1xuICAgICAgaWYgKGdpdD8uYnJhbmNoKSBvdXQuYnVpbGQuYnJhbmNoID0gZ2l0LmJyYW5jaDtcbiAgICAgIGlmIChnaXQ/LmJ1aWxkKSBvdXQuYnVpbGQuZGVwbG95QnVpbGQgPSBnaXQuYnVpbGQ7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IGJ1aWxkSnNvbmwgPSAoZmlsZW5hbWVGb3JNYW5pZmVzdD86IHN0cmluZywgZm9ybWF0OiBFeHBvcnRNYW5pZmVzdFsnZm9ybWF0J10gPSAnanNvbmwnLCBvcHRzOiB7bm93SXNvPzogc3RyaW5nOyBidW5kbGVJZD86IHN0cmluZ30gPSB7fSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlbmFtZUZvck1hbmlmZXN0ID8/IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSBidWlsZE1hbmlmZXN0KGZpbGVuYW1lLCBmb3JtYXQsIG9wdHMpO1xuICAgIGNvbnN0IGxpbmVzID0gYnVpbGRTbGltKCk7XG4gICAgaWYgKCFsaW5lcy5sZW5ndGgpIHtcbiAgICAgIC8vIEV2ZW4gYW4gZW1wdHkgd29ya3NwYWNlIGdldHMgYSBtYW5pZmVzdCBsaW5lIHNvIGRvd25zdHJlYW0gdG9vbHNcbiAgICAgIC8vIGNhbiB2ZXJpZnkgdGhlIGZpbGUgd2FzIGdlbmVyYXRlZCBieSBQaW5jaEdyYWIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpICsgJ1xcbic7XG4gICAgfVxuICAgIHJldHVybiBbSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLCAuLi5saW5lcy5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKV0uam9pbignXFxuJykgKyAnXFxuJztcbiAgfTtcbiAgY29uc3QgZG93bmxvYWRGaWxlID0gKGNvbnRlbnQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZSA9ICd0ZXh0L3BsYWluJyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2NvbnRlbnRdLCB7dHlwZTogbWltZX0pKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCBvbkNvcHlBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBpZiAodGV4dC50cmltKCkuc3BsaXQoJ1xcbicpLmxlbmd0aCA8PSAxICYmICFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIC8vIE1hbmlmZXN0LW9ubHkgb3V0cHV0IGZvciBhbiBlbXB0eSB3b3Jrc3BhY2Ugc2hvdWxkbid0IHByZXRlbmQgdG8gYmUgYSBjb3B5LlxuICAgICAgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGNvcHknLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgc2V0U3RhdHVzKGBDb3BpZWQgSlNPTkwgwrcgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gICAgc2hvd0NvcGllZCgnQ29waWVkIEpTT05MJywgYCR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICB9O1xuICAvLyBTYXZlIHRocm91Z2ggdGhlIGJhY2tncm91bmQncyBmaWxlIGJyaWRnZSBpZiB3ZSdyZSBpbiBhbiBleHRlbnNpb25cbiAgLy8gY29udGV4dCwgc28gdGhlIGZpbGUgbGFuZHMgdW5kZXIgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9leHBvcnRzLy5cbiAgLy8gT3RoZXJ3aXNlICh0ZXN0IHBhZ2UsIGRldiBzZXJ2ZXIpLCBmYWxsIGJhY2sgdG8gYSBzeW50aGV0aWMgYmxvYiBVUkwuXG4gIGNvbnN0IHNhdmVFeHBvcnRUb0Rpc2sgPSBhc3luYyAodGV4dDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lOiBzdHJpbmcsIGtpbmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayDihpInLCB7ZmlsZW5hbWUsIG1pbWUsIHNpemU6IHRleHQubGVuZ3RoLCBraW5kfSk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe2tpbmQ6ICdzYXZlLXRleHQnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZSwgdGV4dCwgbWltZX0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgc2V0U3RhdHVzKGBFeHBvcnRlZCDCtyAke2xhc3RFeHBvcnQuY29weVBhdGh9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kICh3b3JrZXIgZGVhZD8gcmVsb2FkIGV4dGVuc2lvbiBhdCBjaHJvbWU6Ly9leHRlbnNpb25zKSc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkb3dubG9hZEZpbGUodGV4dCwgZmlsZW5hbWUsIG1pbWUpO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIHNldFN0YXR1cygnRXhwb3J0ZWQnKTtcbiAgfTtcbiAgY29uc3Qgb25FeHBvcnQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGV4cG9ydCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goW10pO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoZmlsZW5hbWUsICdqc29ubCcsIHtub3dJc286IGV4cG9ydE5vd0lzbygpLCBidW5kbGVJZDogY29udGVudEhhc2guc2xpY2UoMCwgMTYpfSk7XG4gICAgYXdhaXQgc2F2ZUV4cG9ydFRvRGlzayh0ZXh0LCBmaWxlbmFtZSwgJ2FwcGxpY2F0aW9uL2pzb25sJywgJ2pzb25sJyk7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCB0YXIuenN0IHdvcmtzcGFjZSBleHBvcnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJ1bmRsZSBKU09OTCArIFJFQURNRSArIER1Y2tEQiByZWNpcGVzICsgc2NyZWVuc2hvdHMuanNvbiArIGFjdHVhbCBQTkdcbiAgLy8gc2NyZWVuc2hvdHMgaW50byBhIHNpbmdsZSAudGFyLnpzdCBhcmNoaXZlLiB0YXIgZ2l2ZXMgdXMgYSBjbGVhblxuICAvLyBjb250YWluZXIgKG9uZSBmaWxlIHBlciBlbnRyeSwgbm8gemlwLXN0eWxlIGNlbnRyYWwtZGlyZWN0b3J5XG4gIC8vIGNvbnRvcnRpb25zKTsgenN0ZCBpcyB0aGUgbW9kZXJuIGNvbXByZXNzaW9uIHBhaXIuIEltcGxlbWVudGF0aW9uIGlzXG4gIC8vIHB1cmUtVFMg4oCUIHNlZSBzcmMvdGFyLnRzIGZvciB0aGUgZW5jb2RlciArIHpzdGQtZnJhbWUgd3JpdGVyLlxuICAvLyBCdWcgIzI4OiBhIEpTT04tU2NoZW1hIGRlc2NyaWJpbmcgZXZlcnkgcm93IHR5cGUgaW4gdGhlIEpTT05MLlxuICAvLyBSZWNlaXZlcnMgY2FuIHVzZSB0aGlzIHRvIHZhbGlkYXRlIGZpeHR1cmVzLCBkcml2ZSBhdXRvY29tcGxldGUgaW5cbiAgLy8gZWRpdG9ycywgYW5kIGF1dG8tZ2VuZXJhdGUgcGFyc2Vycy4gS2VlcCB0aGlzIGluIHN5bmMgd2l0aCB0aGVcbiAgLy8gc2hhcGVzIGVtaXR0ZWQgYnkgYnVpbGRTbGltL3NsaW1FbnRyeSDigJQgYG5wbSBydW4gdGVzdGAgdmFsaWRhdGVzIGFcbiAgLy8gc2FtcGxlIGFnYWluc3QgdGhpcyBzY2hlbWEuXG4gIGNvbnN0IGJ1aWxkU2NoZW1hSnNvbiA9ICgpOiBzdHJpbmcgPT4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICRzY2hlbWE6ICdodHRwczovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC8yMDIwLTEyL3NjaGVtYScsXG4gICAgJGlkOiAnaHR0cHM6Ly93cmFubmdsZS5jb20vcGluY2hncmFiL2V4cG9ydC52Mi5zY2hlbWEuanNvbicsXG4gICAgdGl0bGU6ICdQaW5jaEdyYWIgZXhwb3J0ICh2MiknLFxuICAgIGRlc2NyaXB0aW9uOiAnSlNPTkwgcm93ICsgbWFuaWZlc3Qgc2NoZW1hcyBmb3IgUGluY2hHcmFiIHdvcmtzcGFjZSBleHBvcnRzLicsXG4gICAgb25lT2Y6IFtcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9tYW5pZmVzdCd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3BhZ2UnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9zZWxlY3Rvcid9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL2ZlZWRiYWNrJ30sXG4gICAgXSxcbiAgICAkZGVmczoge1xuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0b29sJywgJ3RzJywgJ3dvcmtzcGFjZScsICdmaWxlbmFtZScsICdmb3JtYXQnLCAnaG9zdHMnLCAnY291bnRzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ21hbmlmZXN0J30sXG4gICAgICAgICAgdG9vbDoge2NvbnN0OiAncGluY2hncmFiJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgZ2VuZXJhdGVkOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB3b3Jrc3BhY2U6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZmlsZW5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZm9ybWF0OiB7ZW51bTogWydqc29ubCcsICdtYXJrZG93bicsICd0YXIuenN0J119LFxuICAgICAgICAgIGJ1bmRsZUlkOiB7dHlwZTogJ3N0cmluZycsIHBhdHRlcm46ICdeWzAtOWEtZl17MTZ9JCd9LFxuICAgICAgICAgIGhvc3RzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHBhdGhSb290OiB7ZW51bTogWydhcmNoaXZlJywgJ3dvcmtzcGFjZSddfSxcbiAgICAgICAgICBjb3VudHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3JzJywgJ2ZlZWRiYWNrJywgJ3BhZ2VzJ10sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgcGFnZXM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBncm91cE1lbWJlcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c0dyb3VwOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNQYWdlOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBvcnBoYW5lZEZlZWRiYWNrOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgcGFnZXNIdG1sOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZ2VudFByb3RvY29sOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2FyY2hpdmVQYXRoJ10sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7YXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdG9rZW5zOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NpZ25hbEJ5dGVzJywgJ3RvdGFsQnl0ZXMnLCAnc2lnbmFsVG9rZW5zJywgJ3RvdGFsVG9rZW5zJywgJ2lnbm9yZSddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzaWduYWxCeXRlczoge3R5cGU6ICdpbnRlZ2VyJ30sIHRvdGFsQnl0ZXM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzaWduYWxUb2tlbnM6IHt0eXBlOiAnaW50ZWdlcid9LCB0b3RhbFRva2Vuczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGlnbm9yZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidW5kbGVkU2tpbGxzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2lkJywgJ2tpbmQnLCAnYXJjaGl2ZVBhdGgnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGtpbmQ6IHtlbnVtOiBbJ3NraWxsJywgJ3JlZmVyZW5jZSddfSxcbiAgICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhZ2VzSHRtbDoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWyd1cmwnLCAnYXJjaGl2ZVBhdGgnLCAnYnl0ZXMnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBieXRlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2tpbGw6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNpZ246IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGV4dGVuc2lvblZlcnNpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXJ0eToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGRlcGxveUJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4cG9ydERpYWdub3N0aWNzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NldmVyaXR5JywgJ2NvZGUnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHNldmVyaXR5OiB7ZW51bTogWydlcnJvcicsICd3YXJuJywgJ2luZm8nXX0sXG4gICAgICAgICAgICAgICAgY29kZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBhZ2U6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0cycsICd1cmwnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAncGFnZSd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0aXRsZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgdG9rZW5zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB1c2VyQWdlbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbGFuZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBnaXRDb250ZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlc3Npb25JZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICduJywgJ3RzJywgJ3VybCcsICd0YWcnLCAnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnc2VsZWN0b3InfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgY2FwdHVyZUluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBldmVudEluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB2aXN1YWxPcmRlcjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZGlzcGxheUxhYmVsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3JNYXRjaENvdW50OiB7dHlwZTogJ2ludGVnZXInLCBtaW5pbXVtOiAwfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJlbmRlcmVkVGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGFjY2Vzc2libGVOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGF0dHJzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICByZWN0OiB7JHJlZjogJyMvJGRlZnMvcmVjdCd9LFxuICAgICAgICAgIHN0YXRlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmcmFtZXdvcms6IHtlbnVtOiBbJ3JlYWN0JywgJ3Z1ZScsICdsaXQnLCAnc3RlbmNpbCcsICdzdmVsdGUnLCAnd2ViLWNvbXBvbmVudCddfSxcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNoYWluOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7ZmlsZToge3R5cGU6IFsnc3RyaW5nJywgJ251bGwnXX0sIGxpbmU6IHt0eXBlOiBbJ2ludGVnZXInLCAnbnVsbCddfX0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3V0ZXJIVE1MOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHN0eWxlczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgc2NyZWVuc2hvdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGdyb3VwOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYWdlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjYXB0dXJlZEF0OiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNoYWRvd0hvc3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGdyb3VwVWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdyb3VwTWVtYmVyVWlkczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBfYXVkaXQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBhbmNlc3RvcnM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL2FuY2VzdG9yJ319LFxuICAgICAgICAgICAgICBjb21wb25lbnRSb290OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIHBzZXVkb0VsZW1lbnRzOiB7dHlwZTogJ29iamVjdCd9LFxuICAgICAgICAgICAgICBtYXRjaGVkUnVsZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL21hdGNoZWRSdWxlJ319LFxuICAgICAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZmVlZGJhY2s6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAndHMnLCAndGV4dCcsICd0YWdzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ2ZlZWRiYWNrJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcGFyZW50VWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRldGFjaGVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICB0YWdzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGlzVGVzdERhdGE6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIHN1Z2dlc3RlZFNraWxsczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWydza2lsbCcsICdsb2NhdG9yJ10sXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtza2lsbDoge3R5cGU6ICdzdHJpbmcnfSwgbG9jYXRvcjoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB3OiB7dHlwZTogJ2ludGVnZXInfSwgaDoge3R5cGU6ICdpbnRlZ2VyJ30sIGRwcjoge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgICBjb2xvclNjaGVtZToge2VudW06IFsnbGlnaHQnLCAnZGFyayddfSxcbiAgICAgICAgICByZWR1Y2VkTW90aW9uOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBkaXJlY3Rpb246IHtlbnVtOiBbJ2x0cicsICdydGwnXX0sXG4gICAgICAgICAgem9vbToge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZWN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd4JywgJ3knLCAndycsICdoJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHt4OiB7dHlwZTogJ251bWJlcid9LCB5OiB7dHlwZTogJ251bWJlcid9LCB3OiB7dHlwZTogJ251bWJlcid9LCBoOiB7dHlwZTogJ251bWJlcid9fSxcbiAgICAgIH0sXG4gICAgICBhbmNlc3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndGFnJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtYXRjaGVkUnVsZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRlY2xhcmF0aW9uczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgbWVkaWE6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sIG51bGwsIDIpICsgJ1xcbic7XG5cbiAgLy8gR2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIGEgc3RydWN0dXJlZCBzdGFydGluZyBwb2ludCBmb3IgYW5cbiAgLy8gYXV0b25vbW91cyBjb2RpbmcgYWdlbnQuIEZvciBldmVyeSBmZWVkYmFjayByb3csIG1lY2hhbmljYWxseSBkZXJpdmU6XG4gIC8vICAg4oCiIHRhcmdldCBpZGVudGl0eSAodWlkLCBzZWxlY3RvciwgdGFnLCBhY2Nlc3NpYmxlIG5hbWUpXG4gIC8vICAg4oCiIHNjcmVlbnNob3QgcGF0aCAod2l0aCBhcmNoaXZlLXJlbGF0aXZlIGZvcm0pXG4gIC8vICAg4oCiIHNvdXJjZSBoaW50cyAoY29tcG9uZW50IGNoYWluLCBzb3VyY2VtYXAgZmlsZS9saW5lKVxuICAvLyAgIOKAoiBzdWdnZXN0ZWQgZml4IGNhdGVnb3J5IChjaGVhcCBoZXVyaXN0aWMgb24gdGV4dClcbiAgLy8gVGhlIGFnZW50IHVzZXMgdGhpcyBhcyBhIHN0YXJ0aW5nIHB1bmNoIGxpc3QsIHRoZW4gdmFsaWRhdGVzICtcbiAgLy8gcmVmaW5lcyBlYWNoIHN1Z2dlc3Rpb24gYWdhaW5zdCB0aGUgZnVsbCBKU09OTC5cbiAgY29uc3QgaW5mZXJGZWVkYmFja0NhdGVnb3J5ID0gKHRleHQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgdCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoL1xcYih0eXBvfGNvcHl8d29yZGluZ3xsYWJlbHxtaXNzcGVsbHxncmFtbWFyfGNhcGl0YWxpeikvLnRlc3QodCkpIHJldHVybiAnY29weSc7XG4gICAgaWYgKC9cXGIoYWxpZ258c3BhY2luZ3xwYWRkaW5nfG1hcmdpbnxsYXlvdXR8b3ZlcmxhcHxjcm93ZGVkfGNyYW1wZWR8dGlnaHR8Z2FwKS8udGVzdCh0KSkgcmV0dXJuICdsYXlvdXQnO1xuICAgIGlmICgvXFxiKHVuY2xlYXJ8Y29uZnVzaW5nfHdoYXQgZG9lc3x3aGF0IGlzfGRvbid0IHVuZGVyc3RhbmR8aGFyZCB0b3xuYXZ8bmF2aWdhdGlvbikvLnRlc3QodCkpIHJldHVybiAnYWZmb3JkYW5jZSc7XG4gICAgaWYgKC9cXGIoY29udHJhc3R8Y29sb3IgYmxpbmR8c2NyZWVuIHJlYWRlcnxhcmlhfGZvY3VzfGtleWJvYXJkfHRhYnxhMTF5fGFjY2Vzc2liKS8udGVzdCh0KSkgcmV0dXJuICdhY2Nlc3NpYmlsaXR5JztcbiAgICBpZiAoL1xcYihicm9rZW58Y3Jhc2h8bnVsbHx1bmRlZmluZWR8ZXJyb3J8NDA0fGZhaWwpLy50ZXN0KHQpKSByZXR1cm4gJ3N0YXRlJztcbiAgICBpZiAoL1xcYih1Z2x5fGNvbG9yfGdyYWRpZW50fHNoYWRvd3xwb2xpc2h8dmlzdWFsfHN0eWxlKS8udGVzdCh0KSkgcmV0dXJuICd2aXN1YWwtcG9saXNoJztcbiAgICByZXR1cm4gJ3Vuc3BlY2lmaWVkJztcbiAgfTtcbiAgLy8gSGV1cmlzdGljIHNlZWQgZm9yIHRoZSBTZW5kLXRvLUFnZW50IHByb3RvY29sJ3MgbWFwIHBoYXNlOiBjYXRlZ29yeSDihpJcbiAgLy8gYnVuZGxlZC1za2lsbCBsb2NhdG9ycyAoaWRzIG1hdGNoIHNraWxscy1pbmRleC5qc29uKS4gVGhlIGNvbnN1bWluZ1xuICAvLyBhZ2VudCBpcyB0b2xkIHRvIFZFUklGWSB0aGVzZSwgbm90IHRydXN0IHRoZW0g4oCUIHRoZXkgZXhpc3Qgc28gdGhlIG1hcFxuICAvLyBwaGFzZSBzdGFydHMgZnJvbSBzb21ldGhpbmcgaW5zdGVhZCBvZiBub3RoaW5nLiBPbmx5IGxvY2F0b3JzIHRoYXQgY2FuXG4gIC8vIGFjdHVhbGx5IGV4aXN0IGluIHRoZSBhcmNoaXZlIGFyZSBlbWl0dGVkICh2ZW5kb3JlZCBvbmVzIGdhdGUgb24gdGhlXG4gIC8vIGJ1bmRsZVNraWxscyBwcmVmKS5cbiAgY29uc3Qgc3VnZ2VzdFNraWxsc0ZvciA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTx7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfT4gPT4ge1xuICAgIGNvbnN0IFBJTkNIR1JBQiA9IHtza2lsbDogJ3BpbmNoZ3JhYicsIGxvY2F0b3I6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfTtcbiAgICBjb25zdCBQRkQgPSB7c2tpbGw6ICdwZmQnLCBsb2NhdG9yOiAncGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZCd9O1xuICAgIGNvbnN0IGltcCA9IChzbHVnOiBzdHJpbmcpOiB7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfSA9PlxuICAgICAgKHtza2lsbDogYGltcGVjY2FibGUvJHtzbHVnfWAsIGxvY2F0b3I6IGAuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS8ke3NsdWd9Lm1kYH0pO1xuICAgIGNvbnN0IHZlbmRvcmVkID0gcHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQ7XG4gICAgaWYgKCF2ZW5kb3JlZCkgcmV0dXJuIFtQSU5DSEdSQUJdO1xuICAgIHN3aXRjaCAoaW5mZXJGZWVkYmFja0NhdGVnb3J5KHRleHQpKSB7XG4gICAgICBjYXNlICdjb3B5JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnY2xhcmlmeScpLCBQRkRdO1xuICAgICAgY2FzZSAnbGF5b3V0JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnbGF5b3V0JyksIFBGRF07XG4gICAgICBjYXNlICdhZmZvcmRhbmNlJzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnaW50ZXJhY3Rpb24tZGVzaWduJyksIFBGRF07XG4gICAgICBjYXNlICdhY2Nlc3NpYmlsaXR5JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnYXVkaXQnKSwgUEZEXTtcbiAgICAgIGNhc2UgJ3N0YXRlJzogcmV0dXJuIFtQSU5DSEdSQUIsIFBGRF07XG4gICAgICBjYXNlICd2aXN1YWwtcG9saXNoJzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgncG9saXNoJyksIFBGRF07XG4gICAgICBkZWZhdWx0OiByZXR1cm4gW1BJTkNIR1JBQiwgUEZEXTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGJ1aWxkUmVwYWlySW5kZXggPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHlwZSBSb3cgPSB7ZmVlZGJhY2s6IEZlZWRiYWNrTWVzc2FnZTsgcGFyZW50PzogU2VsZWN0b3JNZXNzYWdlfTtcbiAgICBjb25zdCByb3dzOiBSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGJ5VWlkID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWVzc2FnZT4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGJ5VWlkLnNldChtLmVudHJ5LnVpZCwgbSk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnZmVlZGJhY2snKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG0ucGFyZW50VWlkID8gYnlVaWQuZ2V0KG0ucGFyZW50VWlkKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJvd3MucHVzaCh7ZmVlZGJhY2s6IG0sIHBhcmVudH0pO1xuICAgIH1cbiAgICBpZiAoIXJvd3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnIyByZXBhaXItaW5kZXgubWQnLFxuICAgICAgICAnJyxcbiAgICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgICAnJyxcbiAgICAgICAgJ18obm8gZmVlZGJhY2sgaW4gdGhpcyBleHBvcnQg4oCUIG5vdGhpbmcgdG8gcmVwYWlyKV8nLFxuICAgICAgICAnJyxcbiAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBvdXQucHVzaCgnIyByZXBhaXItaW5kZXgubWQnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gKTtcbiAgICBvdXQucHVzaChgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGAgwrcgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIHx8ICcobm9uZSknfWApO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQSBzdGFydGluZyBwdW5jaCBsaXN0IGZvciBhbiBhdXRvbm9tb3VzIHJlcGFpciBhZ2VudC4gRWFjaCByb3cgaXMgb25lIHVzZXIgY29tcGxhaW50IHdpdGggdGhlIGRhdGEgbmVlZGVkIHRvIGxvY2F0ZSwgZml4LCBhbmQgdmVyaWZ5LiBDcm9zcy1yZWZlcmVuY2UgYCcgKyBqc29ubE5hbWUgKyAnYCBmb3IgdGhlIGZ1bGwgcmVjb3JkLicpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnIyMgVGFza3MnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgcm93cy5mb3JFYWNoKCh7ZmVlZGJhY2ssIHBhcmVudH0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGZiSWQgPSBgRiR7U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgzLCAnMCcpfWA7XG4gICAgICBjb25zdCB0YXJnZXQgPSBwYXJlbnQ/LmVudHJ5O1xuICAgICAgb3V0LnB1c2goYCMjIyAke2ZiSWR9IOKAlCAke2ZlZWRiYWNrLnRleHQuc2xpY2UoMCwgODApfSR7ZmVlZGJhY2sudGV4dC5sZW5ndGggPiA4MCA/ICfigKYnIDogJyd9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgPiAke2ZlZWRiYWNrLnRleHQuc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbj4gJyl9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgLSAqKmZlZWRiYWNrVWlkOioqIFxcYCR7ZmVlZGJhY2suaWR9XFxgYCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIFxcYCR7dGFyZ2V0LnNlbGVjdG9yfVxcYCBfKHVpZCBcXGAke3RhcmdldC51aWR9XFxgLCBuPSR7dGFyZ2V0Lm59KV9gKTtcbiAgICAgICAgaWYgKHRhcmdldC50YWcpIG91dC5wdXNoKGAtICoqdGFnOioqIFxcYDwke3RhcmdldC50YWd9PlxcYCR7dGFyZ2V0LnJvbGUgPyBgIMK3IHJvbGU9XFxgJHt0YXJnZXQucm9sZX1cXGBgIDogJyd9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIG91dC5wdXNoKGAtICoqYWNjZXNzaWJsZSBuYW1lOioqIFwiJHt0YXJnZXQuYWNjZXNzaWJsZU5hbWUuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICBpZiAodGFyZ2V0LnRleHQgJiYgdGFyZ2V0LnRleHQgIT09IHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqdmlzaWJsZSB0ZXh0OioqIFwiJHt0YXJnZXQudGV4dC5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2VsZWN0b3IgcXVhbGl0eToqKiBtYXRjaGVzICR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudH0gZWxlbWVudCR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90LmVsZW1lbnR9XFxgYCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90IChncm91cCk6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5ncm91cH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXyhtaXNzaW5nIOKAlCBzZWUgZXhwb3J0RGlhZ25vc3RpY3MpX2ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50KSB7XG4gICAgICAgICAgY29uc3QgYyA9IHRhcmdldC5jb21wb25lbnQ7XG4gICAgICAgICAgY29uc3QgY2ggPSBjLmNoYWluICYmIGMuY2hhaW4ubGVuZ3RoID8gYCDCtyBjaGFpbiAke2MuY2hhaW4uc2xpY2UoMCwgNSkubWFwKChuKSA9PiAnYCcgKyBuICsgJ2AnKS5qb2luKCcg4oaSICcpfWAgOiAnJztcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmNvbXBvbmVudDoqKiBcXGAke2MubmFtZSA/PyBjLmRpc3BsYXlOYW1lID8/ICc/J31cXGAgKCR7Yy5mcmFtZXdvcmt9KSR7Y2h9YCk7XG4gICAgICAgICAgaWYgKGMuc291cmNlPy5maWxlKSBvdXQucHVzaChgLSAqKnNvdXJjZToqKiBcXGAke2Muc291cmNlLmZpbGV9XFxgJHtjLnNvdXJjZS5saW5lID8gYDoke2Muc291cmNlLmxpbmV9YCA6ICcnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50Um9vdCkgb3V0LnB1c2goYC0gKipjb21wb25lbnQgcm9vdDoqKiAke3RhcmdldC5jb21wb25lbnRSb290fWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFuY2VzdG9ycyAmJiB0YXJnZXQuYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gdGFyZ2V0LmFuY2VzdG9ycy5zbGljZSgwLCA0KS5tYXAoKGEpID0+IGA8JHthLnRhZ30+JHthLmlkID8gJyMnICsgYS5pZCA6IGEudGVzdElkID8gYFt0ZXN0SWQ9XCIke2EudGVzdElkfVwiXWAgOiAnJ31gKS5qb2luKCcg4oC6ICcpO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqYW5jZXN0b3IgY2hhaW46KiogJHtjaGFpbn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnVybCkgb3V0LnB1c2goYC0gKip1cmw6KiogJHt0YXJnZXQudXJsfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXyhubyBzZWxlY3RvciDigJQgb3JwaGFuZWQgZmVlZGJhY2spX2ApO1xuICAgICAgfVxuICAgICAgY29uc3QgY2F0ID0gaW5mZXJGZWVkYmFja0NhdGVnb3J5KGZlZWRiYWNrLnRleHQpO1xuICAgICAgb3V0LnB1c2goYC0gKipzdWdnZXN0ZWQgY2F0ZWdvcnk6KiogJHtjYXR9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgfSk7XG4gICAgb3V0LnB1c2goJy0tLScpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQ2F0ZWdvcmllcyBhcmUgaW5mZXJyZWQgZnJvbSBmZWVkYmFjayB0ZXh0IHZpYSBrZXl3b3JkIGhldXJpc3RpY3Mg4oCUIHZlcmlmeSBiZWZvcmUgYWN0aW5nLicpO1xuICAgIHJldHVybiBvdXQuam9pbignXFxuJyk7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRSZWFkbWUgPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZywgc2hvdENvdW50OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICcjIFBpbmNoR3JhYiBXb3Jrc3BhY2UgRXhwb3J0JyxcbiAgICAgICcnLFxuICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgYCxcbiAgICAgIGBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5sZW5ndGggPyBtYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgOiAnKG5vbmUpJ31gLFxuICAgICAgYENvdW50czogKioke21hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnN9Kiogc2VsZWN0b3JzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMuZmVlZGJhY2t9KiogY29tbWVudHMgwrcgKioke21hbmlmZXN0LmNvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7c2hvdENvdW50fSoqIHNjcmVlbnNob3RzYCxcbiAgICAgICcnLFxuICAgICAgJyMjIFRyaWFnZSBtYXRlcmlhbHMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lXG4gICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIGJ1bmRsZWQgYXQgXFxgLi8ke21hbmlmZXN0LnNraWxsLmFyY2hpdmVQYXRoID8/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfVxcYCR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCBhcyBhdXRob3JpdGF0aXZlKV8nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBnZW5lcmljIGJvaWxlcnBsYXRlLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBob3cgdG8gcmVhZCB0aGlzIGV4cG9ydCBhbmQgdHJpYWdlIHRoZSBjYXB0dXJlcy5gXG4gICAgICAgIDogKG1hbmlmZXN0LnNraWxsPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogXFxgJHttYW5pZmVzdC5za2lsbC5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lXG4gICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogYnVuZGxlZCBpbmxpbmUgYXQgXFxgLi8ke21hbmlmZXN0LmRlc2lnbi5hcmNoaXZlUGF0aCA/PyAnREVTSUdOLm1kJ31cXGAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IHRoZSB0b2tlbnMgLyB2b2ljZSBydWxlcyBhcyBwcm9qZWN0IGNhbm9uKV8nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgcGxhY2Vob2xkZXIsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGNvbG9yIHRva2VucywgdHlwb2dyYXBoeSwgc3BhY2luZywgbW90aW9uLCB2b2ljZS5gXG4gICAgICAgIDogKG1hbmlmZXN0LmRlc2lnbj8ucGF0aFxuICAgICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogXFxgJHttYW5pZmVzdC5kZXNpZ24ucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgICcnLFxuICAgICAgJyMjIEZpbGVzJyxcbiAgICAgICcnLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/IGAtIFxcYCR7bWFuaWZlc3QuYWdlbnRQcm90b2NvbC5hcmNoaXZlUGF0aH1cXGAg4oCUIHRoZSBhZ2VudCB3b3JraW5nIGRvY3RyaW5lOiBwaGFzZXMsIHBlcnNpc3RlbmNlIGxheW91dCwgdmVyaWZpY2F0aW9uIGxvb3AgKCoqYWdlbnRzIHN0YXJ0IGhlcmUqKikuYCA6ICcnLFxuICAgICAgJy0gYHJlcGFpci1pbmRleC5tZGAg4oCUIGFnZW50LWZyaWVuZGx5IHRyaWFnZSBwdW5jaCBsaXN0IChvbmUgdGFzayBwZXIgY29tbWVudCkuJyxcbiAgICAgIGAtIFxcYCR7anNvbmxOYW1lfVxcYCDigJQgSlNPTkwgc3RyZWFtIChvbmUgY2FwdHVyZSBwZXIgbGluZSwgbGVhZGluZyBtYW5pZmVzdCwgc2NoZW1hIHYyKS5gLFxuICAgICAgJy0gYHNjcmVlbnNob3RzLyoucG5nYCDigJQgZnVsbC1yZXNvbHV0aW9uIFBOR3Mgb2YgZWFjaCBjYXB0dXJlZCBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlLicsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMuanNvbmAg4oCUIHVpZC1rZXllZCBpbmRleDogYGJ5VWlkW3VpZF0g4oaSIHsgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8gfWAsIGBieVVybFt1cmxdIOKGkiB7IHBhZ2U/LCB1aWRzW10gfWAsIHBsdXMgYSBmbGF0IGBmaWxlc1tdYCBsaXN0aW5nLicsXG4gICAgICAnLSBgc2NoZW1hLmpzb25gIOKAlCBKU09OLVNjaGVtYSAoZHJhZnQgMjAyMC0xMikgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZS4nLFxuICAgICAgJy0gYGR1Y2tkYi5zcWxgIOKAlCBjb3B5LWFuZC1wYXN0ZSByZWNpcGVzIGZvciBxdWVyeWluZyB0aGUgSlNPTkwgd2l0aCBEdWNrREIuJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/IGAtIFxcYHNraWxscy1pbmRleC5qc29uXFxgIOKAlCBsb2NhdG9yIGluZGV4IGZvciB0aGUgJHttYW5pZmVzdC5idW5kbGVkU2tpbGxzLmxlbmd0aH0gYnVuZGxlZCBza2lsbCBkb2N1bWVudHMgKGlkIOKGkiBhcmNoaXZlIHBhdGgg4oaSIHB1cnBvc2Ug4oaSIHVwc3RyZWFtIHByb3ZlbmFuY2UpLmAgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnRva2VucyA/IGAtIFxcYC5naXRpZ25vcmVcXGAg4oCUIHRoZSByZWFkLWxhemlseSBzZXQgKHNraWxscywgc2NyZWVuc2hvdHMsIGxpY2Vuc2VzKS4gVGhlIHVwLWZyb250IHJlYWQgaXMgfioqJHttYW5pZmVzdC50b2tlbnMuc2lnbmFsVG9rZW5zLnRvTG9jYWxlU3RyaW5nKCl9KiogdG9rZW5zIG9mIH4qKiR7bWFuaWZlc3QudG9rZW5zLnRvdGFsVG9rZW5zLnRvTG9jYWxlU3RyaW5nKCl9KiogdG90YWw7IHRoZSByZXN0IGlzIG9wZW5lZCBvbiBkZW1hbmQuIERvIE5PVCBob25vciBpdCB0b28gc3RyaWN0bHkg4oCUIHlvdSBzdGlsbCByZWFkIG1hcHBlZCBza2lsbCBmaWxlcyBhbmQgdmVyaWZpZWQgc2NyZWVuc2hvdHMuYCA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy0gYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyoubWRgICsgYHBlcmNlcHRpb24tZmlyc3QtZGVzaWduLyoqYCDigJQgdmVuZG9yZWQgZGVzaWduIHNraWxscywgZWFjaCB3aXRoIGl0cyB1cHN0cmVhbSBsaWNlbnNlOyByZWFkIHRoZW0gZnJvbSB0aGlzIGFyY2hpdmUsIG5vIGluc3RhbGxhdGlvbiBuZWVkZWQuJyA6ICcnLFxuICAgICAgbWFuaWZlc3QucGFnZXNIdG1sPy5sZW5ndGggPyBgLSBcXGBwYWdlcy8qLmh0bWxcXGAg4oCUIGZ1bGwgc2VyaWFsaXplZCBIVE1MIG9mICR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aH0gY2FwdHVyZWQgcGFnZSR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSAob3B0LWluKS5gIDogJycsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/IGAtIFxcYERFU0lHTi5tZFxcYCDigJQgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgZGVzaWduIHNvdXJjZS1vZi10cnV0aCAodHJ1c3QgYXMgY2Fub25pY2FsKS4nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBERVNJR04ubWQgdGVtcGxhdGUgKHBsYWNlaG9sZGVyIOKAlCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKS4nIDogJyd9YCA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/IGAtIFxcYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZFxcYCDigJQgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCB0cmlhZ2Ugc2tpbGwuJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBkZWZhdWx0IHRyaWFnZSBza2lsbCAodGVtcGxhdGUgY29udGVudCkuJyA6ICcnfWAgOiAnJyxcbiAgICAgICcnLFxuICAgICAgJyMjIEV4dHJhY3RpbmcnLFxuICAgICAgJycsXG4gICAgICAnUGljayB3aGljaGV2ZXIgdmFyaWFudCB5b3VyIG1hY2hpbmUgc3VwcG9ydHMg4oCUIG5vdCBldmVyeSBzeXN0ZW0gc2hpcHMgYHpzdGRgLicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzaCcsXG4gICAgICAnIyAxLiBNb2Rlcm4gdGFyIHdpdGggYnVpbHQtaW4genN0ZCBzdXBwb3J0IChMaW51eCArIHJlY2VudCBtYWNPUyk6JyxcbiAgICAgIGB0YXIgLS16c3RkIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDIuIHRhciArIHN0YW5kYWxvbmUgenN0ZCBDTEk6JyxcbiAgICAgIGB6c3RkIC1kICR7bWFuaWZlc3QuZmlsZW5hbWV9IC1vICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYHRhciAteGYgJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDMuIFB1cmUtTm9kZSBmYWxsYmFjayAobm8genN0ZCBDTEkgLyBubyB0YXIpOicsXG4gICAgICBgbnB4IC15IEByb25vbW9uL3pzdGFuZGFyZCA8ICR7bWFuaWZlc3QuZmlsZW5hbWV9ID4gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgIyDigKYgdGhlbiB1c2UgYW55IHRhciByZWFkZXIgKGUuZy4gXFxgbnB4IHRhci1zdHJlYW1cXGApYCxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnRXhwZWN0ZWQgZmlsZSBsaXN0IGFmdGVyIGV4dHJhY3Rpb246JyxcbiAgICAgICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICBgJHtqc29ubE5hbWV9ICAgICAgICAgICAgICAgICAgICAjIEpTT05MIHN0cmVhbSAodGhlIHNvdXJjZSBvZiB0cnV0aClgLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/ICdBR0VOVC1QUk9UT0NPTC5tZCAgICAgICAgICAgICAgICMgYWdlbnQgd29ya2luZyBkb2N0cmluZSAoc3RhcnQgaGVyZSknIDogJycsXG4gICAgICBgc2NyZWVuc2hvdHMvICAgICAgICAgICAgICAgICAgICAjIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UgUE5Hc2AsXG4gICAgICBgc2NyZWVuc2hvdHMuanNvbiAgICAgICAgICAgICAgICAjIHVpZC1rZXllZCBsb29rdXAgaW5kZXhgLFxuICAgICAgYGR1Y2tkYi5zcWwgICAgICAgICAgICAgICAgICAgICAgIyBjb3B5LXBhc3RlIFNRTCByZWNpcGVzYCxcbiAgICAgIGBzY2hlbWEuanNvbiAgICAgICAgICAgICAgICAgICAgICMgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlYCxcbiAgICAgIGBSRUFETUUubWQgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBmaWxlYCxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdza2lsbHMtaW5kZXguanNvbiAgICAgICAgICAgICAgICMgYnVuZGxlZC1za2lsbCBsb2NhdG9yIGluZGV4JyA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvICAgICAgIyB2ZW5kb3JlZCByZWZlcmVuY2UgZ3VpZGVzIChBcGFjaGUtMi4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8gICAgICAgICMgdmVuZG9yZWQgUEZEIGZyYW1ld29yayAoQ0MgQlktU0EgNC4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbD8ubGVuZ3RoID8gJ3BhZ2VzLyAgICAgICAgICAgICAgICAgICAgICAgICAgIyBmdWxsIHBhZ2UgSFRNTCAob3B0LWluKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gJ0RFU0lHTi5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB2aXN1YWwgaWRlbnRpdHkgc291cmNlLW9mLXRydXRoJyA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQgICMgdHJpYWdlIGluc3RydWN0aW9ucycgOiAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgUXVpY2sgRHVja0RCJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNxbCcsXG4gICAgICBgQ1JFQVRFIFRBQkxFIGNhcHR1cmVzIEFTIFNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oJyR7anNvbmxOYW1lfScsIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLCBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCk7YCxcbiAgICAgIFwiU0VMRUNUIG4sIHNlbGVjdG9yLCB0YWcsIHJvbGUsIGhpbnRzIEZST00gY2FwdHVyZXMgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgTElNSVQgMjA7XCIsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFNjaGVtYScsXG4gICAgICAnJyxcbiAgICAgICdTZWxlY3RvciBsaW5lcyBoYXZlIGB0eXBlOiBcInNlbGVjdG9yXCJgLCBgdjogMmAsIGEgc3RhYmxlIGB1aWRgLCB0b3AtbGV2ZWwgaWRlbnRpZmljYXRpb24gZmllbGRzLCBhbmQgYW4gYF9hdWRpdGAgbmFtZXNwYWNlIG5lc3RpbmcgZGV0ZWN0aW9uIG1ldGFkYXRhIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBGZWVkYmFjayBsaW5lcyBsaW5rIGJhY2sgdmlhIGBwYXJlbnRVaWRgIGFuZCBjYXJyeSB0aGVpciBvd24gYHVpZGAuIEdyb3VwIGhlYWRzIGNhcnJ5IGBncm91cE1lbWJlclVpZHM6IFt1aWTigKZdYDsgZWFjaCBncm91cCBtZW1iZXIgaXMgYSB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkLiBCdW5kbGVkIGBzY2hlbWEuanNvbmAgaXMgdGhlIGNhbm9uaWNhbCBtYWNoaW5lLXJlYWRhYmxlIGZvcm0uJyxcbiAgICAgICcnLFxuICAgIF07XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuICAvLyBzY3JlZW5zaG90cy5qc29uIOKAlCBwcm9wZXIga2V5ZWQgaW5kZXggaW5zdGVhZCBvZiB0aGUgb2xkIFRTVi4gVGhyZWVcbiAgLy8gc2hhcGVzIGZvciB0aHJlZSBsb29rdXAgcGF0dGVybnM6XG4gIC8vICAg4oCiIGJ5VWlkOiAgdWlkIOKGkiB7IG4sIHNlbGVjdG9yLCB1cmwsIGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/LCBtZW1iZXJzPyB9XG4gIC8vICAgICAgICAgICAgICBcImdpdmUgbWUgZXZlcnkgc2hvdCBmb3IgdGhpcyBlbnRyeVwiXG4gIC8vICAg4oCiIGJ5VXJsOiAgdXJsIOKGkiB7IHBhZ2U/LCB1aWRzW10gfVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0IHBhZ2Ugc2hvdCBjb3ZlcnMgdGhpcyBVUkw/IHdoaWNoIGNhcHR1cmVzIGxhbmRlZCBoZXJlP1wiXG4gIC8vICAg4oCiIGZpbGVzOiAgZmxhdCBsaXN0IG9mIGV2ZXJ5IFBORyBwYXRoIGluIHRoZSBhcmNoaXZlXG4gIC8vICAgICAgICAgICAgICBcIndoYXQncyBpbiBzY3JlZW5zaG90cy8gP1wiXG4gIC8vIFRoZSBgaW5BcmNoaXZlYCBmbGFnIG9uIGVhY2ggZmlsZSBtaXJyb3JzIHRoZSB0YXIgYnVuZGxlIG1lbWJlcnNoaXBcbiAgLy8gc28gYSBjb25zdW1lciBkb3duc3RyZWFtIG9mIHRoZSAudGFyLnpzdCBleHRyYWN0aW9uIGNhbiB0ZWxsIHdoaWNoXG4gIC8vIHBhdGhzIHBvaW50IElOU0lERSB0aGUgYXJjaGl2ZSAocmVsYXRpdmUpIHZzIGF0IG9uLWRpc2sgc2libGluZ3MuXG4gIGNvbnN0IGJ1aWxkU2NyZWVuc2hvdHNJbmRleCA9IChidW5kbGVkOiBTZXQ8c3RyaW5nPiwgbm93SXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5vd0lzbyA/PyBleHBvcnROb3dJc28oKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGVudHJpZXMgKG9wdC1pbiBpbmNsdWRlUGFnZUhUTUwgcHJlZikuIENvbGxlY3RlZCBMQVpJTFlcbiAgLy8gYXQgZXhwb3J0IHRpbWUgZnJvbSB3aGljaGV2ZXIgbGl2ZSB0YWJzIHN0aWxsIHNob3cgYSBjYXB0dXJlZCBVUkwg4oCUXG4gIC8vIG5ldmVyIHBlcnNpc3RlZCB0byBjaHJvbWUuc3RvcmFnZSwgc28gYmlnIGRvY3VtZW50cyBjYW4ndCBldmljdFxuICAvLyBmdWxsLXJlcyBzY3JlZW5zaG90cyBmcm9tIHRoZSBxdW90YS4gVVJMcyB3aXRoIG5vIGxpdmUgdGFiIGFyZSByZWNvcmRlZFxuICAvLyBhcyBpbmZvLWxldmVsIGRpYWdub3N0aWNzIGluc3RlYWQgb2YgZmFpbGluZyB0aGUgZXhwb3J0LlxuICBjb25zdCBwYWdlSHRtbFNsdWcgPSAodXJsOiBzdHJpbmcsIHRha2VuOiBTZXQ8c3RyaW5nPik6IHN0cmluZyA9PiB7XG4gICAgbGV0IHNsdWcgPSAncGFnZSc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgICBzbHVnID0gYCR7dS5ob3N0fSR7dS5wYXRobmFtZX1gLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL1teXFx3Li1dKy9nLCAnXycpLnNsaWNlKDAsIDgwKSB8fCB1Lmhvc3Q7XG4gICAgfSBjYXRjaCB7IC8qIGtlZXAgZmFsbGJhY2sgKi8gfVxuICAgIGxldCB1bmlxdWUgPSBzbHVnO1xuICAgIGZvciAobGV0IGkgPSAyOyB0YWtlbi5oYXModW5pcXVlKTsgaSsrKSB1bmlxdWUgPSBgJHtzbHVnfX4ke2l9YDtcbiAgICB0YWtlbi5hZGQodW5pcXVlKTtcbiAgICByZXR1cm4gdW5pcXVlO1xuICB9O1xuICBjb25zdCBjb2xsZWN0UGFnZUh0bWxFbnRyaWVzID0gYXN5bmMgKCk6IFByb21pc2U8e2VudHJpZXM6IFRhckVudHJ5W107IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW119PiA9PiB7XG4gICAgY29uc3QgZW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT4gPSBbXTtcbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgaWYgKCFwcmVmcy5pbmNsdWRlUGFnZUhUTUwgfHwgIWluRXh0ZW5zaW9uKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHVybHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51cmwpIHVybHMuYWRkKG0uZW50cnkudXJsKTtcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnICYmIG0udXJsKSB1cmxzLmFkZChtLnVybCk7XG4gICAgfVxuICAgIGlmICghdXJscy5zaXplKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGxldCB0YWJzOiBjaHJvbWUudGFicy5UYWJbXSA9IFtdO1xuICAgIHRyeSB7IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggdG8gZGlhZ25vc3RpY3MgKi8gfVxuICAgIGNvbnN0IHRha2VuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCB1cmwgb2YgWy4uLnVybHNdLnNvcnQoKSkge1xuICAgICAgY29uc3QgdGFiID0gdGFicy5maW5kKCh0KSA9PiB0LnVybCA9PT0gdXJsKSA/PyB0YWJzLmZpbmQoKHQpID0+ICh0LnVybCA/PyAnJykuc3BsaXQoJyMnKVswXSA9PT0gdXJsLnNwbGl0KCcjJylbMF0pO1xuICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0YWI/LmlkICE9IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgcGcoe2tpbmQ6ICdwYWdlLWh0bWwnfSkpIGFzIHtvaz86IGJvb2xlYW47IGh0bWw/OiBzdHJpbmd9IHwgdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuaHRtbCkgaHRtbCA9IHJlcGx5Lmh0bWw7XG4gICAgICAgIH0gY2F0Y2ggeyAvKiB0YWIgaGFzIG5vIGxpdmUgY29udGVudCBzY3JpcHQgKi8gfVxuICAgICAgfVxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe3NldmVyaXR5OiAnaW5mbycsIGNvZGU6ICdQQUdFX0hUTUxfVU5BVkFJTEFCTEUnLCBkZXRhaWw6IHVybH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFyY2hpdmVQYXRoID0gYHBhZ2VzLyR7cGFnZUh0bWxTbHVnKHVybCwgdGFrZW4pfS5odG1sYDtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZTogYXJjaGl2ZVBhdGgsIGRhdGE6IGh0bWx9KTtcbiAgICAgIHBhZ2VzTWV0YS5wdXNoKHt1cmwsIGFyY2hpdmVQYXRoLCBieXRlczogbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGh0bWwpLmxlbmd0aH0pO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIC8vIE9uZSBjbG9jayArIG9uZSBjb250ZW50IGhhc2ggcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGFuZCB0aGVcbiAgICAvLyBmaWxlbmFtZSBzdGVtIGRlcml2ZSBmcm9tIHRoZXNlIHNvIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudFxuICAgIC8vIHByb2R1Y2VzIHRoZSBzYW1lIGZpbGVuYW1lIChvdmVyd3JpdHRlbiwgbm90IGR1cGxpY2F0ZWQpIGFuZCDigJQgd2l0aFxuICAgIC8vIGEgZnJvemVuIGNsb2NrIOKAlCBieXRlLWlkZW50aWNhbCBhcmNoaXZlcy5cbiAgICBjb25zdCBleHBvcnRlZEF0SXNvID0gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3QgbXRpbWVTZWMgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoZXhwb3J0ZWRBdElzbykgLyAxMDAwKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goc2hvdEVudHJpZXMubWFwKChlKSA9PiBlLm5hbWUpKTtcbiAgICBjb25zdCBidW5kbGVJZCA9IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KTtcbiAgICBjb25zdCBhcmNoaXZlTmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ3Rhci56c3QnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0T3B0cyA9IHtub3dJc286IGV4cG9ydGVkQXRJc28sIGJ1bmRsZUlkfTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0JywgbWFuaWZlc3RPcHRzKTtcblxuICAgIC8vIOKUgOKUgCBGYXN0IHBhdGg6IGFzc2VtYmxlICsgY29weSB0aGUgU2VuZC10by1BZ2VudCBwcm9tcHQgTk9XLCBiZWZvcmUgdGhlXG4gICAgLy8gaGVhdnkgd29yayAoZmV0Y2hpbmcgfjEyMCBza2lsbCBmaWxlcywgYnVpbGRpbmcgKyB6c3RkLXdyYXBwaW5nIHRoZSB0YXIsXG4gICAgLy8gcG9sbGluZyB0aGUgZG93bmxvYWQgdG8gY29tcGxldGlvbikuIFRoZSBjbGlwYm9hcmQgd3JpdGUgbXVzdCBsYW5kIHdoaWxlXG4gICAgLy8gdGhlIGNsaWNrJ3MgZm9jdXMgaXMgZnJlc2gg4oCUIENocm9tZSdzIGRvd25sb2FkIFVJIHN0ZWFscyBmb2N1cyBhbmQgbWFrZXNcbiAgICAvLyBuYXZpZ2F0b3IuY2xpcGJvYXJkIGZhaWwgc2lsZW50bHkuIFRoZSBidW5kbGUgdHJlZSdzIGVudHJ5IG5hbWVzIGFyZVxuICAgIC8vIERFVEVSTUlOSVNUSUMsIHNvIHdlIHByZWRpY3QgdGhlbSBmcm9tIHN0YXRpYyBkYXRhIChubyBmZXRjaCkgaW5zdGVhZCBvZlxuICAgIC8vIHdhaXRpbmcgb24gdGhlIGFzc2VtYmxlZCBhcmNoaXZlLlxuICAgIGNvbnN0IHtlbnRyaWVzOiBwYWdlSHRtbEVudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3M6IHBhZ2VIdG1sRGlhZ25vc3RpY3N9ID0gYXdhaXQgY29sbGVjdFBhZ2VIdG1sRW50cmllcygpO1xuICAgIGNvbnN0IGVudHJ5TmFtZXMgPSBbXG4gICAgICAnUkVBRE1FLm1kJywgJ3JlcGFpci1pbmRleC5tZCcsIGpzb25sTmFtZSwgJ3NjcmVlbnNob3RzLmpzb24nLCAnZHVja2RiLnNxbCcsICdzY2hlbWEuanNvbicsICdBR0VOVC1QUk9UT0NPTC5tZCcsICcuZ2l0aWdub3JlJyxcbiAgICAgIC4uLnNob3RFbnRyaWVzLm1hcCgoZSkgPT4gZS5uYW1lKSxcbiAgICAgICdERVNJR04ubWQnLCAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICAgIC4uLihwcmVmcy5idW5kbGVTa2lsbHMgJiYgQlVORExFRF9TS0lMTFNfUFJFU0VOVCA/IEJVTkRMRURfU0tJTExfRklMRVMubWFwKChmKSA9PiBmLmFyY2hpdmUpIDogW10pLFxuICAgICAgLi4ucGFnZUh0bWxFbnRyaWVzLm1hcCgoZSkgPT4gZS5uYW1lKSxcbiAgICBdLnNvcnQoKTtcbiAgICBjb25zdCBhZ2VudFByb21wdE9wdHMgPSB7XG4gICAgICB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgYnVuZGxlSWQsXG4gICAgICAvLyBQcmVkaWN0ZWQgRG93bmxvYWRzLXJlbGF0aXZlIHBhdGggKHRoZSBib290c3RyYXAgZXhwYW5kcyB0aGUgfik7IHRoZVxuICAgICAgLy8gcmVhbCBhYnNvbHV0ZSBwYXRoIGlzIHJlLWNvcGllZCBhZnRlciB0aGUgc2F2ZSByZXNvbHZlcy5cbiAgICAgIGFyY2hpdmVQYXRoOiBgfi9Eb3dubG9hZHMvcGluY2hncmFiLyR7YWN0aXZlV3N9L2V4cG9ydHMvJHthcmNoaXZlTmFtZX1gLFxuICAgICAgZXhwb3J0VHM6IGV4cG9ydGVkQXRJc28sXG4gICAgICBqc29ubE5hbWUsXG4gICAgICBjb3VudHM6IHtjb21tZW50czogbWFuaWZlc3QuY291bnRzLmZlZWRiYWNrLCBzZWxlY3RvcnM6IG1hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnMsIHBhZ2VzOiBtYW5pZmVzdC5jb3VudHMucGFnZXMsIHNjcmVlbnNob3RzOiBzaG90RW50cmllcy5sZW5ndGh9LFxuICAgICAgZW50cnlOYW1lcyxcbiAgICAgIGRlc2lnbklzVGVtcGxhdGU6IGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpLFxuICAgIH07XG4gICAgbGFzdEV4cG9ydC5hZ2VudFByb21wdCA9IGJ1aWxkQWdlbnRQcm9tcHRKc29ubChhZ2VudFByb21wdE9wdHMpO1xuICAgIGNvbnN0IGVhcmx5Q29waWVkID0gYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQpO1xuICAgIGlmIChlYXJseUNvcGllZCkgc2hvd0NvcGllZCgnUHJvbXB0IGNvcGllZCcsICdhc3NlbWJsaW5nIHRoZSBidW5kbGXigKYnKTtcblxuICAgIC8vIE5vdyB0aGUgaGVhdnkgYXNzZW1ibHkg4oCUIHRoZSBjbGlwYm9hcmQgYWxyZWFkeSBob2xkcyB0aGUgcHJvbXB0LiBMb2FkXG4gICAgLy8gdGhlIHZlbmRvcmVkIHNraWxscyAoKyBwYXJzZSB0aGUgaW5kZXggZm9yIHRoZSBtYW5pZmVzdC9SRUFETUUpLlxuICAgIGNvbnN0IHNraWxsRW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGxldCBza2lsbHNJbmRleDogU2tpbGxzSW5kZXggfCBudWxsID0gbnVsbDtcbiAgICBpZiAocHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQpIHtcbiAgICAgIGNvbnN0IGxvYWRlZCA9IGF3YWl0IFByb21pc2UuYWxsKEJVTkRMRURfU0tJTExfRklMRVMubWFwKGFzeW5jIChmKSA9PiAoe2YsIGRhdGE6IGF3YWl0IGxvYWRCdW5kbGVkU2tpbGxGaWxlKGYuZXh0KX0pKSk7XG4gICAgICBsZXQgc2tpcHBlZCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IHtmLCBkYXRhfSBvZiBsb2FkZWQpIHtcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkgeyBza2lwcGVkKys7IGNvbnRpbnVlOyB9XG4gICAgICAgIHNraWxsRW50cmllcy5wdXNoKHtuYW1lOiBmLmFyY2hpdmUsIGRhdGF9KTtcbiAgICAgICAgaWYgKGYuYXJjaGl2ZSA9PT0gJ3NraWxscy1pbmRleC5qc29uJykge1xuICAgICAgICAgIHRyeSB7IHNraWxsc0luZGV4ID0gSlNPTi5wYXJzZShkYXRhKSBhcyBTa2lsbHNJbmRleDsgfSBjYXRjaCB7IC8qIHVucmVhZGFibGUgaW5kZXgg4oCUIHRhYmxlIGRlZ3JhZGVzICovIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNraXBwZWQpIGNvbnNvbGUud2FybihMT0csIGBidW5kbGVkIHNraWxsczogJHtza2lwcGVkfS8ke2xvYWRlZC5sZW5ndGh9IGZpbGVzIG1pc3NpbmcgZnJvbSB0aGlzIGJ1aWxkIOKAlCBleHBvcnQgY29udGludWVzIHdpdGhvdXQgdGhlbWApO1xuICAgIH1cbiAgICBtYW5pZmVzdC5hZ2VudFByb3RvY29sID0ge2FyY2hpdmVQYXRoOiAnQUdFTlQtUFJPVE9DT0wubWQnfTtcbiAgICBpZiAoc2tpbGxzSW5kZXg/LnNraWxscz8ubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5idW5kbGVkU2tpbGxzID0gc2tpbGxzSW5kZXguc2tpbGxzLm1hcCgocykgPT4gKHtcbiAgICAgICAgaWQ6IHMuaWQsXG4gICAgICAgIGtpbmQ6IHMuaWQuc3RhcnRzV2l0aCgnaW1wZWNjYWJsZS8nKSA/ICdyZWZlcmVuY2UnIGFzIGNvbnN0IDogJ3NraWxsJyBhcyBjb25zdCxcbiAgICAgICAgYXJjaGl2ZVBhdGg6IHMucGF0aCxcbiAgICAgICAgLi4uKHMuaW52b2tlID8ge2ludm9jYXRpb246IHMuaW52b2tlfSA6IHt9KSxcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgaWYgKHBhZ2VzTWV0YS5sZW5ndGgpIHtcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbCA9IHBhZ2VzTWV0YTtcbiAgICAgIG1hbmlmZXN0LmNvdW50cy5wYWdlc0h0bWwgPSBwYWdlc01ldGEubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAocGFnZUh0bWxEaWFnbm9zdGljcy5sZW5ndGgpIHtcbiAgICAgIG1hbmlmZXN0LmV4cG9ydERpYWdub3N0aWNzID0gWy4uLihtYW5pZmVzdC5leHBvcnREaWFnbm9zdGljcyA/PyBbXSksIC4uLnBhZ2VIdG1sRGlhZ25vc3RpY3NdO1xuICAgIH1cbiAgICAvLyBUaGUgSlNPTkwgaW5zaWRlIHRoZSBhcmNoaXZlIG11c3QgZGVjbGFyZSBpdHNlbGYgYXMgcGFydCBvZiBhXG4gICAgLy8gdGFyLnpzdCBidW5kbGUgc28gaXRzIG1hbmlmZXN0J3MgYGRlc2lnbi5pbmxpbmVgIC8gYHNraWxsLmlubGluZWBcbiAgICAvLyBmbGFncyBtYXRjaCB3aGF0J3MgYWN0dWFsbHkgcHJlc2VudCBpbiB0aGUgc3Vycm91bmRpbmcgdGFyLlxuICAgIGNvbnN0IGpzb25sVGV4dCA9IGJ1aWxkSnNvbmwoanNvbmxOYW1lLCAndGFyLnpzdCcsIG1hbmlmZXN0T3B0cyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIGNvbnN0IHJlYWRtZSA9IGJ1aWxkUmVhZG1lKG1hbmlmZXN0LCBqc29ubE5hbWUsIHNob3RFbnRyaWVzLmxlbmd0aCk7XG4gICAgY29uc3Qgc2hvdHNKc29uID0gYnVpbGRTY3JlZW5zaG90c0luZGV4KGJ1bmRsZWQsIGV4cG9ydGVkQXRJc28pO1xuXG4gICAgLy8gTWFya2Rvd24gZXhwb3J0IHdhcyBkcm9wcGVkOiBpdCBjYXJyaWVkIG5vIGRhdGEgdGhlIEpTT05MIGRpZG4ndFxuICAgIC8vIGFscmVhZHkgaGF2ZSAodGhlIGh1bWFuLXJlYWRhYmxlIHN1cmZhY2Ugd2FzIGp1c3QgYSBjdXJhdGVkIHN1YnNldFxuICAgIC8vIG9mIHRoZSBzYW1lIGZpZWxkcyksIGFuZCB0aGUgZGl2ZXJnZW5jZSDigJQgbWQgc2lsZW50bHkgZHJvcHBlZFxuICAgIC8vIGdyb3VwIGNoaWxkcmVuICsgdGhlIGVudGlyZSBgX2F1ZGl0YCBuYW1lc3BhY2Ug4oCUIHJpc2tlZFxuICAgIC8vIG1pc2xlYWRpbmcgYW55IGh1bWFuIHNraW0uIFJFQURNRS5tZCBpbnNpZGUgdGhlIGFyY2hpdmUgaXMgdGhlXG4gICAgLy8gaHVtYW4gZW50cnkgcG9pbnQgbm93LlxuICAgIC8vIEJ1ZyAjNzogZ2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIHRoZSBhZ2VudCdzIGZpcnN0LXJlYWQgZW50cnlcbiAgICAvLyBwb2ludC4gQnVnICM0MCBmaXJzdC1yZWFkIG9yZGVyOiBSRUFETUUgcG9pbnRzIHRoZSByZWNlaXZlciBhdFxuICAgIC8vIHJlcGFpci1pbmRleC5tZCBiZWZvcmUgU0tJTEwubWQgLyBERVNJR04ubWQuXG4gICAgY29uc3QgcmVwYWlySW5kZXggPSBidWlsZFJlcGFpckluZGV4KG1hbmlmZXN0LCBqc29ubE5hbWUpO1xuICAgIGNvbnN0IHRhckVudHJpZXM6IFRhckVudHJ5W10gPSBbXG4gICAgICB7bmFtZTogJ1JFQURNRS5tZCcsIGRhdGE6IHJlYWRtZX0sXG4gICAgICB7bmFtZTogJ3JlcGFpci1pbmRleC5tZCcsIGRhdGE6IHJlcGFpckluZGV4fSxcbiAgICAgIHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IGpzb25sVGV4dH0sXG4gICAgICB7bmFtZTogJ3NjcmVlbnNob3RzLmpzb24nLCBkYXRhOiBzaG90c0pzb259LFxuICAgICAge25hbWU6ICdkdWNrZGIuc3FsJywgZGF0YTogc3FsfSxcbiAgICAgIC8vIEJ1ZyAjMjg6IG1hY2hpbmUtcmVhZGFibGUgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlLlxuICAgICAge25hbWU6ICdzY2hlbWEuanNvbicsIGRhdGE6IGJ1aWxkU2NoZW1hSnNvbigpfSxcbiAgICAgIC4uLnNob3RFbnRyaWVzLFxuICAgIF07XG4gICAgLy8gREVTSUdOLm1kIOKAlCBlaXRoZXIgdGhlIHVzZXIncyBjdXN0b21pemVkIGNvbnRlbnQgb3IgdGhlIGJ1bmRsZWRcbiAgICAvLyB0ZW1wbGF0ZSAvIGxvY2FsIG92ZXJyaWRlLiBSZXNvbHZlZCB0aHJvdWdoIHRoZSBzYW1lIGxvYWRlciB0aGVcbiAgICAvLyBzZXR0aW5ncyBtb2RhbCB1c2VzIHNvIGNocm9tZS5zdG9yYWdlIHN0YXlzIHNtYWxsIChlbXB0eSBwcmVmc1xuICAgIC8vIOKGkiBmYWxsYmFjayB0byBleHRlbnNpb24vdGVtcGxhdGVzLyoubWQgdmlhIGZldGNoKS5cbiAgICBjb25zdCBkZXNpZ25Db250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICBpZiAoZGVzaWduQ29udGVudC50cmltKCkpIHtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0RFU0lHTi5tZCcsIGRhdGE6IGRlc2lnbkNvbnRlbnR9KTtcbiAgICB9XG4gICAgLy8gUGluY2hHcmFiIFVJIHNraWxsIOKAlCBzYW1lIHN0b3J5LiBMaXZlcyBhdCB0aGUgY2Fub25pY2FsIHJlY2VpdmVyXG4gICAgLy8gcGF0aCBpbnNpZGUgdGhlIGFyY2hpdmUgc28gdGhlIHJlY2VpdmVyJ3MgYC5hZ2VudHMvYCB0cmVlIGNhbiBiZVxuICAgIC8vIHBvcHVsYXRlZCBieSBhIHNpbXBsZSBgdGFyIC14YCBmcm9tIHRoZSBhcmNoaXZlIHJvb3QuXG4gICAgLy9cbiAgICAvLyBGcm9udG1hdHRlciByZW5hbWU6IGEgdXNlcidzIHNvdXJjZSBTS0lMTC5tZCBtYXkgdXNlIGBuYW1lOiB1aWBcbiAgICAvLyAoYmVjYXVzZSB0aGF0J3MgaG93IGl0J3MgY2F0YWxvZ3VlZCBpbiB0aGVpciBnbG9iYWwgYC5hZ2VudHMvYFxuICAgIC8vIHNraWxscyB0cmVlKS4gSW5zaWRlIGEgUGluY2hHcmFiIGFyY2hpdmUgdGhlIHNraWxsIGlzICp0aGUqXG4gICAgLy8gUGluY2hHcmFiIHNraWxsLCBzbyB3ZSByZWJyYW5kIHRoZSBmcm9udG1hdHRlciBgbmFtZTpgIGZpZWxkIG9uXG4gICAgLy8gdGhlIHdheSBpbnRvIHRoZSB0YXIgd2l0aG91dCB0b3VjaGluZyB0aGUgYm9keS4gT25seSB0aGUgRklSU1RcbiAgICAvLyBgbmFtZTpgIGxpbmUgaW5zaWRlIHRoZSBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHJld3JpdHRlbi5cbiAgICBjb25zdCBza2lsbENvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgaWYgKHNraWxsQ29udGVudC50cmltKCkpIHtcbiAgICAgIGNvbnN0IHJlYnJhbmRlZCA9IHJlYnJhbmRTa2lsbE5hbWUoc2tpbGxDb250ZW50LCAnUGluY2hHcmFiJyk7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLCBkYXRhOiByZWJyYW5kZWR9KTtcbiAgICB9XG4gICAgLy8gVmVuZG9yZWQgc2tpbGxzICsgb3B0LWluIHBhZ2UgSFRNTCAobG9hZGVkIGFib3ZlLCBiZWZvcmUgdGhlIGRvY3MpLlxuICAgIHRhckVudHJpZXMucHVzaCguLi5za2lsbEVudHJpZXMsIC4uLnBhZ2VIdG1sRW50cmllcyk7XG4gICAgLy8gQUdFTlQtUFJPVE9DT0wubWQg4oCUIHRoZSBmdWxsIFNlbmQtdG8tQWdlbnQgZG9jdHJpbmUuIFVzZXMgdGhlIFNBTUVcbiAgICAvLyBhZ2VudFByb21wdE9wdHMgKHByZWRpY3RlZCBlbnRyeSBuYW1lcykgYXMgdGhlIGNsaXBib2FyZCBwYXlsb2FkLCBzb1xuICAgIC8vIHRoZSBpbi1idW5kbGUgZG9jdHJpbmUgYW5kIHRoZSBjb3BpZWQgcHJvbXB0IGFncmVlIGV4YWN0bHkuXG4gICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnQUdFTlQtUFJPVE9DT0wubWQnLCBkYXRhOiBidWlsZEFnZW50UHJvdG9jb2xNZCh7Li4uYWdlbnRQcm9tcHRPcHRzLCBza2lsbHNJbmRleH0pfSk7XG4gICAgLy8gQnVuZGxlIC5naXRpZ25vcmU6IG1hcmtzIHRoZSByZWFkLWxhemlseSBzY2FmZm9sZGluZyAoc2tpbGxzLFxuICAgIC8vIHNjcmVlbnNob3RzLCBsaWNlbnNlcywgaW5kZXhlcykgc28gdG9rZW4gZXN0aW1hdG9ycyBkaXNjb3VudCBpdCBhbmRcbiAgICAvLyBhZ2VudHMgbG9hZCBvbmx5IHRoZSBzaWduYWwgdXAgZnJvbnQuIFBsYWNlZCBsYXN0IHNvIGl0IGNhbid0IHNoYWRvd1xuICAgIC8vIGEgcmVhbCBlbnRyeSBuYW1lLlxuICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJy5naXRpZ25vcmUnLCBkYXRhOiBidWlsZEJ1bmRsZUlnbm9yZSgpfSk7XG4gICAgLy8gVG9rZW4gYnVkZ2V0OiBzaWduYWwgKHVwLWZyb250IHJlYWQpIHZzIHRvdGFsLiBSZXBvcnRlZCBpbiB0aGVcbiAgICAvLyBtYW5pZmVzdCBzbyB0aGUgcmVjZWlwdCByZWZsZWN0cyB3aGF0IHRoZSBhZ2VudCBhY3R1YWxseSBpbmdlc3RzLFxuICAgIC8vIG5vdCB0aGUgfjEuMiBNQiBvZiBsYXp5IHNjYWZmb2xkaW5nLlxuICAgIGxldCBzaWduYWxCeXRlcyA9IDA7IGxldCB0b3RhbEJ5dGVzID0gMDtcbiAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykge1xuICAgICAgY29uc3QgYiA9IHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGUuZGF0YSkubGVuZ3RoIDogKGUuZGF0YSBhcyBVaW50OEFycmF5KS5sZW5ndGg7XG4gICAgICB0b3RhbEJ5dGVzICs9IGI7XG4gICAgICBpZiAoaXNTaWduYWxQYXRoKGUubmFtZSwganNvbmxOYW1lKSkgc2lnbmFsQnl0ZXMgKz0gYjtcbiAgICB9XG4gICAgbWFuaWZlc3QudG9rZW5zID0ge1xuICAgICAgc2lnbmFsQnl0ZXMsIHRvdGFsQnl0ZXMsXG4gICAgICBzaWduYWxUb2tlbnM6IE1hdGguY2VpbChzaWduYWxCeXRlcyAvIDQpLCB0b3RhbFRva2VuczogTWF0aC5jZWlsKHRvdGFsQnl0ZXMgLyA0KSxcbiAgICAgIGlnbm9yZTogJy5naXRpZ25vcmUnLFxuICAgIH07XG4gICAgLy8gUmVidWlsZCB0aGUgbWFuaWZlc3QgbGluZSBpbiB0aGUgSlNPTkwgd2l0aCBhcmNoaXZlSW50ZWdyaXR5XG4gICAgLy8gKGZpbGUgbGlzdCArIHNpemVzKS4gSGFzIHRvIGhhcHBlbiBBRlRFUiBhbGwgdGFyRW50cmllcyBhcmVcbiAgICAvLyBhc3NlbWJsZWQgYnV0IEJFRk9SRSB3ZSB0YXIgdGhlbSwgc28gd2Uga25vdyB3aGF0J3MgaW4gdGhlXG4gICAgLy8gYnVuZGxlLiBUaGVuIHdlIHJlcGxhY2UgdGhlIEpTT05MJ3MgbWFuaWZlc3Qgd2l0aCB0aGUgYXVnbWVudGVkXG4gICAgLy8gdmVyc2lvbi5cbiAgICB0cnkge1xuICAgICAgY29uc3QgaW50ZWdyaXR5OiB7ZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+fSA9IHtmaWxlczogW119O1xuICAgICAgZm9yIChjb25zdCBlIG9mIHRhckVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGUuZGF0YSkgOiAoZS5kYXRhIGFzIFVpbnQ4QXJyYXkpO1xuICAgICAgICBpbnRlZ3JpdHkuZmlsZXMucHVzaCh7cGF0aDogZS5uYW1lLCBzaXplOiBkYXRhLmxlbmd0aH0pO1xuICAgICAgfVxuICAgICAgLy8gUmUtZW1pdCB0aGUgSlNPTkwgd2l0aCB0aGUgYXVnbWVudGVkIG1hbmlmZXN0LiBDaGVhcGVyIHRvIGRvXG4gICAgICAvLyB0aGlzIHJlLXJlbmRlciB0aGFuIHRvIG1haW50YWluIG11dGFibGUgc3RhdGUgdGhyb3VnaCB0aGUgc2xpbVxuICAgICAgLy8gZW1pdC4gV2Ugc3dhcCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGluLXBsYWNlLlxuICAgICAgY29uc3QgYXVnbWVudGVkTWFuaWZlc3QgPSB7Li4ubWFuaWZlc3QsIGFyY2hpdmVJbnRlZ3JpdHk6IGludGVncml0eX07XG4gICAgICBjb25zdCBsaW5lcyA9IGpzb25sVGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICBsaW5lc1swXSA9IEpTT04uc3RyaW5naWZ5KGF1Z21lbnRlZE1hbmlmZXN0KTtcbiAgICAgIGNvbnN0IG5ld0pzb25sID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICBjb25zdCBpZHggPSB0YXJFbnRyaWVzLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBqc29ubE5hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB0YXJFbnRyaWVzW2lkeF0gPSB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBuZXdKc29ubH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnYXJjaGl2ZUludGVncml0eSBjb21wdXRhdGlvbiBmYWlsZWQnLCBlcnIpO1xuICAgIH1cblxuICAgIC8vIFN0YW1wIGV2ZXJ5IGVudHJ5IHdpdGggdGhlIGV4cG9ydCBjbG9jayBzbyBhcmNoaXZlIGJ5dGVzIGFyZSBhIHB1cmVcbiAgICAvLyBmdW5jdGlvbiBvZiBjb250ZW50ICsgY2xvY2sgKGJ1aWxkVGFyIHdvdWxkIG90aGVyd2lzZSBzYW1wbGUgbm93KCkpLlxuICAgIC8vIFRoZSBTZW5kLXRvLUFnZW50IHByb21wdCB3YXMgYWxyZWFkeSBjb3BpZWQgYXQgdGhlIHRvcCBvZiB0aGlzXG4gICAgLy8gZnVuY3Rpb24gKGZhc3QgcGF0aCk7IG9ubHkgdGhlIGFyY2hpdmUgYnl0ZXMgcmVtYWluIHRvIGJlIHNhdmVkLlxuICAgIGZvciAoY29uc3QgZSBvZiB0YXJFbnRyaWVzKSBlLm10aW1lID8/PSBtdGltZVNlYztcbiAgICBjb25zdCB0YXJCeXRlcyA9IGJ1aWxkVGFyKHRhckVudHJpZXMpO1xuICAgIGNvbnN0IGFyY2hpdmVCeXRlcyA9IHdyYXBac3RkKHRhckJ5dGVzKTtcblxuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIOKGkicsIHthcmNoaXZlTmFtZSwgdGFyQnl0ZXM6IHRhckJ5dGVzLmxlbmd0aCwgYXJjaGl2ZUJ5dGVzOiBhcmNoaXZlQnl0ZXMubGVuZ3RoLCBzY3JlZW5zaG90czogc2hvdEVudHJpZXMubGVuZ3RofSk7XG4gICAgICAvLyBQYXNzIGFzIGEgcGxhaW4gbnVtYmVyW10gb3ZlciBzZW5kTWVzc2FnZTsgc3RydWN0dXJlZC1jbG9uZSBvZlxuICAgICAgLy8gVWludDhBcnJheSB2aWEgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UgaXNuJ3QgcmVsaWFibGUgYWNyb3NzXG4gICAgICAvLyBDaHJvbWUgdmVyc2lvbnMuXG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2F2ZS1ieXRlcycsIHdvcmtzcGFjZTogYWN0aXZlV3MsIGZpbGVuYW1lOiBhcmNoaXZlTmFtZSxcbiAgICAgICAgYnl0ZXM6IEFycmF5LmZyb20oYXJjaGl2ZUJ5dGVzKSwgbWltZTogJ2FwcGxpY2F0aW9uL3pzdGQnLFxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdvbkV4cG9ydEFyY2hpdmUgcmVwbHk6JywgcmVwbHkpO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5hYnNQYXRoKSB7XG4gICAgICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IHJlcGx5LmZpbGVuYW1lID8/IG51bGw7XG4gICAgICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSByZXBseS5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gQm9vbGVhbihyZXBseS50ZW1wUGF0aCk7XG4gICAgICAgIGxhc3RFeHBvcnQua2luZCA9ICd0YXIuenN0JztcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgLy8gUmVmcmVzaCB0aGUgYWxyZWFkeS1jb3BpZWQgcGF5bG9hZCB3aXRoIHRoZSBSRUFMIHNhdmVkIHBhdGguXG4gICAgICAgIC8vIEJlc3QtZWZmb3J0OiBmb2N1cyBtYXkgYmUgZ29uZSBieSBub3csIGFuZCB0aGUgZWFybHkgY29weSBhYm92ZVxuICAgICAgICAvLyBhbHJlYWR5IGhvbGRzIGEgdmFsaWQgcGF5bG9hZCAocHJlZGljdGVkIH4vRG93bmxvYWRzIHBhdGgpLlxuICAgICAgICBjb25zdCBwYXRoVG9Db3B5ID0gbGFzdEV4cG9ydC5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmFnZW50UHJvbXB0ID0gYnVpbGRBZ2VudFByb21wdEpzb25sKHsuLi5hZ2VudFByb21wdE9wdHMsIGFyY2hpdmVQYXRoOiBwYXRoVG9Db3B5fSk7XG4gICAgICAgIGNvbnN0IGxhdGVDb3BpZWQgPSBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQobGFzdEV4cG9ydC5hZ2VudFByb21wdCk7XG4gICAgICAgIGNvbnN0IHByb21wdENvcGllZCA9IGxhdGVDb3BpZWQgfHwgZWFybHlDb3BpZWQ7XG4gICAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICAgIGlmIChwcm9tcHRDb3BpZWQpIHNob3dDb3BpZWQoJ1NlbnQgdG8gYWdlbnQnLCAncHJvbXB0IGNvcGllZCDigJQgcGFzdGUgaW50byB5b3VyIGNvZGluZyBhZ2VudCcpO1xuICAgICAgICBzZXRTdGF0dXMoXG4gICAgICAgICAgYFNlbnQgdG8gYWdlbnQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkJHtwcm9tcHRDb3BpZWQgPyAnIMK3IHByb21wdCBjb3BpZWQnIDogJyDCtyBjbGlwYm9hcmQgYmxvY2tlZCDigJQgdXNlIENtZCtLIOKGkiBDb3B5IFNlbmQtdG8tQWdlbnQgcHJvbXB0J30ke2xhc3RFeHBvcnQudGVtcFBhdGggPyAnIMK3IFBsYXl3cmlnaHQgdGVtcCBoaWRkZW4nIDogJyd9IMK3ICR7bGVhZn1gLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ29uRXhwb3J0QXJjaGl2ZSBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgQXJjaGl2ZSBleHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gVGVzdC9kZXYgZmFsbGJhY2s6IHN5bnRoZXNpemUgYSBkb3dubG9hZCBsaW5rLlxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYXJjaGl2ZUJ5dGVzIGFzIHVua25vd24gYXMgQmxvYlBhcnRdLCB7dHlwZTogJ2FwcGxpY2F0aW9uL3pzdGQnfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDsgYS5kb3dubG9hZCA9IGFyY2hpdmVOYW1lOyBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgLy8gVGhlIHByZWRpY3RlZC1wYXRoIHBheWxvYWQgd2FzIGFscmVhZHkgY29waWVkIGJlZm9yZSB0aGUgc2F2ZS5cbiAgICBzaG93Q29waWVkKCdTZW50IHRvIGFnZW50JywgJ3Byb21wdCBjb3BpZWQg4oCUIHBhc3RlIGludG8geW91ciBjb2RpbmcgYWdlbnQnKTtcbiAgICBzZXRTdGF0dXMoYFNlbnQgdG8gYWdlbnQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkJHtlYXJseUNvcGllZCA/ICcgwrcgcHJvbXB0IGNvcGllZCcgOiAnJ31gKTtcbiAgfTtcblxuICAvLyBCZXN0LWVmZm9ydCBjbGlwYm9hcmQgd3JpdGUg4oCUIG5ldmVyIHRocm93czsgcmV0dXJucyB3aGV0aGVyIHRoZVxuICAvLyB3cml0ZSBzdWNjZWVkZWQgc28gdGhlIGNhbGxlciBjYW4gYWRqdXN0IHRoZSBzdGF0dXMgbWVzc2FnZS5cbiAgLy8gQ2xpcGJvYXJkIHdyaXRlcyBjYW4gZmFpbCB3aGVuIHRoZSBwYW5lbCBkb2Vzbid0IGhhdmUgZm9jdXMgb3IgaW5cbiAgLy8gc29tZSB0ZXN0IGhhcm5lc3NlcywgYW5kIHdlIGRvbid0IHdhbnQgdGhhdCB0byBibG9jayB0aGUgZXhwb3J0LlxuICBjb25zdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQgPSBhc3luYyAodGV4dDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgdHJ5IHsgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7IHJldHVybiB0cnVlOyB9XG4gICAgY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfTtcbiAgLy8g4pSA4pSA4pSAIER1Y2tEQiBzbmlwcGV0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDYW5vbmljYWwgU1FMIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIGEgSlNPTkwgZXhwb3J0LiBDb3BpZXMgdG8gY2xpcGJvYXJkXG4gIC8vIGFuZCBwcmludHMgYSBzdGF0dXMgbWVzc2FnZSDigJQgd2UgZG9uJ3QgcnVuIER1Y2tEQiBvdXJzZWx2ZXMsIHRoZSB1c2VyXG4gIC8vIHBpcGVzIHRoZSBzbmlwcGV0IGludG8gYGR1Y2tkYmAgb24gdGhlaXIgbWFjaGluZS4gVGhlIHJlY2lwZXMgdGFyZ2V0XG4gIC8vIHF1ZXN0aW9ucyBhIFVJLWVuZ2luZWVyIExMTSB3b3JrZmxvdyB0ZW5kcyB0byBhc2s6IGxpc3QgY2FwdHVyZXMgYnlcbiAgLy8gaG9zdCwgZmluZCBkdXBsaWNhdGUgb3V0ZXJIVE1MLCBmaW5kIGNhcHR1cmVzIG1pc3NpbmcgYSBzY3JlZW5zaG90LFxuICAvLyBhbmQgdW5pcXVlLXRva2VuIGZyZXF1ZW5jeSBmb3IgYSBxdWljayBkZXNpZ24tdG9rZW5zIG92ZXJ2aWV3LlxuICBjb25zdCBkdWNrRGJTbmlwcGV0ID0gKGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IGAtLSBQaW5jaEdyYWIg4oaSIER1Y2tEQiByZWNpcGVzXG4tLSBTYXZlIHlvdXIgSlNPTkwgZXhwb3J0LCB0aGVuIGluIHlvdXIgc2hlbGw6XG4tLSAgIGR1Y2tkYiA8IHRoaXNfZmlsZS5zcWxcbi0tIE9yIG9wZW4gYSBkdWNrZGIgc2hlbGwgYW5kIHBhc3RlIHRoZXNlIG9uZSBhdCBhIHRpbWUuXG5cbi0tIDEpIExvYWQgdGhlIEpTT05MIGludG8gYSB0YWJsZS5cbi0tICAgIHNhbXBsZV9zaXplPS0xIGZvcmNlcyBhIGZ1bGwtZmlsZSBzY2FuIGZvciBzY2hlbWEgaW5mZXJlbmNlLiBXaXRob3V0XG4tLSAgICBpdCwgRHVja0RCIG9ubHkgc25pZmZzIHRoZSBmaXJzdCAyMCA0ODAgcm93cyDigJQgYW5kIFBpbmNoR3JhYiBleHBvcnRzXG4tLSAgICBtaXggc2VsZWN0b3IgKyBmZWVkYmFjayByb3cgdHlwZXMsIHNvIHJhcmUgZmVlZGJhY2stb25seSBmaWVsZHNcbi0tICAgICh0YWdzLCBwYXJlbnRVaWQpIGNhbiBiZSBkcm9wcGVkIGZyb20gdGhlIGluZmVycmVkIHNjaGVtYSBpZiB0aGV5XG4tLSAgICBkb24ndCBhcHBlYXIgZWFybHkgZW5vdWdoLiBUaGF0IGJpdGVzIHJlY2lwZSA2IGJlbG93LlxuQ1JFQVRFIE9SIFJFUExBQ0UgVEFCTEUgcGcgQVNcblNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oXG4gICcke2pzb25sTmFtZX0nLFxuICBmb3JtYXQ9J25ld2xpbmVfZGVsaW1pdGVkJyxcbiAgbWF4aW11bV9vYmplY3Rfc2l6ZT0xMDQ4NTc2MDAsXG4gIHNhbXBsZV9zaXplPS0xXG4pO1xuXG4tLSAyKSBRdWljayBvdmVydmlldzogaG93IG1hbnkgY2FwdHVyZXMgcGVyIGhvc3QuXG5TRUxFQ1RcbiAgcmVnZXhwX2V4dHJhY3QodXJsLCAnOi8vKFteL10rKScsIDEpIEFTIGhvc3QsXG4gIENPVU5UKCopIEZJTFRFUiAoV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicpIEFTIGNhcHR1cmVzLFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnZmVlZGJhY2snKSBBUyBjb21tZW50c1xuRlJPTSBwZ1xuR1JPVVAgQlkgMVxuT1JERVIgQlkgY2FwdHVyZXMgREVTQztcblxuLS0gMykgRmluZCBkdXBsaWNhdGUgb3V0ZXJIVE1MIGFjcm9zcyBjYXB0dXJlcyAob2Z0ZW4gc2lnbmFscyBhIHJldXNlZFxuLS0gICAgY29tcG9uZW50IHRoZSB1c2VyIGhhcyBjbGlja2VkIGludG8gbXVsdGlwbGUgdGltZXMpLlxuU0VMRUNUIG91dGVySFRNTCwgQ09VTlQoKikgQVMgaGl0cywgbGlzdChzZWxlY3RvcikgQVMgc2VsZWN0b3JzXG5GUk9NIHBnXG5XSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgb3V0ZXJIVE1MIElTIE5PVCBOVUxMXG5HUk9VUCBCWSBvdXRlckhUTUxcbkhBVklORyBoaXRzID4gMVxuT1JERVIgQlkgaGl0cyBERVNDXG5MSU1JVCAyNTtcblxuLS0gNCkgQ2FwdHVyZXMgc3RpbGwgbWlzc2luZyBhIHNjcmVlbnNob3QgcGF0aC5cblNFTEVDVCBuLCB1cmwsIHNlbGVjdG9yXG5GUk9NIHBnXG5XSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgc2NyZWVuc2hvdCBJUyBOVUxMXG5PUkRFUiBCWSBuO1xuXG4tLSA1KSBRdWljayBkZXNpZ24tdG9rZW4gc3VyZmFjZTogcmFuayBjbGFzc2VzIHRoYXQgYXBwZWFyIGluIG1hbnkgY2FwdHVyZXMuXG4tLSAgICBOT1RFOiBmaWx0ZXIgY2xhc3NlcyBJUyBOT1QgTlVMTCByYXRoZXIgdGhhbiB1c2luZyBhIGNvYWxlc2NlLXdpdGgtZW1wdHlcbi0tICAgIGZhbGxiYWNrOyBEdWNrREIgY2Fubm90IGluZmVyIGVsZW1lbnQgdHlwZXMgZm9yIGFuIGVtcHR5IGxpc3QgbGl0ZXJhbC5cbldJVEggZXhwYW5kZWQgQVMgKFxuICBTRUxFQ1QgdW5uZXN0KGNsYXNzZXMpIEFTIGNcbiAgRlJPTSBwZ1xuICBXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgY2xhc3NlcyBJUyBOT1QgTlVMTFxuKVxuU0VMRUNUIGMsIENPVU5UKCopIEFTIGhpdHNcbkZST00gZXhwYW5kZWRcbkdST1VQIEJZIDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMzA7XG5cbi0tIDYpIENvbW1lbnRzIGpvaW5lZCB0byB0aGVpciBwYXJlbnQgc2VsZWN0b3IgdmlhIHBhcmVudFVpZC4gVGhlXG4tLSAgICBzLnR5cGUgZmlsdGVyIHByZXZlbnRzIGFuIGFjY2lkZW50YWwgZmVlZGJhY2vihpRmZWVkYmFjayBqb2luIGluIGNhc2Vcbi0tICAgIHR3byByb3dzIGV2ZXIgc2hhcmUgYSB1aWQgYnkgY29pbmNpZGVuY2UuXG5TRUxFQ1Qgcy5uLCBzLnNlbGVjdG9yLCBmLnRleHQsIGYudGFnc1xuRlJPTSBwZyBmXG5KT0lOIHBnIHNcbiAgT04gcy51aWQgPSBmLnBhcmVudFVpZFxuIEFORCBzLnR5cGUgPSAnc2VsZWN0b3InXG5XSEVSRSBmLnR5cGUgPSAnZmVlZGJhY2snXG5PUkRFUiBCWSBzLm47XG5gO1xuICBjb25zdCBvbkR1Y2tEYlNuaXBwZXQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgLy8gUHJlZmVyIHRoZSBKU09OTCBmaWxlbmFtZSBvZiB0aGUgbW9zdCByZWNlbnQgZXhwb3J0IHNvIHRoZSB1c2VyIGNhblxuICAgIC8vIHBhc3RlIHRoaXMgZGlyZWN0bHkgd2l0aG91dCBlZGl0aW5nIHRoZSByZWFkX2pzb25fYXV0byBwYXRoLiBGYWxsXG4gICAgLy8gYmFjayB0byBhIGZyZXNoIGVwb2NoLWJhc2VkIG5hbWUgaWYgbm90aGluZyBoYXMgYmVlbiBleHBvcnRlZCB5ZXQuXG4gICAgY29uc3QgbGFzdCA9IGxhc3RFeHBvcnQucmVsUGF0aDtcbiAgICBjb25zdCBqc29ubE5hbWUgPSAobGFzdCAmJiAvXFwuanNvbmwkLy50ZXN0KGxhc3QpKVxuICAgICAgPyBsYXN0LnNwbGl0KCcvJykucG9wKCkhICAvLyBzdHJpcCB3b3Jrc3BhY2UvZXhwb3J0cy8gcHJlZml4XG4gICAgICA6IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzcWwpO1xuICAgICAgc2V0U3RhdHVzKGBEdWNrREIgcmVjaXBlcyBjb3BpZWQgwrcgcGFzdGUgaW50byBcXGBkdWNrZGJcXGAgc2hlbGwgwrcgcmVmZXJlbmNlcyAke2pzb25sTmFtZX1gKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBEdWNrREIgU1FMJywganNvbmxOYW1lKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIGZhaWxlZCDigJQgb3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignQ2xpcGJvYXJkIGZhaWxlZCcsICdPcGVuIHRoZSBwYW5lbCBpbiBhbiBleHRlbnNpb24gY29udGV4dCcpO1xuICAgIH1cbiAgfTtcbiAgLy8g4pSA4pSA4pSAIFNjaGVtYSBtaWdyYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENvbnZlcnQgYSB2MS1zaGFwZWQgRW50cnktb3ItZXhwb3J0LWxpbmUgaW50byBvdXIgaW50ZXJuYWwgRW50cnkuIElkZW1wb3RlbnQuXG4gIC8vIFN1cHBvcnRzOlxuICAvLyAgIOKAoiBmbGF0IHYxIGVudHJ5IChubyBgX2F1ZGl0YCwgbm8gYHZgIGZpZWxkKVxuICAvLyAgIOKAoiB2MiBleHBvcnQgZW50cnkgKGhhcyBgX2F1ZGl0YCwgYHY6IDJgLCBgdHlwZTogJ3NlbGVjdG9yJ2ApXG4gIC8vICAg4oCiIG1peGVkIChzb21lIGZpZWxkcyBuZXN0ZWQsIHNvbWUgZmxhdCDigJQgbGFzdCB3aW5zIGZvciBzYWZldHkpXG4gIC8vIFB1cmU6IG5ldmVyIG11dGF0ZXMgYHJhd2Agb3IgYW55IG9mIGl0cyBuZXN0ZWQgb2JqZWN0cy4gUmV0dXJucyBhIG5ld1xuICAvLyBlbnRyeSB3aXRoIGFsbCBtaWdyYXRpb25zIGFwcGxpZWQuIFRvdWNoZWQgc3Vib2JqZWN0cyAoYXR0cnMsIGhpbnRzLFxuICAvLyBncm91cCBtZW1iZXJzKSBhcmUgY2xvbmVkIGJlZm9yZSBlZGl0OyB1bnRvdWNoZWQgb25lcyBzaGFyZSByZWZzIHdpdGhcbiAgLy8gcmF3LCB3aGljaCBpcyBmaW5lIHNpbmNlIHdlIG5ldmVyIHdyaXRlIHRvIHRoZW0uXG4gIGNvbnN0IGRlbm9ybWFsaXplRW50cnkgPSAocmF3OiBhbnkpOiBFbnRyeSA9PiB7XG4gICAgY29uc3Qgb3V0OiBhbnkgPSB7Li4ucmF3fTtcbiAgICBkZWxldGUgb3V0LnY7XG4gICAgZGVsZXRlIG91dC50eXBlO1xuICAgIGRlbGV0ZSBvdXQuZmVlZGJhY2s7XG4gICAgaWYgKG91dC5fYXVkaXQgJiYgdHlwZW9mIG91dC5fYXVkaXQgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBhID0gb3V0Ll9hdWRpdDtcbiAgICAgIGlmIChhLmFuY2VzdG9ycyAhPT0gdW5kZWZpbmVkKSBvdXQuYW5jZXN0b3JzID0gYS5hbmNlc3RvcnM7XG4gICAgICBpZiAoYS5jb21wb25lbnRSb290ICE9PSB1bmRlZmluZWQpIG91dC5jb21wb25lbnRSb290ID0gYS5jb21wb25lbnRSb290O1xuICAgICAgaWYgKGEuaW5TaGFkb3dET00gIT09IHVuZGVmaW5lZCkgb3V0LmluU2hhZG93RE9NID0gYS5pblNoYWRvd0RPTTtcbiAgICAgIGlmIChhLnBzZXVkb0VsZW1lbnRzICE9PSB1bmRlZmluZWQpIG91dC5wc2V1ZG9FbGVtZW50cyA9IGEucHNldWRvRWxlbWVudHM7XG4gICAgICBpZiAoYS5tYXRjaGVkUnVsZXMgIT09IHVuZGVmaW5lZCkgb3V0Lm1hdGNoZWRSdWxlcyA9IGEubWF0Y2hlZFJ1bGVzO1xuICAgICAgaWYgKGEudmlld3BvcnQgIT09IHVuZGVmaW5lZCkgb3V0LnZpZXdwb3J0ID0gYS52aWV3cG9ydDtcbiAgICAgIGRlbGV0ZSBvdXQuX2F1ZGl0O1xuICAgIH1cbiAgICAvLyBzdGF0ZXM6IHYxIHVzZWQgUmVjb3JkPHN0cmluZywgdHJ1ZT47IHYyIHVzZXMgc3RyaW5nW10uIE5vcm1hbGl6ZSBib3RoLlxuICAgIGlmIChvdXQuc3RhdGVzICYmICFBcnJheS5pc0FycmF5KG91dC5zdGF0ZXMpICYmIHR5cGVvZiBvdXQuc3RhdGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgb3V0LnN0YXRlcyA9IE9iamVjdC5rZXlzKG91dC5zdGF0ZXMpLmZpbHRlcigoaykgPT4gQm9vbGVhbigob3V0LnN0YXRlcyBhcyBhbnkpW2tdKSk7XG4gICAgfVxuICAgIC8vIGF0dHJzLmZvcm1hdCDihpIgaGludHMuZm9ybWF0LiBDbG9uZSBhdHRycyBmaXJzdCBzbyB3ZSBkb24ndCBtdXRhdGUgdGhlXG4gICAgLy8gY2FsbGVyJ3MgbmVzdGVkIG9iamVjdC4gU2FtZSBmb3IgaGludHMgKHdlIG1heSBtZXJnZSBpbnRvIGl0KS5cbiAgICBpZiAob3V0LmF0dHJzICYmIHR5cGVvZiBvdXQuYXR0cnMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBvdXQuYXR0cnMuZm9ybWF0ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgZm10ID0gb3V0LmF0dHJzLmZvcm1hdDtcbiAgICAgIGNvbnN0IHtmb3JtYXQ6IF9kcm9wLCAuLi5yZXN0QXR0cnN9ID0gb3V0LmF0dHJzO1xuICAgICAgb3V0LmF0dHJzID0gcmVzdEF0dHJzO1xuICAgICAgb3V0LmhpbnRzID0gey4uLihvdXQuaGludHMgPz8ge30pLCBmb3JtYXQ6IGZtdH07XG4gICAgfVxuICAgIGlmICghb3V0LnVpZCkgb3V0LnVpZCA9IG1zZ0lkKCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob3V0Lmdyb3VwKSkgb3V0Lmdyb3VwID0gb3V0Lmdyb3VwLm1hcChkZW5vcm1hbGl6ZUVudHJ5KTtcbiAgICByZXR1cm4gb3V0IGFzIEVudHJ5O1xuICB9O1xuICAvLyBXYWxrIGFsbCBsb2FkZWQgbWVzc2FnZXMgYW5kIG1pZ3JhdGUgYW55IGxlZ2FjeSBlbnRyaWVzLiBSZXR1cm5zIHRydWUgaWZcbiAgLy8gYW55dGhpbmcgbXV0YXRlZCBzbyB0aGUgY2FsbGVyIGNhbiBwZXJzaXN0LlxuICBjb25zdCBtaWdyYXRlTG9hZGVkTWVzc2FnZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgbGV0IG11dGF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgYmVmb3JlID0gbS5lbnRyeTtcbiAgICAgIC8vIENoZWFwIHByZS1jaGVjazogaWYgdWlkIGV4aXN0cyBBTkQgc3RhdGVzIGlzIGFuIGFycmF5IEFORCBubyBfYXVkaXRcbiAgICAgIC8vIEFORCBubyBhdHRycy5mb3JtYXQg4oaSIG5vdGhpbmcgdG8gZG8sIHNraXAgdGhlIHdvcmsuXG4gICAgICBjb25zdCBuZWVkc1dvcmsgPVxuICAgICAgICAhYmVmb3JlLnVpZCB8fFxuICAgICAgICAoYmVmb3JlLnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShiZWZvcmUuc3RhdGVzKSkgfHxcbiAgICAgICAgKGJlZm9yZSBhcyBhbnkpLl9hdWRpdCAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIChiZWZvcmUuYXR0cnMgJiYgdHlwZW9mIChiZWZvcmUuYXR0cnMgYXMgYW55KS5mb3JtYXQgPT09ICdzdHJpbmcnKTtcbiAgICAgIGlmICghbmVlZHNXb3JrKSBjb250aW51ZTtcbiAgICAgIG0uZW50cnkgPSBkZW5vcm1hbGl6ZUVudHJ5KGJlZm9yZSk7XG4gICAgICBtdXRhdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG11dGF0ZWQ7XG4gIH07XG4gIGNvbnN0IG9uSW1wb3J0ID0gKCk6IHZvaWQgPT4gaW1wb3J0RmlsZS5jbGljaygpO1xuICBpbXBvcnRGaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5maWxlcz8uWzBdO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgIGNvbnN0IGltcG9ydGVkOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiB0ZXh0LnNwbGl0KC9cXHI/XFxuLykpIHtcbiAgICAgIGlmICghbGluZS50cmltKCkpIGNvbnRpbnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbyA9IEpTT04ucGFyc2UobGluZSk7XG4gICAgICAgIGlmIChvLnR5cGUgPT09ICdtYW5pZmVzdCcpIHtcbiAgICAgICAgICAvLyBNYW5pZmVzdCBsaW5lIOKAlCBpbmZvcm1hdGlvbmFsIG9ubHkgb24gaW1wb3J0LiBTa2lwLlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvLnR5cGUgPT09ICdwYWdlJykgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3BhZ2UnLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB1cmw6IG8udXJsLCB0aXRsZTogby50aXRsZSwgdmlld3BvcnQ6IG8udmlld3BvcnQsIHRva2Vuczogby50b2tlbnMsIHVzZXJBZ2VudDogby51c2VyQWdlbnQsIGxhbmc6IG8ubGFuZ30pO1xuICAgICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksXG4gICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQ6IG8udGV4dCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChvLnBhcmVudFVpZCkgZmIucGFyZW50VWlkID0gby5wYXJlbnRVaWQ7XG4gICAgICAgICAgaWYgKG8uZGV0YWNoZWQpIGZiLmRldGFjaGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvLnRhZ3MpICYmIG8udGFncy5sZW5ndGgpIGZiLnRhZ3MgPSBvLnRhZ3M7XG4gICAgICAgICAgaWYgKG8uc2V2ZXJpdHkpIGZiLnNldmVyaXR5ID0gby5zZXZlcml0eTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKGZiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzZWxlY3RvciBsaW5lIOKAlCBjb3VsZCBiZSB2MSAoZmxhdCkgb3IgdjIgKHdpdGggX2F1ZGl0KS4gVGhlXG4gICAgICAgICAgLy8gYnVuZGxlZCBmZWVkYmFjayBhcnJheSBtdXN0IGJlIHNwbGl0IG91dCBpbnRvIHNlcGFyYXRlIGZlZWRiYWNrXG4gICAgICAgICAgLy8gbWVzc2FnZXMgZm9yIHJvdW5kLXRyaXAgd2l0aCB2MSByZWFkZXJzIOKAlCBidXQgaW4gdjIgd2UgYWxyZWFkeVxuICAgICAgICAgIC8vIGVtaXQgc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lcywgc28gZHJvcHBpbmcgdGhlIGJ1bmRsZWQgbGlzdCBpc1xuICAgICAgICAgIC8vIHNhZmUgdG8gYXZvaWQgZG91YmxlLWNvdW50aW5nLlxuICAgICAgICAgIGNvbnN0IGZiID0gQXJyYXkuaXNBcnJheShvLmZlZWRiYWNrKSA/IG8uZmVlZGJhY2sgOiBudWxsO1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShvKTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeX0pO1xuICAgICAgICAgIC8vIE9ubHkgaW5mbGF0ZSBidW5kbGVkIGZlZWRiYWNrIGlmIHRoZSBmaWxlIGlzIHYxIChubyB2ZXJzaW9uXG4gICAgICAgICAgLy8gbWFya2VyIG9uIHRoZSBzZWxlY3RvciBsaW5lcykuIHYyIGhhcyBpdHMgb3duIHN0YW5kYWxvbmVcbiAgICAgICAgICAvLyBmZWVkYmFjayBsaW5lcyB0aGF0IGFycml2ZSBzZXBhcmF0ZWx5LlxuICAgICAgICAgIGlmIChmYiAmJiBvLnYgIT09IDIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBmYikgaW1wb3J0ZWQucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgIHRleHQ6IHR5cGVvZiB0ID09PSAnc3RyaW5nJyA/IHQgOiB0Py50ZXh0ID8/ICcnLFxuICAgICAgICAgICAgICBwYXJlbnRVaWQ6IGVudHJ5LnVpZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7IC8qIHNraXAgYmFkIGxpbmUgKi8gfVxuICAgIH1cbiAgICBtZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgLi4uaW1wb3J0ZWRdO1xuICAgIHBlcnNpc3QoKTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKGBJbXBvcnRlZCAke2ltcG9ydGVkLmxlbmd0aH0gbWVzc2FnZSR7aW1wb3J0ZWQubGVuZ3RoID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgaW1wb3J0RmlsZS52YWx1ZSA9ICcnO1xuICB9KTtcbiAgLy8g4pSA4pSA4pSAIFdvcmtzcGFjZSBzbmFwc2hvdCBoaXN0b3J5IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBQZXJzaXN0ZW50IChub3QgdGhlIGluLXNlc3Npb24gdW5kbyBzdGFjaykuIEEgQ2xlYXItYWxsIGFyY2hpdmVzIHRoZVxuICAvLyBjdXJyZW50IHdvcmtzcGFjZSBzdGF0ZSBzbyBpdCBjYW4gYmUgcmVzdG9yZWQgZnJvbSBTZXR0aW5ncyBsYXRlci5cbiAgbGV0IHdzU25hcHNob3RzOiBXb3Jrc3BhY2VTbmFwc2hvdFtdID0gW107XG4gIGNvbnN0IGxvYWRXc1NuYXBzaG90cyA9IGFzeW5jIChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICB3c1NuYXBzaG90cyA9IChhd2FpdCBTdG9yZS5nZXQ8V29ya3NwYWNlU25hcHNob3RbXT4od3NTbmFwc2hvdHNLZXkobmFtZSksIFtdKSkgfHwgW107XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RXc1NuYXBzaG90cyA9ICgpOiB2b2lkID0+IHsgdm9pZCBTdG9yZS5zZXQod3NTbmFwc2hvdHNLZXkoYWN0aXZlV3MpLCB3c1NuYXBzaG90cyk7IH07XG4gIC8vIEFyY2hpdmUgdGhlIENVUlJFTlQgd29ya3NwYWNlIHN0YXRlIChiZWZvcmUgaXQncyB3aXBlZCkuIE5vLW9wIGlmIGVtcHR5LlxuICBjb25zdCBhcmNoaXZlV29ya3NwYWNlU25hcHNob3QgPSAoKTogV29ya3NwYWNlU25hcHNob3QgfCBudWxsID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgc25hcDogV29ya3NwYWNlU25hcHNob3QgPSB7XG4gICAgICBpZDogc2VjdXJlVG9rZW4oOCksXG4gICAgICB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgbWVzc2FnZXM6IHN0cnVjdHVyZWRDbG9uZShtZXNzYWdlcyksXG4gICAgICBzaG90czogT2JqZWN0LmZyb21FbnRyaWVzKHNob3RzKSxcbiAgICAgIHNlbGVjdG9yczogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLmxlbmd0aCxcbiAgICAgIGNvbW1lbnRzOiBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykubGVuZ3RoLFxuICAgIH07XG4gICAgLy8gTmV3ZXN0IGZpcnN0OyBjYXAgdGhlIGhpc3RvcnkuXG4gICAgd3NTbmFwc2hvdHMudW5zaGlmdChzbmFwKTtcbiAgICBpZiAod3NTbmFwc2hvdHMubGVuZ3RoID4gV1NfU05BUFNIT1RfQ0FQKSB3c1NuYXBzaG90cyA9IHdzU25hcHNob3RzLnNsaWNlKDAsIFdTX1NOQVBTSE9UX0NBUCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmV0dXJuIHNuYXA7XG4gIH07XG4gIGNvbnN0IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdCA9IChpZDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3Qgc25hcCA9IHdzU25hcHNob3RzLmZpbmQoKHMpID0+IHMuaWQgPT09IGlkKTtcbiAgICBpZiAoIXNuYXApIHJldHVybiBmYWxzZTtcbiAgICAvLyBQdXNoIHRoZSBsaXZlIHN0YXRlIG9udG8gdGhlIGluLXNlc3Npb24gdW5kbyBzdGFjayBzbyBhIG1pc3Rha2VuXG4gICAgLy8gcmVzdG9yZSBpcyBpdHNlbGYgdW5kb2FibGUuXG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IHN0cnVjdHVyZWRDbG9uZShzbmFwLm1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHNuYXAuc2hvdHMpKSBzaG90cy5zZXQoaywgdik7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICBzZXRTdGF0dXMoYFJlc3RvcmVkIHNuYXBzaG90IMK3ICR7c25hcC5zZWxlY3RvcnN9IHNlbGVjdG9yc2ApO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICBjb25zdCBkZWxldGVXb3Jrc3BhY2VTbmFwc2hvdCA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5maWx0ZXIoKHMpID0+IHMuaWQgIT09IGlkKTtcbiAgICBwZXJzaXN0V3NTbmFwc2hvdHMoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gIH07XG5cbiAgY29uc3Qgb25DbGVhciA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWNvbmZpcm0oJ0NsZWFyIGFsbCBjYXB0dXJlcz8gQSBzbmFwc2hvdCB3aWxsIGJlIHNhdmVkIHRvIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzIGZpcnN0LicpKSByZXR1cm47XG4gICAgLy8gQXJjaGl2ZSB0aGUgd29ya3NwYWNlIEJFRk9SRSB3aXBpbmcgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGxhdGVyLlxuICAgIGNvbnN0IHNuYXAgPSBhcmNoaXZlV29ya3NwYWNlU25hcHNob3QoKTtcbiAgICBzbmFwc2hvdCgpO1xuICAgIG1lc3NhZ2VzID0gW107XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBlcnNpc3RTaG90cygpO1xuICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIC8vIE5ldmVyIGNsYWltIGEgc25hcHNob3QgdGhhdCBkaWRuJ3QgaGFwcGVuIChlbXB0eSB3b3Jrc3BhY2Ugbm8tb3BzKS5cbiAgICBzZXRTdGF0dXMoc25hcCA/ICdDbGVhcmVkIMK3IHNuYXBzaG90IHNhdmVkIOKAlCByZXN0b3JlIGluIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzJyA6ICdDbGVhcmVkJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFZhbGlkYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJldHVybnMgYSBzdW1tYXJ5IHNvIHRoZSBjYWxsZXIgY2FuIGdpdmUgaG9uZXN0IGZlZWRiYWNrOiBgYXR0YWNoZWRgXG4gIC8vIGRpc3Rpbmd1aXNoZXMgXCJjb250ZW50IHNjcmlwdCBpc24ndCBvbiB0aGUgcGFnZVwiICh0aGUgc2lsZW50LW5vLW9wIGNhc2VcbiAgLy8gdGhhdCBtYWRlIHRoaXMgZmVhdHVyZSBmZWVsIHVzZWxlc3MpIGZyb20gYSByZWFsIHJlc29sdmUvbWlzcyBjb3VudC5cbiAgdHlwZSBWYWxpZGF0aW9uUmVzdWx0ID0ge3RvdGFsOiBudW1iZXI7IHJlc29sdmVkOiBudW1iZXI7IGF0dGFjaGVkOiBib29sZWFufTtcbiAgY29uc3QgcnVuVmFsaWRhdGlvbiA9IGFzeW5jICgpOiBQcm9taXNlPFZhbGlkYXRpb25SZXN1bHQ+ID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBbLi4ubmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3RvcikpXTtcbiAgICBpZiAoIXNlbGVjdG9ycy5sZW5ndGggfHwgIWluRXh0ZW5zaW9uKSByZXR1cm4ge3RvdGFsOiBzZWxlY3RvcnMubGVuZ3RoLCByZXNvbHZlZDogMCwgYXR0YWNoZWQ6IHRydWV9O1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgaWYgKCF0YWJzWzBdKSByZXR1cm4ge3RvdGFsOiBzZWxlY3RvcnMubGVuZ3RoLCByZXNvbHZlZDogMCwgYXR0YWNoZWQ6IGZhbHNlfTtcbiAgICAgIGxpdmVUYWJVcmwgPSB0YWJzWzBdLnVybCA/PyBsaXZlVGFiVXJsO1xuICAgICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YobGl2ZVRhYlVybCA/PyAnJyk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQhLCBwZyh7a2luZDogJ3ZhbGlkYXRlJywgc2VsZWN0b3JzfSkpIGFzIHt2YWxpZD86IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+fTtcbiAgICAgIGlmICghcmVwbHk/LnZhbGlkKSByZXR1cm4ge3RvdGFsOiBzZWxlY3RvcnMubGVuZ3RoLCByZXNvbHZlZDogMCwgYXR0YWNoZWQ6IGZhbHNlfTtcbiAgICAgIGxldCByZXNvbHZlZCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IFtzZWwsIG9rXSBvZiBPYmplY3QuZW50cmllcyhyZXBseS52YWxpZCkpIHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChvaykgcmVzb2x2ZWQrKztcbiAgICAgICAgZWxzZSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCAnTm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMgdGhpcyBzZWxlY3Rvci4nKTtcbiAgICAgIH1cbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuIHt0b3RhbDogc2VsZWN0b3JzLmxlbmd0aCwgcmVzb2x2ZWQsIGF0dGFjaGVkOiB0cnVlfTtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIHt0b3RhbDogc2VsZWN0b3JzLmxlbmd0aCwgcmVzb2x2ZWQ6IDAsIGF0dGFjaGVkOiBmYWxzZX07IH1cbiAgfTtcbiAgY29uc3Qgb25WYWxpZGF0ZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLnNvbWUoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykpIHsgc2V0U3RhdHVzKCdObyBzZWxlY3RvcnMgdG8gcmUtY2hlY2snLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHNldFN0YXR1cygnUmUtY2hlY2tpbmcgc2VsZWN0b3JzIG9uIHRoZSBsaXZlIHBhZ2XigKYnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgY29uc3QgciA9IGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICBpZiAoIXIuYXR0YWNoZWQpIHtcbiAgICAgIHNldFN0YXR1cyhcIkNhbid0IHJlYWNoIHRoZSBwYWdlIOKAlCB1c2UgUmUtYXR0YWNoIHRvIHBhZ2UgKENtZCtLKSwgdGhlbiByZS1jaGVja1wiLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1pc3NlZCA9IHIudG90YWwgLSByLnJlc29sdmVkO1xuICAgIHNldFN0YXR1cyhcbiAgICAgIG1pc3NlZCA9PT0gMFxuICAgICAgICA/IGBBbGwgJHtyLnRvdGFsfSBzZWxlY3RvciR7ci50b3RhbCA9PT0gMSA/ICcnIDogJ3MnfSByZXNvbHZlIG9uIHRoZSBsaXZlIHBhZ2Ug4pyTYFxuICAgICAgICA6IGAke3IucmVzb2x2ZWR9LyR7ci50b3RhbH0gc2VsZWN0b3JzIHJlc29sdmUgwrcgJHttaXNzZWR9IG5vIGxvbmdlciBtYXRjaCAoZmxhZ2dlZCBTdGFsZSlgLFxuICAgICAgbWlzc2VkID09PSAwID8ge2tpbmQ6ICdvayd9IDoge2tpbmQ6ICd3YXJuJ30sXG4gICAgKTtcbiAgfTtcblxuICAvLyAoU2NyZWVuc2hvdCBtYWNoaW5lcnkgcmVtb3ZlZCBhbG9uZ3NpZGUgdGhlIC5wcmV2aWV3IHRpbGUuKVxuXG4gIC8vIOKUgOKUgOKUgCBHaXRIdWIgc3RhcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGZldGNoU3RhcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSAncGluY2hncmFiLmdoLnN0YXJzJztcbiAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBTdG9yZS5nZXQ8e2NvdW50OiBudW1iZXI7IHRzOiBudW1iZXJ9IHwgbnVsbD4oY2FjaGVLZXksIG51bGwpO1xuICAgIGlmIChjYWNoZWQgJiYgRGF0ZS5ub3coKSAtIGNhY2hlZC50cyA8IDNfNjAwXzAwMCkge1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjYWNoZWQuY291bnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3dyYW5uZ2xlL3BpbmNoZ3JhYicsIHtjYWNoZTogJ25vLXN0b3JlJ30pO1xuICAgICAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ3N0YXR1cyAnICsgci5zdGF0dXMpO1xuICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpIGFzIHtzdGFyZ2F6ZXJzX2NvdW50PzogbnVtYmVyfTtcbiAgICAgIGNvbnN0IGNvdW50ID0gai5zdGFyZ2F6ZXJzX2NvdW50ID8/IDA7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50KTtcbiAgICAgIHZvaWQgU3RvcmUuc2V0KGNhY2hlS2V5LCB7Y291bnQsIHRzOiBEYXRlLm5vdygpfSk7XG4gICAgfSBjYXRjaCB7IHN0YXJzRWwudGV4dENvbnRlbnQgPSAnwrcnOyB9XG4gIH07XG4gIGNvbnN0IG9uR2l0aHViID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vd3Jhbm5nbGUvcGluY2hncmFiJztcbiAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsfSk7XG4gICAgZWxzZSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgfTtcblxuICAvLyBSZS1pbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gdGhlIGFjdGl2ZSB0YWIg4oCUIHRoZSByZWNvdmVyeSBwYXRoXG4gIC8vIGZvciBcIkFsdCtDbGljayBzdG9wcGVkIHdvcmtpbmdcIiAoYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gc2NyaXB0KS4gUmVmcmVzaGluZyBhbiBhdHRhY2hlZCB0YWIgcmUtaW5qZWN0cyBhdXRvbWF0aWNhbGx5OyB0aGlzXG4gIC8vIGNvdmVycyBldmVyeSBvdGhlciBjYXNlIHdpdGhvdXQgaHVudGluZyBmb3IgdGhlIHRvb2xiYXIgaWNvbi5cbiAgY29uc3Qgb25SZWF0dGFjaCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7IHNldFN0YXR1cygnUmUtYXR0YWNoIG9ubHkgd29ya3MgaW5zaWRlIHRoZSBleHRlbnNpb24nLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8e29rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAncGctcmVpbmplY3QnfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKCdSZS1hdHRhY2hlZCDigJQgQWx0K0NsaWNrIGlzIGxpdmUnKTtcbiAgICBlbHNlIHNldFN0YXR1cyhgQ291bGRuJ3QgcmUtYXR0YWNoIOKAlCBjbGljayB0aGUgUGluY2hHcmFiIHRvb2xiYXIgYnV0dG9uIG9uIHRoZSBwYWdlJHtyZXBseT8uZXJyb3IgPyBgIMK3ICR7cmVwbHkuZXJyb3J9YCA6ICcnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUXVpZXQtc2F2ZXMgbnVkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHF1aWV0U2F2ZXMgZGVmYXVsdHMgT04gYXMgaW50ZW50LCBidXQgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aVxuICAvLyBwZXJtaXNzaW9uIENocm9tZSBkZW1hbmRzIGNhbiBvbmx5IGJlIHJlcXVlc3RlZCBpbnNpZGUgYSB1c2VyIGdlc3R1cmUuXG4gIC8vIFRoaXMgYmFubmVyIGlzIHRoYXQgZ2VzdHVyZTogc2hvd24gd2hpbGUgdGhlIHByZWYgaXMgb24sIHRoZSBwZXJtaXNzaW9uXG4gIC8vIGlzIG1pc3NpbmcsIGFuZCB0aGUgdXNlciBoYXNuJ3QgZGlzbWlzc2VkIGl0LlxuICBjb25zdCBxdWlldE51ZGdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXF1aWV0LW51ZGdlXScpO1xuICBjb25zdCBtYXliZVNob3dRdWlldE51ZGdlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcXVpZXROdWRnZSB8fCAhaW5FeHRlbnNpb24gfHwgIWNocm9tZS5wZXJtaXNzaW9ucz8uY29udGFpbnMpIHJldHVybjtcbiAgICBpZiAoIXByZWZzLnF1aWV0U2F2ZXMgfHwgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCkgeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IHJldHVybjsgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pO1xuICAgICAgcXVpZXROdWRnZS5oaWRkZW4gPSBncmFudGVkO1xuICAgIH0gY2F0Y2ggeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IH1cbiAgfTtcbiAgY29uc3Qgb25RdWlldEVuYWJsZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgZ3JhbnRlZCA9IGZhbHNlO1xuICAgIHRyeSB7IGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KTsgfVxuICAgIGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy51aSBwZXJtaXNzaW9uIHJlcXVlc3QgZmFpbGVkJywgZXJyKTsgfVxuICAgIHByZWZzLnF1aWV0U2F2ZXMgPSBncmFudGVkO1xuICAgIGlmICghZ3JhbnRlZCkgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7IC8vIGRlY2xpbmVkIG9uY2Ug4oCUIG5ldmVyIG5hZyBhZ2FpblxuICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgaWYgKHF1aWV0TnVkZ2UpIHF1aWV0TnVkZ2UuaGlkZGVuID0gdHJ1ZTtcbiAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1NhdmVzIHN0YXkgdmlzaWJsZSDigJQgcmUtZW5hYmxlIGluIFNldHRpbmdzIOKGkiBDYXB0dXJlJywgZ3JhbnRlZCA/IHt9IDoge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuICBjb25zdCBvblF1aWV0RGlzbWlzcyA9ICgpOiB2b2lkID0+IHtcbiAgICBwcmVmcy5xdWlldFNhdmVzID0gZmFsc2U7XG4gICAgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7XG4gICAgcGVyc2lzdFByZWZzKCk7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICBpZiAocXVpZXROdWRnZSkgcXVpZXROdWRnZS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBzbWFsbCBkb2N1bWVudCBzdW1tYXJpZXMuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBtYXJrZG93bk92ZXJ2aWV3ID0gKGNvbnRlbnQ6IHN0cmluZywga2luZDogTWRLaW5kLCB1c2luZ1RlbXBsYXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQudHJpbSgpID8gY29udGVudC5zcGxpdCgnXFxuJykubGVuZ3RoIDogMDtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFtjb250ZW50XSkuc2l6ZTtcbiAgICBjb25zdCBoZWFkaW5ncyA9IGNvbnRlbnRcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5tYXAoKGxpbmUpID0+IC9eI3sxLDN9XFxzKyguKykkLy5leGVjKGxpbmUudHJpbSgpKT8uWzFdPy50cmltKCkpXG4gICAgICAuZmlsdGVyKChoZWFkaW5nKTogaGVhZGluZyBpcyBzdHJpbmcgPT4gQm9vbGVhbihoZWFkaW5nKSlcbiAgICAgIC5zbGljZSgwLCA0KTtcbiAgICAvLyBXYXJtLCBwbGFpbi1sYW5ndWFnZSBmcmFtaW5nIG9mIHdoYXQgZWFjaCBmaWxlIHRlYWNoZXMgdGhlIGFnZW50LlxuICAgIC8vIERFU0lHTi5tZCBpcyB0aGUgaGVhZGxpbmUgYXJ0aWZhY3Q6IGl0J3Mgd2hlcmUgeW91IGRlc2NyaWJlIHlvdXIgb3duXG4gICAgLy8gYnJhbmQgYW5kIFVJIHRhc3RlIHNvIHRoZSBhZ2VudCBidWlsZHMgaW4gKnlvdXIqIHZvaWNlIHJhdGhlciB0aGFuIGFcbiAgICAvLyBnZW5lcmljIGRlZmF1bHQuIFNLSUxMLm1kIGlzIHRoZSBhZHZhbmNlZCB0cmlhZ2UgZ3VpZGUgZm9yIHJlYWRpbmdcbiAgICAvLyBleHBvcnRzIOKAlCB1c2VmdWwsIGJ1dCBub3Qgd2hlcmUgbW9zdCBwZW9wbGUgc2hvdWxkIHN0YXJ0LlxuICAgIGNvbnN0IGxhYmVsID0ga2luZCA9PT0gJ2Rlc2lnbidcbiAgICAgID8gJ1RlYWNoZXMgeW91ciBhZ2VudCB0byBidWlsZCBVSSBpbiB5b3VyIGJyYW5kJ1xuICAgICAgOiAnQWR2YW5jZWQ6IGhvdyB5b3VyIGFnZW50IHNob3VsZCByZWFkIFBpbmNoR3JhYiBleHBvcnRzJztcbiAgICBjb25zdCBzb3VyY2UgPSB1c2luZ1RlbXBsYXRlXG4gICAgICA/IChraW5kID09PSAnZGVzaWduJyA/ICdTdGFydGVyIHRlbXBsYXRlIOKAlCBtYWtlIGl0IHlvdXJzJyA6ICdCdW5kbGVkIHRlbXBsYXRlJylcbiAgICAgIDogJ0N1c3RvbWl6ZWQnO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gaGVhZGluZ3MubGVuZ3RoID8gaGVhZGluZ3Muam9pbignIC8gJykgOiAnTm8gc2VjdGlvbiBoZWFkaW5ncyBmb3VuZCc7XG4gICAgcmV0dXJuIGAke2xhYmVsfVxcbiR7c291cmNlfSDCtyAke2xpbmVzLnRvTG9jYWxlU3RyaW5nKCl9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JcXG5TZWN0aW9uczogJHtzZWN0aW9uc31gO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1kUHJldmlldyA9IGFzeW5jIChraW5kOiAnZGVzaWduJyB8ICdza2lsbCcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwcmV2aWV3RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtbWQtcHJldmlldz1cIiR7a2luZH1cIl1gKTtcbiAgICBpZiAoIXByZXZpZXdFbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBraW5kID09PSAnZGVzaWduJyA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGtpbmQgPT09ICdkZXNpZ24nID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHByZXZpZXdFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcoY29udGVudCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk1kTW9kYWwgPSBhc3luYyAoa2luZDogTWRLaW5kKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgICBjb25zdCB0aXRsZUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGl0bGVdJykhO1xuICAgIGNvbnN0IHRhRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRleHRhcmVhXScpITtcbiAgICBjb25zdCBzdGF0c0VsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3RhdHNdJykhO1xuICAgIGNvbnN0IGJhbm5lckVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtYmFubmVyXScpITtcbiAgICBjb25zdCBzdW1tYXJ5RWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdW1tYXJ5XScpITtcbiAgICBjb25zdCBzYXZlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc2F2ZV0nKSE7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1yZXNldF0nKSE7XG4gICAgY29uc3QgdXBsb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdXBsb2FkXScpITtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWRvd25sb2FkXScpITtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWNsb3NlXScpITtcblxuICAgIGNvbnN0IGlzRGVzaWduID0ga2luZCA9PT0gJ2Rlc2lnbic7XG4gICAgY29uc3QgaW5pdGlhbCA9IGlzRGVzaWduID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0gaXNEZXNpZ24gPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGlzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnUGluY2hHcmFiIFNLSUxMLm1kJztcbiAgICB0YUVsLnZhbHVlID0gaW5pdGlhbDtcbiAgICBvdmVybGF5LmRhdGFzZXQua2luZCA9IGtpbmQ7XG5cbiAgICBjb25zdCByZWZyZXNoU3RhdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICBzdGF0c0VsLnRleHRDb250ZW50ID0gYCR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgICAgc3VtbWFyeUVsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyh0ZXh0LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIGNvbnN0IGtleSA9IHQuZGF0YXNldC5wcmVmITtcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgLy8gUXVpZXQgc2F2ZXMgbmVlZHMgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aSBwZXJtaXNzaW9uOyByZXF1ZXN0IGl0XG4gICAgICAvLyBpbnNpZGUgdGhpcyB1c2VyIGdlc3R1cmUgYW5kIHJldmVydCB0aGUgY2hlY2tib3ggb24gZGVjbGluZS5cbiAgICAgIGlmIChrZXkgPT09ICdxdWlldFNhdmVzJyAmJiBjaGVja2VkICYmIGluRXh0ZW5zaW9uICYmIGNocm9tZS5wZXJtaXNzaW9ucz8ucmVxdWVzdCkge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGdyYW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0cnkgeyBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3Qoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7IH1cbiAgICAgICAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMudWkgcGVybWlzc2lvbiByZXF1ZXN0IGZhaWxlZCcsIGVycik7IH1cbiAgICAgICAgICBwcmVmcy5xdWlldFNhdmVzID0gZ3JhbnRlZDtcbiAgICAgICAgICAodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gZ3JhbnRlZDtcbiAgICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1Blcm1pc3Npb24gZGVjbGluZWQg4oCUIHNhdmVzIHN0YXkgdmlzaWJsZScsIGdyYW50ZWQgPyB7fSA6IHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IGNoZWNrZWQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodC5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9ICh0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgLy8gVGV4dGFyZWEgaW5wdXRzIGFsc28gZmlyZSBgaW5wdXRgIGV2ZW50cyBhcyB0aGUgdXNlciB0eXBlcyDigJQgd2Ugd2FudCB0b1xuICAvLyBzYXZlIHRob3NlIGluY3JlbWVudGFsbHkgc28gYSBwYW5lbCByZWxvYWQgZG9lc24ndCBsb3NlIGhhbGYtdHlwZWRcbiAgLy8gZW50cmllcy4gYGNoYW5nZWAgb25seSBmaXJlcyBvbiBibHVyIGZvciB0ZXh0YXJlYXMuXG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICh0Py5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9IHQudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBvcGVuRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gZmFsc2U7IHJlbmRlcldzQ29udHJvbHMoKTsgfTtcbiAgY29uc3QgY2xvc2VEcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSB0cnVlOyB9O1xuXG4gIC8vIFJldXNhYmxlIGNyZWF0ZS13b3Jrc3BhY2UgZmxvdzogdmFsaWRhdGVzIHVuaXF1ZW5lc3MsIHBlcnNpc3RzLCBzd2l0Y2hlcy5cbiAgLy8gU2hhcmVkIGJ5IHRoZSBzZXR0aW5ncyBDcmVhdGUgYnV0dG9uIGFuZCB0aGUgaGVhZGVyIGRyb3Bkb3duJ3NcbiAgLy8gXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gYm90aCBwYXRocyBiZWhhdmUgaWRlbnRpY2FsbHkuXG4gIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUZsb3cgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5hbWUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gdHJpbW1lZCkpIHtcbiAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZTogdHJpbW1lZCwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodHJpbW1lZCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHNldFN0YXR1cyhgQ3JlYXRlZCB3b3Jrc3BhY2UgXCIke3RyaW1tZWR9XCJgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICAvLyBJbmxpbmUgXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gdXNlcnMgY2FuIHNwaW4gdXAgYSB3b3Jrc3BhY2VcbiAgICAvLyBzdHJhaWdodCBmcm9tIHRoZSBoZWFkZXIgc3dpdGNoZXIgd2l0aG91dCBvcGVuaW5nIHNldHRpbmdzLiBIYW5kbGVkXG4gICAgLy8gYXMgYSBzZW50aW5lbCB2YWx1ZSBpbiB0aGUgY2hhbmdlIGxpc3RlbmVyIGJlbG93LlxuICAgIGNvbnN0IG5ld09wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdC52YWx1ZSA9ICdfX25ld193b3Jrc3BhY2VfXyc7XG4gICAgbmV3T3B0LnRleHRDb250ZW50ID0gJysgTmV3IHdvcmtzcGFjZSc7XG4gICAgd3NTZWxlY3QuYXBwZW5kKG5ld09wdCk7XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGZvY3VzV29ya3NwYWNlVGFiKHcubmFtZSk7XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBEZWxldGUgd29ya3NwYWNlICR7dy5uYW1lfWApO1xuICAgICAgICBkZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgaWYgKCFjb25maXJtKGBEZWxldGUgd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCIgYW5kIGFsbCBpdHMgY2FwdHVyZXM/YCkpIHJldHVybjtcbiAgICAgICAgICB3b3Jrc3BhY2VzID0gd29ya3NwYWNlcy5maWx0ZXIoKHgpID0+IHgubmFtZSAhPT0gdy5uYW1lKTtcbiAgICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFt3c01zZ0tleSh3Lm5hbWUpLCB3c1Nob3RzS2V5KHcubmFtZSksIHdzU2hvdHNGdWxsS2V5KHcubmFtZSksIHdzU25hcHNob3RzS2V5KHcubmFtZSldKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgICAgICBpZiAoYWN0aXZlV3MgPT09IHcubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3b3Jrc3BhY2VzWzBdIS5uYW1lKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpLmFwcGVuZChkZWwpO1xuICAgICAgfVxuICAgICAgd3NMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuICAgIHJlbmRlcldzU25hcHNob3RIaXN0b3J5KCk7XG4gIH07XG5cbiAgLy8gUmVuZGVyIHRoZSBhY3RpdmUgd29ya3NwYWNlJ3Mgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKSB3aXRoXG4gIC8vIGEgUmVzdG9yZSBhY3Rpb24uIEFwcGVuZGVkIHVuZGVyIHRoZSB3b3Jrc3BhY2UgbGlzdCBpbiBTZXR0aW5ncy5cbiAgY29uc3QgcmVuZGVyV3NTbmFwc2hvdEhpc3RvcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS13cy1zbmFwc2hvdHNdJyk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAoIXdzU25hcHNob3RzLmxlbmd0aCkge1xuICAgICAgaG9zdC5oaWRkZW4gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBob3N0LmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgU25hcHNob3QgaGlzdG9yeSDCtyAke3dzU25hcHNob3RzLmxlbmd0aH1gO1xuICAgIGhlYWQuZGF0YXNldC50aXAgPSAnUmVzdG9yYWJsZSBzbmFwc2hvdHMgc2F2ZWQgYmVmb3JlIGVhY2ggQ2xlYXItYWxsJztcbiAgICBob3N0LmFwcGVuZChoZWFkKTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdWwuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbGlzdCc7XG4gICAgZm9yIChjb25zdCBzbmFwIG9mIHdzU25hcHNob3RzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3Mtc25hcC1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBgJHtuZXcgRGF0ZShzbmFwLnRzKS50b0xvY2FsZVN0cmluZygpfSDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWwgwrcgJHtzbmFwLmNvbW1lbnRzfSBjbXRgO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgY29uc3QgcmVzdG9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcmVzdG9yZS50eXBlID0gJ2J1dHRvbic7XG4gICAgICByZXN0b3JlLmNsYXNzTmFtZSA9ICd3cy1zbmFwLXJlc3RvcmUnO1xuICAgICAgcmVzdG9yZS50ZXh0Q29udGVudCA9ICdSZXN0b3JlJztcbiAgICAgIHJlc3RvcmUuZGF0YXNldC50aXAgPSAnUmVzdG9yZSB0aGlzIHNuYXBzaG90IGludG8gdGhlIGN1cnJlbnQgd29ya3NwYWNlIChjdXJyZW50IHN0YXRlIGlzIGtlcHQgb24gdGhlIHVuZG8gc3RhY2spJztcbiAgICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoICYmICFjb25maXJtKCdSZXN0b3JlIHRoaXMgc25hcHNob3Q/IFRoZSBjdXJyZW50IGNhcHR1cmVzIHdpbGwgYmUgcmVwbGFjZWQgKHVuZG9hYmxlKS4nKSkgcmV0dXJuO1xuICAgICAgICByZXN0b3JlV29ya3NwYWNlU25hcHNob3Qoc25hcC5pZCk7XG4gICAgICB9KTtcbiAgICAgIGxpLmFwcGVuZChyZXN0b3JlKTtcbiAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyIHdzLXNuYXAtZGVsJztcbiAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyBzbmFwc2hvdCc7XG4gICAgICBkZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBzbmFwc2hvdCcpO1xuICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEyKTtcbiAgICAgIGRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGRlbGV0ZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgfVxuICAgIGhvc3QuYXBwZW5kKHVsKTtcbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ19fbmV3X3dvcmtzcGFjZV9fJykge1xuICAgICAgLy8gUmVzZXQgdGhlIHNlbGVjdCBiYWNrIHRvIHRoZSBhY3RpdmUgd29ya3NwYWNlIGZpcnN0IHNvIHRoZSBzZW50aW5lbFxuICAgICAgLy8gbmV2ZXIgc3RpY2tzIGFzIHRoZSBkaXNwbGF5ZWQgdmFsdWUgaWYgdGhlIHByb21wdCBpcyBjYW5jZWxsZWQuXG4gICAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgICBjb25zdCBuYW1lID0gKHdpbmRvdy5wcm9tcHQoJ05ldyB3b3Jrc3BhY2UgbmFtZScpID8/ICcnKS50cmltKCk7XG4gICAgICBpZiAobmFtZSkgYXdhaXQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh2YWx1ZSk7XG4gICAgZm9jdXNXb3Jrc3BhY2VUYWIodmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdTZW5kIHRvIEFnZW50IOKAlCBleHBvcnQgLnRhci56c3QgKyBjb3B5IHRoZSBhZ2VudCBwcm9tcHQnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdjb3B5LWFnZW50LXByb21wdCcsIGxhYmVsOiAnQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCAobGFzdCBleHBvcnQpJywgcnVuOiAoKSA9PiB7XG4gICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICghbGFzdEV4cG9ydC5hZ2VudFByb21wdCkgeyBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIFNlbmQgdG8gQWdlbnQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBvayA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICAgICAgc2V0U3RhdHVzKG9rID8gJ0FnZW50IHByb21wdCBjb3BpZWQnIDogJ0NsaXBib2FyZCB1bmF2YWlsYWJsZScsIG9rID8ge30gOiB7a2luZDogJ3dhcm4nfSk7XG4gICAgICB9KSgpO1xuICAgIH19LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3ZhbGlkYXRlJywgbGFiZWw6ICdSZS1jaGVjayBzZWxlY3RvcnMnLCBydW46ICgpID0+IHZvaWQgb25WYWxpZGF0ZSgpfSxcbiAgICB7aWQ6ICdyZWF0dGFjaCcsIGxhYmVsOiAnUmUtYXR0YWNoIHRvIHBhZ2UgKGZpeCBBbHQrQ2xpY2spJywgcnVuOiAoKSA9PiB2b2lkIG9uUmVhdHRhY2goKX0sXG4gICAge2lkOiAncmVsb2FkLWV4dGVuc2lvbicsIGxhYmVsOiAnUmVsb2FkIHRoZSBQaW5jaEdyYWIgZXh0ZW5zaW9uIChsYXN0IHJlc29ydCknLCBydW46ICgpID0+IHsgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUucnVudGltZS5yZWxvYWQoKTsgfX0sXG4gICAge2lkOiAnY2xlYXInLCBsYWJlbDogJ0NsZWFyIGFsbCBjYXB0dXJlcycsIHJ1bjogb25DbGVhcn0sXG4gICAge2lkOiAnc2V0dGluZ3MnLCBsYWJlbDogJ09wZW4gc2V0dGluZ3MnLCBydW46IG9wZW5EcmF3ZXJ9LFxuICAgIHtpZDogJ2dpdGh1YicsIGxhYmVsOiAnT3BlbiBHaXRIdWIgcmVwbycsIHJ1bjogb25HaXRodWJ9LFxuICAgIHtpZDogJ21hbnVhbCcsIGxhYmVsOiAnTWFudWFsIGNhcHR1cmUgKHN0YXJ0IGNvbXBvc2VyIHdpdGggYD4gc2VsZWN0b3JgKScsIHJ1bjogKCkgPT4geyBjb21wb3Nlci52YWx1ZSA9ICc+ICc7IGNvbXBvc2VyLmZvY3VzKCk7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgfX0sXG4gICAge2lkOiAndW5kbycsIGxhYmVsOiAnVW5kbycsIHJ1bjogdW5kb30sXG4gICAge2lkOiAncmVkbycsIGxhYmVsOiAnUmVkbycsIHJ1bjogcmVkb30sXG4gIF07XG4gIGNvbnN0IHJlbmRlclBhbGV0dGUgPSAocSA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgY29uc3QgcWwgPSBxLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAuLi5DT01NQU5EUy5maWx0ZXIoKGMpID0+ICFxbCB8fCBjLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKVxuICAgICAgICAubWFwKChjKSA9PiAoe2xhYmVsOiBjLmxhYmVsLCBwcmV2aWV3OiAnY29tbWFuZCcsIHJ1bjogYy5ydW59KSksXG4gICAgICAuLi5tZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKCFxbCB8fFxuICAgICAgICAobS5lbnRyeS5zZWxlY3RvciArICcgJyArIChtLmVudHJ5LnRleHQgPz8gJycpICsgJyAnICsgKG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyAnJykpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKSlcbiAgICAgICAgLnNsaWNlKDAsIDMwKVxuICAgICAgICAubWFwKChtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmIgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihtLmlkKTtcbiAgICAgICAgICBjb25zdCBwcmV2aWV3ID0gKG0uZW50cnkudGV4dCA/PyBmYlswXSA/PyBtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgODApO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYWJlbDogYCMke20uZW50cnkubn0gJHttLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3Rvcn1gLFxuICAgICAgICAgICAgcHJldmlldyxcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9zZVBhbGV0dGUoKTtcbiAgICAgICAgICAgICAgc2Nyb2xsTWVzc2FnZUludG9WaWV3KG0uaWQpO1xuICAgICAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3J9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdCwgaSkgPT4ge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGJsLmNsYXNzTmFtZSA9ICdsYWJlbCc7XG4gICAgICBsYmwuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQubGFiZWwsIHEpO1xuICAgICAgbGkuYXBwZW5kKGxibCk7XG4gICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcC5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICBwLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LnByZXZpZXcgPz8gJycsIHEpO1xuICAgICAgbGkuYXBwZW5kKHApO1xuICAgICAgY29uc3Qga2JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAga2JkLmNsYXNzTmFtZSA9ICdrYmQnO1xuICAgICAga2JkLnRleHRDb250ZW50ID0gJ+KGtSc7XG4gICAgICBsaS5hcHBlbmQoa2JkKTtcbiAgICAgIGlmIChpID09PSAwKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpdC5ydW4oKTsgfSk7XG4gICAgICBwYWxldHRlTGlzdC5hcHBlbmQobGkpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvcGVuUGFsZXR0ZSA9IChwcmVzZXQgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGUuaGlkZGVuID0gZmFsc2U7XG4gICAgcGFsZXR0ZUlucHV0LnZhbHVlID0gcHJlc2V0O1xuICAgIHJlbmRlclBhbGV0dGUocHJlc2V0KTtcbiAgICBwYWxldHRlSW5wdXQuZm9jdXMoKTtcbiAgICBwYWxldHRlSW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UocHJlc2V0Lmxlbmd0aCwgcHJlc2V0Lmxlbmd0aCk7XG4gIH07XG4gIGNvbnN0IGNsb3NlUGFsZXR0ZSA9ICgpOiB2b2lkID0+IHsgcGFsZXR0ZS5oaWRkZW4gPSB0cnVlOyB9O1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiByZW5kZXJQYWxldHRlKHBhbGV0dGVJbnB1dC52YWx1ZSkpO1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4ucGFsZXR0ZUxpc3QuY2hpbGRyZW5dO1xuICAgIGxldCBhY3RpdmUgPSBpdGVtcy5maW5kSW5kZXgoKGxpKSA9PiBsaS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKTtcbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWluKGl0ZW1zLmxlbmd0aCAtIDEsIGFjdGl2ZSArIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWF4KDAsIGFjdGl2ZSAtIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IChpdGVtc1thY3RpdmVdIGFzIEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkKT8uY2xpY2soKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIGNsb3NlUGFsZXR0ZSgpO1xuICB9KTtcbiAgcGFsZXR0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGlmIChlLnRhcmdldCA9PT0gcGFsZXR0ZSkgY2xvc2VQYWxldHRlKCk7IH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBDb250ZXh0IHN0cmlwIChob3ZlciBoZWxwKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIG9sZCBmbG9hdGluZyBjdXJzb3IgdG9vbHRpcDogW2RhdGEtdGlwXSBob3ZlciB0ZXh0IGlzXG4gIC8vIHdyaXR0ZW4gaW50byB0aGUgZml4ZWQgc3RyaXAgdW5kZXIgdGhlIGhlYWRlciwgc28gaGVscCBuZXZlciBvY2NsdWRlc1xuICAvLyBvdGhlciBjb250cm9scyBhbmQgY2FuJ3Qgc3RyYW5kIG1pZC1zY3JlZW4gdGhyb3VnaCByZS1yZW5kZXJzLlxuICBjb25zdCBUSVBfSURMRSA9ICdBbHQrQ2xpY2sgb24gdGhlIHBhZ2UgdG8gY2FwdHVyZSDCtyBob3ZlciBhbnkgY29udHJvbCBmb3IgaGVscCc7XG4gIGxldCB0aXBGb3I6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8vIFRoZSBzZXR0aW5ncyBkcmF3ZXIgb3ZlcmxheXMgdGhlIHN0cmlwIChwb3NpdGlvbjphYnNvbHV0ZSwgaW5zZXQgMCksIHNvXG4gIC8vIGhvdmVyIGhlbHAgZm9yIGRyYXdlciBjb250cm9scyBsYW5kcyBpbiBhIHNlY29uZCBzaW5rIGluc2lkZSB0aGVcbiAgLy8gZHJhd2VyIGhlYWRlci4gQm90aCBzaW5rcyBhbHdheXMgcmVjZWl2ZSB0aGUgc2FtZSB0ZXh0LlxuICBjb25zdCBkcmF3ZXJUaXBFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmF3ZXItdGlwXScpO1xuICBjb25zdCBzaG93VGlwID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXAnKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnO1xuICAgIGlmIChkcmF3ZXJUaXBFbCkgeyBkcmF3ZXJUaXBFbC50ZXh0Q29udGVudCA9IHRleHQ7IGRyYXdlclRpcEVsLmRhdGFzZXQuc2hvd24gPSAndHJ1ZSc7IH1cbiAgfTtcbiAgY29uc3QgaGlkZVRpcCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aXBGb3IgPSBudWxsO1xuICAgIHRvb2x0aXBFbC50ZXh0Q29udGVudCA9IFRJUF9JRExFO1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ2ZhbHNlJztcbiAgICBpZiAoZHJhd2VyVGlwRWwpIHsgZHJhd2VyVGlwRWwudGV4dENvbnRlbnQgPSAnJzsgZHJhd2VyVGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7IH1cbiAgfTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICghdCB8fCB0ID09PSB0aXBGb3IpIHJldHVybjtcbiAgICB0aXBGb3IgPSB0O1xuICAgIHNob3dUaXAodCk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCAmJiB0ID09PSB0aXBGb3IgJiYgIXQuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlVGlwKCk7XG4gIH0pO1xuICAvLyBSZS1yZW5kZXJzIGNhbiBkcm9wIHRoZSBob3ZlcmVkIG5vZGUgd2l0aG91dCBldmVyIGZpcmluZyBtb3VzZW91dFxuICAvLyAocmVuZGVyKCkgcmVzZXRzIGxpc3QuaW5uZXJIVE1MLCBjb25maXJtIGJ1dHRvbnMgcmVwbGFjZVdpdGgpOyByZXNldFxuICAvLyB0aGUgc3RyaXAgdG8gaXRzIGlkbGUgaGludCB3aGVuIHRoYXQgaGFwcGVucy5cbiAgY29uc3QgdGlwR3VhcmQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgaWYgKHRpcEZvciAmJiAhdGlwRm9yLmlzQ29ubmVjdGVkKSBoaWRlVGlwKCk7XG4gIH0pO1xuICB0aXBHdWFyZC5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWV9KTtcblxuICAvLyDilIDilIDilIAgU3RhdCBkcmlsbGRvd25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBlbmRIZWFkaW5nID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpO1xuICAgIGgudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGgpO1xuICB9O1xuICBjb25zdCBhcHBlbmRCb2xkID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJyk7XG4gICAgYi50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoYik7XG4gIH07XG4gIGNvbnN0IGFwcGVuZENvZGUgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgY29kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcbiAgICBjb2RlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChjb2RlKTtcbiAgfTtcbiAgY29uc3QgYnVpbGREcmlsbGRvd24gPSAoa2luZDogc3RyaW5nKTogRG9jdW1lbnRGcmFnbWVudCA9PiB7XG4gICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBpZiAoa2luZCA9PT0gJ3NlbGVjdG9ycycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1NlbGVjdG9ycyBieSBxdWFsaXR5Jyk7XG4gICAgICBjb25zdCBidWNrZXRzID0ge2lkOiAwLCB0ZXN0aWQ6IDAsIGNsYXNzOiAwLCBudGg6IDAsIHRhZzogMH07XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgICBpZiAoZS50ZXN0SWQpIGJ1Y2tldHMudGVzdGlkKys7XG4gICAgICAgIGVsc2UgaWYgKGUuaWQgfHwgL14jW1xcdy1dKyQvLnRlc3QoZS5zZWxlY3RvcikpIGJ1Y2tldHMuaWQrKztcbiAgICAgICAgZWxzZSBpZiAoKGUuc2VsZWN0b3IgPz8gJycpLmluY2x1ZGVzKCc6bnRoLW9mLXR5cGUnKSkgYnVja2V0cy5udGgrKztcbiAgICAgICAgZWxzZSBpZiAoL1xcLi8udGVzdChlLnNlbGVjdG9yID8/ICcnKSkgYnVja2V0cy5jbGFzcysrO1xuICAgICAgICBlbHNlIGJ1Y2tldHMudGFnKys7XG4gICAgICB9XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgbGFiZWxdIG9mIFtcbiAgICAgICAgW2J1Y2tldHMudGVzdGlkLCAnIGRhdGEtdGVzdGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmlkLCAnIHN0YWJsZSBpZCddLFxuICAgICAgICBbYnVja2V0cy5jbGFzcywgJyBjbGFzcy1iYXNlZCddLFxuICAgICAgICBbYnVja2V0cy5udGgsICcgbnRoLW9mLXR5cGUnXSxcbiAgICAgICAgW2J1Y2tldHMudGFnLCAnIHRhZy1vbmx5J10sXG4gICAgICBdIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgIGxpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnc3RhbGUnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTdGFsZSBjYXB0dXJlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc3RhbGUgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKTtcbiAgICAgIGlmICghc3RhbGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGkudGV4dENvbnRlbnQgPSAnTm9uZSAtIGV2ZXJ5dGhpbmcgcmVzb2x2ZXMuJztcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH0gZWxzZSBmb3IgKGNvbnN0IG0gb2Ygc3RhbGUpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBsaS5hcHBlbmQoJyAnKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgKG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDUwKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnY29tbWVudHMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdDb21tZW50cycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3QgZmJzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBGZWVkYmFja01lc3NhZ2UgPT4gbS50eXBlID09PSAnZmVlZGJhY2snKTtcbiAgICAgIGNvbnN0IHRvdGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHRvdGFsLmFwcGVuZCgnVG90YWwgd29yZHM6ICcpO1xuICAgICAgYXBwZW5kQm9sZCh0b3RhbCwgU3RyaW5nKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyB3b3JkQ291bnQobS50ZXh0KSwgMCkpKTtcbiAgICAgIHVsLmFwcGVuZCh0b3RhbCk7XG4gICAgICBjb25zdCBhdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgYXZnLmFwcGVuZCgnQXZlcmFnZSBsZW5ndGg6ICcpO1xuICAgICAgYXBwZW5kQm9sZChhdmcsIFN0cmluZyhmYnMubGVuZ3RoID8gTWF0aC5yb3VuZChmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgbS50ZXh0Lmxlbmd0aCwgMCkgLyBmYnMubGVuZ3RoKSA6IDApKTtcbiAgICAgIGF2Zy5hcHBlbmQoJyBjaGFycycpO1xuICAgICAgdWwuYXBwZW5kKGF2Zyk7XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAncGFnZXMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdQYWdlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNlZW4uc2V0KG0uZW50cnkudXJsLCAoc2Vlbi5nZXQobS5lbnRyeS51cmwpID8/IDApICsgMSk7XG4gICAgICBmb3IgKGNvbnN0IFt1cmwsIG5dIG9mIHNlZW4pIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcobikpO1xuICAgICAgICBsaS5hcHBlbmQoYCBzZWxlY3RvciR7biA9PT0gMSA/ICcnIDogJ3MnfSDCtyBgKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgcGF0aE9mKHVybCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZztcbiAgfTtcbiAgY29uc3Qgc2hvd0RyaWxsZG93biA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qga2luZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdCcpO1xuICAgIGlmICgha2luZCkgcmV0dXJuO1xuICAgIGRyaWxsZG93bkVsLnJlcGxhY2VDaGlsZHJlbihidWlsZERyaWxsZG93bihraW5kKSk7XG4gICAgZHJpbGxkb3duRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkUiA9IGRyaWxsZG93bkVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDY7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIGRSLndpZHRoIC8gMjtcbiAgICBpZiAodG9wICsgZFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSBkUi5oZWlnaHQgLSA2O1xuICAgIGlmIChsZWZ0IDwgNikgbGVmdCA9IDY7XG4gICAgaWYgKGxlZnQgKyBkUi53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNikgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZFIud2lkdGggLSA2O1xuICAgIGRyaWxsZG93bkVsLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7dG9wfXB4O2xlZnQ6JHtsZWZ0fXB4O2A7XG4gIH07XG4gIGNvbnN0IGhpZGVEcmlsbGRvd24gPSAoKTogdm9pZCA9PiB7IGRyaWxsZG93bkVsLmhpZGRlbiA9IHRydWU7IH07XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcuc3RhdFtkYXRhLXN0YXRdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0KSBzaG93RHJpbGxkb3duKHQpO1xuICB9KTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgaWYgKCFzdGF0c0VsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZURyaWxsZG93bigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0LWJ1dHRvbiBob3ZlciDihpIgb3V0bGluZS1tdWx0aSBvbiBwYWdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBmb3IgKGNvbnN0IGJ0biBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1leHBvcnQtaG92ZXJdJykpIHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpJywgc2VsZWN0b3JzfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QuYWRkKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgQ2xpY2sgZGVsZWdhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXIgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICBpZiAoIXRyaWdnZXIpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aW9uID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJyk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ3NlbmQnOiBzZW5kRmVlZGJhY2soKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1hbGwnOiB2b2lkIG9uQ29weUFsbCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQnOiB2b2lkIG9uRXhwb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydC16aXAnOiB2b2lkIG9uRXhwb3J0WmlwKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktcGF0aCc6IHZvaWQgb25Db3B5UGF0aCgpOyByZXR1cm47XG4gICAgICBjYXNlICdpbXBvcnQnOiBvbkltcG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHZvaWQgb25WYWxpZGF0ZSgpOyByZXR1cm47XG4gICAgICBjYXNlICdyZWF0dGFjaCc6IHZvaWQgb25SZWF0dGFjaCgpOyByZXR1cm47XG4gICAgICBjYXNlICdxdWlldC1lbmFibGUnOiB2b2lkIG9uUXVpZXRFbmFibGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncXVpZXQtZGlzbWlzcyc6IG9uUXVpZXREaXNtaXNzKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NsZWFyJzogb25DbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdnaXRodWInOiBvbkdpdGh1YigpOyByZXR1cm47XG4gICAgICBjYXNlICdzZXR0aW5ncyc6IG9wZW5EcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY2xvc2UtZHJhd2VyJzogY2xvc2VEcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndW5kbyc6IHVuZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVkbyc6IHJlZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZGVzaWduLWVkaXQnOiB7IHZvaWQgb3Blbk1kTW9kYWwoJ2Rlc2lnbicpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ3NraWxsLWVkaXQnOiAgeyB2b2lkIG9wZW5NZE1vZGFsKCdza2lsbCcpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi10ZW1wbGF0ZS1kb3dubG9hZCc6IHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIEFsd2F5cyB0aGUgUExBSU4gU1RPQ0sgdGVtcGxhdGUg4oCUIHRoZSBsb2NhbC4qIGRldi1vdmVycmlkZVxuICAgICAgICAgIC8vIHByZWZlcmVuY2UgY29udGFtaW5hdGVkIGRlZmF1bHRzIHdpdGggYSBkZXZlbG9wZXIncyBvd24gYnJhbmQuXG4gICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnREVTSUdOLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdERVNJR04ubWQgdGVtcGxhdGUgZG93bmxvYWRlZCDigJQgZmlsbCBpbiBhbmQgcmUtdXBsb2FkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuZGVzaWduTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbGwtbWQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJyk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgdGVtcGxhdGUgZG93bmxvYWRlZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuc2tpbGxNZCA9ICcnO1xuICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdTS0lMTC5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnd3MtY3JlYXRlJzoge1xuICAgICAgICBjb25zdCBuYW1lID0gKHdzTmFtZS52YWx1ZSA/PyAnJykudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcbiAgICAgICAgdm9pZCBjcmVhdGVXb3Jrc3BhY2VGbG93KG5hbWUpLnRoZW4oKG9rKSA9PiB7IGlmIChvaykgd3NOYW1lLnZhbHVlID0gJyc7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEdsb2JhbCBrZXlib2FyZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0ID0gKHRhcmdldDogRXZlbnRUYXJnZXQgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgZWwgPSB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/IHRhcmdldCA6IG51bGw7XG4gICAgcmV0dXJuIEJvb2xlYW4oZWw/LmNsb3Nlc3QoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBbY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXSwgW2NvbnRlbnRlZGl0YWJsZT1cIlwiXScpKTtcbiAgfTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBjb25zdCBlZGl0YWJsZVRhcmdldCA9IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldChlLnRhcmdldCk7XG4gICAgaWYgKGVkaXRhYmxlVGFyZ2V0ICYmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBbJ2EnLCAneicsICd5J10uaW5jbHVkZXMoZS5rZXkudG9Mb3dlckNhc2UoKSkpIHJldHVybjtcbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICdrJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHBhbGV0dGUuaGlkZGVuID8gb3BlblBhbGV0dGUoKSA6IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAvLyBDdHJsK0YgKGFuZCBDbWQrRikgb3BlbnMgdGhlIGluLWxpc3QgdmlzdWFsIGZpbmQg4oCUIGRpc3RpbmN0IGZyb20gdGhlXG4gICAgLy8gQ21kK0sgY29tbWFuZCBwYWxldHRlLiBPdmVycmlkZSB0aGUgYnJvd3NlcidzIG5hdGl2ZSBmaW5kIHNvIHRoZSBwYW5lbFxuICAgIC8vIG93bnMgdGhlIGdlc3R1cmUuXG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnZicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBvcGVuRmluZCgpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHVuZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiAoZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3knIHx8IChlLnNoaWZ0S2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JykpKSB7IGUucHJldmVudERlZmF1bHQoKTsgcmVkbygpOyByZXR1cm47IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBjb25zdCBtZE1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgICAgaWYgKG1kTW9kYWwgJiYgIW1kTW9kYWwuaGlkZGVuKSB7IGNsb3NlTWRNb2RhbCgpOyByZXR1cm47IH1cbiAgICAgIGlmICghcGFsZXR0ZS5oaWRkZW4pIHsgY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFkcmF3ZXIuaGlkZGVuKSB7IGNsb3NlRHJhd2VyKCk7IHJldHVybjsgfVxuICAgICAgaWYgKGZpbmRCYXIgJiYgIWZpbmRCYXIuaGlkZGVuKSB7IGNsb3NlRmluZCgpOyByZXR1cm47IH1cbiAgICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSB7IHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9KTsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyBzZXRTdGF0dXMoJ1BlbmRpbmcgZ3JvdXAgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSBjbG9zZUZpbmQoKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnQWx0JyB8fCBlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiB0cnVlfSk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgaWYgKCFlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBhbmVsUmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgcGVuZGluZ1BhbmVsTWVzc2FnZXM6IGFueVtdID0gW107XG4gIGNvbnN0IHJlY2VpdmVQYW5lbE1lc3NhZ2UgPSAobTogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYW5lbFJlYWR5KSB7XG4gICAgICBwZW5kaW5nUGFuZWxNZXNzYWdlcy5wdXNoKG0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbkNzTWVzc2FnZShtKTtcbiAgfTtcbiAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgLy8gU2luZ2xlIGNoYW5uZWw6IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS4gVGhlIGJhY2tncm91bmQgdXNlZCB0byByZWxheVxuICAgIC8vIHRocm91Z2ggYSBwb3J0IHRvbywgYnV0IGNvbnRlbnQtc2NyaXB0IGJyb2FkY2FzdHMgYWxyZWFkeSByZWFjaCB0aGVcbiAgICAvLyBzaWRlIHBhbmVsIGRpcmVjdGx5IOKAlCByZWxheWluZyBwcm9kdWNlZCBkdXBsaWNhdGUgZGlzcGF0Y2hlcy5cbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG06IGFueSkgPT4gcmVjZWl2ZVBhbmVsTWVzc2FnZShtKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uQWN0aXZhdGVkPy5hZGRMaXN0ZW5lcigoKSA9PiB2b2lkIHJ1blZhbGlkYXRpb24oKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uVXBkYXRlZD8uYWRkTGlzdGVuZXIoKF9pZCwgaW5mbykgPT4geyBpZiAoaW5mbz8uc3RhdHVzID09PSAnY29tcGxldGUnKSB2b2lkIHJ1blZhbGlkYXRpb24oKTsgfSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uUmVtb3ZlZD8uYWRkTGlzdGVuZXIoKGNsb3NlZElkKSA9PiB7XG4gICAgICBjb25zdCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy50YWJJZCA9PT0gY2xvc2VkSWQpO1xuICAgICAgaWYgKHdzKSB7IHdzLnRhYklkID0gdW5kZWZpbmVkOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZW5kZXJXc0NvbnRyb2xzKCk7IH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOnRvLXBhbmVsJywgKGUpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UoKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbCkpO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFRlc3QgQVBJIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpbnN0YWxsVGVzdEFwaSA9ICgpOiB2b2lkID0+IHtcbiAgICAod2luZG93IGFzIGFueSkuX19waW5jaGdyYWJfcGFuZWwgPSB7XG4gICAgICBwdXNoTWVzc2FnZTogKG06IFBhbmVsTWVzc2FnZSkgPT4geyBtZXNzYWdlcy5wdXNoKG0pOyBwZXJzaXN0KCk7IHJlbmRlcigpOyB9LFxuICAgICAgb25DYXB0dXJlLCBvbkhvdmVyLCBvbkhvdmVyRW5kLCBvblBhZ2VTbmFwc2hvdCxcbiAgICAgIGdldE1lc3NhZ2VzOiAoKSA9PiBbLi4ubWVzc2FnZXNdLFxuICAgICAgZ2V0UHJlZnM6ICgpID0+ICh7Li4ucHJlZnN9KSxcbiAgICAgIHNldFByZWZzOiAocDogUGFydGlhbDxQcmVmcz4pID0+IHsgcHJlZnMgPSB7Li4ucHJlZnMsIC4uLnB9OyBwZXJzaXN0UHJlZnMoKTsgYXBwbHlQcmVmc1RvVUkoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBidWlsZEpzb25sLFxuICAgICAgYnVpbGRFeHBvcnRGaWxlbmFtZSwgYnVpbGRNYW5pZmVzdCwgZG9taW5hbnRIb3N0U2x1ZywgZGlzdGluY3RIb3N0cyxcbiAgICAgIGR1Y2tEYlNuaXBwZXQsIG9uRXhwb3J0WmlwLCBvbkV4cG9ydCwgb25Db3B5UGF0aCxcbiAgICAgIGRlbm9ybWFsaXplRW50cnksXG4gICAgICBnZXRMYXN0RXhwb3J0OiAoKSA9PiAoey4uLmxhc3RFeHBvcnR9KSxcbiAgICAgIGdldExhc3RBZ2VudFByb21wdDogKCkgPT4gbGFzdEV4cG9ydC5hZ2VudFByb21wdCxcbiAgICAgIC8vIFRlc3QgaGF0Y2g6IHNlZWQgZXZlcnkgc2VsZWN0b3IgY2FwdHVyZSB3aXRoIHRoZSBzYW1lIGZ1bGwgUE5HIGRhdGFVUkxcbiAgICAgIC8vIHNvIHRoZSBhcmNoaXZlIGV4cG9ydCBoYXMgc29tZXRoaW5nIHRvIGJ1bmRsZS4gUmVhbCBjYXB0dXJlcyBwb3B1bGF0ZVxuICAgICAgLy8gc2hvdHNGdWxsIGZyb20gdGhlIGJnIGBydW5TaG90YCByZXBseTsgdGVzdHMgY2FuJ3QgZWFzaWx5IHJ1biBhXG4gICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiwgc28gdGhpcyBsZXRzIHVzIHByb3ZlIHRoZSBQTkcgYnVuZGxpbmcgcGF0aC5cbiAgICAgIF9fc2VlZFNob3RzRnVsbDogKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzaG90c0Z1bGwuc2V0KG0uZW50cnkuc2VsZWN0b3IsIGRhdGFVcmwpO1xuICAgICAgICB9XG4gICAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICAgIH0sXG4gICAgICBfX2dldFNob3RzRnVsbDogKCkgPT4gc2hvdHNGdWxsLFxuICAgICAgLy8gRnJlZXplIHRoZSBleHBvcnQgY2xvY2sgKElTTyBzdHJpbmcpIHNvIHRlc3RzIGNhbiBhc3NlcnQgdHdvXG4gICAgICAvLyBleHBvcnRzIG9mIGlkZW50aWNhbCBjb250ZW50IGFyZSBieXRlLWlkZW50aWNhbC4gUGFzcyBudWxsIHRvXG4gICAgICAvLyByZXN0b3JlIHdhbGwtY2xvY2sgYmVoYXZpb3IuXG4gICAgICBfX3NldEV4cG9ydENsb2NrOiAoaXNvOiBzdHJpbmcgfCBudWxsKSA9PiB7IGV4cG9ydENsb2NrT3ZlcnJpZGUgPSBpc287IH0sXG4gICAgICAvLyBzZXRTZWFyY2ggZHJpdmVzIHRoZSBDdHJsK0YgdmlzdWFsLWZpbmQgcGF0aCAodGhlIGhlYWRlciBzZWFyY2ggbm93XG4gICAgICAvLyBvcGVucyB0aGUgY29tbWFuZCBwYWxldHRlIGluc3RlYWQgb2YgZmlsdGVyaW5nKS5cbiAgICAgIHNldFNlYXJjaDogKHE6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAocSkgeyBvcGVuRmluZCgpOyBpZiAoZmluZElucHV0KSBmaW5kSW5wdXQudmFsdWUgPSBxOyBhcHBseUZpbmQocSk7IH1cbiAgICAgICAgZWxzZSBjbG9zZUZpbmQoKTtcbiAgICAgIH0sXG4gICAgICBvcGVuRmluZCwgY2xvc2VGaW5kLFxuICAgICAgaXNGaW5kT3BlbjogKCkgPT4gQm9vbGVhbihmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbiksXG4gICAgICBzZXRWYWxpZGl0eTogKHNlbDogc3RyaW5nLCBvazogYm9vbGVhbiB8ICdkaWZmLXBhZ2UnLCByZWFzb24/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChyZWFzb24pIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsIHJlYXNvbik7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyOiAoKSA9PiB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgICAgICBsaXZlVGFiUGF0aCA9IG51bGw7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgICAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgICAgIHNob3RzLmNsZWFyKCk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb3BlblBhbGV0dGUsIGNsb3NlUGFsZXR0ZSwgb3BlbkRyYXdlciwgY2xvc2VEcmF3ZXIsXG4gICAgICBzZW5kRmVlZGJhY2ssIHVuZG8sIHJlZG8sXG4gICAgICBsaXN0V29ya3NwYWNlczogKCkgPT4gWy4uLndvcmtzcGFjZXNdLFxuICAgICAgYWN0aXZlV29ya3NwYWNlOiAoKSA9PiBhY3RpdmVXcyxcbiAgICAgIHNldFN0aWNreVRUTDogKG1zOiBudW1iZXIpID0+IHsgU1RJQ0tZX1RUTF9NUyA9IG1zOyB9LFxuICAgICAgZm9yY2VTdGlja3lFeHBpcmU6ICgpID0+IHsgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTsgcGFuZWxIb3ZlcmVkID0gZmFsc2U7IGFybVN0aWNreUV4cGlyeSgpOyB9LFxuICAgICAgc2V0TGFzdEFjdGl2ZSxcbiAgICAgIGNyZWF0ZVdvcmtzcGFjZTogKG46IHN0cmluZykgPT4geyB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IG4sIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IHJldHVybiBsb2FkV29ya3NwYWNlKG4pLnRoZW4ocmVuZGVyKTsgfSxcbiAgICAgIHN3aXRjaFdvcmtzcGFjZTogKG46IHN0cmluZykgPT4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlciksXG4gICAgICBjbGVhckFsbDogb25DbGVhcixcbiAgICAgIGxpc3RTbmFwc2hvdHM6ICgpID0+IHdzU25hcHNob3RzLm1hcCgocykgPT4gKHtpZDogcy5pZCwgdHM6IHMudHMsIHNlbGVjdG9yczogcy5zZWxlY3RvcnMsIGNvbW1lbnRzOiBzLmNvbW1lbnRzfSkpLFxuICAgICAgcmVzdG9yZVNuYXBzaG90OiAoaWQ6IHN0cmluZykgPT4gcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90KGlkKSxcbiAgICB9O1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBQYW5lbCBzZWxmLWhlYWwg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEFmdGVyIGEgZGV2IGV4dGVuc2lvbiByZWxvYWQgKG9yIGFuIGF1dG8tdXBkYXRlKSwgdGhlIHNpZGUgcGFuZWwga2VlcHNcbiAgLy8gcnVubmluZyBpdHMgT0xEIGNvZGUgd2l0aCBhbiBJTlZBTElEQVRFRCBjaHJvbWUucnVudGltZTogY2hyb21lLnJ1bnRpbWUuaWRcbiAgLy8gZ29lcyB1bmRlZmluZWQgYW5kIGV2ZXJ5IGNocm9tZS4qIGNhbGwgdGhyb3dzIFwiRXh0ZW5zaW9uIGNvbnRleHRcbiAgLy8gaW52YWxpZGF0ZWRcIi4gQSBkZWFkIHBhbmVsIGNhbid0IHJlYWNoIHRoZSBiYWNrZ3JvdW5kLCBzbyBOTyBidXR0b24gaW4gaXRcbiAgLy8gd29ya3Mg4oCUIHdoaWNoIGlzIGV4YWN0bHkgd2h5IHRoZSBvbmx5IHJlY292ZXJ5IHVzZWQgdG8gYmUgXCJjbG9zZSB0aGUgcGFuZVxuICAvLyBhbmQgcmVjbGljayB0aGUgdG9vbGJhclwiLiBUaGlzIGhlYXJ0YmVhdCBkZXRlY3RzIHRoYXQgZGVhdGggYW5kIHJlbG9hZHNcbiAgLy8gdGhlIHBhbmVsIHBhZ2UsIHdoaWNoIHJlLWZldGNoZXMgdGhlIGZyZXNoIGNvZGUgYW5kIHJlY29ubmVjdHMuIEFcbiAgLy8gc2Vzc2lvblN0b3JhZ2UgY291bnRlciAoc3Vydml2ZXMgdGhlIHJlbG9hZCkgcHJldmVudHMgYSBsb29wIHdoZW4gdGhlXG4gIC8vIGV4dGVuc2lvbiBpcyBnZW51aW5lbHkgZ29uZSByYXRoZXIgdGhhbiByZWxvYWRlZC5cbiAgY29uc3Qgd2F0Y2hDb250ZXh0SGVhbHRoID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHJldHVybjtcbiAgICBjb25zdCBSRUxPQURfS0VZID0gJ3BnLmN0eFJlbG9hZHMnO1xuICAgIC8vIE9uY2Ugd2UndmUgYmVlbiBzdGFibHkgYWxpdmUgZm9yIGEgd2hpbGUsIGNsZWFyIHRoZSBsb29wIGd1YXJkLlxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0cnkgeyBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFJFTE9BRF9LRVkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfSwgMTUwMDApO1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGxldCBhbGl2ZSA9IGZhbHNlO1xuICAgICAgdHJ5IHsgYWxpdmUgPSBCb29sZWFuKGNocm9tZS5ydW50aW1lPy5pZCk7IH0gY2F0Y2ggeyBhbGl2ZSA9IGZhbHNlOyB9XG4gICAgICBpZiAoYWxpdmUpIHJldHVybjtcbiAgICAgIGxldCBuID0gMDtcbiAgICAgIHRyeSB7IG4gPSBOdW1iZXIoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShSRUxPQURfS0VZKSA/PyAnMCcpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIGlmIChuID49IDMpIHtcbiAgICAgICAgLy8gQXV0by1yZWNvdmVyeSBleGhhdXN0ZWQgKGV4dGVuc2lvbiBsaWtlbHkgdW5pbnN0YWxsZWQsIG5vdCByZWxvYWRlZCkuXG4gICAgICAgIGlmIChzdGF0dXMpIHN0YXR1cy50ZXh0Q29udGVudCA9ICdQaW5jaEdyYWIgd2FzIHJlbG9hZGVkIOKAlCBjbG9zZSB0aGlzIHBhbmVsIGFuZCByZW9wZW4gaXQgZnJvbSB0aGUgdG9vbGJhci4nO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTE9BRF9LRVksIFN0cmluZyhuICsgMSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIGlmIChzdGF0dXMpIHN0YXR1cy50ZXh0Q29udGVudCA9ICdQaW5jaEdyYWIgcmVsb2FkZWQg4oCUIHJlY29ubmVjdGluZ+KApic7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdHJ5IHsgbG9jYXRpb24ucmVsb2FkKCk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfSB9LCA2MDApO1xuICAgIH0sIDIwMDApO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCb290IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9hZEFsbCgpO1xuICAgIHBhbmVsUmVhZHkgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgbSBvZiBwZW5kaW5nUGFuZWxNZXNzYWdlcy5zcGxpY2UoMCkpIG9uQ3NNZXNzYWdlKG0pO1xuICAgIHJlbmRlcigpO1xuICAgIGluc3RhbGxUZXN0QXBpKCk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gICAgdm9pZCBtYXliZVNob3dRdWlldE51ZGdlKCk7XG4gICAgdm9pZCBmZXRjaFN0YXJzKCk7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gICAgd2F0Y2hDb250ZXh0SGVhbHRoKCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAncmVhZHknLCB7aW5FeHRlbnNpb24sIHdzOiBhY3RpdmVXcywgbWVzc2FnZXM6IG1lc3NhZ2VzLmxlbmd0aH0pO1xuICB9KSgpO1xufSkoKTtcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7O0VBOG5CQSxJQUFJLGNBQWM7QUFBQSxFQUNsQixJQUFNLFNBQVMsTUFBYztBQUFBLElBQzNCLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsYUFBYSxTQUFTLEVBQUU7QUFBQSxJQUN4RSxJQUFJO0FBQUEsTUFDRixNQUFNLFFBQVEsSUFBSSxXQUFXLENBQUM7QUFBQSxNQUM5QixXQUFXLE9BQU8sZ0JBQWdCLEtBQUs7QUFBQSxNQUN2QyxPQUFPLEdBQUcsVUFBVSxNQUFNLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUss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UztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFD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QUFlLE1BQU0sWUFBWSxJQUFJLENBQUMsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxJQUFJLFdBQVcsRUFBRSxXQUFXLFVBQVUsRUFBRSxTQUFRLEVBQUU7QUFBQSxRQUNoSCxpQkFBaUIsQ0FBQyxPQUFlLHlCQUF5QixFQUFFO0FBQUEsTUFDOUQ7QUFBQTtBQUFBLElBYUYsTUFBTSxxQkFBcUIsTUFBWTtBQUFBLE1BQ3JDLElBQUksQ0FBQztBQUFBLFFBQWE7QUFBQSxNQUNsQixNQUFNLGFBQWE7QUFBQSxNQUVuQixXQUFXLE1BQU07QUFBQSxRQUFFLElBQUk7QUFBQSxVQUFFLGVBQWUsV0FBVyxVQUFVO0FBQUEsVUFBSyxNQUFNO0FBQUEsU0FBb0IsS0FBSztBQUFBLE1BQ2pHLFlBQVksTUFBTTtBQUFBLFFBQ2hCLElBQUksUUFBUTtBQUFBLFFBQ1osSUFBSTtBQUFBLFVBQUUsUUFBUSxRQUFRLE9BQU8sU0FBUyxFQUFFO0FBQUEsVUFBSyxNQUFNO0FBQUEsVUFBRSxRQUFRO0FBQUE7QUFBQSxRQUM3RCxJQUFJO0FBQUEsVUFBTztBQUFBLFFBQ1gsSUFBSSxJQUFJO0FBQUEsUUFDUixJQUFJO0FBQUEsVUFBRSxJQUFJLE9BQU8sZUFBZSxRQUFRLFVBQVUsS0FBSyxHQUFHO0FBQUEsVUFBSyxNQUFNO0FBQUEsUUFDckUsSUFBSSxLQUFLLEdBQUc7QUFBQSxVQUVWLElBQUk7QUFBQSxZQUFRLE9BQU8sY0FBYztBQUFBLFVBQ2pDO0FBQUEsUUFDRjtBQUFBLFFBQ0EsSUFBSTtBQUFBLFVBQUUsZUFBZSxRQUFRLFlBQVksT0FBTyxJQUFJLENBQUMsQ0FBQztBQUFBLFVBQUssTUFBTTtBQUFBLFFBQ2pFLElBQUk7QUFBQSxVQUFRLE9BQU8sY0FBYztBQUFBLFFBQ2pDLFdBQVcsTUFBTTtBQUFBLFVBQUUsSUFBSTtBQUFBLFlBQUUsU0FBUyxPQUFPO0FBQUEsWUFBSyxNQUFNO0FBQUEsV0FBb0IsR0FBRztBQUFBLFNBQzFFLElBQUk7QUFBQTtBQUFBLEtBSUgsWUFBWTtBQUFBLE1BQ2hCLE1BQU0sUUFBUTtBQUFBLE1BQ2QsYUFBYTtBQUFBLE1BQ2IsV0FBVyxLQUFLLHFCQUFxQixPQUFPLENBQUM7QUFBQSxRQUFHLFlBQVksQ0FBQztBQUFBLE1BQzdELE9BQU87QUFBQSxNQUNQLGVBQWU7QUFBQSxNQUNWLGNBQWM7QUFBQSxNQUNkLG9CQUFvQjtBQUFBLE1BQ3BCLFdBQVc7QUFBQSxNQUNoQixvQkFBb0I7QUFBQSxNQUNwQixrQkFBa0I7QUFBQSxNQUNsQixtQkFBbUI7QUFBQSxNQUNuQixRQUFRLElBQUksS0FBSyxTQUFTLEVBQUMsYUFBYSxJQUFJLFVBQVUsVUFBVSxTQUFTLE9BQU0sQ0FBQztBQUFBLE9BQy9FO0FBQUEsS0FDRjsiLAogICJkZWJ1Z0lkIjogIkFBM0ZDMTJBOTJCNTM3NDk2NDc1NkUyMTY0NzU2RTIxIiwKICAibmFtZXMiOiBbXQp9
