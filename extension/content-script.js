(() => {
  // src/dom.ts
  var mutationBufferGetter = null;
  var setMutationBufferGetter = (fn) => {
    mutationBufferGetter = fn;
  };
  var MAX_TEXT = 140;
  var MAX_SNIPPET = 2600;
  var MAX_ATTR = 140;
  var MAX_RULES = 12;
  var canEscape = typeof CSS !== "undefined" && typeof CSS.escape === "function";
  var escapeCss = (v) => canEscape ? CSS.escape(v) : String(v).replace(/([\\ #;?%&,.+*~':"!^$[\]()=>|/@])/g, "\\$1");
  var trimText = (v, max = MAX_TEXT) => String(v ?? "").replaceAll(/\s+/g, " ").trim().slice(0, max);
  var safeCall = (fn, fallback) => {
    try {
      return fn();
    } catch {
      return fallback;
    }
  };
  var attr = (el, name) => trimText(el.getAttribute(name), 120);
  var compactTarget = (el) => {
    let out = el.tagName.toLowerCase();
    if (el.id)
      out += "#" + el.id;
    if (el.classList?.length) {
      out += "." + Array.from(el.classList).slice(0, 4).join(".");
    }
    return trimText(out, 180);
  };
  var DYNAMIC_ID_RE = /^(radix-|headlessui-|mui-|aria-|ember|react-aria|:r[0-9a-z]+:)/i;
  var isStableId = (id) => Boolean(id) && !DYNAMIC_ID_RE.test(id) && !/[:\s]/.test(id) && !/^\d/.test(id);
  var UTILITY_CLASS_RE = /^(flex|grid|block|inline|hidden|relative|absolute|fixed|sticky|w-|h-|p-|m-|px-|py-|pt-|pb-|pl-|pr-|mx-|my-|mt-|mb-|ml-|mr-|gap-|space-|text-|font-|leading-|tracking-|bg-|border|rounded|shadow|opacity|cursor-|select-|pointer-|overflow|whitespace|truncate|items-|justify-|content-|self-|place-|z-|top-|left-|right-|bottom-|min-|max-|aspect-|object-|inset-|order-|col-|row-|gap|hover:|focus:|active:|disabled:|sm:|md:|lg:|xl:|2xl:|dark:|first|last|odd|even|group|peer|transition|duration-|delay-|ease-|animate-|transform|scale-|rotate-|translate-|skew-|origin-|ring-|divide-|outline-|fill-|stroke-|from-|to-|via-|placeholder-|caret-|accent-|appearance-|backdrop-|clip-|contain-|decoration-|underline|line-|list-|tabular|nums|prose|not-|motion-|isolate|isolation|will-|antialiased|subpixel-|sr-only|float-|clear-|resize-|scroll-|snap-|touch-|invisible|visible|css-|sc-[a-z0-9]|emotion-|chakra-|jss\d+|makeStyles-|MuiBox-|_next-|MuiButtonBase-|ρd__|__wab_|wab_|plsmc-)/i;
  var stableClasses = (el, max = 2) => {
    if (!el.classList)
      return [];
    const all = Array.from(el.classList);
    const stable = all.filter((c) => !UTILITY_CLASS_RE.test(c));
    if (stable.length)
      return stable.slice(0, max);
    return all.slice(0, 1);
  };
  var isUnique = (scope, selector, target) => {
    try {
      const matches = scope.querySelectorAll(selector);
      return matches.length === 1 && matches[0] === target;
    } catch {
      return false;
    }
  };
  var ownDescriptor = (el) => {
    let s = el.nodeName.toLowerCase();
    const c = stableClasses(el);
    if (c.length)
      s += "." + c.map(escapeCss).join(".");
    return s;
  };
  var partsToSelector = (parts, anchor) => anchor ? `${anchor} ${parts.join(" > ")}` : parts.join(" > ");
  var optimizePath = (parts, anchor, target, scope) => {
    let best = parts;
    let i = 0;
    while (i < best.length - 1) {
      const candidate = [...best.slice(0, i), ...best.slice(i + 1)];
      if (candidate.length === 0) {
        i++;
        continue;
      }
      if (isUnique(scope, partsToSelector(candidate, anchor), target)) {
        best = candidate;
        i = 0;
      } else {
        i++;
      }
    }
    return best;
  };
  var cssPath = (el) => {
    if (isStableId(el.id))
      return "#" + escapeCss(el.id);
    const rootNode = el.getRootNode();
    const cssScope = rootNode instanceof ShadowRoot ? rootNode : document;
    const scopeBoundary = rootNode instanceof ShadowRoot ? rootNode : document.body;
    let anchorId = null;
    let anchorEl = null;
    let cur = el.parentElement;
    while (cur && cur !== scopeBoundary) {
      if (isStableId(cur.id)) {
        anchorId = "#" + escapeCss(cur.id);
        anchorEl = cur;
        break;
      }
      cur = cur.parentElement;
    }
    const own = ownDescriptor(el);
    if (isUnique(cssScope, own, el))
      return own;
    if (anchorId) {
      const c2 = `${anchorId} ${own}`;
      if (isUnique(anchorEl, own, el) || isUnique(cssScope, c2, el))
        return c2;
    }
    const ariaQuoted = (val) => '"' + val.replace(/[\\"]/g, "\\$&") + '"';
    const ariaSelector = (e) => {
      const label = e.getAttribute("aria-label");
      if (label && label.length > 0 && label.length < 80) {
        return `[aria-label=${ariaQuoted(label)}]`;
      }
      return null;
    };
    const ownAria = ariaSelector(el);
    if (ownAria && isUnique(cssScope, ownAria, el))
      return ownAria;
    let ariaCur = el.parentElement;
    let depth = 0;
    while (ariaCur && depth < 4 && ariaCur !== scopeBoundary && ariaCur !== anchorEl) {
      const a = ariaSelector(ariaCur);
      if (a) {
        const candidate = `${a} ${own}`;
        if (isUnique(cssScope, candidate, el))
          return candidate;
      }
      ariaCur = ariaCur.parentElement;
      depth++;
    }
    const roleNameSelector = (e) => {
      const role = e.getAttribute("role");
      const label = e.getAttribute("aria-label");
      if (role && label && label.length < 80) {
        return `[role=${ariaQuoted(role)}][aria-label=${ariaQuoted(label)}]`;
      }
      return null;
    };
    let rnCur = el.parentElement;
    depth = 0;
    while (rnCur && depth < 4 && rnCur !== scopeBoundary && rnCur !== anchorEl) {
      const a = roleNameSelector(rnCur);
      if (a) {
        const candidate = `${a} ${own}`;
        if (isUnique(cssScope, candidate, el))
          return candidate;
      }
      rnCur = rnCur.parentElement;
      depth++;
    }
    let ucCur = el.parentElement;
    depth = 0;
    while (ucCur && depth < 6 && ucCur !== scopeBoundary && ucCur !== anchorEl) {
      const cls = stableClasses(ucCur);
      if (cls.length) {
        const ancDescriptor = `${ucCur.nodeName.toLowerCase()}.${cls.map(escapeCss).join(".")}`;
        const justCls = "." + cls.map(escapeCss).join(".");
        if (isUnique(cssScope, justCls, ucCur)) {
          const candidate = `${justCls} ${own}`;
          if (isUnique(cssScope, candidate, el))
            return candidate;
        }
        if (isUnique(cssScope, ancDescriptor, ucCur)) {
          const candidate = `${ancDescriptor} ${own}`;
          if (isUnique(cssScope, candidate, el))
            return candidate;
        }
      }
      ucCur = ucCur.parentElement;
      depth++;
    }
    const parts = [];
    cur = el;
    while (cur && cur.nodeType === Node.ELEMENT_NODE && cur !== scopeBoundary) {
      if (cur !== el && isStableId(cur.id))
        break;
      let s = cur.nodeName.toLowerCase();
      const cls = stableClasses(cur);
      if (cls.length)
        s += "." + cls.map(escapeCss).join(".");
      const parent = cur.parentElement;
      if (parent) {
        const sameTag = Array.from(parent.children).filter((sib) => sib.nodeName === cur.nodeName);
        if (sameTag.length > 1)
          s += `:nth-of-type(${sameTag.indexOf(cur) + 1})`;
      }
      parts.unshift(s);
      cur = cur.parentElement;
    }
    if (!parts.length)
      return el.tagName.toLowerCase();
    const optimized = optimizePath(parts, anchorId, el, cssScope);
    return partsToSelector(optimized, anchorId);
  };
  var CONTAINER_ROLES = new Set([
    "group",
    "region",
    "list",
    "listbox",
    "grid",
    "gridcell",
    "rowgroup",
    "row",
    "table",
    "main",
    "navigation",
    "banner",
    "contentinfo",
    "complementary",
    "tabpanel",
    "article",
    "section",
    "document",
    "feed",
    "figure",
    "form"
  ]);
  var collectIdRefText = (refs, scope) => {
    const parts = [];
    for (const id of refs.split(/\s+/).filter(Boolean)) {
      try {
        const node = scope.getElementById(id);
        if (node)
          parts.push(trimText(node.textContent, 180));
      } catch {}
    }
    return parts.filter(Boolean).join(" ");
  };
  var accessibleName = (el, role) => {
    const labelledby = attr(el, "aria-labelledby");
    if (labelledby) {
      const root = el.getRootNode();
      const scope = root instanceof ShadowRoot ? root : document;
      const text = collectIdRefText(labelledby, scope);
      if (text)
        return trimText(text, 180);
    }
    const ariaLabel = attr(el, "aria-label");
    if (ariaLabel)
      return trimText(ariaLabel, 180);
    const tag = el.tagName.toLowerCase();
    const isFormControl = tag === "input" || tag === "select" || tag === "textarea" || tag === "button" || tag === "meter" || tag === "progress" || tag === "output";
    if (isFormControl) {
      if (el.id) {
        const root = el.getRootNode();
        const scope = root instanceof ShadowRoot ? root : document;
        let labelFor = null;
        try {
          labelFor = scope.querySelector(`label[for="${escapeCss(el.id)}"]`);
        } catch {}
        if (labelFor) {
          const text = trimText(labelFor.textContent, 180);
          if (text)
            return text;
        }
      }
      let labelParent = el.parentElement;
      while (labelParent) {
        if (labelParent.tagName === "LABEL") {
          const text = trimText(labelParent.textContent, 180);
          if (text)
            return text;
          break;
        }
        labelParent = labelParent.parentElement;
      }
    }
    const titleAttr = attr(el, "title");
    if (titleAttr)
      return trimText(titleAttr, 180);
    const altAttr = attr(el, "alt");
    if (altAttr)
      return trimText(altAttr, 180);
    const placeholderAttr = attr(el, "placeholder");
    if (placeholderAttr)
      return trimText(placeholderAttr, 180);
    if (role && CONTAINER_ROLES.has(role))
      return "";
    if (!isNameFromContent(el, tag, role))
      return "";
    return trimText(el.textContent, 180);
  };
  var NAME_FROM_CONTENT_TAGS = new Set([
    "a",
    "button",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "summary",
    "th",
    "td",
    "caption",
    "figcaption",
    "legend",
    "label",
    "option",
    "output",
    "dt"
  ]);
  var NAME_FROM_CONTENT_ROLES = new Set([
    "button",
    "cell",
    "checkbox",
    "columnheader",
    "gridcell",
    "heading",
    "link",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "row",
    "rowheader",
    "switch",
    "tab",
    "tooltip",
    "treeitem"
  ]);
  var isNameFromContent = (el, tag, role) => {
    if (role && NAME_FROM_CONTENT_ROLES.has(role))
      return true;
    if (NAME_FROM_CONTENT_TAGS.has(tag))
      return true;
    const INLINE_PHRASING = new Set(["span", "em", "strong", "b", "i", "mark", "small", "code", "kbd", "samp", "var", "time", "cite", "q", "abbr", "sub", "sup"]);
    if (INLINE_PHRASING.has(tag) && !el.children.length)
      return true;
    return false;
  };
  var implicitRole = (el) => {
    if (el instanceof HTMLButtonElement)
      return "button";
    if (el instanceof HTMLInputElement)
      return "textbox";
    if (el instanceof HTMLTextAreaElement)
      return "textbox";
    if (el instanceof HTMLSelectElement)
      return "listbox";
    if (el instanceof HTMLAnchorElement && el.href)
      return "link";
    if (el instanceof HTMLLIElement)
      return "listitem";
    if (el instanceof HTMLUListElement || el instanceof HTMLOListElement)
      return "list";
    if (el instanceof HTMLTableElement)
      return "table";
    if (el instanceof HTMLTableCellElement)
      return "cell";
    if (el instanceof HTMLTableRowElement)
      return "row";
    if (el instanceof HTMLFormElement)
      return "form";
    if (el instanceof HTMLProgressElement)
      return "progressbar";
    if (el instanceof HTMLMeterElement)
      return "meter";
    return null;
  };
  var SEMANTIC_TAGS = new Set(["main", "section", "article", "nav", "header", "footer", "aside", "form", "table", "ul", "ol"]);
  var componentRoot = (el) => {
    let current = el.parentElement;
    let depth = 0;
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body && depth < 12) {
      const marker = current.id || current.getAttribute("data-component") || current.getAttribute("data-testid") || current.getAttribute("data-test") || current.getAttribute("data-cy") || current.getAttribute("data-qa") || current.getAttribute("role") || SEMANTIC_TAGS.has(current.nodeName.toLowerCase());
      if (marker)
        return { compact: compactTarget(current) };
      if (current.parentElement === null && current.parentNode instanceof ShadowRoot) {
        current = current.parentNode.host || null;
      } else {
        current = current.parentElement;
      }
      depth++;
    }
    return null;
  };
  var ancestorChain = (el, depth = 4) => {
    const out = [];
    let current = el.parentElement;
    let i = 0;
    while (current && current !== document.body && i < depth) {
      const item = { tag: current.tagName.toLowerCase() };
      if (isStableId(current.id))
        item.id = current.id;
      const role = attr(current, "role");
      if (role)
        item.role = role;
      const tid = attr(current, "data-testid") || attr(current, "data-test") || attr(current, "data-cy") || attr(current, "data-qa");
      if (tid)
        item.testId = tid;
      const cls = current.classList ? Array.from(current.classList).slice(0, 3) : [];
      if (cls.length)
        item.classes = cls;
      out.push(item);
      current = current.parentElement;
      i++;
    }
    return out;
  };
  var ATTR_ALLOWLIST = new Set([
    "href",
    "src",
    "alt",
    "title",
    "placeholder",
    "name",
    "type",
    "value",
    "target",
    "for",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "aria-controls",
    "aria-expanded",
    "aria-checked",
    "aria-selected",
    "aria-haspopup",
    "aria-live",
    "aria-hidden",
    "role"
  ]);
  var ATTR_PREFIX_ALLOW = ["aria-", "data-"];
  var ATTR_BLOCKLIST = new Set(["class", "style", "id"]);
  var INPUT_FORMAT_HINTS = {
    date: "YYYY-MM-DD",
    "datetime-local": "YYYY-MM-DDTHH:mm",
    month: "YYYY-MM",
    time: "HH:mm",
    week: "YYYY-Www",
    number: "numeric",
    range: "numeric",
    tel: "phone",
    email: "email",
    url: "url",
    color: "#rrggbb"
  };
  var ATTR_DEDUP_AGAINST_TOP_LEVEL = new Set([
    "data-testid",
    "data-test",
    "data-cy",
    "data-qa",
    "aria-label",
    "role",
    "title",
    "alt"
  ]);
  var JWT_RE = /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g;
  var SECRET_ATTR_NAME_RE = /(token|secret|password|api[_-]?key|auth(orization)?|csrf|xsrf|session)/i;
  var redactSecrets = (name, value) => {
    if (SECRET_ATTR_NAME_RE.test(name) && value.length > 8)
      return "[redacted: looks-like-secret]";
    return value.replace(JWT_RE, "[redacted: jwt]");
  };
  var populatedAttrs = (el) => {
    const attrs = {};
    if (!el.attributes)
      return { attrs, hints: undefined };
    let valueMasked = false;
    for (const a of Array.from(el.attributes)) {
      const name = a.name;
      if (!name || ATTR_BLOCKLIST.has(name))
        continue;
      if (ATTR_DEDUP_AGAINST_TOP_LEVEL.has(name))
        continue;
      const allowed = ATTR_ALLOWLIST.has(name) || ATTR_PREFIX_ALLOW.some((p) => name.startsWith(p));
      if (!allowed)
        continue;
      let v = trimText(a.value, MAX_ATTR);
      if (name === "value" && el instanceof HTMLInputElement && v) {
        const t = el.type;
        const ac = (el.getAttribute("autocomplete") || "").toLowerCase();
        const sensitive = t === "password" || t === "hidden" || /^(cc-(number|csc|exp(-month|-year)?|name)|one-time-code|new-password|current-password)$/.test(ac);
        if (sensitive) {
          v = "••••";
          valueMasked = true;
        }
      }
      if (v) {
        const redacted = redactSecrets(name, v);
        if (redacted !== v) {
          v = redacted;
          valueMasked = true;
        }
      }
      if (v)
        attrs[name] = v;
    }
    const hints = {};
    if (el instanceof HTMLInputElement) {
      const fmt = INPUT_FORMAT_HINTS[el.type];
      if (fmt)
        hints.format = fmt;
    }
    if (valueMasked)
      hints.valueMasked = true;
    return { attrs, hints: Object.keys(hints).length ? hints : undefined };
  };
  var NOISE_VALUES = new Set(["initial", "inherit", "unset", "revert", "revert-layer", "normal", "auto", "none", "static"]);
  var NOISE_FOR_KEY = {
    visibility: ["visible"],
    opacity: ["1"],
    overflow: ["visible"],
    overflowX: ["visible"],
    overflowY: ["visible"],
    display: ["inline", "block"],
    margin: ["0px"],
    padding: ["0px"],
    border: ["0px none rgb(0, 0, 0)", "0px none rgba(0, 0, 0, 0)"],
    borderRadius: ["0px"],
    backgroundColor: ["rgba(0, 0, 0, 0)", "transparent"],
    pointerEvents: ["auto"],
    top: ["0px"],
    right: ["0px"],
    bottom: ["0px"],
    left: ["0px"],
    flexDirection: ["row"],
    flexWrap: ["nowrap"],
    transition: ["all", "all 0s ease 0s"],
    alignItems: ["stretch"],
    justifyContent: ["flex-start", "normal"],
    textAlign: ["start"],
    textDecoration: ["none solid rgb(0, 0, 0)"]
  };
  var isMeaningful = (k, v) => {
    if (v == null || v === "")
      return false;
    if (NOISE_VALUES.has(v))
      return false;
    return !NOISE_FOR_KEY[k]?.includes(v);
  };
  var STYLE_KEYS = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "textAlign",
    "textTransform",
    "textDecoration",
    "color",
    "padding",
    "margin",
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "backgroundColor",
    "backgroundImage",
    "border",
    "borderRadius",
    "display",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "zIndex",
    "flexDirection",
    "alignItems",
    "justifyContent",
    "gap",
    "flexWrap",
    "gridTemplateColumns",
    "gridTemplateRows",
    "gridColumn",
    "gridRow",
    "boxShadow",
    "opacity",
    "overflow",
    "filter",
    "backdropFilter",
    "transform",
    "transition",
    "animation",
    "cursor",
    "visibility",
    "pointerEvents"
  ];
  var STYLE_LIMITS = {
    fontFamily: 256,
    backgroundImage: 1000,
    boxShadow: 1000,
    border: 256,
    filter: 512,
    backdropFilter: 512,
    transform: 512,
    transition: 512,
    animation: 512,
    gridTemplateColumns: 1000,
    gridTemplateRows: 1000
  };
  var PX_RE = /^-?\d+\.\d+px$/;
  var roundPx = (v) => {
    if (!PX_RE.test(v))
      return v;
    const n = parseFloat(v);
    return Number.isFinite(n) ? `${Math.round(n * 10) / 10}px` : v;
  };
  var VAR_DUAL_EMIT = new Set(["color", "backgroundColor", "borderColor"]);
  var essentialStyles = (el) => {
    const cs = window.getComputedStyle(el);
    const out = {};
    for (const k of STYLE_KEYS) {
      const v = cs[k];
      if (!isMeaningful(k, v))
        continue;
      out[k] = roundPx(trimText(v, STYLE_LIMITS[k] ?? 140));
    }
    if (el instanceof HTMLElement) {
      for (const k of VAR_DUAL_EMIT) {
        if (!out[k])
          continue;
        const dashKey = k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
        const inline = el.style?.getPropertyValue(dashKey)?.trim();
        if (inline && inline.includes("var(")) {
          out[`${k}Var`] = trimText(inline, 140);
        }
      }
    }
    return out;
  };
  var PSEUDO_KEYS = ["display", "position", "width", "height", "backgroundColor", "backgroundImage", "border", "borderRadius", "boxShadow", "transform", "opacity", "top", "right", "bottom", "left", "zIndex"];
  var pseudoStyles = (el) => {
    const out = {};
    for (const which of ["::before", "::after"]) {
      const cs = safeCall(() => window.getComputedStyle(el, which), null);
      if (!cs)
        continue;
      const content = cs.content;
      if (!content || content === "none" || content === "normal")
        continue;
      const block = { content: trimText(content, 256) };
      for (const k of PSEUDO_KEYS) {
        const v = cs[k];
        if (isMeaningful(k, v))
          block[k] = trimText(v, STYLE_LIMITS[k] ?? 140);
      }
      out[which.replace("::", "")] = block;
    }
    return out;
  };
  var STATES_KEEP_UNIVERSAL = ["hover", "focus", "focus-visible", "focus-within", "active", "target", "visited"];
  var STATES_KEEP_FORM = ["checked", "disabled", "required", "optional", "read-only", "read-write", "in-range", "out-of-range", "valid", "invalid"];
  var FORM_TAGS = new Set(["input", "select", "textarea", "option", "fieldset", "output", "progress", "meter"]);
  var pickTrueStates = (el) => {
    const out = [];
    for (const s of STATES_KEEP_UNIVERSAL) {
      try {
        if (el.matches(`:${s}`))
          out.push(s);
      } catch {}
    }
    if (FORM_TAGS.has(el.tagName.toLowerCase())) {
      for (const s of STATES_KEEP_FORM) {
        try {
          if (el.matches(`:${s}`))
            out.push(s);
        } catch {}
      }
    }
    return out;
  };
  var STYLE_INTERESTS = [
    "display",
    "position",
    "visibility",
    "overflow",
    "overflowX",
    "overflowY",
    "boxSizing",
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "margin",
    "padding",
    "borderWidth",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderRadius",
    "color",
    "backgroundColor",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "textAlign",
    "textDecoration",
    "opacity",
    "transform",
    "transition",
    "animation"
  ];
  var isFilterableSelector = (sel) => {
    const trimmed = sel.replace(/\s+/g, " ").trim();
    if (trimmed === "*")
      return true;
    if (trimmed === "*, ::before, ::after")
      return true;
    if (trimmed === "::before, ::after, *")
      return true;
    return false;
  };
  var collectMatchedRules = (el) => {
    const rules = [];
    const mediaStack = [];
    const pushRule = (rule) => {
      try {
        if (!el.matches(rule.selectorText))
          return true;
      } catch {
        return true;
      }
      if (isFilterableSelector(rule.selectorText))
        return true;
      const mediaJoined = mediaStack.join(" && ");
      if (/\bprint\b/.test(mediaJoined) && !/\bscreen\b/.test(mediaJoined))
        return true;
      const declared = {};
      for (const p of STYLE_INTERESTS) {
        const v = rule.style?.getPropertyValue(p);
        if (v)
          declared[p] = trimText(v, 140);
      }
      if (!Object.keys(declared).length)
        return true;
      const mediaActive = mediaStack.length === 0 ? true : (() => {
        try {
          for (const cond of mediaStack) {
            const rawCond = cond.replace(/^@media\s*/, "");
            if (!matchMedia(rawCond).matches)
              return false;
          }
          return true;
        } catch {
          return;
        }
      })();
      const ruleEntry = {
        selector: rule.selectorText,
        declarations: declared,
        ...mediaStack.length ? { media: mediaJoined } : {}
      };
      if (mediaStack.length)
        ruleEntry.mediaActive = mediaActive;
      rules.push(ruleEntry);
      return rules.length < MAX_RULES;
    };
    const walk = (sheet, list) => {
      for (let i = 0;i < list.length && rules.length < MAX_RULES; i++) {
        const rule = list[i];
        if (!rule || typeof rule.type !== "number")
          continue;
        if (rule.type === CSSRule.STYLE_RULE) {
          if (!pushRule(rule))
            break;
          continue;
        }
        if (rule.type === CSSRule.MEDIA_RULE || rule.type === CSSRule.SUPPORTS_RULE) {
          const cond = String(rule.conditionText || "").trim();
          if (cond)
            mediaStack.push(cond);
          if (rule.cssRules)
            walk(sheet, rule.cssRules);
          if (cond)
            mediaStack.pop();
          continue;
        }
        if (rule.type === CSSRule.IMPORT_RULE && rule.styleSheet) {
          try {
            const im = rule.styleSheet;
            if (im?.cssRules)
              walk(im, im.cssRules);
          } catch {}
        }
      }
    };
    for (const sheet of Array.from(document.styleSheets || [])) {
      const m = sheet.media?.mediaText;
      if (m)
        mediaStack.push(`@media ${m}`);
      let css;
      try {
        css = sheet.cssRules;
      } catch {
        if (m)
          mediaStack.pop();
        continue;
      }
      if (css)
        walk(sheet, css);
      if (m)
        mediaStack.pop();
    }
    return rules;
  };
  var HANDLER_KEYS = ["onClick", "onMouseDown", "onSubmit", "onChange", "onKeyDown", "onFocus", "onBlur", "onInput"];
  var INLINE_ON_ATTRS = ["onclick", "onmousedown", "onsubmit", "onchange", "onkeydown", "onfocus", "onblur", "oninput"];
  var reactEventNames = (el, out) => {
    const propsKey = Object.keys(el).find((k) => k.startsWith("__reactProps$"));
    if (!propsKey)
      return;
    const props = el[propsKey];
    if (!props)
      return;
    for (const k of HANDLER_KEYS) {
      if (out[k])
        continue;
      const fn = props[k];
      if (typeof fn === "function") {
        const n = fn.name && fn.name !== "" ? fn.name : "<anonymous>";
        out[k] = trimText(n, 80);
      }
    }
  };
  var vueEventNames = (el, out) => {
    const v = el.__vueParentComponent || el.__vue__;
    if (!v)
      return;
    const props = v.vnode?.props || v.$options?.propsData || v.$listeners;
    if (!props || typeof props !== "object")
      return;
    for (const k of HANDLER_KEYS) {
      if (out[k])
        continue;
      const fn = props[k] || props[k.toLowerCase()];
      if (typeof fn === "function") {
        const n = fn.name && fn.name !== "" ? fn.name : "<vue-anonymous>";
        out[k] = trimText(n, 80);
      }
    }
  };
  var inlineEventNames = (el, out) => {
    for (const attr2 of INLINE_ON_ATTRS) {
      const camel = "on" + attr2.charAt(2).toUpperCase() + attr2.slice(3);
      if (out[camel])
        continue;
      const v = el.getAttribute(attr2);
      if (v)
        out[camel] = trimText(v, 200);
    }
  };
  var collectEventNames = (el) => {
    const out = {};
    reactEventNames(el, out);
    vueEventNames(el, out);
    inlineEventNames(el, out);
    return Object.keys(out).length ? out : null;
  };
  var BEHAVIOR_ATTR_PREFIXES = ["hx-", "data-hx-", "data-controller", "data-action", "data-target", "x-data", "x-on:", "x-bind:", "x-model", "x-show", "x-if", "@click", "@submit", "data-turbo"];
  var collectBehaviorAttrs = (el) => {
    if (!el.attributes)
      return null;
    const out = {};
    for (const a of Array.from(el.attributes)) {
      const name = a.name;
      if (BEHAVIOR_ATTR_PREFIXES.some((p) => name === p || name.startsWith(p))) {
        out[name] = trimText(a.value, 200);
      }
    }
    return Object.keys(out).length ? out : null;
  };
  var shadowHostSelector = (el) => {
    const root = el.getRootNode();
    if (!(root instanceof ShadowRoot))
      return null;
    const host = root.host;
    if (!host)
      return null;
    try {
      return cssPath(host);
    } catch {
      return host.tagName.toLowerCase();
    }
  };
  var findEditorRoot = (el) => {
    let cur = el;
    while (cur) {
      if (cur instanceof HTMLElement && cur.isContentEditable) {
        let outer = cur;
        let probe = cur.parentElement;
        while (probe && probe instanceof HTMLElement && probe.isContentEditable) {
          outer = probe;
          probe = probe.parentElement;
        }
        return outer;
      }
      cur = cur.parentElement;
    }
    return null;
  };
  var detectEditorKind = (root) => {
    const r = root;
    if (root.classList?.contains("tiptap") || r.__tiptap)
      return "tiptap";
    if (root.hasAttribute("data-lexical-editor") || r.__lexicalEditor)
      return "lexical";
    if (root.hasAttribute("data-slate-editor") || r.__slateEditor)
      return "slate";
    if (root.classList?.contains("ql-editor") || root.closest(".ql-container"))
      return "quill";
    if (root.classList?.contains("ProseMirror") || r.__pmViewDesc || r.pmViewDesc)
      return "prosemirror";
    return "native";
  };
  var editorContext = (el) => {
    const root = findEditorRoot(el);
    if (!root)
      return null;
    let rootSelector;
    try {
      rootSelector = cssPath(root);
    } catch {
      rootSelector = root.tagName.toLowerCase();
    }
    const text = root.innerText ?? root.textContent ?? "";
    return {
      kind: detectEditorKind(root),
      rootSelector,
      contentLength: text.length
    };
  };
  var isLayoutInteresting = (cs) => {
    if (cs.position && cs.position !== "static")
      return true;
    if (cs.display && /(flex|grid|table|contents|inline-block)/.test(cs.display))
      return true;
    if (cs.overflow && cs.overflow !== "visible")
      return true;
    if (cs.transform && cs.transform !== "none")
      return true;
    return false;
  };
  var captureLayoutContext = (el, depth = 4) => {
    const out = [];
    let cur = el.parentElement;
    let i = 0;
    while (cur && cur !== document.body && i < depth) {
      try {
        const cs = window.getComputedStyle(cur);
        const interesting = isLayoutInteresting(cs);
        if (interesting) {
          const entry = { tag: cur.tagName.toLowerCase() };
          entry.display = cs.display;
          entry.position = cs.position;
          if (cs.overflow !== "visible")
            entry.overflow = cs.overflow;
          if (cs.zIndex && cs.zIndex !== "auto")
            entry.zIndex = cs.zIndex;
          if (cs.transform && cs.transform !== "none")
            entry.transform = trimText(cs.transform, 120);
          if (cs.willChange && cs.willChange !== "auto")
            entry.willChange = cs.willChange;
          if (cur.scrollWidth > cur.clientWidth || cur.scrollHeight > cur.clientHeight) {
            entry.isScrollContainer = true;
            entry.scrollLeft = cur.scrollLeft;
            entry.scrollTop = cur.scrollTop;
          }
          if (/flex/.test(cs.display)) {
            entry.flex = {
              direction: cs.flexDirection,
              wrap: cs.flexWrap,
              alignItems: cs.alignItems,
              justifyContent: cs.justifyContent,
              gap: cs.gap !== "normal" ? cs.gap : undefined
            };
          } else if (/grid/.test(cs.display)) {
            entry.grid = {
              templateColumns: trimText(cs.gridTemplateColumns, 200),
              templateRows: trimText(cs.gridTemplateRows, 200),
              gap: cs.gap !== "normal" ? cs.gap : undefined
            };
          }
          out.push(entry);
        }
      } catch {}
      cur = cur.parentElement;
      i++;
    }
    return out;
  };
  var parseRgb = (s) => {
    const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/.exec(s);
    if (m) {
      return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), m[4] ? parseFloat(m[4]) : 1];
    }
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
    if (hex) {
      let h = hex[1];
      if (h.length === 3)
        h = h.split("").map((c) => c + c).join("");
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    }
    return null;
  };
  var relativeLuminance = ([r, g, b]) => {
    const lin = (c) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  var contrastRatio = (fg, bg) => {
    const f = parseRgb(fg);
    const b = parseRgb(bg);
    if (!f || !b)
      return null;
    const lf = relativeLuminance(f);
    const lb = relativeLuminance(b);
    const [lo, hi] = lf > lb ? [lb, lf] : [lf, lb];
    return Math.round((hi + 0.05) / (lo + 0.05) * 100) / 100;
  };
  var resolveBackground = (el) => {
    let cur = el;
    while (cur) {
      const cs = window.getComputedStyle(cur);
      const bg = cs.backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent")
        return bg;
      cur = cur.parentElement;
    }
    return null;
  };
  var computeAccessibilityCheck = (el) => {
    const out = {};
    try {
      if (hasOwnTextNode(el)) {
        const cs = window.getComputedStyle(el);
        const fg = cs.color;
        const bg = resolveBackground(el);
        if (fg && bg) {
          const r = contrastRatio(fg, bg);
          if (r !== null) {
            out.contrastRatio = r;
            const fontSize = parseFloat(cs.fontSize);
            const isBold = parseInt(cs.fontWeight, 10) >= 700;
            const isLargeText = fontSize >= 18 || fontSize >= 14 && isBold;
            const aa = isLargeText ? 3 : 4.5;
            const aaa = isLargeText ? 4.5 : 7;
            out.contrastPasses = r >= aaa ? "AAA" : r >= aa ? "AA" : "fail";
          }
        }
      }
      const ti = el.tabIndex;
      const naturallyTabbable = /^(a|button|input|select|textarea|iframe|details|audio|video)$/i.test(el.tagName) && !el.hasAttribute("disabled") && (el.tagName !== "A" || Boolean(el.href));
      out.tabbable = ti >= 0 || naturallyTabbable;
    } catch {}
    return Object.keys(out).length ? out : null;
  };
  var hasActiveAnimation = (el) => {
    const fn = el.getAnimations;
    if (typeof fn !== "function")
      return false;
    try {
      const animations = fn.call(el);
      for (const a of animations) {
        if (a?.playState === "running")
          return true;
      }
    } catch {}
    return false;
  };
  var MINIFIED_NAME_RE = /^[A-Za-z$_][A-Za-z0-9$_]{0,2}$/;
  var BUNDLER_SCAFFOLD_NAMES = new Set([
    "Anonymous",
    "anonymous",
    "default",
    "_default",
    "_sfc_main",
    "sfc_main"
  ]);
  var isMeaningfulComponentName = (name) => {
    if (!name)
      return false;
    if (BUNDLER_SCAFFOLD_NAMES.has(name))
      return false;
    if (MINIFIED_NAME_RE.test(name))
      return false;
    return true;
  };
  var reactInfo = (el) => {
    const reactKey = Object.keys(el).find((k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"));
    if (!reactKey)
      return null;
    let node = el[reactKey];
    const seen = new Set;
    let result = null;
    while (node && typeof node === "object" && !seen.has(node)) {
      seen.add(node);
      const type = node.type || node.elementType;
      if (!result?.name && type && typeof type !== "string") {
        const display = typeof type.displayName === "string" ? type.displayName : null;
        const ctorName = typeof type.name === "string" ? type.name : null;
        const cand = isMeaningfulComponentName(display) ? display : isMeaningfulComponentName(ctorName) ? ctorName : null;
        if (cand) {
          result = { framework: "react", name: trimText(cand, 120) };
          if (display && display !== cand) {
            result.displayName = trimText(display, 180);
          }
        }
      }
      if (result && !result.source && node._debugSource) {
        result.source = {
          file: node._debugSource.fileName || node._debugSource.file || null,
          line: node._debugSource.lineNumber || node._debugSource.line || null
        };
      }
      if (node._debugOwner) {
        node = node._debugOwner;
        continue;
      }
      if (node.return) {
        node = node.return;
        continue;
      }
      break;
    }
    if (!result?.name)
      return null;
    const chain = [];
    const seenChain = new Set;
    let walker = el[reactKey];
    while (walker && typeof walker === "object" && !seenChain.has(walker) && chain.length < 8) {
      seenChain.add(walker);
      const t = walker.type || walker.elementType;
      if (t && typeof t !== "string") {
        const n = typeof t.displayName === "string" && isMeaningfulComponentName(t.displayName) ? t.displayName : typeof t.name === "string" && isMeaningfulComponentName(t.name) ? t.name : null;
        if (n && (chain.length === 0 || chain[chain.length - 1] !== n))
          chain.push(n);
      }
      walker = walker._debugOwner ?? walker.return;
    }
    if (chain.length > 0)
      result.chain = chain;
    return result;
  };
  var vueInfo = (el) => {
    const v = el?.__vueParentComponent || el?.__vue_app__?._instance || el?.__vnode?.component || el?.__vue__;
    const type = v?.type || v?.ctx?.type;
    const rawName = type?.name || type?.__name;
    if (!isMeaningfulComponentName(rawName))
      return null;
    const result = {
      framework: "vue",
      name: trimText(rawName, 160),
      source: { file: type?.__file || null }
    };
    const chain = [];
    let cur = v;
    const seen = new Set;
    while (cur && typeof cur === "object" && !seen.has(cur) && chain.length < 8) {
      seen.add(cur);
      const t = cur.type || cur.ctx?.type;
      const n = t?.name ?? t?.__name;
      if (typeof n === "string" && isMeaningfulComponentName(n)) {
        if (chain.length === 0 || chain[chain.length - 1] !== n)
          chain.push(n);
      }
      cur = cur.parent;
    }
    if (chain.length > 0)
      result.chain = chain;
    return result;
  };
  var litInfo = (el) => {
    if (!el.tagName.includes("-"))
      return null;
    const ctor = el.constructor;
    if (!ctor)
      return null;
    const isLit = Boolean(ctor._$litElement$ || ctor.elementProperties || ctor._$litElementVersion$ || ctor.styles && Array.isArray(ctor.styles));
    if (!isLit)
      return null;
    const tag = el.tagName.toLowerCase();
    const ctorName = typeof ctor.name === "string" ? ctor.name : null;
    const name = isMeaningfulComponentName(ctorName) ? ctorName : tag;
    return {
      framework: "lit",
      name: trimText(name, 120),
      displayName: tag
    };
  };
  var stencilInfo = (el) => {
    if (!el.tagName.includes("-"))
      return null;
    const ctor = el.constructor;
    if (!ctor)
      return null;
    const looksStencil = Boolean(typeof ctor.is === "string" && ctor.is.includes("-") || el.__hostCss !== undefined || el.__stencil_subscriberId !== undefined || el.hasAttribute("s-id"));
    if (!looksStencil)
      return null;
    const tag = el.tagName.toLowerCase();
    const isField = typeof ctor.is === "string" ? ctor.is : null;
    const ctorName = typeof ctor.name === "string" ? ctor.name : null;
    const name = isField || (isMeaningfulComponentName(ctorName) ? ctorName : tag);
    return {
      framework: "stencil",
      name: trimText(name, 120),
      displayName: tag
    };
  };
  var svelteInfo = (el) => {
    const meta = el.__svelte_meta;
    if (!meta?.loc)
      return null;
    const file = typeof meta.loc.file === "string" ? meta.loc.file : null;
    return {
      framework: "svelte",
      name: trimText(file ?? "svelte-component", 160),
      source: {
        file,
        line: typeof meta.loc.line === "number" ? meta.loc.line : null
      }
    };
  };
  var webComponentInfo = (el) => {
    const tag = el.tagName.toLowerCase();
    if (!tag.includes("-"))
      return null;
    try {
      if (typeof customElements !== "undefined" && customElements.get(tag)) {
        return {
          framework: "web-component",
          name: tag,
          displayName: tag
        };
      }
    } catch {}
    return null;
  };
  var frameworkInfo = (el) => reactInfo(el) || vueInfo(el) || litInfo(el) || stencilInfo(el) || svelteInfo(el) || webComponentInfo(el);
  var elideDataUris = (html) => html.replace(/data:([\w/+.-]+);base64,([A-Za-z0-9+/=]{60,})/g, (_m, mime, payload) => `data:${mime};base64,[${payload.length}-char base64 elided]`);
  var PRESERVED_SVG_ATTR_PREFIXES = ["data-", "aria-"];
  var PRESERVED_SVG_ATTRS = new Set(["role", "class", "width", "height", "viewBox", "title", "name", "fill"]);
  var elideInlineSvgs = (html) => html.replace(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g, (_m, attrs, body) => {
    const out = [];
    const attrRe = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
    let m;
    while ((m = attrRe.exec(attrs)) !== null) {
      const name = m[1];
      const v = m[2] ?? m[3] ?? m[4] ?? "";
      const keep = PRESERVED_SVG_ATTRS.has(name) || PRESERVED_SVG_ATTR_PREFIXES.some((p) => name.startsWith(p));
      if (keep)
        out.push(`${name}="${v.replace(/"/g, "&quot;")}"`);
    }
    const titleText = /<title[^>]*>([\s\S]*?)<\/title>/.exec(body)?.[1]?.trim();
    if (titleText)
      out.push(`data-pg-svg-title="${titleText.replace(/"/g, "&quot;")}"`);
    const descText = /<desc[^>]*>([\s\S]*?)<\/desc>/.exec(body)?.[1]?.trim();
    if (descText)
      out.push(`data-pg-svg-desc="${descText.replace(/"/g, "&quot;")}"`);
    out.push('data-pg-elided="svg"');
    return `<svg ${out.join(" ")}/>`;
  });
  var stripDangerousElements = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/\s*script(?:\s[^>]*)?>/gi, '<script data-pg-elided="script-content"/>').replace(/<style\b[^>]*>[\s\S]*?<\/\s*style\s*>/gi, '<style data-pg-elided="style-content"/>').replace(/<meta\b[^>]*\bcontent="[^"]*"[^>]*>/gi, (m) => {
    const nameMatch = /\bname="([^"]*)"/.exec(m);
    const name = nameMatch?.[1] ?? "";
    if (/(csrf|token|xsrf|nonce|api[_-]?key)/i.test(name)) {
      return m.replace(/\bcontent="[^"]*"/, 'content="[redacted: meta-token]"');
    }
    return m;
  });
  var serializeShadowContent = (host, depth, maxDepth, elided) => {
    const sr = host.shadowRoot;
    if (!sr)
      return null;
    const mode = sr.mode || "open";
    const parts = [];
    for (const child of Array.from(sr.children)) {
      parts.push(serializeWithShadow(child, depth + 1, maxDepth, elided));
    }
    return `<template shadowrootmode="${mode}">${parts.join("")}</template>`;
  };
  var serializeWithShadow = (el, depth, maxDepth, elided) => {
    const tag = el.tagName.toLowerCase();
    const attrs = [];
    if (el.attributes) {
      for (const a of Array.from(el.attributes)) {
        const v = String(a.value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
        attrs.push(`${a.name}="${v}"`);
      }
    }
    const open = `<${tag}${attrs.length ? " " + attrs.join(" ") : ""}>`;
    const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    if (VOID.has(tag))
      return open;
    const shadow = serializeShadowContent(el, depth, maxDepth, elided);
    let lightInner;
    if (depth >= maxDepth && el.children.length) {
      const count = el.children.length;
      elided.count += count;
      lightInner = `<!-- ${count} ${count === 1 ? "child" : "children"} elided -->`;
    } else {
      const segs = [];
      for (const node of Array.from(el.childNodes)) {
        if (node.nodeType === 1) {
          segs.push(serializeWithShadow(node, depth + 1, maxDepth, elided));
        } else if (node.nodeType === 3) {
          segs.push(String(node.nodeValue ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        } else if (node.nodeType === 8) {
          segs.push(`<!--${String(node.nodeValue ?? "")}-->`);
        }
      }
      lightInner = segs.join("");
    }
    return `${open}${shadow ?? ""}${lightInner}</${tag}>`;
  };
  var cappedOuterHTML = (el, maxDepth = 2) => {
    const hasAnyShadow = (() => {
      if (el.shadowRoot)
        return true;
      try {
        const desc = el.querySelectorAll("*");
        const N = Math.min(desc.length, 50);
        for (let i = 0;i < N; i++)
          if (desc[i].shadowRoot)
            return true;
      } catch {}
      return false;
    })();
    if (hasAnyShadow) {
      const elided2 = { count: 0 };
      try {
        const html = serializeWithShadow(el, 0, maxDepth, elided2);
        return { html, elided: elided2.count };
      } catch {}
    }
    let elided = 0;
    try {
      const clone = el.cloneNode(true);
      const walk = (node, depth) => {
        if (!node.children || !node.children.length)
          return;
        if (depth >= maxDepth) {
          const count = node.children.length;
          elided += count;
          node.innerHTML = `<!-- ${count} ${count === 1 ? "child" : "children"} elided -->`;
          return;
        }
        for (const child of Array.from(node.children))
          walk(child, depth + 1);
      };
      walk(clone, 0);
      return { html: clone.outerHTML, elided };
    } catch {
      return { html: el.outerHTML, elided: 0 };
    }
  };
  var trimHtmlWithSize = (html, max) => {
    if (!html)
      return { value: html };
    let cleaned = elideDataUris(html);
    cleaned = elideInlineSvgs(cleaned);
    cleaned = stripDangerousElements(cleaned);
    if (cleaned.length <= max)
      return { value: cleaned };
    const originalLen = html.length;
    const cut = cleaned.slice(0, max);
    const last = cut.lastIndexOf(">");
    const value = (last > max - 200 ? cut.slice(0, last + 1) : cut) + "…";
    return { value, truncated: originalLen };
  };
  var rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  var fallbackUidCounter = 0;
  var uuid = () => {
    try {
      if (crypto.randomUUID)
        return crypto.randomUUID();
    } catch {}
    try {
      const a = new Uint8Array(16);
      crypto.getRandomValues(a);
      a[6] = a[6] & 15 | 64;
      a[8] = a[8] & 63 | 128;
      const h = Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
      return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    } catch {
      return `uid_${Date.now().toString(36)}_${(++fallbackUidCounter).toString(36)}`;
    }
  };
  var hasOwnTextNode = (el) => {
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === 3) {
        const v = node.nodeValue ?? "";
        if (v.trim().length > 0)
          return true;
      }
    }
    return false;
  };
  var findCanvasAncestor = (el) => {
    let cur = el;
    while (cur) {
      if (cur instanceof HTMLCanvasElement)
        return cur;
      cur = cur.parentElement;
    }
    return null;
  };
  var captureEntry = (el, sequence, opts = {}) => {
    const tag = el.tagName.toLowerCase();
    const isLeafish = !el.children?.length || hasOwnTextNode(el);
    const text = isLeafish ? trimText(el.textContent, 250) : "";
    const role = attr(el, "role") || implicitRole(el);
    const renderedText = (() => {
      try {
        const cs = window.getComputedStyle(el);
        if (cs.textTransform && cs.textTransform !== "none") {
          const r = trimText(el.innerText, 250);
          return r && r !== text ? r : null;
        }
      } catch {}
      return null;
    })();
    const accName = accessibleName(el, role);
    const testId = attr(el, "data-testid") || attr(el, "data-test") || attr(el, "data-cy") || attr(el, "data-qa");
    const stableId = isStableId(el.id) ? el.id : null;
    const classes = el.classList ? Array.from(el.classList).slice(0, 32) : [];
    const { attrs, hints } = populatedAttrs(el);
    const compRoot = componentRoot(el);
    const fwk = frameworkInfo(el);
    const trueStates = pickTrueStates(el);
    const styles = essentialStyles(el);
    const pseudo = pseudoStyles(el);
    const rules = collectMatchedRules(el);
    const root = el.getRootNode();
    const inShadow = root instanceof ShadowRoot;
    const scope = inShadow ? root : document;
    let selector;
    if (testId) {
      const testIdSel = `[data-testid="${testId}"]`;
      if (isUnique(scope, testIdSel, el)) {
        selector = testIdSel;
      } else {
        const parent = el.parentElement;
        let scoped = "";
        if (parent) {
          const sameTagSibs = Array.from(parent.children).filter((c) => c.nodeName === el.nodeName);
          if (sameTagSibs.length > 1) {
            scoped = `${testIdSel}:nth-of-type(${sameTagSibs.indexOf(el) + 1})`;
            if (isUnique(scope, scoped, el)) {
              selector = scoped;
            } else {
              selector = cssPath(el);
            }
          } else {
            selector = cssPath(el);
          }
        } else {
          selector = cssPath(el);
        }
      }
    } else if (stableId) {
      const idSel = `#${escapeCss(stableId)}`;
      selector = isUnique(scope, idSel, el) ? idSel : cssPath(el);
    } else {
      selector = cssPath(el);
    }
    const cappedHtml = cappedOuterHTML(el, 2);
    const trimmed = trimHtmlWithSize(cappedHtml.html, MAX_SNIPPET);
    const out = {
      uid: uuid(),
      n: sequence,
      ts: new Date().toISOString(),
      url: location.href,
      tag,
      selector,
      outerHTML: trimmed.value,
      rect: rectOf(el),
      viewport: buildViewportSnapshot()
    };
    if (cappedHtml.elided > 0 || trimmed.truncated !== undefined) {
      out.truncated = {};
      if (cappedHtml.elided > 0)
        out.truncated.children = cappedHtml.elided;
      if (trimmed.truncated !== undefined)
        out.truncated.outerHTML = trimmed.truncated;
    }
    if (text)
      out.text = text;
    if (renderedText)
      out.renderedText = renderedText;
    if (role)
      out.role = role;
    if (accName && accName !== text)
      out.accessibleName = accName;
    if (stableId)
      out.id = stableId;
    if (testId)
      out.testId = testId;
    if (classes.length)
      out.classes = classes;
    if (Object.keys(attrs).length)
      out.attrs = attrs;
    if (hints)
      out.hints = hints;
    if (inShadow) {
      out.inShadowDOM = true;
      const sh = shadowHostSelector(el);
      if (sh)
        out.shadowHost = sh;
    }
    if (compRoot?.compact)
      out.componentRoot = compRoot.compact;
    const ancestors = ancestorChain(el);
    if (ancestors.length)
      out.ancestors = ancestors;
    if (fwk)
      out.component = fwk;
    const events = collectEventNames(el);
    if (events)
      out.events = events;
    const behaviorAttrs = collectBehaviorAttrs(el);
    if (behaviorAttrs)
      out.behaviorAttrs = behaviorAttrs;
    if (hasActiveAnimation(el))
      out.isAnimating = true;
    const assets = [];
    try {
      const imgList = el.querySelectorAll("img");
      for (let i = 0;i < imgList.length && assets.length < 8; i++) {
        const img = imgList[i];
        const src = img.currentSrc || img.src;
        if (!src || src.startsWith("data:"))
          continue;
        const r = img.getBoundingClientRect();
        assets.push({
          src: trimText(src, 200),
          naturalW: img.naturalWidth || undefined,
          naturalH: img.naturalHeight || undefined,
          renderedW: Math.round(r.width) || undefined,
          renderedH: Math.round(r.height) || undefined,
          alt: img.alt || undefined,
          loaded: img.complete && img.naturalWidth > 0
        });
      }
      const useList = el.querySelectorAll("use[href], use[xlink\\:href]");
      for (let i = 0;i < useList.length && assets.length < 12; i++) {
        const u = useList[i];
        const href = u.getAttribute("href") || u.getAttribute("xlink:href");
        if (href)
          assets.push({ src: trimText(href, 200) });
      }
      try {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== "none") {
          const urlM = /url\((['"]?)(.+?)\1\)/.exec(bg);
          if (urlM && !urlM[2].startsWith("data:")) {
            assets.push({ src: trimText(urlM[2], 200) });
          }
        }
      } catch {}
    } catch {}
    if (assets.length)
      out.assets = assets;
    const a11y = computeAccessibilityCheck(el);
    if (a11y)
      out.a11y = a11y;
    const layout = captureLayoutContext(el);
    if (layout.length)
      out.layoutContext = layout;
    if (mutationBufferGetter) {
      try {
        const recent = mutationBufferGetter();
        const TOOL_NOISE_RE = /^(html|body|#__pinchgrab_overlay)\b|cursor|user-select|webkit-user-select/i;
        const filtered = recent.filter((m) => {
          if (TOOL_NOISE_RE.test(m.target))
            return false;
          if (m.type === "attributes" && m.attributeName && /^(style|cursor)$/.test(m.attributeName)) {
            return !(m.target.startsWith("html") || m.target.startsWith("body"));
          }
          return true;
        });
        if (filtered.length)
          out.domMutations = filtered.slice(-3);
      } catch {}
    }
    const editor = editorContext(el);
    if (editor)
      out.editor = editor;
    if (opts.clickAt) {
      const canvas = findCanvasAncestor(el);
      if (canvas) {
        const r = canvas.getBoundingClientRect();
        out.canvasClick = {
          offsetX: Math.round(opts.clickAt.clientX - r.left),
          offsetY: Math.round(opts.clickAt.clientY - r.top),
          canvasW: Math.round(r.width),
          canvasH: Math.round(r.height),
          canvasSelector: (() => {
            try {
              return cssPath(canvas);
            } catch {
              return "canvas";
            }
          })()
        };
      }
    }
    if (trueStates.length)
      out.states = trueStates;
    if (Object.keys(styles).length)
      out.styles = styles;
    if (rules.length)
      out.matchedRules = rules;
    if (Object.keys(pseudo).length)
      out.pseudoElements = pseudo;
    try {
      out.selectorMatchCount = scope.querySelectorAll(selector).length;
    } catch {}
    return out;
  };
  var collectRootCssVars = () => {
    const cs = window.getComputedStyle(document.documentElement);
    const out = {};
    for (let i = 0;i < cs.length; i++) {
      const n = cs[i];
      if (n?.startsWith("--")) {
        const v = cs.getPropertyValue(n).trim();
        if (v)
          out[n] = v;
      }
    }
    return out;
  };
  var buildViewportSnapshot = () => {
    const v = {
      w: Math.round(window.innerWidth),
      h: Math.round(window.innerHeight),
      dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100
    };
    try {
      if (matchMedia("(prefers-color-scheme: dark)").matches)
        v.colorScheme = "dark";
      else if (matchMedia("(prefers-color-scheme: light)").matches)
        v.colorScheme = "light";
      if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        v.reducedMotion = true;
    } catch {}
    try {
      const dir = window.getComputedStyle(document.documentElement).direction;
      if (dir === "rtl")
        v.direction = "rtl";
      else if (dir === "ltr")
        v.direction = "ltr";
    } catch {}
    try {
      const scale = window.visualViewport?.scale;
      if (typeof scale === "number" && Math.abs(scale - 1) > 0.001) {
        v.zoom = Math.round(scale * 100) / 100;
      }
    } catch {}
    return v;
  };
  var lastTabAt = 0;
  var noteTabPressed = () => {
    lastTabAt = Date.now();
  };
  var activeFocusSnapshot = () => {
    const ae = document.activeElement;
    if (!ae || ae === document.body || ae === document.documentElement)
      return null;
    let selector;
    try {
      selector = cssPath(ae);
    } catch {
      selector = ae.tagName.toLowerCase();
    }
    const out = { selector };
    if (Date.now() - lastTabAt < 1000)
      out.recentlyTabbed = true;
    return out;
  };
  var readGitContext = () => {
    const meta = document.querySelector('meta[name="pinchgrab-build"]');
    if (!meta?.content)
      return null;
    const content = meta.content;
    const out = {};
    const commit = /\bcommit:([\w.-]+)/.exec(content)?.[1];
    const branch = /\bbranch:([\w./-]+)/.exec(content)?.[1];
    const build = /\bbuild:([\w./-]+)/.exec(content)?.[1];
    if (commit)
      out.commit = trimText(commit, 80);
    if (branch)
      out.branch = trimText(branch, 80);
    if (build)
      out.build = trimText(build, 80);
    return Object.keys(out).length ? out : null;
  };
  var buildRouteSnapshot = () => {
    const out = {};
    try {
      const u = new URL(location.href);
      if (u.pathname)
        out.pathname = u.pathname;
      if (u.hash)
        out.hash = u.hash;
      const params = {};
      let nParams = 0;
      for (const [k, v] of u.searchParams) {
        if (nParams >= 16)
          break;
        params[k] = trimText(v, 200);
        nParams++;
      }
      if (Object.keys(params).length)
        out.query = params;
      const routeQuery = u.searchParams.get("route") ?? u.searchParams.get("tab") ?? u.searchParams.get("view");
      if (routeQuery)
        out.routeName = trimText(routeQuery, 80);
      if (u.hash && u.hash.length > 1) {
        const hashPath = u.hash.replace(/^#\/?/, "");
        const segs = hashPath.split("/").filter(Boolean);
        if (segs.length) {
          out.routeName = out.routeName ?? trimText(segs[0], 80);
          if (segs.length > 1)
            out.routeParam = trimText(segs.slice(1).join("/"), 200);
        }
      }
    } catch {}
    return out;
  };
  var buildStateSnapshot = () => {
    const out = {};
    try {
      const lsKeys = [];
      for (let i = 0;i < localStorage.length && lsKeys.length < 32; i++) {
        const k = localStorage.key(i);
        if (k)
          lsKeys.push(k);
      }
      if (lsKeys.length)
        out.storageKeys = lsKeys;
    } catch {}
    try {
      const ssKeys = [];
      for (let i = 0;i < sessionStorage.length && ssKeys.length < 32; i++) {
        const k = sessionStorage.key(i);
        if (k)
          ssKeys.push(k);
      }
      if (ssKeys.length)
        out.sessionKeys = ssKeys;
    } catch {}
    try {
      const cookieNames = document.cookie.split(";").map((c) => c.trim().split("=")[0]).filter(Boolean).slice(0, 32);
      if (cookieNames.length)
        out.cookieNames = cookieNames;
    } catch {}
    try {
      const flagMeta = document.querySelector('meta[name="pinchgrab-flags"]');
      if (flagMeta?.content)
        out.featureFlags = trimText(flagMeta.content, 400);
    } catch {}
    return Object.keys(out).length ? out : null;
  };
  var buildPageContext = () => {
    const ctx = {
      url: location.href,
      title: trimText(document.title, 200),
      viewport: buildViewportSnapshot(),
      tokens: collectRootCssVars(),
      userAgent: trimText(navigator.userAgent, 240),
      lang: document.documentElement.getAttribute("lang") || navigator.language || ""
    };
    const git = readGitContext();
    if (git)
      ctx.gitContext = git;
    const focus = activeFocusSnapshot();
    if (focus)
      ctx.activeFocus = focus;
    const route = buildRouteSnapshot();
    if (Object.keys(route).length)
      ctx.route = route;
    const state = buildStateSnapshot();
    if (state)
      ctx.state = state;
    return ctx;
  };
  var STRONG_ID_RE = /^(radix-|headlessui-|mui-|:r[0-9a-z]+:)/i;
  var isStrongMarker = (el) => Boolean(el.getAttribute("data-testid") || el.getAttribute("data-test") || el.getAttribute("data-cy") || el.getAttribute("data-qa") || el.getAttribute("role") || el.id && !STRONG_ID_RE.test(el.id));
  var MEDIUM_TAGS = new Set(["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA", "FORM"]);
  var WEAK_TAGS = new Set(["ARTICLE", "SECTION", "NAV", "HEADER", "FOOTER", "LI"]);
  var isMediumMarker = (el) => MEDIUM_TAGS.has(el.tagName);
  var isHugeViewportFill = (el) => {
    if (el === document.body || el === document.documentElement)
      return true;
    const r = el.getBoundingClientRect();
    return r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9;
  };
  var snapToComponent = (tgt, knownCaptured, maxDepth = 4) => {
    if (knownCaptured.size) {
      let cur2 = tgt;
      while (cur2 && cur2 !== document.body) {
        for (const sel of knownCaptured) {
          try {
            if (cur2.matches(sel))
              return cur2;
          } catch {}
        }
        cur2 = cur2.parentElement;
      }
    }
    let cur = tgt;
    for (let i = 0;i <= maxDepth && cur && cur !== document.body; i++) {
      if ((isStrongMarker(cur) || isMediumMarker(cur)) && !isHugeViewportFill(cur))
        return cur;
      cur = cur.parentElement;
    }
    return tgt;
  };
  var pickDragCandidates = (overlayHost) => {
    const allRaw = Array.from(document.body.querySelectorAll("*"));
    return allRaw.filter((el) => {
      if (overlayHost.contains(el))
        return false;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0)
        return false;
      if (r.width > window.innerWidth * 0.9 && r.height > window.innerHeight * 0.9)
        return false;
      return true;
    });
  };
  var elementsInRect = (candidates, x1, y1, x2, y2, mode = "partial") => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const matches = [];
    for (const el of candidates) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0)
        continue;
      if (mode === "full") {
        if (r.left < minX || r.top < minY || r.right > maxX || r.bottom > maxY)
          continue;
      } else {
        if (r.right < minX || r.left > maxX || r.bottom < minY || r.top > maxY)
          continue;
      }
      matches.push(el);
    }
    return matches.filter((a) => !matches.some((b) => a !== b && a.contains(b)));
  };

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

  // src/content-script.ts
  var LOG = "[PinchGrab/cs]";
  var KEY = "__pinchgrabContent";
  if (window[KEY]) {
    console.log(LOG, "already initialized; reusing.");
  } else {
    init();
  }
  function init() {
    try {
      document.dispatchEvent(new Event("__pinchgrab-takeover"));
    } catch {}
    document.getElementById("__pinchgrab_overlay")?.remove();
    const inExtension = typeof chrome !== "undefined" && Boolean(chrome.runtime?.id);
    const testCaptures = inExtension ? null : [];
    let destroyed = false;
    const contextAlive = () => {
      if (!inExtension)
        return true;
      try {
        return Boolean(chrome.runtime?.id);
      } catch {
        return false;
      }
    };
    const orphanGuard = () => {
      if (destroyed)
        return false;
      if (contextAlive())
        return true;
      console.warn(LOG, "extension context invalidated — tearing down orphaned content script");
      try {
        window[KEY]?.destroy();
      } catch {}
      return false;
    };
    const overlayHost = document.createElement("div");
    overlayHost.id = "__pinchgrab_overlay";
    Object.assign(overlayHost.style, {
      all: "initial",
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      pointerEvents: "none",
      zIndex: "2147483646"
    });
    document.documentElement.appendChild(overlayHost);
    const shadow = overlayHost.attachShadow({ mode: "open" });
    const promoteToTopLayer = () => {
      if (!("showPopover" in overlayHost))
        return;
      try {
        overlayHost.setAttribute("popover", "manual");
        Object.assign(overlayHost.style, {
          margin: "0",
          border: "0",
          padding: "0",
          width: "auto",
          height: "auto",
          background: "transparent",
          overflow: "visible",
          color: "inherit"
        });
        if (!overlayHost.matches(":popover-open"))
          overlayHost.showPopover();
      } catch (e) {
        console.warn(LOG, "top-layer promotion failed — max z-index fallback", e);
        try {
          overlayHost.removeAttribute("popover");
        } catch {}
      }
    };
    const bringToFront = () => {
      if (!("showPopover" in overlayHost))
        return;
      if (overlayHost.style.display === "none")
        return;
      try {
        if (overlayHost.matches(":popover-open"))
          overlayHost.hidePopover();
        overlayHost.showPopover();
      } catch {
        promoteToTopLayer();
      }
    };
    promoteToTopLayer();
    const noodleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    Object.assign(noodleSvg.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "2",
      overflow: "visible"
    });
    const rings = new Map;
    const RING_BASE = {
      position: "fixed",
      pointerEvents: "none",
      border: "2px solid #ff5f00",
      borderRadius: "6px",
      boxShadow: "0 0 0 3px rgba(255,95,0,.18), 0 0 16px rgba(255,95,0,.4)",
      transition: "opacity .08s linear",
      boxSizing: "border-box",
      zIndex: "1"
    };
    const RING_GOLD = {
      borderColor: "#ffd166",
      boxShadow: "0 0 0 3px rgba(255,209,102,.22), 0 0 18px rgba(255,209,102,.45)"
    };
    const RING_PREVIEW = {
      borderColor: "#7bd97a",
      borderWidth: "3px",
      boxShadow: "0 0 0 3px rgba(123,217,122,.32), 0 0 22px rgba(123,217,122,.55)"
    };
    const LABEL_BASE = {
      position: "fixed",
      pointerEvents: "none",
      background: "rgba(255,95,0,.65)",
      color: "#fff",
      font: "600 11px/1.2 ui-monospace,'JetBrains Mono',Menlo,monospace",
      padding: "3px 6px",
      borderRadius: "3px",
      width: "220px",
      height: "16px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textShadow: "0 1px 2px rgba(0,0,0,.45)",
      boxSizing: "border-box",
      display: "none"
    };
    const ensureRing = (key) => {
      let slot = rings.get(key);
      if (slot)
        return slot;
      const el = document.createElement("div");
      el.className = "ring";
      Object.assign(el.style, RING_BASE);
      const label = document.createElement("div");
      label.className = "label";
      Object.assign(label.style, LABEL_BASE);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-width", "2.5");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("opacity", "0.5");
      if (!noodleSvg.isConnected)
        shadow.append(noodleSvg);
      noodleSvg.append(path);
      shadow.append(el, label);
      slot = { el, label, path, raf: 0, target: null };
      rings.set(key, slot);
      return slot;
    };
    const removeRing = (key) => {
      const slot = rings.get(key);
      if (!slot)
        return;
      if (slot.raf)
        cancelAnimationFrame(slot.raf);
      slot.el.remove();
      slot.label.remove();
      slot.path.remove();
      rings.delete(key);
      ringTrackOpts.delete(key);
    };
    const clearRings = () => {
      for (const k of [...rings.keys()])
        removeRing(k);
      noodleSvg.remove();
    };
    const positionRing = (slot, target, opts) => {
      const r = target.getBoundingClientRect();
      const ringStyle = slot.el.style;
      ringStyle.left = `${Math.max(0, r.left - 3)}px`;
      ringStyle.top = `${Math.max(0, r.top - 3)}px`;
      ringStyle.width = `${Math.max(0, r.width + 6)}px`;
      ringStyle.height = `${Math.max(0, r.height + 6)}px`;
      ringStyle.display = "block";
      if (opts.preview) {
        Object.assign(ringStyle, RING_PREVIEW);
      } else if (opts.gold) {
        Object.assign(ringStyle, RING_GOLD);
        ringStyle.borderWidth = "2px";
      } else {
        ringStyle.borderColor = "#ff5f00";
        ringStyle.boxShadow = RING_BASE.boxShadow;
        ringStyle.borderWidth = "2px";
      }
      ringStyle.borderStyle = opts.dashed ? "dashed" : "solid";
      slot.label.style.display = "none";
      const ringPad = 3;
      const ringL = r.left - ringPad;
      const ringR = r.right + ringPad;
      const ringT = r.top - ringPad;
      const ringB = r.bottom + ringPad;
      const ox = window.innerWidth;
      const oy = window.innerHeight / 2;
      const ex = Math.max(ringL, Math.min(ox, ringR));
      const ey = Math.max(ringT, Math.min(oy, ringB));
      if (Math.hypot(ex - ox, ey - oy) < 24) {
        slot.path.setAttribute("d", "");
      } else {
        const c1x = ox - 80, c1y = oy;
        const approachDx = ox > ringR ? 60 : ox < ringL ? -60 : 0;
        const c2x = ex + approachDx, c2y = ey;
        slot.path.setAttribute("d", `M ${ox} ${oy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`);
      }
      const stroke = opts.preview ? "#7bd97a" : opts.gold ? "#ffd166" : "#ff5f00";
      slot.path.setAttribute("stroke", stroke);
    };
    let overlayFrozen = false;
    const ringTrackOpts = new Map;
    const armRingLoop = (key, el, opts) => {
      const slot = rings.get(key);
      if (!slot)
        return;
      if (slot.raf)
        cancelAnimationFrame(slot.raf);
      const tick = () => {
        if (!el.isConnected) {
          removeRing(key);
          ringTrackOpts.delete(key);
          return;
        }
        if (overlayFrozen) {
          slot.raf = 0;
          return;
        }
        positionRing(slot, el, opts);
        slot.raf = requestAnimationFrame(tick);
      };
      tick();
    };
    const trackElement = (key, el, opts = {}) => {
      const slot = ensureRing(key);
      slot.target = el;
      ringTrackOpts.set(key, { el, opts });
      armRingLoop(key, el, opts);
      bringToFront();
    };
    const freezeRings = () => {
      for (const slot of rings.values()) {
        if (slot.raf) {
          cancelAnimationFrame(slot.raf);
          slot.raf = 0;
        }
      }
    };
    const thawRings = () => {
      for (const [key, { el, opts }] of ringTrackOpts)
        armRingLoop(key, el, opts);
    };
    const flashElement = (el) => {
      const slot = ensureRing("flash");
      positionRing(slot, el, {});
      slot.el.animate([
        { opacity: 1, transform: "scale(1.04)", borderColor: "#ffe066", boxShadow: "0 0 0 6px rgba(255,224,102,.4)" },
        { opacity: 0, transform: "scale(1)" }
      ], { duration: 700, easing: "ease-out", fill: "forwards" });
      setTimeout(() => removeRing("flash"), 720);
    };
    const locateFlash = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0)
        return;
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      const slot = ensureRing("locate");
      positionRing(slot, el, {});
      Object.assign(slot.el.style, {
        borderColor: "#5fd1ff",
        borderWidth: "3px",
        boxShadow: "0 0 0 4px rgba(95,209,255,.35), 0 0 36px rgba(95,209,255,.7)",
        opacity: "1"
      });
      slot.el.animate([
        { transform: "scale(1.00)", opacity: 1, boxShadow: "0 0 0 4px rgba(95,209,255,.45), 0 0 20px rgba(95,209,255,.55)" },
        { transform: "scale(1.06)", opacity: 1, boxShadow: "0 0 0 12px rgba(95,209,255,.18), 0 0 60px rgba(95,209,255,.85)" },
        { transform: "scale(1.00)", opacity: 1, boxShadow: "0 0 0 4px rgba(95,209,255,.45), 0 0 20px rgba(95,209,255,.55)" },
        { transform: "scale(1.06)", opacity: 1, boxShadow: "0 0 0 12px rgba(95,209,255,.18), 0 0 60px rgba(95,209,255,.85)" },
        { transform: "scale(1.00)", opacity: 1, boxShadow: "0 0 0 4px rgba(95,209,255,.45), 0 0 20px rgba(95,209,255,.55)" },
        { transform: "scale(1.06)", opacity: 1, boxShadow: "0 0 0 12px rgba(95,209,255,.18), 0 0 60px rgba(95,209,255,.85)" },
        { transform: "scale(1.00)", opacity: 0 }
      ], { duration: 1600, easing: "ease-in-out", fill: "forwards" });
      setTimeout(() => removeRing("locate"), 1700);
    };
    let spacingOverlay = false;
    const spacingDivs = [];
    const ensureSpacingDivs = () => {
      if (spacingDivs.length)
        return spacingDivs;
      for (let i = 0;i < 8; i++) {
        const d = document.createElement("div");
        Object.assign(d.style, {
          position: "fixed",
          pointerEvents: "none",
          boxSizing: "border-box",
          display: "none",
          background: i < 4 ? "rgba(255,159,64,.28)" : "rgba(108,178,235,.28)"
        });
        shadow.append(d);
        spacingDivs.push(d);
      }
      return spacingDivs;
    };
    const clearSpacingOverlay = () => {
      for (const d of spacingDivs)
        d.style.display = "none";
    };
    const paintSpacingOverlay = (el) => {
      if (!spacingOverlay) {
        clearSpacingOverlay();
        return;
      }
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const mt = parseFloat(cs.marginTop) || 0;
      const mr = parseFloat(cs.marginRight) || 0;
      const mb = parseFloat(cs.marginBottom) || 0;
      const ml = parseFloat(cs.marginLeft) || 0;
      const pt = parseFloat(cs.paddingTop) || 0;
      const pr = parseFloat(cs.paddingRight) || 0;
      const pb = parseFloat(cs.paddingBottom) || 0;
      const pl = parseFloat(cs.paddingLeft) || 0;
      const [m1, m2, m3, m4, p1, p2, p3, p4] = ensureSpacingDivs();
      const set = (d, x, y, w, h) => {
        if (w <= 0 || h <= 0) {
          d.style.display = "none";
          return;
        }
        d.style.left = x + "px";
        d.style.top = y + "px";
        d.style.width = w + "px";
        d.style.height = h + "px";
        d.style.display = "block";
      };
      set(m1, r.left - ml, r.top - mt, r.width + ml + mr, mt);
      set(m2, r.right, r.top, mr, r.height);
      set(m3, r.left - ml, r.bottom, r.width + ml + mr, mb);
      set(m4, r.left - ml, r.top, ml, r.height);
      set(p1, r.left, r.top, r.width, pt);
      set(p2, r.right - pr, r.top + pt, pr, r.height - pt - pb);
      set(p3, r.left, r.bottom - pb, r.width, pb);
      set(p4, r.left, r.top + pt, pl, r.height - pt - pb);
    };
    const annotationEl = document.createElement("div");
    annotationEl.className = "annotation";
    Object.assign(annotationEl.style, {
      position: "fixed",
      pointerEvents: "auto",
      background: "rgba(15,15,20,.96)",
      color: "#fcfaf5",
      border: "1px solid rgba(255,95,0,.5)",
      borderRadius: "10px",
      padding: "8px 10px",
      font: "12px/1.45 ui-monospace,'JetBrains Mono',Menlo,monospace",
      maxWidth: "min(360px, 70vw)",
      boxShadow: "0 8px 32px rgba(0,0,0,.55)",
      boxSizing: "border-box",
      display: "none",
      zIndex: "2147483647"
    });
    shadow.append(annotationEl);
    const annotation = setupAnnotation(annotationEl, {
      sendToPanel,
      captureAndComment: (el, text) => {
        const entry = captureEntry(el, nextSeq());
        flashElement(el);
        const page = buildPageContext();
        sendToPanel({ kind: "capture", entry, page });
        testCaptures?.push({ entry, page });
        sendToPanel({ kind: "feedback-add", selector: entry.selector, text, url: page.url, parentUid: entry.uid });
        return entry;
      },
      onHide: () => removeRing("hover"),
      onShow: (el) => trackElement("hover", el, { label: compactTarget(el) })
    });
    let altActive = false;
    let altForwarded = false;
    let manualSelect = false;
    const pinchEngaged = (native) => native || altForwarded || manualSelect;
    let lastHoverEl = null;
    let lastMouse = { x: -1, y: -1 };
    let knownCaptured = new Set;
    let hoverSnap = true;
    const fireHoverEnd = () => {
      removeRing("hover");
      clearSpacingOverlay();
      lastHoverEl = null;
      sendToPanel({ kind: "hover-end" });
    };
    let selectBadge = null;
    const showSelectBadge = (on) => {
      if (!on) {
        selectBadge?.remove();
        selectBadge = null;
        return;
      }
      if (selectBadge)
        return;
      const b = document.createElement("div");
      b.textContent = "\uD83E\uDD0F Pinch mode — click to capture · Esc to exit";
      Object.assign(b.style, {
        position: "fixed",
        left: "50%",
        bottom: "18px",
        transform: "translateX(-50%)",
        background: "rgba(255,95,0,.95)",
        color: "#fff",
        font: "600 12px/1 ui-monospace,'JetBrains Mono',Menlo,monospace",
        padding: "8px 14px",
        borderRadius: "999px",
        boxShadow: "0 4px 20px rgba(0,0,0,.35)",
        pointerEvents: "none",
        zIndex: "2147483647",
        whiteSpace: "nowrap"
      });
      shadow.append(b);
      selectBadge = b;
    };
    const setSelectMode = (on, notifyPanel = false) => {
      if (manualSelect === on)
        return;
      manualSelect = on;
      showSelectBadge(on);
      bringToFront();
      setAltActive(on);
      if (notifyPanel)
        sendToPanel({ kind: "select-mode", on });
    };
    const setAltActive = (on) => {
      if (altActive === on)
        return;
      altActive = on;
      if (!on) {
        if (annotationEl.style.display === "block") {
          sendToPanel({ kind: "hover-end" });
          annotation.focusTextarea();
        } else {
          fireHoverEnd();
        }
        return;
      }
      if (lastMouse.x >= 0) {
        const tgt = document.elementFromPoint(lastMouse.x, lastMouse.y);
        if (tgt instanceof Element) {
          lastHoverEl = tgt;
          fireHover(tgt);
        }
      }
    };
    const isHugeElement = (el) => {
      if (el === document.body || el === document.documentElement)
        return true;
      const r = el.getBoundingClientRect();
      return r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9;
    };
    const resolveHoverTarget = (tgt) => {
      const el = hoverSnap ? snapToComponent(tgt, knownCaptured) : tgt;
      for (const sel of knownCaptured) {
        try {
          if (el.matches(sel))
            return { el, selector: sel };
        } catch {}
      }
      return { el, selector: cssPath(el) };
    };
    const fireHover = (tgt) => {
      const { el, selector } = resolveHoverTarget(tgt);
      if (isHugeElement(el)) {
        removeRing("hover");
        sendToPanel({ kind: "hover-end" });
        return;
      }
      trackElement("hover", el, { label: compactTarget(el) });
      paintSpacingOverlay(el);
      const r = el.getBoundingClientRect();
      sendToPanel({
        kind: "hover",
        selector,
        tag: el.tagName.toLowerCase(),
        label: compactTarget(el),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
      });
    };
    let sequenceCounter = 0;
    const nextSeq = () => ++sequenceCounter;
    let lastContextEl = null;
    let suppressNextClick = false;
    let dragStart = null;
    let dragRect = null;
    let dragSavedUserSelect = "";
    let dragCandidates = [];
    const clearPreviewRings = () => {
      for (const k of [...rings.keys()])
        if (k.startsWith("preview:"))
          removeRing(k);
    };
    const ensureDragRect = () => {
      if (dragRect)
        return dragRect;
      dragRect = document.createElement("div");
      dragRect.className = "rubber";
      Object.assign(dragRect.style, {
        position: "fixed",
        pointerEvents: "none",
        border: "2px solid #ff5f00",
        background: "rgba(255,95,0,.14)",
        borderRadius: "4px",
        boxShadow: "0 0 0 1px rgba(255,95,0,.35), 0 0 18px rgba(255,95,0,.25)",
        boxSizing: "border-box"
      });
      shadow.append(dragRect);
      dragSavedUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.cursor = "crosshair";
      annotation.hide();
      removeRing("hover");
      dragCandidates = pickDragCandidates(overlayHost);
      console.log(LOG, "drag candidate pool locked:", dragCandidates.length, "elements");
      return dragRect;
    };
    const teardownDragRect = () => {
      if (dragRect) {
        dragRect.remove();
        dragRect = null;
      }
      document.body.style.userSelect = dragSavedUserSelect;
      document.body.style.webkitUserSelect = "";
      document.body.style.cursor = "";
      clearPreviewRings();
      dragCandidates = [];
    };
    let lastPreviewKeys = new Set;
    const dragMode = (e) => dragStart && e.clientX >= dragStart.x ? "full" : "partial";
    const updateDragRect = (e) => {
      if (!dragStart)
        return;
      const dx = Math.abs(e.clientX - dragStart.x);
      const dy = Math.abs(e.clientY - dragStart.y);
      if (!dragRect && dx < 2 && dy < 2)
        return;
      const x1 = Math.min(dragStart.x, e.clientX);
      const y1 = Math.min(dragStart.y, e.clientY);
      const x2 = Math.max(dragStart.x, e.clientX);
      const y2 = Math.max(dragStart.y, e.clientY);
      const r = ensureDragRect();
      const mode = dragMode(e);
      Object.assign(r.style, {
        left: x1 + "px",
        top: y1 + "px",
        width: x2 - x1 + "px",
        height: y2 - y1 + "px",
        borderStyle: mode === "full" ? "solid" : "dashed"
      });
      const els = elementsInRect(dragCandidates, x1, y1, x2, y2, mode);
      const next = new Set(els);
      let same = next.size === lastPreviewKeys.size;
      if (same)
        for (const el of next) {
          if (!lastPreviewKeys.has(el)) {
            same = false;
            break;
          }
        }
      if (!same) {
        clearPreviewRings();
        els.forEach((el, i) => trackElement(`preview:${i}`, el, { preview: true }));
        lastPreviewKeys = next;
        console.log(LOG, `drag preview (${mode}):`, els.length, "targets", els.map(compactTarget));
      }
    };
    let pendingMulti = [];
    const stagePending = (raw, clickAt) => {
      const el = hoverSnap ? snapToComponent(raw, knownCaptured) : raw;
      if (isHugeElement(el)) {
        console.log(LOG, "skipping huge element from staging:", compactTarget(el));
        return;
      }
      const entry = captureEntry(el, nextSeq(), {
        ...clickAt ? { clickAt } : {}
      });
      if (pendingMulti.some((p) => p.el === el || p.entry.selector === entry.selector)) {
        flashElement(el);
        return;
      }
      const idx = pendingMulti.length;
      pendingMulti.push({ el, entry });
      trackElement(`pending:${idx}`, el, { gold: true, label: `#${idx + 1} ${compactTarget(el)}` });
      flashElement(el);
      sendToPanel({ kind: "pending-add", entry });
    };
    const commitPendingMulti = () => {
      if (!pendingMulti.length)
        return;
      console.log(LOG, "commitPendingMulti — committing", pendingMulti.length, "staged elements");
      console.trace(LOG, "commit stack trace");
      pendingMulti.forEach(({ el, entry }, i) => {
        const page = buildPageContext();
        sendToPanel({ kind: "capture", entry, page, grouped: i > 0 });
        testCaptures?.push({ entry, page, grouped: i > 0 });
        removeRing(`pending:${i}`);
        if (el.isConnected)
          flashElement(el);
      });
      pendingMulti = [];
      sendToPanel({ kind: "pending-clear" });
    };
    const cancelPendingMulti = () => {
      if (pendingMulti.length)
        console.log(LOG, "cancelPendingMulti — discarding", pendingMulti.length, "staged");
      pendingMulti.forEach((_, i) => removeRing(`pending:${i}`));
      pendingMulti = [];
      sendToPanel({ kind: "pending-clear" });
    };
    let lastMoveTs = 0;
    const onMouseMove = (e) => {
      if (!orphanGuard())
        return;
      if (e.timeStamp === lastMoveTs)
        return;
      lastMoveTs = e.timeStamp;
      lastMouse = { x: e.clientX, y: e.clientY };
      if (dragStart) {
        updateDragRect(e);
        removeRing("hover");
        sendToPanel({ kind: "hover-end" });
        lastHoverEl = null;
        return;
      }
      const altOn = pinchEngaged(e.altKey);
      if (!altOn) {
        if (altActive)
          setAltActive(false);
        return;
      }
      if (!altActive)
        setAltActive(true);
      const tgt = e.target;
      if (!(tgt instanceof Element) || tgt === lastHoverEl)
        return;
      lastHoverEl = tgt;
      fireHover(tgt);
    };
    const isInsideAnnotation = (e) => {
      if (annotationEl.style.display !== "block")
        return false;
      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      for (const node of path)
        if (node === annotationEl)
          return true;
      return false;
    };
    const isPinchgrabOwnUi = (e) => {
      const t = e.target;
      if (t instanceof Element && t.id === "__pinchgrab_overlay")
        return true;
      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      for (const node of path) {
        if (node instanceof Element && node.id === "__pinchgrab_overlay")
          return true;
        if (node === overlayHost)
          return true;
      }
      return false;
    };
    const onMouseDown = (e) => {
      if (!orphanGuard())
        return;
      if (isInsideAnnotation(e))
        return;
      if (annotationEl.style.display === "block" && !annotation.isLocked())
        annotation.hide();
      if (!pinchEngaged(e.altKey) || dragStart)
        return;
      if (isPinchgrabOwnUi(e))
        return;
      e.preventDefault();
      e.stopPropagation();
      dragStart = { x: e.clientX, y: e.clientY };
      console.log(LOG, "drag armed at", dragStart);
    };
    const onMouseUp = (e) => {
      if (!dragStart)
        return;
      const start = dragStart;
      const wasDrag = Boolean(dragRect);
      dragStart = null;
      teardownDragRect();
      if (!wasDrag) {
        console.log(LOG, "drag too short, treated as single click");
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      suppressNextClick = true;
      setTimeout(() => {
        suppressNextClick = false;
      }, 200);
      const mode = e.clientX >= start.x ? "full" : "partial";
      const poolForCommit = dragCandidates.length ? dragCandidates : pickDragCandidates(overlayHost);
      const els = elementsInRect(poolForCommit, start.x, start.y, e.clientX, e.clientY, mode);
      console.log(LOG, `drag END — mode=${mode} — STAGING (NOT committing)`, els.length, "elements:", els.map(compactTarget));
      for (const el of els)
        stagePending(el);
    };
    const onClick = (event) => {
      if (!orphanGuard())
        return;
      if (suppressNextClick) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (isInsideAnnotation(event))
        return;
      if (!pinchEngaged(event.altKey))
        return;
      if (isPinchgrabOwnUi(event))
        return;
      event.preventDefault();
      event.stopPropagation();
      const raw = event.target;
      if (!(raw instanceof Element))
        return;
      const el = hoverSnap ? snapToComponent(raw, knownCaptured) : raw;
      if (isHugeElement(el)) {
        console.log(LOG, "skipping huge click target:", compactTarget(el));
        return;
      }
      if (event.shiftKey) {
        stagePending(el, { clientX: event.clientX, clientY: event.clientY });
        return;
      }
      const entry = captureEntry(el, nextSeq(), {
        clickAt: { clientX: event.clientX, clientY: event.clientY }
      });
      flashElement(el);
      const page = buildPageContext();
      sendToPanel({ kind: "capture", entry, page });
      testCaptures?.push({ entry, page });
    };
    for (const target of [window, document]) {
      target.addEventListener("mousemove", onMouseMove, true);
      target.addEventListener("mousedown", onMouseDown, true);
      target.addEventListener("mouseup", onMouseUp, true);
    }
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", (e) => {
      if (e.target instanceof Element)
        lastContextEl = e.target;
    }, true);
    const onKeyDownAlt = (e) => {
      if (!orphanGuard())
        return;
      if (e.key === "Escape" && manualSelect && annotationEl.style.display !== "block") {
        e.preventDefault();
        setSelectMode(false, true);
        return;
      }
      if (e.altKey) {
        setAltActive(true);
        if (e.key === "Alt" && annotationEl.style.display === "block") {
          e.preventDefault();
        }
      }
    };
    const onKeyUpAlt = (e) => {
      if (!orphanGuard())
        return;
      if (e.key === "Alt" || !e.altKey) {
        if (annotationEl.style.display === "block")
          e.preventDefault();
        altForwarded = false;
        if (!manualSelect)
          setAltActive(false);
      }
    };
    const onWindowBlur = () => {
      altForwarded = false;
      if (!manualSelect)
        setAltActive(false);
    };
    window.addEventListener("keydown", onKeyDownAlt, true);
    window.addEventListener("keyup", onKeyUpAlt, true);
    window.addEventListener("blur", onWindowBlur, true);
    const safeQuery = (sel) => {
      try {
        return sel ? document.querySelector(sel) : null;
      } catch {
        return null;
      }
    };
    const handleCommand = (msg, respond) => {
      switch (msg.kind) {
        case "outline": {
          const el = safeQuery(msg.selector);
          if (el)
            trackElement("from-panel", el, { label: compactTarget(el), gold: msg.gold, dashed: msg.dashed });
          else
            removeRing("from-panel");
          return false;
        }
        case "outline-clear":
          removeRing("from-panel");
          removeRing("multi");
          return false;
        case "outline-multi": {
          removeRing("multi");
          let i = 0;
          for (const sel of msg.selectors) {
            const el = safeQuery(sel);
            if (el)
              trackElement(`multi:${i++}`, el, { gold: true });
          }
          return false;
        }
        case "outline-multi-clear": {
          for (const k of [...rings.keys()])
            if (k.startsWith("multi:"))
              removeRing(k);
          return false;
        }
        case "scroll-to": {
          const el = safeQuery(msg.selector);
          if (!el)
            return false;
          el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
          if (msg.sticky)
            trackElement("sticky", el, { label: compactTarget(el), gold: true });
          else
            flashElement(el);
          return false;
        }
        case "locate-flash": {
          const el = safeQuery(msg.selector);
          if (!el)
            return false;
          locateFlash(el);
          return false;
        }
        case "sticky-clear":
          removeRing("sticky");
          return false;
        case "validate": {
          const valid = {};
          for (const sel of msg.selectors) {
            try {
              valid[sel] = Boolean(document.querySelector(sel));
            } catch {
              valid[sel] = false;
            }
          }
          respond({ valid });
          return true;
        }
        case "log-element": {
          const el = safeQuery(msg.selector);
          if (!el) {
            respond({ ok: false });
            return true;
          }
          try {
            el.setAttribute("data-pinchgrab-id", String(msg.n ?? ""));
          } catch {}
          console.log("%c[PinchGrab] element:", "color:#ff5f00;font-weight:700;", el, `
  • Right-click → Reveal in Elements panel
  • Or in DevTools console: $('[data-pinchgrab-id="${msg.n ?? ""}"]')`);
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          flashElement(el);
          respond({ ok: true, snippet: `$('${msg.selector}')` });
          return true;
        }
        case "recapture": {
          const el = safeQuery(msg.selector);
          if (!el) {
            respond({ ok: false, reason: "not-found" });
            return true;
          }
          const entry = captureEntry(el, msg.n ?? nextSeq());
          respond({ ok: true, entry, page: buildPageContext() });
          return true;
        }
        case "capture-ancestor": {
          let cur = safeQuery(msg.selector);
          if (!cur) {
            respond({ ok: false, reason: "not-found" });
            return true;
          }
          for (let i = 0;i < msg.depth && cur && cur.parentElement && cur !== document.body; i++) {
            cur = cur.parentElement;
          }
          if (!cur || isHugeElement(cur)) {
            respond({ ok: false, reason: "too-large" });
            return true;
          }
          const entry = captureEntry(cur, nextSeq());
          flashElement(cur);
          sendToPanel({ kind: "capture", entry, page: buildPageContext() });
          respond({ ok: true, entry });
          return true;
        }
        case "outline-ancestor": {
          let cur = safeQuery(msg.selector);
          if (!cur)
            return false;
          for (let i = 0;i < msg.depth && cur && cur.parentElement && cur !== document.body; i++) {
            cur = cur.parentElement;
          }
          if (!cur || isHugeElement(cur)) {
            removeRing("from-panel");
            return false;
          }
          trackElement("from-panel", cur, { label: compactTarget(cur), gold: true });
          return false;
        }
        case "alt-state":
          altForwarded = msg.on;
          setAltActive(msg.on);
          return false;
        case "select-mode":
          setSelectMode(msg.on);
          return false;
        case "manual-capture": {
          const el = safeQuery(msg.selector);
          if (!el) {
            respond({ ok: false, reason: "not-found" });
            return true;
          }
          const entry = captureEntry(el, msg.n ?? nextSeq());
          flashElement(el);
          sendToPanel({ kind: "capture", entry, page: buildPageContext() });
          respond({ ok: true, entry });
          return true;
        }
        case "annotation": {
          const el = safeQuery(msg.selector);
          if (el)
            annotation.show(el, { ...msg.payload ?? {}, selector: msg.selector });
          return false;
        }
        case "annotation-clear":
          annotation.hide();
          return false;
        case "pending-cancel":
          cancelPendingMulti();
          return false;
        case "pending-commit":
          commitPendingMulti();
          return false;
        case "context-capture": {
          if (lastContextEl) {
            const entry = captureEntry(lastContextEl, nextSeq());
            flashElement(lastContextEl);
            sendToPanel({ kind: "capture", entry, page: buildPageContext() });
          }
          return false;
        }
        case "set-captured":
          knownCaptured = new Set(msg.selectors);
          return false;
        case "page-html":
          respond({ ok: true, url: location.href, title: document.title, html: `<!DOCTYPE html>
` + document.documentElement.outerHTML });
          return true;
        case "set-cs-prefs":
          if (typeof msg.spacingOverlay === "boolean") {
            spacingOverlay = msg.spacingOverlay;
            if (!spacingOverlay)
              clearSpacingOverlay();
          }
          if (typeof msg.hoverSnap === "boolean")
            hoverSnap = msg.hoverSnap;
          return false;
        case "hide-overlays": {
          overlayFrozen = true;
          freezeRings();
          overlayHost.style.display = "none";
          overlayHost.getBoundingClientRect();
          requestAnimationFrame(() => {
            requestAnimationFrame(() => respond({ ok: true }));
          });
          return true;
        }
        case "show-overlays": {
          overlayHost.style.display = "";
          overlayHost.style.visibility = "visible";
          promoteToTopLayer();
          overlayFrozen = false;
          thawRings();
          respond({ ok: true });
          return true;
        }
        default:
          return false;
      }
    };
    function sendToPanel(payload) {
      const msg = pg(payload);
      if (inExtension) {
        try {
          chrome.runtime.sendMessage(msg).catch?.(() => {});
        } catch {}
      } else {
        try {
          window.dispatchEvent(new CustomEvent("pinchgrab:to-panel", { detail: msg }));
        } catch {}
      }
      if (payload.kind === "capture")
        maybeSnapshotPage(payload.page.url);
    }
    const requestBg = (payload) => new Promise((resolve) => {
      if (!inExtension) {
        resolve(null);
        return;
      }
      try {
        chrome.runtime.sendMessage(pg(payload), (reply) => {
          if (chrome.runtime.lastError) {
            resolve(null);
            return;
          }
          resolve(reply ?? null);
        });
      } catch {
        resolve(null);
      }
    });
    const snapshottedUrls = new Set;
    let snapshotInFlight = false;
    const maybeSnapshotPage = async (url) => {
      if (!inExtension)
        return;
      if (snapshottedUrls.has(url))
        return;
      if (snapshotInFlight)
        return;
      snapshottedUrls.add(url);
      snapshotInFlight = true;
      try {
        const capturedAt = new Date().toISOString();
        const meta = {
          url: location.href,
          title: document.title,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          scrollWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
          scrollHeight: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
          devicePixelRatio: window.devicePixelRatio || 1,
          lang: document.documentElement.lang || navigator.language || ""
        };
        const reply = await requestBg({ kind: "page-snapshot-shot" });
        if (!reply?.ok || !reply.screenshot) {
          snapshottedUrls.delete(url);
          return;
        }
        const snapshot = {
          ...meta,
          capturedAt,
          screenshot: reply.screenshot,
          ...reply.partial ? { partial: true } : {}
        };
        sendToPanel({ kind: "page-snapshot", payload: snapshot });
      } catch {
        snapshottedUrls.delete(url);
      } finally {
        snapshotInFlight = false;
      }
    };
    if (inExtension) {
      chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        if (msg && msg.__pg === true)
          return handleCommand(msg, sendResponse);
        return false;
      });
    } else {
      window.addEventListener("pinchgrab:to-cs", (e) => {
        const msg = e.detail;
        const reqId = msg?.__reqId;
        let responded = false;
        const respond = (reply) => {
          if (responded)
            return;
          responded = true;
          if (reqId)
            window.dispatchEvent(new CustomEvent("pinchgrab:cs-response", { detail: { __reqId: reqId, reply } }));
        };
        handleCommand(msg, respond);
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab")
        noteTabPressed();
    }, true);
    const wirePreferenceListeners = () => {
      try {
        const cs = matchMedia("(prefers-color-scheme: dark)");
        const motion = matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (reason) => {
          sendToPanel({ kind: "preference-change", reason, page: buildPageContext() });
        };
        cs.addEventListener?.("change", () => onChange("color-scheme"));
        motion.addEventListener?.("change", () => onChange("reduced-motion"));
      } catch {}
    };
    wirePreferenceListeners();
    const MUTATION_BUFFER_CAP = 50;
    const MUTATION_WINDOW_MS = 8000;
    const SECRET_ATTR_NAME_RE2 = /(password|token|secret|api[_-]?key|csrf|xsrf|session|nonce)/i;
    const mutationBuffer = [];
    const truncate = (s, max = 120) => String(s ?? "").slice(0, max);
    const mutationObserver = new MutationObserver((records) => {
      const now = new Date().toISOString();
      for (const r of records) {
        const tNode = r.target;
        if (tNode instanceof Node && (overlayHost === tNode || overlayHost.contains(tNode)))
          continue;
        const tEl = tNode instanceof Element ? tNode : tNode.parentElement ?? null;
        const targetDesc = tEl ? compactTarget(tEl) : tNode.nodeName.toLowerCase();
        let entry;
        if (r.type === "childList") {
          const added = r.addedNodes.length;
          const removed = r.removedNodes.length;
          let summary = `${targetDesc}:`;
          if (added > 0) {
            const first = r.addedNodes[0];
            summary += ` +${added} ${first instanceof Element ? compactTarget(first) : "text"}`;
          }
          if (removed > 0) {
            const first = r.removedNodes[0];
            summary += ` -${removed} ${first instanceof Element ? compactTarget(first) : "text"}`;
          }
          entry = { type: "childList", ts: now, target: targetDesc, added, removed, summary: truncate(summary, 200) };
        } else if (r.type === "attributes") {
          const name = r.attributeName ?? "";
          const isSecret = SECRET_ATTR_NAME_RE2.test(name);
          const newValRaw = (tEl ? tEl.getAttribute(name) : null) ?? "";
          const oldValRaw = r.oldValue ?? null;
          const oldValue = isSecret ? "[redacted]" : oldValRaw === null ? undefined : truncate(oldValRaw);
          const newValue = isSecret ? "[redacted]" : truncate(newValRaw);
          entry = {
            type: "attributes",
            ts: now,
            target: targetDesc,
            attributeName: name,
            oldValue,
            newValue,
            summary: truncate(`${targetDesc}[${name}]: ${oldValue ?? "∅"} → ${newValue}`, 200)
          };
        } else {
          const oldValue = r.oldValue ?? undefined;
          const newValue = tNode.nodeValue ?? "";
          entry = {
            type: "characterData",
            ts: now,
            target: targetDesc,
            oldValue: oldValue !== undefined ? truncate(oldValue) : undefined,
            newValue: truncate(newValue),
            summary: truncate(`${targetDesc} text: ${truncate(oldValue, 30)} → ${truncate(newValue, 30)}`, 200)
          };
        }
        mutationBuffer.push(entry);
        if (mutationBuffer.length > MUTATION_BUFFER_CAP)
          mutationBuffer.shift();
      }
    });
    try {
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true
      });
    } catch (e) {
      console.warn(LOG, "MutationObserver.observe failed", e);
    }
    setMutationBufferGetter(() => {
      const cutoff = Date.now() - MUTATION_WINDOW_MS;
      return mutationBuffer.filter((m) => Date.parse(m.ts) >= cutoff);
    });
    const api = {
      captureEntry,
      buildPageContext,
      captures: testCaptures,
      flashElement: (sel) => {
        const el = document.querySelector(sel);
        if (el)
          flashElement(el);
      },
      setAlt: (on) => {
        setAltActive(on);
      },
      nextSeq,
      handleCommand,
      destroy: () => {
        destroyed = true;
        for (const target of [window, document]) {
          target.removeEventListener("mousemove", onMouseMove, true);
          target.removeEventListener("mousedown", onMouseDown, true);
          target.removeEventListener("mouseup", onMouseUp, true);
        }
        document.removeEventListener("click", onClick, true);
        window.removeEventListener("keydown", onKeyDownAlt, true);
        window.removeEventListener("keyup", onKeyUpAlt, true);
        window.removeEventListener("blur", onWindowBlur, true);
        clearRings();
        try {
          if (overlayHost.matches(":popover-open"))
            overlayHost.hidePopover();
        } catch {}
        overlayHost.remove();
        delete window[KEY];
      }
    };
    window[KEY] = api;
    window.__pinchgrab = api;
    document.addEventListener("__pinchgrab-takeover", () => {
      try {
        api.destroy();
      } catch {}
    }, { once: true });
    console.log(LOG, "ready", { inExtension });
  }
  function setupAnnotation(el, { sendToPanel, captureAndComment, onHide, onShow }) {
    let selector = null;
    let activeUid = null;
    let lockedTo = null;
    let locked = false;
    let textarea = null;
    let feedbackList = null;
    const styled = (tag, styles) => {
      const node = document.createElement(tag);
      Object.assign(node.style, styles);
      return node;
    };
    const buildBody = (payload) => {
      el.replaceChildren();
      const captured = Boolean(payload.captured);
      if (captured) {
        const header = styled("div", {
          color: "#ff5f00",
          fontWeight: "700",
          font: "700 13px/1 'Bricolage Grotesque','Outfit',ui-monospace,monospace",
          marginBottom: "4px",
          letterSpacing: "0.02em"
        });
        header.textContent = `#${payload.n ?? "?"}`;
        el.append(header);
      }
      const list = styled("ul", {
        margin: "0 0 6px 0",
        padding: "0 0 0 16px",
        listStyle: "disc"
      });
      feedbackList = list;
      if (payload.feedback?.length) {
        el.append(list);
        for (const t of payload.feedback)
          appendFeedback(t);
      }
      const addRow = styled("div", {
        display: "flex",
        gap: "6px",
        alignItems: "stretch",
        marginTop: "4px",
        paddingTop: "6px",
        borderTop: "1px solid rgba(255,95,0,.2)"
      });
      const ta = styled("textarea", {
        flex: "1",
        minHeight: "28px",
        maxHeight: "120px",
        resize: "none",
        background: "rgba(0,0,0,.35)",
        color: "#fcfaf5",
        border: "1px solid rgba(255,95,0,.3)",
        borderRadius: "6px",
        padding: "4px 6px",
        font: "12px/1.4 ui-monospace,'JetBrains Mono',Menlo,monospace",
        outline: "0",
        boxSizing: "border-box"
      });
      ta.placeholder = captured ? "Comment…" : "Comment to capture…";
      ta.rows = 2;
      ta.addEventListener("focus", () => {
        ta.style.borderColor = "#ff5f00";
      });
      ta.addEventListener("blur", () => {
        ta.style.borderColor = "rgba(255,95,0,.3)";
      });
      textarea = ta;
      const sendBtn = styled("button", {
        flex: "0 0 auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "0 10px",
        height: "28px",
        background: "linear-gradient(180deg, #ff5f00 0%, #ef4b00 100%)",
        color: "#fff",
        border: "0",
        borderRadius: "6px",
        font: "700 11px/1 'Bricolage Grotesque','Outfit',system-ui,sans-serif",
        letterSpacing: ".01em",
        whiteSpace: "nowrap",
        cursor: "pointer",
        boxShadow: "0 0 24px rgba(255,95,0,.25)"
      });
      const sendIcon = styled("span", {
        display: "inline-flex",
        lineHeight: "0"
      });
      sendIcon.innerHTML = PG_ICONS.svgString("message-square-plus", 16);
      const sendLabel = styled("span", { fontSize: "10px" });
      sendLabel.textContent = captured ? "Add" : "Capture";
      sendBtn.append(sendIcon, sendLabel);
      sendBtn.setAttribute("aria-label", captured ? "Add comment" : "Capture and comment");
      addRow.append(ta, sendBtn);
      el.append(addRow);
      const hint = styled("div", {
        color: "#847d9a",
        fontSize: "10px",
        marginTop: "4px"
      });
      hint.textContent = captured ? "Enter to add · Shift+Enter newline · Esc to close" : "Enter to capture & save · Shift+Enter newline · Esc to close";
      el.append(hint);
      function appendFeedback(text) {
        const li = styled("li", {
          margin: "2px 0",
          color: "#fcfaf5",
          wordBreak: "break-word"
        });
        li.textContent = text;
        list.append(li);
        if (!list.parentNode)
          el.insertBefore(list, addRow);
      }
      const submit = () => {
        const text = ta.value.trim();
        if (!text)
          return;
        if (captured && selector) {
          sendToPanel({
            kind: "feedback-add",
            selector,
            text,
            url: location.href,
            ...activeUid ? { parentUid: activeUid } : {}
          });
        } else if (lockedTo) {
          const entry = captureAndComment(lockedTo, text);
          payload.captured = true;
          payload.uid = entry.uid;
          payload.n = entry.n;
          payload.selector = entry.selector;
          payload.feedback = [...payload.feedback ?? [], text];
          selector = entry.selector;
          activeUid = entry.uid;
          buildBody(payload);
          return;
        }
        ta.value = "";
        payload.feedback = [...payload.feedback ?? [], text];
        appendFeedback(text);
      };
      sendBtn.addEventListener("click", submit);
      ta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submit();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          hide();
        }
        e.stopPropagation();
      });
      if (wantsFocus) {
        wantsFocus = false;
        requestAnimationFrame(() => ta.focus({ preventScroll: true }));
      }
    };
    const GAP = 8;
    const MARGIN = 8;
    const position = (anchor) => {
      const r = anchor.getBoundingClientRect();
      const prevVis = el.style.visibility;
      el.style.visibility = "hidden";
      el.style.display = "block";
      el.style.left = "0px";
      el.style.top = "0px";
      const box = el.getBoundingClientRect();
      const bw = box.width || 320;
      const bh = box.height || 160;
      el.style.visibility = prevVis || "visible";
      const roomBelow = window.innerHeight - r.bottom - GAP;
      const roomAbove = r.top - GAP;
      const useAbove = bh > roomBelow && roomAbove > roomBelow;
      let top = useAbove ? r.top - GAP - bh : r.bottom + GAP;
      top = Math.max(MARGIN, Math.min(top, window.innerHeight - bh - MARGIN));
      let left = r.left;
      left = Math.max(MARGIN, Math.min(left, window.innerWidth - bw - MARGIN));
      el.style.left = Math.round(left) + "px";
      el.style.top = Math.round(top) + "px";
      el.style.display = "block";
    };
    const hide = () => {
      stopWatchdog();
      el.style.display = "none";
      selector = null;
      activeUid = null;
      lockedTo = null;
      locked = false;
      textarea = null;
      feedbackList = null;
      wantsFocus = false;
      lastAnchorKey = "";
      onHide();
    };
    const isTyping = () => Boolean(textarea) && document.activeElement === textarea;
    const show = (anchor, payload) => {
      if (!payload) {
        if (locked || isTyping())
          return;
        hide();
        return;
      }
      if (selector === payload.selector && (payload.uid ?? null) === activeUid) {
        if (payload.feedback?.length && feedbackList) {
          feedbackList.replaceChildren();
          for (const t of payload.feedback) {
            const li = document.createElement("li");
            Object.assign(li.style, { margin: "2px 0", color: "#fcfaf5", wordBreak: "break-word" });
            li.textContent = t;
            feedbackList.append(li);
          }
        }
        return;
      }
      selector = payload.selector ?? null;
      activeUid = payload.uid ?? null;
      lockedTo = anchor;
      buildBody(payload);
      position(anchor);
      startWatchdog();
      onShow(anchor);
    };
    let wantsFocus = false;
    const doFocus = () => {
      if (!textarea)
        return;
      if (document.activeElement === el || document.activeElement === textarea)
        return;
      requestAnimationFrame(() => {
        if (textarea)
          textarea.focus({ preventScroll: true });
      });
    };
    const focusTextarea = () => {
      wantsFocus = true;
      doFocus();
    };
    el.addEventListener("mouseenter", () => {
      locked = true;
      if (textarea && document.activeElement !== textarea)
        textarea.focus();
    });
    el.addEventListener("mouseleave", () => {
      if (textarea && (textarea.value.length > 0 || document.activeElement === textarea))
        return;
      locked = false;
    });
    const anchorIsGone = () => {
      if (!lockedTo)
        return true;
      if (!lockedTo.isConnected)
        return true;
      const r = lockedTo.getBoundingClientRect();
      return r.width === 0 && r.height === 0;
    };
    const reposition = () => {
      if (el.style.display !== "block")
        return;
      if (anchorIsGone()) {
        hide();
        return;
      }
      position(lockedTo);
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    let watchdog = 0;
    const stopWatchdog = () => {
      if (watchdog) {
        cancelAnimationFrame(watchdog);
        watchdog = 0;
      }
    };
    let lastAnchorKey = "";
    const startWatchdog = () => {
      stopWatchdog();
      const tick = () => {
        if (el.style.display !== "block") {
          watchdog = 0;
          return;
        }
        if (anchorIsGone()) {
          hide();
          return;
        }
        const r = lockedTo.getBoundingClientRect();
        const key = `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}`;
        if (key !== lastAnchorKey) {
          lastAnchorKey = key;
          position(lockedTo);
        }
        watchdog = requestAnimationFrame(tick);
      };
      watchdog = requestAnimationFrame(tick);
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.style.display === "block") {
        hide();
      }
    }, true);
    return { show, hide, isLocked: () => locked || isTyping(), focusTextarea, startWatchdog, stopWatchdog };
  }
})();

//# debugId=AD51C3C1C16CE31664756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2RvbS50cyIsICJzcmMvdHlwZXMudHMiLCAic3JjL2x1Y2lkZS50cyIsICJzcmMvY29udGVudC1zY3JpcHQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gRE9NIGhlbHBlcnMgc2hhcmVkIGJ5IHRoZSBjb250ZW50IHNjcmlwdC4gUHVyZSBmdW5jdGlvbnMgd2hlcmUgcG9zc2libGUg4oCUXG4vLyBhbnkgRE9NLWJvdW5kIHN0YXRlIGxpdmVzIGluIHRoZSBjYWxsaW5nIG1vZHVsZS5cblxuaW1wb3J0IHR5cGUge0VudHJ5LCBSZWN0LCBNYXRjaGVkUnVsZSwgRnJhbWV3b3JrSW5mbywgQW5jZXN0b3IsIFZpZXdwb3J0LCBEb21NdXRhdGlvbn0gZnJvbSAnLi90eXBlcy50cyc7XG5cbi8vIEhvb2sgZm9yIHRoZSBjb250ZW50LXNjcmlwdC1vd25lZCBNdXRhdGlvbk9ic2VydmVyIGJ1ZmZlci4gU2V0IGJ5XG4vLyBjb250ZW50LXNjcmlwdC50cyBhdCBib290IHZpYSBgc2V0TXV0YXRpb25CdWZmZXJHZXR0ZXJgOyBudWxsYWJsZVxuLy8gYmVjYXVzZSBkb20udHMgaXMgYWxzbyBpbXBvcnRlZCBieSB0ZXN0cyAvIHN0YW5kYWxvbmUgaGFybmVzc2VzIHRoYXRcbi8vIGRvbid0IHJ1biBhbiBvYnNlcnZlci4gY2FwdHVyZUVudHJ5IHJlYWRzIHRoZSBtb3N0IHJlY2VudCAzIHJlY29yZHNcbi8vIGluIHRoZSA4LXNlY29uZCB3aW5kb3cgdmlhIHRoaXMgZ2V0dGVyICjCpzQuOCDigJQgcmVwcm8gY29udGV4dCkuXG5sZXQgbXV0YXRpb25CdWZmZXJHZXR0ZXI6ICgoKSA9PiBEb21NdXRhdGlvbltdKSB8IG51bGwgPSBudWxsO1xuZXhwb3J0IGNvbnN0IHNldE11dGF0aW9uQnVmZmVyR2V0dGVyID0gKGZuOiAoKSA9PiBEb21NdXRhdGlvbltdKTogdm9pZCA9PiB7XG4gIG11dGF0aW9uQnVmZmVyR2V0dGVyID0gZm47XG59O1xuXG4vLyAtLS0tIExpbWl0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IE1BWF9URVhUID0gMTQwO1xuY29uc3QgTUFYX1NOSVBQRVQgPSAyNjAwO1xuY29uc3QgTUFYX0FUVFIgPSAxNDA7XG5jb25zdCBNQVhfUlVMRVMgPSAxMjtcbmNvbnN0IE1BWF9QUkVWSUVXX0NTUyA9IDQyMDtcblxuLy8gLS0tLSBUaW55IHV0aWxpdGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBjYW5Fc2NhcGUgPSB0eXBlb2YgQ1NTICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQ1NTLmVzY2FwZSA9PT0gJ2Z1bmN0aW9uJztcbmV4cG9ydCBjb25zdCBlc2NhcGVDc3MgPSAodjogc3RyaW5nKTogc3RyaW5nID0+XG4gIGNhbkVzY2FwZSA/IENTUy5lc2NhcGUodikgOiBTdHJpbmcodikucmVwbGFjZSgvKFtcXFxcICM7PyUmLC4rKn4nOlwiIV4kW1xcXSgpPT58L0BdKS9nLCAnXFxcXCQxJyk7XG5cbmV4cG9ydCBjb25zdCB0cmltVGV4dCA9ICh2OiB1bmtub3duLCBtYXggPSBNQVhfVEVYVCk6IHN0cmluZyA9PlxuICBTdHJpbmcodiA/PyAnJykucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKS5zbGljZSgwLCBtYXgpO1xuXG5jb25zdCBzYWZlQ2FsbCA9IDxUPihmbjogKCkgPT4gVCwgZmFsbGJhY2s6IFQpOiBUID0+IHtcbiAgdHJ5IHsgcmV0dXJuIGZuKCk7IH0gY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbn07XG5cbmNvbnN0IHRvUG9zaXRpdmVJbnQgPSAodjogdW5rbm93bik6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBuID0gTnVtYmVyKHYpO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwID8gTWF0aC5yb3VuZChuKSA6IG51bGw7XG59O1xuXG5jb25zdCBhdHRyID0gKGVsOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgdHJpbVRleHQoZWwuZ2V0QXR0cmlidXRlKG5hbWUpLCAxMjApO1xuXG5leHBvcnQgY29uc3QgY29tcGFjdFRhcmdldCA9IChlbDogRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGxldCBvdXQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChlbC5pZCkgb3V0ICs9ICcjJyArIGVsLmlkO1xuICBpZiAoZWwuY2xhc3NMaXN0Py5sZW5ndGgpIHtcbiAgICBvdXQgKz0gJy4nICsgQXJyYXkuZnJvbShlbC5jbGFzc0xpc3QpLnNsaWNlKDAsIDQpLmpvaW4oJy4nKTtcbiAgfVxuICByZXR1cm4gdHJpbVRleHQob3V0LCAxODApO1xufTtcblxuLy8gLS0tLSBTZWxlY3RvciBidWlsZGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBEWU5BTUlDX0lEX1JFID0gL14ocmFkaXgtfGhlYWRsZXNzdWktfG11aS18YXJpYS18ZW1iZXJ8cmVhY3QtYXJpYXw6clswLTlhLXpdKzopL2k7XG5leHBvcnQgY29uc3QgaXNTdGFibGVJZCA9IChpZDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGlkIGlzIHN0cmluZyA9PlxuICBCb29sZWFuKGlkKSAmJiAhRFlOQU1JQ19JRF9SRS50ZXN0KGlkISkgJiYgIS9bOlxcc10vLnRlc3QoaWQhKSAmJiAhL15cXGQvLnRlc3QoaWQhKTtcblxuLy8gVGFpbHdpbmQgLyB1dGlsaXR5LUNTUyBjbGFzcyBub2lzZSArIENTUy1pbi1KUyBoYXNoIHByZWZpeGVzLiBBbnl0aGluZ1xuLy8gbWF0Y2hpbmcgdGhpcyBwcmVmaXgtc2V0IGlzIGZpbHRlcmVkIG91dCBvZiBzdGFibGVDbGFzc2VzKCkgc28gY3NzUGF0aCgpXG4vLyBwcmVmZXJzIHNlbWFudGljIGNsYXNzZXMuXG4vL1xuLy8gU291cmNlLW9mLXRydXRoIGZpbHRlcjpcbi8vICDigKIgVGFpbHdpbmQgdXRpbGl0eSBwcmVmaXhlcyAoZmxleCwgZ3JpZCwgdy0sIGgtLCB0cmFuc2l0aW9uLCBkdXJhdGlvbi0sIOKApilcbi8vICDigKIgUHNldWRvLXN0YXRlIHByZWZpeGVzIChob3ZlcjosIGZvY3VzOiwgc206LCBkYXJrOilcbi8vICDigKIgQ1NTLWluLUpTIGhhc2ggY2xhc3NlcyAoY3NzLSwgc2MtLCBlbW90aW9uLSwgY2hha3JhLSwganNzMTIzLCBtYWtlU3R5bGVzLSxcbi8vICAgIE11aUJveC0sIF9uZXh0LSwgLS0pIOKAlCBhZGRlZCAyMDI2IGZyb20gY3NzLXNlbGVjdG9yLWdlbmVyYXRvcidzXG4vLyAgICBgaWdub3JlR2VuZXJhdGVkQ2xhc3NOYW1lc2AgZGVmYXVsdHMuXG5jb25zdCBVVElMSVRZX0NMQVNTX1JFID1cbiAgL14oZmxleHxncmlkfGJsb2NrfGlubGluZXxoaWRkZW58cmVsYXRpdmV8YWJzb2x1dGV8Zml4ZWR8c3RpY2t5fHctfGgtfHAtfG0tfHB4LXxweS18cHQtfHBiLXxwbC18cHItfG14LXxteS18bXQtfG1iLXxtbC18bXItfGdhcC18c3BhY2UtfHRleHQtfGZvbnQtfGxlYWRpbmctfHRyYWNraW5nLXxiZy18Ym9yZGVyfHJvdW5kZWR8c2hhZG93fG9wYWNpdHl8Y3Vyc29yLXxzZWxlY3QtfHBvaW50ZXItfG92ZXJmbG93fHdoaXRlc3BhY2V8dHJ1bmNhdGV8aXRlbXMtfGp1c3RpZnktfGNvbnRlbnQtfHNlbGYtfHBsYWNlLXx6LXx0b3AtfGxlZnQtfHJpZ2h0LXxib3R0b20tfG1pbi18bWF4LXxhc3BlY3QtfG9iamVjdC18aW5zZXQtfG9yZGVyLXxjb2wtfHJvdy18Z2FwfGhvdmVyOnxmb2N1czp8YWN0aXZlOnxkaXNhYmxlZDp8c206fG1kOnxsZzp8eGw6fDJ4bDp8ZGFyazp8Zmlyc3R8bGFzdHxvZGR8ZXZlbnxncm91cHxwZWVyfHRyYW5zaXRpb258ZHVyYXRpb24tfGRlbGF5LXxlYXNlLXxhbmltYXRlLXx0cmFuc2Zvcm18c2NhbGUtfHJvdGF0ZS18dHJhbnNsYXRlLXxza2V3LXxvcmlnaW4tfHJpbmctfGRpdmlkZS18b3V0bGluZS18ZmlsbC18c3Ryb2tlLXxmcm9tLXx0by18dmlhLXxwbGFjZWhvbGRlci18Y2FyZXQtfGFjY2VudC18YXBwZWFyYW5jZS18YmFja2Ryb3AtfGNsaXAtfGNvbnRhaW4tfGRlY29yYXRpb24tfHVuZGVybGluZXxsaW5lLXxsaXN0LXx0YWJ1bGFyfG51bXN8cHJvc2V8bm90LXxtb3Rpb24tfGlzb2xhdGV8aXNvbGF0aW9ufHdpbGwtfGFudGlhbGlhc2VkfHN1YnBpeGVsLXxzci1vbmx5fGZsb2F0LXxjbGVhci18cmVzaXplLXxzY3JvbGwtfHNuYXAtfHRvdWNoLXxpbnZpc2libGV8dmlzaWJsZXxjc3MtfHNjLVthLXowLTldfGVtb3Rpb24tfGNoYWtyYS18anNzXFxkK3xtYWtlU3R5bGVzLXxNdWlCb3gtfF9uZXh0LXxNdWlCdXR0b25CYXNlLXzPgWRfX3xfX3dhYl98d2FiX3xwbHNtYy0pL2k7XG5cbmNvbnN0IHN0YWJsZUNsYXNzZXMgPSAoZWw6IEVsZW1lbnQsIG1heCA9IDIpOiBzdHJpbmdbXSA9PiB7XG4gIGlmICghZWwuY2xhc3NMaXN0KSByZXR1cm4gW107XG4gIGNvbnN0IGFsbCA9IEFycmF5LmZyb20oZWwuY2xhc3NMaXN0KTtcbiAgY29uc3Qgc3RhYmxlID0gYWxsLmZpbHRlcigoYykgPT4gIVVUSUxJVFlfQ0xBU1NfUkUudGVzdChjKSk7XG4gIGlmIChzdGFibGUubGVuZ3RoKSByZXR1cm4gc3RhYmxlLnNsaWNlKDAsIG1heCk7XG4gIHJldHVybiBhbGwuc2xpY2UoMCwgMSk7XG59O1xuXG5jb25zdCBpc1VuaXF1ZSA9IChzY29wZTogUGFyZW50Tm9kZSwgc2VsZWN0b3I6IHN0cmluZywgdGFyZ2V0OiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIHJldHVybiBtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSB0YXJnZXQ7XG4gIH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbn07XG5cbmNvbnN0IG93bkRlc2NyaXB0b3IgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICBsZXQgcyA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGMgPSBzdGFibGVDbGFzc2VzKGVsKTtcbiAgaWYgKGMubGVuZ3RoKSBzICs9ICcuJyArIGMubWFwKGVzY2FwZUNzcykuam9pbignLicpO1xuICByZXR1cm4gcztcbn07XG5cbi8vIEJ1aWxkIHRoZSBzaG9ydGVzdCBDU1Mgc2VsZWN0b3IgdGhhdCB1bmlxdWVseSBpZGVudGlmaWVzIGBlbGAgb24gdGhlIHBhZ2UuXG4vLyBTdHJhdGVneSAoZWFjaCBjYW5kaWRhdGUgdGVzdGVkIHdpdGggcXVlcnlTZWxlY3RvckFsbCBmb3IgdW5pcXVlbmVzcyk6XG4vL1xuLy8gICAxLiB0YWcuc2VtYW50aWNDbGFzcyDigJQgcGFnZS13aWRlIHVuaXF1ZSAoZS5nLiBgaGVhZGVyLnN0aWNreWApLlxuLy8gICAyLiAjc3RhYmxlQW5jZXN0b3JJZCB0YWcuc2VtYW50aWNDbGFzcyDigJQgaWYgYSBzdGFibGUtaWQgYW5jZXN0b3IgZXhpc3RzLlxuLy8gICAzLiBGdWxsIGRlc2NlbmRhbnQgcGF0aDsgVEhFTiBydW4gb3B0aW1pemUoKSDigJQgdHJ5IHJlbW92aW5nIGVhY2ggaW50ZXJpb3Jcbi8vICAgICAgc2VnbWVudCBvbmUgYXQgYSB0aW1lIGFuZCBrZWVwIHRoZSByZXN1bHQgaWYgaXQncyBzdGlsbCB1bmlxdWUuXG4vLyAgICAgIEluc3BpcmVkIGJ5IGFudG9ubWVkdi9maW5kZXIncyBvcHRpbWl6ZSBsb29wLiBEcm9wcyBlLmcuIGBib2R5ID4gbWFpbiA+XG4vLyAgICAgIHNlY3Rpb24ueCA+IGRpdi53cmFwID4gaDEuYnJhbmRgIHRvIGBtYWluID4gaDEuYnJhbmRgIHdoZW4gbWlkZGxlXG4vLyAgICAgIHNlZ21lbnRzIGRvbid0IGNvbnN0cmFpbiB1bmlxdWVuZXNzLlxuLy9cbi8vIEVtcGlyaWNhbGx5IChhdWRpdCBvbiB3cmFubmdsZS5jb20pIHRoaXMgZHJvcHMgdHlwaWNhbCBzZWxlY3RvciB0b2tlbnNcbi8vIGZyb20gfjcwIGNoYXJzIHRvIH4xNS0yNSBjaGFycyB3aXRob3V0IHNhY3JpZmljaW5nIHJlc29sdmFiaWxpdHkuXG5jb25zdCBwYXJ0c1RvU2VsZWN0b3IgPSAocGFydHM6IHN0cmluZ1tdLCBhbmNob3I6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgPT5cbiAgYW5jaG9yID8gYCR7YW5jaG9yfSAke3BhcnRzLmpvaW4oJyA+ICcpfWAgOiBwYXJ0cy5qb2luKCcgPiAnKTtcblxuY29uc3Qgb3B0aW1pemVQYXRoID0gKHBhcnRzOiBzdHJpbmdbXSwgYW5jaG9yOiBzdHJpbmcgfCBudWxsLCB0YXJnZXQ6IEVsZW1lbnQsIHNjb3BlOiBEb2N1bWVudCB8IFNoYWRvd1Jvb3QpOiBzdHJpbmdbXSA9PiB7XG4gIC8vIERvbid0IHRvdWNoIHRoZSBoZWFkICh0aGUgbGVhZiBlbGVtZW50IGRlc2NyaXB0b3IpIG9yLCBpZiB0aGVyZSdzIG5vXG4gIC8vIGFuY2hvciwgdGhlIHZlcnkgZmlyc3Qgc2VnbWVudCB0aGF0IGFuY2hvcnMgdGhlIHBhdGguIFRyeSByZW1vdmluZyBlYWNoXG4gIC8vIGludGVyaW9yIHNlZ21lbnQ7IGtlZXAgdGhlIHNob3J0ZXIgZm9ybSBpZiB0aGUgc2VsZWN0b3Igc3RpbGwgcmVzb2x2ZXNcbiAgLy8gdG8gYSB1bmlxdWUgdGFyZ2V0LlxuICBsZXQgYmVzdCA9IHBhcnRzO1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChpIDwgYmVzdC5sZW5ndGggLSAxKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gWy4uLmJlc3Quc2xpY2UoMCwgaSksIC4uLmJlc3Quc2xpY2UoaSArIDEpXTtcbiAgICBpZiAoY2FuZGlkYXRlLmxlbmd0aCA9PT0gMCkgeyBpKys7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGlzVW5pcXVlKHNjb3BlLCBwYXJ0c1RvU2VsZWN0b3IoY2FuZGlkYXRlLCBhbmNob3IpLCB0YXJnZXQpKSB7XG4gICAgICBiZXN0ID0gY2FuZGlkYXRlO1xuICAgICAgLy8gcmVzdGFydCBmcm9tIHN0YXJ0IG9mIHRyaW1tZWQgcGF0aFxuICAgICAgaSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3Q7XG59O1xuXG5leHBvcnQgY29uc3QgY3NzUGF0aCA9IChlbDogRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGlmIChpc1N0YWJsZUlkKGVsLmlkKSkgcmV0dXJuICcjJyArIGVzY2FwZUNzcyhlbC5pZCk7XG5cbiAgLy8gU2hhZG93LXJvb3RlZCBlbGVtZW50cyBhcmVuJ3QgcmVhY2hhYmxlIHZpYSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcmAsIHNvXG4gIC8vIHRoZSB1bmlxdWVuZXNzIGNoZWNrcyBtdXN0IHNjb3BlIHRvIHRoZSBvd25pbmcgcm9vdC4gT3RoZXJ3aXNlIGV2ZXJ5XG4gIC8vIHByb2JlIGZhbGxzIGJhY2sgdG8gYSBmdWxsIGRlc2NlbmRhbnQgcGF0aCB0aGF0IGNsaW1icyB0byBgYm9keWAg4oCUXG4gIC8vIHdoaWNoIGl0IGNhbiBuZXZlciByZWFjaCBiZWNhdXNlIG9mIHRoZSBzaGFkb3cgYm91bmRhcnkg4oCUIGFuZCB0aGVcbiAgLy8gc2VsZWN0b3IgZW5kcyB1cCBvdmVyLXNwZWNpZmllZCBvciBub25zZW5zZS5cbiAgY29uc3Qgcm9vdE5vZGUgPSBlbC5nZXRSb290Tm9kZSgpO1xuICBjb25zdCBjc3NTY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290ID0gcm9vdE5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdE5vZGUgOiBkb2N1bWVudDtcbiAgY29uc3Qgc2NvcGVCb3VuZGFyeTogTm9kZSA9IHJvb3ROb2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3ROb2RlIDogZG9jdW1lbnQuYm9keTtcblxuICAvLyBGaW5kIHRoZSBuZWFyZXN0IHN0YWJsZS1pZCBhbmNlc3RvciBhcyBhbiBhbmNob3IgY2FuZGlkYXRlLlxuICBsZXQgYW5jaG9ySWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgYW5jaG9yRWw6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICB3aGlsZSAoY3VyICYmIGN1ciAhPT0gc2NvcGVCb3VuZGFyeSkge1xuICAgIGlmIChpc1N0YWJsZUlkKGN1ci5pZCkpIHtcbiAgICAgIGFuY2hvcklkID0gJyMnICsgZXNjYXBlQ3NzKGN1ci5pZCk7XG4gICAgICBhbmNob3JFbCA9IGN1cjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuXG4gIGNvbnN0IG93biA9IG93bkRlc2NyaXB0b3IoZWwpO1xuXG4gIC8vIENhbmRpZGF0ZSAxOiBvd24gZGVzY3JpcHRvciBhbG9uZSwgaWYgaXQncyBwYWdlLXdpZGUgdW5pcXVlLlxuICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIG93biwgZWwpKSByZXR1cm4gb3duO1xuXG4gIC8vIENhbmRpZGF0ZSAyOiBhbmNob3IgKyBvd24gZGVzY3JpcHRvci5cbiAgaWYgKGFuY2hvcklkKSB7XG4gICAgY29uc3QgYzIgPSBgJHthbmNob3JJZH0gJHtvd259YDtcbiAgICBpZiAoaXNVbmlxdWUoYW5jaG9yRWwhLCBvd24sIGVsKSB8fCBpc1VuaXF1ZShjc3NTY29wZSwgYzIsIGVsKSkgcmV0dXJuIGMyO1xuICB9XG5cbiAgLy8gQ2FuZGlkYXRlIDIuNSDigJQgQVJJQS1hbmNob3JlZCBzZWxlY3RvcnMuIEJlZm9yZSBmYWxsaW5nIHRocm91Z2ggdG9cbiAgLy8gYnJpdHRsZSBgOm50aC1vZi10eXBlYCBjaGFpbnMgdGhlIHJvYXN0IGNhbGxlZCBvdXQgKMKnMi41KSwgdHJ5XG4gIC8vIGFuY2hvcmluZyBhdCBzZW1hbnRpY2FsbHktbmFtZWQgbWFya2VycyBhbiBMTE0gb3IgaHVtYW4gY2FuIHJlYWQ6XG4gIC8vXG4gIC8vICAg4oCiIHRoZSBlbGVtZW50J3Mgb3duIGFyaWEtbGFiZWwgLyByb2xlXG4gIC8vICAg4oCiIGEgbmVhcmJ5IGFuY2VzdG9yJ3MgYXJpYS1sYWJlbCAvIHJvbGVcbiAgLy9cbiAgLy8gU2VsZWN0b3JzIGxpa2UgYFthcmlhLWxhYmVsPVwiUGlwZWxpbmUgdHJlbmRcIl0gLnNwYXJrLXdyYXBgIGFyZVxuICAvLyBib3RoIHN0YWJsZS1hZ2FpbnN0LURPTS1zaHVmZmxlIEFORCBodW1hbi1yZWFkYWJsZSBpbiBhIHdheSB0aGF0XG4gIC8vIGBkaXYuc3RhdDpudGgtb2YtdHlwZSgxKSA+IGRpdi5zdGF0X19zcGFyazpudGgtb2YtdHlwZSg0KSA+IHNwYW5gIGlzXG4gIC8vIG5vdC4gQ2FwIHRoZSBjaGFpbiBkZXB0aCBzbyB3ZSBkb24ndCB3YWxrIHBhc3QgYSBtZWFuaW5nZnVsIGJvdW5kYXJ5LlxuICBjb25zdCBhcmlhUXVvdGVkID0gKHZhbDogc3RyaW5nKTogc3RyaW5nID0+ICdcIicgKyB2YWwucmVwbGFjZSgvW1xcXFxcIl0vZywgJ1xcXFwkJicpICsgJ1wiJztcbiAgY29uc3QgYXJpYVNlbGVjdG9yID0gKGU6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBjb25zdCBsYWJlbCA9IGUuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgaWYgKGxhYmVsICYmIGxhYmVsLmxlbmd0aCA+IDAgJiYgbGFiZWwubGVuZ3RoIDwgODApIHtcbiAgICAgIHJldHVybiBgW2FyaWEtbGFiZWw9JHthcmlhUXVvdGVkKGxhYmVsKX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIC8vIFRyeSBhbiBBUklBLWFuY2hvcmVkIHNlbGVjdG9yIGZvciBUSElTIGVsZW1lbnQgZmlyc3QuXG4gIGNvbnN0IG93bkFyaWEgPSBhcmlhU2VsZWN0b3IoZWwpO1xuICBpZiAob3duQXJpYSAmJiBpc1VuaXF1ZShjc3NTY29wZSwgb3duQXJpYSwgZWwpKSByZXR1cm4gb3duQXJpYTtcbiAgLy8gV2FsayB1cCB0byA0IGFuY2VzdG9ycyBhbmQgdHJ5IGBbYXJpYS1sYWJlbD1cIuKAplwiXSB0YWcuY2xzYC4gU3RvcCBhdCB0aGVcbiAgLy8gYW5jaG9yRWwgaWYgd2UgZm91bmQgb25lIOKAlCBhbnl0aGluZyBhYm92ZSBpcyBhbHJlYWR5IGNvdmVyZWQuXG4gIGxldCBhcmlhQ3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gIGxldCBkZXB0aCA9IDA7XG4gIHdoaWxlIChhcmlhQ3VyICYmIGRlcHRoIDwgNCAmJiBhcmlhQ3VyICE9PSBzY29wZUJvdW5kYXJ5ICYmIGFyaWFDdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgYSA9IGFyaWFTZWxlY3RvcihhcmlhQ3VyKTtcbiAgICBpZiAoYSkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YX0gJHtvd259YDtcbiAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwgY2FuZGlkYXRlLCBlbCkpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfVxuICAgIGFyaWFDdXIgPSBhcmlhQ3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgZGVwdGgrKztcbiAgfVxuXG4gIC8vIENhbmRpZGF0ZSAyLjYg4oCUIHJvbGUgKyBuYW1lIGFuY2hvci4gQVJJQS1vbmx5IGxhYmVscyBjYXVnaHQgYWJvdmU7IHRoaXNcbiAgLy8gdGllciBoYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZSBhbmNlc3RvciBoYXMgQk9USCBhIGByb2xlYCBhbmQgYW5cbiAgLy8gYGFyaWEtbGFiZWxgIChvciBgZGF0YS10ZXN0aWRgKS4gU2VsZWN0b3IgaXMgbW9yZSBzcGVjaWZpYyBhbmRcbiAgLy8gZG9lc24ndCByaXNrIGNvbGxpZGluZyB3aGVuIHR3byBsYWJlbHMgaGFwcGVuIHRvIG1hdGNoIGFjcm9zcyByb2xlcy5cbiAgY29uc3Qgcm9sZU5hbWVTZWxlY3RvciA9IChlOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgcm9sZSA9IGUuZ2V0QXR0cmlidXRlKCdyb2xlJyk7XG4gICAgY29uc3QgbGFiZWwgPSBlLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgIGlmIChyb2xlICYmIGxhYmVsICYmIGxhYmVsLmxlbmd0aCA8IDgwKSB7XG4gICAgICByZXR1cm4gYFtyb2xlPSR7YXJpYVF1b3RlZChyb2xlKX1dW2FyaWEtbGFiZWw9JHthcmlhUXVvdGVkKGxhYmVsKX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGxldCBybkN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBkZXB0aCA9IDA7XG4gIHdoaWxlIChybkN1ciAmJiBkZXB0aCA8IDQgJiYgcm5DdXIgIT09IHNjb3BlQm91bmRhcnkgJiYgcm5DdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgYSA9IHJvbGVOYW1lU2VsZWN0b3Iocm5DdXIpO1xuICAgIGlmIChhKSB7XG4gICAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHthfSAke293bn1gO1xuICAgICAgaWYgKGlzVW5pcXVlKGNzc1Njb3BlLCBjYW5kaWRhdGUsIGVsKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICB9XG4gICAgcm5DdXIgPSBybkN1ci5wYXJlbnRFbGVtZW50O1xuICAgIGRlcHRoKys7XG4gIH1cblxuICAvLyBDYW5kaWRhdGUgMi43IOKAlCB1bmlxdWUtY2xhc3MtYW5jZXN0b3IgYW5jaG9yICjCpzIuNSBzZWxlY3RvciBsYWRkZXIpLlxuICAvLyBXYWxrIGFuY2VzdG9ycyBsb29raW5nIGZvciBvbmUgd2hvc2UgY2xhc3MgY2hhaW4gKHZpYSBzdGFibGVDbGFzc2VzKVxuICAvLyBpcyB1bmlxdWUgb24gdGhlIHBhZ2U7IHVzZSBpdCBhcyBgLnVuaXF1ZS1jbGFzcyBvd25gLiBGaXhlcyB0aGUgY2FzZVxuICAvLyB3aGVyZSB0aGUgZWxlbWVudHMgYmV0d2VlbiB0aGUgY2FwdHVyZWQgbm9kZSBhbmQgdGhlIGRvY3VtZW50IGhhdmVcbiAgLy8gbm8gYXJpYS90ZXN0aWQvaWQsIGJ1dCBPTkUgb2YgdGhlbSBjYXJyaWVzIGEgbWVhbmluZ2Z1bCBzZW1hbnRpY1xuICAvLyBjbGFzcyAoYC5hdHRlbnRpb24tYmFubmVyYCwgYC5taXNzaW9uLXN0YXRzYCkuXG4gIGxldCB1Y0N1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBkZXB0aCA9IDA7XG4gIHdoaWxlICh1Y0N1ciAmJiBkZXB0aCA8IDYgJiYgdWNDdXIgIT09IHNjb3BlQm91bmRhcnkgJiYgdWNDdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgY2xzID0gc3RhYmxlQ2xhc3Nlcyh1Y0N1cik7XG4gICAgaWYgKGNscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGFuY0Rlc2NyaXB0b3IgPSBgJHt1Y0N1ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpfS4ke2Nscy5tYXAoZXNjYXBlQ3NzKS5qb2luKCcuJyl9YDtcbiAgICAgIC8vIGAuY2xzYCAod2l0aG91dCB0aGUgdGFnIHByZWZpeCkgaXMgc2hvcnRlciBhbmQgcmVhZHMgYmV0dGVyIHdoZW5cbiAgICAgIC8vIHRoZSBhbmNlc3RvcidzIGNsYXNzIGlzIHBhZ2UtdW5pcXVlIG9uIGl0cyBvd24uXG4gICAgICBjb25zdCBqdXN0Q2xzID0gJy4nICsgY2xzLm1hcChlc2NhcGVDc3MpLmpvaW4oJy4nKTtcbiAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwganVzdENscywgdWNDdXIpKSB7XG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2p1c3RDbHN9ICR7b3dufWA7XG4gICAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwgY2FuZGlkYXRlLCBlbCkpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgICB9XG4gICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGFuY0Rlc2NyaXB0b3IsIHVjQ3VyKSkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHthbmNEZXNjcmlwdG9yfSAke293bn1gO1xuICAgICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGNhbmRpZGF0ZSwgZWwpKSByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgfVxuICAgIH1cbiAgICB1Y0N1ciA9IHVjQ3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgZGVwdGgrKztcbiAgfVxuXG4gIC8vIENhbmRpZGF0ZSAzOiBmdWxsIGRlc2NlbmRhbnQgcGF0aCwgdGhlbiBvcHRpbWl6ZS5cbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGN1ciA9IGVsO1xuICB3aGlsZSAoY3VyICYmIGN1ci5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY3VyICE9PSBzY29wZUJvdW5kYXJ5KSB7XG4gICAgaWYgKGN1ciAhPT0gZWwgJiYgaXNTdGFibGVJZChjdXIuaWQpKSBicmVhaztcbiAgICBsZXQgcyA9IGN1ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGNscyA9IHN0YWJsZUNsYXNzZXMoY3VyKTtcbiAgICBpZiAoY2xzLmxlbmd0aCkgcyArPSAnLicgKyBjbHMubWFwKGVzY2FwZUNzcykuam9pbignLicpO1xuICAgIGNvbnN0IHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBjb25zdCBzYW1lVGFnID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoc2liKSA9PiBzaWIubm9kZU5hbWUgPT09IGN1ciEubm9kZU5hbWUpO1xuICAgICAgaWYgKHNhbWVUYWcubGVuZ3RoID4gMSkgcyArPSBgOm50aC1vZi10eXBlKCR7c2FtZVRhZy5pbmRleE9mKGN1cikgKyAxfSlgO1xuICAgIH1cbiAgICBwYXJ0cy51bnNoaWZ0KHMpO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIGlmICghcGFydHMubGVuZ3RoKSByZXR1cm4gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZVBhdGgocGFydHMsIGFuY2hvcklkLCBlbCwgY3NzU2NvcGUpO1xuICByZXR1cm4gcGFydHNUb1NlbGVjdG9yKG9wdGltaXplZCwgYW5jaG9ySWQpO1xufTtcblxuLy8gLS0tLSBOYW1pbmcsIHJvbGVzLCBhbmNlc3RvcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJvbGVzIHdob3NlIGFjY2Vzc2libGVOYW1lIGlzLCBwZXIgdGhlIEFjY05hbWUgYWxnb3JpdGhtLCB0aGUgcmVjdXJzaXZlXG4vLyBjb25jYXRlbmF0aW9uIG9mIGV2ZXJ5IGRlc2NlbmRhbnQncyBhY2Nlc3NpYmxlIHRleHQuIEZvciB0aGVzZSB0aGUgZmllbGRcbi8vIGJlY29tZXMgYSB1c2VsZXNzIDIwMC1jaGFyIGR1bXAgb2YgdGhlIHdob2xlIHN1YnRyZWUgKG9mdGVuIHRydW5jYXRlZFxuLy8gbWlkLXdvcmQpLiBXZSBPTkxZIHN1cmZhY2UgYW4gZXhwbGljaXQgYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZvclxuLy8gY29udGFpbmVyIHJvbGVzIOKAlCBvdGhlcndpc2UgbGVhdmUgaXQgZW1wdHkgYW5kIGxldCB0aGUgTExNIHJlYWQgdGhlXG4vLyBjaGlsZHJlbiBzZXBhcmF0ZWx5LlxuY29uc3QgQ09OVEFJTkVSX1JPTEVTID0gbmV3IFNldChbXG4gICdncm91cCcsICdyZWdpb24nLCAnbGlzdCcsICdsaXN0Ym94JywgJ2dyaWQnLCAnZ3JpZGNlbGwnLCAncm93Z3JvdXAnLFxuICAncm93JywgJ3RhYmxlJywgJ21haW4nLCAnbmF2aWdhdGlvbicsICdiYW5uZXInLCAnY29udGVudGluZm8nLFxuICAnY29tcGxlbWVudGFyeScsICd0YWJwYW5lbCcsICdhcnRpY2xlJywgJ3NlY3Rpb24nLCAnZG9jdW1lbnQnLFxuICAnZmVlZCcsICdmaWd1cmUnLCAnZm9ybScsXG5dKTtcblxuLy8gUmVzb2x2ZSB0ZXh0IHRoZSBhY2NuYW1lIGFsZ29yaXRobSBwdWxscyBmcm9tIHJlZmVyZW5jZWQgZWxlbWVudHMuIFVzZWRcbi8vIGZvciBib3RoIGBhcmlhLWxhYmVsbGVkYnlgIChwcmlvcml0eSkgYW5kIGA8bGFiZWwgZm9yPVwiaWRcIj5gIGFzc29jaWF0aW9uXG4vLyAoZm9ybS1jb250cm9sIGZhbGxiYWNrKS4gSWRzIGluIGlkcmVmcyBhcmUgc3BhY2Utc2VwYXJhdGVkOyBlYWNoIHJlZidzXG4vLyByZXNvbHZlZCB0ZXh0IGlzIGpvaW5lZCBieSBhIHNpbmdsZSBzcGFjZS5cbmNvbnN0IGNvbGxlY3RJZFJlZlRleHQgPSAocmVmczogc3RyaW5nLCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290KTogc3RyaW5nID0+IHtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaWQgb2YgcmVmcy5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBub2RlID0gc2NvcGUuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKG5vZGUpIHBhcnRzLnB1c2godHJpbVRleHQobm9kZS50ZXh0Q29udGVudCwgMTgwKSk7XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIH1cbiAgcmV0dXJuIHBhcnRzLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XG59O1xuXG5jb25zdCBhY2Nlc3NpYmxlTmFtZSA9IChlbDogRWxlbWVudCwgcm9sZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyA9PiB7XG4gIC8vIFByaW9yaXR5IGZvbGxvd3MgdGhlIGFjY25hbWUgYWxnb3JpdGhtIChzaW1wbGlmaWVkKTpcbiAgLy8gICAxLiBhcmlhLWxhYmVsbGVkYnkg4oCUIHJlc29sdmVkIHRleHQgb2YgZXZlcnkgcmVmZXJlbmNlZCBpZC5cbiAgLy8gICAyLiBhcmlhLWxhYmVsIOKAlCBkaXJlY3Qgc3RyaW5nLlxuICAvLyAgIDMuIEZvciBmb3JtIGNvbnRyb2xzOiBhc3NvY2lhdGVkIDxsYWJlbD4gKGVpdGhlciBgPGxhYmVsIGZvcj1JRD5gXG4gIC8vICAgICAgT1IgYW4gYW5jZXN0b3IgPGxhYmVsPiB0aGF0IHdyYXBzIHRoZSBjb250cm9sKS4gRXZlcnlcbiAgLy8gICAgICBmcmFtZXdvcmsgd2VhdGhlciBhcHAgcGFpcnMgdGhlIHNlYXJjaCBpbnB1dCB3aXRoIGFcbiAgLy8gICAgICB2aXN1YWxseS1oaWRkZW4gbGFiZWw7IHdpdGhvdXQgZm9sbG93aW5nIHRoZSBsaW5rIFBpbmNoR3JhYlxuICAvLyAgICAgIHJldHVybnMgYW4gZW1wdHkgYWNjZXNzaWJsZU5hbWUuXG4gIC8vICAgNC4gdGl0bGUgLyBhbHQgLyBwbGFjZWhvbGRlciAob25seSB3aGVuIG5vbmUgb2YgdGhlIGFib3ZlIGhpdCkuXG4gIC8vICAgNS4gdGV4dENvbnRlbnQgKHN1cHByZXNzZWQgZm9yIGNvbnRhaW5lciByb2xlcyB3aG9zZSBhY2NuYW1lXG4gIC8vICAgICAgd291bGQgb3RoZXJ3aXNlIGJlIGEgMjAwLWNoYXIgc3VidHJlZSBkdW1wKS5cbiAgY29uc3QgbGFiZWxsZWRieSA9IGF0dHIoZWwsICdhcmlhLWxhYmVsbGVkYnknKTtcbiAgaWYgKGxhYmVsbGVkYnkpIHtcbiAgICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgICBjb25zdCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290ID0gcm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgPyByb290IDogZG9jdW1lbnQ7XG4gICAgY29uc3QgdGV4dCA9IGNvbGxlY3RJZFJlZlRleHQobGFiZWxsZWRieSwgc2NvcGUpO1xuICAgIGlmICh0ZXh0KSByZXR1cm4gdHJpbVRleHQodGV4dCwgMTgwKTtcbiAgfVxuICBjb25zdCBhcmlhTGFiZWwgPSBhdHRyKGVsLCAnYXJpYS1sYWJlbCcpO1xuICBpZiAoYXJpYUxhYmVsKSByZXR1cm4gdHJpbVRleHQoYXJpYUxhYmVsLCAxODApO1xuXG4gIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaXNGb3JtQ29udHJvbCA9IHRhZyA9PT0gJ2lucHV0JyB8fCB0YWcgPT09ICdzZWxlY3QnIHx8IHRhZyA9PT0gJ3RleHRhcmVhJyB8fCB0YWcgPT09ICdidXR0b24nIHx8IHRhZyA9PT0gJ21ldGVyJyB8fCB0YWcgPT09ICdwcm9ncmVzcycgfHwgdGFnID09PSAnb3V0cHV0JztcbiAgaWYgKGlzRm9ybUNvbnRyb2wpIHtcbiAgICBpZiAoZWwuaWQpIHtcbiAgICAgIGNvbnN0IHJvb3QgPSBlbC5nZXRSb290Tm9kZSgpO1xuICAgICAgY29uc3Qgc2NvcGU6IERvY3VtZW50IHwgU2hhZG93Um9vdCA9IHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdCA6IGRvY3VtZW50O1xuICAgICAgbGV0IGxhYmVsRm9yOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgICB0cnkgeyBsYWJlbEZvciA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj1cIiR7ZXNjYXBlQ3NzKGVsLmlkKX1cIl1gKTsgfSBjYXRjaCB7IC8qIGludmFsaWQgaWQgKi8gfVxuICAgICAgaWYgKGxhYmVsRm9yKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0cmltVGV4dChsYWJlbEZvci50ZXh0Q29udGVudCwgMTgwKTtcbiAgICAgICAgaWYgKHRleHQpIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgbGFiZWxQYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZSAobGFiZWxQYXJlbnQpIHtcbiAgICAgIGlmIChsYWJlbFBhcmVudC50YWdOYW1lID09PSAnTEFCRUwnKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0cmltVGV4dChsYWJlbFBhcmVudC50ZXh0Q29udGVudCwgMTgwKTtcbiAgICAgICAgaWYgKHRleHQpIHJldHVybiB0ZXh0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxhYmVsUGFyZW50ID0gbGFiZWxQYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gIH1cblxuICBjb25zdCB0aXRsZUF0dHIgPSBhdHRyKGVsLCAndGl0bGUnKTtcbiAgaWYgKHRpdGxlQXR0cikgcmV0dXJuIHRyaW1UZXh0KHRpdGxlQXR0ciwgMTgwKTtcbiAgY29uc3QgYWx0QXR0ciA9IGF0dHIoZWwsICdhbHQnKTtcbiAgaWYgKGFsdEF0dHIpIHJldHVybiB0cmltVGV4dChhbHRBdHRyLCAxODApO1xuICBjb25zdCBwbGFjZWhvbGRlckF0dHIgPSBhdHRyKGVsLCAncGxhY2Vob2xkZXInKTtcbiAgaWYgKHBsYWNlaG9sZGVyQXR0cikgcmV0dXJuIHRyaW1UZXh0KHBsYWNlaG9sZGVyQXR0ciwgMTgwKTtcbiAgaWYgKHJvbGUgJiYgQ09OVEFJTkVSX1JPTEVTLmhhcyhyb2xlKSkgcmV0dXJuICcnO1xuXG4gIGlmICghaXNOYW1lRnJvbUNvbnRlbnQoZWwsIHRhZywgcm9sZSkpIHJldHVybiAnJztcbiAgcmV0dXJuIHRyaW1UZXh0KGVsLnRleHRDb250ZW50LCAxODApO1xufTtcblxuLy8gVGFncyB3aG9zZSBpbXBsaWNpdCByb2xlIGhhcyBcIk5hbWUgZnJvbTogY29udGVudHNcIiBpbiB0aGUgQVJJQSBzcGVjLlxuLy8gVGhlc2UgYXJlIGxlYWYtaXNoIG9yIG5hdHVyYWxseS1sYWJlbGVkLWJ5LWNoaWxkcmVuIGVsZW1lbnRzOyBjYXB0dXJpbmdcbi8vIG9uZSBtZWFucyB0aGUgdXNlciB3YW50cyB0aGUgcmVuZGVyZWQgdGV4dCBhcyB0aGUgbmFtZS5cbmNvbnN0IE5BTUVfRlJPTV9DT05URU5UX1RBR1MgPSBuZXcgU2V0KFtcbiAgJ2EnLCAnYnV0dG9uJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JyxcbiAgJ3N1bW1hcnknLCAndGgnLCAndGQnLCAnY2FwdGlvbicsICdmaWdjYXB0aW9uJywgJ2xlZ2VuZCcsICdsYWJlbCcsXG4gICdvcHRpb24nLCAnb3V0cHV0JywgJ2R0Jyxcbl0pO1xuLy8gRXhwbGljaXQgQVJJQSByb2xlcyBpbiBcIk5hbWUgZnJvbTogY29udGVudHNcIi5cbmNvbnN0IE5BTUVfRlJPTV9DT05URU5UX1JPTEVTID0gbmV3IFNldChbXG4gICdidXR0b24nLCAnY2VsbCcsICdjaGVja2JveCcsICdjb2x1bW5oZWFkZXInLCAnZ3JpZGNlbGwnLCAnaGVhZGluZycsXG4gICdsaW5rJywgJ21lbnVpdGVtJywgJ21lbnVpdGVtY2hlY2tib3gnLCAnbWVudWl0ZW1yYWRpbycsICdvcHRpb24nLFxuICAncmFkaW8nLCAncm93JywgJ3Jvd2hlYWRlcicsICdzd2l0Y2gnLCAndGFiJywgJ3Rvb2x0aXAnLCAndHJlZWl0ZW0nLFxuXSk7XG5jb25zdCBpc05hbWVGcm9tQ29udGVudCA9IChlbDogRWxlbWVudCwgdGFnOiBzdHJpbmcsIHJvbGU6IHN0cmluZyB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgaWYgKHJvbGUgJiYgTkFNRV9GUk9NX0NPTlRFTlRfUk9MRVMuaGFzKHJvbGUpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKE5BTUVfRlJPTV9DT05URU5UX1RBR1MuaGFzKHRhZykpIHJldHVybiB0cnVlO1xuICAvLyBJbmxpbmUgLyBwaHJhc2luZyB0YWdzIGFsc28gbGVnaXRpbWF0ZWx5IGdldCB0ZXh0Q29udGVudCBhcyB0aGVpclxuICAvLyBcIm5hbWVcIiDigJQgY2FwdHVyaW5nIGEgPHNwYW4+Q2xpY2s8L3NwYW4+IHNob3VsZCBzaG93IFwiQ2xpY2tcIiwgbm90IFwiXCIuXG4gIC8vIFdlIG9ubHkgYWxsb3cgdGhpcyB3aGVuIHRoZSBlbGVtZW50IGhhcyBPTkxZIHRleHQtbm9kZSBjaGlsZHJlbiAobm9cbiAgLy8gc3RydWN0dXJhbCBjaGlsZHJlbiksIHNvIGEgPHNwYW4+IHdyYXBwaW5nIHNldmVuIGNhcmRzIHN0aWxsIHJldHVybnNcbiAgLy8gZW1wdHkuXG4gIGNvbnN0IElOTElORV9QSFJBU0lORyA9IG5ldyBTZXQoWydzcGFuJywgJ2VtJywgJ3N0cm9uZycsICdiJywgJ2knLCAnbWFyaycsICdzbWFsbCcsICdjb2RlJywgJ2tiZCcsICdzYW1wJywgJ3ZhcicsICd0aW1lJywgJ2NpdGUnLCAncScsICdhYmJyJywgJ3N1YicsICdzdXAnXSk7XG4gIGlmIChJTkxJTkVfUEhSQVNJTkcuaGFzKHRhZykgJiYgIWVsLmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGltcGxpY2l0Um9sZSA9IChlbDogRWxlbWVudCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkgcmV0dXJuICdidXR0b24nO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSByZXR1cm4gJ3RleHRib3gnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSByZXR1cm4gJ3RleHRib3gnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkgcmV0dXJuICdsaXN0Ym94JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZWwuaHJlZikgcmV0dXJuICdsaW5rJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTExJRWxlbWVudCkgcmV0dXJuICdsaXN0aXRlbSc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxVTGlzdEVsZW1lbnQgfHwgZWwgaW5zdGFuY2VvZiBIVE1MT0xpc3RFbGVtZW50KSByZXR1cm4gJ2xpc3QnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVGFibGVFbGVtZW50KSByZXR1cm4gJ3RhYmxlJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTFRhYmxlQ2VsbEVsZW1lbnQpIHJldHVybiAnY2VsbCc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxUYWJsZVJvd0VsZW1lbnQpIHJldHVybiAncm93JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSByZXR1cm4gJ2Zvcm0nO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MUHJvZ3Jlc3NFbGVtZW50KSByZXR1cm4gJ3Byb2dyZXNzYmFyJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTE1ldGVyRWxlbWVudCkgcmV0dXJuICdtZXRlcic7XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgU0VNQU5USUNfVEFHUyA9IG5ldyBTZXQoWydtYWluJywgJ3NlY3Rpb24nLCAnYXJ0aWNsZScsICduYXYnLCAnaGVhZGVyJywgJ2Zvb3RlcicsICdhc2lkZScsICdmb3JtJywgJ3RhYmxlJywgJ3VsJywgJ29sJ10pO1xuXG5jb25zdCBjb21wb25lbnRSb290ID0gKGVsOiBFbGVtZW50KToge2NvbXBhY3Q6IHN0cmluZ30gfCBudWxsID0+IHtcbiAgbGV0IGN1cnJlbnQ6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgbGV0IGRlcHRoID0gMDtcbiAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY3VycmVudCAhPT0gZG9jdW1lbnQuYm9keSAmJiBkZXB0aCA8IDEyKSB7XG4gICAgY29uc3QgbWFya2VyID1cbiAgICAgIGN1cnJlbnQuaWQgfHxcbiAgICAgIGN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbXBvbmVudCcpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10ZXN0aWQnKSB8fFxuICAgICAgY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdCcpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jeScpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1xYScpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgncm9sZScpIHx8XG4gICAgICBTRU1BTlRJQ19UQUdTLmhhcyhjdXJyZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgIGlmIChtYXJrZXIpIHJldHVybiB7Y29tcGFjdDogY29tcGFjdFRhcmdldChjdXJyZW50KX07XG4gICAgaWYgKGN1cnJlbnQucGFyZW50RWxlbWVudCA9PT0gbnVsbCAmJiBjdXJyZW50LnBhcmVudE5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnROb2RlLmhvc3QgfHwgbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgZGVwdGgrKztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGFuY2VzdG9yQ2hhaW4gPSAoZWw6IEVsZW1lbnQsIGRlcHRoID0gNCk6IEFuY2VzdG9yW10gPT4ge1xuICBjb25zdCBvdXQ6IEFuY2VzdG9yW10gPSBbXTtcbiAgbGV0IGN1cnJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IGRvY3VtZW50LmJvZHkgJiYgaSA8IGRlcHRoKSB7XG4gICAgY29uc3QgaXRlbTogQW5jZXN0b3IgPSB7dGFnOiBjdXJyZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX07XG4gICAgaWYgKGlzU3RhYmxlSWQoY3VycmVudC5pZCkpIGl0ZW0uaWQgPSBjdXJyZW50LmlkO1xuICAgIGNvbnN0IHJvbGUgPSBhdHRyKGN1cnJlbnQsICdyb2xlJyk7XG4gICAgaWYgKHJvbGUpIGl0ZW0ucm9sZSA9IHJvbGU7XG4gICAgY29uc3QgdGlkID0gYXR0cihjdXJyZW50LCAnZGF0YS10ZXN0aWQnKSB8fCBhdHRyKGN1cnJlbnQsICdkYXRhLXRlc3QnKSB8fFxuICAgICAgYXR0cihjdXJyZW50LCAnZGF0YS1jeScpIHx8IGF0dHIoY3VycmVudCwgJ2RhdGEtcWEnKTtcbiAgICBpZiAodGlkKSBpdGVtLnRlc3RJZCA9IHRpZDtcbiAgICBjb25zdCBjbHMgPSBjdXJyZW50LmNsYXNzTGlzdCA/IEFycmF5LmZyb20oY3VycmVudC5jbGFzc0xpc3QpLnNsaWNlKDAsIDMpIDogW107XG4gICAgaWYgKGNscy5sZW5ndGgpIGl0ZW0uY2xhc3NlcyA9IGNscztcbiAgICBvdXQucHVzaChpdGVtKTtcbiAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnRFbGVtZW50O1xuICAgIGkrKztcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gLS0tLSBBdHRycyAvIHN0eWxlcyAvIG1hdGNoZWQgcnVsZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBBVFRSX0FMTE9XTElTVCA9IG5ldyBTZXQoW1xuICAnaHJlZicsICdzcmMnLCAnYWx0JywgJ3RpdGxlJywgJ3BsYWNlaG9sZGVyJywgJ25hbWUnLCAndHlwZScsICd2YWx1ZScsICd0YXJnZXQnLCAnZm9yJyxcbiAgJ2FyaWEtbGFiZWwnLCAnYXJpYS1sYWJlbGxlZGJ5JywgJ2FyaWEtZGVzY3JpYmVkYnknLCAnYXJpYS1jb250cm9scycsICdhcmlhLWV4cGFuZGVkJyxcbiAgJ2FyaWEtY2hlY2tlZCcsICdhcmlhLXNlbGVjdGVkJywgJ2FyaWEtaGFzcG9wdXAnLCAnYXJpYS1saXZlJywgJ2FyaWEtaGlkZGVuJywgJ3JvbGUnLFxuXSk7XG5jb25zdCBBVFRSX1BSRUZJWF9BTExPVyA9IFsnYXJpYS0nLCAnZGF0YS0nXTtcbmNvbnN0IEFUVFJfQkxPQ0tMSVNUID0gbmV3IFNldChbJ2NsYXNzJywgJ3N0eWxlJywgJ2lkJ10pO1xuXG4vLyBQZXItaW5wdXQtdHlwZSBmb3JtYXQgaGludHMgc28gYW4gTExNIGNvbnN1bWluZyB0aGUgZXhwb3J0IGRvZXNuJ3QgaGF2ZVxuLy8gdG8gaW5mZXIgdGhlIGV4cGVjdGVkIHNoYXBlLiBEaXJlY3QgcG9ydCBmcm9tIGJyb3dzZXItdXNlJ3Mgc2VyaWFsaXplci5cbmNvbnN0IElOUFVUX0ZPUk1BVF9ISU5UUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgZGF0ZTogJ1lZWVktTU0tREQnLFxuICAnZGF0ZXRpbWUtbG9jYWwnOiAnWVlZWS1NTS1ERFRISDptbScsXG4gIG1vbnRoOiAnWVlZWS1NTScsXG4gIHRpbWU6ICdISDptbScsXG4gIHdlZWs6ICdZWVlZLVd3dycsXG4gIG51bWJlcjogJ251bWVyaWMnLFxuICByYW5nZTogJ251bWVyaWMnLFxuICB0ZWw6ICdwaG9uZScsXG4gIGVtYWlsOiAnZW1haWwnLFxuICB1cmw6ICd1cmwnLFxuICBjb2xvcjogJyNycmdnYmInLFxufTtcblxuLy8gQXR0cnMgdGhhdCBhcmUgYWx3YXlzIHByb21vdGVkIHRvIHRvcC1sZXZlbCBlbnRyeSBmaWVsZHMgKGB0ZXN0SWRgLFxuLy8gYGFjY2Vzc2libGVOYW1lYCwgYHJvbGVgKS4gS2VlcGluZyB0aGVtIEFMU08gaW4gYGF0dHJzYCB3YXMgZHVwbGljYXRlXG4vLyBwYXlsb2FkIOKAlCBkcm9wIHRoZW0gaGVyZSBzbyB0aGUgY29uc3VtZXIgc2VlcyBvbmUgY2Fub25pY2FsIHNvdXJjZS5cbi8vIGBkYXRhLXRlc3RpZGAsIGBkYXRhLXRlc3RgLCBgZGF0YS1jeWAsIGBkYXRhLXFhYCBhbGwgZ2V0IHByb21vdGVkLlxuY29uc3QgQVRUUl9ERURVUF9BR0FJTlNUX1RPUF9MRVZFTCA9IG5ldyBTZXQoW1xuICAnZGF0YS10ZXN0aWQnLCAnZGF0YS10ZXN0JywgJ2RhdGEtY3knLCAnZGF0YS1xYScsXG4gICdhcmlhLWxhYmVsJywgJ3JvbGUnLCAndGl0bGUnLCAnYWx0Jyxcbl0pO1xuXG4vLyBSZWdleCBkZW55bGlzdHMgZm9yIGxpa2VseS1zZWNyZXQtYmVhcmluZyBzdHJpbmdzLiBNYXRjaCBhZ2FpbnN0IGF0dHJpYnV0ZVxuLy8gVkFMVUVTIOKAlCBpZiBhIHZhbHVlIGxvb2tzIGxpa2UgYSBKV1QsIGFuIE9BdXRoIGJlYXJlciwgb3IgYSBsb25nIHRva2VuXG4vLyBzYW5kd2ljaGVkIGluIGEgbm9uLWFsbG93bGlzdGVkIHNwb3QsIHdlIHJlZGFjdCByYXRoZXIgdGhhbiBzaGlwLlxuY29uc3QgSldUX1JFID0gL1xcYmV5SltBLVphLXowLTlfLV17MjAsfVxcLltBLVphLXowLTlfLV17MjAsfVxcLltBLVphLXowLTlfLV17MjAsfVxcYi9nO1xuLy8gQ29uc2VydmF0aXZlIGJlYXJlci10b2tlbiByZWdleDogMjQrIGNoYXJzIG9mIGJhc2U2NHVybC1pc2ggY29udGVudFxuLy8gd2hlcmUgdGhlIGF0dHJpYnV0ZSBuYW1lIHN0cm9uZ2x5IGltcGxpZXMgYSBzZWNyZXQuIEFwcGxpZWQgcGVyLWF0dHIuXG5jb25zdCBTRUNSRVRfQVRUUl9OQU1FX1JFID0gLyh0b2tlbnxzZWNyZXR8cGFzc3dvcmR8YXBpW18tXT9rZXl8YXV0aChvcml6YXRpb24pP3xjc3JmfHhzcmZ8c2Vzc2lvbikvaTtcbmNvbnN0IHJlZGFjdFNlY3JldHMgPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKFNFQ1JFVF9BVFRSX05BTUVfUkUudGVzdChuYW1lKSAmJiB2YWx1ZS5sZW5ndGggPiA4KSByZXR1cm4gJ1tyZWRhY3RlZDogbG9va3MtbGlrZS1zZWNyZXRdJztcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoSldUX1JFLCAnW3JlZGFjdGVkOiBqd3RdJyk7XG59O1xuXG5jb25zdCBwb3B1bGF0ZWRBdHRycyA9IChlbDogRWxlbWVudCk6IHthdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgaGludHM6IGltcG9ydCgnLi90eXBlcy50cycpLkVudHJ5SGludHMgfCB1bmRlZmluZWR9ID0+IHtcbiAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKCFlbC5hdHRyaWJ1dGVzKSByZXR1cm4ge2F0dHJzLCBoaW50czogdW5kZWZpbmVkfTtcbiAgbGV0IHZhbHVlTWFza2VkID0gZmFsc2U7XG4gIGZvciAoY29uc3QgYSBvZiBBcnJheS5mcm9tKGVsLmF0dHJpYnV0ZXMpKSB7XG4gICAgY29uc3QgbmFtZSA9IGEubmFtZTtcbiAgICBpZiAoIW5hbWUgfHwgQVRUUl9CTE9DS0xJU1QuaGFzKG5hbWUpKSBjb250aW51ZTtcbiAgICBpZiAoQVRUUl9ERURVUF9BR0FJTlNUX1RPUF9MRVZFTC5oYXMobmFtZSkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGFsbG93ZWQgPSBBVFRSX0FMTE9XTElTVC5oYXMobmFtZSkgfHwgQVRUUl9QUkVGSVhfQUxMT1cuc29tZSgocCkgPT4gbmFtZS5zdGFydHNXaXRoKHApKTtcbiAgICBpZiAoIWFsbG93ZWQpIGNvbnRpbnVlO1xuICAgIGxldCB2ID0gdHJpbVRleHQoYS52YWx1ZSwgTUFYX0FUVFIpO1xuICAgIC8vIFNlbnNpdGl2ZS1pbnB1dCByZWRhY3Rpb24uIEJleW9uZCBgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiPmAsIGFsc29cbiAgICAvLyBzdHJpcCB2YWx1ZXMgZm9yOiBoaWRkZW4gaW5wdXRzIChvZnRlbiBjYXJyeSBDU1JGL0pXVCBib290c3RyYXBzKSxcbiAgICAvLyBhbnkgaW5wdXQgd2hvc2UgYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIG1hcmtzIGl0IGFzIGEgcGF5bWVudC1cbiAgICAvLyBjYXJkIGZpZWxkIChgY2MtbnVtYmVyYCwgYGNjLWNzY2AsIGBjYy1leHAqYCksIG9yIGEgb25lLXRpbWVcbiAgICAvLyBjb2RlLiBUaGUgcm9hc3QgY2FsbGVkIHRoaXMgb3V0IHVuZGVyIFRILTAwMSAvIEQuNCDigJQgbmV2ZXIgc2hpcCBhXG4gICAgLy8gdG9rZW4gc2hhcGVkIGxpa2UgYSBjcmVkaXQtY2FyZCBvciBzZXNzaW9uIGJvb3RzdHJhcC5cbiAgICBpZiAobmFtZSA9PT0gJ3ZhbHVlJyAmJiBlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdikge1xuICAgICAgY29uc3QgdCA9IGVsLnR5cGU7XG4gICAgICBjb25zdCBhYyA9IChlbC5nZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScpIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3Qgc2Vuc2l0aXZlID0gdCA9PT0gJ3Bhc3N3b3JkJ1xuICAgICAgICB8fCB0ID09PSAnaGlkZGVuJ1xuICAgICAgICB8fCAvXihjYy0obnVtYmVyfGNzY3xleHAoLW1vbnRofC15ZWFyKT98bmFtZSl8b25lLXRpbWUtY29kZXxuZXctcGFzc3dvcmR8Y3VycmVudC1wYXNzd29yZCkkLy50ZXN0KGFjKTtcbiAgICAgIGlmIChzZW5zaXRpdmUpIHtcbiAgICAgICAgdiA9ICfigKLigKLigKLigKInO1xuICAgICAgICB2YWx1ZU1hc2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2KSB7XG4gICAgICBjb25zdCByZWRhY3RlZCA9IHJlZGFjdFNlY3JldHMobmFtZSwgdik7XG4gICAgICBpZiAocmVkYWN0ZWQgIT09IHYpIHsgdiA9IHJlZGFjdGVkOyB2YWx1ZU1hc2tlZCA9IHRydWU7IH1cbiAgICB9XG4gICAgaWYgKHYpIGF0dHJzW25hbWVdID0gdjtcbiAgfVxuICAvLyBDYXB0dXJlLXRpbWUgc3ludGhldGljIGhpbnRzIHNpdCBpbiB0aGVpciBvd24gYmFnIChub3QgbWl4ZWQgd2l0aCByZWFsXG4gIC8vIGF0dHJpYnV0ZXMpLiBQZXItaW5wdXQtdHlwZSBmb3JtYXQgaGVscHMgYW4gTExNIGtub3cgdGhlIGV4cGVjdGVkIHNoYXBlLlxuICBjb25zdCBoaW50czogaW1wb3J0KCcuL3R5cGVzLnRzJykuRW50cnlIaW50cyA9IHt9O1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgY29uc3QgZm10ID0gSU5QVVRfRk9STUFUX0hJTlRTW2VsLnR5cGVdO1xuICAgIGlmIChmbXQpIGhpbnRzLmZvcm1hdCA9IGZtdDtcbiAgfVxuICBpZiAodmFsdWVNYXNrZWQpIGhpbnRzLnZhbHVlTWFza2VkID0gdHJ1ZTtcbiAgcmV0dXJuIHthdHRycywgaGludHM6IE9iamVjdC5rZXlzKGhpbnRzKS5sZW5ndGggPyBoaW50cyA6IHVuZGVmaW5lZH07XG59O1xuXG5jb25zdCBOT0lTRV9WQUxVRVMgPSBuZXcgU2V0KFsnaW5pdGlhbCcsICdpbmhlcml0JywgJ3Vuc2V0JywgJ3JldmVydCcsICdyZXZlcnQtbGF5ZXInLCAnbm9ybWFsJywgJ2F1dG8nLCAnbm9uZScsICdzdGF0aWMnXSk7XG5jb25zdCBOT0lTRV9GT1JfS0VZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XG4gIHZpc2liaWxpdHk6IFsndmlzaWJsZSddLCBvcGFjaXR5OiBbJzEnXSwgb3ZlcmZsb3c6IFsndmlzaWJsZSddLFxuICBvdmVyZmxvd1g6IFsndmlzaWJsZSddLCBvdmVyZmxvd1k6IFsndmlzaWJsZSddLCBkaXNwbGF5OiBbJ2lubGluZScsICdibG9jayddLFxuICBtYXJnaW46IFsnMHB4J10sIHBhZGRpbmc6IFsnMHB4J10sXG4gIGJvcmRlcjogWycwcHggbm9uZSByZ2IoMCwgMCwgMCknLCAnMHB4IG5vbmUgcmdiYSgwLCAwLCAwLCAwKSddLFxuICBib3JkZXJSYWRpdXM6IFsnMHB4J10sXG4gIGJhY2tncm91bmRDb2xvcjogWydyZ2JhKDAsIDAsIDAsIDApJywgJ3RyYW5zcGFyZW50J10sXG4gIHBvaW50ZXJFdmVudHM6IFsnYXV0byddLFxuICAvLyBUaGUgcm9hc3QgY2FsbGVkIHRoZXNlIG91dCBhcyBkZWZhdWx0LXZhbHVlIG5vaXNlIHRoYXQgYXBwZWFycyBvblxuICAvLyBldmVyeSBlbnRyeTogdG9wL3JpZ2h0L2JvdHRvbS9sZWZ0IGRlZmF1bHQgdG8gMHB4IG9uIHJlbGF0aXZlXG4gIC8vIHBvc2l0aW9uaW5nLCBmbGV4RGlyZWN0aW9uL2ZsZXhXcmFwIGRlZmF1bHQgdG8gcm93L25vd3JhcCBvblxuICAvLyBub24tZmxleCBjb250YWluZXJzLCBhbmQgYHRyYW5zaXRpb246IGFsbGAgaXMgdGhlIHVuaXZlcnNhbC1yZXNldFxuICAvLyBzaWRlIGVmZmVjdCDigJQgbm9uZSBtZWFuaW5nZnVsIGFzIGNhcHR1cmVkIHBlci1lbGVtZW50LlxuICB0b3A6IFsnMHB4J10sIHJpZ2h0OiBbJzBweCddLCBib3R0b206IFsnMHB4J10sIGxlZnQ6IFsnMHB4J10sXG4gIGZsZXhEaXJlY3Rpb246IFsncm93J10sXG4gIGZsZXhXcmFwOiBbJ25vd3JhcCddLFxuICB0cmFuc2l0aW9uOiBbJ2FsbCcsICdhbGwgMHMgZWFzZSAwcyddLFxuICAvLyBTcGVjIGRlZmF1bHRzIGZvciBncmlkICsgZmxleCBhbGlnbm1lbnQuXG4gIGFsaWduSXRlbXM6IFsnc3RyZXRjaCddLCBqdXN0aWZ5Q29udGVudDogWydmbGV4LXN0YXJ0JywgJ25vcm1hbCddLFxuICAvLyB0ZXh0QWxpZ24gZGVmYXVsdCBpcyBgc3RhcnRgLiBVc2VmdWwgd2hlbiBleHBsaWNpdGx5IHNldDsgbm9pc2Ugb3RoZXJ3aXNlLlxuICB0ZXh0QWxpZ246IFsnc3RhcnQnXSxcbiAgdGV4dERlY29yYXRpb246IFsnbm9uZSBzb2xpZCByZ2IoMCwgMCwgMCknXSxcbn07XG5jb25zdCBpc01lYW5pbmdmdWwgPSAoazogc3RyaW5nLCB2OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogdiBpcyBzdHJpbmcgPT4ge1xuICBpZiAodiA9PSBudWxsIHx8IHYgPT09ICcnKSByZXR1cm4gZmFsc2U7XG4gIGlmIChOT0lTRV9WQUxVRVMuaGFzKHYpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAhTk9JU0VfRk9SX0tFWVtrXT8uaW5jbHVkZXModik7XG59O1xuXG5jb25zdCBTVFlMRV9LRVlTID0gW1xuICAnZm9udEZhbWlseScsICdmb250U2l6ZScsICdmb250V2VpZ2h0JywgJ2xpbmVIZWlnaHQnLCAnbGV0dGVyU3BhY2luZycsXG4gICd0ZXh0QWxpZ24nLCAndGV4dFRyYW5zZm9ybScsICd0ZXh0RGVjb3JhdGlvbicsICdjb2xvcicsXG4gICdwYWRkaW5nJywgJ21hcmdpbicsICd3aWR0aCcsICdoZWlnaHQnLCAnbWluV2lkdGgnLCAnbWluSGVpZ2h0JywgJ21heFdpZHRoJywgJ21heEhlaWdodCcsXG4gICdiYWNrZ3JvdW5kQ29sb3InLCAnYmFja2dyb3VuZEltYWdlJywgJ2JvcmRlcicsICdib3JkZXJSYWRpdXMnLFxuICAnZGlzcGxheScsICdwb3NpdGlvbicsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnLCAnekluZGV4JyxcbiAgJ2ZsZXhEaXJlY3Rpb24nLCAnYWxpZ25JdGVtcycsICdqdXN0aWZ5Q29udGVudCcsICdnYXAnLCAnZmxleFdyYXAnLFxuICAnZ3JpZFRlbXBsYXRlQ29sdW1ucycsICdncmlkVGVtcGxhdGVSb3dzJywgJ2dyaWRDb2x1bW4nLCAnZ3JpZFJvdycsXG4gICdib3hTaGFkb3cnLCAnb3BhY2l0eScsICdvdmVyZmxvdycsICdmaWx0ZXInLCAnYmFja2Ryb3BGaWx0ZXInLCAndHJhbnNmb3JtJyxcbiAgJ3RyYW5zaXRpb24nLCAnYW5pbWF0aW9uJywgJ2N1cnNvcicsICd2aXNpYmlsaXR5JywgJ3BvaW50ZXJFdmVudHMnLFxuXSBhcyBjb25zdDtcbmNvbnN0IFNUWUxFX0xJTUlUUzogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHtcbiAgZm9udEZhbWlseTogMjU2LCBiYWNrZ3JvdW5kSW1hZ2U6IDEwMDAsIGJveFNoYWRvdzogMTAwMCwgYm9yZGVyOiAyNTYsXG4gIGZpbHRlcjogNTEyLCBiYWNrZHJvcEZpbHRlcjogNTEyLCB0cmFuc2Zvcm06IDUxMiwgdHJhbnNpdGlvbjogNTEyLCBhbmltYXRpb246IDUxMixcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogMTAwMCwgZ3JpZFRlbXBsYXRlUm93czogMTAwMCxcbn07XG5cbi8vIFBpeGVsIHZhbHVlcyByZXBvcnRlZCBieSBnZXRDb21wdXRlZFN0eWxlIG9uIGhpZ2gtRFBSIGRpc3BsYXlzIGNvbWUgYmFja1xuLy8gYXQgc3VicGl4ZWwgcHJlY2lzaW9uIChgMTUuOTk4M3B4YCwgYDIxLjk5NjVweGApLiBUaGUgZnJhY3Rpb25hbCBkaWdpdHNcbi8vIGFyZSBhcml0aG1ldGljIG5vaXNlLCBub3QgbWVhbmluZ2Z1bCBsYXlvdXQgc2lnbmFsIOKAlCByb3VuZCB0byAxIGRlY2ltYWxcbi8vIGZvciByZWFkYWJpbGl0eS4gV2Ugb25seSByb3VuZCBzaW1wbGUgYDxmbG9hdD5weGAgdmFsdWVzOyBhbnl0aGluZyBtb3JlXG4vLyBjb21wbGV4IChjYWxjKCksIHNob3J0aGFuZCBwYWRkaW5nLCBldGMuKSBpcyBsZWZ0IGludGFjdC5cbmNvbnN0IFBYX1JFID0gL14tP1xcZCtcXC5cXGQrcHgkLztcbmNvbnN0IHJvdW5kUHggPSAodjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFQWF9SRS50ZXN0KHYpKSByZXR1cm4gdjtcbiAgY29uc3QgbiA9IHBhcnNlRmxvYXQodik7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobikgPyBgJHtNYXRoLnJvdW5kKG4gKiAxMCkgLyAxMH1weGAgOiB2O1xufTtcblxuLy8gU3R5bGUgcHJvcHMgd29ydGggZHVhbC1lbWl0dGluZyBib3RoIHRoZWlyIHJlc29sdmVkIChgcmdiKC4uLilgKSBhbmRcbi8vIGRlY2xhcmVkIChgdmFyKC0tdG9rZW4pYCkgZm9ybXMuIFRoZSByZXNvbHZlZCB2YWx1ZSBpcyB3aGF0IGFuIExMTVxuLy8gcmVhc29ucyBhYm91dCB2aXN1YWxseTsgdGhlIGRlY2xhcmVkIGZvcm0gaXMgd2hhdCB0aGUgdXNlciB3cm90ZSBpblxuLy8gQ1NTIC8gd2hhdCBhIGRlc2lnbmVyIHJlY29nbml6ZXMuIE9ubHkgbWVhbmluZ2Z1bCBmb3IgdG9rZW4tZHJpdmVuXG4vLyB0aGVtaW5nLCBzbyB3ZSBsaW1pdCB0aGUgZHVhbC1lbWl0IHRvIGNvbG9yLXNoYXBlZCBwcm9wZXJ0aWVzLlxuY29uc3QgVkFSX0RVQUxfRU1JVCA9IG5ldyBTZXQoWydjb2xvcicsICdiYWNrZ3JvdW5kQ29sb3InLCAnYm9yZGVyQ29sb3InXSk7XG5cbmNvbnN0IGVzc2VudGlhbFN0eWxlcyA9IChlbDogRWxlbWVudCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAoY29uc3QgayBvZiBTVFlMRV9LRVlTKSB7XG4gICAgY29uc3QgdiA9IChjcyBhcyBhbnkpW2tdO1xuICAgIGlmICghaXNNZWFuaW5nZnVsKGssIHYpKSBjb250aW51ZTtcbiAgICBvdXRba10gPSByb3VuZFB4KHRyaW1UZXh0KHYsIFNUWUxFX0xJTUlUU1trXSA/PyAxNDApKTtcbiAgfVxuICAvLyBEdWFsLWVtaXQgdGhlIG9yaWdpbmFsIGB2YXIoLS3igKYpYCBmb3JtIGZvciB0aGVtZS1kcml2ZW4gcHJvcGVydGllcy5cbiAgLy8gV2UgcHVsbCBmcm9tIHRoZSBpbmxpbmUgYHN0eWxlYCBhdHRyaWJ1dGUgZmlyc3QgKGNoZWFwZXN0KSwgdGhlbiB3YWxrXG4gIC8vIG1hdGNoZWRSdWxlcyBmb3Igb25lcyB3aG9zZSBkZWNsYXJlZCB0ZXh0IGNvbnRhaW5zIGEgYHZhcihgLiBUaGVcbiAgLy8gcmVzb2x2ZWQgdmFsdWUgYWxyZWFkeSBsaXZlcyBpbiBgb3V0W2tdYDsgd2UgYWRkIGEgYDxrZXk+VmFyYCBzaWJsaW5nLlxuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgIGZvciAoY29uc3QgayBvZiBWQVJfRFVBTF9FTUlUKSB7XG4gICAgICBpZiAoIW91dFtrXSkgY29udGludWU7XG4gICAgICAvLyBDU1NTdHlsZURlY2xhcmF0aW9uIHVzZXMga2ViYWItY2FzZSBpbiBgZ2V0UHJvcGVydHlWYWx1ZWAuXG4gICAgICBjb25zdCBkYXNoS2V5ID0gay5yZXBsYWNlKC9bQS1aXS9nLCAoYykgPT4gJy0nICsgYy50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGNvbnN0IGlubGluZSA9IGVsLnN0eWxlPy5nZXRQcm9wZXJ0eVZhbHVlKGRhc2hLZXkpPy50cmltKCk7XG4gICAgICBpZiAoaW5saW5lICYmIGlubGluZS5pbmNsdWRlcygndmFyKCcpKSB7XG4gICAgICAgIG91dFtgJHtrfVZhcmBdID0gdHJpbVRleHQoaW5saW5lLCAxNDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuY29uc3QgUFNFVURPX0tFWVMgPSBbJ2Rpc3BsYXknLCAncG9zaXRpb24nLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ2JhY2tncm91bmRDb2xvcicsICdiYWNrZ3JvdW5kSW1hZ2UnLCAnYm9yZGVyJywgJ2JvcmRlclJhZGl1cycsICdib3hTaGFkb3cnLCAndHJhbnNmb3JtJywgJ29wYWNpdHknLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0JywgJ3pJbmRleCddIGFzIGNvbnN0O1xuY29uc3QgcHNldWRvU3R5bGVzID0gKGVsOiBFbGVtZW50KTogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPT4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge307XG4gIGZvciAoY29uc3Qgd2hpY2ggb2YgWyc6OmJlZm9yZScsICc6OmFmdGVyJ10pIHtcbiAgICBjb25zdCBjcyA9IHNhZmVDYWxsKCgpID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCB3aGljaCksIG51bGwpO1xuICAgIGlmICghY3MpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjcy5jb250ZW50O1xuICAgIGlmICghY29udGVudCB8fCBjb250ZW50ID09PSAnbm9uZScgfHwgY29udGVudCA9PT0gJ25vcm1hbCcpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGJsb2NrOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge2NvbnRlbnQ6IHRyaW1UZXh0KGNvbnRlbnQsIDI1Nil9O1xuICAgIGZvciAoY29uc3QgayBvZiBQU0VVRE9fS0VZUykge1xuICAgICAgY29uc3QgdiA9IChjcyBhcyBhbnkpW2tdO1xuICAgICAgaWYgKGlzTWVhbmluZ2Z1bChrLCB2KSkgYmxvY2tba10gPSB0cmltVGV4dCh2LCBTVFlMRV9MSU1JVFNba10gPz8gMTQwKTtcbiAgICB9XG4gICAgb3V0W3doaWNoLnJlcGxhY2UoJzo6JywgJycpXSA9IGJsb2NrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBQc2V1ZG8tY2xhc3NlcyBzYWZlIGZvciBhbnkgdGFnLlxuY29uc3QgU1RBVEVTX0tFRVBfVU5JVkVSU0FMID0gWydob3ZlcicsICdmb2N1cycsICdmb2N1cy12aXNpYmxlJywgJ2ZvY3VzLXdpdGhpbicsICdhY3RpdmUnLCAndGFyZ2V0JywgJ3Zpc2l0ZWQnXSBhcyBjb25zdDtcbi8vIEZvcm0tc3RhdGUgcHNldWRvcy4gQUxMIGVsZW1lbnRzIHRlY2huaWNhbGx5IG1hdGNoIGA6dmFsaWRgIC8gYDppbnZhbGlkYFxuLy8gKHBlciBDU1Mgc3BlYyksIHNvIGNhcHR1cmluZyB0aGVtIG9uIGEgYDxidXR0b24+YCBvciBgPGRpdj5gIHByb2R1Y2VzXG4vLyBgc3RhdGVzLnZhbGlkOiB0cnVlYCBub2lzZSB0aGF0IGNvbmZ1c2VkIExMTXMgKFwidGhlIGJ1dHRvbiBpcyB2YWxpZD9cbi8vIHdoYXQgZG9lcyB0aGF0IG1lYW4/XCIpLiBPbmx5IGVtaXQgdGhlc2UgZm9yIGdlbnVpbmUgZm9ybS1jb250cm9sIHRhZ3MuXG5jb25zdCBTVEFURVNfS0VFUF9GT1JNID0gWydjaGVja2VkJywgJ2Rpc2FibGVkJywgJ3JlcXVpcmVkJywgJ29wdGlvbmFsJywgJ3JlYWQtb25seScsICdyZWFkLXdyaXRlJywgJ2luLXJhbmdlJywgJ291dC1vZi1yYW5nZScsICd2YWxpZCcsICdpbnZhbGlkJ10gYXMgY29uc3Q7XG5jb25zdCBGT1JNX1RBR1MgPSBuZXcgU2V0KFsnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJywgJ29wdGlvbicsICdmaWVsZHNldCcsICdvdXRwdXQnLCAncHJvZ3Jlc3MnLCAnbWV0ZXInXSk7XG4vLyB2MjogYXJyYXkgZm9ybS4gRWFzaWVyIGZvciBEdWNrREIgcXVlcmllcyAoYCdob3ZlcicgPSBBTlkoc3RhdGVzKWApIGFuZCBhXG4vLyBmZXcgYnl0ZXMgc2hvcnRlciBvbiB0aGUgd2lyZSB0aGFuIHRoZSBvYmplY3QtYXMtc2V0IHNoYXBlLlxuY29uc3QgcGlja1RydWVTdGF0ZXMgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBzIG9mIFNUQVRFU19LRUVQX1VOSVZFUlNBTCkge1xuICAgIHRyeSB7IGlmIChlbC5tYXRjaGVzKGA6JHtzfWApKSBvdXQucHVzaChzKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSBpbnZhbGlkICovIH1cbiAgfVxuICBpZiAoRk9STV9UQUdTLmhhcyhlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgZm9yIChjb25zdCBzIG9mIFNUQVRFU19LRUVQX0ZPUk0pIHtcbiAgICAgIHRyeSB7IGlmIChlbC5tYXRjaGVzKGA6JHtzfWApKSBvdXQucHVzaChzKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG5jb25zdCBTVFlMRV9JTlRFUkVTVFMgPSBbXG4gICdkaXNwbGF5JywgJ3Bvc2l0aW9uJywgJ3Zpc2liaWxpdHknLCAnb3ZlcmZsb3cnLCAnb3ZlcmZsb3dYJywgJ292ZXJmbG93WScsXG4gICdib3hTaXppbmcnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ21pbldpZHRoJywgJ21pbkhlaWdodCcsICdtYXhXaWR0aCcsICdtYXhIZWlnaHQnLFxuICAnbWFyZ2luJywgJ3BhZGRpbmcnLCAnYm9yZGVyV2lkdGgnLCAnYm9yZGVyVG9wV2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmFkaXVzJywgJ2NvbG9yJywgJ2JhY2tncm91bmRDb2xvcicsXG4gICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ2ZvbnRXZWlnaHQnLCAnbGluZUhlaWdodCcsICd0ZXh0QWxpZ24nLCAndGV4dERlY29yYXRpb24nLFxuICAnb3BhY2l0eScsICd0cmFuc2Zvcm0nLCAndHJhbnNpdGlvbicsICdhbmltYXRpb24nLFxuXSBhcyBjb25zdDtcblxuLy8gVW5pdmVyc2FsIHNlbGVjdG9ycyBhbmQgQG1lZGlhIHByaW50IGJsb2NrcyBhcmUgcHJlc2VudCBvbiBldmVyeSBjYXB0dXJlZFxuLy8gZWxlbWVudCBhY3Jvc3MgYm90aCBQbGFzbWljIGFuZCB0aGUgV3Jhbm5nbGUgY29uc29sZS4gVGhleSBuZXZlciBleHBsYWluXG4vLyB3aGF0IG1ha2VzIGEgU1BFQ0lGSUMgZWxlbWVudCBsb29rIHRoZSB3YXkgaXQgZG9lcywgc28gdGhleSdyZSBwdXJlXG4vLyBub2lzZSDigJQgfjIxJSBvZiB0b3RhbCBwYXlsb2FkIGJ5dGVzIHBlciB0aGUgcm9hc3QgbWVhc3VyZW1lbnQuXG5jb25zdCBpc0ZpbHRlcmFibGVTZWxlY3RvciA9IChzZWw6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCB0cmltbWVkID0gc2VsLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCk7XG4gIGlmICh0cmltbWVkID09PSAnKicpIHJldHVybiB0cnVlO1xuICBpZiAodHJpbW1lZCA9PT0gJyosIDo6YmVmb3JlLCA6OmFmdGVyJykgcmV0dXJuIHRydWU7XG4gIGlmICh0cmltbWVkID09PSAnOjpiZWZvcmUsIDo6YWZ0ZXIsIConKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgY29sbGVjdE1hdGNoZWRSdWxlcyA9IChlbDogRWxlbWVudCk6IE1hdGNoZWRSdWxlW10gPT4ge1xuICBjb25zdCBydWxlczogTWF0Y2hlZFJ1bGVbXSA9IFtdO1xuICBjb25zdCBtZWRpYVN0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBwdXNoUnVsZSA9IChydWxlOiBDU1NTdHlsZVJ1bGUpOiBib29sZWFuID0+IHtcbiAgICB0cnkgeyBpZiAoIWVsLm1hdGNoZXMocnVsZS5zZWxlY3RvclRleHQpKSByZXR1cm4gdHJ1ZTsgfSBjYXRjaCB7IHJldHVybiB0cnVlOyB9XG4gICAgaWYgKGlzRmlsdGVyYWJsZVNlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gRHJvcCBAbWVkaWEgcHJpbnQgYmxvY2tzIOKAlCBjYXB0dXJlcyBhcmUgYWx3YXlzIGZvciB0aGUgc2NyZWVuIHZpZXcuXG4gICAgY29uc3QgbWVkaWFKb2luZWQgPSBtZWRpYVN0YWNrLmpvaW4oJyAmJiAnKTtcbiAgICBpZiAoL1xcYnByaW50XFxiLy50ZXN0KG1lZGlhSm9pbmVkKSAmJiAhL1xcYnNjcmVlblxcYi8udGVzdChtZWRpYUpvaW5lZCkpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGRlY2xhcmVkOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIFNUWUxFX0lOVEVSRVNUUykge1xuICAgICAgY29uc3QgdiA9IHJ1bGUuc3R5bGU/LmdldFByb3BlcnR5VmFsdWUocCk7XG4gICAgICBpZiAodikgZGVjbGFyZWRbcF0gPSB0cmltVGV4dCh2LCAxNDApO1xuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGRlY2xhcmVkKS5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIC8vIEEgcnVsZSBjYW4gTUFUQ0ggdGhlIHNlbGVjdG9yIHdpdGhvdXQgYmVpbmcgQUNUSVZFIGlmIGl0IGxpdmVzXG4gICAgLy8gaW5zaWRlIGFuIHVubWF0Y2hlZCBAbWVkaWEgcXVlcnkuIFRlc3Qgd2l0aCBtYXRjaE1lZGlhIHNvXG4gICAgLy8gcmVjZWl2ZXJzIGtub3cgd2hpY2ggcnVsZXMgc2hhcGVkIHRoZSBjYXB0dXJlZCB2aWV3cG9ydCB2cy5cbiAgICAvLyB3aGljaCB3b3VsZCBzaGFwZSBhIGRpZmZlcmVudCBvbmUgKGUuZy4gbW9iaWxlIHJ1bGVzIGNhcHR1cmVkXG4gICAgLy8gb24gZGVza3RvcCkuXG4gICAgY29uc3QgbWVkaWFBY3RpdmUgPSBtZWRpYVN0YWNrLmxlbmd0aCA9PT0gMFxuICAgICAgPyB0cnVlXG4gICAgICA6ICgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gbWVkaWFTdGFjayBqb2lucyBtdWx0aXBsZSBuZXN0ZWQgQG1lZGlhIOKAlCBhbGwgbXVzdCBtYXRjaC5cbiAgICAgICAgICBmb3IgKGNvbnN0IGNvbmQgb2YgbWVkaWFTdGFjaykge1xuICAgICAgICAgICAgY29uc3QgcmF3Q29uZCA9IGNvbmQucmVwbGFjZSgvXkBtZWRpYVxccyovLCAnJyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoTWVkaWEocmF3Q29uZCkubWF0Y2hlcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICAgIH0pKCk7XG4gICAgY29uc3QgcnVsZUVudHJ5OiBNYXRjaGVkUnVsZSA9IHtcbiAgICAgIHNlbGVjdG9yOiBydWxlLnNlbGVjdG9yVGV4dCxcbiAgICAgIGRlY2xhcmF0aW9uczogZGVjbGFyZWQsXG4gICAgICAuLi4obWVkaWFTdGFjay5sZW5ndGggPyB7bWVkaWE6IG1lZGlhSm9pbmVkfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChtZWRpYVN0YWNrLmxlbmd0aCkgcnVsZUVudHJ5Lm1lZGlhQWN0aXZlID0gbWVkaWFBY3RpdmU7XG4gICAgcnVsZXMucHVzaChydWxlRW50cnkpO1xuICAgIHJldHVybiBydWxlcy5sZW5ndGggPCBNQVhfUlVMRVM7XG4gIH07XG4gIGNvbnN0IHdhbGsgPSAoc2hlZXQ6IENTU1N0eWxlU2hlZXQgfCBudWxsLCBsaXN0OiBDU1NSdWxlTGlzdCk6IHZvaWQgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGggJiYgcnVsZXMubGVuZ3RoIDwgTUFYX1JVTEVTOyBpKyspIHtcbiAgICAgIGNvbnN0IHJ1bGUgPSBsaXN0W2ldO1xuICAgICAgaWYgKCFydWxlIHx8IHR5cGVvZiBydWxlLnR5cGUgIT09ICdudW1iZXInKSBjb250aW51ZTtcbiAgICAgIGlmIChydWxlLnR5cGUgPT09IENTU1J1bGUuU1RZTEVfUlVMRSkge1xuICAgICAgICBpZiAoIXB1c2hSdWxlKHJ1bGUgYXMgQ1NTU3R5bGVSdWxlKSkgYnJlYWs7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5NRURJQV9SVUxFIHx8IHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5TVVBQT1JUU19SVUxFKSB7XG4gICAgICAgIGNvbnN0IGNvbmQgPSBTdHJpbmcoKHJ1bGUgYXMgQ1NTTWVkaWFSdWxlKS5jb25kaXRpb25UZXh0IHx8ICcnKS50cmltKCk7XG4gICAgICAgIGlmIChjb25kKSBtZWRpYVN0YWNrLnB1c2goY29uZCk7XG4gICAgICAgIGlmICgocnVsZSBhcyBDU1NHcm91cGluZ1J1bGUpLmNzc1J1bGVzKSB3YWxrKHNoZWV0LCAocnVsZSBhcyBDU1NHcm91cGluZ1J1bGUpLmNzc1J1bGVzKTtcbiAgICAgICAgaWYgKGNvbmQpIG1lZGlhU3RhY2sucG9wKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5JTVBPUlRfUlVMRSAmJiAocnVsZSBhcyBDU1NJbXBvcnRSdWxlKS5zdHlsZVNoZWV0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaW0gPSAocnVsZSBhcyBDU1NJbXBvcnRSdWxlKS5zdHlsZVNoZWV0O1xuICAgICAgICAgIGlmIChpbT8uY3NzUnVsZXMpIHdhbGsoaW0sIGltLmNzc1J1bGVzKTtcbiAgICAgICAgfSBjYXRjaCB7IC8qIENPUlMtYmxvY2tlZCBzaGVldCAqLyB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmb3IgKGNvbnN0IHNoZWV0IG9mIEFycmF5LmZyb20oZG9jdW1lbnQuc3R5bGVTaGVldHMgfHwgW10pKSB7XG4gICAgY29uc3QgbSA9IHNoZWV0Lm1lZGlhPy5tZWRpYVRleHQ7XG4gICAgaWYgKG0pIG1lZGlhU3RhY2sucHVzaChgQG1lZGlhICR7bX1gKTtcbiAgICBsZXQgY3NzOiBDU1NSdWxlTGlzdCB8IHVuZGVmaW5lZDtcbiAgICB0cnkgeyBjc3MgPSBzaGVldC5jc3NSdWxlczsgfSBjYXRjaCB7IGlmIChtKSBtZWRpYVN0YWNrLnBvcCgpOyBjb250aW51ZTsgfVxuICAgIGlmIChjc3MpIHdhbGsoc2hlZXQsIGNzcyk7XG4gICAgaWYgKG0pIG1lZGlhU3RhY2sucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHJ1bGVzO1xufTtcblxuLy8gRXZlbnQtaGFuZGxlciBwcm9iZXMuIFJldHVybnMgYSBmbGF0IGB7IG9uQ2xpY2s6IFwiaGFuZGxlck5hbWVcIiwg4oCmIH1gIG1hcFxuLy8gcHVsbGVkIGZyb20gd2hhdGV2ZXIgZnJhbWV3b3JrIHdpcmVkIHRoZSBoYW5kbGVyLiBUaGUgbWFwIGFuc3dlcnNcbi8vIFwid2hpY2ggaGFuZGxlciByYW4gd2hlbiB0aGlzIGZpcmVkP1wiIHdpdGhvdXQgZm9yY2luZyBhbiBMTE0gdG8gZ3JlcFxuLy8gdGhlIGNvZGViYXNlLiBUaHJlZSBzb3VyY2VzIHN0YWNrZWQ6XG4vL1xuLy8gICAxLiBSZWFjdCBmaWJlcnMg4oCUIGBfX3JlYWN0UHJvcHMkPGtleT4ub25YYCAoZnVuY3Rpb24gd2hvc2UgYC5uYW1lYFxuLy8gICAgICBpcyB0aGUgc291cmNlIG5hbWUgaW4gZGV2IGJ1aWxkcywgbWluaWZpZWQgaW4gcHJvZCkuXG4vLyAgIDIuIFZ1ZSAzIHZub2RlIHByb3BzIOKAlCBgX192dWVQYXJlbnRDb21wb25lbnQudm5vZGUucHJvcHMub25YYFxuLy8gICAgICAoVnVlIDMgbm9ybWFsaXplcyBgQGNsaWNrYCB0ZW1wbGF0ZSBhdHRycyB0byBgb25DbGlja2Agb24gdGhlXG4vLyAgICAgIGNvbXBvbmVudCB2bm9kZSkuXG4vLyAgIDMuIElubGluZSBgb24qYCBIVE1MIGF0dHJpYnV0ZXMg4oCUIHRoZSBsZWdhY3kgYG9uY2xpY2s9XCLigKZcImAgZm9ybS5cbi8vICAgICAgQ2FwdHVyZWQgdmFsdWUgaXMgdGhlIHNvdXJjZSBzdHJpbmcgd2l0aCB3aGl0ZXNwYWNlIGNvbGxhcHNlZCxcbi8vICAgICAgY2FwcGVkIHRvIDIwMCBjaGFycyAoZnVsbC1zY3JpcHQgaW5saW5lIGhhbmRsZXJzIGdldCB0cnVuY2F0ZWQpLlxuLy9cbi8vIEVhY2ggc291cmNlIGNhbiBjb250cmlidXRlOyBsYXRlciBzb3VyY2VzIGRvbid0IG92ZXJ3cml0ZSBlYXJsaWVyIG9uZXNcbi8vIOKAlCBhIFJlYWN0IGhhbmRsZXIgYmVhdHMgYW4gaW5saW5lIG9uZSB3aGVuIGJvdGggZXhpc3Qgb24gdGhlIG5vZGUuXG5jb25zdCBIQU5ETEVSX0tFWVMgPSBbJ29uQ2xpY2snLCAnb25Nb3VzZURvd24nLCAnb25TdWJtaXQnLCAnb25DaGFuZ2UnLCAnb25LZXlEb3duJywgJ29uRm9jdXMnLCAnb25CbHVyJywgJ29uSW5wdXQnXSBhcyBjb25zdDtcbmNvbnN0IElOTElORV9PTl9BVFRSUyA9IFsnb25jbGljaycsICdvbm1vdXNlZG93bicsICdvbnN1Ym1pdCcsICdvbmNoYW5nZScsICdvbmtleWRvd24nLCAnb25mb2N1cycsICdvbmJsdXInLCAnb25pbnB1dCddIGFzIGNvbnN0O1xuXG5jb25zdCByZWFjdEV2ZW50TmFtZXMgPSAoZWw6IEVsZW1lbnQsIG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHZvaWQgPT4ge1xuICBjb25zdCBwcm9wc0tleSA9IE9iamVjdC5rZXlzKGVsKS5maW5kKChrKSA9PiBrLnN0YXJ0c1dpdGgoJ19fcmVhY3RQcm9wcyQnKSk7XG4gIGlmICghcHJvcHNLZXkpIHJldHVybjtcbiAgY29uc3QgcHJvcHMgPSAoZWwgYXMgYW55KVtwcm9wc0tleV0gYXMgUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZDtcbiAgaWYgKCFwcm9wcykgcmV0dXJuO1xuICBmb3IgKGNvbnN0IGsgb2YgSEFORExFUl9LRVlTKSB7XG4gICAgaWYgKG91dFtrXSkgY29udGludWU7XG4gICAgY29uc3QgZm4gPSBwcm9wc1trXTtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBuID0gZm4ubmFtZSAmJiBmbi5uYW1lICE9PSAnJyA/IGZuLm5hbWUgOiAnPGFub255bW91cz4nO1xuICAgICAgb3V0W2tdID0gdHJpbVRleHQobiwgODApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgdnVlRXZlbnROYW1lcyA9IChlbDogRWxlbWVudCwgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCA9PiB7XG4gIC8vIFZ1ZSAzOiBldmVudHMgbGl2ZSBvbiB0aGUgcGFyZW50LWNvbXBvbmVudCB2bm9kZSdzIHByb3BzIGFzIGBvbkNsaWNrYCxcbiAgLy8gYG9uTXlFdmVudGAsIGV0Yy4gVnVlIDI6IGBlbC5fX3Z1ZV9fLiRsaXN0ZW5lcnNgIGhhZCB0aGVtOyB3ZSBzbmlmZlxuICAvLyBib3RoIHNoYXBlcy4gQ2hlYXAgZmFsbHRocm91Z2ggd2hlbiBuZWl0aGVyIGlzIHByZXNlbnQuXG4gIGNvbnN0IHY6IGFueSA9IChlbCBhcyBhbnkpLl9fdnVlUGFyZW50Q29tcG9uZW50IHx8IChlbCBhcyBhbnkpLl9fdnVlX187XG4gIGlmICghdikgcmV0dXJuO1xuICBjb25zdCBwcm9wcyA9IHYudm5vZGU/LnByb3BzIHx8IHYuJG9wdGlvbnM/LnByb3BzRGF0YSB8fCB2LiRsaXN0ZW5lcnM7XG4gIGlmICghcHJvcHMgfHwgdHlwZW9mIHByb3BzICE9PSAnb2JqZWN0JykgcmV0dXJuO1xuICBmb3IgKGNvbnN0IGsgb2YgSEFORExFUl9LRVlTKSB7XG4gICAgaWYgKG91dFtrXSkgY29udGludWU7XG4gICAgY29uc3QgZm4gPSBwcm9wc1trXSB8fCBwcm9wc1trLnRvTG93ZXJDYXNlKCldO1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG4gPSBmbi5uYW1lICYmIGZuLm5hbWUgIT09ICcnID8gZm4ubmFtZSA6ICc8dnVlLWFub255bW91cz4nO1xuICAgICAgb3V0W2tdID0gdHJpbVRleHQobiwgODApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgaW5saW5lRXZlbnROYW1lcyA9IChlbDogRWxlbWVudCwgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCA9PiB7XG4gIGZvciAoY29uc3QgYXR0ciBvZiBJTkxJTkVfT05fQVRUUlMpIHtcbiAgICBjb25zdCBjYW1lbCA9ICdvbicgKyBhdHRyLmNoYXJBdCgyKS50b1VwcGVyQ2FzZSgpICsgYXR0ci5zbGljZSgzKTtcbiAgICBpZiAob3V0W2NhbWVsXSkgY29udGludWU7XG4gICAgY29uc3QgdiA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICBpZiAodikgb3V0W2NhbWVsXSA9IHRyaW1UZXh0KHYsIDIwMCk7XG4gIH1cbn07XG5cbmNvbnN0IGNvbGxlY3RFdmVudE5hbWVzID0gKGVsOiBFbGVtZW50KTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwgPT4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmVhY3RFdmVudE5hbWVzKGVsLCBvdXQpO1xuICB2dWVFdmVudE5hbWVzKGVsLCBvdXQpO1xuICBpbmxpbmVFdmVudE5hbWVzKGVsLCBvdXQpO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gXCJCZWhhdmlvclwiIGF0dHJpYnV0ZXMg4oCUIGh0bXgsIFN0aW11bHVzLCBBbHBpbmUsIFR1cmJvLiBTZXJ2ZXItcmVuZGVyZWRcbi8vIGFwcHMgZG9uJ3QgaGF2ZSBSZWFjdCBmaWJlcnM7IHRoZSB3aXJpbmcgZm9yIFwid2hhdCB0aGlzIGJ1dHRvbiBkb2VzXCJcbi8vIGxpdmVzIGluIEhUTUwgYXR0cmlidXRlcy4gQ2FwdHVyZSB0aGVtIGFzIGEgc2VwYXJhdGUgZmllbGQgc28gYW4gTExNXG4vLyBhc2tlZCBcIndoeSBkb2Vzbid0IHRoaXMgYnV0dG9uIHdvcms/XCIgc2VlcyB0aGUgYmluZGluZyBpbW1lZGlhdGVseVxuLy8gcmF0aGVyIHRoYW4gZGlnZ2luZyB0aHJvdWdoIGBhdHRyc2AuXG5jb25zdCBCRUhBVklPUl9BVFRSX1BSRUZJWEVTID0gWydoeC0nLCAnZGF0YS1oeC0nLCAnZGF0YS1jb250cm9sbGVyJywgJ2RhdGEtYWN0aW9uJywgJ2RhdGEtdGFyZ2V0JywgJ3gtZGF0YScsICd4LW9uOicsICd4LWJpbmQ6JywgJ3gtbW9kZWwnLCAneC1zaG93JywgJ3gtaWYnLCAnQGNsaWNrJywgJ0BzdWJtaXQnLCAnZGF0YS10dXJibyddIGFzIGNvbnN0O1xuY29uc3QgY29sbGVjdEJlaGF2aW9yQXR0cnMgPSAoZWw6IEVsZW1lbnQpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCA9PiB7XG4gIGlmICghZWwuYXR0cmlidXRlcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKSkge1xuICAgIGNvbnN0IG5hbWUgPSBhLm5hbWU7XG4gICAgaWYgKEJFSEFWSU9SX0FUVFJfUFJFRklYRVMuc29tZSgocCkgPT4gbmFtZSA9PT0gcCB8fCBuYW1lLnN0YXJ0c1dpdGgocCkpKSB7XG4gICAgICBvdXRbbmFtZV0gPSB0cmltVGV4dChhLnZhbHVlLCAyMDApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gV2FsayB1cCB0aGUgc2hhZG93LURPTSBib3VuZGFyaWVzLiBXaGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50IGxpdmVzXG4vLyBpbnNpZGUgYSBjbG9zZWQvb3BlbiBzaGFkb3cgcm9vdCwgdGhlIGhvc3QncyBzZWxlY3RvciBpcyB0aGUgb25seSB3YXlcbi8vIHRoZSBwYW5lbCBzaWRlIChvciBhbiBMTE0gbGF0ZXIpIGNhbiByZS1maW5kIHRoZSBlbnRyeSBvbiB0aGUgbGl2ZVxuLy8gcGFnZSDigJQgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyBib3VuZGFyaWVzLlxuY29uc3Qgc2hhZG93SG9zdFNlbGVjdG9yID0gKGVsOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHJvb3QgPSBlbC5nZXRSb290Tm9kZSgpO1xuICBpZiAoIShyb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCkpIHJldHVybiBudWxsO1xuICBjb25zdCBob3N0ID0gcm9vdC5ob3N0O1xuICBpZiAoIWhvc3QpIHJldHVybiBudWxsO1xuICAvLyBjc3NQYXRoIGlzIGRlZmluZWQgbGF0ZXI7IHJvdXRlIHRocm91Z2ggdGhlIHNoYXJlZCBzZWxlY3RvciBidWlsZGVyLlxuICB0cnkgeyByZXR1cm4gY3NzUGF0aChob3N0KTsgfSBjYXRjaCB7IHJldHVybiBob3N0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTsgfVxufTtcblxuLy8gV2FsayB1cCB0byBmaW5kIHRoZSBuZWFyZXN0IGBjb250ZW50ZWRpdGFibGU9dHJ1ZWAgYW5jZXN0b3IgKHRoZVxuLy8gcmljaC10ZXh0IGVkaXRvcidzIFwicm9vdFwiKS4gUmV0dXJucyBudWxsIHdoZW4gdGhlIGNhcHR1cmVkIGVsZW1lbnQgaXNcbi8vIG91dHNpZGUgYW55IGVkaXRvci5cbmNvbnN0IGZpbmRFZGl0b3JSb290ID0gKGVsOiBFbGVtZW50KTogRWxlbWVudCB8IG51bGwgPT4ge1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsO1xuICB3aGlsZSAoY3VyKSB7XG4gICAgaWYgKGN1ciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGN1ci5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgLy8gV2FsayB1cCBmdXJ0aGVyIHRvIGZpbmQgdGhlIE9VVEVSTU9TVCBjb250ZW50ZWRpdGFibGU9dHJ1ZVxuICAgICAgLy8gYW5jZXN0b3Ig4oCUIFByb3NlTWlycm9yIG5lc3RzIG5vZGVzIHRoYXQgZWFjaCByZXBvcnRcbiAgICAgIC8vIGlzQ29udGVudEVkaXRhYmxlPXRydWUsIGJ1dCB0aGUgYWN0dWFsIGVkaXRvciByb290IGlzIGF0IHRoZSB0b3AuXG4gICAgICBsZXQgb3V0ZXI6IEVsZW1lbnQgPSBjdXI7XG4gICAgICBsZXQgcHJvYmU6IEVsZW1lbnQgfCBudWxsID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgICB3aGlsZSAocHJvYmUgJiYgcHJvYmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBwcm9iZS5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgICBvdXRlciA9IHByb2JlO1xuICAgICAgICBwcm9iZSA9IHByb2JlLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0ZXI7XG4gICAgfVxuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gSWRlbnRpZnkgdGhlIGVkaXRvciBsaWJyYXJ5IGJ5IG1hcmtlcnMgZWFjaCBvbmUgc3RhbXBzIG9uIHRoZSBlZGl0b3Jcbi8vIHJvb3QuIE1vc3QgbGlicmFyaWVzIGxlYXZlIGEgY2xhc3Mgb3IgZGF0YS0qIGF0dHJpYnV0ZSB0aGF0J3Mgc3RhYmxlXG4vLyBhY3Jvc3MgdmVyc2lvbnM7IHNvbWUgbGVhdmUgYSBydW50aW1lIGZpZWxkIG9uIHRoZSBET00gbm9kZS4gT3JkZXJcbi8vIG1hdHRlcnMg4oCUIFRpcFRhcCByZXVzZXMgUHJvc2VNaXJyb3IgdW5kZXIgdGhlIGhvb2QsIHNvIGNoZWNrIHRpcHRhcFxuLy8gbWFya2VycyBmaXJzdDsgZGl0dG8gUXVpbGwgKHB1cmUgUHJvc2VNaXJyb3ItZnJlZSkgYmVmb3JlIGdlbmVyaWNcbi8vIGAuUHJvc2VNaXJyb3JgLlxuY29uc3QgZGV0ZWN0RWRpdG9yS2luZCA9IChyb290OiBFbGVtZW50KTogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJyA9PiB7XG4gIGNvbnN0IHI6IGFueSA9IHJvb3Q7XG4gIGlmIChyb290LmNsYXNzTGlzdD8uY29udGFpbnMoJ3RpcHRhcCcpIHx8IHIuX190aXB0YXApIHJldHVybiAndGlwdGFwJztcbiAgaWYgKHJvb3QuaGFzQXR0cmlidXRlKCdkYXRhLWxleGljYWwtZWRpdG9yJykgfHwgci5fX2xleGljYWxFZGl0b3IpIHJldHVybiAnbGV4aWNhbCc7XG4gIGlmIChyb290Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zbGF0ZS1lZGl0b3InKSB8fCByLl9fc2xhdGVFZGl0b3IpIHJldHVybiAnc2xhdGUnO1xuICBpZiAocm9vdC5jbGFzc0xpc3Q/LmNvbnRhaW5zKCdxbC1lZGl0b3InKSB8fCByb290LmNsb3Nlc3QoJy5xbC1jb250YWluZXInKSkgcmV0dXJuICdxdWlsbCc7XG4gIGlmIChyb290LmNsYXNzTGlzdD8uY29udGFpbnMoJ1Byb3NlTWlycm9yJykgfHwgci5fX3BtVmlld0Rlc2MgfHwgci5wbVZpZXdEZXNjKSByZXR1cm4gJ3Byb3NlbWlycm9yJztcbiAgcmV0dXJuICduYXRpdmUnO1xufTtcblxuY29uc3QgZWRpdG9yQ29udGV4dCA9IChlbDogRWxlbWVudCk6IHtraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnOyByb290U2VsZWN0b3I6IHN0cmluZzsgY29udGVudExlbmd0aDogbnVtYmVyfSB8IG51bGwgPT4ge1xuICBjb25zdCByb290ID0gZmluZEVkaXRvclJvb3QoZWwpO1xuICBpZiAoIXJvb3QpIHJldHVybiBudWxsO1xuICBsZXQgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gIHRyeSB7IHJvb3RTZWxlY3RvciA9IGNzc1BhdGgocm9vdCk7IH0gY2F0Y2ggeyByb290U2VsZWN0b3IgPSByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKTsgfVxuICBjb25zdCB0ZXh0ID0gKHJvb3QgYXMgSFRNTEVsZW1lbnQpLmlubmVyVGV4dCA/PyByb290LnRleHRDb250ZW50ID8/ICcnO1xuICByZXR1cm4ge1xuICAgIGtpbmQ6IGRldGVjdEVkaXRvcktpbmQocm9vdCksXG4gICAgcm9vdFNlbGVjdG9yLFxuICAgIGNvbnRlbnRMZW5ndGg6IHRleHQubGVuZ3RoLFxuICB9O1xufTtcblxuLy8gTGF5b3V0IGJ1Z3MgZnJlcXVlbnRseSBsaXZlIGluIHRoZSBQQVJFTlQncyBmbGV4L2dyaWQvb3ZlcmZsb3cvXG4vLyBzY3JvbGwvc3RhY2tpbmcgY29udGV4dCwgbm90IG9uIHRoZSBjYXB0dXJlZCBlbGVtZW50IGl0c2VsZi5cbi8vIENhcHR1cmUgYSBzbGltIHN1bW1hcnkgb2YgdGhlIHBhcmVudCBjaGFpbiB0aGF0J3Mgc3RydWN0dXJhbGx5XG4vLyByZWxldmFudCB0byBsYXlvdXQg4oCUIGRpc3BsYXksIHBvc2l0aW9uLCBvdmVyZmxvdywgc2Nyb2xsIG9mZnNldCxcbi8vIHRyYW5zZm9ybS93aWxsLWNoYW5nZSAoc3RhY2tpbmcpLCBhbmQgZmxleC9ncmlkIHN1bW1hcnkgb24gdGhlXG4vLyBpbW1lZGlhdGUgcGFyZW50LlxudHlwZSBMYXlvdXRDb250ZXh0RW50cnkgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBkaXNwbGF5Pzogc3RyaW5nO1xuICBwb3NpdGlvbj86IHN0cmluZztcbiAgb3ZlcmZsb3c/OiBzdHJpbmc7XG4gIHpJbmRleD86IHN0cmluZztcbiAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICB3aWxsQ2hhbmdlPzogc3RyaW5nO1xuICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xufTtcbmNvbnN0IGlzTGF5b3V0SW50ZXJlc3RpbmcgPSAoY3M6IENTU1N0eWxlRGVjbGFyYXRpb24pOiBib29sZWFuID0+IHtcbiAgaWYgKGNzLnBvc2l0aW9uICYmIGNzLnBvc2l0aW9uICE9PSAnc3RhdGljJykgcmV0dXJuIHRydWU7XG4gIGlmIChjcy5kaXNwbGF5ICYmIC8oZmxleHxncmlkfHRhYmxlfGNvbnRlbnRzfGlubGluZS1ibG9jaykvLnRlc3QoY3MuZGlzcGxheSkpIHJldHVybiB0cnVlO1xuICBpZiAoY3Mub3ZlcmZsb3cgJiYgY3Mub3ZlcmZsb3cgIT09ICd2aXNpYmxlJykgcmV0dXJuIHRydWU7XG4gIGlmIChjcy50cmFuc2Zvcm0gJiYgY3MudHJhbnNmb3JtICE9PSAnbm9uZScpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59O1xuY29uc3QgY2FwdHVyZUxheW91dENvbnRleHQgPSAoZWw6IEVsZW1lbnQsIGRlcHRoID0gNCk6IExheW91dENvbnRleHRFbnRyeVtdID0+IHtcbiAgY29uc3Qgb3V0OiBMYXlvdXRDb250ZXh0RW50cnlbXSA9IFtdO1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKGN1ciAmJiBjdXIgIT09IGRvY3VtZW50LmJvZHkgJiYgaSA8IGRlcHRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3VyKTtcbiAgICAgIGNvbnN0IGludGVyZXN0aW5nID0gaXNMYXlvdXRJbnRlcmVzdGluZyhjcyk7XG4gICAgICBpZiAoaW50ZXJlc3RpbmcpIHtcbiAgICAgICAgY29uc3QgZW50cnk6IExheW91dENvbnRleHRFbnRyeSA9IHt0YWc6IGN1ci50YWdOYW1lLnRvTG93ZXJDYXNlKCl9O1xuICAgICAgICBlbnRyeS5kaXNwbGF5ID0gY3MuZGlzcGxheTtcbiAgICAgICAgZW50cnkucG9zaXRpb24gPSBjcy5wb3NpdGlvbjtcbiAgICAgICAgaWYgKGNzLm92ZXJmbG93ICE9PSAndmlzaWJsZScpIGVudHJ5Lm92ZXJmbG93ID0gY3Mub3ZlcmZsb3c7XG4gICAgICAgIGlmIChjcy56SW5kZXggJiYgY3MuekluZGV4ICE9PSAnYXV0bycpIGVudHJ5LnpJbmRleCA9IGNzLnpJbmRleDtcbiAgICAgICAgaWYgKGNzLnRyYW5zZm9ybSAmJiBjcy50cmFuc2Zvcm0gIT09ICdub25lJykgZW50cnkudHJhbnNmb3JtID0gdHJpbVRleHQoY3MudHJhbnNmb3JtLCAxMjApO1xuICAgICAgICBpZiAoY3Mud2lsbENoYW5nZSAmJiBjcy53aWxsQ2hhbmdlICE9PSAnYXV0bycpIGVudHJ5LndpbGxDaGFuZ2UgPSBjcy53aWxsQ2hhbmdlO1xuICAgICAgICBpZiAoKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsV2lkdGggPiBjdXIuY2xpZW50V2lkdGggfHwgKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsSGVpZ2h0ID4gY3VyLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgIGVudHJ5LmlzU2Nyb2xsQ29udGFpbmVyID0gdHJ1ZTtcbiAgICAgICAgICBlbnRyeS5zY3JvbGxMZWZ0ID0gKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsTGVmdDtcbiAgICAgICAgICBlbnRyeS5zY3JvbGxUb3AgPSAoY3VyIGFzIEhUTUxFbGVtZW50KS5zY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9mbGV4Ly50ZXN0KGNzLmRpc3BsYXkpKSB7XG4gICAgICAgICAgZW50cnkuZmxleCA9IHtcbiAgICAgICAgICAgIGRpcmVjdGlvbjogY3MuZmxleERpcmVjdGlvbixcbiAgICAgICAgICAgIHdyYXA6IGNzLmZsZXhXcmFwLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogY3MuYWxpZ25JdGVtcyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBjcy5qdXN0aWZ5Q29udGVudCxcbiAgICAgICAgICAgIGdhcDogY3MuZ2FwICE9PSAnbm9ybWFsJyA/IGNzLmdhcCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKC9ncmlkLy50ZXN0KGNzLmRpc3BsYXkpKSB7XG4gICAgICAgICAgZW50cnkuZ3JpZCA9IHtcbiAgICAgICAgICAgIHRlbXBsYXRlQ29sdW1uczogdHJpbVRleHQoY3MuZ3JpZFRlbXBsYXRlQ29sdW1ucywgMjAwKSxcbiAgICAgICAgICAgIHRlbXBsYXRlUm93czogdHJpbVRleHQoY3MuZ3JpZFRlbXBsYXRlUm93cywgMjAwKSxcbiAgICAgICAgICAgIGdhcDogY3MuZ2FwICE9PSAnbm9ybWFsJyA/IGNzLmdhcCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIG91dC5wdXNoKGVudHJ5KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICBpKys7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFN1cmZhY2UgYSBjb250cmFzdC1yYXRpbyBudW1iZXIgZm9yIHRleHQgZWxlbWVudHMgc28gYW4gYTExeS1hd2FyZVxuLy8gcmV2aWV3ZXIgY2FuIGZsYWcgZmFpbGluZyBwYWlycyB3aXRob3V0IHJlLXJ1bm5pbmcgYW4gYXVkaXQuIFJldHVybnNcbi8vIG51bGwgd2hlbiBubyB0ZXh0IG9yIHdoZW4gYmFja2dyb3VuZCBpcyB0cmFuc3BhcmVudCBhbmQgd2UgY2FuJ3Rcbi8vIHJlc29sdmUgYSBiYXNlIGNvbG9yLlxuLy9cbi8vIFdlIG9ubHkgcmVwb3J0IGNvbnRyYXN0IGZvciBlbGVtZW50cyB3aXRoIGRpcmVjdCB0ZXh0IGNoaWxkcmVuOyBmb3Jcbi8vIGNvbnRhaW5lcnMgd2UnZCBuZWVkIHRvIHRyYXZlcnNlLCB3aGljaCBpcyBvdXRzaWRlIHRoZSBzY29wZSBvZiBhXG4vLyBsaWdodHdlaWdodCBpbi1jYXB0dXJlIGF1ZGl0LlxuY29uc3QgcGFyc2VSZ2IgPSAoczogc3RyaW5nKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBudWxsID0+IHtcbiAgLy8gcmdiKDI1NSwgOTUsIDApIHwgcmdiYSgyNTUsIDk1LCAwLCAwLjUpIHwgI2ZmNWYwMCB8ICNmNTBcbiAgY29uc3QgbSA9IC9yZ2JhP1xcKFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqKD86LFxccyooW1xcZC5dKykpP1xccypcXCkvLmV4ZWMocyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIFtwYXJzZUludChtWzFdISwgMTApLCBwYXJzZUludChtWzJdISwgMTApLCBwYXJzZUludChtWzNdISwgMTApLCBtWzRdID8gcGFyc2VGbG9hdChtWzRdKSA6IDFdO1xuICB9XG4gIGNvbnN0IGhleCA9IC9eIyhbMC05YS1mXXszfXxbMC05YS1mXXs2fSkkL2kuZXhlYyhzKTtcbiAgaWYgKGhleCkge1xuICAgIGxldCBoID0gaGV4WzFdITtcbiAgICBpZiAoaC5sZW5ndGggPT09IDMpIGggPSBoLnNwbGl0KCcnKS5tYXAoKGMpID0+IGMgKyBjKS5qb2luKCcnKTtcbiAgICByZXR1cm4gW3BhcnNlSW50KGguc2xpY2UoMCwgMiksIDE2KSwgcGFyc2VJbnQoaC5zbGljZSgyLCA0KSwgMTYpLCBwYXJzZUludChoLnNsaWNlKDQsIDYpLCAxNiksIDFdO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbmNvbnN0IHJlbGF0aXZlTHVtaW5hbmNlID0gKFtyLCBnLCBiXTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiBudW1iZXIgPT4ge1xuICBjb25zdCBsaW4gPSAoYzogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgdiA9IGMgLyAyNTU7XG4gICAgcmV0dXJuIHYgPD0gMC4wMzkyOCA/IHYgLyAxMi45MiA6ICgodiArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQ7XG4gIH07XG4gIHJldHVybiAwLjIxMjYgKiBsaW4ocikgKyAwLjcxNTIgKiBsaW4oZykgKyAwLjA3MjIgKiBsaW4oYik7XG59O1xuY29uc3QgY29udHJhc3RSYXRpbyA9IChmZzogc3RyaW5nLCBiZzogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCA9PiB7XG4gIGNvbnN0IGYgPSBwYXJzZVJnYihmZyk7IGNvbnN0IGIgPSBwYXJzZVJnYihiZyk7XG4gIGlmICghZiB8fCAhYikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGxmID0gcmVsYXRpdmVMdW1pbmFuY2UoZik7XG4gIGNvbnN0IGxiID0gcmVsYXRpdmVMdW1pbmFuY2UoYik7XG4gIGNvbnN0IFtsbywgaGldID0gbGYgPiBsYiA/IFtsYiwgbGZdIDogW2xmLCBsYl07XG4gIHJldHVybiBNYXRoLnJvdW5kKCgoaGkgKyAwLjA1KSAvIChsbyArIDAuMDUpKSAqIDEwMCkgLyAxMDA7XG59O1xuLy8gV2FsayB1cCB0aGUgcGFyZW50IGNoYWluIHRvIGZpbmQgdGhlIGZpcnN0IG9wYXF1ZSBiYWNrZ3JvdW5kIGNvbG9yLlxuLy8gTW9zdCBlbGVtZW50cyByZXBvcnQgYHJnYmEoMCwwLDAsMClgICh0cmFuc3BhcmVudCkgZm9yIGJhY2tncm91bmRDb2xvcjtcbi8vIHRoZSBhY3R1YWwgdmlzaWJsZSBiYWNrZ3JvdW5kIGlzIHRoZSBuZWFyZXN0IGFuY2VzdG9yIHRoYXQgcGFpbnRzLlxuY29uc3QgcmVzb2x2ZUJhY2tncm91bmQgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbDtcbiAgd2hpbGUgKGN1cikge1xuICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3VyKTtcbiAgICBjb25zdCBiZyA9IGNzLmJhY2tncm91bmRDb2xvcjtcbiAgICBpZiAoYmcgJiYgYmcgIT09ICdyZ2JhKDAsIDAsIDAsIDApJyAmJiBiZyAhPT0gJ3RyYW5zcGFyZW50JykgcmV0dXJuIGJnO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbmNvbnN0IGNvbXB1dGVBY2Nlc3NpYmlsaXR5Q2hlY2sgPSAoZWw6IEVsZW1lbnQpOiB7Y29udHJhc3RSYXRpbz86IG51bWJlcjsgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7IHRhYmJhYmxlPzogYm9vbGVhbjsgZm9jdXNWaXNpYmxlPzogYm9vbGVhbn0gfCBudWxsID0+IHtcbiAgY29uc3Qgb3V0OiB7Y29udHJhc3RSYXRpbz86IG51bWJlcjsgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7IHRhYmJhYmxlPzogYm9vbGVhbjsgZm9jdXNWaXNpYmxlPzogYm9vbGVhbn0gPSB7fTtcbiAgdHJ5IHtcbiAgICBpZiAoaGFzT3duVGV4dE5vZGUoZWwpKSB7XG4gICAgICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGNvbnN0IGZnID0gY3MuY29sb3I7XG4gICAgICBjb25zdCBiZyA9IHJlc29sdmVCYWNrZ3JvdW5kKGVsKTtcbiAgICAgIGlmIChmZyAmJiBiZykge1xuICAgICAgICBjb25zdCByID0gY29udHJhc3RSYXRpbyhmZywgYmcpO1xuICAgICAgICBpZiAociAhPT0gbnVsbCkge1xuICAgICAgICAgIG91dC5jb250cmFzdFJhdGlvID0gcjtcbiAgICAgICAgICAvLyBVc2UgMThwdCsgLyAxNHB0LWJvbGQgdGhyZXNob2xkcyAoMy4wIC8gNC41KSB3aGVuIGFwcGxpY2FibGU7XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBzdGFuZGFyZCA0LjUgLyA3LjAuXG4gICAgICAgICAgY29uc3QgZm9udFNpemUgPSBwYXJzZUZsb2F0KGNzLmZvbnRTaXplKTtcbiAgICAgICAgICBjb25zdCBpc0JvbGQgPSBwYXJzZUludChjcy5mb250V2VpZ2h0LCAxMCkgPj0gNzAwO1xuICAgICAgICAgIGNvbnN0IGlzTGFyZ2VUZXh0ID0gZm9udFNpemUgPj0gMTggfHwgKGZvbnRTaXplID49IDE0ICYmIGlzQm9sZCk7XG4gICAgICAgICAgY29uc3QgYWEgPSBpc0xhcmdlVGV4dCA/IDMgOiA0LjU7XG4gICAgICAgICAgY29uc3QgYWFhID0gaXNMYXJnZVRleHQgPyA0LjUgOiA3O1xuICAgICAgICAgIG91dC5jb250cmFzdFBhc3NlcyA9IHIgPj0gYWFhID8gJ0FBQScgOiByID49IGFhID8gJ0FBJyA6ICdmYWlsJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBUYWIgb3JkZXIgcHJveHk6IHRhYkluZGV4ID49IDAgT1IgbWF0Y2hlcyB0aGUgbmF0dXJhbC10YWJiYWJsZSBzZXQuXG4gICAgY29uc3QgdGkgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLnRhYkluZGV4O1xuICAgIGNvbnN0IG5hdHVyYWxseVRhYmJhYmxlID0gL14oYXxidXR0b258aW5wdXR8c2VsZWN0fHRleHRhcmVhfGlmcmFtZXxkZXRhaWxzfGF1ZGlvfHZpZGVvKSQvaS50ZXN0KGVsLnRhZ05hbWUpICYmICFlbC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgKGVsLnRhZ05hbWUgIT09ICdBJyB8fCBCb29sZWFuKChlbCBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZikpO1xuICAgIG91dC50YWJiYWJsZSA9IHRpID49IDAgfHwgbmF0dXJhbGx5VGFiYmFibGU7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gQW5pbWF0aW9uLWNvbnRleHQgZmxhZy4gY2FwdHVyZUVudHJ5IGNhbGxzIHRoaXMg4oCUIGlmIGBnZXRBbmltYXRpb25zKClgXG4vLyByZXR1cm5zIGFueXRoaW5nIGFjdGl2ZWx5IHBsYXlpbmcsIHRoZSByZWN0IC8gdHJhbnNmb3JtIC8gb3BhY2l0eSB3ZVxuLy8gY2FwdHVyZWQgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLCBub3QgdGhlXG4vLyBzZXR0bGVkIGxheW91dC4gSGVscHMgYW4gTExNIG5vdCBhbmNob3Igb24gdmFsdWVzIHRoYXQgd29uJ3QgcmVwZWF0LlxuY29uc3QgaGFzQWN0aXZlQW5pbWF0aW9uID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IGZuID0gKGVsIGFzIGFueSkuZ2V0QW5pbWF0aW9ucztcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuICB0cnkge1xuICAgIGNvbnN0IGFuaW1hdGlvbnMgPSBmbi5jYWxsKGVsKSBhcyBBcnJheTx7cGxheVN0YXRlPzogc3RyaW5nfT47XG4gICAgZm9yIChjb25zdCBhIG9mIGFuaW1hdGlvbnMpIHtcbiAgICAgIGlmIChhPy5wbGF5U3RhdGUgPT09ICdydW5uaW5nJykgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gUHJvZHVjdGlvbiBidWlsZHMgbWluaWZ5IGNvbXBvbmVudCBjb25zdHJ1Y3RvciBuYW1lcyB0byAxLTMgY2hhcnNcbi8vIChgQmRgLCBgS2VgLCBgcWFgLCBgJGRgLCBgZThgKS4gVGhlIHN0cmluZyBjYXJyaWVzIHplcm8gc2VtYW50aWNcbi8vIGluZm9ybWF0aW9uIHRvIGFuIExMTSDigJQgaXQncyBqdXN0IG1pbmlmaWVyIG91dHB1dC4gV2UgdHJlYXQgc3VjaCBuYW1lc1xuLy8gYXMgbWlzc2luZyBhbmQgZmFsbCB0aHJvdWdoIHRvIHRoZSBkaXNwbGF5TmFtZSBwYXRoIChvciBkcm9wIHRoZVxuLy8gYGNvbXBvbmVudGAgZmllbGQgZW50aXJlbHkgd2hlbiBuZWl0aGVyIHN1cnZpdmVzIHRoZSBtaW5pZmllcikuXG4vL1xuLy8gSmF2YVNjcmlwdCBpZGVudGlmaWVyLXN0YXJ0IGNoYXJzIGluY2x1ZGUgYCRgIGFuZCBgX2A7IGlkZW50aWZpZXItY29udGludWVcbi8vIGFkZHMgZGlnaXRzLiBSZWFsIGNvbXBvbmVudCBuYW1lcyBhcmUgYWxtb3N0IGFsd2F5cyBjYW1lbENhc2UgLyBQYXNjYWxDYXNlXG4vLyB3b3JkcyDiiaU0IGNoYXJzIChgQnV0dG9uYCwgYFdlYXRoZXJDYXJkYCkuIEFueXRoaW5nIOKJpDMgY2hhcnMgdGhhdCB1c2VzIHRoZVxuLy8gbWluaWZpZXIgYWxwaGFiZXQgaXMgdHJlYXRlZCBhcyBqdW5rLlxuY29uc3QgTUlOSUZJRURfTkFNRV9SRSA9IC9eW0EtWmEteiRfXVtBLVphLXowLTkkX117MCwyfSQvO1xuY29uc3QgQlVORExFUl9TQ0FGRk9MRF9OQU1FUyA9IG5ldyBTZXQoW1xuICAnQW5vbnltb3VzJywgJ2Fub255bW91cycsICdkZWZhdWx0JywgJ19kZWZhdWx0JyxcbiAgLy8gVnVlIFNGQyBjb21waWxlciBzdGFtcHMgZXZlcnkgYDxzY3JpcHQgc2V0dXA+YCBkZWZhdWx0IGV4cG9ydCB3aXRoIHRoaXNcbiAgLy8gc2VudGluZWwgd2hlbiBubyBleHBsaWNpdCBgbmFtZWAgaXMgc2V0IOKAlCBzZW1hbnRpY2FsbHkgZW1wdHkuXG4gICdfc2ZjX21haW4nLCAnc2ZjX21haW4nLFxuXSk7XG5jb25zdCBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lID0gKG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IHtcbiAgaWYgKCFuYW1lKSByZXR1cm4gZmFsc2U7XG4gIGlmIChCVU5ETEVSX1NDQUZGT0xEX05BTUVTLmhhcyhuYW1lKSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoTUlOSUZJRURfTkFNRV9SRS50ZXN0KG5hbWUpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gLS0tLSBSZWFjdCAvIFZ1ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCByZWFjdEluZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHJlYWN0S2V5ID0gT2JqZWN0LmtleXMoZWwpLmZpbmQoKGspID0+XG4gICAgay5zdGFydHNXaXRoKCdfX3JlYWN0RmliZXIkJykgfHwgay5zdGFydHNXaXRoKCdfX3JlYWN0SW50ZXJuYWxJbnN0YW5jZSQnKSk7XG4gIGlmICghcmVhY3RLZXkpIHJldHVybiBudWxsO1xuICBsZXQgbm9kZTogYW55ID0gKGVsIGFzIGFueSlbcmVhY3RLZXldO1xuICBjb25zdCBzZWVuID0gbmV3IFNldDxhbnk+KCk7XG4gIGxldCByZXN1bHQ6IEZyYW1ld29ya0luZm8gfCBudWxsID0gbnVsbDtcbiAgd2hpbGUgKG5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmICFzZWVuLmhhcyhub2RlKSkge1xuICAgIHNlZW4uYWRkKG5vZGUpO1xuICAgIGNvbnN0IHR5cGUgPSBub2RlLnR5cGUgfHwgbm9kZS5lbGVtZW50VHlwZTtcbiAgICBpZiAoIXJlc3VsdD8ubmFtZSAmJiB0eXBlICYmIHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgLy8gZGlzcGxheU5hbWUgaXMgZGV2ZWxvcGVyLXN1cHBsaWVkIChSZWFjdC5kaXNwbGF5TmFtZSwgZm9yd2FyZFJlZlxuICAgICAgLy8gd3JhcHBlciBuYW1lcykgYW5kIHN1cnZpdmVzIG1pbmlmaWNhdGlvbiB3aGVuIHNldCBleHBsaWNpdGx5LiBQcmVmZXJcbiAgICAgIC8vIGl0LiB0eXBlLm5hbWUgaXMgdGhlIGNvbnN0cnVjdG9yLm5hbWUgc3RyaW5nLCB3aGljaCBtaW5pZmllcyB0b1xuICAgICAgLy8ganVuayBsaWtlIFwiQmRcIiBpbiBwcm9kIGJ1aWxkcyDigJQgb25seSBhY2NlcHQgaXQgaWYgaXQgc3Vydml2ZXMgdGhlXG4gICAgICAvLyBtZWFuaW5nZnVsLW5hbWUgZmlsdGVyLlxuICAgICAgY29uc3QgZGlzcGxheSA9IHR5cGVvZiB0eXBlLmRpc3BsYXlOYW1lID09PSAnc3RyaW5nJyA/IHR5cGUuZGlzcGxheU5hbWUgOiBudWxsO1xuICAgICAgY29uc3QgY3Rvck5hbWUgPSB0eXBlb2YgdHlwZS5uYW1lID09PSAnc3RyaW5nJyA/IHR5cGUubmFtZSA6IG51bGw7XG4gICAgICBjb25zdCBjYW5kID0gaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShkaXNwbGF5KVxuICAgICAgICA/IGRpc3BsYXkhXG4gICAgICAgIDogaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShjdG9yTmFtZSkgPyBjdG9yTmFtZSEgOiBudWxsO1xuICAgICAgaWYgKGNhbmQpIHtcbiAgICAgICAgcmVzdWx0ID0ge2ZyYW1ld29yazogJ3JlYWN0JywgbmFtZTogdHJpbVRleHQoY2FuZCwgMTIwKX07XG4gICAgICAgIGlmIChkaXNwbGF5ICYmIGRpc3BsYXkgIT09IGNhbmQpIHtcbiAgICAgICAgICByZXN1bHQuZGlzcGxheU5hbWUgPSB0cmltVGV4dChkaXNwbGF5LCAxODApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZXN1bHQgJiYgIXJlc3VsdC5zb3VyY2UgJiYgbm9kZS5fZGVidWdTb3VyY2UpIHtcbiAgICAgIHJlc3VsdC5zb3VyY2UgPSB7XG4gICAgICAgIGZpbGU6IG5vZGUuX2RlYnVnU291cmNlLmZpbGVOYW1lIHx8IG5vZGUuX2RlYnVnU291cmNlLmZpbGUgfHwgbnVsbCxcbiAgICAgICAgbGluZTogbm9kZS5fZGVidWdTb3VyY2UubGluZU51bWJlciB8fCBub2RlLl9kZWJ1Z1NvdXJjZS5saW5lIHx8IG51bGwsXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobm9kZS5fZGVidWdPd25lcikgeyBub2RlID0gbm9kZS5fZGVidWdPd25lcjsgY29udGludWU7IH1cbiAgICBpZiAobm9kZS5yZXR1cm4pIHsgbm9kZSA9IG5vZGUucmV0dXJuOyBjb250aW51ZTsgfVxuICAgIGJyZWFrO1xuICB9XG4gIC8vIE5vIHVzYWJsZSBuYW1lIOKGkiBlbWl0IG5vdGhpbmcgcmF0aGVyIHRoYW4gYHtmcmFtZXdvcms6XCJyZWFjdFwifWAgd2l0aCBhXG4gIC8vIG15c3RlcnkgMi1jaGFyIG5hbWUuIEFuIExMTSByZWFkaW5nIHRoZSBleHBvcnQgbGVhcm5zIG5vdGhpbmcgZnJvbVxuICAvLyBlaXRoZXIgc2hhcGU7IHN1cHByZXNzaW5nIGtlZXBzIHRoZSByb3cgaG9uZXN0LlxuICBpZiAoIXJlc3VsdD8ubmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gV2FsayB0aGUgZmliZXIgY2hhaW4gdG8gY29sbGVjdCBhbmNlc3RvciBjb21wb25lbnQgbmFtZXMuIFRoZVxuICAvLyBgX2RlYnVnT3duZXJgIHBhdGggaXMgbW9yZSBtZWFuaW5nZnVsIHRoYW4gYHJldHVybmAgKGl0IHNraXBzIGhvc3RcbiAgLy8gd3JhcHBlcnMpLCBidXQgd2UgZmFsbCBiYWNrIHRvIGByZXR1cm5gIHdoZW4gb3duZXIgZGF0YSBpc1xuICAvLyB1bmF2YWlsYWJsZSAocHJvZHVjdGlvbiBidWlsZHMpLiBDYXAgYXQgOCBhbmNlc3RvcnMgc28gdGhlIGZpZWxkXG4gIC8vIGRvZXNuJ3QgYmFsbG9vbiBmb3IgZGVlcGx5LW5lc3RlZCBhcHBzLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3Qgc2VlbkNoYWluID0gbmV3IFNldDxhbnk+KCk7XG4gIGxldCB3YWxrZXI6IGFueSA9IChlbCBhcyBhbnkpW3JlYWN0S2V5XTtcbiAgd2hpbGUgKHdhbGtlciAmJiB0eXBlb2Ygd2Fsa2VyID09PSAnb2JqZWN0JyAmJiAhc2VlbkNoYWluLmhhcyh3YWxrZXIpICYmIGNoYWluLmxlbmd0aCA8IDgpIHtcbiAgICBzZWVuQ2hhaW4uYWRkKHdhbGtlcik7XG4gICAgY29uc3QgdCA9IHdhbGtlci50eXBlIHx8IHdhbGtlci5lbGVtZW50VHlwZTtcbiAgICBpZiAodCAmJiB0eXBlb2YgdCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IG4gPSAodHlwZW9mIHQuZGlzcGxheU5hbWUgPT09ICdzdHJpbmcnICYmIGlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUodC5kaXNwbGF5TmFtZSkpXG4gICAgICAgID8gdC5kaXNwbGF5TmFtZVxuICAgICAgICA6ICh0eXBlb2YgdC5uYW1lID09PSAnc3RyaW5nJyAmJiBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKHQubmFtZSkpXG4gICAgICAgICAgPyB0Lm5hbWVcbiAgICAgICAgICA6IG51bGw7XG4gICAgICBpZiAobiAmJiAoY2hhaW4ubGVuZ3RoID09PSAwIHx8IGNoYWluW2NoYWluLmxlbmd0aCAtIDFdICE9PSBuKSkgY2hhaW4ucHVzaChuKTtcbiAgICB9XG4gICAgd2Fsa2VyID0gd2Fsa2VyLl9kZWJ1Z093bmVyID8/IHdhbGtlci5yZXR1cm47XG4gIH1cbiAgaWYgKGNoYWluLmxlbmd0aCA+IDApIHJlc3VsdC5jaGFpbiA9IGNoYWluO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgdnVlSW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgY29uc3QgdjogYW55ID0gKGVsIGFzIGFueSk/Ll9fdnVlUGFyZW50Q29tcG9uZW50IHx8IChlbCBhcyBhbnkpPy5fX3Z1ZV9hcHBfXz8uX2luc3RhbmNlIHx8XG4gICAgKGVsIGFzIGFueSk/Ll9fdm5vZGU/LmNvbXBvbmVudCB8fCAoZWwgYXMgYW55KT8uX192dWVfXztcbiAgY29uc3QgdHlwZSA9IHY/LnR5cGUgfHwgdj8uY3R4Py50eXBlO1xuICAvLyB0eXBlLm5hbWUgaXMgZGV2ZWxvcGVyLXNldCB2aWEgYG5hbWU6ICdNeUNvbXAnYDsgdHlwZS5fX25hbWUgaXNcbiAgLy8gcG9wdWxhdGVkIGJ5IGA8c2NyaXB0IHNldHVwPmAgYW5kIHRvb2xzIHRoYXQgaW5mZXIgdGhlIGZpbGVuYW1lLiBCb3RoXG4gIC8vIGFyZSByZWFsIG5hbWVzIGluIGRldjsgcHJvZCBidWlsZHMgY2FuIGxlYXZlIG9ubHkgYSBtaW5pZmllZCBnbHlwaC5cbiAgY29uc3QgcmF3TmFtZSA9IHR5cGU/Lm5hbWUgfHwgdHlwZT8uX19uYW1lO1xuICBpZiAoIWlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUocmF3TmFtZSkpIHJldHVybiBudWxsO1xuICBjb25zdCByZXN1bHQ6IEZyYW1ld29ya0luZm8gPSB7XG4gICAgZnJhbWV3b3JrOiAndnVlJyxcbiAgICBuYW1lOiB0cmltVGV4dChyYXdOYW1lLCAxNjApLFxuICAgIHNvdXJjZToge2ZpbGU6IHR5cGU/Ll9fZmlsZSB8fCBudWxsfSxcbiAgfTtcbiAgLy8gV2FsayB0aGUgcGFyZW50LWNvbXBvbmVudCBjaGFpbi5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGxldCBjdXI6IGFueSA9IHY7XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PGFueT4oKTtcbiAgd2hpbGUgKGN1ciAmJiB0eXBlb2YgY3VyID09PSAnb2JqZWN0JyAmJiAhc2Vlbi5oYXMoY3VyKSAmJiBjaGFpbi5sZW5ndGggPCA4KSB7XG4gICAgc2Vlbi5hZGQoY3VyKTtcbiAgICBjb25zdCB0ID0gY3VyLnR5cGUgfHwgY3VyLmN0eD8udHlwZTtcbiAgICBjb25zdCBuID0gdD8ubmFtZSA/PyB0Py5fX25hbWU7XG4gICAgaWYgKHR5cGVvZiBuID09PSAnc3RyaW5nJyAmJiBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKG4pKSB7XG4gICAgICBpZiAoY2hhaW4ubGVuZ3RoID09PSAwIHx8IGNoYWluW2NoYWluLmxlbmd0aCAtIDFdICE9PSBuKSBjaGFpbi5wdXNoKG4pO1xuICAgIH1cbiAgICBjdXIgPSBjdXIucGFyZW50O1xuICB9XG4gIGlmIChjaGFpbi5sZW5ndGggPiAwKSByZXN1bHQuY2hhaW4gPSBjaGFpbjtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIExpdCAobGl0LWVsZW1lbnQpIOKAlCBpbnN0YW5jZXMgYXJlIGN1c3RvbSBlbGVtZW50cyB3aG9zZSBjb25zdHJ1Y3RvclxuLy8gY2FycmllcyBgXyRsaXRFbGVtZW50JGAsIGBlbGVtZW50UHJvcGVydGllc2AsIG9yIGBzdHlsZXNgLiBUaGUgdGFnIGlzXG4vLyB0aGUgY29tcG9uZW50J3MgaWRlbnRpdHk7IHRoZSBjb25zdHJ1Y3RvciBuYW1lIGlzIHRoZSBkZXZlbG9wZXItZmFjaW5nXG4vLyBjbGFzcyBuYW1lIHdoZW4gcHJvdmlkZWQuXG5jb25zdCBsaXRJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT4ge1xuICBpZiAoIWVsLnRhZ05hbWUuaW5jbHVkZXMoJy0nKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGN0b3I6IGFueSA9IGVsLmNvbnN0cnVjdG9yO1xuICBpZiAoIWN0b3IpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0xpdCA9IEJvb2xlYW4oXG4gICAgY3Rvci5fJGxpdEVsZW1lbnQkIHx8XG4gICAgY3Rvci5lbGVtZW50UHJvcGVydGllcyB8fFxuICAgIGN0b3IuXyRsaXRFbGVtZW50VmVyc2lvbiQgfHxcbiAgICAoY3Rvci5zdHlsZXMgJiYgQXJyYXkuaXNBcnJheShjdG9yLnN0eWxlcykpLFxuICApO1xuICBpZiAoIWlzTGl0KSByZXR1cm4gbnVsbDtcbiAgLy8gY3Rvci5uYW1lIGluIHByb2QgaXMgYSAyLWNoYXIgbWluaWZpZXIgZ2x5cGguIFRoZSB0YWcgaXMgdGhlXG4gIC8vIGRldmVsb3Blci1mYWNpbmcgaWRlbnRpdHkgZm9yIGFueSBjdXN0b20gZWxlbWVudCDigJQgdXNlIGl0IGFzIHRoZVxuICAvLyBjYW5vbmljYWwgbmFtZSB3aGVuIGN0b3IubmFtZSBpcyBtaW5pZmllZCBhd2F5LlxuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGN0b3JOYW1lID0gdHlwZW9mIGN0b3IubmFtZSA9PT0gJ3N0cmluZycgPyBjdG9yLm5hbWUgOiBudWxsO1xuICBjb25zdCBuYW1lID0gaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShjdG9yTmFtZSkgPyBjdG9yTmFtZSEgOiB0YWc7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnbGl0JyxcbiAgICBuYW1lOiB0cmltVGV4dChuYW1lLCAxMjApLFxuICAgIGRpc3BsYXlOYW1lOiB0YWcsXG4gIH07XG59O1xuXG4vLyBTdGVuY2lsIGNvbXBvbmVudHMg4oCUIGN1c3RvbSBlbGVtZW50cyB3aG9zZSBjb25zdHJ1Y3RvciBleHBvc2VzIGFcbi8vIHN0YXRpYyBgaXNgICh0aGUgdGFnKSwgYW5kIHdoaWNoIGNhcnJ5IHN0ZW5jaWwtaW50ZXJuYWwgcHJvcHMgb24gdGhlXG4vLyBob3N0IChgX19ob3N0Q3NzYCwgYHMtaWRgLCBgX19zdGVuY2lsX3N1YnNjcmliZXJJZGAsIGV0YykuXG5jb25zdCBzdGVuY2lsSW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgaWYgKCFlbC50YWdOYW1lLmluY2x1ZGVzKCctJykpIHJldHVybiBudWxsO1xuICBjb25zdCBjdG9yOiBhbnkgPSBlbC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCFjdG9yKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbG9va3NTdGVuY2lsID0gQm9vbGVhbihcbiAgICB0eXBlb2YgY3Rvci5pcyA9PT0gJ3N0cmluZycgJiYgY3Rvci5pcy5pbmNsdWRlcygnLScpIHx8XG4gICAgKGVsIGFzIGFueSkuX19ob3N0Q3NzICE9PSB1bmRlZmluZWQgfHxcbiAgICAoZWwgYXMgYW55KS5fX3N0ZW5jaWxfc3Vic2NyaWJlcklkICE9PSB1bmRlZmluZWQgfHxcbiAgICBlbC5oYXNBdHRyaWJ1dGUoJ3MtaWQnKSxcbiAgKTtcbiAgaWYgKCFsb29rc1N0ZW5jaWwpIHJldHVybiBudWxsO1xuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIC8vIGBjdG9yLmlzYCBpcyB0aGUgU3RlbmNpbC1zdGF0aWMgdGFnIGRlY2xhcmF0aW9uIChhbHdheXMgcHJlc2VudCwgYWx3YXlzXG4gIC8vIG1lYW5pbmdmdWwpLiBgY3Rvci5uYW1lYCBpcyB0aGUgbWluaWZpZWQgY2xhc3MgbmFtZSBpbiBwcm9kLiBGYWxsIGJhY2tcbiAgLy8gdGhyb3VnaCB0aGUgc2FtZSBtZWFuaW5nZnVsbmVzcyBmaWx0ZXIgYXMgdGhlIG90aGVyIGZyYW1ld29ya3MuXG4gIGNvbnN0IGlzRmllbGQgPSB0eXBlb2YgY3Rvci5pcyA9PT0gJ3N0cmluZycgPyBjdG9yLmlzIDogbnVsbDtcbiAgY29uc3QgY3Rvck5hbWUgPSB0eXBlb2YgY3Rvci5uYW1lID09PSAnc3RyaW5nJyA/IGN0b3IubmFtZSA6IG51bGw7XG4gIGNvbnN0IG5hbWUgPSBpc0ZpZWxkIHx8IChpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKGN0b3JOYW1lKSA/IGN0b3JOYW1lISA6IHRhZyk7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnc3RlbmNpbCcsXG4gICAgbmFtZTogdHJpbVRleHQobmFtZSwgMTIwKSxcbiAgICBkaXNwbGF5TmFtZTogdGFnLFxuICB9O1xufTtcblxuLy8gU3ZlbHRlIOKAlCBydW50aW1lIGluc3RhbmNlIGxvb2t1cCBpcyBzcGFyc2UsIGJ1dCB0aGUgZGV2LW1vZGVcbi8vIGNvbXBpbGVyIGF0dGFjaGVzIGBfX3N2ZWx0ZV9tZXRhYCB0byBlbGVtZW50cyB3aXRoIHNvdXJjZS1sb2MgaW5mb1xuLy8gKGB7IGxvYzogeyBmaWxlLCBsaW5lLCBjaGFyIH0gfWApLiBJbiBwcm9kIHRoYXQgcHJvcGVydHkgaXMgYWJzZW50LFxuLy8gc28gZGV0ZWN0aW9uIHNpbGVudGx5IGZhbGxzIHRocm91Z2guXG5jb25zdCBzdmVsdGVJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT4ge1xuICBjb25zdCBtZXRhOiBhbnkgPSAoZWwgYXMgYW55KS5fX3N2ZWx0ZV9tZXRhO1xuICBpZiAoIW1ldGE/LmxvYykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGZpbGUgPSB0eXBlb2YgbWV0YS5sb2MuZmlsZSA9PT0gJ3N0cmluZycgPyBtZXRhLmxvYy5maWxlIDogbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBmcmFtZXdvcms6ICdzdmVsdGUnLFxuICAgIG5hbWU6IHRyaW1UZXh0KGZpbGUgPz8gJ3N2ZWx0ZS1jb21wb25lbnQnLCAxNjApLFxuICAgIHNvdXJjZToge1xuICAgICAgZmlsZSxcbiAgICAgIGxpbmU6IHR5cGVvZiBtZXRhLmxvYy5saW5lID09PSAnbnVtYmVyJyA/IG1ldGEubG9jLmxpbmUgOiBudWxsLFxuICAgIH0sXG4gIH07XG59O1xuXG4vLyBHZW5lcmljIHdlYi1jb21wb25lbnQgZmFsbGJhY2sg4oCUIHdoZW4gdGhlIGVsZW1lbnQgaGFzIGEgY3VzdG9tLWVsZW1lbnRcbi8vIHRhZyAoa2ViYWItY2FzZSkgYW5kIGBjdXN0b21FbGVtZW50cy5nZXQoLi4uKWAgcmVjb2duaXplcyBpdCwgYnV0IG5vXG4vLyBmcmFtZXdvcmstc3BlY2lmaWMgbWFya2VyIG1hdGNoZWQuIENhcHR1cmVzIHRoZSB0YWcgYXMgdGhlIGlkZW50aXR5LlxuY29uc3Qgd2ViQ29tcG9uZW50SW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIXRhZy5pbmNsdWRlcygnLScpKSByZXR1cm4gbnVsbDtcbiAgdHJ5IHtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUVsZW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiBjdXN0b21FbGVtZW50cy5nZXQodGFnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZnJhbWV3b3JrOiAnd2ViLWNvbXBvbmVudCcsXG4gICAgICAgIG5hbWU6IHRhZyxcbiAgICAgICAgZGlzcGxheU5hbWU6IHRhZyxcbiAgICAgIH07XG4gICAgfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyBQbHVnLWluIHN0eWxlOiB0cnkgUmVhY3QgZmlyc3QgKG1vc3QgY29tbW9uIGluIG91ciBjYXB0dXJlZCBhcHBzKSxcbi8vIHRoZW4gVnVlLCB0aGVuIExpdCAvIFN0ZW5jaWwgLyBTdmVsdGUgLyBnZW5lcmljIHdlYi1jb21wb25lbnQuIEZpcnN0XG4vLyByZXNvbHZlciB0byByZXR1cm4gbm9uLW51bGwgd2lucy5cbmNvbnN0IGZyYW1ld29ya0luZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PlxuICByZWFjdEluZm8oZWwpIHx8IHZ1ZUluZm8oZWwpIHx8IGxpdEluZm8oZWwpIHx8IHN0ZW5jaWxJbmZvKGVsKSB8fCBzdmVsdGVJbmZvKGVsKSB8fCB3ZWJDb21wb25lbnRJbmZvKGVsKTtcblxuLy8gLS0tLSBDYXB0dXJlOiBhc3NlbWJsZSB0aGUgZnVsbCBlbnRyeSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU3RyaXAgdGhlIGJvZHkgb2YgbG9uZyBgZGF0YTpgIFVSSXMgKFBsYXNtaWMncyBhc3BlY3QtcmF0aW8gU1ZHIHNwYWNlcnMsXG4vLyBpbmxpbmVkIFBORy9KUEVHIGZhbGxiYWNrcykgc2luY2UgdGhlIGJhc2U2NCBwYXlsb2FkIGlzIG1lY2hhbmlzbSwgbm90XG4vLyBzaWduYWwuIEtlZXAgdGhlIHNjaGVtZSArIGEgbGVuZ3RoIGhpbnQgc28gYW4gTExNIGNhbiB0ZWxsIHNvbWV0aGluZ1xuLy8gd2FzIGVsaWRlZC5cbmNvbnN0IGVsaWRlRGF0YVVyaXMgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWwucmVwbGFjZSgvZGF0YTooW1xcdy8rLi1dKyk7YmFzZTY0LChbQS1aYS16MC05Ky89XXs2MCx9KS9nLFxuICAgIChfbSwgbWltZTogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpID0+XG4gICAgICBgZGF0YToke21pbWV9O2Jhc2U2NCxbJHtwYXlsb2FkLmxlbmd0aH0tY2hhciBiYXNlNjQgZWxpZGVkXWApO1xuXG4vLyBSZXBsYWNlIGlubGluZSBpY29uIFNWR3Mgd2l0aCBwbGFjZWhvbGRlcnMuIFRoZSBwYXRoIGRhdGEgb2YgYVxuLy8gTHVjaWRlL0hlcm9pY29uIHJlZnJlc2ggaWNvbiBpcyB+MjgwIGJ5dGVzIHRoYXQgYW4gTExNIGRvZXNuJ3QgbmVlZCDigJRcbi8vIHRoZSBzdXJyb3VuZGluZyBidXR0b24gY2FwdGlvbiBhbHJlYWR5IHRlbGxzIGl0IHdoYXQgdGhlIGljb24gbWVhbnMuXG4vL1xuLy8gQSBzdHJpcHBlZC1kb3duIGA8c3ZnLz5gIGxvc2VzIGljb24gaWRlbnRpdHkgKHdoaWNoIGx1Y2lkZS9mZWF0aGVyL1xuLy8gaGVyb2ljb24gd2FzIHVzZWQ/IHdoYXQgYXJpYS1sYWJlbCBkZXNjcmliZWQgaXQ/IHdoYXQgY2xhc3MgZGlkIGl0XG4vLyBjYXJyeT8pLiBXZSBwcmVzZXJ2ZSBldmVyeSBzaWduYWwgdGhhdCBoZWxwcyBhIHJlcGFpciBhZ2VudCBsb2NhdGVcbi8vIHRoZSBpY29uIGRlZmluaXRpb24gd2l0aG91dCBrZWVwaW5nIHRoZSBwYXRoIGRhdGE6XG4vLyAgIOKAoiBhcmlhLWxhYmVsLCByb2xlLCB0aXRsZSAgICAgICAgIOKAlCBhY2Nlc3NpYmxlIGlkZW50aXR5XG4vLyAgIOKAoiBkYXRhLWljb24sIGRhdGEtbHVjaWRlLCBkYXRhLSogIOKAlCBjb21tb24gaWNvbi1saWJyYXJ5IGhpbnRzXG4vLyAgIOKAoiBjbGFzcyAgICAgICAgICAgICAgICAgICAgICAgICAgICDigJQgc3R5bGUgaG9va3MgKGAuaWNvbi10cmFzaC0yYClcbi8vICAg4oCiIHdpZHRoLCBoZWlnaHQgICAgICAgICAgICAgICAgICAgIOKAlCByZW5kZXJlZCBzaXplXG4vLyAgIOKAoiB2aWV3Qm94ICAgICAgICAgICAgICAgICAgICAgICAgICDigJQgY29vcmRpbmF0ZSBzeXN0ZW0gKGhlbHBzXG4vLyAgICAgbWF0Y2ggYWdhaW5zdCBhIGtub3duIGljb24gbGlicmFyeSBieSBhc3BlY3QgcmF0aW8pXG4vLyAgIOKAoiA8dGl0bGU+LzxkZXNjPiBmaXJzdC1jaGlsZCB0ZXh0IOKAlCBBUklBLXJlY29tbWVuZGVkIGExMXkgY2hpbGRyZW5cbmNvbnN0IFBSRVNFUlZFRF9TVkdfQVRUUl9QUkVGSVhFUyA9IFsnZGF0YS0nLCAnYXJpYS0nXTtcbmNvbnN0IFBSRVNFUlZFRF9TVkdfQVRUUlMgPSBuZXcgU2V0KFsncm9sZScsICdjbGFzcycsICd3aWR0aCcsICdoZWlnaHQnLCAndmlld0JveCcsICd0aXRsZScsICduYW1lJywgJ2ZpbGwnXSk7XG5jb25zdCBlbGlkZUlubGluZVN2Z3MgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWwucmVwbGFjZSgvPHN2Z1xcYihbXj5dKik+KFtcXHNcXFNdKj8pPFxcL3N2Zz4vZywgKF9tLCBhdHRyczogc3RyaW5nLCBib2R5OiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgLy8gUGx1Y2sgZXZlcnkgcHJlc2VydmVkIGF0dHJpYnV0ZSBieSByZWdleCBvdmVyIHRoZSByYXcgYXR0cnMgc3RyaW5nLlxuICAgIC8vIFRoZSByZWdleCB0b2xlcmF0ZXMgdW5xdW90ZWQgdmFsdWVzICsgZG91YmxlICsgc2luZ2xlIHF1b3Rlcy5cbiAgICBjb25zdCBhdHRyUmUgPSAvKFtcXHc6LV0rKVxccyo9XFxzKig/OlwiKFteXCJdKilcInwnKFteJ10qKSd8KFxcUyspKS9nO1xuICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICAgIHdoaWxlICgobSA9IGF0dHJSZS5leGVjKGF0dHJzKSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBtWzFdITtcbiAgICAgIGNvbnN0IHYgPSBtWzJdID8/IG1bM10gPz8gbVs0XSA/PyAnJztcbiAgICAgIGNvbnN0IGtlZXAgPSBQUkVTRVJWRURfU1ZHX0FUVFJTLmhhcyhuYW1lKSB8fCBQUkVTRVJWRURfU1ZHX0FUVFJfUFJFRklYRVMuc29tZSgocCkgPT4gbmFtZS5zdGFydHNXaXRoKHApKTtcbiAgICAgIGlmIChrZWVwKSBvdXQucHVzaChgJHtuYW1lfT1cIiR7di5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyl9XCJgKTtcbiAgICB9XG4gICAgLy8gU3VyZmFjZSBpbm5lciA8dGl0bGU+LzxkZXNjPiB0ZXh0IOKAlCBBUklBLXJlY29tbWVuZGVkIHdheSB0byBsYWJlbFxuICAgIC8vIGFuIFNWRywgYW5kIG9mdGVuIHRoZSBvbmx5IHNpZ25hbCBvZiBpY29uIG1lYW5pbmcgd2hlbiBubyBhcmlhXG4gICAgLy8gYXR0cmlidXRlcyBhcmUgc2V0IG9uIHRoZSBob3N0LlxuICAgIGNvbnN0IHRpdGxlVGV4dCA9IC88dGl0bGVbXj5dKj4oW1xcc1xcU10qPyk8XFwvdGl0bGU+Ly5leGVjKGJvZHkpPy5bMV0/LnRyaW0oKTtcbiAgICBpZiAodGl0bGVUZXh0KSBvdXQucHVzaChgZGF0YS1wZy1zdmctdGl0bGU9XCIke3RpdGxlVGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyl9XCJgKTtcbiAgICBjb25zdCBkZXNjVGV4dCA9IC88ZGVzY1tePl0qPihbXFxzXFxTXSo/KTxcXC9kZXNjPi8uZXhlYyhib2R5KT8uWzFdPy50cmltKCk7XG4gICAgaWYgKGRlc2NUZXh0KSBvdXQucHVzaChgZGF0YS1wZy1zdmctZGVzYz1cIiR7ZGVzY1RleHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpfVwiYCk7XG4gICAgb3V0LnB1c2goJ2RhdGEtcGctZWxpZGVkPVwic3ZnXCInKTtcbiAgICByZXR1cm4gYDxzdmcgJHtvdXQuam9pbignICcpfS8+YDtcbiAgfSk7XG5cbi8vIGA8c2NyaXB0PmAgY29udGVudCBjYW4gY2FycnkgYm9vdHN0cmFwIGRhdGEgKGB3aW5kb3cuX19BUFBfREFUQV9fID1cbi8vIHt0b2tlbjogXCIuLi5cIn1gKSwgQVBJIGtleXMsIHZlbmRvciBhbmFseXRpY3Mga2V5cywgYW5kIGJhY2tlbmQgVVJMcy5cbi8vIGA8c3R5bGU+YCBjb250ZW50IGlzIHVzdWFsbHkgaXJyZWxldmFudCBub2lzZS4gYDxtZXRhPmAgZWxlbWVudHMgb2Z0ZW5cbi8vIGNhcnJ5IENTUkYvQ1NQIHRva2Vucy4gU3RyaXAgdGhlIGlubmVyIGNvbnRlbnRzIG9mIGFsbCB0aHJlZS5cbmNvbnN0IHN0cmlwRGFuZ2Vyb3VzRWxlbWVudHMgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWxcbiAgICAucmVwbGFjZSgvPHNjcmlwdFxcYltePl0qPltcXHNcXFNdKj88XFwvXFxzKnNjcmlwdCg/Olxcc1tePl0qKT8+L2dpLCAnPHNjcmlwdCBkYXRhLXBnLWVsaWRlZD1cInNjcmlwdC1jb250ZW50XCIvPicpXG4gICAgLnJlcGxhY2UoLzxzdHlsZVxcYltePl0qPltcXHNcXFNdKj88XFwvXFxzKnN0eWxlXFxzKj4vZ2ksICc8c3R5bGUgZGF0YS1wZy1lbGlkZWQ9XCJzdHlsZS1jb250ZW50XCIvPicpXG4gICAgLnJlcGxhY2UoLzxtZXRhXFxiW14+XSpcXGJjb250ZW50PVwiW15cIl0qXCJbXj5dKj4vZ2ksIChtKSA9PiB7XG4gICAgICAvLyBLZWVwIG1ldGEgbmFtZS9jaGFyc2V0IHZpc2libGUgYnV0IHJlZGFjdCBgY29udGVudGAgaWYgdGhlIG5hbWVcbiAgICAgIC8vIGxvb2tzIHRva2VuLWJlYXJpbmcuXG4gICAgICBjb25zdCBuYW1lTWF0Y2ggPSAvXFxibmFtZT1cIihbXlwiXSopXCIvLmV4ZWMobSk7XG4gICAgICBjb25zdCBuYW1lID0gbmFtZU1hdGNoPy5bMV0gPz8gJyc7XG4gICAgICBpZiAoLyhjc3JmfHRva2VufHhzcmZ8bm9uY2V8YXBpW18tXT9rZXkpL2kudGVzdChuYW1lKSkge1xuICAgICAgICByZXR1cm4gbS5yZXBsYWNlKC9cXGJjb250ZW50PVwiW15cIl0qXCIvLCAnY29udGVudD1cIltyZWRhY3RlZDogbWV0YS10b2tlbl1cIicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbi8vIENhcCBvdXRlckhUTUwgdG8gYSBjbG9uZSBvZiB0aGUgbGl2ZSBlbGVtZW50IHdpdGggZGVzY2VuZGFudHMgYmV5b25kXG4vLyBgbWF4RGVwdGhgIGxldmVscyByZXBsYWNlZCBieSBgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gIG1hcmtlcnMuIFRoZVxuLy8gcm9hc3QgY2FsbGVkIG91dCBhIHNpbmdsZSBncm91cGVkIGNhcHR1cmUgY29taW5nIGJhY2sgYXQgMjUgS0IgYmVjYXVzZVxuLy8gdGhlIGBvdXRlckhUTUxgIHN3YWxsb3dlZCA2MCBzcGFya2xpbmUgZGF0YSBzcGFucyDigJQgZXhhY3RseSB3aGF0IGFcbi8vIGRlcHRoIGNhcCBzb2x2ZXMgYXQgdGhlIHNvdXJjZS4gUmV0dXJucyB0aGUgY2xvbmVkIG91dGVySFRNTCBhbmQgaG93XG4vLyBtYW55IGRlc2NlbmRhbnQgc3VidHJlZXMgd2VyZSBlbGlkZWQuXG4vLyBTZXJpYWxpemUgYW4gZWxlbWVudCdzIHNoYWRvd1Jvb3QgY29udGVudCBhcyBgPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPVwi4oCmXCI+4oCmPC90ZW1wbGF0ZT5gLlxuLy8gYGNsb25lTm9kZSh0cnVlKWAgZG9lcyBOT1QgaW5jbHVkZSBzaGFkb3cgRE9NLCBzbyBjYXB0dXJlcyBvZiBjdXN0b20tZWxlbWVudFxuLy8gaG9zdHMgKExpdCdzIGA8Zm9yZWNhc3QtaXRlbT5gLCBTdGVuY2lsIGNvbXBvbmVudHMsIGdlbmVyaWMgd2ViLWNvbXBvbmVudHMpXG4vLyB3b3VsZCBvdGhlcndpc2UgY29tZSBiYWNrIGFzIGA8Zm9yZWNhc3QtaXRlbT48L2ZvcmVjYXN0LWl0ZW0+YCDigJQgYW4gTExNXG4vLyByZWFkaW5nIHRoYXQgcm93IHNlZXMgbm90aGluZyBhYm91dCB3aGF0IHRoZSBob3N0IGFjdHVhbGx5IHJlbmRlcnMuIFdlIHVzZVxuLy8gdGhlIGRlY2xhcmF0aXZlLXNoYWRvdy1ET00gc2VyaWFsaXphdGlvbiBzaGFwZSBzbyB0aGUgTExNIChhbmQgYW55IHRvb2xpbmcpXG4vLyBjYW4gdGVsbCBzaGFkb3cgY29udGVudCBmcm9tIGxpZ2h0LURPTSBjaGlsZHJlbiwgQU5EIHNvIHRoZSBwYXlsb2FkIGlzXG4vLyByb3VuZC10cmlwcGFibGUgaW50byBhbm90aGVyIGJyb3dzZXIgaWYgYSBjb25zdW1lciB3YW50cyB0by5cbmNvbnN0IHNlcmlhbGl6ZVNoYWRvd0NvbnRlbnQgPSAoaG9zdDogRWxlbWVudCwgZGVwdGg6IG51bWJlciwgbWF4RGVwdGg6IG51bWJlciwgZWxpZGVkOiB7Y291bnQ6IG51bWJlcn0pOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgY29uc3Qgc3IgPSAoaG9zdCBhcyBhbnkpLnNoYWRvd1Jvb3QgYXMgU2hhZG93Um9vdCB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIGlmICghc3IpIHJldHVybiBudWxsO1xuICBjb25zdCBtb2RlID0gc3IubW9kZSB8fCAnb3Blbic7XG4gIC8vIENsb25lIGVhY2ggdG9wLWxldmVsIHNoYWRvdyBjaGlsZCBpbmRpdmlkdWFsbHkgc28gd2UgY2FuIGFwcGx5IHRoZSBzYW1lXG4gIC8vIGRlcHRoLWNhcCB3YWxrZXIgdG8gdGhlbS5cbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShzci5jaGlsZHJlbikpIHtcbiAgICBwYXJ0cy5wdXNoKHNlcmlhbGl6ZVdpdGhTaGFkb3coY2hpbGQsIGRlcHRoICsgMSwgbWF4RGVwdGgsIGVsaWRlZCkpO1xuICB9XG4gIHJldHVybiBgPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPVwiJHttb2RlfVwiPiR7cGFydHMuam9pbignJyl9PC90ZW1wbGF0ZT5gO1xufTtcblxuLy8gU2VyaWFsaXplIGFuIGVsZW1lbnQgKyBpdHMgc2hhZG93IGNvbnRlbnQgaW50byBIVE1MLCBhcHBseWluZyB0aGVcbi8vIGRlcHRoLWNhcCB3YWxrZXIgdW5pZm9ybWx5IHRvIGJvdGguIENhbGxlciBwYXNzZXMgYSBzaGFyZWQgYGVsaWRlZGBcbi8vIGNvdW50ZXIgc28gdGhlIGZpbmFsIGNvdW50IHJlZmxlY3RzIGFsbCBzdWJ0cmVlcyB3ZSBjb2xsYXBzZWQuXG5jb25zdCBzZXJpYWxpemVXaXRoU2hhZG93ID0gKGVsOiBFbGVtZW50LCBkZXB0aDogbnVtYmVyLCBtYXhEZXB0aDogbnVtYmVyLCBlbGlkZWQ6IHtjb3VudDogbnVtYmVyfSk6IHN0cmluZyA9PiB7XG4gIC8vIFJlY29uc3RydWN0IHRoZSBvcGVuIHRhZyBmcm9tIGF0dHJpYnV0ZXMgKGlubmVySFRNTCB3b3VsZCBiZSBjaGVhcGVyXG4gIC8vIGJ1dCB3ZSBjYW4ndCBjb21iaW5lIGl0IHdpdGggYSBtYW51YWxseS1zZXJpYWxpemVkIHNoYWRvdyByb290KS5cbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBhdHRyczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKGVsLmF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKSkge1xuICAgICAgLy8gRXNjYXBlIGF0dHJpYnV0ZSB2YWx1ZSdzIGRvdWJsZS1xdW90ZXMgYW5kIGFtcGVyc2FuZHMgc28gdGhlXG4gICAgICAvLyBwcm9kdWNlZCBIVE1MIHJvdW5kLXRyaXBzLlxuICAgICAgY29uc3QgdiA9IFN0cmluZyhhLnZhbHVlKS5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICAgIGF0dHJzLnB1c2goYCR7YS5uYW1lfT1cIiR7dn1cImApO1xuICAgIH1cbiAgfVxuICBjb25zdCBvcGVuID0gYDwke3RhZ30ke2F0dHJzLmxlbmd0aCA/ICcgJyArIGF0dHJzLmpvaW4oJyAnKSA6ICcnfT5gO1xuICAvLyBTZWxmLWNsb3Npbmcgdm9pZHMg4oCUIG1hdGNoIEhUTUwgc3BlYyBzZXJpYWxpemVyIGJlaGF2aW9yLlxuICBjb25zdCBWT0lEID0gbmV3IFNldChbJ2FyZWEnLCAnYmFzZScsICdicicsICdjb2wnLCAnZW1iZWQnLCAnaHInLCAnaW1nJywgJ2lucHV0JywgJ2xpbmsnLCAnbWV0YScsICdwYXJhbScsICdzb3VyY2UnLCAndHJhY2snLCAnd2JyJ10pO1xuICBpZiAoVk9JRC5oYXModGFnKSkgcmV0dXJuIG9wZW47XG5cbiAgY29uc3Qgc2hhZG93ID0gc2VyaWFsaXplU2hhZG93Q29udGVudChlbCwgZGVwdGgsIG1heERlcHRoLCBlbGlkZWQpO1xuXG4gIC8vIERlcHRoIGNhcCBraWNrcyBpbiBmb3IgdGhlIExJR0hULURPTSBjaGlsZHJlbiBvbmx5OyB0aGUgc2hhZG93IGNvbnRlbnRcbiAgLy8gYWxyZWFkeSBjb3VudHMgaXRzIG93biBkZXB0aCB2aWEgdGhlIHJlY3Vyc2l2ZSBjYWxsLlxuICBsZXQgbGlnaHRJbm5lcjogc3RyaW5nO1xuICBpZiAoZGVwdGggPj0gbWF4RGVwdGggJiYgZWwuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgY29uc3QgY291bnQgPSBlbC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgZWxpZGVkLmNvdW50ICs9IGNvdW50O1xuICAgIGxpZ2h0SW5uZXIgPSBgPCEtLSAke2NvdW50fSAke2NvdW50ID09PSAxID8gJ2NoaWxkJyA6ICdjaGlsZHJlbid9IGVsaWRlZCAtLT5gO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNlZ3M6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBub2RlIG9mIEFycmF5LmZyb20oZWwuY2hpbGROb2RlcykpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxIC8qIGVsZW1lbnQgKi8pIHtcbiAgICAgICAgc2Vncy5wdXNoKHNlcmlhbGl6ZVdpdGhTaGFkb3cobm9kZSBhcyBFbGVtZW50LCBkZXB0aCArIDEsIG1heERlcHRoLCBlbGlkZWQpKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAvKiB0ZXh0ICovKSB7XG4gICAgICAgIHNlZ3MucHVzaChTdHJpbmcobm9kZS5ub2RlVmFsdWUgPz8gJycpLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDggLyogY29tbWVudCAqLykge1xuICAgICAgICBzZWdzLnB1c2goYDwhLS0ke1N0cmluZyhub2RlLm5vZGVWYWx1ZSA/PyAnJyl9LS0+YCk7XG4gICAgICB9XG4gICAgfVxuICAgIGxpZ2h0SW5uZXIgPSBzZWdzLmpvaW4oJycpO1xuICB9XG4gIC8vIERlY2xhcmF0aXZlIHNoYWRvdyBET00gY29udmVudGlvbjogPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPiBzaXRzIGFzIHRoZVxuICAvLyBmaXJzdCBjaGlsZCBvZiB0aGUgaG9zdCdzIGNvbnRlbnQsIEJFRk9SRSBsaWdodC1ET00gY2hpbGRyZW4uIE1pcnJvcnNcbiAgLy8gdGhlIHNwZWMgc28gYW4gTExNIChvciBIVE1MIHBhcnNlcikgcmVhZGluZyB0aGlzIGtub3dzIHNoYWRvdyBmcm9tIGxpZ2h0LlxuICByZXR1cm4gYCR7b3Blbn0ke3NoYWRvdyA/PyAnJ30ke2xpZ2h0SW5uZXJ9PC8ke3RhZ30+YDtcbn07XG5cbmNvbnN0IGNhcHBlZE91dGVySFRNTCA9IChlbDogRWxlbWVudCwgbWF4RGVwdGggPSAyKToge2h0bWw6IHN0cmluZzsgZWxpZGVkOiBudW1iZXJ9ID0+IHtcbiAgLy8gRmFzdCBwYXRoOiBlbGVtZW50IGhhcyBubyBzaGFkb3cgcm9vdCBhbmQgbmVpdGhlciBkbyBpdHMgZGVzY2VuZGFudHNcbiAgLy8gd2UnZCB0b3VjaC4gY2xvbmVOb2RlICsgdGhlIG9yaWdpbmFsIHdhbGsgaXMgY2hlYXBlciB0aGFuIHRoZSBtYW51YWxcbiAgLy8gc2VyaWFsaXplciwgYW5kIGl0IHByZXNlcnZlcyBxdWlya3MgKGJvb2xlYW4gYXR0cmlidXRlIHNlcmlhbGl6YXRpb24sXG4gIC8vIG5hbWVzcGFjZWQgU1ZHLCBldGMuKSB0aGF0IHRoZSBtYW51YWwgcGF0aCBhcHByb3hpbWF0ZXMuXG4gIGNvbnN0IGhhc0FueVNoYWRvdyA9ICgoKSA9PiB7XG4gICAgaWYgKChlbCBhcyBhbnkpLnNoYWRvd1Jvb3QpIHJldHVybiB0cnVlO1xuICAgIC8vIENoZWFwIHNjYW46IGxvb2sgYXQgdGhlIGZpcnN0IH41MCBkZXNjZW5kYW50cyBmb3IgYSBzaGFkb3dSb290LiBBXG4gICAgLy8gcGFnZSB3aXRoIG1hbnkgc2hhZG93IGhvc3RzIGlzIHJhcmUgaW4gbGlnaHQtRE9NIGFwcHM7IHRoZSBjb3N0IG9mXG4gICAgLy8gdGhlIGZ1bGwgc2NhbiB3b3VsZCBkZWZlYXQgdGhlIHB1cnBvc2UuIDUwIGlzIGVub3VnaCB0byBjYXRjaCB0aGVcbiAgICAvLyBjb21tb24gY2FzZSAoYSBzaW5nbGUgc2hhZG93IHJvb3QgaW5zaWRlIHRoZSBjYXB0dXJlZCBzdWJ0cmVlKS5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZGVzYyA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcbiAgICAgIGNvbnN0IE4gPSBNYXRoLm1pbihkZXNjLmxlbmd0aCwgNTApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIGlmICgoZGVzY1tpXSBhcyBhbnkpLnNoYWRvd1Jvb3QpIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKTtcbiAgaWYgKGhhc0FueVNoYWRvdykge1xuICAgIGNvbnN0IGVsaWRlZCA9IHtjb3VudDogMH07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGh0bWwgPSBzZXJpYWxpemVXaXRoU2hhZG93KGVsLCAwLCBtYXhEZXB0aCwgZWxpZGVkKTtcbiAgICAgIHJldHVybiB7aHRtbCwgZWxpZGVkOiBlbGlkZWQuY291bnR9O1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRmFsbCB0aHJvdWdoIHRvIGNsb25lTm9kZSBwYXRoIGFzIGEgc2FmZXR5IG5ldC5cbiAgICB9XG4gIH1cbiAgbGV0IGVsaWRlZCA9IDA7XG4gIHRyeSB7XG4gICAgY29uc3QgY2xvbmUgPSBlbC5jbG9uZU5vZGUodHJ1ZSkgYXMgRWxlbWVudDtcbiAgICBjb25zdCB3YWxrID0gKG5vZGU6IEVsZW1lbnQsIGRlcHRoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiB8fCAhbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcbiAgICAgIGlmIChkZXB0aCA+PSBtYXhEZXB0aCkge1xuICAgICAgICBjb25zdCBjb3VudCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICBlbGlkZWQgKz0gY291bnQ7XG4gICAgICAgIG5vZGUuaW5uZXJIVE1MID0gYDwhLS0gJHtjb3VudH0gJHtjb3VudCA9PT0gMSA/ICdjaGlsZCcgOiAnY2hpbGRyZW4nfSBlbGlkZWQgLS0+YDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGRyZW4pKSB3YWxrKGNoaWxkLCBkZXB0aCArIDEpO1xuICAgIH07XG4gICAgd2FsayhjbG9uZSwgMCk7XG4gICAgcmV0dXJuIHtodG1sOiBjbG9uZS5vdXRlckhUTUwsIGVsaWRlZH07XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7aHRtbDogZWwub3V0ZXJIVE1MLCBlbGlkZWQ6IDB9O1xuICB9XG59O1xuXG4vLyBSZXR1cm5zIEJPVEggdGhlIHRyaW1tZWQgSFRNTCBhbmQgdGhlIG9yaWdpbmFsIGJ5dGUgbGVuZ3RoIHdoZW4gdGhlXG4vLyB0cmltIGNhcCBraWNrZWQgaW4uIExldHMgY2FwdHVyZUVudHJ5IGV4cG9zZSBgdHJ1bmNhdGVkLm91dGVySFRNTGBcbi8vIChwZXIgQlVHLTAxMykgc28gYSBjb25zdW1lciBjYW4gZGV0ZWN0IGVsaXNpb24gYW5kIHJlZmV0Y2ggaWYgbmVlZGVkLlxuY29uc3QgdHJpbUh0bWxXaXRoU2l6ZSA9IChodG1sOiBzdHJpbmcsIG1heDogbnVtYmVyKToge3ZhbHVlOiBzdHJpbmc7IHRydW5jYXRlZD86IG51bWJlcn0gPT4ge1xuICBpZiAoIWh0bWwpIHJldHVybiB7dmFsdWU6IGh0bWx9O1xuICBsZXQgY2xlYW5lZCA9IGVsaWRlRGF0YVVyaXMoaHRtbCk7XG4gIGNsZWFuZWQgPSBlbGlkZUlubGluZVN2Z3MoY2xlYW5lZCk7XG4gIGNsZWFuZWQgPSBzdHJpcERhbmdlcm91c0VsZW1lbnRzKGNsZWFuZWQpO1xuICBpZiAoY2xlYW5lZC5sZW5ndGggPD0gbWF4KSByZXR1cm4ge3ZhbHVlOiBjbGVhbmVkfTtcbiAgY29uc3Qgb3JpZ2luYWxMZW4gPSBodG1sLmxlbmd0aDtcbiAgY29uc3QgY3V0ID0gY2xlYW5lZC5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0ID0gY3V0Lmxhc3RJbmRleE9mKCc+Jyk7XG4gIGNvbnN0IHZhbHVlID0gKGxhc3QgPiBtYXggLSAyMDAgPyBjdXQuc2xpY2UoMCwgbGFzdCArIDEpIDogY3V0KSArICfigKYnO1xuICByZXR1cm4ge3ZhbHVlLCB0cnVuY2F0ZWQ6IG9yaWdpbmFsTGVufTtcbn07XG5cbmNvbnN0IHRyaW1IdG1sID0gKGh0bWw6IHN0cmluZywgbWF4OiBudW1iZXIpOiBzdHJpbmcgPT4gdHJpbUh0bWxXaXRoU2l6ZShodG1sLCBtYXgpLnZhbHVlO1xuXG5jb25zdCByZWN0T2YgPSAoZWw6IEVsZW1lbnQpOiBSZWN0ID0+IHtcbiAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4ge3g6IE1hdGgucm91bmQoci54KSwgeTogTWF0aC5yb3VuZChyLnkpLCB3OiBNYXRoLnJvdW5kKHIud2lkdGgpLCBoOiBNYXRoLnJvdW5kKHIuaGVpZ2h0KX07XG59O1xuXG4vLyBHZW5lcmF0ZSBhIHV1aWQgdGhhdCB3b3JrcyBpbiBzZXJ2aWNlIHdvcmtlcnMsIGNvbnRlbnQgc2NyaXB0cywgYW5kXG4vLyBvbGRlciBDaHJvbWUgY29udGV4dHMuIGNyeXB0by5yYW5kb21VVUlEIGV4aXN0cyBpbiBtb2Rlcm4gYnJvd3NlcnM7IHRoZVxuLy8gZmFsbGJhY2sgdXNlcyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIGlmIGF2YWlsYWJsZSwgZWxzZSBhIHBlci1wYWdlIGNvdW50ZXIuXG5sZXQgZmFsbGJhY2tVaWRDb3VudGVyID0gMDtcbmNvbnN0IHV1aWQgPSAoKTogc3RyaW5nID0+IHtcbiAgdHJ5IHsgaWYgKGNyeXB0by5yYW5kb21VVUlEKSByZXR1cm4gY3J5cHRvLnJhbmRvbVVVSUQoKTsgfSBjYXRjaCB7IC8qIGZhbGwgdGhyb3VnaCAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3QgYSA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGEpO1xuICAgIGFbNl0gPSAoYVs2XSEgJiAweDBmKSB8IDB4NDA7XG4gICAgYVs4XSA9IChhWzhdISAmIDB4M2YpIHwgMHg4MDtcbiAgICBjb25zdCBoID0gQXJyYXkuZnJvbShhKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIHJldHVybiBgJHtoLnNsaWNlKDAsIDgpfS0ke2guc2xpY2UoOCwgMTIpfS0ke2guc2xpY2UoMTIsIDE2KX0tJHtoLnNsaWNlKDE2LCAyMCl9LSR7aC5zbGljZSgyMCl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGB1aWRfJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX1fJHsoKytmYWxsYmFja1VpZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB9XG59O1xuXG4vLyBUcnVlIGlmIGBlbGAgaGFzIGF0IGxlYXN0IG9uZSBkaXJlY3QgdGV4dC1ub2RlIGNoaWxkIHdpdGggbm9uLXdoaXRlc3BhY2Vcbi8vIGNvbnRlbnQuIFRoZSByb2FzdCBjYXVnaHQgdXMgZW1pdHRpbmcgY29uY2F0ZW5hdGVkIGRlc2NlbmRhbnQgdGV4dCBvblxuLy8gY29udGFpbmVyIGVsZW1lbnRzIChgPGhlYWRlcj5gLCBgPG1haW4+YCwgZXRjLikgYXMgYHRleHRgIOKAlCB3aGljaFxuLy8gcHJvZHVjZWQgMjAwLWNoYXIgZHVtcHMgdGhhdCB3ZXJlIG5vaXNlIHRvIExMTXMuIE9ubHkgZW1pdCBgdGV4dGAgd2hlblxuLy8gdGhlIGVsZW1lbnQgZGlyZWN0bHkgb3ducyB0ZXh0IG9yIGlzIG90aGVyd2lzZSBhIGNvbnRlbnQtYmVhcmluZyBsZWFmLlxuY29uc3QgaGFzT3duVGV4dE5vZGUgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgZm9yIChjb25zdCBub2RlIG9mIEFycmF5LmZyb20oZWwuY2hpbGROb2RlcykpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAvKiBURVhUX05PREUgKi8pIHtcbiAgICAgIGNvbnN0IHYgPSAobm9kZSBhcyBUZXh0KS5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBpZiAodi50cmltKCkubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIE9wdGlvbmFsIGNsaWNrIGNvbnRleHQuIFRocmVhZGVkIGJ5IHRoZSBjb250ZW50LXNjcmlwdCB3aGVuIHRoZVxuLy8gY2FwdHVyZSBpcyBkcml2ZW4gYnkgYSBjbGljayAoYWx0LWNsaWNrLCBhbHQtc2hpZnQtY2xpY2ssIGFsdC1kcmFnKTtcbi8vIGFic2VudCBmb3IgbWFudWFsLWNhcHR1cmUgLyByZWNhcHR1cmUgLyBwcm9ncmFtbWF0aWMgZmxvd3MuIFVzZWQgdG9cbi8vIGNvbXB1dGUgY2FudmFzLXJlbGF0aXZlIGNsaWNrIGNvb3JkaW5hdGVzIHdoZW4gdGhlIGNhcHR1cmVkIGVsZW1lbnRcbi8vIGxpdmVzIGluc2lkZSBhIGA8Y2FudmFzPmAuXG5leHBvcnQgdHlwZSBDYXB0dXJlT3B0cyA9IHtcbiAgY2xpY2tBdD86IHtjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlcn07XG59O1xuXG5jb25zdCBmaW5kQ2FudmFzQW5jZXN0b3IgPSAoZWw6IEVsZW1lbnQpOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPT4ge1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsO1xuICB3aGlsZSAoY3VyKSB7XG4gICAgaWYgKGN1ciBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSByZXR1cm4gY3VyO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhcHR1cmVFbnRyeSA9IChlbDogRWxlbWVudCwgc2VxdWVuY2U6IG51bWJlciwgb3B0czogQ2FwdHVyZU9wdHMgPSB7fSk6IEVudHJ5ID0+IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAvLyB0ZXh0Q29udGVudCAoTk9UIGlubmVyVGV4dCkgc28gc291cmNlIGBSZWZyZXNoYCBkb2Vzbid0IGdldCBjYXB0dXJlZFxuICAvLyBhcyB0aGUgQ1NTLXJlbmRlcmVkIGBSRUZSRVNIYC4gUm9hc3QgQlVHLTAwMS5cbiAgLy8gU2tpcCBvbiBub24tbGVhZiBjb250YWluZXJzIHRoYXQgZG9uJ3Qgb3duIGRpcmVjdCB0ZXh0IOKAlCBvdGhlcndpc2VcbiAgLy8gdGhlIHZhbHVlIGlzIHRoZSBjb25jYXRlbmF0aW9uIG9mIGV2ZXJ5IGRlc2NlbmRhbnQncyB0ZXh0LCBvZnRlblxuICAvLyB0cnVuY2F0ZWQgbWlkLXdvcmQsIHdoaWNoIGFuIExMTSB0cmVhdHMgYXMgb25lIHdhbGwgb2YgbXVzaC5cbiAgY29uc3QgaXNMZWFmaXNoID0gIWVsLmNoaWxkcmVuPy5sZW5ndGggfHwgaGFzT3duVGV4dE5vZGUoZWwpO1xuICBjb25zdCB0ZXh0ID0gaXNMZWFmaXNoID8gdHJpbVRleHQoZWwudGV4dENvbnRlbnQsIDI1MCkgOiAnJztcbiAgY29uc3Qgcm9sZSA9IGF0dHIoZWwsICdyb2xlJykgfHwgaW1wbGljaXRSb2xlKGVsKTtcbiAgLy8gQ2FwdHVyZSB0aGUgdmlzdWFsbHktcmVuZGVyZWQgZm9ybSB0b28gd2hlbiBDU1MgdHJhbnNmb3JtZWQgaXQuIFVzZWZ1bFxuICAvLyBmb3IgTExNcyB0aGF0IG5lZWQgYm90aCBzb3VyY2UgYW5kIHJlbmRlcmVkIGZvciBhIFVJIGJ1ZyBsaWtlIFwidGhlXG4gIC8vIGxhYmVsIHNheXMgU05PT1pFIDFIIGluIHRoZSBzY3JlZW5zaG90IGJ1dCB0aGUgc291cmNlIGhhcyBTbm9vemUgMWhcIi5cbiAgY29uc3QgcmVuZGVyZWRUZXh0ID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBpZiAoY3MudGV4dFRyYW5zZm9ybSAmJiBjcy50ZXh0VHJhbnNmb3JtICE9PSAnbm9uZScpIHtcbiAgICAgICAgY29uc3QgciA9IHRyaW1UZXh0KChlbCBhcyBIVE1MRWxlbWVudCkuaW5uZXJUZXh0LCAyNTApO1xuICAgICAgICByZXR1cm4gciAmJiByICE9PSB0ZXh0ID8gciA6IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pKCk7XG4gIGNvbnN0IGFjY05hbWUgPSBhY2Nlc3NpYmxlTmFtZShlbCwgcm9sZSk7XG4gIGNvbnN0IHRlc3RJZCA9IGF0dHIoZWwsICdkYXRhLXRlc3RpZCcpIHx8IGF0dHIoZWwsICdkYXRhLXRlc3QnKSB8fFxuICAgIGF0dHIoZWwsICdkYXRhLWN5JykgfHwgYXR0cihlbCwgJ2RhdGEtcWEnKTtcbiAgY29uc3Qgc3RhYmxlSWQgPSBpc1N0YWJsZUlkKGVsLmlkKSA/IGVsLmlkIDogbnVsbDtcbiAgY29uc3QgY2xhc3NlcyA9IGVsLmNsYXNzTGlzdCA/IEFycmF5LmZyb20oZWwuY2xhc3NMaXN0KS5zbGljZSgwLCAzMikgOiBbXTtcbiAgY29uc3Qge2F0dHJzLCBoaW50c30gPSBwb3B1bGF0ZWRBdHRycyhlbCk7XG4gIGNvbnN0IGNvbXBSb290ID0gY29tcG9uZW50Um9vdChlbCk7XG4gIGNvbnN0IGZ3ayA9IGZyYW1ld29ya0luZm8oZWwpO1xuICBjb25zdCB0cnVlU3RhdGVzID0gcGlja1RydWVTdGF0ZXMoZWwpO1xuICBjb25zdCBzdHlsZXMgPSBlc3NlbnRpYWxTdHlsZXMoZWwpO1xuICBjb25zdCBwc2V1ZG8gPSBwc2V1ZG9TdHlsZXMoZWwpO1xuICBjb25zdCBydWxlcyA9IGNvbGxlY3RNYXRjaGVkUnVsZXMoZWwpO1xuICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgY29uc3QgaW5TaGFkb3cgPSByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdDtcbiAgLy8gU2hhZG93LXJvb3RlZCBlbGVtZW50cyBhcmVuJ3QgcmVhY2hhYmxlIGZyb20gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgLFxuICAvLyBzbyB1bmlxdWVuZXNzIGNoZWNrcyBhZ2FpbnN0IHRoZSBkb2N1bWVudCBhbHdheXMgZmFpbC4gU2NvcGUgdG8gdGhlXG4gIC8vIG93bmluZyBTaGFkb3dSb290IHdoZW4gcHJlc2VudCDigJQgdGhhdCdzIGFsc28gd2hlcmUgYSBjb25zdW1lciBxdWVyeWluZ1xuICAvLyBgc2hhZG93SG9zdC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoLi4uKWAgd291bGQgcmVzb2x2ZSB0aGUgc2VsZWN0b3IuXG4gIGNvbnN0IHNjb3BlOiBEb2N1bWVudCB8IFNoYWRvd1Jvb3QgPSBpblNoYWRvdyA/IChyb290IGFzIFNoYWRvd1Jvb3QpIDogZG9jdW1lbnQ7XG5cbiAgLy8gVGVzdC1JRHMgYW5kIHN0YWJsZSBJRHMgYXJlIFBSRUZFUlJFRCwgYnV0IG9ubHkgd2hlbiBhY3R1YWxseSB1bmlxdWUgb25cbiAgLy8gdGhlIHBhZ2UuIFJlYWwtd29ybGQgd2VhdGhlci9saXN0IFVJcyBjb21tb25seSB0YWcgZXZlcnkgY2FyZCB3aXRoIHRoZVxuICAvLyBzYW1lIGBkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cImAg4oCUIGVtaXR0aW5nIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYFxuICAvLyB3b3VsZCByZXNvbHZlIHRvIDcgZWxlbWVudHMgYW5kIHRoZSBjb25zdW1lciBjYW4ndCB0ZWxsIHdoaWNoIG9uZSB3YXNcbiAgLy8gY2FwdHVyZWQuIFdoZW4gdGhlIHRlc3RJZCAvIHN0YWJsZUlkIGlzIG5vbi11bmlxdWUgd2UgZmFsbCB0aHJvdWdoIHRvXG4gIC8vIGNzc1BhdGgsIHdoaWNoIGFkZHMgd2hhdGV2ZXIgcGF0aCAvIGFuY2VzdG9yIHNjb3BlIG1ha2VzIHRoZSBjYXB0dXJlZFxuICAvLyBlbGVtZW50IGFkZHJlc3NhYmxlLlxuICBsZXQgc2VsZWN0b3I6IHN0cmluZztcbiAgaWYgKHRlc3RJZCkge1xuICAgIGNvbnN0IHRlc3RJZFNlbCA9IGBbZGF0YS10ZXN0aWQ9XCIke3Rlc3RJZH1cIl1gO1xuICAgIGlmIChpc1VuaXF1ZShzY29wZSwgdGVzdElkU2VsLCBlbCkpIHtcbiAgICAgIHNlbGVjdG9yID0gdGVzdElkU2VsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUcnkgYW5jaG9yaW5nIHRoZSB0ZXN0SWQgdG8gYSB1bmlxdWUgYW5jZXN0b3IsIG9yIGFwcGVuZGluZyB0aGVcbiAgICAgIC8vIGNhcHR1cmVkIGVsZW1lbnQncyBwYXRoLXRhaWwuIGNzc1BhdGgoKSBhbHJlYWR5IGRvZXMgYm90aCB2aWEgdGhlXG4gICAgICAvLyBBUklBIC8gcm9sZSAvIHVuaXF1ZS1jbGFzcyBhbmNlc3RvciBsYWRkZXIsIGJ1dCBpdCBkb2Vzbid0IFNUQVJUXG4gICAgICAvLyBmcm9tIHRoZSB0ZXN0SWQuIFdlIGJpYXMgdG93YXJkIGtlZXBpbmcgdGhlIHRlc3RJZCB2aXNpYmxlIGJ5XG4gICAgICAvLyBwYWlyaW5nIGl0IHdpdGggYSBjaGlsZCBkZXNjcmlwdG9yIHRoYXQgZGlzdGluZ3Vpc2hlcyBzaWJsaW5ncy5cbiAgICAgIGNvbnN0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICBsZXQgc2NvcGVkID0gJyc7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGNvbnN0IHNhbWVUYWdTaWJzID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoYykgPT4gYy5ub2RlTmFtZSA9PT0gZWwubm9kZU5hbWUpO1xuICAgICAgICBpZiAoc2FtZVRhZ1NpYnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHNjb3BlZCA9IGAke3Rlc3RJZFNlbH06bnRoLW9mLXR5cGUoJHtzYW1lVGFnU2licy5pbmRleE9mKGVsKSArIDF9KWA7XG4gICAgICAgICAgaWYgKGlzVW5pcXVlKHNjb3BlLCBzY29wZWQsIGVsKSkge1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBzY29wZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHN0YWJsZUlkKSB7XG4gICAgY29uc3QgaWRTZWwgPSBgIyR7ZXNjYXBlQ3NzKHN0YWJsZUlkKX1gO1xuICAgIHNlbGVjdG9yID0gaXNVbmlxdWUoc2NvcGUsIGlkU2VsLCBlbCkgPyBpZFNlbCA6IGNzc1BhdGgoZWwpO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gIH1cblxuICAvLyBDYXAgb3V0ZXJIVE1MIGF0IGRlcHRoPTIgQkVGT1JFIHRoZSBsZW5ndGgtY2FwIHBhc3M6IGEgc3BhcmtsaW5lXG4gIC8vIHdyYXBwZXIgd2l0aCA2MCBkYXRhIHNwYW5zIHdvdWxkIG90aGVyd2lzZSBjb25zdW1lIH45IEtCIG9mIG9uZVxuICAvLyBlbnRyeS4gQ2xvbmluZyBpbnRvIGEgZGV0YWNoZWQgc3VidHJlZSBsZXRzIHVzIHJlcGxhY2UgZGVlcFxuICAvLyBjaGlsZHJlbiB3aXRoIGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmAgbWFya2VycyB3aXRob3V0XG4gIC8vIHRvdWNoaW5nIHRoZSBsaXZlIERPTS5cbiAgY29uc3QgY2FwcGVkSHRtbCA9IGNhcHBlZE91dGVySFRNTChlbCwgMik7XG4gIGNvbnN0IHRyaW1tZWQgPSB0cmltSHRtbFdpdGhTaXplKGNhcHBlZEh0bWwuaHRtbCwgTUFYX1NOSVBQRVQpO1xuICBjb25zdCBvdXQ6IEVudHJ5ID0ge1xuICAgIHVpZDogdXVpZCgpLFxuICAgIG46IHNlcXVlbmNlLFxuICAgIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgIHRhZyxcbiAgICBzZWxlY3RvcixcbiAgICBvdXRlckhUTUw6IHRyaW1tZWQudmFsdWUsXG4gICAgcmVjdDogcmVjdE9mKGVsKSxcbiAgICAvLyBSb3VuZCBkcHIgdG8gMiBkZWNpbWFscyDigJQgV2luZG93cyBkaXNwbGF5IHNjYWxpbmcgcmVwb3J0cyByYXcgdmFsdWVzXG4gICAgLy8gbGlrZSAxLjc5OTk5OTk1MjMxNjI4NDIgKD09IDEuOCkgd2hpY2ggaXMgZmxvYXQtYXJpdGhtZXRpYyBub2lzZS5cbiAgICAvLyBDYXB0dXJlIHVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSB0b28gKGxpZ2h0IHZzIGRhcmssIG1vdGlvblxuICAgIC8vIHByZWYpIHNvIGEgZG93bnN0cmVhbSBMTE0gY2FuIHJlYXNvbiBhYm91dCB3aHkgYSBjYXB0dXJlZFxuICAgIC8vIGFwcGVhcmFuY2UgbWlnaHQgZGlmZmVyIGJldHdlZW4gc2Vzc2lvbnMuXG4gICAgdmlld3BvcnQ6IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCgpLFxuICB9O1xuICBpZiAoY2FwcGVkSHRtbC5lbGlkZWQgPiAwIHx8IHRyaW1tZWQudHJ1bmNhdGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXQudHJ1bmNhdGVkID0ge307XG4gICAgaWYgKGNhcHBlZEh0bWwuZWxpZGVkID4gMCkgb3V0LnRydW5jYXRlZC5jaGlsZHJlbiA9IGNhcHBlZEh0bWwuZWxpZGVkO1xuICAgIGlmICh0cmltbWVkLnRydW5jYXRlZCAhPT0gdW5kZWZpbmVkKSBvdXQudHJ1bmNhdGVkLm91dGVySFRNTCA9IHRyaW1tZWQudHJ1bmNhdGVkO1xuICB9XG4gIGlmICh0ZXh0KSBvdXQudGV4dCA9IHRleHQ7XG4gIGlmIChyZW5kZXJlZFRleHQpIG91dC5yZW5kZXJlZFRleHQgPSByZW5kZXJlZFRleHQ7XG4gIGlmIChyb2xlKSBvdXQucm9sZSA9IHJvbGU7XG4gIGlmIChhY2NOYW1lICYmIGFjY05hbWUgIT09IHRleHQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IGFjY05hbWU7XG4gIGlmIChzdGFibGVJZCkgb3V0LmlkID0gc3RhYmxlSWQ7XG4gIGlmICh0ZXN0SWQpIG91dC50ZXN0SWQgPSB0ZXN0SWQ7XG4gIGlmIChjbGFzc2VzLmxlbmd0aCkgb3V0LmNsYXNzZXMgPSBjbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoYXR0cnMpLmxlbmd0aCkgb3V0LmF0dHJzID0gYXR0cnM7XG4gIGlmIChoaW50cykgb3V0LmhpbnRzID0gaGludHM7XG4gIGlmIChpblNoYWRvdykge1xuICAgIG91dC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgY29uc3Qgc2ggPSBzaGFkb3dIb3N0U2VsZWN0b3IoZWwpO1xuICAgIGlmIChzaCkgb3V0LnNoYWRvd0hvc3QgPSBzaDtcbiAgfVxuICBpZiAoY29tcFJvb3Q/LmNvbXBhY3QpIG91dC5jb21wb25lbnRSb290ID0gY29tcFJvb3QuY29tcGFjdDtcbiAgY29uc3QgYW5jZXN0b3JzID0gYW5jZXN0b3JDaGFpbihlbCk7XG4gIGlmIChhbmNlc3RvcnMubGVuZ3RoKSBvdXQuYW5jZXN0b3JzID0gYW5jZXN0b3JzO1xuICBpZiAoZndrKSBvdXQuY29tcG9uZW50ID0gZndrO1xuICBjb25zdCBldmVudHMgPSBjb2xsZWN0RXZlbnROYW1lcyhlbCk7XG4gIGlmIChldmVudHMpIG91dC5ldmVudHMgPSBldmVudHM7XG4gIGNvbnN0IGJlaGF2aW9yQXR0cnMgPSBjb2xsZWN0QmVoYXZpb3JBdHRycyhlbCk7XG4gIGlmIChiZWhhdmlvckF0dHJzKSBvdXQuYmVoYXZpb3JBdHRycyA9IGJlaGF2aW9yQXR0cnM7XG4gIGlmIChoYXNBY3RpdmVBbmltYXRpb24oZWwpKSBvdXQuaXNBbmltYXRpbmcgPSB0cnVlO1xuICAvLyBDYXB0dXJlIGFzc2V0IHJlZmVyZW5jZXMgc28gY29tcGxhaW50cyBhYm91dCBsb2dvcyAvIGljb25zIC9cbiAgLy8gYXJ0d29yayBjYW4gYmUgcmVwYWlyZWQgd2l0aG91dCB2aXN1YWwgZ3Vlc3NpbmcuIFdhbGtzIDxpbWc+LFxuICAvLyA8cGljdHVyZT48c291cmNlPiwgYW5kIDxzdmcgdXNlIGhyZWY+IHdpdGhpbiB0aGUgY2FwdHVyZWQgc3VidHJlZVxuICAvLyAob25lIGxldmVsIG9ubHkg4oCUIGRlc2NlbmRhbnQgc2NvcGUgaXMgYWxyZWFkeSBjYXBwZWQgYnkgb3V0ZXJIVE1MXG4gIC8vIGVsaXNpb24pLlxuICBjb25zdCBhc3NldHM6IEFycmF5PHtzcmM6IHN0cmluZzsgbmF0dXJhbFc/OiBudW1iZXI7IG5hdHVyYWxIPzogbnVtYmVyOyByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjsgYWx0Pzogc3RyaW5nOyBsb2FkZWQ/OiBib29sZWFufT4gPSBbXTtcbiAgdHJ5IHtcbiAgICBjb25zdCBpbWdMaXN0ID0gZWwucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdMaXN0Lmxlbmd0aCAmJiBhc3NldHMubGVuZ3RoIDwgODsgaSsrKSB7XG4gICAgICBjb25zdCBpbWcgPSBpbWdMaXN0W2ldIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICBjb25zdCBzcmMgPSBpbWcuY3VycmVudFNyYyB8fCBpbWcuc3JjO1xuICAgICAgaWYgKCFzcmMgfHwgc3JjLnN0YXJ0c1dpdGgoJ2RhdGE6JykpIGNvbnRpbnVlOyAvLyBza2lwIGRhdGE6IFVSSXNcbiAgICAgIGNvbnN0IHIgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBhc3NldHMucHVzaCh7XG4gICAgICAgIHNyYzogdHJpbVRleHQoc3JjLCAyMDApLFxuICAgICAgICBuYXR1cmFsVzogaW1nLm5hdHVyYWxXaWR0aCB8fCB1bmRlZmluZWQsXG4gICAgICAgIG5hdHVyYWxIOiBpbWcubmF0dXJhbEhlaWdodCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHJlbmRlcmVkVzogTWF0aC5yb3VuZChyLndpZHRoKSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHJlbmRlcmVkSDogTWF0aC5yb3VuZChyLmhlaWdodCkgfHwgdW5kZWZpbmVkLFxuICAgICAgICBhbHQ6IGltZy5hbHQgfHwgdW5kZWZpbmVkLFxuICAgICAgICBsb2FkZWQ6IGltZy5jb21wbGV0ZSAmJiBpbWcubmF0dXJhbFdpZHRoID4gMCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCB1c2VMaXN0ID0gZWwucXVlcnlTZWxlY3RvckFsbCgndXNlW2hyZWZdLCB1c2VbeGxpbmtcXFxcOmhyZWZdJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1c2VMaXN0Lmxlbmd0aCAmJiBhc3NldHMubGVuZ3RoIDwgMTI7IGkrKykge1xuICAgICAgY29uc3QgdSA9IHVzZUxpc3RbaV0gYXMgU1ZHVXNlRWxlbWVudDtcbiAgICAgIGNvbnN0IGhyZWYgPSB1LmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8IHUuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJyk7XG4gICAgICBpZiAoaHJlZikgYXNzZXRzLnB1c2goe3NyYzogdHJpbVRleHQoaHJlZiwgMjAwKX0pO1xuICAgIH1cbiAgICAvLyBFbGVtZW50J3Mgb3duIGJhY2tncm91bmQtaW1hZ2UgKENTUy1kcml2ZW4gYXJ0d29yayDigJQgbG9nb3NcbiAgICAvLyBzb21ldGltZXMgc2hpcCB2aWEgYGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi4pYCkuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJnID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmJhY2tncm91bmRJbWFnZTtcbiAgICAgIGlmIChiZyAmJiBiZyAhPT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbnN0IHVybE0gPSAvdXJsXFwoKFsnXCJdPykoLis/KVxcMVxcKS8uZXhlYyhiZyk7XG4gICAgICAgIGlmICh1cmxNICYmICF1cmxNWzJdIS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgYXNzZXRzLnB1c2goe3NyYzogdHJpbVRleHQodXJsTVsyXSEsIDIwMCl9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgaWYgKGFzc2V0cy5sZW5ndGgpIG91dC5hc3NldHMgPSBhc3NldHM7XG5cbiAgLy8gU2hpcCBhbiBhMTF5IGNoZWNrIG9uIGV2ZXJ5IGVudHJ5IChjb250cmFzdCByYXRpbyBmb3IgdGV4dCxcbiAgLy8gdGFiYmFiaWxpdHkgZmxhZykgc28gcmV2aWV3ZXJzIGRvbid0IG5lZWQgdG8gcmUtcnVuIGFuIGF1ZGl0LlxuICAvLyBIZWF2aWVyIGNoZWNrcyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90LCBheGUtc3R5bGUgdmlvbGF0aW9ucylcbiAgLy8gbmVlZCB0aGVpciBvd24gcGlwZWxpbmU7IHRoaXMgaXMgdGhlIGluLWNhcHR1cmUgcG9ydGlvbi5cbiAgY29uc3QgYTExeSA9IGNvbXB1dGVBY2Nlc3NpYmlsaXR5Q2hlY2soZWwpO1xuICBpZiAoYTExeSkgb3V0LmExMXkgPSBhMTF5O1xuICAvLyBQYXJlbnQgbGF5b3V0IGNvbnRleHQgKG92ZXJmbG93IC8gcG9zaXRpb24gLyBmbGV4IC8gZ3JpZCAvIHNjcm9sbFxuICAvLyBjb250YWluZXJzIC8gc3RhY2tpbmcpLiBMYXlvdXQgYnVncyB0eXBpY2FsbHkgbGl2ZSBpbiB0aGUgYW5jZXN0b3JcbiAgLy8gY2hhaW4sIG5vdCBvbiB0aGUgY2FwdHVyZWQgZWxlbWVudCBpdHNlbGYuXG4gIGNvbnN0IGxheW91dCA9IGNhcHR1cmVMYXlvdXRDb250ZXh0KGVsKTtcbiAgaWYgKGxheW91dC5sZW5ndGgpIG91dC5sYXlvdXRDb250ZXh0ID0gbGF5b3V0O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIGJlZm9yZSB0aGUgY2xpY2sg4oCUIHJlcHJvIGNvbnRleHQgKMKnNC44KS5cbiAgLy8gVGhlIGNvbnRlbnQtc2NyaXB0LW93bmVkIHJpbmcgYnVmZmVyIGZlZWRzIHVzIHRoZSByZWNlbnQgaGlzdG9yeTtcbiAgLy8gd2Ugc2xpY2UgdGhlIGxhc3QgMyBzbyB0aGUgZW50cnkgc3RheXMgc21hbGwuIFNraXBwZWQgd2hlbiB0aGVcbiAgLy8gZ2V0dGVyIGlzbid0IHdpcmVkICh0ZXN0L3N0YW5kYWxvbmUgaGFybmVzc2VzKS5cbiAgaWYgKG11dGF0aW9uQnVmZmVyR2V0dGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VudCA9IG11dGF0aW9uQnVmZmVyR2V0dGVyKCk7XG4gICAgICAvLyBGaWx0ZXIgb3V0IHRvb2wtaW5kdWNlZCBtdXRhdGlvbnMgKGN1cnNvciBzd2FwLCBib2R5IHN0eWxlXG4gICAgICAvLyBoaXRzIGZyb20gY3Jvc3NoYWlyIG1vZGUsIG92ZXJsYXkgcGFpbnRzLCByaW5nIHJlcGFpbnRzKSBzb1xuICAgICAgLy8gdGhlIGNvbnN1bWVyIGRvZXNuJ3QgaGF2ZSB0byB3b25kZXIgd2hldGhlciBgYm9keSB7IGN1cnNvcjpcbiAgICAgIC8vIGNyb3NzaGFpciB9YCBpcyBwYXJ0IG9mIHRoZWlyIGFwcC4gV2UgbWFyayBvdXIgb3duIG11dGF0aW9uc1xuICAgICAgLy8gYnkgc291cmNlIGFuZCBleGNsdWRlIHRoZW07IHVuLW1hcmtlZCBtdXRhdGlvbnMgYXJlIGFwcC1kcml2ZW4uXG4gICAgICBjb25zdCBUT09MX05PSVNFX1JFID0gL14oaHRtbHxib2R5fCNfX3BpbmNoZ3JhYl9vdmVybGF5KVxcYnxjdXJzb3J8dXNlci1zZWxlY3R8d2Via2l0LXVzZXItc2VsZWN0L2k7XG4gICAgICBjb25zdCBmaWx0ZXJlZCA9IHJlY2VudC5maWx0ZXIoKG0pID0+IHtcbiAgICAgICAgaWYgKFRPT0xfTk9JU0VfUkUudGVzdChtLnRhcmdldCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKG0udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnICYmIG0uYXR0cmlidXRlTmFtZSAmJiAvXihzdHlsZXxjdXJzb3IpJC8udGVzdChtLmF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgICAgLy8gYm9keSB7IGN1cnNvcjogY3Jvc3NoYWlyIH0gZnJvbSBQaW5jaEdyYWIncyBkcmFnIG1vZGVcbiAgICAgICAgICByZXR1cm4gIShtLnRhcmdldC5zdGFydHNXaXRoKCdodG1sJykgfHwgbS50YXJnZXQuc3RhcnRzV2l0aCgnYm9keScpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGZpbHRlcmVkLnNsaWNlKC0zKTtcbiAgICB9IGNhdGNoIHsgLyogaWdub3JlIG9ic2VydmVyIGVycm9ycyAqLyB9XG4gIH1cbiAgLy8gQ29udGVudGVkaXRhYmxlIGVkaXRvciBjb250ZXh0IChGLjUpLiBXaGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50XG4gIC8vIGxpdmVzIGluc2lkZSBhIHJpY2gtdGV4dCBlZGl0b3IgKFByb3NlTWlycm9yIC8gTGV4aWNhbCAvIFNsYXRlIC9cbiAgLy8gUXVpbGwgLyBUaXBUYXAgLyBuYXRpdmUpLCBzdXJmYWNlIHRoZSBsaWJyYXJ5IGtpbmQgKyByb290IHNlbGVjdG9yXG4gIC8vIHNvIGFuIExMTSBsb29raW5nIGF0IFwiY29weSBpcyB3cm9uZ1wiIGZlZWRiYWNrIGtub3dzIHRoZSBlZGl0b3JcbiAgLy8gd3JhcHBlciB0byBpbnNwZWN0IHJhdGhlciB0aGFuIGNoYXNpbmcgaW50ZXJuYWwgZWRpdG9yIHNlbGVjdG9ycy5cbiAgY29uc3QgZWRpdG9yID0gZWRpdG9yQ29udGV4dChlbCk7XG4gIGlmIChlZGl0b3IpIG91dC5lZGl0b3IgPSBlZGl0b3I7XG4gIC8vIENhbnZhcyBjbGljayBjb29yZHMgKEYuMykuIFdoZW4gdGhlIGNhcHR1cmUgdGFyZ2V0IGlzIGEgY2FudmFzIChvclxuICAvLyBhIGRlc2NlbmRhbnQg4oCUIERhdGFEb2ctc3R5bGUgY2hhcnRzIG9mdGVuIHJlbmRlciBpbnRvIGEgY2FudmFzIHdpdGhcbiAgLy8gcHNldWRvLWVsZW1lbnRzIGxheWVyZWQgb24gdG9wKSwgY29tcHV0ZSBjbGljayBwb3NpdGlvbiByZWxhdGl2ZSB0b1xuICAvLyB0aGUgY2FudmFzJ3MgYm91bmRpbmcgYm94LiBTa2lwcGVkIGlmIHRoZSBjYWxsZXIgZGlkbid0IHByb3ZpZGVcbiAgLy8gY2xpY2sgY29vcmRzIChtYW51YWwtY2FwdHVyZSAvIHJlY2FwdHVyZSBmbG93cykuXG4gIGlmIChvcHRzLmNsaWNrQXQpIHtcbiAgICBjb25zdCBjYW52YXMgPSBmaW5kQ2FudmFzQW5jZXN0b3IoZWwpO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGNvbnN0IHIgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBvdXQuY2FudmFzQ2xpY2sgPSB7XG4gICAgICAgIG9mZnNldFg6IE1hdGgucm91bmQob3B0cy5jbGlja0F0LmNsaWVudFggLSByLmxlZnQpLFxuICAgICAgICBvZmZzZXRZOiBNYXRoLnJvdW5kKG9wdHMuY2xpY2tBdC5jbGllbnRZIC0gci50b3ApLFxuICAgICAgICBjYW52YXNXOiBNYXRoLnJvdW5kKHIud2lkdGgpLFxuICAgICAgICBjYW52YXNIOiBNYXRoLnJvdW5kKHIuaGVpZ2h0KSxcbiAgICAgICAgY2FudmFzU2VsZWN0b3I6ICgoKSA9PiB7IHRyeSB7IHJldHVybiBjc3NQYXRoKGNhbnZhcyk7IH0gY2F0Y2ggeyByZXR1cm4gJ2NhbnZhcyc7IH0gfSkoKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmICh0cnVlU3RhdGVzLmxlbmd0aCkgb3V0LnN0YXRlcyA9IHRydWVTdGF0ZXM7XG4gIGlmIChPYmplY3Qua2V5cyhzdHlsZXMpLmxlbmd0aCkgb3V0LnN0eWxlcyA9IHN0eWxlcztcbiAgaWYgKHJ1bGVzLmxlbmd0aCkgb3V0Lm1hdGNoZWRSdWxlcyA9IHJ1bGVzO1xuICBpZiAoT2JqZWN0LmtleXMocHNldWRvKS5sZW5ndGgpIG91dC5wc2V1ZG9FbGVtZW50cyA9IHBzZXVkbztcblxuICAvLyBMb2NhdG9yIHF1YWxpdHk6IGhvdyBtYW55IGVsZW1lbnRzIGBzZWxlY3RvcmAgcmVzb2x2ZXMgdG8gaW4gaXRzXG4gIC8vIHNjb3BlICgxID0gdW5pcXVlKS4gPjEgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91czsgdXNlZnVsXG4gIC8vIHdoZW4gcGFpcmVkIHdpdGggcmVjdCAvIGFuY2VzdG9ycyB0byBkaXNhbWJpZ3VhdGUuXG4gIHRyeSB7XG4gICAgb3V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmxlbmd0aDtcbiAgfSBjYXRjaCB7IC8qIGludmFsaWQgc2VsZWN0b3IsIGxlYXZlIGZpZWxkcyBvZmYgKi8gfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG5jb25zdCBjb2xsZWN0Um9vdENzc1ZhcnMgPSAoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3MubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBuID0gY3NbaV07XG4gICAgaWYgKG4/LnN0YXJ0c1dpdGgoJy0tJykpIHtcbiAgICAgIGNvbnN0IHYgPSBjcy5nZXRQcm9wZXJ0eVZhbHVlKG4pLnRyaW0oKTtcbiAgICAgIGlmICh2KSBvdXRbbl0gPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gU2hhcmVkIHZpZXdwb3J0IHNuYXBzaG90IOKAlCB1c2VkIGJ5IGJvdGggYnVpbGRQYWdlQ29udGV4dCAoc2Vzc2lvblxuLy8gaGVhZGVyKSBhbmQgY2FwdHVyZUVudHJ5IChwZXItY2FwdHVyZSwgaW4gY2FzZSBzdGF0ZSBjaGFuZ2VkIGJldHdlZW5cbi8vIHRoZSBwYWdlIHJvdyBhbmQgdGhlIGNhcHR1cmUpLiBQaWNrcyB1cCBkcHIgcm91bmRpbmcsIGNvbG9yU2NoZW1lLFxuLy8gcmVkdWNlZE1vdGlvbiwgUlRMIGRpcmVjdGlvbiAoRi4xMyksIGFuZCB2aXN1YWxWaWV3cG9ydCB6b29tIChGLjE0KS5cbmNvbnN0IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCA9ICgpOiBWaWV3cG9ydCA9PiB7XG4gIGNvbnN0IHY6IFZpZXdwb3J0ID0ge1xuICAgIHc6IE1hdGgucm91bmQod2luZG93LmlubmVyV2lkdGgpLFxuICAgIGg6IE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0KSxcbiAgICBkcHI6IE1hdGgucm91bmQoKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpICogMTAwKSAvIDEwMCxcbiAgfTtcbiAgdHJ5IHtcbiAgICBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMpIHYuY29sb3JTY2hlbWUgPSAnZGFyayc7XG4gICAgZWxzZSBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodCknKS5tYXRjaGVzKSB2LmNvbG9yU2NoZW1lID0gJ2xpZ2h0JztcbiAgICBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB2LnJlZHVjZWRNb3Rpb24gPSB0cnVlO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgLy8gRG9jdW1lbnQgZGlyZWN0aW9uLiBgZGlyPVwicnRsXCJgIG9uIDxodG1sPiwgb3IgY29tcHV0ZWQgQ1NTIGRpcmVjdGlvblxuICAvLyB3aGVuIGFuIExUUiBkb2N1bWVudCBlbWJlZHMgYW4gUlRMIHN1YnRyZWUuIFdlIHNuYXBzaG90IHRoZSBkb2N1bWVudFxuICAvLyByb290J3MgY29tcHV0ZWQgZGlyZWN0aW9uLlxuICB0cnkge1xuICAgIGNvbnN0IGRpciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZGlyZWN0aW9uO1xuICAgIGlmIChkaXIgPT09ICdydGwnKSB2LmRpcmVjdGlvbiA9ICdydGwnO1xuICAgIGVsc2UgaWYgKGRpciA9PT0gJ2x0cicpIHYuZGlyZWN0aW9uID0gJ2x0cic7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAvLyBab29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIGlzIHRoZSBwaW5jaC16b29tIGZhY3RvciBvblxuICAvLyB0b3VjaCBkZXZpY2VzOyBvbiBkZXNrdG9wIHdpdGggYnJvd3NlciB6b29tIHRoZSB2YWx1ZSBzdGF5cyBhdCAxXG4gIC8vIGJ1dCB3aW5kb3cuaW5uZXJXaWR0aC9IZWlnaHQgc2hyaW5rLCBzbyB0aGlzIHdvbid0IHBpY2sgdXBcbiAgLy8gQ3RybCtwbHVzL21pbnVzIHpvb20g4oCUIHRoYXQgc3VyZmFjZXMgYXMgYSBzbWFsbGVyIHZpZXdwb3J0LiBCb3RoXG4gIC8vIGFyZSB1c2VmdWwgYW5kIHdlIGNhcHR1cmUgYm90aC5cbiAgdHJ5IHtcbiAgICBjb25zdCBzY2FsZSA9ICh3aW5kb3cudmlzdWFsVmlld3BvcnQgYXMgYW55KT8uc2NhbGU7XG4gICAgaWYgKHR5cGVvZiBzY2FsZSA9PT0gJ251bWJlcicgJiYgTWF0aC5hYnMoc2NhbGUgLSAxKSA+IDAuMDAxKSB7XG4gICAgICB2Lnpvb20gPSBNYXRoLnJvdW5kKHNjYWxlICogMTAwKSAvIDEwMDtcbiAgICB9XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gdjtcbn07XG5cbi8vIFJlY2VudC1UYWIgdHJhY2tlciBmb3IgYWN0aXZlRm9jdXMuIFdpcmVkIGJ5IGNvbnRlbnQtc2NyaXB0LnRzIGF0XG4vLyBib290OyB3ZSBrZWVwIHRoZSB0aW1lc3RhbXAgb2YgdGhlIGxhc3QgVGFiIGtleWRvd24gc28gYnVpbGRQYWdlQ29udGV4dFxuLy8gY2FuIGRlY2lkZSB3aGV0aGVyIHRvIGZsYWcgdGhlIGZvY3VzIGFzIFwia2V5Ym9hcmQtZHJpdmVuXCIuXG5sZXQgbGFzdFRhYkF0ID0gMDtcbmV4cG9ydCBjb25zdCBub3RlVGFiUHJlc3NlZCA9ICgpOiB2b2lkID0+IHsgbGFzdFRhYkF0ID0gRGF0ZS5ub3coKTsgfTtcblxuY29uc3QgYWN0aXZlRm9jdXNTbmFwc2hvdCA9ICgpOiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn0gfCBudWxsID0+IHtcbiAgY29uc3QgYWUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICBpZiAoIWFlIHx8IGFlID09PSBkb2N1bWVudC5ib2R5IHx8IGFlID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiBudWxsO1xuICBsZXQgc2VsZWN0b3I6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdHJ5IHsgc2VsZWN0b3IgPSBjc3NQYXRoKGFlKTsgfSBjYXRjaCB7IHNlbGVjdG9yID0gYWUudGFnTmFtZS50b0xvd2VyQ2FzZSgpOyB9XG4gIGNvbnN0IG91dDoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59ID0ge3NlbGVjdG9yfTtcbiAgaWYgKERhdGUubm93KCkgLSBsYXN0VGFiQXQgPCAxMDAwKSBvdXQucmVjZW50bHlUYWJiZWQgPSB0cnVlO1xuICByZXR1cm4gb3V0O1xufTtcblxuLy8gUmVhZCBnaXQgY29udGV4dCBmcm9tIGEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiY1xuLy8gYnJhbmNoOm1haW5cIj5gIHRhZyBpZiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXMgb25lLiBOby1vcCB3aGVuIGFic2VudC5cbi8vIExldHMgYSBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJ1aWxkIHdhcyB0aGlzIGNhcHR1cmVkIGZyb20/XCJcbi8vIHdpdGhvdXQgZm9yY2luZyB0aGUgdXNlciB0byByZW1lbWJlci5cbmNvbnN0IHJlYWRHaXRDb250ZXh0ID0gKCk6IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9IHwgbnVsbCA9PiB7XG4gIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJwaW5jaGdyYWItYnVpbGRcIl0nKSBhcyBIVE1MTWV0YUVsZW1lbnQgfCBudWxsO1xuICBpZiAoIW1ldGE/LmNvbnRlbnQpIHJldHVybiBudWxsO1xuICBjb25zdCBjb250ZW50ID0gbWV0YS5jb250ZW50O1xuICBjb25zdCBvdXQ6IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9ID0ge307XG4gIGNvbnN0IGNvbW1pdCA9IC9cXGJjb21taXQ6KFtcXHcuLV0rKS8uZXhlYyhjb250ZW50KT8uWzFdO1xuICBjb25zdCBicmFuY2ggPSAvXFxiYnJhbmNoOihbXFx3Li8tXSspLy5leGVjKGNvbnRlbnQpPy5bMV07XG4gIGNvbnN0IGJ1aWxkID0gL1xcYmJ1aWxkOihbXFx3Li8tXSspLy5leGVjKGNvbnRlbnQpPy5bMV07XG4gIGlmIChjb21taXQpIG91dC5jb21taXQgPSB0cmltVGV4dChjb21taXQsIDgwKTtcbiAgaWYgKGJyYW5jaCkgb3V0LmJyYW5jaCA9IHRyaW1UZXh0KGJyYW5jaCwgODApO1xuICBpZiAoYnVpbGQpIG91dC5idWlsZCA9IHRyaW1UZXh0KGJ1aWxkLCA4MCk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvdXQpLmxlbmd0aCA/IG91dCA6IG51bGw7XG59O1xuXG4vLyBBIFVSTCBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hhdCB0aGUgdXNlciB3YXMgbG9va2luZyBhdC5cbi8vIE1hbnkgU1BBcyBkcml2ZSByb3V0aW5nIHZpYSBxdWVyeSBwYXJhbXMgKGA/cm91dGU9c2V0dGluZ3NgKSwgaGFzaFxuLy8gcm91dGVzIChgIy91c2Vycy80MmApLCBvciBwYXRoIHNlZ21lbnRzLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gZnJvbVxuLy8gdGhlIFVSTCDigJQgcmVjZWl2ZXJzIHZlcmlmeSBhZ2FpbnN0IHRoZSBzY3JlZW5zaG90IGlmIHRoZXkgY2FyZS5cbmNvbnN0IGJ1aWxkUm91dGVTbmFwc2hvdCA9ICgpOiB7cGF0aG5hbWU/OiBzdHJpbmc7IHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgaGFzaD86IHN0cmluZzsgcm91dGVOYW1lPzogc3RyaW5nOyByb3V0ZVBhcmFtPzogc3RyaW5nfSA9PiB7XG4gIGNvbnN0IG91dDoge3BhdGhuYW1lPzogc3RyaW5nOyBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGhhc2g/OiBzdHJpbmc7IHJvdXRlTmFtZT86IHN0cmluZzsgcm91dGVQYXJhbT86IHN0cmluZ30gPSB7fTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICBpZiAodS5wYXRobmFtZSkgb3V0LnBhdGhuYW1lID0gdS5wYXRobmFtZTtcbiAgICBpZiAodS5oYXNoKSBvdXQuaGFzaCA9IHUuaGFzaDtcbiAgICBjb25zdCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBsZXQgblBhcmFtcyA9IDA7XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgdS5zZWFyY2hQYXJhbXMpIHtcbiAgICAgIGlmIChuUGFyYW1zID49IDE2KSBicmVhaztcbiAgICAgIHBhcmFtc1trXSA9IHRyaW1UZXh0KHYsIDIwMCk7XG4gICAgICBuUGFyYW1zKys7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkgb3V0LnF1ZXJ5ID0gcGFyYW1zO1xuICAgIC8vIENvbW1vbiBTUEEgcm91dGUgaGludHM6IGA/cm91dGU9c2V0dGluZ3NgLCBgP3RhYj1mb29gLCBgIy91c2Vycy80MmAuXG4gICAgY29uc3Qgcm91dGVRdWVyeSA9IHUuc2VhcmNoUGFyYW1zLmdldCgncm91dGUnKSA/PyB1LnNlYXJjaFBhcmFtcy5nZXQoJ3RhYicpID8/IHUuc2VhcmNoUGFyYW1zLmdldCgndmlldycpO1xuICAgIGlmIChyb3V0ZVF1ZXJ5KSBvdXQucm91dGVOYW1lID0gdHJpbVRleHQocm91dGVRdWVyeSwgODApO1xuICAgIGlmICh1Lmhhc2ggJiYgdS5oYXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IGhhc2hQYXRoID0gdS5oYXNoLnJlcGxhY2UoL14jXFwvPy8sICcnKTtcbiAgICAgIGNvbnN0IHNlZ3MgPSBoYXNoUGF0aC5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIGlmIChzZWdzLmxlbmd0aCkge1xuICAgICAgICBvdXQucm91dGVOYW1lID0gb3V0LnJvdXRlTmFtZSA/PyB0cmltVGV4dChzZWdzWzBdISwgODApO1xuICAgICAgICBpZiAoc2Vncy5sZW5ndGggPiAxKSBvdXQucm91dGVQYXJhbSA9IHRyaW1UZXh0KHNlZ3Muc2xpY2UoMSkuam9pbignLycpLCAyMDApO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDYXB0dXJlIGEgcmVkYWN0ZWQgc3RhdGUgc25hcHNob3Qgc28gcmVjZWl2ZXJzIGNhbiByZXBybyB0aGUgc2NyZWVuLlxuLy8gV2UgYXZvaWQgY29weWluZyBldmVyeXRoaW5nIOKAlCB0aGF0IHdvdWxkIGxlYWsgc2VjcmV0cyDigJQgYW5kIHN1cmZhY2Vcbi8vIG9ubHk6XG4vLyAgIOKAoiBsb2NhbFN0b3JhZ2Uga2V5cyArIHNpemVzIChOT1QgdmFsdWVzOyByZWNlaXZlcnMgbmVlZCB0byBrbm93XG4vLyAgICAgd2hhdCBzdG9yYWdlIHNoYXBlZCB0aGUgc2NyZWVuLCBub3QgdGhlIGNvbnRlbnRzKVxuLy8gICDigKIgY29va2llIG5hbWVzIChOTyB2YWx1ZXMsIGV2ZXIpXG4vLyAgIOKAoiBrbm93biBmZWF0dXJlLWZsYWcgY29udmVudGlvbnM6IGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWZsYWdzXCI+YFxuY29uc3QgYnVpbGRTdGF0ZVNuYXBzaG90ID0gKCk6IHtzdG9yYWdlS2V5cz86IHN0cmluZ1tdOyBzZXNzaW9uS2V5cz86IHN0cmluZ1tdOyBjb29raWVOYW1lcz86IHN0cmluZ1tdOyBmZWF0dXJlRmxhZ3M/OiBzdHJpbmd9IHwgbnVsbCA9PiB7XG4gIGNvbnN0IG91dDoge3N0b3JhZ2VLZXlzPzogc3RyaW5nW107IHNlc3Npb25LZXlzPzogc3RyaW5nW107IGNvb2tpZU5hbWVzPzogc3RyaW5nW107IGZlYXR1cmVGbGFncz86IHN0cmluZ30gPSB7fTtcbiAgdHJ5IHtcbiAgICBjb25zdCBsc0tleXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoICYmIGxzS2V5cy5sZW5ndGggPCAzMjsgaSsrKSB7XG4gICAgICBjb25zdCBrID0gbG9jYWxTdG9yYWdlLmtleShpKTtcbiAgICAgIGlmIChrKSBsc0tleXMucHVzaChrKTtcbiAgICB9XG4gICAgaWYgKGxzS2V5cy5sZW5ndGgpIG91dC5zdG9yYWdlS2V5cyA9IGxzS2V5cztcbiAgfSBjYXRjaCB7IC8qIFNlY3VyaXR5RXJyb3Igb24gY3Jvc3Mtb3JpZ2luIGZyYW1lcyAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3Qgc3NLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2Vzc2lvblN0b3JhZ2UubGVuZ3RoICYmIHNzS2V5cy5sZW5ndGggPCAzMjsgaSsrKSB7XG4gICAgICBjb25zdCBrID0gc2Vzc2lvblN0b3JhZ2Uua2V5KGkpO1xuICAgICAgaWYgKGspIHNzS2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBpZiAoc3NLZXlzLmxlbmd0aCkgb3V0LnNlc3Npb25LZXlzID0gc3NLZXlzO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgdHJ5IHtcbiAgICBjb25zdCBjb29raWVOYW1lcyA9IGRvY3VtZW50LmNvb2tpZVxuICAgICAgLnNwbGl0KCc7JylcbiAgICAgIC5tYXAoKGMpID0+IGMudHJpbSgpLnNwbGl0KCc9JylbMF0hKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLnNsaWNlKDAsIDMyKTtcbiAgICBpZiAoY29va2llTmFtZXMubGVuZ3RoKSBvdXQuY29va2llTmFtZXMgPSBjb29raWVOYW1lcztcbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3QgZmxhZ01ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJwaW5jaGdyYWItZmxhZ3NcIl0nKSBhcyBIVE1MTWV0YUVsZW1lbnQgfCBudWxsO1xuICAgIGlmIChmbGFnTWV0YT8uY29udGVudCkgb3V0LmZlYXR1cmVGbGFncyA9IHRyaW1UZXh0KGZsYWdNZXRhLmNvbnRlbnQsIDQwMCk7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkUGFnZUNvbnRleHQgPSAoKSA9PiB7XG4gIGNvbnN0IGN0eDogYW55ID0ge1xuICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICB0aXRsZTogdHJpbVRleHQoZG9jdW1lbnQudGl0bGUsIDIwMCksXG4gICAgdmlld3BvcnQ6IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCgpLFxuICAgIHRva2VuczogY29sbGVjdFJvb3RDc3NWYXJzKCksXG4gICAgdXNlckFnZW50OiB0cmltVGV4dChuYXZpZ2F0b3IudXNlckFnZW50LCAyNDApLFxuICAgIGxhbmc6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJycsXG4gIH07XG4gIGNvbnN0IGdpdCA9IHJlYWRHaXRDb250ZXh0KCk7XG4gIGlmIChnaXQpIGN0eC5naXRDb250ZXh0ID0gZ2l0O1xuICBjb25zdCBmb2N1cyA9IGFjdGl2ZUZvY3VzU25hcHNob3QoKTtcbiAgaWYgKGZvY3VzKSBjdHguYWN0aXZlRm9jdXMgPSBmb2N1cztcbiAgY29uc3Qgcm91dGUgPSBidWlsZFJvdXRlU25hcHNob3QoKTtcbiAgaWYgKE9iamVjdC5rZXlzKHJvdXRlKS5sZW5ndGgpIGN0eC5yb3V0ZSA9IHJvdXRlO1xuICBjb25zdCBzdGF0ZSA9IGJ1aWxkU3RhdGVTbmFwc2hvdCgpO1xuICBpZiAoc3RhdGUpIGN0eC5zdGF0ZSA9IHN0YXRlO1xuICByZXR1cm4gY3R4O1xufTtcblxuLy8gLS0tLSBFbGVtZW50LXNldCBzZW1hbnRpY3MgZm9yIHJ1YmJlci1iYW5kIGRyYWcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBTVFJPTkdfSURfUkUgPSAvXihyYWRpeC18aGVhZGxlc3N1aS18bXVpLXw6clswLTlhLXpdKzopL2k7XG5jb25zdCBpc1N0cm9uZ01hcmtlciA9IChlbDogRWxlbWVudCk6IGJvb2xlYW4gPT5cbiAgQm9vbGVhbihcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdGlkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlc3QnKSB8fFxuICAgIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jeScpIHx8IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1xYScpIHx8XG4gICAgZWwuZ2V0QXR0cmlidXRlKCdyb2xlJykgfHwgKGVsLmlkICYmICFTVFJPTkdfSURfUkUudGVzdChlbC5pZCkpLFxuICApO1xuY29uc3QgTUVESVVNX1RBR1MgPSBuZXcgU2V0KFsnQlVUVE9OJywgJ0EnLCAnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJywgJ0ZPUk0nXSk7XG5jb25zdCBXRUFLX1RBR1MgPSBuZXcgU2V0KFsnQVJUSUNMRScsICdTRUNUSU9OJywgJ05BVicsICdIRUFERVInLCAnRk9PVEVSJywgJ0xJJ10pO1xuY29uc3QgaXNNZWRpdW1NYXJrZXIgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IE1FRElVTV9UQUdTLmhhcyhlbC50YWdOYW1lKTtcbmNvbnN0IGlzV2Vha01hcmtlciA9IChlbDogRWxlbWVudCk6IGJvb2xlYW4gPT5cbiAgV0VBS19UQUdTLmhhcyhlbC50YWdOYW1lKSB8fCAvXkhbMS02XSQvLnRlc3QoZWwudGFnTmFtZSk7XG5cbi8vIFNuYXAgaG92ZXIvY2xpY2sgdGFyZ2V0IHRvIGl0cyBuZWFyZXN0IFwiY29tcG9uZW50XCIgYW5jZXN0b3IuIFdpdGhvdXRcbi8vIHRoaXMsIGFsdC1ob3ZlcmluZyBhIGJ1dHRvbiB3aXRoIHN0cnVjdHVyZWQgY2hpbGRyZW4gKGljb24gc3BhbiArXG4vLyBsYWJlbCBzcGFuKSBzZWxlY3RzIHdoaWNoZXZlciBpbm5lciBzcGFuIHRoZSBjdXJzb3IgaGFwcGVuZWQgdG8gbGFuZFxuLy8gb24g4oCUIHRocmVlIGRpZmZlcmVudCBjYXB0dXJlcyBvZiB0aGUgXCJzYW1lIGNvbXBvbmVudFwiIGRlcGVuZGluZyBvbiBhXG4vLyBmZXctcGl4ZWwgbW91c2UgZGlmZmVyZW5jZS4gU25hcCB3YWxrcyB1cCB0aGUgRE9NIGxvb2tpbmcgZm9yIHRoZVxuLy8gY2xvc2VzdCBTVFJPTkcgb3IgTUVESVVNIG1hcmtlciB3aXRoaW4gYG1heERlcHRoYCBsZXZlbHMgYW5kIHJldHVybnNcbi8vIHRoYXQgYW5jZXN0b3I7IGZhbGxzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGVsZW1lbnQgd2hlbiBub25lIGlzIGZvdW5kLlxuLy9cbi8vIEFsc28gZm9sZHMgdGhlIGV4aXN0aW5nIFwia25vd24gY2FwdHVyZWQgc2VsZWN0b3IgYW5jZXN0b3JcIiBsb29rdXAgaW50b1xuLy8gb25lIGhlbHBlciBzbyBjYWxsZXJzIGRvbid0IGhhdmUgdG8gY2hhaW4gdHdvIHBhc3Nlcy5cbi8vIFRydWUgd2hlbiBhbiBlbGVtZW50IGZpbGxzIDkwJSsgb2YgdGhlIHZpZXdwb3J0IGluIGJvdGggYXhlcy4gVGhlXG4vLyBydW50aW1lIGZpbHRlcnMgb3V0IHN1Y2ggY2FwdHVyZXMgKGFsdC1jbGljayBza2lwcywgZHJhZyByZWplY3RzKVxuLy8gYmVjYXVzZSBncmFiYmluZyB0aGUgcGFnZSB3cmFwcGVyIGlzIG5ldmVyIHRoZSB1c2VyJ3MgaW50ZW50LiBVc2VkXG4vLyBoZXJlIGluIHNuYXBUb0NvbXBvbmVudCB0byBBVk9JRCB3YWxraW5nIHVwIHRvIGEgaHVnZSBhbmNlc3RvciDigJRcbi8vIHRoYXQgcHJvZHVjZWQgc2lsZW50IGZhaWx1cmVzIG9uIHNpdGVzIGxpa2Ugd3Jhbm5nbGUuY29tL2Fib3V0XG4vLyB3aGVyZSB0aGUgbmVhcmVzdCBTVFJPTkcgbWFya2VyIGlzIGA8bWFpbiBpZD1cIm1haW5cIj5gIChodWdlKSwgc29cbi8vIHRoZSB1c2VyJ3MgYWx0LWNsaWNrIG9uIGEgaGVhZGluZyBnb3Qgc25hcHBlZCB0byA8bWFpbj4gYW5kIHRoZW5cbi8vIHJlamVjdGVkIGZvciBiZWluZyBodWdlLCB3aXRoIG5vIGNhcHR1cmUgYW5kIG5vIHJpbmcuXG5jb25zdCBpc0h1Z2VWaWV3cG9ydEZpbGwgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiB0cnVlO1xuICBjb25zdCByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiByLndpZHRoID49IHdpbmRvdy5pbm5lcldpZHRoICogMC45ICYmIHIuaGVpZ2h0ID49IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOTtcbn07XG5cbmV4cG9ydCBjb25zdCBzbmFwVG9Db21wb25lbnQgPSAoXG4gIHRndDogRWxlbWVudCxcbiAga25vd25DYXB0dXJlZDogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgbWF4RGVwdGggPSA0LFxuKTogRWxlbWVudCA9PiB7XG4gIC8vIEZpcnN0IHBhc3M6IHByZWZlciBhIGtub3duLWNhcHR1cmVkIGFuY2VzdG9yIChzbyByZS1ob3ZlcmluZyBhIGNoaWxkXG4gIC8vIG9mIGFuIGFscmVhZHktc2F2ZWQgY2FyZCBzbmFwcyB0byB0aGUgY2FyZCkuXG4gIGlmIChrbm93bkNhcHR1cmVkLnNpemUpIHtcbiAgICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IHRndDtcbiAgICB3aGlsZSAoY3VyICYmIGN1ciAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgZm9yIChjb25zdCBzZWwgb2Yga25vd25DYXB0dXJlZCkge1xuICAgICAgICB0cnkgeyBpZiAoY3VyLm1hdGNoZXMoc2VsKSkgcmV0dXJuIGN1cjsgfSBjYXRjaCB7IC8qIGludmFsaWQgc2VsZWN0b3IgKi8gfVxuICAgICAgfVxuICAgICAgY3VyID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICB9XG4gIC8vIFNlY29uZCBwYXNzOiBuZWFyZXN0IFNUUk9ORyBvciBNRURJVU0gbWFya2VyIHdpdGhpbiBkZXB0aCwgQlVUXG4gIC8vIHNraXAgYW55IGFuY2VzdG9yIHRoYXQncyB2aWV3cG9ydC1zaXplZC4gVGhlIHJ1bnRpbWUncyBodWdlLWVsZW1lbnRcbiAgLy8gZmlsdGVyIHJlamVjdHMgaHVnZSBjYXB0dXJlcywgc28gc25hcHBpbmcgdGhlcmUgaXMgYSBndWFyYW50ZWVkXG4gIC8vIHNpbGVudCBtaXNzLiBJZiB0aGUgbWFya2VyIHdlIGZpbmQgaXMgaHVnZSwga2VlcCB3YWxraW5nIGFuZCB0cnlcbiAgLy8gdGhlIG5leHQ7IGlmIG5vdGhpbmcgaW4tZGVwdGggaXMgbm9uLWh1Z2UsIHJldHVybiB0aGUgb3JpZ2luYWxcbiAgLy8gY2xpY2sgdGFyZ2V0ICh3aGljaCBjYXB0dXJlRW50cnkgdGhlbiB2YWxpZGF0ZXMgc2VwYXJhdGVseSkuXG4gIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gdGd0O1xuICBmb3IgKGxldCBpID0gMDsgaSA8PSBtYXhEZXB0aCAmJiBjdXIgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5OyBpKyspIHtcbiAgICBpZiAoKGlzU3Ryb25nTWFya2VyKGN1cikgfHwgaXNNZWRpdW1NYXJrZXIoY3VyKSkgJiYgIWlzSHVnZVZpZXdwb3J0RmlsbChjdXIpKSByZXR1cm4gY3VyO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiB0Z3Q7XG59O1xuXG4vLyAzRC1hcHAtc3R5bGUgcmlnb3JvdXMgc2VsZWN0aW9uOiBwcmUtY29sbGVjdCBhIFNUQUJMRSBjYW5kaWRhdGUgc2V0IHdoZW5cbi8vIHRoZSBkcmFnIHN0YXJ0cyAoYHBpY2tEcmFnQ2FuZGlkYXRlc2ApLCB0aGVuIGBlbGVtZW50c0luUmVjdGAgZmlsdGVyc1xuLy8gdGhhdCBzZXQgYnkgdGhlIHJ1YmJlci1iYW5kIHJlY3QgZWFjaCBmcmFtZS4gVGhlIHBvb2wgaXMgbG9ja2VkIG9uY2Ugc29cbi8vIHRoZSBydWJiZXIgYmFuZCBncm93cyAvIHNocmlua3MgbW9ub3RvbmljYWxseSB3aXRoIHJlY3Qgc2l6ZSDigJQgbm8gcmFuZG9tXG4vLyBzZWxlY3RzL2Rlc2VsZWN0cyBtaWQtZHJhZy5cbi8vXG4vLyBFYXJsaWVyIHRoaXMgZnVuY3Rpb24gcGlja2VkIGEgc2luZ2xlIFwidGllclwiIChTVFJPTkc9ZGF0YS10ZXN0aWQg4oaSXG4vLyBNRURJVU09cm9sZS9pZC9idXR0b24g4oaSIFdFQUs9Y2xhc3MpLCBwcmVmZXJyaW5nIHdoaWNoZXZlciBoYWQg4omlMiBoaXRzLFxuLy8gYW5kIHNpbGVudGx5IEVYQ0xVREVEIGV2ZXJ5dGhpbmcgb3V0c2lkZSB0aGF0IHRpZXIgZm9yIHRoZSByZXN0IG9mIHRoZVxuLy8gZHJhZy4gVGhlIHVzZXIgcmVwb3J0ZWQgaXQgZmVsdCBsaWtlIHRoZSBtYXJxdWVlIHdhcyBcImRpc2NyaW1pbmF0aW5nIG9uXG4vLyB6IG9yIHRyZWUgdGllclwiIOKAlCBleGFjdGx5IHRoZSBzeW1wdG9tIG9mIGEgc3Ryb25nbHktbWFya2VkIHNpYmxpbmdcbi8vIGhpamFja2luZyB0aGUgdGllciBhbmQgZmlsdGVyaW5nIG91dCBhbiBlbGVtZW50IHRoZSB1c2VyIGNvdWxkIGNsZWFybHlcbi8vIHNlZSBpbnNpZGUgdGhlIHJlY3QuIFdlIG5vdyByZXR1cm4gZXZlcnkgdmlzaWJsZSBub24tb3ZlcmxheSBlbGVtZW50O1xuLy8gdGhlIGlubmVybW9zdC1vbmx5IGZpbHRlciBpbiBlbGVtZW50c0luUmVjdCBkcm9wcyBhbmNlc3RvciBtYXRjaGVzIHdoZW5cbi8vIGEgZGVzY2VuZGFudCBhbHNvIG1hdGNoZXMsIHdoaWNoIGdpdmVzIHRoZSBpbnR1aXRpdmUgXCJzZWxlY3Qgd2hhdCdzIGluXG4vLyB0aGUgcmVjdFwiIGJlaGF2aW9yIHdpdGhvdXQgdGhlIGludmlzaWJsZSBleGNsdXNpb24uXG4vL1xuLy8gU2VsZWN0aW9uIG1vZGUgKGRyYWcgZGlyZWN0aW9uKTpcbi8vICAg4oCiICdmdWxsJyAgICDigJQgZWxlbWVudCBiYm94IEZVTExZIEVOQ0xPU0VEIGJ5IHRoZSByZWN0IChsZWZ04oaScmlnaHQpLlxuLy8gICDigKIgJ3BhcnRpYWwnIOKAlCBlbGVtZW50IGJib3ggSU5URVJTRUNUUyB0aGUgcmVjdCAocmlnaHTihpJsZWZ0KS5cbmV4cG9ydCBjb25zdCBwaWNrRHJhZ0NhbmRpZGF0ZXMgPSAob3ZlcmxheUhvc3Q6IEVsZW1lbnQpOiBFbGVtZW50W10gPT4ge1xuICBjb25zdCBhbGxSYXcgPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbCgnKicpKTtcbiAgcmV0dXJuIGFsbFJhdy5maWx0ZXIoKGVsKSA9PiB7XG4gICAgaWYgKG92ZXJsYXlIb3N0LmNvbnRhaW5zKGVsKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoci53aWR0aCA9PT0gMCB8fCByLmhlaWdodCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIERyb3AgdGhlIHBhZ2Utc3Bhbm5pbmcgd3JhcHBlcnMgKGJvZHksIGZ1bGwtYmxlZWQgc2VjdGlvbnMsIGV0Yy4pO1xuICAgIC8vIHRob3NlIHdvdWxkIGFsd2F5cyBtYXRjaCB0aGUgcmVjdCBhbmQgY3Jvd2Qgb3V0IHRoZWlyIGNoaWxkcmVuLlxuICAgIGlmIChyLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggKiAwLjkgJiYgci5oZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgZWxlbWVudHNJblJlY3QgPSAoXG4gIGNhbmRpZGF0ZXM6IHJlYWRvbmx5IEVsZW1lbnRbXSxcbiAgeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcixcbiAgbW9kZTogJ3BhcnRpYWwnIHwgJ2Z1bGwnID0gJ3BhcnRpYWwnLFxuKTogRWxlbWVudFtdID0+IHtcbiAgY29uc3QgbWluWCA9IE1hdGgubWluKHgxLCB4Mik7XG4gIGNvbnN0IG1heFggPSBNYXRoLm1heCh4MSwgeDIpO1xuICBjb25zdCBtaW5ZID0gTWF0aC5taW4oeTEsIHkyKTtcbiAgY29uc3QgbWF4WSA9IE1hdGgubWF4KHkxLCB5Mik7XG4gIGNvbnN0IG1hdGNoZXM6IEVsZW1lbnRbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGVsIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBjb25zdCByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKHIud2lkdGggPT09IDAgfHwgci5oZWlnaHQgPT09IDApIGNvbnRpbnVlO1xuICAgIGlmIChtb2RlID09PSAnZnVsbCcpIHtcbiAgICAgIGlmIChyLmxlZnQgPCBtaW5YIHx8IHIudG9wIDwgbWluWSB8fCByLnJpZ2h0ID4gbWF4WCB8fCByLmJvdHRvbSA+IG1heFkpIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoci5yaWdodCA8IG1pblggfHwgci5sZWZ0ID4gbWF4WCB8fCByLmJvdHRvbSA8IG1pblkgfHwgci50b3AgPiBtYXhZKSBjb250aW51ZTtcbiAgICB9XG4gICAgbWF0Y2hlcy5wdXNoKGVsKTtcbiAgfVxuICAvLyBJbm5lcm1vc3Qg4oCUIGRyb3AgYW5jZXN0b3JzIHRoYXQgY29udGFpbiBhbm90aGVyIG1hdGNoLiBTdGFibGUgYmVjYXVzZVxuICAvLyBpdCBvbmx5IGRlcGVuZHMgb24gdGhlIG1hdGNoZXMgc2V0LCBub3Qgb24gcmFua3MuXG4gIC8vXG4gIC8vIE5vIGFydGlmaWNpYWwgY2FwLiBUaGUgZWFybGllciAyNC1lbGVtZW50IGNlaWxpbmcgZXhpc3RlZCB0byBrZWVwXG4gIC8vIHJpbmcgcmVwYWludCBjb3N0IHByZWRpY3RhYmxlIGluIHdvcnN0LWNhc2UgXCJydWJiZXItYmFuZCB0aGUgd2hvbGVcbiAgLy8gdmlld3BvcnRcIiBkcmFncywgYnV0IGl0IGJlY2FtZSB1c2VyLXZpc2libGU6IGEgcmVhbCBzZWxlY3Rpb24gb2ZcbiAgLy8gfjMwIGdyaWQgY2VsbHMgd291bGQgc2lsZW50bHkgZHJvcCB0aGUgdHJhaWxpbmcgb25lcyB3aXRoIG5vXG4gIC8vIGZlZWRiYWNrLiBUd28gc2FmZXIgbWl0aWdhdGlvbnMgbm93IGtlZXAgcGVyZm9ybWFuY2UgYm91bmRlZDpcbiAgLy8gICDigKIgcGlja0RyYWdDYW5kaWRhdGVzIGFscmVhZHkgdHJpbXMgYm9keSAvIHBhZ2Utc3Bhbm5pbmcgd3JhcHBlcnNcbiAgLy8gICAgICh0aGUgZWxlbWVudHMgdGhhdCB3b3VsZCBvdGhlcndpc2UgZG9taW5hdGUgYW55IHJlY3QpLlxuICAvLyAgIOKAoiBjb250ZW50LXNjcmlwdCBwYWludHMgcmluZ3MgdmlhIGEgZGlmZiAob25seSBORVcgZWxlbWVudHMgZ2V0XG4gIC8vICAgICBhIHJpbmcpLCBzbyBhIHN0YWJsZSAyMDAtZWxlbWVudCBzZWxlY3Rpb24gaXMgb25lIHBhaW50LCBub3RcbiAgLy8gICAgIDIwMCBwYWludHMgcGVyIGZyYW1lLlxuICAvLyBJZiBhIGZ1dHVyZSBwYWdlIGdlbnVpbmVseSBwcm9kdWNlcyB0aG91c2FuZHMgb2YgaW5uZXJtb3N0IG1hdGNoZXNcbiAgLy8gd2UnbGwgcmV2aXNpdDsgdW50aWwgdGhlbiwgc2hpcCB3aGF0IHRoZSB1c2VyIGFjdHVhbGx5IGRyZXcuXG4gIHJldHVybiBtYXRjaGVzLmZpbHRlcigoYSkgPT4gIW1hdGNoZXMuc29tZSgoYikgPT4gYSAhPT0gYiAmJiBhLmNvbnRhaW5zKGIpKSk7XG59O1xuIiwKICAgICIvLyBTaGFyZWQgdHlwZXMgJiBtZXNzYWdlIHByb3RvY29sIGJldHdlZW4gY29udGVudCBzY3JpcHQsIHNpZGUgcGFuZWwsIGFuZFxuLy8gYmFja2dyb3VuZCBzZXJ2aWNlIHdvcmtlci5cblxuZXhwb3J0IHR5cGUgUmVjdCA9IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgVmlld3BvcnQgPSB7XG4gIHc6IG51bWJlcjsgaDogbnVtYmVyOyBkcHI6IG51bWJlcjtcbiAgLy8gVXNlci1wcmVmZXJlbmNlIG1lZGlhLXF1ZXJ5IHN0YXRlIGF0IGNhcHR1cmUgdGltZS4gTGV0cyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYXNvbiBhYm91dCB3aHkgY2FwdHVyZWQgYXBwZWFyYW5jZSBkaWZmZXJzIGJldHdlZW4gc2Vzc2lvbnNcbiAgLy8gKGUuZy4gZGFyay1tb2RlIHZzIGxpZ2h0LW1vZGUgb2YgdGhlIHNhbWUgY29tcG9uZW50KS5cbiAgY29sb3JTY2hlbWU/OiAnZGFyaycgfCAnbGlnaHQnO1xuICByZWR1Y2VkTW90aW9uPzogYm9vbGVhbjtcbiAgLy8gRG9jdW1lbnQgZGlyZWN0aW9uIChgbHRyYCAvIGBydGxgKSDigJQgZGlmZmVyZW50IGZyb20gdmlld3BvcnQgc2l6ZSxcbiAgLy8gY2hhbmdlcyB0aGUgbWVhbmluZyBvZiBgc3RhcnRgL2BlbmRgIGluIENTUyBhbmQgdGhlIHNlbnNlIG9mXG4gIC8vIGByZWN0LnhgLiBDYXB0dXJlZCBwZXIgcGFnZSBoZWFkZXIgc28gUlRMIGNhcHR1cmVzIGRvbid0IGdldFxuICAvLyBzaWxlbnRseSBtaXhlZCB3aXRoIExUUiBvbmVzLlxuICBkaXJlY3Rpb24/OiAnbHRyJyB8ICdydGwnO1xuICAvLyBCcm93c2VyIHpvb20gbGV2ZWwuIGB2aXN1YWxWaWV3cG9ydC5zY2FsZWAgcmVwb3J0cyB0aGUgcGluY2gtem9vbVxuICAvLyBmYWN0b3I7IHZhbHVlcyAhPSAxIG1lYW4gdGhlIHVzZXIgaGFzIHpvb21lZCBpbi9vdXQgYW5kIGFueSBsYXlvdXRcbiAgLy8gYnVnIHRoZXkncmUgY2FwdHVyaW5nIG1heSBub3QgcmVwcm8gYXQgZGVmYXVsdCB6b29tLlxuICB6b29tPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgRnJhbWV3b3JrSW5mbyA9IHtcbiAgZnJhbWV3b3JrOiAncmVhY3QnIHwgJ3Z1ZScgfCAnbGl0JyB8ICdzdGVuY2lsJyB8ICdzdmVsdGUnIHwgJ3dlYi1jb21wb25lbnQnO1xuICBuYW1lPzogc3RyaW5nO1xuICBkaXNwbGF5TmFtZT86IHN0cmluZztcbiAgc291cmNlPzoge2ZpbGU/OiBzdHJpbmcgfCBudWxsOyBsaW5lPzogbnVtYmVyIHwgbnVsbH07XG4gIC8vIFVwLXRyZWUgY29tcG9uZW50IGFuY2VzdHJ5IChpbm5lcm1vc3QgZmlyc3QpLiBGb3IgUmVhY3QsIHdhbGtlZCB2aWFcbiAgLy8gZmliZXIgYHJldHVybmAgY2hhaW47IGZvciBWdWUsIHZpYSBgX192dWVQYXJlbnRDb21wb25lbnQucGFyZW50YC5cbiAgLy8gVGhlIGNvbXBvbmVudCBuYW1lIGFsb25lIGRvZXNuJ3QgdGVsbCBhbiBhZ2VudCB3aGljaCBmaWxlIG93bnMgdGhlXG4gIC8vIHJlbmRlcmluZyDigJQgdGhlIGNoYWluIGhlbHBzIGl0IGdyZXAgdXB3YXJkIHRvIGZpbmQgdGhlIHJvdXRlXG4gIC8vIGNvbXBvbmVudCwgdGhlbiBkcmlsbCBpbnRvIHRoZSBvd25pbmcgZmlsZS5cbiAgY2hhaW4/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIEFuY2VzdG9yID0ge1xuICB0YWc6IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgTWF0Y2hlZFJ1bGUgPSB7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIGRlY2xhcmF0aW9ucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1lZGlhPzogc3RyaW5nO1xuICAvLyBXYXMgdGhlIEBtZWRpYSBxdWVyeSB0aGF0IHdyYXBzIHRoaXMgcnVsZSBhY3R1YWxseSBtYXRjaGVkIGF0XG4gIC8vIGNhcHR1cmUgdGltZT8gYHRydWVgID0gYWN0aXZlLFxuICAvLyBgZmFsc2VgID0gbWF0Y2hlZCB0aGUgc2VsZWN0b3IgYnV0IGluYWN0aXZlIChlLmcuIG1vYmlsZSBydWxlc1xuICAvLyBjYXB0dXJlZCBvbiBhIGRlc2t0b3Agdmlld3BvcnQpLCBgdW5kZWZpbmVkYCA9IG1hdGNoTWVkaWEgdGhyZXcuXG4gIG1lZGlhQWN0aXZlPzogYm9vbGVhbjtcbn07XG5cbi8vIFN5bnRoZXRpYyBoaW50cyBQaW5jaEdyYWIgYWRkcyB0byBlbnRyaWVzIOKAlCBrZXB0IGRpc3RpbmN0IGZyb20gYGF0dHJzYFxuLy8gKHJlYWwgRE9NIGF0dHJpYnV0ZXMpIHNvIGNvbnN1bWVycyBjYW4gdGVsbCB3aGF0IGNhbWUgZnJvbSB0aGUgcGFnZSB2c1xuLy8gd2hhdCB0aGUgY2FwdHVyZSBwaXBlbGluZSBpbmplY3RlZC5cbmV4cG9ydCB0eXBlIEVudHJ5SGludHMgPSB7XG4gIGZvcm1hdD86IHN0cmluZzsgICAgIC8vIGlucHV0IGZvcm1hdCBoaW50IChlLmcuICdZWVlZLU1NLUREJylcbiAgdmFsdWVNYXNrZWQ/OiBib29sZWFuOyAvLyBwYXNzd29yZCB2YWx1ZSB3YXMgbWFza2VkIGF0IGNhcHR1cmUgdGltZVxufTtcblxuZXhwb3J0IHR5cGUgRW50cnkgPSB7XG4gIC8vIFN0YWJsZSBwZXItZW50cnkgdXVpZC4gR2VuZXJhdGVkIGF0IGNhcHR1cmUgdGltZS4gRGlzdGluY3QgZnJvbSBgbmBcbiAgLy8gKGRpc3BsYXkgc2VxdWVuY2UpIGFuZCBmcm9tIGBpZGAgKERPTSBodG1sIGlkIGF0dHJpYnV0ZSkuIEZvcmVpZ24ta2V5XG4gIC8vIHRhcmdldCBmb3IgRmVlZGJhY2tNZXNzYWdlLnBhcmVudElkLlxuICB1aWQ6IHN0cmluZztcbiAgLy8gRm9yZWlnbiBrZXkgaW50byB0aGUgc2Vzc2lvbiByb3cgKFBhZ2VNZXNzYWdlLnNlc3Npb25JZCkuIExldHMgYVxuICAvLyBjb25zdW1lciBsaW5rIGNhcHR1cmVzIGJhY2sgdG8gXCJ3aGljaCBwYWdlLWxvYWQgY29udGV4dCBkaWQgdGhleVxuICAvLyBjb21lIGZyb20/XCIgd2l0aG91dCBkZXBlbmRpbmcgb24gVVJMIHN0cmluZyBlcXVhbGl0eSwgd2hpY2ggYnJlYWtzXG4gIC8vIG9uIGhhc2ggbmF2aWdhdGlvbiwgcXVlcnktcGFyYW0gc3dhcHMsIGFuZCBTUEEgcm91dGluZy4gU2V0IGJ5IHRoZVxuICAvLyBzaWRlIHBhbmVsIGF0IG1lc3NhZ2UtcmVjZWl2ZSB0aW1lLCBub3Qgb24gdGhlIHBhZ2Ugc2lkZS5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xuICBuOiBudW1iZXI7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0YWc6IHN0cmluZztcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgb3V0ZXJIVE1MPzogc3RyaW5nO1xuICB0ZXh0Pzogc3RyaW5nO1xuICAvLyBUaGUgdmlzdWFsbHktcmVuZGVyZWQgZm9ybSB3aGVuIENTUyBgdGV4dC10cmFuc2Zvcm1gIGlzIHNldC4gQ2FwdHVyZWRcbiAgLy8gYWxvbmdzaWRlIGB0ZXh0YCAod2hpY2ggaXMgdGhlIHNvdXJjZS10cnV0aCBgdGV4dENvbnRlbnRgKSBzbyBhbiBMTE1cbiAgLy8gY2FuIGRpc2FtYmlndWF0ZSBiZXR3ZWVuIGUuZy4gc291cmNlIGBSZWZyZXNoYCBhbmQgcmVuZGVyZWQgYFJFRlJFU0hgXG4gIC8vIHdpdGhvdXQgZmFsc2UtZ3JlcHBpbmcgYWdhaW5zdCBlaXRoZXIuXG4gIHJlbmRlcmVkVGV4dD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgYWNjZXNzaWJsZU5hbWU/OiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nOyAgICAgICAgICAgIC8vIHRoZSBET00gaHRtbCBpZCBhdHRyaWJ1dGUgKHVuY2hhbmdlZClcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG4gIGF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgLy8gcmVhbCBET00gYXR0cmlidXRlcyBvbmx5XG4gIGhpbnRzPzogRW50cnlIaW50czsgICAgIC8vIHN5bnRoZXRpYyBjYXB0dXJlLXRpbWUgaGludHNcbiAgcmVjdDogUmVjdDtcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICBpblNoYWRvd0RPTT86IGJvb2xlYW47XG4gIC8vIENTUyBzZWxlY3RvciBmb3IgdGhlIHNoYWRvdyBob3N0IHdoZW4gYGluU2hhZG93RE9NYCBpcyB0cnVlLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgKG9yIHRoZSBwYW5lbCdzIHJlLXZhbGlkYXRpb24gcGFzcykgZmluZCB0aGUgaG9zdCBlbGVtZW50XG4gIC8vIHNpbmNlIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsYCBkb2Vzbid0IHBpZXJjZSBzaGFkb3cgcm9vdHMuXG4gIHNoYWRvd0hvc3Q/OiBzdHJpbmc7XG4gIGNvbXBvbmVudFJvb3Q/OiBzdHJpbmc7XG4gIGFuY2VzdG9ycz86IEFuY2VzdG9yW107XG4gIGNvbXBvbmVudD86IEZyYW1ld29ya0luZm87XG4gIC8vIFJlYWN0IGV2ZW50IGhhbmRsZXIgbmFtZXMgcHJvYmVkIGZyb20gYF9fcmVhY3RQcm9wcyQ8a2V5PmAg4oCUIGFuc3dlcnNcbiAgLy8gXCJ3aGljaCBoYW5kbGVyIGZpcmVzIHdoZW4gdGhpcyBpcyBjbGlja2VkP1wiIHdpdGhvdXQgYW4gTExNIGhhdmluZyB0b1xuICAvLyBncmVwIHRoZSBjb2RlYmFzZS4gSW4gZGV2IGJ1aWxkcyB0aGVzZSBhcmUgcmVhbCBmdW5jdGlvbiBuYW1lczsgaW5cbiAgLy8gcHJvZCB0aGV5J3JlIG1pbmlmaWVkIGJ1dCBzdGlsbCBhbmNob3ItYWJsZS5cbiAgZXZlbnRzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gaHRteCAvIFN0aW11bHVzIC8gQWxwaW5lIC8gVHVyYm8gd2lyaW5nIG9uIHRoZSBlbGVtZW50LiBTZXJ2ZXItXG4gIC8vIHJlbmRlcmVkIGFwcHMgZG9uJ3QgaGF2ZSBSZWFjdCBmaWJlcnMg4oCUIGZvciB0aGVtLCB0aGlzIElTIHRoZVxuICAvLyBjb21wb25lbnQgc2hhcGUuXG4gIGJlaGF2aW9yQXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBUcnVlIHdoZW4gYGVsLmdldEFuaW1hdGlvbnMoKWAgcmVwb3J0ZWQgYW4gYWN0aXZlbHktcGxheWluZ1xuICAvLyBhbmltYXRpb24gYXQgY2FwdHVyZSB0aW1lLiBUZWxscyB0aGUgY29uc3VtZXIgdGhhdCBjYXB0dXJlZCByZWN0IC9cbiAgLy8gdHJhbnNmb3JtIC8gb3BhY2l0eSBtYXkgYmUgYXQgYW4gaW50ZXJwb2xhdGVkIG1pZC1hbmltYXRpb24gdmFsdWUuXG4gIGlzQW5pbWF0aW5nPzogYm9vbGVhbjtcbiAgLy8gRm9yIGVsZW1lbnRzIHJlbmRlcmVkIGludG8gYSBgPGNhbnZhcz5gLCB0aGUgRE9NIGdpdmVzIHVzIGVzc2VudGlhbGx5XG4gIC8vIG5vdGhpbmcgYWJvdXQgd2hhdCB3YXMgY2xpY2tlZCDigJQgdGhlIGNhbnZhcyBoYXMgbm8gY2hpbGRyZW4sIG5vXG4gIC8vIHRleHQsIG5vIG1lYW5pbmdmdWwgc2VsZWN0b3JzIGJlbG93IHRoZSBjYW52YXMgaXRzZWxmLiBDYXB0dXJlIHRoZVxuICAvLyBjbGljayBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY2FudmFzJ3MgYm91bmRpbmcgYm94IHNvIGEgZG93bnN0cmVhbVxuICAvLyBjb25zdW1lciBjYW4gY29ycmVsYXRlIChlLmcuIGFnYWluc3QgYSBEYXRhZG9nIC8gVGFibGVhdSAvIGNoYXJ0aW5nXG4gIC8vIGxpYnJhcnkgdGhhdCBleHBvc2VzIGRhdGEtcG9pbnQgY29vcmRpbmF0ZXMpLiBDb29yZGluYXRlcyBhcmUgQ1NTXG4gIC8vIHBpeGVsczsgbXVsdGlwbHkgYnkgYHZpZXdwb3J0LmRwcmAgdG8gZ2V0IGRldmljZSBwaXhlbHMuXG4gIGNhbnZhc0NsaWNrPzoge1xuICAgIG9mZnNldFg6IG51bWJlcjtcbiAgICBvZmZzZXRZOiBudW1iZXI7XG4gICAgY2FudmFzVzogbnVtYmVyO1xuICAgIGNhbnZhc0g6IG51bWJlcjtcbiAgICBjYW52YXNTZWxlY3Rvcjogc3RyaW5nO1xuICB9O1xuICAvLyBDb250ZW50ZWRpdGFibGUgcmljaC10ZXh0IGVkaXRvciBjb250ZXh0LiBQb3B1bGF0ZWQgd2hlbiB0aGUgY2FwdHVyZWRcbiAgLy8gbm9kZSBpcywgb3IgbGl2ZXMgaW5zaWRlLCBhIGBbY29udGVudGVkaXRhYmxlPXRydWVdYCBhbmNlc3Rvci4gTGV0c1xuICAvLyBhbiBMTE0gcmVhc29uaW5nIGFib3V0IGEgXCJjb3B5IGlzIHdyb25nXCIgLyBcInRoZSBlZGl0b3IgYnJlYWtzIHdoZW4gWFwiXG4gIC8vIGNhcHR1cmUga25vdyB3aGljaCBlZGl0b3IgbGlicmFyeSB0byBsb29rIGF0IOKAlCBzZWxlY3RvcnMgZ2VuZXJhdGVkXG4gIC8vIGJ5IFByb3NlTWlycm9yIC8gTGV4aWNhbCAvIGV0YyBhcmUgcnVudGltZS1pbnRlcm5hbCBhbmQgd29uJ3QgZ3JlcFxuICAvLyBhZ2FpbnN0IHVzZXIgY29kZSwgYnV0IHRoZSBMSUJSQVJZIHBvaW50ZXIgcm91dGVzIHRoZSBMTE0gdG8gdGhlXG4gIC8vIHJpZ2h0IHdyYXBwZXIgY29tcG9uZW50LlxuICBlZGl0b3I/OiB7XG4gICAga2luZDogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJztcbiAgICByb290U2VsZWN0b3I6IHN0cmluZztcbiAgICBjb250ZW50TGVuZ3RoOiBudW1iZXI7XG4gIH07XG4gIC8vIExhc3QgZmV3IERPTSBtdXRhdGlvbnMgQkVGT1JFIHRoZSBjbGljay4gUmVwcm8gY29udGV4dCBmb3IgYnVncyBsaWtlXG4gIC8vIFwiSSBjbGlja2VkIHRoZSB3cm9uZyBkcm9wZG93biBvcHRpb25cIiBvciBcInRoZSB2YWx1ZSBmbGlja2VyZWQgYmVmb3JlXG4gIC8vIEkgY2xpY2tlZCBpdFwiIOKAlCB3aXRob3V0IHRoaXMsIHRoZSBKU09OIHNuYXBzaG90cyBvbmx5IHRoZSBwb3N0LVxuICAvLyBtdXRhdGlvbiBzdGF0ZSwgbGVhdmluZyB0aGUgTExNIGJsaW5kIHRvIHdoYXQgdHJpZ2dlcmVkIHRoZVxuICAvLyBhcHBlYXJhbmNlIHRoZSB1c2VyIGNvbXBsYWluZWQgYWJvdXQuIFBpbmNoZ3JhYiBrZWVwcyBhbiA4LXNlY29uZFxuICAvLyByaW5nIGJ1ZmZlciBvZiBtdXRhdGlvbiByZWNvcmRzOyBjYXB0dXJlIGF0dGFjaGVzIHRoZSBtb3N0IHJlY2VudFxuICAvLyAzIGFzIGEgc25hcHNob3QuXG4gIGRvbU11dGF0aW9ucz86IERvbU11dGF0aW9uW107XG4gIHN0YXRlcz86IHN0cmluZ1tdOyAgICAgIC8vIGFjdGl2ZSBwc2V1ZG8tY2xhc3NlcyAod2FzIFJlY29yZDxzdHJpbmcsIHRydWU+IGluIHYxKVxuICAvLyBMb2NhdG9yIHF1YWxpdHk6IGhvdyBtYW55IGVsZW1lbnRzIGBzZWxlY3RvcmAgcmVzb2x2ZXMgdG8gaW4gaXRzXG4gIC8vIHNjb3BlICgxID0gdW5pcXVlKS4gSGlnaGVyIG1lYW5zIHRoZSBzZWxlY3RvciBpcyBhbWJpZ3VvdXMuXG4gIHNlbGVjdG9yTWF0Y2hDb3VudD86IG51bWJlcjtcbiAgLy8gRGlzYW1iaWd1YXRlZCBvcmRlcmluZyBmaWVsZHMuXG4gIC8vIGBuYCBpcyBwcmVzZXJ2ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXQgKGl0J3MgdGhlIGNhcHR1cmUtc2VxdWVuY2VcbiAgLy8gZGlzcGxheSBsYWJlbCBpbiB0aGUgc2lkZWJhcikuIFRoZSBuZXcgZmllbGRzIGFyZSBlbWl0LXRpbWUgb25seTpcbiAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCBzYW1lIGFzIGBuYCAoY2FwdHVyZSBzZXF1ZW5jZSB3aXRoaW4gc2Vzc2lvbilcbiAgLy8gICDigKIgZXZlbnRJbmRleCAgIOKAlCBtb25vdG9uaWMgcG9zaXRpb24gaW4gdGhlIEpTT05MIHN0cmVhbVxuICAvLyAgIOKAoiB2aXN1YWxPcmRlciAg4oCUIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHJhbmsgd2l0aGluIHRoZSBwYWdlXG4gIC8vICAg4oCiIGRpc3BsYXlMYWJlbCDigJQgZ3VhcmFudGVlZC11bmlxdWUgaHVtYW4gbGFiZWw6IG1pcnJvcnMgYG5gIHdoZW5cbiAgLy8gICAgIHVuaXF1ZSwgZWxzZSBgbi5rYCAodGhlIGNhcHR1cmUgY291bnRlciByZXN0YXJ0cyBwZXIgc2Vzc2lvbilcbiAgY2FwdHVyZUluZGV4PzogbnVtYmVyO1xuICBldmVudEluZGV4PzogbnVtYmVyO1xuICB2aXN1YWxPcmRlcj86IG51bWJlcjtcbiAgZGlzcGxheUxhYmVsPzogc3RyaW5nO1xuICAvLyBHcm91cCBmbGF0dGVuaW5nIGZpZWxkcy5cbiAgLy8gVGhlIGdyb3VwIGhlYWQgY2FycmllcyBgZ3JvdXBNZW1iZXJVaWRzYCAoanVzdCB0aGUgSURzKTsgZWFjaFxuICAvLyBtZW1iZXIgZW1pdHMgYXMgaXRzIG93biB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZ1xuICAvLyBiYWNrIGF0IHRoZSBoZWFkLlxuICBncm91cE1lbWJlclVpZHM/OiBzdHJpbmdbXTtcbiAgZ3JvdXBVaWQ/OiBzdHJpbmc7XG4gIC8vIExpZ2h0d2VpZ2h0IGExMXkgYXVkaXQgY2FwdHVyZWQgYXQgY2xpY2sgdGltZS4gSGVhdmllciBjaGVja3NcbiAgLy8gKGZvY3VzLXZpc2libGUgc2NyZWVuc2hvdHMsIGF4ZSB2aW9sYXRpb25zKSBhcmUgbm90IHlldCB3aXJlZC5cbiAgYTExeT86IHtcbiAgICBjb250cmFzdFJhdGlvPzogbnVtYmVyO1xuICAgIGNvbnRyYXN0UGFzc2VzPzogJ0FBJyB8ICdBQUEnIHwgJ2ZhaWwnO1xuICAgIHRhYmJhYmxlPzogYm9vbGVhbjtcbiAgICBmb2N1c1Zpc2libGU/OiBib29sZWFuO1xuICB9O1xuICAvLyBQYXJlbnQgbGF5b3V0IGNvbnRleHQg4oCUIGZsZXgvZ3JpZC9vdmVyZmxvdy9zY3JvbGwvc3RhY2tpbmdcbiAgLy8gYW5jZXN0b3JzIHRoYXQgc2hhcGUgdGhlIGNhcHR1cmVkIGVsZW1lbnQncyBhcHBlYXJhbmNlLlxuICBsYXlvdXRDb250ZXh0PzogQXJyYXk8e1xuICAgIHRhZzogc3RyaW5nO1xuICAgIGRpc3BsYXk/OiBzdHJpbmc7XG4gICAgcG9zaXRpb24/OiBzdHJpbmc7XG4gICAgb3ZlcmZsb3c/OiBzdHJpbmc7XG4gICAgekluZGV4Pzogc3RyaW5nO1xuICAgIHRyYW5zZm9ybT86IHN0cmluZztcbiAgICB3aWxsQ2hhbmdlPzogc3RyaW5nO1xuICAgIGlzU2Nyb2xsQ29udGFpbmVyPzogYm9vbGVhbjtcbiAgICBzY3JvbGxMZWZ0PzogbnVtYmVyO1xuICAgIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgICBmbGV4Pzoge2RpcmVjdGlvbj86IHN0cmluZzsgd3JhcD86IHN0cmluZzsgYWxpZ25JdGVtcz86IHN0cmluZzsganVzdGlmeUNvbnRlbnQ/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gICAgZ3JpZD86IHt0ZW1wbGF0ZUNvbHVtbnM/OiBzdHJpbmc7IHRlbXBsYXRlUm93cz86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgfT47XG4gIC8vIEFzc2V0IHJlZmVyZW5jZXMgaW5zaWRlIHRoZSBjYXB0dXJlZCBzdWJ0cmVlIChpbWcgc3JjLCA8dXNlIGhyZWY+LFxuICAvLyBiYWNrZ3JvdW5kLWltYWdlIHVybCkuIFdoZW4gYSBjb21wbGFpbnQgaXMgYWJvdXQgYSBsb2dvIC8gaWNvbiAvXG4gIC8vIGFydHdvcmssIGFuIGFnZW50IHdpdGhvdXQgdGhlc2UgcmVmZXJlbmNlcyB3b3VsZCBiZSBsZWZ0IGd1ZXNzaW5nLlxuICBhc3NldHM/OiBBcnJheTx7XG4gICAgc3JjOiBzdHJpbmc7XG4gICAgbmF0dXJhbFc/OiBudW1iZXI7IG5hdHVyYWxIPzogbnVtYmVyO1xuICAgIHJlbmRlcmVkVz86IG51bWJlcjsgcmVuZGVyZWRIPzogbnVtYmVyO1xuICAgIGFsdD86IHN0cmluZztcbiAgICBsb2FkZWQ/OiBib29sZWFuO1xuICB9PjtcbiAgc3R5bGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWF0Y2hlZFJ1bGVzPzogTWF0Y2hlZFJ1bGVbXTtcbiAgcHNldWRvRWxlbWVudHM/OiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PjtcbiAgLy8gVHJ1bmNhdGlvbiBtYXJrZXJzIOKAlCBwcmVzZW50IHdoZW4gY2FwdHVyZSBoYWQgdG8gZWxpZGUgY29udGVudC4gTGV0c1xuICAvLyBhIGNvbnN1bWVyIGRldGVjdCBcInRoaXMgZW50cnkgd2FzIGN1dCBkb3duXCIgYW5kIHJlZmV0Y2ggZnJvbSB0aGVcbiAgLy8gbGl2ZSBwYWdlIGlmIGl0IG5lZWRzIHRoZSBmdWxsIHZlcnNpb24uXG4gIC8vICAgb3V0ZXJIVE1MIOKAlCBvcmlnaW5hbCBodG1sIGxlbmd0aCBiZWZvcmUgdGhlIHNpemUtY2FwIGtpY2tlZCBpbi5cbiAgLy8gICBjaGlsZHJlbiAg4oCUIG51bWJlciBvZiBkZXNjZW5kYW50IHN1YnRyZWVzIHJlcGxhY2VkIGJ5IGRlcHRoLWNhcFxuICAvLyAgICAgICAgICAgICAgIGVsaXNpb24gbWFya2VycyAoYDwhLS0gTiBjaGlsZHJlbiBlbGlkZWQgLS0+YCkuXG4gIHRydW5jYXRlZD86IHtvdXRlckhUTUw/OiBudW1iZXI7IGNoaWxkcmVuPzogbnVtYmVyOyB0ZXh0PzogbnVtYmVyfTtcbiAgLy8gR3JvdXAgb2YgYWRkaXRpb25hbCBjYXB0dXJlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBlbnRyeSAoQWx0K1NoaWZ0K0NsaWNrXG4gIC8vIC8gQWx0K2RyYWcgc2VsZWN0aW9ucyBjb2xsYXBzZSBoZXJlKS5cbiAgZ3JvdXA/OiBFbnRyeVtdO1xuICAvLyBPcHRpb25hbCBzY3JlZW5zaG90IGJ1bmRsZTogZWFjaCBmaWVsZCBpcyBhIHJlbGF0aXZlIHBhdGggdW5kZXIgdGhlXG4gIC8vIHVzZXIncyBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8gcm9vdC4gVGhlIGNhcHR1cmVkQXQgc3RhbXAgaXNcbiAgLy8gdGhlIElTTyB0aW1lc3RhbXAgd2hlbiB0aGUgc2hvdCB3YXMgdGFrZW4uXG4gIHNjcmVlbnNob3Q/OiB7XG4gICAgZWxlbWVudD86IHN0cmluZztcbiAgICBncm91cD86IHN0cmluZztcbiAgICBwYWdlPzogc3RyaW5nO1xuICAgIGNhcHR1cmVkQXQ/OiBzdHJpbmc7XG4gICAgLy8gQW4gZW1wdHkgYHNjcmVlbnNob3RgIGZpZWxkIGNvdWxkIG1lYW4gXCJub3QgeWV0IHNob3RcIiwgXCJmYWlsZWRcIixcbiAgICAvLyBvciBcInNraXBwZWQgb24gcHVycG9zZVwiLiBXaGVuIHRoZSBwaXBlbGluZSBkZWNsaW5lcyBvciBmYWlscyxcbiAgICAvLyBzZXQgdGhpcyBzbyByZWNlaXZlcnMga25vdyBpdCdzIG5vdCBhIHJldHJ5IGNhbmRpZGF0ZS5cbiAgICB1bmF2YWlsYWJsZVJlYXNvbj86ICdhdXRvU2NyZWVuc2hvdE9mZicgfCAnc2tpcFNjcmVlbnNob3RIb3N0cycgfCAnY2FwdHVyZUZhaWxlZCcgfCAncGVybWlzc2lvbkRlbmllZCcgfCBzdHJpbmc7XG4gICAgLy8gQ3JvcCBtZXRhZGF0YSBkZXNjcmliaW5nIHdoZXJlIHRoZSBjcm9wcGVkIFBORyBmaXRzIGluIHRoZVxuICAgIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgY3JvcD86IHtcbiAgICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZGV2aWNlUHhSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRwcjogbnVtYmVyO1xuICAgICAgcGFkZGluZzogbnVtYmVyO1xuICAgICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgICB9O1xuICB9O1xufTtcblxuLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBwYWdlIG1ldGFkYXRhLCBlbWl0dGVkIG9uY2UgcGVyIGRpc3RpbmN0IHBhZ2UgVVJMXG4vLyBpbnZvbHZlZCBpbiBjYXB0dXJlcyAoZGVkdXBlZCBieSBVUkwpLiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwuXG4vLyBgcGFydGlhbGAgaXMgc2V0IHdoZW4gb25seSB0aGUgdmlld3BvcnQgY291bGQgYmUgY2FwdHVyZWQgKGZ1bGwtcGFnZSBzdGl0Y2hcbi8vIHVuYXZhaWxhYmxlKSDigJQgc2VlIGJhY2tncm91bmQudHMgc3RpdGNoUGFnZSBsaW1pdGF0aW9ucy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdCA9IHsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmc7IGNhcHR1cmVkQXQ6IHN0cmluZzsgdmlld3BvcnQ6IHt3aWR0aDogbnVtYmVyO2hlaWdodDogbnVtYmVyfTsgc2Nyb2xsV2lkdGg6IG51bWJlcjsgc2Nyb2xsSGVpZ2h0OiBudW1iZXI7IGRldmljZVBpeGVsUmF0aW86IG51bWJlcjsgbGFuZzogc3RyaW5nOyBzY3JlZW5zaG90OiBzdHJpbmc7IHBhcnRpYWw/OiBib29sZWFuIH07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIC8vIFVzZXIgZXhwbGljaXRseSBkZXRhY2hlZCB0aGlzIGNvbW1lbnQgZnJvbSBhbnkgc2VsZWN0b3IuIFdpdGhvdXQgdGhlXG4gIC8vIGZsYWcsIGFkamFjZW5jeSB0byB0aGUgcHJlY2VkaW5nIHNlbGVjdG9yIHdvdWxkIHNpbGVudGx5IHJlLWFkb3B0IHRoZVxuICAvLyBjb21tZW50IGF0IHJlbmRlci9leHBvcnQgdGltZS5cbiAgZGV0YWNoZWQ/OiBib29sZWFuO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICAvLyBQYWdlIHJlcG9ydHMgaXRzIHN0aWNreSBwaW5jaC1tb2RlIHN0YXRlIChlLmcuIHRoZSB1c2VyIHByZXNzZWQgRXNjIG9uXG4gIC8vIHRoZSBwYWdlIHRvIGV4aXQpIHNvIHRoZSBwYW5lbCB0b2dnbGUgc3RheXMgaW4gc3luYy5cbiAgfCB7a2luZDogJ3NlbGVjdC1tb2RlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9XG4gIC8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgbWV0YWRhdGEgZm9yIG9uZSBkaXN0aW5jdCBwYWdlIChVUkwpLiBFbWl0dGVkIGF0XG4gIC8vIG1vc3Qgb25jZSBwZXIgVVJMICh0aGUgY29udGVudCBzY3JpcHQgZGVkdXBlcykuIFRoZSBwYW5lbCBjYW4gc3Rhc2ggdGhlc2VcbiAgLy8gYXMgcGFnZS1sZXZlbCBjb250ZXh0IC8gZXhwb3J0IHRoZW0gYWxvbmdzaWRlIGVsZW1lbnQgc2hvdHMuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90JzsgcGF5bG9hZDogUGFnZVNuYXBzaG90fTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0NzID1cbiAgfCB7a2luZDogJ291dGxpbmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBnb2xkPzogYm9vbGVhbjsgZGFzaGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ291dGxpbmUtY2xlYXInfVxuICAvLyBTdGlja3kgXCJwaW5jaCBtb2RlXCI6IHdoaWxlIG9uLCBwbGFpbiBob3Zlci9jbGljayBjYXB0dXJlcyB3aXRob3V0IHRoZVxuICAvLyBBbHQgbW9kaWZpZXIsIGFuZCB0aGUgcGFnZSBzaG93cyBhIG1vZGUgaW5kaWNhdG9yLiBFc2MgZXhpdHMuXG4gIHwge2tpbmQ6ICdzZWxlY3QtbW9kZSc7IG9uOiBib29sZWFufVxuICAvLyBFeHBvcnQtdGltZSByZXF1ZXN0IGZvciB0aGUgZnVsbCBzZXJpYWxpemVkIHBhZ2UgKG9wdC1pbiBwcmVmXG4gIC8vIGluY2x1ZGVQYWdlSFRNTCkuIFJlcGxpZWQgd2l0aCB7b2ssIHVybCwgdGl0bGUsIGh0bWx9OyBuZXZlciBwZXJzaXN0ZWRcbiAgLy8gdG8gY2hyb21lLnN0b3JhZ2Ug4oCUIHRoZSBwYXlsb2FkIGdvZXMgc3RyYWlnaHQgaW50byB0aGUgdGFyLlxuICB8IHtraW5kOiAncGFnZS1odG1sJ31cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGknOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9XG4gIHwge2tpbmQ6ICdzY3JvbGwtdG8nOyBzZWxlY3Rvcjogc3RyaW5nOyBzdGlja3k/OiBib29sZWFufVxuICB8IHtraW5kOiAnc3RpY2t5LWNsZWFyJ31cbiAgLy8gT25lLXNob3QgbG9jYXRvciBhbmltYXRpb246IHNjcm9sbCBpbnRvIHZpZXcgKyB0aHJlZSBwdWxzaW5nIHJpbmdzLlxuICAvLyBEaXN0aW5jdCBmcm9tIGBvdXRsaW5lYCAoc3VidGxlIGhvdmVyIHJpbmcpIGFuZCBgc2Nyb2xsLXRvYCAoc2lsZW50XG4gIC8vIHJlY2VudGVyKSBzbyB0aGUgc2lkZSBwYW5lbCBMb2NhdGUgYnV0dG9uIGNhbiByZXF1ZXN0IHNvbWV0aGluZyB1c2Vyc1xuICAvLyBjYW4gYWN0dWFsbHkgZmluZCBvbiBhIGJ1c3kgcGFnZS5cbiAgfCB7a2luZDogJ2xvY2F0ZS1mbGFzaCc7IHNlbGVjdG9yOiBzdHJpbmd9XG4gIHwge2tpbmQ6ICd2YWxpZGF0ZSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdsb2ctZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdyZWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnY2FwdHVyZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIC8vIE91dGxpbmUgdGhlIE50aCBhbmNlc3RvciBvZiBgc2VsZWN0b3JgIHdpdGhvdXQgY2FwdHVyaW5nIGl0IOKAlCB1c2VkIGJ5XG4gIC8vIGhvdmVyIG9uIGFuY2VzdG9yIGJyZWFkY3J1bWIgY2hpcHMgaW4gdGhlIHNpZGUgcGFuZWwgc28gdGhlIHVzZXJcbiAgLy8gcHJldmlld3Mgd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjbGlja2luZy5cbiAgfCB7a2luZDogJ291dGxpbmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICB8IHtraW5kOiAnYWx0LXN0YXRlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdtYW51YWwtY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uJzsgc2VsZWN0b3I6IHN0cmluZzsgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9XG4gIHwge2tpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfVxuICB8IHtraW5kOiAnc2V0LWNhcHR1cmVkJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ3NldC1jcy1wcmVmcyc7IHNwYWNpbmdPdmVybGF5PzogYm9vbGVhbjsgaG92ZXJTbmFwPzogYm9vbGVhbn1cbiAgLy8gU2NyZWVuc2hvdC10aW1lIG92ZXJsYXkgdG9nZ2xlcy4gVGhlIGJhY2tncm91bmQgYXNrcyB0aGUgY29udGVudCBzY3JpcHRcbiAgLy8gdG8gaGlkZSBpdHMgc2hhZG93LXJvb3QgY2hyb21lIChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIGJlZm9yZVxuICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlcywgdGhlbiByZXN0b3JlcyB2aXNpYmlsaXR5IG9uY2UgdGhlIFBORyBpcyBiYWNrLlxuICB8IHtraW5kOiAnaGlkZS1vdmVybGF5cyd9XG4gIHwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ307XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25QYXlsb2FkID0ge1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLy8gVGhlIGNhcHR1cmVkIGVudHJ5J3Mgc3RhYmxlIHVpZC4gVGhlIGNvbnRlbnQgc2NyaXB0IG5lZWRzIHRoaXMgc29cbiAgLy8gaXRzIG9uLXBhZ2UgY29tbWVudCBib3ggY2FuIHJvdXRlIHRoZSBjb21tZW50IHRvIHRoZSAqc3BlY2lmaWMqXG4gIC8vIGNhcHR1cmUgcmF0aGVyIHRoYW4gdG8gXCJhbnkgc2VsZWN0b3IgdGhhdCBtYXRjaGVzLlwiIFByZXZlbnRzXG4gIC8vIGNyb3NzLWNvbnRhbWluYXRpb24gd2hlbiB0d28gY2FwdHVyZXMgc2hhcmUgYSBzZWxlY3RvciBhY3Jvc3NcbiAgLy8gcGFnZXMgb3IgdHdvIHNpYmxpbmcgZWxlbWVudHMgc2hhcmUgYSB0ZXN0SWQuXG4gIHVpZD86IHN0cmluZztcbiAgbj86IG51bWJlcjtcbiAgY2FwdHVyZWQ/OiBib29sZWFuO1xuICBmZWVkYmFjaz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0JnID1cbiAgfCB7a2luZDogJ2NhcHR1cmUtc2NyZWVuc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc3dpdGNoLXRvLXRhYic7IHVybDogc3RyaW5nOyBvcGVuSWZNaXNzaW5nPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2xpc3Qtb3Blbi10YWJzJ31cbiAgfCB7a2luZDogJ3Nob3QtZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1ncm91cCc7IHNlbGVjdG9yczogc3RyaW5nW107IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1wYWdlJzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIEZ1bGwtcGFnZSAoYmVzdC1lZmZvcnQpIHNjcmVlbnNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFVubGlrZVxuICAvLyBzaG90LXBhZ2UgdGhpcyBkb2VzIE5PVCB3cml0ZSBhIGZpbGUgb3IgYnVpbGQgYSB0aHVtYm5haWwg4oCUIGl0IGp1c3RcbiAgLy8gcmV0dXJucyB0aGUgc3RpdGNoZWQgUE5HIGFzIGEgZGF0YSBVUkwgc28gdGhlIGNhbGxlciAoY29udGVudCBzY3JpcHQpIGNhblxuICAvLyBhdHRhY2ggaXQgdG8gYSBQYWdlU25hcHNob3QuIGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnRcbiAgLy8gY291bGQgYmUgY2FwdHVyZWQuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBQYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIChyZSlpbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IOKAlCB0aGUgZml4XG4gIC8vIGZvciBcIkFsdCBzdG9wcGVkIHdvcmtpbmdcIiBhZnRlciBhbiBleHRlbnNpb24gcmVsb2FkIG9ycGhhbnMgdGhlIHBhZ2Unc1xuICAvLyBjb250ZW50IHNjcmlwdC4gRGVmYXVsdHMgdG8gdGhlIGFjdGl2ZSB0YWIuXG4gIHwge2tpbmQ6ICdwZy1yZWluamVjdCc7IHRhYklkPzogbnVtYmVyfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbi8vIFJlcGx5IHRvIGEgYHBhZ2Utc25hcHNob3Qtc2hvdGAgcmVxdWVzdC4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMIG9mXG4vLyB0aGUgKGJlc3QtZWZmb3J0KSBmdWxsIHBhZ2U7IGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnQgd2FzXG4vLyBjYXB0dXJlZC4gYG9rOmZhbHNlYCBjYXJyaWVzIGFuIGVycm9yIHN0cmluZy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgc2NyZWVuc2hvdD86IHN0cmluZztcbiAgcGFydGlhbD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5XG4gIHwgUGFnZVNuYXBzaG90UmVwbHk7XG5cbi8vIOKUgOKUgOKUgCBFeHBvcnQgc2hhcGVzICh2Mikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBNYW5pZmVzdCBsaW5lIGVtaXR0ZWQgYXMgdGhlIHZlcnkgZmlyc3QgSlNPTkwgbGluZS4gQ2FycmllcyB0aGUgbWV0YWRhdGFcbi8vIG5lY2Vzc2FyeSB0byByZXN5bmMgYSBkb3dubG9hZGVkIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlICsgdG9vbGluZy5cbmV4cG9ydCB0eXBlIEV4cG9ydE1hbmlmZXN0ID0ge1xuICB2OiAyO1xuICB0eXBlOiAnbWFuaWZlc3QnO1xuICB0czogc3RyaW5nOyAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgZXhwb3J0IHdhcyBnZW5lcmF0ZWRcbiAgZ2VuZXJhdGVkOiBudW1iZXI7IC8vIGVwb2NoIG1zIChtaXJyb3Igb2YgdHMgaW4gbWFjaGluZS1yZWFkYWJsZSBmb3JtKVxuICB0b29sOiAncGluY2hncmFiJztcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGZvcm1hdDogJ2pzb25sJyB8ICdtYXJrZG93bicgfCAndGFyLnpzdCc7XG4gIC8vIENvbnRlbnQtZGVyaXZlZCBpZGVudGl0eTogZmlyc3QgMTYgaGV4IGNoYXJzIG9mIGEgU0hBLTI1NiBvdmVyIHRoZVxuICAvLyBzbGltIHJvd3MgKyBzY3JlZW5zaG90IG5hbWVzLiBTdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMgb2YgdGhlIHNhbWVcbiAgLy8gY29udGVudCwgc28gZG93bnN0cmVhbSBzdGF0ZSAoZS5nLiB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8qL2J1bmRsZXMvKVxuICAvLyBrZXlzIG9uIGl0IHdpdGhvdXQgZHVwbGljYXRpbmcgd29yay5cbiAgYnVuZGxlSWQ/OiBzdHJpbmc7XG4gIGhvc3RzOiBzdHJpbmdbXTtcbiAgLy8gQW1iaWd1b3VzIHRvdGFscy4gVGhlIHByZXZpb3VzIGBzZWxlY3RvcnMgLyBmZWVkYmFjayAvIHBhZ2VzYFxuICAvLyB0cmlwbGUgZGlkbid0IHNheSB3aGV0aGVyIG5lc3RlZFxuICAvLyBncm91cCBtZW1iZXJzIHdlcmUgY291bnRlZCwgd2hldGhlciBmZWVkYmFjay1iZWFyaW5nIHBhcmVudHMgd2VyZVxuICAvLyBhIHN1YnNldCwgb3IgaG93IHNjcmVlbnNob3RzIHdlcmUgdGFsbGllZC4gVGhlIGV4cGFuZGVkIHNoYXBlXG4gIC8vIGJlbG93IG5hbWVzIGV2ZXJ5IGNhdGVnb3J5IGV4cGxpY2l0bHkgc28gYSBkb3duc3RyZWFtIGFnZW50IGNhblxuICAvLyB0ZWxsIGV4YWN0bHkgd2hhdCdzIGluIHRoZSBidW5kbGUuXG4gIGNvdW50czoge1xuICAgIC8vIFRvcC1sZXZlbCBzZWxlY3RvciByb3dzIGluIHRoZSBKU09OTCBzdHJlYW0gKGV4Y2x1ZGVzIG5lc3RlZFxuICAgIC8vIGdyb3VwIG1lbWJlcnMsIGJ1dCB0aGUgYGdyb3VwTWVtYmVyc2AgZmllbGQgY291bnRzIHRob3NlKS5cbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBmZWVkYmFjazogbnVtYmVyO1xuICAgIHBhZ2VzOiBudW1iZXI7XG4gICAgLy8gTnVtYmVyIG9mIHNlbGVjdG9yIHJvd3MgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBjaGlsZC5cbiAgICAvLyBVc2VmdWwgZm9yIFwic2hvdyBtZSBvbmx5IHRoZSBpdGVtcyB3aXRoIGNvbW1lbnRzXCIuXG4gICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9ycyB0aGF0IHNoaXAgdW5kZXIgYSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYCBhcnJheVxuICAgIC8vIHJhdGhlciB0aGFuIGFzIHRoZWlyIG93biB0b3AtbGV2ZWwgcm93LlxuICAgIGdyb3VwTWVtYmVycz86IG51bWJlcjtcbiAgICAvLyBTY3JlZW5zaG90IGludmVudG9yeSAoY291bnRlZCBieSBmaWxlLCBkZWR1cGVkKS5cbiAgICBzY3JlZW5zaG90c0VsZW1lbnQ/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNHcm91cD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c1BhZ2U/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3Igcm93cyB0aGF0IHNob3VsZCBoYXZlIGFuIGVsZW1lbnQgc2NyZWVuc2hvdCBidXQgZG9uJ3RcbiAgICAvLyAocG9zdC1idWctIzIgZm9yY2VkIHNob290IG1heSBzdGlsbCBmYWlsKS4gUmVwYWlyIGFnZW50cyBjYW5cbiAgICAvLyBza2lwIHRoZXNlIG9yIHJlcXVlc3QgYSByZS1jYXB0dXJlLlxuICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90PzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2hvc2UgcGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbnkgc2VsZWN0b3JcbiAgICAvLyBpbiB0aGlzIGFyY2hpdmUuIFNob3VsZCBhbHdheXMgYmUgMDsgbm9uLXplcm8gbWVhbnMgdGhlIGV4cG9ydFxuICAgIC8vIGdvdCB0cnVuY2F0ZWQgb3IgYSBwYXJlbnQgd2FzIGRlbGV0ZWQgYmV0d2VlbiBjYXB0dXJlICsgZW1pdC5cbiAgICBvcnBoYW5lZEZlZWRiYWNrPzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2l0aCBubyBwYXJlbnRVaWQgYXQgYWxsIOKAlCBpbnRlbnRpb25hbGx5IHBhZ2UtbGV2ZWxcbiAgICAvLyBjb21tZW50cywgbm90IHBpbm5lZCB0byBhbiBlbGVtZW50LiBEaXN0aW5jdCBmcm9tIG9ycGhhbmVkRmVlZGJhY2tcbiAgICAvLyAoYSBkYW5nbGluZyBwYXJlbnRVaWQpLiBTbzogZmVlZGJhY2sgPSBwaW5uZWQgKyBwYWdlTGV2ZWwgKyBvcnBoYW5lZC5cbiAgICBwYWdlTGV2ZWxGZWVkYmFjaz86IG51bWJlcjtcbiAgICAvLyBGdWxsLXBhZ2UgSFRNTCBkb2N1bWVudHMgYnVuZGxlZCB1bmRlciBwYWdlcy8gKG9wdC1pbiBwcmVmKS5cbiAgICBwYWdlc0h0bWw/OiBudW1iZXI7XG4gIH07XG4gIC8vIFJlc29sdXRpb24gcm9vdCBmb3IgZXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkwgc3RyZWFtLlxuICAvLyAgIOKAoiAnYXJjaGl2ZScgICDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBleHRyYWN0ZWQgYXJjaGl2ZSByb290XG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciB0YXIuenN0IGV4cG9ydHMpLlxuICAvLyAgIOKAoiAnd29ya3NwYWNlJyDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB3b3Jrc3BhY2UgZGlyIG9uIGRpc2ssXG4gIC8vICAgICAgICAgICAgICAgICAgIGkuZS4gYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2BcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHBsYWluIEpTT05MIGV4cG9ydHMpLlxuICAvLyBSZWNlaXZlcnMgcHJlcGVuZCB0aGUgYXBwcm9wcmlhdGUgcm9vdCB0byByZXNvbHZlIGFueSBwYXRoIGZpZWxkLlxuICBwYXRoUm9vdD86ICdhcmNoaXZlJyB8ICd3b3Jrc3BhY2UnO1xuICAvLyBJbmRpcmVjdGlvbiBwb2ludGVyIHRvIHRoZSBVSSBza2lsbCB0aGF0IGtub3dzIGhvdyB0byB0cmlhZ2UgdGhlc2VcbiAgLy8gY2FwdHVyZXMuIFdoZW4gYGlubGluZTogdHJ1ZWAsIHRoZSBza2lsbCBjb250ZW50IGxpdmVzIGF0XG4gIC8vIGBhcmNoaXZlUGF0aGAgaW5zaWRlIHRoZSB0YXIgKGRlZmF1bHQ6IGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgKS5cbiAgLy9cbiAgLy8gYGN1c3RvbWl6ZWRgIGFuZCBgdGVtcGxhdGVgIGFyZSBtdXR1YWxseS1leGNsdXNpdmUgY29uZmlkZW5jZSBmbGFnczpcbiAgLy8gICDigKIgY3VzdG9taXplZDogdHJ1ZSDihpIgdXNlciB1cGxvYWRlZCAvIHBhc3RlZCB0aGVpciBvd24gY29udGVudC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IHRoZSBmaWxlIGFzIGF1dGhvcml0YXRpdmUuXG4gIC8vICAg4oCiIHRlbXBsYXRlOiB0cnVlICAg4oaSIHVzZXIgaXMgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgZGVmYXVsdC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IGFzIGdlbmVyaWMgYm9pbGVycGxhdGU7IHZlcmlmeSBiZWZvcmVcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIGFwcGx5aW5nLlxuICAvLyAoVGhlIHByZXZpb3VzIGB0ZW1wbGF0ZWAgZmxhZyBhbG9uZSB3YXMgYW1iaWd1b3VzIGJlY2F1c2UgdGhlXG4gIC8vIGJ1bmRsZWQgbG9jYWwgdGVtcGxhdGUgc3RpbGwgbG9va3MgcHJvamVjdC1zcGVjaWZpYy4pXG4gIHNraWxsPzoge25hbWU6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFBvaW50ZXIgdG8gdGhlIHByb2plY3QncyBERVNJR04ubWQuIFNhbWUgcnVsZXM6IGBjdXN0b21pemVkOiB0cnVlYFxuICAvLyBtZWFucyB0aGUgdXNlciBzdXBwbGllZCB0aGlzIGNvbnRlbnQ7IGB0ZW1wbGF0ZTogdHJ1ZWAgbWVhbnMgaXQnc1xuICAvLyBQaW5jaEdyYWIncyBidW5kbGVkIGRlZmF1bHQuXG4gIGRlc2lnbj86IHtwYXRoPzogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFdoZXJlIHRoZSBhZ2VudCBkb2N0cmluZSBsaXZlcyBpbnNpZGUgdGhlIGFyY2hpdmUgKFNlbmQtdG8tQWdlbnRcbiAgLy8gcHJvdG9jb2wpLiBBYnNlbnQgb24gcGxhaW4gSlNPTkwgZXhwb3J0cy5cbiAgYWdlbnRQcm90b2NvbD86IHthcmNoaXZlUGF0aDogc3RyaW5nfTtcbiAgLy8gQnVuZGxlIHRva2VuIGJ1ZGdldDogYHNpZ25hbCpgIGlzIHRoZSB1cC1mcm9udCByZWFkIChBR0VOVC1QUk9UT0NPTCxcbiAgLy8gUkVBRE1FLCByZXBhaXItaW5kZXgsIHRoZSBKU09OTCwgREVTSUdOLCB0aGUgdHdvIFNLSUxMcywgc2tpbGxzLWluZGV4KTtcbiAgLy8gYHRvdGFsKmAgaXMgdGhlIHdob2xlIGFyY2hpdmUuIFRoZSBsYXp5IHJlbWFpbmRlciBpcyBlbnVtZXJhdGVkIGluIHRoZVxuICAvLyBidW5kbGUgZmlsZSBuYW1lZCBieSBgaWdub3JlYC4gRXN0aW1hdG9yIGhldXJpc3RpYzogYnl0ZXMgLyA0LlxuICB0b2tlbnM/OiB7c2lnbmFsQnl0ZXM6IG51bWJlcjsgdG90YWxCeXRlczogbnVtYmVyOyBzaWduYWxUb2tlbnM6IG51bWJlcjsgdG90YWxUb2tlbnM6IG51bWJlcjsgaWdub3JlOiBzdHJpbmd9O1xuICAvLyBWZW5kb3JlZCBza2lsbCBkb2N1bWVudHMgYnVuZGxlZCBpbnRvIHRoaXMgYXJjaGl2ZSAoc3Vic2V0IG9mIHRoZVxuICAvLyByaWNoZXIgc2tpbGxzLWluZGV4Lmpzb24gYXQgdGhlIGFyY2hpdmUgcm9vdCkuIGBpbnZvY2F0aW9uYCBjYXJyaWVzIGFcbiAgLy8gcGx1Z2luLWNvbW1hbmQgZm9ybSBmb3IgaGFybmVzc2VzIHRoYXQgc3VwcG9ydCBpdC5cbiAgYnVuZGxlZFNraWxscz86IEFycmF5PHtpZDogc3RyaW5nOyBraW5kOiAnc2tpbGwnIHwgJ3JlZmVyZW5jZSc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGludm9jYXRpb24/OiBzdHJpbmd9PjtcbiAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gIHBhZ2VzSHRtbD86IEFycmF5PHt1cmw6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn0+O1xuICAvLyBQSUkgcmVkYWN0aW9uIHJlY2VpcHQgKG9wdC1pbikuIGB2YWx1ZXNgIGNvdW50cyBjYXB0dXJlZCBzdHJpbmdzIHRoZVxuICAvLyB0ZXh0IGxheWVyIHNjcnViYmVkOyBgbGF5ZXJgIG5hbWVzIHdoaWNoIGxheWVyIHJhbi5cbiAgcmVkYWN0aW9uPzoge2xheWVyOiAndGV4dCc7IHZhbHVlczogbnVtYmVyfTtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gU3Vic2V0IG9mIGx1Y2lkZS5kZXYgaWNvbnMgaW5saW5lZCBhcyBTVkcgaW5uZXItbWFya3VwLlxuLy8gRWFjaCBlbnRyeSBpcyB0aGUgYm9keSBvZiA8c3ZnIC4uLiA+IC4uLiA8L3N2Zz47IHN2Z1N0cmluZygpIHdyYXBzIGl0LlxuLy8gU2l6ZXMgZGVmYXVsdCB0byAxNjsgb3ZlcnJpZGUgd2l0aCB0aGUgc2l6ZSBhcmd1bWVudC5cbi8vXG4vLyBNSVQg4oCUIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWNpZGUtaWNvbnMvbHVjaWRlXG5cbmNvbnN0IElDT05TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2hldnJvbi1yaWdodCc6ICc8cGF0aCBkPVwibTkgMTggNi02LTYtNlwiLz4nLFxuICAnY2hldnJvbi1kb3duJzogJzxwYXRoIGQ9XCJtNiA5IDYgNiA2LTZcIi8+JyxcbiAgY29weTogJzxyZWN0IHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjhcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk00IDE2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDJcIi8+JyxcbiAgcGVuY2lsOiAnPHBhdGggZD1cIk0yMS4xNzQgNi44MTJhMSAxIDAgMCAwLTMuOTg2LTMuOTg3TDMuODQyIDE2LjE3NGEyIDIgMCAwIDAtLjUuODNsLTEuMzIxIDQuMzUyYS41LjUgMCAwIDAgLjYyMy42MjJsNC4zNTMtMS4zMmEyIDIgMCAwIDAgLjgzLS40OTd6XCIvPjxwYXRoIGQ9XCJtMTUgNSA0IDRcIi8+JyxcbiAgJ3RyYXNoLTInOiAnPHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjZcIi8+PHBhdGggZD1cIk04IDZWNGMwLTEgMS0yIDItMmg0YzEgMCAyIDEgMiAydjJcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiMTBcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjE0XCIgeDI9XCIxNFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPicsXG4gIHBsdXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+PHBhdGggZD1cIk0xMiA1djE0XCIvPicsXG4gIHg6ICc8cGF0aCBkPVwiTTE4IDYgNiAxOFwiLz48cGF0aCBkPVwibTYgNiAxMiAxMlwiLz4nLFxuICBtaW51czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz4nLFxuICBzZWFyY2g6ICc8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjhcIi8+PHBhdGggZD1cIm0yMSAyMS00LjMtNC4zXCIvPicsXG4gIGRvd25sb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCI3IDEwIDEyIDE1IDE3IDEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIxNVwiIHkyPVwiM1wiLz4nLFxuICB1cGxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE3IDggMTIgMyA3IDhcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjNcIiB5Mj1cIjE1XCIvPicsXG4gIGdpdGh1YjogJzxwYXRoIGQ9XCJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNCA1LjQgMCAwIDAgNCA5YzAgMy41IDMgNS41IDYgNS41LS4zOS40OS0uNjggMS4wNS0uODUgMS42NS0uMTcuNi0uMjIgMS4yMy0uMTUgMS44NXY0XCIvPjxwYXRoIGQ9XCJNOSAxOGMtNC41MSAyLTUtMi03LTJcIi8+JyxcbiAgc3RhcjogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIi8+JyxcbiAgJ2NpcmNsZS1kb3QnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIGNyb3NzaGFpcjogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIyMlwiIHgyPVwiMThcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjZcIiB4Mj1cIjJcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiNlwiIHkyPVwiMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMjJcIiB5Mj1cIjE4XCIvPicsXG4gIHRhcmdldDogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI2XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMlwiLz4nLFxuICAncGFuZWwtbGVmdC1jbG9zZSc6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIvPjxwYXRoIGQ9XCJNOSAzdjE4XCIvPjxwYXRoIGQ9XCJtMTYgMTUtMy0zIDMtM1wiLz4nLFxuICAnZXh0ZXJuYWwtbGluayc6ICc8cGF0aCBkPVwiTTE1IDNoNnY2XCIvPjxwYXRoIGQ9XCJNMTAgMTQgMjEgM1wiLz48cGF0aCBkPVwiTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDZcIi8+JyxcbiAgJ21lc3NhZ2Utc3F1YXJlLXBsdXMnOiAnPHBhdGggZD1cIk0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnpcIi8+PGxpbmUgeDE9XCI5XCIgeDI9XCIxNVwiIHkxPVwiMTBcIiB5Mj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI3XCIgeTI9XCIxM1wiLz4nLFxuICAnYWxlcnQtY2lyY2xlJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjhcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyLjAxXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgJ3JlZnJlc2gtY3cnOiAnPHBhdGggZD1cIk0zIDEyYTkgOSAwIDAgMSAxNS02LjdMMjEgOFwiLz48cGF0aCBkPVwiTTIxIDN2NWgtNVwiLz48cGF0aCBkPVwiTTIxIDEyYTkgOSAwIDAgMS0xNSA2LjdMMyAxNlwiLz48cGF0aCBkPVwiTTMgMjF2LTVoNVwiLz4nLFxuICAnZmlsZS10ZXh0JzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTNcIiB5Mj1cIjEzXCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjE3XCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjEwXCIgeDI9XCI4XCIgeTE9XCI5XCIgeTI9XCI5XCIvPicsXG4gICdmaWxlLWNvZGUnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48cGF0aCBkPVwibTEwIDEzLTIgMiAyIDJcIi8+PHBhdGggZD1cIm0xNCAxNyAyLTItMi0yXCIvPicsXG4gIGltYWdlOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiOVwiIHI9XCIyXCIvPjxwYXRoIGQ9XCJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMVwiLz4nLFxuICAvLyBTdHlsaXNlZCBcInBpbmNoXCIg4oCUIHR3byBvcHBvc2luZyBjdXJ2ZXMgbWVldGluZyBhdCBhIGNlbnRlciBkb3QuXG4gIHBpbmNoOiAnPHBhdGggZD1cIk01IDVjMyAyIDUgNCA3IDctMiAzLTQgNS03IDdcIi8+PHBhdGggZD1cIk0xOSA1Yy0zIDItNSA0LTcgNyAyIDMgNCA1IDcgN1wiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEuNVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgJ3N0YXItZmlsbGVkJzogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIHBpbjogJzxwYXRoIGQ9XCJNMTIgMTd2NVwiLz48cGF0aCBkPVwiTTkgMTAuNzZhMiAyIDAgMCAxLTEuMTEgMS43OWwtMS43OC45QTIgMiAwIDAgMCA1IDE1LjI0VjE2YTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtLjc2YTIgMiAwIDAgMC0xLjExLTEuNzlsLTEuNzgtLjlBMiAyIDAgMCAxIDE1IDEwLjc2VjdhMSAxIDAgMCAxIDEtMSAyIDIgMCAwIDAgMC00SDhhMiAyIDAgMCAwIDAgNCAxIDEgMCAwIDEgMSAxelwiLz4nLFxuICB1bmRvOiAnPHBhdGggZD1cIk0zIDd2Nmg2XCIvPjxwYXRoIGQ9XCJNMjEgMTdhOSA5IDAgMCAwLTE1LTYuN0wzIDEzXCIvPicsXG4gIHJlZG86ICc8cGF0aCBkPVwiTTIxIDd2NmgtNlwiLz48cGF0aCBkPVwiTTMgMTdhOSA5IDAgMCAxIDE1LTYuN0wyMSAxM1wiLz4nLFxuICBmb2xkZXI6ICc8cGF0aCBkPVwiTTIwIDIwYTIgMiAwIDAgMCAyLTJWOGEyIDIgMCAwIDAtMi0yaC03LjkzYTIgMiAwIDAgMS0xLjY2LS45bC0uODItMS4yQTIgMiAwIDAgMCA3LjkzIDNINGEyIDIgMCAwIDAtMiAydjEzYTIgMiAwIDAgMCAyIDJaXCIvPicsXG4gIGNoZWNrOiAnPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIvPicsXG4gICdjaXJjbGUtY2hlY2snOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiLz4nLFxuICBncmlwOiAnPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjE5XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxOVwiIHI9XCIxXCIvPicsXG4gIC8vIEJyb2tlbi1jaGFpbiBpY29uIGZvciBcImRldGFjaCBjb21tZW50IGZyb20gaXRzIGNhcHR1cmVcIi4gTHVjaWRlJ3MgYHVubGlua2AuXG4gIHVubGluazogJzxwYXRoIGQ9XCJtMTguODQgMTIuMjUgMS43Mi0xLjcxaC0uMDJhNS4wMDQgNS4wMDQgMCAwIDAtLjEyLTcuMDcgNS4wMDYgNS4wMDYgMCAwIDAtNi45NSAwbC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIm01LjE3IDExLjc1LTEuNzEgMS43MWE1LjAwNCA1LjAwNCAwIDAgMCAuMTIgNy4wNyA1LjAwNiA1LjAwNiAwIDAgMCA2Ljk1IDBsMS43MS0xLjcxXCIvPjxsaW5lIHgxPVwiOFwiIHgyPVwiOFwiIHkxPVwiMlwiIHkyPVwiNVwiLz48bGluZSB4MT1cIjJcIiB4Mj1cIjVcIiB5MT1cIjhcIiB5Mj1cIjhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiMTZcIiB5MT1cIjE5XCIgeTI9XCIyMlwiLz48bGluZSB4MT1cIjE5XCIgeDI9XCIyMlwiIHkxPVwiMTZcIiB5Mj1cIjE2XCIvPicsXG4gIHNldHRpbmdzOiAnPHBhdGggZD1cIk0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIvPicsXG4gIGluZm86ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJNMTIgMTZ2LTRcIi8+PHBhdGggZD1cIk0xMiA4aC4wMVwiLz4nLFxuICAvLyBUcmVlLW9mLXJvd3Mg4oCUIHVzZWQgZm9yIFwiU3BsaXQgZ3JvdXBcIiBhY3Rpb24gKGRlbm90ZXMgb25lIG5vZGUgZmFubmluZ1xuICAvLyBvdXQgaW50byBzaWJsaW5ncykuIEx1Y2lkZSdzIGBsaXN0LXRyZWVgLlxuICAnbGlzdC10cmVlJzogJzxwYXRoIGQ9XCJNMjEgMTJoLThcIi8+PHBhdGggZD1cIk0yMSA2SDhcIi8+PHBhdGggZD1cIk0yMSAxOGgtOFwiLz48cGF0aCBkPVwiTTMgNnY0YzAgMS4xLjkgMiAyIDJoM1wiLz48cGF0aCBkPVwiTTMgMTB2NmMwIDEuMS45IDIgMiAyaDNcIi8+JyxcbiAgLy8gR2VuZXJpYyBzcGxpdCBpY29uIGFzIGEgZmFsbGJhY2sgb3B0aW9uLlxuICBzcGxpdDogJzxwYXRoIGQ9XCJNMTYgM2g1djVcIi8+PHBhdGggZD1cIk04IDNIM3Y1XCIvPjxwYXRoIGQ9XCJtMjEgMy03LjQ2IDcuNDZhMiAyIDAgMCAwIDAgMi44M0wyMSAyMVwiLz48cGF0aCBkPVwiTTMgM2w3LjQ2IDcuNDZhMiAyIDAgMCAxIDAgMi44M0wzIDIxXCIvPicsXG4gIC8vIENhcmRib2FyZC1zdHlsZSBib3ggdXNlZCBmb3IgXCJFeHBvcnQgd29ya3NwYWNlIGFzIFpJUFwiLlxuICBwYWNrYWdlOiAnPHBhdGggZD1cIm03LjUgNC4yNyA5IDUuMTVcIi8+PHBhdGggZD1cIk0yMSA4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNlpcIi8+PHBhdGggZD1cIk0zLjMgNyAxMiAxMmw4LjctNVwiLz48cGF0aCBkPVwiTTEyIDIyVjEyXCIvPicsXG4gIC8vIFR3byBpbnRlcmxvY2tpbmcgbGlua3Mg4oCUIHVzZWQgZm9yIFwiQ29weSBhcyBwYXRoXCIuXG4gIGxpbms6ICc8cGF0aCBkPVwiTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIk0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MVwiLz4nLFxuICAvLyBEYXRhYmFzZS9kdWNrIGljb24gZm9yIHRoZSBEdWNrREIgcGFsZXR0ZSBjb21tYW5kLlxuICBkYXRhYmFzZTogJzxlbGxpcHNlIGN4PVwiMTJcIiBjeT1cIjVcIiByeD1cIjlcIiByeT1cIjNcIi8+PHBhdGggZD1cIk0zIDVWMTlBOSAzIDAgMCAwIDIxIDE5VjVcIi8+PHBhdGggZD1cIk0zIDEyQTkgMyAwIDAgMCAyMSAxMlwiLz4nLFxufTtcblxuY29uc3Qgd3JhcCA9IChib2R5OiBzdHJpbmcsIHNpemU6IG51bWJlcik6IHN0cmluZyA9PlxuICBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj4ke2JvZHl9PC9zdmc+YDtcblxuZXhwb3J0IGNvbnN0IFBHX0lDT05TID0ge1xuICBoYXM6IChuYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IG5hbWUgaW4gSUNPTlMsXG4gIHN2Z1N0cmluZzogKG5hbWU6IHN0cmluZywgc2l6ZSA9IDE2KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBib2R5ID0gSUNPTlNbbmFtZV07XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tsdWNpZGVdIG1pc3NpbmcgaWNvbicsIG5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChib2R5LCBzaXplKTtcbiAgfSxcbiAgbW91bnQ6IChlbDogRWxlbWVudCB8IG51bGwsIG5hbWU6IHN0cmluZywgc2l6ZT86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChlbCkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICB9LFxufTtcblxuLy8gU2lkZS1lZmZlY3QgZm9yIGxlZ2FjeSBzY3JpcHQtdGFnIGluY2x1c2lvbiAoc2lkZXBhbmVsLmh0bWwgc3RpbGwgPHNjcmlwdFxuLy8gc3JjPVwibHVjaWRlLmpzXCI+IOKAlCBwcmUtYnVuZGxlKS4gUmUtZXhwb3NlcyB0aGUgcmVnaXN0cnkgb24gZ2xvYmFsVGhpcy5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5QR19JQ09OUyA9IFBHX0lDT05TO1xufVxuIiwKICAgICIvLyBQaW5jaEdyYWIgY29udGVudCBzY3JpcHQg4oCUIEFsdCtDbGljayBjYXB0dXJlLCBBbHQrZHJhZyBydWJiZXItYmFuZCxcbi8vIGdvbGQtc3RhZ2luZyBtdWx0aS1zZWxlY3QsIG9uLXBhZ2UgY29tbWVudCBvdmVybGF5LiBMb2FkZWQgb24gZXZlcnkgcGFnZTtcbi8vIGNvbW11bmljYXRlcyB3aXRoIHRoZSBzaWRlIHBhbmVsIHZpYSBjaHJvbWUucnVudGltZSBtZXNzYWdlcyAoYW5kIGFcbi8vIEN1c3RvbUV2ZW50IGZhbGxiYWNrIGluIHN0YW5kYWxvbmUgdGVzdC9QbGF5d3JpZ2h0IG1vZGUpLlxuLy9cbi8vIERlY29tcG9zZWQgaW50bzpcbi8vICAg4oCiIGRvbS50cyAgICAg4oCUIHB1cmUgaGVscGVycyAoY3NzUGF0aCwgY2FwdHVyZUVudHJ5LCBlbGVtZW50c0luUmVjdClcbi8vICAg4oCiIHR5cGVzLnRzICAg4oCUIHNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2xcbi8vICAg4oCiIHRoaXMgZmlsZSAg4oCUIG92ZXJsYXksIGhvdmVyIHN0YXRlIG1hY2hpbmUsIGRyYWcsIElQQyBwbHVtYmluZ1xuLy9cbi8vIFJlLWVudHJ5IGd1YXJkOiBpZiBhIHByZXZpb3VzIGluc3RhbmNlIGFscmVhZHkgcmFuIGluIHRoaXMgcGFnZSAoZS5nLlxuLy8gc2VydmljZS13b3JrZXIgcmUtaW5qZWN0aW9uIG9uIHRhYiBhY3RpdmF0aW9uKSwgcmV1c2UgaXQuXG5cbmltcG9ydCB7XG4gIGNhcHR1cmVFbnRyeSxcbiAgYnVpbGRQYWdlQ29udGV4dCxcbiAgY3NzUGF0aCxcbiAgY29tcGFjdFRhcmdldCxcbiAgZWxlbWVudHNJblJlY3QsXG4gIHBpY2tEcmFnQ2FuZGlkYXRlcyxcbiAgc25hcFRvQ29tcG9uZW50LFxuICBub3RlVGFiUHJlc3NlZCxcbiAgc2V0TXV0YXRpb25CdWZmZXJHZXR0ZXIsXG59IGZyb20gJy4vZG9tLnRzJztcbmltcG9ydCB0eXBlIHtcbiAgQW5ub3RhdGlvblBheWxvYWQsXG4gIENzVG9QYW5lbCxcbiAgRG9tTXV0YXRpb24sXG4gIEVudHJ5LFxuICBQYWdlU25hcHNob3QsXG4gIFBhZ2VTbmFwc2hvdFJlcGx5LFxuICBQYW5lbFRvQ3MsXG4gIFBnRW52ZWxvcGUsXG59IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge1BHX0lDT05TfSBmcm9tICcuL2x1Y2lkZS50cyc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgX19waW5jaGdyYWJDb250ZW50PzogUGluY2hncmFiQXBpO1xuICAgIF9fcGluY2hncmFiPzogUGluY2hncmFiQXBpO1xuICB9XG59XG5cbnR5cGUgUGluY2hncmFiQXBpID0ge1xuICBjYXB0dXJlRW50cnk6IHR5cGVvZiBjYXB0dXJlRW50cnk7XG4gIGJ1aWxkUGFnZUNvbnRleHQ6IHR5cGVvZiBidWlsZFBhZ2VDb250ZXh0O1xuICBjYXB0dXJlczogQXJyYXk8e2VudHJ5OiBFbnRyeTsgcGFnZTogUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRQYWdlQ29udGV4dD47IGdyb3VwZWQ/OiBib29sZWFufT4gfCBudWxsO1xuICBmbGFzaEVsZW1lbnQ6IChzZWw6IHN0cmluZykgPT4gdm9pZDtcbiAgc2V0QWx0OiAob246IGJvb2xlYW4pID0+IHZvaWQ7XG4gIG5leHRTZXE6ICgpID0+IG51bWJlcjtcbiAgaGFuZGxlQ29tbWFuZDogKG1zZzogUGdFbnZlbG9wZTxQYW5lbFRvQ3M+LCByZXNwb25kOiAocjogYW55KSA9PiB2b2lkKSA9PiBib29sZWFuO1xuICBkZXN0cm95OiAoKSA9PiB2b2lkO1xufTtcblxuY29uc3QgTE9HID0gJ1tQaW5jaEdyYWIvY3NdJztcbmNvbnN0IEtFWSA9ICdfX3BpbmNoZ3JhYkNvbnRlbnQnO1xuXG5pZiAod2luZG93W0tFWV0pIHtcbiAgY29uc29sZS5sb2coTE9HLCAnYWxyZWFkeSBpbml0aWFsaXplZDsgcmV1c2luZy4nKTtcbn0gZWxzZSB7XG4gIGluaXQoKTtcbn1cblxuZnVuY3Rpb24gaW5pdCgpOiB2b2lkIHtcbiAgLy8gQ3Jvc3Mtd29ybGQgdGFrZW92ZXI6IGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcHJldmlvdXMgY29udGVudFxuICAvLyBzY3JpcHQgaW4gYSAqZGlmZmVyZW50IGlzb2xhdGVkIHdvcmxkKiwgd2hlcmUgb3VyIHdpbmRvd1tLRVldIGd1YXJkXG4gIC8vIGNhbid0IHNlZSBpdCDigJQgYnV0IGl0cyBET00gb3ZlcmxheSBhbmQgY2FwdHVyZSBsaXN0ZW5lcnMgcGVyc2lzdCB3aXRoIGFcbiAgLy8gZGVhZCBjaHJvbWUucnVudGltZSAoXCJBbHQgc3RvcHMgd29ya2luZ1wiKS4gUGxhaW4gRE9NIGV2ZW50cyBETyBjcm9zc1xuICAvLyBpc29sYXRlZCB3b3JsZHM6IGZpcmUgdGhlIHRha2VvdmVyIHNpZ25hbCBzbyBhbnkgcHJlZGVjZXNzb3IgdGVhcnNcbiAgLy8gaXRzZWxmIGRvd24sIHN3ZWVwIGl0cyBzdGFsZSBvdmVybGF5LCBhbmQgcmVnaXN0ZXIgdGhlIHNhbWUgbGlzdGVuZXJcbiAgLy8gZm9yIG91ciBvd24gc3VjY2Vzc29yLlxuICB0cnkgeyBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnX19waW5jaGdyYWItdGFrZW92ZXInKSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnX19waW5jaGdyYWJfb3ZlcmxheScpPy5yZW1vdmUoKTtcblxuICBjb25zdCBpbkV4dGVuc2lvbiA9IHR5cGVvZiBjaHJvbWUgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4oY2hyb21lLnJ1bnRpbWU/LmlkKTtcbiAgY29uc3QgdGVzdENhcHR1cmVzID0gaW5FeHRlbnNpb24gPyBudWxsIDogKFtdIGFzIEFycmF5PHtlbnRyeTogRW50cnk7IHBhZ2U6IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkUGFnZUNvbnRleHQ+OyBncm91cGVkPzogYm9vbGVhbn0+KTtcblxuICAvLyBPcnBoYW4gc2VsZi1kZXRlY3Rpb246IGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQsIGNocm9tZS5ydW50aW1lLmlkIGluXG4gIC8vIHRoZSBvbGQgd29ybGQgZ29lcyB1bmRlZmluZWQgKG9yIHRocm93cykuIEhvdCBoYW5kbGVycyBzaG9ydC1jaXJjdWl0XG4gIC8vIHRocm91Z2ggdGhpcyBndWFyZCBhbmQgdGVhciB0aGUgb3JwaGFuIGRvd24gaW5zdGVhZCBvZiBzaWxlbnRseSBlYXRpbmdcbiAgLy8gQWx0IGdlc3R1cmVzIGZvcmV2ZXIuXG4gIGxldCBkZXN0cm95ZWQgPSBmYWxzZTtcbiAgY29uc3QgY29udGV4dEFsaXZlID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHJldHVybiB0cnVlO1xuICAgIHRyeSB7IHJldHVybiBCb29sZWFuKGNocm9tZS5ydW50aW1lPy5pZCk7IH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfTtcbiAgY29uc3Qgb3JwaGFuR3VhcmQgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKGRlc3Ryb3llZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChjb250ZXh0QWxpdmUoKSkgcmV0dXJuIHRydWU7XG4gICAgY29uc29sZS53YXJuKExPRywgJ2V4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkIOKAlCB0ZWFyaW5nIGRvd24gb3JwaGFuZWQgY29udGVudCBzY3JpcHQnKTtcbiAgICB0cnkgeyB3aW5kb3dbS0VZXT8uZGVzdHJveSgpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE92ZXJsYXkgc2hhZG93IGhvc3QgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFN0cmljdC1DU1AgcGFnZXMgKEdpdEh1YiwgYmFua3MpIHJlamVjdCBpbmxpbmUgPHN0eWxlPiB0YWdzIEFORFxuICAvLyBhZG9wdGVkU3R5bGVTaGVldHMg4oCUIGJvdGggYXJlIGdhdGVkIGJ5IHRoZSBwYWdlJ3MgYHN0eWxlLXNyY2AuIEJyb3dzZXJzXG4gIC8vIGRvIGFsbG93IGlubGluZS1zdHlsZSBtdXRhdGlvbnMgdGhyb3VnaCB0aGUgSlMgYEhUTUxFbGVtZW50LnN0eWxlYCBBUEksXG4gIC8vIHNvIHdlIGFwcGx5IGV2ZXJ5IG92ZXJsYXkgc3R5bGUgdGhhdCB3YXkgKHNlZSBhcHBseVN0eWxlcyBiZWxvdykuXG4gIGNvbnN0IG92ZXJsYXlIb3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIG92ZXJsYXlIb3N0LmlkID0gJ19fcGluY2hncmFiX292ZXJsYXknO1xuICBPYmplY3QuYXNzaWduKG92ZXJsYXlIb3N0LnN0eWxlLCB7XG4gICAgYWxsOiAnaW5pdGlhbCcsIHBvc2l0aW9uOiAnZml4ZWQnLCB0b3A6ICcwJywgbGVmdDogJzAnLCByaWdodDogJzAnLCBib3R0b206ICcwJyxcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsIHpJbmRleDogJzIxNDc0ODM2NDYnLFxuICB9KTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKG92ZXJsYXlIb3N0KTtcbiAgY29uc3Qgc2hhZG93ID0gb3ZlcmxheUhvc3QuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcblxuICAvLyDilIDilIDilIAgVG9wLWxheWVyIHByb21vdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQSBtYXggei1pbmRleCBob3N0IHN0aWxsIGxvc2VzIHRvIHRoZSBicm93c2VyIHRvcCBsYXllclxuICAvLyAoPGRpYWxvZz4uc2hvd01vZGFsKCksIHBhZ2UgcG9wb3ZlcnMpIGFuZCBjYW4gYmUgdHJhcHBlZCBieSBzdGFja2luZ1xuICAvLyBjb250ZXh0cy4gVGhlIFBvcG92ZXIgQVBJIHB1dHMgdGhlIGhvc3QgaW4gdGhlIHRvcCBsYXllciBpdHNlbGY7XG4gIC8vIHBvcG92ZXI9XCJtYW51YWxcIiBvcHRzIG91dCBvZiBFU0MvbGlnaHQtZGlzbWlzcy4gVUEgW3BvcG92ZXJdIHN0eWxlc1xuICAvLyAoYXV0byBtYXJnaW5zLCBib3JkZXIsIGZpdC1jb250ZW50IHNpemluZywgZGlzcGxheTpub25lLXdoZW4tY2xvc2VkKVxuICAvLyBhcmUgbmV1dHJhbGl6ZWQgaW5saW5lIGJlY2F1c2UgcGFnZSBDU1AgY2FuIGJsb2NrIHN0eWxlc2hlZXRzLiBPbiBhbnlcbiAgLy8gZmFpbHVyZSB0aGUgcG9wb3ZlciBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBzbyB0aGUgcGxhaW4gbWF4LXogZmFsbGJhY2tcbiAgLy8ga2VlcHMgcGFpbnRpbmcuXG4gIGNvbnN0IHByb21vdGVUb1RvcExheWVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghKCdzaG93UG9wb3ZlcicgaW4gb3ZlcmxheUhvc3QpKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIG92ZXJsYXlIb3N0LnNldEF0dHJpYnV0ZSgncG9wb3ZlcicsICdtYW51YWwnKTtcbiAgICAgIE9iamVjdC5hc3NpZ24ob3ZlcmxheUhvc3Quc3R5bGUsIHtcbiAgICAgICAgbWFyZ2luOiAnMCcsIGJvcmRlcjogJzAnLCBwYWRkaW5nOiAnMCcsXG4gICAgICAgIHdpZHRoOiAnYXV0bycsIGhlaWdodDogJ2F1dG8nLFxuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLCBvdmVyZmxvdzogJ3Zpc2libGUnLCBjb2xvcjogJ2luaGVyaXQnLFxuICAgICAgfSk7XG4gICAgICBpZiAoIW92ZXJsYXlIb3N0Lm1hdGNoZXMoJzpwb3BvdmVyLW9wZW4nKSkgb3ZlcmxheUhvc3Quc2hvd1BvcG92ZXIoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAndG9wLWxheWVyIHByb21vdGlvbiBmYWlsZWQg4oCUIG1heCB6LWluZGV4IGZhbGxiYWNrJywgZSk7XG4gICAgICB0cnkgeyBvdmVybGF5SG9zdC5yZW1vdmVBdHRyaWJ1dGUoJ3BvcG92ZXInKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9O1xuICAvLyBUb3AtbGF5ZXIgc3RhY2tpbmcgaXMgaW5zZXJ0aW9uLW9yZGVyZWQ6IGEgaGlkZStzaG93IGN5Y2xlIHJlLXN0YWNrcyB0aGVcbiAgLy8gb3ZlcmxheSBhYm92ZSBhbnkgZGlhbG9nL3BvcG92ZXIgdGhlIHBhZ2Ugb3BlbmVkIGFmdGVyIHVzLiBDYWxsZWQgd2hlbiBhXG4gIC8vIG5ldyByaW5nIG9yIHRoZSBjb21tZW50IGJveCBhcHBlYXJzIOKAlCBub3QgcGVyIGZyYW1lLlxuICBjb25zdCBicmluZ1RvRnJvbnQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCEoJ3Nob3dQb3BvdmVyJyBpbiBvdmVybGF5SG9zdCkpIHJldHVybjtcbiAgICBpZiAob3ZlcmxheUhvc3Quc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSByZXR1cm47IC8vIG1pZC1jYXB0dXJlOyBzdGF5IGhpZGRlblxuICAgIHRyeSB7XG4gICAgICBpZiAob3ZlcmxheUhvc3QubWF0Y2hlcygnOnBvcG92ZXItb3BlbicpKSBvdmVybGF5SG9zdC5oaWRlUG9wb3ZlcigpO1xuICAgICAgb3ZlcmxheUhvc3Quc2hvd1BvcG92ZXIoKTtcbiAgICB9IGNhdGNoIHsgcHJvbW90ZVRvVG9wTGF5ZXIoKTsgfVxuICB9O1xuICBwcm9tb3RlVG9Ub3BMYXllcigpO1xuXG4gIC8vIOKUgOKUgOKUgCBOb29kbGUgU1ZHOiBjb25uZWN0b3JzIGZyb20gdGhlIHNpZGUtcGFuZWwgZWRnZSBvZiB0aGUgdmlld3BvcnQgdG9cbiAgLy8gZWFjaCByaW5nZWQgZWxlbWVudC4gVGhlIHBhZ2UgY2FuJ3Qgc2VlIHRoZSBzaWRlLXBhbmVsIGl0c2VsZiAoc2VwYXJhdGVcbiAgLy8gZnJhbWUpLCBidXQgQ2hyb21lIHB1dHMgdGhlIHNpZGUtcGFuZWwgYWRqYWNlbnQgdG8gdGhlIHBhZ2UncyByaWdodFxuICAvLyBlZGdlLCBzbyBhIGN1cnZlIGZyb20gKGlubmVyV2lkdGgsIG1pZFkpIGlzIHRoZSB2aXN1YWwgc3RhbmQtaW4gZm9yXG4gIC8vIFwiZnJvbSB0aGUgc2lkZS1wYW5lbFwiLiBPbmUgY29udGFpbmVyLCBvbmUgcGF0aCBwZXIgcmluZyBzbG90LlxuICBjb25zdCBub29kbGVTdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICBPYmplY3QuYXNzaWduKG5vb2RsZVN2Zy5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCB0b3A6ICcwJywgbGVmdDogJzAnLFxuICAgIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICB6SW5kZXg6ICcyJyxcbiAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICB9KTtcblxuICAvLyDilIDilIDilIAgUmluZyBwb29sOiB0cmFja3MgZWxlbWVudHMgd2l0aCByQUYtcG9zaXRpb25lZCBvdXRsaW5lIHJpbmdzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIFNsb3QgPSB7ZWw6IEhUTUxEaXZFbGVtZW50OyBsYWJlbDogSFRNTERpdkVsZW1lbnQ7IHBhdGg6IFNWR1BhdGhFbGVtZW50OyByYWY6IG51bWJlcjsgdGFyZ2V0OiBFbGVtZW50IHwgbnVsbH07XG4gIGNvbnN0IHJpbmdzID0gbmV3IE1hcDxzdHJpbmcsIFNsb3Q+KCk7XG4gIGNvbnN0IFJJTkdfQkFTRTogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiA9IHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJywgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIGJvcmRlcjogJzJweCBzb2xpZCAjZmY1ZjAwJyxcbiAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgIGJveFNoYWRvdzogJzAgMCAwIDNweCByZ2JhKDI1NSw5NSwwLC4xOCksIDAgMCAxNnB4IHJnYmEoMjU1LDk1LDAsLjQpJyxcbiAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAuMDhzIGxpbmVhcicsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgekluZGV4OiAnMScsXG4gIH07XG4gIGNvbnN0IFJJTkdfR09MRDogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiA9IHtcbiAgICBib3JkZXJDb2xvcjogJyNmZmQxNjYnLFxuICAgIGJveFNoYWRvdzogJzAgMCAwIDNweCByZ2JhKDI1NSwyMDksMTAyLC4yMiksIDAgMCAxOHB4IHJnYmEoMjU1LDIwOSwxMDIsLjQ1KScsXG4gIH07XG4gIC8vIExpdmUgZHJhZyBwcmV2aWV3OiBicmlnaHQgbGltZSwgdGhpY2tlciBib3JkZXIsIG1vcmUgdmlzaWJsZSBoYWxvIHNvXG4gIC8vIHRoZSB1c2VyIGNhbiBjbGVhcmx5IHNlZSB3aGF0IHRoZSBydWJiZXIgYmFuZCB3aWxsIGNvbW1pdCBvbiByZWxlYXNlLlxuICBjb25zdCBSSU5HX1BSRVZJRVc6IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj4gPSB7XG4gICAgYm9yZGVyQ29sb3I6ICcjN2JkOTdhJyxcbiAgICBib3JkZXJXaWR0aDogJzNweCcsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgM3B4IHJnYmEoMTIzLDIxNywxMjIsLjMyKSwgMCAwIDIycHggcmdiYSgxMjMsMjE3LDEyMiwuNTUpJyxcbiAgfTtcbiAgY29uc3QgTEFCRUxfQkFTRTogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiA9IHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJywgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIGJhY2tncm91bmQ6ICdyZ2JhKDI1NSw5NSwwLC42NSknLCBjb2xvcjogJyNmZmYnLFxuICAgIGZvbnQ6IFwiNjAwIDExcHgvMS4yIHVpLW1vbm9zcGFjZSwnSmV0QnJhaW5zIE1vbm8nLE1lbmxvLG1vbm9zcGFjZVwiLFxuICAgIHBhZGRpbmc6ICczcHggNnB4JywgYm9yZGVyUmFkaXVzOiAnM3B4JyxcbiAgICB3aWR0aDogJzIyMHB4JywgaGVpZ2h0OiAnMTZweCcsXG4gICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxuICAgIHRleHRTaGFkb3c6ICcwIDFweCAycHggcmdiYSgwLDAsMCwuNDUpJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBkaXNwbGF5OiAnbm9uZScsXG4gIH07XG4gIGNvbnN0IGVuc3VyZVJpbmcgPSAoa2V5OiBzdHJpbmcpOiBTbG90ID0+IHtcbiAgICBsZXQgc2xvdCA9IHJpbmdzLmdldChrZXkpO1xuICAgIGlmIChzbG90KSByZXR1cm4gc2xvdDtcbiAgICAvLyBDbGFzc2VzIGFyZSBrZXB0IHB1cmVseSBhcyBpZGVudGlmaWVycyAocXVlcnlTZWxlY3RvciB0ZXN0IGhvb2tzKTtcbiAgICAvLyB2aXN1YWwgc3R5bGluZyBpcyBpbmxpbmUgYmVjYXVzZSBwYWdlIENTUCBjYW4gYmxvY2sgc3R5bGVzaGVldHMuXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5jbGFzc05hbWUgPSAncmluZyc7XG4gICAgT2JqZWN0LmFzc2lnbihlbC5zdHlsZSwgUklOR19CQVNFKTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxhYmVsLmNsYXNzTmFtZSA9ICdsYWJlbCc7XG4gICAgT2JqZWN0LmFzc2lnbihsYWJlbC5zdHlsZSwgTEFCRUxfQkFTRSk7XG4gICAgLy8gTm9vZGxlIHBhdGggY29ubmVjdGluZyAoaW5uZXJXaWR0aCwgbWlkWSkg4oaSIGVsZW1lbnQgY2VudGVyLlxuICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZmlsbCcsICdub25lJyk7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsICcyLjUnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVjYXAnLCAncm91bmQnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsICcwLjUnKTtcbiAgICBpZiAoIW5vb2RsZVN2Zy5pc0Nvbm5lY3RlZCkgc2hhZG93LmFwcGVuZChub29kbGVTdmcpO1xuICAgIG5vb2RsZVN2Zy5hcHBlbmQocGF0aCk7XG4gICAgc2hhZG93LmFwcGVuZChlbCwgbGFiZWwpO1xuICAgIHNsb3QgPSB7ZWwsIGxhYmVsLCBwYXRoLCByYWY6IDAsIHRhcmdldDogbnVsbH07XG4gICAgcmluZ3Muc2V0KGtleSwgc2xvdCk7XG4gICAgcmV0dXJuIHNsb3Q7XG4gIH07XG4gIGNvbnN0IHJlbW92ZVJpbmcgPSAoa2V5OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzbG90ID0gcmluZ3MuZ2V0KGtleSk7XG4gICAgaWYgKCFzbG90KSByZXR1cm47XG4gICAgaWYgKHNsb3QucmFmKSBjYW5jZWxBbmltYXRpb25GcmFtZShzbG90LnJhZik7XG4gICAgc2xvdC5lbC5yZW1vdmUoKTtcbiAgICBzbG90LmxhYmVsLnJlbW92ZSgpO1xuICAgIHNsb3QucGF0aC5yZW1vdmUoKTtcbiAgICByaW5ncy5kZWxldGUoa2V5KTtcbiAgICByaW5nVHJhY2tPcHRzLmRlbGV0ZShrZXkpO1xuICB9O1xuICBjb25zdCBjbGVhclJpbmdzID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgayBvZiBbLi4ucmluZ3Mua2V5cygpXSkgcmVtb3ZlUmluZyhrKTtcbiAgICBub29kbGVTdmcucmVtb3ZlKCk7XG4gIH07XG4gIHR5cGUgUmluZ09wdHMgPSB7Z29sZD86IGJvb2xlYW47IGRhc2hlZD86IGJvb2xlYW47IHByZXZpZXc/OiBib29sZWFuOyBsYWJlbD86IHN0cmluZ307XG4gIGNvbnN0IHBvc2l0aW9uUmluZyA9IChzbG90OiBTbG90LCB0YXJnZXQ6IEVsZW1lbnQsIG9wdHM6IFJpbmdPcHRzKTogdm9pZCA9PiB7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCByaW5nU3R5bGUgPSBzbG90LmVsLnN0eWxlO1xuICAgIHJpbmdTdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoMCwgci5sZWZ0IC0gMyl9cHhgO1xuICAgIHJpbmdTdHlsZS50b3AgPSBgJHtNYXRoLm1heCgwLCByLnRvcCAtIDMpfXB4YDtcbiAgICByaW5nU3R5bGUud2lkdGggPSBgJHtNYXRoLm1heCgwLCByLndpZHRoICsgNil9cHhgO1xuICAgIHJpbmdTdHlsZS5oZWlnaHQgPSBgJHtNYXRoLm1heCgwLCByLmhlaWdodCArIDYpfXB4YDtcbiAgICByaW5nU3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgaWYgKG9wdHMucHJldmlldykge1xuICAgICAgT2JqZWN0LmFzc2lnbihyaW5nU3R5bGUsIFJJTkdfUFJFVklFVyk7XG4gICAgfSBlbHNlIGlmIChvcHRzLmdvbGQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmluZ1N0eWxlLCBSSU5HX0dPTEQpO1xuICAgICAgcmluZ1N0eWxlLmJvcmRlcldpZHRoID0gJzJweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpbmdTdHlsZS5ib3JkZXJDb2xvciA9ICcjZmY1ZjAwJztcbiAgICAgIHJpbmdTdHlsZS5ib3hTaGFkb3cgPSBSSU5HX0JBU0UuYm94U2hhZG93ITtcbiAgICAgIHJpbmdTdHlsZS5ib3JkZXJXaWR0aCA9ICcycHgnO1xuICAgIH1cbiAgICByaW5nU3R5bGUuYm9yZGVyU3R5bGUgPSBvcHRzLmRhc2hlZCA/ICdkYXNoZWQnIDogJ3NvbGlkJztcbiAgICAvLyBObyBmbG9hdGluZyBsYWJlbCBhYm92ZSB0aGUgaGlnaGxpZ2h0ZWQgZWxlbWVudCDigJQgdGhlIG9uLXBhZ2UgY29tbWVudFxuICAgIC8vIGJveCAoYW5ub3RhdGlvbiBvdmVybGF5KSBhbHJlYWR5IHNob3dzIGV2ZXJ5dGhpbmcgdGhlIHVzZXIgbmVlZHMgYW5kXG4gICAgLy8gdGhlIGZsb2F0aW5nIGxhYmVsIHdhcyBqdXN0IHZpc3VhbCBub2lzZSBhYm92ZSB0aGUgcmluZyBib3JkZXIuXG4gICAgc2xvdC5sYWJlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgLy8gUGFnZS1zaWRlIG5vb2RsZTogYSBzaW5nbGUgY3VydmUgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgcGFnZVxuICAgIC8vICh3aGVyZSB0aGUgc2lkZSBwYW5lbCBzaXRzKSB0byB0aGUgQ0xPU0VTVCBQT0lOVCBvbiB0aGUgcmluZyByZWN0LlxuICAgIC8vIFdlIGRvbid0IHRyeSB0byBhbGlnbiB3aXRoIGEgcGFuZWwtc2lkZSBjb21wYW5pb24gY3VydmUgYW55bW9yZSDigJRcbiAgICAvLyB0aGF0IG5lZWRlZCBpbm5lckhlaWdodCBwYXJpdHkgd2hpY2ggYnJva2UgdW5kZXIgRGV2VG9vbHMgZG9jayAvXG4gICAgLy8gYnJvd3NlciB6b29tLiBUaGlzIGhhbGYgc3RhbmRzIGFsb25lOiB0aGUgdmlzdWFsIGlzIFwiYW4gYXJyb3cgZnJvbVxuICAgIC8vIHRoZSBwYW5lbCBzaWRlLCBwb2ludGluZyBhdCB0aGUgY2FwdHVyZWQgZWxlbWVudFwiIGFuZCB3b3JrcyBhdFxuICAgIC8vIGFueSB2aWV3cG9ydC5cbiAgICBjb25zdCByaW5nUGFkID0gMztcbiAgICBjb25zdCByaW5nTCA9IHIubGVmdCAtIHJpbmdQYWQ7XG4gICAgY29uc3QgcmluZ1IgPSByLnJpZ2h0ICsgcmluZ1BhZDtcbiAgICBjb25zdCByaW5nVCA9IHIudG9wIC0gcmluZ1BhZDtcbiAgICBjb25zdCByaW5nQiA9IHIuYm90dG9tICsgcmluZ1BhZDtcbiAgICBjb25zdCBveCA9IHdpbmRvdy5pbm5lcldpZHRoOyAgICAgICAgICAvLyBvcmlnaW4geCAocGFnZSByaWdodCBlZGdlKVxuICAgIGNvbnN0IG95ID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjsgICAgIC8vIG9yaWdpbiB5IChwYWdlIG1pZFkpXG4gICAgLy8gQ2xvc2VzdC1wb2ludCBwcm9qZWN0aW9uOiBjbGFtcCBvcmlnaW4gb250byB0aGUgcmluZyByZWN0LlxuICAgIGNvbnN0IGV4ID0gTWF0aC5tYXgocmluZ0wsIE1hdGgubWluKG94LCByaW5nUikpO1xuICAgIGNvbnN0IGV5ID0gTWF0aC5tYXgocmluZ1QsIE1hdGgubWluKG95LCByaW5nQikpO1xuICAgIGlmIChNYXRoLmh5cG90KGV4IC0gb3gsIGV5IC0gb3kpIDwgMjQpIHtcbiAgICAgIC8vIEVsZW1lbnQgaXMgZXNzZW50aWFsbHkgYXQgdGhlIHBhbmVsLXNpZGUgZWRnZSDigJQgZHJhd2luZyBhIDI0cHhcbiAgICAgIC8vIGN1cnZlIHRoZXJlIGxvb2tzIGxpa2UgYSBzbXVkZ2UuIFNraXAuXG4gICAgICBzbG90LnBhdGguc2V0QXR0cmlidXRlKCdkJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCZXppZXI6IGZpcnN0IGxvYmUgcHVsbGVkIGxlZnQgZnJvbSB0aGUgb3JpZ2luLCBzZWNvbmQgbG9iZVxuICAgICAgLy8gcHVsbGVkIG91dHdhcmQgZnJvbSB0aGUgcmluZyBvbiB0aGUgc2lkZSBmYWNpbmcgdGhlIG9yaWdpbiBzb1xuICAgICAgLy8gdGhlIGN1cnZlIGFwcHJvYWNoZXMgdGhlIGJvdW5kYXJ5IHBlcnBlbmRpY3VsYXItaXNoLlxuICAgICAgY29uc3QgYzF4ID0gb3ggLSA4MCwgYzF5ID0gb3k7XG4gICAgICBjb25zdCBhcHByb2FjaER4ID0gb3ggPiByaW5nUiA/IDYwIDogb3ggPCByaW5nTCA/IC02MCA6IDA7XG4gICAgICBjb25zdCBjMnggPSBleCArIGFwcHJvYWNoRHgsIGMyeSA9IGV5O1xuICAgICAgc2xvdC5wYXRoLnNldEF0dHJpYnV0ZSgnZCcsIGBNICR7b3h9ICR7b3l9IEMgJHtjMXh9ICR7YzF5fSwgJHtjMnh9ICR7YzJ5fSwgJHtleH0gJHtleX1gKTtcbiAgICB9XG4gICAgLy8gU3Ryb2tlIG1hdGNoZXMgcmluZyB0aWVyIHNvIGEgZ2xhbmNlIGF0IHRoZSBwYWdlIHRlbGxzIHRoZSB1c2VyXG4gICAgLy8gd2hpY2ggY2FwdHVyZSB0aGlzIGN1cnZlIHBvaW50cyB0by5cbiAgICBjb25zdCBzdHJva2UgPSBvcHRzLnByZXZpZXcgPyAnIzdiZDk3YScgOiBvcHRzLmdvbGQgPyAnI2ZmZDE2NicgOiAnI2ZmNWYwMCc7XG4gICAgc2xvdC5wYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgc3Ryb2tlKTtcbiAgfTtcbiAgLy8gT3ZlcmxheS1mcmVlemUgZmxhZy4gRHVyaW5nIGEgc2NyZWVuc2hvdCB0aGUgYmFja2dyb3VuZCB0ZWxscyB1cyB0b1xuICAvLyBoaWRlLW92ZXJsYXlzOyB3aGlsZSBoaWRkZW4gd2UgYWxzbyBGUkVFWkUgZXZlcnkgcmluZydzIHJBRiByZXBvc2l0aW9uXG4gIC8vIGxvb3AuIFdpdGhvdXQgdGhpcyB0aGUgbG9vcHMga2VlcCBmaXJpbmcgdGhyb3VnaCB0aGUgY2FwdHVyZSBjeWNsZSDigJRcbiAgLy8gdGhleSByZXBvc2l0aW9uIHJpbmdzIHRvIHRoZSBwb3N0LXNjcm9sbCBvZmZzZXQgKGEgdmlzaWJsZSBqdW1wKSBhbmRcbiAgLy8gcmVwYWludCBhIGJ1cnN0IHRoZSBpbnN0YW50IHRoZSBob3N0IGlzIHNob3duIGFnYWluLCB3aGljaCBpcyB0aGVcbiAgLy8gZmxhc2hpbmcgdGhlIHVzZXIgc2F3IG9uIGdyb3VwZWQgY2FwdHVyZXMgKG1vcmUgcmluZ3MgPSBtb3JlIGZsaWNrZXIpLlxuICAvLyBGcm96ZW4sIHRoZSByaW5ncyBob2xkIHRoZWlyIGxhc3QgZnJhbWUgYW5kIHRoZSBob3N0IGlzIGRpc3BsYXk6bm9uZSxcbiAgLy8gc28gdGhlcmUgaXMgbm90aGluZyB0byByZXBhaW50IHVudGlsIHdlIHRoYXcuIChTZWUgaGlkZS9zaG93LW92ZXJsYXlzLilcbiAgbGV0IG92ZXJsYXlGcm96ZW4gPSBmYWxzZTtcbiAgLy8gUmVtZW1iZXIgZWFjaCB0cmFja2VkIHJpbmcncyBvcHRzIHNvIHRoYXcoKSBjYW4gcmUtYXJtIGl0cyBsb29wLlxuICBjb25zdCByaW5nVHJhY2tPcHRzID0gbmV3IE1hcDxzdHJpbmcsIHtlbDogRWxlbWVudDsgb3B0czogUmluZ09wdHN9PigpO1xuICBjb25zdCBhcm1SaW5nTG9vcCA9IChrZXk6IHN0cmluZywgZWw6IEVsZW1lbnQsIG9wdHM6IFJpbmdPcHRzKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc2xvdCA9IHJpbmdzLmdldChrZXkpO1xuICAgIGlmICghc2xvdCkgcmV0dXJuO1xuICAgIGlmIChzbG90LnJhZikgY2FuY2VsQW5pbWF0aW9uRnJhbWUoc2xvdC5yYWYpO1xuICAgIGNvbnN0IHRpY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIWVsLmlzQ29ubmVjdGVkKSB7IHJlbW92ZVJpbmcoa2V5KTsgcmluZ1RyYWNrT3B0cy5kZWxldGUoa2V5KTsgcmV0dXJuOyB9XG4gICAgICBpZiAob3ZlcmxheUZyb3plbikgeyBzbG90LnJhZiA9IDA7IHJldHVybjsgfSAvLyBob2xkIGxhc3QgZnJhbWU7IHRoYXcoKSByZS1hcm1zXG4gICAgICBwb3NpdGlvblJpbmcoc2xvdCwgZWwsIG9wdHMpO1xuICAgICAgc2xvdC5yYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgfTtcbiAgICB0aWNrKCk7XG4gIH07XG4gIGNvbnN0IHRyYWNrRWxlbWVudCA9IChrZXk6IHN0cmluZywgZWw6IEVsZW1lbnQsIG9wdHM6IFJpbmdPcHRzID0ge30pOiB2b2lkID0+IHtcbiAgICBjb25zdCBzbG90ID0gZW5zdXJlUmluZyhrZXkpO1xuICAgIHNsb3QudGFyZ2V0ID0gZWw7XG4gICAgcmluZ1RyYWNrT3B0cy5zZXQoa2V5LCB7ZWwsIG9wdHN9KTtcbiAgICBhcm1SaW5nTG9vcChrZXksIGVsLCBvcHRzKTtcbiAgICAvLyBBIGZyZXNoIHJpbmcgaXMgYSBnb29kIG1vbWVudCB0byByZS1zdGFjayBhYm92ZSBhbnkgZGlhbG9nL3BvcG92ZXJcbiAgICAvLyB0aGUgcGFnZSBvcGVuZWQgc2luY2Ugd2UgbGFzdCBwYWludGVkLlxuICAgIGJyaW5nVG9Gcm9udCgpO1xuICB9O1xuICAvLyBTdG9wIGV2ZXJ5IHJpbmcncyByQUYgbG9vcCBpbiBwbGFjZSAodXNlZCBkdXJpbmcgc2NyZWVuc2hvdCBjYXB0dXJlKS5cbiAgLy8gVGhlIHNsb3Qga2VlcHMgaXRzIGN1cnJlbnQgZ2VvbWV0cnk7IHRoYXdSaW5ncyByZS1hcm1zIHRoZSBsb29wcy5cbiAgY29uc3QgZnJlZXplUmluZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBzbG90IG9mIHJpbmdzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoc2xvdC5yYWYpIHsgY2FuY2VsQW5pbWF0aW9uRnJhbWUoc2xvdC5yYWYpOyBzbG90LnJhZiA9IDA7IH1cbiAgICB9XG4gIH07XG4gIC8vIFJlLWFybSBldmVyeSB0cmFja2VkIHJpbmcncyBsb29wIGFmdGVyIGEgZnJlZXplLiBFYWNoIGxvb3AncyBmaXJzdCB0aWNrXG4gIC8vIHJ1bnMgc3luY2hyb25vdXNseSwgc28gYWxsIHJpbmdzIHJlcG9zaXRpb24gb24gdGhlIHNhbWUgZnJhbWUuXG4gIGNvbnN0IHRoYXdSaW5ncyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHtlbCwgb3B0c31dIG9mIHJpbmdUcmFja09wdHMpIGFybVJpbmdMb29wKGtleSwgZWwsIG9wdHMpO1xuICB9O1xuXG4gIGNvbnN0IGZsYXNoRWxlbWVudCA9IChlbDogRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNsb3QgPSBlbnN1cmVSaW5nKCdmbGFzaCcpO1xuICAgIHBvc2l0aW9uUmluZyhzbG90LCBlbCwge30pO1xuICAgIC8vIFdlYiBBbmltYXRpb25zIEFQSSDigJQga2V5ZnJhbWVzIG5lZWQgbm8gPHN0eWxlPiwgbm8gQ1NQIGlzc3VlLlxuICAgIHNsb3QuZWwuYW5pbWF0ZShbXG4gICAgICB7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAnc2NhbGUoMS4wNCknLCBib3JkZXJDb2xvcjogJyNmZmUwNjYnLCBib3hTaGFkb3c6ICcwIDAgMCA2cHggcmdiYSgyNTUsMjI0LDEwMiwuNCknfSxcbiAgICAgIHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgxKSd9LFxuICAgIF0sIHtkdXJhdGlvbjogNzAwLCBlYXNpbmc6ICdlYXNlLW91dCcsIGZpbGw6ICdmb3J3YXJkcyd9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbW92ZVJpbmcoJ2ZsYXNoJyksIDcyMCk7XG4gIH07XG5cbiAgLy8gTG9jYXRlLW9uLXBhZ2UgaXMgYSBkZWxpYmVyYXRlIHVzZXIgcmVxdWVzdCBmcm9tIHRoZSBzaWRlIHBhbmVsIChcIndoZXJlXG4gIC8vIGlzIHRoaXMgdGhpbmc/XCIpLCBzbyB0aGUgdmlzdWFsIG11c3QgYmUgbG91ZCBlbm91Z2ggdG8gZmluZCBvbiBhXG4gIC8vIGNyb3dkZWQgcGFnZS4gVGhyZWUgc2VxdWVudGlhbCBwdWxzZXMgd2l0aCBhbiBleHBhbmRpbmcgc2hhZG93IGhhbG8sXG4gIC8vIHBsdXMgYSBjZW50ZXItYW5jaG9yZWQgc2NhbGUgdGhhdCBwb3BzIHRoZW4gc2V0dGxlcy4gRWFjaCBwdWxzZSBydW5zXG4gIC8vIH41MDBtczsgdG90YWwgfjEuNXMuIERpc3RpbmN0IGNvbG9yIChlbGVjdHJpYyBjeWFuKSBzbyBpdCBkb2Vzbid0XG4gIC8vIGNvbmZ1c2Ugd2l0aCB0aGUgb3JhbmdlIGhvdmVyIHJpbmcgb3IgdGhlIGxpbWUgZHJhZyBwcmV2aWV3LlxuICBjb25zdCBsb2NhdGVGbGFzaCA9IChlbDogRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoci53aWR0aCA9PT0gMCB8fCByLmhlaWdodCA9PT0gMCkgcmV0dXJuO1xuICAgIGVsLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJywgaW5saW5lOiAnY2VudGVyJ30pO1xuICAgIGNvbnN0IHNsb3QgPSBlbnN1cmVSaW5nKCdsb2NhdGUnKTtcbiAgICBwb3NpdGlvblJpbmcoc2xvdCwgZWwsIHt9KTtcbiAgICBPYmplY3QuYXNzaWduKHNsb3QuZWwuc3R5bGUsIHtcbiAgICAgIGJvcmRlckNvbG9yOiAnIzVmZDFmZicsXG4gICAgICBib3JkZXJXaWR0aDogJzNweCcsXG4gICAgICBib3hTaGFkb3c6ICcwIDAgMCA0cHggcmdiYSg5NSwyMDksMjU1LC4zNSksIDAgMCAzNnB4IHJnYmEoOTUsMjA5LDI1NSwuNyknLFxuICAgICAgb3BhY2l0eTogJzEnLFxuICAgIH0pO1xuICAgIC8vIFRocmVlIHB1bHNlIGN5Y2xlczogYnJpZ2h0ZXIgaGFsbyArIHNsaWdodCBzY2FsZSBwdWxzZSBvbiBlYWNoIGJlYXQuXG4gICAgc2xvdC5lbC5hbmltYXRlKFtcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjAwKScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDRweCByZ2JhKDk1LDIwOSwyNTUsLjQ1KSwgMCAwIDIwcHggcmdiYSg5NSwyMDksMjU1LC41NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjA2KScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDEycHggcmdiYSg5NSwyMDksMjU1LC4xOCksIDAgMCA2MHB4IHJnYmEoOTUsMjA5LDI1NSwuODUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wMCknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCA0cHggcmdiYSg5NSwyMDksMjU1LC40NSksIDAgMCAyMHB4IHJnYmEoOTUsMjA5LDI1NSwuNTUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wNiknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCAxMnB4IHJnYmEoOTUsMjA5LDI1NSwuMTgpLCAwIDAgNjBweCByZ2JhKDk1LDIwOSwyNTUsLjg1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDApJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgNHB4IHJnYmEoOTUsMjA5LDI1NSwuNDUpLCAwIDAgMjBweCByZ2JhKDk1LDIwOSwyNTUsLjU1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDYpJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgMTJweCByZ2JhKDk1LDIwOSwyNTUsLjE4KSwgMCAwIDYwcHggcmdiYSg5NSwyMDksMjU1LC44NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjAwKScsIG9wYWNpdHk6IDB9LFxuICAgIF0sIHtkdXJhdGlvbjogMTYwMCwgZWFzaW5nOiAnZWFzZS1pbi1vdXQnLCBmaWxsOiAnZm9yd2FyZHMnfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiByZW1vdmVSaW5nKCdsb2NhdGUnKSwgMTcwMCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNwYWNpbmcgdmlzdWFsaXplciAoUGxhc21pYy1pbnNwaXJlZCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIDQgbWFyZ2luIHN0cmlwcyAobGlnaHQgb3JhbmdlLCBvdXRzaWRlIHRoZSBlbGVtZW50KSArIDQgcGFkZGluZyBzdHJpcHNcbiAgLy8gKGxpZ2h0IGJsdWUsIGluc2lkZSB0aGUgZWxlbWVudCkuIFNpZGUtcGFuZWwgcHVzaGVzIGEgYHNldC1jcy1wcmVmc2BcbiAgLy8gbWVzc2FnZSB0byB0b2dnbGUuIFdoZW4gT04sIGZpcmVIb3ZlciBwYWludHMgdGhlc2Ugc3RyaXBlcyBhcm91bmQgdGhlXG4gIC8vIGN1cnJlbnRseS1ob3ZlcmVkIGVsZW1lbnQgZWFjaCBmcmFtZS5cbiAgbGV0IHNwYWNpbmdPdmVybGF5ID0gZmFsc2U7XG4gIGNvbnN0IHNwYWNpbmdEaXZzOiBIVE1MRGl2RWxlbWVudFtdID0gW107XG4gIGNvbnN0IGVuc3VyZVNwYWNpbmdEaXZzID0gKCk6IEhUTUxEaXZFbGVtZW50W10gPT4ge1xuICAgIGlmIChzcGFjaW5nRGl2cy5sZW5ndGgpIHJldHVybiBzcGFjaW5nRGl2cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgY29uc3QgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgT2JqZWN0LmFzc2lnbihkLnN0eWxlLCB7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLCBkaXNwbGF5OiAnbm9uZScsXG4gICAgICAgIGJhY2tncm91bmQ6IGkgPCA0ID8gJ3JnYmEoMjU1LDE1OSw2NCwuMjgpJyA6ICdyZ2JhKDEwOCwxNzgsMjM1LC4yOCknLFxuICAgICAgfSk7XG4gICAgICBzaGFkb3cuYXBwZW5kKGQpO1xuICAgICAgc3BhY2luZ0RpdnMucHVzaChkKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNpbmdEaXZzO1xuICB9O1xuICBjb25zdCBjbGVhclNwYWNpbmdPdmVybGF5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgZCBvZiBzcGFjaW5nRGl2cykgZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9O1xuICBjb25zdCBwYWludFNwYWNpbmdPdmVybGF5ID0gKGVsOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFzcGFjaW5nT3ZlcmxheSkgeyBjbGVhclNwYWNpbmdPdmVybGF5KCk7IHJldHVybjsgfVxuICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBtdCA9IHBhcnNlRmxvYXQoY3MubWFyZ2luVG9wKSB8fCAwO1xuICAgIGNvbnN0IG1yID0gcGFyc2VGbG9hdChjcy5tYXJnaW5SaWdodCkgfHwgMDtcbiAgICBjb25zdCBtYiA9IHBhcnNlRmxvYXQoY3MubWFyZ2luQm90dG9tKSB8fCAwO1xuICAgIGNvbnN0IG1sID0gcGFyc2VGbG9hdChjcy5tYXJnaW5MZWZ0KSB8fCAwO1xuICAgIGNvbnN0IHB0ID0gcGFyc2VGbG9hdChjcy5wYWRkaW5nVG9wKSB8fCAwO1xuICAgIGNvbnN0IHByID0gcGFyc2VGbG9hdChjcy5wYWRkaW5nUmlnaHQpIHx8IDA7XG4gICAgY29uc3QgcGIgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdCb3R0b20pIHx8IDA7XG4gICAgY29uc3QgcGwgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdMZWZ0KSB8fCAwO1xuICAgIGNvbnN0IFttMSwgbTIsIG0zLCBtNCwgcDEsIHAyLCBwMywgcDRdID0gZW5zdXJlU3BhY2luZ0RpdnMoKTtcbiAgICAvLyBNYXJnaW4gc3RyaXBzIChhcm91bmQgdGhlIGVsZW1lbnQpXG4gICAgY29uc3Qgc2V0ID0gKGQ6IEhUTUxEaXZFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmICh3IDw9IDAgfHwgaCA8PSAwKSB7IGQuc3R5bGUuZGlzcGxheSA9ICdub25lJzsgcmV0dXJuOyB9XG4gICAgICBkLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgICAgIGQuc3R5bGUudG9wID0geSArICdweCc7XG4gICAgICBkLnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gICAgICBkLnN0eWxlLmhlaWdodCA9IGggKyAncHgnO1xuICAgICAgZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9O1xuICAgIHNldChtMSEsIHIubGVmdCAtIG1sLCByLnRvcCAtIG10LCByLndpZHRoICsgbWwgKyBtciwgbXQpOyAgICAgICAgICAgIC8vIHRvcFxuICAgIHNldChtMiEsIHIucmlnaHQsIHIudG9wLCBtciwgci5oZWlnaHQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJpZ2h0XG4gICAgc2V0KG0zISwgci5sZWZ0IC0gbWwsIHIuYm90dG9tLCByLndpZHRoICsgbWwgKyBtciwgbWIpOyAgICAgICAgICAgICAgLy8gYm90dG9tXG4gICAgc2V0KG00ISwgci5sZWZ0IC0gbWwsIHIudG9wLCBtbCwgci5oZWlnaHQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVmdFxuICAgIC8vIFBhZGRpbmcgc3RyaXBzIChpbnNpZGUgdGhlIGVsZW1lbnQpXG4gICAgc2V0KHAxISwgci5sZWZ0LCByLnRvcCwgci53aWR0aCwgcHQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9wXG4gICAgc2V0KHAyISwgci5yaWdodCAtIHByLCByLnRvcCArIHB0LCBwciwgci5oZWlnaHQgLSBwdCAtIHBiKTsgICAgICAgICAgLy8gcmlnaHRcbiAgICBzZXQocDMhLCByLmxlZnQsIHIuYm90dG9tIC0gcGIsIHIud2lkdGgsIHBiKTsgICAgICAgICAgICAgICAgICAgICAgICAvLyBib3R0b21cbiAgICBzZXQocDQhLCByLmxlZnQsIHIudG9wICsgcHQsIHBsLCByLmhlaWdodCAtIHB0IC0gcGIpOyAgICAgICAgICAgICAgICAvLyBsZWZ0XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE9uLXBhZ2UgYW5ub3RhdGlvbiB0b29sdGlwIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhbm5vdGF0aW9uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYW5ub3RhdGlvbkVsLmNsYXNzTmFtZSA9ICdhbm5vdGF0aW9uJztcbiAgT2JqZWN0LmFzc2lnbihhbm5vdGF0aW9uRWwuc3R5bGUsIHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJywgcG9pbnRlckV2ZW50czogJ2F1dG8nLFxuICAgIGJhY2tncm91bmQ6ICdyZ2JhKDE1LDE1LDIwLC45NiknLFxuICAgIGNvbG9yOiAnI2ZjZmFmNScsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDk1LDAsLjUpJyxcbiAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICBwYWRkaW5nOiAnOHB4IDEwcHgnLFxuICAgIGZvbnQ6IFwiMTJweC8xLjQ1IHVpLW1vbm9zcGFjZSwnSmV0QnJhaW5zIE1vbm8nLE1lbmxvLG1vbm9zcGFjZVwiLFxuICAgIG1heFdpZHRoOiAnbWluKDM2MHB4LCA3MHZ3KScsXG4gICAgYm94U2hhZG93OiAnMCA4cHggMzJweCByZ2JhKDAsMCwwLC41NSknLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAvLyBBbm5vdGF0aW9uIGFsd2F5cyBwYWludHMgb24gdG9wIG9mIHJpbmdzL3J1YmJlci1iYW5kL3ByZXZpZXcgcmluZ3NcbiAgICAvLyAocmluZ3MgYXJlIHpJbmRleDoxOyB0aGlzIGxpZnRzIHRoZSBjb21tZW50IGJveCBjbGVhcikuXG4gICAgekluZGV4OiAnMjE0NzQ4MzY0NycsXG4gIH0pO1xuICBzaGFkb3cuYXBwZW5kKGFubm90YXRpb25FbCk7XG4gIGNvbnN0IGFubm90YXRpb24gPSBzZXR1cEFubm90YXRpb24oYW5ub3RhdGlvbkVsLCB7XG4gICAgc2VuZFRvUGFuZWwsXG4gICAgLy8gRm9yIGFuIHVuY2FwdHVyZWQgZWxlbWVudCwgdGhlIHVzZXIgdHlwaW5nIGludG8gdGhlIGJveCBhbmQgcHJlc3NpbmdcbiAgICAvLyBFbnRlciBib3RoIGNhcHR1cmVzIGFuZCBhdHRhY2hlcyB0aGUgY29tbWVudC5cbiAgICBjYXB0dXJlQW5kQ29tbWVudDogKGVsLCB0ZXh0KSA9PiB7XG4gICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShlbCwgbmV4dFNlcSgpKTtcbiAgICAgIGZsYXNoRWxlbWVudChlbCk7XG4gICAgICBjb25zdCBwYWdlID0gYnVpbGRQYWdlQ29udGV4dCgpO1xuICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2V9KTtcbiAgICAgIHRlc3RDYXB0dXJlcz8ucHVzaCh7ZW50cnksIHBhZ2V9KTtcbiAgICAgIC8vIHBhcmVudFVpZCArIHVybCBkaXNhbWJpZ3VhdGUgd2hpY2ggY2FwdHVyZSB0aGUgY29tbWVudFxuICAgICAgLy8gYmVsb25ncyB0byB3aGVuIHRoZSBzYW1lIHNlbGVjdG9yIGV4aXN0cyBvbiBtdWx0aXBsZSBwYWdlc1xuICAgICAgLy8gb3IgZm9yIG11bHRpcGxlIHNpYmxpbmcgZWxlbWVudHMgd2l0aCB0aGUgc2FtZSB0ZXN0SWQuXG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2ZlZWRiYWNrLWFkZCcsIHNlbGVjdG9yOiBlbnRyeS5zZWxlY3RvciwgdGV4dCwgdXJsOiBwYWdlLnVybCwgcGFyZW50VWlkOiBlbnRyeS51aWR9KTtcbiAgICAgIHJldHVybiBlbnRyeTtcbiAgICB9LFxuICAgIC8vIEJveCBoaWRlcyDihpIgdGVhciBkb3duIHRoZSBtYXRjaGluZyBob3ZlciByaW5nIHNvIHRoZSB0d28gZ28gdG9nZXRoZXIuXG4gICAgb25IaWRlOiAoKSA9PiByZW1vdmVSaW5nKCdob3ZlcicpLFxuICAgIC8vIEJveCBhcHBlYXJzIGZvciBhbiBlbGVtZW50IOKGkiBlbnN1cmUgdGhlIHJpbmcgaXMgb24gdGhlIHNhbWUgZWxlbWVudC5cbiAgICBvblNob3c6IChlbCkgPT4gdHJhY2tFbGVtZW50KCdob3ZlcicsIGVsLCB7bGFiZWw6IGNvbXBhY3RUYXJnZXQoZWwpfSksXG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBBbHQtaG92ZXIgc3RhdGUgbWFjaGluZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGFsdEFjdGl2ZSA9IGZhbHNlO1xuICBsZXQgYWx0Rm9yd2FyZGVkID0gZmFsc2U7XG4gIC8vIFN0aWNreSBcInBpbmNoIG1vZGVcIjogd2hlbiBvbiwgcGxhaW4gaG92ZXIvY2xpY2sgY2FwdHVyZXMgd2l0aG91dCB0aGVcbiAgLy8gQWx0IG1vZGlmaWVyIGhlbGQuIEEgZml4ZWQgcGFnZSBiYWRnZSBzaWduYWxzIGl0OyBFc2MgZXhpdHMuXG4gIGxldCBtYW51YWxTZWxlY3QgPSBmYWxzZTtcbiAgY29uc3QgcGluY2hFbmdhZ2VkID0gKG5hdGl2ZTogYm9vbGVhbik6IGJvb2xlYW4gPT4gbmF0aXZlIHx8IGFsdEZvcndhcmRlZCB8fCBtYW51YWxTZWxlY3Q7XG4gIGxldCBsYXN0SG92ZXJFbDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBsZXQgbGFzdE1vdXNlID0ge3g6IC0xLCB5OiAtMX07XG4gIGxldCBrbm93bkNhcHR1cmVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIC8vIEhvdmVyL2NsaWNrIHNuYXA6IHdoZW4gT04sIGV2ZXJ5IGFsdC1ob3ZlciBhbmQgY2FwdHVyZSB3YWxrcyB1cCB0byB0aGVcbiAgLy8gbmVhcmVzdCBjb21wb25lbnQtbWFya2VyIGFuY2VzdG9yIChkYXRhLXRlc3RpZC9yb2xlL2lkL2J1dHRvbi9hL2lucHV0KVxuICAvLyBzbyBzaW5nbGUtY2xpY2sgYW5kIHJ1YmJlci1iYW5kIHNlbGVjdGlvbiBwaWNrIGNvbnNpc3RlbnQgbGF5ZXJzXG4gIC8vIHJlZ2FyZGxlc3Mgb2YgcGl4ZWwtbGV2ZWwgY3Vyc29yIHBsYWNlbWVudC4gUHVzaGVkIGJ5IHRoZSBzaWRlIHBhbmVsXG4gIC8vIHZpYSBgc2V0LWNzLXByZWZzYC5cbiAgbGV0IGhvdmVyU25hcCA9IHRydWU7XG5cbiAgY29uc3QgZmlyZUhvdmVyRW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgY2xlYXJTcGFjaW5nT3ZlcmxheSgpO1xuICAgIGxhc3RIb3ZlckVsID0gbnVsbDtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2hvdmVyLWVuZCd9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RpY2t5IHBpbmNoLW1vZGUgYmFkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEEgZml4ZWQgcGlsbCBpbiB0aGUgb3ZlcmxheSBzbyB0aGUgdXNlciBhbHdheXMga25vd3MgcGxhaW4gY2xpY2tzIGFyZVxuICAvLyBjYXB0dXJpbmcgKGFuZCBob3cgdG8gbGVhdmUpLiBMaXZlcyBpbiB0aGUgc2hhZG93IHJvb3QsIHBvaW50ZXItZXZlbnRzXG4gIC8vIG5vbmUgc28gaXQgbmV2ZXIgZWF0cyBhIGNsaWNrLlxuICBsZXQgc2VsZWN0QmFkZ2U6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHNob3dTZWxlY3RCYWRnZSA9IChvbjogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmICghb24pIHsgc2VsZWN0QmFkZ2U/LnJlbW92ZSgpOyBzZWxlY3RCYWRnZSA9IG51bGw7IHJldHVybjsgfVxuICAgIGlmIChzZWxlY3RCYWRnZSkgcmV0dXJuO1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBiLnRleHRDb250ZW50ID0gJ/CfpI8gUGluY2ggbW9kZSDigJQgY2xpY2sgdG8gY2FwdHVyZSDCtyBFc2MgdG8gZXhpdCc7XG4gICAgT2JqZWN0LmFzc2lnbihiLnN0eWxlLCB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgbGVmdDogJzUwJScsIGJvdHRvbTogJzE4cHgnLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcbiAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDI1NSw5NSwwLC45NSknLCBjb2xvcjogJyNmZmYnLFxuICAgICAgZm9udDogXCI2MDAgMTJweC8xIHVpLW1vbm9zcGFjZSwnSmV0QnJhaW5zIE1vbm8nLE1lbmxvLG1vbm9zcGFjZVwiLFxuICAgICAgcGFkZGluZzogJzhweCAxNHB4JywgYm9yZGVyUmFkaXVzOiAnOTk5cHgnLFxuICAgICAgYm94U2hhZG93OiAnMCA0cHggMjBweCByZ2JhKDAsMCwwLC4zNSknLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICB6SW5kZXg6ICcyMTQ3NDgzNjQ3Jywgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgfSk7XG4gICAgc2hhZG93LmFwcGVuZChiKTtcbiAgICBzZWxlY3RCYWRnZSA9IGI7XG4gIH07XG4gIGNvbnN0IHNldFNlbGVjdE1vZGUgPSAob246IGJvb2xlYW4sIG5vdGlmeVBhbmVsID0gZmFsc2UpOiB2b2lkID0+IHtcbiAgICBpZiAobWFudWFsU2VsZWN0ID09PSBvbikgcmV0dXJuO1xuICAgIG1hbnVhbFNlbGVjdCA9IG9uO1xuICAgIHNob3dTZWxlY3RCYWRnZShvbik7XG4gICAgYnJpbmdUb0Zyb250KCk7XG4gICAgc2V0QWx0QWN0aXZlKG9uKTsgICAgICAgICAgIC8vIGVuZ2FnZS9kaXNlbmdhZ2UgdGhlIGhvdmVyIHJpbmcgaW1tZWRpYXRlbHlcbiAgICBpZiAobm90aWZ5UGFuZWwpIHNlbmRUb1BhbmVsKHtraW5kOiAnc2VsZWN0LW1vZGUnLCBvbn0pO1xuICB9O1xuXG4gIGNvbnN0IHNldEFsdEFjdGl2ZSA9IChvbjogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChhbHRBY3RpdmUgPT09IG9uKSByZXR1cm47XG4gICAgYWx0QWN0aXZlID0gb247XG4gICAgaWYgKCFvbikge1xuICAgICAgLy8gSWYgdGhlIGNvbW1lbnQgYm94IGlzIHZpc2libGUsIHJpbmcgYW5kIGJveCBhcmUgYSB1bml0OiBrZWVwIEJPVEhcbiAgICAgIC8vIG9uIHNjcmVlbiBhbmQgaGFuZCBmb2N1cyB0byB0aGUgdGV4dGFyZWEgc28gdGhlIHVzZXIgY2FuIHR5cGVcbiAgICAgIC8vIGltbWVkaWF0ZWx5LiBJZiB0aGVyZSdzIG5vIGJveCwgbm8gZm9jdXMgdG8gZ2l2ZSDigJQgdGVhciBkb3duIHRoZVxuICAgICAgLy8gcmluZyBhcyBiZWZvcmUuXG4gICAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIHtcbiAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdob3Zlci1lbmQnfSk7IC8vIHBhbmVsLXNpZGUgc3RhdHVzIHJlc2V0XG4gICAgICAgIGFubm90YXRpb24uZm9jdXNUZXh0YXJlYSgpO1xuICAgICAgICAvLyAocmluZyByZW1haW5zOyByQUYga2VlcHMgaXQgdHJhY2tpbmcgdGhlIGN1cnJlbnQgZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpcmVIb3ZlckVuZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobGFzdE1vdXNlLnggPj0gMCkge1xuICAgICAgY29uc3QgdGd0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChsYXN0TW91c2UueCwgbGFzdE1vdXNlLnkpO1xuICAgICAgaWYgKHRndCBpbnN0YW5jZW9mIEVsZW1lbnQpIHsgbGFzdEhvdmVyRWwgPSB0Z3Q7IGZpcmVIb3Zlcih0Z3QpOyB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFRydWUgd2hlbiBhbiBlbGVtZW50IGlzIHRvbyBsYXJnZSB0byBiZSBhIG1lYW5pbmdmdWwgY2FwdHVyZSB0YXJnZXQg4oCUXG4gIC8vIGJvZHkgLyBodG1sIC8gd3JhcHBlcnMgY292ZXJpbmcgbW9zdCBvZiB0aGUgdmlld3BvcnQuIFVzZWQgdG8gcmVqZWN0XG4gIC8vIGFsdC1jbGljayBhbmQgcGVuZGluZy1zdGFnZSBjYXB0dXJlcyBzbyB0aGUgdXNlciBkb2Vzbid0IGFjY2lkZW50YWxseVxuICAvLyBncmFiIHRoZSB3aG9sZSBwYWdlIHdoZW4gdGhleSBjbGljayBvbiBkZWFkIHNwYWNlLlxuICBjb25zdCBpc0h1Z2VFbGVtZW50ID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gci53aWR0aCA+PSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuOSAmJiByLmhlaWdodCA+PSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjk7XG4gIH07XG5cbiAgY29uc3QgcmVzb2x2ZUhvdmVyVGFyZ2V0ID0gKHRndDogRWxlbWVudCk6IHtlbDogRWxlbWVudDsgc2VsZWN0b3I6IHN0cmluZ30gPT4ge1xuICAgIGNvbnN0IGVsID0gaG92ZXJTbmFwID8gc25hcFRvQ29tcG9uZW50KHRndCwga25vd25DYXB0dXJlZCkgOiB0Z3Q7XG4gICAgLy8gUmV1c2UgYSBrbm93bi1jYXB0dXJlZCBzZWxlY3RvciB2ZXJiYXRpbSBpZiB0aGUgc25hcHBlZCBlbGVtZW50XG4gICAgLy8gbWF0Y2hlcyBvbmUg4oCUIGtlZXBzIHRoZSBjYXB0dXJlZC1zaWRlIGlkZW50aXR5IHN0YWJsZS5cbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBrbm93bkNhcHR1cmVkKSB7XG4gICAgICB0cnkgeyBpZiAoZWwubWF0Y2hlcyhzZWwpKSByZXR1cm4ge2VsLCBzZWxlY3Rvcjogc2VsfTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiB7ZWwsIHNlbGVjdG9yOiBjc3NQYXRoKGVsKX07XG4gIH07XG5cbiAgY29uc3QgZmlyZUhvdmVyID0gKHRndDogRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHtlbCwgc2VsZWN0b3J9ID0gcmVzb2x2ZUhvdmVyVGFyZ2V0KHRndCk7XG4gICAgLy8gUmVqZWN0IGJvZHkgLyBodG1sIC8gYW55IHBhZ2Utc3Bhbm5pbmcgd3JhcHBlciBhdCB0aGUgaG92ZXIgc3RhZ2UgdG9vLlxuICAgIC8vIFRoZSBlYXJsaWVyIGZpbHRlciBvbmx5IHJhbiBvbiBjbGljayArIHN0YWdlUGVuZGluZywgc28gYWx0LWhvdmVyaW5nXG4gICAgLy8gZW1wdHkgcGFnZSBhcmVhIHN0aWxsIHBhaW50ZWQgYSByaW5nIGFyb3VuZCB0aGUgZW50aXJlIHBhZ2UuXG4gICAgaWYgKGlzSHVnZUVsZW1lbnQoZWwpKSB7XG4gICAgICByZW1vdmVSaW5nKCdob3ZlcicpO1xuICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdob3Zlci1lbmQnfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyYWNrRWxlbWVudCgnaG92ZXInLCBlbCwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKX0pO1xuICAgIHBhaW50U3BhY2luZ092ZXJsYXkoZWwpO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBzZW5kVG9QYW5lbCh7XG4gICAgICBraW5kOiAnaG92ZXInLFxuICAgICAgc2VsZWN0b3IsXG4gICAgICB0YWc6IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIGxhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKSxcbiAgICAgIHJlY3Q6IHt4OiBNYXRoLnJvdW5kKHIueCksIHk6IE1hdGgucm91bmQoci55KSwgdzogTWF0aC5yb3VuZChyLndpZHRoKSwgaDogTWF0aC5yb3VuZChyLmhlaWdodCl9LFxuICAgIH0pO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBEcmFnIHN0YXRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgc2VxdWVuY2VDb3VudGVyID0gMDtcbiAgY29uc3QgbmV4dFNlcSA9ICgpOiBudW1iZXIgPT4gKytzZXF1ZW5jZUNvdW50ZXI7XG4gIGxldCBsYXN0Q29udGV4dEVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdXBwcmVzc05leHRDbGljayA9IGZhbHNlO1xuICBsZXQgZHJhZ1N0YXJ0OiB7eDogbnVtYmVyOyB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG4gIGxldCBkcmFnUmVjdDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGRyYWdTYXZlZFVzZXJTZWxlY3QgPSAnJztcbiAgLy8gU3RhYmxlIGNhbmRpZGF0ZSBwb29sIGxvY2tlZCBhdCBkcmFnIHN0YXJ0IOKAlCBldmVyeSBlbGVtZW50c0luUmVjdCBjYWxsXG4gIC8vIGZvciB0aGlzIGRyYWcgdXNlcyB0aGUgc2FtZSBwb29sLCBzbyB0aGUgcnViYmVyLWJhbmQgc2VsZWN0aW9uIGdyb3dzIC9cbiAgLy8gc2hyaW5rcyBtb25vdG9uaWNhbGx5IHdpdGggcmVjdCBzaXplIChubyB0aWVyLXNoaWZ0IGNodXJuKS5cbiAgbGV0IGRyYWdDYW5kaWRhdGVzOiByZWFkb25seSBFbGVtZW50W10gPSBbXTtcblxuICBjb25zdCBjbGVhclByZXZpZXdSaW5ncyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLnJpbmdzLmtleXMoKV0pIGlmIChrLnN0YXJ0c1dpdGgoJ3ByZXZpZXc6JykpIHJlbW92ZVJpbmcoayk7XG4gIH07XG4gIGNvbnN0IGVuc3VyZURyYWdSZWN0ID0gKCk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBpZiAoZHJhZ1JlY3QpIHJldHVybiBkcmFnUmVjdDtcbiAgICBkcmFnUmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRyYWdSZWN0LmNsYXNzTmFtZSA9ICdydWJiZXInO1xuICAgIE9iamVjdC5hc3NpZ24oZHJhZ1JlY3Quc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAvLyBCb3JkZXIgc3R5bGUgaXMgc2V0IGJ5IHVwZGF0ZURyYWdSZWN0IGVhY2ggZnJhbWU6IHNvbGlkIGZvciBcImZ1bGxcbiAgICAgIC8vIGVuY2xvc3VyZVwiIChsZWZ04oaScmlnaHQpLCBkYXNoZWQgZm9yIFwicGFydGlhbCBvdmVybGFwXCIgKHJpZ2h04oaSbGVmdCkuXG4gICAgICBib3JkZXI6ICcycHggc29saWQgI2ZmNWYwMCcsXG4gICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsOTUsMCwuMTQpJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICBib3hTaGFkb3c6ICcwIDAgMCAxcHggcmdiYSgyNTUsOTUsMCwuMzUpLCAwIDAgMThweCByZ2JhKDI1NSw5NSwwLC4yNSknLFxuICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgfSk7XG4gICAgc2hhZG93LmFwcGVuZChkcmFnUmVjdCk7XG4gICAgZHJhZ1NhdmVkVXNlclNlbGVjdCA9IGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdDtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2Nyb3NzaGFpcic7XG4gICAgLy8gRHJhZyBtb2RlOiBoaWRlIHRoZSBjb21tZW50IGJveCBzbyBpdCBkb2Vzbid0IG9ic2N1cmUgdGhlIHJ1YmJlciBiYW5kLlxuICAgIGFubm90YXRpb24uaGlkZSgpO1xuICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgLy8gTG9jayB0aGUgY2FuZGlkYXRlIHBvb2wgT05DRSBwZXIgZHJhZyAocmlnb3JvdXMtM2QtYXBwIGJlaGF2aW9yKS5cbiAgICBkcmFnQ2FuZGlkYXRlcyA9IHBpY2tEcmFnQ2FuZGlkYXRlcyhvdmVybGF5SG9zdCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAnZHJhZyBjYW5kaWRhdGUgcG9vbCBsb2NrZWQ6JywgZHJhZ0NhbmRpZGF0ZXMubGVuZ3RoLCAnZWxlbWVudHMnKTtcbiAgICByZXR1cm4gZHJhZ1JlY3Q7XG4gIH07XG4gIGNvbnN0IHRlYXJkb3duRHJhZ1JlY3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGRyYWdSZWN0KSB7IGRyYWdSZWN0LnJlbW92ZSgpOyBkcmFnUmVjdCA9IG51bGw7IH1cbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBkcmFnU2F2ZWRVc2VyU2VsZWN0O1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICcnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgY2xlYXJQcmV2aWV3UmluZ3MoKTtcbiAgICBkcmFnQ2FuZGlkYXRlcyA9IFtdO1xuICB9O1xuICBsZXQgbGFzdFByZXZpZXdLZXlzID0gbmV3IFNldDxFbGVtZW50PigpO1xuICAvLyBTZWxlY3Rpb24gbW9kZSBpcyBkZWNpZGVkIGJ5IGRyYWcgZGlyZWN0aW9uICgzRC1hcHAgY29udmVudGlvbik6XG4gIC8vICAgbGVmdOKGknJpZ2h0ICA6ICdmdWxsJyAgICDigJQgZWxlbWVudCBtdXN0IGJlIGVudGlyZWx5IGluc2lkZSB0aGUgcmVjdDtcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWJiZXItYmFuZCBoYXMgYSBTT0xJRCBib3JkZXIuXG4gIC8vICAgcmlnaHTihpJsZWZ0ICA6ICdwYXJ0aWFsJyDigJQgYW55IG92ZXJsYXAgc2VsZWN0cztcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWJiZXItYmFuZCBoYXMgYSBET1RURUQgYm9yZGVyLlxuICBjb25zdCBkcmFnTW9kZSA9IChlOiBNb3VzZUV2ZW50KTogJ3BhcnRpYWwnIHwgJ2Z1bGwnID0+XG4gICAgZHJhZ1N0YXJ0ICYmIGUuY2xpZW50WCA+PSBkcmFnU3RhcnQueCA/ICdmdWxsJyA6ICdwYXJ0aWFsJztcblxuICBjb25zdCB1cGRhdGVEcmFnUmVjdCA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFkcmFnU3RhcnQpIHJldHVybjtcbiAgICBjb25zdCBkeCA9IE1hdGguYWJzKGUuY2xpZW50WCAtIGRyYWdTdGFydC54KTtcbiAgICBjb25zdCBkeSA9IE1hdGguYWJzKGUuY2xpZW50WSAtIGRyYWdTdGFydC55KTtcbiAgICBpZiAoIWRyYWdSZWN0ICYmIGR4IDwgMiAmJiBkeSA8IDIpIHJldHVybjtcbiAgICBjb25zdCB4MSA9IE1hdGgubWluKGRyYWdTdGFydC54LCBlLmNsaWVudFgpO1xuICAgIGNvbnN0IHkxID0gTWF0aC5taW4oZHJhZ1N0YXJ0LnksIGUuY2xpZW50WSk7XG4gICAgY29uc3QgeDIgPSBNYXRoLm1heChkcmFnU3RhcnQueCwgZS5jbGllbnRYKTtcbiAgICBjb25zdCB5MiA9IE1hdGgubWF4KGRyYWdTdGFydC55LCBlLmNsaWVudFkpO1xuICAgIGNvbnN0IHIgPSBlbnN1cmVEcmFnUmVjdCgpO1xuICAgIGNvbnN0IG1vZGUgPSBkcmFnTW9kZShlKTtcbiAgICBPYmplY3QuYXNzaWduKHIuc3R5bGUsIHtcbiAgICAgIGxlZnQ6IHgxICsgJ3B4JyxcbiAgICAgIHRvcDogeTEgKyAncHgnLFxuICAgICAgd2lkdGg6ICh4MiAtIHgxKSArICdweCcsXG4gICAgICBoZWlnaHQ6ICh5MiAtIHkxKSArICdweCcsXG4gICAgICBib3JkZXJTdHlsZTogbW9kZSA9PT0gJ2Z1bGwnID8gJ3NvbGlkJyA6ICdkYXNoZWQnLFxuICAgIH0pO1xuICAgIC8vIExpdmUgcHJldmlldzogcGFpbnQgYSB2aXZpZCByaW5nIG9uIGV2ZXJ5IGNhbmRpZGF0ZSB0aGUgcnViYmVyIGJhbmRcbiAgICAvLyB3b3VsZCBjb21taXQgaWYgdGhlIHVzZXIgcmVsZWFzZWQgcmlnaHQgbm93LiBEaWZmIGFnYWluc3QgdGhlIGxhc3RcbiAgICAvLyBmcmFtZSBzbyB3ZSBkb24ndCBjaHVybiByaW5ncyB3aGVuIHRoZSBzZXQgaXMgdW5jaGFuZ2VkLiBUaGVcbiAgICAvLyBjYW5kaWRhdGUgcG9vbCB3YXMgbG9ja2VkIGF0IGRyYWctc3RhcnQgc28gdGhlIHNldCBpcyBtb25vdG9uaWMgd2l0aFxuICAgIC8vIHJlY3Qgc2l6ZSDigJQgbm8gcmFuZG9tIHNlbGVjdC9kZXNlbGVjdCBtaWQtZHJhZy5cbiAgICBjb25zdCBlbHMgPSBlbGVtZW50c0luUmVjdChkcmFnQ2FuZGlkYXRlcywgeDEsIHkxLCB4MiwgeTIsIG1vZGUpO1xuICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KGVscyk7XG4gICAgbGV0IHNhbWUgPSBuZXh0LnNpemUgPT09IGxhc3RQcmV2aWV3S2V5cy5zaXplO1xuICAgIGlmIChzYW1lKSBmb3IgKGNvbnN0IGVsIG9mIG5leHQpIHsgaWYgKCFsYXN0UHJldmlld0tleXMuaGFzKGVsKSkgeyBzYW1lID0gZmFsc2U7IGJyZWFrOyB9IH1cbiAgICBpZiAoIXNhbWUpIHtcbiAgICAgIGNsZWFyUHJldmlld1JpbmdzKCk7XG4gICAgICBlbHMuZm9yRWFjaCgoZWwsIGkpID0+IHRyYWNrRWxlbWVudChgcHJldmlldzoke2l9YCwgZWwsIHtwcmV2aWV3OiB0cnVlfSkpO1xuICAgICAgbGFzdFByZXZpZXdLZXlzID0gbmV4dDtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgYGRyYWcgcHJldmlldyAoJHttb2RlfSk6YCwgZWxzLmxlbmd0aCwgJ3RhcmdldHMnLCBlbHMubWFwKGNvbXBhY3RUYXJnZXQpKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlbmRpbmctbXVsdGkgc3RhZ2luZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBlbmRpbmdNdWx0aTogQXJyYXk8e2VsOiBFbGVtZW50OyBlbnRyeTogRW50cnl9PiA9IFtdO1xuICBjb25zdCBzdGFnZVBlbmRpbmcgPSAocmF3OiBFbGVtZW50LCBjbGlja0F0Pzoge2NsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyfSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gaG92ZXJTbmFwID8gc25hcFRvQ29tcG9uZW50KHJhdywga25vd25DYXB0dXJlZCkgOiByYXc7XG4gICAgaWYgKGlzSHVnZUVsZW1lbnQoZWwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdza2lwcGluZyBodWdlIGVsZW1lbnQgZnJvbSBzdGFnaW5nOicsIGNvbXBhY3RUYXJnZXQoZWwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkoZWwsIG5leHRTZXEoKSwge1xuICAgICAgLi4uKGNsaWNrQXQgPyB7Y2xpY2tBdH0gOiB7fSksXG4gICAgfSk7XG4gICAgaWYgKHBlbmRpbmdNdWx0aS5zb21lKChwKSA9PiBwLmVsID09PSBlbCB8fCBwLmVudHJ5LnNlbGVjdG9yID09PSBlbnRyeS5zZWxlY3RvcikpIHtcbiAgICAgIGZsYXNoRWxlbWVudChlbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlkeCA9IHBlbmRpbmdNdWx0aS5sZW5ndGg7XG4gICAgcGVuZGluZ011bHRpLnB1c2goe2VsLCBlbnRyeX0pO1xuICAgIHRyYWNrRWxlbWVudChgcGVuZGluZzoke2lkeH1gLCBlbCwge2dvbGQ6IHRydWUsIGxhYmVsOiBgIyR7aWR4ICsgMX0gJHtjb21wYWN0VGFyZ2V0KGVsKX1gfSk7XG4gICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3BlbmRpbmctYWRkJywgZW50cnl9KTtcbiAgfTtcbiAgY29uc3QgY29tbWl0UGVuZGluZ011bHRpID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ2NvbW1pdFBlbmRpbmdNdWx0aSDigJQgY29tbWl0dGluZycsIHBlbmRpbmdNdWx0aS5sZW5ndGgsICdzdGFnZWQgZWxlbWVudHMnKTtcbiAgICBjb25zb2xlLnRyYWNlKExPRywgJ2NvbW1pdCBzdGFjayB0cmFjZScpO1xuICAgIHBlbmRpbmdNdWx0aS5mb3JFYWNoKCh7ZWwsIGVudHJ5fSwgaSkgPT4ge1xuICAgICAgY29uc3QgcGFnZSA9IGJ1aWxkUGFnZUNvbnRleHQoKTtcbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnY2FwdHVyZScsIGVudHJ5LCBwYWdlLCBncm91cGVkOiBpID4gMH0pO1xuICAgICAgdGVzdENhcHR1cmVzPy5wdXNoKHtlbnRyeSwgcGFnZSwgZ3JvdXBlZDogaSA+IDB9KTtcbiAgICAgIHJlbW92ZVJpbmcoYHBlbmRpbmc6JHtpfWApO1xuICAgICAgaWYgKGVsLmlzQ29ubmVjdGVkKSBmbGFzaEVsZW1lbnQoZWwpO1xuICAgIH0pO1xuICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncGVuZGluZy1jbGVhcid9KTtcbiAgfTtcbiAgY29uc3QgY2FuY2VsUGVuZGluZ011bHRpID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSBjb25zb2xlLmxvZyhMT0csICdjYW5jZWxQZW5kaW5nTXVsdGkg4oCUIGRpc2NhcmRpbmcnLCBwZW5kaW5nTXVsdGkubGVuZ3RoLCAnc3RhZ2VkJyk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKF8sIGkpID0+IHJlbW92ZVJpbmcoYHBlbmRpbmc6JHtpfWApKTtcbiAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3BlbmRpbmctY2xlYXInfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE1vdXNlIGxpc3RlbmVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGxhc3RNb3ZlVHMgPSAwO1xuICBjb25zdCBvbk1vdXNlTW92ZSA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFvcnBoYW5HdWFyZCgpKSByZXR1cm47XG4gICAgaWYgKGUudGltZVN0YW1wID09PSBsYXN0TW92ZVRzKSByZXR1cm47XG4gICAgbGFzdE1vdmVUcyA9IGUudGltZVN0YW1wO1xuICAgIGxhc3RNb3VzZSA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG4gICAgaWYgKGRyYWdTdGFydCkge1xuICAgICAgLy8gSW4gYSBydWJiZXItYmFuZCBkcmFnIHRoZSBvbmx5IGhpZ2hsaWdodCB0aGF0IHNob3VsZCBhcHBlYXIgaXMgdGhlXG4gICAgICAvLyBsaW1lIFBSRVZJRVcgcmluZyBvbiBjYW5kaWRhdGVzIGluc2lkZSB0aGUgcmVjdC4gVGhlIG9yYW5nZSBob3ZlclxuICAgICAgLy8gcmluZyB3b3VsZCBvdGhlcndpc2UgcmVwYWludCBvbiB3aGF0ZXZlciBlbGVtZW50IHRoZSBjdXJzb3IgaXNcbiAgICAgIC8vIG92ZXIsIG1peGluZyB0d28gY29sb3JzIGFuZCBjb25mdXNpbmcgdGhlIHVzZXIuXG4gICAgICB1cGRhdGVEcmFnUmVjdChlKTtcbiAgICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2hvdmVyLWVuZCd9KTtcbiAgICAgIGxhc3RIb3ZlckVsID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgYWx0T24gPSBwaW5jaEVuZ2FnZWQoZS5hbHRLZXkpO1xuICAgIGlmICghYWx0T24pIHsgaWYgKGFsdEFjdGl2ZSkgc2V0QWx0QWN0aXZlKGZhbHNlKTsgcmV0dXJuOyB9XG4gICAgaWYgKCFhbHRBY3RpdmUpIHNldEFsdEFjdGl2ZSh0cnVlKTtcbiAgICBjb25zdCB0Z3QgPSBlLnRhcmdldDtcbiAgICBpZiAoISh0Z3QgaW5zdGFuY2VvZiBFbGVtZW50KSB8fCB0Z3QgPT09IGxhc3RIb3ZlckVsKSByZXR1cm47XG4gICAgbGFzdEhvdmVyRWwgPSB0Z3Q7XG4gICAgZmlyZUhvdmVyKHRndCk7XG4gIH07XG5cbiAgY29uc3QgaXNJbnNpZGVBbm5vdGF0aW9uID0gKGU6IEV2ZW50KTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ICE9PSAnYmxvY2snKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcGF0aCA9IHR5cGVvZiBlLmNvbXBvc2VkUGF0aCA9PT0gJ2Z1bmN0aW9uJyA/IGUuY29tcG9zZWRQYXRoKCkgOiBbXTtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgcGF0aCkgaWYgKG5vZGUgPT09IGFubm90YXRpb25FbCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIEYuMTgg4oCUIG5ldmVyIGNhcHR1cmUgYW4gZWxlbWVudCB0aGF0J3MgcGFydCBvZiBwaW5jaGdyYWIncyBvd24gVUkuXG4gIC8vIFRoZSBzaGFkb3cgaG9zdCBpcyBgI19fcGluY2hncmFiX292ZXJsYXlgOyBldmVyeXRoaW5nIHBhaW50ZWQgaW5zaWRlXG4gIC8vIChyaW5ncywgcnViYmVyIGJhbmQsIG5vb2RsZSBTVkcsIGFubm90YXRpb24gdGV4dGFyZWEpIGxpdmVzIGluIGl0c1xuICAvLyBzaGFkb3cgcm9vdC4gT3Blbi1tb2RlIHNoYWRvdyArIGNvbXBvc2VkUGF0aCgpIGxldHMgdXMgc2VlIHRoZSByZWFsXG4gIC8vIHRhcmdldCBldmVuIHdoZW4gZXZlbnQgcmV0YXJnZXRpbmcgaXMgaW4gcGxheSwgc28gd2Ugd2FsayB0aGVcbiAgLy8gY29tcG9zZWQgcGF0aCBsb29raW5nIGZvciB0aGUgaG9zdC4gVGhlIGNoZWFwIGlkIGNoZWNrIHN0aWxsIHJ1bnNcbiAgLy8gZmlyc3QgYXMgYSBmYXN0IHBhdGguXG4gIGNvbnN0IGlzUGluY2hncmFiT3duVWkgPSAoZTogRXZlbnQpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQ7XG4gICAgaWYgKHQgaW5zdGFuY2VvZiBFbGVtZW50ICYmIHQuaWQgPT09ICdfX3BpbmNoZ3JhYl9vdmVybGF5JykgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgcGF0aCA9IHR5cGVvZiBlLmNvbXBvc2VkUGF0aCA9PT0gJ2Z1bmN0aW9uJyA/IGUuY29tcG9zZWRQYXRoKCkgOiBbXTtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgcGF0aCkge1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUuaWQgPT09ICdfX3BpbmNoZ3JhYl9vdmVybGF5JykgcmV0dXJuIHRydWU7XG4gICAgICBpZiAobm9kZSA9PT0gb3ZlcmxheUhvc3QpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3Qgb25Nb3VzZURvd24gPSAoZTogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghb3JwaGFuR3VhcmQoKSkgcmV0dXJuO1xuICAgIGlmIChpc0luc2lkZUFubm90YXRpb24oZSkpIHJldHVybjtcbiAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycgJiYgIWFubm90YXRpb24uaXNMb2NrZWQoKSkgYW5ub3RhdGlvbi5oaWRlKCk7XG4gICAgaWYgKCFwaW5jaEVuZ2FnZWQoZS5hbHRLZXkpIHx8IGRyYWdTdGFydCkgcmV0dXJuO1xuICAgIGlmIChpc1BpbmNoZ3JhYk93blVpKGUpKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZHJhZ1N0YXJ0ID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcbiAgICBjb25zb2xlLmxvZyhMT0csICdkcmFnIGFybWVkIGF0JywgZHJhZ1N0YXJ0KTtcbiAgfTtcblxuICBjb25zdCBvbk1vdXNlVXAgPSAoZTogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghZHJhZ1N0YXJ0KSByZXR1cm47XG4gICAgY29uc3Qgc3RhcnQgPSBkcmFnU3RhcnQ7XG4gICAgY29uc3Qgd2FzRHJhZyA9IEJvb2xlYW4oZHJhZ1JlY3QpO1xuICAgIGRyYWdTdGFydCA9IG51bGw7XG4gICAgdGVhcmRvd25EcmFnUmVjdCgpO1xuICAgIGlmICghd2FzRHJhZykge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZHJhZyB0b28gc2hvcnQsIHRyZWF0ZWQgYXMgc2luZ2xlIGNsaWNrJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHN1cHByZXNzTmV4dENsaWNrID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgc3VwcHJlc3NOZXh0Q2xpY2sgPSBmYWxzZTsgfSwgMjAwKTtcbiAgICBjb25zdCBtb2RlOiAncGFydGlhbCcgfCAnZnVsbCcgPSBlLmNsaWVudFggPj0gc3RhcnQueCA/ICdmdWxsJyA6ICdwYXJ0aWFsJztcbiAgICAvLyBVc2UgdGhlIFNBTUUgY2FuZGlkYXRlIHBvb2wgdGhhdCB3YXMgbG9ja2VkIGF0IGRyYWcgc3RhcnQgc28gdGhlXG4gICAgLy8gY29tbWl0dGVkIHNldCBtYXRjaGVzIHdoYXQgdGhlIHVzZXIgc2F3IGhpZ2hsaWdodGVkIG1vbWVudHMgYmVmb3JlLlxuICAgIGNvbnN0IHBvb2xGb3JDb21taXQgPSBkcmFnQ2FuZGlkYXRlcy5sZW5ndGggPyBkcmFnQ2FuZGlkYXRlcyA6IHBpY2tEcmFnQ2FuZGlkYXRlcyhvdmVybGF5SG9zdCk7XG4gICAgY29uc3QgZWxzID0gZWxlbWVudHNJblJlY3QocG9vbEZvckNvbW1pdCwgc3RhcnQueCwgc3RhcnQueSwgZS5jbGllbnRYLCBlLmNsaWVudFksIG1vZGUpO1xuICAgIGNvbnNvbGUubG9nKExPRywgYGRyYWcgRU5EIOKAlCBtb2RlPSR7bW9kZX0g4oCUIFNUQUdJTkcgKE5PVCBjb21taXR0aW5nKWAsIGVscy5sZW5ndGgsICdlbGVtZW50czonLCBlbHMubWFwKGNvbXBhY3RUYXJnZXQpKTtcbiAgICAvLyBEcmFnIG1pcnJvcnMgQWx0K1NoaWZ0K0NsaWNrIOKAlCBldmVyeSBlbGVtZW50IHN0YWdlcyBpbnRvIHRoZSBwZW5kaW5nXG4gICAgLy8gYmF5LiBUaGUgdXNlciBNVVNUIGNsaWNrIFwiQ29tbWl0IGdyb3VwXCIgaW4gdGhlIHNpZGUgcGFuZWwgdG8gZmluYWxpemU7XG4gICAgLy8gdGhlcmUgaXMgbm8gYXV0by1jb21taXQgdGltZXIuXG4gICAgZm9yIChjb25zdCBlbCBvZiBlbHMpIHN0YWdlUGVuZGluZyhlbCk7XG4gIH07XG5cbiAgY29uc3Qgb25DbGljayA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghb3JwaGFuR3VhcmQoKSkgcmV0dXJuO1xuICAgIGlmIChzdXBwcmVzc05leHRDbGljaykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNJbnNpZGVBbm5vdGF0aW9uKGV2ZW50KSkgcmV0dXJuO1xuICAgIGlmICghcGluY2hFbmdhZ2VkKGV2ZW50LmFsdEtleSkpIHJldHVybjtcbiAgICBpZiAoaXNQaW5jaGdyYWJPd25VaShldmVudCkpIHJldHVybjtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHJhdyA9IGV2ZW50LnRhcmdldDtcbiAgICBpZiAoIShyYXcgaW5zdGFuY2VvZiBFbGVtZW50KSkgcmV0dXJuO1xuICAgIC8vIFNuYXAgY2xpY2tzIHRoZSBzYW1lIHdheSBob3ZlciBkb2VzIHNvIHRoZSBjYXB0dXJlZCBlbGVtZW50IG1hdGNoZXNcbiAgICAvLyBleGFjdGx5IHdoYXQgdGhlIG9yYW5nZSByaW5nIHdhcyBhcm91bmQgd2hlbiB0aGUgdXNlciBjbGlja2VkLlxuICAgIGNvbnN0IGVsID0gaG92ZXJTbmFwID8gc25hcFRvQ29tcG9uZW50KHJhdywga25vd25DYXB0dXJlZCkgOiByYXc7XG4gICAgaWYgKGlzSHVnZUVsZW1lbnQoZWwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdza2lwcGluZyBodWdlIGNsaWNrIHRhcmdldDonLCBjb21wYWN0VGFyZ2V0KGVsKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgc3RhZ2VQZW5kaW5nKGVsLCB7Y2xpZW50WDogZXZlbnQuY2xpZW50WCwgY2xpZW50WTogZXZlbnQuY2xpZW50WX0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShlbCwgbmV4dFNlcSgpLCB7XG4gICAgICBjbGlja0F0OiB7Y2xpZW50WDogZXZlbnQuY2xpZW50WCwgY2xpZW50WTogZXZlbnQuY2xpZW50WX0sXG4gICAgfSk7XG4gICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICBjb25zdCBwYWdlID0gYnVpbGRQYWdlQ29udGV4dCgpO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnY2FwdHVyZScsIGVudHJ5LCBwYWdlfSk7XG4gICAgdGVzdENhcHR1cmVzPy5wdXNoKHtlbnRyeSwgcGFnZX0pO1xuICB9O1xuXG4gIC8vIEJpbmQgb24gYm90aCB3aW5kb3cgYW5kIGRvY3VtZW50LiBTb21lIHBhZ2VzIGNhbGwgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXG4gIC8vIG9uIHRoZWlyIG93biBkb2N1bWVudC1sZXZlbCBjYXB0dXJlIGhhbmRsZXIg4oCUIGxpc3RlbmluZyBvbiB3aW5kb3cgcGlja3MgdXBcbiAgLy8gdGhvc2UgZXZlbnRzIGZpcnN0LiBBIDFtcyB0aW1lc3RhbXAgZGVkdXBlIHByZXZlbnRzIGRvdWJsZS1oYW5kbGluZy5cbiAgZm9yIChjb25zdCB0YXJnZXQgb2YgW3dpbmRvdywgZG9jdW1lbnRdKSB7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgfVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2sgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IHtcbiAgICBpZiAoZS50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSBsYXN0Q29udGV4dEVsID0gZS50YXJnZXQ7XG4gIH0sIHRydWUpO1xuXG4gIC8vIEtleWJvYXJkIGxpc3RlbmVycyAocGFnZS1mb2N1c2VkIGNhc2UpLiBOYW1lZCBzbyBkZXN0cm95KCkgY2FuIHJlbW92ZVxuICAvLyB0aGVtIOKAlCB0aGUgb3JwaGFuLXRha2VvdmVyIHBhdGggbXVzdCBsZWF2ZSB6ZXJvIGxpc3RlbmVycyBiZWhpbmQuXG4gIGNvbnN0IG9uS2V5RG93bkFsdCA9IChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFvcnBoYW5HdWFyZCgpKSByZXR1cm47XG4gICAgLy8gRXNjIGxlYXZlcyBzdGlja3kgcGluY2ggbW9kZSAod2hlbiBubyBjb21tZW50IGJveCBpcyBjYXB0dXJpbmcgRXNjKS5cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnICYmIG1hbnVhbFNlbGVjdCAmJiBhbm5vdGF0aW9uRWwuc3R5bGUuZGlzcGxheSAhPT0gJ2Jsb2NrJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2V0U2VsZWN0TW9kZShmYWxzZSwgLyogbm90aWZ5UGFuZWwgKi8gdHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlLmFsdEtleSkge1xuICAgICAgc2V0QWx0QWN0aXZlKHRydWUpO1xuICAgICAgLy8gUHJlLWVtcHQgdGhlIGJyb3dzZXIncyBBbHQg4oaSIG1lbnUtYmFyIGZvY3VzIHNoaWZ0IG9uIFdpbmRvd3MuIElmIHdlXG4gICAgICAvLyBkb24ndCBwcmV2ZW50RGVmYXVsdCBoZXJlLCB0aGUga2V5dXAgdGhhdCBmb2xsb3dzIHdpbGwgc3RlYWwgZm9jdXNcbiAgICAgIC8vIGZyb20gb3VyIG92ZXJsYXkgdGV4dGFyZWEuXG4gICAgICBpZiAoZS5rZXkgPT09ICdBbHQnICYmIGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uS2V5VXBBbHQgPSAoZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghb3JwaGFuR3VhcmQoKSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgIWUuYWx0S2V5KSB7XG4gICAgICAvLyBTYW1lIEFsdC3ihpItbWVudSBzdXBwcmVzc2lvbiBvbiByZWxlYXNlOiBDaHJvbWUgLyBFZGdlIG9uIFdpbmRvd3NcbiAgICAgIC8vIHNoaWZ0IGZvY3VzIHRvIHRoZSBtZW51IGJhciB3aGVuIEFsdCBpcyByZWxlYXNlZCB3aXRob3V0IGFub3RoZXJcbiAgICAgIC8vIGtleSBpbnRlcnZlbmluZy4gQmxvY2sgaXQgc28gb3VyIHRleHRhcmVhIGtlZXBzIGZvY3VzLlxuICAgICAgaWYgKGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBhbHRGb3J3YXJkZWQgPSBmYWxzZTtcbiAgICAgIC8vIFN0aWNreSBwaW5jaCBtb2RlIGtlZXBzIHRoZSByaW5nIGVuZ2FnZWQgYWZ0ZXIgQWx0IGlzIHJlbGVhc2VkLlxuICAgICAgaWYgKCFtYW51YWxTZWxlY3QpIHNldEFsdEFjdGl2ZShmYWxzZSk7XG4gICAgICAvLyBObyBhdXRvLWNvbW1pdCB0aW1lciDigJQgdGhlIHVzZXIgZXhwbGljaXRseSBjbGlja3MgXCJDb21taXQgZ3JvdXBcIlxuICAgICAgLy8gaW4gdGhlIHNpZGUtcGFuZWwgcGVuZGluZyBiYXkgKG9yIEVzYyB0byBjYW5jZWwpLlxuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25XaW5kb3dCbHVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGFsdEZvcndhcmRlZCA9IGZhbHNlO1xuICAgIC8vIFN0aWNreSBwaW5jaCBtb2RlIHN1cnZpdmVzIGEgYmx1ciAoY2xpY2tpbmcgaW50byB0aGUgc2lkZSBwYW5lbCkg4oCUXG4gICAgLy8gb3RoZXJ3aXNlIHN3aXRjaGluZyB0byB0aGUgcGFuZWwgd291bGQgc2lsZW50bHkgZGlzZW5nYWdlIGl0LlxuICAgIGlmICghbWFudWFsU2VsZWN0KSBzZXRBbHRBY3RpdmUoZmFsc2UpO1xuICAgIC8vIE5vdGU6IGRvbid0IGNhbmNlbCBwZW5kaW5nTXVsdGkg4oCUIGNsaWNraW5nIHRoZSBzaWRlLXBhbmVsIGNvbW1pdCBidXR0b25cbiAgICAvLyBibHVycyB0aGUgaG9zdCBwYWdlIGFuZCB3ZSdkIGxvc2UgdGhlIHN0YWdpbmcgc3RhdGUgcmlnaHQgYmVmb3JlIGNvbW1pdC5cbiAgfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd25BbHQsIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwQWx0LCB0cnVlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbldpbmRvd0JsdXIsIHRydWUpO1xuXG4gIC8vIOKUgOKUgOKUgCBTaWRlLXBhbmVsIGNvbW1hbmRzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzYWZlUXVlcnkgPSAoc2VsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBFbGVtZW50IHwgbnVsbCA9PiB7XG4gICAgdHJ5IHsgcmV0dXJuIHNlbCA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKSA6IG51bGw7IH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUNvbW1hbmQgPSAobXNnOiBQZ0VudmVsb3BlPFBhbmVsVG9Dcz4sIHJlc3BvbmQ6IChyOiBhbnkpID0+IHZvaWQpOiBib29sZWFuID0+IHtcbiAgICBzd2l0Y2ggKG1zZy5raW5kKSB7XG4gICAgICBjYXNlICdvdXRsaW5lJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoZWwpIHRyYWNrRWxlbWVudCgnZnJvbS1wYW5lbCcsIGVsLCB7bGFiZWw6IGNvbXBhY3RUYXJnZXQoZWwpLCBnb2xkOiBtc2cuZ29sZCwgZGFzaGVkOiBtc2cuZGFzaGVkfSk7XG4gICAgICAgIGVsc2UgcmVtb3ZlUmluZygnZnJvbS1wYW5lbCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdvdXRsaW5lLWNsZWFyJzpcbiAgICAgICAgcmVtb3ZlUmluZygnZnJvbS1wYW5lbCcpO1xuICAgICAgICByZW1vdmVSaW5nKCdtdWx0aScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdvdXRsaW5lLW11bHRpJzoge1xuICAgICAgICByZW1vdmVSaW5nKCdtdWx0aScpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3Qgc2VsIG9mIG1zZy5zZWxlY3RvcnMpIHtcbiAgICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShzZWwpO1xuICAgICAgICAgIGlmIChlbCkgdHJhY2tFbGVtZW50KGBtdWx0aToke2krK31gLCBlbCwge2dvbGQ6IHRydWV9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdvdXRsaW5lLW11bHRpLWNsZWFyJzoge1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLnJpbmdzLmtleXMoKV0pIGlmIChrLnN0YXJ0c1dpdGgoJ211bHRpOicpKSByZW1vdmVSaW5nKGspO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdzY3JvbGwtdG8nOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghZWwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gYG5lYXJlc3RgIGlzIGRlbGliZXJhdGU6IGhvdmVyaW5nIGEgY29tbWVudCBtdXN0IE5PVCB5YW5rIGFuXG4gICAgICAgIC8vIGFscmVhZHktdmlzaWJsZSBlbGVtZW50IHRvIHNjcmVlbiBjZW50ZXIgKHRoZSBqYXJyaW5nIHNjcm9sbCB0aGVcbiAgICAgICAgLy8gb3BlcmF0b3IgZmxhZ2dlZCkuIEl0IG9ubHkgc2Nyb2xscyB3aGVuIHRoZSBlbGVtZW50IGlzIG9mZi1zY3JlZW4uXG4gICAgICAgIC8vIFRoZSBsb3VkIFwiZmluZCB0aGlzXCIgcGF0aHMgKGxvY2F0ZS1mbGFzaCwgbG9nLWVsZW1lbnQpIGtlZXAgY2VudGVyLlxuICAgICAgICBlbC5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ25lYXJlc3QnLCBpbmxpbmU6ICduZWFyZXN0J30pO1xuICAgICAgICBpZiAobXNnLnN0aWNreSkgdHJhY2tFbGVtZW50KCdzdGlja3knLCBlbCwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKSwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICBlbHNlIGZsYXNoRWxlbWVudChlbCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2xvY2F0ZS1mbGFzaCc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsb2NhdGVGbGFzaChlbCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3N0aWNreS1jbGVhcic6XG4gICAgICAgIHJlbW92ZVJpbmcoJ3N0aWNreScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHtcbiAgICAgICAgY29uc3QgdmFsaWQ6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qgc2VsIG9mIG1zZy5zZWxlY3RvcnMpIHtcbiAgICAgICAgICB0cnkgeyB2YWxpZFtzZWxdID0gQm9vbGVhbihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCkpOyB9IGNhdGNoIHsgdmFsaWRbc2VsXSA9IGZhbHNlOyB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uZCh7dmFsaWR9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdsb2ctZWxlbWVudCc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbCkgeyByZXNwb25kKHtvazogZmFsc2V9KTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgdHJ5IHsgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXBpbmNoZ3JhYi1pZCcsIFN0cmluZyhtc2cubiA/PyAnJykpOyB9IGNhdGNoIHsgLyogc2FuZGJveCAqLyB9XG4gICAgICAgIGNvbnNvbGUubG9nKCclY1tQaW5jaEdyYWJdIGVsZW1lbnQ6JywgJ2NvbG9yOiNmZjVmMDA7Zm9udC13ZWlnaHQ6NzAwOycsIGVsLFxuICAgICAgICAgIGBcXG4gIOKAoiBSaWdodC1jbGljayDihpIgUmV2ZWFsIGluIEVsZW1lbnRzIHBhbmVsXFxuICDigKIgT3IgaW4gRGV2VG9vbHMgY29uc29sZTogJCgnW2RhdGEtcGluY2hncmFiLWlkPVwiJHttc2cubiA/PyAnJ31cIl0nKWApO1xuICAgICAgICBlbC5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcid9KTtcbiAgICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgICAgcmVzcG9uZCh7b2s6IHRydWUsIHNuaXBwZXQ6IGAkKCcke21zZy5zZWxlY3Rvcn0nKWB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdyZWNhcHR1cmUnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghZWwpIHsgcmVzcG9uZCh7b2s6IGZhbHNlLCByZWFzb246ICdub3QtZm91bmQnfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBtc2cubiA/PyBuZXh0U2VxKCkpO1xuICAgICAgICByZXNwb25kKHtvazogdHJ1ZSwgZW50cnksIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2NhcHR1cmUtYW5jZXN0b3InOiB7XG4gICAgICAgIC8vIFdhbGsgdXAgYGRlcHRoYCBhbmNlc3RvciBsZXZlbHMgZnJvbSB0aGUgb3JpZ2luYWwgc2VsZWN0b3IgYW5kXG4gICAgICAgIC8vIGNhcHR1cmUgdGhhdCBlbGVtZW50LiBVc2VkIGJ5IHRoZSBhbmNlc3Rvci1icmVhZGNydW1iIGNoaXBzIGluXG4gICAgICAgIC8vIHRoZSBzaWRlLXBhbmVsIGJ1YmJsZSBzbyB0aGUgdXNlciBjYW4gZXNjYWxhdGUgXCJJIG1lYW50IHRoZSBjYXJkLFxuICAgICAgICAvLyBub3QgdGhlIGgzIGluc2lkZSBpdFwiIHdpdGhvdXQgcmUtY2xpY2tpbmcgb24gdGhlIHBhZ2UuXG4gICAgICAgIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghY3VyKSB7IHJlc3BvbmQoe29rOiBmYWxzZSwgcmVhc29uOiAnbm90LWZvdW5kJ30pOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5kZXB0aCAmJiBjdXIgJiYgY3VyLnBhcmVudEVsZW1lbnQgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5OyBpKyspIHtcbiAgICAgICAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWN1ciB8fCBpc0h1Z2VFbGVtZW50KGN1cikpIHsgcmVzcG9uZCh7b2s6IGZhbHNlLCByZWFzb246ICd0b28tbGFyZ2UnfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGN1ciwgbmV4dFNlcSgpKTtcbiAgICAgICAgZmxhc2hFbGVtZW50KGN1cik7XG4gICAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnY2FwdHVyZScsIGVudHJ5LCBwYWdlOiBidWlsZFBhZ2VDb250ZXh0KCl9KTtcbiAgICAgICAgcmVzcG9uZCh7b2s6IHRydWUsIGVudHJ5fSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY2FzZSAnb3V0bGluZS1hbmNlc3Rvcic6IHtcbiAgICAgICAgLy8gUHJldmlldyB0aGUgTnRoIGFuY2VzdG9yIOKAlCBzYW1lIHdhbGsgYXMgY2FwdHVyZS1hbmNlc3RvciBidXRcbiAgICAgICAgLy8gb3V0bGluZXMgdGhlIHJlc3VsdCB3aXRoIHRoZSBleGlzdGluZyBnb2xkLXJpbmcgdHJhY2tlciBpbnN0ZWFkXG4gICAgICAgIC8vIG9mIGNhcHR1cmluZy4gU2lkZSBwYW5lbCBjYWxscyB0aGlzIG9uIGhvdmVyIG9mIGEgYnJlYWRjcnVtYiBjaGlwLlxuICAgICAgICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWN1cikgcmV0dXJuIGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5kZXB0aCAmJiBjdXIgJiYgY3VyLnBhcmVudEVsZW1lbnQgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5OyBpKyspIHtcbiAgICAgICAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWN1ciB8fCBpc0h1Z2VFbGVtZW50KGN1cikpIHtcbiAgICAgICAgICByZW1vdmVSaW5nKCdmcm9tLXBhbmVsJyk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRyYWNrRWxlbWVudCgnZnJvbS1wYW5lbCcsIGN1ciwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGN1ciksIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnYWx0LXN0YXRlJzpcbiAgICAgICAgYWx0Rm9yd2FyZGVkID0gbXNnLm9uO1xuICAgICAgICBzZXRBbHRBY3RpdmUobXNnLm9uKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnc2VsZWN0LW1vZGUnOlxuICAgICAgICBzZXRTZWxlY3RNb2RlKG1zZy5vbik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ21hbnVhbC1jYXB0dXJlJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWVsKSB7IHJlc3BvbmQoe29rOiBmYWxzZSwgcmVhc29uOiAnbm90LWZvdW5kJ30pOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShlbCwgbXNnLm4gPz8gbmV4dFNlcSgpKTtcbiAgICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgICByZXNwb25kKHtvazogdHJ1ZSwgZW50cnl9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdhbm5vdGF0aW9uJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoZWwpIGFubm90YXRpb24uc2hvdyhlbCwgey4uLihtc2cucGF5bG9hZCA/PyB7fSksIHNlbGVjdG9yOiBtc2cuc2VsZWN0b3J9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnYW5ub3RhdGlvbi1jbGVhcic6XG4gICAgICAgIGFubm90YXRpb24uaGlkZSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdwZW5kaW5nLWNhbmNlbCc6XG4gICAgICAgIGNhbmNlbFBlbmRpbmdNdWx0aSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdwZW5kaW5nLWNvbW1pdCc6XG4gICAgICAgIGNvbW1pdFBlbmRpbmdNdWx0aSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdjb250ZXh0LWNhcHR1cmUnOiB7XG4gICAgICAgIGlmIChsYXN0Q29udGV4dEVsKSB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkobGFzdENvbnRleHRFbCwgbmV4dFNlcSgpKTtcbiAgICAgICAgICBmbGFzaEVsZW1lbnQobGFzdENvbnRleHRFbCk7XG4gICAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NldC1jYXB0dXJlZCc6XG4gICAgICAgIGtub3duQ2FwdHVyZWQgPSBuZXcgU2V0KG1zZy5zZWxlY3RvcnMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdwYWdlLWh0bWwnOlxuICAgICAgICAvLyBTZXJpYWxpemVkIG9uIGRlbWFuZCBhdCBleHBvcnQgdGltZTsgbm90aGluZyBjYWNoZWQgcGFnZS1zaWRlLlxuICAgICAgICByZXNwb25kKHtvazogdHJ1ZSwgdXJsOiBsb2NhdGlvbi5ocmVmLCB0aXRsZTogZG9jdW1lbnQudGl0bGUsIGh0bWw6ICc8IURPQ1RZUEUgaHRtbD5cXG4nICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm91dGVySFRNTH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ3NldC1jcy1wcmVmcyc6XG4gICAgICAgIGlmICh0eXBlb2YgbXNnLnNwYWNpbmdPdmVybGF5ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBzcGFjaW5nT3ZlcmxheSA9IG1zZy5zcGFjaW5nT3ZlcmxheTtcbiAgICAgICAgICBpZiAoIXNwYWNpbmdPdmVybGF5KSBjbGVhclNwYWNpbmdPdmVybGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBtc2cuaG92ZXJTbmFwID09PSAnYm9vbGVhbicpIGhvdmVyU25hcCA9IG1zZy5ob3ZlclNuYXA7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ2hpZGUtb3ZlcmxheXMnOiB7XG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tcGxhaW50OiBQaW5jaEdyYWIgcmluZ3MvYm9yZGVycyB3ZXJlIHN0aWxsIHZpc2libGVcbiAgICAgICAgLy8gaW4gdGhlIGNhcHR1cmVkIFBORy4gUm9vdCBjYXVzZTogdGhlIG1lc3NhZ2UgaGFuZGxlciB1c2VkIHRvXG4gICAgICAgIC8vIGFjayBzeW5jaHJvbm91c2x5IHRoZSBtb21lbnQgd2Ugc2V0IGB2aXNpYmlsaXR5OiBoaWRkZW5gLCBidXRcbiAgICAgICAgLy8gdGhlIGJyb3dzZXIncyBjb21wb3NpdG9yIGhhZG4ndCB5ZXQgcGFpbnRlZCB0aGF0IGZyYW1lLCBzb1xuICAgICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlZCBhZ2FpbnN0IGEgc3RpbGwtY29tcG9zaXRlZCBvdmVybGF5LlxuICAgICAgICAvL1xuICAgICAgICAvLyBGaXg6IHN3aXRjaCB0byBgZGlzcGxheTogbm9uZWAgKHJpcHMgaXQgb3V0IG9mIGxheW91dCBlbnRpcmVseVxuICAgICAgICAvLyDigJQgc3Ryb25nZXIgZ3VhcmFudGVlIHRoYW4gdmlzaWJpbGl0eTpoaWRkZW4pLCBmb3JjZSBhIGxheW91dFxuICAgICAgICAvLyBmbHVzaCwgYW5kIHdhaXQgZm9yIFRXTyBhbmltYXRpb24gZnJhbWVzIGJlZm9yZSBhY2tpbmcuIFR3b1xuICAgICAgICAvLyBSQUZzIGlzIHRoZSBzdGFuZGFyZCBcIm5leHQgcGFpbnQgaGFzIGhhcHBlbmVkXCIgc2lnbmFsIGluXG4gICAgICAgIC8vIGJyb3dzZXJzLlxuICAgICAgICAvL1xuICAgICAgICAvLyBJdGVtIDE3IChmbGFzaGluZyk6IGFsc28gRlJFRVpFIHRoZSByaW5nIHJBRiBsb29wcyBmb3IgdGhlIHdob2xlXG4gICAgICAgIC8vIGNhcHR1cmUgd2luZG93LiBUaGUgYmFja2dyb3VuZCBoaWRlcyBvdmVybGF5cyBCRUZPUkUgaXQgc2Nyb2xsc1xuICAgICAgICAvLyB0aGUgcGFnZSB0byBmcmFtZSB0aGUgY2FwdHVyZTsgaWYgdGhlIGxvb3BzIGtlcHQgcnVubmluZyB0aGV5J2RcbiAgICAgICAgLy8gY2hhc2UgdGhlIHNjcm9sbCBvZmZzZXQgKGEgdmlzaWJsZSBqdW1wKSBhbmQgcmVwYWludCBhIGJ1cnN0IHdoZW5cbiAgICAgICAgLy8gdGhlIGhvc3QgaXMgc2hvd24gYWdhaW4uIEZyb3plbiArIGRpc3BsYXk6bm9uZSA9IHRoZSByaW5ncyBob2xkXG4gICAgICAgIC8vIHRoZWlyIGxhc3QgZnJhbWUgYW5kIHRoZXJlIGlzIG5vdGhpbmcgdG8gZmxpY2tlci4gVGhlIGFubm90YXRpb25cbiAgICAgICAgLy8gYm94IGZyZWV6ZXMgaW1wbGljaXRseSAoaXRzIGFuY2hvciB3YXRjaGRvZyBvbmx5IHJlcG9zaXRpb25zLCBhbmRcbiAgICAgICAgLy8gdGhlIGhvc3QgaXMgaGlkZGVuKSwgc28gbm8gZXh0cmEgaGFuZGxpbmcgaXMgbmVlZGVkIHRoZXJlLlxuICAgICAgICBvdmVybGF5RnJvemVuID0gdHJ1ZTtcbiAgICAgICAgZnJlZXplUmluZ3MoKTtcbiAgICAgICAgb3ZlcmxheUhvc3Quc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgLy8gRm9yY2UgbGF5b3V0IGZsdXNoIHNvIHRoZSBjaGFuZ2UgdGFrZXMgZWZmZWN0LlxuICAgICAgICB2b2lkIG92ZXJsYXlIb3N0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXNwb25kKHtvazogdHJ1ZX0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2hvdy1vdmVybGF5cyc6IHtcbiAgICAgICAgb3ZlcmxheUhvc3Quc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICBvdmVybGF5SG9zdC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAvLyBSZS1lbnRlciB0aGUgdG9wIGxheWVyOiB0aGUgY2FwdHVyZSB3aW5kb3cgKG9yIHRoZSBwYWdlKSBtYXkgaGF2ZVxuICAgICAgICAvLyBkaXNtaXNzZWQgb3VyIHBvcG92ZXIgd2hpbGUgdGhlIGhvc3Qgd2FzIGRpc3BsYXk6bm9uZS5cbiAgICAgICAgcHJvbW90ZVRvVG9wTGF5ZXIoKTtcbiAgICAgICAgLy8gVGhhdzogcmUtYXJtIGV2ZXJ5IHJpbmcgbG9vcCBpbiBhIHNpbmdsZSBiYXRjaCBzbyB0aGV5IHNuYXAgdG8gdGhlXG4gICAgICAgIC8vIChub3cgcmVzdG9yZWQpIHNjcm9sbCBwb3NpdGlvbiBvbiB0aGUgU0FNRSBmcmFtZSDigJQgb25lIGNsZWFuXG4gICAgICAgIC8vIHJlcG9zaXRpb24gaW5zdGVhZCBvZiBhIHN0YWdnZXJlZCByZXBhaW50IGNhc2NhZGUuXG4gICAgICAgIG92ZXJsYXlGcm96ZW4gPSBmYWxzZTtcbiAgICAgICAgdGhhd1JpbmdzKCk7XG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgSVBDIGJyaWRnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZnVuY3Rpb24gc2VuZFRvUGFuZWwocGF5bG9hZDogQ3NUb1BhbmVsKTogdm9pZCB7XG4gICAgY29uc3QgbXNnID0gcGcocGF5bG9hZCk7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICB0cnkgeyB2b2lkIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1zZykuY2F0Y2g/LigoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTsgfVxuICAgICAgY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRyeSB7IHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLXBhbmVsJywge2RldGFpbDogbXNnfSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gICAgLy8gSXRlbSAxODogdGhlIGZpcnN0IGNhcHR1cmUgb24gYSBnaXZlbiBwYWdlIFVSTCB0cmlnZ2VycyBhIG9uZS10aW1lXG4gICAgLy8gZnVsbC1wYWdlIHNuYXBzaG90IChzY3JlZW5zaG90ICsgbWV0YWRhdGEpIHJvdXRlZCB0byB0aGUgcGFuZWwuIERlZHVwXG4gICAgLy8gaXMgYnkgVVJMIGluc2lkZSBtYXliZVNuYXBzaG90UGFnZS5cbiAgICBpZiAocGF5bG9hZC5raW5kID09PSAnY2FwdHVyZScpIHZvaWQgbWF5YmVTbmFwc2hvdFBhZ2UocGF5bG9hZC5wYWdlLnVybCk7XG4gIH1cblxuICAvLyDilIDilIDilIAgUGFnZS1zbmFwc2hvdCAoaXRlbSAxOCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJvdW5kLXRyaXAgcmVxdWVzdCB0byB0aGUgYmFja2dyb3VuZCB3b3JrZXIgKHdoaWNoIG93bnMgY2FwdHVyZVZpc2libGVUYWIpLlxuICAvLyBSZXNvbHZlcyB0byB0aGUgcmVwbHkgb2JqZWN0LCBvciBudWxsIG9uIGFueSBmYWlsdXJlIC8gbm9uLWV4dGVuc2lvbiBtb2RlLlxuICBjb25zdCByZXF1ZXN0QmcgPSA8Uj4ocGF5bG9hZDoge2tpbmQ6IHN0cmluZ30gJiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IFByb21pc2U8UiB8IG51bGw+ID0+XG4gICAgbmV3IFByb21pc2U8UiB8IG51bGw+KChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAoIWluRXh0ZW5zaW9uKSB7IHJlc29sdmUobnVsbCk7IHJldHVybjsgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UocGcocGF5bG9hZCBhcyBhbnkpLCAocmVwbHk6IFIpID0+IHtcbiAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7IHJlc29sdmUobnVsbCk7IHJldHVybjsgfVxuICAgICAgICAgIHJlc29sdmUoKHJlcGx5ID8/IG51bGwpIGFzIFIgfCBudWxsKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHsgcmVzb2x2ZShudWxsKTsgfVxuICAgIH0pO1xuXG4gIC8vIERlZHVwIHNldDogYXQgbW9zdCBvbmUgcGFnZS1zbmFwc2hvdCBwZXIgZGlzdGluY3QgVVJMIHBlciBwYWdlIHNlc3Npb24uXG4gIGNvbnN0IHNuYXBzaG90dGVkVXJscyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgc25hcHNob3RJbkZsaWdodCA9IGZhbHNlO1xuICBjb25zdCBtYXliZVNuYXBzaG90UGFnZSA9IGFzeW5jICh1cmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHJldHVybjsgICAgICAgICAgICAvLyB2aWV3cG9ydCBjYXB0dXJlIG5lZWRzIHRoZSB3b3JrZXJcbiAgICBpZiAoc25hcHNob3R0ZWRVcmxzLmhhcyh1cmwpKSByZXR1cm47XG4gICAgaWYgKHNuYXBzaG90SW5GbGlnaHQpIHJldHVybjsgICAgICAgIC8vIHNlcmlhbGl6ZTsgdGhlIG5leHQgY2FwdHVyZSByZXRyaWVzXG4gICAgc25hcHNob3R0ZWRVcmxzLmFkZCh1cmwpOyAgICAgICAgICAgIC8vIG9wdGltaXN0aWMg4oCUIGF2b2lkcyBhIGR1cGxpY2F0ZSBidXJzdFxuICAgIHNuYXBzaG90SW5GbGlnaHQgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICAvLyBNZXRhZGF0YSBpcyByZWFkIG9uIHRoZSBwYWdlIHNpZGUgKHRoZSB3b3JrZXIgY2FuJ3Qgc2VlIHRoZSBET00pLlxuICAgICAgLy8gY2FwdHVyZWRBdCBpcyBzdGFtcGVkIGJlZm9yZSB0aGUgKHNsb3dlcikgc2NyZWVuc2hvdCByZXF1ZXN0IHNvIGl0XG4gICAgICAvLyByZWZsZWN0cyB3aGVuIHRoZSBzbmFwc2hvdCB3YXMgaW5pdGlhdGVkLlxuICAgICAgY29uc3QgY2FwdHVyZWRBdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgIGNvbnN0IG1ldGEgPSB7XG4gICAgICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICB2aWV3cG9ydDoge3dpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCwgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHR9LFxuICAgICAgICBzY3JvbGxXaWR0aDogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoLCBkb2N1bWVudC5ib2R5Py5zY3JvbGxXaWR0aCA/PyAwKSxcbiAgICAgICAgc2Nyb2xsSGVpZ2h0OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0LCBkb2N1bWVudC5ib2R5Py5zY3JvbGxIZWlnaHQgPz8gMCksXG4gICAgICAgIGRldmljZVBpeGVsUmF0aW86IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgICAgIGxhbmc6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nIHx8IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnJyxcbiAgICAgIH07XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHJlcXVlc3RCZzxQYWdlU25hcHNob3RSZXBseT4oe2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnfSk7XG4gICAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuc2NyZWVuc2hvdCkge1xuICAgICAgICAvLyBDYXB0dXJlIGZhaWxlZCDigJQgZHJvcCB0aGUgZGVkdXAgZW50cnkgc28gYSBsYXRlciBjYXB0dXJlIG9uIHRoaXNcbiAgICAgICAgLy8gVVJMIGNhbiByZXRyeSByYXRoZXIgdGhhbiBwZXJtYW5lbnRseSBza2lwcGluZyB0aGUgc25hcHNob3QuXG4gICAgICAgIHNuYXBzaG90dGVkVXJscy5kZWxldGUodXJsKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgc25hcHNob3Q6IFBhZ2VTbmFwc2hvdCA9IHtcbiAgICAgICAgLi4ubWV0YSxcbiAgICAgICAgY2FwdHVyZWRBdCxcbiAgICAgICAgc2NyZWVuc2hvdDogcmVwbHkuc2NyZWVuc2hvdCxcbiAgICAgICAgLi4uKHJlcGx5LnBhcnRpYWwgPyB7cGFydGlhbDogdHJ1ZX0gOiB7fSksXG4gICAgICB9O1xuICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdwYWdlLXNuYXBzaG90JywgcGF5bG9hZDogc25hcHNob3R9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNuYXBzaG90dGVkVXJscy5kZWxldGUodXJsKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc25hcHNob3RJbkZsaWdodCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZzogYW55LCBfc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChtc2cgJiYgbXNnLl9fcGcgPT09IHRydWUpIHJldHVybiBoYW5kbGVDb21tYW5kKG1zZyBhcyBQZ0VudmVsb3BlPFBhbmVsVG9Dcz4sIHNlbmRSZXNwb25zZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjp0by1jcycsIChlOiBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgbXNnID0gKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbDtcbiAgICAgIGNvbnN0IHJlcUlkID0gbXNnPy5fX3JlcUlkO1xuICAgICAgbGV0IHJlc3BvbmRlZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcmVzcG9uZCA9IChyZXBseTogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgICAgICBpZiAocmVzcG9uZGVkKSByZXR1cm47XG4gICAgICAgIHJlc3BvbmRlZCA9IHRydWU7XG4gICAgICAgIGlmIChyZXFJZCkgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCB7ZGV0YWlsOiB7X19yZXFJZDogcmVxSWQsIHJlcGx5fX0pKTtcbiAgICAgIH07XG4gICAgICBoYW5kbGVDb21tYW5kKG1zZywgcmVzcG9uZCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgUmVjZW50LVRhYiB0cmFja2VyIChmb3IgYWN0aXZlRm9jdXMucmVjZW50bHlUYWJiZWQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBUaGUgcGFnZS1jb250ZXh0IGFjdGl2ZUZvY3VzIGZpZWxkIGZsYWdzIGZvY3VzIGFzIFwia2V5Ym9hcmQtZHJpdmVuXCJcbiAgLy8gd2hlbiB0aGUgdXNlciBwcmVzc2VkIFRhYiAvIFNoaWZ0K1RhYiBpbiB0aGUgbGFzdCBzZWNvbmQuIFVzZWZ1bCBmb3JcbiAgLy8gYTExeSBidWcgY2FwdHVyZXMgd2hlcmUgdGhlIHZpc3VhbCBpc3N1ZSBvbmx5IHNob3dzIHVwIHdoaWxlXG4gIC8vIHRhYmJpbmcsIG5vdCBvbiBjbGljay4gV2UgY2FwdHVyZSBpbiB0aGUgY2FwdHVyZSBwaGFzZSBzbyBhIHBhZ2Unc1xuICAvLyBvd24ga2V5ZG93biBoYW5kbGVyIGNhbid0IHN1cHByZXNzIHVzLlxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgPT09ICdUYWInKSBub3RlVGFiUHJlc3NlZCgpO1xuICB9LCB0cnVlKTtcblxuICAvLyDilIDilIDilIAgUHJlZmVyZW5jZS1jaGFuZ2UgbGlzdGVuZXIgKGRhcmstbW9kZSB0b2dnbGUsIG1vdGlvbiBwcmVmKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQnJvd3NlcnMgZW1pdCBgY2hhbmdlYCBldmVudHMgb24gYSBNZWRpYVF1ZXJ5TGlzdCB3aGVuIHRoZSBPUyAvIHBhZ2VcbiAgLy8gc2V0dGluZyBmbGlwcy4gV2UgZm9yd2FyZCB0byB0aGUgcGFuZWwgc28gdGhlIGV4cG9ydCdzIGNocm9ub2xvZ3lcbiAgLy8gY2FwdHVyZXMgdGhlIG1vbWVudCB0aGUgdXNlciBzd2l0Y2hlZCBtb2RlcyDigJQgd2l0aG91dCBpdCwgY2FwdHVyZXNcbiAgLy8gYmVmb3JlIGFuZCBhZnRlciB0aGUgZmxpcCBtaXggYXBwZWFyYW5jZSB2YWx1ZXMgd2l0aCBubyBzaWduYWwgYXMgdG9cbiAgLy8gd2hpY2ggbW9kZSB3YXMgYWN0aXZlLlxuICBjb25zdCB3aXJlUHJlZmVyZW5jZUxpc3RlbmVycyA9ICgpOiB2b2lkID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3MgPSBtYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJyk7XG4gICAgICBjb25zdCBtb3Rpb24gPSBtYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpO1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSAocmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbicpOiB2b2lkID0+IHtcbiAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZScsIHJlYXNvbiwgcGFnZTogYnVpbGRQYWdlQ29udGV4dCgpfSk7XG4gICAgICB9O1xuICAgICAgY3MuYWRkRXZlbnRMaXN0ZW5lcj8uKCdjaGFuZ2UnLCAoKSA9PiBvbkNoYW5nZSgnY29sb3Itc2NoZW1lJykpO1xuICAgICAgbW90aW9uLmFkZEV2ZW50TGlzdGVuZXI/LignY2hhbmdlJywgKCkgPT4gb25DaGFuZ2UoJ3JlZHVjZWQtbW90aW9uJykpO1xuICAgIH0gY2F0Y2ggeyAvKiBvbGQgYnJvd3NlciAvIG1hdGNoTWVkaWEgdW5hdmFpbGFibGUgKi8gfVxuICB9O1xuICB3aXJlUHJlZmVyZW5jZUxpc3RlbmVycygpO1xuXG4gIC8vIOKUgOKUgOKUgCBET00tbXV0YXRpb24gcmluZyBidWZmZXIgZm9yIGNhcHR1cmUgcmVwcm8gY29udGV4dCAowqc0LjgpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBQYWdlcyB3aXRoIGFjdGl2ZSBhbmltYXRpb24vcG9sbGluZyBjYW4gY2h1cm4gdGhyb3VnaCBodW5kcmVkcyBvZlxuICAvLyBtdXRhdGlvbnMgcGVyIHNlY29uZDsgd2UgY2FwIG1lbW9yeSBhdCBNVVRBVElPTl9CVUZGRVJfQ0FQIHJlY29yZHNcbiAgLy8gYW5kIG9ubHkgcmV0dXJuIG11dGF0aW9ucyB3aXRoaW4gdGhlIGxhc3QgTVVUQVRJT05fV0lORE9XX01TIHRvXG4gIC8vIGNhcHR1cmVFbnRyeS4gY29tcGFjdFRhcmdldCBpcyBjaGVhcGVyIHRoYW4gY3NzUGF0aCwgdXNlZCBoZXJlIHRvXG4gIC8vIGF2b2lkIHF1YWRyYXRpYyBjb3N0IG9uIGxhcmdlIERPTXMuXG4gIGNvbnN0IE1VVEFUSU9OX0JVRkZFUl9DQVAgPSA1MDtcbiAgY29uc3QgTVVUQVRJT05fV0lORE9XX01TID0gOF8wMDA7XG4gIGNvbnN0IFNFQ1JFVF9BVFRSX05BTUVfUkUgPSAvKHBhc3N3b3JkfHRva2VufHNlY3JldHxhcGlbXy1dP2tleXxjc3JmfHhzcmZ8c2Vzc2lvbnxub25jZSkvaTtcbiAgY29uc3QgbXV0YXRpb25CdWZmZXI6IERvbU11dGF0aW9uW10gPSBbXTtcbiAgY29uc3QgdHJ1bmNhdGUgPSAoczogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCwgbWF4ID0gMTIwKTogc3RyaW5nID0+XG4gICAgU3RyaW5nKHMgPz8gJycpLnNsaWNlKDAsIG1heCk7XG5cbiAgY29uc3QgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChyZWNvcmRzKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIGZvciAoY29uc3QgciBvZiByZWNvcmRzKSB7XG4gICAgICAvLyBTa2lwIG11dGF0aW9ucyBpbnNpZGUgb3VyIG93biBvdmVybGF5IOKAlCBldmVyeSByaW5nIHJlcGFpbnQgaXMgYVxuICAgICAgLy8gbXV0YXRpb24gYW5kIHdlJ2QgZmxvb2QgdGhlIGJ1ZmZlciB3aXRoIHNlbGYtbm9pc2UuXG4gICAgICBjb25zdCB0Tm9kZSA9IHIudGFyZ2V0O1xuICAgICAgaWYgKHROb2RlIGluc3RhbmNlb2YgTm9kZSAmJiAob3ZlcmxheUhvc3QgPT09IHROb2RlIHx8IG92ZXJsYXlIb3N0LmNvbnRhaW5zKHROb2RlKSkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgdEVsOiBFbGVtZW50IHwgbnVsbCA9IHROb2RlIGluc3RhbmNlb2YgRWxlbWVudFxuICAgICAgICA/IHROb2RlXG4gICAgICAgIDogKHROb2RlLnBhcmVudEVsZW1lbnQgPz8gbnVsbCk7XG4gICAgICBjb25zdCB0YXJnZXREZXNjID0gdEVsID8gY29tcGFjdFRhcmdldCh0RWwpIDogdE5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGxldCBlbnRyeTogRG9tTXV0YXRpb247XG4gICAgICBpZiAoci50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuICAgICAgICBjb25zdCBhZGRlZCA9IHIuYWRkZWROb2Rlcy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJlbW92ZWQgPSByLnJlbW92ZWROb2Rlcy5sZW5ndGg7XG4gICAgICAgIGxldCBzdW1tYXJ5ID0gYCR7dGFyZ2V0RGVzY306YDtcbiAgICAgICAgaWYgKGFkZGVkID4gMCkge1xuICAgICAgICAgIGNvbnN0IGZpcnN0ID0gci5hZGRlZE5vZGVzWzBdO1xuICAgICAgICAgIHN1bW1hcnkgKz0gYCArJHthZGRlZH0gJHtmaXJzdCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBjb21wYWN0VGFyZ2V0KGZpcnN0KSA6ICd0ZXh0J31gO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZW1vdmVkID4gMCkge1xuICAgICAgICAgIGNvbnN0IGZpcnN0ID0gci5yZW1vdmVkTm9kZXNbMF07XG4gICAgICAgICAgc3VtbWFyeSArPSBgIC0ke3JlbW92ZWR9ICR7Zmlyc3QgaW5zdGFuY2VvZiBFbGVtZW50ID8gY29tcGFjdFRhcmdldChmaXJzdCkgOiAndGV4dCd9YDtcbiAgICAgICAgfVxuICAgICAgICBlbnRyeSA9IHt0eXBlOiAnY2hpbGRMaXN0JywgdHM6IG5vdywgdGFyZ2V0OiB0YXJnZXREZXNjLCBhZGRlZCwgcmVtb3ZlZCwgc3VtbWFyeTogdHJ1bmNhdGUoc3VtbWFyeSwgMjAwKX07XG4gICAgICB9IGVsc2UgaWYgKHIudHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSByLmF0dHJpYnV0ZU5hbWUgPz8gJyc7XG4gICAgICAgIGNvbnN0IGlzU2VjcmV0ID0gU0VDUkVUX0FUVFJfTkFNRV9SRS50ZXN0KG5hbWUpO1xuICAgICAgICBjb25zdCBuZXdWYWxSYXcgPSAodEVsID8gdEVsLmdldEF0dHJpYnV0ZShuYW1lKSA6IG51bGwpID8/ICcnO1xuICAgICAgICBjb25zdCBvbGRWYWxSYXcgPSByLm9sZFZhbHVlID8/IG51bGw7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gaXNTZWNyZXQgPyAnW3JlZGFjdGVkXScgOiAob2xkVmFsUmF3ID09PSBudWxsID8gdW5kZWZpbmVkIDogdHJ1bmNhdGUob2xkVmFsUmF3KSk7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gaXNTZWNyZXQgPyAnW3JlZGFjdGVkXScgOiB0cnVuY2F0ZShuZXdWYWxSYXcpO1xuICAgICAgICBlbnRyeSA9IHtcbiAgICAgICAgICB0eXBlOiAnYXR0cmlidXRlcycsIHRzOiBub3csIHRhcmdldDogdGFyZ2V0RGVzYywgYXR0cmlidXRlTmFtZTogbmFtZSxcbiAgICAgICAgICBvbGRWYWx1ZSwgbmV3VmFsdWUsXG4gICAgICAgICAgc3VtbWFyeTogdHJ1bmNhdGUoYCR7dGFyZ2V0RGVzY31bJHtuYW1lfV06ICR7b2xkVmFsdWUgPz8gJ+KIhSd9IOKGkiAke25ld1ZhbHVlfWAsIDIwMCksXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjaGFyYWN0ZXJEYXRhXG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gci5vbGRWYWx1ZSA/PyB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdE5vZGUubm9kZVZhbHVlID8/ICcnO1xuICAgICAgICBlbnRyeSA9IHtcbiAgICAgICAgICB0eXBlOiAnY2hhcmFjdGVyRGF0YScsIHRzOiBub3csIHRhcmdldDogdGFyZ2V0RGVzYyxcbiAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsdWUgIT09IHVuZGVmaW5lZCA/IHRydW5jYXRlKG9sZFZhbHVlKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBuZXdWYWx1ZTogdHJ1bmNhdGUobmV3VmFsdWUpLFxuICAgICAgICAgIHN1bW1hcnk6IHRydW5jYXRlKGAke3RhcmdldERlc2N9IHRleHQ6ICR7dHJ1bmNhdGUob2xkVmFsdWUsIDMwKX0g4oaSICR7dHJ1bmNhdGUobmV3VmFsdWUsIDMwKX1gLCAyMDApLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgbXV0YXRpb25CdWZmZXIucHVzaChlbnRyeSk7XG4gICAgICBpZiAobXV0YXRpb25CdWZmZXIubGVuZ3RoID4gTVVUQVRJT05fQlVGRkVSX0NBUCkgbXV0YXRpb25CdWZmZXIuc2hpZnQoKTtcbiAgICB9XG4gIH0pO1xuICB0cnkge1xuICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxuICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZSwgY2hhcmFjdGVyRGF0YU9sZFZhbHVlOiB0cnVlLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdNdXRhdGlvbk9ic2VydmVyLm9ic2VydmUgZmFpbGVkJywgZSk7IH1cblxuICAvLyBIYW5kIGNhcHR1cmVFbnRyeSBhIGdldHRlciBzbyBpdCBjYW4gcmVhZCB0aGUgYnVmZmVyIHdpdGhvdXRcbiAgLy8gaW1wb3J0aW5nIGNvbnRlbnQtc2NyaXB0LW9ubHkgc3RhdGUuXG4gIHNldE11dGF0aW9uQnVmZmVyR2V0dGVyKCgpID0+IHtcbiAgICBjb25zdCBjdXRvZmYgPSBEYXRlLm5vdygpIC0gTVVUQVRJT05fV0lORE9XX01TO1xuICAgIHJldHVybiBtdXRhdGlvbkJ1ZmZlci5maWx0ZXIoKG0pID0+IERhdGUucGFyc2UobS50cykgPj0gY3V0b2ZmKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFRlc3Qvc3RhbmRhbG9uZSBBUEkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFwaTogUGluY2hncmFiQXBpID0ge1xuICAgIGNhcHR1cmVFbnRyeSxcbiAgICBidWlsZFBhZ2VDb250ZXh0LFxuICAgIGNhcHR1cmVzOiB0ZXN0Q2FwdHVyZXMsXG4gICAgZmxhc2hFbGVtZW50OiAoc2VsOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgICAgaWYgKGVsKSBmbGFzaEVsZW1lbnQoZWwpO1xuICAgIH0sXG4gICAgc2V0QWx0OiAob246IGJvb2xlYW4pID0+IHsgc2V0QWx0QWN0aXZlKG9uKTsgfSxcbiAgICBuZXh0U2VxLFxuICAgIGhhbmRsZUNvbW1hbmQsXG4gICAgZGVzdHJveTogKCkgPT4ge1xuICAgICAgZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIFt3aW5kb3csIGRvY3VtZW50XSkge1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2sgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bkFsdCwgdHJ1ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwQWx0LCB0cnVlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgb25XaW5kb3dCbHVyLCB0cnVlKTtcbiAgICAgIGNsZWFyUmluZ3MoKTtcbiAgICAgIHRyeSB7IGlmIChvdmVybGF5SG9zdC5tYXRjaGVzKCc6cG9wb3Zlci1vcGVuJykpIG92ZXJsYXlIb3N0LmhpZGVQb3BvdmVyKCk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgb3ZlcmxheUhvc3QucmVtb3ZlKCk7XG4gICAgICBkZWxldGUgd2luZG93W0tFWV07XG4gICAgfSxcbiAgfTtcbiAgd2luZG93W0tFWV0gPSBhcGk7XG4gIHdpbmRvdy5fX3BpbmNoZ3JhYiA9IGFwaTtcbiAgLy8gU3VjY2Vzc29yIHRha2VvdmVyOiB3aGVuIGEgZnJlc2ggY29weSBvZiB0aGlzIHNjcmlwdCBpbmplY3RzIChleHRlbnNpb25cbiAgLy8gcmVsb2FkKSwgaXQgZmlyZXMgdGhpcyBldmVudCBmcm9tIGl0cyBvd24gaXNvbGF0ZWQgd29ybGQg4oCUIHRlYXIgZG93biBzb1xuICAvLyBleGFjdGx5IG9uZSBsaXZlIGNvcHkgb3ducyB0aGUgcGFnZS5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignX19waW5jaGdyYWItdGFrZW92ZXInLCAoKSA9PiB7XG4gICAgdHJ5IHsgYXBpLmRlc3Ryb3koKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIH0sIHtvbmNlOiB0cnVlfSk7XG4gIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9ufSk7XG59XG5cbi8vIOKUgOKUgOKUgCBBbm5vdGF0aW9uIG92ZXJsYXkgKHN0aWNreSBjb21tZW50IGJveCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG50eXBlIEFubm90YXRpb25EZXBzID0ge1xuICBzZW5kVG9QYW5lbDogKG06IENzVG9QYW5lbCkgPT4gdm9pZDtcbiAgY2FwdHVyZUFuZENvbW1lbnQ6IChlbDogRWxlbWVudCwgdGV4dDogc3RyaW5nKSA9PiBFbnRyeTtcbiAgLy8gQ2FsbGVkIHdoZW4gdGhlIGJveCBoaWRlcyDigJQgdXNlZCB0byB0ZWFyIGRvd24gdGhlIG1hdGNoaW5nIGhvdmVyIHJpbmdcbiAgLy8gc28gcmluZyArIGJveCBzdGF5IGNvdXBsZWQuXG4gIG9uSGlkZTogKCkgPT4gdm9pZDtcbiAgLy8gQ2FsbGVkIHdoZW4gdGhlIGJveCBhcHBlYXJzIG9yIG1vdmVzIHRvIGEgbmV3IGVsZW1lbnQg4oCUIHVzZWQgdG9cbiAgLy8gKHJlLSlwYWludCB0aGUgaG92ZXIgcmluZyBvbiB0aGF0IGVsZW1lbnQuIENvdmVycyB0aGUgcmFjZSB3aGVyZSBhbHRcbiAgLy8gd2FzIHJlbGVhc2VkIGJlZm9yZSB0aGUgYW5ub3RhdGlvbiBtZXNzYWdlIHJvdW5kLXRyaXBwZWQgYmFjay5cbiAgb25TaG93OiAoZWw6IEVsZW1lbnQpID0+IHZvaWQ7XG59O1xudHlwZSBBbm5vdGF0aW9uQXBpID0ge1xuICBzaG93OiAoZWw6IEVsZW1lbnQsIHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbCkgPT4gdm9pZDtcbiAgaGlkZTogKCkgPT4gdm9pZDtcbiAgaXNMb2NrZWQ6ICgpID0+IGJvb2xlYW47XG4gIGZvY3VzVGV4dGFyZWE6ICgpID0+IHZvaWQ7XG4gIC8vIHJBRiB3YXRjaGRvZyB0aGF0IGtlZXBzIHRoZSBib3ggcGlubmVkIHRvIGl0cyBhbmNob3IgYW5kIHRlYXJzIGl0IGRvd25cbiAgLy8gd2hlbiB0aGUgYW5jaG9yIGxlYXZlcyB0aGUgRE9NLiBJbnRlcm5hbCBsaWZlY3ljbGUgaG9va3M7IHRoZSBwdWJsaWNcbiAgLy8gc3VyZmFjZSAoc2hvdy9oaWRlKSBkcml2ZXMgdGhlbSwgYnV0IHRoZXkncmUgZXhwb3NlZCBmb3IgdGhlIGRlc3Ryb3koKVxuICAvLyB0ZWFyZG93biBwYXRoLlxuICBzdGFydFdhdGNoZG9nOiAoKSA9PiB2b2lkO1xuICBzdG9wV2F0Y2hkb2c6ICgpID0+IHZvaWQ7XG59O1xuXG5mdW5jdGlvbiBzZXR1cEFubm90YXRpb24oZWw6IEhUTUxEaXZFbGVtZW50LCB7c2VuZFRvUGFuZWwsIGNhcHR1cmVBbmRDb21tZW50LCBvbkhpZGUsIG9uU2hvd306IEFubm90YXRpb25EZXBzKTogQW5ub3RhdGlvbkFwaSB7XG4gIGxldCBzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIC8vIEFjdGl2ZSBjYXB0dXJlJ3Mgc3RhYmxlIHVpZCAod2hlbiBwYXlsb2FkLmNhcHR1cmVkICsgdWlkKS4gVXNlZCBieVxuICAvLyBzdWJtaXQoKSBzbyB0aGUgY29tbWVudCByb3V0ZXMgdG8gdGhlIFNQRUNJRklDIGNhcHR1cmUgcmF0aGVyIHRoYW5cbiAgLy8gdG8gYW55IHNlbGVjdG9yIG1hdGNoIOKAlCBwcmV2ZW50cyBjcm9zcy1wYWdlIC8gY3Jvc3Mtc2libGluZ1xuICAvLyBjb250YW1pbmF0aW9uLlxuICBsZXQgYWN0aXZlVWlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxvY2tlZFRvOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBsb2NrZWQgPSBmYWxzZTtcbiAgbGV0IHRleHRhcmVhOiBIVE1MVGV4dEFyZWFFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBmZWVkYmFja0xpc3Q6IEhUTUxVTGlzdEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvLyBCdWlsZGVycyB3aXRoIGlubGluZSBzdHlsZXMgKENTUC1zYWZlOyBubyBpbmxpbmUgPHN0eWxlPiBvciBjbGFzcyBDU1MpLlxuICBjb25zdCBzdHlsZWQgPSA8VCBleHRlbmRzIEhUTUxFbGVtZW50Pih0YWc6IHN0cmluZywgc3R5bGVzOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+KTogVCA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKSBhcyBUO1xuICAgIE9iamVjdC5hc3NpZ24obm9kZS5zdHlsZSwgc3R5bGVzKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcblxuICBjb25zdCBidWlsZEJvZHkgPSAocGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQpOiB2b2lkID0+IHtcbiAgICBlbC5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgICBjb25zdCBjYXB0dXJlZCA9IEJvb2xlYW4ocGF5bG9hZC5jYXB0dXJlZCk7XG4gICAgLy8gSGVhZGVyIOKAlCBvbmx5IHdoZW4gY2FwdHVyZWQuIEp1c3QgYSB0aW55IG9yYW5nZSBgI05gIGNoaXA7IG5vXG4gICAgLy8gXCJQaW5jaEdyYWJcIiBvciBcIkNhcHR1cmUgKyBjb21tZW50XCIgbGFiZWxzLlxuICAgIGlmIChjYXB0dXJlZCkge1xuICAgICAgY29uc3QgaGVhZGVyID0gc3R5bGVkPEhUTUxEaXZFbGVtZW50PignZGl2Jywge1xuICAgICAgICBjb2xvcjogJyNmZjVmMDAnLCBmb250V2VpZ2h0OiAnNzAwJyxcbiAgICAgICAgZm9udDogXCI3MDAgMTNweC8xICdCcmljb2xhZ2UgR3JvdGVzcXVlJywnT3V0Zml0Jyx1aS1tb25vc3BhY2UsbW9ub3NwYWNlXCIsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzRweCcsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjAyZW0nLFxuICAgICAgfSk7XG4gICAgICBoZWFkZXIudGV4dENvbnRlbnQgPSBgIyR7cGF5bG9hZC5uID8/ICc/J31gO1xuICAgICAgZWwuYXBwZW5kKGhlYWRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHN0eWxlZDxIVE1MVUxpc3RFbGVtZW50PigndWwnLCB7XG4gICAgICBtYXJnaW46ICcwIDAgNnB4IDAnLCBwYWRkaW5nOiAnMCAwIDAgMTZweCcsIGxpc3RTdHlsZTogJ2Rpc2MnLFxuICAgIH0pO1xuICAgIGZlZWRiYWNrTGlzdCA9IGxpc3Q7XG4gICAgaWYgKHBheWxvYWQuZmVlZGJhY2s/Lmxlbmd0aCkge1xuICAgICAgLy8gQXR0YWNoIHRoZSBsaXN0IEJFRk9SRSBhcHBlbmRpbmcgaXRlbXM6IGFwcGVuZEZlZWRiYWNrJ3MgbGF6eVxuICAgICAgLy8gaW5zZXJ0QmVmb3JlKGxpc3QsIGFkZFJvdykgb3RoZXJ3aXNlIGRlcmVmZXJlbmNlcyBgYWRkUm93YCB3aGlsZSB0aGVcbiAgICAgIC8vIGNvbnN0IGlzIHN0aWxsIGluIGl0cyB0ZW1wb3JhbCBkZWFkIHpvbmUgKGRlY2xhcmVkIGJlbG93KSwgdGhyb3dpbmdcbiAgICAgIC8vIFJlZmVyZW5jZUVycm9yIGFuZCBraWxsaW5nIHRoZSBib3ggZm9yIGFueSBjYXB0dXJlIHRoYXQgYWxyZWFkeSBoYXNcbiAgICAgIC8vIGNvbW1lbnRzLiBXaXRoIGEgcGFyZW50IHNldCwgdGhhdCBicmFuY2ggbmV2ZXIgcnVucyBkdXJpbmcgYnVpbGQuXG4gICAgICBlbC5hcHBlbmQobGlzdCk7XG4gICAgICBmb3IgKGNvbnN0IHQgb2YgcGF5bG9hZC5mZWVkYmFjaykgYXBwZW5kRmVlZGJhY2sodCk7XG4gICAgfVxuICAgIC8vIChObyBcIk5vIGNvbW1lbnRzIHlldC5cIiBmaWxsZXIg4oCUIGVtcHR5IGxpc3QgPSBubyBsaXN0IHNob3duLilcblxuICAgIGNvbnN0IGFkZFJvdyA9IHN0eWxlZDxIVE1MRGl2RWxlbWVudD4oJ2RpdicsIHtcbiAgICAgIGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnNnB4JywgYWxpZ25JdGVtczogJ3N0cmV0Y2gnLFxuICAgICAgbWFyZ2luVG9wOiAnNHB4JywgcGFkZGluZ1RvcDogJzZweCcsXG4gICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgcmdiYSgyNTUsOTUsMCwuMiknLFxuICAgIH0pO1xuICAgIGNvbnN0IHRhID0gc3R5bGVkPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYScsIHtcbiAgICAgIGZsZXg6ICcxJywgbWluSGVpZ2h0OiAnMjhweCcsIG1heEhlaWdodDogJzEyMHB4JyxcbiAgICAgIHJlc2l6ZTogJ25vbmUnLFxuICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwwLDAsLjM1KScsIGNvbG9yOiAnI2ZjZmFmNScsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsOTUsMCwuMyknLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgIHBhZGRpbmc6ICc0cHggNnB4JyxcbiAgICAgIGZvbnQ6IFwiMTJweC8xLjQgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgICBvdXRsaW5lOiAnMCcsXG4gICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICB9KTtcbiAgICB0YS5wbGFjZWhvbGRlciA9IGNhcHR1cmVkID8gJ0NvbW1lbnTigKYnIDogJ0NvbW1lbnQgdG8gY2FwdHVyZeKApic7XG4gICAgdGEucm93cyA9IDI7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB7IHRhLnN0eWxlLmJvcmRlckNvbG9yID0gJyNmZjVmMDAnOyB9KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4geyB0YS5zdHlsZS5ib3JkZXJDb2xvciA9ICdyZ2JhKDI1NSw5NSwwLC4zKSc7IH0pO1xuICAgIHRleHRhcmVhID0gdGE7XG4gICAgLy8gU2VuZCBidXR0b24g4oCUIG11c3QgTUFUQ0ggdGhlIHNpZGUgcGFuZWwncyBtYWluIGNvbXBvc2VyIFNlbmQgYnV0dG9uXG4gICAgLy8gKHNyYy9zaWRlcGFuZWwuaHRtbCBgLmNvbXBvc2VyIC5zZW5kYCArIHNyYy9zaWRlcGFuZWwuY3NzKS4gVGhhdCBidXR0b25cbiAgICAvLyBpcyB0aGUgYG1lc3NhZ2Utc3F1YXJlLXBsdXNgIGx1Y2lkZSBpY29uICsgYSBzaG9ydCB0ZXh0IGxhYmVsIG9uIHRoZVxuICAgIC8vIG9yYW5nZeKGkm9yYW5nZS0yIHByaW1hcnkgZ3JhZGllbnQuIFdlIHJlYnVpbGQgaXQgaGVyZSB3aXRoIGlubGluZSBzdHlsZXNcbiAgICAvLyAoQ1NQLXNhZmU7IG5vIHNoYXJlZCBzdHlsZXNoZWV0IGFjcm9zcyB0aGUgdHdvIGRvY3VtZW50cykgc28gaXQgcmVhZHMgYXNcbiAgICAvLyB0aGUgc2FtZSBjb250cm9sIGV2ZW4gdGhvdWdoIGl0IGxpdmVzIGluIHRoZSBwYWdlJ3Mgc2hhZG93IHJvb3QuXG4gICAgY29uc3Qgc2VuZEJ0biA9IHN0eWxlZDxIVE1MQnV0dG9uRWxlbWVudD4oJ2J1dHRvbicsIHtcbiAgICAgIGZsZXg6ICcwIDAgYXV0bycsXG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgZ2FwOiAnNHB4JyxcbiAgICAgIHBhZGRpbmc6ICcwIDEwcHgnLFxuICAgICAgLy8gTWF0Y2ggdGhlIHRleHRhcmVhIG1pbi1oZWlnaHQgc28gdGhlIGJ1dHRvbiBkb2Vzbid0IGRyYWcgd2hlbiB0aGVcbiAgICAgIC8vIHRleHRhcmVhIGdyb3dzIChtaXJyb3JzIGAuY29tcG9zZXIgLnNlbmQgeyBoZWlnaHQ6IDM2cHggfWAsIHNjYWxlZCB0b1xuICAgICAgLy8gdGhlIG1vcmUgY29tcGFjdCBvbi1wYWdlIGJveCkuXG4gICAgICBoZWlnaHQ6ICcyOHB4JyxcbiAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZmY1ZjAwIDAlLCAjZWY0YjAwIDEwMCUpJyxcbiAgICAgIGNvbG9yOiAnI2ZmZicsIGJvcmRlcjogJzAnLCBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgICAgZm9udDogXCI3MDAgMTFweC8xICdCcmljb2xhZ2UgR3JvdGVzcXVlJywnT3V0Zml0JyxzeXN0ZW0tdWksc2Fucy1zZXJpZlwiLFxuICAgICAgbGV0dGVyU3BhY2luZzogJy4wMWVtJyxcbiAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICBib3hTaGFkb3c6ICcwIDAgMjRweCByZ2JhKDI1NSw5NSwwLC4yNSknLFxuICAgIH0pO1xuICAgIGNvbnN0IHNlbmRJY29uID0gc3R5bGVkPEhUTUxTcGFuRWxlbWVudD4oJ3NwYW4nLCB7XG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBsaW5lSGVpZ2h0OiAnMCcsXG4gICAgfSk7XG4gICAgc2VuZEljb24uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdtZXNzYWdlLXNxdWFyZS1wbHVzJywgMTYpO1xuICAgIGNvbnN0IHNlbmRMYWJlbCA9IHN0eWxlZDxIVE1MU3BhbkVsZW1lbnQ+KCdzcGFuJywge2ZvbnRTaXplOiAnMTBweCd9KTtcbiAgICBzZW5kTGFiZWwudGV4dENvbnRlbnQgPSBjYXB0dXJlZCA/ICdBZGQnIDogJ0NhcHR1cmUnO1xuICAgIHNlbmRCdG4uYXBwZW5kKHNlbmRJY29uLCBzZW5kTGFiZWwpO1xuICAgIHNlbmRCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgY2FwdHVyZWQgPyAnQWRkIGNvbW1lbnQnIDogJ0NhcHR1cmUgYW5kIGNvbW1lbnQnKTtcbiAgICBhZGRSb3cuYXBwZW5kKHRhLCBzZW5kQnRuKTtcbiAgICBlbC5hcHBlbmQoYWRkUm93KTtcblxuICAgIGNvbnN0IGhpbnQgPSBzdHlsZWQ8SFRNTERpdkVsZW1lbnQ+KCdkaXYnLCB7XG4gICAgICBjb2xvcjogJyM4NDdkOWEnLCBmb250U2l6ZTogJzEwcHgnLCBtYXJnaW5Ub3A6ICc0cHgnLFxuICAgIH0pO1xuICAgIGhpbnQudGV4dENvbnRlbnQgPSBjYXB0dXJlZFxuICAgICAgPyAnRW50ZXIgdG8gYWRkIMK3IFNoaWZ0K0VudGVyIG5ld2xpbmUgwrcgRXNjIHRvIGNsb3NlJ1xuICAgICAgOiAnRW50ZXIgdG8gY2FwdHVyZSAmIHNhdmUgwrcgU2hpZnQrRW50ZXIgbmV3bGluZSDCtyBFc2MgdG8gY2xvc2UnO1xuICAgIGVsLmFwcGVuZChoaW50KTtcblxuICAgIGZ1bmN0aW9uIGFwcGVuZEZlZWRiYWNrKHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgY29uc3QgbGkgPSBzdHlsZWQ8SFRNTExJRWxlbWVudD4oJ2xpJywge1xuICAgICAgICBtYXJnaW46ICcycHggMCcsIGNvbG9yOiAnI2ZjZmFmNScsIHdvcmRCcmVhazogJ2JyZWFrLXdvcmQnLFxuICAgICAgfSk7XG4gICAgICBsaS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgICBsaXN0LmFwcGVuZChsaSk7XG4gICAgICBpZiAoIWxpc3QucGFyZW50Tm9kZSkgZWwuaW5zZXJ0QmVmb3JlKGxpc3QsIGFkZFJvdyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3VibWl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhLnZhbHVlLnRyaW0oKTtcbiAgICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgICAgaWYgKGNhcHR1cmVkICYmIHNlbGVjdG9yKSB7XG4gICAgICAgIC8vIFJvdXRlIGJ5IHN0YWJsZSB1aWQgKyBVUkwgd2hlbiBhdmFpbGFibGUuIFNpZGUtcGFuZWwnc1xuICAgICAgICAvLyBvbkZlZWRiYWNrQWRkIHByZWZlcnMgcGFyZW50VWlkOyBzZWxlY3RvciArIHVybCBpcyB0aGVcbiAgICAgICAgLy8gY29tcG9zaXRlIGZhbGxiYWNrLiBUaGUgYmFyZS1zZWxlY3RvciBwYXRoIHRoYXQgdXNlZCB0b1xuICAgICAgICAvLyBzaGlwIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi5cbiAgICAgICAgc2VuZFRvUGFuZWwoe1xuICAgICAgICAgIGtpbmQ6ICdmZWVkYmFjay1hZGQnLCBzZWxlY3RvciwgdGV4dCxcbiAgICAgICAgICB1cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgLi4uKGFjdGl2ZVVpZCA/IHtwYXJlbnRVaWQ6IGFjdGl2ZVVpZH0gOiB7fSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChsb2NrZWRUbykge1xuICAgICAgICAvLyBDYXB0dXJlICsgYXR0YWNoIHRoZSBjb21tZW50IGluIG9uZSBtb3Rpb24sIHRoZW4gcmVidWlsZCB0aGVcbiAgICAgICAgLy8gYm9keSB3aXRoIGNhcHR1cmVkPXRydWUgc28gdGhlIG9yYW5nZSAjTiBoZWFkZXIgYXBwZWFycywgYnV0dG9uXG4gICAgICAgIC8vIHRleHQgZmxpcHMgdG8gXCJBZGRcIiwgZXRjLlxuICAgICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVBbmRDb21tZW50KGxvY2tlZFRvLCB0ZXh0KTtcbiAgICAgICAgcGF5bG9hZC5jYXB0dXJlZCA9IHRydWU7XG4gICAgICAgIHBheWxvYWQudWlkID0gZW50cnkudWlkO1xuICAgICAgICBwYXlsb2FkLm4gPSBlbnRyeS5uO1xuICAgICAgICBwYXlsb2FkLnNlbGVjdG9yID0gZW50cnkuc2VsZWN0b3I7XG4gICAgICAgIHBheWxvYWQuZmVlZGJhY2sgPSBbLi4uKHBheWxvYWQuZmVlZGJhY2sgPz8gW10pLCB0ZXh0XTtcbiAgICAgICAgc2VsZWN0b3IgPSBlbnRyeS5zZWxlY3RvcjtcbiAgICAgICAgYWN0aXZlVWlkID0gZW50cnkudWlkO1xuICAgICAgICBidWlsZEJvZHkocGF5bG9hZCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRhLnZhbHVlID0gJyc7XG4gICAgICBwYXlsb2FkLmZlZWRiYWNrID0gWy4uLihwYXlsb2FkLmZlZWRiYWNrID8/IFtdKSwgdGV4dF07XG4gICAgICBhcHBlbmRGZWVkYmFjayh0ZXh0KTtcbiAgICB9O1xuICAgIHNlbmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXQpO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0KCk7IH1cbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBoaWRlKCk7IH1cbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gICAgLy8gSWYgYSBmb2N1cyByZXF1ZXN0IGNhbWUgaW4gYmVmb3JlIHRoZSB0ZXh0YXJlYSBleGlzdGVkIChhbHQtcmVsZWFzZVxuICAgIC8vIHJhY2VkIGFoZWFkIG9mIHRoZSBhbm5vdGF0aW9uIHJvdW5kLXRyaXApLCBjbGFpbSBpdCBub3cuXG4gICAgaWYgKHdhbnRzRm9jdXMpIHtcbiAgICAgIHdhbnRzRm9jdXMgPSBmYWxzZTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0YS5mb2N1cyh7cHJldmVudFNjcm9sbDogdHJ1ZX0pKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgR0FQID0gODsgICAgIC8vIGdhcCBiZXR3ZWVuIGFuY2hvciBlZGdlIGFuZCBib3hcbiAgY29uc3QgTUFSR0lOID0gODsgIC8vIG1pbiBkaXN0YW5jZSBmcm9tIGFueSB2aWV3cG9ydCBlZGdlXG5cbiAgLy8gRGV0ZXJtaW5pc3RpYyBwbGFjZW1lbnQgcmVsYXRpdmUgdG8gYGFuY2hvcmAuIFR3byBzdWJ0bGV0aWVzIHRoZSBvbGRcbiAgLy8gdmVyc2lvbiBnb3Qgd3JvbmcsIHdoaWNoIHByb2R1Y2VkIHRoZSBcImJveCBpbiBhIHJhbmRvbSBzcG90XCIgcmVwb3J0czpcbiAgLy8gICAxLiBJdCByZWFkIGBlbC5vZmZzZXRIZWlnaHRgIHdoaWxlIHRoZSBib3ggd2FzIHN0aWxsIGBkaXNwbGF5Om5vbmVgLFxuICAvLyAgICAgIHNvIGhlaWdodCBtZWFzdXJlZCBhcyAwIGFuZCB0aGUgYWJvdmUvYmVsb3cgZGVjaXNpb24gKyB0aGVcbiAgLy8gICAgICBNYXRoLm1heCg4LCDigKYpIGNsYW1wIHdlcmUgY29tcHV0ZWQgYWdhaW5zdCBnYXJiYWdlLlxuICAvLyAgIDIuIEl0IGNsYW1wZWQgdGhlIGxlZnQgZWRnZSB3aXRoIGEgaGFyZGNvZGVkIDM2MHB4IHdpZHRoIGluc3RlYWQgb2ZcbiAgLy8gICAgICB0aGUgYm94J3MgcmVhbCBtZWFzdXJlZCB3aWR0aCwgc28gYSBuYXJyb3dlciBib3ggKHNob3J0IGNvbW1lbnQpXG4gIC8vICAgICAgZHJpZnRlZCBhbmQgYSB3aWRlciBib3ggKGxvbmcgZmVlZGJhY2sgbGlzdCkgb3ZlcmZsb3dlZC5cbiAgLy8gV2UgZm9yY2UgdGhlIGJveCB2aXNpYmxlIGJ1dCB0cmFuc3BhcmVudCBmb3Igb25lIHN5bmNocm9ub3VzIG1lYXN1cmUsXG4gIC8vIHRoZW4gcGxhY2UgaXQgdXNpbmcgaXRzIHJlYWwgcmVuZGVyZWQgc2l6ZS4gQWxsIG51bWJlcnMgYXJlIGNsYW1wZWQgc29cbiAgLy8gdGhlIHdob2xlIGJveCBhbHdheXMgbGFuZHMgaW5zaWRlIHRoZSB2aWV3cG9ydC5cbiAgY29uc3QgcG9zaXRpb24gPSAoYW5jaG9yOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgciA9IGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAvLyBNZWFzdXJlIHRoZSByZWFsIGJveCBzaXplLiBJdCdzIGFscmVhZHkgaW4gdGhlIERPTSAoYnVpbGRCb2R5IHJhbik7XG4gICAgLy8gbWFraW5nIGl0IGBibG9ja2AgbGV0cyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgcmVwb3J0IHRydWUgZGltZW5zaW9ucy5cbiAgICAvLyB2aXNpYmlsaXR5OmhpZGRlbiBrZWVwcyB0aGUgbWVhc3VyZSBpbnZpc2libGUgc28gdGhlcmUncyBubyBmbGFzaCBhdFxuICAgIC8vIGEgcHJlLXBsYWNlbWVudCBsb2NhdGlvbi5cbiAgICBjb25zdCBwcmV2VmlzID0gZWwuc3R5bGUudmlzaWJpbGl0eTtcbiAgICBlbC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgZWwuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgIGVsLnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgIGNvbnN0IGJveCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGJ3ID0gYm94LndpZHRoIHx8IDMyMDtcbiAgICBjb25zdCBiaCA9IGJveC5oZWlnaHQgfHwgMTYwO1xuICAgIGVsLnN0eWxlLnZpc2liaWxpdHkgPSBwcmV2VmlzIHx8ICd2aXNpYmxlJztcblxuICAgIC8vIFZlcnRpY2FsOiBwcmVmZXIgYmVsb3cgdGhlIGFuY2hvcjsgZmxpcCBhYm92ZSB3aGVuIGJlbG93IHdvdWxkIGNsaXBcbiAgICAvLyB0aGUgYm90dG9tIGVkZ2UgQU5EIHRoZXJlJ3MgbW9yZSByb29tIGFib3ZlLlxuICAgIGNvbnN0IHJvb21CZWxvdyA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHIuYm90dG9tIC0gR0FQO1xuICAgIGNvbnN0IHJvb21BYm92ZSA9IHIudG9wIC0gR0FQO1xuICAgIGNvbnN0IHVzZUFib3ZlID0gYmggPiByb29tQmVsb3cgJiYgcm9vbUFib3ZlID4gcm9vbUJlbG93O1xuICAgIGxldCB0b3AgPSB1c2VBYm92ZSA/IHIudG9wIC0gR0FQIC0gYmggOiByLmJvdHRvbSArIEdBUDtcbiAgICB0b3AgPSBNYXRoLm1heChNQVJHSU4sIE1hdGgubWluKHRvcCwgd2luZG93LmlubmVySGVpZ2h0IC0gYmggLSBNQVJHSU4pKTtcblxuICAgIC8vIEhvcml6b250YWw6IGxlZnQtYWxpZ24gdG8gdGhlIGFuY2hvciwgdGhlbiBjbGFtcCB0aGUgd2hvbGUgYm94IGluc2lkZVxuICAgIC8vIHRoZSB2aWV3cG9ydCB1c2luZyBpdHMgcmVhbCB3aWR0aC5cbiAgICBsZXQgbGVmdCA9IHIubGVmdDtcbiAgICBsZWZ0ID0gTWF0aC5tYXgoTUFSR0lOLCBNYXRoLm1pbihsZWZ0LCB3aW5kb3cuaW5uZXJXaWR0aCAtIGJ3IC0gTUFSR0lOKSk7XG5cbiAgICBlbC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZChsZWZ0KSArICdweCc7XG4gICAgZWwuc3R5bGUudG9wID0gTWF0aC5yb3VuZCh0b3ApICsgJ3B4JztcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfTtcblxuICBjb25zdCBoaWRlID0gKCk6IHZvaWQgPT4ge1xuICAgIHN0b3BXYXRjaGRvZygpO1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgc2VsZWN0b3IgPSBudWxsO1xuICAgIGFjdGl2ZVVpZCA9IG51bGw7XG4gICAgbG9ja2VkVG8gPSBudWxsO1xuICAgIGxvY2tlZCA9IGZhbHNlO1xuICAgIHRleHRhcmVhID0gbnVsbDtcbiAgICBmZWVkYmFja0xpc3QgPSBudWxsO1xuICAgIHdhbnRzRm9jdXMgPSBmYWxzZTtcbiAgICBsYXN0QW5jaG9yS2V5ID0gJyc7XG4gICAgb25IaWRlKCk7XG4gIH07XG5cbiAgY29uc3QgaXNUeXBpbmcgPSAoKTogYm9vbGVhbiA9PiBCb29sZWFuKHRleHRhcmVhKSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0ZXh0YXJlYTtcbiAgY29uc3Qgc2hvdyA9IChhbmNob3I6IEVsZW1lbnQsIHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGF5bG9hZCkge1xuICAgICAgaWYgKGxvY2tlZCB8fCBpc1R5cGluZygpKSByZXR1cm47XG4gICAgICBoaWRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFNhbWUgY2FwdHVyZSDigJQgcHJlc2VydmUgdGV4dGFyZWEgY29udGVudCArIGZvY3VzLCBqdXN0IHJlZnJlc2hcbiAgICAvLyB0aGUgZmVlZGJhY2sgbGlzdC4gV2UgY29tcGFyZSBCT1RIIHVpZCBhbmQgc2VsZWN0b3Igc28gYSBzdGFsZVxuICAgIC8vIHBheWxvYWQgcG9pbnRpbmcgYXQgYSBkaWZmZXJlbnQgY2FwdHVyZSAoc2FtZSBzZWxlY3RvciwgZS5nLlxuICAgIC8vIGFsdC1ob3ZlcmluZyBhIHNpYmxpbmcgd2l0aCB0aGUgc2FtZSB0ZXN0SWQpIHRyaWdnZXJzIGEgZnVsbFxuICAgIC8vIHJlZnJlc2ggaW5zdGVhZCBvZiBwcmV0ZW5kaW5nIG5vdGhpbmcgY2hhbmdlZC5cbiAgICBpZiAoc2VsZWN0b3IgPT09IHBheWxvYWQuc2VsZWN0b3IgJiYgKHBheWxvYWQudWlkID8/IG51bGwpID09PSBhY3RpdmVVaWQpIHtcbiAgICAgIGlmIChwYXlsb2FkLmZlZWRiYWNrPy5sZW5ndGggJiYgZmVlZGJhY2tMaXN0KSB7XG4gICAgICAgIGZlZWRiYWNrTGlzdC5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHBheWxvYWQuZmVlZGJhY2spIHtcbiAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihsaS5zdHlsZSwge21hcmdpbjogJzJweCAwJywgY29sb3I6ICcjZmNmYWY1Jywgd29yZEJyZWFrOiAnYnJlYWstd29yZCd9KTtcbiAgICAgICAgICBsaS50ZXh0Q29udGVudCA9IHQ7XG4gICAgICAgICAgZmVlZGJhY2tMaXN0LmFwcGVuZChsaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gRGlmZmVyZW50IGNhcHR1cmUg4oCUIHN3aXRjaCBmdWxseS4gQWx0LWhvdmVyIG9ubHkgZmlyZXMgd2hpbGUgQWx0XG4gICAgLy8gaXMgaGVsZCwgc28gdGhpcyBvbmx5IGhhcHBlbnMgd2hlbiB0aGUgdXNlciBkZWxpYmVyYXRlbHkgbW92ZXMgdG9cbiAgICAvLyBhIG5ldyB0YXJnZXQ7IGxvc2luZyBpbi1wcm9ncmVzcyB0eXBpbmcgaXMgdGhlIGV4cGVjdGVkIGNvc3Qgb2ZcbiAgICAvLyBzd2l0Y2hpbmcuIE9uY2UgQWx0IGlzIHJlbGVhc2VkLCBtb3VzZW1vdmVzIGRvbid0IHRyaWdnZXIgaG92ZXJcbiAgICAvLyBldmVudHMsIHNvIHRoZSBib3ggZnJlZXplcyBvbiB0aGUgbGFzdCBlbGVtZW50IGFuZCB0eXBpbmcgaXMgc2FmZS5cbiAgICBzZWxlY3RvciA9IHBheWxvYWQuc2VsZWN0b3IgPz8gbnVsbDtcbiAgICBhY3RpdmVVaWQgPSBwYXlsb2FkLnVpZCA/PyBudWxsO1xuICAgIGxvY2tlZFRvID0gYW5jaG9yO1xuICAgIGJ1aWxkQm9keShwYXlsb2FkKTtcbiAgICBwb3NpdGlvbihhbmNob3IpO1xuICAgIHN0YXJ0V2F0Y2hkb2coKTtcbiAgICBvblNob3coYW5jaG9yKTtcbiAgfTtcbiAgLy8gUGVuZGluZy1mb2N1cyBmbGFnOiBpZiBmb2N1cyBpcyByZXF1ZXN0ZWQgYmVmb3JlIHRoZSB0ZXh0YXJlYSBleGlzdHNcbiAgLy8gKGUuZy4gYWx0IHdhcyByZWxlYXNlZCBiZWZvcmUgdGhlIGFubm90YXRpb24gbWVzc2FnZSByb3VuZC10cmlwcGVkXG4gIC8vIGJhY2spLCB3ZSBzZXQgdGhlIGZsYWcgYW5kIHRoZSBidWlsZEJvZHkgY29tcGxldGlvbiBwYXRoIHBpY2tzIGl0IHVwLlxuICBsZXQgd2FudHNGb2N1cyA9IGZhbHNlO1xuICBjb25zdCBkb0ZvY3VzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dGFyZWEpIHJldHVybjtcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZWwgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGFyZWEpIHJldHVybjtcbiAgICAvLyBEZWZlciB0byB0aGUgbmV4dCBmcmFtZSBzbyB3ZSBsYW5kIEFGVEVSIGFueSBmb2N1cy1zdGVhbGluZyBicm93c2VyXG4gICAgLy8gYmVoYXZpb3VyIChlLmcuIEFsdCDihpIgbWVudS1iYXIgb24gV2luZG93cykgaGFzIHNldHRsZWQuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmICh0ZXh0YXJlYSkgdGV4dGFyZWEuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHRydWV9KTtcbiAgICB9KTtcbiAgfTtcbiAgLy8gUHVibGljIGhvb2s6IGZvY3VzIHRoZSB0ZXh0YXJlYSAoY2FsbGVkIG9uIGFsdC1yZWxlYXNlIHNvIHR5cGluZyBpc1xuICAvLyBpbW1lZGlhdGUgd2l0aG91dCB0aGUgdXNlciBoYXZpbmcgdG8gbW91c2UgdG8gdGhlIGJveCkuXG4gIGNvbnN0IGZvY3VzVGV4dGFyZWEgPSAoKTogdm9pZCA9PiB7XG4gICAgd2FudHNGb2N1cyA9IHRydWU7XG4gICAgZG9Gb2N1cygpO1xuICB9O1xuXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgbG9ja2VkID0gdHJ1ZTtcbiAgICBpZiAodGV4dGFyZWEgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGV4dGFyZWEpIHRleHRhcmVhLmZvY3VzKCk7XG4gIH0pO1xuICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgIGlmICh0ZXh0YXJlYSAmJiAodGV4dGFyZWEudmFsdWUubGVuZ3RoID4gMCB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0ZXh0YXJlYSkpIHJldHVybjtcbiAgICBsb2NrZWQgPSBmYWxzZTtcbiAgfSk7XG5cbiAgLy8gVHJ1ZSB3aGVuIHRoZSBhbmNob3IgaGFzIGxlZnQgdGhlIERPTSBvciBjb2xsYXBzZWQgdG8gbm90aGluZyAoZGlzcGxheVxuICAvLyB0b2dnbGVkIG9mZiwgcmVtb3ZlZCwgZGV0YWNoZWQpLiBBIGJveCBhbmNob3JlZCB0byBhIHZhbmlzaGVkIGVsZW1lbnQgaXNcbiAgLy8gdGhlIFwidG9vbHRpcCBzdHJhbmRlZCBhZnRlciBpdHMgYW5jaG9yIGxlYXZlc1wiIGZhaWx1cmUg4oCUIHRlYXIgaXQgZG93bi5cbiAgY29uc3QgYW5jaG9ySXNHb25lID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghbG9ja2VkVG8pIHJldHVybiB0cnVlO1xuICAgIGlmICghbG9ja2VkVG8uaXNDb25uZWN0ZWQpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHIgPSBsb2NrZWRUby5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gci53aWR0aCA9PT0gMCAmJiByLmhlaWdodCA9PT0gMDtcbiAgfTtcblxuICBjb25zdCByZXBvc2l0aW9uID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChlbC5zdHlsZS5kaXNwbGF5ICE9PSAnYmxvY2snKSByZXR1cm47XG4gICAgaWYgKGFuY2hvcklzR29uZSgpKSB7IGhpZGUoKTsgcmV0dXJuOyB9XG4gICAgcG9zaXRpb24obG9ja2VkVG8hKTtcbiAgfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlcG9zaXRpb24sIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVwb3NpdGlvbik7XG5cbiAgLy8gQW5jaG9yIHdhdGNoZG9nLiBTY3JvbGwvcmVzaXplIGNvdmVyIG1vc3QgbW92ZW1lbnQsIGJ1dCBhbiBTUEEgdGhhdFxuICAvLyBzd2FwcyB0aGUgYW5jaG9yZWQgZWxlbWVudCBvdXQgKHJvdXRlIGNoYW5nZSwgbGlzdCByZS1yZW5kZXIsIG1vZGFsXG4gIC8vIGNsb3NlKSBmaXJlcyBuZWl0aGVyIOKAlCBsZWF2aW5nIHRoZSBib3ggc3RyYW5kZWQgYXQgYSBzdGFsZSBwb3NpdGlvbi5cbiAgLy8gQSBzZWxmLWNhbmNlbGxpbmcgckFGIGxvb3AgdGhhdCBvbmx5IHJ1bnMgd2hpbGUgdGhlIGJveCBpcyB2aXNpYmxlXG4gIC8vIGNhdGNoZXMgdGhhdDogaXQgcmVwb3NpdGlvbnMgb24gbGF5b3V0IGRyaWZ0IGFuZCBoaWRlcyB0aGUgbW9tZW50IHRoZVxuICAvLyBhbmNob3IgaXMgZ29uZS4gSXQgc3RvcHMgaXRzZWxmIHdoZW4gdGhlIGJveCBoaWRlcyBzbyB0aGVyZSdzIG5vXG4gIC8vIGFtYmllbnQgbG9vcCBvbiBldmVyeSBwYWdlLlxuICBsZXQgd2F0Y2hkb2cgPSAwO1xuICBjb25zdCBzdG9wV2F0Y2hkb2cgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHdhdGNoZG9nKSB7IGNhbmNlbEFuaW1hdGlvbkZyYW1lKHdhdGNoZG9nKTsgd2F0Y2hkb2cgPSAwOyB9XG4gIH07XG4gIGxldCBsYXN0QW5jaG9yS2V5ID0gJyc7XG4gIGNvbnN0IHN0YXJ0V2F0Y2hkb2cgPSAoKTogdm9pZCA9PiB7XG4gICAgc3RvcFdhdGNoZG9nKCk7XG4gICAgY29uc3QgdGljayA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmIChlbC5zdHlsZS5kaXNwbGF5ICE9PSAnYmxvY2snKSB7IHdhdGNoZG9nID0gMDsgcmV0dXJuOyB9XG4gICAgICBpZiAoYW5jaG9ySXNHb25lKCkpIHsgaGlkZSgpOyByZXR1cm47IH1cbiAgICAgIC8vIFJlcG9zaXRpb24gb25seSB3aGVuIHRoZSBhbmNob3IgYWN0dWFsbHkgbW92ZWQsIHNvIHdlIGRvbid0IGZpZ2h0XG4gICAgICAvLyB0aGUgdXNlcidzIGNhcmV0IC8gcmUtbWVhc3VyZSBldmVyeSBmcmFtZS5cbiAgICAgIGNvbnN0IHIgPSBsb2NrZWRUbyEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBrZXkgPSBgJHtNYXRoLnJvdW5kKHIubGVmdCl9LCR7TWF0aC5yb3VuZChyLnRvcCl9LCR7TWF0aC5yb3VuZChyLndpZHRoKX0sJHtNYXRoLnJvdW5kKHIuaGVpZ2h0KX1gO1xuICAgICAgaWYgKGtleSAhPT0gbGFzdEFuY2hvcktleSkgeyBsYXN0QW5jaG9yS2V5ID0ga2V5OyBwb3NpdGlvbihsb2NrZWRUbyEpOyB9XG4gICAgICB3YXRjaGRvZyA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuICAgIHdhdGNoZG9nID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICB9O1xuXG4gIC8vIEVzY2FwZSBmcm9tIGFueXdoZXJlIChub3QganVzdCB0aGUgZm9jdXNlZCB0ZXh0YXJlYSkgZGlzbWlzc2VzIHRoZSBib3guXG4gIC8vIFRoZSB0ZXh0YXJlYSdzIG93biBrZXlkb3duIGhhbmRsZXMgRXNjYXBlIHdoaWxlIGZvY3VzZWQ7IHRoaXMgY292ZXJzIHRoZVxuICAvLyBjYXNlIHdoZXJlIHRoZSBib3ggaXMgbG9ja2VkL29wZW4gYnV0IGZvY3VzIGlzIGVsc2V3aGVyZSBvbiB0aGUgcGFnZS5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyAmJiBlbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSB7IGhpZGUoKTsgfVxuICB9LCB0cnVlKTtcblxuICByZXR1cm4ge3Nob3csIGhpZGUsIGlzTG9ja2VkOiAoKSA9PiBsb2NrZWQgfHwgaXNUeXBpbmcoKSwgZm9jdXNUZXh0YXJlYSwgc3RhcnRXYXRjaGRvZywgc3RvcFdhdGNoZG9nfTtcbn1cblxuLy8gKE5vIHNoYWRvdyBzdHlsZXNoZWV0IOKAlCBldmVyeSBvdmVybGF5IGVsZW1lbnQgZ2V0cyBpdHMgc3R5bGUgYXBwbGllZCB2aWFcbi8vIHRoZSBKUyBIVE1MRWxlbWVudC5zdHlsZSBBUEksIHdoaWNoIENocm9tZSBhbGxvd3MgdW5kZXIgc3RyaWN0IENTUC4pXG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQVVBLElBQUksdUJBQXFEO0FBQUEsRUFDbEQsSUFBTSwwQkFBMEIsQ0FBQyxPQUFrQztBQUFBLElBQ3hFLHVCQUF1QjtBQUFBO0FBQUEsRUFJekIsSUFBTSxXQUFXO0FBQUEsRUFDakIsSUFBTSxjQUFjO0FBQUEsRUFDcEIsSUFBTSxXQUFXO0FBQUEsRUFDakIsSUFBTSxZQUFZO0VBSWxCLElBQU0sWUFBWSxPQUFPLFFBQVEsZUFBZSxPQUFPLElBQUksV0FBVztBQUFBLEVBQy9ELElBQU0sWUFBWSxDQUFDLE1BQ3hCLFlBQVksSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsRUFBRSxRQUFRLHNDQUFzQyxNQUFNO0FBQUEsRUFFckYsSUFBTSxXQUFXLENBQUMsR0FBWSxNQUFNLGFBQ3pDLE9BQU8sS0FBSyxFQUFFLEVBQUUsV0FBVyxRQUFRLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxHQUFHLEdBQUc7QUFBQSxFQUU3RCxJQUFNLFdBQVcsQ0FBSSxJQUFhLGFBQW1CO0FBQUEsSUFDbkQsSUFB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VUFBRSxXQUFXO0FBQUEsVUFBRztBQUFBLFFBQVE7QUFBQSxRQUMxRCxJQUFJLGFBQWEsR0FBRztBQUFBLFVBQUUsS0FBSztBQUFBLFVBQUc7QUFBQSxRQUFRO0FBQUEsUUFHdEMsTUFBTSxJQUFJLFNBQVUsc0JBQXNCO0FBQUEsUUFDMUMsTUFBTSxNQUFNLEdBQUcsS0FBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFLEdBQUcsS0FBSyxLQUFLLE1BQU0sRUFBRSxLQUFLLEtBQUssS0FBSyxNQUFNLEVBQUUsTUFBTTtBQUFBLFFBQ3BHLElBQUksUUFBUSxlQUFlO0FBQUEsVUFBRSxnQkFBZ0I7QUFBQSxVQUFLLFNBQVMsUUFBUztBQUFBLFFBQUc7QUFBQSxRQUN2RSxXQUFXLHNCQUFzQixJQUFJO0FBQUE7QUFBQSxNQUV2QyxXQUFXLHNCQUFzQixJQUFJO0FBQUE7QUFBQSxJQU12QyxTQUFTLGlCQUFpQixXQUFXLENBQUMsTUFBTTtBQUFBLE1BQzFDLElBQUksRUFBRSxRQUFRLFlBQVksR0FBRyxNQUFNLFlBQVksU0FBUztBQUFBLFFBQUUsS0FBSztBQUFBLE1BQUc7QUFBQSxPQUNqRSxJQUFJO0FBQUEsSUFFUCxPQUFPLEVBQUMsTUFBTSxNQUFNLFVBQVUsTUFBTSxVQUFVLFNBQVMsR0FBRyxlQUFlLGVBQWUsYUFBWTtBQUFBOyIsCiAgImRlYnVnSWQiOiAiQUQ1MUMzQzFDMTZDRTMxNjY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
