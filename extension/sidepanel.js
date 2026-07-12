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

//# debugId=40853C6544999B4564756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvYnVuZGxlZC1za2lsbHMuZ2VuLnRzIiwgInNyYy9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICAvLyBVc2VyIGV4cGxpY2l0bHkgZGV0YWNoZWQgdGhpcyBjb21tZW50IGZyb20gYW55IHNlbGVjdG9yLiBXaXRob3V0IHRoZVxuICAvLyBmbGFnLCBhZGphY2VuY3kgdG8gdGhlIHByZWNlZGluZyBzZWxlY3RvciB3b3VsZCBzaWxlbnRseSByZS1hZG9wdCB0aGVcbiAgLy8gY29tbWVudCBhdCByZW5kZXIvZXhwb3J0IHRpbWUuXG4gIGRldGFjaGVkPzogYm9vbGVhbjtcbiAgdGFncz86IHN0cmluZ1tdO1xuICAvLyBTZXZlcml0eSAoYG5vdGVgIC8gYGZpeGAgLyBgYmxvY2tgKSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSBpblxuICAvLyAyMDI2LTA1LiBUaGUgZmllbGQgaXMgcmV0YWluZWQgb24gdGhlIHR5cGUgYXMgYHVua25vd25gIHNvXG4gIC8vIHRvbGVyYW50IHJlYWRlcnMgKGBkZW5vcm1hbGl6ZUVudHJ5YCkgZG9uJ3QgZHJvcCB0aGUgdmFsdWUgZnJvbVxuICAvLyBsZWdhY3kgSlNPTkwgZXhwb3J0czsgbmV3IHNlc3Npb25zIG5ldmVyIHNldCBpdC5cbiAgc2V2ZXJpdHk/OiAnbm90ZScgfCAnZml4JyB8ICdibG9jayc7XG59O1xuXG5leHBvcnQgdHlwZSBQYWdlTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3BhZ2UnO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHZpZXdwb3J0PzogVmlld3BvcnQ7XG4gIHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBSb3V0ZSBpZGVudGl0eSBiZXlvbmQgdGhlIFVSTC4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIG9mIHBhdGhuYW1lXG4gIC8vIC8gcXVlcnkgLyBoYXNoICsgYSBndWVzcyBhdCB0aGVcbiAgLy8gYWN0aXZlIHJvdXRlTmFtZSAoYD9yb3V0ZT1zZXR0aW5nc2Agb3IgYCMvdXNlcnMvNDJgIHN0eWxlKS5cbiAgcm91dGU/OiB7XG4gICAgcGF0aG5hbWU/OiBzdHJpbmc7XG4gICAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGhhc2g/OiBzdHJpbmc7XG4gICAgcm91dGVOYW1lPzogc3RyaW5nO1xuICAgIHJvdXRlUGFyYW0/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFJlZGFjdGVkIHN0YXRlIHNuYXBzaG90LiBTdXJmYWNlcyB0aGUgU0hBUEUgb2Ygc3RhdGUgdGhhdCBwcm9kdWNlZFxuICAvLyB0aGUgcGFnZSAoc3RvcmFnZSBrZXlzLCBjb29raWUgbmFtZXMsIGZlYXR1cmUgZmxhZ3MpIHdpdGhvdXRcbiAgLy8gbGVha2luZyB2YWx1ZXMuIExldHMgYSBkb3duc3RyZWFtIGFnZW50IHJlcHJvZHVjZSBieSBzZXR0aW5nIHVwIHRoZVxuICAvLyBzYW1lIGtleXMgd2l0aCB0aGVpciBvd24gZGF0YS5cbiAgc3RhdGU/OiB7XG4gICAgc3RvcmFnZUtleXM/OiBzdHJpbmdbXTtcbiAgICBzZXNzaW9uS2V5cz86IHN0cmluZ1tdO1xuICAgIGNvb2tpZU5hbWVzPzogc3RyaW5nW107XG4gICAgZmVhdHVyZUZsYWdzPzogc3RyaW5nO1xuICB9O1xuICAvLyBTZXNzaW9uIHV1aWQuIFN0YWJsZSBwZXIgd29ya3NwYWNlLWJvb3Qg4oCUIHNlbGVjdG9yIGVudHJpZXMgcmVmZXJlbmNlXG4gIC8vIGl0IHZpYSBgRW50cnkuc2Vzc2lvbklkYCBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzIHRvIHRoZWlyXG4gIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJpc29uLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbE1lc3NhZ2UgPSBTZWxlY3Rvck1lc3NhZ2UgfCBGZWVkYmFja01lc3NhZ2UgfCBQYWdlTWVzc2FnZTtcblxuLy8gLS0tLS0tLS0tLSBJUEMgcGF5bG9hZHMgKENTIOKGlCBQYW5lbCDihpQgQmFja2dyb3VuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIENzVG9QYW5lbCA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlJzsgZW50cnk6IEVudHJ5OyBwYWdlOiBQYWdlQ29udGV4dDsgZ3JvdXBlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdob3Zlcic7IHNlbGVjdG9yOiBzdHJpbmc7IHRhZzogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByZWN0OiBSZWN0fVxuICB8IHtraW5kOiAnaG92ZXItZW5kJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIC8vIEV4cG9ydC10aW1lIHJlcXVlc3QgZm9yIHRoZSBmdWxsIHNlcmlhbGl6ZWQgcGFnZSAob3B0LWluIHByZWZcbiAgLy8gaW5jbHVkZVBhZ2VIVE1MKS4gUmVwbGllZCB3aXRoIHtvaywgdXJsLCB0aXRsZSwgaHRtbH07IG5ldmVyIHBlcnNpc3RlZFxuICAvLyB0byBjaHJvbWUuc3RvcmFnZSDigJQgdGhlIHBheWxvYWQgZ29lcyBzdHJhaWdodCBpbnRvIHRoZSB0YXIuXG4gIHwge2tpbmQ6ICdwYWdlLWh0bWwnfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gRnVsbC1wYWdlIChiZXN0LWVmZm9ydCkgc2NyZWVuc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gVW5saWtlXG4gIC8vIHNob3QtcGFnZSB0aGlzIGRvZXMgTk9UIHdyaXRlIGEgZmlsZSBvciBidWlsZCBhIHRodW1ibmFpbCDigJQgaXQganVzdFxuICAvLyByZXR1cm5zIHRoZSBzdGl0Y2hlZCBQTkcgYXMgYSBkYXRhIFVSTCBzbyB0aGUgY2FsbGVyIChjb250ZW50IHNjcmlwdCkgY2FuXG4gIC8vIGF0dGFjaCBpdCB0byBhIFBhZ2VTbmFwc2hvdC4gYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydFxuICAvLyBjb3VsZCBiZSBjYXB0dXJlZC5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gKHJlKWluamVjdCB0aGUgY29udGVudCBzY3JpcHQg4oCUIHRoZSBmaXhcbiAgLy8gZm9yIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIGNvbnRlbnQgc2NyaXB0LiBEZWZhdWx0cyB0byB0aGUgYWN0aXZlIHRhYi5cbiAgfCB7a2luZDogJ3BnLXJlaW5qZWN0JzsgdGFiSWQ/OiBudW1iZXJ9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuLy8gUmVwbHkgdG8gYSBgcGFnZS1zbmFwc2hvdC1zaG90YCByZXF1ZXN0LiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwgb2Zcbi8vIHRoZSAoYmVzdC1lZmZvcnQpIGZ1bGwgcGFnZTsgYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCB3YXNcbi8vIGNhcHR1cmVkLiBgb2s6ZmFsc2VgIGNhcnJpZXMgYW4gZXJyb3Igc3RyaW5nLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBzY3JlZW5zaG90Pzogc3RyaW5nO1xuICBwYXJ0aWFsPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBTYXZlUmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGhcbiAgYWJzUGF0aD86IHN0cmluZzsgIC8vIE9TLWFic29sdXRlIHBhdGhcbiAgY29weVBhdGg/OiBzdHJpbmc7IC8vIFVJLWZhY2luZyBwYXRoXG4gIHRlbXBQYXRoPzogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBCZ1JlcGx5ID1cbiAgfCB7ZGF0YVVybDogc3RyaW5nfVxuICB8IHtmb3VuZDogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyfVxuICB8IHt0YWJzOiBBcnJheTx7aWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9Pn1cbiAgfCB7ZXJyb3I6IHN0cmluZ31cbiAgfCBTaG90UmVwbHlcbiAgfCBTYXZlUmVwbHlcbiAgfCBQYWdlU25hcHNob3RSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5OiBmaXJzdCAxNiBoZXggY2hhcnMgb2YgYSBTSEEtMjU2IG92ZXIgdGhlXG4gIC8vIHNsaW0gcm93cyArIHNjcmVlbnNob3QgbmFtZXMuIFN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cyBvZiB0aGUgc2FtZVxuICAvLyBjb250ZW50LCBzbyBkb3duc3RyZWFtIHN0YXRlIChlLmcuIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyovYnVuZGxlcy8pXG4gIC8vIGtleXMgb24gaXQgd2l0aG91dCBkdXBsaWNhdGluZyB3b3JrLlxuICBidW5kbGVJZD86IHN0cmluZztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gICAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gICAgcGFnZXNIdG1sPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBXaGVyZSB0aGUgYWdlbnQgZG9jdHJpbmUgbGl2ZXMgaW5zaWRlIHRoZSBhcmNoaXZlIChTZW5kLXRvLUFnZW50XG4gIC8vIHByb3RvY29sKS4gQWJzZW50IG9uIHBsYWluIEpTT05MIGV4cG9ydHMuXG4gIGFnZW50UHJvdG9jb2w/OiB7YXJjaGl2ZVBhdGg6IHN0cmluZ307XG4gIC8vIFZlbmRvcmVkIHNraWxsIGRvY3VtZW50cyBidW5kbGVkIGludG8gdGhpcyBhcmNoaXZlIChzdWJzZXQgb2YgdGhlXG4gIC8vIHJpY2hlciBza2lsbHMtaW5kZXguanNvbiBhdCB0aGUgYXJjaGl2ZSByb290KS4gYGludm9jYXRpb25gIGNhcnJpZXMgYVxuICAvLyBwbHVnaW4tY29tbWFuZCBmb3JtIGZvciBoYXJuZXNzZXMgdGhhdCBzdXBwb3J0IGl0LlxuICBidW5kbGVkU2tpbGxzPzogQXJyYXk8e2lkOiBzdHJpbmc7IGtpbmQ6ICdza2lsbCcgfCAncmVmZXJlbmNlJzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgaW52b2NhdGlvbj86IHN0cmluZ30+O1xuICAvLyBGdWxsLXBhZ2UgSFRNTCBkb2N1bWVudHMgYnVuZGxlZCB1bmRlciBwYWdlcy8gKG9wdC1pbiBwcmVmKS5cbiAgcGFnZXNIdG1sPzogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47XG4gIC8vIFNlbGYtcm9hc3Qgc2VjdGlvbi4gVGhlIGV4cG9ydCBzdXJmYWNlcyBpdHMgb3duIGdhcHMgc28gYVxuICAvLyBkb3duc3RyZWFtIExMTSBkb2Vzbid0IGhhdmUgdG8gZGlzY292ZXJcbiAgLy8gdGhlbS4gRW1wdHkgYXJyYXkgPSBjbGVhbiBleHBvcnQuIEVhY2ggZGlhZ25vc3RpYyBoYXMgYSBzdGFibGVcbiAgLy8gYGNvZGVgIHNvIHJlY2VpdmVycyBjYW4gZGlzcGF0Y2ggb24gaXQgcHJvZ3JhbW1hdGljYWxseS5cbiAgZXhwb3J0RGlhZ25vc3RpY3M/OiBFeHBvcnREaWFnbm9zdGljW107XG4gIC8vIEFyY2hpdmUgaW50ZWdyaXR5LiBSZWNlaXZlcnMgY2FuIGRldGVjdCBwYXJ0aWFsIGV4dHJhY3Rpb24gL1xuICAvLyBjb3JydXB0aW9uIHdpdGggYSBzaW5nbGUgY2hlY2suXG4gIGFyY2hpdmVJbnRlZ3JpdHk/OiB7XG4gICAgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+O1xuICB9O1xuICAvLyBCdWlsZC9zb3VyY2UgaWRlbnRpdHkuIENhcHR1cmVkIGZyb20gYVxuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluIGRpcnR5OnRydWVcIj5gXG4gIC8vIHRhZyB0aGUgdXNlcidzIGFwcCBpbmplY3RzLCBwbHVzIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB0ZWxsIGlmIHRoZSBleHBvcnQgaXMgc3RhbGUgcmVsYXRpdmUgdG8gdGhlIHJlcG8uXG4gIC8vIE9taXR0ZWQgZW50aXJlbHkgd2hlbiBubyBidWlsZCBpbmZvIGlzIGF2YWlsYWJsZS5cbiAgYnVpbGQ/OiB7XG4gICAgZXh0ZW5zaW9uVmVyc2lvbj86IHN0cmluZztcbiAgICBjb21taXQ/OiBzdHJpbmc7XG4gICAgYnJhbmNoPzogc3RyaW5nO1xuICAgIGRpcnR5PzogYm9vbGVhbjtcbiAgICBkZXBsb3lCdWlsZD86IHN0cmluZztcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIEV4cG9ydERpYWdub3N0aWMgPSB7XG4gIHNldmVyaXR5OiAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nO1xuICBjb2RlOiBzdHJpbmc7XG4gIGRldGFpbD86IHN0cmluZztcbiAgdWlkPzogc3RyaW5nO1xufTtcblxuLy8gRW52ZWxvcGUgbWFya2VyIHVzZWQgb24gZXZlcnkgUGluY2hHcmFiIG1lc3NhZ2UgKHNvIG90aGVyIGV4dGVuc2lvblxuLy8gbWVzc2FnZXMgdHJhdmVsaW5nIHRocm91Z2ggdGhlIHNhbWUgY2hhbm5lbCBhcmUgaWdub3JlZCkuIF9fbWlkIGlzIGFcbi8vIHBlci1kaXNwYXRjaCB1bmlxdWUgc3RhbXAgc28gcmVjZWl2ZXJzIGNhbiBkZWR1cGUgYSBtZXNzYWdlIHRoYXQgYXJyaXZlc1xuLy8gdGhyb3VnaCBtb3JlIHRoYW4gb25lIGNoYW5uZWwgKGUuZy4gcnVudGltZS5vbk1lc3NhZ2UgKyBhIHBvcnQgcmVsYXkpLlxuZXhwb3J0IHR5cGUgUGdFbnZlbG9wZTxUPiA9IFQgJiB7X19wZzogdHJ1ZTsgX19taWQ6IHN0cmluZ307XG5cbmV4cG9ydCB0eXBlIEFueU1lc3NhZ2UgPSBDc1RvUGFuZWwgfCBQYW5lbFRvQ3MgfCBQYW5lbFRvQmc7XG5cbmxldCBfbWlkQ291bnRlciA9IDA7XG5jb25zdCBuZXdNaWQgPSAoKTogc3RyaW5nID0+IHtcbiAgY29uc3QgcHJlZml4ID0gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7KCsrX21pZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB0cnkge1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke0FycmF5LmZyb20oYnl0ZXMpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxufTtcblxuLy8gSGVscGVyOiBzdGFtcCBhIHBheWxvYWQgd2l0aCB0aGUgZW52ZWxvcGUgbWFya2VyICsgdW5pcXVlIG1lc3NhZ2UgaWQuXG5leHBvcnQgY29uc3QgcGcgPSA8VCBleHRlbmRzIHtraW5kOiBzdHJpbmd9PihwYXlsb2FkOiBUKTogUGdFbnZlbG9wZTxUPiA9PlxuICAoe19fcGc6IHRydWUsIF9fbWlkOiBuZXdNaWQoKSwgLi4ucGF5bG9hZH0pIGFzIFBnRW52ZWxvcGU8VD47XG4iLAogICAgIi8vIFN1YnNldCBvZiBsdWNpZGUuZGV2IGljb25zIGlubGluZWQgYXMgU1ZHIGlubmVyLW1hcmt1cC5cbi8vIEVhY2ggZW50cnkgaXMgdGhlIGJvZHkgb2YgPHN2ZyAuLi4gPiAuLi4gPC9zdmc+OyBzdmdTdHJpbmcoKSB3cmFwcyBpdC5cbi8vIFNpemVzIGRlZmF1bHQgdG8gMTY7IG92ZXJyaWRlIHdpdGggdGhlIHNpemUgYXJndW1lbnQuXG4vL1xuLy8gTUlUIOKAlCBodHRwczovL2dpdGh1Yi5jb20vbHVjaWRlLWljb25zL2x1Y2lkZVxuXG5jb25zdCBJQ09OUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2NoZXZyb24tcmlnaHQnOiAnPHBhdGggZD1cIm05IDE4IDYtNi02LTZcIi8+JyxcbiAgJ2NoZXZyb24tZG93bic6ICc8cGF0aCBkPVwibTYgOSA2IDYgNi02XCIvPicsXG4gIGNvcHk6ICc8cmVjdCB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB4PVwiOFwiIHk9XCI4XCIgcng9XCIyXCIgcnk9XCIyXCIvPjxwYXRoIGQ9XCJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyXCIvPicsXG4gIHBlbmNpbDogJzxwYXRoIGQ9XCJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3elwiLz48cGF0aCBkPVwibTE1IDUgNCA0XCIvPicsXG4gICd0cmFzaC0yJzogJzxwYXRoIGQ9XCJNMyA2aDE4XCIvPjxwYXRoIGQ9XCJNMTkgNnYxNGMwIDEtMSAyLTIgMkg3Yy0xIDAtMi0xLTItMlY2XCIvPjxwYXRoIGQ9XCJNOCA2VjRjMC0xIDEtMiAyLTJoNGMxIDAgMiAxIDIgMnYyXCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjEwXCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxNFwiIHgyPVwiMTRcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz4nLFxuICBwbHVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPjxwYXRoIGQ9XCJNMTIgNXYxNFwiLz4nLFxuICB4OiAnPHBhdGggZD1cIk0xOCA2IDYgMThcIi8+PHBhdGggZD1cIm02IDYgMTIgMTJcIi8+JyxcbiAgbWludXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+JyxcbiAgc2VhcmNoOiAnPGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI4XCIvPjxwYXRoIGQ9XCJtMjEgMjEtNC4zLTQuM1wiLz4nLFxuICBkb3dubG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiNyAxMCAxMiAxNSAxNyAxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMTVcIiB5Mj1cIjNcIi8+JyxcbiAgdXBsb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNyA4IDEyIDMgNyA4XCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIzXCIgeTI9XCIxNVwiLz4nLFxuICBnaXRodWI6ICc8cGF0aCBkPVwiTTE1IDIydi00YTQuOCA0LjggMCAwIDAtMS0zLjVjMyAwIDYtMiA2LTUuNS4wOC0xLjI1LS4yNy0yLjQ4LTEtMy41LjI4LTEuMTUuMjgtMi4zNSAwLTMuNSAwIDAtMSAwLTMgMS41LTIuNjQtLjUtNS4zNi0uNS04IDBDNiAyIDUgMiA1IDJjLS4zIDEuMTUtLjMgMi4zNSAwIDMuNUE1LjQgNS40IDAgMCAwIDQgOWMwIDMuNSAzIDUuNSA2IDUuNS0uMzkuNDktLjY4IDEuMDUtLjg1IDEuNjUtLjE3LjYtLjIyIDEuMjMtLjE1IDEuODV2NFwiLz48cGF0aCBkPVwiTTkgMThjLTQuNTEgMi01LTItNy0yXCIvPicsXG4gIHN0YXI6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIvPicsXG4gICdjaXJjbGUtZG90JzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBjcm9zc2hhaXI6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMjJcIiB4Mj1cIjE4XCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCI2XCIgeDI9XCIyXCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjZcIiB5Mj1cIjJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjIyXCIgeTI9XCIxOFwiLz4nLFxuICB0YXJnZXQ6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNlwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjJcIi8+JyxcbiAgJ3BhbmVsLWxlZnQtY2xvc2UnOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiLz48cGF0aCBkPVwiTTkgM3YxOFwiLz48cGF0aCBkPVwibTE2IDE1LTMtMyAzLTNcIi8+JyxcbiAgJ2V4dGVybmFsLWxpbmsnOiAnPHBhdGggZD1cIk0xNSAzaDZ2NlwiLz48cGF0aCBkPVwiTTEwIDE0IDIxIDNcIi8+PHBhdGggZD1cIk0xOCAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmg2XCIvPicsXG4gICdtZXNzYWdlLXNxdWFyZS1wbHVzJzogJzxwYXRoIGQ9XCJNMjEgMTVhMiAyIDAgMCAxLTIgMkg3bC00IDRWNWEyIDIgMCAwIDEgMi0yaDE0YTIgMiAwIDAgMSAyIDJ6XCIvPjxsaW5lIHgxPVwiOVwiIHgyPVwiMTVcIiB5MT1cIjEwXCIgeTI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiN1wiIHkyPVwiMTNcIi8+JyxcbiAgJ2FsZXJ0LWNpcmNsZSc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI4XCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMi4wMVwiIHkxPVwiMTZcIiB5Mj1cIjE2XCIvPicsXG4gICdyZWZyZXNoLWN3JzogJzxwYXRoIGQ9XCJNMyAxMmE5IDkgMCAwIDEgMTUtNi43TDIxIDhcIi8+PHBhdGggZD1cIk0yMSAzdjVoLTVcIi8+PHBhdGggZD1cIk0yMSAxMmE5IDkgMCAwIDEtMTUgNi43TDMgMTZcIi8+PHBhdGggZD1cIk0zIDIxdi01aDVcIi8+JyxcbiAgJ2ZpbGUtdGV4dCc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjEzXCIgeTI9XCIxM1wiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxN1wiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiOFwiIHkxPVwiOVwiIHkyPVwiOVwiLz4nLFxuICAnZmlsZS1jb2RlJzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PHBhdGggZD1cIm0xMCAxMy0yIDIgMiAyXCIvPjxwYXRoIGQ9XCJtMTQgMTcgMi0yLTItMlwiLz4nLFxuICBpbWFnZTogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIiByeT1cIjJcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjlcIiByPVwiMlwiLz48cGF0aCBkPVwibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjFcIi8+JyxcbiAgLy8gU3R5bGlzZWQgXCJwaW5jaFwiIOKAlCB0d28gb3Bwb3NpbmcgY3VydmVzIG1lZXRpbmcgYXQgYSBjZW50ZXIgZG90LlxuICBwaW5jaDogJzxwYXRoIGQ9XCJNNSA1YzMgMiA1IDQgNyA3LTIgMy00IDUtNyA3XCIvPjxwYXRoIGQ9XCJNMTkgNWMtMyAyLTUgNC03IDcgMiAzIDQgNSA3IDdcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxLjVcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gICdzdGFyLWZpbGxlZCc6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBwaW46ICc8cGF0aCBkPVwiTTEyIDE3djVcIi8+PHBhdGggZD1cIk05IDEwLjc2YTIgMiAwIDAgMS0xLjExIDEuNzlsLTEuNzguOUEyIDIgMCAwIDAgNSAxNS4yNFYxNmExIDEgMCAwIDAgMSAxaDEyYTEgMSAwIDAgMCAxLTF2LS43NmEyIDIgMCAwIDAtMS4xMS0xLjc5bC0xLjc4LS45QTIgMiAwIDAgMSAxNSAxMC43NlY3YTEgMSAwIDAgMSAxLTEgMiAyIDAgMCAwIDAtNEg4YTIgMiAwIDAgMCAwIDQgMSAxIDAgMCAxIDEgMXpcIi8+JyxcbiAgdW5kbzogJzxwYXRoIGQ9XCJNMyA3djZoNlwiLz48cGF0aCBkPVwiTTIxIDE3YTkgOSAwIDAgMC0xNS02LjdMMyAxM1wiLz4nLFxuICByZWRvOiAnPHBhdGggZD1cIk0yMSA3djZoLTZcIi8+PHBhdGggZD1cIk0zIDE3YTkgOSAwIDAgMSAxNS02LjdMMjEgMTNcIi8+JyxcbiAgZm9sZGVyOiAnPHBhdGggZD1cIk0yMCAyMGEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMmgtNy45M2EyIDIgMCAwIDEtMS42Ni0uOWwtLjgyLTEuMkEyIDIgMCAwIDAgNy45MyAzSDRhMiAyIDAgMCAwLTIgMnYxM2EyIDIgMCAwIDAgMiAyWlwiLz4nLFxuICBjaGVjazogJzxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiLz4nLFxuICAnY2lyY2xlLWNoZWNrJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIi8+JyxcbiAgZ3JpcDogJzxjaXJjbGUgY3g9XCI5XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxOVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTlcIiByPVwiMVwiLz4nLFxuICAvLyBCcm9rZW4tY2hhaW4gaWNvbiBmb3IgXCJkZXRhY2ggY29tbWVudCBmcm9tIGl0cyBjYXB0dXJlXCIuIEx1Y2lkZSdzIGB1bmxpbmtgLlxuICB1bmxpbms6ICc8cGF0aCBkPVwibTE4Ljg0IDEyLjI1IDEuNzItMS43MWgtLjAyYTUuMDA0IDUuMDA0IDAgMCAwLS4xMi03LjA3IDUuMDA2IDUuMDA2IDAgMCAwLTYuOTUgMGwtMS43MiAxLjcxXCIvPjxwYXRoIGQ9XCJtNS4xNyAxMS43NS0xLjcxIDEuNzFhNS4wMDQgNS4wMDQgMCAwIDAgLjEyIDcuMDcgNS4wMDYgNS4wMDYgMCAwIDAgNi45NSAwbDEuNzEtMS43MVwiLz48bGluZSB4MT1cIjhcIiB4Mj1cIjhcIiB5MT1cIjJcIiB5Mj1cIjVcIi8+PGxpbmUgeDE9XCIyXCIgeDI9XCI1XCIgeTE9XCI4XCIgeTI9XCI4XCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjE2XCIgeTE9XCIxOVwiIHkyPVwiMjJcIi8+PGxpbmUgeDE9XCIxOVwiIHgyPVwiMjJcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICBzZXR0aW5nczogJzxwYXRoIGQ9XCJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiLz4nLFxuICBpbmZvOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTEyIDE2di00XCIvPjxwYXRoIGQ9XCJNMTIgOGguMDFcIi8+JyxcbiAgLy8gVHJlZS1vZi1yb3dzIOKAlCB1c2VkIGZvciBcIlNwbGl0IGdyb3VwXCIgYWN0aW9uIChkZW5vdGVzIG9uZSBub2RlIGZhbm5pbmdcbiAgLy8gb3V0IGludG8gc2libGluZ3MpLiBMdWNpZGUncyBgbGlzdC10cmVlYC5cbiAgJ2xpc3QtdHJlZSc6ICc8cGF0aCBkPVwiTTIxIDEyaC04XCIvPjxwYXRoIGQ9XCJNMjEgNkg4XCIvPjxwYXRoIGQ9XCJNMjEgMThoLThcIi8+PHBhdGggZD1cIk0zIDZ2NGMwIDEuMS45IDIgMiAyaDNcIi8+PHBhdGggZD1cIk0zIDEwdjZjMCAxLjEuOSAyIDIgMmgzXCIvPicsXG4gIC8vIEdlbmVyaWMgc3BsaXQgaWNvbiBhcyBhIGZhbGxiYWNrIG9wdGlvbi5cbiAgc3BsaXQ6ICc8cGF0aCBkPVwiTTE2IDNoNXY1XCIvPjxwYXRoIGQ9XCJNOCAzSDN2NVwiLz48cGF0aCBkPVwibTIxIDMtNy40NiA3LjQ2YTIgMiAwIDAgMCAwIDIuODNMMjEgMjFcIi8+PHBhdGggZD1cIk0zIDNsNy40NiA3LjQ2YTIgMiAwIDAgMSAwIDIuODNMMyAyMVwiLz4nLFxuICAvLyBDYXJkYm9hcmQtc3R5bGUgYm94IHVzZWQgZm9yIFwiRXhwb3J0IHdvcmtzcGFjZSBhcyBaSVBcIi5cbiAgcGFja2FnZTogJzxwYXRoIGQ9XCJtNy41IDQuMjcgOSA1LjE1XCIvPjxwYXRoIGQ9XCJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaXCIvPjxwYXRoIGQ9XCJNMy4zIDcgMTIgMTJsOC43LTVcIi8+PHBhdGggZD1cIk0xMiAyMlYxMlwiLz4nLFxuICAvLyBUd28gaW50ZXJsb2NraW5nIGxpbmtzIOKAlCB1c2VkIGZvciBcIkNvcHkgYXMgcGF0aFwiLlxuICBsaW5rOiAnPHBhdGggZD1cIk0xMCAxM2E1IDUgMCAwIDAgNy41NC41NGwzLTNhNSA1IDAgMCAwLTcuMDctNy4wN2wtMS43MiAxLjcxXCIvPjxwYXRoIGQ9XCJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzFcIi8+JyxcbiAgLy8gRGF0YWJhc2UvZHVjayBpY29uIGZvciB0aGUgRHVja0RCIHBhbGV0dGUgY29tbWFuZC5cbiAgZGF0YWJhc2U6ICc8ZWxsaXBzZSBjeD1cIjEyXCIgY3k9XCI1XCIgcng9XCI5XCIgcnk9XCIzXCIvPjxwYXRoIGQ9XCJNMyA1VjE5QTkgMyAwIDAgMCAyMSAxOVY1XCIvPjxwYXRoIGQ9XCJNMyAxMkE5IDMgMCAwIDAgMjEgMTJcIi8+Jyxcbn07XG5cbmNvbnN0IHdyYXAgPSAoYm9keTogc3RyaW5nLCBzaXplOiBudW1iZXIpOiBzdHJpbmcgPT5cbiAgYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiJHtzaXplfVwiIGhlaWdodD1cIiR7c2l6ZX1cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+JHtib2R5fTwvc3ZnPmA7XG5cbmV4cG9ydCBjb25zdCBQR19JQ09OUyA9IHtcbiAgaGFzOiAobmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiBuYW1lIGluIElDT05TLFxuICBzdmdTdHJpbmc6IChuYW1lOiBzdHJpbmcsIHNpemUgPSAxNik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYm9keSA9IElDT05TW25hbWVdO1xuICAgIGlmICghYm9keSkge1xuICAgICAgY29uc29sZS53YXJuKCdbbHVjaWRlXSBtaXNzaW5nIGljb24nLCBuYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAoYm9keSwgc2l6ZSk7XG4gIH0sXG4gIG1vdW50OiAoZWw6IEVsZW1lbnQgfCBudWxsLCBuYW1lOiBzdHJpbmcsIHNpemU/OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoZWwpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgfSxcbn07XG5cbi8vIFNpZGUtZWZmZWN0IGZvciBsZWdhY3kgc2NyaXB0LXRhZyBpbmNsdXNpb24gKHNpZGVwYW5lbC5odG1sIHN0aWxsIDxzY3JpcHRcbi8vIHNyYz1cImx1Y2lkZS5qc1wiPiDigJQgcHJlLWJ1bmRsZSkuIFJlLWV4cG9zZXMgdGhlIHJlZ2lzdHJ5IG9uIGdsb2JhbFRoaXMuXG5pZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gIChnbG9iYWxUaGlzIGFzIGFueSkuUEdfSUNPTlMgPSBQR19JQ09OUztcbn1cbiIsCiAgICAiLy8gVVNUQVItZm9ybWF0IHRhciBlbmNvZGVyLiBFYWNoIGVudHJ5IGlzIGEgNTEyLWJ5dGUgaGVhZGVyIGZvbGxvd2VkIGJ5XG4vLyBjb250ZW50IGJ5dGVzIHBhZGRlZCB1cCB0byB0aGUgbmV4dCA1MTItYnl0ZSBib3VuZGFyeS4gVGhlIGFyY2hpdmUgZW5kc1xuLy8gd2l0aCB0d28gemVyby1maWxsZWQgNTEyLWJ5dGUgYmxvY2tzLiB+ODAgbGluZXMsIG5vIGRlcGVuZGVuY2llcy5cbi8vXG4vLyBXZSBwaWNrIHRhciAocmF0aGVyIHRoYW4gemlwKSBiZWNhdXNlIHpzdGQgaXMgdGhlIHdpcmUgZm9ybWF0IHdlIHdhbnQgdG9cbi8vIHBhaXIgaXQgd2l0aCBhbmQgdGFyLnpzdCBpcyB0aGUgc3RhbmRhcmQgY29tYm8gKHppcCBpcyBpdHMgb3duXG4vLyBjb21wcmVzc2lvbiBjb250YWluZXIpLiBQYXRocyBsb25nZXIgdGhhbiAxMDAgY2hhcnMgdXNlIHRoZSBzdGFuZGFyZFxuLy8gdXN0YXIgcHJlZml4IGZpZWxkICgxNTUgYnl0ZXMgYXQgb2Zmc2V0IDM0NSk6IHRoZSBwYXRoIGlzIHNwbGl0IGF0IGFcbi8vIHNsYXNoIGludG8gcHJlZml4KOKJpDE1NSkvbmFtZSjiiaQxMDApLiBPbmx5IHVuc3BsaXR0YWJsZSBwYXRocyB0aHJvdyDigJRcbi8vIEdOVS9QQVggbG9uZy1uYW1lIGV4dGVuc2lvbnMgYXJlIGRlbGliZXJhdGVseSBub3QgaW1wbGVtZW50ZWQuXG5cbmNvbnN0IGVuYyA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG5jb25zdCB3cml0ZU9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIC8vIHRhciBmaWVsZHMgYXJlIHplcm8tcGFkZGVkIG51bGwtdGVybWluYXRlZCBvY3RhbCBzdHJpbmdzLlxuICBsZXQgcyA9IHZhbHVlLnRvU3RyaW5nKDgpO1xuICBzID0gcy5wYWRTdGFydChsZW5ndGggLSAxLCAnMCcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDE7IGkrKykgYnVmW29mZnNldCArIGldID0gcy5jaGFyQ29kZUF0KGkpO1xuICBidWZbb2Zmc2V0ICsgbGVuZ3RoIC0gMV0gPSAwO1xufTtcblxuY29uc3Qgd3JpdGVBc2NpaSA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBzdHI6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3QgYnl0ZXMgPSBlbmMuZW5jb2RlKHN0cik7XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKGJ5dGVzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV0hO1xufTtcblxuY29uc3QgaGVhZGVyQ2hlY2tzdW0gPSAoaGVhZGVyOiBVaW50OEFycmF5KTogbnVtYmVyID0+IHtcbiAgLy8gVGhlIGNoZWNrc3VtIGZpZWxkICg4IGJ5dGVzIGF0IG9mZnNldCAxNDgpIGlzIHRyZWF0ZWQgYXMgQVNDSUkgc3BhY2VzXG4gIC8vIGR1cmluZyBjb21wdXRhdGlvbiwgdGhlbiB0aGUgYWN0dWFsIGNoZWNrc3VtIGlzIHdyaXR0ZW4gaW50byBpdC5cbiAgbGV0IHN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICBpZiAoaSA+PSAxNDggJiYgaSA8IDE1Nikgc3VtICs9IDB4MjA7XG4gICAgZWxzZSBzdW0gKz0gaGVhZGVyW2ldID8/IDA7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbmV4cG9ydCB0eXBlIFRhckVudHJ5ID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRhdGE6IFVpbnQ4QXJyYXkgfCBzdHJpbmc7XG4gIG10aW1lPzogbnVtYmVyOyAvLyB1bml4IGVwb2NoIHNlY29uZHM7IGRlZmF1bHRzIHRvIG5vd1xufTtcblxuLy8gdXN0YXIgbmFtZSBzcGxpdDogcGF0aHMg4omkMTAwIGNoYXJzIGdvIHN0cmFpZ2h0IGludG8gdGhlIG5hbWUgZmllbGQ7XG4vLyBsb25nZXIgcGF0aHMgc3BsaXQgYXQgdGhlIHJpZ2h0bW9zdCBzbGFzaCB0aGF0IGxlYXZlcyBwcmVmaXgg4omkMTU1IGFuZFxuLy8gdGFpbCDiiaQxMDAuIFRoZSByZWFkZXIgcmVhc3NlbWJsZXMgYHByZWZpeCArICcvJyArIG5hbWVgLlxuY29uc3Qgc3BsaXRUYXJOYW1lID0gKGZ1bGw6IHN0cmluZyk6IHtuYW1lOiBzdHJpbmc7IHByZWZpeDogc3RyaW5nfSA9PiB7XG4gIGlmIChmdWxsLmxlbmd0aCA8PSAxMDApIHJldHVybiB7bmFtZTogZnVsbCwgcHJlZml4OiAnJ307XG4gIGxldCBjdXQgPSAtMTtcbiAgZm9yIChsZXQgaSA9IGZ1bGwuaW5kZXhPZignLycpOyBpICE9PSAtMTsgaSA9IGZ1bGwuaW5kZXhPZignLycsIGkgKyAxKSkge1xuICAgIGlmIChpIDw9IDE1NSAmJiBmdWxsLmxlbmd0aCAtIGkgLSAxIDw9IDEwMCkgY3V0ID0gaTtcbiAgfVxuICBpZiAoY3V0ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgdGFyOiBwYXRoIG5vdCBzcGxpdHRhYmxlIGludG8gdXN0YXIgcHJlZml4KDE1NSkvbmFtZSgxMDApOiAke2Z1bGx9YCk7XG4gIH1cbiAgcmV0dXJuIHtwcmVmaXg6IGZ1bGwuc2xpY2UoMCwgY3V0KSwgbmFtZTogZnVsbC5zbGljZShjdXQgKyAxKX07XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRUYXIgPSAoZW50cmllczogVGFyRW50cnlbXSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBjb25zdCBub3dTZWMgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlbnRyeS5kYXRhID09PSAnc3RyaW5nJyA/IGVuYy5lbmNvZGUoZW50cnkuZGF0YSkgOiBlbnRyeS5kYXRhO1xuICAgIGNvbnN0IHtuYW1lLCBwcmVmaXh9ID0gc3BsaXRUYXJOYW1lKGVudHJ5Lm5hbWUpO1xuICAgIGNvbnN0IGhlYWRlciA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDAsIG5hbWUsIDEwMCk7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwMCwgMG82NDQsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RlXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwOCwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1aWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTE2LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMjQsIGRhdGEubGVuZ3RoLCAxMik7ICAgICAgICAgICAgICAgICAgLy8gc2l6ZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMzYsIGVudHJ5Lm10aW1lID8/IG5vd1NlYywgMTIpOyAgICAgICAgLy8gbXRpbWVcbiAgICBmb3IgKGxldCBpID0gMTQ4OyBpIDwgMTU2OyBpKyspIGhlYWRlcltpXSA9IDB4MjA7ICAgICAgICAgIC8vIGNoZWNrc3VtIHBsYWNlaG9sZGVyXG4gICAgaGVhZGVyWzE1Nl0gPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0eXBlZmxhZyAnMCcgPSByZWd1bGFyIGZpbGVcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjU3LCAndXN0YXInLCA2KTsgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI2MywgJzAwJywgMik7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2ZXJzaW9uXG4gICAgaWYgKHByZWZpeCkgd3JpdGVBc2NpaShoZWFkZXIsIDM0NSwgcHJlZml4LCAxNTUpOyAgICAgICAgICAvLyB1c3RhciBwcmVmaXhcbiAgICAvLyB1bmFtZS9nbmFtZS9kZXZtYWpvci9kZXZtaW5vciBsZWZ0IHplcm8uXG5cbiAgICBjb25zdCBjaGVja3N1bSA9IGhlYWRlckNoZWNrc3VtKGhlYWRlcik7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDE0OCwgY2hlY2tzdW0sIDgpO1xuXG4gICAgYmxvY2tzLnB1c2goaGVhZGVyKTtcbiAgICBibG9ja3MucHVzaChkYXRhKTtcbiAgICBjb25zdCBwYWQgPSAoNTEyIC0gKGRhdGEubGVuZ3RoICUgNTEyKSkgJSA1MTI7XG4gICAgaWYgKHBhZCkgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkocGFkKSk7XG4gIH1cbiAgLy8gVHJhaWxlcjogdHdvIGNvbnNlY3V0aXZlIDUxMi1ieXRlIHplcm8gYmxvY2tzLlxuICBibG9ja3MucHVzaChuZXcgVWludDhBcnJheSgxMDI0KSk7XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmZzZXQpOyBvZmZzZXQgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBac3RkIHJhdy1ibG9jayBmcmFtZSB3cml0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gQ29tcHJlc3Npb25TdHJlYW0oJ3pzdGQnKSBpc24ndCBzaGlwcGVkIGluIGN1cnJlbnQgQ2hyb21pdW0gKHZlcmlmaWVkIHZpYVxuLy8gcnVudGltZSBwcm9iZSksIHNvIHdlIHdyaXRlIGEgdmFsaWQgenN0ZCBmcmFtZSBjb250YWluaW5nIG9uZSBvciBtb3JlXG4vLyByYXcgKHVuY29tcHJlc3NlZCkgYmxvY2tzLiBUaGUgb3V0cHV0IGlzIHN0cnVjdHVyYWxseSBhIHJlYWwgYC50YXIuenN0YFxuLy8gZmlsZTogYHpzdGQgLWRgIGFjY2VwdHMgaXQsIDctWmlwIGFjY2VwdHMgaXQsIGxpYnpzdGQgYWNjZXB0cyBpdC4gSXRcbi8vIGp1c3QgZG9lc24ndCBhY3R1YWxseSBjb21wcmVzcyDigJQgZm9yIG91ciBwYXlsb2FkLCB3aGljaCBpcyBtb3N0bHkgUE5HXG4vLyAoYWxyZWFkeSBjb21wcmVzc2VkKSBwbHVzIGEgZmV3IEtCIG9mIEpTT05ML01hcmtkb3duLCB0aGUgbG9zcyB2cy4gcmVhbFxuLy8gREVGTEFURSBpcyBzaW5nbGUtZGlnaXQgcGVyY2VudC5cbi8vXG4vLyBGcmFtZSBsYXlvdXQgKHBlciBSRkMgODg3OCArIFpzdGFuZGFyZCBmb3JtYXQgc3BlYyk6XG4vLyAgIG1hZ2ljX251bWJlciAgICAgICA0IGJ5dGVzICAweDI4IDB4QjUgMHgyRiAweEZEIChMRTogMHhGRDJGQjUyOClcbi8vICAgRkhEICAgICAgICAgICAgICAgIDEgYnl0ZSAgIEZDU19zaXplPTIgKDQtYnl0ZSBGQ1MpLCBTaW5nbGVfU2VnbWVudD0xXG4vLyAgIEZDUyAgICAgICAgICAgICAgICA0IGJ5dGVzICB1bmNvbXByZXNzZWQgcGF5bG9hZCBzaXplICh1MzIgTEUpXG4vLyAgIGJsb2NrcyAgICAgICAgICAgICBOIGJsb2NrcyBlYWNoOiAzLWJ5dGUgaGVhZGVyICsgcGF5bG9hZFxuLy9cbi8vIEJsb2NrIGhlYWRlciAoMyBieXRlcyBMRSk6XG4vLyAgIGJpdCAwICAgICAgIExhc3RfQmxvY2sgZmxhZ1xuLy8gICBiaXRzIDEuLjIgICBCbG9ja19UeXBlICgwMCA9IFJhdywgMDEgPSBSTEUsIDEwID0gQ29tcHJlc3NlZCwgMTEgPSBSZXNlcnZlZClcbi8vICAgYml0cyAzLi4yMyAgQmxvY2tfU2l6ZSAobWF4IDEyOCBLaUIgZm9yIHJhdyAvIFJMRSlcbi8vXG4vLyBXZSBjaHVuayBpbnRvIDEyOCBLaUIgcmF3IGJsb2NrcyB0byByZXNwZWN0IHRoZSBwZXItYmxvY2sgc2l6ZSBsaW1pdC5cblxuY29uc3QgWlNURF9SQVdfQkxPQ0tfTUFYID0gMTI4ICogMTAyNDtcblxuZXhwb3J0IGNvbnN0IHdyYXBac3RkID0gKGRhdGE6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgPCBkYXRhLmxlbmd0aCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGRhdGEubGVuZ3RoIC0gcG9zO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IE1hdGgubWluKHJlbWFpbmluZywgWlNURF9SQVdfQkxPQ0tfTUFYKTtcbiAgICBjb25zdCBpc0xhc3QgPSBwb3MgKyBibG9ja1NpemUgPj0gZGF0YS5sZW5ndGggPyAxIDogMDtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBpc0xhc3QgfCAoMCA8PCAxKSB8IChibG9ja1NpemUgPDwgMyk7IC8vIHR5cGU9cmF3PTBcbiAgICBjb25zdCBibG9ja0hlYWRlciA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIGhlYWRlckludCAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiA4KSAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiAxNikgJiAweGZmLFxuICAgIF0pO1xuICAgIGJsb2Nrcy5wdXNoKGJsb2NrSGVhZGVyKTtcbiAgICBpZiAoYmxvY2tTaXplID4gMCkgYmxvY2tzLnB1c2goZGF0YS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSkpO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSBicmVhaztcbiAgfVxuICBjb25zdCBmY3MgPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgZmhkID0gMGIxMDEwXzAwMDA7IC8vIEZDU19zaXplPTEwICg0IGJ5dGVzKSB8IFNpbmdsZV9TZWdtZW50PTFcbiAgY29uc3QgaGVhZCA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAweDI4LCAweGI1LCAweDJmLCAweGZkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgZmhkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGSERcbiAgICBmY3MgJiAweGZmLCAoZmNzID4+PiA4KSAmIDB4ZmYsIChmY3MgPj4+IDE2KSAmIDB4ZmYsIChmY3MgPj4+IDI0KSAmIDB4ZmYsXG4gIF0pO1xuICBsZXQgdG90YWwgPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZiA9IDA7XG4gIG91dC5zZXQoaGVhZCwgb2ZmKTsgb2ZmICs9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2ZmKTsgb2ZmICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb21wYW5pb24gZGVjb2RlciBmb3Igb3VyIG93biB3cml0ZXIg4oCUIHVzZWQgYnkgdGVzdHMuIEFjY2VwdHMgYW55IHpzdGRcbi8vIGZyYW1lIHdyaXR0ZW4gYnkgYHdyYXBac3RkYCAoc2luZ2xlIFJhd19CbG9jayBzdHJlYW0sIDQtYnl0ZSBGQ1MsXG4vLyBzaW5nbGUtc2VnbWVudCwgbm8gY2hlY2tzdW0sIG5vIGRpY3QpLiBUaHJvd3Mgb24gYW55dGhpbmcgZWxzZSBzbyB0ZXN0c1xuLy8gZmFpbCBsb3VkbHkgcmF0aGVyIHRoYW4gc2lsZW50bHkgbWlzLXBhcnNlLlxuZXhwb3J0IGNvbnN0IHVud3JhcFpzdGQgPSAoZnJhbWU6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgaWYgKGZyYW1lLmxlbmd0aCA8IDkpIHRocm93IG5ldyBFcnJvcignenN0ZDogZnJhbWUgdG9vIHNob3J0Jyk7XG4gIGlmIChmcmFtZVswXSAhPT0gMHgyOCB8fCBmcmFtZVsxXSAhPT0gMHhiNSB8fCBmcmFtZVsyXSAhPT0gMHgyZiB8fCBmcmFtZVszXSAhPT0gMHhmZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignenN0ZDogYmFkIG1hZ2ljIG51bWJlcicpO1xuICB9XG4gIGNvbnN0IGZoZCA9IGZyYW1lWzRdITtcbiAgY29uc3QgZmNzU2l6ZUZsYWcgPSAoZmhkID4+PiA2KSAmIDBiMTE7XG4gIGNvbnN0IHNpbmdsZVNlZ21lbnQgPSAoKGZoZCA+Pj4gNSkgJiAxKSA9PT0gMTtcbiAgY29uc3QgY2hlY2tzdW0gPSAoKGZoZCA+Pj4gMikgJiAxKSA9PT0gMTtcbiAgY29uc3QgZGljdElkID0gZmhkICYgMGIxMTtcbiAgaWYgKCFzaW5nbGVTZWdtZW50KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IG9ubHkgU2luZ2xlX1NlZ21lbnQgZnJhbWVzIHN1cHBvcnRlZCcpO1xuICBpZiAoY2hlY2tzdW0pIHRocm93IG5ldyBFcnJvcignenN0ZDogY29udGVudCBjaGVja3N1bSBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmIChkaWN0SWQpIHRocm93IG5ldyBFcnJvcignenN0ZDogZGljdGlvbmFyaWVzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgbGV0IHBvcyA9IDU7XG4gIGxldCBmY3MgPSAwO1xuICBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDApIHsgZmNzID0gZnJhbWVbcG9zXSE7IHBvcyArPSAxOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjAxKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KTsgZmNzICs9IDI1NjsgcG9zICs9IDI7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMTApIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNikgfCAoZnJhbWVbcG9zICsgM10hICogMHgxMDAwMDAwKTsgcG9zICs9IDQ7IH1cbiAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IDgtYnl0ZSBGQ1MgdW5zdXBwb3J0ZWQnKTtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoZmNzKTtcbiAgbGV0IG91dFBvcyA9IDA7XG4gIGZvciAoOzspIHtcbiAgICBpZiAocG9zICsgMyA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgaGVhZGVyJyk7XG4gICAgY29uc3QgaGVhZGVySW50ID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNik7XG4gICAgcG9zICs9IDM7XG4gICAgY29uc3QgaXNMYXN0ID0gKGhlYWRlckludCAmIDEpID09PSAxO1xuICAgIGNvbnN0IGJsb2NrVHlwZSA9IChoZWFkZXJJbnQgPj4+IDEpICYgMGIxMTtcbiAgICBjb25zdCBibG9ja1NpemUgPSAoaGVhZGVySW50ID4+PiAzKSAmIDB4MWZfZmZfZmY7XG4gICAgaWYgKGJsb2NrVHlwZSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBvbmx5IFJhd19CbG9jayAoMCkgc3VwcG9ydGVkLCBnb3QgJHtibG9ja1R5cGV9YCk7XG4gICAgaWYgKHBvcyArIGJsb2NrU2l6ZSA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgcGF5bG9hZCcpO1xuICAgIG91dC5zZXQoZnJhbWUuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpLCBvdXRQb3MpO1xuICAgIG91dFBvcyArPSBibG9ja1NpemU7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoaXNMYXN0KSBicmVhaztcbiAgfVxuICBpZiAob3V0UG9zICE9PSBmY3MpIHRocm93IG5ldyBFcnJvcihgenN0ZDogRkNTIG1pc21hdGNoIChnb3QgJHtvdXRQb3N9LCBleHBlY3RlZCAke2Zjc30pYCk7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgVGFyIGxpc3RpbmcgZGVjb2RlciAodGVzdC1vbmx5KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdhbGtzIGEgdGFyIGJ5dGUgYnVmZmVyLCByZXR1cm5pbmcge25hbWUsIGRhdGF9IGZvciBlYWNoIGVudHJ5LiBTdG9wcyBhdFxuLy8gdGhlIHRyYWlsZXIgKHR3byB6ZXJvIGJsb2NrcykuIE9ubHkgcmVhZHMgdGhlIGZpZWxkcyBQaW5jaEdyYWIgd3JpdGVzLlxuXG5leHBvcnQgdHlwZSBQYXJzZWRUYXJFbnRyeSA9IHtuYW1lOiBzdHJpbmc7IGRhdGE6IFVpbnQ4QXJyYXk7IHNpemU6IG51bWJlcn07XG5cbmNvbnN0IGRlYyA9IG5ldyBUZXh0RGVjb2RlcigpO1xuXG5jb25zdCByZWFkTnVsbFN0ciA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGxldCBlbmQgPSBvZmZzZXQgKyBsZW5ndGg7XG4gIGZvciAobGV0IGkgPSBvZmZzZXQ7IGkgPCBvZmZzZXQgKyBsZW5ndGg7IGkrKykge1xuICAgIGlmIChidWZbaV0gPT09IDApIHsgZW5kID0gaTsgYnJlYWs7IH1cbiAgfVxuICByZXR1cm4gZGVjLmRlY29kZShidWYuc3ViYXJyYXkob2Zmc2V0LCBlbmQpKTtcbn07XG5cbmNvbnN0IHJlYWRPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gIGNvbnN0IHMgPSByZWFkTnVsbFN0cihidWYsIG9mZnNldCwgbGVuZ3RoKS50cmltKCk7XG4gIHJldHVybiBzID8gcGFyc2VJbnQocywgOCkgOiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGFyID0gKGJ1ZjogVWludDhBcnJheSk6IFBhcnNlZFRhckVudHJ5W10gPT4ge1xuICBjb25zdCBlbnRyaWVzOiBQYXJzZWRUYXJFbnRyeVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zICsgNTEyIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyA1MTIpO1xuICAgIGxldCBhbGxaZXJvID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7IGlmIChoZWFkZXJbaV0gIT09IDApIHsgYWxsWmVybyA9IGZhbHNlOyBicmVhazsgfSB9XG4gICAgaWYgKGFsbFplcm8pIGJyZWFrOyAvLyB0cmFpbGVyXG4gICAgY29uc3Qgc2hvcnROYW1lID0gcmVhZE51bGxTdHIoaGVhZGVyLCAwLCAxMDApO1xuICAgIGNvbnN0IHByZWZpeCA9IHJlYWROdWxsU3RyKGhlYWRlciwgMzQ1LCAxNTUpO1xuICAgIGNvbnN0IG5hbWUgPSBwcmVmaXggPyBgJHtwcmVmaXh9LyR7c2hvcnROYW1lfWAgOiBzaG9ydE5hbWU7XG4gICAgY29uc3Qgc2l6ZSA9IHJlYWRPY3RhbChoZWFkZXIsIDEyNCwgMTIpO1xuICAgIHBvcyArPSA1MTI7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWUsIHNpemUsIGRhdGE6IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIHNpemUpfSk7XG4gICAgICBwb3MgKz0gc2l6ZTtcbiAgICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoc2l6ZSAlIDUxMikpICUgNTEyO1xuICAgICAgcG9zICs9IHBhZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVudHJpZXM7XG59O1xuIiwKICAgICIvLyBBdXRvLWdlbmVyYXRlZCBieSBzY3JpcHRzL2J1aWxkLWV4dGVuc2lvbi50cyDigJQgZG8gbm90IGVkaXQuXG4vLyBUZWxscyB0aGUgc2lkZXBhbmVsIHdoaWNoIHRlbXBsYXRlIHJlc291cmNlcyBleGlzdCBpbiB0aGlzIGJ1aWxkLlxuLy8gQWN0dWFsIGNvbnRlbnQgbGl2ZXMgYXMgLm1kIGZpbGVzIHVuZGVyIGV4dGVuc2lvbi90ZW1wbGF0ZXMvLCBsb2FkZWRcbi8vIGxhemlseSB2aWEgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMIOKAlCBzZWUgbG9hZFRlbXBsYXRlKCkgaW4gc2lkZXBhbmVsLnRzLlxuZXhwb3J0IGNvbnN0IFRFTVBMQVRFU19QUkVTRU5UID0ge1wiZGVzaWduVGVtcGxhdGVcIjp0cnVlLFwic2tpbGxUZW1wbGF0ZVwiOnRydWUsXCJsb2NhbERlc2lnblwiOnRydWUsXCJsb2NhbFNraWxsXCI6dHJ1ZX0gYXMgY29uc3Q7XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIEludmVudG9yeSBvZiB2ZW5kb3JlZCBza2lsbCByZXNvdXJjZXMgdW5kZXIgZXh0ZW5zaW9uL3NraWxscy8gKHNvdXJjZSBvZlxuLy8gdHJ1dGg6IHRoaXJkX3BhcnR5LyovVVBTVFJFQU0ubG9jayB2aWEgc2NyaXB0cy9zeW5jLWJ1bmRsZWQtc2tpbGxzLnRzKS5cbi8vIGBleHRgIGlzIHRoZSBleHRlbnNpb24tcmVsYXRpdmUgZmV0Y2ggcGF0aDsgYGFyY2hpdmVgIGlzIHdoZXJlIHRoZSBmaWxlXG4vLyBsYW5kcyBpbnNpZGUgYW4gZXhwb3J0ZWQgLnRhci56c3QgYnVuZGxlLlxuZXhwb3J0IGNvbnN0IEJVTkRMRURfU0tJTExTX1BSRVNFTlQgPSB0cnVlO1xuZXhwb3J0IHR5cGUgQnVuZGxlZFNraWxsRmlsZSA9IHtleHQ6IHN0cmluZzsgYXJjaGl2ZTogc3RyaW5nOyBieXRlczogbnVtYmVyfTtcbmV4cG9ydCBjb25zdCBCVU5ETEVEX1NLSUxMX0ZJTEVTOiBCdW5kbGVkU2tpbGxGaWxlW10gPSBbXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDMwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubmF0aXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubmF0aXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzOTEwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmRyb2lkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5kcm9pZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzIyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5pbWF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuaW1hdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNzA4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NDM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5uYXRpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5uYXRpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDgzMTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JvbGRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JvbGRlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzA5MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYnJhbmQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9icmFuZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA0NzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NsYXJpZnkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jbGFyaWZ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDY0NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29kZXgubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2RleC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzAwMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29sb3JpemUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2xvcml6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTM1NjhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyYWZ0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JhZnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDExOTQ0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcml0aXF1ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyaXRpcXVlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0MTI5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGVsaWdodC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RlbGlnaHQubWRcIixcbiAgICBcImJ5dGVzXCI6IDk4MjdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2Rpc3RpbGwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kaXN0aWxsLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NzQwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kb2N1bWVudC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RvY3VtZW50Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzk2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZXh0cmFjdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2V4dHJhY3QubWRcIixcbiAgICBcImJ5dGVzXCI6IDM0MzFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hhcmRlbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hhcmRlbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODU5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaG9va3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ob29rcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTI1NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW5pdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2luaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE4OTUyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbnRlcmFjdGlvbi1kZXNpZ24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbnRlcmFjdGlvbi1kZXNpZ24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDY1NzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2lvcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2lvcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzAzN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGF5b3V0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGF5b3V0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTc5MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDYwMTU2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vbmJvYXJkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb25ib2FyZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzc0MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3B0aW1pemUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vcHRpbWl6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzU5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3ZlcmRyaXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3ZlcmRyaXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wb2xpc2gubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wb2xpc2gubWRcIixcbiAgICBcImJ5dGVzXCI6IDEyOTU1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wcm9kdWN0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcHJvZHVjdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzc1OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcXVpZXRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3F1aWV0ZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ5MTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3NoYXBlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvc2hhcGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDExNTIzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS90eXBlc2V0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvdHlwZXNldC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTcxMzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvTElDRU5TRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvTElDRU5TRVwiLFxuICAgIFwiYnl0ZXNcIjogMTA3NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvTk9USUNFLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9OT1RJQ0UubWRcIixcbiAgICBcImJ5dGVzXCI6IDUwM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vbWFya2V0cGxhY2UuanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL21hcmtldHBsYWNlLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDExOTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL3BsdWdpbi5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vcGx1Z2luLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDc1NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9GVU5ESU5HLnltbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvRlVORElORy55bWxcIixcbiAgICBcImJ5dGVzXCI6IDQ3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2Rlc2lnbi1zeXN0ZW0tcHJvZmlsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZGVzaWduLXN5c3RlbS1wcm9maWxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyODFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZnJhbWV3b3JrLWNvcnJlY3Rpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2ZyYW1ld29yay1jb3JyZWN0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzODlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbGVhcm5pbmctc3VibWlzc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbGVhcm5pbmctc3VibWlzc2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzY0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL25ldy1oZXVyaXN0aWMtcnVsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbmV3LWhldXJpc3RpYy1ydWxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvUFVMTF9SRVFVRVNUX1RFTVBMQVRFLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9QVUxMX1JFUVVFU1RfVEVNUExBVEUubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ0MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGlnbm9yZVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRpZ25vcmVcIixcbiAgICBcImJ5dGVzXCI6IDY2NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMzE1MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0lUQVRJT04uY2ZmXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0lUQVRJT04uY2ZmXCIsXG4gICAgXCJieXRlc1wiOiAxMjExXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT0RFX09GX0NPTkRVQ1QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT0RFX09GX0NPTkRVQ1QubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUSU5HLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUSU5HLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NTYxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRPUlMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRPUlMubWRcIixcbiAgICBcImJ5dGVzXCI6IDMzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTElDRU5TRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0xJQ0VOU0VcIixcbiAgICBcImJ5dGVzXCI6IDExNTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL05PVElDRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL05PVElDRVwiLFxuICAgIFwiYnl0ZXNcIjogNDU4MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vUkVBRE1FLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vUkVBRE1FLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMTcwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYWxsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYWxsLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMTgyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbmFseXplLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYW5hbHl6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA3NzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2V2YWx1YXRlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvZXZhbHVhdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI4MzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL3NvbHZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvc29sdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDE2MTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2FudGktcGF0dGVybnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9hbnRpLXBhdHRlcm5zLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNjc4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9jb25zdGl0dXRpb25hbC1jb25zdHJhaW50cy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2NvbnN0aXR1dGlvbmFsLWNvbnN0cmFpbnRzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NTkyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9vdXRwdXQtc2NoZW1hLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvb3V0cHV0LXNjaGVtYS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA1MThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BmZC1sYXllci1ydWJyaWMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wZmQtbGF5ZXItcnVicmljLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTI5NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcHN5Y2hvbG9neS9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wc3ljaG9sb2d5L212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjM0MjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3RpZXIyLXByb21wdC10ZW1wbGF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3RpZXIyLXByb21wdC10ZW1wbGF0ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTU4ODhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy9zaG9waWZ5LXRoZW1lcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy9zaG9waWZ5LXRoZW1lcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjcwMzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy90YWlsd2luZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy90YWlsd2luZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjc0OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy93b3JkcHJlc3MtdGhlbWVzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3dvcmRwcmVzcy10aGVtZXMubWRcIixcbiAgICBcImJ5dGVzXCI6IDIyMjQ2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvZm91bmRhdGlvbi1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2ZvdW5kYXRpb24tcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMzM4ODFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMS1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wxLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDM2MTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDItcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMi1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAzOTI1MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wzLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDMtcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMjE2NzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sNC1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2w0LXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDI0ODA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWNyb3NzLWxheWVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1jcm9zcy1sYXllci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjg1NTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZXhjZWxsZW50Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1leGNlbGxlbnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE3MDI4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWdvb2QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWdvb2QubWRcIixcbiAgICBcImJ5dGVzXCI6IDIxMzMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLW1lZGlvY3JlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1tZWRpb2NyZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjQzNzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtcG9vci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtcG9vci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjYxMzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdGVycmlibGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXRlcnJpYmxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMDE5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS11bmNvbnZlbnRpb25hbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdW5jb252ZW50aW9uYWwubWRcIixcbiAgICBcImJ5dGVzXCI6IDIzNjMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvQURIRC1DVVJCLUNVVC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9BREhELUNVUkItQ1VULm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MzA1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvUEVSQ0VQVElPTi1GSVJTVC1ERVNJR04ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvUEVSQ0VQVElPTi1GSVJTVC1ERVNJR04ubWRcIixcbiAgICBcImJ5dGVzXCI6IDk4NzcwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9sbG1zLnR4dFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2xsbXMudHh0XCIsXG4gICAgXCJieXRlc1wiOiA2NTQ0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9zY3JpcHRzL2dlbi1wZmQtaW5kZXgucHlcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9zY3JpcHRzL2dlbi1wZmQtaW5kZXgucHlcIixcbiAgICBcImJ5dGVzXCI6IDQ1NDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTI1OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2FjY3VtdWxhdGVkLWxlYXJuaW5ncy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9hY2N1bXVsYXRlZC1sZWFybmluZ3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDcyMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2NpdGF0aW9uLXN0YW5kYXJkcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9jaXRhdGlvbi1zdGFuZGFyZHMubWRcIixcbiAgICBcImJ5dGVzXCI6IDEzNDMxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvaW5zaWdodHMtbG9nLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2luc2lnaHRzLWxvZy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzQyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wwL2wwMTgtYmFja2VuZC1tZWNoYW5pY3MtYXMtZnJvbnRlbmQtY29tcGxleGl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDAvbDAxOC1iYWNrZW5kLW1lY2hhbmljcy1hcy1mcm9udGVuZC1jb21wbGV4aXR5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNjE1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wxL2wwMTEtdmlzdWFsLWNoYW5uZWwtYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wxL2wwMTEtdmlzdWFsLWNoYW5uZWwtYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDMxNDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxMy1rZXlib2FyZC1kZW5zaXR5LWlzLWwyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDEzLWtleWJvYXJkLWRlbnNpdHktaXMtbDIubWRcIixcbiAgICBcImJ5dGVzXCI6IDE0NTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxNi1uZWFyLW1pc3MtY29sb3ItYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDE2LW5lYXItbWlzcy1jb2xvci1hc3ltbWV0cnkubWRcIixcbiAgICBcImJ5dGVzXCI6IDYxMzZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAyNC1hYS1jb25zdHJhaW5lZC10b2tlbi1sYWRkZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMjQtYWEtY29uc3RyYWluZWQtdG9rZW4tbGFkZGVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MDMwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wzL2wwMjMtZmFsc2lmaWFiaWxpdHktdHJpYWQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wzL2wwMjMtZmFsc2lmaWFiaWxpdHktdHJpYWQubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ2OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwMy1wcmUtc2VuZC12cy1wb3N0LXJlc3BvbnNlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDAzLXByZS1zZW5kLXZzLXBvc3QtcmVzcG9uc2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDgwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA2LWluZnJhc3RydWN0dXJlLXZzLWFjdGl2YXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDYtaW5mcmFzdHJ1Y3R1cmUtdnMtYWN0aXZhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTM3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDgtZXBpc3RlbWljLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwOC1lcGlzdGVtaWMtYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA4OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAyMi1sNC1zeW1tZXRyeS10aHJlc2hvbGQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMjItbDQtc3ltbWV0cnktdGhyZXNob2xkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NTIwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19pbmRleC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX2luZGV4Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNzM0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19zZWFyY2guanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX3NlYXJjaC5qc29uXCIsXG4gICAgXCJieXRlc1wiOiAxNDEwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDA5LXRlbXBvcmFsLXNlc3Npb24tY29udGludWl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAwOS10ZW1wb3JhbC1zZXNzaW9uLWNvbnRpbnVpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDk2OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDEyLXJvdXRlLXZzLXN1cnZleS1rbm93bGVkZ2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTItcm91dGUtdnMtc3VydmV5LWtub3dsZWRnZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTUtZXhwZXJpZW50aWFsLXNlbGYtY29udHJhZGljdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxNS1leHBlcmllbnRpYWwtc2VsZi1jb250cmFkaWN0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNjU4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTktbXVsdGktYXJ0aWZhY3QtZW5nYWdlbWVudC1maWVsZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxOS1tdWx0aS1hcnRpZmFjdC1lbmdhZ2VtZW50LWZpZWxkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NDkzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjEtbDQtZXRoaWNzLWZ1c2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyMS1sNC1ldGhpY3MtZnVzaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0MTE5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjUtY2FzY2FkZS1jcmVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjUtY2FzY2FkZS1jcmVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDU0MTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNi1hZXN0aGV0aWMtc3RhYmlsaXR5LWFzLXRydXN0LXByb2R1Y2VyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI2LWFlc3RoZXRpYy1zdGFiaWxpdHktYXMtdHJ1c3QtcHJvZHVjZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDU4MDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyOC1oZWxkLWRlY2lzaW9uLWNvbXBvdW5kaW5nLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI4LWhlbGQtZGVjaXNpb24tY29tcG91bmRpbmcubWRcIixcbiAgICBcImJ5dGVzXCI6IDUyNzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAxLWdlbmVyYXRpdmUtdnMtZXZhbHVhdGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAxLWdlbmVyYXRpdmUtdnMtZXZhbHVhdGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjczXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMi1hY2Nlc3MtdnMtc2lnbmFsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDItYWNjZXNzLXZzLXNpZ25hbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzU5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNC13b3Jrc3BhY2UtdnMtcHJvZHVjdC1zZXBhcmF0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDQtd29ya3NwYWNlLXZzLXByb2R1Y3Qtc2VwYXJhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNS1yZWN1cnNpdmUtdmFsaWRhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA1LXJlY3Vyc2l2ZS12YWxpZGF0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA3LWNvbnZlcmdlbnQtZ2FwLWlkZW50aWZpY2F0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDctY29udmVyZ2VudC1nYXAtaWRlbnRpZmljYXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDkxOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTAtY29uc3RyYWludHMtYXJlLWRpc3RyaWJ1dGlvbnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxMC1jb25zdHJhaW50cy1hcmUtZGlzdHJpYnV0aW9ucy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjkwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTQtb3BlcmF0aW9uYWwtdnMtc3RydWN0dXJhbC1ldGhpY3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNC1vcGVyYXRpb25hbC12cy1zdHJ1Y3R1cmFsLWV0aGljcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTUyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTctaXRlcmF0aXZlLXJlZ3Jlc3Npb24taXMtdmlzaWJpbGl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE3LWl0ZXJhdGl2ZS1yZWdyZXNzaW9uLWlzLXZpc2liaWxpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ3MzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDIwLWludGVybmF0aW9uYWwtY2l0YXRpb24tZXhwYW5zaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjAtaW50ZXJuYXRpb25hbC1jaXRhdGlvbi1leHBhbnNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDU2NjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI3LWludGVybmFsLWFja25vd2xlZGdtZW50LXNpZ25hbHMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyNy1pbnRlcm5hbC1hY2tub3dsZWRnbWVudC1zaWduYWxzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NzEyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyOS1wb3J0LWRvbnQtaW5zdGFsbC1tb3Rpb24tYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyOS1wb3J0LWRvbnQtaW5zdGFsbC1tb3Rpb24tYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDYwMjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTc4NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3BmZC1zcGF0aWFsLWV4dGVuc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wZmQtc3BhdGlhbC1leHRlbnNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5NTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wcmFjdGl0aW9uZXItY29ycmVjdGlvbnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcHJhY3RpdGlvbmVyLWNvcnJlY3Rpb25zLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3NraWxscy1pbmRleC5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwic2tpbGxzLWluZGV4Lmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDEwMTEzXG4gIH1cbl07XG4iLAogICAgIi8vIFNlbmQtdG8tQWdlbnQgcHJvbXB0ICsgcHJvdG9jb2wgYnVpbGRlcnMuXG4vL1xuLy8gVHdvIGFydGlmYWN0cywgb25lIGRvY3RyaW5lOlxuLy8gICDigKIgYnVpbGRBZ2VudFByb21wdEpzb25sIOKAlCB0aGUgSlNPTkwgY2xpcGJvYXJkIHBheWxvYWQgY29waWVkIHdoZW4gdGhlXG4vLyAgICAgdXNlciBjbGlja3MgXCJTZW5kIHRvIEFnZW50XCIuIE5pbmUgZGVuc2UgbGluZXM6IGhlYWRlciwgaW5zdHJ1Y3Rpb24sXG4vLyAgICAgaWRlbXBvdGVudCBiYXNoIGJvb3RzdHJhcCwgbWFuZGF0b3J5IGZ1bGwtcmVhZCBmaWxlIGxpc3QsIGJ1bmRsZVxuLy8gICAgIHRyZWUsIG9yY2hlc3RyYXRpb24gcGhhc2VzLCBjb25kaXRpb25hbCBzdG9jay1ERVNJR04gd2FybmluZyxcbi8vICAgICByZWNhcHR1cmUgdmVyaWZpY2F0aW9uLCBkb25lLWNyaXRlcmlhLlxuLy8gICDigKIgYnVpbGRBZ2VudFByb3RvY29sTWQg4oCUIEFHRU5ULVBST1RPQ09MLm1kIGluc2lkZSBldmVyeSBidW5kbGU6IHRoZVxuLy8gICAgIGZ1bGwgZXhwYW5zaW9uIG9mIHRoZSBzYW1lIGRvY3RyaW5lLCBzbyBhIGxvc3QgY2xpcGJvYXJkIGRlZ3JhZGVzIHRvXG4vLyAgICAgXCJleHRyYWN0IHRoZSBhcmNoaXZlIGFuZCByZWFkIEFHRU5ULVBST1RPQ09MLm1kXCIuXG4vL1xuLy8gSHlkcmF0aW9uIGNvbnZlbnRpb25zIChtaXJyb3JlZCBpbiB0aGUgZG9jcyk6XG4vLyAgIOKAoiB2YWx1ZXMgYmFrZWQgaW4gYXQgZXhwb3J0IHRpbWUgY29tZSBmcm9tIHRoZSBvcHRpb25zIG9iamVjdFxuLy8gICAgICh3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlIHBhdGgsIGV4cG9ydCB0aW1lc3RhbXAsIHRhciBlbnRyaWVzKTtcbi8vICAg4oCiIDxBTkdMRV9UT0tFTlM+IGFyZSBsZWZ0IHZlcmJhdGltIGZvciB0aGUgUkVDRUlWSU5HIGFnZW50IHRvIGluZmVyXG4vLyAgICAgKDxQUk9KRUNUX1JPT1Q+LCA8QVBQX1VSTD4sIDxGRUVEQkFDS19VSUQ+LCA8cnVuSWQ+LCA8QVJDSElWRV9QQVRIPikuXG4vL1xuLy8gRGV0ZXJtaW5pc20gY29udHJhY3Q6IGlkZW50aWNhbCBpbnB1dHMg4oaSIGlkZW50aWNhbCBvdXRwdXQgc3RyaW5ncy4gTm9cbi8vIERhdGUubm93KCkvTWF0aC5yYW5kb20oKSBpbiBoZXJlIOKAlCB0aGUgZXhwb3J0IGNsb2NrIGFycml2ZXMgdmlhIG9wdHMuXG4vLyBub2RlLXRlc3RhYmxlIChubyBicm93c2VyIEFQSXMpOyBjb25zdW1lZCBieSBzaWRlcGFuZWwudHMgYXQgZXhwb3J0IHRpbWUuXG5cbi8qKiBQZXJzaXN0ZW5jZSByb290IGZvciBhIHdvcmtzcGFjZSwgYXMgdGhlIHJlY2VpdmluZyBhZ2VudCBzZWVzIGl0LiAqL1xuZXhwb3J0IGNvbnN0IHdvcmtzcGFjZVJvb3QgPSAod29ya3NwYWNlKSA9PiBgfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvJHt3b3Jrc3BhY2V9YDtcblxuLyoqIEV4dHJhY3Rpb24gZGlyIGZvciBhIGJ1bmRsZSBpbnNpZGUgdGhlIHBlcnNpc3RlbmNlIHJvb3QuICovXG5leHBvcnQgY29uc3QgZXh0cmFjdERpciA9ICh3b3Jrc3BhY2UsIGJ1bmRsZUlkKSA9PlxuICBgJHt3b3Jrc3BhY2VSb290KHdvcmtzcGFjZSl9L2J1bmRsZXMvJHtidW5kbGVJZH0vZXh0cmFjdGVkYDtcblxuLy8gU2luZ2xlLXF1b3RlLXNhZmUgaW50ZXJwb2xhdGlvbiBmb3IgYmFzaDogJ2l0J1xcJydzJyBzdXJ2aXZlcyBhbnkgaW5wdXQuXG5jb25zdCBzcSA9ICh2KSA9PiBTdHJpbmcodikucmVwbGFjZSgvJy9nLCBcIidcXFxcJydcIik7XG5cbi8qKlxuICogSWRlbXBvdGVudCBiYXNoIGJvb3RzdHJhcC4gYGFyY2hpdmVQYXRoYCBpcyB0aGUgaHlkcmF0ZWQgYWJzb2x1dGUgcGF0aCBvZlxuICogdGhlIC50YXIuenN0IG9uIHRoZSBvcGVyYXRvcidzIG1hY2hpbmU7IHBhc3MgdGhlIGxpdGVyYWwgdG9rZW5cbiAqICc8QVJDSElWRV9QQVRIPicgdG8gZW1pdCB0aGUgdG9rZW5pemVkIGNvcHkgc2hpcHBlZCBpbiBBR0VOVC1QUk9UT0NPTC5tZC5cbiAqXG4gKiBUaGUgc2NyaXB0IHNlbGYtbm9ybWFsaXplcyB0aGUgYXJjaGl2ZSBwYXRoIHNvIFwiZXhlY3V0ZSBleGFjdGx5IGFzXG4gKiB3cml0dGVuXCIgc3RheXMgdHJ1ZSBldmVyeXdoZXJlIHRoZSBvcGVyYXRvcidzIGJyb3dzZXIgYW5kIGFnZW50IGNhblxuICogZGlzYWdyZWUgYWJvdXQgcGF0aCBzaGFwZTogYSBsZWFkaW5nIH4gaXMgZXhwYW5kZWQsIGFuZCBhIFdpbmRvd3NcbiAqIGRyaXZlIHBhdGggKENocm9tZSBvbiBXaW5kb3dzICsgYWdlbnQgaW4gV1NML0dpdC1CYXNoKSBpcyBjb252ZXJ0ZWRcbiAqIHZpYSB3c2xwYXRoLCBjeWdwYXRoLCBvciBhIG1hbnVhbCAvbW50Lzxkcml2ZT4gZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEJvb3RzdHJhcFNjcmlwdCA9ICh7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGgsIGV4cG9ydFRzfSkgPT4gW1xuICAnIyEvdXNyL2Jpbi9lbnYgYmFzaCcsXG4gICcjIFBpbmNoR3JhYiBib290c3RyYXAg4oCUIGlkZW1wb3RlbnQ7IHNhZmUgdG8gcmUtcnVuLicsXG4gICdzZXQgLWV1byBwaXBlZmFpbCcsXG4gIGBXUz0nJHtzcSh3b3Jrc3BhY2UpfSdgLFxuICBgQklEPScke3NxKGJ1bmRsZUlkKX0nYCxcbiAgYFNSQz0nJHtzcShhcmNoaXZlUGF0aCl9J2AsXG4gICcjIE5vcm1hbGl6ZSB0aGUgYXJjaGl2ZSBwYXRoOiBleHBhbmQgYSBsZWFkaW5nIH4gKGNsaXBib2FyZCBtYXkgY2FycnkgdGhlJyxcbiAgJyMgfi9Eb3dubG9hZHMgZm9ybSkgYW5kIHRyYW5zbGF0ZSBXaW5kb3dzIGRyaXZlIHBhdGhzIGZvciBXU0wvR2l0LUJhc2guJyxcbiAgJ1NSQz1cIiR7U1JDLyNcXFxcfi8kSE9NRX1cIicsXG4gICdjYXNlIFwiJFNSQ1wiIGluJyxcbiAgJyAgW0EtWmEtel06W1xcXFxcXFxcL10qKScsXG4gICcgICAgaWYgY29tbWFuZCAtdiB3c2xwYXRoID4vZGV2L251bGwgMj4mMTsgdGhlbiBTUkM9XCIkKHdzbHBhdGggLXUgXCIkU1JDXCIpXCI7JyxcbiAgJyAgICBlbGlmIGNvbW1hbmQgLXYgY3lncGF0aCA+L2Rldi9udWxsIDI+JjE7IHRoZW4gU1JDPVwiJChjeWdwYXRoIC11IFwiJFNSQ1wiKVwiOycsXG4gICcgICAgZWxzZScsXG4gICcgICAgICBkcml2ZT1cIiQocHJpbnRmICVzIFwiJHtTUkMlJToqfVwiIHwgdHIgXCJbOnVwcGVyOl1cIiBcIls6bG93ZXI6XVwiKVwiJyxcbiAgJyAgICAgIHJlc3Q9XCIke1NSQyMqOn1cIjsgcmVzdD1cIiR7cmVzdC8vXFxcXFxcXFwvL31cIicsXG4gICcgICAgICBTUkM9XCIvbW50LyRkcml2ZSRyZXN0XCInLFxuICAnICAgIGZpOzsnLFxuICAnZXNhYycsXG4gICdST09UPVwiJEhPTUUvLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyRXU1wiJyxcbiAgJ0RFU1Q9XCIkUk9PVC9idW5kbGVzLyRCSURcIicsXG4gICdpZiBbIC1mIFwiJERFU1QvLmV4dHJhY3RlZFwiIF0gJiYgWyBcIiQoY2F0IFwiJERFU1QvLmV4dHJhY3RlZFwiKVwiID0gXCIkQklEXCIgXTsgdGhlbicsXG4gICcgIGVjaG8gXCJhbHJlYWR5LWV4dHJhY3RlZCAkREVTVC9leHRyYWN0ZWRcIicsXG4gICdlbHNlJyxcbiAgJyAgbWtkaXIgLXAgXCIkREVTVC9leHRyYWN0ZWRcIiBcIiRST09UL3BsYW5zLyRCSURcIiBcIiRST09UL2F1ZGl0cy8kQklEXCIgXCIkUk9PVC9yZWNhcHR1cmVzXCInLFxuICAnICBpZiB0YXIgLS16c3RkIC14ZiBcIiRTUkNcIiAtQyBcIiRERVNUL2V4dHJhY3RlZFwiIDI+L2Rldi9udWxsOyB0aGVuIDo7IGVsc2UnLFxuICAnICAgIHpzdGQgLWRjIFwiJFNSQ1wiIHwgdGFyIC14IC1DIFwiJERFU1QvZXh0cmFjdGVkXCInLFxuICAnICBmaScsXG4gICcgIGNwIC1mIFwiJFNSQ1wiIFwiJERFU1QvYnVuZGxlLnRhci56c3RcIicsXG4gICcgIHByaW50ZiBcXCclc1xcJyBcIiRCSURcIiA+IFwiJERFU1QvLmV4dHJhY3RlZFwiJyxcbiAgJyAgZWNobyBcImV4dHJhY3RlZCAkREVTVC9leHRyYWN0ZWRcIicsXG4gICdmaScsXG4gIGBbIC1mIFwiJFJPT1Qvd29yay1tYW5pZmVzdC5qc29ubFwiIF0gfHwgcHJpbnRmICclc1xcXFxuJyAne1widlwiOjEsXCJ0eXBlXCI6XCJ3b3JrLW1hbmlmZXN0LWhlYWRlclwiLFwidG9vbFwiOlwicGluY2hncmFiXCIsXCJ3b3Jrc3BhY2VcIjpcIiR7d29ya3NwYWNlfVwiLFwiY3JlYXRlZFwiOlwiJHtleHBvcnRUc31cIn0nID4gXCIkUk9PVC93b3JrLW1hbmlmZXN0Lmpzb25sXCJgLFxuICAnZWNobyBcIndvcmtkaXIgJFJPT1RcIicsXG5dLmpvaW4oJ1xcbicpO1xuXG4vKipcbiAqIFJlbmRlciB0aGUgYnVuZGxlJ3MgdGFyIGVudHJ5IG5hbWVzIGFzIGFuIGluZGVudGVkIHRyZWUuIENvbGxhcHNlIHJ1bGVzXG4gKiBrZWVwIHRoZSBjbGlwYm9hcmQgZGVuc2UgV0lUSE9VVCBoaWRpbmcgc3RydWN0dXJlIHRoZSBwcm90b2NvbCBjaXRlc1xuICogKGEgbmFpdmUgc2l6ZS1iYXNlZCBjb2xsYXBzZSBmb2xkZWQgdGhlIHdob2xlIGAuYWdlbnRzL2Agc2tpbGwgdHJlZSBpbnRvXG4gKiBvbmUgb3BhcXVlIGxpbmUpOlxuICogICDigKIgYSBkaXJlY3RvcnkgY29sbGFwc2VzIHRvIGBkaXIvIChOIGZpbGVzKWAgb25seSB3aGVuIGl0IGlzIEZMQVRcbiAqICAgICAobm8gc3ViZGlyZWN0b3JpZXMpIGFuZCBob2xkcyBtb3JlIHRoYW4gYGNvbGxhcHNlQXRgIGZpbGVzIOKAlFxuICogICAgIHNjcmVlbnNob3RzLywgaW1wZWNjYWJsZSdzIHJlZmVyZW5jZS8g4oCUIG9yIHdoZW4gaXQgc2l0cyBhdFxuICogICAgIGBjb2xsYXBzZURlcHRoYCBvciBkZWVwZXIsIHdoZXJlIGRldGFpbCBzdG9wcyBwYXlpbmcgZm9yIGl0c2VsZjtcbiAqICAg4oCiIHN0cnVjdHVyZWQgZGlyZWN0b3JpZXMgYXJlIGRlc2NlbmRlZCBzbyB0aGVpciBza2lsbC9sb2NhdG9yIGxheW91dFxuICogICAgIHN0YXlzIHZpc2libGUuXG4gKiBPdXRwdXQgaXMgY2FwcGVkIGF0IGBtYXhMaW5lc2Agd2l0aCBhIGDigKYgK04gbW9yZWAgdGFpbCBhcyBhIGJhY2tzdG9wLlxuICogRGV0ZXJtaW5pc3RpYzogZW50cmllcyBhcmUgc29ydGVkLlxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyQnVuZGxlVHJlZSA9IChlbnRyeU5hbWVzLCB7Y29sbGFwc2VBdCA9IDgsIGNvbGxhcHNlRGVwdGggPSAzLCBtYXhMaW5lcyA9IDEyMH0gPSB7fSkgPT4ge1xuICAvLyBCdWlsZCBhIG5lc3RlZCB7ZGlyczogTWFwLCBmaWxlczogW119IHN0cnVjdHVyZS5cbiAgY29uc3Qgcm9vdE5vZGUgPSB7ZGlyczogbmV3IE1hcCgpLCBmaWxlczogW119O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgWy4uLmVudHJ5TmFtZXNdLnNvcnQoKSkge1xuICAgIGNvbnN0IHBhcnRzID0gbmFtZS5zcGxpdCgnLycpO1xuICAgIGxldCBub2RlID0gcm9vdE5vZGU7XG4gICAgZm9yIChjb25zdCBkaXIgb2YgcGFydHMuc2xpY2UoMCwgLTEpKSB7XG4gICAgICBpZiAoIW5vZGUuZGlycy5oYXMoZGlyKSkgbm9kZS5kaXJzLnNldChkaXIsIHtkaXJzOiBuZXcgTWFwKCksIGZpbGVzOiBbXX0pO1xuICAgICAgbm9kZSA9IG5vZGUuZGlycy5nZXQoZGlyKTtcbiAgICB9XG4gICAgbm9kZS5maWxlcy5wdXNoKHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBjb25zdCBjb3VudEZpbGVzID0gKG5vZGUpID0+IG5vZGUuZmlsZXMubGVuZ3RoICsgWy4uLm5vZGUuZGlycy52YWx1ZXMoKV0ucmVkdWNlKChhLCBkKSA9PiBhICsgY291bnRGaWxlcyhkKSwgMCk7XG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGNvbnN0IGVtaXQgPSAobm9kZSwgZGVwdGgpID0+IHtcbiAgICBjb25zdCBwYWQgPSAnICAnLnJlcGVhdChkZXB0aCk7XG4gICAgZm9yIChjb25zdCBbZGlyLCBjaGlsZF0gb2YgWy4uLm5vZGUuZGlycy5lbnRyaWVzKCldLnNvcnQoKFthXSwgW2JdKSA9PiAoYSA8IGIgPyAtMSA6IDEpKSkge1xuICAgICAgY29uc3QgdG90YWwgPSBjb3VudEZpbGVzKGNoaWxkKTtcbiAgICAgIGNvbnN0IGZsYXQgPSBjaGlsZC5kaXJzLnNpemUgPT09IDA7XG4gICAgICAvLyBgY2hpbGRgIHJlbmRlcnMgYXQgdGhpcyBgZGVwdGhgIChlbWl0J3MgZGVwdGggaXMgdGhlIHBhZCBsZXZlbCBvZlxuICAgICAgLy8gbm9kZSdzIG93biBjaGlsZHJlbikuXG4gICAgICBpZiAoKGZsYXQgJiYgdG90YWwgPiBjb2xsYXBzZUF0KSB8fCBkZXB0aCA+PSBjb2xsYXBzZURlcHRoKSB7XG4gICAgICAgIGxpbmVzLnB1c2goYCR7cGFkfSR7ZGlyfS8gKCR7dG90YWx9IGZpbGVzKWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZXMucHVzaChgJHtwYWR9JHtkaXJ9L2ApO1xuICAgICAgICBlbWl0KGNoaWxkLCBkZXB0aCArIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGYgb2Ygbm9kZS5maWxlcykgbGluZXMucHVzaChgJHtwYWR9JHtmfWApO1xuICB9O1xuICBlbWl0KHJvb3ROb2RlLCAwKTtcbiAgaWYgKGxpbmVzLmxlbmd0aCA+IG1heExpbmVzKSB7XG4gICAgY29uc3QgZHJvcHBlZCA9IGxpbmVzLmxlbmd0aCAtIG1heExpbmVzO1xuICAgIHJldHVybiBbLi4ubGluZXMuc2xpY2UoMCwgbWF4TGluZXMpLCBg4oCmICske2Ryb3BwZWR9IG1vcmVgXS5qb2luKCdcXG4nKTtcbiAgfVxuICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG59O1xuXG4vLyBCdW5kbGUgZmlsZXMgd2hvc2UgcHJlc2VuY2UgZ2F0ZXMgYSBtYW5kYXRvcnktcmVhZCBwYXRoIC8gcHJvbXB0IGxpbmUuXG5jb25zdCBQSU5DSEdSQUJfU0tJTExfUEFUSCA9ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnO1xuY29uc3QgUEZEX1NLSUxMX1BBVEggPSAncGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZCc7XG5jb25zdCBTS0lMTFNfSU5ERVhfUEFUSCA9ICdza2lsbHMtaW5kZXguanNvbic7XG5cbmNvbnN0IG9yY2hlc3RyYXRpb25UZXh0ID0gKHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBqc29ubE5hbWV9KSA9PlxuICBgUEhBU0UgbWFwOiBmb3IgRVZFUlkgY29tbWVudCByb3cgaW4gJHtqc29ubE5hbWV9LCBkZWNpZGUgd2hpY2ggYnVuZGxlZCBza2lsbHMgYXBwbHkgYW5kIGFwcGVuZCBvbmUgY29tbWVudCByb3cgdG8gfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvJHt3b3Jrc3BhY2V9L3dvcmstbWFuaWZlc3QuanNvbmwgY2FycnlpbmcgYSBtYXBwZWRfc2tpbGxzIGZpZWxkIHdob3NlIGVudHJpZXMgYXJlIGxvY2F0b3JzIOKAlCBwYXRocyByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGlvbiByb290IChlLmcuIC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLzxmaWxlPi5tZCwgJHtQRkRfU0tJTExfUEFUSH0sICR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9OyB0aGUgZnVsbCBpbmRleCBpcyAke1NLSUxMU19JTkRFWF9QQVRIfSkuIFRoZSBleHBvcnQgcHJlLXNlZWRzIGhldXJpc3RpYyBzdWdnZXN0ZWRTa2lsbHMgb24gZWFjaCBmZWVkYmFjayByb3c7IHZlcmlmeSBhbmQgY29ycmVjdCB0aGVtLCBkbyBub3QgdHJ1c3QgdGhlbSBibGluZGx5LiBgICtcbiAgYFBIQVNFIHBsYW46IGZhbiBvdXQgb25lIGJhY2tncm91bmQgYXRvbWljIHN1YmFnZW50IHBlciBjb21tZW50OyBwYXNzIGVhY2ggc3ViYWdlbnQgYSBzdGFuZGFsb25lIEpTT05MIHN1Ymluc3RydWN0aW9uICh0ZW1wbGF0ZSBpbiBBR0VOVC1QUk9UT0NPTC5tZCkgY29udGFpbmluZyB0aGUgZnVsbCBjb21tZW50IHJvdywgaXRzIHBhcmVudCBzZWxlY3RvciByb3csIHRoZSBidW5kbGUgbWFuaWZlc3QgbGluZSwgYW5kIHRoZSBGVUxMIFRFWFQgb2YgZXZlcnkgbWFwcGVkIHNraWxsIHByb21wdDsgZWFjaCBzdWJhZ2VudCB1c2VzIHlvdXIgL3BsYW4gKHBsYW5uaW5nKSBjYXBhYmlsaXR5IGZvciBpdHMgcGhhc2UgYW5kIHJldHVybnMgYSBwbGFuLCBzYXZlZCB0byBwbGFucy8ke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kOyBlYWNoIHN1YmFnZW50IGFsc28gcG9saXNoZXMgaXRzIHBsYW4gd2l0aCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsLiBgICtcbiAgYFBIQVNFIGltcGxlbWVudDogWU9VIOKAlCB0aGUgZm9yZWdyb3VuZCBhZ2VudCB0aGUgb3BlcmF0b3IgcGFzdGVkIHRoaXMgcHJvbXB0IGludG8g4oCUIGRvIGFsbCBpbXBsZW1lbnRhdGlvbiwgdGVzdCBkZXZlbG9wbWVudCwgdGVzdGluZywgYW5kIGl0ZXJhdGlvbiBpbiA8UFJPSkVDVF9ST09UPjsgc3ViYWdlbnRzIG9ubHkgcGxhbi4gUG9saXNoIHRoZSBpbXBsZW1lbnRlZCByZXN1bHQgd2l0aCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsLiBgICtcbiAgYFBIQVNFIGF1ZGl0OiBzZW5kIHRoZSBjb21iaW5lZCBwbGFucyArIGltcGxlbWVudGF0aW9uIGZvciBhIGJsaW5kIGF0b21pYyAncm9hc3QnIHBlZXIgcmV2aWV3IG9mIEJPVEggcGxhbiBhbmQgaW1wbGVtZW50YXRpb24sIHVzaW5nIHdoYXRldmVyIG90aGVyLWFnZW50IHBlZXItcmV2aWV3IHNraWxscyBleGlzdCBpbiBZT1VSIE9XTiBlbnZpcm9ubWVudDsgd3JpdGUgaXQgdG8gYXVkaXRzLyR7YnVuZGxlSWR9LzxydW5JZD4tcm9hc3QubWQgYW5kIGFkZHJlc3MgZXZlcnkgYmxvY2tlci4gYCArXG4gIGBQSEFTRSB2ZXJpZnk6IHNlZSB0aGUgJ3ZlcmlmeScgbGluZS4gYCArXG4gIGBERUdSQURBVElPTiBSVUxFOiBpZiB5b3UgY2Fubm90IHNwYXduIHN1YmFnZW50cywgb3IgbGFjayBhIC9wbGFuLCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24sIG9yIHJvYXN0IGNhcGFiaWxpdHksIHBlcmZvcm0gdGhlIHNhbWUgcGhhc2VzIHlvdXJzZWxmIFNFUklBTExZIGluIHRoaXMgZXhhY3Qgb3JkZXIg4oCUIG5ldmVyIHNraXAgYSBwaGFzZS4gYCArXG4gIGBTS0lMTFMgUlVMRTogdGhlIGJ1bmRsZWQgc2tpbGxzIGFyZSBmb3IgdGhpcyBqb2Igb25seSDigJQgcmVhZCB0aGVtIGZyb20gdGhlIGV4dHJhY3Rpb24gZGlyZWN0b3J5OyB0aGVyZSBpcyBOTyBuZWVkIHRvIGluc3RhbGwgdGhlbSBwZXJtYW5lbnRseSwgYW5kIHlvdSBtdXN0IE5PVCBvdmVyd3JpdGUgeW91ciBvd24gcGVyc2lzdGVudCBza2lsbHMsIGFnZW50IGNvbmZpZywgb3IgZG90ZmlsZXMuYDtcblxuY29uc3QgdmVyaWZ5VGV4dCA9ICh7d29ya3NwYWNlLCB4RGlyLCBqc29ubE5hbWV9KSA9PlxuICBgRmluYWwgdmVyaWZpY2F0aW9uIHBhc3MsIG9ubHkgYWZ0ZXIgaW1wbGVtZW50YXRpb24gYW5kIGF1ZGl0OiBzdGFydCB0aGUgcHJvZHVjdCBsb2NhbGx5LCB0aGVuIHJ1bjogbnB4IC15IHBpbmNoZ3JhYiByZWNhcHR1cmUgJHt4RGlyfS8ke2pzb25sTmFtZX0gPEFQUF9VUkw+IC0td29ya3NwYWNlLWRpciB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8ke3dvcmtzcGFjZX0gKHVzZSBidW54IGlmIG5weCBpcyB1bmF2YWlsYWJsZSkuIFRoaXMgcmUtbG9jYXRlcyBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3Igd2l0aCBQaW5jaEdyYWIncyBvd24gQ1NTLT5YUGF0aC0+YTExeSBjaGFpbiwgc2NyZWVuc2hvdHMgZWFjaCBlbGVtZW50LCBhbmQgd3JpdGVzIGFuIGFwcGVuZC1vbmx5IHJ1biB1bmRlciByZWNhcHR1cmVzLzxydW5JZD4vLiBSZWFkIGVhY2ggcmVjYXB0dXJlZCBQTkcgbmV4dCB0byBpdHMgb3JpZ2luYWwgaW4gJHt4RGlyfS9zY3JlZW5zaG90cy8gYW5kIGNvbmZpcm0gZXZlcnkgY29tbWVudCBpcyB2aXNpYmx5IHJlc29sdmVkOyB0aGVuIHVwZGF0ZSB0aGUgbWF0Y2hpbmcgd29yay1tYW5pZmVzdC5qc29ubCByb3dzIHRvIHN0YXR1cyBkb25lLCBvciBibG9ja2VkIHdpdGggYSByZWFzb24uYDtcblxuY29uc3QgZG9uZVRleHQgPSAoe2J1bmRsZUlkfSkgPT5cbiAgYFlvdSBhcmUgZmluaXNoZWQgd2hlbiBldmVyeSBjb21tZW50IGhhcyBhIHdvcmstbWFuaWZlc3QuanNvbmwgcm93IHdpdGggc3RhdHVzIGRvbmUgb3IgYmxvY2tlZCwgcGxhbnMvJHtidW5kbGVJZH0vIGhvbGRzIG9uZSBwbGFuIHBlciBjb21tZW50LCBhdWRpdHMvJHtidW5kbGVJZH0vIGhvbGRzIGF0IGxlYXN0IG9uZSByb2FzdCwgYW5kIHRoZSBsYXRlc3QgcmVjYXB0dXJlIHJ1biBsb2NhdGVzIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3Rvci4gd29yay1tYW5pZmVzdC5qc29ubCBpcyBhcHBlbmQtb25seTogYWRkIHJvd3MsIG5ldmVyIHJld3JpdGUgaGlzdG9yeS5gO1xuXG5jb25zdCB3YXJuaW5nVGV4dCA9XG4gICdUaGUgYnVuZGxlZCBERVNJR04ubWQgaXMgUGluY2hHcmFiXFwncyBiYXJlIHN0b2NrIHRlbXBsYXRlIOKAlCB0aGUgb3BlcmF0b3IgZGlkIG5vdCBjdXN0b21pemUgaXQuIERvIE5PVCB0cmVhdCBpdCBhcyBwcm9kdWN0IGNhbm9uLiBQcmVmZXIgYSBtb3JlIGFwcGxpY2FibGUgY2Fub25pY2FsIGRlc2lnbiBzb3VyY2UgaWYgb25lIGV4aXN0cyBmb3IgdGhpcyBwcm9kdWN0IChzZWFyY2ggPFBST0pFQ1RfUk9PVD4gZm9yIERFU0lHTi5tZCwgZG9jcy9kZXNpZ24qLCBicmFuZC8gb3Igc3R5bGUtZ3VpZGUgZmlsZXMpIGFuZCB1c2UgdGhlIGJ1bmRsZWQgdGVtcGxhdGUgb25seSBhcyBhIGdlbmVyaWMgY2hlY2tsaXN0Lic7XG5cbi8qKlxuICogVGhlIG5pbmUtbGluZSBTZW5kLXRvLUFnZW50IGNsaXBib2FyZCBwYXlsb2FkLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy53b3Jrc3BhY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmJ1bmRsZUlkICAgICAgIDE2LWhleCBjb250ZW50IGhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmFyY2hpdmVQYXRoICAgIGFic29sdXRlIHBhdGggb2YgdGhlIHNhdmVkIC50YXIuenN0XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5leHBvcnRUcyAgICAgICBJU08gdGltZXN0YW1wICh0aGUgZXhwb3J0IGNsb2NrKVxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuanNvbmxOYW1lICAgICAgdGhlIGJ1bmRsZSdzIEpTT05MIGVudHJ5IG5hbWVcbiAqIEBwYXJhbSB7e2NvbW1lbnRzOiBudW1iZXIsIHNlbGVjdG9yczogbnVtYmVyLCBwYWdlczogbnVtYmVyLCBzY3JlZW5zaG90czogbnVtYmVyfX0gb3B0cy5jb3VudHNcbiAqIEBwYXJhbSB7c3RyaW5nW119IG9wdHMuZW50cnlOYW1lcyAgIGV2ZXJ5IHRhciBlbnRyeSBuYW1lIGluIHRoZSBidW5kbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0cy5kZXNpZ25Jc1RlbXBsYXRlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBuZXdsaW5lLWpvaW5lZCBKU09OTCAobm8gdHJhaWxpbmcgbmV3bGluZSlcbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkQWdlbnRQcm9tcHRKc29ubCA9IChvcHRzKSA9PiB7XG4gIGNvbnN0IHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aCwgZXhwb3J0VHMsIGpzb25sTmFtZSwgY291bnRzLCBlbnRyeU5hbWVzLCBkZXNpZ25Jc1RlbXBsYXRlfSA9IG9wdHM7XG4gIGNvbnN0IHhEaXIgPSBleHRyYWN0RGlyKHdvcmtzcGFjZSwgYnVuZGxlSWQpO1xuICBjb25zdCBoYXMgPSAobmFtZSkgPT4gZW50cnlOYW1lcy5pbmNsdWRlcyhuYW1lKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB2OiAxLCB0eXBlOiAncGluY2hncmFiLXNlbmQtdG8tYWdlbnQnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICB3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlOiBhcmNoaXZlUGF0aCwgZ2VuZXJhdGVkOiBleHBvcnRUcyxcbiAgICBjb3VudHM6IHtjb21tZW50czogY291bnRzLmNvbW1lbnRzLCBzZWxlY3RvcnM6IGNvdW50cy5zZWxlY3RvcnMsIHBhZ2VzOiBjb3VudHMucGFnZXMsIHNjcmVlbnNob3RzOiBjb3VudHMuc2NyZWVuc2hvdHN9LFxuICAgIGRlc2lnbklzU3RvY2tUZW1wbGF0ZTogZGVzaWduSXNUZW1wbGF0ZSxcbiAgfSk7XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ2luc3RydWN0aW9uJyxcbiAgICB0ZXh0OiBgWW91IGhhdmUgYmVlbiBoYW5kZWQgYSBQaW5jaEdyYWIgZmVlZGJhY2sgYnVuZGxlOiAke2NvdW50cy5jb21tZW50c30gb3BlcmF0b3IgY29tbWVudHMgcGlubmVkIHRvIGxpdmUgVUkgZWxlbWVudHMgb2YgdGhlIHByb2R1Y3QgYnVpbHQgZnJvbSA8UFJPSkVDVF9ST09UPiAoaW5mZXIgPFBST0pFQ1RfUk9PVD4gZnJvbSB5b3VyIGN1cnJlbnQgd29ya2luZyBkaXJlY3Rvcnk7IGlmIGFtYmlndW91cywgYXNrIGJlZm9yZSBlZGl0aW5nKS4gRG8gdGhpcyBub3csIGluIG9yZGVyOiAoMSkgZXhlY3V0ZSB0aGUgYmFzaCBzY3JpcHQgaW4gdGhlIG5leHQgJ2Jvb3RzdHJhcCcgbGluZSBleGFjdGx5IGFzIHdyaXR0ZW4gKGl0cyAnc2NyaXB0JyBmaWVsZCBpcyBhIEpTT04tZXNjYXBlZCBwbGFpbiBiYXNoIHNjcmlwdDsgaXQgc2VsZi1ub3JtYWxpemVzIH4gYW5kIFdpbmRvd3MgZHJpdmUgcGF0aHMgZm9yIFdTTC9HaXQtQmFzaCk7ICgyKSByZWFkIEVWRVJZIGZpbGUgbGlzdGVkIGluIHRoZSAnZmlsZXMnIGxpbmUgZnVsbHkgaW50byBjb250ZXh0OyAoMykgZm9sbG93IEFHRU5ULVBST1RPQ09MLm1kIHRvIG1hcCwgcGxhbiwgaW1wbGVtZW50LCB0ZXN0LCBhdWRpdCwgYW5kIHZlcmlmeSBhIGZpeCBmb3IgZXZlcnkgY29tbWVudC5gLFxuICB9KTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnYm9vdHN0cmFwJywgbGFuZzogJ2Jhc2gnLCBpZGVtcG90ZW50OiB0cnVlLFxuICAgIHNjcmlwdDogYnVpbGRCb290c3RyYXBTY3JpcHQoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmVQYXRoLCBleHBvcnRUc30pLFxuICB9KTtcblxuICBjb25zdCBwYXRocyA9IFtcbiAgICBgQCR7eERpcn0vQUdFTlQtUFJPVE9DT0wubWRgLFxuICAgIGBAJHt4RGlyfS9SRUFETUUubWRgLFxuICAgIGBAJHt4RGlyfS9yZXBhaXItaW5kZXgubWRgLFxuICAgIGBAJHt4RGlyfS8ke2pzb25sTmFtZX1gLFxuICBdO1xuICBpZiAoaGFzKCdERVNJR04ubWQnKSkgcGF0aHMucHVzaChgQCR7eERpcn0vREVTSUdOLm1kYCk7XG4gIGlmIChoYXMoUElOQ0hHUkFCX1NLSUxMX1BBVEgpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS8ke1BJTkNIR1JBQl9TS0lMTF9QQVRIfWApO1xuICBpZiAoaGFzKFBGRF9TS0lMTF9QQVRIKSkgcGF0aHMucHVzaChgQCR7eERpcn0vJHtQRkRfU0tJTExfUEFUSH1gKTtcbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ2ZpbGVzJywgcmVhZEZ1bGx5OiB0cnVlLCBub0dyZXA6IHRydWUsXG4gICAgcnVsZTogJ1JlYWQgZWFjaCBwYXRoIGJlbG93IEVORC1UTy1FTkQgd2l0aCB5b3VyIGZpbGUtcmVhZGluZyB0b29sLiBUaGlzIGlzIE5PTi1PUFRJT05BTC4gRG8gTk9UIGdyZXAgdGhlbSwgZG8gTk9UIGhlYWQvdGFpbCB0aGVtLCBkbyBOT1Qgc2FtcGxlIGxpbmUgcmFuZ2VzIOKAlCBmdWxsIGNvbnRlbnRzIGludG8gY29udGV4dC4gU2NyZWVuc2hvdHMgYW5kIHRoZSBpbXBlY2NhYmxlIHJlZmVyZW5jZSBmaWxlcyBhcmUgcmVhZCBwZXItY29tbWVudCBsYXRlciwgYXMgQUdFTlQtUFJPVE9DT0wubWQgZGlyZWN0cy4nLFxuICAgIHBhdGhzLFxuICB9KTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAndHJlZScsIHJvb3Q6IHhEaXIsIGVudHJpZXM6IGVudHJ5TmFtZXMubGVuZ3RoLFxuICAgIHRleHQ6IHJlbmRlckJ1bmRsZVRyZWUoZW50cnlOYW1lcyksXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdvcmNoZXN0cmF0aW9uJyxcbiAgICBwaGFzZXM6IFsnbWFwJywgJ3BsYW4nLCAnaW1wbGVtZW50JywgJ2F1ZGl0JywgJ3ZlcmlmeSddLFxuICAgIHRleHQ6IG9yY2hlc3RyYXRpb25UZXh0KHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBqc29ubE5hbWV9KSxcbiAgfSk7XG5cbiAgaWYgKGRlc2lnbklzVGVtcGxhdGUpIHtcbiAgICBsaW5lcy5wdXNoKHt0eXBlOiAnd2FybmluZycsIGNvZGU6ICdERVNJR05fTURfSVNfU1RPQ0tfVEVNUExBVEUnLCB0ZXh0OiB3YXJuaW5nVGV4dH0pO1xuICB9XG5cbiAgbGluZXMucHVzaCh7dHlwZTogJ3ZlcmlmeScsIHRleHQ6IHZlcmlmeVRleHQoe3dvcmtzcGFjZSwgeERpciwganNvbmxOYW1lfSl9KTtcbiAgbGluZXMucHVzaCh7dHlwZTogJ2RvbmUnLCB0ZXh0OiBkb25lVGV4dCh7YnVuZGxlSWR9KX0pO1xuXG4gIHJldHVybiBsaW5lcy5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKS5qb2luKCdcXG4nKTtcbn07XG5cbi8qKlxuICogQUdFTlQtUFJPVE9DT0wubWQg4oCUIHRoZSBpbi1idW5kbGUgZXhwYW5zaW9uIG9mIHRoZSBjbGlwYm9hcmQgZG9jdHJpbmUuXG4gKiBza2lsbHNJbmRleCBpcyB0aGUgcGFyc2VkIHNraWxscy1pbmRleC5qc29uIChvciBudWxsIHdoZW4gc2tpbGxzIHdlcmVuJ3RcbiAqIGJ1bmRsZWQpOyB1c2VkIHRvIGh5ZHJhdGUgdGhlIHNraWxsIGludmVudG9yeSB0YWJsZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkQWdlbnRQcm90b2NvbE1kID0gKG9wdHMpID0+IHtcbiAgY29uc3Qge3dvcmtzcGFjZSwgYnVuZGxlSWQsIGV4cG9ydFRzLCBqc29ubE5hbWUsIGNvdW50cywgZW50cnlOYW1lcywgZGVzaWduSXNUZW1wbGF0ZSwgc2tpbGxzSW5kZXh9ID0gb3B0cztcbiAgY29uc3QgeERpciA9IGV4dHJhY3REaXIod29ya3NwYWNlLCBidW5kbGVJZCk7XG4gIGNvbnN0IHJvb3QgPSB3b3Jrc3BhY2VSb290KHdvcmtzcGFjZSk7XG4gIGNvbnN0IGhhcyA9IChuYW1lKSA9PiBlbnRyeU5hbWVzLmluY2x1ZGVzKG5hbWUpO1xuICBjb25zdCBvdXQgPSBbXTtcblxuICBvdXQucHVzaCgnIyBBR0VOVC1QUk9UT0NPTC5tZCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGBXb3Jrc3BhY2U6IFxcYCR7d29ya3NwYWNlfVxcYCDCtyBCdW5kbGU6IFxcYCR7YnVuZGxlSWR9XFxgIMK3IEdlbmVyYXRlZDogJHtleHBvcnRUc31gKTtcbiAgb3V0LnB1c2goYENvdW50czogKioke2NvdW50cy5jb21tZW50c30qKiBjb21tZW50cyDCtyAqKiR7Y291bnRzLnNlbGVjdG9yc30qKiBzZWxlY3RvcnMgwrcgKioke2NvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7Y291bnRzLnNjcmVlbnNob3RzfSoqIHNjcmVlbnNob3RzYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoaXMgZmlsZSBpcyB0aGUgZnVsbCB3b3JraW5nIGRvY3RyaW5lIGZvciB0aGUgY29kaW5nIGFnZW50IGhhbmRlZCB0aGlzJyk7XG4gIG91dC5wdXNoKCdidW5kbGUuIFRoZSBvcGVyYXRvclxcJ3MgY2xpcGJvYXJkIHByb21wdCAoSlNPTkwpIGlzIGEgY29tcGFjdCBib290c3RyYXAgb2YnKTtcbiAgb3V0LnB1c2goJ3RoZSBzYW1lIGNvbnRlbnQg4oCUIGlmIHlvdSBvbmx5IGhhdmUgdGhpcyBhcmNoaXZlLCBldmVyeXRoaW5nIHlvdSBuZWVkIGlzJyk7XG4gIG91dC5wdXNoKCdoZXJlLiBUb2tlbnMgaW4gYDxBTkdMRV9CUkFDS0VUUz5gIGFyZSB5b3VycyB0byBpbmZlcjogYDxQUk9KRUNUX1JPT1Q+YCBpcycpO1xuICBvdXQucHVzaCgndGhlIHByb2R1Y3RcXCdzIHJlcG9zaXRvcnkgKHVzdWFsbHkgeW91ciB3b3JraW5nIGRpcmVjdG9yeSksIGA8QVBQX1VSTD5gIGlzJyk7XG4gIG91dC5wdXNoKCd0aGUgbG9jYWxseSBydW5uaW5nIHByb2R1Y3QsIGA8RkVFREJBQ0tfVUlEPmAvYDxydW5JZD5gIGFyZSBwZXItaXRlbSBpZHMuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDAgwrcgQm9vdHN0cmFwIChpZGVtcG90ZW50KScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdJZiBgJyArIHhEaXIgKyAnYCBkb2VzIG5vdCBleGlzdCB5ZXQsIHJ1biB0aGUgc2NyaXB0IGJlbG93IHdpdGgnKTtcbiAgb3V0LnB1c2goJ2A8QVJDSElWRV9QQVRIPmAgcmVwbGFjZWQgYnkgdGhlIGFic29sdXRlIHBhdGggb2YgdGhpcyBidW5kbGVcXCdzIGAudGFyLnpzdGAnKTtcbiAgb3V0LnB1c2goJyh3aGVuIHlvdSBhcmUgcmVhZGluZyB0aGlzIGZyb20gdGhlIGV4dHJhY3RlZCBhcmNoaXZlLCB0aGF0IHN0ZXAgYWxyZWFkeScpO1xuICBvdXQucHVzaCgnaGFwcGVuZWQg4oCUIHJlLXJ1bm5pbmcgaXMgYSBzYWZlIG5vLW9wKS4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBgYmFzaCcpO1xuICBvdXQucHVzaChidWlsZEJvb3RzdHJhcFNjcmlwdCh7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGg6ICc8QVJDSElWRV9QQVRIPicsIGV4cG9ydFRzfSkpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDEgwrcgUGVyc2lzdGVudCB3b3Jrc3BhY2UgbGF5b3V0Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ0FsbCBQaW5jaEdyYWIgd29yayBzdGF0ZSBsaXZlcyB1bmRlciB0aGUgcGVyc2lzdGVuY2Ugcm9vdCDigJQga2VlcCB5b3VyJyk7XG4gIG91dC5wdXNoKCdwbGFubmluZyBhcnRpZmFjdHMgdGhlcmUgYW5kIGtlZXAgdGhlIHdvcmsgbWFuaWZlc3QgdXBkYXRlZDonKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKGAke3Jvb3R9L2ApO1xuICBvdXQucHVzaCgnICB3b3JrLW1hbmlmZXN0Lmpzb25sICAgICAgICAgICAgICAjIGFwcGVuZC1vbmx5IGFnZW50IHN0YXRlIGxlZGdlcicpO1xuICBvdXQucHVzaCgnICBidW5kbGVzLycpO1xuICBvdXQucHVzaChgICAgICR7YnVuZGxlSWR9L2ApO1xuICBvdXQucHVzaCgnICAgICAgYnVuZGxlLnRhci56c3QgICAgICAgICAgICAgICAjIGNvcHkgb2YgdGhlIG9yaWdpbmFsIGFyY2hpdmUnKTtcbiAgb3V0LnB1c2goJyAgICAgIC5leHRyYWN0ZWQgICAgICAgICAgICAgICAgICAgIyBndWFyZCBtYXJrZXIgKGNvbnRhaW5zIHRoZSBidW5kbGVJZCknKTtcbiAgb3V0LnB1c2goJyAgICAgIGV4dHJhY3RlZC8gICAgICAgICAgICAgICAgICAgIyB0YXIgb3V0cHV0IOKAlCB0cmVhdCBhcyBJTU1VVEFCTEUgaW5wdXQnKTtcbiAgb3V0LnB1c2goJyAgcGxhbnMvJyk7XG4gIG91dC5wdXNoKGAgICAgJHtidW5kbGVJZH0vPEZFRURCQUNLX1VJRD4ucGxhbi5tZGApO1xuICBvdXQucHVzaCgnICBhdWRpdHMvJyk7XG4gIG91dC5wdXNoKGAgICAgJHtidW5kbGVJZH0vPHJ1bklkPi1yb2FzdC5tZGApO1xuICBvdXQucHVzaCgnICByZWNhcHR1cmVzLycpO1xuICBvdXQucHVzaCgnICAgIDxydW5JZD4vICAgICAgICAgICAgICAgICAgICAgICAjIGFwcGVuZC1vbmx5OyBuZXZlciByZXVzZSBhIHJ1bklkJyk7XG4gIG91dC5wdXNoKCcgICAgICByZWNhcHR1cmUtbWFuaWZlc3QuanNvbmwnKTtcbiAgb3V0LnB1c2goJyAgICAgIHNjcmVlbnNob3RzLzx1aWQ+LnBuZycpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2B3b3JrLW1hbmlmZXN0Lmpzb25sYCByb3dzIChhcHBlbmQtb25seTsgcmVkdWNlcnMgZ3JvdXAgYnknKTtcbiAgb3V0LnB1c2goJ2AoYnVuZGxlSWQsIGZlZWRiYWNrVWlkKWAgYW5kIHRoZSBMQVNUIHJvdyB3aW5zIOKAlCBhY2NyZXRlLCBuZXZlciByZXdyaXRlKTonKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBganNvbmMnKTtcbiAgb3V0LnB1c2goJy8vIHdyaXR0ZW4gb25jZSBieSB0aGUgYm9vdHN0cmFwJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcIndvcmstbWFuaWZlc3QtaGVhZGVyXCIsXCJ0b29sXCI6XCJwaW5jaGdyYWJcIixcIndvcmtzcGFjZVwiOlwiJHt3b3Jrc3BhY2V9XCIsXCJjcmVhdGVkXCI6XCIke2V4cG9ydFRzfVwifWApO1xuICBvdXQucHVzaCgnLy8gb25lIHBlciBjb21tZW50LCBhcHBlbmRlZCBlYWNoIHRpbWUgaXRzIHN0YXRlIGFkdmFuY2VzJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcImNvbW1lbnRcIixcImJ1bmRsZUlkXCI6XCIke2J1bmRsZUlkfVwiLFwiZmVlZGJhY2tVaWRcIjpcIjxGRUVEQkFDS19VSUQ+XCIsXCJwYXJlbnRVaWRcIjpcIjxzZWxlY3RvciB1aWQ+XCIsXCJzZWxlY3RvclwiOlwiPGNzcz5cIixcIm1hcHBlZF9za2lsbHNcIjpbe1wic2tpbGxcIjpcIjxpZCBmcm9tIHNraWxscy1pbmRleC5qc29uPlwiLFwibG9jYXRvclwiOlwiPHBhdGggcmVsYXRpdmUgdG8gZXh0cmFjdGlvbiByb290PlwifV0sXCJzdGF0dXNcIjpcIm1hcHBlZHxwbGFubmVkfGluLXByb2dyZXNzfGRvbmV8YmxvY2tlZFwiLFwicGxhblwiOlwicGxhbnMvJHtidW5kbGVJZH0vPEZFRURCQUNLX1VJRD4ucGxhbi5tZFwiLFwibm90ZXNcIjpcIjxzaG9ydD5cIixcInRzXCI6XCI8SVNPPlwifWApO1xuICBvdXQucHVzaCgnLy8gYXBwZW5kZWQgYnkgYHBpbmNoZ3JhYiByZWNhcHR1cmVgIHJ1bnMnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwicmVjYXB0dXJlLXJ1blwiLFwicnVuSWRcIjpcIjxydW5JZD5cIixcInRzXCI6XCI8SVNPPlwiLFwiYnVuZGxlSWRcIjpcIiR7YnVuZGxlSWR9XCIsXCJsb2NhdGVkXCI6MCxcInRvdGFsXCI6MH1gKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyAyIMK3IFJlYWQgb3JkZXIgKG5vbi1vcHRpb25hbCwgZnVsbCByZWFkcywgbm8gZ3JlcCknKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnUmVhZCBlYWNoIG9mIHRoZXNlIEVORC1UTy1FTkQgYmVmb3JlIGFueSBvdGhlciBhY3Rpb24uIERvIG5vdCBncmVwLCBoZWFkLCcpO1xuICBvdXQucHVzaCgndGFpbCwgb3Igc2FtcGxlIGxpbmUgcmFuZ2VzIOKAlCBmdWxsIGNvbnRlbnRzIGludG8gY29udGV4dDonKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaChgMS4gXFxgJHt4RGlyfS9BR0VOVC1QUk9UT0NPTC5tZFxcYCAodGhpcyBmaWxlKWApO1xuICBvdXQucHVzaChgMi4gXFxgJHt4RGlyfS9SRUFETUUubWRcXGBgKTtcbiAgb3V0LnB1c2goYDMuIFxcYCR7eERpcn0vcmVwYWlyLWluZGV4Lm1kXFxgYCk7XG4gIG91dC5wdXNoKGA0LiBcXGAke3hEaXJ9LyR7anNvbmxOYW1lfVxcYGApO1xuICBpZiAoaGFzKCdERVNJR04ubWQnKSkgb3V0LnB1c2goYDUuIFxcYCR7eERpcn0vREVTSUdOLm1kXFxgYCk7XG4gIGlmIChoYXMoUElOQ0hHUkFCX1NLSUxMX1BBVEgpKSBvdXQucHVzaChgNi4gXFxgJHt4RGlyfS8ke1BJTkNIR1JBQl9TS0lMTF9QQVRIfVxcYGApO1xuICBpZiAoaGFzKFBGRF9TS0lMTF9QQVRIKSkgb3V0LnB1c2goYDcuIFxcYCR7eERpcn0vJHtQRkRfU0tJTExfUEFUSH1cXGBgKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnU2NyZWVuc2hvdHMgKGBzY3JlZW5zaG90cy9gLCBpbmRleGVkIGJ5IGBzY3JlZW5zaG90cy5qc29uYCkgYW5kIHRoZScpO1xuICBvdXQucHVzaCgnaW1wZWNjYWJsZSByZWZlcmVuY2UgZmlsZXMgYXJlIHJlYWQgcGVyLWNvbW1lbnQgZHVyaW5nIHRoZSBwaGFzZXMgYmVsb3cuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgaWYgKGRlc2lnbklzVGVtcGxhdGUpIHtcbiAgICBvdXQucHVzaCgnPiAqKldBUk5JTkcg4oCUIERFU0lHTl9NRF9JU19TVE9DS19URU1QTEFURS4qKiAnICsgd2FybmluZ1RleHQpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgfVxuICBvdXQucHVzaCgnIyMgMyDCtyBCdW5kbGVkIHNraWxscycpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdUaGUgYnVuZGxlZCBza2lsbHMgYXJlIGZvciB0aGlzIGpvYiBvbmx5OiByZWFkIHRoZW0gZnJvbSB0aGUgZXh0cmFjdGlvbicpO1xuICBvdXQucHVzaCgnZGlyZWN0b3J5LiBUaGVyZSBpcyBOTyBuZWVkIHRvIGluc3RhbGwgdGhlbSBwZXJtYW5lbnRseSwgYW5kIHlvdSBtdXN0Jyk7XG4gIG91dC5wdXNoKCdOT1Qgb3ZlcndyaXRlIHlvdXIgb3duIHBlcnNpc3RlbnQgc2tpbGxzLCBhZ2VudCBjb25maWcsIG9yIGRvdGZpbGVzLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIGlmIChza2lsbHNJbmRleCAmJiBBcnJheS5pc0FycmF5KHNraWxsc0luZGV4LnNraWxscykgJiYgc2tpbGxzSW5kZXguc2tpbGxzLmxlbmd0aCkge1xuICAgIC8vIFRhYmxlLWNlbGwgc2FuaXRpemVyIGZvciBzZW1pLXRydXN0ZWQgaW5kZXggc3RyaW5ncyAocHVycG9zZXMgY29tZVxuICAgIC8vIGZyb20gdmVuZG9yZWQgdXBzdHJlYW0gZnJvbnRtYXR0ZXIpOiBlc2NhcGUgdGhlIGVzY2FwZSBjaGFyYWN0ZXJcbiAgICAvLyBGSVJTVCwgdGhlbiB0aGUgY2VsbCBkZWxpbWl0ZXIsIGFuZCBmbGF0dGVuIG5ld2xpbmVzIOKAlCBvdGhlcndpc2UgYVxuICAgIC8vIGNyYWZ0ZWQgcHVycG9zZSBjb3VsZCBicmVhayBvdXQgb2YgaXRzIGNlbGwgYW5kIGluamVjdCByb3dzIGludG8gYVxuICAgIC8vIGRvY3VtZW50IGFnZW50cyB0cmVhdCBhcyBkb2N0cmluZSAoQ29kZVFMIGpzL2luY29tcGxldGUtc2FuaXRpemF0aW9uKS5cbiAgICBjb25zdCBjZWxsID0gKHYpID0+IFN0cmluZyh2ID8/ICcnKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpLnJlcGxhY2UoL1xcfC9nLCAnXFxcXHwnKS5yZXBsYWNlKC9cXHI/XFxuL2csICcgJyk7XG4gICAgb3V0LnB1c2goJ3wgaWQgfCBsb2NhdG9yIChyZWxhdGl2ZSB0byBleHRyYWN0aW9uIHJvb3QpIHwgcHVycG9zZSB8Jyk7XG4gICAgb3V0LnB1c2goJ3wgLS0tIHwgLS0tIHwgLS0tIHwnKTtcbiAgICBmb3IgKGNvbnN0IHMgb2Ygc2tpbGxzSW5kZXguc2tpbGxzKSB7XG4gICAgICBjb25zdCBpbnZva2UgPSBzLmludm9rZSA/IGAgSW52b2tlOiBcXGAke2NlbGwocy5pbnZva2UpfVxcYC5gIDogJyc7XG4gICAgICBvdXQucHVzaChgfCBcXGAke2NlbGwocy5pZCl9XFxgIHwgXFxgJHtjZWxsKHMucGF0aCl9XFxgIHwgJHtjZWxsKHMucHVycG9zZSl9JHtpbnZva2V9IHxgKTtcbiAgICB9XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdQcm92ZW5hbmNlICh1cHN0cmVhbSByZXBvICsgcGlubmVkIGNvbW1pdCArIGxpY2Vuc2UpIGZvciBldmVyeSB2ZW5kb3JlZCcpO1xuICAgIG91dC5wdXNoKGBza2lsbCBpcyByZWNvcmRlZCBpbiBcXGAke1NLSUxMU19JTkRFWF9QQVRIfVxcYCBhdCB0aGUgYXJjaGl2ZSByb290LmApO1xuICB9IGVsc2Uge1xuICAgIG91dC5wdXNoKCdfVGhpcyBidW5kbGUgd2FzIGV4cG9ydGVkIHdpdGhvdXQgdGhlIHZlbmRvcmVkIHNraWxsIHNldCAodGhlIG9wZXJhdG9yJyk7XG4gICAgb3V0LnB1c2goJ2Rpc2FibGVkIFwiQnVuZGxlIGRlc2lnbiBza2lsbHNcIikuIE1hcCBjb21tZW50cyBhZ2FpbnN0IHdoYXRldmVyIGRlc2lnbicpO1xuICAgIG91dC5wdXNoKCdza2lsbHMgZXhpc3QgaW4gWU9VUiBPV04gZW52aXJvbm1lbnQgaW5zdGVhZCwgYW5kIG5vdGUgdGhhdCBpbiB0aGUnKTtcbiAgICBvdXQucHVzaCgnd29yayBtYW5pZmVzdC5fJyk7XG4gIH1cbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgNCDCtyBQaGFzZXMnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnUnVuIHRoZSBmaXZlIHBoYXNlcyBpbiBvcmRlci4gKipEZWdyYWRhdGlvbiBydWxlOioqIGlmIHlvdSBjYW5ub3Qgc3Bhd24nKTtcbiAgb3V0LnB1c2goJ3N1YmFnZW50cywgb3IgbGFjayBhIGAvcGxhbmAsIGAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ25gLCBvciByb2FzdCcpO1xuICBvdXQucHVzaCgnY2FwYWJpbGl0eSwgcGVyZm9ybSB0aGUgc2FtZSBwaGFzZXMgeW91cnNlbGYgU0VSSUFMTFkgaW4gdGhpcyBleGFjdCBvcmRlcicpO1xuICBvdXQucHVzaCgn4oCUIG5ldmVyIHNraXAgYSBwaGFzZS4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIG1hcCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGBGb3IgRVZFUlkgY29tbWVudCByb3cgaW4gXFxgJHtqc29ubE5hbWV9XFxgLCBkZWNpZGUgd2hpY2ggYnVuZGxlZCBza2lsbHMgYXBwbHlgKTtcbiAgb3V0LnB1c2goJ2FuZCBhcHBlbmQgb25lIGBjb21tZW50YCByb3cgdG8gYHdvcmstbWFuaWZlc3QuanNvbmxgIGNhcnJ5aW5nIGEnKTtcbiAgb3V0LnB1c2goJ2BtYXBwZWRfc2tpbGxzYCBmaWVsZCB3aG9zZSBlbnRyaWVzIGFyZSBsb2NhdG9ycyAoc2VlIMKnMykuIFRoZSBleHBvcnQnKTtcbiAgb3V0LnB1c2goJ3ByZS1zZWVkcyBoZXVyaXN0aWMgYHN1Z2dlc3RlZFNraWxsc2Agb24gZWFjaCBmZWVkYmFjayByb3c7IHZlcmlmeSBhbmQnKTtcbiAgb3V0LnB1c2goJ2NvcnJlY3QgdGhlbSwgZG8gbm90IHRydXN0IHRoZW0gYmxpbmRseS4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIHBsYW4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnRmFuIG91dCBPTkUgYmFja2dyb3VuZCBhdG9taWMgc3ViYWdlbnQgcGVyIGNvbW1lbnQuIFBhc3MgZWFjaCBzdWJhZ2VudCBhJyk7XG4gIG91dC5wdXNoKCdzdGFuZGFsb25lIEpTT05MIHN1Ymluc3RydWN0aW9uIGNvbnRhaW5pbmcgdGhlIGZ1bGwgY29tbWVudCByb3csIGl0cycpO1xuICBvdXQucHVzaCgncGFyZW50IHNlbGVjdG9yIHJvdywgdGhlIGJ1bmRsZSBtYW5pZmVzdCBsaW5lLCBhbmQgdGhlIEZVTEwgVEVYVCBvZiBldmVyeScpO1xuICBvdXQucHVzaCgnbWFwcGVkIHNraWxsIHByb21wdC4gRWFjaCBzdWJhZ2VudCB1c2VzIHlvdXIgYC9wbGFuYCAocGxhbm5pbmcpIGNhcGFiaWxpdHknKTtcbiAgb3V0LnB1c2goYGZvciBpdHMgcGhhc2UsIHBvbGlzaGVzIGl0cyBwbGFuIHdpdGggXFxgL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbFxcYCwgYW5kYCk7XG4gIG91dC5wdXNoKGByZXR1cm5zIGEgcGxhbiB5b3Ugc2F2ZSB0byBcXGBwbGFucy8ke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kXFxgLmApO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdTdWJhZ2VudCBzdWJpbnN0cnVjdGlvbiB0ZW1wbGF0ZSAob25lIEpTT05MIGRvY3VtZW50IHBlciBzdWJhZ2VudDsgaHlkcmF0ZScpO1xuICBvdXQucHVzaCgnZXZlcnkgYDwuLi4+YCBiZWZvcmUgZGlzcGF0Y2gpOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBqc29uYycpO1xuICBvdXQucHVzaChge1widlwiOjEsXCJ0eXBlXCI6XCJwaW5jaGdyYWItc3ViYWdlbnQtcGxhblwiLFwiYnVuZGxlSWRcIjpcIiR7YnVuZGxlSWR9XCIsXCJmZWVkYmFja1VpZFwiOlwiPEZFRURCQUNLX1VJRD5cIn1gKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcImluc3RydWN0aW9uXCIsXCJ0ZXh0XCI6XCJZb3UgYXJlIGEgcGxhbm5pbmcgc3ViYWdlbnQgZm9yIE9ORSB1c2VyIGNvbXBsYWludCBhYm91dCBhIGxpdmUgVUkgZWxlbWVudC4gVXNlIHlvdXIgL3BsYW4gY2FwYWJpbGl0eS4gUHJvZHVjZSBhbiBpbXBsZW1lbnRhdGlvbiBwbGFuIE9OTFkg4oCUIGRvIG5vdCBlZGl0IGZpbGVzLiBEZWxpdmVyOiByb290LWNhdXNlIGh5cG90aGVzaXMsIGV4YWN0IGZpbGVzL3NlbGVjdG9ycyB0byBjaGFuZ2UgaW4gPFBST0pFQ1RfUk9PVD4sIHN0ZXAtYnktc3RlcCBlZGl0cywgdGVzdCBwbGFuLCBhbmQgaG93IHRoZSBmaXggd2lsbCBiZSB2aXN1YWxseSB2ZXJpZmllZCBhZ2FpbnN0IHRoZSBvcmlnaW5hbCBzY3JlZW5zaG90LiBQb2xpc2ggdGhlIHBsYW4gd2l0aCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsIGJlZm9yZSByZXR1cm5pbmcgaXQuXCJ9Jyk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJjb21tZW50XCIsXCJyb3dcIjo8ZnVsbCBmZWVkYmFjayByb3cgZnJvbSB0aGUgYnVuZGxlIEpTT05MPn0nKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcInRhcmdldFwiLFwicm93XCI6PGZ1bGwgcGFyZW50IHNlbGVjdG9yIHJvdyBmcm9tIHRoZSBidW5kbGUgSlNPTkw+fScpO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwibWFuaWZlc3RcIixcInJvd1wiOjx0aGUgYnVuZGxlIG1hbmlmZXN0IGxpbmU+fScpO1xuICBvdXQucHVzaChge1widHlwZVwiOlwic2NyZWVuc2hvdFwiLFwicGF0aFwiOlwiJHt4RGlyfS9zY3JlZW5zaG90cy88ZmlsZT4ucG5nXCJ9YCk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJza2lsbFwiLFwiaWRcIjpcIjxtYXBwZWQgc2tpbGwgaWQ+XCIsXCJ0ZXh0XCI6XCI8RlVMTCBURVhUIG9mIHRoZSBtYXBwZWQgc2tpbGwgZmlsZT5cIn0nKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgaW1wbGVtZW50Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1lPVSDigJQgdGhlIGZvcmVncm91bmQgYWdlbnQgdGhlIG9wZXJhdG9yIHBhc3RlZCB0aGUgcHJvbXB0IGludG8g4oCUIGRvIGFsbCcpO1xuICBvdXQucHVzaCgnaW1wbGVtZW50YXRpb24sIHRlc3QgZGV2ZWxvcG1lbnQsIHRlc3RpbmcsIGFuZCBpdGVyYXRpb24gaW4nKTtcbiAgb3V0LnB1c2goJ2A8UFJPSkVDVF9ST09UPmAuIFN1YmFnZW50cyBvbmx5IHBsYW4uIFdvcmsgb25lIGNvbW1lbnQgYXQgYSB0aW1lLCB1cGRhdGUnKTtcbiAgb3V0LnB1c2goJ2l0cyB3b3JrLW1hbmlmZXN0IHJvdyB0byBgaW4tcHJvZ3Jlc3NgIHRoZW4gYGRvbmVgL2BibG9ja2VkYCwgYW5kIHBvbGlzaCcpO1xuICBvdXQucHVzaCgndGhlIGltcGxlbWVudGVkIHJlc3VsdCB3aXRoIGAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsYC4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIGF1ZGl0Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1NlbmQgdGhlIGNvbWJpbmVkIHBsYW5zICsgaW1wbGVtZW50YXRpb24gZm9yIGEgYmxpbmQgYXRvbWljIFxcJ3JvYXN0XFwnIHBlZXInKTtcbiAgb3V0LnB1c2goJ3JldmlldyBvZiBCT1RIIHBsYW4gYW5kIGltcGxlbWVudGF0aW9uLCB1c2luZyB3aGF0ZXZlciBvdGhlci1hZ2VudCcpO1xuICBvdXQucHVzaChgcGVlci1yZXZpZXcgc2tpbGxzIGV4aXN0IGluIFlPVVIgT1dOIGVudmlyb25tZW50LiBXcml0ZSBpdCB0b2ApO1xuICBvdXQucHVzaChgXFxgYXVkaXRzLyR7YnVuZGxlSWR9LzxydW5JZD4tcm9hc3QubWRcXGAgYW5kIGFkZHJlc3MgZXZlcnkgYmxvY2tlciBpdCByYWlzZXMuYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyB2ZXJpZnknKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnT25seSBhZnRlciBpbXBsZW1lbnRhdGlvbiBhbmQgYXVkaXQ6IHN0YXJ0IHRoZSBwcm9kdWN0IGxvY2FsbHksIHRoZW4gcnVuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYGJhc2gnKTtcbiAgb3V0LnB1c2goYG5weCAteSBwaW5jaGdyYWIgcmVjYXB0dXJlICR7eERpcn0vJHtqc29ubE5hbWV9IDxBUFBfVVJMPiAtLXdvcmtzcGFjZS1kaXIgJHtyb290fWApO1xuICBvdXQucHVzaCgnIyBidW54IHdvcmtzIHRvbzsgYWRkIC0tYXV0aC1zdGF0ZSA8c3RvcmFnZVN0YXRlLmpzb24+IGZvciBsb2dnZWQtaW4gcGFnZXMnKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdUaGlzIHJlLWxvY2F0ZXMgZXZlcnkgY29tbWVudGVkIHNlbGVjdG9yIHdpdGggUGluY2hHcmFiXFwncyBvd24nKTtcbiAgb3V0LnB1c2goJ0NTU+KGklhQYXRo4oaSYTExeSBjaGFpbiwgc2NyZWVuc2hvdHMgZWFjaCBlbGVtZW50LCBhbmQgd3JpdGVzIGFuIGFwcGVuZC1vbmx5Jyk7XG4gIG91dC5wdXNoKGBydW4gdW5kZXIgXFxgcmVjYXB0dXJlcy88cnVuSWQ+L1xcYCAocGx1cyBhIFxcYHJlY2FwdHVyZS1ydW5cXGAgbGVkZ2VyIHJvdykuIEl0YCk7XG4gIG91dC5wdXNoKCdleGl0cyAwIG9ubHkgd2hlbiBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3Igc3RpbGwgcmVzb2x2ZXMuIFJlYWQgZWFjaCcpO1xuICBvdXQucHVzaChgcmVjYXB0dXJlZCBQTkcgbmV4dCB0byBpdHMgb3JpZ2luYWwgaW4gXFxgJHt4RGlyfS9zY3JlZW5zaG90cy9cXGAgYW5kIGNvbmZpcm1gKTtcbiAgb3V0LnB1c2goJ2V2ZXJ5IGNvbW1lbnQgaXMgdmlzaWJseSByZXNvbHZlZDsgdGhlbiB1cGRhdGUgdGhlIG1hdGNoaW5nJyk7XG4gIG91dC5wdXNoKCd3b3JrLW1hbmlmZXN0IHJvd3MgdG8gYGRvbmVgLCBvciBgYmxvY2tlZGAgd2l0aCBhIHJlYXNvbi4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgNSDCtyBEb25lIGNyaXRlcmlhJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goZG9uZVRleHQoe2J1bmRsZUlkfSkpO1xuICBvdXQucHVzaCgnJyk7XG4gIHJldHVybiBvdXQuam9pbignXFxuJyk7XG59O1xuIiwKICAgICIvLyBTaW5nbGUtY2FwdHVyZSBmdWxsIGV4cG9ydC5cbi8vXG4vLyBcIkNvcHkgY2FwdHVyZSBhcyBKU09OXCIgd2FudHMgYSBDT01QTEVURSwgc2VsZi1jb250YWluZWQgdGV4dHVhbCBleHBvcnQgb2Zcbi8vIE9ORSBjYXB0dXJlOiBpdHMgc2VsZWN0b3JzL3BhdGhzLCBlbGVtZW50IHRleHQvY29udGVudCwgb3V0ZXJIVE1MLFxuLy8gbWV0YWRhdGEsIEFORCBldmVyeSBub3RlL2NvbW1lbnQgYXR0YWNoZWQgdG8gaXQg4oCUIGV2ZXJ5dGhpbmcgYSBmdWxsXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IGNhcnJpZXMsIGJ1dCBzY29wZWQgdG8gYSBzaW5nbGUgZWxlbWVudC5cbi8vXG4vLyBUaGUgcGFuZWwgbW9kZWxzIGEgY2FwdHVyZSBhcyBhbiBgRW50cnlgIChzcmMvdHlwZXMudHMpIHBsdXMgemVybyBvciBtb3JlXG4vLyBgRmVlZGJhY2tNZXNzYWdlYCByb3dzIGxpbmtlZCBiYWNrIHZpYSBgcGFyZW50VWlkIOKGkiBFbnRyeS51aWRgLiBCZWNhdXNlXG4vLyBub3RlcyBsaXZlIG9uIHNlcGFyYXRlIHJvd3MsIHRoZSBzZXJpYWxpemVyIHRha2VzIHRoZSBjYXB0dXJlIGVudHJ5IGFuZFxuLy8gaXRzIGZlZWRiYWNrIHJvd3MgdG9nZXRoZXIgc28gdGhlIEpTT04gaXMgZ2VudWluZWx5IHNlbGYtY29udGFpbmVkIOKAlCBhXG4vLyBjYWxsZXIgY2FuIGhhbmQgdGhlIG91dHB1dCB0byBhbiBhZ2VudCBhbmQgbm90aGluZyBkYW5nbGVzLlxuLy9cbi8vIEdyb3VwIGhlYWRzIChBbHQrU2hpZnQrQ2xpY2sgc2VsZWN0aW9ucykgY2FycnkgY2hpbGQgY2FwdHVyZXMgdW5kZXJcbi8vIGBlbnRyeS5ncm91cGA7IHdlIGlubGluZSB0aG9zZSBjaGlsZHJlbiAod2l0aCB0aGVpciBvd24gZmVlZGJhY2spIHNvIGFcbi8vIGdyb3VwZWQgY2FwdHVyZSBleHBvcnRzIGFzIG9uZSBjb21wbGV0ZSBvYmplY3QgdG9vLlxuLy9cbi8vIFR3byBvdXRwdXQgZm9ybXMsIG1pcnJvcmluZyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIEpTT04gKyBlbmdsaXNoIHNwbGl0OlxuLy8gICBzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSAgICAg4oaSIG9iamVjdCAgKHN0cnVjdHVyZWQsIGNvbXBsZXRlKVxuLy8gICBzZXJpYWxpemVDYXB0dXJlSnNvbihjYXB0dXJlLCBvcHRzKSAgICAgIOKGkiBzdHJpbmcgIChwcmV0dHkgSlNPTiArIG5ld2xpbmUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVUZXh0KGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKG1hcmtkb3duLCBodW1hbi9MTE0pXG4vL1xuLy8gYGNhcHR1cmVgIGFjY2VwdHMgZWl0aGVyOlxuLy8gICDigKIgeyBlbnRyeSwgZmVlZGJhY2s/LCBtZW1iZXJzPyB9ICDigJQgZXhwbGljaXQgc2hhcGUsIE9SXG4vLyAgIOKAoiBhIGJhcmUgYEVudHJ5YCAgICAgICAgICAgICAgICAgIOKAlCBmZWVkYmFjayBkZWZhdWx0cyB0byBbXVxuLy9cbi8vIE91dHB1dCBpcyBkZXRlcm1pbmlzdGljOiBpZGVudGljYWwgaW5wdXQg4oaSIGJ5dGUtaWRlbnRpY2FsIG91dHB1dC4gTm9cbi8vIHRpbWVzdGFtcHMgYXJlIGluamVjdGVkOyBvbmx5IHRoZSBjYXB0dXJlJ3Mgb3duIGB0c2AgZmllbGRzIGFwcGVhci5cblxuLy8g4pSA4pSA4pSAIElucHV0IG5vcm1hbGl6YXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEFjY2VwdCBhIGJhcmUgRW50cnkgb3IgYSB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3cmFwcGVyIGFuZCByZXR1cm4gYVxuLy8gbm9ybWFsaXplZCB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3aXRoIGFycmF5cyBhbHdheXMgcHJlc2VudC5cbmNvbnN0IG5vcm1hbGl6ZUNhcHR1cmUgPSAoY2FwdHVyZSkgPT4ge1xuICBpZiAoIWNhcHR1cmUgfHwgdHlwZW9mIGNhcHR1cmUgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICAvLyBCYXJlIEVudHJ5OiBpdCBoYXMgYSBgc2VsZWN0b3JgIC8gYHVpZGAgYnV0IG5vIG5lc3RlZCBgZW50cnlgLlxuICBjb25zdCBlbnRyeSA9IGNhcHR1cmUuZW50cnkgPz8gY2FwdHVyZTtcbiAgaWYgKCFlbnRyeSB8fCB0eXBlb2YgZW50cnkgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBoYXMgbm8gZW50cnlcIik7XG4gIH1cbiAgY29uc3QgZmVlZGJhY2sgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUuZmVlZGJhY2spID8gY2FwdHVyZS5mZWVkYmFjayA6IFtdO1xuICAvLyBHcm91cCBtZW1iZXJzIG1heSBiZSBzdXBwbGllZCBleHBsaWNpdGx5LCBlbHNlIGZhbGwgYmFjayB0byB0aGUgZW50cnknc1xuICAvLyBvd24gYGdyb3VwYCBhcnJheSAodGhlIHBhbmVsIHN0b3JlcyBjaGlsZCBjYXB0dXJlcyB0aGVyZSkuXG4gIGNvbnN0IG1lbWJlcnMgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUubWVtYmVycylcbiAgICA/IGNhcHR1cmUubWVtYmVyc1xuICAgIDogQXJyYXkuaXNBcnJheShlbnRyeS5ncm91cClcbiAgICAgID8gZW50cnkuZ3JvdXBcbiAgICAgIDogW107XG4gIHJldHVybiB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9O1xufTtcblxuLy8gQSBmZWVkYmFjayByb3cgc2NvcGVkIHRvIGEgc2luZ2xlIGNhcHR1cmUuIFN0cmlwcyByb3V0aW5nL1VJIGNydWZ0XG4vLyAoaWQsIHR5cGUpIGFuZCBrZWVwcyBvbmx5IHdoYXQgYSByZXZpZXdlciBuZWVkczogdGhlIHRleHQsIHdoZW4gaXQgd2FzXG4vLyB3cml0dGVuLCBhbnkgdGFncywgYW5kIHRoZSBwYXJlbnQgbGluayBmb3IgdHJhY2VhYmlsaXR5LlxuY29uc3Qgc2xpbUNvbW1lbnQgPSAoZmIpID0+IHtcbiAgY29uc3Qgb3V0ID0geyB0ZXh0OiB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiIH07XG4gIGlmIChmYi50cykgb3V0LnRzID0gZmIudHM7XG4gIGlmIChmYi51aWQpIG91dC51aWQgPSBmYi51aWQ7XG4gIGlmIChmYi5wYXJlbnRVaWQpIG91dC5wYXJlbnRVaWQgPSBmYi5wYXJlbnRVaWQ7XG4gIGlmIChBcnJheS5pc0FycmF5KGZiLnRhZ3MpICYmIGZiLnRhZ3MubGVuZ3RoKSBvdXQudGFncyA9IGZiLnRhZ3M7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb2xsZWN0IHRoZSBwYXRocy9zZWxlY3RvcnMgZm9yIGEgY2FwdHVyZSBpbnRvIG9uZSBibG9jayBzbyBldmVyeSB3YXkgb2Zcbi8vIGxvY2F0aW5nIHRoZSBlbGVtZW50IGlzIGluIGEgc2luZ2xlLCBvYnZpb3VzIHBsYWNlLiBUb2xlcmFudCBvZiBib3RoIHRoZVxuLy8gcGFuZWwgYEVudHJ5YCBzaGFwZSAoZmxhdCBgc2VsZWN0b3JgICsgYGlkYC9gdGVzdElkYCkgYW5kIHRoZSByaWNoZXJcbi8vIGBzZWxlY3RvcnNgIHN1Yi1vYmplY3Qgc29tZSBjYXB0dXJlIHBpcGVsaW5lcyBlbWl0LlxuY29uc3QgY29sbGVjdFBhdGhzID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IHBhdGhzID0ge307XG4gIGlmIChlbnRyeS5zZWxlY3RvcikgcGF0aHMuY3NzID0gZW50cnkuc2VsZWN0b3I7XG4gIGNvbnN0IHNlbCA9IGVudHJ5LnNlbGVjdG9ycztcbiAgaWYgKHNlbCAmJiB0eXBlb2Ygc2VsID09PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKHNlbC5jc3MgJiYgc2VsLmNzcyAhPT0gcGF0aHMuY3NzKSBwYXRocy5jc3NGdWxsID0gc2VsLmNzcztcbiAgICBpZiAoc2VsLmNvbXBhY3QpIHBhdGhzLmNvbXBhY3QgPSBzZWwuY29tcGFjdDtcbiAgICBpZiAoc2VsLnhwYXRoKSBwYXRocy54cGF0aCA9IHNlbC54cGF0aDtcbiAgICBpZiAoc2VsLmRhdGFJZHMpIHBhdGhzLmRhdGFJZHMgPSBzZWwuZGF0YUlkcztcbiAgfVxuICBpZiAoZW50cnkuY29tcG9uZW50Um9vdCkgcGF0aHMuY29tcG9uZW50Um9vdCA9IGVudHJ5LmNvbXBvbmVudFJvb3Q7XG4gIGlmIChlbnRyeS5zaGFkb3dIb3N0KSBwYXRocy5zaGFkb3dIb3N0ID0gZW50cnkuc2hhZG93SG9zdDtcbiAgaWYgKGVudHJ5LmlkKSBwYXRocy5kb21JZCA9IGVudHJ5LmlkO1xuICBpZiAoZW50cnkudGVzdElkKSBwYXRocy50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmICh0eXBlb2YgZW50cnkuc2VsZWN0b3JNYXRjaENvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgcGF0aHMubWF0Y2hDb3VudCA9IGVudHJ5LnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgfVxuICByZXR1cm4gcGF0aHM7XG59O1xuXG4vLyDilIDilIDilIAgRnVsbCBzdHJ1Y3R1cmVkIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEJ1aWxkIHRoZSBjb21wbGV0ZSBvYmplY3QgZm9yIE9ORSBjYXB0dXJlLiBFdmVyeXRoaW5nIHRleHR1YWwgdGhlXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IHdvdWxkIGNhcnJ5IGZvciB0aGlzIGVsZW1lbnQsIHdpdGggbm90ZXMvY29tbWVudHNcbi8vIGlubGluZWQuIEdyb3VwIG1lbWJlcnMgcmVjdXJzZSBzbyBhIGdyb3VwZWQgY2FwdHVyZSBpcyBzZWxmLWNvbnRhaW5lZC5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVDYXB0dXJlRnVsbCA9IChjYXB0dXJlLCBvcHRzID0ge30pID0+IHtcbiAgY29uc3QgeyBlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnMgfSA9IG5vcm1hbGl6ZUNhcHR1cmUoY2FwdHVyZSk7XG5cbiAgY29uc3Qgb3V0ID0ge1xuICAgIGtpbmQ6IFwicGluY2hncmFiL2NhcHR1cmUtZnVsbFwiLFxuICAgIHY6IDEsXG4gIH07XG4gIGlmIChlbnRyeS51aWQpIG91dC51aWQgPSBlbnRyeS51aWQ7XG4gIGlmIChlbnRyeS5uICE9PSB1bmRlZmluZWQpIG91dC5uID0gZW50cnkubjtcbiAgaWYgKGVudHJ5LnRzKSBvdXQudHMgPSBlbnRyeS50cztcbiAgaWYgKGVudHJ5LnVybCkgb3V0LnVybCA9IGVudHJ5LnVybDtcbiAgaWYgKGVudHJ5LnRhZykgb3V0LnRhZyA9IGVudHJ5LnRhZztcblxuICAvLyBJZGVudGl0eSAvIGExMXkgbmFtaW5nLlxuICBjb25zdCBpZGVudGl0eSA9IHt9O1xuICBpZiAoZW50cnkucm9sZSAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5yb2xlID0gZW50cnkucm9sZTtcbiAgaWYgKGVudHJ5LmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LmFjY2Vzc2libGVOYW1lID0gZW50cnkuYWNjZXNzaWJsZU5hbWU7XG4gIGlmIChlbnRyeS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkudGVzdElkID0gZW50cnkudGVzdElkO1xuICBpZiAoZW50cnkuaWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuaWQgPSBlbnRyeS5pZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkuY2xhc3NlcykgJiYgZW50cnkuY2xhc3Nlcy5sZW5ndGgpIGlkZW50aXR5LmNsYXNzZXMgPSBlbnRyeS5jbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoaWRlbnRpdHkpLmxlbmd0aCkgb3V0LmlkZW50aXR5ID0gaWRlbnRpdHk7XG5cbiAgLy8gUGF0aHMg4oCUIGV2ZXJ5IHdheSB0byBsb2NhdGUgdGhlIGVsZW1lbnQuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIG91dC5wYXRocyA9IHBhdGhzO1xuXG4gIC8vIFRleHQgLyBjb250ZW50LiBXZSBrZWVwIGFsbCB0ZXh0dWFsIHN1cmZhY2VzIHNvIG5vdGhpbmcgdGhlIHVzZXIgY2FuXG4gIC8vIHNlZSBpcyBsb3N0OiBzb3VyY2UgdGV4dCwgdGhlIENTUy1yZW5kZXJlZCBmb3JtLCBhbmQgdGhlIG1hcmt1cC5cbiAgY29uc3QgY29udGVudCA9IHt9O1xuICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnRleHQgPSBlbnRyeS50ZXh0O1xuICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQucmVuZGVyZWRUZXh0ID0gZW50cnkucmVuZGVyZWRUZXh0O1xuICBpZiAoZW50cnkudmFsdWUgIT09IHVuZGVmaW5lZCkgY29udGVudC52YWx1ZSA9IGVudHJ5LnZhbHVlO1xuICBpZiAoZW50cnkucGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCkgY29udGVudC5wbGFjZWhvbGRlciA9IGVudHJ5LnBsYWNlaG9sZGVyO1xuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIGNvbnRlbnQub3V0ZXJIVE1MID0gZW50cnkub3V0ZXJIVE1MO1xuICBpZiAoT2JqZWN0LmtleXMoY29udGVudCkubGVuZ3RoKSBvdXQuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgLy8gTm90ZXMgLyBjb21tZW50cyBhdHRhY2hlZCB0byB0aGlzIGNhcHR1cmUuXG4gIGlmIChmZWVkYmFjay5sZW5ndGgpIG91dC5jb21tZW50cyA9IGZlZWRiYWNrLm1hcChzbGltQ29tbWVudCk7XG5cbiAgLy8gUmVtYWluaW5nIHN0cnVjdHVyZWQgbWV0YWRhdGEgYW4gYWdlbnQgbWF5IHdhbnQg4oCUIGNvcGllZCB0aHJvdWdoXG4gIC8vIHZlcmJhdGltIHNvIHRoaXMgZXhwb3J0IGlzIGFzIGNvbXBsZXRlIGFzIHRoZSBKU09OTCByb3cuIFdlIGFsbG93LWxpc3RcbiAgLy8gdGhlIGhlYXZ5L3N0cnVjdHVyZWQgZmllbGRzIHJhdGhlciB0aGFuIGR1bXBpbmcgdGhlIHdob2xlIEVudHJ5IHNvIHRoZVxuICAvLyBvdXRwdXQgb3JkZXJpbmcgc3RheXMgc3RhYmxlIGFuZCBvYnZpb3VzLlxuICBjb25zdCBtZXRhID0ge307XG4gIGNvbnN0IHBhc3N0aHJvdWdoID0gW1xuICAgIFwicmVjdFwiLCBcInZpZXdwb3J0XCIsIFwic3RhdGVzXCIsIFwiYXR0cnNcIiwgXCJoaW50c1wiLCBcImNvbXBvbmVudFwiLCBcImV2ZW50c1wiLFxuICAgIFwiYmVoYXZpb3JBdHRyc1wiLCBcImExMXlcIiwgXCJhc3NldHNcIiwgXCJsYXlvdXRDb250ZXh0XCIsIFwic3R5bGVzXCIsXG4gICAgXCJtYXRjaGVkUnVsZXNcIiwgXCJhbmNlc3RvcnNcIiwgXCJzY3JlZW5zaG90XCIsIFwidHJ1bmNhdGVkXCIsIFwic2Vzc2lvbklkXCIsXG4gICAgXCJjYW52YXNDbGlja1wiLCBcImVkaXRvclwiLCBcImRvbU11dGF0aW9uc1wiLCBcImlzQW5pbWF0aW5nXCIsXG4gIF07XG4gIGZvciAoY29uc3Qga2V5IG9mIHBhc3N0aHJvdWdoKSB7XG4gICAgaWYgKGVudHJ5W2tleV0gIT09IHVuZGVmaW5lZCkgbWV0YVtrZXldID0gZW50cnlba2V5XTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMobWV0YSkubGVuZ3RoKSBvdXQubWV0YSA9IG1ldGE7XG5cbiAgLy8gR3JvdXAgbWVtYmVyczogcmVjdXJzZSBzbyBlYWNoIGNoaWxkIGNhcHR1cmUgaXMgZnVsbHkgc2VyaWFsaXplZCB0b28uXG4gIC8vIEEgbWVtYmVyIG1heSBjYXJyeSBpdHMgb3duIGZlZWRiYWNrIHdoZW4gdGhlIGNhbGxlciBzdXBwbGllcyBhXG4gIC8vIHtlbnRyeSwgZmVlZGJhY2t9IHBhaXI7IGJhcmUgY2hpbGQgRW50cmllcyBzZXJpYWxpemUgd2l0aCBubyBjb21tZW50cy5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgb3V0Lm1lbWJlcnMgPSBtZW1iZXJzLm1hcCgobSkgPT4gc2VyaWFsaXplQ2FwdHVyZUZ1bGwobSwgb3B0cykpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFByZXR0eSBKU09OIHN0cmluZyBmb3IgdGhlIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiBidXR0b24uIFRyYWlsaW5nXG4vLyBuZXdsaW5lIHNvIGl0IHJvdW5kLXRyaXBzIGNsZWFubHkgdGhyb3VnaCBlZGl0b3JzIC8gYHBicGFzdGVgLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVKc29uID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT5cbiAgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXplQ2FwdHVyZUZ1bGwoY2FwdHVyZSwgb3B0cyksIG51bGwsIDIpICsgXCJcXG5cIjtcblxuLy8g4pSA4pSA4pSAIFNpbmdsZS1jYXB0dXJlIG1hcmtkb3duIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gTWF0Y2hlcyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIGVuZ2xpc2gvbWFya2Rvd24gc3VyZmFjZSBidXQgc2NvcGVkIHRvIG9uZVxuLy8gY2FwdHVyZS4gVXNlZnVsIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gcGFzdGUgYSBodW1hbi1yZWFkYWJsZSBjYXJkIHJhdGhlclxuLy8gdGhhbiByYXcgSlNPTi5cblxuY29uc3QgaGVhZGluZyA9IChlbnRyeSkgPT4ge1xuICBjb25zdCBuYW1lID1cbiAgICBlbnRyeS5hY2Nlc3NpYmxlTmFtZSB8fFxuICAgIGVudHJ5LnRlc3RJZCB8fFxuICAgIGVudHJ5LmlkIHx8XG4gICAgZW50cnkuc2VsZWN0b3IgfHxcbiAgICBlbnRyeS50YWcgfHxcbiAgICBcImNhcHR1cmVcIjtcbiAgY29uc3QgbGFiZWwgPSBlbnRyeS5uICE9PSB1bmRlZmluZWQgPyBgQ2FwdHVyZSAjJHtlbnRyeS5ufWAgOiBcIkNhcHR1cmVcIjtcbiAgcmV0dXJuIGAke2xhYmVsfTogJHtuYW1lfWA7XG59O1xuXG5jb25zdCByZW5kZXJQYXRocyA9IChwYXRocykgPT4ge1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhwYXRocykpIHtcbiAgICBsaW5lcy5wdXNoKGAtICoqJHtrfToqKiBcXGAke3Z9XFxgYCk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVUZXh0ID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgbGluZXMucHVzaChgIyAke2hlYWRpbmcoZW50cnkpfWAsIFwiXCIpO1xuICBpZiAoZW50cnkudXJsKSBsaW5lcy5wdXNoKGBQYWdlOiA8JHtlbnRyeS51cmx9PmAsIFwiXCIpO1xuICBpZiAoZW50cnkudGFnKSBsaW5lcy5wdXNoKGBFbGVtZW50OiBcXGA8JHtlbnRyeS50YWd9PlxcYGAsIFwiXCIpO1xuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgUGF0aHNcIiwgXCJcIiwgLi4ucmVuZGVyUGF0aHMocGF0aHMpKTtcbiAgfVxuXG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQgfHwgZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgVGV4dFwiLCBcIlwiKTtcbiAgICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBsaW5lcy5wdXNoKGBTb3VyY2U6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkudGV4dCl9YCk7XG4gICAgaWYgKGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkICYmIGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gZW50cnkudGV4dCkge1xuICAgICAgbGluZXMucHVzaChgUmVuZGVyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkucmVuZGVyZWRUZXh0KX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgTWFya3VwXCIsIFwiXCIsIFwiYGBgaHRtbFwiLCBlbnRyeS5vdXRlckhUTUwsIFwiYGBgXCIpO1xuICB9XG5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBOb3RlcyAmIGNvbW1lbnRzXCIsIFwiXCIpO1xuICAgIGZvciAoY29uc3QgZmIgb2YgZmVlZGJhY2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiO1xuICAgICAgY29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGggPyBgIF8oJHtmYi50YWdzLmpvaW4oXCIsIFwiKX0pX2AgOiBcIlwiO1xuICAgICAgbGluZXMucHVzaChgLSAke3RleHR9JHt0YWdzfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtZW1iZXJzLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBHcm91cGVkIHdpdGhcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lbWJlcnMpIHtcbiAgICAgIGNvbnN0IG1lID0gbm9ybWFsaXplQ2FwdHVyZShtKS5lbnRyeTtcbiAgICAgIGxpbmVzLnB1c2goYC0gJHtoZWFkaW5nKG1lKX0g4oCUIFxcYCR7bWUuc2VsZWN0b3IgPz8gbWUudGFnID8/IFwiP1wifVxcYGApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKFwiXFxuXCIpICsgXCJcXG5cIjtcbn07XG4iLAogICAgIi8vIFBpbmNoR3JhYiBzaWRlLXBhbmVsIFVJLiBSZWNlaXZlcyBjYXB0dXJlcyArIGhvdmVycyBmcm9tIHRoZSBjb250ZW50XG4vLyBzY3JpcHQ7IHJlbmRlcnMgdGhlIGNoYXQtYnViYmxlIHRpbWVsaW5lLCBleHBvcnRzLCB2YWxpZGF0ZXMsIGV0Yy5cbi8vXG4vLyBEZWNvbXBvc2VkIGludG8gc21hbGwgZmlsZXMgZm9yIGNsYXJpdHk6XG4vLyAgIOKAoiB0eXBlcy50cyAgICAgIOKAlCBzaGFyZWQgdHlwZXMsIG1lc3NhZ2UgcHJvdG9jb2xcbi8vICAg4oCiIGx1Y2lkZS50cyAgICAg4oCUIGljb24gcmVnaXN0cnlcbi8vICAg4oCiIHRoaXMgZmlsZSAgICAg4oCUIHdpcmUtdXAgLyByZW5kZXJpbmcgLyBleHBvcnQgYnVpbGRlcnNcbi8vXG4vLyBMb2FkZWQgYXMgdGhlIHNpZGUgcGFuZWwgcGFnZTogY2hyb21lLnNpZGVQYW5lbCBkZWZhdWx0X3BhdGguXG5cbmltcG9ydCB0eXBlIHtcbiAgQW5ub3RhdGlvblBheWxvYWQsIENzVG9QYW5lbCwgRW50cnksIEV4cG9ydERpYWdub3N0aWMsIEV4cG9ydE1hbmlmZXN0LCBGZWVkYmFja01lc3NhZ2UsIFBhZ2VNZXNzYWdlLFxuICBQYWdlU25hcHNob3QsIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5pbXBvcnQge0JVTkRMRURfU0tJTExTX1BSRVNFTlQsIEJVTkRMRURfU0tJTExfRklMRVN9IGZyb20gJy4vYnVuZGxlZC1za2lsbHMuZ2VuLnRzJztcbmltcG9ydCB7YnVpbGRBZ2VudFByb21wdEpzb25sLCBidWlsZEFnZW50UHJvdG9jb2xNZCwgdHlwZSBTa2lsbHNJbmRleH0gZnJvbSAnLi9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyc7XG5pbXBvcnQge3NlcmlhbGl6ZUNhcHR1cmVKc29ufSBmcm9tICcuL2V4cG9ydC1jYXB0dXJlLm1qcyc7XG5cbigoKSA9PiB7XG4gIGNvbnN0IExPRyA9ICdbUGluY2hHcmFiL3NwXSc7XG4gIGNvbnN0IFBSRUZTX1NUT1JBR0VfTkFNRSA9ICdwaW5jaGdyYWIucHJlZnMudjInO1xuICBjb25zdCBXT1JLU1BBQ0VTX0tFWSA9ICdwaW5jaGdyYWIud29ya3NwYWNlcy52MSc7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuXG4gIC8vIOKUgOKUgOKUgCBUZW1wbGF0ZSByZXNvdXJjZSBsb2FkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEVhcmxpZXIgdGhlIHRlbXBsYXRlcyB3ZXJlIGJha2VkIGFzIHN0cmluZyBjb25zdGFudHMgaW50byB0aGlzIElJRkVcbiAgLy8gKH4zNjBLQiBhY3Jvc3MgREVTSUdOICsgU0tJTEwpLiBUaGF0IGJsb2F0ZWQgdGhlIHNpZGVwYW5lbCBidW5kbGUgdG9cbiAgLy8gfjEuOTVNQiBhbmQgc2xvd2VkIGZpcnN0LW9wZW4gcGFyc2UgdGltZSBub3RpY2VhYmx5LiBUaGV5IG5vdyBzaGlwIGFzXG4gIC8vIHNlcGFyYXRlIGAubWRgIGZpbGVzIHVuZGVyIGBleHRlbnNpb24vdGVtcGxhdGVzL2AgYW5kIGxvYWQgb24gZGVtYW5kXG4gIC8vIHZpYSBmZXRjaCDigJQgd2hlbiB0aGUgdXNlciBvcGVucyB0aGUgZWRpdG9yIG1vZGFsLCBvciB3aGVuIHRoZSBleHBvcnRcbiAgLy8gcGlwZWxpbmUgbmVlZHMgdG8gYnVuZGxlIGEgZmFsbGJhY2suXG4gIC8vXG4gIC8vIENhY2hlIHJlc3VsdHMgaW4tcHJvY2VzcyBzbyByZXBlYXQgcmVhZHMgKG1vZGFsIG9wZW4g4oaSIGNsb3NlIOKGkiByZW9wZW4sXG4gIC8vIG9yIHNlcXVlbnRpYWwgZXhwb3J0cykgZG9uJ3QgcmUtZmV0Y2guXG4gIGNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBURU1QTEFURV9GSUxFUyA9IHtcbiAgICBkZXNpZ25UZW1wbGF0ZTogJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsXG4gICAgc2tpbGxUZW1wbGF0ZTogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsXG4gICAgbG9jYWxEZXNpZ246ICdsb2NhbC5ERVNJR04ubWQnLFxuICAgIGxvY2FsU2tpbGw6ICdsb2NhbC5TS0lMTC5tZCcsXG4gIH0gYXMgY29uc3Q7XG4gIHR5cGUgVGVtcGxhdGVLZXkgPSBrZXlvZiB0eXBlb2YgVEVNUExBVEVfRklMRVM7XG4gIGNvbnN0IHRlbXBsYXRlVXJsID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gSW5zaWRlIHRoZSBleHRlbnNpb24sIHRoZSBzaWRlcGFuZWwgcnVucyBmcm9tXG4gICAgLy8gY2hyb21lLWV4dGVuc2lvbjovLzxpZD4vc2lkZXBhbmVsLmh0bWwsIHNvIHJlc291cmNlcyByZXNvbHZlIHZpYVxuICAgIC8vIGNocm9tZS5ydW50aW1lLmdldFVSTC4gVGhlIFBsYXl3cmlnaHQgc3RhdGljLXNlcnZlciB0ZXN0cyBzZXJ2ZVxuICAgIC8vIGAvdGVtcGxhdGVzLzxmaWxlPmAgZnJvbSB0aGUgZXh0ZW5zaW9uIHJvb3QgZGlyZWN0bHksIHNvIGFcbiAgICAvLyByZWxhdGl2ZSBVUkwgd29ya3MgdGhlcmUgYXMgYSBmYWxsYmFjay5cbiAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCkge1xuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChgdGVtcGxhdGVzLyR7ZmlsZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZXMvJHtmaWxlfWA7XG4gIH07XG4gIGNvbnN0IGxvYWRUZW1wbGF0ZSA9IGFzeW5jIChrZXk6IFRlbXBsYXRlS2V5KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAoIVRFTVBMQVRFU19QUkVTRU5UW2tleV0pIHJldHVybiAnJztcbiAgICBjb25zdCBmaWxlID0gVEVNUExBVEVfRklMRVNba2V5XTtcbiAgICBjb25zdCBjYWNoZWQgPSB0ZW1wbGF0ZUNhY2hlLmdldChmaWxlKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRlbXBsYXRlVXJsKGZpbGUpKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgdGVtcGxhdGUgZmV0Y2ggZmFpbGVkOiAke2ZpbGV9YCwgZXJyKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG4gIC8vIEVmZmVjdGl2ZSBjb250ZW50IHVzZWQgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSBhbmQgdGhlIG1vZGFsLiBXaGVuIHRoZVxuICAvLyB1c2VyIGhhcyBjdXN0b21pemVkIHZpYSB0aGUgdGV4dGFyZWEvdXBsb2FkLCB0aGF0IHdpbnM7IG90aGVyd2lzZSB0aGVcbiAgLy8gUExBSU4gU1RPQ0sgdGVtcGxhdGUuIFRoZSBvbGQgYGxvY2FsLipgIGRldi1vdmVycmlkZSBwcmVmZXJlbmNlIGlzXG4gIC8vIGdvbmUgKG9wZXJhdG9yIHJ1bGluZyAyMDI2LTA3LTExKTogaXQgc2lsZW50bHkgc3Vic3RpdHV0ZWQgdGhlXG4gIC8vIGRldmVsb3BlcidzIG93biBicmFuZCBmaWxlcyBhcyB0aGUgXCJkZWZhdWx0XCIsIGNvbnRhbWluYXRpbmcgZXhwb3J0c1xuICAvLyB0aGF0IHRoZSBtYW5pZmVzdCBzdGlsbCBmbGFnZ2VkIGFzIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50LlxuICBjb25zdCByZXNvbHZlRGVzaWduQ29udGVudCA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmIChwcmVmcy5kZXNpZ25NZCAmJiBwcmVmcy5kZXNpZ25NZC50cmltKCkpIHJldHVybiBwcmVmcy5kZXNpZ25NZDtcbiAgICByZXR1cm4gbG9hZFRlbXBsYXRlKCdkZXNpZ25UZW1wbGF0ZScpO1xuICB9O1xuICBjb25zdCByZXNvbHZlU2tpbGxDb250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLnNraWxsTWQgJiYgcHJlZnMuc2tpbGxNZC50cmltKCkpIHJldHVybiBwcmVmcy5za2lsbE1kO1xuICAgIHJldHVybiBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKGkiBwcmVmcy57ZGVzaWduTWR8c2tpbGxNZH0gaXNcbiAgLy8gZW1wdHkgYW5kIHdlJ3JlIGZhbGxpbmcgYmFjayB0byBhIGJ1bmRsZWQgdGVtcGxhdGUvbG9jYWwgcmVzb3VyY2UuXG4gIGNvbnN0IGlzVXNpbmdUZW1wbGF0ZURlc2lnbiA9ICgpOiBib29sZWFuID0+ICFwcmVmcy5kZXNpZ25NZCB8fCAhcHJlZnMuZGVzaWduTWQudHJpbSgpO1xuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVTa2lsbCA9ICgpOiBib29sZWFuID0+ICFwcmVmcy5za2lsbE1kIHx8ICFwcmVmcy5za2lsbE1kLnRyaW0oKTtcblxuICAvLyBWZW5kb3JlZCB0aGlyZC1wYXJ0eSBza2lsbCByZXNvdXJjZXMgKGltcGVjY2FibGUgcmVmZXJlbmNlIHNldCArXG4gIC8vIHBlcmNlcHRpb24tZmlyc3QtZGVzaWduKSwgc2hpcHBlZCB1bmRlciBleHRlbnNpb24vc2tpbGxzLyBieSB0aGUgYnVpbGRcbiAgLy8gYW5kIGlubGluZWQgaW50byBidW5kbGUgZXhwb3J0cy4gU2FtZSBsYXp5IGZldGNoICsgY2FjaGUgcGF0dGVybiBhcyB0aGVcbiAgLy8gdGVtcGxhdGVzIGFib3ZlLlxuICBjb25zdCBidW5kbGVkU2tpbGxDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGxvYWRCdW5kbGVkU2tpbGxGaWxlID0gYXN5bmMgKGV4dFBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4gPT4ge1xuICAgIGNvbnN0IGNhY2hlZCA9IGJ1bmRsZWRTa2lsbENhY2hlLmdldChleHRQYXRoKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVybCA9IGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRVUkwgPyBjaHJvbWUucnVudGltZS5nZXRVUkwoZXh0UGF0aCkgOiBleHRQYXRoO1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIGJ1bmRsZWRTa2lsbENhY2hlLnNldChleHRQYXRoLCB0ZXh0KTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgYGJ1bmRsZWQgc2tpbGwgZmV0Y2ggZmFpbGVkOiAke2V4dFBhdGh9YCwgZXJyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RvcmFnZSBhZGFwdGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBTdG9yZSA9IHtcbiAgICBhc3luYyBnZXQ8VD4oa2V5OiBzdHJpbmcsIGZhbGxiYWNrOiBUKTogUHJvbWlzZTxUPiB7XG4gICAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnN0b3JhZ2U/LmxvY2FsKSB7XG4gICAgICAgIHRyeSB7IGNvbnN0IG8gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoa2V5KTsgcmV0dXJuIChvW2tleV0gYXMgVCkgPz8gZmFsbGJhY2s7IH1cbiAgICAgICAgY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbiAgICAgIH1cbiAgICAgIHRyeSB7IGNvbnN0IHIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpOyByZXR1cm4gciA9PT0gbnVsbCA/IGZhbGxiYWNrIDogKEpTT04ucGFyc2UocikgYXMgVCk7IH1cbiAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgfSxcbiAgICBhc3luYyBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnN0b3JhZ2U/LmxvY2FsKSB7XG4gICAgICAgIHRyeSB7IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7W2tleV06IHZhbHVlfSk7IHJldHVybjsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0sXG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIERPTSByZWZzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCAkID0gPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHM6IHN0cmluZyk6IFQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKSBhcyBUO1xuICBjb25zdCBsaXN0ID0gJCgnW2RhdGEtbGlzdF0nKTtcbiAgY29uc3QgY29tcG9zZXIgPSAkPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCdbZGF0YS1jb21wb3Nlcl0nKTtcbiAgY29uc3Qgc3RhdHVzID0gJCgnW2RhdGEtc3RhdHVzXScpO1xuICBjb25zdCBzZWFyY2ggPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1zZWFyY2hdJyk7XG4gIC8vIEN0cmwrRiB2aXN1YWwtZmluZCBiYXIgKGRpc3RpbmN0IGZyb20gdGhlIGhlYWRlciBzZWFyY2gsIHdoaWNoIG9wZW5zIHRoZVxuICAvLyBjb21tYW5kIHBhbGV0dGUpLiBNYXkgYmUgYWJzZW50IGluIHZlcnkgb2xkIGNhY2hlZCBtYXJrdXAsIHNvIGNvbnN1bWVyc1xuICAvLyBudWxsLWd1YXJkLlxuICBjb25zdCBmaW5kQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWZpbmQtYmFyXScpO1xuICBjb25zdCBmaW5kSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1maW5kXScpO1xuICBjb25zdCBmaW5kQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZmluZC1jb3VudF0nKTtcbiAgLy8gQ2Fub25pY2FsaXplIGtleWJvYXJkLXNob3J0Y3V0IHBpbGxzIHBlciBwbGF0Zm9ybS4gRXZlcnkgc2hvcnRjdXQgcGlsbFxuICAvLyBpcyBhdXRob3JlZCBpbiB0aGUgY2Fub25pY2FsIENtZC1mb3JtIChlYWNoIHRva2VuIGNhcGl0YWxpemVkLCBqb2luZWRcbiAgLy8gd2l0aCAnKyc6IEFsdCtDbGljaywgQ21kK0ssIENtZCtTaGlmdCtaKTsgb24gbm9uLU1hYyB3ZSBzd2FwIHRoZSBsZWFkaW5nXG4gIC8vIENtZCBtb2RpZmllciBmb3IgQ3RybC4gUGlsbHMgb3B0IGluIHZpYSBkYXRhLW1vZC0qIHNvIGEgc3RyaW5nIGxpa2UgdGhlXG4gIC8vICdBbHQr4oCmJyBwaWxscyAod2hpY2ggbmV2ZXIgY2FycnkgQ21kKSBhcmUgbGVmdCB1bnRvdWNoZWQuXG4gIGNvbnN0IGlzTWFjID0gL01hY3xpUGhvbmV8aVBhZC9pLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtIHx8IG5hdmlnYXRvci51c2VyQWdlbnQgfHwgJycpO1xuICBpZiAoIWlzTWFjKSB7XG4gICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50Pigna2JkW2RhdGEtbW9kLWtdLCBrYmRbZGF0YS1tb2Qtel0sIGtiZFtkYXRhLW1vZC1zaGlmdC16XScpKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IChlbC50ZXh0Q29udGVudCA/PyAnJykucmVwbGFjZSgvXkNtZFxcYi8sICdDdHJsJyk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGltcG9ydEZpbGUgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCcjaW1wb3J0LWZpbGUnKTtcbiAgY29uc3Qgc3RhdHNFbCA9ICQoJ1tkYXRhLXN0YXRzXScpO1xuICBjb25zdCBzdGFyc0VsID0gJCgnW2RhdGEtc3RhcnNdJyk7XG4gIGNvbnN0IHRvb2x0aXBFbCA9ICQoJ1tkYXRhLXRvb2x0aXBdJyk7XG4gIGNvbnN0IGRyaWxsZG93bkVsID0gJCgnW2RhdGEtZHJpbGxkb3duXScpO1xuICBjb25zdCBkcmF3ZXIgPSAkKCdbZGF0YS1kcmF3ZXJdJyk7XG4gIGNvbnN0IHBhbGV0dGUgPSAkKCdbZGF0YS1wYWxldHRlXScpO1xuICBjb25zdCBwYWxldHRlSW5wdXQgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1wYWxldHRlLWlucHV0XScpO1xuICBjb25zdCBwYWxldHRlTGlzdCA9ICQoJ1tkYXRhLXBhbGV0dGUtbGlzdF0nKTtcbiAgY29uc3QgY29tcFdvcmRzID0gJCgnW2RhdGEtY29tcC13b3Jkc10nKTtcbiAgY29uc3QgY29tcFRva2VucyA9ICQoJ1tkYXRhLWNvbXAtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0VG9rZW5zID0gJCgnW2RhdGEtc3RhdC10b2tlbnNdJyk7XG4gIGNvbnN0IHN0YXRXb3JkcyA9ICQoJ1tkYXRhLXN0YXQtd29yZHNdJyk7XG4gIGNvbnN0IHdzU2VsZWN0ID0gJDxIVE1MU2VsZWN0RWxlbWVudD4oJ1tkYXRhLXdvcmtzcGFjZV0nKTtcbiAgY29uc3Qgd3NMaXN0ID0gJCgnW2RhdGEtd3MtbGlzdF0nKTtcbiAgY29uc3Qgd3NOYW1lID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtd3MtbmFtZV0nKTtcblxuICBjb25zdCBtb3VudEljb25zID0gKHJvb3Q6IFBhcmVudE5vZGUgPSBkb2N1bWVudCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgZWwgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtaWNvbl0nKSkge1xuICAgICAgY29uc3QgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29uJyk7XG4gICAgICBjb25zdCBzaXplID0gTnVtYmVyKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zaXplJykgPz8gMTYpO1xuICAgICAgaWYgKG5hbWUgJiYgUEdfSUNPTlMuaGFzKG5hbWUpKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gICAgfVxuICB9O1xuICBtb3VudEljb25zKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIFByZWZzID0ge1xuICAgIGluY2x1ZGVPdXRlckhUTUw6IGJvb2xlYW47XG4gICAgaW5jbHVkZU1hdGNoZWRSdWxlczogYm9vbGVhbjtcbiAgICBpbmNsdWRlU3R5bGVzOiBib29sZWFuO1xuICAgIG1pbmlmeTogYm9vbGVhbjtcbiAgICBhdXRvU2Nyb2xsVG9Ib3ZlcmVkOiBib29sZWFuO1xuICAgIHVzZVNjcmVlbnNob3RzOiBib29sZWFuO1xuICAgIHNwYWNpbmdPdmVybGF5OiBib29sZWFuO1xuICAgIGhvdmVyU25hcDogYm9vbGVhbjtcbiAgICBhdXRvU2NyZWVuc2hvdDogYm9vbGVhbjtcbiAgICAvLyBDb21tYS1zZXBhcmF0ZWQgaG9zdCBwYXR0ZXJucyAoc3Vic3RyaW5nIG1hdGNoKS4gSG9zdHMgaW4gdGhpcyBsaXN0XG4gICAgLy8gc2tpcCB0aGUgZW50aXJlIHNjcmVlbnNob3QgcGlwZWxpbmUg4oCUIHVzZWZ1bCBmb3Igc2Vuc2l0aXZlIHBhZ2VzXG4gICAgLy8gKGJhbmtpbmcsIGludGVybmFsIGFkbWluKSB3aGVyZSB0aGUgdXNlciBkb2Vzbid0IHdhbnQgUE5HcyBsYW5kaW5nXG4gICAgLy8gb24gZGlzay5cbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiBzdHJpbmc7XG4gICAgLy8gSW5saW5lIERFU0lHTi5tZCBjb250ZW50IHRoZSB1c2VyIHBhc3RlZCBvciB1cGxvYWRlZCB2aWEgdGhlIHNpZGVcbiAgICAvLyBwYW5lbCBzZXR0aW5ncy4gRGVmYXVsdHMgdG8gYSB0ZW1wbGF0ZWQgcGxhY2Vob2xkZXIgc28gb3V0LW9mLXRoZS1cbiAgICAvLyBib3ggZXhwb3J0cyBhbHdheXMgaW5jbHVkZSBhIERFU0lHTi5tZCDigJQgdGhlIGNvbnN1bWVyIExMTSBjYW5cbiAgICAvLyBlaXRoZXIgd29yayBmcm9tIHRoZSBwbGFjZWhvbGRlciAoYW5kIGFzayBmb3IgdGhlIHJlYWwgb25lKSBvclxuICAgIC8vIGZyb20gYSB1c2VyLWN1c3RvbWl6ZWQgY29weS4gVGhlIHNldHRpbmdzIFVJIGZsYWdzIHRoaXMgYmFubmVyLVxuICAgIC8vIHN0eWxlIHdoZW4gdGhlIHZhbHVlIHN0aWxsIG1hdGNoZXMgdGhlIHRlbXBsYXRlIHNvIHRoZSB1c2VyXG4gICAgLy8ga25vd3MgdG8gZmlsbCBpdCBpbi5cbiAgICBkZXNpZ25NZDogc3RyaW5nO1xuICAgIC8vIFJlc29sdmVkIHBhdGggdGhlIHJlY2VpdmVyIHNob3VsZCByZWFkIERFU0lHTi5tZCBmcm9tLiBEZWZhdWx0c1xuICAgIC8vIHRvIGB+Ly5hZ2VudHMvREVTSUdOLm1kYDsgdXNlciBjYW4gb3ZlcnJpZGUgcGVyLW1hY2hpbmUuXG4gICAgZGVzaWduUGF0aDogc3RyaW5nO1xuICAgIC8vIFJlc29sdmVkIHBhdGggb2YgdGhlIFBpbmNoR3JhYiBVSSBza2lsbCBvbiB0aGUgcmVjZWl2ZXInc1xuICAgIC8vIGZpbGVzeXN0ZW0uIFRoZSBza2lsbCBjb250ZW50IGl0c2VsZiBpcyBidW5kbGVkIGlubGluZSBpbnRvIHRoZVxuICAgIC8vIGFyY2hpdmUgKHNlZSBgc2tpbGxNZGApLCBzbyB0aGlzIGlzIGEgaGludCBmb3IgcmVjZWl2ZXJzIHRoYXRcbiAgICAvLyB3YW50IHRvIHBlcnNpc3QgdGhlIHNraWxsIGF0IGEgY2Fub25pY2FsIGxvY2F0aW9uLlxuICAgIHNraWxsUGF0aDogc3RyaW5nO1xuICAgIC8vIElubGluZSBVSS1za2lsbCBjb250ZW50LiBEZWZhdWx0IGlzIHRoZSBidW5kbGVkIFBpbmNoR3JhYiB0cmlhZ2VcbiAgICAvLyBza2lsbCB0ZW1wbGF0ZTsgdXNlciBjYW4gY3VzdG9taXplIHZpYSBzZXR0aW5ncyBwYXN0ZS91cGxvYWQuXG4gICAgLy8gQnVuZGxlZCBpbnRvIHRoZSBhcmNoaXZlIGF0IGAuLy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGAuXG4gICAgc2tpbGxNZDogc3RyaW5nO1xuICAgIC8vIFdoZW4gdHJ1ZSwgZmlyZSBhIGZyZXNoIHBhZ2Ugc2NyZWVuc2hvdCBvbiBFVkVSWSBjYXB0dXJlIHJhdGhlclxuICAgIC8vIHRoYW4gb25jZSBwZXIgKHdvcmtzcGFjZSwgdXJsKSB0dXBsZS4gVXNlZnVsIGZvciBjYXB0dXJpbmcgYVxuICAgIC8vIG11bHRpLXN0ZXAgZmxvdyB3aGVyZSB0aGUgcGFnZSBzdGF0ZSBjaGFuZ2VzIGJldHdlZW4gY2FwdHVyZXMuXG4gICAgLy8gRGVmYXVsdCBmYWxzZSDigJQgbW9zdCB1c2VycyB3YW50IHRoZSBkZWZhdWx0IGZpcnN0LW9ubHkgYmVoYXZpb3JcbiAgICAvLyBzaW5jZSBwYWdlIHNjcmVlbnNob3RzIGFyZSBsYXJnZSBhbmQgdGhlIGZpcnN0IG9uZSBhbHJlYWR5IGdpdmVzXG4gICAgLy8gYSBzZXNzaW9uLWxldmVsIHJlZmVyZW5jZS5cbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGJvb2xlYW47XG4gICAgLy8gU3VwcHJlc3MgQ2hyb21lJ3MgZG93bmxvYWQgYnViYmxlIHdoaWxlIFBpbmNoR3JhYiB3cml0ZXMgaXRzIG93blxuICAgIC8vIGZpbGVzIChzY3JlZW5zaG90cyArIGV4cG9ydHMpLiBSZXF1aXJlcyB0aGUgb3B0aW9uYWwgYGRvd25sb2Fkcy51aWBcbiAgICAvLyBwZXJtaXNzaW9uLiBEZWZhdWx0IE9OIGFzIGludGVudDsgdW50aWwgdGhlIHBlcm1pc3Npb24gaXMgYWN0dWFsbHlcbiAgICAvLyBncmFudGVkIChuZWVkcyBhIHVzZXIgZ2VzdHVyZSDigJQgdGhlIG51ZGdlIGJhbm5lciBvciB0aGUgc2V0dGluZ3NcbiAgICAvLyBjaGVja2JveCksIHNhdmVzIHN0YXkgdmlzaWJsZS5cbiAgICBxdWlldFNhdmVzOiBib29sZWFuO1xuICAgIC8vIFRoZSB1c2VyIGRpc21pc3NlZCB0aGUgcXVpZXQtc2F2ZXMgbnVkZ2UgYmFubmVyIOKAlCBuZXZlciByZS1zaG93IGl0LlxuICAgIHF1aWV0TnVkZ2VEaXNtaXNzZWQ6IGJvb2xlYW47XG4gICAgLy8gQnVuZGxlIHRoZSB2ZW5kb3JlZCB0aGlyZC1wYXJ0eSBkZXNpZ24gc2tpbGxzIChpbXBlY2NhYmxlIHJlZmVyZW5jZVxuICAgIC8vIHNldCArIHBlcmNlcHRpb24tZmlyc3QtZGVzaWduKSBwbHVzIHNraWxscy1pbmRleC5qc29uIGludG8gYXJjaGl2ZVxuICAgIC8vIGV4cG9ydHMuIE9uIGJ5IGRlZmF1bHQ6IHRoZSBTZW5kLXRvLUFnZW50IHByb3RvY29sJ3Mgc2tpbGwtbWFwcGluZ1xuICAgIC8vIHBoYXNlIGFzc3VtZXMgdGhlaXIgcHJlc2VuY2UuIH4xLjIgTUIgb2YgbWFya2Rvd24gcGVyIGJ1bmRsZS5cbiAgICBidW5kbGVTa2lsbHM6IGJvb2xlYW47XG4gICAgLy8gQnVuZGxlIHRoZSBmdWxsIHNlcmlhbGl6ZWQgSFRNTCBvZiBlYWNoIGNhcHR1cmVkIHBhZ2UgdW5kZXIgcGFnZXMvLlxuICAgIC8vIE9mZiBieSBkZWZhdWx0IChkb2N1bWVudHMgY2FuIGJlIGh1Z2UpOyBjb2xsZWN0ZWQgbGF6aWx5IGF0IGV4cG9ydFxuICAgIC8vIHRpbWUgZnJvbSBsaXZlIHRhYnMsIG5ldmVyIHBlcnNpc3RlZCB0byBjaHJvbWUuc3RvcmFnZS5cbiAgICBpbmNsdWRlUGFnZUhUTUw6IGJvb2xlYW47XG4gIH07XG4gIGNvbnN0IERFRkFVTFRfUFJFRlM6IFByZWZzID0ge1xuICAgIGluY2x1ZGVPdXRlckhUTUw6IHRydWUsXG4gICAgaW5jbHVkZU1hdGNoZWRSdWxlczogdHJ1ZSxcbiAgICBpbmNsdWRlU3R5bGVzOiB0cnVlLFxuICAgIC8vIERlZmF1bHQgdG8gbWluaWZpZWQgZXhwb3J0cyDigJQgbW9zdCBhZ2VudHMgd2FudCB0aGUgc21hbGxlc3RcbiAgICAvLyB0b2tlbi1mb290cHJpbnQgcGF5bG9hZC4gRXhpc3RpbmcgdXNlcnMnIHNhdmVkIHByZWZzIGFyZSBtZXJnZWQgb3ZlclxuICAgIC8vIHRoaXMgZGVmYXVsdCBpbiBsb2FkQWxsKCksIHNvIG9ubHkgTkVXL3Vuc2V0IGluc3RhbGxzIHNlZSB0aGUgZmxpcC5cbiAgICBtaW5pZnk6IHRydWUsXG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogdHJ1ZSxcbiAgICB1c2VTY3JlZW5zaG90czogdHJ1ZSxcbiAgICBzcGFjaW5nT3ZlcmxheTogZmFsc2UsXG4gICAgaG92ZXJTbmFwOiB0cnVlLFxuICAgIGF1dG9TY3JlZW5zaG90OiB0cnVlLFxuICAgIHNraXBTY3JlZW5zaG90SG9zdHM6ICcnLFxuICAgIC8vIGRlc2lnbk1kIC8gc2tpbGxNZCBkZWZhdWx0IHRvICcnIHdoaWNoIHRoZSByZXNvbHZlciB0cmVhdHMgYXNcbiAgICAvLyBcImZhbGwgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZSBhdCBleHBvcnQgdGltZVwiLiBTdG9yaW5nIHRoZVxuICAgIC8vIGVtcHR5IHN0cmluZyBrZWVwcyBjaHJvbWUuc3RvcmFnZSBzbWFsbCBhbmQgbGV0cyBgaXNVc2luZ1RlbXBsYXRlKmBcbiAgICAvLyBiZSBhIGNoZWFwIHN5bmNocm9ub3VzIGNoZWNrLlxuICAgIGRlc2lnbk1kOiAnJyxcbiAgICBkZXNpZ25QYXRoOiAnfi8uYWdlbnRzL0RFU0lHTi5tZCcsXG4gICAgc2tpbGxQYXRoOiAnfi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLFxuICAgIHNraWxsTWQ6ICcnLFxuICAgIHBhZ2VTaG90UGVyQ2FwdHVyZTogZmFsc2UsXG4gICAgcXVpZXRTYXZlczogdHJ1ZSxcbiAgICBxdWlldE51ZGdlRGlzbWlzc2VkOiBmYWxzZSxcbiAgICBidW5kbGVTa2lsbHM6IHRydWUsXG4gICAgaW5jbHVkZVBhZ2VIVE1MOiBmYWxzZSxcbiAgfTtcblxuICAvLyBSZXdyaXRlIHRoZSBgbmFtZTpgIGZpZWxkIGluIGEgU0tJTEwubWQncyBZQU1MIGZyb250bWF0dGVyLiBUaGVcbiAgLy8gdXNlcidzIHNvdXJjZS1vZi10cnV0aCBTS0lMTC5tZCBpcyBjYXRhbG9ndWVkIHVuZGVyIHdoYXRldmVyIG5hbWVcbiAgLy8gdGhlaXIgd2lkZXIgYC5hZ2VudHMvc2tpbGxzL2AgdHJlZSB1c2VzIChvZnRlbiBgdWlgKTsgdGhlIGJ1bmRsZWRcbiAgLy8gYXJjaGl2ZSBjb3B5IHNob3VsZCBhbHdheXMgaWRlbnRpZnkgYXMgYFBpbmNoR3JhYmAgc28gYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFkaW5nIHRoZSBtYW5pZmVzdCBkb2Vzbid0IGdldCBjb25mdXNlZCBhYm91dCB3aGljaCBza2lsbFxuICAvLyBmaWxlIGFwcGxpZXMuIE9ubHkgdGhlIEZJUlNUIHRvcC1vZi1maWxlIGBuYW1lOmAgbGluZSB3aXRoaW4gdGhlXG4gIC8vIGxlYWRpbmcgYC0tLWAgYmxvY2sgaXMgdG91Y2hlZC5cbiAgY29uc3QgcmVicmFuZFNraWxsTmFtZSA9IChtZDogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIC8vIFRoZSBmcm9udG1hdHRlciBibG9jaywgaWYgcHJlc2VudCwgaXMgYmV0d2VlbiBsZWFkaW5nIGAtLS1cXG5gXG4gICAgLy8gYW5kIHRoZSBuZXh0IGBcXG4tLS1cXG5gLiBBbnl0aGluZyBlbHNlIChubyBmcm9udG1hdHRlciwgbmFtZSBub3RcbiAgICAvLyBvbiBhIHNpbmdsZSBsaW5lLCBldGMuKSByZXR1cm5zIHVuY2hhbmdlZCDigJQgYmV0dGVyIHRvIHNoaXAgdGhlXG4gICAgLy8gb3JpZ2luYWwgdGhhbiByaXNrIGNvcnJ1cHRpbmcgdGhlIGZpbGUuXG4gICAgY29uc3QgbSA9IG1kLm1hdGNoKC9eLS0tXFxyP1xcbihbXFxzXFxTXSo/KVxccj9cXG4tLS1cXHI/XFxuLyk7XG4gICAgaWYgKCFtKSByZXR1cm4gbWQ7XG4gICAgY29uc3QgZm0gPSBtWzFdITtcbiAgICBjb25zdCByZWJyYW5kZWRGbSA9IGZtLnJlcGxhY2UoL15uYW1lOlxccyouKyQvbSwgYG5hbWU6ICR7bmV3TmFtZX1gKTtcbiAgICBpZiAocmVicmFuZGVkRm0gPT09IGZtKSByZXR1cm4gbWQ7IC8vIG5vIGBuYW1lOmAgZmllbGQ7IG5vdGhpbmcgdG8gZG9cbiAgICByZXR1cm4gbWQucmVwbGFjZShtWzBdLCBgLS0tXFxuJHtyZWJyYW5kZWRGbX1cXG4tLS1cXG5gKTtcbiAgfTtcbiAgdHlwZSBXb3Jrc3BhY2UgPSB7bmFtZTogc3RyaW5nOyBjcmVhdGVkQXQ6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9O1xuICAvLyBPbmUgYXJjaGl2ZWQgc3RhdGUgb2YgYSB3b3Jrc3BhY2UgKGNhcHR1cmVkIGp1c3QgYmVmb3JlIGEgQ2xlYXItYWxsKS5cbiAgLy8gYHNob3RzYCBpcyB0aGUgdGh1bWJuYWlsIG1hcCAoZnVsbC1yZXMgUE5HcyBhcmUgc2Vzc2lvbi1vbmx5IGFuZCBub3RcbiAgLy8gYXJjaGl2ZWQpLiBSZXN0b3JhYmxlIGZyb20gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMuXG4gIHR5cGUgV29ya3NwYWNlU25hcHNob3QgPSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICB0czogc3RyaW5nO1xuICAgIG1lc3NhZ2VzOiBQYW5lbE1lc3NhZ2VbXTtcbiAgICBzaG90czogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBjb21tZW50czogbnVtYmVyO1xuICB9O1xuXG4gIGxldCBtZXNzYWdlczogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgbGV0IGxpdmVUYWJVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgbGl2ZVRhYlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBzZWxlY3RvclZhbGlkaXR5ID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4gfCAnZGlmZi1wYWdlJz4oKTtcbiAgY29uc3Qgc2VsZWN0b3JFcnJvcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBpbnNlcnRCZWZvcmU6IHtjdXJyZW50OiBzdHJpbmcgfCBudWxsOyBjb21tZW50OiBib29sZWFufSA9IHtjdXJyZW50OiBudWxsLCBjb21tZW50OiBmYWxzZX07XG4gIGxldCBzZWFyY2hRdWVyeSA9ICcnO1xuICBsZXQgbGFzdEFjdGl2ZVNlbGVjdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHN0aWNreVRpbWVyID0gMDtcbiAgbGV0IFNUSUNLWV9UVExfTVMgPSA1XzAwMDtcbiAgbGV0IHBhbmVsSG92ZXJlZCA9IGZhbHNlO1xuICBsZXQgcGhhbnRvbVRhcmdldDoge3NlbGVjdG9yOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHRhZz86IHN0cmluZzsgcmVjdD86IERPTVJlY3R9IHwgbnVsbCA9IG51bGw7XG4gIGxldCBwZW5kaW5nTXVsdGk6IEVudHJ5W10gPSBbXTtcbiAgY29uc3Qgc2hvdHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAvLyBGdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwgcGVyIHNlbGVjdG9yLiBOT1QgcGVyc2lzdGVkIHRvXG4gIC8vIGNocm9tZS5zdG9yYWdlIChjYXAgcHJlc3N1cmUg4oCUIDEwMCBjYXB0dXJlcyDDlyA4MCBLQiBlYWNoID0gOCBNQiksIHNvXG4gIC8vIGl0J3Mgb25seSBhdmFpbGFibGUgZm9yIHRoZSBjdXJyZW50IHNlc3Npb24ncyBhcmNoaXZlIGV4cG9ydC4gQ2xlYXJlZFxuICAvLyBvbiB3b3Jrc3BhY2Ugc3dpdGNoLlxuICBjb25zdCBzaG90c0Z1bGwgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAvLyBUcmFjayB3aGljaCAod29ya3NwYWNlLCBwYWdlLXVybCkgdHVwbGVzIGFscmVhZHkgZmlyZWQgYSBwYWdlIHNob3Qgc28gd2VcbiAgLy8gZG9uJ3QgcmUtc2hvb3QgdGhlIGVudGlyZSBwYWdlIG9uIGV2ZXJ5IGNhcHR1cmUuIFJlc2V0IG9uIHdvcmtzcGFjZVxuICAvLyBzd2l0Y2gg4oCUIG5vIGRheSBrZXksIHRoZSBkZWR1cGUgaXMgcGVyLXNlc3Npb24uXG4gIGNvbnN0IHBhZ2VTaG90c0ZpcmVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IHBhZ2VTaG90S2V5ID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IGAke2FjdGl2ZVdzfToke3VybH1gO1xuICAvLyBMYXN0IHN1Y2Nlc3NmdWwgZXhwb3J0IOKAlCBib3RoIHRoZSB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoc2hvd24gdG8gdGhlXG4gIC8vIHVzZXIpIGFuZCB0aGUgT1MtYWJzb2x1dGUgcGF0aCAoY29waWVkIGJ5IHRoZSBcIkNvcHkgYXMgcGF0aFwiIGJ1dHRvbikuXG4gIC8vIFVwZGF0ZWQgb24gSlNPTkwvTUQvWklQL3NjcmVlbnNob3Qgc2F2ZXMuXG4gIGNvbnN0IGxhc3RFeHBvcnQ6IHtyZWxQYXRoOiBzdHJpbmcgfCBudWxsOyBhYnNQYXRoOiBzdHJpbmcgfCBudWxsOyBjb3B5UGF0aDogc3RyaW5nIHwgbnVsbDsgdGVtcFBhdGg6IGJvb2xlYW47IGtpbmQ6IHN0cmluZyB8IG51bGw7IGFnZW50UHJvbXB0OiBzdHJpbmcgfCBudWxsfSA9IHtcbiAgICByZWxQYXRoOiBudWxsLCBhYnNQYXRoOiBudWxsLCBjb3B5UGF0aDogbnVsbCwgdGVtcFBhdGg6IGZhbHNlLCBraW5kOiBudWxsLCBhZ2VudFByb21wdDogbnVsbCxcbiAgfTtcbiAgbGV0IHdvcmtzcGFjZXM6IFdvcmtzcGFjZVtdID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gIGxldCBhY3RpdmVXcyA9ICdkZWZhdWx0JztcbiAgLy8gU2Vzc2lvbiB1dWlkIOKAlCBnZW5lcmF0ZWQgb25jZSBwZXIgd29ya3NwYWNlIGJvb3QuIEdvZXMgb250byBldmVyeVxuICAvLyBwYWdlIHJvdyBhbmQgZXZlcnkgc2VsZWN0b3IgZW50cnkgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlc1xuICAvLyB0byBcIndoaWNoIHNlc3Npb24/XCIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuIFN0YWJsZSBhY3Jvc3MgYVxuICAvLyBzaW5nbGUgd29ya3NwYWNlIGxvYWQ7IHJlc2V0cyBvbiB3b3Jrc3BhY2Ugc3dpdGNoLlxuICBsZXQgc2Vzc2lvbklkOiBzdHJpbmcgPSAnJztcbiAgY29uc3Qgd3NNc2dLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5tZXNzYWdlcy52MWA7XG4gIGNvbnN0IHdzU2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90cy52MWA7XG4gIC8vIFBlcnNpc3RlbnQgc25hcHNob3QgaGlzdG9yeSBwZXIgd29ya3NwYWNlIOKAlCBhIENsZWFyLWFsbCBhcmNoaXZlcyB0aGUgd2lwZWRcbiAgLy8gY2FwdHVyZXMrY29tbWVudHMrdGh1bWJuYWlscyBoZXJlIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIGxhdGVyIGZyb21cbiAgLy8gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMuIExpdmVzIGluIHRoZSBzYW1lIGNocm9tZS5zdG9yYWdlIGxheWVyIGFzIHRoZSByZXN0XG4gIC8vIG9mIHRoZSB3b3Jrc3BhY2UgZGF0YS5cbiAgY29uc3Qgd3NTbmFwc2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zbmFwc2hvdHMudjFgO1xuICAvLyBDYXAgc28gdGhlIGhpc3RvcnkgY2FuJ3QgYmFsbG9vbiBzdG9yYWdlOyBvbGRlc3Qgc25hcHNob3RzIGRyb3Agb2ZmLlxuICBjb25zdCBXU19TTkFQU0hPVF9DQVAgPSAxMDtcbiAgY29uc3Qgd3NTaG90c0Z1bGxLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90c0Z1bGwudjFgO1xuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBoYXMgYSAxMCBNQiBkZWZhdWx0IHF1b3RhOyB3ZSBidWRnZXQgaGFsZiBvZlxuICAvLyB0aGF0IGZvciBmdWxsLXJlc29sdXRpb24gUE5HcyAodGhlIHJlc3QgaXMgbWVzc2FnZXMsIHByZWZzLCB0aHVtYnMpLlxuICAvLyBXaGVuIHRoZSBidWRnZXQgaXMgcmVhY2hlZCB3ZSBGSUZPLWV2aWN0IHRoZSBvbGRlc3QgZW50cmllcyAoTWFwXG4gIC8vIHByZXNlcnZlcyBpbnNlcnRpb24gb3JkZXIpLiBFc3RpbWF0ZSBkYXRhVVJMIHNpemUgPSBzdHJpbmcgbGVuZ3RoLlxuICBjb25zdCBTSE9UU19GVUxMX0JVREdFVF9CWVRFUyA9IDUgKiAxMDI0ICogMTAyNDtcbiAgY29uc3QgdW5kb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCByZWRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFVORE9fQ0FQID0gMzA7XG4gIGxldCBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gIGxldCBwcmVmczogUHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGU307XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXR1cyBoZWxwZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzdGF0dXNUaW1lciA9IDA7XG4gIGNvbnN0IHNldFN0YXR1cyA9IChtc2c6IHN0cmluZywgb3B0czoge2tpbmQ/OiAnd2FybicgfCAnaW5mbycgfCAnb2snfSA9IHt9KTogdm9pZCA9PiB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gbXNnIHx8ICcnO1xuICAgIGNsZWFyVGltZW91dChzdGF0dXNUaW1lcik7XG4gICAgaWYgKG1zZykge1xuICAgICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gb3B0cy5raW5kID09PSAnd2FybicgPyAndmFyKC0tcmVkKScgOlxuICAgICAgICBvcHRzLmtpbmQgPT09ICdpbmZvJyA/ICd2YXIoLS10ZXh0LTMpJyA6ICd2YXIoLS1ncmVlbiknO1xuICAgICAgc3RhdHVzVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHN0YXR1cy50ZXh0Q29udGVudCA9ICcnOyB9LCAyMjAwKTtcbiAgICB9XG4gIH07XG4gIGxldCB0b2FzdFRpbWVyID0gMDtcbiAgY29uc3Qgc2hvd1RvYXN0ID0gKHRpdGxlOiBzdHJpbmcsIGRldGFpbCA9ICcnLCBraW5kOiAnb2snIHwgJ3dhcm4nID0gJ29rJyk6IHZvaWQgPT4ge1xuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1jb3B5LXRvYXN0XScpO1xuICAgIGlmICghdG9hc3QpIHtcbiAgICAgIHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAnY29weS10b2FzdCc7XG4gICAgICB0b2FzdC5kYXRhc2V0LmNvcHlUb2FzdCA9ICd0cnVlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRvYXN0KTtcbiAgICB9XG4gICAgdG9hc3QuY2xhc3NMaXN0LnRvZ2dsZSgnd2FybicsIGtpbmQgPT09ICd3YXJuJyk7XG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC1pY29uXCI+JHtQR19JQ09OUy5zdmdTdHJpbmcoa2luZCA9PT0gJ3dhcm4nID8gJ2FsZXJ0LWNpcmNsZScgOiAnY2lyY2xlLWNoZWNrJywgMjIpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC10ZXh0XCI+PGI+JHtlc2NhcGVIdG1sKHRpdGxlKX08L2I+JHtkZXRhaWwgPyBgPHNtYWxsPiR7ZXNjYXBlSHRtbChkZXRhaWwpfTwvc21hbGw+YCA6ICcnfTwvc3Bhbj5gO1xuICAgIHRvYXN0LmhpZGRlbiA9IGZhbHNlO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB2b2lkIHRvYXN0Lm9mZnNldFdpZHRoO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcik7XG4gICAgdG9hc3RUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRvYXN0Py5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IGlmICh0b2FzdCkgdG9hc3QuaGlkZGVuID0gdHJ1ZTsgfSwgMTgwKTtcbiAgICB9LCAxNDUwKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0NvcGllZCA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWwgPSAnJyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICdvaycpO1xuICBjb25zdCBzaG93RG93bmxvYWRFcnJvciA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWw6IHN0cmluZyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICd3YXJuJyk7XG5cbiAgLy8g4pSA4pSA4pSAIFV0aWxpdGllcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGZhbGxiYWNrSWRDb3VudGVyID0gMDtcbiAgY29uc3Qgc2VjdXJlVG9rZW4gPSAoYnl0ZXMgPSAxMik6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBVaW50OEFycmF5KGJ5dGVzKTtcbiAgICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYXcpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocmF3KS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfV8keygrK2ZhbGxiYWNrSWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG1zZ0lkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgaWYgKGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQpIHJldHVybiBnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKCk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggKi8gfVxuICAgIHJldHVybiBgaWRfJHtzZWN1cmVUb2tlbigxNil9YDtcbiAgfTtcbiAgY29uc3QgZXNjYXBlSHRtbCA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBTdHJpbmcocykucmVwbGFjZUFsbCgnJicsICcmYW1wOycpLnJlcGxhY2VBbGwoJzwnLCAnJmx0OycpLnJlcGxhY2VBbGwoJz4nLCAnJmd0OycpO1xuICBjb25zdCBlc2NhcGVSZSA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xuICBjb25zdCBoaWdobGlnaHRNYXRjaCA9ICh0ZXh0OiBzdHJpbmcsIHE6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KTtcbiAgICByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoYCgke2VzY2FwZVJlKHEpfSlgLCAnZ2knKSwgJzxtYXJrPiQxPC9tYXJrPicpO1xuICB9O1xuICAvLyBXYWxrIHRleHQgbm9kZXMgaW5zaWRlIGByb290YCwgd3JhcHBpbmcgY2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGVzIG9mIGBxYFxuICAvLyBpbiA8bWFyaz4gZWxlbWVudHMuIERvZXNuJ3QgdG91Y2ggYXR0cmlidXRlIHN0cmluZ3Mgb3IgaW5uZXItdGFnIEhUTUwgc29cbiAgLy8gaXQncyBzYWZlIHRvIHJ1biBvbiBhbHJlYWR5LWhpZ2hsaWdodGVkIEpTT04gb3V0cHV0LlxuICBjb25zdCB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzID0gKHJvb3Q6IEhUTUxFbGVtZW50LCBxOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoIXEpIHJldHVybjtcbiAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmUocSksICdnaScpO1xuICAgIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIocm9vdCwgTm9kZUZpbHRlci5TSE9XX1RFWFQpO1xuICAgIGNvbnN0IHRhcmdldHM6IFRleHRbXSA9IFtdO1xuICAgIGxldCBub2RlOiBOb2RlIHwgbnVsbDtcbiAgICB3aGlsZSAoKG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgIGlmIChyZS50ZXN0KG5vZGUubm9kZVZhbHVlID8/ICcnKSkgdGFyZ2V0cy5wdXNoKG5vZGUgYXMgVGV4dCk7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFyZ2V0cykge1xuICAgICAgY29uc3QgdmFsdWUgPSB0Lm5vZGVWYWx1ZSA/PyAnJztcbiAgICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBsZXQgbGFzdCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgdmFsdWUubWF0Y2hBbGwocmUpKSB7XG4gICAgICAgIGNvbnN0IGkgPSBtLmluZGV4ID8/IDA7XG4gICAgICAgIGlmIChpID4gbGFzdCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCwgaSkpO1xuICAgICAgICBjb25zdCBtayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21hcmsnKTtcbiAgICAgICAgbWsudGV4dENvbnRlbnQgPSBtWzBdO1xuICAgICAgICBmcmFnLmFwcGVuZChtayk7XG4gICAgICAgIGxhc3QgPSBpICsgbVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICBpZiAobGFzdCA8IHZhbHVlLmxlbmd0aCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCkpO1xuICAgICAgdC5yZXBsYWNlV2l0aChmcmFnKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHdvcmRDb3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gKHMubWF0Y2goL1xcUysvZykgPz8gW10pLmxlbmd0aDtcbiAgY29uc3QgdG9rZW5Db3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gTWF0aC5jZWlsKHMubGVuZ3RoIC8gNCk7XG4gIGNvbnN0IHBhdGhPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5wYXRobmFtZTsgfSBjYXRjaCB7IHJldHVybiB1OyB9IH07XG4gIGNvbnN0IGhvc3RPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5ob3N0OyB9IGNhdGNoIHsgcmV0dXJuICcnOyB9IH07XG4gIC8vIEZpbGVuYW1lLXNhZmUgaG9zdCBzbHVnOiBkb3RzIOKGkiB1bmRlcnNjb3JlcyBwZXIgcHJvamVjdCBjb252ZW50aW9uLlxuICAvLyBNaXJyb3JzIGJhY2tncm91bmQudHMgaG9zdFNsdWcgZm9yIHN5bW1ldHJ5IGFjcm9zcyBzY3JlZW5zaG90ICsgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcy5cbiAgY29uc3QgaG9zdFNsdWcgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGggPSBob3N0T2YodXJsKTtcbiAgICBpZiAoIWgpIHJldHVybiAndW5rbm93bic7XG4gICAgcmV0dXJuIGgucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG4gIH07XG4gIC8vIFBpY2sgdGhlIG1vc3QtZnJlcXVlbnQgaG9zdCBhY3Jvc3MgYWxsIHNlbGVjdG9yIGNhcHR1cmVzIChmb3IgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcykuIFdoZW4gdGhlIHdvcmtzcGFjZSBzcGFucyBtdWx0aXBsZSBob3N0cywgcmV0dXJuICdtdWx0aScuXG4gIGNvbnN0IGRvbWluYW50SG9zdFNsdWcgPSAoKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdFNsdWcobS5lbnRyeS51cmwpO1xuICAgICAgY291bnRzLnNldChoLCAoY291bnRzLmdldChoKSA/PyAwKSArIDEpO1xuICAgIH1cbiAgICBpZiAoIWNvdW50cy5zaXplKSByZXR1cm4gJ2VtcHR5JztcbiAgICBsZXQgYmVzdCA9ICcnO1xuICAgIGxldCBiZXN0TiA9IDA7XG4gICAgZm9yIChjb25zdCBbaCwgbl0gb2YgY291bnRzKSB7XG4gICAgICBpZiAobiA+IGJlc3ROKSB7IGJlc3QgPSBoOyBiZXN0TiA9IG47IH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50cy5zaXplID4gMSA/ICdtdWx0aScgOiBiZXN0O1xuICB9O1xuICAvLyBEaXN0aW5jdCBob3N0cyBwcmVzZW50IGluIHRoaXMgd29ya3NwYWNlIChhbHBoYWJldGljYWwsIGNhcHBlZCkuIFVzZWQgaW5cbiAgLy8gdGhlIGV4cG9ydCBtYW5pZmVzdCdzIGBob3N0c2AgZmllbGQuXG4gIGNvbnN0IGRpc3RpbmN0SG9zdHMgPSAoKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IHNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdE9mKG0uZW50cnkudXJsKTtcbiAgICAgIGlmIChoKSBzZXQuYWRkKGgpO1xuICAgIH1cbiAgICByZXR1cm4gWy4uLnNldF0uc29ydCgpLnNsaWNlKDAsIDIwKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIERldGVybWluaXN0aWMgZXhwb3J0IGlkZW50aXR5IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBPbmUgY2xvY2sgcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGluc2lkZSBhIHNpbmdsZSBleHBvcnQgZGVyaXZlc1xuICAvLyBmcm9tIHRoZSBzYW1lIGluc3RhbnQsIGFuZCB0ZXN0cyBjYW4gZnJlZXplIGl0IHNvIHR3byBleHBvcnRzIG9mIHRoZVxuICAvLyBzYW1lIGNvbnRlbnQgYXJlIGJ5dGUtaWRlbnRpY2FsLlxuICBsZXQgZXhwb3J0Q2xvY2tPdmVycmlkZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGV4cG9ydE5vd0lzbyA9ICgpOiBzdHJpbmcgPT4gZXhwb3J0Q2xvY2tPdmVycmlkZSA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIC8vIFN0YWJsZSBjb250ZW50IGlkZW50aXR5OiBTSEEtMjU2IG92ZXIgdGhlIHNsaW0gcm93cyBwbHVzIHRoZSBzb3J0ZWRcbiAgLy8gc2NyZWVuc2hvdCBhcmNoaXZlIG5hbWVzLiBTYW1lIHdvcmtzcGFjZSBjb250ZW50IOKGkiBzYW1lIGhhc2gg4oaSIHNhbWVcbiAgLy8gZmlsZW5hbWUgKHRoZSBiYWNrZ3JvdW5kIHNhdmVzIHdpdGggY29uZmxpY3RBY3Rpb24gJ292ZXJ3cml0ZScpLCBzb1xuICAvLyByZS1leHBvcnRpbmcgdW5jaGFuZ2VkIGNvbnRlbnQgcmVwbGFjZXMgcmF0aGVyIHRoYW4gZHVwbGljYXRlcy5cbiAgY29uc3QgY29tcHV0ZUNvbnRlbnRIYXNoID0gYXN5bmMgKHNob3ROYW1lczogc3RyaW5nW10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSBidWlsZFNsaW0oKS5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKS5qb2luKCdcXG4nKSArICdcXG4nICsgWy4uLnNob3ROYW1lc10uc29ydCgpLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGRpZ2VzdCA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEtMjU2JywgbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHBheWxvYWQpKTtcbiAgICByZXR1cm4gWy4uLm5ldyBVaW50OEFycmF5KGRpZ2VzdCldLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyk7XG4gIH07XG4gIC8vIEJ1aWxkIGEgZmlsZW5hbWUgb2YgdGhlIHNoYXBlIGBwaW5jaGdyYWItPHdvcmtzcGFjZT4tPGhvc3Q+LTxzdGFtcD4uPGV4dD5gLlxuICAvLyBUaGUgc3RhbXAgaXMgdGhlIGV4cG9ydCdzIGNvbnRlbnQtaGFzaCBwcmVmaXggd2hlbiBzdXBwbGllZCAoYnVuZGxlIGFuZFxuICAvLyBKU09OTCBleHBvcnRzKSwgZmFsbGluZyBiYWNrIHRvIHRoZSBlcG9jaCBmb3IgbGVnYWN5IGNhbGxlcnMuXG4gIGNvbnN0IGJ1aWxkRXhwb3J0RmlsZW5hbWUgPSAoZXh0OiAnanNvbmwnIHwgJ21kJyB8ICd0YXIuenN0Jywgc3RhbXA/OiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBgcGluY2hncmFiLSR7YWN0aXZlV3N9LSR7ZG9taW5hbnRIb3N0U2x1ZygpfS0ke3N0YW1wID8/IERhdGUubm93KCl9LiR7ZXh0fWA7XG4gIC8vIFNraXAtbGlzdCBtYXRjaDogc3Vic3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSBtYXRjaCBhZ2FpbnN0IHRoZSBVUkwnc1xuICAvLyBob3N0LiBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBVUkwgcGFyc2luZyBvbiB0aGUgcGF0dGVybnMgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHdyaXRlIGB3cmFubmdsZS5jb21gIGFuZCBoYXZlIGl0IG1hdGNoIGBhcHAud3Jhbm5nbGUuY29tYCB0b28uXG4gIGNvbnN0IHNob3VsZFNraXBTY3JlZW5zaG90ID0gKHVybDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgbGlzdCA9IChwcmVmcy5za2lwU2NyZWVuc2hvdEhvc3RzID8/ICcnKS5zcGxpdCgnLCcpLm1hcCgocykgPT4gcy50cmltKCkudG9Mb3dlckNhc2UoKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0ID0gaG9zdE9mKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGlzdC5zb21lKChwYXQpID0+IGhvc3QuaW5jbHVkZXMocGF0KSk7XG4gIH07XG5cbiAgLy8gSlNPTiBzeW50YXggaGlnaGxpZ2h0IChwZXIta2V5IGNvbG9yIGlzIGhhc2hlZCBmb3IgdmlzdWFsIHZhcmlldHkpLlxuICBjb25zdCBLRVlfUEFMRVRURSA9IFsnI2ZmN2U3OCcsICcjZmZiNDU0JywgJyNmZmUwNjYnLCAnIzdiZDk3YScsICcjNWZkMWZmJywgJyM5YjhjZmYnLCAnI2ZmODVjMScsICcjZmY1ZjAwJywgJyMxMGI5ODEnLCAnI2Y1OWUwYicsICcjYTc4YmZhJywgJyMzNGQzOTknXTtcbiAgY29uc3QgY29sb3JGb3JLZXkgPSAoazogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgaCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIGsuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gICAgcmV0dXJuIEtFWV9QQUxFVFRFW2ggJSBLRVlfUEFMRVRURS5sZW5ndGhdITtcbiAgfTtcbiAgY29uc3QgSlNPTl9UT0tFTl9SRSA9IC8oXFxzKyl8KFwiKD86W15cIlxcXFxdfFxcXFwuKSpcIil8KHRydWV8ZmFsc2V8bnVsbCl8KC0/XFxkKyg/OlxcLlxcZCspPyg/OltlRV1bKy1dP1xcZCspPyl8KFt7fVtcXF0sOl0pL2c7XG4gIGNvbnN0IGFwcGVuZEpzb25IaWdobGlnaHQgPSAocm9vdDogSFRNTEVsZW1lbnQsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHJvb3QudGV4dENvbnRlbnQgPSAnJztcbiAgICBsZXQgbTogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcbiAgICBsZXQgbGFzdCA9IDA7XG4gICAgSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IEpTT05fVE9LRU5fUkUuZXhlYyh0ZXh0KSkgIT09IG51bGwpIHtcbiAgICAgIGlmIChtLmluZGV4ID4gbGFzdCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0LCBtLmluZGV4KSkpO1xuICAgICAgbGFzdCA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgY29uc3QgWywgd3MsIHN0ciwgbGl0LCBudW0sIHB1bmN0XSA9IG07XG4gICAgICBpZiAod3MpIHsgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUod3MpKTsgY29udGludWU7IH1cbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgbGV0IGsgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgICAgd2hpbGUgKGsgPCB0ZXh0Lmxlbmd0aCAmJiAodGV4dFtrXSA9PT0gJyAnIHx8IHRleHRba10gPT09ICdcXHQnIHx8IHRleHRba10gPT09ICdcXG4nKSkgaysrO1xuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBpZiAodGV4dFtrXSA9PT0gJzonKSB7XG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuICAgICAgICAgIHRyeSB7IGtleSA9IEpTT04ucGFyc2Uoc3RyKSBhcyBzdHJpbmc7IH0gY2F0Y2ggeyBrZXkgPSBzdHIuc2xpY2UoMSwgLTEpOyB9XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAnayc7XG4gICAgICAgICAgc3Bhbi5zdHlsZS5jb2xvciA9IGNvbG9yRm9yS2V5KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAncyc7XG4gICAgICAgIH1cbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHN0cjtcbiAgICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGlmIChsaXQpIHNwYW4uY2xhc3NOYW1lID0gJ2InO1xuICAgICAgZWxzZSBpZiAobnVtKSBzcGFuLmNsYXNzTmFtZSA9ICduJztcbiAgICAgIGVsc2UgaWYgKHB1bmN0KSBzcGFuLmNsYXNzTmFtZSA9ICdwJztcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBsaXQgPz8gbnVtID8/IHB1bmN0ID8/ICcnO1xuICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgfVxuICAgIGlmIChsYXN0IDwgdGV4dC5sZW5ndGgpIHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCkpKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUGVyc2lzdGVuY2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGxvYWRBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd29ya3NwYWNlcyA9IChhd2FpdCBTdG9yZS5nZXQ8V29ya3NwYWNlW10+KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKSkgfHwgd29ya3NwYWNlcztcbiAgICBpZiAoIXdvcmtzcGFjZXMubGVuZ3RoKSB3b3Jrc3BhY2VzID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gICAgYWN0aXZlV3MgPSAoYXdhaXQgU3RvcmUuZ2V0PHN0cmluZz4oJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCAnZGVmYXVsdCcpKSB8fCAnZGVmYXVsdCc7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gYWN0aXZlV3MpKSBhY3RpdmVXcyA9IHdvcmtzcGFjZXNbMF0hLm5hbWU7XG4gICAgcHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGUywgLi4uKGF3YWl0IFN0b3JlLmdldDxQYXJ0aWFsPFByZWZzPj4oUFJFRlNfU1RPUkFHRV9OQU1FLCB7fSkpfTtcbiAgICAvLyBQYXRoIG1pZ3JhdGlvbjogcHJpb3IgdmVyc2lvbnMgZGVmYXVsdGVkIHNraWxsUGF0aCB0b1xuICAgIC8vIGB+Ly5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYCwgYW5kIHNvbWUgdXNlcnMgaGFkIGl0IHN0b3JlZCBhc1xuICAgIC8vIGB+Ly5kb3RmaWxlcy8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAuIFRoZSBza2lsbCB3YXMgcmVuYW1lZFxuICAgIC8vIHRvIGBQaW5jaEdyYWJgOyBhbnkgYH4vLmRvdGZpbGVzL2AgcHJlZml4IGlzIHN0cmlwcGVkIGZyb21cbiAgICAvLyBleHBvc2VkIGRlZmF1bHRzIChkb3RmaWxlcyBpcyBhIHBlcnNvbmFsIGNvbmZpZyBzb3VyY2Ug4oCUIGV4cG9ydHNcbiAgICAvLyBzaG91bGRuJ3QgbGVhayB0aGF0IHBhdGgpLlxuICAgIGNvbnN0IHVwZ3JhZGVQYXRoID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCwgZnJlc2g6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICBpZiAoIXApIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmluY2x1ZGVzKCcuZG90ZmlsZXMnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuZW5kc1dpdGgoJ3NraWxscy91aS9TS0lMTC5tZCcpKSByZXR1cm4gZnJlc2g7XG4gICAgICByZXR1cm4gcDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnblBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5kZXNpZ25QYXRoLCBERUZBVUxUX1BSRUZTLmRlc2lnblBhdGgpO1xuICAgIHByZWZzLnNraWxsUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLnNraWxsUGF0aCwgREVGQVVMVF9QUkVGUy5za2lsbFBhdGgpO1xuICAgIC8vIENvbnRlbnQgbWlncmF0aW9uOiBwcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgdGhlIGVudGlyZSB0ZW1wbGF0ZVxuICAgIC8vIHRleHQgaW5zaWRlIGBwcmVmcy5kZXNpZ25NZGAgLyBgcHJlZnMuc2tpbGxNZGAgYXMgZGVmYXVsdHMuIFRoYXRcbiAgICAvLyBhdGUgfjM2MEtCIG9mIGNocm9tZS5zdG9yYWdlIHF1b3RhIGZvciBubyBiZW5lZml0LiBEZXRlY3Qgd2hlblxuICAgIC8vIHRoZSBzdG9yZWQgdmFsdWUgbWF0Y2hlcyBvbmUgb2YgdGhlIGJ1bmRsZWQgdGVtcGxhdGVzIGFuZCBjbGVhclxuICAgIC8vIGl0IOKAlCB0aGUgcmVzb2x2ZXIgZmFsbHMgYmFjayB0byB0aGUgYnVuZGxlZCBmaWxlIG9uIHRoZSBmbHkuXG4gICAgLy8gQWxzbyBzY3J1YiBhbnkgbGVha2VkIGB+Ly5kb3RmaWxlcy9gIHN1YnN0cmluZy5cbiAgICBjb25zdCBzY3J1YkRvdGZpbGVzID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgICAgcy5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8uYWdlbnRzLycsICd+Ly5hZ2VudHMvJylcbiAgICAgICAucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvJywgJ34vLmFnZW50cy8nKTtcbiAgICBjb25zdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlID0gYXN5bmMgKGN1cnJlbnQ6IHN0cmluZywga2V5czogVGVtcGxhdGVLZXlbXSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICBpZiAoIWN1cnJlbnQgfHwgIWN1cnJlbnQudHJpbSgpKSByZXR1cm4gJyc7XG4gICAgICBjb25zdCB0cmltbWVkID0gY3VycmVudC50cmltKCk7XG4gICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xuICAgICAgICBjb25zdCB0cGwgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKGspKS50cmltKCk7XG4gICAgICAgIGlmICh0cGwgJiYgdHBsID09PSB0cmltbWVkKSByZXR1cm4gJyc7IC8vIG1hdGNoZXMgYSBidW5kbGVkIHRlbXBsYXRlIOKAlCBjb2xsYXBzZSB0byBlbXB0eVxuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnJlbnQuaW5jbHVkZXMoJy5kb3RmaWxlcycpID8gc2NydWJEb3RmaWxlcyhjdXJyZW50KSA6IGN1cnJlbnQ7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25NZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuZGVzaWduTWQgPz8gJycsIFsnbG9jYWxEZXNpZ24nLCAnZGVzaWduVGVtcGxhdGUnXSk7XG4gICAgcHJlZnMuc2tpbGxNZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuc2tpbGxNZCA/PyAnJywgWydsb2NhbFNraWxsJywgJ3NraWxsVGVtcGxhdGUnXSk7XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZShhY3RpdmVXcyk7XG4gIH07XG4gIGNvbnN0IGxvYWRXb3Jrc3BhY2UgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYWN0aXZlV3MgPSBuYW1lO1xuICAgIHZvaWQgU3RvcmUuc2V0KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgbmFtZSk7XG4gICAgLy8gTWludCBhIG5ldyBzZXNzaW9uSWQgcGVyIHdvcmtzcGFjZSBsb2FkLiBTYW1lIHdvcmtzcGFjZSByZS1vcGVuZWRcbiAgICAvLyA9IG5ldyBzZXNzaW9uOiBkaXN0aW5jdCB1dWlkIHNvIGEgY29uc3VtZXIgY2FuIHRlbGwgdHdvIGJvb3RzXG4gICAgLy8gYXBhcnQgZXZlbiB3aGVuIHRoZSBjYXB0dXJlcyBsYW5kIGluIHRoZSBzYW1lIG9uLWRpc2sgZmlsZS5cbiAgICBzZXNzaW9uSWQgPSBtc2dJZCgpO1xuICAgIG1lc3NhZ2VzID0gKGF3YWl0IFN0b3JlLmdldDxQYW5lbE1lc3NhZ2VbXT4od3NNc2dLZXkobmFtZSksIFtdKSkgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkgbWVzc2FnZXMgPSBbXTtcbiAgICAvLyBNaWdyYXRlIGxlZ2FjeSBlbnRyaWVzIChubyB1aWQsIHN0YXRlcy1hcy1yZWNvcmQsIGF0dHJzLmZvcm1hdCkgYW5kXG4gICAgLy8gcGVyc2lzdCBpZiBhbnl0aGluZyBjaGFuZ2VkIHNvIHdlIGRvbid0IHBheSB0aGUgbWlncmF0aW9uIGNvc3QgYWdhaW5cbiAgICAvLyBuZXh0IGxvYWQuXG4gICAgaWYgKG1pZ3JhdGVMb2FkZWRNZXNzYWdlcygpKSB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShuYW1lKSwgbWVzc2FnZXMpO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGFnZVNob3RzRmlyZWQuY2xlYXIoKTtcbiAgICBjb25zdCBzdG9yZWQgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIC8vIFJlc3RvcmUgdGhlIGZ1bGwtcmVzb2x1dGlvbiBQTkcgY2FjaGUgc28gYSB3b3Jrc3BhY2UgYXJjaGl2ZVxuICAgIC8vIGV4cG9ydGVkIEFGVEVSIGEgcGFuZWwgcmVsb2FkIHN0aWxsIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZnJvbVxuICAgIC8vIGVhcmxpZXIgY2FwdHVyZXMuIEZJRk8gb3JkZXIgaXMgcHJlc2VydmVkIGJ5IE9iamVjdCBrZXkgb3JkZXIuXG4gICAgY29uc3Qgc3RvcmVkRnVsbCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0Z1bGxLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkRnVsbCkpIHNob3RzRnVsbC5zZXQoaywgdik7XG4gICAgLy8gTG9hZCB0aGlzIHdvcmtzcGFjZSdzIHBlcnNpc3RlbnQgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKS5cbiAgICBhd2FpdCBsb2FkV3NTbmFwc2hvdHMobmFtZSk7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIHNlbGVjdG9yRXJyb3JzLmNsZWFyKCk7XG4gICAgdW5kb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IG51bGw7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdCA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShhY3RpdmVXcyksIG1lc3NhZ2VzKTtcbiAgICAvLyBQdXNoIGNhcHR1cmVkLXNlbGVjdG9yIHNldCBzbyB0aGUgY29udGVudCBzY3JpcHQncyBob3ZlciB3YWxrZXIgY2FuXG4gICAgLy8gcmVzb2x2ZSBkZXNjZW5kYW50cyDihpIgY2FwdHVyZWQgYW5jZXN0b3IuXG4gICAgY29uc3Qgc2VsZWN0b3JzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIHNlbmRUb0NTKHtraW5kOiAnc2V0LWNhcHR1cmVkJywgc2VsZWN0b3JzfSk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RQcmVmcyA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldChQUkVGU19TVE9SQUdFX05BTUUsIHByZWZzKTtcbiAgICAvLyBQdXNoIHRoZSBzdWJzZXQgb2YgcHJlZnMgdGhlIGNvbnRlbnQgc2NyaXB0IGNhcmVzIGFib3V0IHNvIGl0c1xuICAgIC8vIG92ZXJsYXkgKHNwYWNpbmcgdmlzdWFsaXplciwgaG92ZXIgc25hcCwgZXRjLikgcmVmbGVjdHMgdGhlIGxhdGVzdC5cbiAgICB2b2lkIHNlbmRUb0NTKHtcbiAgICAgIGtpbmQ6ICdzZXQtY3MtcHJlZnMnLFxuICAgICAgc3BhY2luZ092ZXJsYXk6IHByZWZzLnNwYWNpbmdPdmVybGF5LFxuICAgICAgaG92ZXJTbmFwOiBwcmVmcy5ob3ZlclNuYXAsXG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90cyA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90cykgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBwZXJzaXN0ZW5jZSB3aXRoIEZJRk8gZXZpY3Rpb24uIGRhdGFVUkwgc3RyaW5nc1xuICAvLyBjYW4gcnVuIDUwLTUwMCBLQiBlYWNoOyB0aGUgZGVmYXVsdCBxdW90YSBnZXRzIGV4aGF1c3RlZCBpbiB0ZW5zIG9mXG4gIC8vIGNhcHR1cmVzIHdpdGhvdXQgYSBidWRnZXQuIE1hcCBpbnNlcnRpb24gb3JkZXIgPSBGSUZPIG9yZGVyLCBzb1xuICAvLyB3ZSBldmljdCBmcm9tIHRoZSBmcm9udCB1bnRpbCB1bmRlciBidWRnZXQgYmVmb3JlIHBlcnNpc3RpbmcuXG4gIGNvbnN0IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQgPSAoKTogbnVtYmVyID0+IHtcbiAgICBsZXQgdG90YWwgPSAwO1xuICAgIGZvciAoY29uc3QgdiBvZiBzaG90c0Z1bGwudmFsdWVzKCkpIHRvdGFsICs9IHYubGVuZ3RoO1xuICAgIGxldCBldmljdGVkID0gMDtcbiAgICB3aGlsZSAodG90YWwgPiBTSE9UU19GVUxMX0JVREdFVF9CWVRFUykge1xuICAgICAgY29uc3QgZmlyc3RLZXkgPSBzaG90c0Z1bGwua2V5cygpLm5leHQoKS52YWx1ZTtcbiAgICAgIGlmIChmaXJzdEtleSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIGNvbnN0IHJlbW92ZWQgPSBzaG90c0Z1bGwuZ2V0KGZpcnN0S2V5KTtcbiAgICAgIGlmIChyZW1vdmVkID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgc2hvdHNGdWxsLmRlbGV0ZShmaXJzdEtleSk7XG4gICAgICB0b3RhbCAtPSByZW1vdmVkLmxlbmd0aDtcbiAgICAgIGV2aWN0ZWQrKztcbiAgICB9XG4gICAgcmV0dXJuIGV2aWN0ZWQ7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90c0Z1bGwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXZpY3RlZCA9IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQoKTtcbiAgICBpZiAoZXZpY3RlZCA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgYHNob3RzRnVsbCBGSUZPLWV2aWN0ZWQgJHtldmljdGVkfSBvbGRlc3QgZW50cmllcyB0byBmaXQgJHtTSE9UU19GVUxMX0JVREdFVF9CWVRFUyAvIDEwMjQgLyAxMDI0fU1CIGJ1ZGdldGApO1xuICAgIH1cbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90c0Z1bGwpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0Z1bGxLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V29ya3NwYWNlcyA9ICgpOiB2b2lkID0+IHsgdm9pZCBTdG9yZS5zZXQoV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpOyB9O1xuXG4gIC8vIOKUgOKUgOKUgCBUYWIg4oeEIHdvcmtzcGFjZSBiaW5kaW5nICgjMTgpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCYWNrZ3JvdW5kIGFubm91bmNlcyBlYWNoIHRvb2xiYXItY2xpY2sgYWN0aXZhdGlvbiB2aWEgJ3BnLXRhYi1hY3RpdmF0ZWQnLlxuICAvLyBUaGUgZmlyc3QgYWN0aXZhdGlvbiBhZG9wdHMgdGhlIGN1cnJlbnQgdW5ib3VuZCB3b3Jrc3BhY2U7IGxhdGVyIHRhYnMgZWFjaFxuICAvLyBnZXQgdGhlaXIgb3duLiBQaWNraW5nIGEgYm91bmQgd29ya3NwYWNlIGp1bXBzIHRoZSBicm93c2VyIHRvIGl0cyB0YWIuXG4gIGNvbnN0IHNsdWdGb3JUYWIgPSAodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7IGNvbnN0IGggPSBuZXcgVVJMKHVybCkuaG9zdG5hbWUucmVwbGFjZSgvXnd3d1xcLi8sICcnKTsgaWYgKGgpIHJldHVybiBoOyB9IGNhdGNoIHsgLyogbm90IGEgdXJsICovIH1cbiAgICBjb25zdCB0ID0gKHRpdGxlIHx8ICcnKS50cmltKCk7XG4gICAgcmV0dXJuIHQgPyB0LnNsaWNlKDAsIDI0KSA6ICd0YWInO1xuICB9O1xuICBjb25zdCB1bmlxdWVXc05hbWUgPSAoYmFzZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIXdvcmtzcGFjZXMuc29tZSgodykgPT4gdy5uYW1lID09PSBiYXNlKSkgcmV0dXJuIGJhc2U7XG4gICAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7IGNvbnN0IG4gPSBgJHtiYXNlfSAke2l9YDsgaWYgKCF3b3Jrc3BhY2VzLnNvbWUoKHcpID0+IHcubmFtZSA9PT0gbikpIHJldHVybiBuOyB9XG4gIH07XG4gIGNvbnN0IG9uVGFiQWN0aXZhdGVkID0gYXN5bmMgKHt0YWJJZCwgdXJsLCB0aXRsZX06IHt0YWJJZDogbnVtYmVyOyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZ30pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcudGFiSWQgPT09IHRhYklkKTtcbiAgICBpZiAod3MpIHtcbiAgICAgIGlmICh3cy51cmwgIT09IHVybCB8fCB3cy50aXRsZSAhPT0gdGl0bGUpIHsgd3MudXJsID0gdXJsOyB3cy50aXRsZSA9IHRpdGxlOyBwZXJzaXN0V29ya3NwYWNlcygpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gYWN0aXZlV3MpO1xuICAgICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC50YWJJZCA9PSBudWxsKSB7XG4gICAgICAgIHdzID0gY3VycmVudDsgd3MudGFiSWQgPSB0YWJJZDsgd3MudXJsID0gdXJsOyB3cy50aXRsZSA9IHRpdGxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3MgPSB7bmFtZTogdW5pcXVlV3NOYW1lKHNsdWdGb3JUYWIodXJsLCB0aXRsZSkpLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGFiSWQsIHVybCwgdGl0bGV9O1xuICAgICAgICB3b3Jrc3BhY2VzLnB1c2god3MpO1xuICAgICAgfVxuICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICB9XG4gICAgaWYgKGFjdGl2ZVdzICE9PSB3cy5uYW1lKSBhd2FpdCBsb2FkV29ya3NwYWNlKHdzLm5hbWUpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcbiAgLy8gQnJpbmcgdGhlIGJyb3dzZXIgdG8gYSB3b3Jrc3BhY2UncyBib3VuZCB0YWIgd2hlbiB0aGUgdXNlciBwaWNrcyBpdC5cbiAgY29uc3QgZm9jdXNXb3Jrc3BhY2VUYWIgPSAobmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKCFpbkV4dGVuc2lvbiB8fCB3cz8udGFiSWQgPT0gbnVsbCkgcmV0dXJuO1xuICAgIGNocm9tZS50YWJzLnVwZGF0ZSh3cy50YWJJZCwge2FjdGl2ZTogdHJ1ZX0pLnRoZW4oKHQpID0+IHtcbiAgICAgIGlmICh0Py53aW5kb3dJZCAhPSBudWxsKSB2b2lkIGNocm9tZS53aW5kb3dzPy51cGRhdGUodC53aW5kb3dJZCwge2ZvY3VzZWQ6IHRydWV9KT8uY2F0Y2g/LigoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7IC8qIHRhYiB3YXMgY2xvc2VkICovIH0pO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTbmFwc2hvdCAvIHVuZG8gLyByZWRvIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzbmFwc2hvdCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoc3VzcGVuZFNuYXBzaG90cykgcmV0dXJuO1xuICAgIGlmICh1bmRvU3RhY2subGVuZ3RoID49IFVORE9fQ0FQKSB1bmRvU3RhY2suc2hpZnQoKTtcbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlc3RvcmUgPSAoanNvbjogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IHRydWU7XG4gICAgdHJ5IHsgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGpzb24pIGFzIFBhbmVsTWVzc2FnZVtdOyB9IGNhdGNoIHsgbWVzc2FnZXMgPSBbXTsgfVxuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSBmYWxzZTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG4gIGNvbnN0IHVuZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCF1bmRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byB1bmRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICByZWRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUodW5kb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdVbmRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZWRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcmVkb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gcmVkbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHJlZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnUmVkb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlVW5kb0J1dHRvbnMgPSAoKTogdm9pZCA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwidW5kb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHVuZG9TdGFjay5sZW5ndGggPT09IDApO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInJlZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCByZWRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlQ29weVBhdGhCdXR0b24gPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWFjdGlvbj1cImNvcHktcGF0aFwiXScpO1xuICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgY29uc3QgaGFzID0gQm9vbGVhbihsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCk7XG4gICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgIWhhcyk7XG4gICAgYnRuLmRhdGFzZXQudGlwID0gaGFzXG4gICAgICA/IGBDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuXFxuJHtsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCA/PyAnJ31gXG4gICAgICA6ICdDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuIFJ1biBhbiBleHBvcnQgZmlyc3QuJztcbiAgfTtcbiAgY29uc3Qgb25Db3B5UGF0aCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwYXRoVG9Db3B5ID0gbGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGg7XG4gICAgaWYgKCFwYXRoVG9Db3B5KSB7XG4gICAgICBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIHJ1biBhIGRvd25sb2FkIGZpcnN0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocGF0aFRvQ29weSk7XG4gICAgICAvLyBTaG93IG9ubHkgdGhlIGxlYWYgZmlsZW5hbWUgaW4gdGhlIHN0YXR1cyDigJQgdGhlIGZ1bGwgV2luZG93cy1zdHlsZVxuICAgICAgLy8gYWJzb2x1dGUgcGF0aCB3b3VsZCBiZSAxMDArIGNoYXJzIGFuZCB3YXMgZGlzcnVwdGluZyB0aGUgc2lkZWJhclxuICAgICAgLy8gbGF5b3V0IGZvciB0aGUgMi1zZWNvbmQgc3RhdHVzIFRUTC5cbiAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICBzZXRTdGF0dXMoYENvcGllZCBwYXRoIMK3ICR7bGVhZn1gKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBwYXRoJywgbGVhZik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgd3JpdGUgZmFpbGVkOiAnICsgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB0byBhY3RpdmUgdGFiIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZW5kVG9DUyA9IGFzeW5jIChwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBtc2cgPSBwZyhwYXlsb2FkKTtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgIGlmICh0YWJzWzBdPy5pZCAhPSBudWxsKSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCBtc2cpLmNhdGNoKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7IHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLWNzJywge2RldGFpbDogbXNnfSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHNlbmRUb0NTQW5kV2FpdCA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPFIgfCBudWxsPiA9PiBuZXcgUHJvbWlzZTxSIHwgbnVsbD4oKHJlc29sdmUpID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zdCByZXFJZCA9IGByZXFfJHtzZWN1cmVUb2tlbigxMil9YDtcbiAgICAgIGNvbnN0IG9uUmVzcCA9IChlOiBFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSAoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsO1xuICAgICAgICBpZiAoZGV0YWlsPy5fX3JlcUlkID09PSByZXFJZCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgICAgIHJlc29sdmUoZGV0YWlsLnJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiB7X19yZXFJZDogcmVxSWQsIC4uLnBnKHBheWxvYWQpfX0pKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTsgcmVzb2x2ZShudWxsKTsgfSwgMTAwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9LCAodGFicykgPT4ge1xuICAgICAgaWYgKCF0YWJzWzBdPy5pZCkgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHBnKHBheWxvYWQpLCAocjogUikgPT4gcmVzb2x2ZShyKSk7XG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBzZW5kVG9CZyA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQmcpOiBQcm9taXNlPFIgfCBudWxsPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHsgcmV0dXJuIChhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShwZyhwYXlsb2FkKSkpIGFzIFI7IH1cbiAgICBjYXRjaCAoZSkgeyByZXR1cm4ge2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBhcyB1bmtub3duIGFzIFI7IH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgUmVjZWl2aW5nIGZyb20gY29udGVudCBzY3JpcHQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIERlZmVuc2l2ZSByaW5nLWJ1ZmZlciBkZWR1cGU6IGV2ZW4gdGhvdWdoIHdlIG5vdyB1c2Ugb25seSBvbmUgY2hhbm5lbCxcbiAgLy8gYW55IG1lc3NhZ2UgdGhhdCBzb21laG93IGFycml2ZXMgdHdpY2Ugd2l0aGluIH4yIHNlY29uZHMgaXMgaWdub3JlZC5cbiAgY29uc3QgcmVjZW50TWlkczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgUkVDRU5UX01JRF9DQVAgPSA2NDtcbiAgY29uc3Qgb25Dc01lc3NhZ2UgPSAobXNnOiBQZ0VudmVsb3BlPENzVG9QYW5lbD4pOiB2b2lkID0+IHtcbiAgICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuO1xuICAgIGlmIChtc2cuX19taWQpIHtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmluY2x1ZGVzKG1zZy5fX21pZCkpIHJldHVybjtcbiAgICAgIHJlY2VudE1pZHMucHVzaChtc2cuX19taWQpO1xuICAgICAgaWYgKHJlY2VudE1pZHMubGVuZ3RoID4gUkVDRU5UX01JRF9DQVApIHJlY2VudE1pZHMuc2hpZnQoKTtcbiAgICB9XG4gICAgaWYgKChtc2cgYXMge2tpbmQ/OiBzdHJpbmd9KS5raW5kID09PSAncGctdGFiLWFjdGl2YXRlZCcpIHtcbiAgICAgIHZvaWQgb25UYWJBY3RpdmF0ZWQobXNnIGFzIHVua25vd24gYXMge3RhYklkOiBudW1iZXI7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXRjaCAobXNnLmtpbmQpIHtcbiAgICAgIGNhc2UgJ2NhcHR1cmUnOiBvbkNhcHR1cmUobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXInOiBvbkhvdmVyKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdob3Zlcid9Pik7IHJldHVybjtcbiAgICAgIGNhc2UgJ2hvdmVyLWVuZCc6IG9uSG92ZXJFbmQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1hZGQnOiBvblBlbmRpbmdBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1jbGVhcic6IG9uUGVuZGluZ0NsZWFyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2ZlZWRiYWNrLWFkZCc6IG9uRmVlZGJhY2tBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncHJlZmVyZW5jZS1jaGFuZ2UnOiBvblByZWZlcmVuY2VDaGFuZ2UobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGFnZS1zbmFwc2hvdCc6IG9uUGFnZVNuYXBzaG90KChtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncGFnZS1zbmFwc2hvdCd9PikucGF5bG9hZCk7IHJldHVybjtcbiAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25QcmVmZXJlbmNlQ2hhbmdlID0gKHtyZWFzb24sIHBhZ2V9OiB7cmVhc29uOiBzdHJpbmc7IHBhZ2U6IGFueX0pOiB2b2lkID0+IHtcbiAgICBsaXZlVGFiVXJsID0gcGFnZT8udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgbGl2ZVRhYlBhdGggPSBsaXZlVGFiVXJsID8gcGF0aE9mKGxpdmVUYWJVcmwpIDogbGl2ZVRhYlBhdGg7XG4gICAgLy8gUGFnZSByb3dzIGFyZSBjYXB0dXJlIGhlYWRlcnMsIG5vdCBhIHRhYi9wYWdlIHRlbGVtZXRyeSBmZWVkLiBUaGUgbmV4dFxuICAgIC8vIHNlbGVjdG9yIGNhcHR1cmUgZnJvbSB0aGlzIHBhZ2Ugd2lsbCBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0L3N0YXRlIGFuZFxuICAgIC8vIGluc2VydCBhIHBhZ2UgaGVhZGVyIG9ubHkgaWYgbmVlZGVkLlxuICAgIHNldFN0YXR1cyhgJHtyZWFzb259IGNoYW5nZWRgLCB7a2luZDogJ2luZm8nfSk7XG4gIH07XG5cbiAgLy8gUGFnZS1ncm91cCByZWNvcmRzIG1heSBjYXJyeSBhIGZ1bGwtcGFnZSBzbmFwc2hvdCAodmlld3BvcnQsIHNjcm9sbFxuICAvLyBleHRlbnRzLCBkcHIsIGxhbmcsIGZ1bGwtcGFnZSBzY3JlZW5zaG90KS4gUGFnZU1lc3NhZ2UgaW4gdHlwZXMudHMgZG9lc24ndFxuICAvLyB5ZXQgZGVjbGFyZSB0aGUgZmllbGQsIHNvIHdlIHdpZGVuIGl0IGxvY2FsbHkg4oCUIHRoZSB2YWx1ZSBwZXJzaXN0cyB3aXRoXG4gIC8vIHRoZSByZXN0IG9mIHRoZSBtZXNzYWdlIEpTT04gYW5kIHJvdW5kLXRyaXBzIHRocm91Z2ggZXhwb3J0LlxuICB0eXBlIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90ID0gUGFnZU1lc3NhZ2UgJiB7c25hcHNob3Q/OiBQYWdlU25hcHNob3R9O1xuICAvLyBTbmFwc2hvdHMgdGhhdCBhcnJpdmVkIGJlZm9yZSBhIHBhZ2UtZ3JvdXAgcmVjb3JkIGV4aXN0cyBmb3IgdGhlaXIgVVJMLlxuICAvLyBBcHBsaWVkIHdoZW4gdGhlIHBhZ2UgaGVhZGVyIGlzIGxhdGVyIGNyZWF0ZWQgKHNlZSBvbkNhcHR1cmUpLlxuICBjb25zdCBwZW5kaW5nU25hcHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIFBhZ2VTbmFwc2hvdD4oKTtcbiAgY29uc3QgYXBwbHlTbmFwc2hvdFRvUGFnZSA9IChzbmFwOiBQYWdlU25hcHNob3QpOiBib29sZWFuID0+IHtcbiAgICAvLyBBdHRhY2ggdG8gdGhlIG1vc3QgcmVjZW50IHBhZ2UtZ3JvdXAgcmVjb3JkIGZvciB0aGlzIFVSTC5cbiAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlID09PSAncGFnZScgJiYgbS51cmwgPT09IHNuYXAudXJsKSB7XG4gICAgICAgIChtIGFzIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90KS5zbmFwc2hvdCA9IHNuYXA7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IG9uUGFnZVNuYXBzaG90ID0gKHBheWxvYWQ6IFBhZ2VTbmFwc2hvdCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGF5bG9hZD8udXJsKSByZXR1cm47XG4gICAgaWYgKGFwcGx5U25hcHNob3RUb1BhZ2UocGF5bG9hZCkpIHtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwYWdlIHJlY29yZCB5ZXQg4oCUIHN0YXNoIGZvciB0aGUgbmV4dCBjYXB0dXJlIG9uIHRoaXMgVVJMLlxuICAgICAgcGVuZGluZ1NuYXBzaG90cy5zZXQocGF5bG9hZC51cmwsIHBheWxvYWQpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvbkZlZWRiYWNrQWRkID0gKHtzZWxlY3RvciwgdGV4dCwgdXJsLCBwYXJlbnRVaWR9OiB7c2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ30pOiB2b2lkID0+IHtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgaW4gcHJpb3JpdHkgb3JkZXI6XG4gICAgLy8gICAxLiBwYXJlbnRVaWQg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBzdXBwbGllZCBhIHN0YWJsZSB1aWQgKHRoZVxuICAgIC8vICAgICAgc3Ryb25nZXN0IG1hdGNoOyBzdXJ2aXZlcyBzZWxlY3RvciBjaGFuZ2VzLCBzaWJsaW5nXG4gICAgLy8gICAgICBjb2xsaXNpb25zLCBtdWx0aXBsZSBjYXB0dXJlcyBvZiB0aGUgc2FtZSBlbGVtZW50KS5cbiAgICAvLyAgIDIuIHNlbGVjdG9yICsgdXJsIOKAlCBjb21wb3NpdGUga2V5OyBwcmV2ZW50cyBjcm9zcy1wYWdlXG4gICAgLy8gICAgICBjb250YW1pbmF0aW9uIHdoZW4gdGhlIHNhbWUgc2VsZWN0b3IgZXhpc3RzIG9uIG11bHRpcGxlIFVSTHMuXG4gICAgLy8gICAzLiBzZWxlY3RvciArIGxpdmVUYWJVcmwg4oCUIGZhbGxiYWNrIHdoZW4gdGhlIG1lc3NhZ2UgZGlkbid0XG4gICAgLy8gICAgICBjYXJyeSBhbiBleHBsaWNpdCB1cmwgKG9sZGVyIGNvbnRlbnQtc2NyaXB0IG1lc3NhZ2VzKS5cbiAgICBsZXQgaWR4ID0gLTE7XG4gICAgaWYgKHBhcmVudFVpZCkge1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51aWQgPT09IHBhcmVudFVpZCk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zdCB3YW50VXJsID0gdXJsID8/IGxpdmVUYWJVcmwgPz8gbnVsbDtcbiAgICAgIGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT5cbiAgICAgICAgbS50eXBlID09PSAnc2VsZWN0b3InXG4gICAgICAgICYmIG0uZW50cnkuc2VsZWN0b3IgPT09IHNlbGVjdG9yXG4gICAgICAgICYmICghd2FudFVybCB8fCBtLmVudHJ5LnVybCA9PT0gd2FudFVybCkpO1xuICAgIH1cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ29uRmVlZGJhY2tBZGQ6IG5vIHBhcmVudCBmb3VuZCcsIHtzZWxlY3RvciwgdXJsLCBwYXJlbnRVaWR9KTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCBsb3N0IGl0cyBwYXJlbnQg4oCUIGNoZWNrIHRoZSBhY3RpdmUgY2FwdHVyZScsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCBwYXJlbnRNc2cgPSBtZXNzYWdlc1tpZHhdIGFzIFNlbGVjdG9yTWVzc2FnZTtcbiAgICBsZXQgaW5zZXJ0QXQgPSBpZHggKyAxO1xuICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBuZXcgZmVlZGJhY2sgcm93IHNvIHRoZSBleHBvcnQgY2Fycmllc1xuICAgIC8vIHRoZSBGSyBsaW5rIGV4cGxpY2l0bHkgKG5vdCBqdXN0IGJ5IGNhcHR1cmUtYWRqYWNlbmN5KS5cbiAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgcGFyZW50VWlkOiBwYXJlbnRNc2cuZW50cnkudWlkLFxuICAgIH0pO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgYWRkZWQgZnJvbSBwYWdlJyk7XG4gICAgLy8gRXZlcnkgZmVlZGJhY2sgcGFyZW50IHNob3VsZCBoYXZlIGEgc2NyZWVuc2hvdC4gSWYgdGhlIHBhcmVudFxuICAgIC8vIGNhcHR1cmUgZGlkbid0IGdldCBvbmUgKGF1dG9TY3JlZW5zaG90IG9mZiwgc2tpcFNjcmVlbnNob3RIb3N0c1xuICAgIC8vIGhpdCwgbmV0d29yayBnbGl0Y2gpLCByZS1maXJlIG5vdy5cbiAgICBpZiAoIXBhcmVudE1zZy5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChwYXJlbnRNc2cpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvblBlbmRpbmdBZGQgPSAoe2VudHJ5fToge2VudHJ5OiBFbnRyeX0pOiB2b2lkID0+IHsgcGVuZGluZ011bHRpLnB1c2goZW50cnkpOyByZW5kZXIoKTsgfTtcbiAgY29uc3Qgb25QZW5kaW5nQ2xlYXIgPSAoKTogdm9pZCA9PiB7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgfTtcblxuICBjb25zdCBmaW5kRHVwbGljYXRlID0gKHNlbGVjdG9yOiBzdHJpbmcsIHVybDogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+XG4gICAgbWVzc2FnZXMuZmluZCgobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+XG4gICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3IgJiYgKCF1cmwgfHwgbS5lbnRyeS51cmwgPT09IHVybCkpO1xuXG4gIC8vIEZpbmQgYW4gZXhpc3RpbmcgY2FwdHVyZSBmb3IgdGhlIGFjdGl2ZSB0YWIgKyBzZWxlY3Rvci4gQ3Jvc3MtcGFnZVxuICAvLyBjb250YW1pbmF0aW9uIHByZXZlbnRpb24gKHNlZSB0eXBlcy50cyBmZWVkYmFjay1hZGQgZG9jc3RyaW5nKTpcbiAgLy8gYSBzZWxlY3RvciBhbG9uZSBpcyBOT1QgYSBzdGFibGUgaWRlbnRpdHkg4oCUIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYFxuICAvLyBleGlzdHMgb24gZXZlcnkgcGFnZTsgYGJ1dHRvbmAgaXMgZXZlcnl3aGVyZS4gU3Ryb25nIGlkZW50aXR5IGlzXG4gIC8vIChzZWxlY3RvciArIHVybCkuIFJldHVybnMgdGhlIG1vc3QgcmVjZW50IG1hdGNoIHNvIHJlLWhvdmVyaW5nIGFuXG4gIC8vIGFscmVhZHktY2FwdHVyZWQgZWxlbWVudCByZXNvbHZlcyBjb25zaXN0ZW50bHkuXG4gIGNvbnN0IGZpbmRDYXB0dXJlRm9yQ3VycmVudFBhZ2UgPSAoc2VsZWN0b3I6IHN0cmluZyk6IFNlbGVjdG9yTWVzc2FnZSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgY29uc3QgdXJsID0gbGl2ZVRhYlVybDtcbiAgICAvLyBXYWxrIGJhY2t3YXJkcyBzbyB0aGUgbW9zdCByZWNlbnQgbWF0Y2hpbmcgY2FwdHVyZSB3aW5zIHdoZW4gYVxuICAgIC8vIHNlbGVjdG9yIGxlZ2l0aW1hdGVseSBoYXMgbXVsdGlwbGUgY2FwdHVyZXMgb24gdGhlIHNhbWUgcGFnZVxuICAgIC8vIChlLmcuLCB0aGUgdXNlciByZS1jYXB0dXJlZCB0aGUgc2FtZSBlbGVtZW50IGFmdGVyIGVkaXRzKS5cbiAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yICE9PSBzZWxlY3RvcikgY29udGludWU7XG4gICAgICBpZiAodXJsICYmIG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgcmV0dXJuIG07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgY29uc3QgY2Fub25pY2FsRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4gSlNPTi5zdHJpbmdpZnkoe1xuICAgIHRhZzogZS50YWcsIHNlbGVjdG9yOiBlLnNlbGVjdG9yLCB0ZXh0OiBlLnRleHQsIHJvbGU6IGUucm9sZSxcbiAgICBhdHRyczogZS5hdHRycywgY2xhc3NlczogZS5jbGFzc2VzLFxuICAgIHJlY3Q6IGUucmVjdCwgb3V0ZXJIVE1MOiBlLm91dGVySFRNTCxcbiAgICBzdHlsZXM6IGUuc3R5bGVzLCBtYXRjaGVkUnVsZXM6IGUubWF0Y2hlZFJ1bGVzLFxuICB9KTtcblxuICBjb25zdCBvbkNhcHR1cmUgPSAoe2VudHJ5LCBwYWdlLCBncm91cGVkfTogRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnY2FwdHVyZSd9Pik6IHZvaWQgPT4ge1xuICAgIGlmICghZW50cnkgfHwgIXBhZ2UpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGxpdmVUYWJVcmwgPSBwYWdlLnVybDtcbiAgICBsaXZlVGFiUGF0aCA9IHBhdGhPZihwYWdlLnVybCk7XG4gICAgaWYgKGdyb3VwZWQpIHtcbiAgICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICAgIGlmIChtPy50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSBtLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgICAgIGdyb3VwLnB1c2goZW50cnkpO1xuICAgICAgICAgIG0uZW50cnkuZ3JvdXAgPSBncm91cDtcbiAgICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpOyBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICAgIC8vIEZpcmUgYSBncm91cCBzaG90IHVzaW5nIHRoZSBoZWFkICsgbWVtYmVycy4gVGhlIGhlYWQncyBzZWxlY3RvclxuICAgICAgICAgIC8vIGlzIG0uZW50cnkuc2VsZWN0b3I7IG1lbWJlcnMnIHNlbGVjdG9ycyBhcmUgaW4gdGhlIGZyZXNobHlcbiAgICAgICAgICAvLyBtdXRhdGVkIGdyb3VwIGFycmF5LlxuICAgICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFttLmVudHJ5LnNlbGVjdG9yLCAuLi4obS5lbnRyeS5ncm91cCA/PyBbXSkubWFwKChnKSA9PiBnLnNlbGVjdG9yKV07XG4gICAgICAgICAgdm9pZCBmaXJlR3JvdXBTaG90KG0sIHNlbGVjdG9ycyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIER1cGUgZGV0ZWN0aW9uLiBDcm9zcy1jb250YW1pbmF0aW9uIGZpeDogYSAoc2VsZWN0b3IsIHVybCkgbWF0Y2hcbiAgICAvLyBpcyBORUNFU1NBUlkgYnV0IG5vdCBTVUZGSUNJRU5UIOKAlCB0d28gc2libGluZyBlbGVtZW50cyB3aXRoIHRoZVxuICAgIC8vIHNhbWUgdGVzdElkIC8gc2FtZSByb2xlL2FyaWEgc2VsZWN0b3IgbGl2ZSBvbiB0aGUgc2FtZSBVUkwgYnV0XG4gICAgLy8gYXJlIGRpZmZlcmVudCBjYXB0dXJlcy4gQ29tcGFyZSB0aGUgY2Fub25pY2FsLWVudHJ5IGhhc2ggKHdoaWNoXG4gICAgLy8gaW5jbHVkZXMgcmVjdCwgdGV4dCwgb3V0ZXJIVE1MLCBldGMuKSBiZWZvcmUgdHJlYXRpbmcgdGhlIG5ld1xuICAgIC8vIGNhcHR1cmUgYXMgYSByZWZyZXNoIG9mIHRoZSBvbGQgb25lLiBXaGVuIHRoZSBoYXNoIGRpZmZlcnMsIHdlXG4gICAgLy8ga2VlcCBCT1RIIGNhcHR1cmVzIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nLlxuICAgIGNvbnN0IGR1cGUgPSBmaW5kRHVwbGljYXRlKGVudHJ5LnNlbGVjdG9yLCBlbnRyeS51cmwpO1xuICAgIGlmIChkdXBlKSB7XG4gICAgICBjb25zdCBiZWZvcmUgPSBjYW5vbmljYWxFbnRyeShkdXBlLmVudHJ5KTtcbiAgICAgIGNvbnN0IGFmdGVyID0gY2Fub25pY2FsRW50cnkoZW50cnkpO1xuICAgICAgaWYgKGJlZm9yZSA9PT0gYWZ0ZXIpIHtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gSGFzaGVzIGRpZmZlci4gVHdvIGNhc2VzOlxuICAgICAgLy8gICAoYSkgU2FtZSBlbGVtZW50IHJlLWNhcHR1cmVkIGFmdGVyIGNvbnRlbnQgY2hhbmdlIOKAlCB0aGUgcmVjdFxuICAgICAgLy8gICAgICAgc3RheXMgcHV0ICh3aXRoaW4gYSBmZXcgcHgpLCBidXQgdGV4dC9vdXRlckhUTUwgbW92ZWQuXG4gICAgICAvLyAgICAgICBUcmVhdCBhcyBhIHJlZnJlc2guXG4gICAgICAvLyAgIChiKSBEaWZmZXJlbnQgZWxlbWVudCB0aGF0IGhhcHBlbnMgdG8gc2hhcmUgYSBzZWxlY3RvciDigJQgdGhlXG4gICAgICAvLyAgICAgICByZWN0IGlzIGluIGEgZGlmZmVyZW50IHBvc2l0aW9uLiBUcmVhdCBhcyBhIG5ldyBjYXB0dXJlLlxuICAgICAgLy8gV2UgZGlzY3JpbWluYXRlIGJ5IHJlY3Qgb3ZlcmxhcDogaWYgYm90aCByZWN0cyBleGlzdCBhbmQgdGhlaXJcbiAgICAgIC8vIGNlbnRlcnMgYXJlIHdpdGhpbiA4cHggb24gYm90aCBheGVzLCByZWZyZXNoOyBvdGhlcndpc2Uga2VlcFxuICAgICAgLy8gYm90aC5cbiAgICAgIGNvbnN0IHIxID0gZHVwZS5lbnRyeS5yZWN0O1xuICAgICAgY29uc3QgcjIgPSBlbnRyeS5yZWN0O1xuICAgICAgY29uc3Qgc2FtZUVsZW1lbnQgPSByMSAmJiByMlxuICAgICAgICAmJiBNYXRoLmFicygocjEueCArIHIxLncgLyAyKSAtIChyMi54ICsgcjIudyAvIDIpKSA8PSA4XG4gICAgICAgICYmIE1hdGguYWJzKChyMS55ICsgcjEuaCAvIDIpIC0gKHIyLnkgKyByMi5oIC8gMikpIDw9IDg7XG4gICAgICBpZiAoc2FtZUVsZW1lbnQpIHtcbiAgICAgICAgZGVsZXRlIGR1cGUuZHVwZVBlbmRpbmc7XG4gICAgICAgIGR1cGUuZW50cnkgPSBlbnRyeTtcbiAgICAgICAgcGVyc2lzdCgpOyByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBVcGRhdGVkICMke2R1cGUuZW50cnkubn1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIERpZmZlcmVudCBlbGVtZW50IHdpdGggdGhlIHNhbWUgc2VsZWN0b3Ig4oaSIGZhbGwgdGhyb3VnaCBhbmRcbiAgICAgIC8vIGVtaXQgYXMgYSBuZXcgY2FwdHVyZS4gVGhlIGFnZW50IHJlYWRpbmcgdGhlIGV4cG9ydCBzZWVzIGJvdGhcbiAgICAgIC8vIHJvd3Mgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBidXQgZGlmZmVyZW50IHVpZHMgKyByZWN0cy5cbiAgICB9XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgdGhlIHNlc3Npb24gRksgc28gdGhlIGNvbnN1bWVyIGNhbiBqb2luIGVudHJpZXMgdG8gdGhlaXJcbiAgICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS5cbiAgICBpZiAoc2Vzc2lvbklkKSBlbnRyeS5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gICAgY29uc3QgbmV3TXNnOiBTZWxlY3Rvck1lc3NhZ2UgPSB7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBlbnRyeS50cywgZW50cnl9O1xuICAgIC8vIFBhZ2Ugcm93cyBleGlzdCBvbmx5IGFzIGhlYWRlcnMgZm9yIGNhcHR1cmVkIHNlbGVjdG9ycy4gRG8gbm90IGNyZWF0ZVxuICAgIC8vIHRoZW0gZnJvbSB0YWIgYWN0aXZhdGlvbiwgdmFsaWRhdGlvbiwgb3IgcHJlZmVyZW5jZSBjaGFuZ2VzOyBpbnNlcnQgb25lXG4gICAgLy8gaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBmaXJzdCBzZWxlY3RvciBvZiBhIG5ldyBwYWdlIGJsb2NrLlxuICAgIGxldCBwcmV2aW91c1BhZ2U6IFBhZ2VNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IHBvc2l0aW9uIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlID09PSAncGFnZScpIHsgcHJldmlvdXNQYWdlID0gbTsgYnJlYWs7IH1cbiAgICAgIGlmIChtPy50eXBlID09PSAnc2VsZWN0b3InKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFwcmV2aW91c1BhZ2UgfHwgcHJldmlvdXNQYWdlLnVybCAhPT0gcGFnZS51cmwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNc2c6IFBhZ2VNZXNzYWdlID0ge1xuICAgICAgICB0eXBlOiAncGFnZScsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB1cmw6IHBhZ2UudXJsLCB0aXRsZTogcGFnZS50aXRsZSwgdmlld3BvcnQ6IHBhZ2Uudmlld3BvcnQsIHRva2VuczogcGFnZS50b2tlbnMsXG4gICAgICAgIHVzZXJBZ2VudDogcGFnZS51c2VyQWdlbnQsIGxhbmc6IHBhZ2UubGFuZyxcbiAgICAgICAgZ2l0Q29udGV4dDogKHBhZ2UgYXMgYW55KS5naXRDb250ZXh0LFxuICAgICAgICByb3V0ZTogKHBhZ2UgYXMgYW55KS5yb3V0ZSxcbiAgICAgICAgc3RhdGU6IChwYWdlIGFzIGFueSkuc3RhdGUsXG4gICAgICAgIHNlc3Npb25JZCxcbiAgICAgIH07XG4gICAgICAvLyBBdHRhY2ggYW55IHBhZ2Utc25hcHNob3QgdGhhdCBhcnJpdmVkIGJlZm9yZSB0aGlzIHBhZ2UgaGVhZGVyIGV4aXN0ZWQuXG4gICAgICBjb25zdCBwZW5kaW5nID0gcGVuZGluZ1NuYXBzaG90cy5nZXQocGFnZS51cmwpO1xuICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgKHBhZ2VNc2cgYXMgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QpLnNuYXBzaG90ID0gcGVuZGluZztcbiAgICAgICAgcGVuZGluZ1NuYXBzaG90cy5kZWxldGUocGFnZS51cmwpO1xuICAgICAgfVxuICAgICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBwYWdlTXNnKTtcbiAgICAgIHBvc2l0aW9uKys7XG4gICAgfVxuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgbmV3TXNnKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgLy8gSW50ZW50aW9uYWxseSBOTyBzZXRMYXN0QWN0aXZlKGVudHJ5LnNlbGVjdG9yKSBoZXJlIOKAlCB0aGUgdXNlciBhc2tlZFxuICAgIC8vIGZvciBmcmVzaCBjYXB0dXJlcyB0byBzdGF5IHVuLWhpZ2hsaWdodGVkIGluIHRoZSBzaWRlYmFyLiBUaGUgc3RpY2t5XG4gICAgLy8gcmluZyArIGxhc3QtYWN0aXZlIG91dGxpbmUgbm93IG9ubHkgZ2V0IGFwcGxpZWQgb24gZXhwbGljaXRcbiAgICAvLyBob3Zlci9jbGljayBvZiB0aGUgc2lkZWJhciBidWJibGUgKGFuZCB0aGUgcGFnZS1zaWRlIGZsYXNoIGZyb21cbiAgICAvLyBjYXB0dXJlRW50cnkgc3RpbGwgY29uZmlybXMgdGhlIGNhcHR1cmUgdmlzdWFsbHkgb24gdGhlIHBhZ2UpLlxuICAgIHJlbmRlcigpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgdm9pZCBmaXJlRWxlbWVudFNob3QobmV3TXNnKTtcbiAgICB2b2lkIGZpcmVQYWdlU2hvdElmTmVlZGVkKG5ld01zZyk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNjcmVlbnNob3Qgd2lyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBGaXJlIHRoZSBwZXItZWxlbWVudCBzaG90LCBhdHRhY2ggdGhlIHJldHVybmVkIGZpbGVuYW1lICsgZGF0YVVybCBvbnRvXG4gIC8vIHRoZSBlbnRyeSwgYW5kIHBlcnNpc3QuIHNob3VsZFNraXBTY3JlZW5zaG90IGJhaWxzIG9uIGhvc3RzIGluIHRoZVxuICAvLyB1c2VyJ3Mgc2tpcCBsaXN0OyBhdXRvU2NyZWVuc2hvdD1mYWxzZSBiYWlscyBnbG9iYWxseS5cbiAgY29uc3QgZmlyZUVsZW1lbnRTaG90ID0gYXN5bmMgKG1zZzogU2VsZWN0b3JNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGF1dG9TY3JlZW5zaG90PWZhbHNlJyk7XG4gICAgICAvLyBCdWcgIzI6IHRlbGwgdGhlIGV4cG9ydCB3aHkgdGhlIHNob3QgaXMgbWlzc2luZy5cbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnYXV0b1NjcmVlbnNob3RPZmYnfTtcbiAgICAgIC8vIFJlLXJlbmRlciBzbyB0aGUgcmVzZXJ2ZWQgc2tlbGV0b24gKHdoaWNoIGFzc3VtZWQgYSBzaG90IHdhcyBjb21pbmcpXG4gICAgICAvLyBjb2xsYXBzZXMgbm93IHRoYXQgd2Uga25vdyBvbmUgd29uJ3QgYXJyaXZlLlxuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGhvc3Qgb24gc2tpcCBsaXN0JywgbXNnLmVudHJ5LnVybCk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ3NraXBTY3JlZW5zaG90SG9zdHMnfTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qg4oaSJywgbXNnLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAvLyBTVyBjb2xkLXN0YXJ0IHJhY2U6IHRoZSBGSVJTVCBjYXB0dXJlIGluIGEgc2Vzc2lvbiBvZnRlbiBsb3NlcyBpdHNcbiAgICAvLyBmaXJzdCBtZXNzYWdlIGJlY2F1c2UgdGhlIGJnIHdvcmtlciBpcyBzdGlsbCBzdGFydGluZy4gUmV0cnkgb25jZVxuICAgIC8vIGFmdGVyIGEgc2hvcnQgZGVsYXkgaWYgdGhlIGZpcnN0IGNhbGwgY29tZXMgYmFjayBudWxsL2VtcHR5LlxuICAgIGxldCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHkgfHwgKCFyZXBseS5vayAmJiAhcmVwbHkuZXJyb3IpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJzdCBzY3JlZW5zaG90IHJlcGx5IHdhcyBlbXB0eTsgcmV0cnlpbmcgYWZ0ZXIgMjAwbXMgKFNXIGNvbGQtc3RhcnQpJyk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAyMDApKTtcbiAgICAgIHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3QgcmVwbHk6JywgcmVwbHkpO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkge1xuICAgICAgc2V0U3RhdHVzKGBTY3JlZW5zaG90IGZhaWxlZDogJHtyZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCd9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgIHVuYXZhaWxhYmxlUmVhc29uOiByZXBseT8uZXJyb3IgPz8gJ2NhcHR1cmVGYWlsZWQnLFxuICAgICAgfTtcbiAgICAgIC8vIENvbGxhcHNlIHRoZSByZXNlcnZlZCBza2VsZXRvbiDigJQgbm8gc2hvdCBpcyBjb21pbmcgZm9yIHRoaXMgY2FwdHVyZS5cbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBTdWNjZXNzZnVsIHJldHJ5IOKAlCBzdHJpcCBhbnkgcHJpb3IgdW5hdmFpbGFibGVSZWFzb24gc2luY2Ugd2Ugbm93XG4gICAgLy8gaGF2ZSBhIHJlYWwgc2hvdC5cbiAgICBkZWxldGUgbXNnLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgIGVsZW1lbnQ6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgLi4uKHJlcGx5LmNyb3AgPyB7Y3JvcDogcmVwbHkuY3JvcH0gOiB7fSksXG4gICAgfTtcbiAgICBpZiAocmVwbHkuZGF0YVVybCkge1xuICAgICAgc2hvdHMuc2V0KG1zZy5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KG1zZy5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmlyZSB0aGUgZ3JvdXAgc2hvdCAodW5pb24gYmJveCBvZiBoZWFkICsgYWxsIG1lbWJlcnMpIGFuZCBzdGFzaCB0aGVcbiAgLy8gZmlsZW5hbWUgb24gdGhlIGhlYWQtb2YtZ3JvdXAgZW50cnkuXG4gIGNvbnN0IGZpcmVHcm91cFNob3QgPSBhc3luYyAoaGVhZDogU2VsZWN0b3JNZXNzYWdlLCBzZWxlY3RvcnM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkgcmV0dXJuO1xuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChoZWFkLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtZ3JvdXAnLCBzZWxlY3RvcnMsIG46IGhlYWQuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHJldHVybjtcbiAgICBoZWFkLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4oaGVhZC5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgIGdyb3VwOiByZXBseS5maWxlbmFtZSxcbiAgICAgIGNhcHR1cmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQoaGVhZC5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZGF0YVVybCk7XG4gICAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHsgc2hvdHNGdWxsLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7IHBlcnNpc3RTaG90c0Z1bGwoKTsgfVxuICAgICAgcGVyc2lzdFNob3RzKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBQYWdlLWxldmVsIHNob3Qgb25jZSBwZXIgKHdvcmtzcGFjZSwgcGFnZS11cmwsIGRheSkuIFN1YnNlcXVlbnQgY2FwdHVyZXNcbiAgLy8gb24gdGhlIHNhbWUgcGFnZSByZXVzZSB0aGUgc2FtZSBvbi1kaXNrIGZpbGUgcGF0aC5cbiAgY29uc3QgZmlyZVBhZ2VTaG90SWZOZWVkZWQgPSBhc3luYyAobXNnOiBTZWxlY3Rvck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSByZXR1cm47XG4gICAgLy8gUGVyLWNhcHR1cmUgcGFnZS1zaG90IG1vZGUgKMKnNC41KTogd2hlbiBlbmFibGVkLCBza2lwIHRoZVxuICAgIC8vIHBlci0od29ya3NwYWNlLCB1cmwpIGRlZHVwZSBhbmQgZmlyZSBhIGZyZXNoIHBhZ2Ugc2hvdCBldmVyeSB0aW1lLlxuICAgIC8vIFVzZWZ1bCB3aGVuIHRoZSBwYWdlIHN0YXRlIGNoYW5nZXMgYmV0d2VlbiBjYXB0dXJlcyAobW9kYWwgb3BlbnMsXG4gICAgLy8gbXVsdGktc3RlcCBmbG93LCBldGMuKSBhbmQgdGhlIHVzZXIgd2FudHMgdG8gc2VlIHRoZSB3aG9sZSBwYWdlIGF0XG4gICAgLy8gZWFjaCBzdGVwLiBDb3N0cyBvbmUgZnVsbC1wYWdlIFBORyBwZXIgY2FwdHVyZSwgc28gZGVmYXVsdCBvZmYuXG4gICAgaWYgKCFwcmVmcy5wYWdlU2hvdFBlckNhcHR1cmUpIHtcbiAgICAgIGNvbnN0IGtleSA9IHBhZ2VTaG90S2V5KG1zZy5lbnRyeS51cmwpO1xuICAgICAgaWYgKHBhZ2VTaG90c0ZpcmVkLmhhcyhrZXkpKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gZmluZEV4aXN0aW5nUGFnZVNob3QobXNnLmVudHJ5LnVybCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgICAgIHBhZ2U6IGV4aXN0aW5nLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBhZ2VTaG90c0ZpcmVkLmFkZChrZXkpO1xuICAgIH1cbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtcGFnZScsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIC8vIEFwcGx5IHRvIFRISVMgZW50cnkgYW5kIHRvIGFueSBvdGhlciBlbnRyaWVzIGFscmVhZHkgY2FwdHVyZWQgb24gdGhlXG4gICAgLy8gc2FtZSBVUkwgdG9kYXkgKHNvIHRoZSBwYWdlLXNob3QgYXBwZWFycyB1bmlmb3JtbHkpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS51cmwgIT09IG1zZy5lbnRyeS51cmwpIGNvbnRpbnVlO1xuICAgICAgbS5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obS5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgcGFnZTogcmVwbHkuZmlsZW5hbWUsXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBTdGFzaCB0aGUgZnVsbCBQTkcgc28gdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGNhbiBidW5kbGUgaXQuIEtleWVkXG4gICAgLy8gYnkgVVJMIHNpbmNlIHBhZ2Ugc2hvdHMgYXJlIHBhZ2Utc2NvcGVkLCBub3Qgc2VsZWN0b3Itc2NvcGVkLlxuICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkge1xuICAgICAgc2hvdHNGdWxsLnNldCgncGFnZTo6JyArIG1zZy5lbnRyeS51cmwsIHJlcGx5LmZ1bGxEYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIEZpbmQgYW55IHNlbGVjdG9yIGVudHJ5IG9uIHRoaXMgVVJMIHRoYXQgYWxyZWFkeSBoYXMgYSBgcGFnZWAgc2hvdFxuICAvLyByZWNvcmRlZCDigJQgdXNlZCBzbyB0aGF0IHJldHJvYWN0aXZlIGNhcHR1cmVzIGluaGVyaXQgdGhlIGV4aXN0aW5nIFBOR1xuICAvLyBwYXRoIGluc3RlYWQgb2YgcmVmaXJpbmcuXG4gIGNvbnN0IGZpbmRFeGlzdGluZ1BhZ2VTaG90ID0gKHVybDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gdXJsKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIHJldHVybiBtLmVudHJ5LnNjcmVlbnNob3QucGFnZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgY29uc3Qgb25Ib3ZlciA9ICh7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3R9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdob3Zlcid9Pik6IHZvaWQgPT4ge1xuICAgIHNldFN0YXR1cyhgQWx0LWhvdmVyIMK3ICR7bGFiZWx9YCwge2tpbmQ6ICdpbmZvJ30pO1xuICAgIC8vIElkZW50aXR5IGlzIChzZWxlY3RvciwgdXJsKS4gU2FtZSBzZWxlY3RvciBvbiB0d28gZGlmZmVyZW50IFVSTHNcbiAgICAvLyBpcyB0d28gZGlmZmVyZW50IGNhcHR1cmVzOyB0aGUgcHJldmlvdXMgc2VsZWN0b3Itb25seSBsb29rdXBcbiAgICAvLyBjYXVzZWQgY3Jvc3MtcGFnZSBjb21tZW50IGNvbnRhbWluYXRpb24uIFByZWZlciBzYW1lLVVSTCArXG4gICAgLy8gc2FtZS1zZWxlY3RvciBhcyB0aGUgc3Ryb25nZXN0IG1hdGNoLlxuICAgIGNvbnN0IGV4aXN0aW5nID0gZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZShzZWxlY3Rvcik7XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICBpZiAocHJlZnMuYXV0b1Njcm9sbFRvSG92ZXJlZCkgc2Nyb2xsTWVzc2FnZUludG9WaWV3KGV4aXN0aW5nLmlkKTtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIoZXhpc3RpbmcuaWQpO1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24nLCBzZWxlY3RvciwgcGF5bG9hZDoge3VpZDogZXhpc3RpbmcuZW50cnkudWlkLCBuOiBleGlzdGluZy5lbnRyeS5uLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2t9fSk7XG4gICAgICBpZiAocGhhbnRvbVRhcmdldCkgeyBwaGFudG9tVGFyZ2V0ID0gbnVsbDsgcmVuZGVyKCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQUxXQVlTIHNob3cgdGhlIGNvbW1lbnQgYm94LCBldmVuIGZvciB1bmNhcHR1cmVkIGVsZW1lbnRzLiBPbiBzdWJtaXRcbiAgICAgIC8vIHRoZSBjb250ZW50IHNjcmlwdCB3aWxsIGNhcHR1cmUgdGhlIGVsZW1lbnQgZmlyc3QsIHRoZW4gYXR0YWNoIHRoZVxuICAgICAgLy8gY29tbWVudCDigJQgdHVybmluZyBob3Zlci1jb21tZW50IGludG8gYSBjYXB0dXJlK2NvbW1lbnQgc2hvcnRjdXQuXG4gICAgICBwaGFudG9tVGFyZ2V0ID0ge3NlbGVjdG9yLCBsYWJlbCwgdGFnLCByZWN0OiByZWN0IGFzIHVua25vd24gYXMgRE9NUmVjdH07XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7Y2FwdHVyZWQ6IGZhbHNlLCBmZWVkYmFjazogW119fSk7XG4gICAgICByZW5kZXJQaGFudG9tKCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBvbkhvdmVyRW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdGF0dXMudGV4dENvbnRlbnQ/LnN0YXJ0c1dpdGgoJ0FsdC1ob3ZlcicpKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnJztcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgeyBwaGFudG9tVGFyZ2V0ID0gbnVsbDsgcmVuZGVyUGhhbnRvbSgpOyB9XG4gICAgLy8gTm8gYW5ub3RhdGlvbi1jbGVhciBoZXJlIOKAlCB0aGUgY29udGVudCBzY3JpcHQga2VlcHMgdGhlIGJveCBvcGVuIHNvIHRoZVxuICAgIC8vIHVzZXIgY2FuIG1vdXNlIHRvIGl0IGFuZCB0eXBlLiBPdXRzaWRlLWNsaWNrIC8gRXNjIGRpc21pc3MgaXQuXG4gIH07XG5cbiAgY29uc3QgY29sbGVjdEZlZWRiYWNrQWZ0ZXIgPSAoc2VsZWN0b3JJZDogc3RyaW5nKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmICghZm91bmQpIHsgaWYgKG0uaWQgPT09IHNlbGVjdG9ySWQpIGZvdW5kID0gdHJ1ZTsgY29udGludWU7IH1cbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgfHwgbS50eXBlID09PSAncGFnZScpIGJyZWFrO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgb3V0LnB1c2gobS50ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBjb25zdCBjZW50ZXJFbGVtZW50SW5MaXN0ID0gKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGxpc3RSZWN0ID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBlbFJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0YXJnZXQgPSBsaXN0LnNjcm9sbFRvcCArIGVsUmVjdC50b3AgLSBsaXN0UmVjdC50b3AgLSAobGlzdC5jbGllbnRIZWlnaHQgLyAyKSArIChlbFJlY3QuaGVpZ2h0IC8gMik7XG4gICAgbGlzdC5zY3JvbGxUbyh7dG9wOiBNYXRoLm1heCgwLCB0YXJnZXQpLCBiZWhhdmlvcjogJ3Ntb290aCd9KTtcbiAgfTtcblxuICBjb25zdCBzY3JvbGxNZXNzYWdlSW50b1ZpZXcgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGlmICghZWwpIHJldHVybjtcbiAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGVsKTtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaC1pbnRvLXZpZXcnKTtcbiAgICB2b2lkIGVsLm9mZnNldFdpZHRoO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoLWludG8tdmlldycpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGlja3kgaGlnaGxpZ2h0IG1hbmFnZW1lbnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNldExhc3RBY3RpdmUgPSAoc2VsZWN0b3I6IHN0cmluZyB8IG51bGwpOiB2b2lkID0+IHtcbiAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICBjbGVhclRpbWVvdXQoc3RpY2t5VGltZXIpO1xuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICAgIGFybVN0aWNreUV4cGlyeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYXJtU3RpY2t5RXhwaXJ5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgc3RpY2t5VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXBhbmVsSG92ZXJlZCkge1xuICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3Rvci5sYXN0LWFjdGl2ZScpKSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdsYXN0LWFjdGl2ZScpO1xuICAgICAgfSBlbHNlIGFybVN0aWNreUV4cGlyeSgpO1xuICAgIH0sIFNUSUNLWV9UVExfTVMpO1xuICB9O1xuXG4gIC8vIEZhc3Qgc3RpY2t5LWNsZWFyOiB3aGVuIHRoZSB1c2VyJ3MgY3Vyc29yIGxlYXZlcyB0aGUgcGFuZWwsIGZpcmVcbiAgLy8gc3RpY2t5LWNsZWFyIGFmdGVyIGEgMzAwIG1zIGdyYWNlIHdpbmRvdy4gUHJpb3IgYmVoYXZpb3Igd2FpdGVkIHRoZVxuICAvLyBmdWxsIFNUSUNLWV9UVExfTVMgKH41IHMpIHdoaWNoIGZlbHQgbGlrZSB0aGUgcGFnZS1zaWRlIGhpZ2hsaWdodFxuICAvLyBcImRvZXNuJ3QgZ28gYXdheSBldmVuIGFmdGVyIEkgdW5ob3ZlclwiLiAzMDAgbXMgaXMgc2hvcnQgZW5vdWdoIHRvXG4gIC8vIGZlZWwgcmVzcG9uc2l2ZSBidXQgbG9uZyBlbm91Z2ggdGhhdCBhIHF1aWNrIHJlcG9zaXRpb24gKGUuZy5cbiAgLy8gYWNjaWRlbnRhbGx5IGNyb3NzaW5nIHRoZSBzZWFtKSBkb2Vzbid0IGtpbGwgdGhlIHJpbmcgbWlkLWZsaWdodC5cbiAgbGV0IHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgcGFuZWxIb3ZlcmVkID0gdHJ1ZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgeyBjbGVhclRpbWVvdXQoc3RpY2t5Q2xlYXJHcmFjZSk7IHN0aWNreUNsZWFyR3JhY2UgPSAwOyB9XG4gICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gIH0pO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gICAgaWYgKHN0aWNreUNsZWFyR3JhY2UpIGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTtcbiAgICBzdGlja3lDbGVhckdyYWNlID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICAgIC8vIEFsc28gZHJvcCBvdXIgb3duIGZyb20tcGFuZWwgKyBtdWx0aSByaW5ncyBpbiBjYXNlIHRoZXkgbGVha2VkLlxuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICBzdGlja3lDbGVhckdyYWNlID0gMDtcbiAgICB9LCAzMDApO1xuICB9KTtcbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIC8vIFdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlaXIgbW91c2UgaW50byB0aGUgcGFuZWwsIHN1cHByZXNzIHBhZ2Utc2lkZVxuICAgIC8vIGFsdC1ob3ZlciBzdGF0ZSBzbyB0aGUgb3JhbmdlIHJpbmcgZG9lc24ndCBrZWVwIGZvbGxvd2luZyB0aGUgY3Vyc29yLlxuICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFJlbmRlcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgTkVBUl9CT1RUT01fUFggPSA4MDtcbiAgY29uc3Qgd2FzTmVhckJvdHRvbSA9ICgpOiBib29sZWFuID0+XG4gICAgbGlzdC5zY3JvbGxIZWlnaHQgLSBsaXN0LnNjcm9sbFRvcCAtIGxpc3QuY2xpZW50SGVpZ2h0IDw9IE5FQVJfQk9UVE9NX1BYO1xuXG4gIGNvbnN0IG1hdGNoZXNTZWFyY2ggPSAobTogUGFuZWxNZXNzYWdlKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIG0udGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgLy8gTWF0Y2ggYWdhaW5zdCB0aGUgV0hPTEUgZW50cnkgKHNlbGVjdG9yLCB0ZXh0LCBjbGFzc2VzLCBhdHRycyxcbiAgICAgIC8vIG91dGVySFRNTCwgc3R5bGVzLCBldGMuKSBzbyBzZWFyY2ggaGl0cyBhbnl0aGluZyB2aXNpYmxlIGluIHRoZVxuICAgICAgLy8gYm9keS1qc29uLiBTdHJpbmdpZnlpbmcgb25jZSBpcyBmaW5lIOKAlCB0aGUgY29zdCBpcyB0aW55IHZzIHJlbmRlci5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShlKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIH1cbiAgICBpZiAobS50eXBlID09PSAncGFnZScpIHJldHVybiAobS51cmwgKyAnICcgKyAobS50aXRsZSA/PyAnJykpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgYnViYmxlJ3MgYm9keS1qc29uIChvciBvdXRlckhUTUwpIGNvbnRhaW5zIHRoZSBzZWFyY2gg4oCUXG4gIC8vIHRlbGxzIHJlbmRlclNlbGVjdG9yIHRvIGF1dG8tZXhwYW5kIHNvIHRoZSB1c2VyIHNlZXMgdGhlIGhpZ2hsaWdodGVkIGhpdC5cbiAgY29uc3QgYm9keU1hdGNoZXNTZWFyY2ggPSAobTogU2VsZWN0b3JNZXNzYWdlKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHEgPSBzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtLmVudHJ5KS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICB9O1xuXG4gIGNvbnN0IGluc2VydFJhaWwgPSAoYmVmb3JlSWQ6IHN0cmluZyk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ2luc2VydC1yYWlsJztcbiAgICBkaXYuZGF0YXNldC5iZWZvcmVJZCA9IGJlZm9yZUlkO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCA9PT0gYmVmb3JlSWQpIHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcpO1xuICAgICAgZGl2LmFwcGVuZChidWlsZElubGluZUNvbW1lbnQoe1xuICAgICAgICBvbkNhbmNlbDogKCkgPT4geyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7IHJlbmRlcigpOyB9LFxuICAgICAgICBvblN1Ym1pdDogKHRleHQpID0+IHNlbmRJbmxpbmUodGV4dCksXG4gICAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBidG4udHlwZSA9ICdidXR0b24nO1xuICAgICAgYnRuLmNsYXNzTmFtZSA9ICdhZGQtYnRuJztcbiAgICAgIGJ0bi5kYXRhc2V0LnRpcCA9ICdJbnNlcnQgY2FwdHVyZSBvciBjb21tZW50IGhlcmUnO1xuICAgICAgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdJbnNlcnQgY2FwdHVyZSBvciBjb21tZW50IGhlcmUnKTtcbiAgICAgIGJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3BsdXMnLCAxMik7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7IGluc2VydEJlZm9yZS5jb21tZW50ID0gdHJ1ZTsgcmVuZGVyKCk7IH0pO1xuICAgICAgZGl2LmFwcGVuZChidG4pO1xuICAgIH1cbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIHR5cGUgSW5saW5lQ29tbWVudE9wdHMgPSB7XG4gICAgaW5pdGlhbD86IHN0cmluZztcbiAgICBvbkNhbmNlbD86ICgpID0+IHZvaWQ7XG4gICAgb25TdWJtaXQ/OiAodGV4dDogc3RyaW5nKSA9PiB2b2lkO1xuICAgIGF1dG9mb2N1cz86IGJvb2xlYW47XG4gIH07XG4gIGNvbnN0IGJ1aWxkSW5saW5lQ29tbWVudCA9ICh7aW5pdGlhbCA9ICcnLCBvbkNhbmNlbCwgb25TdWJtaXQsIGF1dG9mb2N1c306IElubGluZUNvbW1lbnRPcHRzKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLmNsYXNzTmFtZSA9ICdpbmxpbmUtY29tbWVudCc7XG4gICAgY29uc3QgdGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIHRhLnZhbHVlID0gaW5pdGlhbDtcbiAgICB0YS5yb3dzID0gMjtcbiAgICB0YS5wbGFjZWhvbGRlciA9ICdJbnNlcnQgYSBjb21tZW50IGhlcmUsIG9yIEFsdCtDbGljayB0byBpbnNlcnQgYSBjYXB0dXJlJztcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3Jvdyc7XG4gICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBtZXRhLmNsYXNzTmFtZSA9ICdtZXRhJztcbiAgICBtZXRhLnRleHRDb250ZW50ID0gJzB3IMK3IDB0JztcbiAgICAvLyBCb3RoIFNhdmUgLyBDYW5jZWwgYXJlIHVuaWZvcm0gaWNvbiBidXR0b25zICguaWNvbmJ0bikuIFNhdmUgdXNlcyB0aGVcbiAgICAvLyBwcmltYXJ5IGFjY2VudCB2YXJpYW50IHZpYSAucHJpbWFyeSBzbyBpdCBzdGlsbCBwb3BzLCBidXQgaXRzIHdpZHRoXG4gICAgLy8gbWF0Y2hlcyBDYW5jZWwgZXhhY3RseS5cbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0bic7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCDCtyBFc2MnO1xuICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIGlubGluZSBjb21tZW50Jyk7XG4gICAgY2FuY2VsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDIwKTtcbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvbkNhbmNlbD8uKCkpO1xuICAgIGNvbnN0IHNlbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzZW5kLnR5cGUgPSAnYnV0dG9uJztcbiAgICBzZW5kLmNsYXNzTmFtZSA9ICdpY29uYnRuIHByaW1hcnknO1xuICAgIHNlbmQuZGF0YXNldC50aXAgPSAnU2F2ZSDCtyBFbnRlcic7XG4gICAgc2VuZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnU2F2ZSBpbmxpbmUgY29tbWVudCcpO1xuICAgIHNlbmQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGVjaycsIDIwKTtcbiAgICBjb25zdCBzdWJtaXQgPSAoKTogdm9pZCA9PiBvblN1Ym1pdD8uKHRhLnZhbHVlKTtcbiAgICBzZW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3VibWl0KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHsgbWV0YS50ZXh0Q29udGVudCA9IGAke3dvcmRDb3VudCh0YS52YWx1ZSl9dyDCtyAke3Rva2VuQ291bnQodGEudmFsdWUpfXRgOyB9KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXQoKTsgfVxuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgb25DYW5jZWw/LigpO1xuICAgIH0pO1xuICAgIHJvdy5hcHBlbmQobWV0YSwgY2FuY2VsLCBzZW5kKTtcbiAgICB3cmFwLmFwcGVuZCh0YSwgcm93KTtcbiAgICBpZiAoYXV0b2ZvY3VzKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGEuZm9jdXMoKSk7XG4gICAgcmV0dXJuIHdyYXA7XG4gIH07XG5cbiAgY29uc3Qgc2VuZElubGluZSA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB0ZXh0ID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCBiZWZvcmVJZCA9IGluc2VydEJlZm9yZS5jdXJyZW50O1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxldCBwb3MgPSBiZWZvcmVJZCA/IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gYmVmb3JlSWQpIDogbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChwb3MgPCAwKSBwb3MgPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgLy8gcGFyZW50VWlkIHJlc29sdXRpb246IHdhbGsgYmFjayBmcm9tIHRoZSBpbnNlcnQgcG9zaXRpb24gdG8gdGhlXG4gICAgLy8gbmVhcmVzdCBwcmVjZWRpbmcgc2VsZWN0b3IuIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHRoZSBGSy5cbiAgICBsZXQgcElkeCA9IHBvcyAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgLi4uKHBhcmVudFVpZCA/IHtwYXJlbnRVaWR9IDoge30pLFxuICAgIH07XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvcywgMCwgZmIpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0luc2VydGVkJyk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGhhbnRvbSA9ICgpOiB2b2lkID0+IHtcbiAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoJy5waGFudG9tJyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGhhbnRvbVRhcmdldCkgcmV0dXJuO1xuICAgIGNvbnN0IHBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGguY2xhc3NOYW1lID0gJ3BoYW50b20gdmlzaWJsZSc7XG4gICAgcGguaW5uZXJIVE1MID0gYDxjb2RlPiR7ZXNjYXBlSHRtbChwaGFudG9tVGFyZ2V0LmxhYmVsKX08L2NvZGU+YDtcbiAgICBsaXN0LmFwcGVuZChwaCk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgbGlzdC5zY3JvbGxUb3AgPSBsaXN0LnNjcm9sbEhlaWdodDsgfSk7XG4gIH07XG5cbiAgLy8gUmVvcmRlciBhIGZsYXQgbWVzc2FnZSBsaXN0IHNvIHNlbGVjdG9ycyB3aXRoaW4gZWFjaCBwYWdlLWRlbGltaXRlZFxuICAvLyBibG9jayBhcmUgc29ydGVkIGJ5IHRoZWlyIHZpc3VhbCByZWN0ICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkuXG4gIC8vIEZlZWRiYWNrIHJvd3Mgc3RheSBhdHRhY2hlZCB0byB0aGVpciBwcmVjZWRpbmcgc2VsZWN0b3IgKGNhcHR1cmVcbiAgLy8gYWRqYWNlbmN5KSBzbyBlZGl0aW5nL3RocmVhZGluZyBiZWhhdmlvciBzdXJ2aXZlcyB0aGUgc29ydC5cbiAgLy9cbiAgLy8gVXNlZCBPTkxZIGJ5IHRoZSBleHBvcnQgcGlwZWxpbmUgKGBidWlsZFNsaW1gKSwgbm90IHRoZSBzaWRlYmFyXG4gIC8vIHJlbmRlci4gVGhlIHNpZGViYXIga2VlcHMgbWVzc2FnZXMgaW4gaW5zZXJ0aW9uL2NhcHR1cmUgb3JkZXIgc29cbiAgLy8gdGhlIHVzZXIgc2VlcyB0aGVtIHdoZXJlIHRoZXkgZXhwZWN0OyB0aGUgZXhwb3J0IGdldHMgdGhlIGFnZW50LVxuICAvLyBmcmllbmRseSByZWFkaW5nLW9yZGVyIHRyZWF0bWVudC5cbiAgY29uc3QgcmVvcmRlckZvckV4cG9ydCA9IChtc2dzOiBQYW5lbE1lc3NhZ2VbXSk6IFBhbmVsTWVzc2FnZVtdID0+IHtcbiAgICB0eXBlIEdyb3VwID0ge2tpbmQ6ICdncm91cCc7IHNlbDogU2VsZWN0b3JNZXNzYWdlOyB0cmFpbGluZzogRmVlZGJhY2tNZXNzYWdlW119O1xuICAgIHR5cGUgTG9vc2UgPSB7a2luZDogJ2xvb3NlJzsgbTogRmVlZGJhY2tNZXNzYWdlfTtcbiAgICB0eXBlIFNsb3QgPSBHcm91cCB8IExvb3NlIHwge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9O1xuICAgIGNvbnN0IHNsb3RzOiBTbG90W10gPSBbXTtcbiAgICBsZXQgY3VyR3JvdXA6IEdyb3VwIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgZmx1c2hHcm91cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmIChjdXJHcm91cCkgeyBzbG90cy5wdXNoKGN1ckdyb3VwKTsgY3VyR3JvdXAgPSBudWxsOyB9XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbXNncykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgc2xvdHMucHVzaCh7a2luZDogJ3BhZ2UnLCBtfSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIGN1ckdyb3VwID0ge2tpbmQ6ICdncm91cCcsIHNlbDogbSwgdHJhaWxpbmc6IFtdfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERldGFjaGVkIGNvbW1lbnRzIG5ldmVyIHRyYXZlbCB3aXRoIHRoZSBwcmVjZWRpbmcgc2VsZWN0b3Inc1xuICAgICAgICAvLyBncm91cCDigJQgdGhleSBzdGF5IGxvb3NlIGluIGV4cG9ydCBvcmRlci5cbiAgICAgICAgaWYgKGN1ckdyb3VwICYmICFtLmRldGFjaGVkKSBjdXJHcm91cC50cmFpbGluZy5wdXNoKG0pO1xuICAgICAgICBlbHNlIHNsb3RzLnB1c2goe2tpbmQ6ICdsb29zZScsIG19KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hHcm91cCgpO1xuICAgIGNvbnN0IG91dDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBsZXQgcnVuU3RhcnQgPSAwO1xuICAgIGNvbnN0IGZsdXNoUnVuID0gKGVuZDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXBSZWN0czogQXJyYXk8e2lkeDogbnVtYmVyOyB5OiBudW1iZXI7IHg6IG51bWJlcn0+ID0gW107XG4gICAgICBmb3IgKGxldCBpID0gcnVuU3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgciA9IHMuc2VsLmVudHJ5LnJlY3Q7XG4gICAgICAgICAgZ3JvdXBSZWN0cy5wdXNoKHtpZHg6IGksIHk6IHI/LnkgPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCB4OiByPy54ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWX0pO1xuICAgICAgICB9XG4gICAgICAgIGluZGljZXMucHVzaChpKTtcbiAgICAgIH1cbiAgICAgIGdyb3VwUmVjdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS55ICE9PSBiLnkpIHJldHVybiBhLnkgLSBiLnk7XG4gICAgICAgIHJldHVybiBhLnggLSBiLng7XG4gICAgICB9KTtcbiAgICAgIGxldCBnaSA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRJZHggPSBncm91cFJlY3RzW2dpKytdIS5pZHg7XG4gICAgICAgICAgY29uc3QgciA9IHNsb3RzW3JlcGxhY2VtZW50SWR4XSEgYXMgR3JvdXA7XG4gICAgICAgICAgb3V0LnB1c2goci5zZWwpO1xuICAgICAgICAgIGZvciAoY29uc3QgZiBvZiByLnRyYWlsaW5nKSBvdXQucHVzaChmKTtcbiAgICAgICAgfSBlbHNlIGlmIChzLmtpbmQgPT09ICdsb29zZScpIHtcbiAgICAgICAgICBvdXQucHVzaChzLm0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2xvdHNbaV0hLmtpbmQgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaFJ1bihpKTtcbiAgICAgICAgb3V0LnB1c2goKHNsb3RzW2ldIGFzIHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfSkubSk7XG4gICAgICAgIHJ1blN0YXJ0ID0gaSArIDE7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoUnVuKHNsb3RzLmxlbmd0aCk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBjb25zdCByZW5kZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc3RpY2tUb0JvdHRvbSA9IGxpc3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwIHx8IHdhc05lYXJCb3R0b20oKTtcbiAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgLy8gU3RhdHMgbnVtYmVyc1xuICAgIGxldCB0b3RhbFNlbGVjdG9ycyA9IDA7XG4gICAgbGV0IHRvdGFsQ29tbWVudHMgPSAwO1xuICAgIGxldCB0b3RhbFN0YWxlID0gMDtcbiAgICBjb25zdCBkaXN0aW5jdFBhZ2VzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIHRvdGFsU2VsZWN0b3JzKys7XG4gICAgICAgIGlmIChzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKSA9PT0gZmFsc2UpIHRvdGFsU3RhbGUrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB0b3RhbENvbW1lbnRzKys7XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBpZiAobWVzc2FnZXMuc29tZSgoeCkgPT4geC50eXBlID09PSAnc2VsZWN0b3InICYmIHguZW50cnkudXJsID09PSBtLnVybCkpIGRpc3RpbmN0UGFnZXMuYWRkKG0udXJsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInNlbGVjdG9yc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTZWxlY3RvcnMpO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJjb21tZW50c1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxDb21tZW50cyk7XG4gICAgY29uc3Qgc3RhbGVOdW0gPSBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic3RhbGVcIl0gLnN0YXQtbnVtJykhO1xuICAgIHN0YWxlTnVtLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU3RhbGUpO1xuICAgIHN0YWxlTnVtLmRhdGFzZXQuemVybyA9IHRvdGFsU3RhbGUgPT09IDAgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJwYWdlc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcoZGlzdGluY3RQYWdlcy5zaXplKTtcbiAgICBjb25zdCBleHBvcnRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIHN0YXRUb2tlbnMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHRva2VuQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuICAgIHN0YXRXb3Jkcy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcod29yZENvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcblxuICAgIC8vIE1pbmlmeSByZWR1Y3Rpb24gc3RhdHNcbiAgICBsZXQgZnVsbFQgPSAwLCBjdXJUID0gMCwgZnVsbFcgPSAwLCBjdXJXID0gMCwgcGN0ID0gMDtcbiAgICBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgY29uc3Qgd2FzTWluID0gcHJlZnMubWluaWZ5O1xuICAgICAgcHJlZnMubWluaWZ5ID0gdHJ1ZTsgY29uc3QgbWluVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IGZhbHNlOyBjb25zdCBmdWxsVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHdhc01pbjtcbiAgICAgIGZ1bGxUID0gdG9rZW5Db3VudChmdWxsVGV4dCk7IGN1clQgPSB0b2tlbkNvdW50KG1pblRleHQpO1xuICAgICAgZnVsbFcgPSB3b3JkQ291bnQoZnVsbFRleHQpOyBjdXJXID0gd29yZENvdW50KG1pblRleHQpO1xuICAgICAgcGN0ID0gZnVsbFQgPiAwID8gTWF0aC5yb3VuZCgoMSAtIGN1clQgLyBmdWxsVCkgKiAxMDApIDogMDtcbiAgICB9XG4gICAgY29uc3QgbWluaWZ5U3RhdHNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1taW5pZnktc3RhdHNdJyk7XG4gICAgaWYgKG1pbmlmeVN0YXRzRWwpIHtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYCR7ZnVsbFQudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVC50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtmdWxsVy50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJXLnRvTG9jYWxlU3RyaW5nKCl9IHdvcmRzIMK3ICR7cGN0fSUgcmVkdWN0aW9uYDtcbiAgICAgIH0gZWxzZSBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYFdvdWxkIHNhdmUgJHsoZnVsbFQgLSBjdXJUKS50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtwY3R9JSBpZiBlbmFibGVkYDtcbiAgICAgIH0gZWxzZSBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxuXG4gICAgLy8gUGVyLWNoZWNrYm94IGNvbnRyaWJ1dGlvbiBzdGF0czogaG93IG1hbnkgdG9rZW5zL3dvcmRzIGVhY2ggdG9nZ2xlXG4gICAgLy8gYWRkcyB0byB0aGUgY3VycmVudCBleHBvcnQuIENvbXB1dGVkIGJ5IHRvZ2dsaW5nIHRoYXQgc2luZ2xlIHByZWZcbiAgICAvLyBhbmQgZGlmZmluZyB0aGUgZXhwb3J0IOKAlCBnaXZlcyBhbiBob25lc3QgYW5zd2VyIHRoYXQgcmVmbGVjdHMgdGhlXG4gICAgLy8gY3VycmVudCBtaW5pZnkgc3RhdGUgYW5kIHRoZSByZXN0IG9mIHRoZSB0b2dnbGVzLlxuICAgIGNvbnN0IGNvbnRyaWJLZXlzOiBBcnJheTxrZXlvZiBQcmVmcz4gPSBbJ2luY2x1ZGVPdXRlckhUTUwnLCAnaW5jbHVkZU1hdGNoZWRSdWxlcycsICdpbmNsdWRlU3R5bGVzJ107XG4gICAgaWYgKGV4cG9ydFRleHQgJiYgbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBiYXNlVCA9IHRva2VuQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBjb25zdCBiYXNlVyA9IHdvcmRDb3VudChleHBvcnRUZXh0KTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKCFlbCkgY29udGludWU7XG4gICAgICAgIGNvbnN0IHdhc09uID0gcHJlZnNba2V5XSBhcyBib29sZWFuO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gIXdhc09uO1xuICAgICAgICBjb25zdCBhbHRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFQgPSB0b2tlbkNvdW50KGFsdFRleHQpO1xuICAgICAgICBjb25zdCBhbHRXID0gd29yZENvdW50KGFsdFRleHQpO1xuICAgICAgICAvLyB3YXNPbj10cnVlIOKGkiBjdXJyZW50bHkgaW5jbHVkZWQ7IGNvc3QgPSBiYXNlIC0gYWx0ICh0dXJuaW5nIE9GRiBzYXZlcyB0aGlzKS5cbiAgICAgICAgLy8gd2FzT249ZmFsc2Ug4oaSIGN1cnJlbnRseSBleGNsdWRlZDsgZ2FpbiA9IGFsdCAtIGJhc2UgKHR1cm5pbmcgT04gYWRkcyB0aGlzKS5cbiAgICAgICAgY29uc3QgZFQgPSB3YXNPbiA/IGJhc2VUIC0gYWx0VCA6IGFsdFQgLSBiYXNlVDtcbiAgICAgICAgY29uc3QgZFcgPSB3YXNPbiA/IGJhc2VXIC0gYWx0VyA6IGFsdFcgLSBiYXNlVztcbiAgICAgICAgY29uc3Qgc2lnbiA9IHdhc09uID8gJycgOiAnKyc7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gd2FzT25cbiAgICAgICAgICA/IGDCtyAke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGluIGV4cG9ydCR7cHJlZnMubWluaWZ5ID8gJyAobWluaWZpZWQpJyA6ICcnfWBcbiAgICAgICAgICA6IGDCtyAke3NpZ259JHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7c2lnbn0ke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaWYgZW5hYmxlZGA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsKSBlbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRvb2xiYXIgZXhwb3J0IHN0YXRzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy5zdGF0LmV4cG9ydC1zdGF0cycpLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICAgIGNvbnN0IG51bSA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LW51bScpO1xuICAgICAgY29uc3QgbGFiID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbGFiZWwnKTtcbiAgICAgIGlmIChudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCEucmVwbGFjZSgvXFwqJC8sICcnKTtcbiAgICAgIGlmIChsYWIpIGxhYi50ZXh0Q29udGVudCA9IGxhYi50ZXh0Q29udGVudCEucmVwbGFjZSgvXlxcKi8sICcnKTtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgbnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQgKyAnKic7XG4gICAgICBjb25zdCBpc1Rva2VuID0gaSA9PT0gMDtcbiAgICAgIGNvbnN0IGZ1bGxWID0gaXNUb2tlbiA/IGZ1bGxUIDogZnVsbFc7XG4gICAgICBjb25zdCBjdXJWID0gaXNUb2tlbiA/IGN1clQgOiBjdXJXO1xuICAgICAgY29uc3Qgd2hpY2ggPSBpc1Rva2VuID8gJ3Rva2VucycgOiAnd29yZHMnO1xuICAgICAgcy5kYXRhc2V0LnRpcCA9IHByZWZzLm1pbmlmeVxuICAgICAgICA/IGBNSU5JRklFRCDCtyAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH1cXG5GdWxsIHdvdWxkIGJlICR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWBcbiAgICAgICAgOiBgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofSDCtyBmdWxsIGV4cG9ydFxcbk1pbmlmaWVkIHdvdWxkIGJlICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYDtcbiAgICB9KTtcblxuICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJlbXB0eS1pY29uXCI+8J+kjzwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktdGl0bGVcIj5TdGFydCB3aXRoIHRoZSBwYWdlIHlvdSB3YW50IHRvIGNyaXRpcXVlLjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktYm9keVwiPk9wZW4gYSBwYWdlLCB0aGVuIGNhcHR1cmUgYW4gZWxlbWVudC4gQ29tbWVudHMgc3RheSBwYWlyZWQgd2l0aCB0aGUgdGhpbmcgeW91IGdyYWJiZWQuPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1rZXlzXCI+QWx0K0NsaWNrIHRvIGNhcHR1cmU8L2Rpdj5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RvclVybHMgPSBuZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnVybCkpO1xuICAgIGNvbnN0IHZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlICE9PSAncGFnZScgfHwgc2VsZWN0b3JVcmxzLmhhcyhtLnVybCkpO1xuICAgIGNvbnN0IHBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgQm9vbGVhbihtLnBpbm5lZCkpO1xuICAgIGNvbnN0IHVucGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSkgPT4gIXBpbm5lZC5pbmNsdWRlcyhtIGFzIFNlbGVjdG9yTWVzc2FnZSkpO1xuICAgIC8vIFNpZGViYXIgc2hvd3MgY2FwdHVyZXMgaW4gSU5TRVJUSU9OIG9yZGVyIChtb3N0IHJlY2VudCBhdCB0aGVcbiAgICAvLyBib3R0b20pLiBWaXN1YWwtcG9zaXRpb24gcmVvcmRlcmluZyBoYXBwZW5zIE9OTFkgYXQgZXhwb3J0IHRpbWVcbiAgICAvLyBzbyB0aGUgc2lkZWJhciBzdGF5cyBwcmVkaWN0YWJsZSB3aGlsZSB0aGUgYWdlbnQtZmFjaW5nIGV4cG9ydFxuICAgIC8vIGdldHMgcmVhZGluZy1vcmRlciBjb252ZW5pZW5jZS4gKFByaW9yIGltcGxlbWVudGF0aW9uIHNvcnRlZCBpblxuICAgIC8vIGJvdGggcGxhY2VzOyB1c2VyIGZlZWRiYWNrIHdhcyB0aGF0IHNpZGViYXIgc2h1ZmZsaW5nIHdhc1xuICAgIC8vIGRpc29yaWVudGluZy4pXG4gICAgY29uc3Qgb3JkZXJlZCA9IFsuLi5waW5uZWQsIC4uLnVucGlubmVkXTtcblxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwobWVzc2FnZXNbMF0hLmlkKSk7XG4gICAgbGV0IGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gVHJhY2sgdGhlIFVSTCBvZiB0aGUgbW9zdCByZWNlbnRseSByZW5kZXJlZCBwYWdlIGRpdmlkZXIgc28gd2UgY2FuXG4gICAgLy8gc3VwcHJlc3MgYSByZXBlYXRlZCBoZWFkZXIgd2hlbiBjb25zZWN1dGl2ZSBjYXB0dXJlcyBzaGFyZSB0aGUgc2FtZVxuICAgIC8vIHBhZ2UuIFJlc3RhdGluZyB0aGUgVVJMIGFib3ZlIGV2ZXJ5IGNhcHR1cmUgaW4gYSBzYW1lLVVSTCBydW4gaXNcbiAgICAvLyBub2lzZSDigJQgdGhlIGRpdmlkZXIgb25seSBlYXJucyBpdHMgc3BhY2Ugd2hlbiB0aGUgVVJMIGFjdHVhbGx5XG4gICAgLy8gY2hhbmdlcyBmcm9tIHRoZSBwcmV2aW91cyBjYXB0dXJlIGluIHNlcXVlbmNlLlxuICAgIGxldCBsYXN0UmVuZGVyZWRQYWdlVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmVuZGVyZWRBbnkgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZGVyZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSBvcmRlcmVkW2ldITtcbiAgICAgIGlmICghbWF0Y2hlc1NlYXJjaChtKSkgY29udGludWU7XG4gICAgICAvLyBDb2xsYXBzZSBjb25zZWN1dGl2ZSBzYW1lLVVSTCBwYWdlIGRpdmlkZXJzIGludG8gdGhlIGZpcnN0IG9uZS5cbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBpZiAobS51cmwgPT09IGxhc3RSZW5kZXJlZFBhZ2VVcmwpIGNvbnRpbnVlO1xuICAgICAgICBsYXN0UmVuZGVyZWRQYWdlVXJsID0gbS51cmw7XG4gICAgICB9XG4gICAgICAvLyBEZXRhY2hlZCBjb21tZW50cyByZW5kZXIgdW50aHJlYWRlZCDigJQgYWRqYWNlbmN5IG11c3Qgbm90IHJlLWFkb3B0XG4gICAgICAvLyBhIGNvbW1lbnQgdGhlIHVzZXIgZXhwbGljaXRseSBkaXNhc3NvY2lhdGVkLlxuICAgICAgY29uc3QgYWRqYWNlbmN5ID0gbS50eXBlID09PSAnZmVlZGJhY2snICYmIG0uZGV0YWNoZWQgPyBudWxsIDogbGFzdFNlbGVjdG9yU2VsO1xuICAgICAgY29uc3Qgbm9kZSA9IHJlbmRlck1lc3NhZ2UobSwgYWRqYWNlbmN5KTtcbiAgICAgIGxpc3QuYXBwZW5kKG5vZGUpO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgbGFzdFNlbGVjdG9yU2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGlmIChpIDwgb3JkZXJlZC5sZW5ndGggLSAxKSBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG9yZGVyZWRbaSArIDFdIS5pZCkpO1xuICAgICAgcmVuZGVyZWRBbnkgPSB0cnVlO1xuICAgIH1cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKCdfX2VuZF9fJykpO1xuICAgIGlmICghcmVuZGVyZWRBbnkgJiYgc2VhcmNoUXVlcnkpIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSBgTm8gbWF0Y2hlcyBmb3IgXCIke3NlYXJjaFF1ZXJ5fVwiLmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgfVxuXG4gICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgcmVuZGVyUGhhbnRvbSgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhd05vb2RsZXMpO1xuICAgIGlmIChzdGlja1RvQm90dG9tKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQZW5kaW5nQmF5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBlbmRpbmctYmF5Jyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJheS5jbGFzc05hbWUgPSAncGVuZGluZy1iYXknO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgUGVuZGluZyBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9IGVsZW1lbnQke3BlbmRpbmdNdWx0aS5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gO1xuICAgIGJheS5hcHBlbmQoaGVhZCk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNhcmQuY2xhc3NOYW1lID0gJ3BlbmRpbmctY2FyZCc7XG4gICAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7aSArIDF9YDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSAoZS50ZXh0ICYmIGUudGV4dC5sZW5ndGggPD0gNjAgPyBlLnRleHQgOiAoZS5jb21wb25lbnRSb290ID8/IGUuc2VsZWN0b3IgPz8gZS50YWcpKTtcbiAgICAgIGNhcmQuYXBwZW5kKHNlcSwgbGFiZWwpO1xuICAgICAgYmF5LmFwcGVuZChjYXJkKTtcbiAgICB9KTtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3BlbmRpbmctcm93JztcbiAgICBjb25zdCBjb21taXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb21taXQudHlwZSA9ICdidXR0b24nO1xuICAgIGNvbW1pdC5jbGFzc05hbWUgPSAncHJpbWFyeSBwZW5kaW5nLWNvbW1pdCc7XG4gICAgY29tbWl0LnRleHRDb250ZW50ID0gYENvbW1pdCBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9YDtcbiAgICBjb21taXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY29tbWl0J30pKTtcbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwZW5kaW5nLWNhbmNlbCc7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJztcbiAgICBjYW5jZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJyk7XG4gICAgY2FuY2VsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDEzKTtcbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY2FuY2VsJ30pKTtcbiAgICByb3cuYXBwZW5kKGNvbW1pdCwgY2FuY2VsKTtcbiAgICBiYXkuYXBwZW5kKHJvdyk7XG4gICAgY29uc3QgaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhpbnQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGludCc7XG4gICAgaGludC50ZXh0Q29udGVudCA9ICdBbHQrU2hpZnQrQ2xpY2sgbW9yZSDCtyBDb21taXQgdG8gZmluYWxpemUgwrcgRXNjIHRvIGNhbmNlbCc7XG4gICAgYmF5LmFwcGVuZChoaW50KTtcbiAgICBsaXN0LmFwcGVuZChiYXkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBOb29kbGVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBjbGVhck5vb2RsZXMgPSAoKTogdm9pZCA9PiB7IGZvciAoY29uc3QgbiBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmVlLW5vb2RsZScpKSBuLnJlbW92ZSgpOyB9O1xuXG4gIC8vIENyb3NzLXNlYW0gcGFuZWzihpRjYW52YXMgbm9vZGxlcyB3ZXJlIHJlbW92ZWQ6IGFsaWduaW5nIHR3byBTVkcgaGFsdmVzXG4gIC8vIGFjcm9zcyB0aGUgcGFuZWwvcGFnZSBib3VuZGFyeSBkZXBlbmRlZCBvbiBpbm5lckhlaWdodCBwYXJpdHkgd2hpY2hcbiAgLy8gYnJlYWtzIHVuZGVyIERldlRvb2xzIGRvY2sgYW5kIHpvb20sIGFuZCB0aGUgdmlzdWFsIGJlbmVmaXQgZGlkbid0XG4gIC8vIGp1c3RpZnkgdGhlIG1haW50ZW5hbmNlIGNvc3QuIFRoZSBpbi1wYW5lbCBmZWVkYmFjay10cmVlIG5vb2RsZXNcbiAgLy8gKGRyYXdOb29kbGUgLyByZWRyYXdOb29kbGVzIGJlbG93KSBhcmUgdW5hZmZlY3RlZC5cbiAgY29uc3QgY2xlYXJCdWJibGVOb29kbGUgPSAoKTogdm9pZCA9PiB7IC8qIG5vLW9wICovIH07XG4gIGNvbnN0IHJlZHJhd05vb2RsZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJOb29kbGVzKCk7XG4gICAgbGV0IGxhc3RTZWxlY3RvckVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBbLi4ubGlzdC5jaGlsZHJlbl0gYXMgSFRNTEVsZW1lbnRbXSkge1xuICAgICAgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtc2cnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0b3InKSkgbGFzdFNlbGVjdG9yRWwgPSBub2RlO1xuICAgICAgLy8gT25seSBUSFJFQURFRCBjb21tZW50cyBnZXQgYSBjb25uZWN0b3Ig4oCUIGEgZGV0YWNoZWQgY29tbWVudCBtdXN0XG4gICAgICAvLyBsb3NlIGl0cyBub29kbGUsIG5vdCBqdXN0IGl0cyBpbmRlbnQgKHRoZSB2aXNpYmxlIFwiZGlzY29ubmVjdFwiKS5cbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtc2cnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZmVlZGJhY2snKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygndGhyZWFkZWQnKSAmJiBsYXN0U2VsZWN0b3JFbCkgZHJhd05vb2RsZShsYXN0U2VsZWN0b3JFbCwgbm9kZSk7XG4gICAgICBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LXJhaWwnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZXhwYW5kZWQnKSAmJiBsYXN0U2VsZWN0b3JFbCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBub2RlLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuaW5saW5lLWNvbW1lbnQnKSA/PyBub2RlO1xuICAgICAgICBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCB0YXJnZXQpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1kaXZpZGVyJykgfHwgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2dyb3VwLWhlYWQnKSkge1xuICAgICAgICBsYXN0U2VsZWN0b3JFbCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBkcmF3Tm9vZGxlID0gKHNlbGVjdG9yRWw6IEhUTUxFbGVtZW50LCBmZWVkYmFja0VsOiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNSID0gc2VsZWN0b3JFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBmUiA9IGZlZWRiYWNrRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbFIgPSBsaXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHgxID0gc1IubGVmdCAtIGxSLmxlZnQgKyAxMjtcbiAgICBjb25zdCB5MSA9IHNSLmJvdHRvbSAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wO1xuICAgIGNvbnN0IHgyID0gZlIubGVmdCAtIGxSLmxlZnQ7XG4gICAgY29uc3QgeTIgPSBmUi50b3AgLSBsUi50b3AgKyBsaXN0LnNjcm9sbFRvcCArIDE0O1xuICAgIGNvbnN0IHcgPSBNYXRoLm1heCgyMCwgeDIgLSB4MSArIDQpO1xuICAgIGNvbnN0IGggPSBNYXRoLm1heCgyMCwgeTIgLSB5MSk7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0cmVlLW5vb2RsZScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgU3RyaW5nKHcpKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBTdHJpbmcoaCkpO1xuICAgIHN2Zy5zdHlsZS5sZWZ0ID0gYCR7eDEgLSAyfXB4YDtcbiAgICBzdmcuc3R5bGUudG9wID0gYCR7eTF9cHhgO1xuICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICBjb25zdCBzeCA9IDIsIHN5ID0gMCwgZXggPSB3IC0gMiwgZXkgPSBoO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgYE0gJHtzeH0gJHtzeX0gQyAke3N4fSAke3N5ICsgaCAqIDAuNTV9LCAke2V4IC0gdyAqIDAuNH0gJHtleX0sICR7ZXh9ICR7ZXl9YCk7XG4gICAgc3ZnLmFwcGVuZChwYXRoKTtcbiAgICBsaXN0LmFwcGVuZChzdmcpO1xuICB9O1xuICBsZXQgc2Nyb2xsUmFmID0gMDtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgaWYgKHNjcm9sbFJhZikgcmV0dXJuO1xuICAgIHNjcm9sbFJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IHNjcm9sbFJhZiA9IDA7IHJlZHJhd05vb2RsZXMoKTsgfSk7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVkcmF3Tm9vZGxlcyk7XG5cbiAgLy8g4pSA4pSA4pSAIFBlci1tZXNzYWdlIHJlbmRlcmVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgcmVuZGVyTWVzc2FnZSA9IChtOiBQYW5lbE1lc3NhZ2UsIGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBpZiAobS50eXBlID09PSAncGFnZScpIHJldHVybiByZW5kZXJQYWdlKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHJldHVybiByZW5kZXJTZWxlY3RvcihtKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gcmVuZGVyRmVlZGJhY2sobSwgbGFzdFNlbGVjdG9yU2VsKTtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGFnZSA9IChtOiBQYWdlTWVzc2FnZSk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZC5jbGFzc05hbWUgPSAncGFnZS1kaXZpZGVyJztcbiAgICBkLmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGNvbnN0IHRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRzLmNsYXNzTmFtZSA9ICd0YWItc3RhdHVzJztcbiAgICB0cy5kYXRhc2V0LnVybCA9IG0udXJsO1xuICAgIGlmIChtLnVybCA9PT0gbGl2ZVRhYlVybCkgdHMuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuICAgIGQuYXBwZW5kKHRzKTtcbiAgICBjb25zdCB1ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHUuY2xhc3NOYW1lID0gJ3VybCc7XG4gICAgdS50ZXh0Q29udGVudCA9IG0udXJsO1xuICAgIHUuZGF0YXNldC50aXAgPSBgJHttLnRpdGxlID8/ICcnfSDCtyAke20udXJsfWA7XG4gICAgZC5hcHBlbmQodSk7XG4gICAgZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIElmIHdlJ3JlIGFscmVhZHkgb24gdGhpcyBwYWdlIGluIHRoZSBhY3RpdmUgdGFiLCBjbGlja2luZyB0aGUgVVJMXG4gICAgICAvLyBzaG91bGRuJ3QgcmVsb2FkIG9yIHN0ZWFsIGZvY3VzIOKAlCBpdCBzaG91bGQganVzdCBiZSBhIG5vLW9wXG4gICAgICAvLyB2aXN1YWxseSAodGhlIHJvdyBhbHJlYWR5IGluZGljYXRlcyBcIm9wZW5cIiB2aWEgLnRhYi1zdGF0dXMpLiBUaGVcbiAgICAgIC8vIHVzZXIgY29tcGxhaW5lZCBhYm91dCBnZXR0aW5nIGZvcmNlZCBpbnRvIGEgbmF2aWdhdGlvbiB3aGVuIHRoZXlcbiAgICAgIC8vIHdlcmUganVzdCB0cnlpbmcgdG8gcmVhZCB0aGUgcm93LlxuICAgICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB7XG4gICAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBvbiB0aGlzIHBhZ2UnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBzZW5kVG9CZzx7Zm91bmQ/OiBib29sZWFuOyBvcGVuZWQ/OiBudW1iZXI7IGVycm9yPzogc3RyaW5nfT4oe2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJywgdXJsOiBtLnVybCwgb3BlbklmTWlzc2luZzogdHJ1ZX0pO1xuICAgICAgaWYgKHI/LmZvdW5kKSBzZXRTdGF0dXMoJ1N3aXRjaGVkIHRvIHRhYicpO1xuICAgICAgZWxzZSBpZiAocj8ub3BlbmVkKSBzZXRTdGF0dXMoJ09wZW5lZCBpbiBuZXcgdGFiJyk7XG4gICAgICBlbHNlIHNldFN0YXR1cyhcIkNvdWxkbid0IG9wZW4gdGFiXCIsIHtraW5kOiAnd2Fybid9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZDtcbiAgfTtcblxuICBjb25zdCB0aXRsZUZyb21FbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGVzdElkKSByZXR1cm4gYFt0ZXN0SWQ9JHtlLnRlc3RJZH1dYDtcbiAgICBpZiAoZS5pZCkgcmV0dXJuIGAjJHtlLmlkfWA7XG4gICAgaWYgKGUuY2xhc3Nlcz8ubGVuZ3RoKSByZXR1cm4gYCR7ZS50YWd9LiR7ZS5jbGFzc2VzLnNsaWNlKDAsIDIpLmpvaW4oJy4nKX1gO1xuICAgIHJldHVybiBlLnNlbGVjdG9yIHx8IGUudGFnIHx8ICcodW5rbm93biknO1xuICB9O1xuXG4gIC8vIFBpY2sgdGhlIG1vc3QgXCJodW1hbmx5IHJlYWRhYmxlXCIgbGFiZWwgZm9yIHRoZSBidWJibGUgcHJldmlldy4gUHJlZmVyc1xuICAvLyB2aXNpYmxlLXRvLXVzZXIgdGV4dCBpbiB0aGlzIHByaW9yaXR5OlxuICAvLyAgIDEuIGlubmVyVGV4dCAvIHRleHRDb250ZW50IChgZW50cnkudGV4dGApIOKAlCB3aGF0IHRoZSB1c2VyIHJlYWRzIG9uIHNjcmVlblxuICAvLyAgIDIuIGFjY2Vzc2libGVOYW1lIChhcmlhLWxhYmVsIC8gdGl0bGUgLyBhbHQgZmFsbGJhY2sgY2hhaW4pXG4gIC8vICAgMy4gaW5wdXQgdmFsdWUgKHNraXBwZWQgaWYgaXQncyB0aGUgbWFza2VkIHBhc3N3b3JkIHBsYWNlaG9sZGVyKVxuICAvLyAgIDQuIGlucHV0IHBsYWNlaG9sZGVyXG4gIC8vICAgNS4gaW1nIGFsdFxuICAvLyAgIDYuIGNvbXBvbmVudFJvb3QgKGUuZy4gXCJidXR0b24jY3RhXCIpXG4gIC8vICAgNy4gdGl0bGVGcm9tRW50cnkg4oCUIGxhc3QtcmVzb3J0IHRhZy9jbGFzcy9pZCBmYWxsYmFja1xuICAvLyBDU1MgaGFuZGxlcyB2aXN1YWwgdHJ1bmNhdGlvbiB2aWEgdGV4dC1vdmVyZmxvdzplbGxpcHNpczsgd2Ugc2hpcCB0aGVcbiAgLy8gZnVsbCBzdHJpbmcgc28gdGhlIHRvb2x0aXAgb24gaG92ZXIgY2FuIHNob3cgdGhlIGNvbXBsZXRlIHZhbHVlLlxuICBjb25zdCBuaWNlTGFiZWwgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChlLnRleHQpIHJldHVybiBlLnRleHQ7XG4gICAgaWYgKGUuYWNjZXNzaWJsZU5hbWUpIHJldHVybiBlLmFjY2Vzc2libGVOYW1lO1xuICAgIGNvbnN0IHYgPSBlLmF0dHJzPy52YWx1ZTtcbiAgICBpZiAodiAmJiB2ICE9PSAn4oCi4oCi4oCi4oCiJykgcmV0dXJuIHY7XG4gICAgaWYgKGUuYXR0cnM/LnBsYWNlaG9sZGVyKSByZXR1cm4gZS5hdHRycy5wbGFjZWhvbGRlcjtcbiAgICBpZiAoZS5hdHRycz8uYWx0KSByZXR1cm4gZS5hdHRycy5hbHQ7XG4gICAgaWYgKGUuY29tcG9uZW50Um9vdCkgcmV0dXJuIGUuY29tcG9uZW50Um9vdDtcbiAgICByZXR1cm4gdGl0bGVGcm9tRW50cnkoZSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyU2VsZWN0b3IgPSAobTogU2VsZWN0b3JNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHZhbGlkID0gc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3Qgc2FtZVBhdGggPSBwYXRoT2YobS5lbnRyeS51cmwgPz8gJycpID09PSBsaXZlVGFiUGF0aDtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ21zZyBzZWxlY3Rvcic7XG4gICAgaWYgKHZhbGlkID09PSBmYWxzZSAmJiBzYW1lUGF0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3N0YWxlJyk7XG4gICAgZWxzZSBpZiAodmFsaWQgPT09IGZhbHNlICYmICFzYW1lUGF0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2RpZmYtcGFnZScpO1xuICAgIGlmIChtLnBpbm5lZCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3Bpbm5lZCcpO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdoYXMtZ3JvdXAnKTtcbiAgICBpZiAobS5lbnRyeS5zZWxlY3RvciA9PT0gbGFzdEFjdGl2ZVNlbGVjdG9yKSBkaXYuY2xhc3NMaXN0LmFkZCgnbGFzdC1hY3RpdmUnKTtcbiAgICAvLyBBdXRvLWV4cGFuZCBvbiBzZWFyY2ggaGl0IHNvIHRoZSB1c2VyIHNlZXMgd2hlcmUgdGhlIG1hdGNoIGxhbmRlZC5cbiAgICBjb25zdCBtYXRjaGVkQm9keSA9IGJvZHlNYXRjaGVzU2VhcmNoKG0pO1xuICAgIGlmIChtYXRjaGVkQm9keSkgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJywgJ3NlYXJjaC1oaXQnKTtcbiAgICBkaXYuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgZGl2LmRhdGFzZXQuc2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgIC8vIERyYWctdG8tcmVwYXJlbnQ6IGV2ZXJ5IHNlbGVjdG9yIGJ1YmJsZSBpcyBhIHZhbGlkIGRyb3AgdGFyZ2V0IGZvclxuICAgIC8vIGEgY29tbWVudCBiZWluZyBkcmFnZ2VkIGZyb20gZWxzZXdoZXJlIGluIHRoZSBzaWRlYmFyLlxuICAgIHdpcmVTZWxlY3RvckRyb3BUYXJnZXQoZGl2LCBtKTtcblxuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdoZWFkJztcbiAgICBjb25zdCBjYXJldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjYXJldC5jbGFzc05hbWUgPSAnY2FyZXQnO1xuICAgIGNhcmV0LmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hldnJvbi1yaWdodCcsIDEyKTtcbiAgICBoZWFkLmFwcGVuZChjYXJldCk7XG4gICAgY29uc3QgcGluTWFya2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHBpbk1hcmtlci5jbGFzc05hbWUgPSAncGluLW1hcmtlcic7XG4gICAgcGluTWFya2VyLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnc3Rhci1maWxsZWQnLCAxMSk7XG4gICAgaGVhZC5hcHBlbmQocGluTWFya2VyKTtcbiAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc2VxLmNsYXNzTmFtZSA9ICdzZXEnO1xuICAgIHNlcS50ZXh0Q29udGVudCA9IGAjJHttLmVudHJ5Lm59YDtcbiAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBzZXEudGV4dENvbnRlbnQgKz0gYCske20uZW50cnkuZ3JvdXAubGVuZ3RofWA7XG4gICAgaGVhZC5hcHBlbmQoc2VxKTtcbiAgICBjb25zdCBjb21wYWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbXBhY3QuY2xhc3NOYW1lID0gJ2NvbXBhY3QnO1xuICAgIGNvbnN0IGNvbXBhY3RTdHIgPSBuaWNlTGFiZWwobS5lbnRyeSk7XG4gICAgY29tcGFjdC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChjb21wYWN0U3RyLCBzZWFyY2hRdWVyeSk7XG4gICAgLy8gU2hvdyB0aGUgZnVsbCBsYWJlbCBvbiBob3ZlciBldmVuIHdoZW4gQ1NTIGVsbGlwc2lzIHRydW5jYXRlcyB0aGVcbiAgICAvLyB2aXNpYmxlIHBvcnRpb24g4oCUIHVzZWZ1bCB3aGVuIHRoZSB2aXNpYmxlIHRleHQvcGxhY2Vob2xkZXIgaXMgbG9uZy5cbiAgICBpZiAoY29tcGFjdFN0ci5sZW5ndGggPiAyNCkgY29tcGFjdC5kYXRhc2V0LnRpcCA9IGNvbXBhY3RTdHI7XG4gICAgaGVhZC5hcHBlbmQoY29tcGFjdCk7XG4gICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBtZXRhLmNsYXNzTmFtZSA9ICdtZXRhJztcbiAgICBjb25zdCByID0gbS5lbnRyeS5yZWN0O1xuICAgIG1ldGEudGV4dENvbnRlbnQgPSByID8gYCR7ci53fcOXJHtyLmh9YCA6IChtLmVudHJ5LnRhZyA/PyAnJyk7XG4gICAgaGVhZC5hcHBlbmQobWV0YSk7XG4gICAgZGl2LmFwcGVuZChoZWFkKTtcblxuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc3VtbWFyeS5jbGFzc05hbWUgPSAncGVlay1zdW1tYXJ5JztcbiAgICBzdW1tYXJ5LmlubmVySFRNTCA9IGA8c3BhbiBkYXRhLWljb249XCJhbGVydC1jaXJjbGVcIiBkYXRhLXNpemU9XCIxMVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidFwiPiR7ZGl2LmNsYXNzTGlzdC5jb250YWlucygnZGlmZi1wYWdlJykgPyAnZGlmZmVyZW50IHBhZ2UnIDogJ3N0YWxlJ308L3NwYW4+YDtcbiAgICBoZWFkLmFwcGVuZChzdW1tYXJ5KTtcbiAgICBtb3VudEljb25zKHN1bW1hcnkpO1xuXG4gICAgY29uc3QgZXJyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZXJyLmNsYXNzTmFtZSA9ICdwZWVrLWVycm9yJztcbiAgICBjb25zdCByZWFzb24gPSBzZWxlY3RvckVycm9ycy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3QgcGF0aEZyb21FbnRyeSA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJyk7XG4gICAgZXJyLmlubmVySFRNTCA9IHNhbWVQYXRoXG4gICAgICA/IGA8Yj5TdGFsZTwvYj4gwrcgJHtlc2NhcGVIdG1sKHJlYXNvbiA/PyAnbm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMuJyl9PGJyPjxjb2RlPiR7ZXNjYXBlSHRtbChtLmVudHJ5LnNlbGVjdG9yKX08L2NvZGU+YFxuICAgICAgOiBgQ2FwdHVyZWQgb24gPGNvZGU+JHtlc2NhcGVIdG1sKHBhdGhGcm9tRW50cnkpfTwvY29kZT4g4oCUIGN1cnJlbnQgdGFiIGlzIDxjb2RlPiR7ZXNjYXBlSHRtbChsaXZlVGFiUGF0aCA/PyAnJyl9PC9jb2RlPi4gU3dpdGNoIHRhYnMgdG8gdmFsaWRhdGUuPGJyPjxjb2RlPiR7ZXNjYXBlSHRtbChtLmVudHJ5LnNlbGVjdG9yKX08L2NvZGU+YDtcbiAgICBkaXYuYXBwZW5kKGVycik7XG5cbiAgICAvLyBBbmNlc3RvciBicmVhZGNydW1iIOKAlCBQbGFzbWljLXN0eWxlIGVzY2FsYXRvci4gQ2hpcHMgZm9yIGVhY2ggZW50cnkgaW5cbiAgICAvLyBlbnRyeS5hbmNlc3RvcnMgKGNsb3Nlc3QgZmlyc3QpLiBDbGljayBhIGNoaXAgdG8gY2FwdHVyZSB0aGF0XG4gICAgLy8gYW5jZXN0b3Igb24gdGhlIGxpdmUgcGFnZSAoZGVwdGggPSBjaGlwIGluZGV4ICsgMSBzaW5jZSB0aGUgZW50cnknc1xuICAgIC8vIG93biBzZWxlY3RvciBpcyBkZXB0aCAwKS4gQnJpZ2h0bmVzcyBncmFkaWVudCBkYXJrZW5zIGRlZXBlciBjaGlwcy5cbiAgICBpZiAobS5lbnRyeS5hbmNlc3RvcnM/Lmxlbmd0aCkge1xuICAgICAgY29uc3QgY3J1bWJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjcnVtYnMuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNydW1icyc7XG4gICAgICBjcnVtYnMuZGF0YXNldC50aXAgPSAnQ2xpY2sgYSBjcnVtYiB0byBlc2NhbGF0ZSB0aGUgY2FwdHVyZSB0byBhbiBhbmNlc3RvciBlbGVtZW50JztcbiAgICAgIG0uZW50cnkuYW5jZXN0b3JzLmZvckVhY2goKGFuYywgaSkgPT4ge1xuICAgICAgICBjb25zdCBjaGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGNoaXAudHlwZSA9ICdidXR0b24nO1xuICAgICAgICBjaGlwLmNsYXNzTmFtZSA9ICdhbmNlc3Rvci1jaGlwJztcbiAgICAgICAgLy8gQnJpZ2h0bmVzcyBncmFkaWVudDogZGVlcGVyIGNoaXBzIGdldCBwcm9ncmVzc2l2ZWx5IGRpbW1lci5cbiAgICAgICAgY2hpcC5zdHlsZS5maWx0ZXIgPSBgYnJpZ2h0bmVzcygkeygxIC0gaSAqIDAuMDgpLnRvRml4ZWQoMil9KWA7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gYW5jLnRlc3RJZCA/IGBbJHthbmMudGVzdElkfV1gXG4gICAgICAgICAgOiBhbmMuaWQgPyBgIyR7YW5jLmlkfWBcbiAgICAgICAgICA6IGFuYy5jbGFzc2VzPy5sZW5ndGggPyBgJHthbmMudGFnfS4ke2FuYy5jbGFzc2VzWzBdfWBcbiAgICAgICAgICA6IGFuYy50YWc7XG4gICAgICAgIGNoaXAudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY2hpcC5kYXRhc2V0LnRpcCA9IGBDYXB0dXJlIHRoZSBhbmNlc3RvciAke2kgKyAxfSBsZXZlbCR7aSA/ICdzJyA6ICcnfSB1cCDCtyAke2FuYy50YWd9JHthbmMuaWQgPyAnIycgKyBhbmMuaWQgOiAnJ31gO1xuICAgICAgICAvLyBIb3Zlci1wcmV2aWV3IHRoZSBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIHNvIHRoZSB1c2VyIGNhbiBzZWVcbiAgICAgICAgLy8gd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjb21taXR0aW5nLiBNaXJyb3JzIGhvd1xuICAgICAgICAvLyBob3ZlcmluZyBhIHNlbGVjdG9yIGJ1YmJsZSBwYWludHMgaXRzIHJpbmcuIENsZWFyaW5nIG9uXG4gICAgICAgIC8vIG1vdXNlbGVhdmUgc3dhcHMgYmFjayB0byB0aGUgYnViYmxlJ3Mgb3duIG91dGxpbmUgKHRoZSBidWJibGUnc1xuICAgICAgICAvLyBtb3VzZWVudGVyIGhhbmRsZXIgcGFpbnRlZCBpdDsgbGVhdmluZyB0aGUgY2hpcCBqdXN0IHJlbW92ZXNcbiAgICAgICAgLy8gdGhlIG92ZXJyaWRlKS5cbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGRlcHRoOiBpICsgMX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAgIC8vIFJlLXBhaW50IHRoZSBidWJibGUncyBvd24gcmluZyByYXRoZXIgdGhhbiBjbGVhcmluZyBlbnRpcmVseVxuICAgICAgICAgIC8vIHNvIHRoZSB1c2VyIGRvZXNuJ3Qgc2VlIGEgZmxpY2tlciBvZiBcIm5vdGhpbmdcIiBiZXR3ZWVuIGNoaXBzLlxuICAgICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e29rOiBib29sZWFuOyBlbnRyeT86IEVudHJ5fT4oe1xuICAgICAgICAgICAga2luZDogJ2NhcHR1cmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChyZXBseT8ub2spIHNldFN0YXR1cyhgQ2FwdHVyZWQgYW5jZXN0b3IgJHthbmMudGFnfWApO1xuICAgICAgICAgIGVsc2Ugc2V0U3RhdHVzKCdDb3VsZCBub3QgY2FwdHVyZSBhbmNlc3RvcicsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNydW1icy5hcHBlbmQoY2hpcCk7XG4gICAgICB9KTtcbiAgICAgIGRpdi5hcHBlbmQoY3J1bWJzKTtcbiAgICB9XG5cbiAgICAvLyBQcmV2aWV3IHRpbGUuIFRoZSBmdWxsIFBORyBsaXZlcyBvbiBkaXNrIHVuZGVyXG4gICAgLy8gLnBpbmNoZ3JhYi88d3M+L3NjcmVlbnNob3RzLzsgdGhlIGRhdGFVcmwgaXMgYSBzaWRlLXBhbmVsLWZyaWVuZGx5XG4gICAgLy8gZG93bnNjYWxlICjiiaQzMjBweCB3aWRlKS4gVG8gc3RvcCB0aGUgbGF5b3V0IGZyb20ganVtcGluZyB3aGVuIGEgc2hvdFxuICAgIC8vIGFycml2ZXMgYSBzZWNvbmQgYWZ0ZXIgY2FwdHVyZSwgd2UgUkVTRVJWRSB0aGUgZmluYWwgaW1hZ2UgaGVpZ2h0IHVwXG4gICAgLy8gZnJvbnQgdXNpbmcgdGhlIGNhcHR1cmVkIGVsZW1lbnQncyBrbm93biBhc3BlY3QgcmF0aW8gYW5kIHBhaW50IGFcbiAgICAvLyBza2VsZXRvbiBsb2FkZXIgaW4gdGhhdCBzcGFjZSwgdGhlbiBzd2FwIHRoZSBzY3JlZW5zaG90IGluIHdpdGggbm9cbiAgICAvLyByZWZsb3cuIFRoZSByZXNlcnZhdGlvbiBvbmx5IGhhcHBlbnMgd2hlbiBhIHNob3QgaXMgYWN0dWFsbHkgZXhwZWN0ZWRcbiAgICAvLyAoYXV0b1NjcmVlbnNob3Qgb24sIGhvc3Qgbm90IHNraXBwZWQsIG5vIHJlY29yZGVkIGZhaWx1cmUpIHNvIGNhcHR1cmVzXG4gICAgLy8gdGhhdCB3aWxsIG5ldmVyIGdldCBhIHNob3QgZG9uJ3QgY2FycnkgYW4gZW1wdHkgYm94LlxuICAgIGNvbnN0IHNob3REYXRhVXJsID0gc2hvdHMuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHNob3RFeHBlY3RlZCA9IHByZWZzLmF1dG9TY3JlZW5zaG90XG4gICAgICAmJiAhc2hvdWxkU2tpcFNjcmVlbnNob3QobS5lbnRyeS51cmwgPz8gJycpXG4gICAgICAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py51bmF2YWlsYWJsZVJlYXNvbjtcbiAgICBpZiAoc2hvdERhdGFVcmwgfHwgc2hvdEV4cGVjdGVkKSB7XG4gICAgICBjb25zdCBwcmV2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBwcmV2aWV3LmNsYXNzTmFtZSA9ICdwcmV2aWV3JztcbiAgICAgIC8vIFJlc2VydmUgdmVydGljYWwgc3BhY2UgaW1tZWRpYXRlbHkgZnJvbSB0aGUgZWxlbWVudCdzIHdpZHRoL2hlaWdodC5cbiAgICAgIC8vIFRoZSB0aHVtYm5haWwgaXMgcmVuZGVyZWQgYXQgdGhlIGJ1YmJsZSdzIGNvbnRlbnQgd2lkdGgsIHNvIHRoZSBib3hcbiAgICAgIC8vIGhlaWdodCB0cmFja3MgdGhlIGVsZW1lbnQncyBhc3BlY3QgcmF0aW8uIENsYW1wIHNvIGEgdmVyeSB0YWxsXG4gICAgICAvLyBlbGVtZW50IGRvZXNuJ3QgcmVzZXJ2ZSBhbiBhYnN1cmQgYW1vdW50IG9mIHNwYWNlLlxuICAgICAgY29uc3QgciA9IG0uZW50cnkucmVjdDtcbiAgICAgIGlmIChyICYmIHIudyA+IDAgJiYgci5oID4gMCkge1xuICAgICAgICBjb25zdCByYXRpbyA9IE1hdGgubWluKE1hdGgubWF4KHIuaCAvIHIudywgMC4xMiksIDIuMik7XG4gICAgICAgIHByZXZpZXcuc3R5bGUuc2V0UHJvcGVydHkoJy0tc2hvdC1yYXRpbycsIFN0cmluZyhyYXRpbykpO1xuICAgICAgICBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ3Jlc2VydmVkJyk7XG4gICAgICB9XG4gICAgICBpZiAoc2hvdERhdGFVcmwpIHtcbiAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZy5jbGFzc05hbWUgPSAnc2hvdCc7XG4gICAgICAgIGltZy5hbHQgPSBgU2NyZWVuc2hvdCBvZiAjJHttLmVudHJ5Lm59YDtcbiAgICAgICAgLy8gUmV2ZWFsIG9ubHkgb25jZSBkZWNvZGVkIHNvIHRoZSBzd2FwIGlzIGluc3RhbnQgYW5kIHJlZmxvdy1mcmVlO1xuICAgICAgICAvLyB0aGUgc2tlbGV0b24gc3RheXMgdmlzaWJsZSB1bmRlcm5lYXRoIHVudGlsIHRoZW4uXG4gICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcHJldmlldy5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKSk7XG4gICAgICAgIGltZy5zcmMgPSBzaG90RGF0YVVybDtcbiAgICAgICAgaWYgKGltZy5jb21wbGV0ZSkgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKTtcbiAgICAgICAgcHJldmlldy5hcHBlbmQoaW1nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIHNob3QgeWV0IOKAlCBzaG93IGEgc2tlbGV0b24gc2hpbW1lciBvY2N1cHlpbmcgdGhlIHJlc2VydmVkIHNwYWNlLlxuICAgICAgICBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmcnKTtcbiAgICAgICAgY29uc3Qgc2tlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBza2VsLmNsYXNzTmFtZSA9ICdzaG90LXNrZWxldG9uJztcbiAgICAgICAgc2tlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBgTG9hZGluZyBzY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gKTtcbiAgICAgICAgcHJldmlldy5hcHBlbmQoc2tlbCk7XG4gICAgICB9XG4gICAgICBkaXYuYXBwZW5kKHByZXZpZXcpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3RhdHMuY2xhc3NOYW1lID0gJ2VudC1zdGF0cyc7XG4gICAgY29uc3QgZmIgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihtLmlkKTtcbiAgICBjb25zdCBteVRva2VucyA9IHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkobS5lbnRyeSkpO1xuICAgIGNvbnN0IHRvdGFsVG9rZW5zID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG1tKTogbW0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG1tLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAucmVkdWNlKChzLCBtbSkgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkobW0uZW50cnkpKSwgMCk7XG4gICAgY29uc3Qgc2hhcmVQY3QgPSB0b3RhbFRva2VucyA+IDAgPyBNYXRoLnJvdW5kKChteVRva2VucyAvIHRvdGFsVG9rZW5zKSAqIDEwMCkgOiAwO1xuICAgIGNvbnN0IGdyb3VwQ291bnQgPSBtLmVudHJ5Lmdyb3VwPy5sZW5ndGggPz8gMDtcbiAgICBjb25zdCBncm91cFRva2VucyA9IChtLmVudHJ5Lmdyb3VwID8/IFtdKS5yZWR1Y2UoKHMsIGcpID0+IHMgKyB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KGcpKSwgMCk7XG4gICAgdHlwZSBTdGF0Q2VsbCA9IHtsYWJlbDogc3RyaW5nOyB2YWx1ZTogc3RyaW5nOyB0aXA6IHN0cmluZ307XG4gICAgY29uc3QgY2VsbHM6IFN0YXRDZWxsW10gPSBbXG4gICAgICB7bGFiZWw6ICdIVE1MJywgdmFsdWU6IGAke20uZW50cnkub3V0ZXJIVE1MPy5sZW5ndGggPz8gMH1gLCB0aXA6ICdPdXRlciBIVE1MIGNoYXIgbGVuZ3RoJ30sXG4gICAgICB7bGFiZWw6ICdUb2tlbnMnLCB2YWx1ZTogYCR7bXlUb2tlbnN9YCwgdGlwOiAnQXBwcm94IExMTSB0b2tlbnMgZm9yIHRoaXMgZW50cnknfSxcbiAgICAgIHtsYWJlbDogJ1NoYXJlJywgdmFsdWU6IGAke3NoYXJlUGN0fSVgLCB0aXA6ICdUb2tlbiBzaGFyZSBvZiBhbGwgc2VsZWN0b3JzJ30sXG4gICAgICB7bGFiZWw6ICdDb21tZW50cycsIHZhbHVlOiBgJHtmYi5sZW5ndGh9YCwgdGlwOiAnSW5saW5lIGNvbW1lbnRzIHRocmVhZGVkIHVuZGVyIHRoaXMgZW50cnknfSxcbiAgICAgIHtsYWJlbDogJ1J1bGVzJywgdmFsdWU6IGAke20uZW50cnkubWF0Y2hlZFJ1bGVzPy5sZW5ndGggPz8gMH1gLCB0aXA6ICdNYXRjaGVkIENTUyBydWxlcyd9LFxuICAgICAge2xhYmVsOiAnU3R5bGVzJywgdmFsdWU6IGAke09iamVjdC5rZXlzKG0uZW50cnkuc3R5bGVzID8/IHt9KS5sZW5ndGh9YCwgdGlwOiAnQ29tcHV0ZWQtc3R5bGUgZmllbGRzIGtlcHQnfSxcbiAgICBdO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwJywgdmFsdWU6IGAke2dyb3VwQ291bnR9YCwgdGlwOiAnTWVtYmVycyBmb2xkZWQgaW50byB0aGlzIGdyb3VwJ30pO1xuICAgICAgY2VsbHMucHVzaCh7bGFiZWw6ICdHcm91cCBUJywgdmFsdWU6IGAke2dyb3VwVG9rZW5zfWAsIHRpcDogJ1Rva2VucyBjb250cmlidXRlZCBieSBncm91cCBtZW1iZXJzJ30pO1xuICAgIH1cbiAgICBzdGF0cy5pbm5lckhUTUwgPSBjZWxscy5tYXAoKGMpID0+XG4gICAgICBgPHNwYW4gY2xhc3M9XCJlbnQtc3RhdFwiIGRhdGEtdGlwPVwiJHtlc2NhcGVIdG1sKGMudGlwKX1cIj48c3BhbiBjbGFzcz1cImxibFwiPiR7Yy5sYWJlbH08L3NwYW4+PHNwYW4gY2xhc3M9XCJ2YWxcIj4ke2MudmFsdWV9PC9zcGFuPjwvc3Bhbj5gLFxuICAgICkuam9pbignJyk7XG4gICAgZGl2LmFwcGVuZChzdGF0cyk7XG5cbiAgICAvLyDilIDilIAgSlNPTiBwYW5lIHdpdGggdG9vbGJhciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvLyBUb29sYmFyIGFib3ZlIHRoZSBKU09OIGJvZHk6IGxlZnQgPSBsaW5lLXdyYXAgdG9nZ2xlLCByaWdodCA9IGNvcHkuXG4gICAgLy8gVGhlIEpTT04gaXRzZWxmIHJlZmxlY3RzIHRoZSBnbG9iYWwgYG1pbmlmeWAgc2V0dGluZyBzbyB0aGUgdXNlciBzZWVzXG4gICAgLy8gdGhlIHNhbWUgc2hhcGUgdGhhdCB3aWxsIGVuZCB1cCBpbiB0aGUgZXhwb3J0LlxuICAgIGNvbnN0IGpzb25XcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAganNvbldyYXAuY2xhc3NOYW1lID0gJ2JvZHktanNvbi13cmFwJztcbiAgICBjb25zdCBqc29uQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAganNvbkJhci5jbGFzc05hbWUgPSAnYm9keS1qc29uLWJhcic7XG5cbiAgICAvLyBMaW5lLXdyYXAgY2hlY2tib3ggKHBlci1idWJibGUgbG9jYWwgc3RhdGUsIGRlZmF1bHQgT04pLiBXaGVuIE9OIHRoZVxuICAgIC8vIEpTT04gaXMgZmxhdHRlbmVkIHRvIE9ORSBtaW5pZmllZCBsaW5lIHRoYXQgc29mdC13cmFwcyB0byB0aGUgYnViYmxlXG4gICAgLy8gd2lkdGggKG5vIGhvcml6b250YWwgc2Nyb2xsKTsgd2hlbiBPRkYgaXQgZmFsbHMgYmFjayB0byB0aGUgZ2xvYmFsXG4gICAgLy8gbWluaWZ5LXJlc3BlY3RpbmcgcHJldHR5L2NvbXBhY3QgZm9ybSB3aXRoIGhvcml6b250YWwgc2Nyb2xsLlxuICAgIGNvbnN0IHdyYXBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgd3JhcExhYmVsLmNsYXNzTmFtZSA9ICdqc29uLXdyYXAtdG9nZ2xlJztcbiAgICB3cmFwTGFiZWwuZGF0YXNldC50aXAgPSAnRmxhdHRlbiB0byBhIHNpbmdsZSBzb2Z0LXdyYXBwaW5nIGxpbmUgaW5zdGVhZCBvZiBob3Jpem9udGFsIHNjcm9sbCc7XG4gICAgY29uc3Qgd3JhcENoZWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB3cmFwQ2hlY2sudHlwZSA9ICdjaGVja2JveCc7XG4gICAgd3JhcENoZWNrLmNoZWNrZWQgPSB0cnVlO1xuICAgIHdyYXBMYWJlbC5hcHBlbmQod3JhcENoZWNrLCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIFdyYXAnKSk7XG4gICAganNvbkJhci5hcHBlbmQod3JhcExhYmVsKTtcblxuICAgIC8vIENvcHkgYnV0dG9uIChtaXJyb3JzIHRoZSBcIkNvcHkgdGhpcyBjYXB0dXJlIGFzIEpTT05cIiBhY3Rpb24gYmVsb3csXG4gICAgLy8gc3VyZmFjZWQgYXQgdGhlIHRvcCBzbyB0aGUgdXNlciBkb2Vzbid0IGhhdmUgdG8gc2Nyb2xsIHBhc3QgdGhlIEpTT05cbiAgICAvLyB0byBmaW5kIGl0KS5cbiAgICBjb25zdCBjb3B5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29weUJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgY29weUJ0bi5jbGFzc05hbWUgPSAnaWNvbmJ0biBqc29uLWNvcHknO1xuICAgIGNvcHlCdG4uZGF0YXNldC50aXAgPSAnQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTic7XG4gICAgY29weUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ29weSBjYXB0dXJlIGFzIEpTT04nKTtcbiAgICBjb3B5QnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY29weScsIDEzKTtcbiAgICBjb3B5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAvLyBGdWxsIHNpbmdsZS1jYXB0dXJlIGV4cG9ydDogaWRlbnRpdHkgKyBwYXRocyArIHRleHQvY29udGVudCArIGV2ZXJ5XG4gICAgICAvLyBhdHRhY2hlZCBub3RlL2NvbW1lbnQg4oCUIHRoZSBzYW1lIGRlcHRoIGFzIGEgZnVsbCBleHBvcnQsIHNjb3BlZCB0b1xuICAgICAgLy8gdGhpcyBvbmUgY2FwdHVyZSAoaXRlbSA3KS4gRGlzdGluY3QgZnJvbSB0aGUgcmF3IGVudHJ5IHNob3duIGJlbG93LlxuICAgICAgY29uc3QgZmVlZGJhY2sgPSBtZXNzYWdlcy5mbGF0TWFwKCh4KSA9PiB4LnR5cGUgPT09ICdmZWVkYmFjaycgJiYgeC5wYXJlbnRVaWQgPT09IG0uZW50cnkudWlkXG4gICAgICAgID8gW3t0ZXh0OiB4LnRleHQsIHRzOiB4LnRzLCB1aWQ6IHguaWQsIHBhcmVudFVpZDogeC5wYXJlbnRVaWR9XSA6IFtdKTtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNlcmlhbGl6ZUNhcHR1cmVKc29uKHtlbnRyeTogbS5lbnRyeSwgZmVlZGJhY2t9KSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjYXB0dXJlIGV4cG9ydCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNhcHR1cmUnLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgIH0pO1xuICAgIGpzb25CYXIuYXBwZW5kKGNvcHlCdG4pO1xuICAgIGpzb25XcmFwLmFwcGVuZChqc29uQmFyKTtcblxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBib2R5LmNsYXNzTmFtZSA9ICdib2R5LWpzb24gd3JhcC1vbic7XG4gICAgLy8gUmVuZGVyIHRoZSBKU09OIHRvIG1hdGNoIHRoZSB3cmFwIHN0YXRlOlxuICAgIC8vICAgd3JhcCBPTiAg4oaSIGEgc2luZ2xlIG1pbmlmaWVkIGxpbmUgKGluZGVudCAwKSB0aGF0IHNvZnQtd3JhcHMgdG8gdGhlXG4gICAgLy8gICAgICAgICAgICAgIGJ1YmJsZSB3aWR0aCAoQ1NTIGhhbmRsZXMgdGhlIHZpc3VhbCB3cmFwcGluZyB2aWFcbiAgICAvLyAgICAgICAgICAgICAgb3ZlcmZsb3ctd3JhcDphbnl3aGVyZSksIHNvIHRoZSB3aG9sZSBvYmplY3QgaXMgb25lXG4gICAgLy8gICAgICAgICAgICAgIGNvbnRpbnVvdXMgc3RyaW5nIHdpdGggbm8gaG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgLy8gICB3cmFwIE9GRiDihpIgdGhlIGdsb2JhbCBtaW5pZnktcmVzcGVjdGluZyBmb3JtOiBwcmV0dHktcHJpbnRlZCBmdWxsXG4gICAgLy8gICAgICAgICAgICAgIGVudHJ5LCBvciB0aGUgc2xpbUVudHJ5IGNvbXBhY3QgZm9ybSB3aGVuIG1pbmlmeSBpcyBvbixcbiAgICAvLyAgICAgICAgICAgICAgd2l0aCBob3Jpem9udGFsIHNjcm9sbCBmb3IgbG9uZyBsaW5lcy5cbiAgICBjb25zdCByZW5kZXJKc29uID0gKCk6IHZvaWQgPT4ge1xuICAgICAgYm9keS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXBDaGVjay5jaGVja2VkO1xuICAgICAgY29uc3QgcGF5bG9hZCA9ICh3cmFwcGVkIHx8IHByZWZzLm1pbmlmeSkgPyBzbGltRW50cnkobS5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZX0pIDogbS5lbnRyeTtcbiAgICAgIGNvbnN0IGluZGVudCA9ICh3cmFwcGVkIHx8IHByZWZzLm1pbmlmeSkgPyAwIDogMjtcbiAgICAgIGNvbnN0IHRleHQgPSBKU09OLnN0cmluZ2lmeShwYXlsb2FkLCBudWxsLCBpbmRlbnQpO1xuICAgICAgYXBwZW5kSnNvbkhpZ2hsaWdodChib2R5LCB0ZXh0KTtcbiAgICAgIGlmIChzZWFyY2hRdWVyeSkgd3JhcFNlYXJjaEhpdHNJblRleHROb2Rlcyhib2R5LCBzZWFyY2hRdWVyeSk7XG4gICAgfTtcbiAgICByZW5kZXJKc29uKCk7XG4gICAgd3JhcENoZWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnd3JhcC1vbicsIHdyYXBDaGVjay5jaGVja2VkKTtcbiAgICAgIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnd3JhcC1vZmYnLCAhd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgcmVuZGVySnNvbigpO1xuICAgIH0pO1xuICAgIC8vIFN0b3AgdGhlIGNsaWNrIG9uIHRoZSB0b29sYmFyIGZyb20gY29sbGFwc2luZyB0aGUgYnViYmxlIOKAlCB0aGUgaGVhZCdzXG4gICAgLy8gY2xpY2sgaGFuZGxlciB0b2dnbGVzIGAuZXhwYW5kZWRgIG9uIGNsaWNrLCBhbmQgdGhlIGJhciBsaXZlcyBpbnNpZGVcbiAgICAvLyB0aGUgYnViYmxlLlxuICAgIGpzb25CYXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7XG4gICAganNvbldyYXAuYXBwZW5kKGJvZHkpO1xuICAgIGRpdi5hcHBlbmQoanNvbldyYXApO1xuXG4gICAgaGVhZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QudG9nZ2xlKCdleHBhbmRlZCcpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhd05vb2RsZXMpO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZ29sZDogdHJ1ZX0pO1xuICAgICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGFybVN0aWNreUV4cGlyeSgpO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICBpZiAobGFzdEFjdGl2ZVNlbGVjdG9yKSB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IGxhc3RBY3RpdmVTZWxlY3Rvciwgc3RpY2t5OiB0cnVlfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYWN0aW9ucy5jbGFzc05hbWUgPSAnYWN0aW9ucyc7XG4gICAgLy8gTm90ZTogTk8gYWN0aW9ucy1yb3cgbW91c2VlbnRlci9tb3VzZWxlYXZlLiBUaGUgYnViYmxlJ3Mgb3duXG4gICAgLy8gbW91c2VlbnRlci9tb3VzZWxlYXZlIGFscmVhZHkgcGFpbnRzIHRoZSBwYWdlLXNpZGUgb3V0bGluZSB3aGlsZVxuICAgIC8vIHRoZSBjdXJzb3IgaXMgYW55d2hlcmUgaW5zaWRlIHRoZSBidWJibGUg4oCUIGluY2x1ZGluZyBvdmVyIGFjdGlvblxuICAgIC8vIGJ1dHRvbnMuIEFkZGluZyBoYW5kbGVycyBIRVJFIHVzZWQgdG8gY2xlYXIgdGhlIG91dGxpbmUgd2hlbmV2ZXJcbiAgICAvLyB0aGUgY3Vyc29yIG1vdmVkIGZyb20gLmFjdGlvbnMgYmFjayB0byB0aGUgYnViYmxlIGJvZHkgKGJlY2F1c2VcbiAgICAvLyAubW91c2VsZWF2ZSBmaXJlcyBvbiB0aGUgcGFyZW50IHBhdGggZXZlbiB0aG91Z2ggLm1vdXNlZW50ZXIgb25cbiAgICAvLyB0aGUgYnViYmxlIGRvZXNuJ3QgcmVmaXJlKSwgd2hpY2ggcmVhZCBhcyBcInRoZSBoaWdobGlnaHQgZmxpY2tlcnNcbiAgICAvLyBvZmYgbWlkLWhvdmVyXCIuXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKG0ucGlubmVkID8gJ3N0YXItZmlsbGVkJyA6ICdzdGFyJywgbS5waW5uZWQgPyAnVW5waW4gZnJvbSB0b3AnIDogJ1BpbiB0byB0b3AnLCAoKSA9PiB7XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgbS5waW5uZWQgPSAhbS5waW5uZWQ7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICB9LCB7dG9nZ2xlZDogbS5waW5uZWR9KSk7XG4gICAgLy8gTG9jYXRlIGlzIGEgb25lLXNob3Q6IHNjcm9sbCB0aGUgcGFnZSB0byB0aGUgZWxlbWVudCBhbmQgcnVuIHRoZVxuICAgIC8vIDMtcHVsc2UgY3lhbiByaW5nIGFuaW1hdGlvbi4gSXQgdXNlZCB0byBzaGFyZSBgbGFzdEFjdGl2ZVNlbGVjdG9yYFxuICAgIC8vIHdpdGggdGhlIGhvdmVyLXN0aWNreSBwYXRoLCB3aGljaCBtYWRlIHRoZSBidXR0b24gYXBwZWFyIHRvZ2dsZWRcbiAgICAvLyBhbnkgdGltZSB0aGUgdXNlciBtZXJlbHkgaG92ZXJlZCB0aGUgYnViYmxlLiBOb3cgaXQgaGFzIG5vXG4gICAgLy8gcGVyc2lzdGVudCBzdGF0ZSDigJQgcHJlc3NpbmcgaXQgYWx3YXlzIHBsYXlzIHRoZSBzYW1lIGZsYXNoLlxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY3Jvc3NoYWlyJywgJ0xvY2F0ZSB0aGlzIGVsZW1lbnQgb24gdGhlIHBhZ2UnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnbG9jYXRlLWZsYXNoJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3J9KTtcbiAgICAgIHNldFN0YXR1cygnTG9jYXRpbmfigKYnKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdtZXNzYWdlLXNxdWFyZS1wbHVzJywgJ0FkZCBhIGNvbW1lbnQgYWZ0ZXIgdGhpcyBjYXB0dXJlJywgKCkgPT4ge1xuICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgY29uc3QgYmVmb3JlSWQgPSBpZHggPj0gMCAmJiBpZHggPCBtZXNzYWdlcy5sZW5ndGggLSAxID8gbWVzc2FnZXNbaWR4ICsgMV0hLmlkIDogJ19fZW5kX18nO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBiZWZvcmVJZDtcbiAgICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gdHJ1ZTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHtzaXplOiAxNX0pKTtcbiAgICBpZiAoZ3JvdXBDb3VudCkge1xuICAgICAgLy8gU3BsaXQtZ3JvdXAgYWN0aW9uOiBwcm9tb3RlIGVhY2ggZ3JvdXAgbWVtYmVyIGJhY2sgdG8gaXRzIG93blxuICAgICAgLy8gdG9wLWxldmVsIHNlbGVjdG9yIGVudHJ5LCB0aGVuIGZpcmUgYSBmcmVzaCBlbGVtZW50IHNjcmVlbnNob3RcbiAgICAgIC8vIGZvciBlYWNoIHByb21vdGVkIG1lbWJlci4gR3JvdXAgY2FwdHVyZXMgc2hhcmUgYSBzaW5nbGUgdW5pb24tXG4gICAgICAvLyBiYm94IHNjcmVlbnNob3Qga2V5ZWQgb24gdGhlIGhlYWQ7IHRoZSBtZW1iZXJzIG5ldmVyIGdldCB0aGVpclxuICAgICAgLy8gb3duIGVsZW1lbnQgc2hvdHMgdW50aWwgc3BsaXQuIEFmdGVyIHRoaXMsIGVhY2ggY2hpbGQgaGFzIGl0c1xuICAgICAgLy8gb3duIHJpbmcgKyB0aHVtYm5haWwuXG4gICAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2xpc3QtdHJlZScsIGBTcGxpdCB0aGlzIGdyb3VwIG9mICR7Z3JvdXBDb3VudH0gaW50byBpbmRpdmlkdWFsIGVudHJpZXNgLCAoKSA9PiB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIGNvbnN0IGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgICAgaWYgKGlkeCA8IDApIHJldHVybjtcbiAgICAgICAgY29uc3QgbWVtYmVycyA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgIGRlbGV0ZSBtLmVudHJ5Lmdyb3VwO1xuICAgICAgICBjb25zdCBmcmVzaDogU2VsZWN0b3JNZXNzYWdlW10gPSBtZW1iZXJzLm1hcCgoZW50cnkpID0+ICh7XG4gICAgICAgICAgdHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBlbnRyeS50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIGVudHJ5LFxuICAgICAgICB9KSk7XG4gICAgICAgIG1lc3NhZ2VzLnNwbGljZShpZHggKyAxLCAwLCAuLi5mcmVzaCk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cyhgU3BsaXQgZ3JvdXAgb2YgJHttZW1iZXJzLmxlbmd0aH0gwrcgY2FwdHVyaW5nIHNjcmVlbnNob3Rz4oCmYCk7XG4gICAgICAgIC8vIEZpcmUgcGVyLW1lbWJlciBlbGVtZW50IHNob3RzIOKAlCBzZXF1ZW50aWFsbHkgc28gdGhleSBkb24ndFxuICAgICAgICAvLyByYWNlIGNhcHR1cmVWaXNpYmxlVGFiLiBGYWlsdXJlcyAoc2VsZWN0b3Igbm8gbG9uZ2VyIG1hdGNoZXMsXG4gICAgICAgIC8vIGhvc3Qgb24gc2tpcC1saXN0KSBsZWF2ZSB0aGUgbWVtYmVyIHdpdGhvdXQgYSB0aHVtYm5haWwgYnV0XG4gICAgICAgIC8vIGRvbid0IGJsb2NrIHRoZSBvdGhlcnMuXG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBsZXQgY2FwdHVyZWQgPSAwO1xuICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZnJlc2gpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGF3YWl0IGZpcmVFbGVtZW50U2hvdChjaGlsZCk7XG4gICAgICAgICAgICAgIGlmIChjaGlsZC5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSBjYXB0dXJlZCsrO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyBjb25zb2xlLndhcm4oTE9HLCAnc3BsaXQtZ3JvdXAgc2hvdCBmYWlsZWQgZm9yJywgY2hpbGQuZW50cnkuc2VsZWN0b3IsIGUpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldFN0YXR1cyhgU3BsaXQgZG9uZSDCtyAke2NhcHR1cmVkfS8ke21lbWJlcnMubGVuZ3RofSBzY3JlZW5zaG90c2ApO1xuICAgICAgICB9KSgpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2V4dGVybmFsLWxpbmsnLCAnTG9nIHRoZSBlbGVtZW50IGFuZCBjb3B5IGEgY29uc29sZSBzbmlwcGV0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e3NuaXBwZXQ/OiBzdHJpbmd9Pih7a2luZDogJ2xvZy1lbGVtZW50Jywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIG46IG0uZW50cnkubn0pO1xuICAgICAgY29uc3Qgc25pcHBldCA9IHJlcGx5Py5zbmlwcGV0ID8/IGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcke20uZW50cnkuc2VsZWN0b3J9JylgO1xuICAgICAgdHJ5IHsgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc25pcHBldCk7IHNldFN0YXR1cygnTG9nZ2VkICsgY29waWVkIGNvbnNvbGUgc25pcHBldCcpOyBzaG93Q29waWVkKCdDb3BpZWQgc25pcHBldCcpOyB9XG4gICAgICBjYXRjaCB7IHNldFN0YXR1cygnTG9nZ2VkIHRvIGNvbnNvbGUnKTsgfVxuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3JlZnJlc2gtY3cnLCAnUmUtY2FwdHVyZSB0aGlzIGVsZW1lbnQgZnJvbSB0aGUgbGl2ZSBwYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e29rOiBib29sZWFuOyBlbnRyeT86IEVudHJ5fT4oe2tpbmQ6ICdyZWNhcHR1cmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmVudHJ5KSB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG0uZW50cnkgPSByZXBseS5lbnRyeTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdSZS1jYXB0dXJlZCcpO1xuXG4gICAgICB9IGVsc2Ugc2V0U3RhdHVzKCdSZS1jYXB0dXJlIGZhaWxlZCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjb3B5JywgJ0NvcHkgdGhpcyBjYXB0dXJlIGFzIGEgZnVsbCBleHBvcnQgKHBhdGhzLCB0ZXh0LCBjb21tZW50cyknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBmZWVkYmFjayA9IG1lc3NhZ2VzLmZsYXRNYXAoKHgpID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LnBhcmVudFVpZCA9PT0gbS5lbnRyeS51aWRcbiAgICAgICAgPyBbe3RleHQ6IHgudGV4dCwgdHM6IHgudHMsIHVpZDogeC5pZCwgcGFyZW50VWlkOiB4LnBhcmVudFVpZH1dIDogW10pO1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplQ2FwdHVyZUpzb24oe2VudHJ5OiBtLmVudHJ5LCBmZWVkYmFja30pKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNhcHR1cmUgZXhwb3J0Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY2FwdHVyZScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckZlZWRiYWNrID0gKG06IEZlZWRiYWNrTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIGZlZWRiYWNrJztcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSBkaXYuY2xhc3NMaXN0LmFkZCgndGhyZWFkZWQnKTtcbiAgICBkaXYuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgZGl2LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKG0udGV4dCwgc2VhcmNoUXVlcnkpO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIHtcbiAgICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBzZWxlY3RvciDigJQgcHJlZmVyIHBhcmVudFVpZCAodGhlIHBlcnNpc3RlZCBGSylcbiAgICAgIC8vIG92ZXIgY2FwdHVyZS1hZGphY2VuY3ksIHNpbmNlIGRyYWctdG8tcmVwYXJlbnQgbW92ZXMgdGhlIGNoaXAgYnV0XG4gICAgICAvLyB0aGUgdHJhaWxpbmctc2VsZWN0b3IgaGV1cmlzdGljIGdpdmVzIHN0YWxlIHJlc3VsdHMgdW50aWwgcmVuZGVyXG4gICAgICAvLyBzZXR0bGVzLiBUaGUgYW5ub3RhdGlvbiBvdmVybGF5IG5lZWRzIHRoZSBwYXJlbnQncyBzZWxlY3RvciB0b1xuICAgICAgLy8gYW5jaG9yIHRoZSBvbi1wYWdlIHRvb2x0aXAuXG4gICAgICBjb25zdCB7cGFyZW50U2VsLCBwYXJlbnRVaWR9ID0gKCgpID0+IHtcbiAgICAgICAgaWYgKG0ucGFyZW50VWlkKSB7XG4gICAgICAgICAgY29uc3QgcCA9IG1lc3NhZ2VzLmZpbmQoXG4gICAgICAgICAgICAobW0pID0+IG1tLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKG1tIGFzIFNlbGVjdG9yTWVzc2FnZSkuZW50cnkudWlkID09PSBtLnBhcmVudFVpZCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChwICYmIHAudHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHtwYXJlbnRTZWw6IHAuZW50cnkuc2VsZWN0b3IsIHBhcmVudFVpZDogcC5lbnRyeS51aWR9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7cGFyZW50U2VsOiBsYXN0U2VsZWN0b3JTZWwsIHBhcmVudFVpZDogdW5kZWZpbmVkIGFzIHN0cmluZyB8IHVuZGVmaW5lZH07XG4gICAgICB9KSgpO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgLy8gU2Nyb2xsIHRoZSBwYXJlbnQgZWxlbWVudCBpbnRvIHZpZXcgKyBzaG93IHRoZSBvbi1wYWdlXG4gICAgICAgIC8vIGFubm90YXRpb24gdG9vbHRpcCByZW5kZXJpbmcgVEhJUyBjb21tZW50J3MgdGV4dC4gUGFzcyB0aGVcbiAgICAgICAgLy8gcGFyZW50J3MgdWlkIHNvIGEgc2FtZS1zZWxlY3RvciBzaWJsaW5nIGNhcHR1cmUgZG9lc24ndCBnZXRcbiAgICAgICAgLy8gbWlzdGFrZW5seSBpZGVudGlmaWVkIGFzIFwidGhlIHNhbWUgdGFyZ2V0XCIgYnkgdGhlIGNvbnRlbnRcbiAgICAgICAgLy8gc2NyaXB0J3MgYW5ub3RhdGlvbiBvdmVybGF5LlxuICAgICAgICBpZiAocHJlZnMuYXV0b1Njcm9sbFRvSG92ZXJlZCkge1xuICAgICAgICAgIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgc3RpY2t5OiB0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZFRvQ1Moe1xuICAgICAgICAgIGtpbmQ6ICdhbm5vdGF0aW9uJyxcbiAgICAgICAgICBzZWxlY3RvcjogcGFyZW50U2VsLFxuICAgICAgICAgIHBheWxvYWQ6IHtzZWxlY3RvcjogcGFyZW50U2VsLCB1aWQ6IHBhcmVudFVpZCwgY2FwdHVyZWQ6IHRydWUsIGZlZWRiYWNrOiBbbS50ZXh0XX0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZGl2LmRhdGFzZXQuY29tbWVudElkID0gbS5pZDtcbiAgICBjb25zdCBiZWdpbkNvbW1lbnREcmFnID0gKGU6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcsIG0uaWQpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ3RleHQvcGxhaW4nLCBtLnRleHQpO1xuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgIH07XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFjdGlvbnMuY2xhc3NOYW1lID0gJ2FjdGlvbnMnO1xuICAgIGNvbnN0IGRyYWdIYW5kbGUgPSBhY3Rpb25CdG4oJ2dyaXAnLCAnRHJhZyB0aGlzIGhhbmRsZSBvbnRvIGEgc2VsZWN0b3IgdG8gcmVwYXJlbnQnLCAoKSA9PiB7IC8qIGRyYWcgaGFuZGxlIG9ubHkgKi8gfSk7XG4gICAgZHJhZ0hhbmRsZS5jbGFzc0xpc3QuYWRkKCdkcmFnLWhhbmRsZScpO1xuICAgIGRyYWdIYW5kbGUuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGJlZ2luQ29tbWVudERyYWcpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRyYWdIYW5kbGUpO1xuICAgIC8vIERldGFjaCDigJQgdGhlIGludmVyc2Ugb2YgZHJhZy10by1yZXBhcmVudC4gT25seSBtZWFuaW5nZnVsIHdoZW4gdGhlXG4gICAgLy8gY29tbWVudCBjdXJyZW50bHkgcmVhZHMgYXMgdGhyZWFkZWQgKEZLIG9yIGFkamFjZW5jeSkuXG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCB8fCBtLnBhcmVudFVpZCkge1xuICAgICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCd1bmxpbmsnLCAnRGV0YWNoIGZyb20gaXRzIGNhcHR1cmUg4oCUIG1ha2UgdGhpcyBhIHN0YW5kYWxvbmUgY29tbWVudCcsICgpID0+IHtcbiAgICAgICAgLy8gUmVzb2x2ZSBieSBpZCBmcm9tIHRoZSBMSVZFIGFycmF5OiB3b3Jrc3BhY2Ugc3dpdGNoZXMgYW5kXG4gICAgICAgIC8vIHVuZG8vcmVkbyByZWFzc2lnbiBgbWVzc2FnZXNgLCBzbyB0aGUgY2xvc3VyZSdzIGBtYCBjYW4gYmUgYVxuICAgICAgICAvLyBzdGFsZSBvYmplY3Qgd2hvc2UgbXV0YXRpb24gd291bGQgYmUgc2lsZW50bHkgZHJvcHBlZCBieSB0aGVcbiAgICAgICAgLy8gbmV4dCBwZXJzaXN0KCkuXG4gICAgICAgIGNvbnN0IGxpdmUgPSBtZXNzYWdlcy5maW5kKCh4KTogeCBpcyBGZWVkYmFja01lc3NhZ2UgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHguaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoIWxpdmUpIHsgc2V0U3RhdHVzKCdDb21tZW50IG5vIGxvbmdlciBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBkZWxldGUgbGl2ZS5wYXJlbnRVaWQ7XG4gICAgICAgIGxpdmUuZGV0YWNoZWQgPSB0cnVlO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgZGV0YWNoZWQg4oCUIGRyYWcgaXRzIGhhbmRsZSBvbnRvIGEgY2FwdHVyZSB0byByZWF0dGFjaCcpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSBjb21tZW50IHRleHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChtLnRleHQpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY29tbWVudCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNvbW1lbnQnKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdwZW5jaWwnLCAnRWRpdCBjb21tZW50JywgKCkgPT4gZW50ZXJGZWVkYmFja0VkaXQoZGl2LCBtKSwge3NpemU6IDE1fSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIC8vIERyb3AgaGFuZGxlciBzaGFyZWQgYnkgZXZlcnkgc2VsZWN0b3IgYnViYmxlLiBBY2NlcHRzIGEgZHJhZ2dlZFxuICAvLyBjb21tZW50IElEIHZpYSB0aGUgYGFwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnRgIE1JTUUsIHVwZGF0ZXNcbiAgLy8gcGFyZW50VWlkICsgYWRqYWNlbmN5LCBwZXJzaXN0cywgcmUtcmVuZGVycy5cbiAgY29uc3Qgd2lyZVNlbGVjdG9yRHJvcFRhcmdldCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBTZWxlY3Rvck1lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgICAgY29uc3QgdHlwZXMgPSBlLmRhdGFUcmFuc2Zlcj8udHlwZXM7XG4gICAgICBpZiAoIXR5cGVzIHx8ICFBcnJheS5mcm9tKHR5cGVzKS5pbmNsdWRlcygnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJvcC10YXJnZXQnKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0JykpO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpO1xuICAgICAgY29uc3QgaWQgPSBlLmRhdGFUcmFuc2Zlcj8uZ2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpO1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3JjSWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IGlkKTtcbiAgICAgIGlmIChzcmNJZHggPCAwKSByZXR1cm47XG4gICAgICBjb25zdCBzcmMgPSBtZXNzYWdlc1tzcmNJZHhdISBhcyBGZWVkYmFja01lc3NhZ2U7XG4gICAgICBpZiAoc3JjLnR5cGUgIT09ICdmZWVkYmFjaycpIHJldHVybjtcbiAgICAgIGNvbnN0IGRzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGlmIChkc3RJZHggPCAwKSByZXR1cm47XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgLy8gVXBkYXRlIHRoZSBGSyBwb2ludGVyIGZpcnN0IOKAlCB0aGF0J3MgdGhlIHNvdXJjZSBvZiB0cnV0aCBpblxuICAgICAgLy8gZXhwb3J0cy4gQWRqYWNlbmN5IGlzIGp1c3QgYSByZW5kZXIgY29udmVuaWVuY2UuIFJlcGFyZW50aW5nIGlzXG4gICAgICAvLyB0aGUgaW52ZXJzZSBvZiBkZXRhY2gsIHNvIHRoZSBkZXRhY2hlZCBmbGFnIGlzIGNsZWFyZWQuXG4gICAgICBzcmMucGFyZW50VWlkID0gbS5lbnRyeS51aWQ7XG4gICAgICBkZWxldGUgc3JjLmRldGFjaGVkO1xuICAgICAgLy8gU3BsaWNlIHNyYyBvdXQgb2YgaXRzIGN1cnJlbnQgc2xvdCBhbmQgcmUtaW5zZXJ0IHJpZ2h0IGFmdGVyIHRoZVxuICAgICAgLy8gbmV3IHBhcmVudCAoYW5kIGFueSBmZWVkYmFjayBhbHJlYWR5IHRyYWlsaW5nIGl0LCBzbyB0aGUgbW9zdC1cbiAgICAgIC8vIHJlY2VudCBmZWVkYmFjayBlbmRzIHVwIG5lYXJlc3QgdGhlIHBhcmVudCB2aXN1YWxseSkuXG4gICAgICBtZXNzYWdlcy5zcGxpY2Uoc3JjSWR4LCAxKTtcbiAgICAgIGNvbnN0IG5ld0RzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGxldCBpbnNlcnRBdCA9IG5ld0RzdElkeCArIDE7XG4gICAgICB3aGlsZSAoaW5zZXJ0QXQgPCBtZXNzYWdlcy5sZW5ndGggJiYgbWVzc2FnZXNbaW5zZXJ0QXRdIS50eXBlID09PSAnZmVlZGJhY2snKSBpbnNlcnRBdCsrO1xuICAgICAgbWVzc2FnZXMuc3BsaWNlKGluc2VydEF0LCAwLCBzcmMpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgcmVwYXJlbnRlZCcpO1xuICAgIH0pO1xuICB9O1xuXG4gIHR5cGUgQWN0aW9uQnRuT3B0cyA9IHt3YXJuPzogYm9vbGVhbjsgdG9nZ2xlZD86IGJvb2xlYW47IHNpemU/OiBudW1iZXJ9O1xuICBjb25zdCBhY3Rpb25CdG4gPSAoaWNvbjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBmbjogKCkgPT4gdm9pZCwgb3B0czogQWN0aW9uQnRuT3B0cyA9IHt9KTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmRhdGFzZXQudGlwID0gdGl0bGU7XG4gICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0aXRsZSk7XG4gICAgaWYgKG9wdHMud2FybikgYi5jbGFzc05hbWUgPSAnd2Fybic7XG4gICAgaWYgKG9wdHMudG9nZ2xlZCkgYi5jbGFzc0xpc3QuYWRkKCd0b2dnbGVkJyk7XG4gICAgLy8gRGVmYXVsdCBpY29uIHNpemUgMTMgcmVhZHMgc2xpZ2h0bHkgc21hbGwgaW4gYSAyMsOXMjIgYnV0dG9uIOKAlCBmaW5lXG4gICAgLy8gZm9yIGljb25zIHdpdGggc2ltcGxlIHNoYXBlcyAoY3Jvc3NoYWlyLCBsaXN0LXRyZWUsIHVuZG8pIGJ1dCB2aXNpYmx5XG4gICAgLy8gc3F1ZWV6ZWQgZm9yIGBtZXNzYWdlLXNxdWFyZS1wbHVzYCBhbmQgYHBlbmNpbGAsIHdoZXJlIHRoZVxuICAgIC8vIGludGVyaW9yIHN0cm9rZXMgdmFuaXNoIGludG8gaGFpcmxpbmUgYmx1ci4gQ2FsbGVycyBjYW4gYnVtcCB3aXRoXG4gICAgLy8gYHNpemU6IDE1YCBmb3IgdGhvc2UuXG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoaWNvbiwgb3B0cy5zaXplID8/IDEzKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgZm4oKTsgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlQnRuID0gKG9uQ29uZmlybTogKCkgPT4gdm9pZCk6IEhUTUxCdXR0b25FbGVtZW50ID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYi50eXBlID0gJ2J1dHRvbic7XG4gICAgYi5jbGFzc05hbWUgPSAnd2Fybic7XG4gICAgYi5kYXRhc2V0LnRpcCA9ICdEZWxldGUnO1xuICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBjYXB0dXJlJyk7XG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMyk7XG4gICAgbGV0IHBhcmVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmV2ZXJ0VGltZXIgPSAwO1xuICAgIGNvbnN0IHJldmVydCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGFyZW50KSByZXR1cm47XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb25maXJtLXllcywgLmNvbmZpcm0tbm8nKSkgbi5yZW1vdmUoKTtcbiAgICAgIGlmICghYi5wYXJlbnRFbGVtZW50KSBwYXJlbnQuYXBwZW5kKGIpO1xuICAgICAgY2xlYXJUaW1lb3V0KHJldmVydFRpbWVyKTtcbiAgICB9O1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHBhcmVudCA9IGIucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgeWVzLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIHllcy5jbGFzc05hbWUgPSAnY29uZmlybS15ZXMnO1xuICAgICAgeWVzLmRhdGFzZXQudGlwID0gJ0NvbmZpcm0gZGVsZXRlJztcbiAgICAgIHllcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ29uZmlybSBkZWxldGUnKTtcbiAgICAgIHllcy5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMTMpO1xuICAgICAgeWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgb25Db25maXJtKCk7IH0pO1xuICAgICAgY29uc3Qgbm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIG5vLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIG5vLmNsYXNzTmFtZSA9ICdjb25maXJtLW5vJztcbiAgICAgIG5vLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBkZWxldGUnO1xuICAgICAgbm8uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBkZWxldGUnKTtcbiAgICAgIG5vLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDEzKTtcbiAgICAgIG5vLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgfSk7XG4gICAgICBiLnJlcGxhY2VXaXRoKHllcyk7XG4gICAgICB5ZXMuYWZ0ZXIobm8pO1xuICAgICAgcmV2ZXJ0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChyZXZlcnQsIDgwMDApO1xuICAgIH0pO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIGNvbnN0IGVudGVyRmVlZGJhY2tFZGl0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IEZlZWRiYWNrTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG5leHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuZXh0LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2sgZWRpdGluZyc7XG4gICAgaWYgKGRpdi5jbGFzc0xpc3QuY29udGFpbnMoJ3RocmVhZGVkJykpIG5leHQuY2xhc3NMaXN0LmFkZCgndGhyZWFkZWQnKTtcbiAgICBuZXh0LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIG5leHQuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICBpbml0aWFsOiBtLnRleHQsXG4gICAgICBvbkNhbmNlbDogKCkgPT4geyBkaXYucmVwbGFjZVdpdGgoZGl2LmNsb25lTm9kZSh0cnVlKSk7IHJlbmRlcigpOyB9LFxuICAgICAgb25TdWJtaXQ6ICh0ZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgICAgICBpZiAodHJpbW1lZCA9PT0gbS50ZXh0KSB7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS50ZXh0ID0gdHJpbW1lZDtcbiAgICAgICAgLy8gU2V2ZXJpdHkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBVSS4gU3RyaXAgYW55IGxlZ2FjeSB2YWx1ZVxuICAgICAgICAvLyB0aGF0IGNhbWUgYmFjayBmcm9tIGFuIG9sZGVyIEpTT05MIGltcG9ydCBzbyBzYXZlcyBkb24ndCBrZWVwXG4gICAgICAgIC8vIHJlLWVtaXR0aW5nIGl0LlxuICAgICAgICBkZWxldGUgKG0gYXMgYW55KS5zZXZlcml0eTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBhdXRvZm9jdXM6IHRydWUsXG4gICAgfSkpO1xuICAgIGRpdi5yZXBsYWNlV2l0aChuZXh0KTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVNZXNzYWdlID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBlbCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcbiAgICBjb25zdCBmaW5pc2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgbWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0uaWQgIT09IGlkKTtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgc2V0U3RhdHVzKCdEZWxldGVkJyk7XG4gICAgfTtcbiAgICBpZiAoIWVsKSB7IGZpbmlzaCgpOyByZXR1cm47IH1cbiAgICBlbC5zdHlsZS5tYXhIZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgncmVtb3ZpbmcnKTtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNsZWFudXAgPSAoKTogdm9pZCA9PiB7IGlmIChkb25lKSByZXR1cm47IGRvbmUgPSB0cnVlOyBmaW5pc2goKTsgfTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgY2xlYW51cCwge29uY2U6IHRydWV9KTtcbiAgICBzZXRUaW1lb3V0KGNsZWFudXAsIDM4MCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIENvbXBvc2VyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZW5kRmVlZGJhY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGNvbXBvc2VyLnZhbHVlLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGxldCBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIHBvc2l0aW9uID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBpbnNlcnRCZWZvcmUuY3VycmVudCk7XG4gICAgICBpZiAocG9zaXRpb24gPCAwKSBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFN0YW1wIHBhcmVudFVpZCBvbiB0aGUgaW4tbWVtb3J5IG1lc3NhZ2UgYXQgY3JlYXRpb24gdGltZSBzbyB0aGVcbiAgICAvLyBGSyBpcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aC4gVGhlIHNsaW0gZW1pdCBubyBsb25nZXIgaGFzIHRvXG4gICAgLy8gaW5mZXIgdGhlIHBhcmVudCBmcm9tIGNhcHR1cmUtYWRqYWNlbmN5LCBhbmQgYG1hbmlmZXN0LmNvdW50c2BcbiAgICAvLyBhY2N1cmF0ZWx5IHJlZmxlY3RzIGZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzLlxuICAgIC8vIFdhbGsgYmFjayB0byB0aGUgbmVhcmVzdCBwcmVjZWRpbmcgc2VsZWN0b3IgYmVmb3JlIHNwbGljZS5cbiAgICBsZXQgcElkeCA9IHBvc2l0aW9uIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgLi4uKHBhcmVudFVpZCA/IHtwYXJlbnRVaWR9IDoge30pLFxuICAgIH0pO1xuICAgIGNvbXBvc2VyLnZhbHVlID0gJyc7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIC8vIFNlbmRpbmcgY2xlYXJzIGFueSBhY3RpdmUgdmlzdWFsIGZpbmQgc28gdGhlIG5ldyBjb21tZW50IGlzbid0IGhpZGRlblxuICAgIC8vIGJlaGluZCBhIHN0YWxlIGZpbHRlci5cbiAgICBpZiAoc2VhcmNoUXVlcnkpIGNsb3NlRmluZCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ1NlbnQnKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIC8vIEJ1ZyAjMjogZmVlZGJhY2sncyBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LlxuICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgIXBhcmVudC5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChwYXJlbnQgYXMgU2VsZWN0b3JNZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgY29tcG9zZXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGFzeW5jIChlKSA9PiB7XG4gICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGhhbmRsZWQgPSBhd2FpdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyKCk7XG4gICAgICBpZiAoIWhhbmRsZWQpIHNlbmRGZWVkYmFjaygpO1xuICAgIH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnICYmIGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZUNvbXBvc2VyTWV0ZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdCA9IGNvbXBvc2VyLnZhbHVlO1xuICAgIGNvbXBXb3Jkcy50ZXh0Q29udGVudCA9IFN0cmluZyh3b3JkQ291bnQodCkpO1xuICAgIGNvbXBUb2tlbnMudGV4dENvbnRlbnQgPSBTdHJpbmcodG9rZW5Db3VudCh0KSk7XG4gICAgY29tcG9zZXIuY2xhc3NMaXN0LnRvZ2dsZSgnY21kLW1vZGUnLCAvXj4vLnRlc3QodC50cmltKCkpKTtcbiAgfTtcbiAgY29tcG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB1cGRhdGVDb21wb3Nlck1ldGVyKTtcblxuICAvLyDilIDilIAgSGVhZGVyIHNlYXJjaCDihpIgY29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBUaGUgaGVhZGVyIHNlYXJjaCBhZmZvcmRhbmNlIG5vIGxvbmdlciBydW5zIGl0cyBvd24gZmlsdGVyOyBjbGlja2luZyBvclxuICAvLyBmb2N1c2luZyBpdCBvcGVucyB0aGUgQ21kK0sgY29tbWFuZCBwYWxldHRlICh3aGljaCBzZWFyY2hlcyBjYXB0dXJlcyBBTkRcbiAgLy8gcnVucyBjb21tYW5kcykuIEl0J3MgYSByZWFkb25seSB0cmlnZ2VyLCBzbyB3ZSBqdXN0IG9wZW4gdGhlIHBhbGV0dGUgYW5kXG4gIC8vIGRyb3AgZm9jdXMgc28gdGhlIHBhbGV0dGUgaW5wdXQgdGFrZXMgb3ZlciBjbGVhbmx5LlxuICBjb25zdCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2ggPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYWxldHRlLmhpZGRlbikgcmV0dXJuO1xuICAgIG9wZW5QYWxldHRlKCk7XG4gICAgc2VhcmNoLmJsdXIoKTtcbiAgfTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKCk7IH1cbiAgfSk7XG5cbiAgLy8g4pSA4pSAIEN0cmwrRiB2aXN1YWwgZmluZCAoaW4tbGlzdCBmaWx0ZXIgKyBoaWdobGlnaHQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzY3JvbGxGaXJzdEZpbmRIaXRJbnRvVmlldyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm47XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZy5zZWxlY3Rvci5zZWFyY2gtaGl0Jyk7XG4gICAgICBpZiAoZmlyc3RIaXQpIHtcbiAgICAgICAgY2VudGVyRWxlbWVudEluTGlzdChmaXJzdEhpdCk7XG4gICAgICAgIGNvbnN0IG1rID0gZmlyc3RIaXQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ21hcmsnKTtcbiAgICAgICAgaWYgKG1rKSBjZW50ZXJFbGVtZW50SW5MaXN0KG1rKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TWF0Y2ggPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnIG1hcmsnKTtcbiAgICAgICAgaWYgKGZpcnN0TWF0Y2gpIGNlbnRlckVsZW1lbnRJbkxpc3QoZmlyc3RNYXRjaCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUZpbmRDb3VudCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWZpbmRDb3VudCkgcmV0dXJuO1xuICAgIGZpbmRDb3VudC50ZXh0Q29udGVudCA9IHNlYXJjaFF1ZXJ5ID8gYCR7bGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnJykubGVuZ3RofSBtYXRjaGAgOiAnJztcbiAgfTtcbiAgY29uc3QgYXBwbHlGaW5kID0gKHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBzZWFyY2hRdWVyeSA9IHZhbHVlLnRyaW0oKTtcbiAgICByZW5kZXIoKTtcbiAgICB1cGRhdGVGaW5kQ291bnQoKTtcbiAgICBzY3JvbGxGaXJzdEZpbmRIaXRJbnRvVmlldygpO1xuICB9O1xuICBjb25zdCBvcGVuRmluZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWZpbmRCYXIgfHwgIWZpbmRJbnB1dCkgcmV0dXJuO1xuICAgIGZpbmRCYXIuaGlkZGVuID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsJyk/LmNsYXNzTGlzdC5hZGQoJ2ZpbmQtb3BlbicpO1xuICAgIGZpbmRJbnB1dC5mb2N1cygpO1xuICAgIGZpbmRJbnB1dC5zZWxlY3QoKTtcbiAgfTtcbiAgY29uc3QgY2xvc2VGaW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChmaW5kQmFyKSBmaW5kQmFyLmhpZGRlbiA9IHRydWU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsJyk/LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbmQtb3BlbicpO1xuICAgIGlmIChmaW5kSW5wdXQpIGZpbmRJbnB1dC52YWx1ZSA9ICcnO1xuICAgIGlmIChzZWFyY2hRdWVyeSkgeyBzZWFyY2hRdWVyeSA9ICcnOyByZW5kZXIoKTsgfVxuICAgIHVwZGF0ZUZpbmRDb3VudCgpO1xuICB9O1xuICBmaW5kSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gYXBwbHlGaW5kKGZpbmRJbnB1dC52YWx1ZSkpO1xuICBmaW5kSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4geyBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7IGUucHJldmVudERlZmF1bHQoKTsgY2xvc2VGaW5kKCk7IH0gfSk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpbmQtY2xlYXJdJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VGaW5kKTtcblxuICBjb25zdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IG0gPSAvXj5cXHMqKC4rKSQvLmV4ZWMoY29tcG9zZXIudmFsdWUudHJpbSgpKTtcbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBzZWwgPSBtWzFdIS50cmltKCk7XG4gICAgaWYgKCFzZWwpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW59Pih7a2luZDogJ21hbnVhbC1jYXB0dXJlJywgc2VsZWN0b3I6IHNlbH0pO1xuICAgIGlmIChyZXBseT8ub2spIHsgY29tcG9zZXIudmFsdWUgPSAnJzsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyBzZXRTdGF0dXMoJ0NhcHR1cmVkICcgKyBzZWwpOyB9XG4gICAgZWxzZSBzZXRTdGF0dXMoJ1NlbGVjdG9yIGRpZCBub3QgbWF0Y2g6ICcgKyBzZWwsIHtraW5kOiAnd2Fybid9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0IGJ1aWxkZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyB2MiBleHBvcnQgc2hhcGU6IHRvcCBsZXZlbCBrZWVwcyB1c2VyLWZhY2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHNcbiAgLy8gKHVpZCwgbiwgc2VsZWN0b3IsIHRleHQsIHJvbGUsIGF0dHJzLCBoaW50cywgY2xhc3Nlcywgc3R5bGVzLCBjb21wb25lbnQsXG4gIC8vIHN0YXRlcywgc2NyZWVuc2hvdCwgZ3JvdXApLiBEaWFnbm9zdGljIC8gZGV0ZWN0aW9uIG1ldGFkYXRhIG1vdmVzIHVuZGVyXG4gIC8vIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBpblNoYWRvd0RPTSxcbiAgLy8gcHNldWRvRWxlbWVudHMsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBUaGUgdmVyc2lvbiBtYXJrZXIgaXMgZW1pdHRlZFxuICAvLyBhcyBgdjogMmAuIEltcG9ydGVycyBkZXRlY3QgZWl0aGVyIHYxIChmbGF0KSBvciB2MiBhbmQgZGVub3JtYWxpemUuXG4gIC8vXG4gIC8vIEFnZ3Jlc3NpdmUgbWluaWZ5IGFkZGl0aW9uYWxseSBkcm9wcyBmaWVsZHMgdGhlIHNlbGVjdG9yIGFscmVhZHlcbiAgLy8gaW1wbGllczogYW5jZXN0b3JzLCB2aWV3cG9ydCAob25lIHBlciBwYWdlKSwgY29tcG9uZW50Um9vdCB3aGVuXG4gIC8vIHJlZHVuZGFudCB3aXRoIHRoZSBzZWxlY3RvciwgYW5kIHBzZXVkb0VsZW1lbnRzLlxuICBjb25zdCBzbGltRW50cnkgPSAoZTogRW50cnksIG9wdHM6IHtpbmNsdWRlR3JvdXA/OiBib29sZWFuOyBldmVudEluZGV4PzogbnVtYmVyOyB2aXN1YWxPcmRlcj86IG51bWJlcjsgZ3JvdXBVaWQ/OiBzdHJpbmd9ID0ge30pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0+IHtcbiAgICBjb25zdCBpbmNsdWRlT3V0ZXIgPSBwcmVmcy5pbmNsdWRlT3V0ZXJIVE1MO1xuICAgIGNvbnN0IGluY2x1ZGVNYXRjaGVkID0gcHJlZnMuaW5jbHVkZU1hdGNoZWRSdWxlcztcbiAgICBjb25zdCBpbmNsdWRlU3R5bGVzID0gcHJlZnMuaW5jbHVkZVN0eWxlcztcbiAgICBjb25zdCBtaW5pZnkgPSBwcmVmcy5taW5pZnk7XG5cbiAgICAvLyBUb3AtbGV2ZWwgdXNlci1mYWNpbmcgZmllbGRzLiBPcmRlciBtYXR0ZXJzIGZvciBvdXRwdXQgcmVhZGFiaWxpdHkg4oCUXG4gICAgLy8gd2Ugd2FudCBgdiAvIHR5cGUgLyB1aWQgLyBuIC8gc2VsZWN0b3JgIGZpcnN0IHNvIEpTT05MIGlzIGdyZXBwYWJsZS5cbiAgICAvL1xuICAgIC8vIGBuYCBzdGF5cyBhcyB0aGUgY2FwdHVyZS1zZXF1ZW5jZSBkaXNwbGF5IGxhYmVsIGZvciBiYWNrd2FyZHNcbiAgICAvLyBjb21wYXRpYmlsaXR5IHdpdGggdjEvdjIgcmVhZGVycyAoYW5kIHRoZSBzaWRlYmFyJ3MgXCIjM1wiIGNoaXBzKS5cbiAgICAvLyBUaGUgZGlzYW1iaWd1YXRlZCBjb3VzaW5zIChgY2FwdHVyZUluZGV4YCwgYGV2ZW50SW5kZXhgLFxuICAgIC8vIGB2aXN1YWxPcmRlcmAsIGBkaXNwbGF5TGFiZWxgKSBsaXZlIG9uIHRoZSByb3cgc28gYSBkb3duc3RyZWFtXG4gICAgLy8gYWdlbnQgY2FuIHBpY2sgd2hpY2hldmVyIG9yZGVyaW5nIGlzIG1lYW5pbmdmdWwg4oCUIGJ1ZyAjMTAuXG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgdjogMixcbiAgICAgIHR5cGU6ICdzZWxlY3RvcicsXG4gICAgICB1aWQ6IGUudWlkLFxuICAgICAgbjogZS5uLFxuICAgICAgdHM6IGUudHMsXG4gICAgICB1cmw6IGUudXJsLFxuICAgICAgdGFnOiBlLnRhZyxcbiAgICAgIHNlbGVjdG9yOiBlLnNlbGVjdG9yLFxuICAgICAgY2FwdHVyZUluZGV4OiBlLm4sXG4gICAgICBkaXNwbGF5TGFiZWw6IFN0cmluZyhlLm4pLFxuICAgIH07XG4gICAgaWYgKG9wdHMuZXZlbnRJbmRleCAhPT0gdW5kZWZpbmVkKSBvdXQuZXZlbnRJbmRleCA9IG9wdHMuZXZlbnRJbmRleDtcbiAgICBpZiAob3B0cy52aXN1YWxPcmRlciAhPT0gdW5kZWZpbmVkKSBvdXQudmlzdWFsT3JkZXIgPSBvcHRzLnZpc3VhbE9yZGVyO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLnRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnRleHQgPSBtaW5pZnkgPyBlLnRleHQucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUudGV4dDtcbiAgICBpZiAoZS5yb2xlICE9PSB1bmRlZmluZWQpIG91dC5yb2xlID0gZS5yb2xlO1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IG1pbmlmeSA/IGUuYWNjZXNzaWJsZU5hbWUucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgaWYgKGUuaWQgIT09IHVuZGVmaW5lZCkgb3V0LmlkID0gZS5pZDtcbiAgICBpZiAoZS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgb3V0LnRlc3RJZCA9IGUudGVzdElkO1xuICAgIGlmIChlLmNsYXNzZXMgJiYgZS5jbGFzc2VzLmxlbmd0aCkge1xuICAgICAgb3V0LmNsYXNzZXMgPSAobWluaWZ5ICYmIGUuY2xhc3Nlcy5sZW5ndGggPiA4KSA/IGUuY2xhc3Nlcy5zbGljZSgwLCA4KSA6IGUuY2xhc3NlcztcbiAgICB9XG4gICAgaWYgKGUuYXR0cnMgJiYgT2JqZWN0LmtleXMoZS5hdHRycykubGVuZ3RoKSBvdXQuYXR0cnMgPSBlLmF0dHJzO1xuICAgIGlmIChlLmhpbnRzICYmIE9iamVjdC5rZXlzKGUuaGludHMpLmxlbmd0aCkgb3V0LmhpbnRzID0gZS5oaW50cztcbiAgICBpZiAoZS5yZWN0KSBvdXQucmVjdCA9IGUucmVjdDtcbiAgICBpZiAoZS5zdGF0ZXMgJiYgZS5zdGF0ZXMubGVuZ3RoKSBvdXQuc3RhdGVzID0gZS5zdGF0ZXM7XG4gICAgaWYgKGUuY29tcG9uZW50KSBvdXQuY29tcG9uZW50ID0gZS5jb21wb25lbnQ7XG4gICAgLy8gTG9jYXRvci1xdWFsaXR5IGZpZWxkLiBQcm9tb3RlIGV2ZW4gd2hlbiBtaW5pZmllZCDigJQgaXQncyBhIHNpbmdsZVxuICAgIC8vIHNtYWxsIGludCBhbmQgYSBkb3duc3RyZWFtIGFnZW50IHVzZXMgaXQgdG8gZGVjaWRlIHdoZXRoZXIgdG9cbiAgICAvLyB0cnVzdCB0aGUgc2VsZWN0b3IuXG4gICAgaWYgKGUuc2VsZWN0b3JNYXRjaENvdW50ICE9PSB1bmRlZmluZWQpIG91dC5zZWxlY3Rvck1hdGNoQ291bnQgPSBlLnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgICBpZiAoZS5hMTF5KSBvdXQuYTExeSA9IGUuYTExeTtcbiAgICBpZiAoZS5hc3NldHMgJiYgZS5hc3NldHMubGVuZ3RoKSBvdXQuYXNzZXRzID0gZS5hc3NldHM7XG4gICAgaWYgKGUubGF5b3V0Q29udGV4dCAmJiBlLmxheW91dENvbnRleHQubGVuZ3RoKSBvdXQubGF5b3V0Q29udGV4dCA9IGUubGF5b3V0Q29udGV4dDtcbiAgICBpZiAoaW5jbHVkZU91dGVyICYmIGUub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG91dC5vdXRlckhUTUwgPSBtaW5pZnkgPyBlLm91dGVySFRNTC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5vdXRlckhUTUw7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlU3R5bGVzICYmIGUuc3R5bGVzICYmIE9iamVjdC5rZXlzKGUuc3R5bGVzKS5sZW5ndGgpIG91dC5zdHlsZXMgPSBlLnN0eWxlcztcbiAgICBpZiAoZS5zY3JlZW5zaG90KSB7XG4gICAgICAvLyBQYXRoIG5vcm1hbGl6YXRpb246IHRoZSBsaXZlIGBlbnRyeS5zY3JlZW5zaG90LmVsZW1lbnRgIGNhcnJpZXMgYVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeGVkIHBhdGggKGUuZy4gYGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZ2ApXG4gICAgICAvLyBiZWNhdXNlIHRoZSBiYWNrZ3JvdW5kJ3MgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBBUEkgc3RhbXBzXG4gICAgICAvLyB0aGUgd29ya3NwYWNlIGludG8gdGhlIG9uLWRpc2sgcGF0aC4gQnV0IHRoZSAudGFyLnpzdCBhcmNoaXZlXG4gICAgICAvLyBidW5kbGVzIHNjcmVlbnNob3RzIGZsYXQgYXQgYHNjcmVlbnNob3RzL2Zvby5wbmdgLCBzbyB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXggd291bGQgcmVzb2x2ZSB0byBub3RoaW5nIGZvciBhbiBhZ2VudCB0aGF0XG4gICAgICAvLyBleHRyYWN0ZWQgdGhlIGFyY2hpdmUuIFN0cmlwIHRoZSB3b3Jrc3BhY2UgcHJlZml4IG9uIGVtaXQgc29cbiAgICAgIC8vIGV2ZXJ5IHBhdGggaXMgdmFsaWQgcmVsYXRpdmUgdG8gdGhlIG1hbmlmZXN0J3MgZGVjbGFyZWRcbiAgICAgIC8vIGBwYXRoUm9vdGAgKGFyY2hpdmUgcm9vdCBmb3IgdGFyLnpzdDsgd29ya3NwYWNlIHJvb3QgZm9yIHBsYWluXG4gICAgICAvLyBKU09OTCDigJQgaS5lLiwgYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgY29uc3Qgc3RyaXBXcyA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBpZiAoIXApIHJldHVybiBwO1xuICAgICAgICAvLyBTdHJpcCBleGFjdGx5IG9uZSBsZWFkaW5nIGA8d29ya3NwYWNlPi9gIHNlZ21lbnQgaWYgcHJlc2VudC5cbiAgICAgICAgY29uc3Qgd3NQcmVmaXggPSBgJHthY3RpdmVXc30vYDtcbiAgICAgICAgcmV0dXJuIHAuc3RhcnRzV2l0aCh3c1ByZWZpeCkgPyBwLnNsaWNlKHdzUHJlZml4Lmxlbmd0aCkgOiBwO1xuICAgICAgfTtcbiAgICAgIG91dC5zY3JlZW5zaG90ID0gey4uLmUuc2NyZWVuc2hvdH07XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZWxlbWVudCkgb3V0LnNjcmVlbnNob3QuZWxlbWVudCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZWxlbWVudCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZ3JvdXApIG91dC5zY3JlZW5zaG90Lmdyb3VwID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5ncm91cCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QucGFnZSkgb3V0LnNjcmVlbnNob3QucGFnZSA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QucGFnZSk7XG4gICAgfVxuICAgIC8vIFByb21vdGUgcnVudGltZS9iZWhhdmlvciBzaWduYWxzIHRvIHRvcC1sZXZlbC4gVGhlc2UgYXJlIHByaW1hcnlcbiAgICAvLyBzaWduYWwgZm9yIHRyaWFnZSAoZXZlbnRzIHRlbGxzIFwid2hpY2ggaGFuZGxlciByYW5cIiwgYmVoYXZpb3JBdHRyc1xuICAgIC8vIHRlbGxzIFwid2hhdCBzZXJ2ZXItcmVuZGVyZWQgYmluZGluZyBkb2VzIHRoaXMgZmlyZVwiLCBjYW52YXNDbGlja1xuICAgIC8vIHRlbGxzIFwid2hlcmUgb24gdGhlIGNoYXJ0IHdhcyBjbGlja2VkXCIsIGVkaXRvciB0ZWxscyBcIndoaWNoXG4gICAgLy8gcmljaC10ZXh0IGxpYnJhcnkgd3JhcHMgdGhpc1wiLCBkb21NdXRhdGlvbnMgdGVsbHMgXCJ3aGF0IGNoYW5nZWRcbiAgICAvLyBiZWZvcmUgdGhlIGNsaWNrXCIsIGlzQW5pbWF0aW5nIHdhcm5zIGFib3V0IHRyYW5zaWVudCBzdGF0ZSkuXG4gICAgaWYgKGUuZXZlbnRzICYmIE9iamVjdC5rZXlzKGUuZXZlbnRzKS5sZW5ndGgpIG91dC5ldmVudHMgPSBlLmV2ZW50cztcbiAgICBpZiAoZS5iZWhhdmlvckF0dHJzICYmIE9iamVjdC5rZXlzKGUuYmVoYXZpb3JBdHRycykubGVuZ3RoKSBvdXQuYmVoYXZpb3JBdHRycyA9IGUuYmVoYXZpb3JBdHRycztcbiAgICBpZiAoZS5jYW52YXNDbGljaykgb3V0LmNhbnZhc0NsaWNrID0gZS5jYW52YXNDbGljaztcbiAgICBpZiAoZS5lZGl0b3IpIG91dC5lZGl0b3IgPSBlLmVkaXRvcjtcbiAgICBpZiAoZS5pc0FuaW1hdGluZykgb3V0LmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICBpZiAoZS5zaGFkb3dIb3N0KSBvdXQuc2hhZG93SG9zdCA9IGUuc2hhZG93SG9zdDtcbiAgICBpZiAoZS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnJlbmRlcmVkVGV4dCA9IGUucmVuZGVyZWRUZXh0O1xuICAgIGlmIChlLnRydW5jYXRlZCAmJiBPYmplY3Qua2V5cyhlLnRydW5jYXRlZCkubGVuZ3RoKSBvdXQudHJ1bmNhdGVkID0gZS50cnVuY2F0ZWQ7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUuZG9tTXV0YXRpb25zICYmIGUuZG9tTXV0YXRpb25zLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGUuZG9tTXV0YXRpb25zO1xuXG4gICAgLy8gX2F1ZGl0OiBkZXRlY3Rpb24gY2hhaW4gJiBkaWFnbm9zdGljIHNoYXBlLlxuICAgIC8vIFJFQURNRSBjbGFpbWVkIGBfYXVkaXQuYW5jZXN0b3JzYCBhbmQgYF9hdWRpdC5jb21wb25lbnRSb290YCB3ZXJlXG4gICAgLy8gYWx3YXlzIHByZXNlbnQsIGJ1dCB0aGUgc2xpbSBlbWl0IGRyb3BwZWQgdGhlbSB3aGVuZXZlclxuICAgIC8vIGBtaW5pZnk6IHRydWVgLiBUaGUgZml4OiBlbWl0IGV2ZXJ5IGRlY2xhcmVkIGBfYXVkaXRgIGZpZWxkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHNvdXJjZSBkYXRhIGV4aXN0cywgYW5kIGxldFxuICAgIC8vIGBtaW5pZnlgIHNsaW0gT05MWSB0aGUgaGlnaC12b2x1bWUgYmxvY2tzIChtYXRjaGVkUnVsZXMsXG4gICAgLy8gcHNldWRvRWxlbWVudHMpLiBTbWFsbCBzdHJ1Y3R1cmFsIG1ldGFkYXRhIChhbmNlc3RvcnMsXG4gICAgLy8gY29tcG9uZW50Um9vdCwgdmlld3BvcnQpIHN1cnZpdmVzIG1pbmlmeSBzbyB0aGUgc2NoZW1hIGNsYWltc1xuICAgIC8vIHN0YXkgaG9uZXN0LlxuICAgIGNvbnN0IGF1ZGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGUuYW5jZXN0b3JzICYmIGUuYW5jZXN0b3JzLmxlbmd0aCkgYXVkaXQuYW5jZXN0b3JzID0gZS5hbmNlc3RvcnM7XG4gICAgaWYgKGUuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBhdWRpdC5jb21wb25lbnRSb290ID0gZS5jb21wb25lbnRSb290O1xuICAgIGlmIChlLmluU2hhZG93RE9NKSBhdWRpdC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgaWYgKGUucHNldWRvRWxlbWVudHMgJiYgT2JqZWN0LmtleXMoZS5wc2V1ZG9FbGVtZW50cykubGVuZ3RoICYmICFtaW5pZnkpIGF1ZGl0LnBzZXVkb0VsZW1lbnRzID0gZS5wc2V1ZG9FbGVtZW50cztcbiAgICBpZiAoaW5jbHVkZU1hdGNoZWQgJiYgZS5tYXRjaGVkUnVsZXMgJiYgZS5tYXRjaGVkUnVsZXMubGVuZ3RoKSB7XG4gICAgICBhdWRpdC5tYXRjaGVkUnVsZXMgPSBtaW5pZnlcbiAgICAgICAgPyBlLm1hdGNoZWRSdWxlcy5tYXAoKHIpID0+IHtcbiAgICAgICAgICBjb25zdCByMjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtzZWxlY3Rvcjogci5zZWxlY3Rvcn07XG4gICAgICAgICAgaWYgKHIuZGVjbGFyYXRpb25zICYmIE9iamVjdC5rZXlzKHIuZGVjbGFyYXRpb25zKS5sZW5ndGgpIHIyLmRlY2xhcmF0aW9ucyA9IHIuZGVjbGFyYXRpb25zO1xuICAgICAgICAgIGlmIChyLm1lZGlhKSByMi5tZWRpYSA9IHIubWVkaWE7XG4gICAgICAgICAgcmV0dXJuIHIyO1xuICAgICAgICB9KVxuICAgICAgICA6IGUubWF0Y2hlZFJ1bGVzO1xuICAgIH1cbiAgICBpZiAoZS52aWV3cG9ydCkgYXVkaXQudmlld3BvcnQgPSBlLnZpZXdwb3J0O1xuICAgIGlmIChPYmplY3Qua2V5cyhhdWRpdCkubGVuZ3RoKSBvdXQuX2F1ZGl0ID0gYXVkaXQ7XG5cbiAgICAvLyBHcm91cCBoZWFkIGxpbmthZ2UuIFByZXZpb3VzbHkgdGhlIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgXG4gICAgLy8gY2FycmllZCBmdWxsIG5lc3RlZCBlbnRyeSBvYmplY3RzLlxuICAgIC8vIFRoYXQgbWFkZSBEdWNrREIgam9pbnMgdWdseSBhbmQgYnJva2UgdGhlIHJ1bGUgdGhhdCBldmVyeVxuICAgIC8vIHNlbGVjdG9yIHNob3VsZCBiZSBhIHRvcC1sZXZlbCByb3cuIFdlIG5vdyBlbWl0OlxuICAgIC8vICAg4oCiIG9uIHRoZSBncm91cCBoZWFkOiBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlkLCB1aWQsIC4uLl1gIChqdXN0IElEcylcbiAgICAvLyAgIOKAoiBlYWNoIG1lbWJlciBhcyBpdHMgb3duIHRvcC1sZXZlbCBzbGltIHJvdyB3aXRoIGBncm91cFVpZGBcbiAgICAvLyAgICAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZCAoaGFuZGxlZCBpbiBgYnVpbGRTbGltYCBmbHVzaCBsb2dpYykuXG4gICAgaWYgKG9wdHMuaW5jbHVkZUdyb3VwICYmIGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgIG91dC5ncm91cE1lbWJlclVpZHMgPSBlLmdyb3VwLm1hcCgoZykgPT4gZy51aWQpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG4gICAgaWYgKG9wdHMuZ3JvdXBVaWQpIG91dC5ncm91cFVpZCA9IG9wdHMuZ3JvdXBVaWQ7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICAvLyDilIDilIDilIAgU2hhcmVkIFwic2xpbSBkYXRhXCIgcGlwZWxpbmUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEpTT05MIHJlbmRlcnMgb2ZmIHRoaXMgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uLiAoTWFya2Rvd24gdXNlZCB0b1xuICAvLyBzaGFyZSBpdDsgdGhlIE1hcmtkb3duIGV4cG9ydCB3YXMgcmV0aXJlZCBpbiBmYXZvciBvZiBKU09OTC1vbmx5LilcbiAgLy9cbiAgLy8gdjIgZGlmZmVyZW5jZXMgdnMgdjE6XG4gIC8vICAg4oCiIFNlbGVjdG9yIGxpbmVzIGhhdmUgZXhwbGljaXQgYHR5cGU6ICdzZWxlY3RvcidgIGFuZCBgdjogMmAuXG4gIC8vICAg4oCiIF9hdWRpdCBuZXN0cyBkZXRlY3Rpb24gLyBkZWJ1ZyBmaWVsZHMgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwg4oCmKS5cbiAgLy8gICDigKIgRmVlZGJhY2sgZW1pdHMgYXMgc3RhbmRhbG9uZSBge3R5cGU6J2ZlZWRiYWNrJywgcGFyZW50VWlkLCDigKZ9YCBsaW5lc1xuICAvLyAgICAgUExVUyBidW5kbGVkIGBmZWVkYmFja2AgYXJyYXlzIG9uIHNlbGVjdG9ycyAoc28gb2xkIHNpbmdsZS1saW5lXG4gIC8vICAgICByZWFkZXJzIHN0aWxsIHNlZSB0aGVtIGFkamFjZW50KS5cbiAgLy8gICDigKIgQSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgY2FycmllcyB3b3Jrc3BhY2UgKyBjb3VudHMgKyBmaWxlbmFtZS5cbiAgdHlwZSBTbGltUGFnZSA9IHt2OiAyOyB0eXBlOiAncGFnZSc7IHRzOiBzdHJpbmc7IHVybDogc3RyaW5nOyB0aXRsZT86IHN0cmluZzsgdmlld3BvcnQ/OiBWaWV3cG9ydDsgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgdXNlckFnZW50Pzogc3RyaW5nOyBsYW5nPzogc3RyaW5nOyBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307IHJvdXRlPzogYW55OyBzdGF0ZT86IGFueTsgc2Vzc2lvbklkPzogc3RyaW5nOyBzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH07XG4gIC8vIFNldmVyaXR5IHdhcyByZW1vdmVkIGZyb20gdGhlIFVJICgyMDI2LTA1KS4gVG9sZXJhbnQgcmVhZGVycyBtYXkgc3RpbGxcbiAgLy8gc2VlIGBzZXZlcml0eWAgb24gbGVnYWN5IEpTT05MIOKAlCBkZW5vcm1hbGl6ZUVudHJ5IHByZXNlcnZlcyBpdCBvblxuICAvLyBGZWVkYmFja01lc3NhZ2Ugc28gcmUtZXhwb3J0IHJvdW5kLXRyaXBzLCBidXQgbmV3IHNlc3Npb25zIG5ldmVyIHNldFxuICAvLyBpdCBhbmQgd2UgZG9uJ3QgZW1pdCBpdCBoZXJlLiBLZWVwIHRoZSBmaWVsZCBvZmYgU2xpbUZlZWRiYWNrIHNvIG5ld1xuICAvLyBleHBvcnRzIHN0YXkgY2xlYW4uXG4gIC8vIGB0YWdzYCBpcyBhbHdheXMgZW1pdHRlZCAoZGVmYXVsdCBlbXB0eSBhcnJheSkgc28gRHVja0RCIHNjaGVtYVxuICAvLyBpbmZlcmVuY2UgYWx3YXlzIHNlZXMgdGhlIGNvbHVtbi5cbiAgdHlwZSBTbGltRmVlZGJhY2sgPSB7djogMjsgdHlwZTogJ2ZlZWRiYWNrJzsgdWlkOiBzdHJpbmc7IHRzOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nOyBkZXRhY2hlZD86IGJvb2xlYW47IHRhZ3M6IHN0cmluZ1tdOyBpc1Rlc3REYXRhPzogYm9vbGVhbjsgc3VnZ2VzdGVkU2tpbGxzPzogQXJyYXk8e3NraWxsOiBzdHJpbmc7IGxvY2F0b3I6IHN0cmluZ30+fTtcbiAgLy8gQ2hlYXAgdGVzdC1kYXRhIHNuaWZmOiBtYXRjaGVzIHN0cmluZ3MgdGhlIHVzZXIgdHlwZXMgd2hpbGUgc21va2UtXG4gIC8vIHRlc3RpbmcgdGhlIGV4dGVuc2lvbiAoXCJ0ZXN0XCIsIFwiYXNkZlwiLCBcImZvb1wiLCBcImxvcmVtIGlwc3VtXCIsXG4gIC8vIFwicGxhY2Vob2xkZXJcIiwgb3IgYW55IHBocmFzZSBvYnZpb3VzbHkgc3R1YmJlZC1vdXQpLiBGYWxzZSBwb3NpdGl2ZXNcbiAgLy8gaGVyZSBhcmUgcmVjb3ZlcmFibGUg4oCUIHRoZSBjb25zdW1lciBjYW4gaWdub3JlIHRoZSBmbGFnIOKAlCBidXRcbiAgLy8gZXhjbHVkaW5nIHJlYWwgZmVlZGJhY2sgd291bGQgbm90IGJlLCBzbyB3ZSBrZWVwIHRoZSByZWdleCBuYXJyb3cuXG4gIGNvbnN0IFRFU1RfREFUQV9SRSA9IC9eKHRlc3R8YXNkZnxxd2VyfGZvb3xiYXJ8YmF6fGxvcmVtfHBsYWNlaG9sZGVyfHRvZG98eHszLH18aGVsbG8gd29ybGR8c2FtcGxlfGR1bW15fHNvbWV0aGluZ3xhbnl0aGluZ3xpZ25vcmUgbWV8d2lwfHRiZHxuXFwvYXxoaSlcXGIvaTtcbiAgY29uc3QgbG9va3NMaWtlVGVzdERhdGEgPSAodGV4dDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgdCA9IHRleHQudHJpbSgpO1xuICAgIGlmICghdCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChURVNUX0RBVEFfUkUudGVzdCh0KSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKC90ZXN0IGZlZWRiYWNrL2kudGVzdCh0KSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICB0eXBlIFNsaW1TZWxlY3RvciA9IFJlY29yZDxzdHJpbmcsIGFueT4gJiB7djogMjsgdHlwZTogJ3NlbGVjdG9yJzsgbjogbnVtYmVyOyBzZWxlY3Rvcjogc3RyaW5nOyBmZWVkYmFjaz86IHN0cmluZ1tdfTtcbiAgdHlwZSBTbGltTGluZSA9IFNsaW1QYWdlIHwgU2xpbUZlZWRiYWNrIHwgU2xpbVNlbGVjdG9yO1xuICBjb25zdCBidWlsZFNsaW0gPSAoKTogU2xpbUxpbmVbXSA9PiB7XG4gICAgY29uc3QgbGluZXM6IFNsaW1MaW5lW10gPSBbXTtcbiAgICAvLyBQcmUtY29tcHV0ZSB2aXN1YWxPcmRlciAodG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQpIGZvciBldmVyeVxuICAgIC8vIHNlbGVjdG9yIG1lc3NhZ2UuIFRoZSBwcmV2aW91cyBzaW5nbGUgYG5gIGZpZWxkIGNvbmZsYXRlZFxuICAgIC8vIGNhcHR1cmUgb3JkZXIsIEpTT05MIHN0cmVhbSBvcmRlcixcbiAgICAvLyB2aXN1YWwgb3JkZXIsIGFuZCBkaXNwbGF5IGxhYmVsLiBXZSBub3cgZW1pdCBmb3VyIG9ydGhvZ29uYWxcbiAgICAvLyBmaWVsZHMgYW5kIGRvY3VtZW50IGVhY2g6XG4gICAgLy8gICDigKIgZXZlbnRJbmRleCAgIOKAlCBtb25vdG9uaWMgcG9zaXRpb24gaW4gdGhlIEpTT05MIHN0cmVhbVxuICAgIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgdGhlIG9yaWdpbmFsIGBuYCAoY2FwdHVyZSBzZXF1ZW5jZSlcbiAgICAvLyAgIOKAoiB2aXN1YWxPcmRlciAg4oCUIHNvcnQgYnkgcmVjdC55IGFzYywgcmVjdC54IGFzY1xuICAgIC8vICAg4oCiIGRpc3BsYXlMYWJlbCDigJQgdGhlIGh1bWFuLWZhY2luZyBudW1iZXIgc2hvd24gaW4gdGhlIHNpZGViYXJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgKGN1cnJlbnRseSBtaXJyb3JzIGNhcHR1cmVJbmRleDsgY2FuIGRyaWZ0IGlmXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIHRoZSBzaWRlYmFyIGFkb3B0cyBhIGRpZmZlcmVudCBsYWJlbCBzY2hlbWUpLlxuICAgIGNvbnN0IHZpc3VhbFJhbmsgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGNvbnN0IHNlbHMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5zbGljZSgpXG4gICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhciA9IGEuZW50cnkucmVjdDsgY29uc3QgYnIgPSBiLmVudHJ5LnJlY3Q7XG4gICAgICAgIGlmICghYXIgfHwgIWJyKSByZXR1cm4gMDtcbiAgICAgICAgaWYgKGFyLnkgIT09IGJyLnkpIHJldHVybiBhci55IC0gYnIueTtcbiAgICAgICAgcmV0dXJuIGFyLnggLSBici54O1xuICAgICAgfSk7XG4gICAgc2Vscy5mb3JFYWNoKChtLCBpKSA9PiB2aXN1YWxSYW5rLnNldChtLmlkLCBpICsgMSkpO1xuICAgIGxldCBwZW5kaW5nU2VsOiBTZWxlY3Rvck1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICAvLyBXZSBjb2xsZWN0IGJvdGggdGhlIGJ1bmRsZWQgc3RyaW5nIGFycmF5IChmb3IgdjEtZnJpZW5kbHkgcmVhZGVycykgYW5kXG4gICAgLy8gdGhlIHJpY2ggb2JqZWN0cyAoZm9yIHYyIHN0YW5kYWxvbmUgbGluZXMpLlxuICAgIGxldCBwZW5kaW5nRmJTdHJpbmdzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBwZW5kaW5nRmJSaWNoOiBTbGltRmVlZGJhY2tbXSA9IFtdO1xuICAgIGNvbnN0IGZsdXNoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFwZW5kaW5nU2VsKSByZXR1cm47XG4gICAgICBjb25zdCBldmVudEluZGV4ID0gbGluZXMubGVuZ3RoICsgMTtcbiAgICAgIGNvbnN0IHZpc3VhbE9yZGVyID0gdmlzdWFsUmFuay5nZXQocGVuZGluZ1NlbC5pZCk7XG4gICAgICBjb25zdCBvdXQ6IGFueSA9IHNsaW1FbnRyeShwZW5kaW5nU2VsLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlLCBldmVudEluZGV4LCB2aXN1YWxPcmRlcn0pO1xuICAgICAgaWYgKHBlbmRpbmdGYlN0cmluZ3MubGVuZ3RoKSBvdXQuZmVlZGJhY2sgPSBbLi4ucGVuZGluZ0ZiU3RyaW5nc107XG4gICAgICBsaW5lcy5wdXNoKG91dCBhcyBTbGltTGluZSk7XG4gICAgICAvLyBHcm91cCBmbGF0bmVzcyAoYnVnICM5KS4gRW1pdCBlYWNoIGdyb3VwIG1lbWJlciBhcyBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2xpbSByb3cgcmlnaHQgYWZ0ZXIgdGhlIGhlYWQsIHdpdGggYGdyb3VwVWlkYFxuICAgICAgLy8gbGlua2luZyBiYWNrLiBUaGlzIGxldHMgRHVja0RCIC8gU1FMIHF1ZXJpZXMgdHJlYXQgZ3JvdXBcbiAgICAgIC8vIG1lbWJlcnMgYXMgZmlyc3QtY2xhc3Mgc2VsZWN0b3Igcm93cyB3aXRob3V0IGRlc2NlbmRpbmcgaW50b1xuICAgICAgLy8gbmVzdGVkIG9iamVjdHMuXG4gICAgICBjb25zdCBncm91cE1lbWJlcnMgPSBwZW5kaW5nU2VsLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgZm9yIChjb25zdCBtZW1iZXIgb2YgZ3JvdXBNZW1iZXJzKSB7XG4gICAgICAgIGNvbnN0IG1FdmVudCA9IGxpbmVzLmxlbmd0aCArIDE7XG4gICAgICAgIGNvbnN0IG1lbWJlclJvdzogYW55ID0gc2xpbUVudHJ5KG1lbWJlciwge2luY2x1ZGVHcm91cDogZmFsc2UsIGV2ZW50SW5kZXg6IG1FdmVudCwgZ3JvdXBVaWQ6IHBlbmRpbmdTZWwuZW50cnkudWlkfSk7XG4gICAgICAgIGxpbmVzLnB1c2gobWVtYmVyUm93IGFzIFNsaW1MaW5lKTtcbiAgICAgIH1cbiAgICAgIC8vIEVtaXQgZWFjaCBzdGFuZGFsb25lIGZlZWRiYWNrIGxpbmUgcmlnaHQgYWZ0ZXIgdGhlIHNlbGVjdG9yKHMpLlxuICAgICAgZm9yIChjb25zdCBmYiBvZiBwZW5kaW5nRmJSaWNoKSBsaW5lcy5wdXNoKGZiKTtcbiAgICAgIHBlbmRpbmdTZWwgPSBudWxsO1xuICAgICAgcGVuZGluZ0ZiU3RyaW5ncyA9IFtdO1xuICAgICAgcGVuZGluZ0ZiUmljaCA9IFtdO1xuICAgIH07XG4gICAgLy8gUmVvcmRlciBmb3IgZXhwb3J0IG9ubHkg4oCUIHNpZGViYXIga2VlcHMgY2FwdHVyZSBvcmRlciwgdGhlXG4gICAgLy8gZW1pdHRlZCBKU09OTCByZWFkcyB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCB3aXRoaW4gZWFjaCBwYWdlLlxuICAgIC8vIEZlZWRiYWNrIHJvd3Mgc3RheSBhdHRhY2hlZCB0byB0aGVpciBwcmVjZWRpbmcgc2VsZWN0b3IgdmlhIHRoZVxuICAgIC8vIGByZW9yZGVyRm9yRXhwb3J0YCBoZWxwZXIsIHNvIHRocmVhZGluZyBpcyBwcmVzZXJ2ZWQgdGhyb3VnaFxuICAgIC8vIHRoZSByZWFycmFuZ2VtZW50LlxuICAgIGNvbnN0IGV4cG9ydE9yZGVyZWQgPSByZW9yZGVyRm9yRXhwb3J0KG1lc3NhZ2VzKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgZXhwb3J0T3JkZXJlZCkge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgICAgIGNvbnN0IHNsaW06IFNsaW1QYWdlID0ge3Y6IDIsIHR5cGU6ICdwYWdlJywgdHM6IG0udHMsIHVybDogbS51cmx9O1xuICAgICAgICBpZiAobS50aXRsZSAhPT0gdW5kZWZpbmVkKSBzbGltLnRpdGxlID0gbS50aXRsZTtcbiAgICAgICAgaWYgKG0udmlld3BvcnQpIHNsaW0udmlld3BvcnQgPSBtLnZpZXdwb3J0O1xuICAgICAgICBpZiAoIXByZWZzLm1pbmlmeSAmJiBtLnRva2Vucykgc2xpbS50b2tlbnMgPSBtLnRva2VucztcbiAgICAgICAgaWYgKG0udXNlckFnZW50KSBzbGltLnVzZXJBZ2VudCA9IG0udXNlckFnZW50O1xuICAgICAgICBpZiAobS5sYW5nKSBzbGltLmxhbmcgPSBtLmxhbmc7XG4gICAgICAgIGlmIChtLmdpdENvbnRleHQpIHNsaW0uZ2l0Q29udGV4dCA9IG0uZ2l0Q29udGV4dDtcbiAgICAgICAgaWYgKG0ucm91dGUpIHNsaW0ucm91dGUgPSBtLnJvdXRlO1xuICAgICAgICBpZiAobS5zdGF0ZSkgc2xpbS5zdGF0ZSA9IG0uc3RhdGU7XG4gICAgICAgIGlmIChtLnNlc3Npb25JZCkgc2xpbS5zZXNzaW9uSWQgPSBtLnNlc3Npb25JZDtcbiAgICAgICAgLy8gRnVsbC1wYWdlIHNuYXBzaG90ICh2aWV3cG9ydCwgc2Nyb2xsIGV4dGVudHMsIGRwciwgbGFuZywgc2NyZWVuc2hvdClcbiAgICAgICAgLy8gY2FwdHVyZWQgZm9yIHRoaXMgVVJMLiBQYXJ0IG9mIHRoZSBleHBvcnQgZGVsaXZlcmFibGUgc28gYSBkb3duc3RyZWFtXG4gICAgICAgIC8vIGFnZW50IGhhcyB3aG9sZS1wYWdlIGNvbnRleHQsIG5vdCBqdXN0IGVsZW1lbnQgY3JvcHMuXG4gICAgICAgIGNvbnN0IHNuYXAgPSAobSBhcyBQYWdlTWVzc2FnZSAmIHtzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH0pLnNuYXBzaG90O1xuICAgICAgICBpZiAoc25hcCkgc2xpbS5zbmFwc2hvdCA9IHNuYXA7XG4gICAgICAgIGxpbmVzLnB1c2goc2xpbSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgeyBmbHVzaCgpOyBwZW5kaW5nU2VsID0gbTsgfVxuICAgICAgZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIC8vIEFsd2F5cyBpbmNsdWRlIGB0YWdzOiBbXWAgKGV2ZW4gd2hlbiBlbXB0eSkgc28gRHVja0RCJ3Mgc2NoZW1hXG4gICAgICAgIC8vIGluZmVyZW5jZSBwaWNrcyB0aGUgY29sdW1uIHVwLlxuICAgICAgICAvLyBgdWlkYCBpcyB0aGUgbWVzc2FnZSdzIHN0YWJsZSBpZDogUFJzIC8gcmVwYWlyIHJlcG9ydHMgbmVlZFxuICAgICAgICAvLyBhIHN0YWJsZSBwZXItZmVlZGJhY2sgaGFuZGxlLCBub3QganVzdCBwYXJlbnRVaWQuXG4gICAgICAgIGNvbnN0IHJpY2g6IFNsaW1GZWVkYmFjayA9IHt2OiAyLCB0eXBlOiAnZmVlZGJhY2snLCB1aWQ6IG0uaWQsIHRzOiBtLnRzLCB0ZXh0OiBtLnRleHQsIHRhZ3M6IG0udGFncyA/PyBbXX07XG4gICAgICAgIC8vIChzZXZlcml0eSByZW1vdmVkIDIwMjYtMDUg4oCUIG9sZCBKU09OTHMgbWF5IHN0aWxsIGNvbnRhaW4gaXRcbiAgICAgICAgLy8gb24gdGhlIHJlYWQgc2lkZSwgYnV0IHdlIG5vIGxvbmdlciBlbWl0IGl0IG9uIHdyaXRlLilcbiAgICAgICAgLy8gSGV1cmlzdGljIGZsYWcgZm9yIHN0dWItbG9va2luZyBmZWVkYmFjayAoXCJ0ZXN0XCIsIFwiYXNkZlwiLCBcImZvb1wiLFxuICAgICAgICAvLyBcIkhvd2R5ICwgdGVzdCBmZWVkYmFjayBoZXJlXCIsIGV0YykuIExldHMgYSBkb3duc3RyZWFtIGNvbnN1bWVyXG4gICAgICAgIC8vIGZpbHRlciBwb2xsdXRpb24gZnJvbSByZWFsIGludGVudCB3aXRob3V0IG1hbnVhbCBjbGVhbnVwLlxuICAgICAgICBpZiAobG9va3NMaWtlVGVzdERhdGEobS50ZXh0KSkgcmljaC5pc1Rlc3REYXRhID0gdHJ1ZTtcbiAgICAgICAgLy8gQSBkZXRhY2hlZCBjb21tZW50IG5ldmVyIGFkb3B0cyB0aGUgcGVuZGluZyBzZWxlY3RvciB2aWFcbiAgICAgICAgLy8gYWRqYWNlbmN5IOKAlCB0aGUgdXNlciBleHBsaWNpdGx5IGRpc2Fzc29jaWF0ZWQgaXQuIFRoZSBmbGFnIGlzXG4gICAgICAgIC8vIGVtaXR0ZWQgc28gaW1wb3J0IHJvdW5kLXRyaXBzIGRvbid0IHJlLWFkb3B0IGJ5IGFkamFjZW5jeSBlaXRoZXIuXG4gICAgICAgIGlmIChtLmRldGFjaGVkKSByaWNoLmRldGFjaGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gSGV1cmlzdGljIHNraWxsIGxvY2F0b3JzIGZvciB0aGUgYWdlbnQncyBtYXAgcGhhc2UgKHZlcmlmaWVkIGFuZFxuICAgICAgICAvLyByZXdyaXR0ZW4gaW50byB3b3JrLW1hbmlmZXN0IG1hcHBlZF9za2lsbHMgYnkgdGhlIGNvbnN1bWVyKS5cbiAgICAgICAgcmljaC5zdWdnZXN0ZWRTa2lsbHMgPSBzdWdnZXN0U2tpbGxzRm9yKG0udGV4dCk7XG4gICAgICAgIGlmIChwZW5kaW5nU2VsICYmICFtLmRldGFjaGVkKSB7XG4gICAgICAgICAgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZCA/PyBwZW5kaW5nU2VsLmVudHJ5LnVpZDtcbiAgICAgICAgICBwZW5kaW5nRmJTdHJpbmdzLnB1c2gobS50ZXh0KTtcbiAgICAgICAgICBwZW5kaW5nRmJSaWNoLnB1c2gocmljaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG0ucGFyZW50VWlkKSByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkO1xuICAgICAgICAgIGxpbmVzLnB1c2gocmljaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2goKTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH07XG4gIC8vIEJ1aWxkIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgb2YgdGhlIEpTT05MIGV4cG9ydC4gVGhlXG4gIC8vIG1hbmlmZXN0IGNhcnJpZXMgdGhlIGV4cG9ydCBmaWxlbmFtZSArIHdvcmtzcGFjZSArIGhvc3QocykgKyBjb3VudHMgc29cbiAgLy8gYSBkb3duc3RyZWFtIExMTSBjYW4gcmVzeW5jIHRoZSBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSBhbmQgZ3JlcCBmb3JcbiAgLy8gZHVwbGljYXRlcyBhY3Jvc3MgZXhwb3J0cy5cbiAgY29uc3QgYnVpbGRNYW5pZmVzdCA9IChmaWxlbmFtZTogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSwgb3B0czoge25vd0lzbz86IHN0cmluZzsgYnVuZGxlSWQ/OiBzdHJpbmd9ID0ge30pOiBFeHBvcnRNYW5pZmVzdCA9PiB7XG4gICAgbGV0IG5TZWwgPSAwOyBsZXQgbkZiID0gMDsgbGV0IG5QZyA9IDA7XG4gICAgbGV0IG5Hcm91cE1lbWJlcnMgPSAwO1xuICAgIGxldCBuRmVlZGJhY2tCZWFyaW5nID0gMDtcbiAgICBsZXQgbk1pc3NpbmdTaG90ID0gMDtcbiAgICBsZXQgbkVsZW1lbnRTaG90cyA9IDA7XG4gICAgbGV0IG5Hcm91cFNob3RzID0gMDtcbiAgICBsZXQgblBhZ2VTaG90cyA9IDA7XG4gICAgbGV0IG5PcnBoYW5lZEZiID0gMDtcbiAgICBjb25zdCBzZWxlY3RvclVpZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgLy8gRmlyc3QgcGFzczogY29sbGVjdCB1aWRzICsgcGVyLXNlbGVjdG9yIGZlZWRiYWNrIHByZXNlbmNlLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICBuU2VsKys7XG4gICAgICAgIHNlbGVjdG9yVWlkcy5hZGQobS5lbnRyeS51aWQpO1xuICAgICAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBuR3JvdXBNZW1iZXJzICs9IG0uZW50cnkuZ3JvdXAubGVuZ3RoO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSBuRWxlbWVudFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSBuR3JvdXBTaG90cysrO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlKSBuUGFnZVNob3RzKys7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICBuRmIrKztcbiAgICAgICAgaWYgKG0ucGFyZW50VWlkKSBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmFkZChtLnBhcmVudFVpZCk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSBuUGcrKztcbiAgICB9XG4gICAgLy8gU2Vjb25kIHBhc3M6IGZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzICsgb3JwaGFuZWQgZmVlZGJhY2sgK1xuICAgIC8vIHNlbGVjdG9ycyB0aGF0IHNob3VsZCBoYXZlIGEgc2hvdCBidXQgZG9uJ3QuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InICYmIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuaGFzKG0uZW50cnkudWlkKSkge1xuICAgICAgICBuRmVlZGJhY2tCZWFyaW5nKys7XG4gICAgICAgIGlmICghbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50ICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSBuTWlzc2luZ1Nob3QrKztcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBmYlVpZCBvZiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yVWlkcy5oYXMoZmJVaWQpKSBuT3JwaGFuZWRGYisrO1xuICAgIH1cbiAgICBjb25zdCBub3dJc28gPSBvcHRzLm5vd0lzbyA/PyBleHBvcnROb3dJc28oKTtcbiAgICBjb25zdCBvdXQ6IEV4cG9ydE1hbmlmZXN0ID0ge1xuICAgICAgdjogMiwgdHlwZTogJ21hbmlmZXN0JywgdG9vbDogJ3BpbmNoZ3JhYicsXG4gICAgICB0czogbm93SXNvLFxuICAgICAgZ2VuZXJhdGVkOiBEYXRlLnBhcnNlKG5vd0lzbyksXG4gICAgICB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBmb3JtYXQsXG4gICAgICBob3N0czogZGlzdGluY3RIb3N0cygpLFxuICAgICAgY291bnRzOiB7XG4gICAgICAgIC8vIFRvdGFsIHNlbGVjdG9yIHJvd3MgdGhlIEpTT05MIHdpbGwgZW1pdCA9IHRvcC1sZXZlbCArIGZsYXRcbiAgICAgICAgLy8gZ3JvdXAgbWVtYmVycy4gVGhpcyBtYXRjaGVzIHdoYXQgYSBkb3duc3RyZWFtXG4gICAgICAgIC8vIGByZWFkX2pzb25fYXV0byguLi4pYCB3b3VsZCBzZWU7IHRoZSBwcmV2aW91cyBiZWhhdmlvciBvZlxuICAgICAgICAvLyByZXBvcnRpbmcgb25seSB0aGUgaW4tbWVtb3J5IHRvcC1sZXZlbCBjb3VudCBjb250cmFkaWN0ZWRcbiAgICAgICAgLy8gdGhlIGFjdHVhbCBzdHJlYW0uXG4gICAgICAgIHNlbGVjdG9yczogblNlbCArIG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIGZlZWRiYWNrOiBuRmIsXG4gICAgICAgIHBhZ2VzOiBuUGcsXG4gICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczogbkZlZWRiYWNrQmVhcmluZyxcbiAgICAgICAgZ3JvdXBNZW1iZXJzOiBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IG5FbGVtZW50U2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IG5Hcm91cFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IG5QYWdlU2hvdHMsXG4gICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiBuTWlzc2luZ1Nob3QsXG4gICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IG5PcnBoYW5lZEZiLFxuICAgICAgfSxcbiAgICAgIC8vIFNpbmdsZSBjYW5vbmljYWwgcmVzb2x1dGlvbiBydWxlLiBFdmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTFxuICAgICAgLy8gKHNjcmVlbnNob3QuZWxlbWVudC9ncm91cC9wYWdlKSBpcyByZWxhdGl2ZSB0byBgcGF0aFJvb3RgOlxuICAgICAgLy8gICDigKIgJ2FyY2hpdmUnOiBmb3IgdGFyLnpzdCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlXG4gICAgICAvLyAgICAgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdCAoZS5nLiBgc2NyZWVuc2hvdHMvZm9vLnBuZ2ApLlxuICAgICAgLy8gICDigKIgJ3dvcmtzcGFjZSc6IGZvciBwbGFpbiBKU09OTCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG9cbiAgICAgIC8vICAgICB0aGUgd29ya3NwYWNlIGRpciAoYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgLy8gUmVjZWl2ZXJzIG5vIGxvbmdlciBoYXZlIHRvIGd1ZXNzIHdoaWNoIHBhdGggc2hhcGUgYXBwbGllcy5cbiAgICAgIHBhdGhSb290OiBmb3JtYXQgPT09ICd0YXIuenN0JyA/ICdhcmNoaXZlJyA6ICd3b3Jrc3BhY2UnLFxuICAgIH07XG4gICAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5IChTSEEtMjU2IHByZWZpeCBvdmVyIHNsaW0gcm93cyArIHNjcmVlbnNob3RcbiAgICAvLyBuYW1lcykuIFNhbWUgY29udGVudCDihpIgc2FtZSBidW5kbGVJZCDihpIgZG93bnN0cmVhbSB+Ly5waW5jaGdyYWIgc3RhdGVcbiAgICAvLyBrZXlzIHN0YXkgc3RhYmxlIGFjcm9zcyByZS1leHBvcnRzLlxuICAgIGlmIChvcHRzLmJ1bmRsZUlkKSBvdXQuYnVuZGxlSWQgPSBvcHRzLmJ1bmRsZUlkO1xuICAgIC8vIEluZGlyZWN0aW9uIHBvaW50ZXJzIHNvIGEgZG93bnN0cmVhbSBhZ2VudCBrbm93cyB3aGljaCBVSSBza2lsbFxuICAgIC8vIG93bnMgdGhlIHRyaWFnZSBmbG93ICsgd2hpY2ggREVTSUdOLm1kIG93bnMgdGhlIHZpc3VhbCBpZGVudGl0eS5cbiAgICAvL1xuICAgIC8vIGBpbmxpbmU6IHRydWVgIGlzIHNldCBPTkxZIGZvciB0YXIuenN0IGV4cG9ydHMgKHdoZXJlIHRoZSAubWRcbiAgICAvLyBmaWxlcyBhcmUgcGh5c2ljYWxseSBidW5kbGVkIGludG8gdGhlIGFyY2hpdmUpLiBKU09OTC1vbmx5XG4gICAgLy8gZXhwb3J0cyBlbWl0IGBpbmxpbmU6IGZhbHNlYCBwbHVzIHRoZSByZWNlaXZlci1zaWRlIGBwYXRoYCBzb1xuICAgIC8vIGEgY29uc3VtZXIgcGFpcmVkIHdpdGggdGhlIHN0YW5kYWxvbmUgSlNPTkwgY2FuIHJlc29sdmUgdGhlXG4gICAgLy8gcmVmZXJlbmNlZCBmaWxlIG9mZiB0aGVpciBvd24gZmlsZXN5c3RlbS5cbiAgICAvL1xuICAgIC8vIGB0ZW1wbGF0ZTogdHJ1ZWAgZmxhZ3Mgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDigJQgdXNlZnVsXG4gICAgLy8gZm9yIHJlY2VpdmVycyB3aG8gd2FudCB0byBkaXN0aW5ndWlzaCBidW5kbGVkLWRlZmF1bHQgY29udGVudFxuICAgIC8vIGZyb20gdGhlIHVzZXIncyBhY3R1YWwgd29ya2luZyBub3Rlcy5cbiAgICBjb25zdCBpc1RhckJ1bmRsZSA9IGZvcm1hdCA9PT0gJ3Rhci56c3QnO1xuICAgIG91dC5za2lsbCA9IHtcbiAgICAgIG5hbWU6ICdQaW5jaEdyYWInLFxuICAgICAgcGF0aDogcHJlZnMuc2tpbGxQYXRoLFxuICAgICAgaW5saW5lOiBpc1RhckJ1bmRsZSxcbiAgICB9O1xuICAgIGlmIChpc1RhckJ1bmRsZSkgb3V0LnNraWxsLmFyY2hpdmVQYXRoID0gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCc7XG4gICAgaWYgKGlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpIG91dC5za2lsbC50ZW1wbGF0ZSA9IHRydWU7XG4gICAgZWxzZSBvdXQuc2tpbGwuY3VzdG9taXplZCA9IHRydWU7XG4gICAgb3V0LmRlc2lnbiA9IHtcbiAgICAgIHBhdGg6IHByZWZzLmRlc2lnblBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuZGVzaWduLmFyY2hpdmVQYXRoID0gJ0RFU0lHTi5tZCc7XG4gICAgaWYgKGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSBvdXQuZGVzaWduLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5kZXNpZ24uY3VzdG9taXplZCA9IHRydWU7XG5cbiAgICAvLyBTZWxmLXJvYXN0IGRpYWdub3N0aWNzLlxuICAgIGNvbnN0IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW10gPSBbXTtcbiAgICAvLyBGZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycyB3aXRoIG5vIHNjcmVlbnNob3QuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmICghZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSBjb250aW51ZTtcbiAgICAgIGlmICghbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50ICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0ZFRURCQUNLX1BBUkVOVF9NSVNTSU5HX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgJHttLmVudHJ5LnNlbGVjdG9yfSBjYXJyaWVzIGZlZWRiYWNrIGJ1dCBoYXMgbm8gZWxlbWVudC9ncm91cCBzY3JlZW5zaG90YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE9ycGhhbmVkIGZlZWRiYWNrIChwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlKS5cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgICAgY29kZTogJ09SUEhBTkVEX0ZFRURCQUNLJyxcbiAgICAgICAgICB1aWQ6IGZiVWlkLFxuICAgICAgICAgIGRldGFpbDogJ2ZlZWRiYWNrIHJvdyByZWZlcmVuY2VzIGEgcGFyZW50VWlkIHRoYXQgaGFzIG5vIG1hdGNoaW5nIHNlbGVjdG9yIGluIHRoaXMgYXJjaGl2ZScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBIb3Zlci1zdGF0ZSBjYXB0dXJlcyB1c3VhbGx5IG5lZWQgYSBiZWZvcmUvYWZ0ZXI7IGZsYWcgYW55IHdob3NlXG4gICAgLy8gc2NyZWVuc2hvdCBzdG9yeSBpcyBpbmNvbXBsZXRlIChidWcgIzE2IHBhcnRpYWwpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zdGF0ZXMgJiYgbS5lbnRyeS5zdGF0ZXMuaW5jbHVkZXMoJ2hvdmVyJykgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdIT1ZFUl9TVEFURV9OT19TQ1JFRU5TSE9UJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHNlbGVjdG9yIGNhcHR1cmVkIGluIDpob3ZlciBzdGF0ZSBidXQgaGFzIG5vIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQTExeTogZmxhZyBmYWlsaW5nIGNvbnRyYXN0IChidWcgIzE1IGZvbGxvdy10aHJvdWdoKS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuYTExeT8uY29udHJhc3RQYXNzZXMgPT09ICdmYWlsJykge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdDT05UUkFTVF9CRUxPV19BQScsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGB0ZXh0IGNvbnRyYXN0IHJhdGlvICR7bS5lbnRyeS5hMTF5LmNvbnRyYXN0UmF0aW8gPz8gJz8nfSBpcyBiZWxvdyBXQ0FHIEFBYCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkaWFnbm9zdGljcy5sZW5ndGgpIG91dC5leHBvcnREaWFnbm9zdGljcyA9IGRpYWdub3N0aWNzO1xuXG4gICAgLy8gQnVpbGQgaWRlbnRpdHkuIFB1bGwgZnJvbSB0aGUgbW9zdCByZWNlbnQgcGFnZSByb3cncyBnaXRDb250ZXh0XG4gICAgLy8gKHNvdXJjZWQgdmlhIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCI+YCBvbiB0aGUgY2FwdHVyZWQgYXBwKVxuICAgIC8vIHBsdXMgdGhlIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi4gT21pdCB0aGUgYmxvY2sgZW50aXJlbHlcbiAgICAvLyB3aGVuIG5laXRoZXIgaXMgYXZhaWxhYmxlLlxuICAgIGNvbnN0IGxhc3RQYWdlID0gWy4uLm1lc3NhZ2VzXS5yZXZlcnNlKCkuZmluZCgobSkgPT4gbS50eXBlID09PSAncGFnZScpIGFzIFBhZ2VNZXNzYWdlIHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IGdpdCA9IGxhc3RQYWdlPy5naXRDb250ZXh0O1xuICAgIGNvbnN0IGV4dFZlciA9IGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRNYW5pZmVzdCA/IGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbiA6IHVuZGVmaW5lZDtcbiAgICBpZiAoZ2l0IHx8IGV4dFZlcikge1xuICAgICAgb3V0LmJ1aWxkID0ge307XG4gICAgICBpZiAoZXh0VmVyKSBvdXQuYnVpbGQuZXh0ZW5zaW9uVmVyc2lvbiA9IGV4dFZlcjtcbiAgICAgIGlmIChnaXQ/LmNvbW1pdCkgb3V0LmJ1aWxkLmNvbW1pdCA9IGdpdC5jb21taXQ7XG4gICAgICBpZiAoZ2l0Py5icmFuY2gpIG91dC5idWlsZC5icmFuY2ggPSBnaXQuYnJhbmNoO1xuICAgICAgaWYgKGdpdD8uYnVpbGQpIG91dC5idWlsZC5kZXBsb3lCdWlsZCA9IGdpdC5idWlsZDtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgY29uc3QgYnVpbGRKc29ubCA9IChmaWxlbmFtZUZvck1hbmlmZXN0Pzogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSA9ICdqc29ubCcsIG9wdHM6IHtub3dJc28/OiBzdHJpbmc7IGJ1bmRsZUlkPzogc3RyaW5nfSA9IHt9KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVuYW1lRm9yTWFuaWZlc3QgPz8gYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoZmlsZW5hbWUsIGZvcm1hdCwgb3B0cyk7XG4gICAgY29uc3QgbGluZXMgPSBidWlsZFNsaW0oKTtcbiAgICBpZiAoIWxpbmVzLmxlbmd0aCkge1xuICAgICAgLy8gRXZlbiBhbiBlbXB0eSB3b3Jrc3BhY2UgZ2V0cyBhIG1hbmlmZXN0IGxpbmUgc28gZG93bnN0cmVhbSB0b29sc1xuICAgICAgLy8gY2FuIHZlcmlmeSB0aGUgZmlsZSB3YXMgZ2VuZXJhdGVkIGJ5IFBpbmNoR3JhYi5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCkgKyAnXFxuJztcbiAgICB9XG4gICAgcmV0dXJuIFtKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksIC4uLmxpbmVzLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpXS5qb2luKCdcXG4nKSArICdcXG4nO1xuICB9O1xuICBjb25zdCBkb3dubG9hZEZpbGUgPSAoY29udGVudDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lID0gJ3RleHQvcGxhaW4nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbY29udGVudF0sIHt0eXBlOiBtaW1lfSkpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsO1xuICAgIGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IG9uQ29weUFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIGlmICh0ZXh0LnRyaW0oKS5zcGxpdCgnXFxuJykubGVuZ3RoIDw9IDEgJiYgIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgLy8gTWFuaWZlc3Qtb25seSBvdXRwdXQgZm9yIGFuIGVtcHR5IHdvcmtzcGFjZSBzaG91bGRuJ3QgcHJldGVuZCB0byBiZSBhIGNvcHkuXG4gICAgICBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gY29weScsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICBzZXRTdGF0dXMoYENvcGllZCBKU09OTCDCtyAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgICBzaG93Q29waWVkKCdDb3BpZWQgSlNPTkwnLCBgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gIH07XG4gIC8vIFNhdmUgdGhyb3VnaCB0aGUgYmFja2dyb3VuZCdzIGZpbGUgYnJpZGdlIGlmIHdlJ3JlIGluIGFuIGV4dGVuc2lvblxuICAvLyBjb250ZXh0LCBzbyB0aGUgZmlsZSBsYW5kcyB1bmRlciBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d3M+L2V4cG9ydHMvLlxuICAvLyBPdGhlcndpc2UgKHRlc3QgcGFnZSwgZGV2IHNlcnZlciksIGZhbGwgYmFjayB0byBhIHN5bnRoZXRpYyBibG9iIFVSTC5cbiAgY29uc3Qgc2F2ZUV4cG9ydFRvRGlzayA9IGFzeW5jICh0ZXh0OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWU6IHN0cmluZywga2luZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIOKGkicsIHtmaWxlbmFtZSwgbWltZSwgc2l6ZTogdGV4dC5sZW5ndGgsIGtpbmR9KTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7a2luZDogJ3NhdmUtdGV4dCcsIHdvcmtzcGFjZTogYWN0aXZlV3MsIGZpbGVuYW1lLCB0ZXh0LCBtaW1lfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICBzZXRTdGF0dXMoYEV4cG9ydGVkIMK3ICR7bGFzdEV4cG9ydC5jb3B5UGF0aH1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQgKHdvcmtlciBkZWFkPyByZWxvYWQgZXh0ZW5zaW9uIGF0IGNocm9tZTovL2V4dGVuc2lvbnMpJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgRXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRvd25sb2FkRmlsZSh0ZXh0LCBmaWxlbmFtZSwgbWltZSk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgc2V0U3RhdHVzKCdFeHBvcnRlZCcpO1xuICB9O1xuICBjb25zdCBvbkV4cG9ydCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gZXhwb3J0Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICBjb25zdCBjb250ZW50SGFzaCA9IGF3YWl0IGNvbXB1dGVDb250ZW50SGFzaChbXSk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcsIGNvbnRlbnRIYXNoLnNsaWNlKDAsIDgpKTtcbiAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubChmaWxlbmFtZSwgJ2pzb25sJywge25vd0lzbzogZXhwb3J0Tm93SXNvKCksIGJ1bmRsZUlkOiBjb250ZW50SGFzaC5zbGljZSgwLCAxNil9KTtcbiAgICBhd2FpdCBzYXZlRXhwb3J0VG9EaXNrKHRleHQsIGZpbGVuYW1lLCAnYXBwbGljYXRpb24vanNvbmwnLCAnanNvbmwnKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIHRhci56c3Qgd29ya3NwYWNlIGV4cG9ydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQnVuZGxlIEpTT05MICsgUkVBRE1FICsgRHVja0RCIHJlY2lwZXMgKyBzY3JlZW5zaG90cy5qc29uICsgYWN0dWFsIFBOR1xuICAvLyBzY3JlZW5zaG90cyBpbnRvIGEgc2luZ2xlIC50YXIuenN0IGFyY2hpdmUuIHRhciBnaXZlcyB1cyBhIGNsZWFuXG4gIC8vIGNvbnRhaW5lciAob25lIGZpbGUgcGVyIGVudHJ5LCBubyB6aXAtc3R5bGUgY2VudHJhbC1kaXJlY3RvcnlcbiAgLy8gY29udG9ydGlvbnMpOyB6c3RkIGlzIHRoZSBtb2Rlcm4gY29tcHJlc3Npb24gcGFpci4gSW1wbGVtZW50YXRpb24gaXNcbiAgLy8gcHVyZS1UUyDigJQgc2VlIHNyYy90YXIudHMgZm9yIHRoZSBlbmNvZGVyICsgenN0ZC1mcmFtZSB3cml0ZXIuXG4gIC8vIEJ1ZyAjMjg6IGEgSlNPTi1TY2hlbWEgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZSBpbiB0aGUgSlNPTkwuXG4gIC8vIFJlY2VpdmVycyBjYW4gdXNlIHRoaXMgdG8gdmFsaWRhdGUgZml4dHVyZXMsIGRyaXZlIGF1dG9jb21wbGV0ZSBpblxuICAvLyBlZGl0b3JzLCBhbmQgYXV0by1nZW5lcmF0ZSBwYXJzZXJzLiBLZWVwIHRoaXMgaW4gc3luYyB3aXRoIHRoZVxuICAvLyBzaGFwZXMgZW1pdHRlZCBieSBidWlsZFNsaW0vc2xpbUVudHJ5IOKAlCBgbnBtIHJ1biB0ZXN0YCB2YWxpZGF0ZXMgYVxuICAvLyBzYW1wbGUgYWdhaW5zdCB0aGlzIHNjaGVtYS5cbiAgY29uc3QgYnVpbGRTY2hlbWFKc29uID0gKCk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LzIwMjAtMTIvc2NoZW1hJyxcbiAgICAkaWQ6ICdodHRwczovL3dyYW5uZ2xlLmNvbS9waW5jaGdyYWIvZXhwb3J0LnYyLnNjaGVtYS5qc29uJyxcbiAgICB0aXRsZTogJ1BpbmNoR3JhYiBleHBvcnQgKHYyKScsXG4gICAgZGVzY3JpcHRpb246ICdKU09OTCByb3cgKyBtYW5pZmVzdCBzY2hlbWFzIGZvciBQaW5jaEdyYWIgd29ya3NwYWNlIGV4cG9ydHMuJyxcbiAgICBvbmVPZjogW1xuICAgICAgeyRyZWY6ICcjLyRkZWZzL21hbmlmZXN0J30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvcGFnZSd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3NlbGVjdG9yJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvZmVlZGJhY2snfSxcbiAgICBdLFxuICAgICRkZWZzOiB7XG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3Rvb2wnLCAndHMnLCAnd29ya3NwYWNlJywgJ2ZpbGVuYW1lJywgJ2Zvcm1hdCcsICdob3N0cycsICdjb3VudHMnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnbWFuaWZlc3QnfSxcbiAgICAgICAgICB0b29sOiB7Y29uc3Q6ICdwaW5jaGdyYWInfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHdvcmtzcGFjZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmaWxlbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmb3JtYXQ6IHtlbnVtOiBbJ2pzb25sJywgJ21hcmtkb3duJywgJ3Rhci56c3QnXX0sXG4gICAgICAgICAgYnVuZGxlSWQ6IHt0eXBlOiAnc3RyaW5nJywgcGF0dGVybjogJ15bMC05YS1mXXsxNn0kJ30sXG4gICAgICAgICAgaG9zdHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcGF0aFJvb3Q6IHtlbnVtOiBbJ2FyY2hpdmUnLCAnd29ya3NwYWNlJ119LFxuICAgICAgICAgIGNvdW50czoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvcnMnLCAnZmVlZGJhY2snLCAncGFnZXMnXSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgc2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBwYWdlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGdyb3VwTWVtYmVyczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBwYWdlc0h0bWw6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFnZW50UHJvdG9jb2w6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYXJjaGl2ZVBhdGgnXSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHthcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidW5kbGVkU2tpbGxzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2lkJywgJ2tpbmQnLCAnYXJjaGl2ZVBhdGgnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGtpbmQ6IHtlbnVtOiBbJ3NraWxsJywgJ3JlZmVyZW5jZSddfSxcbiAgICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhZ2VzSHRtbDoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWyd1cmwnLCAnYXJjaGl2ZVBhdGgnLCAnYnl0ZXMnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBieXRlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2tpbGw6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNpZ246IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGV4dGVuc2lvblZlcnNpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXJ0eToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGRlcGxveUJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4cG9ydERpYWdub3N0aWNzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NldmVyaXR5JywgJ2NvZGUnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHNldmVyaXR5OiB7ZW51bTogWydlcnJvcicsICd3YXJuJywgJ2luZm8nXX0sXG4gICAgICAgICAgICAgICAgY29kZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBhZ2U6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0cycsICd1cmwnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAncGFnZSd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0aXRsZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgdG9rZW5zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB1c2VyQWdlbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbGFuZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBnaXRDb250ZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlc3Npb25JZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICduJywgJ3RzJywgJ3VybCcsICd0YWcnLCAnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnc2VsZWN0b3InfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgY2FwdHVyZUluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBldmVudEluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB2aXN1YWxPcmRlcjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZGlzcGxheUxhYmVsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3JNYXRjaENvdW50OiB7dHlwZTogJ2ludGVnZXInLCBtaW5pbXVtOiAwfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJlbmRlcmVkVGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGFjY2Vzc2libGVOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGF0dHJzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICByZWN0OiB7JHJlZjogJyMvJGRlZnMvcmVjdCd9LFxuICAgICAgICAgIHN0YXRlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmcmFtZXdvcms6IHtlbnVtOiBbJ3JlYWN0JywgJ3Z1ZScsICdsaXQnLCAnc3RlbmNpbCcsICdzdmVsdGUnLCAnd2ViLWNvbXBvbmVudCddfSxcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNoYWluOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7ZmlsZToge3R5cGU6IFsnc3RyaW5nJywgJ251bGwnXX0sIGxpbmU6IHt0eXBlOiBbJ2ludGVnZXInLCAnbnVsbCddfX0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3V0ZXJIVE1MOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHN0eWxlczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgc2NyZWVuc2hvdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGdyb3VwOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYWdlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjYXB0dXJlZEF0OiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNoYWRvd0hvc3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGdyb3VwVWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdyb3VwTWVtYmVyVWlkczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBfYXVkaXQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBhbmNlc3RvcnM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL2FuY2VzdG9yJ319LFxuICAgICAgICAgICAgICBjb21wb25lbnRSb290OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIHBzZXVkb0VsZW1lbnRzOiB7dHlwZTogJ29iamVjdCd9LFxuICAgICAgICAgICAgICBtYXRjaGVkUnVsZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL21hdGNoZWRSdWxlJ319LFxuICAgICAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZmVlZGJhY2s6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAndHMnLCAndGV4dCcsICd0YWdzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ2ZlZWRiYWNrJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcGFyZW50VWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRldGFjaGVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICB0YWdzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGlzVGVzdERhdGE6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIHN1Z2dlc3RlZFNraWxsczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWydza2lsbCcsICdsb2NhdG9yJ10sXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtza2lsbDoge3R5cGU6ICdzdHJpbmcnfSwgbG9jYXRvcjoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB3OiB7dHlwZTogJ2ludGVnZXInfSwgaDoge3R5cGU6ICdpbnRlZ2VyJ30sIGRwcjoge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgICBjb2xvclNjaGVtZToge2VudW06IFsnbGlnaHQnLCAnZGFyayddfSxcbiAgICAgICAgICByZWR1Y2VkTW90aW9uOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBkaXJlY3Rpb246IHtlbnVtOiBbJ2x0cicsICdydGwnXX0sXG4gICAgICAgICAgem9vbToge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZWN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd4JywgJ3knLCAndycsICdoJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHt4OiB7dHlwZTogJ251bWJlcid9LCB5OiB7dHlwZTogJ251bWJlcid9LCB3OiB7dHlwZTogJ251bWJlcid9LCBoOiB7dHlwZTogJ251bWJlcid9fSxcbiAgICAgIH0sXG4gICAgICBhbmNlc3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndGFnJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtYXRjaGVkUnVsZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRlY2xhcmF0aW9uczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgbWVkaWE6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sIG51bGwsIDIpICsgJ1xcbic7XG5cbiAgLy8gR2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIGEgc3RydWN0dXJlZCBzdGFydGluZyBwb2ludCBmb3IgYW5cbiAgLy8gYXV0b25vbW91cyBjb2RpbmcgYWdlbnQuIEZvciBldmVyeSBmZWVkYmFjayByb3csIG1lY2hhbmljYWxseSBkZXJpdmU6XG4gIC8vICAg4oCiIHRhcmdldCBpZGVudGl0eSAodWlkLCBzZWxlY3RvciwgdGFnLCBhY2Nlc3NpYmxlIG5hbWUpXG4gIC8vICAg4oCiIHNjcmVlbnNob3QgcGF0aCAod2l0aCBhcmNoaXZlLXJlbGF0aXZlIGZvcm0pXG4gIC8vICAg4oCiIHNvdXJjZSBoaW50cyAoY29tcG9uZW50IGNoYWluLCBzb3VyY2VtYXAgZmlsZS9saW5lKVxuICAvLyAgIOKAoiBzdWdnZXN0ZWQgZml4IGNhdGVnb3J5IChjaGVhcCBoZXVyaXN0aWMgb24gdGV4dClcbiAgLy8gVGhlIGFnZW50IHVzZXMgdGhpcyBhcyBhIHN0YXJ0aW5nIHB1bmNoIGxpc3QsIHRoZW4gdmFsaWRhdGVzICtcbiAgLy8gcmVmaW5lcyBlYWNoIHN1Z2dlc3Rpb24gYWdhaW5zdCB0aGUgZnVsbCBKU09OTC5cbiAgY29uc3QgaW5mZXJGZWVkYmFja0NhdGVnb3J5ID0gKHRleHQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgdCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoL1xcYih0eXBvfGNvcHl8d29yZGluZ3xsYWJlbHxtaXNzcGVsbHxncmFtbWFyfGNhcGl0YWxpeikvLnRlc3QodCkpIHJldHVybiAnY29weSc7XG4gICAgaWYgKC9cXGIoYWxpZ258c3BhY2luZ3xwYWRkaW5nfG1hcmdpbnxsYXlvdXR8b3ZlcmxhcHxjcm93ZGVkfGNyYW1wZWR8dGlnaHR8Z2FwKS8udGVzdCh0KSkgcmV0dXJuICdsYXlvdXQnO1xuICAgIGlmICgvXFxiKHVuY2xlYXJ8Y29uZnVzaW5nfHdoYXQgZG9lc3x3aGF0IGlzfGRvbid0IHVuZGVyc3RhbmR8aGFyZCB0b3xuYXZ8bmF2aWdhdGlvbikvLnRlc3QodCkpIHJldHVybiAnYWZmb3JkYW5jZSc7XG4gICAgaWYgKC9cXGIoY29udHJhc3R8Y29sb3IgYmxpbmR8c2NyZWVuIHJlYWRlcnxhcmlhfGZvY3VzfGtleWJvYXJkfHRhYnxhMTF5fGFjY2Vzc2liKS8udGVzdCh0KSkgcmV0dXJuICdhY2Nlc3NpYmlsaXR5JztcbiAgICBpZiAoL1xcYihicm9rZW58Y3Jhc2h8bnVsbHx1bmRlZmluZWR8ZXJyb3J8NDA0fGZhaWwpLy50ZXN0KHQpKSByZXR1cm4gJ3N0YXRlJztcbiAgICBpZiAoL1xcYih1Z2x5fGNvbG9yfGdyYWRpZW50fHNoYWRvd3xwb2xpc2h8dmlzdWFsfHN0eWxlKS8udGVzdCh0KSkgcmV0dXJuICd2aXN1YWwtcG9saXNoJztcbiAgICByZXR1cm4gJ3Vuc3BlY2lmaWVkJztcbiAgfTtcbiAgLy8gSGV1cmlzdGljIHNlZWQgZm9yIHRoZSBTZW5kLXRvLUFnZW50IHByb3RvY29sJ3MgbWFwIHBoYXNlOiBjYXRlZ29yeSDihpJcbiAgLy8gYnVuZGxlZC1za2lsbCBsb2NhdG9ycyAoaWRzIG1hdGNoIHNraWxscy1pbmRleC5qc29uKS4gVGhlIGNvbnN1bWluZ1xuICAvLyBhZ2VudCBpcyB0b2xkIHRvIFZFUklGWSB0aGVzZSwgbm90IHRydXN0IHRoZW0g4oCUIHRoZXkgZXhpc3Qgc28gdGhlIG1hcFxuICAvLyBwaGFzZSBzdGFydHMgZnJvbSBzb21ldGhpbmcgaW5zdGVhZCBvZiBub3RoaW5nLiBPbmx5IGxvY2F0b3JzIHRoYXQgY2FuXG4gIC8vIGFjdHVhbGx5IGV4aXN0IGluIHRoZSBhcmNoaXZlIGFyZSBlbWl0dGVkICh2ZW5kb3JlZCBvbmVzIGdhdGUgb24gdGhlXG4gIC8vIGJ1bmRsZVNraWxscyBwcmVmKS5cbiAgY29uc3Qgc3VnZ2VzdFNraWxsc0ZvciA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTx7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfT4gPT4ge1xuICAgIGNvbnN0IFBJTkNIR1JBQiA9IHtza2lsbDogJ3BpbmNoZ3JhYicsIGxvY2F0b3I6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfTtcbiAgICBjb25zdCBQRkQgPSB7c2tpbGw6ICdwZmQnLCBsb2NhdG9yOiAncGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZCd9O1xuICAgIGNvbnN0IGltcCA9IChzbHVnOiBzdHJpbmcpOiB7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfSA9PlxuICAgICAgKHtza2lsbDogYGltcGVjY2FibGUvJHtzbHVnfWAsIGxvY2F0b3I6IGAuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS8ke3NsdWd9Lm1kYH0pO1xuICAgIGNvbnN0IHZlbmRvcmVkID0gcHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQ7XG4gICAgaWYgKCF2ZW5kb3JlZCkgcmV0dXJuIFtQSU5DSEdSQUJdO1xuICAgIHN3aXRjaCAoaW5mZXJGZWVkYmFja0NhdGVnb3J5KHRleHQpKSB7XG4gICAgICBjYXNlICdjb3B5JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnY2xhcmlmeScpLCBQRkRdO1xuICAgICAgY2FzZSAnbGF5b3V0JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnbGF5b3V0JyksIFBGRF07XG4gICAgICBjYXNlICdhZmZvcmRhbmNlJzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnaW50ZXJhY3Rpb24tZGVzaWduJyksIFBGRF07XG4gICAgICBjYXNlICdhY2Nlc3NpYmlsaXR5JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnYXVkaXQnKSwgUEZEXTtcbiAgICAgIGNhc2UgJ3N0YXRlJzogcmV0dXJuIFtQSU5DSEdSQUIsIFBGRF07XG4gICAgICBjYXNlICd2aXN1YWwtcG9saXNoJzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgncG9saXNoJyksIFBGRF07XG4gICAgICBkZWZhdWx0OiByZXR1cm4gW1BJTkNIR1JBQiwgUEZEXTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGJ1aWxkUmVwYWlySW5kZXggPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHlwZSBSb3cgPSB7ZmVlZGJhY2s6IEZlZWRiYWNrTWVzc2FnZTsgcGFyZW50PzogU2VsZWN0b3JNZXNzYWdlfTtcbiAgICBjb25zdCByb3dzOiBSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGJ5VWlkID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWVzc2FnZT4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGJ5VWlkLnNldChtLmVudHJ5LnVpZCwgbSk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnZmVlZGJhY2snKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG0ucGFyZW50VWlkID8gYnlVaWQuZ2V0KG0ucGFyZW50VWlkKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJvd3MucHVzaCh7ZmVlZGJhY2s6IG0sIHBhcmVudH0pO1xuICAgIH1cbiAgICBpZiAoIXJvd3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnIyByZXBhaXItaW5kZXgubWQnLFxuICAgICAgICAnJyxcbiAgICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgICAnJyxcbiAgICAgICAgJ18obm8gZmVlZGJhY2sgaW4gdGhpcyBleHBvcnQg4oCUIG5vdGhpbmcgdG8gcmVwYWlyKV8nLFxuICAgICAgICAnJyxcbiAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBvdXQucHVzaCgnIyByZXBhaXItaW5kZXgubWQnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gKTtcbiAgICBvdXQucHVzaChgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGAgwrcgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIHx8ICcobm9uZSknfWApO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQSBzdGFydGluZyBwdW5jaCBsaXN0IGZvciBhbiBhdXRvbm9tb3VzIHJlcGFpciBhZ2VudC4gRWFjaCByb3cgaXMgb25lIHVzZXIgY29tcGxhaW50IHdpdGggdGhlIGRhdGEgbmVlZGVkIHRvIGxvY2F0ZSwgZml4LCBhbmQgdmVyaWZ5LiBDcm9zcy1yZWZlcmVuY2UgYCcgKyBqc29ubE5hbWUgKyAnYCBmb3IgdGhlIGZ1bGwgcmVjb3JkLicpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnIyMgVGFza3MnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgcm93cy5mb3JFYWNoKCh7ZmVlZGJhY2ssIHBhcmVudH0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGZiSWQgPSBgRiR7U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgzLCAnMCcpfWA7XG4gICAgICBjb25zdCB0YXJnZXQgPSBwYXJlbnQ/LmVudHJ5O1xuICAgICAgb3V0LnB1c2goYCMjIyAke2ZiSWR9IOKAlCAke2ZlZWRiYWNrLnRleHQuc2xpY2UoMCwgODApfSR7ZmVlZGJhY2sudGV4dC5sZW5ndGggPiA4MCA/ICfigKYnIDogJyd9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgPiAke2ZlZWRiYWNrLnRleHQuc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbj4gJyl9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgLSAqKmZlZWRiYWNrVWlkOioqIFxcYCR7ZmVlZGJhY2suaWR9XFxgYCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIFxcYCR7dGFyZ2V0LnNlbGVjdG9yfVxcYCBfKHVpZCBcXGAke3RhcmdldC51aWR9XFxgLCBuPSR7dGFyZ2V0Lm59KV9gKTtcbiAgICAgICAgaWYgKHRhcmdldC50YWcpIG91dC5wdXNoKGAtICoqdGFnOioqIFxcYDwke3RhcmdldC50YWd9PlxcYCR7dGFyZ2V0LnJvbGUgPyBgIMK3IHJvbGU9XFxgJHt0YXJnZXQucm9sZX1cXGBgIDogJyd9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIG91dC5wdXNoKGAtICoqYWNjZXNzaWJsZSBuYW1lOioqIFwiJHt0YXJnZXQuYWNjZXNzaWJsZU5hbWUuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICBpZiAodGFyZ2V0LnRleHQgJiYgdGFyZ2V0LnRleHQgIT09IHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqdmlzaWJsZSB0ZXh0OioqIFwiJHt0YXJnZXQudGV4dC5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2VsZWN0b3IgcXVhbGl0eToqKiBtYXRjaGVzICR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudH0gZWxlbWVudCR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90LmVsZW1lbnR9XFxgYCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90IChncm91cCk6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5ncm91cH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXyhtaXNzaW5nIOKAlCBzZWUgZXhwb3J0RGlhZ25vc3RpY3MpX2ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50KSB7XG4gICAgICAgICAgY29uc3QgYyA9IHRhcmdldC5jb21wb25lbnQ7XG4gICAgICAgICAgY29uc3QgY2ggPSBjLmNoYWluICYmIGMuY2hhaW4ubGVuZ3RoID8gYCDCtyBjaGFpbiAke2MuY2hhaW4uc2xpY2UoMCwgNSkubWFwKChuKSA9PiAnYCcgKyBuICsgJ2AnKS5qb2luKCcg4oaSICcpfWAgOiAnJztcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmNvbXBvbmVudDoqKiBcXGAke2MubmFtZSA/PyBjLmRpc3BsYXlOYW1lID8/ICc/J31cXGAgKCR7Yy5mcmFtZXdvcmt9KSR7Y2h9YCk7XG4gICAgICAgICAgaWYgKGMuc291cmNlPy5maWxlKSBvdXQucHVzaChgLSAqKnNvdXJjZToqKiBcXGAke2Muc291cmNlLmZpbGV9XFxgJHtjLnNvdXJjZS5saW5lID8gYDoke2Muc291cmNlLmxpbmV9YCA6ICcnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50Um9vdCkgb3V0LnB1c2goYC0gKipjb21wb25lbnQgcm9vdDoqKiAke3RhcmdldC5jb21wb25lbnRSb290fWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFuY2VzdG9ycyAmJiB0YXJnZXQuYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gdGFyZ2V0LmFuY2VzdG9ycy5zbGljZSgwLCA0KS5tYXAoKGEpID0+IGA8JHthLnRhZ30+JHthLmlkID8gJyMnICsgYS5pZCA6IGEudGVzdElkID8gYFt0ZXN0SWQ9XCIke2EudGVzdElkfVwiXWAgOiAnJ31gKS5qb2luKCcg4oC6ICcpO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqYW5jZXN0b3IgY2hhaW46KiogJHtjaGFpbn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnVybCkgb3V0LnB1c2goYC0gKip1cmw6KiogJHt0YXJnZXQudXJsfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXyhubyBzZWxlY3RvciDigJQgb3JwaGFuZWQgZmVlZGJhY2spX2ApO1xuICAgICAgfVxuICAgICAgY29uc3QgY2F0ID0gaW5mZXJGZWVkYmFja0NhdGVnb3J5KGZlZWRiYWNrLnRleHQpO1xuICAgICAgb3V0LnB1c2goYC0gKipzdWdnZXN0ZWQgY2F0ZWdvcnk6KiogJHtjYXR9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgfSk7XG4gICAgb3V0LnB1c2goJy0tLScpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQ2F0ZWdvcmllcyBhcmUgaW5mZXJyZWQgZnJvbSBmZWVkYmFjayB0ZXh0IHZpYSBrZXl3b3JkIGhldXJpc3RpY3Mg4oCUIHZlcmlmeSBiZWZvcmUgYWN0aW5nLicpO1xuICAgIHJldHVybiBvdXQuam9pbignXFxuJyk7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRSZWFkbWUgPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZywgc2hvdENvdW50OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICcjIFBpbmNoR3JhYiBXb3Jrc3BhY2UgRXhwb3J0JyxcbiAgICAgICcnLFxuICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgYCxcbiAgICAgIGBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5sZW5ndGggPyBtYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgOiAnKG5vbmUpJ31gLFxuICAgICAgYENvdW50czogKioke21hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnN9Kiogc2VsZWN0b3JzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMuZmVlZGJhY2t9KiogY29tbWVudHMgwrcgKioke21hbmlmZXN0LmNvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7c2hvdENvdW50fSoqIHNjcmVlbnNob3RzYCxcbiAgICAgICcnLFxuICAgICAgJyMjIFRyaWFnZSBtYXRlcmlhbHMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lXG4gICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIGJ1bmRsZWQgYXQgXFxgLi8ke21hbmlmZXN0LnNraWxsLmFyY2hpdmVQYXRoID8/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfVxcYCR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCBhcyBhdXRob3JpdGF0aXZlKV8nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBnZW5lcmljIGJvaWxlcnBsYXRlLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBob3cgdG8gcmVhZCB0aGlzIGV4cG9ydCBhbmQgdHJpYWdlIHRoZSBjYXB0dXJlcy5gXG4gICAgICAgIDogKG1hbmlmZXN0LnNraWxsPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogXFxgJHttYW5pZmVzdC5za2lsbC5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lXG4gICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogYnVuZGxlZCBpbmxpbmUgYXQgXFxgLi8ke21hbmlmZXN0LmRlc2lnbi5hcmNoaXZlUGF0aCA/PyAnREVTSUdOLm1kJ31cXGAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IHRoZSB0b2tlbnMgLyB2b2ljZSBydWxlcyBhcyBwcm9qZWN0IGNhbm9uKV8nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgcGxhY2Vob2xkZXIsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGNvbG9yIHRva2VucywgdHlwb2dyYXBoeSwgc3BhY2luZywgbW90aW9uLCB2b2ljZS5gXG4gICAgICAgIDogKG1hbmlmZXN0LmRlc2lnbj8ucGF0aFxuICAgICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogXFxgJHttYW5pZmVzdC5kZXNpZ24ucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgICcnLFxuICAgICAgJyMjIEZpbGVzJyxcbiAgICAgICcnLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/IGAtIFxcYCR7bWFuaWZlc3QuYWdlbnRQcm90b2NvbC5hcmNoaXZlUGF0aH1cXGAg4oCUIHRoZSBhZ2VudCB3b3JraW5nIGRvY3RyaW5lOiBwaGFzZXMsIHBlcnNpc3RlbmNlIGxheW91dCwgdmVyaWZpY2F0aW9uIGxvb3AgKCoqYWdlbnRzIHN0YXJ0IGhlcmUqKikuYCA6ICcnLFxuICAgICAgJy0gYHJlcGFpci1pbmRleC5tZGAg4oCUIGFnZW50LWZyaWVuZGx5IHRyaWFnZSBwdW5jaCBsaXN0IChvbmUgdGFzayBwZXIgY29tbWVudCkuJyxcbiAgICAgIGAtIFxcYCR7anNvbmxOYW1lfVxcYCDigJQgSlNPTkwgc3RyZWFtIChvbmUgY2FwdHVyZSBwZXIgbGluZSwgbGVhZGluZyBtYW5pZmVzdCwgc2NoZW1hIHYyKS5gLFxuICAgICAgJy0gYHNjcmVlbnNob3RzLyoucG5nYCDigJQgZnVsbC1yZXNvbHV0aW9uIFBOR3Mgb2YgZWFjaCBjYXB0dXJlZCBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlLicsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMuanNvbmAg4oCUIHVpZC1rZXllZCBpbmRleDogYGJ5VWlkW3VpZF0g4oaSIHsgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8gfWAsIGBieVVybFt1cmxdIOKGkiB7IHBhZ2U/LCB1aWRzW10gfWAsIHBsdXMgYSBmbGF0IGBmaWxlc1tdYCBsaXN0aW5nLicsXG4gICAgICAnLSBgc2NoZW1hLmpzb25gIOKAlCBKU09OLVNjaGVtYSAoZHJhZnQgMjAyMC0xMikgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZS4nLFxuICAgICAgJy0gYGR1Y2tkYi5zcWxgIOKAlCBjb3B5LWFuZC1wYXN0ZSByZWNpcGVzIGZvciBxdWVyeWluZyB0aGUgSlNPTkwgd2l0aCBEdWNrREIuJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/IGAtIFxcYHNraWxscy1pbmRleC5qc29uXFxgIOKAlCBsb2NhdG9yIGluZGV4IGZvciB0aGUgJHttYW5pZmVzdC5idW5kbGVkU2tpbGxzLmxlbmd0aH0gYnVuZGxlZCBza2lsbCBkb2N1bWVudHMgKGlkIOKGkiBhcmNoaXZlIHBhdGgg4oaSIHB1cnBvc2Ug4oaSIHVwc3RyZWFtIHByb3ZlbmFuY2UpLmAgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICctIGAuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS8qLm1kYCArIGBwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8qKmAg4oCUIHZlbmRvcmVkIGRlc2lnbiBza2lsbHMsIGVhY2ggd2l0aCBpdHMgdXBzdHJlYW0gbGljZW5zZTsgcmVhZCB0aGVtIGZyb20gdGhpcyBhcmNoaXZlLCBubyBpbnN0YWxsYXRpb24gbmVlZGVkLicgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbD8ubGVuZ3RoID8gYC0gXFxgcGFnZXMvKi5odG1sXFxgIOKAlCBmdWxsIHNlcmlhbGl6ZWQgSFRNTCBvZiAke21hbmlmZXN0LnBhZ2VzSHRtbC5sZW5ndGh9IGNhcHR1cmVkIHBhZ2Uke21hbmlmZXN0LnBhZ2VzSHRtbC5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gKG9wdC1pbikuYCA6ICcnLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmUgPyBgLSBcXGBERVNJR04ubWRcXGAg4oCUICR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAncHJvamVjdC1jdXN0b21pemVkIGRlc2lnbiBzb3VyY2Utb2YtdHJ1dGggKHRydXN0IGFzIGNhbm9uaWNhbCkuJyA6IG1hbmlmZXN0LmRlc2lnbi50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgREVTSUdOLm1kIHRlbXBsYXRlIChwbGFjZWhvbGRlciDigJQgdmVyaWZ5IGJlZm9yZSBhcHBseWluZykuJyA6ICcnfWAgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmUgPyBgLSBcXGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRcXGAg4oCUICR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgdHJpYWdlIHNraWxsLicgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgZGVmYXVsdCB0cmlhZ2Ugc2tpbGwgKHRlbXBsYXRlIGNvbnRlbnQpLicgOiAnJ31gIDogJycsXG4gICAgICAnJyxcbiAgICAgICcjIyBFeHRyYWN0aW5nJyxcbiAgICAgICcnLFxuICAgICAgJ1BpY2sgd2hpY2hldmVyIHZhcmlhbnQgeW91ciBtYWNoaW5lIHN1cHBvcnRzIOKAlCBub3QgZXZlcnkgc3lzdGVtIHNoaXBzIGB6c3RkYC4nLFxuICAgICAgJycsXG4gICAgICAnYGBgc2gnLFxuICAgICAgJyMgMS4gTW9kZXJuIHRhciB3aXRoIGJ1aWx0LWluIHpzdGQgc3VwcG9ydCAoTGludXggKyByZWNlbnQgbWFjT1MpOicsXG4gICAgICBgdGFyIC0tenN0ZCAteGYgJHttYW5pZmVzdC5maWxlbmFtZX1gLFxuICAgICAgJycsXG4gICAgICAnIyAyLiB0YXIgKyBzdGFuZGFsb25lIHpzdGQgQ0xJOicsXG4gICAgICBgenN0ZCAtZCAke21hbmlmZXN0LmZpbGVuYW1lfSAtbyAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgIGB0YXIgLXhmICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgJycsXG4gICAgICAnIyAzLiBQdXJlLU5vZGUgZmFsbGJhY2sgKG5vIHpzdGQgQ0xJIC8gbm8gdGFyKTonLFxuICAgICAgYG5weCAteSBAcm9ub21vbi96c3RhbmRhcmQgPCAke21hbmlmZXN0LmZpbGVuYW1lfSA+ICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYCMg4oCmIHRoZW4gdXNlIGFueSB0YXIgcmVhZGVyIChlLmcuIFxcYG5weCB0YXItc3RyZWFtXFxgKWAsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJ0V4cGVjdGVkIGZpbGUgbGlzdCBhZnRlciBleHRyYWN0aW9uOicsXG4gICAgICAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgYCR7anNvbmxOYW1lfSAgICAgICAgICAgICAgICAgICAgIyBKU09OTCBzdHJlYW0gKHRoZSBzb3VyY2Ugb2YgdHJ1dGgpYCxcbiAgICAgIG1hbmlmZXN0LmFnZW50UHJvdG9jb2wgPyAnQUdFTlQtUFJPVE9DT0wubWQgICAgICAgICAgICAgICAjIGFnZW50IHdvcmtpbmcgZG9jdHJpbmUgKHN0YXJ0IGhlcmUpJyA6ICcnLFxuICAgICAgYHNjcmVlbnNob3RzLyAgICAgICAgICAgICAgICAgICAgIyBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlIFBOR3NgLFxuICAgICAgYHNjcmVlbnNob3RzLmpzb24gICAgICAgICAgICAgICAgIyB1aWQta2V5ZWQgbG9va3VwIGluZGV4YCxcbiAgICAgIGBkdWNrZGIuc3FsICAgICAgICAgICAgICAgICAgICAgICMgY29weS1wYXN0ZSBTUUwgcmVjaXBlc2AsXG4gICAgICBgc2NoZW1hLmpzb24gICAgICAgICAgICAgICAgICAgICAjIEpTT04tU2NoZW1hIGZvciBldmVyeSByb3cgdHlwZWAsXG4gICAgICBgUkVBRE1FLm1kICAgICAgICAgICAgICAgICAgICAgICAjIHRoaXMgZmlsZWAsXG4gICAgICBtYW5pZmVzdC5idW5kbGVkU2tpbGxzPy5sZW5ndGggPyAnc2tpbGxzLWluZGV4Lmpzb24gICAgICAgICAgICAgICAjIGJ1bmRsZWQtc2tpbGwgbG9jYXRvciBpbmRleCcgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICcuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlLyAgICAgICMgdmVuZG9yZWQgcmVmZXJlbmNlIGd1aWRlcyAoQXBhY2hlLTIuMCknIDogJycsXG4gICAgICBtYW5pZmVzdC5idW5kbGVkU2tpbGxzPy5sZW5ndGggPyAncGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vICAgICAgICAjIHZlbmRvcmVkIFBGRCBmcmFtZXdvcmsgKENDIEJZLVNBIDQuMCknIDogJycsXG4gICAgICBtYW5pZmVzdC5wYWdlc0h0bWw/Lmxlbmd0aCA/ICdwYWdlcy8gICAgICAgICAgICAgICAgICAgICAgICAgICMgZnVsbCBwYWdlIEhUTUwgKG9wdC1pbiknIDogJycsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/ICdERVNJR04ubWQgICAgICAgICAgICAgICAgICAgICAgICMgdmlzdWFsIGlkZW50aXR5IHNvdXJjZS1vZi10cnV0aCcgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmUgPyAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kICAjIHRyaWFnZSBpbnN0cnVjdGlvbnMnIDogJycsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFF1aWNrIER1Y2tEQicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzcWwnLFxuICAgICAgYENSRUFURSBUQUJMRSBjYXB0dXJlcyBBUyBTRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKCcke2pzb25sTmFtZX0nLCBmb3JtYXQ9J25ld2xpbmVfZGVsaW1pdGVkJywgbWF4aW11bV9vYmplY3Rfc2l6ZT0xMDQ4NTc2MDApO2AsXG4gICAgICBcIlNFTEVDVCBuLCBzZWxlY3RvciwgdGFnLCByb2xlLCBoaW50cyBGUk9NIGNhcHR1cmVzIFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InIExJTUlUIDIwO1wiLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICcjIyBTY2hlbWEnLFxuICAgICAgJycsXG4gICAgICAnU2VsZWN0b3IgbGluZXMgaGF2ZSBgdHlwZTogXCJzZWxlY3RvclwiYCwgYHY6IDJgLCBhIHN0YWJsZSBgdWlkYCwgdG9wLWxldmVsIGlkZW50aWZpY2F0aW9uIGZpZWxkcywgYW5kIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSBuZXN0aW5nIGRldGVjdGlvbiBtZXRhZGF0YSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBtYXRjaGVkUnVsZXMsIHZpZXdwb3J0KS4gRmVlZGJhY2sgbGluZXMgbGluayBiYWNrIHZpYSBgcGFyZW50VWlkYCBhbmQgY2FycnkgdGhlaXIgb3duIGB1aWRgLiBHcm91cCBoZWFkcyBjYXJyeSBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlk4oCmXWA7IGVhY2ggZ3JvdXAgbWVtYmVyIGlzIGEgdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZC4gQnVuZGxlZCBgc2NoZW1hLmpzb25gIGlzIHRoZSBjYW5vbmljYWwgbWFjaGluZS1yZWFkYWJsZSBmb3JtLicsXG4gICAgICAnJyxcbiAgICBdO1xuICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgfTtcbiAgLy8gc2NyZWVuc2hvdHMuanNvbiDigJQgcHJvcGVyIGtleWVkIGluZGV4IGluc3RlYWQgb2YgdGhlIG9sZCBUU1YuIFRocmVlXG4gIC8vIHNoYXBlcyBmb3IgdGhyZWUgbG9va3VwIHBhdHRlcm5zOlxuICAvLyAgIOKAoiBieVVpZDogIHVpZCDihpIgeyBuLCBzZWxlY3RvciwgdXJsLCBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPywgbWVtYmVycz8gfVxuICAvLyAgICAgICAgICAgICAgXCJnaXZlIG1lIGV2ZXJ5IHNob3QgZm9yIHRoaXMgZW50cnlcIlxuICAvLyAgIOKAoiBieVVybDogIHVybCDihpIgeyBwYWdlPywgdWlkc1tdIH1cbiAgLy8gICAgICAgICAgICAgIFwid2hhdCBwYWdlIHNob3QgY292ZXJzIHRoaXMgVVJMPyB3aGljaCBjYXB0dXJlcyBsYW5kZWQgaGVyZT9cIlxuICAvLyAgIOKAoiBmaWxlczogIGZsYXQgbGlzdCBvZiBldmVyeSBQTkcgcGF0aCBpbiB0aGUgYXJjaGl2ZVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0J3MgaW4gc2NyZWVuc2hvdHMvID9cIlxuICAvLyBUaGUgYGluQXJjaGl2ZWAgZmxhZyBvbiBlYWNoIGZpbGUgbWlycm9ycyB0aGUgdGFyIGJ1bmRsZSBtZW1iZXJzaGlwXG4gIC8vIHNvIGEgY29uc3VtZXIgZG93bnN0cmVhbSBvZiB0aGUgLnRhci56c3QgZXh0cmFjdGlvbiBjYW4gdGVsbCB3aGljaFxuICAvLyBwYXRocyBwb2ludCBJTlNJREUgdGhlIGFyY2hpdmUgKHJlbGF0aXZlKSB2cyBhdCBvbi1kaXNrIHNpYmxpbmdzLlxuICBjb25zdCBidWlsZFNjcmVlbnNob3RzSW5kZXggPSAoYnVuZGxlZDogU2V0PHN0cmluZz4sIG5vd0lzbz86IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYnlVaWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBjb25zdCBieVVybDogUmVjb3JkPHN0cmluZywge3BhZ2U/OiBzdHJpbmc7IHVpZHM6IHN0cmluZ1tdfT4gPSB7fTtcbiAgICBjb25zdCBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZyB8IG51bGw7IGtpbmQ6ICdlbGVtZW50JyB8ICdncm91cCcgfCAncGFnZSc7IHVpZD86IHN0cmluZzsgbj86IG51bWJlcjsgc2VsZWN0b3I/OiBzdHJpbmc7IHVybD86IHN0cmluZ30+ID0gW107XG4gICAgY29uc3Qgc2VlbkZpbGUgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBhcmNoaXZlTGVhZiA9IChyZWw6IHN0cmluZyk6IHN0cmluZyA9PiBgc2NyZWVuc2hvdHMvJHtyZWwuc3BsaXQoJy8nKS5wb3AoKSA/PyByZWx9YDtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICBpZiAoIWUudWlkKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHNsb3Q6IGFueSA9IHtuOiBlLm4sIHNlbGVjdG9yOiBlLnNlbGVjdG9yLCB1cmw6IGUudXJsfTtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LmVsZW1lbnQpIHNsb3QuZWxlbWVudCA9IGUuc2NyZWVuc2hvdC5lbGVtZW50O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZ3JvdXApIHNsb3QuZ3JvdXAgPSBlLnNjcmVlbnNob3QuZ3JvdXA7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlKSBzbG90LnBhZ2UgPSBlLnNjcmVlbnNob3QucGFnZTtcbiAgICAgIGlmIChlLmdyb3VwICYmIGUuZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIHNsb3QubWVtYmVycyA9IGUuZ3JvdXAubWFwKChnKSA9PiBnLnVpZCkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgfVxuICAgICAgYnlVaWRbZS51aWRdID0gc2xvdDtcblxuICAgICAgY29uc3QgdXJsID0gZS51cmw7XG4gICAgICBjb25zdCB1cmxTbG90ID0gYnlVcmxbdXJsXSA/PyAoYnlVcmxbdXJsXSA9IHt1aWRzOiBbXX0pO1xuICAgICAgdXJsU2xvdC51aWRzLnB1c2goZS51aWQpO1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8ucGFnZSAmJiAhdXJsU2xvdC5wYWdlKSB1cmxTbG90LnBhZ2UgPSBlLnNjcmVlbnNob3QucGFnZTtcblxuICAgICAgY29uc3QgcHVzaEZpbGUgPSAocmVsOiBzdHJpbmcgfCB1bmRlZmluZWQsIGtpbmQ6ICdlbGVtZW50JyB8ICdncm91cCcgfCAncGFnZScpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCFyZWwgfHwgc2VlbkZpbGUuaGFzKHJlbCkpIHJldHVybjtcbiAgICAgICAgc2VlbkZpbGUuYWRkKHJlbCk7XG4gICAgICAgIGNvbnN0IGluQXJjaGl2ZSA9IGJ1bmRsZWQuaGFzKHJlbCk7XG4gICAgICAgIGZpbGVzLnB1c2goe1xuICAgICAgICAgIHBhdGg6IHJlbCxcbiAgICAgICAgICBhcmNoaXZlUGF0aDogaW5BcmNoaXZlID8gYXJjaGl2ZUxlYWYocmVsKSA6IG51bGwsXG4gICAgICAgICAga2luZCwgdWlkOiBlLnVpZCwgbjogZS5uLFxuICAgICAgICAgIHNlbGVjdG9yOiBlLnNlbGVjdG9yLCB1cmw6IGUudXJsLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBwdXNoRmlsZShlLnNjcmVlbnNob3Q/LmVsZW1lbnQsICdlbGVtZW50Jyk7XG4gICAgICBwdXNoRmlsZShlLnNjcmVlbnNob3Q/Lmdyb3VwLCAnZ3JvdXAnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8ucGFnZSwgJ3BhZ2UnKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0ID0ge1xuICAgICAgdjogMixcbiAgICAgIGtpbmQ6ICdwaW5jaGdyYWIvc2NyZWVuc2hvdHMtaW5kZXgnLFxuICAgICAgZ2VuZXJhdGVkOiBub3dJc28gPz8gZXhwb3J0Tm93SXNvKCksXG4gICAgICBjb3VudHM6IHtcbiAgICAgICAgZmlsZXM6IGZpbGVzLmxlbmd0aCxcbiAgICAgICAgYnVuZGxlZDogZmlsZXMuZmlsdGVyKChmKSA9PiBmLmFyY2hpdmVQYXRoKS5sZW5ndGgsXG4gICAgICAgIGNhcHR1cmVzOiBPYmplY3Qua2V5cyhieVVpZCkubGVuZ3RoLFxuICAgICAgICB1cmxzOiBPYmplY3Qua2V5cyhieVVybCkubGVuZ3RoLFxuICAgICAgfSxcbiAgICAgIGJ5VWlkLFxuICAgICAgYnlVcmwsXG4gICAgICBmaWxlcyxcbiAgICB9O1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvdXQsIG51bGwsIDIpICsgJ1xcbic7XG4gIH07XG5cbiAgLy8gRGVjb2RlIGEgYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwuLi5gIFVSTCBpbnRvIHRoZSByYXcgUE5HIGJ5dGVzLlxuICBjb25zdCBkYXRhVXJsVG9CeXRlcyA9IChkYXRhVXJsOiBzdHJpbmcpOiBVaW50OEFycmF5ID0+IHtcbiAgICBjb25zdCBjb21tYSA9IGRhdGFVcmwuaW5kZXhPZignLCcpO1xuICAgIGlmIChjb21tYSA8IDApIHJldHVybiBuZXcgVWludDhBcnJheSgpO1xuICAgIGNvbnN0IGI2NCA9IGRhdGFVcmwuc2xpY2UoY29tbWEgKyAxKTtcbiAgICBjb25zdCBiaW5hcnkgPSBhdG9iKGI2NCk7XG4gICAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoYmluYXJ5Lmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIG91dFtpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgLy8gV2FsayB0aGUgbWVzc2FnZXMgYW5kIGdhdGhlciBldmVyeSBzY3JlZW5zaG90IHdlIHNob3VsZCBidW5kbGUuXG4gIC8vIFJldHVybnMgdGhlIHRhciBlbnRyaWVzIChlYWNoIGBzY3JlZW5zaG90cy88bGVhZj4ucG5nYCkgQU5EIHRoZSBzZXQgb2ZcbiAgLy8gd29ya3NwYWNlLXJlbGF0aXZlIFBORyBwYXRocyB0aGF0IGxhbmRlZCBpbiB0aGUgYXJjaGl2ZSAoZm9yIHRoZVxuICAvLyBtYW5pZmVzdCdzIFwiaW4tYXJjaGl2ZVwiIGNvbHVtbikuXG4gIGNvbnN0IGNvbGxlY3RTY3JlZW5zaG90RW50cmllcyA9ICgpOiB7ZW50cmllczogVGFyRW50cnlbXTsgYnVuZGxlZDogU2V0PHN0cmluZz59ID0+IHtcbiAgICBjb25zdCBlbnRyaWVzOiBUYXJFbnRyeVtdID0gW107XG4gICAgY29uc3QgYnVuZGxlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBwdXNoID0gKHJlbFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCwgZGF0YVVybDogc3RyaW5nIHwgdW5kZWZpbmVkKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXJlbFBhdGggfHwgIWRhdGFVcmwpIHJldHVybjtcbiAgICAgIGNvbnN0IGxlYWYgPSByZWxQYXRoLnNwbGl0KCcvJykucG9wKCkgPz8gcmVsUGF0aDtcbiAgICAgIGlmIChzZWVuLmhhcyhsZWFmKSkgcmV0dXJuOyAvLyBkZWR1cGUgd2l0aGluIGFyY2hpdmVcbiAgICAgIGNvbnN0IGJ5dGVzID0gZGF0YVVybFRvQnl0ZXMoZGF0YVVybCk7XG4gICAgICBpZiAoIWJ5dGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgZW50cmllcy5wdXNoKHtuYW1lOiBgc2NyZWVuc2hvdHMvJHtsZWFmfWAsIGRhdGE6IGJ5dGVzfSk7XG4gICAgICBidW5kbGVkLmFkZChyZWxQYXRoKTtcbiAgICAgIHNlZW4uYWRkKGxlYWYpO1xuICAgIH07XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHNlbCA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBjb25zdCB1cmwgPSBtLmVudHJ5LnVybDtcbiAgICAgIHB1c2gobS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50LCBzaG90c0Z1bGwuZ2V0KHNlbCkpO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwLCBzaG90c0Z1bGwuZ2V0KHNlbCkpO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UsIHNob3RzRnVsbC5nZXQoJ3BhZ2U6OicgKyB1cmwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHtlbnRyaWVzLCBidW5kbGVkfTtcbiAgfTtcblxuICAvLyBGdWxsLXBhZ2UgSFRNTCBlbnRyaWVzIChvcHQtaW4gaW5jbHVkZVBhZ2VIVE1MIHByZWYpLiBDb2xsZWN0ZWQgTEFaSUxZXG4gIC8vIGF0IGV4cG9ydCB0aW1lIGZyb20gd2hpY2hldmVyIGxpdmUgdGFicyBzdGlsbCBzaG93IGEgY2FwdHVyZWQgVVJMIOKAlFxuICAvLyBuZXZlciBwZXJzaXN0ZWQgdG8gY2hyb21lLnN0b3JhZ2UsIHNvIGJpZyBkb2N1bWVudHMgY2FuJ3QgZXZpY3RcbiAgLy8gZnVsbC1yZXMgc2NyZWVuc2hvdHMgZnJvbSB0aGUgcXVvdGEuIFVSTHMgd2l0aCBubyBsaXZlIHRhYiBhcmUgcmVjb3JkZWRcbiAgLy8gYXMgaW5mby1sZXZlbCBkaWFnbm9zdGljcyBpbnN0ZWFkIG9mIGZhaWxpbmcgdGhlIGV4cG9ydC5cbiAgY29uc3QgcGFnZUh0bWxTbHVnID0gKHVybDogc3RyaW5nLCB0YWtlbjogU2V0PHN0cmluZz4pOiBzdHJpbmcgPT4ge1xuICAgIGxldCBzbHVnID0gJ3BhZ2UnO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB1ID0gbmV3IFVSTCh1cmwpO1xuICAgICAgc2x1ZyA9IGAke3UuaG9zdH0ke3UucGF0aG5hbWV9YC5yZXBsYWNlKC9cXC8rJC8sICcnKS5yZXBsYWNlKC9bXlxcdy4tXSsvZywgJ18nKS5zbGljZSgwLCA4MCkgfHwgdS5ob3N0O1xuICAgIH0gY2F0Y2ggeyAvKiBrZWVwIGZhbGxiYWNrICovIH1cbiAgICBsZXQgdW5pcXVlID0gc2x1ZztcbiAgICBmb3IgKGxldCBpID0gMjsgdGFrZW4uaGFzKHVuaXF1ZSk7IGkrKykgdW5pcXVlID0gYCR7c2x1Z31+JHtpfWA7XG4gICAgdGFrZW4uYWRkKHVuaXF1ZSk7XG4gICAgcmV0dXJuIHVuaXF1ZTtcbiAgfTtcbiAgY29uc3QgY29sbGVjdFBhZ2VIdG1sRW50cmllcyA9IGFzeW5jICgpOiBQcm9taXNlPHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBwYWdlc01ldGE6IEFycmF5PHt1cmw6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn0+OyBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdfT4gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBwYWdlc01ldGE6IEFycmF5PHt1cmw6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn0+ID0gW107XG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IEV4cG9ydERpYWdub3N0aWNbXSA9IFtdO1xuICAgIGlmICghcHJlZnMuaW5jbHVkZVBhZ2VIVE1MIHx8ICFpbkV4dGVuc2lvbikgcmV0dXJuIHtlbnRyaWVzLCBwYWdlc01ldGEsIGRpYWdub3N0aWNzfTtcbiAgICBjb25zdCB1cmxzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InICYmIG0uZW50cnkudXJsKSB1cmxzLmFkZChtLmVudHJ5LnVybCk7XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJyAmJiBtLnVybCkgdXJscy5hZGQobS51cmwpO1xuICAgIH1cbiAgICBpZiAoIXVybHMuc2l6ZSkgcmV0dXJuIHtlbnRyaWVzLCBwYWdlc01ldGEsIGRpYWdub3N0aWNzfTtcbiAgICBsZXQgdGFiczogY2hyb21lLnRhYnMuVGFiW10gPSBbXTtcbiAgICB0cnkgeyB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe30pOyB9IGNhdGNoIHsgLyogZmFsbCB0aHJvdWdoIHRvIGRpYWdub3N0aWNzICovIH1cbiAgICBjb25zdCB0YWtlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgdXJsIG9mIFsuLi51cmxzXS5zb3J0KCkpIHtcbiAgICAgIGNvbnN0IHRhYiA9IHRhYnMuZmluZCgodCkgPT4gdC51cmwgPT09IHVybCkgPz8gdGFicy5maW5kKCh0KSA9PiAodC51cmwgPz8gJycpLnNwbGl0KCcjJylbMF0gPT09IHVybC5zcGxpdCgnIycpWzBdKTtcbiAgICAgIGxldCBodG1sOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICBpZiAodGFiPy5pZCAhPSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHBnKHtraW5kOiAncGFnZS1odG1sJ30pKSBhcyB7b2s/OiBib29sZWFuOyBodG1sPzogc3RyaW5nfSB8IHVuZGVmaW5lZDtcbiAgICAgICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5Lmh0bWwpIGh0bWwgPSByZXBseS5odG1sO1xuICAgICAgICB9IGNhdGNoIHsgLyogdGFiIGhhcyBubyBsaXZlIGNvbnRlbnQgc2NyaXB0ICovIH1cbiAgICAgIH1cbiAgICAgIGlmICghaHRtbCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtzZXZlcml0eTogJ2luZm8nLCBjb2RlOiAnUEFHRV9IVE1MX1VOQVZBSUxBQkxFJywgZGV0YWlsOiB1cmx9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBhcmNoaXZlUGF0aCA9IGBwYWdlcy8ke3BhZ2VIdG1sU2x1Zyh1cmwsIHRha2VuKX0uaHRtbGA7XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGFyY2hpdmVQYXRoLCBkYXRhOiBodG1sfSk7XG4gICAgICBwYWdlc01ldGEucHVzaCh7dXJsLCBhcmNoaXZlUGF0aCwgYnl0ZXM6IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShodG1sKS5sZW5ndGh9KTtcbiAgICB9XG4gICAgcmV0dXJuIHtlbnRyaWVzLCBwYWdlc01ldGEsIGRpYWdub3N0aWNzfTtcbiAgfTtcblxuICBjb25zdCBvbkV4cG9ydFppcCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gZXhwb3J0Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAvLyBPbmUgY2xvY2sgKyBvbmUgY29udGVudCBoYXNoIHBlciBleHBvcnQ6IGV2ZXJ5IHRpbWVzdGFtcCBhbmQgdGhlXG4gICAgLy8gZmlsZW5hbWUgc3RlbSBkZXJpdmUgZnJvbSB0aGVzZSBzbyByZS1leHBvcnRpbmcgdW5jaGFuZ2VkIGNvbnRlbnRcbiAgICAvLyBwcm9kdWNlcyB0aGUgc2FtZSBmaWxlbmFtZSAob3ZlcndyaXR0ZW4sIG5vdCBkdXBsaWNhdGVkKSBhbmQg4oCUIHdpdGhcbiAgICAvLyBhIGZyb3plbiBjbG9jayDigJQgYnl0ZS1pZGVudGljYWwgYXJjaGl2ZXMuXG4gICAgY29uc3QgZXhwb3J0ZWRBdElzbyA9IGV4cG9ydE5vd0lzbygpO1xuICAgIGNvbnN0IG10aW1lU2VjID0gTWF0aC5mbG9vcihEYXRlLnBhcnNlKGV4cG9ydGVkQXRJc28pIC8gMTAwMCk7XG4gICAgY29uc3Qge2VudHJpZXM6IHNob3RFbnRyaWVzLCBidW5kbGVkfSA9IGNvbGxlY3RTY3JlZW5zaG90RW50cmllcygpO1xuICAgIGNvbnN0IGNvbnRlbnRIYXNoID0gYXdhaXQgY29tcHV0ZUNvbnRlbnRIYXNoKHNob3RFbnRyaWVzLm1hcCgoZSkgPT4gZS5uYW1lKSk7XG4gICAgY29uc3QgYnVuZGxlSWQgPSBjb250ZW50SGFzaC5zbGljZSgwLCAxNik7XG4gICAgY29uc3QgYXJjaGl2ZU5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCd0YXIuenN0JywgY29udGVudEhhc2guc2xpY2UoMCwgOCkpO1xuICAgIGNvbnN0IHN0ZW0gPSBhcmNoaXZlTmFtZS5yZXBsYWNlKC9cXC50YXJcXC56c3QkLywgJycpO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IGAke3N0ZW19Lmpzb25sYDtcbiAgICBjb25zdCBtYW5pZmVzdE9wdHMgPSB7bm93SXNvOiBleHBvcnRlZEF0SXNvLCBidW5kbGVJZH07XG4gICAgY29uc3QgbWFuaWZlc3QgPSBidWlsZE1hbmlmZXN0KGFyY2hpdmVOYW1lLCAndGFyLnpzdCcsIG1hbmlmZXN0T3B0cyk7XG4gICAgLy8gTG9hZCB0aGUgdGFyLWJvdW5kIGV4dHJhcyBCRUZPUkUgdGhlIGRvY3MgcmVuZGVyIHNvIHRoZSBSRUFETUUgYW5kXG4gICAgLy8gbWFuaWZlc3QgY2FuIGRlc2NyaWJlIGV4YWN0bHkgd2hhdCBzaGlwczogdmVuZG9yZWQgc2tpbGxzICgrIHBhcnNlZFxuICAgIC8vIHNraWxscyBpbmRleCkgYW5kIG9wdC1pbiBmdWxsLXBhZ2UgSFRNTC5cbiAgICBjb25zdCBza2lsbEVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBsZXQgc2tpbGxzSW5kZXg6IFNraWxsc0luZGV4IHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKHByZWZzLmJ1bmRsZVNraWxscyAmJiBCVU5ETEVEX1NLSUxMU19QUkVTRU5UKSB7XG4gICAgICBjb25zdCBsb2FkZWQgPSBhd2FpdCBQcm9taXNlLmFsbChCVU5ETEVEX1NLSUxMX0ZJTEVTLm1hcChhc3luYyAoZikgPT4gKHtmLCBkYXRhOiBhd2FpdCBsb2FkQnVuZGxlZFNraWxsRmlsZShmLmV4dCl9KSkpO1xuICAgICAgbGV0IHNraXBwZWQgPSAwO1xuICAgICAgZm9yIChjb25zdCB7ZiwgZGF0YX0gb2YgbG9hZGVkKSB7XG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHsgc2tpcHBlZCsrOyBjb250aW51ZTsgfVxuICAgICAgICBza2lsbEVudHJpZXMucHVzaCh7bmFtZTogZi5hcmNoaXZlLCBkYXRhfSk7XG4gICAgICAgIGlmIChmLmFyY2hpdmUgPT09ICdza2lsbHMtaW5kZXguanNvbicpIHtcbiAgICAgICAgICB0cnkgeyBza2lsbHNJbmRleCA9IEpTT04ucGFyc2UoZGF0YSkgYXMgU2tpbGxzSW5kZXg7IH0gY2F0Y2ggeyAvKiB1bnJlYWRhYmxlIGluZGV4IOKAlCB0YWJsZSBkZWdyYWRlcyAqLyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChza2lwcGVkKSBjb25zb2xlLndhcm4oTE9HLCBgYnVuZGxlZCBza2lsbHM6ICR7c2tpcHBlZH0vJHtsb2FkZWQubGVuZ3RofSBmaWxlcyBtaXNzaW5nIGZyb20gdGhpcyBidWlsZCDigJQgZXhwb3J0IGNvbnRpbnVlcyB3aXRob3V0IHRoZW1gKTtcbiAgICB9XG4gICAgY29uc3Qge2VudHJpZXM6IHBhZ2VIdG1sRW50cmllcywgcGFnZXNNZXRhLCBkaWFnbm9zdGljczogcGFnZUh0bWxEaWFnbm9zdGljc30gPSBhd2FpdCBjb2xsZWN0UGFnZUh0bWxFbnRyaWVzKCk7XG4gICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA9IHthcmNoaXZlUGF0aDogJ0FHRU5ULVBST1RPQ09MLm1kJ307XG4gICAgaWYgKHNraWxsc0luZGV4Py5za2lsbHM/Lmxlbmd0aCkge1xuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscyA9IHNraWxsc0luZGV4LnNraWxscy5tYXAoKHMpID0+ICh7XG4gICAgICAgIGlkOiBzLmlkLFxuICAgICAgICBraW5kOiBzLmlkLnN0YXJ0c1dpdGgoJ2ltcGVjY2FibGUvJykgPyAncmVmZXJlbmNlJyBhcyBjb25zdCA6ICdza2lsbCcgYXMgY29uc3QsXG4gICAgICAgIGFyY2hpdmVQYXRoOiBzLnBhdGgsXG4gICAgICAgIC4uLihzLmludm9rZSA/IHtpbnZvY2F0aW9uOiBzLmludm9rZX0gOiB7fSksXG4gICAgICB9KSk7XG4gICAgfVxuICAgIGlmIChwYWdlc01ldGEubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5wYWdlc0h0bWwgPSBwYWdlc01ldGE7XG4gICAgICBtYW5pZmVzdC5jb3VudHMucGFnZXNIdG1sID0gcGFnZXNNZXRhLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKHBhZ2VIdG1sRGlhZ25vc3RpY3MubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5leHBvcnREaWFnbm9zdGljcyA9IFsuLi4obWFuaWZlc3QuZXhwb3J0RGlhZ25vc3RpY3MgPz8gW10pLCAuLi5wYWdlSHRtbERpYWdub3N0aWNzXTtcbiAgICB9XG4gICAgLy8gVGhlIEpTT05MIGluc2lkZSB0aGUgYXJjaGl2ZSBtdXN0IGRlY2xhcmUgaXRzZWxmIGFzIHBhcnQgb2YgYVxuICAgIC8vIHRhci56c3QgYnVuZGxlIHNvIGl0cyBtYW5pZmVzdCdzIGBkZXNpZ24uaW5saW5lYCAvIGBza2lsbC5pbmxpbmVgXG4gICAgLy8gZmxhZ3MgbWF0Y2ggd2hhdCdzIGFjdHVhbGx5IHByZXNlbnQgaW4gdGhlIHN1cnJvdW5kaW5nIHRhci5cbiAgICBjb25zdCBqc29ubFRleHQgPSBidWlsZEpzb25sKGpzb25sTmFtZSwgJ3Rhci56c3QnLCBtYW5pZmVzdE9wdHMpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICBjb25zdCByZWFkbWUgPSBidWlsZFJlYWRtZShtYW5pZmVzdCwganNvbmxOYW1lLCBzaG90RW50cmllcy5sZW5ndGgpO1xuICAgIGNvbnN0IHNob3RzSnNvbiA9IGJ1aWxkU2NyZWVuc2hvdHNJbmRleChidW5kbGVkLCBleHBvcnRlZEF0SXNvKTtcblxuICAgIC8vIE1hcmtkb3duIGV4cG9ydCB3YXMgZHJvcHBlZDogaXQgY2FycmllZCBubyBkYXRhIHRoZSBKU09OTCBkaWRuJ3RcbiAgICAvLyBhbHJlYWR5IGhhdmUgKHRoZSBodW1hbi1yZWFkYWJsZSBzdXJmYWNlIHdhcyBqdXN0IGEgY3VyYXRlZCBzdWJzZXRcbiAgICAvLyBvZiB0aGUgc2FtZSBmaWVsZHMpLCBhbmQgdGhlIGRpdmVyZ2VuY2Ug4oCUIG1kIHNpbGVudGx5IGRyb3BwZWRcbiAgICAvLyBncm91cCBjaGlsZHJlbiArIHRoZSBlbnRpcmUgYF9hdWRpdGAgbmFtZXNwYWNlIOKAlCByaXNrZWRcbiAgICAvLyBtaXNsZWFkaW5nIGFueSBodW1hbiBza2ltLiBSRUFETUUubWQgaW5zaWRlIHRoZSBhcmNoaXZlIGlzIHRoZVxuICAgIC8vIGh1bWFuIGVudHJ5IHBvaW50IG5vdy5cbiAgICAvLyBCdWcgIzc6IGdlbmVyYXRlIHJlcGFpci1pbmRleC5tZCBhcyB0aGUgYWdlbnQncyBmaXJzdC1yZWFkIGVudHJ5XG4gICAgLy8gcG9pbnQuIEJ1ZyAjNDAgZmlyc3QtcmVhZCBvcmRlcjogUkVBRE1FIHBvaW50cyB0aGUgcmVjZWl2ZXIgYXRcbiAgICAvLyByZXBhaXItaW5kZXgubWQgYmVmb3JlIFNLSUxMLm1kIC8gREVTSUdOLm1kLlxuICAgIGNvbnN0IHJlcGFpckluZGV4ID0gYnVpbGRSZXBhaXJJbmRleChtYW5pZmVzdCwganNvbmxOYW1lKTtcbiAgICBjb25zdCB0YXJFbnRyaWVzOiBUYXJFbnRyeVtdID0gW1xuICAgICAge25hbWU6ICdSRUFETUUubWQnLCBkYXRhOiByZWFkbWV9LFxuICAgICAge25hbWU6ICdyZXBhaXItaW5kZXgubWQnLCBkYXRhOiByZXBhaXJJbmRleH0sXG4gICAgICB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBqc29ubFRleHR9LFxuICAgICAge25hbWU6ICdzY3JlZW5zaG90cy5qc29uJywgZGF0YTogc2hvdHNKc29ufSxcbiAgICAgIHtuYW1lOiAnZHVja2RiLnNxbCcsIGRhdGE6IHNxbH0sXG4gICAgICAvLyBCdWcgIzI4OiBtYWNoaW5lLXJlYWRhYmxlIEpTT04tU2NoZW1hIGZvciBldmVyeSByb3cgdHlwZS5cbiAgICAgIHtuYW1lOiAnc2NoZW1hLmpzb24nLCBkYXRhOiBidWlsZFNjaGVtYUpzb24oKX0sXG4gICAgICAuLi5zaG90RW50cmllcyxcbiAgICBdO1xuICAgIC8vIERFU0lHTi5tZCDigJQgZWl0aGVyIHRoZSB1c2VyJ3MgY3VzdG9taXplZCBjb250ZW50IG9yIHRoZSBidW5kbGVkXG4gICAgLy8gdGVtcGxhdGUgLyBsb2NhbCBvdmVycmlkZS4gUmVzb2x2ZWQgdGhyb3VnaCB0aGUgc2FtZSBsb2FkZXIgdGhlXG4gICAgLy8gc2V0dGluZ3MgbW9kYWwgdXNlcyBzbyBjaHJvbWUuc3RvcmFnZSBzdGF5cyBzbWFsbCAoZW1wdHkgcHJlZnNcbiAgICAvLyDihpIgZmFsbGJhY2sgdG8gZXh0ZW5zaW9uL3RlbXBsYXRlcy8qLm1kIHZpYSBmZXRjaCkuXG4gICAgY29uc3QgZGVzaWduQ29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgaWYgKGRlc2lnbkNvbnRlbnQudHJpbSgpKSB7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICdERVNJR04ubWQnLCBkYXRhOiBkZXNpZ25Db250ZW50fSk7XG4gICAgfVxuICAgIC8vIFBpbmNoR3JhYiBVSSBza2lsbCDigJQgc2FtZSBzdG9yeS4gTGl2ZXMgYXQgdGhlIGNhbm9uaWNhbCByZWNlaXZlclxuICAgIC8vIHBhdGggaW5zaWRlIHRoZSBhcmNoaXZlIHNvIHRoZSByZWNlaXZlcidzIGAuYWdlbnRzL2AgdHJlZSBjYW4gYmVcbiAgICAvLyBwb3B1bGF0ZWQgYnkgYSBzaW1wbGUgYHRhciAteGAgZnJvbSB0aGUgYXJjaGl2ZSByb290LlxuICAgIC8vXG4gICAgLy8gRnJvbnRtYXR0ZXIgcmVuYW1lOiBhIHVzZXIncyBzb3VyY2UgU0tJTEwubWQgbWF5IHVzZSBgbmFtZTogdWlgXG4gICAgLy8gKGJlY2F1c2UgdGhhdCdzIGhvdyBpdCdzIGNhdGFsb2d1ZWQgaW4gdGhlaXIgZ2xvYmFsIGAuYWdlbnRzL2BcbiAgICAvLyBza2lsbHMgdHJlZSkuIEluc2lkZSBhIFBpbmNoR3JhYiBhcmNoaXZlIHRoZSBza2lsbCBpcyAqdGhlKlxuICAgIC8vIFBpbmNoR3JhYiBza2lsbCwgc28gd2UgcmVicmFuZCB0aGUgZnJvbnRtYXR0ZXIgYG5hbWU6YCBmaWVsZCBvblxuICAgIC8vIHRoZSB3YXkgaW50byB0aGUgdGFyIHdpdGhvdXQgdG91Y2hpbmcgdGhlIGJvZHkuIE9ubHkgdGhlIEZJUlNUXG4gICAgLy8gYG5hbWU6YCBsaW5lIGluc2lkZSB0aGUgbGVhZGluZyBgLS0tYCBibG9jayBpcyByZXdyaXR0ZW4uXG4gICAgY29uc3Qgc2tpbGxDb250ZW50ID0gYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGlmIChza2lsbENvbnRlbnQudHJpbSgpKSB7XG4gICAgICBjb25zdCByZWJyYW5kZWQgPSByZWJyYW5kU2tpbGxOYW1lKHNraWxsQ29udGVudCwgJ1BpbmNoR3JhYicpO1xuICAgICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJywgZGF0YTogcmVicmFuZGVkfSk7XG4gICAgfVxuICAgIC8vIFZlbmRvcmVkIHNraWxscyArIG9wdC1pbiBwYWdlIEhUTUwgKGxvYWRlZCBhYm92ZSwgYmVmb3JlIHRoZSBkb2NzKS5cbiAgICB0YXJFbnRyaWVzLnB1c2goLi4uc2tpbGxFbnRyaWVzLCAuLi5wYWdlSHRtbEVudHJpZXMpO1xuICAgIC8vIEFHRU5ULVBST1RPQ09MLm1kIOKAlCB0aGUgZnVsbCBTZW5kLXRvLUFnZW50IGRvY3RyaW5lLiBIeWRyYXRlZCBsYXN0IHNvXG4gICAgLy8gaXRzIGJ1bmRsZSB0cmVlIHJlZmxlY3RzIGV2ZXJ5IGVudHJ5IGFib3ZlIChwbHVzIGl0c2VsZik7IHRoZSBzYW1lXG4gICAgLy8gb3B0aW9ucyByZWJ1aWxkIHRoZSBjbGlwYm9hcmQgcGF5bG9hZCBhZnRlciB0aGUgc2F2ZSByZXNvbHZlcyB0aGVcbiAgICAvLyByZWFsIGFic29sdXRlIGFyY2hpdmUgcGF0aC5cbiAgICBjb25zdCBlbnRyeU5hbWVzRm9yRG9jcyA9IFsuLi50YXJFbnRyaWVzLm1hcCgoZSkgPT4gZS5uYW1lKSwgJ0FHRU5ULVBST1RPQ09MLm1kJ10uc29ydCgpO1xuICAgIGNvbnN0IGFnZW50UHJvbXB0T3B0cyA9IHtcbiAgICAgIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICBidW5kbGVJZCxcbiAgICAgIGFyY2hpdmVQYXRoOiBhcmNoaXZlTmFtZSxcbiAgICAgIGV4cG9ydFRzOiBleHBvcnRlZEF0SXNvLFxuICAgICAganNvbmxOYW1lLFxuICAgICAgY291bnRzOiB7Y29tbWVudHM6IG1hbmlmZXN0LmNvdW50cy5mZWVkYmFjaywgc2VsZWN0b3JzOiBtYW5pZmVzdC5jb3VudHMuc2VsZWN0b3JzLCBwYWdlczogbWFuaWZlc3QuY291bnRzLnBhZ2VzLCBzY3JlZW5zaG90czogc2hvdEVudHJpZXMubGVuZ3RofSxcbiAgICAgIGVudHJ5TmFtZXM6IGVudHJ5TmFtZXNGb3JEb2NzLFxuICAgICAgZGVzaWduSXNUZW1wbGF0ZTogaXNVc2luZ1RlbXBsYXRlRGVzaWduKCksXG4gICAgfTtcbiAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICdBR0VOVC1QUk9UT0NPTC5tZCcsIGRhdGE6IGJ1aWxkQWdlbnRQcm90b2NvbE1kKHsuLi5hZ2VudFByb21wdE9wdHMsIHNraWxsc0luZGV4fSl9KTtcbiAgICAvLyBSZWJ1aWxkIHRoZSBtYW5pZmVzdCBsaW5lIGluIHRoZSBKU09OTCB3aXRoIGFyY2hpdmVJbnRlZ3JpdHlcbiAgICAvLyAoZmlsZSBsaXN0ICsgc2l6ZXMpLiBIYXMgdG8gaGFwcGVuIEFGVEVSIGFsbCB0YXJFbnRyaWVzIGFyZVxuICAgIC8vIGFzc2VtYmxlZCBidXQgQkVGT1JFIHdlIHRhciB0aGVtLCBzbyB3ZSBrbm93IHdoYXQncyBpbiB0aGVcbiAgICAvLyBidW5kbGUuIFRoZW4gd2UgcmVwbGFjZSB0aGUgSlNPTkwncyBtYW5pZmVzdCB3aXRoIHRoZSBhdWdtZW50ZWRcbiAgICAvLyB2ZXJzaW9uLlxuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbnRlZ3JpdHk6IHtmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT59ID0ge2ZpbGVzOiBbXX07XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykge1xuICAgICAgICBjb25zdCBkYXRhID0gdHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycgPyBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoZS5kYXRhKSA6IChlLmRhdGEgYXMgVWludDhBcnJheSk7XG4gICAgICAgIGludGVncml0eS5maWxlcy5wdXNoKHtwYXRoOiBlLm5hbWUsIHNpemU6IGRhdGEubGVuZ3RofSk7XG4gICAgICB9XG4gICAgICAvLyBSZS1lbWl0IHRoZSBKU09OTCB3aXRoIHRoZSBhdWdtZW50ZWQgbWFuaWZlc3QuIENoZWFwZXIgdG8gZG9cbiAgICAgIC8vIHRoaXMgcmUtcmVuZGVyIHRoYW4gdG8gbWFpbnRhaW4gbXV0YWJsZSBzdGF0ZSB0aHJvdWdoIHRoZSBzbGltXG4gICAgICAvLyBlbWl0LiBXZSBzd2FwIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgaW4tcGxhY2UuXG4gICAgICBjb25zdCBhdWdtZW50ZWRNYW5pZmVzdCA9IHsuLi5tYW5pZmVzdCwgYXJjaGl2ZUludGVncml0eTogaW50ZWdyaXR5fTtcbiAgICAgIGNvbnN0IGxpbmVzID0ganNvbmxUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgIGxpbmVzWzBdID0gSlNPTi5zdHJpbmdpZnkoYXVnbWVudGVkTWFuaWZlc3QpO1xuICAgICAgY29uc3QgbmV3SnNvbmwgPSBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICAgIGNvbnN0IGlkeCA9IHRhckVudHJpZXMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IGpzb25sTmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHRhckVudHJpZXNbaWR4XSA9IHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IG5ld0pzb25sfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdhcmNoaXZlSW50ZWdyaXR5IGNvbXB1dGF0aW9uIGZhaWxlZCcsIGVycik7XG4gICAgfVxuXG4gICAgLy8gU3RhbXAgZXZlcnkgZW50cnkgd2l0aCB0aGUgZXhwb3J0IGNsb2NrIHNvIGFyY2hpdmUgYnl0ZXMgYXJlIGEgcHVyZVxuICAgIC8vIGZ1bmN0aW9uIG9mIGNvbnRlbnQgKyBjbG9jayAoYnVpbGRUYXIgd291bGQgb3RoZXJ3aXNlIHNhbXBsZSBub3coKSkuXG4gICAgZm9yIChjb25zdCBlIG9mIHRhckVudHJpZXMpIGUubXRpbWUgPz89IG10aW1lU2VjO1xuICAgIGNvbnN0IHRhckJ5dGVzID0gYnVpbGRUYXIodGFyRW50cmllcyk7XG4gICAgY29uc3QgYXJjaGl2ZUJ5dGVzID0gd3JhcFpzdGQodGFyQnl0ZXMpO1xuXG4gICAgLy8gQ29weSB0aGUgU2VuZC10by1BZ2VudCBwYXlsb2FkIE5PVywgd2hpbGUgdGhlIGNsaWNrJ3MgZm9jdXMgaXMgc3RpbGxcbiAgICAvLyBmcmVzaDogdGhlIHNhdmUgYmVsb3cgY2FuIHRha2Ugc2Vjb25kcyAoc2NyZWVuc2hvdCBiYXRjaGVzLCBkb3dubG9hZFxuICAgIC8vIGNvbXBsZXRpb24gcG9sbGluZykgYW5kIENocm9tZSdzIGRvd25sb2FkIFVJIGNhbiBzdGVhbCBmb2N1cywgd2hpY2hcbiAgICAvLyBtYWtlcyBuYXZpZ2F0b3IuY2xpcGJvYXJkIHdyaXRlcyBmYWlsIHNpbGVudGx5LiBUaGUgcHJlZGljdGVkIHBhdGggaXNcbiAgICAvLyB0aGUgc3RhYmxlIERvd25sb2Fkcy1yZWxhdGl2ZSBmb3JtICh0aGUgYm9vdHN0cmFwIGV4cGFuZHMgdGhlIH4pO1xuICAgIC8vIG9uY2UgdGhlIHNhdmUgcmVzb2x2ZXMgd2UgcmUtY29weSB3aXRoIHRoZSByZWFsIGFic29sdXRlIHBhdGgsXG4gICAgLy8gYmVzdC1lZmZvcnQg4oCUIGlmIHRoYXQgb25lIGZhaWxzLCB0aGlzIGNvcHkgYWxyZWFkeSBzdGFuZHMuXG4gICAgY29uc3QgcHJlZGljdGVkUGF0aCA9IGB+L0Rvd25sb2Fkcy9waW5jaGdyYWIvJHthY3RpdmVXc30vZXhwb3J0cy8ke2FyY2hpdmVOYW1lfWA7XG4gICAgbGFzdEV4cG9ydC5hZ2VudFByb21wdCA9IGJ1aWxkQWdlbnRQcm9tcHRKc29ubCh7Li4uYWdlbnRQcm9tcHRPcHRzLCBhcmNoaXZlUGF0aDogcHJlZGljdGVkUGF0aH0pO1xuICAgIGNvbnN0IGVhcmx5Q29waWVkID0gYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQpO1xuXG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdvbkV4cG9ydEFyY2hpdmUg4oaSJywge2FyY2hpdmVOYW1lLCB0YXJCeXRlczogdGFyQnl0ZXMubGVuZ3RoLCBhcmNoaXZlQnl0ZXM6IGFyY2hpdmVCeXRlcy5sZW5ndGgsIHNjcmVlbnNob3RzOiBzaG90RW50cmllcy5sZW5ndGh9KTtcbiAgICAgIC8vIFBhc3MgYXMgYSBwbGFpbiBudW1iZXJbXSBvdmVyIHNlbmRNZXNzYWdlOyBzdHJ1Y3R1cmVkLWNsb25lIG9mXG4gICAgICAvLyBVaW50OEFycmF5IHZpYSBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBpc24ndCByZWxpYWJsZSBhY3Jvc3NcbiAgICAgIC8vIENocm9tZSB2ZXJzaW9ucy5cbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzYXZlLWJ5dGVzJywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWU6IGFyY2hpdmVOYW1lLFxuICAgICAgICBieXRlczogQXJyYXkuZnJvbShhcmNoaXZlQnl0ZXMpLCBtaW1lOiAnYXBwbGljYXRpb24venN0ZCcsXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICAvLyBSZWZyZXNoIHRoZSBhbHJlYWR5LWNvcGllZCBwYXlsb2FkIHdpdGggdGhlIFJFQUwgc2F2ZWQgcGF0aC5cbiAgICAgICAgLy8gQmVzdC1lZmZvcnQ6IGZvY3VzIG1heSBiZSBnb25lIGJ5IG5vdywgYW5kIHRoZSBlYXJseSBjb3B5IGFib3ZlXG4gICAgICAgIC8vIGFscmVhZHkgaG9sZHMgYSB2YWxpZCBwYXlsb2FkIChwcmVkaWN0ZWQgfi9Eb3dubG9hZHMgcGF0aCkuXG4gICAgICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQgPSBidWlsZEFnZW50UHJvbXB0SnNvbmwoey4uLmFnZW50UHJvbXB0T3B0cywgYXJjaGl2ZVBhdGg6IHBhdGhUb0NvcHl9KTtcbiAgICAgICAgY29uc3QgbGF0ZUNvcGllZCA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICAgICAgY29uc3QgcHJvbXB0Q29waWVkID0gbGF0ZUNvcGllZCB8fCBlYXJseUNvcGllZDtcbiAgICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgICAgaWYgKHByb21wdENvcGllZCkgc2hvd0NvcGllZCgnU2VudCB0byBhZ2VudCcsICdwcm9tcHQgY29waWVkIOKAlCBwYXN0ZSBpbnRvIHlvdXIgY29kaW5nIGFnZW50Jyk7XG4gICAgICAgIHNldFN0YXR1cyhcbiAgICAgICAgICBgU2VudCB0byBhZ2VudCDCtyAke3Nob3RFbnRyaWVzLmxlbmd0aH0gc2NyZWVuc2hvdCR7c2hvdEVudHJpZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IGJ1bmRsZWQke3Byb21wdENvcGllZCA/ICcgwrcgcHJvbXB0IGNvcGllZCcgOiAnIMK3IGNsaXBib2FyZCBibG9ja2VkIOKAlCB1c2UgQ21kK0sg4oaSIENvcHkgU2VuZC10by1BZ2VudCBwcm9tcHQnfSR7bGFzdEV4cG9ydC50ZW1wUGF0aCA/ICcgwrcgUGxheXdyaWdodCB0ZW1wIGhpZGRlbicgOiAnJ30gwrcgJHtsZWFmfWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnb25FeHBvcnRBcmNoaXZlIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBBcmNoaXZlIGV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBUZXN0L2RldiBmYWxsYmFjazogc3ludGhlc2l6ZSBhIGRvd25sb2FkIGxpbmsuXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFthcmNoaXZlQnl0ZXMgYXMgdW5rbm93biBhcyBCbG9iUGFydF0sIHt0eXBlOiAnYXBwbGljYXRpb24venN0ZCd9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gYXJjaGl2ZU5hbWU7IGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAvLyBUaGUgcHJlZGljdGVkLXBhdGggcGF5bG9hZCB3YXMgYWxyZWFkeSBjb3BpZWQgYmVmb3JlIHRoZSBzYXZlLlxuICAgIHNob3dDb3BpZWQoJ1NlbnQgdG8gYWdlbnQnLCAncHJvbXB0IGNvcGllZCDigJQgcGFzdGUgaW50byB5b3VyIGNvZGluZyBhZ2VudCcpO1xuICAgIHNldFN0YXR1cyhgU2VudCB0byBhZ2VudCDCtyAke3Nob3RFbnRyaWVzLmxlbmd0aH0gc2NyZWVuc2hvdCR7c2hvdEVudHJpZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IGJ1bmRsZWQke2Vhcmx5Q29waWVkID8gJyDCtyBwcm9tcHQgY29waWVkJyA6ICcnfWApO1xuICB9O1xuXG4gIC8vIEJlc3QtZWZmb3J0IGNsaXBib2FyZCB3cml0ZSDigJQgbmV2ZXIgdGhyb3dzOyByZXR1cm5zIHdoZXRoZXIgdGhlXG4gIC8vIHdyaXRlIHN1Y2NlZWRlZCBzbyB0aGUgY2FsbGVyIGNhbiBhZGp1c3QgdGhlIHN0YXR1cyBtZXNzYWdlLlxuICAvLyBDbGlwYm9hcmQgd3JpdGVzIGNhbiBmYWlsIHdoZW4gdGhlIHBhbmVsIGRvZXNuJ3QgaGF2ZSBmb2N1cyBvciBpblxuICAvLyBzb21lIHRlc3QgaGFybmVzc2VzLCBhbmQgd2UgZG9uJ3Qgd2FudCB0aGF0IHRvIGJsb2NrIHRoZSBleHBvcnQuXG4gIGNvbnN0IGNvcHlUb0NsaXBib2FyZFNpbGVudCA9IGFzeW5jICh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTsgcmV0dXJuIHRydWU7IH1cbiAgICBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9O1xuICAvLyDilIDilIDilIAgRHVja0RCIHNuaXBwZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENhbm9uaWNhbCBTUUwgcmVjaXBlcyBmb3IgcXVlcnlpbmcgYSBKU09OTCBleHBvcnQuIENvcGllcyB0byBjbGlwYm9hcmRcbiAgLy8gYW5kIHByaW50cyBhIHN0YXR1cyBtZXNzYWdlIOKAlCB3ZSBkb24ndCBydW4gRHVja0RCIG91cnNlbHZlcywgdGhlIHVzZXJcbiAgLy8gcGlwZXMgdGhlIHNuaXBwZXQgaW50byBgZHVja2RiYCBvbiB0aGVpciBtYWNoaW5lLiBUaGUgcmVjaXBlcyB0YXJnZXRcbiAgLy8gcXVlc3Rpb25zIGEgVUktZW5naW5lZXIgTExNIHdvcmtmbG93IHRlbmRzIHRvIGFzazogbGlzdCBjYXB0dXJlcyBieVxuICAvLyBob3N0LCBmaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwsIGZpbmQgY2FwdHVyZXMgbWlzc2luZyBhIHNjcmVlbnNob3QsXG4gIC8vIGFuZCB1bmlxdWUtdG9rZW4gZnJlcXVlbmN5IGZvciBhIHF1aWNrIGRlc2lnbi10b2tlbnMgb3ZlcnZpZXcuXG4gIGNvbnN0IGR1Y2tEYlNuaXBwZXQgPSAoanNvbmxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4gYC0tIFBpbmNoR3JhYiDihpIgRHVja0RCIHJlY2lwZXNcbi0tIFNhdmUgeW91ciBKU09OTCBleHBvcnQsIHRoZW4gaW4geW91ciBzaGVsbDpcbi0tICAgZHVja2RiIDwgdGhpc19maWxlLnNxbFxuLS0gT3Igb3BlbiBhIGR1Y2tkYiBzaGVsbCBhbmQgcGFzdGUgdGhlc2Ugb25lIGF0IGEgdGltZS5cblxuLS0gMSkgTG9hZCB0aGUgSlNPTkwgaW50byBhIHRhYmxlLlxuLS0gICAgc2FtcGxlX3NpemU9LTEgZm9yY2VzIGEgZnVsbC1maWxlIHNjYW4gZm9yIHNjaGVtYSBpbmZlcmVuY2UuIFdpdGhvdXRcbi0tICAgIGl0LCBEdWNrREIgb25seSBzbmlmZnMgdGhlIGZpcnN0IDIwIDQ4MCByb3dzIOKAlCBhbmQgUGluY2hHcmFiIGV4cG9ydHNcbi0tICAgIG1peCBzZWxlY3RvciArIGZlZWRiYWNrIHJvdyB0eXBlcywgc28gcmFyZSBmZWVkYmFjay1vbmx5IGZpZWxkc1xuLS0gICAgKHRhZ3MsIHBhcmVudFVpZCkgY2FuIGJlIGRyb3BwZWQgZnJvbSB0aGUgaW5mZXJyZWQgc2NoZW1hIGlmIHRoZXlcbi0tICAgIGRvbid0IGFwcGVhciBlYXJseSBlbm91Z2guIFRoYXQgYml0ZXMgcmVjaXBlIDYgYmVsb3cuXG5DUkVBVEUgT1IgUkVQTEFDRSBUQUJMRSBwZyBBU1xuU0VMRUNUICogRlJPTSByZWFkX2pzb25fYXV0byhcbiAgJyR7anNvbmxOYW1lfScsXG4gIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLFxuICBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCxcbiAgc2FtcGxlX3NpemU9LTFcbik7XG5cbi0tIDIpIFF1aWNrIG92ZXJ2aWV3OiBob3cgbWFueSBjYXB0dXJlcyBwZXIgaG9zdC5cblNFTEVDVFxuICByZWdleHBfZXh0cmFjdCh1cmwsICc6Ly8oW14vXSspJywgMSkgQVMgaG9zdCxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJykgQVMgY2FwdHVyZXMsXG4gIENPVU5UKCopIEZJTFRFUiAoV0hFUkUgdHlwZSA9ICdmZWVkYmFjaycpIEFTIGNvbW1lbnRzXG5GUk9NIHBnXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBjYXB0dXJlcyBERVNDO1xuXG4tLSAzKSBGaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwgYWNyb3NzIGNhcHR1cmVzIChvZnRlbiBzaWduYWxzIGEgcmV1c2VkXG4tLSAgICBjb21wb25lbnQgdGhlIHVzZXIgaGFzIGNsaWNrZWQgaW50byBtdWx0aXBsZSB0aW1lcykuXG5TRUxFQ1Qgb3V0ZXJIVE1MLCBDT1VOVCgqKSBBUyBoaXRzLCBsaXN0KHNlbGVjdG9yKSBBUyBzZWxlY3RvcnNcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBvdXRlckhUTUwgSVMgTk9UIE5VTExcbkdST1VQIEJZIG91dGVySFRNTFxuSEFWSU5HIGhpdHMgPiAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDI1O1xuXG4tLSA0KSBDYXB0dXJlcyBzdGlsbCBtaXNzaW5nIGEgc2NyZWVuc2hvdCBwYXRoLlxuU0VMRUNUIG4sIHVybCwgc2VsZWN0b3JcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBzY3JlZW5zaG90IElTIE5VTExcbk9SREVSIEJZIG47XG5cbi0tIDUpIFF1aWNrIGRlc2lnbi10b2tlbiBzdXJmYWNlOiByYW5rIGNsYXNzZXMgdGhhdCBhcHBlYXIgaW4gbWFueSBjYXB0dXJlcy5cbi0tICAgIE5PVEU6IGZpbHRlciBjbGFzc2VzIElTIE5PVCBOVUxMIHJhdGhlciB0aGFuIHVzaW5nIGEgY29hbGVzY2Utd2l0aC1lbXB0eVxuLS0gICAgZmFsbGJhY2s7IER1Y2tEQiBjYW5ub3QgaW5mZXIgZWxlbWVudCB0eXBlcyBmb3IgYW4gZW1wdHkgbGlzdCBsaXRlcmFsLlxuV0lUSCBleHBhbmRlZCBBUyAoXG4gIFNFTEVDVCB1bm5lc3QoY2xhc3NlcykgQVMgY1xuICBGUk9NIHBnXG4gIFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBjbGFzc2VzIElTIE5PVCBOVUxMXG4pXG5TRUxFQ1QgYywgQ09VTlQoKikgQVMgaGl0c1xuRlJPTSBleHBhbmRlZFxuR1JPVVAgQlkgMVxuT1JERVIgQlkgaGl0cyBERVNDXG5MSU1JVCAzMDtcblxuLS0gNikgQ29tbWVudHMgam9pbmVkIHRvIHRoZWlyIHBhcmVudCBzZWxlY3RvciB2aWEgcGFyZW50VWlkLiBUaGVcbi0tICAgIHMudHlwZSBmaWx0ZXIgcHJldmVudHMgYW4gYWNjaWRlbnRhbCBmZWVkYmFja+KGlGZlZWRiYWNrIGpvaW4gaW4gY2FzZVxuLS0gICAgdHdvIHJvd3MgZXZlciBzaGFyZSBhIHVpZCBieSBjb2luY2lkZW5jZS5cblNFTEVDVCBzLm4sIHMuc2VsZWN0b3IsIGYudGV4dCwgZi50YWdzXG5GUk9NIHBnIGZcbkpPSU4gcGcgc1xuICBPTiBzLnVpZCA9IGYucGFyZW50VWlkXG4gQU5EIHMudHlwZSA9ICdzZWxlY3RvcidcbldIRVJFIGYudHlwZSA9ICdmZWVkYmFjaydcbk9SREVSIEJZIHMubjtcbmA7XG4gIGNvbnN0IG9uRHVja0RiU25pcHBldCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBQcmVmZXIgdGhlIEpTT05MIGZpbGVuYW1lIG9mIHRoZSBtb3N0IHJlY2VudCBleHBvcnQgc28gdGhlIHVzZXIgY2FuXG4gICAgLy8gcGFzdGUgdGhpcyBkaXJlY3RseSB3aXRob3V0IGVkaXRpbmcgdGhlIHJlYWRfanNvbl9hdXRvIHBhdGguIEZhbGxcbiAgICAvLyBiYWNrIHRvIGEgZnJlc2ggZXBvY2gtYmFzZWQgbmFtZSBpZiBub3RoaW5nIGhhcyBiZWVuIGV4cG9ydGVkIHlldC5cbiAgICBjb25zdCBsYXN0ID0gbGFzdEV4cG9ydC5yZWxQYXRoO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IChsYXN0ICYmIC9cXC5qc29ubCQvLnRlc3QobGFzdCkpXG4gICAgICA/IGxhc3Quc3BsaXQoJy8nKS5wb3AoKSEgIC8vIHN0cmlwIHdvcmtzcGFjZS9leHBvcnRzLyBwcmVmaXhcbiAgICAgIDogYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBzcWwgPSBkdWNrRGJTbmlwcGV0KGpzb25sTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNxbCk7XG4gICAgICBzZXRTdGF0dXMoYER1Y2tEQiByZWNpcGVzIGNvcGllZCDCtyBwYXN0ZSBpbnRvIFxcYGR1Y2tkYlxcYCBzaGVsbCDCtyByZWZlcmVuY2VzICR7anNvbmxOYW1lfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIER1Y2tEQiBTUUwnLCBqc29ubE5hbWUpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgZmFpbGVkIOKAlCBvcGVuIHRoZSBwYW5lbCBpbiBhbiBleHRlbnNpb24gY29udGV4dCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgJ09wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jyk7XG4gICAgfVxuICB9O1xuICAvLyDilIDilIDilIAgU2NoZW1hIG1pZ3JhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ29udmVydCBhIHYxLXNoYXBlZCBFbnRyeS1vci1leHBvcnQtbGluZSBpbnRvIG91ciBpbnRlcm5hbCBFbnRyeS4gSWRlbXBvdGVudC5cbiAgLy8gU3VwcG9ydHM6XG4gIC8vICAg4oCiIGZsYXQgdjEgZW50cnkgKG5vIGBfYXVkaXRgLCBubyBgdmAgZmllbGQpXG4gIC8vICAg4oCiIHYyIGV4cG9ydCBlbnRyeSAoaGFzIGBfYXVkaXRgLCBgdjogMmAsIGB0eXBlOiAnc2VsZWN0b3InYClcbiAgLy8gICDigKIgbWl4ZWQgKHNvbWUgZmllbGRzIG5lc3RlZCwgc29tZSBmbGF0IOKAlCBsYXN0IHdpbnMgZm9yIHNhZmV0eSlcbiAgLy8gUHVyZTogbmV2ZXIgbXV0YXRlcyBgcmF3YCBvciBhbnkgb2YgaXRzIG5lc3RlZCBvYmplY3RzLiBSZXR1cm5zIGEgbmV3XG4gIC8vIGVudHJ5IHdpdGggYWxsIG1pZ3JhdGlvbnMgYXBwbGllZC4gVG91Y2hlZCBzdWJvYmplY3RzIChhdHRycywgaGludHMsXG4gIC8vIGdyb3VwIG1lbWJlcnMpIGFyZSBjbG9uZWQgYmVmb3JlIGVkaXQ7IHVudG91Y2hlZCBvbmVzIHNoYXJlIHJlZnMgd2l0aFxuICAvLyByYXcsIHdoaWNoIGlzIGZpbmUgc2luY2Ugd2UgbmV2ZXIgd3JpdGUgdG8gdGhlbS5cbiAgY29uc3QgZGVub3JtYWxpemVFbnRyeSA9IChyYXc6IGFueSk6IEVudHJ5ID0+IHtcbiAgICBjb25zdCBvdXQ6IGFueSA9IHsuLi5yYXd9O1xuICAgIGRlbGV0ZSBvdXQudjtcbiAgICBkZWxldGUgb3V0LnR5cGU7XG4gICAgZGVsZXRlIG91dC5mZWVkYmFjaztcbiAgICBpZiAob3V0Ll9hdWRpdCAmJiB0eXBlb2Ygb3V0Ll9hdWRpdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IGEgPSBvdXQuX2F1ZGl0O1xuICAgICAgaWYgKGEuYW5jZXN0b3JzICE9PSB1bmRlZmluZWQpIG91dC5hbmNlc3RvcnMgPSBhLmFuY2VzdG9ycztcbiAgICAgIGlmIChhLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgb3V0LmNvbXBvbmVudFJvb3QgPSBhLmNvbXBvbmVudFJvb3Q7XG4gICAgICBpZiAoYS5pblNoYWRvd0RPTSAhPT0gdW5kZWZpbmVkKSBvdXQuaW5TaGFkb3dET00gPSBhLmluU2hhZG93RE9NO1xuICAgICAgaWYgKGEucHNldWRvRWxlbWVudHMgIT09IHVuZGVmaW5lZCkgb3V0LnBzZXVkb0VsZW1lbnRzID0gYS5wc2V1ZG9FbGVtZW50cztcbiAgICAgIGlmIChhLm1hdGNoZWRSdWxlcyAhPT0gdW5kZWZpbmVkKSBvdXQubWF0Y2hlZFJ1bGVzID0gYS5tYXRjaGVkUnVsZXM7XG4gICAgICBpZiAoYS52aWV3cG9ydCAhPT0gdW5kZWZpbmVkKSBvdXQudmlld3BvcnQgPSBhLnZpZXdwb3J0O1xuICAgICAgZGVsZXRlIG91dC5fYXVkaXQ7XG4gICAgfVxuICAgIC8vIHN0YXRlczogdjEgdXNlZCBSZWNvcmQ8c3RyaW5nLCB0cnVlPjsgdjIgdXNlcyBzdHJpbmdbXS4gTm9ybWFsaXplIGJvdGguXG4gICAgaWYgKG91dC5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkob3V0LnN0YXRlcykgJiYgdHlwZW9mIG91dC5zdGF0ZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICBvdXQuc3RhdGVzID0gT2JqZWN0LmtleXMob3V0LnN0YXRlcykuZmlsdGVyKChrKSA9PiBCb29sZWFuKChvdXQuc3RhdGVzIGFzIGFueSlba10pKTtcbiAgICB9XG4gICAgLy8gYXR0cnMuZm9ybWF0IOKGkiBoaW50cy5mb3JtYXQuIENsb25lIGF0dHJzIGZpcnN0IHNvIHdlIGRvbid0IG11dGF0ZSB0aGVcbiAgICAvLyBjYWxsZXIncyBuZXN0ZWQgb2JqZWN0LiBTYW1lIGZvciBoaW50cyAod2UgbWF5IG1lcmdlIGludG8gaXQpLlxuICAgIGlmIChvdXQuYXR0cnMgJiYgdHlwZW9mIG91dC5hdHRycyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG91dC5hdHRycy5mb3JtYXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBmbXQgPSBvdXQuYXR0cnMuZm9ybWF0O1xuICAgICAgY29uc3Qge2Zvcm1hdDogX2Ryb3AsIC4uLnJlc3RBdHRyc30gPSBvdXQuYXR0cnM7XG4gICAgICBvdXQuYXR0cnMgPSByZXN0QXR0cnM7XG4gICAgICBvdXQuaGludHMgPSB7Li4uKG91dC5oaW50cyA/PyB7fSksIGZvcm1hdDogZm10fTtcbiAgICB9XG4gICAgaWYgKCFvdXQudWlkKSBvdXQudWlkID0gbXNnSWQoKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvdXQuZ3JvdXApKSBvdXQuZ3JvdXAgPSBvdXQuZ3JvdXAubWFwKGRlbm9ybWFsaXplRW50cnkpO1xuICAgIHJldHVybiBvdXQgYXMgRW50cnk7XG4gIH07XG4gIC8vIFdhbGsgYWxsIGxvYWRlZCBtZXNzYWdlcyBhbmQgbWlncmF0ZSBhbnkgbGVnYWN5IGVudHJpZXMuIFJldHVybnMgdHJ1ZSBpZlxuICAvLyBhbnl0aGluZyBtdXRhdGVkIHNvIHRoZSBjYWxsZXIgY2FuIHBlcnNpc3QuXG4gIGNvbnN0IG1pZ3JhdGVMb2FkZWRNZXNzYWdlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICBsZXQgbXV0YXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBiZWZvcmUgPSBtLmVudHJ5O1xuICAgICAgLy8gQ2hlYXAgcHJlLWNoZWNrOiBpZiB1aWQgZXhpc3RzIEFORCBzdGF0ZXMgaXMgYW4gYXJyYXkgQU5EIG5vIF9hdWRpdFxuICAgICAgLy8gQU5EIG5vIGF0dHJzLmZvcm1hdCDihpIgbm90aGluZyB0byBkbywgc2tpcCB0aGUgd29yay5cbiAgICAgIGNvbnN0IG5lZWRzV29yayA9XG4gICAgICAgICFiZWZvcmUudWlkIHx8XG4gICAgICAgIChiZWZvcmUuc3RhdGVzICYmICFBcnJheS5pc0FycmF5KGJlZm9yZS5zdGF0ZXMpKSB8fFxuICAgICAgICAoYmVmb3JlIGFzIGFueSkuX2F1ZGl0ICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgKGJlZm9yZS5hdHRycyAmJiB0eXBlb2YgKGJlZm9yZS5hdHRycyBhcyBhbnkpLmZvcm1hdCA9PT0gJ3N0cmluZycpO1xuICAgICAgaWYgKCFuZWVkc1dvcmspIGNvbnRpbnVlO1xuICAgICAgbS5lbnRyeSA9IGRlbm9ybWFsaXplRW50cnkoYmVmb3JlKTtcbiAgICAgIG11dGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gbXV0YXRlZDtcbiAgfTtcbiAgY29uc3Qgb25JbXBvcnQgPSAoKTogdm9pZCA9PiBpbXBvcnRGaWxlLmNsaWNrKCk7XG4gIGltcG9ydEZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKGUpID0+IHtcbiAgICBjb25zdCBmaWxlID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzPy5bMF07XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgY29uc3QgaW1wb3J0ZWQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgZm9yIChjb25zdCBsaW5lIG9mIHRleHQuc3BsaXQoL1xccj9cXG4vKSkge1xuICAgICAgaWYgKCFsaW5lLnRyaW0oKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBvID0gSlNPTi5wYXJzZShsaW5lKTtcbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ21hbmlmZXN0Jykge1xuICAgICAgICAgIC8vIE1hbmlmZXN0IGxpbmUg4oCUIGluZm9ybWF0aW9uYWwgb25seSBvbiBpbXBvcnQuIFNraXAuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ3BhZ2UnKSBpbXBvcnRlZC5wdXNoKHt0eXBlOiAncGFnZScsIGlkOiBtc2dJZCgpLCB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHVybDogby51cmwsIHRpdGxlOiBvLnRpdGxlLCB2aWV3cG9ydDogby52aWV3cG9ydCwgdG9rZW5zOiBvLnRva2VucywgdXNlckFnZW50OiBvLnVzZXJBZ2VudCwgbGFuZzogby5sYW5nfSk7XG4gICAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dDogby50ZXh0LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKG8ucGFyZW50VWlkKSBmYi5wYXJlbnRVaWQgPSBvLnBhcmVudFVpZDtcbiAgICAgICAgICBpZiAoby5kZXRhY2hlZCkgZmIuZGV0YWNoZWQgPSB0cnVlO1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG8udGFncykgJiYgby50YWdzLmxlbmd0aCkgZmIudGFncyA9IG8udGFncztcbiAgICAgICAgICBpZiAoby5zZXZlcml0eSkgZmIuc2V2ZXJpdHkgPSBvLnNldmVyaXR5O1xuICAgICAgICAgIGltcG9ydGVkLnB1c2goZmIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHNlbGVjdG9yIGxpbmUg4oCUIGNvdWxkIGJlIHYxIChmbGF0KSBvciB2MiAod2l0aCBfYXVkaXQpLiBUaGVcbiAgICAgICAgICAvLyBidW5kbGVkIGZlZWRiYWNrIGFycmF5IG11c3QgYmUgc3BsaXQgb3V0IGludG8gc2VwYXJhdGUgZmVlZGJhY2tcbiAgICAgICAgICAvLyBtZXNzYWdlcyBmb3Igcm91bmQtdHJpcCB3aXRoIHYxIHJlYWRlcnMg4oCUIGJ1dCBpbiB2MiB3ZSBhbHJlYWR5XG4gICAgICAgICAgLy8gZW1pdCBzdGFuZGFsb25lIGZlZWRiYWNrIGxpbmVzLCBzbyBkcm9wcGluZyB0aGUgYnVuZGxlZCBsaXN0IGlzXG4gICAgICAgICAgLy8gc2FmZSB0byBhdm9pZCBkb3VibGUtY291bnRpbmcuXG4gICAgICAgICAgY29uc3QgZmIgPSBBcnJheS5pc0FycmF5KG8uZmVlZGJhY2spID8gby5mZWVkYmFjayA6IG51bGw7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSBkZW5vcm1hbGl6ZUVudHJ5KG8pO1xuICAgICAgICAgIGltcG9ydGVkLnB1c2goe3R5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIGVudHJ5fSk7XG4gICAgICAgICAgLy8gT25seSBpbmZsYXRlIGJ1bmRsZWQgZmVlZGJhY2sgaWYgdGhlIGZpbGUgaXMgdjEgKG5vIHZlcnNpb25cbiAgICAgICAgICAvLyBtYXJrZXIgb24gdGhlIHNlbGVjdG9yIGxpbmVzKS4gdjIgaGFzIGl0cyBvd24gc3RhbmRhbG9uZVxuICAgICAgICAgIC8vIGZlZWRiYWNrIGxpbmVzIHRoYXQgYXJyaXZlIHNlcGFyYXRlbHkuXG4gICAgICAgICAgaWYgKGZiICYmIG8udiAhPT0gMikge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0IG9mIGZiKSBpbXBvcnRlZC5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksXG4gICAgICAgICAgICAgIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgdGV4dDogdHlwZW9mIHQgPT09ICdzdHJpbmcnID8gdCA6IHQ/LnRleHQgPz8gJycsXG4gICAgICAgICAgICAgIHBhcmVudFVpZDogZW50cnkudWlkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHsgLyogc2tpcCBiYWQgbGluZSAqLyB9XG4gICAgfVxuICAgIG1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCAuLi5pbXBvcnRlZF07XG4gICAgcGVyc2lzdCgpO1xuICAgIGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoYEltcG9ydGVkICR7aW1wb3J0ZWQubGVuZ3RofSBtZXNzYWdlJHtpbXBvcnRlZC5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gKTtcbiAgICBpbXBvcnRGaWxlLnZhbHVlID0gJyc7XG4gIH0pO1xuICAvLyDilIDilIDilIAgV29ya3NwYWNlIHNuYXBzaG90IGhpc3Rvcnkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFBlcnNpc3RlbnQgKG5vdCB0aGUgaW4tc2Vzc2lvbiB1bmRvIHN0YWNrKS4gQSBDbGVhci1hbGwgYXJjaGl2ZXMgdGhlXG4gIC8vIGN1cnJlbnQgd29ya3NwYWNlIHN0YXRlIHNvIGl0IGNhbiBiZSByZXN0b3JlZCBmcm9tIFNldHRpbmdzIGxhdGVyLlxuICBsZXQgd3NTbmFwc2hvdHM6IFdvcmtzcGFjZVNuYXBzaG90W10gPSBbXTtcbiAgY29uc3QgbG9hZFdzU25hcHNob3RzID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHdzU25hcHNob3RzID0gKGF3YWl0IFN0b3JlLmdldDxXb3Jrc3BhY2VTbmFwc2hvdFtdPih3c1NuYXBzaG90c0tleShuYW1lKSwgW10pKSB8fCBbXTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFdzU25hcHNob3RzID0gKCk6IHZvaWQgPT4geyB2b2lkIFN0b3JlLnNldCh3c1NuYXBzaG90c0tleShhY3RpdmVXcyksIHdzU25hcHNob3RzKTsgfTtcbiAgLy8gQXJjaGl2ZSB0aGUgQ1VSUkVOVCB3b3Jrc3BhY2Ugc3RhdGUgKGJlZm9yZSBpdCdzIHdpcGVkKS4gTm8tb3AgaWYgZW1wdHkuXG4gIGNvbnN0IGFyY2hpdmVXb3Jrc3BhY2VTbmFwc2hvdCA9ICgpOiBXb3Jrc3BhY2VTbmFwc2hvdCB8IG51bGwgPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBzbmFwOiBXb3Jrc3BhY2VTbmFwc2hvdCA9IHtcbiAgICAgIGlkOiBzZWN1cmVUb2tlbig4KSxcbiAgICAgIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICBtZXNzYWdlczogc3RydWN0dXJlZENsb25lKG1lc3NhZ2VzKSxcbiAgICAgIHNob3RzOiBPYmplY3QuZnJvbUVudHJpZXMoc2hvdHMpLFxuICAgICAgc2VsZWN0b3JzOiBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubGVuZ3RoLFxuICAgICAgY29tbWVudHM6IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnZmVlZGJhY2snKS5sZW5ndGgsXG4gICAgfTtcbiAgICAvLyBOZXdlc3QgZmlyc3Q7IGNhcCB0aGUgaGlzdG9yeS5cbiAgICB3c1NuYXBzaG90cy51bnNoaWZ0KHNuYXApO1xuICAgIGlmICh3c1NuYXBzaG90cy5sZW5ndGggPiBXU19TTkFQU0hPVF9DQVApIHdzU25hcHNob3RzID0gd3NTbmFwc2hvdHMuc2xpY2UoMCwgV1NfU05BUFNIT1RfQ0FQKTtcbiAgICBwZXJzaXN0V3NTbmFwc2hvdHMoKTtcbiAgICByZXR1cm4gc25hcDtcbiAgfTtcbiAgY29uc3QgcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90ID0gKGlkOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBzbmFwID0gd3NTbmFwc2hvdHMuZmluZCgocykgPT4gcy5pZCA9PT0gaWQpO1xuICAgIGlmICghc25hcCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIFB1c2ggdGhlIGxpdmUgc3RhdGUgb250byB0aGUgaW4tc2Vzc2lvbiB1bmRvIHN0YWNrIHNvIGEgbWlzdGFrZW5cbiAgICAvLyByZXN0b3JlIGlzIGl0c2VsZiB1bmRvYWJsZS5cbiAgICBzbmFwc2hvdCgpO1xuICAgIG1lc3NhZ2VzID0gc3RydWN0dXJlZENsb25lKHNuYXAubWVzc2FnZXMpO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc25hcC5zaG90cykpIHNob3RzLnNldChrLCB2KTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIHBlcnNpc3RTaG90cygpO1xuICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHNldFN0YXR1cyhgUmVzdG9yZWQgc25hcHNob3QgwrcgJHtzbmFwLnNlbGVjdG9yc30gc2VsZWN0b3JzYCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIGNvbnN0IGRlbGV0ZVdvcmtzcGFjZVNuYXBzaG90ID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB3c1NuYXBzaG90cyA9IHdzU25hcHNob3RzLmZpbHRlcigocykgPT4gcy5pZCAhPT0gaWQpO1xuICAgIHBlcnNpc3RXc1NuYXBzaG90cygpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgfTtcblxuICBjb25zdCBvbkNsZWFyID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghY29uZmlybSgnQ2xlYXIgYWxsIGNhcHR1cmVzPyBBIHNuYXBzaG90IHdpbGwgYmUgc2F2ZWQgdG8gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMgZmlyc3QuJykpIHJldHVybjtcbiAgICAvLyBBcmNoaXZlIHRoZSB3b3Jrc3BhY2UgQkVGT1JFIHdpcGluZyBzbyBpdCBjYW4gYmUgcmVzdG9yZWQgbGF0ZXIuXG4gICAgY29uc3Qgc25hcCA9IGFyY2hpdmVXb3Jrc3BhY2VTbmFwc2hvdCgpO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBbXTtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgLy8gTmV2ZXIgY2xhaW0gYSBzbmFwc2hvdCB0aGF0IGRpZG4ndCBoYXBwZW4gKGVtcHR5IHdvcmtzcGFjZSBuby1vcHMpLlxuICAgIHNldFN0YXR1cyhzbmFwID8gJ0NsZWFyZWQgwrcgc25hcHNob3Qgc2F2ZWQg4oCUIHJlc3RvcmUgaW4gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMnIDogJ0NsZWFyZWQnKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgVmFsaWRhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgcnVuVmFsaWRhdGlvbiA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBbLi4ubmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3RvcikpXTtcbiAgICBpZiAoIXNlbGVjdG9ycy5sZW5ndGggfHwgIWluRXh0ZW5zaW9uKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICBpZiAoIXRhYnNbMF0pIHJldHVybjtcbiAgICAgIGxpdmVUYWJVcmwgPSB0YWJzWzBdLnVybCA/PyBsaXZlVGFiVXJsO1xuICAgICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YobGl2ZVRhYlVybCA/PyAnJyk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQhLCBwZyh7a2luZDogJ3ZhbGlkYXRlJywgc2VsZWN0b3JzfSkpIGFzIHt2YWxpZD86IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+fTtcbiAgICAgIGlmIChyZXBseT8udmFsaWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBbc2VsLCBva10gb2YgT2JqZWN0LmVudHJpZXMocmVwbHkudmFsaWQpKSB7XG4gICAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgICAgaWYgKCFvaykgc2VsZWN0b3JFcnJvcnMuc2V0KHNlbCwgJ05vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzIHRoaXMgc2VsZWN0b3IuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIHRhYiBub3QgcmVhZHkgKi8gfVxuICB9O1xuICBjb25zdCBvblZhbGlkYXRlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHNldFN0YXR1cygnUmUtY2hlY2tpbmfigKYnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHNldFN0YXR1cygnVmFsaWRhdGVkJyk7XG4gIH07XG5cbiAgLy8gKFNjcmVlbnNob3QgbWFjaGluZXJ5IHJlbW92ZWQgYWxvbmdzaWRlIHRoZSAucHJldmlldyB0aWxlLilcblxuICAvLyDilIDilIDilIAgR2l0SHViIHN0YXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBmZXRjaFN0YXJzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGNhY2hlS2V5ID0gJ3BpbmNoZ3JhYi5naC5zdGFycyc7XG4gICAgY29uc3QgY2FjaGVkID0gYXdhaXQgU3RvcmUuZ2V0PHtjb3VudDogbnVtYmVyOyB0czogbnVtYmVyfSB8IG51bGw+KGNhY2hlS2V5LCBudWxsKTtcbiAgICBpZiAoY2FjaGVkICYmIERhdGUubm93KCkgLSBjYWNoZWQudHMgPCAzXzYwMF8wMDApIHtcbiAgICAgIHN0YXJzRWwudGV4dENvbnRlbnQgPSBTdHJpbmcoY2FjaGVkLmNvdW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy93cmFubmdsZS9waW5jaGdyYWInLCB7Y2FjaGU6ICduby1zdG9yZSd9KTtcbiAgICAgIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKCdzdGF0dXMgJyArIHIuc3RhdHVzKTtcbiAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKSBhcyB7c3RhcmdhemVyc19jb3VudD86IG51bWJlcn07XG4gICAgICBjb25zdCBjb3VudCA9IGouc3RhcmdhemVyc19jb3VudCA/PyAwO1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudCk7XG4gICAgICB2b2lkIFN0b3JlLnNldChjYWNoZUtleSwge2NvdW50LCB0czogRGF0ZS5ub3coKX0pO1xuICAgIH0gY2F0Y2ggeyBzdGFyc0VsLnRleHRDb250ZW50ID0gJ8K3JzsgfVxuICB9O1xuICBjb25zdCBvbkdpdGh1YiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3dyYW5uZ2xlL3BpbmNoZ3JhYic7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUudGFicy5jcmVhdGUoe3VybH0pO1xuICAgIGVsc2Ugd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJ25vb3BlbmVyJyk7XG4gIH07XG5cbiAgLy8gUmUtaW5qZWN0IHRoZSBjb250ZW50IHNjcmlwdCBpbnRvIHRoZSBhY3RpdmUgdGFiIOKAlCB0aGUgcmVjb3ZlcnkgcGF0aFxuICAvLyBmb3IgXCJBbHQrQ2xpY2sgc3RvcHBlZCB3b3JraW5nXCIgKGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIHNjcmlwdCkuIFJlZnJlc2hpbmcgYW4gYXR0YWNoZWQgdGFiIHJlLWluamVjdHMgYXV0b21hdGljYWxseTsgdGhpc1xuICAvLyBjb3ZlcnMgZXZlcnkgb3RoZXIgY2FzZSB3aXRob3V0IGh1bnRpbmcgZm9yIHRoZSB0b29sYmFyIGljb24uXG4gIGNvbnN0IG9uUmVhdHRhY2ggPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgeyBzZXRTdGF0dXMoJ1JlLWF0dGFjaCBvbmx5IHdvcmtzIGluc2lkZSB0aGUgZXh0ZW5zaW9uJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPHtvazogYm9vbGVhbjsgZXJyb3I/OiBzdHJpbmd9Pih7a2luZDogJ3BnLXJlaW5qZWN0J30pO1xuICAgIGlmIChyZXBseT8ub2spIHNldFN0YXR1cygnUmUtYXR0YWNoZWQg4oCUIEFsdCtDbGljayBpcyBsaXZlJyk7XG4gICAgZWxzZSBzZXRTdGF0dXMoYENvdWxkbid0IHJlLWF0dGFjaCDigJQgY2xpY2sgdGhlIFBpbmNoR3JhYiB0b29sYmFyIGJ1dHRvbiBvbiB0aGUgcGFnZSR7cmVwbHk/LmVycm9yID8gYCDCtyAke3JlcGx5LmVycm9yfWAgOiAnJ31gLCB7a2luZDogJ3dhcm4nfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFF1aWV0LXNhdmVzIG51ZGdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBxdWlldFNhdmVzIGRlZmF1bHRzIE9OIGFzIGludGVudCwgYnV0IHRoZSBvcHRpb25hbCBkb3dubG9hZHMudWlcbiAgLy8gcGVybWlzc2lvbiBDaHJvbWUgZGVtYW5kcyBjYW4gb25seSBiZSByZXF1ZXN0ZWQgaW5zaWRlIGEgdXNlciBnZXN0dXJlLlxuICAvLyBUaGlzIGJhbm5lciBpcyB0aGF0IGdlc3R1cmU6IHNob3duIHdoaWxlIHRoZSBwcmVmIGlzIG9uLCB0aGUgcGVybWlzc2lvblxuICAvLyBpcyBtaXNzaW5nLCBhbmQgdGhlIHVzZXIgaGFzbid0IGRpc21pc3NlZCBpdC5cbiAgY29uc3QgcXVpZXROdWRnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1xdWlldC1udWRnZV0nKTtcbiAgY29uc3QgbWF5YmVTaG93UXVpZXROdWRnZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXF1aWV0TnVkZ2UgfHwgIWluRXh0ZW5zaW9uIHx8ICFjaHJvbWUucGVybWlzc2lvbnM/LmNvbnRhaW5zKSByZXR1cm47XG4gICAgaWYgKCFwcmVmcy5xdWlldFNhdmVzIHx8IHByZWZzLnF1aWV0TnVkZ2VEaXNtaXNzZWQpIHsgcXVpZXROdWRnZS5oaWRkZW4gPSB0cnVlOyByZXR1cm47IH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgZ3JhbnRlZCA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5jb250YWlucyh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KTtcbiAgICAgIHF1aWV0TnVkZ2UuaGlkZGVuID0gZ3JhbnRlZDtcbiAgICB9IGNhdGNoIHsgcXVpZXROdWRnZS5oaWRkZW4gPSB0cnVlOyB9XG4gIH07XG4gIGNvbnN0IG9uUXVpZXRFbmFibGUgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IGdyYW50ZWQgPSBmYWxzZTtcbiAgICB0cnkgeyBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3Qoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7IH1cbiAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMudWkgcGVybWlzc2lvbiByZXF1ZXN0IGZhaWxlZCcsIGVycik7IH1cbiAgICBwcmVmcy5xdWlldFNhdmVzID0gZ3JhbnRlZDtcbiAgICBpZiAoIWdyYW50ZWQpIHByZWZzLnF1aWV0TnVkZ2VEaXNtaXNzZWQgPSB0cnVlOyAvLyBkZWNsaW5lZCBvbmNlIOKAlCBuZXZlciBuYWcgYWdhaW5cbiAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgIGlmIChxdWlldE51ZGdlKSBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7XG4gICAgc2V0U3RhdHVzKGdyYW50ZWQgPyAnUXVpZXQgc2F2ZXMgb24g4oCUIG5vIG1vcmUgZG93bmxvYWQgcG9wdXBzJyA6ICdTYXZlcyBzdGF5IHZpc2libGUg4oCUIHJlLWVuYWJsZSBpbiBTZXR0aW5ncyDihpIgQ2FwdHVyZScsIGdyYW50ZWQgPyB7fSA6IHtraW5kOiAnaW5mbyd9KTtcbiAgfTtcbiAgY29uc3Qgb25RdWlldERpc21pc3MgPSAoKTogdm9pZCA9PiB7XG4gICAgcHJlZnMucXVpZXRTYXZlcyA9IGZhbHNlO1xuICAgIHByZWZzLnF1aWV0TnVkZ2VEaXNtaXNzZWQgPSB0cnVlO1xuICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgaWYgKHF1aWV0TnVkZ2UpIHF1aWV0TnVkZ2UuaGlkZGVuID0gdHJ1ZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU2V0dGluZ3MgZHJhd2VyIC8gd29ya3NwYWNlcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgYXBwbHlQcmVmc1RvVUkgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBlbCBvZiBkcmF3ZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbZGF0YS1wcmVmXScpKSB7XG4gICAgICBlbC5jaGVja2VkID0gQm9vbGVhbihwcmVmc1tlbC5kYXRhc2V0LnByZWYgYXMga2V5b2YgUHJlZnNdKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBlbCBvZiBkcmF3ZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MVGV4dEFyZWFFbGVtZW50PigndGV4dGFyZWFbZGF0YS1wcmVmLXRleHRdJykpIHtcbiAgICAgIGVsLnZhbHVlID0gU3RyaW5nKHByZWZzW2VsLmRhdGFzZXQucHJlZlRleHQgYXMga2V5b2YgUHJlZnNdID8/ICcnKTtcbiAgICB9XG4gICAgLy8gUGxhaW4tdGV4dCBpbnB1dHMgKGRlc2lnblBhdGgsIHNraWxsUGF0aCkgYWxzbyB1c2UgZGF0YS1wcmVmLXRleHQuXG4gICAgZm9yIChjb25zdCBlbCBvZiBkcmF3ZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbdHlwZT1cInRleHRcIl1bZGF0YS1wcmVmLXRleHRdJykpIHtcbiAgICAgIGVsLnZhbHVlID0gU3RyaW5nKHByZWZzW2VsLmRhdGFzZXQucHJlZlRleHQgYXMga2V5b2YgUHJlZnNdID8/ICcnKTtcbiAgICB9XG4gICAgdXBkYXRlRGVzaWduTWRTdGF0dXMoKTtcbiAgfTtcbiAgLy8gUmVuZGVyIHRoZSBkZXNpZ24tbWQgLyBza2lsbC1tZCBzdGF0dXMgbGFiZWxzIGFuZCB0aGUgdGVtcGxhdGUtYmFubmVyXG4gIC8vIHNvIHRoZSB1c2VyIHNlZXMgYXQgYSBnbGFuY2Ugd2hldGhlciB0aGV5J3JlIHNoaXBwaW5nIGEgY3VzdG9taXplZFxuICAvLyBmaWxlIHZzLiBmYWxsaW5nIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUuIEFzeW5jIGJlY2F1c2Ugd2VcbiAgLy8gbmVlZCB0byByZWFkIHRoZSBidW5kbGVkIGZpbGUncyBzaXplIHRvIGRpc3BsYXkgXCJ0ZW1wbGF0ZSDCtyBOIGxpbmVzXCJcbiAgLy8gZXZlbiB3aGVuIHByZWZzIGlzIGVtcHR5LlxuICBjb25zdCB1cGRhdGVNZFN0YXR1c2VzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGRlc2lnbkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWRlc2lnbi1tZC1zdGF0dXNdJyk7XG4gICAgY29uc3Qgc2tpbGxFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1za2lsbC1tZC1zdGF0dXNdJyk7XG4gICAgY29uc3QgZGVzaWduQmFubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXRlbXBsYXRlLWJhbm5lcj1cImRlc2lnblwiXScpO1xuICAgIGNvbnN0IHNraWxsQmFubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXRlbXBsYXRlLWJhbm5lcj1cInNraWxsXCJdJyk7XG4gICAgY29uc3QgdGFnID0gKG1kOiBzdHJpbmcsIGlzVHBsOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgIGNvbnN0IGxpbmVzID0gbWQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IEJsb2IoW21kXSkuc2l6ZTtcbiAgICAgIHJldHVybiBgJHtpc1RwbCA/ICd0ZW1wbGF0ZScgOiAnY3VzdG9tJ30gwrcgJHtsaW5lc30gbGluZXMgwrcgJHsoYnl0ZXMgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gICAgfTtcbiAgICBpZiAoZGVzaWduRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpO1xuICAgICAgZGVzaWduRWwudGV4dENvbnRlbnQgPSBjb250ZW50LnRyaW0oKSA/IHRhZyhjb250ZW50LCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSkgOiAnKGVtcHR5KSc7XG4gICAgICBkZXNpZ25FbC5jbGFzc0xpc3QudG9nZ2xlKCdoYXMtY29udGVudCcsICFpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSk7XG4gICAgfVxuICAgIGlmIChza2lsbEVsKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgICAgc2tpbGxFbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpIDogJyhlbXB0eSknO1xuICAgICAgc2tpbGxFbC5jbGFzc0xpc3QudG9nZ2xlKCdoYXMtY29udGVudCcsICFpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKTtcbiAgICB9XG4gICAgaWYgKGRlc2lnbkJhbm5lcikgZGVzaWduQmFubmVyLmhpZGRlbiA9ICFpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKTtcbiAgICBpZiAoc2tpbGxCYW5uZXIpIHNraWxsQmFubmVyLmhpZGRlbiA9ICFpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIC8vIEFsc28gcmVmcmVzaCB0aGUgY29tcGFjdCBwcmV2aWV3IHRleHQgb24gdGhlIGVkaXRvci1yb3cgYnV0dG9uLlxuICAgIGF3YWl0IHJlbmRlck1kUHJldmlldygnZGVzaWduJyk7XG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdza2lsbCcpO1xuICB9O1xuICAvLyBCYWNrLWNvbXBhdCBhbGlhcyDigJQgZWFybGllciBjb2RlIHBhdGhzIGNhbGxlZCB1cGRhdGVEZXNpZ25NZFN0YXR1cygpLlxuICBjb25zdCB1cGRhdGVEZXNpZ25NZFN0YXR1cyA9ICgpOiB2b2lkID0+IHsgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7IH07XG5cbiAgLy8g4pSA4pSA4pSAIENvbXBhY3QgcHJldmlldyArIG1vZGFsIGVkaXRvciBmb3IgREVTSUdOLm1kIC8gU0tJTEwubWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJlcGxhY2VzIHRoZSBnaWFudCBpbmxpbmUgdGV4dGFyZWFzIHdpdGggc21hbGwgZG9jdW1lbnQgc3VtbWFyaWVzLlxuICB0eXBlIE1kS2luZCA9ICdkZXNpZ24nIHwgJ3NraWxsJztcbiAgY29uc3QgbWFya2Rvd25PdmVydmlldyA9IChjb250ZW50OiBzdHJpbmcsIGtpbmQ6IE1kS2luZCwgdXNpbmdUZW1wbGF0ZTogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnRyaW0oKSA/IGNvbnRlbnQuc3BsaXQoJ1xcbicpLmxlbmd0aCA6IDA7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbY29udGVudF0pLnNpemU7XG4gICAgY29uc3QgaGVhZGluZ3MgPSBjb250ZW50XG4gICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAubWFwKChsaW5lKSA9PiAvXiN7MSwzfVxccysoLispJC8uZXhlYyhsaW5lLnRyaW0oKSk/LlsxXT8udHJpbSgpKVxuICAgICAgLmZpbHRlcigoaGVhZGluZyk6IGhlYWRpbmcgaXMgc3RyaW5nID0+IEJvb2xlYW4oaGVhZGluZykpXG4gICAgICAuc2xpY2UoMCwgNCk7XG4gICAgLy8gV2FybSwgcGxhaW4tbGFuZ3VhZ2UgZnJhbWluZyBvZiB3aGF0IGVhY2ggZmlsZSB0ZWFjaGVzIHRoZSBhZ2VudC5cbiAgICAvLyBERVNJR04ubWQgaXMgdGhlIGhlYWRsaW5lIGFydGlmYWN0OiBpdCdzIHdoZXJlIHlvdSBkZXNjcmliZSB5b3VyIG93blxuICAgIC8vIGJyYW5kIGFuZCBVSSB0YXN0ZSBzbyB0aGUgYWdlbnQgYnVpbGRzIGluICp5b3VyKiB2b2ljZSByYXRoZXIgdGhhbiBhXG4gICAgLy8gZ2VuZXJpYyBkZWZhdWx0LiBTS0lMTC5tZCBpcyB0aGUgYWR2YW5jZWQgdHJpYWdlIGd1aWRlIGZvciByZWFkaW5nXG4gICAgLy8gZXhwb3J0cyDigJQgdXNlZnVsLCBidXQgbm90IHdoZXJlIG1vc3QgcGVvcGxlIHNob3VsZCBzdGFydC5cbiAgICBjb25zdCBsYWJlbCA9IGtpbmQgPT09ICdkZXNpZ24nXG4gICAgICA/ICdUZWFjaGVzIHlvdXIgYWdlbnQgdG8gYnVpbGQgVUkgaW4geW91ciBicmFuZCdcbiAgICAgIDogJ0FkdmFuY2VkOiBob3cgeW91ciBhZ2VudCBzaG91bGQgcmVhZCBQaW5jaEdyYWIgZXhwb3J0cyc7XG4gICAgY29uc3Qgc291cmNlID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyAoa2luZCA9PT0gJ2Rlc2lnbicgPyAnU3RhcnRlciB0ZW1wbGF0ZSDigJQgbWFrZSBpdCB5b3VycycgOiAnQnVuZGxlZCB0ZW1wbGF0ZScpXG4gICAgICA6ICdDdXN0b21pemVkJztcbiAgICBjb25zdCBzZWN0aW9ucyA9IGhlYWRpbmdzLmxlbmd0aCA/IGhlYWRpbmdzLmpvaW4oJyAvICcpIDogJ05vIHNlY3Rpb24gaGVhZGluZ3MgZm91bmQnO1xuICAgIHJldHVybiBgJHtsYWJlbH1cXG4ke3NvdXJjZX0gwrcgJHtsaW5lcy50b0xvY2FsZVN0cmluZygpfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCXFxuU2VjdGlvbnM6ICR7c2VjdGlvbnN9YDtcbiAgfTtcblxuICBjb25zdCByZW5kZXJNZFByZXZpZXcgPSBhc3luYyAoa2luZDogJ2Rlc2lnbicgfCAnc2tpbGwnKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcHJldmlld0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLW1kLXByZXZpZXc9XCIke2tpbmR9XCJdYCk7XG4gICAgaWYgKCFwcmV2aWV3RWwpIHJldHVybjtcbiAgICBjb25zdCBjb250ZW50ID0ga2luZCA9PT0gJ2Rlc2lnbicgPyBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpIDogYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGNvbnN0IHVzaW5nVGVtcGxhdGUgPSBraW5kID09PSAnZGVzaWduJyA/IGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpIDogaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICBwcmV2aWV3RWwudGV4dENvbnRlbnQgPSBtYXJrZG93bk92ZXJ2aWV3KGNvbnRlbnQsIGtpbmQsIHVzaW5nVGVtcGxhdGUpO1xuICB9O1xuXG4gIGNvbnN0IG9wZW5NZE1vZGFsID0gYXN5bmMgKGtpbmQ6IE1kS2luZCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgaWYgKCFvdmVybGF5KSByZXR1cm47XG4gICAgY29uc3QgdGl0bGVFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRpdGxlXScpITtcbiAgICBjb25zdCB0YUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC10ZXh0YXJlYV0nKSE7XG4gICAgY29uc3Qgc3RhdHNFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXN0YXRzXScpITtcbiAgICBjb25zdCBiYW5uZXJFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWJhbm5lcl0nKSE7XG4gICAgY29uc3Qgc3VtbWFyeUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3VtbWFyeV0nKSE7XG4gICAgY29uc3Qgc2F2ZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXNhdmVdJykhO1xuICAgIGNvbnN0IHJlc2V0QnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtcmVzZXRdJykhO1xuICAgIGNvbnN0IHVwbG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXVwbG9hZF0nKSE7XG4gICAgY29uc3QgZG93bmxvYWRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1kb3dubG9hZF0nKSE7XG4gICAgY29uc3QgY2xvc2VCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1jbG9zZV0nKSE7XG5cbiAgICBjb25zdCBpc0Rlc2lnbiA9IGtpbmQgPT09ICdkZXNpZ24nO1xuICAgIGNvbnN0IGluaXRpYWwgPSBpc0Rlc2lnbiA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGlzRGVzaWduID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSBpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1BpbmNoR3JhYiBTS0lMTC5tZCc7XG4gICAgdGFFbC52YWx1ZSA9IGluaXRpYWw7XG4gICAgb3ZlcmxheS5kYXRhc2V0LmtpbmQgPSBraW5kO1xuXG4gICAgY29uc3QgcmVmcmVzaFN0YXRzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhRWwudmFsdWU7XG4gICAgICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IEJsb2IoW3RleHRdKS5zaXplO1xuICAgICAgc3RhdHNFbC50ZXh0Q29udGVudCA9IGAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICAgIHN1bW1hcnlFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcodGV4dCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gICAgfTtcbiAgICByZWZyZXNoU3RhdHMoKTtcbiAgICBiYW5uZXJFbC5oaWRkZW4gPSAhdXNpbmdUZW1wbGF0ZTtcbiAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9IHVzaW5nVGVtcGxhdGVcbiAgICAgID8gYOKaoCBDdXJyZW50bHkgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgJHtpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1NLSUxMLm1kJ30gdGVtcGxhdGUg4oCUIGVkaXRzIGhlcmUgYmVjb21lIHlvdXIgY3VzdG9taXplZCB2ZXJzaW9uLmBcbiAgICAgIDogJyc7XG4gICAgdGFFbC5vbmlucHV0ID0gcmVmcmVzaFN0YXRzO1xuXG4gICAgY29uc3Qgb25TYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhRWwudmFsdWU7XG4gICAgICAvLyBTYXZlIGVtcHR5IHN0cmluZyDihpIgcmV2ZXJ0IHRvIHRlbXBsYXRlIGZhbGxiYWNrLiBBbnl0aGluZyBub24tZW1wdHlcbiAgICAgIC8vIOKGkiB1c2VyIGN1c3RvbWl6YXRpb24gKHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZSkuXG4gICAgICBpZiAoaXNEZXNpZ24pIHByZWZzLmRlc2lnbk1kID0gdGV4dDtcbiAgICAgIGVsc2UgcHJlZnMuc2tpbGxNZCA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHZvaWQgdXBkYXRlTWRTdGF0dXNlcygpO1xuICAgICAgc2V0U3RhdHVzKGAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSBzYXZlZGApO1xuICAgICAgY2xvc2VNZE1vZGFsKCk7XG4gICAgfTtcbiAgICBjb25zdCBvblJlc2V0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGFFbC52YWx1ZSA9ICcnOyAvLyBlbXB0eSA9IGZhbGxiYWNrIHRvIGJ1bmRsZWQgdGVtcGxhdGVcbiAgICAgIHJlZnJlc2hTdGF0cygpO1xuICAgICAgYmFubmVyRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9ICdDbGVhcmVkIOKAlCBTYXZlIHRvIHJldmVydCB0byBidW5kbGVkIHRlbXBsYXRlLCBvciBwYXN0ZSBuZXcgY29udGVudC4nO1xuICAgIH07XG4gICAgY29uc3Qgb25VcGxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbnB1dElkID0gaXNEZXNpZ24gPyAnZGVzaWduLW1kLWZpbGUnIDogJ3NraWxsLW1kLWZpbGUnO1xuICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uRG93bmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gaXNEZXNpZ24gPyAnREVTSUdOLnRlbXBsYXRlLm1kJyA6ICdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnO1xuICAgICAgZG93bmxvYWRUZXh0KG5hbWUsIHRhRWwudmFsdWUpO1xuICAgIH07XG5cbiAgICBzYXZlQnRuLm9uY2xpY2sgPSBvblNhdmU7XG4gICAgcmVzZXRCdG4ub25jbGljayA9IG9uUmVzZXQ7XG4gICAgdXBsb2FkQnRuLm9uY2xpY2sgPSBvblVwbG9hZDtcbiAgICBkb3dubG9hZEJ0bi5vbmNsaWNrID0gb25Eb3dubG9hZDtcbiAgICBjbG9zZUJ0bi5vbmNsaWNrID0gY2xvc2VNZE1vZGFsO1xuICAgIG92ZXJsYXkuaGlkZGVuID0gZmFsc2U7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhRWwuZm9jdXMoKSk7XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNZE1vZGFsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgaWYgKG92ZXJsYXkpIG92ZXJsYXkuaGlkZGVuID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBkb3dubG9hZFRleHQgPSAoZmlsZW5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nLCBtaW1lID0gJ3RleHQvbWFya2Rvd24nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge3R5cGU6IG1pbWV9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTsgYS5jbGljaygpOyBhLnJlbW92ZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCB3aXJlTWRGaWxlSW5wdXQgPSAoaWQ6IHN0cmluZywgcHJlZktleTogJ2Rlc2lnbk1kJyB8ICdza2lsbE1kJywgbGFiZWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcbiAgICBmaWxlSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBmaWxlSW5wdXQuZmlsZXM/LlswXTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IDUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHRvbyBsYXJnZSAoJHsoZmlsZS5zaXplIC8gMTAyNCAvIDEwMjQpLnRvRml4ZWQoMSl9IE1CID4gNSBNQiBjYXApYCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICBmaWxlSW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgKHByZWZzIGFzIGFueSlbcHJlZktleV0gPSB0ZXh0O1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgc2V0U3RhdHVzKGAke2xhYmVsfSB1cGxvYWRlZCDCtyAke2ZpbGUubmFtZX0gwrcgJHsoZmlsZS5zaXplIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgKTtcbiAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgIH0pO1xuICB9O1xuICB3aXJlTWRGaWxlSW5wdXQoJ2Rlc2lnbi1tZC1maWxlJywgJ2Rlc2lnbk1kJywgJ0RFU0lHTi5tZCcpO1xuICB3aXJlTWRGaWxlSW5wdXQoJ3NraWxsLW1kLWZpbGUnLCAnc2tpbGxNZCcsICdTS0lMTC5tZCcpO1xuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICgodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5kYXRhc2V0Py5wcmVmKSB7XG4gICAgICBjb25zdCBrZXkgPSB0LmRhdGFzZXQucHJlZiE7XG4gICAgICBjb25zdCBjaGVja2VkID0gQm9vbGVhbigodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkKTtcbiAgICAgIC8vIFF1aWV0IHNhdmVzIG5lZWRzIHRoZSBvcHRpb25hbCBkb3dubG9hZHMudWkgcGVybWlzc2lvbjsgcmVxdWVzdCBpdFxuICAgICAgLy8gaW5zaWRlIHRoaXMgdXNlciBnZXN0dXJlIGFuZCByZXZlcnQgdGhlIGNoZWNrYm94IG9uIGRlY2xpbmUuXG4gICAgICBpZiAoa2V5ID09PSAncXVpZXRTYXZlcycgJiYgY2hlY2tlZCAmJiBpbkV4dGVuc2lvbiAmJiBjaHJvbWUucGVybWlzc2lvbnM/LnJlcXVlc3QpIHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBncmFudGVkID0gZmFsc2U7XG4gICAgICAgICAgdHJ5IHsgZ3JhbnRlZCA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5yZXF1ZXN0KHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pOyB9XG4gICAgICAgICAgY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oTE9HLCAnZG93bmxvYWRzLnVpIHBlcm1pc3Npb24gcmVxdWVzdCBmYWlsZWQnLCBlcnIpOyB9XG4gICAgICAgICAgcHJlZnMucXVpZXRTYXZlcyA9IGdyYW50ZWQ7XG4gICAgICAgICAgKHQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IGdyYW50ZWQ7XG4gICAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgICAgc2V0U3RhdHVzKGdyYW50ZWQgPyAnUXVpZXQgc2F2ZXMgb24g4oCUIG5vIG1vcmUgZG93bmxvYWQgcG9wdXBzJyA6ICdQZXJtaXNzaW9uIGRlY2xpbmVkIOKAlCBzYXZlcyBzdGF5IHZpc2libGUnLCBncmFudGVkID8ge30gOiB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSBjaGVja2VkO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHQuZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSAodCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIH1cbiAgfSk7XG4gIC8vIFRleHRhcmVhIGlucHV0cyBhbHNvIGZpcmUgYGlucHV0YCBldmVudHMgYXMgdGhlIHVzZXIgdHlwZXMg4oCUIHdlIHdhbnQgdG9cbiAgLy8gc2F2ZSB0aG9zZSBpbmNyZW1lbnRhbGx5IHNvIGEgcGFuZWwgcmVsb2FkIGRvZXNuJ3QgbG9zZSBoYWxmLXR5cGVkXG4gIC8vIGVudHJpZXMuIGBjaGFuZ2VgIG9ubHkgZmlyZXMgb24gYmx1ciBmb3IgdGV4dGFyZWFzLlxuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICBpZiAodD8uZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSB0LnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb3BlbkRyYXdlciA9ICgpOiB2b2lkID0+IHsgZHJhd2VyLmhpZGRlbiA9IGZhbHNlOyByZW5kZXJXc0NvbnRyb2xzKCk7IH07XG4gIGNvbnN0IGNsb3NlRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gdHJ1ZTsgfTtcblxuICAvLyBSZXVzYWJsZSBjcmVhdGUtd29ya3NwYWNlIGZsb3c6IHZhbGlkYXRlcyB1bmlxdWVuZXNzLCBwZXJzaXN0cywgc3dpdGNoZXMuXG4gIC8vIFNoYXJlZCBieSB0aGUgc2V0dGluZ3MgQ3JlYXRlIGJ1dHRvbiBhbmQgdGhlIGhlYWRlciBkcm9wZG93bidzXG4gIC8vIFwiKyBOZXcgd29ya3NwYWNlXCIgYWN0aW9uIHNvIGJvdGggcGF0aHMgYmVoYXZlIGlkZW50aWNhbGx5LlxuICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VGbG93ID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBuYW1lLnRyaW0oKTtcbiAgICBpZiAoIXRyaW1tZWQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAod29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IHRyaW1tZWQpKSB7XG4gICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgZXhpc3RzJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IHRyaW1tZWQsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7XG4gICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKHRyaW1tZWQpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICBzZXRTdGF0dXMoYENyZWF0ZWQgd29ya3NwYWNlIFwiJHt0cmltbWVkfVwiYCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyV3NDb250cm9scyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXdzU2VsZWN0KSByZXR1cm47XG4gICAgd3NTZWxlY3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gdy5uYW1lO1xuICAgICAgb3B0LnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIG9wdC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB3c1NlbGVjdC5hcHBlbmQob3B0KTtcbiAgICB9XG4gICAgLy8gSW5saW5lIFwiKyBOZXcgd29ya3NwYWNlXCIgYWN0aW9uIHNvIHVzZXJzIGNhbiBzcGluIHVwIGEgd29ya3NwYWNlXG4gICAgLy8gc3RyYWlnaHQgZnJvbSB0aGUgaGVhZGVyIHN3aXRjaGVyIHdpdGhvdXQgb3BlbmluZyBzZXR0aW5ncy4gSGFuZGxlZFxuICAgIC8vIGFzIGEgc2VudGluZWwgdmFsdWUgaW4gdGhlIGNoYW5nZSBsaXN0ZW5lciBiZWxvdy5cbiAgICBjb25zdCBuZXdPcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBuZXdPcHQudmFsdWUgPSAnX19uZXdfd29ya3NwYWNlX18nO1xuICAgIG5ld09wdC50ZXh0Q29udGVudCA9ICcrIE5ldyB3b3Jrc3BhY2UnO1xuICAgIHdzU2VsZWN0LmFwcGVuZChuZXdPcHQpO1xuICAgIGlmICghd3NMaXN0KSByZXR1cm47XG4gICAgd3NMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGZvciAoY29uc3QgdyBvZiB3b3Jrc3BhY2VzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5kYXRhc2V0LnRpcCA9IHcubmFtZSA9PT0gYWN0aXZlV3NcbiAgICAgICAgPyBgQWN0aXZlIHdvcmtzcGFjZTogJHt3Lm5hbWV9YFxuICAgICAgICA6IGBTd2l0Y2ggdG8gd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCJgO1xuICAgICAgLy8gV2hvbGUgcm93IGlzIHRoZSBzd2l0Y2ggdHJpZ2dlciDigJQgbm8gZGVkaWNhdGVkIGNoZWNrIGJ1dHRvbi5cbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgLy8gSWdub3JlIGNsaWNrcyBvbiBpbm5lciBjb250cm9scyAodGhlIGRlbGV0ZSBidXR0b24gYmVsb3cpLlxuICAgICAgICBpZiAoKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdidXR0b24nKSkgcmV0dXJuO1xuICAgICAgICBmb2N1c1dvcmtzcGFjZVRhYih3Lm5hbWUpO1xuICAgICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgcmV0dXJuO1xuICAgICAgICBhd2FpdCBsb2FkV29ya3NwYWNlKHcubmFtZSk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbmFtZS5jbGFzc05hbWUgPSAnd3MtbmFtZSc7XG4gICAgICBuYW1lLnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgbGkuYXBwZW5kKG5hbWUpO1xuICAgICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG1ldGEuY2xhc3NOYW1lID0gJ3dzLW1ldGEnO1xuICAgICAgbWV0YS50ZXh0Q29udGVudCA9IG5ldyBEYXRlKHcuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgIGxpLmFwcGVuZChtZXRhKTtcbiAgICAgIGlmICh3b3Jrc3BhY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgZGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGRlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyJztcbiAgICAgICAgZGVsLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSB0aGlzIHdvcmtzcGFjZSBhbmQgZXZlcnl0aGluZyBpbiBpdCc7XG4gICAgICAgIGRlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBgRGVsZXRlIHdvcmtzcGFjZSAke3cubmFtZX1gKTtcbiAgICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICAgICAgZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGlmICghY29uZmlybShgRGVsZXRlIHdvcmtzcGFjZSBcIiR7dy5uYW1lfVwiIGFuZCBhbGwgaXRzIGNhcHR1cmVzP2ApKSByZXR1cm47XG4gICAgICAgICAgd29ya3NwYWNlcyA9IHdvcmtzcGFjZXMuZmlsdGVyKCh4KSA9PiB4Lm5hbWUgIT09IHcubmFtZSk7XG4gICAgICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICAgICAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShbd3NNc2dLZXkody5uYW1lKSwgd3NTaG90c0tleSh3Lm5hbWUpLCB3c1Nob3RzRnVsbEtleSh3Lm5hbWUpLCB3c1NuYXBzaG90c0tleSh3Lm5hbWUpXSkuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICAgICAgaWYgKGFjdGl2ZVdzID09PSB3Lm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod29ya3NwYWNlc1swXSEubmFtZSk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIH1cbiAgICAgIHdzTGlzdC5hcHBlbmQobGkpO1xuICAgIH1cbiAgICByZW5kZXJXc1NuYXBzaG90SGlzdG9yeSgpO1xuICB9O1xuXG4gIC8vIFJlbmRlciB0aGUgYWN0aXZlIHdvcmtzcGFjZSdzIHNuYXBzaG90IGhpc3RvcnkgKENsZWFyLWFsbCBhcmNoaXZlcykgd2l0aFxuICAvLyBhIFJlc3RvcmUgYWN0aW9uLiBBcHBlbmRlZCB1bmRlciB0aGUgd29ya3NwYWNlIGxpc3QgaW4gU2V0dGluZ3MuXG4gIGNvbnN0IHJlbmRlcldzU25hcHNob3RIaXN0b3J5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtd3Mtc25hcHNob3RzXScpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuO1xuICAgIGhvc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgaWYgKCF3c1NuYXBzaG90cy5sZW5ndGgpIHtcbiAgICAgIGhvc3QuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaG9zdC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnd3Mtc25hcC1oZWFkJztcbiAgICBoZWFkLnRleHRDb250ZW50ID0gYFNuYXBzaG90IGhpc3RvcnkgwrcgJHt3c1NuYXBzaG90cy5sZW5ndGh9YDtcbiAgICBoZWFkLmRhdGFzZXQudGlwID0gJ1Jlc3RvcmFibGUgc25hcHNob3RzIHNhdmVkIGJlZm9yZSBlYWNoIENsZWFyLWFsbCc7XG4gICAgaG9zdC5hcHBlbmQoaGVhZCk7XG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHVsLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWxpc3QnO1xuICAgIGZvciAoY29uc3Qgc25hcCBvZiB3c1NuYXBzaG90cykge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG1ldGEuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gYCR7bmV3IERhdGUoc25hcC50cykudG9Mb2NhbGVTdHJpbmcoKX0gwrcgJHtzbmFwLnNlbGVjdG9yc30gc2VsIMK3ICR7c25hcC5jb21tZW50c30gY210YDtcbiAgICAgIGxpLmFwcGVuZChtZXRhKTtcbiAgICAgIGNvbnN0IHJlc3RvcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIHJlc3RvcmUudHlwZSA9ICdidXR0b24nO1xuICAgICAgcmVzdG9yZS5jbGFzc05hbWUgPSAnd3Mtc25hcC1yZXN0b3JlJztcbiAgICAgIHJlc3RvcmUudGV4dENvbnRlbnQgPSAnUmVzdG9yZSc7XG4gICAgICByZXN0b3JlLmRhdGFzZXQudGlwID0gJ1Jlc3RvcmUgdGhpcyBzbmFwc2hvdCBpbnRvIHRoZSBjdXJyZW50IHdvcmtzcGFjZSAoY3VycmVudCBzdGF0ZSBpcyBrZXB0IG9uIHRoZSB1bmRvIHN0YWNrKSc7XG4gICAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCAmJiAhY29uZmlybSgnUmVzdG9yZSB0aGlzIHNuYXBzaG90PyBUaGUgY3VycmVudCBjYXB0dXJlcyB3aWxsIGJlIHJlcGxhY2VkICh1bmRvYWJsZSkuJykpIHJldHVybjtcbiAgICAgICAgcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQocmVzdG9yZSk7XG4gICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGRlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgICBkZWwuY2xhc3NOYW1lID0gJ2RhbmdlciB3cy1zbmFwLWRlbCc7XG4gICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgc25hcHNob3QnO1xuICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdEZWxldGUgc25hcHNob3QnKTtcbiAgICAgIGRlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMik7XG4gICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBkZWxldGVXb3Jrc3BhY2VTbmFwc2hvdChzbmFwLmlkKTtcbiAgICAgIH0pO1xuICAgICAgbGkuYXBwZW5kKGRlbCk7XG4gICAgICB1bC5hcHBlbmQobGkpO1xuICAgIH1cbiAgICBob3N0LmFwcGVuZCh1bCk7XG4gIH07XG4gIHdzU2VsZWN0Py5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gKGUudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZTtcbiAgICBpZiAodmFsdWUgPT09ICdfX25ld193b3Jrc3BhY2VfXycpIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBzZWxlY3QgYmFjayB0byB0aGUgYWN0aXZlIHdvcmtzcGFjZSBmaXJzdCBzbyB0aGUgc2VudGluZWxcbiAgICAgIC8vIG5ldmVyIHN0aWNrcyBhcyB0aGUgZGlzcGxheWVkIHZhbHVlIGlmIHRoZSBwcm9tcHQgaXMgY2FuY2VsbGVkLlxuICAgICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgICAgY29uc3QgbmFtZSA9ICh3aW5kb3cucHJvbXB0KCdOZXcgd29ya3NwYWNlIG5hbWUnKSA/PyAnJykudHJpbSgpO1xuICAgICAgaWYgKG5hbWUpIGF3YWl0IGNyZWF0ZVdvcmtzcGFjZUZsb3cobmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodmFsdWUpO1xuICAgIGZvY3VzV29ya3NwYWNlVGFiKHZhbHVlKTtcbiAgICByZW5kZXIoKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIENvbW1hbmQgcGFsZXR0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBDb21tYW5kID0ge2lkOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJ1bjogKCkgPT4gdm9pZH07XG4gIGNvbnN0IENPTU1BTkRTOiBDb21tYW5kW10gPSBbXG4gICAge2lkOiAnY29weS1hbGwnLCBsYWJlbDogJ0NvcHkgYWxsIGFzIEpTT05MJywgcnVuOiAoKSA9PiB2b2lkIG9uQ29weUFsbCgpfSxcbiAgICB7aWQ6ICdleHBvcnQnLCBsYWJlbDogJ0Rvd25sb2FkIEpTT05MIGZpbGUnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnQoKX0sXG4gICAge2lkOiAnZXhwb3J0LXppcCcsIGxhYmVsOiAnU2VuZCB0byBBZ2VudCDigJQgZXhwb3J0IC50YXIuenN0ICsgY29weSB0aGUgYWdlbnQgcHJvbXB0JywgcnVuOiAoKSA9PiB2b2lkIG9uRXhwb3J0WmlwKCl9LFxuICAgIHtpZDogJ2NvcHktcGF0aCcsIGxhYmVsOiAnQ29weSBwYXRoIG9mIGxhc3QgZXhwb3J0JywgcnVuOiAoKSA9PiB2b2lkIG9uQ29weVBhdGgoKX0sXG4gICAge2lkOiAnY29weS1hZ2VudC1wcm9tcHQnLCBsYWJlbDogJ0NvcHkgU2VuZC10by1BZ2VudCBwcm9tcHQgKGxhc3QgZXhwb3J0KScsIHJ1bjogKCkgPT4ge1xuICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAoIWxhc3RFeHBvcnQuYWdlbnRQcm9tcHQpIHsgc2V0U3RhdHVzKCdObyBleHBvcnQgeWV0IOKAlCBTZW5kIHRvIEFnZW50IGZpcnN0Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3Qgb2sgPSBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQobGFzdEV4cG9ydC5hZ2VudFByb21wdCk7XG4gICAgICAgIHNldFN0YXR1cyhvayA/ICdBZ2VudCBwcm9tcHQgY29waWVkJyA6ICdDbGlwYm9hcmQgdW5hdmFpbGFibGUnLCBvayA/IHt9IDoge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgfSkoKTtcbiAgICB9fSxcbiAgICB7aWQ6ICdkdWNrZGInLCBsYWJlbDogJ0dlbmVyYXRlIER1Y2tEQiBxdWVyeSBzbmlwcGV0IChTUUwgcmVjaXBlcyknLCBydW46ICgpID0+IHZvaWQgb25EdWNrRGJTbmlwcGV0KCl9LFxuICAgIHtpZDogJ2ltcG9ydCcsIGxhYmVsOiAnSW1wb3J0IEpTT05MIGZpbGUnLCBydW46IG9uSW1wb3J0fSxcbiAgICB7aWQ6ICd2YWxpZGF0ZScsIGxhYmVsOiAnUmUtY2hlY2sgc2VsZWN0b3JzJywgcnVuOiAoKSA9PiB2b2lkIG9uVmFsaWRhdGUoKX0sXG4gICAge2lkOiAncmVhdHRhY2gnLCBsYWJlbDogJ1JlLWF0dGFjaCB0byBwYWdlIChmaXggQWx0K0NsaWNrKScsIHJ1bjogKCkgPT4gdm9pZCBvblJlYXR0YWNoKCl9LFxuICAgIHtpZDogJ3JlbG9hZC1leHRlbnNpb24nLCBsYWJlbDogJ1JlbG9hZCB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiAobGFzdCByZXNvcnQpJywgcnVuOiAoKSA9PiB7IGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnJ1bnRpbWUucmVsb2FkKCk7IH19LFxuICAgIHtpZDogJ2NsZWFyJywgbGFiZWw6ICdDbGVhciBhbGwgY2FwdHVyZXMnLCBydW46IG9uQ2xlYXJ9LFxuICAgIHtpZDogJ3NldHRpbmdzJywgbGFiZWw6ICdPcGVuIHNldHRpbmdzJywgcnVuOiBvcGVuRHJhd2VyfSxcbiAgICB7aWQ6ICdnaXRodWInLCBsYWJlbDogJ09wZW4gR2l0SHViIHJlcG8nLCBydW46IG9uR2l0aHVifSxcbiAgICB7aWQ6ICdtYW51YWwnLCBsYWJlbDogJ01hbnVhbCBjYXB0dXJlIChzdGFydCBjb21wb3NlciB3aXRoIGA+IHNlbGVjdG9yYCknLCBydW46ICgpID0+IHsgY29tcG9zZXIudmFsdWUgPSAnPiAnOyBjb21wb3Nlci5mb2N1cygpOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IH19LFxuICAgIHtpZDogJ3VuZG8nLCBsYWJlbDogJ1VuZG8nLCBydW46IHVuZG99LFxuICAgIHtpZDogJ3JlZG8nLCBsYWJlbDogJ1JlZG8nLCBydW46IHJlZG99LFxuICBdO1xuICBjb25zdCByZW5kZXJQYWxldHRlID0gKHEgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGVMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnN0IHFsID0gcS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uQ09NTUFORFMuZmlsdGVyKChjKSA9PiAhcWwgfHwgYy5sYWJlbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSlcbiAgICAgICAgLm1hcCgoYykgPT4gKHtsYWJlbDogYy5sYWJlbCwgcHJldmlldzogJ2NvbW1hbmQnLCBydW46IGMucnVufSkpLFxuICAgICAgLi4ubWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmICghcWwgfHxcbiAgICAgICAgKG0uZW50cnkuc2VsZWN0b3IgKyAnICcgKyAobS5lbnRyeS50ZXh0ID8/ICcnKSArICcgJyArIChtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gJycpKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSkpXG4gICAgICAgIC5zbGljZSgwLCAzMClcbiAgICAgICAgLm1hcCgobSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgICAgICAgY29uc3QgcHJldmlldyA9IChtLmVudHJ5LnRleHQgPz8gZmJbMF0gPz8gbS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDgwKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGFiZWw6IGAjJHttLmVudHJ5Lm59ICR7bS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3J9YCxcbiAgICAgICAgICAgIHByZXZpZXcsXG4gICAgICAgICAgICBydW46ICgpID0+IHtcbiAgICAgICAgICAgICAgY2xvc2VQYWxldHRlKCk7XG4gICAgICAgICAgICAgIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhtLmlkKTtcbiAgICAgICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgIF07XG4gICAgaXRlbXMuZm9yRWFjaCgoaXQsIGkpID0+IHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IGxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxibC5jbGFzc05hbWUgPSAnbGFiZWwnO1xuICAgICAgbGJsLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LmxhYmVsLCBxKTtcbiAgICAgIGxpLmFwcGVuZChsYmwpO1xuICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHAuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgcC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5wcmV2aWV3ID8/ICcnLCBxKTtcbiAgICAgIGxpLmFwcGVuZChwKTtcbiAgICAgIGNvbnN0IGtiZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGtiZC5jbGFzc05hbWUgPSAna2JkJztcbiAgICAgIGtiZC50ZXh0Q29udGVudCA9ICfihrUnO1xuICAgICAgbGkuYXBwZW5kKGtiZCk7XG4gICAgICBpZiAoaSA9PT0gMCkgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaXQucnVuKCk7IH0pO1xuICAgICAgcGFsZXR0ZUxpc3QuYXBwZW5kKGxpKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb3BlblBhbGV0dGUgPSAocHJlc2V0ID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlLmhpZGRlbiA9IGZhbHNlO1xuICAgIHBhbGV0dGVJbnB1dC52YWx1ZSA9IHByZXNldDtcbiAgICByZW5kZXJQYWxldHRlKHByZXNldCk7XG4gICAgcGFsZXR0ZUlucHV0LmZvY3VzKCk7XG4gICAgcGFsZXR0ZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKHByZXNldC5sZW5ndGgsIHByZXNldC5sZW5ndGgpO1xuICB9O1xuICBjb25zdCBjbG9zZVBhbGV0dGUgPSAoKTogdm9pZCA9PiB7IHBhbGV0dGUuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gcmVuZGVyUGFsZXR0ZShwYWxldHRlSW5wdXQudmFsdWUpKTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gWy4uLnBhbGV0dGVMaXN0LmNoaWxkcmVuXTtcbiAgICBsZXQgYWN0aXZlID0gaXRlbXMuZmluZEluZGV4KChsaSkgPT4gbGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSk7XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1pbihpdGVtcy5sZW5ndGggLSAxLCBhY3RpdmUgKyAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1heCgwLCBhY3RpdmUgLSAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyAoaXRlbXNbYWN0aXZlXSBhcyBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCk/LmNsaWNrKCk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBjbG9zZVBhbGV0dGUoKTtcbiAgfSk7XG4gIHBhbGV0dGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IHBhbGV0dGUpIGNsb3NlUGFsZXR0ZSgpOyB9KTtcblxuICAvLyDilIDilIDilIAgQ29udGV4dCBzdHJpcCAoaG92ZXIgaGVscCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJlcGxhY2VzIHRoZSBvbGQgZmxvYXRpbmcgY3Vyc29yIHRvb2x0aXA6IFtkYXRhLXRpcF0gaG92ZXIgdGV4dCBpc1xuICAvLyB3cml0dGVuIGludG8gdGhlIGZpeGVkIHN0cmlwIHVuZGVyIHRoZSBoZWFkZXIsIHNvIGhlbHAgbmV2ZXIgb2NjbHVkZXNcbiAgLy8gb3RoZXIgY29udHJvbHMgYW5kIGNhbid0IHN0cmFuZCBtaWQtc2NyZWVuIHRocm91Z2ggcmUtcmVuZGVycy5cbiAgY29uc3QgVElQX0lETEUgPSAnQWx0K0NsaWNrIG9uIHRoZSBwYWdlIHRvIGNhcHR1cmUgwrcgaG92ZXIgYW55IGNvbnRyb2wgZm9yIGhlbHAnO1xuICBsZXQgdGlwRm9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBUaGUgc2V0dGluZ3MgZHJhd2VyIG92ZXJsYXlzIHRoZSBzdHJpcCAocG9zaXRpb246YWJzb2x1dGUsIGluc2V0IDApLCBzb1xuICAvLyBob3ZlciBoZWxwIGZvciBkcmF3ZXIgY29udHJvbHMgbGFuZHMgaW4gYSBzZWNvbmQgc2luayBpbnNpZGUgdGhlXG4gIC8vIGRyYXdlciBoZWFkZXIuIEJvdGggc2lua3MgYWx3YXlzIHJlY2VpdmUgdGhlIHNhbWUgdGV4dC5cbiAgY29uc3QgZHJhd2VyVGlwRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZHJhd2VyLXRpcF0nKTtcbiAgY29uc3Qgc2hvd1RpcCA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlwJyk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgdG9vbHRpcEVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICd0cnVlJztcbiAgICBpZiAoZHJhd2VyVGlwRWwpIHsgZHJhd2VyVGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0OyBkcmF3ZXJUaXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnOyB9XG4gIH07XG4gIGNvbnN0IGhpZGVUaXAgPSAoKTogdm9pZCA9PiB7XG4gICAgdGlwRm9yID0gbnVsbDtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSBUSVBfSURMRTtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7XG4gICAgaWYgKGRyYXdlclRpcEVsKSB7IGRyYXdlclRpcEVsLnRleHRDb250ZW50ID0gJyc7IGRyYXdlclRpcEVsLmRhdGFzZXQuc2hvd24gPSAnZmFsc2UnOyB9XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoIXQgfHwgdCA9PT0gdGlwRm9yKSByZXR1cm47XG4gICAgdGlwRm9yID0gdDtcbiAgICBzaG93VGlwKHQpO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHQgJiYgdCA9PT0gdGlwRm9yICYmICF0LmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZVRpcCgpO1xuICB9KTtcbiAgLy8gUmUtcmVuZGVycyBjYW4gZHJvcCB0aGUgaG92ZXJlZCBub2RlIHdpdGhvdXQgZXZlciBmaXJpbmcgbW91c2VvdXRcbiAgLy8gKHJlbmRlcigpIHJlc2V0cyBsaXN0LmlubmVySFRNTCwgY29uZmlybSBidXR0b25zIHJlcGxhY2VXaXRoKTsgcmVzZXRcbiAgLy8gdGhlIHN0cmlwIHRvIGl0cyBpZGxlIGhpbnQgd2hlbiB0aGF0IGhhcHBlbnMuXG4gIGNvbnN0IHRpcEd1YXJkID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgIGlmICh0aXBGb3IgJiYgIXRpcEZvci5pc0Nvbm5lY3RlZCkgaGlkZVRpcCgpO1xuICB9KTtcbiAgdGlwR3VhcmQub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7Y2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXQgZHJpbGxkb3ducyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgYXBwZW5kSGVhZGluZyA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDUnKTtcbiAgICBoLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChoKTtcbiAgfTtcbiAgY29uc3QgYXBwZW5kQm9sZCA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYicpO1xuICAgIGIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGIpO1xuICB9O1xuICBjb25zdCBhcHBlbmRDb2RlID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb2RlJyk7XG4gICAgY29kZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoY29kZSk7XG4gIH07XG4gIGNvbnN0IGJ1aWxkRHJpbGxkb3duID0gKGtpbmQ6IHN0cmluZyk6IERvY3VtZW50RnJhZ21lbnQgPT4ge1xuICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgaWYgKGtpbmQgPT09ICdzZWxlY3RvcnMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTZWxlY3RvcnMgYnkgcXVhbGl0eScpO1xuICAgICAgY29uc3QgYnVja2V0cyA9IHtpZDogMCwgdGVzdGlkOiAwLCBjbGFzczogMCwgbnRoOiAwLCB0YWc6IDB9O1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgICAgaWYgKGUudGVzdElkKSBidWNrZXRzLnRlc3RpZCsrO1xuICAgICAgICBlbHNlIGlmIChlLmlkIHx8IC9eI1tcXHctXSskLy50ZXN0KGUuc2VsZWN0b3IpKSBidWNrZXRzLmlkKys7XG4gICAgICAgIGVsc2UgaWYgKChlLnNlbGVjdG9yID8/ICcnKS5pbmNsdWRlcygnOm50aC1vZi10eXBlJykpIGJ1Y2tldHMubnRoKys7XG4gICAgICAgIGVsc2UgaWYgKC9cXC4vLnRlc3QoZS5zZWxlY3RvciA/PyAnJykpIGJ1Y2tldHMuY2xhc3MrKztcbiAgICAgICAgZWxzZSBidWNrZXRzLnRhZysrO1xuICAgICAgfVxuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgZm9yIChjb25zdCBbdmFsdWUsIGxhYmVsXSBvZiBbXG4gICAgICAgIFtidWNrZXRzLnRlc3RpZCwgJyBkYXRhLXRlc3RpZCddLFxuICAgICAgICBbYnVja2V0cy5pZCwgJyBzdGFibGUgaWQnXSxcbiAgICAgICAgW2J1Y2tldHMuY2xhc3MsICcgY2xhc3MtYmFzZWQnXSxcbiAgICAgICAgW2J1Y2tldHMubnRoLCAnIG50aC1vZi10eXBlJ10sXG4gICAgICAgIFtidWNrZXRzLnRhZywgJyB0YWctb25seSddLFxuICAgICAgXSBhcyBjb25zdCkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICBsaS5hcHBlbmQobGFiZWwpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3N0YWxlJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnU3RhbGUgY2FwdHVyZXMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IHN0YWxlID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSk7XG4gICAgICBpZiAoIXN0YWxlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gJ05vbmUgLSBldmVyeXRoaW5nIHJlc29sdmVzLic7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9IGVsc2UgZm9yIChjb25zdCBtIG9mIHN0YWxlKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgYCMke20uZW50cnkubn1gKTtcbiAgICAgICAgbGkuYXBwZW5kKCcgJyk7XG4gICAgICAgIGFwcGVuZENvZGUobGksIChtLmVudHJ5LnNlbGVjdG9yID8/ICcnKS5zbGljZSgwLCA1MCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ2NvbW1lbnRzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnQ29tbWVudHMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IGZicyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgRmVlZGJhY2tNZXNzYWdlID0+IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJyk7XG4gICAgICBjb25zdCB0b3RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICB0b3RhbC5hcHBlbmQoJ1RvdGFsIHdvcmRzOiAnKTtcbiAgICAgIGFwcGVuZEJvbGQodG90YWwsIFN0cmluZyhmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgd29yZENvdW50KG0udGV4dCksIDApKSk7XG4gICAgICB1bC5hcHBlbmQodG90YWwpO1xuICAgICAgY29uc3QgYXZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGF2Zy5hcHBlbmQoJ0F2ZXJhZ2UgbGVuZ3RoOiAnKTtcbiAgICAgIGFwcGVuZEJvbGQoYXZnLCBTdHJpbmcoZmJzLmxlbmd0aCA/IE1hdGgucm91bmQoZmJzLnJlZHVjZSgocywgbSkgPT4gcyArIG0udGV4dC5sZW5ndGgsIDApIC8gZmJzLmxlbmd0aCkgOiAwKSk7XG4gICAgICBhdmcuYXBwZW5kKCcgY2hhcnMnKTtcbiAgICAgIHVsLmFwcGVuZChhdmcpO1xuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3BhZ2VzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnUGFnZXMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzZWVuLnNldChtLmVudHJ5LnVybCwgKHNlZW4uZ2V0KG0uZW50cnkudXJsKSA/PyAwKSArIDEpO1xuICAgICAgZm9yIChjb25zdCBbdXJsLCBuXSBvZiBzZWVuKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKG4pKTtcbiAgICAgICAgbGkuYXBwZW5kKGAgc2VsZWN0b3Ike24gPT09IDEgPyAnJyA6ICdzJ30gwrcgYCk7XG4gICAgICAgIGFwcGVuZENvZGUobGksIHBhdGhPZih1cmwpKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWc7XG4gIH07XG4gIGNvbnN0IHNob3dEcmlsbGRvd24gPSAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGtpbmQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXQnKTtcbiAgICBpZiAoIWtpbmQpIHJldHVybjtcbiAgICBkcmlsbGRvd25FbC5yZXBsYWNlQ2hpbGRyZW4oYnVpbGREcmlsbGRvd24oa2luZCkpO1xuICAgIGRyaWxsZG93bkVsLmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IHIgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZFIgPSBkcmlsbGRvd25FbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgdG9wID0gci5ib3R0b20gKyA2O1xuICAgIGxldCBsZWZ0ID0gci5sZWZ0ICsgci53aWR0aCAvIDIgLSBkUi53aWR0aCAvIDI7XG4gICAgaWYgKHRvcCArIGRSLmhlaWdodCArIDQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHRvcCA9IHIudG9wIC0gZFIuaGVpZ2h0IC0gNjtcbiAgICBpZiAobGVmdCA8IDYpIGxlZnQgPSA2O1xuICAgIGlmIChsZWZ0ICsgZFIud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDYpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGRSLndpZHRoIC0gNjtcbiAgICBkcmlsbGRvd25FbC5zdHlsZS5jc3NUZXh0ID0gYHRvcDoke3RvcH1weDtsZWZ0OiR7bGVmdH1weDtgO1xuICB9O1xuICBjb25zdCBoaWRlRHJpbGxkb3duID0gKCk6IHZvaWQgPT4geyBkcmlsbGRvd25FbC5oaWRkZW4gPSB0cnVlOyB9O1xuICBzdGF0c0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnLnN0YXRbZGF0YS1zdGF0XScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCkgc2hvd0RyaWxsZG93bih0KTtcbiAgfSk7XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGlmICghc3RhdHNFbC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVEcmlsbGRvd24oKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydC1idXR0b24gaG92ZXIg4oaSIG91dGxpbmUtbXVsdGkgb24gcGFnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZm9yIChjb25zdCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZXhwb3J0LWhvdmVyXScpKSB7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aScsIHNlbGVjdG9yc30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LmFkZCgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2V4cG9ydC1ob3ZlcicpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIENsaWNrIGRlbGVnYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCB0cmlnZ2VyID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgaWYgKCF0cmlnZ2VyKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWFjdGlvbicpO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdzZW5kJzogc2VuZEZlZWRiYWNrKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktYWxsJzogdm9pZCBvbkNvcHlBbGwoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZXhwb3J0Jzogdm9pZCBvbkV4cG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQtemlwJzogdm9pZCBvbkV4cG9ydFppcCgpOyByZXR1cm47XG4gICAgICBjYXNlICdjb3B5LXBhdGgnOiB2b2lkIG9uQ29weVBhdGgoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaW1wb3J0Jzogb25JbXBvcnQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndmFsaWRhdGUnOiB2b2lkIG9uVmFsaWRhdGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVhdHRhY2gnOiB2b2lkIG9uUmVhdHRhY2goKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncXVpZXQtZW5hYmxlJzogdm9pZCBvblF1aWV0RW5hYmxlKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3F1aWV0LWRpc21pc3MnOiBvblF1aWV0RGlzbWlzcygpOyByZXR1cm47XG4gICAgICBjYXNlICdjbGVhcic6IG9uQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZ2l0aHViJzogb25HaXRodWIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOiBvcGVuRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Nsb3NlLWRyYXdlcic6IGNsb3NlRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3VuZG8nOiB1bmRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3JlZG8nOiByZWRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Rlc2lnbi1lZGl0JzogeyB2b2lkIG9wZW5NZE1vZGFsKCdkZXNpZ24nKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdza2lsbC1lZGl0JzogIHsgdm9pZCBvcGVuTWRNb2RhbCgnc2tpbGwnKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdkZXNpZ24tdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbi1tZC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyBBbHdheXMgdGhlIFBMQUlOIFNUT0NLIHRlbXBsYXRlIOKAlCB0aGUgbG9jYWwuKiBkZXYtb3ZlcnJpZGVcbiAgICAgICAgICAvLyBwcmVmZXJlbmNlIGNvbnRhbWluYXRlZCBkZWZhdWx0cyB3aXRoIGEgZGV2ZWxvcGVyJ3Mgb3duIGJyYW5kLlxuICAgICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJyk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQg4oCUIGZpbGwgaW4gYW5kIHJlLXVwbG9hZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLmRlc2lnbk1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ0RFU0lHTi5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NraWxsLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXRlbXBsYXRlLWRvd25sb2FkJzoge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpO1xuICAgICAgICAgIGlmICghdGV4dCkgeyBzZXRTdGF0dXMoJ1RlbXBsYXRlIG5vdCBmb3VuZCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgZG93bmxvYWRUZXh0KCdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLCB0ZXh0KTtcbiAgICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQnKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLnNraWxsTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgcmVzZXQg4oCUIGV4cG9ydHMgd2lsbCBidW5kbGUgdGhlIHRlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3dzLWNyZWF0ZSc6IHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICh3c05hbWUudmFsdWUgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG4gICAgICAgIHZvaWQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKS50aGVuKChvaykgPT4geyBpZiAob2spIHdzTmFtZS52YWx1ZSA9ICcnOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBHbG9iYWwga2V5Ym9hcmQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldCA9ICh0YXJnZXQ6IEV2ZW50VGFyZ2V0IHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGVsID0gdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyB0YXJnZXQgOiBudWxsO1xuICAgIHJldHVybiBCb29sZWFuKGVsPy5jbG9zZXN0KCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCwgW2NvbnRlbnRlZGl0YWJsZT1cInRydWVcIl0sIFtjb250ZW50ZWRpdGFibGU9XCJcIl0nKSk7XG4gIH07XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgZWRpdGFibGVUYXJnZXQgPSBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQoZS50YXJnZXQpO1xuICAgIGlmIChlZGl0YWJsZVRhcmdldCAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgWydhJywgJ3onLCAneSddLmluY2x1ZGVzKGUua2V5LnRvTG93ZXJDYXNlKCkpKSByZXR1cm47XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnaycpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBwYWxldHRlLmhpZGRlbiA/IG9wZW5QYWxldHRlKCkgOiBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgLy8gQ3RybCtGIChhbmQgQ21kK0YpIG9wZW5zIHRoZSBpbi1saXN0IHZpc3VhbCBmaW5kIOKAlCBkaXN0aW5jdCBmcm9tIHRoZVxuICAgIC8vIENtZCtLIGNvbW1hbmQgcGFsZXR0ZS4gT3ZlcnJpZGUgdGhlIGJyb3dzZXIncyBuYXRpdmUgZmluZCBzbyB0aGUgcGFuZWxcbiAgICAvLyBvd25zIHRoZSBnZXN0dXJlLlxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2YnKSB7IGUucHJldmVudERlZmF1bHQoKTsgb3BlbkZpbmQoKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB1bmRvKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgKGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd5JyB8fCAoZS5zaGlmdEtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicpKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHJlZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgY29uc3QgbWRNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICAgIGlmIChtZE1vZGFsICYmICFtZE1vZGFsLmhpZGRlbikgeyBjbG9zZU1kTW9kYWwoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSB7IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAgIGlmICghZHJhd2VyLmhpZGRlbikgeyBjbG9zZURyYXdlcigpOyByZXR1cm47IH1cbiAgICAgIGlmIChmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbikgeyBjbG9zZUZpbmQoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgeyB2b2lkIHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSk7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdQZW5kaW5nIGdyb3VwIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogdHJ1ZX0pO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIGlmICghZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBwYW5lbFJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHBlbmRpbmdQYW5lbE1lc3NhZ2VzOiBhbnlbXSA9IFtdO1xuICBjb25zdCByZWNlaXZlUGFuZWxNZXNzYWdlID0gKG06IGFueSk6IHZvaWQgPT4ge1xuICAgIGlmICghcGFuZWxSZWFkeSkge1xuICAgICAgcGVuZGluZ1BhbmVsTWVzc2FnZXMucHVzaChtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25Dc01lc3NhZ2UobSk7XG4gIH07XG4gIGlmIChpbkV4dGVuc2lvbikge1xuICAgIC8vIFNpbmdsZSBjaGFubmVsOiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuIFRoZSBiYWNrZ3JvdW5kIHVzZWQgdG8gcmVsYXlcbiAgICAvLyB0aHJvdWdoIGEgcG9ydCB0b28sIGJ1dCBjb250ZW50LXNjcmlwdCBicm9hZGNhc3RzIGFscmVhZHkgcmVhY2ggdGhlXG4gICAgLy8gc2lkZSBwYW5lbCBkaXJlY3RseSDigJQgcmVsYXlpbmcgcHJvZHVjZWQgZHVwbGljYXRlIGRpc3BhdGNoZXMuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtOiBhbnkpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UobSkpO1xuICAgIGNocm9tZS50YWJzPy5vbkFjdGl2YXRlZD8uYWRkTGlzdGVuZXIoKCkgPT4gdm9pZCBydW5WYWxpZGF0aW9uKCkpO1xuICAgIGNocm9tZS50YWJzPy5vblVwZGF0ZWQ/LmFkZExpc3RlbmVyKChfaWQsIGluZm8pID0+IHsgaWYgKGluZm8/LnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykgdm9pZCBydW5WYWxpZGF0aW9uKCk7IH0pO1xuICAgIGNocm9tZS50YWJzPy5vblJlbW92ZWQ/LmFkZExpc3RlbmVyKChjbG9zZWRJZCkgPT4ge1xuICAgICAgY29uc3Qgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcudGFiSWQgPT09IGNsb3NlZElkKTtcbiAgICAgIGlmICh3cykgeyB3cy50YWJJZCA9IHVuZGVmaW5lZDsgcGVyc2lzdFdvcmtzcGFjZXMoKTsgcmVuZGVyV3NDb250cm9scygpOyB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIChlKSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWwpKTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBUZXN0IEFQSSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaW5zdGFsbFRlc3RBcGkgPSAoKTogdm9pZCA9PiB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLl9fcGluY2hncmFiX3BhbmVsID0ge1xuICAgICAgcHVzaE1lc3NhZ2U6IChtOiBQYW5lbE1lc3NhZ2UpID0+IHsgbWVzc2FnZXMucHVzaChtKTsgcGVyc2lzdCgpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uQ2FwdHVyZSwgb25Ib3Zlciwgb25Ib3ZlckVuZCwgb25QYWdlU25hcHNob3QsXG4gICAgICBnZXRNZXNzYWdlczogKCkgPT4gWy4uLm1lc3NhZ2VzXSxcbiAgICAgIGdldFByZWZzOiAoKSA9PiAoey4uLnByZWZzfSksXG4gICAgICBzZXRQcmVmczogKHA6IFBhcnRpYWw8UHJlZnM+KSA9PiB7IHByZWZzID0gey4uLnByZWZzLCAuLi5wfTsgcGVyc2lzdFByZWZzKCk7IGFwcGx5UHJlZnNUb1VJKCk7IHJlbmRlcigpOyB9LFxuICAgICAgYnVpbGRKc29ubCxcbiAgICAgIGJ1aWxkRXhwb3J0RmlsZW5hbWUsIGJ1aWxkTWFuaWZlc3QsIGRvbWluYW50SG9zdFNsdWcsIGRpc3RpbmN0SG9zdHMsXG4gICAgICBkdWNrRGJTbmlwcGV0LCBvbkV4cG9ydFppcCwgb25FeHBvcnQsIG9uQ29weVBhdGgsXG4gICAgICBkZW5vcm1hbGl6ZUVudHJ5LFxuICAgICAgZ2V0TGFzdEV4cG9ydDogKCkgPT4gKHsuLi5sYXN0RXhwb3J0fSksXG4gICAgICBnZXRMYXN0QWdlbnRQcm9tcHQ6ICgpID0+IGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQsXG4gICAgICAvLyBUZXN0IGhhdGNoOiBzZWVkIGV2ZXJ5IHNlbGVjdG9yIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBmdWxsIFBORyBkYXRhVVJMXG4gICAgICAvLyBzbyB0aGUgYXJjaGl2ZSBleHBvcnQgaGFzIHNvbWV0aGluZyB0byBidW5kbGUuIFJlYWwgY2FwdHVyZXMgcG9wdWxhdGVcbiAgICAgIC8vIHNob3RzRnVsbCBmcm9tIHRoZSBiZyBgcnVuU2hvdGAgcmVwbHk7IHRlc3RzIGNhbid0IGVhc2lseSBydW4gYVxuICAgICAgLy8gY2FwdHVyZVZpc2libGVUYWIsIHNvIHRoaXMgbGV0cyB1cyBwcm92ZSB0aGUgUE5HIGJ1bmRsaW5nIHBhdGguXG4gICAgICBfX3NlZWRTaG90c0Z1bGw6IChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2hvdHNGdWxsLnNldChtLmVudHJ5LnNlbGVjdG9yLCBkYXRhVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgICB9LFxuICAgICAgX19nZXRTaG90c0Z1bGw6ICgpID0+IHNob3RzRnVsbCxcbiAgICAgIC8vIEZyZWV6ZSB0aGUgZXhwb3J0IGNsb2NrIChJU08gc3RyaW5nKSBzbyB0ZXN0cyBjYW4gYXNzZXJ0IHR3b1xuICAgICAgLy8gZXhwb3J0cyBvZiBpZGVudGljYWwgY29udGVudCBhcmUgYnl0ZS1pZGVudGljYWwuIFBhc3MgbnVsbCB0b1xuICAgICAgLy8gcmVzdG9yZSB3YWxsLWNsb2NrIGJlaGF2aW9yLlxuICAgICAgX19zZXRFeHBvcnRDbG9jazogKGlzbzogc3RyaW5nIHwgbnVsbCkgPT4geyBleHBvcnRDbG9ja092ZXJyaWRlID0gaXNvOyB9LFxuICAgICAgLy8gc2V0U2VhcmNoIGRyaXZlcyB0aGUgQ3RybCtGIHZpc3VhbC1maW5kIHBhdGggKHRoZSBoZWFkZXIgc2VhcmNoIG5vd1xuICAgICAgLy8gb3BlbnMgdGhlIGNvbW1hbmQgcGFsZXR0ZSBpbnN0ZWFkIG9mIGZpbHRlcmluZykuXG4gICAgICBzZXRTZWFyY2g6IChxOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHEpIHsgb3BlbkZpbmQoKTsgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gcTsgYXBwbHlGaW5kKHEpOyB9XG4gICAgICAgIGVsc2UgY2xvc2VGaW5kKCk7XG4gICAgICB9LFxuICAgICAgb3BlbkZpbmQsIGNsb3NlRmluZCxcbiAgICAgIGlzRmluZE9wZW46ICgpID0+IEJvb2xlYW4oZmluZEJhciAmJiAhZmluZEJhci5oaWRkZW4pLFxuICAgICAgc2V0VmFsaWRpdHk6IChzZWw6IHN0cmluZywgb2s6IGJvb2xlYW4gfCAnZGlmZi1wYWdlJywgcmVhc29uPzogc3RyaW5nKSA9PiB7XG4gICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICBpZiAocmVhc29uKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCByZWFzb24pO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICAgICAgbGl2ZVRhYlBhdGggPSBudWxsO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgICAgICBzaG90cy5jbGVhcigpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9wZW5QYWxldHRlLCBjbG9zZVBhbGV0dGUsIG9wZW5EcmF3ZXIsIGNsb3NlRHJhd2VyLFxuICAgICAgc2VuZEZlZWRiYWNrLCB1bmRvLCByZWRvLFxuICAgICAgbGlzdFdvcmtzcGFjZXM6ICgpID0+IFsuLi53b3Jrc3BhY2VzXSxcbiAgICAgIGFjdGl2ZVdvcmtzcGFjZTogKCkgPT4gYWN0aXZlV3MsXG4gICAgICBzZXRTdGlja3lUVEw6IChtczogbnVtYmVyKSA9PiB7IFNUSUNLWV9UVExfTVMgPSBtczsgfSxcbiAgICAgIGZvcmNlU3RpY2t5RXhwaXJlOiAoKSA9PiB7IGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7IHBhbmVsSG92ZXJlZCA9IGZhbHNlOyBhcm1TdGlja3lFeHBpcnkoKTsgfSxcbiAgICAgIHNldExhc3RBY3RpdmUsXG4gICAgICBjcmVhdGVXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IHsgd29ya3NwYWNlcy5wdXNoKHtuYW1lOiBuLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0pOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZXR1cm4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlcik7IH0sXG4gICAgICBzd2l0Y2hXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IGxvYWRXb3Jrc3BhY2UobikudGhlbihyZW5kZXIpLFxuICAgICAgY2xlYXJBbGw6IG9uQ2xlYXIsXG4gICAgICBsaXN0U25hcHNob3RzOiAoKSA9PiB3c1NuYXBzaG90cy5tYXAoKHMpID0+ICh7aWQ6IHMuaWQsIHRzOiBzLnRzLCBzZWxlY3RvcnM6IHMuc2VsZWN0b3JzLCBjb21tZW50czogcy5jb21tZW50c30pKSxcbiAgICAgIHJlc3RvcmVTbmFwc2hvdDogKGlkOiBzdHJpbmcpID0+IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdChpZCksXG4gICAgfTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUGFuZWwgc2VsZi1oZWFsIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBBZnRlciBhIGRldiBleHRlbnNpb24gcmVsb2FkIChvciBhbiBhdXRvLXVwZGF0ZSksIHRoZSBzaWRlIHBhbmVsIGtlZXBzXG4gIC8vIHJ1bm5pbmcgaXRzIE9MRCBjb2RlIHdpdGggYW4gSU5WQUxJREFURUQgY2hyb21lLnJ1bnRpbWU6IGNocm9tZS5ydW50aW1lLmlkXG4gIC8vIGdvZXMgdW5kZWZpbmVkIGFuZCBldmVyeSBjaHJvbWUuKiBjYWxsIHRocm93cyBcIkV4dGVuc2lvbiBjb250ZXh0XG4gIC8vIGludmFsaWRhdGVkXCIuIEEgZGVhZCBwYW5lbCBjYW4ndCByZWFjaCB0aGUgYmFja2dyb3VuZCwgc28gTk8gYnV0dG9uIGluIGl0XG4gIC8vIHdvcmtzIOKAlCB3aGljaCBpcyBleGFjdGx5IHdoeSB0aGUgb25seSByZWNvdmVyeSB1c2VkIHRvIGJlIFwiY2xvc2UgdGhlIHBhbmVcbiAgLy8gYW5kIHJlY2xpY2sgdGhlIHRvb2xiYXJcIi4gVGhpcyBoZWFydGJlYXQgZGV0ZWN0cyB0aGF0IGRlYXRoIGFuZCByZWxvYWRzXG4gIC8vIHRoZSBwYW5lbCBwYWdlLCB3aGljaCByZS1mZXRjaGVzIHRoZSBmcmVzaCBjb2RlIGFuZCByZWNvbm5lY3RzLiBBXG4gIC8vIHNlc3Npb25TdG9yYWdlIGNvdW50ZXIgKHN1cnZpdmVzIHRoZSByZWxvYWQpIHByZXZlbnRzIGEgbG9vcCB3aGVuIHRoZVxuICAvLyBleHRlbnNpb24gaXMgZ2VudWluZWx5IGdvbmUgcmF0aGVyIHRoYW4gcmVsb2FkZWQuXG4gIGNvbnN0IHdhdGNoQ29udGV4dEhlYWx0aCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm47XG4gICAgY29uc3QgUkVMT0FEX0tFWSA9ICdwZy5jdHhSZWxvYWRzJztcbiAgICAvLyBPbmNlIHdlJ3ZlIGJlZW4gc3RhYmx5IGFsaXZlIGZvciBhIHdoaWxlLCBjbGVhciB0aGUgbG9vcCBndWFyZC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdHJ5IHsgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShSRUxPQURfS0VZKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9IH0sIDE1MDAwKTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBsZXQgYWxpdmUgPSBmYWxzZTtcbiAgICAgIHRyeSB7IGFsaXZlID0gQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpOyB9IGNhdGNoIHsgYWxpdmUgPSBmYWxzZTsgfVxuICAgICAgaWYgKGFsaXZlKSByZXR1cm47XG4gICAgICBsZXQgbiA9IDA7XG4gICAgICB0cnkgeyBuID0gTnVtYmVyKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVMT0FEX0tFWSkgPz8gJzAnKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICBpZiAobiA+PSAzKSB7XG4gICAgICAgIC8vIEF1dG8tcmVjb3ZlcnkgZXhoYXVzdGVkIChleHRlbnNpb24gbGlrZWx5IHVuaW5zdGFsbGVkLCBub3QgcmVsb2FkZWQpLlxuICAgICAgICBpZiAoc3RhdHVzKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnUGluY2hHcmFiIHdhcyByZWxvYWRlZCDigJQgY2xvc2UgdGhpcyBwYW5lbCBhbmQgcmVvcGVuIGl0IGZyb20gdGhlIHRvb2xiYXIuJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxPQURfS0VZLCBTdHJpbmcobiArIDEpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICBpZiAoc3RhdHVzKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnUGluY2hHcmFiIHJlbG9hZGVkIOKAlCByZWNvbm5lY3RpbmfigKYnO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRyeSB7IGxvY2F0aW9uLnJlbG9hZCgpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfSwgNjAwKTtcbiAgICB9LCAyMDAwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQm9vdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGxvYWRBbGwoKTtcbiAgICBwYW5lbFJlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgcGVuZGluZ1BhbmVsTWVzc2FnZXMuc3BsaWNlKDApKSBvbkNzTWVzc2FnZShtKTtcbiAgICByZW5kZXIoKTtcbiAgICBpbnN0YWxsVGVzdEFwaSgpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHZvaWQgbWF5YmVTaG93UXVpZXROdWRnZSgpO1xuICAgIHZvaWQgZmV0Y2hTdGFycygpO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICAgIHdhdGNoQ29udGV4dEhlYWx0aCgpO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9uLCB3czogYWN0aXZlV3MsIG1lc3NhZ2VzOiBtZXNzYWdlcy5sZW5ndGh9KTtcbiAgfSkoKTtcbn0pKCk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQXluQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUN6RixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBLEVBS0osSUFBTSxLQUFLLENBQTJCLGFBQzFDLEVBQUMsTUFBTSxNQUFNLE9BQU8sT0FBTyxNQUFNLFFBQU87OztFQ2pvQjNDLElBQU0sUUFBZ0M7QUFBQSxJQUNwQyxpQkFBaUI7QUFBQSxJQUNq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LEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFB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LFFBQ0EsSUFBSTtBQUFBLFVBQUUsZUFBZSxRQUFRLFlBQVksT0FBTyxJQUFJLENBQUMsQ0FBQztBQUFBLFVBQUssTUFBTTtBQUFBLFFBQ2pFLElBQUk7QUFBQSxVQUFRLE9BQU8sY0FBYztBQUFBLFFBQ2pDLFdBQVcsTUFBTTtBQUFBLFVBQUUsSUFBSTtBQUFBLFlBQUUsU0FBUyxPQUFPO0FBQUEsWUFBSyxNQUFNO0FBQUEsV0FBb0IsR0FBRztBQUFBLFNBQzFFLElBQUk7QUFBQTtBQUFBLEtBSUgsWUFBWTtBQUFBLE1BQ2hCLE1BQU0sUUFBUTtBQUFBLE1BQ2QsYUFBYTtBQUFBLE1BQ2IsV0FBVyxLQUFLLHFCQUFxQixPQUFPLENBQUM7QUFBQSxRQUFHLFlBQVksQ0FBQztBQUFBLE1BQzdELE9BQU87QUFBQSxNQUNQLGVBQWU7QUFBQSxNQUNWLGNBQWM7QUFBQSxNQUNkLG9CQUFvQjtBQUFBLE1BQ3BCLFdBQVc7QUFBQSxNQUNoQixvQkFBb0I7QUFBQSxNQUNwQixrQkFBa0I7QUFBQSxNQUNsQixtQkFBbUI7QUFBQSxNQUNuQixRQUFRLElBQUksS0FBSyxTQUFTLEVBQUMsYUFBYSxJQUFJLFVBQVUsVUFBVSxTQUFTLE9BQU0sQ0FBQztBQUFBLE9BQy9FO0FBQUEsS0FDRjsiLAogICJkZWJ1Z0lkIjogIjQwODUzQzY1NDQ5OTlCNDU2NDc1NkUyMTY0NzU2RTIxIiwKICAibmFtZXMiOiBbXQp9
