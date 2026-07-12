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
  var buildBootstrapScript = ({ workspace, bundleId, archivePath, exportTs }) => [
    "#!/usr/bin/env bash",
    "# PinchGrab bootstrap — idempotent; safe to re-run.",
    "set -euo pipefail",
    `WS='${workspace}'`,
    `BID='${bundleId}'`,
    `SRC='${archivePath}'`,
    "# The clipboard may carry the ~/Downloads form; expand a leading ~.",
    'SRC="${SRC/#\\~/$HOME}"',
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
  var renderBundleTree = (entryNames, { collapseAt = 8, maxLines = 120 } = {}) => {
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
        if (total > collapseAt) {
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
      text: `You have been handed a PinchGrab feedback bundle: ${counts.comments} operator comments pinned to live UI elements of the product built from <PROJECT_ROOT> (infer <PROJECT_ROOT> from your current working directory; if ambiguous, ask before editing). Do this now, in order: (1) execute the bash script in the next 'bootstrap' line exactly as written (its 'script' field is a JSON-escaped plain bash script; if the archive path is a Windows path and you run inside WSL, translate C:\\ to /mnt/c/ first); (2) read EVERY file listed in the 'files' line fully into context; (3) follow AGENT-PROTOCOL.md to map, plan, implement, test, audit, and verify a fix for every comment.`
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
      const { entries: pageHtmlEntries, pagesMeta, diagnostics: pageHtmlDiagnostics } = await collectPageHtmlEntries();
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
      const entryNamesForDocs = [...tarEntries.map((e) => e.name), "AGENT-PROTOCOL.md"].sort();
      const agentPromptOpts = {
        workspace: activeWs,
        bundleId,
        archivePath: archiveName,
        exportTs: exportedAtIso,
        jsonlName,
        counts: { comments: manifest.counts.feedback, selectors: manifest.counts.selectors, pages: manifest.counts.pages, screenshots: shotEntries.length },
        entryNames: entryNamesForDocs,
        designIsTemplate: isUsingTemplateDesign()
      };
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
      const predictedPath = `~/Downloads/pinchgrab/${activeWs}/exports/${archiveName}`;
      lastExport.agentPrompt = buildAgentPromptJsonl({ ...agentPromptOpts, archivePath: predictedPath });
      const earlyCopied = await copyToClipboardSilent(lastExport.agentPrompt);
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
      console.log(LOG, "ready", { inExtension, ws: activeWs, messages: messages.length });
    })();
  })();
})();

//# debugId=5E6FEC4F33B561D264756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvYnVuZGxlZC1za2lsbHMuZ2VuLnRzIiwgInNyYy9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICAvLyBVc2VyIGV4cGxpY2l0bHkgZGV0YWNoZWQgdGhpcyBjb21tZW50IGZyb20gYW55IHNlbGVjdG9yLiBXaXRob3V0IHRoZVxuICAvLyBmbGFnLCBhZGphY2VuY3kgdG8gdGhlIHByZWNlZGluZyBzZWxlY3RvciB3b3VsZCBzaWxlbnRseSByZS1hZG9wdCB0aGVcbiAgLy8gY29tbWVudCBhdCByZW5kZXIvZXhwb3J0IHRpbWUuXG4gIGRldGFjaGVkPzogYm9vbGVhbjtcbiAgdGFncz86IHN0cmluZ1tdO1xuICAvLyBTZXZlcml0eSAoYG5vdGVgIC8gYGZpeGAgLyBgYmxvY2tgKSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSBpblxuICAvLyAyMDI2LTA1LiBUaGUgZmllbGQgaXMgcmV0YWluZWQgb24gdGhlIHR5cGUgYXMgYHVua25vd25gIHNvXG4gIC8vIHRvbGVyYW50IHJlYWRlcnMgKGBkZW5vcm1hbGl6ZUVudHJ5YCkgZG9uJ3QgZHJvcCB0aGUgdmFsdWUgZnJvbVxuICAvLyBsZWdhY3kgSlNPTkwgZXhwb3J0czsgbmV3IHNlc3Npb25zIG5ldmVyIHNldCBpdC5cbiAgc2V2ZXJpdHk/OiAnbm90ZScgfCAnZml4JyB8ICdibG9jayc7XG59O1xuXG5leHBvcnQgdHlwZSBQYWdlTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3BhZ2UnO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHZpZXdwb3J0PzogVmlld3BvcnQ7XG4gIHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBSb3V0ZSBpZGVudGl0eSBiZXlvbmQgdGhlIFVSTC4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIG9mIHBhdGhuYW1lXG4gIC8vIC8gcXVlcnkgLyBoYXNoICsgYSBndWVzcyBhdCB0aGVcbiAgLy8gYWN0aXZlIHJvdXRlTmFtZSAoYD9yb3V0ZT1zZXR0aW5nc2Agb3IgYCMvdXNlcnMvNDJgIHN0eWxlKS5cbiAgcm91dGU/OiB7XG4gICAgcGF0aG5hbWU/OiBzdHJpbmc7XG4gICAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGhhc2g/OiBzdHJpbmc7XG4gICAgcm91dGVOYW1lPzogc3RyaW5nO1xuICAgIHJvdXRlUGFyYW0/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFJlZGFjdGVkIHN0YXRlIHNuYXBzaG90LiBTdXJmYWNlcyB0aGUgU0hBUEUgb2Ygc3RhdGUgdGhhdCBwcm9kdWNlZFxuICAvLyB0aGUgcGFnZSAoc3RvcmFnZSBrZXlzLCBjb29raWUgbmFtZXMsIGZlYXR1cmUgZmxhZ3MpIHdpdGhvdXRcbiAgLy8gbGVha2luZyB2YWx1ZXMuIExldHMgYSBkb3duc3RyZWFtIGFnZW50IHJlcHJvZHVjZSBieSBzZXR0aW5nIHVwIHRoZVxuICAvLyBzYW1lIGtleXMgd2l0aCB0aGVpciBvd24gZGF0YS5cbiAgc3RhdGU/OiB7XG4gICAgc3RvcmFnZUtleXM/OiBzdHJpbmdbXTtcbiAgICBzZXNzaW9uS2V5cz86IHN0cmluZ1tdO1xuICAgIGNvb2tpZU5hbWVzPzogc3RyaW5nW107XG4gICAgZmVhdHVyZUZsYWdzPzogc3RyaW5nO1xuICB9O1xuICAvLyBTZXNzaW9uIHV1aWQuIFN0YWJsZSBwZXIgd29ya3NwYWNlLWJvb3Qg4oCUIHNlbGVjdG9yIGVudHJpZXMgcmVmZXJlbmNlXG4gIC8vIGl0IHZpYSBgRW50cnkuc2Vzc2lvbklkYCBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzIHRvIHRoZWlyXG4gIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJpc29uLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbE1lc3NhZ2UgPSBTZWxlY3Rvck1lc3NhZ2UgfCBGZWVkYmFja01lc3NhZ2UgfCBQYWdlTWVzc2FnZTtcblxuLy8gLS0tLS0tLS0tLSBJUEMgcGF5bG9hZHMgKENTIOKGlCBQYW5lbCDihpQgQmFja2dyb3VuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIENzVG9QYW5lbCA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlJzsgZW50cnk6IEVudHJ5OyBwYWdlOiBQYWdlQ29udGV4dDsgZ3JvdXBlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdob3Zlcic7IHNlbGVjdG9yOiBzdHJpbmc7IHRhZzogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByZWN0OiBSZWN0fVxuICB8IHtraW5kOiAnaG92ZXItZW5kJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIC8vIEV4cG9ydC10aW1lIHJlcXVlc3QgZm9yIHRoZSBmdWxsIHNlcmlhbGl6ZWQgcGFnZSAob3B0LWluIHByZWZcbiAgLy8gaW5jbHVkZVBhZ2VIVE1MKS4gUmVwbGllZCB3aXRoIHtvaywgdXJsLCB0aXRsZSwgaHRtbH07IG5ldmVyIHBlcnNpc3RlZFxuICAvLyB0byBjaHJvbWUuc3RvcmFnZSDigJQgdGhlIHBheWxvYWQgZ29lcyBzdHJhaWdodCBpbnRvIHRoZSB0YXIuXG4gIHwge2tpbmQ6ICdwYWdlLWh0bWwnfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gRnVsbC1wYWdlIChiZXN0LWVmZm9ydCkgc2NyZWVuc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gVW5saWtlXG4gIC8vIHNob3QtcGFnZSB0aGlzIGRvZXMgTk9UIHdyaXRlIGEgZmlsZSBvciBidWlsZCBhIHRodW1ibmFpbCDigJQgaXQganVzdFxuICAvLyByZXR1cm5zIHRoZSBzdGl0Y2hlZCBQTkcgYXMgYSBkYXRhIFVSTCBzbyB0aGUgY2FsbGVyIChjb250ZW50IHNjcmlwdCkgY2FuXG4gIC8vIGF0dGFjaCBpdCB0byBhIFBhZ2VTbmFwc2hvdC4gYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydFxuICAvLyBjb3VsZCBiZSBjYXB0dXJlZC5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gKHJlKWluamVjdCB0aGUgY29udGVudCBzY3JpcHQg4oCUIHRoZSBmaXhcbiAgLy8gZm9yIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIGNvbnRlbnQgc2NyaXB0LiBEZWZhdWx0cyB0byB0aGUgYWN0aXZlIHRhYi5cbiAgfCB7a2luZDogJ3BnLXJlaW5qZWN0JzsgdGFiSWQ/OiBudW1iZXJ9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuLy8gUmVwbHkgdG8gYSBgcGFnZS1zbmFwc2hvdC1zaG90YCByZXF1ZXN0LiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwgb2Zcbi8vIHRoZSAoYmVzdC1lZmZvcnQpIGZ1bGwgcGFnZTsgYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCB3YXNcbi8vIGNhcHR1cmVkLiBgb2s6ZmFsc2VgIGNhcnJpZXMgYW4gZXJyb3Igc3RyaW5nLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBzY3JlZW5zaG90Pzogc3RyaW5nO1xuICBwYXJ0aWFsPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBTYXZlUmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGhcbiAgYWJzUGF0aD86IHN0cmluZzsgIC8vIE9TLWFic29sdXRlIHBhdGhcbiAgY29weVBhdGg/OiBzdHJpbmc7IC8vIFVJLWZhY2luZyBwYXRoXG4gIHRlbXBQYXRoPzogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBCZ1JlcGx5ID1cbiAgfCB7ZGF0YVVybDogc3RyaW5nfVxuICB8IHtmb3VuZDogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyfVxuICB8IHt0YWJzOiBBcnJheTx7aWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9Pn1cbiAgfCB7ZXJyb3I6IHN0cmluZ31cbiAgfCBTaG90UmVwbHlcbiAgfCBTYXZlUmVwbHlcbiAgfCBQYWdlU25hcHNob3RSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5OiBmaXJzdCAxNiBoZXggY2hhcnMgb2YgYSBTSEEtMjU2IG92ZXIgdGhlXG4gIC8vIHNsaW0gcm93cyArIHNjcmVlbnNob3QgbmFtZXMuIFN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cyBvZiB0aGUgc2FtZVxuICAvLyBjb250ZW50LCBzbyBkb3duc3RyZWFtIHN0YXRlIChlLmcuIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyovYnVuZGxlcy8pXG4gIC8vIGtleXMgb24gaXQgd2l0aG91dCBkdXBsaWNhdGluZyB3b3JrLlxuICBidW5kbGVJZD86IHN0cmluZztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gICAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gICAgcGFnZXNIdG1sPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBXaGVyZSB0aGUgYWdlbnQgZG9jdHJpbmUgbGl2ZXMgaW5zaWRlIHRoZSBhcmNoaXZlIChTZW5kLXRvLUFnZW50XG4gIC8vIHByb3RvY29sKS4gQWJzZW50IG9uIHBsYWluIEpTT05MIGV4cG9ydHMuXG4gIGFnZW50UHJvdG9jb2w/OiB7YXJjaGl2ZVBhdGg6IHN0cmluZ307XG4gIC8vIFZlbmRvcmVkIHNraWxsIGRvY3VtZW50cyBidW5kbGVkIGludG8gdGhpcyBhcmNoaXZlIChzdWJzZXQgb2YgdGhlXG4gIC8vIHJpY2hlciBza2lsbHMtaW5kZXguanNvbiBhdCB0aGUgYXJjaGl2ZSByb290KS4gYGludm9jYXRpb25gIGNhcnJpZXMgYVxuICAvLyBwbHVnaW4tY29tbWFuZCBmb3JtIGZvciBoYXJuZXNzZXMgdGhhdCBzdXBwb3J0IGl0LlxuICBidW5kbGVkU2tpbGxzPzogQXJyYXk8e2lkOiBzdHJpbmc7IGtpbmQ6ICdza2lsbCcgfCAncmVmZXJlbmNlJzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgaW52b2NhdGlvbj86IHN0cmluZ30+O1xuICAvLyBGdWxsLXBhZ2UgSFRNTCBkb2N1bWVudHMgYnVuZGxlZCB1bmRlciBwYWdlcy8gKG9wdC1pbiBwcmVmKS5cbiAgcGFnZXNIdG1sPzogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47XG4gIC8vIFNlbGYtcm9hc3Qgc2VjdGlvbi4gVGhlIGV4cG9ydCBzdXJmYWNlcyBpdHMgb3duIGdhcHMgc28gYVxuICAvLyBkb3duc3RyZWFtIExMTSBkb2Vzbid0IGhhdmUgdG8gZGlzY292ZXJcbiAgLy8gdGhlbS4gRW1wdHkgYXJyYXkgPSBjbGVhbiBleHBvcnQuIEVhY2ggZGlhZ25vc3RpYyBoYXMgYSBzdGFibGVcbiAgLy8gYGNvZGVgIHNvIHJlY2VpdmVycyBjYW4gZGlzcGF0Y2ggb24gaXQgcHJvZ3JhbW1hdGljYWxseS5cbiAgZXhwb3J0RGlhZ25vc3RpY3M/OiBFeHBvcnREaWFnbm9zdGljW107XG4gIC8vIEFyY2hpdmUgaW50ZWdyaXR5LiBSZWNlaXZlcnMgY2FuIGRldGVjdCBwYXJ0aWFsIGV4dHJhY3Rpb24gL1xuICAvLyBjb3JydXB0aW9uIHdpdGggYSBzaW5nbGUgY2hlY2suXG4gIGFyY2hpdmVJbnRlZ3JpdHk/OiB7XG4gICAgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+O1xuICB9O1xuICAvLyBCdWlsZC9zb3VyY2UgaWRlbnRpdHkuIENhcHR1cmVkIGZyb20gYVxuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluIGRpcnR5OnRydWVcIj5gXG4gIC8vIHRhZyB0aGUgdXNlcidzIGFwcCBpbmplY3RzLCBwbHVzIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB0ZWxsIGlmIHRoZSBleHBvcnQgaXMgc3RhbGUgcmVsYXRpdmUgdG8gdGhlIHJlcG8uXG4gIC8vIE9taXR0ZWQgZW50aXJlbHkgd2hlbiBubyBidWlsZCBpbmZvIGlzIGF2YWlsYWJsZS5cbiAgYnVpbGQ/OiB7XG4gICAgZXh0ZW5zaW9uVmVyc2lvbj86IHN0cmluZztcbiAgICBjb21taXQ/OiBzdHJpbmc7XG4gICAgYnJhbmNoPzogc3RyaW5nO1xuICAgIGRpcnR5PzogYm9vbGVhbjtcbiAgICBkZXBsb3lCdWlsZD86IHN0cmluZztcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIEV4cG9ydERpYWdub3N0aWMgPSB7XG4gIHNldmVyaXR5OiAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nO1xuICBjb2RlOiBzdHJpbmc7XG4gIGRldGFpbD86IHN0cmluZztcbiAgdWlkPzogc3RyaW5nO1xufTtcblxuLy8gRW52ZWxvcGUgbWFya2VyIHVzZWQgb24gZXZlcnkgUGluY2hHcmFiIG1lc3NhZ2UgKHNvIG90aGVyIGV4dGVuc2lvblxuLy8gbWVzc2FnZXMgdHJhdmVsaW5nIHRocm91Z2ggdGhlIHNhbWUgY2hhbm5lbCBhcmUgaWdub3JlZCkuIF9fbWlkIGlzIGFcbi8vIHBlci1kaXNwYXRjaCB1bmlxdWUgc3RhbXAgc28gcmVjZWl2ZXJzIGNhbiBkZWR1cGUgYSBtZXNzYWdlIHRoYXQgYXJyaXZlc1xuLy8gdGhyb3VnaCBtb3JlIHRoYW4gb25lIGNoYW5uZWwgKGUuZy4gcnVudGltZS5vbk1lc3NhZ2UgKyBhIHBvcnQgcmVsYXkpLlxuZXhwb3J0IHR5cGUgUGdFbnZlbG9wZTxUPiA9IFQgJiB7X19wZzogdHJ1ZTsgX19taWQ6IHN0cmluZ307XG5cbmV4cG9ydCB0eXBlIEFueU1lc3NhZ2UgPSBDc1RvUGFuZWwgfCBQYW5lbFRvQ3MgfCBQYW5lbFRvQmc7XG5cbmxldCBfbWlkQ291bnRlciA9IDA7XG5jb25zdCBuZXdNaWQgPSAoKTogc3RyaW5nID0+IHtcbiAgY29uc3QgcHJlZml4ID0gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7KCsrX21pZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB0cnkge1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke0FycmF5LmZyb20oYnl0ZXMpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxufTtcblxuLy8gSGVscGVyOiBzdGFtcCBhIHBheWxvYWQgd2l0aCB0aGUgZW52ZWxvcGUgbWFya2VyICsgdW5pcXVlIG1lc3NhZ2UgaWQuXG5leHBvcnQgY29uc3QgcGcgPSA8VCBleHRlbmRzIHtraW5kOiBzdHJpbmd9PihwYXlsb2FkOiBUKTogUGdFbnZlbG9wZTxUPiA9PlxuICAoe19fcGc6IHRydWUsIF9fbWlkOiBuZXdNaWQoKSwgLi4ucGF5bG9hZH0pIGFzIFBnRW52ZWxvcGU8VD47XG4iLAogICAgIi8vIFN1YnNldCBvZiBsdWNpZGUuZGV2IGljb25zIGlubGluZWQgYXMgU1ZHIGlubmVyLW1hcmt1cC5cbi8vIEVhY2ggZW50cnkgaXMgdGhlIGJvZHkgb2YgPHN2ZyAuLi4gPiAuLi4gPC9zdmc+OyBzdmdTdHJpbmcoKSB3cmFwcyBpdC5cbi8vIFNpemVzIGRlZmF1bHQgdG8gMTY7IG92ZXJyaWRlIHdpdGggdGhlIHNpemUgYXJndW1lbnQuXG4vL1xuLy8gTUlUIOKAlCBodHRwczovL2dpdGh1Yi5jb20vbHVjaWRlLWljb25zL2x1Y2lkZVxuXG5jb25zdCBJQ09OUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2NoZXZyb24tcmlnaHQnOiAnPHBhdGggZD1cIm05IDE4IDYtNi02LTZcIi8+JyxcbiAgJ2NoZXZyb24tZG93bic6ICc8cGF0aCBkPVwibTYgOSA2IDYgNi02XCIvPicsXG4gIGNvcHk6ICc8cmVjdCB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB4PVwiOFwiIHk9XCI4XCIgcng9XCIyXCIgcnk9XCIyXCIvPjxwYXRoIGQ9XCJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyXCIvPicsXG4gIHBlbmNpbDogJzxwYXRoIGQ9XCJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3elwiLz48cGF0aCBkPVwibTE1IDUgNCA0XCIvPicsXG4gICd0cmFzaC0yJzogJzxwYXRoIGQ9XCJNMyA2aDE4XCIvPjxwYXRoIGQ9XCJNMTkgNnYxNGMwIDEtMSAyLTIgMkg3Yy0xIDAtMi0xLTItMlY2XCIvPjxwYXRoIGQ9XCJNOCA2VjRjMC0xIDEtMiAyLTJoNGMxIDAgMiAxIDIgMnYyXCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjEwXCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxNFwiIHgyPVwiMTRcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz4nLFxuICBwbHVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPjxwYXRoIGQ9XCJNMTIgNXYxNFwiLz4nLFxuICB4OiAnPHBhdGggZD1cIk0xOCA2IDYgMThcIi8+PHBhdGggZD1cIm02IDYgMTIgMTJcIi8+JyxcbiAgbWludXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+JyxcbiAgc2VhcmNoOiAnPGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI4XCIvPjxwYXRoIGQ9XCJtMjEgMjEtNC4zLTQuM1wiLz4nLFxuICBkb3dubG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiNyAxMCAxMiAxNSAxNyAxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMTVcIiB5Mj1cIjNcIi8+JyxcbiAgdXBsb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNyA4IDEyIDMgNyA4XCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIzXCIgeTI9XCIxNVwiLz4nLFxuICBnaXRodWI6ICc8cGF0aCBkPVwiTTE1IDIydi00YTQuOCA0LjggMCAwIDAtMS0zLjVjMyAwIDYtMiA2LTUuNS4wOC0xLjI1LS4yNy0yLjQ4LTEtMy41LjI4LTEuMTUuMjgtMi4zNSAwLTMuNSAwIDAtMSAwLTMgMS41LTIuNjQtLjUtNS4zNi0uNS04IDBDNiAyIDUgMiA1IDJjLS4zIDEuMTUtLjMgMi4zNSAwIDMuNUE1LjQgNS40IDAgMCAwIDQgOWMwIDMuNSAzIDUuNSA2IDUuNS0uMzkuNDktLjY4IDEuMDUtLjg1IDEuNjUtLjE3LjYtLjIyIDEuMjMtLjE1IDEuODV2NFwiLz48cGF0aCBkPVwiTTkgMThjLTQuNTEgMi01LTItNy0yXCIvPicsXG4gIHN0YXI6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIvPicsXG4gICdjaXJjbGUtZG90JzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBjcm9zc2hhaXI6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMjJcIiB4Mj1cIjE4XCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCI2XCIgeDI9XCIyXCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjZcIiB5Mj1cIjJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjIyXCIgeTI9XCIxOFwiLz4nLFxuICB0YXJnZXQ6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNlwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjJcIi8+JyxcbiAgJ3BhbmVsLWxlZnQtY2xvc2UnOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiLz48cGF0aCBkPVwiTTkgM3YxOFwiLz48cGF0aCBkPVwibTE2IDE1LTMtMyAzLTNcIi8+JyxcbiAgJ2V4dGVybmFsLWxpbmsnOiAnPHBhdGggZD1cIk0xNSAzaDZ2NlwiLz48cGF0aCBkPVwiTTEwIDE0IDIxIDNcIi8+PHBhdGggZD1cIk0xOCAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmg2XCIvPicsXG4gICdtZXNzYWdlLXNxdWFyZS1wbHVzJzogJzxwYXRoIGQ9XCJNMjEgMTVhMiAyIDAgMCAxLTIgMkg3bC00IDRWNWEyIDIgMCAwIDEgMi0yaDE0YTIgMiAwIDAgMSAyIDJ6XCIvPjxsaW5lIHgxPVwiOVwiIHgyPVwiMTVcIiB5MT1cIjEwXCIgeTI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiN1wiIHkyPVwiMTNcIi8+JyxcbiAgJ2FsZXJ0LWNpcmNsZSc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI4XCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMi4wMVwiIHkxPVwiMTZcIiB5Mj1cIjE2XCIvPicsXG4gICdyZWZyZXNoLWN3JzogJzxwYXRoIGQ9XCJNMyAxMmE5IDkgMCAwIDEgMTUtNi43TDIxIDhcIi8+PHBhdGggZD1cIk0yMSAzdjVoLTVcIi8+PHBhdGggZD1cIk0yMSAxMmE5IDkgMCAwIDEtMTUgNi43TDMgMTZcIi8+PHBhdGggZD1cIk0zIDIxdi01aDVcIi8+JyxcbiAgJ2ZpbGUtdGV4dCc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjEzXCIgeTI9XCIxM1wiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxN1wiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiOFwiIHkxPVwiOVwiIHkyPVwiOVwiLz4nLFxuICAnZmlsZS1jb2RlJzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PHBhdGggZD1cIm0xMCAxMy0yIDIgMiAyXCIvPjxwYXRoIGQ9XCJtMTQgMTcgMi0yLTItMlwiLz4nLFxuICBpbWFnZTogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIiByeT1cIjJcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjlcIiByPVwiMlwiLz48cGF0aCBkPVwibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjFcIi8+JyxcbiAgLy8gU3R5bGlzZWQgXCJwaW5jaFwiIOKAlCB0d28gb3Bwb3NpbmcgY3VydmVzIG1lZXRpbmcgYXQgYSBjZW50ZXIgZG90LlxuICBwaW5jaDogJzxwYXRoIGQ9XCJNNSA1YzMgMiA1IDQgNyA3LTIgMy00IDUtNyA3XCIvPjxwYXRoIGQ9XCJNMTkgNWMtMyAyLTUgNC03IDcgMiAzIDQgNSA3IDdcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxLjVcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gICdzdGFyLWZpbGxlZCc6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBwaW46ICc8cGF0aCBkPVwiTTEyIDE3djVcIi8+PHBhdGggZD1cIk05IDEwLjc2YTIgMiAwIDAgMS0xLjExIDEuNzlsLTEuNzguOUEyIDIgMCAwIDAgNSAxNS4yNFYxNmExIDEgMCAwIDAgMSAxaDEyYTEgMSAwIDAgMCAxLTF2LS43NmEyIDIgMCAwIDAtMS4xMS0xLjc5bC0xLjc4LS45QTIgMiAwIDAgMSAxNSAxMC43NlY3YTEgMSAwIDAgMSAxLTEgMiAyIDAgMCAwIDAtNEg4YTIgMiAwIDAgMCAwIDQgMSAxIDAgMCAxIDEgMXpcIi8+JyxcbiAgdW5kbzogJzxwYXRoIGQ9XCJNMyA3djZoNlwiLz48cGF0aCBkPVwiTTIxIDE3YTkgOSAwIDAgMC0xNS02LjdMMyAxM1wiLz4nLFxuICByZWRvOiAnPHBhdGggZD1cIk0yMSA3djZoLTZcIi8+PHBhdGggZD1cIk0zIDE3YTkgOSAwIDAgMSAxNS02LjdMMjEgMTNcIi8+JyxcbiAgZm9sZGVyOiAnPHBhdGggZD1cIk0yMCAyMGEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMmgtNy45M2EyIDIgMCAwIDEtMS42Ni0uOWwtLjgyLTEuMkEyIDIgMCAwIDAgNy45MyAzSDRhMiAyIDAgMCAwLTIgMnYxM2EyIDIgMCAwIDAgMiAyWlwiLz4nLFxuICBjaGVjazogJzxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiLz4nLFxuICAnY2lyY2xlLWNoZWNrJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIi8+JyxcbiAgZ3JpcDogJzxjaXJjbGUgY3g9XCI5XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxOVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTlcIiByPVwiMVwiLz4nLFxuICAvLyBCcm9rZW4tY2hhaW4gaWNvbiBmb3IgXCJkZXRhY2ggY29tbWVudCBmcm9tIGl0cyBjYXB0dXJlXCIuIEx1Y2lkZSdzIGB1bmxpbmtgLlxuICB1bmxpbms6ICc8cGF0aCBkPVwibTE4Ljg0IDEyLjI1IDEuNzItMS43MWgtLjAyYTUuMDA0IDUuMDA0IDAgMCAwLS4xMi03LjA3IDUuMDA2IDUuMDA2IDAgMCAwLTYuOTUgMGwtMS43MiAxLjcxXCIvPjxwYXRoIGQ9XCJtNS4xNyAxMS43NS0xLjcxIDEuNzFhNS4wMDQgNS4wMDQgMCAwIDAgLjEyIDcuMDcgNS4wMDYgNS4wMDYgMCAwIDAgNi45NSAwbDEuNzEtMS43MVwiLz48bGluZSB4MT1cIjhcIiB4Mj1cIjhcIiB5MT1cIjJcIiB5Mj1cIjVcIi8+PGxpbmUgeDE9XCIyXCIgeDI9XCI1XCIgeTE9XCI4XCIgeTI9XCI4XCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjE2XCIgeTE9XCIxOVwiIHkyPVwiMjJcIi8+PGxpbmUgeDE9XCIxOVwiIHgyPVwiMjJcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICBzZXR0aW5nczogJzxwYXRoIGQ9XCJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiLz4nLFxuICBpbmZvOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTEyIDE2di00XCIvPjxwYXRoIGQ9XCJNMTIgOGguMDFcIi8+JyxcbiAgLy8gVHJlZS1vZi1yb3dzIOKAlCB1c2VkIGZvciBcIlNwbGl0IGdyb3VwXCIgYWN0aW9uIChkZW5vdGVzIG9uZSBub2RlIGZhbm5pbmdcbiAgLy8gb3V0IGludG8gc2libGluZ3MpLiBMdWNpZGUncyBgbGlzdC10cmVlYC5cbiAgJ2xpc3QtdHJlZSc6ICc8cGF0aCBkPVwiTTIxIDEyaC04XCIvPjxwYXRoIGQ9XCJNMjEgNkg4XCIvPjxwYXRoIGQ9XCJNMjEgMThoLThcIi8+PHBhdGggZD1cIk0zIDZ2NGMwIDEuMS45IDIgMiAyaDNcIi8+PHBhdGggZD1cIk0zIDEwdjZjMCAxLjEuOSAyIDIgMmgzXCIvPicsXG4gIC8vIEdlbmVyaWMgc3BsaXQgaWNvbiBhcyBhIGZhbGxiYWNrIG9wdGlvbi5cbiAgc3BsaXQ6ICc8cGF0aCBkPVwiTTE2IDNoNXY1XCIvPjxwYXRoIGQ9XCJNOCAzSDN2NVwiLz48cGF0aCBkPVwibTIxIDMtNy40NiA3LjQ2YTIgMiAwIDAgMCAwIDIuODNMMjEgMjFcIi8+PHBhdGggZD1cIk0zIDNsNy40NiA3LjQ2YTIgMiAwIDAgMSAwIDIuODNMMyAyMVwiLz4nLFxuICAvLyBDYXJkYm9hcmQtc3R5bGUgYm94IHVzZWQgZm9yIFwiRXhwb3J0IHdvcmtzcGFjZSBhcyBaSVBcIi5cbiAgcGFja2FnZTogJzxwYXRoIGQ9XCJtNy41IDQuMjcgOSA1LjE1XCIvPjxwYXRoIGQ9XCJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaXCIvPjxwYXRoIGQ9XCJNMy4zIDcgMTIgMTJsOC43LTVcIi8+PHBhdGggZD1cIk0xMiAyMlYxMlwiLz4nLFxuICAvLyBUd28gaW50ZXJsb2NraW5nIGxpbmtzIOKAlCB1c2VkIGZvciBcIkNvcHkgYXMgcGF0aFwiLlxuICBsaW5rOiAnPHBhdGggZD1cIk0xMCAxM2E1IDUgMCAwIDAgNy41NC41NGwzLTNhNSA1IDAgMCAwLTcuMDctNy4wN2wtMS43MiAxLjcxXCIvPjxwYXRoIGQ9XCJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzFcIi8+JyxcbiAgLy8gRGF0YWJhc2UvZHVjayBpY29uIGZvciB0aGUgRHVja0RCIHBhbGV0dGUgY29tbWFuZC5cbiAgZGF0YWJhc2U6ICc8ZWxsaXBzZSBjeD1cIjEyXCIgY3k9XCI1XCIgcng9XCI5XCIgcnk9XCIzXCIvPjxwYXRoIGQ9XCJNMyA1VjE5QTkgMyAwIDAgMCAyMSAxOVY1XCIvPjxwYXRoIGQ9XCJNMyAxMkE5IDMgMCAwIDAgMjEgMTJcIi8+Jyxcbn07XG5cbmNvbnN0IHdyYXAgPSAoYm9keTogc3RyaW5nLCBzaXplOiBudW1iZXIpOiBzdHJpbmcgPT5cbiAgYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiJHtzaXplfVwiIGhlaWdodD1cIiR7c2l6ZX1cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+JHtib2R5fTwvc3ZnPmA7XG5cbmV4cG9ydCBjb25zdCBQR19JQ09OUyA9IHtcbiAgaGFzOiAobmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiBuYW1lIGluIElDT05TLFxuICBzdmdTdHJpbmc6IChuYW1lOiBzdHJpbmcsIHNpemUgPSAxNik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYm9keSA9IElDT05TW25hbWVdO1xuICAgIGlmICghYm9keSkge1xuICAgICAgY29uc29sZS53YXJuKCdbbHVjaWRlXSBtaXNzaW5nIGljb24nLCBuYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAoYm9keSwgc2l6ZSk7XG4gIH0sXG4gIG1vdW50OiAoZWw6IEVsZW1lbnQgfCBudWxsLCBuYW1lOiBzdHJpbmcsIHNpemU/OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoZWwpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgfSxcbn07XG5cbi8vIFNpZGUtZWZmZWN0IGZvciBsZWdhY3kgc2NyaXB0LXRhZyBpbmNsdXNpb24gKHNpZGVwYW5lbC5odG1sIHN0aWxsIDxzY3JpcHRcbi8vIHNyYz1cImx1Y2lkZS5qc1wiPiDigJQgcHJlLWJ1bmRsZSkuIFJlLWV4cG9zZXMgdGhlIHJlZ2lzdHJ5IG9uIGdsb2JhbFRoaXMuXG5pZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gIChnbG9iYWxUaGlzIGFzIGFueSkuUEdfSUNPTlMgPSBQR19JQ09OUztcbn1cbiIsCiAgICAiLy8gVVNUQVItZm9ybWF0IHRhciBlbmNvZGVyLiBFYWNoIGVudHJ5IGlzIGEgNTEyLWJ5dGUgaGVhZGVyIGZvbGxvd2VkIGJ5XG4vLyBjb250ZW50IGJ5dGVzIHBhZGRlZCB1cCB0byB0aGUgbmV4dCA1MTItYnl0ZSBib3VuZGFyeS4gVGhlIGFyY2hpdmUgZW5kc1xuLy8gd2l0aCB0d28gemVyby1maWxsZWQgNTEyLWJ5dGUgYmxvY2tzLiB+ODAgbGluZXMsIG5vIGRlcGVuZGVuY2llcy5cbi8vXG4vLyBXZSBwaWNrIHRhciAocmF0aGVyIHRoYW4gemlwKSBiZWNhdXNlIHpzdGQgaXMgdGhlIHdpcmUgZm9ybWF0IHdlIHdhbnQgdG9cbi8vIHBhaXIgaXQgd2l0aCBhbmQgdGFyLnpzdCBpcyB0aGUgc3RhbmRhcmQgY29tYm8gKHppcCBpcyBpdHMgb3duXG4vLyBjb21wcmVzc2lvbiBjb250YWluZXIpLiBQYXRocyBsb25nZXIgdGhhbiAxMDAgY2hhcnMgdXNlIHRoZSBzdGFuZGFyZFxuLy8gdXN0YXIgcHJlZml4IGZpZWxkICgxNTUgYnl0ZXMgYXQgb2Zmc2V0IDM0NSk6IHRoZSBwYXRoIGlzIHNwbGl0IGF0IGFcbi8vIHNsYXNoIGludG8gcHJlZml4KOKJpDE1NSkvbmFtZSjiiaQxMDApLiBPbmx5IHVuc3BsaXR0YWJsZSBwYXRocyB0aHJvdyDigJRcbi8vIEdOVS9QQVggbG9uZy1uYW1lIGV4dGVuc2lvbnMgYXJlIGRlbGliZXJhdGVseSBub3QgaW1wbGVtZW50ZWQuXG5cbmNvbnN0IGVuYyA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG5jb25zdCB3cml0ZU9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIC8vIHRhciBmaWVsZHMgYXJlIHplcm8tcGFkZGVkIG51bGwtdGVybWluYXRlZCBvY3RhbCBzdHJpbmdzLlxuICBsZXQgcyA9IHZhbHVlLnRvU3RyaW5nKDgpO1xuICBzID0gcy5wYWRTdGFydChsZW5ndGggLSAxLCAnMCcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDE7IGkrKykgYnVmW29mZnNldCArIGldID0gcy5jaGFyQ29kZUF0KGkpO1xuICBidWZbb2Zmc2V0ICsgbGVuZ3RoIC0gMV0gPSAwO1xufTtcblxuY29uc3Qgd3JpdGVBc2NpaSA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBzdHI6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3QgYnl0ZXMgPSBlbmMuZW5jb2RlKHN0cik7XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKGJ5dGVzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV0hO1xufTtcblxuY29uc3QgaGVhZGVyQ2hlY2tzdW0gPSAoaGVhZGVyOiBVaW50OEFycmF5KTogbnVtYmVyID0+IHtcbiAgLy8gVGhlIGNoZWNrc3VtIGZpZWxkICg4IGJ5dGVzIGF0IG9mZnNldCAxNDgpIGlzIHRyZWF0ZWQgYXMgQVNDSUkgc3BhY2VzXG4gIC8vIGR1cmluZyBjb21wdXRhdGlvbiwgdGhlbiB0aGUgYWN0dWFsIGNoZWNrc3VtIGlzIHdyaXR0ZW4gaW50byBpdC5cbiAgbGV0IHN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICBpZiAoaSA+PSAxNDggJiYgaSA8IDE1Nikgc3VtICs9IDB4MjA7XG4gICAgZWxzZSBzdW0gKz0gaGVhZGVyW2ldID8/IDA7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbmV4cG9ydCB0eXBlIFRhckVudHJ5ID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRhdGE6IFVpbnQ4QXJyYXkgfCBzdHJpbmc7XG4gIG10aW1lPzogbnVtYmVyOyAvLyB1bml4IGVwb2NoIHNlY29uZHM7IGRlZmF1bHRzIHRvIG5vd1xufTtcblxuLy8gdXN0YXIgbmFtZSBzcGxpdDogcGF0aHMg4omkMTAwIGNoYXJzIGdvIHN0cmFpZ2h0IGludG8gdGhlIG5hbWUgZmllbGQ7XG4vLyBsb25nZXIgcGF0aHMgc3BsaXQgYXQgdGhlIHJpZ2h0bW9zdCBzbGFzaCB0aGF0IGxlYXZlcyBwcmVmaXgg4omkMTU1IGFuZFxuLy8gdGFpbCDiiaQxMDAuIFRoZSByZWFkZXIgcmVhc3NlbWJsZXMgYHByZWZpeCArICcvJyArIG5hbWVgLlxuY29uc3Qgc3BsaXRUYXJOYW1lID0gKGZ1bGw6IHN0cmluZyk6IHtuYW1lOiBzdHJpbmc7IHByZWZpeDogc3RyaW5nfSA9PiB7XG4gIGlmIChmdWxsLmxlbmd0aCA8PSAxMDApIHJldHVybiB7bmFtZTogZnVsbCwgcHJlZml4OiAnJ307XG4gIGxldCBjdXQgPSAtMTtcbiAgZm9yIChsZXQgaSA9IGZ1bGwuaW5kZXhPZignLycpOyBpICE9PSAtMTsgaSA9IGZ1bGwuaW5kZXhPZignLycsIGkgKyAxKSkge1xuICAgIGlmIChpIDw9IDE1NSAmJiBmdWxsLmxlbmd0aCAtIGkgLSAxIDw9IDEwMCkgY3V0ID0gaTtcbiAgfVxuICBpZiAoY3V0ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgdGFyOiBwYXRoIG5vdCBzcGxpdHRhYmxlIGludG8gdXN0YXIgcHJlZml4KDE1NSkvbmFtZSgxMDApOiAke2Z1bGx9YCk7XG4gIH1cbiAgcmV0dXJuIHtwcmVmaXg6IGZ1bGwuc2xpY2UoMCwgY3V0KSwgbmFtZTogZnVsbC5zbGljZShjdXQgKyAxKX07XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRUYXIgPSAoZW50cmllczogVGFyRW50cnlbXSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBjb25zdCBub3dTZWMgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlbnRyeS5kYXRhID09PSAnc3RyaW5nJyA/IGVuYy5lbmNvZGUoZW50cnkuZGF0YSkgOiBlbnRyeS5kYXRhO1xuICAgIGNvbnN0IHtuYW1lLCBwcmVmaXh9ID0gc3BsaXRUYXJOYW1lKGVudHJ5Lm5hbWUpO1xuICAgIGNvbnN0IGhlYWRlciA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDAsIG5hbWUsIDEwMCk7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwMCwgMG82NDQsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RlXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwOCwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1aWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTE2LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMjQsIGRhdGEubGVuZ3RoLCAxMik7ICAgICAgICAgICAgICAgICAgLy8gc2l6ZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMzYsIGVudHJ5Lm10aW1lID8/IG5vd1NlYywgMTIpOyAgICAgICAgLy8gbXRpbWVcbiAgICBmb3IgKGxldCBpID0gMTQ4OyBpIDwgMTU2OyBpKyspIGhlYWRlcltpXSA9IDB4MjA7ICAgICAgICAgIC8vIGNoZWNrc3VtIHBsYWNlaG9sZGVyXG4gICAgaGVhZGVyWzE1Nl0gPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0eXBlZmxhZyAnMCcgPSByZWd1bGFyIGZpbGVcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjU3LCAndXN0YXInLCA2KTsgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI2MywgJzAwJywgMik7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2ZXJzaW9uXG4gICAgaWYgKHByZWZpeCkgd3JpdGVBc2NpaShoZWFkZXIsIDM0NSwgcHJlZml4LCAxNTUpOyAgICAgICAgICAvLyB1c3RhciBwcmVmaXhcbiAgICAvLyB1bmFtZS9nbmFtZS9kZXZtYWpvci9kZXZtaW5vciBsZWZ0IHplcm8uXG5cbiAgICBjb25zdCBjaGVja3N1bSA9IGhlYWRlckNoZWNrc3VtKGhlYWRlcik7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDE0OCwgY2hlY2tzdW0sIDgpO1xuXG4gICAgYmxvY2tzLnB1c2goaGVhZGVyKTtcbiAgICBibG9ja3MucHVzaChkYXRhKTtcbiAgICBjb25zdCBwYWQgPSAoNTEyIC0gKGRhdGEubGVuZ3RoICUgNTEyKSkgJSA1MTI7XG4gICAgaWYgKHBhZCkgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkocGFkKSk7XG4gIH1cbiAgLy8gVHJhaWxlcjogdHdvIGNvbnNlY3V0aXZlIDUxMi1ieXRlIHplcm8gYmxvY2tzLlxuICBibG9ja3MucHVzaChuZXcgVWludDhBcnJheSgxMDI0KSk7XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmZzZXQpOyBvZmZzZXQgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBac3RkIHJhdy1ibG9jayBmcmFtZSB3cml0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gQ29tcHJlc3Npb25TdHJlYW0oJ3pzdGQnKSBpc24ndCBzaGlwcGVkIGluIGN1cnJlbnQgQ2hyb21pdW0gKHZlcmlmaWVkIHZpYVxuLy8gcnVudGltZSBwcm9iZSksIHNvIHdlIHdyaXRlIGEgdmFsaWQgenN0ZCBmcmFtZSBjb250YWluaW5nIG9uZSBvciBtb3JlXG4vLyByYXcgKHVuY29tcHJlc3NlZCkgYmxvY2tzLiBUaGUgb3V0cHV0IGlzIHN0cnVjdHVyYWxseSBhIHJlYWwgYC50YXIuenN0YFxuLy8gZmlsZTogYHpzdGQgLWRgIGFjY2VwdHMgaXQsIDctWmlwIGFjY2VwdHMgaXQsIGxpYnpzdGQgYWNjZXB0cyBpdC4gSXRcbi8vIGp1c3QgZG9lc24ndCBhY3R1YWxseSBjb21wcmVzcyDigJQgZm9yIG91ciBwYXlsb2FkLCB3aGljaCBpcyBtb3N0bHkgUE5HXG4vLyAoYWxyZWFkeSBjb21wcmVzc2VkKSBwbHVzIGEgZmV3IEtCIG9mIEpTT05ML01hcmtkb3duLCB0aGUgbG9zcyB2cy4gcmVhbFxuLy8gREVGTEFURSBpcyBzaW5nbGUtZGlnaXQgcGVyY2VudC5cbi8vXG4vLyBGcmFtZSBsYXlvdXQgKHBlciBSRkMgODg3OCArIFpzdGFuZGFyZCBmb3JtYXQgc3BlYyk6XG4vLyAgIG1hZ2ljX251bWJlciAgICAgICA0IGJ5dGVzICAweDI4IDB4QjUgMHgyRiAweEZEIChMRTogMHhGRDJGQjUyOClcbi8vICAgRkhEICAgICAgICAgICAgICAgIDEgYnl0ZSAgIEZDU19zaXplPTIgKDQtYnl0ZSBGQ1MpLCBTaW5nbGVfU2VnbWVudD0xXG4vLyAgIEZDUyAgICAgICAgICAgICAgICA0IGJ5dGVzICB1bmNvbXByZXNzZWQgcGF5bG9hZCBzaXplICh1MzIgTEUpXG4vLyAgIGJsb2NrcyAgICAgICAgICAgICBOIGJsb2NrcyBlYWNoOiAzLWJ5dGUgaGVhZGVyICsgcGF5bG9hZFxuLy9cbi8vIEJsb2NrIGhlYWRlciAoMyBieXRlcyBMRSk6XG4vLyAgIGJpdCAwICAgICAgIExhc3RfQmxvY2sgZmxhZ1xuLy8gICBiaXRzIDEuLjIgICBCbG9ja19UeXBlICgwMCA9IFJhdywgMDEgPSBSTEUsIDEwID0gQ29tcHJlc3NlZCwgMTEgPSBSZXNlcnZlZClcbi8vICAgYml0cyAzLi4yMyAgQmxvY2tfU2l6ZSAobWF4IDEyOCBLaUIgZm9yIHJhdyAvIFJMRSlcbi8vXG4vLyBXZSBjaHVuayBpbnRvIDEyOCBLaUIgcmF3IGJsb2NrcyB0byByZXNwZWN0IHRoZSBwZXItYmxvY2sgc2l6ZSBsaW1pdC5cblxuY29uc3QgWlNURF9SQVdfQkxPQ0tfTUFYID0gMTI4ICogMTAyNDtcblxuZXhwb3J0IGNvbnN0IHdyYXBac3RkID0gKGRhdGE6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgPCBkYXRhLmxlbmd0aCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGRhdGEubGVuZ3RoIC0gcG9zO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IE1hdGgubWluKHJlbWFpbmluZywgWlNURF9SQVdfQkxPQ0tfTUFYKTtcbiAgICBjb25zdCBpc0xhc3QgPSBwb3MgKyBibG9ja1NpemUgPj0gZGF0YS5sZW5ndGggPyAxIDogMDtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBpc0xhc3QgfCAoMCA8PCAxKSB8IChibG9ja1NpemUgPDwgMyk7IC8vIHR5cGU9cmF3PTBcbiAgICBjb25zdCBibG9ja0hlYWRlciA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIGhlYWRlckludCAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiA4KSAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiAxNikgJiAweGZmLFxuICAgIF0pO1xuICAgIGJsb2Nrcy5wdXNoKGJsb2NrSGVhZGVyKTtcbiAgICBpZiAoYmxvY2tTaXplID4gMCkgYmxvY2tzLnB1c2goZGF0YS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSkpO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSBicmVhaztcbiAgfVxuICBjb25zdCBmY3MgPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgZmhkID0gMGIxMDEwXzAwMDA7IC8vIEZDU19zaXplPTEwICg0IGJ5dGVzKSB8IFNpbmdsZV9TZWdtZW50PTFcbiAgY29uc3QgaGVhZCA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAweDI4LCAweGI1LCAweDJmLCAweGZkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgZmhkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGSERcbiAgICBmY3MgJiAweGZmLCAoZmNzID4+PiA4KSAmIDB4ZmYsIChmY3MgPj4+IDE2KSAmIDB4ZmYsIChmY3MgPj4+IDI0KSAmIDB4ZmYsXG4gIF0pO1xuICBsZXQgdG90YWwgPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZiA9IDA7XG4gIG91dC5zZXQoaGVhZCwgb2ZmKTsgb2ZmICs9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2ZmKTsgb2ZmICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb21wYW5pb24gZGVjb2RlciBmb3Igb3VyIG93biB3cml0ZXIg4oCUIHVzZWQgYnkgdGVzdHMuIEFjY2VwdHMgYW55IHpzdGRcbi8vIGZyYW1lIHdyaXR0ZW4gYnkgYHdyYXBac3RkYCAoc2luZ2xlIFJhd19CbG9jayBzdHJlYW0sIDQtYnl0ZSBGQ1MsXG4vLyBzaW5nbGUtc2VnbWVudCwgbm8gY2hlY2tzdW0sIG5vIGRpY3QpLiBUaHJvd3Mgb24gYW55dGhpbmcgZWxzZSBzbyB0ZXN0c1xuLy8gZmFpbCBsb3VkbHkgcmF0aGVyIHRoYW4gc2lsZW50bHkgbWlzLXBhcnNlLlxuZXhwb3J0IGNvbnN0IHVud3JhcFpzdGQgPSAoZnJhbWU6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgaWYgKGZyYW1lLmxlbmd0aCA8IDkpIHRocm93IG5ldyBFcnJvcignenN0ZDogZnJhbWUgdG9vIHNob3J0Jyk7XG4gIGlmIChmcmFtZVswXSAhPT0gMHgyOCB8fCBmcmFtZVsxXSAhPT0gMHhiNSB8fCBmcmFtZVsyXSAhPT0gMHgyZiB8fCBmcmFtZVszXSAhPT0gMHhmZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignenN0ZDogYmFkIG1hZ2ljIG51bWJlcicpO1xuICB9XG4gIGNvbnN0IGZoZCA9IGZyYW1lWzRdITtcbiAgY29uc3QgZmNzU2l6ZUZsYWcgPSAoZmhkID4+PiA2KSAmIDBiMTE7XG4gIGNvbnN0IHNpbmdsZVNlZ21lbnQgPSAoKGZoZCA+Pj4gNSkgJiAxKSA9PT0gMTtcbiAgY29uc3QgY2hlY2tzdW0gPSAoKGZoZCA+Pj4gMikgJiAxKSA9PT0gMTtcbiAgY29uc3QgZGljdElkID0gZmhkICYgMGIxMTtcbiAgaWYgKCFzaW5nbGVTZWdtZW50KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IG9ubHkgU2luZ2xlX1NlZ21lbnQgZnJhbWVzIHN1cHBvcnRlZCcpO1xuICBpZiAoY2hlY2tzdW0pIHRocm93IG5ldyBFcnJvcignenN0ZDogY29udGVudCBjaGVja3N1bSBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmIChkaWN0SWQpIHRocm93IG5ldyBFcnJvcignenN0ZDogZGljdGlvbmFyaWVzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgbGV0IHBvcyA9IDU7XG4gIGxldCBmY3MgPSAwO1xuICBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDApIHsgZmNzID0gZnJhbWVbcG9zXSE7IHBvcyArPSAxOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjAxKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KTsgZmNzICs9IDI1NjsgcG9zICs9IDI7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMTApIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNikgfCAoZnJhbWVbcG9zICsgM10hICogMHgxMDAwMDAwKTsgcG9zICs9IDQ7IH1cbiAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IDgtYnl0ZSBGQ1MgdW5zdXBwb3J0ZWQnKTtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoZmNzKTtcbiAgbGV0IG91dFBvcyA9IDA7XG4gIGZvciAoOzspIHtcbiAgICBpZiAocG9zICsgMyA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgaGVhZGVyJyk7XG4gICAgY29uc3QgaGVhZGVySW50ID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNik7XG4gICAgcG9zICs9IDM7XG4gICAgY29uc3QgaXNMYXN0ID0gKGhlYWRlckludCAmIDEpID09PSAxO1xuICAgIGNvbnN0IGJsb2NrVHlwZSA9IChoZWFkZXJJbnQgPj4+IDEpICYgMGIxMTtcbiAgICBjb25zdCBibG9ja1NpemUgPSAoaGVhZGVySW50ID4+PiAzKSAmIDB4MWZfZmZfZmY7XG4gICAgaWYgKGJsb2NrVHlwZSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBvbmx5IFJhd19CbG9jayAoMCkgc3VwcG9ydGVkLCBnb3QgJHtibG9ja1R5cGV9YCk7XG4gICAgaWYgKHBvcyArIGJsb2NrU2l6ZSA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgcGF5bG9hZCcpO1xuICAgIG91dC5zZXQoZnJhbWUuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpLCBvdXRQb3MpO1xuICAgIG91dFBvcyArPSBibG9ja1NpemU7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoaXNMYXN0KSBicmVhaztcbiAgfVxuICBpZiAob3V0UG9zICE9PSBmY3MpIHRocm93IG5ldyBFcnJvcihgenN0ZDogRkNTIG1pc21hdGNoIChnb3QgJHtvdXRQb3N9LCBleHBlY3RlZCAke2Zjc30pYCk7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgVGFyIGxpc3RpbmcgZGVjb2RlciAodGVzdC1vbmx5KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdhbGtzIGEgdGFyIGJ5dGUgYnVmZmVyLCByZXR1cm5pbmcge25hbWUsIGRhdGF9IGZvciBlYWNoIGVudHJ5LiBTdG9wcyBhdFxuLy8gdGhlIHRyYWlsZXIgKHR3byB6ZXJvIGJsb2NrcykuIE9ubHkgcmVhZHMgdGhlIGZpZWxkcyBQaW5jaEdyYWIgd3JpdGVzLlxuXG5leHBvcnQgdHlwZSBQYXJzZWRUYXJFbnRyeSA9IHtuYW1lOiBzdHJpbmc7IGRhdGE6IFVpbnQ4QXJyYXk7IHNpemU6IG51bWJlcn07XG5cbmNvbnN0IGRlYyA9IG5ldyBUZXh0RGVjb2RlcigpO1xuXG5jb25zdCByZWFkTnVsbFN0ciA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGxldCBlbmQgPSBvZmZzZXQgKyBsZW5ndGg7XG4gIGZvciAobGV0IGkgPSBvZmZzZXQ7IGkgPCBvZmZzZXQgKyBsZW5ndGg7IGkrKykge1xuICAgIGlmIChidWZbaV0gPT09IDApIHsgZW5kID0gaTsgYnJlYWs7IH1cbiAgfVxuICByZXR1cm4gZGVjLmRlY29kZShidWYuc3ViYXJyYXkob2Zmc2V0LCBlbmQpKTtcbn07XG5cbmNvbnN0IHJlYWRPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gIGNvbnN0IHMgPSByZWFkTnVsbFN0cihidWYsIG9mZnNldCwgbGVuZ3RoKS50cmltKCk7XG4gIHJldHVybiBzID8gcGFyc2VJbnQocywgOCkgOiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGFyID0gKGJ1ZjogVWludDhBcnJheSk6IFBhcnNlZFRhckVudHJ5W10gPT4ge1xuICBjb25zdCBlbnRyaWVzOiBQYXJzZWRUYXJFbnRyeVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zICsgNTEyIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyA1MTIpO1xuICAgIGxldCBhbGxaZXJvID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7IGlmIChoZWFkZXJbaV0gIT09IDApIHsgYWxsWmVybyA9IGZhbHNlOyBicmVhazsgfSB9XG4gICAgaWYgKGFsbFplcm8pIGJyZWFrOyAvLyB0cmFpbGVyXG4gICAgY29uc3Qgc2hvcnROYW1lID0gcmVhZE51bGxTdHIoaGVhZGVyLCAwLCAxMDApO1xuICAgIGNvbnN0IHByZWZpeCA9IHJlYWROdWxsU3RyKGhlYWRlciwgMzQ1LCAxNTUpO1xuICAgIGNvbnN0IG5hbWUgPSBwcmVmaXggPyBgJHtwcmVmaXh9LyR7c2hvcnROYW1lfWAgOiBzaG9ydE5hbWU7XG4gICAgY29uc3Qgc2l6ZSA9IHJlYWRPY3RhbChoZWFkZXIsIDEyNCwgMTIpO1xuICAgIHBvcyArPSA1MTI7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWUsIHNpemUsIGRhdGE6IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIHNpemUpfSk7XG4gICAgICBwb3MgKz0gc2l6ZTtcbiAgICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoc2l6ZSAlIDUxMikpICUgNTEyO1xuICAgICAgcG9zICs9IHBhZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVudHJpZXM7XG59O1xuIiwKICAgICIvLyBBdXRvLWdlbmVyYXRlZCBieSBzY3JpcHRzL2J1aWxkLWV4dGVuc2lvbi50cyDigJQgZG8gbm90IGVkaXQuXG4vLyBUZWxscyB0aGUgc2lkZXBhbmVsIHdoaWNoIHRlbXBsYXRlIHJlc291cmNlcyBleGlzdCBpbiB0aGlzIGJ1aWxkLlxuLy8gQWN0dWFsIGNvbnRlbnQgbGl2ZXMgYXMgLm1kIGZpbGVzIHVuZGVyIGV4dGVuc2lvbi90ZW1wbGF0ZXMvLCBsb2FkZWRcbi8vIGxhemlseSB2aWEgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMIOKAlCBzZWUgbG9hZFRlbXBsYXRlKCkgaW4gc2lkZXBhbmVsLnRzLlxuZXhwb3J0IGNvbnN0IFRFTVBMQVRFU19QUkVTRU5UID0ge1wiZGVzaWduVGVtcGxhdGVcIjp0cnVlLFwic2tpbGxUZW1wbGF0ZVwiOnRydWUsXCJsb2NhbERlc2lnblwiOnRydWUsXCJsb2NhbFNraWxsXCI6dHJ1ZX0gYXMgY29uc3Q7XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIEludmVudG9yeSBvZiB2ZW5kb3JlZCBza2lsbCByZXNvdXJjZXMgdW5kZXIgZXh0ZW5zaW9uL3NraWxscy8gKHNvdXJjZSBvZlxuLy8gdHJ1dGg6IHRoaXJkX3BhcnR5LyovVVBTVFJFQU0ubG9jayB2aWEgc2NyaXB0cy9zeW5jLWJ1bmRsZWQtc2tpbGxzLnRzKS5cbi8vIGBleHRgIGlzIHRoZSBleHRlbnNpb24tcmVsYXRpdmUgZmV0Y2ggcGF0aDsgYGFyY2hpdmVgIGlzIHdoZXJlIHRoZSBmaWxlXG4vLyBsYW5kcyBpbnNpZGUgYW4gZXhwb3J0ZWQgLnRhci56c3QgYnVuZGxlLlxuZXhwb3J0IGNvbnN0IEJVTkRMRURfU0tJTExTX1BSRVNFTlQgPSB0cnVlO1xuZXhwb3J0IHR5cGUgQnVuZGxlZFNraWxsRmlsZSA9IHtleHQ6IHN0cmluZzsgYXJjaGl2ZTogc3RyaW5nOyBieXRlczogbnVtYmVyfTtcbmV4cG9ydCBjb25zdCBCVU5ETEVEX1NLSUxMX0ZJTEVTOiBCdW5kbGVkU2tpbGxGaWxlW10gPSBbXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDMwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubmF0aXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubmF0aXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzOTEwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmRyb2lkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5kcm9pZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzIyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5pbWF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuaW1hdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNzA4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NDM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5uYXRpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5uYXRpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDgzMTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JvbGRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JvbGRlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzA5MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYnJhbmQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9icmFuZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA0NzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NsYXJpZnkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jbGFyaWZ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDY0NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29kZXgubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2RleC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzAwMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29sb3JpemUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2xvcml6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTM1NjhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyYWZ0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JhZnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDExOTQ0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcml0aXF1ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyaXRpcXVlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0MTI5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGVsaWdodC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RlbGlnaHQubWRcIixcbiAgICBcImJ5dGVzXCI6IDk4MjdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2Rpc3RpbGwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kaXN0aWxsLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NzQwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kb2N1bWVudC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RvY3VtZW50Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzk2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZXh0cmFjdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2V4dHJhY3QubWRcIixcbiAgICBcImJ5dGVzXCI6IDM0MzFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hhcmRlbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hhcmRlbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODU5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaG9va3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ob29rcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTI1NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW5pdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2luaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE4OTUyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbnRlcmFjdGlvbi1kZXNpZ24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbnRlcmFjdGlvbi1kZXNpZ24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDY1NzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2lvcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2lvcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzAzN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGF5b3V0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGF5b3V0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTc5MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDYwMTU2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vbmJvYXJkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb25ib2FyZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzc0MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3B0aW1pemUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vcHRpbWl6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzU5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3ZlcmRyaXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3ZlcmRyaXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wb2xpc2gubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wb2xpc2gubWRcIixcbiAgICBcImJ5dGVzXCI6IDEyOTU1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wcm9kdWN0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcHJvZHVjdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzc1OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcXVpZXRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3F1aWV0ZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ5MTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3NoYXBlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvc2hhcGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDExNTIzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS90eXBlc2V0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvdHlwZXNldC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTcxMzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvTElDRU5TRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvTElDRU5TRVwiLFxuICAgIFwiYnl0ZXNcIjogMTA3NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvTk9USUNFLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9OT1RJQ0UubWRcIixcbiAgICBcImJ5dGVzXCI6IDUwM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vbWFya2V0cGxhY2UuanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL21hcmtldHBsYWNlLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDExOTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL3BsdWdpbi5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vcGx1Z2luLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDc1NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9GVU5ESU5HLnltbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvRlVORElORy55bWxcIixcbiAgICBcImJ5dGVzXCI6IDQ3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2Rlc2lnbi1zeXN0ZW0tcHJvZmlsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZGVzaWduLXN5c3RlbS1wcm9maWxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyODFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZnJhbWV3b3JrLWNvcnJlY3Rpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2ZyYW1ld29yay1jb3JyZWN0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzODlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbGVhcm5pbmctc3VibWlzc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbGVhcm5pbmctc3VibWlzc2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzY0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL25ldy1oZXVyaXN0aWMtcnVsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbmV3LWhldXJpc3RpYy1ydWxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvUFVMTF9SRVFVRVNUX1RFTVBMQVRFLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9QVUxMX1JFUVVFU1RfVEVNUExBVEUubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ0MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGlnbm9yZVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRpZ25vcmVcIixcbiAgICBcImJ5dGVzXCI6IDY2NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMzE1MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0lUQVRJT04uY2ZmXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0lUQVRJT04uY2ZmXCIsXG4gICAgXCJieXRlc1wiOiAxMjExXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT0RFX09GX0NPTkRVQ1QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT0RFX09GX0NPTkRVQ1QubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUSU5HLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUSU5HLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NTYxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRPUlMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRPUlMubWRcIixcbiAgICBcImJ5dGVzXCI6IDMzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTElDRU5TRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0xJQ0VOU0VcIixcbiAgICBcImJ5dGVzXCI6IDExNTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL05PVElDRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL05PVElDRVwiLFxuICAgIFwiYnl0ZXNcIjogNDU4MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vUkVBRE1FLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vUkVBRE1FLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMTcwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYWxsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYWxsLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMTgyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbmFseXplLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYW5hbHl6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA3NzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2V2YWx1YXRlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvZXZhbHVhdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI4MzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL3NvbHZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvc29sdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDE2MTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2FudGktcGF0dGVybnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9hbnRpLXBhdHRlcm5zLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNjc4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9jb25zdGl0dXRpb25hbC1jb25zdHJhaW50cy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2NvbnN0aXR1dGlvbmFsLWNvbnN0cmFpbnRzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NTkyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9vdXRwdXQtc2NoZW1hLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvb3V0cHV0LXNjaGVtYS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA1MThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BmZC1sYXllci1ydWJyaWMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wZmQtbGF5ZXItcnVicmljLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTI5NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcHN5Y2hvbG9neS9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wc3ljaG9sb2d5L212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjM0MjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3RpZXIyLXByb21wdC10ZW1wbGF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3RpZXIyLXByb21wdC10ZW1wbGF0ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTU4ODhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy9zaG9waWZ5LXRoZW1lcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy9zaG9waWZ5LXRoZW1lcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjcwMzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy90YWlsd2luZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy90YWlsd2luZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjc0OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy93b3JkcHJlc3MtdGhlbWVzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3dvcmRwcmVzcy10aGVtZXMubWRcIixcbiAgICBcImJ5dGVzXCI6IDIyMjQ2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvZm91bmRhdGlvbi1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2ZvdW5kYXRpb24tcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMzM4ODFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMS1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wxLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDM2MTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDItcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMi1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAzOTI1MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wzLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDMtcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMjE2NzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sNC1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2w0LXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDI0ODA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWNyb3NzLWxheWVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1jcm9zcy1sYXllci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjg1NTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZXhjZWxsZW50Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1leGNlbGxlbnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE3MDI4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWdvb2QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWdvb2QubWRcIixcbiAgICBcImJ5dGVzXCI6IDIxMzMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLW1lZGlvY3JlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1tZWRpb2NyZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjQzNzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtcG9vci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtcG9vci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjYxMzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdGVycmlibGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXRlcnJpYmxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMDE5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS11bmNvbnZlbnRpb25hbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdW5jb252ZW50aW9uYWwubWRcIixcbiAgICBcImJ5dGVzXCI6IDIzNjMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvQURIRC1DVVJCLUNVVC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9BREhELUNVUkItQ1VULm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MzA1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvUEVSQ0VQVElPTi1GSVJTVC1ERVNJR04ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvUEVSQ0VQVElPTi1GSVJTVC1ERVNJR04ubWRcIixcbiAgICBcImJ5dGVzXCI6IDk4NzcwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9sbG1zLnR4dFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2xsbXMudHh0XCIsXG4gICAgXCJieXRlc1wiOiA2NTQ0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9zY3JpcHRzL2dlbi1wZmQtaW5kZXgucHlcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9zY3JpcHRzL2dlbi1wZmQtaW5kZXgucHlcIixcbiAgICBcImJ5dGVzXCI6IDQ1NDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTI1OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2FjY3VtdWxhdGVkLWxlYXJuaW5ncy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9hY2N1bXVsYXRlZC1sZWFybmluZ3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDcyMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2NpdGF0aW9uLXN0YW5kYXJkcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9jaXRhdGlvbi1zdGFuZGFyZHMubWRcIixcbiAgICBcImJ5dGVzXCI6IDEzNDMxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvaW5zaWdodHMtbG9nLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2luc2lnaHRzLWxvZy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzQyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wwL2wwMTgtYmFja2VuZC1tZWNoYW5pY3MtYXMtZnJvbnRlbmQtY29tcGxleGl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDAvbDAxOC1iYWNrZW5kLW1lY2hhbmljcy1hcy1mcm9udGVuZC1jb21wbGV4aXR5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNjE1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wxL2wwMTEtdmlzdWFsLWNoYW5uZWwtYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wxL2wwMTEtdmlzdWFsLWNoYW5uZWwtYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDMxNDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxMy1rZXlib2FyZC1kZW5zaXR5LWlzLWwyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDEzLWtleWJvYXJkLWRlbnNpdHktaXMtbDIubWRcIixcbiAgICBcImJ5dGVzXCI6IDE0NTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxNi1uZWFyLW1pc3MtY29sb3ItYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDE2LW5lYXItbWlzcy1jb2xvci1hc3ltbWV0cnkubWRcIixcbiAgICBcImJ5dGVzXCI6IDYxMzZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAyNC1hYS1jb25zdHJhaW5lZC10b2tlbi1sYWRkZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMjQtYWEtY29uc3RyYWluZWQtdG9rZW4tbGFkZGVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MDMwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wzL2wwMjMtZmFsc2lmaWFiaWxpdHktdHJpYWQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wzL2wwMjMtZmFsc2lmaWFiaWxpdHktdHJpYWQubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ2OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwMy1wcmUtc2VuZC12cy1wb3N0LXJlc3BvbnNlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDAzLXByZS1zZW5kLXZzLXBvc3QtcmVzcG9uc2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDgwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA2LWluZnJhc3RydWN0dXJlLXZzLWFjdGl2YXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDYtaW5mcmFzdHJ1Y3R1cmUtdnMtYWN0aXZhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTM3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDgtZXBpc3RlbWljLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwOC1lcGlzdGVtaWMtYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA4OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAyMi1sNC1zeW1tZXRyeS10aHJlc2hvbGQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMjItbDQtc3ltbWV0cnktdGhyZXNob2xkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NTIwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19pbmRleC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX2luZGV4Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNzM0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19zZWFyY2guanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX3NlYXJjaC5qc29uXCIsXG4gICAgXCJieXRlc1wiOiAxNDEwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDA5LXRlbXBvcmFsLXNlc3Npb24tY29udGludWl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAwOS10ZW1wb3JhbC1zZXNzaW9uLWNvbnRpbnVpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDk2OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDEyLXJvdXRlLXZzLXN1cnZleS1rbm93bGVkZ2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTItcm91dGUtdnMtc3VydmV5LWtub3dsZWRnZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTUtZXhwZXJpZW50aWFsLXNlbGYtY29udHJhZGljdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxNS1leHBlcmllbnRpYWwtc2VsZi1jb250cmFkaWN0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNjU4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTktbXVsdGktYXJ0aWZhY3QtZW5nYWdlbWVudC1maWVsZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxOS1tdWx0aS1hcnRpZmFjdC1lbmdhZ2VtZW50LWZpZWxkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NDkzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjEtbDQtZXRoaWNzLWZ1c2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyMS1sNC1ldGhpY3MtZnVzaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0MTE5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjUtY2FzY2FkZS1jcmVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjUtY2FzY2FkZS1jcmVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDU0MTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNi1hZXN0aGV0aWMtc3RhYmlsaXR5LWFzLXRydXN0LXByb2R1Y2VyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI2LWFlc3RoZXRpYy1zdGFiaWxpdHktYXMtdHJ1c3QtcHJvZHVjZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDU4MDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyOC1oZWxkLWRlY2lzaW9uLWNvbXBvdW5kaW5nLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI4LWhlbGQtZGVjaXNpb24tY29tcG91bmRpbmcubWRcIixcbiAgICBcImJ5dGVzXCI6IDUyNzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAxLWdlbmVyYXRpdmUtdnMtZXZhbHVhdGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAxLWdlbmVyYXRpdmUtdnMtZXZhbHVhdGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjczXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMi1hY2Nlc3MtdnMtc2lnbmFsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDItYWNjZXNzLXZzLXNpZ25hbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzU5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNC13b3Jrc3BhY2UtdnMtcHJvZHVjdC1zZXBhcmF0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDQtd29ya3NwYWNlLXZzLXByb2R1Y3Qtc2VwYXJhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNS1yZWN1cnNpdmUtdmFsaWRhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA1LXJlY3Vyc2l2ZS12YWxpZGF0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA3LWNvbnZlcmdlbnQtZ2FwLWlkZW50aWZpY2F0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDctY29udmVyZ2VudC1nYXAtaWRlbnRpZmljYXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDkxOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTAtY29uc3RyYWludHMtYXJlLWRpc3RyaWJ1dGlvbnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxMC1jb25zdHJhaW50cy1hcmUtZGlzdHJpYnV0aW9ucy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjkwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTQtb3BlcmF0aW9uYWwtdnMtc3RydWN0dXJhbC1ldGhpY3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNC1vcGVyYXRpb25hbC12cy1zdHJ1Y3R1cmFsLWV0aGljcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTUyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTctaXRlcmF0aXZlLXJlZ3Jlc3Npb24taXMtdmlzaWJpbGl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE3LWl0ZXJhdGl2ZS1yZWdyZXNzaW9uLWlzLXZpc2liaWxpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ3MzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDIwLWludGVybmF0aW9uYWwtY2l0YXRpb24tZXhwYW5zaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjAtaW50ZXJuYXRpb25hbC1jaXRhdGlvbi1leHBhbnNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDU2NjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI3LWludGVybmFsLWFja25vd2xlZGdtZW50LXNpZ25hbHMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyNy1pbnRlcm5hbC1hY2tub3dsZWRnbWVudC1zaWduYWxzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NzEyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyOS1wb3J0LWRvbnQtaW5zdGFsbC1tb3Rpb24tYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyOS1wb3J0LWRvbnQtaW5zdGFsbC1tb3Rpb24tYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDYwMjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTc4NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3BmZC1zcGF0aWFsLWV4dGVuc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wZmQtc3BhdGlhbC1leHRlbnNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5NTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wcmFjdGl0aW9uZXItY29ycmVjdGlvbnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcHJhY3RpdGlvbmVyLWNvcnJlY3Rpb25zLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3NraWxscy1pbmRleC5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwic2tpbGxzLWluZGV4Lmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDEwMTEzXG4gIH1cbl07XG4iLAogICAgIi8vIFNlbmQtdG8tQWdlbnQgcHJvbXB0ICsgcHJvdG9jb2wgYnVpbGRlcnMuXG4vL1xuLy8gVHdvIGFydGlmYWN0cywgb25lIGRvY3RyaW5lOlxuLy8gICDigKIgYnVpbGRBZ2VudFByb21wdEpzb25sIOKAlCB0aGUgSlNPTkwgY2xpcGJvYXJkIHBheWxvYWQgY29waWVkIHdoZW4gdGhlXG4vLyAgICAgdXNlciBjbGlja3MgXCJTZW5kIHRvIEFnZW50XCIuIE5pbmUgZGVuc2UgbGluZXM6IGhlYWRlciwgaW5zdHJ1Y3Rpb24sXG4vLyAgICAgaWRlbXBvdGVudCBiYXNoIGJvb3RzdHJhcCwgbWFuZGF0b3J5IGZ1bGwtcmVhZCBmaWxlIGxpc3QsIGJ1bmRsZVxuLy8gICAgIHRyZWUsIG9yY2hlc3RyYXRpb24gcGhhc2VzLCBjb25kaXRpb25hbCBzdG9jay1ERVNJR04gd2FybmluZyxcbi8vICAgICByZWNhcHR1cmUgdmVyaWZpY2F0aW9uLCBkb25lLWNyaXRlcmlhLlxuLy8gICDigKIgYnVpbGRBZ2VudFByb3RvY29sTWQg4oCUIEFHRU5ULVBST1RPQ09MLm1kIGluc2lkZSBldmVyeSBidW5kbGU6IHRoZVxuLy8gICAgIGZ1bGwgZXhwYW5zaW9uIG9mIHRoZSBzYW1lIGRvY3RyaW5lLCBzbyBhIGxvc3QgY2xpcGJvYXJkIGRlZ3JhZGVzIHRvXG4vLyAgICAgXCJleHRyYWN0IHRoZSBhcmNoaXZlIGFuZCByZWFkIEFHRU5ULVBST1RPQ09MLm1kXCIuXG4vL1xuLy8gSHlkcmF0aW9uIGNvbnZlbnRpb25zIChtaXJyb3JlZCBpbiB0aGUgZG9jcyk6XG4vLyAgIOKAoiB2YWx1ZXMgYmFrZWQgaW4gYXQgZXhwb3J0IHRpbWUgY29tZSBmcm9tIHRoZSBvcHRpb25zIG9iamVjdFxuLy8gICAgICh3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlIHBhdGgsIGV4cG9ydCB0aW1lc3RhbXAsIHRhciBlbnRyaWVzKTtcbi8vICAg4oCiIDxBTkdMRV9UT0tFTlM+IGFyZSBsZWZ0IHZlcmJhdGltIGZvciB0aGUgUkVDRUlWSU5HIGFnZW50IHRvIGluZmVyXG4vLyAgICAgKDxQUk9KRUNUX1JPT1Q+LCA8QVBQX1VSTD4sIDxGRUVEQkFDS19VSUQ+LCA8cnVuSWQ+LCA8QVJDSElWRV9QQVRIPikuXG4vL1xuLy8gRGV0ZXJtaW5pc20gY29udHJhY3Q6IGlkZW50aWNhbCBpbnB1dHMg4oaSIGlkZW50aWNhbCBvdXRwdXQgc3RyaW5ncy4gTm9cbi8vIERhdGUubm93KCkvTWF0aC5yYW5kb20oKSBpbiBoZXJlIOKAlCB0aGUgZXhwb3J0IGNsb2NrIGFycml2ZXMgdmlhIG9wdHMuXG4vLyBub2RlLXRlc3RhYmxlIChubyBicm93c2VyIEFQSXMpOyBjb25zdW1lZCBieSBzaWRlcGFuZWwudHMgYXQgZXhwb3J0IHRpbWUuXG5cbi8qKiBQZXJzaXN0ZW5jZSByb290IGZvciBhIHdvcmtzcGFjZSwgYXMgdGhlIHJlY2VpdmluZyBhZ2VudCBzZWVzIGl0LiAqL1xuZXhwb3J0IGNvbnN0IHdvcmtzcGFjZVJvb3QgPSAod29ya3NwYWNlKSA9PiBgfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvJHt3b3Jrc3BhY2V9YDtcblxuLyoqIEV4dHJhY3Rpb24gZGlyIGZvciBhIGJ1bmRsZSBpbnNpZGUgdGhlIHBlcnNpc3RlbmNlIHJvb3QuICovXG5leHBvcnQgY29uc3QgZXh0cmFjdERpciA9ICh3b3Jrc3BhY2UsIGJ1bmRsZUlkKSA9PlxuICBgJHt3b3Jrc3BhY2VSb290KHdvcmtzcGFjZSl9L2J1bmRsZXMvJHtidW5kbGVJZH0vZXh0cmFjdGVkYDtcblxuLyoqXG4gKiBJZGVtcG90ZW50IGJhc2ggYm9vdHN0cmFwLiBgYXJjaGl2ZVBhdGhgIGlzIHRoZSBoeWRyYXRlZCBhYnNvbHV0ZSBwYXRoIG9mXG4gKiB0aGUgLnRhci56c3Qgb24gdGhlIG9wZXJhdG9yJ3MgbWFjaGluZTsgcGFzcyB0aGUgbGl0ZXJhbCB0b2tlblxuICogJzxBUkNISVZFX1BBVEg+JyB0byBlbWl0IHRoZSB0b2tlbml6ZWQgY29weSBzaGlwcGVkIGluIEFHRU5ULVBST1RPQ09MLm1kLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRCb290c3RyYXBTY3JpcHQgPSAoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmVQYXRoLCBleHBvcnRUc30pID0+IFtcbiAgJyMhL3Vzci9iaW4vZW52IGJhc2gnLFxuICAnIyBQaW5jaEdyYWIgYm9vdHN0cmFwIOKAlCBpZGVtcG90ZW50OyBzYWZlIHRvIHJlLXJ1bi4nLFxuICAnc2V0IC1ldW8gcGlwZWZhaWwnLFxuICBgV1M9JyR7d29ya3NwYWNlfSdgLFxuICBgQklEPScke2J1bmRsZUlkfSdgLFxuICBgU1JDPScke2FyY2hpdmVQYXRofSdgLFxuICAnIyBUaGUgY2xpcGJvYXJkIG1heSBjYXJyeSB0aGUgfi9Eb3dubG9hZHMgZm9ybTsgZXhwYW5kIGEgbGVhZGluZyB+LicsXG4gICdTUkM9XCIke1NSQy8jXFxcXH4vJEhPTUV9XCInLFxuICAnUk9PVD1cIiRIT01FLy5waW5jaGdyYWIvd29ya3NwYWNlcy8kV1NcIicsXG4gICdERVNUPVwiJFJPT1QvYnVuZGxlcy8kQklEXCInLFxuICAnaWYgWyAtZiBcIiRERVNULy5leHRyYWN0ZWRcIiBdICYmIFsgXCIkKGNhdCBcIiRERVNULy5leHRyYWN0ZWRcIilcIiA9IFwiJEJJRFwiIF07IHRoZW4nLFxuICAnICBlY2hvIFwiYWxyZWFkeS1leHRyYWN0ZWQgJERFU1QvZXh0cmFjdGVkXCInLFxuICAnZWxzZScsXG4gICcgIG1rZGlyIC1wIFwiJERFU1QvZXh0cmFjdGVkXCIgXCIkUk9PVC9wbGFucy8kQklEXCIgXCIkUk9PVC9hdWRpdHMvJEJJRFwiIFwiJFJPT1QvcmVjYXB0dXJlc1wiJyxcbiAgJyAgaWYgdGFyIC0tenN0ZCAteGYgXCIkU1JDXCIgLUMgXCIkREVTVC9leHRyYWN0ZWRcIiAyPi9kZXYvbnVsbDsgdGhlbiA6OyBlbHNlJyxcbiAgJyAgICB6c3RkIC1kYyBcIiRTUkNcIiB8IHRhciAteCAtQyBcIiRERVNUL2V4dHJhY3RlZFwiJyxcbiAgJyAgZmknLFxuICAnICBjcCAtZiBcIiRTUkNcIiBcIiRERVNUL2J1bmRsZS50YXIuenN0XCInLFxuICAnICBwcmludGYgXFwnJXNcXCcgXCIkQklEXCIgPiBcIiRERVNULy5leHRyYWN0ZWRcIicsXG4gICcgIGVjaG8gXCJleHRyYWN0ZWQgJERFU1QvZXh0cmFjdGVkXCInLFxuICAnZmknLFxuICBgWyAtZiBcIiRST09UL3dvcmstbWFuaWZlc3QuanNvbmxcIiBdIHx8IHByaW50ZiAnJXNcXFxcbicgJ3tcInZcIjoxLFwidHlwZVwiOlwid29yay1tYW5pZmVzdC1oZWFkZXJcIixcInRvb2xcIjpcInBpbmNoZ3JhYlwiLFwid29ya3NwYWNlXCI6XCIke3dvcmtzcGFjZX1cIixcImNyZWF0ZWRcIjpcIiR7ZXhwb3J0VHN9XCJ9JyA+IFwiJFJPT1Qvd29yay1tYW5pZmVzdC5qc29ubFwiYCxcbiAgJ2VjaG8gXCJ3b3JrZGlyICRST09UXCInLFxuXS5qb2luKCdcXG4nKTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGJ1bmRsZSdzIHRhciBlbnRyeSBuYW1lcyBhcyBhbiBpbmRlbnRlZCB0cmVlLiBEaXJlY3RvcmllcyB3aXRoXG4gKiBtb3JlIHRoYW4gYGNvbGxhcHNlQXRgIGZpbGVzIGNvbGxhcHNlIHRvIG9uZSBgZGlyLyAoTiBmaWxlcylgIGxpbmUgc28gdGhlXG4gKiBjbGlwYm9hcmQgc3RheXMgZGVuc2U7IG91dHB1dCBpcyBjYXBwZWQgYXQgYG1heExpbmVzYCB3aXRoIGEgYOKApiArTiBtb3JlYFxuICogdGFpbC4gRGV0ZXJtaW5pc3RpYzogZW50cmllcyBhcmUgc29ydGVkLlxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyQnVuZGxlVHJlZSA9IChlbnRyeU5hbWVzLCB7Y29sbGFwc2VBdCA9IDgsIG1heExpbmVzID0gMTIwfSA9IHt9KSA9PiB7XG4gIC8vIEJ1aWxkIGEgbmVzdGVkIHtkaXJzOiBNYXAsIGZpbGVzOiBbXX0gc3RydWN0dXJlLlxuICBjb25zdCByb290Tm9kZSA9IHtkaXJzOiBuZXcgTWFwKCksIGZpbGVzOiBbXX07XG4gIGZvciAoY29uc3QgbmFtZSBvZiBbLi4uZW50cnlOYW1lc10uc29ydCgpKSB7XG4gICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KCcvJyk7XG4gICAgbGV0IG5vZGUgPSByb290Tm9kZTtcbiAgICBmb3IgKGNvbnN0IGRpciBvZiBwYXJ0cy5zbGljZSgwLCAtMSkpIHtcbiAgICAgIGlmICghbm9kZS5kaXJzLmhhcyhkaXIpKSBub2RlLmRpcnMuc2V0KGRpciwge2RpcnM6IG5ldyBNYXAoKSwgZmlsZXM6IFtdfSk7XG4gICAgICBub2RlID0gbm9kZS5kaXJzLmdldChkaXIpO1xuICAgIH1cbiAgICBub2RlLmZpbGVzLnB1c2gocGFydHNbcGFydHMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGNvbnN0IGNvdW50RmlsZXMgPSAobm9kZSkgPT4gbm9kZS5maWxlcy5sZW5ndGggKyBbLi4ubm9kZS5kaXJzLnZhbHVlcygpXS5yZWR1Y2UoKGEsIGQpID0+IGEgKyBjb3VudEZpbGVzKGQpLCAwKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgY29uc3QgZW1pdCA9IChub2RlLCBkZXB0aCkgPT4ge1xuICAgIGNvbnN0IHBhZCA9ICcgICcucmVwZWF0KGRlcHRoKTtcbiAgICBmb3IgKGNvbnN0IFtkaXIsIGNoaWxkXSBvZiBbLi4ubm9kZS5kaXJzLmVudHJpZXMoKV0uc29ydCgoW2FdLCBbYl0pID0+IChhIDwgYiA/IC0xIDogMSkpKSB7XG4gICAgICBjb25zdCB0b3RhbCA9IGNvdW50RmlsZXMoY2hpbGQpO1xuICAgICAgaWYgKHRvdGFsID4gY29sbGFwc2VBdCkge1xuICAgICAgICBsaW5lcy5wdXNoKGAke3BhZH0ke2Rpcn0vICgke3RvdGFsfSBmaWxlcylgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmVzLnB1c2goYCR7cGFkfSR7ZGlyfS9gKTtcbiAgICAgICAgZW1pdChjaGlsZCwgZGVwdGggKyAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIG5vZGUuZmlsZXMpIGxpbmVzLnB1c2goYCR7cGFkfSR7Zn1gKTtcbiAgfTtcbiAgZW1pdChyb290Tm9kZSwgMCk7XG4gIGlmIChsaW5lcy5sZW5ndGggPiBtYXhMaW5lcykge1xuICAgIGNvbnN0IGRyb3BwZWQgPSBsaW5lcy5sZW5ndGggLSBtYXhMaW5lcztcbiAgICByZXR1cm4gWy4uLmxpbmVzLnNsaWNlKDAsIG1heExpbmVzKSwgYOKApiArJHtkcm9wcGVkfSBtb3JlYF0uam9pbignXFxuJyk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xufTtcblxuLy8gQnVuZGxlIGZpbGVzIHdob3NlIHByZXNlbmNlIGdhdGVzIGEgbWFuZGF0b3J5LXJlYWQgcGF0aCAvIHByb21wdCBsaW5lLlxuY29uc3QgUElOQ0hHUkFCX1NLSUxMX1BBVEggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbmNvbnN0IFBGRF9TS0lMTF9QQVRIID0gJ3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWQnO1xuY29uc3QgU0tJTExTX0lOREVYX1BBVEggPSAnc2tpbGxzLWluZGV4Lmpzb24nO1xuXG5jb25zdCBvcmNoZXN0cmF0aW9uVGV4dCA9ICh7d29ya3NwYWNlLCBidW5kbGVJZCwganNvbmxOYW1lfSkgPT5cbiAgYFBIQVNFIG1hcDogZm9yIEVWRVJZIGNvbW1lbnQgcm93IGluICR7anNvbmxOYW1lfSwgZGVjaWRlIHdoaWNoIGJ1bmRsZWQgc2tpbGxzIGFwcGx5IGFuZCBhcHBlbmQgb25lIGNvbW1lbnQgcm93IHRvIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyR7d29ya3NwYWNlfS93b3JrLW1hbmlmZXN0Lmpzb25sIGNhcnJ5aW5nIGEgbWFwcGVkX3NraWxscyBmaWVsZCB3aG9zZSBlbnRyaWVzIGFyZSBsb2NhdG9ycyDigJQgcGF0aHMgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3Rpb24gcm9vdCAoZS5nLiAuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS88ZmlsZT4ubWQsICR7UEZEX1NLSUxMX1BBVEh9LCAke1BJTkNIR1JBQl9TS0lMTF9QQVRIfTsgdGhlIGZ1bGwgaW5kZXggaXMgJHtTS0lMTFNfSU5ERVhfUEFUSH0pLiBUaGUgZXhwb3J0IHByZS1zZWVkcyBoZXVyaXN0aWMgc3VnZ2VzdGVkU2tpbGxzIG9uIGVhY2ggZmVlZGJhY2sgcm93OyB2ZXJpZnkgYW5kIGNvcnJlY3QgdGhlbSwgZG8gbm90IHRydXN0IHRoZW0gYmxpbmRseS4gYCArXG4gIGBQSEFTRSBwbGFuOiBmYW4gb3V0IG9uZSBiYWNrZ3JvdW5kIGF0b21pYyBzdWJhZ2VudCBwZXIgY29tbWVudDsgcGFzcyBlYWNoIHN1YmFnZW50IGEgc3RhbmRhbG9uZSBKU09OTCBzdWJpbnN0cnVjdGlvbiAodGVtcGxhdGUgaW4gQUdFTlQtUFJPVE9DT0wubWQpIGNvbnRhaW5pbmcgdGhlIGZ1bGwgY29tbWVudCByb3csIGl0cyBwYXJlbnQgc2VsZWN0b3Igcm93LCB0aGUgYnVuZGxlIG1hbmlmZXN0IGxpbmUsIGFuZCB0aGUgRlVMTCBURVhUIG9mIGV2ZXJ5IG1hcHBlZCBza2lsbCBwcm9tcHQ7IGVhY2ggc3ViYWdlbnQgdXNlcyB5b3VyIC9wbGFuIChwbGFubmluZykgY2FwYWJpbGl0eSBmb3IgaXRzIHBoYXNlIGFuZCByZXR1cm5zIGEgcGxhbiwgc2F2ZWQgdG8gcGxhbnMvJHtidW5kbGVJZH0vPEZFRURCQUNLX1VJRD4ucGxhbi5tZDsgZWFjaCBzdWJhZ2VudCBhbHNvIHBvbGlzaGVzIGl0cyBwbGFuIHdpdGggL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbC4gYCArXG4gIGBQSEFTRSBpbXBsZW1lbnQ6IFlPVSDigJQgdGhlIGZvcmVncm91bmQgYWdlbnQgdGhlIG9wZXJhdG9yIHBhc3RlZCB0aGlzIHByb21wdCBpbnRvIOKAlCBkbyBhbGwgaW1wbGVtZW50YXRpb24sIHRlc3QgZGV2ZWxvcG1lbnQsIHRlc3RpbmcsIGFuZCBpdGVyYXRpb24gaW4gPFBST0pFQ1RfUk9PVD47IHN1YmFnZW50cyBvbmx5IHBsYW4uIFBvbGlzaCB0aGUgaW1wbGVtZW50ZWQgcmVzdWx0IHdpdGggL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbC4gYCArXG4gIGBQSEFTRSBhdWRpdDogc2VuZCB0aGUgY29tYmluZWQgcGxhbnMgKyBpbXBsZW1lbnRhdGlvbiBmb3IgYSBibGluZCBhdG9taWMgJ3JvYXN0JyBwZWVyIHJldmlldyBvZiBCT1RIIHBsYW4gYW5kIGltcGxlbWVudGF0aW9uLCB1c2luZyB3aGF0ZXZlciBvdGhlci1hZ2VudCBwZWVyLXJldmlldyBza2lsbHMgZXhpc3QgaW4gWU9VUiBPV04gZW52aXJvbm1lbnQ7IHdyaXRlIGl0IHRvIGF1ZGl0cy8ke2J1bmRsZUlkfS88cnVuSWQ+LXJvYXN0Lm1kIGFuZCBhZGRyZXNzIGV2ZXJ5IGJsb2NrZXIuIGAgK1xuICBgUEhBU0UgdmVyaWZ5OiBzZWUgdGhlICd2ZXJpZnknIGxpbmUuIGAgK1xuICBgREVHUkFEQVRJT04gUlVMRTogaWYgeW91IGNhbm5vdCBzcGF3biBzdWJhZ2VudHMsIG9yIGxhY2sgYSAvcGxhbiwgL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLCBvciByb2FzdCBjYXBhYmlsaXR5LCBwZXJmb3JtIHRoZSBzYW1lIHBoYXNlcyB5b3Vyc2VsZiBTRVJJQUxMWSBpbiB0aGlzIGV4YWN0IG9yZGVyIOKAlCBuZXZlciBza2lwIGEgcGhhc2UuIGAgK1xuICBgU0tJTExTIFJVTEU6IHRoZSBidW5kbGVkIHNraWxscyBhcmUgZm9yIHRoaXMgam9iIG9ubHkg4oCUIHJlYWQgdGhlbSBmcm9tIHRoZSBleHRyYWN0aW9uIGRpcmVjdG9yeTsgdGhlcmUgaXMgTk8gbmVlZCB0byBpbnN0YWxsIHRoZW0gcGVybWFuZW50bHksIGFuZCB5b3UgbXVzdCBOT1Qgb3ZlcndyaXRlIHlvdXIgb3duIHBlcnNpc3RlbnQgc2tpbGxzLCBhZ2VudCBjb25maWcsIG9yIGRvdGZpbGVzLmA7XG5cbmNvbnN0IHZlcmlmeVRleHQgPSAoe3dvcmtzcGFjZSwgeERpciwganNvbmxOYW1lfSkgPT5cbiAgYEZpbmFsIHZlcmlmaWNhdGlvbiBwYXNzLCBvbmx5IGFmdGVyIGltcGxlbWVudGF0aW9uIGFuZCBhdWRpdDogc3RhcnQgdGhlIHByb2R1Y3QgbG9jYWxseSwgdGhlbiBydW46IG5weCAteSBwaW5jaGdyYWIgcmVjYXB0dXJlICR7eERpcn0vJHtqc29ubE5hbWV9IDxBUFBfVVJMPiAtLXdvcmtzcGFjZS1kaXIgfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvJHt3b3Jrc3BhY2V9ICh1c2UgYnVueCBpZiBucHggaXMgdW5hdmFpbGFibGUpLiBUaGlzIHJlLWxvY2F0ZXMgZXZlcnkgY29tbWVudGVkIHNlbGVjdG9yIHdpdGggUGluY2hHcmFiJ3Mgb3duIENTUy0+WFBhdGgtPmExMXkgY2hhaW4sIHNjcmVlbnNob3RzIGVhY2ggZWxlbWVudCwgYW5kIHdyaXRlcyBhbiBhcHBlbmQtb25seSBydW4gdW5kZXIgcmVjYXB0dXJlcy88cnVuSWQ+Ly4gUmVhZCBlYWNoIHJlY2FwdHVyZWQgUE5HIG5leHQgdG8gaXRzIG9yaWdpbmFsIGluICR7eERpcn0vc2NyZWVuc2hvdHMvIGFuZCBjb25maXJtIGV2ZXJ5IGNvbW1lbnQgaXMgdmlzaWJseSByZXNvbHZlZDsgdGhlbiB1cGRhdGUgdGhlIG1hdGNoaW5nIHdvcmstbWFuaWZlc3QuanNvbmwgcm93cyB0byBzdGF0dXMgZG9uZSwgb3IgYmxvY2tlZCB3aXRoIGEgcmVhc29uLmA7XG5cbmNvbnN0IGRvbmVUZXh0ID0gKHtidW5kbGVJZH0pID0+XG4gIGBZb3UgYXJlIGZpbmlzaGVkIHdoZW4gZXZlcnkgY29tbWVudCBoYXMgYSB3b3JrLW1hbmlmZXN0Lmpzb25sIHJvdyB3aXRoIHN0YXR1cyBkb25lIG9yIGJsb2NrZWQsIHBsYW5zLyR7YnVuZGxlSWR9LyBob2xkcyBvbmUgcGxhbiBwZXIgY29tbWVudCwgYXVkaXRzLyR7YnVuZGxlSWR9LyBob2xkcyBhdCBsZWFzdCBvbmUgcm9hc3QsIGFuZCB0aGUgbGF0ZXN0IHJlY2FwdHVyZSBydW4gbG9jYXRlcyBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3IuIHdvcmstbWFuaWZlc3QuanNvbmwgaXMgYXBwZW5kLW9ubHk6IGFkZCByb3dzLCBuZXZlciByZXdyaXRlIGhpc3RvcnkuYDtcblxuY29uc3Qgd2FybmluZ1RleHQgPVxuICAnVGhlIGJ1bmRsZWQgREVTSUdOLm1kIGlzIFBpbmNoR3JhYlxcJ3MgYmFyZSBzdG9jayB0ZW1wbGF0ZSDigJQgdGhlIG9wZXJhdG9yIGRpZCBub3QgY3VzdG9taXplIGl0LiBEbyBOT1QgdHJlYXQgaXQgYXMgcHJvZHVjdCBjYW5vbi4gUHJlZmVyIGEgbW9yZSBhcHBsaWNhYmxlIGNhbm9uaWNhbCBkZXNpZ24gc291cmNlIGlmIG9uZSBleGlzdHMgZm9yIHRoaXMgcHJvZHVjdCAoc2VhcmNoIDxQUk9KRUNUX1JPT1Q+IGZvciBERVNJR04ubWQsIGRvY3MvZGVzaWduKiwgYnJhbmQvIG9yIHN0eWxlLWd1aWRlIGZpbGVzKSBhbmQgdXNlIHRoZSBidW5kbGVkIHRlbXBsYXRlIG9ubHkgYXMgYSBnZW5lcmljIGNoZWNrbGlzdC4nO1xuXG4vKipcbiAqIFRoZSBuaW5lLWxpbmUgU2VuZC10by1BZ2VudCBjbGlwYm9hcmQgcGF5bG9hZC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0c1xuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMud29ya3NwYWNlXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5idW5kbGVJZCAgICAgICAxNi1oZXggY29udGVudCBoYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5hcmNoaXZlUGF0aCAgICBhYnNvbHV0ZSBwYXRoIG9mIHRoZSBzYXZlZCAudGFyLnpzdFxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuZXhwb3J0VHMgICAgICAgSVNPIHRpbWVzdGFtcCAodGhlIGV4cG9ydCBjbG9jaylcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmpzb25sTmFtZSAgICAgIHRoZSBidW5kbGUncyBKU09OTCBlbnRyeSBuYW1lXG4gKiBAcGFyYW0ge3tjb21tZW50czogbnVtYmVyLCBzZWxlY3RvcnM6IG51bWJlciwgcGFnZXM6IG51bWJlciwgc2NyZWVuc2hvdHM6IG51bWJlcn19IG9wdHMuY291bnRzXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBvcHRzLmVudHJ5TmFtZXMgICBldmVyeSB0YXIgZW50cnkgbmFtZSBpbiB0aGUgYnVuZGxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG9wdHMuZGVzaWduSXNUZW1wbGF0ZVxuICogQHJldHVybnMge3N0cmluZ30gbmV3bGluZS1qb2luZWQgSlNPTkwgKG5vIHRyYWlsaW5nIG5ld2xpbmUpXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEFnZW50UHJvbXB0SnNvbmwgPSAob3B0cykgPT4ge1xuICBjb25zdCB7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGgsIGV4cG9ydFRzLCBqc29ubE5hbWUsIGNvdW50cywgZW50cnlOYW1lcywgZGVzaWduSXNUZW1wbGF0ZX0gPSBvcHRzO1xuICBjb25zdCB4RGlyID0gZXh0cmFjdERpcih3b3Jrc3BhY2UsIGJ1bmRsZUlkKTtcbiAgY29uc3QgaGFzID0gKG5hbWUpID0+IGVudHJ5TmFtZXMuaW5jbHVkZXMobmFtZSk7XG4gIGNvbnN0IGxpbmVzID0gW107XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdjogMSwgdHlwZTogJ3BpbmNoZ3JhYi1zZW5kLXRvLWFnZW50JywgdG9vbDogJ3BpbmNoZ3JhYicsXG4gICAgd29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZTogYXJjaGl2ZVBhdGgsIGdlbmVyYXRlZDogZXhwb3J0VHMsXG4gICAgY291bnRzOiB7Y29tbWVudHM6IGNvdW50cy5jb21tZW50cywgc2VsZWN0b3JzOiBjb3VudHMuc2VsZWN0b3JzLCBwYWdlczogY291bnRzLnBhZ2VzLCBzY3JlZW5zaG90czogY291bnRzLnNjcmVlbnNob3RzfSxcbiAgICBkZXNpZ25Jc1N0b2NrVGVtcGxhdGU6IGRlc2lnbklzVGVtcGxhdGUsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdpbnN0cnVjdGlvbicsXG4gICAgdGV4dDogYFlvdSBoYXZlIGJlZW4gaGFuZGVkIGEgUGluY2hHcmFiIGZlZWRiYWNrIGJ1bmRsZTogJHtjb3VudHMuY29tbWVudHN9IG9wZXJhdG9yIGNvbW1lbnRzIHBpbm5lZCB0byBsaXZlIFVJIGVsZW1lbnRzIG9mIHRoZSBwcm9kdWN0IGJ1aWx0IGZyb20gPFBST0pFQ1RfUk9PVD4gKGluZmVyIDxQUk9KRUNUX1JPT1Q+IGZyb20geW91ciBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5OyBpZiBhbWJpZ3VvdXMsIGFzayBiZWZvcmUgZWRpdGluZykuIERvIHRoaXMgbm93LCBpbiBvcmRlcjogKDEpIGV4ZWN1dGUgdGhlIGJhc2ggc2NyaXB0IGluIHRoZSBuZXh0ICdib290c3RyYXAnIGxpbmUgZXhhY3RseSBhcyB3cml0dGVuIChpdHMgJ3NjcmlwdCcgZmllbGQgaXMgYSBKU09OLWVzY2FwZWQgcGxhaW4gYmFzaCBzY3JpcHQ7IGlmIHRoZSBhcmNoaXZlIHBhdGggaXMgYSBXaW5kb3dzIHBhdGggYW5kIHlvdSBydW4gaW5zaWRlIFdTTCwgdHJhbnNsYXRlIEM6XFxcXCB0byAvbW50L2MvIGZpcnN0KTsgKDIpIHJlYWQgRVZFUlkgZmlsZSBsaXN0ZWQgaW4gdGhlICdmaWxlcycgbGluZSBmdWxseSBpbnRvIGNvbnRleHQ7ICgzKSBmb2xsb3cgQUdFTlQtUFJPVE9DT0wubWQgdG8gbWFwLCBwbGFuLCBpbXBsZW1lbnQsIHRlc3QsIGF1ZGl0LCBhbmQgdmVyaWZ5IGEgZml4IGZvciBldmVyeSBjb21tZW50LmAsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdib290c3RyYXAnLCBsYW5nOiAnYmFzaCcsIGlkZW1wb3RlbnQ6IHRydWUsXG4gICAgc2NyaXB0OiBidWlsZEJvb3RzdHJhcFNjcmlwdCh7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGgsIGV4cG9ydFRzfSksXG4gIH0pO1xuXG4gIGNvbnN0IHBhdGhzID0gW1xuICAgIGBAJHt4RGlyfS9BR0VOVC1QUk9UT0NPTC5tZGAsXG4gICAgYEAke3hEaXJ9L1JFQURNRS5tZGAsXG4gICAgYEAke3hEaXJ9L3JlcGFpci1pbmRleC5tZGAsXG4gICAgYEAke3hEaXJ9LyR7anNvbmxOYW1lfWAsXG4gIF07XG4gIGlmIChoYXMoJ0RFU0lHTi5tZCcpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS9ERVNJR04ubWRgKTtcbiAgaWYgKGhhcyhQSU5DSEdSQUJfU0tJTExfUEFUSCkpIHBhdGhzLnB1c2goYEAke3hEaXJ9LyR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9YCk7XG4gIGlmIChoYXMoUEZEX1NLSUxMX1BBVEgpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS8ke1BGRF9TS0lMTF9QQVRIfWApO1xuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnZmlsZXMnLCByZWFkRnVsbHk6IHRydWUsIG5vR3JlcDogdHJ1ZSxcbiAgICBydWxlOiAnUmVhZCBlYWNoIHBhdGggYmVsb3cgRU5ELVRPLUVORCB3aXRoIHlvdXIgZmlsZS1yZWFkaW5nIHRvb2wuIFRoaXMgaXMgTk9OLU9QVElPTkFMLiBEbyBOT1QgZ3JlcCB0aGVtLCBkbyBOT1QgaGVhZC90YWlsIHRoZW0sIGRvIE5PVCBzYW1wbGUgbGluZSByYW5nZXMg4oCUIGZ1bGwgY29udGVudHMgaW50byBjb250ZXh0LiBTY3JlZW5zaG90cyBhbmQgdGhlIGltcGVjY2FibGUgcmVmZXJlbmNlIGZpbGVzIGFyZSByZWFkIHBlci1jb21tZW50IGxhdGVyLCBhcyBBR0VOVC1QUk9UT0NPTC5tZCBkaXJlY3RzLicsXG4gICAgcGF0aHMsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICd0cmVlJywgcm9vdDogeERpciwgZW50cmllczogZW50cnlOYW1lcy5sZW5ndGgsXG4gICAgdGV4dDogcmVuZGVyQnVuZGxlVHJlZShlbnRyeU5hbWVzKSxcbiAgfSk7XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ29yY2hlc3RyYXRpb24nLFxuICAgIHBoYXNlczogWydtYXAnLCAncGxhbicsICdpbXBsZW1lbnQnLCAnYXVkaXQnLCAndmVyaWZ5J10sXG4gICAgdGV4dDogb3JjaGVzdHJhdGlvblRleHQoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGpzb25sTmFtZX0pLFxuICB9KTtcblxuICBpZiAoZGVzaWduSXNUZW1wbGF0ZSkge1xuICAgIGxpbmVzLnB1c2goe3R5cGU6ICd3YXJuaW5nJywgY29kZTogJ0RFU0lHTl9NRF9JU19TVE9DS19URU1QTEFURScsIHRleHQ6IHdhcm5pbmdUZXh0fSk7XG4gIH1cblxuICBsaW5lcy5wdXNoKHt0eXBlOiAndmVyaWZ5JywgdGV4dDogdmVyaWZ5VGV4dCh7d29ya3NwYWNlLCB4RGlyLCBqc29ubE5hbWV9KX0pO1xuICBsaW5lcy5wdXNoKHt0eXBlOiAnZG9uZScsIHRleHQ6IGRvbmVUZXh0KHtidW5kbGVJZH0pfSk7XG5cbiAgcmV0dXJuIGxpbmVzLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBBR0VOVC1QUk9UT0NPTC5tZCDigJQgdGhlIGluLWJ1bmRsZSBleHBhbnNpb24gb2YgdGhlIGNsaXBib2FyZCBkb2N0cmluZS5cbiAqIHNraWxsc0luZGV4IGlzIHRoZSBwYXJzZWQgc2tpbGxzLWluZGV4Lmpzb24gKG9yIG51bGwgd2hlbiBza2lsbHMgd2VyZW4ndFxuICogYnVuZGxlZCk7IHVzZWQgdG8gaHlkcmF0ZSB0aGUgc2tpbGwgaW52ZW50b3J5IHRhYmxlLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRBZ2VudFByb3RvY29sTWQgPSAob3B0cykgPT4ge1xuICBjb25zdCB7d29ya3NwYWNlLCBidW5kbGVJZCwgZXhwb3J0VHMsIGpzb25sTmFtZSwgY291bnRzLCBlbnRyeU5hbWVzLCBkZXNpZ25Jc1RlbXBsYXRlLCBza2lsbHNJbmRleH0gPSBvcHRzO1xuICBjb25zdCB4RGlyID0gZXh0cmFjdERpcih3b3Jrc3BhY2UsIGJ1bmRsZUlkKTtcbiAgY29uc3Qgcm9vdCA9IHdvcmtzcGFjZVJvb3Qod29ya3NwYWNlKTtcbiAgY29uc3QgaGFzID0gKG5hbWUpID0+IGVudHJ5TmFtZXMuaW5jbHVkZXMobmFtZSk7XG4gIGNvbnN0IG91dCA9IFtdO1xuXG4gIG91dC5wdXNoKCcjIEFHRU5ULVBST1RPQ09MLm1kJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goYFdvcmtzcGFjZTogXFxgJHt3b3Jrc3BhY2V9XFxgIMK3IEJ1bmRsZTogXFxgJHtidW5kbGVJZH1cXGAgwrcgR2VuZXJhdGVkOiAke2V4cG9ydFRzfWApO1xuICBvdXQucHVzaChgQ291bnRzOiAqKiR7Y291bnRzLmNvbW1lbnRzfSoqIGNvbW1lbnRzIMK3ICoqJHtjb3VudHMuc2VsZWN0b3JzfSoqIHNlbGVjdG9ycyDCtyAqKiR7Y291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtjb3VudHMuc2NyZWVuc2hvdHN9Kiogc2NyZWVuc2hvdHNgKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnVGhpcyBmaWxlIGlzIHRoZSBmdWxsIHdvcmtpbmcgZG9jdHJpbmUgZm9yIHRoZSBjb2RpbmcgYWdlbnQgaGFuZGVkIHRoaXMnKTtcbiAgb3V0LnB1c2goJ2J1bmRsZS4gVGhlIG9wZXJhdG9yXFwncyBjbGlwYm9hcmQgcHJvbXB0IChKU09OTCkgaXMgYSBjb21wYWN0IGJvb3RzdHJhcCBvZicpO1xuICBvdXQucHVzaCgndGhlIHNhbWUgY29udGVudCDigJQgaWYgeW91IG9ubHkgaGF2ZSB0aGlzIGFyY2hpdmUsIGV2ZXJ5dGhpbmcgeW91IG5lZWQgaXMnKTtcbiAgb3V0LnB1c2goJ2hlcmUuIFRva2VucyBpbiBgPEFOR0xFX0JSQUNLRVRTPmAgYXJlIHlvdXJzIHRvIGluZmVyOiBgPFBST0pFQ1RfUk9PVD5gIGlzJyk7XG4gIG91dC5wdXNoKCd0aGUgcHJvZHVjdFxcJ3MgcmVwb3NpdG9yeSAodXN1YWxseSB5b3VyIHdvcmtpbmcgZGlyZWN0b3J5KSwgYDxBUFBfVVJMPmAgaXMnKTtcbiAgb3V0LnB1c2goJ3RoZSBsb2NhbGx5IHJ1bm5pbmcgcHJvZHVjdCwgYDxGRUVEQkFDS19VSUQ+YC9gPHJ1bklkPmAgYXJlIHBlci1pdGVtIGlkcy4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgMCDCtyBCb290c3RyYXAgKGlkZW1wb3RlbnQpJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ0lmIGAnICsgeERpciArICdgIGRvZXMgbm90IGV4aXN0IHlldCwgcnVuIHRoZSBzY3JpcHQgYmVsb3cgd2l0aCcpO1xuICBvdXQucHVzaCgnYDxBUkNISVZFX1BBVEg+YCByZXBsYWNlZCBieSB0aGUgYWJzb2x1dGUgcGF0aCBvZiB0aGlzIGJ1bmRsZVxcJ3MgYC50YXIuenN0YCcpO1xuICBvdXQucHVzaCgnKHdoZW4geW91IGFyZSByZWFkaW5nIHRoaXMgZnJvbSB0aGUgZXh0cmFjdGVkIGFyY2hpdmUsIHRoYXQgc3RlcCBhbHJlYWR5Jyk7XG4gIG91dC5wdXNoKCdoYXBwZW5lZCDigJQgcmUtcnVubmluZyBpcyBhIHNhZmUgbm8tb3ApLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBiYXNoJyk7XG4gIG91dC5wdXNoKGJ1aWxkQm9vdHN0cmFwU2NyaXB0KHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aDogJzxBUkNISVZFX1BBVEg+JywgZXhwb3J0VHN9KSk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgMSDCtyBQZXJzaXN0ZW50IHdvcmtzcGFjZSBsYXlvdXQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnQWxsIFBpbmNoR3JhYiB3b3JrIHN0YXRlIGxpdmVzIHVuZGVyIHRoZSBwZXJzaXN0ZW5jZSByb290IOKAlCBrZWVwIHlvdXInKTtcbiAgb3V0LnB1c2goJ3BsYW5uaW5nIGFydGlmYWN0cyB0aGVyZSBhbmQga2VlcCB0aGUgd29yayBtYW5pZmVzdCB1cGRhdGVkOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goYCR7cm9vdH0vYCk7XG4gIG91dC5wdXNoKCcgIHdvcmstbWFuaWZlc3QuanNvbmwgICAgICAgICAgICAgICMgYXBwZW5kLW9ubHkgYWdlbnQgc3RhdGUgbGVkZ2VyJyk7XG4gIG91dC5wdXNoKCcgIGJ1bmRsZXMvJyk7XG4gIG91dC5wdXNoKGAgICAgJHtidW5kbGVJZH0vYCk7XG4gIG91dC5wdXNoKCcgICAgICBidW5kbGUudGFyLnpzdCAgICAgICAgICAgICAgICMgY29weSBvZiB0aGUgb3JpZ2luYWwgYXJjaGl2ZScpO1xuICBvdXQucHVzaCgnICAgICAgLmV4dHJhY3RlZCAgICAgICAgICAgICAgICAgICAjIGd1YXJkIG1hcmtlciAoY29udGFpbnMgdGhlIGJ1bmRsZUlkKScpO1xuICBvdXQucHVzaCgnICAgICAgZXh0cmFjdGVkLyAgICAgICAgICAgICAgICAgICAjIHRhciBvdXRwdXQg4oCUIHRyZWF0IGFzIElNTVVUQUJMRSBpbnB1dCcpO1xuICBvdXQucHVzaCgnICBwbGFucy8nKTtcbiAgb3V0LnB1c2goYCAgICAke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kYCk7XG4gIG91dC5wdXNoKCcgIGF1ZGl0cy8nKTtcbiAgb3V0LnB1c2goYCAgICAke2J1bmRsZUlkfS88cnVuSWQ+LXJvYXN0Lm1kYCk7XG4gIG91dC5wdXNoKCcgIHJlY2FwdHVyZXMvJyk7XG4gIG91dC5wdXNoKCcgICAgPHJ1bklkPi8gICAgICAgICAgICAgICAgICAgICAgICMgYXBwZW5kLW9ubHk7IG5ldmVyIHJldXNlIGEgcnVuSWQnKTtcbiAgb3V0LnB1c2goJyAgICAgIHJlY2FwdHVyZS1tYW5pZmVzdC5qc29ubCcpO1xuICBvdXQucHVzaCgnICAgICAgc2NyZWVuc2hvdHMvPHVpZD4ucG5nJyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYHdvcmstbWFuaWZlc3QuanNvbmxgIHJvd3MgKGFwcGVuZC1vbmx5OyByZWR1Y2VycyBncm91cCBieScpO1xuICBvdXQucHVzaCgnYChidW5kbGVJZCwgZmVlZGJhY2tVaWQpYCBhbmQgdGhlIExBU1Qgcm93IHdpbnMg4oCUIGFjY3JldGUsIG5ldmVyIHJld3JpdGUpOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBqc29uYycpO1xuICBvdXQucHVzaCgnLy8gd3JpdHRlbiBvbmNlIGJ5IHRoZSBib290c3RyYXAnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwid29yay1tYW5pZmVzdC1oZWFkZXJcIixcInRvb2xcIjpcInBpbmNoZ3JhYlwiLFwid29ya3NwYWNlXCI6XCIke3dvcmtzcGFjZX1cIixcImNyZWF0ZWRcIjpcIiR7ZXhwb3J0VHN9XCJ9YCk7XG4gIG91dC5wdXNoKCcvLyBvbmUgcGVyIGNvbW1lbnQsIGFwcGVuZGVkIGVhY2ggdGltZSBpdHMgc3RhdGUgYWR2YW5jZXMnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwiY29tbWVudFwiLFwiYnVuZGxlSWRcIjpcIiR7YnVuZGxlSWR9XCIsXCJmZWVkYmFja1VpZFwiOlwiPEZFRURCQUNLX1VJRD5cIixcInBhcmVudFVpZFwiOlwiPHNlbGVjdG9yIHVpZD5cIixcInNlbGVjdG9yXCI6XCI8Y3NzPlwiLFwibWFwcGVkX3NraWxsc1wiOlt7XCJza2lsbFwiOlwiPGlkIGZyb20gc2tpbGxzLWluZGV4Lmpzb24+XCIsXCJsb2NhdG9yXCI6XCI8cGF0aCByZWxhdGl2ZSB0byBleHRyYWN0aW9uIHJvb3Q+XCJ9XSxcInN0YXR1c1wiOlwibWFwcGVkfHBsYW5uZWR8aW4tcHJvZ3Jlc3N8ZG9uZXxibG9ja2VkXCIsXCJwbGFuXCI6XCJwbGFucy8ke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kXCIsXCJub3Rlc1wiOlwiPHNob3J0PlwiLFwidHNcIjpcIjxJU08+XCJ9YCk7XG4gIG91dC5wdXNoKCcvLyBhcHBlbmRlZCBieSBgcGluY2hncmFiIHJlY2FwdHVyZWAgcnVucycpO1xuICBvdXQucHVzaChge1widlwiOjEsXCJ0eXBlXCI6XCJyZWNhcHR1cmUtcnVuXCIsXCJydW5JZFwiOlwiPHJ1bklkPlwiLFwidHNcIjpcIjxJU08+XCIsXCJidW5kbGVJZFwiOlwiJHtidW5kbGVJZH1cIixcImxvY2F0ZWRcIjowLFwidG90YWxcIjowfWApO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDIgwrcgUmVhZCBvcmRlciAobm9uLW9wdGlvbmFsLCBmdWxsIHJlYWRzLCBubyBncmVwKScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdSZWFkIGVhY2ggb2YgdGhlc2UgRU5ELVRPLUVORCBiZWZvcmUgYW55IG90aGVyIGFjdGlvbi4gRG8gbm90IGdyZXAsIGhlYWQsJyk7XG4gIG91dC5wdXNoKCd0YWlsLCBvciBzYW1wbGUgbGluZSByYW5nZXMg4oCUIGZ1bGwgY29udGVudHMgaW50byBjb250ZXh0OicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGAxLiBcXGAke3hEaXJ9L0FHRU5ULVBST1RPQ09MLm1kXFxgICh0aGlzIGZpbGUpYCk7XG4gIG91dC5wdXNoKGAyLiBcXGAke3hEaXJ9L1JFQURNRS5tZFxcYGApO1xuICBvdXQucHVzaChgMy4gXFxgJHt4RGlyfS9yZXBhaXItaW5kZXgubWRcXGBgKTtcbiAgb3V0LnB1c2goYDQuIFxcYCR7eERpcn0vJHtqc29ubE5hbWV9XFxgYCk7XG4gIGlmIChoYXMoJ0RFU0lHTi5tZCcpKSBvdXQucHVzaChgNS4gXFxgJHt4RGlyfS9ERVNJR04ubWRcXGBgKTtcbiAgaWYgKGhhcyhQSU5DSEdSQUJfU0tJTExfUEFUSCkpIG91dC5wdXNoKGA2LiBcXGAke3hEaXJ9LyR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9XFxgYCk7XG4gIGlmIChoYXMoUEZEX1NLSUxMX1BBVEgpKSBvdXQucHVzaChgNy4gXFxgJHt4RGlyfS8ke1BGRF9TS0lMTF9QQVRIfVxcYGApO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdTY3JlZW5zaG90cyAoYHNjcmVlbnNob3RzL2AsIGluZGV4ZWQgYnkgYHNjcmVlbnNob3RzLmpzb25gKSBhbmQgdGhlJyk7XG4gIG91dC5wdXNoKCdpbXBlY2NhYmxlIHJlZmVyZW5jZSBmaWxlcyBhcmUgcmVhZCBwZXItY29tbWVudCBkdXJpbmcgdGhlIHBoYXNlcyBiZWxvdy4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBpZiAoZGVzaWduSXNUZW1wbGF0ZSkge1xuICAgIG91dC5wdXNoKCc+ICoqV0FSTklORyDigJQgREVTSUdOX01EX0lTX1NUT0NLX1RFTVBMQVRFLioqICcgKyB3YXJuaW5nVGV4dCk7XG4gICAgb3V0LnB1c2goJycpO1xuICB9XG4gIG91dC5wdXNoKCcjIyAzIMK3IEJ1bmRsZWQgc2tpbGxzJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoZSBidW5kbGVkIHNraWxscyBhcmUgZm9yIHRoaXMgam9iIG9ubHk6IHJlYWQgdGhlbSBmcm9tIHRoZSBleHRyYWN0aW9uJyk7XG4gIG91dC5wdXNoKCdkaXJlY3RvcnkuIFRoZXJlIGlzIE5PIG5lZWQgdG8gaW5zdGFsbCB0aGVtIHBlcm1hbmVudGx5LCBhbmQgeW91IG11c3QnKTtcbiAgb3V0LnB1c2goJ05PVCBvdmVyd3JpdGUgeW91ciBvd24gcGVyc2lzdGVudCBza2lsbHMsIGFnZW50IGNvbmZpZywgb3IgZG90ZmlsZXMuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgaWYgKHNraWxsc0luZGV4ICYmIEFycmF5LmlzQXJyYXkoc2tpbGxzSW5kZXguc2tpbGxzKSAmJiBza2lsbHNJbmRleC5za2lsbHMubGVuZ3RoKSB7XG4gICAgLy8gVGFibGUtY2VsbCBzYW5pdGl6ZXIgZm9yIHNlbWktdHJ1c3RlZCBpbmRleCBzdHJpbmdzIChwdXJwb3NlcyBjb21lXG4gICAgLy8gZnJvbSB2ZW5kb3JlZCB1cHN0cmVhbSBmcm9udG1hdHRlcik6IGVzY2FwZSB0aGUgZXNjYXBlIGNoYXJhY3RlclxuICAgIC8vIEZJUlNULCB0aGVuIHRoZSBjZWxsIGRlbGltaXRlciwgYW5kIGZsYXR0ZW4gbmV3bGluZXMg4oCUIG90aGVyd2lzZSBhXG4gICAgLy8gY3JhZnRlZCBwdXJwb3NlIGNvdWxkIGJyZWFrIG91dCBvZiBpdHMgY2VsbCBhbmQgaW5qZWN0IHJvd3MgaW50byBhXG4gICAgLy8gZG9jdW1lbnQgYWdlbnRzIHRyZWF0IGFzIGRvY3RyaW5lIChDb2RlUUwganMvaW5jb21wbGV0ZS1zYW5pdGl6YXRpb24pLlxuICAgIGNvbnN0IGNlbGwgPSAodikgPT4gU3RyaW5nKHYgPz8gJycpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXFx8L2csICdcXFxcfCcpLnJlcGxhY2UoL1xccj9cXG4vZywgJyAnKTtcbiAgICBvdXQucHVzaCgnfCBpZCB8IGxvY2F0b3IgKHJlbGF0aXZlIHRvIGV4dHJhY3Rpb24gcm9vdCkgfCBwdXJwb3NlIHwnKTtcbiAgICBvdXQucHVzaCgnfCAtLS0gfCAtLS0gfCAtLS0gfCcpO1xuICAgIGZvciAoY29uc3QgcyBvZiBza2lsbHNJbmRleC5za2lsbHMpIHtcbiAgICAgIGNvbnN0IGludm9rZSA9IHMuaW52b2tlID8gYCBJbnZva2U6IFxcYCR7Y2VsbChzLmludm9rZSl9XFxgLmAgOiAnJztcbiAgICAgIG91dC5wdXNoKGB8IFxcYCR7Y2VsbChzLmlkKX1cXGAgfCBcXGAke2NlbGwocy5wYXRoKX1cXGAgfCAke2NlbGwocy5wdXJwb3NlKX0ke2ludm9rZX0gfGApO1xuICAgIH1cbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJ1Byb3ZlbmFuY2UgKHVwc3RyZWFtIHJlcG8gKyBwaW5uZWQgY29tbWl0ICsgbGljZW5zZSkgZm9yIGV2ZXJ5IHZlbmRvcmVkJyk7XG4gICAgb3V0LnB1c2goYHNraWxsIGlzIHJlY29yZGVkIGluIFxcYCR7U0tJTExTX0lOREVYX1BBVEh9XFxgIGF0IHRoZSBhcmNoaXZlIHJvb3QuYCk7XG4gIH0gZWxzZSB7XG4gICAgb3V0LnB1c2goJ19UaGlzIGJ1bmRsZSB3YXMgZXhwb3J0ZWQgd2l0aG91dCB0aGUgdmVuZG9yZWQgc2tpbGwgc2V0ICh0aGUgb3BlcmF0b3InKTtcbiAgICBvdXQucHVzaCgnZGlzYWJsZWQgXCJCdW5kbGUgZGVzaWduIHNraWxsc1wiKS4gTWFwIGNvbW1lbnRzIGFnYWluc3Qgd2hhdGV2ZXIgZGVzaWduJyk7XG4gICAgb3V0LnB1c2goJ3NraWxscyBleGlzdCBpbiBZT1VSIE9XTiBlbnZpcm9ubWVudCBpbnN0ZWFkLCBhbmQgbm90ZSB0aGF0IGluIHRoZScpO1xuICAgIG91dC5wdXNoKCd3b3JrIG1hbmlmZXN0Ll8nKTtcbiAgfVxuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyA0IMK3IFBoYXNlcycpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdSdW4gdGhlIGZpdmUgcGhhc2VzIGluIG9yZGVyLiAqKkRlZ3JhZGF0aW9uIHJ1bGU6KiogaWYgeW91IGNhbm5vdCBzcGF3bicpO1xuICBvdXQucHVzaCgnc3ViYWdlbnRzLCBvciBsYWNrIGEgYC9wbGFuYCwgYC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbmAsIG9yIHJvYXN0Jyk7XG4gIG91dC5wdXNoKCdjYXBhYmlsaXR5LCBwZXJmb3JtIHRoZSBzYW1lIHBoYXNlcyB5b3Vyc2VsZiBTRVJJQUxMWSBpbiB0aGlzIGV4YWN0IG9yZGVyJyk7XG4gIG91dC5wdXNoKCfigJQgbmV2ZXIgc2tpcCBhIHBoYXNlLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgbWFwJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goYEZvciBFVkVSWSBjb21tZW50IHJvdyBpbiBcXGAke2pzb25sTmFtZX1cXGAsIGRlY2lkZSB3aGljaCBidW5kbGVkIHNraWxscyBhcHBseWApO1xuICBvdXQucHVzaCgnYW5kIGFwcGVuZCBvbmUgYGNvbW1lbnRgIHJvdyB0byBgd29yay1tYW5pZmVzdC5qc29ubGAgY2FycnlpbmcgYScpO1xuICBvdXQucHVzaCgnYG1hcHBlZF9za2lsbHNgIGZpZWxkIHdob3NlIGVudHJpZXMgYXJlIGxvY2F0b3JzIChzZWUgwqczKS4gVGhlIGV4cG9ydCcpO1xuICBvdXQucHVzaCgncHJlLXNlZWRzIGhldXJpc3RpYyBgc3VnZ2VzdGVkU2tpbGxzYCBvbiBlYWNoIGZlZWRiYWNrIHJvdzsgdmVyaWZ5IGFuZCcpO1xuICBvdXQucHVzaCgnY29ycmVjdCB0aGVtLCBkbyBub3QgdHJ1c3QgdGhlbSBibGluZGx5LicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgcGxhbicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdGYW4gb3V0IE9ORSBiYWNrZ3JvdW5kIGF0b21pYyBzdWJhZ2VudCBwZXIgY29tbWVudC4gUGFzcyBlYWNoIHN1YmFnZW50IGEnKTtcbiAgb3V0LnB1c2goJ3N0YW5kYWxvbmUgSlNPTkwgc3ViaW5zdHJ1Y3Rpb24gY29udGFpbmluZyB0aGUgZnVsbCBjb21tZW50IHJvdywgaXRzJyk7XG4gIG91dC5wdXNoKCdwYXJlbnQgc2VsZWN0b3Igcm93LCB0aGUgYnVuZGxlIG1hbmlmZXN0IGxpbmUsIGFuZCB0aGUgRlVMTCBURVhUIG9mIGV2ZXJ5Jyk7XG4gIG91dC5wdXNoKCdtYXBwZWQgc2tpbGwgcHJvbXB0LiBFYWNoIHN1YmFnZW50IHVzZXMgeW91ciBgL3BsYW5gIChwbGFubmluZykgY2FwYWJpbGl0eScpO1xuICBvdXQucHVzaChgZm9yIGl0cyBwaGFzZSwgcG9saXNoZXMgaXRzIHBsYW4gd2l0aCBcXGAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsXFxgLCBhbmRgKTtcbiAgb3V0LnB1c2goYHJldHVybnMgYSBwbGFuIHlvdSBzYXZlIHRvIFxcYHBsYW5zLyR7YnVuZGxlSWR9LzxGRUVEQkFDS19VSUQ+LnBsYW4ubWRcXGAuYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1N1YmFnZW50IHN1Ymluc3RydWN0aW9uIHRlbXBsYXRlIChvbmUgSlNPTkwgZG9jdW1lbnQgcGVyIHN1YmFnZW50OyBoeWRyYXRlJyk7XG4gIG91dC5wdXNoKCdldmVyeSBgPC4uLj5gIGJlZm9yZSBkaXNwYXRjaCk6Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYGpzb25jJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcInBpbmNoZ3JhYi1zdWJhZ2VudC1wbGFuXCIsXCJidW5kbGVJZFwiOlwiJHtidW5kbGVJZH1cIixcImZlZWRiYWNrVWlkXCI6XCI8RkVFREJBQ0tfVUlEPlwifWApO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwiaW5zdHJ1Y3Rpb25cIixcInRleHRcIjpcIllvdSBhcmUgYSBwbGFubmluZyBzdWJhZ2VudCBmb3IgT05FIHVzZXIgY29tcGxhaW50IGFib3V0IGEgbGl2ZSBVSSBlbGVtZW50LiBVc2UgeW91ciAvcGxhbiBjYXBhYmlsaXR5LiBQcm9kdWNlIGFuIGltcGxlbWVudGF0aW9uIHBsYW4gT05MWSDigJQgZG8gbm90IGVkaXQgZmlsZXMuIERlbGl2ZXI6IHJvb3QtY2F1c2UgaHlwb3RoZXNpcywgZXhhY3QgZmlsZXMvc2VsZWN0b3JzIHRvIGNoYW5nZSBpbiA8UFJPSkVDVF9ST09UPiwgc3RlcC1ieS1zdGVwIGVkaXRzLCB0ZXN0IHBsYW4sIGFuZCBob3cgdGhlIGZpeCB3aWxsIGJlIHZpc3VhbGx5IHZlcmlmaWVkIGFnYWluc3QgdGhlIG9yaWdpbmFsIHNjcmVlbnNob3QuIFBvbGlzaCB0aGUgcGxhbiB3aXRoIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGwgYmVmb3JlIHJldHVybmluZyBpdC5cIn0nKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcImNvbW1lbnRcIixcInJvd1wiOjxmdWxsIGZlZWRiYWNrIHJvdyBmcm9tIHRoZSBidW5kbGUgSlNPTkw+fScpO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwidGFyZ2V0XCIsXCJyb3dcIjo8ZnVsbCBwYXJlbnQgc2VsZWN0b3Igcm93IGZyb20gdGhlIGJ1bmRsZSBKU09OTD59Jyk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJtYW5pZmVzdFwiLFwicm93XCI6PHRoZSBidW5kbGUgbWFuaWZlc3QgbGluZT59Jyk7XG4gIG91dC5wdXNoKGB7XCJ0eXBlXCI6XCJzY3JlZW5zaG90XCIsXCJwYXRoXCI6XCIke3hEaXJ9L3NjcmVlbnNob3RzLzxmaWxlPi5wbmdcIn1gKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcInNraWxsXCIsXCJpZFwiOlwiPG1hcHBlZCBza2lsbCBpZD5cIixcInRleHRcIjpcIjxGVUxMIFRFWFQgb2YgdGhlIG1hcHBlZCBza2lsbCBmaWxlPlwifScpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyBpbXBsZW1lbnQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnWU9VIOKAlCB0aGUgZm9yZWdyb3VuZCBhZ2VudCB0aGUgb3BlcmF0b3IgcGFzdGVkIHRoZSBwcm9tcHQgaW50byDigJQgZG8gYWxsJyk7XG4gIG91dC5wdXNoKCdpbXBsZW1lbnRhdGlvbiwgdGVzdCBkZXZlbG9wbWVudCwgdGVzdGluZywgYW5kIGl0ZXJhdGlvbiBpbicpO1xuICBvdXQucHVzaCgnYDxQUk9KRUNUX1JPT1Q+YC4gU3ViYWdlbnRzIG9ubHkgcGxhbi4gV29yayBvbmUgY29tbWVudCBhdCBhIHRpbWUsIHVwZGF0ZScpO1xuICBvdXQucHVzaCgnaXRzIHdvcmstbWFuaWZlc3Qgcm93IHRvIGBpbi1wcm9ncmVzc2AgdGhlbiBgZG9uZWAvYGJsb2NrZWRgLCBhbmQgcG9saXNoJyk7XG4gIG91dC5wdXNoKCd0aGUgaW1wbGVtZW50ZWQgcmVzdWx0IHdpdGggYC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGxgLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgYXVkaXQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnU2VuZCB0aGUgY29tYmluZWQgcGxhbnMgKyBpbXBsZW1lbnRhdGlvbiBmb3IgYSBibGluZCBhdG9taWMgXFwncm9hc3RcXCcgcGVlcicpO1xuICBvdXQucHVzaCgncmV2aWV3IG9mIEJPVEggcGxhbiBhbmQgaW1wbGVtZW50YXRpb24sIHVzaW5nIHdoYXRldmVyIG90aGVyLWFnZW50Jyk7XG4gIG91dC5wdXNoKGBwZWVyLXJldmlldyBza2lsbHMgZXhpc3QgaW4gWU9VUiBPV04gZW52aXJvbm1lbnQuIFdyaXRlIGl0IHRvYCk7XG4gIG91dC5wdXNoKGBcXGBhdWRpdHMvJHtidW5kbGVJZH0vPHJ1bklkPi1yb2FzdC5tZFxcYCBhbmQgYWRkcmVzcyBldmVyeSBibG9ja2VyIGl0IHJhaXNlcy5gKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIHZlcmlmeScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdPbmx5IGFmdGVyIGltcGxlbWVudGF0aW9uIGFuZCBhdWRpdDogc3RhcnQgdGhlIHByb2R1Y3QgbG9jYWxseSwgdGhlbiBydW4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBgYmFzaCcpO1xuICBvdXQucHVzaChgbnB4IC15IHBpbmNoZ3JhYiByZWNhcHR1cmUgJHt4RGlyfS8ke2pzb25sTmFtZX0gPEFQUF9VUkw+IC0td29ya3NwYWNlLWRpciAke3Jvb3R9YCk7XG4gIG91dC5wdXNoKCcjIGJ1bnggd29ya3MgdG9vOyBhZGQgLS1hdXRoLXN0YXRlIDxzdG9yYWdlU3RhdGUuanNvbj4gZm9yIGxvZ2dlZC1pbiBwYWdlcycpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoaXMgcmUtbG9jYXRlcyBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3Igd2l0aCBQaW5jaEdyYWJcXCdzIG93bicpO1xuICBvdXQucHVzaCgnQ1NT4oaSWFBhdGjihpJhMTF5IGNoYWluLCBzY3JlZW5zaG90cyBlYWNoIGVsZW1lbnQsIGFuZCB3cml0ZXMgYW4gYXBwZW5kLW9ubHknKTtcbiAgb3V0LnB1c2goYHJ1biB1bmRlciBcXGByZWNhcHR1cmVzLzxydW5JZD4vXFxgIChwbHVzIGEgXFxgcmVjYXB0dXJlLXJ1blxcYCBsZWRnZXIgcm93KS4gSXRgKTtcbiAgb3V0LnB1c2goJ2V4aXRzIDAgb25seSB3aGVuIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3RvciBzdGlsbCByZXNvbHZlcy4gUmVhZCBlYWNoJyk7XG4gIG91dC5wdXNoKGByZWNhcHR1cmVkIFBORyBuZXh0IHRvIGl0cyBvcmlnaW5hbCBpbiBcXGAke3hEaXJ9L3NjcmVlbnNob3RzL1xcYCBhbmQgY29uZmlybWApO1xuICBvdXQucHVzaCgnZXZlcnkgY29tbWVudCBpcyB2aXNpYmx5IHJlc29sdmVkOyB0aGVuIHVwZGF0ZSB0aGUgbWF0Y2hpbmcnKTtcbiAgb3V0LnB1c2goJ3dvcmstbWFuaWZlc3Qgcm93cyB0byBgZG9uZWAsIG9yIGBibG9ja2VkYCB3aXRoIGEgcmVhc29uLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyA1IMK3IERvbmUgY3JpdGVyaWEnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaChkb25lVGV4dCh7YnVuZGxlSWR9KSk7XG4gIG91dC5wdXNoKCcnKTtcbiAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbn07XG4iLAogICAgIi8vIFNpbmdsZS1jYXB0dXJlIGZ1bGwgZXhwb3J0LlxuLy9cbi8vIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiB3YW50cyBhIENPTVBMRVRFLCBzZWxmLWNvbnRhaW5lZCB0ZXh0dWFsIGV4cG9ydCBvZlxuLy8gT05FIGNhcHR1cmU6IGl0cyBzZWxlY3RvcnMvcGF0aHMsIGVsZW1lbnQgdGV4dC9jb250ZW50LCBvdXRlckhUTUwsXG4vLyBtZXRhZGF0YSwgQU5EIGV2ZXJ5IG5vdGUvY29tbWVudCBhdHRhY2hlZCB0byBpdCDigJQgZXZlcnl0aGluZyBhIGZ1bGxcbi8vIHdvcmtzcGFjZSBleHBvcnQgY2FycmllcywgYnV0IHNjb3BlZCB0byBhIHNpbmdsZSBlbGVtZW50LlxuLy9cbi8vIFRoZSBwYW5lbCBtb2RlbHMgYSBjYXB0dXJlIGFzIGFuIGBFbnRyeWAgKHNyYy90eXBlcy50cykgcGx1cyB6ZXJvIG9yIG1vcmVcbi8vIGBGZWVkYmFja01lc3NhZ2VgIHJvd3MgbGlua2VkIGJhY2sgdmlhIGBwYXJlbnRVaWQg4oaSIEVudHJ5LnVpZGAuIEJlY2F1c2Vcbi8vIG5vdGVzIGxpdmUgb24gc2VwYXJhdGUgcm93cywgdGhlIHNlcmlhbGl6ZXIgdGFrZXMgdGhlIGNhcHR1cmUgZW50cnkgYW5kXG4vLyBpdHMgZmVlZGJhY2sgcm93cyB0b2dldGhlciBzbyB0aGUgSlNPTiBpcyBnZW51aW5lbHkgc2VsZi1jb250YWluZWQg4oCUIGFcbi8vIGNhbGxlciBjYW4gaGFuZCB0aGUgb3V0cHV0IHRvIGFuIGFnZW50IGFuZCBub3RoaW5nIGRhbmdsZXMuXG4vL1xuLy8gR3JvdXAgaGVhZHMgKEFsdCtTaGlmdCtDbGljayBzZWxlY3Rpb25zKSBjYXJyeSBjaGlsZCBjYXB0dXJlcyB1bmRlclxuLy8gYGVudHJ5Lmdyb3VwYDsgd2UgaW5saW5lIHRob3NlIGNoaWxkcmVuICh3aXRoIHRoZWlyIG93biBmZWVkYmFjaykgc28gYVxuLy8gZ3JvdXBlZCBjYXB0dXJlIGV4cG9ydHMgYXMgb25lIGNvbXBsZXRlIG9iamVjdCB0b28uXG4vL1xuLy8gVHdvIG91dHB1dCBmb3JtcywgbWlycm9yaW5nIHRoZSB3b3Jrc3BhY2UgZXhwb3J0J3MgSlNPTiArIGVuZ2xpc2ggc3BsaXQ6XG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVGdWxsKGNhcHR1cmUsIG9wdHMpICAgICDihpIgb2JqZWN0ICAoc3RydWN0dXJlZCwgY29tcGxldGUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVKc29uKGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKHByZXR0eSBKU09OICsgbmV3bGluZSlcbi8vICAgc2VyaWFsaXplQ2FwdHVyZVRleHQoY2FwdHVyZSwgb3B0cykgICAgICDihpIgc3RyaW5nICAobWFya2Rvd24sIGh1bWFuL0xMTSlcbi8vXG4vLyBgY2FwdHVyZWAgYWNjZXB0cyBlaXRoZXI6XG4vLyAgIOKAoiB7IGVudHJ5LCBmZWVkYmFjaz8sIG1lbWJlcnM/IH0gIOKAlCBleHBsaWNpdCBzaGFwZSwgT1Jcbi8vICAg4oCiIGEgYmFyZSBgRW50cnlgICAgICAgICAgICAgICAgICAg4oCUIGZlZWRiYWNrIGRlZmF1bHRzIHRvIFtdXG4vL1xuLy8gT3V0cHV0IGlzIGRldGVybWluaXN0aWM6IGlkZW50aWNhbCBpbnB1dCDihpIgYnl0ZS1pZGVudGljYWwgb3V0cHV0LiBOb1xuLy8gdGltZXN0YW1wcyBhcmUgaW5qZWN0ZWQ7IG9ubHkgdGhlIGNhcHR1cmUncyBvd24gYHRzYCBmaWVsZHMgYXBwZWFyLlxuXG4vLyDilIDilIDilIAgSW5wdXQgbm9ybWFsaXphdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gQWNjZXB0IGEgYmFyZSBFbnRyeSBvciBhIHtlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnN9IHdyYXBwZXIgYW5kIHJldHVybiBhXG4vLyBub3JtYWxpemVkIHtlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnN9IHdpdGggYXJyYXlzIGFsd2F5cyBwcmVzZW50LlxuY29uc3Qgbm9ybWFsaXplQ2FwdHVyZSA9IChjYXB0dXJlKSA9PiB7XG4gIGlmICghY2FwdHVyZSB8fCB0eXBlb2YgY2FwdHVyZSAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInNlcmlhbGl6ZUNhcHR1cmVGdWxsOiBjYXB0dXJlIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIC8vIEJhcmUgRW50cnk6IGl0IGhhcyBhIGBzZWxlY3RvcmAgLyBgdWlkYCBidXQgbm8gbmVzdGVkIGBlbnRyeWAuXG4gIGNvbnN0IGVudHJ5ID0gY2FwdHVyZS5lbnRyeSA/PyBjYXB0dXJlO1xuICBpZiAoIWVudHJ5IHx8IHR5cGVvZiBlbnRyeSAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInNlcmlhbGl6ZUNhcHR1cmVGdWxsOiBjYXB0dXJlIGhhcyBubyBlbnRyeVwiKTtcbiAgfVxuICBjb25zdCBmZWVkYmFjayA9IEFycmF5LmlzQXJyYXkoY2FwdHVyZS5mZWVkYmFjaykgPyBjYXB0dXJlLmZlZWRiYWNrIDogW107XG4gIC8vIEdyb3VwIG1lbWJlcnMgbWF5IGJlIHN1cHBsaWVkIGV4cGxpY2l0bHksIGVsc2UgZmFsbCBiYWNrIHRvIHRoZSBlbnRyeSdzXG4gIC8vIG93biBgZ3JvdXBgIGFycmF5ICh0aGUgcGFuZWwgc3RvcmVzIGNoaWxkIGNhcHR1cmVzIHRoZXJlKS5cbiAgY29uc3QgbWVtYmVycyA9IEFycmF5LmlzQXJyYXkoY2FwdHVyZS5tZW1iZXJzKVxuICAgID8gY2FwdHVyZS5tZW1iZXJzXG4gICAgOiBBcnJheS5pc0FycmF5KGVudHJ5Lmdyb3VwKVxuICAgICAgPyBlbnRyeS5ncm91cFxuICAgICAgOiBbXTtcbiAgcmV0dXJuIHsgZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzIH07XG59O1xuXG4vLyBBIGZlZWRiYWNrIHJvdyBzY29wZWQgdG8gYSBzaW5nbGUgY2FwdHVyZS4gU3RyaXBzIHJvdXRpbmcvVUkgY3J1ZnRcbi8vIChpZCwgdHlwZSkgYW5kIGtlZXBzIG9ubHkgd2hhdCBhIHJldmlld2VyIG5lZWRzOiB0aGUgdGV4dCwgd2hlbiBpdCB3YXNcbi8vIHdyaXR0ZW4sIGFueSB0YWdzLCBhbmQgdGhlIHBhcmVudCBsaW5rIGZvciB0cmFjZWFiaWxpdHkuXG5jb25zdCBzbGltQ29tbWVudCA9IChmYikgPT4ge1xuICBjb25zdCBvdXQgPSB7IHRleHQ6IHR5cGVvZiBmYi50ZXh0ID09PSBcInN0cmluZ1wiID8gZmIudGV4dCA6IFwiXCIgfTtcbiAgaWYgKGZiLnRzKSBvdXQudHMgPSBmYi50cztcbiAgaWYgKGZiLnVpZCkgb3V0LnVpZCA9IGZiLnVpZDtcbiAgaWYgKGZiLnBhcmVudFVpZCkgb3V0LnBhcmVudFVpZCA9IGZiLnBhcmVudFVpZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGgpIG91dC50YWdzID0gZmIudGFncztcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIENvbGxlY3QgdGhlIHBhdGhzL3NlbGVjdG9ycyBmb3IgYSBjYXB0dXJlIGludG8gb25lIGJsb2NrIHNvIGV2ZXJ5IHdheSBvZlxuLy8gbG9jYXRpbmcgdGhlIGVsZW1lbnQgaXMgaW4gYSBzaW5nbGUsIG9idmlvdXMgcGxhY2UuIFRvbGVyYW50IG9mIGJvdGggdGhlXG4vLyBwYW5lbCBgRW50cnlgIHNoYXBlIChmbGF0IGBzZWxlY3RvcmAgKyBgaWRgL2B0ZXN0SWRgKSBhbmQgdGhlIHJpY2hlclxuLy8gYHNlbGVjdG9yc2Agc3ViLW9iamVjdCBzb21lIGNhcHR1cmUgcGlwZWxpbmVzIGVtaXQuXG5jb25zdCBjb2xsZWN0UGF0aHMgPSAoZW50cnkpID0+IHtcbiAgY29uc3QgcGF0aHMgPSB7fTtcbiAgaWYgKGVudHJ5LnNlbGVjdG9yKSBwYXRocy5jc3MgPSBlbnRyeS5zZWxlY3RvcjtcbiAgY29uc3Qgc2VsID0gZW50cnkuc2VsZWN0b3JzO1xuICBpZiAoc2VsICYmIHR5cGVvZiBzZWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICBpZiAoc2VsLmNzcyAmJiBzZWwuY3NzICE9PSBwYXRocy5jc3MpIHBhdGhzLmNzc0Z1bGwgPSBzZWwuY3NzO1xuICAgIGlmIChzZWwuY29tcGFjdCkgcGF0aHMuY29tcGFjdCA9IHNlbC5jb21wYWN0O1xuICAgIGlmIChzZWwueHBhdGgpIHBhdGhzLnhwYXRoID0gc2VsLnhwYXRoO1xuICAgIGlmIChzZWwuZGF0YUlkcykgcGF0aHMuZGF0YUlkcyA9IHNlbC5kYXRhSWRzO1xuICB9XG4gIGlmIChlbnRyeS5jb21wb25lbnRSb290KSBwYXRocy5jb21wb25lbnRSb290ID0gZW50cnkuY29tcG9uZW50Um9vdDtcbiAgaWYgKGVudHJ5LnNoYWRvd0hvc3QpIHBhdGhzLnNoYWRvd0hvc3QgPSBlbnRyeS5zaGFkb3dIb3N0O1xuICBpZiAoZW50cnkuaWQpIHBhdGhzLmRvbUlkID0gZW50cnkuaWQ7XG4gIGlmIChlbnRyeS50ZXN0SWQpIHBhdGhzLnRlc3RJZCA9IGVudHJ5LnRlc3RJZDtcbiAgaWYgKHR5cGVvZiBlbnRyeS5zZWxlY3Rvck1hdGNoQ291bnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICBwYXRocy5tYXRjaENvdW50ID0gZW50cnkuc2VsZWN0b3JNYXRjaENvdW50O1xuICB9XG4gIHJldHVybiBwYXRocztcbn07XG5cbi8vIOKUgOKUgOKUgCBGdWxsIHN0cnVjdHVyZWQgZm9ybSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gQnVpbGQgdGhlIGNvbXBsZXRlIG9iamVjdCBmb3IgT05FIGNhcHR1cmUuIEV2ZXJ5dGhpbmcgdGV4dHVhbCB0aGVcbi8vIHdvcmtzcGFjZSBleHBvcnQgd291bGQgY2FycnkgZm9yIHRoaXMgZWxlbWVudCwgd2l0aCBub3Rlcy9jb21tZW50c1xuLy8gaW5saW5lZC4gR3JvdXAgbWVtYmVycyByZWN1cnNlIHNvIGEgZ3JvdXBlZCBjYXB0dXJlIGlzIHNlbGYtY29udGFpbmVkLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVGdWxsID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcblxuICBjb25zdCBvdXQgPSB7XG4gICAga2luZDogXCJwaW5jaGdyYWIvY2FwdHVyZS1mdWxsXCIsXG4gICAgdjogMSxcbiAgfTtcbiAgaWYgKGVudHJ5LnVpZCkgb3V0LnVpZCA9IGVudHJ5LnVpZDtcbiAgaWYgKGVudHJ5Lm4gIT09IHVuZGVmaW5lZCkgb3V0Lm4gPSBlbnRyeS5uO1xuICBpZiAoZW50cnkudHMpIG91dC50cyA9IGVudHJ5LnRzO1xuICBpZiAoZW50cnkudXJsKSBvdXQudXJsID0gZW50cnkudXJsO1xuICBpZiAoZW50cnkudGFnKSBvdXQudGFnID0gZW50cnkudGFnO1xuXG4gIC8vIElkZW50aXR5IC8gYTExeSBuYW1pbmcuXG4gIGNvbnN0IGlkZW50aXR5ID0ge307XG4gIGlmIChlbnRyeS5yb2xlICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LnJvbGUgPSBlbnRyeS5yb2xlO1xuICBpZiAoZW50cnkuYWNjZXNzaWJsZU5hbWUgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuYWNjZXNzaWJsZU5hbWUgPSBlbnRyeS5hY2Nlc3NpYmxlTmFtZTtcbiAgaWYgKGVudHJ5LnRlc3RJZCAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmIChlbnRyeS5pZCAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5pZCA9IGVudHJ5LmlkO1xuICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeS5jbGFzc2VzKSAmJiBlbnRyeS5jbGFzc2VzLmxlbmd0aCkgaWRlbnRpdHkuY2xhc3NlcyA9IGVudHJ5LmNsYXNzZXM7XG4gIGlmIChPYmplY3Qua2V5cyhpZGVudGl0eSkubGVuZ3RoKSBvdXQuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxuICAvLyBQYXRocyDigJQgZXZlcnkgd2F5IHRvIGxvY2F0ZSB0aGUgZWxlbWVudC5cbiAgY29uc3QgcGF0aHMgPSBjb2xsZWN0UGF0aHMoZW50cnkpO1xuICBpZiAoT2JqZWN0LmtleXMocGF0aHMpLmxlbmd0aCkgb3V0LnBhdGhzID0gcGF0aHM7XG5cbiAgLy8gVGV4dCAvIGNvbnRlbnQuIFdlIGtlZXAgYWxsIHRleHR1YWwgc3VyZmFjZXMgc28gbm90aGluZyB0aGUgdXNlciBjYW5cbiAgLy8gc2VlIGlzIGxvc3Q6IHNvdXJjZSB0ZXh0LCB0aGUgQ1NTLXJlbmRlcmVkIGZvcm0sIGFuZCB0aGUgbWFya3VwLlxuICBjb25zdCBjb250ZW50ID0ge307XG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQudGV4dCA9IGVudHJ5LnRleHQ7XG4gIGlmIChlbnRyeS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgY29udGVudC5yZW5kZXJlZFRleHQgPSBlbnRyeS5yZW5kZXJlZFRleHQ7XG4gIGlmIChlbnRyeS52YWx1ZSAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnZhbHVlID0gZW50cnkudmFsdWU7XG4gIGlmIChlbnRyeS5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnBsYWNlaG9sZGVyID0gZW50cnkucGxhY2Vob2xkZXI7XG4gIGlmIChlbnRyeS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkgY29udGVudC5vdXRlckhUTUwgPSBlbnRyeS5vdXRlckhUTUw7XG4gIGlmIChPYmplY3Qua2V5cyhjb250ZW50KS5sZW5ndGgpIG91dC5jb250ZW50ID0gY29udGVudDtcblxuICAvLyBOb3RlcyAvIGNvbW1lbnRzIGF0dGFjaGVkIHRvIHRoaXMgY2FwdHVyZS5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkgb3V0LmNvbW1lbnRzID0gZmVlZGJhY2subWFwKHNsaW1Db21tZW50KTtcblxuICAvLyBSZW1haW5pbmcgc3RydWN0dXJlZCBtZXRhZGF0YSBhbiBhZ2VudCBtYXkgd2FudCDigJQgY29waWVkIHRocm91Z2hcbiAgLy8gdmVyYmF0aW0gc28gdGhpcyBleHBvcnQgaXMgYXMgY29tcGxldGUgYXMgdGhlIEpTT05MIHJvdy4gV2UgYWxsb3ctbGlzdFxuICAvLyB0aGUgaGVhdnkvc3RydWN0dXJlZCBmaWVsZHMgcmF0aGVyIHRoYW4gZHVtcGluZyB0aGUgd2hvbGUgRW50cnkgc28gdGhlXG4gIC8vIG91dHB1dCBvcmRlcmluZyBzdGF5cyBzdGFibGUgYW5kIG9idmlvdXMuXG4gIGNvbnN0IG1ldGEgPSB7fTtcbiAgY29uc3QgcGFzc3Rocm91Z2ggPSBbXG4gICAgXCJyZWN0XCIsIFwidmlld3BvcnRcIiwgXCJzdGF0ZXNcIiwgXCJhdHRyc1wiLCBcImhpbnRzXCIsIFwiY29tcG9uZW50XCIsIFwiZXZlbnRzXCIsXG4gICAgXCJiZWhhdmlvckF0dHJzXCIsIFwiYTExeVwiLCBcImFzc2V0c1wiLCBcImxheW91dENvbnRleHRcIiwgXCJzdHlsZXNcIixcbiAgICBcIm1hdGNoZWRSdWxlc1wiLCBcImFuY2VzdG9yc1wiLCBcInNjcmVlbnNob3RcIiwgXCJ0cnVuY2F0ZWRcIiwgXCJzZXNzaW9uSWRcIixcbiAgICBcImNhbnZhc0NsaWNrXCIsIFwiZWRpdG9yXCIsIFwiZG9tTXV0YXRpb25zXCIsIFwiaXNBbmltYXRpbmdcIixcbiAgXTtcbiAgZm9yIChjb25zdCBrZXkgb2YgcGFzc3Rocm91Z2gpIHtcbiAgICBpZiAoZW50cnlba2V5XSAhPT0gdW5kZWZpbmVkKSBtZXRhW2tleV0gPSBlbnRyeVtrZXldO1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhtZXRhKS5sZW5ndGgpIG91dC5tZXRhID0gbWV0YTtcblxuICAvLyBHcm91cCBtZW1iZXJzOiByZWN1cnNlIHNvIGVhY2ggY2hpbGQgY2FwdHVyZSBpcyBmdWxseSBzZXJpYWxpemVkIHRvby5cbiAgLy8gQSBtZW1iZXIgbWF5IGNhcnJ5IGl0cyBvd24gZmVlZGJhY2sgd2hlbiB0aGUgY2FsbGVyIHN1cHBsaWVzIGFcbiAgLy8ge2VudHJ5LCBmZWVkYmFja30gcGFpcjsgYmFyZSBjaGlsZCBFbnRyaWVzIHNlcmlhbGl6ZSB3aXRoIG5vIGNvbW1lbnRzLlxuICBpZiAobWVtYmVycy5sZW5ndGgpIHtcbiAgICBvdXQubWVtYmVycyA9IG1lbWJlcnMubWFwKChtKSA9PiBzZXJpYWxpemVDYXB0dXJlRnVsbChtLCBvcHRzKSk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gUHJldHR5IEpTT04gc3RyaW5nIGZvciB0aGUgXCJDb3B5IGNhcHR1cmUgYXMgSlNPTlwiIGJ1dHRvbi4gVHJhaWxpbmdcbi8vIG5ld2xpbmUgc28gaXQgcm91bmQtdHJpcHMgY2xlYW5seSB0aHJvdWdoIGVkaXRvcnMgLyBgcGJwYXN0ZWAuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplQ2FwdHVyZUpzb24gPSAoY2FwdHVyZSwgb3B0cyA9IHt9KSA9PlxuICBKU09OLnN0cmluZ2lmeShzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSwgbnVsbCwgMikgKyBcIlxcblwiO1xuXG4vLyDilIDilIDilIAgU2luZ2xlLWNhcHR1cmUgbWFya2Rvd24gZm9ybSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vXG4vLyBNYXRjaGVzIHRoZSB3b3Jrc3BhY2UgZXhwb3J0J3MgZW5nbGlzaC9tYXJrZG93biBzdXJmYWNlIGJ1dCBzY29wZWQgdG8gb25lXG4vLyBjYXB0dXJlLiBVc2VmdWwgd2hlbiB0aGUgdXNlciB3YW50cyB0byBwYXN0ZSBhIGh1bWFuLXJlYWRhYmxlIGNhcmQgcmF0aGVyXG4vLyB0aGFuIHJhdyBKU09OLlxuXG5jb25zdCBoZWFkaW5nID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IG5hbWUgPVxuICAgIGVudHJ5LmFjY2Vzc2libGVOYW1lIHx8XG4gICAgZW50cnkudGVzdElkIHx8XG4gICAgZW50cnkuaWQgfHxcbiAgICBlbnRyeS5zZWxlY3RvciB8fFxuICAgIGVudHJ5LnRhZyB8fFxuICAgIFwiY2FwdHVyZVwiO1xuICBjb25zdCBsYWJlbCA9IGVudHJ5Lm4gIT09IHVuZGVmaW5lZCA/IGBDYXB0dXJlICMke2VudHJ5Lm59YCA6IFwiQ2FwdHVyZVwiO1xuICByZXR1cm4gYCR7bGFiZWx9OiAke25hbWV9YDtcbn07XG5cbmNvbnN0IHJlbmRlclBhdGhzID0gKHBhdGhzKSA9PiB7XG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHBhdGhzKSkge1xuICAgIGxpbmVzLnB1c2goYC0gKioke2t9OioqIFxcYCR7dn1cXGBgKTtcbiAgfVxuICByZXR1cm4gbGluZXM7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplQ2FwdHVyZVRleHQgPSAoY2FwdHVyZSwgb3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzIH0gPSBub3JtYWxpemVDYXB0dXJlKGNhcHR1cmUpO1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBsaW5lcy5wdXNoKGAjICR7aGVhZGluZyhlbnRyeSl9YCwgXCJcIik7XG4gIGlmIChlbnRyeS51cmwpIGxpbmVzLnB1c2goYFBhZ2U6IDwke2VudHJ5LnVybH0+YCwgXCJcIik7XG4gIGlmIChlbnRyeS50YWcpIGxpbmVzLnB1c2goYEVsZW1lbnQ6IFxcYDwke2VudHJ5LnRhZ30+XFxgYCwgXCJcIik7XG5cbiAgY29uc3QgcGF0aHMgPSBjb2xsZWN0UGF0aHMoZW50cnkpO1xuICBpZiAoT2JqZWN0LmtleXMocGF0aHMpLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBQYXRoc1wiLCBcIlwiLCAuLi5yZW5kZXJQYXRocyhwYXRocykpO1xuICB9XG5cbiAgaWYgKGVudHJ5LnRleHQgIT09IHVuZGVmaW5lZCB8fCBlbnRyeS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBUZXh0XCIsIFwiXCIpO1xuICAgIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQpIGxpbmVzLnB1c2goYFNvdXJjZTogJHtKU09OLnN0cmluZ2lmeShlbnRyeS50ZXh0KX1gKTtcbiAgICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQgJiYgZW50cnkucmVuZGVyZWRUZXh0ICE9PSBlbnRyeS50ZXh0KSB7XG4gICAgICBsaW5lcy5wdXNoKGBSZW5kZXJlZDogJHtKU09OLnN0cmluZ2lmeShlbnRyeS5yZW5kZXJlZFRleHQpfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbnRyeS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBNYXJrdXBcIiwgXCJcIiwgXCJgYGBodG1sXCIsIGVudHJ5Lm91dGVySFRNTCwgXCJgYGBcIik7XG4gIH1cblxuICBpZiAoZmVlZGJhY2subGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIE5vdGVzICYgY29tbWVudHNcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBmYiBvZiBmZWVkYmFjaykge1xuICAgICAgY29uc3QgdGV4dCA9IHR5cGVvZiBmYi50ZXh0ID09PSBcInN0cmluZ1wiID8gZmIudGV4dCA6IFwiXCI7XG4gICAgICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShmYi50YWdzKSAmJiBmYi50YWdzLmxlbmd0aCA/IGAgXygke2ZiLnRhZ3Muam9pbihcIiwgXCIpfSlfYCA6IFwiXCI7XG4gICAgICBsaW5lcy5wdXNoKGAtICR7dGV4dH0ke3RhZ3N9YCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIEdyb3VwZWQgd2l0aFwiLCBcIlwiKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVtYmVycykge1xuICAgICAgY29uc3QgbWUgPSBub3JtYWxpemVDYXB0dXJlKG0pLmVudHJ5O1xuICAgICAgbGluZXMucHVzaChgLSAke2hlYWRpbmcobWUpfSDigJQgXFxgJHttZS5zZWxlY3RvciA/PyBtZS50YWcgPz8gXCI/XCJ9XFxgYCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzLmpvaW4oXCJcXG5cIikgKyBcIlxcblwiO1xufTtcbiIsCiAgICAiLy8gUGluY2hHcmFiIHNpZGUtcGFuZWwgVUkuIFJlY2VpdmVzIGNhcHR1cmVzICsgaG92ZXJzIGZyb20gdGhlIGNvbnRlbnRcbi8vIHNjcmlwdDsgcmVuZGVycyB0aGUgY2hhdC1idWJibGUgdGltZWxpbmUsIGV4cG9ydHMsIHZhbGlkYXRlcywgZXRjLlxuLy9cbi8vIERlY29tcG9zZWQgaW50byBzbWFsbCBmaWxlcyBmb3IgY2xhcml0eTpcbi8vICAg4oCiIHR5cGVzLnRzICAgICAg4oCUIHNoYXJlZCB0eXBlcywgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgbHVjaWRlLnRzICAgICDigJQgaWNvbiByZWdpc3RyeVxuLy8gICDigKIgdGhpcyBmaWxlICAgICDigJQgd2lyZS11cCAvIHJlbmRlcmluZyAvIGV4cG9ydCBidWlsZGVyc1xuLy9cbi8vIExvYWRlZCBhcyB0aGUgc2lkZSBwYW5lbCBwYWdlOiBjaHJvbWUuc2lkZVBhbmVsIGRlZmF1bHRfcGF0aC5cblxuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCwgQ3NUb1BhbmVsLCBFbnRyeSwgRXhwb3J0RGlhZ25vc3RpYywgRXhwb3J0TWFuaWZlc3QsIEZlZWRiYWNrTWVzc2FnZSwgUGFnZU1lc3NhZ2UsXG4gIFBhZ2VTbmFwc2hvdCwgUGFuZWxNZXNzYWdlLCBQYW5lbFRvQmcsIFBhbmVsVG9DcywgUGdFbnZlbG9wZSwgU2F2ZVJlcGx5LCBTZWxlY3Rvck1lc3NhZ2UsIFNob3RSZXBseSwgVmlld3BvcnQsXG59IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge1BHX0lDT05TfSBmcm9tICcuL2x1Y2lkZS50cyc7XG5pbXBvcnQge2J1aWxkVGFyLCB3cmFwWnN0ZCwgdHlwZSBUYXJFbnRyeX0gZnJvbSAnLi90YXIudHMnO1xuaW1wb3J0IHtURU1QTEFURVNfUFJFU0VOVH0gZnJvbSAnLi90ZW1wbGF0ZXMuZ2VuLnRzJztcbmltcG9ydCB7QlVORExFRF9TS0lMTFNfUFJFU0VOVCwgQlVORExFRF9TS0lMTF9GSUxFU30gZnJvbSAnLi9idW5kbGVkLXNraWxscy5nZW4udHMnO1xuaW1wb3J0IHtidWlsZEFnZW50UHJvbXB0SnNvbmwsIGJ1aWxkQWdlbnRQcm90b2NvbE1kLCB0eXBlIFNraWxsc0luZGV4fSBmcm9tICcuL2V4cG9ydC1hZ2VudC1wcm9tcHQubWpzJztcbmltcG9ydCB7c2VyaWFsaXplQ2FwdHVyZUpzb259IGZyb20gJy4vZXhwb3J0LWNhcHR1cmUubWpzJztcblxuKCgpID0+IHtcbiAgY29uc3QgTE9HID0gJ1tQaW5jaEdyYWIvc3BdJztcbiAgY29uc3QgUFJFRlNfU1RPUkFHRV9OQU1FID0gJ3BpbmNoZ3JhYi5wcmVmcy52Mic7XG4gIGNvbnN0IFdPUktTUEFDRVNfS0VZID0gJ3BpbmNoZ3JhYi53b3Jrc3BhY2VzLnYxJztcbiAgY29uc3QgaW5FeHRlbnNpb24gPSB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKGNocm9tZS5ydW50aW1lPy5pZCk7XG5cbiAgLy8g4pSA4pSA4pSAIFRlbXBsYXRlIHJlc291cmNlIGxvYWRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRWFybGllciB0aGUgdGVtcGxhdGVzIHdlcmUgYmFrZWQgYXMgc3RyaW5nIGNvbnN0YW50cyBpbnRvIHRoaXMgSUlGRVxuICAvLyAofjM2MEtCIGFjcm9zcyBERVNJR04gKyBTS0lMTCkuIFRoYXQgYmxvYXRlZCB0aGUgc2lkZXBhbmVsIGJ1bmRsZSB0b1xuICAvLyB+MS45NU1CIGFuZCBzbG93ZWQgZmlyc3Qtb3BlbiBwYXJzZSB0aW1lIG5vdGljZWFibHkuIFRoZXkgbm93IHNoaXAgYXNcbiAgLy8gc2VwYXJhdGUgYC5tZGAgZmlsZXMgdW5kZXIgYGV4dGVuc2lvbi90ZW1wbGF0ZXMvYCBhbmQgbG9hZCBvbiBkZW1hbmRcbiAgLy8gdmlhIGZldGNoIOKAlCB3aGVuIHRoZSB1c2VyIG9wZW5zIHRoZSBlZGl0b3IgbW9kYWwsIG9yIHdoZW4gdGhlIGV4cG9ydFxuICAvLyBwaXBlbGluZSBuZWVkcyB0byBidW5kbGUgYSBmYWxsYmFjay5cbiAgLy9cbiAgLy8gQ2FjaGUgcmVzdWx0cyBpbi1wcm9jZXNzIHNvIHJlcGVhdCByZWFkcyAobW9kYWwgb3BlbiDihpIgY2xvc2Ug4oaSIHJlb3BlbixcbiAgLy8gb3Igc2VxdWVudGlhbCBleHBvcnRzKSBkb24ndCByZS1mZXRjaC5cbiAgY29uc3QgdGVtcGxhdGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IFRFTVBMQVRFX0ZJTEVTID0ge1xuICAgIGRlc2lnblRlbXBsYXRlOiAnREVTSUdOLnRlbXBsYXRlLm1kJyxcbiAgICBza2lsbFRlbXBsYXRlOiAnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJyxcbiAgICBsb2NhbERlc2lnbjogJ2xvY2FsLkRFU0lHTi5tZCcsXG4gICAgbG9jYWxTa2lsbDogJ2xvY2FsLlNLSUxMLm1kJyxcbiAgfSBhcyBjb25zdDtcbiAgdHlwZSBUZW1wbGF0ZUtleSA9IGtleW9mIHR5cGVvZiBURU1QTEFURV9GSUxFUztcbiAgY29uc3QgdGVtcGxhdGVVcmwgPSAoZmlsZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAvLyBJbnNpZGUgdGhlIGV4dGVuc2lvbiwgdGhlIHNpZGVwYW5lbCBydW5zIGZyb21cbiAgICAvLyBjaHJvbWUtZXh0ZW5zaW9uOi8vPGlkPi9zaWRlcGFuZWwuaHRtbCwgc28gcmVzb3VyY2VzIHJlc29sdmUgdmlhXG4gICAgLy8gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMLiBUaGUgUGxheXdyaWdodCBzdGF0aWMtc2VydmVyIHRlc3RzIHNlcnZlXG4gICAgLy8gYC90ZW1wbGF0ZXMvPGZpbGU+YCBmcm9tIHRoZSBleHRlbnNpb24gcm9vdCBkaXJlY3RseSwgc28gYVxuICAgIC8vIHJlbGF0aXZlIFVSTCB3b3JrcyB0aGVyZSBhcyBhIGZhbGxiYWNrLlxuICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0VVJMKSB7XG4gICAgICByZXR1cm4gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKGB0ZW1wbGF0ZXMvJHtmaWxlfWApO1xuICAgIH1cbiAgICByZXR1cm4gYHRlbXBsYXRlcy8ke2ZpbGV9YDtcbiAgfTtcbiAgY29uc3QgbG9hZFRlbXBsYXRlID0gYXN5bmMgKGtleTogVGVtcGxhdGVLZXkpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmICghVEVNUExBVEVTX1BSRVNFTlRba2V5XSkgcmV0dXJuICcnO1xuICAgIGNvbnN0IGZpbGUgPSBURU1QTEFURV9GSUxFU1trZXldO1xuICAgIGNvbnN0IGNhY2hlZCA9IHRlbXBsYXRlQ2FjaGUuZ2V0KGZpbGUpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godGVtcGxhdGVVcmwoZmlsZSkpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgc3RhdHVzICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgdGV4dCk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csIGB0ZW1wbGF0ZSBmZXRjaCBmYWlsZWQ6ICR7ZmlsZX1gLCBlcnIpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgJycpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfTtcbiAgLy8gRWZmZWN0aXZlIGNvbnRlbnQgdXNlZCBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIGFuZCB0aGUgbW9kYWwuIFdoZW4gdGhlXG4gIC8vIHVzZXIgaGFzIGN1c3RvbWl6ZWQgdmlhIHRoZSB0ZXh0YXJlYS91cGxvYWQsIHRoYXQgd2luczsgb3RoZXJ3aXNlIHRoZVxuICAvLyBQTEFJTiBTVE9DSyB0ZW1wbGF0ZS4gVGhlIG9sZCBgbG9jYWwuKmAgZGV2LW92ZXJyaWRlIHByZWZlcmVuY2UgaXNcbiAgLy8gZ29uZSAob3BlcmF0b3IgcnVsaW5nIDIwMjYtMDctMTEpOiBpdCBzaWxlbnRseSBzdWJzdGl0dXRlZCB0aGVcbiAgLy8gZGV2ZWxvcGVyJ3Mgb3duIGJyYW5kIGZpbGVzIGFzIHRoZSBcImRlZmF1bHRcIiwgY29udGFtaW5hdGluZyBleHBvcnRzXG4gIC8vIHRoYXQgdGhlIG1hbmlmZXN0IHN0aWxsIGZsYWdnZWQgYXMgYnVuZGxlZC1kZWZhdWx0IGNvbnRlbnQuXG4gIGNvbnN0IHJlc29sdmVEZXNpZ25Db250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLmRlc2lnbk1kICYmIHByZWZzLmRlc2lnbk1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLmRlc2lnbk1kO1xuICAgIHJldHVybiBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJyk7XG4gIH07XG4gIGNvbnN0IHJlc29sdmVTa2lsbENvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuc2tpbGxNZCAmJiBwcmVmcy5za2lsbE1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLnNraWxsTWQ7XG4gICAgcmV0dXJuIGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpO1xuICB9O1xuICAvLyBUcnVlIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oaSIHByZWZzLntkZXNpZ25NZHxza2lsbE1kfSBpc1xuICAvLyBlbXB0eSBhbmQgd2UncmUgZmFsbGluZyBiYWNrIHRvIGEgYnVuZGxlZCB0ZW1wbGF0ZS9sb2NhbCByZXNvdXJjZS5cbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlRGVzaWduID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLmRlc2lnbk1kIHx8ICFwcmVmcy5kZXNpZ25NZC50cmltKCk7XG4gIGNvbnN0IGlzVXNpbmdUZW1wbGF0ZVNraWxsID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLnNraWxsTWQgfHwgIXByZWZzLnNraWxsTWQudHJpbSgpO1xuXG4gIC8vIFZlbmRvcmVkIHRoaXJkLXBhcnR5IHNraWxsIHJlc291cmNlcyAoaW1wZWNjYWJsZSByZWZlcmVuY2Ugc2V0ICtcbiAgLy8gcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24pLCBzaGlwcGVkIHVuZGVyIGV4dGVuc2lvbi9za2lsbHMvIGJ5IHRoZSBidWlsZFxuICAvLyBhbmQgaW5saW5lZCBpbnRvIGJ1bmRsZSBleHBvcnRzLiBTYW1lIGxhenkgZmV0Y2ggKyBjYWNoZSBwYXR0ZXJuIGFzIHRoZVxuICAvLyB0ZW1wbGF0ZXMgYWJvdmUuXG4gIGNvbnN0IGJ1bmRsZWRTa2lsbENhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgbG9hZEJ1bmRsZWRTa2lsbEZpbGUgPSBhc3luYyAoZXh0UGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiA9PiB7XG4gICAgY29uc3QgY2FjaGVkID0gYnVuZGxlZFNraWxsQ2FjaGUuZ2V0KGV4dFBhdGgpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdXJsID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCA/IGNocm9tZS5ydW50aW1lLmdldFVSTChleHRQYXRoKSA6IGV4dFBhdGg7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgc3RhdHVzICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgYnVuZGxlZFNraWxsQ2FjaGUuc2V0KGV4dFBhdGgsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgYnVuZGxlZCBza2lsbCBmZXRjaCBmYWlsZWQ6ICR7ZXh0UGF0aH1gLCBlcnIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdG9yYWdlIGFkYXB0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IFN0b3JlID0ge1xuICAgIGFzeW5jIGdldDxUPihrZXk6IHN0cmluZywgZmFsbGJhY2s6IFQpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgY29uc3QgbyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXkpOyByZXR1cm4gKG9ba2V5XSBhcyBUKSA/PyBmYWxsYmFjazsgfVxuICAgICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgICAgfVxuICAgICAgdHJ5IHsgY29uc3QgciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7IHJldHVybiByID09PSBudWxsID8gZmFsbGJhY2sgOiAoSlNPTi5wYXJzZShyKSBhcyBUKTsgfVxuICAgICAgY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbiAgICB9LFxuICAgIGFzeW5jIHNldChrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtba2V5XTogdmFsdWV9KTsgcmV0dXJuOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIH1cbiAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSxcbiAgfTtcblxuICAvLyDilIDilIDilIAgRE9NIHJlZnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0ICQgPSA8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oczogc3RyaW5nKTogVCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHMpIGFzIFQ7XG4gIGNvbnN0IGxpc3QgPSAkKCdbZGF0YS1saXN0XScpO1xuICBjb25zdCBjb21wb3NlciA9ICQ8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLWNvbXBvc2VyXScpO1xuICBjb25zdCBzdGF0dXMgPSAkKCdbZGF0YS1zdGF0dXNdJyk7XG4gIGNvbnN0IHNlYXJjaCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNlYXJjaF0nKTtcbiAgLy8gQ3RybCtGIHZpc3VhbC1maW5kIGJhciAoZGlzdGluY3QgZnJvbSB0aGUgaGVhZGVyIHNlYXJjaCwgd2hpY2ggb3BlbnMgdGhlXG4gIC8vIGNvbW1hbmQgcGFsZXR0ZSkuIE1heSBiZSBhYnNlbnQgaW4gdmVyeSBvbGQgY2FjaGVkIG1hcmt1cCwgc28gY29uc3VtZXJzXG4gIC8vIG51bGwtZ3VhcmQuXG4gIGNvbnN0IGZpbmRCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZmluZC1iYXJdJyk7XG4gIGNvbnN0IGZpbmRJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLWZpbmRdJyk7XG4gIGNvbnN0IGZpbmRDb3VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1maW5kLWNvdW50XScpO1xuICAvLyBDYW5vbmljYWxpemUga2V5Ym9hcmQtc2hvcnRjdXQgcGlsbHMgcGVyIHBsYXRmb3JtLiBFdmVyeSBzaG9ydGN1dCBwaWxsXG4gIC8vIGlzIGF1dGhvcmVkIGluIHRoZSBjYW5vbmljYWwgQ21kLWZvcm0gKGVhY2ggdG9rZW4gY2FwaXRhbGl6ZWQsIGpvaW5lZFxuICAvLyB3aXRoICcrJzogQWx0K0NsaWNrLCBDbWQrSywgQ21kK1NoaWZ0K1opOyBvbiBub24tTWFjIHdlIHN3YXAgdGhlIGxlYWRpbmdcbiAgLy8gQ21kIG1vZGlmaWVyIGZvciBDdHJsLiBQaWxscyBvcHQgaW4gdmlhIGRhdGEtbW9kLSogc28gYSBzdHJpbmcgbGlrZSB0aGVcbiAgLy8gJ0FsdCvigKYnIHBpbGxzICh3aGljaCBuZXZlciBjYXJyeSBDbWQpIGFyZSBsZWZ0IHVudG91Y2hlZC5cbiAgY29uc3QgaXNNYWMgPSAvTWFjfGlQaG9uZXxpUGFkL2kudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0gfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJyk7XG4gIGlmICghaXNNYWMpIHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdrYmRbZGF0YS1tb2Qta10sIGtiZFtkYXRhLW1vZC16XSwga2JkW2RhdGEtbW9kLXNoaWZ0LXpdJykpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gKGVsLnRleHRDb250ZW50ID8/ICcnKS5yZXBsYWNlKC9eQ21kXFxiLywgJ0N0cmwnKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaW1wb3J0RmlsZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJyNpbXBvcnQtZmlsZScpO1xuICBjb25zdCBzdGF0c0VsID0gJCgnW2RhdGEtc3RhdHNdJyk7XG4gIGNvbnN0IHN0YXJzRWwgPSAkKCdbZGF0YS1zdGFyc10nKTtcbiAgY29uc3QgdG9vbHRpcEVsID0gJCgnW2RhdGEtdG9vbHRpcF0nKTtcbiAgY29uc3QgZHJpbGxkb3duRWwgPSAkKCdbZGF0YS1kcmlsbGRvd25dJyk7XG4gIGNvbnN0IGRyYXdlciA9ICQoJ1tkYXRhLWRyYXdlcl0nKTtcbiAgY29uc3QgcGFsZXR0ZSA9ICQoJ1tkYXRhLXBhbGV0dGVdJyk7XG4gIGNvbnN0IHBhbGV0dGVJbnB1dCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXBhbGV0dGUtaW5wdXRdJyk7XG4gIGNvbnN0IHBhbGV0dGVMaXN0ID0gJCgnW2RhdGEtcGFsZXR0ZS1saXN0XScpO1xuICBjb25zdCBjb21wV29yZHMgPSAkKCdbZGF0YS1jb21wLXdvcmRzXScpO1xuICBjb25zdCBjb21wVG9rZW5zID0gJCgnW2RhdGEtY29tcC10b2tlbnNdJyk7XG4gIGNvbnN0IHN0YXRUb2tlbnMgPSAkKCdbZGF0YS1zdGF0LXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFdvcmRzID0gJCgnW2RhdGEtc3RhdC13b3Jkc10nKTtcbiAgY29uc3Qgd3NTZWxlY3QgPSAkPEhUTUxTZWxlY3RFbGVtZW50PignW2RhdGEtd29ya3NwYWNlXScpO1xuICBjb25zdCB3c0xpc3QgPSAkKCdbZGF0YS13cy1saXN0XScpO1xuICBjb25zdCB3c05hbWUgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS13cy1uYW1lXScpO1xuXG4gIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdDogUGFyZW50Tm9kZSA9IGRvY3VtZW50KTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBlbCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1pY29uXScpKSB7XG4gICAgICBjb25zdCBuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWljb24nKTtcbiAgICAgIGNvbnN0IHNpemUgPSBOdW1iZXIoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNpemUnKSA/PyAxNik7XG4gICAgICBpZiAobmFtZSAmJiBQR19JQ09OUy5oYXMobmFtZSkpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgICB9XG4gIH07XG4gIG1vdW50SWNvbnMoKTtcblxuICAvLyDilIDilIDilIAgU3RhdGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgUHJlZnMgPSB7XG4gICAgaW5jbHVkZU91dGVySFRNTDogYm9vbGVhbjtcbiAgICBpbmNsdWRlTWF0Y2hlZFJ1bGVzOiBib29sZWFuO1xuICAgIGluY2x1ZGVTdHlsZXM6IGJvb2xlYW47XG4gICAgbWluaWZ5OiBib29sZWFuO1xuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IGJvb2xlYW47XG4gICAgdXNlU2NyZWVuc2hvdHM6IGJvb2xlYW47XG4gICAgc3BhY2luZ092ZXJsYXk6IGJvb2xlYW47XG4gICAgaG92ZXJTbmFwOiBib29sZWFuO1xuICAgIGF1dG9TY3JlZW5zaG90OiBib29sZWFuO1xuICAgIC8vIENvbW1hLXNlcGFyYXRlZCBob3N0IHBhdHRlcm5zIChzdWJzdHJpbmcgbWF0Y2gpLiBIb3N0cyBpbiB0aGlzIGxpc3RcbiAgICAvLyBza2lwIHRoZSBlbnRpcmUgc2NyZWVuc2hvdCBwaXBlbGluZSDigJQgdXNlZnVsIGZvciBzZW5zaXRpdmUgcGFnZXNcbiAgICAvLyAoYmFua2luZywgaW50ZXJuYWwgYWRtaW4pIHdoZXJlIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCBQTkdzIGxhbmRpbmdcbiAgICAvLyBvbiBkaXNrLlxuICAgIHNraXBTY3JlZW5zaG90SG9zdHM6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgREVTSUdOLm1kIGNvbnRlbnQgdGhlIHVzZXIgcGFzdGVkIG9yIHVwbG9hZGVkIHZpYSB0aGUgc2lkZVxuICAgIC8vIHBhbmVsIHNldHRpbmdzLiBEZWZhdWx0cyB0byBhIHRlbXBsYXRlZCBwbGFjZWhvbGRlciBzbyBvdXQtb2YtdGhlLVxuICAgIC8vIGJveCBleHBvcnRzIGFsd2F5cyBpbmNsdWRlIGEgREVTSUdOLm1kIOKAlCB0aGUgY29uc3VtZXIgTExNIGNhblxuICAgIC8vIGVpdGhlciB3b3JrIGZyb20gdGhlIHBsYWNlaG9sZGVyIChhbmQgYXNrIGZvciB0aGUgcmVhbCBvbmUpIG9yXG4gICAgLy8gZnJvbSBhIHVzZXItY3VzdG9taXplZCBjb3B5LiBUaGUgc2V0dGluZ3MgVUkgZmxhZ3MgdGhpcyBiYW5uZXItXG4gICAgLy8gc3R5bGUgd2hlbiB0aGUgdmFsdWUgc3RpbGwgbWF0Y2hlcyB0aGUgdGVtcGxhdGUgc28gdGhlIHVzZXJcbiAgICAvLyBrbm93cyB0byBmaWxsIGl0IGluLlxuICAgIGRlc2lnbk1kOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCB0aGUgcmVjZWl2ZXIgc2hvdWxkIHJlYWQgREVTSUdOLm1kIGZyb20uIERlZmF1bHRzXG4gICAgLy8gdG8gYH4vLmFnZW50cy9ERVNJR04ubWRgOyB1c2VyIGNhbiBvdmVycmlkZSBwZXItbWFjaGluZS5cbiAgICBkZXNpZ25QYXRoOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCBvZiB0aGUgUGluY2hHcmFiIFVJIHNraWxsIG9uIHRoZSByZWNlaXZlcidzXG4gICAgLy8gZmlsZXN5c3RlbS4gVGhlIHNraWxsIGNvbnRlbnQgaXRzZWxmIGlzIGJ1bmRsZWQgaW5saW5lIGludG8gdGhlXG4gICAgLy8gYXJjaGl2ZSAoc2VlIGBza2lsbE1kYCksIHNvIHRoaXMgaXMgYSBoaW50IGZvciByZWNlaXZlcnMgdGhhdFxuICAgIC8vIHdhbnQgdG8gcGVyc2lzdCB0aGUgc2tpbGwgYXQgYSBjYW5vbmljYWwgbG9jYXRpb24uXG4gICAgc2tpbGxQYXRoOiBzdHJpbmc7XG4gICAgLy8gSW5saW5lIFVJLXNraWxsIGNvbnRlbnQuIERlZmF1bHQgaXMgdGhlIGJ1bmRsZWQgUGluY2hHcmFiIHRyaWFnZVxuICAgIC8vIHNraWxsIHRlbXBsYXRlOyB1c2VyIGNhbiBjdXN0b21pemUgdmlhIHNldHRpbmdzIHBhc3RlL3VwbG9hZC5cbiAgICAvLyBCdW5kbGVkIGludG8gdGhlIGFyY2hpdmUgYXQgYC4vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYC5cbiAgICBza2lsbE1kOiBzdHJpbmc7XG4gICAgLy8gV2hlbiB0cnVlLCBmaXJlIGEgZnJlc2ggcGFnZSBzY3JlZW5zaG90IG9uIEVWRVJZIGNhcHR1cmUgcmF0aGVyXG4gICAgLy8gdGhhbiBvbmNlIHBlciAod29ya3NwYWNlLCB1cmwpIHR1cGxlLiBVc2VmdWwgZm9yIGNhcHR1cmluZyBhXG4gICAgLy8gbXVsdGktc3RlcCBmbG93IHdoZXJlIHRoZSBwYWdlIHN0YXRlIGNoYW5nZXMgYmV0d2VlbiBjYXB0dXJlcy5cbiAgICAvLyBEZWZhdWx0IGZhbHNlIOKAlCBtb3N0IHVzZXJzIHdhbnQgdGhlIGRlZmF1bHQgZmlyc3Qtb25seSBiZWhhdmlvclxuICAgIC8vIHNpbmNlIHBhZ2Ugc2NyZWVuc2hvdHMgYXJlIGxhcmdlIGFuZCB0aGUgZmlyc3Qgb25lIGFscmVhZHkgZ2l2ZXNcbiAgICAvLyBhIHNlc3Npb24tbGV2ZWwgcmVmZXJlbmNlLlxuICAgIHBhZ2VTaG90UGVyQ2FwdHVyZTogYm9vbGVhbjtcbiAgICAvLyBTdXBwcmVzcyBDaHJvbWUncyBkb3dubG9hZCBidWJibGUgd2hpbGUgUGluY2hHcmFiIHdyaXRlcyBpdHMgb3duXG4gICAgLy8gZmlsZXMgKHNjcmVlbnNob3RzICsgZXhwb3J0cykuIFJlcXVpcmVzIHRoZSBvcHRpb25hbCBgZG93bmxvYWRzLnVpYFxuICAgIC8vIHBlcm1pc3Npb24uIERlZmF1bHQgT04gYXMgaW50ZW50OyB1bnRpbCB0aGUgcGVybWlzc2lvbiBpcyBhY3R1YWxseVxuICAgIC8vIGdyYW50ZWQgKG5lZWRzIGEgdXNlciBnZXN0dXJlIOKAlCB0aGUgbnVkZ2UgYmFubmVyIG9yIHRoZSBzZXR0aW5nc1xuICAgIC8vIGNoZWNrYm94KSwgc2F2ZXMgc3RheSB2aXNpYmxlLlxuICAgIHF1aWV0U2F2ZXM6IGJvb2xlYW47XG4gICAgLy8gVGhlIHVzZXIgZGlzbWlzc2VkIHRoZSBxdWlldC1zYXZlcyBudWRnZSBiYW5uZXIg4oCUIG5ldmVyIHJlLXNob3cgaXQuXG4gICAgcXVpZXROdWRnZURpc21pc3NlZDogYm9vbGVhbjtcbiAgICAvLyBCdW5kbGUgdGhlIHZlbmRvcmVkIHRoaXJkLXBhcnR5IGRlc2lnbiBza2lsbHMgKGltcGVjY2FibGUgcmVmZXJlbmNlXG4gICAgLy8gc2V0ICsgcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24pIHBsdXMgc2tpbGxzLWluZGV4Lmpzb24gaW50byBhcmNoaXZlXG4gICAgLy8gZXhwb3J0cy4gT24gYnkgZGVmYXVsdDogdGhlIFNlbmQtdG8tQWdlbnQgcHJvdG9jb2wncyBza2lsbC1tYXBwaW5nXG4gICAgLy8gcGhhc2UgYXNzdW1lcyB0aGVpciBwcmVzZW5jZS4gfjEuMiBNQiBvZiBtYXJrZG93biBwZXIgYnVuZGxlLlxuICAgIGJ1bmRsZVNraWxsczogYm9vbGVhbjtcbiAgICAvLyBCdW5kbGUgdGhlIGZ1bGwgc2VyaWFsaXplZCBIVE1MIG9mIGVhY2ggY2FwdHVyZWQgcGFnZSB1bmRlciBwYWdlcy8uXG4gICAgLy8gT2ZmIGJ5IGRlZmF1bHQgKGRvY3VtZW50cyBjYW4gYmUgaHVnZSk7IGNvbGxlY3RlZCBsYXppbHkgYXQgZXhwb3J0XG4gICAgLy8gdGltZSBmcm9tIGxpdmUgdGFicywgbmV2ZXIgcGVyc2lzdGVkIHRvIGNocm9tZS5zdG9yYWdlLlxuICAgIGluY2x1ZGVQYWdlSFRNTDogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgREVGQVVMVF9QUkVGUzogUHJlZnMgPSB7XG4gICAgaW5jbHVkZU91dGVySFRNTDogdHJ1ZSxcbiAgICBpbmNsdWRlTWF0Y2hlZFJ1bGVzOiB0cnVlLFxuICAgIGluY2x1ZGVTdHlsZXM6IHRydWUsXG4gICAgLy8gRGVmYXVsdCB0byBtaW5pZmllZCBleHBvcnRzIOKAlCBtb3N0IGFnZW50cyB3YW50IHRoZSBzbWFsbGVzdFxuICAgIC8vIHRva2VuLWZvb3RwcmludCBwYXlsb2FkLiBFeGlzdGluZyB1c2Vycycgc2F2ZWQgcHJlZnMgYXJlIG1lcmdlZCBvdmVyXG4gICAgLy8gdGhpcyBkZWZhdWx0IGluIGxvYWRBbGwoKSwgc28gb25seSBORVcvdW5zZXQgaW5zdGFsbHMgc2VlIHRoZSBmbGlwLlxuICAgIG1pbmlmeTogdHJ1ZSxcbiAgICBhdXRvU2Nyb2xsVG9Ib3ZlcmVkOiB0cnVlLFxuICAgIHVzZVNjcmVlbnNob3RzOiB0cnVlLFxuICAgIHNwYWNpbmdPdmVybGF5OiBmYWxzZSxcbiAgICBob3ZlclNuYXA6IHRydWUsXG4gICAgYXV0b1NjcmVlbnNob3Q6IHRydWUsXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogJycsXG4gICAgLy8gZGVzaWduTWQgLyBza2lsbE1kIGRlZmF1bHQgdG8gJycgd2hpY2ggdGhlIHJlc29sdmVyIHRyZWF0cyBhc1xuICAgIC8vIFwiZmFsbCBiYWNrIHRvIHRoZSBidW5kbGVkIHRlbXBsYXRlIGF0IGV4cG9ydCB0aW1lXCIuIFN0b3JpbmcgdGhlXG4gICAgLy8gZW1wdHkgc3RyaW5nIGtlZXBzIGNocm9tZS5zdG9yYWdlIHNtYWxsIGFuZCBsZXRzIGBpc1VzaW5nVGVtcGxhdGUqYFxuICAgIC8vIGJlIGEgY2hlYXAgc3luY2hyb25vdXMgY2hlY2suXG4gICAgZGVzaWduTWQ6ICcnLFxuICAgIGRlc2lnblBhdGg6ICd+Ly5hZ2VudHMvREVTSUdOLm1kJyxcbiAgICBza2lsbFBhdGg6ICd+Ly5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCcsXG4gICAgc2tpbGxNZDogJycsXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBmYWxzZSxcbiAgICBxdWlldFNhdmVzOiB0cnVlLFxuICAgIHF1aWV0TnVkZ2VEaXNtaXNzZWQ6IGZhbHNlLFxuICAgIGJ1bmRsZVNraWxsczogdHJ1ZSxcbiAgICBpbmNsdWRlUGFnZUhUTUw6IGZhbHNlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nOyB0YWJJZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ307XG4gIC8vIE9uZSBhcmNoaXZlZCBzdGF0ZSBvZiBhIHdvcmtzcGFjZSAoY2FwdHVyZWQganVzdCBiZWZvcmUgYSBDbGVhci1hbGwpLlxuICAvLyBgc2hvdHNgIGlzIHRoZSB0aHVtYm5haWwgbWFwIChmdWxsLXJlcyBQTkdzIGFyZSBzZXNzaW9uLW9ubHkgYW5kIG5vdFxuICAvLyBhcmNoaXZlZCkuIFJlc3RvcmFibGUgZnJvbSBTZXR0aW5ncyDihpIgV29ya3NwYWNlcy5cbiAgdHlwZSBXb3Jrc3BhY2VTbmFwc2hvdCA9IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHRzOiBzdHJpbmc7XG4gICAgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdO1xuICAgIHNob3RzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGNvbW1lbnRzOiBudW1iZXI7XG4gIH07XG5cbiAgbGV0IG1lc3NhZ2VzOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICBsZXQgbGl2ZVRhYlVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsaXZlVGFiUGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHNlbGVjdG9yVmFsaWRpdHkgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbiB8ICdkaWZmLXBhZ2UnPigpO1xuICBjb25zdCBzZWxlY3RvckVycm9ycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGluc2VydEJlZm9yZToge2N1cnJlbnQ6IHN0cmluZyB8IG51bGw7IGNvbW1lbnQ6IGJvb2xlYW59ID0ge2N1cnJlbnQ6IG51bGwsIGNvbW1lbnQ6IGZhbHNlfTtcbiAgbGV0IHNlYXJjaFF1ZXJ5ID0gJyc7XG4gIGxldCBsYXN0QWN0aXZlU2VsZWN0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgc3RpY2t5VGltZXIgPSAwO1xuICBsZXQgU1RJQ0tZX1RUTF9NUyA9IDVfMDAwO1xuICBsZXQgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gIGxldCBwaGFudG9tVGFyZ2V0OiB7c2VsZWN0b3I6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgdGFnPzogc3RyaW5nOyByZWN0PzogRE9NUmVjdH0gfCBudWxsID0gbnVsbDtcbiAgbGV0IHBlbmRpbmdNdWx0aTogRW50cnlbXSA9IFtdO1xuICBjb25zdCBzaG90cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCBwZXIgc2VsZWN0b3IuIE5PVCBwZXJzaXN0ZWQgdG9cbiAgLy8gY2hyb21lLnN0b3JhZ2UgKGNhcCBwcmVzc3VyZSDigJQgMTAwIGNhcHR1cmVzIMOXIDgwIEtCIGVhY2ggPSA4IE1CKSwgc29cbiAgLy8gaXQncyBvbmx5IGF2YWlsYWJsZSBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbidzIGFyY2hpdmUgZXhwb3J0LiBDbGVhcmVkXG4gIC8vIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGNvbnN0IHNob3RzRnVsbCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIFRyYWNrIHdoaWNoICh3b3Jrc3BhY2UsIHBhZ2UtdXJsKSB0dXBsZXMgYWxyZWFkeSBmaXJlZCBhIHBhZ2Ugc2hvdCBzbyB3ZVxuICAvLyBkb24ndCByZS1zaG9vdCB0aGUgZW50aXJlIHBhZ2Ugb24gZXZlcnkgY2FwdHVyZS4gUmVzZXQgb24gd29ya3NwYWNlXG4gIC8vIHN3aXRjaCDigJQgbm8gZGF5IGtleSwgdGhlIGRlZHVwZSBpcyBwZXItc2Vzc2lvbi5cbiAgY29uc3QgcGFnZVNob3RzRmlyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcGFnZVNob3RLZXkgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4gYCR7YWN0aXZlV3N9OiR7dXJsfWA7XG4gIC8vIExhc3Qgc3VjY2Vzc2Z1bCBleHBvcnQg4oCUIGJvdGggdGhlIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChzaG93biB0byB0aGVcbiAgLy8gdXNlcikgYW5kIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIChjb3BpZWQgYnkgdGhlIFwiQ29weSBhcyBwYXRoXCIgYnV0dG9uKS5cbiAgLy8gVXBkYXRlZCBvbiBKU09OTC9NRC9aSVAvc2NyZWVuc2hvdCBzYXZlcy5cbiAgY29uc3QgbGFzdEV4cG9ydDoge3JlbFBhdGg6IHN0cmluZyB8IG51bGw7IGFic1BhdGg6IHN0cmluZyB8IG51bGw7IGNvcHlQYXRoOiBzdHJpbmcgfCBudWxsOyB0ZW1wUGF0aDogYm9vbGVhbjsga2luZDogc3RyaW5nIHwgbnVsbDsgYWdlbnRQcm9tcHQ6IHN0cmluZyB8IG51bGx9ID0ge1xuICAgIHJlbFBhdGg6IG51bGwsIGFic1BhdGg6IG51bGwsIGNvcHlQYXRoOiBudWxsLCB0ZW1wUGF0aDogZmFsc2UsIGtpbmQ6IG51bGwsIGFnZW50UHJvbXB0OiBudWxsLFxuICB9O1xuICBsZXQgd29ya3NwYWNlczogV29ya3NwYWNlW10gPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgbGV0IGFjdGl2ZVdzID0gJ2RlZmF1bHQnO1xuICAvLyBTZXNzaW9uIHV1aWQg4oCUIGdlbmVyYXRlZCBvbmNlIHBlciB3b3Jrc3BhY2UgYm9vdC4gR29lcyBvbnRvIGV2ZXJ5XG4gIC8vIHBhZ2Ugcm93IGFuZCBldmVyeSBzZWxlY3RvciBlbnRyeSBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzXG4gIC8vIHRvIFwid2hpY2ggc2Vzc2lvbj9cIiB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS4gU3RhYmxlIGFjcm9zcyBhXG4gIC8vIHNpbmdsZSB3b3Jrc3BhY2UgbG9hZDsgcmVzZXRzIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGxldCBzZXNzaW9uSWQ6IHN0cmluZyA9ICcnO1xuICBjb25zdCB3c01zZ0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259Lm1lc3NhZ2VzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzLnYxYDtcbiAgLy8gUGVyc2lzdGVudCBzbmFwc2hvdCBoaXN0b3J5IHBlciB3b3Jrc3BhY2Ug4oCUIGEgQ2xlYXItYWxsIGFyY2hpdmVzIHRoZSB3aXBlZFxuICAvLyBjYXB0dXJlcytjb21tZW50cyt0aHVtYm5haWxzIGhlcmUgc28gdGhleSBjYW4gYmUgcmVzdG9yZWQgbGF0ZXIgZnJvbVxuICAvLyBTZXR0aW5ncyDihpIgV29ya3NwYWNlcy4gTGl2ZXMgaW4gdGhlIHNhbWUgY2hyb21lLnN0b3JhZ2UgbGF5ZXIgYXMgdGhlIHJlc3RcbiAgLy8gb2YgdGhlIHdvcmtzcGFjZSBkYXRhLlxuICBjb25zdCB3c1NuYXBzaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNuYXBzaG90cy52MWA7XG4gIC8vIENhcCBzbyB0aGUgaGlzdG9yeSBjYW4ndCBiYWxsb29uIHN0b3JhZ2U7IG9sZGVzdCBzbmFwc2hvdHMgZHJvcCBvZmYuXG4gIGNvbnN0IFdTX1NOQVBTSE9UX0NBUCA9IDEwO1xuICBjb25zdCB3c1Nob3RzRnVsbEtleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzRnVsbC52MWA7XG4gIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGhhcyBhIDEwIE1CIGRlZmF1bHQgcXVvdGE7IHdlIGJ1ZGdldCBoYWxmIG9mXG4gIC8vIHRoYXQgZm9yIGZ1bGwtcmVzb2x1dGlvbiBQTkdzICh0aGUgcmVzdCBpcyBtZXNzYWdlcywgcHJlZnMsIHRodW1icykuXG4gIC8vIFdoZW4gdGhlIGJ1ZGdldCBpcyByZWFjaGVkIHdlIEZJRk8tZXZpY3QgdGhlIG9sZGVzdCBlbnRyaWVzIChNYXBcbiAgLy8gcHJlc2VydmVzIGluc2VydGlvbiBvcmRlcikuIEVzdGltYXRlIGRhdGFVUkwgc2l6ZSA9IHN0cmluZyBsZW5ndGguXG4gIGNvbnN0IFNIT1RTX0ZVTExfQlVER0VUX0JZVEVTID0gNSAqIDEwMjQgKiAxMDI0O1xuICBjb25zdCB1bmRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHJlZG9TdGFjazogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgVU5ET19DQVAgPSAzMDtcbiAgbGV0IHN1c3BlbmRTbmFwc2hvdHMgPSBmYWxzZTtcbiAgbGV0IHByZWZzOiBQcmVmcyA9IHsuLi5ERUZBVUxUX1BSRUZTfTtcblxuICAvLyDilIDilIDilIAgU3RhdHVzIGhlbHBlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHN0YXR1c1RpbWVyID0gMDtcbiAgY29uc3Qgc2V0U3RhdHVzID0gKG1zZzogc3RyaW5nLCBvcHRzOiB7a2luZD86ICd3YXJuJyB8ICdpbmZvJyB8ICdvayd9ID0ge30pOiB2b2lkID0+IHtcbiAgICBzdGF0dXMudGV4dENvbnRlbnQgPSBtc2cgfHwgJyc7XG4gICAgY2xlYXJUaW1lb3V0KHN0YXR1c1RpbWVyKTtcbiAgICBpZiAobXNnKSB7XG4gICAgICBzdGF0dXMuc3R5bGUuY29sb3IgPSBvcHRzLmtpbmQgPT09ICd3YXJuJyA/ICd2YXIoLS1yZWQpJyA6XG4gICAgICAgIG9wdHMua2luZCA9PT0gJ2luZm8nID8gJ3ZhcigtLXRleHQtMyknIDogJ3ZhcigtLWdyZWVuKSc7XG4gICAgICBzdGF0dXNUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7IH0sIDIyMDApO1xuICAgIH1cbiAgfTtcbiAgbGV0IHRvYXN0VGltZXIgPSAwO1xuICBjb25zdCBzaG93VG9hc3QgPSAodGl0bGU6IHN0cmluZywgZGV0YWlsID0gJycsIGtpbmQ6ICdvaycgfCAnd2FybicgPSAnb2snKTogdm9pZCA9PiB7XG4gICAgbGV0IHRvYXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWNvcHktdG9hc3RdJyk7XG4gICAgaWYgKCF0b2FzdCkge1xuICAgICAgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRvYXN0LmNsYXNzTmFtZSA9ICdjb3B5LXRvYXN0JztcbiAgICAgIHRvYXN0LmRhdGFzZXQuY29weVRvYXN0ID0gJ3RydWUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodG9hc3QpO1xuICAgIH1cbiAgICB0b2FzdC5jbGFzc0xpc3QudG9nZ2xlKCd3YXJuJywga2luZCA9PT0gJ3dhcm4nKTtcbiAgICB0b2FzdC5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJjb3B5LXRvYXN0LWljb25cIj4ke1BHX0lDT05TLnN2Z1N0cmluZyhraW5kID09PSAnd2FybicgPyAnYWxlcnQtY2lyY2xlJyA6ICdjaXJjbGUtY2hlY2snLCAyMil9PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjb3B5LXRvYXN0LXRleHRcIj48Yj4ke2VzY2FwZUh0bWwodGl0bGUpfTwvYj4ke2RldGFpbCA/IGA8c21hbGw+JHtlc2NhcGVIdG1sKGRldGFpbCl9PC9zbWFsbD5gIDogJyd9PC9zcGFuPmA7XG4gICAgdG9hc3QuaGlkZGVuID0gZmFsc2U7XG4gICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIHZvaWQgdG9hc3Qub2Zmc2V0V2lkdGg7XG4gICAgdG9hc3QuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIGNsZWFyVGltZW91dCh0b2FzdFRpbWVyKTtcbiAgICB0b2FzdFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdG9hc3Q/LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgaWYgKHRvYXN0KSB0b2FzdC5oaWRkZW4gPSB0cnVlOyB9LCAxODApO1xuICAgIH0sIDE0NTApO1xuICB9O1xuICBjb25zdCBzaG93Q29waWVkID0gKGxhYmVsOiBzdHJpbmcsIGRldGFpbCA9ICcnKTogdm9pZCA9PiBzaG93VG9hc3QobGFiZWwsIGRldGFpbCwgJ29rJyk7XG4gIGNvbnN0IHNob3dEb3dubG9hZEVycm9yID0gKGxhYmVsOiBzdHJpbmcsIGRldGFpbDogc3RyaW5nKTogdm9pZCA9PiBzaG93VG9hc3QobGFiZWwsIGRldGFpbCwgJ3dhcm4nKTtcblxuICAvLyDilIDilIDilIAgVXRpbGl0aWVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgZmFsbGJhY2tJZENvdW50ZXIgPSAwO1xuICBjb25zdCBzZWN1cmVUb2tlbiA9IChieXRlcyA9IDEyKTogc3RyaW5nID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmF3ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMpO1xuICAgICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJhdyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShyYXcpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9XyR7KCsrZmFsbGJhY2tJZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgbXNnSWQgPSAoKTogc3RyaW5nID0+IHtcbiAgICB0cnkgeyBpZiAoZ2xvYmFsVGhpcy5jcnlwdG8ucmFuZG9tVVVJRCkgcmV0dXJuIGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQoKTsgfSBjYXRjaCB7IC8qIGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgcmV0dXJuIGBpZF8ke3NlY3VyZVRva2VuKDE2KX1gO1xuICB9O1xuICBjb25zdCBlc2NhcGVIdG1sID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgIFN0cmluZyhzKS5yZXBsYWNlQWxsKCcmJywgJyZhbXA7JykucmVwbGFjZUFsbCgnPCcsICcmbHQ7JykucmVwbGFjZUFsbCgnPicsICcmZ3Q7Jyk7XG4gIGNvbnN0IGVzY2FwZVJlID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IGhpZ2hsaWdodE1hdGNoID0gKHRleHQ6IHN0cmluZywgcTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIXEpIHJldHVybiBlc2NhcGVIdG1sKHRleHQpO1xuICAgIHJldHVybiBlc2NhcGVIdG1sKHRleHQpLnJlcGxhY2UobmV3IFJlZ0V4cChgKCR7ZXNjYXBlUmUocSl9KWAsICdnaScpLCAnPG1hcms+JDE8L21hcms+Jyk7XG4gIH07XG4gIC8vIFdhbGsgdGV4dCBub2RlcyBpbnNpZGUgYHJvb3RgLCB3cmFwcGluZyBjYXNlLWluc2Vuc2l0aXZlIG1hdGNoZXMgb2YgYHFgXG4gIC8vIGluIDxtYXJrPiBlbGVtZW50cy4gRG9lc24ndCB0b3VjaCBhdHRyaWJ1dGUgc3RyaW5ncyBvciBpbm5lci10YWcgSFRNTCBzb1xuICAvLyBpdCdzIHNhZmUgdG8gcnVuIG9uIGFscmVhZHktaGlnaGxpZ2h0ZWQgSlNPTiBvdXRwdXQuXG4gIGNvbnN0IHdyYXBTZWFyY2hIaXRzSW5UZXh0Tm9kZXMgPSAocm9vdDogSFRNTEVsZW1lbnQsIHE6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChlc2NhcGVSZShxKSwgJ2dpJyk7XG4gICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihyb290LCBOb2RlRmlsdGVyLlNIT1dfVEVYVCk7XG4gICAgY29uc3QgdGFyZ2V0czogVGV4dFtdID0gW107XG4gICAgbGV0IG5vZGU6IE5vZGUgfCBudWxsO1xuICAgIHdoaWxlICgobm9kZSA9IHdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgICAgaWYgKHJlLnRlc3Qobm9kZS5ub2RlVmFsdWUgPz8gJycpKSB0YXJnZXRzLnB1c2gobm9kZSBhcyBUZXh0KTtcbiAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgfVxuICAgIGZvciAoY29uc3QgdCBvZiB0YXJnZXRzKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHQubm9kZVZhbHVlID8/ICcnO1xuICAgICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGxldCBsYXN0ID0gMDtcbiAgICAgIGZvciAoY29uc3QgbSBvZiB2YWx1ZS5tYXRjaEFsbChyZSkpIHtcbiAgICAgICAgY29uc3QgaSA9IG0uaW5kZXggPz8gMDtcbiAgICAgICAgaWYgKGkgPiBsYXN0KSBmcmFnLmFwcGVuZCh2YWx1ZS5zbGljZShsYXN0LCBpKSk7XG4gICAgICAgIGNvbnN0IG1rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWFyaycpO1xuICAgICAgICBtay50ZXh0Q29udGVudCA9IG1bMF07XG4gICAgICAgIGZyYWcuYXBwZW5kKG1rKTtcbiAgICAgICAgbGFzdCA9IGkgKyBtWzBdLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0IDwgdmFsdWUubGVuZ3RoKSBmcmFnLmFwcGVuZCh2YWx1ZS5zbGljZShsYXN0KSk7XG4gICAgICB0LnJlcGxhY2VXaXRoKGZyYWcpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgd29yZENvdW50ID0gKHM6IHN0cmluZyk6IG51bWJlciA9PiAocy5tYXRjaCgvXFxTKy9nKSA/PyBbXSkubGVuZ3RoO1xuICBjb25zdCB0b2tlbkNvdW50ID0gKHM6IHN0cmluZyk6IG51bWJlciA9PiBNYXRoLmNlaWwocy5sZW5ndGggLyA0KTtcbiAgY29uc3QgcGF0aE9mID0gKHU6IHN0cmluZyk6IHN0cmluZyA9PiB7IHRyeSB7IHJldHVybiBuZXcgVVJMKHUpLnBhdGhuYW1lOyB9IGNhdGNoIHsgcmV0dXJuIHU7IH0gfTtcbiAgY29uc3QgaG9zdE9mID0gKHU6IHN0cmluZyk6IHN0cmluZyA9PiB7IHRyeSB7IHJldHVybiBuZXcgVVJMKHUpLmhvc3Q7IH0gY2F0Y2ggeyByZXR1cm4gJyc7IH0gfTtcbiAgLy8gRmlsZW5hbWUtc2FmZSBob3N0IHNsdWc6IGRvdHMg4oaSIHVuZGVyc2NvcmVzIHBlciBwcm9qZWN0IGNvbnZlbnRpb24uXG4gIC8vIE1pcnJvcnMgYmFja2dyb3VuZC50cyBob3N0U2x1ZyBmb3Igc3ltbWV0cnkgYWNyb3NzIHNjcmVlbnNob3QgKyBleHBvcnRcbiAgLy8gZmlsZW5hbWVzLlxuICBjb25zdCBob3N0U2x1ZyA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgaCA9IGhvc3RPZih1cmwpO1xuICAgIGlmICghaCkgcmV0dXJuICd1bmtub3duJztcbiAgICByZXR1cm4gaC5yZXBsYWNlKC9cXC4vZywgJ18nKS5yZXBsYWNlKC9bXlxcdy1dL2csICdfJykuc2xpY2UoMCwgNDApIHx8ICd1bmtub3duJztcbiAgfTtcbiAgLy8gUGljayB0aGUgbW9zdC1mcmVxdWVudCBob3N0IGFjcm9zcyBhbGwgc2VsZWN0b3IgY2FwdHVyZXMgKGZvciBleHBvcnRcbiAgLy8gZmlsZW5hbWVzKS4gV2hlbiB0aGUgd29ya3NwYWNlIHNwYW5zIG11bHRpcGxlIGhvc3RzLCByZXR1cm4gJ211bHRpJy5cbiAgY29uc3QgZG9taW5hbnRIb3N0U2x1ZyA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGNvdW50cyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGggPSBob3N0U2x1ZyhtLmVudHJ5LnVybCk7XG4gICAgICBjb3VudHMuc2V0KGgsIChjb3VudHMuZ2V0KGgpID8/IDApICsgMSk7XG4gICAgfVxuICAgIGlmICghY291bnRzLnNpemUpIHJldHVybiAnZW1wdHknO1xuICAgIGxldCBiZXN0ID0gJyc7XG4gICAgbGV0IGJlc3ROID0gMDtcbiAgICBmb3IgKGNvbnN0IFtoLCBuXSBvZiBjb3VudHMpIHtcbiAgICAgIGlmIChuID4gYmVzdE4pIHsgYmVzdCA9IGg7IGJlc3ROID0gbjsgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnRzLnNpemUgPiAxID8gJ211bHRpJyA6IGJlc3Q7XG4gIH07XG4gIC8vIERpc3RpbmN0IGhvc3RzIHByZXNlbnQgaW4gdGhpcyB3b3Jrc3BhY2UgKGFscGhhYmV0aWNhbCwgY2FwcGVkKS4gVXNlZCBpblxuICAvLyB0aGUgZXhwb3J0IG1hbmlmZXN0J3MgYGhvc3RzYCBmaWVsZC5cbiAgY29uc3QgZGlzdGluY3RIb3N0cyA9ICgpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgc2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGggPSBob3N0T2YobS5lbnRyeS51cmwpO1xuICAgICAgaWYgKGgpIHNldC5hZGQoaCk7XG4gICAgfVxuICAgIHJldHVybiBbLi4uc2V0XS5zb3J0KCkuc2xpY2UoMCwgMjApO1xuICB9O1xuICAvLyDilIDilIDilIAgRGV0ZXJtaW5pc3RpYyBleHBvcnQgaWRlbnRpdHkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIE9uZSBjbG9jayBwZXIgZXhwb3J0OiBldmVyeSB0aW1lc3RhbXAgaW5zaWRlIGEgc2luZ2xlIGV4cG9ydCBkZXJpdmVzXG4gIC8vIGZyb20gdGhlIHNhbWUgaW5zdGFudCwgYW5kIHRlc3RzIGNhbiBmcmVlemUgaXQgc28gdHdvIGV4cG9ydHMgb2YgdGhlXG4gIC8vIHNhbWUgY29udGVudCBhcmUgYnl0ZS1pZGVudGljYWwuXG4gIGxldCBleHBvcnRDbG9ja092ZXJyaWRlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZXhwb3J0Tm93SXNvID0gKCk6IHN0cmluZyA9PiBleHBvcnRDbG9ja092ZXJyaWRlID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgLy8gU3RhYmxlIGNvbnRlbnQgaWRlbnRpdHk6IFNIQS0yNTYgb3ZlciB0aGUgc2xpbSByb3dzIHBsdXMgdGhlIHNvcnRlZFxuICAvLyBzY3JlZW5zaG90IGFyY2hpdmUgbmFtZXMuIFNhbWUgd29ya3NwYWNlIGNvbnRlbnQg4oaSIHNhbWUgaGFzaCDihpIgc2FtZVxuICAvLyBmaWxlbmFtZSAodGhlIGJhY2tncm91bmQgc2F2ZXMgd2l0aCBjb25mbGljdEFjdGlvbiAnb3ZlcndyaXRlJyksIHNvXG4gIC8vIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudCByZXBsYWNlcyByYXRoZXIgdGhhbiBkdXBsaWNhdGVzLlxuICBjb25zdCBjb21wdXRlQ29udGVudEhhc2ggPSBhc3luYyAoc2hvdE5hbWVzOiBzdHJpbmdbXSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGF5bG9hZCA9IGJ1aWxkU2xpbSgpLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpLmpvaW4oJ1xcbicpICsgJ1xcbicgKyBbLi4uc2hvdE5hbWVzXS5zb3J0KCkuam9pbignXFxuJyk7XG4gICAgY29uc3QgZGlnZXN0ID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUocGF5bG9hZCkpO1xuICAgIHJldHVybiBbLi4ubmV3IFVpbnQ4QXJyYXkoZGlnZXN0KV0ubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKTtcbiAgfTtcbiAgLy8gQnVpbGQgYSBmaWxlbmFtZSBvZiB0aGUgc2hhcGUgYHBpbmNoZ3JhYi08d29ya3NwYWNlPi08aG9zdD4tPHN0YW1wPi48ZXh0PmAuXG4gIC8vIFRoZSBzdGFtcCBpcyB0aGUgZXhwb3J0J3MgY29udGVudC1oYXNoIHByZWZpeCB3aGVuIHN1cHBsaWVkIChidW5kbGUgYW5kXG4gIC8vIEpTT05MIGV4cG9ydHMpLCBmYWxsaW5nIGJhY2sgdG8gdGhlIGVwb2NoIGZvciBsZWdhY3kgY2FsbGVycy5cbiAgY29uc3QgYnVpbGRFeHBvcnRGaWxlbmFtZSA9IChleHQ6ICdqc29ubCcgfCAnbWQnIHwgJ3Rhci56c3QnLCBzdGFtcD86IHN0cmluZyk6IHN0cmluZyA9PlxuICAgIGBwaW5jaGdyYWItJHthY3RpdmVXc30tJHtkb21pbmFudEhvc3RTbHVnKCl9LSR7c3RhbXAgPz8gRGF0ZS5ub3coKX0uJHtleHR9YDtcbiAgLy8gU2tpcC1saXN0IG1hdGNoOiBzdWJzdHJpbmcgKGNhc2UtaW5zZW5zaXRpdmUpIG1hdGNoIGFnYWluc3QgdGhlIFVSTCdzXG4gIC8vIGhvc3QuIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIFVSTCBwYXJzaW5nIG9uIHRoZSBwYXR0ZXJucyBzbyB0aGUgdXNlclxuICAvLyBjYW4gd3JpdGUgYHdyYW5uZ2xlLmNvbWAgYW5kIGhhdmUgaXQgbWF0Y2ggYGFwcC53cmFubmdsZS5jb21gIHRvby5cbiAgY29uc3Qgc2hvdWxkU2tpcFNjcmVlbnNob3QgPSAodXJsOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBsaXN0ID0gKHByZWZzLnNraXBTY3JlZW5zaG90SG9zdHMgPz8gJycpLnNwbGl0KCcsJykubWFwKChzKSA9PiBzLnRyaW0oKS50b0xvd2VyQ2FzZSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGhvc3QgPSBob3N0T2YodXJsKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBsaXN0LnNvbWUoKHBhdCkgPT4gaG9zdC5pbmNsdWRlcyhwYXQpKTtcbiAgfTtcblxuICAvLyBKU09OIHN5bnRheCBoaWdobGlnaHQgKHBlci1rZXkgY29sb3IgaXMgaGFzaGVkIGZvciB2aXN1YWwgdmFyaWV0eSkuXG4gIGNvbnN0IEtFWV9QQUxFVFRFID0gWycjZmY3ZTc4JywgJyNmZmI0NTQnLCAnI2ZmZTA2NicsICcjN2JkOTdhJywgJyM1ZmQxZmYnLCAnIzliOGNmZicsICcjZmY4NWMxJywgJyNmZjVmMDAnLCAnIzEwYjk4MScsICcjZjU5ZTBiJywgJyNhNzhiZmEnLCAnIzM0ZDM5OSddO1xuICBjb25zdCBjb2xvckZvcktleSA9IChrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgay5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgICByZXR1cm4gS0VZX1BBTEVUVEVbaCAlIEtFWV9QQUxFVFRFLmxlbmd0aF0hO1xuICB9O1xuICBjb25zdCBKU09OX1RPS0VOX1JFID0gLyhcXHMrKXwoXCIoPzpbXlwiXFxcXF18XFxcXC4pKlwiKXwodHJ1ZXxmYWxzZXxudWxsKXwoLT9cXGQrKD86XFwuXFxkKyk/KD86W2VFXVsrLV0/XFxkKyk/KXwoW3t9W1xcXSw6XSkvZztcbiAgY29uc3QgYXBwZW5kSnNvbkhpZ2hsaWdodCA9IChyb290OiBIVE1MRWxlbWVudCwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgcm9vdC50ZXh0Q29udGVudCA9ICcnO1xuICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICAgIGxldCBsYXN0ID0gMDtcbiAgICBKU09OX1RPS0VOX1JFLmxhc3RJbmRleCA9IDA7XG4gICAgd2hpbGUgKChtID0gSlNPTl9UT0tFTl9SRS5leGVjKHRleHQpKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKG0uaW5kZXggPiBsYXN0KSByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKGxhc3QsIG0uaW5kZXgpKSk7XG4gICAgICBsYXN0ID0gSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXg7XG4gICAgICBjb25zdCBbLCB3cywgc3RyLCBsaXQsIG51bSwgcHVuY3RdID0gbTtcbiAgICAgIGlmICh3cykgeyByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh3cykpOyBjb250aW51ZTsgfVxuICAgICAgaWYgKHN0cikge1xuICAgICAgICBsZXQgayA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgICB3aGlsZSAoayA8IHRleHQubGVuZ3RoICYmICh0ZXh0W2tdID09PSAnICcgfHwgdGV4dFtrXSA9PT0gJ1xcdCcgfHwgdGV4dFtrXSA9PT0gJ1xcbicpKSBrKys7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGlmICh0ZXh0W2tdID09PSAnOicpIHtcbiAgICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG4gICAgICAgICAgdHJ5IHsga2V5ID0gSlNPTi5wYXJzZShzdHIpIGFzIHN0cmluZzsgfSBjYXRjaCB7IGtleSA9IHN0ci5zbGljZSgxLCAtMSk7IH1cbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdrJztcbiAgICAgICAgICBzcGFuLnN0eWxlLmNvbG9yID0gY29sb3JGb3JLZXkoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdzJztcbiAgICAgICAgfVxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gc3RyO1xuICAgICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgaWYgKGxpdCkgc3Bhbi5jbGFzc05hbWUgPSAnYic7XG4gICAgICBlbHNlIGlmIChudW0pIHNwYW4uY2xhc3NOYW1lID0gJ24nO1xuICAgICAgZWxzZSBpZiAocHVuY3QpIHNwYW4uY2xhc3NOYW1lID0gJ3AnO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGxpdCA/PyBudW0gPz8gcHVuY3QgPz8gJyc7XG4gICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICB9XG4gICAgaWYgKGxhc3QgPCB0ZXh0Lmxlbmd0aCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0KSkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBQZXJzaXN0ZW5jZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgbG9hZEFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICB3b3Jrc3BhY2VzID0gKGF3YWl0IFN0b3JlLmdldDxXb3Jrc3BhY2VbXT4oV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpKSB8fCB3b3Jrc3BhY2VzO1xuICAgIGlmICghd29ya3NwYWNlcy5sZW5ndGgpIHdvcmtzcGFjZXMgPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgICBhY3RpdmVXcyA9IChhd2FpdCBTdG9yZS5nZXQ8c3RyaW5nPigncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsICdkZWZhdWx0JykpIHx8ICdkZWZhdWx0JztcbiAgICBpZiAoIXdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBhY3RpdmVXcykpIGFjdGl2ZVdzID0gd29ya3NwYWNlc1swXSEubmFtZTtcbiAgICBwcmVmcyA9IHsuLi5ERUZBVUxUX1BSRUZTLCAuLi4oYXdhaXQgU3RvcmUuZ2V0PFBhcnRpYWw8UHJlZnM+PihQUkVGU19TVE9SQUdFX05BTUUsIHt9KSl9O1xuICAgIC8vIFBhdGggbWlncmF0aW9uOiBwcmlvciB2ZXJzaW9ucyBkZWZhdWx0ZWQgc2tpbGxQYXRoIHRvXG4gICAgLy8gYH4vLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLCBhbmQgc29tZSB1c2VycyBoYWQgaXQgc3RvcmVkIGFzXG4gICAgLy8gYH4vLmRvdGZpbGVzLy5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYC4gVGhlIHNraWxsIHdhcyByZW5hbWVkXG4gICAgLy8gdG8gYFBpbmNoR3JhYmA7IGFueSBgfi8uZG90ZmlsZXMvYCBwcmVmaXggaXMgc3RyaXBwZWQgZnJvbVxuICAgIC8vIGV4cG9zZWQgZGVmYXVsdHMgKGRvdGZpbGVzIGlzIGEgcGVyc29uYWwgY29uZmlnIHNvdXJjZSDigJQgZXhwb3J0c1xuICAgIC8vIHNob3VsZG4ndCBsZWFrIHRoYXQgcGF0aCkuXG4gICAgY29uc3QgdXBncmFkZVBhdGggPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkLCBmcmVzaDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgIGlmICghcCkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuaW5jbHVkZXMoJy5kb3RmaWxlcycpKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5lbmRzV2l0aCgnc2tpbGxzL3VpL1NLSUxMLm1kJykpIHJldHVybiBmcmVzaDtcbiAgICAgIHJldHVybiBwO1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLmRlc2lnblBhdGgsIERFRkFVTFRfUFJFRlMuZGVzaWduUGF0aCk7XG4gICAgcHJlZnMuc2tpbGxQYXRoID0gdXBncmFkZVBhdGgocHJlZnMuc2tpbGxQYXRoLCBERUZBVUxUX1BSRUZTLnNraWxsUGF0aCk7XG4gICAgLy8gQ29udGVudCBtaWdyYXRpb246IHByZXZpb3VzIHZlcnNpb25zIHN0b3JlZCB0aGUgZW50aXJlIHRlbXBsYXRlXG4gICAgLy8gdGV4dCBpbnNpZGUgYHByZWZzLmRlc2lnbk1kYCAvIGBwcmVmcy5za2lsbE1kYCBhcyBkZWZhdWx0cy4gVGhhdFxuICAgIC8vIGF0ZSB+MzYwS0Igb2YgY2hyb21lLnN0b3JhZ2UgcXVvdGEgZm9yIG5vIGJlbmVmaXQuIERldGVjdCB3aGVuXG4gICAgLy8gdGhlIHN0b3JlZCB2YWx1ZSBtYXRjaGVzIG9uZSBvZiB0aGUgYnVuZGxlZCB0ZW1wbGF0ZXMgYW5kIGNsZWFyXG4gICAgLy8gaXQg4oCUIHRoZSByZXNvbHZlciBmYWxscyBiYWNrIHRvIHRoZSBidW5kbGVkIGZpbGUgb24gdGhlIGZseS5cbiAgICAvLyBBbHNvIHNjcnViIGFueSBsZWFrZWQgYH4vLmRvdGZpbGVzL2Agc3Vic3RyaW5nLlxuICAgIGNvbnN0IHNjcnViRG90ZmlsZXMgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgICBzLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLy5hZ2VudHMvJywgJ34vLmFnZW50cy8nKVxuICAgICAgIC5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8nLCAnfi8uYWdlbnRzLycpO1xuICAgIGNvbnN0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUgPSBhc3luYyAoY3VycmVudDogc3RyaW5nLCBrZXlzOiBUZW1wbGF0ZUtleVtdKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgIGlmICghY3VycmVudCB8fCAhY3VycmVudC50cmltKCkpIHJldHVybiAnJztcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSBjdXJyZW50LnRyaW0oKTtcbiAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IHRwbCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoaykpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRwbCAmJiB0cGwgPT09IHRyaW1tZWQpIHJldHVybiAnJzsgLy8gbWF0Y2hlcyBhIGJ1bmRsZWQgdGVtcGxhdGUg4oCUIGNvbGxhcHNlIHRvIGVtcHR5XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycmVudC5pbmNsdWRlcygnLmRvdGZpbGVzJykgPyBzY3J1YkRvdGZpbGVzKGN1cnJlbnQpIDogY3VycmVudDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnbk1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5kZXNpZ25NZCA/PyAnJywgWydsb2NhbERlc2lnbicsICdkZXNpZ25UZW1wbGF0ZSddKTtcbiAgICBwcmVmcy5za2lsbE1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5za2lsbE1kID8/ICcnLCBbJ2xvY2FsU2tpbGwnLCAnc2tpbGxUZW1wbGF0ZSddKTtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKGFjdGl2ZVdzKTtcbiAgfTtcbiAgY29uc3QgbG9hZFdvcmtzcGFjZSA9IGFzeW5jIChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhY3RpdmVXcyA9IG5hbWU7XG4gICAgdm9pZCBTdG9yZS5zZXQoJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCBuYW1lKTtcbiAgICAvLyBNaW50IGEgbmV3IHNlc3Npb25JZCBwZXIgd29ya3NwYWNlIGxvYWQuIFNhbWUgd29ya3NwYWNlIHJlLW9wZW5lZFxuICAgIC8vID0gbmV3IHNlc3Npb246IGRpc3RpbmN0IHV1aWQgc28gYSBjb25zdW1lciBjYW4gdGVsbCB0d28gYm9vdHNcbiAgICAvLyBhcGFydCBldmVuIHdoZW4gdGhlIGNhcHR1cmVzIGxhbmQgaW4gdGhlIHNhbWUgb24tZGlzayBmaWxlLlxuICAgIHNlc3Npb25JZCA9IG1zZ0lkKCk7XG4gICAgbWVzc2FnZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFBhbmVsTWVzc2FnZVtdPih3c01zZ0tleShuYW1lKSwgW10pKSB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSBtZXNzYWdlcyA9IFtdO1xuICAgIC8vIE1pZ3JhdGUgbGVnYWN5IGVudHJpZXMgKG5vIHVpZCwgc3RhdGVzLWFzLXJlY29yZCwgYXR0cnMuZm9ybWF0KSBhbmRcbiAgICAvLyBwZXJzaXN0IGlmIGFueXRoaW5nIGNoYW5nZWQgc28gd2UgZG9uJ3QgcGF5IHRoZSBtaWdyYXRpb24gY29zdCBhZ2FpblxuICAgIC8vIG5leHQgbG9hZC5cbiAgICBpZiAobWlncmF0ZUxvYWRlZE1lc3NhZ2VzKCkpIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KG5hbWUpLCBtZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwYWdlU2hvdHNGaXJlZC5jbGVhcigpO1xuICAgIGNvbnN0IHN0b3JlZCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0tleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWQpKSBzaG90cy5zZXQoaywgdik7XG4gICAgLy8gUmVzdG9yZSB0aGUgZnVsbC1yZXNvbHV0aW9uIFBORyBjYWNoZSBzbyBhIHdvcmtzcGFjZSBhcmNoaXZlXG4gICAgLy8gZXhwb3J0ZWQgQUZURVIgYSBwYW5lbCByZWxvYWQgc3RpbGwgYnVuZGxlcyBzY3JlZW5zaG90cyBmcm9tXG4gICAgLy8gZWFybGllciBjYXB0dXJlcy4gRklGTyBvcmRlciBpcyBwcmVzZXJ2ZWQgYnkgT2JqZWN0IGtleSBvcmRlci5cbiAgICBjb25zdCBzdG9yZWRGdWxsID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzRnVsbEtleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWRGdWxsKSkgc2hvdHNGdWxsLnNldChrLCB2KTtcbiAgICAvLyBMb2FkIHRoaXMgd29ya3NwYWNlJ3MgcGVyc2lzdGVudCBzbmFwc2hvdCBoaXN0b3J5IChDbGVhci1hbGwgYXJjaGl2ZXMpLlxuICAgIGF3YWl0IGxvYWRXc1NuYXBzaG90cyhuYW1lKTtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgc2VsZWN0b3JFcnJvcnMuY2xlYXIoKTtcbiAgICB1bmRvU3RhY2subGVuZ3RoID0gMDtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gbnVsbDtcbiAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICB9O1xuICBjb25zdCBwZXJzaXN0ID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KGFjdGl2ZVdzKSwgbWVzc2FnZXMpO1xuICAgIC8vIFB1c2ggY2FwdHVyZWQtc2VsZWN0b3Igc2V0IHNvIHRoZSBjb250ZW50IHNjcmlwdCdzIGhvdmVyIHdhbGtlciBjYW5cbiAgICAvLyByZXNvbHZlIGRlc2NlbmRhbnRzIOKGkiBjYXB0dXJlZCBhbmNlc3Rvci5cbiAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgc2VuZFRvQ1Moe2tpbmQ6ICdzZXQtY2FwdHVyZWQnLCBzZWxlY3RvcnN9KTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFByZWZzID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KFBSRUZTX1NUT1JBR0VfTkFNRSwgcHJlZnMpO1xuICAgIC8vIFB1c2ggdGhlIHN1YnNldCBvZiBwcmVmcyB0aGUgY29udGVudCBzY3JpcHQgY2FyZXMgYWJvdXQgc28gaXRzXG4gICAgLy8gb3ZlcmxheSAoc3BhY2luZyB2aXN1YWxpemVyLCBob3ZlciBzbmFwLCBldGMuKSByZWZsZWN0cyB0aGUgbGF0ZXN0LlxuICAgIHZvaWQgc2VuZFRvQ1Moe1xuICAgICAga2luZDogJ3NldC1jcy1wcmVmcycsXG4gICAgICBzcGFjaW5nT3ZlcmxheTogcHJlZnMuc3BhY2luZ092ZXJsYXksXG4gICAgICBob3ZlclNuYXA6IHByZWZzLmhvdmVyU25hcCxcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICAvLyBGdWxsLXJlc29sdXRpb24gUE5HIHBlcnNpc3RlbmNlIHdpdGggRklGTyBldmljdGlvbi4gZGF0YVVSTCBzdHJpbmdzXG4gIC8vIGNhbiBydW4gNTAtNTAwIEtCIGVhY2g7IHRoZSBkZWZhdWx0IHF1b3RhIGdldHMgZXhoYXVzdGVkIGluIHRlbnMgb2ZcbiAgLy8gY2FwdHVyZXMgd2l0aG91dCBhIGJ1ZGdldC4gTWFwIGluc2VydGlvbiBvcmRlciA9IEZJRk8gb3JkZXIsIHNvXG4gIC8vIHdlIGV2aWN0IGZyb20gdGhlIGZyb250IHVudGlsIHVuZGVyIGJ1ZGdldCBiZWZvcmUgcGVyc2lzdGluZy5cbiAgY29uc3QgZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgZm9yIChjb25zdCB2IG9mIHNob3RzRnVsbC52YWx1ZXMoKSkgdG90YWwgKz0gdi5sZW5ndGg7XG4gICAgbGV0IGV2aWN0ZWQgPSAwO1xuICAgIHdoaWxlICh0b3RhbCA+IFNIT1RTX0ZVTExfQlVER0VUX0JZVEVTKSB7XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHNob3RzRnVsbC5rZXlzKCkubmV4dCgpLnZhbHVlO1xuICAgICAgaWYgKGZpcnN0S2V5ID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgY29uc3QgcmVtb3ZlZCA9IHNob3RzRnVsbC5nZXQoZmlyc3RLZXkpO1xuICAgICAgaWYgKHJlbW92ZWQgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBzaG90c0Z1bGwuZGVsZXRlKGZpcnN0S2V5KTtcbiAgICAgIHRvdGFsIC09IHJlbW92ZWQubGVuZ3RoO1xuICAgICAgZXZpY3RlZCsrO1xuICAgIH1cbiAgICByZXR1cm4gZXZpY3RlZDtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzRnVsbCA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBldmljdGVkID0gZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCgpO1xuICAgIGlmIChldmljdGVkID4gMCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCBgc2hvdHNGdWxsIEZJRk8tZXZpY3RlZCAke2V2aWN0ZWR9IG9sZGVzdCBlbnRyaWVzIHRvIGZpdCAke1NIT1RTX0ZVTExfQlVER0VUX0JZVEVTIC8gMTAyNCAvIDEwMjR9TUIgYnVkZ2V0YCk7XG4gICAgfVxuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzRnVsbCkgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzRnVsbEtleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RXb3Jrc3BhY2VzID0gKCk6IHZvaWQgPT4geyB2b2lkIFN0b3JlLnNldChXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcyk7IH07XG5cbiAgLy8g4pSA4pSA4pSAIFRhYiDih4Qgd29ya3NwYWNlIGJpbmRpbmcgKCMxOCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJhY2tncm91bmQgYW5ub3VuY2VzIGVhY2ggdG9vbGJhci1jbGljayBhY3RpdmF0aW9uIHZpYSAncGctdGFiLWFjdGl2YXRlZCcuXG4gIC8vIFRoZSBmaXJzdCBhY3RpdmF0aW9uIGFkb3B0cyB0aGUgY3VycmVudCB1bmJvdW5kIHdvcmtzcGFjZTsgbGF0ZXIgdGFicyBlYWNoXG4gIC8vIGdldCB0aGVpciBvd24uIFBpY2tpbmcgYSBib3VuZCB3b3Jrc3BhY2UganVtcHMgdGhlIGJyb3dzZXIgdG8gaXRzIHRhYi5cbiAgY29uc3Qgc2x1Z0ZvclRhYiA9ICh1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgY29uc3QgaCA9IG5ldyBVUkwodXJsKS5ob3N0bmFtZS5yZXBsYWNlKC9ed3d3XFwuLywgJycpOyBpZiAoaCkgcmV0dXJuIGg7IH0gY2F0Y2ggeyAvKiBub3QgYSB1cmwgKi8gfVxuICAgIGNvbnN0IHQgPSAodGl0bGUgfHwgJycpLnRyaW0oKTtcbiAgICByZXR1cm4gdCA/IHQuc2xpY2UoMCwgMjQpIDogJ3RhYic7XG4gIH07XG4gIGNvbnN0IHVuaXF1ZVdzTmFtZSA9IChiYXNlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghd29ya3NwYWNlcy5zb21lKCh3KSA9PiB3Lm5hbWUgPT09IGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgICBmb3IgKGxldCBpID0gMjsgOyBpKyspIHsgY29uc3QgbiA9IGAke2Jhc2V9ICR7aX1gOyBpZiAoIXdvcmtzcGFjZXMuc29tZSgodykgPT4gdy5uYW1lID09PSBuKSkgcmV0dXJuIG47IH1cbiAgfTtcbiAgY29uc3Qgb25UYWJBY3RpdmF0ZWQgPSBhc3luYyAoe3RhYklkLCB1cmwsIHRpdGxlfToge3RhYklkOiBudW1iZXI7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nfSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGxldCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy50YWJJZCA9PT0gdGFiSWQpO1xuICAgIGlmICh3cykge1xuICAgICAgaWYgKHdzLnVybCAhPT0gdXJsIHx8IHdzLnRpdGxlICE9PSB0aXRsZSkgeyB3cy51cmwgPSB1cmw7IHdzLnRpdGxlID0gdGl0bGU7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VycmVudCA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBhY3RpdmVXcyk7XG4gICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LnRhYklkID09IG51bGwpIHtcbiAgICAgICAgd3MgPSBjdXJyZW50OyB3cy50YWJJZCA9IHRhYklkOyB3cy51cmwgPSB1cmw7IHdzLnRpdGxlID0gdGl0bGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cyA9IHtuYW1lOiB1bmlxdWVXc05hbWUoc2x1Z0ZvclRhYih1cmwsIHRpdGxlKSksIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0YWJJZCwgdXJsLCB0aXRsZX07XG4gICAgICAgIHdvcmtzcGFjZXMucHVzaCh3cyk7XG4gICAgICB9XG4gICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIH1cbiAgICBpZiAoYWN0aXZlV3MgIT09IHdzLm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod3MubmFtZSk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICAvLyBCcmluZyB0aGUgYnJvd3NlciB0byBhIHdvcmtzcGFjZSdzIGJvdW5kIHRhYiB3aGVuIHRoZSB1c2VyIHBpY2tzIGl0LlxuICBjb25zdCBmb2N1c1dvcmtzcGFjZVRhYiA9IChuYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBuYW1lKTtcbiAgICBpZiAoIWluRXh0ZW5zaW9uIHx8IHdzPy50YWJJZCA9PSBudWxsKSByZXR1cm47XG4gICAgY2hyb21lLnRhYnMudXBkYXRlKHdzLnRhYklkLCB7YWN0aXZlOiB0cnVlfSkudGhlbigodCkgPT4ge1xuICAgICAgaWYgKHQ/LndpbmRvd0lkICE9IG51bGwpIHZvaWQgY2hyb21lLndpbmRvd3M/LnVwZGF0ZSh0LndpbmRvd0lkLCB7Zm9jdXNlZDogdHJ1ZX0pPy5jYXRjaD8uKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgIH0pLmNhdGNoKCgpID0+IHsgLyogdGFiIHdhcyBjbG9zZWQgKi8gfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNuYXBzaG90IC8gdW5kbyAvIHJlZG8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNuYXBzaG90ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdXNwZW5kU25hcHNob3RzKSByZXR1cm47XG4gICAgaWYgKHVuZG9TdGFjay5sZW5ndGggPj0gVU5ET19DQVApIHVuZG9TdGFjay5zaGlmdCgpO1xuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVzdG9yZSA9IChqc29uOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBzdXNwZW5kU25hcHNob3RzID0gdHJ1ZTtcbiAgICB0cnkgeyBtZXNzYWdlcyA9IEpTT04ucGFyc2UoanNvbikgYXMgUGFuZWxNZXNzYWdlW107IH0gY2F0Y2ggeyBtZXNzYWdlcyA9IFtdOyB9XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IGZhbHNlO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcbiAgY29uc3QgdW5kbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXVuZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHVuZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHJlZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZSh1bmRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1VuZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFyZWRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byByZWRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUocmVkb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdSZWRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCB1cGRhdGVVbmRvQnV0dG9ucyA9ICgpOiB2b2lkID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJ1bmRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgdW5kb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwicmVkb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHJlZG9TdGFjay5sZW5ndGggPT09IDApO1xuICB9O1xuICBjb25zdCB1cGRhdGVDb3B5UGF0aEJ1dHRvbiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtYWN0aW9uPVwiY29weS1wYXRoXCJdJyk7XG4gICAgaWYgKCFidG4pIHJldHVybjtcbiAgICBjb25zdCBoYXMgPSBCb29sZWFuKGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoKTtcbiAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCAhaGFzKTtcbiAgICBidG4uZGF0YXNldC50aXAgPSBoYXNcbiAgICAgID8gYENvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC5cXG4ke2xhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoID8/ICcnfWBcbiAgICAgIDogJ0NvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC4gUnVuIGFuIGV4cG9ydCBmaXJzdC4nO1xuICB9O1xuICBjb25zdCBvbkNvcHlQYXRoID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aDtcbiAgICBpZiAoIXBhdGhUb0NvcHkpIHtcbiAgICAgIHNldFN0YXR1cygnTm8gZXhwb3J0IHlldCDigJQgcnVuIGEgZG93bmxvYWQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwYXRoVG9Db3B5KTtcbiAgICAgIC8vIFNob3cgb25seSB0aGUgbGVhZiBmaWxlbmFtZSBpbiB0aGUgc3RhdHVzIOKAlCB0aGUgZnVsbCBXaW5kb3dzLXN0eWxlXG4gICAgICAvLyBhYnNvbHV0ZSBwYXRoIHdvdWxkIGJlIDEwMCsgY2hhcnMgYW5kIHdhcyBkaXNydXB0aW5nIHRoZSBzaWRlYmFyXG4gICAgICAvLyBsYXlvdXQgZm9yIHRoZSAyLXNlY29uZCBzdGF0dXMgVFRMLlxuICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgIHNldFN0YXR1cyhgQ29waWVkIHBhdGggwrcgJHtsZWFmfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIHBhdGgnLCBsZWFmKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCB3cml0ZSBmYWlsZWQ6ICcgKyBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignQ2xpcGJvYXJkIGZhaWxlZCcsIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSkpO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHRvIGFjdGl2ZSB0YWIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRUb0NTID0gYXN5bmMgKHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG1zZyA9IHBnKHBheWxvYWQpO1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgaWYgKHRhYnNbMF0/LmlkICE9IG51bGwpIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIG1zZykuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHsgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiBtc2d9KSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2VuZFRvQ1NBbmRXYWl0ID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8UiB8IG51bGw+ID0+IG5ldyBQcm9taXNlPFIgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnN0IHJlcUlkID0gYHJlcV8ke3NlY3VyZVRva2VuKDEyKX1gO1xuICAgICAgY29uc3Qgb25SZXNwID0gKGU6IEV2ZW50KTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGRldGFpbCA9IChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWw7XG4gICAgICAgIGlmIChkZXRhaWw/Ll9fcmVxSWQgPT09IHJlcUlkKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICAgICAgcmVzb2x2ZShkZXRhaWwucmVwbHkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IHtfX3JlcUlkOiByZXFJZCwgLi4ucGcocGF5bG9hZCl9fSkpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApOyByZXNvbHZlKG51bGwpOyB9LCAxMDAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sICh0YWJzKSA9PiB7XG4gICAgICBpZiAoIXRhYnNbMF0/LmlkKSB7IHJlc29sdmUobnVsbCk7IHJldHVybjsgfVxuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgcGcocGF5bG9hZCksIChyOiBSKSA9PiByZXNvbHZlKHIpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGNvbnN0IHNlbmRUb0JnID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9CZyk6IFByb21pc2U8UiB8IG51bGw+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm4gbnVsbDtcbiAgICB0cnkgeyByZXR1cm4gKGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHBnKHBheWxvYWQpKSkgYXMgUjsgfVxuICAgIGNhdGNoIChlKSB7IHJldHVybiB7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IGFzIHVua25vd24gYXMgUjsgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBSZWNlaXZpbmcgZnJvbSBjb250ZW50IHNjcmlwdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRGVmZW5zaXZlIHJpbmctYnVmZmVyIGRlZHVwZTogZXZlbiB0aG91Z2ggd2Ugbm93IHVzZSBvbmx5IG9uZSBjaGFubmVsLFxuICAvLyBhbnkgbWVzc2FnZSB0aGF0IHNvbWVob3cgYXJyaXZlcyB0d2ljZSB3aXRoaW4gfjIgc2Vjb25kcyBpcyBpZ25vcmVkLlxuICBjb25zdCByZWNlbnRNaWRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBSRUNFTlRfTUlEX0NBUCA9IDY0O1xuICBjb25zdCBvbkNzTWVzc2FnZSA9IChtc2c6IFBnRW52ZWxvcGU8Q3NUb1BhbmVsPik6IHZvaWQgPT4ge1xuICAgIGlmICghbXNnIHx8IG1zZy5fX3BnICE9PSB0cnVlKSByZXR1cm47XG4gICAgaWYgKG1zZy5fX21pZCkge1xuICAgICAgaWYgKHJlY2VudE1pZHMuaW5jbHVkZXMobXNnLl9fbWlkKSkgcmV0dXJuO1xuICAgICAgcmVjZW50TWlkcy5wdXNoKG1zZy5fX21pZCk7XG4gICAgICBpZiAocmVjZW50TWlkcy5sZW5ndGggPiBSRUNFTlRfTUlEX0NBUCkgcmVjZW50TWlkcy5zaGlmdCgpO1xuICAgIH1cbiAgICBpZiAoKG1zZyBhcyB7a2luZD86IHN0cmluZ30pLmtpbmQgPT09ICdwZy10YWItYWN0aXZhdGVkJykge1xuICAgICAgdm9pZCBvblRhYkFjdGl2YXRlZChtc2cgYXMgdW5rbm93biBhcyB7dGFiSWQ6IG51bWJlcjsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmd9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3dpdGNoIChtc2cua2luZCkge1xuICAgICAgY2FzZSAnY2FwdHVyZSc6IG9uQ2FwdHVyZShtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlcic6IG9uSG92ZXIobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXItZW5kJzogb25Ib3ZlckVuZCgpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWFkZCc6IG9uUGVuZGluZ0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWNsZWFyJzogb25QZW5kaW5nQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZmVlZGJhY2stYWRkJzogb25GZWVkYmFja0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwcmVmZXJlbmNlLWNoYW5nZSc6IG9uUHJlZmVyZW5jZUNoYW5nZShtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnfT4pOyByZXR1cm47XG4gICAgICBjYXNlICdwYWdlLXNuYXBzaG90Jzogb25QYWdlU25hcHNob3QoKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdwYWdlLXNuYXBzaG90J30+KS5wYXlsb2FkKTsgcmV0dXJuO1xuICAgICAgZGVmYXVsdDogcmV0dXJuO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvblByZWZlcmVuY2VDaGFuZ2UgPSAoe3JlYXNvbiwgcGFnZX06IHtyZWFzb246IHN0cmluZzsgcGFnZTogYW55fSk6IHZvaWQgPT4ge1xuICAgIGxpdmVUYWJVcmwgPSBwYWdlPy51cmwgPz8gbGl2ZVRhYlVybDtcbiAgICBsaXZlVGFiUGF0aCA9IGxpdmVUYWJVcmwgPyBwYXRoT2YobGl2ZVRhYlVybCkgOiBsaXZlVGFiUGF0aDtcbiAgICAvLyBQYWdlIHJvd3MgYXJlIGNhcHR1cmUgaGVhZGVycywgbm90IGEgdGFiL3BhZ2UgdGVsZW1ldHJ5IGZlZWQuIFRoZSBuZXh0XG4gICAgLy8gc2VsZWN0b3IgY2FwdHVyZSBmcm9tIHRoaXMgcGFnZSB3aWxsIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQvc3RhdGUgYW5kXG4gICAgLy8gaW5zZXJ0IGEgcGFnZSBoZWFkZXIgb25seSBpZiBuZWVkZWQuXG4gICAgc2V0U3RhdHVzKGAke3JlYXNvbn0gY2hhbmdlZGAsIHtraW5kOiAnaW5mbyd9KTtcbiAgfTtcblxuICAvLyBQYWdlLWdyb3VwIHJlY29yZHMgbWF5IGNhcnJ5IGEgZnVsbC1wYWdlIHNuYXBzaG90ICh2aWV3cG9ydCwgc2Nyb2xsXG4gIC8vIGV4dGVudHMsIGRwciwgbGFuZywgZnVsbC1wYWdlIHNjcmVlbnNob3QpLiBQYWdlTWVzc2FnZSBpbiB0eXBlcy50cyBkb2Vzbid0XG4gIC8vIHlldCBkZWNsYXJlIHRoZSBmaWVsZCwgc28gd2Ugd2lkZW4gaXQgbG9jYWxseSDigJQgdGhlIHZhbHVlIHBlcnNpc3RzIHdpdGhcbiAgLy8gdGhlIHJlc3Qgb2YgdGhlIG1lc3NhZ2UgSlNPTiBhbmQgcm91bmQtdHJpcHMgdGhyb3VnaCBleHBvcnQuXG4gIHR5cGUgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QgPSBQYWdlTWVzc2FnZSAmIHtzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH07XG4gIC8vIFNuYXBzaG90cyB0aGF0IGFycml2ZWQgYmVmb3JlIGEgcGFnZS1ncm91cCByZWNvcmQgZXhpc3RzIGZvciB0aGVpciBVUkwuXG4gIC8vIEFwcGxpZWQgd2hlbiB0aGUgcGFnZSBoZWFkZXIgaXMgbGF0ZXIgY3JlYXRlZCAoc2VlIG9uQ2FwdHVyZSkuXG4gIGNvbnN0IHBlbmRpbmdTbmFwc2hvdHMgPSBuZXcgTWFwPHN0cmluZywgUGFnZVNuYXBzaG90PigpO1xuICBjb25zdCBhcHBseVNuYXBzaG90VG9QYWdlID0gKHNuYXA6IFBhZ2VTbmFwc2hvdCk6IGJvb2xlYW4gPT4ge1xuICAgIC8vIEF0dGFjaCB0byB0aGUgbW9zdCByZWNlbnQgcGFnZS1ncm91cCByZWNvcmQgZm9yIHRoaXMgVVJMLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJyAmJiBtLnVybCA9PT0gc25hcC51cmwpIHtcbiAgICAgICAgKG0gYXMgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QpLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3Qgb25QYWdlU25hcHNob3QgPSAocGF5bG9hZDogUGFnZVNuYXBzaG90KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYXlsb2FkPy51cmwpIHJldHVybjtcbiAgICBpZiAoYXBwbHlTbmFwc2hvdFRvUGFnZShwYXlsb2FkKSkge1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHBhZ2UgcmVjb3JkIHlldCDigJQgc3Rhc2ggZm9yIHRoZSBuZXh0IGNhcHR1cmUgb24gdGhpcyBVUkwuXG4gICAgICBwZW5kaW5nU25hcHNob3RzLnNldChwYXlsb2FkLnVybCwgcGF5bG9hZCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uRmVlZGJhY2tBZGQgPSAoe3NlbGVjdG9yLCB0ZXh0LCB1cmwsIHBhcmVudFVpZH06IHtzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfSk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAvLyAgIDEuIHBhcmVudFVpZCDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IHN1cHBsaWVkIGEgc3RhYmxlIHVpZCAodGhlXG4gICAgLy8gICAgICBzdHJvbmdlc3QgbWF0Y2g7IHN1cnZpdmVzIHNlbGVjdG9yIGNoYW5nZXMsIHNpYmxpbmdcbiAgICAvLyAgICAgIGNvbGxpc2lvbnMsIG11bHRpcGxlIGNhcHR1cmVzIG9mIHRoZSBzYW1lIGVsZW1lbnQpLlxuICAgIC8vICAgMi4gc2VsZWN0b3IgKyB1cmwg4oCUIGNvbXBvc2l0ZSBrZXk7IHByZXZlbnRzIGNyb3NzLXBhZ2VcbiAgICAvLyAgICAgIGNvbnRhbWluYXRpb24gd2hlbiB0aGUgc2FtZSBzZWxlY3RvciBleGlzdHMgb24gbXVsdGlwbGUgVVJMcy5cbiAgICAvLyAgIDMuIHNlbGVjdG9yICsgbGl2ZVRhYlVybCDigJQgZmFsbGJhY2sgd2hlbiB0aGUgbWVzc2FnZSBkaWRuJ3RcbiAgICAvLyAgICAgIGNhcnJ5IGFuIGV4cGxpY2l0IHVybCAob2xkZXIgY29udGVudC1zY3JpcHQgbWVzc2FnZXMpLlxuICAgIGxldCBpZHggPSAtMTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnVpZCA9PT0gcGFyZW50VWlkKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnN0IHdhbnRVcmwgPSB1cmwgPz8gbGl2ZVRhYlVybCA/PyBudWxsO1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PlxuICAgICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcidcbiAgICAgICAgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3JcbiAgICAgICAgJiYgKCF3YW50VXJsIHx8IG0uZW50cnkudXJsID09PSB3YW50VXJsKSk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnb25GZWVkYmFja0FkZDogbm8gcGFyZW50IGZvdW5kJywge3NlbGVjdG9yLCB1cmwsIHBhcmVudFVpZH0pO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGxvc3QgaXRzIHBhcmVudCDigJQgY2hlY2sgdGhlIGFjdGl2ZSBjYXB0dXJlJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHBhcmVudE1zZyA9IG1lc3NhZ2VzW2lkeF0gYXMgU2VsZWN0b3JNZXNzYWdlO1xuICAgIGxldCBpbnNlcnRBdCA9IGlkeCArIDE7XG4gICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIG5ldyBmZWVkYmFjayByb3cgc28gdGhlIGV4cG9ydCBjYXJyaWVzXG4gICAgLy8gdGhlIEZLIGxpbmsgZXhwbGljaXRseSAobm90IGp1c3QgYnkgY2FwdHVyZS1hZGphY2VuY3kpLlxuICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICBwYXJlbnRVaWQ6IHBhcmVudE1zZy5lbnRyeS51aWQsXG4gICAgfSk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnQ29tbWVudCBhZGRlZCBmcm9tIHBhZ2UnKTtcbiAgICAvLyBFdmVyeSBmZWVkYmFjayBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LiBJZiB0aGUgcGFyZW50XG4gICAgLy8gY2FwdHVyZSBkaWRuJ3QgZ2V0IG9uZSAoYXV0b1NjcmVlbnNob3Qgb2ZmLCBza2lwU2NyZWVuc2hvdEhvc3RzXG4gICAgLy8gaGl0LCBuZXR3b3JrIGdsaXRjaCksIHJlLWZpcmUgbm93LlxuICAgIGlmICghcGFyZW50TXNnLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudE1zZyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUGVuZGluZ0FkZCA9ICh7ZW50cnl9OiB7ZW50cnk6IEVudHJ5fSk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkucHVzaChlbnRyeSk7IHJlbmRlcigpOyB9O1xuICBjb25zdCBvblBlbmRpbmdDbGVhciA9ICgpOiB2b2lkID0+IHsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyB9O1xuXG4gIGNvbnN0IGZpbmREdXBsaWNhdGUgPSAoc2VsZWN0b3I6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT5cbiAgICBtZXNzYWdlcy5maW5kKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT5cbiAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvciAmJiAoIXVybCB8fCBtLmVudHJ5LnVybCA9PT0gdXJsKSk7XG5cbiAgLy8gRmluZCBhbiBleGlzdGluZyBjYXB0dXJlIGZvciB0aGUgYWN0aXZlIHRhYiArIHNlbGVjdG9yLiBDcm9zcy1wYWdlXG4gIC8vIGNvbnRhbWluYXRpb24gcHJldmVudGlvbiAoc2VlIHR5cGVzLnRzIGZlZWRiYWNrLWFkZCBkb2NzdHJpbmcpOlxuICAvLyBhIHNlbGVjdG9yIGFsb25lIGlzIE5PVCBhIHN0YWJsZSBpZGVudGl0eSDigJQgYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gXG4gIC8vIGV4aXN0cyBvbiBldmVyeSBwYWdlOyBgYnV0dG9uYCBpcyBldmVyeXdoZXJlLiBTdHJvbmcgaWRlbnRpdHkgaXNcbiAgLy8gKHNlbGVjdG9yICsgdXJsKS4gUmV0dXJucyB0aGUgbW9zdCByZWNlbnQgbWF0Y2ggc28gcmUtaG92ZXJpbmcgYW5cbiAgLy8gYWxyZWFkeS1jYXB0dXJlZCBlbGVtZW50IHJlc29sdmVzIGNvbnNpc3RlbnRseS5cbiAgY29uc3QgZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZSA9IChzZWxlY3Rvcjogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBjb25zdCB1cmwgPSBsaXZlVGFiVXJsO1xuICAgIC8vIFdhbGsgYmFja3dhcmRzIHNvIHRoZSBtb3N0IHJlY2VudCBtYXRjaGluZyBjYXB0dXJlIHdpbnMgd2hlbiBhXG4gICAgLy8gc2VsZWN0b3IgbGVnaXRpbWF0ZWx5IGhhcyBtdWx0aXBsZSBjYXB0dXJlcyBvbiB0aGUgc2FtZSBwYWdlXG4gICAgLy8gKGUuZy4sIHRoZSB1c2VyIHJlLWNhcHR1cmVkIHRoZSBzYW1lIGVsZW1lbnQgYWZ0ZXIgZWRpdHMpLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSBjb250aW51ZTtcbiAgICAgIGlmICh1cmwgJiYgbS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBjYW5vbmljYWxFbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgdGFnOiBlLnRhZywgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHRleHQ6IGUudGV4dCwgcm9sZTogZS5yb2xlLFxuICAgIGF0dHJzOiBlLmF0dHJzLCBjbGFzc2VzOiBlLmNsYXNzZXMsXG4gICAgcmVjdDogZS5yZWN0LCBvdXRlckhUTUw6IGUub3V0ZXJIVE1MLFxuICAgIHN0eWxlczogZS5zdHlsZXMsIG1hdGNoZWRSdWxlczogZS5tYXRjaGVkUnVsZXMsXG4gIH0pO1xuXG4gIGNvbnN0IG9uQ2FwdHVyZSA9ICh7ZW50cnksIHBhZ2UsIGdyb3VwZWR9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdjYXB0dXJlJ30+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFlbnRyeSB8fCAhcGFnZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2UudXJsO1xuICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKHBhZ2UudXJsKTtcbiAgICBpZiAoZ3JvdXBlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgICAgZ3JvdXAucHVzaChlbnRyeSk7XG4gICAgICAgICAgbS5lbnRyeS5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7IGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgICAgLy8gRmlyZSBhIGdyb3VwIHNob3QgdXNpbmcgdGhlIGhlYWQgKyBtZW1iZXJzLiBUaGUgaGVhZCdzIHNlbGVjdG9yXG4gICAgICAgICAgLy8gaXMgbS5lbnRyeS5zZWxlY3RvcjsgbWVtYmVycycgc2VsZWN0b3JzIGFyZSBpbiB0aGUgZnJlc2hseVxuICAgICAgICAgIC8vIG11dGF0ZWQgZ3JvdXAgYXJyYXkuXG4gICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW20uZW50cnkuc2VsZWN0b3IsIC4uLihtLmVudHJ5Lmdyb3VwID8/IFtdKS5tYXAoKGcpID0+IGcuc2VsZWN0b3IpXTtcbiAgICAgICAgICB2b2lkIGZpcmVHcm91cFNob3QobSwgc2VsZWN0b3JzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRHVwZSBkZXRlY3Rpb24uIENyb3NzLWNvbnRhbWluYXRpb24gZml4OiBhIChzZWxlY3RvciwgdXJsKSBtYXRjaFxuICAgIC8vIGlzIE5FQ0VTU0FSWSBidXQgbm90IFNVRkZJQ0lFTlQg4oCUIHR3byBzaWJsaW5nIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgLy8gc2FtZSB0ZXN0SWQgLyBzYW1lIHJvbGUvYXJpYSBzZWxlY3RvciBsaXZlIG9uIHRoZSBzYW1lIFVSTCBidXRcbiAgICAvLyBhcmUgZGlmZmVyZW50IGNhcHR1cmVzLiBDb21wYXJlIHRoZSBjYW5vbmljYWwtZW50cnkgaGFzaCAod2hpY2hcbiAgICAvLyBpbmNsdWRlcyByZWN0LCB0ZXh0LCBvdXRlckhUTUwsIGV0Yy4pIGJlZm9yZSB0cmVhdGluZyB0aGUgbmV3XG4gICAgLy8gY2FwdHVyZSBhcyBhIHJlZnJlc2ggb2YgdGhlIG9sZCBvbmUuIFdoZW4gdGhlIGhhc2ggZGlmZmVycywgd2VcbiAgICAvLyBrZWVwIEJPVEggY2FwdHVyZXMgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcuXG4gICAgY29uc3QgZHVwZSA9IGZpbmREdXBsaWNhdGUoZW50cnkuc2VsZWN0b3IsIGVudHJ5LnVybCk7XG4gICAgaWYgKGR1cGUpIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IGNhbm9uaWNhbEVudHJ5KGR1cGUuZW50cnkpO1xuICAgICAgY29uc3QgYWZ0ZXIgPSBjYW5vbmljYWxFbnRyeShlbnRyeSk7XG4gICAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBIYXNoZXMgZGlmZmVyLiBUd28gY2FzZXM6XG4gICAgICAvLyAgIChhKSBTYW1lIGVsZW1lbnQgcmUtY2FwdHVyZWQgYWZ0ZXIgY29udGVudCBjaGFuZ2Ug4oCUIHRoZSByZWN0XG4gICAgICAvLyAgICAgICBzdGF5cyBwdXQgKHdpdGhpbiBhIGZldyBweCksIGJ1dCB0ZXh0L291dGVySFRNTCBtb3ZlZC5cbiAgICAgIC8vICAgICAgIFRyZWF0IGFzIGEgcmVmcmVzaC5cbiAgICAgIC8vICAgKGIpIERpZmZlcmVudCBlbGVtZW50IHRoYXQgaGFwcGVucyB0byBzaGFyZSBhIHNlbGVjdG9yIOKAlCB0aGVcbiAgICAgIC8vICAgICAgIHJlY3QgaXMgaW4gYSBkaWZmZXJlbnQgcG9zaXRpb24uIFRyZWF0IGFzIGEgbmV3IGNhcHR1cmUuXG4gICAgICAvLyBXZSBkaXNjcmltaW5hdGUgYnkgcmVjdCBvdmVybGFwOiBpZiBib3RoIHJlY3RzIGV4aXN0IGFuZCB0aGVpclxuICAgICAgLy8gY2VudGVycyBhcmUgd2l0aGluIDhweCBvbiBib3RoIGF4ZXMsIHJlZnJlc2g7IG90aGVyd2lzZSBrZWVwXG4gICAgICAvLyBib3RoLlxuICAgICAgY29uc3QgcjEgPSBkdXBlLmVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCByMiA9IGVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCBzYW1lRWxlbWVudCA9IHIxICYmIHIyXG4gICAgICAgICYmIE1hdGguYWJzKChyMS54ICsgcjEudyAvIDIpIC0gKHIyLnggKyByMi53IC8gMikpIDw9IDhcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnkgKyByMS5oIC8gMikgLSAocjIueSArIHIyLmggLyAyKSkgPD0gODtcbiAgICAgIGlmIChzYW1lRWxlbWVudCkge1xuICAgICAgICBkZWxldGUgZHVwZS5kdXBlUGVuZGluZztcbiAgICAgICAgZHVwZS5lbnRyeSA9IGVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFVwZGF0ZWQgIyR7ZHVwZS5lbnRyeS5ufWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlmZmVyZW50IGVsZW1lbnQgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciDihpIgZmFsbCB0aHJvdWdoIGFuZFxuICAgICAgLy8gZW1pdCBhcyBhIG5ldyBjYXB0dXJlLiBUaGUgYWdlbnQgcmVhZGluZyB0aGUgZXhwb3J0IHNlZXMgYm90aFxuICAgICAgLy8gcm93cyB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIGJ1dCBkaWZmZXJlbnQgdWlkcyArIHJlY3RzLlxuICAgIH1cbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCB0aGUgc2Vzc2lvbiBGSyBzbyB0aGUgY29uc3VtZXIgY2FuIGpvaW4gZW50cmllcyB0byB0aGVpclxuICAgIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLlxuICAgIGlmIChzZXNzaW9uSWQpIGVudHJ5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICBjb25zdCBuZXdNc2c6IFNlbGVjdG9yTWVzc2FnZSA9IHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzLCBlbnRyeX07XG4gICAgLy8gUGFnZSByb3dzIGV4aXN0IG9ubHkgYXMgaGVhZGVycyBmb3IgY2FwdHVyZWQgc2VsZWN0b3JzLiBEbyBub3QgY3JlYXRlXG4gICAgLy8gdGhlbSBmcm9tIHRhYiBhY3RpdmF0aW9uLCB2YWxpZGF0aW9uLCBvciBwcmVmZXJlbmNlIGNoYW5nZXM7IGluc2VydCBvbmVcbiAgICAvLyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGZpcnN0IHNlbGVjdG9yIG9mIGEgbmV3IHBhZ2UgYmxvY2suXG4gICAgbGV0IHByZXZpb3VzUGFnZTogUGFnZU1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gcG9zaXRpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJykgeyBwcmV2aW91c1BhZ2UgPSBtOyBicmVhazsgfVxuICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzUGFnZSB8fCBwcmV2aW91c1BhZ2UudXJsICE9PSBwYWdlLnVybCkge1xuICAgICAgY29uc3QgcGFnZU1zZzogUGFnZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHVybDogcGFnZS51cmwsIHRpdGxlOiBwYWdlLnRpdGxlLCB2aWV3cG9ydDogcGFnZS52aWV3cG9ydCwgdG9rZW5zOiBwYWdlLnRva2VucyxcbiAgICAgICAgdXNlckFnZW50OiBwYWdlLnVzZXJBZ2VudCwgbGFuZzogcGFnZS5sYW5nLFxuICAgICAgICBnaXRDb250ZXh0OiAocGFnZSBhcyBhbnkpLmdpdENvbnRleHQsXG4gICAgICAgIHJvdXRlOiAocGFnZSBhcyBhbnkpLnJvdXRlLFxuICAgICAgICBzdGF0ZTogKHBhZ2UgYXMgYW55KS5zdGF0ZSxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgfTtcbiAgICAgIC8vIEF0dGFjaCBhbnkgcGFnZS1zbmFwc2hvdCB0aGF0IGFycml2ZWQgYmVmb3JlIHRoaXMgcGFnZSBoZWFkZXIgZXhpc3RlZC5cbiAgICAgIGNvbnN0IHBlbmRpbmcgPSBwZW5kaW5nU25hcHNob3RzLmdldChwYWdlLnVybCk7XG4gICAgICBpZiAocGVuZGluZykge1xuICAgICAgICAocGFnZU1zZyBhcyBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCkuc25hcHNob3QgPSBwZW5kaW5nO1xuICAgICAgICBwZW5kaW5nU25hcHNob3RzLmRlbGV0ZShwYWdlLnVybCk7XG4gICAgICB9XG4gICAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIHBhZ2VNc2cpO1xuICAgICAgcG9zaXRpb24rKztcbiAgICB9XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBuZXdNc2cpO1xuICAgIHBlcnNpc3QoKTtcbiAgICAvLyBJbnRlbnRpb25hbGx5IE5PIHNldExhc3RBY3RpdmUoZW50cnkuc2VsZWN0b3IpIGhlcmUg4oCUIHRoZSB1c2VyIGFza2VkXG4gICAgLy8gZm9yIGZyZXNoIGNhcHR1cmVzIHRvIHN0YXkgdW4taGlnaGxpZ2h0ZWQgaW4gdGhlIHNpZGViYXIuIFRoZSBzdGlja3lcbiAgICAvLyByaW5nICsgbGFzdC1hY3RpdmUgb3V0bGluZSBub3cgb25seSBnZXQgYXBwbGllZCBvbiBleHBsaWNpdFxuICAgIC8vIGhvdmVyL2NsaWNrIG9mIHRoZSBzaWRlYmFyIGJ1YmJsZSAoYW5kIHRoZSBwYWdlLXNpZGUgZmxhc2ggZnJvbVxuICAgIC8vIGNhcHR1cmVFbnRyeSBzdGlsbCBjb25maXJtcyB0aGUgY2FwdHVyZSB2aXN1YWxseSBvbiB0aGUgcGFnZSkuXG4gICAgcmVuZGVyKCk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChuZXdNc2cpO1xuICAgIHZvaWQgZmlyZVBhZ2VTaG90SWZOZWVkZWQobmV3TXNnKTtcbiAgICB2b2lkIHJ1blZhbGlkYXRpb24oKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU2NyZWVuc2hvdCB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEZpcmUgdGhlIHBlci1lbGVtZW50IHNob3QsIGF0dGFjaCB0aGUgcmV0dXJuZWQgZmlsZW5hbWUgKyBkYXRhVXJsIG9udG9cbiAgLy8gdGhlIGVudHJ5LCBhbmQgcGVyc2lzdC4gc2hvdWxkU2tpcFNjcmVlbnNob3QgYmFpbHMgb24gaG9zdHMgaW4gdGhlXG4gIC8vIHVzZXIncyBza2lwIGxpc3Q7IGF1dG9TY3JlZW5zaG90PWZhbHNlIGJhaWxzIGdsb2JhbGx5LlxuICBjb25zdCBmaXJlRWxlbWVudFNob3QgPSBhc3luYyAobXNnOiBTZWxlY3Rvck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogYXV0b1NjcmVlbnNob3Q9ZmFsc2UnKTtcbiAgICAgIC8vIEJ1ZyAjMjogdGVsbCB0aGUgZXhwb3J0IHdoeSB0aGUgc2hvdCBpcyBtaXNzaW5nLlxuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7Li4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSwgdW5hdmFpbGFibGVSZWFzb246ICdhdXRvU2NyZWVuc2hvdE9mZid9O1xuICAgICAgLy8gUmUtcmVuZGVyIHNvIHRoZSByZXNlcnZlZCBza2VsZXRvbiAod2hpY2ggYXNzdW1lZCBhIHNob3Qgd2FzIGNvbWluZylcbiAgICAgIC8vIGNvbGxhcHNlcyBub3cgdGhhdCB3ZSBrbm93IG9uZSB3b24ndCBhcnJpdmUuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogaG9zdCBvbiBza2lwIGxpc3QnLCBtc2cuZW50cnkudXJsKTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnc2tpcFNjcmVlbnNob3RIb3N0cyd9O1xuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCDihpInLCBtc2cuZW50cnkuc2VsZWN0b3IpO1xuICAgIC8vIFNXIGNvbGQtc3RhcnQgcmFjZTogdGhlIEZJUlNUIGNhcHR1cmUgaW4gYSBzZXNzaW9uIG9mdGVuIGxvc2VzIGl0c1xuICAgIC8vIGZpcnN0IG1lc3NhZ2UgYmVjYXVzZSB0aGUgYmcgd29ya2VyIGlzIHN0aWxsIHN0YXJ0aW5nLiBSZXRyeSBvbmNlXG4gICAgLy8gYWZ0ZXIgYSBzaG9ydCBkZWxheSBpZiB0aGUgZmlyc3QgY2FsbCBjb21lcyBiYWNrIG51bGwvZW1wdHkuXG4gICAgbGV0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseSB8fCAoIXJlcGx5Lm9rICYmICFyZXBseS5lcnJvcikpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcnN0IHNjcmVlbnNob3QgcmVwbHkgd2FzIGVtcHR5OyByZXRyeWluZyBhZnRlciAyMDBtcyAoU1cgY29sZC1zdGFydCknKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIDIwMCkpO1xuICAgICAgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCByZXBseTonLCByZXBseSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSB7XG4gICAgICBzZXRTdGF0dXMoYFNjcmVlbnNob3QgZmFpbGVkOiAke3JlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJ31gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgdW5hdmFpbGFibGVSZWFzb246IHJlcGx5Py5lcnJvciA/PyAnY2FwdHVyZUZhaWxlZCcsXG4gICAgICB9O1xuICAgICAgLy8gQ29sbGFwc2UgdGhlIHJlc2VydmVkIHNrZWxldG9uIOKAlCBubyBzaG90IGlzIGNvbWluZyBmb3IgdGhpcyBjYXB0dXJlLlxuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFN1Y2Nlc3NmdWwgcmV0cnkg4oCUIHN0cmlwIGFueSBwcmlvciB1bmF2YWlsYWJsZVJlYXNvbiBzaW5jZSB3ZSBub3dcbiAgICAvLyBoYXZlIGEgcmVhbCBzaG90LlxuICAgIGRlbGV0ZSBtc2cuZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZWxlbWVudDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAuLi4ocmVwbHkuY3JvcCA/IHtjcm9wOiByZXBseS5jcm9wfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaXJlIHRoZSBncm91cCBzaG90ICh1bmlvbiBiYm94IG9mIGhlYWQgKyBhbGwgbWVtYmVycykgYW5kIHN0YXNoIHRoZVxuICAvLyBmaWxlbmFtZSBvbiB0aGUgaGVhZC1vZi1ncm91cCBlbnRyeS5cbiAgY29uc3QgZmlyZUdyb3VwU2hvdCA9IGFzeW5jIChoZWFkOiBTZWxlY3Rvck1lc3NhZ2UsIHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KGhlYWQuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1ncm91cCcsIHNlbGVjdG9ycywgbjogaGVhZC5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIGhlYWQuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihoZWFkLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZ3JvdXA6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkgeyBzaG90c0Z1bGwuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTsgcGVyc2lzdFNob3RzRnVsbCgpOyB9XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIFBhZ2UtbGV2ZWwgc2hvdCBvbmNlIHBlciAod29ya3NwYWNlLCBwYWdlLXVybCwgZGF5KS4gU3Vic2VxdWVudCBjYXB0dXJlc1xuICAvLyBvbiB0aGUgc2FtZSBwYWdlIHJldXNlIHRoZSBzYW1lIG9uLWRpc2sgZmlsZSBwYXRoLlxuICBjb25zdCBmaXJlUGFnZVNob3RJZk5lZWRlZCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICAvLyBQZXItY2FwdHVyZSBwYWdlLXNob3QgbW9kZSAowqc0LjUpOiB3aGVuIGVuYWJsZWQsIHNraXAgdGhlXG4gICAgLy8gcGVyLSh3b3Jrc3BhY2UsIHVybCkgZGVkdXBlIGFuZCBmaXJlIGEgZnJlc2ggcGFnZSBzaG90IGV2ZXJ5IHRpbWUuXG4gICAgLy8gVXNlZnVsIHdoZW4gdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzIChtb2RhbCBvcGVucyxcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3csIGV0Yy4pIGFuZCB0aGUgdXNlciB3YW50cyB0byBzZWUgdGhlIHdob2xlIHBhZ2UgYXRcbiAgICAvLyBlYWNoIHN0ZXAuIENvc3RzIG9uZSBmdWxsLXBhZ2UgUE5HIHBlciBjYXB0dXJlLCBzbyBkZWZhdWx0IG9mZi5cbiAgICBpZiAoIXByZWZzLnBhZ2VTaG90UGVyQ2FwdHVyZSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFnZVNob3RLZXkobXNnLmVudHJ5LnVybCk7XG4gICAgICBpZiAocGFnZVNob3RzRmlyZWQuaGFzKGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kRXhpc3RpbmdQYWdlU2hvdChtc2cuZW50cnkudXJsKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICAgICAgcGFnZTogZXhpc3RpbmcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGFnZVNob3RzRmlyZWQuYWRkKGtleSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1wYWdlJywgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgLy8gQXBwbHkgdG8gVEhJUyBlbnRyeSBhbmQgdG8gYW55IG90aGVyIGVudHJpZXMgYWxyZWFkeSBjYXB0dXJlZCBvbiB0aGVcbiAgICAvLyBzYW1lIFVSTCB0b2RheSAoc28gdGhlIHBhZ2Utc2hvdCBhcHBlYXJzIHVuaWZvcm1seSkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gbXNnLmVudHJ5LnVybCkgY29udGludWU7XG4gICAgICBtLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICBwYWdlOiByZXBseS5maWxlbmFtZSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFN0YXNoIHRoZSBmdWxsIFBORyBzbyB0aGUgd29ya3NwYWNlIGFyY2hpdmUgY2FuIGJ1bmRsZSBpdC4gS2V5ZWRcbiAgICAvLyBieSBVUkwgc2luY2UgcGFnZSBzaG90cyBhcmUgcGFnZS1zY29wZWQsIG5vdCBzZWxlY3Rvci1zY29wZWQuXG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KCdwYWdlOjonICsgbXNnLmVudHJ5LnVybCwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmluZCBhbnkgc2VsZWN0b3IgZW50cnkgb24gdGhpcyBVUkwgdGhhdCBhbHJlYWR5IGhhcyBhIGBwYWdlYCBzaG90XG4gIC8vIHJlY29yZGVkIOKAlCB1c2VkIHNvIHRoYXQgcmV0cm9hY3RpdmUgY2FwdHVyZXMgaW5oZXJpdCB0aGUgZXhpc3RpbmcgUE5HXG4gIC8vIHBhdGggaW5zdGVhZCBvZiByZWZpcmluZy5cbiAgY29uc3QgZmluZEV4aXN0aW5nUGFnZVNob3QgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgcmV0dXJuIG0uZW50cnkuc2NyZWVuc2hvdC5wYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBvbkhvdmVyID0gKHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTogdm9pZCA9PiB7XG4gICAgc2V0U3RhdHVzKGBBbHQtaG92ZXIgwrcgJHtsYWJlbH1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgLy8gSWRlbnRpdHkgaXMgKHNlbGVjdG9yLCB1cmwpLiBTYW1lIHNlbGVjdG9yIG9uIHR3byBkaWZmZXJlbnQgVVJMc1xuICAgIC8vIGlzIHR3byBkaWZmZXJlbnQgY2FwdHVyZXM7IHRoZSBwcmV2aW91cyBzZWxlY3Rvci1vbmx5IGxvb2t1cFxuICAgIC8vIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi4gUHJlZmVyIHNhbWUtVVJMICtcbiAgICAvLyBzYW1lLXNlbGVjdG9yIGFzIHRoZSBzdHJvbmdlc3QgbWF0Y2guXG4gICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSBzY3JvbGxNZXNzYWdlSW50b1ZpZXcoZXhpc3RpbmcuaWQpO1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihleGlzdGluZy5pZCk7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7dWlkOiBleGlzdGluZy5lbnRyeS51aWQsIG46IGV4aXN0aW5nLmVudHJ5Lm4sIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFja319KTtcbiAgICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXIoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBTFdBWVMgc2hvdyB0aGUgY29tbWVudCBib3gsIGV2ZW4gZm9yIHVuY2FwdHVyZWQgZWxlbWVudHMuIE9uIHN1Ym1pdFxuICAgICAgLy8gdGhlIGNvbnRlbnQgc2NyaXB0IHdpbGwgY2FwdHVyZSB0aGUgZWxlbWVudCBmaXJzdCwgdGhlbiBhdHRhY2ggdGhlXG4gICAgICAvLyBjb21tZW50IOKAlCB0dXJuaW5nIGhvdmVyLWNvbW1lbnQgaW50byBhIGNhcHR1cmUrY29tbWVudCBzaG9ydGN1dC5cbiAgICAgIHBoYW50b21UYXJnZXQgPSB7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3Q6IHJlY3QgYXMgdW5rbm93biBhcyBET01SZWN0fTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHtjYXB0dXJlZDogZmFsc2UsIGZlZWRiYWNrOiBbXX19KTtcbiAgICAgIHJlbmRlclBoYW50b20oKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudD8uc3RhcnRzV2l0aCgnQWx0LWhvdmVyJykpIHN0YXR1cy50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXJQaGFudG9tKCk7IH1cbiAgICAvLyBObyBhbm5vdGF0aW9uLWNsZWFyIGhlcmUg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBrZWVwcyB0aGUgYm94IG9wZW4gc28gdGhlXG4gICAgLy8gdXNlciBjYW4gbW91c2UgdG8gaXQgYW5kIHR5cGUuIE91dHNpZGUtY2xpY2sgLyBFc2MgZGlzbWlzcyBpdC5cbiAgfTtcblxuICBjb25zdCBjb2xsZWN0RmVlZGJhY2tBZnRlciA9IChzZWxlY3RvcklkOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKCFmb3VuZCkgeyBpZiAobS5pZCA9PT0gc2VsZWN0b3JJZCkgZm91bmQgPSB0cnVlOyBjb250aW51ZTsgfVxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyB8fCBtLnR5cGUgPT09ICdwYWdlJykgYnJlYWs7XG4gICAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSBvdXQucHVzaChtLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IGNlbnRlckVsZW1lbnRJbkxpc3QgPSAoZWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgbGlzdFJlY3QgPSBsaXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRhcmdldCA9IGxpc3Quc2Nyb2xsVG9wICsgZWxSZWN0LnRvcCAtIGxpc3RSZWN0LnRvcCAtIChsaXN0LmNsaWVudEhlaWdodCAvIDIpICsgKGVsUmVjdC5oZWlnaHQgLyAyKTtcbiAgICBsaXN0LnNjcm9sbFRvKHt0b3A6IE1hdGgubWF4KDAsIHRhcmdldCksIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICB9O1xuXG4gIGNvbnN0IHNjcm9sbE1lc3NhZ2VJbnRvVmlldyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGNlbnRlckVsZW1lbnRJbkxpc3QoZWwpO1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoLWludG8tdmlldycpO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gtaW50by12aWV3Jyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0aWNreSBoaWdobGlnaHQgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2V0TGFzdEFjdGl2ZSA9IChzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhcm1TdGlja3lFeHBpcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBzdGlja3lUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcGFuZWxIb3ZlcmVkKSB7XG4gICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yLmxhc3QtYWN0aXZlJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtYWN0aXZlJyk7XG4gICAgICB9IGVsc2UgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSwgU1RJQ0tZX1RUTF9NUyk7XG4gIH07XG5cbiAgLy8gRmFzdCBzdGlja3ktY2xlYXI6IHdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBwYW5lbCwgZmlyZVxuICAvLyBzdGlja3ktY2xlYXIgYWZ0ZXIgYSAzMDAgbXMgZ3JhY2Ugd2luZG93LiBQcmlvciBiZWhhdmlvciB3YWl0ZWQgdGhlXG4gIC8vIGZ1bGwgU1RJQ0tZX1RUTF9NUyAofjUgcykgd2hpY2ggZmVsdCBsaWtlIHRoZSBwYWdlLXNpZGUgaGlnaGxpZ2h0XG4gIC8vIFwiZG9lc24ndCBnbyBhd2F5IGV2ZW4gYWZ0ZXIgSSB1bmhvdmVyXCIuIDMwMCBtcyBpcyBzaG9ydCBlbm91Z2ggdG9cbiAgLy8gZmVlbCByZXNwb25zaXZlIGJ1dCBsb25nIGVub3VnaCB0aGF0IGEgcXVpY2sgcmVwb3NpdGlvbiAoZS5nLlxuICAvLyBhY2NpZGVudGFsbHkgY3Jvc3NpbmcgdGhlIHNlYW0pIGRvZXNuJ3Qga2lsbCB0aGUgcmluZyBtaWQtZmxpZ2h0LlxuICBsZXQgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSB0cnVlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSB7IGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTsgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7IH1cbiAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgfSk7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpO1xuICAgIHN0aWNreUNsZWFyR3JhY2UgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgLy8gQWxzbyBkcm9wIG91ciBvd24gZnJvbS1wYW5lbCArIG11bHRpIHJpbmdzIGluIGNhc2UgdGhleSBsZWFrZWQuXG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGVpciBtb3VzZSBpbnRvIHRoZSBwYW5lbCwgc3VwcHJlc3MgcGFnZS1zaWRlXG4gICAgLy8gYWx0LWhvdmVyIHN0YXRlIHNvIHRoZSBvcmFuZ2UgcmluZyBkb2Vzbid0IGtlZXAgZm9sbG93aW5nIHRoZSBjdXJzb3IuXG4gICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgUmVuZGVyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBORUFSX0JPVFRPTV9QWCA9IDgwO1xuICBjb25zdCB3YXNOZWFyQm90dG9tID0gKCk6IGJvb2xlYW4gPT5cbiAgICBsaXN0LnNjcm9sbEhlaWdodCAtIGxpc3Quc2Nyb2xsVG9wIC0gbGlzdC5jbGllbnRIZWlnaHQgPD0gTkVBUl9CT1RUT01fUFg7XG5cbiAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9IChtOiBQYW5lbE1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAvLyBNYXRjaCBhZ2FpbnN0IHRoZSBXSE9MRSBlbnRyeSAoc2VsZWN0b3IsIHRleHQsIGNsYXNzZXMsIGF0dHJzLFxuICAgICAgLy8gb3V0ZXJIVE1MLCBzdHlsZXMsIGV0Yy4pIHNvIHNlYXJjaCBoaXRzIGFueXRoaW5nIHZpc2libGUgaW4gdGhlXG4gICAgICAvLyBib2R5LWpzb24uIFN0cmluZ2lmeWluZyBvbmNlIGlzIGZpbmUg4oCUIHRoZSBjb3N0IGlzIHRpbnkgdnMgcmVuZGVyLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgfVxuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIChtLnVybCArICcgJyArIChtLnRpdGxlID8/ICcnKSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSBidWJibGUncyBib2R5LWpzb24gKG9yIG91dGVySFRNTCkgY29udGFpbnMgdGhlIHNlYXJjaCDigJRcbiAgLy8gdGVsbHMgcmVuZGVyU2VsZWN0b3IgdG8gYXV0by1leHBhbmQgc28gdGhlIHVzZXIgc2VlcyB0aGUgaGlnaGxpZ2h0ZWQgaGl0LlxuICBjb25zdCBib2R5TWF0Y2hlc1NlYXJjaCA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG0uZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0UmFpbCA9IChiZWZvcmVJZDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnaW5zZXJ0LXJhaWwnO1xuICAgIGRpdi5kYXRhc2V0LmJlZm9yZUlkID0gYmVmb3JlSWQ7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50ID09PSBiZWZvcmVJZCkge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICBkaXYuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTsgcmVuZGVyKCk7IH0sXG4gICAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4gc2VuZElubGluZSh0ZXh0KSxcbiAgICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidG4uY2xhc3NOYW1lID0gJ2FkZC1idG4nO1xuICAgICAgYnRuLmRhdGFzZXQudGlwID0gJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZSc7XG4gICAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZScpO1xuICAgICAgYnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygncGx1cycsIDEyKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBiZWZvcmVJZDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlOyByZW5kZXIoKTsgfSk7XG4gICAgICBkaXYuYXBwZW5kKGJ0bik7XG4gICAgfVxuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgdHlwZSBJbmxpbmVDb21tZW50T3B0cyA9IHtcbiAgICBpbml0aWFsPzogc3RyaW5nO1xuICAgIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDtcbiAgICBvblN1Ym1pdD86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgYXV0b2ZvY3VzPzogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgYnVpbGRJbmxpbmVDb21tZW50ID0gKHtpbml0aWFsID0gJycsIG9uQ2FuY2VsLCBvblN1Ym1pdCwgYXV0b2ZvY3VzfTogSW5saW5lQ29tbWVudE9wdHMpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXAuY2xhc3NOYW1lID0gJ2lubGluZS1jb21tZW50JztcbiAgICBjb25zdCB0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgdGEudmFsdWUgPSBpbml0aWFsO1xuICAgIHRhLnJvd3MgPSAyO1xuICAgIHRhLnBsYWNlaG9sZGVyID0gJ0luc2VydCBhIGNvbW1lbnQgaGVyZSwgb3IgQWx0K0NsaWNrIHRvIGluc2VydCBhIGNhcHR1cmUnO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncm93JztcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIG1ldGEudGV4dENvbnRlbnQgPSAnMHcgwrcgMHQnO1xuICAgIC8vIEJvdGggU2F2ZSAvIENhbmNlbCBhcmUgdW5pZm9ybSBpY29uIGJ1dHRvbnMgKC5pY29uYnRuKS4gU2F2ZSB1c2VzIHRoZVxuICAgIC8vIHByaW1hcnkgYWNjZW50IHZhcmlhbnQgdmlhIC5wcmltYXJ5IHNvIGl0IHN0aWxsIHBvcHMsIGJ1dCBpdHMgd2lkdGhcbiAgICAvLyBtYXRjaGVzIENhbmNlbCBleGFjdGx5LlxuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIMK3IEVzYyc7XG4gICAgY2FuY2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgaW5saW5lIGNvbW1lbnQnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMjApO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uQ2FuY2VsPy4oKSk7XG4gICAgY29uc3Qgc2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbmQudHlwZSA9ICdidXR0b24nO1xuICAgIHNlbmQuY2xhc3NOYW1lID0gJ2ljb25idG4gcHJpbWFyeSc7XG4gICAgc2VuZC5kYXRhc2V0LnRpcCA9ICdTYXZlIMK3IEVudGVyJztcbiAgICBzZW5kLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdTYXZlIGlubGluZSBjb21tZW50Jyk7XG4gICAgc2VuZC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMjApO1xuICAgIGNvbnN0IHN1Ym1pdCA9ICgpOiB2b2lkID0+IG9uU3VibWl0Py4odGEudmFsdWUpO1xuICAgIHNlbmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXQpO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4geyBtZXRhLnRleHRDb250ZW50ID0gYCR7d29yZENvdW50KHRhLnZhbHVlKX13IMK3ICR7dG9rZW5Db3VudCh0YS52YWx1ZSl9dGA7IH0pO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBvbkNhbmNlbD8uKCk7XG4gICAgfSk7XG4gICAgcm93LmFwcGVuZChtZXRhLCBjYW5jZWwsIHNlbmQpO1xuICAgIHdyYXAuYXBwZW5kKHRhLCByb3cpO1xuICAgIGlmIChhdXRvZm9jdXMpIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0YS5mb2N1cygpKTtcbiAgICByZXR1cm4gd3JhcDtcbiAgfTtcblxuICBjb25zdCBzZW5kSW5saW5lID0gKHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRleHQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgIGlmICghdGV4dCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IGJlZm9yZUlkID0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQ7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGV0IHBvcyA9IGJlZm9yZUlkID8gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBiZWZvcmVJZCkgOiBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKHBvcyA8IDApIHBvcyA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAvLyBwYXJlbnRVaWQgcmVzb2x1dGlvbjogd2FsayBiYWNrIGZyb20gdGhlIGluc2VydCBwb3NpdGlvbiB0byB0aGVcbiAgICAvLyBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3Rvci4gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgdGhlIEZLLlxuICAgIGxldCBwSWR4ID0gcG9zIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfTtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zLCAwLCBmYik7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnSW5zZXJ0ZWQnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQaGFudG9tID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBoYW50b20nKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwaGFudG9tVGFyZ2V0KSByZXR1cm47XG4gICAgY29uc3QgcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwaC5jbGFzc05hbWUgPSAncGhhbnRvbSB2aXNpYmxlJztcbiAgICBwaC5pbm5lckhUTUwgPSBgPGNvZGU+JHtlc2NhcGVIdG1sKHBoYW50b21UYXJnZXQubGFiZWwpfTwvY29kZT5gO1xuICAgIGxpc3QuYXBwZW5kKHBoKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICAvLyBSZW9yZGVyIGEgZmxhdCBtZXNzYWdlIGxpc3Qgc28gc2VsZWN0b3JzIHdpdGhpbiBlYWNoIHBhZ2UtZGVsaW1pdGVkXG4gIC8vIGJsb2NrIGFyZSBzb3J0ZWQgYnkgdGhlaXIgdmlzdWFsIHJlY3QgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KS5cbiAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciAoY2FwdHVyZVxuICAvLyBhZGphY2VuY3kpIHNvIGVkaXRpbmcvdGhyZWFkaW5nIGJlaGF2aW9yIHN1cnZpdmVzIHRoZSBzb3J0LlxuICAvL1xuICAvLyBVc2VkIE9OTFkgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSAoYGJ1aWxkU2xpbWApLCBub3QgdGhlIHNpZGViYXJcbiAgLy8gcmVuZGVyLiBUaGUgc2lkZWJhciBrZWVwcyBtZXNzYWdlcyBpbiBpbnNlcnRpb24vY2FwdHVyZSBvcmRlciBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZW0gd2hlcmUgdGhleSBleHBlY3Q7IHRoZSBleHBvcnQgZ2V0cyB0aGUgYWdlbnQtXG4gIC8vIGZyaWVuZGx5IHJlYWRpbmctb3JkZXIgdHJlYXRtZW50LlxuICBjb25zdCByZW9yZGVyRm9yRXhwb3J0ID0gKG1zZ3M6IFBhbmVsTWVzc2FnZVtdKTogUGFuZWxNZXNzYWdlW10gPT4ge1xuICAgIHR5cGUgR3JvdXAgPSB7a2luZDogJ2dyb3VwJzsgc2VsOiBTZWxlY3Rvck1lc3NhZ2U7IHRyYWlsaW5nOiBGZWVkYmFja01lc3NhZ2VbXX07XG4gICAgdHlwZSBMb29zZSA9IHtraW5kOiAnbG9vc2UnOyBtOiBGZWVkYmFja01lc3NhZ2V9O1xuICAgIHR5cGUgU2xvdCA9IEdyb3VwIHwgTG9vc2UgfCB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX07XG4gICAgY29uc3Qgc2xvdHM6IFNsb3RbXSA9IFtdO1xuICAgIGxldCBjdXJHcm91cDogR3JvdXAgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBmbHVzaEdyb3VwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKGN1ckdyb3VwKSB7IHNsb3RzLnB1c2goY3VyR3JvdXApOyBjdXJHcm91cCA9IG51bGw7IH1cbiAgICB9O1xuICAgIGZvciAoY29uc3QgbSBvZiBtc2dzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBzbG90cy5wdXNoKHtraW5kOiAncGFnZScsIG19KTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgY3VyR3JvdXAgPSB7a2luZDogJ2dyb3VwJywgc2VsOiBtLCB0cmFpbGluZzogW119O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGV0YWNoZWQgY29tbWVudHMgbmV2ZXIgdHJhdmVsIHdpdGggdGhlIHByZWNlZGluZyBzZWxlY3RvcidzXG4gICAgICAgIC8vIGdyb3VwIOKAlCB0aGV5IHN0YXkgbG9vc2UgaW4gZXhwb3J0IG9yZGVyLlxuICAgICAgICBpZiAoY3VyR3JvdXAgJiYgIW0uZGV0YWNoZWQpIGN1ckdyb3VwLnRyYWlsaW5nLnB1c2gobSk7XG4gICAgICAgIGVsc2Ugc2xvdHMucHVzaCh7a2luZDogJ2xvb3NlJywgbX0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaEdyb3VwKCk7XG4gICAgY29uc3Qgb3V0OiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGxldCBydW5TdGFydCA9IDA7XG4gICAgY29uc3QgZmx1c2hSdW4gPSAoZW5kOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgICBjb25zdCBncm91cFJlY3RzOiBBcnJheTx7aWR4OiBudW1iZXI7IHk6IG51bWJlcjsgeDogbnVtYmVyfT4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSBydW5TdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByID0gcy5zZWwuZW50cnkucmVjdDtcbiAgICAgICAgICBncm91cFJlY3RzLnB1c2goe2lkeDogaSwgeTogcj8ueSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIHg6IHI/LnggPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kaWNlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgZ3JvdXBSZWN0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnkgIT09IGIueSkgcmV0dXJuIGEueSAtIGIueTtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICAgIH0pO1xuICAgICAgbGV0IGdpID0gMDtcbiAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByZXBsYWNlbWVudElkeCA9IGdyb3VwUmVjdHNbZ2krK10hLmlkeDtcbiAgICAgICAgICBjb25zdCByID0gc2xvdHNbcmVwbGFjZW1lbnRJZHhdISBhcyBHcm91cDtcbiAgICAgICAgICBvdXQucHVzaChyLnNlbCk7XG4gICAgICAgICAgZm9yIChjb25zdCBmIG9mIHIudHJhaWxpbmcpIG91dC5wdXNoKGYpO1xuICAgICAgICB9IGVsc2UgaWYgKHMua2luZCA9PT0gJ2xvb3NlJykge1xuICAgICAgICAgIG91dC5wdXNoKHMubSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzbG90c1tpXSEua2luZCA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoUnVuKGkpO1xuICAgICAgICBvdXQucHVzaCgoc2xvdHNbaV0gYXMge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9KS5tKTtcbiAgICAgICAgcnVuU3RhcnQgPSBpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hSdW4oc2xvdHMubGVuZ3RoKTtcbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdGlja1RvQm90dG9tID0gbGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDAgfHwgd2FzTmVhckJvdHRvbSgpO1xuICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAvLyBTdGF0cyBudW1iZXJzXG4gICAgbGV0IHRvdGFsU2VsZWN0b3JzID0gMDtcbiAgICBsZXQgdG90YWxDb21tZW50cyA9IDA7XG4gICAgbGV0IHRvdGFsU3RhbGUgPSAwO1xuICAgIGNvbnN0IGRpc3RpbmN0UGFnZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgdG90YWxTZWxlY3RvcnMrKztcbiAgICAgICAgaWYgKHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSkgdG90YWxTdGFsZSsrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHRvdGFsQ29tbWVudHMrKztcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtZXNzYWdlcy5zb21lKCh4KSA9PiB4LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgeC5lbnRyeS51cmwgPT09IG0udXJsKSkgZGlzdGluY3RQYWdlcy5hZGQobS51cmwpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic2VsZWN0b3JzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFNlbGVjdG9ycyk7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cImNvbW1lbnRzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbENvbW1lbnRzKTtcbiAgICBjb25zdCBzdGFsZU51bSA9IHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzdGFsZVwiXSAuc3RhdC1udW0nKSE7XG4gICAgc3RhbGVOdW0udGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTdGFsZSk7XG4gICAgc3RhbGVOdW0uZGF0YXNldC56ZXJvID0gdG90YWxTdGFsZSA9PT0gMCA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInBhZ2VzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyhkaXN0aW5jdFBhZ2VzLnNpemUpO1xuICAgIGNvbnN0IGV4cG9ydFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgc3RhdFRva2Vucy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcodG9rZW5Db3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG4gICAgc3RhdFdvcmRzLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh3b3JkQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuXG4gICAgLy8gTWluaWZ5IHJlZHVjdGlvbiBzdGF0c1xuICAgIGxldCBmdWxsVCA9IDAsIGN1clQgPSAwLCBmdWxsVyA9IDAsIGN1clcgPSAwLCBwY3QgPSAwO1xuICAgIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICBjb25zdCB3YXNNaW4gPSBwcmVmcy5taW5pZnk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB0cnVlOyBjb25zdCBtaW5UZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gZmFsc2U7IGNvbnN0IGZ1bGxUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gd2FzTWluO1xuICAgICAgZnVsbFQgPSB0b2tlbkNvdW50KGZ1bGxUZXh0KTsgY3VyVCA9IHRva2VuQ291bnQobWluVGV4dCk7XG4gICAgICBmdWxsVyA9IHdvcmRDb3VudChmdWxsVGV4dCk7IGN1clcgPSB3b3JkQ291bnQobWluVGV4dCk7XG4gICAgICBwY3QgPSBmdWxsVCA+IDAgPyBNYXRoLnJvdW5kKCgxIC0gY3VyVCAvIGZ1bGxUKSAqIDEwMCkgOiAwO1xuICAgIH1cbiAgICBjb25zdCBtaW5pZnlTdGF0c0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1pbmlmeS1zdGF0c10nKTtcbiAgICBpZiAobWluaWZ5U3RhdHNFbCkge1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtmdWxsVC50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJULnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke2Z1bGxXLnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clcudG9Mb2NhbGVTdHJpbmcoKX0gd29yZHMgwrcgJHtwY3R9JSByZWR1Y3Rpb25gO1xuICAgICAgfSBlbHNlIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgV291bGQgc2F2ZSAkeyhmdWxsVCAtIGN1clQpLnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke3BjdH0lIGlmIGVuYWJsZWRgO1xuICAgICAgfSBlbHNlIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG5cbiAgICAvLyBQZXItY2hlY2tib3ggY29udHJpYnV0aW9uIHN0YXRzOiBob3cgbWFueSB0b2tlbnMvd29yZHMgZWFjaCB0b2dnbGVcbiAgICAvLyBhZGRzIHRvIHRoZSBjdXJyZW50IGV4cG9ydC4gQ29tcHV0ZWQgYnkgdG9nZ2xpbmcgdGhhdCBzaW5nbGUgcHJlZlxuICAgIC8vIGFuZCBkaWZmaW5nIHRoZSBleHBvcnQg4oCUIGdpdmVzIGFuIGhvbmVzdCBhbnN3ZXIgdGhhdCByZWZsZWN0cyB0aGVcbiAgICAvLyBjdXJyZW50IG1pbmlmeSBzdGF0ZSBhbmQgdGhlIHJlc3Qgb2YgdGhlIHRvZ2dsZXMuXG4gICAgY29uc3QgY29udHJpYktleXM6IEFycmF5PGtleW9mIFByZWZzPiA9IFsnaW5jbHVkZU91dGVySFRNTCcsICdpbmNsdWRlTWF0Y2hlZFJ1bGVzJywgJ2luY2x1ZGVTdHlsZXMnXTtcbiAgICBpZiAoZXhwb3J0VGV4dCAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJhc2VUID0gdG9rZW5Db3VudChleHBvcnRUZXh0KTtcbiAgICAgIGNvbnN0IGJhc2VXID0gd29yZENvdW50KGV4cG9ydFRleHQpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoIWVsKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qgd2FzT24gPSBwcmVmc1trZXldIGFzIGJvb2xlYW47XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSAhd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSB3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VCA9IHRva2VuQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIGNvbnN0IGFsdFcgPSB3b3JkQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIC8vIHdhc09uPXRydWUg4oaSIGN1cnJlbnRseSBpbmNsdWRlZDsgY29zdCA9IGJhc2UgLSBhbHQgKHR1cm5pbmcgT0ZGIHNhdmVzIHRoaXMpLlxuICAgICAgICAvLyB3YXNPbj1mYWxzZSDihpIgY3VycmVudGx5IGV4Y2x1ZGVkOyBnYWluID0gYWx0IC0gYmFzZSAodHVybmluZyBPTiBhZGRzIHRoaXMpLlxuICAgICAgICBjb25zdCBkVCA9IHdhc09uID8gYmFzZVQgLSBhbHRUIDogYWx0VCAtIGJhc2VUO1xuICAgICAgICBjb25zdCBkVyA9IHdhc09uID8gYmFzZVcgLSBhbHRXIDogYWx0VyAtIGJhc2VXO1xuICAgICAgICBjb25zdCBzaWduID0gd2FzT24gPyAnJyA6ICcrJztcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB3YXNPblxuICAgICAgICAgID8gYMK3ICR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaW4gZXhwb3J0JHtwcmVmcy5taW5pZnkgPyAnIChtaW5pZmllZCknIDogJyd9YFxuICAgICAgICAgIDogYMK3ICR7c2lnbn0ke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtzaWdufSR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpZiBlbmFibGVkYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoZWwpIGVsLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9vbGJhciBleHBvcnQgc3RhdHNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignLnN0YXQuZXhwb3J0LXN0YXRzJykuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgY29uc3QgbnVtID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbnVtJyk7XG4gICAgICBjb25zdCBsYWIgPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1sYWJlbCcpO1xuICAgICAgaWYgKG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50IS5yZXBsYWNlKC9cXCokLywgJycpO1xuICAgICAgaWYgKGxhYikgbGFiLnRleHRDb250ZW50ID0gbGFiLnRleHRDb250ZW50IS5yZXBsYWNlKC9eXFwqLywgJycpO1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCArICcqJztcbiAgICAgIGNvbnN0IGlzVG9rZW4gPSBpID09PSAwO1xuICAgICAgY29uc3QgZnVsbFYgPSBpc1Rva2VuID8gZnVsbFQgOiBmdWxsVztcbiAgICAgIGNvbnN0IGN1clYgPSBpc1Rva2VuID8gY3VyVCA6IGN1clc7XG4gICAgICBjb25zdCB3aGljaCA9IGlzVG9rZW4gPyAndG9rZW5zJyA6ICd3b3Jkcyc7XG4gICAgICBzLmRhdGFzZXQudGlwID0gcHJlZnMubWluaWZ5XG4gICAgICAgID8gYE1JTklGSUVEIMK3ICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofVxcbkZ1bGwgd291bGQgYmUgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYFxuICAgICAgICA6IGAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9IMK3IGZ1bGwgZXhwb3J0XFxuTWluaWZpZWQgd291bGQgYmUgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgO1xuICAgIH0pO1xuXG4gICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cImVtcHR5LWljb25cIj7wn6SPPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS10aXRsZVwiPlN0YXJ0IHdpdGggdGhlIHBhZ2UgeW91IHdhbnQgdG8gY3JpdGlxdWUuPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1ib2R5XCI+T3BlbiBhIHBhZ2UsIHRoZW4gY2FwdHVyZSBhbiBlbGVtZW50LiBDb21tZW50cyBzdGF5IHBhaXJlZCB3aXRoIHRoZSB0aGluZyB5b3UgZ3JhYmJlZC48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LWtleXNcIj5BbHQrQ2xpY2sgdG8gY2FwdHVyZTwvZGl2PmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdG9yVXJscyA9IG5ldyBTZXQobWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkudXJsKSk7XG4gICAgY29uc3QgdmlzaWJsZU1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgIT09ICdwYWdlJyB8fCBzZWxlY3RvclVybHMuaGFzKG0udXJsKSk7XG4gICAgY29uc3QgcGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBCb29sZWFuKG0ucGlubmVkKSk7XG4gICAgY29uc3QgdW5waW5uZWQgPSB2aXNpYmxlTWVzc2FnZXMuZmlsdGVyKChtKSA9PiAhcGlubmVkLmluY2x1ZGVzKG0gYXMgU2VsZWN0b3JNZXNzYWdlKSk7XG4gICAgLy8gU2lkZWJhciBzaG93cyBjYXB0dXJlcyBpbiBJTlNFUlRJT04gb3JkZXIgKG1vc3QgcmVjZW50IGF0IHRoZVxuICAgIC8vIGJvdHRvbSkuIFZpc3VhbC1wb3NpdGlvbiByZW9yZGVyaW5nIGhhcHBlbnMgT05MWSBhdCBleHBvcnQgdGltZVxuICAgIC8vIHNvIHRoZSBzaWRlYmFyIHN0YXlzIHByZWRpY3RhYmxlIHdoaWxlIHRoZSBhZ2VudC1mYWNpbmcgZXhwb3J0XG4gICAgLy8gZ2V0cyByZWFkaW5nLW9yZGVyIGNvbnZlbmllbmNlLiAoUHJpb3IgaW1wbGVtZW50YXRpb24gc29ydGVkIGluXG4gICAgLy8gYm90aCBwbGFjZXM7IHVzZXIgZmVlZGJhY2sgd2FzIHRoYXQgc2lkZWJhciBzaHVmZmxpbmcgd2FzXG4gICAgLy8gZGlzb3JpZW50aW5nLilcbiAgICBjb25zdCBvcmRlcmVkID0gWy4uLnBpbm5lZCwgLi4udW5waW5uZWRdO1xuXG4gICAgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbChtZXNzYWdlc1swXSEuaWQpKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICAvLyBUcmFjayB0aGUgVVJMIG9mIHRoZSBtb3N0IHJlY2VudGx5IHJlbmRlcmVkIHBhZ2UgZGl2aWRlciBzbyB3ZSBjYW5cbiAgICAvLyBzdXBwcmVzcyBhIHJlcGVhdGVkIGhlYWRlciB3aGVuIGNvbnNlY3V0aXZlIGNhcHR1cmVzIHNoYXJlIHRoZSBzYW1lXG4gICAgLy8gcGFnZS4gUmVzdGF0aW5nIHRoZSBVUkwgYWJvdmUgZXZlcnkgY2FwdHVyZSBpbiBhIHNhbWUtVVJMIHJ1biBpc1xuICAgIC8vIG5vaXNlIOKAlCB0aGUgZGl2aWRlciBvbmx5IGVhcm5zIGl0cyBzcGFjZSB3aGVuIHRoZSBVUkwgYWN0dWFsbHlcbiAgICAvLyBjaGFuZ2VzIGZyb20gdGhlIHByZXZpb3VzIGNhcHR1cmUgaW4gc2VxdWVuY2UuXG4gICAgbGV0IGxhc3RSZW5kZXJlZFBhZ2VVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZW5kZXJlZEFueSA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JkZXJlZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbSA9IG9yZGVyZWRbaV0hO1xuICAgICAgaWYgKCFtYXRjaGVzU2VhcmNoKG0pKSBjb250aW51ZTtcbiAgICAgIC8vIENvbGxhcHNlIGNvbnNlY3V0aXZlIHNhbWUtVVJMIHBhZ2UgZGl2aWRlcnMgaW50byB0aGUgZmlyc3Qgb25lLlxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtLnVybCA9PT0gbGFzdFJlbmRlcmVkUGFnZVVybCkgY29udGludWU7XG4gICAgICAgIGxhc3RSZW5kZXJlZFBhZ2VVcmwgPSBtLnVybDtcbiAgICAgIH1cbiAgICAgIC8vIERldGFjaGVkIGNvbW1lbnRzIHJlbmRlciB1bnRocmVhZGVkIOKAlCBhZGphY2VuY3kgbXVzdCBub3QgcmUtYWRvcHRcbiAgICAgIC8vIGEgY29tbWVudCB0aGUgdXNlciBleHBsaWNpdGx5IGRpc2Fzc29jaWF0ZWQuXG4gICAgICBjb25zdCBhZGphY2VuY3kgPSBtLnR5cGUgPT09ICdmZWVkYmFjaycgJiYgbS5kZXRhY2hlZCA/IG51bGwgOiBsYXN0U2VsZWN0b3JTZWw7XG4gICAgICBjb25zdCBub2RlID0gcmVuZGVyTWVzc2FnZShtLCBhZGphY2VuY3kpO1xuICAgICAgbGlzdC5hcHBlbmQobm9kZSk7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBsYXN0U2VsZWN0b3JTZWwgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgaWYgKGkgPCBvcmRlcmVkLmxlbmd0aCAtIDEpIGxpc3QuYXBwZW5kKGluc2VydFJhaWwob3JkZXJlZFtpICsgMV0hLmlkKSk7XG4gICAgICByZW5kZXJlZEFueSA9IHRydWU7XG4gICAgfVxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwoJ19fZW5kX18nKSk7XG4gICAgaWYgKCFyZW5kZXJlZEFueSAmJiBzZWFyY2hRdWVyeSkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS50ZXh0Q29udGVudCA9IGBObyBtYXRjaGVzIGZvciBcIiR7c2VhcmNoUXVlcnl9XCIuYDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSByZW5kZXJQaGFudG9tKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgaWYgKHN0aWNrVG9Cb3R0b20pIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBlbmRpbmdCYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGVuZGluZy1iYXknKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwZW5kaW5nTXVsdGkubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgYmF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYmF5LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWJheSc7XG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGVhZCc7XG4gICAgaGVhZC50ZXh0Q29udGVudCA9IGBQZW5kaW5nIGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH0gZWxlbWVudCR7cGVuZGluZ011bHRpLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWA7XG4gICAgYmF5LmFwcGVuZChoZWFkKTtcbiAgICBwZW5kaW5nTXVsdGkuZm9yRWFjaCgoZSwgaSkgPT4ge1xuICAgICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2FyZC5jbGFzc05hbWUgPSAncGVuZGluZy1jYXJkJztcbiAgICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICAgIHNlcS50ZXh0Q29udGVudCA9IGAjJHtpICsgMX1gO1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IChlLnRleHQgJiYgZS50ZXh0Lmxlbmd0aCA8PSA2MCA/IGUudGV4dCA6IChlLmNvbXBvbmVudFJvb3QgPz8gZS5zZWxlY3RvciA/PyBlLnRhZykpO1xuICAgICAgY2FyZC5hcHBlbmQoc2VxLCBsYWJlbCk7XG4gICAgICBiYXkuYXBwZW5kKGNhcmQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncGVuZGluZy1yb3cnO1xuICAgIGNvbnN0IGNvbW1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbW1pdC50eXBlID0gJ2J1dHRvbic7XG4gICAgY29tbWl0LmNsYXNzTmFtZSA9ICdwcmltYXJ5IHBlbmRpbmctY29tbWl0JztcbiAgICBjb21taXQudGV4dENvbnRlbnQgPSBgQ29tbWl0IGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH1gO1xuICAgIGNvbW1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jb21taXQnfSkpO1xuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuIHBlbmRpbmctY2FuY2VsJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnO1xuICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSkpO1xuICAgIHJvdy5hcHBlbmQoY29tbWl0LCBjYW5jZWwpO1xuICAgIGJheS5hcHBlbmQocm93KTtcbiAgICBjb25zdCBoaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGludC5jbGFzc05hbWUgPSAncGVuZGluZy1oaW50JztcbiAgICBoaW50LnRleHRDb250ZW50ID0gJ0FsdCtTaGlmdCtDbGljayBtb3JlIMK3IENvbW1pdCB0byBmaW5hbGl6ZSDCtyBFc2MgdG8gY2FuY2VsJztcbiAgICBiYXkuYXBwZW5kKGhpbnQpO1xuICAgIGxpc3QuYXBwZW5kKGJheSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGNsZWFyTm9vZGxlcyA9ICgpOiB2b2lkID0+IHsgZm9yIChjb25zdCBuIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLnRyZWUtbm9vZGxlJykpIG4ucmVtb3ZlKCk7IH07XG5cbiAgLy8gQ3Jvc3Mtc2VhbSBwYW5lbOKGlGNhbnZhcyBub29kbGVzIHdlcmUgcmVtb3ZlZDogYWxpZ25pbmcgdHdvIFNWRyBoYWx2ZXNcbiAgLy8gYWNyb3NzIHRoZSBwYW5lbC9wYWdlIGJvdW5kYXJ5IGRlcGVuZGVkIG9uIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaFxuICAvLyBicmVha3MgdW5kZXIgRGV2VG9vbHMgZG9jayBhbmQgem9vbSwgYW5kIHRoZSB2aXN1YWwgYmVuZWZpdCBkaWRuJ3RcbiAgLy8ganVzdGlmeSB0aGUgbWFpbnRlbmFuY2UgY29zdC4gVGhlIGluLXBhbmVsIGZlZWRiYWNrLXRyZWUgbm9vZGxlc1xuICAvLyAoZHJhd05vb2RsZSAvIHJlZHJhd05vb2RsZXMgYmVsb3cpIGFyZSB1bmFmZmVjdGVkLlxuICBjb25zdCBjbGVhckJ1YmJsZU5vb2RsZSA9ICgpOiB2b2lkID0+IHsgLyogbm8tb3AgKi8gfTtcbiAgY29uc3QgcmVkcmF3Tm9vZGxlcyA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhck5vb2RsZXMoKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIFsuLi5saXN0LmNoaWxkcmVuXSBhcyBIVE1MRWxlbWVudFtdKSB7XG4gICAgICBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RvcicpKSBsYXN0U2VsZWN0b3JFbCA9IG5vZGU7XG4gICAgICAvLyBPbmx5IFRIUkVBREVEIGNvbW1lbnRzIGdldCBhIGNvbm5lY3RvciDigJQgYSBkZXRhY2hlZCBjb21tZW50IG11c3RcbiAgICAgIC8vIGxvc2UgaXRzIG5vb2RsZSwgbm90IGp1c3QgaXRzIGluZGVudCAodGhlIHZpc2libGUgXCJkaXNjb25uZWN0XCIpLlxuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWVkYmFjaycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aHJlYWRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCBub2RlKTtcbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtcmFpbCcpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5pbmxpbmUtY29tbWVudCcpID8/IG5vZGU7XG4gICAgICAgIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIHRhcmdldCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRpdmlkZXInKSB8fCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZ3JvdXAtaGVhZCcpKSB7XG4gICAgICAgIGxhc3RTZWxlY3RvckVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGRyYXdOb29kbGUgPSAoc2VsZWN0b3JFbDogSFRNTEVsZW1lbnQsIGZlZWRiYWNrRWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc1IgPSBzZWxlY3RvckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGZSID0gZmVlZGJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBsUiA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgeDEgPSBzUi5sZWZ0IC0gbFIubGVmdCArIDEyO1xuICAgIGNvbnN0IHkxID0gc1IuYm90dG9tIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3A7XG4gICAgY29uc3QgeDIgPSBmUi5sZWZ0IC0gbFIubGVmdDtcbiAgICBjb25zdCB5MiA9IGZSLnRvcCAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wICsgMTQ7XG4gICAgY29uc3QgdyA9IE1hdGgubWF4KDIwLCB4MiAtIHgxICsgNCk7XG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDIwLCB5MiAtIHkxKTtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RyZWUtbm9vZGxlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcodykpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFN0cmluZyhoKSk7XG4gICAgc3ZnLnN0eWxlLmxlZnQgPSBgJHt4MSAtIDJ9cHhgO1xuICAgIHN2Zy5zdHlsZS50b3AgPSBgJHt5MX1weGA7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIGNvbnN0IHN4ID0gMiwgc3kgPSAwLCBleCA9IHcgLSAyLCBleSA9IGg7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBgTSAke3N4fSAke3N5fSBDICR7c3h9ICR7c3kgKyBoICogMC41NX0sICR7ZXggLSB3ICogMC40fSAke2V5fSwgJHtleH0gJHtleX1gKTtcbiAgICBzdmcuYXBwZW5kKHBhdGgpO1xuICAgIGxpc3QuYXBwZW5kKHN2Zyk7XG4gIH07XG4gIGxldCBzY3JvbGxSYWYgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmFmKSByZXR1cm47XG4gICAgc2Nyb2xsUmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgc2Nyb2xsUmFmID0gMDsgcmVkcmF3Tm9vZGxlcygpOyB9KTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZWRyYXdOb29kbGVzKTtcblxuICAvLyDilIDilIDilIAgUGVyLW1lc3NhZ2UgcmVuZGVyZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCByZW5kZXJNZXNzYWdlID0gKG06IFBhbmVsTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIHJlbmRlclBhZ2UobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHJlbmRlclNlbGVjdG9yKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiByZW5kZXJGZWVkYmFjayhtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQYWdlID0gKG06IFBhZ2VNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkLmNsYXNzTmFtZSA9ICdwYWdlLWRpdmlkZXInO1xuICAgIGQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgY29uc3QgdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdHMuY2xhc3NOYW1lID0gJ3RhYi1zdGF0dXMnO1xuICAgIHRzLmRhdGFzZXQudXJsID0gbS51cmw7XG4gICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB0cy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgZC5hcHBlbmQodHMpO1xuICAgIGNvbnN0IHUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdS5jbGFzc05hbWUgPSAndXJsJztcbiAgICB1LnRleHRDb250ZW50ID0gbS51cmw7XG4gICAgdS5kYXRhc2V0LnRpcCA9IGAke20udGl0bGUgPz8gJyd9IMK3ICR7bS51cmx9YDtcbiAgICBkLmFwcGVuZCh1KTtcbiAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBvbiB0aGlzIHBhZ2UgaW4gdGhlIGFjdGl2ZSB0YWIsIGNsaWNraW5nIHRoZSBVUkxcbiAgICAgIC8vIHNob3VsZG4ndCByZWxvYWQgb3Igc3RlYWwgZm9jdXMg4oCUIGl0IHNob3VsZCBqdXN0IGJlIGEgbm8tb3BcbiAgICAgIC8vIHZpc3VhbGx5ICh0aGUgcm93IGFscmVhZHkgaW5kaWNhdGVzIFwib3BlblwiIHZpYSAudGFiLXN0YXR1cykuIFRoZVxuICAgICAgLy8gdXNlciBjb21wbGFpbmVkIGFib3V0IGdldHRpbmcgZm9yY2VkIGludG8gYSBuYXZpZ2F0aW9uIHdoZW4gdGhleVxuICAgICAgLy8gd2VyZSBqdXN0IHRyeWluZyB0byByZWFkIHRoZSByb3cuXG4gICAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHtcbiAgICAgICAgc2V0U3RhdHVzKCdBbHJlYWR5IG9uIHRoaXMgcGFnZScsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgciA9IGF3YWl0IHNlbmRUb0JnPHtmb3VuZD86IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcjsgZXJyb3I/OiBzdHJpbmd9Pih7a2luZDogJ3N3aXRjaC10by10YWInLCB1cmw6IG0udXJsLCBvcGVuSWZNaXNzaW5nOiB0cnVlfSk7XG4gICAgICBpZiAocj8uZm91bmQpIHNldFN0YXR1cygnU3dpdGNoZWQgdG8gdGFiJyk7XG4gICAgICBlbHNlIGlmIChyPy5vcGVuZWQpIHNldFN0YXR1cygnT3BlbmVkIGluIG5ldyB0YWInKTtcbiAgICAgIGVsc2Ugc2V0U3RhdHVzKFwiQ291bGRuJ3Qgb3BlbiB0YWJcIiwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pO1xuICAgIHJldHVybiBkO1xuICB9O1xuXG4gIGNvbnN0IHRpdGxlRnJvbUVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXN0SWQpIHJldHVybiBgW3Rlc3RJZD0ke2UudGVzdElkfV1gO1xuICAgIGlmIChlLmlkKSByZXR1cm4gYCMke2UuaWR9YDtcbiAgICBpZiAoZS5jbGFzc2VzPy5sZW5ndGgpIHJldHVybiBgJHtlLnRhZ30uJHtlLmNsYXNzZXMuc2xpY2UoMCwgMikuam9pbignLicpfWA7XG4gICAgcmV0dXJuIGUuc2VsZWN0b3IgfHwgZS50YWcgfHwgJyh1bmtub3duKSc7XG4gIH07XG5cbiAgLy8gUGljayB0aGUgbW9zdCBcImh1bWFubHkgcmVhZGFibGVcIiBsYWJlbCBmb3IgdGhlIGJ1YmJsZSBwcmV2aWV3LiBQcmVmZXJzXG4gIC8vIHZpc2libGUtdG8tdXNlciB0ZXh0IGluIHRoaXMgcHJpb3JpdHk6XG4gIC8vICAgMS4gaW5uZXJUZXh0IC8gdGV4dENvbnRlbnQgKGBlbnRyeS50ZXh0YCkg4oCUIHdoYXQgdGhlIHVzZXIgcmVhZHMgb24gc2NyZWVuXG4gIC8vICAgMi4gYWNjZXNzaWJsZU5hbWUgKGFyaWEtbGFiZWwgLyB0aXRsZSAvIGFsdCBmYWxsYmFjayBjaGFpbilcbiAgLy8gICAzLiBpbnB1dCB2YWx1ZSAoc2tpcHBlZCBpZiBpdCdzIHRoZSBtYXNrZWQgcGFzc3dvcmQgcGxhY2Vob2xkZXIpXG4gIC8vICAgNC4gaW5wdXQgcGxhY2Vob2xkZXJcbiAgLy8gICA1LiBpbWcgYWx0XG4gIC8vICAgNi4gY29tcG9uZW50Um9vdCAoZS5nLiBcImJ1dHRvbiNjdGFcIilcbiAgLy8gICA3LiB0aXRsZUZyb21FbnRyeSDigJQgbGFzdC1yZXNvcnQgdGFnL2NsYXNzL2lkIGZhbGxiYWNrXG4gIC8vIENTUyBoYW5kbGVzIHZpc3VhbCB0cnVuY2F0aW9uIHZpYSB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3ZSBzaGlwIHRoZVxuICAvLyBmdWxsIHN0cmluZyBzbyB0aGUgdG9vbHRpcCBvbiBob3ZlciBjYW4gc2hvdyB0aGUgY29tcGxldGUgdmFsdWUuXG4gIGNvbnN0IG5pY2VMYWJlbCA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGV4dCkgcmV0dXJuIGUudGV4dDtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSkgcmV0dXJuIGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgY29uc3QgdiA9IGUuYXR0cnM/LnZhbHVlO1xuICAgIGlmICh2ICYmIHYgIT09ICfigKLigKLigKLigKInKSByZXR1cm4gdjtcbiAgICBpZiAoZS5hdHRycz8ucGxhY2Vob2xkZXIpIHJldHVybiBlLmF0dHJzLnBsYWNlaG9sZGVyO1xuICAgIGlmIChlLmF0dHJzPy5hbHQpIHJldHVybiBlLmF0dHJzLmFsdDtcbiAgICBpZiAoZS5jb21wb25lbnRSb290KSByZXR1cm4gZS5jb21wb25lbnRSb290O1xuICAgIHJldHVybiB0aXRsZUZyb21FbnRyeShlKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTZWxlY3RvciA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgdmFsaWQgPSBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzYW1lUGF0aCA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJykgPT09IGxpdmVUYWJQYXRoO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIHNlbGVjdG9yJztcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlICYmIHNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhbGUnKTtcbiAgICBlbHNlIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgIXNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnZGlmZi1wYWdlJyk7XG4gICAgaWYgKG0ucGlubmVkKSBkaXYuY2xhc3NMaXN0LmFkZCgncGlubmVkJyk7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2hhcy1ncm91cCcpO1xuICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yID09PSBsYXN0QWN0aXZlU2VsZWN0b3IpIGRpdi5jbGFzc0xpc3QuYWRkKCdsYXN0LWFjdGl2ZScpO1xuICAgIC8vIEF1dG8tZXhwYW5kIG9uIHNlYXJjaCBoaXQgc28gdGhlIHVzZXIgc2VlcyB3aGVyZSB0aGUgbWF0Y2ggbGFuZGVkLlxuICAgIGNvbnN0IG1hdGNoZWRCb2R5ID0gYm9keU1hdGNoZXNTZWFyY2gobSk7XG4gICAgaWYgKG1hdGNoZWRCb2R5KSBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnLCAnc2VhcmNoLWhpdCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuZGF0YXNldC5zZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgLy8gRHJhZy10by1yZXBhcmVudDogZXZlcnkgc2VsZWN0b3IgYnViYmxlIGlzIGEgdmFsaWQgZHJvcCB0YXJnZXQgZm9yXG4gICAgLy8gYSBjb21tZW50IGJlaW5nIGRyYWdnZWQgZnJvbSBlbHNld2hlcmUgaW4gdGhlIHNpZGViYXIuXG4gICAgd2lyZVNlbGVjdG9yRHJvcFRhcmdldChkaXYsIG0pO1xuXG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ2hlYWQnO1xuICAgIGNvbnN0IGNhcmV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNhcmV0LmNsYXNzTmFtZSA9ICdjYXJldCc7XG4gICAgY2FyZXQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGV2cm9uLXJpZ2h0JywgMTIpO1xuICAgIGhlYWQuYXBwZW5kKGNhcmV0KTtcbiAgICBjb25zdCBwaW5NYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcGluTWFya2VyLmNsYXNzTmFtZSA9ICdwaW4tbWFya2VyJztcbiAgICBwaW5NYXJrZXIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdzdGFyLWZpbGxlZCcsIDExKTtcbiAgICBoZWFkLmFwcGVuZChwaW5NYXJrZXIpO1xuICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgc2VxLnRleHRDb250ZW50ID0gYCMke20uZW50cnkubn1gO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIHNlcS50ZXh0Q29udGVudCArPSBgKyR7bS5lbnRyeS5ncm91cC5sZW5ndGh9YDtcbiAgICBoZWFkLmFwcGVuZChzZXEpO1xuICAgIGNvbnN0IGNvbXBhY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29tcGFjdC5jbGFzc05hbWUgPSAnY29tcGFjdCc7XG4gICAgY29uc3QgY29tcGFjdFN0ciA9IG5pY2VMYWJlbChtLmVudHJ5KTtcbiAgICBjb21wYWN0LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGNvbXBhY3RTdHIsIHNlYXJjaFF1ZXJ5KTtcbiAgICAvLyBTaG93IHRoZSBmdWxsIGxhYmVsIG9uIGhvdmVyIGV2ZW4gd2hlbiBDU1MgZWxsaXBzaXMgdHJ1bmNhdGVzIHRoZVxuICAgIC8vIHZpc2libGUgcG9ydGlvbiDigJQgdXNlZnVsIHdoZW4gdGhlIHZpc2libGUgdGV4dC9wbGFjZWhvbGRlciBpcyBsb25nLlxuICAgIGlmIChjb21wYWN0U3RyLmxlbmd0aCA+IDI0KSBjb21wYWN0LmRhdGFzZXQudGlwID0gY29tcGFjdFN0cjtcbiAgICBoZWFkLmFwcGVuZChjb21wYWN0KTtcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9IHIgPyBgJHtyLnd9w5cke3IuaH1gIDogKG0uZW50cnkudGFnID8/ICcnKTtcbiAgICBoZWFkLmFwcGVuZChtZXRhKTtcbiAgICBkaXYuYXBwZW5kKGhlYWQpO1xuXG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzdW1tYXJ5LmNsYXNzTmFtZSA9ICdwZWVrLXN1bW1hcnknO1xuICAgIHN1bW1hcnkuaW5uZXJIVE1MID0gYDxzcGFuIGRhdGEtaWNvbj1cImFsZXJ0LWNpcmNsZVwiIGRhdGEtc2l6ZT1cIjExXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ0XCI+JHtkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWZmLXBhZ2UnKSA/ICdkaWZmZXJlbnQgcGFnZScgOiAnc3RhbGUnfTwvc3Bhbj5gO1xuICAgIGhlYWQuYXBwZW5kKHN1bW1hcnkpO1xuICAgIG1vdW50SWNvbnMoc3VtbWFyeSk7XG5cbiAgICBjb25zdCBlcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnIuY2xhc3NOYW1lID0gJ3BlZWstZXJyb3InO1xuICAgIGNvbnN0IHJlYXNvbiA9IHNlbGVjdG9yRXJyb3JzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBwYXRoRnJvbUVudHJ5ID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKTtcbiAgICBlcnIuaW5uZXJIVE1MID0gc2FtZVBhdGhcbiAgICAgID8gYDxiPlN0YWxlPC9iPiDCtyAke2VzY2FwZUh0bWwocmVhc29uID8/ICdubyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcy4nKX08YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gXG4gICAgICA6IGBDYXB0dXJlZCBvbiA8Y29kZT4ke2VzY2FwZUh0bWwocGF0aEZyb21FbnRyeSl9PC9jb2RlPiDigJQgY3VycmVudCB0YWIgaXMgPGNvZGU+JHtlc2NhcGVIdG1sKGxpdmVUYWJQYXRoID8/ICcnKX08L2NvZGU+LiBTd2l0Y2ggdGFicyB0byB2YWxpZGF0ZS48YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gO1xuICAgIGRpdi5hcHBlbmQoZXJyKTtcblxuICAgIC8vIEFuY2VzdG9yIGJyZWFkY3J1bWIg4oCUIFBsYXNtaWMtc3R5bGUgZXNjYWxhdG9yLiBDaGlwcyBmb3IgZWFjaCBlbnRyeSBpblxuICAgIC8vIGVudHJ5LmFuY2VzdG9ycyAoY2xvc2VzdCBmaXJzdCkuIENsaWNrIGEgY2hpcCB0byBjYXB0dXJlIHRoYXRcbiAgICAvLyBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIChkZXB0aCA9IGNoaXAgaW5kZXggKyAxIHNpbmNlIHRoZSBlbnRyeSdzXG4gICAgLy8gb3duIHNlbGVjdG9yIGlzIGRlcHRoIDApLiBCcmlnaHRuZXNzIGdyYWRpZW50IGRhcmtlbnMgZGVlcGVyIGNoaXBzLlxuICAgIGlmIChtLmVudHJ5LmFuY2VzdG9ycz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjcnVtYnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNydW1icy5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY3J1bWJzJztcbiAgICAgIGNydW1icy5kYXRhc2V0LnRpcCA9ICdDbGljayBhIGNydW1iIHRvIGVzY2FsYXRlIHRoZSBjYXB0dXJlIHRvIGFuIGFuY2VzdG9yIGVsZW1lbnQnO1xuICAgICAgbS5lbnRyeS5hbmNlc3RvcnMuZm9yRWFjaCgoYW5jLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2hpcC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGNoaXAuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNoaXAnO1xuICAgICAgICAvLyBCcmlnaHRuZXNzIGdyYWRpZW50OiBkZWVwZXIgY2hpcHMgZ2V0IHByb2dyZXNzaXZlbHkgZGltbWVyLlxuICAgICAgICBjaGlwLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7KDEgLSBpICogMC4wOCkudG9GaXhlZCgyKX0pYDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBhbmMudGVzdElkID8gYFske2FuYy50ZXN0SWR9XWBcbiAgICAgICAgICA6IGFuYy5pZCA/IGAjJHthbmMuaWR9YFxuICAgICAgICAgIDogYW5jLmNsYXNzZXM/Lmxlbmd0aCA/IGAke2FuYy50YWd9LiR7YW5jLmNsYXNzZXNbMF19YFxuICAgICAgICAgIDogYW5jLnRhZztcbiAgICAgICAgY2hpcC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjaGlwLmRhdGFzZXQudGlwID0gYENhcHR1cmUgdGhlIGFuY2VzdG9yICR7aSArIDF9IGxldmVsJHtpID8gJ3MnIDogJyd9IHVwIMK3ICR7YW5jLnRhZ30ke2FuYy5pZCA/ICcjJyArIGFuYy5pZCA6ICcnfWA7XG4gICAgICAgIC8vIEhvdmVyLXByZXZpZXcgdGhlIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2Ugc28gdGhlIHVzZXIgY2FuIHNlZVxuICAgICAgICAvLyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNvbW1pdHRpbmcuIE1pcnJvcnMgaG93XG4gICAgICAgIC8vIGhvdmVyaW5nIGEgc2VsZWN0b3IgYnViYmxlIHBhaW50cyBpdHMgcmluZy4gQ2xlYXJpbmcgb25cbiAgICAgICAgLy8gbW91c2VsZWF2ZSBzd2FwcyBiYWNrIHRvIHRoZSBidWJibGUncyBvd24gb3V0bGluZSAodGhlIGJ1YmJsZSdzXG4gICAgICAgIC8vIG1vdXNlZW50ZXIgaGFuZGxlciBwYWludGVkIGl0OyBsZWF2aW5nIHRoZSBjaGlwIGp1c3QgcmVtb3Zlc1xuICAgICAgICAvLyB0aGUgb3ZlcnJpZGUpLlxuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gUmUtcGFpbnQgdGhlIGJ1YmJsZSdzIG93biByaW5nIHJhdGhlciB0aGFuIGNsZWFyaW5nIGVudGlyZWx5XG4gICAgICAgICAgLy8gc28gdGhlIHVzZXIgZG9lc24ndCBzZWUgYSBmbGlja2VyIG9mIFwibm90aGluZ1wiIGJldHdlZW4gY2hpcHMuXG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7XG4gICAgICAgICAgICBraW5kOiAnY2FwdHVyZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDEsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKGBDYXB0dXJlZCBhbmNlc3RvciAke2FuYy50YWd9YCk7XG4gICAgICAgICAgZWxzZSBzZXRTdGF0dXMoJ0NvdWxkIG5vdCBjYXB0dXJlIGFuY2VzdG9yJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICB9KTtcbiAgICAgICAgY3J1bWJzLmFwcGVuZChjaGlwKTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFwcGVuZChjcnVtYnMpO1xuICAgIH1cblxuICAgIC8vIFByZXZpZXcgdGlsZS4gVGhlIGZ1bGwgUE5HIGxpdmVzIG9uIGRpc2sgdW5kZXJcbiAgICAvLyAucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvOyB0aGUgZGF0YVVybCBpcyBhIHNpZGUtcGFuZWwtZnJpZW5kbHlcbiAgICAvLyBkb3duc2NhbGUgKOKJpDMyMHB4IHdpZGUpLiBUbyBzdG9wIHRoZSBsYXlvdXQgZnJvbSBqdW1waW5nIHdoZW4gYSBzaG90XG4gICAgLy8gYXJyaXZlcyBhIHNlY29uZCBhZnRlciBjYXB0dXJlLCB3ZSBSRVNFUlZFIHRoZSBmaW5hbCBpbWFnZSBoZWlnaHQgdXBcbiAgICAvLyBmcm9udCB1c2luZyB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGtub3duIGFzcGVjdCByYXRpbyBhbmQgcGFpbnQgYVxuICAgIC8vIHNrZWxldG9uIGxvYWRlciBpbiB0aGF0IHNwYWNlLCB0aGVuIHN3YXAgdGhlIHNjcmVlbnNob3QgaW4gd2l0aCBub1xuICAgIC8vIHJlZmxvdy4gVGhlIHJlc2VydmF0aW9uIG9ubHkgaGFwcGVucyB3aGVuIGEgc2hvdCBpcyBhY3R1YWxseSBleHBlY3RlZFxuICAgIC8vIChhdXRvU2NyZWVuc2hvdCBvbiwgaG9zdCBub3Qgc2tpcHBlZCwgbm8gcmVjb3JkZWQgZmFpbHVyZSkgc28gY2FwdHVyZXNcbiAgICAvLyB0aGF0IHdpbGwgbmV2ZXIgZ2V0IGEgc2hvdCBkb24ndCBjYXJyeSBhbiBlbXB0eSBib3guXG4gICAgY29uc3Qgc2hvdERhdGFVcmwgPSBzaG90cy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3Qgc2hvdEV4cGVjdGVkID0gcHJlZnMuYXV0b1NjcmVlbnNob3RcbiAgICAgICYmICFzaG91bGRTa2lwU2NyZWVuc2hvdChtLmVudHJ5LnVybCA/PyAnJylcbiAgICAgICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIGlmIChzaG90RGF0YVVybCB8fCBzaG90RXhwZWN0ZWQpIHtcbiAgICAgIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXcuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgLy8gUmVzZXJ2ZSB2ZXJ0aWNhbCBzcGFjZSBpbW1lZGlhdGVseSBmcm9tIHRoZSBlbGVtZW50J3Mgd2lkdGgvaGVpZ2h0LlxuICAgICAgLy8gVGhlIHRodW1ibmFpbCBpcyByZW5kZXJlZCBhdCB0aGUgYnViYmxlJ3MgY29udGVudCB3aWR0aCwgc28gdGhlIGJveFxuICAgICAgLy8gaGVpZ2h0IHRyYWNrcyB0aGUgZWxlbWVudCdzIGFzcGVjdCByYXRpby4gQ2xhbXAgc28gYSB2ZXJ5IHRhbGxcbiAgICAgIC8vIGVsZW1lbnQgZG9lc24ndCByZXNlcnZlIGFuIGFic3VyZCBhbW91bnQgb2Ygc3BhY2UuXG4gICAgICBjb25zdCByID0gbS5lbnRyeS5yZWN0O1xuICAgICAgaWYgKHIgJiYgci53ID4gMCAmJiByLmggPiAwKSB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gTWF0aC5taW4oTWF0aC5tYXgoci5oIC8gci53LCAwLjEyKSwgMi4yKTtcbiAgICAgICAgcHJldmlldy5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zaG90LXJhdGlvJywgU3RyaW5nKHJhdGlvKSk7XG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgncmVzZXJ2ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaG90RGF0YVVybCkge1xuICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nLmNsYXNzTmFtZSA9ICdzaG90JztcbiAgICAgICAgaW1nLmFsdCA9IGBTY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gO1xuICAgICAgICAvLyBSZXZlYWwgb25seSBvbmNlIGRlY29kZWQgc28gdGhlIHN3YXAgaXMgaW5zdGFudCBhbmQgcmVmbG93LWZyZWU7XG4gICAgICAgIC8vIHRoZSBza2VsZXRvbiBzdGF5cyB2aXNpYmxlIHVuZGVybmVhdGggdW50aWwgdGhlbi5cbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpKTtcbiAgICAgICAgaW1nLnNyYyA9IHNob3REYXRhVXJsO1xuICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChpbWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gc2hvdCB5ZXQg4oCUIHNob3cgYSBza2VsZXRvbiBzaGltbWVyIG9jY3VweWluZyB0aGUgcmVzZXJ2ZWQgc3BhY2UuXG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuICAgICAgICBjb25zdCBza2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNrZWwuY2xhc3NOYW1lID0gJ3Nob3Qtc2tlbGV0b24nO1xuICAgICAgICBza2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBMb2FkaW5nIHNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChza2VsKTtcbiAgICAgIH1cbiAgICAgIGRpdi5hcHBlbmQocHJldmlldyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0cy5jbGFzc05hbWUgPSAnZW50LXN0YXRzJztcbiAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgIGNvbnN0IG15VG9rZW5zID0gdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtLmVudHJ5KSk7XG4gICAgY29uc3QgdG90YWxUb2tlbnMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobW0pOiBtbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5yZWR1Y2UoKHMsIG1tKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtbS5lbnRyeSkpLCAwKTtcbiAgICBjb25zdCBzaGFyZVBjdCA9IHRvdGFsVG9rZW5zID4gMCA/IE1hdGgucm91bmQoKG15VG9rZW5zIC8gdG90YWxUb2tlbnMpICogMTAwKSA6IDA7XG4gICAgY29uc3QgZ3JvdXBDb3VudCA9IG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGdyb3VwVG9rZW5zID0gKG0uZW50cnkuZ3JvdXAgPz8gW10pLnJlZHVjZSgocywgZykgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkoZykpLCAwKTtcbiAgICB0eXBlIFN0YXRDZWxsID0ge2xhYmVsOiBzdHJpbmc7IHZhbHVlOiBzdHJpbmc7IHRpcDogc3RyaW5nfTtcbiAgICBjb25zdCBjZWxsczogU3RhdENlbGxbXSA9IFtcbiAgICAgIHtsYWJlbDogJ0hUTUwnLCB2YWx1ZTogYCR7bS5lbnRyeS5vdXRlckhUTUw/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ091dGVyIEhUTUwgY2hhciBsZW5ndGgnfSxcbiAgICAgIHtsYWJlbDogJ1Rva2VucycsIHZhbHVlOiBgJHtteVRva2Vuc31gLCB0aXA6ICdBcHByb3ggTExNIHRva2VucyBmb3IgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnU2hhcmUnLCB2YWx1ZTogYCR7c2hhcmVQY3R9JWAsIHRpcDogJ1Rva2VuIHNoYXJlIG9mIGFsbCBzZWxlY3RvcnMnfSxcbiAgICAgIHtsYWJlbDogJ0NvbW1lbnRzJywgdmFsdWU6IGAke2ZiLmxlbmd0aH1gLCB0aXA6ICdJbmxpbmUgY29tbWVudHMgdGhyZWFkZWQgdW5kZXIgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnUnVsZXMnLCB2YWx1ZTogYCR7bS5lbnRyeS5tYXRjaGVkUnVsZXM/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ01hdGNoZWQgQ1NTIHJ1bGVzJ30sXG4gICAgICB7bGFiZWw6ICdTdHlsZXMnLCB2YWx1ZTogYCR7T2JqZWN0LmtleXMobS5lbnRyeS5zdHlsZXMgPz8ge30pLmxlbmd0aH1gLCB0aXA6ICdDb21wdXRlZC1zdHlsZSBmaWVsZHMga2VwdCd9LFxuICAgIF07XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAnLCB2YWx1ZTogYCR7Z3JvdXBDb3VudH1gLCB0aXA6ICdNZW1iZXJzIGZvbGRlZCBpbnRvIHRoaXMgZ3JvdXAnfSk7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwIFQnLCB2YWx1ZTogYCR7Z3JvdXBUb2tlbnN9YCwgdGlwOiAnVG9rZW5zIGNvbnRyaWJ1dGVkIGJ5IGdyb3VwIG1lbWJlcnMnfSk7XG4gICAgfVxuICAgIHN0YXRzLmlubmVySFRNTCA9IGNlbGxzLm1hcCgoYykgPT5cbiAgICAgIGA8c3BhbiBjbGFzcz1cImVudC1zdGF0XCIgZGF0YS10aXA9XCIke2VzY2FwZUh0bWwoYy50aXApfVwiPjxzcGFuIGNsYXNzPVwibGJsXCI+JHtjLmxhYmVsfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbFwiPiR7Yy52YWx1ZX08L3NwYW4+PC9zcGFuPmAsXG4gICAgKS5qb2luKCcnKTtcbiAgICBkaXYuYXBwZW5kKHN0YXRzKTtcblxuICAgIC8vIOKUgOKUgCBKU09OIHBhbmUgd2l0aCB0b29sYmFyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vIFRvb2xiYXIgYWJvdmUgdGhlIEpTT04gYm9keTogbGVmdCA9IGxpbmUtd3JhcCB0b2dnbGUsIHJpZ2h0ID0gY29weS5cbiAgICAvLyBUaGUgSlNPTiBpdHNlbGYgcmVmbGVjdHMgdGhlIGdsb2JhbCBgbWluaWZ5YCBzZXR0aW5nIHNvIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgc2FtZSBzaGFwZSB0aGF0IHdpbGwgZW5kIHVwIGluIHRoZSBleHBvcnQuXG4gICAgY29uc3QganNvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uV3JhcC5jbGFzc05hbWUgPSAnYm9keS1qc29uLXdyYXAnO1xuICAgIGNvbnN0IGpzb25CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uQmFyLmNsYXNzTmFtZSA9ICdib2R5LWpzb24tYmFyJztcblxuICAgIC8vIExpbmUtd3JhcCBjaGVja2JveCAocGVyLWJ1YmJsZSBsb2NhbCBzdGF0ZSwgZGVmYXVsdCBPTikuIFdoZW4gT04gdGhlXG4gICAgLy8gSlNPTiBpcyBmbGF0dGVuZWQgdG8gT05FIG1pbmlmaWVkIGxpbmUgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZSBidWJibGVcbiAgICAvLyB3aWR0aCAobm8gaG9yaXpvbnRhbCBzY3JvbGwpOyB3aGVuIE9GRiBpdCBmYWxscyBiYWNrIHRvIHRoZSBnbG9iYWxcbiAgICAvLyBtaW5pZnktcmVzcGVjdGluZyBwcmV0dHkvY29tcGFjdCBmb3JtIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgY29uc3Qgd3JhcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB3cmFwTGFiZWwuY2xhc3NOYW1lID0gJ2pzb24td3JhcC10b2dnbGUnO1xuICAgIHdyYXBMYWJlbC5kYXRhc2V0LnRpcCA9ICdGbGF0dGVuIHRvIGEgc2luZ2xlIHNvZnQtd3JhcHBpbmcgbGluZSBpbnN0ZWFkIG9mIGhvcml6b250YWwgc2Nyb2xsJztcbiAgICBjb25zdCB3cmFwQ2hlY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHdyYXBDaGVjay50eXBlID0gJ2NoZWNrYm94JztcbiAgICB3cmFwQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgd3JhcExhYmVsLmFwcGVuZCh3cmFwQ2hlY2ssIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgV3JhcCcpKTtcbiAgICBqc29uQmFyLmFwcGVuZCh3cmFwTGFiZWwpO1xuXG4gICAgLy8gQ29weSBidXR0b24gKG1pcnJvcnMgdGhlIFwiQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTlwiIGFjdGlvbiBiZWxvdyxcbiAgICAvLyBzdXJmYWNlZCBhdCB0aGUgdG9wIHNvIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBzY3JvbGwgcGFzdCB0aGUgSlNPTlxuICAgIC8vIHRvIGZpbmQgaXQpLlxuICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb3B5QnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb3B5QnRuLmNsYXNzTmFtZSA9ICdpY29uYnRuIGpzb24tY29weSc7XG4gICAgY29weUJ0bi5kYXRhc2V0LnRpcCA9ICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJztcbiAgICBjb3B5QnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb3B5IGNhcHR1cmUgYXMgSlNPTicpO1xuICAgIGNvcHlCdG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjb3B5JywgMTMpO1xuICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIC8vIEZ1bGwgc2luZ2xlLWNhcHR1cmUgZXhwb3J0OiBpZGVudGl0eSArIHBhdGhzICsgdGV4dC9jb250ZW50ICsgZXZlcnlcbiAgICAgIC8vIGF0dGFjaGVkIG5vdGUvY29tbWVudCDigJQgdGhlIHNhbWUgZGVwdGggYXMgYSBmdWxsIGV4cG9ydCwgc2NvcGVkIHRvXG4gICAgICAvLyB0aGlzIG9uZSBjYXB0dXJlIChpdGVtIDcpLiBEaXN0aW5jdCBmcm9tIHRoZSByYXcgZW50cnkgc2hvd24gYmVsb3cuXG4gICAgICBjb25zdCBmZWVkYmFjayA9IG1lc3NhZ2VzLmZsYXRNYXAoKHgpID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LnBhcmVudFVpZCA9PT0gbS5lbnRyeS51aWRcbiAgICAgICAgPyBbe3RleHQ6IHgudGV4dCwgdHM6IHgudHMsIHVpZDogeC5pZCwgcGFyZW50VWlkOiB4LnBhcmVudFVpZH1dIDogW10pO1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplQ2FwdHVyZUpzb24oe2VudHJ5OiBtLmVudHJ5LCBmZWVkYmFja30pKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNhcHR1cmUgZXhwb3J0Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY2FwdHVyZScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSk7XG4gICAganNvbkJhci5hcHBlbmQoY29weUJ0bik7XG4gICAganNvbldyYXAuYXBwZW5kKGpzb25CYXIpO1xuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvZHkuY2xhc3NOYW1lID0gJ2JvZHktanNvbiB3cmFwLW9uJztcbiAgICAvLyBSZW5kZXIgdGhlIEpTT04gdG8gbWF0Y2ggdGhlIHdyYXAgc3RhdGU6XG4gICAgLy8gICB3cmFwIE9OICDihpIgYSBzaW5nbGUgbWluaWZpZWQgbGluZSAoaW5kZW50IDApIHRoYXQgc29mdC13cmFwcyB0byB0aGVcbiAgICAvLyAgICAgICAgICAgICAgYnViYmxlIHdpZHRoIChDU1MgaGFuZGxlcyB0aGUgdmlzdWFsIHdyYXBwaW5nIHZpYVxuICAgIC8vICAgICAgICAgICAgICBvdmVyZmxvdy13cmFwOmFueXdoZXJlKSwgc28gdGhlIHdob2xlIG9iamVjdCBpcyBvbmVcbiAgICAvLyAgICAgICAgICAgICAgY29udGludW91cyBzdHJpbmcgd2l0aCBubyBob3Jpem9udGFsIHNjcm9sbC5cbiAgICAvLyAgIHdyYXAgT0ZGIOKGkiB0aGUgZ2xvYmFsIG1pbmlmeS1yZXNwZWN0aW5nIGZvcm06IHByZXR0eS1wcmludGVkIGZ1bGxcbiAgICAvLyAgICAgICAgICAgICAgZW50cnksIG9yIHRoZSBzbGltRW50cnkgY29tcGFjdCBmb3JtIHdoZW4gbWluaWZ5IGlzIG9uLFxuICAgIC8vICAgICAgICAgICAgICB3aXRoIGhvcml6b250YWwgc2Nyb2xsIGZvciBsb25nIGxpbmVzLlxuICAgIGNvbnN0IHJlbmRlckpzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gJyc7XG4gICAgICBjb25zdCB3cmFwcGVkID0gd3JhcENoZWNrLmNoZWNrZWQ7XG4gICAgICBjb25zdCBwYXlsb2FkID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IHNsaW1FbnRyeShtLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlfSkgOiBtLmVudHJ5O1xuICAgICAgY29uc3QgaW5kZW50ID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IDAgOiAyO1xuICAgICAgY29uc3QgdGV4dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIGluZGVudCk7XG4gICAgICBhcHBlbmRKc29uSGlnaGxpZ2h0KGJvZHksIHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICByZW5kZXJKc29uKCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG5cbiAgICAgIH0gZWxzZSBzZXRTdGF0dXMoJ1JlLWNhcHR1cmUgZmFpbGVkJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSB0aGlzIGNhcHR1cmUgYXMgYSBmdWxsIGV4cG9ydCAocGF0aHMsIHRleHQsIGNvbW1lbnRzKScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmVlZGJhY2sgPSAobTogRmVlZGJhY2tNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2snO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIGRpdi5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2gobS50ZXh0LCBzZWFyY2hRdWVyeSk7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkge1xuICAgICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IHNlbGVjdG9yIOKAlCBwcmVmZXIgcGFyZW50VWlkICh0aGUgcGVyc2lzdGVkIEZLKVxuICAgICAgLy8gb3ZlciBjYXB0dXJlLWFkamFjZW5jeSwgc2luY2UgZHJhZy10by1yZXBhcmVudCBtb3ZlcyB0aGUgY2hpcCBidXRcbiAgICAgIC8vIHRoZSB0cmFpbGluZy1zZWxlY3RvciBoZXVyaXN0aWMgZ2l2ZXMgc3RhbGUgcmVzdWx0cyB1bnRpbCByZW5kZXJcbiAgICAgIC8vIHNldHRsZXMuIFRoZSBhbm5vdGF0aW9uIG92ZXJsYXkgbmVlZHMgdGhlIHBhcmVudCdzIHNlbGVjdG9yIHRvXG4gICAgICAvLyBhbmNob3IgdGhlIG9uLXBhZ2UgdG9vbHRpcC5cbiAgICAgIGNvbnN0IHtwYXJlbnRTZWwsIHBhcmVudFVpZH0gPSAoKCkgPT4ge1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHtcbiAgICAgICAgICBjb25zdCBwID0gbWVzc2FnZXMuZmluZChcbiAgICAgICAgICAgIChtbSkgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAobW0gYXMgU2VsZWN0b3JNZXNzYWdlKS5lbnRyeS51aWQgPT09IG0ucGFyZW50VWlkLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHAgJiYgcC50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4ge3BhcmVudFNlbDogcC5lbnRyeS5zZWxlY3RvciwgcGFyZW50VWlkOiBwLmVudHJ5LnVpZH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtwYXJlbnRTZWw6IGxhc3RTZWxlY3RvclNlbCwgcGFyZW50VWlkOiB1bmRlZmluZWQgYXMgc3RyaW5nIHwgdW5kZWZpbmVkfTtcbiAgICAgIH0pKCk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICAvLyBTY3JvbGwgdGhlIHBhcmVudCBlbGVtZW50IGludG8gdmlldyArIHNob3cgdGhlIG9uLXBhZ2VcbiAgICAgICAgLy8gYW5ub3RhdGlvbiB0b29sdGlwIHJlbmRlcmluZyBUSElTIGNvbW1lbnQncyB0ZXh0LiBQYXNzIHRoZVxuICAgICAgICAvLyBwYXJlbnQncyB1aWQgc28gYSBzYW1lLXNlbGVjdG9yIHNpYmxpbmcgY2FwdHVyZSBkb2Vzbid0IGdldFxuICAgICAgICAvLyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgXCJ0aGUgc2FtZSB0YXJnZXRcIiBieSB0aGUgY29udGVudFxuICAgICAgICAvLyBzY3JpcHQncyBhbm5vdGF0aW9uIG92ZXJsYXkuXG4gICAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSB7XG4gICAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogcGFyZW50U2VsLCBzdGlja3k6IHRydWV9KTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kVG9DUyh7XG4gICAgICAgICAga2luZDogJ2Fubm90YXRpb24nLFxuICAgICAgICAgIHNlbGVjdG9yOiBwYXJlbnRTZWwsXG4gICAgICAgICAgcGF5bG9hZDoge3NlbGVjdG9yOiBwYXJlbnRTZWwsIHVpZDogcGFyZW50VWlkLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2s6IFttLnRleHRdfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkaXYuZGF0YXNldC5jb21tZW50SWQgPSBtLmlkO1xuICAgIGNvbnN0IGJlZ2luQ29tbWVudERyYWcgPSAoZTogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JywgbS5pZCk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgndGV4dC9wbGFpbicsIG0udGV4dCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgfTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYWN0aW9ucy5jbGFzc05hbWUgPSAnYWN0aW9ucyc7XG4gICAgY29uc3QgZHJhZ0hhbmRsZSA9IGFjdGlvbkJ0bignZ3JpcCcsICdEcmFnIHRoaXMgaGFuZGxlIG9udG8gYSBzZWxlY3RvciB0byByZXBhcmVudCcsICgpID0+IHsgLyogZHJhZyBoYW5kbGUgb25seSAqLyB9KTtcbiAgICBkcmFnSGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2RyYWctaGFuZGxlJyk7XG4gICAgZHJhZ0hhbmRsZS5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgYmVnaW5Db21tZW50RHJhZyk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZHJhZ0hhbmRsZSk7XG4gICAgLy8gRGV0YWNoIOKAlCB0aGUgaW52ZXJzZSBvZiBkcmFnLXRvLXJlcGFyZW50LiBPbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVcbiAgICAvLyBjb21tZW50IGN1cnJlbnRseSByZWFkcyBhcyB0aHJlYWRlZCAoRksgb3IgYWRqYWNlbmN5KS5cbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsIHx8IG0ucGFyZW50VWlkKSB7XG4gICAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3VubGluaycsICdEZXRhY2ggZnJvbSBpdHMgY2FwdHVyZSDigJQgbWFrZSB0aGlzIGEgc3RhbmRhbG9uZSBjb21tZW50JywgKCkgPT4ge1xuICAgICAgICAvLyBSZXNvbHZlIGJ5IGlkIGZyb20gdGhlIExJVkUgYXJyYXk6IHdvcmtzcGFjZSBzd2l0Y2hlcyBhbmRcbiAgICAgICAgLy8gdW5kby9yZWRvIHJlYXNzaWduIGBtZXNzYWdlc2AsIHNvIHRoZSBjbG9zdXJlJ3MgYG1gIGNhbiBiZSBhXG4gICAgICAgIC8vIHN0YWxlIG9iamVjdCB3aG9zZSBtdXRhdGlvbiB3b3VsZCBiZSBzaWxlbnRseSBkcm9wcGVkIGJ5IHRoZVxuICAgICAgICAvLyBuZXh0IHBlcnNpc3QoKS5cbiAgICAgICAgY29uc3QgbGl2ZSA9IG1lc3NhZ2VzLmZpbmQoKHgpOiB4IGlzIEZlZWRiYWNrTWVzc2FnZSA9PiB4LnR5cGUgPT09ICdmZWVkYmFjaycgJiYgeC5pZCA9PT0gbS5pZCk7XG4gICAgICAgIGlmICghbGl2ZSkgeyBzZXRTdGF0dXMoJ0NvbW1lbnQgbm8gbG9uZ2VyIGV4aXN0cycsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIGRlbGV0ZSBsaXZlLnBhcmVudFVpZDtcbiAgICAgICAgbGl2ZS5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cygnQ29tbWVudCBkZXRhY2hlZCDigJQgZHJhZyBpdHMgaGFuZGxlIG9udG8gYSBjYXB0dXJlIHRvIHJlYXR0YWNoJyk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IGNvbW1lbnQgdGV4dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KG0udGV4dCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY29tbWVudCcpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3BlbmNpbCcsICdFZGl0IGNvbW1lbnQnLCAoKSA9PiBlbnRlckZlZWRiYWNrRWRpdChkaXYsIG0pLCB7c2l6ZTogMTV9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgLy8gRHJvcCBoYW5kbGVyIHNoYXJlZCBieSBldmVyeSBzZWxlY3RvciBidWJibGUuIEFjY2VwdHMgYSBkcmFnZ2VkXG4gIC8vIGNvbW1lbnQgSUQgdmlhIHRoZSBgYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudGAgTUlNRSwgdXBkYXRlc1xuICAvLyBwYXJlbnRVaWQgKyBhZGphY2VuY3ksIHBlcnNpc3RzLCByZS1yZW5kZXJzLlxuICBjb25zdCB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IFNlbGVjdG9yTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICBjb25zdCB0eXBlcyA9IGUuZGF0YVRyYW5zZmVyPy50eXBlcztcbiAgICAgIGlmICghdHlwZXMgfHwgIUFycmF5LmZyb20odHlwZXMpLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JykpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcm9wLXRhcmdldCcpO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZSkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyPy5nZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50Jyk7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBzcmNJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gaWQpO1xuICAgICAgaWYgKHNyY0lkeCA8IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHNyYyA9IG1lc3NhZ2VzW3NyY0lkeF0hIGFzIEZlZWRiYWNrTWVzc2FnZTtcbiAgICAgIGlmIChzcmMudHlwZSAhPT0gJ2ZlZWRiYWNrJykgcmV0dXJuO1xuICAgICAgY29uc3QgZHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgaWYgKGRzdElkeCA8IDApIHJldHVybjtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICAvLyBVcGRhdGUgdGhlIEZLIHBvaW50ZXIgZmlyc3Qg4oCUIHRoYXQncyB0aGUgc291cmNlIG9mIHRydXRoIGluXG4gICAgICAvLyBleHBvcnRzLiBBZGphY2VuY3kgaXMganVzdCBhIHJlbmRlciBjb252ZW5pZW5jZS4gUmVwYXJlbnRpbmcgaXNcbiAgICAgIC8vIHRoZSBpbnZlcnNlIG9mIGRldGFjaCwgc28gdGhlIGRldGFjaGVkIGZsYWcgaXMgY2xlYXJlZC5cbiAgICAgIHNyYy5wYXJlbnRVaWQgPSBtLmVudHJ5LnVpZDtcbiAgICAgIGRlbGV0ZSBzcmMuZGV0YWNoZWQ7XG4gICAgICAvLyBTcGxpY2Ugc3JjIG91dCBvZiBpdHMgY3VycmVudCBzbG90IGFuZCByZS1pbnNlcnQgcmlnaHQgYWZ0ZXIgdGhlXG4gICAgICAvLyBuZXcgcGFyZW50IChhbmQgYW55IGZlZWRiYWNrIGFscmVhZHkgdHJhaWxpbmcgaXQsIHNvIHRoZSBtb3N0LVxuICAgICAgLy8gcmVjZW50IGZlZWRiYWNrIGVuZHMgdXAgbmVhcmVzdCB0aGUgcGFyZW50IHZpc3VhbGx5KS5cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShzcmNJZHgsIDEpO1xuICAgICAgY29uc3QgbmV3RHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgbGV0IGluc2VydEF0ID0gbmV3RHN0SWR4ICsgMTtcbiAgICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0hLnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHNyYyk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCByZXBhcmVudGVkJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdHlwZSBBY3Rpb25CdG5PcHRzID0ge3dhcm4/OiBib29sZWFuOyB0b2dnbGVkPzogYm9vbGVhbjsgc2l6ZT86IG51bWJlcn07XG4gIGNvbnN0IGFjdGlvbkJ0biA9IChpY29uOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGZuOiAoKSA9PiB2b2lkLCBvcHRzOiBBY3Rpb25CdG5PcHRzID0ge30pOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuZGF0YXNldC50aXAgPSB0aXRsZTtcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRpdGxlKTtcbiAgICBpZiAob3B0cy53YXJuKSBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBpZiAob3B0cy50b2dnbGVkKSBiLmNsYXNzTGlzdC5hZGQoJ3RvZ2dsZWQnKTtcbiAgICAvLyBEZWZhdWx0IGljb24gc2l6ZSAxMyByZWFkcyBzbGlnaHRseSBzbWFsbCBpbiBhIDIyw5cyMiBidXR0b24g4oCUIGZpbmVcbiAgICAvLyBmb3IgaWNvbnMgd2l0aCBzaW1wbGUgc2hhcGVzIChjcm9zc2hhaXIsIGxpc3QtdHJlZSwgdW5kbykgYnV0IHZpc2libHlcbiAgICAvLyBzcXVlZXplZCBmb3IgYG1lc3NhZ2Utc3F1YXJlLXBsdXNgIGFuZCBgcGVuY2lsYCwgd2hlcmUgdGhlXG4gICAgLy8gaW50ZXJpb3Igc3Ryb2tlcyB2YW5pc2ggaW50byBoYWlybGluZSBibHVyLiBDYWxsZXJzIGNhbiBidW1wIHdpdGhcbiAgICAvLyBgc2l6ZTogMTVgIGZvciB0aG9zZS5cbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhpY29uLCBvcHRzLnNpemUgPz8gMTMpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBmbigpOyB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBkZWxldGVCdG4gPSAob25Db25maXJtOiAoKSA9PiB2b2lkKTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBiLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSc7XG4gICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnRGVsZXRlIGNhcHR1cmUnKTtcbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZXZlcnRUaW1lciA9IDA7XG4gICAgY29uc3QgcmV2ZXJ0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbmZpcm0teWVzLCAuY29uZmlybS1ubycpKSBuLnJlbW92ZSgpO1xuICAgICAgaWYgKCFiLnBhcmVudEVsZW1lbnQpIHBhcmVudC5hcHBlbmQoYik7XG4gICAgICBjbGVhclRpbWVvdXQocmV2ZXJ0VGltZXIpO1xuICAgIH07XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcGFyZW50ID0gYi5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgeWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB5ZXMudHlwZSA9ICdidXR0b24nO1xuICAgICAgeWVzLmNsYXNzTmFtZSA9ICdjb25maXJtLXllcyc7XG4gICAgICB5ZXMuZGF0YXNldC50aXAgPSAnQ29uZmlybSBkZWxldGUnO1xuICAgICAgeWVzLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb25maXJtIGRlbGV0ZScpO1xuICAgICAgeWVzLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAxMyk7XG4gICAgICB5ZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyBvbkNvbmZpcm0oKTsgfSk7XG4gICAgICBjb25zdCBubyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgbm8udHlwZSA9ICdidXR0b24nO1xuICAgICAgbm8uY2xhc3NOYW1lID0gJ2NvbmZpcm0tbm8nO1xuICAgICAgbm8uZGF0YXNldC50aXAgPSAnQ2FuY2VsIGRlbGV0ZSc7XG4gICAgICBuby5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIGRlbGV0ZScpO1xuICAgICAgbm8uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgICAgbm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyB9KTtcbiAgICAgIGIucmVwbGFjZVdpdGgoeWVzKTtcbiAgICAgIHllcy5hZnRlcihubyk7XG4gICAgICByZXZlcnRUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHJldmVydCwgODAwMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZW50ZXJGZWVkYmFja0VkaXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogRmVlZGJhY2tNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5leHQuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayBlZGl0aW5nJztcbiAgICBpZiAoZGl2LmNsYXNzTGlzdC5jb250YWlucygndGhyZWFkZWQnKSkgbmV4dC5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIG5leHQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgbmV4dC5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgIGluaXRpYWw6IG0udGV4dCxcbiAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGRpdi5yZXBsYWNlV2l0aChkaXYuY2xvbmVOb2RlKHRydWUpKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvblN1Ym1pdDogKHRleHQpID0+IHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkID09PSBtLnRleHQpIHsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLnRleHQgPSB0cmltbWVkO1xuICAgICAgICAvLyBTZXZlcml0eSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFVJLiBTdHJpcCBhbnkgbGVnYWN5IHZhbHVlXG4gICAgICAgIC8vIHRoYXQgY2FtZSBiYWNrIGZyb20gYW4gb2xkZXIgSlNPTkwgaW1wb3J0IHNvIHNhdmVzIGRvbid0IGtlZXBcbiAgICAgICAgLy8gcmUtZW1pdHRpbmcgaXQuXG4gICAgICAgIGRlbGV0ZSAobSBhcyBhbnkpLnNldmVyaXR5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICB9KSk7XG4gICAgZGl2LnJlcGxhY2VXaXRoKG5leHQpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZU1lc3NhZ2UgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5pZCAhPT0gaWQpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0RlbGV0ZWQnKTtcbiAgICB9O1xuICAgIGlmICghZWwpIHsgZmluaXNoKCk7IHJldHVybjsgfVxuICAgIGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdyZW1vdmluZycpO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpOiB2b2lkID0+IHsgaWYgKGRvbmUpIHJldHVybjsgZG9uZSA9IHRydWU7IGZpbmlzaCgpOyB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBjbGVhbnVwLCB7b25jZTogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoY2xlYW51cCwgMzgwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQ29tcG9zZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRGZWVkYmFjayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gY29tcG9zZXIudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBpbi1tZW1vcnkgbWVzc2FnZSBhdCBjcmVhdGlvbiB0aW1lIHNvIHRoZVxuICAgIC8vIEZLIGlzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoLiBUaGUgc2xpbSBlbWl0IG5vIGxvbmdlciBoYXMgdG9cbiAgICAvLyBpbmZlciB0aGUgcGFyZW50IGZyb20gY2FwdHVyZS1hZGphY2VuY3ksIGFuZCBgbWFuaWZlc3QuY291bnRzYFxuICAgIC8vIGFjY3VyYXRlbHkgcmVmbGVjdHMgZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMuXG4gICAgLy8gV2FsayBiYWNrIHRvIHRoZSBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3RvciBiZWZvcmUgc3BsaWNlLlxuICAgIGxldCBwSWR4ID0gcG9zaXRpb24gLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfSk7XG4gICAgY29tcG9zZXIudmFsdWUgPSAnJztcbiAgICB1cGRhdGVDb21wb3Nlck1ldGVyKCk7XG4gICAgLy8gU2VuZGluZyBjbGVhcnMgYW55IGFjdGl2ZSB2aXN1YWwgZmluZCBzbyB0aGUgbmV3IGNvbW1lbnQgaXNuJ3QgaGlkZGVuXG4gICAgLy8gYmVoaW5kIGEgc3RhbGUgZmlsdGVyLlxuICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnU2VudCcpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgLy8gQnVnICMyOiBmZWVkYmFjaydzIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAhcGFyZW50LmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudCBhcyBTZWxlY3Rvck1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgKGUpID0+IHtcbiAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIoKTtcbiAgICAgIGlmICghaGFuZGxlZCkgc2VuZEZlZWRiYWNrKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlQ29tcG9zZXJNZXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ID0gY29tcG9zZXIudmFsdWU7XG4gICAgY29tcFdvcmRzLnRleHRDb250ZW50ID0gU3RyaW5nKHdvcmRDb3VudCh0KSk7XG4gICAgY29tcFRva2Vucy50ZXh0Q29udGVudCA9IFN0cmluZyh0b2tlbkNvdW50KHQpKTtcbiAgICBjb21wb3Nlci5jbGFzc0xpc3QudG9nZ2xlKCdjbWQtbW9kZScsIC9ePi8udGVzdCh0LnRyaW0oKSkpO1xuICB9O1xuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHVwZGF0ZUNvbXBvc2VyTWV0ZXIpO1xuXG4gIC8vIOKUgOKUgCBIZWFkZXIgc2VhcmNoIOKGkiBjb21tYW5kIHBhbGV0dGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFRoZSBoZWFkZXIgc2VhcmNoIGFmZm9yZGFuY2Ugbm8gbG9uZ2VyIHJ1bnMgaXRzIG93biBmaWx0ZXI7IGNsaWNraW5nIG9yXG4gIC8vIGZvY3VzaW5nIGl0IG9wZW5zIHRoZSBDbWQrSyBjb21tYW5kIHBhbGV0dGUgKHdoaWNoIHNlYXJjaGVzIGNhcHR1cmVzIEFORFxuICAvLyBydW5zIGNvbW1hbmRzKS4gSXQncyBhIHJlYWRvbmx5IHRyaWdnZXIsIHNvIHdlIGp1c3Qgb3BlbiB0aGUgcGFsZXR0ZSBhbmRcbiAgLy8gZHJvcCBmb2N1cyBzbyB0aGUgcGFsZXR0ZSBpbnB1dCB0YWtlcyBvdmVyIGNsZWFubHkuXG4gIGNvbnN0IHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSByZXR1cm47XG4gICAgb3BlblBhbGV0dGUoKTtcbiAgICBzZWFyY2guYmx1cigpO1xuICB9O1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2goKTsgfVxuICB9KTtcblxuICAvLyDilIDilIAgQ3RybCtGIHZpc3VhbCBmaW5kIChpbi1saXN0IGZpbHRlciArIGhpZ2hsaWdodCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybjtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY29uc3QgZmlyc3RIaXQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnLnNlbGVjdG9yLnNlYXJjaC1oaXQnKTtcbiAgICAgIGlmIChmaXJzdEhpdCkge1xuICAgICAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGZpcnN0SGl0KTtcbiAgICAgICAgY29uc3QgbWsgPSBmaXJzdEhpdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignbWFyaycpO1xuICAgICAgICBpZiAobWspIGNlbnRlckVsZW1lbnRJbkxpc3QobWspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlyc3RNYXRjaCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cgbWFyaycpO1xuICAgICAgICBpZiAoZmlyc3RNYXRjaCkgY2VudGVyRWxlbWVudEluTGlzdChmaXJzdE1hdGNoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlRmluZENvdW50ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZENvdW50KSByZXR1cm47XG4gICAgZmluZENvdW50LnRleHRDb250ZW50ID0gc2VhcmNoUXVlcnkgPyBgJHtsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cnKS5sZW5ndGh9IG1hdGNoYCA6ICcnO1xuICB9O1xuICBjb25zdCBhcHBseUZpbmQgPSAodmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHNlYXJjaFF1ZXJ5ID0gdmFsdWUudHJpbSgpO1xuICAgIHJlbmRlcigpO1xuICAgIHVwZGF0ZUZpbmRDb3VudCgpO1xuICAgIHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3KCk7XG4gIH07XG4gIGNvbnN0IG9wZW5GaW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZEJhciB8fCAhZmluZElucHV0KSByZXR1cm47XG4gICAgZmluZEJhci5oaWRkZW4gPSBmYWxzZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LmFkZCgnZmluZC1vcGVuJyk7XG4gICAgZmluZElucHV0LmZvY3VzKCk7XG4gICAgZmluZElucHV0LnNlbGVjdCgpO1xuICB9O1xuICBjb25zdCBjbG9zZUZpbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGZpbmRCYXIpIGZpbmRCYXIuaGlkZGVuID0gdHJ1ZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LnJlbW92ZSgnZmluZC1vcGVuJyk7XG4gICAgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gJyc7XG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7IHNlYXJjaFF1ZXJ5ID0gJyc7IHJlbmRlcigpOyB9XG4gICAgdXBkYXRlRmluZENvdW50KCk7XG4gIH07XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiBhcHBseUZpbmQoZmluZElucHV0LnZhbHVlKSk7XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7IGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBjbG9zZUZpbmQoKTsgfSB9KTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZmluZC1jbGVhcl0nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUZpbmQpO1xuXG4gIGNvbnN0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgbSA9IC9ePlxccyooLispJC8uZXhlYyhjb21wb3Nlci52YWx1ZS50cmltKCkpO1xuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHNlbCA9IG1bMV0hLnRyaW0oKTtcbiAgICBpZiAoIXNlbCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbn0+KHtraW5kOiAnbWFudWFsLWNhcHR1cmUnLCBzZWxlY3Rvcjogc2VsfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgeyBjb21wb3Nlci52YWx1ZSA9ICcnOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IHNldFN0YXR1cygnQ2FwdHVyZWQgJyArIHNlbCk7IH1cbiAgICBlbHNlIHNldFN0YXR1cygnU2VsZWN0b3IgZGlkIG5vdCBtYXRjaDogJyArIHNlbCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBFeHBvcnQgYnVpbGRlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHYyIGV4cG9ydCBzaGFwZTogdG9wIGxldmVsIGtlZXBzIHVzZXItZmFjaW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkc1xuICAvLyAodWlkLCBuLCBzZWxlY3RvciwgdGV4dCwgcm9sZSwgYXR0cnMsIGhpbnRzLCBjbGFzc2VzLCBzdHlsZXMsIGNvbXBvbmVudCxcbiAgLy8gc3RhdGVzLCBzY3JlZW5zaG90LCBncm91cCkuIERpYWdub3N0aWMgLyBkZXRlY3Rpb24gbWV0YWRhdGEgbW92ZXMgdW5kZXJcbiAgLy8gYW4gYF9hdWRpdGAgbmFtZXNwYWNlIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIGluU2hhZG93RE9NLFxuICAvLyBwc2V1ZG9FbGVtZW50cywgbWF0Y2hlZFJ1bGVzLCB2aWV3cG9ydCkuIFRoZSB2ZXJzaW9uIG1hcmtlciBpcyBlbWl0dGVkXG4gIC8vIGFzIGB2OiAyYC4gSW1wb3J0ZXJzIGRldGVjdCBlaXRoZXIgdjEgKGZsYXQpIG9yIHYyIGFuZCBkZW5vcm1hbGl6ZS5cbiAgLy9cbiAgLy8gQWdncmVzc2l2ZSBtaW5pZnkgYWRkaXRpb25hbGx5IGRyb3BzIGZpZWxkcyB0aGUgc2VsZWN0b3IgYWxyZWFkeVxuICAvLyBpbXBsaWVzOiBhbmNlc3RvcnMsIHZpZXdwb3J0IChvbmUgcGVyIHBhZ2UpLCBjb21wb25lbnRSb290IHdoZW5cbiAgLy8gcmVkdW5kYW50IHdpdGggdGhlIHNlbGVjdG9yLCBhbmQgcHNldWRvRWxlbWVudHMuXG4gIGNvbnN0IHNsaW1FbnRyeSA9IChlOiBFbnRyeSwgb3B0czoge2luY2x1ZGVHcm91cD86IGJvb2xlYW47IGV2ZW50SW5kZXg/OiBudW1iZXI7IHZpc3VhbE9yZGVyPzogbnVtYmVyOyBncm91cFVpZD86IHN0cmluZ30gPSB7fSk6IFJlY29yZDxzdHJpbmcsIGFueT4gPT4ge1xuICAgIGNvbnN0IGluY2x1ZGVPdXRlciA9IHByZWZzLmluY2x1ZGVPdXRlckhUTUw7XG4gICAgY29uc3QgaW5jbHVkZU1hdGNoZWQgPSBwcmVmcy5pbmNsdWRlTWF0Y2hlZFJ1bGVzO1xuICAgIGNvbnN0IGluY2x1ZGVTdHlsZXMgPSBwcmVmcy5pbmNsdWRlU3R5bGVzO1xuICAgIGNvbnN0IG1pbmlmeSA9IHByZWZzLm1pbmlmeTtcblxuICAgIC8vIFRvcC1sZXZlbCB1c2VyLWZhY2luZyBmaWVsZHMuIE9yZGVyIG1hdHRlcnMgZm9yIG91dHB1dCByZWFkYWJpbGl0eSDigJRcbiAgICAvLyB3ZSB3YW50IGB2IC8gdHlwZSAvIHVpZCAvIG4gLyBzZWxlY3RvcmAgZmlyc3Qgc28gSlNPTkwgaXMgZ3JlcHBhYmxlLlxuICAgIC8vXG4gICAgLy8gYG5gIHN0YXlzIGFzIHRoZSBjYXB0dXJlLXNlcXVlbmNlIGRpc3BsYXkgbGFiZWwgZm9yIGJhY2t3YXJkc1xuICAgIC8vIGNvbXBhdGliaWxpdHkgd2l0aCB2MS92MiByZWFkZXJzIChhbmQgdGhlIHNpZGViYXIncyBcIiMzXCIgY2hpcHMpLlxuICAgIC8vIFRoZSBkaXNhbWJpZ3VhdGVkIGNvdXNpbnMgKGBjYXB0dXJlSW5kZXhgLCBgZXZlbnRJbmRleGAsXG4gICAgLy8gYHZpc3VhbE9yZGVyYCwgYGRpc3BsYXlMYWJlbGApIGxpdmUgb24gdGhlIHJvdyBzbyBhIGRvd25zdHJlYW1cbiAgICAvLyBhZ2VudCBjYW4gcGljayB3aGljaGV2ZXIgb3JkZXJpbmcgaXMgbWVhbmluZ2Z1bCDigJQgYnVnICMxMC5cbiAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICB2OiAyLFxuICAgICAgdHlwZTogJ3NlbGVjdG9yJyxcbiAgICAgIHVpZDogZS51aWQsXG4gICAgICBuOiBlLm4sXG4gICAgICB0czogZS50cyxcbiAgICAgIHVybDogZS51cmwsXG4gICAgICB0YWc6IGUudGFnLFxuICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsXG4gICAgICBjYXB0dXJlSW5kZXg6IGUubixcbiAgICAgIGRpc3BsYXlMYWJlbDogU3RyaW5nKGUubiksXG4gICAgfTtcbiAgICBpZiAob3B0cy5ldmVudEluZGV4ICE9PSB1bmRlZmluZWQpIG91dC5ldmVudEluZGV4ID0gb3B0cy5ldmVudEluZGV4O1xuICAgIGlmIChvcHRzLnZpc3VhbE9yZGVyICE9PSB1bmRlZmluZWQpIG91dC52aXN1YWxPcmRlciA9IG9wdHMudmlzdWFsT3JkZXI7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUudGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQudGV4dCA9IG1pbmlmeSA/IGUudGV4dC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS50ZXh0O1xuICAgIGlmIChlLnJvbGUgIT09IHVuZGVmaW5lZCkgb3V0LnJvbGUgPSBlLnJvbGU7XG4gICAgaWYgKGUuYWNjZXNzaWJsZU5hbWUgIT09IHVuZGVmaW5lZCkgb3V0LmFjY2Vzc2libGVOYW1lID0gbWluaWZ5ID8gZS5hY2Nlc3NpYmxlTmFtZS5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBpZiAoZS5pZCAhPT0gdW5kZWZpbmVkKSBvdXQuaWQgPSBlLmlkO1xuICAgIGlmIChlLnRlc3RJZCAhPT0gdW5kZWZpbmVkKSBvdXQudGVzdElkID0gZS50ZXN0SWQ7XG4gICAgaWYgKGUuY2xhc3NlcyAmJiBlLmNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICBvdXQuY2xhc3NlcyA9IChtaW5pZnkgJiYgZS5jbGFzc2VzLmxlbmd0aCA+IDgpID8gZS5jbGFzc2VzLnNsaWNlKDAsIDgpIDogZS5jbGFzc2VzO1xuICAgIH1cbiAgICBpZiAoZS5hdHRycyAmJiBPYmplY3Qua2V5cyhlLmF0dHJzKS5sZW5ndGgpIG91dC5hdHRycyA9IGUuYXR0cnM7XG4gICAgaWYgKGUuaGludHMgJiYgT2JqZWN0LmtleXMoZS5oaW50cykubGVuZ3RoKSBvdXQuaGludHMgPSBlLmhpbnRzO1xuICAgIGlmIChlLnJlY3QpIG91dC5yZWN0ID0gZS5yZWN0O1xuICAgIGlmIChlLnN0YXRlcyAmJiBlLnN0YXRlcy5sZW5ndGgpIG91dC5zdGF0ZXMgPSBlLnN0YXRlcztcbiAgICBpZiAoZS5jb21wb25lbnQpIG91dC5jb21wb25lbnQgPSBlLmNvbXBvbmVudDtcbiAgICAvLyBMb2NhdG9yLXF1YWxpdHkgZmllbGQuIFByb21vdGUgZXZlbiB3aGVuIG1pbmlmaWVkIOKAlCBpdCdzIGEgc2luZ2xlXG4gICAgLy8gc21hbGwgaW50IGFuZCBhIGRvd25zdHJlYW0gYWdlbnQgdXNlcyBpdCB0byBkZWNpZGUgd2hldGhlciB0b1xuICAgIC8vIHRydXN0IHRoZSBzZWxlY3Rvci5cbiAgICBpZiAoZS5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkgb3V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9IGUuc2VsZWN0b3JNYXRjaENvdW50O1xuICAgIGlmIChlLmExMXkpIG91dC5hMTF5ID0gZS5hMTF5O1xuICAgIGlmIChlLmFzc2V0cyAmJiBlLmFzc2V0cy5sZW5ndGgpIG91dC5hc3NldHMgPSBlLmFzc2V0cztcbiAgICBpZiAoZS5sYXlvdXRDb250ZXh0ICYmIGUubGF5b3V0Q29udGV4dC5sZW5ndGgpIG91dC5sYXlvdXRDb250ZXh0ID0gZS5sYXlvdXRDb250ZXh0O1xuICAgIGlmIChpbmNsdWRlT3V0ZXIgJiYgZS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb3V0Lm91dGVySFRNTCA9IG1pbmlmeSA/IGUub3V0ZXJIVE1MLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLm91dGVySFRNTDtcbiAgICB9XG4gICAgaWYgKGluY2x1ZGVTdHlsZXMgJiYgZS5zdHlsZXMgJiYgT2JqZWN0LmtleXMoZS5zdHlsZXMpLmxlbmd0aCkgb3V0LnN0eWxlcyA9IGUuc3R5bGVzO1xuICAgIGlmIChlLnNjcmVlbnNob3QpIHtcbiAgICAgIC8vIFBhdGggbm9ybWFsaXphdGlvbjogdGhlIGxpdmUgYGVudHJ5LnNjcmVlbnNob3QuZWxlbWVudGAgY2FycmllcyBhXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4ZWQgcGF0aCAoZS5nLiBgZGVmYXVsdC9zY3JlZW5zaG90cy9mb28ucG5nYClcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGJhY2tncm91bmQncyBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIEFQSSBzdGFtcHNcbiAgICAgIC8vIHRoZSB3b3Jrc3BhY2UgaW50byB0aGUgb24tZGlzayBwYXRoLiBCdXQgdGhlIC50YXIuenN0IGFyY2hpdmVcbiAgICAgIC8vIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZmxhdCBhdCBgc2NyZWVuc2hvdHMvZm9vLnBuZ2AsIHNvIHRoZVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeCB3b3VsZCByZXNvbHZlIHRvIG5vdGhpbmcgZm9yIGFuIGFnZW50IHRoYXRcbiAgICAgIC8vIGV4dHJhY3RlZCB0aGUgYXJjaGl2ZS4gU3RyaXAgdGhlIHdvcmtzcGFjZSBwcmVmaXggb24gZW1pdCBzb1xuICAgICAgLy8gZXZlcnkgcGF0aCBpcyB2YWxpZCByZWxhdGl2ZSB0byB0aGUgbWFuaWZlc3QncyBkZWNsYXJlZFxuICAgICAgLy8gYHBhdGhSb290YCAoYXJjaGl2ZSByb290IGZvciB0YXIuenN0OyB3b3Jrc3BhY2Ugcm9vdCBmb3IgcGxhaW5cbiAgICAgIC8vIEpTT05MIOKAlCBpLmUuLCBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICBjb25zdCBzdHJpcFdzID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGlmICghcCkgcmV0dXJuIHA7XG4gICAgICAgIC8vIFN0cmlwIGV4YWN0bHkgb25lIGxlYWRpbmcgYDx3b3Jrc3BhY2U+L2Agc2VnbWVudCBpZiBwcmVzZW50LlxuICAgICAgICBjb25zdCB3c1ByZWZpeCA9IGAke2FjdGl2ZVdzfS9gO1xuICAgICAgICByZXR1cm4gcC5zdGFydHNXaXRoKHdzUHJlZml4KSA/IHAuc2xpY2Uod3NQcmVmaXgubGVuZ3RoKSA6IHA7XG4gICAgICB9O1xuICAgICAgb3V0LnNjcmVlbnNob3QgPSB7Li4uZS5zY3JlZW5zaG90fTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5lbGVtZW50KSBvdXQuc2NyZWVuc2hvdC5lbGVtZW50ID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5lbGVtZW50KTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5ncm91cCkgb3V0LnNjcmVlbnNob3QuZ3JvdXAgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90Lmdyb3VwKTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5wYWdlKSBvdXQuc2NyZWVuc2hvdC5wYWdlID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5wYWdlKTtcbiAgICB9XG4gICAgLy8gUHJvbW90ZSBydW50aW1lL2JlaGF2aW9yIHNpZ25hbHMgdG8gdG9wLWxldmVsLiBUaGVzZSBhcmUgcHJpbWFyeVxuICAgIC8vIHNpZ25hbCBmb3IgdHJpYWdlIChldmVudHMgdGVsbHMgXCJ3aGljaCBoYW5kbGVyIHJhblwiLCBiZWhhdmlvckF0dHJzXG4gICAgLy8gdGVsbHMgXCJ3aGF0IHNlcnZlci1yZW5kZXJlZCBiaW5kaW5nIGRvZXMgdGhpcyBmaXJlXCIsIGNhbnZhc0NsaWNrXG4gICAgLy8gdGVsbHMgXCJ3aGVyZSBvbiB0aGUgY2hhcnQgd2FzIGNsaWNrZWRcIiwgZWRpdG9yIHRlbGxzIFwid2hpY2hcbiAgICAvLyByaWNoLXRleHQgbGlicmFyeSB3cmFwcyB0aGlzXCIsIGRvbU11dGF0aW9ucyB0ZWxscyBcIndoYXQgY2hhbmdlZFxuICAgIC8vIGJlZm9yZSB0aGUgY2xpY2tcIiwgaXNBbmltYXRpbmcgd2FybnMgYWJvdXQgdHJhbnNpZW50IHN0YXRlKS5cbiAgICBpZiAoZS5ldmVudHMgJiYgT2JqZWN0LmtleXMoZS5ldmVudHMpLmxlbmd0aCkgb3V0LmV2ZW50cyA9IGUuZXZlbnRzO1xuICAgIGlmIChlLmJlaGF2aW9yQXR0cnMgJiYgT2JqZWN0LmtleXMoZS5iZWhhdmlvckF0dHJzKS5sZW5ndGgpIG91dC5iZWhhdmlvckF0dHJzID0gZS5iZWhhdmlvckF0dHJzO1xuICAgIGlmIChlLmNhbnZhc0NsaWNrKSBvdXQuY2FudmFzQ2xpY2sgPSBlLmNhbnZhc0NsaWNrO1xuICAgIGlmIChlLmVkaXRvcikgb3V0LmVkaXRvciA9IGUuZWRpdG9yO1xuICAgIGlmIChlLmlzQW5pbWF0aW5nKSBvdXQuaXNBbmltYXRpbmcgPSB0cnVlO1xuICAgIGlmIChlLnNoYWRvd0hvc3QpIG91dC5zaGFkb3dIb3N0ID0gZS5zaGFkb3dIb3N0O1xuICAgIGlmIChlLnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQucmVuZGVyZWRUZXh0ID0gZS5yZW5kZXJlZFRleHQ7XG4gICAgaWYgKGUudHJ1bmNhdGVkICYmIE9iamVjdC5rZXlzKGUudHJ1bmNhdGVkKS5sZW5ndGgpIG91dC50cnVuY2F0ZWQgPSBlLnRydW5jYXRlZDtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS5kb21NdXRhdGlvbnMgJiYgZS5kb21NdXRhdGlvbnMubGVuZ3RoKSBvdXQuZG9tTXV0YXRpb25zID0gZS5kb21NdXRhdGlvbnM7XG5cbiAgICAvLyBfYXVkaXQ6IGRldGVjdGlvbiBjaGFpbiAmIGRpYWdub3N0aWMgc2hhcGUuXG4gICAgLy8gUkVBRE1FIGNsYWltZWQgYF9hdWRpdC5hbmNlc3RvcnNgIGFuZCBgX2F1ZGl0LmNvbXBvbmVudFJvb3RgIHdlcmVcbiAgICAvLyBhbHdheXMgcHJlc2VudCwgYnV0IHRoZSBzbGltIGVtaXQgZHJvcHBlZCB0aGVtIHdoZW5ldmVyXG4gICAgLy8gYG1pbmlmeTogdHJ1ZWAuIFRoZSBmaXg6IGVtaXQgZXZlcnkgZGVjbGFyZWQgYF9hdWRpdGAgZmllbGRcbiAgICAvLyB3aGVuZXZlciB0aGUgc291cmNlIGRhdGEgZXhpc3RzLCBhbmQgbGV0XG4gICAgLy8gYG1pbmlmeWAgc2xpbSBPTkxZIHRoZSBoaWdoLXZvbHVtZSBibG9ja3MgKG1hdGNoZWRSdWxlcyxcbiAgICAvLyBwc2V1ZG9FbGVtZW50cykuIFNtYWxsIHN0cnVjdHVyYWwgbWV0YWRhdGEgKGFuY2VzdG9ycyxcbiAgICAvLyBjb21wb25lbnRSb290LCB2aWV3cG9ydCkgc3Vydml2ZXMgbWluaWZ5IHNvIHRoZSBzY2hlbWEgY2xhaW1zXG4gICAgLy8gc3RheSBob25lc3QuXG4gICAgY29uc3QgYXVkaXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAoZS5hbmNlc3RvcnMgJiYgZS5hbmNlc3RvcnMubGVuZ3RoKSBhdWRpdC5hbmNlc3RvcnMgPSBlLmFuY2VzdG9ycztcbiAgICBpZiAoZS5jb21wb25lbnRSb290ICE9PSB1bmRlZmluZWQpIGF1ZGl0LmNvbXBvbmVudFJvb3QgPSBlLmNvbXBvbmVudFJvb3Q7XG4gICAgaWYgKGUuaW5TaGFkb3dET00pIGF1ZGl0LmluU2hhZG93RE9NID0gdHJ1ZTtcbiAgICBpZiAoZS5wc2V1ZG9FbGVtZW50cyAmJiBPYmplY3Qua2V5cyhlLnBzZXVkb0VsZW1lbnRzKS5sZW5ndGggJiYgIW1pbmlmeSkgYXVkaXQucHNldWRvRWxlbWVudHMgPSBlLnBzZXVkb0VsZW1lbnRzO1xuICAgIGlmIChpbmNsdWRlTWF0Y2hlZCAmJiBlLm1hdGNoZWRSdWxlcyAmJiBlLm1hdGNoZWRSdWxlcy5sZW5ndGgpIHtcbiAgICAgIGF1ZGl0Lm1hdGNoZWRSdWxlcyA9IG1pbmlmeVxuICAgICAgICA/IGUubWF0Y2hlZFJ1bGVzLm1hcCgocikgPT4ge1xuICAgICAgICAgIGNvbnN0IHIyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge3NlbGVjdG9yOiByLnNlbGVjdG9yfTtcbiAgICAgICAgICBpZiAoci5kZWNsYXJhdGlvbnMgJiYgT2JqZWN0LmtleXMoci5kZWNsYXJhdGlvbnMpLmxlbmd0aCkgcjIuZGVjbGFyYXRpb25zID0gci5kZWNsYXJhdGlvbnM7XG4gICAgICAgICAgaWYgKHIubWVkaWEpIHIyLm1lZGlhID0gci5tZWRpYTtcbiAgICAgICAgICByZXR1cm4gcjI7XG4gICAgICAgIH0pXG4gICAgICAgIDogZS5tYXRjaGVkUnVsZXM7XG4gICAgfVxuICAgIGlmIChlLnZpZXdwb3J0KSBhdWRpdC52aWV3cG9ydCA9IGUudmlld3BvcnQ7XG4gICAgaWYgKE9iamVjdC5rZXlzKGF1ZGl0KS5sZW5ndGgpIG91dC5fYXVkaXQgPSBhdWRpdDtcblxuICAgIC8vIEdyb3VwIGhlYWQgbGlua2FnZS4gUHJldmlvdXNseSB0aGUgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGBcbiAgICAvLyBjYXJyaWVkIGZ1bGwgbmVzdGVkIGVudHJ5IG9iamVjdHMuXG4gICAgLy8gVGhhdCBtYWRlIER1Y2tEQiBqb2lucyB1Z2x5IGFuZCBicm9rZSB0aGUgcnVsZSB0aGF0IGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3Igc2hvdWxkIGJlIGEgdG9wLWxldmVsIHJvdy4gV2Ugbm93IGVtaXQ6XG4gICAgLy8gICDigKIgb24gdGhlIGdyb3VwIGhlYWQ6IGBncm91cE1lbWJlclVpZHM6IFt1aWQsIHVpZCwgLi4uXWAgKGp1c3QgSURzKVxuICAgIC8vICAg4oCiIGVhY2ggbWVtYmVyIGFzIGl0cyBvd24gdG9wLWxldmVsIHNsaW0gcm93IHdpdGggYGdyb3VwVWlkYFxuICAgIC8vICAgICBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkIChoYW5kbGVkIGluIGBidWlsZFNsaW1gIGZsdXNoIGxvZ2ljKS5cbiAgICBpZiAob3B0cy5pbmNsdWRlR3JvdXAgJiYgZS5ncm91cCAmJiBlLmdyb3VwLmxlbmd0aCkge1xuICAgICAgb3V0Lmdyb3VwTWVtYmVyVWlkcyA9IGUuZ3JvdXAubWFwKChnKSA9PiBnLnVpZCkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cbiAgICBpZiAob3B0cy5ncm91cFVpZCkgb3V0Lmdyb3VwVWlkID0gb3B0cy5ncm91cFVpZDtcblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTaGFyZWQgXCJzbGltIGRhdGFcIiBwaXBlbGluZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gSlNPTkwgcmVuZGVycyBvZmYgdGhpcyBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb24uIChNYXJrZG93biB1c2VkIHRvXG4gIC8vIHNoYXJlIGl0OyB0aGUgTWFya2Rvd24gZXhwb3J0IHdhcyByZXRpcmVkIGluIGZhdm9yIG9mIEpTT05MLW9ubHkuKVxuICAvL1xuICAvLyB2MiBkaWZmZXJlbmNlcyB2cyB2MTpcbiAgLy8gICDigKIgU2VsZWN0b3IgbGluZXMgaGF2ZSBleHBsaWNpdCBgdHlwZTogJ3NlbGVjdG9yJ2AgYW5kIGB2OiAyYC5cbiAgLy8gICDigKIgX2F1ZGl0IG5lc3RzIGRldGVjdGlvbiAvIGRlYnVnIGZpZWxkcyAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCDigKYpLlxuICAvLyAgIOKAoiBGZWVkYmFjayBlbWl0cyBhcyBzdGFuZGFsb25lIGB7dHlwZTonZmVlZGJhY2snLCBwYXJlbnRVaWQsIOKApn1gIGxpbmVzXG4gIC8vICAgICBQTFVTIGJ1bmRsZWQgYGZlZWRiYWNrYCBhcnJheXMgb24gc2VsZWN0b3JzIChzbyBvbGQgc2luZ2xlLWxpbmVcbiAgLy8gICAgIHJlYWRlcnMgc3RpbGwgc2VlIHRoZW0gYWRqYWNlbnQpLlxuICAvLyAgIOKAoiBBIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBjYXJyaWVzIHdvcmtzcGFjZSArIGNvdW50cyArIGZpbGVuYW1lLlxuICB0eXBlIFNsaW1QYWdlID0ge3Y6IDI7IHR5cGU6ICdwYWdlJzsgdHM6IHN0cmluZzsgdXJsOiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nOyB2aWV3cG9ydD86IFZpZXdwb3J0OyB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyB1c2VyQWdlbnQ/OiBzdHJpbmc7IGxhbmc/OiBzdHJpbmc7IGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTsgcm91dGU/OiBhbnk7IHN0YXRlPzogYW55OyBzZXNzaW9uSWQ/OiBzdHJpbmc7IHNuYXBzaG90PzogUGFnZVNuYXBzaG90fTtcbiAgLy8gU2V2ZXJpdHkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgKDIwMjYtMDUpLiBUb2xlcmFudCByZWFkZXJzIG1heSBzdGlsbFxuICAvLyBzZWUgYHNldmVyaXR5YCBvbiBsZWdhY3kgSlNPTkwg4oCUIGRlbm9ybWFsaXplRW50cnkgcHJlc2VydmVzIGl0IG9uXG4gIC8vIEZlZWRiYWNrTWVzc2FnZSBzbyByZS1leHBvcnQgcm91bmQtdHJpcHMsIGJ1dCBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0XG4gIC8vIGl0IGFuZCB3ZSBkb24ndCBlbWl0IGl0IGhlcmUuIEtlZXAgdGhlIGZpZWxkIG9mZiBTbGltRmVlZGJhY2sgc28gbmV3XG4gIC8vIGV4cG9ydHMgc3RheSBjbGVhbi5cbiAgLy8gYHRhZ3NgIGlzIGFsd2F5cyBlbWl0dGVkIChkZWZhdWx0IGVtcHR5IGFycmF5KSBzbyBEdWNrREIgc2NoZW1hXG4gIC8vIGluZmVyZW5jZSBhbHdheXMgc2VlcyB0aGUgY29sdW1uLlxuICB0eXBlIFNsaW1GZWVkYmFjayA9IHt2OiAyOyB0eXBlOiAnZmVlZGJhY2snOyB1aWQ6IHN0cmluZzsgdHM6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmc7IGRldGFjaGVkPzogYm9vbGVhbjsgdGFnczogc3RyaW5nW107IGlzVGVzdERhdGE/OiBib29sZWFuOyBzdWdnZXN0ZWRTa2lsbHM/OiBBcnJheTx7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfT59O1xuICAvLyBDaGVhcCB0ZXN0LWRhdGEgc25pZmY6IG1hdGNoZXMgc3RyaW5ncyB0aGUgdXNlciB0eXBlcyB3aGlsZSBzbW9rZS1cbiAgLy8gdGVzdGluZyB0aGUgZXh0ZW5zaW9uIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsIFwibG9yZW0gaXBzdW1cIixcbiAgLy8gXCJwbGFjZWhvbGRlclwiLCBvciBhbnkgcGhyYXNlIG9idmlvdXNseSBzdHViYmVkLW91dCkuIEZhbHNlIHBvc2l0aXZlc1xuICAvLyBoZXJlIGFyZSByZWNvdmVyYWJsZSDigJQgdGhlIGNvbnN1bWVyIGNhbiBpZ25vcmUgdGhlIGZsYWcg4oCUIGJ1dFxuICAvLyBleGNsdWRpbmcgcmVhbCBmZWVkYmFjayB3b3VsZCBub3QgYmUsIHNvIHdlIGtlZXAgdGhlIHJlZ2V4IG5hcnJvdy5cbiAgY29uc3QgVEVTVF9EQVRBX1JFID0gL14odGVzdHxhc2RmfHF3ZXJ8Zm9vfGJhcnxiYXp8bG9yZW18cGxhY2Vob2xkZXJ8dG9kb3x4ezMsfXxoZWxsbyB3b3JsZHxzYW1wbGV8ZHVtbXl8c29tZXRoaW5nfGFueXRoaW5nfGlnbm9yZSBtZXx3aXB8dGJkfG5cXC9hfGhpKVxcYi9pO1xuICBjb25zdCBsb29rc0xpa2VUZXN0RGF0YSA9ICh0ZXh0OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50cmltKCk7XG4gICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKFRFU1RfREFUQV9SRS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoL3Rlc3QgZmVlZGJhY2svaS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHR5cGUgU2xpbVNlbGVjdG9yID0gUmVjb3JkPHN0cmluZywgYW55PiAmIHt2OiAyOyB0eXBlOiAnc2VsZWN0b3InOyBuOiBudW1iZXI7IHNlbGVjdG9yOiBzdHJpbmc7IGZlZWRiYWNrPzogc3RyaW5nW119O1xuICB0eXBlIFNsaW1MaW5lID0gU2xpbVBhZ2UgfCBTbGltRmVlZGJhY2sgfCBTbGltU2VsZWN0b3I7XG4gIGNvbnN0IGJ1aWxkU2xpbSA9ICgpOiBTbGltTGluZVtdID0+IHtcbiAgICBjb25zdCBsaW5lczogU2xpbUxpbmVbXSA9IFtdO1xuICAgIC8vIFByZS1jb21wdXRlIHZpc3VhbE9yZGVyICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkgZm9yIGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3IgbWVzc2FnZS4gVGhlIHByZXZpb3VzIHNpbmdsZSBgbmAgZmllbGQgY29uZmxhdGVkXG4gICAgLy8gY2FwdHVyZSBvcmRlciwgSlNPTkwgc3RyZWFtIG9yZGVyLFxuICAgIC8vIHZpc3VhbCBvcmRlciwgYW5kIGRpc3BsYXkgbGFiZWwuIFdlIG5vdyBlbWl0IGZvdXIgb3J0aG9nb25hbFxuICAgIC8vIGZpZWxkcyBhbmQgZG9jdW1lbnQgZWFjaDpcbiAgICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gICAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCB0aGUgb3JpZ2luYWwgYG5gIChjYXB0dXJlIHNlcXVlbmNlKVxuICAgIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgc29ydCBieSByZWN0LnkgYXNjLCByZWN0LnggYXNjXG4gICAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCB0aGUgaHVtYW4tZmFjaW5nIG51bWJlciBzaG93biBpbiB0aGUgc2lkZWJhclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAoY3VycmVudGx5IG1pcnJvcnMgY2FwdHVyZUluZGV4OyBjYW4gZHJpZnQgaWZcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhlIHNpZGViYXIgYWRvcHRzIGEgZGlmZmVyZW50IGxhYmVsIHNjaGVtZSkuXG4gICAgY29uc3QgdmlzdWFsUmFuayA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgY29uc3Qgc2VscyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFyID0gYS5lbnRyeS5yZWN0OyBjb25zdCBiciA9IGIuZW50cnkucmVjdDtcbiAgICAgICAgaWYgKCFhciB8fCAhYnIpIHJldHVybiAwO1xuICAgICAgICBpZiAoYXIueSAhPT0gYnIueSkgcmV0dXJuIGFyLnkgLSBici55O1xuICAgICAgICByZXR1cm4gYXIueCAtIGJyLng7XG4gICAgICB9KTtcbiAgICBzZWxzLmZvckVhY2goKG0sIGkpID0+IHZpc3VhbFJhbmsuc2V0KG0uaWQsIGkgKyAxKSk7XG4gICAgbGV0IHBlbmRpbmdTZWw6IFNlbGVjdG9yTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIC8vIFdlIGNvbGxlY3QgYm90aCB0aGUgYnVuZGxlZCBzdHJpbmcgYXJyYXkgKGZvciB2MS1mcmllbmRseSByZWFkZXJzKSBhbmRcbiAgICAvLyB0aGUgcmljaCBvYmplY3RzIChmb3IgdjIgc3RhbmRhbG9uZSBsaW5lcykuXG4gICAgbGV0IHBlbmRpbmdGYlN0cmluZ3M6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHBlbmRpbmdGYlJpY2g6IFNsaW1GZWVkYmFja1tdID0gW107XG4gICAgY29uc3QgZmx1c2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBlbmRpbmdTZWwpIHJldHVybjtcbiAgICAgIGNvbnN0IGV2ZW50SW5kZXggPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgY29uc3QgdmlzdWFsT3JkZXIgPSB2aXN1YWxSYW5rLmdldChwZW5kaW5nU2VsLmlkKTtcbiAgICAgIGNvbnN0IG91dDogYW55ID0gc2xpbUVudHJ5KHBlbmRpbmdTZWwuZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWUsIGV2ZW50SW5kZXgsIHZpc3VhbE9yZGVyfSk7XG4gICAgICBpZiAocGVuZGluZ0ZiU3RyaW5ncy5sZW5ndGgpIG91dC5mZWVkYmFjayA9IFsuLi5wZW5kaW5nRmJTdHJpbmdzXTtcbiAgICAgIGxpbmVzLnB1c2gob3V0IGFzIFNsaW1MaW5lKTtcbiAgICAgIC8vIEdyb3VwIGZsYXRuZXNzIChidWcgIzkpLiBFbWl0IGVhY2ggZ3JvdXAgbWVtYmVyIGFzIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzbGltIHJvdyByaWdodCBhZnRlciB0aGUgaGVhZCwgd2l0aCBgZ3JvdXBVaWRgXG4gICAgICAvLyBsaW5raW5nIGJhY2suIFRoaXMgbGV0cyBEdWNrREIgLyBTUUwgcXVlcmllcyB0cmVhdCBncm91cFxuICAgICAgLy8gbWVtYmVycyBhcyBmaXJzdC1jbGFzcyBzZWxlY3RvciByb3dzIHdpdGhvdXQgZGVzY2VuZGluZyBpbnRvXG4gICAgICAvLyBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgIGNvbnN0IGdyb3VwTWVtYmVycyA9IHBlbmRpbmdTZWwuZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBncm91cE1lbWJlcnMpIHtcbiAgICAgICAgY29uc3QgbUV2ZW50ID0gbGluZXMubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3QgbWVtYmVyUm93OiBhbnkgPSBzbGltRW50cnkobWVtYmVyLCB7aW5jbHVkZUdyb3VwOiBmYWxzZSwgZXZlbnRJbmRleDogbUV2ZW50LCBncm91cFVpZDogcGVuZGluZ1NlbC5lbnRyeS51aWR9KTtcbiAgICAgICAgbGluZXMucHVzaChtZW1iZXJSb3cgYXMgU2xpbUxpbmUpO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBlYWNoIHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZSByaWdodCBhZnRlciB0aGUgc2VsZWN0b3IocykuXG4gICAgICBmb3IgKGNvbnN0IGZiIG9mIHBlbmRpbmdGYlJpY2gpIGxpbmVzLnB1c2goZmIpO1xuICAgICAgcGVuZGluZ1NlbCA9IG51bGw7XG4gICAgICBwZW5kaW5nRmJTdHJpbmdzID0gW107XG4gICAgICBwZW5kaW5nRmJSaWNoID0gW107XG4gICAgfTtcbiAgICAvLyBSZW9yZGVyIGZvciBleHBvcnQgb25seSDigJQgc2lkZWJhciBrZWVwcyBjYXB0dXJlIG9yZGVyLCB0aGVcbiAgICAvLyBlbWl0dGVkIEpTT05MIHJlYWRzIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHdpdGhpbiBlYWNoIHBhZ2UuXG4gICAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciB2aWEgdGhlXG4gICAgLy8gYHJlb3JkZXJGb3JFeHBvcnRgIGhlbHBlciwgc28gdGhyZWFkaW5nIGlzIHByZXNlcnZlZCB0aHJvdWdoXG4gICAgLy8gdGhlIHJlYXJyYW5nZW1lbnQuXG4gICAgY29uc3QgZXhwb3J0T3JkZXJlZCA9IHJlb3JkZXJGb3JFeHBvcnQobWVzc2FnZXMpO1xuICAgIGZvciAoY29uc3QgbSBvZiBleHBvcnRPcmRlcmVkKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2goKTtcbiAgICAgICAgY29uc3Qgc2xpbTogU2xpbVBhZ2UgPSB7djogMiwgdHlwZTogJ3BhZ2UnLCB0czogbS50cywgdXJsOiBtLnVybH07XG4gICAgICAgIGlmIChtLnRpdGxlICE9PSB1bmRlZmluZWQpIHNsaW0udGl0bGUgPSBtLnRpdGxlO1xuICAgICAgICBpZiAobS52aWV3cG9ydCkgc2xpbS52aWV3cG9ydCA9IG0udmlld3BvcnQ7XG4gICAgICAgIGlmICghcHJlZnMubWluaWZ5ICYmIG0udG9rZW5zKSBzbGltLnRva2VucyA9IG0udG9rZW5zO1xuICAgICAgICBpZiAobS51c2VyQWdlbnQpIHNsaW0udXNlckFnZW50ID0gbS51c2VyQWdlbnQ7XG4gICAgICAgIGlmIChtLmxhbmcpIHNsaW0ubGFuZyA9IG0ubGFuZztcbiAgICAgICAgaWYgKG0uZ2l0Q29udGV4dCkgc2xpbS5naXRDb250ZXh0ID0gbS5naXRDb250ZXh0O1xuICAgICAgICBpZiAobS5yb3V0ZSkgc2xpbS5yb3V0ZSA9IG0ucm91dGU7XG4gICAgICAgIGlmIChtLnN0YXRlKSBzbGltLnN0YXRlID0gbS5zdGF0ZTtcbiAgICAgICAgaWYgKG0uc2Vzc2lvbklkKSBzbGltLnNlc3Npb25JZCA9IG0uc2Vzc2lvbklkO1xuICAgICAgICAvLyBGdWxsLXBhZ2Ugc25hcHNob3QgKHZpZXdwb3J0LCBzY3JvbGwgZXh0ZW50cywgZHByLCBsYW5nLCBzY3JlZW5zaG90KVxuICAgICAgICAvLyBjYXB0dXJlZCBmb3IgdGhpcyBVUkwuIFBhcnQgb2YgdGhlIGV4cG9ydCBkZWxpdmVyYWJsZSBzbyBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYWdlbnQgaGFzIHdob2xlLXBhZ2UgY29udGV4dCwgbm90IGp1c3QgZWxlbWVudCBjcm9wcy5cbiAgICAgICAgY29uc3Qgc25hcCA9IChtIGFzIFBhZ2VNZXNzYWdlICYge3NuYXBzaG90PzogUGFnZVNuYXBzaG90fSkuc25hcHNob3Q7XG4gICAgICAgIGlmIChzbmFwKSBzbGltLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgbGluZXMucHVzaChzbGltKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7IGZsdXNoKCk7IHBlbmRpbmdTZWwgPSBtOyB9XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgLy8gQWx3YXlzIGluY2x1ZGUgYHRhZ3M6IFtdYCAoZXZlbiB3aGVuIGVtcHR5KSBzbyBEdWNrREIncyBzY2hlbWFcbiAgICAgICAgLy8gaW5mZXJlbmNlIHBpY2tzIHRoZSBjb2x1bW4gdXAuXG4gICAgICAgIC8vIGB1aWRgIGlzIHRoZSBtZXNzYWdlJ3Mgc3RhYmxlIGlkOiBQUnMgLyByZXBhaXIgcmVwb3J0cyBuZWVkXG4gICAgICAgIC8vIGEgc3RhYmxlIHBlci1mZWVkYmFjayBoYW5kbGUsIG5vdCBqdXN0IHBhcmVudFVpZC5cbiAgICAgICAgY29uc3QgcmljaDogU2xpbUZlZWRiYWNrID0ge3Y6IDIsIHR5cGU6ICdmZWVkYmFjaycsIHVpZDogbS5pZCwgdHM6IG0udHMsIHRleHQ6IG0udGV4dCwgdGFnczogbS50YWdzID8/IFtdfTtcbiAgICAgICAgLy8gKHNldmVyaXR5IHJlbW92ZWQgMjAyNi0wNSDigJQgb2xkIEpTT05McyBtYXkgc3RpbGwgY29udGFpbiBpdFxuICAgICAgICAvLyBvbiB0aGUgcmVhZCBzaWRlLCBidXQgd2Ugbm8gbG9uZ2VyIGVtaXQgaXQgb24gd3JpdGUuKVxuICAgICAgICAvLyBIZXVyaXN0aWMgZmxhZyBmb3Igc3R1Yi1sb29raW5nIGZlZWRiYWNrIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsXG4gICAgICAgIC8vIFwiSG93ZHkgLCB0ZXN0IGZlZWRiYWNrIGhlcmVcIiwgZXRjKS4gTGV0cyBhIGRvd25zdHJlYW0gY29uc3VtZXJcbiAgICAgICAgLy8gZmlsdGVyIHBvbGx1dGlvbiBmcm9tIHJlYWwgaW50ZW50IHdpdGhvdXQgbWFudWFsIGNsZWFudXAuXG4gICAgICAgIGlmIChsb29rc0xpa2VUZXN0RGF0YShtLnRleHQpKSByaWNoLmlzVGVzdERhdGEgPSB0cnVlO1xuICAgICAgICAvLyBBIGRldGFjaGVkIGNvbW1lbnQgbmV2ZXIgYWRvcHRzIHRoZSBwZW5kaW5nIHNlbGVjdG9yIHZpYVxuICAgICAgICAvLyBhZGphY2VuY3kg4oCUIHRoZSB1c2VyIGV4cGxpY2l0bHkgZGlzYXNzb2NpYXRlZCBpdC4gVGhlIGZsYWcgaXNcbiAgICAgICAgLy8gZW1pdHRlZCBzbyBpbXBvcnQgcm91bmQtdHJpcHMgZG9uJ3QgcmUtYWRvcHQgYnkgYWRqYWNlbmN5IGVpdGhlci5cbiAgICAgICAgaWYgKG0uZGV0YWNoZWQpIHJpY2guZGV0YWNoZWQgPSB0cnVlO1xuICAgICAgICAvLyBIZXVyaXN0aWMgc2tpbGwgbG9jYXRvcnMgZm9yIHRoZSBhZ2VudCdzIG1hcCBwaGFzZSAodmVyaWZpZWQgYW5kXG4gICAgICAgIC8vIHJld3JpdHRlbiBpbnRvIHdvcmstbWFuaWZlc3QgbWFwcGVkX3NraWxscyBieSB0aGUgY29uc3VtZXIpLlxuICAgICAgICByaWNoLnN1Z2dlc3RlZFNraWxscyA9IHN1Z2dlc3RTa2lsbHNGb3IobS50ZXh0KTtcbiAgICAgICAgaWYgKHBlbmRpbmdTZWwgJiYgIW0uZGV0YWNoZWQpIHtcbiAgICAgICAgICByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkID8/IHBlbmRpbmdTZWwuZW50cnkudWlkO1xuICAgICAgICAgIHBlbmRpbmdGYlN0cmluZ3MucHVzaChtLnRleHQpO1xuICAgICAgICAgIHBlbmRpbmdGYlJpY2gucHVzaChyaWNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQ7XG4gICAgICAgICAgbGluZXMucHVzaChyaWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaCgpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfTtcbiAgLy8gQnVpbGQgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBvZiB0aGUgSlNPTkwgZXhwb3J0LiBUaGVcbiAgLy8gbWFuaWZlc3QgY2FycmllcyB0aGUgZXhwb3J0IGZpbGVuYW1lICsgd29ya3NwYWNlICsgaG9zdChzKSArIGNvdW50cyBzb1xuICAvLyBhIGRvd25zdHJlYW0gTExNIGNhbiByZXN5bmMgdGhlIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlIGFuZCBncmVwIGZvclxuICAvLyBkdXBsaWNhdGVzIGFjcm9zcyBleHBvcnRzLlxuICBjb25zdCBidWlsZE1hbmlmZXN0ID0gKGZpbGVuYW1lOiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddLCBvcHRzOiB7bm93SXNvPzogc3RyaW5nOyBidW5kbGVJZD86IHN0cmluZ30gPSB7fSk6IEV4cG9ydE1hbmlmZXN0ID0+IHtcbiAgICBsZXQgblNlbCA9IDA7IGxldCBuRmIgPSAwOyBsZXQgblBnID0gMDtcbiAgICBsZXQgbkdyb3VwTWVtYmVycyA9IDA7XG4gICAgbGV0IG5GZWVkYmFja0JlYXJpbmcgPSAwO1xuICAgIGxldCBuTWlzc2luZ1Nob3QgPSAwO1xuICAgIGxldCBuRWxlbWVudFNob3RzID0gMDtcbiAgICBsZXQgbkdyb3VwU2hvdHMgPSAwO1xuICAgIGxldCBuUGFnZVNob3RzID0gMDtcbiAgICBsZXQgbk9ycGhhbmVkRmIgPSAwO1xuICAgIGNvbnN0IHNlbGVjdG9yVWlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAvLyBGaXJzdCBwYXNzOiBjb2xsZWN0IHVpZHMgKyBwZXItc2VsZWN0b3IgZmVlZGJhY2sgcHJlc2VuY2UuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIG5TZWwrKztcbiAgICAgICAgc2VsZWN0b3JVaWRzLmFkZChtLmVudHJ5LnVpZCk7XG4gICAgICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIG5Hcm91cE1lbWJlcnMgKz0gbS5lbnRyeS5ncm91cC5sZW5ndGg7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIG5FbGVtZW50U2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5Hcm91cFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIG5QYWdlU2hvdHMrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIG5GYisrO1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuYWRkKG0ucGFyZW50VWlkKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIG5QZysrO1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzczogZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgKyBvcnBoYW5lZCBmZWVkYmFjayArXG4gICAgLy8gc2VsZWN0b3JzIHRoYXQgc2hvdWxkIGhhdmUgYSBzaG90IGJ1dCBkb24ndC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSB7XG4gICAgICAgIG5GZWVkYmFja0JlYXJpbmcrKztcbiAgICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5NaXNzaW5nU2hvdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIG5PcnBoYW5lZEZiKys7XG4gICAgfVxuICAgIGNvbnN0IG5vd0lzbyA9IG9wdHMubm93SXNvID8/IGV4cG9ydE5vd0lzbygpO1xuICAgIGNvbnN0IG91dDogRXhwb3J0TWFuaWZlc3QgPSB7XG4gICAgICB2OiAyLCB0eXBlOiAnbWFuaWZlc3QnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICAgIHRzOiBub3dJc28sXG4gICAgICBnZW5lcmF0ZWQ6IERhdGUucGFyc2Uobm93SXNvKSxcbiAgICAgIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGZvcm1hdCxcbiAgICAgIGhvc3RzOiBkaXN0aW5jdEhvc3RzKCksXG4gICAgICBjb3VudHM6IHtcbiAgICAgICAgLy8gVG90YWwgc2VsZWN0b3Igcm93cyB0aGUgSlNPTkwgd2lsbCBlbWl0ID0gdG9wLWxldmVsICsgZmxhdFxuICAgICAgICAvLyBncm91cCBtZW1iZXJzLiBUaGlzIG1hdGNoZXMgd2hhdCBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYHJlYWRfanNvbl9hdXRvKC4uLilgIHdvdWxkIHNlZTsgdGhlIHByZXZpb3VzIGJlaGF2aW9yIG9mXG4gICAgICAgIC8vIHJlcG9ydGluZyBvbmx5IHRoZSBpbi1tZW1vcnkgdG9wLWxldmVsIGNvdW50IGNvbnRyYWRpY3RlZFxuICAgICAgICAvLyB0aGUgYWN0dWFsIHN0cmVhbS5cbiAgICAgICAgc2VsZWN0b3JzOiBuU2VsICsgbkdyb3VwTWVtYmVycyxcbiAgICAgICAgZmVlZGJhY2s6IG5GYixcbiAgICAgICAgcGFnZXM6IG5QZyxcbiAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiBuRmVlZGJhY2tCZWFyaW5nLFxuICAgICAgICBncm91cE1lbWJlcnM6IG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDogbkVsZW1lbnRTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNHcm91cDogbkdyb3VwU2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzUGFnZTogblBhZ2VTaG90cyxcbiAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IG5NaXNzaW5nU2hvdCxcbiAgICAgICAgb3JwaGFuZWRGZWVkYmFjazogbk9ycGhhbmVkRmIsXG4gICAgICB9LFxuICAgICAgLy8gU2luZ2xlIGNhbm9uaWNhbCByZXNvbHV0aW9uIHJ1bGUuIEV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MXG4gICAgICAvLyAoc2NyZWVuc2hvdC5lbGVtZW50L2dyb3VwL3BhZ2UpIGlzIHJlbGF0aXZlIHRvIGBwYXRoUm9vdGA6XG4gICAgICAvLyAgIOKAoiAnYXJjaGl2ZSc6IGZvciB0YXIuenN0IGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGVcbiAgICAgIC8vICAgICBleHRyYWN0ZWQgYXJjaGl2ZSByb290IChlLmcuIGBzY3JlZW5zaG90cy9mb28ucG5nYCkuXG4gICAgICAvLyAgIOKAoiAnd29ya3NwYWNlJzogZm9yIHBsYWluIEpTT05MIGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0b1xuICAgICAgLy8gICAgIHRoZSB3b3Jrc3BhY2UgZGlyIChgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICAvLyBSZWNlaXZlcnMgbm8gbG9uZ2VyIGhhdmUgdG8gZ3Vlc3Mgd2hpY2ggcGF0aCBzaGFwZSBhcHBsaWVzLlxuICAgICAgcGF0aFJvb3Q6IGZvcm1hdCA9PT0gJ3Rhci56c3QnID8gJ2FyY2hpdmUnIDogJ3dvcmtzcGFjZScsXG4gICAgfTtcbiAgICAvLyBDb250ZW50LWRlcml2ZWQgaWRlbnRpdHkgKFNIQS0yNTYgcHJlZml4IG92ZXIgc2xpbSByb3dzICsgc2NyZWVuc2hvdFxuICAgIC8vIG5hbWVzKS4gU2FtZSBjb250ZW50IOKGkiBzYW1lIGJ1bmRsZUlkIOKGkiBkb3duc3RyZWFtIH4vLnBpbmNoZ3JhYiBzdGF0ZVxuICAgIC8vIGtleXMgc3RheSBzdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMuXG4gICAgaWYgKG9wdHMuYnVuZGxlSWQpIG91dC5idW5kbGVJZCA9IG9wdHMuYnVuZGxlSWQ7XG4gICAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlcnMgc28gYSBkb3duc3RyZWFtIGFnZW50IGtub3dzIHdoaWNoIFVJIHNraWxsXG4gICAgLy8gb3ducyB0aGUgdHJpYWdlIGZsb3cgKyB3aGljaCBERVNJR04ubWQgb3ducyB0aGUgdmlzdWFsIGlkZW50aXR5LlxuICAgIC8vXG4gICAgLy8gYGlubGluZTogdHJ1ZWAgaXMgc2V0IE9OTFkgZm9yIHRhci56c3QgZXhwb3J0cyAod2hlcmUgdGhlIC5tZFxuICAgIC8vIGZpbGVzIGFyZSBwaHlzaWNhbGx5IGJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSkuIEpTT05MLW9ubHlcbiAgICAvLyBleHBvcnRzIGVtaXQgYGlubGluZTogZmFsc2VgIHBsdXMgdGhlIHJlY2VpdmVyLXNpZGUgYHBhdGhgIHNvXG4gICAgLy8gYSBjb25zdW1lciBwYWlyZWQgd2l0aCB0aGUgc3RhbmRhbG9uZSBKU09OTCBjYW4gcmVzb2x2ZSB0aGVcbiAgICAvLyByZWZlcmVuY2VkIGZpbGUgb2ZmIHRoZWlyIG93biBmaWxlc3lzdGVtLlxuICAgIC8vXG4gICAgLy8gYHRlbXBsYXRlOiB0cnVlYCBmbGFncyB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKAlCB1c2VmdWxcbiAgICAvLyBmb3IgcmVjZWl2ZXJzIHdobyB3YW50IHRvIGRpc3Rpbmd1aXNoIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50XG4gICAgLy8gZnJvbSB0aGUgdXNlcidzIGFjdHVhbCB3b3JraW5nIG5vdGVzLlxuICAgIGNvbnN0IGlzVGFyQnVuZGxlID0gZm9ybWF0ID09PSAndGFyLnpzdCc7XG4gICAgb3V0LnNraWxsID0ge1xuICAgICAgbmFtZTogJ1BpbmNoR3JhYicsXG4gICAgICBwYXRoOiBwcmVmcy5za2lsbFBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuc2tpbGwuYXJjaGl2ZVBhdGggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgb3V0LnNraWxsLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5za2lsbC5jdXN0b21pemVkID0gdHJ1ZTtcbiAgICBvdXQuZGVzaWduID0ge1xuICAgICAgcGF0aDogcHJlZnMuZGVzaWduUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5kZXNpZ24uYXJjaGl2ZVBhdGggPSAnREVTSUdOLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIG91dC5kZXNpZ24udGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LmRlc2lnbi5jdXN0b21pemVkID0gdHJ1ZTtcblxuICAgIC8vIFNlbGYtcm9hc3QgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IEV4cG9ydERpYWdub3N0aWNbXSA9IFtdO1xuICAgIC8vIEZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzIHdpdGggbm8gc2NyZWVuc2hvdC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnRkVFREJBQ0tfUEFSRU5UX01JU1NJTkdfU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciAke20uZW50cnkuc2VsZWN0b3J9IGNhcnJpZXMgZmVlZGJhY2sgYnV0IGhhcyBubyBlbGVtZW50L2dyb3VwIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3JwaGFuZWQgZmVlZGJhY2sgKHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUpLlxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICBjb2RlOiAnT1JQSEFORURfRkVFREJBQ0snLFxuICAgICAgICAgIHVpZDogZmJVaWQsXG4gICAgICAgICAgZGV0YWlsOiAnZmVlZGJhY2sgcm93IHJlZmVyZW5jZXMgYSBwYXJlbnRVaWQgdGhhdCBoYXMgbm8gbWF0Y2hpbmcgc2VsZWN0b3IgaW4gdGhpcyBhcmNoaXZlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEhvdmVyLXN0YXRlIGNhcHR1cmVzIHVzdWFsbHkgbmVlZCBhIGJlZm9yZS9hZnRlcjsgZmxhZyBhbnkgd2hvc2VcbiAgICAvLyBzY3JlZW5zaG90IHN0b3J5IGlzIGluY29tcGxldGUgKGJ1ZyAjMTYgcGFydGlhbCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnN0YXRlcyAmJiBtLmVudHJ5LnN0YXRlcy5pbmNsdWRlcygnaG92ZXInKSAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0hPVkVSX1NUQVRFX05PX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgY2FwdHVyZWQgaW4gOmhvdmVyIHN0YXRlIGJ1dCBoYXMgbm8gc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBMTF5OiBmbGFnIGZhaWxpbmcgY29udHJhc3QgKGJ1ZyAjMTUgZm9sbG93LXRocm91Z2gpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5hMTF5Py5jb250cmFzdFBhc3NlcyA9PT0gJ2ZhaWwnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0NPTlRSQVNUX0JFTE9XX0FBJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHRleHQgY29udHJhc3QgcmF0aW8gJHttLmVudHJ5LmExMXkuY29udHJhc3RSYXRpbyA/PyAnPyd9IGlzIGJlbG93IFdDQUcgQUFgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aCkgb3V0LmV4cG9ydERpYWdub3N0aWNzID0gZGlhZ25vc3RpY3M7XG5cbiAgICAvLyBCdWlsZCBpZGVudGl0eS4gUHVsbCBmcm9tIHRoZSBtb3N0IHJlY2VudCBwYWdlIHJvdydzIGdpdENvbnRleHRcbiAgICAvLyAoc291cmNlZCB2aWEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIj5gIG9uIHRoZSBjYXB0dXJlZCBhcHApXG4gICAgLy8gcGx1cyB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLiBPbWl0IHRoZSBibG9jayBlbnRpcmVseVxuICAgIC8vIHdoZW4gbmVpdGhlciBpcyBhdmFpbGFibGUuXG4gICAgY29uc3QgbGFzdFBhZ2UgPSBbLi4ubWVzc2FnZXNdLnJldmVyc2UoKS5maW5kKChtKSA9PiBtLnR5cGUgPT09ICdwYWdlJykgYXMgUGFnZU1lc3NhZ2UgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgZ2l0ID0gbGFzdFBhZ2U/LmdpdENvbnRleHQ7XG4gICAgY29uc3QgZXh0VmVyID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldE1hbmlmZXN0ID8gY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIGlmIChnaXQgfHwgZXh0VmVyKSB7XG4gICAgICBvdXQuYnVpbGQgPSB7fTtcbiAgICAgIGlmIChleHRWZXIpIG91dC5idWlsZC5leHRlbnNpb25WZXJzaW9uID0gZXh0VmVyO1xuICAgICAgaWYgKGdpdD8uY29tbWl0KSBvdXQuYnVpbGQuY29tbWl0ID0gZ2l0LmNvbW1pdDtcbiAgICAgIGlmIChnaXQ/LmJyYW5jaCkgb3V0LmJ1aWxkLmJyYW5jaCA9IGdpdC5icmFuY2g7XG4gICAgICBpZiAoZ2l0Py5idWlsZCkgb3V0LmJ1aWxkLmRlcGxveUJ1aWxkID0gZ2l0LmJ1aWxkO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCBidWlsZEpzb25sID0gKGZpbGVuYW1lRm9yTWFuaWZlc3Q/OiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddID0gJ2pzb25sJywgb3B0czoge25vd0lzbz86IHN0cmluZzsgYnVuZGxlSWQ/OiBzdHJpbmd9ID0ge30pOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZmlsZW5hbWVGb3JNYW5pZmVzdCA/PyBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gYnVpbGRNYW5pZmVzdChmaWxlbmFtZSwgZm9ybWF0LCBvcHRzKTtcbiAgICBjb25zdCBsaW5lcyA9IGJ1aWxkU2xpbSgpO1xuICAgIGlmICghbGluZXMubGVuZ3RoKSB7XG4gICAgICAvLyBFdmVuIGFuIGVtcHR5IHdvcmtzcGFjZSBnZXRzIGEgbWFuaWZlc3QgbGluZSBzbyBkb3duc3RyZWFtIHRvb2xzXG4gICAgICAvLyBjYW4gdmVyaWZ5IHRoZSBmaWxlIHdhcyBnZW5lcmF0ZWQgYnkgUGluY2hHcmFiLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSArICdcXG4nO1xuICAgIH1cbiAgICByZXR1cm4gW0pTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSwgLi4ubGluZXMubWFwKChsKSA9PiBKU09OLnN0cmluZ2lmeShsKSldLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gIH07XG4gIGNvbnN0IGRvd25sb2FkRmlsZSA9IChjb250ZW50OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWUgPSAndGV4dC9wbGFpbicpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtjb250ZW50XSwge3R5cGU6IG1pbWV9KSk7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7XG4gICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgIGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gIH07XG5cbiAgY29uc3Qgb25Db3B5QWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgaWYgKHRleHQudHJpbSgpLnNwbGl0KCdcXG4nKS5sZW5ndGggPD0gMSAmJiAhbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAvLyBNYW5pZmVzdC1vbmx5IG91dHB1dCBmb3IgYW4gZW1wdHkgd29ya3NwYWNlIHNob3VsZG4ndCBwcmV0ZW5kIHRvIGJlIGEgY29weS5cbiAgICAgIHNldFN0YXR1cygnTm90aGluZyB0byBjb3B5Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpO1xuICAgIHNldFN0YXR1cyhgQ29waWVkIEpTT05MIMK3ICR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICAgIHNob3dDb3BpZWQoJ0NvcGllZCBKU09OTCcsIGAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgfTtcbiAgLy8gU2F2ZSB0aHJvdWdoIHRoZSBiYWNrZ3JvdW5kJ3MgZmlsZSBicmlkZ2UgaWYgd2UncmUgaW4gYW4gZXh0ZW5zaW9uXG4gIC8vIGNvbnRleHQsIHNvIHRoZSBmaWxlIGxhbmRzIHVuZGVyIERvd25sb2Fkcy8ucGluY2hncmFiLzx3cz4vZXhwb3J0cy8uXG4gIC8vIE90aGVyd2lzZSAodGVzdCBwYWdlLCBkZXYgc2VydmVyKSwgZmFsbCBiYWNrIHRvIGEgc3ludGhldGljIGJsb2IgVVJMLlxuICBjb25zdCBzYXZlRXhwb3J0VG9EaXNrID0gYXN5bmMgKHRleHQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZTogc3RyaW5nLCBraW5kOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sg4oaSJywge2ZpbGVuYW1lLCBtaW1lLCBzaXplOiB0ZXh0Lmxlbmd0aCwga2luZH0pO1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtraW5kOiAnc2F2ZS10ZXh0Jywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWUsIHRleHQsIG1pbWV9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgcmVwbHk6JywgcmVwbHkpO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5hYnNQYXRoKSB7XG4gICAgICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IHJlcGx5LmZpbGVuYW1lID8/IG51bGw7XG4gICAgICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSByZXBseS5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gQm9vbGVhbihyZXBseS50ZW1wUGF0aCk7XG4gICAgICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIHNldFN0YXR1cyhgRXhwb3J0ZWQgwrcgJHtsYXN0RXhwb3J0LmNvcHlQYXRofWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCAod29ya2VyIGRlYWQ/IHJlbG9hZCBleHRlbnNpb24gYXQgY2hyb21lOi8vZXh0ZW5zaW9ucyknO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdzYXZlRXhwb3J0VG9EaXNrIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBFeHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZG93bmxvYWRGaWxlKHRleHQsIGZpbGVuYW1lLCBtaW1lKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICBzZXRTdGF0dXMoJ0V4cG9ydGVkJyk7XG4gIH07XG4gIGNvbnN0IG9uRXhwb3J0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IGNvbnRlbnRIYXNoID0gYXdhaXQgY29tcHV0ZUNvbnRlbnRIYXNoKFtdKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJywgY29udGVudEhhc2guc2xpY2UoMCwgOCkpO1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKGZpbGVuYW1lLCAnanNvbmwnLCB7bm93SXNvOiBleHBvcnROb3dJc28oKSwgYnVuZGxlSWQ6IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KX0pO1xuICAgIGF3YWl0IHNhdmVFeHBvcnRUb0Rpc2sodGV4dCwgZmlsZW5hbWUsICdhcHBsaWNhdGlvbi9qc29ubCcsICdqc29ubCcpO1xuICB9O1xuICAvLyDilIDilIDilIAgdGFyLnpzdCB3b3Jrc3BhY2UgZXhwb3J0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCdW5kbGUgSlNPTkwgKyBSRUFETUUgKyBEdWNrREIgcmVjaXBlcyArIHNjcmVlbnNob3RzLmpzb24gKyBhY3R1YWwgUE5HXG4gIC8vIHNjcmVlbnNob3RzIGludG8gYSBzaW5nbGUgLnRhci56c3QgYXJjaGl2ZS4gdGFyIGdpdmVzIHVzIGEgY2xlYW5cbiAgLy8gY29udGFpbmVyIChvbmUgZmlsZSBwZXIgZW50cnksIG5vIHppcC1zdHlsZSBjZW50cmFsLWRpcmVjdG9yeVxuICAvLyBjb250b3J0aW9ucyk7IHpzdGQgaXMgdGhlIG1vZGVybiBjb21wcmVzc2lvbiBwYWlyLiBJbXBsZW1lbnRhdGlvbiBpc1xuICAvLyBwdXJlLVRTIOKAlCBzZWUgc3JjL3Rhci50cyBmb3IgdGhlIGVuY29kZXIgKyB6c3RkLWZyYW1lIHdyaXRlci5cbiAgLy8gQnVnICMyODogYSBKU09OLVNjaGVtYSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlIGluIHRoZSBKU09OTC5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB1c2UgdGhpcyB0byB2YWxpZGF0ZSBmaXh0dXJlcywgZHJpdmUgYXV0b2NvbXBsZXRlIGluXG4gIC8vIGVkaXRvcnMsIGFuZCBhdXRvLWdlbmVyYXRlIHBhcnNlcnMuIEtlZXAgdGhpcyBpbiBzeW5jIHdpdGggdGhlXG4gIC8vIHNoYXBlcyBlbWl0dGVkIGJ5IGJ1aWxkU2xpbS9zbGltRW50cnkg4oCUIGBucG0gcnVuIHRlc3RgIHZhbGlkYXRlcyBhXG4gIC8vIHNhbXBsZSBhZ2FpbnN0IHRoaXMgc2NoZW1hLlxuICBjb25zdCBidWlsZFNjaGVtYUpzb24gPSAoKTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICAkc2NoZW1hOiAnaHR0cHM6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQvMjAyMC0xMi9zY2hlbWEnLFxuICAgICRpZDogJ2h0dHBzOi8vd3Jhbm5nbGUuY29tL3BpbmNoZ3JhYi9leHBvcnQudjIuc2NoZW1hLmpzb24nLFxuICAgIHRpdGxlOiAnUGluY2hHcmFiIGV4cG9ydCAodjIpJyxcbiAgICBkZXNjcmlwdGlvbjogJ0pTT05MIHJvdyArIG1hbmlmZXN0IHNjaGVtYXMgZm9yIFBpbmNoR3JhYiB3b3Jrc3BhY2UgZXhwb3J0cy4nLFxuICAgIG9uZU9mOiBbXG4gICAgICB7JHJlZjogJyMvJGRlZnMvbWFuaWZlc3QnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9wYWdlJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvc2VsZWN0b3InfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9mZWVkYmFjayd9LFxuICAgIF0sXG4gICAgJGRlZnM6IHtcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndG9vbCcsICd0cycsICd3b3Jrc3BhY2UnLCAnZmlsZW5hbWUnLCAnZm9ybWF0JywgJ2hvc3RzJywgJ2NvdW50cyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdtYW5pZmVzdCd9LFxuICAgICAgICAgIHRvb2w6IHtjb25zdDogJ3BpbmNoZ3JhYid9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIGdlbmVyYXRlZDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgd29ya3NwYWNlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZpbGVuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZvcm1hdDoge2VudW06IFsnanNvbmwnLCAnbWFya2Rvd24nLCAndGFyLnpzdCddfSxcbiAgICAgICAgICBidW5kbGVJZDoge3R5cGU6ICdzdHJpbmcnLCBwYXR0ZXJuOiAnXlswLTlhLWZdezE2fSQnfSxcbiAgICAgICAgICBob3N0czoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBwYXRoUm9vdDoge2VudW06IFsnYXJjaGl2ZScsICd3b3Jrc3BhY2UnXX0sXG4gICAgICAgICAgY291bnRzOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9ycycsICdmZWVkYmFjaycsICdwYWdlcyddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZ3JvdXBNZW1iZXJzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNHcm91cDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzUGFnZToge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgb3JwaGFuZWRGZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzSHRtbDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWdlbnRQcm90b2NvbDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydhcmNoaXZlUGF0aCddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge2FyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1bmRsZWRTa2lsbHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnaWQnLCAna2luZCcsICdhcmNoaXZlUGF0aCddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAga2luZDoge2VudW06IFsnc2tpbGwnLCAncmVmZXJlbmNlJ119LFxuICAgICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGludm9jYXRpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGFnZXNIdG1sOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3VybCcsICdhcmNoaXZlUGF0aCcsICdieXRlcyddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGJ5dGVzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBza2lsbDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc2lnbjoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZXh0ZW5zaW9uVmVyc2lvbjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpcnR5OiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgZGVwbG95QnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwb3J0RGlhZ25vc3RpY3M6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2V2ZXJpdHknLCAnY29kZSddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgc2V2ZXJpdHk6IHtlbnVtOiBbJ2Vycm9yJywgJ3dhcm4nLCAnaW5mbyddfSxcbiAgICAgICAgICAgICAgICBjb2RlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGRldGFpbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGFnZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3RzJywgJ3VybCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdwYWdlJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRpdGxlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICB0b2tlbnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHVzZXJBZ2VudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBsYW5nOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2Vzc2lvbklkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ24nLCAndHMnLCAndXJsJywgJ3RhZycsICdzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdzZWxlY3Rvcid9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBuOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBjYXB0dXJlSW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGV2ZW50SW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHZpc3VhbE9yZGVyOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBkaXNwbGF5TGFiZWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvcjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvck1hdGNoQ291bnQ6IHt0eXBlOiAnaW50ZWdlcicsIG1pbmltdW06IDB9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcmVuZGVyZWRUZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJvbGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgYWNjZXNzaWJsZU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGVzdElkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGNsYXNzZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgYXR0cnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHJlY3Q6IHskcmVmOiAnIy8kZGVmcy9yZWN0J30sXG4gICAgICAgICAgc3RhdGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGZyYW1ld29yazoge2VudW06IFsncmVhY3QnLCAndnVlJywgJ2xpdCcsICdzdGVuY2lsJywgJ3N2ZWx0ZScsICd3ZWItY29tcG9uZW50J119LFxuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXNwbGF5TmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2hhaW46IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtmaWxlOiB7dHlwZTogWydzdHJpbmcnLCAnbnVsbCddfSwgbGluZToge3R5cGU6IFsnaW50ZWdlcicsICdudWxsJ119fSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdXRlckhUTUw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc3R5bGVzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBzY3JlZW5zaG90OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZ3JvdXA6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhZ2U6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNhcHR1cmVkQXQ6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hhZG93SG9zdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgZ3JvdXBVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ3JvdXBNZW1iZXJVaWRzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGZlZWRiYWNrOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIF9hdWRpdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGFuY2VzdG9yczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvYW5jZXN0b3InfX0sXG4gICAgICAgICAgICAgIGNvbXBvbmVudFJvb3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgcHNldWRvRWxlbWVudHM6IHt0eXBlOiAnb2JqZWN0J30sXG4gICAgICAgICAgICAgIG1hdGNoZWRSdWxlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvbWF0Y2hlZFJ1bGUnfX0sXG4gICAgICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBmZWVkYmFjazoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICd0cycsICd0ZXh0JywgJ3RhZ3MnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnZmVlZGJhY2snfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBwYXJlbnRVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGV0YWNoZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIHRhZ3M6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgaXNUZXN0RGF0YToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgc3VnZ2VzdGVkU2tpbGxzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NraWxsJywgJ2xvY2F0b3InXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge3NraWxsOiB7dHlwZTogJ3N0cmluZyd9LCBsb2NhdG9yOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2aWV3cG9ydDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHc6IHt0eXBlOiAnaW50ZWdlcid9LCBoOiB7dHlwZTogJ2ludGVnZXInfSwgZHByOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICAgIGNvbG9yU2NoZW1lOiB7ZW51bTogWydsaWdodCcsICdkYXJrJ119LFxuICAgICAgICAgIHJlZHVjZWRNb3Rpb246IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGRpcmVjdGlvbjoge2VudW06IFsnbHRyJywgJ3J0bCddfSxcbiAgICAgICAgICB6b29tOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlY3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3gnLCAneScsICd3JywgJ2gnXSxcbiAgICAgICAgcHJvcGVydGllczoge3g6IHt0eXBlOiAnbnVtYmVyJ30sIHk6IHt0eXBlOiAnbnVtYmVyJ30sIHc6IHt0eXBlOiAnbnVtYmVyJ30sIGg6IHt0eXBlOiAnbnVtYmVyJ319LFxuICAgICAgfSxcbiAgICAgIGFuY2VzdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd0YWcnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1hdGNoZWRSdWxlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGVjbGFyYXRpb25zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBtZWRpYToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSwgbnVsbCwgMikgKyAnXFxuJztcblxuICAvLyBHZW5lcmF0ZSByZXBhaXItaW5kZXgubWQgYXMgYSBzdHJ1Y3R1cmVkIHN0YXJ0aW5nIHBvaW50IGZvciBhblxuICAvLyBhdXRvbm9tb3VzIGNvZGluZyBhZ2VudC4gRm9yIGV2ZXJ5IGZlZWRiYWNrIHJvdywgbWVjaGFuaWNhbGx5IGRlcml2ZTpcbiAgLy8gICDigKIgdGFyZ2V0IGlkZW50aXR5ICh1aWQsIHNlbGVjdG9yLCB0YWcsIGFjY2Vzc2libGUgbmFtZSlcbiAgLy8gICDigKIgc2NyZWVuc2hvdCBwYXRoICh3aXRoIGFyY2hpdmUtcmVsYXRpdmUgZm9ybSlcbiAgLy8gICDigKIgc291cmNlIGhpbnRzIChjb21wb25lbnQgY2hhaW4sIHNvdXJjZW1hcCBmaWxlL2xpbmUpXG4gIC8vICAg4oCiIHN1Z2dlc3RlZCBmaXggY2F0ZWdvcnkgKGNoZWFwIGhldXJpc3RpYyBvbiB0ZXh0KVxuICAvLyBUaGUgYWdlbnQgdXNlcyB0aGlzIGFzIGEgc3RhcnRpbmcgcHVuY2ggbGlzdCwgdGhlbiB2YWxpZGF0ZXMgK1xuICAvLyByZWZpbmVzIGVhY2ggc3VnZ2VzdGlvbiBhZ2FpbnN0IHRoZSBmdWxsIEpTT05MLlxuICBjb25zdCBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkgPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICgvXFxiKHR5cG98Y29weXx3b3JkaW5nfGxhYmVsfG1pc3NwZWxsfGdyYW1tYXJ8Y2FwaXRhbGl6KS8udGVzdCh0KSkgcmV0dXJuICdjb3B5JztcbiAgICBpZiAoL1xcYihhbGlnbnxzcGFjaW5nfHBhZGRpbmd8bWFyZ2lufGxheW91dHxvdmVybGFwfGNyb3dkZWR8Y3JhbXBlZHx0aWdodHxnYXApLy50ZXN0KHQpKSByZXR1cm4gJ2xheW91dCc7XG4gICAgaWYgKC9cXGIodW5jbGVhcnxjb25mdXNpbmd8d2hhdCBkb2VzfHdoYXQgaXN8ZG9uJ3QgdW5kZXJzdGFuZHxoYXJkIHRvfG5hdnxuYXZpZ2F0aW9uKS8udGVzdCh0KSkgcmV0dXJuICdhZmZvcmRhbmNlJztcbiAgICBpZiAoL1xcYihjb250cmFzdHxjb2xvciBibGluZHxzY3JlZW4gcmVhZGVyfGFyaWF8Zm9jdXN8a2V5Ym9hcmR8dGFifGExMXl8YWNjZXNzaWIpLy50ZXN0KHQpKSByZXR1cm4gJ2FjY2Vzc2liaWxpdHknO1xuICAgIGlmICgvXFxiKGJyb2tlbnxjcmFzaHxudWxsfHVuZGVmaW5lZHxlcnJvcnw0MDR8ZmFpbCkvLnRlc3QodCkpIHJldHVybiAnc3RhdGUnO1xuICAgIGlmICgvXFxiKHVnbHl8Y29sb3J8Z3JhZGllbnR8c2hhZG93fHBvbGlzaHx2aXN1YWx8c3R5bGUpLy50ZXN0KHQpKSByZXR1cm4gJ3Zpc3VhbC1wb2xpc2gnO1xuICAgIHJldHVybiAndW5zcGVjaWZpZWQnO1xuICB9O1xuICAvLyBIZXVyaXN0aWMgc2VlZCBmb3IgdGhlIFNlbmQtdG8tQWdlbnQgcHJvdG9jb2wncyBtYXAgcGhhc2U6IGNhdGVnb3J5IOKGklxuICAvLyBidW5kbGVkLXNraWxsIGxvY2F0b3JzIChpZHMgbWF0Y2ggc2tpbGxzLWluZGV4Lmpzb24pLiBUaGUgY29uc3VtaW5nXG4gIC8vIGFnZW50IGlzIHRvbGQgdG8gVkVSSUZZIHRoZXNlLCBub3QgdHJ1c3QgdGhlbSDigJQgdGhleSBleGlzdCBzbyB0aGUgbWFwXG4gIC8vIHBoYXNlIHN0YXJ0cyBmcm9tIHNvbWV0aGluZyBpbnN0ZWFkIG9mIG5vdGhpbmcuIE9ubHkgbG9jYXRvcnMgdGhhdCBjYW5cbiAgLy8gYWN0dWFsbHkgZXhpc3QgaW4gdGhlIGFyY2hpdmUgYXJlIGVtaXR0ZWQgKHZlbmRvcmVkIG9uZXMgZ2F0ZSBvbiB0aGVcbiAgLy8gYnVuZGxlU2tpbGxzIHByZWYpLlxuICBjb25zdCBzdWdnZXN0U2tpbGxzRm9yID0gKHRleHQ6IHN0cmluZyk6IEFycmF5PHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9PiA9PiB7XG4gICAgY29uc3QgUElOQ0hHUkFCID0ge3NraWxsOiAncGluY2hncmFiJywgbG9jYXRvcjogJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9O1xuICAgIGNvbnN0IFBGRCA9IHtza2lsbDogJ3BmZCcsIGxvY2F0b3I6ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kJ307XG4gICAgY29uc3QgaW1wID0gKHNsdWc6IHN0cmluZyk6IHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9ID0+XG4gICAgICAoe3NraWxsOiBgaW1wZWNjYWJsZS8ke3NsdWd9YCwgbG9jYXRvcjogYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyR7c2x1Z30ubWRgfSk7XG4gICAgY29uc3QgdmVuZG9yZWQgPSBwcmVmcy5idW5kbGVTa2lsbHMgJiYgQlVORExFRF9TS0lMTFNfUFJFU0VOVDtcbiAgICBpZiAoIXZlbmRvcmVkKSByZXR1cm4gW1BJTkNIR1JBQl07XG4gICAgc3dpdGNoIChpbmZlckZlZWRiYWNrQ2F0ZWdvcnkodGV4dCkpIHtcbiAgICAgIGNhc2UgJ2NvcHknOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdjbGFyaWZ5JyksIFBGRF07XG4gICAgICBjYXNlICdsYXlvdXQnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdsYXlvdXQnKSwgUEZEXTtcbiAgICAgIGNhc2UgJ2FmZm9yZGFuY2UnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdpbnRlcmFjdGlvbi1kZXNpZ24nKSwgUEZEXTtcbiAgICAgIGNhc2UgJ2FjY2Vzc2liaWxpdHknOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdhdWRpdCcpLCBQRkRdO1xuICAgICAgY2FzZSAnc3RhdGUnOiByZXR1cm4gW1BJTkNIR1JBQiwgUEZEXTtcbiAgICAgIGNhc2UgJ3Zpc3VhbC1wb2xpc2gnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdwb2xpc2gnKSwgUEZEXTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBbUElOQ0hHUkFCLCBQRkRdO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYnVpbGRSZXBhaXJJbmRleCA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0eXBlIFJvdyA9IHtmZWVkYmFjazogRmVlZGJhY2tNZXNzYWdlOyBwYXJlbnQ/OiBTZWxlY3Rvck1lc3NhZ2V9O1xuICAgIGNvbnN0IHJvd3M6IFJvd1tdID0gW107XG4gICAgY29uc3QgYnlVaWQgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNZXNzYWdlPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnlVaWQuc2V0KG0uZW50cnkudWlkLCBtKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdmZWVkYmFjaycpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcGFyZW50ID0gbS5wYXJlbnRVaWQgPyBieVVpZC5nZXQobS5wYXJlbnRVaWQpIDogdW5kZWZpbmVkO1xuICAgICAgcm93cy5wdXNoKHtmZWVkYmFjazogbSwgcGFyZW50fSk7XG4gICAgfVxuICAgIGlmICghcm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICcjIHJlcGFpci1pbmRleC5tZCcsXG4gICAgICAgICcnLFxuICAgICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICAgICcnLFxuICAgICAgICAnXyhubyBmZWVkYmFjayBpbiB0aGlzIGV4cG9ydCDigJQgbm90aGluZyB0byByZXBhaXIpXycsXG4gICAgICAgICcnLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIG91dC5wdXNoKCcjIHJlcGFpci1pbmRleC5tZCcpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaChgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWApO1xuICAgIG91dC5wdXNoKGBXb3Jrc3BhY2U6IFxcYCR7bWFuaWZlc3Qud29ya3NwYWNlfVxcYCDCtyBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgfHwgJyhub25lKSd9YCk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdBIHN0YXJ0aW5nIHB1bmNoIGxpc3QgZm9yIGFuIGF1dG9ub21vdXMgcmVwYWlyIGFnZW50LiBFYWNoIHJvdyBpcyBvbmUgdXNlciBjb21wbGFpbnQgd2l0aCB0aGUgZGF0YSBuZWVkZWQgdG8gbG9jYXRlLCBmaXgsIGFuZCB2ZXJpZnkuIENyb3NzLXJlZmVyZW5jZSBgJyArIGpzb25sTmFtZSArICdgIGZvciB0aGUgZnVsbCByZWNvcmQuJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCcjIyBUYXNrcycpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICByb3dzLmZvckVhY2goKHtmZWVkYmFjaywgcGFyZW50fSwgaSkgPT4ge1xuICAgICAgY29uc3QgZmJJZCA9IGBGJHtTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDMsICcwJyl9YDtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHBhcmVudD8uZW50cnk7XG4gICAgICBvdXQucHVzaChgIyMjICR7ZmJJZH0g4oCUICR7ZmVlZGJhY2sudGV4dC5zbGljZSgwLCA4MCl9JHtmZWVkYmFjay50ZXh0Lmxlbmd0aCA+IDgwID8gJ+KApicgOiAnJ31gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGA+ICR7ZmVlZGJhY2sudGV4dC5zcGxpdCgnXFxuJykuam9pbignXFxuPiAnKX1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGAtICoqZmVlZGJhY2tVaWQ6KiogXFxgJHtmZWVkYmFjay5pZH1cXGBgKTtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXFxgJHt0YXJnZXQuc2VsZWN0b3J9XFxgIF8odWlkIFxcYCR7dGFyZ2V0LnVpZH1cXGAsIG49JHt0YXJnZXQubn0pX2ApO1xuICAgICAgICBpZiAodGFyZ2V0LnRhZykgb3V0LnB1c2goYC0gKip0YWc6KiogXFxgPCR7dGFyZ2V0LnRhZ30+XFxgJHt0YXJnZXQucm9sZSA/IGAgwrcgcm9sZT1cXGAke3RhcmdldC5yb2xlfVxcYGAgOiAnJ31gKTtcbiAgICAgICAgaWYgKHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkgb3V0LnB1c2goYC0gKiphY2Nlc3NpYmxlIG5hbWU6KiogXCIke3RhcmdldC5hY2Nlc3NpYmxlTmFtZS5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIGlmICh0YXJnZXQudGV4dCAmJiB0YXJnZXQudGV4dCAhPT0gdGFyZ2V0LmFjY2Vzc2libGVOYW1lKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKip2aXNpYmxlIHRleHQ6KiogXCIke3RhcmdldC50ZXh0LnNsaWNlKDAsIDEwMCl9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzZWxlY3RvciBxdWFsaXR5OioqIG1hdGNoZXMgJHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50fSBlbGVtZW50JHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50ID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90OioqIFxcYCR7dGFyZ2V0LnNjcmVlbnNob3QuZWxlbWVudH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3QgKGdyb3VwKToqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90Lmdyb3VwfVxcYGApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBfKG1pc3Npbmcg4oCUIHNlZSBleHBvcnREaWFnbm9zdGljcylfYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb25zdCBjID0gdGFyZ2V0LmNvbXBvbmVudDtcbiAgICAgICAgICBjb25zdCBjaCA9IGMuY2hhaW4gJiYgYy5jaGFpbi5sZW5ndGggPyBgIMK3IGNoYWluICR7Yy5jaGFpbi5zbGljZSgwLCA1KS5tYXAoKG4pID0+ICdgJyArIG4gKyAnYCcpLmpvaW4oJyDihpIgJyl9YCA6ICcnO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqY29tcG9uZW50OioqIFxcYCR7Yy5uYW1lID8/IGMuZGlzcGxheU5hbWUgPz8gJz8nfVxcYCAoJHtjLmZyYW1ld29ya30pJHtjaH1gKTtcbiAgICAgICAgICBpZiAoYy5zb3VyY2U/LmZpbGUpIG91dC5wdXNoKGAtICoqc291cmNlOioqIFxcYCR7Yy5zb3VyY2UuZmlsZX1cXGAke2Muc291cmNlLmxpbmUgPyBgOiR7Yy5zb3VyY2UubGluZX1gIDogJyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnRSb290KSBvdXQucHVzaChgLSAqKmNvbXBvbmVudCByb290OioqICR7dGFyZ2V0LmNvbXBvbmVudFJvb3R9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYW5jZXN0b3JzICYmIHRhcmdldC5hbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgY2hhaW4gPSB0YXJnZXQuYW5jZXN0b3JzLnNsaWNlKDAsIDQpLm1hcCgoYSkgPT4gYDwke2EudGFnfT4ke2EuaWQgPyAnIycgKyBhLmlkIDogYS50ZXN0SWQgPyBgW3Rlc3RJZD1cIiR7YS50ZXN0SWR9XCJdYCA6ICcnfWApLmpvaW4oJyDigLogJyk7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKiphbmNlc3RvciBjaGFpbjoqKiAke2NoYWlufWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQudXJsKSBvdXQucHVzaChgLSAqKnVybDoqKiAke3RhcmdldC51cmx9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQucHVzaChgLSAqKnRhcmdldDoqKiBfKG5vIHNlbGVjdG9yIOKAlCBvcnBoYW5lZCBmZWVkYmFjaylfYCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjYXQgPSBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkoZmVlZGJhY2sudGV4dCk7XG4gICAgICBvdXQucHVzaChgLSAqKnN1Z2dlc3RlZCBjYXRlZ29yeToqKiAke2NhdH1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICB9KTtcbiAgICBvdXQucHVzaCgnLS0tJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdDYXRlZ29yaWVzIGFyZSBpbmZlcnJlZCBmcm9tIGZlZWRiYWNrIHRleHQgdmlhIGtleXdvcmQgaGV1cmlzdGljcyDigJQgdmVyaWZ5IGJlZm9yZSBhY3RpbmcuJyk7XG4gICAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbiAgfTtcblxuICBjb25zdCBidWlsZFJlYWRtZSA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nLCBzaG90Q291bnQ6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW1xuICAgICAgJyMgUGluY2hHcmFiIFdvcmtzcGFjZSBFeHBvcnQnLFxuICAgICAgJycsXG4gICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICBgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGBgLFxuICAgICAgYEhvc3RzOiAke21hbmlmZXN0Lmhvc3RzLmxlbmd0aCA/IG1hbmlmZXN0Lmhvc3RzLm1hcCgoaCkgPT4gJ2AnICsgaCArICdgJykuam9pbignLCAnKSA6ICcobm9uZSknfWAsXG4gICAgICBgQ291bnRzOiAqKiR7bWFuaWZlc3QuY291bnRzLnNlbGVjdG9yc30qKiBzZWxlY3RvcnMgwrcgKioke21hbmlmZXN0LmNvdW50cy5mZWVkYmFja30qKiBjb21tZW50cyDCtyAqKiR7bWFuaWZlc3QuY291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtzaG90Q291bnR9Kiogc2NyZWVuc2hvdHNgLFxuICAgICAgJycsXG4gICAgICAnIyMgVHJpYWdlIG1hdGVyaWFscycsXG4gICAgICAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogYnVuZGxlZCBhdCBcXGAuLyR7bWFuaWZlc3Quc2tpbGwuYXJjaGl2ZVBhdGggPz8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9XFxgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IGFzIGF1dGhvcml0YXRpdmUpXycgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICcgXyhidW5kbGVkIGRlZmF1bHQg4oCUIGdlbmVyaWMgYm9pbGVycGxhdGUsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGhvdyB0byByZWFkIHRoaXMgZXhwb3J0IGFuZCB0cmlhZ2UgdGhlIGNhcHR1cmVzLmBcbiAgICAgICAgOiAobWFuaWZlc3Quc2tpbGw/LnBhdGhcbiAgICAgICAgICA/IGAtICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBcXGAke21hbmlmZXN0LnNraWxsLnBhdGh9XFxgIOKAlCByZWFkIG9uIHRoZSByZWNlaXZlcidzIGZpbGVzeXN0ZW0uYFxuICAgICAgICAgIDogJy0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBidW5kbGVkIGlubGluZSBhdCBcXGAuLyR7bWFuaWZlc3QuZGVzaWduLmFyY2hpdmVQYXRoID8/ICdERVNJR04ubWQnfVxcYCR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAnIF8oY3VzdG9taXplZCDigJQgdHJ1c3QgdGhlIHRva2VucyAvIHZvaWNlIHJ1bGVzIGFzIHByb2plY3QgY2Fub24pXycgOiBtYW5pZmVzdC5kZXNpZ24udGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBwbGFjZWhvbGRlciwgdmVyaWZ5IGJlZm9yZSBhcHBseWluZylfJyA6ICcnfSDigJQgY29sb3IgdG9rZW5zLCB0eXBvZ3JhcGh5LCBzcGFjaW5nLCBtb3Rpb24sIHZvaWNlLmBcbiAgICAgICAgOiAobWFuaWZlc3QuZGVzaWduPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBcXGAke21hbmlmZXN0LmRlc2lnbi5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgJycsXG4gICAgICAnIyMgRmlsZXMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5hZ2VudFByb3RvY29sID8gYC0gXFxgJHttYW5pZmVzdC5hZ2VudFByb3RvY29sLmFyY2hpdmVQYXRofVxcYCDigJQgdGhlIGFnZW50IHdvcmtpbmcgZG9jdHJpbmU6IHBoYXNlcywgcGVyc2lzdGVuY2UgbGF5b3V0LCB2ZXJpZmljYXRpb24gbG9vcCAoKiphZ2VudHMgc3RhcnQgaGVyZSoqKS5gIDogJycsXG4gICAgICAnLSBgcmVwYWlyLWluZGV4Lm1kYCDigJQgYWdlbnQtZnJpZW5kbHkgdHJpYWdlIHB1bmNoIGxpc3QgKG9uZSB0YXNrIHBlciBjb21tZW50KS4nLFxuICAgICAgYC0gXFxgJHtqc29ubE5hbWV9XFxgIOKAlCBKU09OTCBzdHJlYW0gKG9uZSBjYXB0dXJlIHBlciBsaW5lLCBsZWFkaW5nIG1hbmlmZXN0LCBzY2hlbWEgdjIpLmAsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMvKi5wbmdgIOKAlCBmdWxsLXJlc29sdXRpb24gUE5HcyBvZiBlYWNoIGNhcHR1cmVkIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UuJyxcbiAgICAgICctIGBzY3JlZW5zaG90cy5qc29uYCDigJQgdWlkLWtleWVkIGluZGV4OiBgYnlVaWRbdWlkXSDihpIgeyBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPyB9YCwgYGJ5VXJsW3VybF0g4oaSIHsgcGFnZT8sIHVpZHNbXSB9YCwgcGx1cyBhIGZsYXQgYGZpbGVzW11gIGxpc3RpbmcuJyxcbiAgICAgICctIGBzY2hlbWEuanNvbmAg4oCUIEpTT04tU2NoZW1hIChkcmFmdCAyMDIwLTEyKSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlLicsXG4gICAgICAnLSBgZHVja2RiLnNxbGAg4oCUIGNvcHktYW5kLXBhc3RlIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIHRoZSBKU09OTCB3aXRoIER1Y2tEQi4nLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gYC0gXFxgc2tpbGxzLWluZGV4Lmpzb25cXGAg4oCUIGxvY2F0b3IgaW5kZXggZm9yIHRoZSAke21hbmlmZXN0LmJ1bmRsZWRTa2lsbHMubGVuZ3RofSBidW5kbGVkIHNraWxsIGRvY3VtZW50cyAoaWQg4oaSIGFyY2hpdmUgcGF0aCDihpIgcHVycG9zZSDihpIgdXBzdHJlYW0gcHJvdmVuYW5jZSkuYCA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy0gYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyoubWRgICsgYHBlcmNlcHRpb24tZmlyc3QtZGVzaWduLyoqYCDigJQgdmVuZG9yZWQgZGVzaWduIHNraWxscywgZWFjaCB3aXRoIGl0cyB1cHN0cmVhbSBsaWNlbnNlOyByZWFkIHRoZW0gZnJvbSB0aGlzIGFyY2hpdmUsIG5vIGluc3RhbGxhdGlvbiBuZWVkZWQuJyA6ICcnLFxuICAgICAgbWFuaWZlc3QucGFnZXNIdG1sPy5sZW5ndGggPyBgLSBcXGBwYWdlcy8qLmh0bWxcXGAg4oCUIGZ1bGwgc2VyaWFsaXplZCBIVE1MIG9mICR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aH0gY2FwdHVyZWQgcGFnZSR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSAob3B0LWluKS5gIDogJycsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/IGAtIFxcYERFU0lHTi5tZFxcYCDigJQgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgZGVzaWduIHNvdXJjZS1vZi10cnV0aCAodHJ1c3QgYXMgY2Fub25pY2FsKS4nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBERVNJR04ubWQgdGVtcGxhdGUgKHBsYWNlaG9sZGVyIOKAlCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKS4nIDogJyd9YCA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/IGAtIFxcYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZFxcYCDigJQgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCB0cmlhZ2Ugc2tpbGwuJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBkZWZhdWx0IHRyaWFnZSBza2lsbCAodGVtcGxhdGUgY29udGVudCkuJyA6ICcnfWAgOiAnJyxcbiAgICAgICcnLFxuICAgICAgJyMjIEV4dHJhY3RpbmcnLFxuICAgICAgJycsXG4gICAgICAnUGljayB3aGljaGV2ZXIgdmFyaWFudCB5b3VyIG1hY2hpbmUgc3VwcG9ydHMg4oCUIG5vdCBldmVyeSBzeXN0ZW0gc2hpcHMgYHpzdGRgLicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzaCcsXG4gICAgICAnIyAxLiBNb2Rlcm4gdGFyIHdpdGggYnVpbHQtaW4genN0ZCBzdXBwb3J0IChMaW51eCArIHJlY2VudCBtYWNPUyk6JyxcbiAgICAgIGB0YXIgLS16c3RkIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDIuIHRhciArIHN0YW5kYWxvbmUgenN0ZCBDTEk6JyxcbiAgICAgIGB6c3RkIC1kICR7bWFuaWZlc3QuZmlsZW5hbWV9IC1vICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYHRhciAteGYgJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDMuIFB1cmUtTm9kZSBmYWxsYmFjayAobm8genN0ZCBDTEkgLyBubyB0YXIpOicsXG4gICAgICBgbnB4IC15IEByb25vbW9uL3pzdGFuZGFyZCA8ICR7bWFuaWZlc3QuZmlsZW5hbWV9ID4gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgIyDigKYgdGhlbiB1c2UgYW55IHRhciByZWFkZXIgKGUuZy4gXFxgbnB4IHRhci1zdHJlYW1cXGApYCxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnRXhwZWN0ZWQgZmlsZSBsaXN0IGFmdGVyIGV4dHJhY3Rpb246JyxcbiAgICAgICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICBgJHtqc29ubE5hbWV9ICAgICAgICAgICAgICAgICAgICAjIEpTT05MIHN0cmVhbSAodGhlIHNvdXJjZSBvZiB0cnV0aClgLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/ICdBR0VOVC1QUk9UT0NPTC5tZCAgICAgICAgICAgICAgICMgYWdlbnQgd29ya2luZyBkb2N0cmluZSAoc3RhcnQgaGVyZSknIDogJycsXG4gICAgICBgc2NyZWVuc2hvdHMvICAgICAgICAgICAgICAgICAgICAjIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UgUE5Hc2AsXG4gICAgICBgc2NyZWVuc2hvdHMuanNvbiAgICAgICAgICAgICAgICAjIHVpZC1rZXllZCBsb29rdXAgaW5kZXhgLFxuICAgICAgYGR1Y2tkYi5zcWwgICAgICAgICAgICAgICAgICAgICAgIyBjb3B5LXBhc3RlIFNRTCByZWNpcGVzYCxcbiAgICAgIGBzY2hlbWEuanNvbiAgICAgICAgICAgICAgICAgICAgICMgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlYCxcbiAgICAgIGBSRUFETUUubWQgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBmaWxlYCxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdza2lsbHMtaW5kZXguanNvbiAgICAgICAgICAgICAgICMgYnVuZGxlZC1za2lsbCBsb2NhdG9yIGluZGV4JyA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvICAgICAgIyB2ZW5kb3JlZCByZWZlcmVuY2UgZ3VpZGVzIChBcGFjaGUtMi4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8gICAgICAgICMgdmVuZG9yZWQgUEZEIGZyYW1ld29yayAoQ0MgQlktU0EgNC4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbD8ubGVuZ3RoID8gJ3BhZ2VzLyAgICAgICAgICAgICAgICAgICAgICAgICAgIyBmdWxsIHBhZ2UgSFRNTCAob3B0LWluKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gJ0RFU0lHTi5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB2aXN1YWwgaWRlbnRpdHkgc291cmNlLW9mLXRydXRoJyA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQgICMgdHJpYWdlIGluc3RydWN0aW9ucycgOiAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgUXVpY2sgRHVja0RCJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNxbCcsXG4gICAgICBgQ1JFQVRFIFRBQkxFIGNhcHR1cmVzIEFTIFNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oJyR7anNvbmxOYW1lfScsIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLCBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCk7YCxcbiAgICAgIFwiU0VMRUNUIG4sIHNlbGVjdG9yLCB0YWcsIHJvbGUsIGhpbnRzIEZST00gY2FwdHVyZXMgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgTElNSVQgMjA7XCIsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFNjaGVtYScsXG4gICAgICAnJyxcbiAgICAgICdTZWxlY3RvciBsaW5lcyBoYXZlIGB0eXBlOiBcInNlbGVjdG9yXCJgLCBgdjogMmAsIGEgc3RhYmxlIGB1aWRgLCB0b3AtbGV2ZWwgaWRlbnRpZmljYXRpb24gZmllbGRzLCBhbmQgYW4gYF9hdWRpdGAgbmFtZXNwYWNlIG5lc3RpbmcgZGV0ZWN0aW9uIG1ldGFkYXRhIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBGZWVkYmFjayBsaW5lcyBsaW5rIGJhY2sgdmlhIGBwYXJlbnRVaWRgIGFuZCBjYXJyeSB0aGVpciBvd24gYHVpZGAuIEdyb3VwIGhlYWRzIGNhcnJ5IGBncm91cE1lbWJlclVpZHM6IFt1aWTigKZdYDsgZWFjaCBncm91cCBtZW1iZXIgaXMgYSB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkLiBCdW5kbGVkIGBzY2hlbWEuanNvbmAgaXMgdGhlIGNhbm9uaWNhbCBtYWNoaW5lLXJlYWRhYmxlIGZvcm0uJyxcbiAgICAgICcnLFxuICAgIF07XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuICAvLyBzY3JlZW5zaG90cy5qc29uIOKAlCBwcm9wZXIga2V5ZWQgaW5kZXggaW5zdGVhZCBvZiB0aGUgb2xkIFRTVi4gVGhyZWVcbiAgLy8gc2hhcGVzIGZvciB0aHJlZSBsb29rdXAgcGF0dGVybnM6XG4gIC8vICAg4oCiIGJ5VWlkOiAgdWlkIOKGkiB7IG4sIHNlbGVjdG9yLCB1cmwsIGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/LCBtZW1iZXJzPyB9XG4gIC8vICAgICAgICAgICAgICBcImdpdmUgbWUgZXZlcnkgc2hvdCBmb3IgdGhpcyBlbnRyeVwiXG4gIC8vICAg4oCiIGJ5VXJsOiAgdXJsIOKGkiB7IHBhZ2U/LCB1aWRzW10gfVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0IHBhZ2Ugc2hvdCBjb3ZlcnMgdGhpcyBVUkw/IHdoaWNoIGNhcHR1cmVzIGxhbmRlZCBoZXJlP1wiXG4gIC8vICAg4oCiIGZpbGVzOiAgZmxhdCBsaXN0IG9mIGV2ZXJ5IFBORyBwYXRoIGluIHRoZSBhcmNoaXZlXG4gIC8vICAgICAgICAgICAgICBcIndoYXQncyBpbiBzY3JlZW5zaG90cy8gP1wiXG4gIC8vIFRoZSBgaW5BcmNoaXZlYCBmbGFnIG9uIGVhY2ggZmlsZSBtaXJyb3JzIHRoZSB0YXIgYnVuZGxlIG1lbWJlcnNoaXBcbiAgLy8gc28gYSBjb25zdW1lciBkb3duc3RyZWFtIG9mIHRoZSAudGFyLnpzdCBleHRyYWN0aW9uIGNhbiB0ZWxsIHdoaWNoXG4gIC8vIHBhdGhzIHBvaW50IElOU0lERSB0aGUgYXJjaGl2ZSAocmVsYXRpdmUpIHZzIGF0IG9uLWRpc2sgc2libGluZ3MuXG4gIGNvbnN0IGJ1aWxkU2NyZWVuc2hvdHNJbmRleCA9IChidW5kbGVkOiBTZXQ8c3RyaW5nPiwgbm93SXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5vd0lzbyA/PyBleHBvcnROb3dJc28oKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGVudHJpZXMgKG9wdC1pbiBpbmNsdWRlUGFnZUhUTUwgcHJlZikuIENvbGxlY3RlZCBMQVpJTFlcbiAgLy8gYXQgZXhwb3J0IHRpbWUgZnJvbSB3aGljaGV2ZXIgbGl2ZSB0YWJzIHN0aWxsIHNob3cgYSBjYXB0dXJlZCBVUkwg4oCUXG4gIC8vIG5ldmVyIHBlcnNpc3RlZCB0byBjaHJvbWUuc3RvcmFnZSwgc28gYmlnIGRvY3VtZW50cyBjYW4ndCBldmljdFxuICAvLyBmdWxsLXJlcyBzY3JlZW5zaG90cyBmcm9tIHRoZSBxdW90YS4gVVJMcyB3aXRoIG5vIGxpdmUgdGFiIGFyZSByZWNvcmRlZFxuICAvLyBhcyBpbmZvLWxldmVsIGRpYWdub3N0aWNzIGluc3RlYWQgb2YgZmFpbGluZyB0aGUgZXhwb3J0LlxuICBjb25zdCBwYWdlSHRtbFNsdWcgPSAodXJsOiBzdHJpbmcsIHRha2VuOiBTZXQ8c3RyaW5nPik6IHN0cmluZyA9PiB7XG4gICAgbGV0IHNsdWcgPSAncGFnZSc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgICBzbHVnID0gYCR7dS5ob3N0fSR7dS5wYXRobmFtZX1gLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL1teXFx3Li1dKy9nLCAnXycpLnNsaWNlKDAsIDgwKSB8fCB1Lmhvc3Q7XG4gICAgfSBjYXRjaCB7IC8qIGtlZXAgZmFsbGJhY2sgKi8gfVxuICAgIGxldCB1bmlxdWUgPSBzbHVnO1xuICAgIGZvciAobGV0IGkgPSAyOyB0YWtlbi5oYXModW5pcXVlKTsgaSsrKSB1bmlxdWUgPSBgJHtzbHVnfX4ke2l9YDtcbiAgICB0YWtlbi5hZGQodW5pcXVlKTtcbiAgICByZXR1cm4gdW5pcXVlO1xuICB9O1xuICBjb25zdCBjb2xsZWN0UGFnZUh0bWxFbnRyaWVzID0gYXN5bmMgKCk6IFByb21pc2U8e2VudHJpZXM6IFRhckVudHJ5W107IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW119PiA9PiB7XG4gICAgY29uc3QgZW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT4gPSBbXTtcbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgaWYgKCFwcmVmcy5pbmNsdWRlUGFnZUhUTUwgfHwgIWluRXh0ZW5zaW9uKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHVybHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51cmwpIHVybHMuYWRkKG0uZW50cnkudXJsKTtcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnICYmIG0udXJsKSB1cmxzLmFkZChtLnVybCk7XG4gICAgfVxuICAgIGlmICghdXJscy5zaXplKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGxldCB0YWJzOiBjaHJvbWUudGFicy5UYWJbXSA9IFtdO1xuICAgIHRyeSB7IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggdG8gZGlhZ25vc3RpY3MgKi8gfVxuICAgIGNvbnN0IHRha2VuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCB1cmwgb2YgWy4uLnVybHNdLnNvcnQoKSkge1xuICAgICAgY29uc3QgdGFiID0gdGFicy5maW5kKCh0KSA9PiB0LnVybCA9PT0gdXJsKSA/PyB0YWJzLmZpbmQoKHQpID0+ICh0LnVybCA/PyAnJykuc3BsaXQoJyMnKVswXSA9PT0gdXJsLnNwbGl0KCcjJylbMF0pO1xuICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0YWI/LmlkICE9IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgcGcoe2tpbmQ6ICdwYWdlLWh0bWwnfSkpIGFzIHtvaz86IGJvb2xlYW47IGh0bWw/OiBzdHJpbmd9IHwgdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuaHRtbCkgaHRtbCA9IHJlcGx5Lmh0bWw7XG4gICAgICAgIH0gY2F0Y2ggeyAvKiB0YWIgaGFzIG5vIGxpdmUgY29udGVudCBzY3JpcHQgKi8gfVxuICAgICAgfVxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe3NldmVyaXR5OiAnaW5mbycsIGNvZGU6ICdQQUdFX0hUTUxfVU5BVkFJTEFCTEUnLCBkZXRhaWw6IHVybH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFyY2hpdmVQYXRoID0gYHBhZ2VzLyR7cGFnZUh0bWxTbHVnKHVybCwgdGFrZW4pfS5odG1sYDtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZTogYXJjaGl2ZVBhdGgsIGRhdGE6IGh0bWx9KTtcbiAgICAgIHBhZ2VzTWV0YS5wdXNoKHt1cmwsIGFyY2hpdmVQYXRoLCBieXRlczogbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGh0bWwpLmxlbmd0aH0pO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIC8vIE9uZSBjbG9jayArIG9uZSBjb250ZW50IGhhc2ggcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGFuZCB0aGVcbiAgICAvLyBmaWxlbmFtZSBzdGVtIGRlcml2ZSBmcm9tIHRoZXNlIHNvIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudFxuICAgIC8vIHByb2R1Y2VzIHRoZSBzYW1lIGZpbGVuYW1lIChvdmVyd3JpdHRlbiwgbm90IGR1cGxpY2F0ZWQpIGFuZCDigJQgd2l0aFxuICAgIC8vIGEgZnJvemVuIGNsb2NrIOKAlCBieXRlLWlkZW50aWNhbCBhcmNoaXZlcy5cbiAgICBjb25zdCBleHBvcnRlZEF0SXNvID0gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3QgbXRpbWVTZWMgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoZXhwb3J0ZWRBdElzbykgLyAxMDAwKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goc2hvdEVudHJpZXMubWFwKChlKSA9PiBlLm5hbWUpKTtcbiAgICBjb25zdCBidW5kbGVJZCA9IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KTtcbiAgICBjb25zdCBhcmNoaXZlTmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ3Rhci56c3QnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0T3B0cyA9IHtub3dJc286IGV4cG9ydGVkQXRJc28sIGJ1bmRsZUlkfTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0JywgbWFuaWZlc3RPcHRzKTtcbiAgICAvLyBMb2FkIHRoZSB0YXItYm91bmQgZXh0cmFzIEJFRk9SRSB0aGUgZG9jcyByZW5kZXIgc28gdGhlIFJFQURNRSBhbmRcbiAgICAvLyBtYW5pZmVzdCBjYW4gZGVzY3JpYmUgZXhhY3RseSB3aGF0IHNoaXBzOiB2ZW5kb3JlZCBza2lsbHMgKCsgcGFyc2VkXG4gICAgLy8gc2tpbGxzIGluZGV4KSBhbmQgb3B0LWluIGZ1bGwtcGFnZSBIVE1MLlxuICAgIGNvbnN0IHNraWxsRW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGxldCBza2lsbHNJbmRleDogU2tpbGxzSW5kZXggfCBudWxsID0gbnVsbDtcbiAgICBpZiAocHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQpIHtcbiAgICAgIGNvbnN0IGxvYWRlZCA9IGF3YWl0IFByb21pc2UuYWxsKEJVTkRMRURfU0tJTExfRklMRVMubWFwKGFzeW5jIChmKSA9PiAoe2YsIGRhdGE6IGF3YWl0IGxvYWRCdW5kbGVkU2tpbGxGaWxlKGYuZXh0KX0pKSk7XG4gICAgICBsZXQgc2tpcHBlZCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IHtmLCBkYXRhfSBvZiBsb2FkZWQpIHtcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkgeyBza2lwcGVkKys7IGNvbnRpbnVlOyB9XG4gICAgICAgIHNraWxsRW50cmllcy5wdXNoKHtuYW1lOiBmLmFyY2hpdmUsIGRhdGF9KTtcbiAgICAgICAgaWYgKGYuYXJjaGl2ZSA9PT0gJ3NraWxscy1pbmRleC5qc29uJykge1xuICAgICAgICAgIHRyeSB7IHNraWxsc0luZGV4ID0gSlNPTi5wYXJzZShkYXRhKSBhcyBTa2lsbHNJbmRleDsgfSBjYXRjaCB7IC8qIHVucmVhZGFibGUgaW5kZXgg4oCUIHRhYmxlIGRlZ3JhZGVzICovIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNraXBwZWQpIGNvbnNvbGUud2FybihMT0csIGBidW5kbGVkIHNraWxsczogJHtza2lwcGVkfS8ke2xvYWRlZC5sZW5ndGh9IGZpbGVzIG1pc3NpbmcgZnJvbSB0aGlzIGJ1aWxkIOKAlCBleHBvcnQgY29udGludWVzIHdpdGhvdXQgdGhlbWApO1xuICAgIH1cbiAgICBjb25zdCB7ZW50cmllczogcGFnZUh0bWxFbnRyaWVzLCBwYWdlc01ldGEsIGRpYWdub3N0aWNzOiBwYWdlSHRtbERpYWdub3N0aWNzfSA9IGF3YWl0IGNvbGxlY3RQYWdlSHRtbEVudHJpZXMoKTtcbiAgICBtYW5pZmVzdC5hZ2VudFByb3RvY29sID0ge2FyY2hpdmVQYXRoOiAnQUdFTlQtUFJPVE9DT0wubWQnfTtcbiAgICBpZiAoc2tpbGxzSW5kZXg/LnNraWxscz8ubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5idW5kbGVkU2tpbGxzID0gc2tpbGxzSW5kZXguc2tpbGxzLm1hcCgocykgPT4gKHtcbiAgICAgICAgaWQ6IHMuaWQsXG4gICAgICAgIGtpbmQ6IHMuaWQuc3RhcnRzV2l0aCgnaW1wZWNjYWJsZS8nKSA/ICdyZWZlcmVuY2UnIGFzIGNvbnN0IDogJ3NraWxsJyBhcyBjb25zdCxcbiAgICAgICAgYXJjaGl2ZVBhdGg6IHMucGF0aCxcbiAgICAgICAgLi4uKHMuaW52b2tlID8ge2ludm9jYXRpb246IHMuaW52b2tlfSA6IHt9KSxcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgaWYgKHBhZ2VzTWV0YS5sZW5ndGgpIHtcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbCA9IHBhZ2VzTWV0YTtcbiAgICAgIG1hbmlmZXN0LmNvdW50cy5wYWdlc0h0bWwgPSBwYWdlc01ldGEubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAocGFnZUh0bWxEaWFnbm9zdGljcy5sZW5ndGgpIHtcbiAgICAgIG1hbmlmZXN0LmV4cG9ydERpYWdub3N0aWNzID0gWy4uLihtYW5pZmVzdC5leHBvcnREaWFnbm9zdGljcyA/PyBbXSksIC4uLnBhZ2VIdG1sRGlhZ25vc3RpY3NdO1xuICAgIH1cbiAgICAvLyBUaGUgSlNPTkwgaW5zaWRlIHRoZSBhcmNoaXZlIG11c3QgZGVjbGFyZSBpdHNlbGYgYXMgcGFydCBvZiBhXG4gICAgLy8gdGFyLnpzdCBidW5kbGUgc28gaXRzIG1hbmlmZXN0J3MgYGRlc2lnbi5pbmxpbmVgIC8gYHNraWxsLmlubGluZWBcbiAgICAvLyBmbGFncyBtYXRjaCB3aGF0J3MgYWN0dWFsbHkgcHJlc2VudCBpbiB0aGUgc3Vycm91bmRpbmcgdGFyLlxuICAgIGNvbnN0IGpzb25sVGV4dCA9IGJ1aWxkSnNvbmwoanNvbmxOYW1lLCAndGFyLnpzdCcsIG1hbmlmZXN0T3B0cyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIGNvbnN0IHJlYWRtZSA9IGJ1aWxkUmVhZG1lKG1hbmlmZXN0LCBqc29ubE5hbWUsIHNob3RFbnRyaWVzLmxlbmd0aCk7XG4gICAgY29uc3Qgc2hvdHNKc29uID0gYnVpbGRTY3JlZW5zaG90c0luZGV4KGJ1bmRsZWQsIGV4cG9ydGVkQXRJc28pO1xuXG4gICAgLy8gTWFya2Rvd24gZXhwb3J0IHdhcyBkcm9wcGVkOiBpdCBjYXJyaWVkIG5vIGRhdGEgdGhlIEpTT05MIGRpZG4ndFxuICAgIC8vIGFscmVhZHkgaGF2ZSAodGhlIGh1bWFuLXJlYWRhYmxlIHN1cmZhY2Ugd2FzIGp1c3QgYSBjdXJhdGVkIHN1YnNldFxuICAgIC8vIG9mIHRoZSBzYW1lIGZpZWxkcyksIGFuZCB0aGUgZGl2ZXJnZW5jZSDigJQgbWQgc2lsZW50bHkgZHJvcHBlZFxuICAgIC8vIGdyb3VwIGNoaWxkcmVuICsgdGhlIGVudGlyZSBgX2F1ZGl0YCBuYW1lc3BhY2Ug4oCUIHJpc2tlZFxuICAgIC8vIG1pc2xlYWRpbmcgYW55IGh1bWFuIHNraW0uIFJFQURNRS5tZCBpbnNpZGUgdGhlIGFyY2hpdmUgaXMgdGhlXG4gICAgLy8gaHVtYW4gZW50cnkgcG9pbnQgbm93LlxuICAgIC8vIEJ1ZyAjNzogZ2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIHRoZSBhZ2VudCdzIGZpcnN0LXJlYWQgZW50cnlcbiAgICAvLyBwb2ludC4gQnVnICM0MCBmaXJzdC1yZWFkIG9yZGVyOiBSRUFETUUgcG9pbnRzIHRoZSByZWNlaXZlciBhdFxuICAgIC8vIHJlcGFpci1pbmRleC5tZCBiZWZvcmUgU0tJTEwubWQgLyBERVNJR04ubWQuXG4gICAgY29uc3QgcmVwYWlySW5kZXggPSBidWlsZFJlcGFpckluZGV4KG1hbmlmZXN0LCBqc29ubE5hbWUpO1xuICAgIGNvbnN0IHRhckVudHJpZXM6IFRhckVudHJ5W10gPSBbXG4gICAgICB7bmFtZTogJ1JFQURNRS5tZCcsIGRhdGE6IHJlYWRtZX0sXG4gICAgICB7bmFtZTogJ3JlcGFpci1pbmRleC5tZCcsIGRhdGE6IHJlcGFpckluZGV4fSxcbiAgICAgIHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IGpzb25sVGV4dH0sXG4gICAgICB7bmFtZTogJ3NjcmVlbnNob3RzLmpzb24nLCBkYXRhOiBzaG90c0pzb259LFxuICAgICAge25hbWU6ICdkdWNrZGIuc3FsJywgZGF0YTogc3FsfSxcbiAgICAgIC8vIEJ1ZyAjMjg6IG1hY2hpbmUtcmVhZGFibGUgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlLlxuICAgICAge25hbWU6ICdzY2hlbWEuanNvbicsIGRhdGE6IGJ1aWxkU2NoZW1hSnNvbigpfSxcbiAgICAgIC4uLnNob3RFbnRyaWVzLFxuICAgIF07XG4gICAgLy8gREVTSUdOLm1kIOKAlCBlaXRoZXIgdGhlIHVzZXIncyBjdXN0b21pemVkIGNvbnRlbnQgb3IgdGhlIGJ1bmRsZWRcbiAgICAvLyB0ZW1wbGF0ZSAvIGxvY2FsIG92ZXJyaWRlLiBSZXNvbHZlZCB0aHJvdWdoIHRoZSBzYW1lIGxvYWRlciB0aGVcbiAgICAvLyBzZXR0aW5ncyBtb2RhbCB1c2VzIHNvIGNocm9tZS5zdG9yYWdlIHN0YXlzIHNtYWxsIChlbXB0eSBwcmVmc1xuICAgIC8vIOKGkiBmYWxsYmFjayB0byBleHRlbnNpb24vdGVtcGxhdGVzLyoubWQgdmlhIGZldGNoKS5cbiAgICBjb25zdCBkZXNpZ25Db250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICBpZiAoZGVzaWduQ29udGVudC50cmltKCkpIHtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0RFU0lHTi5tZCcsIGRhdGE6IGRlc2lnbkNvbnRlbnR9KTtcbiAgICB9XG4gICAgLy8gUGluY2hHcmFiIFVJIHNraWxsIOKAlCBzYW1lIHN0b3J5LiBMaXZlcyBhdCB0aGUgY2Fub25pY2FsIHJlY2VpdmVyXG4gICAgLy8gcGF0aCBpbnNpZGUgdGhlIGFyY2hpdmUgc28gdGhlIHJlY2VpdmVyJ3MgYC5hZ2VudHMvYCB0cmVlIGNhbiBiZVxuICAgIC8vIHBvcHVsYXRlZCBieSBhIHNpbXBsZSBgdGFyIC14YCBmcm9tIHRoZSBhcmNoaXZlIHJvb3QuXG4gICAgLy9cbiAgICAvLyBGcm9udG1hdHRlciByZW5hbWU6IGEgdXNlcidzIHNvdXJjZSBTS0lMTC5tZCBtYXkgdXNlIGBuYW1lOiB1aWBcbiAgICAvLyAoYmVjYXVzZSB0aGF0J3MgaG93IGl0J3MgY2F0YWxvZ3VlZCBpbiB0aGVpciBnbG9iYWwgYC5hZ2VudHMvYFxuICAgIC8vIHNraWxscyB0cmVlKS4gSW5zaWRlIGEgUGluY2hHcmFiIGFyY2hpdmUgdGhlIHNraWxsIGlzICp0aGUqXG4gICAgLy8gUGluY2hHcmFiIHNraWxsLCBzbyB3ZSByZWJyYW5kIHRoZSBmcm9udG1hdHRlciBgbmFtZTpgIGZpZWxkIG9uXG4gICAgLy8gdGhlIHdheSBpbnRvIHRoZSB0YXIgd2l0aG91dCB0b3VjaGluZyB0aGUgYm9keS4gT25seSB0aGUgRklSU1RcbiAgICAvLyBgbmFtZTpgIGxpbmUgaW5zaWRlIHRoZSBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHJld3JpdHRlbi5cbiAgICBjb25zdCBza2lsbENvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgaWYgKHNraWxsQ29udGVudC50cmltKCkpIHtcbiAgICAgIGNvbnN0IHJlYnJhbmRlZCA9IHJlYnJhbmRTa2lsbE5hbWUoc2tpbGxDb250ZW50LCAnUGluY2hHcmFiJyk7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLCBkYXRhOiByZWJyYW5kZWR9KTtcbiAgICB9XG4gICAgLy8gVmVuZG9yZWQgc2tpbGxzICsgb3B0LWluIHBhZ2UgSFRNTCAobG9hZGVkIGFib3ZlLCBiZWZvcmUgdGhlIGRvY3MpLlxuICAgIHRhckVudHJpZXMucHVzaCguLi5za2lsbEVudHJpZXMsIC4uLnBhZ2VIdG1sRW50cmllcyk7XG4gICAgLy8gQUdFTlQtUFJPVE9DT0wubWQg4oCUIHRoZSBmdWxsIFNlbmQtdG8tQWdlbnQgZG9jdHJpbmUuIEh5ZHJhdGVkIGxhc3Qgc29cbiAgICAvLyBpdHMgYnVuZGxlIHRyZWUgcmVmbGVjdHMgZXZlcnkgZW50cnkgYWJvdmUgKHBsdXMgaXRzZWxmKTsgdGhlIHNhbWVcbiAgICAvLyBvcHRpb25zIHJlYnVpbGQgdGhlIGNsaXBib2FyZCBwYXlsb2FkIGFmdGVyIHRoZSBzYXZlIHJlc29sdmVzIHRoZVxuICAgIC8vIHJlYWwgYWJzb2x1dGUgYXJjaGl2ZSBwYXRoLlxuICAgIGNvbnN0IGVudHJ5TmFtZXNGb3JEb2NzID0gWy4uLnRhckVudHJpZXMubWFwKChlKSA9PiBlLm5hbWUpLCAnQUdFTlQtUFJPVE9DT0wubWQnXS5zb3J0KCk7XG4gICAgY29uc3QgYWdlbnRQcm9tcHRPcHRzID0ge1xuICAgICAgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIGJ1bmRsZUlkLFxuICAgICAgYXJjaGl2ZVBhdGg6IGFyY2hpdmVOYW1lLFxuICAgICAgZXhwb3J0VHM6IGV4cG9ydGVkQXRJc28sXG4gICAgICBqc29ubE5hbWUsXG4gICAgICBjb3VudHM6IHtjb21tZW50czogbWFuaWZlc3QuY291bnRzLmZlZWRiYWNrLCBzZWxlY3RvcnM6IG1hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnMsIHBhZ2VzOiBtYW5pZmVzdC5jb3VudHMucGFnZXMsIHNjcmVlbnNob3RzOiBzaG90RW50cmllcy5sZW5ndGh9LFxuICAgICAgZW50cnlOYW1lczogZW50cnlOYW1lc0ZvckRvY3MsXG4gICAgICBkZXNpZ25Jc1RlbXBsYXRlOiBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSxcbiAgICB9O1xuICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0FHRU5ULVBST1RPQ09MLm1kJywgZGF0YTogYnVpbGRBZ2VudFByb3RvY29sTWQoey4uLmFnZW50UHJvbXB0T3B0cywgc2tpbGxzSW5kZXh9KX0pO1xuICAgIC8vIFJlYnVpbGQgdGhlIG1hbmlmZXN0IGxpbmUgaW4gdGhlIEpTT05MIHdpdGggYXJjaGl2ZUludGVncml0eVxuICAgIC8vIChmaWxlIGxpc3QgKyBzaXplcykuIEhhcyB0byBoYXBwZW4gQUZURVIgYWxsIHRhckVudHJpZXMgYXJlXG4gICAgLy8gYXNzZW1ibGVkIGJ1dCBCRUZPUkUgd2UgdGFyIHRoZW0sIHNvIHdlIGtub3cgd2hhdCdzIGluIHRoZVxuICAgIC8vIGJ1bmRsZS4gVGhlbiB3ZSByZXBsYWNlIHRoZSBKU09OTCdzIG1hbmlmZXN0IHdpdGggdGhlIGF1Z21lbnRlZFxuICAgIC8vIHZlcnNpb24uXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGludGVncml0eToge2ZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9Pn0gPSB7ZmlsZXM6IFtdfTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiB0YXJFbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShlLmRhdGEpIDogKGUuZGF0YSBhcyBVaW50OEFycmF5KTtcbiAgICAgICAgaW50ZWdyaXR5LmZpbGVzLnB1c2goe3BhdGg6IGUubmFtZSwgc2l6ZTogZGF0YS5sZW5ndGh9KTtcbiAgICAgIH1cbiAgICAgIC8vIFJlLWVtaXQgdGhlIEpTT05MIHdpdGggdGhlIGF1Z21lbnRlZCBtYW5pZmVzdC4gQ2hlYXBlciB0byBkb1xuICAgICAgLy8gdGhpcyByZS1yZW5kZXIgdGhhbiB0byBtYWludGFpbiBtdXRhYmxlIHN0YXRlIHRocm91Z2ggdGhlIHNsaW1cbiAgICAgIC8vIGVtaXQuIFdlIHN3YXAgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBpbi1wbGFjZS5cbiAgICAgIGNvbnN0IGF1Z21lbnRlZE1hbmlmZXN0ID0gey4uLm1hbmlmZXN0LCBhcmNoaXZlSW50ZWdyaXR5OiBpbnRlZ3JpdHl9O1xuICAgICAgY29uc3QgbGluZXMgPSBqc29ubFRleHQuc3BsaXQoJ1xcbicpO1xuICAgICAgbGluZXNbMF0gPSBKU09OLnN0cmluZ2lmeShhdWdtZW50ZWRNYW5pZmVzdCk7XG4gICAgICBjb25zdCBuZXdKc29ubCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgY29uc3QgaWR4ID0gdGFyRW50cmllcy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0ganNvbmxOYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkgdGFyRW50cmllc1tpZHhdID0ge25hbWU6IGpzb25sTmFtZSwgZGF0YTogbmV3SnNvbmx9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ2FyY2hpdmVJbnRlZ3JpdHkgY29tcHV0YXRpb24gZmFpbGVkJywgZXJyKTtcbiAgICB9XG5cbiAgICAvLyBTdGFtcCBldmVyeSBlbnRyeSB3aXRoIHRoZSBleHBvcnQgY2xvY2sgc28gYXJjaGl2ZSBieXRlcyBhcmUgYSBwdXJlXG4gICAgLy8gZnVuY3Rpb24gb2YgY29udGVudCArIGNsb2NrIChidWlsZFRhciB3b3VsZCBvdGhlcndpc2Ugc2FtcGxlIG5vdygpKS5cbiAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykgZS5tdGltZSA/Pz0gbXRpbWVTZWM7XG4gICAgY29uc3QgdGFyQnl0ZXMgPSBidWlsZFRhcih0YXJFbnRyaWVzKTtcbiAgICBjb25zdCBhcmNoaXZlQnl0ZXMgPSB3cmFwWnN0ZCh0YXJCeXRlcyk7XG5cbiAgICAvLyBDb3B5IHRoZSBTZW5kLXRvLUFnZW50IHBheWxvYWQgTk9XLCB3aGlsZSB0aGUgY2xpY2sncyBmb2N1cyBpcyBzdGlsbFxuICAgIC8vIGZyZXNoOiB0aGUgc2F2ZSBiZWxvdyBjYW4gdGFrZSBzZWNvbmRzIChzY3JlZW5zaG90IGJhdGNoZXMsIGRvd25sb2FkXG4gICAgLy8gY29tcGxldGlvbiBwb2xsaW5nKSBhbmQgQ2hyb21lJ3MgZG93bmxvYWQgVUkgY2FuIHN0ZWFsIGZvY3VzLCB3aGljaFxuICAgIC8vIG1ha2VzIG5hdmlnYXRvci5jbGlwYm9hcmQgd3JpdGVzIGZhaWwgc2lsZW50bHkuIFRoZSBwcmVkaWN0ZWQgcGF0aCBpc1xuICAgIC8vIHRoZSBzdGFibGUgRG93bmxvYWRzLXJlbGF0aXZlIGZvcm0gKHRoZSBib290c3RyYXAgZXhwYW5kcyB0aGUgfik7XG4gICAgLy8gb25jZSB0aGUgc2F2ZSByZXNvbHZlcyB3ZSByZS1jb3B5IHdpdGggdGhlIHJlYWwgYWJzb2x1dGUgcGF0aCxcbiAgICAvLyBiZXN0LWVmZm9ydCDigJQgaWYgdGhhdCBvbmUgZmFpbHMsIHRoaXMgY29weSBhbHJlYWR5IHN0YW5kcy5cbiAgICBjb25zdCBwcmVkaWN0ZWRQYXRoID0gYH4vRG93bmxvYWRzL3BpbmNoZ3JhYi8ke2FjdGl2ZVdzfS9leHBvcnRzLyR7YXJjaGl2ZU5hbWV9YDtcbiAgICBsYXN0RXhwb3J0LmFnZW50UHJvbXB0ID0gYnVpbGRBZ2VudFByb21wdEpzb25sKHsuLi5hZ2VudFByb21wdE9wdHMsIGFyY2hpdmVQYXRoOiBwcmVkaWN0ZWRQYXRofSk7XG4gICAgY29uc3QgZWFybHlDb3BpZWQgPSBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQobGFzdEV4cG9ydC5hZ2VudFByb21wdCk7XG5cbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSDihpInLCB7YXJjaGl2ZU5hbWUsIHRhckJ5dGVzOiB0YXJCeXRlcy5sZW5ndGgsIGFyY2hpdmVCeXRlczogYXJjaGl2ZUJ5dGVzLmxlbmd0aCwgc2NyZWVuc2hvdHM6IHNob3RFbnRyaWVzLmxlbmd0aH0pO1xuICAgICAgLy8gUGFzcyBhcyBhIHBsYWluIG51bWJlcltdIG92ZXIgc2VuZE1lc3NhZ2U7IHN0cnVjdHVyZWQtY2xvbmUgb2ZcbiAgICAgIC8vIFVpbnQ4QXJyYXkgdmlhIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGlzbid0IHJlbGlhYmxlIGFjcm9zc1xuICAgICAgLy8gQ2hyb21lIHZlcnNpb25zLlxuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtcbiAgICAgICAga2luZDogJ3NhdmUtYnl0ZXMnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZTogYXJjaGl2ZU5hbWUsXG4gICAgICAgIGJ5dGVzOiBBcnJheS5mcm9tKGFyY2hpdmVCeXRlcyksIG1pbWU6ICdhcHBsaWNhdGlvbi96c3RkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIC8vIFJlZnJlc2ggdGhlIGFscmVhZHktY29waWVkIHBheWxvYWQgd2l0aCB0aGUgUkVBTCBzYXZlZCBwYXRoLlxuICAgICAgICAvLyBCZXN0LWVmZm9ydDogZm9jdXMgbWF5IGJlIGdvbmUgYnkgbm93LCBhbmQgdGhlIGVhcmx5IGNvcHkgYWJvdmVcbiAgICAgICAgLy8gYWxyZWFkeSBob2xkcyBhIHZhbGlkIHBheWxvYWQgKHByZWRpY3RlZCB+L0Rvd25sb2FkcyBwYXRoKS5cbiAgICAgICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5hZ2VudFByb21wdCA9IGJ1aWxkQWdlbnRQcm9tcHRKc29ubCh7Li4uYWdlbnRQcm9tcHRPcHRzLCBhcmNoaXZlUGF0aDogcGF0aFRvQ29weX0pO1xuICAgICAgICBjb25zdCBsYXRlQ29waWVkID0gYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQpO1xuICAgICAgICBjb25zdCBwcm9tcHRDb3BpZWQgPSBsYXRlQ29waWVkIHx8IGVhcmx5Q29waWVkO1xuICAgICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgICBpZiAocHJvbXB0Q29waWVkKSBzaG93Q29waWVkKCdTZW50IHRvIGFnZW50JywgJ3Byb21wdCBjb3BpZWQg4oCUIHBhc3RlIGludG8geW91ciBjb2RpbmcgYWdlbnQnKTtcbiAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgIGBTZW50IHRvIGFnZW50IMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCR7cHJvbXB0Q29waWVkID8gJyDCtyBwcm9tcHQgY29waWVkJyA6ICcgwrcgY2xpcGJvYXJkIGJsb2NrZWQg4oCUIHVzZSBDbWQrSyDihpIgQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCd9JHtsYXN0RXhwb3J0LnRlbXBQYXRoID8gJyDCtyBQbGF5d3JpZ2h0IHRlbXAgaGlkZGVuJyA6ICcnfSDCtyAke2xlYWZ9YCxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdvbkV4cG9ydEFyY2hpdmUgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEFyY2hpdmUgZXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFRlc3QvZGV2IGZhbGxiYWNrOiBzeW50aGVzaXplIGEgZG93bmxvYWQgbGluay5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2FyY2hpdmVCeXRlcyBhcyB1bmtub3duIGFzIEJsb2JQYXJ0XSwge3R5cGU6ICdhcHBsaWNhdGlvbi96c3RkJ30pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBhcmNoaXZlTmFtZTsgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9ICd0YXIuenN0JztcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIC8vIFRoZSBwcmVkaWN0ZWQtcGF0aCBwYXlsb2FkIHdhcyBhbHJlYWR5IGNvcGllZCBiZWZvcmUgdGhlIHNhdmUuXG4gICAgc2hvd0NvcGllZCgnU2VudCB0byBhZ2VudCcsICdwcm9tcHQgY29waWVkIOKAlCBwYXN0ZSBpbnRvIHlvdXIgY29kaW5nIGFnZW50Jyk7XG4gICAgc2V0U3RhdHVzKGBTZW50IHRvIGFnZW50IMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCR7ZWFybHlDb3BpZWQgPyAnIMK3IHByb21wdCBjb3BpZWQnIDogJyd9YCk7XG4gIH07XG5cbiAgLy8gQmVzdC1lZmZvcnQgY2xpcGJvYXJkIHdyaXRlIOKAlCBuZXZlciB0aHJvd3M7IHJldHVybnMgd2hldGhlciB0aGVcbiAgLy8gd3JpdGUgc3VjY2VlZGVkIHNvIHRoZSBjYWxsZXIgY2FuIGFkanVzdCB0aGUgc3RhdHVzIG1lc3NhZ2UuXG4gIC8vIENsaXBib2FyZCB3cml0ZXMgY2FuIGZhaWwgd2hlbiB0aGUgcGFuZWwgZG9lc24ndCBoYXZlIGZvY3VzIG9yIGluXG4gIC8vIHNvbWUgdGVzdCBoYXJuZXNzZXMsIGFuZCB3ZSBkb24ndCB3YW50IHRoYXQgdG8gYmxvY2sgdGhlIGV4cG9ydC5cbiAgY29uc3QgY29weVRvQ2xpcGJvYXJkU2lsZW50ID0gYXN5bmMgKHRleHQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpOyByZXR1cm4gdHJ1ZTsgfVxuICAgIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEdWNrREIgc25pcHBldCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ2Fub25pY2FsIFNRTCByZWNpcGVzIGZvciBxdWVyeWluZyBhIEpTT05MIGV4cG9ydC4gQ29waWVzIHRvIGNsaXBib2FyZFxuICAvLyBhbmQgcHJpbnRzIGEgc3RhdHVzIG1lc3NhZ2Ug4oCUIHdlIGRvbid0IHJ1biBEdWNrREIgb3Vyc2VsdmVzLCB0aGUgdXNlclxuICAvLyBwaXBlcyB0aGUgc25pcHBldCBpbnRvIGBkdWNrZGJgIG9uIHRoZWlyIG1hY2hpbmUuIFRoZSByZWNpcGVzIHRhcmdldFxuICAvLyBxdWVzdGlvbnMgYSBVSS1lbmdpbmVlciBMTE0gd29ya2Zsb3cgdGVuZHMgdG8gYXNrOiBsaXN0IGNhcHR1cmVzIGJ5XG4gIC8vIGhvc3QsIGZpbmQgZHVwbGljYXRlIG91dGVySFRNTCwgZmluZCBjYXB0dXJlcyBtaXNzaW5nIGEgc2NyZWVuc2hvdCxcbiAgLy8gYW5kIHVuaXF1ZS10b2tlbiBmcmVxdWVuY3kgZm9yIGEgcXVpY2sgZGVzaWduLXRva2VucyBvdmVydmlldy5cbiAgY29uc3QgZHVja0RiU25pcHBldCA9IChqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiBgLS0gUGluY2hHcmFiIOKGkiBEdWNrREIgcmVjaXBlc1xuLS0gU2F2ZSB5b3VyIEpTT05MIGV4cG9ydCwgdGhlbiBpbiB5b3VyIHNoZWxsOlxuLS0gICBkdWNrZGIgPCB0aGlzX2ZpbGUuc3FsXG4tLSBPciBvcGVuIGEgZHVja2RiIHNoZWxsIGFuZCBwYXN0ZSB0aGVzZSBvbmUgYXQgYSB0aW1lLlxuXG4tLSAxKSBMb2FkIHRoZSBKU09OTCBpbnRvIGEgdGFibGUuXG4tLSAgICBzYW1wbGVfc2l6ZT0tMSBmb3JjZXMgYSBmdWxsLWZpbGUgc2NhbiBmb3Igc2NoZW1hIGluZmVyZW5jZS4gV2l0aG91dFxuLS0gICAgaXQsIER1Y2tEQiBvbmx5IHNuaWZmcyB0aGUgZmlyc3QgMjAgNDgwIHJvd3Mg4oCUIGFuZCBQaW5jaEdyYWIgZXhwb3J0c1xuLS0gICAgbWl4IHNlbGVjdG9yICsgZmVlZGJhY2sgcm93IHR5cGVzLCBzbyByYXJlIGZlZWRiYWNrLW9ubHkgZmllbGRzXG4tLSAgICAodGFncywgcGFyZW50VWlkKSBjYW4gYmUgZHJvcHBlZCBmcm9tIHRoZSBpbmZlcnJlZCBzY2hlbWEgaWYgdGhleVxuLS0gICAgZG9uJ3QgYXBwZWFyIGVhcmx5IGVub3VnaC4gVGhhdCBiaXRlcyByZWNpcGUgNiBiZWxvdy5cbkNSRUFURSBPUiBSRVBMQUNFIFRBQkxFIHBnIEFTXG5TRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKFxuICAnJHtqc29ubE5hbWV9JyxcbiAgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsXG4gIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwLFxuICBzYW1wbGVfc2l6ZT0tMVxuKTtcblxuLS0gMikgUXVpY2sgb3ZlcnZpZXc6IGhvdyBtYW55IGNhcHR1cmVzIHBlciBob3N0LlxuU0VMRUNUXG4gIHJlZ2V4cF9leHRyYWN0KHVybCwgJzovLyhbXi9dKyknLCAxKSBBUyBob3N0LFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InKSBBUyBjYXB0dXJlcyxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ2ZlZWRiYWNrJykgQVMgY29tbWVudHNcbkZST00gcGdcbkdST1VQIEJZIDFcbk9SREVSIEJZIGNhcHR1cmVzIERFU0M7XG5cbi0tIDMpIEZpbmQgZHVwbGljYXRlIG91dGVySFRNTCBhY3Jvc3MgY2FwdHVyZXMgKG9mdGVuIHNpZ25hbHMgYSByZXVzZWRcbi0tICAgIGNvbXBvbmVudCB0aGUgdXNlciBoYXMgY2xpY2tlZCBpbnRvIG11bHRpcGxlIHRpbWVzKS5cblNFTEVDVCBvdXRlckhUTUwsIENPVU5UKCopIEFTIGhpdHMsIGxpc3Qoc2VsZWN0b3IpIEFTIHNlbGVjdG9yc1xuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIG91dGVySFRNTCBJUyBOT1QgTlVMTFxuR1JPVVAgQlkgb3V0ZXJIVE1MXG5IQVZJTkcgaGl0cyA+IDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMjU7XG5cbi0tIDQpIENhcHR1cmVzIHN0aWxsIG1pc3NpbmcgYSBzY3JlZW5zaG90IHBhdGguXG5TRUxFQ1QgbiwgdXJsLCBzZWxlY3RvclxuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIHNjcmVlbnNob3QgSVMgTlVMTFxuT1JERVIgQlkgbjtcblxuLS0gNSkgUXVpY2sgZGVzaWduLXRva2VuIHN1cmZhY2U6IHJhbmsgY2xhc3NlcyB0aGF0IGFwcGVhciBpbiBtYW55IGNhcHR1cmVzLlxuLS0gICAgTk9URTogZmlsdGVyIGNsYXNzZXMgSVMgTk9UIE5VTEwgcmF0aGVyIHRoYW4gdXNpbmcgYSBjb2FsZXNjZS13aXRoLWVtcHR5XG4tLSAgICBmYWxsYmFjazsgRHVja0RCIGNhbm5vdCBpbmZlciBlbGVtZW50IHR5cGVzIGZvciBhbiBlbXB0eSBsaXN0IGxpdGVyYWwuXG5XSVRIIGV4cGFuZGVkIEFTIChcbiAgU0VMRUNUIHVubmVzdChjbGFzc2VzKSBBUyBjXG4gIEZST00gcGdcbiAgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIGNsYXNzZXMgSVMgTk9UIE5VTExcbilcblNFTEVDVCBjLCBDT1VOVCgqKSBBUyBoaXRzXG5GUk9NIGV4cGFuZGVkXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDMwO1xuXG4tLSA2KSBDb21tZW50cyBqb2luZWQgdG8gdGhlaXIgcGFyZW50IHNlbGVjdG9yIHZpYSBwYXJlbnRVaWQuIFRoZVxuLS0gICAgcy50eXBlIGZpbHRlciBwcmV2ZW50cyBhbiBhY2NpZGVudGFsIGZlZWRiYWNr4oaUZmVlZGJhY2sgam9pbiBpbiBjYXNlXG4tLSAgICB0d28gcm93cyBldmVyIHNoYXJlIGEgdWlkIGJ5IGNvaW5jaWRlbmNlLlxuU0VMRUNUIHMubiwgcy5zZWxlY3RvciwgZi50ZXh0LCBmLnRhZ3NcbkZST00gcGcgZlxuSk9JTiBwZyBzXG4gIE9OIHMudWlkID0gZi5wYXJlbnRVaWRcbiBBTkQgcy50eXBlID0gJ3NlbGVjdG9yJ1xuV0hFUkUgZi50eXBlID0gJ2ZlZWRiYWNrJ1xuT1JERVIgQlkgcy5uO1xuYDtcbiAgY29uc3Qgb25EdWNrRGJTbmlwcGV0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIFByZWZlciB0aGUgSlNPTkwgZmlsZW5hbWUgb2YgdGhlIG1vc3QgcmVjZW50IGV4cG9ydCBzbyB0aGUgdXNlciBjYW5cbiAgICAvLyBwYXN0ZSB0aGlzIGRpcmVjdGx5IHdpdGhvdXQgZWRpdGluZyB0aGUgcmVhZF9qc29uX2F1dG8gcGF0aC4gRmFsbFxuICAgIC8vIGJhY2sgdG8gYSBmcmVzaCBlcG9jaC1iYXNlZCBuYW1lIGlmIG5vdGhpbmcgaGFzIGJlZW4gZXhwb3J0ZWQgeWV0LlxuICAgIGNvbnN0IGxhc3QgPSBsYXN0RXhwb3J0LnJlbFBhdGg7XG4gICAgY29uc3QganNvbmxOYW1lID0gKGxhc3QgJiYgL1xcLmpzb25sJC8udGVzdChsYXN0KSlcbiAgICAgID8gbGFzdC5zcGxpdCgnLycpLnBvcCgpISAgLy8gc3RyaXAgd29ya3NwYWNlL2V4cG9ydHMvIHByZWZpeFxuICAgICAgOiBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3FsKTtcbiAgICAgIHNldFN0YXR1cyhgRHVja0RCIHJlY2lwZXMgY29waWVkIMK3IHBhc3RlIGludG8gXFxgZHVja2RiXFxgIHNoZWxsIMK3IHJlZmVyZW5jZXMgJHtqc29ubE5hbWV9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgRHVja0RCIFNRTCcsIGpzb25sTmFtZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCBmYWlsZWQg4oCUIG9wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCAnT3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnKTtcbiAgICB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTY2hlbWEgbWlncmF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDb252ZXJ0IGEgdjEtc2hhcGVkIEVudHJ5LW9yLWV4cG9ydC1saW5lIGludG8gb3VyIGludGVybmFsIEVudHJ5LiBJZGVtcG90ZW50LlxuICAvLyBTdXBwb3J0czpcbiAgLy8gICDigKIgZmxhdCB2MSBlbnRyeSAobm8gYF9hdWRpdGAsIG5vIGB2YCBmaWVsZClcbiAgLy8gICDigKIgdjIgZXhwb3J0IGVudHJ5IChoYXMgYF9hdWRpdGAsIGB2OiAyYCwgYHR5cGU6ICdzZWxlY3RvcidgKVxuICAvLyAgIOKAoiBtaXhlZCAoc29tZSBmaWVsZHMgbmVzdGVkLCBzb21lIGZsYXQg4oCUIGxhc3Qgd2lucyBmb3Igc2FmZXR5KVxuICAvLyBQdXJlOiBuZXZlciBtdXRhdGVzIGByYXdgIG9yIGFueSBvZiBpdHMgbmVzdGVkIG9iamVjdHMuIFJldHVybnMgYSBuZXdcbiAgLy8gZW50cnkgd2l0aCBhbGwgbWlncmF0aW9ucyBhcHBsaWVkLiBUb3VjaGVkIHN1Ym9iamVjdHMgKGF0dHJzLCBoaW50cyxcbiAgLy8gZ3JvdXAgbWVtYmVycykgYXJlIGNsb25lZCBiZWZvcmUgZWRpdDsgdW50b3VjaGVkIG9uZXMgc2hhcmUgcmVmcyB3aXRoXG4gIC8vIHJhdywgd2hpY2ggaXMgZmluZSBzaW5jZSB3ZSBuZXZlciB3cml0ZSB0byB0aGVtLlxuICBjb25zdCBkZW5vcm1hbGl6ZUVudHJ5ID0gKHJhdzogYW55KTogRW50cnkgPT4ge1xuICAgIGNvbnN0IG91dDogYW55ID0gey4uLnJhd307XG4gICAgZGVsZXRlIG91dC52O1xuICAgIGRlbGV0ZSBvdXQudHlwZTtcbiAgICBkZWxldGUgb3V0LmZlZWRiYWNrO1xuICAgIGlmIChvdXQuX2F1ZGl0ICYmIHR5cGVvZiBvdXQuX2F1ZGl0ID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgYSA9IG91dC5fYXVkaXQ7XG4gICAgICBpZiAoYS5hbmNlc3RvcnMgIT09IHVuZGVmaW5lZCkgb3V0LmFuY2VzdG9ycyA9IGEuYW5jZXN0b3JzO1xuICAgICAgaWYgKGEuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBvdXQuY29tcG9uZW50Um9vdCA9IGEuY29tcG9uZW50Um9vdDtcbiAgICAgIGlmIChhLmluU2hhZG93RE9NICE9PSB1bmRlZmluZWQpIG91dC5pblNoYWRvd0RPTSA9IGEuaW5TaGFkb3dET007XG4gICAgICBpZiAoYS5wc2V1ZG9FbGVtZW50cyAhPT0gdW5kZWZpbmVkKSBvdXQucHNldWRvRWxlbWVudHMgPSBhLnBzZXVkb0VsZW1lbnRzO1xuICAgICAgaWYgKGEubWF0Y2hlZFJ1bGVzICE9PSB1bmRlZmluZWQpIG91dC5tYXRjaGVkUnVsZXMgPSBhLm1hdGNoZWRSdWxlcztcbiAgICAgIGlmIChhLnZpZXdwb3J0ICE9PSB1bmRlZmluZWQpIG91dC52aWV3cG9ydCA9IGEudmlld3BvcnQ7XG4gICAgICBkZWxldGUgb3V0Ll9hdWRpdDtcbiAgICB9XG4gICAgLy8gc3RhdGVzOiB2MSB1c2VkIFJlY29yZDxzdHJpbmcsIHRydWU+OyB2MiB1c2VzIHN0cmluZ1tdLiBOb3JtYWxpemUgYm90aC5cbiAgICBpZiAob3V0LnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShvdXQuc3RhdGVzKSAmJiB0eXBlb2Ygb3V0LnN0YXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG91dC5zdGF0ZXMgPSBPYmplY3Qua2V5cyhvdXQuc3RhdGVzKS5maWx0ZXIoKGspID0+IEJvb2xlYW4oKG91dC5zdGF0ZXMgYXMgYW55KVtrXSkpO1xuICAgIH1cbiAgICAvLyBhdHRycy5mb3JtYXQg4oaSIGhpbnRzLmZvcm1hdC4gQ2xvbmUgYXR0cnMgZmlyc3Qgc28gd2UgZG9uJ3QgbXV0YXRlIHRoZVxuICAgIC8vIGNhbGxlcidzIG5lc3RlZCBvYmplY3QuIFNhbWUgZm9yIGhpbnRzICh3ZSBtYXkgbWVyZ2UgaW50byBpdCkuXG4gICAgaWYgKG91dC5hdHRycyAmJiB0eXBlb2Ygb3V0LmF0dHJzID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3V0LmF0dHJzLmZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGZtdCA9IG91dC5hdHRycy5mb3JtYXQ7XG4gICAgICBjb25zdCB7Zm9ybWF0OiBfZHJvcCwgLi4ucmVzdEF0dHJzfSA9IG91dC5hdHRycztcbiAgICAgIG91dC5hdHRycyA9IHJlc3RBdHRycztcbiAgICAgIG91dC5oaW50cyA9IHsuLi4ob3V0LmhpbnRzID8/IHt9KSwgZm9ybWF0OiBmbXR9O1xuICAgIH1cbiAgICBpZiAoIW91dC51aWQpIG91dC51aWQgPSBtc2dJZCgpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG91dC5ncm91cCkpIG91dC5ncm91cCA9IG91dC5ncm91cC5tYXAoZGVub3JtYWxpemVFbnRyeSk7XG4gICAgcmV0dXJuIG91dCBhcyBFbnRyeTtcbiAgfTtcbiAgLy8gV2FsayBhbGwgbG9hZGVkIG1lc3NhZ2VzIGFuZCBtaWdyYXRlIGFueSBsZWdhY3kgZW50cmllcy4gUmV0dXJucyB0cnVlIGlmXG4gIC8vIGFueXRoaW5nIG11dGF0ZWQgc28gdGhlIGNhbGxlciBjYW4gcGVyc2lzdC5cbiAgY29uc3QgbWlncmF0ZUxvYWRlZE1lc3NhZ2VzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGxldCBtdXRhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IG0uZW50cnk7XG4gICAgICAvLyBDaGVhcCBwcmUtY2hlY2s6IGlmIHVpZCBleGlzdHMgQU5EIHN0YXRlcyBpcyBhbiBhcnJheSBBTkQgbm8gX2F1ZGl0XG4gICAgICAvLyBBTkQgbm8gYXR0cnMuZm9ybWF0IOKGkiBub3RoaW5nIHRvIGRvLCBza2lwIHRoZSB3b3JrLlxuICAgICAgY29uc3QgbmVlZHNXb3JrID1cbiAgICAgICAgIWJlZm9yZS51aWQgfHxcbiAgICAgICAgKGJlZm9yZS5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkoYmVmb3JlLnN0YXRlcykpIHx8XG4gICAgICAgIChiZWZvcmUgYXMgYW55KS5fYXVkaXQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAoYmVmb3JlLmF0dHJzICYmIHR5cGVvZiAoYmVmb3JlLmF0dHJzIGFzIGFueSkuZm9ybWF0ID09PSAnc3RyaW5nJyk7XG4gICAgICBpZiAoIW5lZWRzV29yaykgY29udGludWU7XG4gICAgICBtLmVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShiZWZvcmUpO1xuICAgICAgbXV0YXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtdXRhdGVkO1xuICB9O1xuICBjb25zdCBvbkltcG9ydCA9ICgpOiB2b2lkID0+IGltcG9ydEZpbGUuY2xpY2soKTtcbiAgaW1wb3J0RmlsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM/LlswXTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICBjb25zdCBpbXBvcnRlZDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgdGV4dC5zcGxpdCgvXFxyP1xcbi8pKSB7XG4gICAgICBpZiAoIWxpbmUudHJpbSgpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKGxpbmUpO1xuICAgICAgICBpZiAoby50eXBlID09PSAnbWFuaWZlc3QnKSB7XG4gICAgICAgICAgLy8gTWFuaWZlc3QgbGluZSDigJQgaW5mb3JtYXRpb25hbCBvbmx5IG9uIGltcG9ydC4gU2tpcC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoby50eXBlID09PSAncGFnZScpIGltcG9ydGVkLnB1c2goe3R5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdXJsOiBvLnVybCwgdGl0bGU6IG8udGl0bGUsIHZpZXdwb3J0OiBvLnZpZXdwb3J0LCB0b2tlbnM6IG8udG9rZW5zLCB1c2VyQWdlbnQ6IG8udXNlckFnZW50LCBsYW5nOiBvLmxhbmd9KTtcbiAgICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0OiBvLnRleHQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoby5wYXJlbnRVaWQpIGZiLnBhcmVudFVpZCA9IG8ucGFyZW50VWlkO1xuICAgICAgICAgIGlmIChvLmRldGFjaGVkKSBmYi5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoby50YWdzKSAmJiBvLnRhZ3MubGVuZ3RoKSBmYi50YWdzID0gby50YWdzO1xuICAgICAgICAgIGlmIChvLnNldmVyaXR5KSBmYi5zZXZlcml0eSA9IG8uc2V2ZXJpdHk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaChmYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc2VsZWN0b3IgbGluZSDigJQgY291bGQgYmUgdjEgKGZsYXQpIG9yIHYyICh3aXRoIF9hdWRpdCkuIFRoZVxuICAgICAgICAgIC8vIGJ1bmRsZWQgZmVlZGJhY2sgYXJyYXkgbXVzdCBiZSBzcGxpdCBvdXQgaW50byBzZXBhcmF0ZSBmZWVkYmFja1xuICAgICAgICAgIC8vIG1lc3NhZ2VzIGZvciByb3VuZC10cmlwIHdpdGggdjEgcmVhZGVycyDigJQgYnV0IGluIHYyIHdlIGFscmVhZHlcbiAgICAgICAgICAvLyBlbWl0IHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZXMsIHNvIGRyb3BwaW5nIHRoZSBidW5kbGVkIGxpc3QgaXNcbiAgICAgICAgICAvLyBzYWZlIHRvIGF2b2lkIGRvdWJsZS1jb3VudGluZy5cbiAgICAgICAgICBjb25zdCBmYiA9IEFycmF5LmlzQXJyYXkoby5mZWVkYmFjaykgPyBvLmZlZWRiYWNrIDogbnVsbDtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGRlbm9ybWFsaXplRW50cnkobyk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnl9KTtcbiAgICAgICAgICAvLyBPbmx5IGluZmxhdGUgYnVuZGxlZCBmZWVkYmFjayBpZiB0aGUgZmlsZSBpcyB2MSAobm8gdmVyc2lvblxuICAgICAgICAgIC8vIG1hcmtlciBvbiB0aGUgc2VsZWN0b3IgbGluZXMpLiB2MiBoYXMgaXRzIG93biBzdGFuZGFsb25lXG4gICAgICAgICAgLy8gZmVlZGJhY2sgbGluZXMgdGhhdCBhcnJpdmUgc2VwYXJhdGVseS5cbiAgICAgICAgICBpZiAoZmIgJiYgby52ICE9PSAyKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZmIpIGltcG9ydGVkLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICB0ZXh0OiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgPyB0IDogdD8udGV4dCA/PyAnJyxcbiAgICAgICAgICAgICAgcGFyZW50VWlkOiBlbnRyeS51aWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggeyAvKiBza2lwIGJhZCBsaW5lICovIH1cbiAgICB9XG4gICAgbWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIC4uLmltcG9ydGVkXTtcbiAgICBwZXJzaXN0KCk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cyhgSW1wb3J0ZWQgJHtpbXBvcnRlZC5sZW5ndGh9IG1lc3NhZ2Uke2ltcG9ydGVkLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgIGltcG9ydEZpbGUudmFsdWUgPSAnJztcbiAgfSk7XG4gIC8vIOKUgOKUgOKUgCBXb3Jrc3BhY2Ugc25hcHNob3QgaGlzdG9yeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUGVyc2lzdGVudCAobm90IHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2spLiBBIENsZWFyLWFsbCBhcmNoaXZlcyB0aGVcbiAgLy8gY3VycmVudCB3b3Jrc3BhY2Ugc3RhdGUgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGZyb20gU2V0dGluZ3MgbGF0ZXIuXG4gIGxldCB3c1NuYXBzaG90czogV29ya3NwYWNlU25hcHNob3RbXSA9IFtdO1xuICBjb25zdCBsb2FkV3NTbmFwc2hvdHMgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVNuYXBzaG90W10+KHdzU25hcHNob3RzS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V3NTbmFwc2hvdHMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KHdzU25hcHNob3RzS2V5KGFjdGl2ZVdzKSwgd3NTbmFwc2hvdHMpOyB9O1xuICAvLyBBcmNoaXZlIHRoZSBDVVJSRU5UIHdvcmtzcGFjZSBzdGF0ZSAoYmVmb3JlIGl0J3Mgd2lwZWQpLiBOby1vcCBpZiBlbXB0eS5cbiAgY29uc3QgYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90ID0gKCk6IFdvcmtzcGFjZVNuYXBzaG90IHwgbnVsbCA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHNuYXA6IFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgICAgaWQ6IHNlY3VyZVRva2VuKDgpLFxuICAgICAgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIG1lc3NhZ2VzOiBzdHJ1Y3R1cmVkQ2xvbmUobWVzc2FnZXMpLFxuICAgICAgc2hvdHM6IE9iamVjdC5mcm9tRW50cmllcyhzaG90cyksXG4gICAgICBzZWxlY3RvcnM6IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5sZW5ndGgsXG4gICAgICBjb21tZW50czogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpLmxlbmd0aCxcbiAgICB9O1xuICAgIC8vIE5ld2VzdCBmaXJzdDsgY2FwIHRoZSBoaXN0b3J5LlxuICAgIHdzU25hcHNob3RzLnVuc2hpZnQoc25hcCk7XG4gICAgaWYgKHdzU25hcHNob3RzLmxlbmd0aCA+IFdTX1NOQVBTSE9UX0NBUCkgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5zbGljZSgwLCBXU19TTkFQU0hPVF9DQVApO1xuICAgIHBlcnNpc3RXc1NuYXBzaG90cygpO1xuICAgIHJldHVybiBzbmFwO1xuICB9O1xuICBjb25zdCByZXN0b3JlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHNuYXAgPSB3c1NuYXBzaG90cy5maW5kKChzKSA9PiBzLmlkID09PSBpZCk7XG4gICAgaWYgKCFzbmFwKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gUHVzaCB0aGUgbGl2ZSBzdGF0ZSBvbnRvIHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2sgc28gYSBtaXN0YWtlblxuICAgIC8vIHJlc3RvcmUgaXMgaXRzZWxmIHVuZG9hYmxlLlxuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBzdHJ1Y3R1cmVkQ2xvbmUoc25hcC5tZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzbmFwLnNob3RzKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgc2V0U3RhdHVzKGBSZXN0b3JlZCBzbmFwc2hvdCDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWxlY3RvcnNgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgZGVsZXRlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHdzU25hcHNob3RzID0gd3NTbmFwc2hvdHMuZmlsdGVyKChzKSA9PiBzLmlkICE9PSBpZCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICB9O1xuXG4gIGNvbnN0IG9uQ2xlYXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb25maXJtKCdDbGVhciBhbGwgY2FwdHVyZXM/IEEgc25hcHNob3Qgd2lsbCBiZSBzYXZlZCB0byBTZXR0aW5ncyDihpIgV29ya3NwYWNlcyBmaXJzdC4nKSkgcmV0dXJuO1xuICAgIC8vIEFyY2hpdmUgdGhlIHdvcmtzcGFjZSBCRUZPUkUgd2lwaW5nIHNvIGl0IGNhbiBiZSByZXN0b3JlZCBsYXRlci5cbiAgICBjb25zdCBzbmFwID0gYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90KCk7XG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IFtdO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICAvLyBOZXZlciBjbGFpbSBhIHNuYXBzaG90IHRoYXQgZGlkbid0IGhhcHBlbiAoZW1wdHkgd29ya3NwYWNlIG5vLW9wcykuXG4gICAgc2V0U3RhdHVzKHNuYXAgPyAnQ2xlYXJlZCDCtyBzbmFwc2hvdCBzYXZlZCDigJQgcmVzdG9yZSBpbiBTZXR0aW5ncyDihpIgV29ya3NwYWNlcycgOiAnQ2xlYXJlZCcpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBWYWxpZGF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBydW5WYWxpZGF0aW9uID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IFsuLi5uZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKSldO1xuICAgIGlmICghc2VsZWN0b3JzLmxlbmd0aCB8fCAhaW5FeHRlbnNpb24pIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgIGlmICghdGFic1swXSkgcmV0dXJuO1xuICAgICAgbGl2ZVRhYlVybCA9IHRhYnNbMF0udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgICBsaXZlVGFiUGF0aCA9IHBhdGhPZihsaXZlVGFiVXJsID8/ICcnKTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCEsIHBnKHtraW5kOiAndmFsaWRhdGUnLCBzZWxlY3RvcnN9KSkgYXMge3ZhbGlkPzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj59O1xuICAgICAgaWYgKHJlcGx5Py52YWxpZCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtzZWwsIG9rXSBvZiBPYmplY3QuZW50cmllcyhyZXBseS52YWxpZCkpIHtcbiAgICAgICAgICBzZWxlY3RvclZhbGlkaXR5LnNldChzZWwsIG9rKTtcbiAgICAgICAgICBpZiAoIW9rKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCAnTm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMgdGhpcyBzZWxlY3Rvci4nKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogdGFiIG5vdCByZWFkeSAqLyB9XG4gIH07XG4gIGNvbnN0IG9uVmFsaWRhdGUgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgc2V0U3RhdHVzKCdSZS1jaGVja2luZ+KApicsIHtraW5kOiAnaW5mbyd9KTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgc2V0U3RhdHVzKCdWYWxpZGF0ZWQnKTtcbiAgfTtcblxuICAvLyAoU2NyZWVuc2hvdCBtYWNoaW5lcnkgcmVtb3ZlZCBhbG9uZ3NpZGUgdGhlIC5wcmV2aWV3IHRpbGUuKVxuXG4gIC8vIOKUgOKUgOKUgCBHaXRIdWIgc3RhcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGZldGNoU3RhcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSAncGluY2hncmFiLmdoLnN0YXJzJztcbiAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBTdG9yZS5nZXQ8e2NvdW50OiBudW1iZXI7IHRzOiBudW1iZXJ9IHwgbnVsbD4oY2FjaGVLZXksIG51bGwpO1xuICAgIGlmIChjYWNoZWQgJiYgRGF0ZS5ub3coKSAtIGNhY2hlZC50cyA8IDNfNjAwXzAwMCkge1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjYWNoZWQuY291bnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3dyYW5uZ2xlL3BpbmNoZ3JhYicsIHtjYWNoZTogJ25vLXN0b3JlJ30pO1xuICAgICAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ3N0YXR1cyAnICsgci5zdGF0dXMpO1xuICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpIGFzIHtzdGFyZ2F6ZXJzX2NvdW50PzogbnVtYmVyfTtcbiAgICAgIGNvbnN0IGNvdW50ID0gai5zdGFyZ2F6ZXJzX2NvdW50ID8/IDA7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50KTtcbiAgICAgIHZvaWQgU3RvcmUuc2V0KGNhY2hlS2V5LCB7Y291bnQsIHRzOiBEYXRlLm5vdygpfSk7XG4gICAgfSBjYXRjaCB7IHN0YXJzRWwudGV4dENvbnRlbnQgPSAnwrcnOyB9XG4gIH07XG4gIGNvbnN0IG9uR2l0aHViID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vd3Jhbm5nbGUvcGluY2hncmFiJztcbiAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsfSk7XG4gICAgZWxzZSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgfTtcblxuICAvLyBSZS1pbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gdGhlIGFjdGl2ZSB0YWIg4oCUIHRoZSByZWNvdmVyeSBwYXRoXG4gIC8vIGZvciBcIkFsdCtDbGljayBzdG9wcGVkIHdvcmtpbmdcIiAoYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gc2NyaXB0KS4gUmVmcmVzaGluZyBhbiBhdHRhY2hlZCB0YWIgcmUtaW5qZWN0cyBhdXRvbWF0aWNhbGx5OyB0aGlzXG4gIC8vIGNvdmVycyBldmVyeSBvdGhlciBjYXNlIHdpdGhvdXQgaHVudGluZyBmb3IgdGhlIHRvb2xiYXIgaWNvbi5cbiAgY29uc3Qgb25SZWF0dGFjaCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7IHNldFN0YXR1cygnUmUtYXR0YWNoIG9ubHkgd29ya3MgaW5zaWRlIHRoZSBleHRlbnNpb24nLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8e29rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAncGctcmVpbmplY3QnfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKCdSZS1hdHRhY2hlZCDigJQgQWx0K0NsaWNrIGlzIGxpdmUnKTtcbiAgICBlbHNlIHNldFN0YXR1cyhgQ291bGRuJ3QgcmUtYXR0YWNoIOKAlCBjbGljayB0aGUgUGluY2hHcmFiIHRvb2xiYXIgYnV0dG9uIG9uIHRoZSBwYWdlJHtyZXBseT8uZXJyb3IgPyBgIMK3ICR7cmVwbHkuZXJyb3J9YCA6ICcnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUXVpZXQtc2F2ZXMgbnVkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHF1aWV0U2F2ZXMgZGVmYXVsdHMgT04gYXMgaW50ZW50LCBidXQgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aVxuICAvLyBwZXJtaXNzaW9uIENocm9tZSBkZW1hbmRzIGNhbiBvbmx5IGJlIHJlcXVlc3RlZCBpbnNpZGUgYSB1c2VyIGdlc3R1cmUuXG4gIC8vIFRoaXMgYmFubmVyIGlzIHRoYXQgZ2VzdHVyZTogc2hvd24gd2hpbGUgdGhlIHByZWYgaXMgb24sIHRoZSBwZXJtaXNzaW9uXG4gIC8vIGlzIG1pc3NpbmcsIGFuZCB0aGUgdXNlciBoYXNuJ3QgZGlzbWlzc2VkIGl0LlxuICBjb25zdCBxdWlldE51ZGdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXF1aWV0LW51ZGdlXScpO1xuICBjb25zdCBtYXliZVNob3dRdWlldE51ZGdlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcXVpZXROdWRnZSB8fCAhaW5FeHRlbnNpb24gfHwgIWNocm9tZS5wZXJtaXNzaW9ucz8uY29udGFpbnMpIHJldHVybjtcbiAgICBpZiAoIXByZWZzLnF1aWV0U2F2ZXMgfHwgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCkgeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IHJldHVybjsgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pO1xuICAgICAgcXVpZXROdWRnZS5oaWRkZW4gPSBncmFudGVkO1xuICAgIH0gY2F0Y2ggeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IH1cbiAgfTtcbiAgY29uc3Qgb25RdWlldEVuYWJsZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgZ3JhbnRlZCA9IGZhbHNlO1xuICAgIHRyeSB7IGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KTsgfVxuICAgIGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy51aSBwZXJtaXNzaW9uIHJlcXVlc3QgZmFpbGVkJywgZXJyKTsgfVxuICAgIHByZWZzLnF1aWV0U2F2ZXMgPSBncmFudGVkO1xuICAgIGlmICghZ3JhbnRlZCkgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7IC8vIGRlY2xpbmVkIG9uY2Ug4oCUIG5ldmVyIG5hZyBhZ2FpblxuICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgaWYgKHF1aWV0TnVkZ2UpIHF1aWV0TnVkZ2UuaGlkZGVuID0gdHJ1ZTtcbiAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1NhdmVzIHN0YXkgdmlzaWJsZSDigJQgcmUtZW5hYmxlIGluIFNldHRpbmdzIOKGkiBDYXB0dXJlJywgZ3JhbnRlZCA/IHt9IDoge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuICBjb25zdCBvblF1aWV0RGlzbWlzcyA9ICgpOiB2b2lkID0+IHtcbiAgICBwcmVmcy5xdWlldFNhdmVzID0gZmFsc2U7XG4gICAgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7XG4gICAgcGVyc2lzdFByZWZzKCk7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICBpZiAocXVpZXROdWRnZSkgcXVpZXROdWRnZS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBzbWFsbCBkb2N1bWVudCBzdW1tYXJpZXMuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBtYXJrZG93bk92ZXJ2aWV3ID0gKGNvbnRlbnQ6IHN0cmluZywga2luZDogTWRLaW5kLCB1c2luZ1RlbXBsYXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQudHJpbSgpID8gY29udGVudC5zcGxpdCgnXFxuJykubGVuZ3RoIDogMDtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFtjb250ZW50XSkuc2l6ZTtcbiAgICBjb25zdCBoZWFkaW5ncyA9IGNvbnRlbnRcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5tYXAoKGxpbmUpID0+IC9eI3sxLDN9XFxzKyguKykkLy5leGVjKGxpbmUudHJpbSgpKT8uWzFdPy50cmltKCkpXG4gICAgICAuZmlsdGVyKChoZWFkaW5nKTogaGVhZGluZyBpcyBzdHJpbmcgPT4gQm9vbGVhbihoZWFkaW5nKSlcbiAgICAgIC5zbGljZSgwLCA0KTtcbiAgICAvLyBXYXJtLCBwbGFpbi1sYW5ndWFnZSBmcmFtaW5nIG9mIHdoYXQgZWFjaCBmaWxlIHRlYWNoZXMgdGhlIGFnZW50LlxuICAgIC8vIERFU0lHTi5tZCBpcyB0aGUgaGVhZGxpbmUgYXJ0aWZhY3Q6IGl0J3Mgd2hlcmUgeW91IGRlc2NyaWJlIHlvdXIgb3duXG4gICAgLy8gYnJhbmQgYW5kIFVJIHRhc3RlIHNvIHRoZSBhZ2VudCBidWlsZHMgaW4gKnlvdXIqIHZvaWNlIHJhdGhlciB0aGFuIGFcbiAgICAvLyBnZW5lcmljIGRlZmF1bHQuIFNLSUxMLm1kIGlzIHRoZSBhZHZhbmNlZCB0cmlhZ2UgZ3VpZGUgZm9yIHJlYWRpbmdcbiAgICAvLyBleHBvcnRzIOKAlCB1c2VmdWwsIGJ1dCBub3Qgd2hlcmUgbW9zdCBwZW9wbGUgc2hvdWxkIHN0YXJ0LlxuICAgIGNvbnN0IGxhYmVsID0ga2luZCA9PT0gJ2Rlc2lnbidcbiAgICAgID8gJ1RlYWNoZXMgeW91ciBhZ2VudCB0byBidWlsZCBVSSBpbiB5b3VyIGJyYW5kJ1xuICAgICAgOiAnQWR2YW5jZWQ6IGhvdyB5b3VyIGFnZW50IHNob3VsZCByZWFkIFBpbmNoR3JhYiBleHBvcnRzJztcbiAgICBjb25zdCBzb3VyY2UgPSB1c2luZ1RlbXBsYXRlXG4gICAgICA/IChraW5kID09PSAnZGVzaWduJyA/ICdTdGFydGVyIHRlbXBsYXRlIOKAlCBtYWtlIGl0IHlvdXJzJyA6ICdCdW5kbGVkIHRlbXBsYXRlJylcbiAgICAgIDogJ0N1c3RvbWl6ZWQnO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gaGVhZGluZ3MubGVuZ3RoID8gaGVhZGluZ3Muam9pbignIC8gJykgOiAnTm8gc2VjdGlvbiBoZWFkaW5ncyBmb3VuZCc7XG4gICAgcmV0dXJuIGAke2xhYmVsfVxcbiR7c291cmNlfSDCtyAke2xpbmVzLnRvTG9jYWxlU3RyaW5nKCl9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JcXG5TZWN0aW9uczogJHtzZWN0aW9uc31gO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1kUHJldmlldyA9IGFzeW5jIChraW5kOiAnZGVzaWduJyB8ICdza2lsbCcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwcmV2aWV3RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtbWQtcHJldmlldz1cIiR7a2luZH1cIl1gKTtcbiAgICBpZiAoIXByZXZpZXdFbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBraW5kID09PSAnZGVzaWduJyA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGtpbmQgPT09ICdkZXNpZ24nID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHByZXZpZXdFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcoY29udGVudCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk1kTW9kYWwgPSBhc3luYyAoa2luZDogTWRLaW5kKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgICBjb25zdCB0aXRsZUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGl0bGVdJykhO1xuICAgIGNvbnN0IHRhRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRleHRhcmVhXScpITtcbiAgICBjb25zdCBzdGF0c0VsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3RhdHNdJykhO1xuICAgIGNvbnN0IGJhbm5lckVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtYmFubmVyXScpITtcbiAgICBjb25zdCBzdW1tYXJ5RWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdW1tYXJ5XScpITtcbiAgICBjb25zdCBzYXZlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc2F2ZV0nKSE7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1yZXNldF0nKSE7XG4gICAgY29uc3QgdXBsb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdXBsb2FkXScpITtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWRvd25sb2FkXScpITtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWNsb3NlXScpITtcblxuICAgIGNvbnN0IGlzRGVzaWduID0ga2luZCA9PT0gJ2Rlc2lnbic7XG4gICAgY29uc3QgaW5pdGlhbCA9IGlzRGVzaWduID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0gaXNEZXNpZ24gPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGlzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnUGluY2hHcmFiIFNLSUxMLm1kJztcbiAgICB0YUVsLnZhbHVlID0gaW5pdGlhbDtcbiAgICBvdmVybGF5LmRhdGFzZXQua2luZCA9IGtpbmQ7XG5cbiAgICBjb25zdCByZWZyZXNoU3RhdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICBzdGF0c0VsLnRleHRDb250ZW50ID0gYCR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgICAgc3VtbWFyeUVsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyh0ZXh0LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIGNvbnN0IGtleSA9IHQuZGF0YXNldC5wcmVmITtcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgLy8gUXVpZXQgc2F2ZXMgbmVlZHMgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aSBwZXJtaXNzaW9uOyByZXF1ZXN0IGl0XG4gICAgICAvLyBpbnNpZGUgdGhpcyB1c2VyIGdlc3R1cmUgYW5kIHJldmVydCB0aGUgY2hlY2tib3ggb24gZGVjbGluZS5cbiAgICAgIGlmIChrZXkgPT09ICdxdWlldFNhdmVzJyAmJiBjaGVja2VkICYmIGluRXh0ZW5zaW9uICYmIGNocm9tZS5wZXJtaXNzaW9ucz8ucmVxdWVzdCkge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGdyYW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0cnkgeyBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3Qoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7IH1cbiAgICAgICAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMudWkgcGVybWlzc2lvbiByZXF1ZXN0IGZhaWxlZCcsIGVycik7IH1cbiAgICAgICAgICBwcmVmcy5xdWlldFNhdmVzID0gZ3JhbnRlZDtcbiAgICAgICAgICAodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gZ3JhbnRlZDtcbiAgICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1Blcm1pc3Npb24gZGVjbGluZWQg4oCUIHNhdmVzIHN0YXkgdmlzaWJsZScsIGdyYW50ZWQgPyB7fSA6IHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IGNoZWNrZWQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodC5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9ICh0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgLy8gVGV4dGFyZWEgaW5wdXRzIGFsc28gZmlyZSBgaW5wdXRgIGV2ZW50cyBhcyB0aGUgdXNlciB0eXBlcyDigJQgd2Ugd2FudCB0b1xuICAvLyBzYXZlIHRob3NlIGluY3JlbWVudGFsbHkgc28gYSBwYW5lbCByZWxvYWQgZG9lc24ndCBsb3NlIGhhbGYtdHlwZWRcbiAgLy8gZW50cmllcy4gYGNoYW5nZWAgb25seSBmaXJlcyBvbiBibHVyIGZvciB0ZXh0YXJlYXMuXG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICh0Py5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9IHQudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBvcGVuRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gZmFsc2U7IHJlbmRlcldzQ29udHJvbHMoKTsgfTtcbiAgY29uc3QgY2xvc2VEcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSB0cnVlOyB9O1xuXG4gIC8vIFJldXNhYmxlIGNyZWF0ZS13b3Jrc3BhY2UgZmxvdzogdmFsaWRhdGVzIHVuaXF1ZW5lc3MsIHBlcnNpc3RzLCBzd2l0Y2hlcy5cbiAgLy8gU2hhcmVkIGJ5IHRoZSBzZXR0aW5ncyBDcmVhdGUgYnV0dG9uIGFuZCB0aGUgaGVhZGVyIGRyb3Bkb3duJ3NcbiAgLy8gXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gYm90aCBwYXRocyBiZWhhdmUgaWRlbnRpY2FsbHkuXG4gIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUZsb3cgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5hbWUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gdHJpbW1lZCkpIHtcbiAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZTogdHJpbW1lZCwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodHJpbW1lZCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHNldFN0YXR1cyhgQ3JlYXRlZCB3b3Jrc3BhY2UgXCIke3RyaW1tZWR9XCJgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICAvLyBJbmxpbmUgXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gdXNlcnMgY2FuIHNwaW4gdXAgYSB3b3Jrc3BhY2VcbiAgICAvLyBzdHJhaWdodCBmcm9tIHRoZSBoZWFkZXIgc3dpdGNoZXIgd2l0aG91dCBvcGVuaW5nIHNldHRpbmdzLiBIYW5kbGVkXG4gICAgLy8gYXMgYSBzZW50aW5lbCB2YWx1ZSBpbiB0aGUgY2hhbmdlIGxpc3RlbmVyIGJlbG93LlxuICAgIGNvbnN0IG5ld09wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdC52YWx1ZSA9ICdfX25ld193b3Jrc3BhY2VfXyc7XG4gICAgbmV3T3B0LnRleHRDb250ZW50ID0gJysgTmV3IHdvcmtzcGFjZSc7XG4gICAgd3NTZWxlY3QuYXBwZW5kKG5ld09wdCk7XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGZvY3VzV29ya3NwYWNlVGFiKHcubmFtZSk7XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBEZWxldGUgd29ya3NwYWNlICR7dy5uYW1lfWApO1xuICAgICAgICBkZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgaWYgKCFjb25maXJtKGBEZWxldGUgd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCIgYW5kIGFsbCBpdHMgY2FwdHVyZXM/YCkpIHJldHVybjtcbiAgICAgICAgICB3b3Jrc3BhY2VzID0gd29ya3NwYWNlcy5maWx0ZXIoKHgpID0+IHgubmFtZSAhPT0gdy5uYW1lKTtcbiAgICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFt3c01zZ0tleSh3Lm5hbWUpLCB3c1Nob3RzS2V5KHcubmFtZSksIHdzU2hvdHNGdWxsS2V5KHcubmFtZSksIHdzU25hcHNob3RzS2V5KHcubmFtZSldKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgICAgICBpZiAoYWN0aXZlV3MgPT09IHcubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3b3Jrc3BhY2VzWzBdIS5uYW1lKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpLmFwcGVuZChkZWwpO1xuICAgICAgfVxuICAgICAgd3NMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuICAgIHJlbmRlcldzU25hcHNob3RIaXN0b3J5KCk7XG4gIH07XG5cbiAgLy8gUmVuZGVyIHRoZSBhY3RpdmUgd29ya3NwYWNlJ3Mgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKSB3aXRoXG4gIC8vIGEgUmVzdG9yZSBhY3Rpb24uIEFwcGVuZGVkIHVuZGVyIHRoZSB3b3Jrc3BhY2UgbGlzdCBpbiBTZXR0aW5ncy5cbiAgY29uc3QgcmVuZGVyV3NTbmFwc2hvdEhpc3RvcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS13cy1zbmFwc2hvdHNdJyk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAoIXdzU25hcHNob3RzLmxlbmd0aCkge1xuICAgICAgaG9zdC5oaWRkZW4gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBob3N0LmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgU25hcHNob3QgaGlzdG9yeSDCtyAke3dzU25hcHNob3RzLmxlbmd0aH1gO1xuICAgIGhlYWQuZGF0YXNldC50aXAgPSAnUmVzdG9yYWJsZSBzbmFwc2hvdHMgc2F2ZWQgYmVmb3JlIGVhY2ggQ2xlYXItYWxsJztcbiAgICBob3N0LmFwcGVuZChoZWFkKTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdWwuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbGlzdCc7XG4gICAgZm9yIChjb25zdCBzbmFwIG9mIHdzU25hcHNob3RzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3Mtc25hcC1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBgJHtuZXcgRGF0ZShzbmFwLnRzKS50b0xvY2FsZVN0cmluZygpfSDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWwgwrcgJHtzbmFwLmNvbW1lbnRzfSBjbXRgO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgY29uc3QgcmVzdG9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcmVzdG9yZS50eXBlID0gJ2J1dHRvbic7XG4gICAgICByZXN0b3JlLmNsYXNzTmFtZSA9ICd3cy1zbmFwLXJlc3RvcmUnO1xuICAgICAgcmVzdG9yZS50ZXh0Q29udGVudCA9ICdSZXN0b3JlJztcbiAgICAgIHJlc3RvcmUuZGF0YXNldC50aXAgPSAnUmVzdG9yZSB0aGlzIHNuYXBzaG90IGludG8gdGhlIGN1cnJlbnQgd29ya3NwYWNlIChjdXJyZW50IHN0YXRlIGlzIGtlcHQgb24gdGhlIHVuZG8gc3RhY2spJztcbiAgICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoICYmICFjb25maXJtKCdSZXN0b3JlIHRoaXMgc25hcHNob3Q/IFRoZSBjdXJyZW50IGNhcHR1cmVzIHdpbGwgYmUgcmVwbGFjZWQgKHVuZG9hYmxlKS4nKSkgcmV0dXJuO1xuICAgICAgICByZXN0b3JlV29ya3NwYWNlU25hcHNob3Qoc25hcC5pZCk7XG4gICAgICB9KTtcbiAgICAgIGxpLmFwcGVuZChyZXN0b3JlKTtcbiAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyIHdzLXNuYXAtZGVsJztcbiAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyBzbmFwc2hvdCc7XG4gICAgICBkZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBzbmFwc2hvdCcpO1xuICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEyKTtcbiAgICAgIGRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGRlbGV0ZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgfVxuICAgIGhvc3QuYXBwZW5kKHVsKTtcbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ19fbmV3X3dvcmtzcGFjZV9fJykge1xuICAgICAgLy8gUmVzZXQgdGhlIHNlbGVjdCBiYWNrIHRvIHRoZSBhY3RpdmUgd29ya3NwYWNlIGZpcnN0IHNvIHRoZSBzZW50aW5lbFxuICAgICAgLy8gbmV2ZXIgc3RpY2tzIGFzIHRoZSBkaXNwbGF5ZWQgdmFsdWUgaWYgdGhlIHByb21wdCBpcyBjYW5jZWxsZWQuXG4gICAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgICBjb25zdCBuYW1lID0gKHdpbmRvdy5wcm9tcHQoJ05ldyB3b3Jrc3BhY2UgbmFtZScpID8/ICcnKS50cmltKCk7XG4gICAgICBpZiAobmFtZSkgYXdhaXQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh2YWx1ZSk7XG4gICAgZm9jdXNXb3Jrc3BhY2VUYWIodmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdTZW5kIHRvIEFnZW50IOKAlCBleHBvcnQgLnRhci56c3QgKyBjb3B5IHRoZSBhZ2VudCBwcm9tcHQnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdjb3B5LWFnZW50LXByb21wdCcsIGxhYmVsOiAnQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCAobGFzdCBleHBvcnQpJywgcnVuOiAoKSA9PiB7XG4gICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICghbGFzdEV4cG9ydC5hZ2VudFByb21wdCkgeyBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIFNlbmQgdG8gQWdlbnQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBvayA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICAgICAgc2V0U3RhdHVzKG9rID8gJ0FnZW50IHByb21wdCBjb3BpZWQnIDogJ0NsaXBib2FyZCB1bmF2YWlsYWJsZScsIG9rID8ge30gOiB7a2luZDogJ3dhcm4nfSk7XG4gICAgICB9KSgpO1xuICAgIH19LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3ZhbGlkYXRlJywgbGFiZWw6ICdSZS1jaGVjayBzZWxlY3RvcnMnLCBydW46ICgpID0+IHZvaWQgb25WYWxpZGF0ZSgpfSxcbiAgICB7aWQ6ICdyZWF0dGFjaCcsIGxhYmVsOiAnUmUtYXR0YWNoIHRvIHBhZ2UgKGZpeCBBbHQrQ2xpY2spJywgcnVuOiAoKSA9PiB2b2lkIG9uUmVhdHRhY2goKX0sXG4gICAge2lkOiAncmVsb2FkLWV4dGVuc2lvbicsIGxhYmVsOiAnUmVsb2FkIHRoZSBQaW5jaEdyYWIgZXh0ZW5zaW9uIChsYXN0IHJlc29ydCknLCBydW46ICgpID0+IHsgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUucnVudGltZS5yZWxvYWQoKTsgfX0sXG4gICAge2lkOiAnY2xlYXInLCBsYWJlbDogJ0NsZWFyIGFsbCBjYXB0dXJlcycsIHJ1bjogb25DbGVhcn0sXG4gICAge2lkOiAnc2V0dGluZ3MnLCBsYWJlbDogJ09wZW4gc2V0dGluZ3MnLCBydW46IG9wZW5EcmF3ZXJ9LFxuICAgIHtpZDogJ2dpdGh1YicsIGxhYmVsOiAnT3BlbiBHaXRIdWIgcmVwbycsIHJ1bjogb25HaXRodWJ9LFxuICAgIHtpZDogJ21hbnVhbCcsIGxhYmVsOiAnTWFudWFsIGNhcHR1cmUgKHN0YXJ0IGNvbXBvc2VyIHdpdGggYD4gc2VsZWN0b3JgKScsIHJ1bjogKCkgPT4geyBjb21wb3Nlci52YWx1ZSA9ICc+ICc7IGNvbXBvc2VyLmZvY3VzKCk7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgfX0sXG4gICAge2lkOiAndW5kbycsIGxhYmVsOiAnVW5kbycsIHJ1bjogdW5kb30sXG4gICAge2lkOiAncmVkbycsIGxhYmVsOiAnUmVkbycsIHJ1bjogcmVkb30sXG4gIF07XG4gIGNvbnN0IHJlbmRlclBhbGV0dGUgPSAocSA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgY29uc3QgcWwgPSBxLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAuLi5DT01NQU5EUy5maWx0ZXIoKGMpID0+ICFxbCB8fCBjLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKVxuICAgICAgICAubWFwKChjKSA9PiAoe2xhYmVsOiBjLmxhYmVsLCBwcmV2aWV3OiAnY29tbWFuZCcsIHJ1bjogYy5ydW59KSksXG4gICAgICAuLi5tZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKCFxbCB8fFxuICAgICAgICAobS5lbnRyeS5zZWxlY3RvciArICcgJyArIChtLmVudHJ5LnRleHQgPz8gJycpICsgJyAnICsgKG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyAnJykpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKSlcbiAgICAgICAgLnNsaWNlKDAsIDMwKVxuICAgICAgICAubWFwKChtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmIgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihtLmlkKTtcbiAgICAgICAgICBjb25zdCBwcmV2aWV3ID0gKG0uZW50cnkudGV4dCA/PyBmYlswXSA/PyBtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgODApO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYWJlbDogYCMke20uZW50cnkubn0gJHttLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3Rvcn1gLFxuICAgICAgICAgICAgcHJldmlldyxcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9zZVBhbGV0dGUoKTtcbiAgICAgICAgICAgICAgc2Nyb2xsTWVzc2FnZUludG9WaWV3KG0uaWQpO1xuICAgICAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3J9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdCwgaSkgPT4ge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGJsLmNsYXNzTmFtZSA9ICdsYWJlbCc7XG4gICAgICBsYmwuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQubGFiZWwsIHEpO1xuICAgICAgbGkuYXBwZW5kKGxibCk7XG4gICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcC5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICBwLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LnByZXZpZXcgPz8gJycsIHEpO1xuICAgICAgbGkuYXBwZW5kKHApO1xuICAgICAgY29uc3Qga2JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAga2JkLmNsYXNzTmFtZSA9ICdrYmQnO1xuICAgICAga2JkLnRleHRDb250ZW50ID0gJ+KGtSc7XG4gICAgICBsaS5hcHBlbmQoa2JkKTtcbiAgICAgIGlmIChpID09PSAwKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpdC5ydW4oKTsgfSk7XG4gICAgICBwYWxldHRlTGlzdC5hcHBlbmQobGkpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvcGVuUGFsZXR0ZSA9IChwcmVzZXQgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGUuaGlkZGVuID0gZmFsc2U7XG4gICAgcGFsZXR0ZUlucHV0LnZhbHVlID0gcHJlc2V0O1xuICAgIHJlbmRlclBhbGV0dGUocHJlc2V0KTtcbiAgICBwYWxldHRlSW5wdXQuZm9jdXMoKTtcbiAgICBwYWxldHRlSW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UocHJlc2V0Lmxlbmd0aCwgcHJlc2V0Lmxlbmd0aCk7XG4gIH07XG4gIGNvbnN0IGNsb3NlUGFsZXR0ZSA9ICgpOiB2b2lkID0+IHsgcGFsZXR0ZS5oaWRkZW4gPSB0cnVlOyB9O1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiByZW5kZXJQYWxldHRlKHBhbGV0dGVJbnB1dC52YWx1ZSkpO1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4ucGFsZXR0ZUxpc3QuY2hpbGRyZW5dO1xuICAgIGxldCBhY3RpdmUgPSBpdGVtcy5maW5kSW5kZXgoKGxpKSA9PiBsaS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKTtcbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWluKGl0ZW1zLmxlbmd0aCAtIDEsIGFjdGl2ZSArIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWF4KDAsIGFjdGl2ZSAtIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IChpdGVtc1thY3RpdmVdIGFzIEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkKT8uY2xpY2soKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIGNsb3NlUGFsZXR0ZSgpO1xuICB9KTtcbiAgcGFsZXR0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGlmIChlLnRhcmdldCA9PT0gcGFsZXR0ZSkgY2xvc2VQYWxldHRlKCk7IH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBDb250ZXh0IHN0cmlwIChob3ZlciBoZWxwKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIG9sZCBmbG9hdGluZyBjdXJzb3IgdG9vbHRpcDogW2RhdGEtdGlwXSBob3ZlciB0ZXh0IGlzXG4gIC8vIHdyaXR0ZW4gaW50byB0aGUgZml4ZWQgc3RyaXAgdW5kZXIgdGhlIGhlYWRlciwgc28gaGVscCBuZXZlciBvY2NsdWRlc1xuICAvLyBvdGhlciBjb250cm9scyBhbmQgY2FuJ3Qgc3RyYW5kIG1pZC1zY3JlZW4gdGhyb3VnaCByZS1yZW5kZXJzLlxuICBjb25zdCBUSVBfSURMRSA9ICdBbHQrQ2xpY2sgb24gdGhlIHBhZ2UgdG8gY2FwdHVyZSDCtyBob3ZlciBhbnkgY29udHJvbCBmb3IgaGVscCc7XG4gIGxldCB0aXBGb3I6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8vIFRoZSBzZXR0aW5ncyBkcmF3ZXIgb3ZlcmxheXMgdGhlIHN0cmlwIChwb3NpdGlvbjphYnNvbHV0ZSwgaW5zZXQgMCksIHNvXG4gIC8vIGhvdmVyIGhlbHAgZm9yIGRyYXdlciBjb250cm9scyBsYW5kcyBpbiBhIHNlY29uZCBzaW5rIGluc2lkZSB0aGVcbiAgLy8gZHJhd2VyIGhlYWRlci4gQm90aCBzaW5rcyBhbHdheXMgcmVjZWl2ZSB0aGUgc2FtZSB0ZXh0LlxuICBjb25zdCBkcmF3ZXJUaXBFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmF3ZXItdGlwXScpO1xuICBjb25zdCBzaG93VGlwID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXAnKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnO1xuICAgIGlmIChkcmF3ZXJUaXBFbCkgeyBkcmF3ZXJUaXBFbC50ZXh0Q29udGVudCA9IHRleHQ7IGRyYXdlclRpcEVsLmRhdGFzZXQuc2hvd24gPSAndHJ1ZSc7IH1cbiAgfTtcbiAgY29uc3QgaGlkZVRpcCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aXBGb3IgPSBudWxsO1xuICAgIHRvb2x0aXBFbC50ZXh0Q29udGVudCA9IFRJUF9JRExFO1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ2ZhbHNlJztcbiAgICBpZiAoZHJhd2VyVGlwRWwpIHsgZHJhd2VyVGlwRWwudGV4dENvbnRlbnQgPSAnJzsgZHJhd2VyVGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7IH1cbiAgfTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICghdCB8fCB0ID09PSB0aXBGb3IpIHJldHVybjtcbiAgICB0aXBGb3IgPSB0O1xuICAgIHNob3dUaXAodCk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCAmJiB0ID09PSB0aXBGb3IgJiYgIXQuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlVGlwKCk7XG4gIH0pO1xuICAvLyBSZS1yZW5kZXJzIGNhbiBkcm9wIHRoZSBob3ZlcmVkIG5vZGUgd2l0aG91dCBldmVyIGZpcmluZyBtb3VzZW91dFxuICAvLyAocmVuZGVyKCkgcmVzZXRzIGxpc3QuaW5uZXJIVE1MLCBjb25maXJtIGJ1dHRvbnMgcmVwbGFjZVdpdGgpOyByZXNldFxuICAvLyB0aGUgc3RyaXAgdG8gaXRzIGlkbGUgaGludCB3aGVuIHRoYXQgaGFwcGVucy5cbiAgY29uc3QgdGlwR3VhcmQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgaWYgKHRpcEZvciAmJiAhdGlwRm9yLmlzQ29ubmVjdGVkKSBoaWRlVGlwKCk7XG4gIH0pO1xuICB0aXBHdWFyZC5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWV9KTtcblxuICAvLyDilIDilIDilIAgU3RhdCBkcmlsbGRvd25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBlbmRIZWFkaW5nID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpO1xuICAgIGgudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGgpO1xuICB9O1xuICBjb25zdCBhcHBlbmRCb2xkID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJyk7XG4gICAgYi50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoYik7XG4gIH07XG4gIGNvbnN0IGFwcGVuZENvZGUgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgY29kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcbiAgICBjb2RlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChjb2RlKTtcbiAgfTtcbiAgY29uc3QgYnVpbGREcmlsbGRvd24gPSAoa2luZDogc3RyaW5nKTogRG9jdW1lbnRGcmFnbWVudCA9PiB7XG4gICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBpZiAoa2luZCA9PT0gJ3NlbGVjdG9ycycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1NlbGVjdG9ycyBieSBxdWFsaXR5Jyk7XG4gICAgICBjb25zdCBidWNrZXRzID0ge2lkOiAwLCB0ZXN0aWQ6IDAsIGNsYXNzOiAwLCBudGg6IDAsIHRhZzogMH07XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgICBpZiAoZS50ZXN0SWQpIGJ1Y2tldHMudGVzdGlkKys7XG4gICAgICAgIGVsc2UgaWYgKGUuaWQgfHwgL14jW1xcdy1dKyQvLnRlc3QoZS5zZWxlY3RvcikpIGJ1Y2tldHMuaWQrKztcbiAgICAgICAgZWxzZSBpZiAoKGUuc2VsZWN0b3IgPz8gJycpLmluY2x1ZGVzKCc6bnRoLW9mLXR5cGUnKSkgYnVja2V0cy5udGgrKztcbiAgICAgICAgZWxzZSBpZiAoL1xcLi8udGVzdChlLnNlbGVjdG9yID8/ICcnKSkgYnVja2V0cy5jbGFzcysrO1xuICAgICAgICBlbHNlIGJ1Y2tldHMudGFnKys7XG4gICAgICB9XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgbGFiZWxdIG9mIFtcbiAgICAgICAgW2J1Y2tldHMudGVzdGlkLCAnIGRhdGEtdGVzdGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmlkLCAnIHN0YWJsZSBpZCddLFxuICAgICAgICBbYnVja2V0cy5jbGFzcywgJyBjbGFzcy1iYXNlZCddLFxuICAgICAgICBbYnVja2V0cy5udGgsICcgbnRoLW9mLXR5cGUnXSxcbiAgICAgICAgW2J1Y2tldHMudGFnLCAnIHRhZy1vbmx5J10sXG4gICAgICBdIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgIGxpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnc3RhbGUnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTdGFsZSBjYXB0dXJlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc3RhbGUgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKTtcbiAgICAgIGlmICghc3RhbGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGkudGV4dENvbnRlbnQgPSAnTm9uZSAtIGV2ZXJ5dGhpbmcgcmVzb2x2ZXMuJztcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH0gZWxzZSBmb3IgKGNvbnN0IG0gb2Ygc3RhbGUpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBsaS5hcHBlbmQoJyAnKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgKG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDUwKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnY29tbWVudHMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdDb21tZW50cycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3QgZmJzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBGZWVkYmFja01lc3NhZ2UgPT4gbS50eXBlID09PSAnZmVlZGJhY2snKTtcbiAgICAgIGNvbnN0IHRvdGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHRvdGFsLmFwcGVuZCgnVG90YWwgd29yZHM6ICcpO1xuICAgICAgYXBwZW5kQm9sZCh0b3RhbCwgU3RyaW5nKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyB3b3JkQ291bnQobS50ZXh0KSwgMCkpKTtcbiAgICAgIHVsLmFwcGVuZCh0b3RhbCk7XG4gICAgICBjb25zdCBhdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgYXZnLmFwcGVuZCgnQXZlcmFnZSBsZW5ndGg6ICcpO1xuICAgICAgYXBwZW5kQm9sZChhdmcsIFN0cmluZyhmYnMubGVuZ3RoID8gTWF0aC5yb3VuZChmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgbS50ZXh0Lmxlbmd0aCwgMCkgLyBmYnMubGVuZ3RoKSA6IDApKTtcbiAgICAgIGF2Zy5hcHBlbmQoJyBjaGFycycpO1xuICAgICAgdWwuYXBwZW5kKGF2Zyk7XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAncGFnZXMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdQYWdlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNlZW4uc2V0KG0uZW50cnkudXJsLCAoc2Vlbi5nZXQobS5lbnRyeS51cmwpID8/IDApICsgMSk7XG4gICAgICBmb3IgKGNvbnN0IFt1cmwsIG5dIG9mIHNlZW4pIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcobikpO1xuICAgICAgICBsaS5hcHBlbmQoYCBzZWxlY3RvciR7biA9PT0gMSA/ICcnIDogJ3MnfSDCtyBgKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgcGF0aE9mKHVybCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZztcbiAgfTtcbiAgY29uc3Qgc2hvd0RyaWxsZG93biA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qga2luZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdCcpO1xuICAgIGlmICgha2luZCkgcmV0dXJuO1xuICAgIGRyaWxsZG93bkVsLnJlcGxhY2VDaGlsZHJlbihidWlsZERyaWxsZG93bihraW5kKSk7XG4gICAgZHJpbGxkb3duRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkUiA9IGRyaWxsZG93bkVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDY7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIGRSLndpZHRoIC8gMjtcbiAgICBpZiAodG9wICsgZFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSBkUi5oZWlnaHQgLSA2O1xuICAgIGlmIChsZWZ0IDwgNikgbGVmdCA9IDY7XG4gICAgaWYgKGxlZnQgKyBkUi53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNikgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZFIud2lkdGggLSA2O1xuICAgIGRyaWxsZG93bkVsLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7dG9wfXB4O2xlZnQ6JHtsZWZ0fXB4O2A7XG4gIH07XG4gIGNvbnN0IGhpZGVEcmlsbGRvd24gPSAoKTogdm9pZCA9PiB7IGRyaWxsZG93bkVsLmhpZGRlbiA9IHRydWU7IH07XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcuc3RhdFtkYXRhLXN0YXRdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0KSBzaG93RHJpbGxkb3duKHQpO1xuICB9KTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgaWYgKCFzdGF0c0VsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZURyaWxsZG93bigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0LWJ1dHRvbiBob3ZlciDihpIgb3V0bGluZS1tdWx0aSBvbiBwYWdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBmb3IgKGNvbnN0IGJ0biBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1leHBvcnQtaG92ZXJdJykpIHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpJywgc2VsZWN0b3JzfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QuYWRkKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgQ2xpY2sgZGVsZWdhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXIgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICBpZiAoIXRyaWdnZXIpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aW9uID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJyk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ3NlbmQnOiBzZW5kRmVlZGJhY2soKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1hbGwnOiB2b2lkIG9uQ29weUFsbCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQnOiB2b2lkIG9uRXhwb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydC16aXAnOiB2b2lkIG9uRXhwb3J0WmlwKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktcGF0aCc6IHZvaWQgb25Db3B5UGF0aCgpOyByZXR1cm47XG4gICAgICBjYXNlICdpbXBvcnQnOiBvbkltcG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHZvaWQgb25WYWxpZGF0ZSgpOyByZXR1cm47XG4gICAgICBjYXNlICdyZWF0dGFjaCc6IHZvaWQgb25SZWF0dGFjaCgpOyByZXR1cm47XG4gICAgICBjYXNlICdxdWlldC1lbmFibGUnOiB2b2lkIG9uUXVpZXRFbmFibGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncXVpZXQtZGlzbWlzcyc6IG9uUXVpZXREaXNtaXNzKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NsZWFyJzogb25DbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdnaXRodWInOiBvbkdpdGh1YigpOyByZXR1cm47XG4gICAgICBjYXNlICdzZXR0aW5ncyc6IG9wZW5EcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY2xvc2UtZHJhd2VyJzogY2xvc2VEcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndW5kbyc6IHVuZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVkbyc6IHJlZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZGVzaWduLWVkaXQnOiB7IHZvaWQgb3Blbk1kTW9kYWwoJ2Rlc2lnbicpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ3NraWxsLWVkaXQnOiAgeyB2b2lkIG9wZW5NZE1vZGFsKCdza2lsbCcpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi10ZW1wbGF0ZS1kb3dubG9hZCc6IHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIEFsd2F5cyB0aGUgUExBSU4gU1RPQ0sgdGVtcGxhdGUg4oCUIHRoZSBsb2NhbC4qIGRldi1vdmVycmlkZVxuICAgICAgICAgIC8vIHByZWZlcmVuY2UgY29udGFtaW5hdGVkIGRlZmF1bHRzIHdpdGggYSBkZXZlbG9wZXIncyBvd24gYnJhbmQuXG4gICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnREVTSUdOLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdERVNJR04ubWQgdGVtcGxhdGUgZG93bmxvYWRlZCDigJQgZmlsbCBpbiBhbmQgcmUtdXBsb2FkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuZGVzaWduTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbGwtbWQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJyk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgdGVtcGxhdGUgZG93bmxvYWRlZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuc2tpbGxNZCA9ICcnO1xuICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdTS0lMTC5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnd3MtY3JlYXRlJzoge1xuICAgICAgICBjb25zdCBuYW1lID0gKHdzTmFtZS52YWx1ZSA/PyAnJykudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcbiAgICAgICAgdm9pZCBjcmVhdGVXb3Jrc3BhY2VGbG93KG5hbWUpLnRoZW4oKG9rKSA9PiB7IGlmIChvaykgd3NOYW1lLnZhbHVlID0gJyc7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEdsb2JhbCBrZXlib2FyZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0ID0gKHRhcmdldDogRXZlbnRUYXJnZXQgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgZWwgPSB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/IHRhcmdldCA6IG51bGw7XG4gICAgcmV0dXJuIEJvb2xlYW4oZWw/LmNsb3Nlc3QoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBbY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXSwgW2NvbnRlbnRlZGl0YWJsZT1cIlwiXScpKTtcbiAgfTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBjb25zdCBlZGl0YWJsZVRhcmdldCA9IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldChlLnRhcmdldCk7XG4gICAgaWYgKGVkaXRhYmxlVGFyZ2V0ICYmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBbJ2EnLCAneicsICd5J10uaW5jbHVkZXMoZS5rZXkudG9Mb3dlckNhc2UoKSkpIHJldHVybjtcbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICdrJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHBhbGV0dGUuaGlkZGVuID8gb3BlblBhbGV0dGUoKSA6IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAvLyBDdHJsK0YgKGFuZCBDbWQrRikgb3BlbnMgdGhlIGluLWxpc3QgdmlzdWFsIGZpbmQg4oCUIGRpc3RpbmN0IGZyb20gdGhlXG4gICAgLy8gQ21kK0sgY29tbWFuZCBwYWxldHRlLiBPdmVycmlkZSB0aGUgYnJvd3NlcidzIG5hdGl2ZSBmaW5kIHNvIHRoZSBwYW5lbFxuICAgIC8vIG93bnMgdGhlIGdlc3R1cmUuXG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnZicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBvcGVuRmluZCgpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHVuZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiAoZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3knIHx8IChlLnNoaWZ0S2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JykpKSB7IGUucHJldmVudERlZmF1bHQoKTsgcmVkbygpOyByZXR1cm47IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBjb25zdCBtZE1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgICAgaWYgKG1kTW9kYWwgJiYgIW1kTW9kYWwuaGlkZGVuKSB7IGNsb3NlTWRNb2RhbCgpOyByZXR1cm47IH1cbiAgICAgIGlmICghcGFsZXR0ZS5oaWRkZW4pIHsgY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFkcmF3ZXIuaGlkZGVuKSB7IGNsb3NlRHJhd2VyKCk7IHJldHVybjsgfVxuICAgICAgaWYgKGZpbmRCYXIgJiYgIWZpbmRCYXIuaGlkZGVuKSB7IGNsb3NlRmluZCgpOyByZXR1cm47IH1cbiAgICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSB7IHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9KTsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyBzZXRTdGF0dXMoJ1BlbmRpbmcgZ3JvdXAgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSBjbG9zZUZpbmQoKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnQWx0JyB8fCBlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiB0cnVlfSk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgaWYgKCFlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBhbmVsUmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgcGVuZGluZ1BhbmVsTWVzc2FnZXM6IGFueVtdID0gW107XG4gIGNvbnN0IHJlY2VpdmVQYW5lbE1lc3NhZ2UgPSAobTogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYW5lbFJlYWR5KSB7XG4gICAgICBwZW5kaW5nUGFuZWxNZXNzYWdlcy5wdXNoKG0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbkNzTWVzc2FnZShtKTtcbiAgfTtcbiAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgLy8gU2luZ2xlIGNoYW5uZWw6IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS4gVGhlIGJhY2tncm91bmQgdXNlZCB0byByZWxheVxuICAgIC8vIHRocm91Z2ggYSBwb3J0IHRvbywgYnV0IGNvbnRlbnQtc2NyaXB0IGJyb2FkY2FzdHMgYWxyZWFkeSByZWFjaCB0aGVcbiAgICAvLyBzaWRlIHBhbmVsIGRpcmVjdGx5IOKAlCByZWxheWluZyBwcm9kdWNlZCBkdXBsaWNhdGUgZGlzcGF0Y2hlcy5cbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG06IGFueSkgPT4gcmVjZWl2ZVBhbmVsTWVzc2FnZShtKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uQWN0aXZhdGVkPy5hZGRMaXN0ZW5lcigoKSA9PiB2b2lkIHJ1blZhbGlkYXRpb24oKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uVXBkYXRlZD8uYWRkTGlzdGVuZXIoKF9pZCwgaW5mbykgPT4geyBpZiAoaW5mbz8uc3RhdHVzID09PSAnY29tcGxldGUnKSB2b2lkIHJ1blZhbGlkYXRpb24oKTsgfSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uUmVtb3ZlZD8uYWRkTGlzdGVuZXIoKGNsb3NlZElkKSA9PiB7XG4gICAgICBjb25zdCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy50YWJJZCA9PT0gY2xvc2VkSWQpO1xuICAgICAgaWYgKHdzKSB7IHdzLnRhYklkID0gdW5kZWZpbmVkOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZW5kZXJXc0NvbnRyb2xzKCk7IH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOnRvLXBhbmVsJywgKGUpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UoKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbCkpO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFRlc3QgQVBJIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpbnN0YWxsVGVzdEFwaSA9ICgpOiB2b2lkID0+IHtcbiAgICAod2luZG93IGFzIGFueSkuX19waW5jaGdyYWJfcGFuZWwgPSB7XG4gICAgICBwdXNoTWVzc2FnZTogKG06IFBhbmVsTWVzc2FnZSkgPT4geyBtZXNzYWdlcy5wdXNoKG0pOyBwZXJzaXN0KCk7IHJlbmRlcigpOyB9LFxuICAgICAgb25DYXB0dXJlLCBvbkhvdmVyLCBvbkhvdmVyRW5kLCBvblBhZ2VTbmFwc2hvdCxcbiAgICAgIGdldE1lc3NhZ2VzOiAoKSA9PiBbLi4ubWVzc2FnZXNdLFxuICAgICAgZ2V0UHJlZnM6ICgpID0+ICh7Li4ucHJlZnN9KSxcbiAgICAgIHNldFByZWZzOiAocDogUGFydGlhbDxQcmVmcz4pID0+IHsgcHJlZnMgPSB7Li4ucHJlZnMsIC4uLnB9OyBwZXJzaXN0UHJlZnMoKTsgYXBwbHlQcmVmc1RvVUkoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBidWlsZEpzb25sLFxuICAgICAgYnVpbGRFeHBvcnRGaWxlbmFtZSwgYnVpbGRNYW5pZmVzdCwgZG9taW5hbnRIb3N0U2x1ZywgZGlzdGluY3RIb3N0cyxcbiAgICAgIGR1Y2tEYlNuaXBwZXQsIG9uRXhwb3J0WmlwLCBvbkV4cG9ydCwgb25Db3B5UGF0aCxcbiAgICAgIGRlbm9ybWFsaXplRW50cnksXG4gICAgICBnZXRMYXN0RXhwb3J0OiAoKSA9PiAoey4uLmxhc3RFeHBvcnR9KSxcbiAgICAgIGdldExhc3RBZ2VudFByb21wdDogKCkgPT4gbGFzdEV4cG9ydC5hZ2VudFByb21wdCxcbiAgICAgIC8vIFRlc3QgaGF0Y2g6IHNlZWQgZXZlcnkgc2VsZWN0b3IgY2FwdHVyZSB3aXRoIHRoZSBzYW1lIGZ1bGwgUE5HIGRhdGFVUkxcbiAgICAgIC8vIHNvIHRoZSBhcmNoaXZlIGV4cG9ydCBoYXMgc29tZXRoaW5nIHRvIGJ1bmRsZS4gUmVhbCBjYXB0dXJlcyBwb3B1bGF0ZVxuICAgICAgLy8gc2hvdHNGdWxsIGZyb20gdGhlIGJnIGBydW5TaG90YCByZXBseTsgdGVzdHMgY2FuJ3QgZWFzaWx5IHJ1biBhXG4gICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiwgc28gdGhpcyBsZXRzIHVzIHByb3ZlIHRoZSBQTkcgYnVuZGxpbmcgcGF0aC5cbiAgICAgIF9fc2VlZFNob3RzRnVsbDogKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzaG90c0Z1bGwuc2V0KG0uZW50cnkuc2VsZWN0b3IsIGRhdGFVcmwpO1xuICAgICAgICB9XG4gICAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICAgIH0sXG4gICAgICBfX2dldFNob3RzRnVsbDogKCkgPT4gc2hvdHNGdWxsLFxuICAgICAgLy8gRnJlZXplIHRoZSBleHBvcnQgY2xvY2sgKElTTyBzdHJpbmcpIHNvIHRlc3RzIGNhbiBhc3NlcnQgdHdvXG4gICAgICAvLyBleHBvcnRzIG9mIGlkZW50aWNhbCBjb250ZW50IGFyZSBieXRlLWlkZW50aWNhbC4gUGFzcyBudWxsIHRvXG4gICAgICAvLyByZXN0b3JlIHdhbGwtY2xvY2sgYmVoYXZpb3IuXG4gICAgICBfX3NldEV4cG9ydENsb2NrOiAoaXNvOiBzdHJpbmcgfCBudWxsKSA9PiB7IGV4cG9ydENsb2NrT3ZlcnJpZGUgPSBpc287IH0sXG4gICAgICAvLyBzZXRTZWFyY2ggZHJpdmVzIHRoZSBDdHJsK0YgdmlzdWFsLWZpbmQgcGF0aCAodGhlIGhlYWRlciBzZWFyY2ggbm93XG4gICAgICAvLyBvcGVucyB0aGUgY29tbWFuZCBwYWxldHRlIGluc3RlYWQgb2YgZmlsdGVyaW5nKS5cbiAgICAgIHNldFNlYXJjaDogKHE6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAocSkgeyBvcGVuRmluZCgpOyBpZiAoZmluZElucHV0KSBmaW5kSW5wdXQudmFsdWUgPSBxOyBhcHBseUZpbmQocSk7IH1cbiAgICAgICAgZWxzZSBjbG9zZUZpbmQoKTtcbiAgICAgIH0sXG4gICAgICBvcGVuRmluZCwgY2xvc2VGaW5kLFxuICAgICAgaXNGaW5kT3BlbjogKCkgPT4gQm9vbGVhbihmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbiksXG4gICAgICBzZXRWYWxpZGl0eTogKHNlbDogc3RyaW5nLCBvazogYm9vbGVhbiB8ICdkaWZmLXBhZ2UnLCByZWFzb24/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChyZWFzb24pIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsIHJlYXNvbik7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyOiAoKSA9PiB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgICAgICBsaXZlVGFiUGF0aCA9IG51bGw7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgICAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgICAgIHNob3RzLmNsZWFyKCk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb3BlblBhbGV0dGUsIGNsb3NlUGFsZXR0ZSwgb3BlbkRyYXdlciwgY2xvc2VEcmF3ZXIsXG4gICAgICBzZW5kRmVlZGJhY2ssIHVuZG8sIHJlZG8sXG4gICAgICBsaXN0V29ya3NwYWNlczogKCkgPT4gWy4uLndvcmtzcGFjZXNdLFxuICAgICAgYWN0aXZlV29ya3NwYWNlOiAoKSA9PiBhY3RpdmVXcyxcbiAgICAgIHNldFN0aWNreVRUTDogKG1zOiBudW1iZXIpID0+IHsgU1RJQ0tZX1RUTF9NUyA9IG1zOyB9LFxuICAgICAgZm9yY2VTdGlja3lFeHBpcmU6ICgpID0+IHsgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTsgcGFuZWxIb3ZlcmVkID0gZmFsc2U7IGFybVN0aWNreUV4cGlyeSgpOyB9LFxuICAgICAgc2V0TGFzdEFjdGl2ZSxcbiAgICAgIGNyZWF0ZVdvcmtzcGFjZTogKG46IHN0cmluZykgPT4geyB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IG4sIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IHJldHVybiBsb2FkV29ya3NwYWNlKG4pLnRoZW4ocmVuZGVyKTsgfSxcbiAgICAgIHN3aXRjaFdvcmtzcGFjZTogKG46IHN0cmluZykgPT4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlciksXG4gICAgICBjbGVhckFsbDogb25DbGVhcixcbiAgICAgIGxpc3RTbmFwc2hvdHM6ICgpID0+IHdzU25hcHNob3RzLm1hcCgocykgPT4gKHtpZDogcy5pZCwgdHM6IHMudHMsIHNlbGVjdG9yczogcy5zZWxlY3RvcnMsIGNvbW1lbnRzOiBzLmNvbW1lbnRzfSkpLFxuICAgICAgcmVzdG9yZVNuYXBzaG90OiAoaWQ6IHN0cmluZykgPT4gcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90KGlkKSxcbiAgICB9O1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCb290IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9hZEFsbCgpO1xuICAgIHBhbmVsUmVhZHkgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgbSBvZiBwZW5kaW5nUGFuZWxNZXNzYWdlcy5zcGxpY2UoMCkpIG9uQ3NNZXNzYWdlKG0pO1xuICAgIHJlbmRlcigpO1xuICAgIGluc3RhbGxUZXN0QXBpKCk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gICAgdm9pZCBtYXliZVNob3dRdWlldE51ZGdlKCk7XG4gICAgdm9pZCBmZXRjaFN0YXJzKCk7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAncmVhZHknLCB7aW5FeHRlbnNpb24sIHdzOiBhY3RpdmVXcywgbWVzc2FnZXM6IG1lc3NhZ2VzLmxlbmd0aH0pO1xuICB9KSgpO1xufSkoKTtcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7O0VBeW5CQSxJQUFJLGNBQWM7QUFBQSxFQUNsQixJQUFNLFNBQVMsTUFBYztBQUFBLElBQzNCLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsYUFBYSxTQUFTLEVBQUU7QUFBQSxJQUN4RSxJQUFJO0FBQUEsTUFDRixNQUFNLFFBQVEsSUFBSSxXQUFXLENBQUM7QUFBQSxNQUM5QixXQUFXLE9BQU8sZ0JBQWdCLEtBQUs7QUFBQSxNQUN2QyxPQUFPLEdBQUcsVUFBVSxNQUFNLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUFBLE1BQ3pGLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBO0FBQUEsRUFLSixJQUFNLEtBQUssQ0FBMkIsYUFDMUMsRUFBQyxNQUFNLE1BQU0sT0FBTyxPQUFPLE1BQU0sUUFBTzs7O0VDam9CM0MsSUFBTSxRQUFnQztBQUFBLElBQ3BDLGlCQUFpQjtBQUFBLElBQ2pCLGdCQUFnQjtBQUFBLElBQ2hCLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLE1BQU07QUFBQSxJQUNOLEdBQUc7QUFBQSxJQUNILE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLG9CQUFvQjtBQUFBLElBQ3BCLGlCQUFpQjtBQUFBLElBQ2pCLHVCQUF1QjtBQUFBLElBQ3ZCLGdCQUFnQjtBQUFBLElBQ2hCLGNBQWM7QUFBQSxJQUNkLGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLE9BQU87QUFBQSxJQUVQLE9BQU87QUFBQSxJQUNQLGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLE9BQU87QUFBQSxJQUNQLGdCQUFnQjtBQUFBLElBQ2hCLE1BQU07QUFBQSxJQUVOLFFBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLE1BQU07QUFBQSxJQUdOLGFBQWE7QUFBQSxJQUViLE9BQU87QUFBQSxJQUVQLFNBQVM7QUFBQSxJQUVULE1BQU07QUFBQSxJQUVOLFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFFQSxJQUFNLE9BQU8sQ0FBQyxNQUFjLFNBQzFCLGtEQUFrRCxpQkFBaUIsK0hBQStIO0FBQUEsRUFFN0wsSUFBTSxXQUFXO0FBQUEsSUFDdEIsS0FBSyxDQUFDLFVBQTBCLFFBQVE7QUFBQSxJQUN4QyxXQUFXLENBQUMsTUFBYyxPQUFPLE9BQWU7QUFBQSxNQUM5QyxNQUFNLE9BQU8sTUFBTTtBQUFBLE1BQ25CLElBQUksQ0FBQyxNQUFNO0FBQUEsUUFDVCxRQUFRLEtBQUsseUJBQXlCLElBQUk7QUFBQSxRQUMxQyxPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsT0FBTyxLQUFLLE1BQU0sSUFBSTtBQUFBO0FBQUEsSUFFeEIsT0FBTyxDQUFDLElBQW9CLE1BQWMsU0FBd0I7QUFBQSxNQUNoRSxJQUFJO0FBQUEsUUFBSSxHQUFHLFlBQVksU0FBUyxVQUFVLE1BQU0sSUFBSTtBQUFBO0FBQUEsRUFFeEQ7QUFBQSxFQUlBLElBQUksT0FBTyxlQUFlLGFBQWE7QUFBQSxJQUNwQyxXQUFtQixXQUFXO0FBQUEsRUFDakM7OztFQ3JFQSxJQUFNLE1BQU0sSUFBSTtBQUFBLEVBRWhCLElBQU0sYUFBYSxDQUFDLEtBQWlCLFFBQWdCLE9BQWUsV0FBeUI7QUFBQSxJQUUzRixJQUFJLElBQUksTUFBTSxTQUFTLENBQUM7QUFBQSxJQUN4QixJQUFJLEVBQUUsU0FBUyxTQUFTLEdBQUcsR0FBRztBQUFBLElBQzlCLFNBQVMsSUFBSSxFQUFHLElBQUksU0FBUyxHQUFHO0FBQUEsTUFBSyxJQUFJLFNBQVMsS0FBSyxFQUFFLFdBQVcsQ0FBQztBQUFBLElBQ3JFLElBQUksU0FBUyxTQUFTLEtBQUs7QUFBQTtBQUFBLEVBRzdCLElBQU0sYUFBYSxDQUFDLEtBQWlCLFFBQWdCLEtBQWEsV0FBeUI7QUFBQSxJQUN6RixNQUFNLFFBQVEsSUFBSSxPQUFPLEdBQUc7QUFBQSxJQUM1QixNQUFNLE1BQU0sS0FBSyxJQUFJLE1BQU0sUUFBUSxNQUFNO0FBQUEsSUFDekMsU0FBUyxJQUFJLEVBQUcsSUFBSSxLQUFLO0FBQUEsTUFBSyxJQUFJLFNBQVMsS0FBSyxNQUFNO0FBQUE7QUFBQSxFQUd4RCxJQUFNLGlCQUFpQixDQUFDLFdBQStCO0FBQUEsSUFHckQsSUFBSSxNQUFNO0FBQUEsSUFDVixTQUFTLElBQUksRUFBRyxJQUFJLEtBQUssS0FBSztBQUFBLE1BQzVCLElBQUksS0FBSyxPQUFPLElBQUk7QUFBQSxRQUFLLE9BQU87QUFBQSxNQUMzQjtBQUFBLGVBQU8sT0FBTyxNQUFNO0FBQUEsSUFDM0I7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBLEVBWVQsSUFBTSxlQUFlLENBQUMsU0FBaUQ7QUFBQSxJQUNyRSxJQUFJLEtBQUssVUFBVTtBQUFBLE1BQUssT0FBTyxFQUFDLE1BQU0sTUFBTSxRQUFRLEdBQUU7QUFBQSxJQUN0RCxJQUFJLE1BQU07QUFBQSxJQUNWLFNBQVMsSUFBSSxLQUFLLFFBQVEsR0FBRyxFQUFHLE1BQU0sSUFBSSxJQUFJLEtBQUssUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHO0FBQUEsTUFDdEUsSUFBSSxLQUFLLE9BQU8sS0FBSyxTQUFTLElBQUksS0FBSztBQUFBLFFBQUssTUFBTTtBQUFBLElBQ3BEO0FBQUEsSUFDQSxJQUFJLFFBQVEsSUFBSTtBQUFBLE1BQ2QsTUFBTSxJQUFJLE1BQU0sOERBQThELE1BQU07QUFBQSxJQUN0RjtBQUFBLElBQ0EsT0FBTyxFQUFDLFFBQVEsS0FBSyxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sS0FBSyxNQUFNLE1BQU0sQ0FBQyxFQUFDO0FBQUE7QUFBQSxFQUd4RCxJQUFNLFdBQVcsQ0FBQyxZQUFvQztBQUFBLElBQzNELE1BQU0sU0FBdUIsQ0FBQztBQUFBLElBQzlCLE1BQU0sU0FBUyxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksSUFBSTtBQUFBLElBQzNDLFdBQVcsU0FBUyxTQUFTO0FBQUEsTUFDM0IsTUFBTSxPQUFPLE9BQU8sTUFBTSxTQUFTLFdBQVcsSUFBSSxPQUFPLE1BQU0sSUFBSSxJQUFJLE1BQU07QUFBQSxNQUM3RSxRQUFPLE1BQU0sV0FBVSxhQUFhLE1BQU0sSUFBSTtBQUFBLE1BQzlDLE1BQU0sU0FBUyxJQUFJLFdBQVcsR0FBRztBQUFBLE1BQ2pDLFdBQVcsUUFBUSxHQUFHLE1BQU0sR0FBRztBQUFBLE1BQy9CLFdBQVcsUUFBUSxLQUFLLEtBQU8sQ0FBQztBQUFBLE1BQ2hDLFdBQVcsUUFBUSxLQUFLLEdBQUcsQ0FBQztBQUFBLE1BQzVCLFdBQVcsUUFBUSxLQUFLLEdBQUcsQ0FBQztBQUFBLE1BQzVCLFdBQVcsUUFBUSxLQUFLLEtBQUssUUFBUSxFQUFFO0FBQUEsTUFDdkMsV0FBVyxRQUFRLEtBQUssTUFBTSxTQUFTLFFBQVEsRUFBRTtBQUFBLE1BQ2pELFNBQVMsSUFBSSxJQUFLLElBQUksS0FBSztBQUFBLFFBQUssT0FBTyxLQUFLO0FBQUEsTUFDNUMsT0FBTyxPQUFPO0FBQUEsTUFDZCxXQUFXLFFBQVEsS0FBSyxTQUFTLENBQUM7QUFBQSxNQUNsQyxXQUFXLFFBQVEsS0FBSyxNQUFNLENBQUM7QUFBQSxNQUMvQixJQUFJO0FBQUEsUUFBUSxXQUFXLFFBQVEsS0FBSyxRQUFRLEdBQUc7QUFBQSxNQUcvQyxNQUFNLFdBQVcsZUFBZSxNQUFNO0FBQUEsTUFDdEMsV0FBVyxRQUFRLEtBQUssVUFBVSxDQUFDO0FBQUEsTUFFbkMsT0FBTyxLQUFLLE1BQU07QUFBQSxNQUNsQixPQUFPLEtBQUssSUFBSTtBQUFBLE1BQ2hCLE1BQU0sT0FBTyxNQUFPLEtBQUssU0FBUyxPQUFRO0FBQUEsTUFDMUMsSUFBSTtBQUFBLFFBQUssT0FBTyxLQUFLLElBQUksV0FBVyxHQUFHLENBQUM7QUFBQSxJQUMxQztBQUFBLElBRUEsT0FBTyxLQUFLLElBQUksV0FBVyxJQUFJLENBQUM7QUFBQSxJQUVoQyxJQUFJLFFBQVE7QUFBQSxJQUNaLFdBQVcsS0FBSztBQUFBLE1BQVEsU0FBUyxFQUFFO0FBQUEsSUFDbkMsTUFBTSxNQUFNLElBQUksV0FBVyxLQUFLO0FBQUEsSUFDaEMsSUFBSSxTQUFTO0FBQUEsSUFDYixXQUFXLEtBQUssUUFBUTtBQUFBLE1BQUUsSUFBSSxJQUFJLEdBQUcsTUFBTTtBQUFBLE1BQUcsVUFBVSxFQUFFO0FBQUEsSUFBUTtBQUFBLElBQ2xFLE9BQU87QUFBQTtBQUFBLEVBMEJULElBQU0scUJBQXFCLE1BQU07QUFBQSxFQUUxQixJQUFNLFdBQVcsQ0FBQyxTQUFpQztBQUFBLElBQ3hELE1BQU0sU0FBdUIsQ0FBQztBQUFBLElBQzlCLElBQUksTUFBTTtBQUFBLElBQ1YsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLFdBQVcsR0FBRztBQUFBLE1BQzdDLE1BQU0sWUFBWSxLQUFLLFNBQVM7QUFBQSxNQUNoQyxNQUFNLFlBQVksS0FBSyxJQUFJLFdBQVcsa0JBQWtCO0FBQUEsTUFDeEQsTUFBTSxTQUFTLE1BQU0sYUFBYSxLQUFLLFNBQVMsSUFBSTtBQUFBLE1BQ3BELE1BQU0sWUFBWSxTQUFVLEtBQUssSUFBTSxhQUFhO0FBQUEsTUFDcEQsTUFBTSxjQUFjLElBQUksV0FBVztBQUFBLFFBQ2pDLFlBQVk7QUFBQSxRQUNYLGNBQWMsSUFBSztBQUFBLFFBQ25CLGNBQWMsS0FBTTtBQUFBLE1BQ3ZCLENBQUM7QUFBQSxNQUNELE9BQU8sS0FBSyxXQUFXO0FBQUEsTUFDdkIsSUFBSSxZQUFZO0FBQUEsUUFBRyxPQUFPLEtBQUssS0FBSyxTQUFTLEtBQUssTUFBTSxTQUFTLENBQUM7QUFBQSxNQUNsRSxPQUFPO0FBQUEsTUFDUCxJQUFJLEtBQUssV0FBVztBQUFBLFFBQUc7QUFBQSxJQUN6QjtBQUFBLElBQ0EsTUFBTSxNQUFNLEtBQUs7QUFBQSxJQUNqQixNQUFNLE1BQU07QUFBQSxJQUNaLE1BQU0sT0FBTyxJQUFJLFdBQVc7QUFBQSxNQUMxQjtBQUFBLE1BQU07QUFBQSxNQUFNO0FBQUEsTUFBTTtBQUFBLE1BQ2xCO0FBQUEsTUFDQSxNQUFNO0FBQUEsTUFBTyxRQUFRLElBQUs7QUFBQSxNQUFPLFFBQVEsS0FBTTtBQUFBLE1BQU8sUUFBUSxLQUFNO0FBQUEsSUFDdEUsQ0FBQztBQUFBLElBQ0QsSUFBSSxRQUFRLEtBQUs7QUFBQSxJQUNqQixXQUFXLEtBQUs7QUFBQSxNQUFRLFNBQVMsRUFBRTtBQUFBLElBQ25DLE1BQU0sTUFBTSxJQUFJLFdBQVcsS0FBSztBQUFBLElBQ2hDLElBQUksTUFBTTtBQUFBLElBQ1YsSUFBSSxJQUFJLE1BQU0sR0FBRztBQUFBLElBQUcsT0FBTyxLQUFLO0FBQUEsSUFDaEMsV0FBVyxLQUFLLFFBQVE7QUFBQSxNQUFFLElBQUksSUFBSSxHQUFHLEdBQUc7QUFBQSxNQUFHLE9BQU8sRUFBRTtBQUFBLElBQVE7QUFBQSxJQUM1RCxPQUFPO0FBQUE7RUFvRFQsSUFBTSxNQUFNLElBQUk7OztFQzFNVCxJQUFNLG9CQUFvQixFQUFDLGdCQUFpQixNQUFLLGVBQWdCLE1BQUssYUFBYyxNQUFLLFlBQWEsS0FBSTs7O0VDQzFHLElBQU0seUJBQXlCO0FBQUEsRUFFL0IsSUFBTSxzQkFBMEM7QUFBQSxJQUNyRDtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElB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QUUsU0FBUSxFQUFFO0FBQUEsUUFDaEgsaUJBQWlCLENBQUMsT0FBZSx5QkFBeUIsRUFBRTtBQUFBLE1BQzlEO0FBQUE7QUFBQSxLQUlJLFlBQVk7QUFBQSxNQUNoQixNQUFNLFFBQVE7QUFBQSxNQUNkLGFBQWE7QUFBQSxNQUNiLFdBQVcsS0FBSyxxQkFBcUIsT0FBTyxDQUFDO0FBQUEsUUFBRyxZQUFZLENBQUM7QUFBQSxNQUM3RCxPQUFPO0FBQUEsTUFDUCxlQUFlO0FBQUEsTUFDVixjQUFjO0FBQUEsTUFDZCxvQkFBb0I7QUFBQSxNQUNwQixXQUFXO0FBQUEsTUFDaEIsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsUUFBUSxJQUFJLEtBQUssU0FBUyxFQUFDLGFBQWEsSUFBSSxVQUFVLFVBQVUsU0FBUyxPQUFNLENBQUM7QUFBQSxPQUMvRTtBQUFBLEtBQ0Y7IiwKICAiZGVidWdJZCI6ICI1RTZGRUM0RjMzQjU2MUQyNjQ3NTZFMjE2NDc1NkUyMSIsCiAgIm5hbWVzIjogW10KfQ==
