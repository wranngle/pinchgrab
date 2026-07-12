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

//# debugId=A37727B584C3280F64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvYnVuZGxlZC1za2lsbHMuZ2VuLnRzIiwgInNyYy9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICAvLyBVc2VyIGV4cGxpY2l0bHkgZGV0YWNoZWQgdGhpcyBjb21tZW50IGZyb20gYW55IHNlbGVjdG9yLiBXaXRob3V0IHRoZVxuICAvLyBmbGFnLCBhZGphY2VuY3kgdG8gdGhlIHByZWNlZGluZyBzZWxlY3RvciB3b3VsZCBzaWxlbnRseSByZS1hZG9wdCB0aGVcbiAgLy8gY29tbWVudCBhdCByZW5kZXIvZXhwb3J0IHRpbWUuXG4gIGRldGFjaGVkPzogYm9vbGVhbjtcbiAgdGFncz86IHN0cmluZ1tdO1xuICAvLyBTZXZlcml0eSAoYG5vdGVgIC8gYGZpeGAgLyBgYmxvY2tgKSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSBpblxuICAvLyAyMDI2LTA1LiBUaGUgZmllbGQgaXMgcmV0YWluZWQgb24gdGhlIHR5cGUgYXMgYHVua25vd25gIHNvXG4gIC8vIHRvbGVyYW50IHJlYWRlcnMgKGBkZW5vcm1hbGl6ZUVudHJ5YCkgZG9uJ3QgZHJvcCB0aGUgdmFsdWUgZnJvbVxuICAvLyBsZWdhY3kgSlNPTkwgZXhwb3J0czsgbmV3IHNlc3Npb25zIG5ldmVyIHNldCBpdC5cbiAgc2V2ZXJpdHk/OiAnbm90ZScgfCAnZml4JyB8ICdibG9jayc7XG59O1xuXG5leHBvcnQgdHlwZSBQYWdlTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3BhZ2UnO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHZpZXdwb3J0PzogVmlld3BvcnQ7XG4gIHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBSb3V0ZSBpZGVudGl0eSBiZXlvbmQgdGhlIFVSTC4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIG9mIHBhdGhuYW1lXG4gIC8vIC8gcXVlcnkgLyBoYXNoICsgYSBndWVzcyBhdCB0aGVcbiAgLy8gYWN0aXZlIHJvdXRlTmFtZSAoYD9yb3V0ZT1zZXR0aW5nc2Agb3IgYCMvdXNlcnMvNDJgIHN0eWxlKS5cbiAgcm91dGU/OiB7XG4gICAgcGF0aG5hbWU/OiBzdHJpbmc7XG4gICAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGhhc2g/OiBzdHJpbmc7XG4gICAgcm91dGVOYW1lPzogc3RyaW5nO1xuICAgIHJvdXRlUGFyYW0/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFJlZGFjdGVkIHN0YXRlIHNuYXBzaG90LiBTdXJmYWNlcyB0aGUgU0hBUEUgb2Ygc3RhdGUgdGhhdCBwcm9kdWNlZFxuICAvLyB0aGUgcGFnZSAoc3RvcmFnZSBrZXlzLCBjb29raWUgbmFtZXMsIGZlYXR1cmUgZmxhZ3MpIHdpdGhvdXRcbiAgLy8gbGVha2luZyB2YWx1ZXMuIExldHMgYSBkb3duc3RyZWFtIGFnZW50IHJlcHJvZHVjZSBieSBzZXR0aW5nIHVwIHRoZVxuICAvLyBzYW1lIGtleXMgd2l0aCB0aGVpciBvd24gZGF0YS5cbiAgc3RhdGU/OiB7XG4gICAgc3RvcmFnZUtleXM/OiBzdHJpbmdbXTtcbiAgICBzZXNzaW9uS2V5cz86IHN0cmluZ1tdO1xuICAgIGNvb2tpZU5hbWVzPzogc3RyaW5nW107XG4gICAgZmVhdHVyZUZsYWdzPzogc3RyaW5nO1xuICB9O1xuICAvLyBTZXNzaW9uIHV1aWQuIFN0YWJsZSBwZXIgd29ya3NwYWNlLWJvb3Qg4oCUIHNlbGVjdG9yIGVudHJpZXMgcmVmZXJlbmNlXG4gIC8vIGl0IHZpYSBgRW50cnkuc2Vzc2lvbklkYCBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzIHRvIHRoZWlyXG4gIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJpc29uLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbE1lc3NhZ2UgPSBTZWxlY3Rvck1lc3NhZ2UgfCBGZWVkYmFja01lc3NhZ2UgfCBQYWdlTWVzc2FnZTtcblxuLy8gLS0tLS0tLS0tLSBJUEMgcGF5bG9hZHMgKENTIOKGlCBQYW5lbCDihpQgQmFja2dyb3VuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIENzVG9QYW5lbCA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlJzsgZW50cnk6IEVudHJ5OyBwYWdlOiBQYWdlQ29udGV4dDsgZ3JvdXBlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdob3Zlcic7IHNlbGVjdG9yOiBzdHJpbmc7IHRhZzogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByZWN0OiBSZWN0fVxuICB8IHtraW5kOiAnaG92ZXItZW5kJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIC8vIEV4cG9ydC10aW1lIHJlcXVlc3QgZm9yIHRoZSBmdWxsIHNlcmlhbGl6ZWQgcGFnZSAob3B0LWluIHByZWZcbiAgLy8gaW5jbHVkZVBhZ2VIVE1MKS4gUmVwbGllZCB3aXRoIHtvaywgdXJsLCB0aXRsZSwgaHRtbH07IG5ldmVyIHBlcnNpc3RlZFxuICAvLyB0byBjaHJvbWUuc3RvcmFnZSDigJQgdGhlIHBheWxvYWQgZ29lcyBzdHJhaWdodCBpbnRvIHRoZSB0YXIuXG4gIHwge2tpbmQ6ICdwYWdlLWh0bWwnfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gRnVsbC1wYWdlIChiZXN0LWVmZm9ydCkgc2NyZWVuc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gVW5saWtlXG4gIC8vIHNob3QtcGFnZSB0aGlzIGRvZXMgTk9UIHdyaXRlIGEgZmlsZSBvciBidWlsZCBhIHRodW1ibmFpbCDigJQgaXQganVzdFxuICAvLyByZXR1cm5zIHRoZSBzdGl0Y2hlZCBQTkcgYXMgYSBkYXRhIFVSTCBzbyB0aGUgY2FsbGVyIChjb250ZW50IHNjcmlwdCkgY2FuXG4gIC8vIGF0dGFjaCBpdCB0byBhIFBhZ2VTbmFwc2hvdC4gYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydFxuICAvLyBjb3VsZCBiZSBjYXB0dXJlZC5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gKHJlKWluamVjdCB0aGUgY29udGVudCBzY3JpcHQg4oCUIHRoZSBmaXhcbiAgLy8gZm9yIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIGNvbnRlbnQgc2NyaXB0LiBEZWZhdWx0cyB0byB0aGUgYWN0aXZlIHRhYi5cbiAgfCB7a2luZDogJ3BnLXJlaW5qZWN0JzsgdGFiSWQ/OiBudW1iZXJ9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuLy8gUmVwbHkgdG8gYSBgcGFnZS1zbmFwc2hvdC1zaG90YCByZXF1ZXN0LiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwgb2Zcbi8vIHRoZSAoYmVzdC1lZmZvcnQpIGZ1bGwgcGFnZTsgYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCB3YXNcbi8vIGNhcHR1cmVkLiBgb2s6ZmFsc2VgIGNhcnJpZXMgYW4gZXJyb3Igc3RyaW5nLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBzY3JlZW5zaG90Pzogc3RyaW5nO1xuICBwYXJ0aWFsPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBTYXZlUmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGhcbiAgYWJzUGF0aD86IHN0cmluZzsgIC8vIE9TLWFic29sdXRlIHBhdGhcbiAgY29weVBhdGg/OiBzdHJpbmc7IC8vIFVJLWZhY2luZyBwYXRoXG4gIHRlbXBQYXRoPzogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBCZ1JlcGx5ID1cbiAgfCB7ZGF0YVVybDogc3RyaW5nfVxuICB8IHtmb3VuZDogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyfVxuICB8IHt0YWJzOiBBcnJheTx7aWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9Pn1cbiAgfCB7ZXJyb3I6IHN0cmluZ31cbiAgfCBTaG90UmVwbHlcbiAgfCBTYXZlUmVwbHlcbiAgfCBQYWdlU25hcHNob3RSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5OiBmaXJzdCAxNiBoZXggY2hhcnMgb2YgYSBTSEEtMjU2IG92ZXIgdGhlXG4gIC8vIHNsaW0gcm93cyArIHNjcmVlbnNob3QgbmFtZXMuIFN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cyBvZiB0aGUgc2FtZVxuICAvLyBjb250ZW50LCBzbyBkb3duc3RyZWFtIHN0YXRlIChlLmcuIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyovYnVuZGxlcy8pXG4gIC8vIGtleXMgb24gaXQgd2l0aG91dCBkdXBsaWNhdGluZyB3b3JrLlxuICBidW5kbGVJZD86IHN0cmluZztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gICAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gICAgcGFnZXNIdG1sPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBXaGVyZSB0aGUgYWdlbnQgZG9jdHJpbmUgbGl2ZXMgaW5zaWRlIHRoZSBhcmNoaXZlIChTZW5kLXRvLUFnZW50XG4gIC8vIHByb3RvY29sKS4gQWJzZW50IG9uIHBsYWluIEpTT05MIGV4cG9ydHMuXG4gIGFnZW50UHJvdG9jb2w/OiB7YXJjaGl2ZVBhdGg6IHN0cmluZ307XG4gIC8vIFZlbmRvcmVkIHNraWxsIGRvY3VtZW50cyBidW5kbGVkIGludG8gdGhpcyBhcmNoaXZlIChzdWJzZXQgb2YgdGhlXG4gIC8vIHJpY2hlciBza2lsbHMtaW5kZXguanNvbiBhdCB0aGUgYXJjaGl2ZSByb290KS4gYGludm9jYXRpb25gIGNhcnJpZXMgYVxuICAvLyBwbHVnaW4tY29tbWFuZCBmb3JtIGZvciBoYXJuZXNzZXMgdGhhdCBzdXBwb3J0IGl0LlxuICBidW5kbGVkU2tpbGxzPzogQXJyYXk8e2lkOiBzdHJpbmc7IGtpbmQ6ICdza2lsbCcgfCAncmVmZXJlbmNlJzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgaW52b2NhdGlvbj86IHN0cmluZ30+O1xuICAvLyBGdWxsLXBhZ2UgSFRNTCBkb2N1bWVudHMgYnVuZGxlZCB1bmRlciBwYWdlcy8gKG9wdC1pbiBwcmVmKS5cbiAgcGFnZXNIdG1sPzogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47XG4gIC8vIFNlbGYtcm9hc3Qgc2VjdGlvbi4gVGhlIGV4cG9ydCBzdXJmYWNlcyBpdHMgb3duIGdhcHMgc28gYVxuICAvLyBkb3duc3RyZWFtIExMTSBkb2Vzbid0IGhhdmUgdG8gZGlzY292ZXJcbiAgLy8gdGhlbS4gRW1wdHkgYXJyYXkgPSBjbGVhbiBleHBvcnQuIEVhY2ggZGlhZ25vc3RpYyBoYXMgYSBzdGFibGVcbiAgLy8gYGNvZGVgIHNvIHJlY2VpdmVycyBjYW4gZGlzcGF0Y2ggb24gaXQgcHJvZ3JhbW1hdGljYWxseS5cbiAgZXhwb3J0RGlhZ25vc3RpY3M/OiBFeHBvcnREaWFnbm9zdGljW107XG4gIC8vIEFyY2hpdmUgaW50ZWdyaXR5LiBSZWNlaXZlcnMgY2FuIGRldGVjdCBwYXJ0aWFsIGV4dHJhY3Rpb24gL1xuICAvLyBjb3JydXB0aW9uIHdpdGggYSBzaW5nbGUgY2hlY2suXG4gIGFyY2hpdmVJbnRlZ3JpdHk/OiB7XG4gICAgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+O1xuICB9O1xuICAvLyBCdWlsZC9zb3VyY2UgaWRlbnRpdHkuIENhcHR1cmVkIGZyb20gYVxuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluIGRpcnR5OnRydWVcIj5gXG4gIC8vIHRhZyB0aGUgdXNlcidzIGFwcCBpbmplY3RzLCBwbHVzIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB0ZWxsIGlmIHRoZSBleHBvcnQgaXMgc3RhbGUgcmVsYXRpdmUgdG8gdGhlIHJlcG8uXG4gIC8vIE9taXR0ZWQgZW50aXJlbHkgd2hlbiBubyBidWlsZCBpbmZvIGlzIGF2YWlsYWJsZS5cbiAgYnVpbGQ/OiB7XG4gICAgZXh0ZW5zaW9uVmVyc2lvbj86IHN0cmluZztcbiAgICBjb21taXQ/OiBzdHJpbmc7XG4gICAgYnJhbmNoPzogc3RyaW5nO1xuICAgIGRpcnR5PzogYm9vbGVhbjtcbiAgICBkZXBsb3lCdWlsZD86IHN0cmluZztcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIEV4cG9ydERpYWdub3N0aWMgPSB7XG4gIHNldmVyaXR5OiAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nO1xuICBjb2RlOiBzdHJpbmc7XG4gIGRldGFpbD86IHN0cmluZztcbiAgdWlkPzogc3RyaW5nO1xufTtcblxuLy8gRW52ZWxvcGUgbWFya2VyIHVzZWQgb24gZXZlcnkgUGluY2hHcmFiIG1lc3NhZ2UgKHNvIG90aGVyIGV4dGVuc2lvblxuLy8gbWVzc2FnZXMgdHJhdmVsaW5nIHRocm91Z2ggdGhlIHNhbWUgY2hhbm5lbCBhcmUgaWdub3JlZCkuIF9fbWlkIGlzIGFcbi8vIHBlci1kaXNwYXRjaCB1bmlxdWUgc3RhbXAgc28gcmVjZWl2ZXJzIGNhbiBkZWR1cGUgYSBtZXNzYWdlIHRoYXQgYXJyaXZlc1xuLy8gdGhyb3VnaCBtb3JlIHRoYW4gb25lIGNoYW5uZWwgKGUuZy4gcnVudGltZS5vbk1lc3NhZ2UgKyBhIHBvcnQgcmVsYXkpLlxuZXhwb3J0IHR5cGUgUGdFbnZlbG9wZTxUPiA9IFQgJiB7X19wZzogdHJ1ZTsgX19taWQ6IHN0cmluZ307XG5cbmV4cG9ydCB0eXBlIEFueU1lc3NhZ2UgPSBDc1RvUGFuZWwgfCBQYW5lbFRvQ3MgfCBQYW5lbFRvQmc7XG5cbmxldCBfbWlkQ291bnRlciA9IDA7XG5jb25zdCBuZXdNaWQgPSAoKTogc3RyaW5nID0+IHtcbiAgY29uc3QgcHJlZml4ID0gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7KCsrX21pZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB0cnkge1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke0FycmF5LmZyb20oYnl0ZXMpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxufTtcblxuLy8gSGVscGVyOiBzdGFtcCBhIHBheWxvYWQgd2l0aCB0aGUgZW52ZWxvcGUgbWFya2VyICsgdW5pcXVlIG1lc3NhZ2UgaWQuXG5leHBvcnQgY29uc3QgcGcgPSA8VCBleHRlbmRzIHtraW5kOiBzdHJpbmd9PihwYXlsb2FkOiBUKTogUGdFbnZlbG9wZTxUPiA9PlxuICAoe19fcGc6IHRydWUsIF9fbWlkOiBuZXdNaWQoKSwgLi4ucGF5bG9hZH0pIGFzIFBnRW52ZWxvcGU8VD47XG4iLAogICAgIi8vIFN1YnNldCBvZiBsdWNpZGUuZGV2IGljb25zIGlubGluZWQgYXMgU1ZHIGlubmVyLW1hcmt1cC5cbi8vIEVhY2ggZW50cnkgaXMgdGhlIGJvZHkgb2YgPHN2ZyAuLi4gPiAuLi4gPC9zdmc+OyBzdmdTdHJpbmcoKSB3cmFwcyBpdC5cbi8vIFNpemVzIGRlZmF1bHQgdG8gMTY7IG92ZXJyaWRlIHdpdGggdGhlIHNpemUgYXJndW1lbnQuXG4vL1xuLy8gTUlUIOKAlCBodHRwczovL2dpdGh1Yi5jb20vbHVjaWRlLWljb25zL2x1Y2lkZVxuXG5jb25zdCBJQ09OUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2NoZXZyb24tcmlnaHQnOiAnPHBhdGggZD1cIm05IDE4IDYtNi02LTZcIi8+JyxcbiAgJ2NoZXZyb24tZG93bic6ICc8cGF0aCBkPVwibTYgOSA2IDYgNi02XCIvPicsXG4gIGNvcHk6ICc8cmVjdCB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB4PVwiOFwiIHk9XCI4XCIgcng9XCIyXCIgcnk9XCIyXCIvPjxwYXRoIGQ9XCJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyXCIvPicsXG4gIHBlbmNpbDogJzxwYXRoIGQ9XCJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3elwiLz48cGF0aCBkPVwibTE1IDUgNCA0XCIvPicsXG4gICd0cmFzaC0yJzogJzxwYXRoIGQ9XCJNMyA2aDE4XCIvPjxwYXRoIGQ9XCJNMTkgNnYxNGMwIDEtMSAyLTIgMkg3Yy0xIDAtMi0xLTItMlY2XCIvPjxwYXRoIGQ9XCJNOCA2VjRjMC0xIDEtMiAyLTJoNGMxIDAgMiAxIDIgMnYyXCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjEwXCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxNFwiIHgyPVwiMTRcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz4nLFxuICBwbHVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPjxwYXRoIGQ9XCJNMTIgNXYxNFwiLz4nLFxuICB4OiAnPHBhdGggZD1cIk0xOCA2IDYgMThcIi8+PHBhdGggZD1cIm02IDYgMTIgMTJcIi8+JyxcbiAgbWludXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+JyxcbiAgc2VhcmNoOiAnPGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI4XCIvPjxwYXRoIGQ9XCJtMjEgMjEtNC4zLTQuM1wiLz4nLFxuICBkb3dubG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiNyAxMCAxMiAxNSAxNyAxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMTVcIiB5Mj1cIjNcIi8+JyxcbiAgdXBsb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNyA4IDEyIDMgNyA4XCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIzXCIgeTI9XCIxNVwiLz4nLFxuICBnaXRodWI6ICc8cGF0aCBkPVwiTTE1IDIydi00YTQuOCA0LjggMCAwIDAtMS0zLjVjMyAwIDYtMiA2LTUuNS4wOC0xLjI1LS4yNy0yLjQ4LTEtMy41LjI4LTEuMTUuMjgtMi4zNSAwLTMuNSAwIDAtMSAwLTMgMS41LTIuNjQtLjUtNS4zNi0uNS04IDBDNiAyIDUgMiA1IDJjLS4zIDEuMTUtLjMgMi4zNSAwIDMuNUE1LjQgNS40IDAgMCAwIDQgOWMwIDMuNSAzIDUuNSA2IDUuNS0uMzkuNDktLjY4IDEuMDUtLjg1IDEuNjUtLjE3LjYtLjIyIDEuMjMtLjE1IDEuODV2NFwiLz48cGF0aCBkPVwiTTkgMThjLTQuNTEgMi01LTItNy0yXCIvPicsXG4gIHN0YXI6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIvPicsXG4gICdjaXJjbGUtZG90JzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBjcm9zc2hhaXI6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMjJcIiB4Mj1cIjE4XCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCI2XCIgeDI9XCIyXCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjZcIiB5Mj1cIjJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjIyXCIgeTI9XCIxOFwiLz4nLFxuICB0YXJnZXQ6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNlwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjJcIi8+JyxcbiAgJ3BhbmVsLWxlZnQtY2xvc2UnOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiLz48cGF0aCBkPVwiTTkgM3YxOFwiLz48cGF0aCBkPVwibTE2IDE1LTMtMyAzLTNcIi8+JyxcbiAgJ2V4dGVybmFsLWxpbmsnOiAnPHBhdGggZD1cIk0xNSAzaDZ2NlwiLz48cGF0aCBkPVwiTTEwIDE0IDIxIDNcIi8+PHBhdGggZD1cIk0xOCAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmg2XCIvPicsXG4gICdtZXNzYWdlLXNxdWFyZS1wbHVzJzogJzxwYXRoIGQ9XCJNMjEgMTVhMiAyIDAgMCAxLTIgMkg3bC00IDRWNWEyIDIgMCAwIDEgMi0yaDE0YTIgMiAwIDAgMSAyIDJ6XCIvPjxsaW5lIHgxPVwiOVwiIHgyPVwiMTVcIiB5MT1cIjEwXCIgeTI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiN1wiIHkyPVwiMTNcIi8+JyxcbiAgJ2FsZXJ0LWNpcmNsZSc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI4XCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMi4wMVwiIHkxPVwiMTZcIiB5Mj1cIjE2XCIvPicsXG4gICdyZWZyZXNoLWN3JzogJzxwYXRoIGQ9XCJNMyAxMmE5IDkgMCAwIDEgMTUtNi43TDIxIDhcIi8+PHBhdGggZD1cIk0yMSAzdjVoLTVcIi8+PHBhdGggZD1cIk0yMSAxMmE5IDkgMCAwIDEtMTUgNi43TDMgMTZcIi8+PHBhdGggZD1cIk0zIDIxdi01aDVcIi8+JyxcbiAgJ2ZpbGUtdGV4dCc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjEzXCIgeTI9XCIxM1wiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxN1wiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiOFwiIHkxPVwiOVwiIHkyPVwiOVwiLz4nLFxuICAnZmlsZS1jb2RlJzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PHBhdGggZD1cIm0xMCAxMy0yIDIgMiAyXCIvPjxwYXRoIGQ9XCJtMTQgMTcgMi0yLTItMlwiLz4nLFxuICBpbWFnZTogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIiByeT1cIjJcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjlcIiByPVwiMlwiLz48cGF0aCBkPVwibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjFcIi8+JyxcbiAgLy8gU3R5bGlzZWQgXCJwaW5jaFwiIOKAlCB0d28gb3Bwb3NpbmcgY3VydmVzIG1lZXRpbmcgYXQgYSBjZW50ZXIgZG90LlxuICBwaW5jaDogJzxwYXRoIGQ9XCJNNSA1YzMgMiA1IDQgNyA3LTIgMy00IDUtNyA3XCIvPjxwYXRoIGQ9XCJNMTkgNWMtMyAyLTUgNC03IDcgMiAzIDQgNSA3IDdcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxLjVcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gICdzdGFyLWZpbGxlZCc6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBwaW46ICc8cGF0aCBkPVwiTTEyIDE3djVcIi8+PHBhdGggZD1cIk05IDEwLjc2YTIgMiAwIDAgMS0xLjExIDEuNzlsLTEuNzguOUEyIDIgMCAwIDAgNSAxNS4yNFYxNmExIDEgMCAwIDAgMSAxaDEyYTEgMSAwIDAgMCAxLTF2LS43NmEyIDIgMCAwIDAtMS4xMS0xLjc5bC0xLjc4LS45QTIgMiAwIDAgMSAxNSAxMC43NlY3YTEgMSAwIDAgMSAxLTEgMiAyIDAgMCAwIDAtNEg4YTIgMiAwIDAgMCAwIDQgMSAxIDAgMCAxIDEgMXpcIi8+JyxcbiAgdW5kbzogJzxwYXRoIGQ9XCJNMyA3djZoNlwiLz48cGF0aCBkPVwiTTIxIDE3YTkgOSAwIDAgMC0xNS02LjdMMyAxM1wiLz4nLFxuICByZWRvOiAnPHBhdGggZD1cIk0yMSA3djZoLTZcIi8+PHBhdGggZD1cIk0zIDE3YTkgOSAwIDAgMSAxNS02LjdMMjEgMTNcIi8+JyxcbiAgZm9sZGVyOiAnPHBhdGggZD1cIk0yMCAyMGEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMmgtNy45M2EyIDIgMCAwIDEtMS42Ni0uOWwtLjgyLTEuMkEyIDIgMCAwIDAgNy45MyAzSDRhMiAyIDAgMCAwLTIgMnYxM2EyIDIgMCAwIDAgMiAyWlwiLz4nLFxuICBjaGVjazogJzxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiLz4nLFxuICAnY2lyY2xlLWNoZWNrJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIi8+JyxcbiAgZ3JpcDogJzxjaXJjbGUgY3g9XCI5XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxOVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTlcIiByPVwiMVwiLz4nLFxuICAvLyBCcm9rZW4tY2hhaW4gaWNvbiBmb3IgXCJkZXRhY2ggY29tbWVudCBmcm9tIGl0cyBjYXB0dXJlXCIuIEx1Y2lkZSdzIGB1bmxpbmtgLlxuICB1bmxpbms6ICc8cGF0aCBkPVwibTE4Ljg0IDEyLjI1IDEuNzItMS43MWgtLjAyYTUuMDA0IDUuMDA0IDAgMCAwLS4xMi03LjA3IDUuMDA2IDUuMDA2IDAgMCAwLTYuOTUgMGwtMS43MiAxLjcxXCIvPjxwYXRoIGQ9XCJtNS4xNyAxMS43NS0xLjcxIDEuNzFhNS4wMDQgNS4wMDQgMCAwIDAgLjEyIDcuMDcgNS4wMDYgNS4wMDYgMCAwIDAgNi45NSAwbDEuNzEtMS43MVwiLz48bGluZSB4MT1cIjhcIiB4Mj1cIjhcIiB5MT1cIjJcIiB5Mj1cIjVcIi8+PGxpbmUgeDE9XCIyXCIgeDI9XCI1XCIgeTE9XCI4XCIgeTI9XCI4XCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjE2XCIgeTE9XCIxOVwiIHkyPVwiMjJcIi8+PGxpbmUgeDE9XCIxOVwiIHgyPVwiMjJcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICBzZXR0aW5nczogJzxwYXRoIGQ9XCJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiLz4nLFxuICBpbmZvOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTEyIDE2di00XCIvPjxwYXRoIGQ9XCJNMTIgOGguMDFcIi8+JyxcbiAgLy8gVHJlZS1vZi1yb3dzIOKAlCB1c2VkIGZvciBcIlNwbGl0IGdyb3VwXCIgYWN0aW9uIChkZW5vdGVzIG9uZSBub2RlIGZhbm5pbmdcbiAgLy8gb3V0IGludG8gc2libGluZ3MpLiBMdWNpZGUncyBgbGlzdC10cmVlYC5cbiAgJ2xpc3QtdHJlZSc6ICc8cGF0aCBkPVwiTTIxIDEyaC04XCIvPjxwYXRoIGQ9XCJNMjEgNkg4XCIvPjxwYXRoIGQ9XCJNMjEgMThoLThcIi8+PHBhdGggZD1cIk0zIDZ2NGMwIDEuMS45IDIgMiAyaDNcIi8+PHBhdGggZD1cIk0zIDEwdjZjMCAxLjEuOSAyIDIgMmgzXCIvPicsXG4gIC8vIEdlbmVyaWMgc3BsaXQgaWNvbiBhcyBhIGZhbGxiYWNrIG9wdGlvbi5cbiAgc3BsaXQ6ICc8cGF0aCBkPVwiTTE2IDNoNXY1XCIvPjxwYXRoIGQ9XCJNOCAzSDN2NVwiLz48cGF0aCBkPVwibTIxIDMtNy40NiA3LjQ2YTIgMiAwIDAgMCAwIDIuODNMMjEgMjFcIi8+PHBhdGggZD1cIk0zIDNsNy40NiA3LjQ2YTIgMiAwIDAgMSAwIDIuODNMMyAyMVwiLz4nLFxuICAvLyBDYXJkYm9hcmQtc3R5bGUgYm94IHVzZWQgZm9yIFwiRXhwb3J0IHdvcmtzcGFjZSBhcyBaSVBcIi5cbiAgcGFja2FnZTogJzxwYXRoIGQ9XCJtNy41IDQuMjcgOSA1LjE1XCIvPjxwYXRoIGQ9XCJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaXCIvPjxwYXRoIGQ9XCJNMy4zIDcgMTIgMTJsOC43LTVcIi8+PHBhdGggZD1cIk0xMiAyMlYxMlwiLz4nLFxuICAvLyBUd28gaW50ZXJsb2NraW5nIGxpbmtzIOKAlCB1c2VkIGZvciBcIkNvcHkgYXMgcGF0aFwiLlxuICBsaW5rOiAnPHBhdGggZD1cIk0xMCAxM2E1IDUgMCAwIDAgNy41NC41NGwzLTNhNSA1IDAgMCAwLTcuMDctNy4wN2wtMS43MiAxLjcxXCIvPjxwYXRoIGQ9XCJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzFcIi8+JyxcbiAgLy8gRGF0YWJhc2UvZHVjayBpY29uIGZvciB0aGUgRHVja0RCIHBhbGV0dGUgY29tbWFuZC5cbiAgZGF0YWJhc2U6ICc8ZWxsaXBzZSBjeD1cIjEyXCIgY3k9XCI1XCIgcng9XCI5XCIgcnk9XCIzXCIvPjxwYXRoIGQ9XCJNMyA1VjE5QTkgMyAwIDAgMCAyMSAxOVY1XCIvPjxwYXRoIGQ9XCJNMyAxMkE5IDMgMCAwIDAgMjEgMTJcIi8+Jyxcbn07XG5cbmNvbnN0IHdyYXAgPSAoYm9keTogc3RyaW5nLCBzaXplOiBudW1iZXIpOiBzdHJpbmcgPT5cbiAgYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiJHtzaXplfVwiIGhlaWdodD1cIiR7c2l6ZX1cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+JHtib2R5fTwvc3ZnPmA7XG5cbmV4cG9ydCBjb25zdCBQR19JQ09OUyA9IHtcbiAgaGFzOiAobmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiBuYW1lIGluIElDT05TLFxuICBzdmdTdHJpbmc6IChuYW1lOiBzdHJpbmcsIHNpemUgPSAxNik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYm9keSA9IElDT05TW25hbWVdO1xuICAgIGlmICghYm9keSkge1xuICAgICAgY29uc29sZS53YXJuKCdbbHVjaWRlXSBtaXNzaW5nIGljb24nLCBuYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAoYm9keSwgc2l6ZSk7XG4gIH0sXG4gIG1vdW50OiAoZWw6IEVsZW1lbnQgfCBudWxsLCBuYW1lOiBzdHJpbmcsIHNpemU/OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoZWwpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgfSxcbn07XG5cbi8vIFNpZGUtZWZmZWN0IGZvciBsZWdhY3kgc2NyaXB0LXRhZyBpbmNsdXNpb24gKHNpZGVwYW5lbC5odG1sIHN0aWxsIDxzY3JpcHRcbi8vIHNyYz1cImx1Y2lkZS5qc1wiPiDigJQgcHJlLWJ1bmRsZSkuIFJlLWV4cG9zZXMgdGhlIHJlZ2lzdHJ5IG9uIGdsb2JhbFRoaXMuXG5pZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gIChnbG9iYWxUaGlzIGFzIGFueSkuUEdfSUNPTlMgPSBQR19JQ09OUztcbn1cbiIsCiAgICAiLy8gVVNUQVItZm9ybWF0IHRhciBlbmNvZGVyLiBFYWNoIGVudHJ5IGlzIGEgNTEyLWJ5dGUgaGVhZGVyIGZvbGxvd2VkIGJ5XG4vLyBjb250ZW50IGJ5dGVzIHBhZGRlZCB1cCB0byB0aGUgbmV4dCA1MTItYnl0ZSBib3VuZGFyeS4gVGhlIGFyY2hpdmUgZW5kc1xuLy8gd2l0aCB0d28gemVyby1maWxsZWQgNTEyLWJ5dGUgYmxvY2tzLiB+ODAgbGluZXMsIG5vIGRlcGVuZGVuY2llcy5cbi8vXG4vLyBXZSBwaWNrIHRhciAocmF0aGVyIHRoYW4gemlwKSBiZWNhdXNlIHpzdGQgaXMgdGhlIHdpcmUgZm9ybWF0IHdlIHdhbnQgdG9cbi8vIHBhaXIgaXQgd2l0aCBhbmQgdGFyLnpzdCBpcyB0aGUgc3RhbmRhcmQgY29tYm8gKHppcCBpcyBpdHMgb3duXG4vLyBjb21wcmVzc2lvbiBjb250YWluZXIpLiBQYXRocyBsb25nZXIgdGhhbiAxMDAgY2hhcnMgdXNlIHRoZSBzdGFuZGFyZFxuLy8gdXN0YXIgcHJlZml4IGZpZWxkICgxNTUgYnl0ZXMgYXQgb2Zmc2V0IDM0NSk6IHRoZSBwYXRoIGlzIHNwbGl0IGF0IGFcbi8vIHNsYXNoIGludG8gcHJlZml4KOKJpDE1NSkvbmFtZSjiiaQxMDApLiBPbmx5IHVuc3BsaXR0YWJsZSBwYXRocyB0aHJvdyDigJRcbi8vIEdOVS9QQVggbG9uZy1uYW1lIGV4dGVuc2lvbnMgYXJlIGRlbGliZXJhdGVseSBub3QgaW1wbGVtZW50ZWQuXG5cbmNvbnN0IGVuYyA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG5jb25zdCB3cml0ZU9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIC8vIHRhciBmaWVsZHMgYXJlIHplcm8tcGFkZGVkIG51bGwtdGVybWluYXRlZCBvY3RhbCBzdHJpbmdzLlxuICBsZXQgcyA9IHZhbHVlLnRvU3RyaW5nKDgpO1xuICBzID0gcy5wYWRTdGFydChsZW5ndGggLSAxLCAnMCcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDE7IGkrKykgYnVmW29mZnNldCArIGldID0gcy5jaGFyQ29kZUF0KGkpO1xuICBidWZbb2Zmc2V0ICsgbGVuZ3RoIC0gMV0gPSAwO1xufTtcblxuY29uc3Qgd3JpdGVBc2NpaSA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBzdHI6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3QgYnl0ZXMgPSBlbmMuZW5jb2RlKHN0cik7XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKGJ5dGVzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV0hO1xufTtcblxuY29uc3QgaGVhZGVyQ2hlY2tzdW0gPSAoaGVhZGVyOiBVaW50OEFycmF5KTogbnVtYmVyID0+IHtcbiAgLy8gVGhlIGNoZWNrc3VtIGZpZWxkICg4IGJ5dGVzIGF0IG9mZnNldCAxNDgpIGlzIHRyZWF0ZWQgYXMgQVNDSUkgc3BhY2VzXG4gIC8vIGR1cmluZyBjb21wdXRhdGlvbiwgdGhlbiB0aGUgYWN0dWFsIGNoZWNrc3VtIGlzIHdyaXR0ZW4gaW50byBpdC5cbiAgbGV0IHN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICBpZiAoaSA+PSAxNDggJiYgaSA8IDE1Nikgc3VtICs9IDB4MjA7XG4gICAgZWxzZSBzdW0gKz0gaGVhZGVyW2ldID8/IDA7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbmV4cG9ydCB0eXBlIFRhckVudHJ5ID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRhdGE6IFVpbnQ4QXJyYXkgfCBzdHJpbmc7XG4gIG10aW1lPzogbnVtYmVyOyAvLyB1bml4IGVwb2NoIHNlY29uZHM7IGRlZmF1bHRzIHRvIG5vd1xufTtcblxuLy8gdXN0YXIgbmFtZSBzcGxpdDogcGF0aHMg4omkMTAwIGNoYXJzIGdvIHN0cmFpZ2h0IGludG8gdGhlIG5hbWUgZmllbGQ7XG4vLyBsb25nZXIgcGF0aHMgc3BsaXQgYXQgdGhlIHJpZ2h0bW9zdCBzbGFzaCB0aGF0IGxlYXZlcyBwcmVmaXgg4omkMTU1IGFuZFxuLy8gdGFpbCDiiaQxMDAuIFRoZSByZWFkZXIgcmVhc3NlbWJsZXMgYHByZWZpeCArICcvJyArIG5hbWVgLlxuY29uc3Qgc3BsaXRUYXJOYW1lID0gKGZ1bGw6IHN0cmluZyk6IHtuYW1lOiBzdHJpbmc7IHByZWZpeDogc3RyaW5nfSA9PiB7XG4gIGlmIChmdWxsLmxlbmd0aCA8PSAxMDApIHJldHVybiB7bmFtZTogZnVsbCwgcHJlZml4OiAnJ307XG4gIGxldCBjdXQgPSAtMTtcbiAgZm9yIChsZXQgaSA9IGZ1bGwuaW5kZXhPZignLycpOyBpICE9PSAtMTsgaSA9IGZ1bGwuaW5kZXhPZignLycsIGkgKyAxKSkge1xuICAgIGlmIChpIDw9IDE1NSAmJiBmdWxsLmxlbmd0aCAtIGkgLSAxIDw9IDEwMCkgY3V0ID0gaTtcbiAgfVxuICBpZiAoY3V0ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgdGFyOiBwYXRoIG5vdCBzcGxpdHRhYmxlIGludG8gdXN0YXIgcHJlZml4KDE1NSkvbmFtZSgxMDApOiAke2Z1bGx9YCk7XG4gIH1cbiAgcmV0dXJuIHtwcmVmaXg6IGZ1bGwuc2xpY2UoMCwgY3V0KSwgbmFtZTogZnVsbC5zbGljZShjdXQgKyAxKX07XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRUYXIgPSAoZW50cmllczogVGFyRW50cnlbXSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBjb25zdCBub3dTZWMgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlbnRyeS5kYXRhID09PSAnc3RyaW5nJyA/IGVuYy5lbmNvZGUoZW50cnkuZGF0YSkgOiBlbnRyeS5kYXRhO1xuICAgIGNvbnN0IHtuYW1lLCBwcmVmaXh9ID0gc3BsaXRUYXJOYW1lKGVudHJ5Lm5hbWUpO1xuICAgIGNvbnN0IGhlYWRlciA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDAsIG5hbWUsIDEwMCk7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwMCwgMG82NDQsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RlXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwOCwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1aWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTE2LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMjQsIGRhdGEubGVuZ3RoLCAxMik7ICAgICAgICAgICAgICAgICAgLy8gc2l6ZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMzYsIGVudHJ5Lm10aW1lID8/IG5vd1NlYywgMTIpOyAgICAgICAgLy8gbXRpbWVcbiAgICBmb3IgKGxldCBpID0gMTQ4OyBpIDwgMTU2OyBpKyspIGhlYWRlcltpXSA9IDB4MjA7ICAgICAgICAgIC8vIGNoZWNrc3VtIHBsYWNlaG9sZGVyXG4gICAgaGVhZGVyWzE1Nl0gPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0eXBlZmxhZyAnMCcgPSByZWd1bGFyIGZpbGVcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjU3LCAndXN0YXInLCA2KTsgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI2MywgJzAwJywgMik7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2ZXJzaW9uXG4gICAgaWYgKHByZWZpeCkgd3JpdGVBc2NpaShoZWFkZXIsIDM0NSwgcHJlZml4LCAxNTUpOyAgICAgICAgICAvLyB1c3RhciBwcmVmaXhcbiAgICAvLyB1bmFtZS9nbmFtZS9kZXZtYWpvci9kZXZtaW5vciBsZWZ0IHplcm8uXG5cbiAgICBjb25zdCBjaGVja3N1bSA9IGhlYWRlckNoZWNrc3VtKGhlYWRlcik7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDE0OCwgY2hlY2tzdW0sIDgpO1xuXG4gICAgYmxvY2tzLnB1c2goaGVhZGVyKTtcbiAgICBibG9ja3MucHVzaChkYXRhKTtcbiAgICBjb25zdCBwYWQgPSAoNTEyIC0gKGRhdGEubGVuZ3RoICUgNTEyKSkgJSA1MTI7XG4gICAgaWYgKHBhZCkgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkocGFkKSk7XG4gIH1cbiAgLy8gVHJhaWxlcjogdHdvIGNvbnNlY3V0aXZlIDUxMi1ieXRlIHplcm8gYmxvY2tzLlxuICBibG9ja3MucHVzaChuZXcgVWludDhBcnJheSgxMDI0KSk7XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmZzZXQpOyBvZmZzZXQgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBac3RkIHJhdy1ibG9jayBmcmFtZSB3cml0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gQ29tcHJlc3Npb25TdHJlYW0oJ3pzdGQnKSBpc24ndCBzaGlwcGVkIGluIGN1cnJlbnQgQ2hyb21pdW0gKHZlcmlmaWVkIHZpYVxuLy8gcnVudGltZSBwcm9iZSksIHNvIHdlIHdyaXRlIGEgdmFsaWQgenN0ZCBmcmFtZSBjb250YWluaW5nIG9uZSBvciBtb3JlXG4vLyByYXcgKHVuY29tcHJlc3NlZCkgYmxvY2tzLiBUaGUgb3V0cHV0IGlzIHN0cnVjdHVyYWxseSBhIHJlYWwgYC50YXIuenN0YFxuLy8gZmlsZTogYHpzdGQgLWRgIGFjY2VwdHMgaXQsIDctWmlwIGFjY2VwdHMgaXQsIGxpYnpzdGQgYWNjZXB0cyBpdC4gSXRcbi8vIGp1c3QgZG9lc24ndCBhY3R1YWxseSBjb21wcmVzcyDigJQgZm9yIG91ciBwYXlsb2FkLCB3aGljaCBpcyBtb3N0bHkgUE5HXG4vLyAoYWxyZWFkeSBjb21wcmVzc2VkKSBwbHVzIGEgZmV3IEtCIG9mIEpTT05ML01hcmtkb3duLCB0aGUgbG9zcyB2cy4gcmVhbFxuLy8gREVGTEFURSBpcyBzaW5nbGUtZGlnaXQgcGVyY2VudC5cbi8vXG4vLyBGcmFtZSBsYXlvdXQgKHBlciBSRkMgODg3OCArIFpzdGFuZGFyZCBmb3JtYXQgc3BlYyk6XG4vLyAgIG1hZ2ljX251bWJlciAgICAgICA0IGJ5dGVzICAweDI4IDB4QjUgMHgyRiAweEZEIChMRTogMHhGRDJGQjUyOClcbi8vICAgRkhEICAgICAgICAgICAgICAgIDEgYnl0ZSAgIEZDU19zaXplPTIgKDQtYnl0ZSBGQ1MpLCBTaW5nbGVfU2VnbWVudD0xXG4vLyAgIEZDUyAgICAgICAgICAgICAgICA0IGJ5dGVzICB1bmNvbXByZXNzZWQgcGF5bG9hZCBzaXplICh1MzIgTEUpXG4vLyAgIGJsb2NrcyAgICAgICAgICAgICBOIGJsb2NrcyBlYWNoOiAzLWJ5dGUgaGVhZGVyICsgcGF5bG9hZFxuLy9cbi8vIEJsb2NrIGhlYWRlciAoMyBieXRlcyBMRSk6XG4vLyAgIGJpdCAwICAgICAgIExhc3RfQmxvY2sgZmxhZ1xuLy8gICBiaXRzIDEuLjIgICBCbG9ja19UeXBlICgwMCA9IFJhdywgMDEgPSBSTEUsIDEwID0gQ29tcHJlc3NlZCwgMTEgPSBSZXNlcnZlZClcbi8vICAgYml0cyAzLi4yMyAgQmxvY2tfU2l6ZSAobWF4IDEyOCBLaUIgZm9yIHJhdyAvIFJMRSlcbi8vXG4vLyBXZSBjaHVuayBpbnRvIDEyOCBLaUIgcmF3IGJsb2NrcyB0byByZXNwZWN0IHRoZSBwZXItYmxvY2sgc2l6ZSBsaW1pdC5cblxuY29uc3QgWlNURF9SQVdfQkxPQ0tfTUFYID0gMTI4ICogMTAyNDtcblxuZXhwb3J0IGNvbnN0IHdyYXBac3RkID0gKGRhdGE6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgPCBkYXRhLmxlbmd0aCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGRhdGEubGVuZ3RoIC0gcG9zO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IE1hdGgubWluKHJlbWFpbmluZywgWlNURF9SQVdfQkxPQ0tfTUFYKTtcbiAgICBjb25zdCBpc0xhc3QgPSBwb3MgKyBibG9ja1NpemUgPj0gZGF0YS5sZW5ndGggPyAxIDogMDtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBpc0xhc3QgfCAoMCA8PCAxKSB8IChibG9ja1NpemUgPDwgMyk7IC8vIHR5cGU9cmF3PTBcbiAgICBjb25zdCBibG9ja0hlYWRlciA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIGhlYWRlckludCAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiA4KSAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiAxNikgJiAweGZmLFxuICAgIF0pO1xuICAgIGJsb2Nrcy5wdXNoKGJsb2NrSGVhZGVyKTtcbiAgICBpZiAoYmxvY2tTaXplID4gMCkgYmxvY2tzLnB1c2goZGF0YS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSkpO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSBicmVhaztcbiAgfVxuICBjb25zdCBmY3MgPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgZmhkID0gMGIxMDEwXzAwMDA7IC8vIEZDU19zaXplPTEwICg0IGJ5dGVzKSB8IFNpbmdsZV9TZWdtZW50PTFcbiAgY29uc3QgaGVhZCA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAweDI4LCAweGI1LCAweDJmLCAweGZkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgZmhkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGSERcbiAgICBmY3MgJiAweGZmLCAoZmNzID4+PiA4KSAmIDB4ZmYsIChmY3MgPj4+IDE2KSAmIDB4ZmYsIChmY3MgPj4+IDI0KSAmIDB4ZmYsXG4gIF0pO1xuICBsZXQgdG90YWwgPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZiA9IDA7XG4gIG91dC5zZXQoaGVhZCwgb2ZmKTsgb2ZmICs9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2ZmKTsgb2ZmICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb21wYW5pb24gZGVjb2RlciBmb3Igb3VyIG93biB3cml0ZXIg4oCUIHVzZWQgYnkgdGVzdHMuIEFjY2VwdHMgYW55IHpzdGRcbi8vIGZyYW1lIHdyaXR0ZW4gYnkgYHdyYXBac3RkYCAoc2luZ2xlIFJhd19CbG9jayBzdHJlYW0sIDQtYnl0ZSBGQ1MsXG4vLyBzaW5nbGUtc2VnbWVudCwgbm8gY2hlY2tzdW0sIG5vIGRpY3QpLiBUaHJvd3Mgb24gYW55dGhpbmcgZWxzZSBzbyB0ZXN0c1xuLy8gZmFpbCBsb3VkbHkgcmF0aGVyIHRoYW4gc2lsZW50bHkgbWlzLXBhcnNlLlxuZXhwb3J0IGNvbnN0IHVud3JhcFpzdGQgPSAoZnJhbWU6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgaWYgKGZyYW1lLmxlbmd0aCA8IDkpIHRocm93IG5ldyBFcnJvcignenN0ZDogZnJhbWUgdG9vIHNob3J0Jyk7XG4gIGlmIChmcmFtZVswXSAhPT0gMHgyOCB8fCBmcmFtZVsxXSAhPT0gMHhiNSB8fCBmcmFtZVsyXSAhPT0gMHgyZiB8fCBmcmFtZVszXSAhPT0gMHhmZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignenN0ZDogYmFkIG1hZ2ljIG51bWJlcicpO1xuICB9XG4gIGNvbnN0IGZoZCA9IGZyYW1lWzRdITtcbiAgY29uc3QgZmNzU2l6ZUZsYWcgPSAoZmhkID4+PiA2KSAmIDBiMTE7XG4gIGNvbnN0IHNpbmdsZVNlZ21lbnQgPSAoKGZoZCA+Pj4gNSkgJiAxKSA9PT0gMTtcbiAgY29uc3QgY2hlY2tzdW0gPSAoKGZoZCA+Pj4gMikgJiAxKSA9PT0gMTtcbiAgY29uc3QgZGljdElkID0gZmhkICYgMGIxMTtcbiAgaWYgKCFzaW5nbGVTZWdtZW50KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IG9ubHkgU2luZ2xlX1NlZ21lbnQgZnJhbWVzIHN1cHBvcnRlZCcpO1xuICBpZiAoY2hlY2tzdW0pIHRocm93IG5ldyBFcnJvcignenN0ZDogY29udGVudCBjaGVja3N1bSBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmIChkaWN0SWQpIHRocm93IG5ldyBFcnJvcignenN0ZDogZGljdGlvbmFyaWVzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgbGV0IHBvcyA9IDU7XG4gIGxldCBmY3MgPSAwO1xuICBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDApIHsgZmNzID0gZnJhbWVbcG9zXSE7IHBvcyArPSAxOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjAxKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KTsgZmNzICs9IDI1NjsgcG9zICs9IDI7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMTApIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNikgfCAoZnJhbWVbcG9zICsgM10hICogMHgxMDAwMDAwKTsgcG9zICs9IDQ7IH1cbiAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IDgtYnl0ZSBGQ1MgdW5zdXBwb3J0ZWQnKTtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoZmNzKTtcbiAgbGV0IG91dFBvcyA9IDA7XG4gIGZvciAoOzspIHtcbiAgICBpZiAocG9zICsgMyA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgaGVhZGVyJyk7XG4gICAgY29uc3QgaGVhZGVySW50ID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNik7XG4gICAgcG9zICs9IDM7XG4gICAgY29uc3QgaXNMYXN0ID0gKGhlYWRlckludCAmIDEpID09PSAxO1xuICAgIGNvbnN0IGJsb2NrVHlwZSA9IChoZWFkZXJJbnQgPj4+IDEpICYgMGIxMTtcbiAgICBjb25zdCBibG9ja1NpemUgPSAoaGVhZGVySW50ID4+PiAzKSAmIDB4MWZfZmZfZmY7XG4gICAgaWYgKGJsb2NrVHlwZSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBvbmx5IFJhd19CbG9jayAoMCkgc3VwcG9ydGVkLCBnb3QgJHtibG9ja1R5cGV9YCk7XG4gICAgaWYgKHBvcyArIGJsb2NrU2l6ZSA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgcGF5bG9hZCcpO1xuICAgIG91dC5zZXQoZnJhbWUuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpLCBvdXRQb3MpO1xuICAgIG91dFBvcyArPSBibG9ja1NpemU7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoaXNMYXN0KSBicmVhaztcbiAgfVxuICBpZiAob3V0UG9zICE9PSBmY3MpIHRocm93IG5ldyBFcnJvcihgenN0ZDogRkNTIG1pc21hdGNoIChnb3QgJHtvdXRQb3N9LCBleHBlY3RlZCAke2Zjc30pYCk7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgVGFyIGxpc3RpbmcgZGVjb2RlciAodGVzdC1vbmx5KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdhbGtzIGEgdGFyIGJ5dGUgYnVmZmVyLCByZXR1cm5pbmcge25hbWUsIGRhdGF9IGZvciBlYWNoIGVudHJ5LiBTdG9wcyBhdFxuLy8gdGhlIHRyYWlsZXIgKHR3byB6ZXJvIGJsb2NrcykuIE9ubHkgcmVhZHMgdGhlIGZpZWxkcyBQaW5jaEdyYWIgd3JpdGVzLlxuXG5leHBvcnQgdHlwZSBQYXJzZWRUYXJFbnRyeSA9IHtuYW1lOiBzdHJpbmc7IGRhdGE6IFVpbnQ4QXJyYXk7IHNpemU6IG51bWJlcn07XG5cbmNvbnN0IGRlYyA9IG5ldyBUZXh0RGVjb2RlcigpO1xuXG5jb25zdCByZWFkTnVsbFN0ciA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGxldCBlbmQgPSBvZmZzZXQgKyBsZW5ndGg7XG4gIGZvciAobGV0IGkgPSBvZmZzZXQ7IGkgPCBvZmZzZXQgKyBsZW5ndGg7IGkrKykge1xuICAgIGlmIChidWZbaV0gPT09IDApIHsgZW5kID0gaTsgYnJlYWs7IH1cbiAgfVxuICByZXR1cm4gZGVjLmRlY29kZShidWYuc3ViYXJyYXkob2Zmc2V0LCBlbmQpKTtcbn07XG5cbmNvbnN0IHJlYWRPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gIGNvbnN0IHMgPSByZWFkTnVsbFN0cihidWYsIG9mZnNldCwgbGVuZ3RoKS50cmltKCk7XG4gIHJldHVybiBzID8gcGFyc2VJbnQocywgOCkgOiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGFyID0gKGJ1ZjogVWludDhBcnJheSk6IFBhcnNlZFRhckVudHJ5W10gPT4ge1xuICBjb25zdCBlbnRyaWVzOiBQYXJzZWRUYXJFbnRyeVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zICsgNTEyIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyA1MTIpO1xuICAgIGxldCBhbGxaZXJvID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7IGlmIChoZWFkZXJbaV0gIT09IDApIHsgYWxsWmVybyA9IGZhbHNlOyBicmVhazsgfSB9XG4gICAgaWYgKGFsbFplcm8pIGJyZWFrOyAvLyB0cmFpbGVyXG4gICAgY29uc3Qgc2hvcnROYW1lID0gcmVhZE51bGxTdHIoaGVhZGVyLCAwLCAxMDApO1xuICAgIGNvbnN0IHByZWZpeCA9IHJlYWROdWxsU3RyKGhlYWRlciwgMzQ1LCAxNTUpO1xuICAgIGNvbnN0IG5hbWUgPSBwcmVmaXggPyBgJHtwcmVmaXh9LyR7c2hvcnROYW1lfWAgOiBzaG9ydE5hbWU7XG4gICAgY29uc3Qgc2l6ZSA9IHJlYWRPY3RhbChoZWFkZXIsIDEyNCwgMTIpO1xuICAgIHBvcyArPSA1MTI7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWUsIHNpemUsIGRhdGE6IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIHNpemUpfSk7XG4gICAgICBwb3MgKz0gc2l6ZTtcbiAgICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoc2l6ZSAlIDUxMikpICUgNTEyO1xuICAgICAgcG9zICs9IHBhZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVudHJpZXM7XG59O1xuIiwKICAgICIvLyBBdXRvLWdlbmVyYXRlZCBieSBzY3JpcHRzL2J1aWxkLWV4dGVuc2lvbi50cyDigJQgZG8gbm90IGVkaXQuXG4vLyBUZWxscyB0aGUgc2lkZXBhbmVsIHdoaWNoIHRlbXBsYXRlIHJlc291cmNlcyBleGlzdCBpbiB0aGlzIGJ1aWxkLlxuLy8gQWN0dWFsIGNvbnRlbnQgbGl2ZXMgYXMgLm1kIGZpbGVzIHVuZGVyIGV4dGVuc2lvbi90ZW1wbGF0ZXMvLCBsb2FkZWRcbi8vIGxhemlseSB2aWEgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMIOKAlCBzZWUgbG9hZFRlbXBsYXRlKCkgaW4gc2lkZXBhbmVsLnRzLlxuZXhwb3J0IGNvbnN0IFRFTVBMQVRFU19QUkVTRU5UID0ge1wiZGVzaWduVGVtcGxhdGVcIjp0cnVlLFwic2tpbGxUZW1wbGF0ZVwiOnRydWUsXCJsb2NhbERlc2lnblwiOnRydWUsXCJsb2NhbFNraWxsXCI6dHJ1ZX0gYXMgY29uc3Q7XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIEludmVudG9yeSBvZiB2ZW5kb3JlZCBza2lsbCByZXNvdXJjZXMgdW5kZXIgZXh0ZW5zaW9uL3NraWxscy8gKHNvdXJjZSBvZlxuLy8gdHJ1dGg6IHRoaXJkX3BhcnR5LyovVVBTVFJFQU0ubG9jayB2aWEgc2NyaXB0cy9zeW5jLWJ1bmRsZWQtc2tpbGxzLnRzKS5cbi8vIGBleHRgIGlzIHRoZSBleHRlbnNpb24tcmVsYXRpdmUgZmV0Y2ggcGF0aDsgYGFyY2hpdmVgIGlzIHdoZXJlIHRoZSBmaWxlXG4vLyBsYW5kcyBpbnNpZGUgYW4gZXhwb3J0ZWQgLnRhci56c3QgYnVuZGxlLlxuZXhwb3J0IGNvbnN0IEJVTkRMRURfU0tJTExTX1BSRVNFTlQgPSB0cnVlO1xuZXhwb3J0IHR5cGUgQnVuZGxlZFNraWxsRmlsZSA9IHtleHQ6IHN0cmluZzsgYXJjaGl2ZTogc3RyaW5nOyBieXRlczogbnVtYmVyfTtcbmV4cG9ydCBjb25zdCBCVU5ETEVEX1NLSUxMX0ZJTEVTOiBCdW5kbGVkU2tpbGxGaWxlW10gPSBbXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDMwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubmF0aXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubmF0aXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzOTEwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmRyb2lkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5kcm9pZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzIyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5pbWF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuaW1hdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNzA4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NDM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5uYXRpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5uYXRpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDgzMTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JvbGRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JvbGRlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzA5MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYnJhbmQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9icmFuZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA0NzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NsYXJpZnkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jbGFyaWZ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDY0NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29kZXgubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2RleC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzAwMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29sb3JpemUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2xvcml6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTM1NjhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyYWZ0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JhZnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDExOTQ0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcml0aXF1ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyaXRpcXVlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0MTI5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGVsaWdodC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RlbGlnaHQubWRcIixcbiAgICBcImJ5dGVzXCI6IDk4MjdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2Rpc3RpbGwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kaXN0aWxsLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NzQwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kb2N1bWVudC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RvY3VtZW50Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzk2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZXh0cmFjdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2V4dHJhY3QubWRcIixcbiAgICBcImJ5dGVzXCI6IDM0MzFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hhcmRlbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hhcmRlbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODU5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaG9va3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ob29rcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTI1NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW5pdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2luaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE4OTUyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbnRlcmFjdGlvbi1kZXNpZ24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbnRlcmFjdGlvbi1kZXNpZ24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDY1NzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2lvcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2lvcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzAzN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGF5b3V0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGF5b3V0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTc5MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDYwMTU2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vbmJvYXJkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb25ib2FyZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzc0MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3B0aW1pemUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vcHRpbWl6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzU5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3ZlcmRyaXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3ZlcmRyaXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wb2xpc2gubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wb2xpc2gubWRcIixcbiAgICBcImJ5dGVzXCI6IDEyOTU1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wcm9kdWN0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcHJvZHVjdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzc1OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcXVpZXRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3F1aWV0ZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ5MTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3NoYXBlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvc2hhcGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDExNTIzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS90eXBlc2V0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvdHlwZXNldC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTcxMzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvTElDRU5TRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvTElDRU5TRVwiLFxuICAgIFwiYnl0ZXNcIjogMTA3NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvTk9USUNFLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9OT1RJQ0UubWRcIixcbiAgICBcImJ5dGVzXCI6IDUwM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vbWFya2V0cGxhY2UuanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL21hcmtldHBsYWNlLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDExOTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL3BsdWdpbi5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vcGx1Z2luLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDc1NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9GVU5ESU5HLnltbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvRlVORElORy55bWxcIixcbiAgICBcImJ5dGVzXCI6IDQ3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2Rlc2lnbi1zeXN0ZW0tcHJvZmlsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZGVzaWduLXN5c3RlbS1wcm9maWxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyODFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZnJhbWV3b3JrLWNvcnJlY3Rpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2ZyYW1ld29yay1jb3JyZWN0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzODlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbGVhcm5pbmctc3VibWlzc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbGVhcm5pbmctc3VibWlzc2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzY0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL25ldy1oZXVyaXN0aWMtcnVsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbmV3LWhldXJpc3RpYy1ydWxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvUFVMTF9SRVFVRVNUX1RFTVBMQVRFLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9QVUxMX1JFUVVFU1RfVEVNUExBVEUubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ0MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGlnbm9yZVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRpZ25vcmVcIixcbiAgICBcImJ5dGVzXCI6IDY2NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMzE1MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0lUQVRJT04uY2ZmXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ0lUQVRJT04uY2ZmXCIsXG4gICAgXCJieXRlc1wiOiAxMjExXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT0RFX09GX0NPTkRVQ1QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT0RFX09GX0NPTkRVQ1QubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUSU5HLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUSU5HLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NTYxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRPUlMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRPUlMubWRcIixcbiAgICBcImJ5dGVzXCI6IDMzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTElDRU5TRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0xJQ0VOU0VcIixcbiAgICBcImJ5dGVzXCI6IDExNTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL05PVElDRVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL05PVElDRVwiLFxuICAgIFwiYnl0ZXNcIjogNDU4MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vUkVBRE1FLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vUkVBRE1FLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMTcwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYWxsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYWxsLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMTgyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbmFseXplLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYW5hbHl6ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA3NzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2V2YWx1YXRlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvZXZhbHVhdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI4MzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL3NvbHZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvc29sdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDE2MTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2FudGktcGF0dGVybnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9hbnRpLXBhdHRlcm5zLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNjc4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9jb25zdGl0dXRpb25hbC1jb25zdHJhaW50cy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2NvbnN0aXR1dGlvbmFsLWNvbnN0cmFpbnRzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NTkyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9vdXRwdXQtc2NoZW1hLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvb3V0cHV0LXNjaGVtYS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA1MThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BmZC1sYXllci1ydWJyaWMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wZmQtbGF5ZXItcnVicmljLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTI5NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcHN5Y2hvbG9neS9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wc3ljaG9sb2d5L212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjM0MjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3RpZXIyLXByb21wdC10ZW1wbGF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3RpZXIyLXByb21wdC10ZW1wbGF0ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTU4ODhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy9zaG9waWZ5LXRoZW1lcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy9zaG9waWZ5LXRoZW1lcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjcwMzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy90YWlsd2luZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy90YWlsd2luZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjc0OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy93b3JkcHJlc3MtdGhlbWVzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3dvcmRwcmVzcy10aGVtZXMubWRcIixcbiAgICBcImJ5dGVzXCI6IDIyMjQ2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvZm91bmRhdGlvbi1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2ZvdW5kYXRpb24tcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMzM4ODFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMS1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wxLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDM2MTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDItcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMi1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAzOTI1MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wzLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDMtcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMjE2NzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sNC1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2w0LXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDI0ODA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWNyb3NzLWxheWVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1jcm9zcy1sYXllci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjg1NTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZXhjZWxsZW50Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1leGNlbGxlbnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE3MDI4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWdvb2QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWdvb2QubWRcIixcbiAgICBcImJ5dGVzXCI6IDIxMzMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLW1lZGlvY3JlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1tZWRpb2NyZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjQzNzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtcG9vci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtcG9vci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjYxMzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdGVycmlibGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXRlcnJpYmxlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMDE5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS11bmNvbnZlbnRpb25hbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdW5jb252ZW50aW9uYWwubWRcIixcbiAgICBcImJ5dGVzXCI6IDIzNjMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvQURIRC1DVVJCLUNVVC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9BREhELUNVUkItQ1VULm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MzA1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvUEVSQ0VQVElPTi1GSVJTVC1ERVNJR04ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvUEVSQ0VQVElPTi1GSVJTVC1ERVNJR04ubWRcIixcbiAgICBcImJ5dGVzXCI6IDk4NzcwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9sbG1zLnR4dFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2xsbXMudHh0XCIsXG4gICAgXCJieXRlc1wiOiA2NTQ0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9zY3JpcHRzL2dlbi1wZmQtaW5kZXgucHlcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9zY3JpcHRzL2dlbi1wZmQtaW5kZXgucHlcIixcbiAgICBcImJ5dGVzXCI6IDQ1NDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTI1OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2FjY3VtdWxhdGVkLWxlYXJuaW5ncy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9hY2N1bXVsYXRlZC1sZWFybmluZ3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDcyMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2NpdGF0aW9uLXN0YW5kYXJkcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9jaXRhdGlvbi1zdGFuZGFyZHMubWRcIixcbiAgICBcImJ5dGVzXCI6IDEzNDMxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvaW5zaWdodHMtbG9nLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2luc2lnaHRzLWxvZy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzQyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wwL2wwMTgtYmFja2VuZC1tZWNoYW5pY3MtYXMtZnJvbnRlbmQtY29tcGxleGl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDAvbDAxOC1iYWNrZW5kLW1lY2hhbmljcy1hcy1mcm9udGVuZC1jb21wbGV4aXR5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNjE1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wxL2wwMTEtdmlzdWFsLWNoYW5uZWwtYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wxL2wwMTEtdmlzdWFsLWNoYW5uZWwtYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDMxNDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxMy1rZXlib2FyZC1kZW5zaXR5LWlzLWwyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDEzLWtleWJvYXJkLWRlbnNpdHktaXMtbDIubWRcIixcbiAgICBcImJ5dGVzXCI6IDE0NTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxNi1uZWFyLW1pc3MtY29sb3ItYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDE2LW5lYXItbWlzcy1jb2xvci1hc3ltbWV0cnkubWRcIixcbiAgICBcImJ5dGVzXCI6IDYxMzZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAyNC1hYS1jb25zdHJhaW5lZC10b2tlbi1sYWRkZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMjQtYWEtY29uc3RyYWluZWQtdG9rZW4tbGFkZGVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MDMwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wzL2wwMjMtZmFsc2lmaWFiaWxpdHktdHJpYWQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wzL2wwMjMtZmFsc2lmaWFiaWxpdHktdHJpYWQubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ2OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwMy1wcmUtc2VuZC12cy1wb3N0LXJlc3BvbnNlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDAzLXByZS1zZW5kLXZzLXBvc3QtcmVzcG9uc2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDgwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA2LWluZnJhc3RydWN0dXJlLXZzLWFjdGl2YXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDYtaW5mcmFzdHJ1Y3R1cmUtdnMtYWN0aXZhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTM3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDgtZXBpc3RlbWljLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwOC1lcGlzdGVtaWMtYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA4OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAyMi1sNC1zeW1tZXRyeS10aHJlc2hvbGQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMjItbDQtc3ltbWV0cnktdGhyZXNob2xkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NTIwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19pbmRleC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX2luZGV4Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNzM0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19zZWFyY2guanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX3NlYXJjaC5qc29uXCIsXG4gICAgXCJieXRlc1wiOiAxNDEwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDA5LXRlbXBvcmFsLXNlc3Npb24tY29udGludWl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAwOS10ZW1wb3JhbC1zZXNzaW9uLWNvbnRpbnVpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDk2OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDEyLXJvdXRlLXZzLXN1cnZleS1rbm93bGVkZ2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTItcm91dGUtdnMtc3VydmV5LWtub3dsZWRnZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTM5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTUtZXhwZXJpZW50aWFsLXNlbGYtY29udHJhZGljdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxNS1leHBlcmllbnRpYWwtc2VsZi1jb250cmFkaWN0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNjU4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTktbXVsdGktYXJ0aWZhY3QtZW5nYWdlbWVudC1maWVsZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxOS1tdWx0aS1hcnRpZmFjdC1lbmdhZ2VtZW50LWZpZWxkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NDkzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjEtbDQtZXRoaWNzLWZ1c2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyMS1sNC1ldGhpY3MtZnVzaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0MTE5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjUtY2FzY2FkZS1jcmVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjUtY2FzY2FkZS1jcmVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDU0MTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNi1hZXN0aGV0aWMtc3RhYmlsaXR5LWFzLXRydXN0LXByb2R1Y2VyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI2LWFlc3RoZXRpYy1zdGFiaWxpdHktYXMtdHJ1c3QtcHJvZHVjZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDU4MDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyOC1oZWxkLWRlY2lzaW9uLWNvbXBvdW5kaW5nLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI4LWhlbGQtZGVjaXNpb24tY29tcG91bmRpbmcubWRcIixcbiAgICBcImJ5dGVzXCI6IDUyNzVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAxLWdlbmVyYXRpdmUtdnMtZXZhbHVhdGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAxLWdlbmVyYXRpdmUtdnMtZXZhbHVhdGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjczXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMi1hY2Nlc3MtdnMtc2lnbmFsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDItYWNjZXNzLXZzLXNpZ25hbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzU5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNC13b3Jrc3BhY2UtdnMtcHJvZHVjdC1zZXBhcmF0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDQtd29ya3NwYWNlLXZzLXByb2R1Y3Qtc2VwYXJhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNS1yZWN1cnNpdmUtdmFsaWRhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA1LXJlY3Vyc2l2ZS12YWxpZGF0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA3LWNvbnZlcmdlbnQtZ2FwLWlkZW50aWZpY2F0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDctY29udmVyZ2VudC1nYXAtaWRlbnRpZmljYXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDkxOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTAtY29uc3RyYWludHMtYXJlLWRpc3RyaWJ1dGlvbnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxMC1jb25zdHJhaW50cy1hcmUtZGlzdHJpYnV0aW9ucy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjkwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTQtb3BlcmF0aW9uYWwtdnMtc3RydWN0dXJhbC1ldGhpY3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNC1vcGVyYXRpb25hbC12cy1zdHJ1Y3R1cmFsLWV0aGljcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTUyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTctaXRlcmF0aXZlLXJlZ3Jlc3Npb24taXMtdmlzaWJpbGl0eS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE3LWl0ZXJhdGl2ZS1yZWdyZXNzaW9uLWlzLXZpc2liaWxpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ3MzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDIwLWludGVybmF0aW9uYWwtY2l0YXRpb24tZXhwYW5zaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjAtaW50ZXJuYXRpb25hbC1jaXRhdGlvbi1leHBhbnNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDU2NjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI3LWludGVybmFsLWFja25vd2xlZGdtZW50LXNpZ25hbHMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyNy1pbnRlcm5hbC1hY2tub3dsZWRnbWVudC1zaWduYWxzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NzEyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyOS1wb3J0LWRvbnQtaW5zdGFsbC1tb3Rpb24tYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyOS1wb3J0LWRvbnQtaW5zdGFsbC1tb3Rpb24tYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDYwMjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTc4NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3BmZC1zcGF0aWFsLWV4dGVuc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wZmQtc3BhdGlhbC1leHRlbnNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5NTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wcmFjdGl0aW9uZXItY29ycmVjdGlvbnMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcHJhY3RpdGlvbmVyLWNvcnJlY3Rpb25zLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3NraWxscy1pbmRleC5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwic2tpbGxzLWluZGV4Lmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDEwMTEzXG4gIH1cbl07XG4iLAogICAgIi8vIFNlbmQtdG8tQWdlbnQgcHJvbXB0ICsgcHJvdG9jb2wgYnVpbGRlcnMuXG4vL1xuLy8gVHdvIGFydGlmYWN0cywgb25lIGRvY3RyaW5lOlxuLy8gICDigKIgYnVpbGRBZ2VudFByb21wdEpzb25sIOKAlCB0aGUgSlNPTkwgY2xpcGJvYXJkIHBheWxvYWQgY29waWVkIHdoZW4gdGhlXG4vLyAgICAgdXNlciBjbGlja3MgXCJTZW5kIHRvIEFnZW50XCIuIE5pbmUgZGVuc2UgbGluZXM6IGhlYWRlciwgaW5zdHJ1Y3Rpb24sXG4vLyAgICAgaWRlbXBvdGVudCBiYXNoIGJvb3RzdHJhcCwgbWFuZGF0b3J5IGZ1bGwtcmVhZCBmaWxlIGxpc3QsIGJ1bmRsZVxuLy8gICAgIHRyZWUsIG9yY2hlc3RyYXRpb24gcGhhc2VzLCBjb25kaXRpb25hbCBzdG9jay1ERVNJR04gd2FybmluZyxcbi8vICAgICByZWNhcHR1cmUgdmVyaWZpY2F0aW9uLCBkb25lLWNyaXRlcmlhLlxuLy8gICDigKIgYnVpbGRBZ2VudFByb3RvY29sTWQg4oCUIEFHRU5ULVBST1RPQ09MLm1kIGluc2lkZSBldmVyeSBidW5kbGU6IHRoZVxuLy8gICAgIGZ1bGwgZXhwYW5zaW9uIG9mIHRoZSBzYW1lIGRvY3RyaW5lLCBzbyBhIGxvc3QgY2xpcGJvYXJkIGRlZ3JhZGVzIHRvXG4vLyAgICAgXCJleHRyYWN0IHRoZSBhcmNoaXZlIGFuZCByZWFkIEFHRU5ULVBST1RPQ09MLm1kXCIuXG4vL1xuLy8gSHlkcmF0aW9uIGNvbnZlbnRpb25zIChtaXJyb3JlZCBpbiB0aGUgZG9jcyk6XG4vLyAgIOKAoiB2YWx1ZXMgYmFrZWQgaW4gYXQgZXhwb3J0IHRpbWUgY29tZSBmcm9tIHRoZSBvcHRpb25zIG9iamVjdFxuLy8gICAgICh3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlIHBhdGgsIGV4cG9ydCB0aW1lc3RhbXAsIHRhciBlbnRyaWVzKTtcbi8vICAg4oCiIDxBTkdMRV9UT0tFTlM+IGFyZSBsZWZ0IHZlcmJhdGltIGZvciB0aGUgUkVDRUlWSU5HIGFnZW50IHRvIGluZmVyXG4vLyAgICAgKDxQUk9KRUNUX1JPT1Q+LCA8QVBQX1VSTD4sIDxGRUVEQkFDS19VSUQ+LCA8cnVuSWQ+LCA8QVJDSElWRV9QQVRIPikuXG4vL1xuLy8gRGV0ZXJtaW5pc20gY29udHJhY3Q6IGlkZW50aWNhbCBpbnB1dHMg4oaSIGlkZW50aWNhbCBvdXRwdXQgc3RyaW5ncy4gTm9cbi8vIERhdGUubm93KCkvTWF0aC5yYW5kb20oKSBpbiBoZXJlIOKAlCB0aGUgZXhwb3J0IGNsb2NrIGFycml2ZXMgdmlhIG9wdHMuXG4vLyBub2RlLXRlc3RhYmxlIChubyBicm93c2VyIEFQSXMpOyBjb25zdW1lZCBieSBzaWRlcGFuZWwudHMgYXQgZXhwb3J0IHRpbWUuXG5cbi8qKiBQZXJzaXN0ZW5jZSByb290IGZvciBhIHdvcmtzcGFjZSwgYXMgdGhlIHJlY2VpdmluZyBhZ2VudCBzZWVzIGl0LiAqL1xuZXhwb3J0IGNvbnN0IHdvcmtzcGFjZVJvb3QgPSAod29ya3NwYWNlKSA9PiBgfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvJHt3b3Jrc3BhY2V9YDtcblxuLyoqIEV4dHJhY3Rpb24gZGlyIGZvciBhIGJ1bmRsZSBpbnNpZGUgdGhlIHBlcnNpc3RlbmNlIHJvb3QuICovXG5leHBvcnQgY29uc3QgZXh0cmFjdERpciA9ICh3b3Jrc3BhY2UsIGJ1bmRsZUlkKSA9PlxuICBgJHt3b3Jrc3BhY2VSb290KHdvcmtzcGFjZSl9L2J1bmRsZXMvJHtidW5kbGVJZH0vZXh0cmFjdGVkYDtcblxuLy8gU2luZ2xlLXF1b3RlLXNhZmUgaW50ZXJwb2xhdGlvbiBmb3IgYmFzaDogJ2l0J1xcJydzJyBzdXJ2aXZlcyBhbnkgaW5wdXQuXG5jb25zdCBzcSA9ICh2KSA9PiBTdHJpbmcodikucmVwbGFjZSgvJy9nLCBcIidcXFxcJydcIik7XG5cbi8qKlxuICogSWRlbXBvdGVudCBiYXNoIGJvb3RzdHJhcC4gYGFyY2hpdmVQYXRoYCBpcyB0aGUgaHlkcmF0ZWQgYWJzb2x1dGUgcGF0aCBvZlxuICogdGhlIC50YXIuenN0IG9uIHRoZSBvcGVyYXRvcidzIG1hY2hpbmU7IHBhc3MgdGhlIGxpdGVyYWwgdG9rZW5cbiAqICc8QVJDSElWRV9QQVRIPicgdG8gZW1pdCB0aGUgdG9rZW5pemVkIGNvcHkgc2hpcHBlZCBpbiBBR0VOVC1QUk9UT0NPTC5tZC5cbiAqXG4gKiBUaGUgc2NyaXB0IHNlbGYtbm9ybWFsaXplcyB0aGUgYXJjaGl2ZSBwYXRoIHNvIFwiZXhlY3V0ZSBleGFjdGx5IGFzXG4gKiB3cml0dGVuXCIgc3RheXMgdHJ1ZSBldmVyeXdoZXJlIHRoZSBvcGVyYXRvcidzIGJyb3dzZXIgYW5kIGFnZW50IGNhblxuICogZGlzYWdyZWUgYWJvdXQgcGF0aCBzaGFwZTogYSBsZWFkaW5nIH4gaXMgZXhwYW5kZWQsIGFuZCBhIFdpbmRvd3NcbiAqIGRyaXZlIHBhdGggKENocm9tZSBvbiBXaW5kb3dzICsgYWdlbnQgaW4gV1NML0dpdC1CYXNoKSBpcyBjb252ZXJ0ZWRcbiAqIHZpYSB3c2xwYXRoLCBjeWdwYXRoLCBvciBhIG1hbnVhbCAvbW50Lzxkcml2ZT4gZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEJvb3RzdHJhcFNjcmlwdCA9ICh7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGgsIGV4cG9ydFRzfSkgPT4gW1xuICAnIyEvdXNyL2Jpbi9lbnYgYmFzaCcsXG4gICcjIFBpbmNoR3JhYiBib290c3RyYXAg4oCUIGlkZW1wb3RlbnQ7IHNhZmUgdG8gcmUtcnVuLicsXG4gICdzZXQgLWV1byBwaXBlZmFpbCcsXG4gIGBXUz0nJHtzcSh3b3Jrc3BhY2UpfSdgLFxuICBgQklEPScke3NxKGJ1bmRsZUlkKX0nYCxcbiAgYFNSQz0nJHtzcShhcmNoaXZlUGF0aCl9J2AsXG4gICcjIE5vcm1hbGl6ZSB0aGUgYXJjaGl2ZSBwYXRoOiBleHBhbmQgYSBsZWFkaW5nIH4gKGNsaXBib2FyZCBtYXkgY2FycnkgdGhlJyxcbiAgJyMgfi9Eb3dubG9hZHMgZm9ybSkgYW5kIHRyYW5zbGF0ZSBXaW5kb3dzIGRyaXZlIHBhdGhzIGZvciBXU0wvR2l0LUJhc2guJyxcbiAgJ1NSQz1cIiR7U1JDLyNcXFxcfi8kSE9NRX1cIicsXG4gICdjYXNlIFwiJFNSQ1wiIGluJyxcbiAgJyAgW0EtWmEtel06W1xcXFxcXFxcL10qKScsXG4gICcgICAgaWYgY29tbWFuZCAtdiB3c2xwYXRoID4vZGV2L251bGwgMj4mMTsgdGhlbiBTUkM9XCIkKHdzbHBhdGggLXUgXCIkU1JDXCIpXCI7JyxcbiAgJyAgICBlbGlmIGNvbW1hbmQgLXYgY3lncGF0aCA+L2Rldi9udWxsIDI+JjE7IHRoZW4gU1JDPVwiJChjeWdwYXRoIC11IFwiJFNSQ1wiKVwiOycsXG4gICcgICAgZWxzZScsXG4gICcgICAgICBkcml2ZT1cIiQocHJpbnRmICVzIFwiJHtTUkMlJToqfVwiIHwgdHIgXCJbOnVwcGVyOl1cIiBcIls6bG93ZXI6XVwiKVwiJyxcbiAgJyAgICAgIHJlc3Q9XCIke1NSQyMqOn1cIjsgcmVzdD1cIiR7cmVzdC8vXFxcXFxcXFwvL31cIicsXG4gICcgICAgICBTUkM9XCIvbW50LyRkcml2ZSRyZXN0XCInLFxuICAnICAgIGZpOzsnLFxuICAnZXNhYycsXG4gICdST09UPVwiJEhPTUUvLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyRXU1wiJyxcbiAgJ0RFU1Q9XCIkUk9PVC9idW5kbGVzLyRCSURcIicsXG4gICdpZiBbIC1mIFwiJERFU1QvLmV4dHJhY3RlZFwiIF0gJiYgWyBcIiQoY2F0IFwiJERFU1QvLmV4dHJhY3RlZFwiKVwiID0gXCIkQklEXCIgXTsgdGhlbicsXG4gICcgIGVjaG8gXCJhbHJlYWR5LWV4dHJhY3RlZCAkREVTVC9leHRyYWN0ZWRcIicsXG4gICdlbHNlJyxcbiAgJyAgbWtkaXIgLXAgXCIkREVTVC9leHRyYWN0ZWRcIiBcIiRST09UL3BsYW5zLyRCSURcIiBcIiRST09UL2F1ZGl0cy8kQklEXCIgXCIkUk9PVC9yZWNhcHR1cmVzXCInLFxuICAnICBpZiB0YXIgLS16c3RkIC14ZiBcIiRTUkNcIiAtQyBcIiRERVNUL2V4dHJhY3RlZFwiIDI+L2Rldi9udWxsOyB0aGVuIDo7IGVsc2UnLFxuICAnICAgIHpzdGQgLWRjIFwiJFNSQ1wiIHwgdGFyIC14IC1DIFwiJERFU1QvZXh0cmFjdGVkXCInLFxuICAnICBmaScsXG4gICcgIGNwIC1mIFwiJFNSQ1wiIFwiJERFU1QvYnVuZGxlLnRhci56c3RcIicsXG4gICcgIHByaW50ZiBcXCclc1xcJyBcIiRCSURcIiA+IFwiJERFU1QvLmV4dHJhY3RlZFwiJyxcbiAgJyAgZWNobyBcImV4dHJhY3RlZCAkREVTVC9leHRyYWN0ZWRcIicsXG4gICdmaScsXG4gIGBbIC1mIFwiJFJPT1Qvd29yay1tYW5pZmVzdC5qc29ubFwiIF0gfHwgcHJpbnRmICclc1xcXFxuJyAne1widlwiOjEsXCJ0eXBlXCI6XCJ3b3JrLW1hbmlmZXN0LWhlYWRlclwiLFwidG9vbFwiOlwicGluY2hncmFiXCIsXCJ3b3Jrc3BhY2VcIjpcIiR7d29ya3NwYWNlfVwiLFwiY3JlYXRlZFwiOlwiJHtleHBvcnRUc31cIn0nID4gXCIkUk9PVC93b3JrLW1hbmlmZXN0Lmpzb25sXCJgLFxuICAnZWNobyBcIndvcmtkaXIgJFJPT1RcIicsXG5dLmpvaW4oJ1xcbicpO1xuXG4vKipcbiAqIFJlbmRlciB0aGUgYnVuZGxlJ3MgdGFyIGVudHJ5IG5hbWVzIGFzIGFuIGluZGVudGVkIHRyZWUuIENvbGxhcHNlIHJ1bGVzXG4gKiBrZWVwIHRoZSBjbGlwYm9hcmQgZGVuc2UgV0lUSE9VVCBoaWRpbmcgc3RydWN0dXJlIHRoZSBwcm90b2NvbCBjaXRlc1xuICogKGEgbmFpdmUgc2l6ZS1iYXNlZCBjb2xsYXBzZSBmb2xkZWQgdGhlIHdob2xlIGAuYWdlbnRzL2Agc2tpbGwgdHJlZSBpbnRvXG4gKiBvbmUgb3BhcXVlIGxpbmUpOlxuICogICDigKIgYSBkaXJlY3RvcnkgY29sbGFwc2VzIHRvIGBkaXIvIChOIGZpbGVzKWAgb25seSB3aGVuIGl0IGlzIEZMQVRcbiAqICAgICAobm8gc3ViZGlyZWN0b3JpZXMpIGFuZCBob2xkcyBtb3JlIHRoYW4gYGNvbGxhcHNlQXRgIGZpbGVzIOKAlFxuICogICAgIHNjcmVlbnNob3RzLywgaW1wZWNjYWJsZSdzIHJlZmVyZW5jZS8g4oCUIG9yIHdoZW4gaXQgc2l0cyBhdFxuICogICAgIGBjb2xsYXBzZURlcHRoYCBvciBkZWVwZXIsIHdoZXJlIGRldGFpbCBzdG9wcyBwYXlpbmcgZm9yIGl0c2VsZjtcbiAqICAg4oCiIHN0cnVjdHVyZWQgZGlyZWN0b3JpZXMgYXJlIGRlc2NlbmRlZCBzbyB0aGVpciBza2lsbC9sb2NhdG9yIGxheW91dFxuICogICAgIHN0YXlzIHZpc2libGUuXG4gKiBPdXRwdXQgaXMgY2FwcGVkIGF0IGBtYXhMaW5lc2Agd2l0aCBhIGDigKYgK04gbW9yZWAgdGFpbCBhcyBhIGJhY2tzdG9wLlxuICogRGV0ZXJtaW5pc3RpYzogZW50cmllcyBhcmUgc29ydGVkLlxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyQnVuZGxlVHJlZSA9IChlbnRyeU5hbWVzLCB7Y29sbGFwc2VBdCA9IDgsIGNvbGxhcHNlRGVwdGggPSAzLCBtYXhMaW5lcyA9IDEyMH0gPSB7fSkgPT4ge1xuICAvLyBCdWlsZCBhIG5lc3RlZCB7ZGlyczogTWFwLCBmaWxlczogW119IHN0cnVjdHVyZS5cbiAgY29uc3Qgcm9vdE5vZGUgPSB7ZGlyczogbmV3IE1hcCgpLCBmaWxlczogW119O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgWy4uLmVudHJ5TmFtZXNdLnNvcnQoKSkge1xuICAgIGNvbnN0IHBhcnRzID0gbmFtZS5zcGxpdCgnLycpO1xuICAgIGxldCBub2RlID0gcm9vdE5vZGU7XG4gICAgZm9yIChjb25zdCBkaXIgb2YgcGFydHMuc2xpY2UoMCwgLTEpKSB7XG4gICAgICBpZiAoIW5vZGUuZGlycy5oYXMoZGlyKSkgbm9kZS5kaXJzLnNldChkaXIsIHtkaXJzOiBuZXcgTWFwKCksIGZpbGVzOiBbXX0pO1xuICAgICAgbm9kZSA9IG5vZGUuZGlycy5nZXQoZGlyKTtcbiAgICB9XG4gICAgbm9kZS5maWxlcy5wdXNoKHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBjb25zdCBjb3VudEZpbGVzID0gKG5vZGUpID0+IG5vZGUuZmlsZXMubGVuZ3RoICsgWy4uLm5vZGUuZGlycy52YWx1ZXMoKV0ucmVkdWNlKChhLCBkKSA9PiBhICsgY291bnRGaWxlcyhkKSwgMCk7XG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGNvbnN0IGVtaXQgPSAobm9kZSwgZGVwdGgpID0+IHtcbiAgICBjb25zdCBwYWQgPSAnICAnLnJlcGVhdChkZXB0aCk7XG4gICAgZm9yIChjb25zdCBbZGlyLCBjaGlsZF0gb2YgWy4uLm5vZGUuZGlycy5lbnRyaWVzKCldLnNvcnQoKFthXSwgW2JdKSA9PiAoYSA8IGIgPyAtMSA6IDEpKSkge1xuICAgICAgY29uc3QgdG90YWwgPSBjb3VudEZpbGVzKGNoaWxkKTtcbiAgICAgIGNvbnN0IGZsYXQgPSBjaGlsZC5kaXJzLnNpemUgPT09IDA7XG4gICAgICAvLyBgY2hpbGRgIHJlbmRlcnMgYXQgdGhpcyBgZGVwdGhgIChlbWl0J3MgZGVwdGggaXMgdGhlIHBhZCBsZXZlbCBvZlxuICAgICAgLy8gbm9kZSdzIG93biBjaGlsZHJlbikuXG4gICAgICBpZiAoKGZsYXQgJiYgdG90YWwgPiBjb2xsYXBzZUF0KSB8fCBkZXB0aCA+PSBjb2xsYXBzZURlcHRoKSB7XG4gICAgICAgIGxpbmVzLnB1c2goYCR7cGFkfSR7ZGlyfS8gKCR7dG90YWx9IGZpbGVzKWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZXMucHVzaChgJHtwYWR9JHtkaXJ9L2ApO1xuICAgICAgICBlbWl0KGNoaWxkLCBkZXB0aCArIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGYgb2Ygbm9kZS5maWxlcykgbGluZXMucHVzaChgJHtwYWR9JHtmfWApO1xuICB9O1xuICBlbWl0KHJvb3ROb2RlLCAwKTtcbiAgaWYgKGxpbmVzLmxlbmd0aCA+IG1heExpbmVzKSB7XG4gICAgY29uc3QgZHJvcHBlZCA9IGxpbmVzLmxlbmd0aCAtIG1heExpbmVzO1xuICAgIHJldHVybiBbLi4ubGluZXMuc2xpY2UoMCwgbWF4TGluZXMpLCBg4oCmICske2Ryb3BwZWR9IG1vcmVgXS5qb2luKCdcXG4nKTtcbiAgfVxuICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG59O1xuXG4vLyBCdW5kbGUgZmlsZXMgd2hvc2UgcHJlc2VuY2UgZ2F0ZXMgYSBtYW5kYXRvcnktcmVhZCBwYXRoIC8gcHJvbXB0IGxpbmUuXG5jb25zdCBQSU5DSEdSQUJfU0tJTExfUEFUSCA9ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnO1xuY29uc3QgUEZEX1NLSUxMX1BBVEggPSAncGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZCc7XG5jb25zdCBTS0lMTFNfSU5ERVhfUEFUSCA9ICdza2lsbHMtaW5kZXguanNvbic7XG5cbmNvbnN0IG9yY2hlc3RyYXRpb25UZXh0ID0gKHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBqc29ubE5hbWV9KSA9PlxuICBgUEhBU0UgbWFwOiBmb3IgRVZFUlkgY29tbWVudCByb3cgaW4gJHtqc29ubE5hbWV9LCBkZWNpZGUgd2hpY2ggYnVuZGxlZCBza2lsbHMgYXBwbHkgYW5kIGFwcGVuZCBvbmUgY29tbWVudCByb3cgdG8gfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvJHt3b3Jrc3BhY2V9L3dvcmstbWFuaWZlc3QuanNvbmwgY2FycnlpbmcgYSBtYXBwZWRfc2tpbGxzIGZpZWxkIHdob3NlIGVudHJpZXMgYXJlIGxvY2F0b3JzIOKAlCBwYXRocyByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGlvbiByb290IChlLmcuIC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLzxmaWxlPi5tZCwgJHtQRkRfU0tJTExfUEFUSH0sICR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9OyB0aGUgZnVsbCBpbmRleCBpcyAke1NLSUxMU19JTkRFWF9QQVRIfSkuIFRoZSBleHBvcnQgcHJlLXNlZWRzIGhldXJpc3RpYyBzdWdnZXN0ZWRTa2lsbHMgb24gZWFjaCBmZWVkYmFjayByb3c7IHZlcmlmeSBhbmQgY29ycmVjdCB0aGVtLCBkbyBub3QgdHJ1c3QgdGhlbSBibGluZGx5LiBgICtcbiAgYFBIQVNFIHBsYW46IGZhbiBvdXQgb25lIGJhY2tncm91bmQgYXRvbWljIHN1YmFnZW50IHBlciBjb21tZW50OyBwYXNzIGVhY2ggc3ViYWdlbnQgYSBzdGFuZGFsb25lIEpTT05MIHN1Ymluc3RydWN0aW9uICh0ZW1wbGF0ZSBpbiBBR0VOVC1QUk9UT0NPTC5tZCkgY29udGFpbmluZyB0aGUgZnVsbCBjb21tZW50IHJvdywgaXRzIHBhcmVudCBzZWxlY3RvciByb3csIHRoZSBidW5kbGUgbWFuaWZlc3QgbGluZSwgYW5kIHRoZSBGVUxMIFRFWFQgb2YgZXZlcnkgbWFwcGVkIHNraWxsIHByb21wdDsgZWFjaCBzdWJhZ2VudCB1c2VzIHlvdXIgL3BsYW4gKHBsYW5uaW5nKSBjYXBhYmlsaXR5IGZvciBpdHMgcGhhc2UgYW5kIHJldHVybnMgYSBwbGFuLCBzYXZlZCB0byBwbGFucy8ke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kOyBlYWNoIHN1YmFnZW50IGFsc28gcG9saXNoZXMgaXRzIHBsYW4gd2l0aCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsLiBgICtcbiAgYFBIQVNFIGltcGxlbWVudDogWU9VIOKAlCB0aGUgZm9yZWdyb3VuZCBhZ2VudCB0aGUgb3BlcmF0b3IgcGFzdGVkIHRoaXMgcHJvbXB0IGludG8g4oCUIGRvIGFsbCBpbXBsZW1lbnRhdGlvbiwgdGVzdCBkZXZlbG9wbWVudCwgdGVzdGluZywgYW5kIGl0ZXJhdGlvbiBpbiA8UFJPSkVDVF9ST09UPjsgc3ViYWdlbnRzIG9ubHkgcGxhbi4gUG9saXNoIHRoZSBpbXBsZW1lbnRlZCByZXN1bHQgd2l0aCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsLiBgICtcbiAgYFBIQVNFIGF1ZGl0OiBzZW5kIHRoZSBjb21iaW5lZCBwbGFucyArIGltcGxlbWVudGF0aW9uIGZvciBhIGJsaW5kIGF0b21pYyAncm9hc3QnIHBlZXIgcmV2aWV3IG9mIEJPVEggcGxhbiBhbmQgaW1wbGVtZW50YXRpb24sIHVzaW5nIHdoYXRldmVyIG90aGVyLWFnZW50IHBlZXItcmV2aWV3IHNraWxscyBleGlzdCBpbiBZT1VSIE9XTiBlbnZpcm9ubWVudDsgd3JpdGUgaXQgdG8gYXVkaXRzLyR7YnVuZGxlSWR9LzxydW5JZD4tcm9hc3QubWQgYW5kIGFkZHJlc3MgZXZlcnkgYmxvY2tlci4gYCArXG4gIGBQSEFTRSB2ZXJpZnk6IHNlZSB0aGUgJ3ZlcmlmeScgbGluZS4gYCArXG4gIGBERUdSQURBVElPTiBSVUxFOiBpZiB5b3UgY2Fubm90IHNwYXduIHN1YmFnZW50cywgb3IgbGFjayBhIC9wbGFuLCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24sIG9yIHJvYXN0IGNhcGFiaWxpdHksIHBlcmZvcm0gdGhlIHNhbWUgcGhhc2VzIHlvdXJzZWxmIFNFUklBTExZIGluIHRoaXMgZXhhY3Qgb3JkZXIg4oCUIG5ldmVyIHNraXAgYSBwaGFzZS4gYCArXG4gIGBTS0lMTFMgUlVMRTogdGhlIGJ1bmRsZWQgc2tpbGxzIGFyZSBmb3IgdGhpcyBqb2Igb25seSDigJQgcmVhZCB0aGVtIGZyb20gdGhlIGV4dHJhY3Rpb24gZGlyZWN0b3J5OyB0aGVyZSBpcyBOTyBuZWVkIHRvIGluc3RhbGwgdGhlbSBwZXJtYW5lbnRseSwgYW5kIHlvdSBtdXN0IE5PVCBvdmVyd3JpdGUgeW91ciBvd24gcGVyc2lzdGVudCBza2lsbHMsIGFnZW50IGNvbmZpZywgb3IgZG90ZmlsZXMuYDtcblxuY29uc3QgdmVyaWZ5VGV4dCA9ICh7d29ya3NwYWNlLCB4RGlyLCBqc29ubE5hbWV9KSA9PlxuICBgRmluYWwgdmVyaWZpY2F0aW9uIHBhc3MsIG9ubHkgYWZ0ZXIgaW1wbGVtZW50YXRpb24gYW5kIGF1ZGl0OiBzdGFydCB0aGUgcHJvZHVjdCBsb2NhbGx5LCB0aGVuIHJ1bjogbnB4IC15IHBpbmNoZ3JhYiByZWNhcHR1cmUgJHt4RGlyfS8ke2pzb25sTmFtZX0gPEFQUF9VUkw+IC0td29ya3NwYWNlLWRpciB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8ke3dvcmtzcGFjZX0gKHVzZSBidW54IGlmIG5weCBpcyB1bmF2YWlsYWJsZSkuIFRoaXMgcmUtbG9jYXRlcyBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3Igd2l0aCBQaW5jaEdyYWIncyBvd24gQ1NTLT5YUGF0aC0+YTExeSBjaGFpbiwgc2NyZWVuc2hvdHMgZWFjaCBlbGVtZW50LCBhbmQgd3JpdGVzIGFuIGFwcGVuZC1vbmx5IHJ1biB1bmRlciByZWNhcHR1cmVzLzxydW5JZD4vLiBSZWFkIGVhY2ggcmVjYXB0dXJlZCBQTkcgbmV4dCB0byBpdHMgb3JpZ2luYWwgaW4gJHt4RGlyfS9zY3JlZW5zaG90cy8gYW5kIGNvbmZpcm0gZXZlcnkgY29tbWVudCBpcyB2aXNpYmx5IHJlc29sdmVkOyB0aGVuIHVwZGF0ZSB0aGUgbWF0Y2hpbmcgd29yay1tYW5pZmVzdC5qc29ubCByb3dzIHRvIHN0YXR1cyBkb25lLCBvciBibG9ja2VkIHdpdGggYSByZWFzb24uYDtcblxuY29uc3QgZG9uZVRleHQgPSAoe2J1bmRsZUlkfSkgPT5cbiAgYFlvdSBhcmUgZmluaXNoZWQgd2hlbiBldmVyeSBjb21tZW50IGhhcyBhIHdvcmstbWFuaWZlc3QuanNvbmwgcm93IHdpdGggc3RhdHVzIGRvbmUgb3IgYmxvY2tlZCwgcGxhbnMvJHtidW5kbGVJZH0vIGhvbGRzIG9uZSBwbGFuIHBlciBjb21tZW50LCBhdWRpdHMvJHtidW5kbGVJZH0vIGhvbGRzIGF0IGxlYXN0IG9uZSByb2FzdCwgYW5kIHRoZSBsYXRlc3QgcmVjYXB0dXJlIHJ1biBsb2NhdGVzIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3Rvci4gd29yay1tYW5pZmVzdC5qc29ubCBpcyBhcHBlbmQtb25seTogYWRkIHJvd3MsIG5ldmVyIHJld3JpdGUgaGlzdG9yeS5gO1xuXG5jb25zdCB3YXJuaW5nVGV4dCA9XG4gICdUaGUgYnVuZGxlZCBERVNJR04ubWQgaXMgUGluY2hHcmFiXFwncyBiYXJlIHN0b2NrIHRlbXBsYXRlIOKAlCB0aGUgb3BlcmF0b3IgZGlkIG5vdCBjdXN0b21pemUgaXQuIERvIE5PVCB0cmVhdCBpdCBhcyBwcm9kdWN0IGNhbm9uLiBQcmVmZXIgYSBtb3JlIGFwcGxpY2FibGUgY2Fub25pY2FsIGRlc2lnbiBzb3VyY2UgaWYgb25lIGV4aXN0cyBmb3IgdGhpcyBwcm9kdWN0IChzZWFyY2ggPFBST0pFQ1RfUk9PVD4gZm9yIERFU0lHTi5tZCwgZG9jcy9kZXNpZ24qLCBicmFuZC8gb3Igc3R5bGUtZ3VpZGUgZmlsZXMpIGFuZCB1c2UgdGhlIGJ1bmRsZWQgdGVtcGxhdGUgb25seSBhcyBhIGdlbmVyaWMgY2hlY2tsaXN0Lic7XG5cbi8qKlxuICogVGhlIG5pbmUtbGluZSBTZW5kLXRvLUFnZW50IGNsaXBib2FyZCBwYXlsb2FkLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy53b3Jrc3BhY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmJ1bmRsZUlkICAgICAgIDE2LWhleCBjb250ZW50IGhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmFyY2hpdmVQYXRoICAgIGFic29sdXRlIHBhdGggb2YgdGhlIHNhdmVkIC50YXIuenN0XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5leHBvcnRUcyAgICAgICBJU08gdGltZXN0YW1wICh0aGUgZXhwb3J0IGNsb2NrKVxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuanNvbmxOYW1lICAgICAgdGhlIGJ1bmRsZSdzIEpTT05MIGVudHJ5IG5hbWVcbiAqIEBwYXJhbSB7e2NvbW1lbnRzOiBudW1iZXIsIHNlbGVjdG9yczogbnVtYmVyLCBwYWdlczogbnVtYmVyLCBzY3JlZW5zaG90czogbnVtYmVyfX0gb3B0cy5jb3VudHNcbiAqIEBwYXJhbSB7c3RyaW5nW119IG9wdHMuZW50cnlOYW1lcyAgIGV2ZXJ5IHRhciBlbnRyeSBuYW1lIGluIHRoZSBidW5kbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0cy5kZXNpZ25Jc1RlbXBsYXRlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBuZXdsaW5lLWpvaW5lZCBKU09OTCAobm8gdHJhaWxpbmcgbmV3bGluZSlcbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkQWdlbnRQcm9tcHRKc29ubCA9IChvcHRzKSA9PiB7XG4gIGNvbnN0IHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aCwgZXhwb3J0VHMsIGpzb25sTmFtZSwgY291bnRzLCBlbnRyeU5hbWVzLCBkZXNpZ25Jc1RlbXBsYXRlfSA9IG9wdHM7XG4gIGNvbnN0IHhEaXIgPSBleHRyYWN0RGlyKHdvcmtzcGFjZSwgYnVuZGxlSWQpO1xuICBjb25zdCBoYXMgPSAobmFtZSkgPT4gZW50cnlOYW1lcy5pbmNsdWRlcyhuYW1lKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB2OiAxLCB0eXBlOiAncGluY2hncmFiLXNlbmQtdG8tYWdlbnQnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICB3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlOiBhcmNoaXZlUGF0aCwgZ2VuZXJhdGVkOiBleHBvcnRUcyxcbiAgICBjb3VudHM6IHtjb21tZW50czogY291bnRzLmNvbW1lbnRzLCBzZWxlY3RvcnM6IGNvdW50cy5zZWxlY3RvcnMsIHBhZ2VzOiBjb3VudHMucGFnZXMsIHNjcmVlbnNob3RzOiBjb3VudHMuc2NyZWVuc2hvdHN9LFxuICAgIGRlc2lnbklzU3RvY2tUZW1wbGF0ZTogZGVzaWduSXNUZW1wbGF0ZSxcbiAgfSk7XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ2luc3RydWN0aW9uJyxcbiAgICB0ZXh0OiBgWW91IGhhdmUgYmVlbiBoYW5kZWQgYSBQaW5jaEdyYWIgZmVlZGJhY2sgYnVuZGxlOiAke2NvdW50cy5jb21tZW50c30gb3BlcmF0b3IgY29tbWVudHMgcGlubmVkIHRvIGxpdmUgVUkgZWxlbWVudHMgb2YgdGhlIHByb2R1Y3QgYnVpbHQgZnJvbSA8UFJPSkVDVF9ST09UPiAoaW5mZXIgPFBST0pFQ1RfUk9PVD4gZnJvbSB5b3VyIGN1cnJlbnQgd29ya2luZyBkaXJlY3Rvcnk7IGlmIGFtYmlndW91cywgYXNrIGJlZm9yZSBlZGl0aW5nKS4gRG8gdGhpcyBub3csIGluIG9yZGVyOiAoMSkgZXhlY3V0ZSB0aGUgYmFzaCBzY3JpcHQgaW4gdGhlIG5leHQgJ2Jvb3RzdHJhcCcgbGluZSBleGFjdGx5IGFzIHdyaXR0ZW4gKGl0cyAnc2NyaXB0JyBmaWVsZCBpcyBhIEpTT04tZXNjYXBlZCBwbGFpbiBiYXNoIHNjcmlwdDsgaXQgc2VsZi1ub3JtYWxpemVzIH4gYW5kIFdpbmRvd3MgZHJpdmUgcGF0aHMgZm9yIFdTTC9HaXQtQmFzaCk7ICgyKSByZWFkIEVWRVJZIGZpbGUgbGlzdGVkIGluIHRoZSAnZmlsZXMnIGxpbmUgZnVsbHkgaW50byBjb250ZXh0OyAoMykgZm9sbG93IEFHRU5ULVBST1RPQ09MLm1kIHRvIG1hcCwgcGxhbiwgaW1wbGVtZW50LCB0ZXN0LCBhdWRpdCwgYW5kIHZlcmlmeSBhIGZpeCBmb3IgZXZlcnkgY29tbWVudC5gLFxuICB9KTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnYm9vdHN0cmFwJywgbGFuZzogJ2Jhc2gnLCBpZGVtcG90ZW50OiB0cnVlLFxuICAgIHNjcmlwdDogYnVpbGRCb290c3RyYXBTY3JpcHQoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmVQYXRoLCBleHBvcnRUc30pLFxuICB9KTtcblxuICBjb25zdCBwYXRocyA9IFtcbiAgICBgQCR7eERpcn0vQUdFTlQtUFJPVE9DT0wubWRgLFxuICAgIGBAJHt4RGlyfS9SRUFETUUubWRgLFxuICAgIGBAJHt4RGlyfS9yZXBhaXItaW5kZXgubWRgLFxuICAgIGBAJHt4RGlyfS8ke2pzb25sTmFtZX1gLFxuICBdO1xuICBpZiAoaGFzKCdERVNJR04ubWQnKSkgcGF0aHMucHVzaChgQCR7eERpcn0vREVTSUdOLm1kYCk7XG4gIGlmIChoYXMoUElOQ0hHUkFCX1NLSUxMX1BBVEgpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS8ke1BJTkNIR1JBQl9TS0lMTF9QQVRIfWApO1xuICBpZiAoaGFzKFBGRF9TS0lMTF9QQVRIKSkgcGF0aHMucHVzaChgQCR7eERpcn0vJHtQRkRfU0tJTExfUEFUSH1gKTtcbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ2ZpbGVzJywgcmVhZEZ1bGx5OiB0cnVlLCBub0dyZXA6IHRydWUsXG4gICAgcnVsZTogJ1JlYWQgZWFjaCBwYXRoIGJlbG93IEVORC1UTy1FTkQgd2l0aCB5b3VyIGZpbGUtcmVhZGluZyB0b29sLiBUaGlzIGlzIE5PTi1PUFRJT05BTC4gRG8gTk9UIGdyZXAgdGhlbSwgZG8gTk9UIGhlYWQvdGFpbCB0aGVtLCBkbyBOT1Qgc2FtcGxlIGxpbmUgcmFuZ2VzIOKAlCBmdWxsIGNvbnRlbnRzIGludG8gY29udGV4dC4gU2NyZWVuc2hvdHMgYW5kIHRoZSBpbXBlY2NhYmxlIHJlZmVyZW5jZSBmaWxlcyBhcmUgcmVhZCBwZXItY29tbWVudCBsYXRlciwgYXMgQUdFTlQtUFJPVE9DT0wubWQgZGlyZWN0cy4nLFxuICAgIHBhdGhzLFxuICB9KTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAndHJlZScsIHJvb3Q6IHhEaXIsIGVudHJpZXM6IGVudHJ5TmFtZXMubGVuZ3RoLFxuICAgIHRleHQ6IHJlbmRlckJ1bmRsZVRyZWUoZW50cnlOYW1lcyksXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdvcmNoZXN0cmF0aW9uJyxcbiAgICBwaGFzZXM6IFsnbWFwJywgJ3BsYW4nLCAnaW1wbGVtZW50JywgJ2F1ZGl0JywgJ3ZlcmlmeSddLFxuICAgIHRleHQ6IG9yY2hlc3RyYXRpb25UZXh0KHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBqc29ubE5hbWV9KSxcbiAgfSk7XG5cbiAgaWYgKGRlc2lnbklzVGVtcGxhdGUpIHtcbiAgICBsaW5lcy5wdXNoKHt0eXBlOiAnd2FybmluZycsIGNvZGU6ICdERVNJR05fTURfSVNfU1RPQ0tfVEVNUExBVEUnLCB0ZXh0OiB3YXJuaW5nVGV4dH0pO1xuICB9XG5cbiAgbGluZXMucHVzaCh7dHlwZTogJ3ZlcmlmeScsIHRleHQ6IHZlcmlmeVRleHQoe3dvcmtzcGFjZSwgeERpciwganNvbmxOYW1lfSl9KTtcbiAgbGluZXMucHVzaCh7dHlwZTogJ2RvbmUnLCB0ZXh0OiBkb25lVGV4dCh7YnVuZGxlSWR9KX0pO1xuXG4gIHJldHVybiBsaW5lcy5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKS5qb2luKCdcXG4nKTtcbn07XG5cbi8qKlxuICogQUdFTlQtUFJPVE9DT0wubWQg4oCUIHRoZSBpbi1idW5kbGUgZXhwYW5zaW9uIG9mIHRoZSBjbGlwYm9hcmQgZG9jdHJpbmUuXG4gKiBza2lsbHNJbmRleCBpcyB0aGUgcGFyc2VkIHNraWxscy1pbmRleC5qc29uIChvciBudWxsIHdoZW4gc2tpbGxzIHdlcmVuJ3RcbiAqIGJ1bmRsZWQpOyB1c2VkIHRvIGh5ZHJhdGUgdGhlIHNraWxsIGludmVudG9yeSB0YWJsZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkQWdlbnRQcm90b2NvbE1kID0gKG9wdHMpID0+IHtcbiAgY29uc3Qge3dvcmtzcGFjZSwgYnVuZGxlSWQsIGV4cG9ydFRzLCBqc29ubE5hbWUsIGNvdW50cywgZW50cnlOYW1lcywgZGVzaWduSXNUZW1wbGF0ZSwgc2tpbGxzSW5kZXh9ID0gb3B0cztcbiAgY29uc3QgeERpciA9IGV4dHJhY3REaXIod29ya3NwYWNlLCBidW5kbGVJZCk7XG4gIGNvbnN0IHJvb3QgPSB3b3Jrc3BhY2VSb290KHdvcmtzcGFjZSk7XG4gIGNvbnN0IGhhcyA9IChuYW1lKSA9PiBlbnRyeU5hbWVzLmluY2x1ZGVzKG5hbWUpO1xuICBjb25zdCBvdXQgPSBbXTtcblxuICBvdXQucHVzaCgnIyBBR0VOVC1QUk9UT0NPTC5tZCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGBXb3Jrc3BhY2U6IFxcYCR7d29ya3NwYWNlfVxcYCDCtyBCdW5kbGU6IFxcYCR7YnVuZGxlSWR9XFxgIMK3IEdlbmVyYXRlZDogJHtleHBvcnRUc31gKTtcbiAgb3V0LnB1c2goYENvdW50czogKioke2NvdW50cy5jb21tZW50c30qKiBjb21tZW50cyDCtyAqKiR7Y291bnRzLnNlbGVjdG9yc30qKiBzZWxlY3RvcnMgwrcgKioke2NvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7Y291bnRzLnNjcmVlbnNob3RzfSoqIHNjcmVlbnNob3RzYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoaXMgZmlsZSBpcyB0aGUgZnVsbCB3b3JraW5nIGRvY3RyaW5lIGZvciB0aGUgY29kaW5nIGFnZW50IGhhbmRlZCB0aGlzJyk7XG4gIG91dC5wdXNoKCdidW5kbGUuIFRoZSBvcGVyYXRvclxcJ3MgY2xpcGJvYXJkIHByb21wdCAoSlNPTkwpIGlzIGEgY29tcGFjdCBib290c3RyYXAgb2YnKTtcbiAgb3V0LnB1c2goJ3RoZSBzYW1lIGNvbnRlbnQg4oCUIGlmIHlvdSBvbmx5IGhhdmUgdGhpcyBhcmNoaXZlLCBldmVyeXRoaW5nIHlvdSBuZWVkIGlzJyk7XG4gIG91dC5wdXNoKCdoZXJlLiBUb2tlbnMgaW4gYDxBTkdMRV9CUkFDS0VUUz5gIGFyZSB5b3VycyB0byBpbmZlcjogYDxQUk9KRUNUX1JPT1Q+YCBpcycpO1xuICBvdXQucHVzaCgndGhlIHByb2R1Y3RcXCdzIHJlcG9zaXRvcnkgKHVzdWFsbHkgeW91ciB3b3JraW5nIGRpcmVjdG9yeSksIGA8QVBQX1VSTD5gIGlzJyk7XG4gIG91dC5wdXNoKCd0aGUgbG9jYWxseSBydW5uaW5nIHByb2R1Y3QsIGA8RkVFREJBQ0tfVUlEPmAvYDxydW5JZD5gIGFyZSBwZXItaXRlbSBpZHMuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDAgwrcgQm9vdHN0cmFwIChpZGVtcG90ZW50KScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdJZiBgJyArIHhEaXIgKyAnYCBkb2VzIG5vdCBleGlzdCB5ZXQsIHJ1biB0aGUgc2NyaXB0IGJlbG93IHdpdGgnKTtcbiAgb3V0LnB1c2goJ2A8QVJDSElWRV9QQVRIPmAgcmVwbGFjZWQgYnkgdGhlIGFic29sdXRlIHBhdGggb2YgdGhpcyBidW5kbGVcXCdzIGAudGFyLnpzdGAnKTtcbiAgb3V0LnB1c2goJyh3aGVuIHlvdSBhcmUgcmVhZGluZyB0aGlzIGZyb20gdGhlIGV4dHJhY3RlZCBhcmNoaXZlLCB0aGF0IHN0ZXAgYWxyZWFkeScpO1xuICBvdXQucHVzaCgnaGFwcGVuZWQg4oCUIHJlLXJ1bm5pbmcgaXMgYSBzYWZlIG5vLW9wKS4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBgYmFzaCcpO1xuICBvdXQucHVzaChidWlsZEJvb3RzdHJhcFNjcmlwdCh7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGg6ICc8QVJDSElWRV9QQVRIPicsIGV4cG9ydFRzfSkpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDEgwrcgUGVyc2lzdGVudCB3b3Jrc3BhY2UgbGF5b3V0Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ0FsbCBQaW5jaEdyYWIgd29yayBzdGF0ZSBsaXZlcyB1bmRlciB0aGUgcGVyc2lzdGVuY2Ugcm9vdCDigJQga2VlcCB5b3VyJyk7XG4gIG91dC5wdXNoKCdwbGFubmluZyBhcnRpZmFjdHMgdGhlcmUgYW5kIGtlZXAgdGhlIHdvcmsgbWFuaWZlc3QgdXBkYXRlZDonKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKGAke3Jvb3R9L2ApO1xuICBvdXQucHVzaCgnICB3b3JrLW1hbmlmZXN0Lmpzb25sICAgICAgICAgICAgICAjIGFwcGVuZC1vbmx5IGFnZW50IHN0YXRlIGxlZGdlcicpO1xuICBvdXQucHVzaCgnICBidW5kbGVzLycpO1xuICBvdXQucHVzaChgICAgICR7YnVuZGxlSWR9L2ApO1xuICBvdXQucHVzaCgnICAgICAgYnVuZGxlLnRhci56c3QgICAgICAgICAgICAgICAjIGNvcHkgb2YgdGhlIG9yaWdpbmFsIGFyY2hpdmUnKTtcbiAgb3V0LnB1c2goJyAgICAgIC5leHRyYWN0ZWQgICAgICAgICAgICAgICAgICAgIyBndWFyZCBtYXJrZXIgKGNvbnRhaW5zIHRoZSBidW5kbGVJZCknKTtcbiAgb3V0LnB1c2goJyAgICAgIGV4dHJhY3RlZC8gICAgICAgICAgICAgICAgICAgIyB0YXIgb3V0cHV0IOKAlCB0cmVhdCBhcyBJTU1VVEFCTEUgaW5wdXQnKTtcbiAgb3V0LnB1c2goJyAgcGxhbnMvJyk7XG4gIG91dC5wdXNoKGAgICAgJHtidW5kbGVJZH0vPEZFRURCQUNLX1VJRD4ucGxhbi5tZGApO1xuICBvdXQucHVzaCgnICBhdWRpdHMvJyk7XG4gIG91dC5wdXNoKGAgICAgJHtidW5kbGVJZH0vPHJ1bklkPi1yb2FzdC5tZGApO1xuICBvdXQucHVzaCgnICByZWNhcHR1cmVzLycpO1xuICBvdXQucHVzaCgnICAgIDxydW5JZD4vICAgICAgICAgICAgICAgICAgICAgICAjIGFwcGVuZC1vbmx5OyBuZXZlciByZXVzZSBhIHJ1bklkJyk7XG4gIG91dC5wdXNoKCcgICAgICByZWNhcHR1cmUtbWFuaWZlc3QuanNvbmwnKTtcbiAgb3V0LnB1c2goJyAgICAgIHNjcmVlbnNob3RzLzx1aWQ+LnBuZycpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2B3b3JrLW1hbmlmZXN0Lmpzb25sYCByb3dzIChhcHBlbmQtb25seTsgcmVkdWNlcnMgZ3JvdXAgYnknKTtcbiAgb3V0LnB1c2goJ2AoYnVuZGxlSWQsIGZlZWRiYWNrVWlkKWAgYW5kIHRoZSBMQVNUIHJvdyB3aW5zIOKAlCBhY2NyZXRlLCBuZXZlciByZXdyaXRlKTonKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBganNvbmMnKTtcbiAgb3V0LnB1c2goJy8vIHdyaXR0ZW4gb25jZSBieSB0aGUgYm9vdHN0cmFwJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcIndvcmstbWFuaWZlc3QtaGVhZGVyXCIsXCJ0b29sXCI6XCJwaW5jaGdyYWJcIixcIndvcmtzcGFjZVwiOlwiJHt3b3Jrc3BhY2V9XCIsXCJjcmVhdGVkXCI6XCIke2V4cG9ydFRzfVwifWApO1xuICBvdXQucHVzaCgnLy8gb25lIHBlciBjb21tZW50LCBhcHBlbmRlZCBlYWNoIHRpbWUgaXRzIHN0YXRlIGFkdmFuY2VzJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcImNvbW1lbnRcIixcImJ1bmRsZUlkXCI6XCIke2J1bmRsZUlkfVwiLFwiZmVlZGJhY2tVaWRcIjpcIjxGRUVEQkFDS19VSUQ+XCIsXCJwYXJlbnRVaWRcIjpcIjxzZWxlY3RvciB1aWQ+XCIsXCJzZWxlY3RvclwiOlwiPGNzcz5cIixcIm1hcHBlZF9za2lsbHNcIjpbe1wic2tpbGxcIjpcIjxpZCBmcm9tIHNraWxscy1pbmRleC5qc29uPlwiLFwibG9jYXRvclwiOlwiPHBhdGggcmVsYXRpdmUgdG8gZXh0cmFjdGlvbiByb290PlwifV0sXCJzdGF0dXNcIjpcIm1hcHBlZHxwbGFubmVkfGluLXByb2dyZXNzfGRvbmV8YmxvY2tlZFwiLFwicGxhblwiOlwicGxhbnMvJHtidW5kbGVJZH0vPEZFRURCQUNLX1VJRD4ucGxhbi5tZFwiLFwibm90ZXNcIjpcIjxzaG9ydD5cIixcInRzXCI6XCI8SVNPPlwifWApO1xuICBvdXQucHVzaCgnLy8gYXBwZW5kZWQgYnkgYHBpbmNoZ3JhYiByZWNhcHR1cmVgIHJ1bnMnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwicmVjYXB0dXJlLXJ1blwiLFwicnVuSWRcIjpcIjxydW5JZD5cIixcInRzXCI6XCI8SVNPPlwiLFwiYnVuZGxlSWRcIjpcIiR7YnVuZGxlSWR9XCIsXCJsb2NhdGVkXCI6MCxcInRvdGFsXCI6MH1gKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyAyIMK3IFJlYWQgb3JkZXIgKG5vbi1vcHRpb25hbCwgZnVsbCByZWFkcywgbm8gZ3JlcCknKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnUmVhZCBlYWNoIG9mIHRoZXNlIEVORC1UTy1FTkQgYmVmb3JlIGFueSBvdGhlciBhY3Rpb24uIERvIG5vdCBncmVwLCBoZWFkLCcpO1xuICBvdXQucHVzaCgndGFpbCwgb3Igc2FtcGxlIGxpbmUgcmFuZ2VzIOKAlCBmdWxsIGNvbnRlbnRzIGludG8gY29udGV4dDonKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaChgMS4gXFxgJHt4RGlyfS9BR0VOVC1QUk9UT0NPTC5tZFxcYCAodGhpcyBmaWxlKWApO1xuICBvdXQucHVzaChgMi4gXFxgJHt4RGlyfS9SRUFETUUubWRcXGBgKTtcbiAgb3V0LnB1c2goYDMuIFxcYCR7eERpcn0vcmVwYWlyLWluZGV4Lm1kXFxgYCk7XG4gIG91dC5wdXNoKGA0LiBcXGAke3hEaXJ9LyR7anNvbmxOYW1lfVxcYGApO1xuICBpZiAoaGFzKCdERVNJR04ubWQnKSkgb3V0LnB1c2goYDUuIFxcYCR7eERpcn0vREVTSUdOLm1kXFxgYCk7XG4gIGlmIChoYXMoUElOQ0hHUkFCX1NLSUxMX1BBVEgpKSBvdXQucHVzaChgNi4gXFxgJHt4RGlyfS8ke1BJTkNIR1JBQl9TS0lMTF9QQVRIfVxcYGApO1xuICBpZiAoaGFzKFBGRF9TS0lMTF9QQVRIKSkgb3V0LnB1c2goYDcuIFxcYCR7eERpcn0vJHtQRkRfU0tJTExfUEFUSH1cXGBgKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnU2NyZWVuc2hvdHMgKGBzY3JlZW5zaG90cy9gLCBpbmRleGVkIGJ5IGBzY3JlZW5zaG90cy5qc29uYCkgYW5kIHRoZScpO1xuICBvdXQucHVzaCgnaW1wZWNjYWJsZSByZWZlcmVuY2UgZmlsZXMgYXJlIHJlYWQgcGVyLWNvbW1lbnQgZHVyaW5nIHRoZSBwaGFzZXMgYmVsb3cuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgaWYgKGRlc2lnbklzVGVtcGxhdGUpIHtcbiAgICBvdXQucHVzaCgnPiAqKldBUk5JTkcg4oCUIERFU0lHTl9NRF9JU19TVE9DS19URU1QTEFURS4qKiAnICsgd2FybmluZ1RleHQpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgfVxuICBvdXQucHVzaCgnIyMgMyDCtyBCdW5kbGVkIHNraWxscycpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdUaGUgYnVuZGxlZCBza2lsbHMgYXJlIGZvciB0aGlzIGpvYiBvbmx5OiByZWFkIHRoZW0gZnJvbSB0aGUgZXh0cmFjdGlvbicpO1xuICBvdXQucHVzaCgnZGlyZWN0b3J5LiBUaGVyZSBpcyBOTyBuZWVkIHRvIGluc3RhbGwgdGhlbSBwZXJtYW5lbnRseSwgYW5kIHlvdSBtdXN0Jyk7XG4gIG91dC5wdXNoKCdOT1Qgb3ZlcndyaXRlIHlvdXIgb3duIHBlcnNpc3RlbnQgc2tpbGxzLCBhZ2VudCBjb25maWcsIG9yIGRvdGZpbGVzLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIGlmIChza2lsbHNJbmRleCAmJiBBcnJheS5pc0FycmF5KHNraWxsc0luZGV4LnNraWxscykgJiYgc2tpbGxzSW5kZXguc2tpbGxzLmxlbmd0aCkge1xuICAgIC8vIFRhYmxlLWNlbGwgc2FuaXRpemVyIGZvciBzZW1pLXRydXN0ZWQgaW5kZXggc3RyaW5ncyAocHVycG9zZXMgY29tZVxuICAgIC8vIGZyb20gdmVuZG9yZWQgdXBzdHJlYW0gZnJvbnRtYXR0ZXIpOiBlc2NhcGUgdGhlIGVzY2FwZSBjaGFyYWN0ZXJcbiAgICAvLyBGSVJTVCwgdGhlbiB0aGUgY2VsbCBkZWxpbWl0ZXIsIGFuZCBmbGF0dGVuIG5ld2xpbmVzIOKAlCBvdGhlcndpc2UgYVxuICAgIC8vIGNyYWZ0ZWQgcHVycG9zZSBjb3VsZCBicmVhayBvdXQgb2YgaXRzIGNlbGwgYW5kIGluamVjdCByb3dzIGludG8gYVxuICAgIC8vIGRvY3VtZW50IGFnZW50cyB0cmVhdCBhcyBkb2N0cmluZSAoQ29kZVFMIGpzL2luY29tcGxldGUtc2FuaXRpemF0aW9uKS5cbiAgICBjb25zdCBjZWxsID0gKHYpID0+IFN0cmluZyh2ID8/ICcnKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpLnJlcGxhY2UoL1xcfC9nLCAnXFxcXHwnKS5yZXBsYWNlKC9cXHI/XFxuL2csICcgJyk7XG4gICAgb3V0LnB1c2goJ3wgaWQgfCBsb2NhdG9yIChyZWxhdGl2ZSB0byBleHRyYWN0aW9uIHJvb3QpIHwgcHVycG9zZSB8Jyk7XG4gICAgb3V0LnB1c2goJ3wgLS0tIHwgLS0tIHwgLS0tIHwnKTtcbiAgICBmb3IgKGNvbnN0IHMgb2Ygc2tpbGxzSW5kZXguc2tpbGxzKSB7XG4gICAgICBjb25zdCBpbnZva2UgPSBzLmludm9rZSA/IGAgSW52b2tlOiBcXGAke2NlbGwocy5pbnZva2UpfVxcYC5gIDogJyc7XG4gICAgICBvdXQucHVzaChgfCBcXGAke2NlbGwocy5pZCl9XFxgIHwgXFxgJHtjZWxsKHMucGF0aCl9XFxgIHwgJHtjZWxsKHMucHVycG9zZSl9JHtpbnZva2V9IHxgKTtcbiAgICB9XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdQcm92ZW5hbmNlICh1cHN0cmVhbSByZXBvICsgcGlubmVkIGNvbW1pdCArIGxpY2Vuc2UpIGZvciBldmVyeSB2ZW5kb3JlZCcpO1xuICAgIG91dC5wdXNoKGBza2lsbCBpcyByZWNvcmRlZCBpbiBcXGAke1NLSUxMU19JTkRFWF9QQVRIfVxcYCBhdCB0aGUgYXJjaGl2ZSByb290LmApO1xuICB9IGVsc2Uge1xuICAgIG91dC5wdXNoKCdfVGhpcyBidW5kbGUgd2FzIGV4cG9ydGVkIHdpdGhvdXQgdGhlIHZlbmRvcmVkIHNraWxsIHNldCAodGhlIG9wZXJhdG9yJyk7XG4gICAgb3V0LnB1c2goJ2Rpc2FibGVkIFwiQnVuZGxlIGRlc2lnbiBza2lsbHNcIikuIE1hcCBjb21tZW50cyBhZ2FpbnN0IHdoYXRldmVyIGRlc2lnbicpO1xuICAgIG91dC5wdXNoKCdza2lsbHMgZXhpc3QgaW4gWU9VUiBPV04gZW52aXJvbm1lbnQgaW5zdGVhZCwgYW5kIG5vdGUgdGhhdCBpbiB0aGUnKTtcbiAgICBvdXQucHVzaCgnd29yayBtYW5pZmVzdC5fJyk7XG4gIH1cbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgNCDCtyBQaGFzZXMnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnUnVuIHRoZSBmaXZlIHBoYXNlcyBpbiBvcmRlci4gKipEZWdyYWRhdGlvbiBydWxlOioqIGlmIHlvdSBjYW5ub3Qgc3Bhd24nKTtcbiAgb3V0LnB1c2goJ3N1YmFnZW50cywgb3IgbGFjayBhIGAvcGxhbmAsIGAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ25gLCBvciByb2FzdCcpO1xuICBvdXQucHVzaCgnY2FwYWJpbGl0eSwgcGVyZm9ybSB0aGUgc2FtZSBwaGFzZXMgeW91cnNlbGYgU0VSSUFMTFkgaW4gdGhpcyBleGFjdCBvcmRlcicpO1xuICBvdXQucHVzaCgn4oCUIG5ldmVyIHNraXAgYSBwaGFzZS4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIG1hcCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGBGb3IgRVZFUlkgY29tbWVudCByb3cgaW4gXFxgJHtqc29ubE5hbWV9XFxgLCBkZWNpZGUgd2hpY2ggYnVuZGxlZCBza2lsbHMgYXBwbHlgKTtcbiAgb3V0LnB1c2goJ2FuZCBhcHBlbmQgb25lIGBjb21tZW50YCByb3cgdG8gYHdvcmstbWFuaWZlc3QuanNvbmxgIGNhcnJ5aW5nIGEnKTtcbiAgb3V0LnB1c2goJ2BtYXBwZWRfc2tpbGxzYCBmaWVsZCB3aG9zZSBlbnRyaWVzIGFyZSBsb2NhdG9ycyAoc2VlIMKnMykuIFRoZSBleHBvcnQnKTtcbiAgb3V0LnB1c2goJ3ByZS1zZWVkcyBoZXVyaXN0aWMgYHN1Z2dlc3RlZFNraWxsc2Agb24gZWFjaCBmZWVkYmFjayByb3c7IHZlcmlmeSBhbmQnKTtcbiAgb3V0LnB1c2goJ2NvcnJlY3QgdGhlbSwgZG8gbm90IHRydXN0IHRoZW0gYmxpbmRseS4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIHBsYW4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnRmFuIG91dCBPTkUgYmFja2dyb3VuZCBhdG9taWMgc3ViYWdlbnQgcGVyIGNvbW1lbnQuIFBhc3MgZWFjaCBzdWJhZ2VudCBhJyk7XG4gIG91dC5wdXNoKCdzdGFuZGFsb25lIEpTT05MIHN1Ymluc3RydWN0aW9uIGNvbnRhaW5pbmcgdGhlIGZ1bGwgY29tbWVudCByb3csIGl0cycpO1xuICBvdXQucHVzaCgncGFyZW50IHNlbGVjdG9yIHJvdywgdGhlIGJ1bmRsZSBtYW5pZmVzdCBsaW5lLCBhbmQgdGhlIEZVTEwgVEVYVCBvZiBldmVyeScpO1xuICBvdXQucHVzaCgnbWFwcGVkIHNraWxsIHByb21wdC4gRWFjaCBzdWJhZ2VudCB1c2VzIHlvdXIgYC9wbGFuYCAocGxhbm5pbmcpIGNhcGFiaWxpdHknKTtcbiAgb3V0LnB1c2goYGZvciBpdHMgcGhhc2UsIHBvbGlzaGVzIGl0cyBwbGFuIHdpdGggXFxgL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbFxcYCwgYW5kYCk7XG4gIG91dC5wdXNoKGByZXR1cm5zIGEgcGxhbiB5b3Ugc2F2ZSB0byBcXGBwbGFucy8ke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kXFxgLmApO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdTdWJhZ2VudCBzdWJpbnN0cnVjdGlvbiB0ZW1wbGF0ZSAob25lIEpTT05MIGRvY3VtZW50IHBlciBzdWJhZ2VudDsgaHlkcmF0ZScpO1xuICBvdXQucHVzaCgnZXZlcnkgYDwuLi4+YCBiZWZvcmUgZGlzcGF0Y2gpOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBqc29uYycpO1xuICBvdXQucHVzaChge1widlwiOjEsXCJ0eXBlXCI6XCJwaW5jaGdyYWItc3ViYWdlbnQtcGxhblwiLFwiYnVuZGxlSWRcIjpcIiR7YnVuZGxlSWR9XCIsXCJmZWVkYmFja1VpZFwiOlwiPEZFRURCQUNLX1VJRD5cIn1gKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcImluc3RydWN0aW9uXCIsXCJ0ZXh0XCI6XCJZb3UgYXJlIGEgcGxhbm5pbmcgc3ViYWdlbnQgZm9yIE9ORSB1c2VyIGNvbXBsYWludCBhYm91dCBhIGxpdmUgVUkgZWxlbWVudC4gVXNlIHlvdXIgL3BsYW4gY2FwYWJpbGl0eS4gUHJvZHVjZSBhbiBpbXBsZW1lbnRhdGlvbiBwbGFuIE9OTFkg4oCUIGRvIG5vdCBlZGl0IGZpbGVzLiBEZWxpdmVyOiByb290LWNhdXNlIGh5cG90aGVzaXMsIGV4YWN0IGZpbGVzL3NlbGVjdG9ycyB0byBjaGFuZ2UgaW4gPFBST0pFQ1RfUk9PVD4sIHN0ZXAtYnktc3RlcCBlZGl0cywgdGVzdCBwbGFuLCBhbmQgaG93IHRoZSBmaXggd2lsbCBiZSB2aXN1YWxseSB2ZXJpZmllZCBhZ2FpbnN0IHRoZSBvcmlnaW5hbCBzY3JlZW5zaG90LiBQb2xpc2ggdGhlIHBsYW4gd2l0aCAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsIGJlZm9yZSByZXR1cm5pbmcgaXQuXCJ9Jyk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJjb21tZW50XCIsXCJyb3dcIjo8ZnVsbCBmZWVkYmFjayByb3cgZnJvbSB0aGUgYnVuZGxlIEpTT05MPn0nKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcInRhcmdldFwiLFwicm93XCI6PGZ1bGwgcGFyZW50IHNlbGVjdG9yIHJvdyBmcm9tIHRoZSBidW5kbGUgSlNPTkw+fScpO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwibWFuaWZlc3RcIixcInJvd1wiOjx0aGUgYnVuZGxlIG1hbmlmZXN0IGxpbmU+fScpO1xuICBvdXQucHVzaChge1widHlwZVwiOlwic2NyZWVuc2hvdFwiLFwicGF0aFwiOlwiJHt4RGlyfS9zY3JlZW5zaG90cy88ZmlsZT4ucG5nXCJ9YCk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJza2lsbFwiLFwiaWRcIjpcIjxtYXBwZWQgc2tpbGwgaWQ+XCIsXCJ0ZXh0XCI6XCI8RlVMTCBURVhUIG9mIHRoZSBtYXBwZWQgc2tpbGwgZmlsZT5cIn0nKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgaW1wbGVtZW50Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1lPVSDigJQgdGhlIGZvcmVncm91bmQgYWdlbnQgdGhlIG9wZXJhdG9yIHBhc3RlZCB0aGUgcHJvbXB0IGludG8g4oCUIGRvIGFsbCcpO1xuICBvdXQucHVzaCgnaW1wbGVtZW50YXRpb24sIHRlc3QgZGV2ZWxvcG1lbnQsIHRlc3RpbmcsIGFuZCBpdGVyYXRpb24gaW4nKTtcbiAgb3V0LnB1c2goJ2A8UFJPSkVDVF9ST09UPmAuIFN1YmFnZW50cyBvbmx5IHBsYW4uIFdvcmsgb25lIGNvbW1lbnQgYXQgYSB0aW1lLCB1cGRhdGUnKTtcbiAgb3V0LnB1c2goJ2l0cyB3b3JrLW1hbmlmZXN0IHJvdyB0byBgaW4tcHJvZ3Jlc3NgIHRoZW4gYGRvbmVgL2BibG9ja2VkYCwgYW5kIHBvbGlzaCcpO1xuICBvdXQucHVzaCgndGhlIGltcGxlbWVudGVkIHJlc3VsdCB3aXRoIGAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsYC4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIGF1ZGl0Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1NlbmQgdGhlIGNvbWJpbmVkIHBsYW5zICsgaW1wbGVtZW50YXRpb24gZm9yIGEgYmxpbmQgYXRvbWljIFxcJ3JvYXN0XFwnIHBlZXInKTtcbiAgb3V0LnB1c2goJ3JldmlldyBvZiBCT1RIIHBsYW4gYW5kIGltcGxlbWVudGF0aW9uLCB1c2luZyB3aGF0ZXZlciBvdGhlci1hZ2VudCcpO1xuICBvdXQucHVzaChgcGVlci1yZXZpZXcgc2tpbGxzIGV4aXN0IGluIFlPVVIgT1dOIGVudmlyb25tZW50LiBXcml0ZSBpdCB0b2ApO1xuICBvdXQucHVzaChgXFxgYXVkaXRzLyR7YnVuZGxlSWR9LzxydW5JZD4tcm9hc3QubWRcXGAgYW5kIGFkZHJlc3MgZXZlcnkgYmxvY2tlciBpdCByYWlzZXMuYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyB2ZXJpZnknKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnT25seSBhZnRlciBpbXBsZW1lbnRhdGlvbiBhbmQgYXVkaXQ6IHN0YXJ0IHRoZSBwcm9kdWN0IGxvY2FsbHksIHRoZW4gcnVuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYGJhc2gnKTtcbiAgb3V0LnB1c2goYG5weCAteSBwaW5jaGdyYWIgcmVjYXB0dXJlICR7eERpcn0vJHtqc29ubE5hbWV9IDxBUFBfVVJMPiAtLXdvcmtzcGFjZS1kaXIgJHtyb290fWApO1xuICBvdXQucHVzaCgnIyBidW54IHdvcmtzIHRvbzsgYWRkIC0tYXV0aC1zdGF0ZSA8c3RvcmFnZVN0YXRlLmpzb24+IGZvciBsb2dnZWQtaW4gcGFnZXMnKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdUaGlzIHJlLWxvY2F0ZXMgZXZlcnkgY29tbWVudGVkIHNlbGVjdG9yIHdpdGggUGluY2hHcmFiXFwncyBvd24nKTtcbiAgb3V0LnB1c2goJ0NTU+KGklhQYXRo4oaSYTExeSBjaGFpbiwgc2NyZWVuc2hvdHMgZWFjaCBlbGVtZW50LCBhbmQgd3JpdGVzIGFuIGFwcGVuZC1vbmx5Jyk7XG4gIG91dC5wdXNoKGBydW4gdW5kZXIgXFxgcmVjYXB0dXJlcy88cnVuSWQ+L1xcYCAocGx1cyBhIFxcYHJlY2FwdHVyZS1ydW5cXGAgbGVkZ2VyIHJvdykuIEl0YCk7XG4gIG91dC5wdXNoKCdleGl0cyAwIG9ubHkgd2hlbiBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3Igc3RpbGwgcmVzb2x2ZXMuIFJlYWQgZWFjaCcpO1xuICBvdXQucHVzaChgcmVjYXB0dXJlZCBQTkcgbmV4dCB0byBpdHMgb3JpZ2luYWwgaW4gXFxgJHt4RGlyfS9zY3JlZW5zaG90cy9cXGAgYW5kIGNvbmZpcm1gKTtcbiAgb3V0LnB1c2goJ2V2ZXJ5IGNvbW1lbnQgaXMgdmlzaWJseSByZXNvbHZlZDsgdGhlbiB1cGRhdGUgdGhlIG1hdGNoaW5nJyk7XG4gIG91dC5wdXNoKCd3b3JrLW1hbmlmZXN0IHJvd3MgdG8gYGRvbmVgLCBvciBgYmxvY2tlZGAgd2l0aCBhIHJlYXNvbi4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgNSDCtyBEb25lIGNyaXRlcmlhJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goZG9uZVRleHQoe2J1bmRsZUlkfSkpO1xuICBvdXQucHVzaCgnJyk7XG4gIHJldHVybiBvdXQuam9pbignXFxuJyk7XG59O1xuIiwKICAgICIvLyBTaW5nbGUtY2FwdHVyZSBmdWxsIGV4cG9ydC5cbi8vXG4vLyBcIkNvcHkgY2FwdHVyZSBhcyBKU09OXCIgd2FudHMgYSBDT01QTEVURSwgc2VsZi1jb250YWluZWQgdGV4dHVhbCBleHBvcnQgb2Zcbi8vIE9ORSBjYXB0dXJlOiBpdHMgc2VsZWN0b3JzL3BhdGhzLCBlbGVtZW50IHRleHQvY29udGVudCwgb3V0ZXJIVE1MLFxuLy8gbWV0YWRhdGEsIEFORCBldmVyeSBub3RlL2NvbW1lbnQgYXR0YWNoZWQgdG8gaXQg4oCUIGV2ZXJ5dGhpbmcgYSBmdWxsXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IGNhcnJpZXMsIGJ1dCBzY29wZWQgdG8gYSBzaW5nbGUgZWxlbWVudC5cbi8vXG4vLyBUaGUgcGFuZWwgbW9kZWxzIGEgY2FwdHVyZSBhcyBhbiBgRW50cnlgIChzcmMvdHlwZXMudHMpIHBsdXMgemVybyBvciBtb3JlXG4vLyBgRmVlZGJhY2tNZXNzYWdlYCByb3dzIGxpbmtlZCBiYWNrIHZpYSBgcGFyZW50VWlkIOKGkiBFbnRyeS51aWRgLiBCZWNhdXNlXG4vLyBub3RlcyBsaXZlIG9uIHNlcGFyYXRlIHJvd3MsIHRoZSBzZXJpYWxpemVyIHRha2VzIHRoZSBjYXB0dXJlIGVudHJ5IGFuZFxuLy8gaXRzIGZlZWRiYWNrIHJvd3MgdG9nZXRoZXIgc28gdGhlIEpTT04gaXMgZ2VudWluZWx5IHNlbGYtY29udGFpbmVkIOKAlCBhXG4vLyBjYWxsZXIgY2FuIGhhbmQgdGhlIG91dHB1dCB0byBhbiBhZ2VudCBhbmQgbm90aGluZyBkYW5nbGVzLlxuLy9cbi8vIEdyb3VwIGhlYWRzIChBbHQrU2hpZnQrQ2xpY2sgc2VsZWN0aW9ucykgY2FycnkgY2hpbGQgY2FwdHVyZXMgdW5kZXJcbi8vIGBlbnRyeS5ncm91cGA7IHdlIGlubGluZSB0aG9zZSBjaGlsZHJlbiAod2l0aCB0aGVpciBvd24gZmVlZGJhY2spIHNvIGFcbi8vIGdyb3VwZWQgY2FwdHVyZSBleHBvcnRzIGFzIG9uZSBjb21wbGV0ZSBvYmplY3QgdG9vLlxuLy9cbi8vIFR3byBvdXRwdXQgZm9ybXMsIG1pcnJvcmluZyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIEpTT04gKyBlbmdsaXNoIHNwbGl0OlxuLy8gICBzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSAgICAg4oaSIG9iamVjdCAgKHN0cnVjdHVyZWQsIGNvbXBsZXRlKVxuLy8gICBzZXJpYWxpemVDYXB0dXJlSnNvbihjYXB0dXJlLCBvcHRzKSAgICAgIOKGkiBzdHJpbmcgIChwcmV0dHkgSlNPTiArIG5ld2xpbmUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVUZXh0KGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKG1hcmtkb3duLCBodW1hbi9MTE0pXG4vL1xuLy8gYGNhcHR1cmVgIGFjY2VwdHMgZWl0aGVyOlxuLy8gICDigKIgeyBlbnRyeSwgZmVlZGJhY2s/LCBtZW1iZXJzPyB9ICDigJQgZXhwbGljaXQgc2hhcGUsIE9SXG4vLyAgIOKAoiBhIGJhcmUgYEVudHJ5YCAgICAgICAgICAgICAgICAgIOKAlCBmZWVkYmFjayBkZWZhdWx0cyB0byBbXVxuLy9cbi8vIE91dHB1dCBpcyBkZXRlcm1pbmlzdGljOiBpZGVudGljYWwgaW5wdXQg4oaSIGJ5dGUtaWRlbnRpY2FsIG91dHB1dC4gTm9cbi8vIHRpbWVzdGFtcHMgYXJlIGluamVjdGVkOyBvbmx5IHRoZSBjYXB0dXJlJ3Mgb3duIGB0c2AgZmllbGRzIGFwcGVhci5cblxuLy8g4pSA4pSA4pSAIElucHV0IG5vcm1hbGl6YXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEFjY2VwdCBhIGJhcmUgRW50cnkgb3IgYSB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3cmFwcGVyIGFuZCByZXR1cm4gYVxuLy8gbm9ybWFsaXplZCB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3aXRoIGFycmF5cyBhbHdheXMgcHJlc2VudC5cbmNvbnN0IG5vcm1hbGl6ZUNhcHR1cmUgPSAoY2FwdHVyZSkgPT4ge1xuICBpZiAoIWNhcHR1cmUgfHwgdHlwZW9mIGNhcHR1cmUgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICAvLyBCYXJlIEVudHJ5OiBpdCBoYXMgYSBgc2VsZWN0b3JgIC8gYHVpZGAgYnV0IG5vIG5lc3RlZCBgZW50cnlgLlxuICBjb25zdCBlbnRyeSA9IGNhcHR1cmUuZW50cnkgPz8gY2FwdHVyZTtcbiAgaWYgKCFlbnRyeSB8fCB0eXBlb2YgZW50cnkgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBoYXMgbm8gZW50cnlcIik7XG4gIH1cbiAgY29uc3QgZmVlZGJhY2sgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUuZmVlZGJhY2spID8gY2FwdHVyZS5mZWVkYmFjayA6IFtdO1xuICAvLyBHcm91cCBtZW1iZXJzIG1heSBiZSBzdXBwbGllZCBleHBsaWNpdGx5LCBlbHNlIGZhbGwgYmFjayB0byB0aGUgZW50cnknc1xuICAvLyBvd24gYGdyb3VwYCBhcnJheSAodGhlIHBhbmVsIHN0b3JlcyBjaGlsZCBjYXB0dXJlcyB0aGVyZSkuXG4gIGNvbnN0IG1lbWJlcnMgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUubWVtYmVycylcbiAgICA/IGNhcHR1cmUubWVtYmVyc1xuICAgIDogQXJyYXkuaXNBcnJheShlbnRyeS5ncm91cClcbiAgICAgID8gZW50cnkuZ3JvdXBcbiAgICAgIDogW107XG4gIHJldHVybiB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9O1xufTtcblxuLy8gQSBmZWVkYmFjayByb3cgc2NvcGVkIHRvIGEgc2luZ2xlIGNhcHR1cmUuIFN0cmlwcyByb3V0aW5nL1VJIGNydWZ0XG4vLyAoaWQsIHR5cGUpIGFuZCBrZWVwcyBvbmx5IHdoYXQgYSByZXZpZXdlciBuZWVkczogdGhlIHRleHQsIHdoZW4gaXQgd2FzXG4vLyB3cml0dGVuLCBhbnkgdGFncywgYW5kIHRoZSBwYXJlbnQgbGluayBmb3IgdHJhY2VhYmlsaXR5LlxuY29uc3Qgc2xpbUNvbW1lbnQgPSAoZmIpID0+IHtcbiAgY29uc3Qgb3V0ID0geyB0ZXh0OiB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiIH07XG4gIGlmIChmYi50cykgb3V0LnRzID0gZmIudHM7XG4gIGlmIChmYi51aWQpIG91dC51aWQgPSBmYi51aWQ7XG4gIGlmIChmYi5wYXJlbnRVaWQpIG91dC5wYXJlbnRVaWQgPSBmYi5wYXJlbnRVaWQ7XG4gIGlmIChBcnJheS5pc0FycmF5KGZiLnRhZ3MpICYmIGZiLnRhZ3MubGVuZ3RoKSBvdXQudGFncyA9IGZiLnRhZ3M7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb2xsZWN0IHRoZSBwYXRocy9zZWxlY3RvcnMgZm9yIGEgY2FwdHVyZSBpbnRvIG9uZSBibG9jayBzbyBldmVyeSB3YXkgb2Zcbi8vIGxvY2F0aW5nIHRoZSBlbGVtZW50IGlzIGluIGEgc2luZ2xlLCBvYnZpb3VzIHBsYWNlLiBUb2xlcmFudCBvZiBib3RoIHRoZVxuLy8gcGFuZWwgYEVudHJ5YCBzaGFwZSAoZmxhdCBgc2VsZWN0b3JgICsgYGlkYC9gdGVzdElkYCkgYW5kIHRoZSByaWNoZXJcbi8vIGBzZWxlY3RvcnNgIHN1Yi1vYmplY3Qgc29tZSBjYXB0dXJlIHBpcGVsaW5lcyBlbWl0LlxuY29uc3QgY29sbGVjdFBhdGhzID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IHBhdGhzID0ge307XG4gIGlmIChlbnRyeS5zZWxlY3RvcikgcGF0aHMuY3NzID0gZW50cnkuc2VsZWN0b3I7XG4gIGNvbnN0IHNlbCA9IGVudHJ5LnNlbGVjdG9ycztcbiAgaWYgKHNlbCAmJiB0eXBlb2Ygc2VsID09PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKHNlbC5jc3MgJiYgc2VsLmNzcyAhPT0gcGF0aHMuY3NzKSBwYXRocy5jc3NGdWxsID0gc2VsLmNzcztcbiAgICBpZiAoc2VsLmNvbXBhY3QpIHBhdGhzLmNvbXBhY3QgPSBzZWwuY29tcGFjdDtcbiAgICBpZiAoc2VsLnhwYXRoKSBwYXRocy54cGF0aCA9IHNlbC54cGF0aDtcbiAgICBpZiAoc2VsLmRhdGFJZHMpIHBhdGhzLmRhdGFJZHMgPSBzZWwuZGF0YUlkcztcbiAgfVxuICBpZiAoZW50cnkuY29tcG9uZW50Um9vdCkgcGF0aHMuY29tcG9uZW50Um9vdCA9IGVudHJ5LmNvbXBvbmVudFJvb3Q7XG4gIGlmIChlbnRyeS5zaGFkb3dIb3N0KSBwYXRocy5zaGFkb3dIb3N0ID0gZW50cnkuc2hhZG93SG9zdDtcbiAgaWYgKGVudHJ5LmlkKSBwYXRocy5kb21JZCA9IGVudHJ5LmlkO1xuICBpZiAoZW50cnkudGVzdElkKSBwYXRocy50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmICh0eXBlb2YgZW50cnkuc2VsZWN0b3JNYXRjaENvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgcGF0aHMubWF0Y2hDb3VudCA9IGVudHJ5LnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgfVxuICByZXR1cm4gcGF0aHM7XG59O1xuXG4vLyDilIDilIDilIAgRnVsbCBzdHJ1Y3R1cmVkIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEJ1aWxkIHRoZSBjb21wbGV0ZSBvYmplY3QgZm9yIE9ORSBjYXB0dXJlLiBFdmVyeXRoaW5nIHRleHR1YWwgdGhlXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IHdvdWxkIGNhcnJ5IGZvciB0aGlzIGVsZW1lbnQsIHdpdGggbm90ZXMvY29tbWVudHNcbi8vIGlubGluZWQuIEdyb3VwIG1lbWJlcnMgcmVjdXJzZSBzbyBhIGdyb3VwZWQgY2FwdHVyZSBpcyBzZWxmLWNvbnRhaW5lZC5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVDYXB0dXJlRnVsbCA9IChjYXB0dXJlLCBvcHRzID0ge30pID0+IHtcbiAgY29uc3QgeyBlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnMgfSA9IG5vcm1hbGl6ZUNhcHR1cmUoY2FwdHVyZSk7XG5cbiAgY29uc3Qgb3V0ID0ge1xuICAgIGtpbmQ6IFwicGluY2hncmFiL2NhcHR1cmUtZnVsbFwiLFxuICAgIHY6IDEsXG4gIH07XG4gIGlmIChlbnRyeS51aWQpIG91dC51aWQgPSBlbnRyeS51aWQ7XG4gIGlmIChlbnRyeS5uICE9PSB1bmRlZmluZWQpIG91dC5uID0gZW50cnkubjtcbiAgaWYgKGVudHJ5LnRzKSBvdXQudHMgPSBlbnRyeS50cztcbiAgaWYgKGVudHJ5LnVybCkgb3V0LnVybCA9IGVudHJ5LnVybDtcbiAgaWYgKGVudHJ5LnRhZykgb3V0LnRhZyA9IGVudHJ5LnRhZztcblxuICAvLyBJZGVudGl0eSAvIGExMXkgbmFtaW5nLlxuICBjb25zdCBpZGVudGl0eSA9IHt9O1xuICBpZiAoZW50cnkucm9sZSAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5yb2xlID0gZW50cnkucm9sZTtcbiAgaWYgKGVudHJ5LmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LmFjY2Vzc2libGVOYW1lID0gZW50cnkuYWNjZXNzaWJsZU5hbWU7XG4gIGlmIChlbnRyeS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkudGVzdElkID0gZW50cnkudGVzdElkO1xuICBpZiAoZW50cnkuaWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuaWQgPSBlbnRyeS5pZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkuY2xhc3NlcykgJiYgZW50cnkuY2xhc3Nlcy5sZW5ndGgpIGlkZW50aXR5LmNsYXNzZXMgPSBlbnRyeS5jbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoaWRlbnRpdHkpLmxlbmd0aCkgb3V0LmlkZW50aXR5ID0gaWRlbnRpdHk7XG5cbiAgLy8gUGF0aHMg4oCUIGV2ZXJ5IHdheSB0byBsb2NhdGUgdGhlIGVsZW1lbnQuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIG91dC5wYXRocyA9IHBhdGhzO1xuXG4gIC8vIFRleHQgLyBjb250ZW50LiBXZSBrZWVwIGFsbCB0ZXh0dWFsIHN1cmZhY2VzIHNvIG5vdGhpbmcgdGhlIHVzZXIgY2FuXG4gIC8vIHNlZSBpcyBsb3N0OiBzb3VyY2UgdGV4dCwgdGhlIENTUy1yZW5kZXJlZCBmb3JtLCBhbmQgdGhlIG1hcmt1cC5cbiAgY29uc3QgY29udGVudCA9IHt9O1xuICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnRleHQgPSBlbnRyeS50ZXh0O1xuICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQucmVuZGVyZWRUZXh0ID0gZW50cnkucmVuZGVyZWRUZXh0O1xuICBpZiAoZW50cnkudmFsdWUgIT09IHVuZGVmaW5lZCkgY29udGVudC52YWx1ZSA9IGVudHJ5LnZhbHVlO1xuICBpZiAoZW50cnkucGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCkgY29udGVudC5wbGFjZWhvbGRlciA9IGVudHJ5LnBsYWNlaG9sZGVyO1xuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIGNvbnRlbnQub3V0ZXJIVE1MID0gZW50cnkub3V0ZXJIVE1MO1xuICBpZiAoT2JqZWN0LmtleXMoY29udGVudCkubGVuZ3RoKSBvdXQuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgLy8gTm90ZXMgLyBjb21tZW50cyBhdHRhY2hlZCB0byB0aGlzIGNhcHR1cmUuXG4gIGlmIChmZWVkYmFjay5sZW5ndGgpIG91dC5jb21tZW50cyA9IGZlZWRiYWNrLm1hcChzbGltQ29tbWVudCk7XG5cbiAgLy8gUmVtYWluaW5nIHN0cnVjdHVyZWQgbWV0YWRhdGEgYW4gYWdlbnQgbWF5IHdhbnQg4oCUIGNvcGllZCB0aHJvdWdoXG4gIC8vIHZlcmJhdGltIHNvIHRoaXMgZXhwb3J0IGlzIGFzIGNvbXBsZXRlIGFzIHRoZSBKU09OTCByb3cuIFdlIGFsbG93LWxpc3RcbiAgLy8gdGhlIGhlYXZ5L3N0cnVjdHVyZWQgZmllbGRzIHJhdGhlciB0aGFuIGR1bXBpbmcgdGhlIHdob2xlIEVudHJ5IHNvIHRoZVxuICAvLyBvdXRwdXQgb3JkZXJpbmcgc3RheXMgc3RhYmxlIGFuZCBvYnZpb3VzLlxuICBjb25zdCBtZXRhID0ge307XG4gIGNvbnN0IHBhc3N0aHJvdWdoID0gW1xuICAgIFwicmVjdFwiLCBcInZpZXdwb3J0XCIsIFwic3RhdGVzXCIsIFwiYXR0cnNcIiwgXCJoaW50c1wiLCBcImNvbXBvbmVudFwiLCBcImV2ZW50c1wiLFxuICAgIFwiYmVoYXZpb3JBdHRyc1wiLCBcImExMXlcIiwgXCJhc3NldHNcIiwgXCJsYXlvdXRDb250ZXh0XCIsIFwic3R5bGVzXCIsXG4gICAgXCJtYXRjaGVkUnVsZXNcIiwgXCJhbmNlc3RvcnNcIiwgXCJzY3JlZW5zaG90XCIsIFwidHJ1bmNhdGVkXCIsIFwic2Vzc2lvbklkXCIsXG4gICAgXCJjYW52YXNDbGlja1wiLCBcImVkaXRvclwiLCBcImRvbU11dGF0aW9uc1wiLCBcImlzQW5pbWF0aW5nXCIsXG4gIF07XG4gIGZvciAoY29uc3Qga2V5IG9mIHBhc3N0aHJvdWdoKSB7XG4gICAgaWYgKGVudHJ5W2tleV0gIT09IHVuZGVmaW5lZCkgbWV0YVtrZXldID0gZW50cnlba2V5XTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMobWV0YSkubGVuZ3RoKSBvdXQubWV0YSA9IG1ldGE7XG5cbiAgLy8gR3JvdXAgbWVtYmVyczogcmVjdXJzZSBzbyBlYWNoIGNoaWxkIGNhcHR1cmUgaXMgZnVsbHkgc2VyaWFsaXplZCB0b28uXG4gIC8vIEEgbWVtYmVyIG1heSBjYXJyeSBpdHMgb3duIGZlZWRiYWNrIHdoZW4gdGhlIGNhbGxlciBzdXBwbGllcyBhXG4gIC8vIHtlbnRyeSwgZmVlZGJhY2t9IHBhaXI7IGJhcmUgY2hpbGQgRW50cmllcyBzZXJpYWxpemUgd2l0aCBubyBjb21tZW50cy5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgb3V0Lm1lbWJlcnMgPSBtZW1iZXJzLm1hcCgobSkgPT4gc2VyaWFsaXplQ2FwdHVyZUZ1bGwobSwgb3B0cykpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFByZXR0eSBKU09OIHN0cmluZyBmb3IgdGhlIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiBidXR0b24uIFRyYWlsaW5nXG4vLyBuZXdsaW5lIHNvIGl0IHJvdW5kLXRyaXBzIGNsZWFubHkgdGhyb3VnaCBlZGl0b3JzIC8gYHBicGFzdGVgLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVKc29uID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT5cbiAgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXplQ2FwdHVyZUZ1bGwoY2FwdHVyZSwgb3B0cyksIG51bGwsIDIpICsgXCJcXG5cIjtcblxuLy8g4pSA4pSA4pSAIFNpbmdsZS1jYXB0dXJlIG1hcmtkb3duIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gTWF0Y2hlcyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIGVuZ2xpc2gvbWFya2Rvd24gc3VyZmFjZSBidXQgc2NvcGVkIHRvIG9uZVxuLy8gY2FwdHVyZS4gVXNlZnVsIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gcGFzdGUgYSBodW1hbi1yZWFkYWJsZSBjYXJkIHJhdGhlclxuLy8gdGhhbiByYXcgSlNPTi5cblxuY29uc3QgaGVhZGluZyA9IChlbnRyeSkgPT4ge1xuICBjb25zdCBuYW1lID1cbiAgICBlbnRyeS5hY2Nlc3NpYmxlTmFtZSB8fFxuICAgIGVudHJ5LnRlc3RJZCB8fFxuICAgIGVudHJ5LmlkIHx8XG4gICAgZW50cnkuc2VsZWN0b3IgfHxcbiAgICBlbnRyeS50YWcgfHxcbiAgICBcImNhcHR1cmVcIjtcbiAgY29uc3QgbGFiZWwgPSBlbnRyeS5uICE9PSB1bmRlZmluZWQgPyBgQ2FwdHVyZSAjJHtlbnRyeS5ufWAgOiBcIkNhcHR1cmVcIjtcbiAgcmV0dXJuIGAke2xhYmVsfTogJHtuYW1lfWA7XG59O1xuXG5jb25zdCByZW5kZXJQYXRocyA9IChwYXRocykgPT4ge1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhwYXRocykpIHtcbiAgICBsaW5lcy5wdXNoKGAtICoqJHtrfToqKiBcXGAke3Z9XFxgYCk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVUZXh0ID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgbGluZXMucHVzaChgIyAke2hlYWRpbmcoZW50cnkpfWAsIFwiXCIpO1xuICBpZiAoZW50cnkudXJsKSBsaW5lcy5wdXNoKGBQYWdlOiA8JHtlbnRyeS51cmx9PmAsIFwiXCIpO1xuICBpZiAoZW50cnkudGFnKSBsaW5lcy5wdXNoKGBFbGVtZW50OiBcXGA8JHtlbnRyeS50YWd9PlxcYGAsIFwiXCIpO1xuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgUGF0aHNcIiwgXCJcIiwgLi4ucmVuZGVyUGF0aHMocGF0aHMpKTtcbiAgfVxuXG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQgfHwgZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgVGV4dFwiLCBcIlwiKTtcbiAgICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBsaW5lcy5wdXNoKGBTb3VyY2U6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkudGV4dCl9YCk7XG4gICAgaWYgKGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkICYmIGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gZW50cnkudGV4dCkge1xuICAgICAgbGluZXMucHVzaChgUmVuZGVyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkucmVuZGVyZWRUZXh0KX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgTWFya3VwXCIsIFwiXCIsIFwiYGBgaHRtbFwiLCBlbnRyeS5vdXRlckhUTUwsIFwiYGBgXCIpO1xuICB9XG5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBOb3RlcyAmIGNvbW1lbnRzXCIsIFwiXCIpO1xuICAgIGZvciAoY29uc3QgZmIgb2YgZmVlZGJhY2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiO1xuICAgICAgY29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGggPyBgIF8oJHtmYi50YWdzLmpvaW4oXCIsIFwiKX0pX2AgOiBcIlwiO1xuICAgICAgbGluZXMucHVzaChgLSAke3RleHR9JHt0YWdzfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtZW1iZXJzLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBHcm91cGVkIHdpdGhcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lbWJlcnMpIHtcbiAgICAgIGNvbnN0IG1lID0gbm9ybWFsaXplQ2FwdHVyZShtKS5lbnRyeTtcbiAgICAgIGxpbmVzLnB1c2goYC0gJHtoZWFkaW5nKG1lKX0g4oCUIFxcYCR7bWUuc2VsZWN0b3IgPz8gbWUudGFnID8/IFwiP1wifVxcYGApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKFwiXFxuXCIpICsgXCJcXG5cIjtcbn07XG4iLAogICAgIi8vIFBpbmNoR3JhYiBzaWRlLXBhbmVsIFVJLiBSZWNlaXZlcyBjYXB0dXJlcyArIGhvdmVycyBmcm9tIHRoZSBjb250ZW50XG4vLyBzY3JpcHQ7IHJlbmRlcnMgdGhlIGNoYXQtYnViYmxlIHRpbWVsaW5lLCBleHBvcnRzLCB2YWxpZGF0ZXMsIGV0Yy5cbi8vXG4vLyBEZWNvbXBvc2VkIGludG8gc21hbGwgZmlsZXMgZm9yIGNsYXJpdHk6XG4vLyAgIOKAoiB0eXBlcy50cyAgICAgIOKAlCBzaGFyZWQgdHlwZXMsIG1lc3NhZ2UgcHJvdG9jb2xcbi8vICAg4oCiIGx1Y2lkZS50cyAgICAg4oCUIGljb24gcmVnaXN0cnlcbi8vICAg4oCiIHRoaXMgZmlsZSAgICAg4oCUIHdpcmUtdXAgLyByZW5kZXJpbmcgLyBleHBvcnQgYnVpbGRlcnNcbi8vXG4vLyBMb2FkZWQgYXMgdGhlIHNpZGUgcGFuZWwgcGFnZTogY2hyb21lLnNpZGVQYW5lbCBkZWZhdWx0X3BhdGguXG5cbmltcG9ydCB0eXBlIHtcbiAgQW5ub3RhdGlvblBheWxvYWQsIENzVG9QYW5lbCwgRW50cnksIEV4cG9ydERpYWdub3N0aWMsIEV4cG9ydE1hbmlmZXN0LCBGZWVkYmFja01lc3NhZ2UsIFBhZ2VNZXNzYWdlLFxuICBQYWdlU25hcHNob3QsIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5pbXBvcnQge0JVTkRMRURfU0tJTExTX1BSRVNFTlQsIEJVTkRMRURfU0tJTExfRklMRVN9IGZyb20gJy4vYnVuZGxlZC1za2lsbHMuZ2VuLnRzJztcbmltcG9ydCB7YnVpbGRBZ2VudFByb21wdEpzb25sLCBidWlsZEFnZW50UHJvdG9jb2xNZCwgdHlwZSBTa2lsbHNJbmRleH0gZnJvbSAnLi9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyc7XG5pbXBvcnQge3NlcmlhbGl6ZUNhcHR1cmVKc29ufSBmcm9tICcuL2V4cG9ydC1jYXB0dXJlLm1qcyc7XG5cbigoKSA9PiB7XG4gIGNvbnN0IExPRyA9ICdbUGluY2hHcmFiL3NwXSc7XG4gIGNvbnN0IFBSRUZTX1NUT1JBR0VfTkFNRSA9ICdwaW5jaGdyYWIucHJlZnMudjInO1xuICBjb25zdCBXT1JLU1BBQ0VTX0tFWSA9ICdwaW5jaGdyYWIud29ya3NwYWNlcy52MSc7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuXG4gIC8vIOKUgOKUgOKUgCBUZW1wbGF0ZSByZXNvdXJjZSBsb2FkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEVhcmxpZXIgdGhlIHRlbXBsYXRlcyB3ZXJlIGJha2VkIGFzIHN0cmluZyBjb25zdGFudHMgaW50byB0aGlzIElJRkVcbiAgLy8gKH4zNjBLQiBhY3Jvc3MgREVTSUdOICsgU0tJTEwpLiBUaGF0IGJsb2F0ZWQgdGhlIHNpZGVwYW5lbCBidW5kbGUgdG9cbiAgLy8gfjEuOTVNQiBhbmQgc2xvd2VkIGZpcnN0LW9wZW4gcGFyc2UgdGltZSBub3RpY2VhYmx5LiBUaGV5IG5vdyBzaGlwIGFzXG4gIC8vIHNlcGFyYXRlIGAubWRgIGZpbGVzIHVuZGVyIGBleHRlbnNpb24vdGVtcGxhdGVzL2AgYW5kIGxvYWQgb24gZGVtYW5kXG4gIC8vIHZpYSBmZXRjaCDigJQgd2hlbiB0aGUgdXNlciBvcGVucyB0aGUgZWRpdG9yIG1vZGFsLCBvciB3aGVuIHRoZSBleHBvcnRcbiAgLy8gcGlwZWxpbmUgbmVlZHMgdG8gYnVuZGxlIGEgZmFsbGJhY2suXG4gIC8vXG4gIC8vIENhY2hlIHJlc3VsdHMgaW4tcHJvY2VzcyBzbyByZXBlYXQgcmVhZHMgKG1vZGFsIG9wZW4g4oaSIGNsb3NlIOKGkiByZW9wZW4sXG4gIC8vIG9yIHNlcXVlbnRpYWwgZXhwb3J0cykgZG9uJ3QgcmUtZmV0Y2guXG4gIGNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBURU1QTEFURV9GSUxFUyA9IHtcbiAgICBkZXNpZ25UZW1wbGF0ZTogJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsXG4gICAgc2tpbGxUZW1wbGF0ZTogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsXG4gICAgbG9jYWxEZXNpZ246ICdsb2NhbC5ERVNJR04ubWQnLFxuICAgIGxvY2FsU2tpbGw6ICdsb2NhbC5TS0lMTC5tZCcsXG4gIH0gYXMgY29uc3Q7XG4gIHR5cGUgVGVtcGxhdGVLZXkgPSBrZXlvZiB0eXBlb2YgVEVNUExBVEVfRklMRVM7XG4gIGNvbnN0IHRlbXBsYXRlVXJsID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gSW5zaWRlIHRoZSBleHRlbnNpb24sIHRoZSBzaWRlcGFuZWwgcnVucyBmcm9tXG4gICAgLy8gY2hyb21lLWV4dGVuc2lvbjovLzxpZD4vc2lkZXBhbmVsLmh0bWwsIHNvIHJlc291cmNlcyByZXNvbHZlIHZpYVxuICAgIC8vIGNocm9tZS5ydW50aW1lLmdldFVSTC4gVGhlIFBsYXl3cmlnaHQgc3RhdGljLXNlcnZlciB0ZXN0cyBzZXJ2ZVxuICAgIC8vIGAvdGVtcGxhdGVzLzxmaWxlPmAgZnJvbSB0aGUgZXh0ZW5zaW9uIHJvb3QgZGlyZWN0bHksIHNvIGFcbiAgICAvLyByZWxhdGl2ZSBVUkwgd29ya3MgdGhlcmUgYXMgYSBmYWxsYmFjay5cbiAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCkge1xuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChgdGVtcGxhdGVzLyR7ZmlsZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZXMvJHtmaWxlfWA7XG4gIH07XG4gIGNvbnN0IGxvYWRUZW1wbGF0ZSA9IGFzeW5jIChrZXk6IFRlbXBsYXRlS2V5KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAoIVRFTVBMQVRFU19QUkVTRU5UW2tleV0pIHJldHVybiAnJztcbiAgICBjb25zdCBmaWxlID0gVEVNUExBVEVfRklMRVNba2V5XTtcbiAgICBjb25zdCBjYWNoZWQgPSB0ZW1wbGF0ZUNhY2hlLmdldChmaWxlKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRlbXBsYXRlVXJsKGZpbGUpKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgdGVtcGxhdGUgZmV0Y2ggZmFpbGVkOiAke2ZpbGV9YCwgZXJyKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG4gIC8vIEVmZmVjdGl2ZSBjb250ZW50IHVzZWQgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSBhbmQgdGhlIG1vZGFsLiBXaGVuIHRoZVxuICAvLyB1c2VyIGhhcyBjdXN0b21pemVkIHZpYSB0aGUgdGV4dGFyZWEvdXBsb2FkLCB0aGF0IHdpbnM7IG90aGVyd2lzZSB0aGVcbiAgLy8gUExBSU4gU1RPQ0sgdGVtcGxhdGUuIFRoZSBvbGQgYGxvY2FsLipgIGRldi1vdmVycmlkZSBwcmVmZXJlbmNlIGlzXG4gIC8vIGdvbmUgKG9wZXJhdG9yIHJ1bGluZyAyMDI2LTA3LTExKTogaXQgc2lsZW50bHkgc3Vic3RpdHV0ZWQgdGhlXG4gIC8vIGRldmVsb3BlcidzIG93biBicmFuZCBmaWxlcyBhcyB0aGUgXCJkZWZhdWx0XCIsIGNvbnRhbWluYXRpbmcgZXhwb3J0c1xuICAvLyB0aGF0IHRoZSBtYW5pZmVzdCBzdGlsbCBmbGFnZ2VkIGFzIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50LlxuICBjb25zdCByZXNvbHZlRGVzaWduQ29udGVudCA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmIChwcmVmcy5kZXNpZ25NZCAmJiBwcmVmcy5kZXNpZ25NZC50cmltKCkpIHJldHVybiBwcmVmcy5kZXNpZ25NZDtcbiAgICByZXR1cm4gbG9hZFRlbXBsYXRlKCdkZXNpZ25UZW1wbGF0ZScpO1xuICB9O1xuICBjb25zdCByZXNvbHZlU2tpbGxDb250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLnNraWxsTWQgJiYgcHJlZnMuc2tpbGxNZC50cmltKCkpIHJldHVybiBwcmVmcy5za2lsbE1kO1xuICAgIHJldHVybiBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKGkiBwcmVmcy57ZGVzaWduTWR8c2tpbGxNZH0gaXNcbiAgLy8gZW1wdHkgYW5kIHdlJ3JlIGZhbGxpbmcgYmFjayB0byBhIGJ1bmRsZWQgdGVtcGxhdGUvbG9jYWwgcmVzb3VyY2UuXG4gIGNvbnN0IGlzVXNpbmdUZW1wbGF0ZURlc2lnbiA9ICgpOiBib29sZWFuID0+ICFwcmVmcy5kZXNpZ25NZCB8fCAhcHJlZnMuZGVzaWduTWQudHJpbSgpO1xuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVTa2lsbCA9ICgpOiBib29sZWFuID0+ICFwcmVmcy5za2lsbE1kIHx8ICFwcmVmcy5za2lsbE1kLnRyaW0oKTtcblxuICAvLyBWZW5kb3JlZCB0aGlyZC1wYXJ0eSBza2lsbCByZXNvdXJjZXMgKGltcGVjY2FibGUgcmVmZXJlbmNlIHNldCArXG4gIC8vIHBlcmNlcHRpb24tZmlyc3QtZGVzaWduKSwgc2hpcHBlZCB1bmRlciBleHRlbnNpb24vc2tpbGxzLyBieSB0aGUgYnVpbGRcbiAgLy8gYW5kIGlubGluZWQgaW50byBidW5kbGUgZXhwb3J0cy4gU2FtZSBsYXp5IGZldGNoICsgY2FjaGUgcGF0dGVybiBhcyB0aGVcbiAgLy8gdGVtcGxhdGVzIGFib3ZlLlxuICBjb25zdCBidW5kbGVkU2tpbGxDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGxvYWRCdW5kbGVkU2tpbGxGaWxlID0gYXN5bmMgKGV4dFBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4gPT4ge1xuICAgIGNvbnN0IGNhY2hlZCA9IGJ1bmRsZWRTa2lsbENhY2hlLmdldChleHRQYXRoKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVybCA9IGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRVUkwgPyBjaHJvbWUucnVudGltZS5nZXRVUkwoZXh0UGF0aCkgOiBleHRQYXRoO1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIGJ1bmRsZWRTa2lsbENhY2hlLnNldChleHRQYXRoLCB0ZXh0KTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgYGJ1bmRsZWQgc2tpbGwgZmV0Y2ggZmFpbGVkOiAke2V4dFBhdGh9YCwgZXJyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RvcmFnZSBhZGFwdGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBTdG9yZSA9IHtcbiAgICBhc3luYyBnZXQ8VD4oa2V5OiBzdHJpbmcsIGZhbGxiYWNrOiBUKTogUHJvbWlzZTxUPiB7XG4gICAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnN0b3JhZ2U/LmxvY2FsKSB7XG4gICAgICAgIHRyeSB7IGNvbnN0IG8gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoa2V5KTsgcmV0dXJuIChvW2tleV0gYXMgVCkgPz8gZmFsbGJhY2s7IH1cbiAgICAgICAgY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbiAgICAgIH1cbiAgICAgIHRyeSB7IGNvbnN0IHIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpOyByZXR1cm4gciA9PT0gbnVsbCA/IGZhbGxiYWNrIDogKEpTT04ucGFyc2UocikgYXMgVCk7IH1cbiAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgfSxcbiAgICBhc3luYyBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnN0b3JhZ2U/LmxvY2FsKSB7XG4gICAgICAgIHRyeSB7IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7W2tleV06IHZhbHVlfSk7IHJldHVybjsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0sXG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIERPTSByZWZzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCAkID0gPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHM6IHN0cmluZyk6IFQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKSBhcyBUO1xuICBjb25zdCBsaXN0ID0gJCgnW2RhdGEtbGlzdF0nKTtcbiAgY29uc3QgY29tcG9zZXIgPSAkPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCdbZGF0YS1jb21wb3Nlcl0nKTtcbiAgY29uc3Qgc3RhdHVzID0gJCgnW2RhdGEtc3RhdHVzXScpO1xuICBjb25zdCBzZWFyY2ggPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1zZWFyY2hdJyk7XG4gIC8vIEN0cmwrRiB2aXN1YWwtZmluZCBiYXIgKGRpc3RpbmN0IGZyb20gdGhlIGhlYWRlciBzZWFyY2gsIHdoaWNoIG9wZW5zIHRoZVxuICAvLyBjb21tYW5kIHBhbGV0dGUpLiBNYXkgYmUgYWJzZW50IGluIHZlcnkgb2xkIGNhY2hlZCBtYXJrdXAsIHNvIGNvbnN1bWVyc1xuICAvLyBudWxsLWd1YXJkLlxuICBjb25zdCBmaW5kQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWZpbmQtYmFyXScpO1xuICBjb25zdCBmaW5kSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1maW5kXScpO1xuICBjb25zdCBmaW5kQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZmluZC1jb3VudF0nKTtcbiAgLy8gQ2Fub25pY2FsaXplIGtleWJvYXJkLXNob3J0Y3V0IHBpbGxzIHBlciBwbGF0Zm9ybS4gRXZlcnkgc2hvcnRjdXQgcGlsbFxuICAvLyBpcyBhdXRob3JlZCBpbiB0aGUgY2Fub25pY2FsIENtZC1mb3JtIChlYWNoIHRva2VuIGNhcGl0YWxpemVkLCBqb2luZWRcbiAgLy8gd2l0aCAnKyc6IEFsdCtDbGljaywgQ21kK0ssIENtZCtTaGlmdCtaKTsgb24gbm9uLU1hYyB3ZSBzd2FwIHRoZSBsZWFkaW5nXG4gIC8vIENtZCBtb2RpZmllciBmb3IgQ3RybC4gUGlsbHMgb3B0IGluIHZpYSBkYXRhLW1vZC0qIHNvIGEgc3RyaW5nIGxpa2UgdGhlXG4gIC8vICdBbHQr4oCmJyBwaWxscyAod2hpY2ggbmV2ZXIgY2FycnkgQ21kKSBhcmUgbGVmdCB1bnRvdWNoZWQuXG4gIGNvbnN0IGlzTWFjID0gL01hY3xpUGhvbmV8aVBhZC9pLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtIHx8IG5hdmlnYXRvci51c2VyQWdlbnQgfHwgJycpO1xuICBpZiAoIWlzTWFjKSB7XG4gICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50Pigna2JkW2RhdGEtbW9kLWtdLCBrYmRbZGF0YS1tb2Qtel0sIGtiZFtkYXRhLW1vZC1zaGlmdC16XScpKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IChlbC50ZXh0Q29udGVudCA/PyAnJykucmVwbGFjZSgvXkNtZFxcYi8sICdDdHJsJyk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGltcG9ydEZpbGUgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCcjaW1wb3J0LWZpbGUnKTtcbiAgY29uc3Qgc3RhdHNFbCA9ICQoJ1tkYXRhLXN0YXRzXScpO1xuICBjb25zdCBzdGFyc0VsID0gJCgnW2RhdGEtc3RhcnNdJyk7XG4gIGNvbnN0IHRvb2x0aXBFbCA9ICQoJ1tkYXRhLXRvb2x0aXBdJyk7XG4gIGNvbnN0IGRyaWxsZG93bkVsID0gJCgnW2RhdGEtZHJpbGxkb3duXScpO1xuICBjb25zdCBkcmF3ZXIgPSAkKCdbZGF0YS1kcmF3ZXJdJyk7XG4gIGNvbnN0IHBhbGV0dGUgPSAkKCdbZGF0YS1wYWxldHRlXScpO1xuICBjb25zdCBwYWxldHRlSW5wdXQgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1wYWxldHRlLWlucHV0XScpO1xuICBjb25zdCBwYWxldHRlTGlzdCA9ICQoJ1tkYXRhLXBhbGV0dGUtbGlzdF0nKTtcbiAgY29uc3QgY29tcFdvcmRzID0gJCgnW2RhdGEtY29tcC13b3Jkc10nKTtcbiAgY29uc3QgY29tcFRva2VucyA9ICQoJ1tkYXRhLWNvbXAtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0VG9rZW5zID0gJCgnW2RhdGEtc3RhdC10b2tlbnNdJyk7XG4gIGNvbnN0IHN0YXRXb3JkcyA9ICQoJ1tkYXRhLXN0YXQtd29yZHNdJyk7XG4gIGNvbnN0IHdzU2VsZWN0ID0gJDxIVE1MU2VsZWN0RWxlbWVudD4oJ1tkYXRhLXdvcmtzcGFjZV0nKTtcbiAgY29uc3Qgd3NMaXN0ID0gJCgnW2RhdGEtd3MtbGlzdF0nKTtcbiAgY29uc3Qgd3NOYW1lID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtd3MtbmFtZV0nKTtcblxuICBjb25zdCBtb3VudEljb25zID0gKHJvb3Q6IFBhcmVudE5vZGUgPSBkb2N1bWVudCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgZWwgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtaWNvbl0nKSkge1xuICAgICAgY29uc3QgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29uJyk7XG4gICAgICBjb25zdCBzaXplID0gTnVtYmVyKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zaXplJykgPz8gMTYpO1xuICAgICAgaWYgKG5hbWUgJiYgUEdfSUNPTlMuaGFzKG5hbWUpKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gICAgfVxuICB9O1xuICBtb3VudEljb25zKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIFByZWZzID0ge1xuICAgIGluY2x1ZGVPdXRlckhUTUw6IGJvb2xlYW47XG4gICAgaW5jbHVkZU1hdGNoZWRSdWxlczogYm9vbGVhbjtcbiAgICBpbmNsdWRlU3R5bGVzOiBib29sZWFuO1xuICAgIG1pbmlmeTogYm9vbGVhbjtcbiAgICBhdXRvU2Nyb2xsVG9Ib3ZlcmVkOiBib29sZWFuO1xuICAgIHVzZVNjcmVlbnNob3RzOiBib29sZWFuO1xuICAgIHNwYWNpbmdPdmVybGF5OiBib29sZWFuO1xuICAgIGhvdmVyU25hcDogYm9vbGVhbjtcbiAgICBhdXRvU2NyZWVuc2hvdDogYm9vbGVhbjtcbiAgICAvLyBDb21tYS1zZXBhcmF0ZWQgaG9zdCBwYXR0ZXJucyAoc3Vic3RyaW5nIG1hdGNoKS4gSG9zdHMgaW4gdGhpcyBsaXN0XG4gICAgLy8gc2tpcCB0aGUgZW50aXJlIHNjcmVlbnNob3QgcGlwZWxpbmUg4oCUIHVzZWZ1bCBmb3Igc2Vuc2l0aXZlIHBhZ2VzXG4gICAgLy8gKGJhbmtpbmcsIGludGVybmFsIGFkbWluKSB3aGVyZSB0aGUgdXNlciBkb2Vzbid0IHdhbnQgUE5HcyBsYW5kaW5nXG4gICAgLy8gb24gZGlzay5cbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiBzdHJpbmc7XG4gICAgLy8gSW5saW5lIERFU0lHTi5tZCBjb250ZW50IHRoZSB1c2VyIHBhc3RlZCBvciB1cGxvYWRlZCB2aWEgdGhlIHNpZGVcbiAgICAvLyBwYW5lbCBzZXR0aW5ncy4gRGVmYXVsdHMgdG8gYSB0ZW1wbGF0ZWQgcGxhY2Vob2xkZXIgc28gb3V0LW9mLXRoZS1cbiAgICAvLyBib3ggZXhwb3J0cyBhbHdheXMgaW5jbHVkZSBhIERFU0lHTi5tZCDigJQgdGhlIGNvbnN1bWVyIExMTSBjYW5cbiAgICAvLyBlaXRoZXIgd29yayBmcm9tIHRoZSBwbGFjZWhvbGRlciAoYW5kIGFzayBmb3IgdGhlIHJlYWwgb25lKSBvclxuICAgIC8vIGZyb20gYSB1c2VyLWN1c3RvbWl6ZWQgY29weS4gVGhlIHNldHRpbmdzIFVJIGZsYWdzIHRoaXMgYmFubmVyLVxuICAgIC8vIHN0eWxlIHdoZW4gdGhlIHZhbHVlIHN0aWxsIG1hdGNoZXMgdGhlIHRlbXBsYXRlIHNvIHRoZSB1c2VyXG4gICAgLy8ga25vd3MgdG8gZmlsbCBpdCBpbi5cbiAgICBkZXNpZ25NZDogc3RyaW5nO1xuICAgIC8vIFJlc29sdmVkIHBhdGggdGhlIHJlY2VpdmVyIHNob3VsZCByZWFkIERFU0lHTi5tZCBmcm9tLiBEZWZhdWx0c1xuICAgIC8vIHRvIGB+Ly5hZ2VudHMvREVTSUdOLm1kYDsgdXNlciBjYW4gb3ZlcnJpZGUgcGVyLW1hY2hpbmUuXG4gICAgZGVzaWduUGF0aDogc3RyaW5nO1xuICAgIC8vIFJlc29sdmVkIHBhdGggb2YgdGhlIFBpbmNoR3JhYiBVSSBza2lsbCBvbiB0aGUgcmVjZWl2ZXInc1xuICAgIC8vIGZpbGVzeXN0ZW0uIFRoZSBza2lsbCBjb250ZW50IGl0c2VsZiBpcyBidW5kbGVkIGlubGluZSBpbnRvIHRoZVxuICAgIC8vIGFyY2hpdmUgKHNlZSBgc2tpbGxNZGApLCBzbyB0aGlzIGlzIGEgaGludCBmb3IgcmVjZWl2ZXJzIHRoYXRcbiAgICAvLyB3YW50IHRvIHBlcnNpc3QgdGhlIHNraWxsIGF0IGEgY2Fub25pY2FsIGxvY2F0aW9uLlxuICAgIHNraWxsUGF0aDogc3RyaW5nO1xuICAgIC8vIElubGluZSBVSS1za2lsbCBjb250ZW50LiBEZWZhdWx0IGlzIHRoZSBidW5kbGVkIFBpbmNoR3JhYiB0cmlhZ2VcbiAgICAvLyBza2lsbCB0ZW1wbGF0ZTsgdXNlciBjYW4gY3VzdG9taXplIHZpYSBzZXR0aW5ncyBwYXN0ZS91cGxvYWQuXG4gICAgLy8gQnVuZGxlZCBpbnRvIHRoZSBhcmNoaXZlIGF0IGAuLy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGAuXG4gICAgc2tpbGxNZDogc3RyaW5nO1xuICAgIC8vIFdoZW4gdHJ1ZSwgZmlyZSBhIGZyZXNoIHBhZ2Ugc2NyZWVuc2hvdCBvbiBFVkVSWSBjYXB0dXJlIHJhdGhlclxuICAgIC8vIHRoYW4gb25jZSBwZXIgKHdvcmtzcGFjZSwgdXJsKSB0dXBsZS4gVXNlZnVsIGZvciBjYXB0dXJpbmcgYVxuICAgIC8vIG11bHRpLXN0ZXAgZmxvdyB3aGVyZSB0aGUgcGFnZSBzdGF0ZSBjaGFuZ2VzIGJldHdlZW4gY2FwdHVyZXMuXG4gICAgLy8gRGVmYXVsdCBmYWxzZSDigJQgbW9zdCB1c2VycyB3YW50IHRoZSBkZWZhdWx0IGZpcnN0LW9ubHkgYmVoYXZpb3JcbiAgICAvLyBzaW5jZSBwYWdlIHNjcmVlbnNob3RzIGFyZSBsYXJnZSBhbmQgdGhlIGZpcnN0IG9uZSBhbHJlYWR5IGdpdmVzXG4gICAgLy8gYSBzZXNzaW9uLWxldmVsIHJlZmVyZW5jZS5cbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGJvb2xlYW47XG4gICAgLy8gU3VwcHJlc3MgQ2hyb21lJ3MgZG93bmxvYWQgYnViYmxlIHdoaWxlIFBpbmNoR3JhYiB3cml0ZXMgaXRzIG93blxuICAgIC8vIGZpbGVzIChzY3JlZW5zaG90cyArIGV4cG9ydHMpLiBSZXF1aXJlcyB0aGUgb3B0aW9uYWwgYGRvd25sb2Fkcy51aWBcbiAgICAvLyBwZXJtaXNzaW9uLiBEZWZhdWx0IE9OIGFzIGludGVudDsgdW50aWwgdGhlIHBlcm1pc3Npb24gaXMgYWN0dWFsbHlcbiAgICAvLyBncmFudGVkIChuZWVkcyBhIHVzZXIgZ2VzdHVyZSDigJQgdGhlIG51ZGdlIGJhbm5lciBvciB0aGUgc2V0dGluZ3NcbiAgICAvLyBjaGVja2JveCksIHNhdmVzIHN0YXkgdmlzaWJsZS5cbiAgICBxdWlldFNhdmVzOiBib29sZWFuO1xuICAgIC8vIFRoZSB1c2VyIGRpc21pc3NlZCB0aGUgcXVpZXQtc2F2ZXMgbnVkZ2UgYmFubmVyIOKAlCBuZXZlciByZS1zaG93IGl0LlxuICAgIHF1aWV0TnVkZ2VEaXNtaXNzZWQ6IGJvb2xlYW47XG4gICAgLy8gQ29udGludW91c2x5IG1pcnJvciB0aGUgd29ya3NwYWNlIEpTT05MIHRvIGRpc2sgKGJlc2lkZSBzY3JlZW5zaG90cylcbiAgICAvLyBzbyBjYXB0dXJlcyArIGNvbW1lbnRzIHN1cnZpdmUgYSBzdG9yYWdlIGNsZWFyIC8gZXh0ZW5zaW9uIHJlaW5zdGFsbC5cbiAgICAvLyBPbiBieSBkZWZhdWx0IOKAlCB0aGlzIGlzIHRoZSBzYWZldHkgbmV0IGFnYWluc3Qgc2lsZW50IGFubm90YXRpb24gbG9zcy5cbiAgICBhdXRvc2F2ZVRvRGlzazogYm9vbGVhbjtcbiAgICAvLyBCdW5kbGUgdGhlIHZlbmRvcmVkIHRoaXJkLXBhcnR5IGRlc2lnbiBza2lsbHMgKGltcGVjY2FibGUgcmVmZXJlbmNlXG4gICAgLy8gc2V0ICsgcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24pIHBsdXMgc2tpbGxzLWluZGV4Lmpzb24gaW50byBhcmNoaXZlXG4gICAgLy8gZXhwb3J0cy4gT24gYnkgZGVmYXVsdDogdGhlIFNlbmQtdG8tQWdlbnQgcHJvdG9jb2wncyBza2lsbC1tYXBwaW5nXG4gICAgLy8gcGhhc2UgYXNzdW1lcyB0aGVpciBwcmVzZW5jZS4gfjEuMiBNQiBvZiBtYXJrZG93biBwZXIgYnVuZGxlLlxuICAgIGJ1bmRsZVNraWxsczogYm9vbGVhbjtcbiAgICAvLyBCdW5kbGUgdGhlIGZ1bGwgc2VyaWFsaXplZCBIVE1MIG9mIGVhY2ggY2FwdHVyZWQgcGFnZSB1bmRlciBwYWdlcy8uXG4gICAgLy8gT2ZmIGJ5IGRlZmF1bHQgKGRvY3VtZW50cyBjYW4gYmUgaHVnZSk7IGNvbGxlY3RlZCBsYXppbHkgYXQgZXhwb3J0XG4gICAgLy8gdGltZSBmcm9tIGxpdmUgdGFicywgbmV2ZXIgcGVyc2lzdGVkIHRvIGNocm9tZS5zdG9yYWdlLlxuICAgIGluY2x1ZGVQYWdlSFRNTDogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgREVGQVVMVF9QUkVGUzogUHJlZnMgPSB7XG4gICAgaW5jbHVkZU91dGVySFRNTDogdHJ1ZSxcbiAgICBpbmNsdWRlTWF0Y2hlZFJ1bGVzOiB0cnVlLFxuICAgIGluY2x1ZGVTdHlsZXM6IHRydWUsXG4gICAgLy8gRGVmYXVsdCB0byBtaW5pZmllZCBleHBvcnRzIOKAlCBtb3N0IGFnZW50cyB3YW50IHRoZSBzbWFsbGVzdFxuICAgIC8vIHRva2VuLWZvb3RwcmludCBwYXlsb2FkLiBFeGlzdGluZyB1c2Vycycgc2F2ZWQgcHJlZnMgYXJlIG1lcmdlZCBvdmVyXG4gICAgLy8gdGhpcyBkZWZhdWx0IGluIGxvYWRBbGwoKSwgc28gb25seSBORVcvdW5zZXQgaW5zdGFsbHMgc2VlIHRoZSBmbGlwLlxuICAgIG1pbmlmeTogdHJ1ZSxcbiAgICBhdXRvU2Nyb2xsVG9Ib3ZlcmVkOiB0cnVlLFxuICAgIHVzZVNjcmVlbnNob3RzOiB0cnVlLFxuICAgIHNwYWNpbmdPdmVybGF5OiBmYWxzZSxcbiAgICBob3ZlclNuYXA6IHRydWUsXG4gICAgYXV0b1NjcmVlbnNob3Q6IHRydWUsXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogJycsXG4gICAgLy8gZGVzaWduTWQgLyBza2lsbE1kIGRlZmF1bHQgdG8gJycgd2hpY2ggdGhlIHJlc29sdmVyIHRyZWF0cyBhc1xuICAgIC8vIFwiZmFsbCBiYWNrIHRvIHRoZSBidW5kbGVkIHRlbXBsYXRlIGF0IGV4cG9ydCB0aW1lXCIuIFN0b3JpbmcgdGhlXG4gICAgLy8gZW1wdHkgc3RyaW5nIGtlZXBzIGNocm9tZS5zdG9yYWdlIHNtYWxsIGFuZCBsZXRzIGBpc1VzaW5nVGVtcGxhdGUqYFxuICAgIC8vIGJlIGEgY2hlYXAgc3luY2hyb25vdXMgY2hlY2suXG4gICAgZGVzaWduTWQ6ICcnLFxuICAgIGRlc2lnblBhdGg6ICd+Ly5hZ2VudHMvREVTSUdOLm1kJyxcbiAgICBza2lsbFBhdGg6ICd+Ly5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCcsXG4gICAgc2tpbGxNZDogJycsXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBmYWxzZSxcbiAgICBxdWlldFNhdmVzOiB0cnVlLFxuICAgIHF1aWV0TnVkZ2VEaXNtaXNzZWQ6IGZhbHNlLFxuICAgIGF1dG9zYXZlVG9EaXNrOiB0cnVlLFxuICAgIGJ1bmRsZVNraWxsczogdHJ1ZSxcbiAgICBpbmNsdWRlUGFnZUhUTUw6IGZhbHNlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nOyB0YWJJZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ307XG4gIC8vIE9uZSBhcmNoaXZlZCBzdGF0ZSBvZiBhIHdvcmtzcGFjZSAoY2FwdHVyZWQganVzdCBiZWZvcmUgYSBDbGVhci1hbGwpLlxuICAvLyBgc2hvdHNgIGlzIHRoZSB0aHVtYm5haWwgbWFwIChmdWxsLXJlcyBQTkdzIGFyZSBzZXNzaW9uLW9ubHkgYW5kIG5vdFxuICAvLyBhcmNoaXZlZCkuIFJlc3RvcmFibGUgZnJvbSBTZXR0aW5ncyDihpIgV29ya3NwYWNlcy5cbiAgdHlwZSBXb3Jrc3BhY2VTbmFwc2hvdCA9IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHRzOiBzdHJpbmc7XG4gICAgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdO1xuICAgIHNob3RzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGNvbW1lbnRzOiBudW1iZXI7XG4gIH07XG5cbiAgbGV0IG1lc3NhZ2VzOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICBsZXQgbGl2ZVRhYlVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsaXZlVGFiUGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHNlbGVjdG9yVmFsaWRpdHkgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbiB8ICdkaWZmLXBhZ2UnPigpO1xuICBjb25zdCBzZWxlY3RvckVycm9ycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGluc2VydEJlZm9yZToge2N1cnJlbnQ6IHN0cmluZyB8IG51bGw7IGNvbW1lbnQ6IGJvb2xlYW59ID0ge2N1cnJlbnQ6IG51bGwsIGNvbW1lbnQ6IGZhbHNlfTtcbiAgbGV0IHNlYXJjaFF1ZXJ5ID0gJyc7XG4gIGxldCBsYXN0QWN0aXZlU2VsZWN0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgc3RpY2t5VGltZXIgPSAwO1xuICBsZXQgU1RJQ0tZX1RUTF9NUyA9IDVfMDAwO1xuICBsZXQgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gIGxldCBwaGFudG9tVGFyZ2V0OiB7c2VsZWN0b3I6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgdGFnPzogc3RyaW5nOyByZWN0PzogRE9NUmVjdH0gfCBudWxsID0gbnVsbDtcbiAgbGV0IHBlbmRpbmdNdWx0aTogRW50cnlbXSA9IFtdO1xuICBjb25zdCBzaG90cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCBwZXIgc2VsZWN0b3IuIE5PVCBwZXJzaXN0ZWQgdG9cbiAgLy8gY2hyb21lLnN0b3JhZ2UgKGNhcCBwcmVzc3VyZSDigJQgMTAwIGNhcHR1cmVzIMOXIDgwIEtCIGVhY2ggPSA4IE1CKSwgc29cbiAgLy8gaXQncyBvbmx5IGF2YWlsYWJsZSBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbidzIGFyY2hpdmUgZXhwb3J0LiBDbGVhcmVkXG4gIC8vIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGNvbnN0IHNob3RzRnVsbCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIFRyYWNrIHdoaWNoICh3b3Jrc3BhY2UsIHBhZ2UtdXJsKSB0dXBsZXMgYWxyZWFkeSBmaXJlZCBhIHBhZ2Ugc2hvdCBzbyB3ZVxuICAvLyBkb24ndCByZS1zaG9vdCB0aGUgZW50aXJlIHBhZ2Ugb24gZXZlcnkgY2FwdHVyZS4gUmVzZXQgb24gd29ya3NwYWNlXG4gIC8vIHN3aXRjaCDigJQgbm8gZGF5IGtleSwgdGhlIGRlZHVwZSBpcyBwZXItc2Vzc2lvbi5cbiAgY29uc3QgcGFnZVNob3RzRmlyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcGFnZVNob3RLZXkgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4gYCR7YWN0aXZlV3N9OiR7dXJsfWA7XG4gIC8vIExhc3Qgc3VjY2Vzc2Z1bCBleHBvcnQg4oCUIGJvdGggdGhlIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChzaG93biB0byB0aGVcbiAgLy8gdXNlcikgYW5kIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIChjb3BpZWQgYnkgdGhlIFwiQ29weSBhcyBwYXRoXCIgYnV0dG9uKS5cbiAgLy8gVXBkYXRlZCBvbiBKU09OTC9NRC9aSVAvc2NyZWVuc2hvdCBzYXZlcy5cbiAgY29uc3QgbGFzdEV4cG9ydDoge3JlbFBhdGg6IHN0cmluZyB8IG51bGw7IGFic1BhdGg6IHN0cmluZyB8IG51bGw7IGNvcHlQYXRoOiBzdHJpbmcgfCBudWxsOyB0ZW1wUGF0aDogYm9vbGVhbjsga2luZDogc3RyaW5nIHwgbnVsbDsgYWdlbnRQcm9tcHQ6IHN0cmluZyB8IG51bGx9ID0ge1xuICAgIHJlbFBhdGg6IG51bGwsIGFic1BhdGg6IG51bGwsIGNvcHlQYXRoOiBudWxsLCB0ZW1wUGF0aDogZmFsc2UsIGtpbmQ6IG51bGwsIGFnZW50UHJvbXB0OiBudWxsLFxuICB9O1xuICBsZXQgd29ya3NwYWNlczogV29ya3NwYWNlW10gPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgbGV0IGFjdGl2ZVdzID0gJ2RlZmF1bHQnO1xuICAvLyBTZXNzaW9uIHV1aWQg4oCUIGdlbmVyYXRlZCBvbmNlIHBlciB3b3Jrc3BhY2UgYm9vdC4gR29lcyBvbnRvIGV2ZXJ5XG4gIC8vIHBhZ2Ugcm93IGFuZCBldmVyeSBzZWxlY3RvciBlbnRyeSBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzXG4gIC8vIHRvIFwid2hpY2ggc2Vzc2lvbj9cIiB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS4gU3RhYmxlIGFjcm9zcyBhXG4gIC8vIHNpbmdsZSB3b3Jrc3BhY2UgbG9hZDsgcmVzZXRzIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGxldCBzZXNzaW9uSWQ6IHN0cmluZyA9ICcnO1xuICBjb25zdCB3c01zZ0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259Lm1lc3NhZ2VzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzLnYxYDtcbiAgLy8gUGVyc2lzdGVudCBzbmFwc2hvdCBoaXN0b3J5IHBlciB3b3Jrc3BhY2Ug4oCUIGEgQ2xlYXItYWxsIGFyY2hpdmVzIHRoZSB3aXBlZFxuICAvLyBjYXB0dXJlcytjb21tZW50cyt0aHVtYm5haWxzIGhlcmUgc28gdGhleSBjYW4gYmUgcmVzdG9yZWQgbGF0ZXIgZnJvbVxuICAvLyBTZXR0aW5ncyDihpIgV29ya3NwYWNlcy4gTGl2ZXMgaW4gdGhlIHNhbWUgY2hyb21lLnN0b3JhZ2UgbGF5ZXIgYXMgdGhlIHJlc3RcbiAgLy8gb2YgdGhlIHdvcmtzcGFjZSBkYXRhLlxuICBjb25zdCB3c1NuYXBzaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNuYXBzaG90cy52MWA7XG4gIC8vIENhcCBzbyB0aGUgaGlzdG9yeSBjYW4ndCBiYWxsb29uIHN0b3JhZ2U7IG9sZGVzdCBzbmFwc2hvdHMgZHJvcCBvZmYuXG4gIGNvbnN0IFdTX1NOQVBTSE9UX0NBUCA9IDEwO1xuICBjb25zdCB3c1Nob3RzRnVsbEtleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzRnVsbC52MWA7XG4gIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGhhcyBhIDEwIE1CIGRlZmF1bHQgcXVvdGE7IHdlIGJ1ZGdldCBoYWxmIG9mXG4gIC8vIHRoYXQgZm9yIGZ1bGwtcmVzb2x1dGlvbiBQTkdzICh0aGUgcmVzdCBpcyBtZXNzYWdlcywgcHJlZnMsIHRodW1icykuXG4gIC8vIFdoZW4gdGhlIGJ1ZGdldCBpcyByZWFjaGVkIHdlIEZJRk8tZXZpY3QgdGhlIG9sZGVzdCBlbnRyaWVzIChNYXBcbiAgLy8gcHJlc2VydmVzIGluc2VydGlvbiBvcmRlcikuIEVzdGltYXRlIGRhdGFVUkwgc2l6ZSA9IHN0cmluZyBsZW5ndGguXG4gIGNvbnN0IFNIT1RTX0ZVTExfQlVER0VUX0JZVEVTID0gNSAqIDEwMjQgKiAxMDI0O1xuICBjb25zdCB1bmRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHJlZG9TdGFjazogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgVU5ET19DQVAgPSAzMDtcbiAgbGV0IHN1c3BlbmRTbmFwc2hvdHMgPSBmYWxzZTtcbiAgbGV0IHByZWZzOiBQcmVmcyA9IHsuLi5ERUZBVUxUX1BSRUZTfTtcblxuICAvLyDilIDilIDilIAgU3RhdHVzIGhlbHBlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHN0YXR1c1RpbWVyID0gMDtcbiAgY29uc3Qgc2V0U3RhdHVzID0gKG1zZzogc3RyaW5nLCBvcHRzOiB7a2luZD86ICd3YXJuJyB8ICdpbmZvJyB8ICdvayd9ID0ge30pOiB2b2lkID0+IHtcbiAgICBzdGF0dXMudGV4dENvbnRlbnQgPSBtc2cgfHwgJyc7XG4gICAgY2xlYXJUaW1lb3V0KHN0YXR1c1RpbWVyKTtcbiAgICBpZiAobXNnKSB7XG4gICAgICBzdGF0dXMuc3R5bGUuY29sb3IgPSBvcHRzLmtpbmQgPT09ICd3YXJuJyA/ICd2YXIoLS1yZWQpJyA6XG4gICAgICAgIG9wdHMua2luZCA9PT0gJ2luZm8nID8gJ3ZhcigtLXRleHQtMyknIDogJ3ZhcigtLWdyZWVuKSc7XG4gICAgICBzdGF0dXNUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7IH0sIDIyMDApO1xuICAgIH1cbiAgfTtcbiAgbGV0IHRvYXN0VGltZXIgPSAwO1xuICBjb25zdCBzaG93VG9hc3QgPSAodGl0bGU6IHN0cmluZywgZGV0YWlsID0gJycsIGtpbmQ6ICdvaycgfCAnd2FybicgPSAnb2snKTogdm9pZCA9PiB7XG4gICAgbGV0IHRvYXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWNvcHktdG9hc3RdJyk7XG4gICAgaWYgKCF0b2FzdCkge1xuICAgICAgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRvYXN0LmNsYXNzTmFtZSA9ICdjb3B5LXRvYXN0JztcbiAgICAgIHRvYXN0LmRhdGFzZXQuY29weVRvYXN0ID0gJ3RydWUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodG9hc3QpO1xuICAgIH1cbiAgICB0b2FzdC5jbGFzc0xpc3QudG9nZ2xlKCd3YXJuJywga2luZCA9PT0gJ3dhcm4nKTtcbiAgICB0b2FzdC5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJjb3B5LXRvYXN0LWljb25cIj4ke1BHX0lDT05TLnN2Z1N0cmluZyhraW5kID09PSAnd2FybicgPyAnYWxlcnQtY2lyY2xlJyA6ICdjaXJjbGUtY2hlY2snLCAyMil9PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjb3B5LXRvYXN0LXRleHRcIj48Yj4ke2VzY2FwZUh0bWwodGl0bGUpfTwvYj4ke2RldGFpbCA/IGA8c21hbGw+JHtlc2NhcGVIdG1sKGRldGFpbCl9PC9zbWFsbD5gIDogJyd9PC9zcGFuPmA7XG4gICAgdG9hc3QuaGlkZGVuID0gZmFsc2U7XG4gICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIHZvaWQgdG9hc3Qub2Zmc2V0V2lkdGg7XG4gICAgdG9hc3QuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIGNsZWFyVGltZW91dCh0b2FzdFRpbWVyKTtcbiAgICB0b2FzdFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdG9hc3Q/LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgaWYgKHRvYXN0KSB0b2FzdC5oaWRkZW4gPSB0cnVlOyB9LCAxODApO1xuICAgIH0sIDE0NTApO1xuICB9O1xuICBjb25zdCBzaG93Q29waWVkID0gKGxhYmVsOiBzdHJpbmcsIGRldGFpbCA9ICcnKTogdm9pZCA9PiBzaG93VG9hc3QobGFiZWwsIGRldGFpbCwgJ29rJyk7XG4gIGNvbnN0IHNob3dEb3dubG9hZEVycm9yID0gKGxhYmVsOiBzdHJpbmcsIGRldGFpbDogc3RyaW5nKTogdm9pZCA9PiBzaG93VG9hc3QobGFiZWwsIGRldGFpbCwgJ3dhcm4nKTtcblxuICAvLyDilIDilIDilIAgVXRpbGl0aWVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgZmFsbGJhY2tJZENvdW50ZXIgPSAwO1xuICBjb25zdCBzZWN1cmVUb2tlbiA9IChieXRlcyA9IDEyKTogc3RyaW5nID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmF3ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMpO1xuICAgICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJhdyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShyYXcpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9XyR7KCsrZmFsbGJhY2tJZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgbXNnSWQgPSAoKTogc3RyaW5nID0+IHtcbiAgICB0cnkgeyBpZiAoZ2xvYmFsVGhpcy5jcnlwdG8ucmFuZG9tVVVJRCkgcmV0dXJuIGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQoKTsgfSBjYXRjaCB7IC8qIGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgcmV0dXJuIGBpZF8ke3NlY3VyZVRva2VuKDE2KX1gO1xuICB9O1xuICBjb25zdCBlc2NhcGVIdG1sID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgIFN0cmluZyhzKS5yZXBsYWNlQWxsKCcmJywgJyZhbXA7JykucmVwbGFjZUFsbCgnPCcsICcmbHQ7JykucmVwbGFjZUFsbCgnPicsICcmZ3Q7Jyk7XG4gIGNvbnN0IGVzY2FwZVJlID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IGhpZ2hsaWdodE1hdGNoID0gKHRleHQ6IHN0cmluZywgcTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIXEpIHJldHVybiBlc2NhcGVIdG1sKHRleHQpO1xuICAgIHJldHVybiBlc2NhcGVIdG1sKHRleHQpLnJlcGxhY2UobmV3IFJlZ0V4cChgKCR7ZXNjYXBlUmUocSl9KWAsICdnaScpLCAnPG1hcms+JDE8L21hcms+Jyk7XG4gIH07XG4gIC8vIFdhbGsgdGV4dCBub2RlcyBpbnNpZGUgYHJvb3RgLCB3cmFwcGluZyBjYXNlLWluc2Vuc2l0aXZlIG1hdGNoZXMgb2YgYHFgXG4gIC8vIGluIDxtYXJrPiBlbGVtZW50cy4gRG9lc24ndCB0b3VjaCBhdHRyaWJ1dGUgc3RyaW5ncyBvciBpbm5lci10YWcgSFRNTCBzb1xuICAvLyBpdCdzIHNhZmUgdG8gcnVuIG9uIGFscmVhZHktaGlnaGxpZ2h0ZWQgSlNPTiBvdXRwdXQuXG4gIGNvbnN0IHdyYXBTZWFyY2hIaXRzSW5UZXh0Tm9kZXMgPSAocm9vdDogSFRNTEVsZW1lbnQsIHE6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChlc2NhcGVSZShxKSwgJ2dpJyk7XG4gICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihyb290LCBOb2RlRmlsdGVyLlNIT1dfVEVYVCk7XG4gICAgY29uc3QgdGFyZ2V0czogVGV4dFtdID0gW107XG4gICAgbGV0IG5vZGU6IE5vZGUgfCBudWxsO1xuICAgIHdoaWxlICgobm9kZSA9IHdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgICAgaWYgKHJlLnRlc3Qobm9kZS5ub2RlVmFsdWUgPz8gJycpKSB0YXJnZXRzLnB1c2gobm9kZSBhcyBUZXh0KTtcbiAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgfVxuICAgIGZvciAoY29uc3QgdCBvZiB0YXJnZXRzKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHQubm9kZVZhbHVlID8/ICcnO1xuICAgICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGxldCBsYXN0ID0gMDtcbiAgICAgIGZvciAoY29uc3QgbSBvZiB2YWx1ZS5tYXRjaEFsbChyZSkpIHtcbiAgICAgICAgY29uc3QgaSA9IG0uaW5kZXggPz8gMDtcbiAgICAgICAgaWYgKGkgPiBsYXN0KSBmcmFnLmFwcGVuZCh2YWx1ZS5zbGljZShsYXN0LCBpKSk7XG4gICAgICAgIGNvbnN0IG1rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWFyaycpO1xuICAgICAgICBtay50ZXh0Q29udGVudCA9IG1bMF07XG4gICAgICAgIGZyYWcuYXBwZW5kKG1rKTtcbiAgICAgICAgbGFzdCA9IGkgKyBtWzBdLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0IDwgdmFsdWUubGVuZ3RoKSBmcmFnLmFwcGVuZCh2YWx1ZS5zbGljZShsYXN0KSk7XG4gICAgICB0LnJlcGxhY2VXaXRoKGZyYWcpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgd29yZENvdW50ID0gKHM6IHN0cmluZyk6IG51bWJlciA9PiAocy5tYXRjaCgvXFxTKy9nKSA/PyBbXSkubGVuZ3RoO1xuICBjb25zdCB0b2tlbkNvdW50ID0gKHM6IHN0cmluZyk6IG51bWJlciA9PiBNYXRoLmNlaWwocy5sZW5ndGggLyA0KTtcbiAgY29uc3QgcGF0aE9mID0gKHU6IHN0cmluZyk6IHN0cmluZyA9PiB7IHRyeSB7IHJldHVybiBuZXcgVVJMKHUpLnBhdGhuYW1lOyB9IGNhdGNoIHsgcmV0dXJuIHU7IH0gfTtcbiAgY29uc3QgaG9zdE9mID0gKHU6IHN0cmluZyk6IHN0cmluZyA9PiB7IHRyeSB7IHJldHVybiBuZXcgVVJMKHUpLmhvc3Q7IH0gY2F0Y2ggeyByZXR1cm4gJyc7IH0gfTtcbiAgLy8gRmlsZW5hbWUtc2FmZSBob3N0IHNsdWc6IGRvdHMg4oaSIHVuZGVyc2NvcmVzIHBlciBwcm9qZWN0IGNvbnZlbnRpb24uXG4gIC8vIE1pcnJvcnMgYmFja2dyb3VuZC50cyBob3N0U2x1ZyBmb3Igc3ltbWV0cnkgYWNyb3NzIHNjcmVlbnNob3QgKyBleHBvcnRcbiAgLy8gZmlsZW5hbWVzLlxuICBjb25zdCBob3N0U2x1ZyA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgaCA9IGhvc3RPZih1cmwpO1xuICAgIGlmICghaCkgcmV0dXJuICd1bmtub3duJztcbiAgICByZXR1cm4gaC5yZXBsYWNlKC9cXC4vZywgJ18nKS5yZXBsYWNlKC9bXlxcdy1dL2csICdfJykuc2xpY2UoMCwgNDApIHx8ICd1bmtub3duJztcbiAgfTtcbiAgLy8gUGljayB0aGUgbW9zdC1mcmVxdWVudCBob3N0IGFjcm9zcyBhbGwgc2VsZWN0b3IgY2FwdHVyZXMgKGZvciBleHBvcnRcbiAgLy8gZmlsZW5hbWVzKS4gV2hlbiB0aGUgd29ya3NwYWNlIHNwYW5zIG11bHRpcGxlIGhvc3RzLCByZXR1cm4gJ211bHRpJy5cbiAgY29uc3QgZG9taW5hbnRIb3N0U2x1ZyA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGNvdW50cyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGggPSBob3N0U2x1ZyhtLmVudHJ5LnVybCk7XG4gICAgICBjb3VudHMuc2V0KGgsIChjb3VudHMuZ2V0KGgpID8/IDApICsgMSk7XG4gICAgfVxuICAgIGlmICghY291bnRzLnNpemUpIHJldHVybiAnZW1wdHknO1xuICAgIGxldCBiZXN0ID0gJyc7XG4gICAgbGV0IGJlc3ROID0gMDtcbiAgICBmb3IgKGNvbnN0IFtoLCBuXSBvZiBjb3VudHMpIHtcbiAgICAgIGlmIChuID4gYmVzdE4pIHsgYmVzdCA9IGg7IGJlc3ROID0gbjsgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnRzLnNpemUgPiAxID8gJ211bHRpJyA6IGJlc3Q7XG4gIH07XG4gIC8vIERpc3RpbmN0IGhvc3RzIHByZXNlbnQgaW4gdGhpcyB3b3Jrc3BhY2UgKGFscGhhYmV0aWNhbCwgY2FwcGVkKS4gVXNlZCBpblxuICAvLyB0aGUgZXhwb3J0IG1hbmlmZXN0J3MgYGhvc3RzYCBmaWVsZC5cbiAgY29uc3QgZGlzdGluY3RIb3N0cyA9ICgpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgc2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGggPSBob3N0T2YobS5lbnRyeS51cmwpO1xuICAgICAgaWYgKGgpIHNldC5hZGQoaCk7XG4gICAgfVxuICAgIHJldHVybiBbLi4uc2V0XS5zb3J0KCkuc2xpY2UoMCwgMjApO1xuICB9O1xuICAvLyDilIDilIDilIAgRGV0ZXJtaW5pc3RpYyBleHBvcnQgaWRlbnRpdHkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIE9uZSBjbG9jayBwZXIgZXhwb3J0OiBldmVyeSB0aW1lc3RhbXAgaW5zaWRlIGEgc2luZ2xlIGV4cG9ydCBkZXJpdmVzXG4gIC8vIGZyb20gdGhlIHNhbWUgaW5zdGFudCwgYW5kIHRlc3RzIGNhbiBmcmVlemUgaXQgc28gdHdvIGV4cG9ydHMgb2YgdGhlXG4gIC8vIHNhbWUgY29udGVudCBhcmUgYnl0ZS1pZGVudGljYWwuXG4gIGxldCBleHBvcnRDbG9ja092ZXJyaWRlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZXhwb3J0Tm93SXNvID0gKCk6IHN0cmluZyA9PiBleHBvcnRDbG9ja092ZXJyaWRlID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgLy8gU3RhYmxlIGNvbnRlbnQgaWRlbnRpdHk6IFNIQS0yNTYgb3ZlciB0aGUgc2xpbSByb3dzIHBsdXMgdGhlIHNvcnRlZFxuICAvLyBzY3JlZW5zaG90IGFyY2hpdmUgbmFtZXMuIFNhbWUgd29ya3NwYWNlIGNvbnRlbnQg4oaSIHNhbWUgaGFzaCDihpIgc2FtZVxuICAvLyBmaWxlbmFtZSAodGhlIGJhY2tncm91bmQgc2F2ZXMgd2l0aCBjb25mbGljdEFjdGlvbiAnb3ZlcndyaXRlJyksIHNvXG4gIC8vIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudCByZXBsYWNlcyByYXRoZXIgdGhhbiBkdXBsaWNhdGVzLlxuICBjb25zdCBjb21wdXRlQ29udGVudEhhc2ggPSBhc3luYyAoc2hvdE5hbWVzOiBzdHJpbmdbXSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGF5bG9hZCA9IGJ1aWxkU2xpbSgpLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpLmpvaW4oJ1xcbicpICsgJ1xcbicgKyBbLi4uc2hvdE5hbWVzXS5zb3J0KCkuam9pbignXFxuJyk7XG4gICAgY29uc3QgZGlnZXN0ID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUocGF5bG9hZCkpO1xuICAgIHJldHVybiBbLi4ubmV3IFVpbnQ4QXJyYXkoZGlnZXN0KV0ubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKTtcbiAgfTtcbiAgLy8gQnVpbGQgYSBmaWxlbmFtZSBvZiB0aGUgc2hhcGUgYHBpbmNoZ3JhYi08d29ya3NwYWNlPi08aG9zdD4tPHN0YW1wPi48ZXh0PmAuXG4gIC8vIFRoZSBzdGFtcCBpcyB0aGUgZXhwb3J0J3MgY29udGVudC1oYXNoIHByZWZpeCB3aGVuIHN1cHBsaWVkIChidW5kbGUgYW5kXG4gIC8vIEpTT05MIGV4cG9ydHMpLCBmYWxsaW5nIGJhY2sgdG8gdGhlIGVwb2NoIGZvciBsZWdhY3kgY2FsbGVycy5cbiAgY29uc3QgYnVpbGRFeHBvcnRGaWxlbmFtZSA9IChleHQ6ICdqc29ubCcgfCAnbWQnIHwgJ3Rhci56c3QnLCBzdGFtcD86IHN0cmluZyk6IHN0cmluZyA9PlxuICAgIGBwaW5jaGdyYWItJHthY3RpdmVXc30tJHtkb21pbmFudEhvc3RTbHVnKCl9LSR7c3RhbXAgPz8gRGF0ZS5ub3coKX0uJHtleHR9YDtcbiAgLy8gU2tpcC1saXN0IG1hdGNoOiBzdWJzdHJpbmcgKGNhc2UtaW5zZW5zaXRpdmUpIG1hdGNoIGFnYWluc3QgdGhlIFVSTCdzXG4gIC8vIGhvc3QuIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIFVSTCBwYXJzaW5nIG9uIHRoZSBwYXR0ZXJucyBzbyB0aGUgdXNlclxuICAvLyBjYW4gd3JpdGUgYHdyYW5uZ2xlLmNvbWAgYW5kIGhhdmUgaXQgbWF0Y2ggYGFwcC53cmFubmdsZS5jb21gIHRvby5cbiAgY29uc3Qgc2hvdWxkU2tpcFNjcmVlbnNob3QgPSAodXJsOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBsaXN0ID0gKHByZWZzLnNraXBTY3JlZW5zaG90SG9zdHMgPz8gJycpLnNwbGl0KCcsJykubWFwKChzKSA9PiBzLnRyaW0oKS50b0xvd2VyQ2FzZSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGhvc3QgPSBob3N0T2YodXJsKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBsaXN0LnNvbWUoKHBhdCkgPT4gaG9zdC5pbmNsdWRlcyhwYXQpKTtcbiAgfTtcblxuICAvLyBKU09OIHN5bnRheCBoaWdobGlnaHQgKHBlci1rZXkgY29sb3IgaXMgaGFzaGVkIGZvciB2aXN1YWwgdmFyaWV0eSkuXG4gIGNvbnN0IEtFWV9QQUxFVFRFID0gWycjZmY3ZTc4JywgJyNmZmI0NTQnLCAnI2ZmZTA2NicsICcjN2JkOTdhJywgJyM1ZmQxZmYnLCAnIzliOGNmZicsICcjZmY4NWMxJywgJyNmZjVmMDAnLCAnIzEwYjk4MScsICcjZjU5ZTBiJywgJyNhNzhiZmEnLCAnIzM0ZDM5OSddO1xuICBjb25zdCBjb2xvckZvcktleSA9IChrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgay5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgICByZXR1cm4gS0VZX1BBTEVUVEVbaCAlIEtFWV9QQUxFVFRFLmxlbmd0aF0hO1xuICB9O1xuICBjb25zdCBKU09OX1RPS0VOX1JFID0gLyhcXHMrKXwoXCIoPzpbXlwiXFxcXF18XFxcXC4pKlwiKXwodHJ1ZXxmYWxzZXxudWxsKXwoLT9cXGQrKD86XFwuXFxkKyk/KD86W2VFXVsrLV0/XFxkKyk/KXwoW3t9W1xcXSw6XSkvZztcbiAgY29uc3QgYXBwZW5kSnNvbkhpZ2hsaWdodCA9IChyb290OiBIVE1MRWxlbWVudCwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgcm9vdC50ZXh0Q29udGVudCA9ICcnO1xuICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICAgIGxldCBsYXN0ID0gMDtcbiAgICBKU09OX1RPS0VOX1JFLmxhc3RJbmRleCA9IDA7XG4gICAgd2hpbGUgKChtID0gSlNPTl9UT0tFTl9SRS5leGVjKHRleHQpKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKG0uaW5kZXggPiBsYXN0KSByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKGxhc3QsIG0uaW5kZXgpKSk7XG4gICAgICBsYXN0ID0gSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXg7XG4gICAgICBjb25zdCBbLCB3cywgc3RyLCBsaXQsIG51bSwgcHVuY3RdID0gbTtcbiAgICAgIGlmICh3cykgeyByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh3cykpOyBjb250aW51ZTsgfVxuICAgICAgaWYgKHN0cikge1xuICAgICAgICBsZXQgayA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgICB3aGlsZSAoayA8IHRleHQubGVuZ3RoICYmICh0ZXh0W2tdID09PSAnICcgfHwgdGV4dFtrXSA9PT0gJ1xcdCcgfHwgdGV4dFtrXSA9PT0gJ1xcbicpKSBrKys7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGlmICh0ZXh0W2tdID09PSAnOicpIHtcbiAgICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG4gICAgICAgICAgdHJ5IHsga2V5ID0gSlNPTi5wYXJzZShzdHIpIGFzIHN0cmluZzsgfSBjYXRjaCB7IGtleSA9IHN0ci5zbGljZSgxLCAtMSk7IH1cbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdrJztcbiAgICAgICAgICBzcGFuLnN0eWxlLmNvbG9yID0gY29sb3JGb3JLZXkoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdzJztcbiAgICAgICAgfVxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gc3RyO1xuICAgICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgaWYgKGxpdCkgc3Bhbi5jbGFzc05hbWUgPSAnYic7XG4gICAgICBlbHNlIGlmIChudW0pIHNwYW4uY2xhc3NOYW1lID0gJ24nO1xuICAgICAgZWxzZSBpZiAocHVuY3QpIHNwYW4uY2xhc3NOYW1lID0gJ3AnO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGxpdCA/PyBudW0gPz8gcHVuY3QgPz8gJyc7XG4gICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICB9XG4gICAgaWYgKGxhc3QgPCB0ZXh0Lmxlbmd0aCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0KSkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBQZXJzaXN0ZW5jZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgbG9hZEFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICB3b3Jrc3BhY2VzID0gKGF3YWl0IFN0b3JlLmdldDxXb3Jrc3BhY2VbXT4oV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpKSB8fCB3b3Jrc3BhY2VzO1xuICAgIGlmICghd29ya3NwYWNlcy5sZW5ndGgpIHdvcmtzcGFjZXMgPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgICBhY3RpdmVXcyA9IChhd2FpdCBTdG9yZS5nZXQ8c3RyaW5nPigncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsICdkZWZhdWx0JykpIHx8ICdkZWZhdWx0JztcbiAgICBpZiAoIXdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBhY3RpdmVXcykpIGFjdGl2ZVdzID0gd29ya3NwYWNlc1swXSEubmFtZTtcbiAgICBwcmVmcyA9IHsuLi5ERUZBVUxUX1BSRUZTLCAuLi4oYXdhaXQgU3RvcmUuZ2V0PFBhcnRpYWw8UHJlZnM+PihQUkVGU19TVE9SQUdFX05BTUUsIHt9KSl9O1xuICAgIC8vIFBhdGggbWlncmF0aW9uOiBwcmlvciB2ZXJzaW9ucyBkZWZhdWx0ZWQgc2tpbGxQYXRoIHRvXG4gICAgLy8gYH4vLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLCBhbmQgc29tZSB1c2VycyBoYWQgaXQgc3RvcmVkIGFzXG4gICAgLy8gYH4vLmRvdGZpbGVzLy5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYC4gVGhlIHNraWxsIHdhcyByZW5hbWVkXG4gICAgLy8gdG8gYFBpbmNoR3JhYmA7IGFueSBgfi8uZG90ZmlsZXMvYCBwcmVmaXggaXMgc3RyaXBwZWQgZnJvbVxuICAgIC8vIGV4cG9zZWQgZGVmYXVsdHMgKGRvdGZpbGVzIGlzIGEgcGVyc29uYWwgY29uZmlnIHNvdXJjZSDigJQgZXhwb3J0c1xuICAgIC8vIHNob3VsZG4ndCBsZWFrIHRoYXQgcGF0aCkuXG4gICAgY29uc3QgdXBncmFkZVBhdGggPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkLCBmcmVzaDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgIGlmICghcCkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuaW5jbHVkZXMoJy5kb3RmaWxlcycpKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5lbmRzV2l0aCgnc2tpbGxzL3VpL1NLSUxMLm1kJykpIHJldHVybiBmcmVzaDtcbiAgICAgIHJldHVybiBwO1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLmRlc2lnblBhdGgsIERFRkFVTFRfUFJFRlMuZGVzaWduUGF0aCk7XG4gICAgcHJlZnMuc2tpbGxQYXRoID0gdXBncmFkZVBhdGgocHJlZnMuc2tpbGxQYXRoLCBERUZBVUxUX1BSRUZTLnNraWxsUGF0aCk7XG4gICAgLy8gQ29udGVudCBtaWdyYXRpb246IHByZXZpb3VzIHZlcnNpb25zIHN0b3JlZCB0aGUgZW50aXJlIHRlbXBsYXRlXG4gICAgLy8gdGV4dCBpbnNpZGUgYHByZWZzLmRlc2lnbk1kYCAvIGBwcmVmcy5za2lsbE1kYCBhcyBkZWZhdWx0cy4gVGhhdFxuICAgIC8vIGF0ZSB+MzYwS0Igb2YgY2hyb21lLnN0b3JhZ2UgcXVvdGEgZm9yIG5vIGJlbmVmaXQuIERldGVjdCB3aGVuXG4gICAgLy8gdGhlIHN0b3JlZCB2YWx1ZSBtYXRjaGVzIG9uZSBvZiB0aGUgYnVuZGxlZCB0ZW1wbGF0ZXMgYW5kIGNsZWFyXG4gICAgLy8gaXQg4oCUIHRoZSByZXNvbHZlciBmYWxscyBiYWNrIHRvIHRoZSBidW5kbGVkIGZpbGUgb24gdGhlIGZseS5cbiAgICAvLyBBbHNvIHNjcnViIGFueSBsZWFrZWQgYH4vLmRvdGZpbGVzL2Agc3Vic3RyaW5nLlxuICAgIGNvbnN0IHNjcnViRG90ZmlsZXMgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgICBzLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLy5hZ2VudHMvJywgJ34vLmFnZW50cy8nKVxuICAgICAgIC5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8nLCAnfi8uYWdlbnRzLycpO1xuICAgIGNvbnN0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUgPSBhc3luYyAoY3VycmVudDogc3RyaW5nLCBrZXlzOiBUZW1wbGF0ZUtleVtdKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgIGlmICghY3VycmVudCB8fCAhY3VycmVudC50cmltKCkpIHJldHVybiAnJztcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSBjdXJyZW50LnRyaW0oKTtcbiAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IHRwbCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoaykpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRwbCAmJiB0cGwgPT09IHRyaW1tZWQpIHJldHVybiAnJzsgLy8gbWF0Y2hlcyBhIGJ1bmRsZWQgdGVtcGxhdGUg4oCUIGNvbGxhcHNlIHRvIGVtcHR5XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycmVudC5pbmNsdWRlcygnLmRvdGZpbGVzJykgPyBzY3J1YkRvdGZpbGVzKGN1cnJlbnQpIDogY3VycmVudDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnbk1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5kZXNpZ25NZCA/PyAnJywgWydsb2NhbERlc2lnbicsICdkZXNpZ25UZW1wbGF0ZSddKTtcbiAgICBwcmVmcy5za2lsbE1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5za2lsbE1kID8/ICcnLCBbJ2xvY2FsU2tpbGwnLCAnc2tpbGxUZW1wbGF0ZSddKTtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKGFjdGl2ZVdzKTtcbiAgfTtcbiAgY29uc3QgbG9hZFdvcmtzcGFjZSA9IGFzeW5jIChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhY3RpdmVXcyA9IG5hbWU7XG4gICAgdm9pZCBTdG9yZS5zZXQoJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCBuYW1lKTtcbiAgICAvLyBNaW50IGEgbmV3IHNlc3Npb25JZCBwZXIgd29ya3NwYWNlIGxvYWQuIFNhbWUgd29ya3NwYWNlIHJlLW9wZW5lZFxuICAgIC8vID0gbmV3IHNlc3Npb246IGRpc3RpbmN0IHV1aWQgc28gYSBjb25zdW1lciBjYW4gdGVsbCB0d28gYm9vdHNcbiAgICAvLyBhcGFydCBldmVuIHdoZW4gdGhlIGNhcHR1cmVzIGxhbmQgaW4gdGhlIHNhbWUgb24tZGlzayBmaWxlLlxuICAgIHNlc3Npb25JZCA9IG1zZ0lkKCk7XG4gICAgbWVzc2FnZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFBhbmVsTWVzc2FnZVtdPih3c01zZ0tleShuYW1lKSwgW10pKSB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSBtZXNzYWdlcyA9IFtdO1xuICAgIC8vIE1pZ3JhdGUgbGVnYWN5IGVudHJpZXMgKG5vIHVpZCwgc3RhdGVzLWFzLXJlY29yZCwgYXR0cnMuZm9ybWF0KSBhbmRcbiAgICAvLyBwZXJzaXN0IGlmIGFueXRoaW5nIGNoYW5nZWQgc28gd2UgZG9uJ3QgcGF5IHRoZSBtaWdyYXRpb24gY29zdCBhZ2FpblxuICAgIC8vIG5leHQgbG9hZC5cbiAgICBpZiAobWlncmF0ZUxvYWRlZE1lc3NhZ2VzKCkpIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KG5hbWUpLCBtZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwYWdlU2hvdHNGaXJlZC5jbGVhcigpO1xuICAgIGNvbnN0IHN0b3JlZCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0tleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWQpKSBzaG90cy5zZXQoaywgdik7XG4gICAgLy8gUmVzdG9yZSB0aGUgZnVsbC1yZXNvbHV0aW9uIFBORyBjYWNoZSBzbyBhIHdvcmtzcGFjZSBhcmNoaXZlXG4gICAgLy8gZXhwb3J0ZWQgQUZURVIgYSBwYW5lbCByZWxvYWQgc3RpbGwgYnVuZGxlcyBzY3JlZW5zaG90cyBmcm9tXG4gICAgLy8gZWFybGllciBjYXB0dXJlcy4gRklGTyBvcmRlciBpcyBwcmVzZXJ2ZWQgYnkgT2JqZWN0IGtleSBvcmRlci5cbiAgICBjb25zdCBzdG9yZWRGdWxsID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzRnVsbEtleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWRGdWxsKSkgc2hvdHNGdWxsLnNldChrLCB2KTtcbiAgICAvLyBMb2FkIHRoaXMgd29ya3NwYWNlJ3MgcGVyc2lzdGVudCBzbmFwc2hvdCBoaXN0b3J5IChDbGVhci1hbGwgYXJjaGl2ZXMpLlxuICAgIGF3YWl0IGxvYWRXc1NuYXBzaG90cyhuYW1lKTtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgc2VsZWN0b3JFcnJvcnMuY2xlYXIoKTtcbiAgICB1bmRvU3RhY2subGVuZ3RoID0gMDtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gbnVsbDtcbiAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICB9O1xuICBjb25zdCBwZXJzaXN0ID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KGFjdGl2ZVdzKSwgbWVzc2FnZXMpO1xuICAgIC8vIFB1c2ggY2FwdHVyZWQtc2VsZWN0b3Igc2V0IHNvIHRoZSBjb250ZW50IHNjcmlwdCdzIGhvdmVyIHdhbGtlciBjYW5cbiAgICAvLyByZXNvbHZlIGRlc2NlbmRhbnRzIOKGkiBjYXB0dXJlZCBhbmNlc3Rvci5cbiAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgc2VuZFRvQ1Moe2tpbmQ6ICdzZXQtY2FwdHVyZWQnLCBzZWxlY3RvcnN9KTtcbiAgICBzY2hlZHVsZUF1dG9zYXZlKCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIERpc2sgYXV0b3NhdmUgKGNyYXNoL3JlaW5zdGFsbCBzYWZldHkgbmV0KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ2FwdHVyZXMgKyBjb21tZW50cyBvdGhlcndpc2UgbGl2ZSBPTkxZIGluIGNocm9tZS5zdG9yYWdlIHVudGlsIGFuXG4gIC8vIGV4cG9ydC4gY2hyb21lLnN0b3JhZ2UgaXMgcGVyLWV4dGVuc2lvbi1pbnN0YW5jZSwgc28gYSBSZW1vdmUrcmUtYWRkIG9mXG4gIC8vIGFuIHVucGFja2VkIGJ1aWxkIChuZXcgZXh0ZW5zaW9uIGlkKSDigJQgb3IgYSBzdG9yYWdlIGNsZWFyIOKAlCBzaWxlbnRseVxuICAvLyB3aXBlcyBldmVyeSB3b3Jrc3BhY2UsIGFuZCB0aGUgb24tZGlzayBzY3JlZW5zaG90cyBiZWNvbWUgb3JwaGFucyB3aXRoXG4gIC8vIG5vIGFubm90YXRpb25zLiBUaGlzIGRlYm91bmNlZCBtaXJyb3Igd3JpdGVzIHRoZSB3b3Jrc3BhY2UgSlNPTkwgdG9cbiAgLy8gRG93bmxvYWRzL3BpbmNoZ3JhYi88d3M+Lzx3cz4uYXV0b3NhdmUuanNvbmwgKHJpZ2h0IGJlc2lkZSBzY3JlZW5zaG90cy8pXG4gIC8vIHNvIHRoZSB3b3JrIGlzIGFsd2F5cyByZWNvdmVyYWJsZSBieSBJbXBvcnQsIGluZGVwZW5kZW50IG9mIHRoZVxuICAvLyBleHRlbnNpb24ncyBzdG9yYWdlLiBPdmVyd3JpdGVzIGluIHBsYWNlOyBRdWlldCBzYXZlcyBzdXBwcmVzc2VzIHRoZVxuICAvLyBkb3dubG9hZCBwb3B1cC5cbiAgY29uc3QgQVVUT1NBVkVfREVCT1VOQ0VfTVMgPSAxMjAwMDtcbiAgbGV0IGF1dG9zYXZlVGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgdW5kZWZpbmVkO1xuICBsZXQgYXV0b3NhdmVEaXJ0eSA9IGZhbHNlO1xuICBjb25zdCBmbHVzaEF1dG9zYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgIGF1dG9zYXZlRGlydHkgPSBmYWxzZTtcbiAgICBpZiAoYXV0b3NhdmVUaW1lcikgeyBjbGVhclRpbWVvdXQoYXV0b3NhdmVUaW1lcik7IGF1dG9zYXZlVGltZXIgPSB1bmRlZmluZWQ7IH1cbiAgICBpZiAoIWluRXh0ZW5zaW9uIHx8ICFwcmVmcy5hdXRvc2F2ZVRvRGlzayB8fCAhbWVzc2FnZXMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3Qgd3MgPSBhY3RpdmVXcztcbiAgICBjb25zdCBmaWxlbmFtZSA9IGAke3dzfS5hdXRvc2F2ZS5qc29ubGA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKGZpbGVuYW1lLCAnanNvbmwnKTtcbiAgICAgIHZvaWQgc2VuZFRvQmcoe2tpbmQ6ICdzYXZlLXRleHQnLCB3b3Jrc3BhY2U6IHdzLCBmaWxlbmFtZSwgdGV4dCwgbWltZTogJ2FwcGxpY2F0aW9uL2pzb25sJywgc3ViZGlyOiAnJ30pO1xuICAgIH0gY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oTE9HLCAnYXV0b3NhdmUgZmFpbGVkJywgZXJyKTsgfVxuICB9O1xuICBjb25zdCBzY2hlZHVsZUF1dG9zYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24gfHwgIXByZWZzLmF1dG9zYXZlVG9EaXNrKSByZXR1cm47XG4gICAgYXV0b3NhdmVEaXJ0eSA9IHRydWU7XG4gICAgaWYgKGF1dG9zYXZlVGltZXIpIHJldHVybjsgLy8gb25lIHdyaXRlIHBlciBkZWJvdW5jZSB3aW5kb3dcbiAgICBhdXRvc2F2ZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7IGF1dG9zYXZlVGltZXIgPSB1bmRlZmluZWQ7IGlmIChhdXRvc2F2ZURpcnR5KSBmbHVzaEF1dG9zYXZlKCk7IH0sIEFVVE9TQVZFX0RFQk9VTkNFX01TKTtcbiAgfTtcbiAgLy8gRmx1c2ggcGVuZGluZyB3b3JrIHRoZSBtb21lbnQgdGhlIHBhbmVsIGlzIGhpZGRlbi9jbG9zZWQg4oCUIHRoZSBsYXN0XG4gIC8vIGRlYm91bmNlIHdpbmRvdyB3b3VsZCBvdGhlcndpc2UgYmUgbG9zdCBvbiBjbG9zZS5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsICgpID0+IHsgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicgJiYgYXV0b3NhdmVEaXJ0eSkgZmx1c2hBdXRvc2F2ZSgpOyB9KTtcbiAgY29uc3QgcGVyc2lzdFByZWZzID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KFBSRUZTX1NUT1JBR0VfTkFNRSwgcHJlZnMpO1xuICAgIC8vIFB1c2ggdGhlIHN1YnNldCBvZiBwcmVmcyB0aGUgY29udGVudCBzY3JpcHQgY2FyZXMgYWJvdXQgc28gaXRzXG4gICAgLy8gb3ZlcmxheSAoc3BhY2luZyB2aXN1YWxpemVyLCBob3ZlciBzbmFwLCBldGMuKSByZWZsZWN0cyB0aGUgbGF0ZXN0LlxuICAgIHZvaWQgc2VuZFRvQ1Moe1xuICAgICAga2luZDogJ3NldC1jcy1wcmVmcycsXG4gICAgICBzcGFjaW5nT3ZlcmxheTogcHJlZnMuc3BhY2luZ092ZXJsYXksXG4gICAgICBob3ZlclNuYXA6IHByZWZzLmhvdmVyU25hcCxcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICAvLyBGdWxsLXJlc29sdXRpb24gUE5HIHBlcnNpc3RlbmNlIHdpdGggRklGTyBldmljdGlvbi4gZGF0YVVSTCBzdHJpbmdzXG4gIC8vIGNhbiBydW4gNTAtNTAwIEtCIGVhY2g7IHRoZSBkZWZhdWx0IHF1b3RhIGdldHMgZXhoYXVzdGVkIGluIHRlbnMgb2ZcbiAgLy8gY2FwdHVyZXMgd2l0aG91dCBhIGJ1ZGdldC4gTWFwIGluc2VydGlvbiBvcmRlciA9IEZJRk8gb3JkZXIsIHNvXG4gIC8vIHdlIGV2aWN0IGZyb20gdGhlIGZyb250IHVudGlsIHVuZGVyIGJ1ZGdldCBiZWZvcmUgcGVyc2lzdGluZy5cbiAgY29uc3QgZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgZm9yIChjb25zdCB2IG9mIHNob3RzRnVsbC52YWx1ZXMoKSkgdG90YWwgKz0gdi5sZW5ndGg7XG4gICAgbGV0IGV2aWN0ZWQgPSAwO1xuICAgIHdoaWxlICh0b3RhbCA+IFNIT1RTX0ZVTExfQlVER0VUX0JZVEVTKSB7XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHNob3RzRnVsbC5rZXlzKCkubmV4dCgpLnZhbHVlO1xuICAgICAgaWYgKGZpcnN0S2V5ID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgY29uc3QgcmVtb3ZlZCA9IHNob3RzRnVsbC5nZXQoZmlyc3RLZXkpO1xuICAgICAgaWYgKHJlbW92ZWQgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBzaG90c0Z1bGwuZGVsZXRlKGZpcnN0S2V5KTtcbiAgICAgIHRvdGFsIC09IHJlbW92ZWQubGVuZ3RoO1xuICAgICAgZXZpY3RlZCsrO1xuICAgIH1cbiAgICByZXR1cm4gZXZpY3RlZDtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzRnVsbCA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBldmljdGVkID0gZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCgpO1xuICAgIGlmIChldmljdGVkID4gMCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCBgc2hvdHNGdWxsIEZJRk8tZXZpY3RlZCAke2V2aWN0ZWR9IG9sZGVzdCBlbnRyaWVzIHRvIGZpdCAke1NIT1RTX0ZVTExfQlVER0VUX0JZVEVTIC8gMTAyNCAvIDEwMjR9TUIgYnVkZ2V0YCk7XG4gICAgfVxuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzRnVsbCkgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzRnVsbEtleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RXb3Jrc3BhY2VzID0gKCk6IHZvaWQgPT4geyB2b2lkIFN0b3JlLnNldChXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcyk7IH07XG5cbiAgLy8g4pSA4pSA4pSAIFRhYiDih4Qgd29ya3NwYWNlIGJpbmRpbmcgKCMxOCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJhY2tncm91bmQgYW5ub3VuY2VzIGVhY2ggdG9vbGJhci1jbGljayBhY3RpdmF0aW9uIHZpYSAncGctdGFiLWFjdGl2YXRlZCcuXG4gIC8vIFRoZSBmaXJzdCBhY3RpdmF0aW9uIGFkb3B0cyB0aGUgY3VycmVudCB1bmJvdW5kIHdvcmtzcGFjZTsgbGF0ZXIgdGFicyBlYWNoXG4gIC8vIGdldCB0aGVpciBvd24uIFBpY2tpbmcgYSBib3VuZCB3b3Jrc3BhY2UganVtcHMgdGhlIGJyb3dzZXIgdG8gaXRzIHRhYi5cbiAgY29uc3Qgc2x1Z0ZvclRhYiA9ICh1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgY29uc3QgaCA9IG5ldyBVUkwodXJsKS5ob3N0bmFtZS5yZXBsYWNlKC9ed3d3XFwuLywgJycpOyBpZiAoaCkgcmV0dXJuIGg7IH0gY2F0Y2ggeyAvKiBub3QgYSB1cmwgKi8gfVxuICAgIGNvbnN0IHQgPSAodGl0bGUgfHwgJycpLnRyaW0oKTtcbiAgICByZXR1cm4gdCA/IHQuc2xpY2UoMCwgMjQpIDogJ3RhYic7XG4gIH07XG4gIGNvbnN0IHVuaXF1ZVdzTmFtZSA9IChiYXNlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghd29ya3NwYWNlcy5zb21lKCh3KSA9PiB3Lm5hbWUgPT09IGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgICBmb3IgKGxldCBpID0gMjsgOyBpKyspIHsgY29uc3QgbiA9IGAke2Jhc2V9ICR7aX1gOyBpZiAoIXdvcmtzcGFjZXMuc29tZSgodykgPT4gdy5uYW1lID09PSBuKSkgcmV0dXJuIG47IH1cbiAgfTtcbiAgY29uc3Qgb25UYWJBY3RpdmF0ZWQgPSBhc3luYyAoe3RhYklkLCB1cmwsIHRpdGxlfToge3RhYklkOiBudW1iZXI7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nfSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGxldCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy50YWJJZCA9PT0gdGFiSWQpO1xuICAgIGlmICh3cykge1xuICAgICAgaWYgKHdzLnVybCAhPT0gdXJsIHx8IHdzLnRpdGxlICE9PSB0aXRsZSkgeyB3cy51cmwgPSB1cmw7IHdzLnRpdGxlID0gdGl0bGU7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VycmVudCA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBhY3RpdmVXcyk7XG4gICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LnRhYklkID09IG51bGwpIHtcbiAgICAgICAgd3MgPSBjdXJyZW50OyB3cy50YWJJZCA9IHRhYklkOyB3cy51cmwgPSB1cmw7IHdzLnRpdGxlID0gdGl0bGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cyA9IHtuYW1lOiB1bmlxdWVXc05hbWUoc2x1Z0ZvclRhYih1cmwsIHRpdGxlKSksIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0YWJJZCwgdXJsLCB0aXRsZX07XG4gICAgICAgIHdvcmtzcGFjZXMucHVzaCh3cyk7XG4gICAgICB9XG4gICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIH1cbiAgICBpZiAoYWN0aXZlV3MgIT09IHdzLm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod3MubmFtZSk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICAvLyBCcmluZyB0aGUgYnJvd3NlciB0byBhIHdvcmtzcGFjZSdzIGJvdW5kIHRhYiB3aGVuIHRoZSB1c2VyIHBpY2tzIGl0LlxuICBjb25zdCBmb2N1c1dvcmtzcGFjZVRhYiA9IChuYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBuYW1lKTtcbiAgICBpZiAoIWluRXh0ZW5zaW9uIHx8IHdzPy50YWJJZCA9PSBudWxsKSByZXR1cm47XG4gICAgY2hyb21lLnRhYnMudXBkYXRlKHdzLnRhYklkLCB7YWN0aXZlOiB0cnVlfSkudGhlbigodCkgPT4ge1xuICAgICAgaWYgKHQ/LndpbmRvd0lkICE9IG51bGwpIHZvaWQgY2hyb21lLndpbmRvd3M/LnVwZGF0ZSh0LndpbmRvd0lkLCB7Zm9jdXNlZDogdHJ1ZX0pPy5jYXRjaD8uKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgIH0pLmNhdGNoKCgpID0+IHsgLyogdGFiIHdhcyBjbG9zZWQgKi8gfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNuYXBzaG90IC8gdW5kbyAvIHJlZG8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNuYXBzaG90ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdXNwZW5kU25hcHNob3RzKSByZXR1cm47XG4gICAgaWYgKHVuZG9TdGFjay5sZW5ndGggPj0gVU5ET19DQVApIHVuZG9TdGFjay5zaGlmdCgpO1xuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVzdG9yZSA9IChqc29uOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBzdXNwZW5kU25hcHNob3RzID0gdHJ1ZTtcbiAgICB0cnkgeyBtZXNzYWdlcyA9IEpTT04ucGFyc2UoanNvbikgYXMgUGFuZWxNZXNzYWdlW107IH0gY2F0Y2ggeyBtZXNzYWdlcyA9IFtdOyB9XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IGZhbHNlO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcbiAgY29uc3QgdW5kbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXVuZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHVuZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHJlZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZSh1bmRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1VuZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFyZWRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byByZWRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUocmVkb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdSZWRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCB1cGRhdGVVbmRvQnV0dG9ucyA9ICgpOiB2b2lkID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJ1bmRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgdW5kb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwicmVkb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHJlZG9TdGFjay5sZW5ndGggPT09IDApO1xuICB9O1xuICBjb25zdCB1cGRhdGVDb3B5UGF0aEJ1dHRvbiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtYWN0aW9uPVwiY29weS1wYXRoXCJdJyk7XG4gICAgaWYgKCFidG4pIHJldHVybjtcbiAgICBjb25zdCBoYXMgPSBCb29sZWFuKGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoKTtcbiAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCAhaGFzKTtcbiAgICBidG4uZGF0YXNldC50aXAgPSBoYXNcbiAgICAgID8gYENvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC5cXG4ke2xhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoID8/ICcnfWBcbiAgICAgIDogJ0NvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC4gUnVuIGFuIGV4cG9ydCBmaXJzdC4nO1xuICB9O1xuICBjb25zdCBvbkNvcHlQYXRoID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aDtcbiAgICBpZiAoIXBhdGhUb0NvcHkpIHtcbiAgICAgIHNldFN0YXR1cygnTm8gZXhwb3J0IHlldCDigJQgcnVuIGEgZG93bmxvYWQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwYXRoVG9Db3B5KTtcbiAgICAgIC8vIFNob3cgb25seSB0aGUgbGVhZiBmaWxlbmFtZSBpbiB0aGUgc3RhdHVzIOKAlCB0aGUgZnVsbCBXaW5kb3dzLXN0eWxlXG4gICAgICAvLyBhYnNvbHV0ZSBwYXRoIHdvdWxkIGJlIDEwMCsgY2hhcnMgYW5kIHdhcyBkaXNydXB0aW5nIHRoZSBzaWRlYmFyXG4gICAgICAvLyBsYXlvdXQgZm9yIHRoZSAyLXNlY29uZCBzdGF0dXMgVFRMLlxuICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgIHNldFN0YXR1cyhgQ29waWVkIHBhdGggwrcgJHtsZWFmfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIHBhdGgnLCBsZWFmKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCB3cml0ZSBmYWlsZWQ6ICcgKyBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignQ2xpcGJvYXJkIGZhaWxlZCcsIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSkpO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHRvIGFjdGl2ZSB0YWIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRUb0NTID0gYXN5bmMgKHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG1zZyA9IHBnKHBheWxvYWQpO1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgaWYgKHRhYnNbMF0/LmlkICE9IG51bGwpIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIG1zZykuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHsgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiBtc2d9KSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2VuZFRvQ1NBbmRXYWl0ID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8UiB8IG51bGw+ID0+IG5ldyBQcm9taXNlPFIgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnN0IHJlcUlkID0gYHJlcV8ke3NlY3VyZVRva2VuKDEyKX1gO1xuICAgICAgY29uc3Qgb25SZXNwID0gKGU6IEV2ZW50KTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGRldGFpbCA9IChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWw7XG4gICAgICAgIGlmIChkZXRhaWw/Ll9fcmVxSWQgPT09IHJlcUlkKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICAgICAgcmVzb2x2ZShkZXRhaWwucmVwbHkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IHtfX3JlcUlkOiByZXFJZCwgLi4ucGcocGF5bG9hZCl9fSkpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApOyByZXNvbHZlKG51bGwpOyB9LCAxMDAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sICh0YWJzKSA9PiB7XG4gICAgICBpZiAoIXRhYnNbMF0/LmlkKSB7IHJlc29sdmUobnVsbCk7IHJldHVybjsgfVxuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgcGcocGF5bG9hZCksIChyOiBSKSA9PiByZXNvbHZlKHIpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGNvbnN0IHNlbmRUb0JnID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9CZyk6IFByb21pc2U8UiB8IG51bGw+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm4gbnVsbDtcbiAgICB0cnkgeyByZXR1cm4gKGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHBnKHBheWxvYWQpKSkgYXMgUjsgfVxuICAgIGNhdGNoIChlKSB7IHJldHVybiB7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IGFzIHVua25vd24gYXMgUjsgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBSZWNlaXZpbmcgZnJvbSBjb250ZW50IHNjcmlwdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRGVmZW5zaXZlIHJpbmctYnVmZmVyIGRlZHVwZTogZXZlbiB0aG91Z2ggd2Ugbm93IHVzZSBvbmx5IG9uZSBjaGFubmVsLFxuICAvLyBhbnkgbWVzc2FnZSB0aGF0IHNvbWVob3cgYXJyaXZlcyB0d2ljZSB3aXRoaW4gfjIgc2Vjb25kcyBpcyBpZ25vcmVkLlxuICBjb25zdCByZWNlbnRNaWRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBSRUNFTlRfTUlEX0NBUCA9IDY0O1xuICBjb25zdCBvbkNzTWVzc2FnZSA9IChtc2c6IFBnRW52ZWxvcGU8Q3NUb1BhbmVsPik6IHZvaWQgPT4ge1xuICAgIGlmICghbXNnIHx8IG1zZy5fX3BnICE9PSB0cnVlKSByZXR1cm47XG4gICAgaWYgKG1zZy5fX21pZCkge1xuICAgICAgaWYgKHJlY2VudE1pZHMuaW5jbHVkZXMobXNnLl9fbWlkKSkgcmV0dXJuO1xuICAgICAgcmVjZW50TWlkcy5wdXNoKG1zZy5fX21pZCk7XG4gICAgICBpZiAocmVjZW50TWlkcy5sZW5ndGggPiBSRUNFTlRfTUlEX0NBUCkgcmVjZW50TWlkcy5zaGlmdCgpO1xuICAgIH1cbiAgICBpZiAoKG1zZyBhcyB7a2luZD86IHN0cmluZ30pLmtpbmQgPT09ICdwZy10YWItYWN0aXZhdGVkJykge1xuICAgICAgdm9pZCBvblRhYkFjdGl2YXRlZChtc2cgYXMgdW5rbm93biBhcyB7dGFiSWQ6IG51bWJlcjsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmd9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3dpdGNoIChtc2cua2luZCkge1xuICAgICAgY2FzZSAnY2FwdHVyZSc6IG9uQ2FwdHVyZShtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlcic6IG9uSG92ZXIobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXItZW5kJzogb25Ib3ZlckVuZCgpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWFkZCc6IG9uUGVuZGluZ0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWNsZWFyJzogb25QZW5kaW5nQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZmVlZGJhY2stYWRkJzogb25GZWVkYmFja0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwcmVmZXJlbmNlLWNoYW5nZSc6IG9uUHJlZmVyZW5jZUNoYW5nZShtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnfT4pOyByZXR1cm47XG4gICAgICBjYXNlICdwYWdlLXNuYXBzaG90Jzogb25QYWdlU25hcHNob3QoKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdwYWdlLXNuYXBzaG90J30+KS5wYXlsb2FkKTsgcmV0dXJuO1xuICAgICAgZGVmYXVsdDogcmV0dXJuO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvblByZWZlcmVuY2VDaGFuZ2UgPSAoe3JlYXNvbiwgcGFnZX06IHtyZWFzb246IHN0cmluZzsgcGFnZTogYW55fSk6IHZvaWQgPT4ge1xuICAgIGxpdmVUYWJVcmwgPSBwYWdlPy51cmwgPz8gbGl2ZVRhYlVybDtcbiAgICBsaXZlVGFiUGF0aCA9IGxpdmVUYWJVcmwgPyBwYXRoT2YobGl2ZVRhYlVybCkgOiBsaXZlVGFiUGF0aDtcbiAgICAvLyBQYWdlIHJvd3MgYXJlIGNhcHR1cmUgaGVhZGVycywgbm90IGEgdGFiL3BhZ2UgdGVsZW1ldHJ5IGZlZWQuIFRoZSBuZXh0XG4gICAgLy8gc2VsZWN0b3IgY2FwdHVyZSBmcm9tIHRoaXMgcGFnZSB3aWxsIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQvc3RhdGUgYW5kXG4gICAgLy8gaW5zZXJ0IGEgcGFnZSBoZWFkZXIgb25seSBpZiBuZWVkZWQuXG4gICAgc2V0U3RhdHVzKGAke3JlYXNvbn0gY2hhbmdlZGAsIHtraW5kOiAnaW5mbyd9KTtcbiAgfTtcblxuICAvLyBQYWdlLWdyb3VwIHJlY29yZHMgbWF5IGNhcnJ5IGEgZnVsbC1wYWdlIHNuYXBzaG90ICh2aWV3cG9ydCwgc2Nyb2xsXG4gIC8vIGV4dGVudHMsIGRwciwgbGFuZywgZnVsbC1wYWdlIHNjcmVlbnNob3QpLiBQYWdlTWVzc2FnZSBpbiB0eXBlcy50cyBkb2Vzbid0XG4gIC8vIHlldCBkZWNsYXJlIHRoZSBmaWVsZCwgc28gd2Ugd2lkZW4gaXQgbG9jYWxseSDigJQgdGhlIHZhbHVlIHBlcnNpc3RzIHdpdGhcbiAgLy8gdGhlIHJlc3Qgb2YgdGhlIG1lc3NhZ2UgSlNPTiBhbmQgcm91bmQtdHJpcHMgdGhyb3VnaCBleHBvcnQuXG4gIHR5cGUgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QgPSBQYWdlTWVzc2FnZSAmIHtzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH07XG4gIC8vIFNuYXBzaG90cyB0aGF0IGFycml2ZWQgYmVmb3JlIGEgcGFnZS1ncm91cCByZWNvcmQgZXhpc3RzIGZvciB0aGVpciBVUkwuXG4gIC8vIEFwcGxpZWQgd2hlbiB0aGUgcGFnZSBoZWFkZXIgaXMgbGF0ZXIgY3JlYXRlZCAoc2VlIG9uQ2FwdHVyZSkuXG4gIGNvbnN0IHBlbmRpbmdTbmFwc2hvdHMgPSBuZXcgTWFwPHN0cmluZywgUGFnZVNuYXBzaG90PigpO1xuICBjb25zdCBhcHBseVNuYXBzaG90VG9QYWdlID0gKHNuYXA6IFBhZ2VTbmFwc2hvdCk6IGJvb2xlYW4gPT4ge1xuICAgIC8vIEF0dGFjaCB0byB0aGUgbW9zdCByZWNlbnQgcGFnZS1ncm91cCByZWNvcmQgZm9yIHRoaXMgVVJMLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJyAmJiBtLnVybCA9PT0gc25hcC51cmwpIHtcbiAgICAgICAgKG0gYXMgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QpLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3Qgb25QYWdlU25hcHNob3QgPSAocGF5bG9hZDogUGFnZVNuYXBzaG90KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYXlsb2FkPy51cmwpIHJldHVybjtcbiAgICBpZiAoYXBwbHlTbmFwc2hvdFRvUGFnZShwYXlsb2FkKSkge1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHBhZ2UgcmVjb3JkIHlldCDigJQgc3Rhc2ggZm9yIHRoZSBuZXh0IGNhcHR1cmUgb24gdGhpcyBVUkwuXG4gICAgICBwZW5kaW5nU25hcHNob3RzLnNldChwYXlsb2FkLnVybCwgcGF5bG9hZCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uRmVlZGJhY2tBZGQgPSAoe3NlbGVjdG9yLCB0ZXh0LCB1cmwsIHBhcmVudFVpZH06IHtzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfSk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAvLyAgIDEuIHBhcmVudFVpZCDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IHN1cHBsaWVkIGEgc3RhYmxlIHVpZCAodGhlXG4gICAgLy8gICAgICBzdHJvbmdlc3QgbWF0Y2g7IHN1cnZpdmVzIHNlbGVjdG9yIGNoYW5nZXMsIHNpYmxpbmdcbiAgICAvLyAgICAgIGNvbGxpc2lvbnMsIG11bHRpcGxlIGNhcHR1cmVzIG9mIHRoZSBzYW1lIGVsZW1lbnQpLlxuICAgIC8vICAgMi4gc2VsZWN0b3IgKyB1cmwg4oCUIGNvbXBvc2l0ZSBrZXk7IHByZXZlbnRzIGNyb3NzLXBhZ2VcbiAgICAvLyAgICAgIGNvbnRhbWluYXRpb24gd2hlbiB0aGUgc2FtZSBzZWxlY3RvciBleGlzdHMgb24gbXVsdGlwbGUgVVJMcy5cbiAgICAvLyAgIDMuIHNlbGVjdG9yICsgbGl2ZVRhYlVybCDigJQgZmFsbGJhY2sgd2hlbiB0aGUgbWVzc2FnZSBkaWRuJ3RcbiAgICAvLyAgICAgIGNhcnJ5IGFuIGV4cGxpY2l0IHVybCAob2xkZXIgY29udGVudC1zY3JpcHQgbWVzc2FnZXMpLlxuICAgIGxldCBpZHggPSAtMTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnVpZCA9PT0gcGFyZW50VWlkKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnN0IHdhbnRVcmwgPSB1cmwgPz8gbGl2ZVRhYlVybCA/PyBudWxsO1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PlxuICAgICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcidcbiAgICAgICAgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3JcbiAgICAgICAgJiYgKCF3YW50VXJsIHx8IG0uZW50cnkudXJsID09PSB3YW50VXJsKSk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnb25GZWVkYmFja0FkZDogbm8gcGFyZW50IGZvdW5kJywge3NlbGVjdG9yLCB1cmwsIHBhcmVudFVpZH0pO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGxvc3QgaXRzIHBhcmVudCDigJQgY2hlY2sgdGhlIGFjdGl2ZSBjYXB0dXJlJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHBhcmVudE1zZyA9IG1lc3NhZ2VzW2lkeF0gYXMgU2VsZWN0b3JNZXNzYWdlO1xuICAgIGxldCBpbnNlcnRBdCA9IGlkeCArIDE7XG4gICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIG5ldyBmZWVkYmFjayByb3cgc28gdGhlIGV4cG9ydCBjYXJyaWVzXG4gICAgLy8gdGhlIEZLIGxpbmsgZXhwbGljaXRseSAobm90IGp1c3QgYnkgY2FwdHVyZS1hZGphY2VuY3kpLlxuICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICBwYXJlbnRVaWQ6IHBhcmVudE1zZy5lbnRyeS51aWQsXG4gICAgfSk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnQ29tbWVudCBhZGRlZCBmcm9tIHBhZ2UnKTtcbiAgICAvLyBFdmVyeSBmZWVkYmFjayBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LiBJZiB0aGUgcGFyZW50XG4gICAgLy8gY2FwdHVyZSBkaWRuJ3QgZ2V0IG9uZSAoYXV0b1NjcmVlbnNob3Qgb2ZmLCBza2lwU2NyZWVuc2hvdEhvc3RzXG4gICAgLy8gaGl0LCBuZXR3b3JrIGdsaXRjaCksIHJlLWZpcmUgbm93LlxuICAgIGlmICghcGFyZW50TXNnLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudE1zZyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUGVuZGluZ0FkZCA9ICh7ZW50cnl9OiB7ZW50cnk6IEVudHJ5fSk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkucHVzaChlbnRyeSk7IHJlbmRlcigpOyB9O1xuICBjb25zdCBvblBlbmRpbmdDbGVhciA9ICgpOiB2b2lkID0+IHsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyB9O1xuXG4gIGNvbnN0IGZpbmREdXBsaWNhdGUgPSAoc2VsZWN0b3I6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT5cbiAgICBtZXNzYWdlcy5maW5kKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT5cbiAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvciAmJiAoIXVybCB8fCBtLmVudHJ5LnVybCA9PT0gdXJsKSk7XG5cbiAgLy8gRmluZCBhbiBleGlzdGluZyBjYXB0dXJlIGZvciB0aGUgYWN0aXZlIHRhYiArIHNlbGVjdG9yLiBDcm9zcy1wYWdlXG4gIC8vIGNvbnRhbWluYXRpb24gcHJldmVudGlvbiAoc2VlIHR5cGVzLnRzIGZlZWRiYWNrLWFkZCBkb2NzdHJpbmcpOlxuICAvLyBhIHNlbGVjdG9yIGFsb25lIGlzIE5PVCBhIHN0YWJsZSBpZGVudGl0eSDigJQgYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gXG4gIC8vIGV4aXN0cyBvbiBldmVyeSBwYWdlOyBgYnV0dG9uYCBpcyBldmVyeXdoZXJlLiBTdHJvbmcgaWRlbnRpdHkgaXNcbiAgLy8gKHNlbGVjdG9yICsgdXJsKS4gUmV0dXJucyB0aGUgbW9zdCByZWNlbnQgbWF0Y2ggc28gcmUtaG92ZXJpbmcgYW5cbiAgLy8gYWxyZWFkeS1jYXB0dXJlZCBlbGVtZW50IHJlc29sdmVzIGNvbnNpc3RlbnRseS5cbiAgY29uc3QgZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZSA9IChzZWxlY3Rvcjogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBjb25zdCB1cmwgPSBsaXZlVGFiVXJsO1xuICAgIC8vIFdhbGsgYmFja3dhcmRzIHNvIHRoZSBtb3N0IHJlY2VudCBtYXRjaGluZyBjYXB0dXJlIHdpbnMgd2hlbiBhXG4gICAgLy8gc2VsZWN0b3IgbGVnaXRpbWF0ZWx5IGhhcyBtdWx0aXBsZSBjYXB0dXJlcyBvbiB0aGUgc2FtZSBwYWdlXG4gICAgLy8gKGUuZy4sIHRoZSB1c2VyIHJlLWNhcHR1cmVkIHRoZSBzYW1lIGVsZW1lbnQgYWZ0ZXIgZWRpdHMpLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSBjb250aW51ZTtcbiAgICAgIGlmICh1cmwgJiYgbS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBjYW5vbmljYWxFbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgdGFnOiBlLnRhZywgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHRleHQ6IGUudGV4dCwgcm9sZTogZS5yb2xlLFxuICAgIGF0dHJzOiBlLmF0dHJzLCBjbGFzc2VzOiBlLmNsYXNzZXMsXG4gICAgcmVjdDogZS5yZWN0LCBvdXRlckhUTUw6IGUub3V0ZXJIVE1MLFxuICAgIHN0eWxlczogZS5zdHlsZXMsIG1hdGNoZWRSdWxlczogZS5tYXRjaGVkUnVsZXMsXG4gIH0pO1xuXG4gIGNvbnN0IG9uQ2FwdHVyZSA9ICh7ZW50cnksIHBhZ2UsIGdyb3VwZWR9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdjYXB0dXJlJ30+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFlbnRyeSB8fCAhcGFnZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2UudXJsO1xuICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKHBhZ2UudXJsKTtcbiAgICBpZiAoZ3JvdXBlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgICAgZ3JvdXAucHVzaChlbnRyeSk7XG4gICAgICAgICAgbS5lbnRyeS5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7IGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgICAgLy8gRmlyZSBhIGdyb3VwIHNob3QgdXNpbmcgdGhlIGhlYWQgKyBtZW1iZXJzLiBUaGUgaGVhZCdzIHNlbGVjdG9yXG4gICAgICAgICAgLy8gaXMgbS5lbnRyeS5zZWxlY3RvcjsgbWVtYmVycycgc2VsZWN0b3JzIGFyZSBpbiB0aGUgZnJlc2hseVxuICAgICAgICAgIC8vIG11dGF0ZWQgZ3JvdXAgYXJyYXkuXG4gICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW20uZW50cnkuc2VsZWN0b3IsIC4uLihtLmVudHJ5Lmdyb3VwID8/IFtdKS5tYXAoKGcpID0+IGcuc2VsZWN0b3IpXTtcbiAgICAgICAgICB2b2lkIGZpcmVHcm91cFNob3QobSwgc2VsZWN0b3JzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRHVwZSBkZXRlY3Rpb24uIENyb3NzLWNvbnRhbWluYXRpb24gZml4OiBhIChzZWxlY3RvciwgdXJsKSBtYXRjaFxuICAgIC8vIGlzIE5FQ0VTU0FSWSBidXQgbm90IFNVRkZJQ0lFTlQg4oCUIHR3byBzaWJsaW5nIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgLy8gc2FtZSB0ZXN0SWQgLyBzYW1lIHJvbGUvYXJpYSBzZWxlY3RvciBsaXZlIG9uIHRoZSBzYW1lIFVSTCBidXRcbiAgICAvLyBhcmUgZGlmZmVyZW50IGNhcHR1cmVzLiBDb21wYXJlIHRoZSBjYW5vbmljYWwtZW50cnkgaGFzaCAod2hpY2hcbiAgICAvLyBpbmNsdWRlcyByZWN0LCB0ZXh0LCBvdXRlckhUTUwsIGV0Yy4pIGJlZm9yZSB0cmVhdGluZyB0aGUgbmV3XG4gICAgLy8gY2FwdHVyZSBhcyBhIHJlZnJlc2ggb2YgdGhlIG9sZCBvbmUuIFdoZW4gdGhlIGhhc2ggZGlmZmVycywgd2VcbiAgICAvLyBrZWVwIEJPVEggY2FwdHVyZXMgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcuXG4gICAgY29uc3QgZHVwZSA9IGZpbmREdXBsaWNhdGUoZW50cnkuc2VsZWN0b3IsIGVudHJ5LnVybCk7XG4gICAgaWYgKGR1cGUpIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IGNhbm9uaWNhbEVudHJ5KGR1cGUuZW50cnkpO1xuICAgICAgY29uc3QgYWZ0ZXIgPSBjYW5vbmljYWxFbnRyeShlbnRyeSk7XG4gICAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBIYXNoZXMgZGlmZmVyLiBUd28gY2FzZXM6XG4gICAgICAvLyAgIChhKSBTYW1lIGVsZW1lbnQgcmUtY2FwdHVyZWQgYWZ0ZXIgY29udGVudCBjaGFuZ2Ug4oCUIHRoZSByZWN0XG4gICAgICAvLyAgICAgICBzdGF5cyBwdXQgKHdpdGhpbiBhIGZldyBweCksIGJ1dCB0ZXh0L291dGVySFRNTCBtb3ZlZC5cbiAgICAgIC8vICAgICAgIFRyZWF0IGFzIGEgcmVmcmVzaC5cbiAgICAgIC8vICAgKGIpIERpZmZlcmVudCBlbGVtZW50IHRoYXQgaGFwcGVucyB0byBzaGFyZSBhIHNlbGVjdG9yIOKAlCB0aGVcbiAgICAgIC8vICAgICAgIHJlY3QgaXMgaW4gYSBkaWZmZXJlbnQgcG9zaXRpb24uIFRyZWF0IGFzIGEgbmV3IGNhcHR1cmUuXG4gICAgICAvLyBXZSBkaXNjcmltaW5hdGUgYnkgcmVjdCBvdmVybGFwOiBpZiBib3RoIHJlY3RzIGV4aXN0IGFuZCB0aGVpclxuICAgICAgLy8gY2VudGVycyBhcmUgd2l0aGluIDhweCBvbiBib3RoIGF4ZXMsIHJlZnJlc2g7IG90aGVyd2lzZSBrZWVwXG4gICAgICAvLyBib3RoLlxuICAgICAgY29uc3QgcjEgPSBkdXBlLmVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCByMiA9IGVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCBzYW1lRWxlbWVudCA9IHIxICYmIHIyXG4gICAgICAgICYmIE1hdGguYWJzKChyMS54ICsgcjEudyAvIDIpIC0gKHIyLnggKyByMi53IC8gMikpIDw9IDhcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnkgKyByMS5oIC8gMikgLSAocjIueSArIHIyLmggLyAyKSkgPD0gODtcbiAgICAgIGlmIChzYW1lRWxlbWVudCkge1xuICAgICAgICBkZWxldGUgZHVwZS5kdXBlUGVuZGluZztcbiAgICAgICAgZHVwZS5lbnRyeSA9IGVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFVwZGF0ZWQgIyR7ZHVwZS5lbnRyeS5ufWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlmZmVyZW50IGVsZW1lbnQgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciDihpIgZmFsbCB0aHJvdWdoIGFuZFxuICAgICAgLy8gZW1pdCBhcyBhIG5ldyBjYXB0dXJlLiBUaGUgYWdlbnQgcmVhZGluZyB0aGUgZXhwb3J0IHNlZXMgYm90aFxuICAgICAgLy8gcm93cyB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIGJ1dCBkaWZmZXJlbnQgdWlkcyArIHJlY3RzLlxuICAgIH1cbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCB0aGUgc2Vzc2lvbiBGSyBzbyB0aGUgY29uc3VtZXIgY2FuIGpvaW4gZW50cmllcyB0byB0aGVpclxuICAgIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLlxuICAgIGlmIChzZXNzaW9uSWQpIGVudHJ5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICBjb25zdCBuZXdNc2c6IFNlbGVjdG9yTWVzc2FnZSA9IHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzLCBlbnRyeX07XG4gICAgLy8gUGFnZSByb3dzIGV4aXN0IG9ubHkgYXMgaGVhZGVycyBmb3IgY2FwdHVyZWQgc2VsZWN0b3JzLiBEbyBub3QgY3JlYXRlXG4gICAgLy8gdGhlbSBmcm9tIHRhYiBhY3RpdmF0aW9uLCB2YWxpZGF0aW9uLCBvciBwcmVmZXJlbmNlIGNoYW5nZXM7IGluc2VydCBvbmVcbiAgICAvLyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGZpcnN0IHNlbGVjdG9yIG9mIGEgbmV3IHBhZ2UgYmxvY2suXG4gICAgbGV0IHByZXZpb3VzUGFnZTogUGFnZU1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gcG9zaXRpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJykgeyBwcmV2aW91c1BhZ2UgPSBtOyBicmVhazsgfVxuICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzUGFnZSB8fCBwcmV2aW91c1BhZ2UudXJsICE9PSBwYWdlLnVybCkge1xuICAgICAgY29uc3QgcGFnZU1zZzogUGFnZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHVybDogcGFnZS51cmwsIHRpdGxlOiBwYWdlLnRpdGxlLCB2aWV3cG9ydDogcGFnZS52aWV3cG9ydCwgdG9rZW5zOiBwYWdlLnRva2VucyxcbiAgICAgICAgdXNlckFnZW50OiBwYWdlLnVzZXJBZ2VudCwgbGFuZzogcGFnZS5sYW5nLFxuICAgICAgICBnaXRDb250ZXh0OiAocGFnZSBhcyBhbnkpLmdpdENvbnRleHQsXG4gICAgICAgIHJvdXRlOiAocGFnZSBhcyBhbnkpLnJvdXRlLFxuICAgICAgICBzdGF0ZTogKHBhZ2UgYXMgYW55KS5zdGF0ZSxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgfTtcbiAgICAgIC8vIEF0dGFjaCBhbnkgcGFnZS1zbmFwc2hvdCB0aGF0IGFycml2ZWQgYmVmb3JlIHRoaXMgcGFnZSBoZWFkZXIgZXhpc3RlZC5cbiAgICAgIGNvbnN0IHBlbmRpbmcgPSBwZW5kaW5nU25hcHNob3RzLmdldChwYWdlLnVybCk7XG4gICAgICBpZiAocGVuZGluZykge1xuICAgICAgICAocGFnZU1zZyBhcyBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCkuc25hcHNob3QgPSBwZW5kaW5nO1xuICAgICAgICBwZW5kaW5nU25hcHNob3RzLmRlbGV0ZShwYWdlLnVybCk7XG4gICAgICB9XG4gICAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIHBhZ2VNc2cpO1xuICAgICAgcG9zaXRpb24rKztcbiAgICB9XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBuZXdNc2cpO1xuICAgIHBlcnNpc3QoKTtcbiAgICAvLyBJbnRlbnRpb25hbGx5IE5PIHNldExhc3RBY3RpdmUoZW50cnkuc2VsZWN0b3IpIGhlcmUg4oCUIHRoZSB1c2VyIGFza2VkXG4gICAgLy8gZm9yIGZyZXNoIGNhcHR1cmVzIHRvIHN0YXkgdW4taGlnaGxpZ2h0ZWQgaW4gdGhlIHNpZGViYXIuIFRoZSBzdGlja3lcbiAgICAvLyByaW5nICsgbGFzdC1hY3RpdmUgb3V0bGluZSBub3cgb25seSBnZXQgYXBwbGllZCBvbiBleHBsaWNpdFxuICAgIC8vIGhvdmVyL2NsaWNrIG9mIHRoZSBzaWRlYmFyIGJ1YmJsZSAoYW5kIHRoZSBwYWdlLXNpZGUgZmxhc2ggZnJvbVxuICAgIC8vIGNhcHR1cmVFbnRyeSBzdGlsbCBjb25maXJtcyB0aGUgY2FwdHVyZSB2aXN1YWxseSBvbiB0aGUgcGFnZSkuXG4gICAgcmVuZGVyKCk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChuZXdNc2cpO1xuICAgIHZvaWQgZmlyZVBhZ2VTaG90SWZOZWVkZWQobmV3TXNnKTtcbiAgICB2b2lkIHJ1blZhbGlkYXRpb24oKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU2NyZWVuc2hvdCB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEZpcmUgdGhlIHBlci1lbGVtZW50IHNob3QsIGF0dGFjaCB0aGUgcmV0dXJuZWQgZmlsZW5hbWUgKyBkYXRhVXJsIG9udG9cbiAgLy8gdGhlIGVudHJ5LCBhbmQgcGVyc2lzdC4gc2hvdWxkU2tpcFNjcmVlbnNob3QgYmFpbHMgb24gaG9zdHMgaW4gdGhlXG4gIC8vIHVzZXIncyBza2lwIGxpc3Q7IGF1dG9TY3JlZW5zaG90PWZhbHNlIGJhaWxzIGdsb2JhbGx5LlxuICBjb25zdCBmaXJlRWxlbWVudFNob3QgPSBhc3luYyAobXNnOiBTZWxlY3Rvck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogYXV0b1NjcmVlbnNob3Q9ZmFsc2UnKTtcbiAgICAgIC8vIEJ1ZyAjMjogdGVsbCB0aGUgZXhwb3J0IHdoeSB0aGUgc2hvdCBpcyBtaXNzaW5nLlxuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7Li4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSwgdW5hdmFpbGFibGVSZWFzb246ICdhdXRvU2NyZWVuc2hvdE9mZid9O1xuICAgICAgLy8gUmUtcmVuZGVyIHNvIHRoZSByZXNlcnZlZCBza2VsZXRvbiAod2hpY2ggYXNzdW1lZCBhIHNob3Qgd2FzIGNvbWluZylcbiAgICAgIC8vIGNvbGxhcHNlcyBub3cgdGhhdCB3ZSBrbm93IG9uZSB3b24ndCBhcnJpdmUuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogaG9zdCBvbiBza2lwIGxpc3QnLCBtc2cuZW50cnkudXJsKTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnc2tpcFNjcmVlbnNob3RIb3N0cyd9O1xuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCDihpInLCBtc2cuZW50cnkuc2VsZWN0b3IpO1xuICAgIC8vIFNXIGNvbGQtc3RhcnQgcmFjZTogdGhlIEZJUlNUIGNhcHR1cmUgaW4gYSBzZXNzaW9uIG9mdGVuIGxvc2VzIGl0c1xuICAgIC8vIGZpcnN0IG1lc3NhZ2UgYmVjYXVzZSB0aGUgYmcgd29ya2VyIGlzIHN0aWxsIHN0YXJ0aW5nLiBSZXRyeSBvbmNlXG4gICAgLy8gYWZ0ZXIgYSBzaG9ydCBkZWxheSBpZiB0aGUgZmlyc3QgY2FsbCBjb21lcyBiYWNrIG51bGwvZW1wdHkuXG4gICAgbGV0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseSB8fCAoIXJlcGx5Lm9rICYmICFyZXBseS5lcnJvcikpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcnN0IHNjcmVlbnNob3QgcmVwbHkgd2FzIGVtcHR5OyByZXRyeWluZyBhZnRlciAyMDBtcyAoU1cgY29sZC1zdGFydCknKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIDIwMCkpO1xuICAgICAgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCByZXBseTonLCByZXBseSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSB7XG4gICAgICBzZXRTdGF0dXMoYFNjcmVlbnNob3QgZmFpbGVkOiAke3JlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJ31gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgdW5hdmFpbGFibGVSZWFzb246IHJlcGx5Py5lcnJvciA/PyAnY2FwdHVyZUZhaWxlZCcsXG4gICAgICB9O1xuICAgICAgLy8gQ29sbGFwc2UgdGhlIHJlc2VydmVkIHNrZWxldG9uIOKAlCBubyBzaG90IGlzIGNvbWluZyBmb3IgdGhpcyBjYXB0dXJlLlxuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFN1Y2Nlc3NmdWwgcmV0cnkg4oCUIHN0cmlwIGFueSBwcmlvciB1bmF2YWlsYWJsZVJlYXNvbiBzaW5jZSB3ZSBub3dcbiAgICAvLyBoYXZlIGEgcmVhbCBzaG90LlxuICAgIGRlbGV0ZSBtc2cuZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZWxlbWVudDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAuLi4ocmVwbHkuY3JvcCA/IHtjcm9wOiByZXBseS5jcm9wfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaXJlIHRoZSBncm91cCBzaG90ICh1bmlvbiBiYm94IG9mIGhlYWQgKyBhbGwgbWVtYmVycykgYW5kIHN0YXNoIHRoZVxuICAvLyBmaWxlbmFtZSBvbiB0aGUgaGVhZC1vZi1ncm91cCBlbnRyeS5cbiAgY29uc3QgZmlyZUdyb3VwU2hvdCA9IGFzeW5jIChoZWFkOiBTZWxlY3Rvck1lc3NhZ2UsIHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KGhlYWQuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1ncm91cCcsIHNlbGVjdG9ycywgbjogaGVhZC5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIGhlYWQuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihoZWFkLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZ3JvdXA6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkgeyBzaG90c0Z1bGwuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTsgcGVyc2lzdFNob3RzRnVsbCgpOyB9XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIFBhZ2UtbGV2ZWwgc2hvdCBvbmNlIHBlciAod29ya3NwYWNlLCBwYWdlLXVybCwgZGF5KS4gU3Vic2VxdWVudCBjYXB0dXJlc1xuICAvLyBvbiB0aGUgc2FtZSBwYWdlIHJldXNlIHRoZSBzYW1lIG9uLWRpc2sgZmlsZSBwYXRoLlxuICBjb25zdCBmaXJlUGFnZVNob3RJZk5lZWRlZCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICAvLyBQZXItY2FwdHVyZSBwYWdlLXNob3QgbW9kZSAowqc0LjUpOiB3aGVuIGVuYWJsZWQsIHNraXAgdGhlXG4gICAgLy8gcGVyLSh3b3Jrc3BhY2UsIHVybCkgZGVkdXBlIGFuZCBmaXJlIGEgZnJlc2ggcGFnZSBzaG90IGV2ZXJ5IHRpbWUuXG4gICAgLy8gVXNlZnVsIHdoZW4gdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzIChtb2RhbCBvcGVucyxcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3csIGV0Yy4pIGFuZCB0aGUgdXNlciB3YW50cyB0byBzZWUgdGhlIHdob2xlIHBhZ2UgYXRcbiAgICAvLyBlYWNoIHN0ZXAuIENvc3RzIG9uZSBmdWxsLXBhZ2UgUE5HIHBlciBjYXB0dXJlLCBzbyBkZWZhdWx0IG9mZi5cbiAgICBpZiAoIXByZWZzLnBhZ2VTaG90UGVyQ2FwdHVyZSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFnZVNob3RLZXkobXNnLmVudHJ5LnVybCk7XG4gICAgICBpZiAocGFnZVNob3RzRmlyZWQuaGFzKGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kRXhpc3RpbmdQYWdlU2hvdChtc2cuZW50cnkudXJsKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICAgICAgcGFnZTogZXhpc3RpbmcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGFnZVNob3RzRmlyZWQuYWRkKGtleSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1wYWdlJywgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgLy8gQXBwbHkgdG8gVEhJUyBlbnRyeSBhbmQgdG8gYW55IG90aGVyIGVudHJpZXMgYWxyZWFkeSBjYXB0dXJlZCBvbiB0aGVcbiAgICAvLyBzYW1lIFVSTCB0b2RheSAoc28gdGhlIHBhZ2Utc2hvdCBhcHBlYXJzIHVuaWZvcm1seSkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gbXNnLmVudHJ5LnVybCkgY29udGludWU7XG4gICAgICBtLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICBwYWdlOiByZXBseS5maWxlbmFtZSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFN0YXNoIHRoZSBmdWxsIFBORyBzbyB0aGUgd29ya3NwYWNlIGFyY2hpdmUgY2FuIGJ1bmRsZSBpdC4gS2V5ZWRcbiAgICAvLyBieSBVUkwgc2luY2UgcGFnZSBzaG90cyBhcmUgcGFnZS1zY29wZWQsIG5vdCBzZWxlY3Rvci1zY29wZWQuXG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KCdwYWdlOjonICsgbXNnLmVudHJ5LnVybCwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmluZCBhbnkgc2VsZWN0b3IgZW50cnkgb24gdGhpcyBVUkwgdGhhdCBhbHJlYWR5IGhhcyBhIGBwYWdlYCBzaG90XG4gIC8vIHJlY29yZGVkIOKAlCB1c2VkIHNvIHRoYXQgcmV0cm9hY3RpdmUgY2FwdHVyZXMgaW5oZXJpdCB0aGUgZXhpc3RpbmcgUE5HXG4gIC8vIHBhdGggaW5zdGVhZCBvZiByZWZpcmluZy5cbiAgY29uc3QgZmluZEV4aXN0aW5nUGFnZVNob3QgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgcmV0dXJuIG0uZW50cnkuc2NyZWVuc2hvdC5wYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBvbkhvdmVyID0gKHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTogdm9pZCA9PiB7XG4gICAgc2V0U3RhdHVzKGBBbHQtaG92ZXIgwrcgJHtsYWJlbH1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgLy8gSWRlbnRpdHkgaXMgKHNlbGVjdG9yLCB1cmwpLiBTYW1lIHNlbGVjdG9yIG9uIHR3byBkaWZmZXJlbnQgVVJMc1xuICAgIC8vIGlzIHR3byBkaWZmZXJlbnQgY2FwdHVyZXM7IHRoZSBwcmV2aW91cyBzZWxlY3Rvci1vbmx5IGxvb2t1cFxuICAgIC8vIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi4gUHJlZmVyIHNhbWUtVVJMICtcbiAgICAvLyBzYW1lLXNlbGVjdG9yIGFzIHRoZSBzdHJvbmdlc3QgbWF0Y2guXG4gICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSBzY3JvbGxNZXNzYWdlSW50b1ZpZXcoZXhpc3RpbmcuaWQpO1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihleGlzdGluZy5pZCk7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7dWlkOiBleGlzdGluZy5lbnRyeS51aWQsIG46IGV4aXN0aW5nLmVudHJ5Lm4sIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFja319KTtcbiAgICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXIoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBTFdBWVMgc2hvdyB0aGUgY29tbWVudCBib3gsIGV2ZW4gZm9yIHVuY2FwdHVyZWQgZWxlbWVudHMuIE9uIHN1Ym1pdFxuICAgICAgLy8gdGhlIGNvbnRlbnQgc2NyaXB0IHdpbGwgY2FwdHVyZSB0aGUgZWxlbWVudCBmaXJzdCwgdGhlbiBhdHRhY2ggdGhlXG4gICAgICAvLyBjb21tZW50IOKAlCB0dXJuaW5nIGhvdmVyLWNvbW1lbnQgaW50byBhIGNhcHR1cmUrY29tbWVudCBzaG9ydGN1dC5cbiAgICAgIHBoYW50b21UYXJnZXQgPSB7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3Q6IHJlY3QgYXMgdW5rbm93biBhcyBET01SZWN0fTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHtjYXB0dXJlZDogZmFsc2UsIGZlZWRiYWNrOiBbXX19KTtcbiAgICAgIHJlbmRlclBoYW50b20oKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudD8uc3RhcnRzV2l0aCgnQWx0LWhvdmVyJykpIHN0YXR1cy50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXJQaGFudG9tKCk7IH1cbiAgICAvLyBObyBhbm5vdGF0aW9uLWNsZWFyIGhlcmUg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBrZWVwcyB0aGUgYm94IG9wZW4gc28gdGhlXG4gICAgLy8gdXNlciBjYW4gbW91c2UgdG8gaXQgYW5kIHR5cGUuIE91dHNpZGUtY2xpY2sgLyBFc2MgZGlzbWlzcyBpdC5cbiAgfTtcblxuICBjb25zdCBjb2xsZWN0RmVlZGJhY2tBZnRlciA9IChzZWxlY3RvcklkOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKCFmb3VuZCkgeyBpZiAobS5pZCA9PT0gc2VsZWN0b3JJZCkgZm91bmQgPSB0cnVlOyBjb250aW51ZTsgfVxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyB8fCBtLnR5cGUgPT09ICdwYWdlJykgYnJlYWs7XG4gICAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSBvdXQucHVzaChtLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IGNlbnRlckVsZW1lbnRJbkxpc3QgPSAoZWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgbGlzdFJlY3QgPSBsaXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRhcmdldCA9IGxpc3Quc2Nyb2xsVG9wICsgZWxSZWN0LnRvcCAtIGxpc3RSZWN0LnRvcCAtIChsaXN0LmNsaWVudEhlaWdodCAvIDIpICsgKGVsUmVjdC5oZWlnaHQgLyAyKTtcbiAgICBsaXN0LnNjcm9sbFRvKHt0b3A6IE1hdGgubWF4KDAsIHRhcmdldCksIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICB9O1xuXG4gIGNvbnN0IHNjcm9sbE1lc3NhZ2VJbnRvVmlldyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGNlbnRlckVsZW1lbnRJbkxpc3QoZWwpO1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoLWludG8tdmlldycpO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gtaW50by12aWV3Jyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0aWNreSBoaWdobGlnaHQgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2V0TGFzdEFjdGl2ZSA9IChzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhcm1TdGlja3lFeHBpcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBzdGlja3lUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcGFuZWxIb3ZlcmVkKSB7XG4gICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yLmxhc3QtYWN0aXZlJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtYWN0aXZlJyk7XG4gICAgICB9IGVsc2UgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSwgU1RJQ0tZX1RUTF9NUyk7XG4gIH07XG5cbiAgLy8gRmFzdCBzdGlja3ktY2xlYXI6IHdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBwYW5lbCwgZmlyZVxuICAvLyBzdGlja3ktY2xlYXIgYWZ0ZXIgYSAzMDAgbXMgZ3JhY2Ugd2luZG93LiBQcmlvciBiZWhhdmlvciB3YWl0ZWQgdGhlXG4gIC8vIGZ1bGwgU1RJQ0tZX1RUTF9NUyAofjUgcykgd2hpY2ggZmVsdCBsaWtlIHRoZSBwYWdlLXNpZGUgaGlnaGxpZ2h0XG4gIC8vIFwiZG9lc24ndCBnbyBhd2F5IGV2ZW4gYWZ0ZXIgSSB1bmhvdmVyXCIuIDMwMCBtcyBpcyBzaG9ydCBlbm91Z2ggdG9cbiAgLy8gZmVlbCByZXNwb25zaXZlIGJ1dCBsb25nIGVub3VnaCB0aGF0IGEgcXVpY2sgcmVwb3NpdGlvbiAoZS5nLlxuICAvLyBhY2NpZGVudGFsbHkgY3Jvc3NpbmcgdGhlIHNlYW0pIGRvZXNuJ3Qga2lsbCB0aGUgcmluZyBtaWQtZmxpZ2h0LlxuICBsZXQgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSB0cnVlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSB7IGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTsgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7IH1cbiAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgfSk7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpO1xuICAgIHN0aWNreUNsZWFyR3JhY2UgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgLy8gQWxzbyBkcm9wIG91ciBvd24gZnJvbS1wYW5lbCArIG11bHRpIHJpbmdzIGluIGNhc2UgdGhleSBsZWFrZWQuXG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGVpciBtb3VzZSBpbnRvIHRoZSBwYW5lbCwgc3VwcHJlc3MgcGFnZS1zaWRlXG4gICAgLy8gYWx0LWhvdmVyIHN0YXRlIHNvIHRoZSBvcmFuZ2UgcmluZyBkb2Vzbid0IGtlZXAgZm9sbG93aW5nIHRoZSBjdXJzb3IuXG4gICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgUmVuZGVyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBORUFSX0JPVFRPTV9QWCA9IDgwO1xuICBjb25zdCB3YXNOZWFyQm90dG9tID0gKCk6IGJvb2xlYW4gPT5cbiAgICBsaXN0LnNjcm9sbEhlaWdodCAtIGxpc3Quc2Nyb2xsVG9wIC0gbGlzdC5jbGllbnRIZWlnaHQgPD0gTkVBUl9CT1RUT01fUFg7XG5cbiAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9IChtOiBQYW5lbE1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAvLyBNYXRjaCBhZ2FpbnN0IHRoZSBXSE9MRSBlbnRyeSAoc2VsZWN0b3IsIHRleHQsIGNsYXNzZXMsIGF0dHJzLFxuICAgICAgLy8gb3V0ZXJIVE1MLCBzdHlsZXMsIGV0Yy4pIHNvIHNlYXJjaCBoaXRzIGFueXRoaW5nIHZpc2libGUgaW4gdGhlXG4gICAgICAvLyBib2R5LWpzb24uIFN0cmluZ2lmeWluZyBvbmNlIGlzIGZpbmUg4oCUIHRoZSBjb3N0IGlzIHRpbnkgdnMgcmVuZGVyLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgfVxuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIChtLnVybCArICcgJyArIChtLnRpdGxlID8/ICcnKSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSBidWJibGUncyBib2R5LWpzb24gKG9yIG91dGVySFRNTCkgY29udGFpbnMgdGhlIHNlYXJjaCDigJRcbiAgLy8gdGVsbHMgcmVuZGVyU2VsZWN0b3IgdG8gYXV0by1leHBhbmQgc28gdGhlIHVzZXIgc2VlcyB0aGUgaGlnaGxpZ2h0ZWQgaGl0LlxuICBjb25zdCBib2R5TWF0Y2hlc1NlYXJjaCA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG0uZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0UmFpbCA9IChiZWZvcmVJZDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnaW5zZXJ0LXJhaWwnO1xuICAgIGRpdi5kYXRhc2V0LmJlZm9yZUlkID0gYmVmb3JlSWQ7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50ID09PSBiZWZvcmVJZCkge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICBkaXYuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTsgcmVuZGVyKCk7IH0sXG4gICAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4gc2VuZElubGluZSh0ZXh0KSxcbiAgICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidG4uY2xhc3NOYW1lID0gJ2FkZC1idG4nO1xuICAgICAgYnRuLmRhdGFzZXQudGlwID0gJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZSc7XG4gICAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZScpO1xuICAgICAgYnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygncGx1cycsIDEyKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBiZWZvcmVJZDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlOyByZW5kZXIoKTsgfSk7XG4gICAgICBkaXYuYXBwZW5kKGJ0bik7XG4gICAgfVxuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgdHlwZSBJbmxpbmVDb21tZW50T3B0cyA9IHtcbiAgICBpbml0aWFsPzogc3RyaW5nO1xuICAgIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDtcbiAgICBvblN1Ym1pdD86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgYXV0b2ZvY3VzPzogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgYnVpbGRJbmxpbmVDb21tZW50ID0gKHtpbml0aWFsID0gJycsIG9uQ2FuY2VsLCBvblN1Ym1pdCwgYXV0b2ZvY3VzfTogSW5saW5lQ29tbWVudE9wdHMpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXAuY2xhc3NOYW1lID0gJ2lubGluZS1jb21tZW50JztcbiAgICBjb25zdCB0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgdGEudmFsdWUgPSBpbml0aWFsO1xuICAgIHRhLnJvd3MgPSAyO1xuICAgIHRhLnBsYWNlaG9sZGVyID0gJ0luc2VydCBhIGNvbW1lbnQgaGVyZSwgb3IgQWx0K0NsaWNrIHRvIGluc2VydCBhIGNhcHR1cmUnO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncm93JztcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIG1ldGEudGV4dENvbnRlbnQgPSAnMHcgwrcgMHQnO1xuICAgIC8vIEJvdGggU2F2ZSAvIENhbmNlbCBhcmUgdW5pZm9ybSBpY29uIGJ1dHRvbnMgKC5pY29uYnRuKS4gU2F2ZSB1c2VzIHRoZVxuICAgIC8vIHByaW1hcnkgYWNjZW50IHZhcmlhbnQgdmlhIC5wcmltYXJ5IHNvIGl0IHN0aWxsIHBvcHMsIGJ1dCBpdHMgd2lkdGhcbiAgICAvLyBtYXRjaGVzIENhbmNlbCBleGFjdGx5LlxuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIMK3IEVzYyc7XG4gICAgY2FuY2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgaW5saW5lIGNvbW1lbnQnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMjApO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uQ2FuY2VsPy4oKSk7XG4gICAgY29uc3Qgc2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbmQudHlwZSA9ICdidXR0b24nO1xuICAgIHNlbmQuY2xhc3NOYW1lID0gJ2ljb25idG4gcHJpbWFyeSc7XG4gICAgc2VuZC5kYXRhc2V0LnRpcCA9ICdTYXZlIMK3IEVudGVyJztcbiAgICBzZW5kLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdTYXZlIGlubGluZSBjb21tZW50Jyk7XG4gICAgc2VuZC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMjApO1xuICAgIGNvbnN0IHN1Ym1pdCA9ICgpOiB2b2lkID0+IG9uU3VibWl0Py4odGEudmFsdWUpO1xuICAgIHNlbmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXQpO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4geyBtZXRhLnRleHRDb250ZW50ID0gYCR7d29yZENvdW50KHRhLnZhbHVlKX13IMK3ICR7dG9rZW5Db3VudCh0YS52YWx1ZSl9dGA7IH0pO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBvbkNhbmNlbD8uKCk7XG4gICAgfSk7XG4gICAgcm93LmFwcGVuZChtZXRhLCBjYW5jZWwsIHNlbmQpO1xuICAgIHdyYXAuYXBwZW5kKHRhLCByb3cpO1xuICAgIGlmIChhdXRvZm9jdXMpIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0YS5mb2N1cygpKTtcbiAgICByZXR1cm4gd3JhcDtcbiAgfTtcblxuICBjb25zdCBzZW5kSW5saW5lID0gKHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRleHQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgIGlmICghdGV4dCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IGJlZm9yZUlkID0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQ7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGV0IHBvcyA9IGJlZm9yZUlkID8gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBiZWZvcmVJZCkgOiBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKHBvcyA8IDApIHBvcyA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAvLyBwYXJlbnRVaWQgcmVzb2x1dGlvbjogd2FsayBiYWNrIGZyb20gdGhlIGluc2VydCBwb3NpdGlvbiB0byB0aGVcbiAgICAvLyBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3Rvci4gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgdGhlIEZLLlxuICAgIGxldCBwSWR4ID0gcG9zIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfTtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zLCAwLCBmYik7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnSW5zZXJ0ZWQnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQaGFudG9tID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBoYW50b20nKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwaGFudG9tVGFyZ2V0KSByZXR1cm47XG4gICAgY29uc3QgcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwaC5jbGFzc05hbWUgPSAncGhhbnRvbSB2aXNpYmxlJztcbiAgICBwaC5pbm5lckhUTUwgPSBgPGNvZGU+JHtlc2NhcGVIdG1sKHBoYW50b21UYXJnZXQubGFiZWwpfTwvY29kZT5gO1xuICAgIGxpc3QuYXBwZW5kKHBoKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICAvLyBSZW9yZGVyIGEgZmxhdCBtZXNzYWdlIGxpc3Qgc28gc2VsZWN0b3JzIHdpdGhpbiBlYWNoIHBhZ2UtZGVsaW1pdGVkXG4gIC8vIGJsb2NrIGFyZSBzb3J0ZWQgYnkgdGhlaXIgdmlzdWFsIHJlY3QgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KS5cbiAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciAoY2FwdHVyZVxuICAvLyBhZGphY2VuY3kpIHNvIGVkaXRpbmcvdGhyZWFkaW5nIGJlaGF2aW9yIHN1cnZpdmVzIHRoZSBzb3J0LlxuICAvL1xuICAvLyBVc2VkIE9OTFkgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSAoYGJ1aWxkU2xpbWApLCBub3QgdGhlIHNpZGViYXJcbiAgLy8gcmVuZGVyLiBUaGUgc2lkZWJhciBrZWVwcyBtZXNzYWdlcyBpbiBpbnNlcnRpb24vY2FwdHVyZSBvcmRlciBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZW0gd2hlcmUgdGhleSBleHBlY3Q7IHRoZSBleHBvcnQgZ2V0cyB0aGUgYWdlbnQtXG4gIC8vIGZyaWVuZGx5IHJlYWRpbmctb3JkZXIgdHJlYXRtZW50LlxuICBjb25zdCByZW9yZGVyRm9yRXhwb3J0ID0gKG1zZ3M6IFBhbmVsTWVzc2FnZVtdKTogUGFuZWxNZXNzYWdlW10gPT4ge1xuICAgIHR5cGUgR3JvdXAgPSB7a2luZDogJ2dyb3VwJzsgc2VsOiBTZWxlY3Rvck1lc3NhZ2U7IHRyYWlsaW5nOiBGZWVkYmFja01lc3NhZ2VbXX07XG4gICAgdHlwZSBMb29zZSA9IHtraW5kOiAnbG9vc2UnOyBtOiBGZWVkYmFja01lc3NhZ2V9O1xuICAgIHR5cGUgU2xvdCA9IEdyb3VwIHwgTG9vc2UgfCB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX07XG4gICAgY29uc3Qgc2xvdHM6IFNsb3RbXSA9IFtdO1xuICAgIGxldCBjdXJHcm91cDogR3JvdXAgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBmbHVzaEdyb3VwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKGN1ckdyb3VwKSB7IHNsb3RzLnB1c2goY3VyR3JvdXApOyBjdXJHcm91cCA9IG51bGw7IH1cbiAgICB9O1xuICAgIGZvciAoY29uc3QgbSBvZiBtc2dzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBzbG90cy5wdXNoKHtraW5kOiAncGFnZScsIG19KTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgY3VyR3JvdXAgPSB7a2luZDogJ2dyb3VwJywgc2VsOiBtLCB0cmFpbGluZzogW119O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGV0YWNoZWQgY29tbWVudHMgbmV2ZXIgdHJhdmVsIHdpdGggdGhlIHByZWNlZGluZyBzZWxlY3RvcidzXG4gICAgICAgIC8vIGdyb3VwIOKAlCB0aGV5IHN0YXkgbG9vc2UgaW4gZXhwb3J0IG9yZGVyLlxuICAgICAgICBpZiAoY3VyR3JvdXAgJiYgIW0uZGV0YWNoZWQpIGN1ckdyb3VwLnRyYWlsaW5nLnB1c2gobSk7XG4gICAgICAgIGVsc2Ugc2xvdHMucHVzaCh7a2luZDogJ2xvb3NlJywgbX0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaEdyb3VwKCk7XG4gICAgY29uc3Qgb3V0OiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGxldCBydW5TdGFydCA9IDA7XG4gICAgY29uc3QgZmx1c2hSdW4gPSAoZW5kOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgICBjb25zdCBncm91cFJlY3RzOiBBcnJheTx7aWR4OiBudW1iZXI7IHk6IG51bWJlcjsgeDogbnVtYmVyfT4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSBydW5TdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByID0gcy5zZWwuZW50cnkucmVjdDtcbiAgICAgICAgICBncm91cFJlY3RzLnB1c2goe2lkeDogaSwgeTogcj8ueSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIHg6IHI/LnggPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kaWNlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgZ3JvdXBSZWN0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnkgIT09IGIueSkgcmV0dXJuIGEueSAtIGIueTtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICAgIH0pO1xuICAgICAgbGV0IGdpID0gMDtcbiAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByZXBsYWNlbWVudElkeCA9IGdyb3VwUmVjdHNbZ2krK10hLmlkeDtcbiAgICAgICAgICBjb25zdCByID0gc2xvdHNbcmVwbGFjZW1lbnRJZHhdISBhcyBHcm91cDtcbiAgICAgICAgICBvdXQucHVzaChyLnNlbCk7XG4gICAgICAgICAgZm9yIChjb25zdCBmIG9mIHIudHJhaWxpbmcpIG91dC5wdXNoKGYpO1xuICAgICAgICB9IGVsc2UgaWYgKHMua2luZCA9PT0gJ2xvb3NlJykge1xuICAgICAgICAgIG91dC5wdXNoKHMubSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzbG90c1tpXSEua2luZCA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoUnVuKGkpO1xuICAgICAgICBvdXQucHVzaCgoc2xvdHNbaV0gYXMge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9KS5tKTtcbiAgICAgICAgcnVuU3RhcnQgPSBpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hSdW4oc2xvdHMubGVuZ3RoKTtcbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdGlja1RvQm90dG9tID0gbGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDAgfHwgd2FzTmVhckJvdHRvbSgpO1xuICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAvLyBTdGF0cyBudW1iZXJzXG4gICAgbGV0IHRvdGFsU2VsZWN0b3JzID0gMDtcbiAgICBsZXQgdG90YWxDb21tZW50cyA9IDA7XG4gICAgbGV0IHRvdGFsU3RhbGUgPSAwO1xuICAgIGNvbnN0IGRpc3RpbmN0UGFnZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgdG90YWxTZWxlY3RvcnMrKztcbiAgICAgICAgaWYgKHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSkgdG90YWxTdGFsZSsrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHRvdGFsQ29tbWVudHMrKztcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtZXNzYWdlcy5zb21lKCh4KSA9PiB4LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgeC5lbnRyeS51cmwgPT09IG0udXJsKSkgZGlzdGluY3RQYWdlcy5hZGQobS51cmwpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic2VsZWN0b3JzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFNlbGVjdG9ycyk7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cImNvbW1lbnRzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbENvbW1lbnRzKTtcbiAgICBjb25zdCBzdGFsZU51bSA9IHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzdGFsZVwiXSAuc3RhdC1udW0nKSE7XG4gICAgc3RhbGVOdW0udGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTdGFsZSk7XG4gICAgc3RhbGVOdW0uZGF0YXNldC56ZXJvID0gdG90YWxTdGFsZSA9PT0gMCA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInBhZ2VzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyhkaXN0aW5jdFBhZ2VzLnNpemUpO1xuICAgIGNvbnN0IGV4cG9ydFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgc3RhdFRva2Vucy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcodG9rZW5Db3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG4gICAgc3RhdFdvcmRzLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh3b3JkQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuXG4gICAgLy8gTWluaWZ5IHJlZHVjdGlvbiBzdGF0c1xuICAgIGxldCBmdWxsVCA9IDAsIGN1clQgPSAwLCBmdWxsVyA9IDAsIGN1clcgPSAwLCBwY3QgPSAwO1xuICAgIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICBjb25zdCB3YXNNaW4gPSBwcmVmcy5taW5pZnk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB0cnVlOyBjb25zdCBtaW5UZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gZmFsc2U7IGNvbnN0IGZ1bGxUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gd2FzTWluO1xuICAgICAgZnVsbFQgPSB0b2tlbkNvdW50KGZ1bGxUZXh0KTsgY3VyVCA9IHRva2VuQ291bnQobWluVGV4dCk7XG4gICAgICBmdWxsVyA9IHdvcmRDb3VudChmdWxsVGV4dCk7IGN1clcgPSB3b3JkQ291bnQobWluVGV4dCk7XG4gICAgICBwY3QgPSBmdWxsVCA+IDAgPyBNYXRoLnJvdW5kKCgxIC0gY3VyVCAvIGZ1bGxUKSAqIDEwMCkgOiAwO1xuICAgIH1cbiAgICBjb25zdCBtaW5pZnlTdGF0c0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1pbmlmeS1zdGF0c10nKTtcbiAgICBpZiAobWluaWZ5U3RhdHNFbCkge1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtmdWxsVC50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJULnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke2Z1bGxXLnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clcudG9Mb2NhbGVTdHJpbmcoKX0gd29yZHMgwrcgJHtwY3R9JSByZWR1Y3Rpb25gO1xuICAgICAgfSBlbHNlIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgV291bGQgc2F2ZSAkeyhmdWxsVCAtIGN1clQpLnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke3BjdH0lIGlmIGVuYWJsZWRgO1xuICAgICAgfSBlbHNlIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG5cbiAgICAvLyBQZXItY2hlY2tib3ggY29udHJpYnV0aW9uIHN0YXRzOiBob3cgbWFueSB0b2tlbnMvd29yZHMgZWFjaCB0b2dnbGVcbiAgICAvLyBhZGRzIHRvIHRoZSBjdXJyZW50IGV4cG9ydC4gQ29tcHV0ZWQgYnkgdG9nZ2xpbmcgdGhhdCBzaW5nbGUgcHJlZlxuICAgIC8vIGFuZCBkaWZmaW5nIHRoZSBleHBvcnQg4oCUIGdpdmVzIGFuIGhvbmVzdCBhbnN3ZXIgdGhhdCByZWZsZWN0cyB0aGVcbiAgICAvLyBjdXJyZW50IG1pbmlmeSBzdGF0ZSBhbmQgdGhlIHJlc3Qgb2YgdGhlIHRvZ2dsZXMuXG4gICAgY29uc3QgY29udHJpYktleXM6IEFycmF5PGtleW9mIFByZWZzPiA9IFsnaW5jbHVkZU91dGVySFRNTCcsICdpbmNsdWRlTWF0Y2hlZFJ1bGVzJywgJ2luY2x1ZGVTdHlsZXMnXTtcbiAgICBpZiAoZXhwb3J0VGV4dCAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJhc2VUID0gdG9rZW5Db3VudChleHBvcnRUZXh0KTtcbiAgICAgIGNvbnN0IGJhc2VXID0gd29yZENvdW50KGV4cG9ydFRleHQpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoIWVsKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qgd2FzT24gPSBwcmVmc1trZXldIGFzIGJvb2xlYW47XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSAhd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSB3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VCA9IHRva2VuQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIGNvbnN0IGFsdFcgPSB3b3JkQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIC8vIHdhc09uPXRydWUg4oaSIGN1cnJlbnRseSBpbmNsdWRlZDsgY29zdCA9IGJhc2UgLSBhbHQgKHR1cm5pbmcgT0ZGIHNhdmVzIHRoaXMpLlxuICAgICAgICAvLyB3YXNPbj1mYWxzZSDihpIgY3VycmVudGx5IGV4Y2x1ZGVkOyBnYWluID0gYWx0IC0gYmFzZSAodHVybmluZyBPTiBhZGRzIHRoaXMpLlxuICAgICAgICBjb25zdCBkVCA9IHdhc09uID8gYmFzZVQgLSBhbHRUIDogYWx0VCAtIGJhc2VUO1xuICAgICAgICBjb25zdCBkVyA9IHdhc09uID8gYmFzZVcgLSBhbHRXIDogYWx0VyAtIGJhc2VXO1xuICAgICAgICBjb25zdCBzaWduID0gd2FzT24gPyAnJyA6ICcrJztcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB3YXNPblxuICAgICAgICAgID8gYMK3ICR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaW4gZXhwb3J0JHtwcmVmcy5taW5pZnkgPyAnIChtaW5pZmllZCknIDogJyd9YFxuICAgICAgICAgIDogYMK3ICR7c2lnbn0ke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtzaWdufSR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpZiBlbmFibGVkYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoZWwpIGVsLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9vbGJhciBleHBvcnQgc3RhdHNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignLnN0YXQuZXhwb3J0LXN0YXRzJykuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgY29uc3QgbnVtID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbnVtJyk7XG4gICAgICBjb25zdCBsYWIgPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1sYWJlbCcpO1xuICAgICAgaWYgKG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50IS5yZXBsYWNlKC9cXCokLywgJycpO1xuICAgICAgaWYgKGxhYikgbGFiLnRleHRDb250ZW50ID0gbGFiLnRleHRDb250ZW50IS5yZXBsYWNlKC9eXFwqLywgJycpO1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCArICcqJztcbiAgICAgIGNvbnN0IGlzVG9rZW4gPSBpID09PSAwO1xuICAgICAgY29uc3QgZnVsbFYgPSBpc1Rva2VuID8gZnVsbFQgOiBmdWxsVztcbiAgICAgIGNvbnN0IGN1clYgPSBpc1Rva2VuID8gY3VyVCA6IGN1clc7XG4gICAgICBjb25zdCB3aGljaCA9IGlzVG9rZW4gPyAndG9rZW5zJyA6ICd3b3Jkcyc7XG4gICAgICBzLmRhdGFzZXQudGlwID0gcHJlZnMubWluaWZ5XG4gICAgICAgID8gYE1JTklGSUVEIMK3ICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofVxcbkZ1bGwgd291bGQgYmUgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYFxuICAgICAgICA6IGAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9IMK3IGZ1bGwgZXhwb3J0XFxuTWluaWZpZWQgd291bGQgYmUgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgO1xuICAgIH0pO1xuXG4gICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cImVtcHR5LWljb25cIj7wn6SPPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS10aXRsZVwiPlN0YXJ0IHdpdGggdGhlIHBhZ2UgeW91IHdhbnQgdG8gY3JpdGlxdWUuPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1ib2R5XCI+T3BlbiBhIHBhZ2UsIHRoZW4gY2FwdHVyZSBhbiBlbGVtZW50LiBDb21tZW50cyBzdGF5IHBhaXJlZCB3aXRoIHRoZSB0aGluZyB5b3UgZ3JhYmJlZC48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LWtleXNcIj5BbHQrQ2xpY2sgdG8gY2FwdHVyZTwvZGl2PmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdG9yVXJscyA9IG5ldyBTZXQobWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkudXJsKSk7XG4gICAgY29uc3QgdmlzaWJsZU1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgIT09ICdwYWdlJyB8fCBzZWxlY3RvclVybHMuaGFzKG0udXJsKSk7XG4gICAgY29uc3QgcGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBCb29sZWFuKG0ucGlubmVkKSk7XG4gICAgY29uc3QgdW5waW5uZWQgPSB2aXNpYmxlTWVzc2FnZXMuZmlsdGVyKChtKSA9PiAhcGlubmVkLmluY2x1ZGVzKG0gYXMgU2VsZWN0b3JNZXNzYWdlKSk7XG4gICAgLy8gU2lkZWJhciBzaG93cyBjYXB0dXJlcyBpbiBJTlNFUlRJT04gb3JkZXIgKG1vc3QgcmVjZW50IGF0IHRoZVxuICAgIC8vIGJvdHRvbSkuIFZpc3VhbC1wb3NpdGlvbiByZW9yZGVyaW5nIGhhcHBlbnMgT05MWSBhdCBleHBvcnQgdGltZVxuICAgIC8vIHNvIHRoZSBzaWRlYmFyIHN0YXlzIHByZWRpY3RhYmxlIHdoaWxlIHRoZSBhZ2VudC1mYWNpbmcgZXhwb3J0XG4gICAgLy8gZ2V0cyByZWFkaW5nLW9yZGVyIGNvbnZlbmllbmNlLiAoUHJpb3IgaW1wbGVtZW50YXRpb24gc29ydGVkIGluXG4gICAgLy8gYm90aCBwbGFjZXM7IHVzZXIgZmVlZGJhY2sgd2FzIHRoYXQgc2lkZWJhciBzaHVmZmxpbmcgd2FzXG4gICAgLy8gZGlzb3JpZW50aW5nLilcbiAgICBjb25zdCBvcmRlcmVkID0gWy4uLnBpbm5lZCwgLi4udW5waW5uZWRdO1xuXG4gICAgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbChtZXNzYWdlc1swXSEuaWQpKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICAvLyBUcmFjayB0aGUgVVJMIG9mIHRoZSBtb3N0IHJlY2VudGx5IHJlbmRlcmVkIHBhZ2UgZGl2aWRlciBzbyB3ZSBjYW5cbiAgICAvLyBzdXBwcmVzcyBhIHJlcGVhdGVkIGhlYWRlciB3aGVuIGNvbnNlY3V0aXZlIGNhcHR1cmVzIHNoYXJlIHRoZSBzYW1lXG4gICAgLy8gcGFnZS4gUmVzdGF0aW5nIHRoZSBVUkwgYWJvdmUgZXZlcnkgY2FwdHVyZSBpbiBhIHNhbWUtVVJMIHJ1biBpc1xuICAgIC8vIG5vaXNlIOKAlCB0aGUgZGl2aWRlciBvbmx5IGVhcm5zIGl0cyBzcGFjZSB3aGVuIHRoZSBVUkwgYWN0dWFsbHlcbiAgICAvLyBjaGFuZ2VzIGZyb20gdGhlIHByZXZpb3VzIGNhcHR1cmUgaW4gc2VxdWVuY2UuXG4gICAgbGV0IGxhc3RSZW5kZXJlZFBhZ2VVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZW5kZXJlZEFueSA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JkZXJlZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbSA9IG9yZGVyZWRbaV0hO1xuICAgICAgaWYgKCFtYXRjaGVzU2VhcmNoKG0pKSBjb250aW51ZTtcbiAgICAgIC8vIENvbGxhcHNlIGNvbnNlY3V0aXZlIHNhbWUtVVJMIHBhZ2UgZGl2aWRlcnMgaW50byB0aGUgZmlyc3Qgb25lLlxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtLnVybCA9PT0gbGFzdFJlbmRlcmVkUGFnZVVybCkgY29udGludWU7XG4gICAgICAgIGxhc3RSZW5kZXJlZFBhZ2VVcmwgPSBtLnVybDtcbiAgICAgIH1cbiAgICAgIC8vIERldGFjaGVkIGNvbW1lbnRzIHJlbmRlciB1bnRocmVhZGVkIOKAlCBhZGphY2VuY3kgbXVzdCBub3QgcmUtYWRvcHRcbiAgICAgIC8vIGEgY29tbWVudCB0aGUgdXNlciBleHBsaWNpdGx5IGRpc2Fzc29jaWF0ZWQuXG4gICAgICBjb25zdCBhZGphY2VuY3kgPSBtLnR5cGUgPT09ICdmZWVkYmFjaycgJiYgbS5kZXRhY2hlZCA/IG51bGwgOiBsYXN0U2VsZWN0b3JTZWw7XG4gICAgICBjb25zdCBub2RlID0gcmVuZGVyTWVzc2FnZShtLCBhZGphY2VuY3kpO1xuICAgICAgbGlzdC5hcHBlbmQobm9kZSk7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBsYXN0U2VsZWN0b3JTZWwgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgaWYgKGkgPCBvcmRlcmVkLmxlbmd0aCAtIDEpIGxpc3QuYXBwZW5kKGluc2VydFJhaWwob3JkZXJlZFtpICsgMV0hLmlkKSk7XG4gICAgICByZW5kZXJlZEFueSA9IHRydWU7XG4gICAgfVxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwoJ19fZW5kX18nKSk7XG4gICAgaWYgKCFyZW5kZXJlZEFueSAmJiBzZWFyY2hRdWVyeSkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS50ZXh0Q29udGVudCA9IGBObyBtYXRjaGVzIGZvciBcIiR7c2VhcmNoUXVlcnl9XCIuYDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSByZW5kZXJQaGFudG9tKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgaWYgKHN0aWNrVG9Cb3R0b20pIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBlbmRpbmdCYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGVuZGluZy1iYXknKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwZW5kaW5nTXVsdGkubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgYmF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYmF5LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWJheSc7XG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGVhZCc7XG4gICAgaGVhZC50ZXh0Q29udGVudCA9IGBQZW5kaW5nIGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH0gZWxlbWVudCR7cGVuZGluZ011bHRpLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWA7XG4gICAgYmF5LmFwcGVuZChoZWFkKTtcbiAgICBwZW5kaW5nTXVsdGkuZm9yRWFjaCgoZSwgaSkgPT4ge1xuICAgICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2FyZC5jbGFzc05hbWUgPSAncGVuZGluZy1jYXJkJztcbiAgICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICAgIHNlcS50ZXh0Q29udGVudCA9IGAjJHtpICsgMX1gO1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IChlLnRleHQgJiYgZS50ZXh0Lmxlbmd0aCA8PSA2MCA/IGUudGV4dCA6IChlLmNvbXBvbmVudFJvb3QgPz8gZS5zZWxlY3RvciA/PyBlLnRhZykpO1xuICAgICAgY2FyZC5hcHBlbmQoc2VxLCBsYWJlbCk7XG4gICAgICBiYXkuYXBwZW5kKGNhcmQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncGVuZGluZy1yb3cnO1xuICAgIGNvbnN0IGNvbW1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbW1pdC50eXBlID0gJ2J1dHRvbic7XG4gICAgY29tbWl0LmNsYXNzTmFtZSA9ICdwcmltYXJ5IHBlbmRpbmctY29tbWl0JztcbiAgICBjb21taXQudGV4dENvbnRlbnQgPSBgQ29tbWl0IGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH1gO1xuICAgIGNvbW1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jb21taXQnfSkpO1xuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuIHBlbmRpbmctY2FuY2VsJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnO1xuICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSkpO1xuICAgIHJvdy5hcHBlbmQoY29tbWl0LCBjYW5jZWwpO1xuICAgIGJheS5hcHBlbmQocm93KTtcbiAgICBjb25zdCBoaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGludC5jbGFzc05hbWUgPSAncGVuZGluZy1oaW50JztcbiAgICBoaW50LnRleHRDb250ZW50ID0gJ0FsdCtTaGlmdCtDbGljayBtb3JlIMK3IENvbW1pdCB0byBmaW5hbGl6ZSDCtyBFc2MgdG8gY2FuY2VsJztcbiAgICBiYXkuYXBwZW5kKGhpbnQpO1xuICAgIGxpc3QuYXBwZW5kKGJheSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGNsZWFyTm9vZGxlcyA9ICgpOiB2b2lkID0+IHsgZm9yIChjb25zdCBuIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLnRyZWUtbm9vZGxlJykpIG4ucmVtb3ZlKCk7IH07XG5cbiAgLy8gQ3Jvc3Mtc2VhbSBwYW5lbOKGlGNhbnZhcyBub29kbGVzIHdlcmUgcmVtb3ZlZDogYWxpZ25pbmcgdHdvIFNWRyBoYWx2ZXNcbiAgLy8gYWNyb3NzIHRoZSBwYW5lbC9wYWdlIGJvdW5kYXJ5IGRlcGVuZGVkIG9uIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaFxuICAvLyBicmVha3MgdW5kZXIgRGV2VG9vbHMgZG9jayBhbmQgem9vbSwgYW5kIHRoZSB2aXN1YWwgYmVuZWZpdCBkaWRuJ3RcbiAgLy8ganVzdGlmeSB0aGUgbWFpbnRlbmFuY2UgY29zdC4gVGhlIGluLXBhbmVsIGZlZWRiYWNrLXRyZWUgbm9vZGxlc1xuICAvLyAoZHJhd05vb2RsZSAvIHJlZHJhd05vb2RsZXMgYmVsb3cpIGFyZSB1bmFmZmVjdGVkLlxuICBjb25zdCBjbGVhckJ1YmJsZU5vb2RsZSA9ICgpOiB2b2lkID0+IHsgLyogbm8tb3AgKi8gfTtcbiAgY29uc3QgcmVkcmF3Tm9vZGxlcyA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhck5vb2RsZXMoKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIFsuLi5saXN0LmNoaWxkcmVuXSBhcyBIVE1MRWxlbWVudFtdKSB7XG4gICAgICBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RvcicpKSBsYXN0U2VsZWN0b3JFbCA9IG5vZGU7XG4gICAgICAvLyBPbmx5IFRIUkVBREVEIGNvbW1lbnRzIGdldCBhIGNvbm5lY3RvciDigJQgYSBkZXRhY2hlZCBjb21tZW50IG11c3RcbiAgICAgIC8vIGxvc2UgaXRzIG5vb2RsZSwgbm90IGp1c3QgaXRzIGluZGVudCAodGhlIHZpc2libGUgXCJkaXNjb25uZWN0XCIpLlxuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWVkYmFjaycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aHJlYWRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCBub2RlKTtcbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtcmFpbCcpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5pbmxpbmUtY29tbWVudCcpID8/IG5vZGU7XG4gICAgICAgIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIHRhcmdldCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRpdmlkZXInKSB8fCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZ3JvdXAtaGVhZCcpKSB7XG4gICAgICAgIGxhc3RTZWxlY3RvckVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGRyYXdOb29kbGUgPSAoc2VsZWN0b3JFbDogSFRNTEVsZW1lbnQsIGZlZWRiYWNrRWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc1IgPSBzZWxlY3RvckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGZSID0gZmVlZGJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBsUiA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgeDEgPSBzUi5sZWZ0IC0gbFIubGVmdCArIDEyO1xuICAgIGNvbnN0IHkxID0gc1IuYm90dG9tIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3A7XG4gICAgY29uc3QgeDIgPSBmUi5sZWZ0IC0gbFIubGVmdDtcbiAgICBjb25zdCB5MiA9IGZSLnRvcCAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wICsgMTQ7XG4gICAgY29uc3QgdyA9IE1hdGgubWF4KDIwLCB4MiAtIHgxICsgNCk7XG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDIwLCB5MiAtIHkxKTtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RyZWUtbm9vZGxlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcodykpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFN0cmluZyhoKSk7XG4gICAgc3ZnLnN0eWxlLmxlZnQgPSBgJHt4MSAtIDJ9cHhgO1xuICAgIHN2Zy5zdHlsZS50b3AgPSBgJHt5MX1weGA7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIGNvbnN0IHN4ID0gMiwgc3kgPSAwLCBleCA9IHcgLSAyLCBleSA9IGg7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBgTSAke3N4fSAke3N5fSBDICR7c3h9ICR7c3kgKyBoICogMC41NX0sICR7ZXggLSB3ICogMC40fSAke2V5fSwgJHtleH0gJHtleX1gKTtcbiAgICBzdmcuYXBwZW5kKHBhdGgpO1xuICAgIGxpc3QuYXBwZW5kKHN2Zyk7XG4gIH07XG4gIGxldCBzY3JvbGxSYWYgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmFmKSByZXR1cm47XG4gICAgc2Nyb2xsUmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgc2Nyb2xsUmFmID0gMDsgcmVkcmF3Tm9vZGxlcygpOyB9KTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZWRyYXdOb29kbGVzKTtcblxuICAvLyDilIDilIDilIAgUGVyLW1lc3NhZ2UgcmVuZGVyZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCByZW5kZXJNZXNzYWdlID0gKG06IFBhbmVsTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIHJlbmRlclBhZ2UobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHJlbmRlclNlbGVjdG9yKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiByZW5kZXJGZWVkYmFjayhtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQYWdlID0gKG06IFBhZ2VNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkLmNsYXNzTmFtZSA9ICdwYWdlLWRpdmlkZXInO1xuICAgIGQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgY29uc3QgdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdHMuY2xhc3NOYW1lID0gJ3RhYi1zdGF0dXMnO1xuICAgIHRzLmRhdGFzZXQudXJsID0gbS51cmw7XG4gICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB0cy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgZC5hcHBlbmQodHMpO1xuICAgIGNvbnN0IHUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdS5jbGFzc05hbWUgPSAndXJsJztcbiAgICB1LnRleHRDb250ZW50ID0gbS51cmw7XG4gICAgdS5kYXRhc2V0LnRpcCA9IGAke20udGl0bGUgPz8gJyd9IMK3ICR7bS51cmx9YDtcbiAgICBkLmFwcGVuZCh1KTtcbiAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBvbiB0aGlzIHBhZ2UgaW4gdGhlIGFjdGl2ZSB0YWIsIGNsaWNraW5nIHRoZSBVUkxcbiAgICAgIC8vIHNob3VsZG4ndCByZWxvYWQgb3Igc3RlYWwgZm9jdXMg4oCUIGl0IHNob3VsZCBqdXN0IGJlIGEgbm8tb3BcbiAgICAgIC8vIHZpc3VhbGx5ICh0aGUgcm93IGFscmVhZHkgaW5kaWNhdGVzIFwib3BlblwiIHZpYSAudGFiLXN0YXR1cykuIFRoZVxuICAgICAgLy8gdXNlciBjb21wbGFpbmVkIGFib3V0IGdldHRpbmcgZm9yY2VkIGludG8gYSBuYXZpZ2F0aW9uIHdoZW4gdGhleVxuICAgICAgLy8gd2VyZSBqdXN0IHRyeWluZyB0byByZWFkIHRoZSByb3cuXG4gICAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHtcbiAgICAgICAgc2V0U3RhdHVzKCdBbHJlYWR5IG9uIHRoaXMgcGFnZScsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgciA9IGF3YWl0IHNlbmRUb0JnPHtmb3VuZD86IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcjsgZXJyb3I/OiBzdHJpbmd9Pih7a2luZDogJ3N3aXRjaC10by10YWInLCB1cmw6IG0udXJsLCBvcGVuSWZNaXNzaW5nOiB0cnVlfSk7XG4gICAgICBpZiAocj8uZm91bmQpIHNldFN0YXR1cygnU3dpdGNoZWQgdG8gdGFiJyk7XG4gICAgICBlbHNlIGlmIChyPy5vcGVuZWQpIHNldFN0YXR1cygnT3BlbmVkIGluIG5ldyB0YWInKTtcbiAgICAgIGVsc2Ugc2V0U3RhdHVzKFwiQ291bGRuJ3Qgb3BlbiB0YWJcIiwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pO1xuICAgIHJldHVybiBkO1xuICB9O1xuXG4gIGNvbnN0IHRpdGxlRnJvbUVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXN0SWQpIHJldHVybiBgW3Rlc3RJZD0ke2UudGVzdElkfV1gO1xuICAgIGlmIChlLmlkKSByZXR1cm4gYCMke2UuaWR9YDtcbiAgICBpZiAoZS5jbGFzc2VzPy5sZW5ndGgpIHJldHVybiBgJHtlLnRhZ30uJHtlLmNsYXNzZXMuc2xpY2UoMCwgMikuam9pbignLicpfWA7XG4gICAgcmV0dXJuIGUuc2VsZWN0b3IgfHwgZS50YWcgfHwgJyh1bmtub3duKSc7XG4gIH07XG5cbiAgLy8gUGljayB0aGUgbW9zdCBcImh1bWFubHkgcmVhZGFibGVcIiBsYWJlbCBmb3IgdGhlIGJ1YmJsZSBwcmV2aWV3LiBQcmVmZXJzXG4gIC8vIHZpc2libGUtdG8tdXNlciB0ZXh0IGluIHRoaXMgcHJpb3JpdHk6XG4gIC8vICAgMS4gaW5uZXJUZXh0IC8gdGV4dENvbnRlbnQgKGBlbnRyeS50ZXh0YCkg4oCUIHdoYXQgdGhlIHVzZXIgcmVhZHMgb24gc2NyZWVuXG4gIC8vICAgMi4gYWNjZXNzaWJsZU5hbWUgKGFyaWEtbGFiZWwgLyB0aXRsZSAvIGFsdCBmYWxsYmFjayBjaGFpbilcbiAgLy8gICAzLiBpbnB1dCB2YWx1ZSAoc2tpcHBlZCBpZiBpdCdzIHRoZSBtYXNrZWQgcGFzc3dvcmQgcGxhY2Vob2xkZXIpXG4gIC8vICAgNC4gaW5wdXQgcGxhY2Vob2xkZXJcbiAgLy8gICA1LiBpbWcgYWx0XG4gIC8vICAgNi4gY29tcG9uZW50Um9vdCAoZS5nLiBcImJ1dHRvbiNjdGFcIilcbiAgLy8gICA3LiB0aXRsZUZyb21FbnRyeSDigJQgbGFzdC1yZXNvcnQgdGFnL2NsYXNzL2lkIGZhbGxiYWNrXG4gIC8vIENTUyBoYW5kbGVzIHZpc3VhbCB0cnVuY2F0aW9uIHZpYSB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3ZSBzaGlwIHRoZVxuICAvLyBmdWxsIHN0cmluZyBzbyB0aGUgdG9vbHRpcCBvbiBob3ZlciBjYW4gc2hvdyB0aGUgY29tcGxldGUgdmFsdWUuXG4gIGNvbnN0IG5pY2VMYWJlbCA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGV4dCkgcmV0dXJuIGUudGV4dDtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSkgcmV0dXJuIGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgY29uc3QgdiA9IGUuYXR0cnM/LnZhbHVlO1xuICAgIGlmICh2ICYmIHYgIT09ICfigKLigKLigKLigKInKSByZXR1cm4gdjtcbiAgICBpZiAoZS5hdHRycz8ucGxhY2Vob2xkZXIpIHJldHVybiBlLmF0dHJzLnBsYWNlaG9sZGVyO1xuICAgIGlmIChlLmF0dHJzPy5hbHQpIHJldHVybiBlLmF0dHJzLmFsdDtcbiAgICBpZiAoZS5jb21wb25lbnRSb290KSByZXR1cm4gZS5jb21wb25lbnRSb290O1xuICAgIHJldHVybiB0aXRsZUZyb21FbnRyeShlKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTZWxlY3RvciA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgdmFsaWQgPSBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzYW1lUGF0aCA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJykgPT09IGxpdmVUYWJQYXRoO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIHNlbGVjdG9yJztcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlICYmIHNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhbGUnKTtcbiAgICBlbHNlIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgIXNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnZGlmZi1wYWdlJyk7XG4gICAgaWYgKG0ucGlubmVkKSBkaXYuY2xhc3NMaXN0LmFkZCgncGlubmVkJyk7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2hhcy1ncm91cCcpO1xuICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yID09PSBsYXN0QWN0aXZlU2VsZWN0b3IpIGRpdi5jbGFzc0xpc3QuYWRkKCdsYXN0LWFjdGl2ZScpO1xuICAgIC8vIEF1dG8tZXhwYW5kIG9uIHNlYXJjaCBoaXQgc28gdGhlIHVzZXIgc2VlcyB3aGVyZSB0aGUgbWF0Y2ggbGFuZGVkLlxuICAgIGNvbnN0IG1hdGNoZWRCb2R5ID0gYm9keU1hdGNoZXNTZWFyY2gobSk7XG4gICAgaWYgKG1hdGNoZWRCb2R5KSBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnLCAnc2VhcmNoLWhpdCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuZGF0YXNldC5zZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgLy8gRHJhZy10by1yZXBhcmVudDogZXZlcnkgc2VsZWN0b3IgYnViYmxlIGlzIGEgdmFsaWQgZHJvcCB0YXJnZXQgZm9yXG4gICAgLy8gYSBjb21tZW50IGJlaW5nIGRyYWdnZWQgZnJvbSBlbHNld2hlcmUgaW4gdGhlIHNpZGViYXIuXG4gICAgd2lyZVNlbGVjdG9yRHJvcFRhcmdldChkaXYsIG0pO1xuXG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ2hlYWQnO1xuICAgIGNvbnN0IGNhcmV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNhcmV0LmNsYXNzTmFtZSA9ICdjYXJldCc7XG4gICAgY2FyZXQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGV2cm9uLXJpZ2h0JywgMTIpO1xuICAgIGhlYWQuYXBwZW5kKGNhcmV0KTtcbiAgICBjb25zdCBwaW5NYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcGluTWFya2VyLmNsYXNzTmFtZSA9ICdwaW4tbWFya2VyJztcbiAgICBwaW5NYXJrZXIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdzdGFyLWZpbGxlZCcsIDExKTtcbiAgICBoZWFkLmFwcGVuZChwaW5NYXJrZXIpO1xuICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgc2VxLnRleHRDb250ZW50ID0gYCMke20uZW50cnkubn1gO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIHNlcS50ZXh0Q29udGVudCArPSBgKyR7bS5lbnRyeS5ncm91cC5sZW5ndGh9YDtcbiAgICBoZWFkLmFwcGVuZChzZXEpO1xuICAgIGNvbnN0IGNvbXBhY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29tcGFjdC5jbGFzc05hbWUgPSAnY29tcGFjdCc7XG4gICAgY29uc3QgY29tcGFjdFN0ciA9IG5pY2VMYWJlbChtLmVudHJ5KTtcbiAgICBjb21wYWN0LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGNvbXBhY3RTdHIsIHNlYXJjaFF1ZXJ5KTtcbiAgICAvLyBTaG93IHRoZSBmdWxsIGxhYmVsIG9uIGhvdmVyIGV2ZW4gd2hlbiBDU1MgZWxsaXBzaXMgdHJ1bmNhdGVzIHRoZVxuICAgIC8vIHZpc2libGUgcG9ydGlvbiDigJQgdXNlZnVsIHdoZW4gdGhlIHZpc2libGUgdGV4dC9wbGFjZWhvbGRlciBpcyBsb25nLlxuICAgIGlmIChjb21wYWN0U3RyLmxlbmd0aCA+IDI0KSBjb21wYWN0LmRhdGFzZXQudGlwID0gY29tcGFjdFN0cjtcbiAgICBoZWFkLmFwcGVuZChjb21wYWN0KTtcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9IHIgPyBgJHtyLnd9w5cke3IuaH1gIDogKG0uZW50cnkudGFnID8/ICcnKTtcbiAgICBoZWFkLmFwcGVuZChtZXRhKTtcbiAgICBkaXYuYXBwZW5kKGhlYWQpO1xuXG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzdW1tYXJ5LmNsYXNzTmFtZSA9ICdwZWVrLXN1bW1hcnknO1xuICAgIHN1bW1hcnkuaW5uZXJIVE1MID0gYDxzcGFuIGRhdGEtaWNvbj1cImFsZXJ0LWNpcmNsZVwiIGRhdGEtc2l6ZT1cIjExXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ0XCI+JHtkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWZmLXBhZ2UnKSA/ICdkaWZmZXJlbnQgcGFnZScgOiAnc3RhbGUnfTwvc3Bhbj5gO1xuICAgIGhlYWQuYXBwZW5kKHN1bW1hcnkpO1xuICAgIG1vdW50SWNvbnMoc3VtbWFyeSk7XG5cbiAgICBjb25zdCBlcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnIuY2xhc3NOYW1lID0gJ3BlZWstZXJyb3InO1xuICAgIGNvbnN0IHJlYXNvbiA9IHNlbGVjdG9yRXJyb3JzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBwYXRoRnJvbUVudHJ5ID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKTtcbiAgICBlcnIuaW5uZXJIVE1MID0gc2FtZVBhdGhcbiAgICAgID8gYDxiPlN0YWxlPC9iPiDCtyAke2VzY2FwZUh0bWwocmVhc29uID8/ICdubyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcy4nKX08YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gXG4gICAgICA6IGBDYXB0dXJlZCBvbiA8Y29kZT4ke2VzY2FwZUh0bWwocGF0aEZyb21FbnRyeSl9PC9jb2RlPiDigJQgY3VycmVudCB0YWIgaXMgPGNvZGU+JHtlc2NhcGVIdG1sKGxpdmVUYWJQYXRoID8/ICcnKX08L2NvZGU+LiBTd2l0Y2ggdGFicyB0byB2YWxpZGF0ZS48YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gO1xuICAgIGRpdi5hcHBlbmQoZXJyKTtcblxuICAgIC8vIEFuY2VzdG9yIGJyZWFkY3J1bWIg4oCUIFBsYXNtaWMtc3R5bGUgZXNjYWxhdG9yLiBDaGlwcyBmb3IgZWFjaCBlbnRyeSBpblxuICAgIC8vIGVudHJ5LmFuY2VzdG9ycyAoY2xvc2VzdCBmaXJzdCkuIENsaWNrIGEgY2hpcCB0byBjYXB0dXJlIHRoYXRcbiAgICAvLyBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIChkZXB0aCA9IGNoaXAgaW5kZXggKyAxIHNpbmNlIHRoZSBlbnRyeSdzXG4gICAgLy8gb3duIHNlbGVjdG9yIGlzIGRlcHRoIDApLiBCcmlnaHRuZXNzIGdyYWRpZW50IGRhcmtlbnMgZGVlcGVyIGNoaXBzLlxuICAgIGlmIChtLmVudHJ5LmFuY2VzdG9ycz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjcnVtYnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNydW1icy5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY3J1bWJzJztcbiAgICAgIGNydW1icy5kYXRhc2V0LnRpcCA9ICdDbGljayBhIGNydW1iIHRvIGVzY2FsYXRlIHRoZSBjYXB0dXJlIHRvIGFuIGFuY2VzdG9yIGVsZW1lbnQnO1xuICAgICAgbS5lbnRyeS5hbmNlc3RvcnMuZm9yRWFjaCgoYW5jLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2hpcC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGNoaXAuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNoaXAnO1xuICAgICAgICAvLyBCcmlnaHRuZXNzIGdyYWRpZW50OiBkZWVwZXIgY2hpcHMgZ2V0IHByb2dyZXNzaXZlbHkgZGltbWVyLlxuICAgICAgICBjaGlwLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7KDEgLSBpICogMC4wOCkudG9GaXhlZCgyKX0pYDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBhbmMudGVzdElkID8gYFske2FuYy50ZXN0SWR9XWBcbiAgICAgICAgICA6IGFuYy5pZCA/IGAjJHthbmMuaWR9YFxuICAgICAgICAgIDogYW5jLmNsYXNzZXM/Lmxlbmd0aCA/IGAke2FuYy50YWd9LiR7YW5jLmNsYXNzZXNbMF19YFxuICAgICAgICAgIDogYW5jLnRhZztcbiAgICAgICAgY2hpcC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjaGlwLmRhdGFzZXQudGlwID0gYENhcHR1cmUgdGhlIGFuY2VzdG9yICR7aSArIDF9IGxldmVsJHtpID8gJ3MnIDogJyd9IHVwIMK3ICR7YW5jLnRhZ30ke2FuYy5pZCA/ICcjJyArIGFuYy5pZCA6ICcnfWA7XG4gICAgICAgIC8vIEhvdmVyLXByZXZpZXcgdGhlIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2Ugc28gdGhlIHVzZXIgY2FuIHNlZVxuICAgICAgICAvLyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNvbW1pdHRpbmcuIE1pcnJvcnMgaG93XG4gICAgICAgIC8vIGhvdmVyaW5nIGEgc2VsZWN0b3IgYnViYmxlIHBhaW50cyBpdHMgcmluZy4gQ2xlYXJpbmcgb25cbiAgICAgICAgLy8gbW91c2VsZWF2ZSBzd2FwcyBiYWNrIHRvIHRoZSBidWJibGUncyBvd24gb3V0bGluZSAodGhlIGJ1YmJsZSdzXG4gICAgICAgIC8vIG1vdXNlZW50ZXIgaGFuZGxlciBwYWludGVkIGl0OyBsZWF2aW5nIHRoZSBjaGlwIGp1c3QgcmVtb3Zlc1xuICAgICAgICAvLyB0aGUgb3ZlcnJpZGUpLlxuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gUmUtcGFpbnQgdGhlIGJ1YmJsZSdzIG93biByaW5nIHJhdGhlciB0aGFuIGNsZWFyaW5nIGVudGlyZWx5XG4gICAgICAgICAgLy8gc28gdGhlIHVzZXIgZG9lc24ndCBzZWUgYSBmbGlja2VyIG9mIFwibm90aGluZ1wiIGJldHdlZW4gY2hpcHMuXG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7XG4gICAgICAgICAgICBraW5kOiAnY2FwdHVyZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDEsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKGBDYXB0dXJlZCBhbmNlc3RvciAke2FuYy50YWd9YCk7XG4gICAgICAgICAgZWxzZSBzZXRTdGF0dXMoJ0NvdWxkIG5vdCBjYXB0dXJlIGFuY2VzdG9yJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICB9KTtcbiAgICAgICAgY3J1bWJzLmFwcGVuZChjaGlwKTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFwcGVuZChjcnVtYnMpO1xuICAgIH1cblxuICAgIC8vIFByZXZpZXcgdGlsZS4gVGhlIGZ1bGwgUE5HIGxpdmVzIG9uIGRpc2sgdW5kZXJcbiAgICAvLyAucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvOyB0aGUgZGF0YVVybCBpcyBhIHNpZGUtcGFuZWwtZnJpZW5kbHlcbiAgICAvLyBkb3duc2NhbGUgKOKJpDMyMHB4IHdpZGUpLiBUbyBzdG9wIHRoZSBsYXlvdXQgZnJvbSBqdW1waW5nIHdoZW4gYSBzaG90XG4gICAgLy8gYXJyaXZlcyBhIHNlY29uZCBhZnRlciBjYXB0dXJlLCB3ZSBSRVNFUlZFIHRoZSBmaW5hbCBpbWFnZSBoZWlnaHQgdXBcbiAgICAvLyBmcm9udCB1c2luZyB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGtub3duIGFzcGVjdCByYXRpbyBhbmQgcGFpbnQgYVxuICAgIC8vIHNrZWxldG9uIGxvYWRlciBpbiB0aGF0IHNwYWNlLCB0aGVuIHN3YXAgdGhlIHNjcmVlbnNob3QgaW4gd2l0aCBub1xuICAgIC8vIHJlZmxvdy4gVGhlIHJlc2VydmF0aW9uIG9ubHkgaGFwcGVucyB3aGVuIGEgc2hvdCBpcyBhY3R1YWxseSBleHBlY3RlZFxuICAgIC8vIChhdXRvU2NyZWVuc2hvdCBvbiwgaG9zdCBub3Qgc2tpcHBlZCwgbm8gcmVjb3JkZWQgZmFpbHVyZSkgc28gY2FwdHVyZXNcbiAgICAvLyB0aGF0IHdpbGwgbmV2ZXIgZ2V0IGEgc2hvdCBkb24ndCBjYXJyeSBhbiBlbXB0eSBib3guXG4gICAgY29uc3Qgc2hvdERhdGFVcmwgPSBzaG90cy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3Qgc2hvdEV4cGVjdGVkID0gcHJlZnMuYXV0b1NjcmVlbnNob3RcbiAgICAgICYmICFzaG91bGRTa2lwU2NyZWVuc2hvdChtLmVudHJ5LnVybCA/PyAnJylcbiAgICAgICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIGlmIChzaG90RGF0YVVybCB8fCBzaG90RXhwZWN0ZWQpIHtcbiAgICAgIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXcuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgLy8gUmVzZXJ2ZSB2ZXJ0aWNhbCBzcGFjZSBpbW1lZGlhdGVseSBmcm9tIHRoZSBlbGVtZW50J3Mgd2lkdGgvaGVpZ2h0LlxuICAgICAgLy8gVGhlIHRodW1ibmFpbCBpcyByZW5kZXJlZCBhdCB0aGUgYnViYmxlJ3MgY29udGVudCB3aWR0aCwgc28gdGhlIGJveFxuICAgICAgLy8gaGVpZ2h0IHRyYWNrcyB0aGUgZWxlbWVudCdzIGFzcGVjdCByYXRpby4gQ2xhbXAgc28gYSB2ZXJ5IHRhbGxcbiAgICAgIC8vIGVsZW1lbnQgZG9lc24ndCByZXNlcnZlIGFuIGFic3VyZCBhbW91bnQgb2Ygc3BhY2UuXG4gICAgICBjb25zdCByID0gbS5lbnRyeS5yZWN0O1xuICAgICAgaWYgKHIgJiYgci53ID4gMCAmJiByLmggPiAwKSB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gTWF0aC5taW4oTWF0aC5tYXgoci5oIC8gci53LCAwLjEyKSwgMi4yKTtcbiAgICAgICAgcHJldmlldy5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zaG90LXJhdGlvJywgU3RyaW5nKHJhdGlvKSk7XG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgncmVzZXJ2ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaG90RGF0YVVybCkge1xuICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nLmNsYXNzTmFtZSA9ICdzaG90JztcbiAgICAgICAgaW1nLmFsdCA9IGBTY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gO1xuICAgICAgICAvLyBSZXZlYWwgb25seSBvbmNlIGRlY29kZWQgc28gdGhlIHN3YXAgaXMgaW5zdGFudCBhbmQgcmVmbG93LWZyZWU7XG4gICAgICAgIC8vIHRoZSBza2VsZXRvbiBzdGF5cyB2aXNpYmxlIHVuZGVybmVhdGggdW50aWwgdGhlbi5cbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpKTtcbiAgICAgICAgaW1nLnNyYyA9IHNob3REYXRhVXJsO1xuICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChpbWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gc2hvdCB5ZXQg4oCUIHNob3cgYSBza2VsZXRvbiBzaGltbWVyIG9jY3VweWluZyB0aGUgcmVzZXJ2ZWQgc3BhY2UuXG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuICAgICAgICBjb25zdCBza2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNrZWwuY2xhc3NOYW1lID0gJ3Nob3Qtc2tlbGV0b24nO1xuICAgICAgICBza2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBMb2FkaW5nIHNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChza2VsKTtcbiAgICAgIH1cbiAgICAgIGRpdi5hcHBlbmQocHJldmlldyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0cy5jbGFzc05hbWUgPSAnZW50LXN0YXRzJztcbiAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgIGNvbnN0IG15VG9rZW5zID0gdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtLmVudHJ5KSk7XG4gICAgY29uc3QgdG90YWxUb2tlbnMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobW0pOiBtbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5yZWR1Y2UoKHMsIG1tKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtbS5lbnRyeSkpLCAwKTtcbiAgICBjb25zdCBzaGFyZVBjdCA9IHRvdGFsVG9rZW5zID4gMCA/IE1hdGgucm91bmQoKG15VG9rZW5zIC8gdG90YWxUb2tlbnMpICogMTAwKSA6IDA7XG4gICAgY29uc3QgZ3JvdXBDb3VudCA9IG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGdyb3VwVG9rZW5zID0gKG0uZW50cnkuZ3JvdXAgPz8gW10pLnJlZHVjZSgocywgZykgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkoZykpLCAwKTtcbiAgICB0eXBlIFN0YXRDZWxsID0ge2xhYmVsOiBzdHJpbmc7IHZhbHVlOiBzdHJpbmc7IHRpcDogc3RyaW5nfTtcbiAgICBjb25zdCBjZWxsczogU3RhdENlbGxbXSA9IFtcbiAgICAgIHtsYWJlbDogJ0hUTUwnLCB2YWx1ZTogYCR7bS5lbnRyeS5vdXRlckhUTUw/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ091dGVyIEhUTUwgY2hhciBsZW5ndGgnfSxcbiAgICAgIHtsYWJlbDogJ1Rva2VucycsIHZhbHVlOiBgJHtteVRva2Vuc31gLCB0aXA6ICdBcHByb3ggTExNIHRva2VucyBmb3IgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnU2hhcmUnLCB2YWx1ZTogYCR7c2hhcmVQY3R9JWAsIHRpcDogJ1Rva2VuIHNoYXJlIG9mIGFsbCBzZWxlY3RvcnMnfSxcbiAgICAgIHtsYWJlbDogJ0NvbW1lbnRzJywgdmFsdWU6IGAke2ZiLmxlbmd0aH1gLCB0aXA6ICdJbmxpbmUgY29tbWVudHMgdGhyZWFkZWQgdW5kZXIgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnUnVsZXMnLCB2YWx1ZTogYCR7bS5lbnRyeS5tYXRjaGVkUnVsZXM/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ01hdGNoZWQgQ1NTIHJ1bGVzJ30sXG4gICAgICB7bGFiZWw6ICdTdHlsZXMnLCB2YWx1ZTogYCR7T2JqZWN0LmtleXMobS5lbnRyeS5zdHlsZXMgPz8ge30pLmxlbmd0aH1gLCB0aXA6ICdDb21wdXRlZC1zdHlsZSBmaWVsZHMga2VwdCd9LFxuICAgIF07XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAnLCB2YWx1ZTogYCR7Z3JvdXBDb3VudH1gLCB0aXA6ICdNZW1iZXJzIGZvbGRlZCBpbnRvIHRoaXMgZ3JvdXAnfSk7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwIFQnLCB2YWx1ZTogYCR7Z3JvdXBUb2tlbnN9YCwgdGlwOiAnVG9rZW5zIGNvbnRyaWJ1dGVkIGJ5IGdyb3VwIG1lbWJlcnMnfSk7XG4gICAgfVxuICAgIHN0YXRzLmlubmVySFRNTCA9IGNlbGxzLm1hcCgoYykgPT5cbiAgICAgIGA8c3BhbiBjbGFzcz1cImVudC1zdGF0XCIgZGF0YS10aXA9XCIke2VzY2FwZUh0bWwoYy50aXApfVwiPjxzcGFuIGNsYXNzPVwibGJsXCI+JHtjLmxhYmVsfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbFwiPiR7Yy52YWx1ZX08L3NwYW4+PC9zcGFuPmAsXG4gICAgKS5qb2luKCcnKTtcbiAgICBkaXYuYXBwZW5kKHN0YXRzKTtcblxuICAgIC8vIOKUgOKUgCBKU09OIHBhbmUgd2l0aCB0b29sYmFyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vIFRvb2xiYXIgYWJvdmUgdGhlIEpTT04gYm9keTogbGVmdCA9IGxpbmUtd3JhcCB0b2dnbGUsIHJpZ2h0ID0gY29weS5cbiAgICAvLyBUaGUgSlNPTiBpdHNlbGYgcmVmbGVjdHMgdGhlIGdsb2JhbCBgbWluaWZ5YCBzZXR0aW5nIHNvIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgc2FtZSBzaGFwZSB0aGF0IHdpbGwgZW5kIHVwIGluIHRoZSBleHBvcnQuXG4gICAgY29uc3QganNvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uV3JhcC5jbGFzc05hbWUgPSAnYm9keS1qc29uLXdyYXAnO1xuICAgIGNvbnN0IGpzb25CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uQmFyLmNsYXNzTmFtZSA9ICdib2R5LWpzb24tYmFyJztcblxuICAgIC8vIExpbmUtd3JhcCBjaGVja2JveCAocGVyLWJ1YmJsZSBsb2NhbCBzdGF0ZSwgZGVmYXVsdCBPTikuIFdoZW4gT04gdGhlXG4gICAgLy8gSlNPTiBpcyBmbGF0dGVuZWQgdG8gT05FIG1pbmlmaWVkIGxpbmUgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZSBidWJibGVcbiAgICAvLyB3aWR0aCAobm8gaG9yaXpvbnRhbCBzY3JvbGwpOyB3aGVuIE9GRiBpdCBmYWxscyBiYWNrIHRvIHRoZSBnbG9iYWxcbiAgICAvLyBtaW5pZnktcmVzcGVjdGluZyBwcmV0dHkvY29tcGFjdCBmb3JtIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgY29uc3Qgd3JhcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB3cmFwTGFiZWwuY2xhc3NOYW1lID0gJ2pzb24td3JhcC10b2dnbGUnO1xuICAgIHdyYXBMYWJlbC5kYXRhc2V0LnRpcCA9ICdGbGF0dGVuIHRvIGEgc2luZ2xlIHNvZnQtd3JhcHBpbmcgbGluZSBpbnN0ZWFkIG9mIGhvcml6b250YWwgc2Nyb2xsJztcbiAgICBjb25zdCB3cmFwQ2hlY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHdyYXBDaGVjay50eXBlID0gJ2NoZWNrYm94JztcbiAgICB3cmFwQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgd3JhcExhYmVsLmFwcGVuZCh3cmFwQ2hlY2ssIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgV3JhcCcpKTtcbiAgICBqc29uQmFyLmFwcGVuZCh3cmFwTGFiZWwpO1xuXG4gICAgLy8gQ29weSBidXR0b24gKG1pcnJvcnMgdGhlIFwiQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTlwiIGFjdGlvbiBiZWxvdyxcbiAgICAvLyBzdXJmYWNlZCBhdCB0aGUgdG9wIHNvIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBzY3JvbGwgcGFzdCB0aGUgSlNPTlxuICAgIC8vIHRvIGZpbmQgaXQpLlxuICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb3B5QnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb3B5QnRuLmNsYXNzTmFtZSA9ICdpY29uYnRuIGpzb24tY29weSc7XG4gICAgY29weUJ0bi5kYXRhc2V0LnRpcCA9ICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJztcbiAgICBjb3B5QnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb3B5IGNhcHR1cmUgYXMgSlNPTicpO1xuICAgIGNvcHlCdG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjb3B5JywgMTMpO1xuICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIC8vIEZ1bGwgc2luZ2xlLWNhcHR1cmUgZXhwb3J0OiBpZGVudGl0eSArIHBhdGhzICsgdGV4dC9jb250ZW50ICsgZXZlcnlcbiAgICAgIC8vIGF0dGFjaGVkIG5vdGUvY29tbWVudCDigJQgdGhlIHNhbWUgZGVwdGggYXMgYSBmdWxsIGV4cG9ydCwgc2NvcGVkIHRvXG4gICAgICAvLyB0aGlzIG9uZSBjYXB0dXJlIChpdGVtIDcpLiBEaXN0aW5jdCBmcm9tIHRoZSByYXcgZW50cnkgc2hvd24gYmVsb3cuXG4gICAgICBjb25zdCBmZWVkYmFjayA9IG1lc3NhZ2VzLmZsYXRNYXAoKHgpID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LnBhcmVudFVpZCA9PT0gbS5lbnRyeS51aWRcbiAgICAgICAgPyBbe3RleHQ6IHgudGV4dCwgdHM6IHgudHMsIHVpZDogeC5pZCwgcGFyZW50VWlkOiB4LnBhcmVudFVpZH1dIDogW10pO1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplQ2FwdHVyZUpzb24oe2VudHJ5OiBtLmVudHJ5LCBmZWVkYmFja30pKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNhcHR1cmUgZXhwb3J0Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY2FwdHVyZScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSk7XG4gICAganNvbkJhci5hcHBlbmQoY29weUJ0bik7XG4gICAganNvbldyYXAuYXBwZW5kKGpzb25CYXIpO1xuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvZHkuY2xhc3NOYW1lID0gJ2JvZHktanNvbiB3cmFwLW9uJztcbiAgICAvLyBSZW5kZXIgdGhlIEpTT04gdG8gbWF0Y2ggdGhlIHdyYXAgc3RhdGU6XG4gICAgLy8gICB3cmFwIE9OICDihpIgYSBzaW5nbGUgbWluaWZpZWQgbGluZSAoaW5kZW50IDApIHRoYXQgc29mdC13cmFwcyB0byB0aGVcbiAgICAvLyAgICAgICAgICAgICAgYnViYmxlIHdpZHRoIChDU1MgaGFuZGxlcyB0aGUgdmlzdWFsIHdyYXBwaW5nIHZpYVxuICAgIC8vICAgICAgICAgICAgICBvdmVyZmxvdy13cmFwOmFueXdoZXJlKSwgc28gdGhlIHdob2xlIG9iamVjdCBpcyBvbmVcbiAgICAvLyAgICAgICAgICAgICAgY29udGludW91cyBzdHJpbmcgd2l0aCBubyBob3Jpem9udGFsIHNjcm9sbC5cbiAgICAvLyAgIHdyYXAgT0ZGIOKGkiB0aGUgZ2xvYmFsIG1pbmlmeS1yZXNwZWN0aW5nIGZvcm06IHByZXR0eS1wcmludGVkIGZ1bGxcbiAgICAvLyAgICAgICAgICAgICAgZW50cnksIG9yIHRoZSBzbGltRW50cnkgY29tcGFjdCBmb3JtIHdoZW4gbWluaWZ5IGlzIG9uLFxuICAgIC8vICAgICAgICAgICAgICB3aXRoIGhvcml6b250YWwgc2Nyb2xsIGZvciBsb25nIGxpbmVzLlxuICAgIGNvbnN0IHJlbmRlckpzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gJyc7XG4gICAgICBjb25zdCB3cmFwcGVkID0gd3JhcENoZWNrLmNoZWNrZWQ7XG4gICAgICBjb25zdCBwYXlsb2FkID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IHNsaW1FbnRyeShtLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlfSkgOiBtLmVudHJ5O1xuICAgICAgY29uc3QgaW5kZW50ID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IDAgOiAyO1xuICAgICAgY29uc3QgdGV4dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIGluZGVudCk7XG4gICAgICBhcHBlbmRKc29uSGlnaGxpZ2h0KGJvZHksIHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICByZW5kZXJKc29uKCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG5cbiAgICAgIH0gZWxzZSBzZXRTdGF0dXMoJ1JlLWNhcHR1cmUgZmFpbGVkJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSB0aGlzIGNhcHR1cmUgYXMgYSBmdWxsIGV4cG9ydCAocGF0aHMsIHRleHQsIGNvbW1lbnRzKScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmVlZGJhY2sgPSAobTogRmVlZGJhY2tNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2snO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIGRpdi5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2gobS50ZXh0LCBzZWFyY2hRdWVyeSk7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkge1xuICAgICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IHNlbGVjdG9yIOKAlCBwcmVmZXIgcGFyZW50VWlkICh0aGUgcGVyc2lzdGVkIEZLKVxuICAgICAgLy8gb3ZlciBjYXB0dXJlLWFkamFjZW5jeSwgc2luY2UgZHJhZy10by1yZXBhcmVudCBtb3ZlcyB0aGUgY2hpcCBidXRcbiAgICAgIC8vIHRoZSB0cmFpbGluZy1zZWxlY3RvciBoZXVyaXN0aWMgZ2l2ZXMgc3RhbGUgcmVzdWx0cyB1bnRpbCByZW5kZXJcbiAgICAgIC8vIHNldHRsZXMuIFRoZSBhbm5vdGF0aW9uIG92ZXJsYXkgbmVlZHMgdGhlIHBhcmVudCdzIHNlbGVjdG9yIHRvXG4gICAgICAvLyBhbmNob3IgdGhlIG9uLXBhZ2UgdG9vbHRpcC5cbiAgICAgIGNvbnN0IHtwYXJlbnRTZWwsIHBhcmVudFVpZH0gPSAoKCkgPT4ge1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHtcbiAgICAgICAgICBjb25zdCBwID0gbWVzc2FnZXMuZmluZChcbiAgICAgICAgICAgIChtbSkgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAobW0gYXMgU2VsZWN0b3JNZXNzYWdlKS5lbnRyeS51aWQgPT09IG0ucGFyZW50VWlkLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHAgJiYgcC50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4ge3BhcmVudFNlbDogcC5lbnRyeS5zZWxlY3RvciwgcGFyZW50VWlkOiBwLmVudHJ5LnVpZH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtwYXJlbnRTZWw6IGxhc3RTZWxlY3RvclNlbCwgcGFyZW50VWlkOiB1bmRlZmluZWQgYXMgc3RyaW5nIHwgdW5kZWZpbmVkfTtcbiAgICAgIH0pKCk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICAvLyBTY3JvbGwgdGhlIHBhcmVudCBlbGVtZW50IGludG8gdmlldyArIHNob3cgdGhlIG9uLXBhZ2VcbiAgICAgICAgLy8gYW5ub3RhdGlvbiB0b29sdGlwIHJlbmRlcmluZyBUSElTIGNvbW1lbnQncyB0ZXh0LiBQYXNzIHRoZVxuICAgICAgICAvLyBwYXJlbnQncyB1aWQgc28gYSBzYW1lLXNlbGVjdG9yIHNpYmxpbmcgY2FwdHVyZSBkb2Vzbid0IGdldFxuICAgICAgICAvLyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgXCJ0aGUgc2FtZSB0YXJnZXRcIiBieSB0aGUgY29udGVudFxuICAgICAgICAvLyBzY3JpcHQncyBhbm5vdGF0aW9uIG92ZXJsYXkuXG4gICAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSB7XG4gICAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogcGFyZW50U2VsLCBzdGlja3k6IHRydWV9KTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kVG9DUyh7XG4gICAgICAgICAga2luZDogJ2Fubm90YXRpb24nLFxuICAgICAgICAgIHNlbGVjdG9yOiBwYXJlbnRTZWwsXG4gICAgICAgICAgcGF5bG9hZDoge3NlbGVjdG9yOiBwYXJlbnRTZWwsIHVpZDogcGFyZW50VWlkLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2s6IFttLnRleHRdfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkaXYuZGF0YXNldC5jb21tZW50SWQgPSBtLmlkO1xuICAgIGNvbnN0IGJlZ2luQ29tbWVudERyYWcgPSAoZTogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JywgbS5pZCk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgndGV4dC9wbGFpbicsIG0udGV4dCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgfTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYWN0aW9ucy5jbGFzc05hbWUgPSAnYWN0aW9ucyc7XG4gICAgY29uc3QgZHJhZ0hhbmRsZSA9IGFjdGlvbkJ0bignZ3JpcCcsICdEcmFnIHRoaXMgaGFuZGxlIG9udG8gYSBzZWxlY3RvciB0byByZXBhcmVudCcsICgpID0+IHsgLyogZHJhZyBoYW5kbGUgb25seSAqLyB9KTtcbiAgICBkcmFnSGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2RyYWctaGFuZGxlJyk7XG4gICAgZHJhZ0hhbmRsZS5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgYmVnaW5Db21tZW50RHJhZyk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZHJhZ0hhbmRsZSk7XG4gICAgLy8gRGV0YWNoIOKAlCB0aGUgaW52ZXJzZSBvZiBkcmFnLXRvLXJlcGFyZW50LiBPbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVcbiAgICAvLyBjb21tZW50IGN1cnJlbnRseSByZWFkcyBhcyB0aHJlYWRlZCAoRksgb3IgYWRqYWNlbmN5KS5cbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsIHx8IG0ucGFyZW50VWlkKSB7XG4gICAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3VubGluaycsICdEZXRhY2ggZnJvbSBpdHMgY2FwdHVyZSDigJQgbWFrZSB0aGlzIGEgc3RhbmRhbG9uZSBjb21tZW50JywgKCkgPT4ge1xuICAgICAgICAvLyBSZXNvbHZlIGJ5IGlkIGZyb20gdGhlIExJVkUgYXJyYXk6IHdvcmtzcGFjZSBzd2l0Y2hlcyBhbmRcbiAgICAgICAgLy8gdW5kby9yZWRvIHJlYXNzaWduIGBtZXNzYWdlc2AsIHNvIHRoZSBjbG9zdXJlJ3MgYG1gIGNhbiBiZSBhXG4gICAgICAgIC8vIHN0YWxlIG9iamVjdCB3aG9zZSBtdXRhdGlvbiB3b3VsZCBiZSBzaWxlbnRseSBkcm9wcGVkIGJ5IHRoZVxuICAgICAgICAvLyBuZXh0IHBlcnNpc3QoKS5cbiAgICAgICAgY29uc3QgbGl2ZSA9IG1lc3NhZ2VzLmZpbmQoKHgpOiB4IGlzIEZlZWRiYWNrTWVzc2FnZSA9PiB4LnR5cGUgPT09ICdmZWVkYmFjaycgJiYgeC5pZCA9PT0gbS5pZCk7XG4gICAgICAgIGlmICghbGl2ZSkgeyBzZXRTdGF0dXMoJ0NvbW1lbnQgbm8gbG9uZ2VyIGV4aXN0cycsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIGRlbGV0ZSBsaXZlLnBhcmVudFVpZDtcbiAgICAgICAgbGl2ZS5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cygnQ29tbWVudCBkZXRhY2hlZCDigJQgZHJhZyBpdHMgaGFuZGxlIG9udG8gYSBjYXB0dXJlIHRvIHJlYXR0YWNoJyk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IGNvbW1lbnQgdGV4dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KG0udGV4dCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY29tbWVudCcpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3BlbmNpbCcsICdFZGl0IGNvbW1lbnQnLCAoKSA9PiBlbnRlckZlZWRiYWNrRWRpdChkaXYsIG0pLCB7c2l6ZTogMTV9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgLy8gRHJvcCBoYW5kbGVyIHNoYXJlZCBieSBldmVyeSBzZWxlY3RvciBidWJibGUuIEFjY2VwdHMgYSBkcmFnZ2VkXG4gIC8vIGNvbW1lbnQgSUQgdmlhIHRoZSBgYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudGAgTUlNRSwgdXBkYXRlc1xuICAvLyBwYXJlbnRVaWQgKyBhZGphY2VuY3ksIHBlcnNpc3RzLCByZS1yZW5kZXJzLlxuICBjb25zdCB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IFNlbGVjdG9yTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICBjb25zdCB0eXBlcyA9IGUuZGF0YVRyYW5zZmVyPy50eXBlcztcbiAgICAgIGlmICghdHlwZXMgfHwgIUFycmF5LmZyb20odHlwZXMpLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JykpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcm9wLXRhcmdldCcpO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZSkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyPy5nZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50Jyk7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBzcmNJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gaWQpO1xuICAgICAgaWYgKHNyY0lkeCA8IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHNyYyA9IG1lc3NhZ2VzW3NyY0lkeF0hIGFzIEZlZWRiYWNrTWVzc2FnZTtcbiAgICAgIGlmIChzcmMudHlwZSAhPT0gJ2ZlZWRiYWNrJykgcmV0dXJuO1xuICAgICAgY29uc3QgZHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgaWYgKGRzdElkeCA8IDApIHJldHVybjtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICAvLyBVcGRhdGUgdGhlIEZLIHBvaW50ZXIgZmlyc3Qg4oCUIHRoYXQncyB0aGUgc291cmNlIG9mIHRydXRoIGluXG4gICAgICAvLyBleHBvcnRzLiBBZGphY2VuY3kgaXMganVzdCBhIHJlbmRlciBjb252ZW5pZW5jZS4gUmVwYXJlbnRpbmcgaXNcbiAgICAgIC8vIHRoZSBpbnZlcnNlIG9mIGRldGFjaCwgc28gdGhlIGRldGFjaGVkIGZsYWcgaXMgY2xlYXJlZC5cbiAgICAgIHNyYy5wYXJlbnRVaWQgPSBtLmVudHJ5LnVpZDtcbiAgICAgIGRlbGV0ZSBzcmMuZGV0YWNoZWQ7XG4gICAgICAvLyBTcGxpY2Ugc3JjIG91dCBvZiBpdHMgY3VycmVudCBzbG90IGFuZCByZS1pbnNlcnQgcmlnaHQgYWZ0ZXIgdGhlXG4gICAgICAvLyBuZXcgcGFyZW50IChhbmQgYW55IGZlZWRiYWNrIGFscmVhZHkgdHJhaWxpbmcgaXQsIHNvIHRoZSBtb3N0LVxuICAgICAgLy8gcmVjZW50IGZlZWRiYWNrIGVuZHMgdXAgbmVhcmVzdCB0aGUgcGFyZW50IHZpc3VhbGx5KS5cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShzcmNJZHgsIDEpO1xuICAgICAgY29uc3QgbmV3RHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgbGV0IGluc2VydEF0ID0gbmV3RHN0SWR4ICsgMTtcbiAgICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0hLnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHNyYyk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCByZXBhcmVudGVkJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdHlwZSBBY3Rpb25CdG5PcHRzID0ge3dhcm4/OiBib29sZWFuOyB0b2dnbGVkPzogYm9vbGVhbjsgc2l6ZT86IG51bWJlcn07XG4gIGNvbnN0IGFjdGlvbkJ0biA9IChpY29uOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGZuOiAoKSA9PiB2b2lkLCBvcHRzOiBBY3Rpb25CdG5PcHRzID0ge30pOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuZGF0YXNldC50aXAgPSB0aXRsZTtcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRpdGxlKTtcbiAgICBpZiAob3B0cy53YXJuKSBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBpZiAob3B0cy50b2dnbGVkKSBiLmNsYXNzTGlzdC5hZGQoJ3RvZ2dsZWQnKTtcbiAgICAvLyBEZWZhdWx0IGljb24gc2l6ZSAxMyByZWFkcyBzbGlnaHRseSBzbWFsbCBpbiBhIDIyw5cyMiBidXR0b24g4oCUIGZpbmVcbiAgICAvLyBmb3IgaWNvbnMgd2l0aCBzaW1wbGUgc2hhcGVzIChjcm9zc2hhaXIsIGxpc3QtdHJlZSwgdW5kbykgYnV0IHZpc2libHlcbiAgICAvLyBzcXVlZXplZCBmb3IgYG1lc3NhZ2Utc3F1YXJlLXBsdXNgIGFuZCBgcGVuY2lsYCwgd2hlcmUgdGhlXG4gICAgLy8gaW50ZXJpb3Igc3Ryb2tlcyB2YW5pc2ggaW50byBoYWlybGluZSBibHVyLiBDYWxsZXJzIGNhbiBidW1wIHdpdGhcbiAgICAvLyBgc2l6ZTogMTVgIGZvciB0aG9zZS5cbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhpY29uLCBvcHRzLnNpemUgPz8gMTMpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBmbigpOyB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBkZWxldGVCdG4gPSAob25Db25maXJtOiAoKSA9PiB2b2lkKTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBiLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSc7XG4gICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnRGVsZXRlIGNhcHR1cmUnKTtcbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZXZlcnRUaW1lciA9IDA7XG4gICAgY29uc3QgcmV2ZXJ0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbmZpcm0teWVzLCAuY29uZmlybS1ubycpKSBuLnJlbW92ZSgpO1xuICAgICAgaWYgKCFiLnBhcmVudEVsZW1lbnQpIHBhcmVudC5hcHBlbmQoYik7XG4gICAgICBjbGVhclRpbWVvdXQocmV2ZXJ0VGltZXIpO1xuICAgIH07XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcGFyZW50ID0gYi5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgeWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB5ZXMudHlwZSA9ICdidXR0b24nO1xuICAgICAgeWVzLmNsYXNzTmFtZSA9ICdjb25maXJtLXllcyc7XG4gICAgICB5ZXMuZGF0YXNldC50aXAgPSAnQ29uZmlybSBkZWxldGUnO1xuICAgICAgeWVzLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb25maXJtIGRlbGV0ZScpO1xuICAgICAgeWVzLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAxMyk7XG4gICAgICB5ZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyBvbkNvbmZpcm0oKTsgfSk7XG4gICAgICBjb25zdCBubyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgbm8udHlwZSA9ICdidXR0b24nO1xuICAgICAgbm8uY2xhc3NOYW1lID0gJ2NvbmZpcm0tbm8nO1xuICAgICAgbm8uZGF0YXNldC50aXAgPSAnQ2FuY2VsIGRlbGV0ZSc7XG4gICAgICBuby5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIGRlbGV0ZScpO1xuICAgICAgbm8uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgICAgbm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyB9KTtcbiAgICAgIGIucmVwbGFjZVdpdGgoeWVzKTtcbiAgICAgIHllcy5hZnRlcihubyk7XG4gICAgICByZXZlcnRUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHJldmVydCwgODAwMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZW50ZXJGZWVkYmFja0VkaXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogRmVlZGJhY2tNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5leHQuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayBlZGl0aW5nJztcbiAgICBpZiAoZGl2LmNsYXNzTGlzdC5jb250YWlucygndGhyZWFkZWQnKSkgbmV4dC5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIG5leHQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgbmV4dC5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgIGluaXRpYWw6IG0udGV4dCxcbiAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGRpdi5yZXBsYWNlV2l0aChkaXYuY2xvbmVOb2RlKHRydWUpKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvblN1Ym1pdDogKHRleHQpID0+IHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkID09PSBtLnRleHQpIHsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLnRleHQgPSB0cmltbWVkO1xuICAgICAgICAvLyBTZXZlcml0eSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFVJLiBTdHJpcCBhbnkgbGVnYWN5IHZhbHVlXG4gICAgICAgIC8vIHRoYXQgY2FtZSBiYWNrIGZyb20gYW4gb2xkZXIgSlNPTkwgaW1wb3J0IHNvIHNhdmVzIGRvbid0IGtlZXBcbiAgICAgICAgLy8gcmUtZW1pdHRpbmcgaXQuXG4gICAgICAgIGRlbGV0ZSAobSBhcyBhbnkpLnNldmVyaXR5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICB9KSk7XG4gICAgZGl2LnJlcGxhY2VXaXRoKG5leHQpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZU1lc3NhZ2UgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5pZCAhPT0gaWQpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0RlbGV0ZWQnKTtcbiAgICB9O1xuICAgIGlmICghZWwpIHsgZmluaXNoKCk7IHJldHVybjsgfVxuICAgIGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdyZW1vdmluZycpO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpOiB2b2lkID0+IHsgaWYgKGRvbmUpIHJldHVybjsgZG9uZSA9IHRydWU7IGZpbmlzaCgpOyB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBjbGVhbnVwLCB7b25jZTogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoY2xlYW51cCwgMzgwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQ29tcG9zZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRGZWVkYmFjayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gY29tcG9zZXIudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBpbi1tZW1vcnkgbWVzc2FnZSBhdCBjcmVhdGlvbiB0aW1lIHNvIHRoZVxuICAgIC8vIEZLIGlzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoLiBUaGUgc2xpbSBlbWl0IG5vIGxvbmdlciBoYXMgdG9cbiAgICAvLyBpbmZlciB0aGUgcGFyZW50IGZyb20gY2FwdHVyZS1hZGphY2VuY3ksIGFuZCBgbWFuaWZlc3QuY291bnRzYFxuICAgIC8vIGFjY3VyYXRlbHkgcmVmbGVjdHMgZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMuXG4gICAgLy8gV2FsayBiYWNrIHRvIHRoZSBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3RvciBiZWZvcmUgc3BsaWNlLlxuICAgIGxldCBwSWR4ID0gcG9zaXRpb24gLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfSk7XG4gICAgY29tcG9zZXIudmFsdWUgPSAnJztcbiAgICB1cGRhdGVDb21wb3Nlck1ldGVyKCk7XG4gICAgLy8gU2VuZGluZyBjbGVhcnMgYW55IGFjdGl2ZSB2aXN1YWwgZmluZCBzbyB0aGUgbmV3IGNvbW1lbnQgaXNuJ3QgaGlkZGVuXG4gICAgLy8gYmVoaW5kIGEgc3RhbGUgZmlsdGVyLlxuICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnU2VudCcpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgLy8gQnVnICMyOiBmZWVkYmFjaydzIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAhcGFyZW50LmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudCBhcyBTZWxlY3Rvck1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgKGUpID0+IHtcbiAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIoKTtcbiAgICAgIGlmICghaGFuZGxlZCkgc2VuZEZlZWRiYWNrKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlQ29tcG9zZXJNZXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ID0gY29tcG9zZXIudmFsdWU7XG4gICAgY29tcFdvcmRzLnRleHRDb250ZW50ID0gU3RyaW5nKHdvcmRDb3VudCh0KSk7XG4gICAgY29tcFRva2Vucy50ZXh0Q29udGVudCA9IFN0cmluZyh0b2tlbkNvdW50KHQpKTtcbiAgICBjb21wb3Nlci5jbGFzc0xpc3QudG9nZ2xlKCdjbWQtbW9kZScsIC9ePi8udGVzdCh0LnRyaW0oKSkpO1xuICB9O1xuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHVwZGF0ZUNvbXBvc2VyTWV0ZXIpO1xuXG4gIC8vIOKUgOKUgCBIZWFkZXIgc2VhcmNoIOKGkiBjb21tYW5kIHBhbGV0dGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFRoZSBoZWFkZXIgc2VhcmNoIGFmZm9yZGFuY2Ugbm8gbG9uZ2VyIHJ1bnMgaXRzIG93biBmaWx0ZXI7IGNsaWNraW5nIG9yXG4gIC8vIGZvY3VzaW5nIGl0IG9wZW5zIHRoZSBDbWQrSyBjb21tYW5kIHBhbGV0dGUgKHdoaWNoIHNlYXJjaGVzIGNhcHR1cmVzIEFORFxuICAvLyBydW5zIGNvbW1hbmRzKS4gSXQncyBhIHJlYWRvbmx5IHRyaWdnZXIsIHNvIHdlIGp1c3Qgb3BlbiB0aGUgcGFsZXR0ZSBhbmRcbiAgLy8gZHJvcCBmb2N1cyBzbyB0aGUgcGFsZXR0ZSBpbnB1dCB0YWtlcyBvdmVyIGNsZWFubHkuXG4gIGNvbnN0IHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSByZXR1cm47XG4gICAgb3BlblBhbGV0dGUoKTtcbiAgICBzZWFyY2guYmx1cigpO1xuICB9O1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2goKTsgfVxuICB9KTtcblxuICAvLyDilIDilIAgQ3RybCtGIHZpc3VhbCBmaW5kIChpbi1saXN0IGZpbHRlciArIGhpZ2hsaWdodCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybjtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY29uc3QgZmlyc3RIaXQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnLnNlbGVjdG9yLnNlYXJjaC1oaXQnKTtcbiAgICAgIGlmIChmaXJzdEhpdCkge1xuICAgICAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGZpcnN0SGl0KTtcbiAgICAgICAgY29uc3QgbWsgPSBmaXJzdEhpdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignbWFyaycpO1xuICAgICAgICBpZiAobWspIGNlbnRlckVsZW1lbnRJbkxpc3QobWspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlyc3RNYXRjaCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cgbWFyaycpO1xuICAgICAgICBpZiAoZmlyc3RNYXRjaCkgY2VudGVyRWxlbWVudEluTGlzdChmaXJzdE1hdGNoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlRmluZENvdW50ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZENvdW50KSByZXR1cm47XG4gICAgZmluZENvdW50LnRleHRDb250ZW50ID0gc2VhcmNoUXVlcnkgPyBgJHtsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cnKS5sZW5ndGh9IG1hdGNoYCA6ICcnO1xuICB9O1xuICBjb25zdCBhcHBseUZpbmQgPSAodmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHNlYXJjaFF1ZXJ5ID0gdmFsdWUudHJpbSgpO1xuICAgIHJlbmRlcigpO1xuICAgIHVwZGF0ZUZpbmRDb3VudCgpO1xuICAgIHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3KCk7XG4gIH07XG4gIGNvbnN0IG9wZW5GaW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZEJhciB8fCAhZmluZElucHV0KSByZXR1cm47XG4gICAgZmluZEJhci5oaWRkZW4gPSBmYWxzZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LmFkZCgnZmluZC1vcGVuJyk7XG4gICAgZmluZElucHV0LmZvY3VzKCk7XG4gICAgZmluZElucHV0LnNlbGVjdCgpO1xuICB9O1xuICBjb25zdCBjbG9zZUZpbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGZpbmRCYXIpIGZpbmRCYXIuaGlkZGVuID0gdHJ1ZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LnJlbW92ZSgnZmluZC1vcGVuJyk7XG4gICAgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gJyc7XG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7IHNlYXJjaFF1ZXJ5ID0gJyc7IHJlbmRlcigpOyB9XG4gICAgdXBkYXRlRmluZENvdW50KCk7XG4gIH07XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiBhcHBseUZpbmQoZmluZElucHV0LnZhbHVlKSk7XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7IGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBjbG9zZUZpbmQoKTsgfSB9KTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZmluZC1jbGVhcl0nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUZpbmQpO1xuXG4gIGNvbnN0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgbSA9IC9ePlxccyooLispJC8uZXhlYyhjb21wb3Nlci52YWx1ZS50cmltKCkpO1xuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHNlbCA9IG1bMV0hLnRyaW0oKTtcbiAgICBpZiAoIXNlbCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbn0+KHtraW5kOiAnbWFudWFsLWNhcHR1cmUnLCBzZWxlY3Rvcjogc2VsfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgeyBjb21wb3Nlci52YWx1ZSA9ICcnOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IHNldFN0YXR1cygnQ2FwdHVyZWQgJyArIHNlbCk7IH1cbiAgICBlbHNlIHNldFN0YXR1cygnU2VsZWN0b3IgZGlkIG5vdCBtYXRjaDogJyArIHNlbCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBFeHBvcnQgYnVpbGRlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHYyIGV4cG9ydCBzaGFwZTogdG9wIGxldmVsIGtlZXBzIHVzZXItZmFjaW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkc1xuICAvLyAodWlkLCBuLCBzZWxlY3RvciwgdGV4dCwgcm9sZSwgYXR0cnMsIGhpbnRzLCBjbGFzc2VzLCBzdHlsZXMsIGNvbXBvbmVudCxcbiAgLy8gc3RhdGVzLCBzY3JlZW5zaG90LCBncm91cCkuIERpYWdub3N0aWMgLyBkZXRlY3Rpb24gbWV0YWRhdGEgbW92ZXMgdW5kZXJcbiAgLy8gYW4gYF9hdWRpdGAgbmFtZXNwYWNlIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIGluU2hhZG93RE9NLFxuICAvLyBwc2V1ZG9FbGVtZW50cywgbWF0Y2hlZFJ1bGVzLCB2aWV3cG9ydCkuIFRoZSB2ZXJzaW9uIG1hcmtlciBpcyBlbWl0dGVkXG4gIC8vIGFzIGB2OiAyYC4gSW1wb3J0ZXJzIGRldGVjdCBlaXRoZXIgdjEgKGZsYXQpIG9yIHYyIGFuZCBkZW5vcm1hbGl6ZS5cbiAgLy9cbiAgLy8gQWdncmVzc2l2ZSBtaW5pZnkgYWRkaXRpb25hbGx5IGRyb3BzIGZpZWxkcyB0aGUgc2VsZWN0b3IgYWxyZWFkeVxuICAvLyBpbXBsaWVzOiBhbmNlc3RvcnMsIHZpZXdwb3J0IChvbmUgcGVyIHBhZ2UpLCBjb21wb25lbnRSb290IHdoZW5cbiAgLy8gcmVkdW5kYW50IHdpdGggdGhlIHNlbGVjdG9yLCBhbmQgcHNldWRvRWxlbWVudHMuXG4gIGNvbnN0IHNsaW1FbnRyeSA9IChlOiBFbnRyeSwgb3B0czoge2luY2x1ZGVHcm91cD86IGJvb2xlYW47IGV2ZW50SW5kZXg/OiBudW1iZXI7IHZpc3VhbE9yZGVyPzogbnVtYmVyOyBncm91cFVpZD86IHN0cmluZ30gPSB7fSk6IFJlY29yZDxzdHJpbmcsIGFueT4gPT4ge1xuICAgIGNvbnN0IGluY2x1ZGVPdXRlciA9IHByZWZzLmluY2x1ZGVPdXRlckhUTUw7XG4gICAgY29uc3QgaW5jbHVkZU1hdGNoZWQgPSBwcmVmcy5pbmNsdWRlTWF0Y2hlZFJ1bGVzO1xuICAgIGNvbnN0IGluY2x1ZGVTdHlsZXMgPSBwcmVmcy5pbmNsdWRlU3R5bGVzO1xuICAgIGNvbnN0IG1pbmlmeSA9IHByZWZzLm1pbmlmeTtcblxuICAgIC8vIFRvcC1sZXZlbCB1c2VyLWZhY2luZyBmaWVsZHMuIE9yZGVyIG1hdHRlcnMgZm9yIG91dHB1dCByZWFkYWJpbGl0eSDigJRcbiAgICAvLyB3ZSB3YW50IGB2IC8gdHlwZSAvIHVpZCAvIG4gLyBzZWxlY3RvcmAgZmlyc3Qgc28gSlNPTkwgaXMgZ3JlcHBhYmxlLlxuICAgIC8vXG4gICAgLy8gYG5gIHN0YXlzIGFzIHRoZSBjYXB0dXJlLXNlcXVlbmNlIGRpc3BsYXkgbGFiZWwgZm9yIGJhY2t3YXJkc1xuICAgIC8vIGNvbXBhdGliaWxpdHkgd2l0aCB2MS92MiByZWFkZXJzIChhbmQgdGhlIHNpZGViYXIncyBcIiMzXCIgY2hpcHMpLlxuICAgIC8vIFRoZSBkaXNhbWJpZ3VhdGVkIGNvdXNpbnMgKGBjYXB0dXJlSW5kZXhgLCBgZXZlbnRJbmRleGAsXG4gICAgLy8gYHZpc3VhbE9yZGVyYCwgYGRpc3BsYXlMYWJlbGApIGxpdmUgb24gdGhlIHJvdyBzbyBhIGRvd25zdHJlYW1cbiAgICAvLyBhZ2VudCBjYW4gcGljayB3aGljaGV2ZXIgb3JkZXJpbmcgaXMgbWVhbmluZ2Z1bCDigJQgYnVnICMxMC5cbiAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICB2OiAyLFxuICAgICAgdHlwZTogJ3NlbGVjdG9yJyxcbiAgICAgIHVpZDogZS51aWQsXG4gICAgICBuOiBlLm4sXG4gICAgICB0czogZS50cyxcbiAgICAgIHVybDogZS51cmwsXG4gICAgICB0YWc6IGUudGFnLFxuICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsXG4gICAgICBjYXB0dXJlSW5kZXg6IGUubixcbiAgICAgIGRpc3BsYXlMYWJlbDogU3RyaW5nKGUubiksXG4gICAgfTtcbiAgICBpZiAob3B0cy5ldmVudEluZGV4ICE9PSB1bmRlZmluZWQpIG91dC5ldmVudEluZGV4ID0gb3B0cy5ldmVudEluZGV4O1xuICAgIGlmIChvcHRzLnZpc3VhbE9yZGVyICE9PSB1bmRlZmluZWQpIG91dC52aXN1YWxPcmRlciA9IG9wdHMudmlzdWFsT3JkZXI7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUudGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQudGV4dCA9IG1pbmlmeSA/IGUudGV4dC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS50ZXh0O1xuICAgIGlmIChlLnJvbGUgIT09IHVuZGVmaW5lZCkgb3V0LnJvbGUgPSBlLnJvbGU7XG4gICAgaWYgKGUuYWNjZXNzaWJsZU5hbWUgIT09IHVuZGVmaW5lZCkgb3V0LmFjY2Vzc2libGVOYW1lID0gbWluaWZ5ID8gZS5hY2Nlc3NpYmxlTmFtZS5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBpZiAoZS5pZCAhPT0gdW5kZWZpbmVkKSBvdXQuaWQgPSBlLmlkO1xuICAgIGlmIChlLnRlc3RJZCAhPT0gdW5kZWZpbmVkKSBvdXQudGVzdElkID0gZS50ZXN0SWQ7XG4gICAgaWYgKGUuY2xhc3NlcyAmJiBlLmNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICBvdXQuY2xhc3NlcyA9IChtaW5pZnkgJiYgZS5jbGFzc2VzLmxlbmd0aCA+IDgpID8gZS5jbGFzc2VzLnNsaWNlKDAsIDgpIDogZS5jbGFzc2VzO1xuICAgIH1cbiAgICBpZiAoZS5hdHRycyAmJiBPYmplY3Qua2V5cyhlLmF0dHJzKS5sZW5ndGgpIG91dC5hdHRycyA9IGUuYXR0cnM7XG4gICAgaWYgKGUuaGludHMgJiYgT2JqZWN0LmtleXMoZS5oaW50cykubGVuZ3RoKSBvdXQuaGludHMgPSBlLmhpbnRzO1xuICAgIGlmIChlLnJlY3QpIG91dC5yZWN0ID0gZS5yZWN0O1xuICAgIGlmIChlLnN0YXRlcyAmJiBlLnN0YXRlcy5sZW5ndGgpIG91dC5zdGF0ZXMgPSBlLnN0YXRlcztcbiAgICBpZiAoZS5jb21wb25lbnQpIG91dC5jb21wb25lbnQgPSBlLmNvbXBvbmVudDtcbiAgICAvLyBMb2NhdG9yLXF1YWxpdHkgZmllbGQuIFByb21vdGUgZXZlbiB3aGVuIG1pbmlmaWVkIOKAlCBpdCdzIGEgc2luZ2xlXG4gICAgLy8gc21hbGwgaW50IGFuZCBhIGRvd25zdHJlYW0gYWdlbnQgdXNlcyBpdCB0byBkZWNpZGUgd2hldGhlciB0b1xuICAgIC8vIHRydXN0IHRoZSBzZWxlY3Rvci5cbiAgICBpZiAoZS5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkgb3V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9IGUuc2VsZWN0b3JNYXRjaENvdW50O1xuICAgIGlmIChlLmExMXkpIG91dC5hMTF5ID0gZS5hMTF5O1xuICAgIGlmIChlLmFzc2V0cyAmJiBlLmFzc2V0cy5sZW5ndGgpIG91dC5hc3NldHMgPSBlLmFzc2V0cztcbiAgICBpZiAoZS5sYXlvdXRDb250ZXh0ICYmIGUubGF5b3V0Q29udGV4dC5sZW5ndGgpIG91dC5sYXlvdXRDb250ZXh0ID0gZS5sYXlvdXRDb250ZXh0O1xuICAgIGlmIChpbmNsdWRlT3V0ZXIgJiYgZS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb3V0Lm91dGVySFRNTCA9IG1pbmlmeSA/IGUub3V0ZXJIVE1MLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLm91dGVySFRNTDtcbiAgICB9XG4gICAgaWYgKGluY2x1ZGVTdHlsZXMgJiYgZS5zdHlsZXMgJiYgT2JqZWN0LmtleXMoZS5zdHlsZXMpLmxlbmd0aCkgb3V0LnN0eWxlcyA9IGUuc3R5bGVzO1xuICAgIGlmIChlLnNjcmVlbnNob3QpIHtcbiAgICAgIC8vIFBhdGggbm9ybWFsaXphdGlvbjogdGhlIGxpdmUgYGVudHJ5LnNjcmVlbnNob3QuZWxlbWVudGAgY2FycmllcyBhXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4ZWQgcGF0aCAoZS5nLiBgZGVmYXVsdC9zY3JlZW5zaG90cy9mb28ucG5nYClcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGJhY2tncm91bmQncyBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIEFQSSBzdGFtcHNcbiAgICAgIC8vIHRoZSB3b3Jrc3BhY2UgaW50byB0aGUgb24tZGlzayBwYXRoLiBCdXQgdGhlIC50YXIuenN0IGFyY2hpdmVcbiAgICAgIC8vIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZmxhdCBhdCBgc2NyZWVuc2hvdHMvZm9vLnBuZ2AsIHNvIHRoZVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeCB3b3VsZCByZXNvbHZlIHRvIG5vdGhpbmcgZm9yIGFuIGFnZW50IHRoYXRcbiAgICAgIC8vIGV4dHJhY3RlZCB0aGUgYXJjaGl2ZS4gU3RyaXAgdGhlIHdvcmtzcGFjZSBwcmVmaXggb24gZW1pdCBzb1xuICAgICAgLy8gZXZlcnkgcGF0aCBpcyB2YWxpZCByZWxhdGl2ZSB0byB0aGUgbWFuaWZlc3QncyBkZWNsYXJlZFxuICAgICAgLy8gYHBhdGhSb290YCAoYXJjaGl2ZSByb290IGZvciB0YXIuenN0OyB3b3Jrc3BhY2Ugcm9vdCBmb3IgcGxhaW5cbiAgICAgIC8vIEpTT05MIOKAlCBpLmUuLCBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICBjb25zdCBzdHJpcFdzID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGlmICghcCkgcmV0dXJuIHA7XG4gICAgICAgIC8vIFN0cmlwIGV4YWN0bHkgb25lIGxlYWRpbmcgYDx3b3Jrc3BhY2U+L2Agc2VnbWVudCBpZiBwcmVzZW50LlxuICAgICAgICBjb25zdCB3c1ByZWZpeCA9IGAke2FjdGl2ZVdzfS9gO1xuICAgICAgICByZXR1cm4gcC5zdGFydHNXaXRoKHdzUHJlZml4KSA/IHAuc2xpY2Uod3NQcmVmaXgubGVuZ3RoKSA6IHA7XG4gICAgICB9O1xuICAgICAgb3V0LnNjcmVlbnNob3QgPSB7Li4uZS5zY3JlZW5zaG90fTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5lbGVtZW50KSBvdXQuc2NyZWVuc2hvdC5lbGVtZW50ID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5lbGVtZW50KTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5ncm91cCkgb3V0LnNjcmVlbnNob3QuZ3JvdXAgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90Lmdyb3VwKTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5wYWdlKSBvdXQuc2NyZWVuc2hvdC5wYWdlID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5wYWdlKTtcbiAgICB9XG4gICAgLy8gUHJvbW90ZSBydW50aW1lL2JlaGF2aW9yIHNpZ25hbHMgdG8gdG9wLWxldmVsLiBUaGVzZSBhcmUgcHJpbWFyeVxuICAgIC8vIHNpZ25hbCBmb3IgdHJpYWdlIChldmVudHMgdGVsbHMgXCJ3aGljaCBoYW5kbGVyIHJhblwiLCBiZWhhdmlvckF0dHJzXG4gICAgLy8gdGVsbHMgXCJ3aGF0IHNlcnZlci1yZW5kZXJlZCBiaW5kaW5nIGRvZXMgdGhpcyBmaXJlXCIsIGNhbnZhc0NsaWNrXG4gICAgLy8gdGVsbHMgXCJ3aGVyZSBvbiB0aGUgY2hhcnQgd2FzIGNsaWNrZWRcIiwgZWRpdG9yIHRlbGxzIFwid2hpY2hcbiAgICAvLyByaWNoLXRleHQgbGlicmFyeSB3cmFwcyB0aGlzXCIsIGRvbU11dGF0aW9ucyB0ZWxscyBcIndoYXQgY2hhbmdlZFxuICAgIC8vIGJlZm9yZSB0aGUgY2xpY2tcIiwgaXNBbmltYXRpbmcgd2FybnMgYWJvdXQgdHJhbnNpZW50IHN0YXRlKS5cbiAgICBpZiAoZS5ldmVudHMgJiYgT2JqZWN0LmtleXMoZS5ldmVudHMpLmxlbmd0aCkgb3V0LmV2ZW50cyA9IGUuZXZlbnRzO1xuICAgIGlmIChlLmJlaGF2aW9yQXR0cnMgJiYgT2JqZWN0LmtleXMoZS5iZWhhdmlvckF0dHJzKS5sZW5ndGgpIG91dC5iZWhhdmlvckF0dHJzID0gZS5iZWhhdmlvckF0dHJzO1xuICAgIGlmIChlLmNhbnZhc0NsaWNrKSBvdXQuY2FudmFzQ2xpY2sgPSBlLmNhbnZhc0NsaWNrO1xuICAgIGlmIChlLmVkaXRvcikgb3V0LmVkaXRvciA9IGUuZWRpdG9yO1xuICAgIGlmIChlLmlzQW5pbWF0aW5nKSBvdXQuaXNBbmltYXRpbmcgPSB0cnVlO1xuICAgIGlmIChlLnNoYWRvd0hvc3QpIG91dC5zaGFkb3dIb3N0ID0gZS5zaGFkb3dIb3N0O1xuICAgIGlmIChlLnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQucmVuZGVyZWRUZXh0ID0gZS5yZW5kZXJlZFRleHQ7XG4gICAgaWYgKGUudHJ1bmNhdGVkICYmIE9iamVjdC5rZXlzKGUudHJ1bmNhdGVkKS5sZW5ndGgpIG91dC50cnVuY2F0ZWQgPSBlLnRydW5jYXRlZDtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS5kb21NdXRhdGlvbnMgJiYgZS5kb21NdXRhdGlvbnMubGVuZ3RoKSBvdXQuZG9tTXV0YXRpb25zID0gZS5kb21NdXRhdGlvbnM7XG5cbiAgICAvLyBfYXVkaXQ6IGRldGVjdGlvbiBjaGFpbiAmIGRpYWdub3N0aWMgc2hhcGUuXG4gICAgLy8gUkVBRE1FIGNsYWltZWQgYF9hdWRpdC5hbmNlc3RvcnNgIGFuZCBgX2F1ZGl0LmNvbXBvbmVudFJvb3RgIHdlcmVcbiAgICAvLyBhbHdheXMgcHJlc2VudCwgYnV0IHRoZSBzbGltIGVtaXQgZHJvcHBlZCB0aGVtIHdoZW5ldmVyXG4gICAgLy8gYG1pbmlmeTogdHJ1ZWAuIFRoZSBmaXg6IGVtaXQgZXZlcnkgZGVjbGFyZWQgYF9hdWRpdGAgZmllbGRcbiAgICAvLyB3aGVuZXZlciB0aGUgc291cmNlIGRhdGEgZXhpc3RzLCBhbmQgbGV0XG4gICAgLy8gYG1pbmlmeWAgc2xpbSBPTkxZIHRoZSBoaWdoLXZvbHVtZSBibG9ja3MgKG1hdGNoZWRSdWxlcyxcbiAgICAvLyBwc2V1ZG9FbGVtZW50cykuIFNtYWxsIHN0cnVjdHVyYWwgbWV0YWRhdGEgKGFuY2VzdG9ycyxcbiAgICAvLyBjb21wb25lbnRSb290LCB2aWV3cG9ydCkgc3Vydml2ZXMgbWluaWZ5IHNvIHRoZSBzY2hlbWEgY2xhaW1zXG4gICAgLy8gc3RheSBob25lc3QuXG4gICAgY29uc3QgYXVkaXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAoZS5hbmNlc3RvcnMgJiYgZS5hbmNlc3RvcnMubGVuZ3RoKSBhdWRpdC5hbmNlc3RvcnMgPSBlLmFuY2VzdG9ycztcbiAgICBpZiAoZS5jb21wb25lbnRSb290ICE9PSB1bmRlZmluZWQpIGF1ZGl0LmNvbXBvbmVudFJvb3QgPSBlLmNvbXBvbmVudFJvb3Q7XG4gICAgaWYgKGUuaW5TaGFkb3dET00pIGF1ZGl0LmluU2hhZG93RE9NID0gdHJ1ZTtcbiAgICBpZiAoZS5wc2V1ZG9FbGVtZW50cyAmJiBPYmplY3Qua2V5cyhlLnBzZXVkb0VsZW1lbnRzKS5sZW5ndGggJiYgIW1pbmlmeSkgYXVkaXQucHNldWRvRWxlbWVudHMgPSBlLnBzZXVkb0VsZW1lbnRzO1xuICAgIGlmIChpbmNsdWRlTWF0Y2hlZCAmJiBlLm1hdGNoZWRSdWxlcyAmJiBlLm1hdGNoZWRSdWxlcy5sZW5ndGgpIHtcbiAgICAgIGF1ZGl0Lm1hdGNoZWRSdWxlcyA9IG1pbmlmeVxuICAgICAgICA/IGUubWF0Y2hlZFJ1bGVzLm1hcCgocikgPT4ge1xuICAgICAgICAgIGNvbnN0IHIyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge3NlbGVjdG9yOiByLnNlbGVjdG9yfTtcbiAgICAgICAgICBpZiAoci5kZWNsYXJhdGlvbnMgJiYgT2JqZWN0LmtleXMoci5kZWNsYXJhdGlvbnMpLmxlbmd0aCkgcjIuZGVjbGFyYXRpb25zID0gci5kZWNsYXJhdGlvbnM7XG4gICAgICAgICAgaWYgKHIubWVkaWEpIHIyLm1lZGlhID0gci5tZWRpYTtcbiAgICAgICAgICByZXR1cm4gcjI7XG4gICAgICAgIH0pXG4gICAgICAgIDogZS5tYXRjaGVkUnVsZXM7XG4gICAgfVxuICAgIGlmIChlLnZpZXdwb3J0KSBhdWRpdC52aWV3cG9ydCA9IGUudmlld3BvcnQ7XG4gICAgaWYgKE9iamVjdC5rZXlzKGF1ZGl0KS5sZW5ndGgpIG91dC5fYXVkaXQgPSBhdWRpdDtcblxuICAgIC8vIEdyb3VwIGhlYWQgbGlua2FnZS4gUHJldmlvdXNseSB0aGUgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGBcbiAgICAvLyBjYXJyaWVkIGZ1bGwgbmVzdGVkIGVudHJ5IG9iamVjdHMuXG4gICAgLy8gVGhhdCBtYWRlIER1Y2tEQiBqb2lucyB1Z2x5IGFuZCBicm9rZSB0aGUgcnVsZSB0aGF0IGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3Igc2hvdWxkIGJlIGEgdG9wLWxldmVsIHJvdy4gV2Ugbm93IGVtaXQ6XG4gICAgLy8gICDigKIgb24gdGhlIGdyb3VwIGhlYWQ6IGBncm91cE1lbWJlclVpZHM6IFt1aWQsIHVpZCwgLi4uXWAgKGp1c3QgSURzKVxuICAgIC8vICAg4oCiIGVhY2ggbWVtYmVyIGFzIGl0cyBvd24gdG9wLWxldmVsIHNsaW0gcm93IHdpdGggYGdyb3VwVWlkYFxuICAgIC8vICAgICBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkIChoYW5kbGVkIGluIGBidWlsZFNsaW1gIGZsdXNoIGxvZ2ljKS5cbiAgICBpZiAob3B0cy5pbmNsdWRlR3JvdXAgJiYgZS5ncm91cCAmJiBlLmdyb3VwLmxlbmd0aCkge1xuICAgICAgb3V0Lmdyb3VwTWVtYmVyVWlkcyA9IGUuZ3JvdXAubWFwKChnKSA9PiBnLnVpZCkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cbiAgICBpZiAob3B0cy5ncm91cFVpZCkgb3V0Lmdyb3VwVWlkID0gb3B0cy5ncm91cFVpZDtcblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTaGFyZWQgXCJzbGltIGRhdGFcIiBwaXBlbGluZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gSlNPTkwgcmVuZGVycyBvZmYgdGhpcyBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb24uIChNYXJrZG93biB1c2VkIHRvXG4gIC8vIHNoYXJlIGl0OyB0aGUgTWFya2Rvd24gZXhwb3J0IHdhcyByZXRpcmVkIGluIGZhdm9yIG9mIEpTT05MLW9ubHkuKVxuICAvL1xuICAvLyB2MiBkaWZmZXJlbmNlcyB2cyB2MTpcbiAgLy8gICDigKIgU2VsZWN0b3IgbGluZXMgaGF2ZSBleHBsaWNpdCBgdHlwZTogJ3NlbGVjdG9yJ2AgYW5kIGB2OiAyYC5cbiAgLy8gICDigKIgX2F1ZGl0IG5lc3RzIGRldGVjdGlvbiAvIGRlYnVnIGZpZWxkcyAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCDigKYpLlxuICAvLyAgIOKAoiBGZWVkYmFjayBlbWl0cyBhcyBzdGFuZGFsb25lIGB7dHlwZTonZmVlZGJhY2snLCBwYXJlbnRVaWQsIOKApn1gIGxpbmVzXG4gIC8vICAgICBQTFVTIGJ1bmRsZWQgYGZlZWRiYWNrYCBhcnJheXMgb24gc2VsZWN0b3JzIChzbyBvbGQgc2luZ2xlLWxpbmVcbiAgLy8gICAgIHJlYWRlcnMgc3RpbGwgc2VlIHRoZW0gYWRqYWNlbnQpLlxuICAvLyAgIOKAoiBBIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBjYXJyaWVzIHdvcmtzcGFjZSArIGNvdW50cyArIGZpbGVuYW1lLlxuICB0eXBlIFNsaW1QYWdlID0ge3Y6IDI7IHR5cGU6ICdwYWdlJzsgdHM6IHN0cmluZzsgdXJsOiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nOyB2aWV3cG9ydD86IFZpZXdwb3J0OyB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyB1c2VyQWdlbnQ/OiBzdHJpbmc7IGxhbmc/OiBzdHJpbmc7IGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTsgcm91dGU/OiBhbnk7IHN0YXRlPzogYW55OyBzZXNzaW9uSWQ/OiBzdHJpbmc7IHNuYXBzaG90PzogUGFnZVNuYXBzaG90fTtcbiAgLy8gU2V2ZXJpdHkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgKDIwMjYtMDUpLiBUb2xlcmFudCByZWFkZXJzIG1heSBzdGlsbFxuICAvLyBzZWUgYHNldmVyaXR5YCBvbiBsZWdhY3kgSlNPTkwg4oCUIGRlbm9ybWFsaXplRW50cnkgcHJlc2VydmVzIGl0IG9uXG4gIC8vIEZlZWRiYWNrTWVzc2FnZSBzbyByZS1leHBvcnQgcm91bmQtdHJpcHMsIGJ1dCBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0XG4gIC8vIGl0IGFuZCB3ZSBkb24ndCBlbWl0IGl0IGhlcmUuIEtlZXAgdGhlIGZpZWxkIG9mZiBTbGltRmVlZGJhY2sgc28gbmV3XG4gIC8vIGV4cG9ydHMgc3RheSBjbGVhbi5cbiAgLy8gYHRhZ3NgIGlzIGFsd2F5cyBlbWl0dGVkIChkZWZhdWx0IGVtcHR5IGFycmF5KSBzbyBEdWNrREIgc2NoZW1hXG4gIC8vIGluZmVyZW5jZSBhbHdheXMgc2VlcyB0aGUgY29sdW1uLlxuICB0eXBlIFNsaW1GZWVkYmFjayA9IHt2OiAyOyB0eXBlOiAnZmVlZGJhY2snOyB1aWQ6IHN0cmluZzsgdHM6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmc7IGRldGFjaGVkPzogYm9vbGVhbjsgdGFnczogc3RyaW5nW107IGlzVGVzdERhdGE/OiBib29sZWFuOyBzdWdnZXN0ZWRTa2lsbHM/OiBBcnJheTx7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfT59O1xuICAvLyBDaGVhcCB0ZXN0LWRhdGEgc25pZmY6IG1hdGNoZXMgc3RyaW5ncyB0aGUgdXNlciB0eXBlcyB3aGlsZSBzbW9rZS1cbiAgLy8gdGVzdGluZyB0aGUgZXh0ZW5zaW9uIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsIFwibG9yZW0gaXBzdW1cIixcbiAgLy8gXCJwbGFjZWhvbGRlclwiLCBvciBhbnkgcGhyYXNlIG9idmlvdXNseSBzdHViYmVkLW91dCkuIEZhbHNlIHBvc2l0aXZlc1xuICAvLyBoZXJlIGFyZSByZWNvdmVyYWJsZSDigJQgdGhlIGNvbnN1bWVyIGNhbiBpZ25vcmUgdGhlIGZsYWcg4oCUIGJ1dFxuICAvLyBleGNsdWRpbmcgcmVhbCBmZWVkYmFjayB3b3VsZCBub3QgYmUsIHNvIHdlIGtlZXAgdGhlIHJlZ2V4IG5hcnJvdy5cbiAgY29uc3QgVEVTVF9EQVRBX1JFID0gL14odGVzdHxhc2RmfHF3ZXJ8Zm9vfGJhcnxiYXp8bG9yZW18cGxhY2Vob2xkZXJ8dG9kb3x4ezMsfXxoZWxsbyB3b3JsZHxzYW1wbGV8ZHVtbXl8c29tZXRoaW5nfGFueXRoaW5nfGlnbm9yZSBtZXx3aXB8dGJkfG5cXC9hfGhpKVxcYi9pO1xuICBjb25zdCBsb29rc0xpa2VUZXN0RGF0YSA9ICh0ZXh0OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50cmltKCk7XG4gICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKFRFU1RfREFUQV9SRS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoL3Rlc3QgZmVlZGJhY2svaS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHR5cGUgU2xpbVNlbGVjdG9yID0gUmVjb3JkPHN0cmluZywgYW55PiAmIHt2OiAyOyB0eXBlOiAnc2VsZWN0b3InOyBuOiBudW1iZXI7IHNlbGVjdG9yOiBzdHJpbmc7IGZlZWRiYWNrPzogc3RyaW5nW119O1xuICB0eXBlIFNsaW1MaW5lID0gU2xpbVBhZ2UgfCBTbGltRmVlZGJhY2sgfCBTbGltU2VsZWN0b3I7XG4gIGNvbnN0IGJ1aWxkU2xpbSA9ICgpOiBTbGltTGluZVtdID0+IHtcbiAgICBjb25zdCBsaW5lczogU2xpbUxpbmVbXSA9IFtdO1xuICAgIC8vIFByZS1jb21wdXRlIHZpc3VhbE9yZGVyICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkgZm9yIGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3IgbWVzc2FnZS4gVGhlIHByZXZpb3VzIHNpbmdsZSBgbmAgZmllbGQgY29uZmxhdGVkXG4gICAgLy8gY2FwdHVyZSBvcmRlciwgSlNPTkwgc3RyZWFtIG9yZGVyLFxuICAgIC8vIHZpc3VhbCBvcmRlciwgYW5kIGRpc3BsYXkgbGFiZWwuIFdlIG5vdyBlbWl0IGZvdXIgb3J0aG9nb25hbFxuICAgIC8vIGZpZWxkcyBhbmQgZG9jdW1lbnQgZWFjaDpcbiAgICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gICAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCB0aGUgb3JpZ2luYWwgYG5gIChjYXB0dXJlIHNlcXVlbmNlKVxuICAgIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgc29ydCBieSByZWN0LnkgYXNjLCByZWN0LnggYXNjXG4gICAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCB0aGUgaHVtYW4tZmFjaW5nIG51bWJlciBzaG93biBpbiB0aGUgc2lkZWJhclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAoY3VycmVudGx5IG1pcnJvcnMgY2FwdHVyZUluZGV4OyBjYW4gZHJpZnQgaWZcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhlIHNpZGViYXIgYWRvcHRzIGEgZGlmZmVyZW50IGxhYmVsIHNjaGVtZSkuXG4gICAgY29uc3QgdmlzdWFsUmFuayA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgY29uc3Qgc2VscyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFyID0gYS5lbnRyeS5yZWN0OyBjb25zdCBiciA9IGIuZW50cnkucmVjdDtcbiAgICAgICAgaWYgKCFhciB8fCAhYnIpIHJldHVybiAwO1xuICAgICAgICBpZiAoYXIueSAhPT0gYnIueSkgcmV0dXJuIGFyLnkgLSBici55O1xuICAgICAgICByZXR1cm4gYXIueCAtIGJyLng7XG4gICAgICB9KTtcbiAgICBzZWxzLmZvckVhY2goKG0sIGkpID0+IHZpc3VhbFJhbmsuc2V0KG0uaWQsIGkgKyAxKSk7XG4gICAgbGV0IHBlbmRpbmdTZWw6IFNlbGVjdG9yTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIC8vIFdlIGNvbGxlY3QgYm90aCB0aGUgYnVuZGxlZCBzdHJpbmcgYXJyYXkgKGZvciB2MS1mcmllbmRseSByZWFkZXJzKSBhbmRcbiAgICAvLyB0aGUgcmljaCBvYmplY3RzIChmb3IgdjIgc3RhbmRhbG9uZSBsaW5lcykuXG4gICAgbGV0IHBlbmRpbmdGYlN0cmluZ3M6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHBlbmRpbmdGYlJpY2g6IFNsaW1GZWVkYmFja1tdID0gW107XG4gICAgY29uc3QgZmx1c2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBlbmRpbmdTZWwpIHJldHVybjtcbiAgICAgIGNvbnN0IGV2ZW50SW5kZXggPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgY29uc3QgdmlzdWFsT3JkZXIgPSB2aXN1YWxSYW5rLmdldChwZW5kaW5nU2VsLmlkKTtcbiAgICAgIGNvbnN0IG91dDogYW55ID0gc2xpbUVudHJ5KHBlbmRpbmdTZWwuZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWUsIGV2ZW50SW5kZXgsIHZpc3VhbE9yZGVyfSk7XG4gICAgICBpZiAocGVuZGluZ0ZiU3RyaW5ncy5sZW5ndGgpIG91dC5mZWVkYmFjayA9IFsuLi5wZW5kaW5nRmJTdHJpbmdzXTtcbiAgICAgIGxpbmVzLnB1c2gob3V0IGFzIFNsaW1MaW5lKTtcbiAgICAgIC8vIEdyb3VwIGZsYXRuZXNzIChidWcgIzkpLiBFbWl0IGVhY2ggZ3JvdXAgbWVtYmVyIGFzIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzbGltIHJvdyByaWdodCBhZnRlciB0aGUgaGVhZCwgd2l0aCBgZ3JvdXBVaWRgXG4gICAgICAvLyBsaW5raW5nIGJhY2suIFRoaXMgbGV0cyBEdWNrREIgLyBTUUwgcXVlcmllcyB0cmVhdCBncm91cFxuICAgICAgLy8gbWVtYmVycyBhcyBmaXJzdC1jbGFzcyBzZWxlY3RvciByb3dzIHdpdGhvdXQgZGVzY2VuZGluZyBpbnRvXG4gICAgICAvLyBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgIGNvbnN0IGdyb3VwTWVtYmVycyA9IHBlbmRpbmdTZWwuZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBncm91cE1lbWJlcnMpIHtcbiAgICAgICAgY29uc3QgbUV2ZW50ID0gbGluZXMubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3QgbWVtYmVyUm93OiBhbnkgPSBzbGltRW50cnkobWVtYmVyLCB7aW5jbHVkZUdyb3VwOiBmYWxzZSwgZXZlbnRJbmRleDogbUV2ZW50LCBncm91cFVpZDogcGVuZGluZ1NlbC5lbnRyeS51aWR9KTtcbiAgICAgICAgbGluZXMucHVzaChtZW1iZXJSb3cgYXMgU2xpbUxpbmUpO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBlYWNoIHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZSByaWdodCBhZnRlciB0aGUgc2VsZWN0b3IocykuXG4gICAgICBmb3IgKGNvbnN0IGZiIG9mIHBlbmRpbmdGYlJpY2gpIGxpbmVzLnB1c2goZmIpO1xuICAgICAgcGVuZGluZ1NlbCA9IG51bGw7XG4gICAgICBwZW5kaW5nRmJTdHJpbmdzID0gW107XG4gICAgICBwZW5kaW5nRmJSaWNoID0gW107XG4gICAgfTtcbiAgICAvLyBSZW9yZGVyIGZvciBleHBvcnQgb25seSDigJQgc2lkZWJhciBrZWVwcyBjYXB0dXJlIG9yZGVyLCB0aGVcbiAgICAvLyBlbWl0dGVkIEpTT05MIHJlYWRzIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHdpdGhpbiBlYWNoIHBhZ2UuXG4gICAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciB2aWEgdGhlXG4gICAgLy8gYHJlb3JkZXJGb3JFeHBvcnRgIGhlbHBlciwgc28gdGhyZWFkaW5nIGlzIHByZXNlcnZlZCB0aHJvdWdoXG4gICAgLy8gdGhlIHJlYXJyYW5nZW1lbnQuXG4gICAgY29uc3QgZXhwb3J0T3JkZXJlZCA9IHJlb3JkZXJGb3JFeHBvcnQobWVzc2FnZXMpO1xuICAgIGZvciAoY29uc3QgbSBvZiBleHBvcnRPcmRlcmVkKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2goKTtcbiAgICAgICAgY29uc3Qgc2xpbTogU2xpbVBhZ2UgPSB7djogMiwgdHlwZTogJ3BhZ2UnLCB0czogbS50cywgdXJsOiBtLnVybH07XG4gICAgICAgIGlmIChtLnRpdGxlICE9PSB1bmRlZmluZWQpIHNsaW0udGl0bGUgPSBtLnRpdGxlO1xuICAgICAgICBpZiAobS52aWV3cG9ydCkgc2xpbS52aWV3cG9ydCA9IG0udmlld3BvcnQ7XG4gICAgICAgIGlmICghcHJlZnMubWluaWZ5ICYmIG0udG9rZW5zKSBzbGltLnRva2VucyA9IG0udG9rZW5zO1xuICAgICAgICBpZiAobS51c2VyQWdlbnQpIHNsaW0udXNlckFnZW50ID0gbS51c2VyQWdlbnQ7XG4gICAgICAgIGlmIChtLmxhbmcpIHNsaW0ubGFuZyA9IG0ubGFuZztcbiAgICAgICAgaWYgKG0uZ2l0Q29udGV4dCkgc2xpbS5naXRDb250ZXh0ID0gbS5naXRDb250ZXh0O1xuICAgICAgICBpZiAobS5yb3V0ZSkgc2xpbS5yb3V0ZSA9IG0ucm91dGU7XG4gICAgICAgIGlmIChtLnN0YXRlKSBzbGltLnN0YXRlID0gbS5zdGF0ZTtcbiAgICAgICAgaWYgKG0uc2Vzc2lvbklkKSBzbGltLnNlc3Npb25JZCA9IG0uc2Vzc2lvbklkO1xuICAgICAgICAvLyBGdWxsLXBhZ2Ugc25hcHNob3QgKHZpZXdwb3J0LCBzY3JvbGwgZXh0ZW50cywgZHByLCBsYW5nLCBzY3JlZW5zaG90KVxuICAgICAgICAvLyBjYXB0dXJlZCBmb3IgdGhpcyBVUkwuIFBhcnQgb2YgdGhlIGV4cG9ydCBkZWxpdmVyYWJsZSBzbyBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYWdlbnQgaGFzIHdob2xlLXBhZ2UgY29udGV4dCwgbm90IGp1c3QgZWxlbWVudCBjcm9wcy5cbiAgICAgICAgY29uc3Qgc25hcCA9IChtIGFzIFBhZ2VNZXNzYWdlICYge3NuYXBzaG90PzogUGFnZVNuYXBzaG90fSkuc25hcHNob3Q7XG4gICAgICAgIGlmIChzbmFwKSBzbGltLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgbGluZXMucHVzaChzbGltKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7IGZsdXNoKCk7IHBlbmRpbmdTZWwgPSBtOyB9XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgLy8gQWx3YXlzIGluY2x1ZGUgYHRhZ3M6IFtdYCAoZXZlbiB3aGVuIGVtcHR5KSBzbyBEdWNrREIncyBzY2hlbWFcbiAgICAgICAgLy8gaW5mZXJlbmNlIHBpY2tzIHRoZSBjb2x1bW4gdXAuXG4gICAgICAgIC8vIGB1aWRgIGlzIHRoZSBtZXNzYWdlJ3Mgc3RhYmxlIGlkOiBQUnMgLyByZXBhaXIgcmVwb3J0cyBuZWVkXG4gICAgICAgIC8vIGEgc3RhYmxlIHBlci1mZWVkYmFjayBoYW5kbGUsIG5vdCBqdXN0IHBhcmVudFVpZC5cbiAgICAgICAgY29uc3QgcmljaDogU2xpbUZlZWRiYWNrID0ge3Y6IDIsIHR5cGU6ICdmZWVkYmFjaycsIHVpZDogbS5pZCwgdHM6IG0udHMsIHRleHQ6IG0udGV4dCwgdGFnczogbS50YWdzID8/IFtdfTtcbiAgICAgICAgLy8gKHNldmVyaXR5IHJlbW92ZWQgMjAyNi0wNSDigJQgb2xkIEpTT05McyBtYXkgc3RpbGwgY29udGFpbiBpdFxuICAgICAgICAvLyBvbiB0aGUgcmVhZCBzaWRlLCBidXQgd2Ugbm8gbG9uZ2VyIGVtaXQgaXQgb24gd3JpdGUuKVxuICAgICAgICAvLyBIZXVyaXN0aWMgZmxhZyBmb3Igc3R1Yi1sb29raW5nIGZlZWRiYWNrIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsXG4gICAgICAgIC8vIFwiSG93ZHkgLCB0ZXN0IGZlZWRiYWNrIGhlcmVcIiwgZXRjKS4gTGV0cyBhIGRvd25zdHJlYW0gY29uc3VtZXJcbiAgICAgICAgLy8gZmlsdGVyIHBvbGx1dGlvbiBmcm9tIHJlYWwgaW50ZW50IHdpdGhvdXQgbWFudWFsIGNsZWFudXAuXG4gICAgICAgIGlmIChsb29rc0xpa2VUZXN0RGF0YShtLnRleHQpKSByaWNoLmlzVGVzdERhdGEgPSB0cnVlO1xuICAgICAgICAvLyBBIGRldGFjaGVkIGNvbW1lbnQgbmV2ZXIgYWRvcHRzIHRoZSBwZW5kaW5nIHNlbGVjdG9yIHZpYVxuICAgICAgICAvLyBhZGphY2VuY3kg4oCUIHRoZSB1c2VyIGV4cGxpY2l0bHkgZGlzYXNzb2NpYXRlZCBpdC4gVGhlIGZsYWcgaXNcbiAgICAgICAgLy8gZW1pdHRlZCBzbyBpbXBvcnQgcm91bmQtdHJpcHMgZG9uJ3QgcmUtYWRvcHQgYnkgYWRqYWNlbmN5IGVpdGhlci5cbiAgICAgICAgaWYgKG0uZGV0YWNoZWQpIHJpY2guZGV0YWNoZWQgPSB0cnVlO1xuICAgICAgICAvLyBIZXVyaXN0aWMgc2tpbGwgbG9jYXRvcnMgZm9yIHRoZSBhZ2VudCdzIG1hcCBwaGFzZSAodmVyaWZpZWQgYW5kXG4gICAgICAgIC8vIHJld3JpdHRlbiBpbnRvIHdvcmstbWFuaWZlc3QgbWFwcGVkX3NraWxscyBieSB0aGUgY29uc3VtZXIpLlxuICAgICAgICByaWNoLnN1Z2dlc3RlZFNraWxscyA9IHN1Z2dlc3RTa2lsbHNGb3IobS50ZXh0KTtcbiAgICAgICAgaWYgKHBlbmRpbmdTZWwgJiYgIW0uZGV0YWNoZWQpIHtcbiAgICAgICAgICByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkID8/IHBlbmRpbmdTZWwuZW50cnkudWlkO1xuICAgICAgICAgIHBlbmRpbmdGYlN0cmluZ3MucHVzaChtLnRleHQpO1xuICAgICAgICAgIHBlbmRpbmdGYlJpY2gucHVzaChyaWNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQ7XG4gICAgICAgICAgbGluZXMucHVzaChyaWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaCgpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfTtcbiAgLy8gQnVpbGQgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBvZiB0aGUgSlNPTkwgZXhwb3J0LiBUaGVcbiAgLy8gbWFuaWZlc3QgY2FycmllcyB0aGUgZXhwb3J0IGZpbGVuYW1lICsgd29ya3NwYWNlICsgaG9zdChzKSArIGNvdW50cyBzb1xuICAvLyBhIGRvd25zdHJlYW0gTExNIGNhbiByZXN5bmMgdGhlIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlIGFuZCBncmVwIGZvclxuICAvLyBkdXBsaWNhdGVzIGFjcm9zcyBleHBvcnRzLlxuICBjb25zdCBidWlsZE1hbmlmZXN0ID0gKGZpbGVuYW1lOiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddLCBvcHRzOiB7bm93SXNvPzogc3RyaW5nOyBidW5kbGVJZD86IHN0cmluZ30gPSB7fSk6IEV4cG9ydE1hbmlmZXN0ID0+IHtcbiAgICBsZXQgblNlbCA9IDA7IGxldCBuRmIgPSAwOyBsZXQgblBnID0gMDtcbiAgICBsZXQgbkdyb3VwTWVtYmVycyA9IDA7XG4gICAgbGV0IG5GZWVkYmFja0JlYXJpbmcgPSAwO1xuICAgIGxldCBuTWlzc2luZ1Nob3QgPSAwO1xuICAgIGxldCBuRWxlbWVudFNob3RzID0gMDtcbiAgICBsZXQgbkdyb3VwU2hvdHMgPSAwO1xuICAgIGxldCBuUGFnZVNob3RzID0gMDtcbiAgICBsZXQgbk9ycGhhbmVkRmIgPSAwO1xuICAgIGNvbnN0IHNlbGVjdG9yVWlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAvLyBGaXJzdCBwYXNzOiBjb2xsZWN0IHVpZHMgKyBwZXItc2VsZWN0b3IgZmVlZGJhY2sgcHJlc2VuY2UuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIG5TZWwrKztcbiAgICAgICAgc2VsZWN0b3JVaWRzLmFkZChtLmVudHJ5LnVpZCk7XG4gICAgICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIG5Hcm91cE1lbWJlcnMgKz0gbS5lbnRyeS5ncm91cC5sZW5ndGg7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIG5FbGVtZW50U2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5Hcm91cFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIG5QYWdlU2hvdHMrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIG5GYisrO1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuYWRkKG0ucGFyZW50VWlkKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIG5QZysrO1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzczogZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgKyBvcnBoYW5lZCBmZWVkYmFjayArXG4gICAgLy8gc2VsZWN0b3JzIHRoYXQgc2hvdWxkIGhhdmUgYSBzaG90IGJ1dCBkb24ndC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSB7XG4gICAgICAgIG5GZWVkYmFja0JlYXJpbmcrKztcbiAgICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5NaXNzaW5nU2hvdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIG5PcnBoYW5lZEZiKys7XG4gICAgfVxuICAgIGNvbnN0IG5vd0lzbyA9IG9wdHMubm93SXNvID8/IGV4cG9ydE5vd0lzbygpO1xuICAgIGNvbnN0IG91dDogRXhwb3J0TWFuaWZlc3QgPSB7XG4gICAgICB2OiAyLCB0eXBlOiAnbWFuaWZlc3QnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICAgIHRzOiBub3dJc28sXG4gICAgICBnZW5lcmF0ZWQ6IERhdGUucGFyc2Uobm93SXNvKSxcbiAgICAgIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGZvcm1hdCxcbiAgICAgIGhvc3RzOiBkaXN0aW5jdEhvc3RzKCksXG4gICAgICBjb3VudHM6IHtcbiAgICAgICAgLy8gVG90YWwgc2VsZWN0b3Igcm93cyB0aGUgSlNPTkwgd2lsbCBlbWl0ID0gdG9wLWxldmVsICsgZmxhdFxuICAgICAgICAvLyBncm91cCBtZW1iZXJzLiBUaGlzIG1hdGNoZXMgd2hhdCBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYHJlYWRfanNvbl9hdXRvKC4uLilgIHdvdWxkIHNlZTsgdGhlIHByZXZpb3VzIGJlaGF2aW9yIG9mXG4gICAgICAgIC8vIHJlcG9ydGluZyBvbmx5IHRoZSBpbi1tZW1vcnkgdG9wLWxldmVsIGNvdW50IGNvbnRyYWRpY3RlZFxuICAgICAgICAvLyB0aGUgYWN0dWFsIHN0cmVhbS5cbiAgICAgICAgc2VsZWN0b3JzOiBuU2VsICsgbkdyb3VwTWVtYmVycyxcbiAgICAgICAgZmVlZGJhY2s6IG5GYixcbiAgICAgICAgcGFnZXM6IG5QZyxcbiAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiBuRmVlZGJhY2tCZWFyaW5nLFxuICAgICAgICBncm91cE1lbWJlcnM6IG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDogbkVsZW1lbnRTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNHcm91cDogbkdyb3VwU2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzUGFnZTogblBhZ2VTaG90cyxcbiAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IG5NaXNzaW5nU2hvdCxcbiAgICAgICAgb3JwaGFuZWRGZWVkYmFjazogbk9ycGhhbmVkRmIsXG4gICAgICB9LFxuICAgICAgLy8gU2luZ2xlIGNhbm9uaWNhbCByZXNvbHV0aW9uIHJ1bGUuIEV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MXG4gICAgICAvLyAoc2NyZWVuc2hvdC5lbGVtZW50L2dyb3VwL3BhZ2UpIGlzIHJlbGF0aXZlIHRvIGBwYXRoUm9vdGA6XG4gICAgICAvLyAgIOKAoiAnYXJjaGl2ZSc6IGZvciB0YXIuenN0IGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGVcbiAgICAgIC8vICAgICBleHRyYWN0ZWQgYXJjaGl2ZSByb290IChlLmcuIGBzY3JlZW5zaG90cy9mb28ucG5nYCkuXG4gICAgICAvLyAgIOKAoiAnd29ya3NwYWNlJzogZm9yIHBsYWluIEpTT05MIGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0b1xuICAgICAgLy8gICAgIHRoZSB3b3Jrc3BhY2UgZGlyIChgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICAvLyBSZWNlaXZlcnMgbm8gbG9uZ2VyIGhhdmUgdG8gZ3Vlc3Mgd2hpY2ggcGF0aCBzaGFwZSBhcHBsaWVzLlxuICAgICAgcGF0aFJvb3Q6IGZvcm1hdCA9PT0gJ3Rhci56c3QnID8gJ2FyY2hpdmUnIDogJ3dvcmtzcGFjZScsXG4gICAgfTtcbiAgICAvLyBDb250ZW50LWRlcml2ZWQgaWRlbnRpdHkgKFNIQS0yNTYgcHJlZml4IG92ZXIgc2xpbSByb3dzICsgc2NyZWVuc2hvdFxuICAgIC8vIG5hbWVzKS4gU2FtZSBjb250ZW50IOKGkiBzYW1lIGJ1bmRsZUlkIOKGkiBkb3duc3RyZWFtIH4vLnBpbmNoZ3JhYiBzdGF0ZVxuICAgIC8vIGtleXMgc3RheSBzdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMuXG4gICAgaWYgKG9wdHMuYnVuZGxlSWQpIG91dC5idW5kbGVJZCA9IG9wdHMuYnVuZGxlSWQ7XG4gICAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlcnMgc28gYSBkb3duc3RyZWFtIGFnZW50IGtub3dzIHdoaWNoIFVJIHNraWxsXG4gICAgLy8gb3ducyB0aGUgdHJpYWdlIGZsb3cgKyB3aGljaCBERVNJR04ubWQgb3ducyB0aGUgdmlzdWFsIGlkZW50aXR5LlxuICAgIC8vXG4gICAgLy8gYGlubGluZTogdHJ1ZWAgaXMgc2V0IE9OTFkgZm9yIHRhci56c3QgZXhwb3J0cyAod2hlcmUgdGhlIC5tZFxuICAgIC8vIGZpbGVzIGFyZSBwaHlzaWNhbGx5IGJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSkuIEpTT05MLW9ubHlcbiAgICAvLyBleHBvcnRzIGVtaXQgYGlubGluZTogZmFsc2VgIHBsdXMgdGhlIHJlY2VpdmVyLXNpZGUgYHBhdGhgIHNvXG4gICAgLy8gYSBjb25zdW1lciBwYWlyZWQgd2l0aCB0aGUgc3RhbmRhbG9uZSBKU09OTCBjYW4gcmVzb2x2ZSB0aGVcbiAgICAvLyByZWZlcmVuY2VkIGZpbGUgb2ZmIHRoZWlyIG93biBmaWxlc3lzdGVtLlxuICAgIC8vXG4gICAgLy8gYHRlbXBsYXRlOiB0cnVlYCBmbGFncyB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKAlCB1c2VmdWxcbiAgICAvLyBmb3IgcmVjZWl2ZXJzIHdobyB3YW50IHRvIGRpc3Rpbmd1aXNoIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50XG4gICAgLy8gZnJvbSB0aGUgdXNlcidzIGFjdHVhbCB3b3JraW5nIG5vdGVzLlxuICAgIGNvbnN0IGlzVGFyQnVuZGxlID0gZm9ybWF0ID09PSAndGFyLnpzdCc7XG4gICAgb3V0LnNraWxsID0ge1xuICAgICAgbmFtZTogJ1BpbmNoR3JhYicsXG4gICAgICBwYXRoOiBwcmVmcy5za2lsbFBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuc2tpbGwuYXJjaGl2ZVBhdGggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgb3V0LnNraWxsLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5za2lsbC5jdXN0b21pemVkID0gdHJ1ZTtcbiAgICBvdXQuZGVzaWduID0ge1xuICAgICAgcGF0aDogcHJlZnMuZGVzaWduUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5kZXNpZ24uYXJjaGl2ZVBhdGggPSAnREVTSUdOLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIG91dC5kZXNpZ24udGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LmRlc2lnbi5jdXN0b21pemVkID0gdHJ1ZTtcblxuICAgIC8vIFNlbGYtcm9hc3QgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IEV4cG9ydERpYWdub3N0aWNbXSA9IFtdO1xuICAgIC8vIEZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzIHdpdGggbm8gc2NyZWVuc2hvdC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnRkVFREJBQ0tfUEFSRU5UX01JU1NJTkdfU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciAke20uZW50cnkuc2VsZWN0b3J9IGNhcnJpZXMgZmVlZGJhY2sgYnV0IGhhcyBubyBlbGVtZW50L2dyb3VwIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3JwaGFuZWQgZmVlZGJhY2sgKHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUpLlxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICBjb2RlOiAnT1JQSEFORURfRkVFREJBQ0snLFxuICAgICAgICAgIHVpZDogZmJVaWQsXG4gICAgICAgICAgZGV0YWlsOiAnZmVlZGJhY2sgcm93IHJlZmVyZW5jZXMgYSBwYXJlbnRVaWQgdGhhdCBoYXMgbm8gbWF0Y2hpbmcgc2VsZWN0b3IgaW4gdGhpcyBhcmNoaXZlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEhvdmVyLXN0YXRlIGNhcHR1cmVzIHVzdWFsbHkgbmVlZCBhIGJlZm9yZS9hZnRlcjsgZmxhZyBhbnkgd2hvc2VcbiAgICAvLyBzY3JlZW5zaG90IHN0b3J5IGlzIGluY29tcGxldGUgKGJ1ZyAjMTYgcGFydGlhbCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnN0YXRlcyAmJiBtLmVudHJ5LnN0YXRlcy5pbmNsdWRlcygnaG92ZXInKSAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0hPVkVSX1NUQVRFX05PX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgY2FwdHVyZWQgaW4gOmhvdmVyIHN0YXRlIGJ1dCBoYXMgbm8gc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBMTF5OiBmbGFnIGZhaWxpbmcgY29udHJhc3QgKGJ1ZyAjMTUgZm9sbG93LXRocm91Z2gpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5hMTF5Py5jb250cmFzdFBhc3NlcyA9PT0gJ2ZhaWwnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0NPTlRSQVNUX0JFTE9XX0FBJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHRleHQgY29udHJhc3QgcmF0aW8gJHttLmVudHJ5LmExMXkuY29udHJhc3RSYXRpbyA/PyAnPyd9IGlzIGJlbG93IFdDQUcgQUFgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aCkgb3V0LmV4cG9ydERpYWdub3N0aWNzID0gZGlhZ25vc3RpY3M7XG5cbiAgICAvLyBCdWlsZCBpZGVudGl0eS4gUHVsbCBmcm9tIHRoZSBtb3N0IHJlY2VudCBwYWdlIHJvdydzIGdpdENvbnRleHRcbiAgICAvLyAoc291cmNlZCB2aWEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIj5gIG9uIHRoZSBjYXB0dXJlZCBhcHApXG4gICAgLy8gcGx1cyB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLiBPbWl0IHRoZSBibG9jayBlbnRpcmVseVxuICAgIC8vIHdoZW4gbmVpdGhlciBpcyBhdmFpbGFibGUuXG4gICAgY29uc3QgbGFzdFBhZ2UgPSBbLi4ubWVzc2FnZXNdLnJldmVyc2UoKS5maW5kKChtKSA9PiBtLnR5cGUgPT09ICdwYWdlJykgYXMgUGFnZU1lc3NhZ2UgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgZ2l0ID0gbGFzdFBhZ2U/LmdpdENvbnRleHQ7XG4gICAgY29uc3QgZXh0VmVyID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldE1hbmlmZXN0ID8gY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIGlmIChnaXQgfHwgZXh0VmVyKSB7XG4gICAgICBvdXQuYnVpbGQgPSB7fTtcbiAgICAgIGlmIChleHRWZXIpIG91dC5idWlsZC5leHRlbnNpb25WZXJzaW9uID0gZXh0VmVyO1xuICAgICAgaWYgKGdpdD8uY29tbWl0KSBvdXQuYnVpbGQuY29tbWl0ID0gZ2l0LmNvbW1pdDtcbiAgICAgIGlmIChnaXQ/LmJyYW5jaCkgb3V0LmJ1aWxkLmJyYW5jaCA9IGdpdC5icmFuY2g7XG4gICAgICBpZiAoZ2l0Py5idWlsZCkgb3V0LmJ1aWxkLmRlcGxveUJ1aWxkID0gZ2l0LmJ1aWxkO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCBidWlsZEpzb25sID0gKGZpbGVuYW1lRm9yTWFuaWZlc3Q/OiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddID0gJ2pzb25sJywgb3B0czoge25vd0lzbz86IHN0cmluZzsgYnVuZGxlSWQ/OiBzdHJpbmd9ID0ge30pOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZmlsZW5hbWVGb3JNYW5pZmVzdCA/PyBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gYnVpbGRNYW5pZmVzdChmaWxlbmFtZSwgZm9ybWF0LCBvcHRzKTtcbiAgICBjb25zdCBsaW5lcyA9IGJ1aWxkU2xpbSgpO1xuICAgIGlmICghbGluZXMubGVuZ3RoKSB7XG4gICAgICAvLyBFdmVuIGFuIGVtcHR5IHdvcmtzcGFjZSBnZXRzIGEgbWFuaWZlc3QgbGluZSBzbyBkb3duc3RyZWFtIHRvb2xzXG4gICAgICAvLyBjYW4gdmVyaWZ5IHRoZSBmaWxlIHdhcyBnZW5lcmF0ZWQgYnkgUGluY2hHcmFiLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSArICdcXG4nO1xuICAgIH1cbiAgICByZXR1cm4gW0pTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSwgLi4ubGluZXMubWFwKChsKSA9PiBKU09OLnN0cmluZ2lmeShsKSldLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gIH07XG4gIGNvbnN0IGRvd25sb2FkRmlsZSA9IChjb250ZW50OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWUgPSAndGV4dC9wbGFpbicpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtjb250ZW50XSwge3R5cGU6IG1pbWV9KSk7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7XG4gICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgIGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gIH07XG5cbiAgY29uc3Qgb25Db3B5QWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgaWYgKHRleHQudHJpbSgpLnNwbGl0KCdcXG4nKS5sZW5ndGggPD0gMSAmJiAhbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAvLyBNYW5pZmVzdC1vbmx5IG91dHB1dCBmb3IgYW4gZW1wdHkgd29ya3NwYWNlIHNob3VsZG4ndCBwcmV0ZW5kIHRvIGJlIGEgY29weS5cbiAgICAgIHNldFN0YXR1cygnTm90aGluZyB0byBjb3B5Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpO1xuICAgIHNldFN0YXR1cyhgQ29waWVkIEpTT05MIMK3ICR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICAgIHNob3dDb3BpZWQoJ0NvcGllZCBKU09OTCcsIGAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgfTtcbiAgLy8gU2F2ZSB0aHJvdWdoIHRoZSBiYWNrZ3JvdW5kJ3MgZmlsZSBicmlkZ2UgaWYgd2UncmUgaW4gYW4gZXh0ZW5zaW9uXG4gIC8vIGNvbnRleHQsIHNvIHRoZSBmaWxlIGxhbmRzIHVuZGVyIERvd25sb2Fkcy8ucGluY2hncmFiLzx3cz4vZXhwb3J0cy8uXG4gIC8vIE90aGVyd2lzZSAodGVzdCBwYWdlLCBkZXYgc2VydmVyKSwgZmFsbCBiYWNrIHRvIGEgc3ludGhldGljIGJsb2IgVVJMLlxuICBjb25zdCBzYXZlRXhwb3J0VG9EaXNrID0gYXN5bmMgKHRleHQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZTogc3RyaW5nLCBraW5kOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sg4oaSJywge2ZpbGVuYW1lLCBtaW1lLCBzaXplOiB0ZXh0Lmxlbmd0aCwga2luZH0pO1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtraW5kOiAnc2F2ZS10ZXh0Jywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWUsIHRleHQsIG1pbWV9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgcmVwbHk6JywgcmVwbHkpO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5hYnNQYXRoKSB7XG4gICAgICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IHJlcGx5LmZpbGVuYW1lID8/IG51bGw7XG4gICAgICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSByZXBseS5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gQm9vbGVhbihyZXBseS50ZW1wUGF0aCk7XG4gICAgICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIHNldFN0YXR1cyhgRXhwb3J0ZWQgwrcgJHtsYXN0RXhwb3J0LmNvcHlQYXRofWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCAod29ya2VyIGRlYWQ/IHJlbG9hZCBleHRlbnNpb24gYXQgY2hyb21lOi8vZXh0ZW5zaW9ucyknO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdzYXZlRXhwb3J0VG9EaXNrIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBFeHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZG93bmxvYWRGaWxlKHRleHQsIGZpbGVuYW1lLCBtaW1lKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICBzZXRTdGF0dXMoJ0V4cG9ydGVkJyk7XG4gIH07XG4gIGNvbnN0IG9uRXhwb3J0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IGNvbnRlbnRIYXNoID0gYXdhaXQgY29tcHV0ZUNvbnRlbnRIYXNoKFtdKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJywgY29udGVudEhhc2guc2xpY2UoMCwgOCkpO1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKGZpbGVuYW1lLCAnanNvbmwnLCB7bm93SXNvOiBleHBvcnROb3dJc28oKSwgYnVuZGxlSWQ6IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KX0pO1xuICAgIGF3YWl0IHNhdmVFeHBvcnRUb0Rpc2sodGV4dCwgZmlsZW5hbWUsICdhcHBsaWNhdGlvbi9qc29ubCcsICdqc29ubCcpO1xuICB9O1xuICAvLyDilIDilIDilIAgdGFyLnpzdCB3b3Jrc3BhY2UgZXhwb3J0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCdW5kbGUgSlNPTkwgKyBSRUFETUUgKyBEdWNrREIgcmVjaXBlcyArIHNjcmVlbnNob3RzLmpzb24gKyBhY3R1YWwgUE5HXG4gIC8vIHNjcmVlbnNob3RzIGludG8gYSBzaW5nbGUgLnRhci56c3QgYXJjaGl2ZS4gdGFyIGdpdmVzIHVzIGEgY2xlYW5cbiAgLy8gY29udGFpbmVyIChvbmUgZmlsZSBwZXIgZW50cnksIG5vIHppcC1zdHlsZSBjZW50cmFsLWRpcmVjdG9yeVxuICAvLyBjb250b3J0aW9ucyk7IHpzdGQgaXMgdGhlIG1vZGVybiBjb21wcmVzc2lvbiBwYWlyLiBJbXBsZW1lbnRhdGlvbiBpc1xuICAvLyBwdXJlLVRTIOKAlCBzZWUgc3JjL3Rhci50cyBmb3IgdGhlIGVuY29kZXIgKyB6c3RkLWZyYW1lIHdyaXRlci5cbiAgLy8gQnVnICMyODogYSBKU09OLVNjaGVtYSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlIGluIHRoZSBKU09OTC5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB1c2UgdGhpcyB0byB2YWxpZGF0ZSBmaXh0dXJlcywgZHJpdmUgYXV0b2NvbXBsZXRlIGluXG4gIC8vIGVkaXRvcnMsIGFuZCBhdXRvLWdlbmVyYXRlIHBhcnNlcnMuIEtlZXAgdGhpcyBpbiBzeW5jIHdpdGggdGhlXG4gIC8vIHNoYXBlcyBlbWl0dGVkIGJ5IGJ1aWxkU2xpbS9zbGltRW50cnkg4oCUIGBucG0gcnVuIHRlc3RgIHZhbGlkYXRlcyBhXG4gIC8vIHNhbXBsZSBhZ2FpbnN0IHRoaXMgc2NoZW1hLlxuICBjb25zdCBidWlsZFNjaGVtYUpzb24gPSAoKTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICAkc2NoZW1hOiAnaHR0cHM6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQvMjAyMC0xMi9zY2hlbWEnLFxuICAgICRpZDogJ2h0dHBzOi8vd3Jhbm5nbGUuY29tL3BpbmNoZ3JhYi9leHBvcnQudjIuc2NoZW1hLmpzb24nLFxuICAgIHRpdGxlOiAnUGluY2hHcmFiIGV4cG9ydCAodjIpJyxcbiAgICBkZXNjcmlwdGlvbjogJ0pTT05MIHJvdyArIG1hbmlmZXN0IHNjaGVtYXMgZm9yIFBpbmNoR3JhYiB3b3Jrc3BhY2UgZXhwb3J0cy4nLFxuICAgIG9uZU9mOiBbXG4gICAgICB7JHJlZjogJyMvJGRlZnMvbWFuaWZlc3QnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9wYWdlJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvc2VsZWN0b3InfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9mZWVkYmFjayd9LFxuICAgIF0sXG4gICAgJGRlZnM6IHtcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndG9vbCcsICd0cycsICd3b3Jrc3BhY2UnLCAnZmlsZW5hbWUnLCAnZm9ybWF0JywgJ2hvc3RzJywgJ2NvdW50cyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdtYW5pZmVzdCd9LFxuICAgICAgICAgIHRvb2w6IHtjb25zdDogJ3BpbmNoZ3JhYid9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIGdlbmVyYXRlZDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgd29ya3NwYWNlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZpbGVuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZvcm1hdDoge2VudW06IFsnanNvbmwnLCAnbWFya2Rvd24nLCAndGFyLnpzdCddfSxcbiAgICAgICAgICBidW5kbGVJZDoge3R5cGU6ICdzdHJpbmcnLCBwYXR0ZXJuOiAnXlswLTlhLWZdezE2fSQnfSxcbiAgICAgICAgICBob3N0czoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBwYXRoUm9vdDoge2VudW06IFsnYXJjaGl2ZScsICd3b3Jrc3BhY2UnXX0sXG4gICAgICAgICAgY291bnRzOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9ycycsICdmZWVkYmFjaycsICdwYWdlcyddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZ3JvdXBNZW1iZXJzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNHcm91cDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzUGFnZToge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgb3JwaGFuZWRGZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzSHRtbDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWdlbnRQcm90b2NvbDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydhcmNoaXZlUGF0aCddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge2FyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1bmRsZWRTa2lsbHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnaWQnLCAna2luZCcsICdhcmNoaXZlUGF0aCddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAga2luZDoge2VudW06IFsnc2tpbGwnLCAncmVmZXJlbmNlJ119LFxuICAgICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGludm9jYXRpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGFnZXNIdG1sOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3VybCcsICdhcmNoaXZlUGF0aCcsICdieXRlcyddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGJ5dGVzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBza2lsbDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc2lnbjoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZXh0ZW5zaW9uVmVyc2lvbjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpcnR5OiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgZGVwbG95QnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwb3J0RGlhZ25vc3RpY3M6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2V2ZXJpdHknLCAnY29kZSddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgc2V2ZXJpdHk6IHtlbnVtOiBbJ2Vycm9yJywgJ3dhcm4nLCAnaW5mbyddfSxcbiAgICAgICAgICAgICAgICBjb2RlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGRldGFpbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGFnZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3RzJywgJ3VybCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdwYWdlJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRpdGxlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICB0b2tlbnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHVzZXJBZ2VudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBsYW5nOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2Vzc2lvbklkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ24nLCAndHMnLCAndXJsJywgJ3RhZycsICdzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdzZWxlY3Rvcid9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBuOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBjYXB0dXJlSW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGV2ZW50SW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHZpc3VhbE9yZGVyOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBkaXNwbGF5TGFiZWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvcjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvck1hdGNoQ291bnQ6IHt0eXBlOiAnaW50ZWdlcicsIG1pbmltdW06IDB9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcmVuZGVyZWRUZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJvbGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgYWNjZXNzaWJsZU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGVzdElkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGNsYXNzZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgYXR0cnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHJlY3Q6IHskcmVmOiAnIy8kZGVmcy9yZWN0J30sXG4gICAgICAgICAgc3RhdGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGZyYW1ld29yazoge2VudW06IFsncmVhY3QnLCAndnVlJywgJ2xpdCcsICdzdGVuY2lsJywgJ3N2ZWx0ZScsICd3ZWItY29tcG9uZW50J119LFxuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXNwbGF5TmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2hhaW46IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtmaWxlOiB7dHlwZTogWydzdHJpbmcnLCAnbnVsbCddfSwgbGluZToge3R5cGU6IFsnaW50ZWdlcicsICdudWxsJ119fSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdXRlckhUTUw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc3R5bGVzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBzY3JlZW5zaG90OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZ3JvdXA6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhZ2U6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNhcHR1cmVkQXQ6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hhZG93SG9zdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgZ3JvdXBVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ3JvdXBNZW1iZXJVaWRzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGZlZWRiYWNrOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIF9hdWRpdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGFuY2VzdG9yczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvYW5jZXN0b3InfX0sXG4gICAgICAgICAgICAgIGNvbXBvbmVudFJvb3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgcHNldWRvRWxlbWVudHM6IHt0eXBlOiAnb2JqZWN0J30sXG4gICAgICAgICAgICAgIG1hdGNoZWRSdWxlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvbWF0Y2hlZFJ1bGUnfX0sXG4gICAgICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBmZWVkYmFjazoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICd0cycsICd0ZXh0JywgJ3RhZ3MnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnZmVlZGJhY2snfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBwYXJlbnRVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGV0YWNoZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIHRhZ3M6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgaXNUZXN0RGF0YToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgc3VnZ2VzdGVkU2tpbGxzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NraWxsJywgJ2xvY2F0b3InXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge3NraWxsOiB7dHlwZTogJ3N0cmluZyd9LCBsb2NhdG9yOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2aWV3cG9ydDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHc6IHt0eXBlOiAnaW50ZWdlcid9LCBoOiB7dHlwZTogJ2ludGVnZXInfSwgZHByOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICAgIGNvbG9yU2NoZW1lOiB7ZW51bTogWydsaWdodCcsICdkYXJrJ119LFxuICAgICAgICAgIHJlZHVjZWRNb3Rpb246IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGRpcmVjdGlvbjoge2VudW06IFsnbHRyJywgJ3J0bCddfSxcbiAgICAgICAgICB6b29tOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlY3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3gnLCAneScsICd3JywgJ2gnXSxcbiAgICAgICAgcHJvcGVydGllczoge3g6IHt0eXBlOiAnbnVtYmVyJ30sIHk6IHt0eXBlOiAnbnVtYmVyJ30sIHc6IHt0eXBlOiAnbnVtYmVyJ30sIGg6IHt0eXBlOiAnbnVtYmVyJ319LFxuICAgICAgfSxcbiAgICAgIGFuY2VzdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd0YWcnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1hdGNoZWRSdWxlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGVjbGFyYXRpb25zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBtZWRpYToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSwgbnVsbCwgMikgKyAnXFxuJztcblxuICAvLyBHZW5lcmF0ZSByZXBhaXItaW5kZXgubWQgYXMgYSBzdHJ1Y3R1cmVkIHN0YXJ0aW5nIHBvaW50IGZvciBhblxuICAvLyBhdXRvbm9tb3VzIGNvZGluZyBhZ2VudC4gRm9yIGV2ZXJ5IGZlZWRiYWNrIHJvdywgbWVjaGFuaWNhbGx5IGRlcml2ZTpcbiAgLy8gICDigKIgdGFyZ2V0IGlkZW50aXR5ICh1aWQsIHNlbGVjdG9yLCB0YWcsIGFjY2Vzc2libGUgbmFtZSlcbiAgLy8gICDigKIgc2NyZWVuc2hvdCBwYXRoICh3aXRoIGFyY2hpdmUtcmVsYXRpdmUgZm9ybSlcbiAgLy8gICDigKIgc291cmNlIGhpbnRzIChjb21wb25lbnQgY2hhaW4sIHNvdXJjZW1hcCBmaWxlL2xpbmUpXG4gIC8vICAg4oCiIHN1Z2dlc3RlZCBmaXggY2F0ZWdvcnkgKGNoZWFwIGhldXJpc3RpYyBvbiB0ZXh0KVxuICAvLyBUaGUgYWdlbnQgdXNlcyB0aGlzIGFzIGEgc3RhcnRpbmcgcHVuY2ggbGlzdCwgdGhlbiB2YWxpZGF0ZXMgK1xuICAvLyByZWZpbmVzIGVhY2ggc3VnZ2VzdGlvbiBhZ2FpbnN0IHRoZSBmdWxsIEpTT05MLlxuICBjb25zdCBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkgPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICgvXFxiKHR5cG98Y29weXx3b3JkaW5nfGxhYmVsfG1pc3NwZWxsfGdyYW1tYXJ8Y2FwaXRhbGl6KS8udGVzdCh0KSkgcmV0dXJuICdjb3B5JztcbiAgICBpZiAoL1xcYihhbGlnbnxzcGFjaW5nfHBhZGRpbmd8bWFyZ2lufGxheW91dHxvdmVybGFwfGNyb3dkZWR8Y3JhbXBlZHx0aWdodHxnYXApLy50ZXN0KHQpKSByZXR1cm4gJ2xheW91dCc7XG4gICAgaWYgKC9cXGIodW5jbGVhcnxjb25mdXNpbmd8d2hhdCBkb2VzfHdoYXQgaXN8ZG9uJ3QgdW5kZXJzdGFuZHxoYXJkIHRvfG5hdnxuYXZpZ2F0aW9uKS8udGVzdCh0KSkgcmV0dXJuICdhZmZvcmRhbmNlJztcbiAgICBpZiAoL1xcYihjb250cmFzdHxjb2xvciBibGluZHxzY3JlZW4gcmVhZGVyfGFyaWF8Zm9jdXN8a2V5Ym9hcmR8dGFifGExMXl8YWNjZXNzaWIpLy50ZXN0KHQpKSByZXR1cm4gJ2FjY2Vzc2liaWxpdHknO1xuICAgIGlmICgvXFxiKGJyb2tlbnxjcmFzaHxudWxsfHVuZGVmaW5lZHxlcnJvcnw0MDR8ZmFpbCkvLnRlc3QodCkpIHJldHVybiAnc3RhdGUnO1xuICAgIGlmICgvXFxiKHVnbHl8Y29sb3J8Z3JhZGllbnR8c2hhZG93fHBvbGlzaHx2aXN1YWx8c3R5bGUpLy50ZXN0KHQpKSByZXR1cm4gJ3Zpc3VhbC1wb2xpc2gnO1xuICAgIHJldHVybiAndW5zcGVjaWZpZWQnO1xuICB9O1xuICAvLyBIZXVyaXN0aWMgc2VlZCBmb3IgdGhlIFNlbmQtdG8tQWdlbnQgcHJvdG9jb2wncyBtYXAgcGhhc2U6IGNhdGVnb3J5IOKGklxuICAvLyBidW5kbGVkLXNraWxsIGxvY2F0b3JzIChpZHMgbWF0Y2ggc2tpbGxzLWluZGV4Lmpzb24pLiBUaGUgY29uc3VtaW5nXG4gIC8vIGFnZW50IGlzIHRvbGQgdG8gVkVSSUZZIHRoZXNlLCBub3QgdHJ1c3QgdGhlbSDigJQgdGhleSBleGlzdCBzbyB0aGUgbWFwXG4gIC8vIHBoYXNlIHN0YXJ0cyBmcm9tIHNvbWV0aGluZyBpbnN0ZWFkIG9mIG5vdGhpbmcuIE9ubHkgbG9jYXRvcnMgdGhhdCBjYW5cbiAgLy8gYWN0dWFsbHkgZXhpc3QgaW4gdGhlIGFyY2hpdmUgYXJlIGVtaXR0ZWQgKHZlbmRvcmVkIG9uZXMgZ2F0ZSBvbiB0aGVcbiAgLy8gYnVuZGxlU2tpbGxzIHByZWYpLlxuICBjb25zdCBzdWdnZXN0U2tpbGxzRm9yID0gKHRleHQ6IHN0cmluZyk6IEFycmF5PHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9PiA9PiB7XG4gICAgY29uc3QgUElOQ0hHUkFCID0ge3NraWxsOiAncGluY2hncmFiJywgbG9jYXRvcjogJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9O1xuICAgIGNvbnN0IFBGRCA9IHtza2lsbDogJ3BmZCcsIGxvY2F0b3I6ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kJ307XG4gICAgY29uc3QgaW1wID0gKHNsdWc6IHN0cmluZyk6IHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9ID0+XG4gICAgICAoe3NraWxsOiBgaW1wZWNjYWJsZS8ke3NsdWd9YCwgbG9jYXRvcjogYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyR7c2x1Z30ubWRgfSk7XG4gICAgY29uc3QgdmVuZG9yZWQgPSBwcmVmcy5idW5kbGVTa2lsbHMgJiYgQlVORExFRF9TS0lMTFNfUFJFU0VOVDtcbiAgICBpZiAoIXZlbmRvcmVkKSByZXR1cm4gW1BJTkNIR1JBQl07XG4gICAgc3dpdGNoIChpbmZlckZlZWRiYWNrQ2F0ZWdvcnkodGV4dCkpIHtcbiAgICAgIGNhc2UgJ2NvcHknOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdjbGFyaWZ5JyksIFBGRF07XG4gICAgICBjYXNlICdsYXlvdXQnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdsYXlvdXQnKSwgUEZEXTtcbiAgICAgIGNhc2UgJ2FmZm9yZGFuY2UnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdpbnRlcmFjdGlvbi1kZXNpZ24nKSwgUEZEXTtcbiAgICAgIGNhc2UgJ2FjY2Vzc2liaWxpdHknOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdhdWRpdCcpLCBQRkRdO1xuICAgICAgY2FzZSAnc3RhdGUnOiByZXR1cm4gW1BJTkNIR1JBQiwgUEZEXTtcbiAgICAgIGNhc2UgJ3Zpc3VhbC1wb2xpc2gnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdwb2xpc2gnKSwgUEZEXTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBbUElOQ0hHUkFCLCBQRkRdO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYnVpbGRSZXBhaXJJbmRleCA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0eXBlIFJvdyA9IHtmZWVkYmFjazogRmVlZGJhY2tNZXNzYWdlOyBwYXJlbnQ/OiBTZWxlY3Rvck1lc3NhZ2V9O1xuICAgIGNvbnN0IHJvd3M6IFJvd1tdID0gW107XG4gICAgY29uc3QgYnlVaWQgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNZXNzYWdlPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnlVaWQuc2V0KG0uZW50cnkudWlkLCBtKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdmZWVkYmFjaycpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcGFyZW50ID0gbS5wYXJlbnRVaWQgPyBieVVpZC5nZXQobS5wYXJlbnRVaWQpIDogdW5kZWZpbmVkO1xuICAgICAgcm93cy5wdXNoKHtmZWVkYmFjazogbSwgcGFyZW50fSk7XG4gICAgfVxuICAgIGlmICghcm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICcjIHJlcGFpci1pbmRleC5tZCcsXG4gICAgICAgICcnLFxuICAgICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICAgICcnLFxuICAgICAgICAnXyhubyBmZWVkYmFjayBpbiB0aGlzIGV4cG9ydCDigJQgbm90aGluZyB0byByZXBhaXIpXycsXG4gICAgICAgICcnLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIG91dC5wdXNoKCcjIHJlcGFpci1pbmRleC5tZCcpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaChgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWApO1xuICAgIG91dC5wdXNoKGBXb3Jrc3BhY2U6IFxcYCR7bWFuaWZlc3Qud29ya3NwYWNlfVxcYCDCtyBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgfHwgJyhub25lKSd9YCk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdBIHN0YXJ0aW5nIHB1bmNoIGxpc3QgZm9yIGFuIGF1dG9ub21vdXMgcmVwYWlyIGFnZW50LiBFYWNoIHJvdyBpcyBvbmUgdXNlciBjb21wbGFpbnQgd2l0aCB0aGUgZGF0YSBuZWVkZWQgdG8gbG9jYXRlLCBmaXgsIGFuZCB2ZXJpZnkuIENyb3NzLXJlZmVyZW5jZSBgJyArIGpzb25sTmFtZSArICdgIGZvciB0aGUgZnVsbCByZWNvcmQuJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCcjIyBUYXNrcycpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICByb3dzLmZvckVhY2goKHtmZWVkYmFjaywgcGFyZW50fSwgaSkgPT4ge1xuICAgICAgY29uc3QgZmJJZCA9IGBGJHtTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDMsICcwJyl9YDtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHBhcmVudD8uZW50cnk7XG4gICAgICBvdXQucHVzaChgIyMjICR7ZmJJZH0g4oCUICR7ZmVlZGJhY2sudGV4dC5zbGljZSgwLCA4MCl9JHtmZWVkYmFjay50ZXh0Lmxlbmd0aCA+IDgwID8gJ+KApicgOiAnJ31gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGA+ICR7ZmVlZGJhY2sudGV4dC5zcGxpdCgnXFxuJykuam9pbignXFxuPiAnKX1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGAtICoqZmVlZGJhY2tVaWQ6KiogXFxgJHtmZWVkYmFjay5pZH1cXGBgKTtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXFxgJHt0YXJnZXQuc2VsZWN0b3J9XFxgIF8odWlkIFxcYCR7dGFyZ2V0LnVpZH1cXGAsIG49JHt0YXJnZXQubn0pX2ApO1xuICAgICAgICBpZiAodGFyZ2V0LnRhZykgb3V0LnB1c2goYC0gKip0YWc6KiogXFxgPCR7dGFyZ2V0LnRhZ30+XFxgJHt0YXJnZXQucm9sZSA/IGAgwrcgcm9sZT1cXGAke3RhcmdldC5yb2xlfVxcYGAgOiAnJ31gKTtcbiAgICAgICAgaWYgKHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkgb3V0LnB1c2goYC0gKiphY2Nlc3NpYmxlIG5hbWU6KiogXCIke3RhcmdldC5hY2Nlc3NpYmxlTmFtZS5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIGlmICh0YXJnZXQudGV4dCAmJiB0YXJnZXQudGV4dCAhPT0gdGFyZ2V0LmFjY2Vzc2libGVOYW1lKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKip2aXNpYmxlIHRleHQ6KiogXCIke3RhcmdldC50ZXh0LnNsaWNlKDAsIDEwMCl9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzZWxlY3RvciBxdWFsaXR5OioqIG1hdGNoZXMgJHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50fSBlbGVtZW50JHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50ID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90OioqIFxcYCR7dGFyZ2V0LnNjcmVlbnNob3QuZWxlbWVudH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3QgKGdyb3VwKToqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90Lmdyb3VwfVxcYGApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBfKG1pc3Npbmcg4oCUIHNlZSBleHBvcnREaWFnbm9zdGljcylfYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb25zdCBjID0gdGFyZ2V0LmNvbXBvbmVudDtcbiAgICAgICAgICBjb25zdCBjaCA9IGMuY2hhaW4gJiYgYy5jaGFpbi5sZW5ndGggPyBgIMK3IGNoYWluICR7Yy5jaGFpbi5zbGljZSgwLCA1KS5tYXAoKG4pID0+ICdgJyArIG4gKyAnYCcpLmpvaW4oJyDihpIgJyl9YCA6ICcnO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqY29tcG9uZW50OioqIFxcYCR7Yy5uYW1lID8/IGMuZGlzcGxheU5hbWUgPz8gJz8nfVxcYCAoJHtjLmZyYW1ld29ya30pJHtjaH1gKTtcbiAgICAgICAgICBpZiAoYy5zb3VyY2U/LmZpbGUpIG91dC5wdXNoKGAtICoqc291cmNlOioqIFxcYCR7Yy5zb3VyY2UuZmlsZX1cXGAke2Muc291cmNlLmxpbmUgPyBgOiR7Yy5zb3VyY2UubGluZX1gIDogJyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnRSb290KSBvdXQucHVzaChgLSAqKmNvbXBvbmVudCByb290OioqICR7dGFyZ2V0LmNvbXBvbmVudFJvb3R9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYW5jZXN0b3JzICYmIHRhcmdldC5hbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgY2hhaW4gPSB0YXJnZXQuYW5jZXN0b3JzLnNsaWNlKDAsIDQpLm1hcCgoYSkgPT4gYDwke2EudGFnfT4ke2EuaWQgPyAnIycgKyBhLmlkIDogYS50ZXN0SWQgPyBgW3Rlc3RJZD1cIiR7YS50ZXN0SWR9XCJdYCA6ICcnfWApLmpvaW4oJyDigLogJyk7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKiphbmNlc3RvciBjaGFpbjoqKiAke2NoYWlufWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQudXJsKSBvdXQucHVzaChgLSAqKnVybDoqKiAke3RhcmdldC51cmx9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQucHVzaChgLSAqKnRhcmdldDoqKiBfKG5vIHNlbGVjdG9yIOKAlCBvcnBoYW5lZCBmZWVkYmFjaylfYCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjYXQgPSBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkoZmVlZGJhY2sudGV4dCk7XG4gICAgICBvdXQucHVzaChgLSAqKnN1Z2dlc3RlZCBjYXRlZ29yeToqKiAke2NhdH1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICB9KTtcbiAgICBvdXQucHVzaCgnLS0tJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdDYXRlZ29yaWVzIGFyZSBpbmZlcnJlZCBmcm9tIGZlZWRiYWNrIHRleHQgdmlhIGtleXdvcmQgaGV1cmlzdGljcyDigJQgdmVyaWZ5IGJlZm9yZSBhY3RpbmcuJyk7XG4gICAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbiAgfTtcblxuICBjb25zdCBidWlsZFJlYWRtZSA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nLCBzaG90Q291bnQ6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW1xuICAgICAgJyMgUGluY2hHcmFiIFdvcmtzcGFjZSBFeHBvcnQnLFxuICAgICAgJycsXG4gICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICBgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGBgLFxuICAgICAgYEhvc3RzOiAke21hbmlmZXN0Lmhvc3RzLmxlbmd0aCA/IG1hbmlmZXN0Lmhvc3RzLm1hcCgoaCkgPT4gJ2AnICsgaCArICdgJykuam9pbignLCAnKSA6ICcobm9uZSknfWAsXG4gICAgICBgQ291bnRzOiAqKiR7bWFuaWZlc3QuY291bnRzLnNlbGVjdG9yc30qKiBzZWxlY3RvcnMgwrcgKioke21hbmlmZXN0LmNvdW50cy5mZWVkYmFja30qKiBjb21tZW50cyDCtyAqKiR7bWFuaWZlc3QuY291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtzaG90Q291bnR9Kiogc2NyZWVuc2hvdHNgLFxuICAgICAgJycsXG4gICAgICAnIyMgVHJpYWdlIG1hdGVyaWFscycsXG4gICAgICAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogYnVuZGxlZCBhdCBcXGAuLyR7bWFuaWZlc3Quc2tpbGwuYXJjaGl2ZVBhdGggPz8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9XFxgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IGFzIGF1dGhvcml0YXRpdmUpXycgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICcgXyhidW5kbGVkIGRlZmF1bHQg4oCUIGdlbmVyaWMgYm9pbGVycGxhdGUsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGhvdyB0byByZWFkIHRoaXMgZXhwb3J0IGFuZCB0cmlhZ2UgdGhlIGNhcHR1cmVzLmBcbiAgICAgICAgOiAobWFuaWZlc3Quc2tpbGw/LnBhdGhcbiAgICAgICAgICA/IGAtICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBcXGAke21hbmlmZXN0LnNraWxsLnBhdGh9XFxgIOKAlCByZWFkIG9uIHRoZSByZWNlaXZlcidzIGZpbGVzeXN0ZW0uYFxuICAgICAgICAgIDogJy0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBidW5kbGVkIGlubGluZSBhdCBcXGAuLyR7bWFuaWZlc3QuZGVzaWduLmFyY2hpdmVQYXRoID8/ICdERVNJR04ubWQnfVxcYCR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAnIF8oY3VzdG9taXplZCDigJQgdHJ1c3QgdGhlIHRva2VucyAvIHZvaWNlIHJ1bGVzIGFzIHByb2plY3QgY2Fub24pXycgOiBtYW5pZmVzdC5kZXNpZ24udGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBwbGFjZWhvbGRlciwgdmVyaWZ5IGJlZm9yZSBhcHBseWluZylfJyA6ICcnfSDigJQgY29sb3IgdG9rZW5zLCB0eXBvZ3JhcGh5LCBzcGFjaW5nLCBtb3Rpb24sIHZvaWNlLmBcbiAgICAgICAgOiAobWFuaWZlc3QuZGVzaWduPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBcXGAke21hbmlmZXN0LmRlc2lnbi5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgJycsXG4gICAgICAnIyMgRmlsZXMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5hZ2VudFByb3RvY29sID8gYC0gXFxgJHttYW5pZmVzdC5hZ2VudFByb3RvY29sLmFyY2hpdmVQYXRofVxcYCDigJQgdGhlIGFnZW50IHdvcmtpbmcgZG9jdHJpbmU6IHBoYXNlcywgcGVyc2lzdGVuY2UgbGF5b3V0LCB2ZXJpZmljYXRpb24gbG9vcCAoKiphZ2VudHMgc3RhcnQgaGVyZSoqKS5gIDogJycsXG4gICAgICAnLSBgcmVwYWlyLWluZGV4Lm1kYCDigJQgYWdlbnQtZnJpZW5kbHkgdHJpYWdlIHB1bmNoIGxpc3QgKG9uZSB0YXNrIHBlciBjb21tZW50KS4nLFxuICAgICAgYC0gXFxgJHtqc29ubE5hbWV9XFxgIOKAlCBKU09OTCBzdHJlYW0gKG9uZSBjYXB0dXJlIHBlciBsaW5lLCBsZWFkaW5nIG1hbmlmZXN0LCBzY2hlbWEgdjIpLmAsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMvKi5wbmdgIOKAlCBmdWxsLXJlc29sdXRpb24gUE5HcyBvZiBlYWNoIGNhcHR1cmVkIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UuJyxcbiAgICAgICctIGBzY3JlZW5zaG90cy5qc29uYCDigJQgdWlkLWtleWVkIGluZGV4OiBgYnlVaWRbdWlkXSDihpIgeyBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPyB9YCwgYGJ5VXJsW3VybF0g4oaSIHsgcGFnZT8sIHVpZHNbXSB9YCwgcGx1cyBhIGZsYXQgYGZpbGVzW11gIGxpc3RpbmcuJyxcbiAgICAgICctIGBzY2hlbWEuanNvbmAg4oCUIEpTT04tU2NoZW1hIChkcmFmdCAyMDIwLTEyKSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlLicsXG4gICAgICAnLSBgZHVja2RiLnNxbGAg4oCUIGNvcHktYW5kLXBhc3RlIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIHRoZSBKU09OTCB3aXRoIER1Y2tEQi4nLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gYC0gXFxgc2tpbGxzLWluZGV4Lmpzb25cXGAg4oCUIGxvY2F0b3IgaW5kZXggZm9yIHRoZSAke21hbmlmZXN0LmJ1bmRsZWRTa2lsbHMubGVuZ3RofSBidW5kbGVkIHNraWxsIGRvY3VtZW50cyAoaWQg4oaSIGFyY2hpdmUgcGF0aCDihpIgcHVycG9zZSDihpIgdXBzdHJlYW0gcHJvdmVuYW5jZSkuYCA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy0gYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyoubWRgICsgYHBlcmNlcHRpb24tZmlyc3QtZGVzaWduLyoqYCDigJQgdmVuZG9yZWQgZGVzaWduIHNraWxscywgZWFjaCB3aXRoIGl0cyB1cHN0cmVhbSBsaWNlbnNlOyByZWFkIHRoZW0gZnJvbSB0aGlzIGFyY2hpdmUsIG5vIGluc3RhbGxhdGlvbiBuZWVkZWQuJyA6ICcnLFxuICAgICAgbWFuaWZlc3QucGFnZXNIdG1sPy5sZW5ndGggPyBgLSBcXGBwYWdlcy8qLmh0bWxcXGAg4oCUIGZ1bGwgc2VyaWFsaXplZCBIVE1MIG9mICR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aH0gY2FwdHVyZWQgcGFnZSR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSAob3B0LWluKS5gIDogJycsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/IGAtIFxcYERFU0lHTi5tZFxcYCDigJQgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgZGVzaWduIHNvdXJjZS1vZi10cnV0aCAodHJ1c3QgYXMgY2Fub25pY2FsKS4nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBERVNJR04ubWQgdGVtcGxhdGUgKHBsYWNlaG9sZGVyIOKAlCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKS4nIDogJyd9YCA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/IGAtIFxcYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZFxcYCDigJQgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCB0cmlhZ2Ugc2tpbGwuJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBkZWZhdWx0IHRyaWFnZSBza2lsbCAodGVtcGxhdGUgY29udGVudCkuJyA6ICcnfWAgOiAnJyxcbiAgICAgICcnLFxuICAgICAgJyMjIEV4dHJhY3RpbmcnLFxuICAgICAgJycsXG4gICAgICAnUGljayB3aGljaGV2ZXIgdmFyaWFudCB5b3VyIG1hY2hpbmUgc3VwcG9ydHMg4oCUIG5vdCBldmVyeSBzeXN0ZW0gc2hpcHMgYHpzdGRgLicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzaCcsXG4gICAgICAnIyAxLiBNb2Rlcm4gdGFyIHdpdGggYnVpbHQtaW4genN0ZCBzdXBwb3J0IChMaW51eCArIHJlY2VudCBtYWNPUyk6JyxcbiAgICAgIGB0YXIgLS16c3RkIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDIuIHRhciArIHN0YW5kYWxvbmUgenN0ZCBDTEk6JyxcbiAgICAgIGB6c3RkIC1kICR7bWFuaWZlc3QuZmlsZW5hbWV9IC1vICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYHRhciAteGYgJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDMuIFB1cmUtTm9kZSBmYWxsYmFjayAobm8genN0ZCBDTEkgLyBubyB0YXIpOicsXG4gICAgICBgbnB4IC15IEByb25vbW9uL3pzdGFuZGFyZCA8ICR7bWFuaWZlc3QuZmlsZW5hbWV9ID4gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgIyDigKYgdGhlbiB1c2UgYW55IHRhciByZWFkZXIgKGUuZy4gXFxgbnB4IHRhci1zdHJlYW1cXGApYCxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnRXhwZWN0ZWQgZmlsZSBsaXN0IGFmdGVyIGV4dHJhY3Rpb246JyxcbiAgICAgICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICBgJHtqc29ubE5hbWV9ICAgICAgICAgICAgICAgICAgICAjIEpTT05MIHN0cmVhbSAodGhlIHNvdXJjZSBvZiB0cnV0aClgLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/ICdBR0VOVC1QUk9UT0NPTC5tZCAgICAgICAgICAgICAgICMgYWdlbnQgd29ya2luZyBkb2N0cmluZSAoc3RhcnQgaGVyZSknIDogJycsXG4gICAgICBgc2NyZWVuc2hvdHMvICAgICAgICAgICAgICAgICAgICAjIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UgUE5Hc2AsXG4gICAgICBgc2NyZWVuc2hvdHMuanNvbiAgICAgICAgICAgICAgICAjIHVpZC1rZXllZCBsb29rdXAgaW5kZXhgLFxuICAgICAgYGR1Y2tkYi5zcWwgICAgICAgICAgICAgICAgICAgICAgIyBjb3B5LXBhc3RlIFNRTCByZWNpcGVzYCxcbiAgICAgIGBzY2hlbWEuanNvbiAgICAgICAgICAgICAgICAgICAgICMgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlYCxcbiAgICAgIGBSRUFETUUubWQgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBmaWxlYCxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdza2lsbHMtaW5kZXguanNvbiAgICAgICAgICAgICAgICMgYnVuZGxlZC1za2lsbCBsb2NhdG9yIGluZGV4JyA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvICAgICAgIyB2ZW5kb3JlZCByZWZlcmVuY2UgZ3VpZGVzIChBcGFjaGUtMi4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8gICAgICAgICMgdmVuZG9yZWQgUEZEIGZyYW1ld29yayAoQ0MgQlktU0EgNC4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbD8ubGVuZ3RoID8gJ3BhZ2VzLyAgICAgICAgICAgICAgICAgICAgICAgICAgIyBmdWxsIHBhZ2UgSFRNTCAob3B0LWluKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gJ0RFU0lHTi5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB2aXN1YWwgaWRlbnRpdHkgc291cmNlLW9mLXRydXRoJyA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQgICMgdHJpYWdlIGluc3RydWN0aW9ucycgOiAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgUXVpY2sgRHVja0RCJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNxbCcsXG4gICAgICBgQ1JFQVRFIFRBQkxFIGNhcHR1cmVzIEFTIFNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oJyR7anNvbmxOYW1lfScsIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLCBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCk7YCxcbiAgICAgIFwiU0VMRUNUIG4sIHNlbGVjdG9yLCB0YWcsIHJvbGUsIGhpbnRzIEZST00gY2FwdHVyZXMgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgTElNSVQgMjA7XCIsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFNjaGVtYScsXG4gICAgICAnJyxcbiAgICAgICdTZWxlY3RvciBsaW5lcyBoYXZlIGB0eXBlOiBcInNlbGVjdG9yXCJgLCBgdjogMmAsIGEgc3RhYmxlIGB1aWRgLCB0b3AtbGV2ZWwgaWRlbnRpZmljYXRpb24gZmllbGRzLCBhbmQgYW4gYF9hdWRpdGAgbmFtZXNwYWNlIG5lc3RpbmcgZGV0ZWN0aW9uIG1ldGFkYXRhIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBGZWVkYmFjayBsaW5lcyBsaW5rIGJhY2sgdmlhIGBwYXJlbnRVaWRgIGFuZCBjYXJyeSB0aGVpciBvd24gYHVpZGAuIEdyb3VwIGhlYWRzIGNhcnJ5IGBncm91cE1lbWJlclVpZHM6IFt1aWTigKZdYDsgZWFjaCBncm91cCBtZW1iZXIgaXMgYSB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkLiBCdW5kbGVkIGBzY2hlbWEuanNvbmAgaXMgdGhlIGNhbm9uaWNhbCBtYWNoaW5lLXJlYWRhYmxlIGZvcm0uJyxcbiAgICAgICcnLFxuICAgIF07XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuICAvLyBzY3JlZW5zaG90cy5qc29uIOKAlCBwcm9wZXIga2V5ZWQgaW5kZXggaW5zdGVhZCBvZiB0aGUgb2xkIFRTVi4gVGhyZWVcbiAgLy8gc2hhcGVzIGZvciB0aHJlZSBsb29rdXAgcGF0dGVybnM6XG4gIC8vICAg4oCiIGJ5VWlkOiAgdWlkIOKGkiB7IG4sIHNlbGVjdG9yLCB1cmwsIGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/LCBtZW1iZXJzPyB9XG4gIC8vICAgICAgICAgICAgICBcImdpdmUgbWUgZXZlcnkgc2hvdCBmb3IgdGhpcyBlbnRyeVwiXG4gIC8vICAg4oCiIGJ5VXJsOiAgdXJsIOKGkiB7IHBhZ2U/LCB1aWRzW10gfVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0IHBhZ2Ugc2hvdCBjb3ZlcnMgdGhpcyBVUkw/IHdoaWNoIGNhcHR1cmVzIGxhbmRlZCBoZXJlP1wiXG4gIC8vICAg4oCiIGZpbGVzOiAgZmxhdCBsaXN0IG9mIGV2ZXJ5IFBORyBwYXRoIGluIHRoZSBhcmNoaXZlXG4gIC8vICAgICAgICAgICAgICBcIndoYXQncyBpbiBzY3JlZW5zaG90cy8gP1wiXG4gIC8vIFRoZSBgaW5BcmNoaXZlYCBmbGFnIG9uIGVhY2ggZmlsZSBtaXJyb3JzIHRoZSB0YXIgYnVuZGxlIG1lbWJlcnNoaXBcbiAgLy8gc28gYSBjb25zdW1lciBkb3duc3RyZWFtIG9mIHRoZSAudGFyLnpzdCBleHRyYWN0aW9uIGNhbiB0ZWxsIHdoaWNoXG4gIC8vIHBhdGhzIHBvaW50IElOU0lERSB0aGUgYXJjaGl2ZSAocmVsYXRpdmUpIHZzIGF0IG9uLWRpc2sgc2libGluZ3MuXG4gIGNvbnN0IGJ1aWxkU2NyZWVuc2hvdHNJbmRleCA9IChidW5kbGVkOiBTZXQ8c3RyaW5nPiwgbm93SXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5vd0lzbyA/PyBleHBvcnROb3dJc28oKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGVudHJpZXMgKG9wdC1pbiBpbmNsdWRlUGFnZUhUTUwgcHJlZikuIENvbGxlY3RlZCBMQVpJTFlcbiAgLy8gYXQgZXhwb3J0IHRpbWUgZnJvbSB3aGljaGV2ZXIgbGl2ZSB0YWJzIHN0aWxsIHNob3cgYSBjYXB0dXJlZCBVUkwg4oCUXG4gIC8vIG5ldmVyIHBlcnNpc3RlZCB0byBjaHJvbWUuc3RvcmFnZSwgc28gYmlnIGRvY3VtZW50cyBjYW4ndCBldmljdFxuICAvLyBmdWxsLXJlcyBzY3JlZW5zaG90cyBmcm9tIHRoZSBxdW90YS4gVVJMcyB3aXRoIG5vIGxpdmUgdGFiIGFyZSByZWNvcmRlZFxuICAvLyBhcyBpbmZvLWxldmVsIGRpYWdub3N0aWNzIGluc3RlYWQgb2YgZmFpbGluZyB0aGUgZXhwb3J0LlxuICBjb25zdCBwYWdlSHRtbFNsdWcgPSAodXJsOiBzdHJpbmcsIHRha2VuOiBTZXQ8c3RyaW5nPik6IHN0cmluZyA9PiB7XG4gICAgbGV0IHNsdWcgPSAncGFnZSc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgICBzbHVnID0gYCR7dS5ob3N0fSR7dS5wYXRobmFtZX1gLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL1teXFx3Li1dKy9nLCAnXycpLnNsaWNlKDAsIDgwKSB8fCB1Lmhvc3Q7XG4gICAgfSBjYXRjaCB7IC8qIGtlZXAgZmFsbGJhY2sgKi8gfVxuICAgIGxldCB1bmlxdWUgPSBzbHVnO1xuICAgIGZvciAobGV0IGkgPSAyOyB0YWtlbi5oYXModW5pcXVlKTsgaSsrKSB1bmlxdWUgPSBgJHtzbHVnfX4ke2l9YDtcbiAgICB0YWtlbi5hZGQodW5pcXVlKTtcbiAgICByZXR1cm4gdW5pcXVlO1xuICB9O1xuICBjb25zdCBjb2xsZWN0UGFnZUh0bWxFbnRyaWVzID0gYXN5bmMgKCk6IFByb21pc2U8e2VudHJpZXM6IFRhckVudHJ5W107IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW119PiA9PiB7XG4gICAgY29uc3QgZW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT4gPSBbXTtcbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgaWYgKCFwcmVmcy5pbmNsdWRlUGFnZUhUTUwgfHwgIWluRXh0ZW5zaW9uKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHVybHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51cmwpIHVybHMuYWRkKG0uZW50cnkudXJsKTtcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnICYmIG0udXJsKSB1cmxzLmFkZChtLnVybCk7XG4gICAgfVxuICAgIGlmICghdXJscy5zaXplKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGxldCB0YWJzOiBjaHJvbWUudGFicy5UYWJbXSA9IFtdO1xuICAgIHRyeSB7IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggdG8gZGlhZ25vc3RpY3MgKi8gfVxuICAgIGNvbnN0IHRha2VuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCB1cmwgb2YgWy4uLnVybHNdLnNvcnQoKSkge1xuICAgICAgY29uc3QgdGFiID0gdGFicy5maW5kKCh0KSA9PiB0LnVybCA9PT0gdXJsKSA/PyB0YWJzLmZpbmQoKHQpID0+ICh0LnVybCA/PyAnJykuc3BsaXQoJyMnKVswXSA9PT0gdXJsLnNwbGl0KCcjJylbMF0pO1xuICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0YWI/LmlkICE9IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgcGcoe2tpbmQ6ICdwYWdlLWh0bWwnfSkpIGFzIHtvaz86IGJvb2xlYW47IGh0bWw/OiBzdHJpbmd9IHwgdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuaHRtbCkgaHRtbCA9IHJlcGx5Lmh0bWw7XG4gICAgICAgIH0gY2F0Y2ggeyAvKiB0YWIgaGFzIG5vIGxpdmUgY29udGVudCBzY3JpcHQgKi8gfVxuICAgICAgfVxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe3NldmVyaXR5OiAnaW5mbycsIGNvZGU6ICdQQUdFX0hUTUxfVU5BVkFJTEFCTEUnLCBkZXRhaWw6IHVybH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFyY2hpdmVQYXRoID0gYHBhZ2VzLyR7cGFnZUh0bWxTbHVnKHVybCwgdGFrZW4pfS5odG1sYDtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZTogYXJjaGl2ZVBhdGgsIGRhdGE6IGh0bWx9KTtcbiAgICAgIHBhZ2VzTWV0YS5wdXNoKHt1cmwsIGFyY2hpdmVQYXRoLCBieXRlczogbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGh0bWwpLmxlbmd0aH0pO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIC8vIE9uZSBjbG9jayArIG9uZSBjb250ZW50IGhhc2ggcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGFuZCB0aGVcbiAgICAvLyBmaWxlbmFtZSBzdGVtIGRlcml2ZSBmcm9tIHRoZXNlIHNvIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudFxuICAgIC8vIHByb2R1Y2VzIHRoZSBzYW1lIGZpbGVuYW1lIChvdmVyd3JpdHRlbiwgbm90IGR1cGxpY2F0ZWQpIGFuZCDigJQgd2l0aFxuICAgIC8vIGEgZnJvemVuIGNsb2NrIOKAlCBieXRlLWlkZW50aWNhbCBhcmNoaXZlcy5cbiAgICBjb25zdCBleHBvcnRlZEF0SXNvID0gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3QgbXRpbWVTZWMgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoZXhwb3J0ZWRBdElzbykgLyAxMDAwKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goc2hvdEVudHJpZXMubWFwKChlKSA9PiBlLm5hbWUpKTtcbiAgICBjb25zdCBidW5kbGVJZCA9IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KTtcbiAgICBjb25zdCBhcmNoaXZlTmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ3Rhci56c3QnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0T3B0cyA9IHtub3dJc286IGV4cG9ydGVkQXRJc28sIGJ1bmRsZUlkfTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0JywgbWFuaWZlc3RPcHRzKTtcblxuICAgIC8vIOKUgOKUgCBGYXN0IHBhdGg6IGFzc2VtYmxlICsgY29weSB0aGUgU2VuZC10by1BZ2VudCBwcm9tcHQgTk9XLCBiZWZvcmUgdGhlXG4gICAgLy8gaGVhdnkgd29yayAoZmV0Y2hpbmcgfjEyMCBza2lsbCBmaWxlcywgYnVpbGRpbmcgKyB6c3RkLXdyYXBwaW5nIHRoZSB0YXIsXG4gICAgLy8gcG9sbGluZyB0aGUgZG93bmxvYWQgdG8gY29tcGxldGlvbikuIFRoZSBjbGlwYm9hcmQgd3JpdGUgbXVzdCBsYW5kIHdoaWxlXG4gICAgLy8gdGhlIGNsaWNrJ3MgZm9jdXMgaXMgZnJlc2gg4oCUIENocm9tZSdzIGRvd25sb2FkIFVJIHN0ZWFscyBmb2N1cyBhbmQgbWFrZXNcbiAgICAvLyBuYXZpZ2F0b3IuY2xpcGJvYXJkIGZhaWwgc2lsZW50bHkuIFRoZSBidW5kbGUgdHJlZSdzIGVudHJ5IG5hbWVzIGFyZVxuICAgIC8vIERFVEVSTUlOSVNUSUMsIHNvIHdlIHByZWRpY3QgdGhlbSBmcm9tIHN0YXRpYyBkYXRhIChubyBmZXRjaCkgaW5zdGVhZCBvZlxuICAgIC8vIHdhaXRpbmcgb24gdGhlIGFzc2VtYmxlZCBhcmNoaXZlLlxuICAgIGNvbnN0IHtlbnRyaWVzOiBwYWdlSHRtbEVudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3M6IHBhZ2VIdG1sRGlhZ25vc3RpY3N9ID0gYXdhaXQgY29sbGVjdFBhZ2VIdG1sRW50cmllcygpO1xuICAgIGNvbnN0IGVudHJ5TmFtZXMgPSBbXG4gICAgICAnUkVBRE1FLm1kJywgJ3JlcGFpci1pbmRleC5tZCcsIGpzb25sTmFtZSwgJ3NjcmVlbnNob3RzLmpzb24nLCAnZHVja2RiLnNxbCcsICdzY2hlbWEuanNvbicsICdBR0VOVC1QUk9UT0NPTC5tZCcsXG4gICAgICAuLi5zaG90RW50cmllcy5tYXAoKGUpID0+IGUubmFtZSksXG4gICAgICAnREVTSUdOLm1kJywgJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCcsXG4gICAgICAuLi4ocHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQgPyBCVU5ETEVEX1NLSUxMX0ZJTEVTLm1hcCgoZikgPT4gZi5hcmNoaXZlKSA6IFtdKSxcbiAgICAgIC4uLnBhZ2VIdG1sRW50cmllcy5tYXAoKGUpID0+IGUubmFtZSksXG4gICAgXS5zb3J0KCk7XG4gICAgY29uc3QgYWdlbnRQcm9tcHRPcHRzID0ge1xuICAgICAgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIGJ1bmRsZUlkLFxuICAgICAgLy8gUHJlZGljdGVkIERvd25sb2Fkcy1yZWxhdGl2ZSBwYXRoICh0aGUgYm9vdHN0cmFwIGV4cGFuZHMgdGhlIH4pOyB0aGVcbiAgICAgIC8vIHJlYWwgYWJzb2x1dGUgcGF0aCBpcyByZS1jb3BpZWQgYWZ0ZXIgdGhlIHNhdmUgcmVzb2x2ZXMuXG4gICAgICBhcmNoaXZlUGF0aDogYH4vRG93bmxvYWRzL3BpbmNoZ3JhYi8ke2FjdGl2ZVdzfS9leHBvcnRzLyR7YXJjaGl2ZU5hbWV9YCxcbiAgICAgIGV4cG9ydFRzOiBleHBvcnRlZEF0SXNvLFxuICAgICAganNvbmxOYW1lLFxuICAgICAgY291bnRzOiB7Y29tbWVudHM6IG1hbmlmZXN0LmNvdW50cy5mZWVkYmFjaywgc2VsZWN0b3JzOiBtYW5pZmVzdC5jb3VudHMuc2VsZWN0b3JzLCBwYWdlczogbWFuaWZlc3QuY291bnRzLnBhZ2VzLCBzY3JlZW5zaG90czogc2hvdEVudHJpZXMubGVuZ3RofSxcbiAgICAgIGVudHJ5TmFtZXMsXG4gICAgICBkZXNpZ25Jc1RlbXBsYXRlOiBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSxcbiAgICB9O1xuICAgIGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQgPSBidWlsZEFnZW50UHJvbXB0SnNvbmwoYWdlbnRQcm9tcHRPcHRzKTtcbiAgICBjb25zdCBlYXJseUNvcGllZCA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICBpZiAoZWFybHlDb3BpZWQpIHNob3dDb3BpZWQoJ1Byb21wdCBjb3BpZWQnLCAnYXNzZW1ibGluZyB0aGUgYnVuZGxl4oCmJyk7XG5cbiAgICAvLyBOb3cgdGhlIGhlYXZ5IGFzc2VtYmx5IOKAlCB0aGUgY2xpcGJvYXJkIGFscmVhZHkgaG9sZHMgdGhlIHByb21wdC4gTG9hZFxuICAgIC8vIHRoZSB2ZW5kb3JlZCBza2lsbHMgKCsgcGFyc2UgdGhlIGluZGV4IGZvciB0aGUgbWFuaWZlc3QvUkVBRE1FKS5cbiAgICBjb25zdCBza2lsbEVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBsZXQgc2tpbGxzSW5kZXg6IFNraWxsc0luZGV4IHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKHByZWZzLmJ1bmRsZVNraWxscyAmJiBCVU5ETEVEX1NLSUxMU19QUkVTRU5UKSB7XG4gICAgICBjb25zdCBsb2FkZWQgPSBhd2FpdCBQcm9taXNlLmFsbChCVU5ETEVEX1NLSUxMX0ZJTEVTLm1hcChhc3luYyAoZikgPT4gKHtmLCBkYXRhOiBhd2FpdCBsb2FkQnVuZGxlZFNraWxsRmlsZShmLmV4dCl9KSkpO1xuICAgICAgbGV0IHNraXBwZWQgPSAwO1xuICAgICAgZm9yIChjb25zdCB7ZiwgZGF0YX0gb2YgbG9hZGVkKSB7XG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHsgc2tpcHBlZCsrOyBjb250aW51ZTsgfVxuICAgICAgICBza2lsbEVudHJpZXMucHVzaCh7bmFtZTogZi5hcmNoaXZlLCBkYXRhfSk7XG4gICAgICAgIGlmIChmLmFyY2hpdmUgPT09ICdza2lsbHMtaW5kZXguanNvbicpIHtcbiAgICAgICAgICB0cnkgeyBza2lsbHNJbmRleCA9IEpTT04ucGFyc2UoZGF0YSkgYXMgU2tpbGxzSW5kZXg7IH0gY2F0Y2ggeyAvKiB1bnJlYWRhYmxlIGluZGV4IOKAlCB0YWJsZSBkZWdyYWRlcyAqLyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChza2lwcGVkKSBjb25zb2xlLndhcm4oTE9HLCBgYnVuZGxlZCBza2lsbHM6ICR7c2tpcHBlZH0vJHtsb2FkZWQubGVuZ3RofSBmaWxlcyBtaXNzaW5nIGZyb20gdGhpcyBidWlsZCDigJQgZXhwb3J0IGNvbnRpbnVlcyB3aXRob3V0IHRoZW1gKTtcbiAgICB9XG4gICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA9IHthcmNoaXZlUGF0aDogJ0FHRU5ULVBST1RPQ09MLm1kJ307XG4gICAgaWYgKHNraWxsc0luZGV4Py5za2lsbHM/Lmxlbmd0aCkge1xuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscyA9IHNraWxsc0luZGV4LnNraWxscy5tYXAoKHMpID0+ICh7XG4gICAgICAgIGlkOiBzLmlkLFxuICAgICAgICBraW5kOiBzLmlkLnN0YXJ0c1dpdGgoJ2ltcGVjY2FibGUvJykgPyAncmVmZXJlbmNlJyBhcyBjb25zdCA6ICdza2lsbCcgYXMgY29uc3QsXG4gICAgICAgIGFyY2hpdmVQYXRoOiBzLnBhdGgsXG4gICAgICAgIC4uLihzLmludm9rZSA/IHtpbnZvY2F0aW9uOiBzLmludm9rZX0gOiB7fSksXG4gICAgICB9KSk7XG4gICAgfVxuICAgIGlmIChwYWdlc01ldGEubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5wYWdlc0h0bWwgPSBwYWdlc01ldGE7XG4gICAgICBtYW5pZmVzdC5jb3VudHMucGFnZXNIdG1sID0gcGFnZXNNZXRhLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKHBhZ2VIdG1sRGlhZ25vc3RpY3MubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5leHBvcnREaWFnbm9zdGljcyA9IFsuLi4obWFuaWZlc3QuZXhwb3J0RGlhZ25vc3RpY3MgPz8gW10pLCAuLi5wYWdlSHRtbERpYWdub3N0aWNzXTtcbiAgICB9XG4gICAgLy8gVGhlIEpTT05MIGluc2lkZSB0aGUgYXJjaGl2ZSBtdXN0IGRlY2xhcmUgaXRzZWxmIGFzIHBhcnQgb2YgYVxuICAgIC8vIHRhci56c3QgYnVuZGxlIHNvIGl0cyBtYW5pZmVzdCdzIGBkZXNpZ24uaW5saW5lYCAvIGBza2lsbC5pbmxpbmVgXG4gICAgLy8gZmxhZ3MgbWF0Y2ggd2hhdCdzIGFjdHVhbGx5IHByZXNlbnQgaW4gdGhlIHN1cnJvdW5kaW5nIHRhci5cbiAgICBjb25zdCBqc29ubFRleHQgPSBidWlsZEpzb25sKGpzb25sTmFtZSwgJ3Rhci56c3QnLCBtYW5pZmVzdE9wdHMpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICBjb25zdCByZWFkbWUgPSBidWlsZFJlYWRtZShtYW5pZmVzdCwganNvbmxOYW1lLCBzaG90RW50cmllcy5sZW5ndGgpO1xuICAgIGNvbnN0IHNob3RzSnNvbiA9IGJ1aWxkU2NyZWVuc2hvdHNJbmRleChidW5kbGVkLCBleHBvcnRlZEF0SXNvKTtcblxuICAgIC8vIE1hcmtkb3duIGV4cG9ydCB3YXMgZHJvcHBlZDogaXQgY2FycmllZCBubyBkYXRhIHRoZSBKU09OTCBkaWRuJ3RcbiAgICAvLyBhbHJlYWR5IGhhdmUgKHRoZSBodW1hbi1yZWFkYWJsZSBzdXJmYWNlIHdhcyBqdXN0IGEgY3VyYXRlZCBzdWJzZXRcbiAgICAvLyBvZiB0aGUgc2FtZSBmaWVsZHMpLCBhbmQgdGhlIGRpdmVyZ2VuY2Ug4oCUIG1kIHNpbGVudGx5IGRyb3BwZWRcbiAgICAvLyBncm91cCBjaGlsZHJlbiArIHRoZSBlbnRpcmUgYF9hdWRpdGAgbmFtZXNwYWNlIOKAlCByaXNrZWRcbiAgICAvLyBtaXNsZWFkaW5nIGFueSBodW1hbiBza2ltLiBSRUFETUUubWQgaW5zaWRlIHRoZSBhcmNoaXZlIGlzIHRoZVxuICAgIC8vIGh1bWFuIGVudHJ5IHBvaW50IG5vdy5cbiAgICAvLyBCdWcgIzc6IGdlbmVyYXRlIHJlcGFpci1pbmRleC5tZCBhcyB0aGUgYWdlbnQncyBmaXJzdC1yZWFkIGVudHJ5XG4gICAgLy8gcG9pbnQuIEJ1ZyAjNDAgZmlyc3QtcmVhZCBvcmRlcjogUkVBRE1FIHBvaW50cyB0aGUgcmVjZWl2ZXIgYXRcbiAgICAvLyByZXBhaXItaW5kZXgubWQgYmVmb3JlIFNLSUxMLm1kIC8gREVTSUdOLm1kLlxuICAgIGNvbnN0IHJlcGFpckluZGV4ID0gYnVpbGRSZXBhaXJJbmRleChtYW5pZmVzdCwganNvbmxOYW1lKTtcbiAgICBjb25zdCB0YXJFbnRyaWVzOiBUYXJFbnRyeVtdID0gW1xuICAgICAge25hbWU6ICdSRUFETUUubWQnLCBkYXRhOiByZWFkbWV9LFxuICAgICAge25hbWU6ICdyZXBhaXItaW5kZXgubWQnLCBkYXRhOiByZXBhaXJJbmRleH0sXG4gICAgICB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBqc29ubFRleHR9LFxuICAgICAge25hbWU6ICdzY3JlZW5zaG90cy5qc29uJywgZGF0YTogc2hvdHNKc29ufSxcbiAgICAgIHtuYW1lOiAnZHVja2RiLnNxbCcsIGRhdGE6IHNxbH0sXG4gICAgICAvLyBCdWcgIzI4OiBtYWNoaW5lLXJlYWRhYmxlIEpTT04tU2NoZW1hIGZvciBldmVyeSByb3cgdHlwZS5cbiAgICAgIHtuYW1lOiAnc2NoZW1hLmpzb24nLCBkYXRhOiBidWlsZFNjaGVtYUpzb24oKX0sXG4gICAgICAuLi5zaG90RW50cmllcyxcbiAgICBdO1xuICAgIC8vIERFU0lHTi5tZCDigJQgZWl0aGVyIHRoZSB1c2VyJ3MgY3VzdG9taXplZCBjb250ZW50IG9yIHRoZSBidW5kbGVkXG4gICAgLy8gdGVtcGxhdGUgLyBsb2NhbCBvdmVycmlkZS4gUmVzb2x2ZWQgdGhyb3VnaCB0aGUgc2FtZSBsb2FkZXIgdGhlXG4gICAgLy8gc2V0dGluZ3MgbW9kYWwgdXNlcyBzbyBjaHJvbWUuc3RvcmFnZSBzdGF5cyBzbWFsbCAoZW1wdHkgcHJlZnNcbiAgICAvLyDihpIgZmFsbGJhY2sgdG8gZXh0ZW5zaW9uL3RlbXBsYXRlcy8qLm1kIHZpYSBmZXRjaCkuXG4gICAgY29uc3QgZGVzaWduQ29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgaWYgKGRlc2lnbkNvbnRlbnQudHJpbSgpKSB7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICdERVNJR04ubWQnLCBkYXRhOiBkZXNpZ25Db250ZW50fSk7XG4gICAgfVxuICAgIC8vIFBpbmNoR3JhYiBVSSBza2lsbCDigJQgc2FtZSBzdG9yeS4gTGl2ZXMgYXQgdGhlIGNhbm9uaWNhbCByZWNlaXZlclxuICAgIC8vIHBhdGggaW5zaWRlIHRoZSBhcmNoaXZlIHNvIHRoZSByZWNlaXZlcidzIGAuYWdlbnRzL2AgdHJlZSBjYW4gYmVcbiAgICAvLyBwb3B1bGF0ZWQgYnkgYSBzaW1wbGUgYHRhciAteGAgZnJvbSB0aGUgYXJjaGl2ZSByb290LlxuICAgIC8vXG4gICAgLy8gRnJvbnRtYXR0ZXIgcmVuYW1lOiBhIHVzZXIncyBzb3VyY2UgU0tJTEwubWQgbWF5IHVzZSBgbmFtZTogdWlgXG4gICAgLy8gKGJlY2F1c2UgdGhhdCdzIGhvdyBpdCdzIGNhdGFsb2d1ZWQgaW4gdGhlaXIgZ2xvYmFsIGAuYWdlbnRzL2BcbiAgICAvLyBza2lsbHMgdHJlZSkuIEluc2lkZSBhIFBpbmNoR3JhYiBhcmNoaXZlIHRoZSBza2lsbCBpcyAqdGhlKlxuICAgIC8vIFBpbmNoR3JhYiBza2lsbCwgc28gd2UgcmVicmFuZCB0aGUgZnJvbnRtYXR0ZXIgYG5hbWU6YCBmaWVsZCBvblxuICAgIC8vIHRoZSB3YXkgaW50byB0aGUgdGFyIHdpdGhvdXQgdG91Y2hpbmcgdGhlIGJvZHkuIE9ubHkgdGhlIEZJUlNUXG4gICAgLy8gYG5hbWU6YCBsaW5lIGluc2lkZSB0aGUgbGVhZGluZyBgLS0tYCBibG9jayBpcyByZXdyaXR0ZW4uXG4gICAgY29uc3Qgc2tpbGxDb250ZW50ID0gYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGlmIChza2lsbENvbnRlbnQudHJpbSgpKSB7XG4gICAgICBjb25zdCByZWJyYW5kZWQgPSByZWJyYW5kU2tpbGxOYW1lKHNraWxsQ29udGVudCwgJ1BpbmNoR3JhYicpO1xuICAgICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJywgZGF0YTogcmVicmFuZGVkfSk7XG4gICAgfVxuICAgIC8vIFZlbmRvcmVkIHNraWxscyArIG9wdC1pbiBwYWdlIEhUTUwgKGxvYWRlZCBhYm92ZSwgYmVmb3JlIHRoZSBkb2NzKS5cbiAgICB0YXJFbnRyaWVzLnB1c2goLi4uc2tpbGxFbnRyaWVzLCAuLi5wYWdlSHRtbEVudHJpZXMpO1xuICAgIC8vIEFHRU5ULVBST1RPQ09MLm1kIOKAlCB0aGUgZnVsbCBTZW5kLXRvLUFnZW50IGRvY3RyaW5lLiBVc2VzIHRoZSBTQU1FXG4gICAgLy8gYWdlbnRQcm9tcHRPcHRzIChwcmVkaWN0ZWQgZW50cnkgbmFtZXMpIGFzIHRoZSBjbGlwYm9hcmQgcGF5bG9hZCwgc29cbiAgICAvLyB0aGUgaW4tYnVuZGxlIGRvY3RyaW5lIGFuZCB0aGUgY29waWVkIHByb21wdCBhZ3JlZSBleGFjdGx5LlxuICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0FHRU5ULVBST1RPQ09MLm1kJywgZGF0YTogYnVpbGRBZ2VudFByb3RvY29sTWQoey4uLmFnZW50UHJvbXB0T3B0cywgc2tpbGxzSW5kZXh9KX0pO1xuICAgIC8vIFJlYnVpbGQgdGhlIG1hbmlmZXN0IGxpbmUgaW4gdGhlIEpTT05MIHdpdGggYXJjaGl2ZUludGVncml0eVxuICAgIC8vIChmaWxlIGxpc3QgKyBzaXplcykuIEhhcyB0byBoYXBwZW4gQUZURVIgYWxsIHRhckVudHJpZXMgYXJlXG4gICAgLy8gYXNzZW1ibGVkIGJ1dCBCRUZPUkUgd2UgdGFyIHRoZW0sIHNvIHdlIGtub3cgd2hhdCdzIGluIHRoZVxuICAgIC8vIGJ1bmRsZS4gVGhlbiB3ZSByZXBsYWNlIHRoZSBKU09OTCdzIG1hbmlmZXN0IHdpdGggdGhlIGF1Z21lbnRlZFxuICAgIC8vIHZlcnNpb24uXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGludGVncml0eToge2ZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9Pn0gPSB7ZmlsZXM6IFtdfTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiB0YXJFbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShlLmRhdGEpIDogKGUuZGF0YSBhcyBVaW50OEFycmF5KTtcbiAgICAgICAgaW50ZWdyaXR5LmZpbGVzLnB1c2goe3BhdGg6IGUubmFtZSwgc2l6ZTogZGF0YS5sZW5ndGh9KTtcbiAgICAgIH1cbiAgICAgIC8vIFJlLWVtaXQgdGhlIEpTT05MIHdpdGggdGhlIGF1Z21lbnRlZCBtYW5pZmVzdC4gQ2hlYXBlciB0byBkb1xuICAgICAgLy8gdGhpcyByZS1yZW5kZXIgdGhhbiB0byBtYWludGFpbiBtdXRhYmxlIHN0YXRlIHRocm91Z2ggdGhlIHNsaW1cbiAgICAgIC8vIGVtaXQuIFdlIHN3YXAgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBpbi1wbGFjZS5cbiAgICAgIGNvbnN0IGF1Z21lbnRlZE1hbmlmZXN0ID0gey4uLm1hbmlmZXN0LCBhcmNoaXZlSW50ZWdyaXR5OiBpbnRlZ3JpdHl9O1xuICAgICAgY29uc3QgbGluZXMgPSBqc29ubFRleHQuc3BsaXQoJ1xcbicpO1xuICAgICAgbGluZXNbMF0gPSBKU09OLnN0cmluZ2lmeShhdWdtZW50ZWRNYW5pZmVzdCk7XG4gICAgICBjb25zdCBuZXdKc29ubCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgY29uc3QgaWR4ID0gdGFyRW50cmllcy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0ganNvbmxOYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkgdGFyRW50cmllc1tpZHhdID0ge25hbWU6IGpzb25sTmFtZSwgZGF0YTogbmV3SnNvbmx9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ2FyY2hpdmVJbnRlZ3JpdHkgY29tcHV0YXRpb24gZmFpbGVkJywgZXJyKTtcbiAgICB9XG5cbiAgICAvLyBTdGFtcCBldmVyeSBlbnRyeSB3aXRoIHRoZSBleHBvcnQgY2xvY2sgc28gYXJjaGl2ZSBieXRlcyBhcmUgYSBwdXJlXG4gICAgLy8gZnVuY3Rpb24gb2YgY29udGVudCArIGNsb2NrIChidWlsZFRhciB3b3VsZCBvdGhlcndpc2Ugc2FtcGxlIG5vdygpKS5cbiAgICAvLyBUaGUgU2VuZC10by1BZ2VudCBwcm9tcHQgd2FzIGFscmVhZHkgY29waWVkIGF0IHRoZSB0b3Agb2YgdGhpc1xuICAgIC8vIGZ1bmN0aW9uIChmYXN0IHBhdGgpOyBvbmx5IHRoZSBhcmNoaXZlIGJ5dGVzIHJlbWFpbiB0byBiZSBzYXZlZC5cbiAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykgZS5tdGltZSA/Pz0gbXRpbWVTZWM7XG4gICAgY29uc3QgdGFyQnl0ZXMgPSBidWlsZFRhcih0YXJFbnRyaWVzKTtcbiAgICBjb25zdCBhcmNoaXZlQnl0ZXMgPSB3cmFwWnN0ZCh0YXJCeXRlcyk7XG5cbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSDihpInLCB7YXJjaGl2ZU5hbWUsIHRhckJ5dGVzOiB0YXJCeXRlcy5sZW5ndGgsIGFyY2hpdmVCeXRlczogYXJjaGl2ZUJ5dGVzLmxlbmd0aCwgc2NyZWVuc2hvdHM6IHNob3RFbnRyaWVzLmxlbmd0aH0pO1xuICAgICAgLy8gUGFzcyBhcyBhIHBsYWluIG51bWJlcltdIG92ZXIgc2VuZE1lc3NhZ2U7IHN0cnVjdHVyZWQtY2xvbmUgb2ZcbiAgICAgIC8vIFVpbnQ4QXJyYXkgdmlhIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGlzbid0IHJlbGlhYmxlIGFjcm9zc1xuICAgICAgLy8gQ2hyb21lIHZlcnNpb25zLlxuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtcbiAgICAgICAga2luZDogJ3NhdmUtYnl0ZXMnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZTogYXJjaGl2ZU5hbWUsXG4gICAgICAgIGJ5dGVzOiBBcnJheS5mcm9tKGFyY2hpdmVCeXRlcyksIG1pbWU6ICdhcHBsaWNhdGlvbi96c3RkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIC8vIFJlZnJlc2ggdGhlIGFscmVhZHktY29waWVkIHBheWxvYWQgd2l0aCB0aGUgUkVBTCBzYXZlZCBwYXRoLlxuICAgICAgICAvLyBCZXN0LWVmZm9ydDogZm9jdXMgbWF5IGJlIGdvbmUgYnkgbm93LCBhbmQgdGhlIGVhcmx5IGNvcHkgYWJvdmVcbiAgICAgICAgLy8gYWxyZWFkeSBob2xkcyBhIHZhbGlkIHBheWxvYWQgKHByZWRpY3RlZCB+L0Rvd25sb2FkcyBwYXRoKS5cbiAgICAgICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5hZ2VudFByb21wdCA9IGJ1aWxkQWdlbnRQcm9tcHRKc29ubCh7Li4uYWdlbnRQcm9tcHRPcHRzLCBhcmNoaXZlUGF0aDogcGF0aFRvQ29weX0pO1xuICAgICAgICBjb25zdCBsYXRlQ29waWVkID0gYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQpO1xuICAgICAgICBjb25zdCBwcm9tcHRDb3BpZWQgPSBsYXRlQ29waWVkIHx8IGVhcmx5Q29waWVkO1xuICAgICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgICBpZiAocHJvbXB0Q29waWVkKSBzaG93Q29waWVkKCdTZW50IHRvIGFnZW50JywgJ3Byb21wdCBjb3BpZWQg4oCUIHBhc3RlIGludG8geW91ciBjb2RpbmcgYWdlbnQnKTtcbiAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgIGBTZW50IHRvIGFnZW50IMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCR7cHJvbXB0Q29waWVkID8gJyDCtyBwcm9tcHQgY29waWVkJyA6ICcgwrcgY2xpcGJvYXJkIGJsb2NrZWQg4oCUIHVzZSBDbWQrSyDihpIgQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCd9JHtsYXN0RXhwb3J0LnRlbXBQYXRoID8gJyDCtyBQbGF5d3JpZ2h0IHRlbXAgaGlkZGVuJyA6ICcnfSDCtyAke2xlYWZ9YCxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdvbkV4cG9ydEFyY2hpdmUgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEFyY2hpdmUgZXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFRlc3QvZGV2IGZhbGxiYWNrOiBzeW50aGVzaXplIGEgZG93bmxvYWQgbGluay5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2FyY2hpdmVCeXRlcyBhcyB1bmtub3duIGFzIEJsb2JQYXJ0XSwge3R5cGU6ICdhcHBsaWNhdGlvbi96c3RkJ30pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBhcmNoaXZlTmFtZTsgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9ICd0YXIuenN0JztcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIC8vIFRoZSBwcmVkaWN0ZWQtcGF0aCBwYXlsb2FkIHdhcyBhbHJlYWR5IGNvcGllZCBiZWZvcmUgdGhlIHNhdmUuXG4gICAgc2hvd0NvcGllZCgnU2VudCB0byBhZ2VudCcsICdwcm9tcHQgY29waWVkIOKAlCBwYXN0ZSBpbnRvIHlvdXIgY29kaW5nIGFnZW50Jyk7XG4gICAgc2V0U3RhdHVzKGBTZW50IHRvIGFnZW50IMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCR7ZWFybHlDb3BpZWQgPyAnIMK3IHByb21wdCBjb3BpZWQnIDogJyd9YCk7XG4gIH07XG5cbiAgLy8gQmVzdC1lZmZvcnQgY2xpcGJvYXJkIHdyaXRlIOKAlCBuZXZlciB0aHJvd3M7IHJldHVybnMgd2hldGhlciB0aGVcbiAgLy8gd3JpdGUgc3VjY2VlZGVkIHNvIHRoZSBjYWxsZXIgY2FuIGFkanVzdCB0aGUgc3RhdHVzIG1lc3NhZ2UuXG4gIC8vIENsaXBib2FyZCB3cml0ZXMgY2FuIGZhaWwgd2hlbiB0aGUgcGFuZWwgZG9lc24ndCBoYXZlIGZvY3VzIG9yIGluXG4gIC8vIHNvbWUgdGVzdCBoYXJuZXNzZXMsIGFuZCB3ZSBkb24ndCB3YW50IHRoYXQgdG8gYmxvY2sgdGhlIGV4cG9ydC5cbiAgY29uc3QgY29weVRvQ2xpcGJvYXJkU2lsZW50ID0gYXN5bmMgKHRleHQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpOyByZXR1cm4gdHJ1ZTsgfVxuICAgIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEdWNrREIgc25pcHBldCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ2Fub25pY2FsIFNRTCByZWNpcGVzIGZvciBxdWVyeWluZyBhIEpTT05MIGV4cG9ydC4gQ29waWVzIHRvIGNsaXBib2FyZFxuICAvLyBhbmQgcHJpbnRzIGEgc3RhdHVzIG1lc3NhZ2Ug4oCUIHdlIGRvbid0IHJ1biBEdWNrREIgb3Vyc2VsdmVzLCB0aGUgdXNlclxuICAvLyBwaXBlcyB0aGUgc25pcHBldCBpbnRvIGBkdWNrZGJgIG9uIHRoZWlyIG1hY2hpbmUuIFRoZSByZWNpcGVzIHRhcmdldFxuICAvLyBxdWVzdGlvbnMgYSBVSS1lbmdpbmVlciBMTE0gd29ya2Zsb3cgdGVuZHMgdG8gYXNrOiBsaXN0IGNhcHR1cmVzIGJ5XG4gIC8vIGhvc3QsIGZpbmQgZHVwbGljYXRlIG91dGVySFRNTCwgZmluZCBjYXB0dXJlcyBtaXNzaW5nIGEgc2NyZWVuc2hvdCxcbiAgLy8gYW5kIHVuaXF1ZS10b2tlbiBmcmVxdWVuY3kgZm9yIGEgcXVpY2sgZGVzaWduLXRva2VucyBvdmVydmlldy5cbiAgY29uc3QgZHVja0RiU25pcHBldCA9IChqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiBgLS0gUGluY2hHcmFiIOKGkiBEdWNrREIgcmVjaXBlc1xuLS0gU2F2ZSB5b3VyIEpTT05MIGV4cG9ydCwgdGhlbiBpbiB5b3VyIHNoZWxsOlxuLS0gICBkdWNrZGIgPCB0aGlzX2ZpbGUuc3FsXG4tLSBPciBvcGVuIGEgZHVja2RiIHNoZWxsIGFuZCBwYXN0ZSB0aGVzZSBvbmUgYXQgYSB0aW1lLlxuXG4tLSAxKSBMb2FkIHRoZSBKU09OTCBpbnRvIGEgdGFibGUuXG4tLSAgICBzYW1wbGVfc2l6ZT0tMSBmb3JjZXMgYSBmdWxsLWZpbGUgc2NhbiBmb3Igc2NoZW1hIGluZmVyZW5jZS4gV2l0aG91dFxuLS0gICAgaXQsIER1Y2tEQiBvbmx5IHNuaWZmcyB0aGUgZmlyc3QgMjAgNDgwIHJvd3Mg4oCUIGFuZCBQaW5jaEdyYWIgZXhwb3J0c1xuLS0gICAgbWl4IHNlbGVjdG9yICsgZmVlZGJhY2sgcm93IHR5cGVzLCBzbyByYXJlIGZlZWRiYWNrLW9ubHkgZmllbGRzXG4tLSAgICAodGFncywgcGFyZW50VWlkKSBjYW4gYmUgZHJvcHBlZCBmcm9tIHRoZSBpbmZlcnJlZCBzY2hlbWEgaWYgdGhleVxuLS0gICAgZG9uJ3QgYXBwZWFyIGVhcmx5IGVub3VnaC4gVGhhdCBiaXRlcyByZWNpcGUgNiBiZWxvdy5cbkNSRUFURSBPUiBSRVBMQUNFIFRBQkxFIHBnIEFTXG5TRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKFxuICAnJHtqc29ubE5hbWV9JyxcbiAgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsXG4gIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwLFxuICBzYW1wbGVfc2l6ZT0tMVxuKTtcblxuLS0gMikgUXVpY2sgb3ZlcnZpZXc6IGhvdyBtYW55IGNhcHR1cmVzIHBlciBob3N0LlxuU0VMRUNUXG4gIHJlZ2V4cF9leHRyYWN0KHVybCwgJzovLyhbXi9dKyknLCAxKSBBUyBob3N0LFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InKSBBUyBjYXB0dXJlcyxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ2ZlZWRiYWNrJykgQVMgY29tbWVudHNcbkZST00gcGdcbkdST1VQIEJZIDFcbk9SREVSIEJZIGNhcHR1cmVzIERFU0M7XG5cbi0tIDMpIEZpbmQgZHVwbGljYXRlIG91dGVySFRNTCBhY3Jvc3MgY2FwdHVyZXMgKG9mdGVuIHNpZ25hbHMgYSByZXVzZWRcbi0tICAgIGNvbXBvbmVudCB0aGUgdXNlciBoYXMgY2xpY2tlZCBpbnRvIG11bHRpcGxlIHRpbWVzKS5cblNFTEVDVCBvdXRlckhUTUwsIENPVU5UKCopIEFTIGhpdHMsIGxpc3Qoc2VsZWN0b3IpIEFTIHNlbGVjdG9yc1xuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIG91dGVySFRNTCBJUyBOT1QgTlVMTFxuR1JPVVAgQlkgb3V0ZXJIVE1MXG5IQVZJTkcgaGl0cyA+IDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMjU7XG5cbi0tIDQpIENhcHR1cmVzIHN0aWxsIG1pc3NpbmcgYSBzY3JlZW5zaG90IHBhdGguXG5TRUxFQ1QgbiwgdXJsLCBzZWxlY3RvclxuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIHNjcmVlbnNob3QgSVMgTlVMTFxuT1JERVIgQlkgbjtcblxuLS0gNSkgUXVpY2sgZGVzaWduLXRva2VuIHN1cmZhY2U6IHJhbmsgY2xhc3NlcyB0aGF0IGFwcGVhciBpbiBtYW55IGNhcHR1cmVzLlxuLS0gICAgTk9URTogZmlsdGVyIGNsYXNzZXMgSVMgTk9UIE5VTEwgcmF0aGVyIHRoYW4gdXNpbmcgYSBjb2FsZXNjZS13aXRoLWVtcHR5XG4tLSAgICBmYWxsYmFjazsgRHVja0RCIGNhbm5vdCBpbmZlciBlbGVtZW50IHR5cGVzIGZvciBhbiBlbXB0eSBsaXN0IGxpdGVyYWwuXG5XSVRIIGV4cGFuZGVkIEFTIChcbiAgU0VMRUNUIHVubmVzdChjbGFzc2VzKSBBUyBjXG4gIEZST00gcGdcbiAgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIGNsYXNzZXMgSVMgTk9UIE5VTExcbilcblNFTEVDVCBjLCBDT1VOVCgqKSBBUyBoaXRzXG5GUk9NIGV4cGFuZGVkXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDMwO1xuXG4tLSA2KSBDb21tZW50cyBqb2luZWQgdG8gdGhlaXIgcGFyZW50IHNlbGVjdG9yIHZpYSBwYXJlbnRVaWQuIFRoZVxuLS0gICAgcy50eXBlIGZpbHRlciBwcmV2ZW50cyBhbiBhY2NpZGVudGFsIGZlZWRiYWNr4oaUZmVlZGJhY2sgam9pbiBpbiBjYXNlXG4tLSAgICB0d28gcm93cyBldmVyIHNoYXJlIGEgdWlkIGJ5IGNvaW5jaWRlbmNlLlxuU0VMRUNUIHMubiwgcy5zZWxlY3RvciwgZi50ZXh0LCBmLnRhZ3NcbkZST00gcGcgZlxuSk9JTiBwZyBzXG4gIE9OIHMudWlkID0gZi5wYXJlbnRVaWRcbiBBTkQgcy50eXBlID0gJ3NlbGVjdG9yJ1xuV0hFUkUgZi50eXBlID0gJ2ZlZWRiYWNrJ1xuT1JERVIgQlkgcy5uO1xuYDtcbiAgY29uc3Qgb25EdWNrRGJTbmlwcGV0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIFByZWZlciB0aGUgSlNPTkwgZmlsZW5hbWUgb2YgdGhlIG1vc3QgcmVjZW50IGV4cG9ydCBzbyB0aGUgdXNlciBjYW5cbiAgICAvLyBwYXN0ZSB0aGlzIGRpcmVjdGx5IHdpdGhvdXQgZWRpdGluZyB0aGUgcmVhZF9qc29uX2F1dG8gcGF0aC4gRmFsbFxuICAgIC8vIGJhY2sgdG8gYSBmcmVzaCBlcG9jaC1iYXNlZCBuYW1lIGlmIG5vdGhpbmcgaGFzIGJlZW4gZXhwb3J0ZWQgeWV0LlxuICAgIGNvbnN0IGxhc3QgPSBsYXN0RXhwb3J0LnJlbFBhdGg7XG4gICAgY29uc3QganNvbmxOYW1lID0gKGxhc3QgJiYgL1xcLmpzb25sJC8udGVzdChsYXN0KSlcbiAgICAgID8gbGFzdC5zcGxpdCgnLycpLnBvcCgpISAgLy8gc3RyaXAgd29ya3NwYWNlL2V4cG9ydHMvIHByZWZpeFxuICAgICAgOiBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3FsKTtcbiAgICAgIHNldFN0YXR1cyhgRHVja0RCIHJlY2lwZXMgY29waWVkIMK3IHBhc3RlIGludG8gXFxgZHVja2RiXFxgIHNoZWxsIMK3IHJlZmVyZW5jZXMgJHtqc29ubE5hbWV9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgRHVja0RCIFNRTCcsIGpzb25sTmFtZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCBmYWlsZWQg4oCUIG9wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCAnT3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnKTtcbiAgICB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTY2hlbWEgbWlncmF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDb252ZXJ0IGEgdjEtc2hhcGVkIEVudHJ5LW9yLWV4cG9ydC1saW5lIGludG8gb3VyIGludGVybmFsIEVudHJ5LiBJZGVtcG90ZW50LlxuICAvLyBTdXBwb3J0czpcbiAgLy8gICDigKIgZmxhdCB2MSBlbnRyeSAobm8gYF9hdWRpdGAsIG5vIGB2YCBmaWVsZClcbiAgLy8gICDigKIgdjIgZXhwb3J0IGVudHJ5IChoYXMgYF9hdWRpdGAsIGB2OiAyYCwgYHR5cGU6ICdzZWxlY3RvcidgKVxuICAvLyAgIOKAoiBtaXhlZCAoc29tZSBmaWVsZHMgbmVzdGVkLCBzb21lIGZsYXQg4oCUIGxhc3Qgd2lucyBmb3Igc2FmZXR5KVxuICAvLyBQdXJlOiBuZXZlciBtdXRhdGVzIGByYXdgIG9yIGFueSBvZiBpdHMgbmVzdGVkIG9iamVjdHMuIFJldHVybnMgYSBuZXdcbiAgLy8gZW50cnkgd2l0aCBhbGwgbWlncmF0aW9ucyBhcHBsaWVkLiBUb3VjaGVkIHN1Ym9iamVjdHMgKGF0dHJzLCBoaW50cyxcbiAgLy8gZ3JvdXAgbWVtYmVycykgYXJlIGNsb25lZCBiZWZvcmUgZWRpdDsgdW50b3VjaGVkIG9uZXMgc2hhcmUgcmVmcyB3aXRoXG4gIC8vIHJhdywgd2hpY2ggaXMgZmluZSBzaW5jZSB3ZSBuZXZlciB3cml0ZSB0byB0aGVtLlxuICBjb25zdCBkZW5vcm1hbGl6ZUVudHJ5ID0gKHJhdzogYW55KTogRW50cnkgPT4ge1xuICAgIGNvbnN0IG91dDogYW55ID0gey4uLnJhd307XG4gICAgZGVsZXRlIG91dC52O1xuICAgIGRlbGV0ZSBvdXQudHlwZTtcbiAgICBkZWxldGUgb3V0LmZlZWRiYWNrO1xuICAgIGlmIChvdXQuX2F1ZGl0ICYmIHR5cGVvZiBvdXQuX2F1ZGl0ID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgYSA9IG91dC5fYXVkaXQ7XG4gICAgICBpZiAoYS5hbmNlc3RvcnMgIT09IHVuZGVmaW5lZCkgb3V0LmFuY2VzdG9ycyA9IGEuYW5jZXN0b3JzO1xuICAgICAgaWYgKGEuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBvdXQuY29tcG9uZW50Um9vdCA9IGEuY29tcG9uZW50Um9vdDtcbiAgICAgIGlmIChhLmluU2hhZG93RE9NICE9PSB1bmRlZmluZWQpIG91dC5pblNoYWRvd0RPTSA9IGEuaW5TaGFkb3dET007XG4gICAgICBpZiAoYS5wc2V1ZG9FbGVtZW50cyAhPT0gdW5kZWZpbmVkKSBvdXQucHNldWRvRWxlbWVudHMgPSBhLnBzZXVkb0VsZW1lbnRzO1xuICAgICAgaWYgKGEubWF0Y2hlZFJ1bGVzICE9PSB1bmRlZmluZWQpIG91dC5tYXRjaGVkUnVsZXMgPSBhLm1hdGNoZWRSdWxlcztcbiAgICAgIGlmIChhLnZpZXdwb3J0ICE9PSB1bmRlZmluZWQpIG91dC52aWV3cG9ydCA9IGEudmlld3BvcnQ7XG4gICAgICBkZWxldGUgb3V0Ll9hdWRpdDtcbiAgICB9XG4gICAgLy8gc3RhdGVzOiB2MSB1c2VkIFJlY29yZDxzdHJpbmcsIHRydWU+OyB2MiB1c2VzIHN0cmluZ1tdLiBOb3JtYWxpemUgYm90aC5cbiAgICBpZiAob3V0LnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShvdXQuc3RhdGVzKSAmJiB0eXBlb2Ygb3V0LnN0YXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG91dC5zdGF0ZXMgPSBPYmplY3Qua2V5cyhvdXQuc3RhdGVzKS5maWx0ZXIoKGspID0+IEJvb2xlYW4oKG91dC5zdGF0ZXMgYXMgYW55KVtrXSkpO1xuICAgIH1cbiAgICAvLyBhdHRycy5mb3JtYXQg4oaSIGhpbnRzLmZvcm1hdC4gQ2xvbmUgYXR0cnMgZmlyc3Qgc28gd2UgZG9uJ3QgbXV0YXRlIHRoZVxuICAgIC8vIGNhbGxlcidzIG5lc3RlZCBvYmplY3QuIFNhbWUgZm9yIGhpbnRzICh3ZSBtYXkgbWVyZ2UgaW50byBpdCkuXG4gICAgaWYgKG91dC5hdHRycyAmJiB0eXBlb2Ygb3V0LmF0dHJzID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3V0LmF0dHJzLmZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGZtdCA9IG91dC5hdHRycy5mb3JtYXQ7XG4gICAgICBjb25zdCB7Zm9ybWF0OiBfZHJvcCwgLi4ucmVzdEF0dHJzfSA9IG91dC5hdHRycztcbiAgICAgIG91dC5hdHRycyA9IHJlc3RBdHRycztcbiAgICAgIG91dC5oaW50cyA9IHsuLi4ob3V0LmhpbnRzID8/IHt9KSwgZm9ybWF0OiBmbXR9O1xuICAgIH1cbiAgICBpZiAoIW91dC51aWQpIG91dC51aWQgPSBtc2dJZCgpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG91dC5ncm91cCkpIG91dC5ncm91cCA9IG91dC5ncm91cC5tYXAoZGVub3JtYWxpemVFbnRyeSk7XG4gICAgcmV0dXJuIG91dCBhcyBFbnRyeTtcbiAgfTtcbiAgLy8gV2FsayBhbGwgbG9hZGVkIG1lc3NhZ2VzIGFuZCBtaWdyYXRlIGFueSBsZWdhY3kgZW50cmllcy4gUmV0dXJucyB0cnVlIGlmXG4gIC8vIGFueXRoaW5nIG11dGF0ZWQgc28gdGhlIGNhbGxlciBjYW4gcGVyc2lzdC5cbiAgY29uc3QgbWlncmF0ZUxvYWRlZE1lc3NhZ2VzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGxldCBtdXRhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IG0uZW50cnk7XG4gICAgICAvLyBDaGVhcCBwcmUtY2hlY2s6IGlmIHVpZCBleGlzdHMgQU5EIHN0YXRlcyBpcyBhbiBhcnJheSBBTkQgbm8gX2F1ZGl0XG4gICAgICAvLyBBTkQgbm8gYXR0cnMuZm9ybWF0IOKGkiBub3RoaW5nIHRvIGRvLCBza2lwIHRoZSB3b3JrLlxuICAgICAgY29uc3QgbmVlZHNXb3JrID1cbiAgICAgICAgIWJlZm9yZS51aWQgfHxcbiAgICAgICAgKGJlZm9yZS5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkoYmVmb3JlLnN0YXRlcykpIHx8XG4gICAgICAgIChiZWZvcmUgYXMgYW55KS5fYXVkaXQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAoYmVmb3JlLmF0dHJzICYmIHR5cGVvZiAoYmVmb3JlLmF0dHJzIGFzIGFueSkuZm9ybWF0ID09PSAnc3RyaW5nJyk7XG4gICAgICBpZiAoIW5lZWRzV29yaykgY29udGludWU7XG4gICAgICBtLmVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShiZWZvcmUpO1xuICAgICAgbXV0YXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtdXRhdGVkO1xuICB9O1xuICBjb25zdCBvbkltcG9ydCA9ICgpOiB2b2lkID0+IGltcG9ydEZpbGUuY2xpY2soKTtcbiAgaW1wb3J0RmlsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM/LlswXTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICBjb25zdCBpbXBvcnRlZDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgdGV4dC5zcGxpdCgvXFxyP1xcbi8pKSB7XG4gICAgICBpZiAoIWxpbmUudHJpbSgpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKGxpbmUpO1xuICAgICAgICBpZiAoby50eXBlID09PSAnbWFuaWZlc3QnKSB7XG4gICAgICAgICAgLy8gTWFuaWZlc3QgbGluZSDigJQgaW5mb3JtYXRpb25hbCBvbmx5IG9uIGltcG9ydC4gU2tpcC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoby50eXBlID09PSAncGFnZScpIGltcG9ydGVkLnB1c2goe3R5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdXJsOiBvLnVybCwgdGl0bGU6IG8udGl0bGUsIHZpZXdwb3J0OiBvLnZpZXdwb3J0LCB0b2tlbnM6IG8udG9rZW5zLCB1c2VyQWdlbnQ6IG8udXNlckFnZW50LCBsYW5nOiBvLmxhbmd9KTtcbiAgICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0OiBvLnRleHQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoby5wYXJlbnRVaWQpIGZiLnBhcmVudFVpZCA9IG8ucGFyZW50VWlkO1xuICAgICAgICAgIGlmIChvLmRldGFjaGVkKSBmYi5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoby50YWdzKSAmJiBvLnRhZ3MubGVuZ3RoKSBmYi50YWdzID0gby50YWdzO1xuICAgICAgICAgIGlmIChvLnNldmVyaXR5KSBmYi5zZXZlcml0eSA9IG8uc2V2ZXJpdHk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaChmYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc2VsZWN0b3IgbGluZSDigJQgY291bGQgYmUgdjEgKGZsYXQpIG9yIHYyICh3aXRoIF9hdWRpdCkuIFRoZVxuICAgICAgICAgIC8vIGJ1bmRsZWQgZmVlZGJhY2sgYXJyYXkgbXVzdCBiZSBzcGxpdCBvdXQgaW50byBzZXBhcmF0ZSBmZWVkYmFja1xuICAgICAgICAgIC8vIG1lc3NhZ2VzIGZvciByb3VuZC10cmlwIHdpdGggdjEgcmVhZGVycyDigJQgYnV0IGluIHYyIHdlIGFscmVhZHlcbiAgICAgICAgICAvLyBlbWl0IHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZXMsIHNvIGRyb3BwaW5nIHRoZSBidW5kbGVkIGxpc3QgaXNcbiAgICAgICAgICAvLyBzYWZlIHRvIGF2b2lkIGRvdWJsZS1jb3VudGluZy5cbiAgICAgICAgICBjb25zdCBmYiA9IEFycmF5LmlzQXJyYXkoby5mZWVkYmFjaykgPyBvLmZlZWRiYWNrIDogbnVsbDtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGRlbm9ybWFsaXplRW50cnkobyk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnl9KTtcbiAgICAgICAgICAvLyBPbmx5IGluZmxhdGUgYnVuZGxlZCBmZWVkYmFjayBpZiB0aGUgZmlsZSBpcyB2MSAobm8gdmVyc2lvblxuICAgICAgICAgIC8vIG1hcmtlciBvbiB0aGUgc2VsZWN0b3IgbGluZXMpLiB2MiBoYXMgaXRzIG93biBzdGFuZGFsb25lXG4gICAgICAgICAgLy8gZmVlZGJhY2sgbGluZXMgdGhhdCBhcnJpdmUgc2VwYXJhdGVseS5cbiAgICAgICAgICBpZiAoZmIgJiYgby52ICE9PSAyKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZmIpIGltcG9ydGVkLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICB0ZXh0OiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgPyB0IDogdD8udGV4dCA/PyAnJyxcbiAgICAgICAgICAgICAgcGFyZW50VWlkOiBlbnRyeS51aWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggeyAvKiBza2lwIGJhZCBsaW5lICovIH1cbiAgICB9XG4gICAgbWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIC4uLmltcG9ydGVkXTtcbiAgICBwZXJzaXN0KCk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cyhgSW1wb3J0ZWQgJHtpbXBvcnRlZC5sZW5ndGh9IG1lc3NhZ2Uke2ltcG9ydGVkLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgIGltcG9ydEZpbGUudmFsdWUgPSAnJztcbiAgfSk7XG4gIC8vIOKUgOKUgOKUgCBXb3Jrc3BhY2Ugc25hcHNob3QgaGlzdG9yeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUGVyc2lzdGVudCAobm90IHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2spLiBBIENsZWFyLWFsbCBhcmNoaXZlcyB0aGVcbiAgLy8gY3VycmVudCB3b3Jrc3BhY2Ugc3RhdGUgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGZyb20gU2V0dGluZ3MgbGF0ZXIuXG4gIGxldCB3c1NuYXBzaG90czogV29ya3NwYWNlU25hcHNob3RbXSA9IFtdO1xuICBjb25zdCBsb2FkV3NTbmFwc2hvdHMgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVNuYXBzaG90W10+KHdzU25hcHNob3RzS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V3NTbmFwc2hvdHMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KHdzU25hcHNob3RzS2V5KGFjdGl2ZVdzKSwgd3NTbmFwc2hvdHMpOyB9O1xuICAvLyBBcmNoaXZlIHRoZSBDVVJSRU5UIHdvcmtzcGFjZSBzdGF0ZSAoYmVmb3JlIGl0J3Mgd2lwZWQpLiBOby1vcCBpZiBlbXB0eS5cbiAgY29uc3QgYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90ID0gKCk6IFdvcmtzcGFjZVNuYXBzaG90IHwgbnVsbCA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHNuYXA6IFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgICAgaWQ6IHNlY3VyZVRva2VuKDgpLFxuICAgICAgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIG1lc3NhZ2VzOiBzdHJ1Y3R1cmVkQ2xvbmUobWVzc2FnZXMpLFxuICAgICAgc2hvdHM6IE9iamVjdC5mcm9tRW50cmllcyhzaG90cyksXG4gICAgICBzZWxlY3RvcnM6IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5sZW5ndGgsXG4gICAgICBjb21tZW50czogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpLmxlbmd0aCxcbiAgICB9O1xuICAgIC8vIE5ld2VzdCBmaXJzdDsgY2FwIHRoZSBoaXN0b3J5LlxuICAgIHdzU25hcHNob3RzLnVuc2hpZnQoc25hcCk7XG4gICAgaWYgKHdzU25hcHNob3RzLmxlbmd0aCA+IFdTX1NOQVBTSE9UX0NBUCkgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5zbGljZSgwLCBXU19TTkFQU0hPVF9DQVApO1xuICAgIHBlcnNpc3RXc1NuYXBzaG90cygpO1xuICAgIHJldHVybiBzbmFwO1xuICB9O1xuICBjb25zdCByZXN0b3JlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHNuYXAgPSB3c1NuYXBzaG90cy5maW5kKChzKSA9PiBzLmlkID09PSBpZCk7XG4gICAgaWYgKCFzbmFwKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gUHVzaCB0aGUgbGl2ZSBzdGF0ZSBvbnRvIHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2sgc28gYSBtaXN0YWtlblxuICAgIC8vIHJlc3RvcmUgaXMgaXRzZWxmIHVuZG9hYmxlLlxuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBzdHJ1Y3R1cmVkQ2xvbmUoc25hcC5tZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzbmFwLnNob3RzKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgc2V0U3RhdHVzKGBSZXN0b3JlZCBzbmFwc2hvdCDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWxlY3RvcnNgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgZGVsZXRlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHdzU25hcHNob3RzID0gd3NTbmFwc2hvdHMuZmlsdGVyKChzKSA9PiBzLmlkICE9PSBpZCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICB9O1xuXG4gIGNvbnN0IG9uQ2xlYXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb25maXJtKCdDbGVhciBhbGwgY2FwdHVyZXM/IEEgc25hcHNob3Qgd2lsbCBiZSBzYXZlZCB0byBTZXR0aW5ncyDihpIgV29ya3NwYWNlcyBmaXJzdC4nKSkgcmV0dXJuO1xuICAgIC8vIEFyY2hpdmUgdGhlIHdvcmtzcGFjZSBCRUZPUkUgd2lwaW5nIHNvIGl0IGNhbiBiZSByZXN0b3JlZCBsYXRlci5cbiAgICBjb25zdCBzbmFwID0gYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90KCk7XG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IFtdO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICAvLyBOZXZlciBjbGFpbSBhIHNuYXBzaG90IHRoYXQgZGlkbid0IGhhcHBlbiAoZW1wdHkgd29ya3NwYWNlIG5vLW9wcykuXG4gICAgc2V0U3RhdHVzKHNuYXAgPyAnQ2xlYXJlZCDCtyBzbmFwc2hvdCBzYXZlZCDigJQgcmVzdG9yZSBpbiBTZXR0aW5ncyDihpIgV29ya3NwYWNlcycgOiAnQ2xlYXJlZCcpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBWYWxpZGF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBydW5WYWxpZGF0aW9uID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IFsuLi5uZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKSldO1xuICAgIGlmICghc2VsZWN0b3JzLmxlbmd0aCB8fCAhaW5FeHRlbnNpb24pIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgIGlmICghdGFic1swXSkgcmV0dXJuO1xuICAgICAgbGl2ZVRhYlVybCA9IHRhYnNbMF0udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgICBsaXZlVGFiUGF0aCA9IHBhdGhPZihsaXZlVGFiVXJsID8/ICcnKTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCEsIHBnKHtraW5kOiAndmFsaWRhdGUnLCBzZWxlY3RvcnN9KSkgYXMge3ZhbGlkPzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj59O1xuICAgICAgaWYgKHJlcGx5Py52YWxpZCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtzZWwsIG9rXSBvZiBPYmplY3QuZW50cmllcyhyZXBseS52YWxpZCkpIHtcbiAgICAgICAgICBzZWxlY3RvclZhbGlkaXR5LnNldChzZWwsIG9rKTtcbiAgICAgICAgICBpZiAoIW9rKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCAnTm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMgdGhpcyBzZWxlY3Rvci4nKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogdGFiIG5vdCByZWFkeSAqLyB9XG4gIH07XG4gIGNvbnN0IG9uVmFsaWRhdGUgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgc2V0U3RhdHVzKCdSZS1jaGVja2luZ+KApicsIHtraW5kOiAnaW5mbyd9KTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgc2V0U3RhdHVzKCdWYWxpZGF0ZWQnKTtcbiAgfTtcblxuICAvLyAoU2NyZWVuc2hvdCBtYWNoaW5lcnkgcmVtb3ZlZCBhbG9uZ3NpZGUgdGhlIC5wcmV2aWV3IHRpbGUuKVxuXG4gIC8vIOKUgOKUgOKUgCBHaXRIdWIgc3RhcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGZldGNoU3RhcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSAncGluY2hncmFiLmdoLnN0YXJzJztcbiAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBTdG9yZS5nZXQ8e2NvdW50OiBudW1iZXI7IHRzOiBudW1iZXJ9IHwgbnVsbD4oY2FjaGVLZXksIG51bGwpO1xuICAgIGlmIChjYWNoZWQgJiYgRGF0ZS5ub3coKSAtIGNhY2hlZC50cyA8IDNfNjAwXzAwMCkge1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjYWNoZWQuY291bnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3dyYW5uZ2xlL3BpbmNoZ3JhYicsIHtjYWNoZTogJ25vLXN0b3JlJ30pO1xuICAgICAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ3N0YXR1cyAnICsgci5zdGF0dXMpO1xuICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpIGFzIHtzdGFyZ2F6ZXJzX2NvdW50PzogbnVtYmVyfTtcbiAgICAgIGNvbnN0IGNvdW50ID0gai5zdGFyZ2F6ZXJzX2NvdW50ID8/IDA7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50KTtcbiAgICAgIHZvaWQgU3RvcmUuc2V0KGNhY2hlS2V5LCB7Y291bnQsIHRzOiBEYXRlLm5vdygpfSk7XG4gICAgfSBjYXRjaCB7IHN0YXJzRWwudGV4dENvbnRlbnQgPSAnwrcnOyB9XG4gIH07XG4gIGNvbnN0IG9uR2l0aHViID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vd3Jhbm5nbGUvcGluY2hncmFiJztcbiAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsfSk7XG4gICAgZWxzZSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgfTtcblxuICAvLyBSZS1pbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gdGhlIGFjdGl2ZSB0YWIg4oCUIHRoZSByZWNvdmVyeSBwYXRoXG4gIC8vIGZvciBcIkFsdCtDbGljayBzdG9wcGVkIHdvcmtpbmdcIiAoYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gc2NyaXB0KS4gUmVmcmVzaGluZyBhbiBhdHRhY2hlZCB0YWIgcmUtaW5qZWN0cyBhdXRvbWF0aWNhbGx5OyB0aGlzXG4gIC8vIGNvdmVycyBldmVyeSBvdGhlciBjYXNlIHdpdGhvdXQgaHVudGluZyBmb3IgdGhlIHRvb2xiYXIgaWNvbi5cbiAgY29uc3Qgb25SZWF0dGFjaCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7IHNldFN0YXR1cygnUmUtYXR0YWNoIG9ubHkgd29ya3MgaW5zaWRlIHRoZSBleHRlbnNpb24nLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8e29rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAncGctcmVpbmplY3QnfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKCdSZS1hdHRhY2hlZCDigJQgQWx0K0NsaWNrIGlzIGxpdmUnKTtcbiAgICBlbHNlIHNldFN0YXR1cyhgQ291bGRuJ3QgcmUtYXR0YWNoIOKAlCBjbGljayB0aGUgUGluY2hHcmFiIHRvb2xiYXIgYnV0dG9uIG9uIHRoZSBwYWdlJHtyZXBseT8uZXJyb3IgPyBgIMK3ICR7cmVwbHkuZXJyb3J9YCA6ICcnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUXVpZXQtc2F2ZXMgbnVkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHF1aWV0U2F2ZXMgZGVmYXVsdHMgT04gYXMgaW50ZW50LCBidXQgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aVxuICAvLyBwZXJtaXNzaW9uIENocm9tZSBkZW1hbmRzIGNhbiBvbmx5IGJlIHJlcXVlc3RlZCBpbnNpZGUgYSB1c2VyIGdlc3R1cmUuXG4gIC8vIFRoaXMgYmFubmVyIGlzIHRoYXQgZ2VzdHVyZTogc2hvd24gd2hpbGUgdGhlIHByZWYgaXMgb24sIHRoZSBwZXJtaXNzaW9uXG4gIC8vIGlzIG1pc3NpbmcsIGFuZCB0aGUgdXNlciBoYXNuJ3QgZGlzbWlzc2VkIGl0LlxuICBjb25zdCBxdWlldE51ZGdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXF1aWV0LW51ZGdlXScpO1xuICBjb25zdCBtYXliZVNob3dRdWlldE51ZGdlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcXVpZXROdWRnZSB8fCAhaW5FeHRlbnNpb24gfHwgIWNocm9tZS5wZXJtaXNzaW9ucz8uY29udGFpbnMpIHJldHVybjtcbiAgICBpZiAoIXByZWZzLnF1aWV0U2F2ZXMgfHwgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCkgeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IHJldHVybjsgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pO1xuICAgICAgcXVpZXROdWRnZS5oaWRkZW4gPSBncmFudGVkO1xuICAgIH0gY2F0Y2ggeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IH1cbiAgfTtcbiAgY29uc3Qgb25RdWlldEVuYWJsZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgZ3JhbnRlZCA9IGZhbHNlO1xuICAgIHRyeSB7IGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KTsgfVxuICAgIGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy51aSBwZXJtaXNzaW9uIHJlcXVlc3QgZmFpbGVkJywgZXJyKTsgfVxuICAgIHByZWZzLnF1aWV0U2F2ZXMgPSBncmFudGVkO1xuICAgIGlmICghZ3JhbnRlZCkgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7IC8vIGRlY2xpbmVkIG9uY2Ug4oCUIG5ldmVyIG5hZyBhZ2FpblxuICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgaWYgKHF1aWV0TnVkZ2UpIHF1aWV0TnVkZ2UuaGlkZGVuID0gdHJ1ZTtcbiAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1NhdmVzIHN0YXkgdmlzaWJsZSDigJQgcmUtZW5hYmxlIGluIFNldHRpbmdzIOKGkiBDYXB0dXJlJywgZ3JhbnRlZCA/IHt9IDoge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuICBjb25zdCBvblF1aWV0RGlzbWlzcyA9ICgpOiB2b2lkID0+IHtcbiAgICBwcmVmcy5xdWlldFNhdmVzID0gZmFsc2U7XG4gICAgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7XG4gICAgcGVyc2lzdFByZWZzKCk7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICBpZiAocXVpZXROdWRnZSkgcXVpZXROdWRnZS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBzbWFsbCBkb2N1bWVudCBzdW1tYXJpZXMuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBtYXJrZG93bk92ZXJ2aWV3ID0gKGNvbnRlbnQ6IHN0cmluZywga2luZDogTWRLaW5kLCB1c2luZ1RlbXBsYXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQudHJpbSgpID8gY29udGVudC5zcGxpdCgnXFxuJykubGVuZ3RoIDogMDtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFtjb250ZW50XSkuc2l6ZTtcbiAgICBjb25zdCBoZWFkaW5ncyA9IGNvbnRlbnRcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5tYXAoKGxpbmUpID0+IC9eI3sxLDN9XFxzKyguKykkLy5leGVjKGxpbmUudHJpbSgpKT8uWzFdPy50cmltKCkpXG4gICAgICAuZmlsdGVyKChoZWFkaW5nKTogaGVhZGluZyBpcyBzdHJpbmcgPT4gQm9vbGVhbihoZWFkaW5nKSlcbiAgICAgIC5zbGljZSgwLCA0KTtcbiAgICAvLyBXYXJtLCBwbGFpbi1sYW5ndWFnZSBmcmFtaW5nIG9mIHdoYXQgZWFjaCBmaWxlIHRlYWNoZXMgdGhlIGFnZW50LlxuICAgIC8vIERFU0lHTi5tZCBpcyB0aGUgaGVhZGxpbmUgYXJ0aWZhY3Q6IGl0J3Mgd2hlcmUgeW91IGRlc2NyaWJlIHlvdXIgb3duXG4gICAgLy8gYnJhbmQgYW5kIFVJIHRhc3RlIHNvIHRoZSBhZ2VudCBidWlsZHMgaW4gKnlvdXIqIHZvaWNlIHJhdGhlciB0aGFuIGFcbiAgICAvLyBnZW5lcmljIGRlZmF1bHQuIFNLSUxMLm1kIGlzIHRoZSBhZHZhbmNlZCB0cmlhZ2UgZ3VpZGUgZm9yIHJlYWRpbmdcbiAgICAvLyBleHBvcnRzIOKAlCB1c2VmdWwsIGJ1dCBub3Qgd2hlcmUgbW9zdCBwZW9wbGUgc2hvdWxkIHN0YXJ0LlxuICAgIGNvbnN0IGxhYmVsID0ga2luZCA9PT0gJ2Rlc2lnbidcbiAgICAgID8gJ1RlYWNoZXMgeW91ciBhZ2VudCB0byBidWlsZCBVSSBpbiB5b3VyIGJyYW5kJ1xuICAgICAgOiAnQWR2YW5jZWQ6IGhvdyB5b3VyIGFnZW50IHNob3VsZCByZWFkIFBpbmNoR3JhYiBleHBvcnRzJztcbiAgICBjb25zdCBzb3VyY2UgPSB1c2luZ1RlbXBsYXRlXG4gICAgICA/IChraW5kID09PSAnZGVzaWduJyA/ICdTdGFydGVyIHRlbXBsYXRlIOKAlCBtYWtlIGl0IHlvdXJzJyA6ICdCdW5kbGVkIHRlbXBsYXRlJylcbiAgICAgIDogJ0N1c3RvbWl6ZWQnO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gaGVhZGluZ3MubGVuZ3RoID8gaGVhZGluZ3Muam9pbignIC8gJykgOiAnTm8gc2VjdGlvbiBoZWFkaW5ncyBmb3VuZCc7XG4gICAgcmV0dXJuIGAke2xhYmVsfVxcbiR7c291cmNlfSDCtyAke2xpbmVzLnRvTG9jYWxlU3RyaW5nKCl9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JcXG5TZWN0aW9uczogJHtzZWN0aW9uc31gO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1kUHJldmlldyA9IGFzeW5jIChraW5kOiAnZGVzaWduJyB8ICdza2lsbCcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwcmV2aWV3RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtbWQtcHJldmlldz1cIiR7a2luZH1cIl1gKTtcbiAgICBpZiAoIXByZXZpZXdFbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBraW5kID09PSAnZGVzaWduJyA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGtpbmQgPT09ICdkZXNpZ24nID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHByZXZpZXdFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcoY29udGVudCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk1kTW9kYWwgPSBhc3luYyAoa2luZDogTWRLaW5kKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgICBjb25zdCB0aXRsZUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGl0bGVdJykhO1xuICAgIGNvbnN0IHRhRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRleHRhcmVhXScpITtcbiAgICBjb25zdCBzdGF0c0VsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3RhdHNdJykhO1xuICAgIGNvbnN0IGJhbm5lckVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtYmFubmVyXScpITtcbiAgICBjb25zdCBzdW1tYXJ5RWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdW1tYXJ5XScpITtcbiAgICBjb25zdCBzYXZlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc2F2ZV0nKSE7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1yZXNldF0nKSE7XG4gICAgY29uc3QgdXBsb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdXBsb2FkXScpITtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWRvd25sb2FkXScpITtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWNsb3NlXScpITtcblxuICAgIGNvbnN0IGlzRGVzaWduID0ga2luZCA9PT0gJ2Rlc2lnbic7XG4gICAgY29uc3QgaW5pdGlhbCA9IGlzRGVzaWduID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0gaXNEZXNpZ24gPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGlzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnUGluY2hHcmFiIFNLSUxMLm1kJztcbiAgICB0YUVsLnZhbHVlID0gaW5pdGlhbDtcbiAgICBvdmVybGF5LmRhdGFzZXQua2luZCA9IGtpbmQ7XG5cbiAgICBjb25zdCByZWZyZXNoU3RhdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICBzdGF0c0VsLnRleHRDb250ZW50ID0gYCR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgICAgc3VtbWFyeUVsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyh0ZXh0LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIGNvbnN0IGtleSA9IHQuZGF0YXNldC5wcmVmITtcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgLy8gUXVpZXQgc2F2ZXMgbmVlZHMgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aSBwZXJtaXNzaW9uOyByZXF1ZXN0IGl0XG4gICAgICAvLyBpbnNpZGUgdGhpcyB1c2VyIGdlc3R1cmUgYW5kIHJldmVydCB0aGUgY2hlY2tib3ggb24gZGVjbGluZS5cbiAgICAgIGlmIChrZXkgPT09ICdxdWlldFNhdmVzJyAmJiBjaGVja2VkICYmIGluRXh0ZW5zaW9uICYmIGNocm9tZS5wZXJtaXNzaW9ucz8ucmVxdWVzdCkge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGdyYW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0cnkgeyBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3Qoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7IH1cbiAgICAgICAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMudWkgcGVybWlzc2lvbiByZXF1ZXN0IGZhaWxlZCcsIGVycik7IH1cbiAgICAgICAgICBwcmVmcy5xdWlldFNhdmVzID0gZ3JhbnRlZDtcbiAgICAgICAgICAodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gZ3JhbnRlZDtcbiAgICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1Blcm1pc3Npb24gZGVjbGluZWQg4oCUIHNhdmVzIHN0YXkgdmlzaWJsZScsIGdyYW50ZWQgPyB7fSA6IHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IGNoZWNrZWQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodC5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9ICh0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgLy8gVGV4dGFyZWEgaW5wdXRzIGFsc28gZmlyZSBgaW5wdXRgIGV2ZW50cyBhcyB0aGUgdXNlciB0eXBlcyDigJQgd2Ugd2FudCB0b1xuICAvLyBzYXZlIHRob3NlIGluY3JlbWVudGFsbHkgc28gYSBwYW5lbCByZWxvYWQgZG9lc24ndCBsb3NlIGhhbGYtdHlwZWRcbiAgLy8gZW50cmllcy4gYGNoYW5nZWAgb25seSBmaXJlcyBvbiBibHVyIGZvciB0ZXh0YXJlYXMuXG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICh0Py5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9IHQudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBvcGVuRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gZmFsc2U7IHJlbmRlcldzQ29udHJvbHMoKTsgfTtcbiAgY29uc3QgY2xvc2VEcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSB0cnVlOyB9O1xuXG4gIC8vIFJldXNhYmxlIGNyZWF0ZS13b3Jrc3BhY2UgZmxvdzogdmFsaWRhdGVzIHVuaXF1ZW5lc3MsIHBlcnNpc3RzLCBzd2l0Y2hlcy5cbiAgLy8gU2hhcmVkIGJ5IHRoZSBzZXR0aW5ncyBDcmVhdGUgYnV0dG9uIGFuZCB0aGUgaGVhZGVyIGRyb3Bkb3duJ3NcbiAgLy8gXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gYm90aCBwYXRocyBiZWhhdmUgaWRlbnRpY2FsbHkuXG4gIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUZsb3cgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5hbWUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gdHJpbW1lZCkpIHtcbiAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZTogdHJpbW1lZCwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodHJpbW1lZCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHNldFN0YXR1cyhgQ3JlYXRlZCB3b3Jrc3BhY2UgXCIke3RyaW1tZWR9XCJgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICAvLyBJbmxpbmUgXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gdXNlcnMgY2FuIHNwaW4gdXAgYSB3b3Jrc3BhY2VcbiAgICAvLyBzdHJhaWdodCBmcm9tIHRoZSBoZWFkZXIgc3dpdGNoZXIgd2l0aG91dCBvcGVuaW5nIHNldHRpbmdzLiBIYW5kbGVkXG4gICAgLy8gYXMgYSBzZW50aW5lbCB2YWx1ZSBpbiB0aGUgY2hhbmdlIGxpc3RlbmVyIGJlbG93LlxuICAgIGNvbnN0IG5ld09wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdC52YWx1ZSA9ICdfX25ld193b3Jrc3BhY2VfXyc7XG4gICAgbmV3T3B0LnRleHRDb250ZW50ID0gJysgTmV3IHdvcmtzcGFjZSc7XG4gICAgd3NTZWxlY3QuYXBwZW5kKG5ld09wdCk7XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGZvY3VzV29ya3NwYWNlVGFiKHcubmFtZSk7XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBEZWxldGUgd29ya3NwYWNlICR7dy5uYW1lfWApO1xuICAgICAgICBkZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgaWYgKCFjb25maXJtKGBEZWxldGUgd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCIgYW5kIGFsbCBpdHMgY2FwdHVyZXM/YCkpIHJldHVybjtcbiAgICAgICAgICB3b3Jrc3BhY2VzID0gd29ya3NwYWNlcy5maWx0ZXIoKHgpID0+IHgubmFtZSAhPT0gdy5uYW1lKTtcbiAgICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFt3c01zZ0tleSh3Lm5hbWUpLCB3c1Nob3RzS2V5KHcubmFtZSksIHdzU2hvdHNGdWxsS2V5KHcubmFtZSksIHdzU25hcHNob3RzS2V5KHcubmFtZSldKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgICAgICBpZiAoYWN0aXZlV3MgPT09IHcubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3b3Jrc3BhY2VzWzBdIS5uYW1lKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpLmFwcGVuZChkZWwpO1xuICAgICAgfVxuICAgICAgd3NMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuICAgIHJlbmRlcldzU25hcHNob3RIaXN0b3J5KCk7XG4gIH07XG5cbiAgLy8gUmVuZGVyIHRoZSBhY3RpdmUgd29ya3NwYWNlJ3Mgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKSB3aXRoXG4gIC8vIGEgUmVzdG9yZSBhY3Rpb24uIEFwcGVuZGVkIHVuZGVyIHRoZSB3b3Jrc3BhY2UgbGlzdCBpbiBTZXR0aW5ncy5cbiAgY29uc3QgcmVuZGVyV3NTbmFwc2hvdEhpc3RvcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS13cy1zbmFwc2hvdHNdJyk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAoIXdzU25hcHNob3RzLmxlbmd0aCkge1xuICAgICAgaG9zdC5oaWRkZW4gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBob3N0LmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgU25hcHNob3QgaGlzdG9yeSDCtyAke3dzU25hcHNob3RzLmxlbmd0aH1gO1xuICAgIGhlYWQuZGF0YXNldC50aXAgPSAnUmVzdG9yYWJsZSBzbmFwc2hvdHMgc2F2ZWQgYmVmb3JlIGVhY2ggQ2xlYXItYWxsJztcbiAgICBob3N0LmFwcGVuZChoZWFkKTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdWwuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbGlzdCc7XG4gICAgZm9yIChjb25zdCBzbmFwIG9mIHdzU25hcHNob3RzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3Mtc25hcC1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBgJHtuZXcgRGF0ZShzbmFwLnRzKS50b0xvY2FsZVN0cmluZygpfSDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWwgwrcgJHtzbmFwLmNvbW1lbnRzfSBjbXRgO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgY29uc3QgcmVzdG9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcmVzdG9yZS50eXBlID0gJ2J1dHRvbic7XG4gICAgICByZXN0b3JlLmNsYXNzTmFtZSA9ICd3cy1zbmFwLXJlc3RvcmUnO1xuICAgICAgcmVzdG9yZS50ZXh0Q29udGVudCA9ICdSZXN0b3JlJztcbiAgICAgIHJlc3RvcmUuZGF0YXNldC50aXAgPSAnUmVzdG9yZSB0aGlzIHNuYXBzaG90IGludG8gdGhlIGN1cnJlbnQgd29ya3NwYWNlIChjdXJyZW50IHN0YXRlIGlzIGtlcHQgb24gdGhlIHVuZG8gc3RhY2spJztcbiAgICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoICYmICFjb25maXJtKCdSZXN0b3JlIHRoaXMgc25hcHNob3Q/IFRoZSBjdXJyZW50IGNhcHR1cmVzIHdpbGwgYmUgcmVwbGFjZWQgKHVuZG9hYmxlKS4nKSkgcmV0dXJuO1xuICAgICAgICByZXN0b3JlV29ya3NwYWNlU25hcHNob3Qoc25hcC5pZCk7XG4gICAgICB9KTtcbiAgICAgIGxpLmFwcGVuZChyZXN0b3JlKTtcbiAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyIHdzLXNuYXAtZGVsJztcbiAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyBzbmFwc2hvdCc7XG4gICAgICBkZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBzbmFwc2hvdCcpO1xuICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEyKTtcbiAgICAgIGRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGRlbGV0ZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgfVxuICAgIGhvc3QuYXBwZW5kKHVsKTtcbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ19fbmV3X3dvcmtzcGFjZV9fJykge1xuICAgICAgLy8gUmVzZXQgdGhlIHNlbGVjdCBiYWNrIHRvIHRoZSBhY3RpdmUgd29ya3NwYWNlIGZpcnN0IHNvIHRoZSBzZW50aW5lbFxuICAgICAgLy8gbmV2ZXIgc3RpY2tzIGFzIHRoZSBkaXNwbGF5ZWQgdmFsdWUgaWYgdGhlIHByb21wdCBpcyBjYW5jZWxsZWQuXG4gICAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgICBjb25zdCBuYW1lID0gKHdpbmRvdy5wcm9tcHQoJ05ldyB3b3Jrc3BhY2UgbmFtZScpID8/ICcnKS50cmltKCk7XG4gICAgICBpZiAobmFtZSkgYXdhaXQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh2YWx1ZSk7XG4gICAgZm9jdXNXb3Jrc3BhY2VUYWIodmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdTZW5kIHRvIEFnZW50IOKAlCBleHBvcnQgLnRhci56c3QgKyBjb3B5IHRoZSBhZ2VudCBwcm9tcHQnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdjb3B5LWFnZW50LXByb21wdCcsIGxhYmVsOiAnQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCAobGFzdCBleHBvcnQpJywgcnVuOiAoKSA9PiB7XG4gICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICghbGFzdEV4cG9ydC5hZ2VudFByb21wdCkgeyBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIFNlbmQgdG8gQWdlbnQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBvayA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICAgICAgc2V0U3RhdHVzKG9rID8gJ0FnZW50IHByb21wdCBjb3BpZWQnIDogJ0NsaXBib2FyZCB1bmF2YWlsYWJsZScsIG9rID8ge30gOiB7a2luZDogJ3dhcm4nfSk7XG4gICAgICB9KSgpO1xuICAgIH19LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3ZhbGlkYXRlJywgbGFiZWw6ICdSZS1jaGVjayBzZWxlY3RvcnMnLCBydW46ICgpID0+IHZvaWQgb25WYWxpZGF0ZSgpfSxcbiAgICB7aWQ6ICdyZWF0dGFjaCcsIGxhYmVsOiAnUmUtYXR0YWNoIHRvIHBhZ2UgKGZpeCBBbHQrQ2xpY2spJywgcnVuOiAoKSA9PiB2b2lkIG9uUmVhdHRhY2goKX0sXG4gICAge2lkOiAncmVsb2FkLWV4dGVuc2lvbicsIGxhYmVsOiAnUmVsb2FkIHRoZSBQaW5jaEdyYWIgZXh0ZW5zaW9uIChsYXN0IHJlc29ydCknLCBydW46ICgpID0+IHsgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUucnVudGltZS5yZWxvYWQoKTsgfX0sXG4gICAge2lkOiAnY2xlYXInLCBsYWJlbDogJ0NsZWFyIGFsbCBjYXB0dXJlcycsIHJ1bjogb25DbGVhcn0sXG4gICAge2lkOiAnc2V0dGluZ3MnLCBsYWJlbDogJ09wZW4gc2V0dGluZ3MnLCBydW46IG9wZW5EcmF3ZXJ9LFxuICAgIHtpZDogJ2dpdGh1YicsIGxhYmVsOiAnT3BlbiBHaXRIdWIgcmVwbycsIHJ1bjogb25HaXRodWJ9LFxuICAgIHtpZDogJ21hbnVhbCcsIGxhYmVsOiAnTWFudWFsIGNhcHR1cmUgKHN0YXJ0IGNvbXBvc2VyIHdpdGggYD4gc2VsZWN0b3JgKScsIHJ1bjogKCkgPT4geyBjb21wb3Nlci52YWx1ZSA9ICc+ICc7IGNvbXBvc2VyLmZvY3VzKCk7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgfX0sXG4gICAge2lkOiAndW5kbycsIGxhYmVsOiAnVW5kbycsIHJ1bjogdW5kb30sXG4gICAge2lkOiAncmVkbycsIGxhYmVsOiAnUmVkbycsIHJ1bjogcmVkb30sXG4gIF07XG4gIGNvbnN0IHJlbmRlclBhbGV0dGUgPSAocSA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgY29uc3QgcWwgPSBxLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAuLi5DT01NQU5EUy5maWx0ZXIoKGMpID0+ICFxbCB8fCBjLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKVxuICAgICAgICAubWFwKChjKSA9PiAoe2xhYmVsOiBjLmxhYmVsLCBwcmV2aWV3OiAnY29tbWFuZCcsIHJ1bjogYy5ydW59KSksXG4gICAgICAuLi5tZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKCFxbCB8fFxuICAgICAgICAobS5lbnRyeS5zZWxlY3RvciArICcgJyArIChtLmVudHJ5LnRleHQgPz8gJycpICsgJyAnICsgKG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyAnJykpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKSlcbiAgICAgICAgLnNsaWNlKDAsIDMwKVxuICAgICAgICAubWFwKChtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmIgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihtLmlkKTtcbiAgICAgICAgICBjb25zdCBwcmV2aWV3ID0gKG0uZW50cnkudGV4dCA/PyBmYlswXSA/PyBtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgODApO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYWJlbDogYCMke20uZW50cnkubn0gJHttLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3Rvcn1gLFxuICAgICAgICAgICAgcHJldmlldyxcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9zZVBhbGV0dGUoKTtcbiAgICAgICAgICAgICAgc2Nyb2xsTWVzc2FnZUludG9WaWV3KG0uaWQpO1xuICAgICAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3J9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdCwgaSkgPT4ge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGJsLmNsYXNzTmFtZSA9ICdsYWJlbCc7XG4gICAgICBsYmwuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQubGFiZWwsIHEpO1xuICAgICAgbGkuYXBwZW5kKGxibCk7XG4gICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcC5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICBwLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LnByZXZpZXcgPz8gJycsIHEpO1xuICAgICAgbGkuYXBwZW5kKHApO1xuICAgICAgY29uc3Qga2JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAga2JkLmNsYXNzTmFtZSA9ICdrYmQnO1xuICAgICAga2JkLnRleHRDb250ZW50ID0gJ+KGtSc7XG4gICAgICBsaS5hcHBlbmQoa2JkKTtcbiAgICAgIGlmIChpID09PSAwKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpdC5ydW4oKTsgfSk7XG4gICAgICBwYWxldHRlTGlzdC5hcHBlbmQobGkpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvcGVuUGFsZXR0ZSA9IChwcmVzZXQgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGUuaGlkZGVuID0gZmFsc2U7XG4gICAgcGFsZXR0ZUlucHV0LnZhbHVlID0gcHJlc2V0O1xuICAgIHJlbmRlclBhbGV0dGUocHJlc2V0KTtcbiAgICBwYWxldHRlSW5wdXQuZm9jdXMoKTtcbiAgICBwYWxldHRlSW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UocHJlc2V0Lmxlbmd0aCwgcHJlc2V0Lmxlbmd0aCk7XG4gIH07XG4gIGNvbnN0IGNsb3NlUGFsZXR0ZSA9ICgpOiB2b2lkID0+IHsgcGFsZXR0ZS5oaWRkZW4gPSB0cnVlOyB9O1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiByZW5kZXJQYWxldHRlKHBhbGV0dGVJbnB1dC52YWx1ZSkpO1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4ucGFsZXR0ZUxpc3QuY2hpbGRyZW5dO1xuICAgIGxldCBhY3RpdmUgPSBpdGVtcy5maW5kSW5kZXgoKGxpKSA9PiBsaS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKTtcbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWluKGl0ZW1zLmxlbmd0aCAtIDEsIGFjdGl2ZSArIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWF4KDAsIGFjdGl2ZSAtIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IChpdGVtc1thY3RpdmVdIGFzIEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkKT8uY2xpY2soKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIGNsb3NlUGFsZXR0ZSgpO1xuICB9KTtcbiAgcGFsZXR0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGlmIChlLnRhcmdldCA9PT0gcGFsZXR0ZSkgY2xvc2VQYWxldHRlKCk7IH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBDb250ZXh0IHN0cmlwIChob3ZlciBoZWxwKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIG9sZCBmbG9hdGluZyBjdXJzb3IgdG9vbHRpcDogW2RhdGEtdGlwXSBob3ZlciB0ZXh0IGlzXG4gIC8vIHdyaXR0ZW4gaW50byB0aGUgZml4ZWQgc3RyaXAgdW5kZXIgdGhlIGhlYWRlciwgc28gaGVscCBuZXZlciBvY2NsdWRlc1xuICAvLyBvdGhlciBjb250cm9scyBhbmQgY2FuJ3Qgc3RyYW5kIG1pZC1zY3JlZW4gdGhyb3VnaCByZS1yZW5kZXJzLlxuICBjb25zdCBUSVBfSURMRSA9ICdBbHQrQ2xpY2sgb24gdGhlIHBhZ2UgdG8gY2FwdHVyZSDCtyBob3ZlciBhbnkgY29udHJvbCBmb3IgaGVscCc7XG4gIGxldCB0aXBGb3I6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8vIFRoZSBzZXR0aW5ncyBkcmF3ZXIgb3ZlcmxheXMgdGhlIHN0cmlwIChwb3NpdGlvbjphYnNvbHV0ZSwgaW5zZXQgMCksIHNvXG4gIC8vIGhvdmVyIGhlbHAgZm9yIGRyYXdlciBjb250cm9scyBsYW5kcyBpbiBhIHNlY29uZCBzaW5rIGluc2lkZSB0aGVcbiAgLy8gZHJhd2VyIGhlYWRlci4gQm90aCBzaW5rcyBhbHdheXMgcmVjZWl2ZSB0aGUgc2FtZSB0ZXh0LlxuICBjb25zdCBkcmF3ZXJUaXBFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmF3ZXItdGlwXScpO1xuICBjb25zdCBzaG93VGlwID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXAnKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnO1xuICAgIGlmIChkcmF3ZXJUaXBFbCkgeyBkcmF3ZXJUaXBFbC50ZXh0Q29udGVudCA9IHRleHQ7IGRyYXdlclRpcEVsLmRhdGFzZXQuc2hvd24gPSAndHJ1ZSc7IH1cbiAgfTtcbiAgY29uc3QgaGlkZVRpcCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aXBGb3IgPSBudWxsO1xuICAgIHRvb2x0aXBFbC50ZXh0Q29udGVudCA9IFRJUF9JRExFO1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ2ZhbHNlJztcbiAgICBpZiAoZHJhd2VyVGlwRWwpIHsgZHJhd2VyVGlwRWwudGV4dENvbnRlbnQgPSAnJzsgZHJhd2VyVGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7IH1cbiAgfTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICghdCB8fCB0ID09PSB0aXBGb3IpIHJldHVybjtcbiAgICB0aXBGb3IgPSB0O1xuICAgIHNob3dUaXAodCk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCAmJiB0ID09PSB0aXBGb3IgJiYgIXQuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlVGlwKCk7XG4gIH0pO1xuICAvLyBSZS1yZW5kZXJzIGNhbiBkcm9wIHRoZSBob3ZlcmVkIG5vZGUgd2l0aG91dCBldmVyIGZpcmluZyBtb3VzZW91dFxuICAvLyAocmVuZGVyKCkgcmVzZXRzIGxpc3QuaW5uZXJIVE1MLCBjb25maXJtIGJ1dHRvbnMgcmVwbGFjZVdpdGgpOyByZXNldFxuICAvLyB0aGUgc3RyaXAgdG8gaXRzIGlkbGUgaGludCB3aGVuIHRoYXQgaGFwcGVucy5cbiAgY29uc3QgdGlwR3VhcmQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgaWYgKHRpcEZvciAmJiAhdGlwRm9yLmlzQ29ubmVjdGVkKSBoaWRlVGlwKCk7XG4gIH0pO1xuICB0aXBHdWFyZC5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWV9KTtcblxuICAvLyDilIDilIDilIAgU3RhdCBkcmlsbGRvd25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBlbmRIZWFkaW5nID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpO1xuICAgIGgudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGgpO1xuICB9O1xuICBjb25zdCBhcHBlbmRCb2xkID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJyk7XG4gICAgYi50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoYik7XG4gIH07XG4gIGNvbnN0IGFwcGVuZENvZGUgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgY29kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcbiAgICBjb2RlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChjb2RlKTtcbiAgfTtcbiAgY29uc3QgYnVpbGREcmlsbGRvd24gPSAoa2luZDogc3RyaW5nKTogRG9jdW1lbnRGcmFnbWVudCA9PiB7XG4gICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBpZiAoa2luZCA9PT0gJ3NlbGVjdG9ycycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1NlbGVjdG9ycyBieSBxdWFsaXR5Jyk7XG4gICAgICBjb25zdCBidWNrZXRzID0ge2lkOiAwLCB0ZXN0aWQ6IDAsIGNsYXNzOiAwLCBudGg6IDAsIHRhZzogMH07XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgICBpZiAoZS50ZXN0SWQpIGJ1Y2tldHMudGVzdGlkKys7XG4gICAgICAgIGVsc2UgaWYgKGUuaWQgfHwgL14jW1xcdy1dKyQvLnRlc3QoZS5zZWxlY3RvcikpIGJ1Y2tldHMuaWQrKztcbiAgICAgICAgZWxzZSBpZiAoKGUuc2VsZWN0b3IgPz8gJycpLmluY2x1ZGVzKCc6bnRoLW9mLXR5cGUnKSkgYnVja2V0cy5udGgrKztcbiAgICAgICAgZWxzZSBpZiAoL1xcLi8udGVzdChlLnNlbGVjdG9yID8/ICcnKSkgYnVja2V0cy5jbGFzcysrO1xuICAgICAgICBlbHNlIGJ1Y2tldHMudGFnKys7XG4gICAgICB9XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgbGFiZWxdIG9mIFtcbiAgICAgICAgW2J1Y2tldHMudGVzdGlkLCAnIGRhdGEtdGVzdGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmlkLCAnIHN0YWJsZSBpZCddLFxuICAgICAgICBbYnVja2V0cy5jbGFzcywgJyBjbGFzcy1iYXNlZCddLFxuICAgICAgICBbYnVja2V0cy5udGgsICcgbnRoLW9mLXR5cGUnXSxcbiAgICAgICAgW2J1Y2tldHMudGFnLCAnIHRhZy1vbmx5J10sXG4gICAgICBdIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgIGxpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnc3RhbGUnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTdGFsZSBjYXB0dXJlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc3RhbGUgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKTtcbiAgICAgIGlmICghc3RhbGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGkudGV4dENvbnRlbnQgPSAnTm9uZSAtIGV2ZXJ5dGhpbmcgcmVzb2x2ZXMuJztcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH0gZWxzZSBmb3IgKGNvbnN0IG0gb2Ygc3RhbGUpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBsaS5hcHBlbmQoJyAnKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgKG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDUwKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnY29tbWVudHMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdDb21tZW50cycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3QgZmJzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBGZWVkYmFja01lc3NhZ2UgPT4gbS50eXBlID09PSAnZmVlZGJhY2snKTtcbiAgICAgIGNvbnN0IHRvdGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHRvdGFsLmFwcGVuZCgnVG90YWwgd29yZHM6ICcpO1xuICAgICAgYXBwZW5kQm9sZCh0b3RhbCwgU3RyaW5nKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyB3b3JkQ291bnQobS50ZXh0KSwgMCkpKTtcbiAgICAgIHVsLmFwcGVuZCh0b3RhbCk7XG4gICAgICBjb25zdCBhdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgYXZnLmFwcGVuZCgnQXZlcmFnZSBsZW5ndGg6ICcpO1xuICAgICAgYXBwZW5kQm9sZChhdmcsIFN0cmluZyhmYnMubGVuZ3RoID8gTWF0aC5yb3VuZChmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgbS50ZXh0Lmxlbmd0aCwgMCkgLyBmYnMubGVuZ3RoKSA6IDApKTtcbiAgICAgIGF2Zy5hcHBlbmQoJyBjaGFycycpO1xuICAgICAgdWwuYXBwZW5kKGF2Zyk7XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAncGFnZXMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdQYWdlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNlZW4uc2V0KG0uZW50cnkudXJsLCAoc2Vlbi5nZXQobS5lbnRyeS51cmwpID8/IDApICsgMSk7XG4gICAgICBmb3IgKGNvbnN0IFt1cmwsIG5dIG9mIHNlZW4pIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcobikpO1xuICAgICAgICBsaS5hcHBlbmQoYCBzZWxlY3RvciR7biA9PT0gMSA/ICcnIDogJ3MnfSDCtyBgKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgcGF0aE9mKHVybCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZztcbiAgfTtcbiAgY29uc3Qgc2hvd0RyaWxsZG93biA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qga2luZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdCcpO1xuICAgIGlmICgha2luZCkgcmV0dXJuO1xuICAgIGRyaWxsZG93bkVsLnJlcGxhY2VDaGlsZHJlbihidWlsZERyaWxsZG93bihraW5kKSk7XG4gICAgZHJpbGxkb3duRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkUiA9IGRyaWxsZG93bkVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDY7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIGRSLndpZHRoIC8gMjtcbiAgICBpZiAodG9wICsgZFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSBkUi5oZWlnaHQgLSA2O1xuICAgIGlmIChsZWZ0IDwgNikgbGVmdCA9IDY7XG4gICAgaWYgKGxlZnQgKyBkUi53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNikgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZFIud2lkdGggLSA2O1xuICAgIGRyaWxsZG93bkVsLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7dG9wfXB4O2xlZnQ6JHtsZWZ0fXB4O2A7XG4gIH07XG4gIGNvbnN0IGhpZGVEcmlsbGRvd24gPSAoKTogdm9pZCA9PiB7IGRyaWxsZG93bkVsLmhpZGRlbiA9IHRydWU7IH07XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcuc3RhdFtkYXRhLXN0YXRdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0KSBzaG93RHJpbGxkb3duKHQpO1xuICB9KTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgaWYgKCFzdGF0c0VsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZURyaWxsZG93bigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0LWJ1dHRvbiBob3ZlciDihpIgb3V0bGluZS1tdWx0aSBvbiBwYWdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBmb3IgKGNvbnN0IGJ0biBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1leHBvcnQtaG92ZXJdJykpIHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpJywgc2VsZWN0b3JzfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QuYWRkKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgQ2xpY2sgZGVsZWdhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXIgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICBpZiAoIXRyaWdnZXIpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aW9uID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJyk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ3NlbmQnOiBzZW5kRmVlZGJhY2soKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1hbGwnOiB2b2lkIG9uQ29weUFsbCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQnOiB2b2lkIG9uRXhwb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydC16aXAnOiB2b2lkIG9uRXhwb3J0WmlwKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktcGF0aCc6IHZvaWQgb25Db3B5UGF0aCgpOyByZXR1cm47XG4gICAgICBjYXNlICdpbXBvcnQnOiBvbkltcG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHZvaWQgb25WYWxpZGF0ZSgpOyByZXR1cm47XG4gICAgICBjYXNlICdyZWF0dGFjaCc6IHZvaWQgb25SZWF0dGFjaCgpOyByZXR1cm47XG4gICAgICBjYXNlICdxdWlldC1lbmFibGUnOiB2b2lkIG9uUXVpZXRFbmFibGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncXVpZXQtZGlzbWlzcyc6IG9uUXVpZXREaXNtaXNzKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NsZWFyJzogb25DbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdnaXRodWInOiBvbkdpdGh1YigpOyByZXR1cm47XG4gICAgICBjYXNlICdzZXR0aW5ncyc6IG9wZW5EcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY2xvc2UtZHJhd2VyJzogY2xvc2VEcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndW5kbyc6IHVuZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVkbyc6IHJlZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZGVzaWduLWVkaXQnOiB7IHZvaWQgb3Blbk1kTW9kYWwoJ2Rlc2lnbicpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ3NraWxsLWVkaXQnOiAgeyB2b2lkIG9wZW5NZE1vZGFsKCdza2lsbCcpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi10ZW1wbGF0ZS1kb3dubG9hZCc6IHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIEFsd2F5cyB0aGUgUExBSU4gU1RPQ0sgdGVtcGxhdGUg4oCUIHRoZSBsb2NhbC4qIGRldi1vdmVycmlkZVxuICAgICAgICAgIC8vIHByZWZlcmVuY2UgY29udGFtaW5hdGVkIGRlZmF1bHRzIHdpdGggYSBkZXZlbG9wZXIncyBvd24gYnJhbmQuXG4gICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnREVTSUdOLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdERVNJR04ubWQgdGVtcGxhdGUgZG93bmxvYWRlZCDigJQgZmlsbCBpbiBhbmQgcmUtdXBsb2FkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuZGVzaWduTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbGwtbWQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJyk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgdGVtcGxhdGUgZG93bmxvYWRlZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuc2tpbGxNZCA9ICcnO1xuICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdTS0lMTC5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnd3MtY3JlYXRlJzoge1xuICAgICAgICBjb25zdCBuYW1lID0gKHdzTmFtZS52YWx1ZSA/PyAnJykudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcbiAgICAgICAgdm9pZCBjcmVhdGVXb3Jrc3BhY2VGbG93KG5hbWUpLnRoZW4oKG9rKSA9PiB7IGlmIChvaykgd3NOYW1lLnZhbHVlID0gJyc7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEdsb2JhbCBrZXlib2FyZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0ID0gKHRhcmdldDogRXZlbnRUYXJnZXQgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgZWwgPSB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/IHRhcmdldCA6IG51bGw7XG4gICAgcmV0dXJuIEJvb2xlYW4oZWw/LmNsb3Nlc3QoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBbY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXSwgW2NvbnRlbnRlZGl0YWJsZT1cIlwiXScpKTtcbiAgfTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBjb25zdCBlZGl0YWJsZVRhcmdldCA9IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldChlLnRhcmdldCk7XG4gICAgaWYgKGVkaXRhYmxlVGFyZ2V0ICYmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBbJ2EnLCAneicsICd5J10uaW5jbHVkZXMoZS5rZXkudG9Mb3dlckNhc2UoKSkpIHJldHVybjtcbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICdrJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHBhbGV0dGUuaGlkZGVuID8gb3BlblBhbGV0dGUoKSA6IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAvLyBDdHJsK0YgKGFuZCBDbWQrRikgb3BlbnMgdGhlIGluLWxpc3QgdmlzdWFsIGZpbmQg4oCUIGRpc3RpbmN0IGZyb20gdGhlXG4gICAgLy8gQ21kK0sgY29tbWFuZCBwYWxldHRlLiBPdmVycmlkZSB0aGUgYnJvd3NlcidzIG5hdGl2ZSBmaW5kIHNvIHRoZSBwYW5lbFxuICAgIC8vIG93bnMgdGhlIGdlc3R1cmUuXG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnZicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBvcGVuRmluZCgpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHVuZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiAoZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3knIHx8IChlLnNoaWZ0S2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JykpKSB7IGUucHJldmVudERlZmF1bHQoKTsgcmVkbygpOyByZXR1cm47IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBjb25zdCBtZE1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgICAgaWYgKG1kTW9kYWwgJiYgIW1kTW9kYWwuaGlkZGVuKSB7IGNsb3NlTWRNb2RhbCgpOyByZXR1cm47IH1cbiAgICAgIGlmICghcGFsZXR0ZS5oaWRkZW4pIHsgY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFkcmF3ZXIuaGlkZGVuKSB7IGNsb3NlRHJhd2VyKCk7IHJldHVybjsgfVxuICAgICAgaWYgKGZpbmRCYXIgJiYgIWZpbmRCYXIuaGlkZGVuKSB7IGNsb3NlRmluZCgpOyByZXR1cm47IH1cbiAgICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSB7IHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9KTsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyBzZXRTdGF0dXMoJ1BlbmRpbmcgZ3JvdXAgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSBjbG9zZUZpbmQoKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnQWx0JyB8fCBlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiB0cnVlfSk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgaWYgKCFlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBhbmVsUmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgcGVuZGluZ1BhbmVsTWVzc2FnZXM6IGFueVtdID0gW107XG4gIGNvbnN0IHJlY2VpdmVQYW5lbE1lc3NhZ2UgPSAobTogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYW5lbFJlYWR5KSB7XG4gICAgICBwZW5kaW5nUGFuZWxNZXNzYWdlcy5wdXNoKG0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbkNzTWVzc2FnZShtKTtcbiAgfTtcbiAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgLy8gU2luZ2xlIGNoYW5uZWw6IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS4gVGhlIGJhY2tncm91bmQgdXNlZCB0byByZWxheVxuICAgIC8vIHRocm91Z2ggYSBwb3J0IHRvbywgYnV0IGNvbnRlbnQtc2NyaXB0IGJyb2FkY2FzdHMgYWxyZWFkeSByZWFjaCB0aGVcbiAgICAvLyBzaWRlIHBhbmVsIGRpcmVjdGx5IOKAlCByZWxheWluZyBwcm9kdWNlZCBkdXBsaWNhdGUgZGlzcGF0Y2hlcy5cbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG06IGFueSkgPT4gcmVjZWl2ZVBhbmVsTWVzc2FnZShtKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uQWN0aXZhdGVkPy5hZGRMaXN0ZW5lcigoKSA9PiB2b2lkIHJ1blZhbGlkYXRpb24oKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uVXBkYXRlZD8uYWRkTGlzdGVuZXIoKF9pZCwgaW5mbykgPT4geyBpZiAoaW5mbz8uc3RhdHVzID09PSAnY29tcGxldGUnKSB2b2lkIHJ1blZhbGlkYXRpb24oKTsgfSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uUmVtb3ZlZD8uYWRkTGlzdGVuZXIoKGNsb3NlZElkKSA9PiB7XG4gICAgICBjb25zdCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy50YWJJZCA9PT0gY2xvc2VkSWQpO1xuICAgICAgaWYgKHdzKSB7IHdzLnRhYklkID0gdW5kZWZpbmVkOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZW5kZXJXc0NvbnRyb2xzKCk7IH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOnRvLXBhbmVsJywgKGUpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UoKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbCkpO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFRlc3QgQVBJIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpbnN0YWxsVGVzdEFwaSA9ICgpOiB2b2lkID0+IHtcbiAgICAod2luZG93IGFzIGFueSkuX19waW5jaGdyYWJfcGFuZWwgPSB7XG4gICAgICBwdXNoTWVzc2FnZTogKG06IFBhbmVsTWVzc2FnZSkgPT4geyBtZXNzYWdlcy5wdXNoKG0pOyBwZXJzaXN0KCk7IHJlbmRlcigpOyB9LFxuICAgICAgb25DYXB0dXJlLCBvbkhvdmVyLCBvbkhvdmVyRW5kLCBvblBhZ2VTbmFwc2hvdCxcbiAgICAgIGdldE1lc3NhZ2VzOiAoKSA9PiBbLi4ubWVzc2FnZXNdLFxuICAgICAgZ2V0UHJlZnM6ICgpID0+ICh7Li4ucHJlZnN9KSxcbiAgICAgIHNldFByZWZzOiAocDogUGFydGlhbDxQcmVmcz4pID0+IHsgcHJlZnMgPSB7Li4ucHJlZnMsIC4uLnB9OyBwZXJzaXN0UHJlZnMoKTsgYXBwbHlQcmVmc1RvVUkoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBidWlsZEpzb25sLFxuICAgICAgYnVpbGRFeHBvcnRGaWxlbmFtZSwgYnVpbGRNYW5pZmVzdCwgZG9taW5hbnRIb3N0U2x1ZywgZGlzdGluY3RIb3N0cyxcbiAgICAgIGR1Y2tEYlNuaXBwZXQsIG9uRXhwb3J0WmlwLCBvbkV4cG9ydCwgb25Db3B5UGF0aCxcbiAgICAgIGRlbm9ybWFsaXplRW50cnksXG4gICAgICBnZXRMYXN0RXhwb3J0OiAoKSA9PiAoey4uLmxhc3RFeHBvcnR9KSxcbiAgICAgIGdldExhc3RBZ2VudFByb21wdDogKCkgPT4gbGFzdEV4cG9ydC5hZ2VudFByb21wdCxcbiAgICAgIC8vIFRlc3QgaGF0Y2g6IHNlZWQgZXZlcnkgc2VsZWN0b3IgY2FwdHVyZSB3aXRoIHRoZSBzYW1lIGZ1bGwgUE5HIGRhdGFVUkxcbiAgICAgIC8vIHNvIHRoZSBhcmNoaXZlIGV4cG9ydCBoYXMgc29tZXRoaW5nIHRvIGJ1bmRsZS4gUmVhbCBjYXB0dXJlcyBwb3B1bGF0ZVxuICAgICAgLy8gc2hvdHNGdWxsIGZyb20gdGhlIGJnIGBydW5TaG90YCByZXBseTsgdGVzdHMgY2FuJ3QgZWFzaWx5IHJ1biBhXG4gICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiwgc28gdGhpcyBsZXRzIHVzIHByb3ZlIHRoZSBQTkcgYnVuZGxpbmcgcGF0aC5cbiAgICAgIF9fc2VlZFNob3RzRnVsbDogKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzaG90c0Z1bGwuc2V0KG0uZW50cnkuc2VsZWN0b3IsIGRhdGFVcmwpO1xuICAgICAgICB9XG4gICAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICAgIH0sXG4gICAgICBfX2dldFNob3RzRnVsbDogKCkgPT4gc2hvdHNGdWxsLFxuICAgICAgLy8gRnJlZXplIHRoZSBleHBvcnQgY2xvY2sgKElTTyBzdHJpbmcpIHNvIHRlc3RzIGNhbiBhc3NlcnQgdHdvXG4gICAgICAvLyBleHBvcnRzIG9mIGlkZW50aWNhbCBjb250ZW50IGFyZSBieXRlLWlkZW50aWNhbC4gUGFzcyBudWxsIHRvXG4gICAgICAvLyByZXN0b3JlIHdhbGwtY2xvY2sgYmVoYXZpb3IuXG4gICAgICBfX3NldEV4cG9ydENsb2NrOiAoaXNvOiBzdHJpbmcgfCBudWxsKSA9PiB7IGV4cG9ydENsb2NrT3ZlcnJpZGUgPSBpc287IH0sXG4gICAgICAvLyBzZXRTZWFyY2ggZHJpdmVzIHRoZSBDdHJsK0YgdmlzdWFsLWZpbmQgcGF0aCAodGhlIGhlYWRlciBzZWFyY2ggbm93XG4gICAgICAvLyBvcGVucyB0aGUgY29tbWFuZCBwYWxldHRlIGluc3RlYWQgb2YgZmlsdGVyaW5nKS5cbiAgICAgIHNldFNlYXJjaDogKHE6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAocSkgeyBvcGVuRmluZCgpOyBpZiAoZmluZElucHV0KSBmaW5kSW5wdXQudmFsdWUgPSBxOyBhcHBseUZpbmQocSk7IH1cbiAgICAgICAgZWxzZSBjbG9zZUZpbmQoKTtcbiAgICAgIH0sXG4gICAgICBvcGVuRmluZCwgY2xvc2VGaW5kLFxuICAgICAgaXNGaW5kT3BlbjogKCkgPT4gQm9vbGVhbihmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbiksXG4gICAgICBzZXRWYWxpZGl0eTogKHNlbDogc3RyaW5nLCBvazogYm9vbGVhbiB8ICdkaWZmLXBhZ2UnLCByZWFzb24/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChyZWFzb24pIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsIHJlYXNvbik7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyOiAoKSA9PiB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgICAgICBsaXZlVGFiUGF0aCA9IG51bGw7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgICAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgICAgIHNob3RzLmNsZWFyKCk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb3BlblBhbGV0dGUsIGNsb3NlUGFsZXR0ZSwgb3BlbkRyYXdlciwgY2xvc2VEcmF3ZXIsXG4gICAgICBzZW5kRmVlZGJhY2ssIHVuZG8sIHJlZG8sXG4gICAgICBsaXN0V29ya3NwYWNlczogKCkgPT4gWy4uLndvcmtzcGFjZXNdLFxuICAgICAgYWN0aXZlV29ya3NwYWNlOiAoKSA9PiBhY3RpdmVXcyxcbiAgICAgIHNldFN0aWNreVRUTDogKG1zOiBudW1iZXIpID0+IHsgU1RJQ0tZX1RUTF9NUyA9IG1zOyB9LFxuICAgICAgZm9yY2VTdGlja3lFeHBpcmU6ICgpID0+IHsgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTsgcGFuZWxIb3ZlcmVkID0gZmFsc2U7IGFybVN0aWNreUV4cGlyeSgpOyB9LFxuICAgICAgc2V0TGFzdEFjdGl2ZSxcbiAgICAgIGNyZWF0ZVdvcmtzcGFjZTogKG46IHN0cmluZykgPT4geyB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IG4sIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IHJldHVybiBsb2FkV29ya3NwYWNlKG4pLnRoZW4ocmVuZGVyKTsgfSxcbiAgICAgIHN3aXRjaFdvcmtzcGFjZTogKG46IHN0cmluZykgPT4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlciksXG4gICAgICBjbGVhckFsbDogb25DbGVhcixcbiAgICAgIGxpc3RTbmFwc2hvdHM6ICgpID0+IHdzU25hcHNob3RzLm1hcCgocykgPT4gKHtpZDogcy5pZCwgdHM6IHMudHMsIHNlbGVjdG9yczogcy5zZWxlY3RvcnMsIGNvbW1lbnRzOiBzLmNvbW1lbnRzfSkpLFxuICAgICAgcmVzdG9yZVNuYXBzaG90OiAoaWQ6IHN0cmluZykgPT4gcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90KGlkKSxcbiAgICB9O1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBQYW5lbCBzZWxmLWhlYWwg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEFmdGVyIGEgZGV2IGV4dGVuc2lvbiByZWxvYWQgKG9yIGFuIGF1dG8tdXBkYXRlKSwgdGhlIHNpZGUgcGFuZWwga2VlcHNcbiAgLy8gcnVubmluZyBpdHMgT0xEIGNvZGUgd2l0aCBhbiBJTlZBTElEQVRFRCBjaHJvbWUucnVudGltZTogY2hyb21lLnJ1bnRpbWUuaWRcbiAgLy8gZ29lcyB1bmRlZmluZWQgYW5kIGV2ZXJ5IGNocm9tZS4qIGNhbGwgdGhyb3dzIFwiRXh0ZW5zaW9uIGNvbnRleHRcbiAgLy8gaW52YWxpZGF0ZWRcIi4gQSBkZWFkIHBhbmVsIGNhbid0IHJlYWNoIHRoZSBiYWNrZ3JvdW5kLCBzbyBOTyBidXR0b24gaW4gaXRcbiAgLy8gd29ya3Mg4oCUIHdoaWNoIGlzIGV4YWN0bHkgd2h5IHRoZSBvbmx5IHJlY292ZXJ5IHVzZWQgdG8gYmUgXCJjbG9zZSB0aGUgcGFuZVxuICAvLyBhbmQgcmVjbGljayB0aGUgdG9vbGJhclwiLiBUaGlzIGhlYXJ0YmVhdCBkZXRlY3RzIHRoYXQgZGVhdGggYW5kIHJlbG9hZHNcbiAgLy8gdGhlIHBhbmVsIHBhZ2UsIHdoaWNoIHJlLWZldGNoZXMgdGhlIGZyZXNoIGNvZGUgYW5kIHJlY29ubmVjdHMuIEFcbiAgLy8gc2Vzc2lvblN0b3JhZ2UgY291bnRlciAoc3Vydml2ZXMgdGhlIHJlbG9hZCkgcHJldmVudHMgYSBsb29wIHdoZW4gdGhlXG4gIC8vIGV4dGVuc2lvbiBpcyBnZW51aW5lbHkgZ29uZSByYXRoZXIgdGhhbiByZWxvYWRlZC5cbiAgY29uc3Qgd2F0Y2hDb250ZXh0SGVhbHRoID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHJldHVybjtcbiAgICBjb25zdCBSRUxPQURfS0VZID0gJ3BnLmN0eFJlbG9hZHMnO1xuICAgIC8vIE9uY2Ugd2UndmUgYmVlbiBzdGFibHkgYWxpdmUgZm9yIGEgd2hpbGUsIGNsZWFyIHRoZSBsb29wIGd1YXJkLlxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0cnkgeyBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFJFTE9BRF9LRVkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfSwgMTUwMDApO1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGxldCBhbGl2ZSA9IGZhbHNlO1xuICAgICAgdHJ5IHsgYWxpdmUgPSBCb29sZWFuKGNocm9tZS5ydW50aW1lPy5pZCk7IH0gY2F0Y2ggeyBhbGl2ZSA9IGZhbHNlOyB9XG4gICAgICBpZiAoYWxpdmUpIHJldHVybjtcbiAgICAgIGxldCBuID0gMDtcbiAgICAgIHRyeSB7IG4gPSBOdW1iZXIoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShSRUxPQURfS0VZKSA/PyAnMCcpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIGlmIChuID49IDMpIHtcbiAgICAgICAgLy8gQXV0by1yZWNvdmVyeSBleGhhdXN0ZWQgKGV4dGVuc2lvbiBsaWtlbHkgdW5pbnN0YWxsZWQsIG5vdCByZWxvYWRlZCkuXG4gICAgICAgIGlmIChzdGF0dXMpIHN0YXR1cy50ZXh0Q29udGVudCA9ICdQaW5jaEdyYWIgd2FzIHJlbG9hZGVkIOKAlCBjbG9zZSB0aGlzIHBhbmVsIGFuZCByZW9wZW4gaXQgZnJvbSB0aGUgdG9vbGJhci4nO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTE9BRF9LRVksIFN0cmluZyhuICsgMSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIGlmIChzdGF0dXMpIHN0YXR1cy50ZXh0Q29udGVudCA9ICdQaW5jaEdyYWIgcmVsb2FkZWQg4oCUIHJlY29ubmVjdGluZ+KApic7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdHJ5IHsgbG9jYXRpb24ucmVsb2FkKCk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfSB9LCA2MDApO1xuICAgIH0sIDIwMDApO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCb290IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9hZEFsbCgpO1xuICAgIHBhbmVsUmVhZHkgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgbSBvZiBwZW5kaW5nUGFuZWxNZXNzYWdlcy5zcGxpY2UoMCkpIG9uQ3NNZXNzYWdlKG0pO1xuICAgIHJlbmRlcigpO1xuICAgIGluc3RhbGxUZXN0QXBpKCk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gICAgdm9pZCBtYXliZVNob3dRdWlldE51ZGdlKCk7XG4gICAgdm9pZCBmZXRjaFN0YXJzKCk7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gICAgd2F0Y2hDb250ZXh0SGVhbHRoKCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAncmVhZHknLCB7aW5FeHRlbnNpb24sIHdzOiBhY3RpdmVXcywgbWVzc2FnZXM6IG1lc3NhZ2VzLmxlbmd0aH0pO1xuICB9KSgpO1xufSkoKTtcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7O0VBeW5CQSxJQUFJLGNBQWM7QUFBQSxFQUNsQixJQUFNLFNBQVMsTUFBYztBQUFBLElBQzNCLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsYUFBYSxTQUFTLEVBQUU7QUFBQSxJQUN4RSxJQUFJO0FBQUEsTUFDRixNQUFNLFFBQVEsSUFBSSxXQUFXLENBQUM7QUFBQSxNQUM5QixXQUFXLE9BQU8sZ0JBQWdCLEtBQUs7QUFBQSxNQUN2QyxPQUFPLEdBQUcsVUFBVSxNQUFNLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcs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VztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFD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
