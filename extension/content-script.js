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

  // src/content-script.ts
  var LOG = "[PinchGrab/cs]";
  var KEY = "__pinchgrabContent";
  if (window[KEY]) {
    console.log(LOG, "already initialized; reusing.");
  } else {
    init();
  }
  function init() {
    const inExtension = typeof chrome !== "undefined" && Boolean(chrome.runtime?.id);
    const testCaptures = inExtension ? null : [];
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
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("opacity", "0.45");
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
    const trackElement = (key, el, opts = {}) => {
      const slot = ensureRing(key);
      slot.target = el;
      if (slot.raf)
        cancelAnimationFrame(slot.raf);
      const tick = () => {
        if (!el.isConnected) {
          removeRing(key);
          return;
        }
        positionRing(slot, el, opts);
        slot.raf = requestAnimationFrame(tick);
      };
      tick();
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
      const altOn = e.altKey || altForwarded;
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
      if (isInsideAnnotation(e))
        return;
      if (annotationEl.style.display === "block" && !annotation.isLocked())
        annotation.hide();
      if (!e.altKey || dragStart)
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
      if (suppressNextClick) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (isInsideAnnotation(event))
        return;
      if (!event.altKey)
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
    window.addEventListener("keydown", (e) => {
      if (e.altKey) {
        setAltActive(true);
        if (e.key === "Alt" && annotationEl.style.display === "block") {
          e.preventDefault();
        }
      }
    }, true);
    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt" || !e.altKey) {
        if (annotationEl.style.display === "block")
          e.preventDefault();
        altForwarded = false;
        setAltActive(false);
      }
    }, true);
    window.addEventListener("blur", () => {
      altForwarded = false;
      setAltActive(false);
    }, true);
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
          el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
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
    }
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
        for (const target of [window, document]) {
          target.removeEventListener("mousemove", onMouseMove, true);
          target.removeEventListener("mousedown", onMouseDown, true);
          target.removeEventListener("mouseup", onMouseUp, true);
        }
        document.removeEventListener("click", onClick, true);
        clearRings();
        overlayHost.remove();
        delete window[KEY];
      }
    };
    window[KEY] = api;
    window.__pinchgrab = api;
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
        for (const t of payload.feedback)
          appendFeedback(t);
        el.append(list);
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
        padding: "4px 10px",
        background: "linear-gradient(180deg, #ff5f00 0%, #ef4b00 100%)",
        color: "#fff",
        border: "0",
        borderRadius: "6px",
        font: "700 10px/1 'Bricolage Grotesque','Outfit',system-ui,sans-serif",
        textTransform: "uppercase",
        letterSpacing: ".04em",
        cursor: "pointer"
      });
      sendBtn.textContent = captured ? "Add" : "Capture";
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
    const position = (anchor) => {
      const r = anchor.getBoundingClientRect();
      const ah = el.offsetHeight || 160;
      const useAbove = r.bottom + 8 + ah > window.innerHeight;
      const top = useAbove ? Math.max(8, r.top - 8 - ah) : r.bottom + 8;
      const left = Math.max(8, Math.min(r.left, window.innerWidth - 360 - 8));
      el.style.left = left + "px";
      el.style.top = top + "px";
      el.style.display = "block";
    };
    const hide = () => {
      el.style.display = "none";
      selector = null;
      activeUid = null;
      lockedTo = null;
      locked = false;
      textarea = null;
      feedbackList = null;
      wantsFocus = false;
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
    const reposition = () => {
      if (el.style.display === "block" && lockedTo?.isConnected)
        position(lockedTo);
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return { show, hide, isLocked: () => locked || isTyping(), focusTextarea };
  }
})();

//# debugId=F3EB47F9999338B964756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjXFxkb20udHMiLCAic3JjXFx0eXBlcy50cyIsICJzcmNcXGNvbnRlbnQtc2NyaXB0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIERPTSBoZWxwZXJzIHNoYXJlZCBieSB0aGUgY29udGVudCBzY3JpcHQuIFB1cmUgZnVuY3Rpb25zIHdoZXJlIHBvc3NpYmxlIOKAlFxuLy8gYW55IERPTS1ib3VuZCBzdGF0ZSBsaXZlcyBpbiB0aGUgY2FsbGluZyBtb2R1bGUuXG5cbmltcG9ydCB0eXBlIHtFbnRyeSwgUmVjdCwgTWF0Y2hlZFJ1bGUsIEZyYW1ld29ya0luZm8sIEFuY2VzdG9yLCBWaWV3cG9ydCwgRG9tTXV0YXRpb259IGZyb20gJy4vdHlwZXMudHMnO1xuXG4vLyBIb29rIGZvciB0aGUgY29udGVudC1zY3JpcHQtb3duZWQgTXV0YXRpb25PYnNlcnZlciBidWZmZXIuIFNldCBieVxuLy8gY29udGVudC1zY3JpcHQudHMgYXQgYm9vdCB2aWEgYHNldE11dGF0aW9uQnVmZmVyR2V0dGVyYDsgbnVsbGFibGVcbi8vIGJlY2F1c2UgZG9tLnRzIGlzIGFsc28gaW1wb3J0ZWQgYnkgdGVzdHMgLyBzdGFuZGFsb25lIGhhcm5lc3NlcyB0aGF0XG4vLyBkb24ndCBydW4gYW4gb2JzZXJ2ZXIuIGNhcHR1cmVFbnRyeSByZWFkcyB0aGUgbW9zdCByZWNlbnQgMyByZWNvcmRzXG4vLyBpbiB0aGUgOC1zZWNvbmQgd2luZG93IHZpYSB0aGlzIGdldHRlciAowqc0Ljgg4oCUIHJlcHJvIGNvbnRleHQpLlxubGV0IG11dGF0aW9uQnVmZmVyR2V0dGVyOiAoKCkgPT4gRG9tTXV0YXRpb25bXSkgfCBudWxsID0gbnVsbDtcbmV4cG9ydCBjb25zdCBzZXRNdXRhdGlvbkJ1ZmZlckdldHRlciA9IChmbjogKCkgPT4gRG9tTXV0YXRpb25bXSk6IHZvaWQgPT4ge1xuICBtdXRhdGlvbkJ1ZmZlckdldHRlciA9IGZuO1xufTtcblxuLy8gLS0tLSBMaW1pdHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBNQVhfVEVYVCA9IDE0MDtcbmNvbnN0IE1BWF9TTklQUEVUID0gMjYwMDtcbmNvbnN0IE1BWF9BVFRSID0gMTQwO1xuY29uc3QgTUFYX1JVTEVTID0gMTI7XG5jb25zdCBNQVhfUFJFVklFV19DU1MgPSA0MjA7XG5cbi8vIC0tLS0gVGlueSB1dGlsaXRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgY2FuRXNjYXBlID0gdHlwZW9mIENTUyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIENTUy5lc2NhcGUgPT09ICdmdW5jdGlvbic7XG5leHBvcnQgY29uc3QgZXNjYXBlQ3NzID0gKHY6IHN0cmluZyk6IHN0cmluZyA9PlxuICBjYW5Fc2NhcGUgPyBDU1MuZXNjYXBlKHYpIDogU3RyaW5nKHYpLnJlcGxhY2UoLyhbXFxcXCAjOz8lJiwuKyp+JzpcIiFeJFtcXF0oKT0+fC9AXSkvZywgJ1xcXFwkMScpO1xuXG5leHBvcnQgY29uc3QgdHJpbVRleHQgPSAodjogdW5rbm93biwgbWF4ID0gTUFYX1RFWFQpOiBzdHJpbmcgPT5cbiAgU3RyaW5nKHYgPz8gJycpLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkuc2xpY2UoMCwgbWF4KTtcblxuY29uc3Qgc2FmZUNhbGwgPSA8VD4oZm46ICgpID0+IFQsIGZhbGxiYWNrOiBUKTogVCA9PiB7XG4gIHRyeSB7IHJldHVybiBmbigpOyB9IGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG59O1xuXG5jb25zdCB0b1Bvc2l0aXZlSW50ID0gKHY6IHVua25vd24pOiBudW1iZXIgfCBudWxsID0+IHtcbiAgY29uc3QgbiA9IE51bWJlcih2KTtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCA/IE1hdGgucm91bmQobikgOiBudWxsO1xufTtcblxuY29uc3QgYXR0ciA9IChlbDogRWxlbWVudCwgbmFtZTogc3RyaW5nKTogc3RyaW5nID0+XG4gIHRyaW1UZXh0KGVsLmdldEF0dHJpYnV0ZShuYW1lKSwgMTIwKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBhY3RUYXJnZXQgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICBsZXQgb3V0ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZWwuaWQpIG91dCArPSAnIycgKyBlbC5pZDtcbiAgaWYgKGVsLmNsYXNzTGlzdD8ubGVuZ3RoKSB7XG4gICAgb3V0ICs9ICcuJyArIEFycmF5LmZyb20oZWwuY2xhc3NMaXN0KS5zbGljZSgwLCA0KS5qb2luKCcuJyk7XG4gIH1cbiAgcmV0dXJuIHRyaW1UZXh0KG91dCwgMTgwKTtcbn07XG5cbi8vIC0tLS0gU2VsZWN0b3IgYnVpbGRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgRFlOQU1JQ19JRF9SRSA9IC9eKHJhZGl4LXxoZWFkbGVzc3VpLXxtdWktfGFyaWEtfGVtYmVyfHJlYWN0LWFyaWF8OnJbMC05YS16XSs6KS9pO1xuZXhwb3J0IGNvbnN0IGlzU3RhYmxlSWQgPSAoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBpZCBpcyBzdHJpbmcgPT5cbiAgQm9vbGVhbihpZCkgJiYgIURZTkFNSUNfSURfUkUudGVzdChpZCEpICYmICEvWzpcXHNdLy50ZXN0KGlkISkgJiYgIS9eXFxkLy50ZXN0KGlkISk7XG5cbi8vIFRhaWx3aW5kIC8gdXRpbGl0eS1DU1MgY2xhc3Mgbm9pc2UgKyBDU1MtaW4tSlMgaGFzaCBwcmVmaXhlcy4gQW55dGhpbmdcbi8vIG1hdGNoaW5nIHRoaXMgcHJlZml4LXNldCBpcyBmaWx0ZXJlZCBvdXQgb2Ygc3RhYmxlQ2xhc3NlcygpIHNvIGNzc1BhdGgoKVxuLy8gcHJlZmVycyBzZW1hbnRpYyBjbGFzc2VzLlxuLy9cbi8vIFNvdXJjZS1vZi10cnV0aCBmaWx0ZXI6XG4vLyAg4oCiIFRhaWx3aW5kIHV0aWxpdHkgcHJlZml4ZXMgKGZsZXgsIGdyaWQsIHctLCBoLSwgdHJhbnNpdGlvbiwgZHVyYXRpb24tLCDigKYpXG4vLyAg4oCiIFBzZXVkby1zdGF0ZSBwcmVmaXhlcyAoaG92ZXI6LCBmb2N1czosIHNtOiwgZGFyazopXG4vLyAg4oCiIENTUy1pbi1KUyBoYXNoIGNsYXNzZXMgKGNzcy0sIHNjLSwgZW1vdGlvbi0sIGNoYWtyYS0sIGpzczEyMywgbWFrZVN0eWxlcy0sXG4vLyAgICBNdWlCb3gtLCBfbmV4dC0sIC0tKSDigJQgYWRkZWQgMjAyNiBmcm9tIGNzcy1zZWxlY3Rvci1nZW5lcmF0b3Inc1xuLy8gICAgYGlnbm9yZUdlbmVyYXRlZENsYXNzTmFtZXNgIGRlZmF1bHRzLlxuY29uc3QgVVRJTElUWV9DTEFTU19SRSA9XG4gIC9eKGZsZXh8Z3JpZHxibG9ja3xpbmxpbmV8aGlkZGVufHJlbGF0aXZlfGFic29sdXRlfGZpeGVkfHN0aWNreXx3LXxoLXxwLXxtLXxweC18cHktfHB0LXxwYi18cGwtfHByLXxteC18bXktfG10LXxtYi18bWwtfG1yLXxnYXAtfHNwYWNlLXx0ZXh0LXxmb250LXxsZWFkaW5nLXx0cmFja2luZy18YmctfGJvcmRlcnxyb3VuZGVkfHNoYWRvd3xvcGFjaXR5fGN1cnNvci18c2VsZWN0LXxwb2ludGVyLXxvdmVyZmxvd3x3aGl0ZXNwYWNlfHRydW5jYXRlfGl0ZW1zLXxqdXN0aWZ5LXxjb250ZW50LXxzZWxmLXxwbGFjZS18ei18dG9wLXxsZWZ0LXxyaWdodC18Ym90dG9tLXxtaW4tfG1heC18YXNwZWN0LXxvYmplY3QtfGluc2V0LXxvcmRlci18Y29sLXxyb3ctfGdhcHxob3Zlcjp8Zm9jdXM6fGFjdGl2ZTp8ZGlzYWJsZWQ6fHNtOnxtZDp8bGc6fHhsOnwyeGw6fGRhcms6fGZpcnN0fGxhc3R8b2RkfGV2ZW58Z3JvdXB8cGVlcnx0cmFuc2l0aW9ufGR1cmF0aW9uLXxkZWxheS18ZWFzZS18YW5pbWF0ZS18dHJhbnNmb3JtfHNjYWxlLXxyb3RhdGUtfHRyYW5zbGF0ZS18c2tldy18b3JpZ2luLXxyaW5nLXxkaXZpZGUtfG91dGxpbmUtfGZpbGwtfHN0cm9rZS18ZnJvbS18dG8tfHZpYS18cGxhY2Vob2xkZXItfGNhcmV0LXxhY2NlbnQtfGFwcGVhcmFuY2UtfGJhY2tkcm9wLXxjbGlwLXxjb250YWluLXxkZWNvcmF0aW9uLXx1bmRlcmxpbmV8bGluZS18bGlzdC18dGFidWxhcnxudW1zfHByb3NlfG5vdC18bW90aW9uLXxpc29sYXRlfGlzb2xhdGlvbnx3aWxsLXxhbnRpYWxpYXNlZHxzdWJwaXhlbC18c3Itb25seXxmbG9hdC18Y2xlYXItfHJlc2l6ZS18c2Nyb2xsLXxzbmFwLXx0b3VjaC18aW52aXNpYmxlfHZpc2libGV8Y3NzLXxzYy1bYS16MC05XXxlbW90aW9uLXxjaGFrcmEtfGpzc1xcZCt8bWFrZVN0eWxlcy18TXVpQm94LXxfbmV4dC18TXVpQnV0dG9uQmFzZS18z4FkX198X193YWJffHdhYl98cGxzbWMtKS9pO1xuXG5jb25zdCBzdGFibGVDbGFzc2VzID0gKGVsOiBFbGVtZW50LCBtYXggPSAyKTogc3RyaW5nW10gPT4ge1xuICBpZiAoIWVsLmNsYXNzTGlzdCkgcmV0dXJuIFtdO1xuICBjb25zdCBhbGwgPSBBcnJheS5mcm9tKGVsLmNsYXNzTGlzdCk7XG4gIGNvbnN0IHN0YWJsZSA9IGFsbC5maWx0ZXIoKGMpID0+ICFVVElMSVRZX0NMQVNTX1JFLnRlc3QoYykpO1xuICBpZiAoc3RhYmxlLmxlbmd0aCkgcmV0dXJuIHN0YWJsZS5zbGljZSgwLCBtYXgpO1xuICByZXR1cm4gYWxsLnNsaWNlKDAsIDEpO1xufTtcblxuY29uc3QgaXNVbmlxdWUgPSAoc2NvcGU6IFBhcmVudE5vZGUsIHNlbGVjdG9yOiBzdHJpbmcsIHRhcmdldDogRWxlbWVudCk6IGJvb2xlYW4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG1hdGNoZXMgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gbWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gdGFyZ2V0O1xuICB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG59O1xuXG5jb25zdCBvd25EZXNjcmlwdG9yID0gKGVsOiBFbGVtZW50KTogc3RyaW5nID0+IHtcbiAgbGV0IHMgPSBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBjID0gc3RhYmxlQ2xhc3NlcyhlbCk7XG4gIGlmIChjLmxlbmd0aCkgcyArPSAnLicgKyBjLm1hcChlc2NhcGVDc3MpLmpvaW4oJy4nKTtcbiAgcmV0dXJuIHM7XG59O1xuXG4vLyBCdWlsZCB0aGUgc2hvcnRlc3QgQ1NTIHNlbGVjdG9yIHRoYXQgdW5pcXVlbHkgaWRlbnRpZmllcyBgZWxgIG9uIHRoZSBwYWdlLlxuLy8gU3RyYXRlZ3kgKGVhY2ggY2FuZGlkYXRlIHRlc3RlZCB3aXRoIHF1ZXJ5U2VsZWN0b3JBbGwgZm9yIHVuaXF1ZW5lc3MpOlxuLy9cbi8vICAgMS4gdGFnLnNlbWFudGljQ2xhc3Mg4oCUIHBhZ2Utd2lkZSB1bmlxdWUgKGUuZy4gYGhlYWRlci5zdGlja3lgKS5cbi8vICAgMi4gI3N0YWJsZUFuY2VzdG9ySWQgdGFnLnNlbWFudGljQ2xhc3Mg4oCUIGlmIGEgc3RhYmxlLWlkIGFuY2VzdG9yIGV4aXN0cy5cbi8vICAgMy4gRnVsbCBkZXNjZW5kYW50IHBhdGg7IFRIRU4gcnVuIG9wdGltaXplKCkg4oCUIHRyeSByZW1vdmluZyBlYWNoIGludGVyaW9yXG4vLyAgICAgIHNlZ21lbnQgb25lIGF0IGEgdGltZSBhbmQga2VlcCB0aGUgcmVzdWx0IGlmIGl0J3Mgc3RpbGwgdW5pcXVlLlxuLy8gICAgICBJbnNwaXJlZCBieSBhbnRvbm1lZHYvZmluZGVyJ3Mgb3B0aW1pemUgbG9vcC4gRHJvcHMgZS5nLiBgYm9keSA+IG1haW4gPlxuLy8gICAgICBzZWN0aW9uLnggPiBkaXYud3JhcCA+IGgxLmJyYW5kYCB0byBgbWFpbiA+IGgxLmJyYW5kYCB3aGVuIG1pZGRsZVxuLy8gICAgICBzZWdtZW50cyBkb24ndCBjb25zdHJhaW4gdW5pcXVlbmVzcy5cbi8vXG4vLyBFbXBpcmljYWxseSAoYXVkaXQgb24gd3Jhbm5nbGUuY29tKSB0aGlzIGRyb3BzIHR5cGljYWwgc2VsZWN0b3IgdG9rZW5zXG4vLyBmcm9tIH43MCBjaGFycyB0byB+MTUtMjUgY2hhcnMgd2l0aG91dCBzYWNyaWZpY2luZyByZXNvbHZhYmlsaXR5LlxuY29uc3QgcGFydHNUb1NlbGVjdG9yID0gKHBhcnRzOiBzdHJpbmdbXSwgYW5jaG9yOiBzdHJpbmcgfCBudWxsKTogc3RyaW5nID0+XG4gIGFuY2hvciA/IGAke2FuY2hvcn0gJHtwYXJ0cy5qb2luKCcgPiAnKX1gIDogcGFydHMuam9pbignID4gJyk7XG5cbmNvbnN0IG9wdGltaXplUGF0aCA9IChwYXJ0czogc3RyaW5nW10sIGFuY2hvcjogc3RyaW5nIHwgbnVsbCwgdGFyZ2V0OiBFbGVtZW50LCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290KTogc3RyaW5nW10gPT4ge1xuICAvLyBEb24ndCB0b3VjaCB0aGUgaGVhZCAodGhlIGxlYWYgZWxlbWVudCBkZXNjcmlwdG9yKSBvciwgaWYgdGhlcmUncyBub1xuICAvLyBhbmNob3IsIHRoZSB2ZXJ5IGZpcnN0IHNlZ21lbnQgdGhhdCBhbmNob3JzIHRoZSBwYXRoLiBUcnkgcmVtb3ZpbmcgZWFjaFxuICAvLyBpbnRlcmlvciBzZWdtZW50OyBrZWVwIHRoZSBzaG9ydGVyIGZvcm0gaWYgdGhlIHNlbGVjdG9yIHN0aWxsIHJlc29sdmVzXG4gIC8vIHRvIGEgdW5pcXVlIHRhcmdldC5cbiAgbGV0IGJlc3QgPSBwYXJ0cztcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8IGJlc3QubGVuZ3RoIC0gMSkge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IFsuLi5iZXN0LnNsaWNlKDAsIGkpLCAuLi5iZXN0LnNsaWNlKGkgKyAxKV07XG4gICAgaWYgKGNhbmRpZGF0ZS5sZW5ndGggPT09IDApIHsgaSsrOyBjb250aW51ZTsgfVxuICAgIGlmIChpc1VuaXF1ZShzY29wZSwgcGFydHNUb1NlbGVjdG9yKGNhbmRpZGF0ZSwgYW5jaG9yKSwgdGFyZ2V0KSkge1xuICAgICAgYmVzdCA9IGNhbmRpZGF0ZTtcbiAgICAgIC8vIHJlc3RhcnQgZnJvbSBzdGFydCBvZiB0cmltbWVkIHBhdGhcbiAgICAgIGkgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpKys7XG4gICAgfVxuICB9XG4gIHJldHVybiBiZXN0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNzc1BhdGggPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICBpZiAoaXNTdGFibGVJZChlbC5pZCkpIHJldHVybiAnIycgKyBlc2NhcGVDc3MoZWwuaWQpO1xuXG4gIC8vIFNoYWRvdy1yb290ZWQgZWxlbWVudHMgYXJlbid0IHJlYWNoYWJsZSB2aWEgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JgLCBzb1xuICAvLyB0aGUgdW5pcXVlbmVzcyBjaGVja3MgbXVzdCBzY29wZSB0byB0aGUgb3duaW5nIHJvb3QuIE90aGVyd2lzZSBldmVyeVxuICAvLyBwcm9iZSBmYWxscyBiYWNrIHRvIGEgZnVsbCBkZXNjZW5kYW50IHBhdGggdGhhdCBjbGltYnMgdG8gYGJvZHlgIOKAlFxuICAvLyB3aGljaCBpdCBjYW4gbmV2ZXIgcmVhY2ggYmVjYXVzZSBvZiB0aGUgc2hhZG93IGJvdW5kYXJ5IOKAlCBhbmQgdGhlXG4gIC8vIHNlbGVjdG9yIGVuZHMgdXAgb3Zlci1zcGVjaWZpZWQgb3Igbm9uc2Vuc2UuXG4gIGNvbnN0IHJvb3ROb2RlID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgY29uc3QgY3NzU2NvcGU6IERvY3VtZW50IHwgU2hhZG93Um9vdCA9IHJvb3ROb2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3ROb2RlIDogZG9jdW1lbnQ7XG4gIGNvbnN0IHNjb3BlQm91bmRhcnk6IE5vZGUgPSByb290Tm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgPyByb290Tm9kZSA6IGRvY3VtZW50LmJvZHk7XG5cbiAgLy8gRmluZCB0aGUgbmVhcmVzdCBzdGFibGUtaWQgYW5jZXN0b3IgYXMgYW4gYW5jaG9yIGNhbmRpZGF0ZS5cbiAgbGV0IGFuY2hvcklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGFuY2hvckVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgd2hpbGUgKGN1ciAmJiBjdXIgIT09IHNjb3BlQm91bmRhcnkpIHtcbiAgICBpZiAoaXNTdGFibGVJZChjdXIuaWQpKSB7XG4gICAgICBhbmNob3JJZCA9ICcjJyArIGVzY2FwZUNzcyhjdXIuaWQpO1xuICAgICAgYW5jaG9yRWwgPSBjdXI7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY3VyID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gIH1cblxuICBjb25zdCBvd24gPSBvd25EZXNjcmlwdG9yKGVsKTtcblxuICAvLyBDYW5kaWRhdGUgMTogb3duIGRlc2NyaXB0b3IgYWxvbmUsIGlmIGl0J3MgcGFnZS13aWRlIHVuaXF1ZS5cbiAgaWYgKGlzVW5pcXVlKGNzc1Njb3BlLCBvd24sIGVsKSkgcmV0dXJuIG93bjtcblxuICAvLyBDYW5kaWRhdGUgMjogYW5jaG9yICsgb3duIGRlc2NyaXB0b3IuXG4gIGlmIChhbmNob3JJZCkge1xuICAgIGNvbnN0IGMyID0gYCR7YW5jaG9ySWR9ICR7b3dufWA7XG4gICAgaWYgKGlzVW5pcXVlKGFuY2hvckVsISwgb3duLCBlbCkgfHwgaXNVbmlxdWUoY3NzU2NvcGUsIGMyLCBlbCkpIHJldHVybiBjMjtcbiAgfVxuXG4gIC8vIENhbmRpZGF0ZSAyLjUg4oCUIEFSSUEtYW5jaG9yZWQgc2VsZWN0b3JzLiBCZWZvcmUgZmFsbGluZyB0aHJvdWdoIHRvXG4gIC8vIGJyaXR0bGUgYDpudGgtb2YtdHlwZWAgY2hhaW5zIHRoZSByb2FzdCBjYWxsZWQgb3V0ICjCpzIuNSksIHRyeVxuICAvLyBhbmNob3JpbmcgYXQgc2VtYW50aWNhbGx5LW5hbWVkIG1hcmtlcnMgYW4gTExNIG9yIGh1bWFuIGNhbiByZWFkOlxuICAvL1xuICAvLyAgIOKAoiB0aGUgZWxlbWVudCdzIG93biBhcmlhLWxhYmVsIC8gcm9sZVxuICAvLyAgIOKAoiBhIG5lYXJieSBhbmNlc3RvcidzIGFyaWEtbGFiZWwgLyByb2xlXG4gIC8vXG4gIC8vIFNlbGVjdG9ycyBsaWtlIGBbYXJpYS1sYWJlbD1cIlBpcGVsaW5lIHRyZW5kXCJdIC5zcGFyay13cmFwYCBhcmVcbiAgLy8gYm90aCBzdGFibGUtYWdhaW5zdC1ET00tc2h1ZmZsZSBBTkQgaHVtYW4tcmVhZGFibGUgaW4gYSB3YXkgdGhhdFxuICAvLyBgZGl2LnN0YXQ6bnRoLW9mLXR5cGUoMSkgPiBkaXYuc3RhdF9fc3Bhcms6bnRoLW9mLXR5cGUoNCkgPiBzcGFuYCBpc1xuICAvLyBub3QuIENhcCB0aGUgY2hhaW4gZGVwdGggc28gd2UgZG9uJ3Qgd2FsayBwYXN0IGEgbWVhbmluZ2Z1bCBib3VuZGFyeS5cbiAgY29uc3QgYXJpYVF1b3RlZCA9ICh2YWw6IHN0cmluZyk6IHN0cmluZyA9PiAnXCInICsgdmFsLnJlcGxhY2UoL1tcXFxcXCJdL2csICdcXFxcJCYnKSArICdcIic7XG4gIGNvbnN0IGFyaWFTZWxlY3RvciA9IChlOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgbGFiZWwgPSBlLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgIGlmIChsYWJlbCAmJiBsYWJlbC5sZW5ndGggPiAwICYmIGxhYmVsLmxlbmd0aCA8IDgwKSB7XG4gICAgICByZXR1cm4gYFthcmlhLWxhYmVsPSR7YXJpYVF1b3RlZChsYWJlbCl9XWA7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICAvLyBUcnkgYW4gQVJJQS1hbmNob3JlZCBzZWxlY3RvciBmb3IgVEhJUyBlbGVtZW50IGZpcnN0LlxuICBjb25zdCBvd25BcmlhID0gYXJpYVNlbGVjdG9yKGVsKTtcbiAgaWYgKG93bkFyaWEgJiYgaXNVbmlxdWUoY3NzU2NvcGUsIG93bkFyaWEsIGVsKSkgcmV0dXJuIG93bkFyaWE7XG4gIC8vIFdhbGsgdXAgdG8gNCBhbmNlc3RvcnMgYW5kIHRyeSBgW2FyaWEtbGFiZWw9XCLigKZcIl0gdGFnLmNsc2AuIFN0b3AgYXQgdGhlXG4gIC8vIGFuY2hvckVsIGlmIHdlIGZvdW5kIG9uZSDigJQgYW55dGhpbmcgYWJvdmUgaXMgYWxyZWFkeSBjb3ZlcmVkLlxuICBsZXQgYXJpYUN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBsZXQgZGVwdGggPSAwO1xuICB3aGlsZSAoYXJpYUN1ciAmJiBkZXB0aCA8IDQgJiYgYXJpYUN1ciAhPT0gc2NvcGVCb3VuZGFyeSAmJiBhcmlhQ3VyICE9PSBhbmNob3JFbCkge1xuICAgIGNvbnN0IGEgPSBhcmlhU2VsZWN0b3IoYXJpYUN1cik7XG4gICAgaWYgKGEpIHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2F9ICR7b3dufWA7XG4gICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGNhbmRpZGF0ZSwgZWwpKSByZXR1cm4gY2FuZGlkYXRlO1xuICAgIH1cbiAgICBhcmlhQ3VyID0gYXJpYUN1ci5wYXJlbnRFbGVtZW50O1xuICAgIGRlcHRoKys7XG4gIH1cblxuICAvLyBDYW5kaWRhdGUgMi42IOKAlCByb2xlICsgbmFtZSBhbmNob3IuIEFSSUEtb25seSBsYWJlbHMgY2F1Z2h0IGFib3ZlOyB0aGlzXG4gIC8vIHRpZXIgaGFuZGxlcyB0aGUgY2FzZSB3aGVyZSB0aGUgYW5jZXN0b3IgaGFzIEJPVEggYSBgcm9sZWAgYW5kIGFuXG4gIC8vIGBhcmlhLWxhYmVsYCAob3IgYGRhdGEtdGVzdGlkYCkuIFNlbGVjdG9yIGlzIG1vcmUgc3BlY2lmaWMgYW5kXG4gIC8vIGRvZXNuJ3QgcmlzayBjb2xsaWRpbmcgd2hlbiB0d28gbGFiZWxzIGhhcHBlbiB0byBtYXRjaCBhY3Jvc3Mgcm9sZXMuXG4gIGNvbnN0IHJvbGVOYW1lU2VsZWN0b3IgPSAoZTogRWxlbWVudCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHJvbGUgPSBlLmdldEF0dHJpYnV0ZSgncm9sZScpO1xuICAgIGNvbnN0IGxhYmVsID0gZS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICBpZiAocm9sZSAmJiBsYWJlbCAmJiBsYWJlbC5sZW5ndGggPCA4MCkge1xuICAgICAgcmV0dXJuIGBbcm9sZT0ke2FyaWFRdW90ZWQocm9sZSl9XVthcmlhLWxhYmVsPSR7YXJpYVF1b3RlZChsYWJlbCl9XWA7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBsZXQgcm5DdXI6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgZGVwdGggPSAwO1xuICB3aGlsZSAocm5DdXIgJiYgZGVwdGggPCA0ICYmIHJuQ3VyICE9PSBzY29wZUJvdW5kYXJ5ICYmIHJuQ3VyICE9PSBhbmNob3JFbCkge1xuICAgIGNvbnN0IGEgPSByb2xlTmFtZVNlbGVjdG9yKHJuQ3VyKTtcbiAgICBpZiAoYSkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YX0gJHtvd259YDtcbiAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwgY2FuZGlkYXRlLCBlbCkpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfVxuICAgIHJuQ3VyID0gcm5DdXIucGFyZW50RWxlbWVudDtcbiAgICBkZXB0aCsrO1xuICB9XG5cbiAgLy8gQ2FuZGlkYXRlIDIuNyDigJQgdW5pcXVlLWNsYXNzLWFuY2VzdG9yIGFuY2hvciAowqcyLjUgc2VsZWN0b3IgbGFkZGVyKS5cbiAgLy8gV2FsayBhbmNlc3RvcnMgbG9va2luZyBmb3Igb25lIHdob3NlIGNsYXNzIGNoYWluICh2aWEgc3RhYmxlQ2xhc3NlcylcbiAgLy8gaXMgdW5pcXVlIG9uIHRoZSBwYWdlOyB1c2UgaXQgYXMgYC51bmlxdWUtY2xhc3Mgb3duYC4gRml4ZXMgdGhlIGNhc2VcbiAgLy8gd2hlcmUgdGhlIGVsZW1lbnRzIGJldHdlZW4gdGhlIGNhcHR1cmVkIG5vZGUgYW5kIHRoZSBkb2N1bWVudCBoYXZlXG4gIC8vIG5vIGFyaWEvdGVzdGlkL2lkLCBidXQgT05FIG9mIHRoZW0gY2FycmllcyBhIG1lYW5pbmdmdWwgc2VtYW50aWNcbiAgLy8gY2xhc3MgKGAuYXR0ZW50aW9uLWJhbm5lcmAsIGAubWlzc2lvbi1zdGF0c2ApLlxuICBsZXQgdWNDdXI6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgZGVwdGggPSAwO1xuICB3aGlsZSAodWNDdXIgJiYgZGVwdGggPCA2ICYmIHVjQ3VyICE9PSBzY29wZUJvdW5kYXJ5ICYmIHVjQ3VyICE9PSBhbmNob3JFbCkge1xuICAgIGNvbnN0IGNscyA9IHN0YWJsZUNsYXNzZXModWNDdXIpO1xuICAgIGlmIChjbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhbmNEZXNjcmlwdG9yID0gYCR7dWNDdXIubm9kZU5hbWUudG9Mb3dlckNhc2UoKX0uJHtjbHMubWFwKGVzY2FwZUNzcykuam9pbignLicpfWA7XG4gICAgICAvLyBgLmNsc2AgKHdpdGhvdXQgdGhlIHRhZyBwcmVmaXgpIGlzIHNob3J0ZXIgYW5kIHJlYWRzIGJldHRlciB3aGVuXG4gICAgICAvLyB0aGUgYW5jZXN0b3IncyBjbGFzcyBpcyBwYWdlLXVuaXF1ZSBvbiBpdHMgb3duLlxuICAgICAgY29uc3QganVzdENscyA9ICcuJyArIGNscy5tYXAoZXNjYXBlQ3NzKS5qb2luKCcuJyk7XG4gICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGp1c3RDbHMsIHVjQ3VyKSkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHtqdXN0Q2xzfSAke293bn1gO1xuICAgICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGNhbmRpZGF0ZSwgZWwpKSByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgfVxuICAgICAgaWYgKGlzVW5pcXVlKGNzc1Njb3BlLCBhbmNEZXNjcmlwdG9yLCB1Y0N1cikpIHtcbiAgICAgICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YW5jRGVzY3JpcHRvcn0gJHtvd259YDtcbiAgICAgICAgaWYgKGlzVW5pcXVlKGNzc1Njb3BlLCBjYW5kaWRhdGUsIGVsKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdWNDdXIgPSB1Y0N1ci5wYXJlbnRFbGVtZW50O1xuICAgIGRlcHRoKys7XG4gIH1cblxuICAvLyBDYW5kaWRhdGUgMzogZnVsbCBkZXNjZW5kYW50IHBhdGgsIHRoZW4gb3B0aW1pemUuXG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBjdXIgPSBlbDtcbiAgd2hpbGUgKGN1ciAmJiBjdXIubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGN1ciAhPT0gc2NvcGVCb3VuZGFyeSkge1xuICAgIGlmIChjdXIgIT09IGVsICYmIGlzU3RhYmxlSWQoY3VyLmlkKSkgYnJlYWs7XG4gICAgbGV0IHMgPSBjdXIubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBjbHMgPSBzdGFibGVDbGFzc2VzKGN1cik7XG4gICAgaWYgKGNscy5sZW5ndGgpIHMgKz0gJy4nICsgY2xzLm1hcChlc2NhcGVDc3MpLmpvaW4oJy4nKTtcbiAgICBjb25zdCBwYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgY29uc3Qgc2FtZVRhZyA9IEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maWx0ZXIoKHNpYikgPT4gc2liLm5vZGVOYW1lID09PSBjdXIhLm5vZGVOYW1lKTtcbiAgICAgIGlmIChzYW1lVGFnLmxlbmd0aCA+IDEpIHMgKz0gYDpudGgtb2YtdHlwZSgke3NhbWVUYWcuaW5kZXhPZihjdXIpICsgMX0pYDtcbiAgICB9XG4gICAgcGFydHMudW5zaGlmdChzKTtcbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuICBpZiAoIXBhcnRzLmxlbmd0aCkgcmV0dXJuIGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgY29uc3Qgb3B0aW1pemVkID0gb3B0aW1pemVQYXRoKHBhcnRzLCBhbmNob3JJZCwgZWwsIGNzc1Njb3BlKTtcbiAgcmV0dXJuIHBhcnRzVG9TZWxlY3RvcihvcHRpbWl6ZWQsIGFuY2hvcklkKTtcbn07XG5cbi8vIC0tLS0gTmFtaW5nLCByb2xlcywgYW5jZXN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSb2xlcyB3aG9zZSBhY2Nlc3NpYmxlTmFtZSBpcywgcGVyIHRoZSBBY2NOYW1lIGFsZ29yaXRobSwgdGhlIHJlY3Vyc2l2ZVxuLy8gY29uY2F0ZW5hdGlvbiBvZiBldmVyeSBkZXNjZW5kYW50J3MgYWNjZXNzaWJsZSB0ZXh0LiBGb3IgdGhlc2UgdGhlIGZpZWxkXG4vLyBiZWNvbWVzIGEgdXNlbGVzcyAyMDAtY2hhciBkdW1wIG9mIHRoZSB3aG9sZSBzdWJ0cmVlIChvZnRlbiB0cnVuY2F0ZWRcbi8vIG1pZC13b3JkKS4gV2UgT05MWSBzdXJmYWNlIGFuIGV4cGxpY2l0IGFyaWEtbGFiZWwgLyB0aXRsZSAvIGFsdCBmb3Jcbi8vIGNvbnRhaW5lciByb2xlcyDigJQgb3RoZXJ3aXNlIGxlYXZlIGl0IGVtcHR5IGFuZCBsZXQgdGhlIExMTSByZWFkIHRoZVxuLy8gY2hpbGRyZW4gc2VwYXJhdGVseS5cbmNvbnN0IENPTlRBSU5FUl9ST0xFUyA9IG5ldyBTZXQoW1xuICAnZ3JvdXAnLCAncmVnaW9uJywgJ2xpc3QnLCAnbGlzdGJveCcsICdncmlkJywgJ2dyaWRjZWxsJywgJ3Jvd2dyb3VwJyxcbiAgJ3JvdycsICd0YWJsZScsICdtYWluJywgJ25hdmlnYXRpb24nLCAnYmFubmVyJywgJ2NvbnRlbnRpbmZvJyxcbiAgJ2NvbXBsZW1lbnRhcnknLCAndGFicGFuZWwnLCAnYXJ0aWNsZScsICdzZWN0aW9uJywgJ2RvY3VtZW50JyxcbiAgJ2ZlZWQnLCAnZmlndXJlJywgJ2Zvcm0nLFxuXSk7XG5cbi8vIFJlc29sdmUgdGV4dCB0aGUgYWNjbmFtZSBhbGdvcml0aG0gcHVsbHMgZnJvbSByZWZlcmVuY2VkIGVsZW1lbnRzLiBVc2VkXG4vLyBmb3IgYm90aCBgYXJpYS1sYWJlbGxlZGJ5YCAocHJpb3JpdHkpIGFuZCBgPGxhYmVsIGZvcj1cImlkXCI+YCBhc3NvY2lhdGlvblxuLy8gKGZvcm0tY29udHJvbCBmYWxsYmFjaykuIElkcyBpbiBpZHJlZnMgYXJlIHNwYWNlLXNlcGFyYXRlZDsgZWFjaCByZWYnc1xuLy8gcmVzb2x2ZWQgdGV4dCBpcyBqb2luZWQgYnkgYSBzaW5nbGUgc3BhY2UuXG5jb25zdCBjb2xsZWN0SWRSZWZUZXh0ID0gKHJlZnM6IHN0cmluZywgc2NvcGU6IERvY3VtZW50IHwgU2hhZG93Um9vdCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGlkIG9mIHJlZnMuc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbikpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgbm9kZSA9IHNjb3BlLmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgIGlmIChub2RlKSBwYXJ0cy5wdXNoKHRyaW1UZXh0KG5vZGUudGV4dENvbnRlbnQsIDE4MCkpO1xuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICB9XG4gIHJldHVybiBwYXJ0cy5maWx0ZXIoQm9vbGVhbikuam9pbignICcpO1xufTtcblxuY29uc3QgYWNjZXNzaWJsZU5hbWUgPSAoZWw6IEVsZW1lbnQsIHJvbGU6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgPT4ge1xuICAvLyBQcmlvcml0eSBmb2xsb3dzIHRoZSBhY2NuYW1lIGFsZ29yaXRobSAoc2ltcGxpZmllZCk6XG4gIC8vICAgMS4gYXJpYS1sYWJlbGxlZGJ5IOKAlCByZXNvbHZlZCB0ZXh0IG9mIGV2ZXJ5IHJlZmVyZW5jZWQgaWQuXG4gIC8vICAgMi4gYXJpYS1sYWJlbCDigJQgZGlyZWN0IHN0cmluZy5cbiAgLy8gICAzLiBGb3IgZm9ybSBjb250cm9sczogYXNzb2NpYXRlZCA8bGFiZWw+IChlaXRoZXIgYDxsYWJlbCBmb3I9SUQ+YFxuICAvLyAgICAgIE9SIGFuIGFuY2VzdG9yIDxsYWJlbD4gdGhhdCB3cmFwcyB0aGUgY29udHJvbCkuIEV2ZXJ5XG4gIC8vICAgICAgZnJhbWV3b3JrIHdlYXRoZXIgYXBwIHBhaXJzIHRoZSBzZWFyY2ggaW5wdXQgd2l0aCBhXG4gIC8vICAgICAgdmlzdWFsbHktaGlkZGVuIGxhYmVsOyB3aXRob3V0IGZvbGxvd2luZyB0aGUgbGluayBQaW5jaEdyYWJcbiAgLy8gICAgICByZXR1cm5zIGFuIGVtcHR5IGFjY2Vzc2libGVOYW1lLlxuICAvLyAgIDQuIHRpdGxlIC8gYWx0IC8gcGxhY2Vob2xkZXIgKG9ubHkgd2hlbiBub25lIG9mIHRoZSBhYm92ZSBoaXQpLlxuICAvLyAgIDUuIHRleHRDb250ZW50IChzdXBwcmVzc2VkIGZvciBjb250YWluZXIgcm9sZXMgd2hvc2UgYWNjbmFtZVxuICAvLyAgICAgIHdvdWxkIG90aGVyd2lzZSBiZSBhIDIwMC1jaGFyIHN1YnRyZWUgZHVtcCkuXG4gIGNvbnN0IGxhYmVsbGVkYnkgPSBhdHRyKGVsLCAnYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gIGlmIChsYWJlbGxlZGJ5KSB7XG4gICAgY29uc3Qgcm9vdCA9IGVsLmdldFJvb3ROb2RlKCk7XG4gICAgY29uc3Qgc2NvcGU6IERvY3VtZW50IHwgU2hhZG93Um9vdCA9IHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdCA6IGRvY3VtZW50O1xuICAgIGNvbnN0IHRleHQgPSBjb2xsZWN0SWRSZWZUZXh0KGxhYmVsbGVkYnksIHNjb3BlKTtcbiAgICBpZiAodGV4dCkgcmV0dXJuIHRyaW1UZXh0KHRleHQsIDE4MCk7XG4gIH1cbiAgY29uc3QgYXJpYUxhYmVsID0gYXR0cihlbCwgJ2FyaWEtbGFiZWwnKTtcbiAgaWYgKGFyaWFMYWJlbCkgcmV0dXJuIHRyaW1UZXh0KGFyaWFMYWJlbCwgMTgwKTtcblxuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGlzRm9ybUNvbnRyb2wgPSB0YWcgPT09ICdpbnB1dCcgfHwgdGFnID09PSAnc2VsZWN0JyB8fCB0YWcgPT09ICd0ZXh0YXJlYScgfHwgdGFnID09PSAnYnV0dG9uJyB8fCB0YWcgPT09ICdtZXRlcicgfHwgdGFnID09PSAncHJvZ3Jlc3MnIHx8IHRhZyA9PT0gJ291dHB1dCc7XG4gIGlmIChpc0Zvcm1Db250cm9sKSB7XG4gICAgaWYgKGVsLmlkKSB7XG4gICAgICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgICAgIGNvbnN0IHNjb3BlOiBEb2N1bWVudCB8IFNoYWRvd1Jvb3QgPSByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3QgOiBkb2N1bWVudDtcbiAgICAgIGxldCBsYWJlbEZvcjogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgICAgdHJ5IHsgbGFiZWxGb3IgPSBzY29wZS5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke2VzY2FwZUNzcyhlbC5pZCl9XCJdYCk7IH0gY2F0Y2ggeyAvKiBpbnZhbGlkIGlkICovIH1cbiAgICAgIGlmIChsYWJlbEZvcikge1xuICAgICAgICBjb25zdCB0ZXh0ID0gdHJpbVRleHQobGFiZWxGb3IudGV4dENvbnRlbnQsIDE4MCk7XG4gICAgICAgIGlmICh0ZXh0KSByZXR1cm4gdGV4dDtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGxhYmVsUGFyZW50OiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKGxhYmVsUGFyZW50KSB7XG4gICAgICBpZiAobGFiZWxQYXJlbnQudGFnTmFtZSA9PT0gJ0xBQkVMJykge1xuICAgICAgICBjb25zdCB0ZXh0ID0gdHJpbVRleHQobGFiZWxQYXJlbnQudGV4dENvbnRlbnQsIDE4MCk7XG4gICAgICAgIGlmICh0ZXh0KSByZXR1cm4gdGV4dDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBsYWJlbFBhcmVudCA9IGxhYmVsUGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdGl0bGVBdHRyID0gYXR0cihlbCwgJ3RpdGxlJyk7XG4gIGlmICh0aXRsZUF0dHIpIHJldHVybiB0cmltVGV4dCh0aXRsZUF0dHIsIDE4MCk7XG4gIGNvbnN0IGFsdEF0dHIgPSBhdHRyKGVsLCAnYWx0Jyk7XG4gIGlmIChhbHRBdHRyKSByZXR1cm4gdHJpbVRleHQoYWx0QXR0ciwgMTgwKTtcbiAgY29uc3QgcGxhY2Vob2xkZXJBdHRyID0gYXR0cihlbCwgJ3BsYWNlaG9sZGVyJyk7XG4gIGlmIChwbGFjZWhvbGRlckF0dHIpIHJldHVybiB0cmltVGV4dChwbGFjZWhvbGRlckF0dHIsIDE4MCk7XG4gIGlmIChyb2xlICYmIENPTlRBSU5FUl9ST0xFUy5oYXMocm9sZSkpIHJldHVybiAnJztcblxuICBpZiAoIWlzTmFtZUZyb21Db250ZW50KGVsLCB0YWcsIHJvbGUpKSByZXR1cm4gJyc7XG4gIHJldHVybiB0cmltVGV4dChlbC50ZXh0Q29udGVudCwgMTgwKTtcbn07XG5cbi8vIFRhZ3Mgd2hvc2UgaW1wbGljaXQgcm9sZSBoYXMgXCJOYW1lIGZyb206IGNvbnRlbnRzXCIgaW4gdGhlIEFSSUEgc3BlYy5cbi8vIFRoZXNlIGFyZSBsZWFmLWlzaCBvciBuYXR1cmFsbHktbGFiZWxlZC1ieS1jaGlsZHJlbiBlbGVtZW50czsgY2FwdHVyaW5nXG4vLyBvbmUgbWVhbnMgdGhlIHVzZXIgd2FudHMgdGhlIHJlbmRlcmVkIHRleHQgYXMgdGhlIG5hbWUuXG5jb25zdCBOQU1FX0ZST01fQ09OVEVOVF9UQUdTID0gbmV3IFNldChbXG4gICdhJywgJ2J1dHRvbicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsXG4gICdzdW1tYXJ5JywgJ3RoJywgJ3RkJywgJ2NhcHRpb24nLCAnZmlnY2FwdGlvbicsICdsZWdlbmQnLCAnbGFiZWwnLFxuICAnb3B0aW9uJywgJ291dHB1dCcsICdkdCcsXG5dKTtcbi8vIEV4cGxpY2l0IEFSSUEgcm9sZXMgaW4gXCJOYW1lIGZyb206IGNvbnRlbnRzXCIuXG5jb25zdCBOQU1FX0ZST01fQ09OVEVOVF9ST0xFUyA9IG5ldyBTZXQoW1xuICAnYnV0dG9uJywgJ2NlbGwnLCAnY2hlY2tib3gnLCAnY29sdW1uaGVhZGVyJywgJ2dyaWRjZWxsJywgJ2hlYWRpbmcnLFxuICAnbGluaycsICdtZW51aXRlbScsICdtZW51aXRlbWNoZWNrYm94JywgJ21lbnVpdGVtcmFkaW8nLCAnb3B0aW9uJyxcbiAgJ3JhZGlvJywgJ3JvdycsICdyb3doZWFkZXInLCAnc3dpdGNoJywgJ3RhYicsICd0b29sdGlwJywgJ3RyZWVpdGVtJyxcbl0pO1xuY29uc3QgaXNOYW1lRnJvbUNvbnRlbnQgPSAoZWw6IEVsZW1lbnQsIHRhZzogc3RyaW5nLCByb2xlOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gIGlmIChyb2xlICYmIE5BTUVfRlJPTV9DT05URU5UX1JPTEVTLmhhcyhyb2xlKSkgcmV0dXJuIHRydWU7XG4gIGlmIChOQU1FX0ZST01fQ09OVEVOVF9UQUdTLmhhcyh0YWcpKSByZXR1cm4gdHJ1ZTtcbiAgLy8gSW5saW5lIC8gcGhyYXNpbmcgdGFncyBhbHNvIGxlZ2l0aW1hdGVseSBnZXQgdGV4dENvbnRlbnQgYXMgdGhlaXJcbiAgLy8gXCJuYW1lXCIg4oCUIGNhcHR1cmluZyBhIDxzcGFuPkNsaWNrPC9zcGFuPiBzaG91bGQgc2hvdyBcIkNsaWNrXCIsIG5vdCBcIlwiLlxuICAvLyBXZSBvbmx5IGFsbG93IHRoaXMgd2hlbiB0aGUgZWxlbWVudCBoYXMgT05MWSB0ZXh0LW5vZGUgY2hpbGRyZW4gKG5vXG4gIC8vIHN0cnVjdHVyYWwgY2hpbGRyZW4pLCBzbyBhIDxzcGFuPiB3cmFwcGluZyBzZXZlbiBjYXJkcyBzdGlsbCByZXR1cm5zXG4gIC8vIGVtcHR5LlxuICBjb25zdCBJTkxJTkVfUEhSQVNJTkcgPSBuZXcgU2V0KFsnc3BhbicsICdlbScsICdzdHJvbmcnLCAnYicsICdpJywgJ21hcmsnLCAnc21hbGwnLCAnY29kZScsICdrYmQnLCAnc2FtcCcsICd2YXInLCAndGltZScsICdjaXRlJywgJ3EnLCAnYWJicicsICdzdWInLCAnc3VwJ10pO1xuICBpZiAoSU5MSU5FX1BIUkFTSU5HLmhhcyh0YWcpICYmICFlbC5jaGlsZHJlbi5sZW5ndGgpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBpbXBsaWNpdFJvbGUgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHJldHVybiAnYnV0dG9uJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuICd0ZXh0Ym94JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkgcmV0dXJuICd0ZXh0Ym94JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpIHJldHVybiAnbGlzdGJveCc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ICYmIGVsLmhyZWYpIHJldHVybiAnbGluayc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxMSUVsZW1lbnQpIHJldHVybiAnbGlzdGl0ZW0nO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVUxpc3RFbGVtZW50IHx8IGVsIGluc3RhbmNlb2YgSFRNTE9MaXN0RWxlbWVudCkgcmV0dXJuICdsaXN0JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTFRhYmxlRWxlbWVudCkgcmV0dXJuICd0YWJsZSc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxUYWJsZUNlbGxFbGVtZW50KSByZXR1cm4gJ2NlbGwnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVGFibGVSb3dFbGVtZW50KSByZXR1cm4gJ3Jvdyc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxGb3JtRWxlbWVudCkgcmV0dXJuICdmb3JtJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTFByb2dyZXNzRWxlbWVudCkgcmV0dXJuICdwcm9ncmVzc2Jhcic7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxNZXRlckVsZW1lbnQpIHJldHVybiAnbWV0ZXInO1xuICByZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IFNFTUFOVElDX1RBR1MgPSBuZXcgU2V0KFsnbWFpbicsICdzZWN0aW9uJywgJ2FydGljbGUnLCAnbmF2JywgJ2hlYWRlcicsICdmb290ZXInLCAnYXNpZGUnLCAnZm9ybScsICd0YWJsZScsICd1bCcsICdvbCddKTtcblxuY29uc3QgY29tcG9uZW50Um9vdCA9IChlbDogRWxlbWVudCk6IHtjb21wYWN0OiBzdHJpbmd9IHwgbnVsbCA9PiB7XG4gIGxldCBjdXJyZW50OiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gIGxldCBkZXB0aCA9IDA7XG4gIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGN1cnJlbnQgIT09IGRvY3VtZW50LmJvZHkgJiYgZGVwdGggPCAxMikge1xuICAgIGNvbnN0IG1hcmtlciA9XG4gICAgICBjdXJyZW50LmlkIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jb21wb25lbnQnKSB8fFxuICAgICAgY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdGlkJykgfHxcbiAgICAgIGN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRlc3QnKSB8fFxuICAgICAgY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3knKSB8fFxuICAgICAgY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcWEnKSB8fFxuICAgICAgY3VycmVudC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSB8fFxuICAgICAgU0VNQU5USUNfVEFHUy5oYXMoY3VycmVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICBpZiAobWFya2VyKSByZXR1cm4ge2NvbXBhY3Q6IGNvbXBhY3RUYXJnZXQoY3VycmVudCl9O1xuICAgIGlmIChjdXJyZW50LnBhcmVudEVsZW1lbnQgPT09IG51bGwgJiYgY3VycmVudC5wYXJlbnROb2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50Tm9kZS5ob3N0IHx8IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIGRlcHRoKys7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBhbmNlc3RvckNoYWluID0gKGVsOiBFbGVtZW50LCBkZXB0aCA9IDQpOiBBbmNlc3RvcltdID0+IHtcbiAgY29uc3Qgb3V0OiBBbmNlc3RvcltdID0gW107XG4gIGxldCBjdXJyZW50ID0gZWwucGFyZW50RWxlbWVudDtcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSBkb2N1bWVudC5ib2R5ICYmIGkgPCBkZXB0aCkge1xuICAgIGNvbnN0IGl0ZW06IEFuY2VzdG9yID0ge3RhZzogY3VycmVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9O1xuICAgIGlmIChpc1N0YWJsZUlkKGN1cnJlbnQuaWQpKSBpdGVtLmlkID0gY3VycmVudC5pZDtcbiAgICBjb25zdCByb2xlID0gYXR0cihjdXJyZW50LCAncm9sZScpO1xuICAgIGlmIChyb2xlKSBpdGVtLnJvbGUgPSByb2xlO1xuICAgIGNvbnN0IHRpZCA9IGF0dHIoY3VycmVudCwgJ2RhdGEtdGVzdGlkJykgfHwgYXR0cihjdXJyZW50LCAnZGF0YS10ZXN0JykgfHxcbiAgICAgIGF0dHIoY3VycmVudCwgJ2RhdGEtY3knKSB8fCBhdHRyKGN1cnJlbnQsICdkYXRhLXFhJyk7XG4gICAgaWYgKHRpZCkgaXRlbS50ZXN0SWQgPSB0aWQ7XG4gICAgY29uc3QgY2xzID0gY3VycmVudC5jbGFzc0xpc3QgPyBBcnJheS5mcm9tKGN1cnJlbnQuY2xhc3NMaXN0KS5zbGljZSgwLCAzKSA6IFtdO1xuICAgIGlmIChjbHMubGVuZ3RoKSBpdGVtLmNsYXNzZXMgPSBjbHM7XG4gICAgb3V0LnB1c2goaXRlbSk7XG4gICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50RWxlbWVudDtcbiAgICBpKys7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIC0tLS0gQXR0cnMgLyBzdHlsZXMgLyBtYXRjaGVkIHJ1bGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgQVRUUl9BTExPV0xJU1QgPSBuZXcgU2V0KFtcbiAgJ2hyZWYnLCAnc3JjJywgJ2FsdCcsICd0aXRsZScsICdwbGFjZWhvbGRlcicsICduYW1lJywgJ3R5cGUnLCAndmFsdWUnLCAndGFyZ2V0JywgJ2ZvcicsXG4gICdhcmlhLWxhYmVsJywgJ2FyaWEtbGFiZWxsZWRieScsICdhcmlhLWRlc2NyaWJlZGJ5JywgJ2FyaWEtY29udHJvbHMnLCAnYXJpYS1leHBhbmRlZCcsXG4gICdhcmlhLWNoZWNrZWQnLCAnYXJpYS1zZWxlY3RlZCcsICdhcmlhLWhhc3BvcHVwJywgJ2FyaWEtbGl2ZScsICdhcmlhLWhpZGRlbicsICdyb2xlJyxcbl0pO1xuY29uc3QgQVRUUl9QUkVGSVhfQUxMT1cgPSBbJ2FyaWEtJywgJ2RhdGEtJ107XG5jb25zdCBBVFRSX0JMT0NLTElTVCA9IG5ldyBTZXQoWydjbGFzcycsICdzdHlsZScsICdpZCddKTtcblxuLy8gUGVyLWlucHV0LXR5cGUgZm9ybWF0IGhpbnRzIHNvIGFuIExMTSBjb25zdW1pbmcgdGhlIGV4cG9ydCBkb2Vzbid0IGhhdmVcbi8vIHRvIGluZmVyIHRoZSBleHBlY3RlZCBzaGFwZS4gRGlyZWN0IHBvcnQgZnJvbSBicm93c2VyLXVzZSdzIHNlcmlhbGl6ZXIuXG5jb25zdCBJTlBVVF9GT1JNQVRfSElOVFM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIGRhdGU6ICdZWVlZLU1NLUREJyxcbiAgJ2RhdGV0aW1lLWxvY2FsJzogJ1lZWVktTU0tRERUSEg6bW0nLFxuICBtb250aDogJ1lZWVktTU0nLFxuICB0aW1lOiAnSEg6bW0nLFxuICB3ZWVrOiAnWVlZWS1Xd3cnLFxuICBudW1iZXI6ICdudW1lcmljJyxcbiAgcmFuZ2U6ICdudW1lcmljJyxcbiAgdGVsOiAncGhvbmUnLFxuICBlbWFpbDogJ2VtYWlsJyxcbiAgdXJsOiAndXJsJyxcbiAgY29sb3I6ICcjcnJnZ2JiJyxcbn07XG5cbi8vIEF0dHJzIHRoYXQgYXJlIGFsd2F5cyBwcm9tb3RlZCB0byB0b3AtbGV2ZWwgZW50cnkgZmllbGRzIChgdGVzdElkYCxcbi8vIGBhY2Nlc3NpYmxlTmFtZWAsIGByb2xlYCkuIEtlZXBpbmcgdGhlbSBBTFNPIGluIGBhdHRyc2Agd2FzIGR1cGxpY2F0ZVxuLy8gcGF5bG9hZCDigJQgZHJvcCB0aGVtIGhlcmUgc28gdGhlIGNvbnN1bWVyIHNlZXMgb25lIGNhbm9uaWNhbCBzb3VyY2UuXG4vLyBgZGF0YS10ZXN0aWRgLCBgZGF0YS10ZXN0YCwgYGRhdGEtY3lgLCBgZGF0YS1xYWAgYWxsIGdldCBwcm9tb3RlZC5cbmNvbnN0IEFUVFJfREVEVVBfQUdBSU5TVF9UT1BfTEVWRUwgPSBuZXcgU2V0KFtcbiAgJ2RhdGEtdGVzdGlkJywgJ2RhdGEtdGVzdCcsICdkYXRhLWN5JywgJ2RhdGEtcWEnLFxuICAnYXJpYS1sYWJlbCcsICdyb2xlJywgJ3RpdGxlJywgJ2FsdCcsXG5dKTtcblxuLy8gUmVnZXggZGVueWxpc3RzIGZvciBsaWtlbHktc2VjcmV0LWJlYXJpbmcgc3RyaW5ncy4gTWF0Y2ggYWdhaW5zdCBhdHRyaWJ1dGVcbi8vIFZBTFVFUyDigJQgaWYgYSB2YWx1ZSBsb29rcyBsaWtlIGEgSldULCBhbiBPQXV0aCBiZWFyZXIsIG9yIGEgbG9uZyB0b2tlblxuLy8gc2FuZHdpY2hlZCBpbiBhIG5vbi1hbGxvd2xpc3RlZCBzcG90LCB3ZSByZWRhY3QgcmF0aGVyIHRoYW4gc2hpcC5cbmNvbnN0IEpXVF9SRSA9IC9cXGJleUpbQS1aYS16MC05Xy1dezIwLH1cXC5bQS1aYS16MC05Xy1dezIwLH1cXC5bQS1aYS16MC05Xy1dezIwLH1cXGIvZztcbi8vIENvbnNlcnZhdGl2ZSBiZWFyZXItdG9rZW4gcmVnZXg6IDI0KyBjaGFycyBvZiBiYXNlNjR1cmwtaXNoIGNvbnRlbnRcbi8vIHdoZXJlIHRoZSBhdHRyaWJ1dGUgbmFtZSBzdHJvbmdseSBpbXBsaWVzIGEgc2VjcmV0LiBBcHBsaWVkIHBlci1hdHRyLlxuY29uc3QgU0VDUkVUX0FUVFJfTkFNRV9SRSA9IC8odG9rZW58c2VjcmV0fHBhc3N3b3JkfGFwaVtfLV0/a2V5fGF1dGgob3JpemF0aW9uKT98Y3NyZnx4c3JmfHNlc3Npb24pL2k7XG5jb25zdCByZWRhY3RTZWNyZXRzID0gKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGlmIChTRUNSRVRfQVRUUl9OQU1FX1JFLnRlc3QobmFtZSkgJiYgdmFsdWUubGVuZ3RoID4gOCkgcmV0dXJuICdbcmVkYWN0ZWQ6IGxvb2tzLWxpa2Utc2VjcmV0XSc7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKEpXVF9SRSwgJ1tyZWRhY3RlZDogand0XScpO1xufTtcblxuY29uc3QgcG9wdWxhdGVkQXR0cnMgPSAoZWw6IEVsZW1lbnQpOiB7YXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGhpbnRzOiBpbXBvcnQoJy4vdHlwZXMudHMnKS5FbnRyeUhpbnRzIHwgdW5kZWZpbmVkfSA9PiB7XG4gIGNvbnN0IGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGlmICghZWwuYXR0cmlidXRlcykgcmV0dXJuIHthdHRycywgaGludHM6IHVuZGVmaW5lZH07XG4gIGxldCB2YWx1ZU1hc2tlZCA9IGZhbHNlO1xuICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKSkge1xuICAgIGNvbnN0IG5hbWUgPSBhLm5hbWU7XG4gICAgaWYgKCFuYW1lIHx8IEFUVFJfQkxPQ0tMSVNULmhhcyhuYW1lKSkgY29udGludWU7XG4gICAgaWYgKEFUVFJfREVEVVBfQUdBSU5TVF9UT1BfTEVWRUwuaGFzKG5hbWUpKSBjb250aW51ZTtcbiAgICBjb25zdCBhbGxvd2VkID0gQVRUUl9BTExPV0xJU1QuaGFzKG5hbWUpIHx8IEFUVFJfUFJFRklYX0FMTE9XLnNvbWUoKHApID0+IG5hbWUuc3RhcnRzV2l0aChwKSk7XG4gICAgaWYgKCFhbGxvd2VkKSBjb250aW51ZTtcbiAgICBsZXQgdiA9IHRyaW1UZXh0KGEudmFsdWUsIE1BWF9BVFRSKTtcbiAgICAvLyBTZW5zaXRpdmUtaW5wdXQgcmVkYWN0aW9uLiBCZXlvbmQgYDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIj5gLCBhbHNvXG4gICAgLy8gc3RyaXAgdmFsdWVzIGZvcjogaGlkZGVuIGlucHV0cyAob2Z0ZW4gY2FycnkgQ1NSRi9KV1QgYm9vdHN0cmFwcyksXG4gICAgLy8gYW55IGlucHV0IHdob3NlIGBhdXRvY29tcGxldGVgIGF0dHJpYnV0ZSBtYXJrcyBpdCBhcyBhIHBheW1lbnQtXG4gICAgLy8gY2FyZCBmaWVsZCAoYGNjLW51bWJlcmAsIGBjYy1jc2NgLCBgY2MtZXhwKmApLCBvciBhIG9uZS10aW1lXG4gICAgLy8gY29kZS4gVGhlIHJvYXN0IGNhbGxlZCB0aGlzIG91dCB1bmRlciBUSC0wMDEgLyBELjQg4oCUIG5ldmVyIHNoaXAgYVxuICAgIC8vIHRva2VuIHNoYXBlZCBsaWtlIGEgY3JlZGl0LWNhcmQgb3Igc2Vzc2lvbiBib290c3RyYXAuXG4gICAgaWYgKG5hbWUgPT09ICd2YWx1ZScgJiYgZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIHYpIHtcbiAgICAgIGNvbnN0IHQgPSBlbC50eXBlO1xuICAgICAgY29uc3QgYWMgPSAoZWwuZ2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnKSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNvbnN0IHNlbnNpdGl2ZSA9IHQgPT09ICdwYXNzd29yZCdcbiAgICAgICAgfHwgdCA9PT0gJ2hpZGRlbidcbiAgICAgICAgfHwgL14oY2MtKG51bWJlcnxjc2N8ZXhwKC1tb250aHwteWVhcik/fG5hbWUpfG9uZS10aW1lLWNvZGV8bmV3LXBhc3N3b3JkfGN1cnJlbnQtcGFzc3dvcmQpJC8udGVzdChhYyk7XG4gICAgICBpZiAoc2Vuc2l0aXZlKSB7XG4gICAgICAgIHYgPSAn4oCi4oCi4oCi4oCiJztcbiAgICAgICAgdmFsdWVNYXNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodikge1xuICAgICAgY29uc3QgcmVkYWN0ZWQgPSByZWRhY3RTZWNyZXRzKG5hbWUsIHYpO1xuICAgICAgaWYgKHJlZGFjdGVkICE9PSB2KSB7IHYgPSByZWRhY3RlZDsgdmFsdWVNYXNrZWQgPSB0cnVlOyB9XG4gICAgfVxuICAgIGlmICh2KSBhdHRyc1tuYW1lXSA9IHY7XG4gIH1cbiAgLy8gQ2FwdHVyZS10aW1lIHN5bnRoZXRpYyBoaW50cyBzaXQgaW4gdGhlaXIgb3duIGJhZyAobm90IG1peGVkIHdpdGggcmVhbFxuICAvLyBhdHRyaWJ1dGVzKS4gUGVyLWlucHV0LXR5cGUgZm9ybWF0IGhlbHBzIGFuIExMTSBrbm93IHRoZSBleHBlY3RlZCBzaGFwZS5cbiAgY29uc3QgaGludHM6IGltcG9ydCgnLi90eXBlcy50cycpLkVudHJ5SGludHMgPSB7fTtcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgIGNvbnN0IGZtdCA9IElOUFVUX0ZPUk1BVF9ISU5UU1tlbC50eXBlXTtcbiAgICBpZiAoZm10KSBoaW50cy5mb3JtYXQgPSBmbXQ7XG4gIH1cbiAgaWYgKHZhbHVlTWFza2VkKSBoaW50cy52YWx1ZU1hc2tlZCA9IHRydWU7XG4gIHJldHVybiB7YXR0cnMsIGhpbnRzOiBPYmplY3Qua2V5cyhoaW50cykubGVuZ3RoID8gaGludHMgOiB1bmRlZmluZWR9O1xufTtcblxuY29uc3QgTk9JU0VfVkFMVUVTID0gbmV3IFNldChbJ2luaXRpYWwnLCAnaW5oZXJpdCcsICd1bnNldCcsICdyZXZlcnQnLCAncmV2ZXJ0LWxheWVyJywgJ25vcm1hbCcsICdhdXRvJywgJ25vbmUnLCAnc3RhdGljJ10pO1xuY29uc3QgTk9JU0VfRk9SX0tFWTogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge1xuICB2aXNpYmlsaXR5OiBbJ3Zpc2libGUnXSwgb3BhY2l0eTogWycxJ10sIG92ZXJmbG93OiBbJ3Zpc2libGUnXSxcbiAgb3ZlcmZsb3dYOiBbJ3Zpc2libGUnXSwgb3ZlcmZsb3dZOiBbJ3Zpc2libGUnXSwgZGlzcGxheTogWydpbmxpbmUnLCAnYmxvY2snXSxcbiAgbWFyZ2luOiBbJzBweCddLCBwYWRkaW5nOiBbJzBweCddLFxuICBib3JkZXI6IFsnMHB4IG5vbmUgcmdiKDAsIDAsIDApJywgJzBweCBub25lIHJnYmEoMCwgMCwgMCwgMCknXSxcbiAgYm9yZGVyUmFkaXVzOiBbJzBweCddLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFsncmdiYSgwLCAwLCAwLCAwKScsICd0cmFuc3BhcmVudCddLFxuICBwb2ludGVyRXZlbnRzOiBbJ2F1dG8nXSxcbiAgLy8gVGhlIHJvYXN0IGNhbGxlZCB0aGVzZSBvdXQgYXMgZGVmYXVsdC12YWx1ZSBub2lzZSB0aGF0IGFwcGVhcnMgb25cbiAgLy8gZXZlcnkgZW50cnk6IHRvcC9yaWdodC9ib3R0b20vbGVmdCBkZWZhdWx0IHRvIDBweCBvbiByZWxhdGl2ZVxuICAvLyBwb3NpdGlvbmluZywgZmxleERpcmVjdGlvbi9mbGV4V3JhcCBkZWZhdWx0IHRvIHJvdy9ub3dyYXAgb25cbiAgLy8gbm9uLWZsZXggY29udGFpbmVycywgYW5kIGB0cmFuc2l0aW9uOiBhbGxgIGlzIHRoZSB1bml2ZXJzYWwtcmVzZXRcbiAgLy8gc2lkZSBlZmZlY3Qg4oCUIG5vbmUgbWVhbmluZ2Z1bCBhcyBjYXB0dXJlZCBwZXItZWxlbWVudC5cbiAgdG9wOiBbJzBweCddLCByaWdodDogWycwcHgnXSwgYm90dG9tOiBbJzBweCddLCBsZWZ0OiBbJzBweCddLFxuICBmbGV4RGlyZWN0aW9uOiBbJ3JvdyddLFxuICBmbGV4V3JhcDogWydub3dyYXAnXSxcbiAgdHJhbnNpdGlvbjogWydhbGwnLCAnYWxsIDBzIGVhc2UgMHMnXSxcbiAgLy8gU3BlYyBkZWZhdWx0cyBmb3IgZ3JpZCArIGZsZXggYWxpZ25tZW50LlxuICBhbGlnbkl0ZW1zOiBbJ3N0cmV0Y2gnXSwganVzdGlmeUNvbnRlbnQ6IFsnZmxleC1zdGFydCcsICdub3JtYWwnXSxcbiAgLy8gdGV4dEFsaWduIGRlZmF1bHQgaXMgYHN0YXJ0YC4gVXNlZnVsIHdoZW4gZXhwbGljaXRseSBzZXQ7IG5vaXNlIG90aGVyd2lzZS5cbiAgdGV4dEFsaWduOiBbJ3N0YXJ0J10sXG4gIHRleHREZWNvcmF0aW9uOiBbJ25vbmUgc29saWQgcmdiKDAsIDAsIDApJ10sXG59O1xuY29uc3QgaXNNZWFuaW5nZnVsID0gKGs6IHN0cmluZywgdjogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHYgaXMgc3RyaW5nID0+IHtcbiAgaWYgKHYgPT0gbnVsbCB8fCB2ID09PSAnJykgcmV0dXJuIGZhbHNlO1xuICBpZiAoTk9JU0VfVkFMVUVTLmhhcyh2KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gIU5PSVNFX0ZPUl9LRVlba10/LmluY2x1ZGVzKHYpO1xufTtcblxuY29uc3QgU1RZTEVfS0VZUyA9IFtcbiAgJ2ZvbnRGYW1pbHknLCAnZm9udFNpemUnLCAnZm9udFdlaWdodCcsICdsaW5lSGVpZ2h0JywgJ2xldHRlclNwYWNpbmcnLFxuICAndGV4dEFsaWduJywgJ3RleHRUcmFuc2Zvcm0nLCAndGV4dERlY29yYXRpb24nLCAnY29sb3InLFxuICAncGFkZGluZycsICdtYXJnaW4nLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ21pbldpZHRoJywgJ21pbkhlaWdodCcsICdtYXhXaWR0aCcsICdtYXhIZWlnaHQnLFxuICAnYmFja2dyb3VuZENvbG9yJywgJ2JhY2tncm91bmRJbWFnZScsICdib3JkZXInLCAnYm9yZGVyUmFkaXVzJyxcbiAgJ2Rpc3BsYXknLCAncG9zaXRpb24nLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0JywgJ3pJbmRleCcsXG4gICdmbGV4RGlyZWN0aW9uJywgJ2FsaWduSXRlbXMnLCAnanVzdGlmeUNvbnRlbnQnLCAnZ2FwJywgJ2ZsZXhXcmFwJyxcbiAgJ2dyaWRUZW1wbGF0ZUNvbHVtbnMnLCAnZ3JpZFRlbXBsYXRlUm93cycsICdncmlkQ29sdW1uJywgJ2dyaWRSb3cnLFxuICAnYm94U2hhZG93JywgJ29wYWNpdHknLCAnb3ZlcmZsb3cnLCAnZmlsdGVyJywgJ2JhY2tkcm9wRmlsdGVyJywgJ3RyYW5zZm9ybScsXG4gICd0cmFuc2l0aW9uJywgJ2FuaW1hdGlvbicsICdjdXJzb3InLCAndmlzaWJpbGl0eScsICdwb2ludGVyRXZlbnRzJyxcbl0gYXMgY29uc3Q7XG5jb25zdCBTVFlMRV9MSU1JVFM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7XG4gIGZvbnRGYW1pbHk6IDI1NiwgYmFja2dyb3VuZEltYWdlOiAxMDAwLCBib3hTaGFkb3c6IDEwMDAsIGJvcmRlcjogMjU2LFxuICBmaWx0ZXI6IDUxMiwgYmFja2Ryb3BGaWx0ZXI6IDUxMiwgdHJhbnNmb3JtOiA1MTIsIHRyYW5zaXRpb246IDUxMiwgYW5pbWF0aW9uOiA1MTIsXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IDEwMDAsIGdyaWRUZW1wbGF0ZVJvd3M6IDEwMDAsXG59O1xuXG4vLyBQaXhlbCB2YWx1ZXMgcmVwb3J0ZWQgYnkgZ2V0Q29tcHV0ZWRTdHlsZSBvbiBoaWdoLURQUiBkaXNwbGF5cyBjb21lIGJhY2tcbi8vIGF0IHN1YnBpeGVsIHByZWNpc2lvbiAoYDE1Ljk5ODNweGAsIGAyMS45OTY1cHhgKS4gVGhlIGZyYWN0aW9uYWwgZGlnaXRzXG4vLyBhcmUgYXJpdGhtZXRpYyBub2lzZSwgbm90IG1lYW5pbmdmdWwgbGF5b3V0IHNpZ25hbCDigJQgcm91bmQgdG8gMSBkZWNpbWFsXG4vLyBmb3IgcmVhZGFiaWxpdHkuIFdlIG9ubHkgcm91bmQgc2ltcGxlIGA8ZmxvYXQ+cHhgIHZhbHVlczsgYW55dGhpbmcgbW9yZVxuLy8gY29tcGxleCAoY2FsYygpLCBzaG9ydGhhbmQgcGFkZGluZywgZXRjLikgaXMgbGVmdCBpbnRhY3QuXG5jb25zdCBQWF9SRSA9IC9eLT9cXGQrXFwuXFxkK3B4JC87XG5jb25zdCByb3VuZFB4ID0gKHY6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGlmICghUFhfUkUudGVzdCh2KSkgcmV0dXJuIHY7XG4gIGNvbnN0IG4gPSBwYXJzZUZsb2F0KHYpO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pID8gYCR7TWF0aC5yb3VuZChuICogMTApIC8gMTB9cHhgIDogdjtcbn07XG5cbi8vIFN0eWxlIHByb3BzIHdvcnRoIGR1YWwtZW1pdHRpbmcgYm90aCB0aGVpciByZXNvbHZlZCAoYHJnYiguLi4pYCkgYW5kXG4vLyBkZWNsYXJlZCAoYHZhcigtLXRva2VuKWApIGZvcm1zLiBUaGUgcmVzb2x2ZWQgdmFsdWUgaXMgd2hhdCBhbiBMTE1cbi8vIHJlYXNvbnMgYWJvdXQgdmlzdWFsbHk7IHRoZSBkZWNsYXJlZCBmb3JtIGlzIHdoYXQgdGhlIHVzZXIgd3JvdGUgaW5cbi8vIENTUyAvIHdoYXQgYSBkZXNpZ25lciByZWNvZ25pemVzLiBPbmx5IG1lYW5pbmdmdWwgZm9yIHRva2VuLWRyaXZlblxuLy8gdGhlbWluZywgc28gd2UgbGltaXQgdGhlIGR1YWwtZW1pdCB0byBjb2xvci1zaGFwZWQgcHJvcGVydGllcy5cbmNvbnN0IFZBUl9EVUFMX0VNSVQgPSBuZXcgU2V0KFsnY29sb3InLCAnYmFja2dyb3VuZENvbG9yJywgJ2JvcmRlckNvbG9yJ10pO1xuXG5jb25zdCBlc3NlbnRpYWxTdHlsZXMgPSAoZWw6IEVsZW1lbnQpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGNvbnN0IGsgb2YgU1RZTEVfS0VZUykge1xuICAgIGNvbnN0IHYgPSAoY3MgYXMgYW55KVtrXTtcbiAgICBpZiAoIWlzTWVhbmluZ2Z1bChrLCB2KSkgY29udGludWU7XG4gICAgb3V0W2tdID0gcm91bmRQeCh0cmltVGV4dCh2LCBTVFlMRV9MSU1JVFNba10gPz8gMTQwKSk7XG4gIH1cbiAgLy8gRHVhbC1lbWl0IHRoZSBvcmlnaW5hbCBgdmFyKC0t4oCmKWAgZm9ybSBmb3IgdGhlbWUtZHJpdmVuIHByb3BlcnRpZXMuXG4gIC8vIFdlIHB1bGwgZnJvbSB0aGUgaW5saW5lIGBzdHlsZWAgYXR0cmlidXRlIGZpcnN0IChjaGVhcGVzdCksIHRoZW4gd2Fsa1xuICAvLyBtYXRjaGVkUnVsZXMgZm9yIG9uZXMgd2hvc2UgZGVjbGFyZWQgdGV4dCBjb250YWlucyBhIGB2YXIoYC4gVGhlXG4gIC8vIHJlc29sdmVkIHZhbHVlIGFscmVhZHkgbGl2ZXMgaW4gYG91dFtrXWA7IHdlIGFkZCBhIGA8a2V5PlZhcmAgc2libGluZy5cbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IGsgb2YgVkFSX0RVQUxfRU1JVCkge1xuICAgICAgaWYgKCFvdXRba10pIGNvbnRpbnVlO1xuICAgICAgLy8gQ1NTU3R5bGVEZWNsYXJhdGlvbiB1c2VzIGtlYmFiLWNhc2UgaW4gYGdldFByb3BlcnR5VmFsdWVgLlxuICAgICAgY29uc3QgZGFzaEtleSA9IGsucmVwbGFjZSgvW0EtWl0vZywgKGMpID0+ICctJyArIGMudG9Mb3dlckNhc2UoKSk7XG4gICAgICBjb25zdCBpbmxpbmUgPSBlbC5zdHlsZT8uZ2V0UHJvcGVydHlWYWx1ZShkYXNoS2V5KT8udHJpbSgpO1xuICAgICAgaWYgKGlubGluZSAmJiBpbmxpbmUuaW5jbHVkZXMoJ3ZhcignKSkge1xuICAgICAgICBvdXRbYCR7a31WYXJgXSA9IHRyaW1UZXh0KGlubGluZSwgMTQwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbmNvbnN0IFBTRVVET19LRVlTID0gWydkaXNwbGF5JywgJ3Bvc2l0aW9uJywgJ3dpZHRoJywgJ2hlaWdodCcsICdiYWNrZ3JvdW5kQ29sb3InLCAnYmFja2dyb3VuZEltYWdlJywgJ2JvcmRlcicsICdib3JkZXJSYWRpdXMnLCAnYm94U2hhZG93JywgJ3RyYW5zZm9ybScsICdvcGFjaXR5JywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcsICd6SW5kZXgnXSBhcyBjb25zdDtcbmNvbnN0IHBzZXVkb1N0eWxlcyA9IChlbDogRWxlbWVudCk6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0+IHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PiA9IHt9O1xuICBmb3IgKGNvbnN0IHdoaWNoIG9mIFsnOjpiZWZvcmUnLCAnOjphZnRlciddKSB7XG4gICAgY29uc3QgY3MgPSBzYWZlQ2FsbCgoKSA9PiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgd2hpY2gpLCBudWxsKTtcbiAgICBpZiAoIWNzKSBjb250aW51ZTtcbiAgICBjb25zdCBjb250ZW50ID0gY3MuY29udGVudDtcbiAgICBpZiAoIWNvbnRlbnQgfHwgY29udGVudCA9PT0gJ25vbmUnIHx8IGNvbnRlbnQgPT09ICdub3JtYWwnKSBjb250aW51ZTtcbiAgICBjb25zdCBibG9jazogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtjb250ZW50OiB0cmltVGV4dChjb250ZW50LCAyNTYpfTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgUFNFVURPX0tFWVMpIHtcbiAgICAgIGNvbnN0IHYgPSAoY3MgYXMgYW55KVtrXTtcbiAgICAgIGlmIChpc01lYW5pbmdmdWwoaywgdikpIGJsb2NrW2tdID0gdHJpbVRleHQodiwgU1RZTEVfTElNSVRTW2tdID8/IDE0MCk7XG4gICAgfVxuICAgIG91dFt3aGljaC5yZXBsYWNlKCc6OicsICcnKV0gPSBibG9jaztcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gUHNldWRvLWNsYXNzZXMgc2FmZSBmb3IgYW55IHRhZy5cbmNvbnN0IFNUQVRFU19LRUVQX1VOSVZFUlNBTCA9IFsnaG92ZXInLCAnZm9jdXMnLCAnZm9jdXMtdmlzaWJsZScsICdmb2N1cy13aXRoaW4nLCAnYWN0aXZlJywgJ3RhcmdldCcsICd2aXNpdGVkJ10gYXMgY29uc3Q7XG4vLyBGb3JtLXN0YXRlIHBzZXVkb3MuIEFMTCBlbGVtZW50cyB0ZWNobmljYWxseSBtYXRjaCBgOnZhbGlkYCAvIGA6aW52YWxpZGBcbi8vIChwZXIgQ1NTIHNwZWMpLCBzbyBjYXB0dXJpbmcgdGhlbSBvbiBhIGA8YnV0dG9uPmAgb3IgYDxkaXY+YCBwcm9kdWNlc1xuLy8gYHN0YXRlcy52YWxpZDogdHJ1ZWAgbm9pc2UgdGhhdCBjb25mdXNlZCBMTE1zIChcInRoZSBidXR0b24gaXMgdmFsaWQ/XG4vLyB3aGF0IGRvZXMgdGhhdCBtZWFuP1wiKS4gT25seSBlbWl0IHRoZXNlIGZvciBnZW51aW5lIGZvcm0tY29udHJvbCB0YWdzLlxuY29uc3QgU1RBVEVTX0tFRVBfRk9STSA9IFsnY2hlY2tlZCcsICdkaXNhYmxlZCcsICdyZXF1aXJlZCcsICdvcHRpb25hbCcsICdyZWFkLW9ubHknLCAncmVhZC13cml0ZScsICdpbi1yYW5nZScsICdvdXQtb2YtcmFuZ2UnLCAndmFsaWQnLCAnaW52YWxpZCddIGFzIGNvbnN0O1xuY29uc3QgRk9STV9UQUdTID0gbmV3IFNldChbJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYScsICdvcHRpb24nLCAnZmllbGRzZXQnLCAnb3V0cHV0JywgJ3Byb2dyZXNzJywgJ21ldGVyJ10pO1xuLy8gdjI6IGFycmF5IGZvcm0uIEVhc2llciBmb3IgRHVja0RCIHF1ZXJpZXMgKGAnaG92ZXInID0gQU5ZKHN0YXRlcylgKSBhbmQgYVxuLy8gZmV3IGJ5dGVzIHNob3J0ZXIgb24gdGhlIHdpcmUgdGhhbiB0aGUgb2JqZWN0LWFzLXNldCBzaGFwZS5cbmNvbnN0IHBpY2tUcnVlU3RhdGVzID0gKGVsOiBFbGVtZW50KTogc3RyaW5nW10gPT4ge1xuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgcyBvZiBTVEFURVNfS0VFUF9VTklWRVJTQUwpIHtcbiAgICB0cnkgeyBpZiAoZWwubWF0Y2hlcyhgOiR7c31gKSkgb3V0LnB1c2gocyk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgaW52YWxpZCAqLyB9XG4gIH1cbiAgaWYgKEZPUk1fVEFHUy5oYXMoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgIGZvciAoY29uc3QgcyBvZiBTVEFURVNfS0VFUF9GT1JNKSB7XG4gICAgICB0cnkgeyBpZiAoZWwubWF0Y2hlcyhgOiR7c31gKSkgb3V0LnB1c2gocyk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuY29uc3QgU1RZTEVfSU5URVJFU1RTID0gW1xuICAnZGlzcGxheScsICdwb3NpdGlvbicsICd2aXNpYmlsaXR5JywgJ292ZXJmbG93JywgJ292ZXJmbG93WCcsICdvdmVyZmxvd1knLFxuICAnYm94U2l6aW5nJywgJ3dpZHRoJywgJ2hlaWdodCcsICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLCAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ21hcmdpbicsICdwYWRkaW5nJywgJ2JvcmRlcldpZHRoJywgJ2JvcmRlclRvcFdpZHRoJywgJ2JvcmRlclJpZ2h0V2lkdGgnLFxuICAnYm9yZGVyQm90dG9tV2lkdGgnLCAnYm9yZGVyTGVmdFdpZHRoJywgJ2JvcmRlclJhZGl1cycsICdjb2xvcicsICdiYWNrZ3JvdW5kQ29sb3InLFxuICAnZm9udEZhbWlseScsICdmb250U2l6ZScsICdmb250V2VpZ2h0JywgJ2xpbmVIZWlnaHQnLCAndGV4dEFsaWduJywgJ3RleHREZWNvcmF0aW9uJyxcbiAgJ29wYWNpdHknLCAndHJhbnNmb3JtJywgJ3RyYW5zaXRpb24nLCAnYW5pbWF0aW9uJyxcbl0gYXMgY29uc3Q7XG5cbi8vIFVuaXZlcnNhbCBzZWxlY3RvcnMgYW5kIEBtZWRpYSBwcmludCBibG9ja3MgYXJlIHByZXNlbnQgb24gZXZlcnkgY2FwdHVyZWRcbi8vIGVsZW1lbnQgYWNyb3NzIGJvdGggUGxhc21pYyBhbmQgdGhlIFdyYW5uZ2xlIGNvbnNvbGUuIFRoZXkgbmV2ZXIgZXhwbGFpblxuLy8gd2hhdCBtYWtlcyBhIFNQRUNJRklDIGVsZW1lbnQgbG9vayB0aGUgd2F5IGl0IGRvZXMsIHNvIHRoZXkncmUgcHVyZVxuLy8gbm9pc2Ug4oCUIH4yMSUgb2YgdG90YWwgcGF5bG9hZCBieXRlcyBwZXIgdGhlIHJvYXN0IG1lYXN1cmVtZW50LlxuY29uc3QgaXNGaWx0ZXJhYmxlU2VsZWN0b3IgPSAoc2VsOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgY29uc3QgdHJpbW1lZCA9IHNlbC5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuICBpZiAodHJpbW1lZCA9PT0gJyonKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKHRyaW1tZWQgPT09ICcqLCA6OmJlZm9yZSwgOjphZnRlcicpIHJldHVybiB0cnVlO1xuICBpZiAodHJpbW1lZCA9PT0gJzo6YmVmb3JlLCA6OmFmdGVyLCAqJykgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGNvbGxlY3RNYXRjaGVkUnVsZXMgPSAoZWw6IEVsZW1lbnQpOiBNYXRjaGVkUnVsZVtdID0+IHtcbiAgY29uc3QgcnVsZXM6IE1hdGNoZWRSdWxlW10gPSBbXTtcbiAgY29uc3QgbWVkaWFTdGFjazogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgcHVzaFJ1bGUgPSAocnVsZTogQ1NTU3R5bGVSdWxlKTogYm9vbGVhbiA9PiB7XG4gICAgdHJ5IHsgaWYgKCFlbC5tYXRjaGVzKHJ1bGUuc2VsZWN0b3JUZXh0KSkgcmV0dXJuIHRydWU7IH0gY2F0Y2ggeyByZXR1cm4gdHJ1ZTsgfVxuICAgIGlmIChpc0ZpbHRlcmFibGVTZWxlY3RvcihydWxlLnNlbGVjdG9yVGV4dCkpIHJldHVybiB0cnVlO1xuICAgIC8vIERyb3AgQG1lZGlhIHByaW50IGJsb2NrcyDigJQgY2FwdHVyZXMgYXJlIGFsd2F5cyBmb3IgdGhlIHNjcmVlbiB2aWV3LlxuICAgIGNvbnN0IG1lZGlhSm9pbmVkID0gbWVkaWFTdGFjay5qb2luKCcgJiYgJyk7XG4gICAgaWYgKC9cXGJwcmludFxcYi8udGVzdChtZWRpYUpvaW5lZCkgJiYgIS9cXGJzY3JlZW5cXGIvLnRlc3QobWVkaWFKb2luZWQpKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBkZWNsYXJlZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcCBvZiBTVFlMRV9JTlRFUkVTVFMpIHtcbiAgICAgIGNvbnN0IHYgPSBydWxlLnN0eWxlPy5nZXRQcm9wZXJ0eVZhbHVlKHApO1xuICAgICAgaWYgKHYpIGRlY2xhcmVkW3BdID0gdHJpbVRleHQodiwgMTQwKTtcbiAgICB9XG4gICAgaWYgKCFPYmplY3Qua2V5cyhkZWNsYXJlZCkubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBIHJ1bGUgY2FuIE1BVENIIHRoZSBzZWxlY3RvciB3aXRob3V0IGJlaW5nIEFDVElWRSBpZiBpdCBsaXZlc1xuICAgIC8vIGluc2lkZSBhbiB1bm1hdGNoZWQgQG1lZGlhIHF1ZXJ5LiBUZXN0IHdpdGggbWF0Y2hNZWRpYSBzb1xuICAgIC8vIHJlY2VpdmVycyBrbm93IHdoaWNoIHJ1bGVzIHNoYXBlZCB0aGUgY2FwdHVyZWQgdmlld3BvcnQgdnMuXG4gICAgLy8gd2hpY2ggd291bGQgc2hhcGUgYSBkaWZmZXJlbnQgb25lIChlLmcuIG1vYmlsZSBydWxlcyBjYXB0dXJlZFxuICAgIC8vIG9uIGRlc2t0b3ApLlxuICAgIGNvbnN0IG1lZGlhQWN0aXZlID0gbWVkaWFTdGFjay5sZW5ndGggPT09IDBcbiAgICAgID8gdHJ1ZVxuICAgICAgOiAoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIG1lZGlhU3RhY2sgam9pbnMgbXVsdGlwbGUgbmVzdGVkIEBtZWRpYSDigJQgYWxsIG11c3QgbWF0Y2guXG4gICAgICAgICAgZm9yIChjb25zdCBjb25kIG9mIG1lZGlhU3RhY2spIHtcbiAgICAgICAgICAgIGNvbnN0IHJhd0NvbmQgPSBjb25kLnJlcGxhY2UoL15AbWVkaWFcXHMqLywgJycpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaE1lZGlhKHJhd0NvbmQpLm1hdGNoZXMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgICB9KSgpO1xuICAgIGNvbnN0IHJ1bGVFbnRyeTogTWF0Y2hlZFJ1bGUgPSB7XG4gICAgICBzZWxlY3RvcjogcnVsZS5zZWxlY3RvclRleHQsXG4gICAgICBkZWNsYXJhdGlvbnM6IGRlY2xhcmVkLFxuICAgICAgLi4uKG1lZGlhU3RhY2subGVuZ3RoID8ge21lZGlhOiBtZWRpYUpvaW5lZH0gOiB7fSksXG4gICAgfTtcbiAgICBpZiAobWVkaWFTdGFjay5sZW5ndGgpIHJ1bGVFbnRyeS5tZWRpYUFjdGl2ZSA9IG1lZGlhQWN0aXZlO1xuICAgIHJ1bGVzLnB1c2gocnVsZUVudHJ5KTtcbiAgICByZXR1cm4gcnVsZXMubGVuZ3RoIDwgTUFYX1JVTEVTO1xuICB9O1xuICBjb25zdCB3YWxrID0gKHNoZWV0OiBDU1NTdHlsZVNoZWV0IHwgbnVsbCwgbGlzdDogQ1NTUnVsZUxpc3QpOiB2b2lkID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoICYmIHJ1bGVzLmxlbmd0aCA8IE1BWF9SVUxFUzsgaSsrKSB7XG4gICAgICBjb25zdCBydWxlID0gbGlzdFtpXTtcbiAgICAgIGlmICghcnVsZSB8fCB0eXBlb2YgcnVsZS50eXBlICE9PSAnbnVtYmVyJykgY29udGludWU7XG4gICAgICBpZiAocnVsZS50eXBlID09PSBDU1NSdWxlLlNUWUxFX1JVTEUpIHtcbiAgICAgICAgaWYgKCFwdXNoUnVsZShydWxlIGFzIENTU1N0eWxlUnVsZSkpIGJyZWFrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChydWxlLnR5cGUgPT09IENTU1J1bGUuTUVESUFfUlVMRSB8fCBydWxlLnR5cGUgPT09IENTU1J1bGUuU1VQUE9SVFNfUlVMRSkge1xuICAgICAgICBjb25zdCBjb25kID0gU3RyaW5nKChydWxlIGFzIENTU01lZGlhUnVsZSkuY29uZGl0aW9uVGV4dCB8fCAnJykudHJpbSgpO1xuICAgICAgICBpZiAoY29uZCkgbWVkaWFTdGFjay5wdXNoKGNvbmQpO1xuICAgICAgICBpZiAoKHJ1bGUgYXMgQ1NTR3JvdXBpbmdSdWxlKS5jc3NSdWxlcykgd2FsayhzaGVldCwgKHJ1bGUgYXMgQ1NTR3JvdXBpbmdSdWxlKS5jc3NSdWxlcyk7XG4gICAgICAgIGlmIChjb25kKSBtZWRpYVN0YWNrLnBvcCgpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChydWxlLnR5cGUgPT09IENTU1J1bGUuSU1QT1JUX1JVTEUgJiYgKHJ1bGUgYXMgQ1NTSW1wb3J0UnVsZSkuc3R5bGVTaGVldCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGltID0gKHJ1bGUgYXMgQ1NTSW1wb3J0UnVsZSkuc3R5bGVTaGVldDtcbiAgICAgICAgICBpZiAoaW0/LmNzc1J1bGVzKSB3YWxrKGltLCBpbS5jc3NSdWxlcyk7XG4gICAgICAgIH0gY2F0Y2ggeyAvKiBDT1JTLWJsb2NrZWQgc2hlZXQgKi8gfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgZm9yIChjb25zdCBzaGVldCBvZiBBcnJheS5mcm9tKGRvY3VtZW50LnN0eWxlU2hlZXRzIHx8IFtdKSkge1xuICAgIGNvbnN0IG0gPSBzaGVldC5tZWRpYT8ubWVkaWFUZXh0O1xuICAgIGlmIChtKSBtZWRpYVN0YWNrLnB1c2goYEBtZWRpYSAke219YCk7XG4gICAgbGV0IGNzczogQ1NTUnVsZUxpc3QgfCB1bmRlZmluZWQ7XG4gICAgdHJ5IHsgY3NzID0gc2hlZXQuY3NzUnVsZXM7IH0gY2F0Y2ggeyBpZiAobSkgbWVkaWFTdGFjay5wb3AoKTsgY29udGludWU7IH1cbiAgICBpZiAoY3NzKSB3YWxrKHNoZWV0LCBjc3MpO1xuICAgIGlmIChtKSBtZWRpYVN0YWNrLnBvcCgpO1xuICB9XG4gIHJldHVybiBydWxlcztcbn07XG5cbi8vIEV2ZW50LWhhbmRsZXIgcHJvYmVzLiBSZXR1cm5zIGEgZmxhdCBgeyBvbkNsaWNrOiBcImhhbmRsZXJOYW1lXCIsIOKApiB9YCBtYXBcbi8vIHB1bGxlZCBmcm9tIHdoYXRldmVyIGZyYW1ld29yayB3aXJlZCB0aGUgaGFuZGxlci4gVGhlIG1hcCBhbnN3ZXJzXG4vLyBcIndoaWNoIGhhbmRsZXIgcmFuIHdoZW4gdGhpcyBmaXJlZD9cIiB3aXRob3V0IGZvcmNpbmcgYW4gTExNIHRvIGdyZXBcbi8vIHRoZSBjb2RlYmFzZS4gVGhyZWUgc291cmNlcyBzdGFja2VkOlxuLy9cbi8vICAgMS4gUmVhY3QgZmliZXJzIOKAlCBgX19yZWFjdFByb3BzJDxrZXk+Lm9uWGAgKGZ1bmN0aW9uIHdob3NlIGAubmFtZWBcbi8vICAgICAgaXMgdGhlIHNvdXJjZSBuYW1lIGluIGRldiBidWlsZHMsIG1pbmlmaWVkIGluIHByb2QpLlxuLy8gICAyLiBWdWUgMyB2bm9kZSBwcm9wcyDigJQgYF9fdnVlUGFyZW50Q29tcG9uZW50LnZub2RlLnByb3BzLm9uWGBcbi8vICAgICAgKFZ1ZSAzIG5vcm1hbGl6ZXMgYEBjbGlja2AgdGVtcGxhdGUgYXR0cnMgdG8gYG9uQ2xpY2tgIG9uIHRoZVxuLy8gICAgICBjb21wb25lbnQgdm5vZGUpLlxuLy8gICAzLiBJbmxpbmUgYG9uKmAgSFRNTCBhdHRyaWJ1dGVzIOKAlCB0aGUgbGVnYWN5IGBvbmNsaWNrPVwi4oCmXCJgIGZvcm0uXG4vLyAgICAgIENhcHR1cmVkIHZhbHVlIGlzIHRoZSBzb3VyY2Ugc3RyaW5nIHdpdGggd2hpdGVzcGFjZSBjb2xsYXBzZWQsXG4vLyAgICAgIGNhcHBlZCB0byAyMDAgY2hhcnMgKGZ1bGwtc2NyaXB0IGlubGluZSBoYW5kbGVycyBnZXQgdHJ1bmNhdGVkKS5cbi8vXG4vLyBFYWNoIHNvdXJjZSBjYW4gY29udHJpYnV0ZTsgbGF0ZXIgc291cmNlcyBkb24ndCBvdmVyd3JpdGUgZWFybGllciBvbmVzXG4vLyDigJQgYSBSZWFjdCBoYW5kbGVyIGJlYXRzIGFuIGlubGluZSBvbmUgd2hlbiBib3RoIGV4aXN0IG9uIHRoZSBub2RlLlxuY29uc3QgSEFORExFUl9LRVlTID0gWydvbkNsaWNrJywgJ29uTW91c2VEb3duJywgJ29uU3VibWl0JywgJ29uQ2hhbmdlJywgJ29uS2V5RG93bicsICdvbkZvY3VzJywgJ29uQmx1cicsICdvbklucHV0J10gYXMgY29uc3Q7XG5jb25zdCBJTkxJTkVfT05fQVRUUlMgPSBbJ29uY2xpY2snLCAnb25tb3VzZWRvd24nLCAnb25zdWJtaXQnLCAnb25jaGFuZ2UnLCAnb25rZXlkb3duJywgJ29uZm9jdXMnLCAnb25ibHVyJywgJ29uaW5wdXQnXSBhcyBjb25zdDtcblxuY29uc3QgcmVhY3RFdmVudE5hbWVzID0gKGVsOiBFbGVtZW50LCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkID0+IHtcbiAgY29uc3QgcHJvcHNLZXkgPSBPYmplY3Qua2V5cyhlbCkuZmluZCgoaykgPT4gay5zdGFydHNXaXRoKCdfX3JlYWN0UHJvcHMkJykpO1xuICBpZiAoIXByb3BzS2V5KSByZXR1cm47XG4gIGNvbnN0IHByb3BzID0gKGVsIGFzIGFueSlbcHJvcHNLZXldIGFzIFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQ7XG4gIGlmICghcHJvcHMpIHJldHVybjtcbiAgZm9yIChjb25zdCBrIG9mIEhBTkRMRVJfS0VZUykge1xuICAgIGlmIChvdXRba10pIGNvbnRpbnVlO1xuICAgIGNvbnN0IGZuID0gcHJvcHNba107XG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgbiA9IGZuLm5hbWUgJiYgZm4ubmFtZSAhPT0gJycgPyBmbi5uYW1lIDogJzxhbm9ueW1vdXM+JztcbiAgICAgIG91dFtrXSA9IHRyaW1UZXh0KG4sIDgwKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHZ1ZUV2ZW50TmFtZXMgPSAoZWw6IEVsZW1lbnQsIG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHZvaWQgPT4ge1xuICAvLyBWdWUgMzogZXZlbnRzIGxpdmUgb24gdGhlIHBhcmVudC1jb21wb25lbnQgdm5vZGUncyBwcm9wcyBhcyBgb25DbGlja2AsXG4gIC8vIGBvbk15RXZlbnRgLCBldGMuIFZ1ZSAyOiBgZWwuX192dWVfXy4kbGlzdGVuZXJzYCBoYWQgdGhlbTsgd2Ugc25pZmZcbiAgLy8gYm90aCBzaGFwZXMuIENoZWFwIGZhbGx0aHJvdWdoIHdoZW4gbmVpdGhlciBpcyBwcmVzZW50LlxuICBjb25zdCB2OiBhbnkgPSAoZWwgYXMgYW55KS5fX3Z1ZVBhcmVudENvbXBvbmVudCB8fCAoZWwgYXMgYW55KS5fX3Z1ZV9fO1xuICBpZiAoIXYpIHJldHVybjtcbiAgY29uc3QgcHJvcHMgPSB2LnZub2RlPy5wcm9wcyB8fCB2LiRvcHRpb25zPy5wcm9wc0RhdGEgfHwgdi4kbGlzdGVuZXJzO1xuICBpZiAoIXByb3BzIHx8IHR5cGVvZiBwcm9wcyAhPT0gJ29iamVjdCcpIHJldHVybjtcbiAgZm9yIChjb25zdCBrIG9mIEhBTkRMRVJfS0VZUykge1xuICAgIGlmIChvdXRba10pIGNvbnRpbnVlO1xuICAgIGNvbnN0IGZuID0gcHJvcHNba10gfHwgcHJvcHNbay50b0xvd2VyQ2FzZSgpXTtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBuID0gZm4ubmFtZSAmJiBmbi5uYW1lICE9PSAnJyA/IGZuLm5hbWUgOiAnPHZ1ZS1hbm9ueW1vdXM+JztcbiAgICAgIG91dFtrXSA9IHRyaW1UZXh0KG4sIDgwKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGlubGluZUV2ZW50TmFtZXMgPSAoZWw6IEVsZW1lbnQsIG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHZvaWQgPT4ge1xuICBmb3IgKGNvbnN0IGF0dHIgb2YgSU5MSU5FX09OX0FUVFJTKSB7XG4gICAgY29uc3QgY2FtZWwgPSAnb24nICsgYXR0ci5jaGFyQXQoMikudG9VcHBlckNhc2UoKSArIGF0dHIuc2xpY2UoMyk7XG4gICAgaWYgKG91dFtjYW1lbF0pIGNvbnRpbnVlO1xuICAgIGNvbnN0IHYgPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgaWYgKHYpIG91dFtjYW1lbF0gPSB0cmltVGV4dCh2LCAyMDApO1xuICB9XG59O1xuXG5jb25zdCBjb2xsZWN0RXZlbnROYW1lcyA9IChlbDogRWxlbWVudCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsID0+IHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIHJlYWN0RXZlbnROYW1lcyhlbCwgb3V0KTtcbiAgdnVlRXZlbnROYW1lcyhlbCwgb3V0KTtcbiAgaW5saW5lRXZlbnROYW1lcyhlbCwgb3V0KTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG91dCkubGVuZ3RoID8gb3V0IDogbnVsbDtcbn07XG5cbi8vIFwiQmVoYXZpb3JcIiBhdHRyaWJ1dGVzIOKAlCBodG14LCBTdGltdWx1cywgQWxwaW5lLCBUdXJiby4gU2VydmVyLXJlbmRlcmVkXG4vLyBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzOyB0aGUgd2lyaW5nIGZvciBcIndoYXQgdGhpcyBidXR0b24gZG9lc1wiXG4vLyBsaXZlcyBpbiBIVE1MIGF0dHJpYnV0ZXMuIENhcHR1cmUgdGhlbSBhcyBhIHNlcGFyYXRlIGZpZWxkIHNvIGFuIExMTVxuLy8gYXNrZWQgXCJ3aHkgZG9lc24ndCB0aGlzIGJ1dHRvbiB3b3JrP1wiIHNlZXMgdGhlIGJpbmRpbmcgaW1tZWRpYXRlbHlcbi8vIHJhdGhlciB0aGFuIGRpZ2dpbmcgdGhyb3VnaCBgYXR0cnNgLlxuY29uc3QgQkVIQVZJT1JfQVRUUl9QUkVGSVhFUyA9IFsnaHgtJywgJ2RhdGEtaHgtJywgJ2RhdGEtY29udHJvbGxlcicsICdkYXRhLWFjdGlvbicsICdkYXRhLXRhcmdldCcsICd4LWRhdGEnLCAneC1vbjonLCAneC1iaW5kOicsICd4LW1vZGVsJywgJ3gtc2hvdycsICd4LWlmJywgJ0BjbGljaycsICdAc3VibWl0JywgJ2RhdGEtdHVyYm8nXSBhcyBjb25zdDtcbmNvbnN0IGNvbGxlY3RCZWhhdmlvckF0dHJzID0gKGVsOiBFbGVtZW50KTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwgPT4ge1xuICBpZiAoIWVsLmF0dHJpYnV0ZXMpIHJldHVybiBudWxsO1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgZm9yIChjb25zdCBhIG9mIEFycmF5LmZyb20oZWwuYXR0cmlidXRlcykpIHtcbiAgICBjb25zdCBuYW1lID0gYS5uYW1lO1xuICAgIGlmIChCRUhBVklPUl9BVFRSX1BSRUZJWEVTLnNvbWUoKHApID0+IG5hbWUgPT09IHAgfHwgbmFtZS5zdGFydHNXaXRoKHApKSkge1xuICAgICAgb3V0W25hbWVdID0gdHJpbVRleHQoYS52YWx1ZSwgMjAwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG91dCkubGVuZ3RoID8gb3V0IDogbnVsbDtcbn07XG5cbi8vIFdhbGsgdXAgdGhlIHNoYWRvdy1ET00gYm91bmRhcmllcy4gV2hlbiB0aGUgY2FwdHVyZWQgZWxlbWVudCBsaXZlc1xuLy8gaW5zaWRlIGEgY2xvc2VkL29wZW4gc2hhZG93IHJvb3QsIHRoZSBob3N0J3Mgc2VsZWN0b3IgaXMgdGhlIG9ubHkgd2F5XG4vLyB0aGUgcGFuZWwgc2lkZSAob3IgYW4gTExNIGxhdGVyKSBjYW4gcmUtZmluZCB0aGUgZW50cnkgb24gdGhlIGxpdmVcbi8vIHBhZ2Ug4oCUIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yYCBkb2Vzbid0IHBpZXJjZSBzaGFkb3cgYm91bmRhcmllcy5cbmNvbnN0IHNoYWRvd0hvc3RTZWxlY3RvciA9IChlbDogRWxlbWVudCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgaWYgKCEocm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaG9zdCA9IHJvb3QuaG9zdDtcbiAgaWYgKCFob3N0KSByZXR1cm4gbnVsbDtcbiAgLy8gY3NzUGF0aCBpcyBkZWZpbmVkIGxhdGVyOyByb3V0ZSB0aHJvdWdoIHRoZSBzaGFyZWQgc2VsZWN0b3IgYnVpbGRlci5cbiAgdHJ5IHsgcmV0dXJuIGNzc1BhdGgoaG9zdCk7IH0gY2F0Y2ggeyByZXR1cm4gaG9zdC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7IH1cbn07XG5cbi8vIFdhbGsgdXAgdG8gZmluZCB0aGUgbmVhcmVzdCBgY29udGVudGVkaXRhYmxlPXRydWVgIGFuY2VzdG9yICh0aGVcbi8vIHJpY2gtdGV4dCBlZGl0b3IncyBcInJvb3RcIikuIFJldHVybnMgbnVsbCB3aGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50IGlzXG4vLyBvdXRzaWRlIGFueSBlZGl0b3IuXG5jb25zdCBmaW5kRWRpdG9yUm9vdCA9IChlbDogRWxlbWVudCk6IEVsZW1lbnQgfCBudWxsID0+IHtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbDtcbiAgd2hpbGUgKGN1cikge1xuICAgIGlmIChjdXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBjdXIuaXNDb250ZW50RWRpdGFibGUpIHtcbiAgICAgIC8vIFdhbGsgdXAgZnVydGhlciB0byBmaW5kIHRoZSBPVVRFUk1PU1QgY29udGVudGVkaXRhYmxlPXRydWVcbiAgICAgIC8vIGFuY2VzdG9yIOKAlCBQcm9zZU1pcnJvciBuZXN0cyBub2RlcyB0aGF0IGVhY2ggcmVwb3J0XG4gICAgICAvLyBpc0NvbnRlbnRFZGl0YWJsZT10cnVlLCBidXQgdGhlIGFjdHVhbCBlZGl0b3Igcm9vdCBpcyBhdCB0aGUgdG9wLlxuICAgICAgbGV0IG91dGVyOiBFbGVtZW50ID0gY3VyO1xuICAgICAgbGV0IHByb2JlOiBFbGVtZW50IHwgbnVsbCA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICAgICAgd2hpbGUgKHByb2JlICYmIHByb2JlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgcHJvYmUuaXNDb250ZW50RWRpdGFibGUpIHtcbiAgICAgICAgb3V0ZXIgPSBwcm9iZTtcbiAgICAgICAgcHJvYmUgPSBwcm9iZS5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dGVyO1xuICAgIH1cbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIElkZW50aWZ5IHRoZSBlZGl0b3IgbGlicmFyeSBieSBtYXJrZXJzIGVhY2ggb25lIHN0YW1wcyBvbiB0aGUgZWRpdG9yXG4vLyByb290LiBNb3N0IGxpYnJhcmllcyBsZWF2ZSBhIGNsYXNzIG9yIGRhdGEtKiBhdHRyaWJ1dGUgdGhhdCdzIHN0YWJsZVxuLy8gYWNyb3NzIHZlcnNpb25zOyBzb21lIGxlYXZlIGEgcnVudGltZSBmaWVsZCBvbiB0aGUgRE9NIG5vZGUuIE9yZGVyXG4vLyBtYXR0ZXJzIOKAlCBUaXBUYXAgcmV1c2VzIFByb3NlTWlycm9yIHVuZGVyIHRoZSBob29kLCBzbyBjaGVjayB0aXB0YXBcbi8vIG1hcmtlcnMgZmlyc3Q7IGRpdHRvIFF1aWxsIChwdXJlIFByb3NlTWlycm9yLWZyZWUpIGJlZm9yZSBnZW5lcmljXG4vLyBgLlByb3NlTWlycm9yYC5cbmNvbnN0IGRldGVjdEVkaXRvcktpbmQgPSAocm9vdDogRWxlbWVudCk6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZScgPT4ge1xuICBjb25zdCByOiBhbnkgPSByb290O1xuICBpZiAocm9vdC5jbGFzc0xpc3Q/LmNvbnRhaW5zKCd0aXB0YXAnKSB8fCByLl9fdGlwdGFwKSByZXR1cm4gJ3RpcHRhcCc7XG4gIGlmIChyb290Lmhhc0F0dHJpYnV0ZSgnZGF0YS1sZXhpY2FsLWVkaXRvcicpIHx8IHIuX19sZXhpY2FsRWRpdG9yKSByZXR1cm4gJ2xleGljYWwnO1xuICBpZiAocm9vdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2xhdGUtZWRpdG9yJykgfHwgci5fX3NsYXRlRWRpdG9yKSByZXR1cm4gJ3NsYXRlJztcbiAgaWYgKHJvb3QuY2xhc3NMaXN0Py5jb250YWlucygncWwtZWRpdG9yJykgfHwgcm9vdC5jbG9zZXN0KCcucWwtY29udGFpbmVyJykpIHJldHVybiAncXVpbGwnO1xuICBpZiAocm9vdC5jbGFzc0xpc3Q/LmNvbnRhaW5zKCdQcm9zZU1pcnJvcicpIHx8IHIuX19wbVZpZXdEZXNjIHx8IHIucG1WaWV3RGVzYykgcmV0dXJuICdwcm9zZW1pcnJvcic7XG4gIHJldHVybiAnbmF0aXZlJztcbn07XG5cbmNvbnN0IGVkaXRvckNvbnRleHQgPSAoZWw6IEVsZW1lbnQpOiB7a2luZDogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJzsgcm9vdFNlbGVjdG9yOiBzdHJpbmc7IGNvbnRlbnRMZW5ndGg6IG51bWJlcn0gfCBudWxsID0+IHtcbiAgY29uc3Qgcm9vdCA9IGZpbmRFZGl0b3JSb290KGVsKTtcbiAgaWYgKCFyb290KSByZXR1cm4gbnVsbDtcbiAgbGV0IHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICB0cnkgeyByb290U2VsZWN0b3IgPSBjc3NQYXRoKHJvb3QpOyB9IGNhdGNoIHsgcm9vdFNlbGVjdG9yID0gcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7IH1cbiAgY29uc3QgdGV4dCA9IChyb290IGFzIEhUTUxFbGVtZW50KS5pbm5lclRleHQgPz8gcm9vdC50ZXh0Q29udGVudCA/PyAnJztcbiAgcmV0dXJuIHtcbiAgICBraW5kOiBkZXRlY3RFZGl0b3JLaW5kKHJvb3QpLFxuICAgIHJvb3RTZWxlY3RvcixcbiAgICBjb250ZW50TGVuZ3RoOiB0ZXh0Lmxlbmd0aCxcbiAgfTtcbn07XG5cbi8vIExheW91dCBidWdzIGZyZXF1ZW50bHkgbGl2ZSBpbiB0aGUgUEFSRU5UJ3MgZmxleC9ncmlkL292ZXJmbG93L1xuLy8gc2Nyb2xsL3N0YWNraW5nIGNvbnRleHQsIG5vdCBvbiB0aGUgY2FwdHVyZWQgZWxlbWVudCBpdHNlbGYuXG4vLyBDYXB0dXJlIGEgc2xpbSBzdW1tYXJ5IG9mIHRoZSBwYXJlbnQgY2hhaW4gdGhhdCdzIHN0cnVjdHVyYWxseVxuLy8gcmVsZXZhbnQgdG8gbGF5b3V0IOKAlCBkaXNwbGF5LCBwb3NpdGlvbiwgb3ZlcmZsb3csIHNjcm9sbCBvZmZzZXQsXG4vLyB0cmFuc2Zvcm0vd2lsbC1jaGFuZ2UgKHN0YWNraW5nKSwgYW5kIGZsZXgvZ3JpZCBzdW1tYXJ5IG9uIHRoZVxuLy8gaW1tZWRpYXRlIHBhcmVudC5cbnR5cGUgTGF5b3V0Q29udGV4dEVudHJ5ID0ge1xuICB0YWc6IHN0cmluZztcbiAgZGlzcGxheT86IHN0cmluZztcbiAgcG9zaXRpb24/OiBzdHJpbmc7XG4gIG92ZXJmbG93Pzogc3RyaW5nO1xuICB6SW5kZXg/OiBzdHJpbmc7XG4gIHRyYW5zZm9ybT86IHN0cmluZztcbiAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICBzY3JvbGxMZWZ0PzogbnVtYmVyO1xuICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgZ3JpZD86IHt0ZW1wbGF0ZUNvbHVtbnM/OiBzdHJpbmc7IHRlbXBsYXRlUm93cz86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbn07XG5jb25zdCBpc0xheW91dEludGVyZXN0aW5nID0gKGNzOiBDU1NTdHlsZURlY2xhcmF0aW9uKTogYm9vbGVhbiA9PiB7XG4gIGlmIChjcy5wb3NpdGlvbiAmJiBjcy5wb3NpdGlvbiAhPT0gJ3N0YXRpYycpIHJldHVybiB0cnVlO1xuICBpZiAoY3MuZGlzcGxheSAmJiAvKGZsZXh8Z3JpZHx0YWJsZXxjb250ZW50c3xpbmxpbmUtYmxvY2spLy50ZXN0KGNzLmRpc3BsYXkpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKGNzLm92ZXJmbG93ICYmIGNzLm92ZXJmbG93ICE9PSAndmlzaWJsZScpIHJldHVybiB0cnVlO1xuICBpZiAoY3MudHJhbnNmb3JtICYmIGNzLnRyYW5zZm9ybSAhPT0gJ25vbmUnKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcbmNvbnN0IGNhcHR1cmVMYXlvdXRDb250ZXh0ID0gKGVsOiBFbGVtZW50LCBkZXB0aCA9IDQpOiBMYXlvdXRDb250ZXh0RW50cnlbXSA9PiB7XG4gIGNvbnN0IG91dDogTGF5b3V0Q29udGV4dEVudHJ5W10gPSBbXTtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChjdXIgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5ICYmIGkgPCBkZXB0aCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGN1cik7XG4gICAgICBjb25zdCBpbnRlcmVzdGluZyA9IGlzTGF5b3V0SW50ZXJlc3RpbmcoY3MpO1xuICAgICAgaWYgKGludGVyZXN0aW5nKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5OiBMYXlvdXRDb250ZXh0RW50cnkgPSB7dGFnOiBjdXIudGFnTmFtZS50b0xvd2VyQ2FzZSgpfTtcbiAgICAgICAgZW50cnkuZGlzcGxheSA9IGNzLmRpc3BsYXk7XG4gICAgICAgIGVudHJ5LnBvc2l0aW9uID0gY3MucG9zaXRpb247XG4gICAgICAgIGlmIChjcy5vdmVyZmxvdyAhPT0gJ3Zpc2libGUnKSBlbnRyeS5vdmVyZmxvdyA9IGNzLm92ZXJmbG93O1xuICAgICAgICBpZiAoY3MuekluZGV4ICYmIGNzLnpJbmRleCAhPT0gJ2F1dG8nKSBlbnRyeS56SW5kZXggPSBjcy56SW5kZXg7XG4gICAgICAgIGlmIChjcy50cmFuc2Zvcm0gJiYgY3MudHJhbnNmb3JtICE9PSAnbm9uZScpIGVudHJ5LnRyYW5zZm9ybSA9IHRyaW1UZXh0KGNzLnRyYW5zZm9ybSwgMTIwKTtcbiAgICAgICAgaWYgKGNzLndpbGxDaGFuZ2UgJiYgY3Mud2lsbENoYW5nZSAhPT0gJ2F1dG8nKSBlbnRyeS53aWxsQ2hhbmdlID0gY3Mud2lsbENoYW5nZTtcbiAgICAgICAgaWYgKChjdXIgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbFdpZHRoID4gY3VyLmNsaWVudFdpZHRoIHx8IChjdXIgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbEhlaWdodCA+IGN1ci5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgICBlbnRyeS5pc1Njcm9sbENvbnRhaW5lciA9IHRydWU7XG4gICAgICAgICAgZW50cnkuc2Nyb2xsTGVmdCA9IChjdXIgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbExlZnQ7XG4gICAgICAgICAgZW50cnkuc2Nyb2xsVG9wID0gKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsVG9wO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvZmxleC8udGVzdChjcy5kaXNwbGF5KSkge1xuICAgICAgICAgIGVudHJ5LmZsZXggPSB7XG4gICAgICAgICAgICBkaXJlY3Rpb246IGNzLmZsZXhEaXJlY3Rpb24sXG4gICAgICAgICAgICB3cmFwOiBjcy5mbGV4V3JhcCxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6IGNzLmFsaWduSXRlbXMsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogY3MuanVzdGlmeUNvbnRlbnQsXG4gICAgICAgICAgICBnYXA6IGNzLmdhcCAhPT0gJ25vcm1hbCcgPyBjcy5nYXAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICgvZ3JpZC8udGVzdChjcy5kaXNwbGF5KSkge1xuICAgICAgICAgIGVudHJ5LmdyaWQgPSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZUNvbHVtbnM6IHRyaW1UZXh0KGNzLmdyaWRUZW1wbGF0ZUNvbHVtbnMsIDIwMCksXG4gICAgICAgICAgICB0ZW1wbGF0ZVJvd3M6IHRyaW1UZXh0KGNzLmdyaWRUZW1wbGF0ZVJvd3MsIDIwMCksXG4gICAgICAgICAgICBnYXA6IGNzLmdhcCAhPT0gJ25vcm1hbCcgPyBjcy5nYXAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBvdXQucHVzaChlbnRyeSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgY3VyID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgaSsrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBTdXJmYWNlIGEgY29udHJhc3QtcmF0aW8gbnVtYmVyIGZvciB0ZXh0IGVsZW1lbnRzIHNvIGFuIGExMXktYXdhcmVcbi8vIHJldmlld2VyIGNhbiBmbGFnIGZhaWxpbmcgcGFpcnMgd2l0aG91dCByZS1ydW5uaW5nIGFuIGF1ZGl0LiBSZXR1cm5zXG4vLyBudWxsIHdoZW4gbm8gdGV4dCBvciB3aGVuIGJhY2tncm91bmQgaXMgdHJhbnNwYXJlbnQgYW5kIHdlIGNhbid0XG4vLyByZXNvbHZlIGEgYmFzZSBjb2xvci5cbi8vXG4vLyBXZSBvbmx5IHJlcG9ydCBjb250cmFzdCBmb3IgZWxlbWVudHMgd2l0aCBkaXJlY3QgdGV4dCBjaGlsZHJlbjsgZm9yXG4vLyBjb250YWluZXJzIHdlJ2QgbmVlZCB0byB0cmF2ZXJzZSwgd2hpY2ggaXMgb3V0c2lkZSB0aGUgc2NvcGUgb2YgYVxuLy8gbGlnaHR3ZWlnaHQgaW4tY2FwdHVyZSBhdWRpdC5cbmNvbnN0IHBhcnNlUmdiID0gKHM6IHN0cmluZyk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHwgbnVsbCA9PiB7XG4gIC8vIHJnYigyNTUsIDk1LCAwKSB8IHJnYmEoMjU1LCA5NSwgMCwgMC41KSB8ICNmZjVmMDAgfCAjZjUwXG4gIGNvbnN0IG0gPSAvcmdiYT9cXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKig/OixcXHMqKFtcXGQuXSspKT9cXHMqXFwpLy5leGVjKHMpO1xuICBpZiAobSkge1xuICAgIHJldHVybiBbcGFyc2VJbnQobVsxXSEsIDEwKSwgcGFyc2VJbnQobVsyXSEsIDEwKSwgcGFyc2VJbnQobVszXSEsIDEwKSwgbVs0XSA/IHBhcnNlRmxvYXQobVs0XSkgOiAxXTtcbiAgfVxuICBjb25zdCBoZXggPSAvXiMoWzAtOWEtZl17M318WzAtOWEtZl17Nn0pJC9pLmV4ZWMocyk7XG4gIGlmIChoZXgpIHtcbiAgICBsZXQgaCA9IGhleFsxXSE7XG4gICAgaWYgKGgubGVuZ3RoID09PSAzKSBoID0gaC5zcGxpdCgnJykubWFwKChjKSA9PiBjICsgYykuam9pbignJyk7XG4gICAgcmV0dXJuIFtwYXJzZUludChoLnNsaWNlKDAsIDIpLCAxNiksIHBhcnNlSW50KGguc2xpY2UoMiwgNCksIDE2KSwgcGFyc2VJbnQoaC5zbGljZSg0LCA2KSwgMTYpLCAxXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5jb25zdCByZWxhdGl2ZUx1bWluYW5jZSA9IChbciwgZywgYl06IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdKTogbnVtYmVyID0+IHtcbiAgY29uc3QgbGluID0gKGM6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IHYgPSBjIC8gMjU1O1xuICAgIHJldHVybiB2IDw9IDAuMDM5MjggPyB2IC8gMTIuOTIgOiAoKHYgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40O1xuICB9O1xuICByZXR1cm4gMC4yMTI2ICogbGluKHIpICsgMC43MTUyICogbGluKGcpICsgMC4wNzIyICogbGluKGIpO1xufTtcbmNvbnN0IGNvbnRyYXN0UmF0aW8gPSAoZmc6IHN0cmluZywgYmc6IHN0cmluZyk6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBmID0gcGFyc2VSZ2IoZmcpOyBjb25zdCBiID0gcGFyc2VSZ2IoYmcpO1xuICBpZiAoIWYgfHwgIWIpIHJldHVybiBudWxsO1xuICBjb25zdCBsZiA9IHJlbGF0aXZlTHVtaW5hbmNlKGYpO1xuICBjb25zdCBsYiA9IHJlbGF0aXZlTHVtaW5hbmNlKGIpO1xuICBjb25zdCBbbG8sIGhpXSA9IGxmID4gbGIgPyBbbGIsIGxmXSA6IFtsZiwgbGJdO1xuICByZXR1cm4gTWF0aC5yb3VuZCgoKGhpICsgMC4wNSkgLyAobG8gKyAwLjA1KSkgKiAxMDApIC8gMTAwO1xufTtcbi8vIFdhbGsgdXAgdGhlIHBhcmVudCBjaGFpbiB0byBmaW5kIHRoZSBmaXJzdCBvcGFxdWUgYmFja2dyb3VuZCBjb2xvci5cbi8vIE1vc3QgZWxlbWVudHMgcmVwb3J0IGByZ2JhKDAsMCwwLDApYCAodHJhbnNwYXJlbnQpIGZvciBiYWNrZ3JvdW5kQ29sb3I7XG4vLyB0aGUgYWN0dWFsIHZpc2libGUgYmFja2dyb3VuZCBpcyB0aGUgbmVhcmVzdCBhbmNlc3RvciB0aGF0IHBhaW50cy5cbmNvbnN0IHJlc29sdmVCYWNrZ3JvdW5kID0gKGVsOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gZWw7XG4gIHdoaWxlIChjdXIpIHtcbiAgICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGN1cik7XG4gICAgY29uc3QgYmcgPSBjcy5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgaWYgKGJnICYmIGJnICE9PSAncmdiYSgwLCAwLCAwLCAwKScgJiYgYmcgIT09ICd0cmFuc3BhcmVudCcpIHJldHVybiBiZztcbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5jb25zdCBjb21wdXRlQWNjZXNzaWJpbGl0eUNoZWNrID0gKGVsOiBFbGVtZW50KToge2NvbnRyYXN0UmF0aW8/OiBudW1iZXI7IGNvbnRyYXN0UGFzc2VzPzogJ0FBJyB8ICdBQUEnIHwgJ2ZhaWwnOyB0YWJiYWJsZT86IGJvb2xlYW47IGZvY3VzVmlzaWJsZT86IGJvb2xlYW59IHwgbnVsbCA9PiB7XG4gIGNvbnN0IG91dDoge2NvbnRyYXN0UmF0aW8/OiBudW1iZXI7IGNvbnRyYXN0UGFzc2VzPzogJ0FBJyB8ICdBQUEnIHwgJ2ZhaWwnOyB0YWJiYWJsZT86IGJvb2xlYW47IGZvY3VzVmlzaWJsZT86IGJvb2xlYW59ID0ge307XG4gIHRyeSB7XG4gICAgaWYgKGhhc093blRleHROb2RlKGVsKSkge1xuICAgICAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBjb25zdCBmZyA9IGNzLmNvbG9yO1xuICAgICAgY29uc3QgYmcgPSByZXNvbHZlQmFja2dyb3VuZChlbCk7XG4gICAgICBpZiAoZmcgJiYgYmcpIHtcbiAgICAgICAgY29uc3QgciA9IGNvbnRyYXN0UmF0aW8oZmcsIGJnKTtcbiAgICAgICAgaWYgKHIgIT09IG51bGwpIHtcbiAgICAgICAgICBvdXQuY29udHJhc3RSYXRpbyA9IHI7XG4gICAgICAgICAgLy8gVXNlIDE4cHQrIC8gMTRwdC1ib2xkIHRocmVzaG9sZHMgKDMuMCAvIDQuNSkgd2hlbiBhcHBsaWNhYmxlO1xuICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgc3RhbmRhcmQgNC41IC8gNy4wLlxuICAgICAgICAgIGNvbnN0IGZvbnRTaXplID0gcGFyc2VGbG9hdChjcy5mb250U2l6ZSk7XG4gICAgICAgICAgY29uc3QgaXNCb2xkID0gcGFyc2VJbnQoY3MuZm9udFdlaWdodCwgMTApID49IDcwMDtcbiAgICAgICAgICBjb25zdCBpc0xhcmdlVGV4dCA9IGZvbnRTaXplID49IDE4IHx8IChmb250U2l6ZSA+PSAxNCAmJiBpc0JvbGQpO1xuICAgICAgICAgIGNvbnN0IGFhID0gaXNMYXJnZVRleHQgPyAzIDogNC41O1xuICAgICAgICAgIGNvbnN0IGFhYSA9IGlzTGFyZ2VUZXh0ID8gNC41IDogNztcbiAgICAgICAgICBvdXQuY29udHJhc3RQYXNzZXMgPSByID49IGFhYSA/ICdBQUEnIDogciA+PSBhYSA/ICdBQScgOiAnZmFpbCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVGFiIG9yZGVyIHByb3h5OiB0YWJJbmRleCA+PSAwIE9SIG1hdGNoZXMgdGhlIG5hdHVyYWwtdGFiYmFibGUgc2V0LlxuICAgIGNvbnN0IHRpID0gKGVsIGFzIEhUTUxFbGVtZW50KS50YWJJbmRleDtcbiAgICBjb25zdCBuYXR1cmFsbHlUYWJiYWJsZSA9IC9eKGF8YnV0dG9ufGlucHV0fHNlbGVjdHx0ZXh0YXJlYXxpZnJhbWV8ZGV0YWlsc3xhdWRpb3x2aWRlbykkL2kudGVzdChlbC50YWdOYW1lKSAmJiAhZWwuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIChlbC50YWdOYW1lICE9PSAnQScgfHwgQm9vbGVhbigoZWwgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWYpKTtcbiAgICBvdXQudGFiYmFibGUgPSB0aSA+PSAwIHx8IG5hdHVyYWxseVRhYmJhYmxlO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG91dCkubGVuZ3RoID8gb3V0IDogbnVsbDtcbn07XG5cbi8vIEFuaW1hdGlvbi1jb250ZXh0IGZsYWcuIGNhcHR1cmVFbnRyeSBjYWxscyB0aGlzIOKAlCBpZiBgZ2V0QW5pbWF0aW9ucygpYFxuLy8gcmV0dXJucyBhbnl0aGluZyBhY3RpdmVseSBwbGF5aW5nLCB0aGUgcmVjdCAvIHRyYW5zZm9ybSAvIG9wYWNpdHkgd2Vcbi8vIGNhcHR1cmVkIG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZSwgbm90IHRoZVxuLy8gc2V0dGxlZCBsYXlvdXQuIEhlbHBzIGFuIExMTSBub3QgYW5jaG9yIG9uIHZhbHVlcyB0aGF0IHdvbid0IHJlcGVhdC5cbmNvbnN0IGhhc0FjdGl2ZUFuaW1hdGlvbiA9IChlbDogRWxlbWVudCk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCBmbiA9IChlbCBhcyBhbnkpLmdldEFuaW1hdGlvbnM7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCBhbmltYXRpb25zID0gZm4uY2FsbChlbCkgYXMgQXJyYXk8e3BsYXlTdGF0ZT86IHN0cmluZ30+O1xuICAgIGZvciAoY29uc3QgYSBvZiBhbmltYXRpb25zKSB7XG4gICAgICBpZiAoYT8ucGxheVN0YXRlID09PSAncnVubmluZycpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFByb2R1Y3Rpb24gYnVpbGRzIG1pbmlmeSBjb21wb25lbnQgY29uc3RydWN0b3IgbmFtZXMgdG8gMS0zIGNoYXJzXG4vLyAoYEJkYCwgYEtlYCwgYHFhYCwgYCRkYCwgYGU4YCkuIFRoZSBzdHJpbmcgY2FycmllcyB6ZXJvIHNlbWFudGljXG4vLyBpbmZvcm1hdGlvbiB0byBhbiBMTE0g4oCUIGl0J3MganVzdCBtaW5pZmllciBvdXRwdXQuIFdlIHRyZWF0IHN1Y2ggbmFtZXNcbi8vIGFzIG1pc3NpbmcgYW5kIGZhbGwgdGhyb3VnaCB0byB0aGUgZGlzcGxheU5hbWUgcGF0aCAob3IgZHJvcCB0aGVcbi8vIGBjb21wb25lbnRgIGZpZWxkIGVudGlyZWx5IHdoZW4gbmVpdGhlciBzdXJ2aXZlcyB0aGUgbWluaWZpZXIpLlxuLy9cbi8vIEphdmFTY3JpcHQgaWRlbnRpZmllci1zdGFydCBjaGFycyBpbmNsdWRlIGAkYCBhbmQgYF9gOyBpZGVudGlmaWVyLWNvbnRpbnVlXG4vLyBhZGRzIGRpZ2l0cy4gUmVhbCBjb21wb25lbnQgbmFtZXMgYXJlIGFsbW9zdCBhbHdheXMgY2FtZWxDYXNlIC8gUGFzY2FsQ2FzZVxuLy8gd29yZHMg4omlNCBjaGFycyAoYEJ1dHRvbmAsIGBXZWF0aGVyQ2FyZGApLiBBbnl0aGluZyDiiaQzIGNoYXJzIHRoYXQgdXNlcyB0aGVcbi8vIG1pbmlmaWVyIGFscGhhYmV0IGlzIHRyZWF0ZWQgYXMganVuay5cbmNvbnN0IE1JTklGSUVEX05BTUVfUkUgPSAvXltBLVphLXokX11bQS1aYS16MC05JF9dezAsMn0kLztcbmNvbnN0IEJVTkRMRVJfU0NBRkZPTERfTkFNRVMgPSBuZXcgU2V0KFtcbiAgJ0Fub255bW91cycsICdhbm9ueW1vdXMnLCAnZGVmYXVsdCcsICdfZGVmYXVsdCcsXG4gIC8vIFZ1ZSBTRkMgY29tcGlsZXIgc3RhbXBzIGV2ZXJ5IGA8c2NyaXB0IHNldHVwPmAgZGVmYXVsdCBleHBvcnQgd2l0aCB0aGlzXG4gIC8vIHNlbnRpbmVsIHdoZW4gbm8gZXhwbGljaXQgYG5hbWVgIGlzIHNldCDigJQgc2VtYW50aWNhbGx5IGVtcHR5LlxuICAnX3NmY19tYWluJywgJ3NmY19tYWluJyxcbl0pO1xuY29uc3QgaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZSA9IChuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XG4gIGlmICghbmFtZSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoQlVORExFUl9TQ0FGRk9MRF9OQU1FUy5oYXMobmFtZSkpIHJldHVybiBmYWxzZTtcbiAgaWYgKE1JTklGSUVEX05BTUVfUkUudGVzdChuYW1lKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIC0tLS0gUmVhY3QgLyBWdWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgcmVhY3RJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT4ge1xuICBjb25zdCByZWFjdEtleSA9IE9iamVjdC5rZXlzKGVsKS5maW5kKChrKSA9PlxuICAgIGsuc3RhcnRzV2l0aCgnX19yZWFjdEZpYmVyJCcpIHx8IGsuc3RhcnRzV2l0aCgnX19yZWFjdEludGVybmFsSW5zdGFuY2UkJykpO1xuICBpZiAoIXJlYWN0S2V5KSByZXR1cm4gbnVsbDtcbiAgbGV0IG5vZGU6IGFueSA9IChlbCBhcyBhbnkpW3JlYWN0S2V5XTtcbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8YW55PigpO1xuICBsZXQgcmVzdWx0OiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9IG51bGw7XG4gIHdoaWxlIChub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiAhc2Vlbi5oYXMobm9kZSkpIHtcbiAgICBzZWVuLmFkZChub2RlKTtcbiAgICBjb25zdCB0eXBlID0gbm9kZS50eXBlIHx8IG5vZGUuZWxlbWVudFR5cGU7XG4gICAgaWYgKCFyZXN1bHQ/Lm5hbWUgJiYgdHlwZSAmJiB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIGRpc3BsYXlOYW1lIGlzIGRldmVsb3Blci1zdXBwbGllZCAoUmVhY3QuZGlzcGxheU5hbWUsIGZvcndhcmRSZWZcbiAgICAgIC8vIHdyYXBwZXIgbmFtZXMpIGFuZCBzdXJ2aXZlcyBtaW5pZmljYXRpb24gd2hlbiBzZXQgZXhwbGljaXRseS4gUHJlZmVyXG4gICAgICAvLyBpdC4gdHlwZS5uYW1lIGlzIHRoZSBjb25zdHJ1Y3Rvci5uYW1lIHN0cmluZywgd2hpY2ggbWluaWZpZXMgdG9cbiAgICAgIC8vIGp1bmsgbGlrZSBcIkJkXCIgaW4gcHJvZCBidWlsZHMg4oCUIG9ubHkgYWNjZXB0IGl0IGlmIGl0IHN1cnZpdmVzIHRoZVxuICAgICAgLy8gbWVhbmluZ2Z1bC1uYW1lIGZpbHRlci5cbiAgICAgIGNvbnN0IGRpc3BsYXkgPSB0eXBlb2YgdHlwZS5kaXNwbGF5TmFtZSA9PT0gJ3N0cmluZycgPyB0eXBlLmRpc3BsYXlOYW1lIDogbnVsbDtcbiAgICAgIGNvbnN0IGN0b3JOYW1lID0gdHlwZW9mIHR5cGUubmFtZSA9PT0gJ3N0cmluZycgPyB0eXBlLm5hbWUgOiBudWxsO1xuICAgICAgY29uc3QgY2FuZCA9IGlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUoZGlzcGxheSlcbiAgICAgICAgPyBkaXNwbGF5IVxuICAgICAgICA6IGlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUoY3Rvck5hbWUpID8gY3Rvck5hbWUhIDogbnVsbDtcbiAgICAgIGlmIChjYW5kKSB7XG4gICAgICAgIHJlc3VsdCA9IHtmcmFtZXdvcms6ICdyZWFjdCcsIG5hbWU6IHRyaW1UZXh0KGNhbmQsIDEyMCl9O1xuICAgICAgICBpZiAoZGlzcGxheSAmJiBkaXNwbGF5ICE9PSBjYW5kKSB7XG4gICAgICAgICAgcmVzdWx0LmRpc3BsYXlOYW1lID0gdHJpbVRleHQoZGlzcGxheSwgMTgwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVzdWx0ICYmICFyZXN1bHQuc291cmNlICYmIG5vZGUuX2RlYnVnU291cmNlKSB7XG4gICAgICByZXN1bHQuc291cmNlID0ge1xuICAgICAgICBmaWxlOiBub2RlLl9kZWJ1Z1NvdXJjZS5maWxlTmFtZSB8fCBub2RlLl9kZWJ1Z1NvdXJjZS5maWxlIHx8IG51bGwsXG4gICAgICAgIGxpbmU6IG5vZGUuX2RlYnVnU291cmNlLmxpbmVOdW1iZXIgfHwgbm9kZS5fZGVidWdTb3VyY2UubGluZSB8fCBudWxsLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG5vZGUuX2RlYnVnT3duZXIpIHsgbm9kZSA9IG5vZGUuX2RlYnVnT3duZXI7IGNvbnRpbnVlOyB9XG4gICAgaWYgKG5vZGUucmV0dXJuKSB7IG5vZGUgPSBub2RlLnJldHVybjsgY29udGludWU7IH1cbiAgICBicmVhaztcbiAgfVxuICAvLyBObyB1c2FibGUgbmFtZSDihpIgZW1pdCBub3RoaW5nIHJhdGhlciB0aGFuIGB7ZnJhbWV3b3JrOlwicmVhY3RcIn1gIHdpdGggYVxuICAvLyBteXN0ZXJ5IDItY2hhciBuYW1lLiBBbiBMTE0gcmVhZGluZyB0aGUgZXhwb3J0IGxlYXJucyBub3RoaW5nIGZyb21cbiAgLy8gZWl0aGVyIHNoYXBlOyBzdXBwcmVzc2luZyBrZWVwcyB0aGUgcm93IGhvbmVzdC5cbiAgaWYgKCFyZXN1bHQ/Lm5hbWUpIHJldHVybiBudWxsO1xuXG4gIC8vIFdhbGsgdGhlIGZpYmVyIGNoYWluIHRvIGNvbGxlY3QgYW5jZXN0b3IgY29tcG9uZW50IG5hbWVzLiBUaGVcbiAgLy8gYF9kZWJ1Z093bmVyYCBwYXRoIGlzIG1vcmUgbWVhbmluZ2Z1bCB0aGFuIGByZXR1cm5gIChpdCBza2lwcyBob3N0XG4gIC8vIHdyYXBwZXJzKSwgYnV0IHdlIGZhbGwgYmFjayB0byBgcmV0dXJuYCB3aGVuIG93bmVyIGRhdGEgaXNcbiAgLy8gdW5hdmFpbGFibGUgKHByb2R1Y3Rpb24gYnVpbGRzKS4gQ2FwIGF0IDggYW5jZXN0b3JzIHNvIHRoZSBmaWVsZFxuICAvLyBkb2Vzbid0IGJhbGxvb24gZm9yIGRlZXBseS1uZXN0ZWQgYXBwcy5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHNlZW5DaGFpbiA9IG5ldyBTZXQ8YW55PigpO1xuICBsZXQgd2Fsa2VyOiBhbnkgPSAoZWwgYXMgYW55KVtyZWFjdEtleV07XG4gIHdoaWxlICh3YWxrZXIgJiYgdHlwZW9mIHdhbGtlciA9PT0gJ29iamVjdCcgJiYgIXNlZW5DaGFpbi5oYXMod2Fsa2VyKSAmJiBjaGFpbi5sZW5ndGggPCA4KSB7XG4gICAgc2VlbkNoYWluLmFkZCh3YWxrZXIpO1xuICAgIGNvbnN0IHQgPSB3YWxrZXIudHlwZSB8fCB3YWxrZXIuZWxlbWVudFR5cGU7XG4gICAgaWYgKHQgJiYgdHlwZW9mIHQgIT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBuID0gKHR5cGVvZiB0LmRpc3BsYXlOYW1lID09PSAnc3RyaW5nJyAmJiBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKHQuZGlzcGxheU5hbWUpKVxuICAgICAgICA/IHQuZGlzcGxheU5hbWVcbiAgICAgICAgOiAodHlwZW9mIHQubmFtZSA9PT0gJ3N0cmluZycgJiYgaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZSh0Lm5hbWUpKVxuICAgICAgICAgID8gdC5uYW1lXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgaWYgKG4gJiYgKGNoYWluLmxlbmd0aCA9PT0gMCB8fCBjaGFpbltjaGFpbi5sZW5ndGggLSAxXSAhPT0gbikpIGNoYWluLnB1c2gobik7XG4gICAgfVxuICAgIHdhbGtlciA9IHdhbGtlci5fZGVidWdPd25lciA/PyB3YWxrZXIucmV0dXJuO1xuICB9XG4gIGlmIChjaGFpbi5sZW5ndGggPiAwKSByZXN1bHQuY2hhaW4gPSBjaGFpbjtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IHZ1ZUluZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHY6IGFueSA9IChlbCBhcyBhbnkpPy5fX3Z1ZVBhcmVudENvbXBvbmVudCB8fCAoZWwgYXMgYW55KT8uX192dWVfYXBwX18/Ll9pbnN0YW5jZSB8fFxuICAgIChlbCBhcyBhbnkpPy5fX3Zub2RlPy5jb21wb25lbnQgfHwgKGVsIGFzIGFueSk/Ll9fdnVlX187XG4gIGNvbnN0IHR5cGUgPSB2Py50eXBlIHx8IHY/LmN0eD8udHlwZTtcbiAgLy8gdHlwZS5uYW1lIGlzIGRldmVsb3Blci1zZXQgdmlhIGBuYW1lOiAnTXlDb21wJ2A7IHR5cGUuX19uYW1lIGlzXG4gIC8vIHBvcHVsYXRlZCBieSBgPHNjcmlwdCBzZXR1cD5gIGFuZCB0b29scyB0aGF0IGluZmVyIHRoZSBmaWxlbmFtZS4gQm90aFxuICAvLyBhcmUgcmVhbCBuYW1lcyBpbiBkZXY7IHByb2QgYnVpbGRzIGNhbiBsZWF2ZSBvbmx5IGEgbWluaWZpZWQgZ2x5cGguXG4gIGNvbnN0IHJhd05hbWUgPSB0eXBlPy5uYW1lIHx8IHR5cGU/Ll9fbmFtZTtcbiAgaWYgKCFpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKHJhd05hbWUpKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcmVzdWx0OiBGcmFtZXdvcmtJbmZvID0ge1xuICAgIGZyYW1ld29yazogJ3Z1ZScsXG4gICAgbmFtZTogdHJpbVRleHQocmF3TmFtZSwgMTYwKSxcbiAgICBzb3VyY2U6IHtmaWxlOiB0eXBlPy5fX2ZpbGUgfHwgbnVsbH0sXG4gIH07XG4gIC8vIFdhbGsgdGhlIHBhcmVudC1jb21wb25lbnQgY2hhaW4uXG4gIGNvbnN0IGNoYWluOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgY3VyOiBhbnkgPSB2O1xuICBjb25zdCBzZWVuID0gbmV3IFNldDxhbnk+KCk7XG4gIHdoaWxlIChjdXIgJiYgdHlwZW9mIGN1ciA9PT0gJ29iamVjdCcgJiYgIXNlZW4uaGFzKGN1cikgJiYgY2hhaW4ubGVuZ3RoIDwgOCkge1xuICAgIHNlZW4uYWRkKGN1cik7XG4gICAgY29uc3QgdCA9IGN1ci50eXBlIHx8IGN1ci5jdHg/LnR5cGU7XG4gICAgY29uc3QgbiA9IHQ/Lm5hbWUgPz8gdD8uX19uYW1lO1xuICAgIGlmICh0eXBlb2YgbiA9PT0gJ3N0cmluZycgJiYgaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShuKSkge1xuICAgICAgaWYgKGNoYWluLmxlbmd0aCA9PT0gMCB8fCBjaGFpbltjaGFpbi5sZW5ndGggLSAxXSAhPT0gbikgY2hhaW4ucHVzaChuKTtcbiAgICB9XG4gICAgY3VyID0gY3VyLnBhcmVudDtcbiAgfVxuICBpZiAoY2hhaW4ubGVuZ3RoID4gMCkgcmVzdWx0LmNoYWluID0gY2hhaW47XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBMaXQgKGxpdC1lbGVtZW50KSDigJQgaW5zdGFuY2VzIGFyZSBjdXN0b20gZWxlbWVudHMgd2hvc2UgY29uc3RydWN0b3Jcbi8vIGNhcnJpZXMgYF8kbGl0RWxlbWVudCRgLCBgZWxlbWVudFByb3BlcnRpZXNgLCBvciBgc3R5bGVzYC4gVGhlIHRhZyBpc1xuLy8gdGhlIGNvbXBvbmVudCdzIGlkZW50aXR5OyB0aGUgY29uc3RydWN0b3IgbmFtZSBpcyB0aGUgZGV2ZWxvcGVyLWZhY2luZ1xuLy8gY2xhc3MgbmFtZSB3aGVuIHByb3ZpZGVkLlxuY29uc3QgbGl0SW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgaWYgKCFlbC50YWdOYW1lLmluY2x1ZGVzKCctJykpIHJldHVybiBudWxsO1xuICBjb25zdCBjdG9yOiBhbnkgPSBlbC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCFjdG9yKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaXNMaXQgPSBCb29sZWFuKFxuICAgIGN0b3IuXyRsaXRFbGVtZW50JCB8fFxuICAgIGN0b3IuZWxlbWVudFByb3BlcnRpZXMgfHxcbiAgICBjdG9yLl8kbGl0RWxlbWVudFZlcnNpb24kIHx8XG4gICAgKGN0b3Iuc3R5bGVzICYmIEFycmF5LmlzQXJyYXkoY3Rvci5zdHlsZXMpKSxcbiAgKTtcbiAgaWYgKCFpc0xpdCkgcmV0dXJuIG51bGw7XG4gIC8vIGN0b3IubmFtZSBpbiBwcm9kIGlzIGEgMi1jaGFyIG1pbmlmaWVyIGdseXBoLiBUaGUgdGFnIGlzIHRoZVxuICAvLyBkZXZlbG9wZXItZmFjaW5nIGlkZW50aXR5IGZvciBhbnkgY3VzdG9tIGVsZW1lbnQg4oCUIHVzZSBpdCBhcyB0aGVcbiAgLy8gY2Fub25pY2FsIG5hbWUgd2hlbiBjdG9yLm5hbWUgaXMgbWluaWZpZWQgYXdheS5cbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBjdG9yTmFtZSA9IHR5cGVvZiBjdG9yLm5hbWUgPT09ICdzdHJpbmcnID8gY3Rvci5uYW1lIDogbnVsbDtcbiAgY29uc3QgbmFtZSA9IGlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUoY3Rvck5hbWUpID8gY3Rvck5hbWUhIDogdGFnO1xuICByZXR1cm4ge1xuICAgIGZyYW1ld29yazogJ2xpdCcsXG4gICAgbmFtZTogdHJpbVRleHQobmFtZSwgMTIwKSxcbiAgICBkaXNwbGF5TmFtZTogdGFnLFxuICB9O1xufTtcblxuLy8gU3RlbmNpbCBjb21wb25lbnRzIOKAlCBjdXN0b20gZWxlbWVudHMgd2hvc2UgY29uc3RydWN0b3IgZXhwb3NlcyBhXG4vLyBzdGF0aWMgYGlzYCAodGhlIHRhZyksIGFuZCB3aGljaCBjYXJyeSBzdGVuY2lsLWludGVybmFsIHByb3BzIG9uIHRoZVxuLy8gaG9zdCAoYF9faG9zdENzc2AsIGBzLWlkYCwgYF9fc3RlbmNpbF9zdWJzY3JpYmVySWRgLCBldGMpLlxuY29uc3Qgc3RlbmNpbEluZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PiB7XG4gIGlmICghZWwudGFnTmFtZS5pbmNsdWRlcygnLScpKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgY3RvcjogYW55ID0gZWwuY29uc3RydWN0b3I7XG4gIGlmICghY3RvcikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGxvb2tzU3RlbmNpbCA9IEJvb2xlYW4oXG4gICAgdHlwZW9mIGN0b3IuaXMgPT09ICdzdHJpbmcnICYmIGN0b3IuaXMuaW5jbHVkZXMoJy0nKSB8fFxuICAgIChlbCBhcyBhbnkpLl9faG9zdENzcyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgKGVsIGFzIGFueSkuX19zdGVuY2lsX3N1YnNjcmliZXJJZCAhPT0gdW5kZWZpbmVkIHx8XG4gICAgZWwuaGFzQXR0cmlidXRlKCdzLWlkJyksXG4gICk7XG4gIGlmICghbG9va3NTdGVuY2lsKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAvLyBgY3Rvci5pc2AgaXMgdGhlIFN0ZW5jaWwtc3RhdGljIHRhZyBkZWNsYXJhdGlvbiAoYWx3YXlzIHByZXNlbnQsIGFsd2F5c1xuICAvLyBtZWFuaW5nZnVsKS4gYGN0b3IubmFtZWAgaXMgdGhlIG1pbmlmaWVkIGNsYXNzIG5hbWUgaW4gcHJvZC4gRmFsbCBiYWNrXG4gIC8vIHRocm91Z2ggdGhlIHNhbWUgbWVhbmluZ2Z1bG5lc3MgZmlsdGVyIGFzIHRoZSBvdGhlciBmcmFtZXdvcmtzLlxuICBjb25zdCBpc0ZpZWxkID0gdHlwZW9mIGN0b3IuaXMgPT09ICdzdHJpbmcnID8gY3Rvci5pcyA6IG51bGw7XG4gIGNvbnN0IGN0b3JOYW1lID0gdHlwZW9mIGN0b3IubmFtZSA9PT0gJ3N0cmluZycgPyBjdG9yLm5hbWUgOiBudWxsO1xuICBjb25zdCBuYW1lID0gaXNGaWVsZCB8fCAoaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShjdG9yTmFtZSkgPyBjdG9yTmFtZSEgOiB0YWcpO1xuICByZXR1cm4ge1xuICAgIGZyYW1ld29yazogJ3N0ZW5jaWwnLFxuICAgIG5hbWU6IHRyaW1UZXh0KG5hbWUsIDEyMCksXG4gICAgZGlzcGxheU5hbWU6IHRhZyxcbiAgfTtcbn07XG5cbi8vIFN2ZWx0ZSDigJQgcnVudGltZSBpbnN0YW5jZSBsb29rdXAgaXMgc3BhcnNlLCBidXQgdGhlIGRldi1tb2RlXG4vLyBjb21waWxlciBhdHRhY2hlcyBgX19zdmVsdGVfbWV0YWAgdG8gZWxlbWVudHMgd2l0aCBzb3VyY2UtbG9jIGluZm9cbi8vIChgeyBsb2M6IHsgZmlsZSwgbGluZSwgY2hhciB9IH1gKS4gSW4gcHJvZCB0aGF0IHByb3BlcnR5IGlzIGFic2VudCxcbi8vIHNvIGRldGVjdGlvbiBzaWxlbnRseSBmYWxscyB0aHJvdWdoLlxuY29uc3Qgc3ZlbHRlSW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgY29uc3QgbWV0YTogYW55ID0gKGVsIGFzIGFueSkuX19zdmVsdGVfbWV0YTtcbiAgaWYgKCFtZXRhPy5sb2MpIHJldHVybiBudWxsO1xuICBjb25zdCBmaWxlID0gdHlwZW9mIG1ldGEubG9jLmZpbGUgPT09ICdzdHJpbmcnID8gbWV0YS5sb2MuZmlsZSA6IG51bGw7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnc3ZlbHRlJyxcbiAgICBuYW1lOiB0cmltVGV4dChmaWxlID8/ICdzdmVsdGUtY29tcG9uZW50JywgMTYwKSxcbiAgICBzb3VyY2U6IHtcbiAgICAgIGZpbGUsXG4gICAgICBsaW5lOiB0eXBlb2YgbWV0YS5sb2MubGluZSA9PT0gJ251bWJlcicgPyBtZXRhLmxvYy5saW5lIDogbnVsbCxcbiAgICB9LFxuICB9O1xufTtcblxuLy8gR2VuZXJpYyB3ZWItY29tcG9uZW50IGZhbGxiYWNrIOKAlCB3aGVuIHRoZSBlbGVtZW50IGhhcyBhIGN1c3RvbS1lbGVtZW50XG4vLyB0YWcgKGtlYmFiLWNhc2UpIGFuZCBgY3VzdG9tRWxlbWVudHMuZ2V0KC4uLilgIHJlY29nbml6ZXMgaXQsIGJ1dCBub1xuLy8gZnJhbWV3b3JrLXNwZWNpZmljIG1hcmtlciBtYXRjaGVkLiBDYXB0dXJlcyB0aGUgdGFnIGFzIHRoZSBpZGVudGl0eS5cbmNvbnN0IHdlYkNvbXBvbmVudEluZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCF0YWcuaW5jbHVkZXMoJy0nKSkgcmV0dXJuIG51bGw7XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiBjdXN0b21FbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgY3VzdG9tRWxlbWVudHMuZ2V0KHRhZykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyYW1ld29yazogJ3dlYi1jb21wb25lbnQnLFxuICAgICAgICBuYW1lOiB0YWcsXG4gICAgICAgIGRpc3BsYXlOYW1lOiB0YWcsXG4gICAgICB9O1xuICAgIH1cbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gUGx1Zy1pbiBzdHlsZTogdHJ5IFJlYWN0IGZpcnN0IChtb3N0IGNvbW1vbiBpbiBvdXIgY2FwdHVyZWQgYXBwcyksXG4vLyB0aGVuIFZ1ZSwgdGhlbiBMaXQgLyBTdGVuY2lsIC8gU3ZlbHRlIC8gZ2VuZXJpYyB3ZWItY29tcG9uZW50LiBGaXJzdFxuLy8gcmVzb2x2ZXIgdG8gcmV0dXJuIG5vbi1udWxsIHdpbnMuXG5jb25zdCBmcmFtZXdvcmtJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT5cbiAgcmVhY3RJbmZvKGVsKSB8fCB2dWVJbmZvKGVsKSB8fCBsaXRJbmZvKGVsKSB8fCBzdGVuY2lsSW5mbyhlbCkgfHwgc3ZlbHRlSW5mbyhlbCkgfHwgd2ViQ29tcG9uZW50SW5mbyhlbCk7XG5cbi8vIC0tLS0gQ2FwdHVyZTogYXNzZW1ibGUgdGhlIGZ1bGwgZW50cnkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFN0cmlwIHRoZSBib2R5IG9mIGxvbmcgYGRhdGE6YCBVUklzIChQbGFzbWljJ3MgYXNwZWN0LXJhdGlvIFNWRyBzcGFjZXJzLFxuLy8gaW5saW5lZCBQTkcvSlBFRyBmYWxsYmFja3MpIHNpbmNlIHRoZSBiYXNlNjQgcGF5bG9hZCBpcyBtZWNoYW5pc20sIG5vdFxuLy8gc2lnbmFsLiBLZWVwIHRoZSBzY2hlbWUgKyBhIGxlbmd0aCBoaW50IHNvIGFuIExMTSBjYW4gdGVsbCBzb21ldGhpbmdcbi8vIHdhcyBlbGlkZWQuXG5jb25zdCBlbGlkZURhdGFVcmlzID0gKGh0bWw6IHN0cmluZyk6IHN0cmluZyA9PlxuICBodG1sLnJlcGxhY2UoL2RhdGE6KFtcXHcvKy4tXSspO2Jhc2U2NCwoW0EtWmEtejAtOSsvPV17NjAsfSkvZyxcbiAgICAoX20sIG1pbWU6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKSA9PlxuICAgICAgYGRhdGE6JHttaW1lfTtiYXNlNjQsWyR7cGF5bG9hZC5sZW5ndGh9LWNoYXIgYmFzZTY0IGVsaWRlZF1gKTtcblxuLy8gUmVwbGFjZSBpbmxpbmUgaWNvbiBTVkdzIHdpdGggcGxhY2Vob2xkZXJzLiBUaGUgcGF0aCBkYXRhIG9mIGFcbi8vIEx1Y2lkZS9IZXJvaWNvbiByZWZyZXNoIGljb24gaXMgfjI4MCBieXRlcyB0aGF0IGFuIExMTSBkb2Vzbid0IG5lZWQg4oCUXG4vLyB0aGUgc3Vycm91bmRpbmcgYnV0dG9uIGNhcHRpb24gYWxyZWFkeSB0ZWxscyBpdCB3aGF0IHRoZSBpY29uIG1lYW5zLlxuLy9cbi8vIEEgc3RyaXBwZWQtZG93biBgPHN2Zy8+YCBsb3NlcyBpY29uIGlkZW50aXR5ICh3aGljaCBsdWNpZGUvZmVhdGhlci9cbi8vIGhlcm9pY29uIHdhcyB1c2VkPyB3aGF0IGFyaWEtbGFiZWwgZGVzY3JpYmVkIGl0PyB3aGF0IGNsYXNzIGRpZCBpdFxuLy8gY2Fycnk/KS4gV2UgcHJlc2VydmUgZXZlcnkgc2lnbmFsIHRoYXQgaGVscHMgYSByZXBhaXIgYWdlbnQgbG9jYXRlXG4vLyB0aGUgaWNvbiBkZWZpbml0aW9uIHdpdGhvdXQga2VlcGluZyB0aGUgcGF0aCBkYXRhOlxuLy8gICDigKIgYXJpYS1sYWJlbCwgcm9sZSwgdGl0bGUgICAgICAgICDigJQgYWNjZXNzaWJsZSBpZGVudGl0eVxuLy8gICDigKIgZGF0YS1pY29uLCBkYXRhLWx1Y2lkZSwgZGF0YS0qICDigJQgY29tbW9uIGljb24tbGlicmFyeSBoaW50c1xuLy8gICDigKIgY2xhc3MgICAgICAgICAgICAgICAgICAgICAgICAgICAg4oCUIHN0eWxlIGhvb2tzIChgLmljb24tdHJhc2gtMmApXG4vLyAgIOKAoiB3aWR0aCwgaGVpZ2h0ICAgICAgICAgICAgICAgICAgICDigJQgcmVuZGVyZWQgc2l6ZVxuLy8gICDigKIgdmlld0JveCAgICAgICAgICAgICAgICAgICAgICAgICAg4oCUIGNvb3JkaW5hdGUgc3lzdGVtIChoZWxwc1xuLy8gICAgIG1hdGNoIGFnYWluc3QgYSBrbm93biBpY29uIGxpYnJhcnkgYnkgYXNwZWN0IHJhdGlvKVxuLy8gICDigKIgPHRpdGxlPi88ZGVzYz4gZmlyc3QtY2hpbGQgdGV4dCDigJQgQVJJQS1yZWNvbW1lbmRlZCBhMTF5IGNoaWxkcmVuXG5jb25zdCBQUkVTRVJWRURfU1ZHX0FUVFJfUFJFRklYRVMgPSBbJ2RhdGEtJywgJ2FyaWEtJ107XG5jb25zdCBQUkVTRVJWRURfU1ZHX0FUVFJTID0gbmV3IFNldChbJ3JvbGUnLCAnY2xhc3MnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ3ZpZXdCb3gnLCAndGl0bGUnLCAnbmFtZScsICdmaWxsJ10pO1xuY29uc3QgZWxpZGVJbmxpbmVTdmdzID0gKGh0bWw6IHN0cmluZyk6IHN0cmluZyA9PlxuICBodG1sLnJlcGxhY2UoLzxzdmdcXGIoW14+XSopPihbXFxzXFxTXSo/KTxcXC9zdmc+L2csIChfbSwgYXR0cnM6IHN0cmluZywgYm9keTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIC8vIFBsdWNrIGV2ZXJ5IHByZXNlcnZlZCBhdHRyaWJ1dGUgYnkgcmVnZXggb3ZlciB0aGUgcmF3IGF0dHJzIHN0cmluZy5cbiAgICAvLyBUaGUgcmVnZXggdG9sZXJhdGVzIHVucXVvdGVkIHZhbHVlcyArIGRvdWJsZSArIHNpbmdsZSBxdW90ZXMuXG4gICAgY29uc3QgYXR0clJlID0gLyhbXFx3Oi1dKylcXHMqPVxccyooPzpcIihbXlwiXSopXCJ8JyhbXiddKiknfChcXFMrKSkvZztcbiAgICBsZXQgbTogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcbiAgICB3aGlsZSAoKG0gPSBhdHRyUmUuZXhlYyhhdHRycykpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBuYW1lID0gbVsxXSE7XG4gICAgICBjb25zdCB2ID0gbVsyXSA/PyBtWzNdID8/IG1bNF0gPz8gJyc7XG4gICAgICBjb25zdCBrZWVwID0gUFJFU0VSVkVEX1NWR19BVFRSUy5oYXMobmFtZSkgfHwgUFJFU0VSVkVEX1NWR19BVFRSX1BSRUZJWEVTLnNvbWUoKHApID0+IG5hbWUuc3RhcnRzV2l0aChwKSk7XG4gICAgICBpZiAoa2VlcCkgb3V0LnB1c2goYCR7bmFtZX09XCIke3YucmVwbGFjZSgvXCIvZywgJyZxdW90OycpfVwiYCk7XG4gICAgfVxuICAgIC8vIFN1cmZhY2UgaW5uZXIgPHRpdGxlPi88ZGVzYz4gdGV4dCDigJQgQVJJQS1yZWNvbW1lbmRlZCB3YXkgdG8gbGFiZWxcbiAgICAvLyBhbiBTVkcsIGFuZCBvZnRlbiB0aGUgb25seSBzaWduYWwgb2YgaWNvbiBtZWFuaW5nIHdoZW4gbm8gYXJpYVxuICAgIC8vIGF0dHJpYnV0ZXMgYXJlIHNldCBvbiB0aGUgaG9zdC5cbiAgICBjb25zdCB0aXRsZVRleHQgPSAvPHRpdGxlW14+XSo+KFtcXHNcXFNdKj8pPFxcL3RpdGxlPi8uZXhlYyhib2R5KT8uWzFdPy50cmltKCk7XG4gICAgaWYgKHRpdGxlVGV4dCkgb3V0LnB1c2goYGRhdGEtcGctc3ZnLXRpdGxlPVwiJHt0aXRsZVRleHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpfVwiYCk7XG4gICAgY29uc3QgZGVzY1RleHQgPSAvPGRlc2NbXj5dKj4oW1xcc1xcU10qPyk8XFwvZGVzYz4vLmV4ZWMoYm9keSk/LlsxXT8udHJpbSgpO1xuICAgIGlmIChkZXNjVGV4dCkgb3V0LnB1c2goYGRhdGEtcGctc3ZnLWRlc2M9XCIke2Rlc2NUZXh0LnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKX1cImApO1xuICAgIG91dC5wdXNoKCdkYXRhLXBnLWVsaWRlZD1cInN2Z1wiJyk7XG4gICAgcmV0dXJuIGA8c3ZnICR7b3V0LmpvaW4oJyAnKX0vPmA7XG4gIH0pO1xuXG4vLyBgPHNjcmlwdD5gIGNvbnRlbnQgY2FuIGNhcnJ5IGJvb3RzdHJhcCBkYXRhIChgd2luZG93Ll9fQVBQX0RBVEFfXyA9XG4vLyB7dG9rZW46IFwiLi4uXCJ9YCksIEFQSSBrZXlzLCB2ZW5kb3IgYW5hbHl0aWNzIGtleXMsIGFuZCBiYWNrZW5kIFVSTHMuXG4vLyBgPHN0eWxlPmAgY29udGVudCBpcyB1c3VhbGx5IGlycmVsZXZhbnQgbm9pc2UuIGA8bWV0YT5gIGVsZW1lbnRzIG9mdGVuXG4vLyBjYXJyeSBDU1JGL0NTUCB0b2tlbnMuIFN0cmlwIHRoZSBpbm5lciBjb250ZW50cyBvZiBhbGwgdGhyZWUuXG5jb25zdCBzdHJpcERhbmdlcm91c0VsZW1lbnRzID0gKGh0bWw6IHN0cmluZyk6IHN0cmluZyA9PlxuICBodG1sXG4gICAgLnJlcGxhY2UoLzxzY3JpcHRcXGJbXj5dKj5bXFxzXFxTXSo/PFxcL1xccypzY3JpcHQoPzpcXHNbXj5dKik/Pi9naSwgJzxzY3JpcHQgZGF0YS1wZy1lbGlkZWQ9XCJzY3JpcHQtY29udGVudFwiLz4nKVxuICAgIC5yZXBsYWNlKC88c3R5bGVcXGJbXj5dKj5bXFxzXFxTXSo/PFxcL1xccypzdHlsZVxccyo+L2dpLCAnPHN0eWxlIGRhdGEtcGctZWxpZGVkPVwic3R5bGUtY29udGVudFwiLz4nKVxuICAgIC5yZXBsYWNlKC88bWV0YVxcYltePl0qXFxiY29udGVudD1cIlteXCJdKlwiW14+XSo+L2dpLCAobSkgPT4ge1xuICAgICAgLy8gS2VlcCBtZXRhIG5hbWUvY2hhcnNldCB2aXNpYmxlIGJ1dCByZWRhY3QgYGNvbnRlbnRgIGlmIHRoZSBuYW1lXG4gICAgICAvLyBsb29rcyB0b2tlbi1iZWFyaW5nLlxuICAgICAgY29uc3QgbmFtZU1hdGNoID0gL1xcYm5hbWU9XCIoW15cIl0qKVwiLy5leGVjKG0pO1xuICAgICAgY29uc3QgbmFtZSA9IG5hbWVNYXRjaD8uWzFdID8/ICcnO1xuICAgICAgaWYgKC8oY3NyZnx0b2tlbnx4c3JmfG5vbmNlfGFwaVtfLV0/a2V5KS9pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIG0ucmVwbGFjZSgvXFxiY29udGVudD1cIlteXCJdKlwiLywgJ2NvbnRlbnQ9XCJbcmVkYWN0ZWQ6IG1ldGEtdG9rZW5dXCInKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtO1xuICAgIH0pO1xuXG4vLyBDYXAgb3V0ZXJIVE1MIHRvIGEgY2xvbmUgb2YgdGhlIGxpdmUgZWxlbWVudCB3aXRoIGRlc2NlbmRhbnRzIGJleW9uZFxuLy8gYG1heERlcHRoYCBsZXZlbHMgcmVwbGFjZWQgYnkgYDwhLS0gTiBjaGlsZHJlbiBlbGlkZWQgLS0+YCBtYXJrZXJzLiBUaGVcbi8vIHJvYXN0IGNhbGxlZCBvdXQgYSBzaW5nbGUgZ3JvdXBlZCBjYXB0dXJlIGNvbWluZyBiYWNrIGF0IDI1IEtCIGJlY2F1c2Vcbi8vIHRoZSBgb3V0ZXJIVE1MYCBzd2FsbG93ZWQgNjAgc3BhcmtsaW5lIGRhdGEgc3BhbnMg4oCUIGV4YWN0bHkgd2hhdCBhXG4vLyBkZXB0aCBjYXAgc29sdmVzIGF0IHRoZSBzb3VyY2UuIFJldHVybnMgdGhlIGNsb25lZCBvdXRlckhUTUwgYW5kIGhvd1xuLy8gbWFueSBkZXNjZW5kYW50IHN1YnRyZWVzIHdlcmUgZWxpZGVkLlxuLy8gU2VyaWFsaXplIGFuIGVsZW1lbnQncyBzaGFkb3dSb290IGNvbnRlbnQgYXMgYDx0ZW1wbGF0ZSBzaGFkb3dyb290bW9kZT1cIuKAplwiPuKApjwvdGVtcGxhdGU+YC5cbi8vIGBjbG9uZU5vZGUodHJ1ZSlgIGRvZXMgTk9UIGluY2x1ZGUgc2hhZG93IERPTSwgc28gY2FwdHVyZXMgb2YgY3VzdG9tLWVsZW1lbnRcbi8vIGhvc3RzIChMaXQncyBgPGZvcmVjYXN0LWl0ZW0+YCwgU3RlbmNpbCBjb21wb25lbnRzLCBnZW5lcmljIHdlYi1jb21wb25lbnRzKVxuLy8gd291bGQgb3RoZXJ3aXNlIGNvbWUgYmFjayBhcyBgPGZvcmVjYXN0LWl0ZW0+PC9mb3JlY2FzdC1pdGVtPmAg4oCUIGFuIExMTVxuLy8gcmVhZGluZyB0aGF0IHJvdyBzZWVzIG5vdGhpbmcgYWJvdXQgd2hhdCB0aGUgaG9zdCBhY3R1YWxseSByZW5kZXJzLiBXZSB1c2Vcbi8vIHRoZSBkZWNsYXJhdGl2ZS1zaGFkb3ctRE9NIHNlcmlhbGl6YXRpb24gc2hhcGUgc28gdGhlIExMTSAoYW5kIGFueSB0b29saW5nKVxuLy8gY2FuIHRlbGwgc2hhZG93IGNvbnRlbnQgZnJvbSBsaWdodC1ET00gY2hpbGRyZW4sIEFORCBzbyB0aGUgcGF5bG9hZCBpc1xuLy8gcm91bmQtdHJpcHBhYmxlIGludG8gYW5vdGhlciBicm93c2VyIGlmIGEgY29uc3VtZXIgd2FudHMgdG8uXG5jb25zdCBzZXJpYWxpemVTaGFkb3dDb250ZW50ID0gKGhvc3Q6IEVsZW1lbnQsIGRlcHRoOiBudW1iZXIsIG1heERlcHRoOiBudW1iZXIsIGVsaWRlZDoge2NvdW50OiBudW1iZXJ9KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHNyID0gKGhvc3QgYXMgYW55KS5zaGFkb3dSb290IGFzIFNoYWRvd1Jvb3QgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBpZiAoIXNyKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbW9kZSA9IHNyLm1vZGUgfHwgJ29wZW4nO1xuICAvLyBDbG9uZSBlYWNoIHRvcC1sZXZlbCBzaGFkb3cgY2hpbGQgaW5kaXZpZHVhbGx5IHNvIHdlIGNhbiBhcHBseSB0aGUgc2FtZVxuICAvLyBkZXB0aC1jYXAgd2Fsa2VyIHRvIHRoZW0uXG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIEFycmF5LmZyb20oc3IuY2hpbGRyZW4pKSB7XG4gICAgcGFydHMucHVzaChzZXJpYWxpemVXaXRoU2hhZG93KGNoaWxkLCBkZXB0aCArIDEsIG1heERlcHRoLCBlbGlkZWQpKTtcbiAgfVxuICByZXR1cm4gYDx0ZW1wbGF0ZSBzaGFkb3dyb290bW9kZT1cIiR7bW9kZX1cIj4ke3BhcnRzLmpvaW4oJycpfTwvdGVtcGxhdGU+YDtcbn07XG5cbi8vIFNlcmlhbGl6ZSBhbiBlbGVtZW50ICsgaXRzIHNoYWRvdyBjb250ZW50IGludG8gSFRNTCwgYXBwbHlpbmcgdGhlXG4vLyBkZXB0aC1jYXAgd2Fsa2VyIHVuaWZvcm1seSB0byBib3RoLiBDYWxsZXIgcGFzc2VzIGEgc2hhcmVkIGBlbGlkZWRgXG4vLyBjb3VudGVyIHNvIHRoZSBmaW5hbCBjb3VudCByZWZsZWN0cyBhbGwgc3VidHJlZXMgd2UgY29sbGFwc2VkLlxuY29uc3Qgc2VyaWFsaXplV2l0aFNoYWRvdyA9IChlbDogRWxlbWVudCwgZGVwdGg6IG51bWJlciwgbWF4RGVwdGg6IG51bWJlciwgZWxpZGVkOiB7Y291bnQ6IG51bWJlcn0pOiBzdHJpbmcgPT4ge1xuICAvLyBSZWNvbnN0cnVjdCB0aGUgb3BlbiB0YWcgZnJvbSBhdHRyaWJ1dGVzIChpbm5lckhUTUwgd291bGQgYmUgY2hlYXBlclxuICAvLyBidXQgd2UgY2FuJ3QgY29tYmluZSBpdCB3aXRoIGEgbWFudWFsbHktc2VyaWFsaXplZCBzaGFkb3cgcm9vdCkuXG4gIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgYXR0cnM6IHN0cmluZ1tdID0gW107XG4gIGlmIChlbC5hdHRyaWJ1dGVzKSB7XG4gICAgZm9yIChjb25zdCBhIG9mIEFycmF5LmZyb20oZWwuYXR0cmlidXRlcykpIHtcbiAgICAgIC8vIEVzY2FwZSBhdHRyaWJ1dGUgdmFsdWUncyBkb3VibGUtcXVvdGVzIGFuZCBhbXBlcnNhbmRzIHNvIHRoZVxuICAgICAgLy8gcHJvZHVjZWQgSFRNTCByb3VuZC10cmlwcy5cbiAgICAgIGNvbnN0IHYgPSBTdHJpbmcoYS52YWx1ZSkucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gICAgICBhdHRycy5wdXNoKGAke2EubmFtZX09XCIke3Z9XCJgKTtcbiAgICB9XG4gIH1cbiAgY29uc3Qgb3BlbiA9IGA8JHt0YWd9JHthdHRycy5sZW5ndGggPyAnICcgKyBhdHRycy5qb2luKCcgJykgOiAnJ30+YDtcbiAgLy8gU2VsZi1jbG9zaW5nIHZvaWRzIOKAlCBtYXRjaCBIVE1MIHNwZWMgc2VyaWFsaXplciBiZWhhdmlvci5cbiAgY29uc3QgVk9JRCA9IG5ldyBTZXQoWydhcmVhJywgJ2Jhc2UnLCAnYnInLCAnY29sJywgJ2VtYmVkJywgJ2hyJywgJ2ltZycsICdpbnB1dCcsICdsaW5rJywgJ21ldGEnLCAncGFyYW0nLCAnc291cmNlJywgJ3RyYWNrJywgJ3diciddKTtcbiAgaWYgKFZPSUQuaGFzKHRhZykpIHJldHVybiBvcGVuO1xuXG4gIGNvbnN0IHNoYWRvdyA9IHNlcmlhbGl6ZVNoYWRvd0NvbnRlbnQoZWwsIGRlcHRoLCBtYXhEZXB0aCwgZWxpZGVkKTtcblxuICAvLyBEZXB0aCBjYXAga2lja3MgaW4gZm9yIHRoZSBMSUdIVC1ET00gY2hpbGRyZW4gb25seTsgdGhlIHNoYWRvdyBjb250ZW50XG4gIC8vIGFscmVhZHkgY291bnRzIGl0cyBvd24gZGVwdGggdmlhIHRoZSByZWN1cnNpdmUgY2FsbC5cbiAgbGV0IGxpZ2h0SW5uZXI6IHN0cmluZztcbiAgaWYgKGRlcHRoID49IG1heERlcHRoICYmIGVsLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgIGNvbnN0IGNvdW50ID0gZWwuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIGVsaWRlZC5jb3VudCArPSBjb3VudDtcbiAgICBsaWdodElubmVyID0gYDwhLS0gJHtjb3VudH0gJHtjb3VudCA9PT0gMSA/ICdjaGlsZCcgOiAnY2hpbGRyZW4nfSBlbGlkZWQgLS0+YDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzZWdzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBBcnJheS5mcm9tKGVsLmNoaWxkTm9kZXMpKSB7XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSAvKiBlbGVtZW50ICovKSB7XG4gICAgICAgIHNlZ3MucHVzaChzZXJpYWxpemVXaXRoU2hhZG93KG5vZGUgYXMgRWxlbWVudCwgZGVwdGggKyAxLCBtYXhEZXB0aCwgZWxpZGVkKSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMgLyogdGV4dCAqLykge1xuICAgICAgICBzZWdzLnB1c2goU3RyaW5nKG5vZGUubm9kZVZhbHVlID8/ICcnKS5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7JykpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSA4IC8qIGNvbW1lbnQgKi8pIHtcbiAgICAgICAgc2Vncy5wdXNoKGA8IS0tJHtTdHJpbmcobm9kZS5ub2RlVmFsdWUgPz8gJycpfS0tPmApO1xuICAgICAgfVxuICAgIH1cbiAgICBsaWdodElubmVyID0gc2Vncy5qb2luKCcnKTtcbiAgfVxuICAvLyBEZWNsYXJhdGl2ZSBzaGFkb3cgRE9NIGNvbnZlbnRpb246IDx0ZW1wbGF0ZSBzaGFkb3dyb290bW9kZT4gc2l0cyBhcyB0aGVcbiAgLy8gZmlyc3QgY2hpbGQgb2YgdGhlIGhvc3QncyBjb250ZW50LCBCRUZPUkUgbGlnaHQtRE9NIGNoaWxkcmVuLiBNaXJyb3JzXG4gIC8vIHRoZSBzcGVjIHNvIGFuIExMTSAob3IgSFRNTCBwYXJzZXIpIHJlYWRpbmcgdGhpcyBrbm93cyBzaGFkb3cgZnJvbSBsaWdodC5cbiAgcmV0dXJuIGAke29wZW59JHtzaGFkb3cgPz8gJyd9JHtsaWdodElubmVyfTwvJHt0YWd9PmA7XG59O1xuXG5jb25zdCBjYXBwZWRPdXRlckhUTUwgPSAoZWw6IEVsZW1lbnQsIG1heERlcHRoID0gMik6IHtodG1sOiBzdHJpbmc7IGVsaWRlZDogbnVtYmVyfSA9PiB7XG4gIC8vIEZhc3QgcGF0aDogZWxlbWVudCBoYXMgbm8gc2hhZG93IHJvb3QgYW5kIG5laXRoZXIgZG8gaXRzIGRlc2NlbmRhbnRzXG4gIC8vIHdlJ2QgdG91Y2guIGNsb25lTm9kZSArIHRoZSBvcmlnaW5hbCB3YWxrIGlzIGNoZWFwZXIgdGhhbiB0aGUgbWFudWFsXG4gIC8vIHNlcmlhbGl6ZXIsIGFuZCBpdCBwcmVzZXJ2ZXMgcXVpcmtzIChib29sZWFuIGF0dHJpYnV0ZSBzZXJpYWxpemF0aW9uLFxuICAvLyBuYW1lc3BhY2VkIFNWRywgZXRjLikgdGhhdCB0aGUgbWFudWFsIHBhdGggYXBwcm94aW1hdGVzLlxuICBjb25zdCBoYXNBbnlTaGFkb3cgPSAoKCkgPT4ge1xuICAgIGlmICgoZWwgYXMgYW55KS5zaGFkb3dSb290KSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBDaGVhcCBzY2FuOiBsb29rIGF0IHRoZSBmaXJzdCB+NTAgZGVzY2VuZGFudHMgZm9yIGEgc2hhZG93Um9vdC4gQVxuICAgIC8vIHBhZ2Ugd2l0aCBtYW55IHNoYWRvdyBob3N0cyBpcyByYXJlIGluIGxpZ2h0LURPTSBhcHBzOyB0aGUgY29zdCBvZlxuICAgIC8vIHRoZSBmdWxsIHNjYW4gd291bGQgZGVmZWF0IHRoZSBwdXJwb3NlLiA1MCBpcyBlbm91Z2ggdG8gY2F0Y2ggdGhlXG4gICAgLy8gY29tbW9uIGNhc2UgKGEgc2luZ2xlIHNoYWRvdyByb290IGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSkuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRlc2MgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XG4gICAgICBjb25zdCBOID0gTWF0aC5taW4oZGVzYy5sZW5ndGgsIDUwKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTjsgaSsrKSBpZiAoKGRlc2NbaV0gYXMgYW55KS5zaGFkb3dSb290KSByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pKCk7XG4gIGlmIChoYXNBbnlTaGFkb3cpIHtcbiAgICBjb25zdCBlbGlkZWQgPSB7Y291bnQ6IDB9O1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBodG1sID0gc2VyaWFsaXplV2l0aFNoYWRvdyhlbCwgMCwgbWF4RGVwdGgsIGVsaWRlZCk7XG4gICAgICByZXR1cm4ge2h0bWwsIGVsaWRlZDogZWxpZGVkLmNvdW50fTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIEZhbGwgdGhyb3VnaCB0byBjbG9uZU5vZGUgcGF0aCBhcyBhIHNhZmV0eSBuZXQuXG4gICAgfVxuICB9XG4gIGxldCBlbGlkZWQgPSAwO1xuICB0cnkge1xuICAgIGNvbnN0IGNsb25lID0gZWwuY2xvbmVOb2RlKHRydWUpIGFzIEVsZW1lbnQ7XG4gICAgY29uc3Qgd2FsayA9IChub2RlOiBFbGVtZW50LCBkZXB0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm47XG4gICAgICBpZiAoZGVwdGggPj0gbWF4RGVwdGgpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSBub2RlLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgZWxpZGVkICs9IGNvdW50O1xuICAgICAgICBub2RlLmlubmVySFRNTCA9IGA8IS0tICR7Y291bnR9ICR7Y291bnQgPT09IDEgPyAnY2hpbGQnIDogJ2NoaWxkcmVuJ30gZWxpZGVkIC0tPmA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShub2RlLmNoaWxkcmVuKSkgd2FsayhjaGlsZCwgZGVwdGggKyAxKTtcbiAgICB9O1xuICAgIHdhbGsoY2xvbmUsIDApO1xuICAgIHJldHVybiB7aHRtbDogY2xvbmUub3V0ZXJIVE1MLCBlbGlkZWR9O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge2h0bWw6IGVsLm91dGVySFRNTCwgZWxpZGVkOiAwfTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBCT1RIIHRoZSB0cmltbWVkIEhUTUwgYW5kIHRoZSBvcmlnaW5hbCBieXRlIGxlbmd0aCB3aGVuIHRoZVxuLy8gdHJpbSBjYXAga2lja2VkIGluLiBMZXRzIGNhcHR1cmVFbnRyeSBleHBvc2UgYHRydW5jYXRlZC5vdXRlckhUTUxgXG4vLyAocGVyIEJVRy0wMTMpIHNvIGEgY29uc3VtZXIgY2FuIGRldGVjdCBlbGlzaW9uIGFuZCByZWZldGNoIGlmIG5lZWRlZC5cbmNvbnN0IHRyaW1IdG1sV2l0aFNpemUgPSAoaHRtbDogc3RyaW5nLCBtYXg6IG51bWJlcik6IHt2YWx1ZTogc3RyaW5nOyB0cnVuY2F0ZWQ/OiBudW1iZXJ9ID0+IHtcbiAgaWYgKCFodG1sKSByZXR1cm4ge3ZhbHVlOiBodG1sfTtcbiAgbGV0IGNsZWFuZWQgPSBlbGlkZURhdGFVcmlzKGh0bWwpO1xuICBjbGVhbmVkID0gZWxpZGVJbmxpbmVTdmdzKGNsZWFuZWQpO1xuICBjbGVhbmVkID0gc3RyaXBEYW5nZXJvdXNFbGVtZW50cyhjbGVhbmVkKTtcbiAgaWYgKGNsZWFuZWQubGVuZ3RoIDw9IG1heCkgcmV0dXJuIHt2YWx1ZTogY2xlYW5lZH07XG4gIGNvbnN0IG9yaWdpbmFsTGVuID0gaHRtbC5sZW5ndGg7XG4gIGNvbnN0IGN1dCA9IGNsZWFuZWQuc2xpY2UoMCwgbWF4KTtcbiAgY29uc3QgbGFzdCA9IGN1dC5sYXN0SW5kZXhPZignPicpO1xuICBjb25zdCB2YWx1ZSA9IChsYXN0ID4gbWF4IC0gMjAwID8gY3V0LnNsaWNlKDAsIGxhc3QgKyAxKSA6IGN1dCkgKyAn4oCmJztcbiAgcmV0dXJuIHt2YWx1ZSwgdHJ1bmNhdGVkOiBvcmlnaW5hbExlbn07XG59O1xuXG5jb25zdCB0cmltSHRtbCA9IChodG1sOiBzdHJpbmcsIG1heDogbnVtYmVyKTogc3RyaW5nID0+IHRyaW1IdG1sV2l0aFNpemUoaHRtbCwgbWF4KS52YWx1ZTtcblxuY29uc3QgcmVjdE9mID0gKGVsOiBFbGVtZW50KTogUmVjdCA9PiB7XG4gIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcmV0dXJuIHt4OiBNYXRoLnJvdW5kKHIueCksIHk6IE1hdGgucm91bmQoci55KSwgdzogTWF0aC5yb3VuZChyLndpZHRoKSwgaDogTWF0aC5yb3VuZChyLmhlaWdodCl9O1xufTtcblxuLy8gR2VuZXJhdGUgYSB1dWlkIHRoYXQgd29ya3MgaW4gc2VydmljZSB3b3JrZXJzLCBjb250ZW50IHNjcmlwdHMsIGFuZFxuLy8gb2xkZXIgQ2hyb21lIGNvbnRleHRzLiBjcnlwdG8ucmFuZG9tVVVJRCBleGlzdHMgaW4gbW9kZXJuIGJyb3dzZXJzOyB0aGVcbi8vIGZhbGxiYWNrIHVzZXMgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyBpZiBhdmFpbGFibGUsIGVsc2UgYSBwZXItcGFnZSBjb3VudGVyLlxubGV0IGZhbGxiYWNrVWlkQ291bnRlciA9IDA7XG5jb25zdCB1dWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIHRyeSB7IGlmIChjcnlwdG8ucmFuZG9tVVVJRCkgcmV0dXJuIGNyeXB0by5yYW5kb21VVUlEKCk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggKi8gfVxuICB0cnkge1xuICAgIGNvbnN0IGEgPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhKTtcbiAgICBhWzZdID0gKGFbNl0hICYgMHgwZikgfCAweDQwO1xuICAgIGFbOF0gPSAoYVs4XSEgJiAweDNmKSB8IDB4ODA7XG4gICAgY29uc3QgaCA9IEFycmF5LmZyb20oYSkubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKTtcbiAgICByZXR1cm4gYCR7aC5zbGljZSgwLCA4KX0tJHtoLnNsaWNlKDgsIDEyKX0tJHtoLnNsaWNlKDEyLCAxNil9LSR7aC5zbGljZSgxNiwgMjApfS0ke2guc2xpY2UoMjApfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBgdWlkXyR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9XyR7KCsrZmFsbGJhY2tVaWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgfVxufTtcblxuLy8gVHJ1ZSBpZiBgZWxgIGhhcyBhdCBsZWFzdCBvbmUgZGlyZWN0IHRleHQtbm9kZSBjaGlsZCB3aXRoIG5vbi13aGl0ZXNwYWNlXG4vLyBjb250ZW50LiBUaGUgcm9hc3QgY2F1Z2h0IHVzIGVtaXR0aW5nIGNvbmNhdGVuYXRlZCBkZXNjZW5kYW50IHRleHQgb25cbi8vIGNvbnRhaW5lciBlbGVtZW50cyAoYDxoZWFkZXI+YCwgYDxtYWluPmAsIGV0Yy4pIGFzIGB0ZXh0YCDigJQgd2hpY2hcbi8vIHByb2R1Y2VkIDIwMC1jaGFyIGR1bXBzIHRoYXQgd2VyZSBub2lzZSB0byBMTE1zLiBPbmx5IGVtaXQgYHRleHRgIHdoZW5cbi8vIHRoZSBlbGVtZW50IGRpcmVjdGx5IG93bnMgdGV4dCBvciBpcyBvdGhlcndpc2UgYSBjb250ZW50LWJlYXJpbmcgbGVhZi5cbmNvbnN0IGhhc093blRleHROb2RlID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIGZvciAoY29uc3Qgbm9kZSBvZiBBcnJheS5mcm9tKGVsLmNoaWxkTm9kZXMpKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMgLyogVEVYVF9OT0RFICovKSB7XG4gICAgICBjb25zdCB2ID0gKG5vZGUgYXMgVGV4dCkubm9kZVZhbHVlID8/ICcnO1xuICAgICAgaWYgKHYudHJpbSgpLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBPcHRpb25hbCBjbGljayBjb250ZXh0LiBUaHJlYWRlZCBieSB0aGUgY29udGVudC1zY3JpcHQgd2hlbiB0aGVcbi8vIGNhcHR1cmUgaXMgZHJpdmVuIGJ5IGEgY2xpY2sgKGFsdC1jbGljaywgYWx0LXNoaWZ0LWNsaWNrLCBhbHQtZHJhZyk7XG4vLyBhYnNlbnQgZm9yIG1hbnVhbC1jYXB0dXJlIC8gcmVjYXB0dXJlIC8gcHJvZ3JhbW1hdGljIGZsb3dzLiBVc2VkIHRvXG4vLyBjb21wdXRlIGNhbnZhcy1yZWxhdGl2ZSBjbGljayBjb29yZGluYXRlcyB3aGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50XG4vLyBsaXZlcyBpbnNpZGUgYSBgPGNhbnZhcz5gLlxuZXhwb3J0IHR5cGUgQ2FwdHVyZU9wdHMgPSB7XG4gIGNsaWNrQXQ/OiB7Y2xpZW50WDogbnVtYmVyOyBjbGllbnRZOiBudW1iZXJ9O1xufTtcblxuY29uc3QgZmluZENhbnZhc0FuY2VzdG9yID0gKGVsOiBFbGVtZW50KTogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsID0+IHtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbDtcbiAgd2hpbGUgKGN1cikge1xuICAgIGlmIChjdXIgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkgcmV0dXJuIGN1cjtcbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYXB0dXJlRW50cnkgPSAoZWw6IEVsZW1lbnQsIHNlcXVlbmNlOiBudW1iZXIsIG9wdHM6IENhcHR1cmVPcHRzID0ge30pOiBFbnRyeSA9PiB7XG4gIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgLy8gdGV4dENvbnRlbnQgKE5PVCBpbm5lclRleHQpIHNvIHNvdXJjZSBgUmVmcmVzaGAgZG9lc24ndCBnZXQgY2FwdHVyZWRcbiAgLy8gYXMgdGhlIENTUy1yZW5kZXJlZCBgUkVGUkVTSGAuIFJvYXN0IEJVRy0wMDEuXG4gIC8vIFNraXAgb24gbm9uLWxlYWYgY29udGFpbmVycyB0aGF0IGRvbid0IG93biBkaXJlY3QgdGV4dCDigJQgb3RoZXJ3aXNlXG4gIC8vIHRoZSB2YWx1ZSBpcyB0aGUgY29uY2F0ZW5hdGlvbiBvZiBldmVyeSBkZXNjZW5kYW50J3MgdGV4dCwgb2Z0ZW5cbiAgLy8gdHJ1bmNhdGVkIG1pZC13b3JkLCB3aGljaCBhbiBMTE0gdHJlYXRzIGFzIG9uZSB3YWxsIG9mIG11c2guXG4gIGNvbnN0IGlzTGVhZmlzaCA9ICFlbC5jaGlsZHJlbj8ubGVuZ3RoIHx8IGhhc093blRleHROb2RlKGVsKTtcbiAgY29uc3QgdGV4dCA9IGlzTGVhZmlzaCA/IHRyaW1UZXh0KGVsLnRleHRDb250ZW50LCAyNTApIDogJyc7XG4gIGNvbnN0IHJvbGUgPSBhdHRyKGVsLCAncm9sZScpIHx8IGltcGxpY2l0Um9sZShlbCk7XG4gIC8vIENhcHR1cmUgdGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gdG9vIHdoZW4gQ1NTIHRyYW5zZm9ybWVkIGl0LiBVc2VmdWxcbiAgLy8gZm9yIExMTXMgdGhhdCBuZWVkIGJvdGggc291cmNlIGFuZCByZW5kZXJlZCBmb3IgYSBVSSBidWcgbGlrZSBcInRoZVxuICAvLyBsYWJlbCBzYXlzIFNOT09aRSAxSCBpbiB0aGUgc2NyZWVuc2hvdCBidXQgdGhlIHNvdXJjZSBoYXMgU25vb3plIDFoXCIuXG4gIGNvbnN0IHJlbmRlcmVkVGV4dCA9ICgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNzLnRleHRUcmFuc2Zvcm0gJiYgY3MudGV4dFRyYW5zZm9ybSAhPT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbnN0IHIgPSB0cmltVGV4dCgoZWwgYXMgSFRNTEVsZW1lbnQpLmlubmVyVGV4dCwgMjUwKTtcbiAgICAgICAgcmV0dXJuIHIgJiYgciAhPT0gdGV4dCA/IHIgOiBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIHJldHVybiBudWxsO1xuICB9KSgpO1xuICBjb25zdCBhY2NOYW1lID0gYWNjZXNzaWJsZU5hbWUoZWwsIHJvbGUpO1xuICBjb25zdCB0ZXN0SWQgPSBhdHRyKGVsLCAnZGF0YS10ZXN0aWQnKSB8fCBhdHRyKGVsLCAnZGF0YS10ZXN0JykgfHxcbiAgICBhdHRyKGVsLCAnZGF0YS1jeScpIHx8IGF0dHIoZWwsICdkYXRhLXFhJyk7XG4gIGNvbnN0IHN0YWJsZUlkID0gaXNTdGFibGVJZChlbC5pZCkgPyBlbC5pZCA6IG51bGw7XG4gIGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc0xpc3QgPyBBcnJheS5mcm9tKGVsLmNsYXNzTGlzdCkuc2xpY2UoMCwgMzIpIDogW107XG4gIGNvbnN0IHthdHRycywgaGludHN9ID0gcG9wdWxhdGVkQXR0cnMoZWwpO1xuICBjb25zdCBjb21wUm9vdCA9IGNvbXBvbmVudFJvb3QoZWwpO1xuICBjb25zdCBmd2sgPSBmcmFtZXdvcmtJbmZvKGVsKTtcbiAgY29uc3QgdHJ1ZVN0YXRlcyA9IHBpY2tUcnVlU3RhdGVzKGVsKTtcbiAgY29uc3Qgc3R5bGVzID0gZXNzZW50aWFsU3R5bGVzKGVsKTtcbiAgY29uc3QgcHNldWRvID0gcHNldWRvU3R5bGVzKGVsKTtcbiAgY29uc3QgcnVsZXMgPSBjb2xsZWN0TWF0Y2hlZFJ1bGVzKGVsKTtcbiAgY29uc3Qgcm9vdCA9IGVsLmdldFJvb3ROb2RlKCk7XG4gIGNvbnN0IGluU2hhZG93ID0gcm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q7XG4gIC8vIFNoYWRvdy1yb290ZWQgZWxlbWVudHMgYXJlbid0IHJlYWNoYWJsZSBmcm9tIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsYCxcbiAgLy8gc28gdW5pcXVlbmVzcyBjaGVja3MgYWdhaW5zdCB0aGUgZG9jdW1lbnQgYWx3YXlzIGZhaWwuIFNjb3BlIHRvIHRoZVxuICAvLyBvd25pbmcgU2hhZG93Um9vdCB3aGVuIHByZXNlbnQg4oCUIHRoYXQncyBhbHNvIHdoZXJlIGEgY29uc3VtZXIgcXVlcnlpbmdcbiAgLy8gYHNoYWRvd0hvc3Quc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKC4uLilgIHdvdWxkIHJlc29sdmUgdGhlIHNlbGVjdG9yLlxuICBjb25zdCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290ID0gaW5TaGFkb3cgPyAocm9vdCBhcyBTaGFkb3dSb290KSA6IGRvY3VtZW50O1xuXG4gIC8vIFRlc3QtSURzIGFuZCBzdGFibGUgSURzIGFyZSBQUkVGRVJSRUQsIGJ1dCBvbmx5IHdoZW4gYWN0dWFsbHkgdW5pcXVlIG9uXG4gIC8vIHRoZSBwYWdlLiBSZWFsLXdvcmxkIHdlYXRoZXIvbGlzdCBVSXMgY29tbW9ubHkgdGFnIGV2ZXJ5IGNhcmQgd2l0aCB0aGVcbiAgLy8gc2FtZSBgZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJgIOKAlCBlbWl0dGluZyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWBcbiAgLy8gd291bGQgcmVzb2x2ZSB0byA3IGVsZW1lbnRzIGFuZCB0aGUgY29uc3VtZXIgY2FuJ3QgdGVsbCB3aGljaCBvbmUgd2FzXG4gIC8vIGNhcHR1cmVkLiBXaGVuIHRoZSB0ZXN0SWQgLyBzdGFibGVJZCBpcyBub24tdW5pcXVlIHdlIGZhbGwgdGhyb3VnaCB0b1xuICAvLyBjc3NQYXRoLCB3aGljaCBhZGRzIHdoYXRldmVyIHBhdGggLyBhbmNlc3RvciBzY29wZSBtYWtlcyB0aGUgY2FwdHVyZWRcbiAgLy8gZWxlbWVudCBhZGRyZXNzYWJsZS5cbiAgbGV0IHNlbGVjdG9yOiBzdHJpbmc7XG4gIGlmICh0ZXN0SWQpIHtcbiAgICBjb25zdCB0ZXN0SWRTZWwgPSBgW2RhdGEtdGVzdGlkPVwiJHt0ZXN0SWR9XCJdYDtcbiAgICBpZiAoaXNVbmlxdWUoc2NvcGUsIHRlc3RJZFNlbCwgZWwpKSB7XG4gICAgICBzZWxlY3RvciA9IHRlc3RJZFNlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVHJ5IGFuY2hvcmluZyB0aGUgdGVzdElkIHRvIGEgdW5pcXVlIGFuY2VzdG9yLCBvciBhcHBlbmRpbmcgdGhlXG4gICAgICAvLyBjYXB0dXJlZCBlbGVtZW50J3MgcGF0aC10YWlsLiBjc3NQYXRoKCkgYWxyZWFkeSBkb2VzIGJvdGggdmlhIHRoZVxuICAgICAgLy8gQVJJQSAvIHJvbGUgLyB1bmlxdWUtY2xhc3MgYW5jZXN0b3IgbGFkZGVyLCBidXQgaXQgZG9lc24ndCBTVEFSVFxuICAgICAgLy8gZnJvbSB0aGUgdGVzdElkLiBXZSBiaWFzIHRvd2FyZCBrZWVwaW5nIHRoZSB0ZXN0SWQgdmlzaWJsZSBieVxuICAgICAgLy8gcGFpcmluZyBpdCB3aXRoIGEgY2hpbGQgZGVzY3JpcHRvciB0aGF0IGRpc3Rpbmd1aXNoZXMgc2libGluZ3MuXG4gICAgICBjb25zdCBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgbGV0IHNjb3BlZCA9ICcnO1xuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBjb25zdCBzYW1lVGFnU2licyA9IEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maWx0ZXIoKGMpID0+IGMubm9kZU5hbWUgPT09IGVsLm5vZGVOYW1lKTtcbiAgICAgICAgaWYgKHNhbWVUYWdTaWJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBzY29wZWQgPSBgJHt0ZXN0SWRTZWx9Om50aC1vZi10eXBlKCR7c2FtZVRhZ1NpYnMuaW5kZXhPZihlbCkgKyAxfSlgO1xuICAgICAgICAgIGlmIChpc1VuaXF1ZShzY29wZSwgc2NvcGVkLCBlbCkpIHtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gc2NvcGVkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3RvciA9IGNzc1BhdGgoZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxlY3RvciA9IGNzc1BhdGgoZWwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3RvciA9IGNzc1BhdGgoZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChzdGFibGVJZCkge1xuICAgIGNvbnN0IGlkU2VsID0gYCMke2VzY2FwZUNzcyhzdGFibGVJZCl9YDtcbiAgICBzZWxlY3RvciA9IGlzVW5pcXVlKHNjb3BlLCBpZFNlbCwgZWwpID8gaWRTZWwgOiBjc3NQYXRoKGVsKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvciA9IGNzc1BhdGgoZWwpO1xuICB9XG5cbiAgLy8gQ2FwIG91dGVySFRNTCBhdCBkZXB0aD0yIEJFRk9SRSB0aGUgbGVuZ3RoLWNhcCBwYXNzOiBhIHNwYXJrbGluZVxuICAvLyB3cmFwcGVyIHdpdGggNjAgZGF0YSBzcGFucyB3b3VsZCBvdGhlcndpc2UgY29uc3VtZSB+OSBLQiBvZiBvbmVcbiAgLy8gZW50cnkuIENsb25pbmcgaW50byBhIGRldGFjaGVkIHN1YnRyZWUgbGV0cyB1cyByZXBsYWNlIGRlZXBcbiAgLy8gY2hpbGRyZW4gd2l0aCBgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gIG1hcmtlcnMgd2l0aG91dFxuICAvLyB0b3VjaGluZyB0aGUgbGl2ZSBET00uXG4gIGNvbnN0IGNhcHBlZEh0bWwgPSBjYXBwZWRPdXRlckhUTUwoZWwsIDIpO1xuICBjb25zdCB0cmltbWVkID0gdHJpbUh0bWxXaXRoU2l6ZShjYXBwZWRIdG1sLmh0bWwsIE1BWF9TTklQUEVUKTtcbiAgY29uc3Qgb3V0OiBFbnRyeSA9IHtcbiAgICB1aWQ6IHV1aWQoKSxcbiAgICBuOiBzZXF1ZW5jZSxcbiAgICB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICB0YWcsXG4gICAgc2VsZWN0b3IsXG4gICAgb3V0ZXJIVE1MOiB0cmltbWVkLnZhbHVlLFxuICAgIHJlY3Q6IHJlY3RPZihlbCksXG4gICAgLy8gUm91bmQgZHByIHRvIDIgZGVjaW1hbHMg4oCUIFdpbmRvd3MgZGlzcGxheSBzY2FsaW5nIHJlcG9ydHMgcmF3IHZhbHVlc1xuICAgIC8vIGxpa2UgMS43OTk5OTk5NTIzMTYyODQyICg9PSAxLjgpIHdoaWNoIGlzIGZsb2F0LWFyaXRobWV0aWMgbm9pc2UuXG4gICAgLy8gQ2FwdHVyZSB1c2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgdG9vIChsaWdodCB2cyBkYXJrLCBtb3Rpb25cbiAgICAvLyBwcmVmKSBzbyBhIGRvd25zdHJlYW0gTExNIGNhbiByZWFzb24gYWJvdXQgd2h5IGEgY2FwdHVyZWRcbiAgICAvLyBhcHBlYXJhbmNlIG1pZ2h0IGRpZmZlciBiZXR3ZWVuIHNlc3Npb25zLlxuICAgIHZpZXdwb3J0OiBidWlsZFZpZXdwb3J0U25hcHNob3QoKSxcbiAgfTtcbiAgaWYgKGNhcHBlZEh0bWwuZWxpZGVkID4gMCB8fCB0cmltbWVkLnRydW5jYXRlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0LnRydW5jYXRlZCA9IHt9O1xuICAgIGlmIChjYXBwZWRIdG1sLmVsaWRlZCA+IDApIG91dC50cnVuY2F0ZWQuY2hpbGRyZW4gPSBjYXBwZWRIdG1sLmVsaWRlZDtcbiAgICBpZiAodHJpbW1lZC50cnVuY2F0ZWQgIT09IHVuZGVmaW5lZCkgb3V0LnRydW5jYXRlZC5vdXRlckhUTUwgPSB0cmltbWVkLnRydW5jYXRlZDtcbiAgfVxuICBpZiAodGV4dCkgb3V0LnRleHQgPSB0ZXh0O1xuICBpZiAocmVuZGVyZWRUZXh0KSBvdXQucmVuZGVyZWRUZXh0ID0gcmVuZGVyZWRUZXh0O1xuICBpZiAocm9sZSkgb3V0LnJvbGUgPSByb2xlO1xuICBpZiAoYWNjTmFtZSAmJiBhY2NOYW1lICE9PSB0ZXh0KSBvdXQuYWNjZXNzaWJsZU5hbWUgPSBhY2NOYW1lO1xuICBpZiAoc3RhYmxlSWQpIG91dC5pZCA9IHN0YWJsZUlkO1xuICBpZiAodGVzdElkKSBvdXQudGVzdElkID0gdGVzdElkO1xuICBpZiAoY2xhc3Nlcy5sZW5ndGgpIG91dC5jbGFzc2VzID0gY2xhc3NlcztcbiAgaWYgKE9iamVjdC5rZXlzKGF0dHJzKS5sZW5ndGgpIG91dC5hdHRycyA9IGF0dHJzO1xuICBpZiAoaGludHMpIG91dC5oaW50cyA9IGhpbnRzO1xuICBpZiAoaW5TaGFkb3cpIHtcbiAgICBvdXQuaW5TaGFkb3dET00gPSB0cnVlO1xuICAgIGNvbnN0IHNoID0gc2hhZG93SG9zdFNlbGVjdG9yKGVsKTtcbiAgICBpZiAoc2gpIG91dC5zaGFkb3dIb3N0ID0gc2g7XG4gIH1cbiAgaWYgKGNvbXBSb290Py5jb21wYWN0KSBvdXQuY29tcG9uZW50Um9vdCA9IGNvbXBSb290LmNvbXBhY3Q7XG4gIGNvbnN0IGFuY2VzdG9ycyA9IGFuY2VzdG9yQ2hhaW4oZWwpO1xuICBpZiAoYW5jZXN0b3JzLmxlbmd0aCkgb3V0LmFuY2VzdG9ycyA9IGFuY2VzdG9ycztcbiAgaWYgKGZ3aykgb3V0LmNvbXBvbmVudCA9IGZ3aztcbiAgY29uc3QgZXZlbnRzID0gY29sbGVjdEV2ZW50TmFtZXMoZWwpO1xuICBpZiAoZXZlbnRzKSBvdXQuZXZlbnRzID0gZXZlbnRzO1xuICBjb25zdCBiZWhhdmlvckF0dHJzID0gY29sbGVjdEJlaGF2aW9yQXR0cnMoZWwpO1xuICBpZiAoYmVoYXZpb3JBdHRycykgb3V0LmJlaGF2aW9yQXR0cnMgPSBiZWhhdmlvckF0dHJzO1xuICBpZiAoaGFzQWN0aXZlQW5pbWF0aW9uKGVsKSkgb3V0LmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgLy8gQ2FwdHVyZSBhc3NldCByZWZlcmVuY2VzIHNvIGNvbXBsYWludHMgYWJvdXQgbG9nb3MgLyBpY29ucyAvXG4gIC8vIGFydHdvcmsgY2FuIGJlIHJlcGFpcmVkIHdpdGhvdXQgdmlzdWFsIGd1ZXNzaW5nLiBXYWxrcyA8aW1nPixcbiAgLy8gPHBpY3R1cmU+PHNvdXJjZT4sIGFuZCA8c3ZnIHVzZSBocmVmPiB3aXRoaW4gdGhlIGNhcHR1cmVkIHN1YnRyZWVcbiAgLy8gKG9uZSBsZXZlbCBvbmx5IOKAlCBkZXNjZW5kYW50IHNjb3BlIGlzIGFscmVhZHkgY2FwcGVkIGJ5IG91dGVySFRNTFxuICAvLyBlbGlzaW9uKS5cbiAgY29uc3QgYXNzZXRzOiBBcnJheTx7c3JjOiBzdHJpbmc7IG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjsgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7IGFsdD86IHN0cmluZzsgbG9hZGVkPzogYm9vbGVhbn0+ID0gW107XG4gIHRyeSB7XG4gICAgY29uc3QgaW1nTGlzdCA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nTGlzdC5sZW5ndGggJiYgYXNzZXRzLmxlbmd0aCA8IDg7IGkrKykge1xuICAgICAgY29uc3QgaW1nID0gaW1nTGlzdFtpXSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgICAgY29uc3Qgc3JjID0gaW1nLmN1cnJlbnRTcmMgfHwgaW1nLnNyYztcbiAgICAgIGlmICghc3JjIHx8IHNyYy5zdGFydHNXaXRoKCdkYXRhOicpKSBjb250aW51ZTsgLy8gc2tpcCBkYXRhOiBVUklzXG4gICAgICBjb25zdCByID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgYXNzZXRzLnB1c2goe1xuICAgICAgICBzcmM6IHRyaW1UZXh0KHNyYywgMjAwKSxcbiAgICAgICAgbmF0dXJhbFc6IGltZy5uYXR1cmFsV2lkdGggfHwgdW5kZWZpbmVkLFxuICAgICAgICBuYXR1cmFsSDogaW1nLm5hdHVyYWxIZWlnaHQgfHwgdW5kZWZpbmVkLFxuICAgICAgICByZW5kZXJlZFc6IE1hdGgucm91bmQoci53aWR0aCkgfHwgdW5kZWZpbmVkLFxuICAgICAgICByZW5kZXJlZEg6IE1hdGgucm91bmQoci5oZWlnaHQpIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgYWx0OiBpbWcuYWx0IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgbG9hZGVkOiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCA+IDAsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgdXNlTGlzdCA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3VzZVtocmVmXSwgdXNlW3hsaW5rXFxcXDpocmVmXScpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlTGlzdC5sZW5ndGggJiYgYXNzZXRzLmxlbmd0aCA8IDEyOyBpKyspIHtcbiAgICAgIGNvbnN0IHUgPSB1c2VMaXN0W2ldIGFzIFNWR1VzZUVsZW1lbnQ7XG4gICAgICBjb25zdCBocmVmID0gdS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCB1LmdldEF0dHJpYnV0ZSgneGxpbms6aHJlZicpO1xuICAgICAgaWYgKGhyZWYpIGFzc2V0cy5wdXNoKHtzcmM6IHRyaW1UZXh0KGhyZWYsIDIwMCl9KTtcbiAgICB9XG4gICAgLy8gRWxlbWVudCdzIG93biBiYWNrZ3JvdW5kLWltYWdlIChDU1MtZHJpdmVuIGFydHdvcmsg4oCUIGxvZ29zXG4gICAgLy8gc29tZXRpbWVzIHNoaXAgdmlhIGBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4uKWApLlxuICAgIHRyeSB7XG4gICAgICBjb25zdCBiZyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5iYWNrZ3JvdW5kSW1hZ2U7XG4gICAgICBpZiAoYmcgJiYgYmcgIT09ICdub25lJykge1xuICAgICAgICBjb25zdCB1cmxNID0gL3VybFxcKChbJ1wiXT8pKC4rPylcXDFcXCkvLmV4ZWMoYmcpO1xuICAgICAgICBpZiAodXJsTSAmJiAhdXJsTVsyXSEuc3RhcnRzV2l0aCgnZGF0YTonKSkge1xuICAgICAgICAgIGFzc2V0cy5wdXNoKHtzcmM6IHRyaW1UZXh0KHVybE1bMl0hLCAyMDApfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIGlmIChhc3NldHMubGVuZ3RoKSBvdXQuYXNzZXRzID0gYXNzZXRzO1xuXG4gIC8vIFNoaXAgYW4gYTExeSBjaGVjayBvbiBldmVyeSBlbnRyeSAoY29udHJhc3QgcmF0aW8gZm9yIHRleHQsXG4gIC8vIHRhYmJhYmlsaXR5IGZsYWcpIHNvIHJldmlld2VycyBkb24ndCBuZWVkIHRvIHJlLXJ1biBhbiBhdWRpdC5cbiAgLy8gSGVhdmllciBjaGVja3MgKGZvY3VzLXZpc2libGUgc2NyZWVuc2hvdCwgYXhlLXN0eWxlIHZpb2xhdGlvbnMpXG4gIC8vIG5lZWQgdGhlaXIgb3duIHBpcGVsaW5lOyB0aGlzIGlzIHRoZSBpbi1jYXB0dXJlIHBvcnRpb24uXG4gIGNvbnN0IGExMXkgPSBjb21wdXRlQWNjZXNzaWJpbGl0eUNoZWNrKGVsKTtcbiAgaWYgKGExMXkpIG91dC5hMTF5ID0gYTExeTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IChvdmVyZmxvdyAvIHBvc2l0aW9uIC8gZmxleCAvIGdyaWQgLyBzY3JvbGxcbiAgLy8gY29udGFpbmVycyAvIHN0YWNraW5nKS4gTGF5b3V0IGJ1Z3MgdHlwaWNhbGx5IGxpdmUgaW4gdGhlIGFuY2VzdG9yXG4gIC8vIGNoYWluLCBub3Qgb24gdGhlIGNhcHR1cmVkIGVsZW1lbnQgaXRzZWxmLlxuICBjb25zdCBsYXlvdXQgPSBjYXB0dXJlTGF5b3V0Q29udGV4dChlbCk7XG4gIGlmIChsYXlvdXQubGVuZ3RoKSBvdXQubGF5b3V0Q29udGV4dCA9IGxheW91dDtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBiZWZvcmUgdGhlIGNsaWNrIOKAlCByZXBybyBjb250ZXh0ICjCpzQuOCkuXG4gIC8vIFRoZSBjb250ZW50LXNjcmlwdC1vd25lZCByaW5nIGJ1ZmZlciBmZWVkcyB1cyB0aGUgcmVjZW50IGhpc3Rvcnk7XG4gIC8vIHdlIHNsaWNlIHRoZSBsYXN0IDMgc28gdGhlIGVudHJ5IHN0YXlzIHNtYWxsLiBTa2lwcGVkIHdoZW4gdGhlXG4gIC8vIGdldHRlciBpc24ndCB3aXJlZCAodGVzdC9zdGFuZGFsb25lIGhhcm5lc3NlcykuXG4gIGlmIChtdXRhdGlvbkJ1ZmZlckdldHRlcikge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlbnQgPSBtdXRhdGlvbkJ1ZmZlckdldHRlcigpO1xuICAgICAgLy8gRmlsdGVyIG91dCB0b29sLWluZHVjZWQgbXV0YXRpb25zIChjdXJzb3Igc3dhcCwgYm9keSBzdHlsZVxuICAgICAgLy8gaGl0cyBmcm9tIGNyb3NzaGFpciBtb2RlLCBvdmVybGF5IHBhaW50cywgcmluZyByZXBhaW50cykgc29cbiAgICAgIC8vIHRoZSBjb25zdW1lciBkb2Vzbid0IGhhdmUgdG8gd29uZGVyIHdoZXRoZXIgYGJvZHkgeyBjdXJzb3I6XG4gICAgICAvLyBjcm9zc2hhaXIgfWAgaXMgcGFydCBvZiB0aGVpciBhcHAuIFdlIG1hcmsgb3VyIG93biBtdXRhdGlvbnNcbiAgICAgIC8vIGJ5IHNvdXJjZSBhbmQgZXhjbHVkZSB0aGVtOyB1bi1tYXJrZWQgbXV0YXRpb25zIGFyZSBhcHAtZHJpdmVuLlxuICAgICAgY29uc3QgVE9PTF9OT0lTRV9SRSA9IC9eKGh0bWx8Ym9keXwjX19waW5jaGdyYWJfb3ZlcmxheSlcXGJ8Y3Vyc29yfHVzZXItc2VsZWN0fHdlYmtpdC11c2VyLXNlbGVjdC9pO1xuICAgICAgY29uc3QgZmlsdGVyZWQgPSByZWNlbnQuZmlsdGVyKChtKSA9PiB7XG4gICAgICAgIGlmIChUT09MX05PSVNFX1JFLnRlc3QobS50YXJnZXQpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChtLnR5cGUgPT09ICdhdHRyaWJ1dGVzJyAmJiBtLmF0dHJpYnV0ZU5hbWUgJiYgL14oc3R5bGV8Y3Vyc29yKSQvLnRlc3QobS5hdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICAgIC8vIGJvZHkgeyBjdXJzb3I6IGNyb3NzaGFpciB9IGZyb20gUGluY2hHcmFiJ3MgZHJhZyBtb2RlXG4gICAgICAgICAgcmV0dXJuICEobS50YXJnZXQuc3RhcnRzV2l0aCgnaHRtbCcpIHx8IG0udGFyZ2V0LnN0YXJ0c1dpdGgoJ2JvZHknKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGgpIG91dC5kb21NdXRhdGlvbnMgPSBmaWx0ZXJlZC5zbGljZSgtMyk7XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSBvYnNlcnZlciBlcnJvcnMgKi8gfVxuICB9XG4gIC8vIENvbnRlbnRlZGl0YWJsZSBlZGl0b3IgY29udGV4dCAoRi41KS4gV2hlbiB0aGUgY2FwdHVyZWQgZWxlbWVudFxuICAvLyBsaXZlcyBpbnNpZGUgYSByaWNoLXRleHQgZWRpdG9yIChQcm9zZU1pcnJvciAvIExleGljYWwgLyBTbGF0ZSAvXG4gIC8vIFF1aWxsIC8gVGlwVGFwIC8gbmF0aXZlKSwgc3VyZmFjZSB0aGUgbGlicmFyeSBraW5kICsgcm9vdCBzZWxlY3RvclxuICAvLyBzbyBhbiBMTE0gbG9va2luZyBhdCBcImNvcHkgaXMgd3JvbmdcIiBmZWVkYmFjayBrbm93cyB0aGUgZWRpdG9yXG4gIC8vIHdyYXBwZXIgdG8gaW5zcGVjdCByYXRoZXIgdGhhbiBjaGFzaW5nIGludGVybmFsIGVkaXRvciBzZWxlY3RvcnMuXG4gIGNvbnN0IGVkaXRvciA9IGVkaXRvckNvbnRleHQoZWwpO1xuICBpZiAoZWRpdG9yKSBvdXQuZWRpdG9yID0gZWRpdG9yO1xuICAvLyBDYW52YXMgY2xpY2sgY29vcmRzIChGLjMpLiBXaGVuIHRoZSBjYXB0dXJlIHRhcmdldCBpcyBhIGNhbnZhcyAob3JcbiAgLy8gYSBkZXNjZW5kYW50IOKAlCBEYXRhRG9nLXN0eWxlIGNoYXJ0cyBvZnRlbiByZW5kZXIgaW50byBhIGNhbnZhcyB3aXRoXG4gIC8vIHBzZXVkby1lbGVtZW50cyBsYXllcmVkIG9uIHRvcCksIGNvbXB1dGUgY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG9cbiAgLy8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveC4gU2tpcHBlZCBpZiB0aGUgY2FsbGVyIGRpZG4ndCBwcm92aWRlXG4gIC8vIGNsaWNrIGNvb3JkcyAobWFudWFsLWNhcHR1cmUgLyByZWNhcHR1cmUgZmxvd3MpLlxuICBpZiAob3B0cy5jbGlja0F0KSB7XG4gICAgY29uc3QgY2FudmFzID0gZmluZENhbnZhc0FuY2VzdG9yKGVsKTtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBjb25zdCByID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgb3V0LmNhbnZhc0NsaWNrID0ge1xuICAgICAgICBvZmZzZXRYOiBNYXRoLnJvdW5kKG9wdHMuY2xpY2tBdC5jbGllbnRYIC0gci5sZWZ0KSxcbiAgICAgICAgb2Zmc2V0WTogTWF0aC5yb3VuZChvcHRzLmNsaWNrQXQuY2xpZW50WSAtIHIudG9wKSxcbiAgICAgICAgY2FudmFzVzogTWF0aC5yb3VuZChyLndpZHRoKSxcbiAgICAgICAgY2FudmFzSDogTWF0aC5yb3VuZChyLmhlaWdodCksXG4gICAgICAgIGNhbnZhc1NlbGVjdG9yOiAoKCkgPT4geyB0cnkgeyByZXR1cm4gY3NzUGF0aChjYW52YXMpOyB9IGNhdGNoIHsgcmV0dXJuICdjYW52YXMnOyB9IH0pKCksXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAodHJ1ZVN0YXRlcy5sZW5ndGgpIG91dC5zdGF0ZXMgPSB0cnVlU3RhdGVzO1xuICBpZiAoT2JqZWN0LmtleXMoc3R5bGVzKS5sZW5ndGgpIG91dC5zdHlsZXMgPSBzdHlsZXM7XG4gIGlmIChydWxlcy5sZW5ndGgpIG91dC5tYXRjaGVkUnVsZXMgPSBydWxlcztcbiAgaWYgKE9iamVjdC5rZXlzKHBzZXVkbykubGVuZ3RoKSBvdXQucHNldWRvRWxlbWVudHMgPSBwc2V1ZG87XG5cbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuID4xIG1lYW5zIHRoZSBzZWxlY3RvciBpcyBhbWJpZ3VvdXM7IHVzZWZ1bFxuICAvLyB3aGVuIHBhaXJlZCB3aXRoIHJlY3QgLyBhbmNlc3RvcnMgdG8gZGlzYW1iaWd1YXRlLlxuICB0cnkge1xuICAgIG91dC5zZWxlY3Rvck1hdGNoQ291bnQgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5sZW5ndGg7XG4gIH0gY2F0Y2ggeyAvKiBpbnZhbGlkIHNlbGVjdG9yLCBsZWF2ZSBmaWVsZHMgb2ZmICovIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuY29uc3QgY29sbGVjdFJvb3RDc3NWYXJzID0gKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbiA9IGNzW2ldO1xuICAgIGlmIChuPy5zdGFydHNXaXRoKCctLScpKSB7XG4gICAgICBjb25zdCB2ID0gY3MuZ2V0UHJvcGVydHlWYWx1ZShuKS50cmltKCk7XG4gICAgICBpZiAodikgb3V0W25dID0gdjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFNoYXJlZCB2aWV3cG9ydCBzbmFwc2hvdCDigJQgdXNlZCBieSBib3RoIGJ1aWxkUGFnZUNvbnRleHQgKHNlc3Npb25cbi8vIGhlYWRlcikgYW5kIGNhcHR1cmVFbnRyeSAocGVyLWNhcHR1cmUsIGluIGNhc2Ugc3RhdGUgY2hhbmdlZCBiZXR3ZWVuXG4vLyB0aGUgcGFnZSByb3cgYW5kIHRoZSBjYXB0dXJlKS4gUGlja3MgdXAgZHByIHJvdW5kaW5nLCBjb2xvclNjaGVtZSxcbi8vIHJlZHVjZWRNb3Rpb24sIFJUTCBkaXJlY3Rpb24gKEYuMTMpLCBhbmQgdmlzdWFsVmlld3BvcnQgem9vbSAoRi4xNCkuXG5jb25zdCBidWlsZFZpZXdwb3J0U25hcHNob3QgPSAoKTogVmlld3BvcnQgPT4ge1xuICBjb25zdCB2OiBWaWV3cG9ydCA9IHtcbiAgICB3OiBNYXRoLnJvdW5kKHdpbmRvdy5pbm5lcldpZHRoKSxcbiAgICBoOiBNYXRoLnJvdW5kKHdpbmRvdy5pbm5lckhlaWdodCksXG4gICAgZHByOiBNYXRoLnJvdW5kKCh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSAqIDEwMCkgLyAxMDAsXG4gIH07XG4gIHRyeSB7XG4gICAgaWYgKG1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzKSB2LmNvbG9yU2NoZW1lID0gJ2RhcmsnO1xuICAgIGVsc2UgaWYgKG1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogbGlnaHQpJykubWF0Y2hlcykgdi5jb2xvclNjaGVtZSA9ICdsaWdodCc7XG4gICAgaWYgKG1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcykgdi5yZWR1Y2VkTW90aW9uID0gdHJ1ZTtcbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbi4gYGRpcj1cInJ0bFwiYCBvbiA8aHRtbD4sIG9yIGNvbXB1dGVkIENTUyBkaXJlY3Rpb25cbiAgLy8gd2hlbiBhbiBMVFIgZG9jdW1lbnQgZW1iZWRzIGFuIFJUTCBzdWJ0cmVlLiBXZSBzbmFwc2hvdCB0aGUgZG9jdW1lbnRcbiAgLy8gcm9vdCdzIGNvbXB1dGVkIGRpcmVjdGlvbi5cbiAgdHJ5IHtcbiAgICBjb25zdCBkaXIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmRpcmVjdGlvbjtcbiAgICBpZiAoZGlyID09PSAncnRsJykgdi5kaXJlY3Rpb24gPSAncnRsJztcbiAgICBlbHNlIGlmIChkaXIgPT09ICdsdHInKSB2LmRpcmVjdGlvbiA9ICdsdHInO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgLy8gWm9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCBpcyB0aGUgcGluY2gtem9vbSBmYWN0b3Igb25cbiAgLy8gdG91Y2ggZGV2aWNlczsgb24gZGVza3RvcCB3aXRoIGJyb3dzZXIgem9vbSB0aGUgdmFsdWUgc3RheXMgYXQgMVxuICAvLyBidXQgd2luZG93LmlubmVyV2lkdGgvSGVpZ2h0IHNocmluaywgc28gdGhpcyB3b24ndCBwaWNrIHVwXG4gIC8vIEN0cmwrcGx1cy9taW51cyB6b29tIOKAlCB0aGF0IHN1cmZhY2VzIGFzIGEgc21hbGxlciB2aWV3cG9ydC4gQm90aFxuICAvLyBhcmUgdXNlZnVsIGFuZCB3ZSBjYXB0dXJlIGJvdGguXG4gIHRyeSB7XG4gICAgY29uc3Qgc2NhbGUgPSAod2luZG93LnZpc3VhbFZpZXdwb3J0IGFzIGFueSk/LnNjYWxlO1xuICAgIGlmICh0eXBlb2Ygc2NhbGUgPT09ICdudW1iZXInICYmIE1hdGguYWJzKHNjYWxlIC0gMSkgPiAwLjAwMSkge1xuICAgICAgdi56b29tID0gTWF0aC5yb3VuZChzY2FsZSAqIDEwMCkgLyAxMDA7XG4gICAgfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIHY7XG59O1xuXG4vLyBSZWNlbnQtVGFiIHRyYWNrZXIgZm9yIGFjdGl2ZUZvY3VzLiBXaXJlZCBieSBjb250ZW50LXNjcmlwdC50cyBhdFxuLy8gYm9vdDsgd2Uga2VlcCB0aGUgdGltZXN0YW1wIG9mIHRoZSBsYXN0IFRhYiBrZXlkb3duIHNvIGJ1aWxkUGFnZUNvbnRleHRcbi8vIGNhbiBkZWNpZGUgd2hldGhlciB0byBmbGFnIHRoZSBmb2N1cyBhcyBcImtleWJvYXJkLWRyaXZlblwiLlxubGV0IGxhc3RUYWJBdCA9IDA7XG5leHBvcnQgY29uc3Qgbm90ZVRhYlByZXNzZWQgPSAoKTogdm9pZCA9PiB7IGxhc3RUYWJBdCA9IERhdGUubm93KCk7IH07XG5cbmNvbnN0IGFjdGl2ZUZvY3VzU25hcHNob3QgPSAoKToge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59IHwgbnVsbCA9PiB7XG4gIGNvbnN0IGFlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgaWYgKCFhZSB8fCBhZSA9PT0gZG9jdW1lbnQuYm9keSB8fCBhZSA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSByZXR1cm4gbnVsbDtcbiAgbGV0IHNlbGVjdG9yOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHRyeSB7IHNlbGVjdG9yID0gY3NzUGF0aChhZSk7IH0gY2F0Y2ggeyBzZWxlY3RvciA9IGFlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTsgfVxuICBjb25zdCBvdXQ6IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufSA9IHtzZWxlY3Rvcn07XG4gIGlmIChEYXRlLm5vdygpIC0gbGFzdFRhYkF0IDwgMTAwMCkgb3V0LnJlY2VudGx5VGFiYmVkID0gdHJ1ZTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFJlYWQgZ2l0IGNvbnRleHQgZnJvbSBhIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmNcbi8vIGJyYW5jaDptYWluXCI+YCB0YWcgaWYgdGhlIGNhcHR1cmVkIGFwcCBleHBvc2VzIG9uZS4gTm8tb3Agd2hlbiBhYnNlbnQuXG4vLyBMZXRzIGEgZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBidWlsZCB3YXMgdGhpcyBjYXB0dXJlZCBmcm9tP1wiXG4vLyB3aXRob3V0IGZvcmNpbmcgdGhlIHVzZXIgdG8gcmVtZW1iZXIuXG5jb25zdCByZWFkR2l0Q29udGV4dCA9ICgpOiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfSB8IG51bGwgPT4ge1xuICBjb25zdCBtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwicGluY2hncmFiLWJ1aWxkXCJdJykgYXMgSFRNTE1ldGFFbGVtZW50IHwgbnVsbDtcbiAgaWYgKCFtZXRhPy5jb250ZW50KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgY29udGVudCA9IG1ldGEuY29udGVudDtcbiAgY29uc3Qgb3V0OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfSA9IHt9O1xuICBjb25zdCBjb21taXQgPSAvXFxiY29tbWl0OihbXFx3Li1dKykvLmV4ZWMoY29udGVudCk/LlsxXTtcbiAgY29uc3QgYnJhbmNoID0gL1xcYmJyYW5jaDooW1xcdy4vLV0rKS8uZXhlYyhjb250ZW50KT8uWzFdO1xuICBjb25zdCBidWlsZCA9IC9cXGJidWlsZDooW1xcdy4vLV0rKS8uZXhlYyhjb250ZW50KT8uWzFdO1xuICBpZiAoY29tbWl0KSBvdXQuY29tbWl0ID0gdHJpbVRleHQoY29tbWl0LCA4MCk7XG4gIGlmIChicmFuY2gpIG91dC5icmFuY2ggPSB0cmltVGV4dChicmFuY2gsIDgwKTtcbiAgaWYgKGJ1aWxkKSBvdXQuYnVpbGQgPSB0cmltVGV4dChidWlsZCwgODApO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gQSBVUkwgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoYXQgdGhlIHVzZXIgd2FzIGxvb2tpbmcgYXQuXG4vLyBNYW55IFNQQXMgZHJpdmUgcm91dGluZyB2aWEgcXVlcnkgcGFyYW1zIChgP3JvdXRlPXNldHRpbmdzYCksIGhhc2hcbi8vIHJvdXRlcyAoYCMvdXNlcnMvNDJgKSwgb3IgcGF0aCBzZWdtZW50cy4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIGZyb21cbi8vIHRoZSBVUkwg4oCUIHJlY2VpdmVycyB2ZXJpZnkgYWdhaW5zdCB0aGUgc2NyZWVuc2hvdCBpZiB0aGV5IGNhcmUuXG5jb25zdCBidWlsZFJvdXRlU25hcHNob3QgPSAoKToge3BhdGhuYW1lPzogc3RyaW5nOyBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGhhc2g/OiBzdHJpbmc7IHJvdXRlTmFtZT86IHN0cmluZzsgcm91dGVQYXJhbT86IHN0cmluZ30gPT4ge1xuICBjb25zdCBvdXQ6IHtwYXRobmFtZT86IHN0cmluZzsgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyBoYXNoPzogc3RyaW5nOyByb3V0ZU5hbWU/OiBzdHJpbmc7IHJvdXRlUGFyYW0/OiBzdHJpbmd9ID0ge307XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgaWYgKHUucGF0aG5hbWUpIG91dC5wYXRobmFtZSA9IHUucGF0aG5hbWU7XG4gICAgaWYgKHUuaGFzaCkgb3V0Lmhhc2ggPSB1Lmhhc2g7XG4gICAgY29uc3QgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgbGV0IG5QYXJhbXMgPSAwO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHUuc2VhcmNoUGFyYW1zKSB7XG4gICAgICBpZiAoblBhcmFtcyA+PSAxNikgYnJlYWs7XG4gICAgICBwYXJhbXNba10gPSB0cmltVGV4dCh2LCAyMDApO1xuICAgICAgblBhcmFtcysrO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGgpIG91dC5xdWVyeSA9IHBhcmFtcztcbiAgICAvLyBDb21tb24gU1BBIHJvdXRlIGhpbnRzOiBgP3JvdXRlPXNldHRpbmdzYCwgYD90YWI9Zm9vYCwgYCMvdXNlcnMvNDJgLlxuICAgIGNvbnN0IHJvdXRlUXVlcnkgPSB1LnNlYXJjaFBhcmFtcy5nZXQoJ3JvdXRlJykgPz8gdS5zZWFyY2hQYXJhbXMuZ2V0KCd0YWInKSA/PyB1LnNlYXJjaFBhcmFtcy5nZXQoJ3ZpZXcnKTtcbiAgICBpZiAocm91dGVRdWVyeSkgb3V0LnJvdXRlTmFtZSA9IHRyaW1UZXh0KHJvdXRlUXVlcnksIDgwKTtcbiAgICBpZiAodS5oYXNoICYmIHUuaGFzaC5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBoYXNoUGF0aCA9IHUuaGFzaC5yZXBsYWNlKC9eI1xcLz8vLCAnJyk7XG4gICAgICBjb25zdCBzZWdzID0gaGFzaFBhdGguc3BsaXQoJy8nKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICBpZiAoc2Vncy5sZW5ndGgpIHtcbiAgICAgICAgb3V0LnJvdXRlTmFtZSA9IG91dC5yb3V0ZU5hbWUgPz8gdHJpbVRleHQoc2Vnc1swXSEsIDgwKTtcbiAgICAgICAgaWYgKHNlZ3MubGVuZ3RoID4gMSkgb3V0LnJvdXRlUGFyYW0gPSB0cmltVGV4dChzZWdzLnNsaWNlKDEpLmpvaW4oJy8nKSwgMjAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gQ2FwdHVyZSBhIHJlZGFjdGVkIHN0YXRlIHNuYXBzaG90IHNvIHJlY2VpdmVycyBjYW4gcmVwcm8gdGhlIHNjcmVlbi5cbi8vIFdlIGF2b2lkIGNvcHlpbmcgZXZlcnl0aGluZyDigJQgdGhhdCB3b3VsZCBsZWFrIHNlY3JldHMg4oCUIGFuZCBzdXJmYWNlXG4vLyBvbmx5OlxuLy8gICDigKIgbG9jYWxTdG9yYWdlIGtleXMgKyBzaXplcyAoTk9UIHZhbHVlczsgcmVjZWl2ZXJzIG5lZWQgdG8ga25vd1xuLy8gICAgIHdoYXQgc3RvcmFnZSBzaGFwZWQgdGhlIHNjcmVlbiwgbm90IHRoZSBjb250ZW50cylcbi8vICAg4oCiIGNvb2tpZSBuYW1lcyAoTk8gdmFsdWVzLCBldmVyKVxuLy8gICDigKIga25vd24gZmVhdHVyZS1mbGFnIGNvbnZlbnRpb25zOiBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1mbGFnc1wiPmBcbmNvbnN0IGJ1aWxkU3RhdGVTbmFwc2hvdCA9ICgpOiB7c3RvcmFnZUtleXM/OiBzdHJpbmdbXTsgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTsgY29va2llTmFtZXM/OiBzdHJpbmdbXTsgZmVhdHVyZUZsYWdzPzogc3RyaW5nfSB8IG51bGwgPT4ge1xuICBjb25zdCBvdXQ6IHtzdG9yYWdlS2V5cz86IHN0cmluZ1tdOyBzZXNzaW9uS2V5cz86IHN0cmluZ1tdOyBjb29raWVOYW1lcz86IHN0cmluZ1tdOyBmZWF0dXJlRmxhZ3M/OiBzdHJpbmd9ID0ge307XG4gIHRyeSB7XG4gICAgY29uc3QgbHNLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aCAmJiBsc0tleXMubGVuZ3RoIDwgMzI7IGkrKykge1xuICAgICAgY29uc3QgayA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XG4gICAgICBpZiAoaykgbHNLZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGlmIChsc0tleXMubGVuZ3RoKSBvdXQuc3RvcmFnZUtleXMgPSBsc0tleXM7XG4gIH0gY2F0Y2ggeyAvKiBTZWN1cml0eUVycm9yIG9uIGNyb3NzLW9yaWdpbiBmcmFtZXMgKi8gfVxuICB0cnkge1xuICAgIGNvbnN0IHNzS2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlc3Npb25TdG9yYWdlLmxlbmd0aCAmJiBzc0tleXMubGVuZ3RoIDwgMzI7IGkrKykge1xuICAgICAgY29uc3QgayA9IHNlc3Npb25TdG9yYWdlLmtleShpKTtcbiAgICAgIGlmIChrKSBzc0tleXMucHVzaChrKTtcbiAgICB9XG4gICAgaWYgKHNzS2V5cy5sZW5ndGgpIG91dC5zZXNzaW9uS2V5cyA9IHNzS2V5cztcbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3QgY29va2llTmFtZXMgPSBkb2N1bWVudC5jb29raWVcbiAgICAgIC5zcGxpdCgnOycpXG4gICAgICAubWFwKChjKSA9PiBjLnRyaW0oKS5zcGxpdCgnPScpWzBdISlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIC5zbGljZSgwLCAzMik7XG4gICAgaWYgKGNvb2tpZU5hbWVzLmxlbmd0aCkgb3V0LmNvb2tpZU5hbWVzID0gY29va2llTmFtZXM7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICB0cnkge1xuICAgIGNvbnN0IGZsYWdNZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwicGluY2hncmFiLWZsYWdzXCJdJykgYXMgSFRNTE1ldGFFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoZmxhZ01ldGE/LmNvbnRlbnQpIG91dC5mZWF0dXJlRmxhZ3MgPSB0cmltVGV4dChmbGFnTWV0YS5jb250ZW50LCA0MDApO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG91dCkubGVuZ3RoID8gb3V0IDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZFBhZ2VDb250ZXh0ID0gKCkgPT4ge1xuICBjb25zdCBjdHg6IGFueSA9IHtcbiAgICB1cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgdGl0bGU6IHRyaW1UZXh0KGRvY3VtZW50LnRpdGxlLCAyMDApLFxuICAgIHZpZXdwb3J0OiBidWlsZFZpZXdwb3J0U25hcHNob3QoKSxcbiAgICB0b2tlbnM6IGNvbGxlY3RSb290Q3NzVmFycygpLFxuICAgIHVzZXJBZ2VudDogdHJpbVRleHQobmF2aWdhdG9yLnVzZXJBZ2VudCwgMjQwKSxcbiAgICBsYW5nOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICcnLFxuICB9O1xuICBjb25zdCBnaXQgPSByZWFkR2l0Q29udGV4dCgpO1xuICBpZiAoZ2l0KSBjdHguZ2l0Q29udGV4dCA9IGdpdDtcbiAgY29uc3QgZm9jdXMgPSBhY3RpdmVGb2N1c1NuYXBzaG90KCk7XG4gIGlmIChmb2N1cykgY3R4LmFjdGl2ZUZvY3VzID0gZm9jdXM7XG4gIGNvbnN0IHJvdXRlID0gYnVpbGRSb3V0ZVNuYXBzaG90KCk7XG4gIGlmIChPYmplY3Qua2V5cyhyb3V0ZSkubGVuZ3RoKSBjdHgucm91dGUgPSByb3V0ZTtcbiAgY29uc3Qgc3RhdGUgPSBidWlsZFN0YXRlU25hcHNob3QoKTtcbiAgaWYgKHN0YXRlKSBjdHguc3RhdGUgPSBzdGF0ZTtcbiAgcmV0dXJuIGN0eDtcbn07XG5cbi8vIC0tLS0gRWxlbWVudC1zZXQgc2VtYW50aWNzIGZvciBydWJiZXItYmFuZCBkcmFnIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgU1RST05HX0lEX1JFID0gL14ocmFkaXgtfGhlYWRsZXNzdWktfG11aS18OnJbMC05YS16XSs6KS9pO1xuY29uc3QgaXNTdHJvbmdNYXJrZXIgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+XG4gIEJvb2xlYW4oXG4gICAgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlc3RpZCcpIHx8IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10ZXN0JykgfHxcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3knKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcWEnKSB8fFxuICAgIGVsLmdldEF0dHJpYnV0ZSgncm9sZScpIHx8IChlbC5pZCAmJiAhU1RST05HX0lEX1JFLnRlc3QoZWwuaWQpKSxcbiAgKTtcbmNvbnN0IE1FRElVTV9UQUdTID0gbmV3IFNldChbJ0JVVFRPTicsICdBJywgJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQScsICdGT1JNJ10pO1xuY29uc3QgV0VBS19UQUdTID0gbmV3IFNldChbJ0FSVElDTEUnLCAnU0VDVElPTicsICdOQVYnLCAnSEVBREVSJywgJ0ZPT1RFUicsICdMSSddKTtcbmNvbnN0IGlzTWVkaXVtTWFya2VyID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiBNRURJVU1fVEFHUy5oYXMoZWwudGFnTmFtZSk7XG5jb25zdCBpc1dlYWtNYXJrZXIgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+XG4gIFdFQUtfVEFHUy5oYXMoZWwudGFnTmFtZSkgfHwgL15IWzEtNl0kLy50ZXN0KGVsLnRhZ05hbWUpO1xuXG4vLyBTbmFwIGhvdmVyL2NsaWNrIHRhcmdldCB0byBpdHMgbmVhcmVzdCBcImNvbXBvbmVudFwiIGFuY2VzdG9yLiBXaXRob3V0XG4vLyB0aGlzLCBhbHQtaG92ZXJpbmcgYSBidXR0b24gd2l0aCBzdHJ1Y3R1cmVkIGNoaWxkcmVuIChpY29uIHNwYW4gK1xuLy8gbGFiZWwgc3Bhbikgc2VsZWN0cyB3aGljaGV2ZXIgaW5uZXIgc3BhbiB0aGUgY3Vyc29yIGhhcHBlbmVkIHRvIGxhbmRcbi8vIG9uIOKAlCB0aHJlZSBkaWZmZXJlbnQgY2FwdHVyZXMgb2YgdGhlIFwic2FtZSBjb21wb25lbnRcIiBkZXBlbmRpbmcgb24gYVxuLy8gZmV3LXBpeGVsIG1vdXNlIGRpZmZlcmVuY2UuIFNuYXAgd2Fsa3MgdXAgdGhlIERPTSBsb29raW5nIGZvciB0aGVcbi8vIGNsb3Nlc3QgU1RST05HIG9yIE1FRElVTSBtYXJrZXIgd2l0aGluIGBtYXhEZXB0aGAgbGV2ZWxzIGFuZCByZXR1cm5zXG4vLyB0aGF0IGFuY2VzdG9yOyBmYWxscyBiYWNrIHRvIHRoZSBvcmlnaW5hbCBlbGVtZW50IHdoZW4gbm9uZSBpcyBmb3VuZC5cbi8vXG4vLyBBbHNvIGZvbGRzIHRoZSBleGlzdGluZyBcImtub3duIGNhcHR1cmVkIHNlbGVjdG9yIGFuY2VzdG9yXCIgbG9va3VwIGludG9cbi8vIG9uZSBoZWxwZXIgc28gY2FsbGVycyBkb24ndCBoYXZlIHRvIGNoYWluIHR3byBwYXNzZXMuXG4vLyBUcnVlIHdoZW4gYW4gZWxlbWVudCBmaWxscyA5MCUrIG9mIHRoZSB2aWV3cG9ydCBpbiBib3RoIGF4ZXMuIFRoZVxuLy8gcnVudGltZSBmaWx0ZXJzIG91dCBzdWNoIGNhcHR1cmVzIChhbHQtY2xpY2sgc2tpcHMsIGRyYWcgcmVqZWN0cylcbi8vIGJlY2F1c2UgZ3JhYmJpbmcgdGhlIHBhZ2Ugd3JhcHBlciBpcyBuZXZlciB0aGUgdXNlcidzIGludGVudC4gVXNlZFxuLy8gaGVyZSBpbiBzbmFwVG9Db21wb25lbnQgdG8gQVZPSUQgd2Fsa2luZyB1cCB0byBhIGh1Z2UgYW5jZXN0b3Ig4oCUXG4vLyB0aGF0IHByb2R1Y2VkIHNpbGVudCBmYWlsdXJlcyBvbiBzaXRlcyBsaWtlIHdyYW5uZ2xlLmNvbS9hYm91dFxuLy8gd2hlcmUgdGhlIG5lYXJlc3QgU1RST05HIG1hcmtlciBpcyBgPG1haW4gaWQ9XCJtYWluXCI+YCAoaHVnZSksIHNvXG4vLyB0aGUgdXNlcidzIGFsdC1jbGljayBvbiBhIGhlYWRpbmcgZ290IHNuYXBwZWQgdG8gPG1haW4+IGFuZCB0aGVuXG4vLyByZWplY3RlZCBmb3IgYmVpbmcgaHVnZSwgd2l0aCBubyBjYXB0dXJlIGFuZCBubyByaW5nLlxuY29uc3QgaXNIdWdlVmlld3BvcnRGaWxsID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIGlmIChlbCA9PT0gZG9jdW1lbnQuYm9keSB8fCBlbCA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4gci53aWR0aCA+PSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuOSAmJiByLmhlaWdodCA+PSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjk7XG59O1xuXG5leHBvcnQgY29uc3Qgc25hcFRvQ29tcG9uZW50ID0gKFxuICB0Z3Q6IEVsZW1lbnQsXG4gIGtub3duQ2FwdHVyZWQ6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gIG1heERlcHRoID0gNCxcbik6IEVsZW1lbnQgPT4ge1xuICAvLyBGaXJzdCBwYXNzOiBwcmVmZXIgYSBrbm93bi1jYXB0dXJlZCBhbmNlc3RvciAoc28gcmUtaG92ZXJpbmcgYSBjaGlsZFxuICAvLyBvZiBhbiBhbHJlYWR5LXNhdmVkIGNhcmQgc25hcHMgdG8gdGhlIGNhcmQpLlxuICBpZiAoa25vd25DYXB0dXJlZC5zaXplKSB7XG4gICAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSB0Z3Q7XG4gICAgd2hpbGUgKGN1ciAmJiBjdXIgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGZvciAoY29uc3Qgc2VsIG9mIGtub3duQ2FwdHVyZWQpIHtcbiAgICAgICAgdHJ5IHsgaWYgKGN1ci5tYXRjaGVzKHNlbCkpIHJldHVybiBjdXI7IH0gY2F0Y2ggeyAvKiBpbnZhbGlkIHNlbGVjdG9yICovIH1cbiAgICAgIH1cbiAgICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgfVxuICAvLyBTZWNvbmQgcGFzczogbmVhcmVzdCBTVFJPTkcgb3IgTUVESVVNIG1hcmtlciB3aXRoaW4gZGVwdGgsIEJVVFxuICAvLyBza2lwIGFueSBhbmNlc3RvciB0aGF0J3Mgdmlld3BvcnQtc2l6ZWQuIFRoZSBydW50aW1lJ3MgaHVnZS1lbGVtZW50XG4gIC8vIGZpbHRlciByZWplY3RzIGh1Z2UgY2FwdHVyZXMsIHNvIHNuYXBwaW5nIHRoZXJlIGlzIGEgZ3VhcmFudGVlZFxuICAvLyBzaWxlbnQgbWlzcy4gSWYgdGhlIG1hcmtlciB3ZSBmaW5kIGlzIGh1Z2UsIGtlZXAgd2Fsa2luZyBhbmQgdHJ5XG4gIC8vIHRoZSBuZXh0OyBpZiBub3RoaW5nIGluLWRlcHRoIGlzIG5vbi1odWdlLCByZXR1cm4gdGhlIG9yaWdpbmFsXG4gIC8vIGNsaWNrIHRhcmdldCAod2hpY2ggY2FwdHVyZUVudHJ5IHRoZW4gdmFsaWRhdGVzIHNlcGFyYXRlbHkpLlxuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IHRndDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbWF4RGVwdGggJiYgY3VyICYmIGN1ciAhPT0gZG9jdW1lbnQuYm9keTsgaSsrKSB7XG4gICAgaWYgKChpc1N0cm9uZ01hcmtlcihjdXIpIHx8IGlzTWVkaXVtTWFya2VyKGN1cikpICYmICFpc0h1Z2VWaWV3cG9ydEZpbGwoY3VyKSkgcmV0dXJuIGN1cjtcbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuICByZXR1cm4gdGd0O1xufTtcblxuLy8gM0QtYXBwLXN0eWxlIHJpZ29yb3VzIHNlbGVjdGlvbjogcHJlLWNvbGxlY3QgYSBTVEFCTEUgY2FuZGlkYXRlIHNldCB3aGVuXG4vLyB0aGUgZHJhZyBzdGFydHMgKGBwaWNrRHJhZ0NhbmRpZGF0ZXNgKSwgdGhlbiBgZWxlbWVudHNJblJlY3RgIGZpbHRlcnNcbi8vIHRoYXQgc2V0IGJ5IHRoZSBydWJiZXItYmFuZCByZWN0IGVhY2ggZnJhbWUuIFRoZSBwb29sIGlzIGxvY2tlZCBvbmNlIHNvXG4vLyB0aGUgcnViYmVyIGJhbmQgZ3Jvd3MgLyBzaHJpbmtzIG1vbm90b25pY2FsbHkgd2l0aCByZWN0IHNpemUg4oCUIG5vIHJhbmRvbVxuLy8gc2VsZWN0cy9kZXNlbGVjdHMgbWlkLWRyYWcuXG4vL1xuLy8gRWFybGllciB0aGlzIGZ1bmN0aW9uIHBpY2tlZCBhIHNpbmdsZSBcInRpZXJcIiAoU1RST05HPWRhdGEtdGVzdGlkIOKGklxuLy8gTUVESVVNPXJvbGUvaWQvYnV0dG9uIOKGkiBXRUFLPWNsYXNzKSwgcHJlZmVycmluZyB3aGljaGV2ZXIgaGFkIOKJpTIgaGl0cyxcbi8vIGFuZCBzaWxlbnRseSBFWENMVURFRCBldmVyeXRoaW5nIG91dHNpZGUgdGhhdCB0aWVyIGZvciB0aGUgcmVzdCBvZiB0aGVcbi8vIGRyYWcuIFRoZSB1c2VyIHJlcG9ydGVkIGl0IGZlbHQgbGlrZSB0aGUgbWFycXVlZSB3YXMgXCJkaXNjcmltaW5hdGluZyBvblxuLy8geiBvciB0cmVlIHRpZXJcIiDigJQgZXhhY3RseSB0aGUgc3ltcHRvbSBvZiBhIHN0cm9uZ2x5LW1hcmtlZCBzaWJsaW5nXG4vLyBoaWphY2tpbmcgdGhlIHRpZXIgYW5kIGZpbHRlcmluZyBvdXQgYW4gZWxlbWVudCB0aGUgdXNlciBjb3VsZCBjbGVhcmx5XG4vLyBzZWUgaW5zaWRlIHRoZSByZWN0LiBXZSBub3cgcmV0dXJuIGV2ZXJ5IHZpc2libGUgbm9uLW92ZXJsYXkgZWxlbWVudDtcbi8vIHRoZSBpbm5lcm1vc3Qtb25seSBmaWx0ZXIgaW4gZWxlbWVudHNJblJlY3QgZHJvcHMgYW5jZXN0b3IgbWF0Y2hlcyB3aGVuXG4vLyBhIGRlc2NlbmRhbnQgYWxzbyBtYXRjaGVzLCB3aGljaCBnaXZlcyB0aGUgaW50dWl0aXZlIFwic2VsZWN0IHdoYXQncyBpblxuLy8gdGhlIHJlY3RcIiBiZWhhdmlvciB3aXRob3V0IHRoZSBpbnZpc2libGUgZXhjbHVzaW9uLlxuLy9cbi8vIFNlbGVjdGlvbiBtb2RlIChkcmFnIGRpcmVjdGlvbik6XG4vLyAgIOKAoiAnZnVsbCcgICAg4oCUIGVsZW1lbnQgYmJveCBGVUxMWSBFTkNMT1NFRCBieSB0aGUgcmVjdCAobGVmdOKGknJpZ2h0KS5cbi8vICAg4oCiICdwYXJ0aWFsJyDigJQgZWxlbWVudCBiYm94IElOVEVSU0VDVFMgdGhlIHJlY3QgKHJpZ2h04oaSbGVmdCkuXG5leHBvcnQgY29uc3QgcGlja0RyYWdDYW5kaWRhdGVzID0gKG92ZXJsYXlIb3N0OiBFbGVtZW50KTogRWxlbWVudFtdID0+IHtcbiAgY29uc3QgYWxsUmF3ID0gQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSk7XG4gIHJldHVybiBhbGxSYXcuZmlsdGVyKChlbCkgPT4ge1xuICAgIGlmIChvdmVybGF5SG9zdC5jb250YWlucyhlbCkpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKHIud2lkdGggPT09IDAgfHwgci5oZWlnaHQgPT09IDApIHJldHVybiBmYWxzZTtcbiAgICAvLyBEcm9wIHRoZSBwYWdlLXNwYW5uaW5nIHdyYXBwZXJzIChib2R5LCBmdWxsLWJsZWVkIHNlY3Rpb25zLCBldGMuKTtcbiAgICAvLyB0aG9zZSB3b3VsZCBhbHdheXMgbWF0Y2ggdGhlIHJlY3QgYW5kIGNyb3dkIG91dCB0aGVpciBjaGlsZHJlbi5cbiAgICBpZiAoci53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoICogMC45ICYmIHIuaGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0ICogMC45KSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGVsZW1lbnRzSW5SZWN0ID0gKFxuICBjYW5kaWRhdGVzOiByZWFkb25seSBFbGVtZW50W10sXG4gIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsXG4gIG1vZGU6ICdwYXJ0aWFsJyB8ICdmdWxsJyA9ICdwYXJ0aWFsJyxcbik6IEVsZW1lbnRbXSA9PiB7XG4gIGNvbnN0IG1pblggPSBNYXRoLm1pbih4MSwgeDIpO1xuICBjb25zdCBtYXhYID0gTWF0aC5tYXgoeDEsIHgyKTtcbiAgY29uc3QgbWluWSA9IE1hdGgubWluKHkxLCB5Mik7XG4gIGNvbnN0IG1heFkgPSBNYXRoLm1heCh5MSwgeTIpO1xuICBjb25zdCBtYXRjaGVzOiBFbGVtZW50W10gPSBbXTtcbiAgZm9yIChjb25zdCBlbCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChyLndpZHRoID09PSAwIHx8IHIuaGVpZ2h0ID09PSAwKSBjb250aW51ZTtcbiAgICBpZiAobW9kZSA9PT0gJ2Z1bGwnKSB7XG4gICAgICBpZiAoci5sZWZ0IDwgbWluWCB8fCByLnRvcCA8IG1pblkgfHwgci5yaWdodCA+IG1heFggfHwgci5ib3R0b20gPiBtYXhZKSBjb250aW51ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHIucmlnaHQgPCBtaW5YIHx8IHIubGVmdCA+IG1heFggfHwgci5ib3R0b20gPCBtaW5ZIHx8IHIudG9wID4gbWF4WSkgY29udGludWU7XG4gICAgfVxuICAgIG1hdGNoZXMucHVzaChlbCk7XG4gIH1cbiAgLy8gSW5uZXJtb3N0IOKAlCBkcm9wIGFuY2VzdG9ycyB0aGF0IGNvbnRhaW4gYW5vdGhlciBtYXRjaC4gU3RhYmxlIGJlY2F1c2VcbiAgLy8gaXQgb25seSBkZXBlbmRzIG9uIHRoZSBtYXRjaGVzIHNldCwgbm90IG9uIHJhbmtzLlxuICAvL1xuICAvLyBObyBhcnRpZmljaWFsIGNhcC4gVGhlIGVhcmxpZXIgMjQtZWxlbWVudCBjZWlsaW5nIGV4aXN0ZWQgdG8ga2VlcFxuICAvLyByaW5nIHJlcGFpbnQgY29zdCBwcmVkaWN0YWJsZSBpbiB3b3JzdC1jYXNlIFwicnViYmVyLWJhbmQgdGhlIHdob2xlXG4gIC8vIHZpZXdwb3J0XCIgZHJhZ3MsIGJ1dCBpdCBiZWNhbWUgdXNlci12aXNpYmxlOiBhIHJlYWwgc2VsZWN0aW9uIG9mXG4gIC8vIH4zMCBncmlkIGNlbGxzIHdvdWxkIHNpbGVudGx5IGRyb3AgdGhlIHRyYWlsaW5nIG9uZXMgd2l0aCBub1xuICAvLyBmZWVkYmFjay4gVHdvIHNhZmVyIG1pdGlnYXRpb25zIG5vdyBrZWVwIHBlcmZvcm1hbmNlIGJvdW5kZWQ6XG4gIC8vICAg4oCiIHBpY2tEcmFnQ2FuZGlkYXRlcyBhbHJlYWR5IHRyaW1zIGJvZHkgLyBwYWdlLXNwYW5uaW5nIHdyYXBwZXJzXG4gIC8vICAgICAodGhlIGVsZW1lbnRzIHRoYXQgd291bGQgb3RoZXJ3aXNlIGRvbWluYXRlIGFueSByZWN0KS5cbiAgLy8gICDigKIgY29udGVudC1zY3JpcHQgcGFpbnRzIHJpbmdzIHZpYSBhIGRpZmYgKG9ubHkgTkVXIGVsZW1lbnRzIGdldFxuICAvLyAgICAgYSByaW5nKSwgc28gYSBzdGFibGUgMjAwLWVsZW1lbnQgc2VsZWN0aW9uIGlzIG9uZSBwYWludCwgbm90XG4gIC8vICAgICAyMDAgcGFpbnRzIHBlciBmcmFtZS5cbiAgLy8gSWYgYSBmdXR1cmUgcGFnZSBnZW51aW5lbHkgcHJvZHVjZXMgdGhvdXNhbmRzIG9mIGlubmVybW9zdCBtYXRjaGVzXG4gIC8vIHdlJ2xsIHJldmlzaXQ7IHVudGlsIHRoZW4sIHNoaXAgd2hhdCB0aGUgdXNlciBhY3R1YWxseSBkcmV3LlxuICByZXR1cm4gbWF0Y2hlcy5maWx0ZXIoKGEpID0+ICFtYXRjaGVzLnNvbWUoKGIpID0+IGEgIT09IGIgJiYgYS5jb250YWlucyhiKSkpO1xufTtcbiIsCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gUGluY2hHcmFiIGNvbnRlbnQgc2NyaXB0IOKAlCBBbHQrQ2xpY2sgY2FwdHVyZSwgQWx0K2RyYWcgcnViYmVyLWJhbmQsXG4vLyBnb2xkLXN0YWdpbmcgbXVsdGktc2VsZWN0LCBvbi1wYWdlIGNvbW1lbnQgb3ZlcmxheS4gTG9hZGVkIG9uIGV2ZXJ5IHBhZ2U7XG4vLyBjb21tdW5pY2F0ZXMgd2l0aCB0aGUgc2lkZSBwYW5lbCB2aWEgY2hyb21lLnJ1bnRpbWUgbWVzc2FnZXMgKGFuZCBhXG4vLyBDdXN0b21FdmVudCBmYWxsYmFjayBpbiBzdGFuZGFsb25lIHRlc3QvUGxheXdyaWdodCBtb2RlKS5cbi8vXG4vLyBEZWNvbXBvc2VkIGludG86XG4vLyAgIOKAoiBkb20udHMgICAgIOKAlCBwdXJlIGhlbHBlcnMgKGNzc1BhdGgsIGNhcHR1cmVFbnRyeSwgZWxlbWVudHNJblJlY3QpXG4vLyAgIOKAoiB0eXBlcy50cyAgIOKAlCBzaGFyZWQgdHlwZXMgJiBtZXNzYWdlIHByb3RvY29sXG4vLyAgIOKAoiB0aGlzIGZpbGUgIOKAlCBvdmVybGF5LCBob3ZlciBzdGF0ZSBtYWNoaW5lLCBkcmFnLCBJUEMgcGx1bWJpbmdcbi8vXG4vLyBSZS1lbnRyeSBndWFyZDogaWYgYSBwcmV2aW91cyBpbnN0YW5jZSBhbHJlYWR5IHJhbiBpbiB0aGlzIHBhZ2UgKGUuZy5cbi8vIHNlcnZpY2Utd29ya2VyIHJlLWluamVjdGlvbiBvbiB0YWIgYWN0aXZhdGlvbiksIHJldXNlIGl0LlxuXG5pbXBvcnQge1xuICBjYXB0dXJlRW50cnksXG4gIGJ1aWxkUGFnZUNvbnRleHQsXG4gIGNzc1BhdGgsXG4gIGNvbXBhY3RUYXJnZXQsXG4gIGVsZW1lbnRzSW5SZWN0LFxuICBwaWNrRHJhZ0NhbmRpZGF0ZXMsXG4gIHNuYXBUb0NvbXBvbmVudCxcbiAgbm90ZVRhYlByZXNzZWQsXG4gIHNldE11dGF0aW9uQnVmZmVyR2V0dGVyLFxufSBmcm9tICcuL2RvbS50cyc7XG5pbXBvcnQgdHlwZSB7XG4gIEFubm90YXRpb25QYXlsb2FkLFxuICBDc1RvUGFuZWwsXG4gIERvbU11dGF0aW9uLFxuICBFbnRyeSxcbiAgUGFuZWxUb0NzLFxuICBQZ0VudmVsb3BlLFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBXaW5kb3cge1xuICAgIF9fcGluY2hncmFiQ29udGVudD86IFBpbmNoZ3JhYkFwaTtcbiAgICBfX3BpbmNoZ3JhYj86IFBpbmNoZ3JhYkFwaTtcbiAgfVxufVxuXG50eXBlIFBpbmNoZ3JhYkFwaSA9IHtcbiAgY2FwdHVyZUVudHJ5OiB0eXBlb2YgY2FwdHVyZUVudHJ5O1xuICBidWlsZFBhZ2VDb250ZXh0OiB0eXBlb2YgYnVpbGRQYWdlQ29udGV4dDtcbiAgY2FwdHVyZXM6IEFycmF5PHtlbnRyeTogRW50cnk7IHBhZ2U6IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkUGFnZUNvbnRleHQ+OyBncm91cGVkPzogYm9vbGVhbn0+IHwgbnVsbDtcbiAgZmxhc2hFbGVtZW50OiAoc2VsOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHNldEFsdDogKG9uOiBib29sZWFuKSA9PiB2b2lkO1xuICBuZXh0U2VxOiAoKSA9PiBudW1iZXI7XG4gIGhhbmRsZUNvbW1hbmQ6IChtc2c6IFBnRW52ZWxvcGU8UGFuZWxUb0NzPiwgcmVzcG9uZDogKHI6IGFueSkgPT4gdm9pZCkgPT4gYm9vbGVhbjtcbiAgZGVzdHJveTogKCkgPT4gdm9pZDtcbn07XG5cbmNvbnN0IExPRyA9ICdbUGluY2hHcmFiL2NzXSc7XG5jb25zdCBLRVkgPSAnX19waW5jaGdyYWJDb250ZW50JztcblxuaWYgKHdpbmRvd1tLRVldKSB7XG4gIGNvbnNvbGUubG9nKExPRywgJ2FscmVhZHkgaW5pdGlhbGl6ZWQ7IHJldXNpbmcuJyk7XG59IGVsc2Uge1xuICBpbml0KCk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKTogdm9pZCB7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuICBjb25zdCB0ZXN0Q2FwdHVyZXMgPSBpbkV4dGVuc2lvbiA/IG51bGwgOiAoW10gYXMgQXJyYXk8e2VudHJ5OiBFbnRyeTsgcGFnZTogUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRQYWdlQ29udGV4dD47IGdyb3VwZWQ/OiBib29sZWFufT4pO1xuXG4gIC8vIOKUgOKUgOKUgCBPdmVybGF5IHNoYWRvdyBob3N0IChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBTdHJpY3QtQ1NQIHBhZ2VzIChHaXRIdWIsIGJhbmtzKSByZWplY3QgaW5saW5lIDxzdHlsZT4gdGFncyBBTkRcbiAgLy8gYWRvcHRlZFN0eWxlU2hlZXRzIOKAlCBib3RoIGFyZSBnYXRlZCBieSB0aGUgcGFnZSdzIGBzdHlsZS1zcmNgLiBCcm93c2Vyc1xuICAvLyBkbyBhbGxvdyBpbmxpbmUtc3R5bGUgbXV0YXRpb25zIHRocm91Z2ggdGhlIEpTIGBIVE1MRWxlbWVudC5zdHlsZWAgQVBJLFxuICAvLyBzbyB3ZSBhcHBseSBldmVyeSBvdmVybGF5IHN0eWxlIHRoYXQgd2F5IChzZWUgYXBwbHlTdHlsZXMgYmVsb3cpLlxuICBjb25zdCBvdmVybGF5SG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBvdmVybGF5SG9zdC5pZCA9ICdfX3BpbmNoZ3JhYl9vdmVybGF5JztcbiAgT2JqZWN0LmFzc2lnbihvdmVybGF5SG9zdC5zdHlsZSwge1xuICAgIGFsbDogJ2luaXRpYWwnLCBwb3NpdGlvbjogJ2ZpeGVkJywgdG9wOiAnMCcsIGxlZnQ6ICcwJywgcmlnaHQ6ICcwJywgYm90dG9tOiAnMCcsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLCB6SW5kZXg6ICcyMTQ3NDgzNjQ2JyxcbiAgfSk7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChvdmVybGF5SG9zdCk7XG4gIGNvbnN0IHNoYWRvdyA9IG92ZXJsYXlIb3N0LmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSk7XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZSBTVkc6IGNvbm5lY3RvcnMgZnJvbSB0aGUgc2lkZS1wYW5lbCBlZGdlIG9mIHRoZSB2aWV3cG9ydCB0b1xuICAvLyBlYWNoIHJpbmdlZCBlbGVtZW50LiBUaGUgcGFnZSBjYW4ndCBzZWUgdGhlIHNpZGUtcGFuZWwgaXRzZWxmIChzZXBhcmF0ZVxuICAvLyBmcmFtZSksIGJ1dCBDaHJvbWUgcHV0cyB0aGUgc2lkZS1wYW5lbCBhZGphY2VudCB0byB0aGUgcGFnZSdzIHJpZ2h0XG4gIC8vIGVkZ2UsIHNvIGEgY3VydmUgZnJvbSAoaW5uZXJXaWR0aCwgbWlkWSkgaXMgdGhlIHZpc3VhbCBzdGFuZC1pbiBmb3JcbiAgLy8gXCJmcm9tIHRoZSBzaWRlLXBhbmVsXCIuIE9uZSBjb250YWluZXIsIG9uZSBwYXRoIHBlciByaW5nIHNsb3QuXG4gIGNvbnN0IG5vb2RsZVN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gIE9iamVjdC5hc3NpZ24obm9vZGxlU3ZnLnN0eWxlLCB7XG4gICAgcG9zaXRpb246ICdmaXhlZCcsIHRvcDogJzAnLCBsZWZ0OiAnMCcsXG4gICAgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIHpJbmRleDogJzInLFxuICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBSaW5nIHBvb2w6IHRyYWNrcyBlbGVtZW50cyB3aXRoIHJBRi1wb3NpdGlvbmVkIG91dGxpbmUgcmluZ3Mg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgU2xvdCA9IHtlbDogSFRNTERpdkVsZW1lbnQ7IGxhYmVsOiBIVE1MRGl2RWxlbWVudDsgcGF0aDogU1ZHUGF0aEVsZW1lbnQ7IHJhZjogbnVtYmVyOyB0YXJnZXQ6IEVsZW1lbnQgfCBudWxsfTtcbiAgY29uc3QgcmluZ3MgPSBuZXcgTWFwPHN0cmluZywgU2xvdD4oKTtcbiAgY29uc3QgUklOR19CQVNFOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYm9yZGVyOiAnMnB4IHNvbGlkICNmZjVmMDAnLFxuICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgM3B4IHJnYmEoMjU1LDk1LDAsLjE4KSwgMCAwIDE2cHggcmdiYSgyNTUsOTUsMCwuNCknLFxuICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4wOHMgbGluZWFyJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICB6SW5kZXg6ICcxJyxcbiAgfTtcbiAgY29uc3QgUklOR19HT0xEOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIGJvcmRlckNvbG9yOiAnI2ZmZDE2NicsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgM3B4IHJnYmEoMjU1LDIwOSwxMDIsLjIyKSwgMCAwIDE4cHggcmdiYSgyNTUsMjA5LDEwMiwuNDUpJyxcbiAgfTtcbiAgLy8gTGl2ZSBkcmFnIHByZXZpZXc6IGJyaWdodCBsaW1lLCB0aGlja2VyIGJvcmRlciwgbW9yZSB2aXNpYmxlIGhhbG8gc29cbiAgLy8gdGhlIHVzZXIgY2FuIGNsZWFybHkgc2VlIHdoYXQgdGhlIHJ1YmJlciBiYW5kIHdpbGwgY29tbWl0IG9uIHJlbGVhc2UuXG4gIGNvbnN0IFJJTkdfUFJFVklFVzogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiA9IHtcbiAgICBib3JkZXJDb2xvcjogJyM3YmQ5N2EnLFxuICAgIGJvcmRlcldpZHRoOiAnM3B4JyxcbiAgICBib3hTaGFkb3c6ICcwIDAgMCAzcHggcmdiYSgxMjMsMjE3LDEyMiwuMzIpLCAwIDAgMjJweCByZ2JhKDEyMywyMTcsMTIyLC41NSknLFxuICB9O1xuICBjb25zdCBMQUJFTF9CQVNFOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDk1LDAsLjY1KScsIGNvbG9yOiAnI2ZmZicsXG4gICAgZm9udDogXCI2MDAgMTFweC8xLjIgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgcGFkZGluZzogJzNweCA2cHgnLCBib3JkZXJSYWRpdXM6ICczcHgnLFxuICAgIHdpZHRoOiAnMjIwcHgnLCBoZWlnaHQ6ICcxNnB4JyxcbiAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJywgb3ZlcmZsb3c6ICdoaWRkZW4nLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgdGV4dFNoYWRvdzogJzAgMXB4IDJweCByZ2JhKDAsMCwwLC40NSknLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIGRpc3BsYXk6ICdub25lJyxcbiAgfTtcbiAgY29uc3QgZW5zdXJlUmluZyA9IChrZXk6IHN0cmluZyk6IFNsb3QgPT4ge1xuICAgIGxldCBzbG90ID0gcmluZ3MuZ2V0KGtleSk7XG4gICAgaWYgKHNsb3QpIHJldHVybiBzbG90O1xuICAgIC8vIENsYXNzZXMgYXJlIGtlcHQgcHVyZWx5IGFzIGlkZW50aWZpZXJzIChxdWVyeVNlbGVjdG9yIHRlc3QgaG9va3MpO1xuICAgIC8vIHZpc3VhbCBzdHlsaW5nIGlzIGlubGluZSBiZWNhdXNlIHBhZ2UgQ1NQIGNhbiBibG9jayBzdHlsZXNoZWV0cy5cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmNsYXNzTmFtZSA9ICdyaW5nJztcbiAgICBPYmplY3QuYXNzaWduKGVsLnN0eWxlLCBSSU5HX0JBU0UpO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGFiZWwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICBPYmplY3QuYXNzaWduKGxhYmVsLnN0eWxlLCBMQUJFTF9CQVNFKTtcbiAgICAvLyBOb29kbGUgcGF0aCBjb25uZWN0aW5nIChpbm5lcldpZHRoLCBtaWRZKSDihpIgZWxlbWVudCBjZW50ZXIuXG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzEuNScpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UtbGluZWNhcCcsICdyb3VuZCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgJzAuNDUnKTtcbiAgICBpZiAoIW5vb2RsZVN2Zy5pc0Nvbm5lY3RlZCkgc2hhZG93LmFwcGVuZChub29kbGVTdmcpO1xuICAgIG5vb2RsZVN2Zy5hcHBlbmQocGF0aCk7XG4gICAgc2hhZG93LmFwcGVuZChlbCwgbGFiZWwpO1xuICAgIHNsb3QgPSB7ZWwsIGxhYmVsLCBwYXRoLCByYWY6IDAsIHRhcmdldDogbnVsbH07XG4gICAgcmluZ3Muc2V0KGtleSwgc2xvdCk7XG4gICAgcmV0dXJuIHNsb3Q7XG4gIH07XG4gIGNvbnN0IHJlbW92ZVJpbmcgPSAoa2V5OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzbG90ID0gcmluZ3MuZ2V0KGtleSk7XG4gICAgaWYgKCFzbG90KSByZXR1cm47XG4gICAgaWYgKHNsb3QucmFmKSBjYW5jZWxBbmltYXRpb25GcmFtZShzbG90LnJhZik7XG4gICAgc2xvdC5lbC5yZW1vdmUoKTtcbiAgICBzbG90LmxhYmVsLnJlbW92ZSgpO1xuICAgIHNsb3QucGF0aC5yZW1vdmUoKTtcbiAgICByaW5ncy5kZWxldGUoa2V5KTtcbiAgfTtcbiAgY29uc3QgY2xlYXJSaW5ncyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLnJpbmdzLmtleXMoKV0pIHJlbW92ZVJpbmcoayk7XG4gICAgbm9vZGxlU3ZnLnJlbW92ZSgpO1xuICB9O1xuICB0eXBlIFJpbmdPcHRzID0ge2dvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFuOyBwcmV2aWV3PzogYm9vbGVhbjsgbGFiZWw/OiBzdHJpbmd9O1xuICBjb25zdCBwb3NpdGlvblJpbmcgPSAoc2xvdDogU2xvdCwgdGFyZ2V0OiBFbGVtZW50LCBvcHRzOiBSaW5nT3B0cyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHIgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgcmluZ1N0eWxlID0gc2xvdC5lbC5zdHlsZTtcbiAgICByaW5nU3R5bGUubGVmdCA9IGAke01hdGgubWF4KDAsIHIubGVmdCAtIDMpfXB4YDtcbiAgICByaW5nU3R5bGUudG9wID0gYCR7TWF0aC5tYXgoMCwgci50b3AgLSAzKX1weGA7XG4gICAgcmluZ1N0eWxlLndpZHRoID0gYCR7TWF0aC5tYXgoMCwgci53aWR0aCArIDYpfXB4YDtcbiAgICByaW5nU3R5bGUuaGVpZ2h0ID0gYCR7TWF0aC5tYXgoMCwgci5oZWlnaHQgKyA2KX1weGA7XG4gICAgcmluZ1N0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGlmIChvcHRzLnByZXZpZXcpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmluZ1N0eWxlLCBSSU5HX1BSRVZJRVcpO1xuICAgIH0gZWxzZSBpZiAob3B0cy5nb2xkKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHJpbmdTdHlsZSwgUklOR19HT0xEKTtcbiAgICAgIHJpbmdTdHlsZS5ib3JkZXJXaWR0aCA9ICcycHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICByaW5nU3R5bGUuYm9yZGVyQ29sb3IgPSAnI2ZmNWYwMCc7XG4gICAgICByaW5nU3R5bGUuYm94U2hhZG93ID0gUklOR19CQVNFLmJveFNoYWRvdyE7XG4gICAgICByaW5nU3R5bGUuYm9yZGVyV2lkdGggPSAnMnB4JztcbiAgICB9XG4gICAgcmluZ1N0eWxlLmJvcmRlclN0eWxlID0gb3B0cy5kYXNoZWQgPyAnZGFzaGVkJyA6ICdzb2xpZCc7XG4gICAgLy8gTm8gZmxvYXRpbmcgbGFiZWwgYWJvdmUgdGhlIGhpZ2hsaWdodGVkIGVsZW1lbnQg4oCUIHRoZSBvbi1wYWdlIGNvbW1lbnRcbiAgICAvLyBib3ggKGFubm90YXRpb24gb3ZlcmxheSkgYWxyZWFkeSBzaG93cyBldmVyeXRoaW5nIHRoZSB1c2VyIG5lZWRzIGFuZFxuICAgIC8vIHRoZSBmbG9hdGluZyBsYWJlbCB3YXMganVzdCB2aXN1YWwgbm9pc2UgYWJvdmUgdGhlIHJpbmcgYm9yZGVyLlxuICAgIHNsb3QubGFiZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIC8vIFBhZ2Utc2lkZSBub29kbGU6IGEgc2luZ2xlIGN1cnZlIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHBhZ2VcbiAgICAvLyAod2hlcmUgdGhlIHNpZGUgcGFuZWwgc2l0cykgdG8gdGhlIENMT1NFU1QgUE9JTlQgb24gdGhlIHJpbmcgcmVjdC5cbiAgICAvLyBXZSBkb24ndCB0cnkgdG8gYWxpZ24gd2l0aCBhIHBhbmVsLXNpZGUgY29tcGFuaW9uIGN1cnZlIGFueW1vcmUg4oCUXG4gICAgLy8gdGhhdCBuZWVkZWQgaW5uZXJIZWlnaHQgcGFyaXR5IHdoaWNoIGJyb2tlIHVuZGVyIERldlRvb2xzIGRvY2sgL1xuICAgIC8vIGJyb3dzZXIgem9vbS4gVGhpcyBoYWxmIHN0YW5kcyBhbG9uZTogdGhlIHZpc3VhbCBpcyBcImFuIGFycm93IGZyb21cbiAgICAvLyB0aGUgcGFuZWwgc2lkZSwgcG9pbnRpbmcgYXQgdGhlIGNhcHR1cmVkIGVsZW1lbnRcIiBhbmQgd29ya3MgYXRcbiAgICAvLyBhbnkgdmlld3BvcnQuXG4gICAgY29uc3QgcmluZ1BhZCA9IDM7XG4gICAgY29uc3QgcmluZ0wgPSByLmxlZnQgLSByaW5nUGFkO1xuICAgIGNvbnN0IHJpbmdSID0gci5yaWdodCArIHJpbmdQYWQ7XG4gICAgY29uc3QgcmluZ1QgPSByLnRvcCAtIHJpbmdQYWQ7XG4gICAgY29uc3QgcmluZ0IgPSByLmJvdHRvbSArIHJpbmdQYWQ7XG4gICAgY29uc3Qgb3ggPSB3aW5kb3cuaW5uZXJXaWR0aDsgICAgICAgICAgLy8gb3JpZ2luIHggKHBhZ2UgcmlnaHQgZWRnZSlcbiAgICBjb25zdCBveSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7ICAgICAvLyBvcmlnaW4geSAocGFnZSBtaWRZKVxuICAgIC8vIENsb3Nlc3QtcG9pbnQgcHJvamVjdGlvbjogY2xhbXAgb3JpZ2luIG9udG8gdGhlIHJpbmcgcmVjdC5cbiAgICBjb25zdCBleCA9IE1hdGgubWF4KHJpbmdMLCBNYXRoLm1pbihveCwgcmluZ1IpKTtcbiAgICBjb25zdCBleSA9IE1hdGgubWF4KHJpbmdULCBNYXRoLm1pbihveSwgcmluZ0IpKTtcbiAgICBpZiAoTWF0aC5oeXBvdChleCAtIG94LCBleSAtIG95KSA8IDI0KSB7XG4gICAgICAvLyBFbGVtZW50IGlzIGVzc2VudGlhbGx5IGF0IHRoZSBwYW5lbC1zaWRlIGVkZ2Ug4oCUIGRyYXdpbmcgYSAyNHB4XG4gICAgICAvLyBjdXJ2ZSB0aGVyZSBsb29rcyBsaWtlIGEgc211ZGdlLiBTa2lwLlxuICAgICAgc2xvdC5wYXRoLnNldEF0dHJpYnV0ZSgnZCcsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQmV6aWVyOiBmaXJzdCBsb2JlIHB1bGxlZCBsZWZ0IGZyb20gdGhlIG9yaWdpbiwgc2Vjb25kIGxvYmVcbiAgICAgIC8vIHB1bGxlZCBvdXR3YXJkIGZyb20gdGhlIHJpbmcgb24gdGhlIHNpZGUgZmFjaW5nIHRoZSBvcmlnaW4gc29cbiAgICAgIC8vIHRoZSBjdXJ2ZSBhcHByb2FjaGVzIHRoZSBib3VuZGFyeSBwZXJwZW5kaWN1bGFyLWlzaC5cbiAgICAgIGNvbnN0IGMxeCA9IG94IC0gODAsIGMxeSA9IG95O1xuICAgICAgY29uc3QgYXBwcm9hY2hEeCA9IG94ID4gcmluZ1IgPyA2MCA6IG94IDwgcmluZ0wgPyAtNjAgOiAwO1xuICAgICAgY29uc3QgYzJ4ID0gZXggKyBhcHByb2FjaER4LCBjMnkgPSBleTtcbiAgICAgIHNsb3QucGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBgTSAke294fSAke295fSBDICR7YzF4fSAke2MxeX0sICR7YzJ4fSAke2MyeX0sICR7ZXh9ICR7ZXl9YCk7XG4gICAgfVxuICAgIC8vIFN0cm9rZSBtYXRjaGVzIHJpbmcgdGllciBzbyBhIGdsYW5jZSBhdCB0aGUgcGFnZSB0ZWxscyB0aGUgdXNlclxuICAgIC8vIHdoaWNoIGNhcHR1cmUgdGhpcyBjdXJ2ZSBwb2ludHMgdG8uXG4gICAgY29uc3Qgc3Ryb2tlID0gb3B0cy5wcmV2aWV3ID8gJyM3YmQ5N2EnIDogb3B0cy5nb2xkID8gJyNmZmQxNjYnIDogJyNmZjVmMDAnO1xuICAgIHNsb3QucGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHN0cm9rZSk7XG4gIH07XG4gIGNvbnN0IHRyYWNrRWxlbWVudCA9IChrZXk6IHN0cmluZywgZWw6IEVsZW1lbnQsIG9wdHM6IFJpbmdPcHRzID0ge30pOiB2b2lkID0+IHtcbiAgICBjb25zdCBzbG90ID0gZW5zdXJlUmluZyhrZXkpO1xuICAgIHNsb3QudGFyZ2V0ID0gZWw7XG4gICAgaWYgKHNsb3QucmFmKSBjYW5jZWxBbmltYXRpb25GcmFtZShzbG90LnJhZik7XG4gICAgY29uc3QgdGljayA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghZWwuaXNDb25uZWN0ZWQpIHsgcmVtb3ZlUmluZyhrZXkpOyByZXR1cm47IH1cbiAgICAgIHBvc2l0aW9uUmluZyhzbG90LCBlbCwgb3B0cyk7XG4gICAgICBzbG90LnJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuICAgIHRpY2soKTtcbiAgfTtcbiAgY29uc3QgZmxhc2hFbGVtZW50ID0gKGVsOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc2xvdCA9IGVuc3VyZVJpbmcoJ2ZsYXNoJyk7XG4gICAgcG9zaXRpb25SaW5nKHNsb3QsIGVsLCB7fSk7XG4gICAgLy8gV2ViIEFuaW1hdGlvbnMgQVBJIOKAlCBrZXlmcmFtZXMgbmVlZCBubyA8c3R5bGU+LCBubyBDU1AgaXNzdWUuXG4gICAgc2xvdC5lbC5hbmltYXRlKFtcbiAgICAgIHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxLjA0KScsIGJvcmRlckNvbG9yOiAnI2ZmZTA2NicsIGJveFNoYWRvdzogJzAgMCAwIDZweCByZ2JhKDI1NSwyMjQsMTAyLC40KSd9LFxuICAgICAge29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ30sXG4gICAgXSwge2R1cmF0aW9uOiA3MDAsIGVhc2luZzogJ2Vhc2Utb3V0JywgZmlsbDogJ2ZvcndhcmRzJ30pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gcmVtb3ZlUmluZygnZmxhc2gnKSwgNzIwKTtcbiAgfTtcblxuICAvLyBMb2NhdGUtb24tcGFnZSBpcyBhIGRlbGliZXJhdGUgdXNlciByZXF1ZXN0IGZyb20gdGhlIHNpZGUgcGFuZWwgKFwid2hlcmVcbiAgLy8gaXMgdGhpcyB0aGluZz9cIiksIHNvIHRoZSB2aXN1YWwgbXVzdCBiZSBsb3VkIGVub3VnaCB0byBmaW5kIG9uIGFcbiAgLy8gY3Jvd2RlZCBwYWdlLiBUaHJlZSBzZXF1ZW50aWFsIHB1bHNlcyB3aXRoIGFuIGV4cGFuZGluZyBzaGFkb3cgaGFsbyxcbiAgLy8gcGx1cyBhIGNlbnRlci1hbmNob3JlZCBzY2FsZSB0aGF0IHBvcHMgdGhlbiBzZXR0bGVzLiBFYWNoIHB1bHNlIHJ1bnNcbiAgLy8gfjUwMG1zOyB0b3RhbCB+MS41cy4gRGlzdGluY3QgY29sb3IgKGVsZWN0cmljIGN5YW4pIHNvIGl0IGRvZXNuJ3RcbiAgLy8gY29uZnVzZSB3aXRoIHRoZSBvcmFuZ2UgaG92ZXIgcmluZyBvciB0aGUgbGltZSBkcmFnIHByZXZpZXcuXG4gIGNvbnN0IGxvY2F0ZUZsYXNoID0gKGVsOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChyLndpZHRoID09PSAwIHx8IHIuaGVpZ2h0ID09PSAwKSByZXR1cm47XG4gICAgZWwuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICdjZW50ZXInfSk7XG4gICAgY29uc3Qgc2xvdCA9IGVuc3VyZVJpbmcoJ2xvY2F0ZScpO1xuICAgIHBvc2l0aW9uUmluZyhzbG90LCBlbCwge30pO1xuICAgIE9iamVjdC5hc3NpZ24oc2xvdC5lbC5zdHlsZSwge1xuICAgICAgYm9yZGVyQ29sb3I6ICcjNWZkMWZmJyxcbiAgICAgIGJvcmRlcldpZHRoOiAnM3B4JyxcbiAgICAgIGJveFNoYWRvdzogJzAgMCAwIDRweCByZ2JhKDk1LDIwOSwyNTUsLjM1KSwgMCAwIDM2cHggcmdiYSg5NSwyMDksMjU1LC43KScsXG4gICAgICBvcGFjaXR5OiAnMScsXG4gICAgfSk7XG4gICAgLy8gVGhyZWUgcHVsc2UgY3ljbGVzOiBicmlnaHRlciBoYWxvICsgc2xpZ2h0IHNjYWxlIHB1bHNlIG9uIGVhY2ggYmVhdC5cbiAgICBzbG90LmVsLmFuaW1hdGUoW1xuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDApJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgNHB4IHJnYmEoOTUsMjA5LDI1NSwuNDUpLCAwIDAgMjBweCByZ2JhKDk1LDIwOSwyNTUsLjU1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDYpJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgMTJweCByZ2JhKDk1LDIwOSwyNTUsLjE4KSwgMCAwIDYwcHggcmdiYSg5NSwyMDksMjU1LC44NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjAwKScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDRweCByZ2JhKDk1LDIwOSwyNTUsLjQ1KSwgMCAwIDIwcHggcmdiYSg5NSwyMDksMjU1LC41NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjA2KScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDEycHggcmdiYSg5NSwyMDksMjU1LC4xOCksIDAgMCA2MHB4IHJnYmEoOTUsMjA5LDI1NSwuODUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wMCknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCA0cHggcmdiYSg5NSwyMDksMjU1LC40NSksIDAgMCAyMHB4IHJnYmEoOTUsMjA5LDI1NSwuNTUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wNiknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCAxMnB4IHJnYmEoOTUsMjA5LDI1NSwuMTgpLCAwIDAgNjBweCByZ2JhKDk1LDIwOSwyNTUsLjg1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDApJywgb3BhY2l0eTogMH0sXG4gICAgXSwge2R1cmF0aW9uOiAxNjAwLCBlYXNpbmc6ICdlYXNlLWluLW91dCcsIGZpbGw6ICdmb3J3YXJkcyd9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbW92ZVJpbmcoJ2xvY2F0ZScpLCAxNzAwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU3BhY2luZyB2aXN1YWxpemVyIChQbGFzbWljLWluc3BpcmVkKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gNCBtYXJnaW4gc3RyaXBzIChsaWdodCBvcmFuZ2UsIG91dHNpZGUgdGhlIGVsZW1lbnQpICsgNCBwYWRkaW5nIHN0cmlwc1xuICAvLyAobGlnaHQgYmx1ZSwgaW5zaWRlIHRoZSBlbGVtZW50KS4gU2lkZS1wYW5lbCBwdXNoZXMgYSBgc2V0LWNzLXByZWZzYFxuICAvLyBtZXNzYWdlIHRvIHRvZ2dsZS4gV2hlbiBPTiwgZmlyZUhvdmVyIHBhaW50cyB0aGVzZSBzdHJpcGVzIGFyb3VuZCB0aGVcbiAgLy8gY3VycmVudGx5LWhvdmVyZWQgZWxlbWVudCBlYWNoIGZyYW1lLlxuICBsZXQgc3BhY2luZ092ZXJsYXkgPSBmYWxzZTtcbiAgY29uc3Qgc3BhY2luZ0RpdnM6IEhUTUxEaXZFbGVtZW50W10gPSBbXTtcbiAgY29uc3QgZW5zdXJlU3BhY2luZ0RpdnMgPSAoKTogSFRNTERpdkVsZW1lbnRbXSA9PiB7XG4gICAgaWYgKHNwYWNpbmdEaXZzLmxlbmd0aCkgcmV0dXJuIHNwYWNpbmdEaXZzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBPYmplY3QuYXNzaWduKGQuc3R5bGUsIHtcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIGRpc3BsYXk6ICdub25lJyxcbiAgICAgICAgYmFja2dyb3VuZDogaSA8IDQgPyAncmdiYSgyNTUsMTU5LDY0LC4yOCknIDogJ3JnYmEoMTA4LDE3OCwyMzUsLjI4KScsXG4gICAgICB9KTtcbiAgICAgIHNoYWRvdy5hcHBlbmQoZCk7XG4gICAgICBzcGFjaW5nRGl2cy5wdXNoKGQpO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2luZ0RpdnM7XG4gIH07XG4gIGNvbnN0IGNsZWFyU3BhY2luZ092ZXJsYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBkIG9mIHNwYWNpbmdEaXZzKSBkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH07XG4gIGNvbnN0IHBhaW50U3BhY2luZ092ZXJsYXkgPSAoZWw6IEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNwYWNpbmdPdmVybGF5KSB7IGNsZWFyU3BhY2luZ092ZXJsYXkoKTsgcmV0dXJuOyB9XG4gICAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG10ID0gcGFyc2VGbG9hdChjcy5tYXJnaW5Ub3ApIHx8IDA7XG4gICAgY29uc3QgbXIgPSBwYXJzZUZsb2F0KGNzLm1hcmdpblJpZ2h0KSB8fCAwO1xuICAgIGNvbnN0IG1iID0gcGFyc2VGbG9hdChjcy5tYXJnaW5Cb3R0b20pIHx8IDA7XG4gICAgY29uc3QgbWwgPSBwYXJzZUZsb2F0KGNzLm1hcmdpbkxlZnQpIHx8IDA7XG4gICAgY29uc3QgcHQgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdUb3ApIHx8IDA7XG4gICAgY29uc3QgcHIgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdSaWdodCkgfHwgMDtcbiAgICBjb25zdCBwYiA9IHBhcnNlRmxvYXQoY3MucGFkZGluZ0JvdHRvbSkgfHwgMDtcbiAgICBjb25zdCBwbCA9IHBhcnNlRmxvYXQoY3MucGFkZGluZ0xlZnQpIHx8IDA7XG4gICAgY29uc3QgW20xLCBtMiwgbTMsIG00LCBwMSwgcDIsIHAzLCBwNF0gPSBlbnN1cmVTcGFjaW5nRGl2cygpO1xuICAgIC8vIE1hcmdpbiBzdHJpcHMgKGFyb3VuZCB0aGUgZWxlbWVudClcbiAgICBjb25zdCBzZXQgPSAoZDogSFRNTERpdkVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgaWYgKHcgPD0gMCB8fCBoIDw9IDApIHsgZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyByZXR1cm47IH1cbiAgICAgIGQuc3R5bGUubGVmdCA9IHggKyAncHgnO1xuICAgICAgZC5zdHlsZS50b3AgPSB5ICsgJ3B4JztcbiAgICAgIGQuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgICAgIGQuc3R5bGUuaGVpZ2h0ID0gaCArICdweCc7XG4gICAgICBkLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH07XG4gICAgc2V0KG0xISwgci5sZWZ0IC0gbWwsIHIudG9wIC0gbXQsIHIud2lkdGggKyBtbCArIG1yLCBtdCk7ICAgICAgICAgICAgLy8gdG9wXG4gICAgc2V0KG0yISwgci5yaWdodCwgci50b3AsIG1yLCByLmhlaWdodCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHRcbiAgICBzZXQobTMhLCByLmxlZnQgLSBtbCwgci5ib3R0b20sIHIud2lkdGggKyBtbCArIG1yLCBtYik7ICAgICAgICAgICAgICAvLyBib3R0b21cbiAgICBzZXQobTQhLCByLmxlZnQgLSBtbCwgci50b3AsIG1sLCByLmhlaWdodCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0XG4gICAgLy8gUGFkZGluZyBzdHJpcHMgKGluc2lkZSB0aGUgZWxlbWVudClcbiAgICBzZXQocDEhLCByLmxlZnQsIHIudG9wLCByLndpZHRoLCBwdCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b3BcbiAgICBzZXQocDIhLCByLnJpZ2h0IC0gcHIsIHIudG9wICsgcHQsIHByLCByLmhlaWdodCAtIHB0IC0gcGIpOyAgICAgICAgICAvLyByaWdodFxuICAgIHNldChwMyEsIHIubGVmdCwgci5ib3R0b20gLSBwYiwgci53aWR0aCwgcGIpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJvdHRvbVxuICAgIHNldChwNCEsIHIubGVmdCwgci50b3AgKyBwdCwgcGwsIHIuaGVpZ2h0IC0gcHQgLSBwYik7ICAgICAgICAgICAgICAgIC8vIGxlZnRcbiAgfTtcblxuICAvLyDilIDilIDilIAgT24tcGFnZSBhbm5vdGF0aW9uIHRvb2x0aXAg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFubm90YXRpb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBhbm5vdGF0aW9uRWwuY2xhc3NOYW1lID0gJ2Fubm90YXRpb24nO1xuICBPYmplY3QuYXNzaWduKGFubm90YXRpb25FbC5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgYmFja2dyb3VuZDogJ3JnYmEoMTUsMTUsMjAsLjk2KScsXG4gICAgY29sb3I6ICcjZmNmYWY1JyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsOTUsMCwuNSknLFxuICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgIHBhZGRpbmc6ICc4cHggMTBweCcsXG4gICAgZm9udDogXCIxMnB4LzEuNDUgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgbWF4V2lkdGg6ICdtaW4oMzYwcHgsIDcwdncpJyxcbiAgICBib3hTaGFkb3c6ICcwIDhweCAzMnB4IHJnYmEoMCwwLDAsLjU1KScsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgZGlzcGxheTogJ25vbmUnLFxuICAgIC8vIEFubm90YXRpb24gYWx3YXlzIHBhaW50cyBvbiB0b3Agb2YgcmluZ3MvcnViYmVyLWJhbmQvcHJldmlldyByaW5nc1xuICAgIC8vIChyaW5ncyBhcmUgekluZGV4OjE7IHRoaXMgbGlmdHMgdGhlIGNvbW1lbnQgYm94IGNsZWFyKS5cbiAgICB6SW5kZXg6ICcyMTQ3NDgzNjQ3JyxcbiAgfSk7XG4gIHNoYWRvdy5hcHBlbmQoYW5ub3RhdGlvbkVsKTtcbiAgY29uc3QgYW5ub3RhdGlvbiA9IHNldHVwQW5ub3RhdGlvbihhbm5vdGF0aW9uRWwsIHtcbiAgICBzZW5kVG9QYW5lbCxcbiAgICAvLyBGb3IgYW4gdW5jYXB0dXJlZCBlbGVtZW50LCB0aGUgdXNlciB0eXBpbmcgaW50byB0aGUgYm94IGFuZCBwcmVzc2luZ1xuICAgIC8vIEVudGVyIGJvdGggY2FwdHVyZXMgYW5kIGF0dGFjaGVzIHRoZSBjb21tZW50LlxuICAgIGNhcHR1cmVBbmRDb21tZW50OiAoZWwsIHRleHQpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBuZXh0U2VxKCkpO1xuICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgIGNvbnN0IHBhZ2UgPSBidWlsZFBhZ2VDb250ZXh0KCk7XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZX0pO1xuICAgICAgdGVzdENhcHR1cmVzPy5wdXNoKHtlbnRyeSwgcGFnZX0pO1xuICAgICAgLy8gcGFyZW50VWlkICsgdXJsIGRpc2FtYmlndWF0ZSB3aGljaCBjYXB0dXJlIHRoZSBjb21tZW50XG4gICAgICAvLyBiZWxvbmdzIHRvIHdoZW4gdGhlIHNhbWUgc2VsZWN0b3IgZXhpc3RzIG9uIG11bHRpcGxlIHBhZ2VzXG4gICAgICAvLyBvciBmb3IgbXVsdGlwbGUgc2libGluZyBlbGVtZW50cyB3aXRoIHRoZSBzYW1lIHRlc3RJZC5cbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnZmVlZGJhY2stYWRkJywgc2VsZWN0b3I6IGVudHJ5LnNlbGVjdG9yLCB0ZXh0LCB1cmw6IHBhZ2UudXJsLCBwYXJlbnRVaWQ6IGVudHJ5LnVpZH0pO1xuICAgICAgcmV0dXJuIGVudHJ5O1xuICAgIH0sXG4gICAgLy8gQm94IGhpZGVzIOKGkiB0ZWFyIGRvd24gdGhlIG1hdGNoaW5nIGhvdmVyIHJpbmcgc28gdGhlIHR3byBnbyB0b2dldGhlci5cbiAgICBvbkhpZGU6ICgpID0+IHJlbW92ZVJpbmcoJ2hvdmVyJyksXG4gICAgLy8gQm94IGFwcGVhcnMgZm9yIGFuIGVsZW1lbnQg4oaSIGVuc3VyZSB0aGUgcmluZyBpcyBvbiB0aGUgc2FtZSBlbGVtZW50LlxuICAgIG9uU2hvdzogKGVsKSA9PiB0cmFja0VsZW1lbnQoJ2hvdmVyJywgZWwsIHtsYWJlbDogY29tcGFjdFRhcmdldChlbCl9KSxcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEFsdC1ob3ZlciBzdGF0ZSBtYWNoaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgYWx0QWN0aXZlID0gZmFsc2U7XG4gIGxldCBhbHRGb3J3YXJkZWQgPSBmYWxzZTtcbiAgbGV0IGxhc3RIb3ZlckVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBsYXN0TW91c2UgPSB7eDogLTEsIHk6IC0xfTtcbiAgbGV0IGtub3duQ2FwdHVyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLy8gSG92ZXIvY2xpY2sgc25hcDogd2hlbiBPTiwgZXZlcnkgYWx0LWhvdmVyIGFuZCBjYXB0dXJlIHdhbGtzIHVwIHRvIHRoZVxuICAvLyBuZWFyZXN0IGNvbXBvbmVudC1tYXJrZXIgYW5jZXN0b3IgKGRhdGEtdGVzdGlkL3JvbGUvaWQvYnV0dG9uL2EvaW5wdXQpXG4gIC8vIHNvIHNpbmdsZS1jbGljayBhbmQgcnViYmVyLWJhbmQgc2VsZWN0aW9uIHBpY2sgY29uc2lzdGVudCBsYXllcnNcbiAgLy8gcmVnYXJkbGVzcyBvZiBwaXhlbC1sZXZlbCBjdXJzb3IgcGxhY2VtZW50LiBQdXNoZWQgYnkgdGhlIHNpZGUgcGFuZWxcbiAgLy8gdmlhIGBzZXQtY3MtcHJlZnNgLlxuICBsZXQgaG92ZXJTbmFwID0gdHJ1ZTtcblxuICBjb25zdCBmaXJlSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgcmVtb3ZlUmluZygnaG92ZXInKTtcbiAgICBjbGVhclNwYWNpbmdPdmVybGF5KCk7XG4gICAgbGFzdEhvdmVyRWwgPSBudWxsO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnaG92ZXItZW5kJ30pO1xuICB9O1xuXG4gIGNvbnN0IHNldEFsdEFjdGl2ZSA9IChvbjogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChhbHRBY3RpdmUgPT09IG9uKSByZXR1cm47XG4gICAgYWx0QWN0aXZlID0gb247XG4gICAgaWYgKCFvbikge1xuICAgICAgLy8gSWYgdGhlIGNvbW1lbnQgYm94IGlzIHZpc2libGUsIHJpbmcgYW5kIGJveCBhcmUgYSB1bml0OiBrZWVwIEJPVEhcbiAgICAgIC8vIG9uIHNjcmVlbiBhbmQgaGFuZCBmb2N1cyB0byB0aGUgdGV4dGFyZWEgc28gdGhlIHVzZXIgY2FuIHR5cGVcbiAgICAgIC8vIGltbWVkaWF0ZWx5LiBJZiB0aGVyZSdzIG5vIGJveCwgbm8gZm9jdXMgdG8gZ2l2ZSDigJQgdGVhciBkb3duIHRoZVxuICAgICAgLy8gcmluZyBhcyBiZWZvcmUuXG4gICAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIHtcbiAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdob3Zlci1lbmQnfSk7IC8vIHBhbmVsLXNpZGUgc3RhdHVzIHJlc2V0XG4gICAgICAgIGFubm90YXRpb24uZm9jdXNUZXh0YXJlYSgpO1xuICAgICAgICAvLyAocmluZyByZW1haW5zOyByQUYga2VlcHMgaXQgdHJhY2tpbmcgdGhlIGN1cnJlbnQgZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpcmVIb3ZlckVuZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobGFzdE1vdXNlLnggPj0gMCkge1xuICAgICAgY29uc3QgdGd0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChsYXN0TW91c2UueCwgbGFzdE1vdXNlLnkpO1xuICAgICAgaWYgKHRndCBpbnN0YW5jZW9mIEVsZW1lbnQpIHsgbGFzdEhvdmVyRWwgPSB0Z3Q7IGZpcmVIb3Zlcih0Z3QpOyB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFRydWUgd2hlbiBhbiBlbGVtZW50IGlzIHRvbyBsYXJnZSB0byBiZSBhIG1lYW5pbmdmdWwgY2FwdHVyZSB0YXJnZXQg4oCUXG4gIC8vIGJvZHkgLyBodG1sIC8gd3JhcHBlcnMgY292ZXJpbmcgbW9zdCBvZiB0aGUgdmlld3BvcnQuIFVzZWQgdG8gcmVqZWN0XG4gIC8vIGFsdC1jbGljayBhbmQgcGVuZGluZy1zdGFnZSBjYXB0dXJlcyBzbyB0aGUgdXNlciBkb2Vzbid0IGFjY2lkZW50YWxseVxuICAvLyBncmFiIHRoZSB3aG9sZSBwYWdlIHdoZW4gdGhleSBjbGljayBvbiBkZWFkIHNwYWNlLlxuICBjb25zdCBpc0h1Z2VFbGVtZW50ID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gci53aWR0aCA+PSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuOSAmJiByLmhlaWdodCA+PSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjk7XG4gIH07XG5cbiAgY29uc3QgcmVzb2x2ZUhvdmVyVGFyZ2V0ID0gKHRndDogRWxlbWVudCk6IHtlbDogRWxlbWVudDsgc2VsZWN0b3I6IHN0cmluZ30gPT4ge1xuICAgIGNvbnN0IGVsID0gaG92ZXJTbmFwID8gc25hcFRvQ29tcG9uZW50KHRndCwga25vd25DYXB0dXJlZCkgOiB0Z3Q7XG4gICAgLy8gUmV1c2UgYSBrbm93bi1jYXB0dXJlZCBzZWxlY3RvciB2ZXJiYXRpbSBpZiB0aGUgc25hcHBlZCBlbGVtZW50XG4gICAgLy8gbWF0Y2hlcyBvbmUg4oCUIGtlZXBzIHRoZSBjYXB0dXJlZC1zaWRlIGlkZW50aXR5IHN0YWJsZS5cbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBrbm93bkNhcHR1cmVkKSB7XG4gICAgICB0cnkgeyBpZiAoZWwubWF0Y2hlcyhzZWwpKSByZXR1cm4ge2VsLCBzZWxlY3Rvcjogc2VsfTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiB7ZWwsIHNlbGVjdG9yOiBjc3NQYXRoKGVsKX07XG4gIH07XG5cbiAgY29uc3QgZmlyZUhvdmVyID0gKHRndDogRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHtlbCwgc2VsZWN0b3J9ID0gcmVzb2x2ZUhvdmVyVGFyZ2V0KHRndCk7XG4gICAgLy8gUmVqZWN0IGJvZHkgLyBodG1sIC8gYW55IHBhZ2Utc3Bhbm5pbmcgd3JhcHBlciBhdCB0aGUgaG92ZXIgc3RhZ2UgdG9vLlxuICAgIC8vIFRoZSBlYXJsaWVyIGZpbHRlciBvbmx5IHJhbiBvbiBjbGljayArIHN0YWdlUGVuZGluZywgc28gYWx0LWhvdmVyaW5nXG4gICAgLy8gZW1wdHkgcGFnZSBhcmVhIHN0aWxsIHBhaW50ZWQgYSByaW5nIGFyb3VuZCB0aGUgZW50aXJlIHBhZ2UuXG4gICAgaWYgKGlzSHVnZUVsZW1lbnQoZWwpKSB7XG4gICAgICByZW1vdmVSaW5nKCdob3ZlcicpO1xuICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdob3Zlci1lbmQnfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyYWNrRWxlbWVudCgnaG92ZXInLCBlbCwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKX0pO1xuICAgIHBhaW50U3BhY2luZ092ZXJsYXkoZWwpO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBzZW5kVG9QYW5lbCh7XG4gICAgICBraW5kOiAnaG92ZXInLFxuICAgICAgc2VsZWN0b3IsXG4gICAgICB0YWc6IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIGxhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKSxcbiAgICAgIHJlY3Q6IHt4OiBNYXRoLnJvdW5kKHIueCksIHk6IE1hdGgucm91bmQoci55KSwgdzogTWF0aC5yb3VuZChyLndpZHRoKSwgaDogTWF0aC5yb3VuZChyLmhlaWdodCl9LFxuICAgIH0pO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBEcmFnIHN0YXRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgc2VxdWVuY2VDb3VudGVyID0gMDtcbiAgY29uc3QgbmV4dFNlcSA9ICgpOiBudW1iZXIgPT4gKytzZXF1ZW5jZUNvdW50ZXI7XG4gIGxldCBsYXN0Q29udGV4dEVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdXBwcmVzc05leHRDbGljayA9IGZhbHNlO1xuICBsZXQgZHJhZ1N0YXJ0OiB7eDogbnVtYmVyOyB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG4gIGxldCBkcmFnUmVjdDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGRyYWdTYXZlZFVzZXJTZWxlY3QgPSAnJztcbiAgLy8gU3RhYmxlIGNhbmRpZGF0ZSBwb29sIGxvY2tlZCBhdCBkcmFnIHN0YXJ0IOKAlCBldmVyeSBlbGVtZW50c0luUmVjdCBjYWxsXG4gIC8vIGZvciB0aGlzIGRyYWcgdXNlcyB0aGUgc2FtZSBwb29sLCBzbyB0aGUgcnViYmVyLWJhbmQgc2VsZWN0aW9uIGdyb3dzIC9cbiAgLy8gc2hyaW5rcyBtb25vdG9uaWNhbGx5IHdpdGggcmVjdCBzaXplIChubyB0aWVyLXNoaWZ0IGNodXJuKS5cbiAgbGV0IGRyYWdDYW5kaWRhdGVzOiByZWFkb25seSBFbGVtZW50W10gPSBbXTtcblxuICBjb25zdCBjbGVhclByZXZpZXdSaW5ncyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLnJpbmdzLmtleXMoKV0pIGlmIChrLnN0YXJ0c1dpdGgoJ3ByZXZpZXc6JykpIHJlbW92ZVJpbmcoayk7XG4gIH07XG4gIGNvbnN0IGVuc3VyZURyYWdSZWN0ID0gKCk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBpZiAoZHJhZ1JlY3QpIHJldHVybiBkcmFnUmVjdDtcbiAgICBkcmFnUmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRyYWdSZWN0LmNsYXNzTmFtZSA9ICdydWJiZXInO1xuICAgIE9iamVjdC5hc3NpZ24oZHJhZ1JlY3Quc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAvLyBCb3JkZXIgc3R5bGUgaXMgc2V0IGJ5IHVwZGF0ZURyYWdSZWN0IGVhY2ggZnJhbWU6IHNvbGlkIGZvciBcImZ1bGxcbiAgICAgIC8vIGVuY2xvc3VyZVwiIChsZWZ04oaScmlnaHQpLCBkYXNoZWQgZm9yIFwicGFydGlhbCBvdmVybGFwXCIgKHJpZ2h04oaSbGVmdCkuXG4gICAgICBib3JkZXI6ICcycHggc29saWQgI2ZmNWYwMCcsXG4gICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsOTUsMCwuMTQpJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICBib3hTaGFkb3c6ICcwIDAgMCAxcHggcmdiYSgyNTUsOTUsMCwuMzUpLCAwIDAgMThweCByZ2JhKDI1NSw5NSwwLC4yNSknLFxuICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgfSk7XG4gICAgc2hhZG93LmFwcGVuZChkcmFnUmVjdCk7XG4gICAgZHJhZ1NhdmVkVXNlclNlbGVjdCA9IGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdDtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2Nyb3NzaGFpcic7XG4gICAgLy8gRHJhZyBtb2RlOiBoaWRlIHRoZSBjb21tZW50IGJveCBzbyBpdCBkb2Vzbid0IG9ic2N1cmUgdGhlIHJ1YmJlciBiYW5kLlxuICAgIGFubm90YXRpb24uaGlkZSgpO1xuICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgLy8gTG9jayB0aGUgY2FuZGlkYXRlIHBvb2wgT05DRSBwZXIgZHJhZyAocmlnb3JvdXMtM2QtYXBwIGJlaGF2aW9yKS5cbiAgICBkcmFnQ2FuZGlkYXRlcyA9IHBpY2tEcmFnQ2FuZGlkYXRlcyhvdmVybGF5SG9zdCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAnZHJhZyBjYW5kaWRhdGUgcG9vbCBsb2NrZWQ6JywgZHJhZ0NhbmRpZGF0ZXMubGVuZ3RoLCAnZWxlbWVudHMnKTtcbiAgICByZXR1cm4gZHJhZ1JlY3Q7XG4gIH07XG4gIGNvbnN0IHRlYXJkb3duRHJhZ1JlY3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGRyYWdSZWN0KSB7IGRyYWdSZWN0LnJlbW92ZSgpOyBkcmFnUmVjdCA9IG51bGw7IH1cbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBkcmFnU2F2ZWRVc2VyU2VsZWN0O1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICcnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgY2xlYXJQcmV2aWV3UmluZ3MoKTtcbiAgICBkcmFnQ2FuZGlkYXRlcyA9IFtdO1xuICB9O1xuICBsZXQgbGFzdFByZXZpZXdLZXlzID0gbmV3IFNldDxFbGVtZW50PigpO1xuICAvLyBTZWxlY3Rpb24gbW9kZSBpcyBkZWNpZGVkIGJ5IGRyYWcgZGlyZWN0aW9uICgzRC1hcHAgY29udmVudGlvbik6XG4gIC8vICAgbGVmdOKGknJpZ2h0ICA6ICdmdWxsJyAgICDigJQgZWxlbWVudCBtdXN0IGJlIGVudGlyZWx5IGluc2lkZSB0aGUgcmVjdDtcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWJiZXItYmFuZCBoYXMgYSBTT0xJRCBib3JkZXIuXG4gIC8vICAgcmlnaHTihpJsZWZ0ICA6ICdwYXJ0aWFsJyDigJQgYW55IG92ZXJsYXAgc2VsZWN0cztcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWJiZXItYmFuZCBoYXMgYSBET1RURUQgYm9yZGVyLlxuICBjb25zdCBkcmFnTW9kZSA9IChlOiBNb3VzZUV2ZW50KTogJ3BhcnRpYWwnIHwgJ2Z1bGwnID0+XG4gICAgZHJhZ1N0YXJ0ICYmIGUuY2xpZW50WCA+PSBkcmFnU3RhcnQueCA/ICdmdWxsJyA6ICdwYXJ0aWFsJztcblxuICBjb25zdCB1cGRhdGVEcmFnUmVjdCA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFkcmFnU3RhcnQpIHJldHVybjtcbiAgICBjb25zdCBkeCA9IE1hdGguYWJzKGUuY2xpZW50WCAtIGRyYWdTdGFydC54KTtcbiAgICBjb25zdCBkeSA9IE1hdGguYWJzKGUuY2xpZW50WSAtIGRyYWdTdGFydC55KTtcbiAgICBpZiAoIWRyYWdSZWN0ICYmIGR4IDwgMiAmJiBkeSA8IDIpIHJldHVybjtcbiAgICBjb25zdCB4MSA9IE1hdGgubWluKGRyYWdTdGFydC54LCBlLmNsaWVudFgpO1xuICAgIGNvbnN0IHkxID0gTWF0aC5taW4oZHJhZ1N0YXJ0LnksIGUuY2xpZW50WSk7XG4gICAgY29uc3QgeDIgPSBNYXRoLm1heChkcmFnU3RhcnQueCwgZS5jbGllbnRYKTtcbiAgICBjb25zdCB5MiA9IE1hdGgubWF4KGRyYWdTdGFydC55LCBlLmNsaWVudFkpO1xuICAgIGNvbnN0IHIgPSBlbnN1cmVEcmFnUmVjdCgpO1xuICAgIGNvbnN0IG1vZGUgPSBkcmFnTW9kZShlKTtcbiAgICBPYmplY3QuYXNzaWduKHIuc3R5bGUsIHtcbiAgICAgIGxlZnQ6IHgxICsgJ3B4JyxcbiAgICAgIHRvcDogeTEgKyAncHgnLFxuICAgICAgd2lkdGg6ICh4MiAtIHgxKSArICdweCcsXG4gICAgICBoZWlnaHQ6ICh5MiAtIHkxKSArICdweCcsXG4gICAgICBib3JkZXJTdHlsZTogbW9kZSA9PT0gJ2Z1bGwnID8gJ3NvbGlkJyA6ICdkYXNoZWQnLFxuICAgIH0pO1xuICAgIC8vIExpdmUgcHJldmlldzogcGFpbnQgYSB2aXZpZCByaW5nIG9uIGV2ZXJ5IGNhbmRpZGF0ZSB0aGUgcnViYmVyIGJhbmRcbiAgICAvLyB3b3VsZCBjb21taXQgaWYgdGhlIHVzZXIgcmVsZWFzZWQgcmlnaHQgbm93LiBEaWZmIGFnYWluc3QgdGhlIGxhc3RcbiAgICAvLyBmcmFtZSBzbyB3ZSBkb24ndCBjaHVybiByaW5ncyB3aGVuIHRoZSBzZXQgaXMgdW5jaGFuZ2VkLiBUaGVcbiAgICAvLyBjYW5kaWRhdGUgcG9vbCB3YXMgbG9ja2VkIGF0IGRyYWctc3RhcnQgc28gdGhlIHNldCBpcyBtb25vdG9uaWMgd2l0aFxuICAgIC8vIHJlY3Qgc2l6ZSDigJQgbm8gcmFuZG9tIHNlbGVjdC9kZXNlbGVjdCBtaWQtZHJhZy5cbiAgICBjb25zdCBlbHMgPSBlbGVtZW50c0luUmVjdChkcmFnQ2FuZGlkYXRlcywgeDEsIHkxLCB4MiwgeTIsIG1vZGUpO1xuICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KGVscyk7XG4gICAgbGV0IHNhbWUgPSBuZXh0LnNpemUgPT09IGxhc3RQcmV2aWV3S2V5cy5zaXplO1xuICAgIGlmIChzYW1lKSBmb3IgKGNvbnN0IGVsIG9mIG5leHQpIHsgaWYgKCFsYXN0UHJldmlld0tleXMuaGFzKGVsKSkgeyBzYW1lID0gZmFsc2U7IGJyZWFrOyB9IH1cbiAgICBpZiAoIXNhbWUpIHtcbiAgICAgIGNsZWFyUHJldmlld1JpbmdzKCk7XG4gICAgICBlbHMuZm9yRWFjaCgoZWwsIGkpID0+IHRyYWNrRWxlbWVudChgcHJldmlldzoke2l9YCwgZWwsIHtwcmV2aWV3OiB0cnVlfSkpO1xuICAgICAgbGFzdFByZXZpZXdLZXlzID0gbmV4dDtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgYGRyYWcgcHJldmlldyAoJHttb2RlfSk6YCwgZWxzLmxlbmd0aCwgJ3RhcmdldHMnLCBlbHMubWFwKGNvbXBhY3RUYXJnZXQpKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlbmRpbmctbXVsdGkgc3RhZ2luZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBlbmRpbmdNdWx0aTogQXJyYXk8e2VsOiBFbGVtZW50OyBlbnRyeTogRW50cnl9PiA9IFtdO1xuICBjb25zdCBzdGFnZVBlbmRpbmcgPSAocmF3OiBFbGVtZW50LCBjbGlja0F0Pzoge2NsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyfSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gaG92ZXJTbmFwID8gc25hcFRvQ29tcG9uZW50KHJhdywga25vd25DYXB0dXJlZCkgOiByYXc7XG4gICAgaWYgKGlzSHVnZUVsZW1lbnQoZWwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdza2lwcGluZyBodWdlIGVsZW1lbnQgZnJvbSBzdGFnaW5nOicsIGNvbXBhY3RUYXJnZXQoZWwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkoZWwsIG5leHRTZXEoKSwge1xuICAgICAgLi4uKGNsaWNrQXQgPyB7Y2xpY2tBdH0gOiB7fSksXG4gICAgfSk7XG4gICAgaWYgKHBlbmRpbmdNdWx0aS5zb21lKChwKSA9PiBwLmVsID09PSBlbCB8fCBwLmVudHJ5LnNlbGVjdG9yID09PSBlbnRyeS5zZWxlY3RvcikpIHtcbiAgICAgIGZsYXNoRWxlbWVudChlbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlkeCA9IHBlbmRpbmdNdWx0aS5sZW5ndGg7XG4gICAgcGVuZGluZ011bHRpLnB1c2goe2VsLCBlbnRyeX0pO1xuICAgIHRyYWNrRWxlbWVudChgcGVuZGluZzoke2lkeH1gLCBlbCwge2dvbGQ6IHRydWUsIGxhYmVsOiBgIyR7aWR4ICsgMX0gJHtjb21wYWN0VGFyZ2V0KGVsKX1gfSk7XG4gICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3BlbmRpbmctYWRkJywgZW50cnl9KTtcbiAgfTtcbiAgY29uc3QgY29tbWl0UGVuZGluZ011bHRpID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ2NvbW1pdFBlbmRpbmdNdWx0aSDigJQgY29tbWl0dGluZycsIHBlbmRpbmdNdWx0aS5sZW5ndGgsICdzdGFnZWQgZWxlbWVudHMnKTtcbiAgICBjb25zb2xlLnRyYWNlKExPRywgJ2NvbW1pdCBzdGFjayB0cmFjZScpO1xuICAgIHBlbmRpbmdNdWx0aS5mb3JFYWNoKCh7ZWwsIGVudHJ5fSwgaSkgPT4ge1xuICAgICAgY29uc3QgcGFnZSA9IGJ1aWxkUGFnZUNvbnRleHQoKTtcbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnY2FwdHVyZScsIGVudHJ5LCBwYWdlLCBncm91cGVkOiBpID4gMH0pO1xuICAgICAgdGVzdENhcHR1cmVzPy5wdXNoKHtlbnRyeSwgcGFnZSwgZ3JvdXBlZDogaSA+IDB9KTtcbiAgICAgIHJlbW92ZVJpbmcoYHBlbmRpbmc6JHtpfWApO1xuICAgICAgaWYgKGVsLmlzQ29ubmVjdGVkKSBmbGFzaEVsZW1lbnQoZWwpO1xuICAgIH0pO1xuICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncGVuZGluZy1jbGVhcid9KTtcbiAgfTtcbiAgY29uc3QgY2FuY2VsUGVuZGluZ011bHRpID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSBjb25zb2xlLmxvZyhMT0csICdjYW5jZWxQZW5kaW5nTXVsdGkg4oCUIGRpc2NhcmRpbmcnLCBwZW5kaW5nTXVsdGkubGVuZ3RoLCAnc3RhZ2VkJyk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKF8sIGkpID0+IHJlbW92ZVJpbmcoYHBlbmRpbmc6JHtpfWApKTtcbiAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3BlbmRpbmctY2xlYXInfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE1vdXNlIGxpc3RlbmVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGxhc3RNb3ZlVHMgPSAwO1xuICBjb25zdCBvbk1vdXNlTW92ZSA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKGUudGltZVN0YW1wID09PSBsYXN0TW92ZVRzKSByZXR1cm47XG4gICAgbGFzdE1vdmVUcyA9IGUudGltZVN0YW1wO1xuICAgIGxhc3RNb3VzZSA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG4gICAgaWYgKGRyYWdTdGFydCkge1xuICAgICAgLy8gSW4gYSBydWJiZXItYmFuZCBkcmFnIHRoZSBvbmx5IGhpZ2hsaWdodCB0aGF0IHNob3VsZCBhcHBlYXIgaXMgdGhlXG4gICAgICAvLyBsaW1lIFBSRVZJRVcgcmluZyBvbiBjYW5kaWRhdGVzIGluc2lkZSB0aGUgcmVjdC4gVGhlIG9yYW5nZSBob3ZlclxuICAgICAgLy8gcmluZyB3b3VsZCBvdGhlcndpc2UgcmVwYWludCBvbiB3aGF0ZXZlciBlbGVtZW50IHRoZSBjdXJzb3IgaXNcbiAgICAgIC8vIG92ZXIsIG1peGluZyB0d28gY29sb3JzIGFuZCBjb25mdXNpbmcgdGhlIHVzZXIuXG4gICAgICB1cGRhdGVEcmFnUmVjdChlKTtcbiAgICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2hvdmVyLWVuZCd9KTtcbiAgICAgIGxhc3RIb3ZlckVsID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgYWx0T24gPSBlLmFsdEtleSB8fCBhbHRGb3J3YXJkZWQ7XG4gICAgaWYgKCFhbHRPbikgeyBpZiAoYWx0QWN0aXZlKSBzZXRBbHRBY3RpdmUoZmFsc2UpOyByZXR1cm47IH1cbiAgICBpZiAoIWFsdEFjdGl2ZSkgc2V0QWx0QWN0aXZlKHRydWUpO1xuICAgIGNvbnN0IHRndCA9IGUudGFyZ2V0O1xuICAgIGlmICghKHRndCBpbnN0YW5jZW9mIEVsZW1lbnQpIHx8IHRndCA9PT0gbGFzdEhvdmVyRWwpIHJldHVybjtcbiAgICBsYXN0SG92ZXJFbCA9IHRndDtcbiAgICBmaXJlSG92ZXIodGd0KTtcbiAgfTtcblxuICBjb25zdCBpc0luc2lkZUFubm90YXRpb24gPSAoZTogRXZlbnQpOiBib29sZWFuID0+IHtcbiAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgIT09ICdibG9jaycpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwYXRoID0gdHlwZW9mIGUuY29tcG9zZWRQYXRoID09PSAnZnVuY3Rpb24nID8gZS5jb21wb3NlZFBhdGgoKSA6IFtdO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBwYXRoKSBpZiAobm9kZSA9PT0gYW5ub3RhdGlvbkVsKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRi4xOCDigJQgbmV2ZXIgY2FwdHVyZSBhbiBlbGVtZW50IHRoYXQncyBwYXJ0IG9mIHBpbmNoZ3JhYidzIG93biBVSS5cbiAgLy8gVGhlIHNoYWRvdyBob3N0IGlzIGAjX19waW5jaGdyYWJfb3ZlcmxheWA7IGV2ZXJ5dGhpbmcgcGFpbnRlZCBpbnNpZGVcbiAgLy8gKHJpbmdzLCBydWJiZXIgYmFuZCwgbm9vZGxlIFNWRywgYW5ub3RhdGlvbiB0ZXh0YXJlYSkgbGl2ZXMgaW4gaXRzXG4gIC8vIHNoYWRvdyByb290LiBPcGVuLW1vZGUgc2hhZG93ICsgY29tcG9zZWRQYXRoKCkgbGV0cyB1cyBzZWUgdGhlIHJlYWxcbiAgLy8gdGFyZ2V0IGV2ZW4gd2hlbiBldmVudCByZXRhcmdldGluZyBpcyBpbiBwbGF5LCBzbyB3ZSB3YWxrIHRoZVxuICAvLyBjb21wb3NlZCBwYXRoIGxvb2tpbmcgZm9yIHRoZSBob3N0LiBUaGUgY2hlYXAgaWQgY2hlY2sgc3RpbGwgcnVuc1xuICAvLyBmaXJzdCBhcyBhIGZhc3QgcGF0aC5cbiAgY29uc3QgaXNQaW5jaGdyYWJPd25VaSA9IChlOiBFdmVudCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldDtcbiAgICBpZiAodCBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgdC5pZCA9PT0gJ19fcGluY2hncmFiX292ZXJsYXknKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBwYXRoID0gdHlwZW9mIGUuY29tcG9zZWRQYXRoID09PSAnZnVuY3Rpb24nID8gZS5jb21wb3NlZFBhdGgoKSA6IFtdO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBwYXRoKSB7XG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5pZCA9PT0gJ19fcGluY2hncmFiX292ZXJsYXknKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChub2RlID09PSBvdmVybGF5SG9zdCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBvbk1vdXNlRG93biA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKGlzSW5zaWRlQW5ub3RhdGlvbihlKSkgcmV0dXJuO1xuICAgIGlmIChhbm5vdGF0aW9uRWwuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJyAmJiAhYW5ub3RhdGlvbi5pc0xvY2tlZCgpKSBhbm5vdGF0aW9uLmhpZGUoKTtcbiAgICBpZiAoIWUuYWx0S2V5IHx8IGRyYWdTdGFydCkgcmV0dXJuO1xuICAgIGlmIChpc1BpbmNoZ3JhYk93blVpKGUpKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZHJhZ1N0YXJ0ID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcbiAgICBjb25zb2xlLmxvZyhMT0csICdkcmFnIGFybWVkIGF0JywgZHJhZ1N0YXJ0KTtcbiAgfTtcblxuICBjb25zdCBvbk1vdXNlVXAgPSAoZTogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghZHJhZ1N0YXJ0KSByZXR1cm47XG4gICAgY29uc3Qgc3RhcnQgPSBkcmFnU3RhcnQ7XG4gICAgY29uc3Qgd2FzRHJhZyA9IEJvb2xlYW4oZHJhZ1JlY3QpO1xuICAgIGRyYWdTdGFydCA9IG51bGw7XG4gICAgdGVhcmRvd25EcmFnUmVjdCgpO1xuICAgIGlmICghd2FzRHJhZykge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZHJhZyB0b28gc2hvcnQsIHRyZWF0ZWQgYXMgc2luZ2xlIGNsaWNrJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHN1cHByZXNzTmV4dENsaWNrID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgc3VwcHJlc3NOZXh0Q2xpY2sgPSBmYWxzZTsgfSwgMjAwKTtcbiAgICBjb25zdCBtb2RlOiAncGFydGlhbCcgfCAnZnVsbCcgPSBlLmNsaWVudFggPj0gc3RhcnQueCA/ICdmdWxsJyA6ICdwYXJ0aWFsJztcbiAgICAvLyBVc2UgdGhlIFNBTUUgY2FuZGlkYXRlIHBvb2wgdGhhdCB3YXMgbG9ja2VkIGF0IGRyYWcgc3RhcnQgc28gdGhlXG4gICAgLy8gY29tbWl0dGVkIHNldCBtYXRjaGVzIHdoYXQgdGhlIHVzZXIgc2F3IGhpZ2hsaWdodGVkIG1vbWVudHMgYmVmb3JlLlxuICAgIGNvbnN0IHBvb2xGb3JDb21taXQgPSBkcmFnQ2FuZGlkYXRlcy5sZW5ndGggPyBkcmFnQ2FuZGlkYXRlcyA6IHBpY2tEcmFnQ2FuZGlkYXRlcyhvdmVybGF5SG9zdCk7XG4gICAgY29uc3QgZWxzID0gZWxlbWVudHNJblJlY3QocG9vbEZvckNvbW1pdCwgc3RhcnQueCwgc3RhcnQueSwgZS5jbGllbnRYLCBlLmNsaWVudFksIG1vZGUpO1xuICAgIGNvbnNvbGUubG9nKExPRywgYGRyYWcgRU5EIOKAlCBtb2RlPSR7bW9kZX0g4oCUIFNUQUdJTkcgKE5PVCBjb21taXR0aW5nKWAsIGVscy5sZW5ndGgsICdlbGVtZW50czonLCBlbHMubWFwKGNvbXBhY3RUYXJnZXQpKTtcbiAgICAvLyBEcmFnIG1pcnJvcnMgQWx0K1NoaWZ0K0NsaWNrIOKAlCBldmVyeSBlbGVtZW50IHN0YWdlcyBpbnRvIHRoZSBwZW5kaW5nXG4gICAgLy8gYmF5LiBUaGUgdXNlciBNVVNUIGNsaWNrIFwiQ29tbWl0IGdyb3VwXCIgaW4gdGhlIHNpZGUgcGFuZWwgdG8gZmluYWxpemU7XG4gICAgLy8gdGhlcmUgaXMgbm8gYXV0by1jb21taXQgdGltZXIuXG4gICAgZm9yIChjb25zdCBlbCBvZiBlbHMpIHN0YWdlUGVuZGluZyhlbCk7XG4gIH07XG5cbiAgY29uc3Qgb25DbGljayA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdXBwcmVzc05leHRDbGljaykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNJbnNpZGVBbm5vdGF0aW9uKGV2ZW50KSkgcmV0dXJuO1xuICAgIGlmICghZXZlbnQuYWx0S2V5KSByZXR1cm47XG4gICAgaWYgKGlzUGluY2hncmFiT3duVWkoZXZlbnQpKSByZXR1cm47XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCByYXcgPSBldmVudC50YXJnZXQ7XG4gICAgaWYgKCEocmF3IGluc3RhbmNlb2YgRWxlbWVudCkpIHJldHVybjtcbiAgICAvLyBTbmFwIGNsaWNrcyB0aGUgc2FtZSB3YXkgaG92ZXIgZG9lcyBzbyB0aGUgY2FwdHVyZWQgZWxlbWVudCBtYXRjaGVzXG4gICAgLy8gZXhhY3RseSB3aGF0IHRoZSBvcmFuZ2UgcmluZyB3YXMgYXJvdW5kIHdoZW4gdGhlIHVzZXIgY2xpY2tlZC5cbiAgICBjb25zdCBlbCA9IGhvdmVyU25hcCA/IHNuYXBUb0NvbXBvbmVudChyYXcsIGtub3duQ2FwdHVyZWQpIDogcmF3O1xuICAgIGlmIChpc0h1Z2VFbGVtZW50KGVsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2tpcHBpbmcgaHVnZSBjbGljayB0YXJnZXQ6JywgY29tcGFjdFRhcmdldChlbCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHN0YWdlUGVuZGluZyhlbCwge2NsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFl9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkoZWwsIG5leHRTZXEoKSwge1xuICAgICAgY2xpY2tBdDoge2NsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFl9LFxuICAgIH0pO1xuICAgIGZsYXNoRWxlbWVudChlbCk7XG4gICAgY29uc3QgcGFnZSA9IGJ1aWxkUGFnZUNvbnRleHQoKTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZX0pO1xuICAgIHRlc3RDYXB0dXJlcz8ucHVzaCh7ZW50cnksIHBhZ2V9KTtcbiAgfTtcblxuICAvLyBCaW5kIG9uIGJvdGggd2luZG93IGFuZCBkb2N1bWVudC4gU29tZSBwYWdlcyBjYWxsIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblxuICAvLyBvbiB0aGVpciBvd24gZG9jdW1lbnQtbGV2ZWwgY2FwdHVyZSBoYW5kbGVyIOKAlCBsaXN0ZW5pbmcgb24gd2luZG93IHBpY2tzIHVwXG4gIC8vIHRob3NlIGV2ZW50cyBmaXJzdC4gQSAxbXMgdGltZXN0YW1wIGRlZHVwZSBwcmV2ZW50cyBkb3VibGUtaGFuZGxpbmcuXG4gIGZvciAoY29uc3QgdGFyZ2V0IG9mIFt3aW5kb3csIGRvY3VtZW50XSkge1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24gYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gIH1cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkgbGFzdENvbnRleHRFbCA9IGUudGFyZ2V0O1xuICB9LCB0cnVlKTtcblxuICAvLyBLZXlib2FyZCBsaXN0ZW5lcnMgKHBhZ2UtZm9jdXNlZCBjYXNlKS5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGlmIChlLmFsdEtleSkge1xuICAgICAgc2V0QWx0QWN0aXZlKHRydWUpO1xuICAgICAgLy8gUHJlLWVtcHQgdGhlIGJyb3dzZXIncyBBbHQg4oaSIG1lbnUtYmFyIGZvY3VzIHNoaWZ0IG9uIFdpbmRvd3MuIElmIHdlXG4gICAgICAvLyBkb24ndCBwcmV2ZW50RGVmYXVsdCBoZXJlLCB0aGUga2V5dXAgdGhhdCBmb2xsb3dzIHdpbGwgc3RlYWwgZm9jdXNcbiAgICAgIC8vIGZyb20gb3VyIG92ZXJsYXkgdGV4dGFyZWEuXG4gICAgICBpZiAoZS5rZXkgPT09ICdBbHQnICYmIGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgIWUuYWx0S2V5KSB7XG4gICAgICAvLyBTYW1lIEFsdC3ihpItbWVudSBzdXBwcmVzc2lvbiBvbiByZWxlYXNlOiBDaHJvbWUgLyBFZGdlIG9uIFdpbmRvd3NcbiAgICAgIC8vIHNoaWZ0IGZvY3VzIHRvIHRoZSBtZW51IGJhciB3aGVuIEFsdCBpcyByZWxlYXNlZCB3aXRob3V0IGFub3RoZXJcbiAgICAgIC8vIGtleSBpbnRlcnZlbmluZy4gQmxvY2sgaXQgc28gb3VyIHRleHRhcmVhIGtlZXBzIGZvY3VzLlxuICAgICAgaWYgKGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBhbHRGb3J3YXJkZWQgPSBmYWxzZTtcbiAgICAgIHNldEFsdEFjdGl2ZShmYWxzZSk7XG4gICAgICAvLyBObyBhdXRvLWNvbW1pdCB0aW1lciDigJQgdGhlIHVzZXIgZXhwbGljaXRseSBjbGlja3MgXCJDb21taXQgZ3JvdXBcIlxuICAgICAgLy8gaW4gdGhlIHNpZGUtcGFuZWwgcGVuZGluZyBiYXkgKG9yIEVzYyB0byBjYW5jZWwpLlxuICAgIH1cbiAgfSwgdHJ1ZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4ge1xuICAgIGFsdEZvcndhcmRlZCA9IGZhbHNlO1xuICAgIHNldEFsdEFjdGl2ZShmYWxzZSk7XG4gICAgLy8gTm90ZTogZG9uJ3QgY2FuY2VsIHBlbmRpbmdNdWx0aSDigJQgY2xpY2tpbmcgdGhlIHNpZGUtcGFuZWwgY29tbWl0IGJ1dHRvblxuICAgIC8vIGJsdXJzIHRoZSBob3N0IHBhZ2UgYW5kIHdlJ2QgbG9zZSB0aGUgc3RhZ2luZyBzdGF0ZSByaWdodCBiZWZvcmUgY29tbWl0LlxuICB9LCB0cnVlKTtcblxuICAvLyDilIDilIDilIAgU2lkZS1wYW5lbCBjb21tYW5kcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2FmZVF1ZXJ5ID0gKHNlbDogc3RyaW5nIHwgdW5kZWZpbmVkKTogRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIHRyeSB7IHJldHVybiBzZWwgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCkgOiBudWxsOyB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVDb21tYW5kID0gKG1zZzogUGdFbnZlbG9wZTxQYW5lbFRvQ3M+LCByZXNwb25kOiAocjogYW55KSA9PiB2b2lkKTogYm9vbGVhbiA9PiB7XG4gICAgc3dpdGNoIChtc2cua2luZCkge1xuICAgICAgY2FzZSAnb3V0bGluZSc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKGVsKSB0cmFja0VsZW1lbnQoJ2Zyb20tcGFuZWwnLCBlbCwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKSwgZ29sZDogbXNnLmdvbGQsIGRhc2hlZDogbXNnLmRhc2hlZH0pO1xuICAgICAgICBlbHNlIHJlbW92ZVJpbmcoJ2Zyb20tcGFuZWwnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnb3V0bGluZS1jbGVhcic6XG4gICAgICAgIHJlbW92ZVJpbmcoJ2Zyb20tcGFuZWwnKTtcbiAgICAgICAgcmVtb3ZlUmluZygnbXVsdGknKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnb3V0bGluZS1tdWx0aSc6IHtcbiAgICAgICAgcmVtb3ZlUmluZygnbXVsdGknKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbCBvZiBtc2cuc2VsZWN0b3JzKSB7XG4gICAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkoc2VsKTtcbiAgICAgICAgICBpZiAoZWwpIHRyYWNrRWxlbWVudChgbXVsdGk6JHtpKyt9YCwgZWwsIHtnb2xkOiB0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnb3V0bGluZS1tdWx0aS1jbGVhcic6IHtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIFsuLi5yaW5ncy5rZXlzKCldKSBpZiAoay5zdGFydHNXaXRoKCdtdWx0aTonKSkgcmVtb3ZlUmluZyhrKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2Nyb2xsLXRvJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWVsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGVsLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJywgaW5saW5lOiAnY2VudGVyJ30pO1xuICAgICAgICBpZiAobXNnLnN0aWNreSkgdHJhY2tFbGVtZW50KCdzdGlja3knLCBlbCwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKSwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICBlbHNlIGZsYXNoRWxlbWVudChlbCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2xvY2F0ZS1mbGFzaCc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsb2NhdGVGbGFzaChlbCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3N0aWNreS1jbGVhcic6XG4gICAgICAgIHJlbW92ZVJpbmcoJ3N0aWNreScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHtcbiAgICAgICAgY29uc3QgdmFsaWQ6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qgc2VsIG9mIG1zZy5zZWxlY3RvcnMpIHtcbiAgICAgICAgICB0cnkgeyB2YWxpZFtzZWxdID0gQm9vbGVhbihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCkpOyB9IGNhdGNoIHsgdmFsaWRbc2VsXSA9IGZhbHNlOyB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uZCh7dmFsaWR9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdsb2ctZWxlbWVudCc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbCkgeyByZXNwb25kKHtvazogZmFsc2V9KTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgdHJ5IHsgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXBpbmNoZ3JhYi1pZCcsIFN0cmluZyhtc2cubiA/PyAnJykpOyB9IGNhdGNoIHsgLyogc2FuZGJveCAqLyB9XG4gICAgICAgIGNvbnNvbGUubG9nKCclY1tQaW5jaEdyYWJdIGVsZW1lbnQ6JywgJ2NvbG9yOiNmZjVmMDA7Zm9udC13ZWlnaHQ6NzAwOycsIGVsLFxuICAgICAgICAgIGBcXG4gIOKAoiBSaWdodC1jbGljayDihpIgUmV2ZWFsIGluIEVsZW1lbnRzIHBhbmVsXFxuICDigKIgT3IgaW4gRGV2VG9vbHMgY29uc29sZTogJCgnW2RhdGEtcGluY2hncmFiLWlkPVwiJHttc2cubiA/PyAnJ31cIl0nKWApO1xuICAgICAgICBlbC5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcid9KTtcbiAgICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgICAgcmVzcG9uZCh7b2s6IHRydWUsIHNuaXBwZXQ6IGAkKCcke21zZy5zZWxlY3Rvcn0nKWB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdyZWNhcHR1cmUnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghZWwpIHsgcmVzcG9uZCh7b2s6IGZhbHNlLCByZWFzb246ICdub3QtZm91bmQnfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBtc2cubiA/PyBuZXh0U2VxKCkpO1xuICAgICAgICByZXNwb25kKHtvazogdHJ1ZSwgZW50cnksIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2NhcHR1cmUtYW5jZXN0b3InOiB7XG4gICAgICAgIC8vIFdhbGsgdXAgYGRlcHRoYCBhbmNlc3RvciBsZXZlbHMgZnJvbSB0aGUgb3JpZ2luYWwgc2VsZWN0b3IgYW5kXG4gICAgICAgIC8vIGNhcHR1cmUgdGhhdCBlbGVtZW50LiBVc2VkIGJ5IHRoZSBhbmNlc3Rvci1icmVhZGNydW1iIGNoaXBzIGluXG4gICAgICAgIC8vIHRoZSBzaWRlLXBhbmVsIGJ1YmJsZSBzbyB0aGUgdXNlciBjYW4gZXNjYWxhdGUgXCJJIG1lYW50IHRoZSBjYXJkLFxuICAgICAgICAvLyBub3QgdGhlIGgzIGluc2lkZSBpdFwiIHdpdGhvdXQgcmUtY2xpY2tpbmcgb24gdGhlIHBhZ2UuXG4gICAgICAgIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghY3VyKSB7IHJlc3BvbmQoe29rOiBmYWxzZSwgcmVhc29uOiAnbm90LWZvdW5kJ30pOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5kZXB0aCAmJiBjdXIgJiYgY3VyLnBhcmVudEVsZW1lbnQgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5OyBpKyspIHtcbiAgICAgICAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWN1ciB8fCBpc0h1Z2VFbGVtZW50KGN1cikpIHsgcmVzcG9uZCh7b2s6IGZhbHNlLCByZWFzb246ICd0b28tbGFyZ2UnfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGN1ciwgbmV4dFNlcSgpKTtcbiAgICAgICAgZmxhc2hFbGVtZW50KGN1cik7XG4gICAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnY2FwdHVyZScsIGVudHJ5LCBwYWdlOiBidWlsZFBhZ2VDb250ZXh0KCl9KTtcbiAgICAgICAgcmVzcG9uZCh7b2s6IHRydWUsIGVudHJ5fSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY2FzZSAnb3V0bGluZS1hbmNlc3Rvcic6IHtcbiAgICAgICAgLy8gUHJldmlldyB0aGUgTnRoIGFuY2VzdG9yIOKAlCBzYW1lIHdhbGsgYXMgY2FwdHVyZS1hbmNlc3RvciBidXRcbiAgICAgICAgLy8gb3V0bGluZXMgdGhlIHJlc3VsdCB3aXRoIHRoZSBleGlzdGluZyBnb2xkLXJpbmcgdHJhY2tlciBpbnN0ZWFkXG4gICAgICAgIC8vIG9mIGNhcHR1cmluZy4gU2lkZSBwYW5lbCBjYWxscyB0aGlzIG9uIGhvdmVyIG9mIGEgYnJlYWRjcnVtYiBjaGlwLlxuICAgICAgICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWN1cikgcmV0dXJuIGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5kZXB0aCAmJiBjdXIgJiYgY3VyLnBhcmVudEVsZW1lbnQgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5OyBpKyspIHtcbiAgICAgICAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWN1ciB8fCBpc0h1Z2VFbGVtZW50KGN1cikpIHtcbiAgICAgICAgICByZW1vdmVSaW5nKCdmcm9tLXBhbmVsJyk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRyYWNrRWxlbWVudCgnZnJvbS1wYW5lbCcsIGN1ciwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGN1ciksIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnYWx0LXN0YXRlJzpcbiAgICAgICAgYWx0Rm9yd2FyZGVkID0gbXNnLm9uO1xuICAgICAgICBzZXRBbHRBY3RpdmUobXNnLm9uKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnbWFudWFsLWNhcHR1cmUnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghZWwpIHsgcmVzcG9uZCh7b2s6IGZhbHNlLCByZWFzb246ICdub3QtZm91bmQnfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBtc2cubiA/PyBuZXh0U2VxKCkpO1xuICAgICAgICBmbGFzaEVsZW1lbnQoZWwpO1xuICAgICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZTogYnVpbGRQYWdlQ29udGV4dCgpfSk7XG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlLCBlbnRyeX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Fubm90YXRpb24nOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmIChlbCkgYW5ub3RhdGlvbi5zaG93KGVsLCB7Li4uKG1zZy5wYXlsb2FkID8/IHt9KSwgc2VsZWN0b3I6IG1zZy5zZWxlY3Rvcn0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdhbm5vdGF0aW9uLWNsZWFyJzpcbiAgICAgICAgYW5ub3RhdGlvbi5oaWRlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ3BlbmRpbmctY2FuY2VsJzpcbiAgICAgICAgY2FuY2VsUGVuZGluZ011bHRpKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ3BlbmRpbmctY29tbWl0JzpcbiAgICAgICAgY29tbWl0UGVuZGluZ011bHRpKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ2NvbnRleHQtY2FwdHVyZSc6IHtcbiAgICAgICAgaWYgKGxhc3RDb250ZXh0RWwpIHtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShsYXN0Q29udGV4dEVsLCBuZXh0U2VxKCkpO1xuICAgICAgICAgIGZsYXNoRWxlbWVudChsYXN0Q29udGV4dEVsKTtcbiAgICAgICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZTogYnVpbGRQYWdlQ29udGV4dCgpfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2V0LWNhcHR1cmVkJzpcbiAgICAgICAga25vd25DYXB0dXJlZCA9IG5ldyBTZXQobXNnLnNlbGVjdG9ycyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ3NldC1jcy1wcmVmcyc6XG4gICAgICAgIGlmICh0eXBlb2YgbXNnLnNwYWNpbmdPdmVybGF5ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBzcGFjaW5nT3ZlcmxheSA9IG1zZy5zcGFjaW5nT3ZlcmxheTtcbiAgICAgICAgICBpZiAoIXNwYWNpbmdPdmVybGF5KSBjbGVhclNwYWNpbmdPdmVybGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBtc2cuaG92ZXJTbmFwID09PSAnYm9vbGVhbicpIGhvdmVyU25hcCA9IG1zZy5ob3ZlclNuYXA7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ2hpZGUtb3ZlcmxheXMnOiB7XG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tcGxhaW50OiBQaW5jaEdyYWIgcmluZ3MvYm9yZGVycyB3ZXJlIHN0aWxsIHZpc2libGVcbiAgICAgICAgLy8gaW4gdGhlIGNhcHR1cmVkIFBORy4gUm9vdCBjYXVzZTogdGhlIG1lc3NhZ2UgaGFuZGxlciB1c2VkIHRvXG4gICAgICAgIC8vIGFjayBzeW5jaHJvbm91c2x5IHRoZSBtb21lbnQgd2Ugc2V0IGB2aXNpYmlsaXR5OiBoaWRkZW5gLCBidXRcbiAgICAgICAgLy8gdGhlIGJyb3dzZXIncyBjb21wb3NpdG9yIGhhZG4ndCB5ZXQgcGFpbnRlZCB0aGF0IGZyYW1lLCBzb1xuICAgICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlZCBhZ2FpbnN0IGEgc3RpbGwtY29tcG9zaXRlZCBvdmVybGF5LlxuICAgICAgICAvL1xuICAgICAgICAvLyBGaXg6IHN3aXRjaCB0byBgZGlzcGxheTogbm9uZWAgKHJpcHMgaXQgb3V0IG9mIGxheW91dCBlbnRpcmVseVxuICAgICAgICAvLyDigJQgc3Ryb25nZXIgZ3VhcmFudGVlIHRoYW4gdmlzaWJpbGl0eTpoaWRkZW4pLCBmb3JjZSBhIGxheW91dFxuICAgICAgICAvLyBmbHVzaCwgYW5kIHdhaXQgZm9yIFRXTyBhbmltYXRpb24gZnJhbWVzIGJlZm9yZSBhY2tpbmcuIFR3b1xuICAgICAgICAvLyBSQUZzIGlzIHRoZSBzdGFuZGFyZCBcIm5leHQgcGFpbnQgaGFzIGhhcHBlbmVkXCIgc2lnbmFsIGluXG4gICAgICAgIC8vIGJyb3dzZXJzLlxuICAgICAgICBvdmVybGF5SG9zdC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAvLyBGb3JjZSBsYXlvdXQgZmx1c2ggc28gdGhlIGNoYW5nZSB0YWtlcyBlZmZlY3QuXG4gICAgICAgIHZvaWQgb3ZlcmxheUhvc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlc3BvbmQoe29rOiB0cnVlfSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdzaG93LW92ZXJsYXlzJzoge1xuICAgICAgICBvdmVybGF5SG9zdC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgIG92ZXJsYXlIb3N0LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgSVBDIGJyaWRnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZnVuY3Rpb24gc2VuZFRvUGFuZWwocGF5bG9hZDogQ3NUb1BhbmVsKTogdm9pZCB7XG4gICAgY29uc3QgbXNnID0gcGcocGF5bG9hZCk7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICB0cnkgeyB2b2lkIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1zZykuY2F0Y2g/LigoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTsgfVxuICAgICAgY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIHtkZXRhaWw6IG1zZ30pKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2c6IGFueSwgX3NlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobXNnICYmIG1zZy5fX3BnID09PSB0cnVlKSByZXR1cm4gaGFuZGxlQ29tbWFuZChtc2cgYXMgUGdFbnZlbG9wZTxQYW5lbFRvQ3M+LCBzZW5kUmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6dG8tY3MnLCAoZTogRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG1zZyA9IChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWw7XG4gICAgICBjb25zdCByZXFJZCA9IG1zZz8uX19yZXFJZDtcbiAgICAgIGxldCByZXNwb25kZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHJlc3BvbmQgPSAocmVwbHk6IHVua25vd24pOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbmRlZCkgcmV0dXJuO1xuICAgICAgICByZXNwb25kZWQgPSB0cnVlO1xuICAgICAgICBpZiAocmVxSWQpIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOmNzLXJlc3BvbnNlJywge2RldGFpbDoge19fcmVxSWQ6IHJlcUlkLCByZXBseX19KSk7XG4gICAgICB9O1xuICAgICAgaGFuZGxlQ29tbWFuZChtc2csIHJlc3BvbmQpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFJlY2VudC1UYWIgdHJhY2tlciAoZm9yIGFjdGl2ZUZvY3VzLnJlY2VudGx5VGFiYmVkKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gVGhlIHBhZ2UtY29udGV4dCBhY3RpdmVGb2N1cyBmaWVsZCBmbGFncyBmb2N1cyBhcyBcImtleWJvYXJkLWRyaXZlblwiXG4gIC8vIHdoZW4gdGhlIHVzZXIgcHJlc3NlZCBUYWIgLyBTaGlmdCtUYWIgaW4gdGhlIGxhc3Qgc2Vjb25kLiBVc2VmdWwgZm9yXG4gIC8vIGExMXkgYnVnIGNhcHR1cmVzIHdoZXJlIHRoZSB2aXN1YWwgaXNzdWUgb25seSBzaG93cyB1cCB3aGlsZVxuICAvLyB0YWJiaW5nLCBub3Qgb24gY2xpY2suIFdlIGNhcHR1cmUgaW4gdGhlIGNhcHR1cmUgcGhhc2Ugc28gYSBwYWdlJ3NcbiAgLy8gb3duIGtleWRvd24gaGFuZGxlciBjYW4ndCBzdXBwcmVzcyB1cy5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnVGFiJykgbm90ZVRhYlByZXNzZWQoKTtcbiAgfSwgdHJ1ZSk7XG5cbiAgLy8g4pSA4pSA4pSAIFByZWZlcmVuY2UtY2hhbmdlIGxpc3RlbmVyIChkYXJrLW1vZGUgdG9nZ2xlLCBtb3Rpb24gcHJlZikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJyb3dzZXJzIGVtaXQgYGNoYW5nZWAgZXZlbnRzIG9uIGEgTWVkaWFRdWVyeUxpc3Qgd2hlbiB0aGUgT1MgLyBwYWdlXG4gIC8vIHNldHRpbmcgZmxpcHMuIFdlIGZvcndhcmQgdG8gdGhlIHBhbmVsIHNvIHRoZSBleHBvcnQncyBjaHJvbm9sb2d5XG4gIC8vIGNhcHR1cmVzIHRoZSBtb21lbnQgdGhlIHVzZXIgc3dpdGNoZWQgbW9kZXMg4oCUIHdpdGhvdXQgaXQsIGNhcHR1cmVzXG4gIC8vIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGZsaXAgbWl4IGFwcGVhcmFuY2UgdmFsdWVzIHdpdGggbm8gc2lnbmFsIGFzIHRvXG4gIC8vIHdoaWNoIG1vZGUgd2FzIGFjdGl2ZS5cbiAgY29uc3Qgd2lyZVByZWZlcmVuY2VMaXN0ZW5lcnMgPSAoKTogdm9pZCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNzID0gbWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpO1xuICAgICAgY29uc3QgbW90aW9uID0gbWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKTtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gKHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nKTogdm9pZCA9PiB7XG4gICAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnLCByZWFzb24sIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgfTtcbiAgICAgIGNzLmFkZEV2ZW50TGlzdGVuZXI/LignY2hhbmdlJywgKCkgPT4gb25DaGFuZ2UoJ2NvbG9yLXNjaGVtZScpKTtcbiAgICAgIG1vdGlvbi5hZGRFdmVudExpc3RlbmVyPy4oJ2NoYW5nZScsICgpID0+IG9uQ2hhbmdlKCdyZWR1Y2VkLW1vdGlvbicpKTtcbiAgICB9IGNhdGNoIHsgLyogb2xkIGJyb3dzZXIgLyBtYXRjaE1lZGlhIHVuYXZhaWxhYmxlICovIH1cbiAgfTtcbiAgd2lyZVByZWZlcmVuY2VMaXN0ZW5lcnMoKTtcblxuICAvLyDilIDilIDilIAgRE9NLW11dGF0aW9uIHJpbmcgYnVmZmVyIGZvciBjYXB0dXJlIHJlcHJvIGNvbnRleHQgKMKnNC44KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUGFnZXMgd2l0aCBhY3RpdmUgYW5pbWF0aW9uL3BvbGxpbmcgY2FuIGNodXJuIHRocm91Z2ggaHVuZHJlZHMgb2ZcbiAgLy8gbXV0YXRpb25zIHBlciBzZWNvbmQ7IHdlIGNhcCBtZW1vcnkgYXQgTVVUQVRJT05fQlVGRkVSX0NBUCByZWNvcmRzXG4gIC8vIGFuZCBvbmx5IHJldHVybiBtdXRhdGlvbnMgd2l0aGluIHRoZSBsYXN0IE1VVEFUSU9OX1dJTkRPV19NUyB0b1xuICAvLyBjYXB0dXJlRW50cnkuIGNvbXBhY3RUYXJnZXQgaXMgY2hlYXBlciB0aGFuIGNzc1BhdGgsIHVzZWQgaGVyZSB0b1xuICAvLyBhdm9pZCBxdWFkcmF0aWMgY29zdCBvbiBsYXJnZSBET01zLlxuICBjb25zdCBNVVRBVElPTl9CVUZGRVJfQ0FQID0gNTA7XG4gIGNvbnN0IE1VVEFUSU9OX1dJTkRPV19NUyA9IDhfMDAwO1xuICBjb25zdCBTRUNSRVRfQVRUUl9OQU1FX1JFID0gLyhwYXNzd29yZHx0b2tlbnxzZWNyZXR8YXBpW18tXT9rZXl8Y3NyZnx4c3JmfHNlc3Npb258bm9uY2UpL2k7XG4gIGNvbnN0IG11dGF0aW9uQnVmZmVyOiBEb21NdXRhdGlvbltdID0gW107XG4gIGNvbnN0IHRydW5jYXRlID0gKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIG1heCA9IDEyMCk6IHN0cmluZyA9PlxuICAgIFN0cmluZyhzID8/ICcnKS5zbGljZSgwLCBtYXgpO1xuXG4gIGNvbnN0IG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigocmVjb3JkcykgPT4ge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBmb3IgKGNvbnN0IHIgb2YgcmVjb3Jkcykge1xuICAgICAgLy8gU2tpcCBtdXRhdGlvbnMgaW5zaWRlIG91ciBvd24gb3ZlcmxheSDigJQgZXZlcnkgcmluZyByZXBhaW50IGlzIGFcbiAgICAgIC8vIG11dGF0aW9uIGFuZCB3ZSdkIGZsb29kIHRoZSBidWZmZXIgd2l0aCBzZWxmLW5vaXNlLlxuICAgICAgY29uc3QgdE5vZGUgPSByLnRhcmdldDtcbiAgICAgIGlmICh0Tm9kZSBpbnN0YW5jZW9mIE5vZGUgJiYgKG92ZXJsYXlIb3N0ID09PSB0Tm9kZSB8fCBvdmVybGF5SG9zdC5jb250YWlucyh0Tm9kZSkpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHRFbDogRWxlbWVudCB8IG51bGwgPSB0Tm9kZSBpbnN0YW5jZW9mIEVsZW1lbnRcbiAgICAgICAgPyB0Tm9kZVxuICAgICAgICA6ICh0Tm9kZS5wYXJlbnRFbGVtZW50ID8/IG51bGwpO1xuICAgICAgY29uc3QgdGFyZ2V0RGVzYyA9IHRFbCA/IGNvbXBhY3RUYXJnZXQodEVsKSA6IHROb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBsZXQgZW50cnk6IERvbU11dGF0aW9uO1xuICAgICAgaWYgKHIudHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgY29uc3QgYWRkZWQgPSByLmFkZGVkTm9kZXMubGVuZ3RoO1xuICAgICAgICBjb25zdCByZW1vdmVkID0gci5yZW1vdmVkTm9kZXMubGVuZ3RoO1xuICAgICAgICBsZXQgc3VtbWFyeSA9IGAke3RhcmdldERlc2N9OmA7XG4gICAgICAgIGlmIChhZGRlZCA+IDApIHtcbiAgICAgICAgICBjb25zdCBmaXJzdCA9IHIuYWRkZWROb2Rlc1swXTtcbiAgICAgICAgICBzdW1tYXJ5ICs9IGAgKyR7YWRkZWR9ICR7Zmlyc3QgaW5zdGFuY2VvZiBFbGVtZW50ID8gY29tcGFjdFRhcmdldChmaXJzdCkgOiAndGV4dCd9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVtb3ZlZCA+IDApIHtcbiAgICAgICAgICBjb25zdCBmaXJzdCA9IHIucmVtb3ZlZE5vZGVzWzBdO1xuICAgICAgICAgIHN1bW1hcnkgKz0gYCAtJHtyZW1vdmVkfSAke2ZpcnN0IGluc3RhbmNlb2YgRWxlbWVudCA/IGNvbXBhY3RUYXJnZXQoZmlyc3QpIDogJ3RleHQnfWA7XG4gICAgICAgIH1cbiAgICAgICAgZW50cnkgPSB7dHlwZTogJ2NoaWxkTGlzdCcsIHRzOiBub3csIHRhcmdldDogdGFyZ2V0RGVzYywgYWRkZWQsIHJlbW92ZWQsIHN1bW1hcnk6IHRydW5jYXRlKHN1bW1hcnksIDIwMCl9O1xuICAgICAgfSBlbHNlIGlmIChyLnR5cGUgPT09ICdhdHRyaWJ1dGVzJykge1xuICAgICAgICBjb25zdCBuYW1lID0gci5hdHRyaWJ1dGVOYW1lID8/ICcnO1xuICAgICAgICBjb25zdCBpc1NlY3JldCA9IFNFQ1JFVF9BVFRSX05BTUVfUkUudGVzdChuYW1lKTtcbiAgICAgICAgY29uc3QgbmV3VmFsUmF3ID0gKHRFbCA/IHRFbC5nZXRBdHRyaWJ1dGUobmFtZSkgOiBudWxsKSA/PyAnJztcbiAgICAgICAgY29uc3Qgb2xkVmFsUmF3ID0gci5vbGRWYWx1ZSA/PyBudWxsO1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IGlzU2VjcmV0ID8gJ1tyZWRhY3RlZF0nIDogKG9sZFZhbFJhdyA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IHRydW5jYXRlKG9sZFZhbFJhdykpO1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGlzU2VjcmV0ID8gJ1tyZWRhY3RlZF0nIDogdHJ1bmNhdGUobmV3VmFsUmF3KTtcbiAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgdHlwZTogJ2F0dHJpYnV0ZXMnLCB0czogbm93LCB0YXJnZXQ6IHRhcmdldERlc2MsIGF0dHJpYnV0ZU5hbWU6IG5hbWUsXG4gICAgICAgICAgb2xkVmFsdWUsIG5ld1ZhbHVlLFxuICAgICAgICAgIHN1bW1hcnk6IHRydW5jYXRlKGAke3RhcmdldERlc2N9WyR7bmFtZX1dOiAke29sZFZhbHVlID8/ICfiiIUnfSDihpIgJHtuZXdWYWx1ZX1gLCAyMDApLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2hhcmFjdGVyRGF0YVxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHIub2xkVmFsdWUgPz8gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHROb2RlLm5vZGVWYWx1ZSA/PyAnJztcbiAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgdHlwZTogJ2NoYXJhY3RlckRhdGEnLCB0czogbm93LCB0YXJnZXQ6IHRhcmdldERlc2MsXG4gICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlICE9PSB1bmRlZmluZWQgPyB0cnVuY2F0ZShvbGRWYWx1ZSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbmV3VmFsdWU6IHRydW5jYXRlKG5ld1ZhbHVlKSxcbiAgICAgICAgICBzdW1tYXJ5OiB0cnVuY2F0ZShgJHt0YXJnZXREZXNjfSB0ZXh0OiAke3RydW5jYXRlKG9sZFZhbHVlLCAzMCl9IOKGkiAke3RydW5jYXRlKG5ld1ZhbHVlLCAzMCl9YCwgMjAwKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIG11dGF0aW9uQnVmZmVyLnB1c2goZW50cnkpO1xuICAgICAgaWYgKG11dGF0aW9uQnVmZmVyLmxlbmd0aCA+IE1VVEFUSU9OX0JVRkZFUl9DQVApIG11dGF0aW9uQnVmZmVyLnNoaWZ0KCk7XG4gICAgfVxuICB9KTtcbiAgdHJ5IHtcbiAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XG4gICAgICBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLCBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsIGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogdHJ1ZSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkgeyBjb25zb2xlLndhcm4oTE9HLCAnTXV0YXRpb25PYnNlcnZlci5vYnNlcnZlIGZhaWxlZCcsIGUpOyB9XG5cbiAgLy8gSGFuZCBjYXB0dXJlRW50cnkgYSBnZXR0ZXIgc28gaXQgY2FuIHJlYWQgdGhlIGJ1ZmZlciB3aXRob3V0XG4gIC8vIGltcG9ydGluZyBjb250ZW50LXNjcmlwdC1vbmx5IHN0YXRlLlxuICBzZXRNdXRhdGlvbkJ1ZmZlckdldHRlcigoKSA9PiB7XG4gICAgY29uc3QgY3V0b2ZmID0gRGF0ZS5ub3coKSAtIE1VVEFUSU9OX1dJTkRPV19NUztcbiAgICByZXR1cm4gbXV0YXRpb25CdWZmZXIuZmlsdGVyKChtKSA9PiBEYXRlLnBhcnNlKG0udHMpID49IGN1dG9mZik7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBUZXN0L3N0YW5kYWxvbmUgQVBJIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcGk6IFBpbmNoZ3JhYkFwaSA9IHtcbiAgICBjYXB0dXJlRW50cnksXG4gICAgYnVpbGRQYWdlQ29udGV4dCxcbiAgICBjYXB0dXJlczogdGVzdENhcHR1cmVzLFxuICAgIGZsYXNoRWxlbWVudDogKHNlbDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcbiAgICAgIGlmIChlbCkgZmxhc2hFbGVtZW50KGVsKTtcbiAgICB9LFxuICAgIHNldEFsdDogKG9uOiBib29sZWFuKSA9PiB7IHNldEFsdEFjdGl2ZShvbik7IH0sXG4gICAgbmV4dFNlcSxcbiAgICBoYW5kbGVDb21tYW5kLFxuICAgIGRlc3Ryb3k6ICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIFt3aW5kb3csIGRvY3VtZW50XSkge1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2sgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICBjbGVhclJpbmdzKCk7XG4gICAgICBvdmVybGF5SG9zdC5yZW1vdmUoKTtcbiAgICAgIGRlbGV0ZSB3aW5kb3dbS0VZXTtcbiAgICB9LFxuICB9O1xuICB3aW5kb3dbS0VZXSA9IGFwaTtcbiAgd2luZG93Ll9fcGluY2hncmFiID0gYXBpO1xuICBjb25zb2xlLmxvZyhMT0csICdyZWFkeScsIHtpbkV4dGVuc2lvbn0pO1xufVxuXG4vLyDilIDilIDilIAgQW5ub3RhdGlvbiBvdmVybGF5IChzdGlja3kgY29tbWVudCBib3gpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxudHlwZSBBbm5vdGF0aW9uRGVwcyA9IHtcbiAgc2VuZFRvUGFuZWw6IChtOiBDc1RvUGFuZWwpID0+IHZvaWQ7XG4gIGNhcHR1cmVBbmRDb21tZW50OiAoZWw6IEVsZW1lbnQsIHRleHQ6IHN0cmluZykgPT4gRW50cnk7XG4gIC8vIENhbGxlZCB3aGVuIHRoZSBib3ggaGlkZXMg4oCUIHVzZWQgdG8gdGVhciBkb3duIHRoZSBtYXRjaGluZyBob3ZlciByaW5nXG4gIC8vIHNvIHJpbmcgKyBib3ggc3RheSBjb3VwbGVkLlxuICBvbkhpZGU6ICgpID0+IHZvaWQ7XG4gIC8vIENhbGxlZCB3aGVuIHRoZSBib3ggYXBwZWFycyBvciBtb3ZlcyB0byBhIG5ldyBlbGVtZW50IOKAlCB1c2VkIHRvXG4gIC8vIChyZS0pcGFpbnQgdGhlIGhvdmVyIHJpbmcgb24gdGhhdCBlbGVtZW50LiBDb3ZlcnMgdGhlIHJhY2Ugd2hlcmUgYWx0XG4gIC8vIHdhcyByZWxlYXNlZCBiZWZvcmUgdGhlIGFubm90YXRpb24gbWVzc2FnZSByb3VuZC10cmlwcGVkIGJhY2suXG4gIG9uU2hvdzogKGVsOiBFbGVtZW50KSA9PiB2b2lkO1xufTtcbnR5cGUgQW5ub3RhdGlvbkFwaSA9IHtcbiAgc2hvdzogKGVsOiBFbGVtZW50LCBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGwpID0+IHZvaWQ7XG4gIGhpZGU6ICgpID0+IHZvaWQ7XG4gIGlzTG9ja2VkOiAoKSA9PiBib29sZWFuO1xuICBmb2N1c1RleHRhcmVhOiAoKSA9PiB2b2lkO1xufTtcblxuZnVuY3Rpb24gc2V0dXBBbm5vdGF0aW9uKGVsOiBIVE1MRGl2RWxlbWVudCwge3NlbmRUb1BhbmVsLCBjYXB0dXJlQW5kQ29tbWVudCwgb25IaWRlLCBvblNob3d9OiBBbm5vdGF0aW9uRGVwcyk6IEFubm90YXRpb25BcGkge1xuICBsZXQgc2VsZWN0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAvLyBBY3RpdmUgY2FwdHVyZSdzIHN0YWJsZSB1aWQgKHdoZW4gcGF5bG9hZC5jYXB0dXJlZCArIHVpZCkuIFVzZWQgYnlcbiAgLy8gc3VibWl0KCkgc28gdGhlIGNvbW1lbnQgcm91dGVzIHRvIHRoZSBTUEVDSUZJQyBjYXB0dXJlIHJhdGhlciB0aGFuXG4gIC8vIHRvIGFueSBzZWxlY3RvciBtYXRjaCDigJQgcHJldmVudHMgY3Jvc3MtcGFnZSAvIGNyb3NzLXNpYmxpbmdcbiAgLy8gY29udGFtaW5hdGlvbi5cbiAgbGV0IGFjdGl2ZVVpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsb2NrZWRUbzogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBsZXQgbG9ja2VkID0gZmFsc2U7XG4gIGxldCB0ZXh0YXJlYTogSFRNTFRleHRBcmVhRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBsZXQgZmVlZGJhY2tMaXN0OiBIVE1MVUxpc3RFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gQnVpbGRlcnMgd2l0aCBpbmxpbmUgc3R5bGVzIChDU1Atc2FmZTsgbm8gaW5saW5lIDxzdHlsZT4gb3IgY2xhc3MgQ1NTKS5cbiAgY29uc3Qgc3R5bGVkID0gPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4odGFnOiBzdHJpbmcsIHN0eWxlczogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPik6IFQgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZykgYXMgVDtcbiAgICBPYmplY3QuYXNzaWduKG5vZGUuc3R5bGUsIHN0eWxlcyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRCb2R5ID0gKHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkKTogdm9pZCA9PiB7XG4gICAgZWwucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgY29uc3QgY2FwdHVyZWQgPSBCb29sZWFuKHBheWxvYWQuY2FwdHVyZWQpO1xuICAgIC8vIEhlYWRlciDigJQgb25seSB3aGVuIGNhcHR1cmVkLiBKdXN0IGEgdGlueSBvcmFuZ2UgYCNOYCBjaGlwOyBub1xuICAgIC8vIFwiUGluY2hHcmFiXCIgb3IgXCJDYXB0dXJlICsgY29tbWVudFwiIGxhYmVscy5cbiAgICBpZiAoY2FwdHVyZWQpIHtcbiAgICAgIGNvbnN0IGhlYWRlciA9IHN0eWxlZDxIVE1MRGl2RWxlbWVudD4oJ2RpdicsIHtcbiAgICAgICAgY29sb3I6ICcjZmY1ZjAwJywgZm9udFdlaWdodDogJzcwMCcsXG4gICAgICAgIGZvbnQ6IFwiNzAwIDEzcHgvMSAnQnJpY29sYWdlIEdyb3Rlc3F1ZScsJ091dGZpdCcsdWktbW9ub3NwYWNlLG1vbm9zcGFjZVwiLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc0cHgnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wMmVtJyxcbiAgICAgIH0pO1xuICAgICAgaGVhZGVyLnRleHRDb250ZW50ID0gYCMke3BheWxvYWQubiA/PyAnPyd9YDtcbiAgICAgIGVsLmFwcGVuZChoZWFkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSBzdHlsZWQ8SFRNTFVMaXN0RWxlbWVudD4oJ3VsJywge1xuICAgICAgbWFyZ2luOiAnMCAwIDZweCAwJywgcGFkZGluZzogJzAgMCAwIDE2cHgnLCBsaXN0U3R5bGU6ICdkaXNjJyxcbiAgICB9KTtcbiAgICBmZWVkYmFja0xpc3QgPSBsaXN0O1xuICAgIGlmIChwYXlsb2FkLmZlZWRiYWNrPy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgdCBvZiBwYXlsb2FkLmZlZWRiYWNrKSBhcHBlbmRGZWVkYmFjayh0KTtcbiAgICAgIGVsLmFwcGVuZChsaXN0KTtcbiAgICB9XG4gICAgLy8gKE5vIFwiTm8gY29tbWVudHMgeWV0LlwiIGZpbGxlciDigJQgZW1wdHkgbGlzdCA9IG5vIGxpc3Qgc2hvd24uKVxuXG4gICAgY29uc3QgYWRkUm93ID0gc3R5bGVkPEhUTUxEaXZFbGVtZW50PignZGl2Jywge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICc2cHgnLCBhbGlnbkl0ZW1zOiAnc3RyZXRjaCcsXG4gICAgICBtYXJnaW5Ub3A6ICc0cHgnLCBwYWRkaW5nVG9wOiAnNnB4JyxcbiAgICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCByZ2JhKDI1NSw5NSwwLC4yKScsXG4gICAgfSk7XG4gICAgY29uc3QgdGEgPSBzdHlsZWQ8SFRNTFRleHRBcmVhRWxlbWVudD4oJ3RleHRhcmVhJywge1xuICAgICAgZmxleDogJzEnLCBtaW5IZWlnaHQ6ICcyOHB4JywgbWF4SGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgcmVzaXplOiAnbm9uZScsXG4gICAgICBiYWNrZ3JvdW5kOiAncmdiYSgwLDAsMCwuMzUpJywgY29sb3I6ICcjZmNmYWY1JyxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDI1NSw5NSwwLC4zKScsXG4gICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgICAgcGFkZGluZzogJzRweCA2cHgnLFxuICAgICAgZm9udDogXCIxMnB4LzEuNCB1aS1tb25vc3BhY2UsJ0pldEJyYWlucyBNb25vJyxNZW5sbyxtb25vc3BhY2VcIixcbiAgICAgIG91dGxpbmU6ICcwJyxcbiAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIH0pO1xuICAgIHRhLnBsYWNlaG9sZGVyID0gY2FwdHVyZWQgPyAnQ29tbWVudOKApicgOiAnQ29tbWVudCB0byBjYXB0dXJl4oCmJztcbiAgICB0YS5yb3dzID0gMjtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHsgdGEuc3R5bGUuYm9yZGVyQ29sb3IgPSAnI2ZmNWYwMCc7IH0pO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB7IHRhLnN0eWxlLmJvcmRlckNvbG9yID0gJ3JnYmEoMjU1LDk1LDAsLjMpJzsgfSk7XG4gICAgdGV4dGFyZWEgPSB0YTtcbiAgICBjb25zdCBzZW5kQnRuID0gc3R5bGVkPEhUTUxCdXR0b25FbGVtZW50PignYnV0dG9uJywge1xuICAgICAgZmxleDogJzAgMCBhdXRvJyxcbiAgICAgIHBhZGRpbmc6ICc0cHggMTBweCcsXG4gICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI2ZmNWYwMCAwJSwgI2VmNGIwMCAxMDAlKScsXG4gICAgICBjb2xvcjogJyNmZmYnLCBib3JkZXI6ICcwJywgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgIGZvbnQ6IFwiNzAwIDEwcHgvMSAnQnJpY29sYWdlIEdyb3Rlc3F1ZScsJ091dGZpdCcsc3lzdGVtLXVpLHNhbnMtc2VyaWZcIixcbiAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBsZXR0ZXJTcGFjaW5nOiAnLjA0ZW0nLFxuICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgfSk7XG4gICAgc2VuZEJ0bi50ZXh0Q29udGVudCA9IGNhcHR1cmVkID8gJ0FkZCcgOiAnQ2FwdHVyZSc7XG4gICAgYWRkUm93LmFwcGVuZCh0YSwgc2VuZEJ0bik7XG4gICAgZWwuYXBwZW5kKGFkZFJvdyk7XG5cbiAgICBjb25zdCBoaW50ID0gc3R5bGVkPEhUTUxEaXZFbGVtZW50PignZGl2Jywge1xuICAgICAgY29sb3I6ICcjODQ3ZDlhJywgZm9udFNpemU6ICcxMHB4JywgbWFyZ2luVG9wOiAnNHB4JyxcbiAgICB9KTtcbiAgICBoaW50LnRleHRDb250ZW50ID0gY2FwdHVyZWRcbiAgICAgID8gJ0VudGVyIHRvIGFkZCDCtyBTaGlmdCtFbnRlciBuZXdsaW5lIMK3IEVzYyB0byBjbG9zZSdcbiAgICAgIDogJ0VudGVyIHRvIGNhcHR1cmUgJiBzYXZlIMK3IFNoaWZ0K0VudGVyIG5ld2xpbmUgwrcgRXNjIHRvIGNsb3NlJztcbiAgICBlbC5hcHBlbmQoaGludCk7XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRGZWVkYmFjayh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGxpID0gc3R5bGVkPEhUTUxMSUVsZW1lbnQ+KCdsaScsIHtcbiAgICAgICAgbWFyZ2luOiAnMnB4IDAnLCBjb2xvcjogJyNmY2ZhZjUnLCB3b3JkQnJlYWs6ICdicmVhay13b3JkJyxcbiAgICAgIH0pO1xuICAgICAgbGkudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgbGlzdC5hcHBlbmQobGkpO1xuICAgICAgaWYgKCFsaXN0LnBhcmVudE5vZGUpIGVsLmluc2VydEJlZm9yZShsaXN0LCBhZGRSb3cpO1xuICAgIH1cblxuICAgIGNvbnN0IHN1Ym1pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSB0YS52YWx1ZS50cmltKCk7XG4gICAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICAgIGlmIChjYXB0dXJlZCAmJiBzZWxlY3Rvcikge1xuICAgICAgICAvLyBSb3V0ZSBieSBzdGFibGUgdWlkICsgVVJMIHdoZW4gYXZhaWxhYmxlLiBTaWRlLXBhbmVsJ3NcbiAgICAgICAgLy8gb25GZWVkYmFja0FkZCBwcmVmZXJzIHBhcmVudFVpZDsgc2VsZWN0b3IgKyB1cmwgaXMgdGhlXG4gICAgICAgIC8vIGNvbXBvc2l0ZSBmYWxsYmFjay4gVGhlIGJhcmUtc2VsZWN0b3IgcGF0aCB0aGF0IHVzZWQgdG9cbiAgICAgICAgLy8gc2hpcCBjYXVzZWQgY3Jvc3MtcGFnZSBjb21tZW50IGNvbnRhbWluYXRpb24uXG4gICAgICAgIHNlbmRUb1BhbmVsKHtcbiAgICAgICAgICBraW5kOiAnZmVlZGJhY2stYWRkJywgc2VsZWN0b3IsIHRleHQsXG4gICAgICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgICAgICAgIC4uLihhY3RpdmVVaWQgPyB7cGFyZW50VWlkOiBhY3RpdmVVaWR9IDoge30pLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAobG9ja2VkVG8pIHtcbiAgICAgICAgLy8gQ2FwdHVyZSArIGF0dGFjaCB0aGUgY29tbWVudCBpbiBvbmUgbW90aW9uLCB0aGVuIHJlYnVpbGQgdGhlXG4gICAgICAgIC8vIGJvZHkgd2l0aCBjYXB0dXJlZD10cnVlIHNvIHRoZSBvcmFuZ2UgI04gaGVhZGVyIGFwcGVhcnMsIGJ1dHRvblxuICAgICAgICAvLyB0ZXh0IGZsaXBzIHRvIFwiQWRkXCIsIGV0Yy5cbiAgICAgICAgY29uc3QgZW50cnkgPSBjYXB0dXJlQW5kQ29tbWVudChsb2NrZWRUbywgdGV4dCk7XG4gICAgICAgIHBheWxvYWQuY2FwdHVyZWQgPSB0cnVlO1xuICAgICAgICBwYXlsb2FkLnVpZCA9IGVudHJ5LnVpZDtcbiAgICAgICAgcGF5bG9hZC5uID0gZW50cnkubjtcbiAgICAgICAgcGF5bG9hZC5zZWxlY3RvciA9IGVudHJ5LnNlbGVjdG9yO1xuICAgICAgICBwYXlsb2FkLmZlZWRiYWNrID0gWy4uLihwYXlsb2FkLmZlZWRiYWNrID8/IFtdKSwgdGV4dF07XG4gICAgICAgIHNlbGVjdG9yID0gZW50cnkuc2VsZWN0b3I7XG4gICAgICAgIGFjdGl2ZVVpZCA9IGVudHJ5LnVpZDtcbiAgICAgICAgYnVpbGRCb2R5KHBheWxvYWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0YS52YWx1ZSA9ICcnO1xuICAgICAgcGF5bG9hZC5mZWVkYmFjayA9IFsuLi4ocGF5bG9hZC5mZWVkYmFjayA/PyBbXSksIHRleHRdO1xuICAgICAgYXBwZW5kRmVlZGJhY2sodGV4dCk7XG4gICAgfTtcbiAgICBzZW5kQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3VibWl0KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7IGUucHJldmVudERlZmF1bHQoKTsgaGlkZSgpOyB9XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICAgIC8vIElmIGEgZm9jdXMgcmVxdWVzdCBjYW1lIGluIGJlZm9yZSB0aGUgdGV4dGFyZWEgZXhpc3RlZCAoYWx0LXJlbGVhc2VcbiAgICAvLyByYWNlZCBhaGVhZCBvZiB0aGUgYW5ub3RhdGlvbiByb3VuZC10cmlwKSwgY2xhaW0gaXQgbm93LlxuICAgIGlmICh3YW50c0ZvY3VzKSB7XG4gICAgICB3YW50c0ZvY3VzID0gZmFsc2U7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGEuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHRydWV9KSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBvc2l0aW9uID0gKGFuY2hvcjogRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHIgPSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgYWggPSBlbC5vZmZzZXRIZWlnaHQgfHwgMTYwO1xuICAgIGNvbnN0IHVzZUFib3ZlID0gci5ib3R0b20gKyA4ICsgYWggPiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3QgdG9wID0gdXNlQWJvdmUgPyBNYXRoLm1heCg4LCByLnRvcCAtIDggLSBhaCkgOiByLmJvdHRvbSArIDg7XG4gICAgY29uc3QgbGVmdCA9IE1hdGgubWF4KDgsIE1hdGgubWluKHIubGVmdCwgd2luZG93LmlubmVyV2lkdGggLSAzNjAgLSA4KSk7XG4gICAgZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgIGVsLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH07XG5cbiAgY29uc3QgaGlkZSA9ICgpOiB2b2lkID0+IHtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICBhY3RpdmVVaWQgPSBudWxsO1xuICAgIGxvY2tlZFRvID0gbnVsbDtcbiAgICBsb2NrZWQgPSBmYWxzZTtcbiAgICB0ZXh0YXJlYSA9IG51bGw7XG4gICAgZmVlZGJhY2tMaXN0ID0gbnVsbDtcbiAgICB3YW50c0ZvY3VzID0gZmFsc2U7XG4gICAgb25IaWRlKCk7XG4gIH07XG5cbiAgY29uc3QgaXNUeXBpbmcgPSAoKTogYm9vbGVhbiA9PiBCb29sZWFuKHRleHRhcmVhKSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0ZXh0YXJlYTtcbiAgY29uc3Qgc2hvdyA9IChhbmNob3I6IEVsZW1lbnQsIHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGF5bG9hZCkge1xuICAgICAgaWYgKGxvY2tlZCB8fCBpc1R5cGluZygpKSByZXR1cm47XG4gICAgICBoaWRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFNhbWUgY2FwdHVyZSDigJQgcHJlc2VydmUgdGV4dGFyZWEgY29udGVudCArIGZvY3VzLCBqdXN0IHJlZnJlc2hcbiAgICAvLyB0aGUgZmVlZGJhY2sgbGlzdC4gV2UgY29tcGFyZSBCT1RIIHVpZCBhbmQgc2VsZWN0b3Igc28gYSBzdGFsZVxuICAgIC8vIHBheWxvYWQgcG9pbnRpbmcgYXQgYSBkaWZmZXJlbnQgY2FwdHVyZSAoc2FtZSBzZWxlY3RvciwgZS5nLlxuICAgIC8vIGFsdC1ob3ZlcmluZyBhIHNpYmxpbmcgd2l0aCB0aGUgc2FtZSB0ZXN0SWQpIHRyaWdnZXJzIGEgZnVsbFxuICAgIC8vIHJlZnJlc2ggaW5zdGVhZCBvZiBwcmV0ZW5kaW5nIG5vdGhpbmcgY2hhbmdlZC5cbiAgICBpZiAoc2VsZWN0b3IgPT09IHBheWxvYWQuc2VsZWN0b3IgJiYgKHBheWxvYWQudWlkID8/IG51bGwpID09PSBhY3RpdmVVaWQpIHtcbiAgICAgIGlmIChwYXlsb2FkLmZlZWRiYWNrPy5sZW5ndGggJiYgZmVlZGJhY2tMaXN0KSB7XG4gICAgICAgIGZlZWRiYWNrTGlzdC5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHBheWxvYWQuZmVlZGJhY2spIHtcbiAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihsaS5zdHlsZSwge21hcmdpbjogJzJweCAwJywgY29sb3I6ICcjZmNmYWY1Jywgd29yZEJyZWFrOiAnYnJlYWstd29yZCd9KTtcbiAgICAgICAgICBsaS50ZXh0Q29udGVudCA9IHQ7XG4gICAgICAgICAgZmVlZGJhY2tMaXN0LmFwcGVuZChsaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gRGlmZmVyZW50IGNhcHR1cmUg4oCUIHN3aXRjaCBmdWxseS4gQWx0LWhvdmVyIG9ubHkgZmlyZXMgd2hpbGUgQWx0XG4gICAgLy8gaXMgaGVsZCwgc28gdGhpcyBvbmx5IGhhcHBlbnMgd2hlbiB0aGUgdXNlciBkZWxpYmVyYXRlbHkgbW92ZXMgdG9cbiAgICAvLyBhIG5ldyB0YXJnZXQ7IGxvc2luZyBpbi1wcm9ncmVzcyB0eXBpbmcgaXMgdGhlIGV4cGVjdGVkIGNvc3Qgb2ZcbiAgICAvLyBzd2l0Y2hpbmcuIE9uY2UgQWx0IGlzIHJlbGVhc2VkLCBtb3VzZW1vdmVzIGRvbid0IHRyaWdnZXIgaG92ZXJcbiAgICAvLyBldmVudHMsIHNvIHRoZSBib3ggZnJlZXplcyBvbiB0aGUgbGFzdCBlbGVtZW50IGFuZCB0eXBpbmcgaXMgc2FmZS5cbiAgICBzZWxlY3RvciA9IHBheWxvYWQuc2VsZWN0b3IgPz8gbnVsbDtcbiAgICBhY3RpdmVVaWQgPSBwYXlsb2FkLnVpZCA/PyBudWxsO1xuICAgIGxvY2tlZFRvID0gYW5jaG9yO1xuICAgIGJ1aWxkQm9keShwYXlsb2FkKTtcbiAgICBwb3NpdGlvbihhbmNob3IpO1xuICAgIG9uU2hvdyhhbmNob3IpO1xuICB9O1xuICAvLyBQZW5kaW5nLWZvY3VzIGZsYWc6IGlmIGZvY3VzIGlzIHJlcXVlc3RlZCBiZWZvcmUgdGhlIHRleHRhcmVhIGV4aXN0c1xuICAvLyAoZS5nLiBhbHQgd2FzIHJlbGVhc2VkIGJlZm9yZSB0aGUgYW5ub3RhdGlvbiBtZXNzYWdlIHJvdW5kLXRyaXBwZWRcbiAgLy8gYmFjayksIHdlIHNldCB0aGUgZmxhZyBhbmQgdGhlIGJ1aWxkQm9keSBjb21wbGV0aW9uIHBhdGggcGlja3MgaXQgdXAuXG4gIGxldCB3YW50c0ZvY3VzID0gZmFsc2U7XG4gIGNvbnN0IGRvRm9jdXMgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCF0ZXh0YXJlYSkgcmV0dXJuO1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0ZXh0YXJlYSkgcmV0dXJuO1xuICAgIC8vIERlZmVyIHRvIHRoZSBuZXh0IGZyYW1lIHNvIHdlIGxhbmQgQUZURVIgYW55IGZvY3VzLXN0ZWFsaW5nIGJyb3dzZXJcbiAgICAvLyBiZWhhdmlvdXIgKGUuZy4gQWx0IOKGkiBtZW51LWJhciBvbiBXaW5kb3dzKSBoYXMgc2V0dGxlZC5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKHRleHRhcmVhKSB0ZXh0YXJlYS5mb2N1cyh7cHJldmVudFNjcm9sbDogdHJ1ZX0pO1xuICAgIH0pO1xuICB9O1xuICAvLyBQdWJsaWMgaG9vazogZm9jdXMgdGhlIHRleHRhcmVhIChjYWxsZWQgb24gYWx0LXJlbGVhc2Ugc28gdHlwaW5nIGlzXG4gIC8vIGltbWVkaWF0ZSB3aXRob3V0IHRoZSB1c2VyIGhhdmluZyB0byBtb3VzZSB0byB0aGUgYm94KS5cbiAgY29uc3QgZm9jdXNUZXh0YXJlYSA9ICgpOiB2b2lkID0+IHtcbiAgICB3YW50c0ZvY3VzID0gdHJ1ZTtcbiAgICBkb0ZvY3VzKCk7XG4gIH07XG5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBsb2NrZWQgPSB0cnVlO1xuICAgIGlmICh0ZXh0YXJlYSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0ZXh0YXJlYSkgdGV4dGFyZWEuZm9jdXMoKTtcbiAgfSk7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgaWYgKHRleHRhcmVhICYmICh0ZXh0YXJlYS52YWx1ZS5sZW5ndGggPiAwIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRhcmVhKSkgcmV0dXJuO1xuICAgIGxvY2tlZCA9IGZhbHNlO1xuICB9KTtcblxuICBjb25zdCByZXBvc2l0aW9uID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChlbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snICYmIGxvY2tlZFRvPy5pc0Nvbm5lY3RlZCkgcG9zaXRpb24obG9ja2VkVG8pO1xuICB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVwb3NpdGlvbiwgdHJ1ZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXBvc2l0aW9uKTtcblxuICByZXR1cm4ge3Nob3csIGhpZGUsIGlzTG9ja2VkOiAoKSA9PiBsb2NrZWQgfHwgaXNUeXBpbmcoKSwgZm9jdXNUZXh0YXJlYX07XG59XG5cbi8vIChObyBzaGFkb3cgc3R5bGVzaGVldCDigJQgZXZlcnkgb3ZlcmxheSBlbGVtZW50IGdldHMgaXRzIHN0eWxlIGFwcGxpZWQgdmlhXG4vLyB0aGUgSlMgSFRNTEVsZW1lbnQuc3R5bGUgQVBJLCB3aGljaCBDaHJvbWUgYWxsb3dzIHVuZGVyIHN0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VztBQUFBLFFBQ3hFLElBQUksUUFBUSxVQUFVLFVBQVUsY0FBYztBQUFBLFVBQzVDLGFBQWEsZ0JBQWdCO0FBQUEsVUFDN0IsV0FBVyxLQUFLLFFBQVEsVUFBVTtBQUFBLFlBQ2hDLE1BQU0sS0FBSyxTQUFTLGNBQWMsSUFBSTtBQUFBLFlBQ3RDLE9BQU8sT0FBTyxHQUFHLE9BQU8sRUFBQyxRQUFRLFNBQVMsT0FBTyxXQUFXLFdBQVcsYUFBWSxDQUFDO0FBQUEsWUFDcEYsR0FBRyxjQUFjO0FBQUEsWUFDakIsYUFBYSxPQUFPLEVBQUU7QUFBQSxVQUN4QjtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BTUEsV0FBVyxRQUFRLFlBQVk7QUFBQSxNQUMvQixZQUFZLFFBQVEsT0FBTztBQUFBLE1BQzNCLFdBQVc7QUFBQSxNQUNYLFVBQVUsT0FBTztBQUFBLE1BQ2pCLFNBQVMsTUFBTTtBQUFBLE1BQ2YsT0FBTyxNQUFNO0FBQUE7QUFBQSxJQUtmLElBQUksYUFBYTtBQUFBLElBQ2pCLE1BQU0sVUFBVSxNQUFZO0FBQUEsTUFDMUIsSUFBSSxDQUFDO0FBQUEsUUFBVTtBQUFBLE1BQ2YsSUFBSSxTQUFTLGtCQUFrQixNQUFNLFNBQVMsa0JBQWtCO0FBQUEsUUFBVTtBQUFBLE1BRzFFLHNCQUFzQixNQUFNO0FBQUEsUUFDMUIsSUFBSTtBQUFBLFVBQVUsU0FBUyxNQUFNLEVBQUMsZUFBZSxLQUFJLENBQUM7QUFBQSxPQUNuRDtBQUFBO0FBQUEsSUFJSCxNQUFNLGdCQUFnQixNQUFZO0FBQUEsTUFDaEMsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBO0FBQUEsSUFHVixHQUFHLGlCQUFpQixjQUFjLE1BQU07QUFBQSxNQUN0QyxTQUFTO0FBQUEsTUFDVCxJQUFJLFlBQVksU0FBUyxrQkFBa0I7QUFBQSxRQUFVLFNBQVMsTUFBTTtBQUFBLEtBQ3JFO0FBQUEsSUFDRCxHQUFHLGlCQUFpQixjQUFjLE1BQU07QUFBQSxNQUN0QyxJQUFJLGFBQWEsU0FBUyxNQUFNLFNBQVMsS0FBSyxTQUFTLGtCQUFrQjtBQUFBLFFBQVc7QUFBQSxNQUNwRixTQUFTO0FBQUEsS0FDVjtBQUFBLElBRUQsTUFBTSxhQUFhLE1BQVk7QUFBQSxNQUM3QixJQUFJLEdBQUcsTUFBTSxZQUFZLFdBQVcsVUFBVTtBQUFBLFFBQWEsU0FBUyxRQUFRO0FBQUE7QUFBQSxJQUU5RSxPQUFPLGlCQUFpQixVQUFVLFlBQVksSUFBSTtBQUFBLElBQ2xELE9BQU8saUJBQWlCLFVBQVUsVUFBVTtBQUFBLElBRTVDLE9BQU8sRUFBQyxNQUFNLE1BQU0sVUFBVSxNQUFNLFVBQVUsU0FBUyxHQUFHLGNBQWE7QUFBQTsiLAogICJkZWJ1Z0lkIjogIkYzRUI0N0Y5OTk5MzM4Qjk2NDc1NkUyMTY0NzU2RTIxIiwKICAibmFtZXMiOiBbXQp9
