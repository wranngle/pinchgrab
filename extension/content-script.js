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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2RvbS50cyIsICJzcmMvdHlwZXMudHMiLCAic3JjL2x1Y2lkZS50cyIsICJzcmMvY29udGVudC1zY3JpcHQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gRE9NIGhlbHBlcnMgc2hhcmVkIGJ5IHRoZSBjb250ZW50IHNjcmlwdC4gUHVyZSBmdW5jdGlvbnMgd2hlcmUgcG9zc2libGUg4oCUXG4vLyBhbnkgRE9NLWJvdW5kIHN0YXRlIGxpdmVzIGluIHRoZSBjYWxsaW5nIG1vZHVsZS5cblxuaW1wb3J0IHR5cGUge0VudHJ5LCBSZWN0LCBNYXRjaGVkUnVsZSwgRnJhbWV3b3JrSW5mbywgQW5jZXN0b3IsIFZpZXdwb3J0LCBEb21NdXRhdGlvbn0gZnJvbSAnLi90eXBlcy50cyc7XG5cbi8vIEhvb2sgZm9yIHRoZSBjb250ZW50LXNjcmlwdC1vd25lZCBNdXRhdGlvbk9ic2VydmVyIGJ1ZmZlci4gU2V0IGJ5XG4vLyBjb250ZW50LXNjcmlwdC50cyBhdCBib290IHZpYSBgc2V0TXV0YXRpb25CdWZmZXJHZXR0ZXJgOyBudWxsYWJsZVxuLy8gYmVjYXVzZSBkb20udHMgaXMgYWxzbyBpbXBvcnRlZCBieSB0ZXN0cyAvIHN0YW5kYWxvbmUgaGFybmVzc2VzIHRoYXRcbi8vIGRvbid0IHJ1biBhbiBvYnNlcnZlci4gY2FwdHVyZUVudHJ5IHJlYWRzIHRoZSBtb3N0IHJlY2VudCAzIHJlY29yZHNcbi8vIGluIHRoZSA4LXNlY29uZCB3aW5kb3cgdmlhIHRoaXMgZ2V0dGVyICjCpzQuOCDigJQgcmVwcm8gY29udGV4dCkuXG5sZXQgbXV0YXRpb25CdWZmZXJHZXR0ZXI6ICgoKSA9PiBEb21NdXRhdGlvbltdKSB8IG51bGwgPSBudWxsO1xuZXhwb3J0IGNvbnN0IHNldE11dGF0aW9uQnVmZmVyR2V0dGVyID0gKGZuOiAoKSA9PiBEb21NdXRhdGlvbltdKTogdm9pZCA9PiB7XG4gIG11dGF0aW9uQnVmZmVyR2V0dGVyID0gZm47XG59O1xuXG4vLyAtLS0tIExpbWl0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IE1BWF9URVhUID0gMTQwO1xuY29uc3QgTUFYX1NOSVBQRVQgPSAyNjAwO1xuY29uc3QgTUFYX0FUVFIgPSAxNDA7XG5jb25zdCBNQVhfUlVMRVMgPSAxMjtcbmNvbnN0IE1BWF9QUkVWSUVXX0NTUyA9IDQyMDtcblxuLy8gLS0tLSBUaW55IHV0aWxpdGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBjYW5Fc2NhcGUgPSB0eXBlb2YgQ1NTICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQ1NTLmVzY2FwZSA9PT0gJ2Z1bmN0aW9uJztcbmV4cG9ydCBjb25zdCBlc2NhcGVDc3MgPSAodjogc3RyaW5nKTogc3RyaW5nID0+XG4gIGNhbkVzY2FwZSA/IENTUy5lc2NhcGUodikgOiBTdHJpbmcodikucmVwbGFjZSgvKFtcXFxcICM7PyUmLC4rKn4nOlwiIV4kW1xcXSgpPT58L0BdKS9nLCAnXFxcXCQxJyk7XG5cbmV4cG9ydCBjb25zdCB0cmltVGV4dCA9ICh2OiB1bmtub3duLCBtYXggPSBNQVhfVEVYVCk6IHN0cmluZyA9PlxuICBTdHJpbmcodiA/PyAnJykucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKS5zbGljZSgwLCBtYXgpO1xuXG5jb25zdCBzYWZlQ2FsbCA9IDxUPihmbjogKCkgPT4gVCwgZmFsbGJhY2s6IFQpOiBUID0+IHtcbiAgdHJ5IHsgcmV0dXJuIGZuKCk7IH0gY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbn07XG5cbmNvbnN0IHRvUG9zaXRpdmVJbnQgPSAodjogdW5rbm93bik6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBuID0gTnVtYmVyKHYpO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwID8gTWF0aC5yb3VuZChuKSA6IG51bGw7XG59O1xuXG5jb25zdCBhdHRyID0gKGVsOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgdHJpbVRleHQoZWwuZ2V0QXR0cmlidXRlKG5hbWUpLCAxMjApO1xuXG5leHBvcnQgY29uc3QgY29tcGFjdFRhcmdldCA9IChlbDogRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGxldCBvdXQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChlbC5pZCkgb3V0ICs9ICcjJyArIGVsLmlkO1xuICBpZiAoZWwuY2xhc3NMaXN0Py5sZW5ndGgpIHtcbiAgICBvdXQgKz0gJy4nICsgQXJyYXkuZnJvbShlbC5jbGFzc0xpc3QpLnNsaWNlKDAsIDQpLmpvaW4oJy4nKTtcbiAgfVxuICByZXR1cm4gdHJpbVRleHQob3V0LCAxODApO1xufTtcblxuLy8gLS0tLSBTZWxlY3RvciBidWlsZGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBEWU5BTUlDX0lEX1JFID0gL14ocmFkaXgtfGhlYWRsZXNzdWktfG11aS18YXJpYS18ZW1iZXJ8cmVhY3QtYXJpYXw6clswLTlhLXpdKzopL2k7XG5leHBvcnQgY29uc3QgaXNTdGFibGVJZCA9IChpZDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGlkIGlzIHN0cmluZyA9PlxuICBCb29sZWFuKGlkKSAmJiAhRFlOQU1JQ19JRF9SRS50ZXN0KGlkISkgJiYgIS9bOlxcc10vLnRlc3QoaWQhKSAmJiAhL15cXGQvLnRlc3QoaWQhKTtcblxuLy8gVGFpbHdpbmQgLyB1dGlsaXR5LUNTUyBjbGFzcyBub2lzZSArIENTUy1pbi1KUyBoYXNoIHByZWZpeGVzLiBBbnl0aGluZ1xuLy8gbWF0Y2hpbmcgdGhpcyBwcmVmaXgtc2V0IGlzIGZpbHRlcmVkIG91dCBvZiBzdGFibGVDbGFzc2VzKCkgc28gY3NzUGF0aCgpXG4vLyBwcmVmZXJzIHNlbWFudGljIGNsYXNzZXMuXG4vL1xuLy8gU291cmNlLW9mLXRydXRoIGZpbHRlcjpcbi8vICDigKIgVGFpbHdpbmQgdXRpbGl0eSBwcmVmaXhlcyAoZmxleCwgZ3JpZCwgdy0sIGgtLCB0cmFuc2l0aW9uLCBkdXJhdGlvbi0sIOKApilcbi8vICDigKIgUHNldWRvLXN0YXRlIHByZWZpeGVzIChob3ZlcjosIGZvY3VzOiwgc206LCBkYXJrOilcbi8vICDigKIgQ1NTLWluLUpTIGhhc2ggY2xhc3NlcyAoY3NzLSwgc2MtLCBlbW90aW9uLSwgY2hha3JhLSwganNzMTIzLCBtYWtlU3R5bGVzLSxcbi8vICAgIE11aUJveC0sIF9uZXh0LSwgLS0pIOKAlCBhZGRlZCAyMDI2IGZyb20gY3NzLXNlbGVjdG9yLWdlbmVyYXRvcidzXG4vLyAgICBgaWdub3JlR2VuZXJhdGVkQ2xhc3NOYW1lc2AgZGVmYXVsdHMuXG5jb25zdCBVVElMSVRZX0NMQVNTX1JFID1cbiAgL14oZmxleHxncmlkfGJsb2NrfGlubGluZXxoaWRkZW58cmVsYXRpdmV8YWJzb2x1dGV8Zml4ZWR8c3RpY2t5fHctfGgtfHAtfG0tfHB4LXxweS18cHQtfHBiLXxwbC18cHItfG14LXxteS18bXQtfG1iLXxtbC18bXItfGdhcC18c3BhY2UtfHRleHQtfGZvbnQtfGxlYWRpbmctfHRyYWNraW5nLXxiZy18Ym9yZGVyfHJvdW5kZWR8c2hhZG93fG9wYWNpdHl8Y3Vyc29yLXxzZWxlY3QtfHBvaW50ZXItfG92ZXJmbG93fHdoaXRlc3BhY2V8dHJ1bmNhdGV8aXRlbXMtfGp1c3RpZnktfGNvbnRlbnQtfHNlbGYtfHBsYWNlLXx6LXx0b3AtfGxlZnQtfHJpZ2h0LXxib3R0b20tfG1pbi18bWF4LXxhc3BlY3QtfG9iamVjdC18aW5zZXQtfG9yZGVyLXxjb2wtfHJvdy18Z2FwfGhvdmVyOnxmb2N1czp8YWN0aXZlOnxkaXNhYmxlZDp8c206fG1kOnxsZzp8eGw6fDJ4bDp8ZGFyazp8Zmlyc3R8bGFzdHxvZGR8ZXZlbnxncm91cHxwZWVyfHRyYW5zaXRpb258ZHVyYXRpb24tfGRlbGF5LXxlYXNlLXxhbmltYXRlLXx0cmFuc2Zvcm18c2NhbGUtfHJvdGF0ZS18dHJhbnNsYXRlLXxza2V3LXxvcmlnaW4tfHJpbmctfGRpdmlkZS18b3V0bGluZS18ZmlsbC18c3Ryb2tlLXxmcm9tLXx0by18dmlhLXxwbGFjZWhvbGRlci18Y2FyZXQtfGFjY2VudC18YXBwZWFyYW5jZS18YmFja2Ryb3AtfGNsaXAtfGNvbnRhaW4tfGRlY29yYXRpb24tfHVuZGVybGluZXxsaW5lLXxsaXN0LXx0YWJ1bGFyfG51bXN8cHJvc2V8bm90LXxtb3Rpb24tfGlzb2xhdGV8aXNvbGF0aW9ufHdpbGwtfGFudGlhbGlhc2VkfHN1YnBpeGVsLXxzci1vbmx5fGZsb2F0LXxjbGVhci18cmVzaXplLXxzY3JvbGwtfHNuYXAtfHRvdWNoLXxpbnZpc2libGV8dmlzaWJsZXxjc3MtfHNjLVthLXowLTldfGVtb3Rpb24tfGNoYWtyYS18anNzXFxkK3xtYWtlU3R5bGVzLXxNdWlCb3gtfF9uZXh0LXxNdWlCdXR0b25CYXNlLXzPgWRfX3xfX3dhYl98d2FiX3xwbHNtYy0pL2k7XG5cbmNvbnN0IHN0YWJsZUNsYXNzZXMgPSAoZWw6IEVsZW1lbnQsIG1heCA9IDIpOiBzdHJpbmdbXSA9PiB7XG4gIGlmICghZWwuY2xhc3NMaXN0KSByZXR1cm4gW107XG4gIGNvbnN0IGFsbCA9IEFycmF5LmZyb20oZWwuY2xhc3NMaXN0KTtcbiAgY29uc3Qgc3RhYmxlID0gYWxsLmZpbHRlcigoYykgPT4gIVVUSUxJVFlfQ0xBU1NfUkUudGVzdChjKSk7XG4gIGlmIChzdGFibGUubGVuZ3RoKSByZXR1cm4gc3RhYmxlLnNsaWNlKDAsIG1heCk7XG4gIHJldHVybiBhbGwuc2xpY2UoMCwgMSk7XG59O1xuXG5jb25zdCBpc1VuaXF1ZSA9IChzY29wZTogUGFyZW50Tm9kZSwgc2VsZWN0b3I6IHN0cmluZywgdGFyZ2V0OiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIHJldHVybiBtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSB0YXJnZXQ7XG4gIH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbn07XG5cbmNvbnN0IG93bkRlc2NyaXB0b3IgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICBsZXQgcyA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGMgPSBzdGFibGVDbGFzc2VzKGVsKTtcbiAgaWYgKGMubGVuZ3RoKSBzICs9ICcuJyArIGMubWFwKGVzY2FwZUNzcykuam9pbignLicpO1xuICByZXR1cm4gcztcbn07XG5cbi8vIEJ1aWxkIHRoZSBzaG9ydGVzdCBDU1Mgc2VsZWN0b3IgdGhhdCB1bmlxdWVseSBpZGVudGlmaWVzIGBlbGAgb24gdGhlIHBhZ2UuXG4vLyBTdHJhdGVneSAoZWFjaCBjYW5kaWRhdGUgdGVzdGVkIHdpdGggcXVlcnlTZWxlY3RvckFsbCBmb3IgdW5pcXVlbmVzcyk6XG4vL1xuLy8gICAxLiB0YWcuc2VtYW50aWNDbGFzcyDigJQgcGFnZS13aWRlIHVuaXF1ZSAoZS5nLiBgaGVhZGVyLnN0aWNreWApLlxuLy8gICAyLiAjc3RhYmxlQW5jZXN0b3JJZCB0YWcuc2VtYW50aWNDbGFzcyDigJQgaWYgYSBzdGFibGUtaWQgYW5jZXN0b3IgZXhpc3RzLlxuLy8gICAzLiBGdWxsIGRlc2NlbmRhbnQgcGF0aDsgVEhFTiBydW4gb3B0aW1pemUoKSDigJQgdHJ5IHJlbW92aW5nIGVhY2ggaW50ZXJpb3Jcbi8vICAgICAgc2VnbWVudCBvbmUgYXQgYSB0aW1lIGFuZCBrZWVwIHRoZSByZXN1bHQgaWYgaXQncyBzdGlsbCB1bmlxdWUuXG4vLyAgICAgIEluc3BpcmVkIGJ5IGFudG9ubWVkdi9maW5kZXIncyBvcHRpbWl6ZSBsb29wLiBEcm9wcyBlLmcuIGBib2R5ID4gbWFpbiA+XG4vLyAgICAgIHNlY3Rpb24ueCA+IGRpdi53cmFwID4gaDEuYnJhbmRgIHRvIGBtYWluID4gaDEuYnJhbmRgIHdoZW4gbWlkZGxlXG4vLyAgICAgIHNlZ21lbnRzIGRvbid0IGNvbnN0cmFpbiB1bmlxdWVuZXNzLlxuLy9cbi8vIEVtcGlyaWNhbGx5IChhdWRpdCBvbiB3cmFubmdsZS5jb20pIHRoaXMgZHJvcHMgdHlwaWNhbCBzZWxlY3RvciB0b2tlbnNcbi8vIGZyb20gfjcwIGNoYXJzIHRvIH4xNS0yNSBjaGFycyB3aXRob3V0IHNhY3JpZmljaW5nIHJlc29sdmFiaWxpdHkuXG5jb25zdCBwYXJ0c1RvU2VsZWN0b3IgPSAocGFydHM6IHN0cmluZ1tdLCBhbmNob3I6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgPT5cbiAgYW5jaG9yID8gYCR7YW5jaG9yfSAke3BhcnRzLmpvaW4oJyA+ICcpfWAgOiBwYXJ0cy5qb2luKCcgPiAnKTtcblxuY29uc3Qgb3B0aW1pemVQYXRoID0gKHBhcnRzOiBzdHJpbmdbXSwgYW5jaG9yOiBzdHJpbmcgfCBudWxsLCB0YXJnZXQ6IEVsZW1lbnQsIHNjb3BlOiBEb2N1bWVudCB8IFNoYWRvd1Jvb3QpOiBzdHJpbmdbXSA9PiB7XG4gIC8vIERvbid0IHRvdWNoIHRoZSBoZWFkICh0aGUgbGVhZiBlbGVtZW50IGRlc2NyaXB0b3IpIG9yLCBpZiB0aGVyZSdzIG5vXG4gIC8vIGFuY2hvciwgdGhlIHZlcnkgZmlyc3Qgc2VnbWVudCB0aGF0IGFuY2hvcnMgdGhlIHBhdGguIFRyeSByZW1vdmluZyBlYWNoXG4gIC8vIGludGVyaW9yIHNlZ21lbnQ7IGtlZXAgdGhlIHNob3J0ZXIgZm9ybSBpZiB0aGUgc2VsZWN0b3Igc3RpbGwgcmVzb2x2ZXNcbiAgLy8gdG8gYSB1bmlxdWUgdGFyZ2V0LlxuICBsZXQgYmVzdCA9IHBhcnRzO1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChpIDwgYmVzdC5sZW5ndGggLSAxKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gWy4uLmJlc3Quc2xpY2UoMCwgaSksIC4uLmJlc3Quc2xpY2UoaSArIDEpXTtcbiAgICBpZiAoY2FuZGlkYXRlLmxlbmd0aCA9PT0gMCkgeyBpKys7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGlzVW5pcXVlKHNjb3BlLCBwYXJ0c1RvU2VsZWN0b3IoY2FuZGlkYXRlLCBhbmNob3IpLCB0YXJnZXQpKSB7XG4gICAgICBiZXN0ID0gY2FuZGlkYXRlO1xuICAgICAgLy8gcmVzdGFydCBmcm9tIHN0YXJ0IG9mIHRyaW1tZWQgcGF0aFxuICAgICAgaSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3Q7XG59O1xuXG5leHBvcnQgY29uc3QgY3NzUGF0aCA9IChlbDogRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGlmIChpc1N0YWJsZUlkKGVsLmlkKSkgcmV0dXJuICcjJyArIGVzY2FwZUNzcyhlbC5pZCk7XG5cbiAgLy8gU2hhZG93LXJvb3RlZCBlbGVtZW50cyBhcmVuJ3QgcmVhY2hhYmxlIHZpYSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcmAsIHNvXG4gIC8vIHRoZSB1bmlxdWVuZXNzIGNoZWNrcyBtdXN0IHNjb3BlIHRvIHRoZSBvd25pbmcgcm9vdC4gT3RoZXJ3aXNlIGV2ZXJ5XG4gIC8vIHByb2JlIGZhbGxzIGJhY2sgdG8gYSBmdWxsIGRlc2NlbmRhbnQgcGF0aCB0aGF0IGNsaW1icyB0byBgYm9keWAg4oCUXG4gIC8vIHdoaWNoIGl0IGNhbiBuZXZlciByZWFjaCBiZWNhdXNlIG9mIHRoZSBzaGFkb3cgYm91bmRhcnkg4oCUIGFuZCB0aGVcbiAgLy8gc2VsZWN0b3IgZW5kcyB1cCBvdmVyLXNwZWNpZmllZCBvciBub25zZW5zZS5cbiAgY29uc3Qgcm9vdE5vZGUgPSBlbC5nZXRSb290Tm9kZSgpO1xuICBjb25zdCBjc3NTY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290ID0gcm9vdE5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdE5vZGUgOiBkb2N1bWVudDtcbiAgY29uc3Qgc2NvcGVCb3VuZGFyeTogTm9kZSA9IHJvb3ROb2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3ROb2RlIDogZG9jdW1lbnQuYm9keTtcblxuICAvLyBGaW5kIHRoZSBuZWFyZXN0IHN0YWJsZS1pZCBhbmNlc3RvciBhcyBhbiBhbmNob3IgY2FuZGlkYXRlLlxuICBsZXQgYW5jaG9ySWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgYW5jaG9yRWw6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICB3aGlsZSAoY3VyICYmIGN1ciAhPT0gc2NvcGVCb3VuZGFyeSkge1xuICAgIGlmIChpc1N0YWJsZUlkKGN1ci5pZCkpIHtcbiAgICAgIGFuY2hvcklkID0gJyMnICsgZXNjYXBlQ3NzKGN1ci5pZCk7XG4gICAgICBhbmNob3JFbCA9IGN1cjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuXG4gIGNvbnN0IG93biA9IG93bkRlc2NyaXB0b3IoZWwpO1xuXG4gIC8vIENhbmRpZGF0ZSAxOiBvd24gZGVzY3JpcHRvciBhbG9uZSwgaWYgaXQncyBwYWdlLXdpZGUgdW5pcXVlLlxuICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIG93biwgZWwpKSByZXR1cm4gb3duO1xuXG4gIC8vIENhbmRpZGF0ZSAyOiBhbmNob3IgKyBvd24gZGVzY3JpcHRvci5cbiAgaWYgKGFuY2hvcklkKSB7XG4gICAgY29uc3QgYzIgPSBgJHthbmNob3JJZH0gJHtvd259YDtcbiAgICBpZiAoaXNVbmlxdWUoYW5jaG9yRWwhLCBvd24sIGVsKSB8fCBpc1VuaXF1ZShjc3NTY29wZSwgYzIsIGVsKSkgcmV0dXJuIGMyO1xuICB9XG5cbiAgLy8gQ2FuZGlkYXRlIDIuNSDigJQgQVJJQS1hbmNob3JlZCBzZWxlY3RvcnMuIEJlZm9yZSBmYWxsaW5nIHRocm91Z2ggdG9cbiAgLy8gYnJpdHRsZSBgOm50aC1vZi10eXBlYCBjaGFpbnMgdGhlIHJvYXN0IGNhbGxlZCBvdXQgKMKnMi41KSwgdHJ5XG4gIC8vIGFuY2hvcmluZyBhdCBzZW1hbnRpY2FsbHktbmFtZWQgbWFya2VycyBhbiBMTE0gb3IgaHVtYW4gY2FuIHJlYWQ6XG4gIC8vXG4gIC8vICAg4oCiIHRoZSBlbGVtZW50J3Mgb3duIGFyaWEtbGFiZWwgLyByb2xlXG4gIC8vICAg4oCiIGEgbmVhcmJ5IGFuY2VzdG9yJ3MgYXJpYS1sYWJlbCAvIHJvbGVcbiAgLy9cbiAgLy8gU2VsZWN0b3JzIGxpa2UgYFthcmlhLWxhYmVsPVwiUGlwZWxpbmUgdHJlbmRcIl0gLnNwYXJrLXdyYXBgIGFyZVxuICAvLyBib3RoIHN0YWJsZS1hZ2FpbnN0LURPTS1zaHVmZmxlIEFORCBodW1hbi1yZWFkYWJsZSBpbiBhIHdheSB0aGF0XG4gIC8vIGBkaXYuc3RhdDpudGgtb2YtdHlwZSgxKSA+IGRpdi5zdGF0X19zcGFyazpudGgtb2YtdHlwZSg0KSA+IHNwYW5gIGlzXG4gIC8vIG5vdC4gQ2FwIHRoZSBjaGFpbiBkZXB0aCBzbyB3ZSBkb24ndCB3YWxrIHBhc3QgYSBtZWFuaW5nZnVsIGJvdW5kYXJ5LlxuICBjb25zdCBhcmlhUXVvdGVkID0gKHZhbDogc3RyaW5nKTogc3RyaW5nID0+ICdcIicgKyB2YWwucmVwbGFjZSgvW1xcXFxcIl0vZywgJ1xcXFwkJicpICsgJ1wiJztcbiAgY29uc3QgYXJpYVNlbGVjdG9yID0gKGU6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBjb25zdCBsYWJlbCA9IGUuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgaWYgKGxhYmVsICYmIGxhYmVsLmxlbmd0aCA+IDAgJiYgbGFiZWwubGVuZ3RoIDwgODApIHtcbiAgICAgIHJldHVybiBgW2FyaWEtbGFiZWw9JHthcmlhUXVvdGVkKGxhYmVsKX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIC8vIFRyeSBhbiBBUklBLWFuY2hvcmVkIHNlbGVjdG9yIGZvciBUSElTIGVsZW1lbnQgZmlyc3QuXG4gIGNvbnN0IG93bkFyaWEgPSBhcmlhU2VsZWN0b3IoZWwpO1xuICBpZiAob3duQXJpYSAmJiBpc1VuaXF1ZShjc3NTY29wZSwgb3duQXJpYSwgZWwpKSByZXR1cm4gb3duQXJpYTtcbiAgLy8gV2FsayB1cCB0byA0IGFuY2VzdG9ycyBhbmQgdHJ5IGBbYXJpYS1sYWJlbD1cIuKAplwiXSB0YWcuY2xzYC4gU3RvcCBhdCB0aGVcbiAgLy8gYW5jaG9yRWwgaWYgd2UgZm91bmQgb25lIOKAlCBhbnl0aGluZyBhYm92ZSBpcyBhbHJlYWR5IGNvdmVyZWQuXG4gIGxldCBhcmlhQ3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gIGxldCBkZXB0aCA9IDA7XG4gIHdoaWxlIChhcmlhQ3VyICYmIGRlcHRoIDwgNCAmJiBhcmlhQ3VyICE9PSBzY29wZUJvdW5kYXJ5ICYmIGFyaWFDdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgYSA9IGFyaWFTZWxlY3RvcihhcmlhQ3VyKTtcbiAgICBpZiAoYSkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YX0gJHtvd259YDtcbiAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwgY2FuZGlkYXRlLCBlbCkpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfVxuICAgIGFyaWFDdXIgPSBhcmlhQ3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgZGVwdGgrKztcbiAgfVxuXG4gIC8vIENhbmRpZGF0ZSAyLjYg4oCUIHJvbGUgKyBuYW1lIGFuY2hvci4gQVJJQS1vbmx5IGxhYmVscyBjYXVnaHQgYWJvdmU7IHRoaXNcbiAgLy8gdGllciBoYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZSBhbmNlc3RvciBoYXMgQk9USCBhIGByb2xlYCBhbmQgYW5cbiAgLy8gYGFyaWEtbGFiZWxgIChvciBgZGF0YS10ZXN0aWRgKS4gU2VsZWN0b3IgaXMgbW9yZSBzcGVjaWZpYyBhbmRcbiAgLy8gZG9lc24ndCByaXNrIGNvbGxpZGluZyB3aGVuIHR3byBsYWJlbHMgaGFwcGVuIHRvIG1hdGNoIGFjcm9zcyByb2xlcy5cbiAgY29uc3Qgcm9sZU5hbWVTZWxlY3RvciA9IChlOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgcm9sZSA9IGUuZ2V0QXR0cmlidXRlKCdyb2xlJyk7XG4gICAgY29uc3QgbGFiZWwgPSBlLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgIGlmIChyb2xlICYmIGxhYmVsICYmIGxhYmVsLmxlbmd0aCA8IDgwKSB7XG4gICAgICByZXR1cm4gYFtyb2xlPSR7YXJpYVF1b3RlZChyb2xlKX1dW2FyaWEtbGFiZWw9JHthcmlhUXVvdGVkKGxhYmVsKX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGxldCBybkN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBkZXB0aCA9IDA7XG4gIHdoaWxlIChybkN1ciAmJiBkZXB0aCA8IDQgJiYgcm5DdXIgIT09IHNjb3BlQm91bmRhcnkgJiYgcm5DdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgYSA9IHJvbGVOYW1lU2VsZWN0b3Iocm5DdXIpO1xuICAgIGlmIChhKSB7XG4gICAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHthfSAke293bn1gO1xuICAgICAgaWYgKGlzVW5pcXVlKGNzc1Njb3BlLCBjYW5kaWRhdGUsIGVsKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICB9XG4gICAgcm5DdXIgPSBybkN1ci5wYXJlbnRFbGVtZW50O1xuICAgIGRlcHRoKys7XG4gIH1cblxuICAvLyBDYW5kaWRhdGUgMi43IOKAlCB1bmlxdWUtY2xhc3MtYW5jZXN0b3IgYW5jaG9yICjCpzIuNSBzZWxlY3RvciBsYWRkZXIpLlxuICAvLyBXYWxrIGFuY2VzdG9ycyBsb29raW5nIGZvciBvbmUgd2hvc2UgY2xhc3MgY2hhaW4gKHZpYSBzdGFibGVDbGFzc2VzKVxuICAvLyBpcyB1bmlxdWUgb24gdGhlIHBhZ2U7IHVzZSBpdCBhcyBgLnVuaXF1ZS1jbGFzcyBvd25gLiBGaXhlcyB0aGUgY2FzZVxuICAvLyB3aGVyZSB0aGUgZWxlbWVudHMgYmV0d2VlbiB0aGUgY2FwdHVyZWQgbm9kZSBhbmQgdGhlIGRvY3VtZW50IGhhdmVcbiAgLy8gbm8gYXJpYS90ZXN0aWQvaWQsIGJ1dCBPTkUgb2YgdGhlbSBjYXJyaWVzIGEgbWVhbmluZ2Z1bCBzZW1hbnRpY1xuICAvLyBjbGFzcyAoYC5hdHRlbnRpb24tYmFubmVyYCwgYC5taXNzaW9uLXN0YXRzYCkuXG4gIGxldCB1Y0N1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBkZXB0aCA9IDA7XG4gIHdoaWxlICh1Y0N1ciAmJiBkZXB0aCA8IDYgJiYgdWNDdXIgIT09IHNjb3BlQm91bmRhcnkgJiYgdWNDdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgY2xzID0gc3RhYmxlQ2xhc3Nlcyh1Y0N1cik7XG4gICAgaWYgKGNscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGFuY0Rlc2NyaXB0b3IgPSBgJHt1Y0N1ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpfS4ke2Nscy5tYXAoZXNjYXBlQ3NzKS5qb2luKCcuJyl9YDtcbiAgICAgIC8vIGAuY2xzYCAod2l0aG91dCB0aGUgdGFnIHByZWZpeCkgaXMgc2hvcnRlciBhbmQgcmVhZHMgYmV0dGVyIHdoZW5cbiAgICAgIC8vIHRoZSBhbmNlc3RvcidzIGNsYXNzIGlzIHBhZ2UtdW5pcXVlIG9uIGl0cyBvd24uXG4gICAgICBjb25zdCBqdXN0Q2xzID0gJy4nICsgY2xzLm1hcChlc2NhcGVDc3MpLmpvaW4oJy4nKTtcbiAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwganVzdENscywgdWNDdXIpKSB7XG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2p1c3RDbHN9ICR7b3dufWA7XG4gICAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwgY2FuZGlkYXRlLCBlbCkpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgICB9XG4gICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGFuY0Rlc2NyaXB0b3IsIHVjQ3VyKSkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHthbmNEZXNjcmlwdG9yfSAke293bn1gO1xuICAgICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGNhbmRpZGF0ZSwgZWwpKSByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgfVxuICAgIH1cbiAgICB1Y0N1ciA9IHVjQ3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgZGVwdGgrKztcbiAgfVxuXG4gIC8vIENhbmRpZGF0ZSAzOiBmdWxsIGRlc2NlbmRhbnQgcGF0aCwgdGhlbiBvcHRpbWl6ZS5cbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGN1ciA9IGVsO1xuICB3aGlsZSAoY3VyICYmIGN1ci5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY3VyICE9PSBzY29wZUJvdW5kYXJ5KSB7XG4gICAgaWYgKGN1ciAhPT0gZWwgJiYgaXNTdGFibGVJZChjdXIuaWQpKSBicmVhaztcbiAgICBsZXQgcyA9IGN1ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGNscyA9IHN0YWJsZUNsYXNzZXMoY3VyKTtcbiAgICBpZiAoY2xzLmxlbmd0aCkgcyArPSAnLicgKyBjbHMubWFwKGVzY2FwZUNzcykuam9pbignLicpO1xuICAgIGNvbnN0IHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBjb25zdCBzYW1lVGFnID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoc2liKSA9PiBzaWIubm9kZU5hbWUgPT09IGN1ciEubm9kZU5hbWUpO1xuICAgICAgaWYgKHNhbWVUYWcubGVuZ3RoID4gMSkgcyArPSBgOm50aC1vZi10eXBlKCR7c2FtZVRhZy5pbmRleE9mKGN1cikgKyAxfSlgO1xuICAgIH1cbiAgICBwYXJ0cy51bnNoaWZ0KHMpO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIGlmICghcGFydHMubGVuZ3RoKSByZXR1cm4gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZVBhdGgocGFydHMsIGFuY2hvcklkLCBlbCwgY3NzU2NvcGUpO1xuICByZXR1cm4gcGFydHNUb1NlbGVjdG9yKG9wdGltaXplZCwgYW5jaG9ySWQpO1xufTtcblxuLy8gLS0tLSBOYW1pbmcsIHJvbGVzLCBhbmNlc3RvcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJvbGVzIHdob3NlIGFjY2Vzc2libGVOYW1lIGlzLCBwZXIgdGhlIEFjY05hbWUgYWxnb3JpdGhtLCB0aGUgcmVjdXJzaXZlXG4vLyBjb25jYXRlbmF0aW9uIG9mIGV2ZXJ5IGRlc2NlbmRhbnQncyBhY2Nlc3NpYmxlIHRleHQuIEZvciB0aGVzZSB0aGUgZmllbGRcbi8vIGJlY29tZXMgYSB1c2VsZXNzIDIwMC1jaGFyIGR1bXAgb2YgdGhlIHdob2xlIHN1YnRyZWUgKG9mdGVuIHRydW5jYXRlZFxuLy8gbWlkLXdvcmQpLiBXZSBPTkxZIHN1cmZhY2UgYW4gZXhwbGljaXQgYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZvclxuLy8gY29udGFpbmVyIHJvbGVzIOKAlCBvdGhlcndpc2UgbGVhdmUgaXQgZW1wdHkgYW5kIGxldCB0aGUgTExNIHJlYWQgdGhlXG4vLyBjaGlsZHJlbiBzZXBhcmF0ZWx5LlxuY29uc3QgQ09OVEFJTkVSX1JPTEVTID0gbmV3IFNldChbXG4gICdncm91cCcsICdyZWdpb24nLCAnbGlzdCcsICdsaXN0Ym94JywgJ2dyaWQnLCAnZ3JpZGNlbGwnLCAncm93Z3JvdXAnLFxuICAncm93JywgJ3RhYmxlJywgJ21haW4nLCAnbmF2aWdhdGlvbicsICdiYW5uZXInLCAnY29udGVudGluZm8nLFxuICAnY29tcGxlbWVudGFyeScsICd0YWJwYW5lbCcsICdhcnRpY2xlJywgJ3NlY3Rpb24nLCAnZG9jdW1lbnQnLFxuICAnZmVlZCcsICdmaWd1cmUnLCAnZm9ybScsXG5dKTtcblxuLy8gUmVzb2x2ZSB0ZXh0IHRoZSBhY2NuYW1lIGFsZ29yaXRobSBwdWxscyBmcm9tIHJlZmVyZW5jZWQgZWxlbWVudHMuIFVzZWRcbi8vIGZvciBib3RoIGBhcmlhLWxhYmVsbGVkYnlgIChwcmlvcml0eSkgYW5kIGA8bGFiZWwgZm9yPVwiaWRcIj5gIGFzc29jaWF0aW9uXG4vLyAoZm9ybS1jb250cm9sIGZhbGxiYWNrKS4gSWRzIGluIGlkcmVmcyBhcmUgc3BhY2Utc2VwYXJhdGVkOyBlYWNoIHJlZidzXG4vLyByZXNvbHZlZCB0ZXh0IGlzIGpvaW5lZCBieSBhIHNpbmdsZSBzcGFjZS5cbmNvbnN0IGNvbGxlY3RJZFJlZlRleHQgPSAocmVmczogc3RyaW5nLCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290KTogc3RyaW5nID0+IHtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaWQgb2YgcmVmcy5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBub2RlID0gc2NvcGUuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKG5vZGUpIHBhcnRzLnB1c2godHJpbVRleHQobm9kZS50ZXh0Q29udGVudCwgMTgwKSk7XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIH1cbiAgcmV0dXJuIHBhcnRzLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XG59O1xuXG5jb25zdCBhY2Nlc3NpYmxlTmFtZSA9IChlbDogRWxlbWVudCwgcm9sZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyA9PiB7XG4gIC8vIFByaW9yaXR5IGZvbGxvd3MgdGhlIGFjY25hbWUgYWxnb3JpdGhtIChzaW1wbGlmaWVkKTpcbiAgLy8gICAxLiBhcmlhLWxhYmVsbGVkYnkg4oCUIHJlc29sdmVkIHRleHQgb2YgZXZlcnkgcmVmZXJlbmNlZCBpZC5cbiAgLy8gICAyLiBhcmlhLWxhYmVsIOKAlCBkaXJlY3Qgc3RyaW5nLlxuICAvLyAgIDMuIEZvciBmb3JtIGNvbnRyb2xzOiBhc3NvY2lhdGVkIDxsYWJlbD4gKGVpdGhlciBgPGxhYmVsIGZvcj1JRD5gXG4gIC8vICAgICAgT1IgYW4gYW5jZXN0b3IgPGxhYmVsPiB0aGF0IHdyYXBzIHRoZSBjb250cm9sKS4gRXZlcnlcbiAgLy8gICAgICBmcmFtZXdvcmsgd2VhdGhlciBhcHAgcGFpcnMgdGhlIHNlYXJjaCBpbnB1dCB3aXRoIGFcbiAgLy8gICAgICB2aXN1YWxseS1oaWRkZW4gbGFiZWw7IHdpdGhvdXQgZm9sbG93aW5nIHRoZSBsaW5rIFBpbmNoR3JhYlxuICAvLyAgICAgIHJldHVybnMgYW4gZW1wdHkgYWNjZXNzaWJsZU5hbWUuXG4gIC8vICAgNC4gdGl0bGUgLyBhbHQgLyBwbGFjZWhvbGRlciAob25seSB3aGVuIG5vbmUgb2YgdGhlIGFib3ZlIGhpdCkuXG4gIC8vICAgNS4gdGV4dENvbnRlbnQgKHN1cHByZXNzZWQgZm9yIGNvbnRhaW5lciByb2xlcyB3aG9zZSBhY2NuYW1lXG4gIC8vICAgICAgd291bGQgb3RoZXJ3aXNlIGJlIGEgMjAwLWNoYXIgc3VidHJlZSBkdW1wKS5cbiAgY29uc3QgbGFiZWxsZWRieSA9IGF0dHIoZWwsICdhcmlhLWxhYmVsbGVkYnknKTtcbiAgaWYgKGxhYmVsbGVkYnkpIHtcbiAgICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgICBjb25zdCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290ID0gcm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgPyByb290IDogZG9jdW1lbnQ7XG4gICAgY29uc3QgdGV4dCA9IGNvbGxlY3RJZFJlZlRleHQobGFiZWxsZWRieSwgc2NvcGUpO1xuICAgIGlmICh0ZXh0KSByZXR1cm4gdHJpbVRleHQodGV4dCwgMTgwKTtcbiAgfVxuICBjb25zdCBhcmlhTGFiZWwgPSBhdHRyKGVsLCAnYXJpYS1sYWJlbCcpO1xuICBpZiAoYXJpYUxhYmVsKSByZXR1cm4gdHJpbVRleHQoYXJpYUxhYmVsLCAxODApO1xuXG4gIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaXNGb3JtQ29udHJvbCA9IHRhZyA9PT0gJ2lucHV0JyB8fCB0YWcgPT09ICdzZWxlY3QnIHx8IHRhZyA9PT0gJ3RleHRhcmVhJyB8fCB0YWcgPT09ICdidXR0b24nIHx8IHRhZyA9PT0gJ21ldGVyJyB8fCB0YWcgPT09ICdwcm9ncmVzcycgfHwgdGFnID09PSAnb3V0cHV0JztcbiAgaWYgKGlzRm9ybUNvbnRyb2wpIHtcbiAgICBpZiAoZWwuaWQpIHtcbiAgICAgIGNvbnN0IHJvb3QgPSBlbC5nZXRSb290Tm9kZSgpO1xuICAgICAgY29uc3Qgc2NvcGU6IERvY3VtZW50IHwgU2hhZG93Um9vdCA9IHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdCA6IGRvY3VtZW50O1xuICAgICAgbGV0IGxhYmVsRm9yOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgICB0cnkgeyBsYWJlbEZvciA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj1cIiR7ZXNjYXBlQ3NzKGVsLmlkKX1cIl1gKTsgfSBjYXRjaCB7IC8qIGludmFsaWQgaWQgKi8gfVxuICAgICAgaWYgKGxhYmVsRm9yKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0cmltVGV4dChsYWJlbEZvci50ZXh0Q29udGVudCwgMTgwKTtcbiAgICAgICAgaWYgKHRleHQpIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgbGFiZWxQYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZSAobGFiZWxQYXJlbnQpIHtcbiAgICAgIGlmIChsYWJlbFBhcmVudC50YWdOYW1lID09PSAnTEFCRUwnKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0cmltVGV4dChsYWJlbFBhcmVudC50ZXh0Q29udGVudCwgMTgwKTtcbiAgICAgICAgaWYgKHRleHQpIHJldHVybiB0ZXh0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxhYmVsUGFyZW50ID0gbGFiZWxQYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gIH1cblxuICBjb25zdCB0aXRsZUF0dHIgPSBhdHRyKGVsLCAndGl0bGUnKTtcbiAgaWYgKHRpdGxlQXR0cikgcmV0dXJuIHRyaW1UZXh0KHRpdGxlQXR0ciwgMTgwKTtcbiAgY29uc3QgYWx0QXR0ciA9IGF0dHIoZWwsICdhbHQnKTtcbiAgaWYgKGFsdEF0dHIpIHJldHVybiB0cmltVGV4dChhbHRBdHRyLCAxODApO1xuICBjb25zdCBwbGFjZWhvbGRlckF0dHIgPSBhdHRyKGVsLCAncGxhY2Vob2xkZXInKTtcbiAgaWYgKHBsYWNlaG9sZGVyQXR0cikgcmV0dXJuIHRyaW1UZXh0KHBsYWNlaG9sZGVyQXR0ciwgMTgwKTtcbiAgaWYgKHJvbGUgJiYgQ09OVEFJTkVSX1JPTEVTLmhhcyhyb2xlKSkgcmV0dXJuICcnO1xuXG4gIGlmICghaXNOYW1lRnJvbUNvbnRlbnQoZWwsIHRhZywgcm9sZSkpIHJldHVybiAnJztcbiAgcmV0dXJuIHRyaW1UZXh0KGVsLnRleHRDb250ZW50LCAxODApO1xufTtcblxuLy8gVGFncyB3aG9zZSBpbXBsaWNpdCByb2xlIGhhcyBcIk5hbWUgZnJvbTogY29udGVudHNcIiBpbiB0aGUgQVJJQSBzcGVjLlxuLy8gVGhlc2UgYXJlIGxlYWYtaXNoIG9yIG5hdHVyYWxseS1sYWJlbGVkLWJ5LWNoaWxkcmVuIGVsZW1lbnRzOyBjYXB0dXJpbmdcbi8vIG9uZSBtZWFucyB0aGUgdXNlciB3YW50cyB0aGUgcmVuZGVyZWQgdGV4dCBhcyB0aGUgbmFtZS5cbmNvbnN0IE5BTUVfRlJPTV9DT05URU5UX1RBR1MgPSBuZXcgU2V0KFtcbiAgJ2EnLCAnYnV0dG9uJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JyxcbiAgJ3N1bW1hcnknLCAndGgnLCAndGQnLCAnY2FwdGlvbicsICdmaWdjYXB0aW9uJywgJ2xlZ2VuZCcsICdsYWJlbCcsXG4gICdvcHRpb24nLCAnb3V0cHV0JywgJ2R0Jyxcbl0pO1xuLy8gRXhwbGljaXQgQVJJQSByb2xlcyBpbiBcIk5hbWUgZnJvbTogY29udGVudHNcIi5cbmNvbnN0IE5BTUVfRlJPTV9DT05URU5UX1JPTEVTID0gbmV3IFNldChbXG4gICdidXR0b24nLCAnY2VsbCcsICdjaGVja2JveCcsICdjb2x1bW5oZWFkZXInLCAnZ3JpZGNlbGwnLCAnaGVhZGluZycsXG4gICdsaW5rJywgJ21lbnVpdGVtJywgJ21lbnVpdGVtY2hlY2tib3gnLCAnbWVudWl0ZW1yYWRpbycsICdvcHRpb24nLFxuICAncmFkaW8nLCAncm93JywgJ3Jvd2hlYWRlcicsICdzd2l0Y2gnLCAndGFiJywgJ3Rvb2x0aXAnLCAndHJlZWl0ZW0nLFxuXSk7XG5jb25zdCBpc05hbWVGcm9tQ29udGVudCA9IChlbDogRWxlbWVudCwgdGFnOiBzdHJpbmcsIHJvbGU6IHN0cmluZyB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgaWYgKHJvbGUgJiYgTkFNRV9GUk9NX0NPTlRFTlRfUk9MRVMuaGFzKHJvbGUpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKE5BTUVfRlJPTV9DT05URU5UX1RBR1MuaGFzKHRhZykpIHJldHVybiB0cnVlO1xuICAvLyBJbmxpbmUgLyBwaHJhc2luZyB0YWdzIGFsc28gbGVnaXRpbWF0ZWx5IGdldCB0ZXh0Q29udGVudCBhcyB0aGVpclxuICAvLyBcIm5hbWVcIiDigJQgY2FwdHVyaW5nIGEgPHNwYW4+Q2xpY2s8L3NwYW4+IHNob3VsZCBzaG93IFwiQ2xpY2tcIiwgbm90IFwiXCIuXG4gIC8vIFdlIG9ubHkgYWxsb3cgdGhpcyB3aGVuIHRoZSBlbGVtZW50IGhhcyBPTkxZIHRleHQtbm9kZSBjaGlsZHJlbiAobm9cbiAgLy8gc3RydWN0dXJhbCBjaGlsZHJlbiksIHNvIGEgPHNwYW4+IHdyYXBwaW5nIHNldmVuIGNhcmRzIHN0aWxsIHJldHVybnNcbiAgLy8gZW1wdHkuXG4gIGNvbnN0IElOTElORV9QSFJBU0lORyA9IG5ldyBTZXQoWydzcGFuJywgJ2VtJywgJ3N0cm9uZycsICdiJywgJ2knLCAnbWFyaycsICdzbWFsbCcsICdjb2RlJywgJ2tiZCcsICdzYW1wJywgJ3ZhcicsICd0aW1lJywgJ2NpdGUnLCAncScsICdhYmJyJywgJ3N1YicsICdzdXAnXSk7XG4gIGlmIChJTkxJTkVfUEhSQVNJTkcuaGFzKHRhZykgJiYgIWVsLmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGltcGxpY2l0Um9sZSA9IChlbDogRWxlbWVudCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkgcmV0dXJuICdidXR0b24nO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSByZXR1cm4gJ3RleHRib3gnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSByZXR1cm4gJ3RleHRib3gnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkgcmV0dXJuICdsaXN0Ym94JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZWwuaHJlZikgcmV0dXJuICdsaW5rJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTExJRWxlbWVudCkgcmV0dXJuICdsaXN0aXRlbSc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxVTGlzdEVsZW1lbnQgfHwgZWwgaW5zdGFuY2VvZiBIVE1MT0xpc3RFbGVtZW50KSByZXR1cm4gJ2xpc3QnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVGFibGVFbGVtZW50KSByZXR1cm4gJ3RhYmxlJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTFRhYmxlQ2VsbEVsZW1lbnQpIHJldHVybiAnY2VsbCc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxUYWJsZVJvd0VsZW1lbnQpIHJldHVybiAncm93JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSByZXR1cm4gJ2Zvcm0nO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MUHJvZ3Jlc3NFbGVtZW50KSByZXR1cm4gJ3Byb2dyZXNzYmFyJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTE1ldGVyRWxlbWVudCkgcmV0dXJuICdtZXRlcic7XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgU0VNQU5USUNfVEFHUyA9IG5ldyBTZXQoWydtYWluJywgJ3NlY3Rpb24nLCAnYXJ0aWNsZScsICduYXYnLCAnaGVhZGVyJywgJ2Zvb3RlcicsICdhc2lkZScsICdmb3JtJywgJ3RhYmxlJywgJ3VsJywgJ29sJ10pO1xuXG5jb25zdCBjb21wb25lbnRSb290ID0gKGVsOiBFbGVtZW50KToge2NvbXBhY3Q6IHN0cmluZ30gfCBudWxsID0+IHtcbiAgbGV0IGN1cnJlbnQ6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgbGV0IGRlcHRoID0gMDtcbiAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY3VycmVudCAhPT0gZG9jdW1lbnQuYm9keSAmJiBkZXB0aCA8IDEyKSB7XG4gICAgY29uc3QgbWFya2VyID1cbiAgICAgIGN1cnJlbnQuaWQgfHxcbiAgICAgIGN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbXBvbmVudCcpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10ZXN0aWQnKSB8fFxuICAgICAgY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdCcpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jeScpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1xYScpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgncm9sZScpIHx8XG4gICAgICBTRU1BTlRJQ19UQUdTLmhhcyhjdXJyZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgIGlmIChtYXJrZXIpIHJldHVybiB7Y29tcGFjdDogY29tcGFjdFRhcmdldChjdXJyZW50KX07XG4gICAgaWYgKGN1cnJlbnQucGFyZW50RWxlbWVudCA9PT0gbnVsbCAmJiBjdXJyZW50LnBhcmVudE5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnROb2RlLmhvc3QgfHwgbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgZGVwdGgrKztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGFuY2VzdG9yQ2hhaW4gPSAoZWw6IEVsZW1lbnQsIGRlcHRoID0gNCk6IEFuY2VzdG9yW10gPT4ge1xuICBjb25zdCBvdXQ6IEFuY2VzdG9yW10gPSBbXTtcbiAgbGV0IGN1cnJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IGRvY3VtZW50LmJvZHkgJiYgaSA8IGRlcHRoKSB7XG4gICAgY29uc3QgaXRlbTogQW5jZXN0b3IgPSB7dGFnOiBjdXJyZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX07XG4gICAgaWYgKGlzU3RhYmxlSWQoY3VycmVudC5pZCkpIGl0ZW0uaWQgPSBjdXJyZW50LmlkO1xuICAgIGNvbnN0IHJvbGUgPSBhdHRyKGN1cnJlbnQsICdyb2xlJyk7XG4gICAgaWYgKHJvbGUpIGl0ZW0ucm9sZSA9IHJvbGU7XG4gICAgY29uc3QgdGlkID0gYXR0cihjdXJyZW50LCAnZGF0YS10ZXN0aWQnKSB8fCBhdHRyKGN1cnJlbnQsICdkYXRhLXRlc3QnKSB8fFxuICAgICAgYXR0cihjdXJyZW50LCAnZGF0YS1jeScpIHx8IGF0dHIoY3VycmVudCwgJ2RhdGEtcWEnKTtcbiAgICBpZiAodGlkKSBpdGVtLnRlc3RJZCA9IHRpZDtcbiAgICBjb25zdCBjbHMgPSBjdXJyZW50LmNsYXNzTGlzdCA/IEFycmF5LmZyb20oY3VycmVudC5jbGFzc0xpc3QpLnNsaWNlKDAsIDMpIDogW107XG4gICAgaWYgKGNscy5sZW5ndGgpIGl0ZW0uY2xhc3NlcyA9IGNscztcbiAgICBvdXQucHVzaChpdGVtKTtcbiAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnRFbGVtZW50O1xuICAgIGkrKztcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gLS0tLSBBdHRycyAvIHN0eWxlcyAvIG1hdGNoZWQgcnVsZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBBVFRSX0FMTE9XTElTVCA9IG5ldyBTZXQoW1xuICAnaHJlZicsICdzcmMnLCAnYWx0JywgJ3RpdGxlJywgJ3BsYWNlaG9sZGVyJywgJ25hbWUnLCAndHlwZScsICd2YWx1ZScsICd0YXJnZXQnLCAnZm9yJyxcbiAgJ2FyaWEtbGFiZWwnLCAnYXJpYS1sYWJlbGxlZGJ5JywgJ2FyaWEtZGVzY3JpYmVkYnknLCAnYXJpYS1jb250cm9scycsICdhcmlhLWV4cGFuZGVkJyxcbiAgJ2FyaWEtY2hlY2tlZCcsICdhcmlhLXNlbGVjdGVkJywgJ2FyaWEtaGFzcG9wdXAnLCAnYXJpYS1saXZlJywgJ2FyaWEtaGlkZGVuJywgJ3JvbGUnLFxuXSk7XG5jb25zdCBBVFRSX1BSRUZJWF9BTExPVyA9IFsnYXJpYS0nLCAnZGF0YS0nXTtcbmNvbnN0IEFUVFJfQkxPQ0tMSVNUID0gbmV3IFNldChbJ2NsYXNzJywgJ3N0eWxlJywgJ2lkJ10pO1xuXG4vLyBQZXItaW5wdXQtdHlwZSBmb3JtYXQgaGludHMgc28gYW4gTExNIGNvbnN1bWluZyB0aGUgZXhwb3J0IGRvZXNuJ3QgaGF2ZVxuLy8gdG8gaW5mZXIgdGhlIGV4cGVjdGVkIHNoYXBlLiBEaXJlY3QgcG9ydCBmcm9tIGJyb3dzZXItdXNlJ3Mgc2VyaWFsaXplci5cbmNvbnN0IElOUFVUX0ZPUk1BVF9ISU5UUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgZGF0ZTogJ1lZWVktTU0tREQnLFxuICAnZGF0ZXRpbWUtbG9jYWwnOiAnWVlZWS1NTS1ERFRISDptbScsXG4gIG1vbnRoOiAnWVlZWS1NTScsXG4gIHRpbWU6ICdISDptbScsXG4gIHdlZWs6ICdZWVlZLVd3dycsXG4gIG51bWJlcjogJ251bWVyaWMnLFxuICByYW5nZTogJ251bWVyaWMnLFxuICB0ZWw6ICdwaG9uZScsXG4gIGVtYWlsOiAnZW1haWwnLFxuICB1cmw6ICd1cmwnLFxuICBjb2xvcjogJyNycmdnYmInLFxufTtcblxuLy8gQXR0cnMgdGhhdCBhcmUgYWx3YXlzIHByb21vdGVkIHRvIHRvcC1sZXZlbCBlbnRyeSBmaWVsZHMgKGB0ZXN0SWRgLFxuLy8gYGFjY2Vzc2libGVOYW1lYCwgYHJvbGVgKS4gS2VlcGluZyB0aGVtIEFMU08gaW4gYGF0dHJzYCB3YXMgZHVwbGljYXRlXG4vLyBwYXlsb2FkIOKAlCBkcm9wIHRoZW0gaGVyZSBzbyB0aGUgY29uc3VtZXIgc2VlcyBvbmUgY2Fub25pY2FsIHNvdXJjZS5cbi8vIGBkYXRhLXRlc3RpZGAsIGBkYXRhLXRlc3RgLCBgZGF0YS1jeWAsIGBkYXRhLXFhYCBhbGwgZ2V0IHByb21vdGVkLlxuY29uc3QgQVRUUl9ERURVUF9BR0FJTlNUX1RPUF9MRVZFTCA9IG5ldyBTZXQoW1xuICAnZGF0YS10ZXN0aWQnLCAnZGF0YS10ZXN0JywgJ2RhdGEtY3knLCAnZGF0YS1xYScsXG4gICdhcmlhLWxhYmVsJywgJ3JvbGUnLCAndGl0bGUnLCAnYWx0Jyxcbl0pO1xuXG4vLyBSZWdleCBkZW55bGlzdHMgZm9yIGxpa2VseS1zZWNyZXQtYmVhcmluZyBzdHJpbmdzLiBNYXRjaCBhZ2FpbnN0IGF0dHJpYnV0ZVxuLy8gVkFMVUVTIOKAlCBpZiBhIHZhbHVlIGxvb2tzIGxpa2UgYSBKV1QsIGFuIE9BdXRoIGJlYXJlciwgb3IgYSBsb25nIHRva2VuXG4vLyBzYW5kd2ljaGVkIGluIGEgbm9uLWFsbG93bGlzdGVkIHNwb3QsIHdlIHJlZGFjdCByYXRoZXIgdGhhbiBzaGlwLlxuY29uc3QgSldUX1JFID0gL1xcYmV5SltBLVphLXowLTlfLV17MjAsfVxcLltBLVphLXowLTlfLV17MjAsfVxcLltBLVphLXowLTlfLV17MjAsfVxcYi9nO1xuLy8gQ29uc2VydmF0aXZlIGJlYXJlci10b2tlbiByZWdleDogMjQrIGNoYXJzIG9mIGJhc2U2NHVybC1pc2ggY29udGVudFxuLy8gd2hlcmUgdGhlIGF0dHJpYnV0ZSBuYW1lIHN0cm9uZ2x5IGltcGxpZXMgYSBzZWNyZXQuIEFwcGxpZWQgcGVyLWF0dHIuXG5jb25zdCBTRUNSRVRfQVRUUl9OQU1FX1JFID0gLyh0b2tlbnxzZWNyZXR8cGFzc3dvcmR8YXBpW18tXT9rZXl8YXV0aChvcml6YXRpb24pP3xjc3JmfHhzcmZ8c2Vzc2lvbikvaTtcbmNvbnN0IHJlZGFjdFNlY3JldHMgPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKFNFQ1JFVF9BVFRSX05BTUVfUkUudGVzdChuYW1lKSAmJiB2YWx1ZS5sZW5ndGggPiA4KSByZXR1cm4gJ1tyZWRhY3RlZDogbG9va3MtbGlrZS1zZWNyZXRdJztcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoSldUX1JFLCAnW3JlZGFjdGVkOiBqd3RdJyk7XG59O1xuXG5jb25zdCBwb3B1bGF0ZWRBdHRycyA9IChlbDogRWxlbWVudCk6IHthdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgaGludHM6IGltcG9ydCgnLi90eXBlcy50cycpLkVudHJ5SGludHMgfCB1bmRlZmluZWR9ID0+IHtcbiAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKCFlbC5hdHRyaWJ1dGVzKSByZXR1cm4ge2F0dHJzLCBoaW50czogdW5kZWZpbmVkfTtcbiAgbGV0IHZhbHVlTWFza2VkID0gZmFsc2U7XG4gIGZvciAoY29uc3QgYSBvZiBBcnJheS5mcm9tKGVsLmF0dHJpYnV0ZXMpKSB7XG4gICAgY29uc3QgbmFtZSA9IGEubmFtZTtcbiAgICBpZiAoIW5hbWUgfHwgQVRUUl9CTE9DS0xJU1QuaGFzKG5hbWUpKSBjb250aW51ZTtcbiAgICBpZiAoQVRUUl9ERURVUF9BR0FJTlNUX1RPUF9MRVZFTC5oYXMobmFtZSkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGFsbG93ZWQgPSBBVFRSX0FMTE9XTElTVC5oYXMobmFtZSkgfHwgQVRUUl9QUkVGSVhfQUxMT1cuc29tZSgocCkgPT4gbmFtZS5zdGFydHNXaXRoKHApKTtcbiAgICBpZiAoIWFsbG93ZWQpIGNvbnRpbnVlO1xuICAgIGxldCB2ID0gdHJpbVRleHQoYS52YWx1ZSwgTUFYX0FUVFIpO1xuICAgIC8vIFNlbnNpdGl2ZS1pbnB1dCByZWRhY3Rpb24uIEJleW9uZCBgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiPmAsIGFsc29cbiAgICAvLyBzdHJpcCB2YWx1ZXMgZm9yOiBoaWRkZW4gaW5wdXRzIChvZnRlbiBjYXJyeSBDU1JGL0pXVCBib290c3RyYXBzKSxcbiAgICAvLyBhbnkgaW5wdXQgd2hvc2UgYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIG1hcmtzIGl0IGFzIGEgcGF5bWVudC1cbiAgICAvLyBjYXJkIGZpZWxkIChgY2MtbnVtYmVyYCwgYGNjLWNzY2AsIGBjYy1leHAqYCksIG9yIGEgb25lLXRpbWVcbiAgICAvLyBjb2RlLiBUaGUgcm9hc3QgY2FsbGVkIHRoaXMgb3V0IHVuZGVyIFRILTAwMSAvIEQuNCDigJQgbmV2ZXIgc2hpcCBhXG4gICAgLy8gdG9rZW4gc2hhcGVkIGxpa2UgYSBjcmVkaXQtY2FyZCBvciBzZXNzaW9uIGJvb3RzdHJhcC5cbiAgICBpZiAobmFtZSA9PT0gJ3ZhbHVlJyAmJiBlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdikge1xuICAgICAgY29uc3QgdCA9IGVsLnR5cGU7XG4gICAgICBjb25zdCBhYyA9IChlbC5nZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScpIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3Qgc2Vuc2l0aXZlID0gdCA9PT0gJ3Bhc3N3b3JkJ1xuICAgICAgICB8fCB0ID09PSAnaGlkZGVuJ1xuICAgICAgICB8fCAvXihjYy0obnVtYmVyfGNzY3xleHAoLW1vbnRofC15ZWFyKT98bmFtZSl8b25lLXRpbWUtY29kZXxuZXctcGFzc3dvcmR8Y3VycmVudC1wYXNzd29yZCkkLy50ZXN0KGFjKTtcbiAgICAgIGlmIChzZW5zaXRpdmUpIHtcbiAgICAgICAgdiA9ICfigKLigKLigKLigKInO1xuICAgICAgICB2YWx1ZU1hc2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2KSB7XG4gICAgICBjb25zdCByZWRhY3RlZCA9IHJlZGFjdFNlY3JldHMobmFtZSwgdik7XG4gICAgICBpZiAocmVkYWN0ZWQgIT09IHYpIHsgdiA9IHJlZGFjdGVkOyB2YWx1ZU1hc2tlZCA9IHRydWU7IH1cbiAgICB9XG4gICAgaWYgKHYpIGF0dHJzW25hbWVdID0gdjtcbiAgfVxuICAvLyBDYXB0dXJlLXRpbWUgc3ludGhldGljIGhpbnRzIHNpdCBpbiB0aGVpciBvd24gYmFnIChub3QgbWl4ZWQgd2l0aCByZWFsXG4gIC8vIGF0dHJpYnV0ZXMpLiBQZXItaW5wdXQtdHlwZSBmb3JtYXQgaGVscHMgYW4gTExNIGtub3cgdGhlIGV4cGVjdGVkIHNoYXBlLlxuICBjb25zdCBoaW50czogaW1wb3J0KCcuL3R5cGVzLnRzJykuRW50cnlIaW50cyA9IHt9O1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgY29uc3QgZm10ID0gSU5QVVRfRk9STUFUX0hJTlRTW2VsLnR5cGVdO1xuICAgIGlmIChmbXQpIGhpbnRzLmZvcm1hdCA9IGZtdDtcbiAgfVxuICBpZiAodmFsdWVNYXNrZWQpIGhpbnRzLnZhbHVlTWFza2VkID0gdHJ1ZTtcbiAgcmV0dXJuIHthdHRycywgaGludHM6IE9iamVjdC5rZXlzKGhpbnRzKS5sZW5ndGggPyBoaW50cyA6IHVuZGVmaW5lZH07XG59O1xuXG5jb25zdCBOT0lTRV9WQUxVRVMgPSBuZXcgU2V0KFsnaW5pdGlhbCcsICdpbmhlcml0JywgJ3Vuc2V0JywgJ3JldmVydCcsICdyZXZlcnQtbGF5ZXInLCAnbm9ybWFsJywgJ2F1dG8nLCAnbm9uZScsICdzdGF0aWMnXSk7XG5jb25zdCBOT0lTRV9GT1JfS0VZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XG4gIHZpc2liaWxpdHk6IFsndmlzaWJsZSddLCBvcGFjaXR5OiBbJzEnXSwgb3ZlcmZsb3c6IFsndmlzaWJsZSddLFxuICBvdmVyZmxvd1g6IFsndmlzaWJsZSddLCBvdmVyZmxvd1k6IFsndmlzaWJsZSddLCBkaXNwbGF5OiBbJ2lubGluZScsICdibG9jayddLFxuICBtYXJnaW46IFsnMHB4J10sIHBhZGRpbmc6IFsnMHB4J10sXG4gIGJvcmRlcjogWycwcHggbm9uZSByZ2IoMCwgMCwgMCknLCAnMHB4IG5vbmUgcmdiYSgwLCAwLCAwLCAwKSddLFxuICBib3JkZXJSYWRpdXM6IFsnMHB4J10sXG4gIGJhY2tncm91bmRDb2xvcjogWydyZ2JhKDAsIDAsIDAsIDApJywgJ3RyYW5zcGFyZW50J10sXG4gIHBvaW50ZXJFdmVudHM6IFsnYXV0byddLFxuICAvLyBUaGUgcm9hc3QgY2FsbGVkIHRoZXNlIG91dCBhcyBkZWZhdWx0LXZhbHVlIG5vaXNlIHRoYXQgYXBwZWFycyBvblxuICAvLyBldmVyeSBlbnRyeTogdG9wL3JpZ2h0L2JvdHRvbS9sZWZ0IGRlZmF1bHQgdG8gMHB4IG9uIHJlbGF0aXZlXG4gIC8vIHBvc2l0aW9uaW5nLCBmbGV4RGlyZWN0aW9uL2ZsZXhXcmFwIGRlZmF1bHQgdG8gcm93L25vd3JhcCBvblxuICAvLyBub24tZmxleCBjb250YWluZXJzLCBhbmQgYHRyYW5zaXRpb246IGFsbGAgaXMgdGhlIHVuaXZlcnNhbC1yZXNldFxuICAvLyBzaWRlIGVmZmVjdCDigJQgbm9uZSBtZWFuaW5nZnVsIGFzIGNhcHR1cmVkIHBlci1lbGVtZW50LlxuICB0b3A6IFsnMHB4J10sIHJpZ2h0OiBbJzBweCddLCBib3R0b206IFsnMHB4J10sIGxlZnQ6IFsnMHB4J10sXG4gIGZsZXhEaXJlY3Rpb246IFsncm93J10sXG4gIGZsZXhXcmFwOiBbJ25vd3JhcCddLFxuICB0cmFuc2l0aW9uOiBbJ2FsbCcsICdhbGwgMHMgZWFzZSAwcyddLFxuICAvLyBTcGVjIGRlZmF1bHRzIGZvciBncmlkICsgZmxleCBhbGlnbm1lbnQuXG4gIGFsaWduSXRlbXM6IFsnc3RyZXRjaCddLCBqdXN0aWZ5Q29udGVudDogWydmbGV4LXN0YXJ0JywgJ25vcm1hbCddLFxuICAvLyB0ZXh0QWxpZ24gZGVmYXVsdCBpcyBgc3RhcnRgLiBVc2VmdWwgd2hlbiBleHBsaWNpdGx5IHNldDsgbm9pc2Ugb3RoZXJ3aXNlLlxuICB0ZXh0QWxpZ246IFsnc3RhcnQnXSxcbiAgdGV4dERlY29yYXRpb246IFsnbm9uZSBzb2xpZCByZ2IoMCwgMCwgMCknXSxcbn07XG5jb25zdCBpc01lYW5pbmdmdWwgPSAoazogc3RyaW5nLCB2OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogdiBpcyBzdHJpbmcgPT4ge1xuICBpZiAodiA9PSBudWxsIHx8IHYgPT09ICcnKSByZXR1cm4gZmFsc2U7XG4gIGlmIChOT0lTRV9WQUxVRVMuaGFzKHYpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAhTk9JU0VfRk9SX0tFWVtrXT8uaW5jbHVkZXModik7XG59O1xuXG5jb25zdCBTVFlMRV9LRVlTID0gW1xuICAnZm9udEZhbWlseScsICdmb250U2l6ZScsICdmb250V2VpZ2h0JywgJ2xpbmVIZWlnaHQnLCAnbGV0dGVyU3BhY2luZycsXG4gICd0ZXh0QWxpZ24nLCAndGV4dFRyYW5zZm9ybScsICd0ZXh0RGVjb3JhdGlvbicsICdjb2xvcicsXG4gICdwYWRkaW5nJywgJ21hcmdpbicsICd3aWR0aCcsICdoZWlnaHQnLCAnbWluV2lkdGgnLCAnbWluSGVpZ2h0JywgJ21heFdpZHRoJywgJ21heEhlaWdodCcsXG4gICdiYWNrZ3JvdW5kQ29sb3InLCAnYmFja2dyb3VuZEltYWdlJywgJ2JvcmRlcicsICdib3JkZXJSYWRpdXMnLFxuICAnZGlzcGxheScsICdwb3NpdGlvbicsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnLCAnekluZGV4JyxcbiAgJ2ZsZXhEaXJlY3Rpb24nLCAnYWxpZ25JdGVtcycsICdqdXN0aWZ5Q29udGVudCcsICdnYXAnLCAnZmxleFdyYXAnLFxuICAnZ3JpZFRlbXBsYXRlQ29sdW1ucycsICdncmlkVGVtcGxhdGVSb3dzJywgJ2dyaWRDb2x1bW4nLCAnZ3JpZFJvdycsXG4gICdib3hTaGFkb3cnLCAnb3BhY2l0eScsICdvdmVyZmxvdycsICdmaWx0ZXInLCAnYmFja2Ryb3BGaWx0ZXInLCAndHJhbnNmb3JtJyxcbiAgJ3RyYW5zaXRpb24nLCAnYW5pbWF0aW9uJywgJ2N1cnNvcicsICd2aXNpYmlsaXR5JywgJ3BvaW50ZXJFdmVudHMnLFxuXSBhcyBjb25zdDtcbmNvbnN0IFNUWUxFX0xJTUlUUzogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHtcbiAgZm9udEZhbWlseTogMjU2LCBiYWNrZ3JvdW5kSW1hZ2U6IDEwMDAsIGJveFNoYWRvdzogMTAwMCwgYm9yZGVyOiAyNTYsXG4gIGZpbHRlcjogNTEyLCBiYWNrZHJvcEZpbHRlcjogNTEyLCB0cmFuc2Zvcm06IDUxMiwgdHJhbnNpdGlvbjogNTEyLCBhbmltYXRpb246IDUxMixcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogMTAwMCwgZ3JpZFRlbXBsYXRlUm93czogMTAwMCxcbn07XG5cbi8vIFBpeGVsIHZhbHVlcyByZXBvcnRlZCBieSBnZXRDb21wdXRlZFN0eWxlIG9uIGhpZ2gtRFBSIGRpc3BsYXlzIGNvbWUgYmFja1xuLy8gYXQgc3VicGl4ZWwgcHJlY2lzaW9uIChgMTUuOTk4M3B4YCwgYDIxLjk5NjVweGApLiBUaGUgZnJhY3Rpb25hbCBkaWdpdHNcbi8vIGFyZSBhcml0aG1ldGljIG5vaXNlLCBub3QgbWVhbmluZ2Z1bCBsYXlvdXQgc2lnbmFsIOKAlCByb3VuZCB0byAxIGRlY2ltYWxcbi8vIGZvciByZWFkYWJpbGl0eS4gV2Ugb25seSByb3VuZCBzaW1wbGUgYDxmbG9hdD5weGAgdmFsdWVzOyBhbnl0aGluZyBtb3JlXG4vLyBjb21wbGV4IChjYWxjKCksIHNob3J0aGFuZCBwYWRkaW5nLCBldGMuKSBpcyBsZWZ0IGludGFjdC5cbmNvbnN0IFBYX1JFID0gL14tP1xcZCtcXC5cXGQrcHgkLztcbmNvbnN0IHJvdW5kUHggPSAodjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFQWF9SRS50ZXN0KHYpKSByZXR1cm4gdjtcbiAgY29uc3QgbiA9IHBhcnNlRmxvYXQodik7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobikgPyBgJHtNYXRoLnJvdW5kKG4gKiAxMCkgLyAxMH1weGAgOiB2O1xufTtcblxuLy8gU3R5bGUgcHJvcHMgd29ydGggZHVhbC1lbWl0dGluZyBib3RoIHRoZWlyIHJlc29sdmVkIChgcmdiKC4uLilgKSBhbmRcbi8vIGRlY2xhcmVkIChgdmFyKC0tdG9rZW4pYCkgZm9ybXMuIFRoZSByZXNvbHZlZCB2YWx1ZSBpcyB3aGF0IGFuIExMTVxuLy8gcmVhc29ucyBhYm91dCB2aXN1YWxseTsgdGhlIGRlY2xhcmVkIGZvcm0gaXMgd2hhdCB0aGUgdXNlciB3cm90ZSBpblxuLy8gQ1NTIC8gd2hhdCBhIGRlc2lnbmVyIHJlY29nbml6ZXMuIE9ubHkgbWVhbmluZ2Z1bCBmb3IgdG9rZW4tZHJpdmVuXG4vLyB0aGVtaW5nLCBzbyB3ZSBsaW1pdCB0aGUgZHVhbC1lbWl0IHRvIGNvbG9yLXNoYXBlZCBwcm9wZXJ0aWVzLlxuY29uc3QgVkFSX0RVQUxfRU1JVCA9IG5ldyBTZXQoWydjb2xvcicsICdiYWNrZ3JvdW5kQ29sb3InLCAnYm9yZGVyQ29sb3InXSk7XG5cbmNvbnN0IGVzc2VudGlhbFN0eWxlcyA9IChlbDogRWxlbWVudCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAoY29uc3QgayBvZiBTVFlMRV9LRVlTKSB7XG4gICAgY29uc3QgdiA9IChjcyBhcyBhbnkpW2tdO1xuICAgIGlmICghaXNNZWFuaW5nZnVsKGssIHYpKSBjb250aW51ZTtcbiAgICBvdXRba10gPSByb3VuZFB4KHRyaW1UZXh0KHYsIFNUWUxFX0xJTUlUU1trXSA/PyAxNDApKTtcbiAgfVxuICAvLyBEdWFsLWVtaXQgdGhlIG9yaWdpbmFsIGB2YXIoLS3igKYpYCBmb3JtIGZvciB0aGVtZS1kcml2ZW4gcHJvcGVydGllcy5cbiAgLy8gV2UgcHVsbCBmcm9tIHRoZSBpbmxpbmUgYHN0eWxlYCBhdHRyaWJ1dGUgZmlyc3QgKGNoZWFwZXN0KSwgdGhlbiB3YWxrXG4gIC8vIG1hdGNoZWRSdWxlcyBmb3Igb25lcyB3aG9zZSBkZWNsYXJlZCB0ZXh0IGNvbnRhaW5zIGEgYHZhcihgLiBUaGVcbiAgLy8gcmVzb2x2ZWQgdmFsdWUgYWxyZWFkeSBsaXZlcyBpbiBgb3V0W2tdYDsgd2UgYWRkIGEgYDxrZXk+VmFyYCBzaWJsaW5nLlxuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgIGZvciAoY29uc3QgayBvZiBWQVJfRFVBTF9FTUlUKSB7XG4gICAgICBpZiAoIW91dFtrXSkgY29udGludWU7XG4gICAgICAvLyBDU1NTdHlsZURlY2xhcmF0aW9uIHVzZXMga2ViYWItY2FzZSBpbiBgZ2V0UHJvcGVydHlWYWx1ZWAuXG4gICAgICBjb25zdCBkYXNoS2V5ID0gay5yZXBsYWNlKC9bQS1aXS9nLCAoYykgPT4gJy0nICsgYy50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGNvbnN0IGlubGluZSA9IGVsLnN0eWxlPy5nZXRQcm9wZXJ0eVZhbHVlKGRhc2hLZXkpPy50cmltKCk7XG4gICAgICBpZiAoaW5saW5lICYmIGlubGluZS5pbmNsdWRlcygndmFyKCcpKSB7XG4gICAgICAgIG91dFtgJHtrfVZhcmBdID0gdHJpbVRleHQoaW5saW5lLCAxNDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuY29uc3QgUFNFVURPX0tFWVMgPSBbJ2Rpc3BsYXknLCAncG9zaXRpb24nLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ2JhY2tncm91bmRDb2xvcicsICdiYWNrZ3JvdW5kSW1hZ2UnLCAnYm9yZGVyJywgJ2JvcmRlclJhZGl1cycsICdib3hTaGFkb3cnLCAndHJhbnNmb3JtJywgJ29wYWNpdHknLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0JywgJ3pJbmRleCddIGFzIGNvbnN0O1xuY29uc3QgcHNldWRvU3R5bGVzID0gKGVsOiBFbGVtZW50KTogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPT4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge307XG4gIGZvciAoY29uc3Qgd2hpY2ggb2YgWyc6OmJlZm9yZScsICc6OmFmdGVyJ10pIHtcbiAgICBjb25zdCBjcyA9IHNhZmVDYWxsKCgpID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCB3aGljaCksIG51bGwpO1xuICAgIGlmICghY3MpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjcy5jb250ZW50O1xuICAgIGlmICghY29udGVudCB8fCBjb250ZW50ID09PSAnbm9uZScgfHwgY29udGVudCA9PT0gJ25vcm1hbCcpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGJsb2NrOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge2NvbnRlbnQ6IHRyaW1UZXh0KGNvbnRlbnQsIDI1Nil9O1xuICAgIGZvciAoY29uc3QgayBvZiBQU0VVRE9fS0VZUykge1xuICAgICAgY29uc3QgdiA9IChjcyBhcyBhbnkpW2tdO1xuICAgICAgaWYgKGlzTWVhbmluZ2Z1bChrLCB2KSkgYmxvY2tba10gPSB0cmltVGV4dCh2LCBTVFlMRV9MSU1JVFNba10gPz8gMTQwKTtcbiAgICB9XG4gICAgb3V0W3doaWNoLnJlcGxhY2UoJzo6JywgJycpXSA9IGJsb2NrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBQc2V1ZG8tY2xhc3NlcyBzYWZlIGZvciBhbnkgdGFnLlxuY29uc3QgU1RBVEVTX0tFRVBfVU5JVkVSU0FMID0gWydob3ZlcicsICdmb2N1cycsICdmb2N1cy12aXNpYmxlJywgJ2ZvY3VzLXdpdGhpbicsICdhY3RpdmUnLCAndGFyZ2V0JywgJ3Zpc2l0ZWQnXSBhcyBjb25zdDtcbi8vIEZvcm0tc3RhdGUgcHNldWRvcy4gQUxMIGVsZW1lbnRzIHRlY2huaWNhbGx5IG1hdGNoIGA6dmFsaWRgIC8gYDppbnZhbGlkYFxuLy8gKHBlciBDU1Mgc3BlYyksIHNvIGNhcHR1cmluZyB0aGVtIG9uIGEgYDxidXR0b24+YCBvciBgPGRpdj5gIHByb2R1Y2VzXG4vLyBgc3RhdGVzLnZhbGlkOiB0cnVlYCBub2lzZSB0aGF0IGNvbmZ1c2VkIExMTXMgKFwidGhlIGJ1dHRvbiBpcyB2YWxpZD9cbi8vIHdoYXQgZG9lcyB0aGF0IG1lYW4/XCIpLiBPbmx5IGVtaXQgdGhlc2UgZm9yIGdlbnVpbmUgZm9ybS1jb250cm9sIHRhZ3MuXG5jb25zdCBTVEFURVNfS0VFUF9GT1JNID0gWydjaGVja2VkJywgJ2Rpc2FibGVkJywgJ3JlcXVpcmVkJywgJ29wdGlvbmFsJywgJ3JlYWQtb25seScsICdyZWFkLXdyaXRlJywgJ2luLXJhbmdlJywgJ291dC1vZi1yYW5nZScsICd2YWxpZCcsICdpbnZhbGlkJ10gYXMgY29uc3Q7XG5jb25zdCBGT1JNX1RBR1MgPSBuZXcgU2V0KFsnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJywgJ29wdGlvbicsICdmaWVsZHNldCcsICdvdXRwdXQnLCAncHJvZ3Jlc3MnLCAnbWV0ZXInXSk7XG4vLyB2MjogYXJyYXkgZm9ybS4gRWFzaWVyIGZvciBEdWNrREIgcXVlcmllcyAoYCdob3ZlcicgPSBBTlkoc3RhdGVzKWApIGFuZCBhXG4vLyBmZXcgYnl0ZXMgc2hvcnRlciBvbiB0aGUgd2lyZSB0aGFuIHRoZSBvYmplY3QtYXMtc2V0IHNoYXBlLlxuY29uc3QgcGlja1RydWVTdGF0ZXMgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBzIG9mIFNUQVRFU19LRUVQX1VOSVZFUlNBTCkge1xuICAgIHRyeSB7IGlmIChlbC5tYXRjaGVzKGA6JHtzfWApKSBvdXQucHVzaChzKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSBpbnZhbGlkICovIH1cbiAgfVxuICBpZiAoRk9STV9UQUdTLmhhcyhlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgZm9yIChjb25zdCBzIG9mIFNUQVRFU19LRUVQX0ZPUk0pIHtcbiAgICAgIHRyeSB7IGlmIChlbC5tYXRjaGVzKGA6JHtzfWApKSBvdXQucHVzaChzKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG5jb25zdCBTVFlMRV9JTlRFUkVTVFMgPSBbXG4gICdkaXNwbGF5JywgJ3Bvc2l0aW9uJywgJ3Zpc2liaWxpdHknLCAnb3ZlcmZsb3cnLCAnb3ZlcmZsb3dYJywgJ292ZXJmbG93WScsXG4gICdib3hTaXppbmcnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ21pbldpZHRoJywgJ21pbkhlaWdodCcsICdtYXhXaWR0aCcsICdtYXhIZWlnaHQnLFxuICAnbWFyZ2luJywgJ3BhZGRpbmcnLCAnYm9yZGVyV2lkdGgnLCAnYm9yZGVyVG9wV2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmFkaXVzJywgJ2NvbG9yJywgJ2JhY2tncm91bmRDb2xvcicsXG4gICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ2ZvbnRXZWlnaHQnLCAnbGluZUhlaWdodCcsICd0ZXh0QWxpZ24nLCAndGV4dERlY29yYXRpb24nLFxuICAnb3BhY2l0eScsICd0cmFuc2Zvcm0nLCAndHJhbnNpdGlvbicsICdhbmltYXRpb24nLFxuXSBhcyBjb25zdDtcblxuLy8gVW5pdmVyc2FsIHNlbGVjdG9ycyBhbmQgQG1lZGlhIHByaW50IGJsb2NrcyBhcmUgcHJlc2VudCBvbiBldmVyeSBjYXB0dXJlZFxuLy8gZWxlbWVudCBhY3Jvc3MgYm90aCBQbGFzbWljIGFuZCB0aGUgV3Jhbm5nbGUgY29uc29sZS4gVGhleSBuZXZlciBleHBsYWluXG4vLyB3aGF0IG1ha2VzIGEgU1BFQ0lGSUMgZWxlbWVudCBsb29rIHRoZSB3YXkgaXQgZG9lcywgc28gdGhleSdyZSBwdXJlXG4vLyBub2lzZSDigJQgfjIxJSBvZiB0b3RhbCBwYXlsb2FkIGJ5dGVzIHBlciB0aGUgcm9hc3QgbWVhc3VyZW1lbnQuXG5jb25zdCBpc0ZpbHRlcmFibGVTZWxlY3RvciA9IChzZWw6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCB0cmltbWVkID0gc2VsLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCk7XG4gIGlmICh0cmltbWVkID09PSAnKicpIHJldHVybiB0cnVlO1xuICBpZiAodHJpbW1lZCA9PT0gJyosIDo6YmVmb3JlLCA6OmFmdGVyJykgcmV0dXJuIHRydWU7XG4gIGlmICh0cmltbWVkID09PSAnOjpiZWZvcmUsIDo6YWZ0ZXIsIConKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgY29sbGVjdE1hdGNoZWRSdWxlcyA9IChlbDogRWxlbWVudCk6IE1hdGNoZWRSdWxlW10gPT4ge1xuICBjb25zdCBydWxlczogTWF0Y2hlZFJ1bGVbXSA9IFtdO1xuICBjb25zdCBtZWRpYVN0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBwdXNoUnVsZSA9IChydWxlOiBDU1NTdHlsZVJ1bGUpOiBib29sZWFuID0+IHtcbiAgICB0cnkgeyBpZiAoIWVsLm1hdGNoZXMocnVsZS5zZWxlY3RvclRleHQpKSByZXR1cm4gdHJ1ZTsgfSBjYXRjaCB7IHJldHVybiB0cnVlOyB9XG4gICAgaWYgKGlzRmlsdGVyYWJsZVNlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gRHJvcCBAbWVkaWEgcHJpbnQgYmxvY2tzIOKAlCBjYXB0dXJlcyBhcmUgYWx3YXlzIGZvciB0aGUgc2NyZWVuIHZpZXcuXG4gICAgY29uc3QgbWVkaWFKb2luZWQgPSBtZWRpYVN0YWNrLmpvaW4oJyAmJiAnKTtcbiAgICBpZiAoL1xcYnByaW50XFxiLy50ZXN0KG1lZGlhSm9pbmVkKSAmJiAhL1xcYnNjcmVlblxcYi8udGVzdChtZWRpYUpvaW5lZCkpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGRlY2xhcmVkOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIFNUWUxFX0lOVEVSRVNUUykge1xuICAgICAgY29uc3QgdiA9IHJ1bGUuc3R5bGU/LmdldFByb3BlcnR5VmFsdWUocCk7XG4gICAgICBpZiAodikgZGVjbGFyZWRbcF0gPSB0cmltVGV4dCh2LCAxNDApO1xuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGRlY2xhcmVkKS5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIC8vIEEgcnVsZSBjYW4gTUFUQ0ggdGhlIHNlbGVjdG9yIHdpdGhvdXQgYmVpbmcgQUNUSVZFIGlmIGl0IGxpdmVzXG4gICAgLy8gaW5zaWRlIGFuIHVubWF0Y2hlZCBAbWVkaWEgcXVlcnkuIFRlc3Qgd2l0aCBtYXRjaE1lZGlhIHNvXG4gICAgLy8gcmVjZWl2ZXJzIGtub3cgd2hpY2ggcnVsZXMgc2hhcGVkIHRoZSBjYXB0dXJlZCB2aWV3cG9ydCB2cy5cbiAgICAvLyB3aGljaCB3b3VsZCBzaGFwZSBhIGRpZmZlcmVudCBvbmUgKGUuZy4gbW9iaWxlIHJ1bGVzIGNhcHR1cmVkXG4gICAgLy8gb24gZGVza3RvcCkuXG4gICAgY29uc3QgbWVkaWFBY3RpdmUgPSBtZWRpYVN0YWNrLmxlbmd0aCA9PT0gMFxuICAgICAgPyB0cnVlXG4gICAgICA6ICgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gbWVkaWFTdGFjayBqb2lucyBtdWx0aXBsZSBuZXN0ZWQgQG1lZGlhIOKAlCBhbGwgbXVzdCBtYXRjaC5cbiAgICAgICAgICBmb3IgKGNvbnN0IGNvbmQgb2YgbWVkaWFTdGFjaykge1xuICAgICAgICAgICAgY29uc3QgcmF3Q29uZCA9IGNvbmQucmVwbGFjZSgvXkBtZWRpYVxccyovLCAnJyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoTWVkaWEocmF3Q29uZCkubWF0Y2hlcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICAgIH0pKCk7XG4gICAgY29uc3QgcnVsZUVudHJ5OiBNYXRjaGVkUnVsZSA9IHtcbiAgICAgIHNlbGVjdG9yOiBydWxlLnNlbGVjdG9yVGV4dCxcbiAgICAgIGRlY2xhcmF0aW9uczogZGVjbGFyZWQsXG4gICAgICAuLi4obWVkaWFTdGFjay5sZW5ndGggPyB7bWVkaWE6IG1lZGlhSm9pbmVkfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChtZWRpYVN0YWNrLmxlbmd0aCkgcnVsZUVudHJ5Lm1lZGlhQWN0aXZlID0gbWVkaWFBY3RpdmU7XG4gICAgcnVsZXMucHVzaChydWxlRW50cnkpO1xuICAgIHJldHVybiBydWxlcy5sZW5ndGggPCBNQVhfUlVMRVM7XG4gIH07XG4gIGNvbnN0IHdhbGsgPSAoc2hlZXQ6IENTU1N0eWxlU2hlZXQgfCBudWxsLCBsaXN0OiBDU1NSdWxlTGlzdCk6IHZvaWQgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGggJiYgcnVsZXMubGVuZ3RoIDwgTUFYX1JVTEVTOyBpKyspIHtcbiAgICAgIGNvbnN0IHJ1bGUgPSBsaXN0W2ldO1xuICAgICAgaWYgKCFydWxlIHx8IHR5cGVvZiBydWxlLnR5cGUgIT09ICdudW1iZXInKSBjb250aW51ZTtcbiAgICAgIGlmIChydWxlLnR5cGUgPT09IENTU1J1bGUuU1RZTEVfUlVMRSkge1xuICAgICAgICBpZiAoIXB1c2hSdWxlKHJ1bGUgYXMgQ1NTU3R5bGVSdWxlKSkgYnJlYWs7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5NRURJQV9SVUxFIHx8IHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5TVVBQT1JUU19SVUxFKSB7XG4gICAgICAgIGNvbnN0IGNvbmQgPSBTdHJpbmcoKHJ1bGUgYXMgQ1NTTWVkaWFSdWxlKS5jb25kaXRpb25UZXh0IHx8ICcnKS50cmltKCk7XG4gICAgICAgIGlmIChjb25kKSBtZWRpYVN0YWNrLnB1c2goY29uZCk7XG4gICAgICAgIGlmICgocnVsZSBhcyBDU1NHcm91cGluZ1J1bGUpLmNzc1J1bGVzKSB3YWxrKHNoZWV0LCAocnVsZSBhcyBDU1NHcm91cGluZ1J1bGUpLmNzc1J1bGVzKTtcbiAgICAgICAgaWYgKGNvbmQpIG1lZGlhU3RhY2sucG9wKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5JTVBPUlRfUlVMRSAmJiAocnVsZSBhcyBDU1NJbXBvcnRSdWxlKS5zdHlsZVNoZWV0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaW0gPSAocnVsZSBhcyBDU1NJbXBvcnRSdWxlKS5zdHlsZVNoZWV0O1xuICAgICAgICAgIGlmIChpbT8uY3NzUnVsZXMpIHdhbGsoaW0sIGltLmNzc1J1bGVzKTtcbiAgICAgICAgfSBjYXRjaCB7IC8qIENPUlMtYmxvY2tlZCBzaGVldCAqLyB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmb3IgKGNvbnN0IHNoZWV0IG9mIEFycmF5LmZyb20oZG9jdW1lbnQuc3R5bGVTaGVldHMgfHwgW10pKSB7XG4gICAgY29uc3QgbSA9IHNoZWV0Lm1lZGlhPy5tZWRpYVRleHQ7XG4gICAgaWYgKG0pIG1lZGlhU3RhY2sucHVzaChgQG1lZGlhICR7bX1gKTtcbiAgICBsZXQgY3NzOiBDU1NSdWxlTGlzdCB8IHVuZGVmaW5lZDtcbiAgICB0cnkgeyBjc3MgPSBzaGVldC5jc3NSdWxlczsgfSBjYXRjaCB7IGlmIChtKSBtZWRpYVN0YWNrLnBvcCgpOyBjb250aW51ZTsgfVxuICAgIGlmIChjc3MpIHdhbGsoc2hlZXQsIGNzcyk7XG4gICAgaWYgKG0pIG1lZGlhU3RhY2sucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHJ1bGVzO1xufTtcblxuLy8gRXZlbnQtaGFuZGxlciBwcm9iZXMuIFJldHVybnMgYSBmbGF0IGB7IG9uQ2xpY2s6IFwiaGFuZGxlck5hbWVcIiwg4oCmIH1gIG1hcFxuLy8gcHVsbGVkIGZyb20gd2hhdGV2ZXIgZnJhbWV3b3JrIHdpcmVkIHRoZSBoYW5kbGVyLiBUaGUgbWFwIGFuc3dlcnNcbi8vIFwid2hpY2ggaGFuZGxlciByYW4gd2hlbiB0aGlzIGZpcmVkP1wiIHdpdGhvdXQgZm9yY2luZyBhbiBMTE0gdG8gZ3JlcFxuLy8gdGhlIGNvZGViYXNlLiBUaHJlZSBzb3VyY2VzIHN0YWNrZWQ6XG4vL1xuLy8gICAxLiBSZWFjdCBmaWJlcnMg4oCUIGBfX3JlYWN0UHJvcHMkPGtleT4ub25YYCAoZnVuY3Rpb24gd2hvc2UgYC5uYW1lYFxuLy8gICAgICBpcyB0aGUgc291cmNlIG5hbWUgaW4gZGV2IGJ1aWxkcywgbWluaWZpZWQgaW4gcHJvZCkuXG4vLyAgIDIuIFZ1ZSAzIHZub2RlIHByb3BzIOKAlCBgX192dWVQYXJlbnRDb21wb25lbnQudm5vZGUucHJvcHMub25YYFxuLy8gICAgICAoVnVlIDMgbm9ybWFsaXplcyBgQGNsaWNrYCB0ZW1wbGF0ZSBhdHRycyB0byBgb25DbGlja2Agb24gdGhlXG4vLyAgICAgIGNvbXBvbmVudCB2bm9kZSkuXG4vLyAgIDMuIElubGluZSBgb24qYCBIVE1MIGF0dHJpYnV0ZXMg4oCUIHRoZSBsZWdhY3kgYG9uY2xpY2s9XCLigKZcImAgZm9ybS5cbi8vICAgICAgQ2FwdHVyZWQgdmFsdWUgaXMgdGhlIHNvdXJjZSBzdHJpbmcgd2l0aCB3aGl0ZXNwYWNlIGNvbGxhcHNlZCxcbi8vICAgICAgY2FwcGVkIHRvIDIwMCBjaGFycyAoZnVsbC1zY3JpcHQgaW5saW5lIGhhbmRsZXJzIGdldCB0cnVuY2F0ZWQpLlxuLy9cbi8vIEVhY2ggc291cmNlIGNhbiBjb250cmlidXRlOyBsYXRlciBzb3VyY2VzIGRvbid0IG92ZXJ3cml0ZSBlYXJsaWVyIG9uZXNcbi8vIOKAlCBhIFJlYWN0IGhhbmRsZXIgYmVhdHMgYW4gaW5saW5lIG9uZSB3aGVuIGJvdGggZXhpc3Qgb24gdGhlIG5vZGUuXG5jb25zdCBIQU5ETEVSX0tFWVMgPSBbJ29uQ2xpY2snLCAnb25Nb3VzZURvd24nLCAnb25TdWJtaXQnLCAnb25DaGFuZ2UnLCAnb25LZXlEb3duJywgJ29uRm9jdXMnLCAnb25CbHVyJywgJ29uSW5wdXQnXSBhcyBjb25zdDtcbmNvbnN0IElOTElORV9PTl9BVFRSUyA9IFsnb25jbGljaycsICdvbm1vdXNlZG93bicsICdvbnN1Ym1pdCcsICdvbmNoYW5nZScsICdvbmtleWRvd24nLCAnb25mb2N1cycsICdvbmJsdXInLCAnb25pbnB1dCddIGFzIGNvbnN0O1xuXG5jb25zdCByZWFjdEV2ZW50TmFtZXMgPSAoZWw6IEVsZW1lbnQsIG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHZvaWQgPT4ge1xuICBjb25zdCBwcm9wc0tleSA9IE9iamVjdC5rZXlzKGVsKS5maW5kKChrKSA9PiBrLnN0YXJ0c1dpdGgoJ19fcmVhY3RQcm9wcyQnKSk7XG4gIGlmICghcHJvcHNLZXkpIHJldHVybjtcbiAgY29uc3QgcHJvcHMgPSAoZWwgYXMgYW55KVtwcm9wc0tleV0gYXMgUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZDtcbiAgaWYgKCFwcm9wcykgcmV0dXJuO1xuICBmb3IgKGNvbnN0IGsgb2YgSEFORExFUl9LRVlTKSB7XG4gICAgaWYgKG91dFtrXSkgY29udGludWU7XG4gICAgY29uc3QgZm4gPSBwcm9wc1trXTtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBuID0gZm4ubmFtZSAmJiBmbi5uYW1lICE9PSAnJyA/IGZuLm5hbWUgOiAnPGFub255bW91cz4nO1xuICAgICAgb3V0W2tdID0gdHJpbVRleHQobiwgODApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgdnVlRXZlbnROYW1lcyA9IChlbDogRWxlbWVudCwgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCA9PiB7XG4gIC8vIFZ1ZSAzOiBldmVudHMgbGl2ZSBvbiB0aGUgcGFyZW50LWNvbXBvbmVudCB2bm9kZSdzIHByb3BzIGFzIGBvbkNsaWNrYCxcbiAgLy8gYG9uTXlFdmVudGAsIGV0Yy4gVnVlIDI6IGBlbC5fX3Z1ZV9fLiRsaXN0ZW5lcnNgIGhhZCB0aGVtOyB3ZSBzbmlmZlxuICAvLyBib3RoIHNoYXBlcy4gQ2hlYXAgZmFsbHRocm91Z2ggd2hlbiBuZWl0aGVyIGlzIHByZXNlbnQuXG4gIGNvbnN0IHY6IGFueSA9IChlbCBhcyBhbnkpLl9fdnVlUGFyZW50Q29tcG9uZW50IHx8IChlbCBhcyBhbnkpLl9fdnVlX187XG4gIGlmICghdikgcmV0dXJuO1xuICBjb25zdCBwcm9wcyA9IHYudm5vZGU/LnByb3BzIHx8IHYuJG9wdGlvbnM/LnByb3BzRGF0YSB8fCB2LiRsaXN0ZW5lcnM7XG4gIGlmICghcHJvcHMgfHwgdHlwZW9mIHByb3BzICE9PSAnb2JqZWN0JykgcmV0dXJuO1xuICBmb3IgKGNvbnN0IGsgb2YgSEFORExFUl9LRVlTKSB7XG4gICAgaWYgKG91dFtrXSkgY29udGludWU7XG4gICAgY29uc3QgZm4gPSBwcm9wc1trXSB8fCBwcm9wc1trLnRvTG93ZXJDYXNlKCldO1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG4gPSBmbi5uYW1lICYmIGZuLm5hbWUgIT09ICcnID8gZm4ubmFtZSA6ICc8dnVlLWFub255bW91cz4nO1xuICAgICAgb3V0W2tdID0gdHJpbVRleHQobiwgODApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgaW5saW5lRXZlbnROYW1lcyA9IChlbDogRWxlbWVudCwgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCA9PiB7XG4gIGZvciAoY29uc3QgYXR0ciBvZiBJTkxJTkVfT05fQVRUUlMpIHtcbiAgICBjb25zdCBjYW1lbCA9ICdvbicgKyBhdHRyLmNoYXJBdCgyKS50b1VwcGVyQ2FzZSgpICsgYXR0ci5zbGljZSgzKTtcbiAgICBpZiAob3V0W2NhbWVsXSkgY29udGludWU7XG4gICAgY29uc3QgdiA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICBpZiAodikgb3V0W2NhbWVsXSA9IHRyaW1UZXh0KHYsIDIwMCk7XG4gIH1cbn07XG5cbmNvbnN0IGNvbGxlY3RFdmVudE5hbWVzID0gKGVsOiBFbGVtZW50KTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwgPT4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmVhY3RFdmVudE5hbWVzKGVsLCBvdXQpO1xuICB2dWVFdmVudE5hbWVzKGVsLCBvdXQpO1xuICBpbmxpbmVFdmVudE5hbWVzKGVsLCBvdXQpO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gXCJCZWhhdmlvclwiIGF0dHJpYnV0ZXMg4oCUIGh0bXgsIFN0aW11bHVzLCBBbHBpbmUsIFR1cmJvLiBTZXJ2ZXItcmVuZGVyZWRcbi8vIGFwcHMgZG9uJ3QgaGF2ZSBSZWFjdCBmaWJlcnM7IHRoZSB3aXJpbmcgZm9yIFwid2hhdCB0aGlzIGJ1dHRvbiBkb2VzXCJcbi8vIGxpdmVzIGluIEhUTUwgYXR0cmlidXRlcy4gQ2FwdHVyZSB0aGVtIGFzIGEgc2VwYXJhdGUgZmllbGQgc28gYW4gTExNXG4vLyBhc2tlZCBcIndoeSBkb2Vzbid0IHRoaXMgYnV0dG9uIHdvcms/XCIgc2VlcyB0aGUgYmluZGluZyBpbW1lZGlhdGVseVxuLy8gcmF0aGVyIHRoYW4gZGlnZ2luZyB0aHJvdWdoIGBhdHRyc2AuXG5jb25zdCBCRUhBVklPUl9BVFRSX1BSRUZJWEVTID0gWydoeC0nLCAnZGF0YS1oeC0nLCAnZGF0YS1jb250cm9sbGVyJywgJ2RhdGEtYWN0aW9uJywgJ2RhdGEtdGFyZ2V0JywgJ3gtZGF0YScsICd4LW9uOicsICd4LWJpbmQ6JywgJ3gtbW9kZWwnLCAneC1zaG93JywgJ3gtaWYnLCAnQGNsaWNrJywgJ0BzdWJtaXQnLCAnZGF0YS10dXJibyddIGFzIGNvbnN0O1xuY29uc3QgY29sbGVjdEJlaGF2aW9yQXR0cnMgPSAoZWw6IEVsZW1lbnQpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCA9PiB7XG4gIGlmICghZWwuYXR0cmlidXRlcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKSkge1xuICAgIGNvbnN0IG5hbWUgPSBhLm5hbWU7XG4gICAgaWYgKEJFSEFWSU9SX0FUVFJfUFJFRklYRVMuc29tZSgocCkgPT4gbmFtZSA9PT0gcCB8fCBuYW1lLnN0YXJ0c1dpdGgocCkpKSB7XG4gICAgICBvdXRbbmFtZV0gPSB0cmltVGV4dChhLnZhbHVlLCAyMDApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gV2FsayB1cCB0aGUgc2hhZG93LURPTSBib3VuZGFyaWVzLiBXaGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50IGxpdmVzXG4vLyBpbnNpZGUgYSBjbG9zZWQvb3BlbiBzaGFkb3cgcm9vdCwgdGhlIGhvc3QncyBzZWxlY3RvciBpcyB0aGUgb25seSB3YXlcbi8vIHRoZSBwYW5lbCBzaWRlIChvciBhbiBMTE0gbGF0ZXIpIGNhbiByZS1maW5kIHRoZSBlbnRyeSBvbiB0aGUgbGl2ZVxuLy8gcGFnZSDigJQgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyBib3VuZGFyaWVzLlxuY29uc3Qgc2hhZG93SG9zdFNlbGVjdG9yID0gKGVsOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHJvb3QgPSBlbC5nZXRSb290Tm9kZSgpO1xuICBpZiAoIShyb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCkpIHJldHVybiBudWxsO1xuICBjb25zdCBob3N0ID0gcm9vdC5ob3N0O1xuICBpZiAoIWhvc3QpIHJldHVybiBudWxsO1xuICAvLyBjc3NQYXRoIGlzIGRlZmluZWQgbGF0ZXI7IHJvdXRlIHRocm91Z2ggdGhlIHNoYXJlZCBzZWxlY3RvciBidWlsZGVyLlxuICB0cnkgeyByZXR1cm4gY3NzUGF0aChob3N0KTsgfSBjYXRjaCB7IHJldHVybiBob3N0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTsgfVxufTtcblxuLy8gV2FsayB1cCB0byBmaW5kIHRoZSBuZWFyZXN0IGBjb250ZW50ZWRpdGFibGU9dHJ1ZWAgYW5jZXN0b3IgKHRoZVxuLy8gcmljaC10ZXh0IGVkaXRvcidzIFwicm9vdFwiKS4gUmV0dXJucyBudWxsIHdoZW4gdGhlIGNhcHR1cmVkIGVsZW1lbnQgaXNcbi8vIG91dHNpZGUgYW55IGVkaXRvci5cbmNvbnN0IGZpbmRFZGl0b3JSb290ID0gKGVsOiBFbGVtZW50KTogRWxlbWVudCB8IG51bGwgPT4ge1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsO1xuICB3aGlsZSAoY3VyKSB7XG4gICAgaWYgKGN1ciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGN1ci5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgLy8gV2FsayB1cCBmdXJ0aGVyIHRvIGZpbmQgdGhlIE9VVEVSTU9TVCBjb250ZW50ZWRpdGFibGU9dHJ1ZVxuICAgICAgLy8gYW5jZXN0b3Ig4oCUIFByb3NlTWlycm9yIG5lc3RzIG5vZGVzIHRoYXQgZWFjaCByZXBvcnRcbiAgICAgIC8vIGlzQ29udGVudEVkaXRhYmxlPXRydWUsIGJ1dCB0aGUgYWN0dWFsIGVkaXRvciByb290IGlzIGF0IHRoZSB0b3AuXG4gICAgICBsZXQgb3V0ZXI6IEVsZW1lbnQgPSBjdXI7XG4gICAgICBsZXQgcHJvYmU6IEVsZW1lbnQgfCBudWxsID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgICB3aGlsZSAocHJvYmUgJiYgcHJvYmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBwcm9iZS5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgICBvdXRlciA9IHByb2JlO1xuICAgICAgICBwcm9iZSA9IHByb2JlLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0ZXI7XG4gICAgfVxuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gSWRlbnRpZnkgdGhlIGVkaXRvciBsaWJyYXJ5IGJ5IG1hcmtlcnMgZWFjaCBvbmUgc3RhbXBzIG9uIHRoZSBlZGl0b3Jcbi8vIHJvb3QuIE1vc3QgbGlicmFyaWVzIGxlYXZlIGEgY2xhc3Mgb3IgZGF0YS0qIGF0dHJpYnV0ZSB0aGF0J3Mgc3RhYmxlXG4vLyBhY3Jvc3MgdmVyc2lvbnM7IHNvbWUgbGVhdmUgYSBydW50aW1lIGZpZWxkIG9uIHRoZSBET00gbm9kZS4gT3JkZXJcbi8vIG1hdHRlcnMg4oCUIFRpcFRhcCByZXVzZXMgUHJvc2VNaXJyb3IgdW5kZXIgdGhlIGhvb2QsIHNvIGNoZWNrIHRpcHRhcFxuLy8gbWFya2VycyBmaXJzdDsgZGl0dG8gUXVpbGwgKHB1cmUgUHJvc2VNaXJyb3ItZnJlZSkgYmVmb3JlIGdlbmVyaWNcbi8vIGAuUHJvc2VNaXJyb3JgLlxuY29uc3QgZGV0ZWN0RWRpdG9yS2luZCA9IChyb290OiBFbGVtZW50KTogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJyA9PiB7XG4gIGNvbnN0IHI6IGFueSA9IHJvb3Q7XG4gIGlmIChyb290LmNsYXNzTGlzdD8uY29udGFpbnMoJ3RpcHRhcCcpIHx8IHIuX190aXB0YXApIHJldHVybiAndGlwdGFwJztcbiAgaWYgKHJvb3QuaGFzQXR0cmlidXRlKCdkYXRhLWxleGljYWwtZWRpdG9yJykgfHwgci5fX2xleGljYWxFZGl0b3IpIHJldHVybiAnbGV4aWNhbCc7XG4gIGlmIChyb290Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zbGF0ZS1lZGl0b3InKSB8fCByLl9fc2xhdGVFZGl0b3IpIHJldHVybiAnc2xhdGUnO1xuICBpZiAocm9vdC5jbGFzc0xpc3Q/LmNvbnRhaW5zKCdxbC1lZGl0b3InKSB8fCByb290LmNsb3Nlc3QoJy5xbC1jb250YWluZXInKSkgcmV0dXJuICdxdWlsbCc7XG4gIGlmIChyb290LmNsYXNzTGlzdD8uY29udGFpbnMoJ1Byb3NlTWlycm9yJykgfHwgci5fX3BtVmlld0Rlc2MgfHwgci5wbVZpZXdEZXNjKSByZXR1cm4gJ3Byb3NlbWlycm9yJztcbiAgcmV0dXJuICduYXRpdmUnO1xufTtcblxuY29uc3QgZWRpdG9yQ29udGV4dCA9IChlbDogRWxlbWVudCk6IHtraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnOyByb290U2VsZWN0b3I6IHN0cmluZzsgY29udGVudExlbmd0aDogbnVtYmVyfSB8IG51bGwgPT4ge1xuICBjb25zdCByb290ID0gZmluZEVkaXRvclJvb3QoZWwpO1xuICBpZiAoIXJvb3QpIHJldHVybiBudWxsO1xuICBsZXQgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gIHRyeSB7IHJvb3RTZWxlY3RvciA9IGNzc1BhdGgocm9vdCk7IH0gY2F0Y2ggeyByb290U2VsZWN0b3IgPSByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKTsgfVxuICBjb25zdCB0ZXh0ID0gKHJvb3QgYXMgSFRNTEVsZW1lbnQpLmlubmVyVGV4dCA/PyByb290LnRleHRDb250ZW50ID8/ICcnO1xuICByZXR1cm4ge1xuICAgIGtpbmQ6IGRldGVjdEVkaXRvcktpbmQocm9vdCksXG4gICAgcm9vdFNlbGVjdG9yLFxuICAgIGNvbnRlbnRMZW5ndGg6IHRleHQubGVuZ3RoLFxuICB9O1xufTtcblxuLy8gTGF5b3V0IGJ1Z3MgZnJlcXVlbnRseSBsaXZlIGluIHRoZSBQQVJFTlQncyBmbGV4L2dyaWQvb3ZlcmZsb3cvXG4vLyBzY3JvbGwvc3RhY2tpbmcgY29udGV4dCwgbm90IG9uIHRoZSBjYXB0dXJlZCBlbGVtZW50IGl0c2VsZi5cbi8vIENhcHR1cmUgYSBzbGltIHN1bW1hcnkgb2YgdGhlIHBhcmVudCBjaGFpbiB0aGF0J3Mgc3RydWN0dXJhbGx5XG4vLyByZWxldmFudCB0byBsYXlvdXQg4oCUIGRpc3BsYXksIHBvc2l0aW9uLCBvdmVyZmxvdywgc2Nyb2xsIG9mZnNldCxcbi8vIHRyYW5zZm9ybS93aWxsLWNoYW5nZSAoc3RhY2tpbmcpLCBhbmQgZmxleC9ncmlkIHN1bW1hcnkgb24gdGhlXG4vLyBpbW1lZGlhdGUgcGFyZW50LlxudHlwZSBMYXlvdXRDb250ZXh0RW50cnkgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBkaXNwbGF5Pzogc3RyaW5nO1xuICBwb3NpdGlvbj86IHN0cmluZztcbiAgb3ZlcmZsb3c/OiBzdHJpbmc7XG4gIHpJbmRleD86IHN0cmluZztcbiAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICB3aWxsQ2hhbmdlPzogc3RyaW5nO1xuICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xufTtcbmNvbnN0IGlzTGF5b3V0SW50ZXJlc3RpbmcgPSAoY3M6IENTU1N0eWxlRGVjbGFyYXRpb24pOiBib29sZWFuID0+IHtcbiAgaWYgKGNzLnBvc2l0aW9uICYmIGNzLnBvc2l0aW9uICE9PSAnc3RhdGljJykgcmV0dXJuIHRydWU7XG4gIGlmIChjcy5kaXNwbGF5ICYmIC8oZmxleHxncmlkfHRhYmxlfGNvbnRlbnRzfGlubGluZS1ibG9jaykvLnRlc3QoY3MuZGlzcGxheSkpIHJldHVybiB0cnVlO1xuICBpZiAoY3Mub3ZlcmZsb3cgJiYgY3Mub3ZlcmZsb3cgIT09ICd2aXNpYmxlJykgcmV0dXJuIHRydWU7XG4gIGlmIChjcy50cmFuc2Zvcm0gJiYgY3MudHJhbnNmb3JtICE9PSAnbm9uZScpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59O1xuY29uc3QgY2FwdHVyZUxheW91dENvbnRleHQgPSAoZWw6IEVsZW1lbnQsIGRlcHRoID0gNCk6IExheW91dENvbnRleHRFbnRyeVtdID0+IHtcbiAgY29uc3Qgb3V0OiBMYXlvdXRDb250ZXh0RW50cnlbXSA9IFtdO1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKGN1ciAmJiBjdXIgIT09IGRvY3VtZW50LmJvZHkgJiYgaSA8IGRlcHRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3VyKTtcbiAgICAgIGNvbnN0IGludGVyZXN0aW5nID0gaXNMYXlvdXRJbnRlcmVzdGluZyhjcyk7XG4gICAgICBpZiAoaW50ZXJlc3RpbmcpIHtcbiAgICAgICAgY29uc3QgZW50cnk6IExheW91dENvbnRleHRFbnRyeSA9IHt0YWc6IGN1ci50YWdOYW1lLnRvTG93ZXJDYXNlKCl9O1xuICAgICAgICBlbnRyeS5kaXNwbGF5ID0gY3MuZGlzcGxheTtcbiAgICAgICAgZW50cnkucG9zaXRpb24gPSBjcy5wb3NpdGlvbjtcbiAgICAgICAgaWYgKGNzLm92ZXJmbG93ICE9PSAndmlzaWJsZScpIGVudHJ5Lm92ZXJmbG93ID0gY3Mub3ZlcmZsb3c7XG4gICAgICAgIGlmIChjcy56SW5kZXggJiYgY3MuekluZGV4ICE9PSAnYXV0bycpIGVudHJ5LnpJbmRleCA9IGNzLnpJbmRleDtcbiAgICAgICAgaWYgKGNzLnRyYW5zZm9ybSAmJiBjcy50cmFuc2Zvcm0gIT09ICdub25lJykgZW50cnkudHJhbnNmb3JtID0gdHJpbVRleHQoY3MudHJhbnNmb3JtLCAxMjApO1xuICAgICAgICBpZiAoY3Mud2lsbENoYW5nZSAmJiBjcy53aWxsQ2hhbmdlICE9PSAnYXV0bycpIGVudHJ5LndpbGxDaGFuZ2UgPSBjcy53aWxsQ2hhbmdlO1xuICAgICAgICBpZiAoKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsV2lkdGggPiBjdXIuY2xpZW50V2lkdGggfHwgKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsSGVpZ2h0ID4gY3VyLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgIGVudHJ5LmlzU2Nyb2xsQ29udGFpbmVyID0gdHJ1ZTtcbiAgICAgICAgICBlbnRyeS5zY3JvbGxMZWZ0ID0gKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsTGVmdDtcbiAgICAgICAgICBlbnRyeS5zY3JvbGxUb3AgPSAoY3VyIGFzIEhUTUxFbGVtZW50KS5zY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9mbGV4Ly50ZXN0KGNzLmRpc3BsYXkpKSB7XG4gICAgICAgICAgZW50cnkuZmxleCA9IHtcbiAgICAgICAgICAgIGRpcmVjdGlvbjogY3MuZmxleERpcmVjdGlvbixcbiAgICAgICAgICAgIHdyYXA6IGNzLmZsZXhXcmFwLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogY3MuYWxpZ25JdGVtcyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBjcy5qdXN0aWZ5Q29udGVudCxcbiAgICAgICAgICAgIGdhcDogY3MuZ2FwICE9PSAnbm9ybWFsJyA/IGNzLmdhcCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKC9ncmlkLy50ZXN0KGNzLmRpc3BsYXkpKSB7XG4gICAgICAgICAgZW50cnkuZ3JpZCA9IHtcbiAgICAgICAgICAgIHRlbXBsYXRlQ29sdW1uczogdHJpbVRleHQoY3MuZ3JpZFRlbXBsYXRlQ29sdW1ucywgMjAwKSxcbiAgICAgICAgICAgIHRlbXBsYXRlUm93czogdHJpbVRleHQoY3MuZ3JpZFRlbXBsYXRlUm93cywgMjAwKSxcbiAgICAgICAgICAgIGdhcDogY3MuZ2FwICE9PSAnbm9ybWFsJyA/IGNzLmdhcCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIG91dC5wdXNoKGVudHJ5KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICBpKys7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFN1cmZhY2UgYSBjb250cmFzdC1yYXRpbyBudW1iZXIgZm9yIHRleHQgZWxlbWVudHMgc28gYW4gYTExeS1hd2FyZVxuLy8gcmV2aWV3ZXIgY2FuIGZsYWcgZmFpbGluZyBwYWlycyB3aXRob3V0IHJlLXJ1bm5pbmcgYW4gYXVkaXQuIFJldHVybnNcbi8vIG51bGwgd2hlbiBubyB0ZXh0IG9yIHdoZW4gYmFja2dyb3VuZCBpcyB0cmFuc3BhcmVudCBhbmQgd2UgY2FuJ3Rcbi8vIHJlc29sdmUgYSBiYXNlIGNvbG9yLlxuLy9cbi8vIFdlIG9ubHkgcmVwb3J0IGNvbnRyYXN0IGZvciBlbGVtZW50cyB3aXRoIGRpcmVjdCB0ZXh0IGNoaWxkcmVuOyBmb3Jcbi8vIGNvbnRhaW5lcnMgd2UnZCBuZWVkIHRvIHRyYXZlcnNlLCB3aGljaCBpcyBvdXRzaWRlIHRoZSBzY29wZSBvZiBhXG4vLyBsaWdodHdlaWdodCBpbi1jYXB0dXJlIGF1ZGl0LlxuY29uc3QgcGFyc2VSZ2IgPSAoczogc3RyaW5nKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBudWxsID0+IHtcbiAgLy8gcmdiKDI1NSwgOTUsIDApIHwgcmdiYSgyNTUsIDk1LCAwLCAwLjUpIHwgI2ZmNWYwMCB8ICNmNTBcbiAgY29uc3QgbSA9IC9yZ2JhP1xcKFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqKD86LFxccyooW1xcZC5dKykpP1xccypcXCkvLmV4ZWMocyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIFtwYXJzZUludChtWzFdISwgMTApLCBwYXJzZUludChtWzJdISwgMTApLCBwYXJzZUludChtWzNdISwgMTApLCBtWzRdID8gcGFyc2VGbG9hdChtWzRdKSA6IDFdO1xuICB9XG4gIGNvbnN0IGhleCA9IC9eIyhbMC05YS1mXXszfXxbMC05YS1mXXs2fSkkL2kuZXhlYyhzKTtcbiAgaWYgKGhleCkge1xuICAgIGxldCBoID0gaGV4WzFdITtcbiAgICBpZiAoaC5sZW5ndGggPT09IDMpIGggPSBoLnNwbGl0KCcnKS5tYXAoKGMpID0+IGMgKyBjKS5qb2luKCcnKTtcbiAgICByZXR1cm4gW3BhcnNlSW50KGguc2xpY2UoMCwgMiksIDE2KSwgcGFyc2VJbnQoaC5zbGljZSgyLCA0KSwgMTYpLCBwYXJzZUludChoLnNsaWNlKDQsIDYpLCAxNiksIDFdO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbmNvbnN0IHJlbGF0aXZlTHVtaW5hbmNlID0gKFtyLCBnLCBiXTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiBudW1iZXIgPT4ge1xuICBjb25zdCBsaW4gPSAoYzogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgdiA9IGMgLyAyNTU7XG4gICAgcmV0dXJuIHYgPD0gMC4wMzkyOCA/IHYgLyAxMi45MiA6ICgodiArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQ7XG4gIH07XG4gIHJldHVybiAwLjIxMjYgKiBsaW4ocikgKyAwLjcxNTIgKiBsaW4oZykgKyAwLjA3MjIgKiBsaW4oYik7XG59O1xuY29uc3QgY29udHJhc3RSYXRpbyA9IChmZzogc3RyaW5nLCBiZzogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCA9PiB7XG4gIGNvbnN0IGYgPSBwYXJzZVJnYihmZyk7IGNvbnN0IGIgPSBwYXJzZVJnYihiZyk7XG4gIGlmICghZiB8fCAhYikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGxmID0gcmVsYXRpdmVMdW1pbmFuY2UoZik7XG4gIGNvbnN0IGxiID0gcmVsYXRpdmVMdW1pbmFuY2UoYik7XG4gIGNvbnN0IFtsbywgaGldID0gbGYgPiBsYiA/IFtsYiwgbGZdIDogW2xmLCBsYl07XG4gIHJldHVybiBNYXRoLnJvdW5kKCgoaGkgKyAwLjA1KSAvIChsbyArIDAuMDUpKSAqIDEwMCkgLyAxMDA7XG59O1xuLy8gV2FsayB1cCB0aGUgcGFyZW50IGNoYWluIHRvIGZpbmQgdGhlIGZpcnN0IG9wYXF1ZSBiYWNrZ3JvdW5kIGNvbG9yLlxuLy8gTW9zdCBlbGVtZW50cyByZXBvcnQgYHJnYmEoMCwwLDAsMClgICh0cmFuc3BhcmVudCkgZm9yIGJhY2tncm91bmRDb2xvcjtcbi8vIHRoZSBhY3R1YWwgdmlzaWJsZSBiYWNrZ3JvdW5kIGlzIHRoZSBuZWFyZXN0IGFuY2VzdG9yIHRoYXQgcGFpbnRzLlxuY29uc3QgcmVzb2x2ZUJhY2tncm91bmQgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbDtcbiAgd2hpbGUgKGN1cikge1xuICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3VyKTtcbiAgICBjb25zdCBiZyA9IGNzLmJhY2tncm91bmRDb2xvcjtcbiAgICBpZiAoYmcgJiYgYmcgIT09ICdyZ2JhKDAsIDAsIDAsIDApJyAmJiBiZyAhPT0gJ3RyYW5zcGFyZW50JykgcmV0dXJuIGJnO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbmNvbnN0IGNvbXB1dGVBY2Nlc3NpYmlsaXR5Q2hlY2sgPSAoZWw6IEVsZW1lbnQpOiB7Y29udHJhc3RSYXRpbz86IG51bWJlcjsgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7IHRhYmJhYmxlPzogYm9vbGVhbjsgZm9jdXNWaXNpYmxlPzogYm9vbGVhbn0gfCBudWxsID0+IHtcbiAgY29uc3Qgb3V0OiB7Y29udHJhc3RSYXRpbz86IG51bWJlcjsgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7IHRhYmJhYmxlPzogYm9vbGVhbjsgZm9jdXNWaXNpYmxlPzogYm9vbGVhbn0gPSB7fTtcbiAgdHJ5IHtcbiAgICBpZiAoaGFzT3duVGV4dE5vZGUoZWwpKSB7XG4gICAgICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGNvbnN0IGZnID0gY3MuY29sb3I7XG4gICAgICBjb25zdCBiZyA9IHJlc29sdmVCYWNrZ3JvdW5kKGVsKTtcbiAgICAgIGlmIChmZyAmJiBiZykge1xuICAgICAgICBjb25zdCByID0gY29udHJhc3RSYXRpbyhmZywgYmcpO1xuICAgICAgICBpZiAociAhPT0gbnVsbCkge1xuICAgICAgICAgIG91dC5jb250cmFzdFJhdGlvID0gcjtcbiAgICAgICAgICAvLyBVc2UgMThwdCsgLyAxNHB0LWJvbGQgdGhyZXNob2xkcyAoMy4wIC8gNC41KSB3aGVuIGFwcGxpY2FibGU7XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBzdGFuZGFyZCA0LjUgLyA3LjAuXG4gICAgICAgICAgY29uc3QgZm9udFNpemUgPSBwYXJzZUZsb2F0KGNzLmZvbnRTaXplKTtcbiAgICAgICAgICBjb25zdCBpc0JvbGQgPSBwYXJzZUludChjcy5mb250V2VpZ2h0LCAxMCkgPj0gNzAwO1xuICAgICAgICAgIGNvbnN0IGlzTGFyZ2VUZXh0ID0gZm9udFNpemUgPj0gMTggfHwgKGZvbnRTaXplID49IDE0ICYmIGlzQm9sZCk7XG4gICAgICAgICAgY29uc3QgYWEgPSBpc0xhcmdlVGV4dCA/IDMgOiA0LjU7XG4gICAgICAgICAgY29uc3QgYWFhID0gaXNMYXJnZVRleHQgPyA0LjUgOiA3O1xuICAgICAgICAgIG91dC5jb250cmFzdFBhc3NlcyA9IHIgPj0gYWFhID8gJ0FBQScgOiByID49IGFhID8gJ0FBJyA6ICdmYWlsJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBUYWIgb3JkZXIgcHJveHk6IHRhYkluZGV4ID49IDAgT1IgbWF0Y2hlcyB0aGUgbmF0dXJhbC10YWJiYWJsZSBzZXQuXG4gICAgY29uc3QgdGkgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLnRhYkluZGV4O1xuICAgIGNvbnN0IG5hdHVyYWxseVRhYmJhYmxlID0gL14oYXxidXR0b258aW5wdXR8c2VsZWN0fHRleHRhcmVhfGlmcmFtZXxkZXRhaWxzfGF1ZGlvfHZpZGVvKSQvaS50ZXN0KGVsLnRhZ05hbWUpICYmICFlbC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgKGVsLnRhZ05hbWUgIT09ICdBJyB8fCBCb29sZWFuKChlbCBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZikpO1xuICAgIG91dC50YWJiYWJsZSA9IHRpID49IDAgfHwgbmF0dXJhbGx5VGFiYmFibGU7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gQW5pbWF0aW9uLWNvbnRleHQgZmxhZy4gY2FwdHVyZUVudHJ5IGNhbGxzIHRoaXMg4oCUIGlmIGBnZXRBbmltYXRpb25zKClgXG4vLyByZXR1cm5zIGFueXRoaW5nIGFjdGl2ZWx5IHBsYXlpbmcsIHRoZSByZWN0IC8gdHJhbnNmb3JtIC8gb3BhY2l0eSB3ZVxuLy8gY2FwdHVyZWQgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLCBub3QgdGhlXG4vLyBzZXR0bGVkIGxheW91dC4gSGVscHMgYW4gTExNIG5vdCBhbmNob3Igb24gdmFsdWVzIHRoYXQgd29uJ3QgcmVwZWF0LlxuY29uc3QgaGFzQWN0aXZlQW5pbWF0aW9uID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IGZuID0gKGVsIGFzIGFueSkuZ2V0QW5pbWF0aW9ucztcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuICB0cnkge1xuICAgIGNvbnN0IGFuaW1hdGlvbnMgPSBmbi5jYWxsKGVsKSBhcyBBcnJheTx7cGxheVN0YXRlPzogc3RyaW5nfT47XG4gICAgZm9yIChjb25zdCBhIG9mIGFuaW1hdGlvbnMpIHtcbiAgICAgIGlmIChhPy5wbGF5U3RhdGUgPT09ICdydW5uaW5nJykgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gUHJvZHVjdGlvbiBidWlsZHMgbWluaWZ5IGNvbXBvbmVudCBjb25zdHJ1Y3RvciBuYW1lcyB0byAxLTMgY2hhcnNcbi8vIChgQmRgLCBgS2VgLCBgcWFgLCBgJGRgLCBgZThgKS4gVGhlIHN0cmluZyBjYXJyaWVzIHplcm8gc2VtYW50aWNcbi8vIGluZm9ybWF0aW9uIHRvIGFuIExMTSDigJQgaXQncyBqdXN0IG1pbmlmaWVyIG91dHB1dC4gV2UgdHJlYXQgc3VjaCBuYW1lc1xuLy8gYXMgbWlzc2luZyBhbmQgZmFsbCB0aHJvdWdoIHRvIHRoZSBkaXNwbGF5TmFtZSBwYXRoIChvciBkcm9wIHRoZVxuLy8gYGNvbXBvbmVudGAgZmllbGQgZW50aXJlbHkgd2hlbiBuZWl0aGVyIHN1cnZpdmVzIHRoZSBtaW5pZmllcikuXG4vL1xuLy8gSmF2YVNjcmlwdCBpZGVudGlmaWVyLXN0YXJ0IGNoYXJzIGluY2x1ZGUgYCRgIGFuZCBgX2A7IGlkZW50aWZpZXItY29udGludWVcbi8vIGFkZHMgZGlnaXRzLiBSZWFsIGNvbXBvbmVudCBuYW1lcyBhcmUgYWxtb3N0IGFsd2F5cyBjYW1lbENhc2UgLyBQYXNjYWxDYXNlXG4vLyB3b3JkcyDiiaU0IGNoYXJzIChgQnV0dG9uYCwgYFdlYXRoZXJDYXJkYCkuIEFueXRoaW5nIOKJpDMgY2hhcnMgdGhhdCB1c2VzIHRoZVxuLy8gbWluaWZpZXIgYWxwaGFiZXQgaXMgdHJlYXRlZCBhcyBqdW5rLlxuY29uc3QgTUlOSUZJRURfTkFNRV9SRSA9IC9eW0EtWmEteiRfXVtBLVphLXowLTkkX117MCwyfSQvO1xuY29uc3QgQlVORExFUl9TQ0FGRk9MRF9OQU1FUyA9IG5ldyBTZXQoW1xuICAnQW5vbnltb3VzJywgJ2Fub255bW91cycsICdkZWZhdWx0JywgJ19kZWZhdWx0JyxcbiAgLy8gVnVlIFNGQyBjb21waWxlciBzdGFtcHMgZXZlcnkgYDxzY3JpcHQgc2V0dXA+YCBkZWZhdWx0IGV4cG9ydCB3aXRoIHRoaXNcbiAgLy8gc2VudGluZWwgd2hlbiBubyBleHBsaWNpdCBgbmFtZWAgaXMgc2V0IOKAlCBzZW1hbnRpY2FsbHkgZW1wdHkuXG4gICdfc2ZjX21haW4nLCAnc2ZjX21haW4nLFxuXSk7XG5jb25zdCBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lID0gKG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IHtcbiAgaWYgKCFuYW1lKSByZXR1cm4gZmFsc2U7XG4gIGlmIChCVU5ETEVSX1NDQUZGT0xEX05BTUVTLmhhcyhuYW1lKSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoTUlOSUZJRURfTkFNRV9SRS50ZXN0KG5hbWUpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gLS0tLSBSZWFjdCAvIFZ1ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCByZWFjdEluZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHJlYWN0S2V5ID0gT2JqZWN0LmtleXMoZWwpLmZpbmQoKGspID0+XG4gICAgay5zdGFydHNXaXRoKCdfX3JlYWN0RmliZXIkJykgfHwgay5zdGFydHNXaXRoKCdfX3JlYWN0SW50ZXJuYWxJbnN0YW5jZSQnKSk7XG4gIGlmICghcmVhY3RLZXkpIHJldHVybiBudWxsO1xuICBsZXQgbm9kZTogYW55ID0gKGVsIGFzIGFueSlbcmVhY3RLZXldO1xuICBjb25zdCBzZWVuID0gbmV3IFNldDxhbnk+KCk7XG4gIGxldCByZXN1bHQ6IEZyYW1ld29ya0luZm8gfCBudWxsID0gbnVsbDtcbiAgd2hpbGUgKG5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmICFzZWVuLmhhcyhub2RlKSkge1xuICAgIHNlZW4uYWRkKG5vZGUpO1xuICAgIGNvbnN0IHR5cGUgPSBub2RlLnR5cGUgfHwgbm9kZS5lbGVtZW50VHlwZTtcbiAgICBpZiAoIXJlc3VsdD8ubmFtZSAmJiB0eXBlICYmIHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgLy8gZGlzcGxheU5hbWUgaXMgZGV2ZWxvcGVyLXN1cHBsaWVkIChSZWFjdC5kaXNwbGF5TmFtZSwgZm9yd2FyZFJlZlxuICAgICAgLy8gd3JhcHBlciBuYW1lcykgYW5kIHN1cnZpdmVzIG1pbmlmaWNhdGlvbiB3aGVuIHNldCBleHBsaWNpdGx5LiBQcmVmZXJcbiAgICAgIC8vIGl0LiB0eXBlLm5hbWUgaXMgdGhlIGNvbnN0cnVjdG9yLm5hbWUgc3RyaW5nLCB3aGljaCBtaW5pZmllcyB0b1xuICAgICAgLy8ganVuayBsaWtlIFwiQmRcIiBpbiBwcm9kIGJ1aWxkcyDigJQgb25seSBhY2NlcHQgaXQgaWYgaXQgc3Vydml2ZXMgdGhlXG4gICAgICAvLyBtZWFuaW5nZnVsLW5hbWUgZmlsdGVyLlxuICAgICAgY29uc3QgZGlzcGxheSA9IHR5cGVvZiB0eXBlLmRpc3BsYXlOYW1lID09PSAnc3RyaW5nJyA/IHR5cGUuZGlzcGxheU5hbWUgOiBudWxsO1xuICAgICAgY29uc3QgY3Rvck5hbWUgPSB0eXBlb2YgdHlwZS5uYW1lID09PSAnc3RyaW5nJyA/IHR5cGUubmFtZSA6IG51bGw7XG4gICAgICBjb25zdCBjYW5kID0gaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShkaXNwbGF5KVxuICAgICAgICA/IGRpc3BsYXkhXG4gICAgICAgIDogaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShjdG9yTmFtZSkgPyBjdG9yTmFtZSEgOiBudWxsO1xuICAgICAgaWYgKGNhbmQpIHtcbiAgICAgICAgcmVzdWx0ID0ge2ZyYW1ld29yazogJ3JlYWN0JywgbmFtZTogdHJpbVRleHQoY2FuZCwgMTIwKX07XG4gICAgICAgIGlmIChkaXNwbGF5ICYmIGRpc3BsYXkgIT09IGNhbmQpIHtcbiAgICAgICAgICByZXN1bHQuZGlzcGxheU5hbWUgPSB0cmltVGV4dChkaXNwbGF5LCAxODApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZXN1bHQgJiYgIXJlc3VsdC5zb3VyY2UgJiYgbm9kZS5fZGVidWdTb3VyY2UpIHtcbiAgICAgIHJlc3VsdC5zb3VyY2UgPSB7XG4gICAgICAgIGZpbGU6IG5vZGUuX2RlYnVnU291cmNlLmZpbGVOYW1lIHx8IG5vZGUuX2RlYnVnU291cmNlLmZpbGUgfHwgbnVsbCxcbiAgICAgICAgbGluZTogbm9kZS5fZGVidWdTb3VyY2UubGluZU51bWJlciB8fCBub2RlLl9kZWJ1Z1NvdXJjZS5saW5lIHx8IG51bGwsXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobm9kZS5fZGVidWdPd25lcikgeyBub2RlID0gbm9kZS5fZGVidWdPd25lcjsgY29udGludWU7IH1cbiAgICBpZiAobm9kZS5yZXR1cm4pIHsgbm9kZSA9IG5vZGUucmV0dXJuOyBjb250aW51ZTsgfVxuICAgIGJyZWFrO1xuICB9XG4gIC8vIE5vIHVzYWJsZSBuYW1lIOKGkiBlbWl0IG5vdGhpbmcgcmF0aGVyIHRoYW4gYHtmcmFtZXdvcms6XCJyZWFjdFwifWAgd2l0aCBhXG4gIC8vIG15c3RlcnkgMi1jaGFyIG5hbWUuIEFuIExMTSByZWFkaW5nIHRoZSBleHBvcnQgbGVhcm5zIG5vdGhpbmcgZnJvbVxuICAvLyBlaXRoZXIgc2hhcGU7IHN1cHByZXNzaW5nIGtlZXBzIHRoZSByb3cgaG9uZXN0LlxuICBpZiAoIXJlc3VsdD8ubmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gV2FsayB0aGUgZmliZXIgY2hhaW4gdG8gY29sbGVjdCBhbmNlc3RvciBjb21wb25lbnQgbmFtZXMuIFRoZVxuICAvLyBgX2RlYnVnT3duZXJgIHBhdGggaXMgbW9yZSBtZWFuaW5nZnVsIHRoYW4gYHJldHVybmAgKGl0IHNraXBzIGhvc3RcbiAgLy8gd3JhcHBlcnMpLCBidXQgd2UgZmFsbCBiYWNrIHRvIGByZXR1cm5gIHdoZW4gb3duZXIgZGF0YSBpc1xuICAvLyB1bmF2YWlsYWJsZSAocHJvZHVjdGlvbiBidWlsZHMpLiBDYXAgYXQgOCBhbmNlc3RvcnMgc28gdGhlIGZpZWxkXG4gIC8vIGRvZXNuJ3QgYmFsbG9vbiBmb3IgZGVlcGx5LW5lc3RlZCBhcHBzLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3Qgc2VlbkNoYWluID0gbmV3IFNldDxhbnk+KCk7XG4gIGxldCB3YWxrZXI6IGFueSA9IChlbCBhcyBhbnkpW3JlYWN0S2V5XTtcbiAgd2hpbGUgKHdhbGtlciAmJiB0eXBlb2Ygd2Fsa2VyID09PSAnb2JqZWN0JyAmJiAhc2VlbkNoYWluLmhhcyh3YWxrZXIpICYmIGNoYWluLmxlbmd0aCA8IDgpIHtcbiAgICBzZWVuQ2hhaW4uYWRkKHdhbGtlcik7XG4gICAgY29uc3QgdCA9IHdhbGtlci50eXBlIHx8IHdhbGtlci5lbGVtZW50VHlwZTtcbiAgICBpZiAodCAmJiB0eXBlb2YgdCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IG4gPSAodHlwZW9mIHQuZGlzcGxheU5hbWUgPT09ICdzdHJpbmcnICYmIGlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUodC5kaXNwbGF5TmFtZSkpXG4gICAgICAgID8gdC5kaXNwbGF5TmFtZVxuICAgICAgICA6ICh0eXBlb2YgdC5uYW1lID09PSAnc3RyaW5nJyAmJiBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKHQubmFtZSkpXG4gICAgICAgICAgPyB0Lm5hbWVcbiAgICAgICAgICA6IG51bGw7XG4gICAgICBpZiAobiAmJiAoY2hhaW4ubGVuZ3RoID09PSAwIHx8IGNoYWluW2NoYWluLmxlbmd0aCAtIDFdICE9PSBuKSkgY2hhaW4ucHVzaChuKTtcbiAgICB9XG4gICAgd2Fsa2VyID0gd2Fsa2VyLl9kZWJ1Z093bmVyID8/IHdhbGtlci5yZXR1cm47XG4gIH1cbiAgaWYgKGNoYWluLmxlbmd0aCA+IDApIHJlc3VsdC5jaGFpbiA9IGNoYWluO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgdnVlSW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgY29uc3QgdjogYW55ID0gKGVsIGFzIGFueSk/Ll9fdnVlUGFyZW50Q29tcG9uZW50IHx8IChlbCBhcyBhbnkpPy5fX3Z1ZV9hcHBfXz8uX2luc3RhbmNlIHx8XG4gICAgKGVsIGFzIGFueSk/Ll9fdm5vZGU/LmNvbXBvbmVudCB8fCAoZWwgYXMgYW55KT8uX192dWVfXztcbiAgY29uc3QgdHlwZSA9IHY/LnR5cGUgfHwgdj8uY3R4Py50eXBlO1xuICAvLyB0eXBlLm5hbWUgaXMgZGV2ZWxvcGVyLXNldCB2aWEgYG5hbWU6ICdNeUNvbXAnYDsgdHlwZS5fX25hbWUgaXNcbiAgLy8gcG9wdWxhdGVkIGJ5IGA8c2NyaXB0IHNldHVwPmAgYW5kIHRvb2xzIHRoYXQgaW5mZXIgdGhlIGZpbGVuYW1lLiBCb3RoXG4gIC8vIGFyZSByZWFsIG5hbWVzIGluIGRldjsgcHJvZCBidWlsZHMgY2FuIGxlYXZlIG9ubHkgYSBtaW5pZmllZCBnbHlwaC5cbiAgY29uc3QgcmF3TmFtZSA9IHR5cGU/Lm5hbWUgfHwgdHlwZT8uX19uYW1lO1xuICBpZiAoIWlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUocmF3TmFtZSkpIHJldHVybiBudWxsO1xuICBjb25zdCByZXN1bHQ6IEZyYW1ld29ya0luZm8gPSB7XG4gICAgZnJhbWV3b3JrOiAndnVlJyxcbiAgICBuYW1lOiB0cmltVGV4dChyYXdOYW1lLCAxNjApLFxuICAgIHNvdXJjZToge2ZpbGU6IHR5cGU/Ll9fZmlsZSB8fCBudWxsfSxcbiAgfTtcbiAgLy8gV2FsayB0aGUgcGFyZW50LWNvbXBvbmVudCBjaGFpbi5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGxldCBjdXI6IGFueSA9IHY7XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PGFueT4oKTtcbiAgd2hpbGUgKGN1ciAmJiB0eXBlb2YgY3VyID09PSAnb2JqZWN0JyAmJiAhc2Vlbi5oYXMoY3VyKSAmJiBjaGFpbi5sZW5ndGggPCA4KSB7XG4gICAgc2Vlbi5hZGQoY3VyKTtcbiAgICBjb25zdCB0ID0gY3VyLnR5cGUgfHwgY3VyLmN0eD8udHlwZTtcbiAgICBjb25zdCBuID0gdD8ubmFtZSA/PyB0Py5fX25hbWU7XG4gICAgaWYgKHR5cGVvZiBuID09PSAnc3RyaW5nJyAmJiBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKG4pKSB7XG4gICAgICBpZiAoY2hhaW4ubGVuZ3RoID09PSAwIHx8IGNoYWluW2NoYWluLmxlbmd0aCAtIDFdICE9PSBuKSBjaGFpbi5wdXNoKG4pO1xuICAgIH1cbiAgICBjdXIgPSBjdXIucGFyZW50O1xuICB9XG4gIGlmIChjaGFpbi5sZW5ndGggPiAwKSByZXN1bHQuY2hhaW4gPSBjaGFpbjtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIExpdCAobGl0LWVsZW1lbnQpIOKAlCBpbnN0YW5jZXMgYXJlIGN1c3RvbSBlbGVtZW50cyB3aG9zZSBjb25zdHJ1Y3RvclxuLy8gY2FycmllcyBgXyRsaXRFbGVtZW50JGAsIGBlbGVtZW50UHJvcGVydGllc2AsIG9yIGBzdHlsZXNgLiBUaGUgdGFnIGlzXG4vLyB0aGUgY29tcG9uZW50J3MgaWRlbnRpdHk7IHRoZSBjb25zdHJ1Y3RvciBuYW1lIGlzIHRoZSBkZXZlbG9wZXItZmFjaW5nXG4vLyBjbGFzcyBuYW1lIHdoZW4gcHJvdmlkZWQuXG5jb25zdCBsaXRJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT4ge1xuICBpZiAoIWVsLnRhZ05hbWUuaW5jbHVkZXMoJy0nKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGN0b3I6IGFueSA9IGVsLmNvbnN0cnVjdG9yO1xuICBpZiAoIWN0b3IpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0xpdCA9IEJvb2xlYW4oXG4gICAgY3Rvci5fJGxpdEVsZW1lbnQkIHx8XG4gICAgY3Rvci5lbGVtZW50UHJvcGVydGllcyB8fFxuICAgIGN0b3IuXyRsaXRFbGVtZW50VmVyc2lvbiQgfHxcbiAgICAoY3Rvci5zdHlsZXMgJiYgQXJyYXkuaXNBcnJheShjdG9yLnN0eWxlcykpLFxuICApO1xuICBpZiAoIWlzTGl0KSByZXR1cm4gbnVsbDtcbiAgLy8gY3Rvci5uYW1lIGluIHByb2QgaXMgYSAyLWNoYXIgbWluaWZpZXIgZ2x5cGguIFRoZSB0YWcgaXMgdGhlXG4gIC8vIGRldmVsb3Blci1mYWNpbmcgaWRlbnRpdHkgZm9yIGFueSBjdXN0b20gZWxlbWVudCDigJQgdXNlIGl0IGFzIHRoZVxuICAvLyBjYW5vbmljYWwgbmFtZSB3aGVuIGN0b3IubmFtZSBpcyBtaW5pZmllZCBhd2F5LlxuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGN0b3JOYW1lID0gdHlwZW9mIGN0b3IubmFtZSA9PT0gJ3N0cmluZycgPyBjdG9yLm5hbWUgOiBudWxsO1xuICBjb25zdCBuYW1lID0gaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShjdG9yTmFtZSkgPyBjdG9yTmFtZSEgOiB0YWc7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnbGl0JyxcbiAgICBuYW1lOiB0cmltVGV4dChuYW1lLCAxMjApLFxuICAgIGRpc3BsYXlOYW1lOiB0YWcsXG4gIH07XG59O1xuXG4vLyBTdGVuY2lsIGNvbXBvbmVudHMg4oCUIGN1c3RvbSBlbGVtZW50cyB3aG9zZSBjb25zdHJ1Y3RvciBleHBvc2VzIGFcbi8vIHN0YXRpYyBgaXNgICh0aGUgdGFnKSwgYW5kIHdoaWNoIGNhcnJ5IHN0ZW5jaWwtaW50ZXJuYWwgcHJvcHMgb24gdGhlXG4vLyBob3N0IChgX19ob3N0Q3NzYCwgYHMtaWRgLCBgX19zdGVuY2lsX3N1YnNjcmliZXJJZGAsIGV0YykuXG5jb25zdCBzdGVuY2lsSW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgaWYgKCFlbC50YWdOYW1lLmluY2x1ZGVzKCctJykpIHJldHVybiBudWxsO1xuICBjb25zdCBjdG9yOiBhbnkgPSBlbC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCFjdG9yKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbG9va3NTdGVuY2lsID0gQm9vbGVhbihcbiAgICB0eXBlb2YgY3Rvci5pcyA9PT0gJ3N0cmluZycgJiYgY3Rvci5pcy5pbmNsdWRlcygnLScpIHx8XG4gICAgKGVsIGFzIGFueSkuX19ob3N0Q3NzICE9PSB1bmRlZmluZWQgfHxcbiAgICAoZWwgYXMgYW55KS5fX3N0ZW5jaWxfc3Vic2NyaWJlcklkICE9PSB1bmRlZmluZWQgfHxcbiAgICBlbC5oYXNBdHRyaWJ1dGUoJ3MtaWQnKSxcbiAgKTtcbiAgaWYgKCFsb29rc1N0ZW5jaWwpIHJldHVybiBudWxsO1xuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIC8vIGBjdG9yLmlzYCBpcyB0aGUgU3RlbmNpbC1zdGF0aWMgdGFnIGRlY2xhcmF0aW9uIChhbHdheXMgcHJlc2VudCwgYWx3YXlzXG4gIC8vIG1lYW5pbmdmdWwpLiBgY3Rvci5uYW1lYCBpcyB0aGUgbWluaWZpZWQgY2xhc3MgbmFtZSBpbiBwcm9kLiBGYWxsIGJhY2tcbiAgLy8gdGhyb3VnaCB0aGUgc2FtZSBtZWFuaW5nZnVsbmVzcyBmaWx0ZXIgYXMgdGhlIG90aGVyIGZyYW1ld29ya3MuXG4gIGNvbnN0IGlzRmllbGQgPSB0eXBlb2YgY3Rvci5pcyA9PT0gJ3N0cmluZycgPyBjdG9yLmlzIDogbnVsbDtcbiAgY29uc3QgY3Rvck5hbWUgPSB0eXBlb2YgY3Rvci5uYW1lID09PSAnc3RyaW5nJyA/IGN0b3IubmFtZSA6IG51bGw7XG4gIGNvbnN0IG5hbWUgPSBpc0ZpZWxkIHx8IChpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKGN0b3JOYW1lKSA/IGN0b3JOYW1lISA6IHRhZyk7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnc3RlbmNpbCcsXG4gICAgbmFtZTogdHJpbVRleHQobmFtZSwgMTIwKSxcbiAgICBkaXNwbGF5TmFtZTogdGFnLFxuICB9O1xufTtcblxuLy8gU3ZlbHRlIOKAlCBydW50aW1lIGluc3RhbmNlIGxvb2t1cCBpcyBzcGFyc2UsIGJ1dCB0aGUgZGV2LW1vZGVcbi8vIGNvbXBpbGVyIGF0dGFjaGVzIGBfX3N2ZWx0ZV9tZXRhYCB0byBlbGVtZW50cyB3aXRoIHNvdXJjZS1sb2MgaW5mb1xuLy8gKGB7IGxvYzogeyBmaWxlLCBsaW5lLCBjaGFyIH0gfWApLiBJbiBwcm9kIHRoYXQgcHJvcGVydHkgaXMgYWJzZW50LFxuLy8gc28gZGV0ZWN0aW9uIHNpbGVudGx5IGZhbGxzIHRocm91Z2guXG5jb25zdCBzdmVsdGVJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT4ge1xuICBjb25zdCBtZXRhOiBhbnkgPSAoZWwgYXMgYW55KS5fX3N2ZWx0ZV9tZXRhO1xuICBpZiAoIW1ldGE/LmxvYykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGZpbGUgPSB0eXBlb2YgbWV0YS5sb2MuZmlsZSA9PT0gJ3N0cmluZycgPyBtZXRhLmxvYy5maWxlIDogbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBmcmFtZXdvcms6ICdzdmVsdGUnLFxuICAgIG5hbWU6IHRyaW1UZXh0KGZpbGUgPz8gJ3N2ZWx0ZS1jb21wb25lbnQnLCAxNjApLFxuICAgIHNvdXJjZToge1xuICAgICAgZmlsZSxcbiAgICAgIGxpbmU6IHR5cGVvZiBtZXRhLmxvYy5saW5lID09PSAnbnVtYmVyJyA/IG1ldGEubG9jLmxpbmUgOiBudWxsLFxuICAgIH0sXG4gIH07XG59O1xuXG4vLyBHZW5lcmljIHdlYi1jb21wb25lbnQgZmFsbGJhY2sg4oCUIHdoZW4gdGhlIGVsZW1lbnQgaGFzIGEgY3VzdG9tLWVsZW1lbnRcbi8vIHRhZyAoa2ViYWItY2FzZSkgYW5kIGBjdXN0b21FbGVtZW50cy5nZXQoLi4uKWAgcmVjb2duaXplcyBpdCwgYnV0IG5vXG4vLyBmcmFtZXdvcmstc3BlY2lmaWMgbWFya2VyIG1hdGNoZWQuIENhcHR1cmVzIHRoZSB0YWcgYXMgdGhlIGlkZW50aXR5LlxuY29uc3Qgd2ViQ29tcG9uZW50SW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIXRhZy5pbmNsdWRlcygnLScpKSByZXR1cm4gbnVsbDtcbiAgdHJ5IHtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUVsZW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiBjdXN0b21FbGVtZW50cy5nZXQodGFnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZnJhbWV3b3JrOiAnd2ViLWNvbXBvbmVudCcsXG4gICAgICAgIG5hbWU6IHRhZyxcbiAgICAgICAgZGlzcGxheU5hbWU6IHRhZyxcbiAgICAgIH07XG4gICAgfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyBQbHVnLWluIHN0eWxlOiB0cnkgUmVhY3QgZmlyc3QgKG1vc3QgY29tbW9uIGluIG91ciBjYXB0dXJlZCBhcHBzKSxcbi8vIHRoZW4gVnVlLCB0aGVuIExpdCAvIFN0ZW5jaWwgLyBTdmVsdGUgLyBnZW5lcmljIHdlYi1jb21wb25lbnQuIEZpcnN0XG4vLyByZXNvbHZlciB0byByZXR1cm4gbm9uLW51bGwgd2lucy5cbmNvbnN0IGZyYW1ld29ya0luZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PlxuICByZWFjdEluZm8oZWwpIHx8IHZ1ZUluZm8oZWwpIHx8IGxpdEluZm8oZWwpIHx8IHN0ZW5jaWxJbmZvKGVsKSB8fCBzdmVsdGVJbmZvKGVsKSB8fCB3ZWJDb21wb25lbnRJbmZvKGVsKTtcblxuLy8gLS0tLSBDYXB0dXJlOiBhc3NlbWJsZSB0aGUgZnVsbCBlbnRyeSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU3RyaXAgdGhlIGJvZHkgb2YgbG9uZyBgZGF0YTpgIFVSSXMgKFBsYXNtaWMncyBhc3BlY3QtcmF0aW8gU1ZHIHNwYWNlcnMsXG4vLyBpbmxpbmVkIFBORy9KUEVHIGZhbGxiYWNrcykgc2luY2UgdGhlIGJhc2U2NCBwYXlsb2FkIGlzIG1lY2hhbmlzbSwgbm90XG4vLyBzaWduYWwuIEtlZXAgdGhlIHNjaGVtZSArIGEgbGVuZ3RoIGhpbnQgc28gYW4gTExNIGNhbiB0ZWxsIHNvbWV0aGluZ1xuLy8gd2FzIGVsaWRlZC5cbmNvbnN0IGVsaWRlRGF0YVVyaXMgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWwucmVwbGFjZSgvZGF0YTooW1xcdy8rLi1dKyk7YmFzZTY0LChbQS1aYS16MC05Ky89XXs2MCx9KS9nLFxuICAgIChfbSwgbWltZTogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpID0+XG4gICAgICBgZGF0YToke21pbWV9O2Jhc2U2NCxbJHtwYXlsb2FkLmxlbmd0aH0tY2hhciBiYXNlNjQgZWxpZGVkXWApO1xuXG4vLyBSZXBsYWNlIGlubGluZSBpY29uIFNWR3Mgd2l0aCBwbGFjZWhvbGRlcnMuIFRoZSBwYXRoIGRhdGEgb2YgYVxuLy8gTHVjaWRlL0hlcm9pY29uIHJlZnJlc2ggaWNvbiBpcyB+MjgwIGJ5dGVzIHRoYXQgYW4gTExNIGRvZXNuJ3QgbmVlZCDigJRcbi8vIHRoZSBzdXJyb3VuZGluZyBidXR0b24gY2FwdGlvbiBhbHJlYWR5IHRlbGxzIGl0IHdoYXQgdGhlIGljb24gbWVhbnMuXG4vL1xuLy8gQSBzdHJpcHBlZC1kb3duIGA8c3ZnLz5gIGxvc2VzIGljb24gaWRlbnRpdHkgKHdoaWNoIGx1Y2lkZS9mZWF0aGVyL1xuLy8gaGVyb2ljb24gd2FzIHVzZWQ/IHdoYXQgYXJpYS1sYWJlbCBkZXNjcmliZWQgaXQ/IHdoYXQgY2xhc3MgZGlkIGl0XG4vLyBjYXJyeT8pLiBXZSBwcmVzZXJ2ZSBldmVyeSBzaWduYWwgdGhhdCBoZWxwcyBhIHJlcGFpciBhZ2VudCBsb2NhdGVcbi8vIHRoZSBpY29uIGRlZmluaXRpb24gd2l0aG91dCBrZWVwaW5nIHRoZSBwYXRoIGRhdGE6XG4vLyAgIOKAoiBhcmlhLWxhYmVsLCByb2xlLCB0aXRsZSAgICAgICAgIOKAlCBhY2Nlc3NpYmxlIGlkZW50aXR5XG4vLyAgIOKAoiBkYXRhLWljb24sIGRhdGEtbHVjaWRlLCBkYXRhLSogIOKAlCBjb21tb24gaWNvbi1saWJyYXJ5IGhpbnRzXG4vLyAgIOKAoiBjbGFzcyAgICAgICAgICAgICAgICAgICAgICAgICAgICDigJQgc3R5bGUgaG9va3MgKGAuaWNvbi10cmFzaC0yYClcbi8vICAg4oCiIHdpZHRoLCBoZWlnaHQgICAgICAgICAgICAgICAgICAgIOKAlCByZW5kZXJlZCBzaXplXG4vLyAgIOKAoiB2aWV3Qm94ICAgICAgICAgICAgICAgICAgICAgICAgICDigJQgY29vcmRpbmF0ZSBzeXN0ZW0gKGhlbHBzXG4vLyAgICAgbWF0Y2ggYWdhaW5zdCBhIGtub3duIGljb24gbGlicmFyeSBieSBhc3BlY3QgcmF0aW8pXG4vLyAgIOKAoiA8dGl0bGU+LzxkZXNjPiBmaXJzdC1jaGlsZCB0ZXh0IOKAlCBBUklBLXJlY29tbWVuZGVkIGExMXkgY2hpbGRyZW5cbmNvbnN0IFBSRVNFUlZFRF9TVkdfQVRUUl9QUkVGSVhFUyA9IFsnZGF0YS0nLCAnYXJpYS0nXTtcbmNvbnN0IFBSRVNFUlZFRF9TVkdfQVRUUlMgPSBuZXcgU2V0KFsncm9sZScsICdjbGFzcycsICd3aWR0aCcsICdoZWlnaHQnLCAndmlld0JveCcsICd0aXRsZScsICduYW1lJywgJ2ZpbGwnXSk7XG5jb25zdCBlbGlkZUlubGluZVN2Z3MgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWwucmVwbGFjZSgvPHN2Z1xcYihbXj5dKik+KFtcXHNcXFNdKj8pPFxcL3N2Zz4vZywgKF9tLCBhdHRyczogc3RyaW5nLCBib2R5OiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgLy8gUGx1Y2sgZXZlcnkgcHJlc2VydmVkIGF0dHJpYnV0ZSBieSByZWdleCBvdmVyIHRoZSByYXcgYXR0cnMgc3RyaW5nLlxuICAgIC8vIFRoZSByZWdleCB0b2xlcmF0ZXMgdW5xdW90ZWQgdmFsdWVzICsgZG91YmxlICsgc2luZ2xlIHF1b3Rlcy5cbiAgICBjb25zdCBhdHRyUmUgPSAvKFtcXHc6LV0rKVxccyo9XFxzKig/OlwiKFteXCJdKilcInwnKFteJ10qKSd8KFxcUyspKS9nO1xuICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICAgIHdoaWxlICgobSA9IGF0dHJSZS5leGVjKGF0dHJzKSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBtWzFdITtcbiAgICAgIGNvbnN0IHYgPSBtWzJdID8/IG1bM10gPz8gbVs0XSA/PyAnJztcbiAgICAgIGNvbnN0IGtlZXAgPSBQUkVTRVJWRURfU1ZHX0FUVFJTLmhhcyhuYW1lKSB8fCBQUkVTRVJWRURfU1ZHX0FUVFJfUFJFRklYRVMuc29tZSgocCkgPT4gbmFtZS5zdGFydHNXaXRoKHApKTtcbiAgICAgIGlmIChrZWVwKSBvdXQucHVzaChgJHtuYW1lfT1cIiR7di5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyl9XCJgKTtcbiAgICB9XG4gICAgLy8gU3VyZmFjZSBpbm5lciA8dGl0bGU+LzxkZXNjPiB0ZXh0IOKAlCBBUklBLXJlY29tbWVuZGVkIHdheSB0byBsYWJlbFxuICAgIC8vIGFuIFNWRywgYW5kIG9mdGVuIHRoZSBvbmx5IHNpZ25hbCBvZiBpY29uIG1lYW5pbmcgd2hlbiBubyBhcmlhXG4gICAgLy8gYXR0cmlidXRlcyBhcmUgc2V0IG9uIHRoZSBob3N0LlxuICAgIGNvbnN0IHRpdGxlVGV4dCA9IC88dGl0bGVbXj5dKj4oW1xcc1xcU10qPyk8XFwvdGl0bGU+Ly5leGVjKGJvZHkpPy5bMV0/LnRyaW0oKTtcbiAgICBpZiAodGl0bGVUZXh0KSBvdXQucHVzaChgZGF0YS1wZy1zdmctdGl0bGU9XCIke3RpdGxlVGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyl9XCJgKTtcbiAgICBjb25zdCBkZXNjVGV4dCA9IC88ZGVzY1tePl0qPihbXFxzXFxTXSo/KTxcXC9kZXNjPi8uZXhlYyhib2R5KT8uWzFdPy50cmltKCk7XG4gICAgaWYgKGRlc2NUZXh0KSBvdXQucHVzaChgZGF0YS1wZy1zdmctZGVzYz1cIiR7ZGVzY1RleHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpfVwiYCk7XG4gICAgb3V0LnB1c2goJ2RhdGEtcGctZWxpZGVkPVwic3ZnXCInKTtcbiAgICByZXR1cm4gYDxzdmcgJHtvdXQuam9pbignICcpfS8+YDtcbiAgfSk7XG5cbi8vIGA8c2NyaXB0PmAgY29udGVudCBjYW4gY2FycnkgYm9vdHN0cmFwIGRhdGEgKGB3aW5kb3cuX19BUFBfREFUQV9fID1cbi8vIHt0b2tlbjogXCIuLi5cIn1gKSwgQVBJIGtleXMsIHZlbmRvciBhbmFseXRpY3Mga2V5cywgYW5kIGJhY2tlbmQgVVJMcy5cbi8vIGA8c3R5bGU+YCBjb250ZW50IGlzIHVzdWFsbHkgaXJyZWxldmFudCBub2lzZS4gYDxtZXRhPmAgZWxlbWVudHMgb2Z0ZW5cbi8vIGNhcnJ5IENTUkYvQ1NQIHRva2Vucy4gU3RyaXAgdGhlIGlubmVyIGNvbnRlbnRzIG9mIGFsbCB0aHJlZS5cbmNvbnN0IHN0cmlwRGFuZ2Vyb3VzRWxlbWVudHMgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWxcbiAgICAucmVwbGFjZSgvPHNjcmlwdFxcYltePl0qPltcXHNcXFNdKj88XFwvXFxzKnNjcmlwdCg/Olxcc1tePl0qKT8+L2dpLCAnPHNjcmlwdCBkYXRhLXBnLWVsaWRlZD1cInNjcmlwdC1jb250ZW50XCIvPicpXG4gICAgLnJlcGxhY2UoLzxzdHlsZVxcYltePl0qPltcXHNcXFNdKj88XFwvXFxzKnN0eWxlXFxzKj4vZ2ksICc8c3R5bGUgZGF0YS1wZy1lbGlkZWQ9XCJzdHlsZS1jb250ZW50XCIvPicpXG4gICAgLnJlcGxhY2UoLzxtZXRhXFxiW14+XSpcXGJjb250ZW50PVwiW15cIl0qXCJbXj5dKj4vZ2ksIChtKSA9PiB7XG4gICAgICAvLyBLZWVwIG1ldGEgbmFtZS9jaGFyc2V0IHZpc2libGUgYnV0IHJlZGFjdCBgY29udGVudGAgaWYgdGhlIG5hbWVcbiAgICAgIC8vIGxvb2tzIHRva2VuLWJlYXJpbmcuXG4gICAgICBjb25zdCBuYW1lTWF0Y2ggPSAvXFxibmFtZT1cIihbXlwiXSopXCIvLmV4ZWMobSk7XG4gICAgICBjb25zdCBuYW1lID0gbmFtZU1hdGNoPy5bMV0gPz8gJyc7XG4gICAgICBpZiAoLyhjc3JmfHRva2VufHhzcmZ8bm9uY2V8YXBpW18tXT9rZXkpL2kudGVzdChuYW1lKSkge1xuICAgICAgICByZXR1cm4gbS5yZXBsYWNlKC9cXGJjb250ZW50PVwiW15cIl0qXCIvLCAnY29udGVudD1cIltyZWRhY3RlZDogbWV0YS10b2tlbl1cIicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbi8vIENhcCBvdXRlckhUTUwgdG8gYSBjbG9uZSBvZiB0aGUgbGl2ZSBlbGVtZW50IHdpdGggZGVzY2VuZGFudHMgYmV5b25kXG4vLyBgbWF4RGVwdGhgIGxldmVscyByZXBsYWNlZCBieSBgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gIG1hcmtlcnMuIFRoZVxuLy8gcm9hc3QgY2FsbGVkIG91dCBhIHNpbmdsZSBncm91cGVkIGNhcHR1cmUgY29taW5nIGJhY2sgYXQgMjUgS0IgYmVjYXVzZVxuLy8gdGhlIGBvdXRlckhUTUxgIHN3YWxsb3dlZCA2MCBzcGFya2xpbmUgZGF0YSBzcGFucyDigJQgZXhhY3RseSB3aGF0IGFcbi8vIGRlcHRoIGNhcCBzb2x2ZXMgYXQgdGhlIHNvdXJjZS4gUmV0dXJucyB0aGUgY2xvbmVkIG91dGVySFRNTCBhbmQgaG93XG4vLyBtYW55IGRlc2NlbmRhbnQgc3VidHJlZXMgd2VyZSBlbGlkZWQuXG4vLyBTZXJpYWxpemUgYW4gZWxlbWVudCdzIHNoYWRvd1Jvb3QgY29udGVudCBhcyBgPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPVwi4oCmXCI+4oCmPC90ZW1wbGF0ZT5gLlxuLy8gYGNsb25lTm9kZSh0cnVlKWAgZG9lcyBOT1QgaW5jbHVkZSBzaGFkb3cgRE9NLCBzbyBjYXB0dXJlcyBvZiBjdXN0b20tZWxlbWVudFxuLy8gaG9zdHMgKExpdCdzIGA8Zm9yZWNhc3QtaXRlbT5gLCBTdGVuY2lsIGNvbXBvbmVudHMsIGdlbmVyaWMgd2ViLWNvbXBvbmVudHMpXG4vLyB3b3VsZCBvdGhlcndpc2UgY29tZSBiYWNrIGFzIGA8Zm9yZWNhc3QtaXRlbT48L2ZvcmVjYXN0LWl0ZW0+YCDigJQgYW4gTExNXG4vLyByZWFkaW5nIHRoYXQgcm93IHNlZXMgbm90aGluZyBhYm91dCB3aGF0IHRoZSBob3N0IGFjdHVhbGx5IHJlbmRlcnMuIFdlIHVzZVxuLy8gdGhlIGRlY2xhcmF0aXZlLXNoYWRvdy1ET00gc2VyaWFsaXphdGlvbiBzaGFwZSBzbyB0aGUgTExNIChhbmQgYW55IHRvb2xpbmcpXG4vLyBjYW4gdGVsbCBzaGFkb3cgY29udGVudCBmcm9tIGxpZ2h0LURPTSBjaGlsZHJlbiwgQU5EIHNvIHRoZSBwYXlsb2FkIGlzXG4vLyByb3VuZC10cmlwcGFibGUgaW50byBhbm90aGVyIGJyb3dzZXIgaWYgYSBjb25zdW1lciB3YW50cyB0by5cbmNvbnN0IHNlcmlhbGl6ZVNoYWRvd0NvbnRlbnQgPSAoaG9zdDogRWxlbWVudCwgZGVwdGg6IG51bWJlciwgbWF4RGVwdGg6IG51bWJlciwgZWxpZGVkOiB7Y291bnQ6IG51bWJlcn0pOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgY29uc3Qgc3IgPSAoaG9zdCBhcyBhbnkpLnNoYWRvd1Jvb3QgYXMgU2hhZG93Um9vdCB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIGlmICghc3IpIHJldHVybiBudWxsO1xuICBjb25zdCBtb2RlID0gc3IubW9kZSB8fCAnb3Blbic7XG4gIC8vIENsb25lIGVhY2ggdG9wLWxldmVsIHNoYWRvdyBjaGlsZCBpbmRpdmlkdWFsbHkgc28gd2UgY2FuIGFwcGx5IHRoZSBzYW1lXG4gIC8vIGRlcHRoLWNhcCB3YWxrZXIgdG8gdGhlbS5cbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShzci5jaGlsZHJlbikpIHtcbiAgICBwYXJ0cy5wdXNoKHNlcmlhbGl6ZVdpdGhTaGFkb3coY2hpbGQsIGRlcHRoICsgMSwgbWF4RGVwdGgsIGVsaWRlZCkpO1xuICB9XG4gIHJldHVybiBgPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPVwiJHttb2RlfVwiPiR7cGFydHMuam9pbignJyl9PC90ZW1wbGF0ZT5gO1xufTtcblxuLy8gU2VyaWFsaXplIGFuIGVsZW1lbnQgKyBpdHMgc2hhZG93IGNvbnRlbnQgaW50byBIVE1MLCBhcHBseWluZyB0aGVcbi8vIGRlcHRoLWNhcCB3YWxrZXIgdW5pZm9ybWx5IHRvIGJvdGguIENhbGxlciBwYXNzZXMgYSBzaGFyZWQgYGVsaWRlZGBcbi8vIGNvdW50ZXIgc28gdGhlIGZpbmFsIGNvdW50IHJlZmxlY3RzIGFsbCBzdWJ0cmVlcyB3ZSBjb2xsYXBzZWQuXG5jb25zdCBzZXJpYWxpemVXaXRoU2hhZG93ID0gKGVsOiBFbGVtZW50LCBkZXB0aDogbnVtYmVyLCBtYXhEZXB0aDogbnVtYmVyLCBlbGlkZWQ6IHtjb3VudDogbnVtYmVyfSk6IHN0cmluZyA9PiB7XG4gIC8vIFJlY29uc3RydWN0IHRoZSBvcGVuIHRhZyBmcm9tIGF0dHJpYnV0ZXMgKGlubmVySFRNTCB3b3VsZCBiZSBjaGVhcGVyXG4gIC8vIGJ1dCB3ZSBjYW4ndCBjb21iaW5lIGl0IHdpdGggYSBtYW51YWxseS1zZXJpYWxpemVkIHNoYWRvdyByb290KS5cbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBhdHRyczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKGVsLmF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKSkge1xuICAgICAgLy8gRXNjYXBlIGF0dHJpYnV0ZSB2YWx1ZSdzIGRvdWJsZS1xdW90ZXMgYW5kIGFtcGVyc2FuZHMgc28gdGhlXG4gICAgICAvLyBwcm9kdWNlZCBIVE1MIHJvdW5kLXRyaXBzLlxuICAgICAgY29uc3QgdiA9IFN0cmluZyhhLnZhbHVlKS5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICAgIGF0dHJzLnB1c2goYCR7YS5uYW1lfT1cIiR7dn1cImApO1xuICAgIH1cbiAgfVxuICBjb25zdCBvcGVuID0gYDwke3RhZ30ke2F0dHJzLmxlbmd0aCA/ICcgJyArIGF0dHJzLmpvaW4oJyAnKSA6ICcnfT5gO1xuICAvLyBTZWxmLWNsb3Npbmcgdm9pZHMg4oCUIG1hdGNoIEhUTUwgc3BlYyBzZXJpYWxpemVyIGJlaGF2aW9yLlxuICBjb25zdCBWT0lEID0gbmV3IFNldChbJ2FyZWEnLCAnYmFzZScsICdicicsICdjb2wnLCAnZW1iZWQnLCAnaHInLCAnaW1nJywgJ2lucHV0JywgJ2xpbmsnLCAnbWV0YScsICdwYXJhbScsICdzb3VyY2UnLCAndHJhY2snLCAnd2JyJ10pO1xuICBpZiAoVk9JRC5oYXModGFnKSkgcmV0dXJuIG9wZW47XG5cbiAgY29uc3Qgc2hhZG93ID0gc2VyaWFsaXplU2hhZG93Q29udGVudChlbCwgZGVwdGgsIG1heERlcHRoLCBlbGlkZWQpO1xuXG4gIC8vIERlcHRoIGNhcCBraWNrcyBpbiBmb3IgdGhlIExJR0hULURPTSBjaGlsZHJlbiBvbmx5OyB0aGUgc2hhZG93IGNvbnRlbnRcbiAgLy8gYWxyZWFkeSBjb3VudHMgaXRzIG93biBkZXB0aCB2aWEgdGhlIHJlY3Vyc2l2ZSBjYWxsLlxuICBsZXQgbGlnaHRJbm5lcjogc3RyaW5nO1xuICBpZiAoZGVwdGggPj0gbWF4RGVwdGggJiYgZWwuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgY29uc3QgY291bnQgPSBlbC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgZWxpZGVkLmNvdW50ICs9IGNvdW50O1xuICAgIGxpZ2h0SW5uZXIgPSBgPCEtLSAke2NvdW50fSAke2NvdW50ID09PSAxID8gJ2NoaWxkJyA6ICdjaGlsZHJlbid9IGVsaWRlZCAtLT5gO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNlZ3M6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBub2RlIG9mIEFycmF5LmZyb20oZWwuY2hpbGROb2RlcykpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxIC8qIGVsZW1lbnQgKi8pIHtcbiAgICAgICAgc2Vncy5wdXNoKHNlcmlhbGl6ZVdpdGhTaGFkb3cobm9kZSBhcyBFbGVtZW50LCBkZXB0aCArIDEsIG1heERlcHRoLCBlbGlkZWQpKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAvKiB0ZXh0ICovKSB7XG4gICAgICAgIHNlZ3MucHVzaChTdHJpbmcobm9kZS5ub2RlVmFsdWUgPz8gJycpLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDggLyogY29tbWVudCAqLykge1xuICAgICAgICBzZWdzLnB1c2goYDwhLS0ke1N0cmluZyhub2RlLm5vZGVWYWx1ZSA/PyAnJyl9LS0+YCk7XG4gICAgICB9XG4gICAgfVxuICAgIGxpZ2h0SW5uZXIgPSBzZWdzLmpvaW4oJycpO1xuICB9XG4gIC8vIERlY2xhcmF0aXZlIHNoYWRvdyBET00gY29udmVudGlvbjogPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPiBzaXRzIGFzIHRoZVxuICAvLyBmaXJzdCBjaGlsZCBvZiB0aGUgaG9zdCdzIGNvbnRlbnQsIEJFRk9SRSBsaWdodC1ET00gY2hpbGRyZW4uIE1pcnJvcnNcbiAgLy8gdGhlIHNwZWMgc28gYW4gTExNIChvciBIVE1MIHBhcnNlcikgcmVhZGluZyB0aGlzIGtub3dzIHNoYWRvdyBmcm9tIGxpZ2h0LlxuICByZXR1cm4gYCR7b3Blbn0ke3NoYWRvdyA/PyAnJ30ke2xpZ2h0SW5uZXJ9PC8ke3RhZ30+YDtcbn07XG5cbmNvbnN0IGNhcHBlZE91dGVySFRNTCA9IChlbDogRWxlbWVudCwgbWF4RGVwdGggPSAyKToge2h0bWw6IHN0cmluZzsgZWxpZGVkOiBudW1iZXJ9ID0+IHtcbiAgLy8gRmFzdCBwYXRoOiBlbGVtZW50IGhhcyBubyBzaGFkb3cgcm9vdCBhbmQgbmVpdGhlciBkbyBpdHMgZGVzY2VuZGFudHNcbiAgLy8gd2UnZCB0b3VjaC4gY2xvbmVOb2RlICsgdGhlIG9yaWdpbmFsIHdhbGsgaXMgY2hlYXBlciB0aGFuIHRoZSBtYW51YWxcbiAgLy8gc2VyaWFsaXplciwgYW5kIGl0IHByZXNlcnZlcyBxdWlya3MgKGJvb2xlYW4gYXR0cmlidXRlIHNlcmlhbGl6YXRpb24sXG4gIC8vIG5hbWVzcGFjZWQgU1ZHLCBldGMuKSB0aGF0IHRoZSBtYW51YWwgcGF0aCBhcHByb3hpbWF0ZXMuXG4gIGNvbnN0IGhhc0FueVNoYWRvdyA9ICgoKSA9PiB7XG4gICAgaWYgKChlbCBhcyBhbnkpLnNoYWRvd1Jvb3QpIHJldHVybiB0cnVlO1xuICAgIC8vIENoZWFwIHNjYW46IGxvb2sgYXQgdGhlIGZpcnN0IH41MCBkZXNjZW5kYW50cyBmb3IgYSBzaGFkb3dSb290LiBBXG4gICAgLy8gcGFnZSB3aXRoIG1hbnkgc2hhZG93IGhvc3RzIGlzIHJhcmUgaW4gbGlnaHQtRE9NIGFwcHM7IHRoZSBjb3N0IG9mXG4gICAgLy8gdGhlIGZ1bGwgc2NhbiB3b3VsZCBkZWZlYXQgdGhlIHB1cnBvc2UuIDUwIGlzIGVub3VnaCB0byBjYXRjaCB0aGVcbiAgICAvLyBjb21tb24gY2FzZSAoYSBzaW5nbGUgc2hhZG93IHJvb3QgaW5zaWRlIHRoZSBjYXB0dXJlZCBzdWJ0cmVlKS5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZGVzYyA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcbiAgICAgIGNvbnN0IE4gPSBNYXRoLm1pbihkZXNjLmxlbmd0aCwgNTApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIGlmICgoZGVzY1tpXSBhcyBhbnkpLnNoYWRvd1Jvb3QpIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKTtcbiAgaWYgKGhhc0FueVNoYWRvdykge1xuICAgIGNvbnN0IGVsaWRlZCA9IHtjb3VudDogMH07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGh0bWwgPSBzZXJpYWxpemVXaXRoU2hhZG93KGVsLCAwLCBtYXhEZXB0aCwgZWxpZGVkKTtcbiAgICAgIHJldHVybiB7aHRtbCwgZWxpZGVkOiBlbGlkZWQuY291bnR9O1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRmFsbCB0aHJvdWdoIHRvIGNsb25lTm9kZSBwYXRoIGFzIGEgc2FmZXR5IG5ldC5cbiAgICB9XG4gIH1cbiAgbGV0IGVsaWRlZCA9IDA7XG4gIHRyeSB7XG4gICAgY29uc3QgY2xvbmUgPSBlbC5jbG9uZU5vZGUodHJ1ZSkgYXMgRWxlbWVudDtcbiAgICBjb25zdCB3YWxrID0gKG5vZGU6IEVsZW1lbnQsIGRlcHRoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiB8fCAhbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcbiAgICAgIGlmIChkZXB0aCA+PSBtYXhEZXB0aCkge1xuICAgICAgICBjb25zdCBjb3VudCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICBlbGlkZWQgKz0gY291bnQ7XG4gICAgICAgIG5vZGUuaW5uZXJIVE1MID0gYDwhLS0gJHtjb3VudH0gJHtjb3VudCA9PT0gMSA/ICdjaGlsZCcgOiAnY2hpbGRyZW4nfSBlbGlkZWQgLS0+YDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGRyZW4pKSB3YWxrKGNoaWxkLCBkZXB0aCArIDEpO1xuICAgIH07XG4gICAgd2FsayhjbG9uZSwgMCk7XG4gICAgcmV0dXJuIHtodG1sOiBjbG9uZS5vdXRlckhUTUwsIGVsaWRlZH07XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7aHRtbDogZWwub3V0ZXJIVE1MLCBlbGlkZWQ6IDB9O1xuICB9XG59O1xuXG4vLyBSZXR1cm5zIEJPVEggdGhlIHRyaW1tZWQgSFRNTCBhbmQgdGhlIG9yaWdpbmFsIGJ5dGUgbGVuZ3RoIHdoZW4gdGhlXG4vLyB0cmltIGNhcCBraWNrZWQgaW4uIExldHMgY2FwdHVyZUVudHJ5IGV4cG9zZSBgdHJ1bmNhdGVkLm91dGVySFRNTGBcbi8vIChwZXIgQlVHLTAxMykgc28gYSBjb25zdW1lciBjYW4gZGV0ZWN0IGVsaXNpb24gYW5kIHJlZmV0Y2ggaWYgbmVlZGVkLlxuY29uc3QgdHJpbUh0bWxXaXRoU2l6ZSA9IChodG1sOiBzdHJpbmcsIG1heDogbnVtYmVyKToge3ZhbHVlOiBzdHJpbmc7IHRydW5jYXRlZD86IG51bWJlcn0gPT4ge1xuICBpZiAoIWh0bWwpIHJldHVybiB7dmFsdWU6IGh0bWx9O1xuICBsZXQgY2xlYW5lZCA9IGVsaWRlRGF0YVVyaXMoaHRtbCk7XG4gIGNsZWFuZWQgPSBlbGlkZUlubGluZVN2Z3MoY2xlYW5lZCk7XG4gIGNsZWFuZWQgPSBzdHJpcERhbmdlcm91c0VsZW1lbnRzKGNsZWFuZWQpO1xuICBpZiAoY2xlYW5lZC5sZW5ndGggPD0gbWF4KSByZXR1cm4ge3ZhbHVlOiBjbGVhbmVkfTtcbiAgY29uc3Qgb3JpZ2luYWxMZW4gPSBodG1sLmxlbmd0aDtcbiAgY29uc3QgY3V0ID0gY2xlYW5lZC5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0ID0gY3V0Lmxhc3RJbmRleE9mKCc+Jyk7XG4gIGNvbnN0IHZhbHVlID0gKGxhc3QgPiBtYXggLSAyMDAgPyBjdXQuc2xpY2UoMCwgbGFzdCArIDEpIDogY3V0KSArICfigKYnO1xuICByZXR1cm4ge3ZhbHVlLCB0cnVuY2F0ZWQ6IG9yaWdpbmFsTGVufTtcbn07XG5cbmNvbnN0IHRyaW1IdG1sID0gKGh0bWw6IHN0cmluZywgbWF4OiBudW1iZXIpOiBzdHJpbmcgPT4gdHJpbUh0bWxXaXRoU2l6ZShodG1sLCBtYXgpLnZhbHVlO1xuXG5jb25zdCByZWN0T2YgPSAoZWw6IEVsZW1lbnQpOiBSZWN0ID0+IHtcbiAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4ge3g6IE1hdGgucm91bmQoci54KSwgeTogTWF0aC5yb3VuZChyLnkpLCB3OiBNYXRoLnJvdW5kKHIud2lkdGgpLCBoOiBNYXRoLnJvdW5kKHIuaGVpZ2h0KX07XG59O1xuXG4vLyBHZW5lcmF0ZSBhIHV1aWQgdGhhdCB3b3JrcyBpbiBzZXJ2aWNlIHdvcmtlcnMsIGNvbnRlbnQgc2NyaXB0cywgYW5kXG4vLyBvbGRlciBDaHJvbWUgY29udGV4dHMuIGNyeXB0by5yYW5kb21VVUlEIGV4aXN0cyBpbiBtb2Rlcm4gYnJvd3NlcnM7IHRoZVxuLy8gZmFsbGJhY2sgdXNlcyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIGlmIGF2YWlsYWJsZSwgZWxzZSBhIHBlci1wYWdlIGNvdW50ZXIuXG5sZXQgZmFsbGJhY2tVaWRDb3VudGVyID0gMDtcbmNvbnN0IHV1aWQgPSAoKTogc3RyaW5nID0+IHtcbiAgdHJ5IHsgaWYgKGNyeXB0by5yYW5kb21VVUlEKSByZXR1cm4gY3J5cHRvLnJhbmRvbVVVSUQoKTsgfSBjYXRjaCB7IC8qIGZhbGwgdGhyb3VnaCAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3QgYSA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGEpO1xuICAgIGFbNl0gPSAoYVs2XSEgJiAweDBmKSB8IDB4NDA7XG4gICAgYVs4XSA9IChhWzhdISAmIDB4M2YpIHwgMHg4MDtcbiAgICBjb25zdCBoID0gQXJyYXkuZnJvbShhKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIHJldHVybiBgJHtoLnNsaWNlKDAsIDgpfS0ke2guc2xpY2UoOCwgMTIpfS0ke2guc2xpY2UoMTIsIDE2KX0tJHtoLnNsaWNlKDE2LCAyMCl9LSR7aC5zbGljZSgyMCl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGB1aWRfJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX1fJHsoKytmYWxsYmFja1VpZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB9XG59O1xuXG4vLyBUcnVlIGlmIGBlbGAgaGFzIGF0IGxlYXN0IG9uZSBkaXJlY3QgdGV4dC1ub2RlIGNoaWxkIHdpdGggbm9uLXdoaXRlc3BhY2Vcbi8vIGNvbnRlbnQuIFRoZSByb2FzdCBjYXVnaHQgdXMgZW1pdHRpbmcgY29uY2F0ZW5hdGVkIGRlc2NlbmRhbnQgdGV4dCBvblxuLy8gY29udGFpbmVyIGVsZW1lbnRzIChgPGhlYWRlcj5gLCBgPG1haW4+YCwgZXRjLikgYXMgYHRleHRgIOKAlCB3aGljaFxuLy8gcHJvZHVjZWQgMjAwLWNoYXIgZHVtcHMgdGhhdCB3ZXJlIG5vaXNlIHRvIExMTXMuIE9ubHkgZW1pdCBgdGV4dGAgd2hlblxuLy8gdGhlIGVsZW1lbnQgZGlyZWN0bHkgb3ducyB0ZXh0IG9yIGlzIG90aGVyd2lzZSBhIGNvbnRlbnQtYmVhcmluZyBsZWFmLlxuY29uc3QgaGFzT3duVGV4dE5vZGUgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgZm9yIChjb25zdCBub2RlIG9mIEFycmF5LmZyb20oZWwuY2hpbGROb2RlcykpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAvKiBURVhUX05PREUgKi8pIHtcbiAgICAgIGNvbnN0IHYgPSAobm9kZSBhcyBUZXh0KS5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBpZiAodi50cmltKCkubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIE9wdGlvbmFsIGNsaWNrIGNvbnRleHQuIFRocmVhZGVkIGJ5IHRoZSBjb250ZW50LXNjcmlwdCB3aGVuIHRoZVxuLy8gY2FwdHVyZSBpcyBkcml2ZW4gYnkgYSBjbGljayAoYWx0LWNsaWNrLCBhbHQtc2hpZnQtY2xpY2ssIGFsdC1kcmFnKTtcbi8vIGFic2VudCBmb3IgbWFudWFsLWNhcHR1cmUgLyByZWNhcHR1cmUgLyBwcm9ncmFtbWF0aWMgZmxvd3MuIFVzZWQgdG9cbi8vIGNvbXB1dGUgY2FudmFzLXJlbGF0aXZlIGNsaWNrIGNvb3JkaW5hdGVzIHdoZW4gdGhlIGNhcHR1cmVkIGVsZW1lbnRcbi8vIGxpdmVzIGluc2lkZSBhIGA8Y2FudmFzPmAuXG5leHBvcnQgdHlwZSBDYXB0dXJlT3B0cyA9IHtcbiAgY2xpY2tBdD86IHtjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlcn07XG59O1xuXG5jb25zdCBmaW5kQ2FudmFzQW5jZXN0b3IgPSAoZWw6IEVsZW1lbnQpOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPT4ge1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsO1xuICB3aGlsZSAoY3VyKSB7XG4gICAgaWYgKGN1ciBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSByZXR1cm4gY3VyO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhcHR1cmVFbnRyeSA9IChlbDogRWxlbWVudCwgc2VxdWVuY2U6IG51bWJlciwgb3B0czogQ2FwdHVyZU9wdHMgPSB7fSk6IEVudHJ5ID0+IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAvLyB0ZXh0Q29udGVudCAoTk9UIGlubmVyVGV4dCkgc28gc291cmNlIGBSZWZyZXNoYCBkb2Vzbid0IGdldCBjYXB0dXJlZFxuICAvLyBhcyB0aGUgQ1NTLXJlbmRlcmVkIGBSRUZSRVNIYC4gUm9hc3QgQlVHLTAwMS5cbiAgLy8gU2tpcCBvbiBub24tbGVhZiBjb250YWluZXJzIHRoYXQgZG9uJ3Qgb3duIGRpcmVjdCB0ZXh0IOKAlCBvdGhlcndpc2VcbiAgLy8gdGhlIHZhbHVlIGlzIHRoZSBjb25jYXRlbmF0aW9uIG9mIGV2ZXJ5IGRlc2NlbmRhbnQncyB0ZXh0LCBvZnRlblxuICAvLyB0cnVuY2F0ZWQgbWlkLXdvcmQsIHdoaWNoIGFuIExMTSB0cmVhdHMgYXMgb25lIHdhbGwgb2YgbXVzaC5cbiAgY29uc3QgaXNMZWFmaXNoID0gIWVsLmNoaWxkcmVuPy5sZW5ndGggfHwgaGFzT3duVGV4dE5vZGUoZWwpO1xuICBjb25zdCB0ZXh0ID0gaXNMZWFmaXNoID8gdHJpbVRleHQoZWwudGV4dENvbnRlbnQsIDI1MCkgOiAnJztcbiAgY29uc3Qgcm9sZSA9IGF0dHIoZWwsICdyb2xlJykgfHwgaW1wbGljaXRSb2xlKGVsKTtcbiAgLy8gQ2FwdHVyZSB0aGUgdmlzdWFsbHktcmVuZGVyZWQgZm9ybSB0b28gd2hlbiBDU1MgdHJhbnNmb3JtZWQgaXQuIFVzZWZ1bFxuICAvLyBmb3IgTExNcyB0aGF0IG5lZWQgYm90aCBzb3VyY2UgYW5kIHJlbmRlcmVkIGZvciBhIFVJIGJ1ZyBsaWtlIFwidGhlXG4gIC8vIGxhYmVsIHNheXMgU05PT1pFIDFIIGluIHRoZSBzY3JlZW5zaG90IGJ1dCB0aGUgc291cmNlIGhhcyBTbm9vemUgMWhcIi5cbiAgY29uc3QgcmVuZGVyZWRUZXh0ID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBpZiAoY3MudGV4dFRyYW5zZm9ybSAmJiBjcy50ZXh0VHJhbnNmb3JtICE9PSAnbm9uZScpIHtcbiAgICAgICAgY29uc3QgciA9IHRyaW1UZXh0KChlbCBhcyBIVE1MRWxlbWVudCkuaW5uZXJUZXh0LCAyNTApO1xuICAgICAgICByZXR1cm4gciAmJiByICE9PSB0ZXh0ID8gciA6IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pKCk7XG4gIGNvbnN0IGFjY05hbWUgPSBhY2Nlc3NpYmxlTmFtZShlbCwgcm9sZSk7XG4gIGNvbnN0IHRlc3RJZCA9IGF0dHIoZWwsICdkYXRhLXRlc3RpZCcpIHx8IGF0dHIoZWwsICdkYXRhLXRlc3QnKSB8fFxuICAgIGF0dHIoZWwsICdkYXRhLWN5JykgfHwgYXR0cihlbCwgJ2RhdGEtcWEnKTtcbiAgY29uc3Qgc3RhYmxlSWQgPSBpc1N0YWJsZUlkKGVsLmlkKSA/IGVsLmlkIDogbnVsbDtcbiAgY29uc3QgY2xhc3NlcyA9IGVsLmNsYXNzTGlzdCA/IEFycmF5LmZyb20oZWwuY2xhc3NMaXN0KS5zbGljZSgwLCAzMikgOiBbXTtcbiAgY29uc3Qge2F0dHJzLCBoaW50c30gPSBwb3B1bGF0ZWRBdHRycyhlbCk7XG4gIGNvbnN0IGNvbXBSb290ID0gY29tcG9uZW50Um9vdChlbCk7XG4gIGNvbnN0IGZ3ayA9IGZyYW1ld29ya0luZm8oZWwpO1xuICBjb25zdCB0cnVlU3RhdGVzID0gcGlja1RydWVTdGF0ZXMoZWwpO1xuICBjb25zdCBzdHlsZXMgPSBlc3NlbnRpYWxTdHlsZXMoZWwpO1xuICBjb25zdCBwc2V1ZG8gPSBwc2V1ZG9TdHlsZXMoZWwpO1xuICBjb25zdCBydWxlcyA9IGNvbGxlY3RNYXRjaGVkUnVsZXMoZWwpO1xuICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgY29uc3QgaW5TaGFkb3cgPSByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdDtcbiAgLy8gU2hhZG93LXJvb3RlZCBlbGVtZW50cyBhcmVuJ3QgcmVhY2hhYmxlIGZyb20gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgLFxuICAvLyBzbyB1bmlxdWVuZXNzIGNoZWNrcyBhZ2FpbnN0IHRoZSBkb2N1bWVudCBhbHdheXMgZmFpbC4gU2NvcGUgdG8gdGhlXG4gIC8vIG93bmluZyBTaGFkb3dSb290IHdoZW4gcHJlc2VudCDigJQgdGhhdCdzIGFsc28gd2hlcmUgYSBjb25zdW1lciBxdWVyeWluZ1xuICAvLyBgc2hhZG93SG9zdC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoLi4uKWAgd291bGQgcmVzb2x2ZSB0aGUgc2VsZWN0b3IuXG4gIGNvbnN0IHNjb3BlOiBEb2N1bWVudCB8IFNoYWRvd1Jvb3QgPSBpblNoYWRvdyA/IChyb290IGFzIFNoYWRvd1Jvb3QpIDogZG9jdW1lbnQ7XG5cbiAgLy8gVGVzdC1JRHMgYW5kIHN0YWJsZSBJRHMgYXJlIFBSRUZFUlJFRCwgYnV0IG9ubHkgd2hlbiBhY3R1YWxseSB1bmlxdWUgb25cbiAgLy8gdGhlIHBhZ2UuIFJlYWwtd29ybGQgd2VhdGhlci9saXN0IFVJcyBjb21tb25seSB0YWcgZXZlcnkgY2FyZCB3aXRoIHRoZVxuICAvLyBzYW1lIGBkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cImAg4oCUIGVtaXR0aW5nIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYFxuICAvLyB3b3VsZCByZXNvbHZlIHRvIDcgZWxlbWVudHMgYW5kIHRoZSBjb25zdW1lciBjYW4ndCB0ZWxsIHdoaWNoIG9uZSB3YXNcbiAgLy8gY2FwdHVyZWQuIFdoZW4gdGhlIHRlc3RJZCAvIHN0YWJsZUlkIGlzIG5vbi11bmlxdWUgd2UgZmFsbCB0aHJvdWdoIHRvXG4gIC8vIGNzc1BhdGgsIHdoaWNoIGFkZHMgd2hhdGV2ZXIgcGF0aCAvIGFuY2VzdG9yIHNjb3BlIG1ha2VzIHRoZSBjYXB0dXJlZFxuICAvLyBlbGVtZW50IGFkZHJlc3NhYmxlLlxuICBsZXQgc2VsZWN0b3I6IHN0cmluZztcbiAgaWYgKHRlc3RJZCkge1xuICAgIGNvbnN0IHRlc3RJZFNlbCA9IGBbZGF0YS10ZXN0aWQ9XCIke3Rlc3RJZH1cIl1gO1xuICAgIGlmIChpc1VuaXF1ZShzY29wZSwgdGVzdElkU2VsLCBlbCkpIHtcbiAgICAgIHNlbGVjdG9yID0gdGVzdElkU2VsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUcnkgYW5jaG9yaW5nIHRoZSB0ZXN0SWQgdG8gYSB1bmlxdWUgYW5jZXN0b3IsIG9yIGFwcGVuZGluZyB0aGVcbiAgICAgIC8vIGNhcHR1cmVkIGVsZW1lbnQncyBwYXRoLXRhaWwuIGNzc1BhdGgoKSBhbHJlYWR5IGRvZXMgYm90aCB2aWEgdGhlXG4gICAgICAvLyBBUklBIC8gcm9sZSAvIHVuaXF1ZS1jbGFzcyBhbmNlc3RvciBsYWRkZXIsIGJ1dCBpdCBkb2Vzbid0IFNUQVJUXG4gICAgICAvLyBmcm9tIHRoZSB0ZXN0SWQuIFdlIGJpYXMgdG93YXJkIGtlZXBpbmcgdGhlIHRlc3RJZCB2aXNpYmxlIGJ5XG4gICAgICAvLyBwYWlyaW5nIGl0IHdpdGggYSBjaGlsZCBkZXNjcmlwdG9yIHRoYXQgZGlzdGluZ3Vpc2hlcyBzaWJsaW5ncy5cbiAgICAgIGNvbnN0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICBsZXQgc2NvcGVkID0gJyc7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGNvbnN0IHNhbWVUYWdTaWJzID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoYykgPT4gYy5ub2RlTmFtZSA9PT0gZWwubm9kZU5hbWUpO1xuICAgICAgICBpZiAoc2FtZVRhZ1NpYnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHNjb3BlZCA9IGAke3Rlc3RJZFNlbH06bnRoLW9mLXR5cGUoJHtzYW1lVGFnU2licy5pbmRleE9mKGVsKSArIDF9KWA7XG4gICAgICAgICAgaWYgKGlzVW5pcXVlKHNjb3BlLCBzY29wZWQsIGVsKSkge1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBzY29wZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHN0YWJsZUlkKSB7XG4gICAgY29uc3QgaWRTZWwgPSBgIyR7ZXNjYXBlQ3NzKHN0YWJsZUlkKX1gO1xuICAgIHNlbGVjdG9yID0gaXNVbmlxdWUoc2NvcGUsIGlkU2VsLCBlbCkgPyBpZFNlbCA6IGNzc1BhdGgoZWwpO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gIH1cblxuICAvLyBDYXAgb3V0ZXJIVE1MIGF0IGRlcHRoPTIgQkVGT1JFIHRoZSBsZW5ndGgtY2FwIHBhc3M6IGEgc3BhcmtsaW5lXG4gIC8vIHdyYXBwZXIgd2l0aCA2MCBkYXRhIHNwYW5zIHdvdWxkIG90aGVyd2lzZSBjb25zdW1lIH45IEtCIG9mIG9uZVxuICAvLyBlbnRyeS4gQ2xvbmluZyBpbnRvIGEgZGV0YWNoZWQgc3VidHJlZSBsZXRzIHVzIHJlcGxhY2UgZGVlcFxuICAvLyBjaGlsZHJlbiB3aXRoIGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmAgbWFya2VycyB3aXRob3V0XG4gIC8vIHRvdWNoaW5nIHRoZSBsaXZlIERPTS5cbiAgY29uc3QgY2FwcGVkSHRtbCA9IGNhcHBlZE91dGVySFRNTChlbCwgMik7XG4gIGNvbnN0IHRyaW1tZWQgPSB0cmltSHRtbFdpdGhTaXplKGNhcHBlZEh0bWwuaHRtbCwgTUFYX1NOSVBQRVQpO1xuICBjb25zdCBvdXQ6IEVudHJ5ID0ge1xuICAgIHVpZDogdXVpZCgpLFxuICAgIG46IHNlcXVlbmNlLFxuICAgIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgIHRhZyxcbiAgICBzZWxlY3RvcixcbiAgICBvdXRlckhUTUw6IHRyaW1tZWQudmFsdWUsXG4gICAgcmVjdDogcmVjdE9mKGVsKSxcbiAgICAvLyBSb3VuZCBkcHIgdG8gMiBkZWNpbWFscyDigJQgV2luZG93cyBkaXNwbGF5IHNjYWxpbmcgcmVwb3J0cyByYXcgdmFsdWVzXG4gICAgLy8gbGlrZSAxLjc5OTk5OTk1MjMxNjI4NDIgKD09IDEuOCkgd2hpY2ggaXMgZmxvYXQtYXJpdGhtZXRpYyBub2lzZS5cbiAgICAvLyBDYXB0dXJlIHVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSB0b28gKGxpZ2h0IHZzIGRhcmssIG1vdGlvblxuICAgIC8vIHByZWYpIHNvIGEgZG93bnN0cmVhbSBMTE0gY2FuIHJlYXNvbiBhYm91dCB3aHkgYSBjYXB0dXJlZFxuICAgIC8vIGFwcGVhcmFuY2UgbWlnaHQgZGlmZmVyIGJldHdlZW4gc2Vzc2lvbnMuXG4gICAgdmlld3BvcnQ6IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCgpLFxuICB9O1xuICBpZiAoY2FwcGVkSHRtbC5lbGlkZWQgPiAwIHx8IHRyaW1tZWQudHJ1bmNhdGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXQudHJ1bmNhdGVkID0ge307XG4gICAgaWYgKGNhcHBlZEh0bWwuZWxpZGVkID4gMCkgb3V0LnRydW5jYXRlZC5jaGlsZHJlbiA9IGNhcHBlZEh0bWwuZWxpZGVkO1xuICAgIGlmICh0cmltbWVkLnRydW5jYXRlZCAhPT0gdW5kZWZpbmVkKSBvdXQudHJ1bmNhdGVkLm91dGVySFRNTCA9IHRyaW1tZWQudHJ1bmNhdGVkO1xuICB9XG4gIGlmICh0ZXh0KSBvdXQudGV4dCA9IHRleHQ7XG4gIGlmIChyZW5kZXJlZFRleHQpIG91dC5yZW5kZXJlZFRleHQgPSByZW5kZXJlZFRleHQ7XG4gIGlmIChyb2xlKSBvdXQucm9sZSA9IHJvbGU7XG4gIGlmIChhY2NOYW1lICYmIGFjY05hbWUgIT09IHRleHQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IGFjY05hbWU7XG4gIGlmIChzdGFibGVJZCkgb3V0LmlkID0gc3RhYmxlSWQ7XG4gIGlmICh0ZXN0SWQpIG91dC50ZXN0SWQgPSB0ZXN0SWQ7XG4gIGlmIChjbGFzc2VzLmxlbmd0aCkgb3V0LmNsYXNzZXMgPSBjbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoYXR0cnMpLmxlbmd0aCkgb3V0LmF0dHJzID0gYXR0cnM7XG4gIGlmIChoaW50cykgb3V0LmhpbnRzID0gaGludHM7XG4gIGlmIChpblNoYWRvdykge1xuICAgIG91dC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgY29uc3Qgc2ggPSBzaGFkb3dIb3N0U2VsZWN0b3IoZWwpO1xuICAgIGlmIChzaCkgb3V0LnNoYWRvd0hvc3QgPSBzaDtcbiAgfVxuICBpZiAoY29tcFJvb3Q/LmNvbXBhY3QpIG91dC5jb21wb25lbnRSb290ID0gY29tcFJvb3QuY29tcGFjdDtcbiAgY29uc3QgYW5jZXN0b3JzID0gYW5jZXN0b3JDaGFpbihlbCk7XG4gIGlmIChhbmNlc3RvcnMubGVuZ3RoKSBvdXQuYW5jZXN0b3JzID0gYW5jZXN0b3JzO1xuICBpZiAoZndrKSBvdXQuY29tcG9uZW50ID0gZndrO1xuICBjb25zdCBldmVudHMgPSBjb2xsZWN0RXZlbnROYW1lcyhlbCk7XG4gIGlmIChldmVudHMpIG91dC5ldmVudHMgPSBldmVudHM7XG4gIGNvbnN0IGJlaGF2aW9yQXR0cnMgPSBjb2xsZWN0QmVoYXZpb3JBdHRycyhlbCk7XG4gIGlmIChiZWhhdmlvckF0dHJzKSBvdXQuYmVoYXZpb3JBdHRycyA9IGJlaGF2aW9yQXR0cnM7XG4gIGlmIChoYXNBY3RpdmVBbmltYXRpb24oZWwpKSBvdXQuaXNBbmltYXRpbmcgPSB0cnVlO1xuICAvLyBDYXB0dXJlIGFzc2V0IHJlZmVyZW5jZXMgc28gY29tcGxhaW50cyBhYm91dCBsb2dvcyAvIGljb25zIC9cbiAgLy8gYXJ0d29yayBjYW4gYmUgcmVwYWlyZWQgd2l0aG91dCB2aXN1YWwgZ3Vlc3NpbmcuIFdhbGtzIDxpbWc+LFxuICAvLyA8cGljdHVyZT48c291cmNlPiwgYW5kIDxzdmcgdXNlIGhyZWY+IHdpdGhpbiB0aGUgY2FwdHVyZWQgc3VidHJlZVxuICAvLyAob25lIGxldmVsIG9ubHkg4oCUIGRlc2NlbmRhbnQgc2NvcGUgaXMgYWxyZWFkeSBjYXBwZWQgYnkgb3V0ZXJIVE1MXG4gIC8vIGVsaXNpb24pLlxuICBjb25zdCBhc3NldHM6IEFycmF5PHtzcmM6IHN0cmluZzsgbmF0dXJhbFc/OiBudW1iZXI7IG5hdHVyYWxIPzogbnVtYmVyOyByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjsgYWx0Pzogc3RyaW5nOyBsb2FkZWQ/OiBib29sZWFufT4gPSBbXTtcbiAgdHJ5IHtcbiAgICBjb25zdCBpbWdMaXN0ID0gZWwucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdMaXN0Lmxlbmd0aCAmJiBhc3NldHMubGVuZ3RoIDwgODsgaSsrKSB7XG4gICAgICBjb25zdCBpbWcgPSBpbWdMaXN0W2ldIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICBjb25zdCBzcmMgPSBpbWcuY3VycmVudFNyYyB8fCBpbWcuc3JjO1xuICAgICAgaWYgKCFzcmMgfHwgc3JjLnN0YXJ0c1dpdGgoJ2RhdGE6JykpIGNvbnRpbnVlOyAvLyBza2lwIGRhdGE6IFVSSXNcbiAgICAgIGNvbnN0IHIgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBhc3NldHMucHVzaCh7XG4gICAgICAgIHNyYzogdHJpbVRleHQoc3JjLCAyMDApLFxuICAgICAgICBuYXR1cmFsVzogaW1nLm5hdHVyYWxXaWR0aCB8fCB1bmRlZmluZWQsXG4gICAgICAgIG5hdHVyYWxIOiBpbWcubmF0dXJhbEhlaWdodCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHJlbmRlcmVkVzogTWF0aC5yb3VuZChyLndpZHRoKSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHJlbmRlcmVkSDogTWF0aC5yb3VuZChyLmhlaWdodCkgfHwgdW5kZWZpbmVkLFxuICAgICAgICBhbHQ6IGltZy5hbHQgfHwgdW5kZWZpbmVkLFxuICAgICAgICBsb2FkZWQ6IGltZy5jb21wbGV0ZSAmJiBpbWcubmF0dXJhbFdpZHRoID4gMCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCB1c2VMaXN0ID0gZWwucXVlcnlTZWxlY3RvckFsbCgndXNlW2hyZWZdLCB1c2VbeGxpbmtcXFxcOmhyZWZdJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1c2VMaXN0Lmxlbmd0aCAmJiBhc3NldHMubGVuZ3RoIDwgMTI7IGkrKykge1xuICAgICAgY29uc3QgdSA9IHVzZUxpc3RbaV0gYXMgU1ZHVXNlRWxlbWVudDtcbiAgICAgIGNvbnN0IGhyZWYgPSB1LmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8IHUuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJyk7XG4gICAgICBpZiAoaHJlZikgYXNzZXRzLnB1c2goe3NyYzogdHJpbVRleHQoaHJlZiwgMjAwKX0pO1xuICAgIH1cbiAgICAvLyBFbGVtZW50J3Mgb3duIGJhY2tncm91bmQtaW1hZ2UgKENTUy1kcml2ZW4gYXJ0d29yayDigJQgbG9nb3NcbiAgICAvLyBzb21ldGltZXMgc2hpcCB2aWEgYGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi4pYCkuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJnID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmJhY2tncm91bmRJbWFnZTtcbiAgICAgIGlmIChiZyAmJiBiZyAhPT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbnN0IHVybE0gPSAvdXJsXFwoKFsnXCJdPykoLis/KVxcMVxcKS8uZXhlYyhiZyk7XG4gICAgICAgIGlmICh1cmxNICYmICF1cmxNWzJdIS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgYXNzZXRzLnB1c2goe3NyYzogdHJpbVRleHQodXJsTVsyXSEsIDIwMCl9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgaWYgKGFzc2V0cy5sZW5ndGgpIG91dC5hc3NldHMgPSBhc3NldHM7XG5cbiAgLy8gU2hpcCBhbiBhMTF5IGNoZWNrIG9uIGV2ZXJ5IGVudHJ5IChjb250cmFzdCByYXRpbyBmb3IgdGV4dCxcbiAgLy8gdGFiYmFiaWxpdHkgZmxhZykgc28gcmV2aWV3ZXJzIGRvbid0IG5lZWQgdG8gcmUtcnVuIGFuIGF1ZGl0LlxuICAvLyBIZWF2aWVyIGNoZWNrcyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90LCBheGUtc3R5bGUgdmlvbGF0aW9ucylcbiAgLy8gbmVlZCB0aGVpciBvd24gcGlwZWxpbmU7IHRoaXMgaXMgdGhlIGluLWNhcHR1cmUgcG9ydGlvbi5cbiAgY29uc3QgYTExeSA9IGNvbXB1dGVBY2Nlc3NpYmlsaXR5Q2hlY2soZWwpO1xuICBpZiAoYTExeSkgb3V0LmExMXkgPSBhMTF5O1xuICAvLyBQYXJlbnQgbGF5b3V0IGNvbnRleHQgKG92ZXJmbG93IC8gcG9zaXRpb24gLyBmbGV4IC8gZ3JpZCAvIHNjcm9sbFxuICAvLyBjb250YWluZXJzIC8gc3RhY2tpbmcpLiBMYXlvdXQgYnVncyB0eXBpY2FsbHkgbGl2ZSBpbiB0aGUgYW5jZXN0b3JcbiAgLy8gY2hhaW4sIG5vdCBvbiB0aGUgY2FwdHVyZWQgZWxlbWVudCBpdHNlbGYuXG4gIGNvbnN0IGxheW91dCA9IGNhcHR1cmVMYXlvdXRDb250ZXh0KGVsKTtcbiAgaWYgKGxheW91dC5sZW5ndGgpIG91dC5sYXlvdXRDb250ZXh0ID0gbGF5b3V0O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIGJlZm9yZSB0aGUgY2xpY2sg4oCUIHJlcHJvIGNvbnRleHQgKMKnNC44KS5cbiAgLy8gVGhlIGNvbnRlbnQtc2NyaXB0LW93bmVkIHJpbmcgYnVmZmVyIGZlZWRzIHVzIHRoZSByZWNlbnQgaGlzdG9yeTtcbiAgLy8gd2Ugc2xpY2UgdGhlIGxhc3QgMyBzbyB0aGUgZW50cnkgc3RheXMgc21hbGwuIFNraXBwZWQgd2hlbiB0aGVcbiAgLy8gZ2V0dGVyIGlzbid0IHdpcmVkICh0ZXN0L3N0YW5kYWxvbmUgaGFybmVzc2VzKS5cbiAgaWYgKG11dGF0aW9uQnVmZmVyR2V0dGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VudCA9IG11dGF0aW9uQnVmZmVyR2V0dGVyKCk7XG4gICAgICAvLyBGaWx0ZXIgb3V0IHRvb2wtaW5kdWNlZCBtdXRhdGlvbnMgKGN1cnNvciBzd2FwLCBib2R5IHN0eWxlXG4gICAgICAvLyBoaXRzIGZyb20gY3Jvc3NoYWlyIG1vZGUsIG92ZXJsYXkgcGFpbnRzLCByaW5nIHJlcGFpbnRzKSBzb1xuICAgICAgLy8gdGhlIGNvbnN1bWVyIGRvZXNuJ3QgaGF2ZSB0byB3b25kZXIgd2hldGhlciBgYm9keSB7IGN1cnNvcjpcbiAgICAgIC8vIGNyb3NzaGFpciB9YCBpcyBwYXJ0IG9mIHRoZWlyIGFwcC4gV2UgbWFyayBvdXIgb3duIG11dGF0aW9uc1xuICAgICAgLy8gYnkgc291cmNlIGFuZCBleGNsdWRlIHRoZW07IHVuLW1hcmtlZCBtdXRhdGlvbnMgYXJlIGFwcC1kcml2ZW4uXG4gICAgICBjb25zdCBUT09MX05PSVNFX1JFID0gL14oaHRtbHxib2R5fCNfX3BpbmNoZ3JhYl9vdmVybGF5KVxcYnxjdXJzb3J8dXNlci1zZWxlY3R8d2Via2l0LXVzZXItc2VsZWN0L2k7XG4gICAgICBjb25zdCBmaWx0ZXJlZCA9IHJlY2VudC5maWx0ZXIoKG0pID0+IHtcbiAgICAgICAgaWYgKFRPT0xfTk9JU0VfUkUudGVzdChtLnRhcmdldCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKG0udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnICYmIG0uYXR0cmlidXRlTmFtZSAmJiAvXihzdHlsZXxjdXJzb3IpJC8udGVzdChtLmF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgICAgLy8gYm9keSB7IGN1cnNvcjogY3Jvc3NoYWlyIH0gZnJvbSBQaW5jaEdyYWIncyBkcmFnIG1vZGVcbiAgICAgICAgICByZXR1cm4gIShtLnRhcmdldC5zdGFydHNXaXRoKCdodG1sJykgfHwgbS50YXJnZXQuc3RhcnRzV2l0aCgnYm9keScpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGZpbHRlcmVkLnNsaWNlKC0zKTtcbiAgICB9IGNhdGNoIHsgLyogaWdub3JlIG9ic2VydmVyIGVycm9ycyAqLyB9XG4gIH1cbiAgLy8gQ29udGVudGVkaXRhYmxlIGVkaXRvciBjb250ZXh0IChGLjUpLiBXaGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50XG4gIC8vIGxpdmVzIGluc2lkZSBhIHJpY2gtdGV4dCBlZGl0b3IgKFByb3NlTWlycm9yIC8gTGV4aWNhbCAvIFNsYXRlIC9cbiAgLy8gUXVpbGwgLyBUaXBUYXAgLyBuYXRpdmUpLCBzdXJmYWNlIHRoZSBsaWJyYXJ5IGtpbmQgKyByb290IHNlbGVjdG9yXG4gIC8vIHNvIGFuIExMTSBsb29raW5nIGF0IFwiY29weSBpcyB3cm9uZ1wiIGZlZWRiYWNrIGtub3dzIHRoZSBlZGl0b3JcbiAgLy8gd3JhcHBlciB0byBpbnNwZWN0IHJhdGhlciB0aGFuIGNoYXNpbmcgaW50ZXJuYWwgZWRpdG9yIHNlbGVjdG9ycy5cbiAgY29uc3QgZWRpdG9yID0gZWRpdG9yQ29udGV4dChlbCk7XG4gIGlmIChlZGl0b3IpIG91dC5lZGl0b3IgPSBlZGl0b3I7XG4gIC8vIENhbnZhcyBjbGljayBjb29yZHMgKEYuMykuIFdoZW4gdGhlIGNhcHR1cmUgdGFyZ2V0IGlzIGEgY2FudmFzIChvclxuICAvLyBhIGRlc2NlbmRhbnQg4oCUIERhdGFEb2ctc3R5bGUgY2hhcnRzIG9mdGVuIHJlbmRlciBpbnRvIGEgY2FudmFzIHdpdGhcbiAgLy8gcHNldWRvLWVsZW1lbnRzIGxheWVyZWQgb24gdG9wKSwgY29tcHV0ZSBjbGljayBwb3NpdGlvbiByZWxhdGl2ZSB0b1xuICAvLyB0aGUgY2FudmFzJ3MgYm91bmRpbmcgYm94LiBTa2lwcGVkIGlmIHRoZSBjYWxsZXIgZGlkbid0IHByb3ZpZGVcbiAgLy8gY2xpY2sgY29vcmRzIChtYW51YWwtY2FwdHVyZSAvIHJlY2FwdHVyZSBmbG93cykuXG4gIGlmIChvcHRzLmNsaWNrQXQpIHtcbiAgICBjb25zdCBjYW52YXMgPSBmaW5kQ2FudmFzQW5jZXN0b3IoZWwpO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGNvbnN0IHIgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBvdXQuY2FudmFzQ2xpY2sgPSB7XG4gICAgICAgIG9mZnNldFg6IE1hdGgucm91bmQob3B0cy5jbGlja0F0LmNsaWVudFggLSByLmxlZnQpLFxuICAgICAgICBvZmZzZXRZOiBNYXRoLnJvdW5kKG9wdHMuY2xpY2tBdC5jbGllbnRZIC0gci50b3ApLFxuICAgICAgICBjYW52YXNXOiBNYXRoLnJvdW5kKHIud2lkdGgpLFxuICAgICAgICBjYW52YXNIOiBNYXRoLnJvdW5kKHIuaGVpZ2h0KSxcbiAgICAgICAgY2FudmFzU2VsZWN0b3I6ICgoKSA9PiB7IHRyeSB7IHJldHVybiBjc3NQYXRoKGNhbnZhcyk7IH0gY2F0Y2ggeyByZXR1cm4gJ2NhbnZhcyc7IH0gfSkoKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmICh0cnVlU3RhdGVzLmxlbmd0aCkgb3V0LnN0YXRlcyA9IHRydWVTdGF0ZXM7XG4gIGlmIChPYmplY3Qua2V5cyhzdHlsZXMpLmxlbmd0aCkgb3V0LnN0eWxlcyA9IHN0eWxlcztcbiAgaWYgKHJ1bGVzLmxlbmd0aCkgb3V0Lm1hdGNoZWRSdWxlcyA9IHJ1bGVzO1xuICBpZiAoT2JqZWN0LmtleXMocHNldWRvKS5sZW5ndGgpIG91dC5wc2V1ZG9FbGVtZW50cyA9IHBzZXVkbztcblxuICAvLyBMb2NhdG9yIHF1YWxpdHk6IGhvdyBtYW55IGVsZW1lbnRzIGBzZWxlY3RvcmAgcmVzb2x2ZXMgdG8gaW4gaXRzXG4gIC8vIHNjb3BlICgxID0gdW5pcXVlKS4gPjEgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91czsgdXNlZnVsXG4gIC8vIHdoZW4gcGFpcmVkIHdpdGggcmVjdCAvIGFuY2VzdG9ycyB0byBkaXNhbWJpZ3VhdGUuXG4gIHRyeSB7XG4gICAgb3V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmxlbmd0aDtcbiAgfSBjYXRjaCB7IC8qIGludmFsaWQgc2VsZWN0b3IsIGxlYXZlIGZpZWxkcyBvZmYgKi8gfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG5jb25zdCBjb2xsZWN0Um9vdENzc1ZhcnMgPSAoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3MubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBuID0gY3NbaV07XG4gICAgaWYgKG4/LnN0YXJ0c1dpdGgoJy0tJykpIHtcbiAgICAgIGNvbnN0IHYgPSBjcy5nZXRQcm9wZXJ0eVZhbHVlKG4pLnRyaW0oKTtcbiAgICAgIGlmICh2KSBvdXRbbl0gPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gU2hhcmVkIHZpZXdwb3J0IHNuYXBzaG90IOKAlCB1c2VkIGJ5IGJvdGggYnVpbGRQYWdlQ29udGV4dCAoc2Vzc2lvblxuLy8gaGVhZGVyKSBhbmQgY2FwdHVyZUVudHJ5IChwZXItY2FwdHVyZSwgaW4gY2FzZSBzdGF0ZSBjaGFuZ2VkIGJldHdlZW5cbi8vIHRoZSBwYWdlIHJvdyBhbmQgdGhlIGNhcHR1cmUpLiBQaWNrcyB1cCBkcHIgcm91bmRpbmcsIGNvbG9yU2NoZW1lLFxuLy8gcmVkdWNlZE1vdGlvbiwgUlRMIGRpcmVjdGlvbiAoRi4xMyksIGFuZCB2aXN1YWxWaWV3cG9ydCB6b29tIChGLjE0KS5cbmNvbnN0IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCA9ICgpOiBWaWV3cG9ydCA9PiB7XG4gIGNvbnN0IHY6IFZpZXdwb3J0ID0ge1xuICAgIHc6IE1hdGgucm91bmQod2luZG93LmlubmVyV2lkdGgpLFxuICAgIGg6IE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0KSxcbiAgICBkcHI6IE1hdGgucm91bmQoKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpICogMTAwKSAvIDEwMCxcbiAgfTtcbiAgdHJ5IHtcbiAgICBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMpIHYuY29sb3JTY2hlbWUgPSAnZGFyayc7XG4gICAgZWxzZSBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodCknKS5tYXRjaGVzKSB2LmNvbG9yU2NoZW1lID0gJ2xpZ2h0JztcbiAgICBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB2LnJlZHVjZWRNb3Rpb24gPSB0cnVlO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgLy8gRG9jdW1lbnQgZGlyZWN0aW9uLiBgZGlyPVwicnRsXCJgIG9uIDxodG1sPiwgb3IgY29tcHV0ZWQgQ1NTIGRpcmVjdGlvblxuICAvLyB3aGVuIGFuIExUUiBkb2N1bWVudCBlbWJlZHMgYW4gUlRMIHN1YnRyZWUuIFdlIHNuYXBzaG90IHRoZSBkb2N1bWVudFxuICAvLyByb290J3MgY29tcHV0ZWQgZGlyZWN0aW9uLlxuICB0cnkge1xuICAgIGNvbnN0IGRpciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZGlyZWN0aW9uO1xuICAgIGlmIChkaXIgPT09ICdydGwnKSB2LmRpcmVjdGlvbiA9ICdydGwnO1xuICAgIGVsc2UgaWYgKGRpciA9PT0gJ2x0cicpIHYuZGlyZWN0aW9uID0gJ2x0cic7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAvLyBab29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIGlzIHRoZSBwaW5jaC16b29tIGZhY3RvciBvblxuICAvLyB0b3VjaCBkZXZpY2VzOyBvbiBkZXNrdG9wIHdpdGggYnJvd3NlciB6b29tIHRoZSB2YWx1ZSBzdGF5cyBhdCAxXG4gIC8vIGJ1dCB3aW5kb3cuaW5uZXJXaWR0aC9IZWlnaHQgc2hyaW5rLCBzbyB0aGlzIHdvbid0IHBpY2sgdXBcbiAgLy8gQ3RybCtwbHVzL21pbnVzIHpvb20g4oCUIHRoYXQgc3VyZmFjZXMgYXMgYSBzbWFsbGVyIHZpZXdwb3J0LiBCb3RoXG4gIC8vIGFyZSB1c2VmdWwgYW5kIHdlIGNhcHR1cmUgYm90aC5cbiAgdHJ5IHtcbiAgICBjb25zdCBzY2FsZSA9ICh3aW5kb3cudmlzdWFsVmlld3BvcnQgYXMgYW55KT8uc2NhbGU7XG4gICAgaWYgKHR5cGVvZiBzY2FsZSA9PT0gJ251bWJlcicgJiYgTWF0aC5hYnMoc2NhbGUgLSAxKSA+IDAuMDAxKSB7XG4gICAgICB2Lnpvb20gPSBNYXRoLnJvdW5kKHNjYWxlICogMTAwKSAvIDEwMDtcbiAgICB9XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gdjtcbn07XG5cbi8vIFJlY2VudC1UYWIgdHJhY2tlciBmb3IgYWN0aXZlRm9jdXMuIFdpcmVkIGJ5IGNvbnRlbnQtc2NyaXB0LnRzIGF0XG4vLyBib290OyB3ZSBrZWVwIHRoZSB0aW1lc3RhbXAgb2YgdGhlIGxhc3QgVGFiIGtleWRvd24gc28gYnVpbGRQYWdlQ29udGV4dFxuLy8gY2FuIGRlY2lkZSB3aGV0aGVyIHRvIGZsYWcgdGhlIGZvY3VzIGFzIFwia2V5Ym9hcmQtZHJpdmVuXCIuXG5sZXQgbGFzdFRhYkF0ID0gMDtcbmV4cG9ydCBjb25zdCBub3RlVGFiUHJlc3NlZCA9ICgpOiB2b2lkID0+IHsgbGFzdFRhYkF0ID0gRGF0ZS5ub3coKTsgfTtcblxuY29uc3QgYWN0aXZlRm9jdXNTbmFwc2hvdCA9ICgpOiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn0gfCBudWxsID0+IHtcbiAgY29uc3QgYWUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICBpZiAoIWFlIHx8IGFlID09PSBkb2N1bWVudC5ib2R5IHx8IGFlID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiBudWxsO1xuICBsZXQgc2VsZWN0b3I6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdHJ5IHsgc2VsZWN0b3IgPSBjc3NQYXRoKGFlKTsgfSBjYXRjaCB7IHNlbGVjdG9yID0gYWUudGFnTmFtZS50b0xvd2VyQ2FzZSgpOyB9XG4gIGNvbnN0IG91dDoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59ID0ge3NlbGVjdG9yfTtcbiAgaWYgKERhdGUubm93KCkgLSBsYXN0VGFiQXQgPCAxMDAwKSBvdXQucmVjZW50bHlUYWJiZWQgPSB0cnVlO1xuICByZXR1cm4gb3V0O1xufTtcblxuLy8gUmVhZCBnaXQgY29udGV4dCBmcm9tIGEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiY1xuLy8gYnJhbmNoOm1haW5cIj5gIHRhZyBpZiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXMgb25lLiBOby1vcCB3aGVuIGFic2VudC5cbi8vIExldHMgYSBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJ1aWxkIHdhcyB0aGlzIGNhcHR1cmVkIGZyb20/XCJcbi8vIHdpdGhvdXQgZm9yY2luZyB0aGUgdXNlciB0byByZW1lbWJlci5cbmNvbnN0IHJlYWRHaXRDb250ZXh0ID0gKCk6IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9IHwgbnVsbCA9PiB7XG4gIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJwaW5jaGdyYWItYnVpbGRcIl0nKSBhcyBIVE1MTWV0YUVsZW1lbnQgfCBudWxsO1xuICBpZiAoIW1ldGE/LmNvbnRlbnQpIHJldHVybiBudWxsO1xuICBjb25zdCBjb250ZW50ID0gbWV0YS5jb250ZW50O1xuICBjb25zdCBvdXQ6IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9ID0ge307XG4gIGNvbnN0IGNvbW1pdCA9IC9cXGJjb21taXQ6KFtcXHcuLV0rKS8uZXhlYyhjb250ZW50KT8uWzFdO1xuICBjb25zdCBicmFuY2ggPSAvXFxiYnJhbmNoOihbXFx3Li8tXSspLy5leGVjKGNvbnRlbnQpPy5bMV07XG4gIGNvbnN0IGJ1aWxkID0gL1xcYmJ1aWxkOihbXFx3Li8tXSspLy5leGVjKGNvbnRlbnQpPy5bMV07XG4gIGlmIChjb21taXQpIG91dC5jb21taXQgPSB0cmltVGV4dChjb21taXQsIDgwKTtcbiAgaWYgKGJyYW5jaCkgb3V0LmJyYW5jaCA9IHRyaW1UZXh0KGJyYW5jaCwgODApO1xuICBpZiAoYnVpbGQpIG91dC5idWlsZCA9IHRyaW1UZXh0KGJ1aWxkLCA4MCk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvdXQpLmxlbmd0aCA/IG91dCA6IG51bGw7XG59O1xuXG4vLyBBIFVSTCBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hhdCB0aGUgdXNlciB3YXMgbG9va2luZyBhdC5cbi8vIE1hbnkgU1BBcyBkcml2ZSByb3V0aW5nIHZpYSBxdWVyeSBwYXJhbXMgKGA/cm91dGU9c2V0dGluZ3NgKSwgaGFzaFxuLy8gcm91dGVzIChgIy91c2Vycy80MmApLCBvciBwYXRoIHNlZ21lbnRzLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gZnJvbVxuLy8gdGhlIFVSTCDigJQgcmVjZWl2ZXJzIHZlcmlmeSBhZ2FpbnN0IHRoZSBzY3JlZW5zaG90IGlmIHRoZXkgY2FyZS5cbmNvbnN0IGJ1aWxkUm91dGVTbmFwc2hvdCA9ICgpOiB7cGF0aG5hbWU/OiBzdHJpbmc7IHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgaGFzaD86IHN0cmluZzsgcm91dGVOYW1lPzogc3RyaW5nOyByb3V0ZVBhcmFtPzogc3RyaW5nfSA9PiB7XG4gIGNvbnN0IG91dDoge3BhdGhuYW1lPzogc3RyaW5nOyBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGhhc2g/OiBzdHJpbmc7IHJvdXRlTmFtZT86IHN0cmluZzsgcm91dGVQYXJhbT86IHN0cmluZ30gPSB7fTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICBpZiAodS5wYXRobmFtZSkgb3V0LnBhdGhuYW1lID0gdS5wYXRobmFtZTtcbiAgICBpZiAodS5oYXNoKSBvdXQuaGFzaCA9IHUuaGFzaDtcbiAgICBjb25zdCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBsZXQgblBhcmFtcyA9IDA7XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgdS5zZWFyY2hQYXJhbXMpIHtcbiAgICAgIGlmIChuUGFyYW1zID49IDE2KSBicmVhaztcbiAgICAgIHBhcmFtc1trXSA9IHRyaW1UZXh0KHYsIDIwMCk7XG4gICAgICBuUGFyYW1zKys7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkgb3V0LnF1ZXJ5ID0gcGFyYW1zO1xuICAgIC8vIENvbW1vbiBTUEEgcm91dGUgaGludHM6IGA/cm91dGU9c2V0dGluZ3NgLCBgP3RhYj1mb29gLCBgIy91c2Vycy80MmAuXG4gICAgY29uc3Qgcm91dGVRdWVyeSA9IHUuc2VhcmNoUGFyYW1zLmdldCgncm91dGUnKSA/PyB1LnNlYXJjaFBhcmFtcy5nZXQoJ3RhYicpID8/IHUuc2VhcmNoUGFyYW1zLmdldCgndmlldycpO1xuICAgIGlmIChyb3V0ZVF1ZXJ5KSBvdXQucm91dGVOYW1lID0gdHJpbVRleHQocm91dGVRdWVyeSwgODApO1xuICAgIGlmICh1Lmhhc2ggJiYgdS5oYXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IGhhc2hQYXRoID0gdS5oYXNoLnJlcGxhY2UoL14jXFwvPy8sICcnKTtcbiAgICAgIGNvbnN0IHNlZ3MgPSBoYXNoUGF0aC5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIGlmIChzZWdzLmxlbmd0aCkge1xuICAgICAgICBvdXQucm91dGVOYW1lID0gb3V0LnJvdXRlTmFtZSA/PyB0cmltVGV4dChzZWdzWzBdISwgODApO1xuICAgICAgICBpZiAoc2Vncy5sZW5ndGggPiAxKSBvdXQucm91dGVQYXJhbSA9IHRyaW1UZXh0KHNlZ3Muc2xpY2UoMSkuam9pbignLycpLCAyMDApO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDYXB0dXJlIGEgcmVkYWN0ZWQgc3RhdGUgc25hcHNob3Qgc28gcmVjZWl2ZXJzIGNhbiByZXBybyB0aGUgc2NyZWVuLlxuLy8gV2UgYXZvaWQgY29weWluZyBldmVyeXRoaW5nIOKAlCB0aGF0IHdvdWxkIGxlYWsgc2VjcmV0cyDigJQgYW5kIHN1cmZhY2Vcbi8vIG9ubHk6XG4vLyAgIOKAoiBsb2NhbFN0b3JhZ2Uga2V5cyArIHNpemVzIChOT1QgdmFsdWVzOyByZWNlaXZlcnMgbmVlZCB0byBrbm93XG4vLyAgICAgd2hhdCBzdG9yYWdlIHNoYXBlZCB0aGUgc2NyZWVuLCBub3QgdGhlIGNvbnRlbnRzKVxuLy8gICDigKIgY29va2llIG5hbWVzIChOTyB2YWx1ZXMsIGV2ZXIpXG4vLyAgIOKAoiBrbm93biBmZWF0dXJlLWZsYWcgY29udmVudGlvbnM6IGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWZsYWdzXCI+YFxuY29uc3QgYnVpbGRTdGF0ZVNuYXBzaG90ID0gKCk6IHtzdG9yYWdlS2V5cz86IHN0cmluZ1tdOyBzZXNzaW9uS2V5cz86IHN0cmluZ1tdOyBjb29raWVOYW1lcz86IHN0cmluZ1tdOyBmZWF0dXJlRmxhZ3M/OiBzdHJpbmd9IHwgbnVsbCA9PiB7XG4gIGNvbnN0IG91dDoge3N0b3JhZ2VLZXlzPzogc3RyaW5nW107IHNlc3Npb25LZXlzPzogc3RyaW5nW107IGNvb2tpZU5hbWVzPzogc3RyaW5nW107IGZlYXR1cmVGbGFncz86IHN0cmluZ30gPSB7fTtcbiAgdHJ5IHtcbiAgICBjb25zdCBsc0tleXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoICYmIGxzS2V5cy5sZW5ndGggPCAzMjsgaSsrKSB7XG4gICAgICBjb25zdCBrID0gbG9jYWxTdG9yYWdlLmtleShpKTtcbiAgICAgIGlmIChrKSBsc0tleXMucHVzaChrKTtcbiAgICB9XG4gICAgaWYgKGxzS2V5cy5sZW5ndGgpIG91dC5zdG9yYWdlS2V5cyA9IGxzS2V5cztcbiAgfSBjYXRjaCB7IC8qIFNlY3VyaXR5RXJyb3Igb24gY3Jvc3Mtb3JpZ2luIGZyYW1lcyAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3Qgc3NLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2Vzc2lvblN0b3JhZ2UubGVuZ3RoICYmIHNzS2V5cy5sZW5ndGggPCAzMjsgaSsrKSB7XG4gICAgICBjb25zdCBrID0gc2Vzc2lvblN0b3JhZ2Uua2V5KGkpO1xuICAgICAgaWYgKGspIHNzS2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBpZiAoc3NLZXlzLmxlbmd0aCkgb3V0LnNlc3Npb25LZXlzID0gc3NLZXlzO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgdHJ5IHtcbiAgICBjb25zdCBjb29raWVOYW1lcyA9IGRvY3VtZW50LmNvb2tpZVxuICAgICAgLnNwbGl0KCc7JylcbiAgICAgIC5tYXAoKGMpID0+IGMudHJpbSgpLnNwbGl0KCc9JylbMF0hKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLnNsaWNlKDAsIDMyKTtcbiAgICBpZiAoY29va2llTmFtZXMubGVuZ3RoKSBvdXQuY29va2llTmFtZXMgPSBjb29raWVOYW1lcztcbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3QgZmxhZ01ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJwaW5jaGdyYWItZmxhZ3NcIl0nKSBhcyBIVE1MTWV0YUVsZW1lbnQgfCBudWxsO1xuICAgIGlmIChmbGFnTWV0YT8uY29udGVudCkgb3V0LmZlYXR1cmVGbGFncyA9IHRyaW1UZXh0KGZsYWdNZXRhLmNvbnRlbnQsIDQwMCk7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkUGFnZUNvbnRleHQgPSAoKSA9PiB7XG4gIGNvbnN0IGN0eDogYW55ID0ge1xuICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICB0aXRsZTogdHJpbVRleHQoZG9jdW1lbnQudGl0bGUsIDIwMCksXG4gICAgdmlld3BvcnQ6IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCgpLFxuICAgIHRva2VuczogY29sbGVjdFJvb3RDc3NWYXJzKCksXG4gICAgdXNlckFnZW50OiB0cmltVGV4dChuYXZpZ2F0b3IudXNlckFnZW50LCAyNDApLFxuICAgIGxhbmc6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJycsXG4gIH07XG4gIGNvbnN0IGdpdCA9IHJlYWRHaXRDb250ZXh0KCk7XG4gIGlmIChnaXQpIGN0eC5naXRDb250ZXh0ID0gZ2l0O1xuICBjb25zdCBmb2N1cyA9IGFjdGl2ZUZvY3VzU25hcHNob3QoKTtcbiAgaWYgKGZvY3VzKSBjdHguYWN0aXZlRm9jdXMgPSBmb2N1cztcbiAgY29uc3Qgcm91dGUgPSBidWlsZFJvdXRlU25hcHNob3QoKTtcbiAgaWYgKE9iamVjdC5rZXlzKHJvdXRlKS5sZW5ndGgpIGN0eC5yb3V0ZSA9IHJvdXRlO1xuICBjb25zdCBzdGF0ZSA9IGJ1aWxkU3RhdGVTbmFwc2hvdCgpO1xuICBpZiAoc3RhdGUpIGN0eC5zdGF0ZSA9IHN0YXRlO1xuICByZXR1cm4gY3R4O1xufTtcblxuLy8gLS0tLSBFbGVtZW50LXNldCBzZW1hbnRpY3MgZm9yIHJ1YmJlci1iYW5kIGRyYWcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBTVFJPTkdfSURfUkUgPSAvXihyYWRpeC18aGVhZGxlc3N1aS18bXVpLXw6clswLTlhLXpdKzopL2k7XG5jb25zdCBpc1N0cm9uZ01hcmtlciA9IChlbDogRWxlbWVudCk6IGJvb2xlYW4gPT5cbiAgQm9vbGVhbihcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdGlkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlc3QnKSB8fFxuICAgIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jeScpIHx8IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1xYScpIHx8XG4gICAgZWwuZ2V0QXR0cmlidXRlKCdyb2xlJykgfHwgKGVsLmlkICYmICFTVFJPTkdfSURfUkUudGVzdChlbC5pZCkpLFxuICApO1xuY29uc3QgTUVESVVNX1RBR1MgPSBuZXcgU2V0KFsnQlVUVE9OJywgJ0EnLCAnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJywgJ0ZPUk0nXSk7XG5jb25zdCBXRUFLX1RBR1MgPSBuZXcgU2V0KFsnQVJUSUNMRScsICdTRUNUSU9OJywgJ05BVicsICdIRUFERVInLCAnRk9PVEVSJywgJ0xJJ10pO1xuY29uc3QgaXNNZWRpdW1NYXJrZXIgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IE1FRElVTV9UQUdTLmhhcyhlbC50YWdOYW1lKTtcbmNvbnN0IGlzV2Vha01hcmtlciA9IChlbDogRWxlbWVudCk6IGJvb2xlYW4gPT5cbiAgV0VBS19UQUdTLmhhcyhlbC50YWdOYW1lKSB8fCAvXkhbMS02XSQvLnRlc3QoZWwudGFnTmFtZSk7XG5cbi8vIFNuYXAgaG92ZXIvY2xpY2sgdGFyZ2V0IHRvIGl0cyBuZWFyZXN0IFwiY29tcG9uZW50XCIgYW5jZXN0b3IuIFdpdGhvdXRcbi8vIHRoaXMsIGFsdC1ob3ZlcmluZyBhIGJ1dHRvbiB3aXRoIHN0cnVjdHVyZWQgY2hpbGRyZW4gKGljb24gc3BhbiArXG4vLyBsYWJlbCBzcGFuKSBzZWxlY3RzIHdoaWNoZXZlciBpbm5lciBzcGFuIHRoZSBjdXJzb3IgaGFwcGVuZWQgdG8gbGFuZFxuLy8gb24g4oCUIHRocmVlIGRpZmZlcmVudCBjYXB0dXJlcyBvZiB0aGUgXCJzYW1lIGNvbXBvbmVudFwiIGRlcGVuZGluZyBvbiBhXG4vLyBmZXctcGl4ZWwgbW91c2UgZGlmZmVyZW5jZS4gU25hcCB3YWxrcyB1cCB0aGUgRE9NIGxvb2tpbmcgZm9yIHRoZVxuLy8gY2xvc2VzdCBTVFJPTkcgb3IgTUVESVVNIG1hcmtlciB3aXRoaW4gYG1heERlcHRoYCBsZXZlbHMgYW5kIHJldHVybnNcbi8vIHRoYXQgYW5jZXN0b3I7IGZhbGxzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGVsZW1lbnQgd2hlbiBub25lIGlzIGZvdW5kLlxuLy9cbi8vIEFsc28gZm9sZHMgdGhlIGV4aXN0aW5nIFwia25vd24gY2FwdHVyZWQgc2VsZWN0b3IgYW5jZXN0b3JcIiBsb29rdXAgaW50b1xuLy8gb25lIGhlbHBlciBzbyBjYWxsZXJzIGRvbid0IGhhdmUgdG8gY2hhaW4gdHdvIHBhc3Nlcy5cbi8vIFRydWUgd2hlbiBhbiBlbGVtZW50IGZpbGxzIDkwJSsgb2YgdGhlIHZpZXdwb3J0IGluIGJvdGggYXhlcy4gVGhlXG4vLyBydW50aW1lIGZpbHRlcnMgb3V0IHN1Y2ggY2FwdHVyZXMgKGFsdC1jbGljayBza2lwcywgZHJhZyByZWplY3RzKVxuLy8gYmVjYXVzZSBncmFiYmluZyB0aGUgcGFnZSB3cmFwcGVyIGlzIG5ldmVyIHRoZSB1c2VyJ3MgaW50ZW50LiBVc2VkXG4vLyBoZXJlIGluIHNuYXBUb0NvbXBvbmVudCB0byBBVk9JRCB3YWxraW5nIHVwIHRvIGEgaHVnZSBhbmNlc3RvciDigJRcbi8vIHRoYXQgcHJvZHVjZWQgc2lsZW50IGZhaWx1cmVzIG9uIHNpdGVzIGxpa2Ugd3Jhbm5nbGUuY29tL2Fib3V0XG4vLyB3aGVyZSB0aGUgbmVhcmVzdCBTVFJPTkcgbWFya2VyIGlzIGA8bWFpbiBpZD1cIm1haW5cIj5gIChodWdlKSwgc29cbi8vIHRoZSB1c2VyJ3MgYWx0LWNsaWNrIG9uIGEgaGVhZGluZyBnb3Qgc25hcHBlZCB0byA8bWFpbj4gYW5kIHRoZW5cbi8vIHJlamVjdGVkIGZvciBiZWluZyBodWdlLCB3aXRoIG5vIGNhcHR1cmUgYW5kIG5vIHJpbmcuXG5jb25zdCBpc0h1Z2VWaWV3cG9ydEZpbGwgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiB0cnVlO1xuICBjb25zdCByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiByLndpZHRoID49IHdpbmRvdy5pbm5lcldpZHRoICogMC45ICYmIHIuaGVpZ2h0ID49IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOTtcbn07XG5cbmV4cG9ydCBjb25zdCBzbmFwVG9Db21wb25lbnQgPSAoXG4gIHRndDogRWxlbWVudCxcbiAga25vd25DYXB0dXJlZDogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgbWF4RGVwdGggPSA0LFxuKTogRWxlbWVudCA9PiB7XG4gIC8vIEZpcnN0IHBhc3M6IHByZWZlciBhIGtub3duLWNhcHR1cmVkIGFuY2VzdG9yIChzbyByZS1ob3ZlcmluZyBhIGNoaWxkXG4gIC8vIG9mIGFuIGFscmVhZHktc2F2ZWQgY2FyZCBzbmFwcyB0byB0aGUgY2FyZCkuXG4gIGlmIChrbm93bkNhcHR1cmVkLnNpemUpIHtcbiAgICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IHRndDtcbiAgICB3aGlsZSAoY3VyICYmIGN1ciAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgZm9yIChjb25zdCBzZWwgb2Yga25vd25DYXB0dXJlZCkge1xuICAgICAgICB0cnkgeyBpZiAoY3VyLm1hdGNoZXMoc2VsKSkgcmV0dXJuIGN1cjsgfSBjYXRjaCB7IC8qIGludmFsaWQgc2VsZWN0b3IgKi8gfVxuICAgICAgfVxuICAgICAgY3VyID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICB9XG4gIC8vIFNlY29uZCBwYXNzOiBuZWFyZXN0IFNUUk9ORyBvciBNRURJVU0gbWFya2VyIHdpdGhpbiBkZXB0aCwgQlVUXG4gIC8vIHNraXAgYW55IGFuY2VzdG9yIHRoYXQncyB2aWV3cG9ydC1zaXplZC4gVGhlIHJ1bnRpbWUncyBodWdlLWVsZW1lbnRcbiAgLy8gZmlsdGVyIHJlamVjdHMgaHVnZSBjYXB0dXJlcywgc28gc25hcHBpbmcgdGhlcmUgaXMgYSBndWFyYW50ZWVkXG4gIC8vIHNpbGVudCBtaXNzLiBJZiB0aGUgbWFya2VyIHdlIGZpbmQgaXMgaHVnZSwga2VlcCB3YWxraW5nIGFuZCB0cnlcbiAgLy8gdGhlIG5leHQ7IGlmIG5vdGhpbmcgaW4tZGVwdGggaXMgbm9uLWh1Z2UsIHJldHVybiB0aGUgb3JpZ2luYWxcbiAgLy8gY2xpY2sgdGFyZ2V0ICh3aGljaCBjYXB0dXJlRW50cnkgdGhlbiB2YWxpZGF0ZXMgc2VwYXJhdGVseSkuXG4gIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gdGd0O1xuICBmb3IgKGxldCBpID0gMDsgaSA8PSBtYXhEZXB0aCAmJiBjdXIgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5OyBpKyspIHtcbiAgICBpZiAoKGlzU3Ryb25nTWFya2VyKGN1cikgfHwgaXNNZWRpdW1NYXJrZXIoY3VyKSkgJiYgIWlzSHVnZVZpZXdwb3J0RmlsbChjdXIpKSByZXR1cm4gY3VyO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiB0Z3Q7XG59O1xuXG4vLyAzRC1hcHAtc3R5bGUgcmlnb3JvdXMgc2VsZWN0aW9uOiBwcmUtY29sbGVjdCBhIFNUQUJMRSBjYW5kaWRhdGUgc2V0IHdoZW5cbi8vIHRoZSBkcmFnIHN0YXJ0cyAoYHBpY2tEcmFnQ2FuZGlkYXRlc2ApLCB0aGVuIGBlbGVtZW50c0luUmVjdGAgZmlsdGVyc1xuLy8gdGhhdCBzZXQgYnkgdGhlIHJ1YmJlci1iYW5kIHJlY3QgZWFjaCBmcmFtZS4gVGhlIHBvb2wgaXMgbG9ja2VkIG9uY2Ugc29cbi8vIHRoZSBydWJiZXIgYmFuZCBncm93cyAvIHNocmlua3MgbW9ub3RvbmljYWxseSB3aXRoIHJlY3Qgc2l6ZSDigJQgbm8gcmFuZG9tXG4vLyBzZWxlY3RzL2Rlc2VsZWN0cyBtaWQtZHJhZy5cbi8vXG4vLyBFYXJsaWVyIHRoaXMgZnVuY3Rpb24gcGlja2VkIGEgc2luZ2xlIFwidGllclwiIChTVFJPTkc9ZGF0YS10ZXN0aWQg4oaSXG4vLyBNRURJVU09cm9sZS9pZC9idXR0b24g4oaSIFdFQUs9Y2xhc3MpLCBwcmVmZXJyaW5nIHdoaWNoZXZlciBoYWQg4omlMiBoaXRzLFxuLy8gYW5kIHNpbGVudGx5IEVYQ0xVREVEIGV2ZXJ5dGhpbmcgb3V0c2lkZSB0aGF0IHRpZXIgZm9yIHRoZSByZXN0IG9mIHRoZVxuLy8gZHJhZy4gVGhlIHVzZXIgcmVwb3J0ZWQgaXQgZmVsdCBsaWtlIHRoZSBtYXJxdWVlIHdhcyBcImRpc2NyaW1pbmF0aW5nIG9uXG4vLyB6IG9yIHRyZWUgdGllclwiIOKAlCBleGFjdGx5IHRoZSBzeW1wdG9tIG9mIGEgc3Ryb25nbHktbWFya2VkIHNpYmxpbmdcbi8vIGhpamFja2luZyB0aGUgdGllciBhbmQgZmlsdGVyaW5nIG91dCBhbiBlbGVtZW50IHRoZSB1c2VyIGNvdWxkIGNsZWFybHlcbi8vIHNlZSBpbnNpZGUgdGhlIHJlY3QuIFdlIG5vdyByZXR1cm4gZXZlcnkgdmlzaWJsZSBub24tb3ZlcmxheSBlbGVtZW50O1xuLy8gdGhlIGlubmVybW9zdC1vbmx5IGZpbHRlciBpbiBlbGVtZW50c0luUmVjdCBkcm9wcyBhbmNlc3RvciBtYXRjaGVzIHdoZW5cbi8vIGEgZGVzY2VuZGFudCBhbHNvIG1hdGNoZXMsIHdoaWNoIGdpdmVzIHRoZSBpbnR1aXRpdmUgXCJzZWxlY3Qgd2hhdCdzIGluXG4vLyB0aGUgcmVjdFwiIGJlaGF2aW9yIHdpdGhvdXQgdGhlIGludmlzaWJsZSBleGNsdXNpb24uXG4vL1xuLy8gU2VsZWN0aW9uIG1vZGUgKGRyYWcgZGlyZWN0aW9uKTpcbi8vICAg4oCiICdmdWxsJyAgICDigJQgZWxlbWVudCBiYm94IEZVTExZIEVOQ0xPU0VEIGJ5IHRoZSByZWN0IChsZWZ04oaScmlnaHQpLlxuLy8gICDigKIgJ3BhcnRpYWwnIOKAlCBlbGVtZW50IGJib3ggSU5URVJTRUNUUyB0aGUgcmVjdCAocmlnaHTihpJsZWZ0KS5cbmV4cG9ydCBjb25zdCBwaWNrRHJhZ0NhbmRpZGF0ZXMgPSAob3ZlcmxheUhvc3Q6IEVsZW1lbnQpOiBFbGVtZW50W10gPT4ge1xuICBjb25zdCBhbGxSYXcgPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbCgnKicpKTtcbiAgcmV0dXJuIGFsbFJhdy5maWx0ZXIoKGVsKSA9PiB7XG4gICAgaWYgKG92ZXJsYXlIb3N0LmNvbnRhaW5zKGVsKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoci53aWR0aCA9PT0gMCB8fCByLmhlaWdodCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIERyb3AgdGhlIHBhZ2Utc3Bhbm5pbmcgd3JhcHBlcnMgKGJvZHksIGZ1bGwtYmxlZWQgc2VjdGlvbnMsIGV0Yy4pO1xuICAgIC8vIHRob3NlIHdvdWxkIGFsd2F5cyBtYXRjaCB0aGUgcmVjdCBhbmQgY3Jvd2Qgb3V0IHRoZWlyIGNoaWxkcmVuLlxuICAgIGlmIChyLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggKiAwLjkgJiYgci5oZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgZWxlbWVudHNJblJlY3QgPSAoXG4gIGNhbmRpZGF0ZXM6IHJlYWRvbmx5IEVsZW1lbnRbXSxcbiAgeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcixcbiAgbW9kZTogJ3BhcnRpYWwnIHwgJ2Z1bGwnID0gJ3BhcnRpYWwnLFxuKTogRWxlbWVudFtdID0+IHtcbiAgY29uc3QgbWluWCA9IE1hdGgubWluKHgxLCB4Mik7XG4gIGNvbnN0IG1heFggPSBNYXRoLm1heCh4MSwgeDIpO1xuICBjb25zdCBtaW5ZID0gTWF0aC5taW4oeTEsIHkyKTtcbiAgY29uc3QgbWF4WSA9IE1hdGgubWF4KHkxLCB5Mik7XG4gIGNvbnN0IG1hdGNoZXM6IEVsZW1lbnRbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGVsIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBjb25zdCByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKHIud2lkdGggPT09IDAgfHwgci5oZWlnaHQgPT09IDApIGNvbnRpbnVlO1xuICAgIGlmIChtb2RlID09PSAnZnVsbCcpIHtcbiAgICAgIGlmIChyLmxlZnQgPCBtaW5YIHx8IHIudG9wIDwgbWluWSB8fCByLnJpZ2h0ID4gbWF4WCB8fCByLmJvdHRvbSA+IG1heFkpIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoci5yaWdodCA8IG1pblggfHwgci5sZWZ0ID4gbWF4WCB8fCByLmJvdHRvbSA8IG1pblkgfHwgci50b3AgPiBtYXhZKSBjb250aW51ZTtcbiAgICB9XG4gICAgbWF0Y2hlcy5wdXNoKGVsKTtcbiAgfVxuICAvLyBJbm5lcm1vc3Qg4oCUIGRyb3AgYW5jZXN0b3JzIHRoYXQgY29udGFpbiBhbm90aGVyIG1hdGNoLiBTdGFibGUgYmVjYXVzZVxuICAvLyBpdCBvbmx5IGRlcGVuZHMgb24gdGhlIG1hdGNoZXMgc2V0LCBub3Qgb24gcmFua3MuXG4gIC8vXG4gIC8vIE5vIGFydGlmaWNpYWwgY2FwLiBUaGUgZWFybGllciAyNC1lbGVtZW50IGNlaWxpbmcgZXhpc3RlZCB0byBrZWVwXG4gIC8vIHJpbmcgcmVwYWludCBjb3N0IHByZWRpY3RhYmxlIGluIHdvcnN0LWNhc2UgXCJydWJiZXItYmFuZCB0aGUgd2hvbGVcbiAgLy8gdmlld3BvcnRcIiBkcmFncywgYnV0IGl0IGJlY2FtZSB1c2VyLXZpc2libGU6IGEgcmVhbCBzZWxlY3Rpb24gb2ZcbiAgLy8gfjMwIGdyaWQgY2VsbHMgd291bGQgc2lsZW50bHkgZHJvcCB0aGUgdHJhaWxpbmcgb25lcyB3aXRoIG5vXG4gIC8vIGZlZWRiYWNrLiBUd28gc2FmZXIgbWl0aWdhdGlvbnMgbm93IGtlZXAgcGVyZm9ybWFuY2UgYm91bmRlZDpcbiAgLy8gICDigKIgcGlja0RyYWdDYW5kaWRhdGVzIGFscmVhZHkgdHJpbXMgYm9keSAvIHBhZ2Utc3Bhbm5pbmcgd3JhcHBlcnNcbiAgLy8gICAgICh0aGUgZWxlbWVudHMgdGhhdCB3b3VsZCBvdGhlcndpc2UgZG9taW5hdGUgYW55IHJlY3QpLlxuICAvLyAgIOKAoiBjb250ZW50LXNjcmlwdCBwYWludHMgcmluZ3MgdmlhIGEgZGlmZiAob25seSBORVcgZWxlbWVudHMgZ2V0XG4gIC8vICAgICBhIHJpbmcpLCBzbyBhIHN0YWJsZSAyMDAtZWxlbWVudCBzZWxlY3Rpb24gaXMgb25lIHBhaW50LCBub3RcbiAgLy8gICAgIDIwMCBwYWludHMgcGVyIGZyYW1lLlxuICAvLyBJZiBhIGZ1dHVyZSBwYWdlIGdlbnVpbmVseSBwcm9kdWNlcyB0aG91c2FuZHMgb2YgaW5uZXJtb3N0IG1hdGNoZXNcbiAgLy8gd2UnbGwgcmV2aXNpdDsgdW50aWwgdGhlbiwgc2hpcCB3aGF0IHRoZSB1c2VyIGFjdHVhbGx5IGRyZXcuXG4gIHJldHVybiBtYXRjaGVzLmZpbHRlcigoYSkgPT4gIW1hdGNoZXMuc29tZSgoYikgPT4gYSAhPT0gYiAmJiBhLmNvbnRhaW5zKGIpKSk7XG59O1xuIiwKICAgICIvLyBTaGFyZWQgdHlwZXMgJiBtZXNzYWdlIHByb3RvY29sIGJldHdlZW4gY29udGVudCBzY3JpcHQsIHNpZGUgcGFuZWwsIGFuZFxuLy8gYmFja2dyb3VuZCBzZXJ2aWNlIHdvcmtlci5cblxuZXhwb3J0IHR5cGUgUmVjdCA9IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgVmlld3BvcnQgPSB7XG4gIHc6IG51bWJlcjsgaDogbnVtYmVyOyBkcHI6IG51bWJlcjtcbiAgLy8gVXNlci1wcmVmZXJlbmNlIG1lZGlhLXF1ZXJ5IHN0YXRlIGF0IGNhcHR1cmUgdGltZS4gTGV0cyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYXNvbiBhYm91dCB3aHkgY2FwdHVyZWQgYXBwZWFyYW5jZSBkaWZmZXJzIGJldHdlZW4gc2Vzc2lvbnNcbiAgLy8gKGUuZy4gZGFyay1tb2RlIHZzIGxpZ2h0LW1vZGUgb2YgdGhlIHNhbWUgY29tcG9uZW50KS5cbiAgY29sb3JTY2hlbWU/OiAnZGFyaycgfCAnbGlnaHQnO1xuICByZWR1Y2VkTW90aW9uPzogYm9vbGVhbjtcbiAgLy8gRG9jdW1lbnQgZGlyZWN0aW9uIChgbHRyYCAvIGBydGxgKSDigJQgZGlmZmVyZW50IGZyb20gdmlld3BvcnQgc2l6ZSxcbiAgLy8gY2hhbmdlcyB0aGUgbWVhbmluZyBvZiBgc3RhcnRgL2BlbmRgIGluIENTUyBhbmQgdGhlIHNlbnNlIG9mXG4gIC8vIGByZWN0LnhgLiBDYXB0dXJlZCBwZXIgcGFnZSBoZWFkZXIgc28gUlRMIGNhcHR1cmVzIGRvbid0IGdldFxuICAvLyBzaWxlbnRseSBtaXhlZCB3aXRoIExUUiBvbmVzLlxuICBkaXJlY3Rpb24/OiAnbHRyJyB8ICdydGwnO1xuICAvLyBCcm93c2VyIHpvb20gbGV2ZWwuIGB2aXN1YWxWaWV3cG9ydC5zY2FsZWAgcmVwb3J0cyB0aGUgcGluY2gtem9vbVxuICAvLyBmYWN0b3I7IHZhbHVlcyAhPSAxIG1lYW4gdGhlIHVzZXIgaGFzIHpvb21lZCBpbi9vdXQgYW5kIGFueSBsYXlvdXRcbiAgLy8gYnVnIHRoZXkncmUgY2FwdHVyaW5nIG1heSBub3QgcmVwcm8gYXQgZGVmYXVsdCB6b29tLlxuICB6b29tPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgRnJhbWV3b3JrSW5mbyA9IHtcbiAgZnJhbWV3b3JrOiAncmVhY3QnIHwgJ3Z1ZScgfCAnbGl0JyB8ICdzdGVuY2lsJyB8ICdzdmVsdGUnIHwgJ3dlYi1jb21wb25lbnQnO1xuICBuYW1lPzogc3RyaW5nO1xuICBkaXNwbGF5TmFtZT86IHN0cmluZztcbiAgc291cmNlPzoge2ZpbGU/OiBzdHJpbmcgfCBudWxsOyBsaW5lPzogbnVtYmVyIHwgbnVsbH07XG4gIC8vIFVwLXRyZWUgY29tcG9uZW50IGFuY2VzdHJ5IChpbm5lcm1vc3QgZmlyc3QpLiBGb3IgUmVhY3QsIHdhbGtlZCB2aWFcbiAgLy8gZmliZXIgYHJldHVybmAgY2hhaW47IGZvciBWdWUsIHZpYSBgX192dWVQYXJlbnRDb21wb25lbnQucGFyZW50YC5cbiAgLy8gVGhlIGNvbXBvbmVudCBuYW1lIGFsb25lIGRvZXNuJ3QgdGVsbCBhbiBhZ2VudCB3aGljaCBmaWxlIG93bnMgdGhlXG4gIC8vIHJlbmRlcmluZyDigJQgdGhlIGNoYWluIGhlbHBzIGl0IGdyZXAgdXB3YXJkIHRvIGZpbmQgdGhlIHJvdXRlXG4gIC8vIGNvbXBvbmVudCwgdGhlbiBkcmlsbCBpbnRvIHRoZSBvd25pbmcgZmlsZS5cbiAgY2hhaW4/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIEFuY2VzdG9yID0ge1xuICB0YWc6IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgTWF0Y2hlZFJ1bGUgPSB7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIGRlY2xhcmF0aW9ucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1lZGlhPzogc3RyaW5nO1xuICAvLyBXYXMgdGhlIEBtZWRpYSBxdWVyeSB0aGF0IHdyYXBzIHRoaXMgcnVsZSBhY3R1YWxseSBtYXRjaGVkIGF0XG4gIC8vIGNhcHR1cmUgdGltZT8gYHRydWVgID0gYWN0aXZlLFxuICAvLyBgZmFsc2VgID0gbWF0Y2hlZCB0aGUgc2VsZWN0b3IgYnV0IGluYWN0aXZlIChlLmcuIG1vYmlsZSBydWxlc1xuICAvLyBjYXB0dXJlZCBvbiBhIGRlc2t0b3Agdmlld3BvcnQpLCBgdW5kZWZpbmVkYCA9IG1hdGNoTWVkaWEgdGhyZXcuXG4gIG1lZGlhQWN0aXZlPzogYm9vbGVhbjtcbn07XG5cbi8vIFN5bnRoZXRpYyBoaW50cyBQaW5jaEdyYWIgYWRkcyB0byBlbnRyaWVzIOKAlCBrZXB0IGRpc3RpbmN0IGZyb20gYGF0dHJzYFxuLy8gKHJlYWwgRE9NIGF0dHJpYnV0ZXMpIHNvIGNvbnN1bWVycyBjYW4gdGVsbCB3aGF0IGNhbWUgZnJvbSB0aGUgcGFnZSB2c1xuLy8gd2hhdCB0aGUgY2FwdHVyZSBwaXBlbGluZSBpbmplY3RlZC5cbmV4cG9ydCB0eXBlIEVudHJ5SGludHMgPSB7XG4gIGZvcm1hdD86IHN0cmluZzsgICAgIC8vIGlucHV0IGZvcm1hdCBoaW50IChlLmcuICdZWVlZLU1NLUREJylcbiAgdmFsdWVNYXNrZWQ/OiBib29sZWFuOyAvLyBwYXNzd29yZCB2YWx1ZSB3YXMgbWFza2VkIGF0IGNhcHR1cmUgdGltZVxufTtcblxuZXhwb3J0IHR5cGUgRW50cnkgPSB7XG4gIC8vIFN0YWJsZSBwZXItZW50cnkgdXVpZC4gR2VuZXJhdGVkIGF0IGNhcHR1cmUgdGltZS4gRGlzdGluY3QgZnJvbSBgbmBcbiAgLy8gKGRpc3BsYXkgc2VxdWVuY2UpIGFuZCBmcm9tIGBpZGAgKERPTSBodG1sIGlkIGF0dHJpYnV0ZSkuIEZvcmVpZ24ta2V5XG4gIC8vIHRhcmdldCBmb3IgRmVlZGJhY2tNZXNzYWdlLnBhcmVudElkLlxuICB1aWQ6IHN0cmluZztcbiAgLy8gRm9yZWlnbiBrZXkgaW50byB0aGUgc2Vzc2lvbiByb3cgKFBhZ2VNZXNzYWdlLnNlc3Npb25JZCkuIExldHMgYVxuICAvLyBjb25zdW1lciBsaW5rIGNhcHR1cmVzIGJhY2sgdG8gXCJ3aGljaCBwYWdlLWxvYWQgY29udGV4dCBkaWQgdGhleVxuICAvLyBjb21lIGZyb20/XCIgd2l0aG91dCBkZXBlbmRpbmcgb24gVVJMIHN0cmluZyBlcXVhbGl0eSwgd2hpY2ggYnJlYWtzXG4gIC8vIG9uIGhhc2ggbmF2aWdhdGlvbiwgcXVlcnktcGFyYW0gc3dhcHMsIGFuZCBTUEEgcm91dGluZy4gU2V0IGJ5IHRoZVxuICAvLyBzaWRlIHBhbmVsIGF0IG1lc3NhZ2UtcmVjZWl2ZSB0aW1lLCBub3Qgb24gdGhlIHBhZ2Ugc2lkZS5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xuICBuOiBudW1iZXI7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0YWc6IHN0cmluZztcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgb3V0ZXJIVE1MPzogc3RyaW5nO1xuICB0ZXh0Pzogc3RyaW5nO1xuICAvLyBUaGUgdmlzdWFsbHktcmVuZGVyZWQgZm9ybSB3aGVuIENTUyBgdGV4dC10cmFuc2Zvcm1gIGlzIHNldC4gQ2FwdHVyZWRcbiAgLy8gYWxvbmdzaWRlIGB0ZXh0YCAod2hpY2ggaXMgdGhlIHNvdXJjZS10cnV0aCBgdGV4dENvbnRlbnRgKSBzbyBhbiBMTE1cbiAgLy8gY2FuIGRpc2FtYmlndWF0ZSBiZXR3ZWVuIGUuZy4gc291cmNlIGBSZWZyZXNoYCBhbmQgcmVuZGVyZWQgYFJFRlJFU0hgXG4gIC8vIHdpdGhvdXQgZmFsc2UtZ3JlcHBpbmcgYWdhaW5zdCBlaXRoZXIuXG4gIHJlbmRlcmVkVGV4dD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgYWNjZXNzaWJsZU5hbWU/OiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nOyAgICAgICAgICAgIC8vIHRoZSBET00gaHRtbCBpZCBhdHRyaWJ1dGUgKHVuY2hhbmdlZClcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG4gIGF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgLy8gcmVhbCBET00gYXR0cmlidXRlcyBvbmx5XG4gIGhpbnRzPzogRW50cnlIaW50czsgICAgIC8vIHN5bnRoZXRpYyBjYXB0dXJlLXRpbWUgaGludHNcbiAgcmVjdDogUmVjdDtcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICBpblNoYWRvd0RPTT86IGJvb2xlYW47XG4gIC8vIENTUyBzZWxlY3RvciBmb3IgdGhlIHNoYWRvdyBob3N0IHdoZW4gYGluU2hhZG93RE9NYCBpcyB0cnVlLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgKG9yIHRoZSBwYW5lbCdzIHJlLXZhbGlkYXRpb24gcGFzcykgZmluZCB0aGUgaG9zdCBlbGVtZW50XG4gIC8vIHNpbmNlIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsYCBkb2Vzbid0IHBpZXJjZSBzaGFkb3cgcm9vdHMuXG4gIHNoYWRvd0hvc3Q/OiBzdHJpbmc7XG4gIGNvbXBvbmVudFJvb3Q/OiBzdHJpbmc7XG4gIGFuY2VzdG9ycz86IEFuY2VzdG9yW107XG4gIGNvbXBvbmVudD86IEZyYW1ld29ya0luZm87XG4gIC8vIFJlYWN0IGV2ZW50IGhhbmRsZXIgbmFtZXMgcHJvYmVkIGZyb20gYF9fcmVhY3RQcm9wcyQ8a2V5PmAg4oCUIGFuc3dlcnNcbiAgLy8gXCJ3aGljaCBoYW5kbGVyIGZpcmVzIHdoZW4gdGhpcyBpcyBjbGlja2VkP1wiIHdpdGhvdXQgYW4gTExNIGhhdmluZyB0b1xuICAvLyBncmVwIHRoZSBjb2RlYmFzZS4gSW4gZGV2IGJ1aWxkcyB0aGVzZSBhcmUgcmVhbCBmdW5jdGlvbiBuYW1lczsgaW5cbiAgLy8gcHJvZCB0aGV5J3JlIG1pbmlmaWVkIGJ1dCBzdGlsbCBhbmNob3ItYWJsZS5cbiAgZXZlbnRzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gaHRteCAvIFN0aW11bHVzIC8gQWxwaW5lIC8gVHVyYm8gd2lyaW5nIG9uIHRoZSBlbGVtZW50LiBTZXJ2ZXItXG4gIC8vIHJlbmRlcmVkIGFwcHMgZG9uJ3QgaGF2ZSBSZWFjdCBmaWJlcnMg4oCUIGZvciB0aGVtLCB0aGlzIElTIHRoZVxuICAvLyBjb21wb25lbnQgc2hhcGUuXG4gIGJlaGF2aW9yQXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBUcnVlIHdoZW4gYGVsLmdldEFuaW1hdGlvbnMoKWAgcmVwb3J0ZWQgYW4gYWN0aXZlbHktcGxheWluZ1xuICAvLyBhbmltYXRpb24gYXQgY2FwdHVyZSB0aW1lLiBUZWxscyB0aGUgY29uc3VtZXIgdGhhdCBjYXB0dXJlZCByZWN0IC9cbiAgLy8gdHJhbnNmb3JtIC8gb3BhY2l0eSBtYXkgYmUgYXQgYW4gaW50ZXJwb2xhdGVkIG1pZC1hbmltYXRpb24gdmFsdWUuXG4gIGlzQW5pbWF0aW5nPzogYm9vbGVhbjtcbiAgLy8gRm9yIGVsZW1lbnRzIHJlbmRlcmVkIGludG8gYSBgPGNhbnZhcz5gLCB0aGUgRE9NIGdpdmVzIHVzIGVzc2VudGlhbGx5XG4gIC8vIG5vdGhpbmcgYWJvdXQgd2hhdCB3YXMgY2xpY2tlZCDigJQgdGhlIGNhbnZhcyBoYXMgbm8gY2hpbGRyZW4sIG5vXG4gIC8vIHRleHQsIG5vIG1lYW5pbmdmdWwgc2VsZWN0b3JzIGJlbG93IHRoZSBjYW52YXMgaXRzZWxmLiBDYXB0dXJlIHRoZVxuICAvLyBjbGljayBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY2FudmFzJ3MgYm91bmRpbmcgYm94IHNvIGEgZG93bnN0cmVhbVxuICAvLyBjb25zdW1lciBjYW4gY29ycmVsYXRlIChlLmcuIGFnYWluc3QgYSBEYXRhZG9nIC8gVGFibGVhdSAvIGNoYXJ0aW5nXG4gIC8vIGxpYnJhcnkgdGhhdCBleHBvc2VzIGRhdGEtcG9pbnQgY29vcmRpbmF0ZXMpLiBDb29yZGluYXRlcyBhcmUgQ1NTXG4gIC8vIHBpeGVsczsgbXVsdGlwbHkgYnkgYHZpZXdwb3J0LmRwcmAgdG8gZ2V0IGRldmljZSBwaXhlbHMuXG4gIGNhbnZhc0NsaWNrPzoge1xuICAgIG9mZnNldFg6IG51bWJlcjtcbiAgICBvZmZzZXRZOiBudW1iZXI7XG4gICAgY2FudmFzVzogbnVtYmVyO1xuICAgIGNhbnZhc0g6IG51bWJlcjtcbiAgICBjYW52YXNTZWxlY3Rvcjogc3RyaW5nO1xuICB9O1xuICAvLyBDb250ZW50ZWRpdGFibGUgcmljaC10ZXh0IGVkaXRvciBjb250ZXh0LiBQb3B1bGF0ZWQgd2hlbiB0aGUgY2FwdHVyZWRcbiAgLy8gbm9kZSBpcywgb3IgbGl2ZXMgaW5zaWRlLCBhIGBbY29udGVudGVkaXRhYmxlPXRydWVdYCBhbmNlc3Rvci4gTGV0c1xuICAvLyBhbiBMTE0gcmVhc29uaW5nIGFib3V0IGEgXCJjb3B5IGlzIHdyb25nXCIgLyBcInRoZSBlZGl0b3IgYnJlYWtzIHdoZW4gWFwiXG4gIC8vIGNhcHR1cmUga25vdyB3aGljaCBlZGl0b3IgbGlicmFyeSB0byBsb29rIGF0IOKAlCBzZWxlY3RvcnMgZ2VuZXJhdGVkXG4gIC8vIGJ5IFByb3NlTWlycm9yIC8gTGV4aWNhbCAvIGV0YyBhcmUgcnVudGltZS1pbnRlcm5hbCBhbmQgd29uJ3QgZ3JlcFxuICAvLyBhZ2FpbnN0IHVzZXIgY29kZSwgYnV0IHRoZSBMSUJSQVJZIHBvaW50ZXIgcm91dGVzIHRoZSBMTE0gdG8gdGhlXG4gIC8vIHJpZ2h0IHdyYXBwZXIgY29tcG9uZW50LlxuICBlZGl0b3I/OiB7XG4gICAga2luZDogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJztcbiAgICByb290U2VsZWN0b3I6IHN0cmluZztcbiAgICBjb250ZW50TGVuZ3RoOiBudW1iZXI7XG4gIH07XG4gIC8vIExhc3QgZmV3IERPTSBtdXRhdGlvbnMgQkVGT1JFIHRoZSBjbGljay4gUmVwcm8gY29udGV4dCBmb3IgYnVncyBsaWtlXG4gIC8vIFwiSSBjbGlja2VkIHRoZSB3cm9uZyBkcm9wZG93biBvcHRpb25cIiBvciBcInRoZSB2YWx1ZSBmbGlja2VyZWQgYmVmb3JlXG4gIC8vIEkgY2xpY2tlZCBpdFwiIOKAlCB3aXRob3V0IHRoaXMsIHRoZSBKU09OIHNuYXBzaG90cyBvbmx5IHRoZSBwb3N0LVxuICAvLyBtdXRhdGlvbiBzdGF0ZSwgbGVhdmluZyB0aGUgTExNIGJsaW5kIHRvIHdoYXQgdHJpZ2dlcmVkIHRoZVxuICAvLyBhcHBlYXJhbmNlIHRoZSB1c2VyIGNvbXBsYWluZWQgYWJvdXQuIFBpbmNoZ3JhYiBrZWVwcyBhbiA4LXNlY29uZFxuICAvLyByaW5nIGJ1ZmZlciBvZiBtdXRhdGlvbiByZWNvcmRzOyBjYXB0dXJlIGF0dGFjaGVzIHRoZSBtb3N0IHJlY2VudFxuICAvLyAzIGFzIGEgc25hcHNob3QuXG4gIGRvbU11dGF0aW9ucz86IERvbU11dGF0aW9uW107XG4gIHN0YXRlcz86IHN0cmluZ1tdOyAgICAgIC8vIGFjdGl2ZSBwc2V1ZG8tY2xhc3NlcyAod2FzIFJlY29yZDxzdHJpbmcsIHRydWU+IGluIHYxKVxuICAvLyBMb2NhdG9yIHF1YWxpdHk6IGhvdyBtYW55IGVsZW1lbnRzIGBzZWxlY3RvcmAgcmVzb2x2ZXMgdG8gaW4gaXRzXG4gIC8vIHNjb3BlICgxID0gdW5pcXVlKS4gSGlnaGVyIG1lYW5zIHRoZSBzZWxlY3RvciBpcyBhbWJpZ3VvdXMuXG4gIHNlbGVjdG9yTWF0Y2hDb3VudD86IG51bWJlcjtcbiAgLy8gRGlzYW1iaWd1YXRlZCBvcmRlcmluZyBmaWVsZHMuXG4gIC8vIGBuYCBpcyBwcmVzZXJ2ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXQgKGl0J3MgdGhlIGNhcHR1cmUtc2VxdWVuY2VcbiAgLy8gZGlzcGxheSBsYWJlbCBpbiB0aGUgc2lkZWJhcikuIFRoZSBuZXcgZmllbGRzIGFyZSBlbWl0LXRpbWUgb25seTpcbiAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCBzYW1lIGFzIGBuYCAoY2FwdHVyZSBzZXF1ZW5jZSB3aXRoaW4gc2Vzc2lvbilcbiAgLy8gICDigKIgZXZlbnRJbmRleCAgIOKAlCBtb25vdG9uaWMgcG9zaXRpb24gaW4gdGhlIEpTT05MIHN0cmVhbVxuICAvLyAgIOKAoiB2aXN1YWxPcmRlciAg4oCUIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHJhbmsgd2l0aGluIHRoZSBwYWdlXG4gIC8vICAg4oCiIGRpc3BsYXlMYWJlbCDigJQgaHVtYW4tZmFjaW5nIGxhYmVsIChtaXJyb3JzIGBuYCB0b2RheSlcbiAgY2FwdHVyZUluZGV4PzogbnVtYmVyO1xuICBldmVudEluZGV4PzogbnVtYmVyO1xuICB2aXN1YWxPcmRlcj86IG51bWJlcjtcbiAgZGlzcGxheUxhYmVsPzogc3RyaW5nO1xuICAvLyBHcm91cCBmbGF0dGVuaW5nIGZpZWxkcy5cbiAgLy8gVGhlIGdyb3VwIGhlYWQgY2FycmllcyBgZ3JvdXBNZW1iZXJVaWRzYCAoanVzdCB0aGUgSURzKTsgZWFjaFxuICAvLyBtZW1iZXIgZW1pdHMgYXMgaXRzIG93biB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZ1xuICAvLyBiYWNrIGF0IHRoZSBoZWFkLlxuICBncm91cE1lbWJlclVpZHM/OiBzdHJpbmdbXTtcbiAgZ3JvdXBVaWQ/OiBzdHJpbmc7XG4gIC8vIExpZ2h0d2VpZ2h0IGExMXkgYXVkaXQgY2FwdHVyZWQgYXQgY2xpY2sgdGltZS4gSGVhdmllciBjaGVja3NcbiAgLy8gKGZvY3VzLXZpc2libGUgc2NyZWVuc2hvdHMsIGF4ZSB2aW9sYXRpb25zKSBhcmUgbm90IHlldCB3aXJlZC5cbiAgYTExeT86IHtcbiAgICBjb250cmFzdFJhdGlvPzogbnVtYmVyO1xuICAgIGNvbnRyYXN0UGFzc2VzPzogJ0FBJyB8ICdBQUEnIHwgJ2ZhaWwnO1xuICAgIHRhYmJhYmxlPzogYm9vbGVhbjtcbiAgICBmb2N1c1Zpc2libGU/OiBib29sZWFuO1xuICB9O1xuICAvLyBQYXJlbnQgbGF5b3V0IGNvbnRleHQg4oCUIGZsZXgvZ3JpZC9vdmVyZmxvdy9zY3JvbGwvc3RhY2tpbmdcbiAgLy8gYW5jZXN0b3JzIHRoYXQgc2hhcGUgdGhlIGNhcHR1cmVkIGVsZW1lbnQncyBhcHBlYXJhbmNlLlxuICBsYXlvdXRDb250ZXh0PzogQXJyYXk8e1xuICAgIHRhZzogc3RyaW5nO1xuICAgIGRpc3BsYXk/OiBzdHJpbmc7XG4gICAgcG9zaXRpb24/OiBzdHJpbmc7XG4gICAgb3ZlcmZsb3c/OiBzdHJpbmc7XG4gICAgekluZGV4Pzogc3RyaW5nO1xuICAgIHRyYW5zZm9ybT86IHN0cmluZztcbiAgICB3aWxsQ2hhbmdlPzogc3RyaW5nO1xuICAgIGlzU2Nyb2xsQ29udGFpbmVyPzogYm9vbGVhbjtcbiAgICBzY3JvbGxMZWZ0PzogbnVtYmVyO1xuICAgIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgICBmbGV4Pzoge2RpcmVjdGlvbj86IHN0cmluZzsgd3JhcD86IHN0cmluZzsgYWxpZ25JdGVtcz86IHN0cmluZzsganVzdGlmeUNvbnRlbnQ/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gICAgZ3JpZD86IHt0ZW1wbGF0ZUNvbHVtbnM/OiBzdHJpbmc7IHRlbXBsYXRlUm93cz86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgfT47XG4gIC8vIEFzc2V0IHJlZmVyZW5jZXMgaW5zaWRlIHRoZSBjYXB0dXJlZCBzdWJ0cmVlIChpbWcgc3JjLCA8dXNlIGhyZWY+LFxuICAvLyBiYWNrZ3JvdW5kLWltYWdlIHVybCkuIFdoZW4gYSBjb21wbGFpbnQgaXMgYWJvdXQgYSBsb2dvIC8gaWNvbiAvXG4gIC8vIGFydHdvcmssIGFuIGFnZW50IHdpdGhvdXQgdGhlc2UgcmVmZXJlbmNlcyB3b3VsZCBiZSBsZWZ0IGd1ZXNzaW5nLlxuICBhc3NldHM/OiBBcnJheTx7XG4gICAgc3JjOiBzdHJpbmc7XG4gICAgbmF0dXJhbFc/OiBudW1iZXI7IG5hdHVyYWxIPzogbnVtYmVyO1xuICAgIHJlbmRlcmVkVz86IG51bWJlcjsgcmVuZGVyZWRIPzogbnVtYmVyO1xuICAgIGFsdD86IHN0cmluZztcbiAgICBsb2FkZWQ/OiBib29sZWFuO1xuICB9PjtcbiAgc3R5bGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWF0Y2hlZFJ1bGVzPzogTWF0Y2hlZFJ1bGVbXTtcbiAgcHNldWRvRWxlbWVudHM/OiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PjtcbiAgLy8gVHJ1bmNhdGlvbiBtYXJrZXJzIOKAlCBwcmVzZW50IHdoZW4gY2FwdHVyZSBoYWQgdG8gZWxpZGUgY29udGVudC4gTGV0c1xuICAvLyBhIGNvbnN1bWVyIGRldGVjdCBcInRoaXMgZW50cnkgd2FzIGN1dCBkb3duXCIgYW5kIHJlZmV0Y2ggZnJvbSB0aGVcbiAgLy8gbGl2ZSBwYWdlIGlmIGl0IG5lZWRzIHRoZSBmdWxsIHZlcnNpb24uXG4gIC8vICAgb3V0ZXJIVE1MIOKAlCBvcmlnaW5hbCBodG1sIGxlbmd0aCBiZWZvcmUgdGhlIHNpemUtY2FwIGtpY2tlZCBpbi5cbiAgLy8gICBjaGlsZHJlbiAg4oCUIG51bWJlciBvZiBkZXNjZW5kYW50IHN1YnRyZWVzIHJlcGxhY2VkIGJ5IGRlcHRoLWNhcFxuICAvLyAgICAgICAgICAgICAgIGVsaXNpb24gbWFya2VycyAoYDwhLS0gTiBjaGlsZHJlbiBlbGlkZWQgLS0+YCkuXG4gIHRydW5jYXRlZD86IHtvdXRlckhUTUw/OiBudW1iZXI7IGNoaWxkcmVuPzogbnVtYmVyOyB0ZXh0PzogbnVtYmVyfTtcbiAgLy8gR3JvdXAgb2YgYWRkaXRpb25hbCBjYXB0dXJlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBlbnRyeSAoQWx0K1NoaWZ0K0NsaWNrXG4gIC8vIC8gQWx0K2RyYWcgc2VsZWN0aW9ucyBjb2xsYXBzZSBoZXJlKS5cbiAgZ3JvdXA/OiBFbnRyeVtdO1xuICAvLyBPcHRpb25hbCBzY3JlZW5zaG90IGJ1bmRsZTogZWFjaCBmaWVsZCBpcyBhIHJlbGF0aXZlIHBhdGggdW5kZXIgdGhlXG4gIC8vIHVzZXIncyBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8gcm9vdC4gVGhlIGNhcHR1cmVkQXQgc3RhbXAgaXNcbiAgLy8gdGhlIElTTyB0aW1lc3RhbXAgd2hlbiB0aGUgc2hvdCB3YXMgdGFrZW4uXG4gIHNjcmVlbnNob3Q/OiB7XG4gICAgZWxlbWVudD86IHN0cmluZztcbiAgICBncm91cD86IHN0cmluZztcbiAgICBwYWdlPzogc3RyaW5nO1xuICAgIGNhcHR1cmVkQXQ/OiBzdHJpbmc7XG4gICAgLy8gQW4gZW1wdHkgYHNjcmVlbnNob3RgIGZpZWxkIGNvdWxkIG1lYW4gXCJub3QgeWV0IHNob3RcIiwgXCJmYWlsZWRcIixcbiAgICAvLyBvciBcInNraXBwZWQgb24gcHVycG9zZVwiLiBXaGVuIHRoZSBwaXBlbGluZSBkZWNsaW5lcyBvciBmYWlscyxcbiAgICAvLyBzZXQgdGhpcyBzbyByZWNlaXZlcnMga25vdyBpdCdzIG5vdCBhIHJldHJ5IGNhbmRpZGF0ZS5cbiAgICB1bmF2YWlsYWJsZVJlYXNvbj86ICdhdXRvU2NyZWVuc2hvdE9mZicgfCAnc2tpcFNjcmVlbnNob3RIb3N0cycgfCAnY2FwdHVyZUZhaWxlZCcgfCAncGVybWlzc2lvbkRlbmllZCcgfCBzdHJpbmc7XG4gICAgLy8gQ3JvcCBtZXRhZGF0YSBkZXNjcmliaW5nIHdoZXJlIHRoZSBjcm9wcGVkIFBORyBmaXRzIGluIHRoZVxuICAgIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgY3JvcD86IHtcbiAgICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZGV2aWNlUHhSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRwcjogbnVtYmVyO1xuICAgICAgcGFkZGluZzogbnVtYmVyO1xuICAgICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgICB9O1xuICB9O1xufTtcblxuLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBwYWdlIG1ldGFkYXRhLCBlbWl0dGVkIG9uY2UgcGVyIGRpc3RpbmN0IHBhZ2UgVVJMXG4vLyBpbnZvbHZlZCBpbiBjYXB0dXJlcyAoZGVkdXBlZCBieSBVUkwpLiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwuXG4vLyBgcGFydGlhbGAgaXMgc2V0IHdoZW4gb25seSB0aGUgdmlld3BvcnQgY291bGQgYmUgY2FwdHVyZWQgKGZ1bGwtcGFnZSBzdGl0Y2hcbi8vIHVuYXZhaWxhYmxlKSDigJQgc2VlIGJhY2tncm91bmQudHMgc3RpdGNoUGFnZSBsaW1pdGF0aW9ucy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdCA9IHsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmc7IGNhcHR1cmVkQXQ6IHN0cmluZzsgdmlld3BvcnQ6IHt3aWR0aDogbnVtYmVyO2hlaWdodDogbnVtYmVyfTsgc2Nyb2xsV2lkdGg6IG51bWJlcjsgc2Nyb2xsSGVpZ2h0OiBudW1iZXI7IGRldmljZVBpeGVsUmF0aW86IG51bWJlcjsgbGFuZzogc3RyaW5nOyBzY3JlZW5zaG90OiBzdHJpbmc7IHBhcnRpYWw/OiBib29sZWFuIH07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIC8vIFVzZXIgZXhwbGljaXRseSBkZXRhY2hlZCB0aGlzIGNvbW1lbnQgZnJvbSBhbnkgc2VsZWN0b3IuIFdpdGhvdXQgdGhlXG4gIC8vIGZsYWcsIGFkamFjZW5jeSB0byB0aGUgcHJlY2VkaW5nIHNlbGVjdG9yIHdvdWxkIHNpbGVudGx5IHJlLWFkb3B0IHRoZVxuICAvLyBjb21tZW50IGF0IHJlbmRlci9leHBvcnQgdGltZS5cbiAgZGV0YWNoZWQ/OiBib29sZWFuO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICAvLyBQYWdlIHJlcG9ydHMgaXRzIHN0aWNreSBwaW5jaC1tb2RlIHN0YXRlIChlLmcuIHRoZSB1c2VyIHByZXNzZWQgRXNjIG9uXG4gIC8vIHRoZSBwYWdlIHRvIGV4aXQpIHNvIHRoZSBwYW5lbCB0b2dnbGUgc3RheXMgaW4gc3luYy5cbiAgfCB7a2luZDogJ3NlbGVjdC1tb2RlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9XG4gIC8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgbWV0YWRhdGEgZm9yIG9uZSBkaXN0aW5jdCBwYWdlIChVUkwpLiBFbWl0dGVkIGF0XG4gIC8vIG1vc3Qgb25jZSBwZXIgVVJMICh0aGUgY29udGVudCBzY3JpcHQgZGVkdXBlcykuIFRoZSBwYW5lbCBjYW4gc3Rhc2ggdGhlc2VcbiAgLy8gYXMgcGFnZS1sZXZlbCBjb250ZXh0IC8gZXhwb3J0IHRoZW0gYWxvbmdzaWRlIGVsZW1lbnQgc2hvdHMuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90JzsgcGF5bG9hZDogUGFnZVNuYXBzaG90fTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0NzID1cbiAgfCB7a2luZDogJ291dGxpbmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBnb2xkPzogYm9vbGVhbjsgZGFzaGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ291dGxpbmUtY2xlYXInfVxuICAvLyBTdGlja3kgXCJwaW5jaCBtb2RlXCI6IHdoaWxlIG9uLCBwbGFpbiBob3Zlci9jbGljayBjYXB0dXJlcyB3aXRob3V0IHRoZVxuICAvLyBBbHQgbW9kaWZpZXIsIGFuZCB0aGUgcGFnZSBzaG93cyBhIG1vZGUgaW5kaWNhdG9yLiBFc2MgZXhpdHMuXG4gIHwge2tpbmQ6ICdzZWxlY3QtbW9kZSc7IG9uOiBib29sZWFufVxuICAvLyBFeHBvcnQtdGltZSByZXF1ZXN0IGZvciB0aGUgZnVsbCBzZXJpYWxpemVkIHBhZ2UgKG9wdC1pbiBwcmVmXG4gIC8vIGluY2x1ZGVQYWdlSFRNTCkuIFJlcGxpZWQgd2l0aCB7b2ssIHVybCwgdGl0bGUsIGh0bWx9OyBuZXZlciBwZXJzaXN0ZWRcbiAgLy8gdG8gY2hyb21lLnN0b3JhZ2Ug4oCUIHRoZSBwYXlsb2FkIGdvZXMgc3RyYWlnaHQgaW50byB0aGUgdGFyLlxuICB8IHtraW5kOiAncGFnZS1odG1sJ31cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGknOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9XG4gIHwge2tpbmQ6ICdzY3JvbGwtdG8nOyBzZWxlY3Rvcjogc3RyaW5nOyBzdGlja3k/OiBib29sZWFufVxuICB8IHtraW5kOiAnc3RpY2t5LWNsZWFyJ31cbiAgLy8gT25lLXNob3QgbG9jYXRvciBhbmltYXRpb246IHNjcm9sbCBpbnRvIHZpZXcgKyB0aHJlZSBwdWxzaW5nIHJpbmdzLlxuICAvLyBEaXN0aW5jdCBmcm9tIGBvdXRsaW5lYCAoc3VidGxlIGhvdmVyIHJpbmcpIGFuZCBgc2Nyb2xsLXRvYCAoc2lsZW50XG4gIC8vIHJlY2VudGVyKSBzbyB0aGUgc2lkZSBwYW5lbCBMb2NhdGUgYnV0dG9uIGNhbiByZXF1ZXN0IHNvbWV0aGluZyB1c2Vyc1xuICAvLyBjYW4gYWN0dWFsbHkgZmluZCBvbiBhIGJ1c3kgcGFnZS5cbiAgfCB7a2luZDogJ2xvY2F0ZS1mbGFzaCc7IHNlbGVjdG9yOiBzdHJpbmd9XG4gIHwge2tpbmQ6ICd2YWxpZGF0ZSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdsb2ctZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdyZWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnY2FwdHVyZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIC8vIE91dGxpbmUgdGhlIE50aCBhbmNlc3RvciBvZiBgc2VsZWN0b3JgIHdpdGhvdXQgY2FwdHVyaW5nIGl0IOKAlCB1c2VkIGJ5XG4gIC8vIGhvdmVyIG9uIGFuY2VzdG9yIGJyZWFkY3J1bWIgY2hpcHMgaW4gdGhlIHNpZGUgcGFuZWwgc28gdGhlIHVzZXJcbiAgLy8gcHJldmlld3Mgd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjbGlja2luZy5cbiAgfCB7a2luZDogJ291dGxpbmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICB8IHtraW5kOiAnYWx0LXN0YXRlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdtYW51YWwtY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uJzsgc2VsZWN0b3I6IHN0cmluZzsgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9XG4gIHwge2tpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfVxuICB8IHtraW5kOiAnc2V0LWNhcHR1cmVkJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ3NldC1jcy1wcmVmcyc7IHNwYWNpbmdPdmVybGF5PzogYm9vbGVhbjsgaG92ZXJTbmFwPzogYm9vbGVhbn1cbiAgLy8gU2NyZWVuc2hvdC10aW1lIG92ZXJsYXkgdG9nZ2xlcy4gVGhlIGJhY2tncm91bmQgYXNrcyB0aGUgY29udGVudCBzY3JpcHRcbiAgLy8gdG8gaGlkZSBpdHMgc2hhZG93LXJvb3QgY2hyb21lIChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIGJlZm9yZVxuICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlcywgdGhlbiByZXN0b3JlcyB2aXNpYmlsaXR5IG9uY2UgdGhlIFBORyBpcyBiYWNrLlxuICB8IHtraW5kOiAnaGlkZS1vdmVybGF5cyd9XG4gIHwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ307XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25QYXlsb2FkID0ge1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLy8gVGhlIGNhcHR1cmVkIGVudHJ5J3Mgc3RhYmxlIHVpZC4gVGhlIGNvbnRlbnQgc2NyaXB0IG5lZWRzIHRoaXMgc29cbiAgLy8gaXRzIG9uLXBhZ2UgY29tbWVudCBib3ggY2FuIHJvdXRlIHRoZSBjb21tZW50IHRvIHRoZSAqc3BlY2lmaWMqXG4gIC8vIGNhcHR1cmUgcmF0aGVyIHRoYW4gdG8gXCJhbnkgc2VsZWN0b3IgdGhhdCBtYXRjaGVzLlwiIFByZXZlbnRzXG4gIC8vIGNyb3NzLWNvbnRhbWluYXRpb24gd2hlbiB0d28gY2FwdHVyZXMgc2hhcmUgYSBzZWxlY3RvciBhY3Jvc3NcbiAgLy8gcGFnZXMgb3IgdHdvIHNpYmxpbmcgZWxlbWVudHMgc2hhcmUgYSB0ZXN0SWQuXG4gIHVpZD86IHN0cmluZztcbiAgbj86IG51bWJlcjtcbiAgY2FwdHVyZWQ/OiBib29sZWFuO1xuICBmZWVkYmFjaz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0JnID1cbiAgfCB7a2luZDogJ2NhcHR1cmUtc2NyZWVuc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc3dpdGNoLXRvLXRhYic7IHVybDogc3RyaW5nOyBvcGVuSWZNaXNzaW5nPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2xpc3Qtb3Blbi10YWJzJ31cbiAgfCB7a2luZDogJ3Nob3QtZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1ncm91cCc7IHNlbGVjdG9yczogc3RyaW5nW107IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1wYWdlJzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIEZ1bGwtcGFnZSAoYmVzdC1lZmZvcnQpIHNjcmVlbnNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFVubGlrZVxuICAvLyBzaG90LXBhZ2UgdGhpcyBkb2VzIE5PVCB3cml0ZSBhIGZpbGUgb3IgYnVpbGQgYSB0aHVtYm5haWwg4oCUIGl0IGp1c3RcbiAgLy8gcmV0dXJucyB0aGUgc3RpdGNoZWQgUE5HIGFzIGEgZGF0YSBVUkwgc28gdGhlIGNhbGxlciAoY29udGVudCBzY3JpcHQpIGNhblxuICAvLyBhdHRhY2ggaXQgdG8gYSBQYWdlU25hcHNob3QuIGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnRcbiAgLy8gY291bGQgYmUgY2FwdHVyZWQuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBQYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIChyZSlpbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IOKAlCB0aGUgZml4XG4gIC8vIGZvciBcIkFsdCBzdG9wcGVkIHdvcmtpbmdcIiBhZnRlciBhbiBleHRlbnNpb24gcmVsb2FkIG9ycGhhbnMgdGhlIHBhZ2Unc1xuICAvLyBjb250ZW50IHNjcmlwdC4gRGVmYXVsdHMgdG8gdGhlIGFjdGl2ZSB0YWIuXG4gIHwge2tpbmQ6ICdwZy1yZWluamVjdCc7IHRhYklkPzogbnVtYmVyfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbi8vIFJlcGx5IHRvIGEgYHBhZ2Utc25hcHNob3Qtc2hvdGAgcmVxdWVzdC4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMIG9mXG4vLyB0aGUgKGJlc3QtZWZmb3J0KSBmdWxsIHBhZ2U7IGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnQgd2FzXG4vLyBjYXB0dXJlZC4gYG9rOmZhbHNlYCBjYXJyaWVzIGFuIGVycm9yIHN0cmluZy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgc2NyZWVuc2hvdD86IHN0cmluZztcbiAgcGFydGlhbD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5XG4gIHwgUGFnZVNuYXBzaG90UmVwbHk7XG5cbi8vIOKUgOKUgOKUgCBFeHBvcnQgc2hhcGVzICh2Mikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBNYW5pZmVzdCBsaW5lIGVtaXR0ZWQgYXMgdGhlIHZlcnkgZmlyc3QgSlNPTkwgbGluZS4gQ2FycmllcyB0aGUgbWV0YWRhdGFcbi8vIG5lY2Vzc2FyeSB0byByZXN5bmMgYSBkb3dubG9hZGVkIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlICsgdG9vbGluZy5cbmV4cG9ydCB0eXBlIEV4cG9ydE1hbmlmZXN0ID0ge1xuICB2OiAyO1xuICB0eXBlOiAnbWFuaWZlc3QnO1xuICB0czogc3RyaW5nOyAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgZXhwb3J0IHdhcyBnZW5lcmF0ZWRcbiAgZ2VuZXJhdGVkOiBudW1iZXI7IC8vIGVwb2NoIG1zIChtaXJyb3Igb2YgdHMgaW4gbWFjaGluZS1yZWFkYWJsZSBmb3JtKVxuICB0b29sOiAncGluY2hncmFiJztcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGZvcm1hdDogJ2pzb25sJyB8ICdtYXJrZG93bicgfCAndGFyLnpzdCc7XG4gIC8vIENvbnRlbnQtZGVyaXZlZCBpZGVudGl0eTogZmlyc3QgMTYgaGV4IGNoYXJzIG9mIGEgU0hBLTI1NiBvdmVyIHRoZVxuICAvLyBzbGltIHJvd3MgKyBzY3JlZW5zaG90IG5hbWVzLiBTdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMgb2YgdGhlIHNhbWVcbiAgLy8gY29udGVudCwgc28gZG93bnN0cmVhbSBzdGF0ZSAoZS5nLiB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8qL2J1bmRsZXMvKVxuICAvLyBrZXlzIG9uIGl0IHdpdGhvdXQgZHVwbGljYXRpbmcgd29yay5cbiAgYnVuZGxlSWQ/OiBzdHJpbmc7XG4gIGhvc3RzOiBzdHJpbmdbXTtcbiAgLy8gQW1iaWd1b3VzIHRvdGFscy4gVGhlIHByZXZpb3VzIGBzZWxlY3RvcnMgLyBmZWVkYmFjayAvIHBhZ2VzYFxuICAvLyB0cmlwbGUgZGlkbid0IHNheSB3aGV0aGVyIG5lc3RlZFxuICAvLyBncm91cCBtZW1iZXJzIHdlcmUgY291bnRlZCwgd2hldGhlciBmZWVkYmFjay1iZWFyaW5nIHBhcmVudHMgd2VyZVxuICAvLyBhIHN1YnNldCwgb3IgaG93IHNjcmVlbnNob3RzIHdlcmUgdGFsbGllZC4gVGhlIGV4cGFuZGVkIHNoYXBlXG4gIC8vIGJlbG93IG5hbWVzIGV2ZXJ5IGNhdGVnb3J5IGV4cGxpY2l0bHkgc28gYSBkb3duc3RyZWFtIGFnZW50IGNhblxuICAvLyB0ZWxsIGV4YWN0bHkgd2hhdCdzIGluIHRoZSBidW5kbGUuXG4gIGNvdW50czoge1xuICAgIC8vIFRvcC1sZXZlbCBzZWxlY3RvciByb3dzIGluIHRoZSBKU09OTCBzdHJlYW0gKGV4Y2x1ZGVzIG5lc3RlZFxuICAgIC8vIGdyb3VwIG1lbWJlcnMsIGJ1dCB0aGUgYGdyb3VwTWVtYmVyc2AgZmllbGQgY291bnRzIHRob3NlKS5cbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBmZWVkYmFjazogbnVtYmVyO1xuICAgIHBhZ2VzOiBudW1iZXI7XG4gICAgLy8gTnVtYmVyIG9mIHNlbGVjdG9yIHJvd3MgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBjaGlsZC5cbiAgICAvLyBVc2VmdWwgZm9yIFwic2hvdyBtZSBvbmx5IHRoZSBpdGVtcyB3aXRoIGNvbW1lbnRzXCIuXG4gICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9ycyB0aGF0IHNoaXAgdW5kZXIgYSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYCBhcnJheVxuICAgIC8vIHJhdGhlciB0aGFuIGFzIHRoZWlyIG93biB0b3AtbGV2ZWwgcm93LlxuICAgIGdyb3VwTWVtYmVycz86IG51bWJlcjtcbiAgICAvLyBTY3JlZW5zaG90IGludmVudG9yeSAoY291bnRlZCBieSBmaWxlLCBkZWR1cGVkKS5cbiAgICBzY3JlZW5zaG90c0VsZW1lbnQ/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNHcm91cD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c1BhZ2U/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3Igcm93cyB0aGF0IHNob3VsZCBoYXZlIGFuIGVsZW1lbnQgc2NyZWVuc2hvdCBidXQgZG9uJ3RcbiAgICAvLyAocG9zdC1idWctIzIgZm9yY2VkIHNob290IG1heSBzdGlsbCBmYWlsKS4gUmVwYWlyIGFnZW50cyBjYW5cbiAgICAvLyBza2lwIHRoZXNlIG9yIHJlcXVlc3QgYSByZS1jYXB0dXJlLlxuICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90PzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2hvc2UgcGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbnkgc2VsZWN0b3JcbiAgICAvLyBpbiB0aGlzIGFyY2hpdmUuIFNob3VsZCBhbHdheXMgYmUgMDsgbm9uLXplcm8gbWVhbnMgdGhlIGV4cG9ydFxuICAgIC8vIGdvdCB0cnVuY2F0ZWQgb3IgYSBwYXJlbnQgd2FzIGRlbGV0ZWQgYmV0d2VlbiBjYXB0dXJlICsgZW1pdC5cbiAgICBvcnBoYW5lZEZlZWRiYWNrPzogbnVtYmVyO1xuICAgIC8vIEZ1bGwtcGFnZSBIVE1MIGRvY3VtZW50cyBidW5kbGVkIHVuZGVyIHBhZ2VzLyAob3B0LWluIHByZWYpLlxuICAgIHBhZ2VzSHRtbD86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gV2hlcmUgdGhlIGFnZW50IGRvY3RyaW5lIGxpdmVzIGluc2lkZSB0aGUgYXJjaGl2ZSAoU2VuZC10by1BZ2VudFxuICAvLyBwcm90b2NvbCkuIEFic2VudCBvbiBwbGFpbiBKU09OTCBleHBvcnRzLlxuICBhZ2VudFByb3RvY29sPzoge2FyY2hpdmVQYXRoOiBzdHJpbmd9O1xuICAvLyBWZW5kb3JlZCBza2lsbCBkb2N1bWVudHMgYnVuZGxlZCBpbnRvIHRoaXMgYXJjaGl2ZSAoc3Vic2V0IG9mIHRoZVxuICAvLyByaWNoZXIgc2tpbGxzLWluZGV4Lmpzb24gYXQgdGhlIGFyY2hpdmUgcm9vdCkuIGBpbnZvY2F0aW9uYCBjYXJyaWVzIGFcbiAgLy8gcGx1Z2luLWNvbW1hbmQgZm9ybSBmb3IgaGFybmVzc2VzIHRoYXQgc3VwcG9ydCBpdC5cbiAgYnVuZGxlZFNraWxscz86IEFycmF5PHtpZDogc3RyaW5nOyBraW5kOiAnc2tpbGwnIHwgJ3JlZmVyZW5jZSc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGludm9jYXRpb24/OiBzdHJpbmd9PjtcbiAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gIHBhZ2VzSHRtbD86IEFycmF5PHt1cmw6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn0+O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBTdWJzZXQgb2YgbHVjaWRlLmRldiBpY29ucyBpbmxpbmVkIGFzIFNWRyBpbm5lci1tYXJrdXAuXG4vLyBFYWNoIGVudHJ5IGlzIHRoZSBib2R5IG9mIDxzdmcgLi4uID4gLi4uIDwvc3ZnPjsgc3ZnU3RyaW5nKCkgd3JhcHMgaXQuXG4vLyBTaXplcyBkZWZhdWx0IHRvIDE2OyBvdmVycmlkZSB3aXRoIHRoZSBzaXplIGFyZ3VtZW50LlxuLy9cbi8vIE1JVCDigJQgaHR0cHM6Ly9naXRodWIuY29tL2x1Y2lkZS1pY29ucy9sdWNpZGVcblxuY29uc3QgSUNPTlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjaGV2cm9uLXJpZ2h0JzogJzxwYXRoIGQ9XCJtOSAxOCA2LTYtNi02XCIvPicsXG4gICdjaGV2cm9uLWRvd24nOiAnPHBhdGggZD1cIm02IDkgNiA2IDYtNlwiLz4nLFxuICBjb3B5OiAnPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgeD1cIjhcIiB5PVwiOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTQgMTZjLTEuMSAwLTItLjktMi0yVjRjMC0xLjEuOS0yIDItMmgxMGMxLjEgMCAyIC45IDIgMlwiLz4nLFxuICBwZW5jaWw6ICc8cGF0aCBkPVwiTTIxLjE3NCA2LjgxMmExIDEgMCAwIDAtMy45ODYtMy45ODdMMy44NDIgMTYuMTc0YTIgMiAwIDAgMC0uNS44M2wtMS4zMjEgNC4zNTJhLjUuNSAwIDAgMCAuNjIzLjYyMmw0LjM1My0xLjMyYTIgMiAwIDAgMCAuODMtLjQ5N3pcIi8+PHBhdGggZD1cIm0xNSA1IDQgNFwiLz4nLFxuICAndHJhc2gtMic6ICc8cGF0aCBkPVwiTTMgNmgxOFwiLz48cGF0aCBkPVwiTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNlwiLz48cGF0aCBkPVwiTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeDI9XCIxMFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB4Mj1cIjE0XCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+JyxcbiAgcGx1czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz48cGF0aCBkPVwiTTEyIDV2MTRcIi8+JyxcbiAgeDogJzxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPicsXG4gIG1pbnVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPicsXG4gIHNlYXJjaDogJzxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiLz48cGF0aCBkPVwibTIxIDIxLTQuMy00LjNcIi8+JyxcbiAgZG93bmxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjcgMTAgMTIgMTUgMTcgMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjE1XCIgeTI9XCIzXCIvPicsXG4gIHVwbG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTcgOCAxMiAzIDcgOFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiM1wiIHkyPVwiMTVcIi8+JyxcbiAgZ2l0aHViOiAnPHBhdGggZD1cIk0xNSAyMnYtNGE0LjggNC44IDAgMCAwLTEtMy41YzMgMCA2LTIgNi01LjUuMDgtMS4yNS0uMjctMi40OC0xLTMuNS4yOC0xLjE1LjI4LTIuMzUgMC0zLjUgMCAwLTEgMC0zIDEuNS0yLjY0LS41LTUuMzYtLjUtOCAwQzYgMiA1IDIgNSAyYy0uMyAxLjE1LS4zIDIuMzUgMCAzLjVBNS40IDUuNCAwIDAgMCA0IDljMCAzLjUgMyA1LjUgNiA1LjUtLjM5LjQ5LS42OCAxLjA1LS44NSAxLjY1LS4xNy42LS4yMiAxLjIzLS4xNSAxLjg1djRcIi8+PHBhdGggZD1cIk05IDE4Yy00LjUxIDItNS0yLTctMlwiLz4nLFxuICBzdGFyOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiLz4nLFxuICAnY2lyY2xlLWRvdCc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgY3Jvc3NoYWlyOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjIyXCIgeDI9XCIxOFwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiNlwiIHgyPVwiMlwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI2XCIgeTI9XCIyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIyMlwiIHkyPVwiMThcIi8+JyxcbiAgdGFyZ2V0OiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjZcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIyXCIvPicsXG4gICdwYW5lbC1sZWZ0LWNsb3NlJzogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIi8+PHBhdGggZD1cIk05IDN2MThcIi8+PHBhdGggZD1cIm0xNiAxNS0zLTMgMy0zXCIvPicsXG4gICdleHRlcm5hbC1saW5rJzogJzxwYXRoIGQ9XCJNMTUgM2g2djZcIi8+PHBhdGggZD1cIk0xMCAxNCAyMSAzXCIvPjxwYXRoIGQ9XCJNMTggMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNlwiLz4nLFxuICAnbWVzc2FnZS1zcXVhcmUtcGx1cyc6ICc8cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48bGluZSB4MT1cIjlcIiB4Mj1cIjE1XCIgeTE9XCIxMFwiIHkyPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjdcIiB5Mj1cIjEzXCIvPicsXG4gICdhbGVydC1jaXJjbGUnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiOFwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTIuMDFcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICAncmVmcmVzaC1jdyc6ICc8cGF0aCBkPVwiTTMgMTJhOSA5IDAgMCAxIDE1LTYuN0wyMSA4XCIvPjxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPjxwYXRoIGQ9XCJNMjEgMTJhOSA5IDAgMCAxLTE1IDYuN0wzIDE2XCIvPjxwYXRoIGQ9XCJNMyAyMXYtNWg1XCIvPicsXG4gICdmaWxlLXRleHQnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxM1wiIHkyPVwiMTNcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTdcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjhcIiB5MT1cIjlcIiB5Mj1cIjlcIi8+JyxcbiAgJ2ZpbGUtY29kZSc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxwYXRoIGQ9XCJtMTAgMTMtMiAyIDIgMlwiLz48cGF0aCBkPVwibTE0IDE3IDItMi0yLTJcIi8+JyxcbiAgaW1hZ2U6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCI5XCIgcj1cIjJcIi8+PHBhdGggZD1cIm0yMSAxNS0zLjA4Ni0zLjA4NmEyIDIgMCAwIDAtMi44MjggMEw2IDIxXCIvPicsXG4gIC8vIFN0eWxpc2VkIFwicGluY2hcIiDigJQgdHdvIG9wcG9zaW5nIGN1cnZlcyBtZWV0aW5nIGF0IGEgY2VudGVyIGRvdC5cbiAgcGluY2g6ICc8cGF0aCBkPVwiTTUgNWMzIDIgNSA0IDcgNy0yIDMtNCA1LTcgN1wiLz48cGF0aCBkPVwiTTE5IDVjLTMgMi01IDQtNyA3IDIgMyA0IDUgNyA3XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMS41XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICAnc3Rhci1maWxsZWQnOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgcGluOiAnPHBhdGggZD1cIk0xMiAxN3Y1XCIvPjxwYXRoIGQ9XCJNOSAxMC43NmEyIDIgMCAwIDEtMS4xMSAxLjc5bC0xLjc4LjlBMiAyIDAgMCAwIDUgMTUuMjRWMTZhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xdi0uNzZhMiAyIDAgMCAwLTEuMTEtMS43OWwtMS43OC0uOUEyIDIgMCAwIDEgMTUgMTAuNzZWN2ExIDEgMCAwIDEgMS0xIDIgMiAwIDAgMCAwLTRIOGEyIDIgMCAwIDAgMCA0IDEgMSAwIDAgMSAxIDF6XCIvPicsXG4gIHVuZG86ICc8cGF0aCBkPVwiTTMgN3Y2aDZcIi8+PHBhdGggZD1cIk0yMSAxN2E5IDkgMCAwIDAtMTUtNi43TDMgMTNcIi8+JyxcbiAgcmVkbzogJzxwYXRoIGQ9XCJNMjEgN3Y2aC02XCIvPjxwYXRoIGQ9XCJNMyAxN2E5IDkgMCAwIDEgMTUtNi43TDIxIDEzXCIvPicsXG4gIGZvbGRlcjogJzxwYXRoIGQ9XCJNMjAgMjBhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJoLTcuOTNhMiAyIDAgMCAxLTEuNjYtLjlsLS44Mi0xLjJBMiAyIDAgMCAwIDcuOTMgM0g0YTIgMiAwIDAgMC0yIDJ2MTNhMiAyIDAgMCAwIDIgMlpcIi8+JyxcbiAgY2hlY2s6ICc8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIi8+JyxcbiAgJ2NpcmNsZS1jaGVjayc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtOSAxMiAyIDIgNC00XCIvPicsXG4gIGdyaXA6ICc8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTlcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjE5XCIgcj1cIjFcIi8+JyxcbiAgLy8gQnJva2VuLWNoYWluIGljb24gZm9yIFwiZGV0YWNoIGNvbW1lbnQgZnJvbSBpdHMgY2FwdHVyZVwiLiBMdWNpZGUncyBgdW5saW5rYC5cbiAgdW5saW5rOiAnPHBhdGggZD1cIm0xOC44NCAxMi4yNSAxLjcyLTEuNzFoLS4wMmE1LjAwNCA1LjAwNCAwIDAgMC0uMTItNy4wNyA1LjAwNiA1LjAwNiAwIDAgMC02Ljk1IDBsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwibTUuMTcgMTEuNzUtMS43MSAxLjcxYTUuMDA0IDUuMDA0IDAgMCAwIC4xMiA3LjA3IDUuMDA2IDUuMDA2IDAgMCAwIDYuOTUgMGwxLjcxLTEuNzFcIi8+PGxpbmUgeDE9XCI4XCIgeDI9XCI4XCIgeTE9XCIyXCIgeTI9XCI1XCIvPjxsaW5lIHgxPVwiMlwiIHgyPVwiNVwiIHkxPVwiOFwiIHkyPVwiOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCIxNlwiIHkxPVwiMTlcIiB5Mj1cIjIyXCIvPjxsaW5lIHgxPVwiMTlcIiB4Mj1cIjIyXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgc2V0dGluZ3M6ICc8cGF0aCBkPVwiTTEyLjIyIDJoLS40NGEyIDIgMCAwIDAtMiAydi4xOGEyIDIgMCAwIDEtMSAxLjczbC0uNDMuMjVhMiAyIDAgMCAxLTIgMGwtLjE1LS4wOGEyIDIgMCAwIDAtMi43My43M2wtLjIyLjM4YTIgMiAwIDAgMCAuNzMgMi43M2wuMTUuMWEyIDIgMCAwIDEgMSAxLjcydi41MWEyIDIgMCAwIDEtMSAxLjc0bC0uMTUuMDlhMiAyIDAgMCAwLS43MyAyLjczbC4yMi4zOGEyIDIgMCAwIDAgMi43My43M2wuMTUtLjA4YTIgMiAwIDAgMSAyIDBsLjQzLjI1YTIgMiAwIDAgMSAxIDEuNzNWMjBhMiAyIDAgMCAwIDIgMmguNDRhMiAyIDAgMCAwIDItMnYtLjE4YTIgMiAwIDAgMSAxLTEuNzNsLjQzLS4yNWEyIDIgMCAwIDEgMiAwbC4xNS4wOGEyIDIgMCAwIDAgMi43My0uNzNsLjIyLS4zOWEyIDIgMCAwIDAtLjczLTIuNzNsLS4xNS0uMDhhMiAyIDAgMCAxLTEtMS43NHYtLjVhMiAyIDAgMCAxIDEtMS43NGwuMTUtLjA5YTIgMiAwIDAgMCAuNzMtMi43M2wtLjIyLS4zOGEyIDIgMCAwIDAtMi43My0uNzNsLS4xNS4wOGEyIDIgMCAwIDEtMiAwbC0uNDMtLjI1YTIgMiAwIDAgMS0xLTEuNzNWNGEyIDIgMCAwIDAtMi0yelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+JyxcbiAgaW5mbzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xMiAxNnYtNFwiLz48cGF0aCBkPVwiTTEyIDhoLjAxXCIvPicsXG4gIC8vIFRyZWUtb2Ytcm93cyDigJQgdXNlZCBmb3IgXCJTcGxpdCBncm91cFwiIGFjdGlvbiAoZGVub3RlcyBvbmUgbm9kZSBmYW5uaW5nXG4gIC8vIG91dCBpbnRvIHNpYmxpbmdzKS4gTHVjaWRlJ3MgYGxpc3QtdHJlZWAuXG4gICdsaXN0LXRyZWUnOiAnPHBhdGggZD1cIk0yMSAxMmgtOFwiLz48cGF0aCBkPVwiTTIxIDZIOFwiLz48cGF0aCBkPVwiTTIxIDE4aC04XCIvPjxwYXRoIGQ9XCJNMyA2djRjMCAxLjEuOSAyIDIgMmgzXCIvPjxwYXRoIGQ9XCJNMyAxMHY2YzAgMS4xLjkgMiAyIDJoM1wiLz4nLFxuICAvLyBHZW5lcmljIHNwbGl0IGljb24gYXMgYSBmYWxsYmFjayBvcHRpb24uXG4gIHNwbGl0OiAnPHBhdGggZD1cIk0xNiAzaDV2NVwiLz48cGF0aCBkPVwiTTggM0gzdjVcIi8+PHBhdGggZD1cIm0yMSAzLTcuNDYgNy40NmEyIDIgMCAwIDAgMCAyLjgzTDIxIDIxXCIvPjxwYXRoIGQ9XCJNMyAzbDcuNDYgNy40NmEyIDIgMCAwIDEgMCAyLjgzTDMgMjFcIi8+JyxcbiAgLy8gQ2FyZGJvYXJkLXN0eWxlIGJveCB1c2VkIGZvciBcIkV4cG9ydCB3b3Jrc3BhY2UgYXMgWklQXCIuXG4gIHBhY2thZ2U6ICc8cGF0aCBkPVwibTcuNSA0LjI3IDkgNS4xNVwiLz48cGF0aCBkPVwiTTIxIDhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2WlwiLz48cGF0aCBkPVwiTTMuMyA3IDEyIDEybDguNy01XCIvPjxwYXRoIGQ9XCJNMTIgMjJWMTJcIi8+JyxcbiAgLy8gVHdvIGludGVybG9ja2luZyBsaW5rcyDigJQgdXNlZCBmb3IgXCJDb3B5IGFzIHBhdGhcIi5cbiAgbGluazogJzxwYXRoIGQ9XCJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwiTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxXCIvPicsXG4gIC8vIERhdGFiYXNlL2R1Y2sgaWNvbiBmb3IgdGhlIER1Y2tEQiBwYWxldHRlIGNvbW1hbmQuXG4gIGRhdGFiYXNlOiAnPGVsbGlwc2UgY3g9XCIxMlwiIGN5PVwiNVwiIHJ4PVwiOVwiIHJ5PVwiM1wiLz48cGF0aCBkPVwiTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNVwiLz48cGF0aCBkPVwiTTMgMTJBOSAzIDAgMCAwIDIxIDEyXCIvPicsXG59O1xuXG5jb25zdCB3cmFwID0gKGJvZHk6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPiR7Ym9keX08L3N2Zz5gO1xuXG5leHBvcnQgY29uc3QgUEdfSUNPTlMgPSB7XG4gIGhhczogKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4gbmFtZSBpbiBJQ09OUyxcbiAgc3ZnU3RyaW5nOiAobmFtZTogc3RyaW5nLCBzaXplID0gMTYpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBJQ09OU1tuYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2x1Y2lkZV0gbWlzc2luZyBpY29uJywgbmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiB3cmFwKGJvZHksIHNpemUpO1xuICB9LFxuICBtb3VudDogKGVsOiBFbGVtZW50IHwgbnVsbCwgbmFtZTogc3RyaW5nLCBzaXplPzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKGVsKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gIH0sXG59O1xuXG4vLyBTaWRlLWVmZmVjdCBmb3IgbGVnYWN5IHNjcmlwdC10YWcgaW5jbHVzaW9uIChzaWRlcGFuZWwuaHRtbCBzdGlsbCA8c2NyaXB0XG4vLyBzcmM9XCJsdWNpZGUuanNcIj4g4oCUIHByZS1idW5kbGUpLiBSZS1leHBvc2VzIHRoZSByZWdpc3RyeSBvbiBnbG9iYWxUaGlzLlxuaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBHX0lDT05TID0gUEdfSUNPTlM7XG59XG4iLAogICAgIi8vIFBpbmNoR3JhYiBjb250ZW50IHNjcmlwdCDigJQgQWx0K0NsaWNrIGNhcHR1cmUsIEFsdCtkcmFnIHJ1YmJlci1iYW5kLFxuLy8gZ29sZC1zdGFnaW5nIG11bHRpLXNlbGVjdCwgb24tcGFnZSBjb21tZW50IG92ZXJsYXkuIExvYWRlZCBvbiBldmVyeSBwYWdlO1xuLy8gY29tbXVuaWNhdGVzIHdpdGggdGhlIHNpZGUgcGFuZWwgdmlhIGNocm9tZS5ydW50aW1lIG1lc3NhZ2VzIChhbmQgYVxuLy8gQ3VzdG9tRXZlbnQgZmFsbGJhY2sgaW4gc3RhbmRhbG9uZSB0ZXN0L1BsYXl3cmlnaHQgbW9kZSkuXG4vL1xuLy8gRGVjb21wb3NlZCBpbnRvOlxuLy8gICDigKIgZG9tLnRzICAgICDigJQgcHVyZSBoZWxwZXJzIChjc3NQYXRoLCBjYXB0dXJlRW50cnksIGVsZW1lbnRzSW5SZWN0KVxuLy8gICDigKIgdHlwZXMudHMgICDigJQgc2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgdGhpcyBmaWxlICDigJQgb3ZlcmxheSwgaG92ZXIgc3RhdGUgbWFjaGluZSwgZHJhZywgSVBDIHBsdW1iaW5nXG4vL1xuLy8gUmUtZW50cnkgZ3VhcmQ6IGlmIGEgcHJldmlvdXMgaW5zdGFuY2UgYWxyZWFkeSByYW4gaW4gdGhpcyBwYWdlIChlLmcuXG4vLyBzZXJ2aWNlLXdvcmtlciByZS1pbmplY3Rpb24gb24gdGFiIGFjdGl2YXRpb24pLCByZXVzZSBpdC5cblxuaW1wb3J0IHtcbiAgY2FwdHVyZUVudHJ5LFxuICBidWlsZFBhZ2VDb250ZXh0LFxuICBjc3NQYXRoLFxuICBjb21wYWN0VGFyZ2V0LFxuICBlbGVtZW50c0luUmVjdCxcbiAgcGlja0RyYWdDYW5kaWRhdGVzLFxuICBzbmFwVG9Db21wb25lbnQsXG4gIG5vdGVUYWJQcmVzc2VkLFxuICBzZXRNdXRhdGlvbkJ1ZmZlckdldHRlcixcbn0gZnJvbSAnLi9kb20udHMnO1xuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCxcbiAgQ3NUb1BhbmVsLFxuICBEb21NdXRhdGlvbixcbiAgRW50cnksXG4gIFBhZ2VTbmFwc2hvdCxcbiAgUGFnZVNuYXBzaG90UmVwbHksXG4gIFBhbmVsVG9DcyxcbiAgUGdFbnZlbG9wZSxcbn0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge3BnfSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7UEdfSUNPTlN9IGZyb20gJy4vbHVjaWRlLnRzJztcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBfX3BpbmNoZ3JhYkNvbnRlbnQ/OiBQaW5jaGdyYWJBcGk7XG4gICAgX19waW5jaGdyYWI/OiBQaW5jaGdyYWJBcGk7XG4gIH1cbn1cblxudHlwZSBQaW5jaGdyYWJBcGkgPSB7XG4gIGNhcHR1cmVFbnRyeTogdHlwZW9mIGNhcHR1cmVFbnRyeTtcbiAgYnVpbGRQYWdlQ29udGV4dDogdHlwZW9mIGJ1aWxkUGFnZUNvbnRleHQ7XG4gIGNhcHR1cmVzOiBBcnJheTx7ZW50cnk6IEVudHJ5OyBwYWdlOiBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZFBhZ2VDb250ZXh0PjsgZ3JvdXBlZD86IGJvb2xlYW59PiB8IG51bGw7XG4gIGZsYXNoRWxlbWVudDogKHNlbDogc3RyaW5nKSA9PiB2b2lkO1xuICBzZXRBbHQ6IChvbjogYm9vbGVhbikgPT4gdm9pZDtcbiAgbmV4dFNlcTogKCkgPT4gbnVtYmVyO1xuICBoYW5kbGVDb21tYW5kOiAobXNnOiBQZ0VudmVsb3BlPFBhbmVsVG9Dcz4sIHJlc3BvbmQ6IChyOiBhbnkpID0+IHZvaWQpID0+IGJvb2xlYW47XG4gIGRlc3Ryb3k6ICgpID0+IHZvaWQ7XG59O1xuXG5jb25zdCBMT0cgPSAnW1BpbmNoR3JhYi9jc10nO1xuY29uc3QgS0VZID0gJ19fcGluY2hncmFiQ29udGVudCc7XG5cbmlmICh3aW5kb3dbS0VZXSkge1xuICBjb25zb2xlLmxvZyhMT0csICdhbHJlYWR5IGluaXRpYWxpemVkOyByZXVzaW5nLicpO1xufSBlbHNlIHtcbiAgaW5pdCgpO1xufVxuXG5mdW5jdGlvbiBpbml0KCk6IHZvaWQge1xuICAvLyBDcm9zcy13b3JsZCB0YWtlb3ZlcjogYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwcmV2aW91cyBjb250ZW50XG4gIC8vIHNjcmlwdCBpbiBhICpkaWZmZXJlbnQgaXNvbGF0ZWQgd29ybGQqLCB3aGVyZSBvdXIgd2luZG93W0tFWV0gZ3VhcmRcbiAgLy8gY2FuJ3Qgc2VlIGl0IOKAlCBidXQgaXRzIERPTSBvdmVybGF5IGFuZCBjYXB0dXJlIGxpc3RlbmVycyBwZXJzaXN0IHdpdGggYVxuICAvLyBkZWFkIGNocm9tZS5ydW50aW1lIChcIkFsdCBzdG9wcyB3b3JraW5nXCIpLiBQbGFpbiBET00gZXZlbnRzIERPIGNyb3NzXG4gIC8vIGlzb2xhdGVkIHdvcmxkczogZmlyZSB0aGUgdGFrZW92ZXIgc2lnbmFsIHNvIGFueSBwcmVkZWNlc3NvciB0ZWFyc1xuICAvLyBpdHNlbGYgZG93biwgc3dlZXAgaXRzIHN0YWxlIG92ZXJsYXksIGFuZCByZWdpc3RlciB0aGUgc2FtZSBsaXN0ZW5lclxuICAvLyBmb3Igb3VyIG93biBzdWNjZXNzb3IuXG4gIHRyeSB7IGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdfX3BpbmNoZ3JhYi10YWtlb3ZlcicpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdfX3BpbmNoZ3JhYl9vdmVybGF5Jyk/LnJlbW92ZSgpO1xuXG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuICBjb25zdCB0ZXN0Q2FwdHVyZXMgPSBpbkV4dGVuc2lvbiA/IG51bGwgOiAoW10gYXMgQXJyYXk8e2VudHJ5OiBFbnRyeTsgcGFnZTogUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRQYWdlQ29udGV4dD47IGdyb3VwZWQ/OiBib29sZWFufT4pO1xuXG4gIC8vIE9ycGhhbiBzZWxmLWRldGVjdGlvbjogYWZ0ZXIgYW4gZXh0ZW5zaW9uIHJlbG9hZCwgY2hyb21lLnJ1bnRpbWUuaWQgaW5cbiAgLy8gdGhlIG9sZCB3b3JsZCBnb2VzIHVuZGVmaW5lZCAob3IgdGhyb3dzKS4gSG90IGhhbmRsZXJzIHNob3J0LWNpcmN1aXRcbiAgLy8gdGhyb3VnaCB0aGlzIGd1YXJkIGFuZCB0ZWFyIHRoZSBvcnBoYW4gZG93biBpbnN0ZWFkIG9mIHNpbGVudGx5IGVhdGluZ1xuICAvLyBBbHQgZ2VzdHVyZXMgZm9yZXZlci5cbiAgbGV0IGRlc3Ryb3llZCA9IGZhbHNlO1xuICBjb25zdCBjb250ZXh0QWxpdmUgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIHRydWU7XG4gICAgdHJ5IHsgcmV0dXJuIEJvb2xlYW4oY2hyb21lLnJ1bnRpbWU/LmlkKTsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9O1xuICBjb25zdCBvcnBoYW5HdWFyZCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBpZiAoZGVzdHJveWVkKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGNvbnRleHRBbGl2ZSgpKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnZXh0ZW5zaW9uIGNvbnRleHQgaW52YWxpZGF0ZWQg4oCUIHRlYXJpbmcgZG93biBvcnBoYW5lZCBjb250ZW50IHNjcmlwdCcpO1xuICAgIHRyeSB7IHdpbmRvd1tLRVldPy5kZXN0cm95KCk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgT3ZlcmxheSBzaGFkb3cgaG9zdCAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gU3RyaWN0LUNTUCBwYWdlcyAoR2l0SHViLCBiYW5rcykgcmVqZWN0IGlubGluZSA8c3R5bGU+IHRhZ3MgQU5EXG4gIC8vIGFkb3B0ZWRTdHlsZVNoZWV0cyDigJQgYm90aCBhcmUgZ2F0ZWQgYnkgdGhlIHBhZ2UncyBgc3R5bGUtc3JjYC4gQnJvd3NlcnNcbiAgLy8gZG8gYWxsb3cgaW5saW5lLXN0eWxlIG11dGF0aW9ucyB0aHJvdWdoIHRoZSBKUyBgSFRNTEVsZW1lbnQuc3R5bGVgIEFQSSxcbiAgLy8gc28gd2UgYXBwbHkgZXZlcnkgb3ZlcmxheSBzdHlsZSB0aGF0IHdheSAoc2VlIGFwcGx5U3R5bGVzIGJlbG93KS5cbiAgY29uc3Qgb3ZlcmxheUhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgb3ZlcmxheUhvc3QuaWQgPSAnX19waW5jaGdyYWJfb3ZlcmxheSc7XG4gIE9iamVjdC5hc3NpZ24ob3ZlcmxheUhvc3Quc3R5bGUsIHtcbiAgICBhbGw6ICdpbml0aWFsJywgcG9zaXRpb246ICdmaXhlZCcsIHRvcDogJzAnLCBsZWZ0OiAnMCcsIHJpZ2h0OiAnMCcsIGJvdHRvbTogJzAnLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJywgekluZGV4OiAnMjE0NzQ4MzY0NicsXG4gIH0pO1xuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQob3ZlcmxheUhvc3QpO1xuICBjb25zdCBzaGFkb3cgPSBvdmVybGF5SG9zdC5hdHRhY2hTaGFkb3coe21vZGU6ICdvcGVuJ30pO1xuXG4gIC8vIOKUgOKUgOKUgCBUb3AtbGF5ZXIgcHJvbW90aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBBIG1heCB6LWluZGV4IGhvc3Qgc3RpbGwgbG9zZXMgdG8gdGhlIGJyb3dzZXIgdG9wIGxheWVyXG4gIC8vICg8ZGlhbG9nPi5zaG93TW9kYWwoKSwgcGFnZSBwb3BvdmVycykgYW5kIGNhbiBiZSB0cmFwcGVkIGJ5IHN0YWNraW5nXG4gIC8vIGNvbnRleHRzLiBUaGUgUG9wb3ZlciBBUEkgcHV0cyB0aGUgaG9zdCBpbiB0aGUgdG9wIGxheWVyIGl0c2VsZjtcbiAgLy8gcG9wb3Zlcj1cIm1hbnVhbFwiIG9wdHMgb3V0IG9mIEVTQy9saWdodC1kaXNtaXNzLiBVQSBbcG9wb3Zlcl0gc3R5bGVzXG4gIC8vIChhdXRvIG1hcmdpbnMsIGJvcmRlciwgZml0LWNvbnRlbnQgc2l6aW5nLCBkaXNwbGF5Om5vbmUtd2hlbi1jbG9zZWQpXG4gIC8vIGFyZSBuZXV0cmFsaXplZCBpbmxpbmUgYmVjYXVzZSBwYWdlIENTUCBjYW4gYmxvY2sgc3R5bGVzaGVldHMuIE9uIGFueVxuICAvLyBmYWlsdXJlIHRoZSBwb3BvdmVyIGF0dHJpYnV0ZSBpcyByZW1vdmVkIHNvIHRoZSBwbGFpbiBtYXgteiBmYWxsYmFja1xuICAvLyBrZWVwcyBwYWludGluZy5cbiAgY29uc3QgcHJvbW90ZVRvVG9wTGF5ZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCEoJ3Nob3dQb3BvdmVyJyBpbiBvdmVybGF5SG9zdCkpIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgb3ZlcmxheUhvc3Quc2V0QXR0cmlidXRlKCdwb3BvdmVyJywgJ21hbnVhbCcpO1xuICAgICAgT2JqZWN0LmFzc2lnbihvdmVybGF5SG9zdC5zdHlsZSwge1xuICAgICAgICBtYXJnaW46ICcwJywgYm9yZGVyOiAnMCcsIHBhZGRpbmc6ICcwJyxcbiAgICAgICAgd2lkdGg6ICdhdXRvJywgaGVpZ2h0OiAnYXV0bycsXG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsIG92ZXJmbG93OiAndmlzaWJsZScsIGNvbG9yOiAnaW5oZXJpdCcsXG4gICAgICB9KTtcbiAgICAgIGlmICghb3ZlcmxheUhvc3QubWF0Y2hlcygnOnBvcG92ZXItb3BlbicpKSBvdmVybGF5SG9zdC5zaG93UG9wb3ZlcigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICd0b3AtbGF5ZXIgcHJvbW90aW9uIGZhaWxlZCDigJQgbWF4IHotaW5kZXggZmFsbGJhY2snLCBlKTtcbiAgICAgIHRyeSB7IG92ZXJsYXlIb3N0LnJlbW92ZUF0dHJpYnV0ZSgncG9wb3ZlcicpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gIH07XG4gIC8vIFRvcC1sYXllciBzdGFja2luZyBpcyBpbnNlcnRpb24tb3JkZXJlZDogYSBoaWRlK3Nob3cgY3ljbGUgcmUtc3RhY2tzIHRoZVxuICAvLyBvdmVybGF5IGFib3ZlIGFueSBkaWFsb2cvcG9wb3ZlciB0aGUgcGFnZSBvcGVuZWQgYWZ0ZXIgdXMuIENhbGxlZCB3aGVuIGFcbiAgLy8gbmV3IHJpbmcgb3IgdGhlIGNvbW1lbnQgYm94IGFwcGVhcnMg4oCUIG5vdCBwZXIgZnJhbWUuXG4gIGNvbnN0IGJyaW5nVG9Gcm9udCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoISgnc2hvd1BvcG92ZXInIGluIG92ZXJsYXlIb3N0KSkgcmV0dXJuO1xuICAgIGlmIChvdmVybGF5SG9zdC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHJldHVybjsgLy8gbWlkLWNhcHR1cmU7IHN0YXkgaGlkZGVuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChvdmVybGF5SG9zdC5tYXRjaGVzKCc6cG9wb3Zlci1vcGVuJykpIG92ZXJsYXlIb3N0LmhpZGVQb3BvdmVyKCk7XG4gICAgICBvdmVybGF5SG9zdC5zaG93UG9wb3ZlcigpO1xuICAgIH0gY2F0Y2ggeyBwcm9tb3RlVG9Ub3BMYXllcigpOyB9XG4gIH07XG4gIHByb21vdGVUb1RvcExheWVyKCk7XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZSBTVkc6IGNvbm5lY3RvcnMgZnJvbSB0aGUgc2lkZS1wYW5lbCBlZGdlIG9mIHRoZSB2aWV3cG9ydCB0b1xuICAvLyBlYWNoIHJpbmdlZCBlbGVtZW50LiBUaGUgcGFnZSBjYW4ndCBzZWUgdGhlIHNpZGUtcGFuZWwgaXRzZWxmIChzZXBhcmF0ZVxuICAvLyBmcmFtZSksIGJ1dCBDaHJvbWUgcHV0cyB0aGUgc2lkZS1wYW5lbCBhZGphY2VudCB0byB0aGUgcGFnZSdzIHJpZ2h0XG4gIC8vIGVkZ2UsIHNvIGEgY3VydmUgZnJvbSAoaW5uZXJXaWR0aCwgbWlkWSkgaXMgdGhlIHZpc3VhbCBzdGFuZC1pbiBmb3JcbiAgLy8gXCJmcm9tIHRoZSBzaWRlLXBhbmVsXCIuIE9uZSBjb250YWluZXIsIG9uZSBwYXRoIHBlciByaW5nIHNsb3QuXG4gIGNvbnN0IG5vb2RsZVN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gIE9iamVjdC5hc3NpZ24obm9vZGxlU3ZnLnN0eWxlLCB7XG4gICAgcG9zaXRpb246ICdmaXhlZCcsIHRvcDogJzAnLCBsZWZ0OiAnMCcsXG4gICAgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIHpJbmRleDogJzInLFxuICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBSaW5nIHBvb2w6IHRyYWNrcyBlbGVtZW50cyB3aXRoIHJBRi1wb3NpdGlvbmVkIG91dGxpbmUgcmluZ3Mg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgU2xvdCA9IHtlbDogSFRNTERpdkVsZW1lbnQ7IGxhYmVsOiBIVE1MRGl2RWxlbWVudDsgcGF0aDogU1ZHUGF0aEVsZW1lbnQ7IHJhZjogbnVtYmVyOyB0YXJnZXQ6IEVsZW1lbnQgfCBudWxsfTtcbiAgY29uc3QgcmluZ3MgPSBuZXcgTWFwPHN0cmluZywgU2xvdD4oKTtcbiAgY29uc3QgUklOR19CQVNFOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYm9yZGVyOiAnMnB4IHNvbGlkICNmZjVmMDAnLFxuICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgM3B4IHJnYmEoMjU1LDk1LDAsLjE4KSwgMCAwIDE2cHggcmdiYSgyNTUsOTUsMCwuNCknLFxuICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4wOHMgbGluZWFyJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICB6SW5kZXg6ICcxJyxcbiAgfTtcbiAgY29uc3QgUklOR19HT0xEOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIGJvcmRlckNvbG9yOiAnI2ZmZDE2NicsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgM3B4IHJnYmEoMjU1LDIwOSwxMDIsLjIyKSwgMCAwIDE4cHggcmdiYSgyNTUsMjA5LDEwMiwuNDUpJyxcbiAgfTtcbiAgLy8gTGl2ZSBkcmFnIHByZXZpZXc6IGJyaWdodCBsaW1lLCB0aGlja2VyIGJvcmRlciwgbW9yZSB2aXNpYmxlIGhhbG8gc29cbiAgLy8gdGhlIHVzZXIgY2FuIGNsZWFybHkgc2VlIHdoYXQgdGhlIHJ1YmJlciBiYW5kIHdpbGwgY29tbWl0IG9uIHJlbGVhc2UuXG4gIGNvbnN0IFJJTkdfUFJFVklFVzogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiA9IHtcbiAgICBib3JkZXJDb2xvcjogJyM3YmQ5N2EnLFxuICAgIGJvcmRlcldpZHRoOiAnM3B4JyxcbiAgICBib3hTaGFkb3c6ICcwIDAgMCAzcHggcmdiYSgxMjMsMjE3LDEyMiwuMzIpLCAwIDAgMjJweCByZ2JhKDEyMywyMTcsMTIyLC41NSknLFxuICB9O1xuICBjb25zdCBMQUJFTF9CQVNFOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDk1LDAsLjY1KScsIGNvbG9yOiAnI2ZmZicsXG4gICAgZm9udDogXCI2MDAgMTFweC8xLjIgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgcGFkZGluZzogJzNweCA2cHgnLCBib3JkZXJSYWRpdXM6ICczcHgnLFxuICAgIHdpZHRoOiAnMjIwcHgnLCBoZWlnaHQ6ICcxNnB4JyxcbiAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJywgb3ZlcmZsb3c6ICdoaWRkZW4nLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgdGV4dFNoYWRvdzogJzAgMXB4IDJweCByZ2JhKDAsMCwwLC40NSknLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIGRpc3BsYXk6ICdub25lJyxcbiAgfTtcbiAgY29uc3QgZW5zdXJlUmluZyA9IChrZXk6IHN0cmluZyk6IFNsb3QgPT4ge1xuICAgIGxldCBzbG90ID0gcmluZ3MuZ2V0KGtleSk7XG4gICAgaWYgKHNsb3QpIHJldHVybiBzbG90O1xuICAgIC8vIENsYXNzZXMgYXJlIGtlcHQgcHVyZWx5IGFzIGlkZW50aWZpZXJzIChxdWVyeVNlbGVjdG9yIHRlc3QgaG9va3MpO1xuICAgIC8vIHZpc3VhbCBzdHlsaW5nIGlzIGlubGluZSBiZWNhdXNlIHBhZ2UgQ1NQIGNhbiBibG9jayBzdHlsZXNoZWV0cy5cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmNsYXNzTmFtZSA9ICdyaW5nJztcbiAgICBPYmplY3QuYXNzaWduKGVsLnN0eWxlLCBSSU5HX0JBU0UpO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGFiZWwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICBPYmplY3QuYXNzaWduKGxhYmVsLnN0eWxlLCBMQUJFTF9CQVNFKTtcbiAgICAvLyBOb29kbGUgcGF0aCBjb25uZWN0aW5nIChpbm5lcldpZHRoLCBtaWRZKSDihpIgZWxlbWVudCBjZW50ZXIuXG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzIuNScpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UtbGluZWNhcCcsICdyb3VuZCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgJzAuNScpO1xuICAgIGlmICghbm9vZGxlU3ZnLmlzQ29ubmVjdGVkKSBzaGFkb3cuYXBwZW5kKG5vb2RsZVN2Zyk7XG4gICAgbm9vZGxlU3ZnLmFwcGVuZChwYXRoKTtcbiAgICBzaGFkb3cuYXBwZW5kKGVsLCBsYWJlbCk7XG4gICAgc2xvdCA9IHtlbCwgbGFiZWwsIHBhdGgsIHJhZjogMCwgdGFyZ2V0OiBudWxsfTtcbiAgICByaW5ncy5zZXQoa2V5LCBzbG90KTtcbiAgICByZXR1cm4gc2xvdDtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlUmluZyA9IChrZXk6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNsb3QgPSByaW5ncy5nZXQoa2V5KTtcbiAgICBpZiAoIXNsb3QpIHJldHVybjtcbiAgICBpZiAoc2xvdC5yYWYpIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHNsb3QucmFmKTtcbiAgICBzbG90LmVsLnJlbW92ZSgpO1xuICAgIHNsb3QubGFiZWwucmVtb3ZlKCk7XG4gICAgc2xvdC5wYXRoLnJlbW92ZSgpO1xuICAgIHJpbmdzLmRlbGV0ZShrZXkpO1xuICAgIHJpbmdUcmFja09wdHMuZGVsZXRlKGtleSk7XG4gIH07XG4gIGNvbnN0IGNsZWFyUmluZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBrIG9mIFsuLi5yaW5ncy5rZXlzKCldKSByZW1vdmVSaW5nKGspO1xuICAgIG5vb2RsZVN2Zy5yZW1vdmUoKTtcbiAgfTtcbiAgdHlwZSBSaW5nT3B0cyA9IHtnb2xkPzogYm9vbGVhbjsgZGFzaGVkPzogYm9vbGVhbjsgcHJldmlldz86IGJvb2xlYW47IGxhYmVsPzogc3RyaW5nfTtcbiAgY29uc3QgcG9zaXRpb25SaW5nID0gKHNsb3Q6IFNsb3QsIHRhcmdldDogRWxlbWVudCwgb3B0czogUmluZ09wdHMpOiB2b2lkID0+IHtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJpbmdTdHlsZSA9IHNsb3QuZWwuc3R5bGU7XG4gICAgcmluZ1N0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCgwLCByLmxlZnQgLSAzKX1weGA7XG4gICAgcmluZ1N0eWxlLnRvcCA9IGAke01hdGgubWF4KDAsIHIudG9wIC0gMyl9cHhgO1xuICAgIHJpbmdTdHlsZS53aWR0aCA9IGAke01hdGgubWF4KDAsIHIud2lkdGggKyA2KX1weGA7XG4gICAgcmluZ1N0eWxlLmhlaWdodCA9IGAke01hdGgubWF4KDAsIHIuaGVpZ2h0ICsgNil9cHhgO1xuICAgIHJpbmdTdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBpZiAob3B0cy5wcmV2aWV3KSB7XG4gICAgICBPYmplY3QuYXNzaWduKHJpbmdTdHlsZSwgUklOR19QUkVWSUVXKTtcbiAgICB9IGVsc2UgaWYgKG9wdHMuZ29sZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbihyaW5nU3R5bGUsIFJJTkdfR09MRCk7XG4gICAgICByaW5nU3R5bGUuYm9yZGVyV2lkdGggPSAnMnB4JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmluZ1N0eWxlLmJvcmRlckNvbG9yID0gJyNmZjVmMDAnO1xuICAgICAgcmluZ1N0eWxlLmJveFNoYWRvdyA9IFJJTkdfQkFTRS5ib3hTaGFkb3chO1xuICAgICAgcmluZ1N0eWxlLmJvcmRlcldpZHRoID0gJzJweCc7XG4gICAgfVxuICAgIHJpbmdTdHlsZS5ib3JkZXJTdHlsZSA9IG9wdHMuZGFzaGVkID8gJ2Rhc2hlZCcgOiAnc29saWQnO1xuICAgIC8vIE5vIGZsb2F0aW5nIGxhYmVsIGFib3ZlIHRoZSBoaWdobGlnaHRlZCBlbGVtZW50IOKAlCB0aGUgb24tcGFnZSBjb21tZW50XG4gICAgLy8gYm94IChhbm5vdGF0aW9uIG92ZXJsYXkpIGFscmVhZHkgc2hvd3MgZXZlcnl0aGluZyB0aGUgdXNlciBuZWVkcyBhbmRcbiAgICAvLyB0aGUgZmxvYXRpbmcgbGFiZWwgd2FzIGp1c3QgdmlzdWFsIG5vaXNlIGFib3ZlIHRoZSByaW5nIGJvcmRlci5cbiAgICBzbG90LmxhYmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAvLyBQYWdlLXNpZGUgbm9vZGxlOiBhIHNpbmdsZSBjdXJ2ZSBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBwYWdlXG4gICAgLy8gKHdoZXJlIHRoZSBzaWRlIHBhbmVsIHNpdHMpIHRvIHRoZSBDTE9TRVNUIFBPSU5UIG9uIHRoZSByaW5nIHJlY3QuXG4gICAgLy8gV2UgZG9uJ3QgdHJ5IHRvIGFsaWduIHdpdGggYSBwYW5lbC1zaWRlIGNvbXBhbmlvbiBjdXJ2ZSBhbnltb3JlIOKAlFxuICAgIC8vIHRoYXQgbmVlZGVkIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaCBicm9rZSB1bmRlciBEZXZUb29scyBkb2NrIC9cbiAgICAvLyBicm93c2VyIHpvb20uIFRoaXMgaGFsZiBzdGFuZHMgYWxvbmU6IHRoZSB2aXN1YWwgaXMgXCJhbiBhcnJvdyBmcm9tXG4gICAgLy8gdGhlIHBhbmVsIHNpZGUsIHBvaW50aW5nIGF0IHRoZSBjYXB0dXJlZCBlbGVtZW50XCIgYW5kIHdvcmtzIGF0XG4gICAgLy8gYW55IHZpZXdwb3J0LlxuICAgIGNvbnN0IHJpbmdQYWQgPSAzO1xuICAgIGNvbnN0IHJpbmdMID0gci5sZWZ0IC0gcmluZ1BhZDtcbiAgICBjb25zdCByaW5nUiA9IHIucmlnaHQgKyByaW5nUGFkO1xuICAgIGNvbnN0IHJpbmdUID0gci50b3AgLSByaW5nUGFkO1xuICAgIGNvbnN0IHJpbmdCID0gci5ib3R0b20gKyByaW5nUGFkO1xuICAgIGNvbnN0IG94ID0gd2luZG93LmlubmVyV2lkdGg7ICAgICAgICAgIC8vIG9yaWdpbiB4IChwYWdlIHJpZ2h0IGVkZ2UpXG4gICAgY29uc3Qgb3kgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyOyAgICAgLy8gb3JpZ2luIHkgKHBhZ2UgbWlkWSlcbiAgICAvLyBDbG9zZXN0LXBvaW50IHByb2plY3Rpb246IGNsYW1wIG9yaWdpbiBvbnRvIHRoZSByaW5nIHJlY3QuXG4gICAgY29uc3QgZXggPSBNYXRoLm1heChyaW5nTCwgTWF0aC5taW4ob3gsIHJpbmdSKSk7XG4gICAgY29uc3QgZXkgPSBNYXRoLm1heChyaW5nVCwgTWF0aC5taW4ob3ksIHJpbmdCKSk7XG4gICAgaWYgKE1hdGguaHlwb3QoZXggLSBveCwgZXkgLSBveSkgPCAyNCkge1xuICAgICAgLy8gRWxlbWVudCBpcyBlc3NlbnRpYWxseSBhdCB0aGUgcGFuZWwtc2lkZSBlZGdlIOKAlCBkcmF3aW5nIGEgMjRweFxuICAgICAgLy8gY3VydmUgdGhlcmUgbG9va3MgbGlrZSBhIHNtdWRnZS4gU2tpcC5cbiAgICAgIHNsb3QucGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJlemllcjogZmlyc3QgbG9iZSBwdWxsZWQgbGVmdCBmcm9tIHRoZSBvcmlnaW4sIHNlY29uZCBsb2JlXG4gICAgICAvLyBwdWxsZWQgb3V0d2FyZCBmcm9tIHRoZSByaW5nIG9uIHRoZSBzaWRlIGZhY2luZyB0aGUgb3JpZ2luIHNvXG4gICAgICAvLyB0aGUgY3VydmUgYXBwcm9hY2hlcyB0aGUgYm91bmRhcnkgcGVycGVuZGljdWxhci1pc2guXG4gICAgICBjb25zdCBjMXggPSBveCAtIDgwLCBjMXkgPSBveTtcbiAgICAgIGNvbnN0IGFwcHJvYWNoRHggPSBveCA+IHJpbmdSID8gNjAgOiBveCA8IHJpbmdMID8gLTYwIDogMDtcbiAgICAgIGNvbnN0IGMyeCA9IGV4ICsgYXBwcm9hY2hEeCwgYzJ5ID0gZXk7XG4gICAgICBzbG90LnBhdGguc2V0QXR0cmlidXRlKCdkJywgYE0gJHtveH0gJHtveX0gQyAke2MxeH0gJHtjMXl9LCAke2MyeH0gJHtjMnl9LCAke2V4fSAke2V5fWApO1xuICAgIH1cbiAgICAvLyBTdHJva2UgbWF0Y2hlcyByaW5nIHRpZXIgc28gYSBnbGFuY2UgYXQgdGhlIHBhZ2UgdGVsbHMgdGhlIHVzZXJcbiAgICAvLyB3aGljaCBjYXB0dXJlIHRoaXMgY3VydmUgcG9pbnRzIHRvLlxuICAgIGNvbnN0IHN0cm9rZSA9IG9wdHMucHJldmlldyA/ICcjN2JkOTdhJyA6IG9wdHMuZ29sZCA/ICcjZmZkMTY2JyA6ICcjZmY1ZjAwJztcbiAgICBzbG90LnBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UnLCBzdHJva2UpO1xuICB9O1xuICAvLyBPdmVybGF5LWZyZWV6ZSBmbGFnLiBEdXJpbmcgYSBzY3JlZW5zaG90IHRoZSBiYWNrZ3JvdW5kIHRlbGxzIHVzIHRvXG4gIC8vIGhpZGUtb3ZlcmxheXM7IHdoaWxlIGhpZGRlbiB3ZSBhbHNvIEZSRUVaRSBldmVyeSByaW5nJ3MgckFGIHJlcG9zaXRpb25cbiAgLy8gbG9vcC4gV2l0aG91dCB0aGlzIHRoZSBsb29wcyBrZWVwIGZpcmluZyB0aHJvdWdoIHRoZSBjYXB0dXJlIGN5Y2xlIOKAlFxuICAvLyB0aGV5IHJlcG9zaXRpb24gcmluZ3MgdG8gdGhlIHBvc3Qtc2Nyb2xsIG9mZnNldCAoYSB2aXNpYmxlIGp1bXApIGFuZFxuICAvLyByZXBhaW50IGEgYnVyc3QgdGhlIGluc3RhbnQgdGhlIGhvc3QgaXMgc2hvd24gYWdhaW4sIHdoaWNoIGlzIHRoZVxuICAvLyBmbGFzaGluZyB0aGUgdXNlciBzYXcgb24gZ3JvdXBlZCBjYXB0dXJlcyAobW9yZSByaW5ncyA9IG1vcmUgZmxpY2tlcikuXG4gIC8vIEZyb3plbiwgdGhlIHJpbmdzIGhvbGQgdGhlaXIgbGFzdCBmcmFtZSBhbmQgdGhlIGhvc3QgaXMgZGlzcGxheTpub25lLFxuICAvLyBzbyB0aGVyZSBpcyBub3RoaW5nIHRvIHJlcGFpbnQgdW50aWwgd2UgdGhhdy4gKFNlZSBoaWRlL3Nob3ctb3ZlcmxheXMuKVxuICBsZXQgb3ZlcmxheUZyb3plbiA9IGZhbHNlO1xuICAvLyBSZW1lbWJlciBlYWNoIHRyYWNrZWQgcmluZydzIG9wdHMgc28gdGhhdygpIGNhbiByZS1hcm0gaXRzIGxvb3AuXG4gIGNvbnN0IHJpbmdUcmFja09wdHMgPSBuZXcgTWFwPHN0cmluZywge2VsOiBFbGVtZW50OyBvcHRzOiBSaW5nT3B0c30+KCk7XG4gIGNvbnN0IGFybVJpbmdMb29wID0gKGtleTogc3RyaW5nLCBlbDogRWxlbWVudCwgb3B0czogUmluZ09wdHMpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzbG90ID0gcmluZ3MuZ2V0KGtleSk7XG4gICAgaWYgKCFzbG90KSByZXR1cm47XG4gICAgaWYgKHNsb3QucmFmKSBjYW5jZWxBbmltYXRpb25GcmFtZShzbG90LnJhZik7XG4gICAgY29uc3QgdGljayA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghZWwuaXNDb25uZWN0ZWQpIHsgcmVtb3ZlUmluZyhrZXkpOyByaW5nVHJhY2tPcHRzLmRlbGV0ZShrZXkpOyByZXR1cm47IH1cbiAgICAgIGlmIChvdmVybGF5RnJvemVuKSB7IHNsb3QucmFmID0gMDsgcmV0dXJuOyB9IC8vIGhvbGQgbGFzdCBmcmFtZTsgdGhhdygpIHJlLWFybXNcbiAgICAgIHBvc2l0aW9uUmluZyhzbG90LCBlbCwgb3B0cyk7XG4gICAgICBzbG90LnJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuICAgIHRpY2soKTtcbiAgfTtcbiAgY29uc3QgdHJhY2tFbGVtZW50ID0gKGtleTogc3RyaW5nLCBlbDogRWxlbWVudCwgb3B0czogUmluZ09wdHMgPSB7fSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNsb3QgPSBlbnN1cmVSaW5nKGtleSk7XG4gICAgc2xvdC50YXJnZXQgPSBlbDtcbiAgICByaW5nVHJhY2tPcHRzLnNldChrZXksIHtlbCwgb3B0c30pO1xuICAgIGFybVJpbmdMb29wKGtleSwgZWwsIG9wdHMpO1xuICAgIC8vIEEgZnJlc2ggcmluZyBpcyBhIGdvb2QgbW9tZW50IHRvIHJlLXN0YWNrIGFib3ZlIGFueSBkaWFsb2cvcG9wb3ZlclxuICAgIC8vIHRoZSBwYWdlIG9wZW5lZCBzaW5jZSB3ZSBsYXN0IHBhaW50ZWQuXG4gICAgYnJpbmdUb0Zyb250KCk7XG4gIH07XG4gIC8vIFN0b3AgZXZlcnkgcmluZydzIHJBRiBsb29wIGluIHBsYWNlICh1c2VkIGR1cmluZyBzY3JlZW5zaG90IGNhcHR1cmUpLlxuICAvLyBUaGUgc2xvdCBrZWVwcyBpdHMgY3VycmVudCBnZW9tZXRyeTsgdGhhd1JpbmdzIHJlLWFybXMgdGhlIGxvb3BzLlxuICBjb25zdCBmcmVlemVSaW5ncyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IHNsb3Qgb2YgcmluZ3MudmFsdWVzKCkpIHtcbiAgICAgIGlmIChzbG90LnJhZikgeyBjYW5jZWxBbmltYXRpb25GcmFtZShzbG90LnJhZik7IHNsb3QucmFmID0gMDsgfVxuICAgIH1cbiAgfTtcbiAgLy8gUmUtYXJtIGV2ZXJ5IHRyYWNrZWQgcmluZydzIGxvb3AgYWZ0ZXIgYSBmcmVlemUuIEVhY2ggbG9vcCdzIGZpcnN0IHRpY2tcbiAgLy8gcnVucyBzeW5jaHJvbm91c2x5LCBzbyBhbGwgcmluZ3MgcmVwb3NpdGlvbiBvbiB0aGUgc2FtZSBmcmFtZS5cbiAgY29uc3QgdGhhd1JpbmdzID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgW2tleSwge2VsLCBvcHRzfV0gb2YgcmluZ1RyYWNrT3B0cykgYXJtUmluZ0xvb3Aoa2V5LCBlbCwgb3B0cyk7XG4gIH07XG5cbiAgY29uc3QgZmxhc2hFbGVtZW50ID0gKGVsOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc2xvdCA9IGVuc3VyZVJpbmcoJ2ZsYXNoJyk7XG4gICAgcG9zaXRpb25SaW5nKHNsb3QsIGVsLCB7fSk7XG4gICAgLy8gV2ViIEFuaW1hdGlvbnMgQVBJIOKAlCBrZXlmcmFtZXMgbmVlZCBubyA8c3R5bGU+LCBubyBDU1AgaXNzdWUuXG4gICAgc2xvdC5lbC5hbmltYXRlKFtcbiAgICAgIHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxLjA0KScsIGJvcmRlckNvbG9yOiAnI2ZmZTA2NicsIGJveFNoYWRvdzogJzAgMCAwIDZweCByZ2JhKDI1NSwyMjQsMTAyLC40KSd9LFxuICAgICAge29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ30sXG4gICAgXSwge2R1cmF0aW9uOiA3MDAsIGVhc2luZzogJ2Vhc2Utb3V0JywgZmlsbDogJ2ZvcndhcmRzJ30pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gcmVtb3ZlUmluZygnZmxhc2gnKSwgNzIwKTtcbiAgfTtcblxuICAvLyBMb2NhdGUtb24tcGFnZSBpcyBhIGRlbGliZXJhdGUgdXNlciByZXF1ZXN0IGZyb20gdGhlIHNpZGUgcGFuZWwgKFwid2hlcmVcbiAgLy8gaXMgdGhpcyB0aGluZz9cIiksIHNvIHRoZSB2aXN1YWwgbXVzdCBiZSBsb3VkIGVub3VnaCB0byBmaW5kIG9uIGFcbiAgLy8gY3Jvd2RlZCBwYWdlLiBUaHJlZSBzZXF1ZW50aWFsIHB1bHNlcyB3aXRoIGFuIGV4cGFuZGluZyBzaGFkb3cgaGFsbyxcbiAgLy8gcGx1cyBhIGNlbnRlci1hbmNob3JlZCBzY2FsZSB0aGF0IHBvcHMgdGhlbiBzZXR0bGVzLiBFYWNoIHB1bHNlIHJ1bnNcbiAgLy8gfjUwMG1zOyB0b3RhbCB+MS41cy4gRGlzdGluY3QgY29sb3IgKGVsZWN0cmljIGN5YW4pIHNvIGl0IGRvZXNuJ3RcbiAgLy8gY29uZnVzZSB3aXRoIHRoZSBvcmFuZ2UgaG92ZXIgcmluZyBvciB0aGUgbGltZSBkcmFnIHByZXZpZXcuXG4gIGNvbnN0IGxvY2F0ZUZsYXNoID0gKGVsOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChyLndpZHRoID09PSAwIHx8IHIuaGVpZ2h0ID09PSAwKSByZXR1cm47XG4gICAgZWwuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICdjZW50ZXInfSk7XG4gICAgY29uc3Qgc2xvdCA9IGVuc3VyZVJpbmcoJ2xvY2F0ZScpO1xuICAgIHBvc2l0aW9uUmluZyhzbG90LCBlbCwge30pO1xuICAgIE9iamVjdC5hc3NpZ24oc2xvdC5lbC5zdHlsZSwge1xuICAgICAgYm9yZGVyQ29sb3I6ICcjNWZkMWZmJyxcbiAgICAgIGJvcmRlcldpZHRoOiAnM3B4JyxcbiAgICAgIGJveFNoYWRvdzogJzAgMCAwIDRweCByZ2JhKDk1LDIwOSwyNTUsLjM1KSwgMCAwIDM2cHggcmdiYSg5NSwyMDksMjU1LC43KScsXG4gICAgICBvcGFjaXR5OiAnMScsXG4gICAgfSk7XG4gICAgLy8gVGhyZWUgcHVsc2UgY3ljbGVzOiBicmlnaHRlciBoYWxvICsgc2xpZ2h0IHNjYWxlIHB1bHNlIG9uIGVhY2ggYmVhdC5cbiAgICBzbG90LmVsLmFuaW1hdGUoW1xuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDApJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgNHB4IHJnYmEoOTUsMjA5LDI1NSwuNDUpLCAwIDAgMjBweCByZ2JhKDk1LDIwOSwyNTUsLjU1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDYpJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgMTJweCByZ2JhKDk1LDIwOSwyNTUsLjE4KSwgMCAwIDYwcHggcmdiYSg5NSwyMDksMjU1LC44NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjAwKScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDRweCByZ2JhKDk1LDIwOSwyNTUsLjQ1KSwgMCAwIDIwcHggcmdiYSg5NSwyMDksMjU1LC41NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjA2KScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDEycHggcmdiYSg5NSwyMDksMjU1LC4xOCksIDAgMCA2MHB4IHJnYmEoOTUsMjA5LDI1NSwuODUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wMCknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCA0cHggcmdiYSg5NSwyMDksMjU1LC40NSksIDAgMCAyMHB4IHJnYmEoOTUsMjA5LDI1NSwuNTUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wNiknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCAxMnB4IHJnYmEoOTUsMjA5LDI1NSwuMTgpLCAwIDAgNjBweCByZ2JhKDk1LDIwOSwyNTUsLjg1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDApJywgb3BhY2l0eTogMH0sXG4gICAgXSwge2R1cmF0aW9uOiAxNjAwLCBlYXNpbmc6ICdlYXNlLWluLW91dCcsIGZpbGw6ICdmb3J3YXJkcyd9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbW92ZVJpbmcoJ2xvY2F0ZScpLCAxNzAwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU3BhY2luZyB2aXN1YWxpemVyIChQbGFzbWljLWluc3BpcmVkKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gNCBtYXJnaW4gc3RyaXBzIChsaWdodCBvcmFuZ2UsIG91dHNpZGUgdGhlIGVsZW1lbnQpICsgNCBwYWRkaW5nIHN0cmlwc1xuICAvLyAobGlnaHQgYmx1ZSwgaW5zaWRlIHRoZSBlbGVtZW50KS4gU2lkZS1wYW5lbCBwdXNoZXMgYSBgc2V0LWNzLXByZWZzYFxuICAvLyBtZXNzYWdlIHRvIHRvZ2dsZS4gV2hlbiBPTiwgZmlyZUhvdmVyIHBhaW50cyB0aGVzZSBzdHJpcGVzIGFyb3VuZCB0aGVcbiAgLy8gY3VycmVudGx5LWhvdmVyZWQgZWxlbWVudCBlYWNoIGZyYW1lLlxuICBsZXQgc3BhY2luZ092ZXJsYXkgPSBmYWxzZTtcbiAgY29uc3Qgc3BhY2luZ0RpdnM6IEhUTUxEaXZFbGVtZW50W10gPSBbXTtcbiAgY29uc3QgZW5zdXJlU3BhY2luZ0RpdnMgPSAoKTogSFRNTERpdkVsZW1lbnRbXSA9PiB7XG4gICAgaWYgKHNwYWNpbmdEaXZzLmxlbmd0aCkgcmV0dXJuIHNwYWNpbmdEaXZzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBPYmplY3QuYXNzaWduKGQuc3R5bGUsIHtcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIGRpc3BsYXk6ICdub25lJyxcbiAgICAgICAgYmFja2dyb3VuZDogaSA8IDQgPyAncmdiYSgyNTUsMTU5LDY0LC4yOCknIDogJ3JnYmEoMTA4LDE3OCwyMzUsLjI4KScsXG4gICAgICB9KTtcbiAgICAgIHNoYWRvdy5hcHBlbmQoZCk7XG4gICAgICBzcGFjaW5nRGl2cy5wdXNoKGQpO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2luZ0RpdnM7XG4gIH07XG4gIGNvbnN0IGNsZWFyU3BhY2luZ092ZXJsYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBkIG9mIHNwYWNpbmdEaXZzKSBkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH07XG4gIGNvbnN0IHBhaW50U3BhY2luZ092ZXJsYXkgPSAoZWw6IEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNwYWNpbmdPdmVybGF5KSB7IGNsZWFyU3BhY2luZ092ZXJsYXkoKTsgcmV0dXJuOyB9XG4gICAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG10ID0gcGFyc2VGbG9hdChjcy5tYXJnaW5Ub3ApIHx8IDA7XG4gICAgY29uc3QgbXIgPSBwYXJzZUZsb2F0KGNzLm1hcmdpblJpZ2h0KSB8fCAwO1xuICAgIGNvbnN0IG1iID0gcGFyc2VGbG9hdChjcy5tYXJnaW5Cb3R0b20pIHx8IDA7XG4gICAgY29uc3QgbWwgPSBwYXJzZUZsb2F0KGNzLm1hcmdpbkxlZnQpIHx8IDA7XG4gICAgY29uc3QgcHQgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdUb3ApIHx8IDA7XG4gICAgY29uc3QgcHIgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdSaWdodCkgfHwgMDtcbiAgICBjb25zdCBwYiA9IHBhcnNlRmxvYXQoY3MucGFkZGluZ0JvdHRvbSkgfHwgMDtcbiAgICBjb25zdCBwbCA9IHBhcnNlRmxvYXQoY3MucGFkZGluZ0xlZnQpIHx8IDA7XG4gICAgY29uc3QgW20xLCBtMiwgbTMsIG00LCBwMSwgcDIsIHAzLCBwNF0gPSBlbnN1cmVTcGFjaW5nRGl2cygpO1xuICAgIC8vIE1hcmdpbiBzdHJpcHMgKGFyb3VuZCB0aGUgZWxlbWVudClcbiAgICBjb25zdCBzZXQgPSAoZDogSFRNTERpdkVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgaWYgKHcgPD0gMCB8fCBoIDw9IDApIHsgZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyByZXR1cm47IH1cbiAgICAgIGQuc3R5bGUubGVmdCA9IHggKyAncHgnO1xuICAgICAgZC5zdHlsZS50b3AgPSB5ICsgJ3B4JztcbiAgICAgIGQuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgICAgIGQuc3R5bGUuaGVpZ2h0ID0gaCArICdweCc7XG4gICAgICBkLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH07XG4gICAgc2V0KG0xISwgci5sZWZ0IC0gbWwsIHIudG9wIC0gbXQsIHIud2lkdGggKyBtbCArIG1yLCBtdCk7ICAgICAgICAgICAgLy8gdG9wXG4gICAgc2V0KG0yISwgci5yaWdodCwgci50b3AsIG1yLCByLmhlaWdodCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHRcbiAgICBzZXQobTMhLCByLmxlZnQgLSBtbCwgci5ib3R0b20sIHIud2lkdGggKyBtbCArIG1yLCBtYik7ICAgICAgICAgICAgICAvLyBib3R0b21cbiAgICBzZXQobTQhLCByLmxlZnQgLSBtbCwgci50b3AsIG1sLCByLmhlaWdodCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0XG4gICAgLy8gUGFkZGluZyBzdHJpcHMgKGluc2lkZSB0aGUgZWxlbWVudClcbiAgICBzZXQocDEhLCByLmxlZnQsIHIudG9wLCByLndpZHRoLCBwdCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b3BcbiAgICBzZXQocDIhLCByLnJpZ2h0IC0gcHIsIHIudG9wICsgcHQsIHByLCByLmhlaWdodCAtIHB0IC0gcGIpOyAgICAgICAgICAvLyByaWdodFxuICAgIHNldChwMyEsIHIubGVmdCwgci5ib3R0b20gLSBwYiwgci53aWR0aCwgcGIpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJvdHRvbVxuICAgIHNldChwNCEsIHIubGVmdCwgci50b3AgKyBwdCwgcGwsIHIuaGVpZ2h0IC0gcHQgLSBwYik7ICAgICAgICAgICAgICAgIC8vIGxlZnRcbiAgfTtcblxuICAvLyDilIDilIDilIAgT24tcGFnZSBhbm5vdGF0aW9uIHRvb2x0aXAg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFubm90YXRpb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBhbm5vdGF0aW9uRWwuY2xhc3NOYW1lID0gJ2Fubm90YXRpb24nO1xuICBPYmplY3QuYXNzaWduKGFubm90YXRpb25FbC5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgYmFja2dyb3VuZDogJ3JnYmEoMTUsMTUsMjAsLjk2KScsXG4gICAgY29sb3I6ICcjZmNmYWY1JyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsOTUsMCwuNSknLFxuICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgIHBhZGRpbmc6ICc4cHggMTBweCcsXG4gICAgZm9udDogXCIxMnB4LzEuNDUgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgbWF4V2lkdGg6ICdtaW4oMzYwcHgsIDcwdncpJyxcbiAgICBib3hTaGFkb3c6ICcwIDhweCAzMnB4IHJnYmEoMCwwLDAsLjU1KScsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgZGlzcGxheTogJ25vbmUnLFxuICAgIC8vIEFubm90YXRpb24gYWx3YXlzIHBhaW50cyBvbiB0b3Agb2YgcmluZ3MvcnViYmVyLWJhbmQvcHJldmlldyByaW5nc1xuICAgIC8vIChyaW5ncyBhcmUgekluZGV4OjE7IHRoaXMgbGlmdHMgdGhlIGNvbW1lbnQgYm94IGNsZWFyKS5cbiAgICB6SW5kZXg6ICcyMTQ3NDgzNjQ3JyxcbiAgfSk7XG4gIHNoYWRvdy5hcHBlbmQoYW5ub3RhdGlvbkVsKTtcbiAgY29uc3QgYW5ub3RhdGlvbiA9IHNldHVwQW5ub3RhdGlvbihhbm5vdGF0aW9uRWwsIHtcbiAgICBzZW5kVG9QYW5lbCxcbiAgICAvLyBGb3IgYW4gdW5jYXB0dXJlZCBlbGVtZW50LCB0aGUgdXNlciB0eXBpbmcgaW50byB0aGUgYm94IGFuZCBwcmVzc2luZ1xuICAgIC8vIEVudGVyIGJvdGggY2FwdHVyZXMgYW5kIGF0dGFjaGVzIHRoZSBjb21tZW50LlxuICAgIGNhcHR1cmVBbmRDb21tZW50OiAoZWwsIHRleHQpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBuZXh0U2VxKCkpO1xuICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgIGNvbnN0IHBhZ2UgPSBidWlsZFBhZ2VDb250ZXh0KCk7XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZX0pO1xuICAgICAgdGVzdENhcHR1cmVzPy5wdXNoKHtlbnRyeSwgcGFnZX0pO1xuICAgICAgLy8gcGFyZW50VWlkICsgdXJsIGRpc2FtYmlndWF0ZSB3aGljaCBjYXB0dXJlIHRoZSBjb21tZW50XG4gICAgICAvLyBiZWxvbmdzIHRvIHdoZW4gdGhlIHNhbWUgc2VsZWN0b3IgZXhpc3RzIG9uIG11bHRpcGxlIHBhZ2VzXG4gICAgICAvLyBvciBmb3IgbXVsdGlwbGUgc2libGluZyBlbGVtZW50cyB3aXRoIHRoZSBzYW1lIHRlc3RJZC5cbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnZmVlZGJhY2stYWRkJywgc2VsZWN0b3I6IGVudHJ5LnNlbGVjdG9yLCB0ZXh0LCB1cmw6IHBhZ2UudXJsLCBwYXJlbnRVaWQ6IGVudHJ5LnVpZH0pO1xuICAgICAgcmV0dXJuIGVudHJ5O1xuICAgIH0sXG4gICAgLy8gQm94IGhpZGVzIOKGkiB0ZWFyIGRvd24gdGhlIG1hdGNoaW5nIGhvdmVyIHJpbmcgc28gdGhlIHR3byBnbyB0b2dldGhlci5cbiAgICBvbkhpZGU6ICgpID0+IHJlbW92ZVJpbmcoJ2hvdmVyJyksXG4gICAgLy8gQm94IGFwcGVhcnMgZm9yIGFuIGVsZW1lbnQg4oaSIGVuc3VyZSB0aGUgcmluZyBpcyBvbiB0aGUgc2FtZSBlbGVtZW50LlxuICAgIG9uU2hvdzogKGVsKSA9PiB0cmFja0VsZW1lbnQoJ2hvdmVyJywgZWwsIHtsYWJlbDogY29tcGFjdFRhcmdldChlbCl9KSxcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEFsdC1ob3ZlciBzdGF0ZSBtYWNoaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgYWx0QWN0aXZlID0gZmFsc2U7XG4gIGxldCBhbHRGb3J3YXJkZWQgPSBmYWxzZTtcbiAgLy8gU3RpY2t5IFwicGluY2ggbW9kZVwiOiB3aGVuIG9uLCBwbGFpbiBob3Zlci9jbGljayBjYXB0dXJlcyB3aXRob3V0IHRoZVxuICAvLyBBbHQgbW9kaWZpZXIgaGVsZC4gQSBmaXhlZCBwYWdlIGJhZGdlIHNpZ25hbHMgaXQ7IEVzYyBleGl0cy5cbiAgbGV0IG1hbnVhbFNlbGVjdCA9IGZhbHNlO1xuICBjb25zdCBwaW5jaEVuZ2FnZWQgPSAobmF0aXZlOiBib29sZWFuKTogYm9vbGVhbiA9PiBuYXRpdmUgfHwgYWx0Rm9yd2FyZGVkIHx8IG1hbnVhbFNlbGVjdDtcbiAgbGV0IGxhc3RIb3ZlckVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBsYXN0TW91c2UgPSB7eDogLTEsIHk6IC0xfTtcbiAgbGV0IGtub3duQ2FwdHVyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLy8gSG92ZXIvY2xpY2sgc25hcDogd2hlbiBPTiwgZXZlcnkgYWx0LWhvdmVyIGFuZCBjYXB0dXJlIHdhbGtzIHVwIHRvIHRoZVxuICAvLyBuZWFyZXN0IGNvbXBvbmVudC1tYXJrZXIgYW5jZXN0b3IgKGRhdGEtdGVzdGlkL3JvbGUvaWQvYnV0dG9uL2EvaW5wdXQpXG4gIC8vIHNvIHNpbmdsZS1jbGljayBhbmQgcnViYmVyLWJhbmQgc2VsZWN0aW9uIHBpY2sgY29uc2lzdGVudCBsYXllcnNcbiAgLy8gcmVnYXJkbGVzcyBvZiBwaXhlbC1sZXZlbCBjdXJzb3IgcGxhY2VtZW50LiBQdXNoZWQgYnkgdGhlIHNpZGUgcGFuZWxcbiAgLy8gdmlhIGBzZXQtY3MtcHJlZnNgLlxuICBsZXQgaG92ZXJTbmFwID0gdHJ1ZTtcblxuICBjb25zdCBmaXJlSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgcmVtb3ZlUmluZygnaG92ZXInKTtcbiAgICBjbGVhclNwYWNpbmdPdmVybGF5KCk7XG4gICAgbGFzdEhvdmVyRWwgPSBudWxsO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnaG92ZXItZW5kJ30pO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGlja3kgcGluY2gtbW9kZSBiYWRnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQSBmaXhlZCBwaWxsIGluIHRoZSBvdmVybGF5IHNvIHRoZSB1c2VyIGFsd2F5cyBrbm93cyBwbGFpbiBjbGlja3MgYXJlXG4gIC8vIGNhcHR1cmluZyAoYW5kIGhvdyB0byBsZWF2ZSkuIExpdmVzIGluIHRoZSBzaGFkb3cgcm9vdCwgcG9pbnRlci1ldmVudHNcbiAgLy8gbm9uZSBzbyBpdCBuZXZlciBlYXRzIGEgY2xpY2suXG4gIGxldCBzZWxlY3RCYWRnZTogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2hvd1NlbGVjdEJhZGdlID0gKG9uOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKCFvbikgeyBzZWxlY3RCYWRnZT8ucmVtb3ZlKCk7IHNlbGVjdEJhZGdlID0gbnVsbDsgcmV0dXJuOyB9XG4gICAgaWYgKHNlbGVjdEJhZGdlKSByZXR1cm47XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGIudGV4dENvbnRlbnQgPSAn8J+kjyBQaW5jaCBtb2RlIOKAlCBjbGljayB0byBjYXB0dXJlIMK3IEVzYyB0byBleGl0JztcbiAgICBPYmplY3QuYXNzaWduKGIuc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBsZWZ0OiAnNTAlJywgYm90dG9tOiAnMThweCcsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDk1LDAsLjk1KScsIGNvbG9yOiAnI2ZmZicsXG4gICAgICBmb250OiBcIjYwMCAxMnB4LzEgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgICBwYWRkaW5nOiAnOHB4IDE0cHgnLCBib3JkZXJSYWRpdXM6ICc5OTlweCcsXG4gICAgICBib3hTaGFkb3c6ICcwIDRweCAyMHB4IHJnYmEoMCwwLDAsLjM1KScsIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgIHpJbmRleDogJzIxNDc0ODM2NDcnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICB9KTtcbiAgICBzaGFkb3cuYXBwZW5kKGIpO1xuICAgIHNlbGVjdEJhZGdlID0gYjtcbiAgfTtcbiAgY29uc3Qgc2V0U2VsZWN0TW9kZSA9IChvbjogYm9vbGVhbiwgbm90aWZ5UGFuZWwgPSBmYWxzZSk6IHZvaWQgPT4ge1xuICAgIGlmIChtYW51YWxTZWxlY3QgPT09IG9uKSByZXR1cm47XG4gICAgbWFudWFsU2VsZWN0ID0gb247XG4gICAgc2hvd1NlbGVjdEJhZGdlKG9uKTtcbiAgICBicmluZ1RvRnJvbnQoKTtcbiAgICBzZXRBbHRBY3RpdmUob24pOyAgICAgICAgICAgLy8gZW5nYWdlL2Rpc2VuZ2FnZSB0aGUgaG92ZXIgcmluZyBpbW1lZGlhdGVseVxuICAgIGlmIChub3RpZnlQYW5lbCkgc2VuZFRvUGFuZWwoe2tpbmQ6ICdzZWxlY3QtbW9kZScsIG9ufSk7XG4gIH07XG5cbiAgY29uc3Qgc2V0QWx0QWN0aXZlID0gKG9uOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKGFsdEFjdGl2ZSA9PT0gb24pIHJldHVybjtcbiAgICBhbHRBY3RpdmUgPSBvbjtcbiAgICBpZiAoIW9uKSB7XG4gICAgICAvLyBJZiB0aGUgY29tbWVudCBib3ggaXMgdmlzaWJsZSwgcmluZyBhbmQgYm94IGFyZSBhIHVuaXQ6IGtlZXAgQk9USFxuICAgICAgLy8gb24gc2NyZWVuIGFuZCBoYW5kIGZvY3VzIHRvIHRoZSB0ZXh0YXJlYSBzbyB0aGUgdXNlciBjYW4gdHlwZVxuICAgICAgLy8gaW1tZWRpYXRlbHkuIElmIHRoZXJlJ3Mgbm8gYm94LCBubyBmb2N1cyB0byBnaXZlIOKAlCB0ZWFyIGRvd24gdGhlXG4gICAgICAvLyByaW5nIGFzIGJlZm9yZS5cbiAgICAgIGlmIChhbm5vdGF0aW9uRWwuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2hvdmVyLWVuZCd9KTsgLy8gcGFuZWwtc2lkZSBzdGF0dXMgcmVzZXRcbiAgICAgICAgYW5ub3RhdGlvbi5mb2N1c1RleHRhcmVhKCk7XG4gICAgICAgIC8vIChyaW5nIHJlbWFpbnM7IHJBRiBrZWVwcyBpdCB0cmFja2luZyB0aGUgY3VycmVudCBlbGVtZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlyZUhvdmVyRW5kKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsYXN0TW91c2UueCA+PSAwKSB7XG4gICAgICBjb25zdCB0Z3QgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGxhc3RNb3VzZS54LCBsYXN0TW91c2UueSk7XG4gICAgICBpZiAodGd0IGluc3RhbmNlb2YgRWxlbWVudCkgeyBsYXN0SG92ZXJFbCA9IHRndDsgZmlyZUhvdmVyKHRndCk7IH1cbiAgICB9XG4gIH07XG5cbiAgLy8gVHJ1ZSB3aGVuIGFuIGVsZW1lbnQgaXMgdG9vIGxhcmdlIHRvIGJlIGEgbWVhbmluZ2Z1bCBjYXB0dXJlIHRhcmdldCDigJRcbiAgLy8gYm9keSAvIGh0bWwgLyB3cmFwcGVycyBjb3ZlcmluZyBtb3N0IG9mIHRoZSB2aWV3cG9ydC4gVXNlZCB0byByZWplY3RcbiAgLy8gYWx0LWNsaWNrIGFuZCBwZW5kaW5nLXN0YWdlIGNhcHR1cmVzIHNvIHRoZSB1c2VyIGRvZXNuJ3QgYWNjaWRlbnRhbGx5XG4gIC8vIGdyYWIgdGhlIHdob2xlIHBhZ2Ugd2hlbiB0aGV5IGNsaWNrIG9uIGRlYWQgc3BhY2UuXG4gIGNvbnN0IGlzSHVnZUVsZW1lbnQgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgICBpZiAoZWwgPT09IGRvY3VtZW50LmJvZHkgfHwgZWwgPT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiByLndpZHRoID49IHdpbmRvdy5pbm5lcldpZHRoICogMC45ICYmIHIuaGVpZ2h0ID49IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOTtcbiAgfTtcblxuICBjb25zdCByZXNvbHZlSG92ZXJUYXJnZXQgPSAodGd0OiBFbGVtZW50KToge2VsOiBFbGVtZW50OyBzZWxlY3Rvcjogc3RyaW5nfSA9PiB7XG4gICAgY29uc3QgZWwgPSBob3ZlclNuYXAgPyBzbmFwVG9Db21wb25lbnQodGd0LCBrbm93bkNhcHR1cmVkKSA6IHRndDtcbiAgICAvLyBSZXVzZSBhIGtub3duLWNhcHR1cmVkIHNlbGVjdG9yIHZlcmJhdGltIGlmIHRoZSBzbmFwcGVkIGVsZW1lbnRcbiAgICAvLyBtYXRjaGVzIG9uZSDigJQga2VlcHMgdGhlIGNhcHR1cmVkLXNpZGUgaWRlbnRpdHkgc3RhYmxlLlxuICAgIGZvciAoY29uc3Qgc2VsIG9mIGtub3duQ2FwdHVyZWQpIHtcbiAgICAgIHRyeSB7IGlmIChlbC5tYXRjaGVzKHNlbCkpIHJldHVybiB7ZWwsIHNlbGVjdG9yOiBzZWx9OyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIHtlbCwgc2VsZWN0b3I6IGNzc1BhdGgoZWwpfTtcbiAgfTtcblxuICBjb25zdCBmaXJlSG92ZXIgPSAodGd0OiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qge2VsLCBzZWxlY3Rvcn0gPSByZXNvbHZlSG92ZXJUYXJnZXQodGd0KTtcbiAgICAvLyBSZWplY3QgYm9keSAvIGh0bWwgLyBhbnkgcGFnZS1zcGFubmluZyB3cmFwcGVyIGF0IHRoZSBob3ZlciBzdGFnZSB0b28uXG4gICAgLy8gVGhlIGVhcmxpZXIgZmlsdGVyIG9ubHkgcmFuIG9uIGNsaWNrICsgc3RhZ2VQZW5kaW5nLCBzbyBhbHQtaG92ZXJpbmdcbiAgICAvLyBlbXB0eSBwYWdlIGFyZWEgc3RpbGwgcGFpbnRlZCBhIHJpbmcgYXJvdW5kIHRoZSBlbnRpcmUgcGFnZS5cbiAgICBpZiAoaXNIdWdlRWxlbWVudChlbCkpIHtcbiAgICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2hvdmVyLWVuZCd9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJhY2tFbGVtZW50KCdob3ZlcicsIGVsLCB7bGFiZWw6IGNvbXBhY3RUYXJnZXQoZWwpfSk7XG4gICAgcGFpbnRTcGFjaW5nT3ZlcmxheShlbCk7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHNlbmRUb1BhbmVsKHtcbiAgICAgIGtpbmQ6ICdob3ZlcicsXG4gICAgICBzZWxlY3RvcixcbiAgICAgIHRhZzogZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgbGFiZWw6IGNvbXBhY3RUYXJnZXQoZWwpLFxuICAgICAgcmVjdDoge3g6IE1hdGgucm91bmQoci54KSwgeTogTWF0aC5yb3VuZChyLnkpLCB3OiBNYXRoLnJvdW5kKHIud2lkdGgpLCBoOiBNYXRoLnJvdW5kKHIuaGVpZ2h0KX0sXG4gICAgfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIERyYWcgc3RhdGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzZXF1ZW5jZUNvdW50ZXIgPSAwO1xuICBjb25zdCBuZXh0U2VxID0gKCk6IG51bWJlciA9PiArK3NlcXVlbmNlQ291bnRlcjtcbiAgbGV0IGxhc3RDb250ZXh0RWw6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IHN1cHByZXNzTmV4dENsaWNrID0gZmFsc2U7XG4gIGxldCBkcmFnU3RhcnQ6IHt4OiBudW1iZXI7IHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcbiAgbGV0IGRyYWdSZWN0OiBIVE1MRGl2RWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBsZXQgZHJhZ1NhdmVkVXNlclNlbGVjdCA9ICcnO1xuICAvLyBTdGFibGUgY2FuZGlkYXRlIHBvb2wgbG9ja2VkIGF0IGRyYWcgc3RhcnQg4oCUIGV2ZXJ5IGVsZW1lbnRzSW5SZWN0IGNhbGxcbiAgLy8gZm9yIHRoaXMgZHJhZyB1c2VzIHRoZSBzYW1lIHBvb2wsIHNvIHRoZSBydWJiZXItYmFuZCBzZWxlY3Rpb24gZ3Jvd3MgL1xuICAvLyBzaHJpbmtzIG1vbm90b25pY2FsbHkgd2l0aCByZWN0IHNpemUgKG5vIHRpZXItc2hpZnQgY2h1cm4pLlxuICBsZXQgZHJhZ0NhbmRpZGF0ZXM6IHJlYWRvbmx5IEVsZW1lbnRbXSA9IFtdO1xuXG4gIGNvbnN0IGNsZWFyUHJldmlld1JpbmdzID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgayBvZiBbLi4ucmluZ3Mua2V5cygpXSkgaWYgKGsuc3RhcnRzV2l0aCgncHJldmlldzonKSkgcmVtb3ZlUmluZyhrKTtcbiAgfTtcbiAgY29uc3QgZW5zdXJlRHJhZ1JlY3QgPSAoKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGlmIChkcmFnUmVjdCkgcmV0dXJuIGRyYWdSZWN0O1xuICAgIGRyYWdSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZHJhZ1JlY3QuY2xhc3NOYW1lID0gJ3J1YmJlcic7XG4gICAgT2JqZWN0LmFzc2lnbihkcmFnUmVjdC5zdHlsZSwge1xuICAgICAgcG9zaXRpb246ICdmaXhlZCcsIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgIC8vIEJvcmRlciBzdHlsZSBpcyBzZXQgYnkgdXBkYXRlRHJhZ1JlY3QgZWFjaCBmcmFtZTogc29saWQgZm9yIFwiZnVsbFxuICAgICAgLy8gZW5jbG9zdXJlXCIgKGxlZnTihpJyaWdodCksIGRhc2hlZCBmb3IgXCJwYXJ0aWFsIG92ZXJsYXBcIiAocmlnaHTihpJsZWZ0KS5cbiAgICAgIGJvcmRlcjogJzJweCBzb2xpZCAjZmY1ZjAwJyxcbiAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDI1NSw5NSwwLC4xNCknLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICAgIGJveFNoYWRvdzogJzAgMCAwIDFweCByZ2JhKDI1NSw5NSwwLC4zNSksIDAgMCAxOHB4IHJnYmEoMjU1LDk1LDAsLjI1KScsXG4gICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICB9KTtcbiAgICBzaGFkb3cuYXBwZW5kKGRyYWdSZWN0KTtcbiAgICBkcmFnU2F2ZWRVc2VyU2VsZWN0ID0gZG9jdW1lbnQuYm9keS5zdHlsZS51c2VyU2VsZWN0O1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnY3Jvc3NoYWlyJztcbiAgICAvLyBEcmFnIG1vZGU6IGhpZGUgdGhlIGNvbW1lbnQgYm94IHNvIGl0IGRvZXNuJ3Qgb2JzY3VyZSB0aGUgcnViYmVyIGJhbmQuXG4gICAgYW5ub3RhdGlvbi5oaWRlKCk7XG4gICAgcmVtb3ZlUmluZygnaG92ZXInKTtcbiAgICAvLyBMb2NrIHRoZSBjYW5kaWRhdGUgcG9vbCBPTkNFIHBlciBkcmFnIChyaWdvcm91cy0zZC1hcHAgYmVoYXZpb3IpLlxuICAgIGRyYWdDYW5kaWRhdGVzID0gcGlja0RyYWdDYW5kaWRhdGVzKG92ZXJsYXlIb3N0KTtcbiAgICBjb25zb2xlLmxvZyhMT0csICdkcmFnIGNhbmRpZGF0ZSBwb29sIGxvY2tlZDonLCBkcmFnQ2FuZGlkYXRlcy5sZW5ndGgsICdlbGVtZW50cycpO1xuICAgIHJldHVybiBkcmFnUmVjdDtcbiAgfTtcbiAgY29uc3QgdGVhcmRvd25EcmFnUmVjdCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoZHJhZ1JlY3QpIHsgZHJhZ1JlY3QucmVtb3ZlKCk7IGRyYWdSZWN0ID0gbnVsbDsgfVxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IGRyYWdTYXZlZFVzZXJTZWxlY3Q7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJyc7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnJztcbiAgICBjbGVhclByZXZpZXdSaW5ncygpO1xuICAgIGRyYWdDYW5kaWRhdGVzID0gW107XG4gIH07XG4gIGxldCBsYXN0UHJldmlld0tleXMgPSBuZXcgU2V0PEVsZW1lbnQ+KCk7XG4gIC8vIFNlbGVjdGlvbiBtb2RlIGlzIGRlY2lkZWQgYnkgZHJhZyBkaXJlY3Rpb24gKDNELWFwcCBjb252ZW50aW9uKTpcbiAgLy8gICBsZWZ04oaScmlnaHQgIDogJ2Z1bGwnICAgIOKAlCBlbGVtZW50IG11c3QgYmUgZW50aXJlbHkgaW5zaWRlIHRoZSByZWN0O1xuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1YmJlci1iYW5kIGhhcyBhIFNPTElEIGJvcmRlci5cbiAgLy8gICByaWdodOKGkmxlZnQgIDogJ3BhcnRpYWwnIOKAlCBhbnkgb3ZlcmxhcCBzZWxlY3RzO1xuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1YmJlci1iYW5kIGhhcyBhIERPVFRFRCBib3JkZXIuXG4gIGNvbnN0IGRyYWdNb2RlID0gKGU6IE1vdXNlRXZlbnQpOiAncGFydGlhbCcgfCAnZnVsbCcgPT5cbiAgICBkcmFnU3RhcnQgJiYgZS5jbGllbnRYID49IGRyYWdTdGFydC54ID8gJ2Z1bGwnIDogJ3BhcnRpYWwnO1xuXG4gIGNvbnN0IHVwZGF0ZURyYWdSZWN0ID0gKGU6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIWRyYWdTdGFydCkgcmV0dXJuO1xuICAgIGNvbnN0IGR4ID0gTWF0aC5hYnMoZS5jbGllbnRYIC0gZHJhZ1N0YXJ0LngpO1xuICAgIGNvbnN0IGR5ID0gTWF0aC5hYnMoZS5jbGllbnRZIC0gZHJhZ1N0YXJ0LnkpO1xuICAgIGlmICghZHJhZ1JlY3QgJiYgZHggPCAyICYmIGR5IDwgMikgcmV0dXJuO1xuICAgIGNvbnN0IHgxID0gTWF0aC5taW4oZHJhZ1N0YXJ0LngsIGUuY2xpZW50WCk7XG4gICAgY29uc3QgeTEgPSBNYXRoLm1pbihkcmFnU3RhcnQueSwgZS5jbGllbnRZKTtcbiAgICBjb25zdCB4MiA9IE1hdGgubWF4KGRyYWdTdGFydC54LCBlLmNsaWVudFgpO1xuICAgIGNvbnN0IHkyID0gTWF0aC5tYXgoZHJhZ1N0YXJ0LnksIGUuY2xpZW50WSk7XG4gICAgY29uc3QgciA9IGVuc3VyZURyYWdSZWN0KCk7XG4gICAgY29uc3QgbW9kZSA9IGRyYWdNb2RlKGUpO1xuICAgIE9iamVjdC5hc3NpZ24oci5zdHlsZSwge1xuICAgICAgbGVmdDogeDEgKyAncHgnLFxuICAgICAgdG9wOiB5MSArICdweCcsXG4gICAgICB3aWR0aDogKHgyIC0geDEpICsgJ3B4JyxcbiAgICAgIGhlaWdodDogKHkyIC0geTEpICsgJ3B4JyxcbiAgICAgIGJvcmRlclN0eWxlOiBtb2RlID09PSAnZnVsbCcgPyAnc29saWQnIDogJ2Rhc2hlZCcsXG4gICAgfSk7XG4gICAgLy8gTGl2ZSBwcmV2aWV3OiBwYWludCBhIHZpdmlkIHJpbmcgb24gZXZlcnkgY2FuZGlkYXRlIHRoZSBydWJiZXIgYmFuZFxuICAgIC8vIHdvdWxkIGNvbW1pdCBpZiB0aGUgdXNlciByZWxlYXNlZCByaWdodCBub3cuIERpZmYgYWdhaW5zdCB0aGUgbGFzdFxuICAgIC8vIGZyYW1lIHNvIHdlIGRvbid0IGNodXJuIHJpbmdzIHdoZW4gdGhlIHNldCBpcyB1bmNoYW5nZWQuIFRoZVxuICAgIC8vIGNhbmRpZGF0ZSBwb29sIHdhcyBsb2NrZWQgYXQgZHJhZy1zdGFydCBzbyB0aGUgc2V0IGlzIG1vbm90b25pYyB3aXRoXG4gICAgLy8gcmVjdCBzaXplIOKAlCBubyByYW5kb20gc2VsZWN0L2Rlc2VsZWN0IG1pZC1kcmFnLlxuICAgIGNvbnN0IGVscyA9IGVsZW1lbnRzSW5SZWN0KGRyYWdDYW5kaWRhdGVzLCB4MSwgeTEsIHgyLCB5MiwgbW9kZSk7XG4gICAgY29uc3QgbmV4dCA9IG5ldyBTZXQoZWxzKTtcbiAgICBsZXQgc2FtZSA9IG5leHQuc2l6ZSA9PT0gbGFzdFByZXZpZXdLZXlzLnNpemU7XG4gICAgaWYgKHNhbWUpIGZvciAoY29uc3QgZWwgb2YgbmV4dCkgeyBpZiAoIWxhc3RQcmV2aWV3S2V5cy5oYXMoZWwpKSB7IHNhbWUgPSBmYWxzZTsgYnJlYWs7IH0gfVxuICAgIGlmICghc2FtZSkge1xuICAgICAgY2xlYXJQcmV2aWV3UmluZ3MoKTtcbiAgICAgIGVscy5mb3JFYWNoKChlbCwgaSkgPT4gdHJhY2tFbGVtZW50KGBwcmV2aWV3OiR7aX1gLCBlbCwge3ByZXZpZXc6IHRydWV9KSk7XG4gICAgICBsYXN0UHJldmlld0tleXMgPSBuZXh0O1xuICAgICAgY29uc29sZS5sb2coTE9HLCBgZHJhZyBwcmV2aWV3ICgke21vZGV9KTpgLCBlbHMubGVuZ3RoLCAndGFyZ2V0cycsIGVscy5tYXAoY29tcGFjdFRhcmdldCkpO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgUGVuZGluZy1tdWx0aSBzdGFnaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgcGVuZGluZ011bHRpOiBBcnJheTx7ZWw6IEVsZW1lbnQ7IGVudHJ5OiBFbnRyeX0+ID0gW107XG4gIGNvbnN0IHN0YWdlUGVuZGluZyA9IChyYXc6IEVsZW1lbnQsIGNsaWNrQXQ/OiB7Y2xpZW50WDogbnVtYmVyOyBjbGllbnRZOiBudW1iZXJ9KTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBob3ZlclNuYXAgPyBzbmFwVG9Db21wb25lbnQocmF3LCBrbm93bkNhcHR1cmVkKSA6IHJhdztcbiAgICBpZiAoaXNIdWdlRWxlbWVudChlbCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NraXBwaW5nIGh1Z2UgZWxlbWVudCBmcm9tIHN0YWdpbmc6JywgY29tcGFjdFRhcmdldChlbCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShlbCwgbmV4dFNlcSgpLCB7XG4gICAgICAuLi4oY2xpY2tBdCA/IHtjbGlja0F0fSA6IHt9KSxcbiAgICB9KTtcbiAgICBpZiAocGVuZGluZ011bHRpLnNvbWUoKHApID0+IHAuZWwgPT09IGVsIHx8IHAuZW50cnkuc2VsZWN0b3IgPT09IGVudHJ5LnNlbGVjdG9yKSkge1xuICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaWR4ID0gcGVuZGluZ011bHRpLmxlbmd0aDtcbiAgICBwZW5kaW5nTXVsdGkucHVzaCh7ZWwsIGVudHJ5fSk7XG4gICAgdHJhY2tFbGVtZW50KGBwZW5kaW5nOiR7aWR4fWAsIGVsLCB7Z29sZDogdHJ1ZSwgbGFiZWw6IGAjJHtpZHggKyAxfSAke2NvbXBhY3RUYXJnZXQoZWwpfWB9KTtcbiAgICBmbGFzaEVsZW1lbnQoZWwpO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncGVuZGluZy1hZGQnLCBlbnRyeX0pO1xuICB9O1xuICBjb25zdCBjb21taXRQZW5kaW5nTXVsdGkgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFwZW5kaW5nTXVsdGkubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc29sZS5sb2coTE9HLCAnY29tbWl0UGVuZGluZ011bHRpIOKAlCBjb21taXR0aW5nJywgcGVuZGluZ011bHRpLmxlbmd0aCwgJ3N0YWdlZCBlbGVtZW50cycpO1xuICAgIGNvbnNvbGUudHJhY2UoTE9HLCAnY29tbWl0IHN0YWNrIHRyYWNlJyk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKHtlbCwgZW50cnl9LCBpKSA9PiB7XG4gICAgICBjb25zdCBwYWdlID0gYnVpbGRQYWdlQ29udGV4dCgpO1xuICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2UsIGdyb3VwZWQ6IGkgPiAwfSk7XG4gICAgICB0ZXN0Q2FwdHVyZXM/LnB1c2goe2VudHJ5LCBwYWdlLCBncm91cGVkOiBpID4gMH0pO1xuICAgICAgcmVtb3ZlUmluZyhgcGVuZGluZzoke2l9YCk7XG4gICAgICBpZiAoZWwuaXNDb25uZWN0ZWQpIGZsYXNoRWxlbWVudChlbCk7XG4gICAgfSk7XG4gICAgcGVuZGluZ011bHRpID0gW107XG4gICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ30pO1xuICB9O1xuICBjb25zdCBjYW5jZWxQZW5kaW5nTXVsdGkgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIGNvbnNvbGUubG9nKExPRywgJ2NhbmNlbFBlbmRpbmdNdWx0aSDigJQgZGlzY2FyZGluZycsIHBlbmRpbmdNdWx0aS5sZW5ndGgsICdzdGFnZWQnKTtcbiAgICBwZW5kaW5nTXVsdGkuZm9yRWFjaCgoXywgaSkgPT4gcmVtb3ZlUmluZyhgcGVuZGluZzoke2l9YCkpO1xuICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncGVuZGluZy1jbGVhcid9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgTW91c2UgbGlzdGVuZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgbGFzdE1vdmVUcyA9IDA7XG4gIGNvbnN0IG9uTW91c2VNb3ZlID0gKGU6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIW9ycGhhbkd1YXJkKCkpIHJldHVybjtcbiAgICBpZiAoZS50aW1lU3RhbXAgPT09IGxhc3RNb3ZlVHMpIHJldHVybjtcbiAgICBsYXN0TW92ZVRzID0gZS50aW1lU3RhbXA7XG4gICAgbGFzdE1vdXNlID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcbiAgICBpZiAoZHJhZ1N0YXJ0KSB7XG4gICAgICAvLyBJbiBhIHJ1YmJlci1iYW5kIGRyYWcgdGhlIG9ubHkgaGlnaGxpZ2h0IHRoYXQgc2hvdWxkIGFwcGVhciBpcyB0aGVcbiAgICAgIC8vIGxpbWUgUFJFVklFVyByaW5nIG9uIGNhbmRpZGF0ZXMgaW5zaWRlIHRoZSByZWN0LiBUaGUgb3JhbmdlIGhvdmVyXG4gICAgICAvLyByaW5nIHdvdWxkIG90aGVyd2lzZSByZXBhaW50IG9uIHdoYXRldmVyIGVsZW1lbnQgdGhlIGN1cnNvciBpc1xuICAgICAgLy8gb3ZlciwgbWl4aW5nIHR3byBjb2xvcnMgYW5kIGNvbmZ1c2luZyB0aGUgdXNlci5cbiAgICAgIHVwZGF0ZURyYWdSZWN0KGUpO1xuICAgICAgcmVtb3ZlUmluZygnaG92ZXInKTtcbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnaG92ZXItZW5kJ30pO1xuICAgICAgbGFzdEhvdmVyRWwgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBhbHRPbiA9IHBpbmNoRW5nYWdlZChlLmFsdEtleSk7XG4gICAgaWYgKCFhbHRPbikgeyBpZiAoYWx0QWN0aXZlKSBzZXRBbHRBY3RpdmUoZmFsc2UpOyByZXR1cm47IH1cbiAgICBpZiAoIWFsdEFjdGl2ZSkgc2V0QWx0QWN0aXZlKHRydWUpO1xuICAgIGNvbnN0IHRndCA9IGUudGFyZ2V0O1xuICAgIGlmICghKHRndCBpbnN0YW5jZW9mIEVsZW1lbnQpIHx8IHRndCA9PT0gbGFzdEhvdmVyRWwpIHJldHVybjtcbiAgICBsYXN0SG92ZXJFbCA9IHRndDtcbiAgICBmaXJlSG92ZXIodGd0KTtcbiAgfTtcblxuICBjb25zdCBpc0luc2lkZUFubm90YXRpb24gPSAoZTogRXZlbnQpOiBib29sZWFuID0+IHtcbiAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgIT09ICdibG9jaycpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwYXRoID0gdHlwZW9mIGUuY29tcG9zZWRQYXRoID09PSAnZnVuY3Rpb24nID8gZS5jb21wb3NlZFBhdGgoKSA6IFtdO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBwYXRoKSBpZiAobm9kZSA9PT0gYW5ub3RhdGlvbkVsKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRi4xOCDigJQgbmV2ZXIgY2FwdHVyZSBhbiBlbGVtZW50IHRoYXQncyBwYXJ0IG9mIHBpbmNoZ3JhYidzIG93biBVSS5cbiAgLy8gVGhlIHNoYWRvdyBob3N0IGlzIGAjX19waW5jaGdyYWJfb3ZlcmxheWA7IGV2ZXJ5dGhpbmcgcGFpbnRlZCBpbnNpZGVcbiAgLy8gKHJpbmdzLCBydWJiZXIgYmFuZCwgbm9vZGxlIFNWRywgYW5ub3RhdGlvbiB0ZXh0YXJlYSkgbGl2ZXMgaW4gaXRzXG4gIC8vIHNoYWRvdyByb290LiBPcGVuLW1vZGUgc2hhZG93ICsgY29tcG9zZWRQYXRoKCkgbGV0cyB1cyBzZWUgdGhlIHJlYWxcbiAgLy8gdGFyZ2V0IGV2ZW4gd2hlbiBldmVudCByZXRhcmdldGluZyBpcyBpbiBwbGF5LCBzbyB3ZSB3YWxrIHRoZVxuICAvLyBjb21wb3NlZCBwYXRoIGxvb2tpbmcgZm9yIHRoZSBob3N0LiBUaGUgY2hlYXAgaWQgY2hlY2sgc3RpbGwgcnVuc1xuICAvLyBmaXJzdCBhcyBhIGZhc3QgcGF0aC5cbiAgY29uc3QgaXNQaW5jaGdyYWJPd25VaSA9IChlOiBFdmVudCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldDtcbiAgICBpZiAodCBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgdC5pZCA9PT0gJ19fcGluY2hncmFiX292ZXJsYXknKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBwYXRoID0gdHlwZW9mIGUuY29tcG9zZWRQYXRoID09PSAnZnVuY3Rpb24nID8gZS5jb21wb3NlZFBhdGgoKSA6IFtdO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBwYXRoKSB7XG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5pZCA9PT0gJ19fcGluY2hncmFiX292ZXJsYXknKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChub2RlID09PSBvdmVybGF5SG9zdCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBvbk1vdXNlRG93biA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFvcnBoYW5HdWFyZCgpKSByZXR1cm47XG4gICAgaWYgKGlzSW5zaWRlQW5ub3RhdGlvbihlKSkgcmV0dXJuO1xuICAgIGlmIChhbm5vdGF0aW9uRWwuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJyAmJiAhYW5ub3RhdGlvbi5pc0xvY2tlZCgpKSBhbm5vdGF0aW9uLmhpZGUoKTtcbiAgICBpZiAoIXBpbmNoRW5nYWdlZChlLmFsdEtleSkgfHwgZHJhZ1N0YXJ0KSByZXR1cm47XG4gICAgaWYgKGlzUGluY2hncmFiT3duVWkoZSkpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBkcmFnU3RhcnQgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuICAgIGNvbnNvbGUubG9nKExPRywgJ2RyYWcgYXJtZWQgYXQnLCBkcmFnU3RhcnQpO1xuICB9O1xuXG4gIGNvbnN0IG9uTW91c2VVcCA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFkcmFnU3RhcnQpIHJldHVybjtcbiAgICBjb25zdCBzdGFydCA9IGRyYWdTdGFydDtcbiAgICBjb25zdCB3YXNEcmFnID0gQm9vbGVhbihkcmFnUmVjdCk7XG4gICAgZHJhZ1N0YXJ0ID0gbnVsbDtcbiAgICB0ZWFyZG93bkRyYWdSZWN0KCk7XG4gICAgaWYgKCF3YXNEcmFnKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdkcmFnIHRvbyBzaG9ydCwgdHJlYXRlZCBhcyBzaW5nbGUgY2xpY2snKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc3VwcHJlc3NOZXh0Q2xpY2sgPSB0cnVlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4geyBzdXBwcmVzc05leHRDbGljayA9IGZhbHNlOyB9LCAyMDApO1xuICAgIGNvbnN0IG1vZGU6ICdwYXJ0aWFsJyB8ICdmdWxsJyA9IGUuY2xpZW50WCA+PSBzdGFydC54ID8gJ2Z1bGwnIDogJ3BhcnRpYWwnO1xuICAgIC8vIFVzZSB0aGUgU0FNRSBjYW5kaWRhdGUgcG9vbCB0aGF0IHdhcyBsb2NrZWQgYXQgZHJhZyBzdGFydCBzbyB0aGVcbiAgICAvLyBjb21taXR0ZWQgc2V0IG1hdGNoZXMgd2hhdCB0aGUgdXNlciBzYXcgaGlnaGxpZ2h0ZWQgbW9tZW50cyBiZWZvcmUuXG4gICAgY29uc3QgcG9vbEZvckNvbW1pdCA9IGRyYWdDYW5kaWRhdGVzLmxlbmd0aCA/IGRyYWdDYW5kaWRhdGVzIDogcGlja0RyYWdDYW5kaWRhdGVzKG92ZXJsYXlIb3N0KTtcbiAgICBjb25zdCBlbHMgPSBlbGVtZW50c0luUmVjdChwb29sRm9yQ29tbWl0LCBzdGFydC54LCBzdGFydC55LCBlLmNsaWVudFgsIGUuY2xpZW50WSwgbW9kZSk7XG4gICAgY29uc29sZS5sb2coTE9HLCBgZHJhZyBFTkQg4oCUIG1vZGU9JHttb2RlfSDigJQgU1RBR0lORyAoTk9UIGNvbW1pdHRpbmcpYCwgZWxzLmxlbmd0aCwgJ2VsZW1lbnRzOicsIGVscy5tYXAoY29tcGFjdFRhcmdldCkpO1xuICAgIC8vIERyYWcgbWlycm9ycyBBbHQrU2hpZnQrQ2xpY2sg4oCUIGV2ZXJ5IGVsZW1lbnQgc3RhZ2VzIGludG8gdGhlIHBlbmRpbmdcbiAgICAvLyBiYXkuIFRoZSB1c2VyIE1VU1QgY2xpY2sgXCJDb21taXQgZ3JvdXBcIiBpbiB0aGUgc2lkZSBwYW5lbCB0byBmaW5hbGl6ZTtcbiAgICAvLyB0aGVyZSBpcyBubyBhdXRvLWNvbW1pdCB0aW1lci5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGVscykgc3RhZ2VQZW5kaW5nKGVsKTtcbiAgfTtcblxuICBjb25zdCBvbkNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFvcnBoYW5HdWFyZCgpKSByZXR1cm47XG4gICAgaWYgKHN1cHByZXNzTmV4dENsaWNrKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0luc2lkZUFubm90YXRpb24oZXZlbnQpKSByZXR1cm47XG4gICAgaWYgKCFwaW5jaEVuZ2FnZWQoZXZlbnQuYWx0S2V5KSkgcmV0dXJuO1xuICAgIGlmIChpc1BpbmNoZ3JhYk93blVpKGV2ZW50KSkgcmV0dXJuO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgcmF3ID0gZXZlbnQudGFyZ2V0O1xuICAgIGlmICghKHJhdyBpbnN0YW5jZW9mIEVsZW1lbnQpKSByZXR1cm47XG4gICAgLy8gU25hcCBjbGlja3MgdGhlIHNhbWUgd2F5IGhvdmVyIGRvZXMgc28gdGhlIGNhcHR1cmVkIGVsZW1lbnQgbWF0Y2hlc1xuICAgIC8vIGV4YWN0bHkgd2hhdCB0aGUgb3JhbmdlIHJpbmcgd2FzIGFyb3VuZCB3aGVuIHRoZSB1c2VyIGNsaWNrZWQuXG4gICAgY29uc3QgZWwgPSBob3ZlclNuYXAgPyBzbmFwVG9Db21wb25lbnQocmF3LCBrbm93bkNhcHR1cmVkKSA6IHJhdztcbiAgICBpZiAoaXNIdWdlRWxlbWVudChlbCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NraXBwaW5nIGh1Z2UgY2xpY2sgdGFyZ2V0OicsIGNvbXBhY3RUYXJnZXQoZWwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICBzdGFnZVBlbmRpbmcoZWwsIHtjbGllbnRYOiBldmVudC5jbGllbnRYLCBjbGllbnRZOiBldmVudC5jbGllbnRZfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBuZXh0U2VxKCksIHtcbiAgICAgIGNsaWNrQXQ6IHtjbGllbnRYOiBldmVudC5jbGllbnRYLCBjbGllbnRZOiBldmVudC5jbGllbnRZfSxcbiAgICB9KTtcbiAgICBmbGFzaEVsZW1lbnQoZWwpO1xuICAgIGNvbnN0IHBhZ2UgPSBidWlsZFBhZ2VDb250ZXh0KCk7XG4gICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2V9KTtcbiAgICB0ZXN0Q2FwdHVyZXM/LnB1c2goe2VudHJ5LCBwYWdlfSk7XG4gIH07XG5cbiAgLy8gQmluZCBvbiBib3RoIHdpbmRvdyBhbmQgZG9jdW1lbnQuIFNvbWUgcGFnZXMgY2FsbCBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cbiAgLy8gb24gdGhlaXIgb3duIGRvY3VtZW50LWxldmVsIGNhcHR1cmUgaGFuZGxlciDigJQgbGlzdGVuaW5nIG9uIHdpbmRvdyBwaWNrcyB1cFxuICAvLyB0aG9zZSBldmVudHMgZmlyc3QuIEEgMW1zIHRpbWVzdGFtcCBkZWR1cGUgcHJldmVudHMgZG91YmxlLWhhbmRsaW5nLlxuICBmb3IgKGNvbnN0IHRhcmdldCBvZiBbd2luZG93LCBkb2N1bWVudF0pIHtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICB9XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCAoZSkgPT4ge1xuICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpIGxhc3RDb250ZXh0RWwgPSBlLnRhcmdldDtcbiAgfSwgdHJ1ZSk7XG5cbiAgLy8gS2V5Ym9hcmQgbGlzdGVuZXJzIChwYWdlLWZvY3VzZWQgY2FzZSkuIE5hbWVkIHNvIGRlc3Ryb3koKSBjYW4gcmVtb3ZlXG4gIC8vIHRoZW0g4oCUIHRoZSBvcnBoYW4tdGFrZW92ZXIgcGF0aCBtdXN0IGxlYXZlIHplcm8gbGlzdGVuZXJzIGJlaGluZC5cbiAgY29uc3Qgb25LZXlEb3duQWx0ID0gKGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIW9ycGhhbkd1YXJkKCkpIHJldHVybjtcbiAgICAvLyBFc2MgbGVhdmVzIHN0aWNreSBwaW5jaCBtb2RlICh3aGVuIG5vIGNvbW1lbnQgYm94IGlzIGNhcHR1cmluZyBFc2MpLlxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgbWFudWFsU2VsZWN0ICYmIGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ICE9PSAnYmxvY2snKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzZXRTZWxlY3RNb2RlKGZhbHNlLCAvKiBub3RpZnlQYW5lbCAqLyB0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGUuYWx0S2V5KSB7XG4gICAgICBzZXRBbHRBY3RpdmUodHJ1ZSk7XG4gICAgICAvLyBQcmUtZW1wdCB0aGUgYnJvd3NlcidzIEFsdCDihpIgbWVudS1iYXIgZm9jdXMgc2hpZnQgb24gV2luZG93cy4gSWYgd2VcbiAgICAgIC8vIGRvbid0IHByZXZlbnREZWZhdWx0IGhlcmUsIHRoZSBrZXl1cCB0aGF0IGZvbGxvd3Mgd2lsbCBzdGVhbCBmb2N1c1xuICAgICAgLy8gZnJvbSBvdXIgb3ZlcmxheSB0ZXh0YXJlYS5cbiAgICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgJiYgYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25LZXlVcEFsdCA9IChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFvcnBoYW5HdWFyZCgpKSByZXR1cm47XG4gICAgaWYgKGUua2V5ID09PSAnQWx0JyB8fCAhZS5hbHRLZXkpIHtcbiAgICAgIC8vIFNhbWUgQWx0LeKGki1tZW51IHN1cHByZXNzaW9uIG9uIHJlbGVhc2U6IENocm9tZSAvIEVkZ2Ugb24gV2luZG93c1xuICAgICAgLy8gc2hpZnQgZm9jdXMgdG8gdGhlIG1lbnUgYmFyIHdoZW4gQWx0IGlzIHJlbGVhc2VkIHdpdGhvdXQgYW5vdGhlclxuICAgICAgLy8ga2V5IGludGVydmVuaW5nLiBCbG9jayBpdCBzbyBvdXIgdGV4dGFyZWEga2VlcHMgZm9jdXMuXG4gICAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGFsdEZvcndhcmRlZCA9IGZhbHNlO1xuICAgICAgLy8gU3RpY2t5IHBpbmNoIG1vZGUga2VlcHMgdGhlIHJpbmcgZW5nYWdlZCBhZnRlciBBbHQgaXMgcmVsZWFzZWQuXG4gICAgICBpZiAoIW1hbnVhbFNlbGVjdCkgc2V0QWx0QWN0aXZlKGZhbHNlKTtcbiAgICAgIC8vIE5vIGF1dG8tY29tbWl0IHRpbWVyIOKAlCB0aGUgdXNlciBleHBsaWNpdGx5IGNsaWNrcyBcIkNvbW1pdCBncm91cFwiXG4gICAgICAvLyBpbiB0aGUgc2lkZS1wYW5lbCBwZW5kaW5nIGJheSAob3IgRXNjIHRvIGNhbmNlbCkuXG4gICAgfVxuICB9O1xuICBjb25zdCBvbldpbmRvd0JsdXIgPSAoKTogdm9pZCA9PiB7XG4gICAgYWx0Rm9yd2FyZGVkID0gZmFsc2U7XG4gICAgLy8gU3RpY2t5IHBpbmNoIG1vZGUgc3Vydml2ZXMgYSBibHVyIChjbGlja2luZyBpbnRvIHRoZSBzaWRlIHBhbmVsKSDigJRcbiAgICAvLyBvdGhlcndpc2Ugc3dpdGNoaW5nIHRvIHRoZSBwYW5lbCB3b3VsZCBzaWxlbnRseSBkaXNlbmdhZ2UgaXQuXG4gICAgaWYgKCFtYW51YWxTZWxlY3QpIHNldEFsdEFjdGl2ZShmYWxzZSk7XG4gICAgLy8gTm90ZTogZG9uJ3QgY2FuY2VsIHBlbmRpbmdNdWx0aSDigJQgY2xpY2tpbmcgdGhlIHNpZGUtcGFuZWwgY29tbWl0IGJ1dHRvblxuICAgIC8vIGJsdXJzIHRoZSBob3N0IHBhZ2UgYW5kIHdlJ2QgbG9zZSB0aGUgc3RhZ2luZyBzdGF0ZSByaWdodCBiZWZvcmUgY29tbWl0LlxuICB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bkFsdCwgdHJ1ZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXBBbHQsIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uV2luZG93Qmx1ciwgdHJ1ZSk7XG5cbiAgLy8g4pSA4pSA4pSAIFNpZGUtcGFuZWwgY29tbWFuZHMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNhZmVRdWVyeSA9IChzZWw6IHN0cmluZyB8IHVuZGVmaW5lZCk6IEVsZW1lbnQgfCBudWxsID0+IHtcbiAgICB0cnkgeyByZXR1cm4gc2VsID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpIDogbnVsbDsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ29tbWFuZCA9IChtc2c6IFBnRW52ZWxvcGU8UGFuZWxUb0NzPiwgcmVzcG9uZDogKHI6IGFueSkgPT4gdm9pZCk6IGJvb2xlYW4gPT4ge1xuICAgIHN3aXRjaCAobXNnLmtpbmQpIHtcbiAgICAgIGNhc2UgJ291dGxpbmUnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmIChlbCkgdHJhY2tFbGVtZW50KCdmcm9tLXBhbmVsJywgZWwsIHtsYWJlbDogY29tcGFjdFRhcmdldChlbCksIGdvbGQ6IG1zZy5nb2xkLCBkYXNoZWQ6IG1zZy5kYXNoZWR9KTtcbiAgICAgICAgZWxzZSByZW1vdmVSaW5nKCdmcm9tLXBhbmVsJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ291dGxpbmUtY2xlYXInOlxuICAgICAgICByZW1vdmVSaW5nKCdmcm9tLXBhbmVsJyk7XG4gICAgICAgIHJlbW92ZVJpbmcoJ211bHRpJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ291dGxpbmUtbXVsdGknOiB7XG4gICAgICAgIHJlbW92ZVJpbmcoJ211bHRpJyk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBzZWwgb2YgbXNnLnNlbGVjdG9ycykge1xuICAgICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KHNlbCk7XG4gICAgICAgICAgaWYgKGVsKSB0cmFja0VsZW1lbnQoYG11bHRpOiR7aSsrfWAsIGVsLCB7Z29sZDogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ291dGxpbmUtbXVsdGktY2xlYXInOiB7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBbLi4ucmluZ3Mua2V5cygpXSkgaWYgKGsuc3RhcnRzV2l0aCgnbXVsdGk6JykpIHJlbW92ZVJpbmcoayk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3Njcm9sbC10byc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyBgbmVhcmVzdGAgaXMgZGVsaWJlcmF0ZTogaG92ZXJpbmcgYSBjb21tZW50IG11c3QgTk9UIHlhbmsgYW5cbiAgICAgICAgLy8gYWxyZWFkeS12aXNpYmxlIGVsZW1lbnQgdG8gc2NyZWVuIGNlbnRlciAodGhlIGphcnJpbmcgc2Nyb2xsIHRoZVxuICAgICAgICAvLyBvcGVyYXRvciBmbGFnZ2VkKS4gSXQgb25seSBzY3JvbGxzIHdoZW4gdGhlIGVsZW1lbnQgaXMgb2ZmLXNjcmVlbi5cbiAgICAgICAgLy8gVGhlIGxvdWQgXCJmaW5kIHRoaXNcIiBwYXRocyAobG9jYXRlLWZsYXNoLCBsb2ctZWxlbWVudCkga2VlcCBjZW50ZXIuXG4gICAgICAgIGVsLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnbmVhcmVzdCcsIGlubGluZTogJ25lYXJlc3QnfSk7XG4gICAgICAgIGlmIChtc2cuc3RpY2t5KSB0cmFja0VsZW1lbnQoJ3N0aWNreScsIGVsLCB7bGFiZWw6IGNvbXBhY3RUYXJnZXQoZWwpLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIGVsc2UgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnbG9jYXRlLWZsYXNoJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWVsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGxvY2F0ZUZsYXNoKGVsKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnc3RpY2t5LWNsZWFyJzpcbiAgICAgICAgcmVtb3ZlUmluZygnc3RpY2t5Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ3ZhbGlkYXRlJzoge1xuICAgICAgICBjb25zdCB2YWxpZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBzZWwgb2YgbXNnLnNlbGVjdG9ycykge1xuICAgICAgICAgIHRyeSB7IHZhbGlkW3NlbF0gPSBCb29sZWFuKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKSk7IH0gY2F0Y2ggeyB2YWxpZFtzZWxdID0gZmFsc2U7IH1cbiAgICAgICAgfVxuICAgICAgICByZXNwb25kKHt2YWxpZH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2xvZy1lbGVtZW50Jzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWVsKSB7IHJlc3BvbmQoe29rOiBmYWxzZX0pOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICB0cnkgeyBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGluY2hncmFiLWlkJywgU3RyaW5nKG1zZy5uID8/ICcnKSk7IH0gY2F0Y2ggeyAvKiBzYW5kYm94ICovIH1cbiAgICAgICAgY29uc29sZS5sb2coJyVjW1BpbmNoR3JhYl0gZWxlbWVudDonLCAnY29sb3I6I2ZmNWYwMDtmb250LXdlaWdodDo3MDA7JywgZWwsXG4gICAgICAgICAgYFxcbiAg4oCiIFJpZ2h0LWNsaWNrIOKGkiBSZXZlYWwgaW4gRWxlbWVudHMgcGFuZWxcXG4gIOKAoiBPciBpbiBEZXZUb29scyBjb25zb2xlOiAkKCdbZGF0YS1waW5jaGdyYWItaWQ9XCIke21zZy5uID8/ICcnfVwiXScpYCk7XG4gICAgICAgIGVsLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJ30pO1xuICAgICAgICBmbGFzaEVsZW1lbnQoZWwpO1xuICAgICAgICByZXNwb25kKHtvazogdHJ1ZSwgc25pcHBldDogYCQoJyR7bXNnLnNlbGVjdG9yfScpYH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3JlY2FwdHVyZSc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbCkgeyByZXNwb25kKHtvazogZmFsc2UsIHJlYXNvbjogJ25vdC1mb3VuZCd9KTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkoZWwsIG1zZy5uID8/IG5leHRTZXEoKSk7XG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlLCBlbnRyeSwgcGFnZTogYnVpbGRQYWdlQ29udGV4dCgpfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY2FzZSAnY2FwdHVyZS1hbmNlc3Rvcic6IHtcbiAgICAgICAgLy8gV2FsayB1cCBgZGVwdGhgIGFuY2VzdG9yIGxldmVscyBmcm9tIHRoZSBvcmlnaW5hbCBzZWxlY3RvciBhbmRcbiAgICAgICAgLy8gY2FwdHVyZSB0aGF0IGVsZW1lbnQuIFVzZWQgYnkgdGhlIGFuY2VzdG9yLWJyZWFkY3J1bWIgY2hpcHMgaW5cbiAgICAgICAgLy8gdGhlIHNpZGUtcGFuZWwgYnViYmxlIHNvIHRoZSB1c2VyIGNhbiBlc2NhbGF0ZSBcIkkgbWVhbnQgdGhlIGNhcmQsXG4gICAgICAgIC8vIG5vdCB0aGUgaDMgaW5zaWRlIGl0XCIgd2l0aG91dCByZS1jbGlja2luZyBvbiB0aGUgcGFnZS5cbiAgICAgICAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFjdXIpIHsgcmVzcG9uZCh7b2s6IGZhbHNlLCByZWFzb246ICdub3QtZm91bmQnfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNnLmRlcHRoICYmIGN1ciAmJiBjdXIucGFyZW50RWxlbWVudCAmJiBjdXIgIT09IGRvY3VtZW50LmJvZHk7IGkrKykge1xuICAgICAgICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICghY3VyIHx8IGlzSHVnZUVsZW1lbnQoY3VyKSkgeyByZXNwb25kKHtvazogZmFsc2UsIHJlYXNvbjogJ3Rvby1sYXJnZSd9KTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkoY3VyLCBuZXh0U2VxKCkpO1xuICAgICAgICBmbGFzaEVsZW1lbnQoY3VyKTtcbiAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgICByZXNwb25kKHtvazogdHJ1ZSwgZW50cnl9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdvdXRsaW5lLWFuY2VzdG9yJzoge1xuICAgICAgICAvLyBQcmV2aWV3IHRoZSBOdGggYW5jZXN0b3Ig4oCUIHNhbWUgd2FsayBhcyBjYXB0dXJlLWFuY2VzdG9yIGJ1dFxuICAgICAgICAvLyBvdXRsaW5lcyB0aGUgcmVzdWx0IHdpdGggdGhlIGV4aXN0aW5nIGdvbGQtcmluZyB0cmFja2VyIGluc3RlYWRcbiAgICAgICAgLy8gb2YgY2FwdHVyaW5nLiBTaWRlIHBhbmVsIGNhbGxzIHRoaXMgb24gaG92ZXIgb2YgYSBicmVhZGNydW1iIGNoaXAuXG4gICAgICAgIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghY3VyKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNnLmRlcHRoICYmIGN1ciAmJiBjdXIucGFyZW50RWxlbWVudCAmJiBjdXIgIT09IGRvY3VtZW50LmJvZHk7IGkrKykge1xuICAgICAgICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICghY3VyIHx8IGlzSHVnZUVsZW1lbnQoY3VyKSkge1xuICAgICAgICAgIHJlbW92ZVJpbmcoJ2Zyb20tcGFuZWwnKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdHJhY2tFbGVtZW50KCdmcm9tLXBhbmVsJywgY3VyLCB7bGFiZWw6IGNvbXBhY3RUYXJnZXQoY3VyKSwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdhbHQtc3RhdGUnOlxuICAgICAgICBhbHRGb3J3YXJkZWQgPSBtc2cub247XG4gICAgICAgIHNldEFsdEFjdGl2ZShtc2cub24pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdzZWxlY3QtbW9kZSc6XG4gICAgICAgIHNldFNlbGVjdE1vZGUobXNnLm9uKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnbWFudWFsLWNhcHR1cmUnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghZWwpIHsgcmVzcG9uZCh7b2s6IGZhbHNlLCByZWFzb246ICdub3QtZm91bmQnfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBtc2cubiA/PyBuZXh0U2VxKCkpO1xuICAgICAgICBmbGFzaEVsZW1lbnQoZWwpO1xuICAgICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZTogYnVpbGRQYWdlQ29udGV4dCgpfSk7XG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlLCBlbnRyeX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Fubm90YXRpb24nOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmIChlbCkgYW5ub3RhdGlvbi5zaG93KGVsLCB7Li4uKG1zZy5wYXlsb2FkID8/IHt9KSwgc2VsZWN0b3I6IG1zZy5zZWxlY3Rvcn0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdhbm5vdGF0aW9uLWNsZWFyJzpcbiAgICAgICAgYW5ub3RhdGlvbi5oaWRlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ3BlbmRpbmctY2FuY2VsJzpcbiAgICAgICAgY2FuY2VsUGVuZGluZ011bHRpKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ3BlbmRpbmctY29tbWl0JzpcbiAgICAgICAgY29tbWl0UGVuZGluZ011bHRpKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ2NvbnRleHQtY2FwdHVyZSc6IHtcbiAgICAgICAgaWYgKGxhc3RDb250ZXh0RWwpIHtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShsYXN0Q29udGV4dEVsLCBuZXh0U2VxKCkpO1xuICAgICAgICAgIGZsYXNoRWxlbWVudChsYXN0Q29udGV4dEVsKTtcbiAgICAgICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZTogYnVpbGRQYWdlQ29udGV4dCgpfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2V0LWNhcHR1cmVkJzpcbiAgICAgICAga25vd25DYXB0dXJlZCA9IG5ldyBTZXQobXNnLnNlbGVjdG9ycyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ3BhZ2UtaHRtbCc6XG4gICAgICAgIC8vIFNlcmlhbGl6ZWQgb24gZGVtYW5kIGF0IGV4cG9ydCB0aW1lOyBub3RoaW5nIGNhY2hlZCBwYWdlLXNpZGUuXG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlLCB1cmw6IGxvY2F0aW9uLmhyZWYsIHRpdGxlOiBkb2N1bWVudC50aXRsZSwgaHRtbDogJzwhRE9DVFlQRSBodG1sPlxcbicgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnc2V0LWNzLXByZWZzJzpcbiAgICAgICAgaWYgKHR5cGVvZiBtc2cuc3BhY2luZ092ZXJsYXkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHNwYWNpbmdPdmVybGF5ID0gbXNnLnNwYWNpbmdPdmVybGF5O1xuICAgICAgICAgIGlmICghc3BhY2luZ092ZXJsYXkpIGNsZWFyU3BhY2luZ092ZXJsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG1zZy5ob3ZlclNuYXAgPT09ICdib29sZWFuJykgaG92ZXJTbmFwID0gbXNnLmhvdmVyU25hcDtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnaGlkZS1vdmVybGF5cyc6IHtcbiAgICAgICAgLy8gVGhlIHVzZXIncyBjb21wbGFpbnQ6IFBpbmNoR3JhYiByaW5ncy9ib3JkZXJzIHdlcmUgc3RpbGwgdmlzaWJsZVxuICAgICAgICAvLyBpbiB0aGUgY2FwdHVyZWQgUE5HLiBSb290IGNhdXNlOiB0aGUgbWVzc2FnZSBoYW5kbGVyIHVzZWQgdG9cbiAgICAgICAgLy8gYWNrIHN5bmNocm9ub3VzbHkgdGhlIG1vbWVudCB3ZSBzZXQgYHZpc2liaWxpdHk6IGhpZGRlbmAsIGJ1dFxuICAgICAgICAvLyB0aGUgYnJvd3NlcidzIGNvbXBvc2l0b3IgaGFkbid0IHlldCBwYWludGVkIHRoYXQgZnJhbWUsIHNvXG4gICAgICAgIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVkIGFnYWluc3QgYSBzdGlsbC1jb21wb3NpdGVkIG92ZXJsYXkuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEZpeDogc3dpdGNoIHRvIGBkaXNwbGF5OiBub25lYCAocmlwcyBpdCBvdXQgb2YgbGF5b3V0IGVudGlyZWx5XG4gICAgICAgIC8vIOKAlCBzdHJvbmdlciBndWFyYW50ZWUgdGhhbiB2aXNpYmlsaXR5OmhpZGRlbiksIGZvcmNlIGEgbGF5b3V0XG4gICAgICAgIC8vIGZsdXNoLCBhbmQgd2FpdCBmb3IgVFdPIGFuaW1hdGlvbiBmcmFtZXMgYmVmb3JlIGFja2luZy4gVHdvXG4gICAgICAgIC8vIFJBRnMgaXMgdGhlIHN0YW5kYXJkIFwibmV4dCBwYWludCBoYXMgaGFwcGVuZWRcIiBzaWduYWwgaW5cbiAgICAgICAgLy8gYnJvd3NlcnMuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEl0ZW0gMTcgKGZsYXNoaW5nKTogYWxzbyBGUkVFWkUgdGhlIHJpbmcgckFGIGxvb3BzIGZvciB0aGUgd2hvbGVcbiAgICAgICAgLy8gY2FwdHVyZSB3aW5kb3cuIFRoZSBiYWNrZ3JvdW5kIGhpZGVzIG92ZXJsYXlzIEJFRk9SRSBpdCBzY3JvbGxzXG4gICAgICAgIC8vIHRoZSBwYWdlIHRvIGZyYW1lIHRoZSBjYXB0dXJlOyBpZiB0aGUgbG9vcHMga2VwdCBydW5uaW5nIHRoZXknZFxuICAgICAgICAvLyBjaGFzZSB0aGUgc2Nyb2xsIG9mZnNldCAoYSB2aXNpYmxlIGp1bXApIGFuZCByZXBhaW50IGEgYnVyc3Qgd2hlblxuICAgICAgICAvLyB0aGUgaG9zdCBpcyBzaG93biBhZ2Fpbi4gRnJvemVuICsgZGlzcGxheTpub25lID0gdGhlIHJpbmdzIGhvbGRcbiAgICAgICAgLy8gdGhlaXIgbGFzdCBmcmFtZSBhbmQgdGhlcmUgaXMgbm90aGluZyB0byBmbGlja2VyLiBUaGUgYW5ub3RhdGlvblxuICAgICAgICAvLyBib3ggZnJlZXplcyBpbXBsaWNpdGx5IChpdHMgYW5jaG9yIHdhdGNoZG9nIG9ubHkgcmVwb3NpdGlvbnMsIGFuZFxuICAgICAgICAvLyB0aGUgaG9zdCBpcyBoaWRkZW4pLCBzbyBubyBleHRyYSBoYW5kbGluZyBpcyBuZWVkZWQgdGhlcmUuXG4gICAgICAgIG92ZXJsYXlGcm96ZW4gPSB0cnVlO1xuICAgICAgICBmcmVlemVSaW5ncygpO1xuICAgICAgICBvdmVybGF5SG9zdC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAvLyBGb3JjZSBsYXlvdXQgZmx1c2ggc28gdGhlIGNoYW5nZSB0YWtlcyBlZmZlY3QuXG4gICAgICAgIHZvaWQgb3ZlcmxheUhvc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlc3BvbmQoe29rOiB0cnVlfSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdzaG93LW92ZXJsYXlzJzoge1xuICAgICAgICBvdmVybGF5SG9zdC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgIG92ZXJsYXlIb3N0LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIC8vIFJlLWVudGVyIHRoZSB0b3AgbGF5ZXI6IHRoZSBjYXB0dXJlIHdpbmRvdyAob3IgdGhlIHBhZ2UpIG1heSBoYXZlXG4gICAgICAgIC8vIGRpc21pc3NlZCBvdXIgcG9wb3ZlciB3aGlsZSB0aGUgaG9zdCB3YXMgZGlzcGxheTpub25lLlxuICAgICAgICBwcm9tb3RlVG9Ub3BMYXllcigpO1xuICAgICAgICAvLyBUaGF3OiByZS1hcm0gZXZlcnkgcmluZyBsb29wIGluIGEgc2luZ2xlIGJhdGNoIHNvIHRoZXkgc25hcCB0byB0aGVcbiAgICAgICAgLy8gKG5vdyByZXN0b3JlZCkgc2Nyb2xsIHBvc2l0aW9uIG9uIHRoZSBTQU1FIGZyYW1lIOKAlCBvbmUgY2xlYW5cbiAgICAgICAgLy8gcmVwb3NpdGlvbiBpbnN0ZWFkIG9mIGEgc3RhZ2dlcmVkIHJlcGFpbnQgY2FzY2FkZS5cbiAgICAgICAgb3ZlcmxheUZyb3plbiA9IGZhbHNlO1xuICAgICAgICB0aGF3UmluZ3MoKTtcbiAgICAgICAgcmVzcG9uZCh7b2s6IHRydWV9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBJUEMgYnJpZGdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBmdW5jdGlvbiBzZW5kVG9QYW5lbChwYXlsb2FkOiBDc1RvUGFuZWwpOiB2b2lkIHtcbiAgICBjb25zdCBtc2cgPSBwZyhwYXlsb2FkKTtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIHRyeSB7IHZvaWQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobXNnKS5jYXRjaD8uKCgpID0+IHsgLyogaWdub3JlICovIH0pOyB9XG4gICAgICBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdHJ5IHsgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tcGFuZWwnLCB7ZGV0YWlsOiBtc2d9KSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH1cbiAgICAvLyBJdGVtIDE4OiB0aGUgZmlyc3QgY2FwdHVyZSBvbiBhIGdpdmVuIHBhZ2UgVVJMIHRyaWdnZXJzIGEgb25lLXRpbWVcbiAgICAvLyBmdWxsLXBhZ2Ugc25hcHNob3QgKHNjcmVlbnNob3QgKyBtZXRhZGF0YSkgcm91dGVkIHRvIHRoZSBwYW5lbC4gRGVkdXBcbiAgICAvLyBpcyBieSBVUkwgaW5zaWRlIG1heWJlU25hcHNob3RQYWdlLlxuICAgIGlmIChwYXlsb2FkLmtpbmQgPT09ICdjYXB0dXJlJykgdm9pZCBtYXliZVNuYXBzaG90UGFnZShwYXlsb2FkLnBhZ2UudXJsKTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBQYWdlLXNuYXBzaG90IChpdGVtIDE4KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUm91bmQtdHJpcCByZXF1ZXN0IHRvIHRoZSBiYWNrZ3JvdW5kIHdvcmtlciAod2hpY2ggb3ducyBjYXB0dXJlVmlzaWJsZVRhYikuXG4gIC8vIFJlc29sdmVzIHRvIHRoZSByZXBseSBvYmplY3QsIG9yIG51bGwgb24gYW55IGZhaWx1cmUgLyBub24tZXh0ZW5zaW9uIG1vZGUuXG4gIGNvbnN0IHJlcXVlc3RCZyA9IDxSPihwYXlsb2FkOiB7a2luZDogc3RyaW5nfSAmIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogUHJvbWlzZTxSIHwgbnVsbD4gPT5cbiAgICBuZXcgUHJvbWlzZTxSIHwgbnVsbD4oKHJlc29sdmUpID0+IHtcbiAgICAgIGlmICghaW5FeHRlbnNpb24pIHsgcmVzb2x2ZShudWxsKTsgcmV0dXJuOyB9XG4gICAgICB0cnkge1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShwZyhwYXlsb2FkIGFzIGFueSksIChyZXBseTogUikgPT4ge1xuICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHsgcmVzb2x2ZShudWxsKTsgcmV0dXJuOyB9XG4gICAgICAgICAgcmVzb2x2ZSgocmVwbHkgPz8gbnVsbCkgYXMgUiB8IG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggeyByZXNvbHZlKG51bGwpOyB9XG4gICAgfSk7XG5cbiAgLy8gRGVkdXAgc2V0OiBhdCBtb3N0IG9uZSBwYWdlLXNuYXBzaG90IHBlciBkaXN0aW5jdCBVUkwgcGVyIHBhZ2Ugc2Vzc2lvbi5cbiAgY29uc3Qgc25hcHNob3R0ZWRVcmxzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGxldCBzbmFwc2hvdEluRmxpZ2h0ID0gZmFsc2U7XG4gIGNvbnN0IG1heWJlU25hcHNob3RQYWdlID0gYXN5bmMgKHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuOyAgICAgICAgICAgIC8vIHZpZXdwb3J0IGNhcHR1cmUgbmVlZHMgdGhlIHdvcmtlclxuICAgIGlmIChzbmFwc2hvdHRlZFVybHMuaGFzKHVybCkpIHJldHVybjtcbiAgICBpZiAoc25hcHNob3RJbkZsaWdodCkgcmV0dXJuOyAgICAgICAgLy8gc2VyaWFsaXplOyB0aGUgbmV4dCBjYXB0dXJlIHJldHJpZXNcbiAgICBzbmFwc2hvdHRlZFVybHMuYWRkKHVybCk7ICAgICAgICAgICAgLy8gb3B0aW1pc3RpYyDigJQgYXZvaWRzIGEgZHVwbGljYXRlIGJ1cnN0XG4gICAgc25hcHNob3RJbkZsaWdodCA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIC8vIE1ldGFkYXRhIGlzIHJlYWQgb24gdGhlIHBhZ2Ugc2lkZSAodGhlIHdvcmtlciBjYW4ndCBzZWUgdGhlIERPTSkuXG4gICAgICAvLyBjYXB0dXJlZEF0IGlzIHN0YW1wZWQgYmVmb3JlIHRoZSAoc2xvd2VyKSBzY3JlZW5zaG90IHJlcXVlc3Qgc28gaXRcbiAgICAgIC8vIHJlZmxlY3RzIHdoZW4gdGhlIHNuYXBzaG90IHdhcyBpbml0aWF0ZWQuXG4gICAgICBjb25zdCBjYXB0dXJlZEF0ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgY29uc3QgbWV0YSA9IHtcbiAgICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXG4gICAgICAgIHZpZXdwb3J0OiB7d2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLCBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodH0sXG4gICAgICAgIHNjcm9sbFdpZHRoOiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGgsIGRvY3VtZW50LmJvZHk/LnNjcm9sbFdpZHRoID8/IDApLFxuICAgICAgICBzY3JvbGxIZWlnaHQ6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmJvZHk/LnNjcm9sbEhlaWdodCA/PyAwKSxcbiAgICAgICAgZGV2aWNlUGl4ZWxSYXRpbzogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgICAgbGFuZzogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICcnLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgcmVxdWVzdEJnPFBhZ2VTbmFwc2hvdFJlcGx5Pih7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCd9KTtcbiAgICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5zY3JlZW5zaG90KSB7XG4gICAgICAgIC8vIENhcHR1cmUgZmFpbGVkIOKAlCBkcm9wIHRoZSBkZWR1cCBlbnRyeSBzbyBhIGxhdGVyIGNhcHR1cmUgb24gdGhpc1xuICAgICAgICAvLyBVUkwgY2FuIHJldHJ5IHJhdGhlciB0aGFuIHBlcm1hbmVudGx5IHNraXBwaW5nIHRoZSBzbmFwc2hvdC5cbiAgICAgICAgc25hcHNob3R0ZWRVcmxzLmRlbGV0ZSh1cmwpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzbmFwc2hvdDogUGFnZVNuYXBzaG90ID0ge1xuICAgICAgICAuLi5tZXRhLFxuICAgICAgICBjYXB0dXJlZEF0LFxuICAgICAgICBzY3JlZW5zaG90OiByZXBseS5zY3JlZW5zaG90LFxuICAgICAgICAuLi4ocmVwbHkucGFydGlhbCA/IHtwYXJ0aWFsOiB0cnVlfSA6IHt9KSxcbiAgICAgIH07XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3BhZ2Utc25hcHNob3QnLCBwYXlsb2FkOiBzbmFwc2hvdH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc25hcHNob3R0ZWRVcmxzLmRlbGV0ZSh1cmwpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzbmFwc2hvdEluRmxpZ2h0ID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGlmIChpbkV4dGVuc2lvbikge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnOiBhbnksIF9zZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKG1zZyAmJiBtc2cuX19wZyA9PT0gdHJ1ZSkgcmV0dXJuIGhhbmRsZUNvbW1hbmQobXNnIGFzIFBnRW52ZWxvcGU8UGFuZWxUb0NzPiwgc2VuZFJlc3BvbnNlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOnRvLWNzJywgKGU6IEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBtc2cgPSAoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsO1xuICAgICAgY29uc3QgcmVxSWQgPSBtc2c/Ll9fcmVxSWQ7XG4gICAgICBsZXQgcmVzcG9uZGVkID0gZmFsc2U7XG4gICAgICBjb25zdCByZXNwb25kID0gKHJlcGx5OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChyZXNwb25kZWQpIHJldHVybjtcbiAgICAgICAgcmVzcG9uZGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHJlcUlkKSB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIHtkZXRhaWw6IHtfX3JlcUlkOiByZXFJZCwgcmVwbHl9fSkpO1xuICAgICAgfTtcbiAgICAgIGhhbmRsZUNvbW1hbmQobXNnLCByZXNwb25kKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBSZWNlbnQtVGFiIHRyYWNrZXIgKGZvciBhY3RpdmVGb2N1cy5yZWNlbnRseVRhYmJlZCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFRoZSBwYWdlLWNvbnRleHQgYWN0aXZlRm9jdXMgZmllbGQgZmxhZ3MgZm9jdXMgYXMgXCJrZXlib2FyZC1kcml2ZW5cIlxuICAvLyB3aGVuIHRoZSB1c2VyIHByZXNzZWQgVGFiIC8gU2hpZnQrVGFiIGluIHRoZSBsYXN0IHNlY29uZC4gVXNlZnVsIGZvclxuICAvLyBhMTF5IGJ1ZyBjYXB0dXJlcyB3aGVyZSB0aGUgdmlzdWFsIGlzc3VlIG9ubHkgc2hvd3MgdXAgd2hpbGVcbiAgLy8gdGFiYmluZywgbm90IG9uIGNsaWNrLiBXZSBjYXB0dXJlIGluIHRoZSBjYXB0dXJlIHBoYXNlIHNvIGEgcGFnZSdzXG4gIC8vIG93biBrZXlkb3duIGhhbmRsZXIgY2FuJ3Qgc3VwcHJlc3MgdXMuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ1RhYicpIG5vdGVUYWJQcmVzc2VkKCk7XG4gIH0sIHRydWUpO1xuXG4gIC8vIOKUgOKUgOKUgCBQcmVmZXJlbmNlLWNoYW5nZSBsaXN0ZW5lciAoZGFyay1tb2RlIHRvZ2dsZSwgbW90aW9uIHByZWYpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCcm93c2VycyBlbWl0IGBjaGFuZ2VgIGV2ZW50cyBvbiBhIE1lZGlhUXVlcnlMaXN0IHdoZW4gdGhlIE9TIC8gcGFnZVxuICAvLyBzZXR0aW5nIGZsaXBzLiBXZSBmb3J3YXJkIHRvIHRoZSBwYW5lbCBzbyB0aGUgZXhwb3J0J3MgY2hyb25vbG9neVxuICAvLyBjYXB0dXJlcyB0aGUgbW9tZW50IHRoZSB1c2VyIHN3aXRjaGVkIG1vZGVzIOKAlCB3aXRob3V0IGl0LCBjYXB0dXJlc1xuICAvLyBiZWZvcmUgYW5kIGFmdGVyIHRoZSBmbGlwIG1peCBhcHBlYXJhbmNlIHZhbHVlcyB3aXRoIG5vIHNpZ25hbCBhcyB0b1xuICAvLyB3aGljaCBtb2RlIHdhcyBhY3RpdmUuXG4gIGNvbnN0IHdpcmVQcmVmZXJlbmNlTGlzdGVuZXJzID0gKCk6IHZvaWQgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjcyA9IG1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKTtcbiAgICAgIGNvbnN0IG1vdGlvbiA9IG1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJyk7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IChyZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJyk6IHZvaWQgPT4ge1xuICAgICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJywgcmVhc29uLCBwYWdlOiBidWlsZFBhZ2VDb250ZXh0KCl9KTtcbiAgICAgIH07XG4gICAgICBjcy5hZGRFdmVudExpc3RlbmVyPy4oJ2NoYW5nZScsICgpID0+IG9uQ2hhbmdlKCdjb2xvci1zY2hlbWUnKSk7XG4gICAgICBtb3Rpb24uYWRkRXZlbnRMaXN0ZW5lcj8uKCdjaGFuZ2UnLCAoKSA9PiBvbkNoYW5nZSgncmVkdWNlZC1tb3Rpb24nKSk7XG4gICAgfSBjYXRjaCB7IC8qIG9sZCBicm93c2VyIC8gbWF0Y2hNZWRpYSB1bmF2YWlsYWJsZSAqLyB9XG4gIH07XG4gIHdpcmVQcmVmZXJlbmNlTGlzdGVuZXJzKCk7XG5cbiAgLy8g4pSA4pSA4pSAIERPTS1tdXRhdGlvbiByaW5nIGJ1ZmZlciBmb3IgY2FwdHVyZSByZXBybyBjb250ZXh0ICjCpzQuOCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFBhZ2VzIHdpdGggYWN0aXZlIGFuaW1hdGlvbi9wb2xsaW5nIGNhbiBjaHVybiB0aHJvdWdoIGh1bmRyZWRzIG9mXG4gIC8vIG11dGF0aW9ucyBwZXIgc2Vjb25kOyB3ZSBjYXAgbWVtb3J5IGF0IE1VVEFUSU9OX0JVRkZFUl9DQVAgcmVjb3Jkc1xuICAvLyBhbmQgb25seSByZXR1cm4gbXV0YXRpb25zIHdpdGhpbiB0aGUgbGFzdCBNVVRBVElPTl9XSU5ET1dfTVMgdG9cbiAgLy8gY2FwdHVyZUVudHJ5LiBjb21wYWN0VGFyZ2V0IGlzIGNoZWFwZXIgdGhhbiBjc3NQYXRoLCB1c2VkIGhlcmUgdG9cbiAgLy8gYXZvaWQgcXVhZHJhdGljIGNvc3Qgb24gbGFyZ2UgRE9Ncy5cbiAgY29uc3QgTVVUQVRJT05fQlVGRkVSX0NBUCA9IDUwO1xuICBjb25zdCBNVVRBVElPTl9XSU5ET1dfTVMgPSA4XzAwMDtcbiAgY29uc3QgU0VDUkVUX0FUVFJfTkFNRV9SRSA9IC8ocGFzc3dvcmR8dG9rZW58c2VjcmV0fGFwaVtfLV0/a2V5fGNzcmZ8eHNyZnxzZXNzaW9ufG5vbmNlKS9pO1xuICBjb25zdCBtdXRhdGlvbkJ1ZmZlcjogRG9tTXV0YXRpb25bXSA9IFtdO1xuICBjb25zdCB0cnVuY2F0ZSA9IChzOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBtYXggPSAxMjApOiBzdHJpbmcgPT5cbiAgICBTdHJpbmcocyA/PyAnJykuc2xpY2UoMCwgbWF4KTtcblxuICBjb25zdCBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKHJlY29yZHMpID0+IHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgZm9yIChjb25zdCByIG9mIHJlY29yZHMpIHtcbiAgICAgIC8vIFNraXAgbXV0YXRpb25zIGluc2lkZSBvdXIgb3duIG92ZXJsYXkg4oCUIGV2ZXJ5IHJpbmcgcmVwYWludCBpcyBhXG4gICAgICAvLyBtdXRhdGlvbiBhbmQgd2UnZCBmbG9vZCB0aGUgYnVmZmVyIHdpdGggc2VsZi1ub2lzZS5cbiAgICAgIGNvbnN0IHROb2RlID0gci50YXJnZXQ7XG4gICAgICBpZiAodE5vZGUgaW5zdGFuY2VvZiBOb2RlICYmIChvdmVybGF5SG9zdCA9PT0gdE5vZGUgfHwgb3ZlcmxheUhvc3QuY29udGFpbnModE5vZGUpKSkgY29udGludWU7XG4gICAgICBjb25zdCB0RWw6IEVsZW1lbnQgfCBudWxsID0gdE5vZGUgaW5zdGFuY2VvZiBFbGVtZW50XG4gICAgICAgID8gdE5vZGVcbiAgICAgICAgOiAodE5vZGUucGFyZW50RWxlbWVudCA/PyBudWxsKTtcbiAgICAgIGNvbnN0IHRhcmdldERlc2MgPSB0RWwgPyBjb21wYWN0VGFyZ2V0KHRFbCkgOiB0Tm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGVudHJ5OiBEb21NdXRhdGlvbjtcbiAgICAgIGlmIChyLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIGNvbnN0IGFkZGVkID0gci5hZGRlZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmVtb3ZlZCA9IHIucmVtb3ZlZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgbGV0IHN1bW1hcnkgPSBgJHt0YXJnZXREZXNjfTpgO1xuICAgICAgICBpZiAoYWRkZWQgPiAwKSB7XG4gICAgICAgICAgY29uc3QgZmlyc3QgPSByLmFkZGVkTm9kZXNbMF07XG4gICAgICAgICAgc3VtbWFyeSArPSBgICske2FkZGVkfSAke2ZpcnN0IGluc3RhbmNlb2YgRWxlbWVudCA/IGNvbXBhY3RUYXJnZXQoZmlyc3QpIDogJ3RleHQnfWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbW92ZWQgPiAwKSB7XG4gICAgICAgICAgY29uc3QgZmlyc3QgPSByLnJlbW92ZWROb2Rlc1swXTtcbiAgICAgICAgICBzdW1tYXJ5ICs9IGAgLSR7cmVtb3ZlZH0gJHtmaXJzdCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBjb21wYWN0VGFyZ2V0KGZpcnN0KSA6ICd0ZXh0J31gO1xuICAgICAgICB9XG4gICAgICAgIGVudHJ5ID0ge3R5cGU6ICdjaGlsZExpc3QnLCB0czogbm93LCB0YXJnZXQ6IHRhcmdldERlc2MsIGFkZGVkLCByZW1vdmVkLCBzdW1tYXJ5OiB0cnVuY2F0ZShzdW1tYXJ5LCAyMDApfTtcbiAgICAgIH0gZWxzZSBpZiAoci50eXBlID09PSAnYXR0cmlidXRlcycpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHIuYXR0cmlidXRlTmFtZSA/PyAnJztcbiAgICAgICAgY29uc3QgaXNTZWNyZXQgPSBTRUNSRVRfQVRUUl9OQU1FX1JFLnRlc3QobmFtZSk7XG4gICAgICAgIGNvbnN0IG5ld1ZhbFJhdyA9ICh0RWwgPyB0RWwuZ2V0QXR0cmlidXRlKG5hbWUpIDogbnVsbCkgPz8gJyc7XG4gICAgICAgIGNvbnN0IG9sZFZhbFJhdyA9IHIub2xkVmFsdWUgPz8gbnVsbDtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBpc1NlY3JldCA/ICdbcmVkYWN0ZWRdJyA6IChvbGRWYWxSYXcgPT09IG51bGwgPyB1bmRlZmluZWQgOiB0cnVuY2F0ZShvbGRWYWxSYXcpKTtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBpc1NlY3JldCA/ICdbcmVkYWN0ZWRdJyA6IHRydW5jYXRlKG5ld1ZhbFJhdyk7XG4gICAgICAgIGVudHJ5ID0ge1xuICAgICAgICAgIHR5cGU6ICdhdHRyaWJ1dGVzJywgdHM6IG5vdywgdGFyZ2V0OiB0YXJnZXREZXNjLCBhdHRyaWJ1dGVOYW1lOiBuYW1lLFxuICAgICAgICAgIG9sZFZhbHVlLCBuZXdWYWx1ZSxcbiAgICAgICAgICBzdW1tYXJ5OiB0cnVuY2F0ZShgJHt0YXJnZXREZXNjfVske25hbWV9XTogJHtvbGRWYWx1ZSA/PyAn4oiFJ30g4oaSICR7bmV3VmFsdWV9YCwgMjAwKSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNoYXJhY3RlckRhdGFcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSByLm9sZFZhbHVlID8/IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB0Tm9kZS5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICAgIGVudHJ5ID0ge1xuICAgICAgICAgIHR5cGU6ICdjaGFyYWN0ZXJEYXRhJywgdHM6IG5vdywgdGFyZ2V0OiB0YXJnZXREZXNjLFxuICAgICAgICAgIG9sZFZhbHVlOiBvbGRWYWx1ZSAhPT0gdW5kZWZpbmVkID8gdHJ1bmNhdGUob2xkVmFsdWUpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIG5ld1ZhbHVlOiB0cnVuY2F0ZShuZXdWYWx1ZSksXG4gICAgICAgICAgc3VtbWFyeTogdHJ1bmNhdGUoYCR7dGFyZ2V0RGVzY30gdGV4dDogJHt0cnVuY2F0ZShvbGRWYWx1ZSwgMzApfSDihpIgJHt0cnVuY2F0ZShuZXdWYWx1ZSwgMzApfWAsIDIwMCksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBtdXRhdGlvbkJ1ZmZlci5wdXNoKGVudHJ5KTtcbiAgICAgIGlmIChtdXRhdGlvbkJ1ZmZlci5sZW5ndGggPiBNVVRBVElPTl9CVUZGRVJfQ0FQKSBtdXRhdGlvbkJ1ZmZlci5zaGlmdCgpO1xuICAgIH1cbiAgfSk7XG4gIHRyeSB7XG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLFxuICAgICAgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLCBjaGFyYWN0ZXJEYXRhT2xkVmFsdWU6IHRydWUsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ011dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZSBmYWlsZWQnLCBlKTsgfVxuXG4gIC8vIEhhbmQgY2FwdHVyZUVudHJ5IGEgZ2V0dGVyIHNvIGl0IGNhbiByZWFkIHRoZSBidWZmZXIgd2l0aG91dFxuICAvLyBpbXBvcnRpbmcgY29udGVudC1zY3JpcHQtb25seSBzdGF0ZS5cbiAgc2V0TXV0YXRpb25CdWZmZXJHZXR0ZXIoKCkgPT4ge1xuICAgIGNvbnN0IGN1dG9mZiA9IERhdGUubm93KCkgLSBNVVRBVElPTl9XSU5ET1dfTVM7XG4gICAgcmV0dXJuIG11dGF0aW9uQnVmZmVyLmZpbHRlcigobSkgPT4gRGF0ZS5wYXJzZShtLnRzKSA+PSBjdXRvZmYpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgVGVzdC9zdGFuZGFsb25lIEFQSSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgYXBpOiBQaW5jaGdyYWJBcGkgPSB7XG4gICAgY2FwdHVyZUVudHJ5LFxuICAgIGJ1aWxkUGFnZUNvbnRleHQsXG4gICAgY2FwdHVyZXM6IHRlc3RDYXB0dXJlcyxcbiAgICBmbGFzaEVsZW1lbnQ6IChzZWw6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgICBpZiAoZWwpIGZsYXNoRWxlbWVudChlbCk7XG4gICAgfSxcbiAgICBzZXRBbHQ6IChvbjogYm9vbGVhbikgPT4geyBzZXRBbHRBY3RpdmUob24pOyB9LFxuICAgIG5leHRTZXEsXG4gICAgaGFuZGxlQ29tbWFuZCxcbiAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICBkZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgW3dpbmRvdywgZG9jdW1lbnRdKSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duQWx0LCB0cnVlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXBBbHQsIHRydWUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbldpbmRvd0JsdXIsIHRydWUpO1xuICAgICAgY2xlYXJSaW5ncygpO1xuICAgICAgdHJ5IHsgaWYgKG92ZXJsYXlIb3N0Lm1hdGNoZXMoJzpwb3BvdmVyLW9wZW4nKSkgb3ZlcmxheUhvc3QuaGlkZVBvcG92ZXIoKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICBvdmVybGF5SG9zdC5yZW1vdmUoKTtcbiAgICAgIGRlbGV0ZSB3aW5kb3dbS0VZXTtcbiAgICB9LFxuICB9O1xuICB3aW5kb3dbS0VZXSA9IGFwaTtcbiAgd2luZG93Ll9fcGluY2hncmFiID0gYXBpO1xuICAvLyBTdWNjZXNzb3IgdGFrZW92ZXI6IHdoZW4gYSBmcmVzaCBjb3B5IG9mIHRoaXMgc2NyaXB0IGluamVjdHMgKGV4dGVuc2lvblxuICAvLyByZWxvYWQpLCBpdCBmaXJlcyB0aGlzIGV2ZW50IGZyb20gaXRzIG93biBpc29sYXRlZCB3b3JsZCDigJQgdGVhciBkb3duIHNvXG4gIC8vIGV4YWN0bHkgb25lIGxpdmUgY29weSBvd25zIHRoZSBwYWdlLlxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdfX3BpbmNoZ3JhYi10YWtlb3ZlcicsICgpID0+IHtcbiAgICB0cnkgeyBhcGkuZGVzdHJveSgpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgfSwge29uY2U6IHRydWV9KTtcbiAgY29uc29sZS5sb2coTE9HLCAncmVhZHknLCB7aW5FeHRlbnNpb259KTtcbn1cblxuLy8g4pSA4pSA4pSAIEFubm90YXRpb24gb3ZlcmxheSAoc3RpY2t5IGNvbW1lbnQgYm94KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbnR5cGUgQW5ub3RhdGlvbkRlcHMgPSB7XG4gIHNlbmRUb1BhbmVsOiAobTogQ3NUb1BhbmVsKSA9PiB2b2lkO1xuICBjYXB0dXJlQW5kQ29tbWVudDogKGVsOiBFbGVtZW50LCB0ZXh0OiBzdHJpbmcpID0+IEVudHJ5O1xuICAvLyBDYWxsZWQgd2hlbiB0aGUgYm94IGhpZGVzIOKAlCB1c2VkIHRvIHRlYXIgZG93biB0aGUgbWF0Y2hpbmcgaG92ZXIgcmluZ1xuICAvLyBzbyByaW5nICsgYm94IHN0YXkgY291cGxlZC5cbiAgb25IaWRlOiAoKSA9PiB2b2lkO1xuICAvLyBDYWxsZWQgd2hlbiB0aGUgYm94IGFwcGVhcnMgb3IgbW92ZXMgdG8gYSBuZXcgZWxlbWVudCDigJQgdXNlZCB0b1xuICAvLyAocmUtKXBhaW50IHRoZSBob3ZlciByaW5nIG9uIHRoYXQgZWxlbWVudC4gQ292ZXJzIHRoZSByYWNlIHdoZXJlIGFsdFxuICAvLyB3YXMgcmVsZWFzZWQgYmVmb3JlIHRoZSBhbm5vdGF0aW9uIG1lc3NhZ2Ugcm91bmQtdHJpcHBlZCBiYWNrLlxuICBvblNob3c6IChlbDogRWxlbWVudCkgPT4gdm9pZDtcbn07XG50eXBlIEFubm90YXRpb25BcGkgPSB7XG4gIHNob3c6IChlbDogRWxlbWVudCwgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsKSA9PiB2b2lkO1xuICBoaWRlOiAoKSA9PiB2b2lkO1xuICBpc0xvY2tlZDogKCkgPT4gYm9vbGVhbjtcbiAgZm9jdXNUZXh0YXJlYTogKCkgPT4gdm9pZDtcbiAgLy8gckFGIHdhdGNoZG9nIHRoYXQga2VlcHMgdGhlIGJveCBwaW5uZWQgdG8gaXRzIGFuY2hvciBhbmQgdGVhcnMgaXQgZG93blxuICAvLyB3aGVuIHRoZSBhbmNob3IgbGVhdmVzIHRoZSBET00uIEludGVybmFsIGxpZmVjeWNsZSBob29rczsgdGhlIHB1YmxpY1xuICAvLyBzdXJmYWNlIChzaG93L2hpZGUpIGRyaXZlcyB0aGVtLCBidXQgdGhleSdyZSBleHBvc2VkIGZvciB0aGUgZGVzdHJveSgpXG4gIC8vIHRlYXJkb3duIHBhdGguXG4gIHN0YXJ0V2F0Y2hkb2c6ICgpID0+IHZvaWQ7XG4gIHN0b3BXYXRjaGRvZzogKCkgPT4gdm9pZDtcbn07XG5cbmZ1bmN0aW9uIHNldHVwQW5ub3RhdGlvbihlbDogSFRNTERpdkVsZW1lbnQsIHtzZW5kVG9QYW5lbCwgY2FwdHVyZUFuZENvbW1lbnQsIG9uSGlkZSwgb25TaG93fTogQW5ub3RhdGlvbkRlcHMpOiBBbm5vdGF0aW9uQXBpIHtcbiAgbGV0IHNlbGVjdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgLy8gQWN0aXZlIGNhcHR1cmUncyBzdGFibGUgdWlkICh3aGVuIHBheWxvYWQuY2FwdHVyZWQgKyB1aWQpLiBVc2VkIGJ5XG4gIC8vIHN1Ym1pdCgpIHNvIHRoZSBjb21tZW50IHJvdXRlcyB0byB0aGUgU1BFQ0lGSUMgY2FwdHVyZSByYXRoZXIgdGhhblxuICAvLyB0byBhbnkgc2VsZWN0b3IgbWF0Y2gg4oCUIHByZXZlbnRzIGNyb3NzLXBhZ2UgLyBjcm9zcy1zaWJsaW5nXG4gIC8vIGNvbnRhbWluYXRpb24uXG4gIGxldCBhY3RpdmVVaWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgbG9ja2VkVG86IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxvY2tlZCA9IGZhbHNlO1xuICBsZXQgdGV4dGFyZWE6IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGZlZWRiYWNrTGlzdDogSFRNTFVMaXN0RWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIEJ1aWxkZXJzIHdpdGggaW5saW5lIHN0eWxlcyAoQ1NQLXNhZmU7IG5vIGlubGluZSA8c3R5bGU+IG9yIGNsYXNzIENTUykuXG4gIGNvbnN0IHN0eWxlZCA9IDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KHRhZzogc3RyaW5nLCBzdHlsZXM6IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj4pOiBUID0+IHtcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpIGFzIFQ7XG4gICAgT2JqZWN0LmFzc2lnbihub2RlLnN0eWxlLCBzdHlsZXMpO1xuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIGNvbnN0IGJ1aWxkQm9keSA9IChwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCk6IHZvaWQgPT4ge1xuICAgIGVsLnJlcGxhY2VDaGlsZHJlbigpO1xuICAgIGNvbnN0IGNhcHR1cmVkID0gQm9vbGVhbihwYXlsb2FkLmNhcHR1cmVkKTtcbiAgICAvLyBIZWFkZXIg4oCUIG9ubHkgd2hlbiBjYXB0dXJlZC4gSnVzdCBhIHRpbnkgb3JhbmdlIGAjTmAgY2hpcDsgbm9cbiAgICAvLyBcIlBpbmNoR3JhYlwiIG9yIFwiQ2FwdHVyZSArIGNvbW1lbnRcIiBsYWJlbHMuXG4gICAgaWYgKGNhcHR1cmVkKSB7XG4gICAgICBjb25zdCBoZWFkZXIgPSBzdHlsZWQ8SFRNTERpdkVsZW1lbnQ+KCdkaXYnLCB7XG4gICAgICAgIGNvbG9yOiAnI2ZmNWYwMCcsIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBmb250OiBcIjcwMCAxM3B4LzEgJ0JyaWNvbGFnZSBHcm90ZXNxdWUnLCdPdXRmaXQnLHVpLW1vbm9zcGFjZSxtb25vc3BhY2VcIixcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnNHB4JyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDJlbScsXG4gICAgICB9KTtcbiAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IGAjJHtwYXlsb2FkLm4gPz8gJz8nfWA7XG4gICAgICBlbC5hcHBlbmQoaGVhZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gc3R5bGVkPEhUTUxVTGlzdEVsZW1lbnQ+KCd1bCcsIHtcbiAgICAgIG1hcmdpbjogJzAgMCA2cHggMCcsIHBhZGRpbmc6ICcwIDAgMCAxNnB4JywgbGlzdFN0eWxlOiAnZGlzYycsXG4gICAgfSk7XG4gICAgZmVlZGJhY2tMaXN0ID0gbGlzdDtcbiAgICBpZiAocGF5bG9hZC5mZWVkYmFjaz8ubGVuZ3RoKSB7XG4gICAgICAvLyBBdHRhY2ggdGhlIGxpc3QgQkVGT1JFIGFwcGVuZGluZyBpdGVtczogYXBwZW5kRmVlZGJhY2sncyBsYXp5XG4gICAgICAvLyBpbnNlcnRCZWZvcmUobGlzdCwgYWRkUm93KSBvdGhlcndpc2UgZGVyZWZlcmVuY2VzIGBhZGRSb3dgIHdoaWxlIHRoZVxuICAgICAgLy8gY29uc3QgaXMgc3RpbGwgaW4gaXRzIHRlbXBvcmFsIGRlYWQgem9uZSAoZGVjbGFyZWQgYmVsb3cpLCB0aHJvd2luZ1xuICAgICAgLy8gUmVmZXJlbmNlRXJyb3IgYW5kIGtpbGxpbmcgdGhlIGJveCBmb3IgYW55IGNhcHR1cmUgdGhhdCBhbHJlYWR5IGhhc1xuICAgICAgLy8gY29tbWVudHMuIFdpdGggYSBwYXJlbnQgc2V0LCB0aGF0IGJyYW5jaCBuZXZlciBydW5zIGR1cmluZyBidWlsZC5cbiAgICAgIGVsLmFwcGVuZChsaXN0KTtcbiAgICAgIGZvciAoY29uc3QgdCBvZiBwYXlsb2FkLmZlZWRiYWNrKSBhcHBlbmRGZWVkYmFjayh0KTtcbiAgICB9XG4gICAgLy8gKE5vIFwiTm8gY29tbWVudHMgeWV0LlwiIGZpbGxlciDigJQgZW1wdHkgbGlzdCA9IG5vIGxpc3Qgc2hvd24uKVxuXG4gICAgY29uc3QgYWRkUm93ID0gc3R5bGVkPEhUTUxEaXZFbGVtZW50PignZGl2Jywge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICc2cHgnLCBhbGlnbkl0ZW1zOiAnc3RyZXRjaCcsXG4gICAgICBtYXJnaW5Ub3A6ICc0cHgnLCBwYWRkaW5nVG9wOiAnNnB4JyxcbiAgICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCByZ2JhKDI1NSw5NSwwLC4yKScsXG4gICAgfSk7XG4gICAgY29uc3QgdGEgPSBzdHlsZWQ8SFRNTFRleHRBcmVhRWxlbWVudD4oJ3RleHRhcmVhJywge1xuICAgICAgZmxleDogJzEnLCBtaW5IZWlnaHQ6ICcyOHB4JywgbWF4SGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgcmVzaXplOiAnbm9uZScsXG4gICAgICBiYWNrZ3JvdW5kOiAncmdiYSgwLDAsMCwuMzUpJywgY29sb3I6ICcjZmNmYWY1JyxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDI1NSw5NSwwLC4zKScsXG4gICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgICAgcGFkZGluZzogJzRweCA2cHgnLFxuICAgICAgZm9udDogXCIxMnB4LzEuNCB1aS1tb25vc3BhY2UsJ0pldEJyYWlucyBNb25vJyxNZW5sbyxtb25vc3BhY2VcIixcbiAgICAgIG91dGxpbmU6ICcwJyxcbiAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIH0pO1xuICAgIHRhLnBsYWNlaG9sZGVyID0gY2FwdHVyZWQgPyAnQ29tbWVudOKApicgOiAnQ29tbWVudCB0byBjYXB0dXJl4oCmJztcbiAgICB0YS5yb3dzID0gMjtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHsgdGEuc3R5bGUuYm9yZGVyQ29sb3IgPSAnI2ZmNWYwMCc7IH0pO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB7IHRhLnN0eWxlLmJvcmRlckNvbG9yID0gJ3JnYmEoMjU1LDk1LDAsLjMpJzsgfSk7XG4gICAgdGV4dGFyZWEgPSB0YTtcbiAgICAvLyBTZW5kIGJ1dHRvbiDigJQgbXVzdCBNQVRDSCB0aGUgc2lkZSBwYW5lbCdzIG1haW4gY29tcG9zZXIgU2VuZCBidXR0b25cbiAgICAvLyAoc3JjL3NpZGVwYW5lbC5odG1sIGAuY29tcG9zZXIgLnNlbmRgICsgc3JjL3NpZGVwYW5lbC5jc3MpLiBUaGF0IGJ1dHRvblxuICAgIC8vIGlzIHRoZSBgbWVzc2FnZS1zcXVhcmUtcGx1c2AgbHVjaWRlIGljb24gKyBhIHNob3J0IHRleHQgbGFiZWwgb24gdGhlXG4gICAgLy8gb3Jhbmdl4oaSb3JhbmdlLTIgcHJpbWFyeSBncmFkaWVudC4gV2UgcmVidWlsZCBpdCBoZXJlIHdpdGggaW5saW5lIHN0eWxlc1xuICAgIC8vIChDU1Atc2FmZTsgbm8gc2hhcmVkIHN0eWxlc2hlZXQgYWNyb3NzIHRoZSB0d28gZG9jdW1lbnRzKSBzbyBpdCByZWFkcyBhc1xuICAgIC8vIHRoZSBzYW1lIGNvbnRyb2wgZXZlbiB0aG91Z2ggaXQgbGl2ZXMgaW4gdGhlIHBhZ2UncyBzaGFkb3cgcm9vdC5cbiAgICBjb25zdCBzZW5kQnRuID0gc3R5bGVkPEhUTUxCdXR0b25FbGVtZW50PignYnV0dG9uJywge1xuICAgICAgZmxleDogJzAgMCBhdXRvJyxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICBnYXA6ICc0cHgnLFxuICAgICAgcGFkZGluZzogJzAgMTBweCcsXG4gICAgICAvLyBNYXRjaCB0aGUgdGV4dGFyZWEgbWluLWhlaWdodCBzbyB0aGUgYnV0dG9uIGRvZXNuJ3QgZHJhZyB3aGVuIHRoZVxuICAgICAgLy8gdGV4dGFyZWEgZ3Jvd3MgKG1pcnJvcnMgYC5jb21wb3NlciAuc2VuZCB7IGhlaWdodDogMzZweCB9YCwgc2NhbGVkIHRvXG4gICAgICAvLyB0aGUgbW9yZSBjb21wYWN0IG9uLXBhZ2UgYm94KS5cbiAgICAgIGhlaWdodDogJzI4cHgnLFxuICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxODBkZWcsICNmZjVmMDAgMCUsICNlZjRiMDAgMTAwJSknLFxuICAgICAgY29sb3I6ICcjZmZmJywgYm9yZGVyOiAnMCcsIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICBmb250OiBcIjcwMCAxMXB4LzEgJ0JyaWNvbGFnZSBHcm90ZXNxdWUnLCdPdXRmaXQnLHN5c3RlbS11aSxzYW5zLXNlcmlmXCIsXG4gICAgICBsZXR0ZXJTcGFjaW5nOiAnLjAxZW0nLFxuICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgIGJveFNoYWRvdzogJzAgMCAyNHB4IHJnYmEoMjU1LDk1LDAsLjI1KScsXG4gICAgfSk7XG4gICAgY29uc3Qgc2VuZEljb24gPSBzdHlsZWQ8SFRNTFNwYW5FbGVtZW50Pignc3BhbicsIHtcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGxpbmVIZWlnaHQ6ICcwJyxcbiAgICB9KTtcbiAgICBzZW5kSWNvbi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAxNik7XG4gICAgY29uc3Qgc2VuZExhYmVsID0gc3R5bGVkPEhUTUxTcGFuRWxlbWVudD4oJ3NwYW4nLCB7Zm9udFNpemU6ICcxMHB4J30pO1xuICAgIHNlbmRMYWJlbC50ZXh0Q29udGVudCA9IGNhcHR1cmVkID8gJ0FkZCcgOiAnQ2FwdHVyZSc7XG4gICAgc2VuZEJ0bi5hcHBlbmQoc2VuZEljb24sIHNlbmRMYWJlbCk7XG4gICAgc2VuZEJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBjYXB0dXJlZCA/ICdBZGQgY29tbWVudCcgOiAnQ2FwdHVyZSBhbmQgY29tbWVudCcpO1xuICAgIGFkZFJvdy5hcHBlbmQodGEsIHNlbmRCdG4pO1xuICAgIGVsLmFwcGVuZChhZGRSb3cpO1xuXG4gICAgY29uc3QgaGludCA9IHN0eWxlZDxIVE1MRGl2RWxlbWVudD4oJ2RpdicsIHtcbiAgICAgIGNvbG9yOiAnIzg0N2Q5YScsIGZvbnRTaXplOiAnMTBweCcsIG1hcmdpblRvcDogJzRweCcsXG4gICAgfSk7XG4gICAgaGludC50ZXh0Q29udGVudCA9IGNhcHR1cmVkXG4gICAgICA/ICdFbnRlciB0byBhZGQgwrcgU2hpZnQrRW50ZXIgbmV3bGluZSDCtyBFc2MgdG8gY2xvc2UnXG4gICAgICA6ICdFbnRlciB0byBjYXB0dXJlICYgc2F2ZSDCtyBTaGlmdCtFbnRlciBuZXdsaW5lIMK3IEVzYyB0byBjbG9zZSc7XG4gICAgZWwuYXBwZW5kKGhpbnQpO1xuXG4gICAgZnVuY3Rpb24gYXBwZW5kRmVlZGJhY2sodGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICBjb25zdCBsaSA9IHN0eWxlZDxIVE1MTElFbGVtZW50PignbGknLCB7XG4gICAgICAgIG1hcmdpbjogJzJweCAwJywgY29sb3I6ICcjZmNmYWY1Jywgd29yZEJyZWFrOiAnYnJlYWstd29yZCcsXG4gICAgICB9KTtcbiAgICAgIGxpLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgIGxpc3QuYXBwZW5kKGxpKTtcbiAgICAgIGlmICghbGlzdC5wYXJlbnROb2RlKSBlbC5pbnNlcnRCZWZvcmUobGlzdCwgYWRkUm93KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJtaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGEudmFsdWUudHJpbSgpO1xuICAgICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgICBpZiAoY2FwdHVyZWQgJiYgc2VsZWN0b3IpIHtcbiAgICAgICAgLy8gUm91dGUgYnkgc3RhYmxlIHVpZCArIFVSTCB3aGVuIGF2YWlsYWJsZS4gU2lkZS1wYW5lbCdzXG4gICAgICAgIC8vIG9uRmVlZGJhY2tBZGQgcHJlZmVycyBwYXJlbnRVaWQ7IHNlbGVjdG9yICsgdXJsIGlzIHRoZVxuICAgICAgICAvLyBjb21wb3NpdGUgZmFsbGJhY2suIFRoZSBiYXJlLXNlbGVjdG9yIHBhdGggdGhhdCB1c2VkIHRvXG4gICAgICAgIC8vIHNoaXAgY2F1c2VkIGNyb3NzLXBhZ2UgY29tbWVudCBjb250YW1pbmF0aW9uLlxuICAgICAgICBzZW5kVG9QYW5lbCh7XG4gICAgICAgICAga2luZDogJ2ZlZWRiYWNrLWFkZCcsIHNlbGVjdG9yLCB0ZXh0LFxuICAgICAgICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICAgICAgICAuLi4oYWN0aXZlVWlkID8ge3BhcmVudFVpZDogYWN0aXZlVWlkfSA6IHt9KSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGxvY2tlZFRvKSB7XG4gICAgICAgIC8vIENhcHR1cmUgKyBhdHRhY2ggdGhlIGNvbW1lbnQgaW4gb25lIG1vdGlvbiwgdGhlbiByZWJ1aWxkIHRoZVxuICAgICAgICAvLyBib2R5IHdpdGggY2FwdHVyZWQ9dHJ1ZSBzbyB0aGUgb3JhbmdlICNOIGhlYWRlciBhcHBlYXJzLCBidXR0b25cbiAgICAgICAgLy8gdGV4dCBmbGlwcyB0byBcIkFkZFwiLCBldGMuXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUFuZENvbW1lbnQobG9ja2VkVG8sIHRleHQpO1xuICAgICAgICBwYXlsb2FkLmNhcHR1cmVkID0gdHJ1ZTtcbiAgICAgICAgcGF5bG9hZC51aWQgPSBlbnRyeS51aWQ7XG4gICAgICAgIHBheWxvYWQubiA9IGVudHJ5Lm47XG4gICAgICAgIHBheWxvYWQuc2VsZWN0b3IgPSBlbnRyeS5zZWxlY3RvcjtcbiAgICAgICAgcGF5bG9hZC5mZWVkYmFjayA9IFsuLi4ocGF5bG9hZC5mZWVkYmFjayA/PyBbXSksIHRleHRdO1xuICAgICAgICBzZWxlY3RvciA9IGVudHJ5LnNlbGVjdG9yO1xuICAgICAgICBhY3RpdmVVaWQgPSBlbnRyeS51aWQ7XG4gICAgICAgIGJ1aWxkQm9keShwYXlsb2FkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGEudmFsdWUgPSAnJztcbiAgICAgIHBheWxvYWQuZmVlZGJhY2sgPSBbLi4uKHBheWxvYWQuZmVlZGJhY2sgPz8gW10pLCB0ZXh0XTtcbiAgICAgIGFwcGVuZEZlZWRiYWNrKHRleHQpO1xuICAgIH07XG4gICAgc2VuZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdCk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXQoKTsgfVxuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGhpZGUoKTsgfVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgICAvLyBJZiBhIGZvY3VzIHJlcXVlc3QgY2FtZSBpbiBiZWZvcmUgdGhlIHRleHRhcmVhIGV4aXN0ZWQgKGFsdC1yZWxlYXNlXG4gICAgLy8gcmFjZWQgYWhlYWQgb2YgdGhlIGFubm90YXRpb24gcm91bmQtdHJpcCksIGNsYWltIGl0IG5vdy5cbiAgICBpZiAod2FudHNGb2N1cykge1xuICAgICAgd2FudHNGb2N1cyA9IGZhbHNlO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhLmZvY3VzKHtwcmV2ZW50U2Nyb2xsOiB0cnVlfSkpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBHQVAgPSA4OyAgICAgLy8gZ2FwIGJldHdlZW4gYW5jaG9yIGVkZ2UgYW5kIGJveFxuICBjb25zdCBNQVJHSU4gPSA4OyAgLy8gbWluIGRpc3RhbmNlIGZyb20gYW55IHZpZXdwb3J0IGVkZ2VcblxuICAvLyBEZXRlcm1pbmlzdGljIHBsYWNlbWVudCByZWxhdGl2ZSB0byBgYW5jaG9yYC4gVHdvIHN1YnRsZXRpZXMgdGhlIG9sZFxuICAvLyB2ZXJzaW9uIGdvdCB3cm9uZywgd2hpY2ggcHJvZHVjZWQgdGhlIFwiYm94IGluIGEgcmFuZG9tIHNwb3RcIiByZXBvcnRzOlxuICAvLyAgIDEuIEl0IHJlYWQgYGVsLm9mZnNldEhlaWdodGAgd2hpbGUgdGhlIGJveCB3YXMgc3RpbGwgYGRpc3BsYXk6bm9uZWAsXG4gIC8vICAgICAgc28gaGVpZ2h0IG1lYXN1cmVkIGFzIDAgYW5kIHRoZSBhYm92ZS9iZWxvdyBkZWNpc2lvbiArIHRoZVxuICAvLyAgICAgIE1hdGgubWF4KDgsIOKApikgY2xhbXAgd2VyZSBjb21wdXRlZCBhZ2FpbnN0IGdhcmJhZ2UuXG4gIC8vICAgMi4gSXQgY2xhbXBlZCB0aGUgbGVmdCBlZGdlIHdpdGggYSBoYXJkY29kZWQgMzYwcHggd2lkdGggaW5zdGVhZCBvZlxuICAvLyAgICAgIHRoZSBib3gncyByZWFsIG1lYXN1cmVkIHdpZHRoLCBzbyBhIG5hcnJvd2VyIGJveCAoc2hvcnQgY29tbWVudClcbiAgLy8gICAgICBkcmlmdGVkIGFuZCBhIHdpZGVyIGJveCAobG9uZyBmZWVkYmFjayBsaXN0KSBvdmVyZmxvd2VkLlxuICAvLyBXZSBmb3JjZSB0aGUgYm94IHZpc2libGUgYnV0IHRyYW5zcGFyZW50IGZvciBvbmUgc3luY2hyb25vdXMgbWVhc3VyZSxcbiAgLy8gdGhlbiBwbGFjZSBpdCB1c2luZyBpdHMgcmVhbCByZW5kZXJlZCBzaXplLiBBbGwgbnVtYmVycyBhcmUgY2xhbXBlZCBzb1xuICAvLyB0aGUgd2hvbGUgYm94IGFsd2F5cyBsYW5kcyBpbnNpZGUgdGhlIHZpZXdwb3J0LlxuICBjb25zdCBwb3NpdGlvbiA9IChhbmNob3I6IEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCByID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIC8vIE1lYXN1cmUgdGhlIHJlYWwgYm94IHNpemUuIEl0J3MgYWxyZWFkeSBpbiB0aGUgRE9NIChidWlsZEJvZHkgcmFuKTtcbiAgICAvLyBtYWtpbmcgaXQgYGJsb2NrYCBsZXRzIGdldEJvdW5kaW5nQ2xpZW50UmVjdCByZXBvcnQgdHJ1ZSBkaW1lbnNpb25zLlxuICAgIC8vIHZpc2liaWxpdHk6aGlkZGVuIGtlZXBzIHRoZSBtZWFzdXJlIGludmlzaWJsZSBzbyB0aGVyZSdzIG5vIGZsYXNoIGF0XG4gICAgLy8gYSBwcmUtcGxhY2VtZW50IGxvY2F0aW9uLlxuICAgIGNvbnN0IHByZXZWaXMgPSBlbC5zdHlsZS52aXNpYmlsaXR5O1xuICAgIGVsLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBlbC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgZWwuc3R5bGUudG9wID0gJzBweCc7XG4gICAgY29uc3QgYm94ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgYncgPSBib3gud2lkdGggfHwgMzIwO1xuICAgIGNvbnN0IGJoID0gYm94LmhlaWdodCB8fCAxNjA7XG4gICAgZWwuc3R5bGUudmlzaWJpbGl0eSA9IHByZXZWaXMgfHwgJ3Zpc2libGUnO1xuXG4gICAgLy8gVmVydGljYWw6IHByZWZlciBiZWxvdyB0aGUgYW5jaG9yOyBmbGlwIGFib3ZlIHdoZW4gYmVsb3cgd291bGQgY2xpcFxuICAgIC8vIHRoZSBib3R0b20gZWRnZSBBTkQgdGhlcmUncyBtb3JlIHJvb20gYWJvdmUuXG4gICAgY29uc3Qgcm9vbUJlbG93ID0gd2luZG93LmlubmVySGVpZ2h0IC0gci5ib3R0b20gLSBHQVA7XG4gICAgY29uc3Qgcm9vbUFib3ZlID0gci50b3AgLSBHQVA7XG4gICAgY29uc3QgdXNlQWJvdmUgPSBiaCA+IHJvb21CZWxvdyAmJiByb29tQWJvdmUgPiByb29tQmVsb3c7XG4gICAgbGV0IHRvcCA9IHVzZUFib3ZlID8gci50b3AgLSBHQVAgLSBiaCA6IHIuYm90dG9tICsgR0FQO1xuICAgIHRvcCA9IE1hdGgubWF4KE1BUkdJTiwgTWF0aC5taW4odG9wLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBiaCAtIE1BUkdJTikpO1xuXG4gICAgLy8gSG9yaXpvbnRhbDogbGVmdC1hbGlnbiB0byB0aGUgYW5jaG9yLCB0aGVuIGNsYW1wIHRoZSB3aG9sZSBib3ggaW5zaWRlXG4gICAgLy8gdGhlIHZpZXdwb3J0IHVzaW5nIGl0cyByZWFsIHdpZHRoLlxuICAgIGxldCBsZWZ0ID0gci5sZWZ0O1xuICAgIGxlZnQgPSBNYXRoLm1heChNQVJHSU4sIE1hdGgubWluKGxlZnQsIHdpbmRvdy5pbm5lcldpZHRoIC0gYncgLSBNQVJHSU4pKTtcblxuICAgIGVsLnN0eWxlLmxlZnQgPSBNYXRoLnJvdW5kKGxlZnQpICsgJ3B4JztcbiAgICBlbC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKHRvcCkgKyAncHgnO1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICB9O1xuXG4gIGNvbnN0IGhpZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgc3RvcFdhdGNoZG9nKCk7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgYWN0aXZlVWlkID0gbnVsbDtcbiAgICBsb2NrZWRUbyA9IG51bGw7XG4gICAgbG9ja2VkID0gZmFsc2U7XG4gICAgdGV4dGFyZWEgPSBudWxsO1xuICAgIGZlZWRiYWNrTGlzdCA9IG51bGw7XG4gICAgd2FudHNGb2N1cyA9IGZhbHNlO1xuICAgIGxhc3RBbmNob3JLZXkgPSAnJztcbiAgICBvbkhpZGUoKTtcbiAgfTtcblxuICBjb25zdCBpc1R5cGluZyA9ICgpOiBib29sZWFuID0+IEJvb2xlYW4odGV4dGFyZWEpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRhcmVhO1xuICBjb25zdCBzaG93ID0gKGFuY2hvcjogRWxlbWVudCwgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsKTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYXlsb2FkKSB7XG4gICAgICBpZiAobG9ja2VkIHx8IGlzVHlwaW5nKCkpIHJldHVybjtcbiAgICAgIGhpZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gU2FtZSBjYXB0dXJlIOKAlCBwcmVzZXJ2ZSB0ZXh0YXJlYSBjb250ZW50ICsgZm9jdXMsIGp1c3QgcmVmcmVzaFxuICAgIC8vIHRoZSBmZWVkYmFjayBsaXN0LiBXZSBjb21wYXJlIEJPVEggdWlkIGFuZCBzZWxlY3RvciBzbyBhIHN0YWxlXG4gICAgLy8gcGF5bG9hZCBwb2ludGluZyBhdCBhIGRpZmZlcmVudCBjYXB0dXJlIChzYW1lIHNlbGVjdG9yLCBlLmcuXG4gICAgLy8gYWx0LWhvdmVyaW5nIGEgc2libGluZyB3aXRoIHRoZSBzYW1lIHRlc3RJZCkgdHJpZ2dlcnMgYSBmdWxsXG4gICAgLy8gcmVmcmVzaCBpbnN0ZWFkIG9mIHByZXRlbmRpbmcgbm90aGluZyBjaGFuZ2VkLlxuICAgIGlmIChzZWxlY3RvciA9PT0gcGF5bG9hZC5zZWxlY3RvciAmJiAocGF5bG9hZC51aWQgPz8gbnVsbCkgPT09IGFjdGl2ZVVpZCkge1xuICAgICAgaWYgKHBheWxvYWQuZmVlZGJhY2s/Lmxlbmd0aCAmJiBmZWVkYmFja0xpc3QpIHtcbiAgICAgICAgZmVlZGJhY2tMaXN0LnJlcGxhY2VDaGlsZHJlbigpO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgcGF5bG9hZC5mZWVkYmFjaykge1xuICAgICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICBPYmplY3QuYXNzaWduKGxpLnN0eWxlLCB7bWFyZ2luOiAnMnB4IDAnLCBjb2xvcjogJyNmY2ZhZjUnLCB3b3JkQnJlYWs6ICdicmVhay13b3JkJ30pO1xuICAgICAgICAgIGxpLnRleHRDb250ZW50ID0gdDtcbiAgICAgICAgICBmZWVkYmFja0xpc3QuYXBwZW5kKGxpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBEaWZmZXJlbnQgY2FwdHVyZSDigJQgc3dpdGNoIGZ1bGx5LiBBbHQtaG92ZXIgb25seSBmaXJlcyB3aGlsZSBBbHRcbiAgICAvLyBpcyBoZWxkLCBzbyB0aGlzIG9ubHkgaGFwcGVucyB3aGVuIHRoZSB1c2VyIGRlbGliZXJhdGVseSBtb3ZlcyB0b1xuICAgIC8vIGEgbmV3IHRhcmdldDsgbG9zaW5nIGluLXByb2dyZXNzIHR5cGluZyBpcyB0aGUgZXhwZWN0ZWQgY29zdCBvZlxuICAgIC8vIHN3aXRjaGluZy4gT25jZSBBbHQgaXMgcmVsZWFzZWQsIG1vdXNlbW92ZXMgZG9uJ3QgdHJpZ2dlciBob3ZlclxuICAgIC8vIGV2ZW50cywgc28gdGhlIGJveCBmcmVlemVzIG9uIHRoZSBsYXN0IGVsZW1lbnQgYW5kIHR5cGluZyBpcyBzYWZlLlxuICAgIHNlbGVjdG9yID0gcGF5bG9hZC5zZWxlY3RvciA/PyBudWxsO1xuICAgIGFjdGl2ZVVpZCA9IHBheWxvYWQudWlkID8/IG51bGw7XG4gICAgbG9ja2VkVG8gPSBhbmNob3I7XG4gICAgYnVpbGRCb2R5KHBheWxvYWQpO1xuICAgIHBvc2l0aW9uKGFuY2hvcik7XG4gICAgc3RhcnRXYXRjaGRvZygpO1xuICAgIG9uU2hvdyhhbmNob3IpO1xuICB9O1xuICAvLyBQZW5kaW5nLWZvY3VzIGZsYWc6IGlmIGZvY3VzIGlzIHJlcXVlc3RlZCBiZWZvcmUgdGhlIHRleHRhcmVhIGV4aXN0c1xuICAvLyAoZS5nLiBhbHQgd2FzIHJlbGVhc2VkIGJlZm9yZSB0aGUgYW5ub3RhdGlvbiBtZXNzYWdlIHJvdW5kLXRyaXBwZWRcbiAgLy8gYmFjayksIHdlIHNldCB0aGUgZmxhZyBhbmQgdGhlIGJ1aWxkQm9keSBjb21wbGV0aW9uIHBhdGggcGlja3MgaXQgdXAuXG4gIGxldCB3YW50c0ZvY3VzID0gZmFsc2U7XG4gIGNvbnN0IGRvRm9jdXMgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCF0ZXh0YXJlYSkgcmV0dXJuO1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0ZXh0YXJlYSkgcmV0dXJuO1xuICAgIC8vIERlZmVyIHRvIHRoZSBuZXh0IGZyYW1lIHNvIHdlIGxhbmQgQUZURVIgYW55IGZvY3VzLXN0ZWFsaW5nIGJyb3dzZXJcbiAgICAvLyBiZWhhdmlvdXIgKGUuZy4gQWx0IOKGkiBtZW51LWJhciBvbiBXaW5kb3dzKSBoYXMgc2V0dGxlZC5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKHRleHRhcmVhKSB0ZXh0YXJlYS5mb2N1cyh7cHJldmVudFNjcm9sbDogdHJ1ZX0pO1xuICAgIH0pO1xuICB9O1xuICAvLyBQdWJsaWMgaG9vazogZm9jdXMgdGhlIHRleHRhcmVhIChjYWxsZWQgb24gYWx0LXJlbGVhc2Ugc28gdHlwaW5nIGlzXG4gIC8vIGltbWVkaWF0ZSB3aXRob3V0IHRoZSB1c2VyIGhhdmluZyB0byBtb3VzZSB0byB0aGUgYm94KS5cbiAgY29uc3QgZm9jdXNUZXh0YXJlYSA9ICgpOiB2b2lkID0+IHtcbiAgICB3YW50c0ZvY3VzID0gdHJ1ZTtcbiAgICBkb0ZvY3VzKCk7XG4gIH07XG5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBsb2NrZWQgPSB0cnVlO1xuICAgIGlmICh0ZXh0YXJlYSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0ZXh0YXJlYSkgdGV4dGFyZWEuZm9jdXMoKTtcbiAgfSk7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgaWYgKHRleHRhcmVhICYmICh0ZXh0YXJlYS52YWx1ZS5sZW5ndGggPiAwIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRhcmVhKSkgcmV0dXJuO1xuICAgIGxvY2tlZCA9IGZhbHNlO1xuICB9KTtcblxuICAvLyBUcnVlIHdoZW4gdGhlIGFuY2hvciBoYXMgbGVmdCB0aGUgRE9NIG9yIGNvbGxhcHNlZCB0byBub3RoaW5nIChkaXNwbGF5XG4gIC8vIHRvZ2dsZWQgb2ZmLCByZW1vdmVkLCBkZXRhY2hlZCkuIEEgYm94IGFuY2hvcmVkIHRvIGEgdmFuaXNoZWQgZWxlbWVudCBpc1xuICAvLyB0aGUgXCJ0b29sdGlwIHN0cmFuZGVkIGFmdGVyIGl0cyBhbmNob3IgbGVhdmVzXCIgZmFpbHVyZSDigJQgdGVhciBpdCBkb3duLlxuICBjb25zdCBhbmNob3JJc0dvbmUgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFsb2NrZWRUbykgcmV0dXJuIHRydWU7XG4gICAgaWYgKCFsb2NrZWRUby5pc0Nvbm5lY3RlZCkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgciA9IGxvY2tlZFRvLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiByLndpZHRoID09PSAwICYmIHIuaGVpZ2h0ID09PSAwO1xuICB9O1xuXG4gIGNvbnN0IHJlcG9zaXRpb24gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgIT09ICdibG9jaycpIHJldHVybjtcbiAgICBpZiAoYW5jaG9ySXNHb25lKCkpIHsgaGlkZSgpOyByZXR1cm47IH1cbiAgICBwb3NpdGlvbihsb2NrZWRUbyEpO1xuICB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVwb3NpdGlvbiwgdHJ1ZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXBvc2l0aW9uKTtcblxuICAvLyBBbmNob3Igd2F0Y2hkb2cuIFNjcm9sbC9yZXNpemUgY292ZXIgbW9zdCBtb3ZlbWVudCwgYnV0IGFuIFNQQSB0aGF0XG4gIC8vIHN3YXBzIHRoZSBhbmNob3JlZCBlbGVtZW50IG91dCAocm91dGUgY2hhbmdlLCBsaXN0IHJlLXJlbmRlciwgbW9kYWxcbiAgLy8gY2xvc2UpIGZpcmVzIG5laXRoZXIg4oCUIGxlYXZpbmcgdGhlIGJveCBzdHJhbmRlZCBhdCBhIHN0YWxlIHBvc2l0aW9uLlxuICAvLyBBIHNlbGYtY2FuY2VsbGluZyByQUYgbG9vcCB0aGF0IG9ubHkgcnVucyB3aGlsZSB0aGUgYm94IGlzIHZpc2libGVcbiAgLy8gY2F0Y2hlcyB0aGF0OiBpdCByZXBvc2l0aW9ucyBvbiBsYXlvdXQgZHJpZnQgYW5kIGhpZGVzIHRoZSBtb21lbnQgdGhlXG4gIC8vIGFuY2hvciBpcyBnb25lLiBJdCBzdG9wcyBpdHNlbGYgd2hlbiB0aGUgYm94IGhpZGVzIHNvIHRoZXJlJ3Mgbm9cbiAgLy8gYW1iaWVudCBsb29wIG9uIGV2ZXJ5IHBhZ2UuXG4gIGxldCB3YXRjaGRvZyA9IDA7XG4gIGNvbnN0IHN0b3BXYXRjaGRvZyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAod2F0Y2hkb2cpIHsgY2FuY2VsQW5pbWF0aW9uRnJhbWUod2F0Y2hkb2cpOyB3YXRjaGRvZyA9IDA7IH1cbiAgfTtcbiAgbGV0IGxhc3RBbmNob3JLZXkgPSAnJztcbiAgY29uc3Qgc3RhcnRXYXRjaGRvZyA9ICgpOiB2b2lkID0+IHtcbiAgICBzdG9wV2F0Y2hkb2coKTtcbiAgICBjb25zdCB0aWNrID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgIT09ICdibG9jaycpIHsgd2F0Y2hkb2cgPSAwOyByZXR1cm47IH1cbiAgICAgIGlmIChhbmNob3JJc0dvbmUoKSkgeyBoaWRlKCk7IHJldHVybjsgfVxuICAgICAgLy8gUmVwb3NpdGlvbiBvbmx5IHdoZW4gdGhlIGFuY2hvciBhY3R1YWxseSBtb3ZlZCwgc28gd2UgZG9uJ3QgZmlnaHRcbiAgICAgIC8vIHRoZSB1c2VyJ3MgY2FyZXQgLyByZS1tZWFzdXJlIGV2ZXJ5IGZyYW1lLlxuICAgICAgY29uc3QgciA9IGxvY2tlZFRvIS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IGtleSA9IGAke01hdGgucm91bmQoci5sZWZ0KX0sJHtNYXRoLnJvdW5kKHIudG9wKX0sJHtNYXRoLnJvdW5kKHIud2lkdGgpfSwke01hdGgucm91bmQoci5oZWlnaHQpfWA7XG4gICAgICBpZiAoa2V5ICE9PSBsYXN0QW5jaG9yS2V5KSB7IGxhc3RBbmNob3JLZXkgPSBrZXk7IHBvc2l0aW9uKGxvY2tlZFRvISk7IH1cbiAgICAgIHdhdGNoZG9nID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgIH07XG4gICAgd2F0Y2hkb2cgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gIH07XG5cbiAgLy8gRXNjYXBlIGZyb20gYW55d2hlcmUgKG5vdCBqdXN0IHRoZSBmb2N1c2VkIHRleHRhcmVhKSBkaXNtaXNzZXMgdGhlIGJveC5cbiAgLy8gVGhlIHRleHRhcmVhJ3Mgb3duIGtleWRvd24gaGFuZGxlcyBFc2NhcGUgd2hpbGUgZm9jdXNlZDsgdGhpcyBjb3ZlcnMgdGhlXG4gIC8vIGNhc2Ugd2hlcmUgdGhlIGJveCBpcyBsb2NrZWQvb3BlbiBidXQgZm9jdXMgaXMgZWxzZXdoZXJlIG9uIHRoZSBwYWdlLlxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnICYmIGVsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIHsgaGlkZSgpOyB9XG4gIH0sIHRydWUpO1xuXG4gIHJldHVybiB7c2hvdywgaGlkZSwgaXNMb2NrZWQ6ICgpID0+IGxvY2tlZCB8fCBpc1R5cGluZygpLCBmb2N1c1RleHRhcmVhLCBzdGFydFdhdGNoZG9nLCBzdG9wV2F0Y2hkb2d9O1xufVxuXG4vLyAoTm8gc2hhZG93IHN0eWxlc2hlZXQg4oCUIGV2ZXJ5IG92ZXJsYXkgZWxlbWVudCBnZXRzIGl0cyBzdHlsZSBhcHBsaWVkIHZpYVxuLy8gdGhlIEpTIEhUTUxFbGVtZW50LnN0eWxlIEFQSSwgd2hpY2ggQ2hyb21lIGFsbG93cyB1bmRlciBzdHJpY3QgQ1NQLilcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7O0VBVUEsSUFBSSx1QkFBcUQ7QUFBQSxFQUNsRCxJQUFNLDBCQUEwQixDQUFDLE9BQWtDO0FBQUEsSUFDeEUsdUJBQXVCO0FBQUE7QUFBQSxFQUl6QixJQUFNLFdBQVc7QUFBQSxFQUNqQixJQUFNLGNBQWM7QUFBQSxFQUNwQixJQUFNLFdBQVc7QUFBQSxFQUNqQixJQUFNLFlBQVk7RUFJbEIsSUFBTSxZQUFZLE9BQU8sUUFBUSxlQUFlLE9BQU8sSUFBSSxXQUFXO0FBQUEsRUFDL0QsSUFBTSxZQUFZLENBQUMsTUFDeEIsWUFBWSxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLFFBQVEsc0NBQXNDLE1BQU07QUFBQSxFQUVyRixJQUFNLFdBQVcsQ0FBQyxHQUFZLE1BQU0sYUFDekMsT0FBTyxLQUFLLEVBQUUsRUFBRSxXQUFXLFFBQVEsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEdBQUcsR0FBRztBQUFBLEVBRTdELElBQU0sV0FBVyxDQUFJLElBQWEsYUFBbUI7QUFBQSxJQUNuRCxJQUFJO0FBQUEsTUFBRSxPQUFPLEdBQUc7QUFBQSxNQUFLLE1BQU07QUFBQSxNQUFFLE9BQU87QUFBQTtBQUFBO0VBUXRDLElBQU0sT0FBTyxDQUFDLElBQWEsU0FDekIsU0FBUyxHQUFHLGFBQWEsSUFBSSxHQUFHLEdBQUc7QUFBQSxFQUU5QixJQUFNLGdCQUFnQixDQUFDLE9BQXdCO0FBQUEsSUFDcEQsSUFBSSxNQUFNLEdBQUcsUUFBUSxZQUFZO0FBQUEsSUFDakMsSUFBSSxHQUFHO0FBQUEsTUFBSSxPQUFPLE1BQU0sR0FBRztBQUFBLElBQzNCLElBQUksR0FBRyxXQUFXLFFBQVE7QUFBQSxNQUN4QixPQUFPLE1BQU0sTUFBTSxLQUFLLEdBQUcsU0FBUyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHO0FBQUEsSUFDNUQ7QUFBQSxJQUNBLE9BQU8sU0FBUyxLQUFLLEdBQUc7QUFBQTtBQUFBLEVBSTFCLElBQU0sZ0JBQWdCO0FBQUEsRUFDZixJQUFNLGFBQWEsQ0FBQyxPQUN6QixRQUFRLEVBQUUsS0FBSyxDQUFDLGNBQWMsS0FBSyxFQUFHLEtBQUssQ0FBQyxRQUFRLEtBQUssRUFBRyxLQUFLLENBQUMsTUFBTSxLQUFLLEVBQUc7QUFBQSxFQVlsRixJQUFNLG1CQUNKO0FBQUEsRUFFRixJQUFNLGdCQUFnQixDQUFDLElBQWEsTUFBTSxNQUFnQjtBQUFBLElBQ3hELElBQUksQ0FBQyxHQUFHO0FBQUEsTUFBVyxPQUFPLENBQUM7QUFBQSxJQUMzQixNQUFNLE1BQU0sTUFBTSxLQUFLLEdBQUcsU0FBUztBQUFBLElBQ25DLE1BQU0sU0FBUyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEtBQUssQ0FBQyxDQUFDO0FBQUEsSUFDMUQsSUFBSSxPQUFPO0FBQUEsTUFBUSxPQUFPLE9BQU8sTUFBTSxHQUFHLEdBQUc7QUFBQSxJQUM3QyxPQUFPLElBQUksTUFBTSxHQUFHLENBQUM7QUFBQTtBQUFBLEVBR3ZCLElBQU0sV0FBVyxDQUFDLE9BQW1CLFVBQWtCLFdBQTZCO0FBQUEsSUFDbEYsSUFBSTtBQUFBLE1BQ0YsTUFBTSxVQUFVLE1BQU0saUJBQWlCLFFBQVE7QUFBQSxNQUMvQyxPQUFPLFFBQVEsV0FBVyxLQUFLLFFBQVEsT0FBTztBQUFBLE1BQzlDLE1BQU07QUFBQSxNQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsRUFHbkIsSUFBTSxnQkFBZ0IsQ0FBQyxPQUF3QjtBQUFBLElBQzdDLElBQUksSUFBSSxHQUFHLFNBQVMsWUFBWTtBQUFBLElBQ2hDLE1BQU0sSUFBSSxjQUFjLEVBQUU7QUFBQSxJQUMxQixJQUFJLEVBQUU7QUFBQSxNQUFRLEtBQUssTUFBTSxFQUFFLElBQUksU0FBUyxFQUFFLEtBQUssR0FBRztBQUFBLElBQ2xELE9BQU87QUFBQTtBQUFBLEVBZ0JULElBQU0sa0JBQWtCLENBQUMsT0FBaUIsV0FDeEMsU0FBUyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssTUFBTSxNQUFNLEtBQUssS0FBSztBQUFBLEVBRTlELElBQU0sZUFBZSxDQUFDLE9BQWlCLFFBQXVCLFFBQWlCLFVBQTJDO0FBQUEsSUFLeEgsSUFBSSxPQUFPO0FBQUEsSUFDWCxJQUFJLElBQUk7QUFBQSxJQUNSLE9BQU8sSUFBSSxLQUFLLFNBQVMsR0FBRztBQUFBLE1BQzFCLE1BQU0sWUFBWSxDQUFDLEdBQUcsS0FBSyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxNQUFNLElBQUksQ0FBQyxDQUFDO0FBQUEsTUFDNUQsSUFBSSxVQUFVLFdBQVcsR0FBRztBQUFBLFFBQUU7QUFBQSxRQUFLO0FBQUEsTUFBVTtBQUFBLE1BQzdDLElBQUksU0FBUyxPQUFPLGdCQUFnQixXQUFXLE1BQU0sR0FBRyxNQUFNLEdBQUc7QUFBQSxRQUMvRCxPQUFPO0FBQUEsUUFFUCxJQUFJO0FBQUEsTUFDTixFQUFPO0FBQUEsUUFDTDtBQUFBO0FBQUEsSUFFSjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsRUFHRixJQUFNLFVBQVUsQ0FBQyxPQUF3QjtBQUFBLElBQzlDLElBQUksV0FBVyxHQUFHLEVBQUU7QUFBQSxNQUFHLE9BQU8sTUFBTSxVQUFVLEdBQUcsRUFBRTtBQUFBLElBT25ELE1BQU0sV0FBVyxHQUFHLFlBQVk7QUFBQSxJQUNoQyxNQUFNLFdBQWtDLG9CQUFvQixhQUFhLFdBQVc7QUFBQSxJQUNwRixNQUFNLGdCQUFzQixvQkFBb0IsYUFBYSxXQUFXLFNBQVM7QUFBQSxJQUdqRixJQUFJLFdBQTBCO0FBQUEsSUFDOUIsSUFBSSxXQUEyQjtBQUFBLElBQy9CLElBQUksTUFBc0IsR0FBRztBQUFBLElBQzdCLE9BQU8sT0FBTyxRQUFRLGVBQWU7QUFBQSxNQUNuQyxJQUFJLFdBQVcsSUFBSSxFQUFFLEdBQUc7QUFBQSxRQUN0QixXQUFXLE1BQU0sVUFBVSxJQUFJLEVBQUU7QUFBQSxRQUNqQyxXQUFXO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU0sSUFBSTtBQUFBLElBQ1o7QUFBQSxJQUVBLE1BQU0sTUFBTSxjQUFjLEVBQUU7QUFBQSxJQUc1QixJQUFJLFNBQVMsVUFBVSxLQUFLLEVBQUU7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUd4QyxJQUFJLFVBQVU7QUFBQSxNQUNaLE1BQU0sS0FBSyxHQUFHLFlBQVk7QUFBQSxNQUMxQixJQUFJLFNBQVMsVUFBVyxLQUFLLEVBQUUsS0FBSyxTQUFTLFVBQVUsSUFBSSxFQUFFO0FBQUEsUUFBRyxPQUFPO0FBQUEsSUFDekU7QUFBQSxJQWFBLE1BQU0sYUFBYSxDQUFDLFFBQXdCLE1BQU0sSUFBSSxRQUFRLFVBQVUsTUFBTSxJQUFJO0FBQUEsSUFDbEYsTUFBTSxlQUFlLENBQUMsTUFBOEI7QUFBQSxNQUNsRCxNQUFNLFFBQVEsRUFBRSxhQUFhLFlBQVk7QUFBQSxNQUN6QyxJQUFJLFNBQVMsTUFBTSxTQUFTLEtBQUssTUFBTSxTQUFTLElBQUk7QUFBQSxRQUNsRCxPQUFPLGVBQWUsV0FBVyxLQUFLO0FBQUEsTUFDeEM7QUFBQSxNQUNBLE9BQU87QUFBQTtBQUFBLElBR1QsTUFBTSxVQUFVLGFBQWEsRUFBRTtBQUFBLElBQy9CLElBQUksV0FBVyxTQUFTLFVBQVUsU0FBUyxFQUFFO0FBQUEsTUFBRyxPQUFPO0FBQUEsSUFHdkQsSUFBSSxVQUEwQixHQUFHO0FBQUEsSUFDakMsSUFBSSxRQUFRO0FBQUEsSUFDWixPQUFPLFdBQVcsUUFBUSxLQUFLLFlBQVksaUJBQWlCLFlBQVksVUFBVTtBQUFBLE1BQ2hGLE1BQU0sSUFBSSxhQUFhLE9BQU87QUFBQSxNQUM5QixJQUFJLEdBQUc7QUFBQSxRQUNMLE1BQU0sWUFBWSxHQUFHLEtBQUs7QUFBQSxRQUMxQixJQUFJLFNBQVMsVUFBVSxXQUFXLEVBQUU7QUFBQSxVQUFHLE9BQU87QUFBQSxNQUNoRDtBQUFBLE1BQ0EsVUFBVSxRQUFRO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsSUFNQSxNQUFNLG1CQUFtQixDQUFDLE1BQThCO0FBQUEsTUFDdEQsTUFBTSxPQUFPLEVBQUUsYUFBYSxNQUFNO0FBQUEsTUFDbEMsTUFBTSxRQUFRLEVBQUUsYUFBYSxZQUFZO0FBQUEsTUFDekMsSUFBSSxRQUFRLFNBQVMsTUFBTSxTQUFTLElBQUk7QUFBQSxRQUN0QyxPQUFPLFNBQVMsV0FBVyxJQUFJLGlCQUFpQixXQUFXLEtBQUs7QUFBQSxNQUNsRTtBQUFBLE1BQ0EsT0FBTztBQUFBO0FBQUEsSUFFVCxJQUFJLFFBQXdCLEdBQUc7QUFBQSxJQUMvQixRQUFRO0FBQUEsSUFDUixPQUFPLFNBQVMsUUFBUSxLQUFLLFVBQVUsaUJBQWlCLFVBQVUsVUFBVTtBQUFBLE1BQzFFLE1BQU0sSUFBSSxpQkFBaUIsS0FBSztBQUFBLE1BQ2hDLElBQUksR0FBRztBQUFBLFFBQ0wsTUFBTSxZQUFZLEdBQUcsS0FBSztBQUFBLFFBQzFCLElBQUksU0FBUyxVQUFVLFdBQVcsRUFBRTtBQUFBLFVBQUcsT0FBTztBQUFBLE1BQ2hEO0FBQUEsTUFDQSxRQUFRLE1BQU07QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBUUEsSUFBSSxRQUF3QixHQUFHO0FBQUEsSUFDL0IsUUFBUTtBQUFBLElBQ1IsT0FBTyxTQUFTLFFBQVEsS0FBSyxVQUFVLGlCQUFpQixVQUFVLFVBQVU7QUFBQSxNQUMxRSxNQUFNLE1BQU0sY0FBYyxLQUFLO0FBQUEsTUFDL0IsSUFBSSxJQUFJLFFBQVE7QUFBQSxRQUNkLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxTQUFTLFlBQVksS0FBSyxJQUFJLElBQUksU0FBUyxFQUFFLEtBQUssR0FBRztBQUFBLFFBR3BGLE1BQU0sVUFBVSxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUUsS0FBSyxHQUFHO0FBQUEsUUFDakQsSUFBSSxTQUFTLFVBQVUsU0FBUyxLQUFLLEdBQUc7QUFBQSxVQUN0QyxNQUFNLFlBQVksR0FBRyxXQUFXO0FBQUEsVUFDaEMsSUFBSSxTQUFTLFVBQVUsV0FBVyxFQUFFO0FBQUEsWUFBRyxPQUFPO0FBQUEsUUFDaEQ7QUFBQSxRQUNBLElBQUksU0FBUyxVQUFVLGVBQWUsS0FBSyxHQUFHO0FBQUEsVUFDNUMsTUFBTSxZQUFZLEdBQUcsaUJBQWlCO0FBQUEsVUFDdEMsSUFBSSxTQUFTLFVBQVUsV0FBVyxFQUFFO0FBQUEsWUFBRyxPQUFPO0FBQUEsUUFDaEQ7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRLE1BQU07QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBR0EsTUFBTSxRQUFrQixDQUFDO0FBQUEsSUFDekIsTUFBTTtBQUFBLElBQ04sT0FBTyxPQUFPLElBQUksYUFBYSxLQUFLLGdCQUFnQixRQUFRLGVBQWU7QUFBQSxNQUN6RSxJQUFJLFFBQVEsTUFBTSxXQUFXLElBQUksRUFBRTtBQUFBLFFBQUc7QUFBQSxNQUN0QyxJQUFJLElBQUksSUFBSSxTQUFTLFlBQVk7QUFBQSxNQUNqQyxNQUFNLE1BQU0sY0FBYyxHQUFHO0FBQUEsTUFDN0IsSUFBSSxJQUFJO0FBQUEsUUFBUSxLQUFLLE1BQU0sSUFBSSxJQUFJLFNBQVMsRUFBRSxLQUFLLEdBQUc7QUFBQSxNQUN0RCxNQUFNLFNBQXlCLElBQUk7QUFBQSxNQUNuQyxJQUFJLFFBQVE7QUFBQSxRQUNWLE1BQU0sVUFBVSxNQUFNLEtBQUssT0FBTyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsSUFBSSxhQUFhLElBQUssUUFBUTtBQUFBLFFBQzFGLElBQUksUUFBUSxTQUFTO0FBQUEsVUFBRyxLQUFLLGdCQUFnQixRQUFRLFFBQVEsR0FBRyxJQUFJO0FBQUEsTUFDdEU7QUFBQSxNQUNBLE1BQU0sUUFBUSxDQUFDO0FBQUEsTUFDZixNQUFNLElBQUk7QUFBQSxJQUNaO0FBQUEsSUFDQSxJQUFJLENBQUMsTUFBTTtBQUFBLE1BQVEsT0FBTyxHQUFHLFFBQVEsWUFBWTtBQUFBLElBQ2pELE1BQU0sWUFBWSxhQUFhLE9BQU8sVUFBVSxJQUFJLFFBQVE7QUFBQSxJQUM1RCxPQUFPLGdCQUFnQixXQUFXLFFBQVE7QUFBQTtBQUFBLEVBVTVDLElBQU0sa0JBQWtCLElBQUksSUFBSTtBQUFBLElBQzlCO0FBQUEsSUFBUztBQUFBLElBQVU7QUFBQSxJQUFRO0FBQUEsSUFBVztBQUFBLElBQVE7QUFBQSxJQUFZO0FBQUEsSUFDMUQ7QUFBQSxJQUFPO0FBQUEsSUFBUztBQUFBLElBQVE7QUFBQSxJQUFjO0FBQUEsSUFBVTtBQUFBLElBQ2hEO0FBQUEsSUFBaUI7QUFBQSxJQUFZO0FBQUEsSUFBVztBQUFBLElBQVc7QUFBQSxJQUNuRDtBQUFBLElBQVE7QUFBQSxJQUFVO0FBQUEsRUFDcEIsQ0FBQztBQUFBLEVBTUQsSUFBTSxtQkFBbUIsQ0FBQyxNQUFjLFVBQXlDO0FBQUEsSUFDL0UsTUFBTSxRQUFrQixDQUFDO0FBQUEsSUFDekIsV0FBVyxNQUFNLEtBQUssTUFBTSxLQUFLLEVBQUUsT0FBTyxPQUFPLEdBQUc7QUFBQSxNQUNsRCxJQUFJO0FBQUEsUUFDRixNQUFNLE9BQU8sTUFBTSxlQUFlLEVBQUU7QUFBQSxRQUNwQyxJQUFJO0FBQUEsVUFBTSxNQUFNLEtBQUssU0FBUyxLQUFLLGFBQWEsR0FBRyxDQUFDO0FBQUEsUUFDcEQsTUFBTTtBQUFBLElBQ1Y7QUFBQSxJQUNBLE9BQU8sTUFBTSxPQUFPLE9BQU8sRUFBRSxLQUFLLEdBQUc7QUFBQTtBQUFBLEVBR3ZDLElBQU0saUJBQWlCLENBQUMsSUFBYSxTQUFnQztBQUFBLElBWW5FLE1BQU0sYUFBYSxLQUFLLElBQUksaUJBQWlCO0FBQUEsSUFDN0MsSUFBSSxZQUFZO0FBQUEsTUFDZCxNQUFNLE9BQU8sR0FBRyxZQUFZO0FBQUEsTUFDNUIsTUFBTSxRQUErQixnQkFBZ0IsYUFBYSxPQUFPO0FBQUEsTUFDekUsTUFBTSxPQUFPLGlCQUFpQixZQUFZLEtBQUs7QUFBQSxNQUMvQyxJQUFJO0FBQUEsUUFBTSxPQUFPLFNBQVMsTUFBTSxHQUFHO0FBQUEsSUFDckM7QUFBQSxJQUNBLE1BQU0sWUFBWSxLQUFLLElBQUksWUFBWTtBQUFBLElBQ3ZDLElBQUk7QUFBQSxNQUFXLE9BQU8sU0FBUyxXQUFXLEdBQUc7QUFBQSxJQUU3QyxNQUFNLE1BQU0sR0FBRyxRQUFRLFlBQVk7QUFBQSxJQUNuQyxNQUFNLGdCQUFnQixRQUFRLFdBQVcsUUFBUSxZQUFZLFFBQVEsY0FBYyxRQUFRLFlBQVksUUFBUSxXQUFXLFFBQVEsY0FBYyxRQUFRO0FBQUEsSUFDeEosSUFBSSxlQUFlO0FBQUEsTUFDakIsSUFBSSxHQUFHLElBQUk7QUFBQSxRQUNULE1BQU0sT0FBTyxHQUFHLFlBQVk7QUFBQSxRQUM1QixNQUFNLFFBQStCLGdCQUFnQixhQUFhLE9BQU87QUFBQSxRQUN6RSxJQUFJLFdBQTJCO0FBQUEsUUFDL0IsSUFBSTtBQUFBLFVBQUUsV0FBVyxNQUFNLGNBQWMsY0FBYyxVQUFVLEdBQUcsRUFBRSxLQUFLO0FBQUEsVUFBSyxNQUFNO0FBQUEsUUFDbEYsSUFBSSxVQUFVO0FBQUEsVUFDWixNQUFNLE9BQU8sU0FBUyxTQUFTLGFBQWEsR0FBRztBQUFBLFVBQy9DLElBQUk7QUFBQSxZQUFNLE9BQU87QUFBQSxRQUNuQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLElBQUksY0FBOEIsR0FBRztBQUFBLE1BQ3JDLE9BQU8sYUFBYTtBQUFBLFFBQ2xCLElBQUksWUFBWSxZQUFZLFNBQVM7QUFBQSxVQUNuQyxNQUFNLE9BQU8sU0FBUyxZQUFZLGFBQWEsR0FBRztBQUFBLFVBQ2xELElBQUk7QUFBQSxZQUFNLE9BQU87QUFBQSxVQUNqQjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGNBQWMsWUFBWTtBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBTSxZQUFZLEtBQUssSUFBSSxPQUFPO0FBQUEsSUFDbEMsSUFBSTtBQUFBLE1BQVcsT0FBTyxTQUFTLFdBQVcsR0FBRztBQUFBLElBQzdDLE1BQU0sVUFBVSxLQUFLLElBQUksS0FBSztBQUFBLElBQzlCLElBQUk7QUFBQSxNQUFTLE9BQU8sU0FBUyxTQUFTLEdBQUc7QUFBQSxJQUN6QyxNQUFNLGtCQUFrQixLQUFLLElBQUksYUFBYTtBQUFBLElBQzlDLElBQUk7QUFBQSxNQUFpQixPQUFPLFNBQVMsaUJBQWlCLEdBQUc7QUFBQSxJQUN6RCxJQUFJLFFBQVEsZ0JBQWdCLElBQUksSUFBSTtBQUFBLE1BQUcsT0FBTztBQUFBLElBRTlDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxLQUFLLElBQUk7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUM5QyxPQUFPLFNBQVMsR0FBRyxhQUFhLEdBQUc7QUFBQTtBQUFBLEVBTXJDLElBQU0seUJBQXlCLElBQUksSUFBSTtBQUFBLElBQ3JDO0FBQUEsSUFBSztBQUFBLElBQVU7QUFBQSxJQUFNO0FBQUEsSUFBTTtBQUFBLElBQU07QUFBQSxJQUFNO0FBQUEsSUFBTTtBQUFBLElBQzdDO0FBQUEsSUFBVztBQUFBLElBQU07QUFBQSxJQUFNO0FBQUEsSUFBVztBQUFBLElBQWM7QUFBQSxJQUFVO0FBQUEsSUFDMUQ7QUFBQSxJQUFVO0FBQUEsSUFBVTtBQUFBLEVBQ3RCLENBQUM7QUFBQSxFQUVELElBQU0sMEJBQTBCLElBQUksSUFBSTtBQUFBLElBQ3RDO0FBQUEsSUFBVTtBQUFBLElBQVE7QUFBQSxJQUFZO0FBQUEsSUFBZ0I7QUFBQSxJQUFZO0FBQUEsSUFDMUQ7QUFBQSxJQUFRO0FBQUEsSUFBWTtBQUFBLElBQW9CO0FBQUEsSUFBaUI7QUFBQSxJQUN6RDtBQUFBLElBQVM7QUFBQSxJQUFPO0FBQUEsSUFBYTtBQUFBLElBQVU7QUFBQSxJQUFPO0FBQUEsSUFBVztBQUFBLEVBQzNELENBQUM7QUFBQSxFQUNELElBQU0sb0JBQW9CLENBQUMsSUFBYSxLQUFhLFNBQWlDO0FBQUEsSUFDcEYsSUFBSSxRQUFRLHdCQUF3QixJQUFJLElBQUk7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUN0RCxJQUFJLHVCQUF1QixJQUFJLEdBQUc7QUFBQSxNQUFHLE9BQU87QUFBQSxJQU01QyxNQUFNLGtCQUFrQixJQUFJLElBQUksQ0FBQyxRQUFRLE1BQU0sVUFBVSxLQUFLLEtBQUssUUFBUSxTQUFTLFFBQVEsT0FBTyxRQUFRLE9BQU8sUUFBUSxRQUFRLEtBQUssUUFBUSxPQUFPLEtBQUssQ0FBQztBQUFBLElBQzVKLElBQUksZ0JBQWdCLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxTQUFTO0FBQUEsTUFBUSxPQUFPO0FBQUEsSUFDNUQsT0FBTztBQUFBO0FBQUEsRUFHVCxJQUFNLGVBQWUsQ0FBQyxPQUErQjtBQUFBLElBQ25ELElBQUksY0FBYztBQUFBLE1BQW1CLE9BQU87QUFBQSxJQUM1QyxJQUFJLGNBQWM7QUFBQSxNQUFrQixPQUFPO0FBQUEsSUFDM0MsSUFBSSxjQUFjO0FBQUEsTUFBcUIsT0FBTztBQUFBLElBQzlDLElBQUksY0FBYztBQUFBLE1BQW1CLE9BQU87QUFBQSxJQUM1QyxJQUFJLGNBQWMscUJBQXFCLEdBQUc7QUFBQSxNQUFNLE9BQU87QUFBQSxJQUN2RCxJQUFJLGNBQWM7QUFBQSxNQUFlLE9BQU87QUFBQSxJQUN4QyxJQUFJLGNBQWMsb0JBQW9CLGNBQWM7QUFBQSxNQUFrQixPQUFPO0FBQUEsSUFDN0UsSUFBSSxjQUFjO0FBQUEsTUFBa0IsT0FBTztBQUFBLElBQzNDLElBQUksY0FBYztBQUFBLE1BQXNCLE9BQU87QUFBQSxJQUMvQyxJQUFJLGNBQWM7QUFBQSxNQUFxQixPQUFPO0FBQUEsSUFDOUMsSUFBSSxjQUFjO0FBQUEsTUFBaUIsT0FBTztBQUFBLElBQzFDLElBQUksY0FBYztBQUFBLE1BQXFCLE9BQU87QUFBQSxJQUM5QyxJQUFJLGNBQWM7QUFBQSxNQUFrQixPQUFPO0FBQUEsSUFDM0MsT0FBTztBQUFBO0FBQUEsRUFHVCxJQUFNLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRLFdBQVcsV0FBVyxPQUFPLFVBQVUsVUFBVSxTQUFTLFFBQVEsU0FBUyxNQUFNLElBQUksQ0FBQztBQUFBLEVBRTdILElBQU0sZ0JBQWdCLENBQUMsT0FBMEM7QUFBQSxJQUMvRCxJQUFJLFVBQTBCLEdBQUc7QUFBQSxJQUNqQyxJQUFJLFFBQVE7QUFBQSxJQUNaLE9BQU8sV0FBVyxRQUFRLGFBQWEsS0FBSyxnQkFBZ0IsWUFBWSxTQUFTLFFBQVEsUUFBUSxJQUFJO0FBQUEsTUFDbkcsTUFBTSxTQUNKLFFBQVEsTUFDUixRQUFRLGFBQWEsZ0JBQWdCLEtBQ3JDLFFBQVEsYUFBYSxhQUFhLEtBQ2xDLFFBQVEsYUFBYSxXQUFXLEtBQ2hDLFFBQVEsYUFBYSxTQUFTLEtBQzlCLFFBQVEsYUFBYSxTQUFTLEtBQzlCLFFBQVEsYUFBYSxNQUFNLEtBQzNCLGNBQWMsSUFBSSxRQUFRLFNBQVMsWUFBWSxDQUFDO0FBQUEsTUFDbEQsSUFBSTtBQUFBLFFBQVEsT0FBTyxFQUFDLFNBQVMsY0FBYyxPQUFPLEVBQUM7QUFBQSxNQUNuRCxJQUFJLFFBQVEsa0JBQWtCLFFBQVEsUUFBUSxzQkFBc0IsWUFBWTtBQUFBLFFBQzlFLFVBQVUsUUFBUSxXQUFXLFFBQVE7QUFBQSxNQUN2QyxFQUFPO0FBQUEsUUFDTCxVQUFVLFFBQVE7QUFBQTtBQUFBLE1BRXBCO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsRUFHVCxJQUFNLGdCQUFnQixDQUFDLElBQWEsUUFBUSxNQUFrQjtBQUFBLElBQzVELE1BQU0sTUFBa0IsQ0FBQztBQUFBLElBQ3pCLElBQUksVUFBVSxHQUFHO0FBQUEsSUFDakIsSUFBSSxJQUFJO0FBQUEsSUFDUixPQUFPLFdBQVcsWUFBWSxTQUFTLFFBQVEsSUFBSSxPQUFPO0FBQUEsTUFDeEQsTUFBTSxPQUFpQixFQUFDLEtBQUssUUFBUSxRQUFRLFlBQVksRUFBQztBQUFBLE1BQzFELElBQUksV0FBVyxRQUFRLEVBQUU7QUFBQSxRQUFHLEtBQUssS0FBSyxRQUFRO0FBQUEsTUFDOUMsTUFBTSxPQUFPLEtBQUssU0FBUyxNQUFNO0FBQUEsTUFDakMsSUFBSTtBQUFBLFFBQU0sS0FBSyxPQUFPO0FBQUEsTUFDdEIsTUFBTSxNQUFNLEtBQUssU0FBUyxhQUFhLEtBQUssS0FBSyxTQUFTLFdBQVcsS0FDbkUsS0FBSyxTQUFTLFNBQVMsS0FBSyxLQUFLLFNBQVMsU0FBUztBQUFBLE1BQ3JELElBQUk7QUFBQSxRQUFLLEtBQUssU0FBUztBQUFBLE1BQ3ZCLE1BQU0sTUFBTSxRQUFRLFlBQVksTUFBTSxLQUFLLFFBQVEsU0FBUyxFQUFFLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQztBQUFBLE1BQzdFLElBQUksSUFBSTtBQUFBLFFBQVEsS0FBSyxVQUFVO0FBQUEsTUFDL0IsSUFBSSxLQUFLLElBQUk7QUFBQSxNQUNiLFVBQVUsUUFBUTtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsRUFJVCxJQUFNLGlCQUFpQixJQUFJLElBQUk7QUFBQSxJQUM3QjtBQUFBLElBQVE7QUFBQSxJQUFPO0FBQUEsSUFBTztBQUFBLElBQVM7QUFBQSxJQUFlO0FBQUEsSUFBUTtBQUFBLElBQVE7QUFBQSxJQUFTO0FBQUEsSUFBVTtBQUFBLElBQ2pGO0FBQUEsSUFBYztBQUFBLElBQW1CO0FBQUEsSUFBb0I7QUFBQSxJQUFpQjtBQUFBLElBQ3RFO0FBQUEsSUFBZ0I7QUFBQSxJQUFpQjtBQUFBLElBQWlCO0FBQUEsSUFBYTtBQUFBLElBQWU7QUFBQSxFQUNoRixDQUFDO0FBQUEsRUFDRCxJQUFNLG9CQUFvQixDQUFDLFNBQVMsT0FBTztBQUFBLEVBQzNDLElBQU0saUJBQWlCLElBQUksSUFBSSxDQUFDLFNBQVMsU0FBUyxJQUFJLENBQUM7QUFBQSxFQUl2RCxJQUFNLHFCQUE2QztBQUFBLElBQ2pELE1BQU07QUFBQSxJQUNOLGtCQUFrQjtBQUFBLElBQ2xCLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFNQSxJQUFNLCtCQUErQixJQUFJLElBQUk7QUFBQSxJQUMzQztBQUFBLElBQWU7QUFBQSxJQUFhO0FBQUEsSUFBVztBQUFBLElBQ3ZDO0FBQUEsSUFBYztBQUFBLElBQVE7QUFBQSxJQUFTO0FBQUEsRUFDakMsQ0FBQztBQUFBLEVBS0QsSUFBTSxTQUFTO0FBQUEsRUFHZixJQUFNLHNCQUFzQjtBQUFBLEVBQzVCLElBQU0sZ0JBQWdCLENBQUMsTUFBYyxVQUEwQjtBQUFBLElBQzdELElBQUksb0JBQW9CLEtBQUssSUFBSSxLQUFLLE1BQU0sU0FBUztBQUFBLE1BQUcsT0FBTztBQUFBLElBQy9ELE9BQU8sTUFBTSxRQUFRLFFBQVEsaUJBQWlCO0FBQUE7QUFBQSxFQUdoRCxJQUFNLGlCQUFpQixDQUFDLE9BQXFHO0FBQUEsSUFDM0gsTUFBTSxRQUFnQyxDQUFDO0FBQUEsSUFDdkMsSUFBSSxDQUFDLEdBQUc7QUFBQSxNQUFZLE9BQU8sRUFBQyxPQUFPLE9BQU8sVUFBUztBQUFBLElBQ25ELElBQUksY0FBYztBQUFBLElBQ2xCLFdBQVcsS0FBSyxNQUFNLEtBQUssR0FBRyxVQUFVLEdBQUc7QUFBQSxNQUN6QyxNQUFNLE9BQU8sRUFBRTtBQUFBLE1BQ2YsSUFBSSxDQUFDLFFBQVEsZUFBZSxJQUFJLElBQUk7QUFBQSxRQUFHO0FBQUEsTUFDdkMsSUFBSSw2QkFBNkIsSUFBSSxJQUFJO0FBQUEsUUFBRztBQUFBLE1BQzVDLE1BQU0sVUFBVSxlQUFlLElBQUksSUFBSSxLQUFLLGtCQUFrQixLQUFLLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQUEsTUFDNUYsSUFBSSxDQUFDO0FBQUEsUUFBUztBQUFBLE1BQ2QsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLFFBQVE7QUFBQSxNQU9sQyxJQUFJLFNBQVMsV0FBVyxjQUFjLG9CQUFvQixHQUFHO0FBQUEsUUFDM0QsTUFBTSxJQUFJLEdBQUc7QUFBQSxRQUNiLE1BQU0sTUFBTSxHQUFHLGFBQWEsY0FBYyxLQUFLLElBQUksWUFBWTtBQUFBLFFBQy9ELE1BQU0sWUFBWSxNQUFNLGNBQ25CLE1BQU0sWUFDTiwwRkFBMEYsS0FBSyxFQUFFO0FBQUEsUUFDdEcsSUFBSSxXQUFXO0FBQUEsVUFDYixJQUFJO0FBQUEsVUFDSixjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsTUFDQSxJQUFJLEdBQUc7QUFBQSxRQUNMLE1BQU0sV0FBVyxjQUFjLE1BQU0sQ0FBQztBQUFBLFFBQ3RDLElBQUksYUFBYSxHQUFHO0FBQUEsVUFBRSxJQUFJO0FBQUEsVUFBVSxjQUFjO0FBQUEsUUFBTTtBQUFBLE1BQzFEO0FBQUEsTUFDQSxJQUFJO0FBQUEsUUFBRyxNQUFNLFFBQVE7QUFBQSxJQUN2QjtBQUFBLElBR0EsTUFBTSxRQUF5QyxDQUFDO0FBQUEsSUFDaEQsSUFBSSxjQUFjLGtCQUFrQjtBQUFBLE1BQ2xDLE1BQU0sTUFBTSxtQkFBbUIsR0FBRztBQUFBLE1BQ2xDLElBQUk7QUFBQSxRQUFLLE1BQU0sU0FBUztBQUFBLElBQzFCO0FBQUEsSUFDQSxJQUFJO0FBQUEsTUFBYSxNQUFNLGNBQWM7QUFBQSxJQUNyQyxPQUFPLEVBQUMsT0FBTyxPQUFPLE9BQU8sS0FBSyxLQUFLLEVBQUUsU0FBUyxRQUFRLFVBQVM7QUFBQTtBQUFBLEVBR3JFLElBQU0sZUFBZSxJQUFJLElBQUksQ0FBQyxXQUFXLFdBQVcsU0FBUyxVQUFVLGdCQUFnQixVQUFVLFFBQVEsUUFBUSxRQUFRLENBQUM7QUFBQSxFQUMxSCxJQUFNLGdCQUEwQztBQUFBLElBQzlDLFlBQVksQ0FBQyxTQUFTO0FBQUEsSUFBRyxTQUFTLENBQUMsR0FBRztBQUFBLElBQUcsVUFBVSxDQUFDLFNBQVM7QUFBQSxJQUM3RCxXQUFXLENBQUMsU0FBUztBQUFBLElBQUcsV0FBVyxDQUFDLFNBQVM7QUFBQSxJQUFHLFNBQVMsQ0FBQyxVQUFVLE9BQU87QUFBQSxJQUMzRSxRQUFRLENBQUMsS0FBSztBQUFBLElBQUcsU0FBUyxDQUFDLEtBQUs7QUFBQSxJQUNoQyxRQUFRLENBQUMseUJBQXlCLDJCQUEyQjtBQUFBLElBQzdELGNBQWMsQ0FBQyxLQUFLO0FBQUEsSUFDcEIsaUJBQWlCLENBQUMsb0JBQW9CLGFBQWE7QUFBQSxJQUNuRCxlQUFlLENBQUMsTUFBTTtBQUFBLElBTXRCLEtBQUssQ0FBQyxLQUFLO0FBQUEsSUFBRyxPQUFPLENBQUMsS0FBSztBQUFBLElBQUcsUUFBUSxDQUFDLEtBQUs7QUFBQSxJQUFHLE1BQU0sQ0FBQyxLQUFLO0FBQUEsSUFDM0QsZUFBZSxDQUFDLEtBQUs7QUFBQSxJQUNyQixVQUFVLENBQUMsUUFBUTtBQUFBLElBQ25CLFlBQVksQ0FBQyxPQUFPLGdCQUFnQjtBQUFBLElBRXBDLFlBQVksQ0FBQyxTQUFTO0FBQUEsSUFBRyxnQkFBZ0IsQ0FBQyxjQUFjLFFBQVE7QUFBQSxJQUVoRSxXQUFXLENBQUMsT0FBTztBQUFBLElBQ25CLGdCQUFnQixDQUFDLHlCQUF5QjtBQUFBLEVBQzVDO0FBQUEsRUFDQSxJQUFNLGVBQWUsQ0FBQyxHQUFXLE1BQThDO0FBQUEsSUFDN0UsSUFBSSxLQUFLLFFBQVEsTUFBTTtBQUFBLE1BQUksT0FBTztBQUFBLElBQ2xDLElBQUksYUFBYSxJQUFJLENBQUM7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUNoQyxPQUFPLENBQUMsY0FBYyxJQUFJLFNBQVMsQ0FBQztBQUFBO0FBQUEsRUFHdEMsSUFBTSxhQUFhO0FBQUEsSUFDakI7QUFBQSxJQUFjO0FBQUEsSUFBWTtBQUFBLElBQWM7QUFBQSxJQUFjO0FBQUEsSUFDdEQ7QUFBQSxJQUFhO0FBQUEsSUFBaUI7QUFBQSxJQUFrQjtBQUFBLElBQ2hEO0FBQUEsSUFBVztBQUFBLElBQVU7QUFBQSxJQUFTO0FBQUEsSUFBVTtBQUFBLElBQVk7QUFBQSxJQUFhO0FBQUEsSUFBWTtBQUFBLElBQzdFO0FBQUEsSUFBbUI7QUFBQSxJQUFtQjtBQUFBLElBQVU7QUFBQSxJQUNoRDtBQUFBLElBQVc7QUFBQSxJQUFZO0FBQUEsSUFBTztBQUFBLElBQVM7QUFBQSxJQUFVO0FBQUEsSUFBUTtBQUFBLElBQ3pEO0FBQUEsSUFBaUI7QUFBQSxJQUFjO0FBQUEsSUFBa0I7QUFBQSxJQUFPO0FBQUEsSUFDeEQ7QUFBQSxJQUF1QjtBQUFBLElBQW9CO0FBQUEsSUFBYztBQUFBLElBQ3pEO0FBQUEsSUFBYTtBQUFBLElBQVc7QUFBQSxJQUFZO0FBQUEsSUFBVTtBQUFBLElBQWtCO0FBQUEsSUFDaEU7QUFBQSxJQUFjO0FBQUEsSUFBYTtBQUFBLElBQVU7QUFBQSxJQUFjO0FBQUEsRUFDckQ7QUFBQSxFQUNBLElBQU0sZUFBdUM7QUFBQSxJQUMzQyxZQUFZO0FBQUEsSUFBSyxpQkFBaUI7QUFBQSxJQUFNLFdBQVc7QUFBQSxJQUFNLFFBQVE7QUFBQSxJQUNqRSxRQUFRO0FBQUEsSUFBSyxnQkFBZ0I7QUFBQSxJQUFLLFdBQVc7QUFBQSxJQUFLLFlBQVk7QUFBQSxJQUFLLFdBQVc7QUFBQSxJQUM5RSxxQkFBcUI7QUFBQSxJQUFNLGtCQUFrQjtBQUFBLEVBQy9DO0FBQUEsRUFPQSxJQUFNLFFBQVE7QUFBQSxFQUNkLElBQU0sVUFBVSxDQUFDLE1BQXNCO0FBQUEsSUFDckMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQUEsTUFBRyxPQUFPO0FBQUEsSUFDM0IsTUFBTSxJQUFJLFdBQVcsQ0FBQztBQUFBLElBQ3RCLE9BQU8sT0FBTyxTQUFTLENBQUMsSUFBSSxHQUFHLEtBQUssTUFBTSxJQUFJLEVBQUUsSUFBSSxTQUFTO0FBQUE7QUFBQSxFQVEvRCxJQUFNLGdCQUFnQixJQUFJLElBQUksQ0FBQyxTQUFTLG1CQUFtQixhQUFhLENBQUM7QUFBQSxFQUV6RSxJQUFNLGtCQUFrQixDQUFDLE9BQXdDO0FBQUEsSUFDL0QsTUFBTSxLQUFLLE9BQU8saUJBQWlCLEVBQUU7QUFBQSxJQUNyQyxNQUFNLE1BQThCLENBQUM7QUFBQSxJQUNyQyxXQUFXLEtBQUssWUFBWTtBQUFBLE1BQzFCLE1BQU0sSUFBSyxHQUFXO0FBQUEsTUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDO0FBQUEsUUFBRztBQUFBLE1BQ3pCLElBQUksS0FBSyxRQUFRLFNBQVMsR0FBRyxhQUFhLE1BQU0sR0FBRyxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxJQUtBLElBQUksY0FBYyxhQUFhO0FBQUEsTUFDN0IsV0FBVyxLQUFLLGVBQWU7QUFBQSxRQUM3QixJQUFJLENBQUMsSUFBSTtBQUFBLFVBQUk7QUFBQSxRQUViLE1BQU0sVUFBVSxFQUFFLFFBQVEsVUFBVSxDQUFDLE1BQU0sTUFBTSxFQUFFLFlBQVksQ0FBQztBQUFBLFFBQ2hFLE1BQU0sU0FBUyxHQUFHLE9BQU8saUJBQWlCLE9BQU8sR0FBRyxLQUFLO0FBQUEsUUFDekQsSUFBSSxVQUFVLE9BQU8sU0FBUyxNQUFNLEdBQUc7QUFBQSxVQUNyQyxJQUFJLEdBQUcsVUFBVSxTQUFTLFFBQVEsR0FBRztBQUFBLFFBQ3ZDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBLEVBR1QsSUFBTSxjQUFjLENBQUMsV0FBVyxZQUFZLFNBQVMsVUFBVSxtQkFBbUIsbUJBQW1CLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxXQUFXLE9BQU8sU0FBUyxVQUFVLFFBQVEsUUFBUTtBQUFBLEVBQzlNLElBQU0sZUFBZSxDQUFDLE9BQXdEO0FBQUEsSUFDNUUsTUFBTSxNQUE4QyxDQUFDO0FBQUEsSUFDckQsV0FBVyxTQUFTLENBQUMsWUFBWSxTQUFTLEdBQUc7QUFBQSxNQUMzQyxNQUFNLEtBQUssU0FBUyxNQUFNLE9BQU8saUJBQWlCLElBQUksS0FBSyxHQUFHLElBQUk7QUFBQSxNQUNsRSxJQUFJLENBQUM7QUFBQSxRQUFJO0FBQUEsTUFDVCxNQUFNLFVBQVUsR0FBRztBQUFBLE1BQ25CLElBQUksQ0FBQyxXQUFXLFlBQVksVUFBVSxZQUFZO0FBQUEsUUFBVTtBQUFBLE1BQzVELE1BQU0sUUFBZ0MsRUFBQyxTQUFTLFNBQVMsU0FBUyxHQUFHLEVBQUM7QUFBQSxNQUN0RSxXQUFXLEtBQUssYUFBYTtBQUFBLFFBQzNCLE1BQU0sSUFBSyxHQUFXO0FBQUEsUUFDdEIsSUFBSSxhQUFhLEdBQUcsQ0FBQztBQUFBLFVBQUcsTUFBTSxLQUFLLFNBQVMsR0FBRyxhQUFhLE1BQU0sR0FBRztBQUFBLE1BQ3ZFO0FBQUEsTUFDQSxJQUFJLE1BQU0sUUFBUSxNQUFNLEVBQUUsS0FBSztBQUFBLElBQ2pDO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQUlULElBQU0sd0JBQXdCLENBQUMsU0FBUyxTQUFTLGlCQUFpQixnQkFBZ0IsVUFBVSxVQUFVLFNBQVM7QUFBQSxFQUsvRyxJQUFNLG1CQUFtQixDQUFDLFdBQVcsWUFBWSxZQUFZLFlBQVksYUFBYSxjQUFjLFlBQVksZ0JBQWdCLFNBQVMsU0FBUztBQUFBLEVBQ2xKLElBQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLFVBQVUsWUFBWSxVQUFVLFlBQVksVUFBVSxZQUFZLE9BQU8sQ0FBQztBQUFBLEVBRzlHLElBQU0saUJBQWlCLENBQUMsT0FBMEI7QUFBQSxJQUNoRCxNQUFNLE1BQWdCLENBQUM7QUFBQSxJQUN2QixXQUFXLEtBQUssdUJBQXVCO0FBQUEsTUFDckMsSUFBSTtBQUFBLFFBQUUsSUFBSSxHQUFHLFFBQVEsSUFBSSxHQUFHO0FBQUEsVUFBRyxJQUFJLEtBQUssQ0FBQztBQUFBLFFBQUssTUFBTTtBQUFBLElBQ3REO0FBQUEsSUFDQSxJQUFJLFVBQVUsSUFBSSxHQUFHLFFBQVEsWUFBWSxDQUFDLEdBQUc7QUFBQSxNQUMzQyxXQUFXLEtBQUssa0JBQWtCO0FBQUEsUUFDaEMsSUFBSTtBQUFBLFVBQUUsSUFBSSxHQUFHLFFBQVEsSUFBSSxHQUFHO0FBQUEsWUFBRyxJQUFJLEtBQUssQ0FBQztBQUFBLFVBQUssTUFBTTtBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsRUFHVCxJQUFNLGtCQUFrQjtBQUFBLElBQ3RCO0FBQUEsSUFBVztBQUFBLElBQVk7QUFBQSxJQUFjO0FBQUEsSUFBWTtBQUFBLElBQWE7QUFBQSxJQUM5RDtBQUFBLElBQWE7QUFBQSxJQUFTO0FBQUEsSUFBVTtBQUFBLElBQVk7QUFBQSxJQUFhO0FBQUEsSUFBWTtBQUFBLElBQ3JFO0FBQUEsSUFBVTtBQUFBLElBQVc7QUFBQSxJQUFlO0FBQUEsSUFBa0I7QUFBQSxJQUN0RDtBQUFBLElBQXFCO0FBQUEsSUFBbUI7QUFBQSxJQUFnQjtBQUFBLElBQVM7QUFBQSxJQUNqRTtBQUFBLElBQWM7QUFBQSxJQUFZO0FBQUEsSUFBYztBQUFBLElBQWM7QUFBQSxJQUFhO0FBQUEsSUFDbkU7QUFBQSxJQUFXO0FBQUEsSUFBYTtBQUFBLElBQWM7QUFBQSxFQUN4QztBQUFBLEVBTUEsSUFBTSx1QkFBdUIsQ0FBQyxRQUF5QjtBQUFBLElBQ3JELE1BQU0sVUFBVSxJQUFJLFFBQVEsUUFBUSxHQUFHLEVBQUUsS0FBSztBQUFBLElBQzlDLElBQUksWUFBWTtBQUFBLE1BQUssT0FBTztBQUFBLElBQzVCLElBQUksWUFBWTtBQUFBLE1BQXdCLE9BQU87QUFBQSxJQUMvQyxJQUFJLFlBQVk7QUFBQSxNQUF3QixPQUFPO0FBQUEsSUFDL0MsT0FBTztBQUFBO0FBQUEsRUFHVCxJQUFNLHNCQUFzQixDQUFDLE9BQStCO0FBQUEsSUFDMUQsTUFBTSxRQUF1QixDQUFDO0FBQUEsSUFDOUIsTUFBTSxhQUF1QixDQUFDO0FBQUEsSUFDOUIsTUFBTSxXQUFXLENBQUMsU0FBZ0M7QUFBQSxNQUNoRCxJQUFJO0FBQUEsUUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLEtBQUssWUFBWTtBQUFBLFVBQUcsT0FBTztBQUFBLFFBQVEsTUFBTTtBQUFBLFFBQUUsT0FBTztBQUFBO0FBQUEsTUFDeEUsSUFBSSxxQkFBcUIsS0FBSyxZQUFZO0FBQUEsUUFBRyxPQUFPO0FBQUEsTUFFcEQsTUFBTSxjQUFjLFdBQVcsS0FBSyxNQUFNO0FBQUEsTUFDMUMsSUFBSSxZQUFZLEtBQUssV0FBVyxLQUFLLENBQUMsYUFBYSxLQUFLLFdBQVc7QUFBQSxRQUFHLE9BQU87QUFBQSxNQUM3RSxNQUFNLFdBQW1DLENBQUM7QUFBQSxNQUMxQyxXQUFXLEtBQUssaUJBQWlCO0FBQUEsUUFDL0IsTUFBTSxJQUFJLEtBQUssT0FBTyxpQkFBaUIsQ0FBQztBQUFBLFFBQ3hDLElBQUk7QUFBQSxVQUFHLFNBQVMsS0FBSyxTQUFTLEdBQUcsR0FBRztBQUFBLE1BQ3RDO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtBQUFBLFFBQVEsT0FBTztBQUFBLE1BTTFDLE1BQU0sY0FBYyxXQUFXLFdBQVcsSUFDdEMsUUFDQyxNQUFNO0FBQUEsUUFDUCxJQUFJO0FBQUEsVUFFRixXQUFXLFFBQVEsWUFBWTtBQUFBLFlBQzdCLE1BQU0sVUFBVSxLQUFLLFFBQVEsY0FBYyxFQUFFO0FBQUEsWUFDN0MsSUFBSSxDQUFDLFdBQVcsT0FBTyxFQUFFO0FBQUEsY0FBUyxPQUFPO0FBQUEsVUFDM0M7QUFBQSxVQUNBLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxVQUFFO0FBQUE7QUFBQSxTQUNUO0FBQUEsTUFDTCxNQUFNLFlBQXlCO0FBQUEsUUFDN0IsVUFBVSxLQUFLO0FBQUEsUUFDZixjQUFjO0FBQUEsV0FDVixXQUFXLFNBQVMsRUFBQyxPQUFPLFlBQVcsSUFBSSxDQUFDO0FBQUEsTUFDbEQ7QUFBQSxNQUNBLElBQUksV0FBVztBQUFBLFFBQVEsVUFBVSxjQUFjO0FBQUEsTUFDL0MsTUFBTSxLQUFLLFNBQVM7QUFBQSxNQUNwQixPQUFPLE1BQU0sU0FBUztBQUFBO0FBQUEsSUFFeEIsTUFBTSxPQUFPLENBQUMsT0FBNkIsU0FBNEI7QUFBQSxNQUNyRSxTQUFTLElBQUksRUFBRyxJQUFJLEtBQUssVUFBVSxNQUFNLFNBQVMsV0FBVyxLQUFLO0FBQUEsUUFDaEUsTUFBTSxPQUFPLEtBQUs7QUFBQSxRQUNsQixJQUFJLENBQUMsUUFBUSxPQUFPLEtBQUssU0FBUztBQUFBLFVBQVU7QUFBQSxRQUM1QyxJQUFJLEtBQUssU0FBUyxRQUFRLFlBQVk7QUFBQSxVQUNwQyxJQUFJLENBQUMsU0FBUyxJQUFvQjtBQUFBLFlBQUc7QUFBQSxVQUNyQztBQUFBLFFBQ0Y7QUFBQSxRQUNBLElBQUksS0FBSyxTQUFTLFFBQVEsY0FBYyxLQUFLLFNBQVMsUUFBUSxlQUFlO0FBQUEsVUFDM0UsTUFBTSxPQUFPLE9BQVEsS0FBc0IsaUJBQWlCLEVBQUUsRUFBRSxLQUFLO0FBQUEsVUFDckUsSUFBSTtBQUFBLFlBQU0sV0FBVyxLQUFLLElBQUk7QUFBQSxVQUM5QixJQUFLLEtBQXlCO0FBQUEsWUFBVSxLQUFLLE9BQVEsS0FBeUIsUUFBUTtBQUFBLFVBQ3RGLElBQUk7QUFBQSxZQUFNLFdBQVcsSUFBSTtBQUFBLFVBQ3pCO0FBQUEsUUFDRjtBQUFBLFFBQ0EsSUFBSSxLQUFLLFNBQVMsUUFBUSxlQUFnQixLQUF1QixZQUFZO0FBQUEsVUFDM0UsSUFBSTtBQUFBLFlBQ0YsTUFBTSxLQUFNLEtBQXVCO0FBQUEsWUFDbkMsSUFBSSxJQUFJO0FBQUEsY0FBVSxLQUFLLElBQUksR0FBRyxRQUFRO0FBQUEsWUFDdEMsTUFBTTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUE7QUFBQSxJQUVGLFdBQVcsU0FBUyxNQUFNLEtBQUssU0FBUyxlQUFlLENBQUMsQ0FBQyxHQUFHO0FBQUEsTUFDMUQsTUFBTSxJQUFJLE1BQU0sT0FBTztBQUFBLE1BQ3ZCLElBQUk7QUFBQSxRQUFHLFdBQVcsS0FBSyxVQUFVLEdBQUc7QUFBQSxNQUNwQyxJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsUUFBRSxNQUFNLE1BQU07QUFBQSxRQUFZLE1BQU07QUFBQSxRQUFFLElBQUk7QUFBQSxVQUFHLFdBQVcsSUFBSTtBQUFBLFFBQUc7QUFBQTtBQUFBLE1BQy9ELElBQUk7QUFBQSxRQUFLLEtBQUssT0FBTyxHQUFHO0FBQUEsTUFDeEIsSUFBSTtBQUFBLFFBQUcsV0FBVyxJQUFJO0FBQUEsSUFDeEI7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBLEVBbUJULElBQU0sZUFBZSxDQUFDLFdBQVcsZUFBZSxZQUFZLFlBQVksYUFBYSxXQUFXLFVBQVUsU0FBUztBQUFBLEVBQ25ILElBQU0sa0JBQWtCLENBQUMsV0FBVyxlQUFlLFlBQVksWUFBWSxhQUFhLFdBQVcsVUFBVSxTQUFTO0FBQUEsRUFFdEgsSUFBTSxrQkFBa0IsQ0FBQyxJQUFhLFFBQXNDO0FBQUEsSUFDMUUsTUFBTSxXQUFXLE9BQU8sS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLGVBQWUsQ0FBQztBQUFBLElBQzFFLElBQUksQ0FBQztBQUFBLE1BQVU7QUFBQSxJQUNmLE1BQU0sUUFBUyxHQUFXO0FBQUEsSUFDMUIsSUFBSSxDQUFDO0FBQUEsTUFBTztBQUFBLElBQ1osV0FBVyxLQUFLLGNBQWM7QUFBQSxNQUM1QixJQUFJLElBQUk7QUFBQSxRQUFJO0FBQUEsTUFDWixNQUFNLEtBQUssTUFBTTtBQUFBLE1BQ2pCLElBQUksT0FBTyxPQUFPLFlBQVk7QUFBQSxRQUM1QixNQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsU0FBUyxLQUFLLEdBQUcsT0FBTztBQUFBLFFBQ2hELElBQUksS0FBSyxTQUFTLEdBQUcsRUFBRTtBQUFBLE1BQ3pCO0FBQUEsSUFDRjtBQUFBO0FBQUEsRUFHRixJQUFNLGdCQUFnQixDQUFDLElBQWEsUUFBc0M7QUFBQSxJQUl4RSxNQUFNLElBQVUsR0FBVyx3QkFBeUIsR0FBVztBQUFBLElBQy9ELElBQUksQ0FBQztBQUFBLE1BQUc7QUFBQSxJQUNSLE1BQU0sUUFBUSxFQUFFLE9BQU8sU0FBUyxFQUFFLFVBQVUsYUFBYSxFQUFFO0FBQUEsSUFDM0QsSUFBSSxDQUFDLFNBQVMsT0FBTyxVQUFVO0FBQUEsTUFBVTtBQUFBLElBQ3pDLFdBQVcsS0FBSyxjQUFjO0FBQUEsTUFDNUIsSUFBSSxJQUFJO0FBQUEsUUFBSTtBQUFBLE1BQ1osTUFBTSxLQUFLLE1BQU0sTUFBTSxNQUFNLEVBQUUsWUFBWTtBQUFBLE1BQzNDLElBQUksT0FBTyxPQUFPLFlBQVk7QUFBQSxRQUM1QixNQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsU0FBUyxLQUFLLEdBQUcsT0FBTztBQUFBLFFBQ2hELElBQUksS0FBSyxTQUFTLEdBQUcsRUFBRTtBQUFBLE1BQ3pCO0FBQUEsSUFDRjtBQUFBO0FBQUEsRUFHRixJQUFNLG1CQUFtQixDQUFDLElBQWEsUUFBc0M7QUFBQSxJQUMzRSxXQUFXLFNBQVEsaUJBQWlCO0FBQUEsTUFDbEMsTUFBTSxRQUFRLE9BQU8sTUFBSyxPQUFPLENBQUMsRUFBRSxZQUFZLElBQUksTUFBSyxNQUFNLENBQUM7QUFBQSxNQUNoRSxJQUFJLElBQUk7QUFBQSxRQUFRO0FBQUEsTUFDaEIsTUFBTSxJQUFJLEdBQUcsYUFBYSxLQUFJO0FBQUEsTUFDOUIsSUFBSTtBQUFBLFFBQUcsSUFBSSxTQUFTLFNBQVMsR0FBRyxHQUFHO0FBQUEsSUFDckM7QUFBQTtBQUFBLEVBR0YsSUFBTSxvQkFBb0IsQ0FBQyxPQUErQztBQUFBLElBQ3hFLE1BQU0sTUFBOEIsQ0FBQztBQUFBLElBQ3JDLGdCQUFnQixJQUFJLEdBQUc7QUFBQSxJQUN2QixjQUFjLElBQUksR0FBRztBQUFBLElBQ3JCLGlCQUFpQixJQUFJLEdBQUc7QUFBQSxJQUN4QixPQUFPLE9BQU8sS0FBSyxHQUFHLEVBQUUsU0FBUyxNQUFNO0FBQUE7QUFBQSxFQVF6QyxJQUFNLHlCQUF5QixDQUFDLE9BQU8sWUFBWSxtQkFBbUIsZUFBZSxlQUFlLFVBQVUsU0FBUyxXQUFXLFdBQVcsVUFBVSxRQUFRLFVBQVUsV0FBVyxZQUFZO0FBQUEsRUFDaE0sSUFBTSx1QkFBdUIsQ0FBQyxPQUErQztBQUFBLElBQzNFLElBQUksQ0FBQyxHQUFHO0FBQUEsTUFBWSxPQUFPO0FBQUEsSUFDM0IsTUFBTSxNQUE4QixDQUFDO0FBQUEsSUFDckMsV0FBVyxLQUFLLE1BQU0sS0FBSyxHQUFHLFVBQVUsR0FBRztBQUFBLE1BQ3pDLE1BQU0sT0FBTyxFQUFFO0FBQUEsTUFDZixJQUFJLHVCQUF1QixLQUFLLENBQUMsTUFBTSxTQUFTLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxHQUFHO0FBQUEsUUFDeEUsSUFBSSxRQUFRLFNBQVMsRUFBRSxPQUFPLEdBQUc7QUFBQSxNQUNuQztBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU8sT0FBTyxLQUFLLEdBQUcsRUFBRSxTQUFTLE1BQU07QUFBQTtBQUFBLEVBT3pDLElBQU0scUJBQXFCLENBQUMsT0FBK0I7QUFBQSxJQUN6RCxNQUFNLE9BQU8sR0FBRyxZQUFZO0FBQUEsSUFDNUIsSUFBSSxFQUFFLGdCQUFnQjtBQUFBLE1BQWEsT0FBTztBQUFBLElBQzFDLE1BQU0sT0FBTyxLQUFLO0FBQUEsSUFDbEIsSUFBSSxDQUFDO0FBQUEsTUFBTSxPQUFPO0FBQUEsSUFFbEIsSUFBSTtBQUFBLE1BQUUsT0FBTyxRQUFRLElBQUk7QUFBQSxNQUFLLE1BQU07QUFBQSxNQUFFLE9BQU8sS0FBSyxRQUFRLFlBQVk7QUFBQTtBQUFBO0FBQUEsRUFNeEUsSUFBTSxpQkFBaUIsQ0FBQyxPQUFnQztBQUFBLElBQ3RELElBQUksTUFBc0I7QUFBQSxJQUMxQixPQUFPLEtBQUs7QUFBQSxNQUNWLElBQUksZUFBZSxlQUFlLElBQUksbUJBQW1CO0FBQUEsUUFJdkQsSUFBSSxRQUFpQjtBQUFBLFFBQ3JCLElBQUksUUFBd0IsSUFBSTtBQUFBLFFBQ2hDLE9BQU8sU0FBUyxpQkFBaUIsZUFBZSxNQUFNLG1CQUFtQjtBQUFBLFVBQ3ZFLFFBQVE7QUFBQSxVQUNSLFFBQVEsTUFBTTtBQUFBLFFBQ2hCO0FBQUEsUUFDQSxPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsTUFBTSxJQUFJO0FBQUEsSUFDWjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsRUFTVCxJQUFNLG1CQUFtQixDQUFDLFNBQXVGO0FBQUEsSUFDL0csTUFBTSxJQUFTO0FBQUEsSUFDZixJQUFJLEtBQUssV0FBVyxTQUFTLFFBQVEsS0FBSyxFQUFFO0FBQUEsTUFBVSxPQUFPO0FBQUEsSUFDN0QsSUFBSSxLQUFLLGFBQWEscUJBQXFCLEtBQUssRUFBRTtBQUFBLE1BQWlCLE9BQU87QUFBQSxJQUMxRSxJQUFJLEtBQUssYUFBYSxtQkFBbUIsS0FBSyxFQUFFO0FBQUEsTUFBZSxPQUFPO0FBQUEsSUFDdEUsSUFBSSxLQUFLLFdBQVcsU0FBUyxXQUFXLEtBQUssS0FBSyxRQUFRLGVBQWU7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUNuRixJQUFJLEtBQUssV0FBVyxTQUFTLGFBQWEsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0FBQUEsTUFBWSxPQUFPO0FBQUEsSUFDdEYsT0FBTztBQUFBO0FBQUEsRUFHVCxJQUFNLGdCQUFnQixDQUFDLE9BQWlKO0FBQUEsSUFDdEssTUFBTSxPQUFPLGVBQWUsRUFBRTtBQUFBLElBQzlCLElBQUksQ0FBQztBQUFBLE1BQU0sT0FBTztBQUFBLElBQ2xCLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUFFLGVBQWUsUUFBUSxJQUFJO0FBQUEsTUFBSyxNQUFNO0FBQUEsTUFBRSxlQUFlLEtBQUssUUFBUSxZQUFZO0FBQUE7QUFBQSxJQUN0RixNQUFNLE9BQVEsS0FBcUIsYUFBYSxLQUFLLGVBQWU7QUFBQSxJQUNwRSxPQUFPO0FBQUEsTUFDTCxNQUFNLGlCQUFpQixJQUFJO0FBQUEsTUFDM0I7QUFBQSxNQUNBLGVBQWUsS0FBSztBQUFBLElBQ3RCO0FBQUE7QUFBQSxFQXVCRixJQUFNLHNCQUFzQixDQUFDLE9BQXFDO0FBQUEsSUFDaEUsSUFBSSxHQUFHLFlBQVksR0FBRyxhQUFhO0FBQUEsTUFBVSxPQUFPO0FBQUEsSUFDcEQsSUFBSSxHQUFHLFdBQVcsMENBQTBDLEtBQUssR0FBRyxPQUFPO0FBQUEsTUFBRyxPQUFPO0FBQUEsSUFDckYsSUFBSSxHQUFHLFlBQVksR0FBRyxhQUFhO0FBQUEsTUFBVyxPQUFPO0FBQUEsSUFDckQsSUFBSSxHQUFHLGFBQWEsR0FBRyxjQUFjO0FBQUEsTUFBUSxPQUFPO0FBQUEsSUFDcEQsT0FBTztBQUFBO0FBQUEsRUFFVCxJQUFNLHVCQUF1QixDQUFDLElBQWEsUUFBUSxNQUE0QjtBQUFBLElBQzdFLE1BQU0sTUFBNEIsQ0FBQztBQUFBLElBQ25DLElBQUksTUFBc0IsR0FBRztBQUFBLElBQzdCLElBQUksSUFBSTtBQUFBLElBQ1IsT0FBTyxPQUFPLFFBQVEsU0FBUyxRQUFRLElBQUksT0FBTztBQUFBLE1BQ2hELElBQUk7QUFBQSxRQUNGLE1BQU0sS0FBSyxPQUFPLGlCQUFpQixHQUFHO0FBQUEsUUFDdEMsTUFBTSxjQUFjLG9CQUFvQixFQUFFO0FBQUEsUUFDMUMsSUFBSSxhQUFhO0FBQUEsVUFDZixNQUFNLFFBQTRCLEVBQUMsS0FBSyxJQUFJLFFBQVEsWUFBWSxFQUFDO0FBQUEsVUFDakUsTUFBTSxVQUFVLEdBQUc7QUFBQSxVQUNuQixNQUFNLFdBQVcsR0FBRztBQUFBLFVBQ3BCLElBQUksR0FBRyxhQUFhO0FBQUEsWUFBVyxNQUFNLFdBQVcsR0FBRztBQUFBLFVBQ25ELElBQUksR0FBRyxVQUFVLEdBQUcsV0FBVztBQUFBLFlBQVEsTUFBTSxTQUFTLEdBQUc7QUFBQSxVQUN6RCxJQUFJLEdBQUcsYUFBYSxHQUFHLGNBQWM7QUFBQSxZQUFRLE1BQU0sWUFBWSxTQUFTLEdBQUcsV0FBVyxHQUFHO0FBQUEsVUFDekYsSUFBSSxHQUFHLGNBQWMsR0FBRyxlQUFlO0FBQUEsWUFBUSxNQUFNLGFBQWEsR0FBRztBQUFBLFVBQ3JFLElBQUssSUFBb0IsY0FBYyxJQUFJLGVBQWdCLElBQW9CLGVBQWUsSUFBSSxjQUFjO0FBQUEsWUFDOUcsTUFBTSxvQkFBb0I7QUFBQSxZQUMxQixNQUFNLGFBQWMsSUFBb0I7QUFBQSxZQUN4QyxNQUFNLFlBQWEsSUFBb0I7QUFBQSxVQUN6QztBQUFBLFVBQ0EsSUFBSSxPQUFPLEtBQUssR0FBRyxPQUFPLEdBQUc7QUFBQSxZQUMzQixNQUFNLE9BQU87QUFBQSxjQUNYLFdBQVcsR0FBRztBQUFBLGNBQ2QsTUFBTSxHQUFHO0FBQUEsY0FDVCxZQUFZLEdBQUc7QUFBQSxjQUNmLGdCQUFnQixHQUFHO0FBQUEsY0FDbkIsS0FBSyxHQUFHLFFBQVEsV0FBVyxHQUFHLE1BQU07QUFBQSxZQUN0QztBQUFBLFVBQ0YsRUFBTyxTQUFJLE9BQU8sS0FBSyxHQUFHLE9BQU8sR0FBRztBQUFBLFlBQ2xDLE1BQU0sT0FBTztBQUFBLGNBQ1gsaUJBQWlCLFNBQVMsR0FBRyxxQkFBcUIsR0FBRztBQUFBLGNBQ3JELGNBQWMsU0FBUyxHQUFHLGtCQUFrQixHQUFHO0FBQUEsY0FDL0MsS0FBSyxHQUFHLFFBQVEsV0FBVyxHQUFHLE1BQU07QUFBQSxZQUN0QztBQUFBLFVBQ0Y7QUFBQSxVQUNBLElBQUksS0FBSyxLQUFLO0FBQUEsUUFDaEI7QUFBQSxRQUNBLE1BQU07QUFBQSxNQUNSLE1BQU0sSUFBSTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQVdULElBQU0sV0FBVyxDQUFDLE1BQXVEO0FBQUEsSUFFdkUsTUFBTSxJQUFJLG1FQUFtRSxLQUFLLENBQUM7QUFBQSxJQUNuRixJQUFJLEdBQUc7QUFBQSxNQUNMLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSyxFQUFFLEdBQUcsU0FBUyxFQUFFLElBQUssRUFBRSxHQUFHLFNBQVMsRUFBRSxJQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDO0FBQUEsSUFDcEc7QUFBQSxJQUNBLE1BQU0sTUFBTSxnQ0FBZ0MsS0FBSyxDQUFDO0FBQUEsSUFDbEQsSUFBSSxLQUFLO0FBQUEsTUFDUCxJQUFJLElBQUksSUFBSTtBQUFBLE1BQ1osSUFBSSxFQUFFLFdBQVc7QUFBQSxRQUFHLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUM3RCxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLEVBQUUsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUFBLElBQ2xHO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQUVULElBQU0sb0JBQW9CLEVBQUUsR0FBRyxHQUFHLE9BQWlEO0FBQUEsSUFDakYsTUFBTSxNQUFNLENBQUMsTUFBYztBQUFBLE1BQ3pCLE1BQU0sSUFBSSxJQUFJO0FBQUEsTUFDZCxPQUFPLEtBQUssVUFBVSxJQUFJLFVBQVUsSUFBSSxTQUFTLFVBQVU7QUFBQTtBQUFBLElBRTdELE9BQU8sU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLFNBQVMsSUFBSSxDQUFDO0FBQUE7QUFBQSxFQUUzRCxJQUFNLGdCQUFnQixDQUFDLElBQVksT0FBOEI7QUFBQSxJQUMvRCxNQUFNLElBQUksU0FBUyxFQUFFO0FBQUEsSUFBRyxNQUFNLElBQUksU0FBUyxFQUFFO0FBQUEsSUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUFBLE1BQUcsT0FBTztBQUFBLElBQ3JCLE1BQU0sS0FBSyxrQkFBa0IsQ0FBQztBQUFBLElBQzlCLE1BQU0sS0FBSyxrQkFBa0IsQ0FBQztBQUFBLElBQzlCLE9BQU8sSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUEsSUFDN0MsT0FBTyxLQUFLLE9BQVEsS0FBSyxTQUFTLEtBQUssUUFBUyxHQUFHLElBQUk7QUFBQTtBQUFBLEVBS3pELElBQU0sb0JBQW9CLENBQUMsT0FBK0I7QUFBQSxJQUN4RCxJQUFJLE1BQXNCO0FBQUEsSUFDMUIsT0FBTyxLQUFLO0FBQUEsTUFDVixNQUFNLEtBQUssT0FBTyxpQkFBaUIsR0FBRztBQUFBLE1BQ3RDLE1BQU0sS0FBSyxHQUFHO0FBQUEsTUFDZCxJQUFJLE1BQU0sT0FBTyxzQkFBc0IsT0FBTztBQUFBLFFBQWUsT0FBTztBQUFBLE1BQ3BFLE1BQU0sSUFBSTtBQUFBLElBQ1o7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBLEVBRVQsSUFBTSw0QkFBNEIsQ0FBQyxPQUFxSTtBQUFBLElBQ3RLLE1BQU0sTUFBb0gsQ0FBQztBQUFBLElBQzNILElBQUk7QUFBQSxNQUNGLElBQUksZUFBZSxFQUFFLEdBQUc7QUFBQSxRQUN0QixNQUFNLEtBQUssT0FBTyxpQkFBaUIsRUFBRTtBQUFBLFFBQ3JDLE1BQU0sS0FBSyxHQUFHO0FBQUEsUUFDZCxNQUFNLEtBQUssa0JBQWtCLEVBQUU7QUFBQSxRQUMvQixJQUFJLE1BQU0sSUFBSTtBQUFBLFVBQ1osTUFBTSxJQUFJLGNBQWMsSUFBSSxFQUFFO0FBQUEsVUFDOUIsSUFBSSxNQUFNLE1BQU07QUFBQSxZQUNkLElBQUksZ0JBQWdCO0FBQUEsWUFHcEIsTUFBTSxXQUFXLFdBQVcsR0FBRyxRQUFRO0FBQUEsWUFDdkMsTUFBTSxTQUFTLFNBQVMsR0FBRyxZQUFZLEVBQUUsS0FBSztBQUFBLFlBQzlDLE1BQU0sY0FBYyxZQUFZLE1BQU8sWUFBWSxNQUFNO0FBQUEsWUFDekQsTUFBTSxLQUFLLGNBQWMsSUFBSTtBQUFBLFlBQzdCLE1BQU0sTUFBTSxjQUFjLE1BQU07QUFBQSxZQUNoQyxJQUFJLGlCQUFpQixLQUFLLE1BQU0sUUFBUSxLQUFLLEtBQUssT0FBTztBQUFBLFVBQzNEO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUVBLE1BQU0sS0FBTSxHQUFtQjtBQUFBLE1BQy9CLE1BQU0sb0JBQW9CLGlFQUFpRSxLQUFLLEdBQUcsT0FBTyxLQUFLLENBQUMsR0FBRyxhQUFhLFVBQVUsTUFBTSxHQUFHLFlBQVksT0FBTyxRQUFTLEdBQXlCLElBQUk7QUFBQSxNQUM1TSxJQUFJLFdBQVcsTUFBTSxLQUFLO0FBQUEsTUFDMUIsTUFBTTtBQUFBLElBQ1IsT0FBTyxPQUFPLEtBQUssR0FBRyxFQUFFLFNBQVMsTUFBTTtBQUFBO0FBQUEsRUFPekMsSUFBTSxxQkFBcUIsQ0FBQyxPQUF5QjtBQUFBLElBQ25ELE1BQU0sS0FBTSxHQUFXO0FBQUEsSUFDdkIsSUFBSSxPQUFPLE9BQU87QUFBQSxNQUFZLE9BQU87QUFBQSxJQUNyQyxJQUFJO0FBQUEsTUFDRixNQUFNLGFBQWEsR0FBRyxLQUFLLEVBQUU7QUFBQSxNQUM3QixXQUFXLEtBQUssWUFBWTtBQUFBLFFBQzFCLElBQUksR0FBRyxjQUFjO0FBQUEsVUFBVyxPQUFPO0FBQUEsTUFDekM7QUFBQSxNQUNBLE1BQU07QUFBQSxJQUNSLE9BQU87QUFBQTtBQUFBLEVBYVQsSUFBTSxtQkFBbUI7QUFBQSxFQUN6QixJQUFNLHlCQUF5QixJQUFJLElBQUk7QUFBQSxJQUNyQztBQUFBLElBQWE7QUFBQSxJQUFhO0FBQUEsSUFBVztBQUFBLElBR3JDO0FBQUEsSUFBYTtBQUFBLEVBQ2YsQ0FBQztBQUFBLEVBQ0QsSUFBTSw0QkFBNEIsQ0FBQyxTQUE2QztBQUFBLElBQzlFLElBQUksQ0FBQztBQUFBLE1BQU0sT0FBTztBQUFBLElBQ2xCLElBQUksdUJBQXVCLElBQUksSUFBSTtBQUFBLE1BQUcsT0FBTztBQUFBLElBQzdDLElBQUksaUJBQWlCLEtBQUssSUFBSTtBQUFBLE1BQUcsT0FBTztBQUFBLElBQ3hDLE9BQU87QUFBQTtBQUFBLEVBSVQsSUFBTSxZQUFZLENBQUMsT0FBc0M7QUFBQSxJQUN2RCxNQUFNLFdBQVcsT0FBTyxLQUFLLEVBQUUsRUFBRSxLQUFLLENBQUMsTUFDckMsRUFBRSxXQUFXLGVBQWUsS0FBSyxFQUFFLFdBQVcsMEJBQTBCLENBQUM7QUFBQSxJQUMzRSxJQUFJLENBQUM7QUFBQSxNQUFVLE9BQU87QUFBQSxJQUN0QixJQUFJLE9BQWEsR0FBVztBQUFBLElBQzVCLE1BQU0sT0FBTyxJQUFJO0FBQUEsSUFDakIsSUFBSSxTQUErQjtBQUFBLElBQ25DLE9BQU8sUUFBUSxPQUFPLFNBQVMsWUFBWSxDQUFDLEtBQUssSUFBSSxJQUFJLEdBQUc7QUFBQSxNQUMxRCxLQUFLLElBQUksSUFBSTtBQUFBLE1BQ2IsTUFBTSxPQUFPLEtBQUssUUFBUSxLQUFLO0FBQUEsTUFDL0IsSUFBSSxDQUFDLFFBQVEsUUFBUSxRQUFRLE9BQU8sU0FBUyxVQUFVO0FBQUEsUUFNckQsTUFBTSxVQUFVLE9BQU8sS0FBSyxnQkFBZ0IsV0FBVyxLQUFLLGNBQWM7QUFBQSxRQUMxRSxNQUFNLFdBQVcsT0FBTyxLQUFLLFNBQVMsV0FBVyxLQUFLLE9BQU87QUFBQSxRQUM3RCxNQUFNLE9BQU8sMEJBQTBCLE9BQU8sSUFDMUMsVUFDQSwwQkFBMEIsUUFBUSxJQUFJLFdBQVk7QUFBQSxRQUN0RCxJQUFJLE1BQU07QUFBQSxVQUNSLFNBQVMsRUFBQyxXQUFXLFNBQVMsTUFBTSxTQUFTLE1BQU0sR0FBRyxFQUFDO0FBQUEsVUFDdkQsSUFBSSxXQUFXLFlBQVksTUFBTTtBQUFBLFlBQy9CLE9BQU8sY0FBYyxTQUFTLFNBQVMsR0FBRztBQUFBLFVBQzVDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLElBQUksVUFBVSxDQUFDLE9BQU8sVUFBVSxLQUFLLGNBQWM7QUFBQSxRQUNqRCxPQUFPLFNBQVM7QUFBQSxVQUNkLE1BQU0sS0FBSyxhQUFhLFlBQVksS0FBSyxhQUFhLFFBQVE7QUFBQSxVQUM5RCxNQUFNLEtBQUssYUFBYSxjQUFjLEtBQUssYUFBYSxRQUFRO0FBQUEsUUFDbEU7QUFBQSxNQUNGO0FBQUEsTUFDQSxJQUFJLEtBQUssYUFBYTtBQUFBLFFBQUUsT0FBTyxLQUFLO0FBQUEsUUFBYTtBQUFBLE1BQVU7QUFBQSxNQUMzRCxJQUFJLEtBQUssUUFBUTtBQUFBLFFBQUUsT0FBTyxLQUFLO0FBQUEsUUFBUTtBQUFBLE1BQVU7QUFBQSxNQUNqRDtBQUFBLElBQ0Y7QUFBQSxJQUlBLElBQUksQ0FBQyxRQUFRO0FBQUEsTUFBTSxPQUFPO0FBQUEsSUFPMUIsTUFBTSxRQUFrQixDQUFDO0FBQUEsSUFDekIsTUFBTSxZQUFZLElBQUk7QUFBQSxJQUN0QixJQUFJLFNBQWUsR0FBVztBQUFBLElBQzlCLE9BQU8sVUFBVSxPQUFPLFdBQVcsWUFBWSxDQUFDLFVBQVUsSUFBSSxNQUFNLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFBQSxNQUN6RixVQUFVLElBQUksTUFBTTtBQUFBLE1BQ3BCLE1BQU0sSUFBSSxPQUFPLFFBQVEsT0FBTztBQUFBLE1BQ2hDLElBQUksS0FBSyxPQUFPLE1BQU0sVUFBVTtBQUFBLFFBQzlCLE1BQU0sSUFBSyxPQUFPLEVBQUUsZ0JBQWdCLFlBQVksMEJBQTBCLEVBQUUsV0FBVyxJQUNuRixFQUFFLGNBQ0QsT0FBTyxFQUFFLFNBQVMsWUFBWSwwQkFBMEIsRUFBRSxJQUFJLElBQzdELEVBQUUsT0FDRjtBQUFBLFFBQ04sSUFBSSxNQUFNLE1BQU0sV0FBVyxLQUFLLE1BQU0sTUFBTSxTQUFTLE9BQU87QUFBQSxVQUFJLE1BQU0sS0FBSyxDQUFDO0FBQUEsTUFDOUU7QUFBQSxNQUNBLFNBQVMsT0FBTyxlQUFlLE9BQU87QUFBQSxJQUN4QztBQUFBLElBQ0EsSUFBSSxNQUFNLFNBQVM7QUFBQSxNQUFHLE9BQU8sUUFBUTtBQUFBLElBQ3JDLE9BQU87QUFBQTtBQUFBLEVBR1QsSUFBTSxVQUFVLENBQUMsT0FBc0M7QUFBQSxJQUNyRCxNQUFNLElBQVUsSUFBWSx3QkFBeUIsSUFBWSxhQUFhLGFBQzNFLElBQVksU0FBUyxhQUFjLElBQVk7QUFBQSxJQUNsRCxNQUFNLE9BQU8sR0FBRyxRQUFRLEdBQUcsS0FBSztBQUFBLElBSWhDLE1BQU0sVUFBVSxNQUFNLFFBQVEsTUFBTTtBQUFBLElBQ3BDLElBQUksQ0FBQywwQkFBMEIsT0FBTztBQUFBLE1BQUcsT0FBTztBQUFBLElBQ2hELE1BQU0sU0FBd0I7QUFBQSxNQUM1QixXQUFXO0FBQUEsTUFDWCxNQUFNLFNBQVMsU0FBUyxHQUFHO0FBQUEsTUFDM0IsUUFBUSxFQUFDLE1BQU0sTUFBTSxVQUFVLEtBQUk7QUFBQSxJQUNyQztBQUFBLElBRUEsTUFBTSxRQUFrQixDQUFDO0FBQUEsSUFDekIsSUFBSSxNQUFXO0FBQUEsSUFDZixNQUFNLE9BQU8sSUFBSTtBQUFBLElBQ2pCLE9BQU8sT0FBTyxPQUFPLFFBQVEsWUFBWSxDQUFDLEtBQUssSUFBSSxHQUFHLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFBQSxNQUMzRSxLQUFLLElBQUksR0FBRztBQUFBLE1BQ1osTUFBTSxJQUFJLElBQUksUUFBUSxJQUFJLEtBQUs7QUFBQSxNQUMvQixNQUFNLElBQUksR0FBRyxRQUFRLEdBQUc7QUFBQSxNQUN4QixJQUFJLE9BQU8sTUFBTSxZQUFZLDBCQUEwQixDQUFDLEdBQUc7QUFBQSxRQUN6RCxJQUFJLE1BQU0sV0FBVyxLQUFLLE1BQU0sTUFBTSxTQUFTLE9BQU87QUFBQSxVQUFHLE1BQU0sS0FBSyxDQUFDO0FBQUEsTUFDdkU7QUFBQSxNQUNBLE1BQU0sSUFBSTtBQUFBLElBQ1o7QUFBQSxJQUNBLElBQUksTUFBTSxTQUFTO0FBQUEsTUFBRyxPQUFPLFFBQVE7QUFBQSxJQUNyQyxPQUFPO0FBQUE7QUFBQSxFQU9ULElBQU0sVUFBVSxDQUFDLE9BQXNDO0FBQUEsSUFDckQsSUFBSSxDQUFDLEdBQUcsUUFBUSxTQUFTLEdBQUc7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUN0QyxNQUFNLE9BQVksR0FBRztBQUFBLElBQ3JCLElBQUksQ0FBQztBQUFBLE1BQU0sT0FBTztBQUFBLElBQ2xCLE1BQU0sUUFBUSxRQUNaLEtBQUssaUJBQ0wsS0FBSyxxQkFDTCxLQUFLLHdCQUNKLEtBQUssVUFBVSxNQUFNLFFBQVEsS0FBSyxNQUFNLENBQzNDO0FBQUEsSUFDQSxJQUFJLENBQUM7QUFBQSxNQUFPLE9BQU87QUFBQSxJQUluQixNQUFNLE1BQU0sR0FBRyxRQUFRLFlBQVk7QUFBQSxJQUNuQyxNQUFNLFdBQVcsT0FBTyxLQUFLLFNBQVMsV0FBVyxLQUFLLE9BQU87QUFBQSxJQUM3RCxNQUFNLE9BQU8sMEJBQTBCLFFBQVEsSUFBSSxXQUFZO0FBQUEsSUFDL0QsT0FBTztBQUFBLE1BQ0wsV0FBVztBQUFBLE1BQ1gsTUFBTSxTQUFTLE1BQU0sR0FBRztBQUFBLE1BQ3hCLGFBQWE7QUFBQSxJQUNmO0FBQUE7QUFBQSxFQU1GLElBQU0sY0FBYyxDQUFDLE9BQXNDO0FBQUEsSUFDekQsSUFBSSxDQUFDLEdBQUcsUUFBUSxTQUFTLEdBQUc7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUN0QyxNQUFNLE9BQVksR0FBRztBQUFBLElBQ3JCLElBQUksQ0FBQztBQUFBLE1BQU0sT0FBTztBQUFBLElBQ2xCLE1BQU0sZUFBZSxRQUNuQixPQUFPLEtBQUssT0FBTyxZQUFZLEtBQUssR0FBRyxTQUFTLEdBQUcsS0FDbEQsR0FBVyxjQUFjLGFBQ3pCLEdBQVcsMkJBQTJCLGFBQ3ZDLEdBQUcsYUFBYSxNQUFNLENBQ3hCO0FBQUEsSUFDQSxJQUFJLENBQUM7QUFBQSxNQUFjLE9BQU87QUFBQSxJQUMxQixNQUFNLE1BQU0sR0FBRyxRQUFRLFlBQVk7QUFBQSxJQUluQyxNQUFNLFVBQVUsT0FBTyxLQUFLLE9BQU8sV0FBVyxLQUFLLEtBQUs7QUFBQSxJQUN4RCxNQUFNLFdBQVcsT0FBTyxLQUFLLFNBQVMsV0FBVyxLQUFLLE9BQU87QUFBQSxJQUM3RCxNQUFNLE9BQU8sWUFBWSwwQkFBMEIsUUFBUSxJQUFJLFdBQVk7QUFBQSxJQUMzRSxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCxNQUFNLFNBQVMsTUFBTSxHQUFHO0FBQUEsTUFDeEIsYUFBYTtBQUFBLElBQ2Y7QUFBQTtBQUFBLEVBT0YsSUFBTSxhQUFhLENBQUMsT0FBc0M7QUFBQSxJQUN4RCxNQUFNLE9BQWEsR0FBVztBQUFBLElBQzlCLElBQUksQ0FBQyxNQUFNO0FBQUEsTUFBSyxPQUFPO0FBQUEsSUFDdkIsTUFBTSxPQUFPLE9BQU8sS0FBSyxJQUFJLFNBQVMsV0FBVyxLQUFLLElBQUksT0FBTztBQUFBLElBQ2pFLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxNQUNYLE1BQU0sU0FBUyxRQUFRLG9CQUFvQixHQUFHO0FBQUEsTUFDOUMsUUFBUTtBQUFBLFFBQ047QUFBQSxRQUNBLE1BQU0sT0FBTyxLQUFLLElBQUksU0FBUyxXQUFXLEtBQUssSUFBSSxPQUFPO0FBQUEsTUFDNUQ7QUFBQSxJQUNGO0FBQUE7QUFBQSxFQU1GLElBQU0sbUJBQW1CLENBQUMsT0FBc0M7QUFBQSxJQUM5RCxNQUFNLE1BQU0sR0FBRyxRQUFRLFlBQVk7QUFBQSxJQUNuQyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUc7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUMvQixJQUFJO0FBQUEsTUFDRixJQUFJLE9BQU8sbUJBQW1CLGVBQWUsZUFBZSxJQUFJLEdBQUcsR0FBRztBQUFBLFFBQ3BFLE9BQU87QUFBQSxVQUNMLFdBQVc7QUFBQSxVQUNYLE1BQU07QUFBQSxVQUNOLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTTtBQUFBLElBQ1IsT0FBTztBQUFBO0FBQUEsRUFNVCxJQUFNLGdCQUFnQixDQUFDLE9BQ3JCLFVBQVUsRUFBRSxLQUFLLFFBQVEsRUFBRSxLQUFLLFFBQVEsRUFBRSxLQUFLLFlBQVksRUFBRSxLQUFLLFdBQVcsRUFBRSxLQUFLLGlCQUFpQixFQUFFO0FBQUEsRUFPekcsSUFBTSxnQkFBZ0IsQ0FBQyxTQUNyQixLQUFLLFFBQVEsa0RBQ1gsQ0FBQyxJQUFJLE1BQWMsWUFDakIsUUFBUSxnQkFBZ0IsUUFBUSw0QkFBNEI7QUFBQSxFQWlCbEUsSUFBTSw4QkFBOEIsQ0FBQyxTQUFTLE9BQU87QUFBQSxFQUNyRCxJQUFNLHNCQUFzQixJQUFJLElBQUksQ0FBQyxRQUFRLFNBQVMsU0FBUyxVQUFVLFdBQVcsU0FBUyxRQUFRLE1BQU0sQ0FBQztBQUFBLEVBQzVHLElBQU0sa0JBQWtCLENBQUMsU0FDdkIsS0FBSyxRQUFRLG9DQUFvQyxDQUFDLElBQUksT0FBZSxTQUFpQjtBQUFBLElBQ3BGLE1BQU0sTUFBZ0IsQ0FBQztBQUFBLElBR3ZCLE1BQU0sU0FBUztBQUFBLElBQ2YsSUFBSTtBQUFBLElBQ0osUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLE9BQU8sTUFBTTtBQUFBLE1BQ3hDLE1BQU0sT0FBTyxFQUFFO0FBQUEsTUFDZixNQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07QUFBQSxNQUNsQyxNQUFNLE9BQU8sb0JBQW9CLElBQUksSUFBSSxLQUFLLDRCQUE0QixLQUFLLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQUEsTUFDeEcsSUFBSTtBQUFBLFFBQU0sSUFBSSxLQUFLLEdBQUcsU0FBUyxFQUFFLFFBQVEsTUFBTSxRQUFRLElBQUk7QUFBQSxJQUM3RDtBQUFBLElBSUEsTUFBTSxZQUFZLGtDQUFrQyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUs7QUFBQSxJQUMxRSxJQUFJO0FBQUEsTUFBVyxJQUFJLEtBQUssc0JBQXNCLFVBQVUsUUFBUSxNQUFNLFFBQVEsSUFBSTtBQUFBLElBQ2xGLE1BQU0sV0FBVyxnQ0FBZ0MsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLO0FBQUEsSUFDdkUsSUFBSTtBQUFBLE1BQVUsSUFBSSxLQUFLLHFCQUFxQixTQUFTLFFBQVEsTUFBTSxRQUFRLElBQUk7QUFBQSxJQUMvRSxJQUFJLEtBQUssc0JBQXNCO0FBQUEsSUFDL0IsT0FBTyxRQUFRLElBQUksS0FBSyxHQUFHO0FBQUEsR0FDNUI7QUFBQSxFQU1ILElBQU0seUJBQXlCLENBQUMsU0FDOUIsS0FDRyxRQUFRLHNEQUFzRCwyQ0FBMkMsRUFDekcsUUFBUSwyQ0FBMkMseUNBQXlDLEVBQzVGLFFBQVEseUNBQXlDLENBQUMsTUFBTTtBQUFBLElBR3ZELE1BQU0sWUFBWSxtQkFBbUIsS0FBSyxDQUFDO0FBQUEsSUFDM0MsTUFBTSxPQUFPLFlBQVksTUFBTTtBQUFBLElBQy9CLElBQUksdUNBQXVDLEtBQUssSUFBSSxHQUFHO0FBQUEsTUFDckQsT0FBTyxFQUFFLFFBQVEscUJBQXFCLGtDQUFrQztBQUFBLElBQzFFO0FBQUEsSUFDQSxPQUFPO0FBQUEsR0FDUjtBQUFBLEVBZ0JMLElBQU0seUJBQXlCLENBQUMsTUFBZSxPQUFlLFVBQWtCLFdBQTJDO0FBQUEsSUFDekgsTUFBTSxLQUFNLEtBQWE7QUFBQSxJQUN6QixJQUFJLENBQUM7QUFBQSxNQUFJLE9BQU87QUFBQSxJQUNoQixNQUFNLE9BQU8sR0FBRyxRQUFRO0FBQUEsSUFHeEIsTUFBTSxRQUFrQixDQUFDO0FBQUEsSUFDekIsV0FBVyxTQUFTLE1BQU0sS0FBSyxHQUFHLFFBQVEsR0FBRztBQUFBLE1BQzNDLE1BQU0sS0FBSyxvQkFBb0IsT0FBTyxRQUFRLEdBQUcsVUFBVSxNQUFNLENBQUM7QUFBQSxJQUNwRTtBQUFBLElBQ0EsT0FBTyw2QkFBNkIsU0FBUyxNQUFNLEtBQUssRUFBRTtBQUFBO0FBQUEsRUFNNUQsSUFBTSxzQkFBc0IsQ0FBQyxJQUFhLE9BQWUsVUFBa0IsV0FBb0M7QUFBQSxJQUc3RyxNQUFNLE1BQU0sR0FBRyxRQUFRLFlBQVk7QUFBQSxJQUNuQyxNQUFNLFFBQWtCLENBQUM7QUFBQSxJQUN6QixJQUFJLEdBQUcsWUFBWTtBQUFBLE1BQ2pCLFdBQVcsS0FBSyxNQUFNLEtBQUssR0FBRyxVQUFVLEdBQUc7QUFBQSxRQUd6QyxNQUFNLElBQUksT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLE1BQU0sT0FBTyxFQUFFLFFBQVEsTUFBTSxRQUFRO0FBQUEsUUFDdkUsTUFBTSxLQUFLLEdBQUcsRUFBRSxTQUFTLElBQUk7QUFBQSxNQUMvQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU0sT0FBTyxJQUFJLE1BQU0sTUFBTSxTQUFTLE1BQU0sTUFBTSxLQUFLLEdBQUcsSUFBSTtBQUFBLElBRTlELE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLFFBQVEsTUFBTSxPQUFPLFNBQVMsTUFBTSxPQUFPLFNBQVMsUUFBUSxRQUFRLFNBQVMsVUFBVSxTQUFTLEtBQUssQ0FBQztBQUFBLElBQ3BJLElBQUksS0FBSyxJQUFJLEdBQUc7QUFBQSxNQUFHLE9BQU87QUFBQSxJQUUxQixNQUFNLFNBQVMsdUJBQXVCLElBQUksT0FBTyxVQUFVLE1BQU07QUFBQSxJQUlqRSxJQUFJO0FBQUEsSUFDSixJQUFJLFNBQVMsWUFBWSxHQUFHLFNBQVMsUUFBUTtBQUFBLE1BQzNDLE1BQU0sUUFBUSxHQUFHLFNBQVM7QUFBQSxNQUMxQixPQUFPLFNBQVM7QUFBQSxNQUNoQixhQUFhLFFBQVEsU0FBUyxVQUFVLElBQUksVUFBVTtBQUFBLElBQ3hELEVBQU87QUFBQSxNQUNMLE1BQU0sT0FBaUIsQ0FBQztBQUFBLE1BQ3hCLFdBQVcsUUFBUSxNQUFNLEtBQUssR0FBRyxVQUFVLEdBQUc7QUFBQSxRQUM1QyxJQUFJLEtBQUssYUFBYSxHQUFpQjtBQUFBLFVBQ3JDLEtBQUssS0FBSyxvQkFBb0IsTUFBaUIsUUFBUSxHQUFHLFVBQVUsTUFBTSxDQUFDO0FBQUEsUUFDN0UsRUFBTyxTQUFJLEtBQUssYUFBYSxHQUFjO0FBQUEsVUFDekMsS0FBSyxLQUFLLE9BQU8sS0FBSyxhQUFhLEVBQUUsRUFBRSxRQUFRLE1BQU0sT0FBTyxFQUFFLFFBQVEsTUFBTSxNQUFNLEVBQUUsUUFBUSxNQUFNLE1BQU0sQ0FBQztBQUFBLFFBQzNHLEVBQU8sU0FBSSxLQUFLLGFBQWEsR0FBaUI7QUFBQSxVQUM1QyxLQUFLLEtBQUssT0FBTyxPQUFPLEtBQUssYUFBYSxFQUFFLE1BQU07QUFBQSxRQUNwRDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWEsS0FBSyxLQUFLLEVBQUU7QUFBQTtBQUFBLElBSzNCLE9BQU8sR0FBRyxPQUFPLFVBQVUsS0FBSyxlQUFlO0FBQUE7QUFBQSxFQUdqRCxJQUFNLGtCQUFrQixDQUFDLElBQWEsV0FBVyxNQUFzQztBQUFBLElBS3JGLE1BQU0sZ0JBQWdCLE1BQU07QUFBQSxNQUMxQixJQUFLLEdBQVc7QUFBQSxRQUFZLE9BQU87QUFBQSxNQUtuQyxJQUFJO0FBQUEsUUFDRixNQUFNLE9BQU8sR0FBRyxpQkFBaUIsR0FBRztBQUFBLFFBQ3BDLE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxRQUFRLEVBQUU7QUFBQSxRQUNsQyxTQUFTLElBQUksRUFBRyxJQUFJLEdBQUc7QUFBQSxVQUFLLElBQUssS0FBSyxHQUFXO0FBQUEsWUFBWSxPQUFPO0FBQUEsUUFDcEUsTUFBTTtBQUFBLE1BQ1IsT0FBTztBQUFBLE9BQ047QUFBQSxJQUNILElBQUksY0FBYztBQUFBLE1BQ2hCLE1BQU0sVUFBUyxFQUFDLE9BQU8sRUFBQztBQUFBLE1BQ3hCLElBQUk7QUFBQSxRQUNGLE1BQU0sT0FBTyxvQkFBb0IsSUFBSSxHQUFHLFVBQVUsT0FBTTtBQUFBLFFBQ3hELE9BQU8sRUFBQyxNQUFNLFFBQVEsUUFBTyxNQUFLO0FBQUEsUUFDbEMsTUFBTTtBQUFBLElBR1Y7QUFBQSxJQUNBLElBQUksU0FBUztBQUFBLElBQ2IsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLEdBQUcsVUFBVSxJQUFJO0FBQUEsTUFDL0IsTUFBTSxPQUFPLENBQUMsTUFBZSxVQUF3QjtBQUFBLFFBQ25ELElBQUksQ0FBQyxLQUFLLFlBQVksQ0FBQyxLQUFLLFNBQVM7QUFBQSxVQUFRO0FBQUEsUUFDN0MsSUFBSSxTQUFTLFVBQVU7QUFBQSxVQUNyQixNQUFNLFFBQVEsS0FBSyxTQUFTO0FBQUEsVUFDNUIsVUFBVTtBQUFBLFVBQ1YsS0FBSyxZQUFZLFFBQVEsU0FBUyxVQUFVLElBQUksVUFBVTtBQUFBLFVBQzFEO0FBQUEsUUFDRjtBQUFBLFFBQ0EsV0FBVyxTQUFTLE1BQU0sS0FBSyxLQUFLLFFBQVE7QUFBQSxVQUFHLEtBQUssT0FBTyxRQUFRLENBQUM7QUFBQTtBQUFBLE1BRXRFLEtBQUssT0FBTyxDQUFDO0FBQUEsTUFDYixPQUFPLEVBQUMsTUFBTSxNQUFNLFdBQVcsT0FBTTtBQUFBLE1BQ3JDLE1BQU07QUFBQSxNQUNOLE9BQU8sRUFBQyxNQUFNLEdBQUcsV0FBVyxRQUFRLEVBQUM7QUFBQTtBQUFBO0FBQUEsRUFPekMsSUFBTSxtQkFBbUIsQ0FBQyxNQUFjLFFBQXFEO0FBQUEsSUFDM0YsSUFBSSxDQUFDO0FBQUEsTUFBTSxPQUFPLEVBQUMsT0FBTyxLQUFJO0FBQUEsSUFDOUIsSUFBSSxVQUFVLGNBQWMsSUFBSTtBQUFBLElBQ2hDLFVBQVUsZ0JBQWdCLE9BQU87QUFBQSxJQUNqQyxVQUFVLHVCQUF1QixPQUFPO0FBQUEsSUFDeEMsSUFBSSxRQUFRLFVBQVU7QUFBQSxNQUFLLE9BQU8sRUFBQyxPQUFPLFFBQU87QUFBQSxJQUNqRCxNQUFNLGNBQWMsS0FBSztBQUFBLElBQ3pCLE1BQU0sTUFBTSxRQUFRLE1BQU0sR0FBRyxHQUFHO0FBQUEsSUFDaEMsTUFBTSxPQUFPLElBQUksWUFBWSxHQUFHO0FBQUEsSUFDaEMsTUFBTSxTQUFTLE9BQU8sTUFBTSxNQUFNLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLE9BQU87QUFBQSxJQUNsRSxPQUFPLEVBQUMsT0FBTyxXQUFXLFlBQVc7QUFBQTtFQUt2QyxJQUFNLFNBQVMsQ0FBQyxPQUFzQjtBQUFBLElBQ3BDLE1BQU0sSUFBSSxHQUFHLHNCQUFzQjtBQUFBLElBQ25DLE9BQU8sRUFBQyxHQUFHLEtBQUssTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssTUFBTSxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUssTUFBTSxFQUFFLE1BQU0sRUFBQztBQUFBO0FBQUEsRUFNakcsSUFBSSxxQkFBcUI7QUFBQSxFQUN6QixJQUFNLE9BQU8sTUFBYztBQUFBLElBQ3pCLElBQUk7QUFBQSxNQUFFLElBQUksT0FBTztBQUFBLFFBQVksT0FBTyxPQUFPLFdBQVc7QUFBQSxNQUFLLE1BQU07QUFBQSxJQUNqRSxJQUFJO0FBQUEsTUFDRixNQUFNLElBQUksSUFBSSxXQUFXLEVBQUU7QUFBQSxNQUMzQixPQUFPLGdCQUFnQixDQUFDO0FBQUEsTUFDeEIsRUFBRSxLQUFNLEVBQUUsS0FBTSxLQUFRO0FBQUEsTUFDeEIsRUFBRSxLQUFNLEVBQUUsS0FBTSxLQUFRO0FBQUEsTUFDeEIsTUFBTSxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxTQUFTLEdBQUcsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQUEsTUFDM0UsT0FBTyxHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUFBLE1BQzdGLE1BQU07QUFBQSxNQUNOLE9BQU8sT0FBTyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixTQUFTLEVBQUU7QUFBQTtBQUFBO0FBQUEsRUFTL0UsSUFBTSxpQkFBaUIsQ0FBQyxPQUF5QjtBQUFBLElBQy9DLFdBQVcsUUFBUSxNQUFNLEtBQUssR0FBRyxVQUFVLEdBQUc7QUFBQSxNQUM1QyxJQUFJLEtBQUssYUFBYSxHQUFtQjtBQUFBLFFBQ3ZDLE1BQU0sSUFBSyxLQUFjLGFBQWE7QUFBQSxRQUN0QyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVM7QUFBQSxVQUFHLE9BQU87QUFBQSxNQUNsQztBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBLEVBWVQsSUFBTSxxQkFBcUIsQ0FBQyxPQUEwQztBQUFBLElBQ3BFLElBQUksTUFBc0I7QUFBQSxJQUMxQixPQUFPLEtBQUs7QUFBQSxNQUNWLElBQUksZUFBZTtBQUFBLFFBQW1CLE9BQU87QUFBQSxNQUM3QyxNQUFNLElBQUk7QUFBQSxJQUNaO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQUdGLElBQU0sZUFBZSxDQUFDLElBQWEsVUFBa0IsT0FBb0IsQ0FBQyxNQUFhO0FBQUEsSUFDNUYsTUFBTSxNQUFNLEdBQUcsUUFBUSxZQUFZO0FBQUEsSUFNbkMsTUFBTSxZQUFZLENBQUMsR0FBRyxVQUFVLFVBQVUsZUFBZSxFQUFFO0FBQUEsSUFDM0QsTUFBTSxPQUFPLFlBQVksU0FBUyxHQUFHLGFBQWEsR0FBRyxJQUFJO0FBQUEsSUFDekQsTUFBTSxPQUFPLEtBQUssSUFBSSxNQUFNLEtBQUssYUFBYSxFQUFFO0FBQUEsSUFJaEQsTUFBTSxnQkFBZ0IsTUFBTTtBQUFBLE1BQzFCLElBQUk7QUFBQSxRQUNGLE1BQU0sS0FBSyxPQUFPLGlCQUFpQixFQUFFO0FBQUEsUUFDckMsSUFBSSxHQUFHLGlCQUFpQixHQUFHLGtCQUFrQixRQUFRO0FBQUEsVUFDbkQsTUFBTSxJQUFJLFNBQVUsR0FBbUIsV0FBVyxHQUFHO0FBQUEsVUFDckQsT0FBTyxLQUFLLE1BQU0sT0FBTyxJQUFJO0FBQUEsUUFDL0I7QUFBQSxRQUNBLE1BQU07QUFBQSxNQUNSLE9BQU87QUFBQSxPQUNOO0FBQUEsSUFDSCxNQUFNLFVBQVUsZUFBZSxJQUFJLElBQUk7QUFBQSxJQUN2QyxNQUFNLFNBQVMsS0FBSyxJQUFJLGFBQWEsS0FBSyxLQUFLLElBQUksV0FBVyxLQUM1RCxLQUFLLElBQUksU0FBUyxLQUFLLEtBQUssSUFBSSxTQUFTO0FBQUEsSUFDM0MsTUFBTSxXQUFXLFdBQVcsR0FBRyxFQUFFLElBQUksR0FBRyxLQUFLO0FBQUEsSUFDN0MsTUFBTSxVQUFVLEdBQUcsWUFBWSxNQUFNLEtBQUssR0FBRyxTQUFTLEVBQUUsTUFBTSxHQUFHLEVBQUUsSUFBSSxDQUFDO0FBQUEsSUFDeEUsUUFBTyxPQUFPLFVBQVMsZUFBZSxFQUFFO0FBQUEsSUFDeEMsTUFBTSxXQUFXLGNBQWMsRUFBRTtBQUFBLElBQ2pDLE1BQU0sTUFBTSxjQUFjLEVBQUU7QUFBQSxJQUM1QixNQUFNLGFBQWEsZUFBZSxFQUFFO0FBQUEsSUFDcEMsTUFBTSxTQUFTLGdCQUFnQixFQUFFO0FBQUEsSUFDakMsTUFBTSxTQUFTLGFBQWEsRUFBRTtBQUFBLElBQzlCLE1BQU0sUUFBUSxvQkFBb0IsRUFBRTtBQUFBLElBQ3BDLE1BQU0sT0FBTyxHQUFHLFlBQVk7QUFBQSxJQUM1QixNQUFNLFdBQVcsZ0JBQWdCO0FBQUEsSUFLakMsTUFBTSxRQUErQixXQUFZLE9BQXNCO0FBQUEsSUFTdkUsSUFBSTtBQUFBLElBQ0osSUFBSSxRQUFRO0FBQUEsTUFDVixNQUFNLFlBQVksaUJBQWlCO0FBQUEsTUFDbkMsSUFBSSxTQUFTLE9BQU8sV0FBVyxFQUFFLEdBQUc7QUFBQSxRQUNsQyxXQUFXO0FBQUEsTUFDYixFQUFPO0FBQUEsUUFNTCxNQUFNLFNBQVMsR0FBRztBQUFBLFFBQ2xCLElBQUksU0FBUztBQUFBLFFBQ2IsSUFBSSxRQUFRO0FBQUEsVUFDVixNQUFNLGNBQWMsTUFBTSxLQUFLLE9BQU8sUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsYUFBYSxHQUFHLFFBQVE7QUFBQSxVQUN4RixJQUFJLFlBQVksU0FBUyxHQUFHO0FBQUEsWUFDMUIsU0FBUyxHQUFHLHlCQUF5QixZQUFZLFFBQVEsRUFBRSxJQUFJO0FBQUEsWUFDL0QsSUFBSSxTQUFTLE9BQU8sUUFBUSxFQUFFLEdBQUc7QUFBQSxjQUMvQixXQUFXO0FBQUEsWUFDYixFQUFPO0FBQUEsY0FDTCxXQUFXLFFBQVEsRUFBRTtBQUFBO0FBQUEsVUFFekIsRUFBTztBQUFBLFlBQ0wsV0FBVyxRQUFRLEVBQUU7QUFBQTtBQUFBLFFBRXpCLEVBQU87QUFBQSxVQUNMLFdBQVcsUUFBUSxFQUFFO0FBQUE7QUFBQTtBQUFBLElBRzNCLEVBQU8sU0FBSSxVQUFVO0FBQUEsTUFDbkIsTUFBTSxRQUFRLElBQUksVUFBVSxRQUFRO0FBQUEsTUFDcEMsV0FBVyxTQUFTLE9BQU8sT0FBTyxFQUFFLElBQUksUUFBUSxRQUFRLEVBQUU7QUFBQSxJQUM1RCxFQUFPO0FBQUEsTUFDTCxXQUFXLFFBQVEsRUFBRTtBQUFBO0FBQUEsSUFRdkIsTUFBTSxhQUFhLGdCQUFnQixJQUFJLENBQUM7QUFBQSxJQUN4QyxNQUFNLFVBQVUsaUJBQWlCLFdBQVcsTUFBTSxXQUFXO0FBQUEsSUFDN0QsTUFBTSxNQUFhO0FBQUEsTUFDakIsS0FBSyxLQUFLO0FBQUEsTUFDVixHQUFHO0FBQUEsTUFDSCxJQUFJLElBQUksS0FBSyxFQUFFLFlBQVk7QUFBQSxNQUMzQixLQUFLLFNBQVM7QUFBQSxNQUNkO0FBQUEsTUFDQTtBQUFBLE1BQ0EsV0FBVyxRQUFRO0FBQUEsTUFDbkIsTUFBTSxPQUFPLEVBQUU7QUFBQSxNQU1mLFVBQVUsc0JBQXNCO0FBQUEsSUFDbEM7QUFBQSxJQUNBLElBQUksV0FBVyxTQUFTLEtBQUssUUFBUSxjQUFjLFdBQVc7QUFBQSxNQUM1RCxJQUFJLFlBQVksQ0FBQztBQUFBLE1BQ2pCLElBQUksV0FBVyxTQUFTO0FBQUEsUUFBRyxJQUFJLFVBQVUsV0FBVyxXQUFXO0FBQUEsTUFDL0QsSUFBSSxRQUFRLGNBQWM7QUFBQSxRQUFXLElBQUksVUFBVSxZQUFZLFFBQVE7QUFBQSxJQUN6RTtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQU0sSUFBSSxPQUFPO0FBQUEsSUFDckIsSUFBSTtBQUFBLE1BQWMsSUFBSSxlQUFlO0FBQUEsSUFDckMsSUFBSTtBQUFBLE1BQU0sSUFBSSxPQUFPO0FBQUEsSUFDckIsSUFBSSxXQUFXLFlBQVk7QUFBQSxNQUFNLElBQUksaUJBQWlCO0FBQUEsSUFDdEQsSUFBSTtBQUFBLE1BQVUsSUFBSSxLQUFLO0FBQUEsSUFDdkIsSUFBSTtBQUFBLE1BQVEsSUFBSSxTQUFTO0FBQUEsSUFDekIsSUFBSSxRQUFRO0FBQUEsTUFBUSxJQUFJLFVBQVU7QUFBQSxJQUNsQyxJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUU7QUFBQSxNQUFRLElBQUksUUFBUTtBQUFBLElBQzNDLElBQUk7QUFBQSxNQUFPLElBQUksUUFBUTtBQUFBLElBQ3ZCLElBQUksVUFBVTtBQUFBLE1BQ1osSUFBSSxjQUFjO0FBQUEsTUFDbEIsTUFBTSxLQUFLLG1CQUFtQixFQUFFO0FBQUEsTUFDaEMsSUFBSTtBQUFBLFFBQUksSUFBSSxhQUFhO0FBQUEsSUFDM0I7QUFBQSxJQUNBLElBQUksVUFBVTtBQUFBLE1BQVMsSUFBSSxnQkFBZ0IsU0FBUztBQUFBLElBQ3BELE1BQU0sWUFBWSxjQUFjLEVBQUU7QUFBQSxJQUNsQyxJQUFJLFVBQVU7QUFBQSxNQUFRLElBQUksWUFBWTtBQUFBLElBQ3RDLElBQUk7QUFBQSxNQUFLLElBQUksWUFBWTtBQUFBLElBQ3pCLE1BQU0sU0FBUyxrQkFBa0IsRUFBRTtBQUFBLElBQ25DLElBQUk7QUFBQSxNQUFRLElBQUksU0FBUztBQUFBLElBQ3pCLE1BQU0sZ0JBQWdCLHFCQUFxQixFQUFFO0FBQUEsSUFDN0MsSUFBSTtBQUFBLE1BQWUsSUFBSSxnQkFBZ0I7QUFBQSxJQUN2QyxJQUFJLG1CQUFtQixFQUFFO0FBQUEsTUFBRyxJQUFJLGNBQWM7QUFBQSxJQU05QyxNQUFNLFNBQTZJLENBQUM7QUFBQSxJQUNwSixJQUFJO0FBQUEsTUFDRixNQUFNLFVBQVUsR0FBRyxpQkFBaUIsS0FBSztBQUFBLE1BQ3pDLFNBQVMsSUFBSSxFQUFHLElBQUksUUFBUSxVQUFVLE9BQU8sU0FBUyxHQUFHLEtBQUs7QUFBQSxRQUM1RCxNQUFNLE1BQU0sUUFBUTtBQUFBLFFBQ3BCLE1BQU0sTUFBTSxJQUFJLGNBQWMsSUFBSTtBQUFBLFFBQ2xDLElBQUksQ0FBQyxPQUFPLElBQUksV0FBVyxPQUFPO0FBQUEsVUFBRztBQUFBLFFBQ3JDLE1BQU0sSUFBSSxJQUFJLHNCQUFzQjtBQUFBLFFBQ3BDLE9BQU8sS0FBSztBQUFBLFVBQ1YsS0FBSyxTQUFTLEtBQUssR0FBRztBQUFBLFVBQ3RCLFVBQVUsSUFBSSxnQkFBZ0I7QUFBQSxVQUM5QixVQUFVLElBQUksaUJBQWlCO0FBQUEsVUFDL0IsV0FBVyxLQUFLLE1BQU0sRUFBRSxLQUFLLEtBQUs7QUFBQSxVQUNsQyxXQUFXLEtBQUssTUFBTSxFQUFFLE1BQU0sS0FBSztBQUFBLFVBQ25DLEtBQUssSUFBSSxPQUFPO0FBQUEsVUFDaEIsUUFBUSxJQUFJLFlBQVksSUFBSSxlQUFlO0FBQUEsUUFDN0MsQ0FBQztBQUFBLE1BQ0g7QUFBQSxNQUNBLE1BQU0sVUFBVSxHQUFHLGlCQUFpQiw4QkFBOEI7QUFBQSxNQUNsRSxTQUFTLElBQUksRUFBRyxJQUFJLFFBQVEsVUFBVSxPQUFPLFNBQVMsSUFBSSxLQUFLO0FBQUEsUUFDN0QsTUFBTSxJQUFJLFFBQVE7QUFBQSxRQUNsQixNQUFNLE9BQU8sRUFBRSxhQUFhLE1BQU0sS0FBSyxFQUFFLGFBQWEsWUFBWTtBQUFBLFFBQ2xFLElBQUk7QUFBQSxVQUFNLE9BQU8sS0FBSyxFQUFDLEtBQUssU0FBUyxNQUFNLEdBQUcsRUFBQyxDQUFDO0FBQUEsTUFDbEQ7QUFBQSxNQUdBLElBQUk7QUFBQSxRQUNGLE1BQU0sS0FBSyxPQUFPLGlCQUFpQixFQUFFLEVBQUU7QUFBQSxRQUN2QyxJQUFJLE1BQU0sT0FBTyxRQUFRO0FBQUEsVUFDdkIsTUFBTSxPQUFPLHdCQUF3QixLQUFLLEVBQUU7QUFBQSxVQUM1QyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEdBQUksV0FBVyxPQUFPLEdBQUc7QUFBQSxZQUN6QyxPQUFPLEtBQUssRUFBQyxLQUFLLFNBQVMsS0FBSyxJQUFLLEdBQUcsRUFBQyxDQUFDO0FBQUEsVUFDNUM7QUFBQSxRQUNGO0FBQUEsUUFDQSxNQUFNO0FBQUEsTUFDUixNQUFNO0FBQUEsSUFDUixJQUFJLE9BQU87QUFBQSxNQUFRLElBQUksU0FBUztBQUFBLElBTWhDLE1BQU0sT0FBTywwQkFBMEIsRUFBRTtBQUFBLElBQ3pDLElBQUk7QUFBQSxNQUFNLElBQUksT0FBTztBQUFBLElBSXJCLE1BQU0sU0FBUyxxQkFBcUIsRUFBRTtBQUFBLElBQ3RDLElBQUksT0FBTztBQUFBLE1BQVEsSUFBSSxnQkFBZ0I7QUFBQSxJQUt2QyxJQUFJLHNCQUFzQjtBQUFBLE1BQ3hCLElBQUk7QUFBQSxRQUNGLE1BQU0sU0FBUyxxQkFBcUI7QUFBQSxRQU1wQyxNQUFNLGdCQUFnQjtBQUFBLFFBQ3RCLE1BQU0sV0FBVyxPQUFPLE9BQU8sQ0FBQyxNQUFNO0FBQUEsVUFDcEMsSUFBSSxjQUFjLEtBQUssRUFBRSxNQUFNO0FBQUEsWUFBRyxPQUFPO0FBQUEsVUFDekMsSUFBSSxFQUFFLFNBQVMsZ0JBQWdCLEVBQUUsaUJBQWlCLG1CQUFtQixLQUFLLEVBQUUsYUFBYSxHQUFHO0FBQUEsWUFFMUYsT0FBTyxFQUFFLEVBQUUsT0FBTyxXQUFXLE1BQU0sS0FBSyxFQUFFLE9BQU8sV0FBVyxNQUFNO0FBQUEsVUFDcEU7QUFBQSxVQUNBLE9BQU87QUFBQSxTQUNSO0FBQUEsUUFDRCxJQUFJLFNBQVM7QUFBQSxVQUFRLElBQUksZUFBZSxTQUFTLE1BQU0sRUFBRTtBQUFBLFFBQ3pELE1BQU07QUFBQSxJQUNWO0FBQUEsSUFNQSxNQUFNLFNBQVMsY0FBYyxFQUFFO0FBQUEsSUFDL0IsSUFBSTtBQUFBLE1BQVEsSUFBSSxTQUFTO0FBQUEsSUFNekIsSUFBSSxLQUFLLFNBQVM7QUFBQSxNQUNoQixNQUFNLFNBQVMsbUJBQW1CLEVBQUU7QUFBQSxNQUNwQyxJQUFJLFFBQVE7QUFBQSxRQUNWLE1BQU0sSUFBSSxPQUFPLHNCQUFzQjtBQUFBLFFBQ3ZDLElBQUksY0FBYztBQUFBLFVBQ2hCLFNBQVMsS0FBSyxNQUFNLEtBQUssUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUFBLFVBQ2pELFNBQVMsS0FBSyxNQUFNLEtBQUssUUFBUSxVQUFVLEVBQUUsR0FBRztBQUFBLFVBQ2hELFNBQVMsS0FBSyxNQUFNLEVBQUUsS0FBSztBQUFBLFVBQzNCLFNBQVMsS0FBSyxNQUFNLEVBQUUsTUFBTTtBQUFBLFVBQzVCLGlCQUFpQixNQUFNO0FBQUEsWUFBRSxJQUFJO0FBQUEsY0FBRSxPQUFPLFFBQVEsTUFBTTtBQUFBLGNBQUssTUFBTTtBQUFBLGNBQUUsT0FBTztBQUFBO0FBQUEsYUFBZTtBQUFBLFFBQ3pGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLElBQUksV0FBVztBQUFBLE1BQVEsSUFBSSxTQUFTO0FBQUEsSUFDcEMsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO0FBQUEsTUFBUSxJQUFJLFNBQVM7QUFBQSxJQUM3QyxJQUFJLE1BQU07QUFBQSxNQUFRLElBQUksZUFBZTtBQUFBLElBQ3JDLElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtBQUFBLE1BQVEsSUFBSSxpQkFBaUI7QUFBQSxJQUtyRCxJQUFJO0FBQUEsTUFDRixJQUFJLHFCQUFxQixNQUFNLGlCQUFpQixRQUFRLEVBQUU7QUFBQSxNQUMxRCxNQUFNO0FBQUEsSUFFUixPQUFPO0FBQUE7QUFBQSxFQUdULElBQU0scUJBQXFCLE1BQThCO0FBQUEsSUFDdkQsTUFBTSxLQUFLLE9BQU8saUJBQWlCLFNBQVMsZUFBZTtBQUFBLElBQzNELE1BQU0sTUFBOEIsQ0FBQztBQUFBLElBQ3JDLFNBQVMsSUFBSSxFQUFHLElBQUksR0FBRyxRQUFRLEtBQUs7QUFBQSxNQUNsQyxNQUFNLElBQUksR0FBRztBQUFBLE1BQ2IsSUFBSSxHQUFHLFdBQVcsSUFBSSxHQUFHO0FBQUEsUUFDdkIsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxLQUFLO0FBQUEsUUFDdEMsSUFBSTtBQUFBLFVBQUcsSUFBSSxLQUFLO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQU9ULElBQU0sd0JBQXdCLE1BQWdCO0FBQUEsSUFDNUMsTUFBTSxJQUFjO0FBQUEsTUFDbEIsR0FBRyxLQUFLLE1BQU0sT0FBTyxVQUFVO0FBQUEsTUFDL0IsR0FBRyxLQUFLLE1BQU0sT0FBTyxXQUFXO0FBQUEsTUFDaEMsS0FBSyxLQUFLLE9BQU8sT0FBTyxvQkFBb0IsS0FBSyxHQUFHLElBQUk7QUFBQSxJQUMxRDtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQ0YsSUFBSSxXQUFXLDhCQUE4QixFQUFFO0FBQUEsUUFBUyxFQUFFLGNBQWM7QUFBQSxNQUNuRSxTQUFJLFdBQVcsK0JBQStCLEVBQUU7QUFBQSxRQUFTLEVBQUUsY0FBYztBQUFBLE1BQzlFLElBQUksV0FBVyxrQ0FBa0MsRUFBRTtBQUFBLFFBQVMsRUFBRSxnQkFBZ0I7QUFBQSxNQUM5RSxNQUFNO0FBQUEsSUFJUixJQUFJO0FBQUEsTUFDRixNQUFNLE1BQU0sT0FBTyxpQkFBaUIsU0FBUyxlQUFlLEVBQUU7QUFBQSxNQUM5RCxJQUFJLFFBQVE7QUFBQSxRQUFPLEVBQUUsWUFBWTtBQUFBLE1BQzVCLFNBQUksUUFBUTtBQUFBLFFBQU8sRUFBRSxZQUFZO0FBQUEsTUFDdEMsTUFBTTtBQUFBLElBTVIsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFTLE9BQU8sZ0JBQXdCO0FBQUEsTUFDOUMsSUFBSSxPQUFPLFVBQVUsWUFBWSxLQUFLLElBQUksUUFBUSxDQUFDLElBQUksT0FBTztBQUFBLFFBQzVELEVBQUUsT0FBTyxLQUFLLE1BQU0sUUFBUSxHQUFHLElBQUk7QUFBQSxNQUNyQztBQUFBLE1BQ0EsTUFBTTtBQUFBLElBQ1IsT0FBTztBQUFBO0FBQUEsRUFNVCxJQUFJLFlBQVk7QUFBQSxFQUNULElBQU0saUJBQWlCLE1BQVk7QUFBQSxJQUFFLFlBQVksS0FBSyxJQUFJO0FBQUE7QUFBQSxFQUVqRSxJQUFNLHNCQUFzQixNQUE0RDtBQUFBLElBQ3RGLE1BQU0sS0FBSyxTQUFTO0FBQUEsSUFDcEIsSUFBSSxDQUFDLE1BQU0sT0FBTyxTQUFTLFFBQVEsT0FBTyxTQUFTO0FBQUEsTUFBaUIsT0FBTztBQUFBLElBQzNFLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUFFLFdBQVcsUUFBUSxFQUFFO0FBQUEsTUFBSyxNQUFNO0FBQUEsTUFBRSxXQUFXLEdBQUcsUUFBUSxZQUFZO0FBQUE7QUFBQSxJQUMxRSxNQUFNLE1BQXFELEVBQUMsU0FBUTtBQUFBLElBQ3BFLElBQUksS0FBSyxJQUFJLElBQUksWUFBWTtBQUFBLE1BQU0sSUFBSSxpQkFBaUI7QUFBQSxJQUN4RCxPQUFPO0FBQUE7QUFBQSxFQU9ULElBQU0saUJBQWlCLE1BQWlFO0FBQUEsSUFDdEYsTUFBTSxPQUFPLFNBQVMsY0FBYyw4QkFBOEI7QUFBQSxJQUNsRSxJQUFJLENBQUMsTUFBTTtBQUFBLE1BQVMsT0FBTztBQUFBLElBQzNCLE1BQU0sVUFBVSxLQUFLO0FBQUEsSUFDckIsTUFBTSxNQUEwRCxDQUFDO0FBQUEsSUFDakUsTUFBTSxTQUFTLHFCQUFxQixLQUFLLE9BQU8sSUFBSTtBQUFBLElBQ3BELE1BQU0sU0FBUyxzQkFBc0IsS0FBSyxPQUFPLElBQUk7QUFBQSxJQUNyRCxNQUFNLFFBQVEscUJBQXFCLEtBQUssT0FBTyxJQUFJO0FBQUEsSUFDbkQsSUFBSTtBQUFBLE1BQVEsSUFBSSxTQUFTLFNBQVMsUUFBUSxFQUFFO0FBQUEsSUFDNUMsSUFBSTtBQUFBLE1BQVEsSUFBSSxTQUFTLFNBQVMsUUFBUSxFQUFFO0FBQUEsSUFDNUMsSUFBSTtBQUFBLE1BQU8sSUFBSSxRQUFRLFNBQVMsT0FBTyxFQUFFO0FBQUEsSUFDekMsT0FBTyxPQUFPLEtBQUssR0FBRyxFQUFFLFNBQVMsTUFBTTtBQUFBO0FBQUEsRUFPekMsSUFBTSxxQkFBcUIsTUFBbUg7QUFBQSxJQUM1SSxNQUFNLE1BQW1ILENBQUM7QUFBQSxJQUMxSCxJQUFJO0FBQUEsTUFDRixNQUFNLElBQUksSUFBSSxJQUFJLFNBQVMsSUFBSTtBQUFBLE1BQy9CLElBQUksRUFBRTtBQUFBLFFBQVUsSUFBSSxXQUFXLEVBQUU7QUFBQSxNQUNqQyxJQUFJLEVBQUU7QUFBQSxRQUFNLElBQUksT0FBTyxFQUFFO0FBQUEsTUFDekIsTUFBTSxTQUFpQyxDQUFDO0FBQUEsTUFDeEMsSUFBSSxVQUFVO0FBQUEsTUFDZCxZQUFZLEdBQUcsTUFBTSxFQUFFLGNBQWM7QUFBQSxRQUNuQyxJQUFJLFdBQVc7QUFBQSxVQUFJO0FBQUEsUUFDbkIsT0FBTyxLQUFLLFNBQVMsR0FBRyxHQUFHO0FBQUEsUUFDM0I7QUFBQSxNQUNGO0FBQUEsTUFDQSxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7QUFBQSxRQUFRLElBQUksUUFBUTtBQUFBLE1BRTVDLE1BQU0sYUFBYSxFQUFFLGFBQWEsSUFBSSxPQUFPLEtBQUssRUFBRSxhQUFhLElBQUksS0FBSyxLQUFLLEVBQUUsYUFBYSxJQUFJLE1BQU07QUFBQSxNQUN4RyxJQUFJO0FBQUEsUUFBWSxJQUFJLFlBQVksU0FBUyxZQUFZLEVBQUU7QUFBQSxNQUN2RCxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssU0FBUyxHQUFHO0FBQUEsUUFDL0IsTUFBTSxXQUFXLEVBQUUsS0FBSyxRQUFRLFNBQVMsRUFBRTtBQUFBLFFBQzNDLE1BQU0sT0FBTyxTQUFTLE1BQU0sR0FBRyxFQUFFLE9BQU8sT0FBTztBQUFBLFFBQy9DLElBQUksS0FBSyxRQUFRO0FBQUEsVUFDZixJQUFJLFlBQVksSUFBSSxhQUFhLFNBQVMsS0FBSyxJQUFLLEVBQUU7QUFBQSxVQUN0RCxJQUFJLEtBQUssU0FBUztBQUFBLFlBQUcsSUFBSSxhQUFhLFNBQVMsS0FBSyxNQUFNLENBQUMsRUFBRSxLQUFLLEdBQUcsR0FBRyxHQUFHO0FBQUEsUUFDN0U7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNO0FBQUEsSUFDUixPQUFPO0FBQUE7QUFBQSxFQVVULElBQU0scUJBQXFCLE1BQThHO0FBQUEsSUFDdkksTUFBTSxNQUF1RyxDQUFDO0FBQUEsSUFDOUcsSUFBSTtBQUFBLE1BQ0YsTUFBTSxTQUFtQixDQUFDO0FBQUEsTUFDMUIsU0FBUyxJQUFJLEVBQUcsSUFBSSxhQUFhLFVBQVUsT0FBTyxTQUFTLElBQUksS0FBSztBQUFBLFFBQ2xFLE1BQU0sSUFBSSxhQUFhLElBQUksQ0FBQztBQUFBLFFBQzVCLElBQUk7QUFBQSxVQUFHLE9BQU8sS0FBSyxDQUFDO0FBQUEsTUFDdEI7QUFBQSxNQUNBLElBQUksT0FBTztBQUFBLFFBQVEsSUFBSSxjQUFjO0FBQUEsTUFDckMsTUFBTTtBQUFBLElBQ1IsSUFBSTtBQUFBLE1BQ0YsTUFBTSxTQUFtQixDQUFDO0FBQUEsTUFDMUIsU0FBUyxJQUFJLEVBQUcsSUFBSSxlQUFlLFVBQVUsT0FBTyxTQUFTLElBQUksS0FBSztBQUFBLFFBQ3BFLE1BQU0sSUFBSSxlQUFlLElBQUksQ0FBQztBQUFBLFFBQzlCLElBQUk7QUFBQSxVQUFHLE9BQU8sS0FBSyxDQUFDO0FBQUEsTUFDdEI7QUFBQSxNQUNBLElBQUksT0FBTztBQUFBLFFBQVEsSUFBSSxjQUFjO0FBQUEsTUFDckMsTUFBTTtBQUFBLElBQ1IsSUFBSTtBQUFBLE1BQ0YsTUFBTSxjQUFjLFNBQVMsT0FDMUIsTUFBTSxHQUFHLEVBQ1QsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxHQUFHLEVBQUUsRUFBRyxFQUNsQyxPQUFPLE9BQU8sRUFDZCxNQUFNLEdBQUcsRUFBRTtBQUFBLE1BQ2QsSUFBSSxZQUFZO0FBQUEsUUFBUSxJQUFJLGNBQWM7QUFBQSxNQUMxQyxNQUFNO0FBQUEsSUFDUixJQUFJO0FBQUEsTUFDRixNQUFNLFdBQVcsU0FBUyxjQUFjLDhCQUE4QjtBQUFBLE1BQ3RFLElBQUksVUFBVTtBQUFBLFFBQVMsSUFBSSxlQUFlLFNBQVMsU0FBUyxTQUFTLEdBQUc7QUFBQSxNQUN4RSxNQUFNO0FBQUEsSUFDUixPQUFPLE9BQU8sS0FBSyxHQUFHLEVBQUUsU0FBUyxNQUFNO0FBQUE7QUFBQSxFQUdsQyxJQUFNLG1CQUFtQixNQUFNO0FBQUEsSUFDcEMsTUFBTSxNQUFXO0FBQUEsTUFDZixLQUFLLFNBQVM7QUFBQSxNQUNkLE9BQU8sU0FBUyxTQUFTLE9BQU8sR0FBRztBQUFBLE1BQ25DLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsUUFBUSxtQkFBbUI7QUFBQSxNQUMzQixXQUFXLFNBQVMsVUFBVSxXQUFXLEdBQUc7QUFBQSxNQUM1QyxNQUFNLFNBQVMsZ0JBQWdCLGFBQWEsTUFBTSxLQUFLLFVBQVUsWUFBWTtBQUFBLElBQy9FO0FBQUEsSUFDQSxNQUFNLE1BQU0sZUFBZTtBQUFBLElBQzNCLElBQUk7QUFBQSxNQUFLLElBQUksYUFBYTtBQUFBLElBQzFCLE1BQU0sUUFBUSxvQkFBb0I7QUFBQSxJQUNsQyxJQUFJO0FBQUEsTUFBTyxJQUFJLGNBQWM7QUFBQSxJQUM3QixNQUFNLFFBQVEsbUJBQW1CO0FBQUEsSUFDakMsSUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFO0FBQUEsTUFBUSxJQUFJLFFBQVE7QUFBQSxJQUMzQyxNQUFNLFFBQVEsbUJBQW1CO0FBQUEsSUFDakMsSUFBSTtBQUFBLE1BQU8sSUFBSSxRQUFRO0FBQUEsSUFDdkIsT0FBTztBQUFBO0FBQUEsRUFJVCxJQUFNLGVBQWU7QUFBQSxFQUNyQixJQUFNLGlCQUFpQixDQUFDLE9BQ3RCLFFBQ0UsR0FBRyxhQUFhLGFBQWEsS0FBSyxHQUFHLGFBQWEsV0FBVyxLQUM3RCxHQUFHLGFBQWEsU0FBUyxLQUFLLEdBQUcsYUFBYSxTQUFTLEtBQ3ZELEdBQUcsYUFBYSxNQUFNLEtBQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxLQUFLLEdBQUcsRUFBRSxDQUMvRDtBQUFBLEVBQ0YsSUFBTSxjQUFjLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLFVBQVUsWUFBWSxNQUFNLENBQUM7QUFBQSxFQUNsRixJQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsV0FBVyxXQUFXLE9BQU8sVUFBVSxVQUFVLElBQUksQ0FBQztBQUFBLEVBQ2pGLElBQU0saUJBQWlCLENBQUMsT0FBeUIsWUFBWSxJQUFJLEdBQUcsT0FBTztFQXNCM0UsSUFBTSxxQkFBcUIsQ0FBQyxPQUF5QjtBQUFBLElBQ25ELElBQUksT0FBTyxTQUFTLFFBQVEsT0FBTyxTQUFTO0FBQUEsTUFBaUIsT0FBTztBQUFBLElBQ3BFLE1BQU0sSUFBSSxHQUFHLHNCQUFzQjtBQUFBLElBQ25DLE9BQU8sRUFBRSxTQUFTLE9BQU8sYUFBYSxPQUFPLEVBQUUsVUFBVSxPQUFPLGNBQWM7QUFBQTtBQUFBLEVBR3pFLElBQU0sa0JBQWtCLENBQzdCLEtBQ0EsZUFDQSxXQUFXLE1BQ0M7QUFBQSxJQUdaLElBQUksY0FBYyxNQUFNO0FBQUEsTUFDdEIsSUFBSSxPQUFzQjtBQUFBLE1BQzFCLE9BQU8sUUFBTyxTQUFRLFNBQVMsTUFBTTtBQUFBLFFBQ25DLFdBQVcsT0FBTyxlQUFlO0FBQUEsVUFDL0IsSUFBSTtBQUFBLFlBQUUsSUFBSSxLQUFJLFFBQVEsR0FBRztBQUFBLGNBQUcsT0FBTztBQUFBLFlBQU8sTUFBTTtBQUFBLFFBQ2xEO0FBQUEsUUFDQSxPQUFNLEtBQUk7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBT0EsSUFBSSxNQUFzQjtBQUFBLElBQzFCLFNBQVMsSUFBSSxFQUFHLEtBQUssWUFBWSxPQUFPLFFBQVEsU0FBUyxNQUFNLEtBQUs7QUFBQSxNQUNsRSxLQUFLLGVBQWUsR0FBRyxLQUFLLGVBQWUsR0FBRyxNQUFNLENBQUMsbUJBQW1CLEdBQUc7QUFBQSxRQUFHLE9BQU87QUFBQSxNQUNyRixNQUFNLElBQUk7QUFBQSxJQUNaO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQXVCRixJQUFNLHFCQUFxQixDQUFDLGdCQUFvQztBQUFBLElBQ3JFLE1BQU0sU0FBUyxNQUFNLEtBQUssU0FBUyxLQUFLLGlCQUFpQixHQUFHLENBQUM7QUFBQSxJQUM3RCxPQUFPLE9BQU8sT0FBTyxDQUFDLE9BQU87QUFBQSxNQUMzQixJQUFJLFlBQVksU0FBUyxFQUFFO0FBQUEsUUFBRyxPQUFPO0FBQUEsTUFDckMsTUFBTSxJQUFJLEdBQUcsc0JBQXNCO0FBQUEsTUFDbkMsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLFdBQVc7QUFBQSxRQUFHLE9BQU87QUFBQSxNQUc1QyxJQUFJLEVBQUUsUUFBUSxPQUFPLGFBQWEsT0FBTyxFQUFFLFNBQVMsT0FBTyxjQUFjO0FBQUEsUUFBSyxPQUFPO0FBQUEsTUFDckYsT0FBTztBQUFBLEtBQ1I7QUFBQTtBQUFBLEVBR0ksSUFBTSxpQkFBaUIsQ0FDNUIsWUFDQSxJQUFZLElBQVksSUFBWSxJQUNwQyxPQUEyQixjQUNiO0FBQUEsSUFDZCxNQUFNLE9BQU8sS0FBSyxJQUFJLElBQUksRUFBRTtBQUFBLElBQzVCLE1BQU0sT0FBTyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQUEsSUFDNUIsTUFBTSxPQUFPLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFBQSxJQUM1QixNQUFNLE9BQU8sS0FBSyxJQUFJLElBQUksRUFBRTtBQUFBLElBQzVCLE1BQU0sVUFBcUIsQ0FBQztBQUFBLElBQzVCLFdBQVcsTUFBTSxZQUFZO0FBQUEsTUFDM0IsTUFBTSxJQUFJLEdBQUcsc0JBQXNCO0FBQUEsTUFDbkMsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLFdBQVc7QUFBQSxRQUFHO0FBQUEsTUFDckMsSUFBSSxTQUFTLFFBQVE7QUFBQSxRQUNuQixJQUFJLEVBQUUsT0FBTyxRQUFRLEVBQUUsTUFBTSxRQUFRLEVBQUUsUUFBUSxRQUFRLEVBQUUsU0FBUztBQUFBLFVBQU07QUFBQSxNQUMxRSxFQUFPO0FBQUEsUUFDTCxJQUFJLEVBQUUsUUFBUSxRQUFRLEVBQUUsT0FBTyxRQUFRLEVBQUUsU0FBUyxRQUFRLEVBQUUsTUFBTTtBQUFBLFVBQU07QUFBQTtBQUFBLE1BRTFFLFFBQVEsS0FBSyxFQUFFO0FBQUEsSUFDakI7QUFBQSxJQWdCQSxPQUFPLFFBQVEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssQ0FBQyxNQUFNLE1BQU0sS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFBQTs7O0VDcitDN0UsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUN6RixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBLEVBS0osSUFBTSxLQUFLLENBQTJCLGFBQzFDLEVBQUMsTUFBTSxNQUFNLE9BQU8sT0FBTyxNQUFNLFFBQU87OztFQ3ZvQjNDLElBQU0sUUFBZ0M7QUFBQSxJQUNwQyxpQkFBaUI7QUFBQSxJQUNqQixnQkFBZ0I7QUFBQSxJQUNoQixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxNQUFNO0FBQUEsSUFDTixHQUFHO0FBQUEsSUFDSCxPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixvQkFBb0I7QUFBQSxJQUNwQixpQkFBaUI7QUFBQSxJQUNqQix1QkFBdUI7QUFBQSxJQUN2QixnQkFBZ0I7QUFBQSxJQUNoQixjQUFjO0FBQUEsSUFDZCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixPQUFPO0FBQUEsSUFFUCxPQUFPO0FBQUEsSUFDUCxlQUFlO0FBQUEsSUFDZixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixPQUFPO0FBQUEsSUFDUCxnQkFBZ0I7QUFBQSxJQUNoQixNQUFNO0FBQUEsSUFFTixRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFHTixhQUFhO0FBQUEsSUFFYixPQUFPO0FBQUEsSUFFUCxTQUFTO0FBQUEsSUFFVCxNQUFNO0FBQUEsSUFFTixVQUFVO0FBQUEsRUFDWjtBQUFBLEVBRUEsSUFBTSxPQUFPLENBQUMsTUFBYyxTQUMxQixrREFBa0QsaUJBQWlCLCtIQUErSDtBQUFBLEVBRTdMLElBQU0sV0FBVztBQUFBLElBQ3RCLEtBQUssQ0FBQyxVQUEwQixRQUFRO0FBQUEsSUFDeEMsV0FBVyxDQUFDLE1BQWMsT0FBTyxPQUFlO0FBQUEsTUFDOUMsTUFBTSxPQUFPLE1BQU07QUFBQSxNQUNuQixJQUFJLENBQUMsTUFBTTtBQUFBLFFBQ1QsUUFBUSxLQUFLLHlCQUF5QixJQUFJO0FBQUEsUUFDMUMsT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLE9BQU8sS0FBSyxNQUFNLElBQUk7QUFBQTtBQUFBLElBRXhCLE9BQU8sQ0FBQyxJQUFvQixNQUFjLFNBQXdCO0FBQUEsTUFDaEUsSUFBSTtBQUFBLFFBQUksR0FBRyxZQUFZLFNBQVMsVUFBVSxNQUFNLElBQUk7QUFBQTtBQUFBLEVBRXhEO0FBQUEsRUFJQSxJQUFJLE9BQU8sZUFBZSxhQUFhO0FBQUEsSUFDcEMsV0FBbUIsV0FBVztBQUFBLEVBQ2pDOzs7RUN6QkEsSUFBTSxNQUFNO0FBQUEsRUFDWixJQUFNLE1BQU07QUFBQSxFQUVaLElBQUksT0FBTyxNQUFNO0FBQUEsSUFDZixRQUFRLElBQUksS0FBSywrQkFBK0I7QUFBQSxFQUNsRCxFQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUE7QUFBQSxFQUdQLFNBQVMsSUFBSSxHQUFTO0FBQUEsSUFRcEIsSUFBSTtBQUFBLE1BQUUsU0FBUyxjQUFjLElBQUksTUFBTSxzQkFBc0IsQ0FBQztBQUFBLE1BQUssTUFBTTtBQUFBLElBQ3pFLFNBQVMsZUFBZSxxQkFBcUIsR0FBRyxPQUFPO0FBQUEsSUFFdkQsTUFBTSxjQUFjLE9BQU8sV0FBVyxlQUFlLFFBQVEsT0FBTyxTQUFTLEVBQUU7QUFBQSxJQUMvRSxNQUFNLGVBQWUsY0FBYyxPQUFRLENBQUM7QUFBQSxJQU01QyxJQUFJLFlBQVk7QUFBQSxJQUNoQixNQUFNLGVBQWUsTUFBZTtBQUFBLE1BQ2xDLElBQUksQ0FBQztBQUFBLFFBQWEsT0FBTztBQUFBLE1BQ3pCLElBQUk7QUFBQSxRQUFFLE9BQU8sUUFBUSxPQUFPLFNBQVMsRUFBRTtBQUFBLFFBQUssTUFBTTtBQUFBLFFBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxJQUU3RCxNQUFNLGNBQWMsTUFBZTtBQUFBLE1BQ2pDLElBQUk7QUFBQSxRQUFXLE9BQU87QUFBQSxNQUN0QixJQUFJLGFBQWE7QUFBQSxRQUFHLE9BQU87QUFBQSxNQUMzQixRQUFRLEtBQUssS0FBSyxzRUFBcUU7QUFBQSxNQUN2RixJQUFJO0FBQUEsUUFBRSxPQUFPLE1BQU0sUUFBUTtBQUFBLFFBQUssTUFBTTtBQUFBLE1BQ3RDLE9BQU87QUFBQTtBQUFBLElBUVQsTUFBTSxjQUFjLFNBQVMsY0FBYyxLQUFLO0FBQUEsSUFDaEQsWUFBWSxLQUFLO0FBQUEsSUFDakIsT0FBTyxPQUFPLFlBQVksT0FBTztBQUFBLE1BQy9CLEtBQUs7QUFBQSxNQUFXLFVBQVU7QUFBQSxNQUFTLEtBQUs7QUFBQSxNQUFLLE1BQU07QUFBQSxNQUFLLE9BQU87QUFBQSxNQUFLLFFBQVE7QUFBQSxNQUM1RSxlQUFlO0FBQUEsTUFBUSxRQUFRO0FBQUEsSUFDakMsQ0FBQztBQUFBLElBQ0QsU0FBUyxnQkFBZ0IsWUFBWSxXQUFXO0FBQUEsSUFDaEQsTUFBTSxTQUFTLFlBQVksYUFBYSxFQUFDLE1BQU0sT0FBTSxDQUFDO0FBQUEsSUFXdEQsTUFBTSxvQkFBb0IsTUFBWTtBQUFBLE1BQ3BDLElBQUksRUFBRSxpQkFBaUI7QUFBQSxRQUFjO0FBQUEsTUFDckMsSUFBSTtBQUFBLFFBQ0YsWUFBWSxhQUFhLFdBQVcsUUFBUTtBQUFBLFFBQzVDLE9BQU8sT0FBTyxZQUFZLE9BQU87QUFBQSxVQUMvQixRQUFRO0FBQUEsVUFBSyxRQUFRO0FBQUEsVUFBSyxTQUFTO0FBQUEsVUFDbkMsT0FBTztBQUFBLFVBQVEsUUFBUTtBQUFBLFVBQ3ZCLFlBQVk7QUFBQSxVQUFlLFVBQVU7QUFBQSxVQUFXLE9BQU87QUFBQSxRQUN6RCxDQUFDO0FBQUEsUUFDRCxJQUFJLENBQUMsWUFBWSxRQUFRLGVBQWU7QUFBQSxVQUFHLFlBQVksWUFBWTtBQUFBLFFBQ25FLE9BQU8sR0FBRztBQUFBLFFBQ1YsUUFBUSxLQUFLLEtBQUsscURBQW9ELENBQUM7QUFBQSxRQUN2RSxJQUFJO0FBQUEsVUFBRSxZQUFZLGdCQUFnQixTQUFTO0FBQUEsVUFBSyxNQUFNO0FBQUE7QUFBQTtBQUFBLElBTTFELE1BQU0sZUFBZSxNQUFZO0FBQUEsTUFDL0IsSUFBSSxFQUFFLGlCQUFpQjtBQUFBLFFBQWM7QUFBQSxNQUNyQyxJQUFJLFlBQVksTUFBTSxZQUFZO0FBQUEsUUFBUTtBQUFBLE1BQzFDLElBQUk7QUFBQSxRQUNGLElBQUksWUFBWSxRQUFRLGVBQWU7QUFBQSxVQUFHLFlBQVksWUFBWTtBQUFBLFFBQ2xFLFlBQVksWUFBWTtBQUFBLFFBQ3hCLE1BQU07QUFBQSxRQUFFLGtCQUFrQjtBQUFBO0FBQUE7QUFBQSxJQUU5QixrQkFBa0I7QUFBQSxJQU9sQixNQUFNLFlBQVksU0FBUyxnQkFBZ0IsOEJBQThCLEtBQUs7QUFBQSxJQUM5RSxPQUFPLE9BQU8sVUFBVSxPQUFPO0FBQUEsTUFDN0IsVUFBVTtBQUFBLE1BQVMsS0FBSztBQUFBLE1BQUssTUFBTTtBQUFBLE1BQ25DLE9BQU87QUFBQSxNQUFRLFFBQVE7QUFBQSxNQUN2QixlQUFlO0FBQUEsTUFDZixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsSUFJRCxNQUFNLFFBQVEsSUFBSTtBQUFBLElBQ2xCLE1BQU0sWUFBMEM7QUFBQSxNQUM5QyxVQUFVO0FBQUEsTUFBUyxlQUFlO0FBQUEsTUFDbEMsUUFBUTtBQUFBLE1BQ1IsY0FBYztBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ1gsWUFBWTtBQUFBLE1BQ1osV0FBVztBQUFBLE1BQ1gsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLE1BQU0sWUFBMEM7QUFBQSxNQUM5QyxhQUFhO0FBQUEsTUFDYixXQUFXO0FBQUEsSUFDYjtBQUFBLElBR0EsTUFBTSxlQUE2QztBQUFBLE1BQ2pELGFBQWE7QUFBQSxNQUNiLGFBQWE7QUFBQSxNQUNiLFdBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxNQUFNLGFBQTJDO0FBQUEsTUFDL0MsVUFBVTtBQUFBLE1BQVMsZUFBZTtBQUFBLE1BQ2xDLFlBQVk7QUFBQSxNQUFzQixPQUFPO0FBQUEsTUFDekMsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQVcsY0FBYztBQUFBLE1BQ2xDLE9BQU87QUFBQSxNQUFTLFFBQVE7QUFBQSxNQUN4QixZQUFZO0FBQUEsTUFBVSxVQUFVO0FBQUEsTUFBVSxjQUFjO0FBQUEsTUFDeEQsWUFBWTtBQUFBLE1BQ1osV0FBVztBQUFBLE1BQ1gsU0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBLE1BQU0sYUFBYSxDQUFDLFFBQXNCO0FBQUEsTUFDeEMsSUFBSSxPQUFPLE1BQU0sSUFBSSxHQUFHO0FBQUEsTUFDeEIsSUFBSTtBQUFBLFFBQU0sT0FBTztBQUFBLE1BR2pCLE1BQU0sS0FBSyxTQUFTLGNBQWMsS0FBSztBQUFBLE1BQ3ZDLEdBQUcsWUFBWTtBQUFBLE1BQ2YsT0FBTyxPQUFPLEdBQUcsT0FBTyxTQUFTO0FBQUEsTUFDakMsTUFBTSxRQUFRLFNBQVMsY0FBYyxLQUFLO0FBQUEsTUFDMUMsTUFBTSxZQUFZO0FBQUEsTUFDbEIsT0FBTyxPQUFPLE1BQU0sT0FBTyxVQUFVO0FBQUEsTUFFckMsTUFBTSxPQUFPLFNBQVMsZ0JBQWdCLDhCQUE4QixNQUFNO0FBQUEsTUFDMUUsS0FBSyxhQUFhLFFBQVEsTUFBTTtBQUFBLE1BQ2hDLEtBQUssYUFBYSxnQkFBZ0IsS0FBSztBQUFBLE1BQ3ZDLEtBQUssYUFBYSxrQkFBa0IsT0FBTztBQUFBLE1BQzNDLEtBQUssYUFBYSxXQUFXLEtBQUs7QUFBQSxNQUNsQyxJQUFJLENBQUMsVUFBVTtBQUFBLFFBQWEsT0FBTyxPQUFPLFNBQVM7QUFBQSxNQUNuRCxVQUFVLE9BQU8sSUFBSTtBQUFBLE1BQ3JCLE9BQU8sT0FBTyxJQUFJLEtBQUs7QUFBQSxNQUN2QixPQUFPLEVBQUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxHQUFHLFFBQVEsS0FBSTtBQUFBLE1BQzdDLE1BQU0sSUFBSSxLQUFLLElBQUk7QUFBQSxNQUNuQixPQUFPO0FBQUE7QUFBQSxJQUVULE1BQU0sYUFBYSxDQUFDLFFBQXNCO0FBQUEsTUFDeEMsTUFBTSxPQUFPLE1BQU0sSUFBSSxHQUFHO0FBQUEsTUFDMUIsSUFBSSxDQUFDO0FBQUEsUUFBTTtBQUFBLE1BQ1gsSUFBSSxLQUFLO0FBQUEsUUFBSyxxQkFBcUIsS0FBSyxHQUFHO0FBQUEsTUFDM0MsS0FBSyxHQUFHLE9BQU87QUFBQSxNQUNmLEtBQUssTUFBTSxPQUFPO0FBQUEsTUFDbEIsS0FBSyxLQUFLLE9BQU87QUFBQSxNQUNqQixNQUFNLE9BQU8sR0FBRztBQUFBLE1BQ2hCLGNBQWMsT0FBTyxHQUFHO0FBQUE7QUFBQSxJQUUxQixNQUFNLGFBQWEsTUFBWTtBQUFBLE1BQzdCLFdBQVcsS0FBSyxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFBQSxRQUFHLFdBQVcsQ0FBQztBQUFBLE1BQy9DLFVBQVUsT0FBTztBQUFBO0FBQUEsSUFHbkIsTUFBTSxlQUFlLENBQUMsTUFBWSxRQUFpQixTQUF5QjtBQUFBLE1BQzFFLE1BQU0sSUFBSSxPQUFPLHNCQUFzQjtBQUFBLE1BQ3ZDLE1BQU0sWUFBWSxLQUFLLEdBQUc7QUFBQSxNQUMxQixVQUFVLE9BQU8sR0FBRyxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sQ0FBQztBQUFBLE1BQzFDLFVBQVUsTUFBTSxHQUFHLEtBQUssSUFBSSxHQUFHLEVBQUUsTUFBTSxDQUFDO0FBQUEsTUFDeEMsVUFBVSxRQUFRLEdBQUcsS0FBSyxJQUFJLEdBQUcsRUFBRSxRQUFRLENBQUM7QUFBQSxNQUM1QyxVQUFVLFNBQVMsR0FBRyxLQUFLLElBQUksR0FBRyxFQUFFLFNBQVMsQ0FBQztBQUFBLE1BQzlDLFVBQVUsVUFBVTtBQUFBLE1BQ3BCLElBQUksS0FBSyxTQUFTO0FBQUEsUUFDaEIsT0FBTyxPQUFPLFdBQVcsWUFBWTtBQUFBLE1BQ3ZDLEVBQU8sU0FBSSxLQUFLLE1BQU07QUFBQSxRQUNwQixPQUFPLE9BQU8sV0FBVyxTQUFTO0FBQUEsUUFDbEMsVUFBVSxjQUFjO0FBQUEsTUFDMUIsRUFBTztBQUFBLFFBQ0wsVUFBVSxjQUFjO0FBQUEsUUFDeEIsVUFBVSxZQUFZLFVBQVU7QUFBQSxRQUNoQyxVQUFVLGNBQWM7QUFBQTtBQUFBLE1BRTFCLFVBQVUsY0FBYyxLQUFLLFNBQVMsV0FBVztBQUFBLE1BSWpELEtBQUssTUFBTSxNQUFNLFVBQVU7QUFBQSxNQVMzQixNQUFNLFVBQVU7QUFBQSxNQUNoQixNQUFNLFFBQVEsRUFBRSxPQUFPO0FBQUEsTUFDdkIsTUFBTSxRQUFRLEVBQUUsUUFBUTtBQUFBLE1BQ3hCLE1BQU0sUUFBUSxFQUFFLE1BQU07QUFBQSxNQUN0QixNQUFNLFFBQVEsRUFBRSxTQUFTO0FBQUEsTUFDekIsTUFBTSxLQUFLLE9BQU87QUFBQSxNQUNsQixNQUFNLEtBQUssT0FBTyxjQUFjO0FBQUEsTUFFaEMsTUFBTSxLQUFLLEtBQUssSUFBSSxPQUFPLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQztBQUFBLE1BQzlDLE1BQU0sS0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUM7QUFBQSxNQUM5QyxJQUFJLEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxFQUFFLElBQUksSUFBSTtBQUFBLFFBR3JDLEtBQUssS0FBSyxhQUFhLEtBQUssRUFBRTtBQUFBLE1BQ2hDLEVBQU87QUFBQSxRQUlMLE1BQU0sTUFBTSxLQUFLLElBQUksTUFBTTtBQUFBLFFBQzNCLE1BQU0sYUFBYSxLQUFLLFFBQVEsS0FBSyxLQUFLLFFBQVEsTUFBTTtBQUFBLFFBQ3hELE1BQU0sTUFBTSxLQUFLLFlBQVksTUFBTTtBQUFBLFFBQ25DLEtBQUssS0FBSyxhQUFhLEtBQUssS0FBSyxNQUFNLFFBQVEsT0FBTyxRQUFRLE9BQU8sUUFBUSxNQUFNLElBQUk7QUFBQTtBQUFBLE1BSXpGLE1BQU0sU0FBUyxLQUFLLFVBQVUsWUFBWSxLQUFLLE9BQU8sWUFBWTtBQUFBLE1BQ2xFLEtBQUssS0FBSyxhQUFhLFVBQVUsTUFBTTtBQUFBO0FBQUEsSUFVekMsSUFBSSxnQkFBZ0I7QUFBQSxJQUVwQixNQUFNLGdCQUFnQixJQUFJO0FBQUEsSUFDMUIsTUFBTSxjQUFjLENBQUMsS0FBYSxJQUFhLFNBQXlCO0FBQUEsTUFDdEUsTUFBTSxPQUFPLE1BQU0sSUFBSSxHQUFHO0FBQUEsTUFDMUIsSUFBSSxDQUFDO0FBQUEsUUFBTTtBQUFBLE1BQ1gsSUFBSSxLQUFLO0FBQUEsUUFBSyxxQkFBcUIsS0FBSyxHQUFHO0FBQUEsTUFDM0MsTUFBTSxPQUFPLE1BQVk7QUFBQSxRQUN2QixJQUFJLENBQUMsR0FBRyxhQUFhO0FBQUEsVUFBRSxXQUFXLEdBQUc7QUFBQSxVQUFHLGNBQWMsT0FBTyxHQUFHO0FBQUEsVUFBRztBQUFBLFFBQVE7QUFBQSxRQUMzRSxJQUFJLGVBQWU7QUFBQSxVQUFFLEtBQUssTUFBTTtBQUFBLFVBQUc7QUFBQSxRQUFRO0FBQUEsUUFDM0MsYUFBYSxNQUFNLElBQUksSUFBSTtBQUFBLFFBQzNCLEtBQUssTUFBTSxzQkFBc0IsSUFBSTtBQUFBO0FBQUEsTUFFdkMsS0FBSztBQUFBO0FBQUEsSUFFUCxNQUFNLGVBQWUsQ0FBQyxLQUFhLElBQWEsT0FBaUIsQ0FBQyxNQUFZO0FBQUEsTUFDNUUsTUFBTSxPQUFPLFdBQVcsR0FBRztBQUFBLE1BQzNCLEtBQUssU0FBUztBQUFBLE1BQ2QsY0FBYyxJQUFJLEtBQUssRUFBQyxJQUFJLEtBQUksQ0FBQztBQUFBLE1BQ2pDLFlBQVksS0FBSyxJQUFJLElBQUk7QUFBQSxNQUd6QixhQUFhO0FBQUE7QUFBQSxJQUlmLE1BQU0sY0FBYyxNQUFZO0FBQUEsTUFDOUIsV0FBVyxRQUFRLE1BQU0sT0FBTyxHQUFHO0FBQUEsUUFDakMsSUFBSSxLQUFLLEtBQUs7QUFBQSxVQUFFLHFCQUFxQixLQUFLLEdBQUc7QUFBQSxVQUFHLEtBQUssTUFBTTtBQUFBLFFBQUc7QUFBQSxNQUNoRTtBQUFBO0FBQUEsSUFJRixNQUFNLFlBQVksTUFBWTtBQUFBLE1BQzVCLFlBQVksT0FBTSxJQUFJLFdBQVU7QUFBQSxRQUFlLFlBQVksS0FBSyxJQUFJLElBQUk7QUFBQTtBQUFBLElBRzFFLE1BQU0sZUFBZSxDQUFDLE9BQXNCO0FBQUEsTUFDMUMsTUFBTSxPQUFPLFdBQVcsT0FBTztBQUFBLE1BQy9CLGFBQWEsTUFBTSxJQUFJLENBQUMsQ0FBQztBQUFBLE1BRXpCLEtBQUssR0FBRyxRQUFRO0FBQUEsUUFDZCxFQUFDLFNBQVMsR0FBRyxXQUFXLGVBQWUsYUFBYSxXQUFXLFdBQVcsaUNBQWdDO0FBQUEsUUFDMUcsRUFBQyxTQUFTLEdBQUcsV0FBVyxXQUFVO0FBQUEsTUFDcEMsR0FBRyxFQUFDLFVBQVUsS0FBSyxRQUFRLFlBQVksTUFBTSxXQUFVLENBQUM7QUFBQSxNQUN4RCxXQUFXLE1BQU0sV0FBVyxPQUFPLEdBQUcsR0FBRztBQUFBO0FBQUEsSUFTM0MsTUFBTSxjQUFjLENBQUMsT0FBc0I7QUFBQSxNQUN6QyxNQUFNLElBQUksR0FBRyxzQkFBc0I7QUFBQSxNQUNuQyxJQUFJLEVBQUUsVUFBVSxLQUFLLEVBQUUsV0FBVztBQUFBLFFBQUc7QUFBQSxNQUNyQyxHQUFHLGVBQWUsRUFBQyxVQUFVLFVBQVUsT0FBTyxVQUFVLFFBQVEsU0FBUSxDQUFDO0FBQUEsTUFDekUsTUFBTSxPQUFPLFdBQVcsUUFBUTtBQUFBLE1BQ2hDLGFBQWEsTUFBTSxJQUFJLENBQUMsQ0FBQztBQUFBLE1BQ3pCLE9BQU8sT0FBTyxLQUFLLEdBQUcsT0FBTztBQUFBLFFBQzNCLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLFdBQVc7QUFBQSxRQUNYLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxNQUVELEtBQUssR0FBRyxRQUFRO0FBQUEsUUFDZCxFQUFDLFdBQVcsZUFBZSxTQUFTLEdBQUcsV0FBVyxnRUFBK0Q7QUFBQSxRQUNqSCxFQUFDLFdBQVcsZUFBZSxTQUFTLEdBQUcsV0FBVyxpRUFBZ0U7QUFBQSxRQUNsSCxFQUFDLFdBQVcsZUFBZSxTQUFTLEdBQUcsV0FBVyxnRUFBK0Q7QUFBQSxRQUNqSCxFQUFDLFdBQVcsZUFBZSxTQUFTLEdBQUcsV0FBVyxpRUFBZ0U7QUFBQSxRQUNsSCxFQUFDLFdBQVcsZUFBZSxTQUFTLEdBQUcsV0FBVyxnRUFBK0Q7QUFBQSxRQUNqSCxFQUFDLFdBQVcsZUFBZSxTQUFTLEdBQUcsV0FBVyxpRUFBZ0U7QUFBQSxRQUNsSCxFQUFDLFdBQVcsZUFBZSxTQUFTLEVBQUM7QUFBQSxNQUN2QyxHQUFHLEVBQUMsVUFBVSxNQUFNLFFBQVEsZUFBZSxNQUFNLFdBQVUsQ0FBQztBQUFBLE1BQzVELFdBQVcsTUFBTSxXQUFXLFFBQVEsR0FBRyxJQUFJO0FBQUE7QUFBQSxJQVE3QyxJQUFJLGlCQUFpQjtBQUFBLElBQ3JCLE1BQU0sY0FBZ0MsQ0FBQztBQUFBLElBQ3ZDLE1BQU0sb0JBQW9CLE1BQXdCO0FBQUEsTUFDaEQsSUFBSSxZQUFZO0FBQUEsUUFBUSxPQUFPO0FBQUEsTUFDL0IsU0FBUyxJQUFJLEVBQUcsSUFBSSxHQUFHLEtBQUs7QUFBQSxRQUMxQixNQUFNLElBQUksU0FBUyxjQUFjLEtBQUs7QUFBQSxRQUN0QyxPQUFPLE9BQU8sRUFBRSxPQUFPO0FBQUEsVUFDckIsVUFBVTtBQUFBLFVBQVMsZUFBZTtBQUFBLFVBQ2xDLFdBQVc7QUFBQSxVQUFjLFNBQVM7QUFBQSxVQUNsQyxZQUFZLElBQUksSUFBSSx5QkFBeUI7QUFBQSxRQUMvQyxDQUFDO0FBQUEsUUFDRCxPQUFPLE9BQU8sQ0FBQztBQUFBLFFBQ2YsWUFBWSxLQUFLLENBQUM7QUFBQSxNQUNwQjtBQUFBLE1BQ0EsT0FBTztBQUFBO0FBQUEsSUFFVCxNQUFNLHNCQUFzQixNQUFZO0FBQUEsTUFDdEMsV0FBVyxLQUFLO0FBQUEsUUFBYSxFQUFFLE1BQU0sVUFBVTtBQUFBO0FBQUEsSUFFakQsTUFBTSxzQkFBc0IsQ0FBQyxPQUFzQjtBQUFBLE1BQ2pELElBQUksQ0FBQyxnQkFBZ0I7QUFBQSxRQUFFLG9CQUFvQjtBQUFBLFFBQUc7QUFBQSxNQUFRO0FBQUEsTUFDdEQsTUFBTSxLQUFLLE9BQU8saUJBQWlCLEVBQUU7QUFBQSxNQUNyQyxNQUFNLElBQUksR0FBRyxzQkFBc0I7QUFBQSxNQUNuQyxNQUFNLEtBQUssV0FBVyxHQUFHLFNBQVMsS0FBSztBQUFBLE1BQ3ZDLE1BQU0sS0FBSyxXQUFXLEdBQUcsV0FBVyxLQUFLO0FBQUEsTUFDekMsTUFBTSxLQUFLLFdBQVcsR0FBRyxZQUFZLEtBQUs7QUFBQSxNQUMxQyxNQUFNLEtBQUssV0FBVyxHQUFHLFVBQVUsS0FBSztBQUFBLE1BQ3hDLE1BQU0sS0FBSyxXQUFXLEdBQUcsVUFBVSxLQUFLO0FBQUEsTUFDeEMsTUFBTSxLQUFLLFdBQVcsR0FBRyxZQUFZLEtBQUs7QUFBQSxNQUMxQyxNQUFNLEtBQUssV0FBVyxHQUFHLGFBQWEsS0FBSztBQUFBLE1BQzNDLE1BQU0sS0FBSyxXQUFXLEdBQUcsV0FBVyxLQUFLO0FBQUEsTUFDekMsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLE1BQU0sa0JBQWtCO0FBQUEsTUFFM0QsTUFBTSxNQUFNLENBQUMsR0FBbUIsR0FBVyxHQUFXLEdBQVcsTUFBb0I7QUFBQSxRQUNuRixJQUFJLEtBQUssS0FBSyxLQUFLLEdBQUc7QUFBQSxVQUFFLEVBQUUsTUFBTSxVQUFVO0FBQUEsVUFBUTtBQUFBLFFBQVE7QUFBQSxRQUMxRCxFQUFFLE1BQU0sT0FBTyxJQUFJO0FBQUEsUUFDbkIsRUFBRSxNQUFNLE1BQU0sSUFBSTtBQUFBLFFBQ2xCLEVBQUUsTUFBTSxRQUFRLElBQUk7QUFBQSxRQUNwQixFQUFFLE1BQU0sU0FBUyxJQUFJO0FBQUEsUUFDckIsRUFBRSxNQUFNLFVBQVU7QUFBQTtBQUFBLE1BRXBCLElBQUksSUFBSyxFQUFFLE9BQU8sSUFBSSxFQUFFLE1BQU0sSUFBSSxFQUFFLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFBQSxNQUN2RCxJQUFJLElBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUUsTUFBTTtBQUFBLE1BQ3JDLElBQUksSUFBSyxFQUFFLE9BQU8sSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEtBQUssSUFBSSxFQUFFO0FBQUEsTUFDckQsSUFBSSxJQUFLLEVBQUUsT0FBTyxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUUsTUFBTTtBQUFBLE1BRXpDLElBQUksSUFBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQUEsTUFDbkMsSUFBSSxJQUFLLEVBQUUsUUFBUSxJQUFJLEVBQUUsTUFBTSxJQUFJLElBQUksRUFBRSxTQUFTLEtBQUssRUFBRTtBQUFBLE1BQ3pELElBQUksSUFBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLElBQUksRUFBRSxPQUFPLEVBQUU7QUFBQSxNQUMzQyxJQUFJLElBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFJLElBQUksRUFBRSxTQUFTLEtBQUssRUFBRTtBQUFBO0FBQUEsSUFJckQsTUFBTSxlQUFlLFNBQVMsY0FBYyxLQUFLO0FBQUEsSUFDakQsYUFBYSxZQUFZO0FBQUEsSUFDekIsT0FBTyxPQUFPLGFBQWEsT0FBTztBQUFBLE1BQ2hDLFVBQVU7QUFBQSxNQUFTLGVBQWU7QUFBQSxNQUNsQyxZQUFZO0FBQUEsTUFDWixPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsTUFDZCxTQUFTO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsTUFDWCxTQUFTO0FBQUEsTUFHVCxRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsSUFDRCxPQUFPLE9BQU8sWUFBWTtBQUFBLElBQzFCLE1BQU0sYUFBYSxnQkFBZ0IsY0FBYztBQUFBLE1BQy9DO0FBQUEsTUFHQSxtQkFBbUIsQ0FBQyxJQUFJLFNBQVM7QUFBQSxRQUMvQixNQUFNLFFBQVEsYUFBYSxJQUFJLFFBQVEsQ0FBQztBQUFBLFFBQ3hDLGFBQWEsRUFBRTtBQUFBLFFBQ2YsTUFBTSxPQUFPLGlCQUFpQjtBQUFBLFFBQzlCLFlBQVksRUFBQyxNQUFNLFdBQVcsT0FBTyxLQUFJLENBQUM7QUFBQSxRQUMxQyxjQUFjLEtBQUssRUFBQyxPQUFPLEtBQUksQ0FBQztBQUFBLFFBSWhDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixVQUFVLE1BQU0sVUFBVSxNQUFNLEtBQUssS0FBSyxLQUFLLFdBQVcsTUFBTSxJQUFHLENBQUM7QUFBQSxRQUN2RyxPQUFPO0FBQUE7QUFBQSxNQUdULFFBQVEsTUFBTSxXQUFXLE9BQU87QUFBQSxNQUVoQyxRQUFRLENBQUMsT0FBTyxhQUFhLFNBQVMsSUFBSSxFQUFDLE9BQU8sY0FBYyxFQUFFLEVBQUMsQ0FBQztBQUFBLElBQ3RFLENBQUM7QUFBQSxJQUdELElBQUksWUFBWTtBQUFBLElBQ2hCLElBQUksZUFBZTtBQUFBLElBR25CLElBQUksZUFBZTtBQUFBLElBQ25CLE1BQU0sZUFBZSxDQUFDLFdBQTZCLFVBQVUsZ0JBQWdCO0FBQUEsSUFDN0UsSUFBSSxjQUE4QjtBQUFBLElBQ2xDLElBQUksWUFBWSxFQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUU7QUFBQSxJQUM3QixJQUFJLGdCQUFnQixJQUFJO0FBQUEsSUFNeEIsSUFBSSxZQUFZO0FBQUEsSUFFaEIsTUFBTSxlQUFlLE1BQVk7QUFBQSxNQUMvQixXQUFXLE9BQU87QUFBQSxNQUNsQixvQkFBb0I7QUFBQSxNQUNwQixjQUFjO0FBQUEsTUFDZCxZQUFZLEVBQUMsTUFBTSxZQUFXLENBQUM7QUFBQTtBQUFBLElBT2pDLElBQUksY0FBcUM7QUFBQSxJQUN6QyxNQUFNLGtCQUFrQixDQUFDLE9BQXNCO0FBQUEsTUFDN0MsSUFBSSxDQUFDLElBQUk7QUFBQSxRQUFFLGFBQWEsT0FBTztBQUFBLFFBQUcsY0FBYztBQUFBLFFBQU07QUFBQSxNQUFRO0FBQUEsTUFDOUQsSUFBSTtBQUFBLFFBQWE7QUFBQSxNQUNqQixNQUFNLElBQUksU0FBUyxjQUFjLEtBQUs7QUFBQSxNQUN0QyxFQUFFLGNBQWM7QUFBQSxNQUNoQixPQUFPLE9BQU8sRUFBRSxPQUFPO0FBQUEsUUFDckIsVUFBVTtBQUFBLFFBQVMsTUFBTTtBQUFBLFFBQU8sUUFBUTtBQUFBLFFBQVEsV0FBVztBQUFBLFFBQzNELFlBQVk7QUFBQSxRQUFzQixPQUFPO0FBQUEsUUFDekMsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQVksY0FBYztBQUFBLFFBQ25DLFdBQVc7QUFBQSxRQUE4QixlQUFlO0FBQUEsUUFDeEQsUUFBUTtBQUFBLFFBQWMsWUFBWTtBQUFBLE1BQ3BDLENBQUM7QUFBQSxNQUNELE9BQU8sT0FBTyxDQUFDO0FBQUEsTUFDZixjQUFjO0FBQUE7QUFBQSxJQUVoQixNQUFNLGdCQUFnQixDQUFDLElBQWEsY0FBYyxVQUFnQjtBQUFBLE1BQ2hFLElBQUksaUJBQWlCO0FBQUEsUUFBSTtBQUFBLE1BQ3pCLGVBQWU7QUFBQSxNQUNmLGdCQUFnQixFQUFFO0FBQUEsTUFDbEIsYUFBYTtBQUFBLE1BQ2IsYUFBYSxFQUFFO0FBQUEsTUFDZixJQUFJO0FBQUEsUUFBYSxZQUFZLEVBQUMsTUFBTSxlQUFlLEdBQUUsQ0FBQztBQUFBO0FBQUEsSUFHeEQsTUFBTSxlQUFlLENBQUMsT0FBc0I7QUFBQSxNQUMxQyxJQUFJLGNBQWM7QUFBQSxRQUFJO0FBQUEsTUFDdEIsWUFBWTtBQUFBLE1BQ1osSUFBSSxDQUFDLElBQUk7QUFBQSxRQUtQLElBQUksYUFBYSxNQUFNLFlBQVksU0FBUztBQUFBLFVBQzFDLFlBQVksRUFBQyxNQUFNLFlBQVcsQ0FBQztBQUFBLFVBQy9CLFdBQVcsY0FBYztBQUFBLFFBRTNCLEVBQU87QUFBQSxVQUNMLGFBQWE7QUFBQTtBQUFBLFFBRWY7QUFBQSxNQUNGO0FBQUEsTUFDQSxJQUFJLFVBQVUsS0FBSyxHQUFHO0FBQUEsUUFDcEIsTUFBTSxNQUFNLFNBQVMsaUJBQWlCLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFBQSxRQUM5RCxJQUFJLGVBQWUsU0FBUztBQUFBLFVBQUUsY0FBYztBQUFBLFVBQUssVUFBVSxHQUFHO0FBQUEsUUFBRztBQUFBLE1BQ25FO0FBQUE7QUFBQSxJQU9GLE1BQU0sZ0JBQWdCLENBQUMsT0FBeUI7QUFBQSxNQUM5QyxJQUFJLE9BQU8sU0FBUyxRQUFRLE9BQU8sU0FBUztBQUFBLFFBQWlCLE9BQU87QUFBQSxNQUNwRSxNQUFNLElBQUksR0FBRyxzQkFBc0I7QUFBQSxNQUNuQyxPQUFPLEVBQUUsU0FBUyxPQUFPLGFBQWEsT0FBTyxFQUFFLFVBQVUsT0FBTyxjQUFjO0FBQUE7QUFBQSxJQUdoRixNQUFNLHFCQUFxQixDQUFDLFFBQWtEO0FBQUEsTUFDNUUsTUFBTSxLQUFLLFlBQVksZ0JBQWdCLEtBQUssYUFBYSxJQUFJO0FBQUEsTUFHN0QsV0FBVyxPQUFPLGVBQWU7QUFBQSxRQUMvQixJQUFJO0FBQUEsVUFBRSxJQUFJLEdBQUcsUUFBUSxHQUFHO0FBQUEsWUFBRyxPQUFPLEVBQUMsSUFBSSxVQUFVLElBQUc7QUFBQSxVQUFLLE1BQU07QUFBQSxNQUNqRTtBQUFBLE1BQ0EsT0FBTyxFQUFDLElBQUksVUFBVSxRQUFRLEVBQUUsRUFBQztBQUFBO0FBQUEsSUFHbkMsTUFBTSxZQUFZLENBQUMsUUFBdUI7QUFBQSxNQUN4QyxRQUFPLElBQUksYUFBWSxtQkFBbUIsR0FBRztBQUFBLE1BSTdDLElBQUksY0FBYyxFQUFFLEdBQUc7QUFBQSxRQUNyQixXQUFXLE9BQU87QUFBQSxRQUNsQixZQUFZLEVBQUMsTUFBTSxZQUFXLENBQUM7QUFBQSxRQUMvQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWEsU0FBUyxJQUFJLEVBQUMsT0FBTyxjQUFjLEVBQUUsRUFBQyxDQUFDO0FBQUEsTUFDcEQsb0JBQW9CLEVBQUU7QUFBQSxNQUN0QixNQUFNLElBQUksR0FBRyxzQkFBc0I7QUFBQSxNQUNuQyxZQUFZO0FBQUEsUUFDVixNQUFNO0FBQUEsUUFDTjtBQUFBLFFBQ0EsS0FBSyxHQUFHLFFBQVEsWUFBWTtBQUFBLFFBQzVCLE9BQU8sY0FBYyxFQUFFO0FBQUEsUUFDdkIsTUFBTSxFQUFDLEdBQUcsS0FBSyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxNQUFNLEVBQUUsS0FBSyxHQUFHLEdBQUcsS0FBSyxNQUFNLEVBQUUsTUFBTSxFQUFDO0FBQUEsTUFDaEcsQ0FBQztBQUFBO0FBQUEsSUFJSCxJQUFJLGtCQUFrQjtBQUFBLElBQ3RCLE1BQU0sVUFBVSxNQUFjLEVBQUU7QUFBQSxJQUNoQyxJQUFJLGdCQUFnQztBQUFBLElBQ3BDLElBQUksb0JBQW9CO0FBQUEsSUFDeEIsSUFBSSxZQUEyQztBQUFBLElBQy9DLElBQUksV0FBa0M7QUFBQSxJQUN0QyxJQUFJLHNCQUFzQjtBQUFBLElBSTFCLElBQUksaUJBQXFDLENBQUM7QUFBQSxJQUUxQyxNQUFNLG9CQUFvQixNQUFZO0FBQUEsTUFDcEMsV0FBVyxLQUFLLENBQUMsR0FBRyxNQUFNLEtBQUssQ0FBQztBQUFBLFFBQUcsSUFBSSxFQUFFLFdBQVcsVUFBVTtBQUFBLFVBQUcsV0FBVyxDQUFDO0FBQUE7QUFBQSxJQUUvRSxNQUFNLGlCQUFpQixNQUFzQjtBQUFBLE1BQzNDLElBQUk7QUFBQSxRQUFVLE9BQU87QUFBQSxNQUNyQixXQUFXLFNBQVMsY0FBYyxLQUFLO0FBQUEsTUFDdkMsU0FBUyxZQUFZO0FBQUEsTUFDckIsT0FBTyxPQUFPLFNBQVMsT0FBTztBQUFBLFFBQzVCLFVBQVU7QUFBQSxRQUFTLGVBQWU7QUFBQSxRQUdsQyxRQUFRO0FBQUEsUUFDUixZQUFZO0FBQUEsUUFDWixjQUFjO0FBQUEsUUFDZCxXQUFXO0FBQUEsUUFDWCxXQUFXO0FBQUEsTUFDYixDQUFDO0FBQUEsTUFDRCxPQUFPLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLHNCQUFzQixTQUFTLEtBQUssTUFBTTtBQUFBLE1BQzFDLFNBQVMsS0FBSyxNQUFNLGFBQWE7QUFBQSxNQUNqQyxTQUFTLEtBQUssTUFBTSxtQkFBbUI7QUFBQSxNQUN2QyxTQUFTLEtBQUssTUFBTSxTQUFTO0FBQUEsTUFFN0IsV0FBVyxLQUFLO0FBQUEsTUFDaEIsV0FBVyxPQUFPO0FBQUEsTUFFbEIsaUJBQWlCLG1CQUFtQixXQUFXO0FBQUEsTUFDL0MsUUFBUSxJQUFJLEtBQUssK0JBQStCLGVBQWUsUUFBUSxVQUFVO0FBQUEsTUFDakYsT0FBTztBQUFBO0FBQUEsSUFFVCxNQUFNLG1CQUFtQixNQUFZO0FBQUEsTUFDbkMsSUFBSSxVQUFVO0FBQUEsUUFBRSxTQUFTLE9BQU87QUFBQSxRQUFHLFdBQVc7QUFBQSxNQUFNO0FBQUEsTUFDcEQsU0FBUyxLQUFLLE1BQU0sYUFBYTtBQUFBLE1BQ2pDLFNBQVMsS0FBSyxNQUFNLG1CQUFtQjtBQUFBLE1BQ3ZDLFNBQVMsS0FBSyxNQUFNLFNBQVM7QUFBQSxNQUM3QixrQkFBa0I7QUFBQSxNQUNsQixpQkFBaUIsQ0FBQztBQUFBO0FBQUEsSUFFcEIsSUFBSSxrQkFBa0IsSUFBSTtBQUFBLElBTTFCLE1BQU0sV0FBVyxDQUFDLE1BQ2hCLGFBQWEsRUFBRSxXQUFXLFVBQVUsSUFBSSxTQUFTO0FBQUEsSUFFbkQsTUFBTSxpQkFBaUIsQ0FBQyxNQUF3QjtBQUFBLE1BQzlDLElBQUksQ0FBQztBQUFBLFFBQVc7QUFBQSxNQUNoQixNQUFNLEtBQUssS0FBSyxJQUFJLEVBQUUsVUFBVSxVQUFVLENBQUM7QUFBQSxNQUMzQyxNQUFNLEtBQUssS0FBSyxJQUFJLEVBQUUsVUFBVSxVQUFVLENBQUM7QUFBQSxNQUMzQyxJQUFJLENBQUMsWUFBWSxLQUFLLEtBQUssS0FBSztBQUFBLFFBQUc7QUFBQSxNQUNuQyxNQUFNLEtBQUssS0FBSyxJQUFJLFVBQVUsR0FBRyxFQUFFLE9BQU87QUFBQSxNQUMxQyxNQUFNLEtBQUssS0FBSyxJQUFJLFVBQVUsR0FBRyxFQUFFLE9BQU87QUFBQSxNQUMxQyxNQUFNLEtBQUssS0FBSyxJQUFJLFVBQVUsR0FBRyxFQUFFLE9BQU87QUFBQSxNQUMxQyxNQUFNLEtBQUssS0FBSyxJQUFJLFVBQVUsR0FBRyxFQUFFLE9BQU87QUFBQSxNQUMxQyxNQUFNLElBQUksZUFBZTtBQUFBLE1BQ3pCLE1BQU0sT0FBTyxTQUFTLENBQUM7QUFBQSxNQUN2QixPQUFPLE9BQU8sRUFBRSxPQUFPO0FBQUEsUUFDckIsTUFBTSxLQUFLO0FBQUEsUUFDWCxLQUFLLEtBQUs7QUFBQSxRQUNWLE9BQVEsS0FBSyxLQUFNO0FBQUEsUUFDbkIsUUFBUyxLQUFLLEtBQU07QUFBQSxRQUNwQixhQUFhLFNBQVMsU0FBUyxVQUFVO0FBQUEsTUFDM0MsQ0FBQztBQUFBLE1BTUQsTUFBTSxNQUFNLGVBQWUsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtBQUFBLE1BQy9ELE1BQU0sT0FBTyxJQUFJLElBQUksR0FBRztBQUFBLE1BQ3hCLElBQUksT0FBTyxLQUFLLFNBQVMsZ0JBQWdCO0FBQUEsTUFDekMsSUFBSTtBQUFBLFFBQU0sV0FBVyxNQUFNLE1BQU07QUFBQSxVQUFFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLEdBQUc7QUFBQSxZQUFFLE9BQU87QUFBQSxZQUFPO0FBQUEsVUFBTztBQUFBLFFBQUU7QUFBQSxNQUMxRixJQUFJLENBQUMsTUFBTTtBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsSUFBSSxRQUFRLENBQUMsSUFBSSxNQUFNLGFBQWEsV0FBVyxLQUFLLElBQUksRUFBQyxTQUFTLEtBQUksQ0FBQyxDQUFDO0FBQUEsUUFDeEUsa0JBQWtCO0FBQUEsUUFDbEIsUUFBUSxJQUFJLEtBQUssaUJBQWlCLFVBQVUsSUFBSSxRQUFRLFdBQVcsSUFBSSxJQUFJLGFBQWEsQ0FBQztBQUFBLE1BQzNGO0FBQUE7QUFBQSxJQUlGLElBQUksZUFBbUQsQ0FBQztBQUFBLElBQ3hELE1BQU0sZUFBZSxDQUFDLEtBQWMsWUFBdUQ7QUFBQSxNQUN6RixNQUFNLEtBQUssWUFBWSxnQkFBZ0IsS0FBSyxhQUFhLElBQUk7QUFBQSxNQUM3RCxJQUFJLGNBQWMsRUFBRSxHQUFHO0FBQUEsUUFDckIsUUFBUSxJQUFJLEtBQUssdUNBQXVDLGNBQWMsRUFBRSxDQUFDO0FBQUEsUUFDekU7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLFFBQVEsYUFBYSxJQUFJLFFBQVEsR0FBRztBQUFBLFdBQ3BDLFVBQVUsRUFBQyxRQUFPLElBQUksQ0FBQztBQUFBLE1BQzdCLENBQUM7QUFBQSxNQUNELElBQUksYUFBYSxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sYUFBYSxNQUFNLFFBQVEsR0FBRztBQUFBLFFBQ2hGLGFBQWEsRUFBRTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLE1BQU0sYUFBYTtBQUFBLE1BQ3pCLGFBQWEsS0FBSyxFQUFDLElBQUksTUFBSyxDQUFDO0FBQUEsTUFDN0IsYUFBYSxXQUFXLE9BQU8sSUFBSSxFQUFDLE1BQU0sTUFBTSxPQUFPLElBQUksTUFBTSxLQUFLLGNBQWMsRUFBRSxJQUFHLENBQUM7QUFBQSxNQUMxRixhQUFhLEVBQUU7QUFBQSxNQUNmLFlBQVksRUFBQyxNQUFNLGVBQWUsTUFBSyxDQUFDO0FBQUE7QUFBQSxJQUUxQyxNQUFNLHFCQUFxQixNQUFZO0FBQUEsTUFDckMsSUFBSSxDQUFDLGFBQWE7QUFBQSxRQUFRO0FBQUEsTUFDMUIsUUFBUSxJQUFJLEtBQUssbUNBQWtDLGFBQWEsUUFBUSxpQkFBaUI7QUFBQSxNQUN6RixRQUFRLE1BQU0sS0FBSyxvQkFBb0I7QUFBQSxNQUN2QyxhQUFhLFFBQVEsR0FBRSxJQUFJLFNBQVEsTUFBTTtBQUFBLFFBQ3ZDLE1BQU0sT0FBTyxpQkFBaUI7QUFBQSxRQUM5QixZQUFZLEVBQUMsTUFBTSxXQUFXLE9BQU8sTUFBTSxTQUFTLElBQUksRUFBQyxDQUFDO0FBQUEsUUFDMUQsY0FBYyxLQUFLLEVBQUMsT0FBTyxNQUFNLFNBQVMsSUFBSSxFQUFDLENBQUM7QUFBQSxRQUNoRCxXQUFXLFdBQVcsR0FBRztBQUFBLFFBQ3pCLElBQUksR0FBRztBQUFBLFVBQWEsYUFBYSxFQUFFO0FBQUEsT0FDcEM7QUFBQSxNQUNELGVBQWUsQ0FBQztBQUFBLE1BQ2hCLFlBQVksRUFBQyxNQUFNLGdCQUFlLENBQUM7QUFBQTtBQUFBLElBRXJDLE1BQU0scUJBQXFCLE1BQVk7QUFBQSxNQUNyQyxJQUFJLGFBQWE7QUFBQSxRQUFRLFFBQVEsSUFBSSxLQUFLLG1DQUFrQyxhQUFhLFFBQVEsUUFBUTtBQUFBLE1BQ3pHLGFBQWEsUUFBUSxDQUFDLEdBQUcsTUFBTSxXQUFXLFdBQVcsR0FBRyxDQUFDO0FBQUEsTUFDekQsZUFBZSxDQUFDO0FBQUEsTUFDaEIsWUFBWSxFQUFDLE1BQU0sZ0JBQWUsQ0FBQztBQUFBO0FBQUEsSUFJckMsSUFBSSxhQUFhO0FBQUEsSUFDakIsTUFBTSxjQUFjLENBQUMsTUFBd0I7QUFBQSxNQUMzQyxJQUFJLENBQUMsWUFBWTtBQUFBLFFBQUc7QUFBQSxNQUNwQixJQUFJLEVBQUUsY0FBYztBQUFBLFFBQVk7QUFBQSxNQUNoQyxhQUFhLEVBQUU7QUFBQSxNQUNmLFlBQVksRUFBQyxHQUFHLEVBQUUsU0FBUyxHQUFHLEVBQUUsUUFBTztBQUFBLE1BQ3ZDLElBQUksV0FBVztBQUFBLFFBS2IsZUFBZSxDQUFDO0FBQUEsUUFDaEIsV0FBVyxPQUFPO0FBQUEsUUFDbEIsWUFBWSxFQUFDLE1BQU0sWUFBVyxDQUFDO0FBQUEsUUFDL0IsY0FBYztBQUFBLFFBQ2Q7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLFFBQVEsYUFBYSxFQUFFLE1BQU07QUFBQSxNQUNuQyxJQUFJLENBQUMsT0FBTztBQUFBLFFBQUUsSUFBSTtBQUFBLFVBQVcsYUFBYSxLQUFLO0FBQUEsUUFBRztBQUFBLE1BQVE7QUFBQSxNQUMxRCxJQUFJLENBQUM7QUFBQSxRQUFXLGFBQWEsSUFBSTtBQUFBLE1BQ2pDLE1BQU0sTUFBTSxFQUFFO0FBQUEsTUFDZCxJQUFJLEVBQUUsZUFBZSxZQUFZLFFBQVE7QUFBQSxRQUFhO0FBQUEsTUFDdEQsY0FBYztBQUFBLE1BQ2QsVUFBVSxHQUFHO0FBQUE7QUFBQSxJQUdmLE1BQU0scUJBQXFCLENBQUMsTUFBc0I7QUFBQSxNQUNoRCxJQUFJLGFBQWEsTUFBTSxZQUFZO0FBQUEsUUFBUyxPQUFPO0FBQUEsTUFDbkQsTUFBTSxPQUFPLE9BQU8sRUFBRSxpQkFBaUIsYUFBYSxFQUFFLGFBQWEsSUFBSSxDQUFDO0FBQUEsTUFDeEUsV0FBVyxRQUFRO0FBQUEsUUFBTSxJQUFJLFNBQVM7QUFBQSxVQUFjLE9BQU87QUFBQSxNQUMzRCxPQUFPO0FBQUE7QUFBQSxJQVVULE1BQU0sbUJBQW1CLENBQUMsTUFBc0I7QUFBQSxNQUM5QyxNQUFNLElBQUksRUFBRTtBQUFBLE1BQ1osSUFBSSxhQUFhLFdBQVcsRUFBRSxPQUFPO0FBQUEsUUFBdUIsT0FBTztBQUFBLE1BQ25FLE1BQU0sT0FBTyxPQUFPLEVBQUUsaUJBQWlCLGFBQWEsRUFBRSxhQUFhLElBQUksQ0FBQztBQUFBLE1BQ3hFLFdBQVcsUUFBUSxNQUFNO0FBQUEsUUFDdkIsSUFBSSxnQkFBZ0IsV0FBVyxLQUFLLE9BQU87QUFBQSxVQUF1QixPQUFPO0FBQUEsUUFDekUsSUFBSSxTQUFTO0FBQUEsVUFBYSxPQUFPO0FBQUEsTUFDbkM7QUFBQSxNQUNBLE9BQU87QUFBQTtBQUFBLElBR1QsTUFBTSxjQUFjLENBQUMsTUFBd0I7QUFBQSxNQUMzQyxJQUFJLENBQUMsWUFBWTtBQUFBLFFBQUc7QUFBQSxNQUNwQixJQUFJLG1CQUFtQixDQUFDO0FBQUEsUUFBRztBQUFBLE1BQzNCLElBQUksYUFBYSxNQUFNLFlBQVksV0FBVyxDQUFDLFdBQVcsU0FBUztBQUFBLFFBQUcsV0FBVyxLQUFLO0FBQUEsTUFDdEYsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLEtBQUs7QUFBQSxRQUFXO0FBQUEsTUFDMUMsSUFBSSxpQkFBaUIsQ0FBQztBQUFBLFFBQUc7QUFBQSxNQUN6QixFQUFFLGVBQWU7QUFBQSxNQUNqQixFQUFFLGdCQUFnQjtBQUFBLE1BQ2xCLFlBQVksRUFBQyxHQUFHLEVBQUUsU0FBUyxHQUFHLEVBQUUsUUFBTztBQUFBLE1BQ3ZDLFFBQVEsSUFBSSxLQUFLLGlCQUFpQixTQUFTO0FBQUE7QUFBQSxJQUc3QyxNQUFNLFlBQVksQ0FBQyxNQUF3QjtBQUFBLE1BQ3pDLElBQUksQ0FBQztBQUFBLFFBQVc7QUFBQSxNQUNoQixNQUFNLFFBQVE7QUFBQSxNQUNkLE1BQU0sVUFBVSxRQUFRLFFBQVE7QUFBQSxNQUNoQyxZQUFZO0FBQUEsTUFDWixpQkFBaUI7QUFBQSxNQUNqQixJQUFJLENBQUMsU0FBUztBQUFBLFFBQ1osUUFBUSxJQUFJLEtBQUsseUNBQXlDO0FBQUEsUUFDMUQ7QUFBQSxNQUNGO0FBQUEsTUFDQSxFQUFFLGVBQWU7QUFBQSxNQUNqQixFQUFFLGdCQUFnQjtBQUFBLE1BQ2xCLG9CQUFvQjtBQUFBLE1BQ3BCLFdBQVcsTUFBTTtBQUFBLFFBQUUsb0JBQW9CO0FBQUEsU0FBVSxHQUFHO0FBQUEsTUFDcEQsTUFBTSxPQUEyQixFQUFFLFdBQVcsTUFBTSxJQUFJLFNBQVM7QUFBQSxNQUdqRSxNQUFNLGdCQUFnQixlQUFlLFNBQVMsaUJBQWlCLG1CQUFtQixXQUFXO0FBQUEsTUFDN0YsTUFBTSxNQUFNLGVBQWUsZUFBZSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsSUFBSTtBQUFBLE1BQ3RGLFFBQVEsSUFBSSxLQUFLLG1CQUFrQixtQ0FBbUMsSUFBSSxRQUFRLGFBQWEsSUFBSSxJQUFJLGFBQWEsQ0FBQztBQUFBLE1BSXJILFdBQVcsTUFBTTtBQUFBLFFBQUssYUFBYSxFQUFFO0FBQUE7QUFBQSxJQUd2QyxNQUFNLFVBQVUsQ0FBQyxVQUE0QjtBQUFBLE1BQzNDLElBQUksQ0FBQyxZQUFZO0FBQUEsUUFBRztBQUFBLE1BQ3BCLElBQUksbUJBQW1CO0FBQUEsUUFDckIsTUFBTSxlQUFlO0FBQUEsUUFDckIsTUFBTSxnQkFBZ0I7QUFBQSxRQUN0QjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLElBQUksbUJBQW1CLEtBQUs7QUFBQSxRQUFHO0FBQUEsTUFDL0IsSUFBSSxDQUFDLGFBQWEsTUFBTSxNQUFNO0FBQUEsUUFBRztBQUFBLE1BQ2pDLElBQUksaUJBQWlCLEtBQUs7QUFBQSxRQUFHO0FBQUEsTUFDN0IsTUFBTSxlQUFlO0FBQUEsTUFDckIsTUFBTSxnQkFBZ0I7QUFBQSxNQUN0QixNQUFNLE1BQU0sTUFBTTtBQUFBLE1BQ2xCLElBQUksRUFBRSxlQUFlO0FBQUEsUUFBVTtBQUFBLE1BRy9CLE1BQU0sS0FBSyxZQUFZLGdCQUFnQixLQUFLLGFBQWEsSUFBSTtBQUFBLE1BQzdELElBQUksY0FBYyxFQUFFLEdBQUc7QUFBQSxRQUNyQixRQUFRLElBQUksS0FBSywrQkFBK0IsY0FBYyxFQUFFLENBQUM7QUFBQSxRQUNqRTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLElBQUksTUFBTSxVQUFVO0FBQUEsUUFDbEIsYUFBYSxJQUFJLEVBQUMsU0FBUyxNQUFNLFNBQVMsU0FBUyxNQUFNLFFBQU8sQ0FBQztBQUFBLFFBQ2pFO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTSxRQUFRLGFBQWEsSUFBSSxRQUFRLEdBQUc7QUFBQSxRQUN4QyxTQUFTLEVBQUMsU0FBUyxNQUFNLFNBQVMsU0FBUyxNQUFNLFFBQU87QUFBQSxNQUMxRCxDQUFDO0FBQUEsTUFDRCxhQUFhLEVBQUU7QUFBQSxNQUNmLE1BQU0sT0FBTyxpQkFBaUI7QUFBQSxNQUM5QixZQUFZLEVBQUMsTUFBTSxXQUFXLE9BQU8sS0FBSSxDQUFDO0FBQUEsTUFDMUMsY0FBYyxLQUFLLEVBQUMsT0FBTyxLQUFJLENBQUM7QUFBQTtBQUFBLElBTWxDLFdBQVcsVUFBVSxDQUFDLFFBQVEsUUFBUSxHQUFHO0FBQUEsTUFDdkMsT0FBTyxpQkFBaUIsYUFBYSxhQUE4QixJQUFJO0FBQUEsTUFDdkUsT0FBTyxpQkFBaUIsYUFBYSxhQUE4QixJQUFJO0FBQUEsTUFDdkUsT0FBTyxpQkFBaUIsV0FBVyxXQUE0QixJQUFJO0FBQUEsSUFDckU7QUFBQSxJQUNBLFNBQVMsaUJBQWlCLFNBQVMsU0FBMEIsSUFBSTtBQUFBLElBQ2pFLFNBQVMsaUJBQWlCLGVBQWUsQ0FBQyxNQUFNO0FBQUEsTUFDOUMsSUFBSSxFQUFFLGtCQUFrQjtBQUFBLFFBQVMsZ0JBQWdCLEVBQUU7QUFBQSxPQUNsRCxJQUFJO0FBQUEsSUFJUCxNQUFNLGVBQWUsQ0FBQyxNQUEyQjtBQUFBLE1BQy9DLElBQUksQ0FBQyxZQUFZO0FBQUEsUUFBRztBQUFBLE1BRXBCLElBQUksRUFBRSxRQUFRLFlBQVksZ0JBQWdCLGFBQWEsTUFBTSxZQUFZLFNBQVM7QUFBQSxRQUNoRixFQUFFLGVBQWU7QUFBQSxRQUNqQixjQUFjLE9BQXlCLElBQUk7QUFBQSxRQUMzQztBQUFBLE1BQ0Y7QUFBQSxNQUNBLElBQUksRUFBRSxRQUFRO0FBQUEsUUFDWixhQUFhLElBQUk7QUFBQSxRQUlqQixJQUFJLEVBQUUsUUFBUSxTQUFTLGFBQWEsTUFBTSxZQUFZLFNBQVM7QUFBQSxVQUM3RCxFQUFFLGVBQWU7QUFBQSxRQUNuQjtBQUFBLE1BQ0Y7QUFBQTtBQUFBLElBRUYsTUFBTSxhQUFhLENBQUMsTUFBMkI7QUFBQSxNQUM3QyxJQUFJLENBQUMsWUFBWTtBQUFBLFFBQUc7QUFBQSxNQUNwQixJQUFJLEVBQUUsUUFBUSxTQUFTLENBQUMsRUFBRSxRQUFRO0FBQUEsUUFJaEMsSUFBSSxhQUFhLE1BQU0sWUFBWTtBQUFBLFVBQVMsRUFBRSxlQUFlO0FBQUEsUUFDN0QsZUFBZTtBQUFBLFFBRWYsSUFBSSxDQUFDO0FBQUEsVUFBYyxhQUFhLEtBQUs7QUFBQSxNQUd2QztBQUFBO0FBQUEsSUFFRixNQUFNLGVBQWUsTUFBWTtBQUFBLE1BQy9CLGVBQWU7QUFBQSxNQUdmLElBQUksQ0FBQztBQUFBLFFBQWMsYUFBYSxLQUFLO0FBQUE7QUFBQSxJQUl2QyxPQUFPLGlCQUFpQixXQUFXLGNBQWMsSUFBSTtBQUFBLElBQ3JELE9BQU8saUJBQWlCLFNBQVMsWUFBWSxJQUFJO0FBQUEsSUFDakQsT0FBTyxpQkFBaUIsUUFBUSxjQUFjLElBQUk7QUFBQSxJQUdsRCxNQUFNLFlBQVksQ0FBQyxRQUE0QztBQUFBLE1BQzdELElBQUk7QUFBQSxRQUFFLE9BQU8sTUFBTSxTQUFTLGNBQWMsR0FBRyxJQUFJO0FBQUEsUUFBUSxNQUFNO0FBQUEsUUFBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLElBRzFFLE1BQU0sZ0JBQWdCLENBQUMsS0FBNEIsWUFBdUM7QUFBQSxNQUN4RixRQUFRLElBQUk7QUFBQSxhQUNMLFdBQVc7QUFBQSxVQUNkLE1BQU0sS0FBSyxVQUFVLElBQUksUUFBUTtBQUFBLFVBQ2pDLElBQUk7QUFBQSxZQUFJLGFBQWEsY0FBYyxJQUFJLEVBQUMsT0FBTyxjQUFjLEVBQUUsR0FBRyxNQUFNLElBQUksTUFBTSxRQUFRLElBQUksT0FBTSxDQUFDO0FBQUEsVUFDaEc7QUFBQSx1QkFBVyxZQUFZO0FBQUEsVUFDNUIsT0FBTztBQUFBLFFBQ1Q7QUFBQSxhQUNLO0FBQUEsVUFDSCxXQUFXLFlBQVk7QUFBQSxVQUN2QixXQUFXLE9BQU87QUFBQSxVQUNsQixPQUFPO0FBQUEsYUFDSixpQkFBaUI7QUFBQSxVQUNwQixXQUFXLE9BQU87QUFBQSxVQUNsQixJQUFJLElBQUk7QUFBQSxVQUNSLFdBQVcsT0FBTyxJQUFJLFdBQVc7QUFBQSxZQUMvQixNQUFNLEtBQUssVUFBVSxHQUFHO0FBQUEsWUFDeEIsSUFBSTtBQUFBLGNBQUksYUFBYSxTQUFTLE9BQU8sSUFBSSxFQUFDLE1BQU0sS0FBSSxDQUFDO0FBQUEsVUFDdkQ7QUFBQSxVQUNBLE9BQU87QUFBQSxRQUNUO0FBQUEsYUFDSyx1QkFBdUI7QUFBQSxVQUMxQixXQUFXLEtBQUssQ0FBQyxHQUFHLE1BQU0sS0FBSyxDQUFDO0FBQUEsWUFBRyxJQUFJLEVBQUUsV0FBVyxRQUFRO0FBQUEsY0FBRyxXQUFXLENBQUM7QUFBQSxVQUMzRSxPQUFPO0FBQUEsUUFDVDtBQUFBLGFBQ0ssYUFBYTtBQUFBLFVBQ2hCLE1BQU0sS0FBSyxVQUFVLElBQUksUUFBUTtBQUFBLFVBQ2pDLElBQUksQ0FBQztBQUFBLFlBQUksT0FBTztBQUFBLFVBS2hCLEdBQUcsZUFBZSxFQUFDLFVBQVUsVUFBVSxPQUFPLFdBQVcsUUFBUSxVQUFTLENBQUM7QUFBQSxVQUMzRSxJQUFJLElBQUk7QUFBQSxZQUFRLGFBQWEsVUFBVSxJQUFJLEVBQUMsT0FBTyxjQUFjLEVBQUUsR0FBRyxNQUFNLEtBQUksQ0FBQztBQUFBLFVBQzVFO0FBQUEseUJBQWEsRUFBRTtBQUFBLFVBQ3BCLE9BQU87QUFBQSxRQUNUO0FBQUEsYUFDSyxnQkFBZ0I7QUFBQSxVQUNuQixNQUFNLEtBQUssVUFBVSxJQUFJLFFBQVE7QUFBQSxVQUNqQyxJQUFJLENBQUM7QUFBQSxZQUFJLE9BQU87QUFBQSxVQUNoQixZQUFZLEVBQUU7QUFBQSxVQUNkLE9BQU87QUFBQSxRQUNUO0FBQUEsYUFDSztBQUFBLFVBQ0gsV0FBVyxRQUFRO0FBQUEsVUFDbkIsT0FBTztBQUFBLGFBQ0osWUFBWTtBQUFBLFVBQ2YsTUFBTSxRQUFpQyxDQUFDO0FBQUEsVUFDeEMsV0FBVyxPQUFPLElBQUksV0FBVztBQUFBLFlBQy9CLElBQUk7QUFBQSxjQUFFLE1BQU0sT0FBTyxRQUFRLFNBQVMsY0FBYyxHQUFHLENBQUM7QUFBQSxjQUFLLE1BQU07QUFBQSxjQUFFLE1BQU0sT0FBTztBQUFBO0FBQUEsVUFDbEY7QUFBQSxVQUNBLFFBQVEsRUFBQyxNQUFLLENBQUM7QUFBQSxVQUNmLE9BQU87QUFBQSxRQUNUO0FBQUEsYUFDSyxlQUFlO0FBQUEsVUFDbEIsTUFBTSxLQUFLLFVBQVUsSUFBSSxRQUFRO0FBQUEsVUFDakMsSUFBSSxDQUFDLElBQUk7QUFBQSxZQUFFLFFBQVEsRUFBQyxJQUFJLE1BQUssQ0FBQztBQUFBLFlBQUcsT0FBTztBQUFBLFVBQU07QUFBQSxVQUM5QyxJQUFJO0FBQUEsWUFBRSxHQUFHLGFBQWEscUJBQXFCLE9BQU8sSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUFBLFlBQUssTUFBTTtBQUFBLFVBQ3pFLFFBQVEsSUFBSSwwQkFBMEIsa0NBQWtDLElBQ3RFO0FBQUE7QUFBQSxxREFBbUcsSUFBSSxLQUFLLFFBQVE7QUFBQSxVQUN0SCxHQUFHLGVBQWUsRUFBQyxVQUFVLFVBQVUsT0FBTyxTQUFRLENBQUM7QUFBQSxVQUN2RCxhQUFhLEVBQUU7QUFBQSxVQUNmLFFBQVEsRUFBQyxJQUFJLE1BQU0sU0FBUyxNQUFNLElBQUksYUFBWSxDQUFDO0FBQUEsVUFDbkQsT0FBTztBQUFBLFFBQ1Q7QUFBQSxhQUNLLGFBQWE7QUFBQSxVQUNoQixNQUFNLEtBQUssVUFBVSxJQUFJLFFBQVE7QUFBQSxVQUNqQyxJQUFJLENBQUMsSUFBSTtBQUFBLFlBQUUsUUFBUSxFQUFDLElBQUksT0FBTyxRQUFRLFlBQVcsQ0FBQztBQUFBLFlBQUcsT0FBTztBQUFBLFVBQU07QUFBQSxVQUNuRSxNQUFNLFFBQVEsYUFBYSxJQUFJLElBQUksS0FBSyxRQUFRLENBQUM7QUFBQSxVQUNqRCxRQUFRLEVBQUMsSUFBSSxNQUFNLE9BQU8sTUFBTSxpQkFBaUIsRUFBQyxDQUFDO0FBQUEsVUFDbkQsT0FBTztBQUFBLFFBQ1Q7QUFBQSxhQUNLLG9CQUFvQjtBQUFBLFVBS3ZCLElBQUksTUFBc0IsVUFBVSxJQUFJLFFBQVE7QUFBQSxVQUNoRCxJQUFJLENBQUMsS0FBSztBQUFBLFlBQUUsUUFBUSxFQUFDLElBQUksT0FBTyxRQUFRLFlBQVcsQ0FBQztBQUFBLFlBQUcsT0FBTztBQUFBLFVBQU07QUFBQSxVQUNwRSxTQUFTLElBQUksRUFBRyxJQUFJLElBQUksU0FBUyxPQUFPLElBQUksaUJBQWlCLFFBQVEsU0FBUyxNQUFNLEtBQUs7QUFBQSxZQUN2RixNQUFNLElBQUk7QUFBQSxVQUNaO0FBQUEsVUFDQSxJQUFJLENBQUMsT0FBTyxjQUFjLEdBQUcsR0FBRztBQUFBLFlBQUUsUUFBUSxFQUFDLElBQUksT0FBTyxRQUFRLFlBQVcsQ0FBQztBQUFBLFlBQUcsT0FBTztBQUFBLFVBQU07QUFBQSxVQUMxRixNQUFNLFFBQVEsYUFBYSxLQUFLLFFBQVEsQ0FBQztBQUFBLFVBQ3pDLGFBQWEsR0FBRztBQUFBLFVBQ2hCLFlBQVksRUFBQyxNQUFNLFdBQVcsT0FBTyxNQUFNLGlCQUFpQixFQUFDLENBQUM7QUFBQSxVQUM5RCxRQUFRLEVBQUMsSUFBSSxNQUFNLE1BQUssQ0FBQztBQUFBLFVBQ3pCLE9BQU87QUFBQSxRQUNUO0FBQUEsYUFDSyxvQkFBb0I7QUFBQSxVQUl2QixJQUFJLE1BQXNCLFVBQVUsSUFBSSxRQUFRO0FBQUEsVUFDaEQsSUFBSSxDQUFDO0FBQUEsWUFBSyxPQUFPO0FBQUEsVUFDakIsU0FBUyxJQUFJLEVBQUcsSUFBSSxJQUFJLFNBQVMsT0FBTyxJQUFJLGlCQUFpQixRQUFRLFNBQVMsTUFBTSxLQUFLO0FBQUEsWUFDdkYsTUFBTSxJQUFJO0FBQUEsVUFDWjtBQUFBLFVBQ0EsSUFBSSxDQUFDLE9BQU8sY0FBYyxHQUFHLEdBQUc7QUFBQSxZQUM5QixXQUFXLFlBQVk7QUFBQSxZQUN2QixPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0EsYUFBYSxjQUFjLEtBQUssRUFBQyxPQUFPLGNBQWMsR0FBRyxHQUFHLE1BQU0sS0FBSSxDQUFDO0FBQUEsVUFDdkUsT0FBTztBQUFBLFFBQ1Q7QUFBQSxhQUNLO0FBQUEsVUFDSCxlQUFlLElBQUk7QUFBQSxVQUNuQixhQUFhLElBQUksRUFBRTtBQUFBLFVBQ25CLE9BQU87QUFBQSxhQUNKO0FBQUEsVUFDSCxjQUFjLElBQUksRUFBRTtBQUFBLFVBQ3BCLE9BQU87QUFBQSxhQUNKLGtCQUFrQjtBQUFBLFVBQ3JCLE1BQU0sS0FBSyxVQUFVLElBQUksUUFBUTtBQUFBLFVBQ2pDLElBQUksQ0FBQyxJQUFJO0FBQUEsWUFBRSxRQUFRLEVBQUMsSUFBSSxPQUFPLFFBQVEsWUFBVyxDQUFDO0FBQUEsWUFBRyxPQUFPO0FBQUEsVUFBTTtBQUFBLFVBQ25FLE1BQU0sUUFBUSxhQUFhLElBQUksSUFBSSxLQUFLLFFBQVEsQ0FBQztBQUFBLFVBQ2pELGFBQWEsRUFBRTtBQUFBLFVBQ2YsWUFBWSxFQUFDLE1BQU0sV0FBVyxPQUFPLE1BQU0saUJBQWlCLEVBQUMsQ0FBQztBQUFBLFVBQzlELFFBQVEsRUFBQyxJQUFJLE1BQU0sTUFBSyxDQUFDO0FBQUEsVUFDekIsT0FBTztBQUFBLFFBQ1Q7QUFBQSxhQUNLLGNBQWM7QUFBQSxVQUNqQixNQUFNLEtBQUssVUFBVSxJQUFJLFFBQVE7QUFBQSxVQUNqQyxJQUFJO0FBQUEsWUFBSSxXQUFXLEtBQUssSUFBSSxLQUFLLElBQUksV0FBVyxDQUFDLEdBQUksVUFBVSxJQUFJLFNBQVEsQ0FBQztBQUFBLFVBQzVFLE9BQU87QUFBQSxRQUNUO0FBQUEsYUFDSztBQUFBLFVBQ0gsV0FBVyxLQUFLO0FBQUEsVUFDaEIsT0FBTztBQUFBLGFBQ0o7QUFBQSxVQUNILG1CQUFtQjtBQUFBLFVBQ25CLE9BQU87QUFBQSxhQUNKO0FBQUEsVUFDSCxtQkFBbUI7QUFBQSxVQUNuQixPQUFPO0FBQUEsYUFDSixtQkFBbUI7QUFBQSxVQUN0QixJQUFJLGVBQWU7QUFBQSxZQUNqQixNQUFNLFFBQVEsYUFBYSxlQUFlLFFBQVEsQ0FBQztBQUFBLFlBQ25ELGFBQWEsYUFBYTtBQUFBLFlBQzFCLFlBQVksRUFBQyxNQUFNLFdBQVcsT0FBTyxNQUFNLGlCQUFpQixFQUFDLENBQUM7QUFBQSxVQUNoRTtBQUFBLFVBQ0EsT0FBTztBQUFBLFFBQ1Q7QUFBQSxhQUNLO0FBQUEsVUFDSCxnQkFBZ0IsSUFBSSxJQUFJLElBQUksU0FBUztBQUFBLFVBQ3JDLE9BQU87QUFBQSxhQUNKO0FBQUEsVUFFSCxRQUFRLEVBQUMsSUFBSSxNQUFNLEtBQUssU0FBUyxNQUFNLE9BQU8sU0FBUyxPQUFPLE1BQU07QUFBQSxJQUFzQixTQUFTLGdCQUFnQixVQUFTLENBQUM7QUFBQSxVQUM3SCxPQUFPO0FBQUEsYUFDSjtBQUFBLFVBQ0gsSUFBSSxPQUFPLElBQUksbUJBQW1CLFdBQVc7QUFBQSxZQUMzQyxpQkFBaUIsSUFBSTtBQUFBLFlBQ3JCLElBQUksQ0FBQztBQUFBLGNBQWdCLG9CQUFvQjtBQUFBLFVBQzNDO0FBQUEsVUFDQSxJQUFJLE9BQU8sSUFBSSxjQUFjO0FBQUEsWUFBVyxZQUFZLElBQUk7QUFBQSxVQUN4RCxPQUFPO0FBQUEsYUFDSixpQkFBaUI7QUFBQSxVQXFCcEIsZ0JBQWdCO0FBQUEsVUFDaEIsWUFBWTtBQUFBLFVBQ1osWUFBWSxNQUFNLFVBQVU7QUFBQSxVQUV2QixZQUFZLHNCQUFzQjtBQUFBLFVBQ3ZDLHNCQUFzQixNQUFNO0FBQUEsWUFDMUIsc0JBQXNCLE1BQU0sUUFBUSxFQUFDLElBQUksS0FBSSxDQUFDLENBQUM7QUFBQSxXQUNoRDtBQUFBLFVBQ0QsT0FBTztBQUFBLFFBQ1Q7QUFBQSxhQUNLLGlCQUFpQjtBQUFBLFVBQ3BCLFlBQVksTUFBTSxVQUFVO0FBQUEsVUFDNUIsWUFBWSxNQUFNLGFBQWE7QUFBQSxVQUcvQixrQkFBa0I7QUFBQSxVQUlsQixnQkFBZ0I7QUFBQSxVQUNoQixVQUFVO0FBQUEsVUFDVixRQUFRLEVBQUMsSUFBSSxLQUFJLENBQUM7QUFBQSxVQUNsQixPQUFPO0FBQUEsUUFDVDtBQUFBO0FBQUEsVUFFRSxPQUFPO0FBQUE7QUFBQTtBQUFBLElBS2IsU0FBUyxXQUFXLENBQUMsU0FBMEI7QUFBQSxNQUM3QyxNQUFNLE1BQU0sR0FBRyxPQUFPO0FBQUEsTUFDdEIsSUFBSSxhQUFhO0FBQUEsUUFDZixJQUFJO0FBQUEsVUFBTyxPQUFPLFFBQVEsWUFBWSxHQUFHLEVBQUUsUUFBUSxNQUFNLEVBQWdCO0FBQUEsVUFDekUsTUFBTTtBQUFBLE1BQ1IsRUFDSztBQUFBLFFBQ0gsSUFBSTtBQUFBLFVBQUUsT0FBTyxjQUFjLElBQUksWUFBWSxzQkFBc0IsRUFBQyxRQUFRLElBQUcsQ0FBQyxDQUFDO0FBQUEsVUFBSyxNQUFNO0FBQUE7QUFBQSxNQUs1RixJQUFJLFFBQVEsU0FBUztBQUFBLFFBQWdCLGtCQUFrQixRQUFRLEtBQUssR0FBRztBQUFBO0FBQUEsSUFNekUsTUFBTSxZQUFZLENBQUksWUFDcEIsSUFBSSxRQUFrQixDQUFDLFlBQVk7QUFBQSxNQUNqQyxJQUFJLENBQUMsYUFBYTtBQUFBLFFBQUUsUUFBUSxJQUFJO0FBQUEsUUFBRztBQUFBLE1BQVE7QUFBQSxNQUMzQyxJQUFJO0FBQUEsUUFDRixPQUFPLFFBQVEsWUFBWSxHQUFHLE9BQWMsR0FBRyxDQUFDLFVBQWE7QUFBQSxVQUMzRCxJQUFJLE9BQU8sUUFBUSxXQUFXO0FBQUEsWUFBRSxRQUFRLElBQUk7QUFBQSxZQUFHO0FBQUEsVUFBUTtBQUFBLFVBQ3ZELFFBQVMsU0FBUyxJQUFpQjtBQUFBLFNBQ3BDO0FBQUEsUUFDRCxNQUFNO0FBQUEsUUFBRSxRQUFRLElBQUk7QUFBQTtBQUFBLEtBQ3ZCO0FBQUEsSUFHSCxNQUFNLGtCQUFrQixJQUFJO0FBQUEsSUFDNUIsSUFBSSxtQkFBbUI7QUFBQSxJQUN2QixNQUFNLG9CQUFvQixPQUFPLFFBQStCO0FBQUEsTUFDOUQsSUFBSSxDQUFDO0FBQUEsUUFBYTtBQUFBLE1BQ2xCLElBQUksZ0JBQWdCLElBQUksR0FBRztBQUFBLFFBQUc7QUFBQSxNQUM5QixJQUFJO0FBQUEsUUFBa0I7QUFBQSxNQUN0QixnQkFBZ0IsSUFBSSxHQUFHO0FBQUEsTUFDdkIsbUJBQW1CO0FBQUEsTUFDbkIsSUFBSTtBQUFBLFFBSUYsTUFBTSxhQUFhLElBQUksS0FBSyxFQUFFLFlBQVk7QUFBQSxRQUMxQyxNQUFNLE9BQU87QUFBQSxVQUNYLEtBQUssU0FBUztBQUFBLFVBQ2QsT0FBTyxTQUFTO0FBQUEsVUFDaEIsVUFBVSxFQUFDLE9BQU8sT0FBTyxZQUFZLFFBQVEsT0FBTyxZQUFXO0FBQUEsVUFDL0QsYUFBYSxLQUFLLElBQUksU0FBUyxnQkFBZ0IsYUFBYSxTQUFTLE1BQU0sZUFBZSxDQUFDO0FBQUEsVUFDM0YsY0FBYyxLQUFLLElBQUksU0FBUyxnQkFBZ0IsY0FBYyxTQUFTLE1BQU0sZ0JBQWdCLENBQUM7QUFBQSxVQUM5RixrQkFBa0IsT0FBTyxvQkFBb0I7QUFBQSxVQUM3QyxNQUFNLFNBQVMsZ0JBQWdCLFFBQVEsVUFBVSxZQUFZO0FBQUEsUUFDL0Q7QUFBQSxRQUNBLE1BQU0sUUFBUSxNQUFNLFVBQTZCLEVBQUMsTUFBTSxxQkFBb0IsQ0FBQztBQUFBLFFBQzdFLElBQUksQ0FBQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLFlBQVk7QUFBQSxVQUduQyxnQkFBZ0IsT0FBTyxHQUFHO0FBQUEsVUFDMUI7QUFBQSxRQUNGO0FBQUEsUUFDQSxNQUFNLFdBQXlCO0FBQUEsYUFDMUI7QUFBQSxVQUNIO0FBQUEsVUFDQSxZQUFZLE1BQU07QUFBQSxhQUNkLE1BQU0sVUFBVSxFQUFDLFNBQVMsS0FBSSxJQUFJLENBQUM7QUFBQSxRQUN6QztBQUFBLFFBQ0EsWUFBWSxFQUFDLE1BQU0saUJBQWlCLFNBQVMsU0FBUSxDQUFDO0FBQUEsUUFDdEQsTUFBTTtBQUFBLFFBQ04sZ0JBQWdCLE9BQU8sR0FBRztBQUFBLGdCQUMxQjtBQUFBLFFBQ0EsbUJBQW1CO0FBQUE7QUFBQTtBQUFBLElBSXZCLElBQUksYUFBYTtBQUFBLE1BQ2YsT0FBTyxRQUFRLFVBQVUsWUFBWSxDQUFDLEtBQVUsU0FBUyxpQkFBaUI7QUFBQSxRQUN4RSxJQUFJLE9BQU8sSUFBSSxTQUFTO0FBQUEsVUFBTSxPQUFPLGNBQWMsS0FBOEIsWUFBWTtBQUFBLFFBQzdGLE9BQU87QUFBQSxPQUNSO0FBQUEsSUFDSCxFQUFPO0FBQUEsTUFDTCxPQUFPLGlCQUFpQixtQkFBbUIsQ0FBQyxNQUFhO0FBQUEsUUFDdkQsTUFBTSxNQUFPLEVBQWtCO0FBQUEsUUFDL0IsTUFBTSxRQUFRLEtBQUs7QUFBQSxRQUNuQixJQUFJLFlBQVk7QUFBQSxRQUNoQixNQUFNLFVBQVUsQ0FBQyxVQUF5QjtBQUFBLFVBQ3hDLElBQUk7QUFBQSxZQUFXO0FBQUEsVUFDZixZQUFZO0FBQUEsVUFDWixJQUFJO0FBQUEsWUFBTyxPQUFPLGNBQWMsSUFBSSxZQUFZLHlCQUF5QixFQUFDLFFBQVEsRUFBQyxTQUFTLE9BQU8sTUFBSyxFQUFDLENBQUMsQ0FBQztBQUFBO0FBQUEsUUFFN0csY0FBYyxLQUFLLE9BQU87QUFBQSxPQUMzQjtBQUFBO0FBQUEsSUFTSCxTQUFTLGlCQUFpQixXQUFXLENBQUMsTUFBTTtBQUFBLE1BQzFDLElBQUksRUFBRSxRQUFRO0FBQUEsUUFBTyxlQUFlO0FBQUEsT0FDbkMsSUFBSTtBQUFBLElBUVAsTUFBTSwwQkFBMEIsTUFBWTtBQUFBLE1BQzFDLElBQUk7QUFBQSxRQUNGLE1BQU0sS0FBSyxXQUFXLDhCQUE4QjtBQUFBLFFBQ3BELE1BQU0sU0FBUyxXQUFXLGtDQUFrQztBQUFBLFFBQzVELE1BQU0sV0FBVyxDQUFDLFdBQW9EO0FBQUEsVUFDcEUsWUFBWSxFQUFDLE1BQU0scUJBQXFCLFFBQVEsTUFBTSxpQkFBaUIsRUFBQyxDQUFDO0FBQUE7QUFBQSxRQUUzRSxHQUFHLG1CQUFtQixVQUFVLE1BQU0sU0FBUyxjQUFjLENBQUM7QUFBQSxRQUM5RCxPQUFPLG1CQUFtQixVQUFVLE1BQU0sU0FBUyxnQkFBZ0IsQ0FBQztBQUFBLFFBQ3BFLE1BQU07QUFBQTtBQUFBLElBRVYsd0JBQXdCO0FBQUEsSUFReEIsTUFBTSxzQkFBc0I7QUFBQSxJQUM1QixNQUFNLHFCQUFxQjtBQUFBLElBQzNCLE1BQU0sdUJBQXNCO0FBQUEsSUFDNUIsTUFBTSxpQkFBZ0MsQ0FBQztBQUFBLElBQ3ZDLE1BQU0sV0FBVyxDQUFDLEdBQThCLE1BQU0sUUFDcEQsT0FBTyxLQUFLLEVBQUUsRUFBRSxNQUFNLEdBQUcsR0FBRztBQUFBLElBRTlCLE1BQU0sbUJBQW1CLElBQUksaUJBQWlCLENBQUMsWUFBWTtBQUFBLE1BQ3pELE1BQU0sTUFBTSxJQUFJLEtBQUssRUFBRSxZQUFZO0FBQUEsTUFDbkMsV0FBVyxLQUFLLFNBQVM7QUFBQSxRQUd2QixNQUFNLFFBQVEsRUFBRTtBQUFBLFFBQ2hCLElBQUksaUJBQWlCLFNBQVMsZ0JBQWdCLFNBQVMsWUFBWSxTQUFTLEtBQUs7QUFBQSxVQUFJO0FBQUEsUUFDckYsTUFBTSxNQUFzQixpQkFBaUIsVUFDekMsUUFDQyxNQUFNLGlCQUFpQjtBQUFBLFFBQzVCLE1BQU0sYUFBYSxNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sU0FBUyxZQUFZO0FBQUEsUUFDekUsSUFBSTtBQUFBLFFBQ0osSUFBSSxFQUFFLFNBQVMsYUFBYTtBQUFBLFVBQzFCLE1BQU0sUUFBUSxFQUFFLFdBQVc7QUFBQSxVQUMzQixNQUFNLFVBQVUsRUFBRSxhQUFhO0FBQUEsVUFDL0IsSUFBSSxVQUFVLEdBQUc7QUFBQSxVQUNqQixJQUFJLFFBQVEsR0FBRztBQUFBLFlBQ2IsTUFBTSxRQUFRLEVBQUUsV0FBVztBQUFBLFlBQzNCLFdBQVcsS0FBSyxTQUFTLGlCQUFpQixVQUFVLGNBQWMsS0FBSyxJQUFJO0FBQUEsVUFDN0U7QUFBQSxVQUNBLElBQUksVUFBVSxHQUFHO0FBQUEsWUFDZixNQUFNLFFBQVEsRUFBRSxhQUFhO0FBQUEsWUFDN0IsV0FBVyxLQUFLLFdBQVcsaUJBQWlCLFVBQVUsY0FBYyxLQUFLLElBQUk7QUFBQSxVQUMvRTtBQUFBLFVBQ0EsUUFBUSxFQUFDLE1BQU0sYUFBYSxJQUFJLEtBQUssUUFBUSxZQUFZLE9BQU8sU0FBUyxTQUFTLFNBQVMsU0FBUyxHQUFHLEVBQUM7QUFBQSxRQUMxRyxFQUFPLFNBQUksRUFBRSxTQUFTLGNBQWM7QUFBQSxVQUNsQyxNQUFNLE9BQU8sRUFBRSxpQkFBaUI7QUFBQSxVQUNoQyxNQUFNLFdBQVcscUJBQW9CLEtBQUssSUFBSTtBQUFBLFVBQzlDLE1BQU0sYUFBYSxNQUFNLElBQUksYUFBYSxJQUFJLElBQUksU0FBUztBQUFBLFVBQzNELE1BQU0sWUFBWSxFQUFFLFlBQVk7QUFBQSxVQUNoQyxNQUFNLFdBQVcsV0FBVyxlQUFnQixjQUFjLE9BQU8sWUFBWSxTQUFTLFNBQVM7QUFBQSxVQUMvRixNQUFNLFdBQVcsV0FBVyxlQUFlLFNBQVMsU0FBUztBQUFBLFVBQzdELFFBQVE7QUFBQSxZQUNOLE1BQU07QUFBQSxZQUFjLElBQUk7QUFBQSxZQUFLLFFBQVE7QUFBQSxZQUFZLGVBQWU7QUFBQSxZQUNoRTtBQUFBLFlBQVU7QUFBQSxZQUNWLFNBQVMsU0FBUyxHQUFHLGNBQWMsVUFBVSxZQUFZLFNBQVEsWUFBWSxHQUFHO0FBQUEsVUFDbEY7QUFBQSxRQUNGLEVBQU87QUFBQSxVQUVMLE1BQU0sV0FBVyxFQUFFLFlBQVk7QUFBQSxVQUMvQixNQUFNLFdBQVcsTUFBTSxhQUFhO0FBQUEsVUFDcEMsUUFBUTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQWlCLElBQUk7QUFBQSxZQUFLLFFBQVE7QUFBQSxZQUN4QyxVQUFVLGFBQWEsWUFBWSxTQUFTLFFBQVEsSUFBSTtBQUFBLFlBQ3hELFVBQVUsU0FBUyxRQUFRO0FBQUEsWUFDM0IsU0FBUyxTQUFTLEdBQUcsb0JBQW9CLFNBQVMsVUFBVSxFQUFFLE9BQU0sU0FBUyxVQUFVLEVBQUUsS0FBSyxHQUFHO0FBQUEsVUFDbkc7QUFBQTtBQUFBLFFBRUYsZUFBZSxLQUFLLEtBQUs7QUFBQSxRQUN6QixJQUFJLGVBQWUsU0FBUztBQUFBLFVBQXFCLGVBQWUsTUFBTTtBQUFBLE1BQ3hFO0FBQUEsS0FDRDtBQUFBLElBQ0QsSUFBSTtBQUFBLE1BQ0YsaUJBQWlCLFFBQVEsU0FBUyxpQkFBaUI7QUFBQSxRQUNqRCxXQUFXO0FBQUEsUUFBTSxTQUFTO0FBQUEsUUFDMUIsWUFBWTtBQUFBLFFBQU0sbUJBQW1CO0FBQUEsUUFDckMsZUFBZTtBQUFBLFFBQU0sdUJBQXVCO0FBQUEsTUFDOUMsQ0FBQztBQUFBLE1BQ0QsT0FBTyxHQUFHO0FBQUEsTUFBRSxRQUFRLEtBQUssS0FBSyxtQ0FBbUMsQ0FBQztBQUFBO0FBQUEsSUFJcEUsd0JBQXdCLE1BQU07QUFBQSxNQUM1QixNQUFNLFNBQVMsS0FBSyxJQUFJLElBQUk7QUFBQSxNQUM1QixPQUFPLGVBQWUsT0FBTyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUUsRUFBRSxLQUFLLE1BQU07QUFBQSxLQUMvRDtBQUFBLElBR0QsTUFBTSxNQUFvQjtBQUFBLE1BQ3hCO0FBQUEsTUFDQTtBQUFBLE1BQ0EsVUFBVTtBQUFBLE1BQ1YsY0FBYyxDQUFDLFFBQWdCO0FBQUEsUUFDN0IsTUFBTSxLQUFLLFNBQVMsY0FBYyxHQUFHO0FBQUEsUUFDckMsSUFBSTtBQUFBLFVBQUksYUFBYSxFQUFFO0FBQUE7QUFBQSxNQUV6QixRQUFRLENBQUMsT0FBZ0I7QUFBQSxRQUFFLGFBQWEsRUFBRTtBQUFBO0FBQUEsTUFDMUM7QUFBQSxNQUNBO0FBQUEsTUFDQSxTQUFTLE1BQU07QUFBQSxRQUNiLFlBQVk7QUFBQSxRQUNaLFdBQVcsVUFBVSxDQUFDLFFBQVEsUUFBUSxHQUFHO0FBQUEsVUFDdkMsT0FBTyxvQkFBb0IsYUFBYSxhQUE4QixJQUFJO0FBQUEsVUFDMUUsT0FBTyxvQkFBb0IsYUFBYSxhQUE4QixJQUFJO0FBQUEsVUFDMUUsT0FBTyxvQkFBb0IsV0FBVyxXQUE0QixJQUFJO0FBQUEsUUFDeEU7QUFBQSxRQUNBLFNBQVMsb0JBQW9CLFNBQVMsU0FBMEIsSUFBSTtBQUFBLFFBQ3BFLE9BQU8sb0JBQW9CLFdBQVcsY0FBYyxJQUFJO0FBQUEsUUFDeEQsT0FBTyxvQkFBb0IsU0FBUyxZQUFZLElBQUk7QUFBQSxRQUNwRCxPQUFPLG9CQUFvQixRQUFRLGNBQWMsSUFBSTtBQUFBLFFBQ3JELFdBQVc7QUFBQSxRQUNYLElBQUk7QUFBQSxVQUFFLElBQUksWUFBWSxRQUFRLGVBQWU7QUFBQSxZQUFHLFlBQVksWUFBWTtBQUFBLFVBQUssTUFBTTtBQUFBLFFBQ25GLFlBQVksT0FBTztBQUFBLFFBQ25CLE9BQU8sT0FBTztBQUFBO0FBQUEsSUFFbEI7QUFBQSxJQUNBLE9BQU8sT0FBTztBQUFBLElBQ2QsT0FBTyxjQUFjO0FBQUEsSUFJckIsU0FBUyxpQkFBaUIsd0JBQXdCLE1BQU07QUFBQSxNQUN0RCxJQUFJO0FBQUEsUUFBRSxJQUFJLFFBQVE7QUFBQSxRQUFLLE1BQU07QUFBQSxPQUM1QixFQUFDLE1BQU0sS0FBSSxDQUFDO0FBQUEsSUFDZixRQUFRLElBQUksS0FBSyxTQUFTLEVBQUMsWUFBVyxDQUFDO0FBQUE7QUFBQSxFQTRCekMsU0FBUyxlQUFlLENBQUMsTUFBcUIsYUFBYSxtQkFBbUIsUUFBUSxVQUF3QztBQUFBLElBQzVILElBQUksV0FBMEI7QUFBQSxJQUs5QixJQUFJLFlBQTJCO0FBQUEsSUFDL0IsSUFBSSxXQUEyQjtBQUFBLElBQy9CLElBQUksU0FBUztBQUFBLElBQ2IsSUFBSSxXQUF1QztBQUFBLElBQzNDLElBQUksZUFBd0M7QUFBQSxJQUc1QyxNQUFNLFNBQVMsQ0FBd0IsS0FBYSxXQUE0QztBQUFBLE1BQzlGLE1BQU0sT0FBTyxTQUFTLGNBQWMsR0FBRztBQUFBLE1BQ3ZDLE9BQU8sT0FBTyxLQUFLLE9BQU8sTUFBTTtBQUFBLE1BQ2hDLE9BQU87QUFBQTtBQUFBLElBR1QsTUFBTSxZQUFZLENBQUMsWUFBcUM7QUFBQSxNQUN0RCxHQUFHLGdCQUFnQjtBQUFBLE1BQ25CLE1BQU0sV0FBVyxRQUFRLFFBQVEsUUFBUTtBQUFBLE1BR3pDLElBQUksVUFBVTtBQUFBLFFBQ1osTUFBTSxTQUFTLE9BQXVCLE9BQU87QUFBQSxVQUMzQyxPQUFPO0FBQUEsVUFBVyxZQUFZO0FBQUEsVUFDOUIsTUFBTTtBQUFBLFVBQ04sY0FBYztBQUFBLFVBQ2QsZUFBZTtBQUFBLFFBQ2pCLENBQUM7QUFBQSxRQUNELE9BQU8sY0FBYyxJQUFJLFFBQVEsS0FBSztBQUFBLFFBQ3RDLEdBQUcsT0FBTyxNQUFNO0FBQUEsTUFDbEI7QUFBQSxNQUVBLE1BQU0sT0FBTyxPQUF5QixNQUFNO0FBQUEsUUFDMUMsUUFBUTtBQUFBLFFBQWEsU0FBUztBQUFBLFFBQWMsV0FBVztBQUFBLE1BQ3pELENBQUM7QUFBQSxNQUNELGVBQWU7QUFBQSxNQUNmLElBQUksUUFBUSxVQUFVLFFBQVE7QUFBQSxRQU01QixHQUFHLE9BQU8sSUFBSTtBQUFBLFFBQ2QsV0FBVyxLQUFLLFFBQVE7QUFBQSxVQUFVLGVBQWUsQ0FBQztBQUFBLE1BQ3BEO0FBQUEsTUFHQSxNQUFNLFNBQVMsT0FBdUIsT0FBTztBQUFBLFFBQzNDLFNBQVM7QUFBQSxRQUFRLEtBQUs7QUFBQSxRQUFPLFlBQVk7QUFBQSxRQUN6QyxXQUFXO0FBQUEsUUFBTyxZQUFZO0FBQUEsUUFDOUIsV0FBVztBQUFBLE1BQ2IsQ0FBQztBQUFBLE1BQ0QsTUFBTSxLQUFLLE9BQTRCLFlBQVk7QUFBQSxRQUNqRCxNQUFNO0FBQUEsUUFBSyxXQUFXO0FBQUEsUUFBUSxXQUFXO0FBQUEsUUFDekMsUUFBUTtBQUFBLFFBQ1IsWUFBWTtBQUFBLFFBQW1CLE9BQU87QUFBQSxRQUN0QyxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTO0FBQUEsUUFDVCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxXQUFXO0FBQUEsTUFDYixDQUFDO0FBQUEsTUFDRCxHQUFHLGNBQWMsV0FBVyxhQUFZO0FBQUEsTUFDeEMsR0FBRyxPQUFPO0FBQUEsTUFDVixHQUFHLGlCQUFpQixTQUFTLE1BQU07QUFBQSxRQUFFLEdBQUcsTUFBTSxjQUFjO0FBQUEsT0FBWTtBQUFBLE1BQ3hFLEdBQUcsaUJBQWlCLFFBQVEsTUFBTTtBQUFBLFFBQUUsR0FBRyxNQUFNLGNBQWM7QUFBQSxPQUFzQjtBQUFBLE1BQ2pGLFdBQVc7QUFBQSxNQU9YLE1BQU0sVUFBVSxPQUEwQixVQUFVO0FBQUEsUUFDbEQsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQWUsWUFBWTtBQUFBLFFBQVUsZ0JBQWdCO0FBQUEsUUFDOUQsS0FBSztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBSVQsUUFBUTtBQUFBLFFBQ1IsWUFBWTtBQUFBLFFBQ1osT0FBTztBQUFBLFFBQVEsUUFBUTtBQUFBLFFBQUssY0FBYztBQUFBLFFBQzFDLE1BQU07QUFBQSxRQUNOLGVBQWU7QUFBQSxRQUNmLFlBQVk7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLFdBQVc7QUFBQSxNQUNiLENBQUM7QUFBQSxNQUNELE1BQU0sV0FBVyxPQUF3QixRQUFRO0FBQUEsUUFDL0MsU0FBUztBQUFBLFFBQWUsWUFBWTtBQUFBLE1BQ3RDLENBQUM7QUFBQSxNQUNELFNBQVMsWUFBWSxTQUFTLFVBQVUsdUJBQXVCLEVBQUU7QUFBQSxNQUNqRSxNQUFNLFlBQVksT0FBd0IsUUFBUSxFQUFDLFVBQVUsT0FBTSxDQUFDO0FBQUEsTUFDcEUsVUFBVSxjQUFjLFdBQVcsUUFBUTtBQUFBLE1BQzNDLFFBQVEsT0FBTyxVQUFVLFNBQVM7QUFBQSxNQUNsQyxRQUFRLGFBQWEsY0FBYyxXQUFXLGdCQUFnQixxQkFBcUI7QUFBQSxNQUNuRixPQUFPLE9BQU8sSUFBSSxPQUFPO0FBQUEsTUFDekIsR0FBRyxPQUFPLE1BQU07QUFBQSxNQUVoQixNQUFNLE9BQU8sT0FBdUIsT0FBTztBQUFBLFFBQ3pDLE9BQU87QUFBQSxRQUFXLFVBQVU7QUFBQSxRQUFRLFdBQVc7QUFBQSxNQUNqRCxDQUFDO0FBQUEsTUFDRCxLQUFLLGNBQWMsV0FDZixzREFDQTtBQUFBLE1BQ0osR0FBRyxPQUFPLElBQUk7QUFBQSxNQUVkLFNBQVMsY0FBYyxDQUFDLE1BQW9CO0FBQUEsUUFDMUMsTUFBTSxLQUFLLE9BQXNCLE1BQU07QUFBQSxVQUNyQyxRQUFRO0FBQUEsVUFBUyxPQUFPO0FBQUEsVUFBVyxXQUFXO0FBQUEsUUFDaEQsQ0FBQztBQUFBLFFBQ0QsR0FBRyxjQUFjO0FBQUEsUUFDakIsS0FBSyxPQUFPLEVBQUU7QUFBQSxRQUNkLElBQUksQ0FBQyxLQUFLO0FBQUEsVUFBWSxHQUFHLGFBQWEsTUFBTSxNQUFNO0FBQUE7QUFBQSxNQUdwRCxNQUFNLFNBQVMsTUFBWTtBQUFBLFFBQ3pCLE1BQU0sT0FBTyxHQUFHLE1BQU0sS0FBSztBQUFBLFFBQzNCLElBQUksQ0FBQztBQUFBLFVBQU07QUFBQSxRQUNYLElBQUksWUFBWSxVQUFVO0FBQUEsVUFLeEIsWUFBWTtBQUFBLFlBQ1YsTUFBTTtBQUFBLFlBQWdCO0FBQUEsWUFBVTtBQUFBLFlBQ2hDLEtBQUssU0FBUztBQUFBLGVBQ1YsWUFBWSxFQUFDLFdBQVcsVUFBUyxJQUFJLENBQUM7QUFBQSxVQUM1QyxDQUFDO0FBQUEsUUFDSCxFQUFPLFNBQUksVUFBVTtBQUFBLFVBSW5CLE1BQU0sUUFBUSxrQkFBa0IsVUFBVSxJQUFJO0FBQUEsVUFDOUMsUUFBUSxXQUFXO0FBQUEsVUFDbkIsUUFBUSxNQUFNLE1BQU07QUFBQSxVQUNwQixRQUFRLElBQUksTUFBTTtBQUFBLFVBQ2xCLFFBQVEsV0FBVyxNQUFNO0FBQUEsVUFDekIsUUFBUSxXQUFXLENBQUMsR0FBSSxRQUFRLFlBQVksQ0FBQyxHQUFJLElBQUk7QUFBQSxVQUNyRCxXQUFXLE1BQU07QUFBQSxVQUNqQixZQUFZLE1BQU07QUFBQSxVQUNsQixVQUFVLE9BQU87QUFBQSxVQUNqQjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLEdBQUcsUUFBUTtBQUFBLFFBQ1gsUUFBUSxXQUFXLENBQUMsR0FBSSxRQUFRLFlBQVksQ0FBQyxHQUFJLElBQUk7QUFBQSxRQUNyRCxlQUFlLElBQUk7QUFBQTtBQUFBLE1BRXJCLFFBQVEsaUJBQWlCLFNBQVMsTUFBTTtBQUFBLE1BQ3hDLEdBQUcsaUJBQWlCLFdBQVcsQ0FBQyxNQUFNO0FBQUEsUUFDcEMsSUFBSSxFQUFFLFFBQVEsV0FBVyxDQUFDLEVBQUUsVUFBVTtBQUFBLFVBQUUsRUFBRSxlQUFlO0FBQUEsVUFBRyxPQUFPO0FBQUEsUUFBRztBQUFBLFFBQ3RFLElBQUksRUFBRSxRQUFRLFVBQVU7QUFBQSxVQUFFLEVBQUUsZUFBZTtBQUFBLFVBQUcsS0FBSztBQUFBLFFBQUc7QUFBQSxRQUN0RCxFQUFFLGdCQUFnQjtBQUFBLE9BQ25CO0FBQUEsTUFHRCxJQUFJLFlBQVk7QUFBQSxRQUNkLGFBQWE7QUFBQSxRQUNiLHNCQUFzQixNQUFNLEdBQUcsTUFBTSxFQUFDLGVBQWUsS0FBSSxDQUFDLENBQUM7QUFBQSxNQUM3RDtBQUFBO0FBQUEsSUFHRixNQUFNLE1BQU07QUFBQSxJQUNaLE1BQU0sU0FBUztBQUFBLElBYWYsTUFBTSxXQUFXLENBQUMsV0FBMEI7QUFBQSxNQUMxQyxNQUFNLElBQUksT0FBTyxzQkFBc0I7QUFBQSxNQUt2QyxNQUFNLFVBQVUsR0FBRyxNQUFNO0FBQUEsTUFDekIsR0FBRyxNQUFNLGFBQWE7QUFBQSxNQUN0QixHQUFHLE1BQU0sVUFBVTtBQUFBLE1BQ25CLEdBQUcsTUFBTSxPQUFPO0FBQUEsTUFDaEIsR0FBRyxNQUFNLE1BQU07QUFBQSxNQUNmLE1BQU0sTUFBTSxHQUFHLHNCQUFzQjtBQUFBLE1BQ3JDLE1BQU0sS0FBSyxJQUFJLFNBQVM7QUFBQSxNQUN4QixNQUFNLEtBQUssSUFBSSxVQUFVO0FBQUEsTUFDekIsR0FBRyxNQUFNLGFBQWEsV0FBVztBQUFBLE1BSWpDLE1BQU0sWUFBWSxPQUFPLGNBQWMsRUFBRSxTQUFTO0FBQUEsTUFDbEQsTUFBTSxZQUFZLEVBQUUsTUFBTTtBQUFBLE1BQzFCLE1BQU0sV0FBVyxLQUFLLGFBQWEsWUFBWTtBQUFBLE1BQy9DLElBQUksTUFBTSxXQUFXLEVBQUUsTUFBTSxNQUFNLEtBQUssRUFBRSxTQUFTO0FBQUEsTUFDbkQsTUFBTSxLQUFLLElBQUksUUFBUSxLQUFLLElBQUksS0FBSyxPQUFPLGNBQWMsS0FBSyxNQUFNLENBQUM7QUFBQSxNQUl0RSxJQUFJLE9BQU8sRUFBRTtBQUFBLE1BQ2IsT0FBTyxLQUFLLElBQUksUUFBUSxLQUFLLElBQUksTUFBTSxPQUFPLGFBQWEsS0FBSyxNQUFNLENBQUM7QUFBQSxNQUV2RSxHQUFHLE1BQU0sT0FBTyxLQUFLLE1BQU0sSUFBSSxJQUFJO0FBQUEsTUFDbkMsR0FBRyxNQUFNLE1BQU0sS0FBSyxNQUFNLEdBQUcsSUFBSTtBQUFBLE1BQ2pDLEdBQUcsTUFBTSxVQUFVO0FBQUE7QUFBQSxJQUdyQixNQUFNLE9BQU8sTUFBWTtBQUFBLE1BQ3ZCLGFBQWE7QUFBQSxNQUNiLEdBQUcsTUFBTSxVQUFVO0FBQUEsTUFDbkIsV0FBVztBQUFBLE1BQ1gsWUFBWTtBQUFBLE1BQ1osV0FBVztBQUFBLE1BQ1gsU0FBUztBQUFBLE1BQ1QsV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLE1BQ2YsYUFBYTtBQUFBLE1BQ2IsZ0JBQWdCO0FBQUEsTUFDaEIsT0FBTztBQUFBO0FBQUEsSUFHVCxNQUFNLFdBQVcsTUFBZSxRQUFRLFFBQVEsS0FBSyxTQUFTLGtCQUFrQjtBQUFBLElBQ2hGLE1BQU0sT0FBTyxDQUFDLFFBQWlCLFlBQTRDO0FBQUEsTUFDekUsSUFBSSxDQUFDLFNBQVM7QUFBQSxRQUNaLElBQUksVUFBVSxTQUFTO0FBQUEsVUFBRztBQUFBLFFBQzFCLEtBQUs7QUFBQSxRQUNMO0FBQUEsTUFDRjtBQUFBLE1BTUEsSUFBSSxhQUFhLFFBQVEsYUFBYSxRQUFRLE9BQU8sVUFBVSxXQUFXO0FBQUEsUUFDeEUsSUFBSSxRQUFRLFVBQVUsVUFBVSxjQUFjO0FBQUEsVUFDNUMsYUFBYSxnQkFBZ0I7QUFBQSxVQUM3QixXQUFXLEtBQUssUUFBUSxVQUFVO0FBQUEsWUFDaEMsTUFBTSxLQUFLLFNBQVMsY0FBYyxJQUFJO0FBQUEsWUFDdEMsT0FBTyxPQUFPLEdBQUcsT0FBTyxFQUFDLFFBQVEsU0FBUyxPQUFPLFdBQVcsV0FBVyxhQUFZLENBQUM7QUFBQSxZQUNwRixHQUFHLGNBQWM7QUFBQSxZQUNqQixhQUFhLE9BQU8sRUFBRTtBQUFBLFVBQ3hCO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFNQSxXQUFXLFFBQVEsWUFBWTtBQUFBLE1BQy9CLFlBQVksUUFBUSxPQUFPO0FBQUEsTUFDM0IsV0FBVztBQUFBLE1BQ1gsVUFBVSxPQUFPO0FBQUEsTUFDakIsU0FBUyxNQUFNO0FBQUEsTUFDZixjQUFjO0FBQUEsTUFDZCxPQUFPLE1BQU07QUFBQTtBQUFBLElBS2YsSUFBSSxhQUFhO0FBQUEsSUFDakIsTUFBTSxVQUFVLE1BQVk7QUFBQSxNQUMxQixJQUFJLENBQUM7QUFBQSxRQUFVO0FBQUEsTUFDZixJQUFJLFNBQVMsa0JBQWtCLE1BQU0sU0FBUyxrQkFBa0I7QUFBQSxRQUFVO0FBQUEsTUFHMUUsc0JBQXNCLE1BQU07QUFBQSxRQUMxQixJQUFJO0FBQUEsVUFBVSxTQUFTLE1BQU0sRUFBQyxlQUFlLEtBQUksQ0FBQztBQUFBLE9BQ25EO0FBQUE7QUFBQSxJQUlILE1BQU0sZ0JBQWdCLE1BQVk7QUFBQSxNQUNoQyxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQSxJQUdWLEdBQUcsaUJBQWlCLGNBQWMsTUFBTTtBQUFBLE1BQ3RDLFNBQVM7QUFBQSxNQUNULElBQUksWUFBWSxTQUFTLGtCQUFrQjtBQUFBLFFBQVUsU0FBUyxNQUFNO0FBQUEsS0FDckU7QUFBQSxJQUNELEdBQUcsaUJBQWlCLGNBQWMsTUFBTTtBQUFBLE1BQ3RDLElBQUksYUFBYSxTQUFTLE1BQU0sU0FBUyxLQUFLLFNBQVMsa0JBQWtCO0FBQUEsUUFBVztBQUFBLE1BQ3BGLFNBQVM7QUFBQSxLQUNWO0FBQUEsSUFLRCxNQUFNLGVBQWUsTUFBZTtBQUFBLE1BQ2xDLElBQUksQ0FBQztBQUFBLFFBQVUsT0FBTztBQUFBLE1BQ3RCLElBQUksQ0FBQyxTQUFTO0FBQUEsUUFBYSxPQUFPO0FBQUEsTUFDbEMsTUFBTSxJQUFJLFNBQVMsc0JBQXNCO0FBQUEsTUFDekMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFLFdBQVc7QUFBQTtBQUFBLElBR3ZDLE1BQU0sYUFBYSxNQUFZO0FBQUEsTUFDN0IsSUFBSSxHQUFHLE1BQU0sWUFBWTtBQUFBLFFBQVM7QUFBQSxNQUNsQyxJQUFJLGFBQWEsR0FBRztBQUFBLFFBQUUsS0FBSztBQUFBLFFBQUc7QUFBQSxNQUFRO0FBQUEsTUFDdEMsU0FBUyxRQUFTO0FBQUE7QUFBQSxJQUVwQixPQUFPLGlCQUFpQixVQUFVLFlBQVksSUFBSTtBQUFBLElBQ2xELE9BQU8saUJBQWlCLFVBQVUsVUFBVTtBQUFBLElBUzVDLElBQUksV0FBVztBQUFBLElBQ2YsTUFBTSxlQUFlLE1BQVk7QUFBQSxNQUMvQixJQUFJLFVBQVU7QUFBQSxRQUFFLHFCQUFxQixRQUFRO0FBQUEsUUFBRyxXQUFXO0FBQUEsTUFBRztBQUFBO0FBQUEsSUFFaEUsSUFBSSxnQkFBZ0I7QUFBQSxJQUNwQixNQUFNLGdCQUFnQixNQUFZO0FBQUEsTUFDaEMsYUFBYTtBQUFBLE1BQ2IsTUFBTSxPQUFPLE1BQVk7QUFBQSxRQUN2QixJQUFJLEdBQUcsTUFBTSxZQUFZLFNBQVM7QUFBQSxVQUFFLFdBQVc7QUFBQSxVQUFHO0FBQUEsUUFBUTtBQUFBLFFBQzFELElBQUksYUFBYSxHQUFHO0FBQUEsVUFBRSxLQUFLO0FBQUEsVUFBRztBQUFBLFFBQVE7QUFBQSxRQUd0QyxNQUFNLElBQUksU0FBVSxzQkFBc0I7QUFBQSxRQUMxQyxNQUFNLE1BQU0sR0FBRyxLQUFLLE1BQU0sRUFBRSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUUsR0FBRyxLQUFLLEtBQUssTUFBTSxFQUFFLEtBQUssS0FBSyxLQUFLLE1BQU0sRUFBRSxNQUFNO0FBQUEsUUFDcEcsSUFBSSxRQUFRLGVBQWU7QUFBQSxVQUFFLGdCQUFnQjtBQUFBLFVBQUssU0FBUyxRQUFTO0FBQUEsUUFBRztBQUFBLFFBQ3ZFLFdBQVcsc0JBQXNCLElBQUk7QUFBQTtBQUFBLE1BRXZDLFdBQVcsc0JBQXNCLElBQUk7QUFBQTtBQUFBLElBTXZDLFNBQVMsaUJBQWlCLFdBQVcsQ0FBQyxNQUFNO0FBQUEsTUFDMUMsSUFBSSxFQUFFLFFBQVEsWUFBWSxHQUFHLE1BQU0sWUFBWSxTQUFTO0FBQUEsUUFBRSxLQUFLO0FBQUEsTUFBRztBQUFBLE9BQ2pFLElBQUk7QUFBQSxJQUVQLE9BQU8sRUFBQyxNQUFNLE1BQU0sVUFBVSxNQUFNLFVBQVUsU0FBUyxHQUFHLGVBQWUsZUFBZSxhQUFZO0FBQUE7IiwKICAiZGVidWdJZCI6ICJBRDUxQzNDMUMxNkNFMzE2NjQ3NTZFMjE2NDc1NkUyMSIsCiAgIm5hbWVzIjogW10KfQ==
