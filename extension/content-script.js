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
      if (!orphanGuard())
        return;
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
      if (!orphanGuard())
        return;
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
    const onKeyDownAlt = (e) => {
      if (!orphanGuard())
        return;
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
        setAltActive(false);
      }
    };
    const onWindowBlur = () => {
      altForwarded = false;
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

//# debugId=09216269E2CC297F64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2RvbS50cyIsICJzcmMvdHlwZXMudHMiLCAic3JjL2x1Y2lkZS50cyIsICJzcmMvY29udGVudC1zY3JpcHQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gRE9NIGhlbHBlcnMgc2hhcmVkIGJ5IHRoZSBjb250ZW50IHNjcmlwdC4gUHVyZSBmdW5jdGlvbnMgd2hlcmUgcG9zc2libGUg4oCUXG4vLyBhbnkgRE9NLWJvdW5kIHN0YXRlIGxpdmVzIGluIHRoZSBjYWxsaW5nIG1vZHVsZS5cblxuaW1wb3J0IHR5cGUge0VudHJ5LCBSZWN0LCBNYXRjaGVkUnVsZSwgRnJhbWV3b3JrSW5mbywgQW5jZXN0b3IsIFZpZXdwb3J0LCBEb21NdXRhdGlvbn0gZnJvbSAnLi90eXBlcy50cyc7XG5cbi8vIEhvb2sgZm9yIHRoZSBjb250ZW50LXNjcmlwdC1vd25lZCBNdXRhdGlvbk9ic2VydmVyIGJ1ZmZlci4gU2V0IGJ5XG4vLyBjb250ZW50LXNjcmlwdC50cyBhdCBib290IHZpYSBgc2V0TXV0YXRpb25CdWZmZXJHZXR0ZXJgOyBudWxsYWJsZVxuLy8gYmVjYXVzZSBkb20udHMgaXMgYWxzbyBpbXBvcnRlZCBieSB0ZXN0cyAvIHN0YW5kYWxvbmUgaGFybmVzc2VzIHRoYXRcbi8vIGRvbid0IHJ1biBhbiBvYnNlcnZlci4gY2FwdHVyZUVudHJ5IHJlYWRzIHRoZSBtb3N0IHJlY2VudCAzIHJlY29yZHNcbi8vIGluIHRoZSA4LXNlY29uZCB3aW5kb3cgdmlhIHRoaXMgZ2V0dGVyICjCpzQuOCDigJQgcmVwcm8gY29udGV4dCkuXG5sZXQgbXV0YXRpb25CdWZmZXJHZXR0ZXI6ICgoKSA9PiBEb21NdXRhdGlvbltdKSB8IG51bGwgPSBudWxsO1xuZXhwb3J0IGNvbnN0IHNldE11dGF0aW9uQnVmZmVyR2V0dGVyID0gKGZuOiAoKSA9PiBEb21NdXRhdGlvbltdKTogdm9pZCA9PiB7XG4gIG11dGF0aW9uQnVmZmVyR2V0dGVyID0gZm47XG59O1xuXG4vLyAtLS0tIExpbWl0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IE1BWF9URVhUID0gMTQwO1xuY29uc3QgTUFYX1NOSVBQRVQgPSAyNjAwO1xuY29uc3QgTUFYX0FUVFIgPSAxNDA7XG5jb25zdCBNQVhfUlVMRVMgPSAxMjtcbmNvbnN0IE1BWF9QUkVWSUVXX0NTUyA9IDQyMDtcblxuLy8gLS0tLSBUaW55IHV0aWxpdGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBjYW5Fc2NhcGUgPSB0eXBlb2YgQ1NTICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQ1NTLmVzY2FwZSA9PT0gJ2Z1bmN0aW9uJztcbmV4cG9ydCBjb25zdCBlc2NhcGVDc3MgPSAodjogc3RyaW5nKTogc3RyaW5nID0+XG4gIGNhbkVzY2FwZSA/IENTUy5lc2NhcGUodikgOiBTdHJpbmcodikucmVwbGFjZSgvKFtcXFxcICM7PyUmLC4rKn4nOlwiIV4kW1xcXSgpPT58L0BdKS9nLCAnXFxcXCQxJyk7XG5cbmV4cG9ydCBjb25zdCB0cmltVGV4dCA9ICh2OiB1bmtub3duLCBtYXggPSBNQVhfVEVYVCk6IHN0cmluZyA9PlxuICBTdHJpbmcodiA/PyAnJykucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKS5zbGljZSgwLCBtYXgpO1xuXG5jb25zdCBzYWZlQ2FsbCA9IDxUPihmbjogKCkgPT4gVCwgZmFsbGJhY2s6IFQpOiBUID0+IHtcbiAgdHJ5IHsgcmV0dXJuIGZuKCk7IH0gY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbn07XG5cbmNvbnN0IHRvUG9zaXRpdmVJbnQgPSAodjogdW5rbm93bik6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBuID0gTnVtYmVyKHYpO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwID8gTWF0aC5yb3VuZChuKSA6IG51bGw7XG59O1xuXG5jb25zdCBhdHRyID0gKGVsOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgdHJpbVRleHQoZWwuZ2V0QXR0cmlidXRlKG5hbWUpLCAxMjApO1xuXG5leHBvcnQgY29uc3QgY29tcGFjdFRhcmdldCA9IChlbDogRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGxldCBvdXQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChlbC5pZCkgb3V0ICs9ICcjJyArIGVsLmlkO1xuICBpZiAoZWwuY2xhc3NMaXN0Py5sZW5ndGgpIHtcbiAgICBvdXQgKz0gJy4nICsgQXJyYXkuZnJvbShlbC5jbGFzc0xpc3QpLnNsaWNlKDAsIDQpLmpvaW4oJy4nKTtcbiAgfVxuICByZXR1cm4gdHJpbVRleHQob3V0LCAxODApO1xufTtcblxuLy8gLS0tLSBTZWxlY3RvciBidWlsZGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBEWU5BTUlDX0lEX1JFID0gL14ocmFkaXgtfGhlYWRsZXNzdWktfG11aS18YXJpYS18ZW1iZXJ8cmVhY3QtYXJpYXw6clswLTlhLXpdKzopL2k7XG5leHBvcnQgY29uc3QgaXNTdGFibGVJZCA9IChpZDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGlkIGlzIHN0cmluZyA9PlxuICBCb29sZWFuKGlkKSAmJiAhRFlOQU1JQ19JRF9SRS50ZXN0KGlkISkgJiYgIS9bOlxcc10vLnRlc3QoaWQhKSAmJiAhL15cXGQvLnRlc3QoaWQhKTtcblxuLy8gVGFpbHdpbmQgLyB1dGlsaXR5LUNTUyBjbGFzcyBub2lzZSArIENTUy1pbi1KUyBoYXNoIHByZWZpeGVzLiBBbnl0aGluZ1xuLy8gbWF0Y2hpbmcgdGhpcyBwcmVmaXgtc2V0IGlzIGZpbHRlcmVkIG91dCBvZiBzdGFibGVDbGFzc2VzKCkgc28gY3NzUGF0aCgpXG4vLyBwcmVmZXJzIHNlbWFudGljIGNsYXNzZXMuXG4vL1xuLy8gU291cmNlLW9mLXRydXRoIGZpbHRlcjpcbi8vICDigKIgVGFpbHdpbmQgdXRpbGl0eSBwcmVmaXhlcyAoZmxleCwgZ3JpZCwgdy0sIGgtLCB0cmFuc2l0aW9uLCBkdXJhdGlvbi0sIOKApilcbi8vICDigKIgUHNldWRvLXN0YXRlIHByZWZpeGVzIChob3ZlcjosIGZvY3VzOiwgc206LCBkYXJrOilcbi8vICDigKIgQ1NTLWluLUpTIGhhc2ggY2xhc3NlcyAoY3NzLSwgc2MtLCBlbW90aW9uLSwgY2hha3JhLSwganNzMTIzLCBtYWtlU3R5bGVzLSxcbi8vICAgIE11aUJveC0sIF9uZXh0LSwgLS0pIOKAlCBhZGRlZCAyMDI2IGZyb20gY3NzLXNlbGVjdG9yLWdlbmVyYXRvcidzXG4vLyAgICBgaWdub3JlR2VuZXJhdGVkQ2xhc3NOYW1lc2AgZGVmYXVsdHMuXG5jb25zdCBVVElMSVRZX0NMQVNTX1JFID1cbiAgL14oZmxleHxncmlkfGJsb2NrfGlubGluZXxoaWRkZW58cmVsYXRpdmV8YWJzb2x1dGV8Zml4ZWR8c3RpY2t5fHctfGgtfHAtfG0tfHB4LXxweS18cHQtfHBiLXxwbC18cHItfG14LXxteS18bXQtfG1iLXxtbC18bXItfGdhcC18c3BhY2UtfHRleHQtfGZvbnQtfGxlYWRpbmctfHRyYWNraW5nLXxiZy18Ym9yZGVyfHJvdW5kZWR8c2hhZG93fG9wYWNpdHl8Y3Vyc29yLXxzZWxlY3QtfHBvaW50ZXItfG92ZXJmbG93fHdoaXRlc3BhY2V8dHJ1bmNhdGV8aXRlbXMtfGp1c3RpZnktfGNvbnRlbnQtfHNlbGYtfHBsYWNlLXx6LXx0b3AtfGxlZnQtfHJpZ2h0LXxib3R0b20tfG1pbi18bWF4LXxhc3BlY3QtfG9iamVjdC18aW5zZXQtfG9yZGVyLXxjb2wtfHJvdy18Z2FwfGhvdmVyOnxmb2N1czp8YWN0aXZlOnxkaXNhYmxlZDp8c206fG1kOnxsZzp8eGw6fDJ4bDp8ZGFyazp8Zmlyc3R8bGFzdHxvZGR8ZXZlbnxncm91cHxwZWVyfHRyYW5zaXRpb258ZHVyYXRpb24tfGRlbGF5LXxlYXNlLXxhbmltYXRlLXx0cmFuc2Zvcm18c2NhbGUtfHJvdGF0ZS18dHJhbnNsYXRlLXxza2V3LXxvcmlnaW4tfHJpbmctfGRpdmlkZS18b3V0bGluZS18ZmlsbC18c3Ryb2tlLXxmcm9tLXx0by18dmlhLXxwbGFjZWhvbGRlci18Y2FyZXQtfGFjY2VudC18YXBwZWFyYW5jZS18YmFja2Ryb3AtfGNsaXAtfGNvbnRhaW4tfGRlY29yYXRpb24tfHVuZGVybGluZXxsaW5lLXxsaXN0LXx0YWJ1bGFyfG51bXN8cHJvc2V8bm90LXxtb3Rpb24tfGlzb2xhdGV8aXNvbGF0aW9ufHdpbGwtfGFudGlhbGlhc2VkfHN1YnBpeGVsLXxzci1vbmx5fGZsb2F0LXxjbGVhci18cmVzaXplLXxzY3JvbGwtfHNuYXAtfHRvdWNoLXxpbnZpc2libGV8dmlzaWJsZXxjc3MtfHNjLVthLXowLTldfGVtb3Rpb24tfGNoYWtyYS18anNzXFxkK3xtYWtlU3R5bGVzLXxNdWlCb3gtfF9uZXh0LXxNdWlCdXR0b25CYXNlLXzPgWRfX3xfX3dhYl98d2FiX3xwbHNtYy0pL2k7XG5cbmNvbnN0IHN0YWJsZUNsYXNzZXMgPSAoZWw6IEVsZW1lbnQsIG1heCA9IDIpOiBzdHJpbmdbXSA9PiB7XG4gIGlmICghZWwuY2xhc3NMaXN0KSByZXR1cm4gW107XG4gIGNvbnN0IGFsbCA9IEFycmF5LmZyb20oZWwuY2xhc3NMaXN0KTtcbiAgY29uc3Qgc3RhYmxlID0gYWxsLmZpbHRlcigoYykgPT4gIVVUSUxJVFlfQ0xBU1NfUkUudGVzdChjKSk7XG4gIGlmIChzdGFibGUubGVuZ3RoKSByZXR1cm4gc3RhYmxlLnNsaWNlKDAsIG1heCk7XG4gIHJldHVybiBhbGwuc2xpY2UoMCwgMSk7XG59O1xuXG5jb25zdCBpc1VuaXF1ZSA9IChzY29wZTogUGFyZW50Tm9kZSwgc2VsZWN0b3I6IHN0cmluZywgdGFyZ2V0OiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIHJldHVybiBtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSB0YXJnZXQ7XG4gIH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbn07XG5cbmNvbnN0IG93bkRlc2NyaXB0b3IgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICBsZXQgcyA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGMgPSBzdGFibGVDbGFzc2VzKGVsKTtcbiAgaWYgKGMubGVuZ3RoKSBzICs9ICcuJyArIGMubWFwKGVzY2FwZUNzcykuam9pbignLicpO1xuICByZXR1cm4gcztcbn07XG5cbi8vIEJ1aWxkIHRoZSBzaG9ydGVzdCBDU1Mgc2VsZWN0b3IgdGhhdCB1bmlxdWVseSBpZGVudGlmaWVzIGBlbGAgb24gdGhlIHBhZ2UuXG4vLyBTdHJhdGVneSAoZWFjaCBjYW5kaWRhdGUgdGVzdGVkIHdpdGggcXVlcnlTZWxlY3RvckFsbCBmb3IgdW5pcXVlbmVzcyk6XG4vL1xuLy8gICAxLiB0YWcuc2VtYW50aWNDbGFzcyDigJQgcGFnZS13aWRlIHVuaXF1ZSAoZS5nLiBgaGVhZGVyLnN0aWNreWApLlxuLy8gICAyLiAjc3RhYmxlQW5jZXN0b3JJZCB0YWcuc2VtYW50aWNDbGFzcyDigJQgaWYgYSBzdGFibGUtaWQgYW5jZXN0b3IgZXhpc3RzLlxuLy8gICAzLiBGdWxsIGRlc2NlbmRhbnQgcGF0aDsgVEhFTiBydW4gb3B0aW1pemUoKSDigJQgdHJ5IHJlbW92aW5nIGVhY2ggaW50ZXJpb3Jcbi8vICAgICAgc2VnbWVudCBvbmUgYXQgYSB0aW1lIGFuZCBrZWVwIHRoZSByZXN1bHQgaWYgaXQncyBzdGlsbCB1bmlxdWUuXG4vLyAgICAgIEluc3BpcmVkIGJ5IGFudG9ubWVkdi9maW5kZXIncyBvcHRpbWl6ZSBsb29wLiBEcm9wcyBlLmcuIGBib2R5ID4gbWFpbiA+XG4vLyAgICAgIHNlY3Rpb24ueCA+IGRpdi53cmFwID4gaDEuYnJhbmRgIHRvIGBtYWluID4gaDEuYnJhbmRgIHdoZW4gbWlkZGxlXG4vLyAgICAgIHNlZ21lbnRzIGRvbid0IGNvbnN0cmFpbiB1bmlxdWVuZXNzLlxuLy9cbi8vIEVtcGlyaWNhbGx5IChhdWRpdCBvbiB3cmFubmdsZS5jb20pIHRoaXMgZHJvcHMgdHlwaWNhbCBzZWxlY3RvciB0b2tlbnNcbi8vIGZyb20gfjcwIGNoYXJzIHRvIH4xNS0yNSBjaGFycyB3aXRob3V0IHNhY3JpZmljaW5nIHJlc29sdmFiaWxpdHkuXG5jb25zdCBwYXJ0c1RvU2VsZWN0b3IgPSAocGFydHM6IHN0cmluZ1tdLCBhbmNob3I6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgPT5cbiAgYW5jaG9yID8gYCR7YW5jaG9yfSAke3BhcnRzLmpvaW4oJyA+ICcpfWAgOiBwYXJ0cy5qb2luKCcgPiAnKTtcblxuY29uc3Qgb3B0aW1pemVQYXRoID0gKHBhcnRzOiBzdHJpbmdbXSwgYW5jaG9yOiBzdHJpbmcgfCBudWxsLCB0YXJnZXQ6IEVsZW1lbnQsIHNjb3BlOiBEb2N1bWVudCB8IFNoYWRvd1Jvb3QpOiBzdHJpbmdbXSA9PiB7XG4gIC8vIERvbid0IHRvdWNoIHRoZSBoZWFkICh0aGUgbGVhZiBlbGVtZW50IGRlc2NyaXB0b3IpIG9yLCBpZiB0aGVyZSdzIG5vXG4gIC8vIGFuY2hvciwgdGhlIHZlcnkgZmlyc3Qgc2VnbWVudCB0aGF0IGFuY2hvcnMgdGhlIHBhdGguIFRyeSByZW1vdmluZyBlYWNoXG4gIC8vIGludGVyaW9yIHNlZ21lbnQ7IGtlZXAgdGhlIHNob3J0ZXIgZm9ybSBpZiB0aGUgc2VsZWN0b3Igc3RpbGwgcmVzb2x2ZXNcbiAgLy8gdG8gYSB1bmlxdWUgdGFyZ2V0LlxuICBsZXQgYmVzdCA9IHBhcnRzO1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChpIDwgYmVzdC5sZW5ndGggLSAxKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gWy4uLmJlc3Quc2xpY2UoMCwgaSksIC4uLmJlc3Quc2xpY2UoaSArIDEpXTtcbiAgICBpZiAoY2FuZGlkYXRlLmxlbmd0aCA9PT0gMCkgeyBpKys7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGlzVW5pcXVlKHNjb3BlLCBwYXJ0c1RvU2VsZWN0b3IoY2FuZGlkYXRlLCBhbmNob3IpLCB0YXJnZXQpKSB7XG4gICAgICBiZXN0ID0gY2FuZGlkYXRlO1xuICAgICAgLy8gcmVzdGFydCBmcm9tIHN0YXJ0IG9mIHRyaW1tZWQgcGF0aFxuICAgICAgaSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3Q7XG59O1xuXG5leHBvcnQgY29uc3QgY3NzUGF0aCA9IChlbDogRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gIGlmIChpc1N0YWJsZUlkKGVsLmlkKSkgcmV0dXJuICcjJyArIGVzY2FwZUNzcyhlbC5pZCk7XG5cbiAgLy8gU2hhZG93LXJvb3RlZCBlbGVtZW50cyBhcmVuJ3QgcmVhY2hhYmxlIHZpYSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcmAsIHNvXG4gIC8vIHRoZSB1bmlxdWVuZXNzIGNoZWNrcyBtdXN0IHNjb3BlIHRvIHRoZSBvd25pbmcgcm9vdC4gT3RoZXJ3aXNlIGV2ZXJ5XG4gIC8vIHByb2JlIGZhbGxzIGJhY2sgdG8gYSBmdWxsIGRlc2NlbmRhbnQgcGF0aCB0aGF0IGNsaW1icyB0byBgYm9keWAg4oCUXG4gIC8vIHdoaWNoIGl0IGNhbiBuZXZlciByZWFjaCBiZWNhdXNlIG9mIHRoZSBzaGFkb3cgYm91bmRhcnkg4oCUIGFuZCB0aGVcbiAgLy8gc2VsZWN0b3IgZW5kcyB1cCBvdmVyLXNwZWNpZmllZCBvciBub25zZW5zZS5cbiAgY29uc3Qgcm9vdE5vZGUgPSBlbC5nZXRSb290Tm9kZSgpO1xuICBjb25zdCBjc3NTY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290ID0gcm9vdE5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdE5vZGUgOiBkb2N1bWVudDtcbiAgY29uc3Qgc2NvcGVCb3VuZGFyeTogTm9kZSA9IHJvb3ROb2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3ROb2RlIDogZG9jdW1lbnQuYm9keTtcblxuICAvLyBGaW5kIHRoZSBuZWFyZXN0IHN0YWJsZS1pZCBhbmNlc3RvciBhcyBhbiBhbmNob3IgY2FuZGlkYXRlLlxuICBsZXQgYW5jaG9ySWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgYW5jaG9yRWw6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICB3aGlsZSAoY3VyICYmIGN1ciAhPT0gc2NvcGVCb3VuZGFyeSkge1xuICAgIGlmIChpc1N0YWJsZUlkKGN1ci5pZCkpIHtcbiAgICAgIGFuY2hvcklkID0gJyMnICsgZXNjYXBlQ3NzKGN1ci5pZCk7XG4gICAgICBhbmNob3JFbCA9IGN1cjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgfVxuXG4gIGNvbnN0IG93biA9IG93bkRlc2NyaXB0b3IoZWwpO1xuXG4gIC8vIENhbmRpZGF0ZSAxOiBvd24gZGVzY3JpcHRvciBhbG9uZSwgaWYgaXQncyBwYWdlLXdpZGUgdW5pcXVlLlxuICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIG93biwgZWwpKSByZXR1cm4gb3duO1xuXG4gIC8vIENhbmRpZGF0ZSAyOiBhbmNob3IgKyBvd24gZGVzY3JpcHRvci5cbiAgaWYgKGFuY2hvcklkKSB7XG4gICAgY29uc3QgYzIgPSBgJHthbmNob3JJZH0gJHtvd259YDtcbiAgICBpZiAoaXNVbmlxdWUoYW5jaG9yRWwhLCBvd24sIGVsKSB8fCBpc1VuaXF1ZShjc3NTY29wZSwgYzIsIGVsKSkgcmV0dXJuIGMyO1xuICB9XG5cbiAgLy8gQ2FuZGlkYXRlIDIuNSDigJQgQVJJQS1hbmNob3JlZCBzZWxlY3RvcnMuIEJlZm9yZSBmYWxsaW5nIHRocm91Z2ggdG9cbiAgLy8gYnJpdHRsZSBgOm50aC1vZi10eXBlYCBjaGFpbnMgdGhlIHJvYXN0IGNhbGxlZCBvdXQgKMKnMi41KSwgdHJ5XG4gIC8vIGFuY2hvcmluZyBhdCBzZW1hbnRpY2FsbHktbmFtZWQgbWFya2VycyBhbiBMTE0gb3IgaHVtYW4gY2FuIHJlYWQ6XG4gIC8vXG4gIC8vICAg4oCiIHRoZSBlbGVtZW50J3Mgb3duIGFyaWEtbGFiZWwgLyByb2xlXG4gIC8vICAg4oCiIGEgbmVhcmJ5IGFuY2VzdG9yJ3MgYXJpYS1sYWJlbCAvIHJvbGVcbiAgLy9cbiAgLy8gU2VsZWN0b3JzIGxpa2UgYFthcmlhLWxhYmVsPVwiUGlwZWxpbmUgdHJlbmRcIl0gLnNwYXJrLXdyYXBgIGFyZVxuICAvLyBib3RoIHN0YWJsZS1hZ2FpbnN0LURPTS1zaHVmZmxlIEFORCBodW1hbi1yZWFkYWJsZSBpbiBhIHdheSB0aGF0XG4gIC8vIGBkaXYuc3RhdDpudGgtb2YtdHlwZSgxKSA+IGRpdi5zdGF0X19zcGFyazpudGgtb2YtdHlwZSg0KSA+IHNwYW5gIGlzXG4gIC8vIG5vdC4gQ2FwIHRoZSBjaGFpbiBkZXB0aCBzbyB3ZSBkb24ndCB3YWxrIHBhc3QgYSBtZWFuaW5nZnVsIGJvdW5kYXJ5LlxuICBjb25zdCBhcmlhUXVvdGVkID0gKHZhbDogc3RyaW5nKTogc3RyaW5nID0+ICdcIicgKyB2YWwucmVwbGFjZSgvW1xcXFxcIl0vZywgJ1xcXFwkJicpICsgJ1wiJztcbiAgY29uc3QgYXJpYVNlbGVjdG9yID0gKGU6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBjb25zdCBsYWJlbCA9IGUuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgaWYgKGxhYmVsICYmIGxhYmVsLmxlbmd0aCA+IDAgJiYgbGFiZWwubGVuZ3RoIDwgODApIHtcbiAgICAgIHJldHVybiBgW2FyaWEtbGFiZWw9JHthcmlhUXVvdGVkKGxhYmVsKX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIC8vIFRyeSBhbiBBUklBLWFuY2hvcmVkIHNlbGVjdG9yIGZvciBUSElTIGVsZW1lbnQgZmlyc3QuXG4gIGNvbnN0IG93bkFyaWEgPSBhcmlhU2VsZWN0b3IoZWwpO1xuICBpZiAob3duQXJpYSAmJiBpc1VuaXF1ZShjc3NTY29wZSwgb3duQXJpYSwgZWwpKSByZXR1cm4gb3duQXJpYTtcbiAgLy8gV2FsayB1cCB0byA0IGFuY2VzdG9ycyBhbmQgdHJ5IGBbYXJpYS1sYWJlbD1cIuKAplwiXSB0YWcuY2xzYC4gU3RvcCBhdCB0aGVcbiAgLy8gYW5jaG9yRWwgaWYgd2UgZm91bmQgb25lIOKAlCBhbnl0aGluZyBhYm92ZSBpcyBhbHJlYWR5IGNvdmVyZWQuXG4gIGxldCBhcmlhQ3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gIGxldCBkZXB0aCA9IDA7XG4gIHdoaWxlIChhcmlhQ3VyICYmIGRlcHRoIDwgNCAmJiBhcmlhQ3VyICE9PSBzY29wZUJvdW5kYXJ5ICYmIGFyaWFDdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgYSA9IGFyaWFTZWxlY3RvcihhcmlhQ3VyKTtcbiAgICBpZiAoYSkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YX0gJHtvd259YDtcbiAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwgY2FuZGlkYXRlLCBlbCkpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfVxuICAgIGFyaWFDdXIgPSBhcmlhQ3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgZGVwdGgrKztcbiAgfVxuXG4gIC8vIENhbmRpZGF0ZSAyLjYg4oCUIHJvbGUgKyBuYW1lIGFuY2hvci4gQVJJQS1vbmx5IGxhYmVscyBjYXVnaHQgYWJvdmU7IHRoaXNcbiAgLy8gdGllciBoYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZSBhbmNlc3RvciBoYXMgQk9USCBhIGByb2xlYCBhbmQgYW5cbiAgLy8gYGFyaWEtbGFiZWxgIChvciBgZGF0YS10ZXN0aWRgKS4gU2VsZWN0b3IgaXMgbW9yZSBzcGVjaWZpYyBhbmRcbiAgLy8gZG9lc24ndCByaXNrIGNvbGxpZGluZyB3aGVuIHR3byBsYWJlbHMgaGFwcGVuIHRvIG1hdGNoIGFjcm9zcyByb2xlcy5cbiAgY29uc3Qgcm9sZU5hbWVTZWxlY3RvciA9IChlOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgcm9sZSA9IGUuZ2V0QXR0cmlidXRlKCdyb2xlJyk7XG4gICAgY29uc3QgbGFiZWwgPSBlLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgIGlmIChyb2xlICYmIGxhYmVsICYmIGxhYmVsLmxlbmd0aCA8IDgwKSB7XG4gICAgICByZXR1cm4gYFtyb2xlPSR7YXJpYVF1b3RlZChyb2xlKX1dW2FyaWEtbGFiZWw9JHthcmlhUXVvdGVkKGxhYmVsKX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGxldCBybkN1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBkZXB0aCA9IDA7XG4gIHdoaWxlIChybkN1ciAmJiBkZXB0aCA8IDQgJiYgcm5DdXIgIT09IHNjb3BlQm91bmRhcnkgJiYgcm5DdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgYSA9IHJvbGVOYW1lU2VsZWN0b3Iocm5DdXIpO1xuICAgIGlmIChhKSB7XG4gICAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHthfSAke293bn1gO1xuICAgICAgaWYgKGlzVW5pcXVlKGNzc1Njb3BlLCBjYW5kaWRhdGUsIGVsKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICB9XG4gICAgcm5DdXIgPSBybkN1ci5wYXJlbnRFbGVtZW50O1xuICAgIGRlcHRoKys7XG4gIH1cblxuICAvLyBDYW5kaWRhdGUgMi43IOKAlCB1bmlxdWUtY2xhc3MtYW5jZXN0b3IgYW5jaG9yICjCpzIuNSBzZWxlY3RvciBsYWRkZXIpLlxuICAvLyBXYWxrIGFuY2VzdG9ycyBsb29raW5nIGZvciBvbmUgd2hvc2UgY2xhc3MgY2hhaW4gKHZpYSBzdGFibGVDbGFzc2VzKVxuICAvLyBpcyB1bmlxdWUgb24gdGhlIHBhZ2U7IHVzZSBpdCBhcyBgLnVuaXF1ZS1jbGFzcyBvd25gLiBGaXhlcyB0aGUgY2FzZVxuICAvLyB3aGVyZSB0aGUgZWxlbWVudHMgYmV0d2VlbiB0aGUgY2FwdHVyZWQgbm9kZSBhbmQgdGhlIGRvY3VtZW50IGhhdmVcbiAgLy8gbm8gYXJpYS90ZXN0aWQvaWQsIGJ1dCBPTkUgb2YgdGhlbSBjYXJyaWVzIGEgbWVhbmluZ2Z1bCBzZW1hbnRpY1xuICAvLyBjbGFzcyAoYC5hdHRlbnRpb24tYmFubmVyYCwgYC5taXNzaW9uLXN0YXRzYCkuXG4gIGxldCB1Y0N1cjogRWxlbWVudCB8IG51bGwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBkZXB0aCA9IDA7XG4gIHdoaWxlICh1Y0N1ciAmJiBkZXB0aCA8IDYgJiYgdWNDdXIgIT09IHNjb3BlQm91bmRhcnkgJiYgdWNDdXIgIT09IGFuY2hvckVsKSB7XG4gICAgY29uc3QgY2xzID0gc3RhYmxlQ2xhc3Nlcyh1Y0N1cik7XG4gICAgaWYgKGNscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGFuY0Rlc2NyaXB0b3IgPSBgJHt1Y0N1ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpfS4ke2Nscy5tYXAoZXNjYXBlQ3NzKS5qb2luKCcuJyl9YDtcbiAgICAgIC8vIGAuY2xzYCAod2l0aG91dCB0aGUgdGFnIHByZWZpeCkgaXMgc2hvcnRlciBhbmQgcmVhZHMgYmV0dGVyIHdoZW5cbiAgICAgIC8vIHRoZSBhbmNlc3RvcidzIGNsYXNzIGlzIHBhZ2UtdW5pcXVlIG9uIGl0cyBvd24uXG4gICAgICBjb25zdCBqdXN0Q2xzID0gJy4nICsgY2xzLm1hcChlc2NhcGVDc3MpLmpvaW4oJy4nKTtcbiAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwganVzdENscywgdWNDdXIpKSB7XG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2p1c3RDbHN9ICR7b3dufWA7XG4gICAgICAgIGlmIChpc1VuaXF1ZShjc3NTY29wZSwgY2FuZGlkYXRlLCBlbCkpIHJldHVybiBjYW5kaWRhdGU7XG4gICAgICB9XG4gICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGFuY0Rlc2NyaXB0b3IsIHVjQ3VyKSkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHthbmNEZXNjcmlwdG9yfSAke293bn1gO1xuICAgICAgICBpZiAoaXNVbmlxdWUoY3NzU2NvcGUsIGNhbmRpZGF0ZSwgZWwpKSByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgfVxuICAgIH1cbiAgICB1Y0N1ciA9IHVjQ3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgZGVwdGgrKztcbiAgfVxuXG4gIC8vIENhbmRpZGF0ZSAzOiBmdWxsIGRlc2NlbmRhbnQgcGF0aCwgdGhlbiBvcHRpbWl6ZS5cbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGN1ciA9IGVsO1xuICB3aGlsZSAoY3VyICYmIGN1ci5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY3VyICE9PSBzY29wZUJvdW5kYXJ5KSB7XG4gICAgaWYgKGN1ciAhPT0gZWwgJiYgaXNTdGFibGVJZChjdXIuaWQpKSBicmVhaztcbiAgICBsZXQgcyA9IGN1ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGNscyA9IHN0YWJsZUNsYXNzZXMoY3VyKTtcbiAgICBpZiAoY2xzLmxlbmd0aCkgcyArPSAnLicgKyBjbHMubWFwKGVzY2FwZUNzcykuam9pbignLicpO1xuICAgIGNvbnN0IHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBjb25zdCBzYW1lVGFnID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoc2liKSA9PiBzaWIubm9kZU5hbWUgPT09IGN1ciEubm9kZU5hbWUpO1xuICAgICAgaWYgKHNhbWVUYWcubGVuZ3RoID4gMSkgcyArPSBgOm50aC1vZi10eXBlKCR7c2FtZVRhZy5pbmRleE9mKGN1cikgKyAxfSlgO1xuICAgIH1cbiAgICBwYXJ0cy51bnNoaWZ0KHMpO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIGlmICghcGFydHMubGVuZ3RoKSByZXR1cm4gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZVBhdGgocGFydHMsIGFuY2hvcklkLCBlbCwgY3NzU2NvcGUpO1xuICByZXR1cm4gcGFydHNUb1NlbGVjdG9yKG9wdGltaXplZCwgYW5jaG9ySWQpO1xufTtcblxuLy8gLS0tLSBOYW1pbmcsIHJvbGVzLCBhbmNlc3RvcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJvbGVzIHdob3NlIGFjY2Vzc2libGVOYW1lIGlzLCBwZXIgdGhlIEFjY05hbWUgYWxnb3JpdGhtLCB0aGUgcmVjdXJzaXZlXG4vLyBjb25jYXRlbmF0aW9uIG9mIGV2ZXJ5IGRlc2NlbmRhbnQncyBhY2Nlc3NpYmxlIHRleHQuIEZvciB0aGVzZSB0aGUgZmllbGRcbi8vIGJlY29tZXMgYSB1c2VsZXNzIDIwMC1jaGFyIGR1bXAgb2YgdGhlIHdob2xlIHN1YnRyZWUgKG9mdGVuIHRydW5jYXRlZFxuLy8gbWlkLXdvcmQpLiBXZSBPTkxZIHN1cmZhY2UgYW4gZXhwbGljaXQgYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZvclxuLy8gY29udGFpbmVyIHJvbGVzIOKAlCBvdGhlcndpc2UgbGVhdmUgaXQgZW1wdHkgYW5kIGxldCB0aGUgTExNIHJlYWQgdGhlXG4vLyBjaGlsZHJlbiBzZXBhcmF0ZWx5LlxuY29uc3QgQ09OVEFJTkVSX1JPTEVTID0gbmV3IFNldChbXG4gICdncm91cCcsICdyZWdpb24nLCAnbGlzdCcsICdsaXN0Ym94JywgJ2dyaWQnLCAnZ3JpZGNlbGwnLCAncm93Z3JvdXAnLFxuICAncm93JywgJ3RhYmxlJywgJ21haW4nLCAnbmF2aWdhdGlvbicsICdiYW5uZXInLCAnY29udGVudGluZm8nLFxuICAnY29tcGxlbWVudGFyeScsICd0YWJwYW5lbCcsICdhcnRpY2xlJywgJ3NlY3Rpb24nLCAnZG9jdW1lbnQnLFxuICAnZmVlZCcsICdmaWd1cmUnLCAnZm9ybScsXG5dKTtcblxuLy8gUmVzb2x2ZSB0ZXh0IHRoZSBhY2NuYW1lIGFsZ29yaXRobSBwdWxscyBmcm9tIHJlZmVyZW5jZWQgZWxlbWVudHMuIFVzZWRcbi8vIGZvciBib3RoIGBhcmlhLWxhYmVsbGVkYnlgIChwcmlvcml0eSkgYW5kIGA8bGFiZWwgZm9yPVwiaWRcIj5gIGFzc29jaWF0aW9uXG4vLyAoZm9ybS1jb250cm9sIGZhbGxiYWNrKS4gSWRzIGluIGlkcmVmcyBhcmUgc3BhY2Utc2VwYXJhdGVkOyBlYWNoIHJlZidzXG4vLyByZXNvbHZlZCB0ZXh0IGlzIGpvaW5lZCBieSBhIHNpbmdsZSBzcGFjZS5cbmNvbnN0IGNvbGxlY3RJZFJlZlRleHQgPSAocmVmczogc3RyaW5nLCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290KTogc3RyaW5nID0+IHtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaWQgb2YgcmVmcy5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBub2RlID0gc2NvcGUuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKG5vZGUpIHBhcnRzLnB1c2godHJpbVRleHQobm9kZS50ZXh0Q29udGVudCwgMTgwKSk7XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIH1cbiAgcmV0dXJuIHBhcnRzLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XG59O1xuXG5jb25zdCBhY2Nlc3NpYmxlTmFtZSA9IChlbDogRWxlbWVudCwgcm9sZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyA9PiB7XG4gIC8vIFByaW9yaXR5IGZvbGxvd3MgdGhlIGFjY25hbWUgYWxnb3JpdGhtIChzaW1wbGlmaWVkKTpcbiAgLy8gICAxLiBhcmlhLWxhYmVsbGVkYnkg4oCUIHJlc29sdmVkIHRleHQgb2YgZXZlcnkgcmVmZXJlbmNlZCBpZC5cbiAgLy8gICAyLiBhcmlhLWxhYmVsIOKAlCBkaXJlY3Qgc3RyaW5nLlxuICAvLyAgIDMuIEZvciBmb3JtIGNvbnRyb2xzOiBhc3NvY2lhdGVkIDxsYWJlbD4gKGVpdGhlciBgPGxhYmVsIGZvcj1JRD5gXG4gIC8vICAgICAgT1IgYW4gYW5jZXN0b3IgPGxhYmVsPiB0aGF0IHdyYXBzIHRoZSBjb250cm9sKS4gRXZlcnlcbiAgLy8gICAgICBmcmFtZXdvcmsgd2VhdGhlciBhcHAgcGFpcnMgdGhlIHNlYXJjaCBpbnB1dCB3aXRoIGFcbiAgLy8gICAgICB2aXN1YWxseS1oaWRkZW4gbGFiZWw7IHdpdGhvdXQgZm9sbG93aW5nIHRoZSBsaW5rIFBpbmNoR3JhYlxuICAvLyAgICAgIHJldHVybnMgYW4gZW1wdHkgYWNjZXNzaWJsZU5hbWUuXG4gIC8vICAgNC4gdGl0bGUgLyBhbHQgLyBwbGFjZWhvbGRlciAob25seSB3aGVuIG5vbmUgb2YgdGhlIGFib3ZlIGhpdCkuXG4gIC8vICAgNS4gdGV4dENvbnRlbnQgKHN1cHByZXNzZWQgZm9yIGNvbnRhaW5lciByb2xlcyB3aG9zZSBhY2NuYW1lXG4gIC8vICAgICAgd291bGQgb3RoZXJ3aXNlIGJlIGEgMjAwLWNoYXIgc3VidHJlZSBkdW1wKS5cbiAgY29uc3QgbGFiZWxsZWRieSA9IGF0dHIoZWwsICdhcmlhLWxhYmVsbGVkYnknKTtcbiAgaWYgKGxhYmVsbGVkYnkpIHtcbiAgICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgICBjb25zdCBzY29wZTogRG9jdW1lbnQgfCBTaGFkb3dSb290ID0gcm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgPyByb290IDogZG9jdW1lbnQ7XG4gICAgY29uc3QgdGV4dCA9IGNvbGxlY3RJZFJlZlRleHQobGFiZWxsZWRieSwgc2NvcGUpO1xuICAgIGlmICh0ZXh0KSByZXR1cm4gdHJpbVRleHQodGV4dCwgMTgwKTtcbiAgfVxuICBjb25zdCBhcmlhTGFiZWwgPSBhdHRyKGVsLCAnYXJpYS1sYWJlbCcpO1xuICBpZiAoYXJpYUxhYmVsKSByZXR1cm4gdHJpbVRleHQoYXJpYUxhYmVsLCAxODApO1xuXG4gIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaXNGb3JtQ29udHJvbCA9IHRhZyA9PT0gJ2lucHV0JyB8fCB0YWcgPT09ICdzZWxlY3QnIHx8IHRhZyA9PT0gJ3RleHRhcmVhJyB8fCB0YWcgPT09ICdidXR0b24nIHx8IHRhZyA9PT0gJ21ldGVyJyB8fCB0YWcgPT09ICdwcm9ncmVzcycgfHwgdGFnID09PSAnb3V0cHV0JztcbiAgaWYgKGlzRm9ybUNvbnRyb2wpIHtcbiAgICBpZiAoZWwuaWQpIHtcbiAgICAgIGNvbnN0IHJvb3QgPSBlbC5nZXRSb290Tm9kZSgpO1xuICAgICAgY29uc3Qgc2NvcGU6IERvY3VtZW50IHwgU2hhZG93Um9vdCA9IHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdCA6IGRvY3VtZW50O1xuICAgICAgbGV0IGxhYmVsRm9yOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgICB0cnkgeyBsYWJlbEZvciA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj1cIiR7ZXNjYXBlQ3NzKGVsLmlkKX1cIl1gKTsgfSBjYXRjaCB7IC8qIGludmFsaWQgaWQgKi8gfVxuICAgICAgaWYgKGxhYmVsRm9yKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0cmltVGV4dChsYWJlbEZvci50ZXh0Q29udGVudCwgMTgwKTtcbiAgICAgICAgaWYgKHRleHQpIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgbGFiZWxQYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZSAobGFiZWxQYXJlbnQpIHtcbiAgICAgIGlmIChsYWJlbFBhcmVudC50YWdOYW1lID09PSAnTEFCRUwnKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0cmltVGV4dChsYWJlbFBhcmVudC50ZXh0Q29udGVudCwgMTgwKTtcbiAgICAgICAgaWYgKHRleHQpIHJldHVybiB0ZXh0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxhYmVsUGFyZW50ID0gbGFiZWxQYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gIH1cblxuICBjb25zdCB0aXRsZUF0dHIgPSBhdHRyKGVsLCAndGl0bGUnKTtcbiAgaWYgKHRpdGxlQXR0cikgcmV0dXJuIHRyaW1UZXh0KHRpdGxlQXR0ciwgMTgwKTtcbiAgY29uc3QgYWx0QXR0ciA9IGF0dHIoZWwsICdhbHQnKTtcbiAgaWYgKGFsdEF0dHIpIHJldHVybiB0cmltVGV4dChhbHRBdHRyLCAxODApO1xuICBjb25zdCBwbGFjZWhvbGRlckF0dHIgPSBhdHRyKGVsLCAncGxhY2Vob2xkZXInKTtcbiAgaWYgKHBsYWNlaG9sZGVyQXR0cikgcmV0dXJuIHRyaW1UZXh0KHBsYWNlaG9sZGVyQXR0ciwgMTgwKTtcbiAgaWYgKHJvbGUgJiYgQ09OVEFJTkVSX1JPTEVTLmhhcyhyb2xlKSkgcmV0dXJuICcnO1xuXG4gIGlmICghaXNOYW1lRnJvbUNvbnRlbnQoZWwsIHRhZywgcm9sZSkpIHJldHVybiAnJztcbiAgcmV0dXJuIHRyaW1UZXh0KGVsLnRleHRDb250ZW50LCAxODApO1xufTtcblxuLy8gVGFncyB3aG9zZSBpbXBsaWNpdCByb2xlIGhhcyBcIk5hbWUgZnJvbTogY29udGVudHNcIiBpbiB0aGUgQVJJQSBzcGVjLlxuLy8gVGhlc2UgYXJlIGxlYWYtaXNoIG9yIG5hdHVyYWxseS1sYWJlbGVkLWJ5LWNoaWxkcmVuIGVsZW1lbnRzOyBjYXB0dXJpbmdcbi8vIG9uZSBtZWFucyB0aGUgdXNlciB3YW50cyB0aGUgcmVuZGVyZWQgdGV4dCBhcyB0aGUgbmFtZS5cbmNvbnN0IE5BTUVfRlJPTV9DT05URU5UX1RBR1MgPSBuZXcgU2V0KFtcbiAgJ2EnLCAnYnV0dG9uJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JyxcbiAgJ3N1bW1hcnknLCAndGgnLCAndGQnLCAnY2FwdGlvbicsICdmaWdjYXB0aW9uJywgJ2xlZ2VuZCcsICdsYWJlbCcsXG4gICdvcHRpb24nLCAnb3V0cHV0JywgJ2R0Jyxcbl0pO1xuLy8gRXhwbGljaXQgQVJJQSByb2xlcyBpbiBcIk5hbWUgZnJvbTogY29udGVudHNcIi5cbmNvbnN0IE5BTUVfRlJPTV9DT05URU5UX1JPTEVTID0gbmV3IFNldChbXG4gICdidXR0b24nLCAnY2VsbCcsICdjaGVja2JveCcsICdjb2x1bW5oZWFkZXInLCAnZ3JpZGNlbGwnLCAnaGVhZGluZycsXG4gICdsaW5rJywgJ21lbnVpdGVtJywgJ21lbnVpdGVtY2hlY2tib3gnLCAnbWVudWl0ZW1yYWRpbycsICdvcHRpb24nLFxuICAncmFkaW8nLCAncm93JywgJ3Jvd2hlYWRlcicsICdzd2l0Y2gnLCAndGFiJywgJ3Rvb2x0aXAnLCAndHJlZWl0ZW0nLFxuXSk7XG5jb25zdCBpc05hbWVGcm9tQ29udGVudCA9IChlbDogRWxlbWVudCwgdGFnOiBzdHJpbmcsIHJvbGU6IHN0cmluZyB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgaWYgKHJvbGUgJiYgTkFNRV9GUk9NX0NPTlRFTlRfUk9MRVMuaGFzKHJvbGUpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKE5BTUVfRlJPTV9DT05URU5UX1RBR1MuaGFzKHRhZykpIHJldHVybiB0cnVlO1xuICAvLyBJbmxpbmUgLyBwaHJhc2luZyB0YWdzIGFsc28gbGVnaXRpbWF0ZWx5IGdldCB0ZXh0Q29udGVudCBhcyB0aGVpclxuICAvLyBcIm5hbWVcIiDigJQgY2FwdHVyaW5nIGEgPHNwYW4+Q2xpY2s8L3NwYW4+IHNob3VsZCBzaG93IFwiQ2xpY2tcIiwgbm90IFwiXCIuXG4gIC8vIFdlIG9ubHkgYWxsb3cgdGhpcyB3aGVuIHRoZSBlbGVtZW50IGhhcyBPTkxZIHRleHQtbm9kZSBjaGlsZHJlbiAobm9cbiAgLy8gc3RydWN0dXJhbCBjaGlsZHJlbiksIHNvIGEgPHNwYW4+IHdyYXBwaW5nIHNldmVuIGNhcmRzIHN0aWxsIHJldHVybnNcbiAgLy8gZW1wdHkuXG4gIGNvbnN0IElOTElORV9QSFJBU0lORyA9IG5ldyBTZXQoWydzcGFuJywgJ2VtJywgJ3N0cm9uZycsICdiJywgJ2knLCAnbWFyaycsICdzbWFsbCcsICdjb2RlJywgJ2tiZCcsICdzYW1wJywgJ3ZhcicsICd0aW1lJywgJ2NpdGUnLCAncScsICdhYmJyJywgJ3N1YicsICdzdXAnXSk7XG4gIGlmIChJTkxJTkVfUEhSQVNJTkcuaGFzKHRhZykgJiYgIWVsLmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGltcGxpY2l0Um9sZSA9IChlbDogRWxlbWVudCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkgcmV0dXJuICdidXR0b24nO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSByZXR1cm4gJ3RleHRib3gnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSByZXR1cm4gJ3RleHRib3gnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkgcmV0dXJuICdsaXN0Ym94JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZWwuaHJlZikgcmV0dXJuICdsaW5rJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTExJRWxlbWVudCkgcmV0dXJuICdsaXN0aXRlbSc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxVTGlzdEVsZW1lbnQgfHwgZWwgaW5zdGFuY2VvZiBIVE1MT0xpc3RFbGVtZW50KSByZXR1cm4gJ2xpc3QnO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVGFibGVFbGVtZW50KSByZXR1cm4gJ3RhYmxlJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTFRhYmxlQ2VsbEVsZW1lbnQpIHJldHVybiAnY2VsbCc7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxUYWJsZVJvd0VsZW1lbnQpIHJldHVybiAncm93JztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSByZXR1cm4gJ2Zvcm0nO1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MUHJvZ3Jlc3NFbGVtZW50KSByZXR1cm4gJ3Byb2dyZXNzYmFyJztcbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTE1ldGVyRWxlbWVudCkgcmV0dXJuICdtZXRlcic7XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgU0VNQU5USUNfVEFHUyA9IG5ldyBTZXQoWydtYWluJywgJ3NlY3Rpb24nLCAnYXJ0aWNsZScsICduYXYnLCAnaGVhZGVyJywgJ2Zvb3RlcicsICdhc2lkZScsICdmb3JtJywgJ3RhYmxlJywgJ3VsJywgJ29sJ10pO1xuXG5jb25zdCBjb21wb25lbnRSb290ID0gKGVsOiBFbGVtZW50KToge2NvbXBhY3Q6IHN0cmluZ30gfCBudWxsID0+IHtcbiAgbGV0IGN1cnJlbnQ6IEVsZW1lbnQgfCBudWxsID0gZWwucGFyZW50RWxlbWVudDtcbiAgbGV0IGRlcHRoID0gMDtcbiAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY3VycmVudCAhPT0gZG9jdW1lbnQuYm9keSAmJiBkZXB0aCA8IDEyKSB7XG4gICAgY29uc3QgbWFya2VyID1cbiAgICAgIGN1cnJlbnQuaWQgfHxcbiAgICAgIGN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbXBvbmVudCcpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10ZXN0aWQnKSB8fFxuICAgICAgY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdCcpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jeScpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1xYScpIHx8XG4gICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZSgncm9sZScpIHx8XG4gICAgICBTRU1BTlRJQ19UQUdTLmhhcyhjdXJyZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgIGlmIChtYXJrZXIpIHJldHVybiB7Y29tcGFjdDogY29tcGFjdFRhcmdldChjdXJyZW50KX07XG4gICAgaWYgKGN1cnJlbnQucGFyZW50RWxlbWVudCA9PT0gbnVsbCAmJiBjdXJyZW50LnBhcmVudE5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnROb2RlLmhvc3QgfHwgbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgZGVwdGgrKztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGFuY2VzdG9yQ2hhaW4gPSAoZWw6IEVsZW1lbnQsIGRlcHRoID0gNCk6IEFuY2VzdG9yW10gPT4ge1xuICBjb25zdCBvdXQ6IEFuY2VzdG9yW10gPSBbXTtcbiAgbGV0IGN1cnJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IGRvY3VtZW50LmJvZHkgJiYgaSA8IGRlcHRoKSB7XG4gICAgY29uc3QgaXRlbTogQW5jZXN0b3IgPSB7dGFnOiBjdXJyZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX07XG4gICAgaWYgKGlzU3RhYmxlSWQoY3VycmVudC5pZCkpIGl0ZW0uaWQgPSBjdXJyZW50LmlkO1xuICAgIGNvbnN0IHJvbGUgPSBhdHRyKGN1cnJlbnQsICdyb2xlJyk7XG4gICAgaWYgKHJvbGUpIGl0ZW0ucm9sZSA9IHJvbGU7XG4gICAgY29uc3QgdGlkID0gYXR0cihjdXJyZW50LCAnZGF0YS10ZXN0aWQnKSB8fCBhdHRyKGN1cnJlbnQsICdkYXRhLXRlc3QnKSB8fFxuICAgICAgYXR0cihjdXJyZW50LCAnZGF0YS1jeScpIHx8IGF0dHIoY3VycmVudCwgJ2RhdGEtcWEnKTtcbiAgICBpZiAodGlkKSBpdGVtLnRlc3RJZCA9IHRpZDtcbiAgICBjb25zdCBjbHMgPSBjdXJyZW50LmNsYXNzTGlzdCA/IEFycmF5LmZyb20oY3VycmVudC5jbGFzc0xpc3QpLnNsaWNlKDAsIDMpIDogW107XG4gICAgaWYgKGNscy5sZW5ndGgpIGl0ZW0uY2xhc3NlcyA9IGNscztcbiAgICBvdXQucHVzaChpdGVtKTtcbiAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnRFbGVtZW50O1xuICAgIGkrKztcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gLS0tLSBBdHRycyAvIHN0eWxlcyAvIG1hdGNoZWQgcnVsZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBBVFRSX0FMTE9XTElTVCA9IG5ldyBTZXQoW1xuICAnaHJlZicsICdzcmMnLCAnYWx0JywgJ3RpdGxlJywgJ3BsYWNlaG9sZGVyJywgJ25hbWUnLCAndHlwZScsICd2YWx1ZScsICd0YXJnZXQnLCAnZm9yJyxcbiAgJ2FyaWEtbGFiZWwnLCAnYXJpYS1sYWJlbGxlZGJ5JywgJ2FyaWEtZGVzY3JpYmVkYnknLCAnYXJpYS1jb250cm9scycsICdhcmlhLWV4cGFuZGVkJyxcbiAgJ2FyaWEtY2hlY2tlZCcsICdhcmlhLXNlbGVjdGVkJywgJ2FyaWEtaGFzcG9wdXAnLCAnYXJpYS1saXZlJywgJ2FyaWEtaGlkZGVuJywgJ3JvbGUnLFxuXSk7XG5jb25zdCBBVFRSX1BSRUZJWF9BTExPVyA9IFsnYXJpYS0nLCAnZGF0YS0nXTtcbmNvbnN0IEFUVFJfQkxPQ0tMSVNUID0gbmV3IFNldChbJ2NsYXNzJywgJ3N0eWxlJywgJ2lkJ10pO1xuXG4vLyBQZXItaW5wdXQtdHlwZSBmb3JtYXQgaGludHMgc28gYW4gTExNIGNvbnN1bWluZyB0aGUgZXhwb3J0IGRvZXNuJ3QgaGF2ZVxuLy8gdG8gaW5mZXIgdGhlIGV4cGVjdGVkIHNoYXBlLiBEaXJlY3QgcG9ydCBmcm9tIGJyb3dzZXItdXNlJ3Mgc2VyaWFsaXplci5cbmNvbnN0IElOUFVUX0ZPUk1BVF9ISU5UUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgZGF0ZTogJ1lZWVktTU0tREQnLFxuICAnZGF0ZXRpbWUtbG9jYWwnOiAnWVlZWS1NTS1ERFRISDptbScsXG4gIG1vbnRoOiAnWVlZWS1NTScsXG4gIHRpbWU6ICdISDptbScsXG4gIHdlZWs6ICdZWVlZLVd3dycsXG4gIG51bWJlcjogJ251bWVyaWMnLFxuICByYW5nZTogJ251bWVyaWMnLFxuICB0ZWw6ICdwaG9uZScsXG4gIGVtYWlsOiAnZW1haWwnLFxuICB1cmw6ICd1cmwnLFxuICBjb2xvcjogJyNycmdnYmInLFxufTtcblxuLy8gQXR0cnMgdGhhdCBhcmUgYWx3YXlzIHByb21vdGVkIHRvIHRvcC1sZXZlbCBlbnRyeSBmaWVsZHMgKGB0ZXN0SWRgLFxuLy8gYGFjY2Vzc2libGVOYW1lYCwgYHJvbGVgKS4gS2VlcGluZyB0aGVtIEFMU08gaW4gYGF0dHJzYCB3YXMgZHVwbGljYXRlXG4vLyBwYXlsb2FkIOKAlCBkcm9wIHRoZW0gaGVyZSBzbyB0aGUgY29uc3VtZXIgc2VlcyBvbmUgY2Fub25pY2FsIHNvdXJjZS5cbi8vIGBkYXRhLXRlc3RpZGAsIGBkYXRhLXRlc3RgLCBgZGF0YS1jeWAsIGBkYXRhLXFhYCBhbGwgZ2V0IHByb21vdGVkLlxuY29uc3QgQVRUUl9ERURVUF9BR0FJTlNUX1RPUF9MRVZFTCA9IG5ldyBTZXQoW1xuICAnZGF0YS10ZXN0aWQnLCAnZGF0YS10ZXN0JywgJ2RhdGEtY3knLCAnZGF0YS1xYScsXG4gICdhcmlhLWxhYmVsJywgJ3JvbGUnLCAndGl0bGUnLCAnYWx0Jyxcbl0pO1xuXG4vLyBSZWdleCBkZW55bGlzdHMgZm9yIGxpa2VseS1zZWNyZXQtYmVhcmluZyBzdHJpbmdzLiBNYXRjaCBhZ2FpbnN0IGF0dHJpYnV0ZVxuLy8gVkFMVUVTIOKAlCBpZiBhIHZhbHVlIGxvb2tzIGxpa2UgYSBKV1QsIGFuIE9BdXRoIGJlYXJlciwgb3IgYSBsb25nIHRva2VuXG4vLyBzYW5kd2ljaGVkIGluIGEgbm9uLWFsbG93bGlzdGVkIHNwb3QsIHdlIHJlZGFjdCByYXRoZXIgdGhhbiBzaGlwLlxuY29uc3QgSldUX1JFID0gL1xcYmV5SltBLVphLXowLTlfLV17MjAsfVxcLltBLVphLXowLTlfLV17MjAsfVxcLltBLVphLXowLTlfLV17MjAsfVxcYi9nO1xuLy8gQ29uc2VydmF0aXZlIGJlYXJlci10b2tlbiByZWdleDogMjQrIGNoYXJzIG9mIGJhc2U2NHVybC1pc2ggY29udGVudFxuLy8gd2hlcmUgdGhlIGF0dHJpYnV0ZSBuYW1lIHN0cm9uZ2x5IGltcGxpZXMgYSBzZWNyZXQuIEFwcGxpZWQgcGVyLWF0dHIuXG5jb25zdCBTRUNSRVRfQVRUUl9OQU1FX1JFID0gLyh0b2tlbnxzZWNyZXR8cGFzc3dvcmR8YXBpW18tXT9rZXl8YXV0aChvcml6YXRpb24pP3xjc3JmfHhzcmZ8c2Vzc2lvbikvaTtcbmNvbnN0IHJlZGFjdFNlY3JldHMgPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKFNFQ1JFVF9BVFRSX05BTUVfUkUudGVzdChuYW1lKSAmJiB2YWx1ZS5sZW5ndGggPiA4KSByZXR1cm4gJ1tyZWRhY3RlZDogbG9va3MtbGlrZS1zZWNyZXRdJztcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoSldUX1JFLCAnW3JlZGFjdGVkOiBqd3RdJyk7XG59O1xuXG5jb25zdCBwb3B1bGF0ZWRBdHRycyA9IChlbDogRWxlbWVudCk6IHthdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgaGludHM6IGltcG9ydCgnLi90eXBlcy50cycpLkVudHJ5SGludHMgfCB1bmRlZmluZWR9ID0+IHtcbiAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKCFlbC5hdHRyaWJ1dGVzKSByZXR1cm4ge2F0dHJzLCBoaW50czogdW5kZWZpbmVkfTtcbiAgbGV0IHZhbHVlTWFza2VkID0gZmFsc2U7XG4gIGZvciAoY29uc3QgYSBvZiBBcnJheS5mcm9tKGVsLmF0dHJpYnV0ZXMpKSB7XG4gICAgY29uc3QgbmFtZSA9IGEubmFtZTtcbiAgICBpZiAoIW5hbWUgfHwgQVRUUl9CTE9DS0xJU1QuaGFzKG5hbWUpKSBjb250aW51ZTtcbiAgICBpZiAoQVRUUl9ERURVUF9BR0FJTlNUX1RPUF9MRVZFTC5oYXMobmFtZSkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGFsbG93ZWQgPSBBVFRSX0FMTE9XTElTVC5oYXMobmFtZSkgfHwgQVRUUl9QUkVGSVhfQUxMT1cuc29tZSgocCkgPT4gbmFtZS5zdGFydHNXaXRoKHApKTtcbiAgICBpZiAoIWFsbG93ZWQpIGNvbnRpbnVlO1xuICAgIGxldCB2ID0gdHJpbVRleHQoYS52YWx1ZSwgTUFYX0FUVFIpO1xuICAgIC8vIFNlbnNpdGl2ZS1pbnB1dCByZWRhY3Rpb24uIEJleW9uZCBgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiPmAsIGFsc29cbiAgICAvLyBzdHJpcCB2YWx1ZXMgZm9yOiBoaWRkZW4gaW5wdXRzIChvZnRlbiBjYXJyeSBDU1JGL0pXVCBib290c3RyYXBzKSxcbiAgICAvLyBhbnkgaW5wdXQgd2hvc2UgYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIG1hcmtzIGl0IGFzIGEgcGF5bWVudC1cbiAgICAvLyBjYXJkIGZpZWxkIChgY2MtbnVtYmVyYCwgYGNjLWNzY2AsIGBjYy1leHAqYCksIG9yIGEgb25lLXRpbWVcbiAgICAvLyBjb2RlLiBUaGUgcm9hc3QgY2FsbGVkIHRoaXMgb3V0IHVuZGVyIFRILTAwMSAvIEQuNCDigJQgbmV2ZXIgc2hpcCBhXG4gICAgLy8gdG9rZW4gc2hhcGVkIGxpa2UgYSBjcmVkaXQtY2FyZCBvciBzZXNzaW9uIGJvb3RzdHJhcC5cbiAgICBpZiAobmFtZSA9PT0gJ3ZhbHVlJyAmJiBlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdikge1xuICAgICAgY29uc3QgdCA9IGVsLnR5cGU7XG4gICAgICBjb25zdCBhYyA9IChlbC5nZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScpIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3Qgc2Vuc2l0aXZlID0gdCA9PT0gJ3Bhc3N3b3JkJ1xuICAgICAgICB8fCB0ID09PSAnaGlkZGVuJ1xuICAgICAgICB8fCAvXihjYy0obnVtYmVyfGNzY3xleHAoLW1vbnRofC15ZWFyKT98bmFtZSl8b25lLXRpbWUtY29kZXxuZXctcGFzc3dvcmR8Y3VycmVudC1wYXNzd29yZCkkLy50ZXN0KGFjKTtcbiAgICAgIGlmIChzZW5zaXRpdmUpIHtcbiAgICAgICAgdiA9ICfigKLigKLigKLigKInO1xuICAgICAgICB2YWx1ZU1hc2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2KSB7XG4gICAgICBjb25zdCByZWRhY3RlZCA9IHJlZGFjdFNlY3JldHMobmFtZSwgdik7XG4gICAgICBpZiAocmVkYWN0ZWQgIT09IHYpIHsgdiA9IHJlZGFjdGVkOyB2YWx1ZU1hc2tlZCA9IHRydWU7IH1cbiAgICB9XG4gICAgaWYgKHYpIGF0dHJzW25hbWVdID0gdjtcbiAgfVxuICAvLyBDYXB0dXJlLXRpbWUgc3ludGhldGljIGhpbnRzIHNpdCBpbiB0aGVpciBvd24gYmFnIChub3QgbWl4ZWQgd2l0aCByZWFsXG4gIC8vIGF0dHJpYnV0ZXMpLiBQZXItaW5wdXQtdHlwZSBmb3JtYXQgaGVscHMgYW4gTExNIGtub3cgdGhlIGV4cGVjdGVkIHNoYXBlLlxuICBjb25zdCBoaW50czogaW1wb3J0KCcuL3R5cGVzLnRzJykuRW50cnlIaW50cyA9IHt9O1xuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgY29uc3QgZm10ID0gSU5QVVRfRk9STUFUX0hJTlRTW2VsLnR5cGVdO1xuICAgIGlmIChmbXQpIGhpbnRzLmZvcm1hdCA9IGZtdDtcbiAgfVxuICBpZiAodmFsdWVNYXNrZWQpIGhpbnRzLnZhbHVlTWFza2VkID0gdHJ1ZTtcbiAgcmV0dXJuIHthdHRycywgaGludHM6IE9iamVjdC5rZXlzKGhpbnRzKS5sZW5ndGggPyBoaW50cyA6IHVuZGVmaW5lZH07XG59O1xuXG5jb25zdCBOT0lTRV9WQUxVRVMgPSBuZXcgU2V0KFsnaW5pdGlhbCcsICdpbmhlcml0JywgJ3Vuc2V0JywgJ3JldmVydCcsICdyZXZlcnQtbGF5ZXInLCAnbm9ybWFsJywgJ2F1dG8nLCAnbm9uZScsICdzdGF0aWMnXSk7XG5jb25zdCBOT0lTRV9GT1JfS0VZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XG4gIHZpc2liaWxpdHk6IFsndmlzaWJsZSddLCBvcGFjaXR5OiBbJzEnXSwgb3ZlcmZsb3c6IFsndmlzaWJsZSddLFxuICBvdmVyZmxvd1g6IFsndmlzaWJsZSddLCBvdmVyZmxvd1k6IFsndmlzaWJsZSddLCBkaXNwbGF5OiBbJ2lubGluZScsICdibG9jayddLFxuICBtYXJnaW46IFsnMHB4J10sIHBhZGRpbmc6IFsnMHB4J10sXG4gIGJvcmRlcjogWycwcHggbm9uZSByZ2IoMCwgMCwgMCknLCAnMHB4IG5vbmUgcmdiYSgwLCAwLCAwLCAwKSddLFxuICBib3JkZXJSYWRpdXM6IFsnMHB4J10sXG4gIGJhY2tncm91bmRDb2xvcjogWydyZ2JhKDAsIDAsIDAsIDApJywgJ3RyYW5zcGFyZW50J10sXG4gIHBvaW50ZXJFdmVudHM6IFsnYXV0byddLFxuICAvLyBUaGUgcm9hc3QgY2FsbGVkIHRoZXNlIG91dCBhcyBkZWZhdWx0LXZhbHVlIG5vaXNlIHRoYXQgYXBwZWFycyBvblxuICAvLyBldmVyeSBlbnRyeTogdG9wL3JpZ2h0L2JvdHRvbS9sZWZ0IGRlZmF1bHQgdG8gMHB4IG9uIHJlbGF0aXZlXG4gIC8vIHBvc2l0aW9uaW5nLCBmbGV4RGlyZWN0aW9uL2ZsZXhXcmFwIGRlZmF1bHQgdG8gcm93L25vd3JhcCBvblxuICAvLyBub24tZmxleCBjb250YWluZXJzLCBhbmQgYHRyYW5zaXRpb246IGFsbGAgaXMgdGhlIHVuaXZlcnNhbC1yZXNldFxuICAvLyBzaWRlIGVmZmVjdCDigJQgbm9uZSBtZWFuaW5nZnVsIGFzIGNhcHR1cmVkIHBlci1lbGVtZW50LlxuICB0b3A6IFsnMHB4J10sIHJpZ2h0OiBbJzBweCddLCBib3R0b206IFsnMHB4J10sIGxlZnQ6IFsnMHB4J10sXG4gIGZsZXhEaXJlY3Rpb246IFsncm93J10sXG4gIGZsZXhXcmFwOiBbJ25vd3JhcCddLFxuICB0cmFuc2l0aW9uOiBbJ2FsbCcsICdhbGwgMHMgZWFzZSAwcyddLFxuICAvLyBTcGVjIGRlZmF1bHRzIGZvciBncmlkICsgZmxleCBhbGlnbm1lbnQuXG4gIGFsaWduSXRlbXM6IFsnc3RyZXRjaCddLCBqdXN0aWZ5Q29udGVudDogWydmbGV4LXN0YXJ0JywgJ25vcm1hbCddLFxuICAvLyB0ZXh0QWxpZ24gZGVmYXVsdCBpcyBgc3RhcnRgLiBVc2VmdWwgd2hlbiBleHBsaWNpdGx5IHNldDsgbm9pc2Ugb3RoZXJ3aXNlLlxuICB0ZXh0QWxpZ246IFsnc3RhcnQnXSxcbiAgdGV4dERlY29yYXRpb246IFsnbm9uZSBzb2xpZCByZ2IoMCwgMCwgMCknXSxcbn07XG5jb25zdCBpc01lYW5pbmdmdWwgPSAoazogc3RyaW5nLCB2OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogdiBpcyBzdHJpbmcgPT4ge1xuICBpZiAodiA9PSBudWxsIHx8IHYgPT09ICcnKSByZXR1cm4gZmFsc2U7XG4gIGlmIChOT0lTRV9WQUxVRVMuaGFzKHYpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAhTk9JU0VfRk9SX0tFWVtrXT8uaW5jbHVkZXModik7XG59O1xuXG5jb25zdCBTVFlMRV9LRVlTID0gW1xuICAnZm9udEZhbWlseScsICdmb250U2l6ZScsICdmb250V2VpZ2h0JywgJ2xpbmVIZWlnaHQnLCAnbGV0dGVyU3BhY2luZycsXG4gICd0ZXh0QWxpZ24nLCAndGV4dFRyYW5zZm9ybScsICd0ZXh0RGVjb3JhdGlvbicsICdjb2xvcicsXG4gICdwYWRkaW5nJywgJ21hcmdpbicsICd3aWR0aCcsICdoZWlnaHQnLCAnbWluV2lkdGgnLCAnbWluSGVpZ2h0JywgJ21heFdpZHRoJywgJ21heEhlaWdodCcsXG4gICdiYWNrZ3JvdW5kQ29sb3InLCAnYmFja2dyb3VuZEltYWdlJywgJ2JvcmRlcicsICdib3JkZXJSYWRpdXMnLFxuICAnZGlzcGxheScsICdwb3NpdGlvbicsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnLCAnekluZGV4JyxcbiAgJ2ZsZXhEaXJlY3Rpb24nLCAnYWxpZ25JdGVtcycsICdqdXN0aWZ5Q29udGVudCcsICdnYXAnLCAnZmxleFdyYXAnLFxuICAnZ3JpZFRlbXBsYXRlQ29sdW1ucycsICdncmlkVGVtcGxhdGVSb3dzJywgJ2dyaWRDb2x1bW4nLCAnZ3JpZFJvdycsXG4gICdib3hTaGFkb3cnLCAnb3BhY2l0eScsICdvdmVyZmxvdycsICdmaWx0ZXInLCAnYmFja2Ryb3BGaWx0ZXInLCAndHJhbnNmb3JtJyxcbiAgJ3RyYW5zaXRpb24nLCAnYW5pbWF0aW9uJywgJ2N1cnNvcicsICd2aXNpYmlsaXR5JywgJ3BvaW50ZXJFdmVudHMnLFxuXSBhcyBjb25zdDtcbmNvbnN0IFNUWUxFX0xJTUlUUzogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHtcbiAgZm9udEZhbWlseTogMjU2LCBiYWNrZ3JvdW5kSW1hZ2U6IDEwMDAsIGJveFNoYWRvdzogMTAwMCwgYm9yZGVyOiAyNTYsXG4gIGZpbHRlcjogNTEyLCBiYWNrZHJvcEZpbHRlcjogNTEyLCB0cmFuc2Zvcm06IDUxMiwgdHJhbnNpdGlvbjogNTEyLCBhbmltYXRpb246IDUxMixcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogMTAwMCwgZ3JpZFRlbXBsYXRlUm93czogMTAwMCxcbn07XG5cbi8vIFBpeGVsIHZhbHVlcyByZXBvcnRlZCBieSBnZXRDb21wdXRlZFN0eWxlIG9uIGhpZ2gtRFBSIGRpc3BsYXlzIGNvbWUgYmFja1xuLy8gYXQgc3VicGl4ZWwgcHJlY2lzaW9uIChgMTUuOTk4M3B4YCwgYDIxLjk5NjVweGApLiBUaGUgZnJhY3Rpb25hbCBkaWdpdHNcbi8vIGFyZSBhcml0aG1ldGljIG5vaXNlLCBub3QgbWVhbmluZ2Z1bCBsYXlvdXQgc2lnbmFsIOKAlCByb3VuZCB0byAxIGRlY2ltYWxcbi8vIGZvciByZWFkYWJpbGl0eS4gV2Ugb25seSByb3VuZCBzaW1wbGUgYDxmbG9hdD5weGAgdmFsdWVzOyBhbnl0aGluZyBtb3JlXG4vLyBjb21wbGV4IChjYWxjKCksIHNob3J0aGFuZCBwYWRkaW5nLCBldGMuKSBpcyBsZWZ0IGludGFjdC5cbmNvbnN0IFBYX1JFID0gL14tP1xcZCtcXC5cXGQrcHgkLztcbmNvbnN0IHJvdW5kUHggPSAodjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFQWF9SRS50ZXN0KHYpKSByZXR1cm4gdjtcbiAgY29uc3QgbiA9IHBhcnNlRmxvYXQodik7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobikgPyBgJHtNYXRoLnJvdW5kKG4gKiAxMCkgLyAxMH1weGAgOiB2O1xufTtcblxuLy8gU3R5bGUgcHJvcHMgd29ydGggZHVhbC1lbWl0dGluZyBib3RoIHRoZWlyIHJlc29sdmVkIChgcmdiKC4uLilgKSBhbmRcbi8vIGRlY2xhcmVkIChgdmFyKC0tdG9rZW4pYCkgZm9ybXMuIFRoZSByZXNvbHZlZCB2YWx1ZSBpcyB3aGF0IGFuIExMTVxuLy8gcmVhc29ucyBhYm91dCB2aXN1YWxseTsgdGhlIGRlY2xhcmVkIGZvcm0gaXMgd2hhdCB0aGUgdXNlciB3cm90ZSBpblxuLy8gQ1NTIC8gd2hhdCBhIGRlc2lnbmVyIHJlY29nbml6ZXMuIE9ubHkgbWVhbmluZ2Z1bCBmb3IgdG9rZW4tZHJpdmVuXG4vLyB0aGVtaW5nLCBzbyB3ZSBsaW1pdCB0aGUgZHVhbC1lbWl0IHRvIGNvbG9yLXNoYXBlZCBwcm9wZXJ0aWVzLlxuY29uc3QgVkFSX0RVQUxfRU1JVCA9IG5ldyBTZXQoWydjb2xvcicsICdiYWNrZ3JvdW5kQ29sb3InLCAnYm9yZGVyQ29sb3InXSk7XG5cbmNvbnN0IGVzc2VudGlhbFN0eWxlcyA9IChlbDogRWxlbWVudCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAoY29uc3QgayBvZiBTVFlMRV9LRVlTKSB7XG4gICAgY29uc3QgdiA9IChjcyBhcyBhbnkpW2tdO1xuICAgIGlmICghaXNNZWFuaW5nZnVsKGssIHYpKSBjb250aW51ZTtcbiAgICBvdXRba10gPSByb3VuZFB4KHRyaW1UZXh0KHYsIFNUWUxFX0xJTUlUU1trXSA/PyAxNDApKTtcbiAgfVxuICAvLyBEdWFsLWVtaXQgdGhlIG9yaWdpbmFsIGB2YXIoLS3igKYpYCBmb3JtIGZvciB0aGVtZS1kcml2ZW4gcHJvcGVydGllcy5cbiAgLy8gV2UgcHVsbCBmcm9tIHRoZSBpbmxpbmUgYHN0eWxlYCBhdHRyaWJ1dGUgZmlyc3QgKGNoZWFwZXN0KSwgdGhlbiB3YWxrXG4gIC8vIG1hdGNoZWRSdWxlcyBmb3Igb25lcyB3aG9zZSBkZWNsYXJlZCB0ZXh0IGNvbnRhaW5zIGEgYHZhcihgLiBUaGVcbiAgLy8gcmVzb2x2ZWQgdmFsdWUgYWxyZWFkeSBsaXZlcyBpbiBgb3V0W2tdYDsgd2UgYWRkIGEgYDxrZXk+VmFyYCBzaWJsaW5nLlxuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgIGZvciAoY29uc3QgayBvZiBWQVJfRFVBTF9FTUlUKSB7XG4gICAgICBpZiAoIW91dFtrXSkgY29udGludWU7XG4gICAgICAvLyBDU1NTdHlsZURlY2xhcmF0aW9uIHVzZXMga2ViYWItY2FzZSBpbiBgZ2V0UHJvcGVydHlWYWx1ZWAuXG4gICAgICBjb25zdCBkYXNoS2V5ID0gay5yZXBsYWNlKC9bQS1aXS9nLCAoYykgPT4gJy0nICsgYy50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGNvbnN0IGlubGluZSA9IGVsLnN0eWxlPy5nZXRQcm9wZXJ0eVZhbHVlKGRhc2hLZXkpPy50cmltKCk7XG4gICAgICBpZiAoaW5saW5lICYmIGlubGluZS5pbmNsdWRlcygndmFyKCcpKSB7XG4gICAgICAgIG91dFtgJHtrfVZhcmBdID0gdHJpbVRleHQoaW5saW5lLCAxNDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuY29uc3QgUFNFVURPX0tFWVMgPSBbJ2Rpc3BsYXknLCAncG9zaXRpb24nLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ2JhY2tncm91bmRDb2xvcicsICdiYWNrZ3JvdW5kSW1hZ2UnLCAnYm9yZGVyJywgJ2JvcmRlclJhZGl1cycsICdib3hTaGFkb3cnLCAndHJhbnNmb3JtJywgJ29wYWNpdHknLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0JywgJ3pJbmRleCddIGFzIGNvbnN0O1xuY29uc3QgcHNldWRvU3R5bGVzID0gKGVsOiBFbGVtZW50KTogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPT4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge307XG4gIGZvciAoY29uc3Qgd2hpY2ggb2YgWyc6OmJlZm9yZScsICc6OmFmdGVyJ10pIHtcbiAgICBjb25zdCBjcyA9IHNhZmVDYWxsKCgpID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCB3aGljaCksIG51bGwpO1xuICAgIGlmICghY3MpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjcy5jb250ZW50O1xuICAgIGlmICghY29udGVudCB8fCBjb250ZW50ID09PSAnbm9uZScgfHwgY29udGVudCA9PT0gJ25vcm1hbCcpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGJsb2NrOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge2NvbnRlbnQ6IHRyaW1UZXh0KGNvbnRlbnQsIDI1Nil9O1xuICAgIGZvciAoY29uc3QgayBvZiBQU0VVRE9fS0VZUykge1xuICAgICAgY29uc3QgdiA9IChjcyBhcyBhbnkpW2tdO1xuICAgICAgaWYgKGlzTWVhbmluZ2Z1bChrLCB2KSkgYmxvY2tba10gPSB0cmltVGV4dCh2LCBTVFlMRV9MSU1JVFNba10gPz8gMTQwKTtcbiAgICB9XG4gICAgb3V0W3doaWNoLnJlcGxhY2UoJzo6JywgJycpXSA9IGJsb2NrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBQc2V1ZG8tY2xhc3NlcyBzYWZlIGZvciBhbnkgdGFnLlxuY29uc3QgU1RBVEVTX0tFRVBfVU5JVkVSU0FMID0gWydob3ZlcicsICdmb2N1cycsICdmb2N1cy12aXNpYmxlJywgJ2ZvY3VzLXdpdGhpbicsICdhY3RpdmUnLCAndGFyZ2V0JywgJ3Zpc2l0ZWQnXSBhcyBjb25zdDtcbi8vIEZvcm0tc3RhdGUgcHNldWRvcy4gQUxMIGVsZW1lbnRzIHRlY2huaWNhbGx5IG1hdGNoIGA6dmFsaWRgIC8gYDppbnZhbGlkYFxuLy8gKHBlciBDU1Mgc3BlYyksIHNvIGNhcHR1cmluZyB0aGVtIG9uIGEgYDxidXR0b24+YCBvciBgPGRpdj5gIHByb2R1Y2VzXG4vLyBgc3RhdGVzLnZhbGlkOiB0cnVlYCBub2lzZSB0aGF0IGNvbmZ1c2VkIExMTXMgKFwidGhlIGJ1dHRvbiBpcyB2YWxpZD9cbi8vIHdoYXQgZG9lcyB0aGF0IG1lYW4/XCIpLiBPbmx5IGVtaXQgdGhlc2UgZm9yIGdlbnVpbmUgZm9ybS1jb250cm9sIHRhZ3MuXG5jb25zdCBTVEFURVNfS0VFUF9GT1JNID0gWydjaGVja2VkJywgJ2Rpc2FibGVkJywgJ3JlcXVpcmVkJywgJ29wdGlvbmFsJywgJ3JlYWQtb25seScsICdyZWFkLXdyaXRlJywgJ2luLXJhbmdlJywgJ291dC1vZi1yYW5nZScsICd2YWxpZCcsICdpbnZhbGlkJ10gYXMgY29uc3Q7XG5jb25zdCBGT1JNX1RBR1MgPSBuZXcgU2V0KFsnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJywgJ29wdGlvbicsICdmaWVsZHNldCcsICdvdXRwdXQnLCAncHJvZ3Jlc3MnLCAnbWV0ZXInXSk7XG4vLyB2MjogYXJyYXkgZm9ybS4gRWFzaWVyIGZvciBEdWNrREIgcXVlcmllcyAoYCdob3ZlcicgPSBBTlkoc3RhdGVzKWApIGFuZCBhXG4vLyBmZXcgYnl0ZXMgc2hvcnRlciBvbiB0aGUgd2lyZSB0aGFuIHRoZSBvYmplY3QtYXMtc2V0IHNoYXBlLlxuY29uc3QgcGlja1RydWVTdGF0ZXMgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBzIG9mIFNUQVRFU19LRUVQX1VOSVZFUlNBTCkge1xuICAgIHRyeSB7IGlmIChlbC5tYXRjaGVzKGA6JHtzfWApKSBvdXQucHVzaChzKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSBpbnZhbGlkICovIH1cbiAgfVxuICBpZiAoRk9STV9UQUdTLmhhcyhlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgZm9yIChjb25zdCBzIG9mIFNUQVRFU19LRUVQX0ZPUk0pIHtcbiAgICAgIHRyeSB7IGlmIChlbC5tYXRjaGVzKGA6JHtzfWApKSBvdXQucHVzaChzKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG5jb25zdCBTVFlMRV9JTlRFUkVTVFMgPSBbXG4gICdkaXNwbGF5JywgJ3Bvc2l0aW9uJywgJ3Zpc2liaWxpdHknLCAnb3ZlcmZsb3cnLCAnb3ZlcmZsb3dYJywgJ292ZXJmbG93WScsXG4gICdib3hTaXppbmcnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ21pbldpZHRoJywgJ21pbkhlaWdodCcsICdtYXhXaWR0aCcsICdtYXhIZWlnaHQnLFxuICAnbWFyZ2luJywgJ3BhZGRpbmcnLCAnYm9yZGVyV2lkdGgnLCAnYm9yZGVyVG9wV2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmFkaXVzJywgJ2NvbG9yJywgJ2JhY2tncm91bmRDb2xvcicsXG4gICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ2ZvbnRXZWlnaHQnLCAnbGluZUhlaWdodCcsICd0ZXh0QWxpZ24nLCAndGV4dERlY29yYXRpb24nLFxuICAnb3BhY2l0eScsICd0cmFuc2Zvcm0nLCAndHJhbnNpdGlvbicsICdhbmltYXRpb24nLFxuXSBhcyBjb25zdDtcblxuLy8gVW5pdmVyc2FsIHNlbGVjdG9ycyBhbmQgQG1lZGlhIHByaW50IGJsb2NrcyBhcmUgcHJlc2VudCBvbiBldmVyeSBjYXB0dXJlZFxuLy8gZWxlbWVudCBhY3Jvc3MgYm90aCBQbGFzbWljIGFuZCB0aGUgV3Jhbm5nbGUgY29uc29sZS4gVGhleSBuZXZlciBleHBsYWluXG4vLyB3aGF0IG1ha2VzIGEgU1BFQ0lGSUMgZWxlbWVudCBsb29rIHRoZSB3YXkgaXQgZG9lcywgc28gdGhleSdyZSBwdXJlXG4vLyBub2lzZSDigJQgfjIxJSBvZiB0b3RhbCBwYXlsb2FkIGJ5dGVzIHBlciB0aGUgcm9hc3QgbWVhc3VyZW1lbnQuXG5jb25zdCBpc0ZpbHRlcmFibGVTZWxlY3RvciA9IChzZWw6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCB0cmltbWVkID0gc2VsLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCk7XG4gIGlmICh0cmltbWVkID09PSAnKicpIHJldHVybiB0cnVlO1xuICBpZiAodHJpbW1lZCA9PT0gJyosIDo6YmVmb3JlLCA6OmFmdGVyJykgcmV0dXJuIHRydWU7XG4gIGlmICh0cmltbWVkID09PSAnOjpiZWZvcmUsIDo6YWZ0ZXIsIConKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgY29sbGVjdE1hdGNoZWRSdWxlcyA9IChlbDogRWxlbWVudCk6IE1hdGNoZWRSdWxlW10gPT4ge1xuICBjb25zdCBydWxlczogTWF0Y2hlZFJ1bGVbXSA9IFtdO1xuICBjb25zdCBtZWRpYVN0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBwdXNoUnVsZSA9IChydWxlOiBDU1NTdHlsZVJ1bGUpOiBib29sZWFuID0+IHtcbiAgICB0cnkgeyBpZiAoIWVsLm1hdGNoZXMocnVsZS5zZWxlY3RvclRleHQpKSByZXR1cm4gdHJ1ZTsgfSBjYXRjaCB7IHJldHVybiB0cnVlOyB9XG4gICAgaWYgKGlzRmlsdGVyYWJsZVNlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gRHJvcCBAbWVkaWEgcHJpbnQgYmxvY2tzIOKAlCBjYXB0dXJlcyBhcmUgYWx3YXlzIGZvciB0aGUgc2NyZWVuIHZpZXcuXG4gICAgY29uc3QgbWVkaWFKb2luZWQgPSBtZWRpYVN0YWNrLmpvaW4oJyAmJiAnKTtcbiAgICBpZiAoL1xcYnByaW50XFxiLy50ZXN0KG1lZGlhSm9pbmVkKSAmJiAhL1xcYnNjcmVlblxcYi8udGVzdChtZWRpYUpvaW5lZCkpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGRlY2xhcmVkOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIFNUWUxFX0lOVEVSRVNUUykge1xuICAgICAgY29uc3QgdiA9IHJ1bGUuc3R5bGU/LmdldFByb3BlcnR5VmFsdWUocCk7XG4gICAgICBpZiAodikgZGVjbGFyZWRbcF0gPSB0cmltVGV4dCh2LCAxNDApO1xuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGRlY2xhcmVkKS5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIC8vIEEgcnVsZSBjYW4gTUFUQ0ggdGhlIHNlbGVjdG9yIHdpdGhvdXQgYmVpbmcgQUNUSVZFIGlmIGl0IGxpdmVzXG4gICAgLy8gaW5zaWRlIGFuIHVubWF0Y2hlZCBAbWVkaWEgcXVlcnkuIFRlc3Qgd2l0aCBtYXRjaE1lZGlhIHNvXG4gICAgLy8gcmVjZWl2ZXJzIGtub3cgd2hpY2ggcnVsZXMgc2hhcGVkIHRoZSBjYXB0dXJlZCB2aWV3cG9ydCB2cy5cbiAgICAvLyB3aGljaCB3b3VsZCBzaGFwZSBhIGRpZmZlcmVudCBvbmUgKGUuZy4gbW9iaWxlIHJ1bGVzIGNhcHR1cmVkXG4gICAgLy8gb24gZGVza3RvcCkuXG4gICAgY29uc3QgbWVkaWFBY3RpdmUgPSBtZWRpYVN0YWNrLmxlbmd0aCA9PT0gMFxuICAgICAgPyB0cnVlXG4gICAgICA6ICgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gbWVkaWFTdGFjayBqb2lucyBtdWx0aXBsZSBuZXN0ZWQgQG1lZGlhIOKAlCBhbGwgbXVzdCBtYXRjaC5cbiAgICAgICAgICBmb3IgKGNvbnN0IGNvbmQgb2YgbWVkaWFTdGFjaykge1xuICAgICAgICAgICAgY29uc3QgcmF3Q29uZCA9IGNvbmQucmVwbGFjZSgvXkBtZWRpYVxccyovLCAnJyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoTWVkaWEocmF3Q29uZCkubWF0Y2hlcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICAgIH0pKCk7XG4gICAgY29uc3QgcnVsZUVudHJ5OiBNYXRjaGVkUnVsZSA9IHtcbiAgICAgIHNlbGVjdG9yOiBydWxlLnNlbGVjdG9yVGV4dCxcbiAgICAgIGRlY2xhcmF0aW9uczogZGVjbGFyZWQsXG4gICAgICAuLi4obWVkaWFTdGFjay5sZW5ndGggPyB7bWVkaWE6IG1lZGlhSm9pbmVkfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChtZWRpYVN0YWNrLmxlbmd0aCkgcnVsZUVudHJ5Lm1lZGlhQWN0aXZlID0gbWVkaWFBY3RpdmU7XG4gICAgcnVsZXMucHVzaChydWxlRW50cnkpO1xuICAgIHJldHVybiBydWxlcy5sZW5ndGggPCBNQVhfUlVMRVM7XG4gIH07XG4gIGNvbnN0IHdhbGsgPSAoc2hlZXQ6IENTU1N0eWxlU2hlZXQgfCBudWxsLCBsaXN0OiBDU1NSdWxlTGlzdCk6IHZvaWQgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGggJiYgcnVsZXMubGVuZ3RoIDwgTUFYX1JVTEVTOyBpKyspIHtcbiAgICAgIGNvbnN0IHJ1bGUgPSBsaXN0W2ldO1xuICAgICAgaWYgKCFydWxlIHx8IHR5cGVvZiBydWxlLnR5cGUgIT09ICdudW1iZXInKSBjb250aW51ZTtcbiAgICAgIGlmIChydWxlLnR5cGUgPT09IENTU1J1bGUuU1RZTEVfUlVMRSkge1xuICAgICAgICBpZiAoIXB1c2hSdWxlKHJ1bGUgYXMgQ1NTU3R5bGVSdWxlKSkgYnJlYWs7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5NRURJQV9SVUxFIHx8IHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5TVVBQT1JUU19SVUxFKSB7XG4gICAgICAgIGNvbnN0IGNvbmQgPSBTdHJpbmcoKHJ1bGUgYXMgQ1NTTWVkaWFSdWxlKS5jb25kaXRpb25UZXh0IHx8ICcnKS50cmltKCk7XG4gICAgICAgIGlmIChjb25kKSBtZWRpYVN0YWNrLnB1c2goY29uZCk7XG4gICAgICAgIGlmICgocnVsZSBhcyBDU1NHcm91cGluZ1J1bGUpLmNzc1J1bGVzKSB3YWxrKHNoZWV0LCAocnVsZSBhcyBDU1NHcm91cGluZ1J1bGUpLmNzc1J1bGVzKTtcbiAgICAgICAgaWYgKGNvbmQpIG1lZGlhU3RhY2sucG9wKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJ1bGUudHlwZSA9PT0gQ1NTUnVsZS5JTVBPUlRfUlVMRSAmJiAocnVsZSBhcyBDU1NJbXBvcnRSdWxlKS5zdHlsZVNoZWV0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaW0gPSAocnVsZSBhcyBDU1NJbXBvcnRSdWxlKS5zdHlsZVNoZWV0O1xuICAgICAgICAgIGlmIChpbT8uY3NzUnVsZXMpIHdhbGsoaW0sIGltLmNzc1J1bGVzKTtcbiAgICAgICAgfSBjYXRjaCB7IC8qIENPUlMtYmxvY2tlZCBzaGVldCAqLyB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmb3IgKGNvbnN0IHNoZWV0IG9mIEFycmF5LmZyb20oZG9jdW1lbnQuc3R5bGVTaGVldHMgfHwgW10pKSB7XG4gICAgY29uc3QgbSA9IHNoZWV0Lm1lZGlhPy5tZWRpYVRleHQ7XG4gICAgaWYgKG0pIG1lZGlhU3RhY2sucHVzaChgQG1lZGlhICR7bX1gKTtcbiAgICBsZXQgY3NzOiBDU1NSdWxlTGlzdCB8IHVuZGVmaW5lZDtcbiAgICB0cnkgeyBjc3MgPSBzaGVldC5jc3NSdWxlczsgfSBjYXRjaCB7IGlmIChtKSBtZWRpYVN0YWNrLnBvcCgpOyBjb250aW51ZTsgfVxuICAgIGlmIChjc3MpIHdhbGsoc2hlZXQsIGNzcyk7XG4gICAgaWYgKG0pIG1lZGlhU3RhY2sucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHJ1bGVzO1xufTtcblxuLy8gRXZlbnQtaGFuZGxlciBwcm9iZXMuIFJldHVybnMgYSBmbGF0IGB7IG9uQ2xpY2s6IFwiaGFuZGxlck5hbWVcIiwg4oCmIH1gIG1hcFxuLy8gcHVsbGVkIGZyb20gd2hhdGV2ZXIgZnJhbWV3b3JrIHdpcmVkIHRoZSBoYW5kbGVyLiBUaGUgbWFwIGFuc3dlcnNcbi8vIFwid2hpY2ggaGFuZGxlciByYW4gd2hlbiB0aGlzIGZpcmVkP1wiIHdpdGhvdXQgZm9yY2luZyBhbiBMTE0gdG8gZ3JlcFxuLy8gdGhlIGNvZGViYXNlLiBUaHJlZSBzb3VyY2VzIHN0YWNrZWQ6XG4vL1xuLy8gICAxLiBSZWFjdCBmaWJlcnMg4oCUIGBfX3JlYWN0UHJvcHMkPGtleT4ub25YYCAoZnVuY3Rpb24gd2hvc2UgYC5uYW1lYFxuLy8gICAgICBpcyB0aGUgc291cmNlIG5hbWUgaW4gZGV2IGJ1aWxkcywgbWluaWZpZWQgaW4gcHJvZCkuXG4vLyAgIDIuIFZ1ZSAzIHZub2RlIHByb3BzIOKAlCBgX192dWVQYXJlbnRDb21wb25lbnQudm5vZGUucHJvcHMub25YYFxuLy8gICAgICAoVnVlIDMgbm9ybWFsaXplcyBgQGNsaWNrYCB0ZW1wbGF0ZSBhdHRycyB0byBgb25DbGlja2Agb24gdGhlXG4vLyAgICAgIGNvbXBvbmVudCB2bm9kZSkuXG4vLyAgIDMuIElubGluZSBgb24qYCBIVE1MIGF0dHJpYnV0ZXMg4oCUIHRoZSBsZWdhY3kgYG9uY2xpY2s9XCLigKZcImAgZm9ybS5cbi8vICAgICAgQ2FwdHVyZWQgdmFsdWUgaXMgdGhlIHNvdXJjZSBzdHJpbmcgd2l0aCB3aGl0ZXNwYWNlIGNvbGxhcHNlZCxcbi8vICAgICAgY2FwcGVkIHRvIDIwMCBjaGFycyAoZnVsbC1zY3JpcHQgaW5saW5lIGhhbmRsZXJzIGdldCB0cnVuY2F0ZWQpLlxuLy9cbi8vIEVhY2ggc291cmNlIGNhbiBjb250cmlidXRlOyBsYXRlciBzb3VyY2VzIGRvbid0IG92ZXJ3cml0ZSBlYXJsaWVyIG9uZXNcbi8vIOKAlCBhIFJlYWN0IGhhbmRsZXIgYmVhdHMgYW4gaW5saW5lIG9uZSB3aGVuIGJvdGggZXhpc3Qgb24gdGhlIG5vZGUuXG5jb25zdCBIQU5ETEVSX0tFWVMgPSBbJ29uQ2xpY2snLCAnb25Nb3VzZURvd24nLCAnb25TdWJtaXQnLCAnb25DaGFuZ2UnLCAnb25LZXlEb3duJywgJ29uRm9jdXMnLCAnb25CbHVyJywgJ29uSW5wdXQnXSBhcyBjb25zdDtcbmNvbnN0IElOTElORV9PTl9BVFRSUyA9IFsnb25jbGljaycsICdvbm1vdXNlZG93bicsICdvbnN1Ym1pdCcsICdvbmNoYW5nZScsICdvbmtleWRvd24nLCAnb25mb2N1cycsICdvbmJsdXInLCAnb25pbnB1dCddIGFzIGNvbnN0O1xuXG5jb25zdCByZWFjdEV2ZW50TmFtZXMgPSAoZWw6IEVsZW1lbnQsIG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHZvaWQgPT4ge1xuICBjb25zdCBwcm9wc0tleSA9IE9iamVjdC5rZXlzKGVsKS5maW5kKChrKSA9PiBrLnN0YXJ0c1dpdGgoJ19fcmVhY3RQcm9wcyQnKSk7XG4gIGlmICghcHJvcHNLZXkpIHJldHVybjtcbiAgY29uc3QgcHJvcHMgPSAoZWwgYXMgYW55KVtwcm9wc0tleV0gYXMgUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZDtcbiAgaWYgKCFwcm9wcykgcmV0dXJuO1xuICBmb3IgKGNvbnN0IGsgb2YgSEFORExFUl9LRVlTKSB7XG4gICAgaWYgKG91dFtrXSkgY29udGludWU7XG4gICAgY29uc3QgZm4gPSBwcm9wc1trXTtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBuID0gZm4ubmFtZSAmJiBmbi5uYW1lICE9PSAnJyA/IGZuLm5hbWUgOiAnPGFub255bW91cz4nO1xuICAgICAgb3V0W2tdID0gdHJpbVRleHQobiwgODApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgdnVlRXZlbnROYW1lcyA9IChlbDogRWxlbWVudCwgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCA9PiB7XG4gIC8vIFZ1ZSAzOiBldmVudHMgbGl2ZSBvbiB0aGUgcGFyZW50LWNvbXBvbmVudCB2bm9kZSdzIHByb3BzIGFzIGBvbkNsaWNrYCxcbiAgLy8gYG9uTXlFdmVudGAsIGV0Yy4gVnVlIDI6IGBlbC5fX3Z1ZV9fLiRsaXN0ZW5lcnNgIGhhZCB0aGVtOyB3ZSBzbmlmZlxuICAvLyBib3RoIHNoYXBlcy4gQ2hlYXAgZmFsbHRocm91Z2ggd2hlbiBuZWl0aGVyIGlzIHByZXNlbnQuXG4gIGNvbnN0IHY6IGFueSA9IChlbCBhcyBhbnkpLl9fdnVlUGFyZW50Q29tcG9uZW50IHx8IChlbCBhcyBhbnkpLl9fdnVlX187XG4gIGlmICghdikgcmV0dXJuO1xuICBjb25zdCBwcm9wcyA9IHYudm5vZGU/LnByb3BzIHx8IHYuJG9wdGlvbnM/LnByb3BzRGF0YSB8fCB2LiRsaXN0ZW5lcnM7XG4gIGlmICghcHJvcHMgfHwgdHlwZW9mIHByb3BzICE9PSAnb2JqZWN0JykgcmV0dXJuO1xuICBmb3IgKGNvbnN0IGsgb2YgSEFORExFUl9LRVlTKSB7XG4gICAgaWYgKG91dFtrXSkgY29udGludWU7XG4gICAgY29uc3QgZm4gPSBwcm9wc1trXSB8fCBwcm9wc1trLnRvTG93ZXJDYXNlKCldO1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG4gPSBmbi5uYW1lICYmIGZuLm5hbWUgIT09ICcnID8gZm4ubmFtZSA6ICc8dnVlLWFub255bW91cz4nO1xuICAgICAgb3V0W2tdID0gdHJpbVRleHQobiwgODApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgaW5saW5lRXZlbnROYW1lcyA9IChlbDogRWxlbWVudCwgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCA9PiB7XG4gIGZvciAoY29uc3QgYXR0ciBvZiBJTkxJTkVfT05fQVRUUlMpIHtcbiAgICBjb25zdCBjYW1lbCA9ICdvbicgKyBhdHRyLmNoYXJBdCgyKS50b1VwcGVyQ2FzZSgpICsgYXR0ci5zbGljZSgzKTtcbiAgICBpZiAob3V0W2NhbWVsXSkgY29udGludWU7XG4gICAgY29uc3QgdiA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICBpZiAodikgb3V0W2NhbWVsXSA9IHRyaW1UZXh0KHYsIDIwMCk7XG4gIH1cbn07XG5cbmNvbnN0IGNvbGxlY3RFdmVudE5hbWVzID0gKGVsOiBFbGVtZW50KTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwgPT4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmVhY3RFdmVudE5hbWVzKGVsLCBvdXQpO1xuICB2dWVFdmVudE5hbWVzKGVsLCBvdXQpO1xuICBpbmxpbmVFdmVudE5hbWVzKGVsLCBvdXQpO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gXCJCZWhhdmlvclwiIGF0dHJpYnV0ZXMg4oCUIGh0bXgsIFN0aW11bHVzLCBBbHBpbmUsIFR1cmJvLiBTZXJ2ZXItcmVuZGVyZWRcbi8vIGFwcHMgZG9uJ3QgaGF2ZSBSZWFjdCBmaWJlcnM7IHRoZSB3aXJpbmcgZm9yIFwid2hhdCB0aGlzIGJ1dHRvbiBkb2VzXCJcbi8vIGxpdmVzIGluIEhUTUwgYXR0cmlidXRlcy4gQ2FwdHVyZSB0aGVtIGFzIGEgc2VwYXJhdGUgZmllbGQgc28gYW4gTExNXG4vLyBhc2tlZCBcIndoeSBkb2Vzbid0IHRoaXMgYnV0dG9uIHdvcms/XCIgc2VlcyB0aGUgYmluZGluZyBpbW1lZGlhdGVseVxuLy8gcmF0aGVyIHRoYW4gZGlnZ2luZyB0aHJvdWdoIGBhdHRyc2AuXG5jb25zdCBCRUhBVklPUl9BVFRSX1BSRUZJWEVTID0gWydoeC0nLCAnZGF0YS1oeC0nLCAnZGF0YS1jb250cm9sbGVyJywgJ2RhdGEtYWN0aW9uJywgJ2RhdGEtdGFyZ2V0JywgJ3gtZGF0YScsICd4LW9uOicsICd4LWJpbmQ6JywgJ3gtbW9kZWwnLCAneC1zaG93JywgJ3gtaWYnLCAnQGNsaWNrJywgJ0BzdWJtaXQnLCAnZGF0YS10dXJibyddIGFzIGNvbnN0O1xuY29uc3QgY29sbGVjdEJlaGF2aW9yQXR0cnMgPSAoZWw6IEVsZW1lbnQpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCA9PiB7XG4gIGlmICghZWwuYXR0cmlidXRlcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKSkge1xuICAgIGNvbnN0IG5hbWUgPSBhLm5hbWU7XG4gICAgaWYgKEJFSEFWSU9SX0FUVFJfUFJFRklYRVMuc29tZSgocCkgPT4gbmFtZSA9PT0gcCB8fCBuYW1lLnN0YXJ0c1dpdGgocCkpKSB7XG4gICAgICBvdXRbbmFtZV0gPSB0cmltVGV4dChhLnZhbHVlLCAyMDApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gV2FsayB1cCB0aGUgc2hhZG93LURPTSBib3VuZGFyaWVzLiBXaGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50IGxpdmVzXG4vLyBpbnNpZGUgYSBjbG9zZWQvb3BlbiBzaGFkb3cgcm9vdCwgdGhlIGhvc3QncyBzZWxlY3RvciBpcyB0aGUgb25seSB3YXlcbi8vIHRoZSBwYW5lbCBzaWRlIChvciBhbiBMTE0gbGF0ZXIpIGNhbiByZS1maW5kIHRoZSBlbnRyeSBvbiB0aGUgbGl2ZVxuLy8gcGFnZSDigJQgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyBib3VuZGFyaWVzLlxuY29uc3Qgc2hhZG93SG9zdFNlbGVjdG9yID0gKGVsOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHJvb3QgPSBlbC5nZXRSb290Tm9kZSgpO1xuICBpZiAoIShyb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCkpIHJldHVybiBudWxsO1xuICBjb25zdCBob3N0ID0gcm9vdC5ob3N0O1xuICBpZiAoIWhvc3QpIHJldHVybiBudWxsO1xuICAvLyBjc3NQYXRoIGlzIGRlZmluZWQgbGF0ZXI7IHJvdXRlIHRocm91Z2ggdGhlIHNoYXJlZCBzZWxlY3RvciBidWlsZGVyLlxuICB0cnkgeyByZXR1cm4gY3NzUGF0aChob3N0KTsgfSBjYXRjaCB7IHJldHVybiBob3N0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTsgfVxufTtcblxuLy8gV2FsayB1cCB0byBmaW5kIHRoZSBuZWFyZXN0IGBjb250ZW50ZWRpdGFibGU9dHJ1ZWAgYW5jZXN0b3IgKHRoZVxuLy8gcmljaC10ZXh0IGVkaXRvcidzIFwicm9vdFwiKS4gUmV0dXJucyBudWxsIHdoZW4gdGhlIGNhcHR1cmVkIGVsZW1lbnQgaXNcbi8vIG91dHNpZGUgYW55IGVkaXRvci5cbmNvbnN0IGZpbmRFZGl0b3JSb290ID0gKGVsOiBFbGVtZW50KTogRWxlbWVudCB8IG51bGwgPT4ge1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsO1xuICB3aGlsZSAoY3VyKSB7XG4gICAgaWYgKGN1ciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGN1ci5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgLy8gV2FsayB1cCBmdXJ0aGVyIHRvIGZpbmQgdGhlIE9VVEVSTU9TVCBjb250ZW50ZWRpdGFibGU9dHJ1ZVxuICAgICAgLy8gYW5jZXN0b3Ig4oCUIFByb3NlTWlycm9yIG5lc3RzIG5vZGVzIHRoYXQgZWFjaCByZXBvcnRcbiAgICAgIC8vIGlzQ29udGVudEVkaXRhYmxlPXRydWUsIGJ1dCB0aGUgYWN0dWFsIGVkaXRvciByb290IGlzIGF0IHRoZSB0b3AuXG4gICAgICBsZXQgb3V0ZXI6IEVsZW1lbnQgPSBjdXI7XG4gICAgICBsZXQgcHJvYmU6IEVsZW1lbnQgfCBudWxsID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgICB3aGlsZSAocHJvYmUgJiYgcHJvYmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBwcm9iZS5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgICBvdXRlciA9IHByb2JlO1xuICAgICAgICBwcm9iZSA9IHByb2JlLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0ZXI7XG4gICAgfVxuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gSWRlbnRpZnkgdGhlIGVkaXRvciBsaWJyYXJ5IGJ5IG1hcmtlcnMgZWFjaCBvbmUgc3RhbXBzIG9uIHRoZSBlZGl0b3Jcbi8vIHJvb3QuIE1vc3QgbGlicmFyaWVzIGxlYXZlIGEgY2xhc3Mgb3IgZGF0YS0qIGF0dHJpYnV0ZSB0aGF0J3Mgc3RhYmxlXG4vLyBhY3Jvc3MgdmVyc2lvbnM7IHNvbWUgbGVhdmUgYSBydW50aW1lIGZpZWxkIG9uIHRoZSBET00gbm9kZS4gT3JkZXJcbi8vIG1hdHRlcnMg4oCUIFRpcFRhcCByZXVzZXMgUHJvc2VNaXJyb3IgdW5kZXIgdGhlIGhvb2QsIHNvIGNoZWNrIHRpcHRhcFxuLy8gbWFya2VycyBmaXJzdDsgZGl0dG8gUXVpbGwgKHB1cmUgUHJvc2VNaXJyb3ItZnJlZSkgYmVmb3JlIGdlbmVyaWNcbi8vIGAuUHJvc2VNaXJyb3JgLlxuY29uc3QgZGV0ZWN0RWRpdG9yS2luZCA9IChyb290OiBFbGVtZW50KTogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJyA9PiB7XG4gIGNvbnN0IHI6IGFueSA9IHJvb3Q7XG4gIGlmIChyb290LmNsYXNzTGlzdD8uY29udGFpbnMoJ3RpcHRhcCcpIHx8IHIuX190aXB0YXApIHJldHVybiAndGlwdGFwJztcbiAgaWYgKHJvb3QuaGFzQXR0cmlidXRlKCdkYXRhLWxleGljYWwtZWRpdG9yJykgfHwgci5fX2xleGljYWxFZGl0b3IpIHJldHVybiAnbGV4aWNhbCc7XG4gIGlmIChyb290Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zbGF0ZS1lZGl0b3InKSB8fCByLl9fc2xhdGVFZGl0b3IpIHJldHVybiAnc2xhdGUnO1xuICBpZiAocm9vdC5jbGFzc0xpc3Q/LmNvbnRhaW5zKCdxbC1lZGl0b3InKSB8fCByb290LmNsb3Nlc3QoJy5xbC1jb250YWluZXInKSkgcmV0dXJuICdxdWlsbCc7XG4gIGlmIChyb290LmNsYXNzTGlzdD8uY29udGFpbnMoJ1Byb3NlTWlycm9yJykgfHwgci5fX3BtVmlld0Rlc2MgfHwgci5wbVZpZXdEZXNjKSByZXR1cm4gJ3Byb3NlbWlycm9yJztcbiAgcmV0dXJuICduYXRpdmUnO1xufTtcblxuY29uc3QgZWRpdG9yQ29udGV4dCA9IChlbDogRWxlbWVudCk6IHtraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnOyByb290U2VsZWN0b3I6IHN0cmluZzsgY29udGVudExlbmd0aDogbnVtYmVyfSB8IG51bGwgPT4ge1xuICBjb25zdCByb290ID0gZmluZEVkaXRvclJvb3QoZWwpO1xuICBpZiAoIXJvb3QpIHJldHVybiBudWxsO1xuICBsZXQgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gIHRyeSB7IHJvb3RTZWxlY3RvciA9IGNzc1BhdGgocm9vdCk7IH0gY2F0Y2ggeyByb290U2VsZWN0b3IgPSByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKTsgfVxuICBjb25zdCB0ZXh0ID0gKHJvb3QgYXMgSFRNTEVsZW1lbnQpLmlubmVyVGV4dCA/PyByb290LnRleHRDb250ZW50ID8/ICcnO1xuICByZXR1cm4ge1xuICAgIGtpbmQ6IGRldGVjdEVkaXRvcktpbmQocm9vdCksXG4gICAgcm9vdFNlbGVjdG9yLFxuICAgIGNvbnRlbnRMZW5ndGg6IHRleHQubGVuZ3RoLFxuICB9O1xufTtcblxuLy8gTGF5b3V0IGJ1Z3MgZnJlcXVlbnRseSBsaXZlIGluIHRoZSBQQVJFTlQncyBmbGV4L2dyaWQvb3ZlcmZsb3cvXG4vLyBzY3JvbGwvc3RhY2tpbmcgY29udGV4dCwgbm90IG9uIHRoZSBjYXB0dXJlZCBlbGVtZW50IGl0c2VsZi5cbi8vIENhcHR1cmUgYSBzbGltIHN1bW1hcnkgb2YgdGhlIHBhcmVudCBjaGFpbiB0aGF0J3Mgc3RydWN0dXJhbGx5XG4vLyByZWxldmFudCB0byBsYXlvdXQg4oCUIGRpc3BsYXksIHBvc2l0aW9uLCBvdmVyZmxvdywgc2Nyb2xsIG9mZnNldCxcbi8vIHRyYW5zZm9ybS93aWxsLWNoYW5nZSAoc3RhY2tpbmcpLCBhbmQgZmxleC9ncmlkIHN1bW1hcnkgb24gdGhlXG4vLyBpbW1lZGlhdGUgcGFyZW50LlxudHlwZSBMYXlvdXRDb250ZXh0RW50cnkgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBkaXNwbGF5Pzogc3RyaW5nO1xuICBwb3NpdGlvbj86IHN0cmluZztcbiAgb3ZlcmZsb3c/OiBzdHJpbmc7XG4gIHpJbmRleD86IHN0cmluZztcbiAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICB3aWxsQ2hhbmdlPzogc3RyaW5nO1xuICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xufTtcbmNvbnN0IGlzTGF5b3V0SW50ZXJlc3RpbmcgPSAoY3M6IENTU1N0eWxlRGVjbGFyYXRpb24pOiBib29sZWFuID0+IHtcbiAgaWYgKGNzLnBvc2l0aW9uICYmIGNzLnBvc2l0aW9uICE9PSAnc3RhdGljJykgcmV0dXJuIHRydWU7XG4gIGlmIChjcy5kaXNwbGF5ICYmIC8oZmxleHxncmlkfHRhYmxlfGNvbnRlbnRzfGlubGluZS1ibG9jaykvLnRlc3QoY3MuZGlzcGxheSkpIHJldHVybiB0cnVlO1xuICBpZiAoY3Mub3ZlcmZsb3cgJiYgY3Mub3ZlcmZsb3cgIT09ICd2aXNpYmxlJykgcmV0dXJuIHRydWU7XG4gIGlmIChjcy50cmFuc2Zvcm0gJiYgY3MudHJhbnNmb3JtICE9PSAnbm9uZScpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59O1xuY29uc3QgY2FwdHVyZUxheW91dENvbnRleHQgPSAoZWw6IEVsZW1lbnQsIGRlcHRoID0gNCk6IExheW91dENvbnRleHRFbnRyeVtdID0+IHtcbiAgY29uc3Qgb3V0OiBMYXlvdXRDb250ZXh0RW50cnlbXSA9IFtdO1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKGN1ciAmJiBjdXIgIT09IGRvY3VtZW50LmJvZHkgJiYgaSA8IGRlcHRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3VyKTtcbiAgICAgIGNvbnN0IGludGVyZXN0aW5nID0gaXNMYXlvdXRJbnRlcmVzdGluZyhjcyk7XG4gICAgICBpZiAoaW50ZXJlc3RpbmcpIHtcbiAgICAgICAgY29uc3QgZW50cnk6IExheW91dENvbnRleHRFbnRyeSA9IHt0YWc6IGN1ci50YWdOYW1lLnRvTG93ZXJDYXNlKCl9O1xuICAgICAgICBlbnRyeS5kaXNwbGF5ID0gY3MuZGlzcGxheTtcbiAgICAgICAgZW50cnkucG9zaXRpb24gPSBjcy5wb3NpdGlvbjtcbiAgICAgICAgaWYgKGNzLm92ZXJmbG93ICE9PSAndmlzaWJsZScpIGVudHJ5Lm92ZXJmbG93ID0gY3Mub3ZlcmZsb3c7XG4gICAgICAgIGlmIChjcy56SW5kZXggJiYgY3MuekluZGV4ICE9PSAnYXV0bycpIGVudHJ5LnpJbmRleCA9IGNzLnpJbmRleDtcbiAgICAgICAgaWYgKGNzLnRyYW5zZm9ybSAmJiBjcy50cmFuc2Zvcm0gIT09ICdub25lJykgZW50cnkudHJhbnNmb3JtID0gdHJpbVRleHQoY3MudHJhbnNmb3JtLCAxMjApO1xuICAgICAgICBpZiAoY3Mud2lsbENoYW5nZSAmJiBjcy53aWxsQ2hhbmdlICE9PSAnYXV0bycpIGVudHJ5LndpbGxDaGFuZ2UgPSBjcy53aWxsQ2hhbmdlO1xuICAgICAgICBpZiAoKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsV2lkdGggPiBjdXIuY2xpZW50V2lkdGggfHwgKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsSGVpZ2h0ID4gY3VyLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgIGVudHJ5LmlzU2Nyb2xsQ29udGFpbmVyID0gdHJ1ZTtcbiAgICAgICAgICBlbnRyeS5zY3JvbGxMZWZ0ID0gKGN1ciBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsTGVmdDtcbiAgICAgICAgICBlbnRyeS5zY3JvbGxUb3AgPSAoY3VyIGFzIEhUTUxFbGVtZW50KS5zY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9mbGV4Ly50ZXN0KGNzLmRpc3BsYXkpKSB7XG4gICAgICAgICAgZW50cnkuZmxleCA9IHtcbiAgICAgICAgICAgIGRpcmVjdGlvbjogY3MuZmxleERpcmVjdGlvbixcbiAgICAgICAgICAgIHdyYXA6IGNzLmZsZXhXcmFwLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogY3MuYWxpZ25JdGVtcyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBjcy5qdXN0aWZ5Q29udGVudCxcbiAgICAgICAgICAgIGdhcDogY3MuZ2FwICE9PSAnbm9ybWFsJyA/IGNzLmdhcCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKC9ncmlkLy50ZXN0KGNzLmRpc3BsYXkpKSB7XG4gICAgICAgICAgZW50cnkuZ3JpZCA9IHtcbiAgICAgICAgICAgIHRlbXBsYXRlQ29sdW1uczogdHJpbVRleHQoY3MuZ3JpZFRlbXBsYXRlQ29sdW1ucywgMjAwKSxcbiAgICAgICAgICAgIHRlbXBsYXRlUm93czogdHJpbVRleHQoY3MuZ3JpZFRlbXBsYXRlUm93cywgMjAwKSxcbiAgICAgICAgICAgIGdhcDogY3MuZ2FwICE9PSAnbm9ybWFsJyA/IGNzLmdhcCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIG91dC5wdXNoKGVudHJ5KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICBjdXIgPSBjdXIucGFyZW50RWxlbWVudDtcbiAgICBpKys7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFN1cmZhY2UgYSBjb250cmFzdC1yYXRpbyBudW1iZXIgZm9yIHRleHQgZWxlbWVudHMgc28gYW4gYTExeS1hd2FyZVxuLy8gcmV2aWV3ZXIgY2FuIGZsYWcgZmFpbGluZyBwYWlycyB3aXRob3V0IHJlLXJ1bm5pbmcgYW4gYXVkaXQuIFJldHVybnNcbi8vIG51bGwgd2hlbiBubyB0ZXh0IG9yIHdoZW4gYmFja2dyb3VuZCBpcyB0cmFuc3BhcmVudCBhbmQgd2UgY2FuJ3Rcbi8vIHJlc29sdmUgYSBiYXNlIGNvbG9yLlxuLy9cbi8vIFdlIG9ubHkgcmVwb3J0IGNvbnRyYXN0IGZvciBlbGVtZW50cyB3aXRoIGRpcmVjdCB0ZXh0IGNoaWxkcmVuOyBmb3Jcbi8vIGNvbnRhaW5lcnMgd2UnZCBuZWVkIHRvIHRyYXZlcnNlLCB3aGljaCBpcyBvdXRzaWRlIHRoZSBzY29wZSBvZiBhXG4vLyBsaWdodHdlaWdodCBpbi1jYXB0dXJlIGF1ZGl0LlxuY29uc3QgcGFyc2VSZ2IgPSAoczogc3RyaW5nKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBudWxsID0+IHtcbiAgLy8gcmdiKDI1NSwgOTUsIDApIHwgcmdiYSgyNTUsIDk1LCAwLCAwLjUpIHwgI2ZmNWYwMCB8ICNmNTBcbiAgY29uc3QgbSA9IC9yZ2JhP1xcKFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqKD86LFxccyooW1xcZC5dKykpP1xccypcXCkvLmV4ZWMocyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIFtwYXJzZUludChtWzFdISwgMTApLCBwYXJzZUludChtWzJdISwgMTApLCBwYXJzZUludChtWzNdISwgMTApLCBtWzRdID8gcGFyc2VGbG9hdChtWzRdKSA6IDFdO1xuICB9XG4gIGNvbnN0IGhleCA9IC9eIyhbMC05YS1mXXszfXxbMC05YS1mXXs2fSkkL2kuZXhlYyhzKTtcbiAgaWYgKGhleCkge1xuICAgIGxldCBoID0gaGV4WzFdITtcbiAgICBpZiAoaC5sZW5ndGggPT09IDMpIGggPSBoLnNwbGl0KCcnKS5tYXAoKGMpID0+IGMgKyBjKS5qb2luKCcnKTtcbiAgICByZXR1cm4gW3BhcnNlSW50KGguc2xpY2UoMCwgMiksIDE2KSwgcGFyc2VJbnQoaC5zbGljZSgyLCA0KSwgMTYpLCBwYXJzZUludChoLnNsaWNlKDQsIDYpLCAxNiksIDFdO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbmNvbnN0IHJlbGF0aXZlTHVtaW5hbmNlID0gKFtyLCBnLCBiXTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiBudW1iZXIgPT4ge1xuICBjb25zdCBsaW4gPSAoYzogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgdiA9IGMgLyAyNTU7XG4gICAgcmV0dXJuIHYgPD0gMC4wMzkyOCA/IHYgLyAxMi45MiA6ICgodiArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQ7XG4gIH07XG4gIHJldHVybiAwLjIxMjYgKiBsaW4ocikgKyAwLjcxNTIgKiBsaW4oZykgKyAwLjA3MjIgKiBsaW4oYik7XG59O1xuY29uc3QgY29udHJhc3RSYXRpbyA9IChmZzogc3RyaW5nLCBiZzogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCA9PiB7XG4gIGNvbnN0IGYgPSBwYXJzZVJnYihmZyk7IGNvbnN0IGIgPSBwYXJzZVJnYihiZyk7XG4gIGlmICghZiB8fCAhYikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGxmID0gcmVsYXRpdmVMdW1pbmFuY2UoZik7XG4gIGNvbnN0IGxiID0gcmVsYXRpdmVMdW1pbmFuY2UoYik7XG4gIGNvbnN0IFtsbywgaGldID0gbGYgPiBsYiA/IFtsYiwgbGZdIDogW2xmLCBsYl07XG4gIHJldHVybiBNYXRoLnJvdW5kKCgoaGkgKyAwLjA1KSAvIChsbyArIDAuMDUpKSAqIDEwMCkgLyAxMDA7XG59O1xuLy8gV2FsayB1cCB0aGUgcGFyZW50IGNoYWluIHRvIGZpbmQgdGhlIGZpcnN0IG9wYXF1ZSBiYWNrZ3JvdW5kIGNvbG9yLlxuLy8gTW9zdCBlbGVtZW50cyByZXBvcnQgYHJnYmEoMCwwLDAsMClgICh0cmFuc3BhcmVudCkgZm9yIGJhY2tncm91bmRDb2xvcjtcbi8vIHRoZSBhY3R1YWwgdmlzaWJsZSBiYWNrZ3JvdW5kIGlzIHRoZSBuZWFyZXN0IGFuY2VzdG9yIHRoYXQgcGFpbnRzLlxuY29uc3QgcmVzb2x2ZUJhY2tncm91bmQgPSAoZWw6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBlbDtcbiAgd2hpbGUgKGN1cikge1xuICAgIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3VyKTtcbiAgICBjb25zdCBiZyA9IGNzLmJhY2tncm91bmRDb2xvcjtcbiAgICBpZiAoYmcgJiYgYmcgIT09ICdyZ2JhKDAsIDAsIDAsIDApJyAmJiBiZyAhPT0gJ3RyYW5zcGFyZW50JykgcmV0dXJuIGJnO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbmNvbnN0IGNvbXB1dGVBY2Nlc3NpYmlsaXR5Q2hlY2sgPSAoZWw6IEVsZW1lbnQpOiB7Y29udHJhc3RSYXRpbz86IG51bWJlcjsgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7IHRhYmJhYmxlPzogYm9vbGVhbjsgZm9jdXNWaXNpYmxlPzogYm9vbGVhbn0gfCBudWxsID0+IHtcbiAgY29uc3Qgb3V0OiB7Y29udHJhc3RSYXRpbz86IG51bWJlcjsgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7IHRhYmJhYmxlPzogYm9vbGVhbjsgZm9jdXNWaXNpYmxlPzogYm9vbGVhbn0gPSB7fTtcbiAgdHJ5IHtcbiAgICBpZiAoaGFzT3duVGV4dE5vZGUoZWwpKSB7XG4gICAgICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGNvbnN0IGZnID0gY3MuY29sb3I7XG4gICAgICBjb25zdCBiZyA9IHJlc29sdmVCYWNrZ3JvdW5kKGVsKTtcbiAgICAgIGlmIChmZyAmJiBiZykge1xuICAgICAgICBjb25zdCByID0gY29udHJhc3RSYXRpbyhmZywgYmcpO1xuICAgICAgICBpZiAociAhPT0gbnVsbCkge1xuICAgICAgICAgIG91dC5jb250cmFzdFJhdGlvID0gcjtcbiAgICAgICAgICAvLyBVc2UgMThwdCsgLyAxNHB0LWJvbGQgdGhyZXNob2xkcyAoMy4wIC8gNC41KSB3aGVuIGFwcGxpY2FibGU7XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBzdGFuZGFyZCA0LjUgLyA3LjAuXG4gICAgICAgICAgY29uc3QgZm9udFNpemUgPSBwYXJzZUZsb2F0KGNzLmZvbnRTaXplKTtcbiAgICAgICAgICBjb25zdCBpc0JvbGQgPSBwYXJzZUludChjcy5mb250V2VpZ2h0LCAxMCkgPj0gNzAwO1xuICAgICAgICAgIGNvbnN0IGlzTGFyZ2VUZXh0ID0gZm9udFNpemUgPj0gMTggfHwgKGZvbnRTaXplID49IDE0ICYmIGlzQm9sZCk7XG4gICAgICAgICAgY29uc3QgYWEgPSBpc0xhcmdlVGV4dCA/IDMgOiA0LjU7XG4gICAgICAgICAgY29uc3QgYWFhID0gaXNMYXJnZVRleHQgPyA0LjUgOiA3O1xuICAgICAgICAgIG91dC5jb250cmFzdFBhc3NlcyA9IHIgPj0gYWFhID8gJ0FBQScgOiByID49IGFhID8gJ0FBJyA6ICdmYWlsJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBUYWIgb3JkZXIgcHJveHk6IHRhYkluZGV4ID49IDAgT1IgbWF0Y2hlcyB0aGUgbmF0dXJhbC10YWJiYWJsZSBzZXQuXG4gICAgY29uc3QgdGkgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLnRhYkluZGV4O1xuICAgIGNvbnN0IG5hdHVyYWxseVRhYmJhYmxlID0gL14oYXxidXR0b258aW5wdXR8c2VsZWN0fHRleHRhcmVhfGlmcmFtZXxkZXRhaWxzfGF1ZGlvfHZpZGVvKSQvaS50ZXN0KGVsLnRhZ05hbWUpICYmICFlbC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgKGVsLnRhZ05hbWUgIT09ICdBJyB8fCBCb29sZWFuKChlbCBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZikpO1xuICAgIG91dC50YWJiYWJsZSA9IHRpID49IDAgfHwgbmF0dXJhbGx5VGFiYmFibGU7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuLy8gQW5pbWF0aW9uLWNvbnRleHQgZmxhZy4gY2FwdHVyZUVudHJ5IGNhbGxzIHRoaXMg4oCUIGlmIGBnZXRBbmltYXRpb25zKClgXG4vLyByZXR1cm5zIGFueXRoaW5nIGFjdGl2ZWx5IHBsYXlpbmcsIHRoZSByZWN0IC8gdHJhbnNmb3JtIC8gb3BhY2l0eSB3ZVxuLy8gY2FwdHVyZWQgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLCBub3QgdGhlXG4vLyBzZXR0bGVkIGxheW91dC4gSGVscHMgYW4gTExNIG5vdCBhbmNob3Igb24gdmFsdWVzIHRoYXQgd29uJ3QgcmVwZWF0LlxuY29uc3QgaGFzQWN0aXZlQW5pbWF0aW9uID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IGZuID0gKGVsIGFzIGFueSkuZ2V0QW5pbWF0aW9ucztcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuICB0cnkge1xuICAgIGNvbnN0IGFuaW1hdGlvbnMgPSBmbi5jYWxsKGVsKSBhcyBBcnJheTx7cGxheVN0YXRlPzogc3RyaW5nfT47XG4gICAgZm9yIChjb25zdCBhIG9mIGFuaW1hdGlvbnMpIHtcbiAgICAgIGlmIChhPy5wbGF5U3RhdGUgPT09ICdydW5uaW5nJykgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gUHJvZHVjdGlvbiBidWlsZHMgbWluaWZ5IGNvbXBvbmVudCBjb25zdHJ1Y3RvciBuYW1lcyB0byAxLTMgY2hhcnNcbi8vIChgQmRgLCBgS2VgLCBgcWFgLCBgJGRgLCBgZThgKS4gVGhlIHN0cmluZyBjYXJyaWVzIHplcm8gc2VtYW50aWNcbi8vIGluZm9ybWF0aW9uIHRvIGFuIExMTSDigJQgaXQncyBqdXN0IG1pbmlmaWVyIG91dHB1dC4gV2UgdHJlYXQgc3VjaCBuYW1lc1xuLy8gYXMgbWlzc2luZyBhbmQgZmFsbCB0aHJvdWdoIHRvIHRoZSBkaXNwbGF5TmFtZSBwYXRoIChvciBkcm9wIHRoZVxuLy8gYGNvbXBvbmVudGAgZmllbGQgZW50aXJlbHkgd2hlbiBuZWl0aGVyIHN1cnZpdmVzIHRoZSBtaW5pZmllcikuXG4vL1xuLy8gSmF2YVNjcmlwdCBpZGVudGlmaWVyLXN0YXJ0IGNoYXJzIGluY2x1ZGUgYCRgIGFuZCBgX2A7IGlkZW50aWZpZXItY29udGludWVcbi8vIGFkZHMgZGlnaXRzLiBSZWFsIGNvbXBvbmVudCBuYW1lcyBhcmUgYWxtb3N0IGFsd2F5cyBjYW1lbENhc2UgLyBQYXNjYWxDYXNlXG4vLyB3b3JkcyDiiaU0IGNoYXJzIChgQnV0dG9uYCwgYFdlYXRoZXJDYXJkYCkuIEFueXRoaW5nIOKJpDMgY2hhcnMgdGhhdCB1c2VzIHRoZVxuLy8gbWluaWZpZXIgYWxwaGFiZXQgaXMgdHJlYXRlZCBhcyBqdW5rLlxuY29uc3QgTUlOSUZJRURfTkFNRV9SRSA9IC9eW0EtWmEteiRfXVtBLVphLXowLTkkX117MCwyfSQvO1xuY29uc3QgQlVORExFUl9TQ0FGRk9MRF9OQU1FUyA9IG5ldyBTZXQoW1xuICAnQW5vbnltb3VzJywgJ2Fub255bW91cycsICdkZWZhdWx0JywgJ19kZWZhdWx0JyxcbiAgLy8gVnVlIFNGQyBjb21waWxlciBzdGFtcHMgZXZlcnkgYDxzY3JpcHQgc2V0dXA+YCBkZWZhdWx0IGV4cG9ydCB3aXRoIHRoaXNcbiAgLy8gc2VudGluZWwgd2hlbiBubyBleHBsaWNpdCBgbmFtZWAgaXMgc2V0IOKAlCBzZW1hbnRpY2FsbHkgZW1wdHkuXG4gICdfc2ZjX21haW4nLCAnc2ZjX21haW4nLFxuXSk7XG5jb25zdCBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lID0gKG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IHtcbiAgaWYgKCFuYW1lKSByZXR1cm4gZmFsc2U7XG4gIGlmIChCVU5ETEVSX1NDQUZGT0xEX05BTUVTLmhhcyhuYW1lKSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoTUlOSUZJRURfTkFNRV9SRS50ZXN0KG5hbWUpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gLS0tLSBSZWFjdCAvIFZ1ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCByZWFjdEluZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PiB7XG4gIGNvbnN0IHJlYWN0S2V5ID0gT2JqZWN0LmtleXMoZWwpLmZpbmQoKGspID0+XG4gICAgay5zdGFydHNXaXRoKCdfX3JlYWN0RmliZXIkJykgfHwgay5zdGFydHNXaXRoKCdfX3JlYWN0SW50ZXJuYWxJbnN0YW5jZSQnKSk7XG4gIGlmICghcmVhY3RLZXkpIHJldHVybiBudWxsO1xuICBsZXQgbm9kZTogYW55ID0gKGVsIGFzIGFueSlbcmVhY3RLZXldO1xuICBjb25zdCBzZWVuID0gbmV3IFNldDxhbnk+KCk7XG4gIGxldCByZXN1bHQ6IEZyYW1ld29ya0luZm8gfCBudWxsID0gbnVsbDtcbiAgd2hpbGUgKG5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmICFzZWVuLmhhcyhub2RlKSkge1xuICAgIHNlZW4uYWRkKG5vZGUpO1xuICAgIGNvbnN0IHR5cGUgPSBub2RlLnR5cGUgfHwgbm9kZS5lbGVtZW50VHlwZTtcbiAgICBpZiAoIXJlc3VsdD8ubmFtZSAmJiB0eXBlICYmIHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgLy8gZGlzcGxheU5hbWUgaXMgZGV2ZWxvcGVyLXN1cHBsaWVkIChSZWFjdC5kaXNwbGF5TmFtZSwgZm9yd2FyZFJlZlxuICAgICAgLy8gd3JhcHBlciBuYW1lcykgYW5kIHN1cnZpdmVzIG1pbmlmaWNhdGlvbiB3aGVuIHNldCBleHBsaWNpdGx5LiBQcmVmZXJcbiAgICAgIC8vIGl0LiB0eXBlLm5hbWUgaXMgdGhlIGNvbnN0cnVjdG9yLm5hbWUgc3RyaW5nLCB3aGljaCBtaW5pZmllcyB0b1xuICAgICAgLy8ganVuayBsaWtlIFwiQmRcIiBpbiBwcm9kIGJ1aWxkcyDigJQgb25seSBhY2NlcHQgaXQgaWYgaXQgc3Vydml2ZXMgdGhlXG4gICAgICAvLyBtZWFuaW5nZnVsLW5hbWUgZmlsdGVyLlxuICAgICAgY29uc3QgZGlzcGxheSA9IHR5cGVvZiB0eXBlLmRpc3BsYXlOYW1lID09PSAnc3RyaW5nJyA/IHR5cGUuZGlzcGxheU5hbWUgOiBudWxsO1xuICAgICAgY29uc3QgY3Rvck5hbWUgPSB0eXBlb2YgdHlwZS5uYW1lID09PSAnc3RyaW5nJyA/IHR5cGUubmFtZSA6IG51bGw7XG4gICAgICBjb25zdCBjYW5kID0gaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShkaXNwbGF5KVxuICAgICAgICA/IGRpc3BsYXkhXG4gICAgICAgIDogaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShjdG9yTmFtZSkgPyBjdG9yTmFtZSEgOiBudWxsO1xuICAgICAgaWYgKGNhbmQpIHtcbiAgICAgICAgcmVzdWx0ID0ge2ZyYW1ld29yazogJ3JlYWN0JywgbmFtZTogdHJpbVRleHQoY2FuZCwgMTIwKX07XG4gICAgICAgIGlmIChkaXNwbGF5ICYmIGRpc3BsYXkgIT09IGNhbmQpIHtcbiAgICAgICAgICByZXN1bHQuZGlzcGxheU5hbWUgPSB0cmltVGV4dChkaXNwbGF5LCAxODApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZXN1bHQgJiYgIXJlc3VsdC5zb3VyY2UgJiYgbm9kZS5fZGVidWdTb3VyY2UpIHtcbiAgICAgIHJlc3VsdC5zb3VyY2UgPSB7XG4gICAgICAgIGZpbGU6IG5vZGUuX2RlYnVnU291cmNlLmZpbGVOYW1lIHx8IG5vZGUuX2RlYnVnU291cmNlLmZpbGUgfHwgbnVsbCxcbiAgICAgICAgbGluZTogbm9kZS5fZGVidWdTb3VyY2UubGluZU51bWJlciB8fCBub2RlLl9kZWJ1Z1NvdXJjZS5saW5lIHx8IG51bGwsXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobm9kZS5fZGVidWdPd25lcikgeyBub2RlID0gbm9kZS5fZGVidWdPd25lcjsgY29udGludWU7IH1cbiAgICBpZiAobm9kZS5yZXR1cm4pIHsgbm9kZSA9IG5vZGUucmV0dXJuOyBjb250aW51ZTsgfVxuICAgIGJyZWFrO1xuICB9XG4gIC8vIE5vIHVzYWJsZSBuYW1lIOKGkiBlbWl0IG5vdGhpbmcgcmF0aGVyIHRoYW4gYHtmcmFtZXdvcms6XCJyZWFjdFwifWAgd2l0aCBhXG4gIC8vIG15c3RlcnkgMi1jaGFyIG5hbWUuIEFuIExMTSByZWFkaW5nIHRoZSBleHBvcnQgbGVhcm5zIG5vdGhpbmcgZnJvbVxuICAvLyBlaXRoZXIgc2hhcGU7IHN1cHByZXNzaW5nIGtlZXBzIHRoZSByb3cgaG9uZXN0LlxuICBpZiAoIXJlc3VsdD8ubmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gV2FsayB0aGUgZmliZXIgY2hhaW4gdG8gY29sbGVjdCBhbmNlc3RvciBjb21wb25lbnQgbmFtZXMuIFRoZVxuICAvLyBgX2RlYnVnT3duZXJgIHBhdGggaXMgbW9yZSBtZWFuaW5nZnVsIHRoYW4gYHJldHVybmAgKGl0IHNraXBzIGhvc3RcbiAgLy8gd3JhcHBlcnMpLCBidXQgd2UgZmFsbCBiYWNrIHRvIGByZXR1cm5gIHdoZW4gb3duZXIgZGF0YSBpc1xuICAvLyB1bmF2YWlsYWJsZSAocHJvZHVjdGlvbiBidWlsZHMpLiBDYXAgYXQgOCBhbmNlc3RvcnMgc28gdGhlIGZpZWxkXG4gIC8vIGRvZXNuJ3QgYmFsbG9vbiBmb3IgZGVlcGx5LW5lc3RlZCBhcHBzLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3Qgc2VlbkNoYWluID0gbmV3IFNldDxhbnk+KCk7XG4gIGxldCB3YWxrZXI6IGFueSA9IChlbCBhcyBhbnkpW3JlYWN0S2V5XTtcbiAgd2hpbGUgKHdhbGtlciAmJiB0eXBlb2Ygd2Fsa2VyID09PSAnb2JqZWN0JyAmJiAhc2VlbkNoYWluLmhhcyh3YWxrZXIpICYmIGNoYWluLmxlbmd0aCA8IDgpIHtcbiAgICBzZWVuQ2hhaW4uYWRkKHdhbGtlcik7XG4gICAgY29uc3QgdCA9IHdhbGtlci50eXBlIHx8IHdhbGtlci5lbGVtZW50VHlwZTtcbiAgICBpZiAodCAmJiB0eXBlb2YgdCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IG4gPSAodHlwZW9mIHQuZGlzcGxheU5hbWUgPT09ICdzdHJpbmcnICYmIGlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUodC5kaXNwbGF5TmFtZSkpXG4gICAgICAgID8gdC5kaXNwbGF5TmFtZVxuICAgICAgICA6ICh0eXBlb2YgdC5uYW1lID09PSAnc3RyaW5nJyAmJiBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKHQubmFtZSkpXG4gICAgICAgICAgPyB0Lm5hbWVcbiAgICAgICAgICA6IG51bGw7XG4gICAgICBpZiAobiAmJiAoY2hhaW4ubGVuZ3RoID09PSAwIHx8IGNoYWluW2NoYWluLmxlbmd0aCAtIDFdICE9PSBuKSkgY2hhaW4ucHVzaChuKTtcbiAgICB9XG4gICAgd2Fsa2VyID0gd2Fsa2VyLl9kZWJ1Z093bmVyID8/IHdhbGtlci5yZXR1cm47XG4gIH1cbiAgaWYgKGNoYWluLmxlbmd0aCA+IDApIHJlc3VsdC5jaGFpbiA9IGNoYWluO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgdnVlSW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgY29uc3QgdjogYW55ID0gKGVsIGFzIGFueSk/Ll9fdnVlUGFyZW50Q29tcG9uZW50IHx8IChlbCBhcyBhbnkpPy5fX3Z1ZV9hcHBfXz8uX2luc3RhbmNlIHx8XG4gICAgKGVsIGFzIGFueSk/Ll9fdm5vZGU/LmNvbXBvbmVudCB8fCAoZWwgYXMgYW55KT8uX192dWVfXztcbiAgY29uc3QgdHlwZSA9IHY/LnR5cGUgfHwgdj8uY3R4Py50eXBlO1xuICAvLyB0eXBlLm5hbWUgaXMgZGV2ZWxvcGVyLXNldCB2aWEgYG5hbWU6ICdNeUNvbXAnYDsgdHlwZS5fX25hbWUgaXNcbiAgLy8gcG9wdWxhdGVkIGJ5IGA8c2NyaXB0IHNldHVwPmAgYW5kIHRvb2xzIHRoYXQgaW5mZXIgdGhlIGZpbGVuYW1lLiBCb3RoXG4gIC8vIGFyZSByZWFsIG5hbWVzIGluIGRldjsgcHJvZCBidWlsZHMgY2FuIGxlYXZlIG9ubHkgYSBtaW5pZmllZCBnbHlwaC5cbiAgY29uc3QgcmF3TmFtZSA9IHR5cGU/Lm5hbWUgfHwgdHlwZT8uX19uYW1lO1xuICBpZiAoIWlzTWVhbmluZ2Z1bENvbXBvbmVudE5hbWUocmF3TmFtZSkpIHJldHVybiBudWxsO1xuICBjb25zdCByZXN1bHQ6IEZyYW1ld29ya0luZm8gPSB7XG4gICAgZnJhbWV3b3JrOiAndnVlJyxcbiAgICBuYW1lOiB0cmltVGV4dChyYXdOYW1lLCAxNjApLFxuICAgIHNvdXJjZToge2ZpbGU6IHR5cGU/Ll9fZmlsZSB8fCBudWxsfSxcbiAgfTtcbiAgLy8gV2FsayB0aGUgcGFyZW50LWNvbXBvbmVudCBjaGFpbi5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGxldCBjdXI6IGFueSA9IHY7XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PGFueT4oKTtcbiAgd2hpbGUgKGN1ciAmJiB0eXBlb2YgY3VyID09PSAnb2JqZWN0JyAmJiAhc2Vlbi5oYXMoY3VyKSAmJiBjaGFpbi5sZW5ndGggPCA4KSB7XG4gICAgc2Vlbi5hZGQoY3VyKTtcbiAgICBjb25zdCB0ID0gY3VyLnR5cGUgfHwgY3VyLmN0eD8udHlwZTtcbiAgICBjb25zdCBuID0gdD8ubmFtZSA/PyB0Py5fX25hbWU7XG4gICAgaWYgKHR5cGVvZiBuID09PSAnc3RyaW5nJyAmJiBpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKG4pKSB7XG4gICAgICBpZiAoY2hhaW4ubGVuZ3RoID09PSAwIHx8IGNoYWluW2NoYWluLmxlbmd0aCAtIDFdICE9PSBuKSBjaGFpbi5wdXNoKG4pO1xuICAgIH1cbiAgICBjdXIgPSBjdXIucGFyZW50O1xuICB9XG4gIGlmIChjaGFpbi5sZW5ndGggPiAwKSByZXN1bHQuY2hhaW4gPSBjaGFpbjtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIExpdCAobGl0LWVsZW1lbnQpIOKAlCBpbnN0YW5jZXMgYXJlIGN1c3RvbSBlbGVtZW50cyB3aG9zZSBjb25zdHJ1Y3RvclxuLy8gY2FycmllcyBgXyRsaXRFbGVtZW50JGAsIGBlbGVtZW50UHJvcGVydGllc2AsIG9yIGBzdHlsZXNgLiBUaGUgdGFnIGlzXG4vLyB0aGUgY29tcG9uZW50J3MgaWRlbnRpdHk7IHRoZSBjb25zdHJ1Y3RvciBuYW1lIGlzIHRoZSBkZXZlbG9wZXItZmFjaW5nXG4vLyBjbGFzcyBuYW1lIHdoZW4gcHJvdmlkZWQuXG5jb25zdCBsaXRJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT4ge1xuICBpZiAoIWVsLnRhZ05hbWUuaW5jbHVkZXMoJy0nKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGN0b3I6IGFueSA9IGVsLmNvbnN0cnVjdG9yO1xuICBpZiAoIWN0b3IpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0xpdCA9IEJvb2xlYW4oXG4gICAgY3Rvci5fJGxpdEVsZW1lbnQkIHx8XG4gICAgY3Rvci5lbGVtZW50UHJvcGVydGllcyB8fFxuICAgIGN0b3IuXyRsaXRFbGVtZW50VmVyc2lvbiQgfHxcbiAgICAoY3Rvci5zdHlsZXMgJiYgQXJyYXkuaXNBcnJheShjdG9yLnN0eWxlcykpLFxuICApO1xuICBpZiAoIWlzTGl0KSByZXR1cm4gbnVsbDtcbiAgLy8gY3Rvci5uYW1lIGluIHByb2QgaXMgYSAyLWNoYXIgbWluaWZpZXIgZ2x5cGguIFRoZSB0YWcgaXMgdGhlXG4gIC8vIGRldmVsb3Blci1mYWNpbmcgaWRlbnRpdHkgZm9yIGFueSBjdXN0b20gZWxlbWVudCDigJQgdXNlIGl0IGFzIHRoZVxuICAvLyBjYW5vbmljYWwgbmFtZSB3aGVuIGN0b3IubmFtZSBpcyBtaW5pZmllZCBhd2F5LlxuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGN0b3JOYW1lID0gdHlwZW9mIGN0b3IubmFtZSA9PT0gJ3N0cmluZycgPyBjdG9yLm5hbWUgOiBudWxsO1xuICBjb25zdCBuYW1lID0gaXNNZWFuaW5nZnVsQ29tcG9uZW50TmFtZShjdG9yTmFtZSkgPyBjdG9yTmFtZSEgOiB0YWc7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnbGl0JyxcbiAgICBuYW1lOiB0cmltVGV4dChuYW1lLCAxMjApLFxuICAgIGRpc3BsYXlOYW1lOiB0YWcsXG4gIH07XG59O1xuXG4vLyBTdGVuY2lsIGNvbXBvbmVudHMg4oCUIGN1c3RvbSBlbGVtZW50cyB3aG9zZSBjb25zdHJ1Y3RvciBleHBvc2VzIGFcbi8vIHN0YXRpYyBgaXNgICh0aGUgdGFnKSwgYW5kIHdoaWNoIGNhcnJ5IHN0ZW5jaWwtaW50ZXJuYWwgcHJvcHMgb24gdGhlXG4vLyBob3N0IChgX19ob3N0Q3NzYCwgYHMtaWRgLCBgX19zdGVuY2lsX3N1YnNjcmliZXJJZGAsIGV0YykuXG5jb25zdCBzdGVuY2lsSW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgaWYgKCFlbC50YWdOYW1lLmluY2x1ZGVzKCctJykpIHJldHVybiBudWxsO1xuICBjb25zdCBjdG9yOiBhbnkgPSBlbC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCFjdG9yKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbG9va3NTdGVuY2lsID0gQm9vbGVhbihcbiAgICB0eXBlb2YgY3Rvci5pcyA9PT0gJ3N0cmluZycgJiYgY3Rvci5pcy5pbmNsdWRlcygnLScpIHx8XG4gICAgKGVsIGFzIGFueSkuX19ob3N0Q3NzICE9PSB1bmRlZmluZWQgfHxcbiAgICAoZWwgYXMgYW55KS5fX3N0ZW5jaWxfc3Vic2NyaWJlcklkICE9PSB1bmRlZmluZWQgfHxcbiAgICBlbC5oYXNBdHRyaWJ1dGUoJ3MtaWQnKSxcbiAgKTtcbiAgaWYgKCFsb29rc1N0ZW5jaWwpIHJldHVybiBudWxsO1xuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIC8vIGBjdG9yLmlzYCBpcyB0aGUgU3RlbmNpbC1zdGF0aWMgdGFnIGRlY2xhcmF0aW9uIChhbHdheXMgcHJlc2VudCwgYWx3YXlzXG4gIC8vIG1lYW5pbmdmdWwpLiBgY3Rvci5uYW1lYCBpcyB0aGUgbWluaWZpZWQgY2xhc3MgbmFtZSBpbiBwcm9kLiBGYWxsIGJhY2tcbiAgLy8gdGhyb3VnaCB0aGUgc2FtZSBtZWFuaW5nZnVsbmVzcyBmaWx0ZXIgYXMgdGhlIG90aGVyIGZyYW1ld29ya3MuXG4gIGNvbnN0IGlzRmllbGQgPSB0eXBlb2YgY3Rvci5pcyA9PT0gJ3N0cmluZycgPyBjdG9yLmlzIDogbnVsbDtcbiAgY29uc3QgY3Rvck5hbWUgPSB0eXBlb2YgY3Rvci5uYW1lID09PSAnc3RyaW5nJyA/IGN0b3IubmFtZSA6IG51bGw7XG4gIGNvbnN0IG5hbWUgPSBpc0ZpZWxkIHx8IChpc01lYW5pbmdmdWxDb21wb25lbnROYW1lKGN0b3JOYW1lKSA/IGN0b3JOYW1lISA6IHRhZyk7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnc3RlbmNpbCcsXG4gICAgbmFtZTogdHJpbVRleHQobmFtZSwgMTIwKSxcbiAgICBkaXNwbGF5TmFtZTogdGFnLFxuICB9O1xufTtcblxuLy8gU3ZlbHRlIOKAlCBydW50aW1lIGluc3RhbmNlIGxvb2t1cCBpcyBzcGFyc2UsIGJ1dCB0aGUgZGV2LW1vZGVcbi8vIGNvbXBpbGVyIGF0dGFjaGVzIGBfX3N2ZWx0ZV9tZXRhYCB0byBlbGVtZW50cyB3aXRoIHNvdXJjZS1sb2MgaW5mb1xuLy8gKGB7IGxvYzogeyBmaWxlLCBsaW5lLCBjaGFyIH0gfWApLiBJbiBwcm9kIHRoYXQgcHJvcGVydHkgaXMgYWJzZW50LFxuLy8gc28gZGV0ZWN0aW9uIHNpbGVudGx5IGZhbGxzIHRocm91Z2guXG5jb25zdCBzdmVsdGVJbmZvID0gKGVsOiBFbGVtZW50KTogRnJhbWV3b3JrSW5mbyB8IG51bGwgPT4ge1xuICBjb25zdCBtZXRhOiBhbnkgPSAoZWwgYXMgYW55KS5fX3N2ZWx0ZV9tZXRhO1xuICBpZiAoIW1ldGE/LmxvYykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGZpbGUgPSB0eXBlb2YgbWV0YS5sb2MuZmlsZSA9PT0gJ3N0cmluZycgPyBtZXRhLmxvYy5maWxlIDogbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBmcmFtZXdvcms6ICdzdmVsdGUnLFxuICAgIG5hbWU6IHRyaW1UZXh0KGZpbGUgPz8gJ3N2ZWx0ZS1jb21wb25lbnQnLCAxNjApLFxuICAgIHNvdXJjZToge1xuICAgICAgZmlsZSxcbiAgICAgIGxpbmU6IHR5cGVvZiBtZXRhLmxvYy5saW5lID09PSAnbnVtYmVyJyA/IG1ldGEubG9jLmxpbmUgOiBudWxsLFxuICAgIH0sXG4gIH07XG59O1xuXG4vLyBHZW5lcmljIHdlYi1jb21wb25lbnQgZmFsbGJhY2sg4oCUIHdoZW4gdGhlIGVsZW1lbnQgaGFzIGEgY3VzdG9tLWVsZW1lbnRcbi8vIHRhZyAoa2ViYWItY2FzZSkgYW5kIGBjdXN0b21FbGVtZW50cy5nZXQoLi4uKWAgcmVjb2duaXplcyBpdCwgYnV0IG5vXG4vLyBmcmFtZXdvcmstc3BlY2lmaWMgbWFya2VyIG1hdGNoZWQuIENhcHR1cmVzIHRoZSB0YWcgYXMgdGhlIGlkZW50aXR5LlxuY29uc3Qgd2ViQ29tcG9uZW50SW5mbyA9IChlbDogRWxlbWVudCk6IEZyYW1ld29ya0luZm8gfCBudWxsID0+IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIXRhZy5pbmNsdWRlcygnLScpKSByZXR1cm4gbnVsbDtcbiAgdHJ5IHtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUVsZW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiBjdXN0b21FbGVtZW50cy5nZXQodGFnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZnJhbWV3b3JrOiAnd2ViLWNvbXBvbmVudCcsXG4gICAgICAgIG5hbWU6IHRhZyxcbiAgICAgICAgZGlzcGxheU5hbWU6IHRhZyxcbiAgICAgIH07XG4gICAgfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyBQbHVnLWluIHN0eWxlOiB0cnkgUmVhY3QgZmlyc3QgKG1vc3QgY29tbW9uIGluIG91ciBjYXB0dXJlZCBhcHBzKSxcbi8vIHRoZW4gVnVlLCB0aGVuIExpdCAvIFN0ZW5jaWwgLyBTdmVsdGUgLyBnZW5lcmljIHdlYi1jb21wb25lbnQuIEZpcnN0XG4vLyByZXNvbHZlciB0byByZXR1cm4gbm9uLW51bGwgd2lucy5cbmNvbnN0IGZyYW1ld29ya0luZm8gPSAoZWw6IEVsZW1lbnQpOiBGcmFtZXdvcmtJbmZvIHwgbnVsbCA9PlxuICByZWFjdEluZm8oZWwpIHx8IHZ1ZUluZm8oZWwpIHx8IGxpdEluZm8oZWwpIHx8IHN0ZW5jaWxJbmZvKGVsKSB8fCBzdmVsdGVJbmZvKGVsKSB8fCB3ZWJDb21wb25lbnRJbmZvKGVsKTtcblxuLy8gLS0tLSBDYXB0dXJlOiBhc3NlbWJsZSB0aGUgZnVsbCBlbnRyeSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU3RyaXAgdGhlIGJvZHkgb2YgbG9uZyBgZGF0YTpgIFVSSXMgKFBsYXNtaWMncyBhc3BlY3QtcmF0aW8gU1ZHIHNwYWNlcnMsXG4vLyBpbmxpbmVkIFBORy9KUEVHIGZhbGxiYWNrcykgc2luY2UgdGhlIGJhc2U2NCBwYXlsb2FkIGlzIG1lY2hhbmlzbSwgbm90XG4vLyBzaWduYWwuIEtlZXAgdGhlIHNjaGVtZSArIGEgbGVuZ3RoIGhpbnQgc28gYW4gTExNIGNhbiB0ZWxsIHNvbWV0aGluZ1xuLy8gd2FzIGVsaWRlZC5cbmNvbnN0IGVsaWRlRGF0YVVyaXMgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWwucmVwbGFjZSgvZGF0YTooW1xcdy8rLi1dKyk7YmFzZTY0LChbQS1aYS16MC05Ky89XXs2MCx9KS9nLFxuICAgIChfbSwgbWltZTogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpID0+XG4gICAgICBgZGF0YToke21pbWV9O2Jhc2U2NCxbJHtwYXlsb2FkLmxlbmd0aH0tY2hhciBiYXNlNjQgZWxpZGVkXWApO1xuXG4vLyBSZXBsYWNlIGlubGluZSBpY29uIFNWR3Mgd2l0aCBwbGFjZWhvbGRlcnMuIFRoZSBwYXRoIGRhdGEgb2YgYVxuLy8gTHVjaWRlL0hlcm9pY29uIHJlZnJlc2ggaWNvbiBpcyB+MjgwIGJ5dGVzIHRoYXQgYW4gTExNIGRvZXNuJ3QgbmVlZCDigJRcbi8vIHRoZSBzdXJyb3VuZGluZyBidXR0b24gY2FwdGlvbiBhbHJlYWR5IHRlbGxzIGl0IHdoYXQgdGhlIGljb24gbWVhbnMuXG4vL1xuLy8gQSBzdHJpcHBlZC1kb3duIGA8c3ZnLz5gIGxvc2VzIGljb24gaWRlbnRpdHkgKHdoaWNoIGx1Y2lkZS9mZWF0aGVyL1xuLy8gaGVyb2ljb24gd2FzIHVzZWQ/IHdoYXQgYXJpYS1sYWJlbCBkZXNjcmliZWQgaXQ/IHdoYXQgY2xhc3MgZGlkIGl0XG4vLyBjYXJyeT8pLiBXZSBwcmVzZXJ2ZSBldmVyeSBzaWduYWwgdGhhdCBoZWxwcyBhIHJlcGFpciBhZ2VudCBsb2NhdGVcbi8vIHRoZSBpY29uIGRlZmluaXRpb24gd2l0aG91dCBrZWVwaW5nIHRoZSBwYXRoIGRhdGE6XG4vLyAgIOKAoiBhcmlhLWxhYmVsLCByb2xlLCB0aXRsZSAgICAgICAgIOKAlCBhY2Nlc3NpYmxlIGlkZW50aXR5XG4vLyAgIOKAoiBkYXRhLWljb24sIGRhdGEtbHVjaWRlLCBkYXRhLSogIOKAlCBjb21tb24gaWNvbi1saWJyYXJ5IGhpbnRzXG4vLyAgIOKAoiBjbGFzcyAgICAgICAgICAgICAgICAgICAgICAgICAgICDigJQgc3R5bGUgaG9va3MgKGAuaWNvbi10cmFzaC0yYClcbi8vICAg4oCiIHdpZHRoLCBoZWlnaHQgICAgICAgICAgICAgICAgICAgIOKAlCByZW5kZXJlZCBzaXplXG4vLyAgIOKAoiB2aWV3Qm94ICAgICAgICAgICAgICAgICAgICAgICAgICDigJQgY29vcmRpbmF0ZSBzeXN0ZW0gKGhlbHBzXG4vLyAgICAgbWF0Y2ggYWdhaW5zdCBhIGtub3duIGljb24gbGlicmFyeSBieSBhc3BlY3QgcmF0aW8pXG4vLyAgIOKAoiA8dGl0bGU+LzxkZXNjPiBmaXJzdC1jaGlsZCB0ZXh0IOKAlCBBUklBLXJlY29tbWVuZGVkIGExMXkgY2hpbGRyZW5cbmNvbnN0IFBSRVNFUlZFRF9TVkdfQVRUUl9QUkVGSVhFUyA9IFsnZGF0YS0nLCAnYXJpYS0nXTtcbmNvbnN0IFBSRVNFUlZFRF9TVkdfQVRUUlMgPSBuZXcgU2V0KFsncm9sZScsICdjbGFzcycsICd3aWR0aCcsICdoZWlnaHQnLCAndmlld0JveCcsICd0aXRsZScsICduYW1lJywgJ2ZpbGwnXSk7XG5jb25zdCBlbGlkZUlubGluZVN2Z3MgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWwucmVwbGFjZSgvPHN2Z1xcYihbXj5dKik+KFtcXHNcXFNdKj8pPFxcL3N2Zz4vZywgKF9tLCBhdHRyczogc3RyaW5nLCBib2R5OiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgLy8gUGx1Y2sgZXZlcnkgcHJlc2VydmVkIGF0dHJpYnV0ZSBieSByZWdleCBvdmVyIHRoZSByYXcgYXR0cnMgc3RyaW5nLlxuICAgIC8vIFRoZSByZWdleCB0b2xlcmF0ZXMgdW5xdW90ZWQgdmFsdWVzICsgZG91YmxlICsgc2luZ2xlIHF1b3Rlcy5cbiAgICBjb25zdCBhdHRyUmUgPSAvKFtcXHc6LV0rKVxccyo9XFxzKig/OlwiKFteXCJdKilcInwnKFteJ10qKSd8KFxcUyspKS9nO1xuICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICAgIHdoaWxlICgobSA9IGF0dHJSZS5leGVjKGF0dHJzKSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBtWzFdITtcbiAgICAgIGNvbnN0IHYgPSBtWzJdID8/IG1bM10gPz8gbVs0XSA/PyAnJztcbiAgICAgIGNvbnN0IGtlZXAgPSBQUkVTRVJWRURfU1ZHX0FUVFJTLmhhcyhuYW1lKSB8fCBQUkVTRVJWRURfU1ZHX0FUVFJfUFJFRklYRVMuc29tZSgocCkgPT4gbmFtZS5zdGFydHNXaXRoKHApKTtcbiAgICAgIGlmIChrZWVwKSBvdXQucHVzaChgJHtuYW1lfT1cIiR7di5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyl9XCJgKTtcbiAgICB9XG4gICAgLy8gU3VyZmFjZSBpbm5lciA8dGl0bGU+LzxkZXNjPiB0ZXh0IOKAlCBBUklBLXJlY29tbWVuZGVkIHdheSB0byBsYWJlbFxuICAgIC8vIGFuIFNWRywgYW5kIG9mdGVuIHRoZSBvbmx5IHNpZ25hbCBvZiBpY29uIG1lYW5pbmcgd2hlbiBubyBhcmlhXG4gICAgLy8gYXR0cmlidXRlcyBhcmUgc2V0IG9uIHRoZSBob3N0LlxuICAgIGNvbnN0IHRpdGxlVGV4dCA9IC88dGl0bGVbXj5dKj4oW1xcc1xcU10qPyk8XFwvdGl0bGU+Ly5leGVjKGJvZHkpPy5bMV0/LnRyaW0oKTtcbiAgICBpZiAodGl0bGVUZXh0KSBvdXQucHVzaChgZGF0YS1wZy1zdmctdGl0bGU9XCIke3RpdGxlVGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyl9XCJgKTtcbiAgICBjb25zdCBkZXNjVGV4dCA9IC88ZGVzY1tePl0qPihbXFxzXFxTXSo/KTxcXC9kZXNjPi8uZXhlYyhib2R5KT8uWzFdPy50cmltKCk7XG4gICAgaWYgKGRlc2NUZXh0KSBvdXQucHVzaChgZGF0YS1wZy1zdmctZGVzYz1cIiR7ZGVzY1RleHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpfVwiYCk7XG4gICAgb3V0LnB1c2goJ2RhdGEtcGctZWxpZGVkPVwic3ZnXCInKTtcbiAgICByZXR1cm4gYDxzdmcgJHtvdXQuam9pbignICcpfS8+YDtcbiAgfSk7XG5cbi8vIGA8c2NyaXB0PmAgY29udGVudCBjYW4gY2FycnkgYm9vdHN0cmFwIGRhdGEgKGB3aW5kb3cuX19BUFBfREFUQV9fID1cbi8vIHt0b2tlbjogXCIuLi5cIn1gKSwgQVBJIGtleXMsIHZlbmRvciBhbmFseXRpY3Mga2V5cywgYW5kIGJhY2tlbmQgVVJMcy5cbi8vIGA8c3R5bGU+YCBjb250ZW50IGlzIHVzdWFsbHkgaXJyZWxldmFudCBub2lzZS4gYDxtZXRhPmAgZWxlbWVudHMgb2Z0ZW5cbi8vIGNhcnJ5IENTUkYvQ1NQIHRva2Vucy4gU3RyaXAgdGhlIGlubmVyIGNvbnRlbnRzIG9mIGFsbCB0aHJlZS5cbmNvbnN0IHN0cmlwRGFuZ2Vyb3VzRWxlbWVudHMgPSAoaHRtbDogc3RyaW5nKTogc3RyaW5nID0+XG4gIGh0bWxcbiAgICAucmVwbGFjZSgvPHNjcmlwdFxcYltePl0qPltcXHNcXFNdKj88XFwvXFxzKnNjcmlwdCg/Olxcc1tePl0qKT8+L2dpLCAnPHNjcmlwdCBkYXRhLXBnLWVsaWRlZD1cInNjcmlwdC1jb250ZW50XCIvPicpXG4gICAgLnJlcGxhY2UoLzxzdHlsZVxcYltePl0qPltcXHNcXFNdKj88XFwvXFxzKnN0eWxlXFxzKj4vZ2ksICc8c3R5bGUgZGF0YS1wZy1lbGlkZWQ9XCJzdHlsZS1jb250ZW50XCIvPicpXG4gICAgLnJlcGxhY2UoLzxtZXRhXFxiW14+XSpcXGJjb250ZW50PVwiW15cIl0qXCJbXj5dKj4vZ2ksIChtKSA9PiB7XG4gICAgICAvLyBLZWVwIG1ldGEgbmFtZS9jaGFyc2V0IHZpc2libGUgYnV0IHJlZGFjdCBgY29udGVudGAgaWYgdGhlIG5hbWVcbiAgICAgIC8vIGxvb2tzIHRva2VuLWJlYXJpbmcuXG4gICAgICBjb25zdCBuYW1lTWF0Y2ggPSAvXFxibmFtZT1cIihbXlwiXSopXCIvLmV4ZWMobSk7XG4gICAgICBjb25zdCBuYW1lID0gbmFtZU1hdGNoPy5bMV0gPz8gJyc7XG4gICAgICBpZiAoLyhjc3JmfHRva2VufHhzcmZ8bm9uY2V8YXBpW18tXT9rZXkpL2kudGVzdChuYW1lKSkge1xuICAgICAgICByZXR1cm4gbS5yZXBsYWNlKC9cXGJjb250ZW50PVwiW15cIl0qXCIvLCAnY29udGVudD1cIltyZWRhY3RlZDogbWV0YS10b2tlbl1cIicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbi8vIENhcCBvdXRlckhUTUwgdG8gYSBjbG9uZSBvZiB0aGUgbGl2ZSBlbGVtZW50IHdpdGggZGVzY2VuZGFudHMgYmV5b25kXG4vLyBgbWF4RGVwdGhgIGxldmVscyByZXBsYWNlZCBieSBgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gIG1hcmtlcnMuIFRoZVxuLy8gcm9hc3QgY2FsbGVkIG91dCBhIHNpbmdsZSBncm91cGVkIGNhcHR1cmUgY29taW5nIGJhY2sgYXQgMjUgS0IgYmVjYXVzZVxuLy8gdGhlIGBvdXRlckhUTUxgIHN3YWxsb3dlZCA2MCBzcGFya2xpbmUgZGF0YSBzcGFucyDigJQgZXhhY3RseSB3aGF0IGFcbi8vIGRlcHRoIGNhcCBzb2x2ZXMgYXQgdGhlIHNvdXJjZS4gUmV0dXJucyB0aGUgY2xvbmVkIG91dGVySFRNTCBhbmQgaG93XG4vLyBtYW55IGRlc2NlbmRhbnQgc3VidHJlZXMgd2VyZSBlbGlkZWQuXG4vLyBTZXJpYWxpemUgYW4gZWxlbWVudCdzIHNoYWRvd1Jvb3QgY29udGVudCBhcyBgPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPVwi4oCmXCI+4oCmPC90ZW1wbGF0ZT5gLlxuLy8gYGNsb25lTm9kZSh0cnVlKWAgZG9lcyBOT1QgaW5jbHVkZSBzaGFkb3cgRE9NLCBzbyBjYXB0dXJlcyBvZiBjdXN0b20tZWxlbWVudFxuLy8gaG9zdHMgKExpdCdzIGA8Zm9yZWNhc3QtaXRlbT5gLCBTdGVuY2lsIGNvbXBvbmVudHMsIGdlbmVyaWMgd2ViLWNvbXBvbmVudHMpXG4vLyB3b3VsZCBvdGhlcndpc2UgY29tZSBiYWNrIGFzIGA8Zm9yZWNhc3QtaXRlbT48L2ZvcmVjYXN0LWl0ZW0+YCDigJQgYW4gTExNXG4vLyByZWFkaW5nIHRoYXQgcm93IHNlZXMgbm90aGluZyBhYm91dCB3aGF0IHRoZSBob3N0IGFjdHVhbGx5IHJlbmRlcnMuIFdlIHVzZVxuLy8gdGhlIGRlY2xhcmF0aXZlLXNoYWRvdy1ET00gc2VyaWFsaXphdGlvbiBzaGFwZSBzbyB0aGUgTExNIChhbmQgYW55IHRvb2xpbmcpXG4vLyBjYW4gdGVsbCBzaGFkb3cgY29udGVudCBmcm9tIGxpZ2h0LURPTSBjaGlsZHJlbiwgQU5EIHNvIHRoZSBwYXlsb2FkIGlzXG4vLyByb3VuZC10cmlwcGFibGUgaW50byBhbm90aGVyIGJyb3dzZXIgaWYgYSBjb25zdW1lciB3YW50cyB0by5cbmNvbnN0IHNlcmlhbGl6ZVNoYWRvd0NvbnRlbnQgPSAoaG9zdDogRWxlbWVudCwgZGVwdGg6IG51bWJlciwgbWF4RGVwdGg6IG51bWJlciwgZWxpZGVkOiB7Y291bnQ6IG51bWJlcn0pOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgY29uc3Qgc3IgPSAoaG9zdCBhcyBhbnkpLnNoYWRvd1Jvb3QgYXMgU2hhZG93Um9vdCB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIGlmICghc3IpIHJldHVybiBudWxsO1xuICBjb25zdCBtb2RlID0gc3IubW9kZSB8fCAnb3Blbic7XG4gIC8vIENsb25lIGVhY2ggdG9wLWxldmVsIHNoYWRvdyBjaGlsZCBpbmRpdmlkdWFsbHkgc28gd2UgY2FuIGFwcGx5IHRoZSBzYW1lXG4gIC8vIGRlcHRoLWNhcCB3YWxrZXIgdG8gdGhlbS5cbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShzci5jaGlsZHJlbikpIHtcbiAgICBwYXJ0cy5wdXNoKHNlcmlhbGl6ZVdpdGhTaGFkb3coY2hpbGQsIGRlcHRoICsgMSwgbWF4RGVwdGgsIGVsaWRlZCkpO1xuICB9XG4gIHJldHVybiBgPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPVwiJHttb2RlfVwiPiR7cGFydHMuam9pbignJyl9PC90ZW1wbGF0ZT5gO1xufTtcblxuLy8gU2VyaWFsaXplIGFuIGVsZW1lbnQgKyBpdHMgc2hhZG93IGNvbnRlbnQgaW50byBIVE1MLCBhcHBseWluZyB0aGVcbi8vIGRlcHRoLWNhcCB3YWxrZXIgdW5pZm9ybWx5IHRvIGJvdGguIENhbGxlciBwYXNzZXMgYSBzaGFyZWQgYGVsaWRlZGBcbi8vIGNvdW50ZXIgc28gdGhlIGZpbmFsIGNvdW50IHJlZmxlY3RzIGFsbCBzdWJ0cmVlcyB3ZSBjb2xsYXBzZWQuXG5jb25zdCBzZXJpYWxpemVXaXRoU2hhZG93ID0gKGVsOiBFbGVtZW50LCBkZXB0aDogbnVtYmVyLCBtYXhEZXB0aDogbnVtYmVyLCBlbGlkZWQ6IHtjb3VudDogbnVtYmVyfSk6IHN0cmluZyA9PiB7XG4gIC8vIFJlY29uc3RydWN0IHRoZSBvcGVuIHRhZyBmcm9tIGF0dHJpYnV0ZXMgKGlubmVySFRNTCB3b3VsZCBiZSBjaGVhcGVyXG4gIC8vIGJ1dCB3ZSBjYW4ndCBjb21iaW5lIGl0IHdpdGggYSBtYW51YWxseS1zZXJpYWxpemVkIHNoYWRvdyByb290KS5cbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBhdHRyczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKGVsLmF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKSkge1xuICAgICAgLy8gRXNjYXBlIGF0dHJpYnV0ZSB2YWx1ZSdzIGRvdWJsZS1xdW90ZXMgYW5kIGFtcGVyc2FuZHMgc28gdGhlXG4gICAgICAvLyBwcm9kdWNlZCBIVE1MIHJvdW5kLXRyaXBzLlxuICAgICAgY29uc3QgdiA9IFN0cmluZyhhLnZhbHVlKS5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICAgIGF0dHJzLnB1c2goYCR7YS5uYW1lfT1cIiR7dn1cImApO1xuICAgIH1cbiAgfVxuICBjb25zdCBvcGVuID0gYDwke3RhZ30ke2F0dHJzLmxlbmd0aCA/ICcgJyArIGF0dHJzLmpvaW4oJyAnKSA6ICcnfT5gO1xuICAvLyBTZWxmLWNsb3Npbmcgdm9pZHMg4oCUIG1hdGNoIEhUTUwgc3BlYyBzZXJpYWxpemVyIGJlaGF2aW9yLlxuICBjb25zdCBWT0lEID0gbmV3IFNldChbJ2FyZWEnLCAnYmFzZScsICdicicsICdjb2wnLCAnZW1iZWQnLCAnaHInLCAnaW1nJywgJ2lucHV0JywgJ2xpbmsnLCAnbWV0YScsICdwYXJhbScsICdzb3VyY2UnLCAndHJhY2snLCAnd2JyJ10pO1xuICBpZiAoVk9JRC5oYXModGFnKSkgcmV0dXJuIG9wZW47XG5cbiAgY29uc3Qgc2hhZG93ID0gc2VyaWFsaXplU2hhZG93Q29udGVudChlbCwgZGVwdGgsIG1heERlcHRoLCBlbGlkZWQpO1xuXG4gIC8vIERlcHRoIGNhcCBraWNrcyBpbiBmb3IgdGhlIExJR0hULURPTSBjaGlsZHJlbiBvbmx5OyB0aGUgc2hhZG93IGNvbnRlbnRcbiAgLy8gYWxyZWFkeSBjb3VudHMgaXRzIG93biBkZXB0aCB2aWEgdGhlIHJlY3Vyc2l2ZSBjYWxsLlxuICBsZXQgbGlnaHRJbm5lcjogc3RyaW5nO1xuICBpZiAoZGVwdGggPj0gbWF4RGVwdGggJiYgZWwuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgY29uc3QgY291bnQgPSBlbC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgZWxpZGVkLmNvdW50ICs9IGNvdW50O1xuICAgIGxpZ2h0SW5uZXIgPSBgPCEtLSAke2NvdW50fSAke2NvdW50ID09PSAxID8gJ2NoaWxkJyA6ICdjaGlsZHJlbid9IGVsaWRlZCAtLT5gO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNlZ3M6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBub2RlIG9mIEFycmF5LmZyb20oZWwuY2hpbGROb2RlcykpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxIC8qIGVsZW1lbnQgKi8pIHtcbiAgICAgICAgc2Vncy5wdXNoKHNlcmlhbGl6ZVdpdGhTaGFkb3cobm9kZSBhcyBFbGVtZW50LCBkZXB0aCArIDEsIG1heERlcHRoLCBlbGlkZWQpKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAvKiB0ZXh0ICovKSB7XG4gICAgICAgIHNlZ3MucHVzaChTdHJpbmcobm9kZS5ub2RlVmFsdWUgPz8gJycpLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDggLyogY29tbWVudCAqLykge1xuICAgICAgICBzZWdzLnB1c2goYDwhLS0ke1N0cmluZyhub2RlLm5vZGVWYWx1ZSA/PyAnJyl9LS0+YCk7XG4gICAgICB9XG4gICAgfVxuICAgIGxpZ2h0SW5uZXIgPSBzZWdzLmpvaW4oJycpO1xuICB9XG4gIC8vIERlY2xhcmF0aXZlIHNoYWRvdyBET00gY29udmVudGlvbjogPHRlbXBsYXRlIHNoYWRvd3Jvb3Rtb2RlPiBzaXRzIGFzIHRoZVxuICAvLyBmaXJzdCBjaGlsZCBvZiB0aGUgaG9zdCdzIGNvbnRlbnQsIEJFRk9SRSBsaWdodC1ET00gY2hpbGRyZW4uIE1pcnJvcnNcbiAgLy8gdGhlIHNwZWMgc28gYW4gTExNIChvciBIVE1MIHBhcnNlcikgcmVhZGluZyB0aGlzIGtub3dzIHNoYWRvdyBmcm9tIGxpZ2h0LlxuICByZXR1cm4gYCR7b3Blbn0ke3NoYWRvdyA/PyAnJ30ke2xpZ2h0SW5uZXJ9PC8ke3RhZ30+YDtcbn07XG5cbmNvbnN0IGNhcHBlZE91dGVySFRNTCA9IChlbDogRWxlbWVudCwgbWF4RGVwdGggPSAyKToge2h0bWw6IHN0cmluZzsgZWxpZGVkOiBudW1iZXJ9ID0+IHtcbiAgLy8gRmFzdCBwYXRoOiBlbGVtZW50IGhhcyBubyBzaGFkb3cgcm9vdCBhbmQgbmVpdGhlciBkbyBpdHMgZGVzY2VuZGFudHNcbiAgLy8gd2UnZCB0b3VjaC4gY2xvbmVOb2RlICsgdGhlIG9yaWdpbmFsIHdhbGsgaXMgY2hlYXBlciB0aGFuIHRoZSBtYW51YWxcbiAgLy8gc2VyaWFsaXplciwgYW5kIGl0IHByZXNlcnZlcyBxdWlya3MgKGJvb2xlYW4gYXR0cmlidXRlIHNlcmlhbGl6YXRpb24sXG4gIC8vIG5hbWVzcGFjZWQgU1ZHLCBldGMuKSB0aGF0IHRoZSBtYW51YWwgcGF0aCBhcHByb3hpbWF0ZXMuXG4gIGNvbnN0IGhhc0FueVNoYWRvdyA9ICgoKSA9PiB7XG4gICAgaWYgKChlbCBhcyBhbnkpLnNoYWRvd1Jvb3QpIHJldHVybiB0cnVlO1xuICAgIC8vIENoZWFwIHNjYW46IGxvb2sgYXQgdGhlIGZpcnN0IH41MCBkZXNjZW5kYW50cyBmb3IgYSBzaGFkb3dSb290LiBBXG4gICAgLy8gcGFnZSB3aXRoIG1hbnkgc2hhZG93IGhvc3RzIGlzIHJhcmUgaW4gbGlnaHQtRE9NIGFwcHM7IHRoZSBjb3N0IG9mXG4gICAgLy8gdGhlIGZ1bGwgc2NhbiB3b3VsZCBkZWZlYXQgdGhlIHB1cnBvc2UuIDUwIGlzIGVub3VnaCB0byBjYXRjaCB0aGVcbiAgICAvLyBjb21tb24gY2FzZSAoYSBzaW5nbGUgc2hhZG93IHJvb3QgaW5zaWRlIHRoZSBjYXB0dXJlZCBzdWJ0cmVlKS5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZGVzYyA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcbiAgICAgIGNvbnN0IE4gPSBNYXRoLm1pbihkZXNjLmxlbmd0aCwgNTApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIGlmICgoZGVzY1tpXSBhcyBhbnkpLnNoYWRvd1Jvb3QpIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKTtcbiAgaWYgKGhhc0FueVNoYWRvdykge1xuICAgIGNvbnN0IGVsaWRlZCA9IHtjb3VudDogMH07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGh0bWwgPSBzZXJpYWxpemVXaXRoU2hhZG93KGVsLCAwLCBtYXhEZXB0aCwgZWxpZGVkKTtcbiAgICAgIHJldHVybiB7aHRtbCwgZWxpZGVkOiBlbGlkZWQuY291bnR9O1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRmFsbCB0aHJvdWdoIHRvIGNsb25lTm9kZSBwYXRoIGFzIGEgc2FmZXR5IG5ldC5cbiAgICB9XG4gIH1cbiAgbGV0IGVsaWRlZCA9IDA7XG4gIHRyeSB7XG4gICAgY29uc3QgY2xvbmUgPSBlbC5jbG9uZU5vZGUodHJ1ZSkgYXMgRWxlbWVudDtcbiAgICBjb25zdCB3YWxrID0gKG5vZGU6IEVsZW1lbnQsIGRlcHRoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiB8fCAhbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcbiAgICAgIGlmIChkZXB0aCA+PSBtYXhEZXB0aCkge1xuICAgICAgICBjb25zdCBjb3VudCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICBlbGlkZWQgKz0gY291bnQ7XG4gICAgICAgIG5vZGUuaW5uZXJIVE1MID0gYDwhLS0gJHtjb3VudH0gJHtjb3VudCA9PT0gMSA/ICdjaGlsZCcgOiAnY2hpbGRyZW4nfSBlbGlkZWQgLS0+YDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGRyZW4pKSB3YWxrKGNoaWxkLCBkZXB0aCArIDEpO1xuICAgIH07XG4gICAgd2FsayhjbG9uZSwgMCk7XG4gICAgcmV0dXJuIHtodG1sOiBjbG9uZS5vdXRlckhUTUwsIGVsaWRlZH07XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7aHRtbDogZWwub3V0ZXJIVE1MLCBlbGlkZWQ6IDB9O1xuICB9XG59O1xuXG4vLyBSZXR1cm5zIEJPVEggdGhlIHRyaW1tZWQgSFRNTCBhbmQgdGhlIG9yaWdpbmFsIGJ5dGUgbGVuZ3RoIHdoZW4gdGhlXG4vLyB0cmltIGNhcCBraWNrZWQgaW4uIExldHMgY2FwdHVyZUVudHJ5IGV4cG9zZSBgdHJ1bmNhdGVkLm91dGVySFRNTGBcbi8vIChwZXIgQlVHLTAxMykgc28gYSBjb25zdW1lciBjYW4gZGV0ZWN0IGVsaXNpb24gYW5kIHJlZmV0Y2ggaWYgbmVlZGVkLlxuY29uc3QgdHJpbUh0bWxXaXRoU2l6ZSA9IChodG1sOiBzdHJpbmcsIG1heDogbnVtYmVyKToge3ZhbHVlOiBzdHJpbmc7IHRydW5jYXRlZD86IG51bWJlcn0gPT4ge1xuICBpZiAoIWh0bWwpIHJldHVybiB7dmFsdWU6IGh0bWx9O1xuICBsZXQgY2xlYW5lZCA9IGVsaWRlRGF0YVVyaXMoaHRtbCk7XG4gIGNsZWFuZWQgPSBlbGlkZUlubGluZVN2Z3MoY2xlYW5lZCk7XG4gIGNsZWFuZWQgPSBzdHJpcERhbmdlcm91c0VsZW1lbnRzKGNsZWFuZWQpO1xuICBpZiAoY2xlYW5lZC5sZW5ndGggPD0gbWF4KSByZXR1cm4ge3ZhbHVlOiBjbGVhbmVkfTtcbiAgY29uc3Qgb3JpZ2luYWxMZW4gPSBodG1sLmxlbmd0aDtcbiAgY29uc3QgY3V0ID0gY2xlYW5lZC5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0ID0gY3V0Lmxhc3RJbmRleE9mKCc+Jyk7XG4gIGNvbnN0IHZhbHVlID0gKGxhc3QgPiBtYXggLSAyMDAgPyBjdXQuc2xpY2UoMCwgbGFzdCArIDEpIDogY3V0KSArICfigKYnO1xuICByZXR1cm4ge3ZhbHVlLCB0cnVuY2F0ZWQ6IG9yaWdpbmFsTGVufTtcbn07XG5cbmNvbnN0IHRyaW1IdG1sID0gKGh0bWw6IHN0cmluZywgbWF4OiBudW1iZXIpOiBzdHJpbmcgPT4gdHJpbUh0bWxXaXRoU2l6ZShodG1sLCBtYXgpLnZhbHVlO1xuXG5jb25zdCByZWN0T2YgPSAoZWw6IEVsZW1lbnQpOiBSZWN0ID0+IHtcbiAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4ge3g6IE1hdGgucm91bmQoci54KSwgeTogTWF0aC5yb3VuZChyLnkpLCB3OiBNYXRoLnJvdW5kKHIud2lkdGgpLCBoOiBNYXRoLnJvdW5kKHIuaGVpZ2h0KX07XG59O1xuXG4vLyBHZW5lcmF0ZSBhIHV1aWQgdGhhdCB3b3JrcyBpbiBzZXJ2aWNlIHdvcmtlcnMsIGNvbnRlbnQgc2NyaXB0cywgYW5kXG4vLyBvbGRlciBDaHJvbWUgY29udGV4dHMuIGNyeXB0by5yYW5kb21VVUlEIGV4aXN0cyBpbiBtb2Rlcm4gYnJvd3NlcnM7IHRoZVxuLy8gZmFsbGJhY2sgdXNlcyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIGlmIGF2YWlsYWJsZSwgZWxzZSBhIHBlci1wYWdlIGNvdW50ZXIuXG5sZXQgZmFsbGJhY2tVaWRDb3VudGVyID0gMDtcbmNvbnN0IHV1aWQgPSAoKTogc3RyaW5nID0+IHtcbiAgdHJ5IHsgaWYgKGNyeXB0by5yYW5kb21VVUlEKSByZXR1cm4gY3J5cHRvLnJhbmRvbVVVSUQoKTsgfSBjYXRjaCB7IC8qIGZhbGwgdGhyb3VnaCAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3QgYSA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGEpO1xuICAgIGFbNl0gPSAoYVs2XSEgJiAweDBmKSB8IDB4NDA7XG4gICAgYVs4XSA9IChhWzhdISAmIDB4M2YpIHwgMHg4MDtcbiAgICBjb25zdCBoID0gQXJyYXkuZnJvbShhKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIHJldHVybiBgJHtoLnNsaWNlKDAsIDgpfS0ke2guc2xpY2UoOCwgMTIpfS0ke2guc2xpY2UoMTIsIDE2KX0tJHtoLnNsaWNlKDE2LCAyMCl9LSR7aC5zbGljZSgyMCl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGB1aWRfJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX1fJHsoKytmYWxsYmFja1VpZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB9XG59O1xuXG4vLyBUcnVlIGlmIGBlbGAgaGFzIGF0IGxlYXN0IG9uZSBkaXJlY3QgdGV4dC1ub2RlIGNoaWxkIHdpdGggbm9uLXdoaXRlc3BhY2Vcbi8vIGNvbnRlbnQuIFRoZSByb2FzdCBjYXVnaHQgdXMgZW1pdHRpbmcgY29uY2F0ZW5hdGVkIGRlc2NlbmRhbnQgdGV4dCBvblxuLy8gY29udGFpbmVyIGVsZW1lbnRzIChgPGhlYWRlcj5gLCBgPG1haW4+YCwgZXRjLikgYXMgYHRleHRgIOKAlCB3aGljaFxuLy8gcHJvZHVjZWQgMjAwLWNoYXIgZHVtcHMgdGhhdCB3ZXJlIG5vaXNlIHRvIExMTXMuIE9ubHkgZW1pdCBgdGV4dGAgd2hlblxuLy8gdGhlIGVsZW1lbnQgZGlyZWN0bHkgb3ducyB0ZXh0IG9yIGlzIG90aGVyd2lzZSBhIGNvbnRlbnQtYmVhcmluZyBsZWFmLlxuY29uc3QgaGFzT3duVGV4dE5vZGUgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgZm9yIChjb25zdCBub2RlIG9mIEFycmF5LmZyb20oZWwuY2hpbGROb2RlcykpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAvKiBURVhUX05PREUgKi8pIHtcbiAgICAgIGNvbnN0IHYgPSAobm9kZSBhcyBUZXh0KS5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBpZiAodi50cmltKCkubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIE9wdGlvbmFsIGNsaWNrIGNvbnRleHQuIFRocmVhZGVkIGJ5IHRoZSBjb250ZW50LXNjcmlwdCB3aGVuIHRoZVxuLy8gY2FwdHVyZSBpcyBkcml2ZW4gYnkgYSBjbGljayAoYWx0LWNsaWNrLCBhbHQtc2hpZnQtY2xpY2ssIGFsdC1kcmFnKTtcbi8vIGFic2VudCBmb3IgbWFudWFsLWNhcHR1cmUgLyByZWNhcHR1cmUgLyBwcm9ncmFtbWF0aWMgZmxvd3MuIFVzZWQgdG9cbi8vIGNvbXB1dGUgY2FudmFzLXJlbGF0aXZlIGNsaWNrIGNvb3JkaW5hdGVzIHdoZW4gdGhlIGNhcHR1cmVkIGVsZW1lbnRcbi8vIGxpdmVzIGluc2lkZSBhIGA8Y2FudmFzPmAuXG5leHBvcnQgdHlwZSBDYXB0dXJlT3B0cyA9IHtcbiAgY2xpY2tBdD86IHtjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlcn07XG59O1xuXG5jb25zdCBmaW5kQ2FudmFzQW5jZXN0b3IgPSAoZWw6IEVsZW1lbnQpOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPT4ge1xuICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IGVsO1xuICB3aGlsZSAoY3VyKSB7XG4gICAgaWYgKGN1ciBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSByZXR1cm4gY3VyO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhcHR1cmVFbnRyeSA9IChlbDogRWxlbWVudCwgc2VxdWVuY2U6IG51bWJlciwgb3B0czogQ2FwdHVyZU9wdHMgPSB7fSk6IEVudHJ5ID0+IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAvLyB0ZXh0Q29udGVudCAoTk9UIGlubmVyVGV4dCkgc28gc291cmNlIGBSZWZyZXNoYCBkb2Vzbid0IGdldCBjYXB0dXJlZFxuICAvLyBhcyB0aGUgQ1NTLXJlbmRlcmVkIGBSRUZSRVNIYC4gUm9hc3QgQlVHLTAwMS5cbiAgLy8gU2tpcCBvbiBub24tbGVhZiBjb250YWluZXJzIHRoYXQgZG9uJ3Qgb3duIGRpcmVjdCB0ZXh0IOKAlCBvdGhlcndpc2VcbiAgLy8gdGhlIHZhbHVlIGlzIHRoZSBjb25jYXRlbmF0aW9uIG9mIGV2ZXJ5IGRlc2NlbmRhbnQncyB0ZXh0LCBvZnRlblxuICAvLyB0cnVuY2F0ZWQgbWlkLXdvcmQsIHdoaWNoIGFuIExMTSB0cmVhdHMgYXMgb25lIHdhbGwgb2YgbXVzaC5cbiAgY29uc3QgaXNMZWFmaXNoID0gIWVsLmNoaWxkcmVuPy5sZW5ndGggfHwgaGFzT3duVGV4dE5vZGUoZWwpO1xuICBjb25zdCB0ZXh0ID0gaXNMZWFmaXNoID8gdHJpbVRleHQoZWwudGV4dENvbnRlbnQsIDI1MCkgOiAnJztcbiAgY29uc3Qgcm9sZSA9IGF0dHIoZWwsICdyb2xlJykgfHwgaW1wbGljaXRSb2xlKGVsKTtcbiAgLy8gQ2FwdHVyZSB0aGUgdmlzdWFsbHktcmVuZGVyZWQgZm9ybSB0b28gd2hlbiBDU1MgdHJhbnNmb3JtZWQgaXQuIFVzZWZ1bFxuICAvLyBmb3IgTExNcyB0aGF0IG5lZWQgYm90aCBzb3VyY2UgYW5kIHJlbmRlcmVkIGZvciBhIFVJIGJ1ZyBsaWtlIFwidGhlXG4gIC8vIGxhYmVsIHNheXMgU05PT1pFIDFIIGluIHRoZSBzY3JlZW5zaG90IGJ1dCB0aGUgc291cmNlIGhhcyBTbm9vemUgMWhcIi5cbiAgY29uc3QgcmVuZGVyZWRUZXh0ID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBpZiAoY3MudGV4dFRyYW5zZm9ybSAmJiBjcy50ZXh0VHJhbnNmb3JtICE9PSAnbm9uZScpIHtcbiAgICAgICAgY29uc3QgciA9IHRyaW1UZXh0KChlbCBhcyBIVE1MRWxlbWVudCkuaW5uZXJUZXh0LCAyNTApO1xuICAgICAgICByZXR1cm4gciAmJiByICE9PSB0ZXh0ID8gciA6IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pKCk7XG4gIGNvbnN0IGFjY05hbWUgPSBhY2Nlc3NpYmxlTmFtZShlbCwgcm9sZSk7XG4gIGNvbnN0IHRlc3RJZCA9IGF0dHIoZWwsICdkYXRhLXRlc3RpZCcpIHx8IGF0dHIoZWwsICdkYXRhLXRlc3QnKSB8fFxuICAgIGF0dHIoZWwsICdkYXRhLWN5JykgfHwgYXR0cihlbCwgJ2RhdGEtcWEnKTtcbiAgY29uc3Qgc3RhYmxlSWQgPSBpc1N0YWJsZUlkKGVsLmlkKSA/IGVsLmlkIDogbnVsbDtcbiAgY29uc3QgY2xhc3NlcyA9IGVsLmNsYXNzTGlzdCA/IEFycmF5LmZyb20oZWwuY2xhc3NMaXN0KS5zbGljZSgwLCAzMikgOiBbXTtcbiAgY29uc3Qge2F0dHJzLCBoaW50c30gPSBwb3B1bGF0ZWRBdHRycyhlbCk7XG4gIGNvbnN0IGNvbXBSb290ID0gY29tcG9uZW50Um9vdChlbCk7XG4gIGNvbnN0IGZ3ayA9IGZyYW1ld29ya0luZm8oZWwpO1xuICBjb25zdCB0cnVlU3RhdGVzID0gcGlja1RydWVTdGF0ZXMoZWwpO1xuICBjb25zdCBzdHlsZXMgPSBlc3NlbnRpYWxTdHlsZXMoZWwpO1xuICBjb25zdCBwc2V1ZG8gPSBwc2V1ZG9TdHlsZXMoZWwpO1xuICBjb25zdCBydWxlcyA9IGNvbGxlY3RNYXRjaGVkUnVsZXMoZWwpO1xuICBjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGUoKTtcbiAgY29uc3QgaW5TaGFkb3cgPSByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdDtcbiAgLy8gU2hhZG93LXJvb3RlZCBlbGVtZW50cyBhcmVuJ3QgcmVhY2hhYmxlIGZyb20gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgLFxuICAvLyBzbyB1bmlxdWVuZXNzIGNoZWNrcyBhZ2FpbnN0IHRoZSBkb2N1bWVudCBhbHdheXMgZmFpbC4gU2NvcGUgdG8gdGhlXG4gIC8vIG93bmluZyBTaGFkb3dSb290IHdoZW4gcHJlc2VudCDigJQgdGhhdCdzIGFsc28gd2hlcmUgYSBjb25zdW1lciBxdWVyeWluZ1xuICAvLyBgc2hhZG93SG9zdC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoLi4uKWAgd291bGQgcmVzb2x2ZSB0aGUgc2VsZWN0b3IuXG4gIGNvbnN0IHNjb3BlOiBEb2N1bWVudCB8IFNoYWRvd1Jvb3QgPSBpblNoYWRvdyA/IChyb290IGFzIFNoYWRvd1Jvb3QpIDogZG9jdW1lbnQ7XG5cbiAgLy8gVGVzdC1JRHMgYW5kIHN0YWJsZSBJRHMgYXJlIFBSRUZFUlJFRCwgYnV0IG9ubHkgd2hlbiBhY3R1YWxseSB1bmlxdWUgb25cbiAgLy8gdGhlIHBhZ2UuIFJlYWwtd29ybGQgd2VhdGhlci9saXN0IFVJcyBjb21tb25seSB0YWcgZXZlcnkgY2FyZCB3aXRoIHRoZVxuICAvLyBzYW1lIGBkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cImAg4oCUIGVtaXR0aW5nIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYFxuICAvLyB3b3VsZCByZXNvbHZlIHRvIDcgZWxlbWVudHMgYW5kIHRoZSBjb25zdW1lciBjYW4ndCB0ZWxsIHdoaWNoIG9uZSB3YXNcbiAgLy8gY2FwdHVyZWQuIFdoZW4gdGhlIHRlc3RJZCAvIHN0YWJsZUlkIGlzIG5vbi11bmlxdWUgd2UgZmFsbCB0aHJvdWdoIHRvXG4gIC8vIGNzc1BhdGgsIHdoaWNoIGFkZHMgd2hhdGV2ZXIgcGF0aCAvIGFuY2VzdG9yIHNjb3BlIG1ha2VzIHRoZSBjYXB0dXJlZFxuICAvLyBlbGVtZW50IGFkZHJlc3NhYmxlLlxuICBsZXQgc2VsZWN0b3I6IHN0cmluZztcbiAgaWYgKHRlc3RJZCkge1xuICAgIGNvbnN0IHRlc3RJZFNlbCA9IGBbZGF0YS10ZXN0aWQ9XCIke3Rlc3RJZH1cIl1gO1xuICAgIGlmIChpc1VuaXF1ZShzY29wZSwgdGVzdElkU2VsLCBlbCkpIHtcbiAgICAgIHNlbGVjdG9yID0gdGVzdElkU2VsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUcnkgYW5jaG9yaW5nIHRoZSB0ZXN0SWQgdG8gYSB1bmlxdWUgYW5jZXN0b3IsIG9yIGFwcGVuZGluZyB0aGVcbiAgICAgIC8vIGNhcHR1cmVkIGVsZW1lbnQncyBwYXRoLXRhaWwuIGNzc1BhdGgoKSBhbHJlYWR5IGRvZXMgYm90aCB2aWEgdGhlXG4gICAgICAvLyBBUklBIC8gcm9sZSAvIHVuaXF1ZS1jbGFzcyBhbmNlc3RvciBsYWRkZXIsIGJ1dCBpdCBkb2Vzbid0IFNUQVJUXG4gICAgICAvLyBmcm9tIHRoZSB0ZXN0SWQuIFdlIGJpYXMgdG93YXJkIGtlZXBpbmcgdGhlIHRlc3RJZCB2aXNpYmxlIGJ5XG4gICAgICAvLyBwYWlyaW5nIGl0IHdpdGggYSBjaGlsZCBkZXNjcmlwdG9yIHRoYXQgZGlzdGluZ3Vpc2hlcyBzaWJsaW5ncy5cbiAgICAgIGNvbnN0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICBsZXQgc2NvcGVkID0gJyc7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGNvbnN0IHNhbWVUYWdTaWJzID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoYykgPT4gYy5ub2RlTmFtZSA9PT0gZWwubm9kZU5hbWUpO1xuICAgICAgICBpZiAoc2FtZVRhZ1NpYnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHNjb3BlZCA9IGAke3Rlc3RJZFNlbH06bnRoLW9mLXR5cGUoJHtzYW1lVGFnU2licy5pbmRleE9mKGVsKSArIDF9KWA7XG4gICAgICAgICAgaWYgKGlzVW5pcXVlKHNjb3BlLCBzY29wZWQsIGVsKSkge1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBzY29wZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHN0YWJsZUlkKSB7XG4gICAgY29uc3QgaWRTZWwgPSBgIyR7ZXNjYXBlQ3NzKHN0YWJsZUlkKX1gO1xuICAgIHNlbGVjdG9yID0gaXNVbmlxdWUoc2NvcGUsIGlkU2VsLCBlbCkgPyBpZFNlbCA6IGNzc1BhdGgoZWwpO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0gY3NzUGF0aChlbCk7XG4gIH1cblxuICAvLyBDYXAgb3V0ZXJIVE1MIGF0IGRlcHRoPTIgQkVGT1JFIHRoZSBsZW5ndGgtY2FwIHBhc3M6IGEgc3BhcmtsaW5lXG4gIC8vIHdyYXBwZXIgd2l0aCA2MCBkYXRhIHNwYW5zIHdvdWxkIG90aGVyd2lzZSBjb25zdW1lIH45IEtCIG9mIG9uZVxuICAvLyBlbnRyeS4gQ2xvbmluZyBpbnRvIGEgZGV0YWNoZWQgc3VidHJlZSBsZXRzIHVzIHJlcGxhY2UgZGVlcFxuICAvLyBjaGlsZHJlbiB3aXRoIGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmAgbWFya2VycyB3aXRob3V0XG4gIC8vIHRvdWNoaW5nIHRoZSBsaXZlIERPTS5cbiAgY29uc3QgY2FwcGVkSHRtbCA9IGNhcHBlZE91dGVySFRNTChlbCwgMik7XG4gIGNvbnN0IHRyaW1tZWQgPSB0cmltSHRtbFdpdGhTaXplKGNhcHBlZEh0bWwuaHRtbCwgTUFYX1NOSVBQRVQpO1xuICBjb25zdCBvdXQ6IEVudHJ5ID0ge1xuICAgIHVpZDogdXVpZCgpLFxuICAgIG46IHNlcXVlbmNlLFxuICAgIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgIHRhZyxcbiAgICBzZWxlY3RvcixcbiAgICBvdXRlckhUTUw6IHRyaW1tZWQudmFsdWUsXG4gICAgcmVjdDogcmVjdE9mKGVsKSxcbiAgICAvLyBSb3VuZCBkcHIgdG8gMiBkZWNpbWFscyDigJQgV2luZG93cyBkaXNwbGF5IHNjYWxpbmcgcmVwb3J0cyByYXcgdmFsdWVzXG4gICAgLy8gbGlrZSAxLjc5OTk5OTk1MjMxNjI4NDIgKD09IDEuOCkgd2hpY2ggaXMgZmxvYXQtYXJpdGhtZXRpYyBub2lzZS5cbiAgICAvLyBDYXB0dXJlIHVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSB0b28gKGxpZ2h0IHZzIGRhcmssIG1vdGlvblxuICAgIC8vIHByZWYpIHNvIGEgZG93bnN0cmVhbSBMTE0gY2FuIHJlYXNvbiBhYm91dCB3aHkgYSBjYXB0dXJlZFxuICAgIC8vIGFwcGVhcmFuY2UgbWlnaHQgZGlmZmVyIGJldHdlZW4gc2Vzc2lvbnMuXG4gICAgdmlld3BvcnQ6IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCgpLFxuICB9O1xuICBpZiAoY2FwcGVkSHRtbC5lbGlkZWQgPiAwIHx8IHRyaW1tZWQudHJ1bmNhdGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXQudHJ1bmNhdGVkID0ge307XG4gICAgaWYgKGNhcHBlZEh0bWwuZWxpZGVkID4gMCkgb3V0LnRydW5jYXRlZC5jaGlsZHJlbiA9IGNhcHBlZEh0bWwuZWxpZGVkO1xuICAgIGlmICh0cmltbWVkLnRydW5jYXRlZCAhPT0gdW5kZWZpbmVkKSBvdXQudHJ1bmNhdGVkLm91dGVySFRNTCA9IHRyaW1tZWQudHJ1bmNhdGVkO1xuICB9XG4gIGlmICh0ZXh0KSBvdXQudGV4dCA9IHRleHQ7XG4gIGlmIChyZW5kZXJlZFRleHQpIG91dC5yZW5kZXJlZFRleHQgPSByZW5kZXJlZFRleHQ7XG4gIGlmIChyb2xlKSBvdXQucm9sZSA9IHJvbGU7XG4gIGlmIChhY2NOYW1lICYmIGFjY05hbWUgIT09IHRleHQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IGFjY05hbWU7XG4gIGlmIChzdGFibGVJZCkgb3V0LmlkID0gc3RhYmxlSWQ7XG4gIGlmICh0ZXN0SWQpIG91dC50ZXN0SWQgPSB0ZXN0SWQ7XG4gIGlmIChjbGFzc2VzLmxlbmd0aCkgb3V0LmNsYXNzZXMgPSBjbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoYXR0cnMpLmxlbmd0aCkgb3V0LmF0dHJzID0gYXR0cnM7XG4gIGlmIChoaW50cykgb3V0LmhpbnRzID0gaGludHM7XG4gIGlmIChpblNoYWRvdykge1xuICAgIG91dC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgY29uc3Qgc2ggPSBzaGFkb3dIb3N0U2VsZWN0b3IoZWwpO1xuICAgIGlmIChzaCkgb3V0LnNoYWRvd0hvc3QgPSBzaDtcbiAgfVxuICBpZiAoY29tcFJvb3Q/LmNvbXBhY3QpIG91dC5jb21wb25lbnRSb290ID0gY29tcFJvb3QuY29tcGFjdDtcbiAgY29uc3QgYW5jZXN0b3JzID0gYW5jZXN0b3JDaGFpbihlbCk7XG4gIGlmIChhbmNlc3RvcnMubGVuZ3RoKSBvdXQuYW5jZXN0b3JzID0gYW5jZXN0b3JzO1xuICBpZiAoZndrKSBvdXQuY29tcG9uZW50ID0gZndrO1xuICBjb25zdCBldmVudHMgPSBjb2xsZWN0RXZlbnROYW1lcyhlbCk7XG4gIGlmIChldmVudHMpIG91dC5ldmVudHMgPSBldmVudHM7XG4gIGNvbnN0IGJlaGF2aW9yQXR0cnMgPSBjb2xsZWN0QmVoYXZpb3JBdHRycyhlbCk7XG4gIGlmIChiZWhhdmlvckF0dHJzKSBvdXQuYmVoYXZpb3JBdHRycyA9IGJlaGF2aW9yQXR0cnM7XG4gIGlmIChoYXNBY3RpdmVBbmltYXRpb24oZWwpKSBvdXQuaXNBbmltYXRpbmcgPSB0cnVlO1xuICAvLyBDYXB0dXJlIGFzc2V0IHJlZmVyZW5jZXMgc28gY29tcGxhaW50cyBhYm91dCBsb2dvcyAvIGljb25zIC9cbiAgLy8gYXJ0d29yayBjYW4gYmUgcmVwYWlyZWQgd2l0aG91dCB2aXN1YWwgZ3Vlc3NpbmcuIFdhbGtzIDxpbWc+LFxuICAvLyA8cGljdHVyZT48c291cmNlPiwgYW5kIDxzdmcgdXNlIGhyZWY+IHdpdGhpbiB0aGUgY2FwdHVyZWQgc3VidHJlZVxuICAvLyAob25lIGxldmVsIG9ubHkg4oCUIGRlc2NlbmRhbnQgc2NvcGUgaXMgYWxyZWFkeSBjYXBwZWQgYnkgb3V0ZXJIVE1MXG4gIC8vIGVsaXNpb24pLlxuICBjb25zdCBhc3NldHM6IEFycmF5PHtzcmM6IHN0cmluZzsgbmF0dXJhbFc/OiBudW1iZXI7IG5hdHVyYWxIPzogbnVtYmVyOyByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjsgYWx0Pzogc3RyaW5nOyBsb2FkZWQ/OiBib29sZWFufT4gPSBbXTtcbiAgdHJ5IHtcbiAgICBjb25zdCBpbWdMaXN0ID0gZWwucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdMaXN0Lmxlbmd0aCAmJiBhc3NldHMubGVuZ3RoIDwgODsgaSsrKSB7XG4gICAgICBjb25zdCBpbWcgPSBpbWdMaXN0W2ldIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICBjb25zdCBzcmMgPSBpbWcuY3VycmVudFNyYyB8fCBpbWcuc3JjO1xuICAgICAgaWYgKCFzcmMgfHwgc3JjLnN0YXJ0c1dpdGgoJ2RhdGE6JykpIGNvbnRpbnVlOyAvLyBza2lwIGRhdGE6IFVSSXNcbiAgICAgIGNvbnN0IHIgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBhc3NldHMucHVzaCh7XG4gICAgICAgIHNyYzogdHJpbVRleHQoc3JjLCAyMDApLFxuICAgICAgICBuYXR1cmFsVzogaW1nLm5hdHVyYWxXaWR0aCB8fCB1bmRlZmluZWQsXG4gICAgICAgIG5hdHVyYWxIOiBpbWcubmF0dXJhbEhlaWdodCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHJlbmRlcmVkVzogTWF0aC5yb3VuZChyLndpZHRoKSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHJlbmRlcmVkSDogTWF0aC5yb3VuZChyLmhlaWdodCkgfHwgdW5kZWZpbmVkLFxuICAgICAgICBhbHQ6IGltZy5hbHQgfHwgdW5kZWZpbmVkLFxuICAgICAgICBsb2FkZWQ6IGltZy5jb21wbGV0ZSAmJiBpbWcubmF0dXJhbFdpZHRoID4gMCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCB1c2VMaXN0ID0gZWwucXVlcnlTZWxlY3RvckFsbCgndXNlW2hyZWZdLCB1c2VbeGxpbmtcXFxcOmhyZWZdJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1c2VMaXN0Lmxlbmd0aCAmJiBhc3NldHMubGVuZ3RoIDwgMTI7IGkrKykge1xuICAgICAgY29uc3QgdSA9IHVzZUxpc3RbaV0gYXMgU1ZHVXNlRWxlbWVudDtcbiAgICAgIGNvbnN0IGhyZWYgPSB1LmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8IHUuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJyk7XG4gICAgICBpZiAoaHJlZikgYXNzZXRzLnB1c2goe3NyYzogdHJpbVRleHQoaHJlZiwgMjAwKX0pO1xuICAgIH1cbiAgICAvLyBFbGVtZW50J3Mgb3duIGJhY2tncm91bmQtaW1hZ2UgKENTUy1kcml2ZW4gYXJ0d29yayDigJQgbG9nb3NcbiAgICAvLyBzb21ldGltZXMgc2hpcCB2aWEgYGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi4pYCkuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJnID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmJhY2tncm91bmRJbWFnZTtcbiAgICAgIGlmIChiZyAmJiBiZyAhPT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbnN0IHVybE0gPSAvdXJsXFwoKFsnXCJdPykoLis/KVxcMVxcKS8uZXhlYyhiZyk7XG4gICAgICAgIGlmICh1cmxNICYmICF1cmxNWzJdIS5zdGFydHNXaXRoKCdkYXRhOicpKSB7XG4gICAgICAgICAgYXNzZXRzLnB1c2goe3NyYzogdHJpbVRleHQodXJsTVsyXSEsIDIwMCl9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgaWYgKGFzc2V0cy5sZW5ndGgpIG91dC5hc3NldHMgPSBhc3NldHM7XG5cbiAgLy8gU2hpcCBhbiBhMTF5IGNoZWNrIG9uIGV2ZXJ5IGVudHJ5IChjb250cmFzdCByYXRpbyBmb3IgdGV4dCxcbiAgLy8gdGFiYmFiaWxpdHkgZmxhZykgc28gcmV2aWV3ZXJzIGRvbid0IG5lZWQgdG8gcmUtcnVuIGFuIGF1ZGl0LlxuICAvLyBIZWF2aWVyIGNoZWNrcyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90LCBheGUtc3R5bGUgdmlvbGF0aW9ucylcbiAgLy8gbmVlZCB0aGVpciBvd24gcGlwZWxpbmU7IHRoaXMgaXMgdGhlIGluLWNhcHR1cmUgcG9ydGlvbi5cbiAgY29uc3QgYTExeSA9IGNvbXB1dGVBY2Nlc3NpYmlsaXR5Q2hlY2soZWwpO1xuICBpZiAoYTExeSkgb3V0LmExMXkgPSBhMTF5O1xuICAvLyBQYXJlbnQgbGF5b3V0IGNvbnRleHQgKG92ZXJmbG93IC8gcG9zaXRpb24gLyBmbGV4IC8gZ3JpZCAvIHNjcm9sbFxuICAvLyBjb250YWluZXJzIC8gc3RhY2tpbmcpLiBMYXlvdXQgYnVncyB0eXBpY2FsbHkgbGl2ZSBpbiB0aGUgYW5jZXN0b3JcbiAgLy8gY2hhaW4sIG5vdCBvbiB0aGUgY2FwdHVyZWQgZWxlbWVudCBpdHNlbGYuXG4gIGNvbnN0IGxheW91dCA9IGNhcHR1cmVMYXlvdXRDb250ZXh0KGVsKTtcbiAgaWYgKGxheW91dC5sZW5ndGgpIG91dC5sYXlvdXRDb250ZXh0ID0gbGF5b3V0O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIGJlZm9yZSB0aGUgY2xpY2sg4oCUIHJlcHJvIGNvbnRleHQgKMKnNC44KS5cbiAgLy8gVGhlIGNvbnRlbnQtc2NyaXB0LW93bmVkIHJpbmcgYnVmZmVyIGZlZWRzIHVzIHRoZSByZWNlbnQgaGlzdG9yeTtcbiAgLy8gd2Ugc2xpY2UgdGhlIGxhc3QgMyBzbyB0aGUgZW50cnkgc3RheXMgc21hbGwuIFNraXBwZWQgd2hlbiB0aGVcbiAgLy8gZ2V0dGVyIGlzbid0IHdpcmVkICh0ZXN0L3N0YW5kYWxvbmUgaGFybmVzc2VzKS5cbiAgaWYgKG11dGF0aW9uQnVmZmVyR2V0dGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VudCA9IG11dGF0aW9uQnVmZmVyR2V0dGVyKCk7XG4gICAgICAvLyBGaWx0ZXIgb3V0IHRvb2wtaW5kdWNlZCBtdXRhdGlvbnMgKGN1cnNvciBzd2FwLCBib2R5IHN0eWxlXG4gICAgICAvLyBoaXRzIGZyb20gY3Jvc3NoYWlyIG1vZGUsIG92ZXJsYXkgcGFpbnRzLCByaW5nIHJlcGFpbnRzKSBzb1xuICAgICAgLy8gdGhlIGNvbnN1bWVyIGRvZXNuJ3QgaGF2ZSB0byB3b25kZXIgd2hldGhlciBgYm9keSB7IGN1cnNvcjpcbiAgICAgIC8vIGNyb3NzaGFpciB9YCBpcyBwYXJ0IG9mIHRoZWlyIGFwcC4gV2UgbWFyayBvdXIgb3duIG11dGF0aW9uc1xuICAgICAgLy8gYnkgc291cmNlIGFuZCBleGNsdWRlIHRoZW07IHVuLW1hcmtlZCBtdXRhdGlvbnMgYXJlIGFwcC1kcml2ZW4uXG4gICAgICBjb25zdCBUT09MX05PSVNFX1JFID0gL14oaHRtbHxib2R5fCNfX3BpbmNoZ3JhYl9vdmVybGF5KVxcYnxjdXJzb3J8dXNlci1zZWxlY3R8d2Via2l0LXVzZXItc2VsZWN0L2k7XG4gICAgICBjb25zdCBmaWx0ZXJlZCA9IHJlY2VudC5maWx0ZXIoKG0pID0+IHtcbiAgICAgICAgaWYgKFRPT0xfTk9JU0VfUkUudGVzdChtLnRhcmdldCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKG0udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnICYmIG0uYXR0cmlidXRlTmFtZSAmJiAvXihzdHlsZXxjdXJzb3IpJC8udGVzdChtLmF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgICAgLy8gYm9keSB7IGN1cnNvcjogY3Jvc3NoYWlyIH0gZnJvbSBQaW5jaEdyYWIncyBkcmFnIG1vZGVcbiAgICAgICAgICByZXR1cm4gIShtLnRhcmdldC5zdGFydHNXaXRoKCdodG1sJykgfHwgbS50YXJnZXQuc3RhcnRzV2l0aCgnYm9keScpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGZpbHRlcmVkLnNsaWNlKC0zKTtcbiAgICB9IGNhdGNoIHsgLyogaWdub3JlIG9ic2VydmVyIGVycm9ycyAqLyB9XG4gIH1cbiAgLy8gQ29udGVudGVkaXRhYmxlIGVkaXRvciBjb250ZXh0IChGLjUpLiBXaGVuIHRoZSBjYXB0dXJlZCBlbGVtZW50XG4gIC8vIGxpdmVzIGluc2lkZSBhIHJpY2gtdGV4dCBlZGl0b3IgKFByb3NlTWlycm9yIC8gTGV4aWNhbCAvIFNsYXRlIC9cbiAgLy8gUXVpbGwgLyBUaXBUYXAgLyBuYXRpdmUpLCBzdXJmYWNlIHRoZSBsaWJyYXJ5IGtpbmQgKyByb290IHNlbGVjdG9yXG4gIC8vIHNvIGFuIExMTSBsb29raW5nIGF0IFwiY29weSBpcyB3cm9uZ1wiIGZlZWRiYWNrIGtub3dzIHRoZSBlZGl0b3JcbiAgLy8gd3JhcHBlciB0byBpbnNwZWN0IHJhdGhlciB0aGFuIGNoYXNpbmcgaW50ZXJuYWwgZWRpdG9yIHNlbGVjdG9ycy5cbiAgY29uc3QgZWRpdG9yID0gZWRpdG9yQ29udGV4dChlbCk7XG4gIGlmIChlZGl0b3IpIG91dC5lZGl0b3IgPSBlZGl0b3I7XG4gIC8vIENhbnZhcyBjbGljayBjb29yZHMgKEYuMykuIFdoZW4gdGhlIGNhcHR1cmUgdGFyZ2V0IGlzIGEgY2FudmFzIChvclxuICAvLyBhIGRlc2NlbmRhbnQg4oCUIERhdGFEb2ctc3R5bGUgY2hhcnRzIG9mdGVuIHJlbmRlciBpbnRvIGEgY2FudmFzIHdpdGhcbiAgLy8gcHNldWRvLWVsZW1lbnRzIGxheWVyZWQgb24gdG9wKSwgY29tcHV0ZSBjbGljayBwb3NpdGlvbiByZWxhdGl2ZSB0b1xuICAvLyB0aGUgY2FudmFzJ3MgYm91bmRpbmcgYm94LiBTa2lwcGVkIGlmIHRoZSBjYWxsZXIgZGlkbid0IHByb3ZpZGVcbiAgLy8gY2xpY2sgY29vcmRzIChtYW51YWwtY2FwdHVyZSAvIHJlY2FwdHVyZSBmbG93cykuXG4gIGlmIChvcHRzLmNsaWNrQXQpIHtcbiAgICBjb25zdCBjYW52YXMgPSBmaW5kQ2FudmFzQW5jZXN0b3IoZWwpO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGNvbnN0IHIgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBvdXQuY2FudmFzQ2xpY2sgPSB7XG4gICAgICAgIG9mZnNldFg6IE1hdGgucm91bmQob3B0cy5jbGlja0F0LmNsaWVudFggLSByLmxlZnQpLFxuICAgICAgICBvZmZzZXRZOiBNYXRoLnJvdW5kKG9wdHMuY2xpY2tBdC5jbGllbnRZIC0gci50b3ApLFxuICAgICAgICBjYW52YXNXOiBNYXRoLnJvdW5kKHIud2lkdGgpLFxuICAgICAgICBjYW52YXNIOiBNYXRoLnJvdW5kKHIuaGVpZ2h0KSxcbiAgICAgICAgY2FudmFzU2VsZWN0b3I6ICgoKSA9PiB7IHRyeSB7IHJldHVybiBjc3NQYXRoKGNhbnZhcyk7IH0gY2F0Y2ggeyByZXR1cm4gJ2NhbnZhcyc7IH0gfSkoKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmICh0cnVlU3RhdGVzLmxlbmd0aCkgb3V0LnN0YXRlcyA9IHRydWVTdGF0ZXM7XG4gIGlmIChPYmplY3Qua2V5cyhzdHlsZXMpLmxlbmd0aCkgb3V0LnN0eWxlcyA9IHN0eWxlcztcbiAgaWYgKHJ1bGVzLmxlbmd0aCkgb3V0Lm1hdGNoZWRSdWxlcyA9IHJ1bGVzO1xuICBpZiAoT2JqZWN0LmtleXMocHNldWRvKS5sZW5ndGgpIG91dC5wc2V1ZG9FbGVtZW50cyA9IHBzZXVkbztcblxuICAvLyBMb2NhdG9yIHF1YWxpdHk6IGhvdyBtYW55IGVsZW1lbnRzIGBzZWxlY3RvcmAgcmVzb2x2ZXMgdG8gaW4gaXRzXG4gIC8vIHNjb3BlICgxID0gdW5pcXVlKS4gPjEgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91czsgdXNlZnVsXG4gIC8vIHdoZW4gcGFpcmVkIHdpdGggcmVjdCAvIGFuY2VzdG9ycyB0byBkaXNhbWJpZ3VhdGUuXG4gIHRyeSB7XG4gICAgb3V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmxlbmd0aDtcbiAgfSBjYXRjaCB7IC8qIGludmFsaWQgc2VsZWN0b3IsIGxlYXZlIGZpZWxkcyBvZmYgKi8gfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG5jb25zdCBjb2xsZWN0Um9vdENzc1ZhcnMgPSAoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gIGNvbnN0IGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3MubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBuID0gY3NbaV07XG4gICAgaWYgKG4/LnN0YXJ0c1dpdGgoJy0tJykpIHtcbiAgICAgIGNvbnN0IHYgPSBjcy5nZXRQcm9wZXJ0eVZhbHVlKG4pLnRyaW0oKTtcbiAgICAgIGlmICh2KSBvdXRbbl0gPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gU2hhcmVkIHZpZXdwb3J0IHNuYXBzaG90IOKAlCB1c2VkIGJ5IGJvdGggYnVpbGRQYWdlQ29udGV4dCAoc2Vzc2lvblxuLy8gaGVhZGVyKSBhbmQgY2FwdHVyZUVudHJ5IChwZXItY2FwdHVyZSwgaW4gY2FzZSBzdGF0ZSBjaGFuZ2VkIGJldHdlZW5cbi8vIHRoZSBwYWdlIHJvdyBhbmQgdGhlIGNhcHR1cmUpLiBQaWNrcyB1cCBkcHIgcm91bmRpbmcsIGNvbG9yU2NoZW1lLFxuLy8gcmVkdWNlZE1vdGlvbiwgUlRMIGRpcmVjdGlvbiAoRi4xMyksIGFuZCB2aXN1YWxWaWV3cG9ydCB6b29tIChGLjE0KS5cbmNvbnN0IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCA9ICgpOiBWaWV3cG9ydCA9PiB7XG4gIGNvbnN0IHY6IFZpZXdwb3J0ID0ge1xuICAgIHc6IE1hdGgucm91bmQod2luZG93LmlubmVyV2lkdGgpLFxuICAgIGg6IE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0KSxcbiAgICBkcHI6IE1hdGgucm91bmQoKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpICogMTAwKSAvIDEwMCxcbiAgfTtcbiAgdHJ5IHtcbiAgICBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMpIHYuY29sb3JTY2hlbWUgPSAnZGFyayc7XG4gICAgZWxzZSBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodCknKS5tYXRjaGVzKSB2LmNvbG9yU2NoZW1lID0gJ2xpZ2h0JztcbiAgICBpZiAobWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB2LnJlZHVjZWRNb3Rpb24gPSB0cnVlO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgLy8gRG9jdW1lbnQgZGlyZWN0aW9uLiBgZGlyPVwicnRsXCJgIG9uIDxodG1sPiwgb3IgY29tcHV0ZWQgQ1NTIGRpcmVjdGlvblxuICAvLyB3aGVuIGFuIExUUiBkb2N1bWVudCBlbWJlZHMgYW4gUlRMIHN1YnRyZWUuIFdlIHNuYXBzaG90IHRoZSBkb2N1bWVudFxuICAvLyByb290J3MgY29tcHV0ZWQgZGlyZWN0aW9uLlxuICB0cnkge1xuICAgIGNvbnN0IGRpciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZGlyZWN0aW9uO1xuICAgIGlmIChkaXIgPT09ICdydGwnKSB2LmRpcmVjdGlvbiA9ICdydGwnO1xuICAgIGVsc2UgaWYgKGRpciA9PT0gJ2x0cicpIHYuZGlyZWN0aW9uID0gJ2x0cic7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAvLyBab29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIGlzIHRoZSBwaW5jaC16b29tIGZhY3RvciBvblxuICAvLyB0b3VjaCBkZXZpY2VzOyBvbiBkZXNrdG9wIHdpdGggYnJvd3NlciB6b29tIHRoZSB2YWx1ZSBzdGF5cyBhdCAxXG4gIC8vIGJ1dCB3aW5kb3cuaW5uZXJXaWR0aC9IZWlnaHQgc2hyaW5rLCBzbyB0aGlzIHdvbid0IHBpY2sgdXBcbiAgLy8gQ3RybCtwbHVzL21pbnVzIHpvb20g4oCUIHRoYXQgc3VyZmFjZXMgYXMgYSBzbWFsbGVyIHZpZXdwb3J0LiBCb3RoXG4gIC8vIGFyZSB1c2VmdWwgYW5kIHdlIGNhcHR1cmUgYm90aC5cbiAgdHJ5IHtcbiAgICBjb25zdCBzY2FsZSA9ICh3aW5kb3cudmlzdWFsVmlld3BvcnQgYXMgYW55KT8uc2NhbGU7XG4gICAgaWYgKHR5cGVvZiBzY2FsZSA9PT0gJ251bWJlcicgJiYgTWF0aC5hYnMoc2NhbGUgLSAxKSA+IDAuMDAxKSB7XG4gICAgICB2Lnpvb20gPSBNYXRoLnJvdW5kKHNjYWxlICogMTAwKSAvIDEwMDtcbiAgICB9XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gdjtcbn07XG5cbi8vIFJlY2VudC1UYWIgdHJhY2tlciBmb3IgYWN0aXZlRm9jdXMuIFdpcmVkIGJ5IGNvbnRlbnQtc2NyaXB0LnRzIGF0XG4vLyBib290OyB3ZSBrZWVwIHRoZSB0aW1lc3RhbXAgb2YgdGhlIGxhc3QgVGFiIGtleWRvd24gc28gYnVpbGRQYWdlQ29udGV4dFxuLy8gY2FuIGRlY2lkZSB3aGV0aGVyIHRvIGZsYWcgdGhlIGZvY3VzIGFzIFwia2V5Ym9hcmQtZHJpdmVuXCIuXG5sZXQgbGFzdFRhYkF0ID0gMDtcbmV4cG9ydCBjb25zdCBub3RlVGFiUHJlc3NlZCA9ICgpOiB2b2lkID0+IHsgbGFzdFRhYkF0ID0gRGF0ZS5ub3coKTsgfTtcblxuY29uc3QgYWN0aXZlRm9jdXNTbmFwc2hvdCA9ICgpOiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn0gfCBudWxsID0+IHtcbiAgY29uc3QgYWUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICBpZiAoIWFlIHx8IGFlID09PSBkb2N1bWVudC5ib2R5IHx8IGFlID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiBudWxsO1xuICBsZXQgc2VsZWN0b3I6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdHJ5IHsgc2VsZWN0b3IgPSBjc3NQYXRoKGFlKTsgfSBjYXRjaCB7IHNlbGVjdG9yID0gYWUudGFnTmFtZS50b0xvd2VyQ2FzZSgpOyB9XG4gIGNvbnN0IG91dDoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59ID0ge3NlbGVjdG9yfTtcbiAgaWYgKERhdGUubm93KCkgLSBsYXN0VGFiQXQgPCAxMDAwKSBvdXQucmVjZW50bHlUYWJiZWQgPSB0cnVlO1xuICByZXR1cm4gb3V0O1xufTtcblxuLy8gUmVhZCBnaXQgY29udGV4dCBmcm9tIGEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiY1xuLy8gYnJhbmNoOm1haW5cIj5gIHRhZyBpZiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXMgb25lLiBOby1vcCB3aGVuIGFic2VudC5cbi8vIExldHMgYSBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJ1aWxkIHdhcyB0aGlzIGNhcHR1cmVkIGZyb20/XCJcbi8vIHdpdGhvdXQgZm9yY2luZyB0aGUgdXNlciB0byByZW1lbWJlci5cbmNvbnN0IHJlYWRHaXRDb250ZXh0ID0gKCk6IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9IHwgbnVsbCA9PiB7XG4gIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJwaW5jaGdyYWItYnVpbGRcIl0nKSBhcyBIVE1MTWV0YUVsZW1lbnQgfCBudWxsO1xuICBpZiAoIW1ldGE/LmNvbnRlbnQpIHJldHVybiBudWxsO1xuICBjb25zdCBjb250ZW50ID0gbWV0YS5jb250ZW50O1xuICBjb25zdCBvdXQ6IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9ID0ge307XG4gIGNvbnN0IGNvbW1pdCA9IC9cXGJjb21taXQ6KFtcXHcuLV0rKS8uZXhlYyhjb250ZW50KT8uWzFdO1xuICBjb25zdCBicmFuY2ggPSAvXFxiYnJhbmNoOihbXFx3Li8tXSspLy5leGVjKGNvbnRlbnQpPy5bMV07XG4gIGNvbnN0IGJ1aWxkID0gL1xcYmJ1aWxkOihbXFx3Li8tXSspLy5leGVjKGNvbnRlbnQpPy5bMV07XG4gIGlmIChjb21taXQpIG91dC5jb21taXQgPSB0cmltVGV4dChjb21taXQsIDgwKTtcbiAgaWYgKGJyYW5jaCkgb3V0LmJyYW5jaCA9IHRyaW1UZXh0KGJyYW5jaCwgODApO1xuICBpZiAoYnVpbGQpIG91dC5idWlsZCA9IHRyaW1UZXh0KGJ1aWxkLCA4MCk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvdXQpLmxlbmd0aCA/IG91dCA6IG51bGw7XG59O1xuXG4vLyBBIFVSTCBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hhdCB0aGUgdXNlciB3YXMgbG9va2luZyBhdC5cbi8vIE1hbnkgU1BBcyBkcml2ZSByb3V0aW5nIHZpYSBxdWVyeSBwYXJhbXMgKGA/cm91dGU9c2V0dGluZ3NgKSwgaGFzaFxuLy8gcm91dGVzIChgIy91c2Vycy80MmApLCBvciBwYXRoIHNlZ21lbnRzLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gZnJvbVxuLy8gdGhlIFVSTCDigJQgcmVjZWl2ZXJzIHZlcmlmeSBhZ2FpbnN0IHRoZSBzY3JlZW5zaG90IGlmIHRoZXkgY2FyZS5cbmNvbnN0IGJ1aWxkUm91dGVTbmFwc2hvdCA9ICgpOiB7cGF0aG5hbWU/OiBzdHJpbmc7IHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgaGFzaD86IHN0cmluZzsgcm91dGVOYW1lPzogc3RyaW5nOyByb3V0ZVBhcmFtPzogc3RyaW5nfSA9PiB7XG4gIGNvbnN0IG91dDoge3BhdGhuYW1lPzogc3RyaW5nOyBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGhhc2g/OiBzdHJpbmc7IHJvdXRlTmFtZT86IHN0cmluZzsgcm91dGVQYXJhbT86IHN0cmluZ30gPSB7fTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICBpZiAodS5wYXRobmFtZSkgb3V0LnBhdGhuYW1lID0gdS5wYXRobmFtZTtcbiAgICBpZiAodS5oYXNoKSBvdXQuaGFzaCA9IHUuaGFzaDtcbiAgICBjb25zdCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBsZXQgblBhcmFtcyA9IDA7XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgdS5zZWFyY2hQYXJhbXMpIHtcbiAgICAgIGlmIChuUGFyYW1zID49IDE2KSBicmVhaztcbiAgICAgIHBhcmFtc1trXSA9IHRyaW1UZXh0KHYsIDIwMCk7XG4gICAgICBuUGFyYW1zKys7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkgb3V0LnF1ZXJ5ID0gcGFyYW1zO1xuICAgIC8vIENvbW1vbiBTUEEgcm91dGUgaGludHM6IGA/cm91dGU9c2V0dGluZ3NgLCBgP3RhYj1mb29gLCBgIy91c2Vycy80MmAuXG4gICAgY29uc3Qgcm91dGVRdWVyeSA9IHUuc2VhcmNoUGFyYW1zLmdldCgncm91dGUnKSA/PyB1LnNlYXJjaFBhcmFtcy5nZXQoJ3RhYicpID8/IHUuc2VhcmNoUGFyYW1zLmdldCgndmlldycpO1xuICAgIGlmIChyb3V0ZVF1ZXJ5KSBvdXQucm91dGVOYW1lID0gdHJpbVRleHQocm91dGVRdWVyeSwgODApO1xuICAgIGlmICh1Lmhhc2ggJiYgdS5oYXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IGhhc2hQYXRoID0gdS5oYXNoLnJlcGxhY2UoL14jXFwvPy8sICcnKTtcbiAgICAgIGNvbnN0IHNlZ3MgPSBoYXNoUGF0aC5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIGlmIChzZWdzLmxlbmd0aCkge1xuICAgICAgICBvdXQucm91dGVOYW1lID0gb3V0LnJvdXRlTmFtZSA/PyB0cmltVGV4dChzZWdzWzBdISwgODApO1xuICAgICAgICBpZiAoc2Vncy5sZW5ndGggPiAxKSBvdXQucm91dGVQYXJhbSA9IHRyaW1UZXh0KHNlZ3Muc2xpY2UoMSkuam9pbignLycpLCAyMDApO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDYXB0dXJlIGEgcmVkYWN0ZWQgc3RhdGUgc25hcHNob3Qgc28gcmVjZWl2ZXJzIGNhbiByZXBybyB0aGUgc2NyZWVuLlxuLy8gV2UgYXZvaWQgY29weWluZyBldmVyeXRoaW5nIOKAlCB0aGF0IHdvdWxkIGxlYWsgc2VjcmV0cyDigJQgYW5kIHN1cmZhY2Vcbi8vIG9ubHk6XG4vLyAgIOKAoiBsb2NhbFN0b3JhZ2Uga2V5cyArIHNpemVzIChOT1QgdmFsdWVzOyByZWNlaXZlcnMgbmVlZCB0byBrbm93XG4vLyAgICAgd2hhdCBzdG9yYWdlIHNoYXBlZCB0aGUgc2NyZWVuLCBub3QgdGhlIGNvbnRlbnRzKVxuLy8gICDigKIgY29va2llIG5hbWVzIChOTyB2YWx1ZXMsIGV2ZXIpXG4vLyAgIOKAoiBrbm93biBmZWF0dXJlLWZsYWcgY29udmVudGlvbnM6IGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWZsYWdzXCI+YFxuY29uc3QgYnVpbGRTdGF0ZVNuYXBzaG90ID0gKCk6IHtzdG9yYWdlS2V5cz86IHN0cmluZ1tdOyBzZXNzaW9uS2V5cz86IHN0cmluZ1tdOyBjb29raWVOYW1lcz86IHN0cmluZ1tdOyBmZWF0dXJlRmxhZ3M/OiBzdHJpbmd9IHwgbnVsbCA9PiB7XG4gIGNvbnN0IG91dDoge3N0b3JhZ2VLZXlzPzogc3RyaW5nW107IHNlc3Npb25LZXlzPzogc3RyaW5nW107IGNvb2tpZU5hbWVzPzogc3RyaW5nW107IGZlYXR1cmVGbGFncz86IHN0cmluZ30gPSB7fTtcbiAgdHJ5IHtcbiAgICBjb25zdCBsc0tleXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoICYmIGxzS2V5cy5sZW5ndGggPCAzMjsgaSsrKSB7XG4gICAgICBjb25zdCBrID0gbG9jYWxTdG9yYWdlLmtleShpKTtcbiAgICAgIGlmIChrKSBsc0tleXMucHVzaChrKTtcbiAgICB9XG4gICAgaWYgKGxzS2V5cy5sZW5ndGgpIG91dC5zdG9yYWdlS2V5cyA9IGxzS2V5cztcbiAgfSBjYXRjaCB7IC8qIFNlY3VyaXR5RXJyb3Igb24gY3Jvc3Mtb3JpZ2luIGZyYW1lcyAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3Qgc3NLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2Vzc2lvblN0b3JhZ2UubGVuZ3RoICYmIHNzS2V5cy5sZW5ndGggPCAzMjsgaSsrKSB7XG4gICAgICBjb25zdCBrID0gc2Vzc2lvblN0b3JhZ2Uua2V5KGkpO1xuICAgICAgaWYgKGspIHNzS2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBpZiAoc3NLZXlzLmxlbmd0aCkgb3V0LnNlc3Npb25LZXlzID0gc3NLZXlzO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgdHJ5IHtcbiAgICBjb25zdCBjb29raWVOYW1lcyA9IGRvY3VtZW50LmNvb2tpZVxuICAgICAgLnNwbGl0KCc7JylcbiAgICAgIC5tYXAoKGMpID0+IGMudHJpbSgpLnNwbGl0KCc9JylbMF0hKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLnNsaWNlKDAsIDMyKTtcbiAgICBpZiAoY29va2llTmFtZXMubGVuZ3RoKSBvdXQuY29va2llTmFtZXMgPSBjb29raWVOYW1lcztcbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIHRyeSB7XG4gICAgY29uc3QgZmxhZ01ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJwaW5jaGdyYWItZmxhZ3NcIl0nKSBhcyBIVE1MTWV0YUVsZW1lbnQgfCBudWxsO1xuICAgIGlmIChmbGFnTWV0YT8uY29udGVudCkgb3V0LmZlYXR1cmVGbGFncyA9IHRyaW1UZXh0KGZsYWdNZXRhLmNvbnRlbnQsIDQwMCk7XG4gIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICByZXR1cm4gT2JqZWN0LmtleXMob3V0KS5sZW5ndGggPyBvdXQgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkUGFnZUNvbnRleHQgPSAoKSA9PiB7XG4gIGNvbnN0IGN0eDogYW55ID0ge1xuICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICB0aXRsZTogdHJpbVRleHQoZG9jdW1lbnQudGl0bGUsIDIwMCksXG4gICAgdmlld3BvcnQ6IGJ1aWxkVmlld3BvcnRTbmFwc2hvdCgpLFxuICAgIHRva2VuczogY29sbGVjdFJvb3RDc3NWYXJzKCksXG4gICAgdXNlckFnZW50OiB0cmltVGV4dChuYXZpZ2F0b3IudXNlckFnZW50LCAyNDApLFxuICAgIGxhbmc6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJycsXG4gIH07XG4gIGNvbnN0IGdpdCA9IHJlYWRHaXRDb250ZXh0KCk7XG4gIGlmIChnaXQpIGN0eC5naXRDb250ZXh0ID0gZ2l0O1xuICBjb25zdCBmb2N1cyA9IGFjdGl2ZUZvY3VzU25hcHNob3QoKTtcbiAgaWYgKGZvY3VzKSBjdHguYWN0aXZlRm9jdXMgPSBmb2N1cztcbiAgY29uc3Qgcm91dGUgPSBidWlsZFJvdXRlU25hcHNob3QoKTtcbiAgaWYgKE9iamVjdC5rZXlzKHJvdXRlKS5sZW5ndGgpIGN0eC5yb3V0ZSA9IHJvdXRlO1xuICBjb25zdCBzdGF0ZSA9IGJ1aWxkU3RhdGVTbmFwc2hvdCgpO1xuICBpZiAoc3RhdGUpIGN0eC5zdGF0ZSA9IHN0YXRlO1xuICByZXR1cm4gY3R4O1xufTtcblxuLy8gLS0tLSBFbGVtZW50LXNldCBzZW1hbnRpY3MgZm9yIHJ1YmJlci1iYW5kIGRyYWcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBTVFJPTkdfSURfUkUgPSAvXihyYWRpeC18aGVhZGxlc3N1aS18bXVpLXw6clswLTlhLXpdKzopL2k7XG5jb25zdCBpc1N0cm9uZ01hcmtlciA9IChlbDogRWxlbWVudCk6IGJvb2xlYW4gPT5cbiAgQm9vbGVhbihcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdGlkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlc3QnKSB8fFxuICAgIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jeScpIHx8IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1xYScpIHx8XG4gICAgZWwuZ2V0QXR0cmlidXRlKCdyb2xlJykgfHwgKGVsLmlkICYmICFTVFJPTkdfSURfUkUudGVzdChlbC5pZCkpLFxuICApO1xuY29uc3QgTUVESVVNX1RBR1MgPSBuZXcgU2V0KFsnQlVUVE9OJywgJ0EnLCAnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJywgJ0ZPUk0nXSk7XG5jb25zdCBXRUFLX1RBR1MgPSBuZXcgU2V0KFsnQVJUSUNMRScsICdTRUNUSU9OJywgJ05BVicsICdIRUFERVInLCAnRk9PVEVSJywgJ0xJJ10pO1xuY29uc3QgaXNNZWRpdW1NYXJrZXIgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IE1FRElVTV9UQUdTLmhhcyhlbC50YWdOYW1lKTtcbmNvbnN0IGlzV2Vha01hcmtlciA9IChlbDogRWxlbWVudCk6IGJvb2xlYW4gPT5cbiAgV0VBS19UQUdTLmhhcyhlbC50YWdOYW1lKSB8fCAvXkhbMS02XSQvLnRlc3QoZWwudGFnTmFtZSk7XG5cbi8vIFNuYXAgaG92ZXIvY2xpY2sgdGFyZ2V0IHRvIGl0cyBuZWFyZXN0IFwiY29tcG9uZW50XCIgYW5jZXN0b3IuIFdpdGhvdXRcbi8vIHRoaXMsIGFsdC1ob3ZlcmluZyBhIGJ1dHRvbiB3aXRoIHN0cnVjdHVyZWQgY2hpbGRyZW4gKGljb24gc3BhbiArXG4vLyBsYWJlbCBzcGFuKSBzZWxlY3RzIHdoaWNoZXZlciBpbm5lciBzcGFuIHRoZSBjdXJzb3IgaGFwcGVuZWQgdG8gbGFuZFxuLy8gb24g4oCUIHRocmVlIGRpZmZlcmVudCBjYXB0dXJlcyBvZiB0aGUgXCJzYW1lIGNvbXBvbmVudFwiIGRlcGVuZGluZyBvbiBhXG4vLyBmZXctcGl4ZWwgbW91c2UgZGlmZmVyZW5jZS4gU25hcCB3YWxrcyB1cCB0aGUgRE9NIGxvb2tpbmcgZm9yIHRoZVxuLy8gY2xvc2VzdCBTVFJPTkcgb3IgTUVESVVNIG1hcmtlciB3aXRoaW4gYG1heERlcHRoYCBsZXZlbHMgYW5kIHJldHVybnNcbi8vIHRoYXQgYW5jZXN0b3I7IGZhbGxzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGVsZW1lbnQgd2hlbiBub25lIGlzIGZvdW5kLlxuLy9cbi8vIEFsc28gZm9sZHMgdGhlIGV4aXN0aW5nIFwia25vd24gY2FwdHVyZWQgc2VsZWN0b3IgYW5jZXN0b3JcIiBsb29rdXAgaW50b1xuLy8gb25lIGhlbHBlciBzbyBjYWxsZXJzIGRvbid0IGhhdmUgdG8gY2hhaW4gdHdvIHBhc3Nlcy5cbi8vIFRydWUgd2hlbiBhbiBlbGVtZW50IGZpbGxzIDkwJSsgb2YgdGhlIHZpZXdwb3J0IGluIGJvdGggYXhlcy4gVGhlXG4vLyBydW50aW1lIGZpbHRlcnMgb3V0IHN1Y2ggY2FwdHVyZXMgKGFsdC1jbGljayBza2lwcywgZHJhZyByZWplY3RzKVxuLy8gYmVjYXVzZSBncmFiYmluZyB0aGUgcGFnZSB3cmFwcGVyIGlzIG5ldmVyIHRoZSB1c2VyJ3MgaW50ZW50LiBVc2VkXG4vLyBoZXJlIGluIHNuYXBUb0NvbXBvbmVudCB0byBBVk9JRCB3YWxraW5nIHVwIHRvIGEgaHVnZSBhbmNlc3RvciDigJRcbi8vIHRoYXQgcHJvZHVjZWQgc2lsZW50IGZhaWx1cmVzIG9uIHNpdGVzIGxpa2Ugd3Jhbm5nbGUuY29tL2Fib3V0XG4vLyB3aGVyZSB0aGUgbmVhcmVzdCBTVFJPTkcgbWFya2VyIGlzIGA8bWFpbiBpZD1cIm1haW5cIj5gIChodWdlKSwgc29cbi8vIHRoZSB1c2VyJ3MgYWx0LWNsaWNrIG9uIGEgaGVhZGluZyBnb3Qgc25hcHBlZCB0byA8bWFpbj4gYW5kIHRoZW5cbi8vIHJlamVjdGVkIGZvciBiZWluZyBodWdlLCB3aXRoIG5vIGNhcHR1cmUgYW5kIG5vIHJpbmcuXG5jb25zdCBpc0h1Z2VWaWV3cG9ydEZpbGwgPSAoZWw6IEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiB0cnVlO1xuICBjb25zdCByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiByLndpZHRoID49IHdpbmRvdy5pbm5lcldpZHRoICogMC45ICYmIHIuaGVpZ2h0ID49IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOTtcbn07XG5cbmV4cG9ydCBjb25zdCBzbmFwVG9Db21wb25lbnQgPSAoXG4gIHRndDogRWxlbWVudCxcbiAga25vd25DYXB0dXJlZDogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgbWF4RGVwdGggPSA0LFxuKTogRWxlbWVudCA9PiB7XG4gIC8vIEZpcnN0IHBhc3M6IHByZWZlciBhIGtub3duLWNhcHR1cmVkIGFuY2VzdG9yIChzbyByZS1ob3ZlcmluZyBhIGNoaWxkXG4gIC8vIG9mIGFuIGFscmVhZHktc2F2ZWQgY2FyZCBzbmFwcyB0byB0aGUgY2FyZCkuXG4gIGlmIChrbm93bkNhcHR1cmVkLnNpemUpIHtcbiAgICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IHRndDtcbiAgICB3aGlsZSAoY3VyICYmIGN1ciAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgZm9yIChjb25zdCBzZWwgb2Yga25vd25DYXB0dXJlZCkge1xuICAgICAgICB0cnkgeyBpZiAoY3VyLm1hdGNoZXMoc2VsKSkgcmV0dXJuIGN1cjsgfSBjYXRjaCB7IC8qIGludmFsaWQgc2VsZWN0b3IgKi8gfVxuICAgICAgfVxuICAgICAgY3VyID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICB9XG4gIC8vIFNlY29uZCBwYXNzOiBuZWFyZXN0IFNUUk9ORyBvciBNRURJVU0gbWFya2VyIHdpdGhpbiBkZXB0aCwgQlVUXG4gIC8vIHNraXAgYW55IGFuY2VzdG9yIHRoYXQncyB2aWV3cG9ydC1zaXplZC4gVGhlIHJ1bnRpbWUncyBodWdlLWVsZW1lbnRcbiAgLy8gZmlsdGVyIHJlamVjdHMgaHVnZSBjYXB0dXJlcywgc28gc25hcHBpbmcgdGhlcmUgaXMgYSBndWFyYW50ZWVkXG4gIC8vIHNpbGVudCBtaXNzLiBJZiB0aGUgbWFya2VyIHdlIGZpbmQgaXMgaHVnZSwga2VlcCB3YWxraW5nIGFuZCB0cnlcbiAgLy8gdGhlIG5leHQ7IGlmIG5vdGhpbmcgaW4tZGVwdGggaXMgbm9uLWh1Z2UsIHJldHVybiB0aGUgb3JpZ2luYWxcbiAgLy8gY2xpY2sgdGFyZ2V0ICh3aGljaCBjYXB0dXJlRW50cnkgdGhlbiB2YWxpZGF0ZXMgc2VwYXJhdGVseSkuXG4gIGxldCBjdXI6IEVsZW1lbnQgfCBudWxsID0gdGd0O1xuICBmb3IgKGxldCBpID0gMDsgaSA8PSBtYXhEZXB0aCAmJiBjdXIgJiYgY3VyICE9PSBkb2N1bWVudC5ib2R5OyBpKyspIHtcbiAgICBpZiAoKGlzU3Ryb25nTWFya2VyKGN1cikgfHwgaXNNZWRpdW1NYXJrZXIoY3VyKSkgJiYgIWlzSHVnZVZpZXdwb3J0RmlsbChjdXIpKSByZXR1cm4gY3VyO1xuICAgIGN1ciA9IGN1ci5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiB0Z3Q7XG59O1xuXG4vLyAzRC1hcHAtc3R5bGUgcmlnb3JvdXMgc2VsZWN0aW9uOiBwcmUtY29sbGVjdCBhIFNUQUJMRSBjYW5kaWRhdGUgc2V0IHdoZW5cbi8vIHRoZSBkcmFnIHN0YXJ0cyAoYHBpY2tEcmFnQ2FuZGlkYXRlc2ApLCB0aGVuIGBlbGVtZW50c0luUmVjdGAgZmlsdGVyc1xuLy8gdGhhdCBzZXQgYnkgdGhlIHJ1YmJlci1iYW5kIHJlY3QgZWFjaCBmcmFtZS4gVGhlIHBvb2wgaXMgbG9ja2VkIG9uY2Ugc29cbi8vIHRoZSBydWJiZXIgYmFuZCBncm93cyAvIHNocmlua3MgbW9ub3RvbmljYWxseSB3aXRoIHJlY3Qgc2l6ZSDigJQgbm8gcmFuZG9tXG4vLyBzZWxlY3RzL2Rlc2VsZWN0cyBtaWQtZHJhZy5cbi8vXG4vLyBFYXJsaWVyIHRoaXMgZnVuY3Rpb24gcGlja2VkIGEgc2luZ2xlIFwidGllclwiIChTVFJPTkc9ZGF0YS10ZXN0aWQg4oaSXG4vLyBNRURJVU09cm9sZS9pZC9idXR0b24g4oaSIFdFQUs9Y2xhc3MpLCBwcmVmZXJyaW5nIHdoaWNoZXZlciBoYWQg4omlMiBoaXRzLFxuLy8gYW5kIHNpbGVudGx5IEVYQ0xVREVEIGV2ZXJ5dGhpbmcgb3V0c2lkZSB0aGF0IHRpZXIgZm9yIHRoZSByZXN0IG9mIHRoZVxuLy8gZHJhZy4gVGhlIHVzZXIgcmVwb3J0ZWQgaXQgZmVsdCBsaWtlIHRoZSBtYXJxdWVlIHdhcyBcImRpc2NyaW1pbmF0aW5nIG9uXG4vLyB6IG9yIHRyZWUgdGllclwiIOKAlCBleGFjdGx5IHRoZSBzeW1wdG9tIG9mIGEgc3Ryb25nbHktbWFya2VkIHNpYmxpbmdcbi8vIGhpamFja2luZyB0aGUgdGllciBhbmQgZmlsdGVyaW5nIG91dCBhbiBlbGVtZW50IHRoZSB1c2VyIGNvdWxkIGNsZWFybHlcbi8vIHNlZSBpbnNpZGUgdGhlIHJlY3QuIFdlIG5vdyByZXR1cm4gZXZlcnkgdmlzaWJsZSBub24tb3ZlcmxheSBlbGVtZW50O1xuLy8gdGhlIGlubmVybW9zdC1vbmx5IGZpbHRlciBpbiBlbGVtZW50c0luUmVjdCBkcm9wcyBhbmNlc3RvciBtYXRjaGVzIHdoZW5cbi8vIGEgZGVzY2VuZGFudCBhbHNvIG1hdGNoZXMsIHdoaWNoIGdpdmVzIHRoZSBpbnR1aXRpdmUgXCJzZWxlY3Qgd2hhdCdzIGluXG4vLyB0aGUgcmVjdFwiIGJlaGF2aW9yIHdpdGhvdXQgdGhlIGludmlzaWJsZSBleGNsdXNpb24uXG4vL1xuLy8gU2VsZWN0aW9uIG1vZGUgKGRyYWcgZGlyZWN0aW9uKTpcbi8vICAg4oCiICdmdWxsJyAgICDigJQgZWxlbWVudCBiYm94IEZVTExZIEVOQ0xPU0VEIGJ5IHRoZSByZWN0IChsZWZ04oaScmlnaHQpLlxuLy8gICDigKIgJ3BhcnRpYWwnIOKAlCBlbGVtZW50IGJib3ggSU5URVJTRUNUUyB0aGUgcmVjdCAocmlnaHTihpJsZWZ0KS5cbmV4cG9ydCBjb25zdCBwaWNrRHJhZ0NhbmRpZGF0ZXMgPSAob3ZlcmxheUhvc3Q6IEVsZW1lbnQpOiBFbGVtZW50W10gPT4ge1xuICBjb25zdCBhbGxSYXcgPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbCgnKicpKTtcbiAgcmV0dXJuIGFsbFJhdy5maWx0ZXIoKGVsKSA9PiB7XG4gICAgaWYgKG92ZXJsYXlIb3N0LmNvbnRhaW5zKGVsKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoci53aWR0aCA9PT0gMCB8fCByLmhlaWdodCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIERyb3AgdGhlIHBhZ2Utc3Bhbm5pbmcgd3JhcHBlcnMgKGJvZHksIGZ1bGwtYmxlZWQgc2VjdGlvbnMsIGV0Yy4pO1xuICAgIC8vIHRob3NlIHdvdWxkIGFsd2F5cyBtYXRjaCB0aGUgcmVjdCBhbmQgY3Jvd2Qgb3V0IHRoZWlyIGNoaWxkcmVuLlxuICAgIGlmIChyLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggKiAwLjkgJiYgci5oZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgZWxlbWVudHNJblJlY3QgPSAoXG4gIGNhbmRpZGF0ZXM6IHJlYWRvbmx5IEVsZW1lbnRbXSxcbiAgeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcixcbiAgbW9kZTogJ3BhcnRpYWwnIHwgJ2Z1bGwnID0gJ3BhcnRpYWwnLFxuKTogRWxlbWVudFtdID0+IHtcbiAgY29uc3QgbWluWCA9IE1hdGgubWluKHgxLCB4Mik7XG4gIGNvbnN0IG1heFggPSBNYXRoLm1heCh4MSwgeDIpO1xuICBjb25zdCBtaW5ZID0gTWF0aC5taW4oeTEsIHkyKTtcbiAgY29uc3QgbWF4WSA9IE1hdGgubWF4KHkxLCB5Mik7XG4gIGNvbnN0IG1hdGNoZXM6IEVsZW1lbnRbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGVsIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBjb25zdCByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKHIud2lkdGggPT09IDAgfHwgci5oZWlnaHQgPT09IDApIGNvbnRpbnVlO1xuICAgIGlmIChtb2RlID09PSAnZnVsbCcpIHtcbiAgICAgIGlmIChyLmxlZnQgPCBtaW5YIHx8IHIudG9wIDwgbWluWSB8fCByLnJpZ2h0ID4gbWF4WCB8fCByLmJvdHRvbSA+IG1heFkpIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoci5yaWdodCA8IG1pblggfHwgci5sZWZ0ID4gbWF4WCB8fCByLmJvdHRvbSA8IG1pblkgfHwgci50b3AgPiBtYXhZKSBjb250aW51ZTtcbiAgICB9XG4gICAgbWF0Y2hlcy5wdXNoKGVsKTtcbiAgfVxuICAvLyBJbm5lcm1vc3Qg4oCUIGRyb3AgYW5jZXN0b3JzIHRoYXQgY29udGFpbiBhbm90aGVyIG1hdGNoLiBTdGFibGUgYmVjYXVzZVxuICAvLyBpdCBvbmx5IGRlcGVuZHMgb24gdGhlIG1hdGNoZXMgc2V0LCBub3Qgb24gcmFua3MuXG4gIC8vXG4gIC8vIE5vIGFydGlmaWNpYWwgY2FwLiBUaGUgZWFybGllciAyNC1lbGVtZW50IGNlaWxpbmcgZXhpc3RlZCB0byBrZWVwXG4gIC8vIHJpbmcgcmVwYWludCBjb3N0IHByZWRpY3RhYmxlIGluIHdvcnN0LWNhc2UgXCJydWJiZXItYmFuZCB0aGUgd2hvbGVcbiAgLy8gdmlld3BvcnRcIiBkcmFncywgYnV0IGl0IGJlY2FtZSB1c2VyLXZpc2libGU6IGEgcmVhbCBzZWxlY3Rpb24gb2ZcbiAgLy8gfjMwIGdyaWQgY2VsbHMgd291bGQgc2lsZW50bHkgZHJvcCB0aGUgdHJhaWxpbmcgb25lcyB3aXRoIG5vXG4gIC8vIGZlZWRiYWNrLiBUd28gc2FmZXIgbWl0aWdhdGlvbnMgbm93IGtlZXAgcGVyZm9ybWFuY2UgYm91bmRlZDpcbiAgLy8gICDigKIgcGlja0RyYWdDYW5kaWRhdGVzIGFscmVhZHkgdHJpbXMgYm9keSAvIHBhZ2Utc3Bhbm5pbmcgd3JhcHBlcnNcbiAgLy8gICAgICh0aGUgZWxlbWVudHMgdGhhdCB3b3VsZCBvdGhlcndpc2UgZG9taW5hdGUgYW55IHJlY3QpLlxuICAvLyAgIOKAoiBjb250ZW50LXNjcmlwdCBwYWludHMgcmluZ3MgdmlhIGEgZGlmZiAob25seSBORVcgZWxlbWVudHMgZ2V0XG4gIC8vICAgICBhIHJpbmcpLCBzbyBhIHN0YWJsZSAyMDAtZWxlbWVudCBzZWxlY3Rpb24gaXMgb25lIHBhaW50LCBub3RcbiAgLy8gICAgIDIwMCBwYWludHMgcGVyIGZyYW1lLlxuICAvLyBJZiBhIGZ1dHVyZSBwYWdlIGdlbnVpbmVseSBwcm9kdWNlcyB0aG91c2FuZHMgb2YgaW5uZXJtb3N0IG1hdGNoZXNcbiAgLy8gd2UnbGwgcmV2aXNpdDsgdW50aWwgdGhlbiwgc2hpcCB3aGF0IHRoZSB1c2VyIGFjdHVhbGx5IGRyZXcuXG4gIHJldHVybiBtYXRjaGVzLmZpbHRlcigoYSkgPT4gIW1hdGNoZXMuc29tZSgoYikgPT4gYSAhPT0gYiAmJiBhLmNvbnRhaW5zKGIpKSk7XG59O1xuIiwKICAgICIvLyBTaGFyZWQgdHlwZXMgJiBtZXNzYWdlIHByb3RvY29sIGJldHdlZW4gY29udGVudCBzY3JpcHQsIHNpZGUgcGFuZWwsIGFuZFxuLy8gYmFja2dyb3VuZCBzZXJ2aWNlIHdvcmtlci5cblxuZXhwb3J0IHR5cGUgUmVjdCA9IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgVmlld3BvcnQgPSB7XG4gIHc6IG51bWJlcjsgaDogbnVtYmVyOyBkcHI6IG51bWJlcjtcbiAgLy8gVXNlci1wcmVmZXJlbmNlIG1lZGlhLXF1ZXJ5IHN0YXRlIGF0IGNhcHR1cmUgdGltZS4gTGV0cyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYXNvbiBhYm91dCB3aHkgY2FwdHVyZWQgYXBwZWFyYW5jZSBkaWZmZXJzIGJldHdlZW4gc2Vzc2lvbnNcbiAgLy8gKGUuZy4gZGFyay1tb2RlIHZzIGxpZ2h0LW1vZGUgb2YgdGhlIHNhbWUgY29tcG9uZW50KS5cbiAgY29sb3JTY2hlbWU/OiAnZGFyaycgfCAnbGlnaHQnO1xuICByZWR1Y2VkTW90aW9uPzogYm9vbGVhbjtcbiAgLy8gRG9jdW1lbnQgZGlyZWN0aW9uIChgbHRyYCAvIGBydGxgKSDigJQgZGlmZmVyZW50IGZyb20gdmlld3BvcnQgc2l6ZSxcbiAgLy8gY2hhbmdlcyB0aGUgbWVhbmluZyBvZiBgc3RhcnRgL2BlbmRgIGluIENTUyBhbmQgdGhlIHNlbnNlIG9mXG4gIC8vIGByZWN0LnhgLiBDYXB0dXJlZCBwZXIgcGFnZSBoZWFkZXIgc28gUlRMIGNhcHR1cmVzIGRvbid0IGdldFxuICAvLyBzaWxlbnRseSBtaXhlZCB3aXRoIExUUiBvbmVzLlxuICBkaXJlY3Rpb24/OiAnbHRyJyB8ICdydGwnO1xuICAvLyBCcm93c2VyIHpvb20gbGV2ZWwuIGB2aXN1YWxWaWV3cG9ydC5zY2FsZWAgcmVwb3J0cyB0aGUgcGluY2gtem9vbVxuICAvLyBmYWN0b3I7IHZhbHVlcyAhPSAxIG1lYW4gdGhlIHVzZXIgaGFzIHpvb21lZCBpbi9vdXQgYW5kIGFueSBsYXlvdXRcbiAgLy8gYnVnIHRoZXkncmUgY2FwdHVyaW5nIG1heSBub3QgcmVwcm8gYXQgZGVmYXVsdCB6b29tLlxuICB6b29tPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgRnJhbWV3b3JrSW5mbyA9IHtcbiAgZnJhbWV3b3JrOiAncmVhY3QnIHwgJ3Z1ZScgfCAnbGl0JyB8ICdzdGVuY2lsJyB8ICdzdmVsdGUnIHwgJ3dlYi1jb21wb25lbnQnO1xuICBuYW1lPzogc3RyaW5nO1xuICBkaXNwbGF5TmFtZT86IHN0cmluZztcbiAgc291cmNlPzoge2ZpbGU/OiBzdHJpbmcgfCBudWxsOyBsaW5lPzogbnVtYmVyIHwgbnVsbH07XG4gIC8vIFVwLXRyZWUgY29tcG9uZW50IGFuY2VzdHJ5IChpbm5lcm1vc3QgZmlyc3QpLiBGb3IgUmVhY3QsIHdhbGtlZCB2aWFcbiAgLy8gZmliZXIgYHJldHVybmAgY2hhaW47IGZvciBWdWUsIHZpYSBgX192dWVQYXJlbnRDb21wb25lbnQucGFyZW50YC5cbiAgLy8gVGhlIGNvbXBvbmVudCBuYW1lIGFsb25lIGRvZXNuJ3QgdGVsbCBhbiBhZ2VudCB3aGljaCBmaWxlIG93bnMgdGhlXG4gIC8vIHJlbmRlcmluZyDigJQgdGhlIGNoYWluIGhlbHBzIGl0IGdyZXAgdXB3YXJkIHRvIGZpbmQgdGhlIHJvdXRlXG4gIC8vIGNvbXBvbmVudCwgdGhlbiBkcmlsbCBpbnRvIHRoZSBvd25pbmcgZmlsZS5cbiAgY2hhaW4/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIEFuY2VzdG9yID0ge1xuICB0YWc6IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgTWF0Y2hlZFJ1bGUgPSB7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIGRlY2xhcmF0aW9ucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1lZGlhPzogc3RyaW5nO1xuICAvLyBXYXMgdGhlIEBtZWRpYSBxdWVyeSB0aGF0IHdyYXBzIHRoaXMgcnVsZSBhY3R1YWxseSBtYXRjaGVkIGF0XG4gIC8vIGNhcHR1cmUgdGltZT8gYHRydWVgID0gYWN0aXZlLFxuICAvLyBgZmFsc2VgID0gbWF0Y2hlZCB0aGUgc2VsZWN0b3IgYnV0IGluYWN0aXZlIChlLmcuIG1vYmlsZSBydWxlc1xuICAvLyBjYXB0dXJlZCBvbiBhIGRlc2t0b3Agdmlld3BvcnQpLCBgdW5kZWZpbmVkYCA9IG1hdGNoTWVkaWEgdGhyZXcuXG4gIG1lZGlhQWN0aXZlPzogYm9vbGVhbjtcbn07XG5cbi8vIFN5bnRoZXRpYyBoaW50cyBQaW5jaEdyYWIgYWRkcyB0byBlbnRyaWVzIOKAlCBrZXB0IGRpc3RpbmN0IGZyb20gYGF0dHJzYFxuLy8gKHJlYWwgRE9NIGF0dHJpYnV0ZXMpIHNvIGNvbnN1bWVycyBjYW4gdGVsbCB3aGF0IGNhbWUgZnJvbSB0aGUgcGFnZSB2c1xuLy8gd2hhdCB0aGUgY2FwdHVyZSBwaXBlbGluZSBpbmplY3RlZC5cbmV4cG9ydCB0eXBlIEVudHJ5SGludHMgPSB7XG4gIGZvcm1hdD86IHN0cmluZzsgICAgIC8vIGlucHV0IGZvcm1hdCBoaW50IChlLmcuICdZWVlZLU1NLUREJylcbiAgdmFsdWVNYXNrZWQ/OiBib29sZWFuOyAvLyBwYXNzd29yZCB2YWx1ZSB3YXMgbWFza2VkIGF0IGNhcHR1cmUgdGltZVxufTtcblxuZXhwb3J0IHR5cGUgRW50cnkgPSB7XG4gIC8vIFN0YWJsZSBwZXItZW50cnkgdXVpZC4gR2VuZXJhdGVkIGF0IGNhcHR1cmUgdGltZS4gRGlzdGluY3QgZnJvbSBgbmBcbiAgLy8gKGRpc3BsYXkgc2VxdWVuY2UpIGFuZCBmcm9tIGBpZGAgKERPTSBodG1sIGlkIGF0dHJpYnV0ZSkuIEZvcmVpZ24ta2V5XG4gIC8vIHRhcmdldCBmb3IgRmVlZGJhY2tNZXNzYWdlLnBhcmVudElkLlxuICB1aWQ6IHN0cmluZztcbiAgLy8gRm9yZWlnbiBrZXkgaW50byB0aGUgc2Vzc2lvbiByb3cgKFBhZ2VNZXNzYWdlLnNlc3Npb25JZCkuIExldHMgYVxuICAvLyBjb25zdW1lciBsaW5rIGNhcHR1cmVzIGJhY2sgdG8gXCJ3aGljaCBwYWdlLWxvYWQgY29udGV4dCBkaWQgdGhleVxuICAvLyBjb21lIGZyb20/XCIgd2l0aG91dCBkZXBlbmRpbmcgb24gVVJMIHN0cmluZyBlcXVhbGl0eSwgd2hpY2ggYnJlYWtzXG4gIC8vIG9uIGhhc2ggbmF2aWdhdGlvbiwgcXVlcnktcGFyYW0gc3dhcHMsIGFuZCBTUEEgcm91dGluZy4gU2V0IGJ5IHRoZVxuICAvLyBzaWRlIHBhbmVsIGF0IG1lc3NhZ2UtcmVjZWl2ZSB0aW1lLCBub3Qgb24gdGhlIHBhZ2Ugc2lkZS5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xuICBuOiBudW1iZXI7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0YWc6IHN0cmluZztcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgb3V0ZXJIVE1MPzogc3RyaW5nO1xuICB0ZXh0Pzogc3RyaW5nO1xuICAvLyBUaGUgdmlzdWFsbHktcmVuZGVyZWQgZm9ybSB3aGVuIENTUyBgdGV4dC10cmFuc2Zvcm1gIGlzIHNldC4gQ2FwdHVyZWRcbiAgLy8gYWxvbmdzaWRlIGB0ZXh0YCAod2hpY2ggaXMgdGhlIHNvdXJjZS10cnV0aCBgdGV4dENvbnRlbnRgKSBzbyBhbiBMTE1cbiAgLy8gY2FuIGRpc2FtYmlndWF0ZSBiZXR3ZWVuIGUuZy4gc291cmNlIGBSZWZyZXNoYCBhbmQgcmVuZGVyZWQgYFJFRlJFU0hgXG4gIC8vIHdpdGhvdXQgZmFsc2UtZ3JlcHBpbmcgYWdhaW5zdCBlaXRoZXIuXG4gIHJlbmRlcmVkVGV4dD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgYWNjZXNzaWJsZU5hbWU/OiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nOyAgICAgICAgICAgIC8vIHRoZSBET00gaHRtbCBpZCBhdHRyaWJ1dGUgKHVuY2hhbmdlZClcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG4gIGF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgLy8gcmVhbCBET00gYXR0cmlidXRlcyBvbmx5XG4gIGhpbnRzPzogRW50cnlIaW50czsgICAgIC8vIHN5bnRoZXRpYyBjYXB0dXJlLXRpbWUgaGludHNcbiAgcmVjdDogUmVjdDtcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICBpblNoYWRvd0RPTT86IGJvb2xlYW47XG4gIC8vIENTUyBzZWxlY3RvciBmb3IgdGhlIHNoYWRvdyBob3N0IHdoZW4gYGluU2hhZG93RE9NYCBpcyB0cnVlLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgKG9yIHRoZSBwYW5lbCdzIHJlLXZhbGlkYXRpb24gcGFzcykgZmluZCB0aGUgaG9zdCBlbGVtZW50XG4gIC8vIHNpbmNlIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsYCBkb2Vzbid0IHBpZXJjZSBzaGFkb3cgcm9vdHMuXG4gIHNoYWRvd0hvc3Q/OiBzdHJpbmc7XG4gIGNvbXBvbmVudFJvb3Q/OiBzdHJpbmc7XG4gIGFuY2VzdG9ycz86IEFuY2VzdG9yW107XG4gIGNvbXBvbmVudD86IEZyYW1ld29ya0luZm87XG4gIC8vIFJlYWN0IGV2ZW50IGhhbmRsZXIgbmFtZXMgcHJvYmVkIGZyb20gYF9fcmVhY3RQcm9wcyQ8a2V5PmAg4oCUIGFuc3dlcnNcbiAgLy8gXCJ3aGljaCBoYW5kbGVyIGZpcmVzIHdoZW4gdGhpcyBpcyBjbGlja2VkP1wiIHdpdGhvdXQgYW4gTExNIGhhdmluZyB0b1xuICAvLyBncmVwIHRoZSBjb2RlYmFzZS4gSW4gZGV2IGJ1aWxkcyB0aGVzZSBhcmUgcmVhbCBmdW5jdGlvbiBuYW1lczsgaW5cbiAgLy8gcHJvZCB0aGV5J3JlIG1pbmlmaWVkIGJ1dCBzdGlsbCBhbmNob3ItYWJsZS5cbiAgZXZlbnRzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gaHRteCAvIFN0aW11bHVzIC8gQWxwaW5lIC8gVHVyYm8gd2lyaW5nIG9uIHRoZSBlbGVtZW50LiBTZXJ2ZXItXG4gIC8vIHJlbmRlcmVkIGFwcHMgZG9uJ3QgaGF2ZSBSZWFjdCBmaWJlcnMg4oCUIGZvciB0aGVtLCB0aGlzIElTIHRoZVxuICAvLyBjb21wb25lbnQgc2hhcGUuXG4gIGJlaGF2aW9yQXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBUcnVlIHdoZW4gYGVsLmdldEFuaW1hdGlvbnMoKWAgcmVwb3J0ZWQgYW4gYWN0aXZlbHktcGxheWluZ1xuICAvLyBhbmltYXRpb24gYXQgY2FwdHVyZSB0aW1lLiBUZWxscyB0aGUgY29uc3VtZXIgdGhhdCBjYXB0dXJlZCByZWN0IC9cbiAgLy8gdHJhbnNmb3JtIC8gb3BhY2l0eSBtYXkgYmUgYXQgYW4gaW50ZXJwb2xhdGVkIG1pZC1hbmltYXRpb24gdmFsdWUuXG4gIGlzQW5pbWF0aW5nPzogYm9vbGVhbjtcbiAgLy8gRm9yIGVsZW1lbnRzIHJlbmRlcmVkIGludG8gYSBgPGNhbnZhcz5gLCB0aGUgRE9NIGdpdmVzIHVzIGVzc2VudGlhbGx5XG4gIC8vIG5vdGhpbmcgYWJvdXQgd2hhdCB3YXMgY2xpY2tlZCDigJQgdGhlIGNhbnZhcyBoYXMgbm8gY2hpbGRyZW4sIG5vXG4gIC8vIHRleHQsIG5vIG1lYW5pbmdmdWwgc2VsZWN0b3JzIGJlbG93IHRoZSBjYW52YXMgaXRzZWxmLiBDYXB0dXJlIHRoZVxuICAvLyBjbGljayBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY2FudmFzJ3MgYm91bmRpbmcgYm94IHNvIGEgZG93bnN0cmVhbVxuICAvLyBjb25zdW1lciBjYW4gY29ycmVsYXRlIChlLmcuIGFnYWluc3QgYSBEYXRhZG9nIC8gVGFibGVhdSAvIGNoYXJ0aW5nXG4gIC8vIGxpYnJhcnkgdGhhdCBleHBvc2VzIGRhdGEtcG9pbnQgY29vcmRpbmF0ZXMpLiBDb29yZGluYXRlcyBhcmUgQ1NTXG4gIC8vIHBpeGVsczsgbXVsdGlwbHkgYnkgYHZpZXdwb3J0LmRwcmAgdG8gZ2V0IGRldmljZSBwaXhlbHMuXG4gIGNhbnZhc0NsaWNrPzoge1xuICAgIG9mZnNldFg6IG51bWJlcjtcbiAgICBvZmZzZXRZOiBudW1iZXI7XG4gICAgY2FudmFzVzogbnVtYmVyO1xuICAgIGNhbnZhc0g6IG51bWJlcjtcbiAgICBjYW52YXNTZWxlY3Rvcjogc3RyaW5nO1xuICB9O1xuICAvLyBDb250ZW50ZWRpdGFibGUgcmljaC10ZXh0IGVkaXRvciBjb250ZXh0LiBQb3B1bGF0ZWQgd2hlbiB0aGUgY2FwdHVyZWRcbiAgLy8gbm9kZSBpcywgb3IgbGl2ZXMgaW5zaWRlLCBhIGBbY29udGVudGVkaXRhYmxlPXRydWVdYCBhbmNlc3Rvci4gTGV0c1xuICAvLyBhbiBMTE0gcmVhc29uaW5nIGFib3V0IGEgXCJjb3B5IGlzIHdyb25nXCIgLyBcInRoZSBlZGl0b3IgYnJlYWtzIHdoZW4gWFwiXG4gIC8vIGNhcHR1cmUga25vdyB3aGljaCBlZGl0b3IgbGlicmFyeSB0byBsb29rIGF0IOKAlCBzZWxlY3RvcnMgZ2VuZXJhdGVkXG4gIC8vIGJ5IFByb3NlTWlycm9yIC8gTGV4aWNhbCAvIGV0YyBhcmUgcnVudGltZS1pbnRlcm5hbCBhbmQgd29uJ3QgZ3JlcFxuICAvLyBhZ2FpbnN0IHVzZXIgY29kZSwgYnV0IHRoZSBMSUJSQVJZIHBvaW50ZXIgcm91dGVzIHRoZSBMTE0gdG8gdGhlXG4gIC8vIHJpZ2h0IHdyYXBwZXIgY29tcG9uZW50LlxuICBlZGl0b3I/OiB7XG4gICAga2luZDogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJztcbiAgICByb290U2VsZWN0b3I6IHN0cmluZztcbiAgICBjb250ZW50TGVuZ3RoOiBudW1iZXI7XG4gIH07XG4gIC8vIExhc3QgZmV3IERPTSBtdXRhdGlvbnMgQkVGT1JFIHRoZSBjbGljay4gUmVwcm8gY29udGV4dCBmb3IgYnVncyBsaWtlXG4gIC8vIFwiSSBjbGlja2VkIHRoZSB3cm9uZyBkcm9wZG93biBvcHRpb25cIiBvciBcInRoZSB2YWx1ZSBmbGlja2VyZWQgYmVmb3JlXG4gIC8vIEkgY2xpY2tlZCBpdFwiIOKAlCB3aXRob3V0IHRoaXMsIHRoZSBKU09OIHNuYXBzaG90cyBvbmx5IHRoZSBwb3N0LVxuICAvLyBtdXRhdGlvbiBzdGF0ZSwgbGVhdmluZyB0aGUgTExNIGJsaW5kIHRvIHdoYXQgdHJpZ2dlcmVkIHRoZVxuICAvLyBhcHBlYXJhbmNlIHRoZSB1c2VyIGNvbXBsYWluZWQgYWJvdXQuIFBpbmNoZ3JhYiBrZWVwcyBhbiA4LXNlY29uZFxuICAvLyByaW5nIGJ1ZmZlciBvZiBtdXRhdGlvbiByZWNvcmRzOyBjYXB0dXJlIGF0dGFjaGVzIHRoZSBtb3N0IHJlY2VudFxuICAvLyAzIGFzIGEgc25hcHNob3QuXG4gIGRvbU11dGF0aW9ucz86IERvbU11dGF0aW9uW107XG4gIHN0YXRlcz86IHN0cmluZ1tdOyAgICAgIC8vIGFjdGl2ZSBwc2V1ZG8tY2xhc3NlcyAod2FzIFJlY29yZDxzdHJpbmcsIHRydWU+IGluIHYxKVxuICAvLyBMb2NhdG9yIHF1YWxpdHk6IGhvdyBtYW55IGVsZW1lbnRzIGBzZWxlY3RvcmAgcmVzb2x2ZXMgdG8gaW4gaXRzXG4gIC8vIHNjb3BlICgxID0gdW5pcXVlKS4gSGlnaGVyIG1lYW5zIHRoZSBzZWxlY3RvciBpcyBhbWJpZ3VvdXMuXG4gIHNlbGVjdG9yTWF0Y2hDb3VudD86IG51bWJlcjtcbiAgLy8gRGlzYW1iaWd1YXRlZCBvcmRlcmluZyBmaWVsZHMuXG4gIC8vIGBuYCBpcyBwcmVzZXJ2ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXQgKGl0J3MgdGhlIGNhcHR1cmUtc2VxdWVuY2VcbiAgLy8gZGlzcGxheSBsYWJlbCBpbiB0aGUgc2lkZWJhcikuIFRoZSBuZXcgZmllbGRzIGFyZSBlbWl0LXRpbWUgb25seTpcbiAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCBzYW1lIGFzIGBuYCAoY2FwdHVyZSBzZXF1ZW5jZSB3aXRoaW4gc2Vzc2lvbilcbiAgLy8gICDigKIgZXZlbnRJbmRleCAgIOKAlCBtb25vdG9uaWMgcG9zaXRpb24gaW4gdGhlIEpTT05MIHN0cmVhbVxuICAvLyAgIOKAoiB2aXN1YWxPcmRlciAg4oCUIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHJhbmsgd2l0aGluIHRoZSBwYWdlXG4gIC8vICAg4oCiIGRpc3BsYXlMYWJlbCDigJQgaHVtYW4tZmFjaW5nIGxhYmVsIChtaXJyb3JzIGBuYCB0b2RheSlcbiAgY2FwdHVyZUluZGV4PzogbnVtYmVyO1xuICBldmVudEluZGV4PzogbnVtYmVyO1xuICB2aXN1YWxPcmRlcj86IG51bWJlcjtcbiAgZGlzcGxheUxhYmVsPzogc3RyaW5nO1xuICAvLyBHcm91cCBmbGF0dGVuaW5nIGZpZWxkcy5cbiAgLy8gVGhlIGdyb3VwIGhlYWQgY2FycmllcyBgZ3JvdXBNZW1iZXJVaWRzYCAoanVzdCB0aGUgSURzKTsgZWFjaFxuICAvLyBtZW1iZXIgZW1pdHMgYXMgaXRzIG93biB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZ1xuICAvLyBiYWNrIGF0IHRoZSBoZWFkLlxuICBncm91cE1lbWJlclVpZHM/OiBzdHJpbmdbXTtcbiAgZ3JvdXBVaWQ/OiBzdHJpbmc7XG4gIC8vIExpZ2h0d2VpZ2h0IGExMXkgYXVkaXQgY2FwdHVyZWQgYXQgY2xpY2sgdGltZS4gSGVhdmllciBjaGVja3NcbiAgLy8gKGZvY3VzLXZpc2libGUgc2NyZWVuc2hvdHMsIGF4ZSB2aW9sYXRpb25zKSBhcmUgbm90IHlldCB3aXJlZC5cbiAgYTExeT86IHtcbiAgICBjb250cmFzdFJhdGlvPzogbnVtYmVyO1xuICAgIGNvbnRyYXN0UGFzc2VzPzogJ0FBJyB8ICdBQUEnIHwgJ2ZhaWwnO1xuICAgIHRhYmJhYmxlPzogYm9vbGVhbjtcbiAgICBmb2N1c1Zpc2libGU/OiBib29sZWFuO1xuICB9O1xuICAvLyBQYXJlbnQgbGF5b3V0IGNvbnRleHQg4oCUIGZsZXgvZ3JpZC9vdmVyZmxvdy9zY3JvbGwvc3RhY2tpbmdcbiAgLy8gYW5jZXN0b3JzIHRoYXQgc2hhcGUgdGhlIGNhcHR1cmVkIGVsZW1lbnQncyBhcHBlYXJhbmNlLlxuICBsYXlvdXRDb250ZXh0PzogQXJyYXk8e1xuICAgIHRhZzogc3RyaW5nO1xuICAgIGRpc3BsYXk/OiBzdHJpbmc7XG4gICAgcG9zaXRpb24/OiBzdHJpbmc7XG4gICAgb3ZlcmZsb3c/OiBzdHJpbmc7XG4gICAgekluZGV4Pzogc3RyaW5nO1xuICAgIHRyYW5zZm9ybT86IHN0cmluZztcbiAgICB3aWxsQ2hhbmdlPzogc3RyaW5nO1xuICAgIGlzU2Nyb2xsQ29udGFpbmVyPzogYm9vbGVhbjtcbiAgICBzY3JvbGxMZWZ0PzogbnVtYmVyO1xuICAgIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgICBmbGV4Pzoge2RpcmVjdGlvbj86IHN0cmluZzsgd3JhcD86IHN0cmluZzsgYWxpZ25JdGVtcz86IHN0cmluZzsganVzdGlmeUNvbnRlbnQ/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gICAgZ3JpZD86IHt0ZW1wbGF0ZUNvbHVtbnM/OiBzdHJpbmc7IHRlbXBsYXRlUm93cz86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgfT47XG4gIC8vIEFzc2V0IHJlZmVyZW5jZXMgaW5zaWRlIHRoZSBjYXB0dXJlZCBzdWJ0cmVlIChpbWcgc3JjLCA8dXNlIGhyZWY+LFxuICAvLyBiYWNrZ3JvdW5kLWltYWdlIHVybCkuIFdoZW4gYSBjb21wbGFpbnQgaXMgYWJvdXQgYSBsb2dvIC8gaWNvbiAvXG4gIC8vIGFydHdvcmssIGFuIGFnZW50IHdpdGhvdXQgdGhlc2UgcmVmZXJlbmNlcyB3b3VsZCBiZSBsZWZ0IGd1ZXNzaW5nLlxuICBhc3NldHM/OiBBcnJheTx7XG4gICAgc3JjOiBzdHJpbmc7XG4gICAgbmF0dXJhbFc/OiBudW1iZXI7IG5hdHVyYWxIPzogbnVtYmVyO1xuICAgIHJlbmRlcmVkVz86IG51bWJlcjsgcmVuZGVyZWRIPzogbnVtYmVyO1xuICAgIGFsdD86IHN0cmluZztcbiAgICBsb2FkZWQ/OiBib29sZWFuO1xuICB9PjtcbiAgc3R5bGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWF0Y2hlZFJ1bGVzPzogTWF0Y2hlZFJ1bGVbXTtcbiAgcHNldWRvRWxlbWVudHM/OiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PjtcbiAgLy8gVHJ1bmNhdGlvbiBtYXJrZXJzIOKAlCBwcmVzZW50IHdoZW4gY2FwdHVyZSBoYWQgdG8gZWxpZGUgY29udGVudC4gTGV0c1xuICAvLyBhIGNvbnN1bWVyIGRldGVjdCBcInRoaXMgZW50cnkgd2FzIGN1dCBkb3duXCIgYW5kIHJlZmV0Y2ggZnJvbSB0aGVcbiAgLy8gbGl2ZSBwYWdlIGlmIGl0IG5lZWRzIHRoZSBmdWxsIHZlcnNpb24uXG4gIC8vICAgb3V0ZXJIVE1MIOKAlCBvcmlnaW5hbCBodG1sIGxlbmd0aCBiZWZvcmUgdGhlIHNpemUtY2FwIGtpY2tlZCBpbi5cbiAgLy8gICBjaGlsZHJlbiAg4oCUIG51bWJlciBvZiBkZXNjZW5kYW50IHN1YnRyZWVzIHJlcGxhY2VkIGJ5IGRlcHRoLWNhcFxuICAvLyAgICAgICAgICAgICAgIGVsaXNpb24gbWFya2VycyAoYDwhLS0gTiBjaGlsZHJlbiBlbGlkZWQgLS0+YCkuXG4gIHRydW5jYXRlZD86IHtvdXRlckhUTUw/OiBudW1iZXI7IGNoaWxkcmVuPzogbnVtYmVyOyB0ZXh0PzogbnVtYmVyfTtcbiAgLy8gR3JvdXAgb2YgYWRkaXRpb25hbCBjYXB0dXJlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBlbnRyeSAoQWx0K1NoaWZ0K0NsaWNrXG4gIC8vIC8gQWx0K2RyYWcgc2VsZWN0aW9ucyBjb2xsYXBzZSBoZXJlKS5cbiAgZ3JvdXA/OiBFbnRyeVtdO1xuICAvLyBPcHRpb25hbCBzY3JlZW5zaG90IGJ1bmRsZTogZWFjaCBmaWVsZCBpcyBhIHJlbGF0aXZlIHBhdGggdW5kZXIgdGhlXG4gIC8vIHVzZXIncyBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8gcm9vdC4gVGhlIGNhcHR1cmVkQXQgc3RhbXAgaXNcbiAgLy8gdGhlIElTTyB0aW1lc3RhbXAgd2hlbiB0aGUgc2hvdCB3YXMgdGFrZW4uXG4gIHNjcmVlbnNob3Q/OiB7XG4gICAgZWxlbWVudD86IHN0cmluZztcbiAgICBncm91cD86IHN0cmluZztcbiAgICBwYWdlPzogc3RyaW5nO1xuICAgIGNhcHR1cmVkQXQ/OiBzdHJpbmc7XG4gICAgLy8gQW4gZW1wdHkgYHNjcmVlbnNob3RgIGZpZWxkIGNvdWxkIG1lYW4gXCJub3QgeWV0IHNob3RcIiwgXCJmYWlsZWRcIixcbiAgICAvLyBvciBcInNraXBwZWQgb24gcHVycG9zZVwiLiBXaGVuIHRoZSBwaXBlbGluZSBkZWNsaW5lcyBvciBmYWlscyxcbiAgICAvLyBzZXQgdGhpcyBzbyByZWNlaXZlcnMga25vdyBpdCdzIG5vdCBhIHJldHJ5IGNhbmRpZGF0ZS5cbiAgICB1bmF2YWlsYWJsZVJlYXNvbj86ICdhdXRvU2NyZWVuc2hvdE9mZicgfCAnc2tpcFNjcmVlbnNob3RIb3N0cycgfCAnY2FwdHVyZUZhaWxlZCcgfCAncGVybWlzc2lvbkRlbmllZCcgfCBzdHJpbmc7XG4gICAgLy8gQ3JvcCBtZXRhZGF0YSBkZXNjcmliaW5nIHdoZXJlIHRoZSBjcm9wcGVkIFBORyBmaXRzIGluIHRoZVxuICAgIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgY3JvcD86IHtcbiAgICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZGV2aWNlUHhSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRwcjogbnVtYmVyO1xuICAgICAgcGFkZGluZzogbnVtYmVyO1xuICAgICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgICB9O1xuICB9O1xufTtcblxuLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBwYWdlIG1ldGFkYXRhLCBlbWl0dGVkIG9uY2UgcGVyIGRpc3RpbmN0IHBhZ2UgVVJMXG4vLyBpbnZvbHZlZCBpbiBjYXB0dXJlcyAoZGVkdXBlZCBieSBVUkwpLiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwuXG4vLyBgcGFydGlhbGAgaXMgc2V0IHdoZW4gb25seSB0aGUgdmlld3BvcnQgY291bGQgYmUgY2FwdHVyZWQgKGZ1bGwtcGFnZSBzdGl0Y2hcbi8vIHVuYXZhaWxhYmxlKSDigJQgc2VlIGJhY2tncm91bmQudHMgc3RpdGNoUGFnZSBsaW1pdGF0aW9ucy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdCA9IHsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmc7IGNhcHR1cmVkQXQ6IHN0cmluZzsgdmlld3BvcnQ6IHt3aWR0aDogbnVtYmVyO2hlaWdodDogbnVtYmVyfTsgc2Nyb2xsV2lkdGg6IG51bWJlcjsgc2Nyb2xsSGVpZ2h0OiBudW1iZXI7IGRldmljZVBpeGVsUmF0aW86IG51bWJlcjsgbGFuZzogc3RyaW5nOyBzY3JlZW5zaG90OiBzdHJpbmc7IHBhcnRpYWw/OiBib29sZWFuIH07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIC8vIFVzZXIgZXhwbGljaXRseSBkZXRhY2hlZCB0aGlzIGNvbW1lbnQgZnJvbSBhbnkgc2VsZWN0b3IuIFdpdGhvdXQgdGhlXG4gIC8vIGZsYWcsIGFkamFjZW5jeSB0byB0aGUgcHJlY2VkaW5nIHNlbGVjdG9yIHdvdWxkIHNpbGVudGx5IHJlLWFkb3B0IHRoZVxuICAvLyBjb21tZW50IGF0IHJlbmRlci9leHBvcnQgdGltZS5cbiAgZGV0YWNoZWQ/OiBib29sZWFuO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fVxuICAvLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIG1ldGFkYXRhIGZvciBvbmUgZGlzdGluY3QgcGFnZSAoVVJMKS4gRW1pdHRlZCBhdFxuICAvLyBtb3N0IG9uY2UgcGVyIFVSTCAodGhlIGNvbnRlbnQgc2NyaXB0IGRlZHVwZXMpLiBUaGUgcGFuZWwgY2FuIHN0YXNoIHRoZXNlXG4gIC8vIGFzIHBhZ2UtbGV2ZWwgY29udGV4dCAvIGV4cG9ydCB0aGVtIGFsb25nc2lkZSBlbGVtZW50IHNob3RzLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdCc7IHBheWxvYWQ6IFBhZ2VTbmFwc2hvdH07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9DcyA9XG4gIHwge2tpbmQ6ICdvdXRsaW5lJzsgc2VsZWN0b3I6IHN0cmluZzsgZ29sZD86IGJvb2xlYW47IGRhc2hlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ31cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGknOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9XG4gIHwge2tpbmQ6ICdzY3JvbGwtdG8nOyBzZWxlY3Rvcjogc3RyaW5nOyBzdGlja3k/OiBib29sZWFufVxuICB8IHtraW5kOiAnc3RpY2t5LWNsZWFyJ31cbiAgLy8gT25lLXNob3QgbG9jYXRvciBhbmltYXRpb246IHNjcm9sbCBpbnRvIHZpZXcgKyB0aHJlZSBwdWxzaW5nIHJpbmdzLlxuICAvLyBEaXN0aW5jdCBmcm9tIGBvdXRsaW5lYCAoc3VidGxlIGhvdmVyIHJpbmcpIGFuZCBgc2Nyb2xsLXRvYCAoc2lsZW50XG4gIC8vIHJlY2VudGVyKSBzbyB0aGUgc2lkZSBwYW5lbCBMb2NhdGUgYnV0dG9uIGNhbiByZXF1ZXN0IHNvbWV0aGluZyB1c2Vyc1xuICAvLyBjYW4gYWN0dWFsbHkgZmluZCBvbiBhIGJ1c3kgcGFnZS5cbiAgfCB7a2luZDogJ2xvY2F0ZS1mbGFzaCc7IHNlbGVjdG9yOiBzdHJpbmd9XG4gIHwge2tpbmQ6ICd2YWxpZGF0ZSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdsb2ctZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdyZWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnY2FwdHVyZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIC8vIE91dGxpbmUgdGhlIE50aCBhbmNlc3RvciBvZiBgc2VsZWN0b3JgIHdpdGhvdXQgY2FwdHVyaW5nIGl0IOKAlCB1c2VkIGJ5XG4gIC8vIGhvdmVyIG9uIGFuY2VzdG9yIGJyZWFkY3J1bWIgY2hpcHMgaW4gdGhlIHNpZGUgcGFuZWwgc28gdGhlIHVzZXJcbiAgLy8gcHJldmlld3Mgd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjbGlja2luZy5cbiAgfCB7a2luZDogJ291dGxpbmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICB8IHtraW5kOiAnYWx0LXN0YXRlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdtYW51YWwtY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uJzsgc2VsZWN0b3I6IHN0cmluZzsgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9XG4gIHwge2tpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfVxuICB8IHtraW5kOiAnc2V0LWNhcHR1cmVkJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ3NldC1jcy1wcmVmcyc7IHNwYWNpbmdPdmVybGF5PzogYm9vbGVhbjsgaG92ZXJTbmFwPzogYm9vbGVhbn1cbiAgLy8gU2NyZWVuc2hvdC10aW1lIG92ZXJsYXkgdG9nZ2xlcy4gVGhlIGJhY2tncm91bmQgYXNrcyB0aGUgY29udGVudCBzY3JpcHRcbiAgLy8gdG8gaGlkZSBpdHMgc2hhZG93LXJvb3QgY2hyb21lIChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIGJlZm9yZVxuICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlcywgdGhlbiByZXN0b3JlcyB2aXNpYmlsaXR5IG9uY2UgdGhlIFBORyBpcyBiYWNrLlxuICB8IHtraW5kOiAnaGlkZS1vdmVybGF5cyd9XG4gIHwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ307XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25QYXlsb2FkID0ge1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLy8gVGhlIGNhcHR1cmVkIGVudHJ5J3Mgc3RhYmxlIHVpZC4gVGhlIGNvbnRlbnQgc2NyaXB0IG5lZWRzIHRoaXMgc29cbiAgLy8gaXRzIG9uLXBhZ2UgY29tbWVudCBib3ggY2FuIHJvdXRlIHRoZSBjb21tZW50IHRvIHRoZSAqc3BlY2lmaWMqXG4gIC8vIGNhcHR1cmUgcmF0aGVyIHRoYW4gdG8gXCJhbnkgc2VsZWN0b3IgdGhhdCBtYXRjaGVzLlwiIFByZXZlbnRzXG4gIC8vIGNyb3NzLWNvbnRhbWluYXRpb24gd2hlbiB0d28gY2FwdHVyZXMgc2hhcmUgYSBzZWxlY3RvciBhY3Jvc3NcbiAgLy8gcGFnZXMgb3IgdHdvIHNpYmxpbmcgZWxlbWVudHMgc2hhcmUgYSB0ZXN0SWQuXG4gIHVpZD86IHN0cmluZztcbiAgbj86IG51bWJlcjtcbiAgY2FwdHVyZWQ/OiBib29sZWFuO1xuICBmZWVkYmFjaz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0JnID1cbiAgfCB7a2luZDogJ2NhcHR1cmUtc2NyZWVuc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc3dpdGNoLXRvLXRhYic7IHVybDogc3RyaW5nOyBvcGVuSWZNaXNzaW5nPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2xpc3Qtb3Blbi10YWJzJ31cbiAgfCB7a2luZDogJ3Nob3QtZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1ncm91cCc7IHNlbGVjdG9yczogc3RyaW5nW107IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1wYWdlJzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIEZ1bGwtcGFnZSAoYmVzdC1lZmZvcnQpIHNjcmVlbnNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFVubGlrZVxuICAvLyBzaG90LXBhZ2UgdGhpcyBkb2VzIE5PVCB3cml0ZSBhIGZpbGUgb3IgYnVpbGQgYSB0aHVtYm5haWwg4oCUIGl0IGp1c3RcbiAgLy8gcmV0dXJucyB0aGUgc3RpdGNoZWQgUE5HIGFzIGEgZGF0YSBVUkwgc28gdGhlIGNhbGxlciAoY29udGVudCBzY3JpcHQpIGNhblxuICAvLyBhdHRhY2ggaXQgdG8gYSBQYWdlU25hcHNob3QuIGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnRcbiAgLy8gY291bGQgYmUgY2FwdHVyZWQuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBQYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIChyZSlpbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IOKAlCB0aGUgZml4XG4gIC8vIGZvciBcIkFsdCBzdG9wcGVkIHdvcmtpbmdcIiBhZnRlciBhbiBleHRlbnNpb24gcmVsb2FkIG9ycGhhbnMgdGhlIHBhZ2Unc1xuICAvLyBjb250ZW50IHNjcmlwdC4gRGVmYXVsdHMgdG8gdGhlIGFjdGl2ZSB0YWIuXG4gIHwge2tpbmQ6ICdwZy1yZWluamVjdCc7IHRhYklkPzogbnVtYmVyfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbi8vIFJlcGx5IHRvIGEgYHBhZ2Utc25hcHNob3Qtc2hvdGAgcmVxdWVzdC4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMIG9mXG4vLyB0aGUgKGJlc3QtZWZmb3J0KSBmdWxsIHBhZ2U7IGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnQgd2FzXG4vLyBjYXB0dXJlZC4gYG9rOmZhbHNlYCBjYXJyaWVzIGFuIGVycm9yIHN0cmluZy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgc2NyZWVuc2hvdD86IHN0cmluZztcbiAgcGFydGlhbD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5XG4gIHwgUGFnZVNuYXBzaG90UmVwbHk7XG5cbi8vIOKUgOKUgOKUgCBFeHBvcnQgc2hhcGVzICh2Mikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBNYW5pZmVzdCBsaW5lIGVtaXR0ZWQgYXMgdGhlIHZlcnkgZmlyc3QgSlNPTkwgbGluZS4gQ2FycmllcyB0aGUgbWV0YWRhdGFcbi8vIG5lY2Vzc2FyeSB0byByZXN5bmMgYSBkb3dubG9hZGVkIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlICsgdG9vbGluZy5cbmV4cG9ydCB0eXBlIEV4cG9ydE1hbmlmZXN0ID0ge1xuICB2OiAyO1xuICB0eXBlOiAnbWFuaWZlc3QnO1xuICB0czogc3RyaW5nOyAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgZXhwb3J0IHdhcyBnZW5lcmF0ZWRcbiAgZ2VuZXJhdGVkOiBudW1iZXI7IC8vIGVwb2NoIG1zIChtaXJyb3Igb2YgdHMgaW4gbWFjaGluZS1yZWFkYWJsZSBmb3JtKVxuICB0b29sOiAncGluY2hncmFiJztcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGZvcm1hdDogJ2pzb25sJyB8ICdtYXJrZG93bicgfCAndGFyLnpzdCc7XG4gIC8vIENvbnRlbnQtZGVyaXZlZCBpZGVudGl0eTogZmlyc3QgMTYgaGV4IGNoYXJzIG9mIGEgU0hBLTI1NiBvdmVyIHRoZVxuICAvLyBzbGltIHJvd3MgKyBzY3JlZW5zaG90IG5hbWVzLiBTdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMgb2YgdGhlIHNhbWVcbiAgLy8gY29udGVudCwgc28gZG93bnN0cmVhbSBzdGF0ZSAoZS5nLiB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8qL2J1bmRsZXMvKVxuICAvLyBrZXlzIG9uIGl0IHdpdGhvdXQgZHVwbGljYXRpbmcgd29yay5cbiAgYnVuZGxlSWQ/OiBzdHJpbmc7XG4gIGhvc3RzOiBzdHJpbmdbXTtcbiAgLy8gQW1iaWd1b3VzIHRvdGFscy4gVGhlIHByZXZpb3VzIGBzZWxlY3RvcnMgLyBmZWVkYmFjayAvIHBhZ2VzYFxuICAvLyB0cmlwbGUgZGlkbid0IHNheSB3aGV0aGVyIG5lc3RlZFxuICAvLyBncm91cCBtZW1iZXJzIHdlcmUgY291bnRlZCwgd2hldGhlciBmZWVkYmFjay1iZWFyaW5nIHBhcmVudHMgd2VyZVxuICAvLyBhIHN1YnNldCwgb3IgaG93IHNjcmVlbnNob3RzIHdlcmUgdGFsbGllZC4gVGhlIGV4cGFuZGVkIHNoYXBlXG4gIC8vIGJlbG93IG5hbWVzIGV2ZXJ5IGNhdGVnb3J5IGV4cGxpY2l0bHkgc28gYSBkb3duc3RyZWFtIGFnZW50IGNhblxuICAvLyB0ZWxsIGV4YWN0bHkgd2hhdCdzIGluIHRoZSBidW5kbGUuXG4gIGNvdW50czoge1xuICAgIC8vIFRvcC1sZXZlbCBzZWxlY3RvciByb3dzIGluIHRoZSBKU09OTCBzdHJlYW0gKGV4Y2x1ZGVzIG5lc3RlZFxuICAgIC8vIGdyb3VwIG1lbWJlcnMsIGJ1dCB0aGUgYGdyb3VwTWVtYmVyc2AgZmllbGQgY291bnRzIHRob3NlKS5cbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBmZWVkYmFjazogbnVtYmVyO1xuICAgIHBhZ2VzOiBudW1iZXI7XG4gICAgLy8gTnVtYmVyIG9mIHNlbGVjdG9yIHJvd3MgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBjaGlsZC5cbiAgICAvLyBVc2VmdWwgZm9yIFwic2hvdyBtZSBvbmx5IHRoZSBpdGVtcyB3aXRoIGNvbW1lbnRzXCIuXG4gICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9ycyB0aGF0IHNoaXAgdW5kZXIgYSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYCBhcnJheVxuICAgIC8vIHJhdGhlciB0aGFuIGFzIHRoZWlyIG93biB0b3AtbGV2ZWwgcm93LlxuICAgIGdyb3VwTWVtYmVycz86IG51bWJlcjtcbiAgICAvLyBTY3JlZW5zaG90IGludmVudG9yeSAoY291bnRlZCBieSBmaWxlLCBkZWR1cGVkKS5cbiAgICBzY3JlZW5zaG90c0VsZW1lbnQ/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNHcm91cD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c1BhZ2U/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3Igcm93cyB0aGF0IHNob3VsZCBoYXZlIGFuIGVsZW1lbnQgc2NyZWVuc2hvdCBidXQgZG9uJ3RcbiAgICAvLyAocG9zdC1idWctIzIgZm9yY2VkIHNob290IG1heSBzdGlsbCBmYWlsKS4gUmVwYWlyIGFnZW50cyBjYW5cbiAgICAvLyBza2lwIHRoZXNlIG9yIHJlcXVlc3QgYSByZS1jYXB0dXJlLlxuICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90PzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2hvc2UgcGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbnkgc2VsZWN0b3JcbiAgICAvLyBpbiB0aGlzIGFyY2hpdmUuIFNob3VsZCBhbHdheXMgYmUgMDsgbm9uLXplcm8gbWVhbnMgdGhlIGV4cG9ydFxuICAgIC8vIGdvdCB0cnVuY2F0ZWQgb3IgYSBwYXJlbnQgd2FzIGRlbGV0ZWQgYmV0d2VlbiBjYXB0dXJlICsgZW1pdC5cbiAgICBvcnBoYW5lZEZlZWRiYWNrPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBTdWJzZXQgb2YgbHVjaWRlLmRldiBpY29ucyBpbmxpbmVkIGFzIFNWRyBpbm5lci1tYXJrdXAuXG4vLyBFYWNoIGVudHJ5IGlzIHRoZSBib2R5IG9mIDxzdmcgLi4uID4gLi4uIDwvc3ZnPjsgc3ZnU3RyaW5nKCkgd3JhcHMgaXQuXG4vLyBTaXplcyBkZWZhdWx0IHRvIDE2OyBvdmVycmlkZSB3aXRoIHRoZSBzaXplIGFyZ3VtZW50LlxuLy9cbi8vIE1JVCDigJQgaHR0cHM6Ly9naXRodWIuY29tL2x1Y2lkZS1pY29ucy9sdWNpZGVcblxuY29uc3QgSUNPTlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjaGV2cm9uLXJpZ2h0JzogJzxwYXRoIGQ9XCJtOSAxOCA2LTYtNi02XCIvPicsXG4gICdjaGV2cm9uLWRvd24nOiAnPHBhdGggZD1cIm02IDkgNiA2IDYtNlwiLz4nLFxuICBjb3B5OiAnPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgeD1cIjhcIiB5PVwiOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTQgMTZjLTEuMSAwLTItLjktMi0yVjRjMC0xLjEuOS0yIDItMmgxMGMxLjEgMCAyIC45IDIgMlwiLz4nLFxuICBwZW5jaWw6ICc8cGF0aCBkPVwiTTIxLjE3NCA2LjgxMmExIDEgMCAwIDAtMy45ODYtMy45ODdMMy44NDIgMTYuMTc0YTIgMiAwIDAgMC0uNS44M2wtMS4zMjEgNC4zNTJhLjUuNSAwIDAgMCAuNjIzLjYyMmw0LjM1My0xLjMyYTIgMiAwIDAgMCAuODMtLjQ5N3pcIi8+PHBhdGggZD1cIm0xNSA1IDQgNFwiLz4nLFxuICAndHJhc2gtMic6ICc8cGF0aCBkPVwiTTMgNmgxOFwiLz48cGF0aCBkPVwiTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNlwiLz48cGF0aCBkPVwiTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeDI9XCIxMFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB4Mj1cIjE0XCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+JyxcbiAgcGx1czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz48cGF0aCBkPVwiTTEyIDV2MTRcIi8+JyxcbiAgeDogJzxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPicsXG4gIG1pbnVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPicsXG4gIHNlYXJjaDogJzxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiLz48cGF0aCBkPVwibTIxIDIxLTQuMy00LjNcIi8+JyxcbiAgZG93bmxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjcgMTAgMTIgMTUgMTcgMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjE1XCIgeTI9XCIzXCIvPicsXG4gIHVwbG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTcgOCAxMiAzIDcgOFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiM1wiIHkyPVwiMTVcIi8+JyxcbiAgZ2l0aHViOiAnPHBhdGggZD1cIk0xNSAyMnYtNGE0LjggNC44IDAgMCAwLTEtMy41YzMgMCA2LTIgNi01LjUuMDgtMS4yNS0uMjctMi40OC0xLTMuNS4yOC0xLjE1LjI4LTIuMzUgMC0zLjUgMCAwLTEgMC0zIDEuNS0yLjY0LS41LTUuMzYtLjUtOCAwQzYgMiA1IDIgNSAyYy0uMyAxLjE1LS4zIDIuMzUgMCAzLjVBNS40IDUuNCAwIDAgMCA0IDljMCAzLjUgMyA1LjUgNiA1LjUtLjM5LjQ5LS42OCAxLjA1LS44NSAxLjY1LS4xNy42LS4yMiAxLjIzLS4xNSAxLjg1djRcIi8+PHBhdGggZD1cIk05IDE4Yy00LjUxIDItNS0yLTctMlwiLz4nLFxuICBzdGFyOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiLz4nLFxuICAnY2lyY2xlLWRvdCc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgY3Jvc3NoYWlyOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjIyXCIgeDI9XCIxOFwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiNlwiIHgyPVwiMlwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI2XCIgeTI9XCIyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIyMlwiIHkyPVwiMThcIi8+JyxcbiAgdGFyZ2V0OiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjZcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIyXCIvPicsXG4gICdwYW5lbC1sZWZ0LWNsb3NlJzogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIi8+PHBhdGggZD1cIk05IDN2MThcIi8+PHBhdGggZD1cIm0xNiAxNS0zLTMgMy0zXCIvPicsXG4gICdleHRlcm5hbC1saW5rJzogJzxwYXRoIGQ9XCJNMTUgM2g2djZcIi8+PHBhdGggZD1cIk0xMCAxNCAyMSAzXCIvPjxwYXRoIGQ9XCJNMTggMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNlwiLz4nLFxuICAnbWVzc2FnZS1zcXVhcmUtcGx1cyc6ICc8cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48bGluZSB4MT1cIjlcIiB4Mj1cIjE1XCIgeTE9XCIxMFwiIHkyPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjdcIiB5Mj1cIjEzXCIvPicsXG4gICdhbGVydC1jaXJjbGUnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiOFwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTIuMDFcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICAncmVmcmVzaC1jdyc6ICc8cGF0aCBkPVwiTTMgMTJhOSA5IDAgMCAxIDE1LTYuN0wyMSA4XCIvPjxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPjxwYXRoIGQ9XCJNMjEgMTJhOSA5IDAgMCAxLTE1IDYuN0wzIDE2XCIvPjxwYXRoIGQ9XCJNMyAyMXYtNWg1XCIvPicsXG4gICdmaWxlLXRleHQnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxM1wiIHkyPVwiMTNcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTdcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjhcIiB5MT1cIjlcIiB5Mj1cIjlcIi8+JyxcbiAgJ2ZpbGUtY29kZSc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxwYXRoIGQ9XCJtMTAgMTMtMiAyIDIgMlwiLz48cGF0aCBkPVwibTE0IDE3IDItMi0yLTJcIi8+JyxcbiAgaW1hZ2U6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCI5XCIgcj1cIjJcIi8+PHBhdGggZD1cIm0yMSAxNS0zLjA4Ni0zLjA4NmEyIDIgMCAwIDAtMi44MjggMEw2IDIxXCIvPicsXG4gIC8vIFN0eWxpc2VkIFwicGluY2hcIiDigJQgdHdvIG9wcG9zaW5nIGN1cnZlcyBtZWV0aW5nIGF0IGEgY2VudGVyIGRvdC5cbiAgcGluY2g6ICc8cGF0aCBkPVwiTTUgNWMzIDIgNSA0IDcgNy0yIDMtNCA1LTcgN1wiLz48cGF0aCBkPVwiTTE5IDVjLTMgMi01IDQtNyA3IDIgMyA0IDUgNyA3XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMS41XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICAnc3Rhci1maWxsZWQnOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgcGluOiAnPHBhdGggZD1cIk0xMiAxN3Y1XCIvPjxwYXRoIGQ9XCJNOSAxMC43NmEyIDIgMCAwIDEtMS4xMSAxLjc5bC0xLjc4LjlBMiAyIDAgMCAwIDUgMTUuMjRWMTZhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xdi0uNzZhMiAyIDAgMCAwLTEuMTEtMS43OWwtMS43OC0uOUEyIDIgMCAwIDEgMTUgMTAuNzZWN2ExIDEgMCAwIDEgMS0xIDIgMiAwIDAgMCAwLTRIOGEyIDIgMCAwIDAgMCA0IDEgMSAwIDAgMSAxIDF6XCIvPicsXG4gIHVuZG86ICc8cGF0aCBkPVwiTTMgN3Y2aDZcIi8+PHBhdGggZD1cIk0yMSAxN2E5IDkgMCAwIDAtMTUtNi43TDMgMTNcIi8+JyxcbiAgcmVkbzogJzxwYXRoIGQ9XCJNMjEgN3Y2aC02XCIvPjxwYXRoIGQ9XCJNMyAxN2E5IDkgMCAwIDEgMTUtNi43TDIxIDEzXCIvPicsXG4gIGZvbGRlcjogJzxwYXRoIGQ9XCJNMjAgMjBhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJoLTcuOTNhMiAyIDAgMCAxLTEuNjYtLjlsLS44Mi0xLjJBMiAyIDAgMCAwIDcuOTMgM0g0YTIgMiAwIDAgMC0yIDJ2MTNhMiAyIDAgMCAwIDIgMlpcIi8+JyxcbiAgY2hlY2s6ICc8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIi8+JyxcbiAgJ2NpcmNsZS1jaGVjayc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtOSAxMiAyIDIgNC00XCIvPicsXG4gIGdyaXA6ICc8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTlcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjE5XCIgcj1cIjFcIi8+JyxcbiAgLy8gQnJva2VuLWNoYWluIGljb24gZm9yIFwiZGV0YWNoIGNvbW1lbnQgZnJvbSBpdHMgY2FwdHVyZVwiLiBMdWNpZGUncyBgdW5saW5rYC5cbiAgdW5saW5rOiAnPHBhdGggZD1cIm0xOC44NCAxMi4yNSAxLjcyLTEuNzFoLS4wMmE1LjAwNCA1LjAwNCAwIDAgMC0uMTItNy4wNyA1LjAwNiA1LjAwNiAwIDAgMC02Ljk1IDBsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwibTUuMTcgMTEuNzUtMS43MSAxLjcxYTUuMDA0IDUuMDA0IDAgMCAwIC4xMiA3LjA3IDUuMDA2IDUuMDA2IDAgMCAwIDYuOTUgMGwxLjcxLTEuNzFcIi8+PGxpbmUgeDE9XCI4XCIgeDI9XCI4XCIgeTE9XCIyXCIgeTI9XCI1XCIvPjxsaW5lIHgxPVwiMlwiIHgyPVwiNVwiIHkxPVwiOFwiIHkyPVwiOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCIxNlwiIHkxPVwiMTlcIiB5Mj1cIjIyXCIvPjxsaW5lIHgxPVwiMTlcIiB4Mj1cIjIyXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgc2V0dGluZ3M6ICc8cGF0aCBkPVwiTTEyLjIyIDJoLS40NGEyIDIgMCAwIDAtMiAydi4xOGEyIDIgMCAwIDEtMSAxLjczbC0uNDMuMjVhMiAyIDAgMCAxLTIgMGwtLjE1LS4wOGEyIDIgMCAwIDAtMi43My43M2wtLjIyLjM4YTIgMiAwIDAgMCAuNzMgMi43M2wuMTUuMWEyIDIgMCAwIDEgMSAxLjcydi41MWEyIDIgMCAwIDEtMSAxLjc0bC0uMTUuMDlhMiAyIDAgMCAwLS43MyAyLjczbC4yMi4zOGEyIDIgMCAwIDAgMi43My43M2wuMTUtLjA4YTIgMiAwIDAgMSAyIDBsLjQzLjI1YTIgMiAwIDAgMSAxIDEuNzNWMjBhMiAyIDAgMCAwIDIgMmguNDRhMiAyIDAgMCAwIDItMnYtLjE4YTIgMiAwIDAgMSAxLTEuNzNsLjQzLS4yNWEyIDIgMCAwIDEgMiAwbC4xNS4wOGEyIDIgMCAwIDAgMi43My0uNzNsLjIyLS4zOWEyIDIgMCAwIDAtLjczLTIuNzNsLS4xNS0uMDhhMiAyIDAgMCAxLTEtMS43NHYtLjVhMiAyIDAgMCAxIDEtMS43NGwuMTUtLjA5YTIgMiAwIDAgMCAuNzMtMi43M2wtLjIyLS4zOGEyIDIgMCAwIDAtMi43My0uNzNsLS4xNS4wOGEyIDIgMCAwIDEtMiAwbC0uNDMtLjI1YTIgMiAwIDAgMS0xLTEuNzNWNGEyIDIgMCAwIDAtMi0yelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+JyxcbiAgaW5mbzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xMiAxNnYtNFwiLz48cGF0aCBkPVwiTTEyIDhoLjAxXCIvPicsXG4gIC8vIFRyZWUtb2Ytcm93cyDigJQgdXNlZCBmb3IgXCJTcGxpdCBncm91cFwiIGFjdGlvbiAoZGVub3RlcyBvbmUgbm9kZSBmYW5uaW5nXG4gIC8vIG91dCBpbnRvIHNpYmxpbmdzKS4gTHVjaWRlJ3MgYGxpc3QtdHJlZWAuXG4gICdsaXN0LXRyZWUnOiAnPHBhdGggZD1cIk0yMSAxMmgtOFwiLz48cGF0aCBkPVwiTTIxIDZIOFwiLz48cGF0aCBkPVwiTTIxIDE4aC04XCIvPjxwYXRoIGQ9XCJNMyA2djRjMCAxLjEuOSAyIDIgMmgzXCIvPjxwYXRoIGQ9XCJNMyAxMHY2YzAgMS4xLjkgMiAyIDJoM1wiLz4nLFxuICAvLyBHZW5lcmljIHNwbGl0IGljb24gYXMgYSBmYWxsYmFjayBvcHRpb24uXG4gIHNwbGl0OiAnPHBhdGggZD1cIk0xNiAzaDV2NVwiLz48cGF0aCBkPVwiTTggM0gzdjVcIi8+PHBhdGggZD1cIm0yMSAzLTcuNDYgNy40NmEyIDIgMCAwIDAgMCAyLjgzTDIxIDIxXCIvPjxwYXRoIGQ9XCJNMyAzbDcuNDYgNy40NmEyIDIgMCAwIDEgMCAyLjgzTDMgMjFcIi8+JyxcbiAgLy8gQ2FyZGJvYXJkLXN0eWxlIGJveCB1c2VkIGZvciBcIkV4cG9ydCB3b3Jrc3BhY2UgYXMgWklQXCIuXG4gIHBhY2thZ2U6ICc8cGF0aCBkPVwibTcuNSA0LjI3IDkgNS4xNVwiLz48cGF0aCBkPVwiTTIxIDhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2WlwiLz48cGF0aCBkPVwiTTMuMyA3IDEyIDEybDguNy01XCIvPjxwYXRoIGQ9XCJNMTIgMjJWMTJcIi8+JyxcbiAgLy8gVHdvIGludGVybG9ja2luZyBsaW5rcyDigJQgdXNlZCBmb3IgXCJDb3B5IGFzIHBhdGhcIi5cbiAgbGluazogJzxwYXRoIGQ9XCJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwiTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxXCIvPicsXG4gIC8vIERhdGFiYXNlL2R1Y2sgaWNvbiBmb3IgdGhlIER1Y2tEQiBwYWxldHRlIGNvbW1hbmQuXG4gIGRhdGFiYXNlOiAnPGVsbGlwc2UgY3g9XCIxMlwiIGN5PVwiNVwiIHJ4PVwiOVwiIHJ5PVwiM1wiLz48cGF0aCBkPVwiTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNVwiLz48cGF0aCBkPVwiTTMgMTJBOSAzIDAgMCAwIDIxIDEyXCIvPicsXG59O1xuXG5jb25zdCB3cmFwID0gKGJvZHk6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPiR7Ym9keX08L3N2Zz5gO1xuXG5leHBvcnQgY29uc3QgUEdfSUNPTlMgPSB7XG4gIGhhczogKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4gbmFtZSBpbiBJQ09OUyxcbiAgc3ZnU3RyaW5nOiAobmFtZTogc3RyaW5nLCBzaXplID0gMTYpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBJQ09OU1tuYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2x1Y2lkZV0gbWlzc2luZyBpY29uJywgbmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiB3cmFwKGJvZHksIHNpemUpO1xuICB9LFxuICBtb3VudDogKGVsOiBFbGVtZW50IHwgbnVsbCwgbmFtZTogc3RyaW5nLCBzaXplPzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKGVsKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gIH0sXG59O1xuXG4vLyBTaWRlLWVmZmVjdCBmb3IgbGVnYWN5IHNjcmlwdC10YWcgaW5jbHVzaW9uIChzaWRlcGFuZWwuaHRtbCBzdGlsbCA8c2NyaXB0XG4vLyBzcmM9XCJsdWNpZGUuanNcIj4g4oCUIHByZS1idW5kbGUpLiBSZS1leHBvc2VzIHRoZSByZWdpc3RyeSBvbiBnbG9iYWxUaGlzLlxuaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBHX0lDT05TID0gUEdfSUNPTlM7XG59XG4iLAogICAgIi8vIFBpbmNoR3JhYiBjb250ZW50IHNjcmlwdCDigJQgQWx0K0NsaWNrIGNhcHR1cmUsIEFsdCtkcmFnIHJ1YmJlci1iYW5kLFxuLy8gZ29sZC1zdGFnaW5nIG11bHRpLXNlbGVjdCwgb24tcGFnZSBjb21tZW50IG92ZXJsYXkuIExvYWRlZCBvbiBldmVyeSBwYWdlO1xuLy8gY29tbXVuaWNhdGVzIHdpdGggdGhlIHNpZGUgcGFuZWwgdmlhIGNocm9tZS5ydW50aW1lIG1lc3NhZ2VzIChhbmQgYVxuLy8gQ3VzdG9tRXZlbnQgZmFsbGJhY2sgaW4gc3RhbmRhbG9uZSB0ZXN0L1BsYXl3cmlnaHQgbW9kZSkuXG4vL1xuLy8gRGVjb21wb3NlZCBpbnRvOlxuLy8gICDigKIgZG9tLnRzICAgICDigJQgcHVyZSBoZWxwZXJzIChjc3NQYXRoLCBjYXB0dXJlRW50cnksIGVsZW1lbnRzSW5SZWN0KVxuLy8gICDigKIgdHlwZXMudHMgICDigJQgc2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgdGhpcyBmaWxlICDigJQgb3ZlcmxheSwgaG92ZXIgc3RhdGUgbWFjaGluZSwgZHJhZywgSVBDIHBsdW1iaW5nXG4vL1xuLy8gUmUtZW50cnkgZ3VhcmQ6IGlmIGEgcHJldmlvdXMgaW5zdGFuY2UgYWxyZWFkeSByYW4gaW4gdGhpcyBwYWdlIChlLmcuXG4vLyBzZXJ2aWNlLXdvcmtlciByZS1pbmplY3Rpb24gb24gdGFiIGFjdGl2YXRpb24pLCByZXVzZSBpdC5cblxuaW1wb3J0IHtcbiAgY2FwdHVyZUVudHJ5LFxuICBidWlsZFBhZ2VDb250ZXh0LFxuICBjc3NQYXRoLFxuICBjb21wYWN0VGFyZ2V0LFxuICBlbGVtZW50c0luUmVjdCxcbiAgcGlja0RyYWdDYW5kaWRhdGVzLFxuICBzbmFwVG9Db21wb25lbnQsXG4gIG5vdGVUYWJQcmVzc2VkLFxuICBzZXRNdXRhdGlvbkJ1ZmZlckdldHRlcixcbn0gZnJvbSAnLi9kb20udHMnO1xuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCxcbiAgQ3NUb1BhbmVsLFxuICBEb21NdXRhdGlvbixcbiAgRW50cnksXG4gIFBhZ2VTbmFwc2hvdCxcbiAgUGFnZVNuYXBzaG90UmVwbHksXG4gIFBhbmVsVG9DcyxcbiAgUGdFbnZlbG9wZSxcbn0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge3BnfSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7UEdfSUNPTlN9IGZyb20gJy4vbHVjaWRlLnRzJztcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBfX3BpbmNoZ3JhYkNvbnRlbnQ/OiBQaW5jaGdyYWJBcGk7XG4gICAgX19waW5jaGdyYWI/OiBQaW5jaGdyYWJBcGk7XG4gIH1cbn1cblxudHlwZSBQaW5jaGdyYWJBcGkgPSB7XG4gIGNhcHR1cmVFbnRyeTogdHlwZW9mIGNhcHR1cmVFbnRyeTtcbiAgYnVpbGRQYWdlQ29udGV4dDogdHlwZW9mIGJ1aWxkUGFnZUNvbnRleHQ7XG4gIGNhcHR1cmVzOiBBcnJheTx7ZW50cnk6IEVudHJ5OyBwYWdlOiBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZFBhZ2VDb250ZXh0PjsgZ3JvdXBlZD86IGJvb2xlYW59PiB8IG51bGw7XG4gIGZsYXNoRWxlbWVudDogKHNlbDogc3RyaW5nKSA9PiB2b2lkO1xuICBzZXRBbHQ6IChvbjogYm9vbGVhbikgPT4gdm9pZDtcbiAgbmV4dFNlcTogKCkgPT4gbnVtYmVyO1xuICBoYW5kbGVDb21tYW5kOiAobXNnOiBQZ0VudmVsb3BlPFBhbmVsVG9Dcz4sIHJlc3BvbmQ6IChyOiBhbnkpID0+IHZvaWQpID0+IGJvb2xlYW47XG4gIGRlc3Ryb3k6ICgpID0+IHZvaWQ7XG59O1xuXG5jb25zdCBMT0cgPSAnW1BpbmNoR3JhYi9jc10nO1xuY29uc3QgS0VZID0gJ19fcGluY2hncmFiQ29udGVudCc7XG5cbmlmICh3aW5kb3dbS0VZXSkge1xuICBjb25zb2xlLmxvZyhMT0csICdhbHJlYWR5IGluaXRpYWxpemVkOyByZXVzaW5nLicpO1xufSBlbHNlIHtcbiAgaW5pdCgpO1xufVxuXG5mdW5jdGlvbiBpbml0KCk6IHZvaWQge1xuICAvLyBDcm9zcy13b3JsZCB0YWtlb3ZlcjogYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwcmV2aW91cyBjb250ZW50XG4gIC8vIHNjcmlwdCBpbiBhICpkaWZmZXJlbnQgaXNvbGF0ZWQgd29ybGQqLCB3aGVyZSBvdXIgd2luZG93W0tFWV0gZ3VhcmRcbiAgLy8gY2FuJ3Qgc2VlIGl0IOKAlCBidXQgaXRzIERPTSBvdmVybGF5IGFuZCBjYXB0dXJlIGxpc3RlbmVycyBwZXJzaXN0IHdpdGggYVxuICAvLyBkZWFkIGNocm9tZS5ydW50aW1lIChcIkFsdCBzdG9wcyB3b3JraW5nXCIpLiBQbGFpbiBET00gZXZlbnRzIERPIGNyb3NzXG4gIC8vIGlzb2xhdGVkIHdvcmxkczogZmlyZSB0aGUgdGFrZW92ZXIgc2lnbmFsIHNvIGFueSBwcmVkZWNlc3NvciB0ZWFyc1xuICAvLyBpdHNlbGYgZG93biwgc3dlZXAgaXRzIHN0YWxlIG92ZXJsYXksIGFuZCByZWdpc3RlciB0aGUgc2FtZSBsaXN0ZW5lclxuICAvLyBmb3Igb3VyIG93biBzdWNjZXNzb3IuXG4gIHRyeSB7IGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdfX3BpbmNoZ3JhYi10YWtlb3ZlcicpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdfX3BpbmNoZ3JhYl9vdmVybGF5Jyk/LnJlbW92ZSgpO1xuXG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuICBjb25zdCB0ZXN0Q2FwdHVyZXMgPSBpbkV4dGVuc2lvbiA/IG51bGwgOiAoW10gYXMgQXJyYXk8e2VudHJ5OiBFbnRyeTsgcGFnZTogUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRQYWdlQ29udGV4dD47IGdyb3VwZWQ/OiBib29sZWFufT4pO1xuXG4gIC8vIE9ycGhhbiBzZWxmLWRldGVjdGlvbjogYWZ0ZXIgYW4gZXh0ZW5zaW9uIHJlbG9hZCwgY2hyb21lLnJ1bnRpbWUuaWQgaW5cbiAgLy8gdGhlIG9sZCB3b3JsZCBnb2VzIHVuZGVmaW5lZCAob3IgdGhyb3dzKS4gSG90IGhhbmRsZXJzIHNob3J0LWNpcmN1aXRcbiAgLy8gdGhyb3VnaCB0aGlzIGd1YXJkIGFuZCB0ZWFyIHRoZSBvcnBoYW4gZG93biBpbnN0ZWFkIG9mIHNpbGVudGx5IGVhdGluZ1xuICAvLyBBbHQgZ2VzdHVyZXMgZm9yZXZlci5cbiAgbGV0IGRlc3Ryb3llZCA9IGZhbHNlO1xuICBjb25zdCBjb250ZXh0QWxpdmUgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIHRydWU7XG4gICAgdHJ5IHsgcmV0dXJuIEJvb2xlYW4oY2hyb21lLnJ1bnRpbWU/LmlkKTsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9O1xuICBjb25zdCBvcnBoYW5HdWFyZCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBpZiAoZGVzdHJveWVkKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGNvbnRleHRBbGl2ZSgpKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnZXh0ZW5zaW9uIGNvbnRleHQgaW52YWxpZGF0ZWQg4oCUIHRlYXJpbmcgZG93biBvcnBoYW5lZCBjb250ZW50IHNjcmlwdCcpO1xuICAgIHRyeSB7IHdpbmRvd1tLRVldPy5kZXN0cm95KCk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgT3ZlcmxheSBzaGFkb3cgaG9zdCAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gU3RyaWN0LUNTUCBwYWdlcyAoR2l0SHViLCBiYW5rcykgcmVqZWN0IGlubGluZSA8c3R5bGU+IHRhZ3MgQU5EXG4gIC8vIGFkb3B0ZWRTdHlsZVNoZWV0cyDigJQgYm90aCBhcmUgZ2F0ZWQgYnkgdGhlIHBhZ2UncyBgc3R5bGUtc3JjYC4gQnJvd3NlcnNcbiAgLy8gZG8gYWxsb3cgaW5saW5lLXN0eWxlIG11dGF0aW9ucyB0aHJvdWdoIHRoZSBKUyBgSFRNTEVsZW1lbnQuc3R5bGVgIEFQSSxcbiAgLy8gc28gd2UgYXBwbHkgZXZlcnkgb3ZlcmxheSBzdHlsZSB0aGF0IHdheSAoc2VlIGFwcGx5U3R5bGVzIGJlbG93KS5cbiAgY29uc3Qgb3ZlcmxheUhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgb3ZlcmxheUhvc3QuaWQgPSAnX19waW5jaGdyYWJfb3ZlcmxheSc7XG4gIE9iamVjdC5hc3NpZ24ob3ZlcmxheUhvc3Quc3R5bGUsIHtcbiAgICBhbGw6ICdpbml0aWFsJywgcG9zaXRpb246ICdmaXhlZCcsIHRvcDogJzAnLCBsZWZ0OiAnMCcsIHJpZ2h0OiAnMCcsIGJvdHRvbTogJzAnLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJywgekluZGV4OiAnMjE0NzQ4MzY0NicsXG4gIH0pO1xuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQob3ZlcmxheUhvc3QpO1xuICBjb25zdCBzaGFkb3cgPSBvdmVybGF5SG9zdC5hdHRhY2hTaGFkb3coe21vZGU6ICdvcGVuJ30pO1xuXG4gIC8vIOKUgOKUgOKUgCBUb3AtbGF5ZXIgcHJvbW90aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBBIG1heCB6LWluZGV4IGhvc3Qgc3RpbGwgbG9zZXMgdG8gdGhlIGJyb3dzZXIgdG9wIGxheWVyXG4gIC8vICg8ZGlhbG9nPi5zaG93TW9kYWwoKSwgcGFnZSBwb3BvdmVycykgYW5kIGNhbiBiZSB0cmFwcGVkIGJ5IHN0YWNraW5nXG4gIC8vIGNvbnRleHRzLiBUaGUgUG9wb3ZlciBBUEkgcHV0cyB0aGUgaG9zdCBpbiB0aGUgdG9wIGxheWVyIGl0c2VsZjtcbiAgLy8gcG9wb3Zlcj1cIm1hbnVhbFwiIG9wdHMgb3V0IG9mIEVTQy9saWdodC1kaXNtaXNzLiBVQSBbcG9wb3Zlcl0gc3R5bGVzXG4gIC8vIChhdXRvIG1hcmdpbnMsIGJvcmRlciwgZml0LWNvbnRlbnQgc2l6aW5nLCBkaXNwbGF5Om5vbmUtd2hlbi1jbG9zZWQpXG4gIC8vIGFyZSBuZXV0cmFsaXplZCBpbmxpbmUgYmVjYXVzZSBwYWdlIENTUCBjYW4gYmxvY2sgc3R5bGVzaGVldHMuIE9uIGFueVxuICAvLyBmYWlsdXJlIHRoZSBwb3BvdmVyIGF0dHJpYnV0ZSBpcyByZW1vdmVkIHNvIHRoZSBwbGFpbiBtYXgteiBmYWxsYmFja1xuICAvLyBrZWVwcyBwYWludGluZy5cbiAgY29uc3QgcHJvbW90ZVRvVG9wTGF5ZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCEoJ3Nob3dQb3BvdmVyJyBpbiBvdmVybGF5SG9zdCkpIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgb3ZlcmxheUhvc3Quc2V0QXR0cmlidXRlKCdwb3BvdmVyJywgJ21hbnVhbCcpO1xuICAgICAgT2JqZWN0LmFzc2lnbihvdmVybGF5SG9zdC5zdHlsZSwge1xuICAgICAgICBtYXJnaW46ICcwJywgYm9yZGVyOiAnMCcsIHBhZGRpbmc6ICcwJyxcbiAgICAgICAgd2lkdGg6ICdhdXRvJywgaGVpZ2h0OiAnYXV0bycsXG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsIG92ZXJmbG93OiAndmlzaWJsZScsIGNvbG9yOiAnaW5oZXJpdCcsXG4gICAgICB9KTtcbiAgICAgIGlmICghb3ZlcmxheUhvc3QubWF0Y2hlcygnOnBvcG92ZXItb3BlbicpKSBvdmVybGF5SG9zdC5zaG93UG9wb3ZlcigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICd0b3AtbGF5ZXIgcHJvbW90aW9uIGZhaWxlZCDigJQgbWF4IHotaW5kZXggZmFsbGJhY2snLCBlKTtcbiAgICAgIHRyeSB7IG92ZXJsYXlIb3N0LnJlbW92ZUF0dHJpYnV0ZSgncG9wb3ZlcicpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gIH07XG4gIC8vIFRvcC1sYXllciBzdGFja2luZyBpcyBpbnNlcnRpb24tb3JkZXJlZDogYSBoaWRlK3Nob3cgY3ljbGUgcmUtc3RhY2tzIHRoZVxuICAvLyBvdmVybGF5IGFib3ZlIGFueSBkaWFsb2cvcG9wb3ZlciB0aGUgcGFnZSBvcGVuZWQgYWZ0ZXIgdXMuIENhbGxlZCB3aGVuIGFcbiAgLy8gbmV3IHJpbmcgb3IgdGhlIGNvbW1lbnQgYm94IGFwcGVhcnMg4oCUIG5vdCBwZXIgZnJhbWUuXG4gIGNvbnN0IGJyaW5nVG9Gcm9udCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoISgnc2hvd1BvcG92ZXInIGluIG92ZXJsYXlIb3N0KSkgcmV0dXJuO1xuICAgIGlmIChvdmVybGF5SG9zdC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHJldHVybjsgLy8gbWlkLWNhcHR1cmU7IHN0YXkgaGlkZGVuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChvdmVybGF5SG9zdC5tYXRjaGVzKCc6cG9wb3Zlci1vcGVuJykpIG92ZXJsYXlIb3N0LmhpZGVQb3BvdmVyKCk7XG4gICAgICBvdmVybGF5SG9zdC5zaG93UG9wb3ZlcigpO1xuICAgIH0gY2F0Y2ggeyBwcm9tb3RlVG9Ub3BMYXllcigpOyB9XG4gIH07XG4gIHByb21vdGVUb1RvcExheWVyKCk7XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZSBTVkc6IGNvbm5lY3RvcnMgZnJvbSB0aGUgc2lkZS1wYW5lbCBlZGdlIG9mIHRoZSB2aWV3cG9ydCB0b1xuICAvLyBlYWNoIHJpbmdlZCBlbGVtZW50LiBUaGUgcGFnZSBjYW4ndCBzZWUgdGhlIHNpZGUtcGFuZWwgaXRzZWxmIChzZXBhcmF0ZVxuICAvLyBmcmFtZSksIGJ1dCBDaHJvbWUgcHV0cyB0aGUgc2lkZS1wYW5lbCBhZGphY2VudCB0byB0aGUgcGFnZSdzIHJpZ2h0XG4gIC8vIGVkZ2UsIHNvIGEgY3VydmUgZnJvbSAoaW5uZXJXaWR0aCwgbWlkWSkgaXMgdGhlIHZpc3VhbCBzdGFuZC1pbiBmb3JcbiAgLy8gXCJmcm9tIHRoZSBzaWRlLXBhbmVsXCIuIE9uZSBjb250YWluZXIsIG9uZSBwYXRoIHBlciByaW5nIHNsb3QuXG4gIGNvbnN0IG5vb2RsZVN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gIE9iamVjdC5hc3NpZ24obm9vZGxlU3ZnLnN0eWxlLCB7XG4gICAgcG9zaXRpb246ICdmaXhlZCcsIHRvcDogJzAnLCBsZWZ0OiAnMCcsXG4gICAgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIHpJbmRleDogJzInLFxuICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBSaW5nIHBvb2w6IHRyYWNrcyBlbGVtZW50cyB3aXRoIHJBRi1wb3NpdGlvbmVkIG91dGxpbmUgcmluZ3Mg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgU2xvdCA9IHtlbDogSFRNTERpdkVsZW1lbnQ7IGxhYmVsOiBIVE1MRGl2RWxlbWVudDsgcGF0aDogU1ZHUGF0aEVsZW1lbnQ7IHJhZjogbnVtYmVyOyB0YXJnZXQ6IEVsZW1lbnQgfCBudWxsfTtcbiAgY29uc3QgcmluZ3MgPSBuZXcgTWFwPHN0cmluZywgU2xvdD4oKTtcbiAgY29uc3QgUklOR19CQVNFOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYm9yZGVyOiAnMnB4IHNvbGlkICNmZjVmMDAnLFxuICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgM3B4IHJnYmEoMjU1LDk1LDAsLjE4KSwgMCAwIDE2cHggcmdiYSgyNTUsOTUsMCwuNCknLFxuICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4wOHMgbGluZWFyJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICB6SW5kZXg6ICcxJyxcbiAgfTtcbiAgY29uc3QgUklOR19HT0xEOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIGJvcmRlckNvbG9yOiAnI2ZmZDE2NicsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgM3B4IHJnYmEoMjU1LDIwOSwxMDIsLjIyKSwgMCAwIDE4cHggcmdiYSgyNTUsMjA5LDEwMiwuNDUpJyxcbiAgfTtcbiAgLy8gTGl2ZSBkcmFnIHByZXZpZXc6IGJyaWdodCBsaW1lLCB0aGlja2VyIGJvcmRlciwgbW9yZSB2aXNpYmxlIGhhbG8gc29cbiAgLy8gdGhlIHVzZXIgY2FuIGNsZWFybHkgc2VlIHdoYXQgdGhlIHJ1YmJlciBiYW5kIHdpbGwgY29tbWl0IG9uIHJlbGVhc2UuXG4gIGNvbnN0IFJJTkdfUFJFVklFVzogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiA9IHtcbiAgICBib3JkZXJDb2xvcjogJyM3YmQ5N2EnLFxuICAgIGJvcmRlcldpZHRoOiAnM3B4JyxcbiAgICBib3hTaGFkb3c6ICcwIDAgMCAzcHggcmdiYSgxMjMsMjE3LDEyMiwuMzIpLCAwIDAgMjJweCByZ2JhKDEyMywyMTcsMTIyLC41NSknLFxuICB9O1xuICBjb25zdCBMQUJFTF9CQVNFOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ID0ge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDk1LDAsLjY1KScsIGNvbG9yOiAnI2ZmZicsXG4gICAgZm9udDogXCI2MDAgMTFweC8xLjIgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgcGFkZGluZzogJzNweCA2cHgnLCBib3JkZXJSYWRpdXM6ICczcHgnLFxuICAgIHdpZHRoOiAnMjIwcHgnLCBoZWlnaHQ6ICcxNnB4JyxcbiAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJywgb3ZlcmZsb3c6ICdoaWRkZW4nLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgdGV4dFNoYWRvdzogJzAgMXB4IDJweCByZ2JhKDAsMCwwLC40NSknLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIGRpc3BsYXk6ICdub25lJyxcbiAgfTtcbiAgY29uc3QgZW5zdXJlUmluZyA9IChrZXk6IHN0cmluZyk6IFNsb3QgPT4ge1xuICAgIGxldCBzbG90ID0gcmluZ3MuZ2V0KGtleSk7XG4gICAgaWYgKHNsb3QpIHJldHVybiBzbG90O1xuICAgIC8vIENsYXNzZXMgYXJlIGtlcHQgcHVyZWx5IGFzIGlkZW50aWZpZXJzIChxdWVyeVNlbGVjdG9yIHRlc3QgaG9va3MpO1xuICAgIC8vIHZpc3VhbCBzdHlsaW5nIGlzIGlubGluZSBiZWNhdXNlIHBhZ2UgQ1NQIGNhbiBibG9jayBzdHlsZXNoZWV0cy5cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmNsYXNzTmFtZSA9ICdyaW5nJztcbiAgICBPYmplY3QuYXNzaWduKGVsLnN0eWxlLCBSSU5HX0JBU0UpO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGFiZWwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICBPYmplY3QuYXNzaWduKGxhYmVsLnN0eWxlLCBMQUJFTF9CQVNFKTtcbiAgICAvLyBOb29kbGUgcGF0aCBjb25uZWN0aW5nIChpbm5lcldpZHRoLCBtaWRZKSDihpIgZWxlbWVudCBjZW50ZXIuXG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzIuNScpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UtbGluZWNhcCcsICdyb3VuZCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgJzAuNScpO1xuICAgIGlmICghbm9vZGxlU3ZnLmlzQ29ubmVjdGVkKSBzaGFkb3cuYXBwZW5kKG5vb2RsZVN2Zyk7XG4gICAgbm9vZGxlU3ZnLmFwcGVuZChwYXRoKTtcbiAgICBzaGFkb3cuYXBwZW5kKGVsLCBsYWJlbCk7XG4gICAgc2xvdCA9IHtlbCwgbGFiZWwsIHBhdGgsIHJhZjogMCwgdGFyZ2V0OiBudWxsfTtcbiAgICByaW5ncy5zZXQoa2V5LCBzbG90KTtcbiAgICByZXR1cm4gc2xvdDtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlUmluZyA9IChrZXk6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNsb3QgPSByaW5ncy5nZXQoa2V5KTtcbiAgICBpZiAoIXNsb3QpIHJldHVybjtcbiAgICBpZiAoc2xvdC5yYWYpIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHNsb3QucmFmKTtcbiAgICBzbG90LmVsLnJlbW92ZSgpO1xuICAgIHNsb3QubGFiZWwucmVtb3ZlKCk7XG4gICAgc2xvdC5wYXRoLnJlbW92ZSgpO1xuICAgIHJpbmdzLmRlbGV0ZShrZXkpO1xuICAgIHJpbmdUcmFja09wdHMuZGVsZXRlKGtleSk7XG4gIH07XG4gIGNvbnN0IGNsZWFyUmluZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBrIG9mIFsuLi5yaW5ncy5rZXlzKCldKSByZW1vdmVSaW5nKGspO1xuICAgIG5vb2RsZVN2Zy5yZW1vdmUoKTtcbiAgfTtcbiAgdHlwZSBSaW5nT3B0cyA9IHtnb2xkPzogYm9vbGVhbjsgZGFzaGVkPzogYm9vbGVhbjsgcHJldmlldz86IGJvb2xlYW47IGxhYmVsPzogc3RyaW5nfTtcbiAgY29uc3QgcG9zaXRpb25SaW5nID0gKHNsb3Q6IFNsb3QsIHRhcmdldDogRWxlbWVudCwgb3B0czogUmluZ09wdHMpOiB2b2lkID0+IHtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJpbmdTdHlsZSA9IHNsb3QuZWwuc3R5bGU7XG4gICAgcmluZ1N0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCgwLCByLmxlZnQgLSAzKX1weGA7XG4gICAgcmluZ1N0eWxlLnRvcCA9IGAke01hdGgubWF4KDAsIHIudG9wIC0gMyl9cHhgO1xuICAgIHJpbmdTdHlsZS53aWR0aCA9IGAke01hdGgubWF4KDAsIHIud2lkdGggKyA2KX1weGA7XG4gICAgcmluZ1N0eWxlLmhlaWdodCA9IGAke01hdGgubWF4KDAsIHIuaGVpZ2h0ICsgNil9cHhgO1xuICAgIHJpbmdTdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBpZiAob3B0cy5wcmV2aWV3KSB7XG4gICAgICBPYmplY3QuYXNzaWduKHJpbmdTdHlsZSwgUklOR19QUkVWSUVXKTtcbiAgICB9IGVsc2UgaWYgKG9wdHMuZ29sZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbihyaW5nU3R5bGUsIFJJTkdfR09MRCk7XG4gICAgICByaW5nU3R5bGUuYm9yZGVyV2lkdGggPSAnMnB4JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmluZ1N0eWxlLmJvcmRlckNvbG9yID0gJyNmZjVmMDAnO1xuICAgICAgcmluZ1N0eWxlLmJveFNoYWRvdyA9IFJJTkdfQkFTRS5ib3hTaGFkb3chO1xuICAgICAgcmluZ1N0eWxlLmJvcmRlcldpZHRoID0gJzJweCc7XG4gICAgfVxuICAgIHJpbmdTdHlsZS5ib3JkZXJTdHlsZSA9IG9wdHMuZGFzaGVkID8gJ2Rhc2hlZCcgOiAnc29saWQnO1xuICAgIC8vIE5vIGZsb2F0aW5nIGxhYmVsIGFib3ZlIHRoZSBoaWdobGlnaHRlZCBlbGVtZW50IOKAlCB0aGUgb24tcGFnZSBjb21tZW50XG4gICAgLy8gYm94IChhbm5vdGF0aW9uIG92ZXJsYXkpIGFscmVhZHkgc2hvd3MgZXZlcnl0aGluZyB0aGUgdXNlciBuZWVkcyBhbmRcbiAgICAvLyB0aGUgZmxvYXRpbmcgbGFiZWwgd2FzIGp1c3QgdmlzdWFsIG5vaXNlIGFib3ZlIHRoZSByaW5nIGJvcmRlci5cbiAgICBzbG90LmxhYmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAvLyBQYWdlLXNpZGUgbm9vZGxlOiBhIHNpbmdsZSBjdXJ2ZSBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBwYWdlXG4gICAgLy8gKHdoZXJlIHRoZSBzaWRlIHBhbmVsIHNpdHMpIHRvIHRoZSBDTE9TRVNUIFBPSU5UIG9uIHRoZSByaW5nIHJlY3QuXG4gICAgLy8gV2UgZG9uJ3QgdHJ5IHRvIGFsaWduIHdpdGggYSBwYW5lbC1zaWRlIGNvbXBhbmlvbiBjdXJ2ZSBhbnltb3JlIOKAlFxuICAgIC8vIHRoYXQgbmVlZGVkIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaCBicm9rZSB1bmRlciBEZXZUb29scyBkb2NrIC9cbiAgICAvLyBicm93c2VyIHpvb20uIFRoaXMgaGFsZiBzdGFuZHMgYWxvbmU6IHRoZSB2aXN1YWwgaXMgXCJhbiBhcnJvdyBmcm9tXG4gICAgLy8gdGhlIHBhbmVsIHNpZGUsIHBvaW50aW5nIGF0IHRoZSBjYXB0dXJlZCBlbGVtZW50XCIgYW5kIHdvcmtzIGF0XG4gICAgLy8gYW55IHZpZXdwb3J0LlxuICAgIGNvbnN0IHJpbmdQYWQgPSAzO1xuICAgIGNvbnN0IHJpbmdMID0gci5sZWZ0IC0gcmluZ1BhZDtcbiAgICBjb25zdCByaW5nUiA9IHIucmlnaHQgKyByaW5nUGFkO1xuICAgIGNvbnN0IHJpbmdUID0gci50b3AgLSByaW5nUGFkO1xuICAgIGNvbnN0IHJpbmdCID0gci5ib3R0b20gKyByaW5nUGFkO1xuICAgIGNvbnN0IG94ID0gd2luZG93LmlubmVyV2lkdGg7ICAgICAgICAgIC8vIG9yaWdpbiB4IChwYWdlIHJpZ2h0IGVkZ2UpXG4gICAgY29uc3Qgb3kgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyOyAgICAgLy8gb3JpZ2luIHkgKHBhZ2UgbWlkWSlcbiAgICAvLyBDbG9zZXN0LXBvaW50IHByb2plY3Rpb246IGNsYW1wIG9yaWdpbiBvbnRvIHRoZSByaW5nIHJlY3QuXG4gICAgY29uc3QgZXggPSBNYXRoLm1heChyaW5nTCwgTWF0aC5taW4ob3gsIHJpbmdSKSk7XG4gICAgY29uc3QgZXkgPSBNYXRoLm1heChyaW5nVCwgTWF0aC5taW4ob3ksIHJpbmdCKSk7XG4gICAgaWYgKE1hdGguaHlwb3QoZXggLSBveCwgZXkgLSBveSkgPCAyNCkge1xuICAgICAgLy8gRWxlbWVudCBpcyBlc3NlbnRpYWxseSBhdCB0aGUgcGFuZWwtc2lkZSBlZGdlIOKAlCBkcmF3aW5nIGEgMjRweFxuICAgICAgLy8gY3VydmUgdGhlcmUgbG9va3MgbGlrZSBhIHNtdWRnZS4gU2tpcC5cbiAgICAgIHNsb3QucGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJlemllcjogZmlyc3QgbG9iZSBwdWxsZWQgbGVmdCBmcm9tIHRoZSBvcmlnaW4sIHNlY29uZCBsb2JlXG4gICAgICAvLyBwdWxsZWQgb3V0d2FyZCBmcm9tIHRoZSByaW5nIG9uIHRoZSBzaWRlIGZhY2luZyB0aGUgb3JpZ2luIHNvXG4gICAgICAvLyB0aGUgY3VydmUgYXBwcm9hY2hlcyB0aGUgYm91bmRhcnkgcGVycGVuZGljdWxhci1pc2guXG4gICAgICBjb25zdCBjMXggPSBveCAtIDgwLCBjMXkgPSBveTtcbiAgICAgIGNvbnN0IGFwcHJvYWNoRHggPSBveCA+IHJpbmdSID8gNjAgOiBveCA8IHJpbmdMID8gLTYwIDogMDtcbiAgICAgIGNvbnN0IGMyeCA9IGV4ICsgYXBwcm9hY2hEeCwgYzJ5ID0gZXk7XG4gICAgICBzbG90LnBhdGguc2V0QXR0cmlidXRlKCdkJywgYE0gJHtveH0gJHtveX0gQyAke2MxeH0gJHtjMXl9LCAke2MyeH0gJHtjMnl9LCAke2V4fSAke2V5fWApO1xuICAgIH1cbiAgICAvLyBTdHJva2UgbWF0Y2hlcyByaW5nIHRpZXIgc28gYSBnbGFuY2UgYXQgdGhlIHBhZ2UgdGVsbHMgdGhlIHVzZXJcbiAgICAvLyB3aGljaCBjYXB0dXJlIHRoaXMgY3VydmUgcG9pbnRzIHRvLlxuICAgIGNvbnN0IHN0cm9rZSA9IG9wdHMucHJldmlldyA/ICcjN2JkOTdhJyA6IG9wdHMuZ29sZCA/ICcjZmZkMTY2JyA6ICcjZmY1ZjAwJztcbiAgICBzbG90LnBhdGguc2V0QXR0cmlidXRlKCdzdHJva2UnLCBzdHJva2UpO1xuICB9O1xuICAvLyBPdmVybGF5LWZyZWV6ZSBmbGFnLiBEdXJpbmcgYSBzY3JlZW5zaG90IHRoZSBiYWNrZ3JvdW5kIHRlbGxzIHVzIHRvXG4gIC8vIGhpZGUtb3ZlcmxheXM7IHdoaWxlIGhpZGRlbiB3ZSBhbHNvIEZSRUVaRSBldmVyeSByaW5nJ3MgckFGIHJlcG9zaXRpb25cbiAgLy8gbG9vcC4gV2l0aG91dCB0aGlzIHRoZSBsb29wcyBrZWVwIGZpcmluZyB0aHJvdWdoIHRoZSBjYXB0dXJlIGN5Y2xlIOKAlFxuICAvLyB0aGV5IHJlcG9zaXRpb24gcmluZ3MgdG8gdGhlIHBvc3Qtc2Nyb2xsIG9mZnNldCAoYSB2aXNpYmxlIGp1bXApIGFuZFxuICAvLyByZXBhaW50IGEgYnVyc3QgdGhlIGluc3RhbnQgdGhlIGhvc3QgaXMgc2hvd24gYWdhaW4sIHdoaWNoIGlzIHRoZVxuICAvLyBmbGFzaGluZyB0aGUgdXNlciBzYXcgb24gZ3JvdXBlZCBjYXB0dXJlcyAobW9yZSByaW5ncyA9IG1vcmUgZmxpY2tlcikuXG4gIC8vIEZyb3plbiwgdGhlIHJpbmdzIGhvbGQgdGhlaXIgbGFzdCBmcmFtZSBhbmQgdGhlIGhvc3QgaXMgZGlzcGxheTpub25lLFxuICAvLyBzbyB0aGVyZSBpcyBub3RoaW5nIHRvIHJlcGFpbnQgdW50aWwgd2UgdGhhdy4gKFNlZSBoaWRlL3Nob3ctb3ZlcmxheXMuKVxuICBsZXQgb3ZlcmxheUZyb3plbiA9IGZhbHNlO1xuICAvLyBSZW1lbWJlciBlYWNoIHRyYWNrZWQgcmluZydzIG9wdHMgc28gdGhhdygpIGNhbiByZS1hcm0gaXRzIGxvb3AuXG4gIGNvbnN0IHJpbmdUcmFja09wdHMgPSBuZXcgTWFwPHN0cmluZywge2VsOiBFbGVtZW50OyBvcHRzOiBSaW5nT3B0c30+KCk7XG4gIGNvbnN0IGFybVJpbmdMb29wID0gKGtleTogc3RyaW5nLCBlbDogRWxlbWVudCwgb3B0czogUmluZ09wdHMpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzbG90ID0gcmluZ3MuZ2V0KGtleSk7XG4gICAgaWYgKCFzbG90KSByZXR1cm47XG4gICAgaWYgKHNsb3QucmFmKSBjYW5jZWxBbmltYXRpb25GcmFtZShzbG90LnJhZik7XG4gICAgY29uc3QgdGljayA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghZWwuaXNDb25uZWN0ZWQpIHsgcmVtb3ZlUmluZyhrZXkpOyByaW5nVHJhY2tPcHRzLmRlbGV0ZShrZXkpOyByZXR1cm47IH1cbiAgICAgIGlmIChvdmVybGF5RnJvemVuKSB7IHNsb3QucmFmID0gMDsgcmV0dXJuOyB9IC8vIGhvbGQgbGFzdCBmcmFtZTsgdGhhdygpIHJlLWFybXNcbiAgICAgIHBvc2l0aW9uUmluZyhzbG90LCBlbCwgb3B0cyk7XG4gICAgICBzbG90LnJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuICAgIHRpY2soKTtcbiAgfTtcbiAgY29uc3QgdHJhY2tFbGVtZW50ID0gKGtleTogc3RyaW5nLCBlbDogRWxlbWVudCwgb3B0czogUmluZ09wdHMgPSB7fSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNsb3QgPSBlbnN1cmVSaW5nKGtleSk7XG4gICAgc2xvdC50YXJnZXQgPSBlbDtcbiAgICByaW5nVHJhY2tPcHRzLnNldChrZXksIHtlbCwgb3B0c30pO1xuICAgIGFybVJpbmdMb29wKGtleSwgZWwsIG9wdHMpO1xuICAgIC8vIEEgZnJlc2ggcmluZyBpcyBhIGdvb2QgbW9tZW50IHRvIHJlLXN0YWNrIGFib3ZlIGFueSBkaWFsb2cvcG9wb3ZlclxuICAgIC8vIHRoZSBwYWdlIG9wZW5lZCBzaW5jZSB3ZSBsYXN0IHBhaW50ZWQuXG4gICAgYnJpbmdUb0Zyb250KCk7XG4gIH07XG4gIC8vIFN0b3AgZXZlcnkgcmluZydzIHJBRiBsb29wIGluIHBsYWNlICh1c2VkIGR1cmluZyBzY3JlZW5zaG90IGNhcHR1cmUpLlxuICAvLyBUaGUgc2xvdCBrZWVwcyBpdHMgY3VycmVudCBnZW9tZXRyeTsgdGhhd1JpbmdzIHJlLWFybXMgdGhlIGxvb3BzLlxuICBjb25zdCBmcmVlemVSaW5ncyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IHNsb3Qgb2YgcmluZ3MudmFsdWVzKCkpIHtcbiAgICAgIGlmIChzbG90LnJhZikgeyBjYW5jZWxBbmltYXRpb25GcmFtZShzbG90LnJhZik7IHNsb3QucmFmID0gMDsgfVxuICAgIH1cbiAgfTtcbiAgLy8gUmUtYXJtIGV2ZXJ5IHRyYWNrZWQgcmluZydzIGxvb3AgYWZ0ZXIgYSBmcmVlemUuIEVhY2ggbG9vcCdzIGZpcnN0IHRpY2tcbiAgLy8gcnVucyBzeW5jaHJvbm91c2x5LCBzbyBhbGwgcmluZ3MgcmVwb3NpdGlvbiBvbiB0aGUgc2FtZSBmcmFtZS5cbiAgY29uc3QgdGhhd1JpbmdzID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgW2tleSwge2VsLCBvcHRzfV0gb2YgcmluZ1RyYWNrT3B0cykgYXJtUmluZ0xvb3Aoa2V5LCBlbCwgb3B0cyk7XG4gIH07XG5cbiAgY29uc3QgZmxhc2hFbGVtZW50ID0gKGVsOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc2xvdCA9IGVuc3VyZVJpbmcoJ2ZsYXNoJyk7XG4gICAgcG9zaXRpb25SaW5nKHNsb3QsIGVsLCB7fSk7XG4gICAgLy8gV2ViIEFuaW1hdGlvbnMgQVBJIOKAlCBrZXlmcmFtZXMgbmVlZCBubyA8c3R5bGU+LCBubyBDU1AgaXNzdWUuXG4gICAgc2xvdC5lbC5hbmltYXRlKFtcbiAgICAgIHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxLjA0KScsIGJvcmRlckNvbG9yOiAnI2ZmZTA2NicsIGJveFNoYWRvdzogJzAgMCAwIDZweCByZ2JhKDI1NSwyMjQsMTAyLC40KSd9LFxuICAgICAge29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ30sXG4gICAgXSwge2R1cmF0aW9uOiA3MDAsIGVhc2luZzogJ2Vhc2Utb3V0JywgZmlsbDogJ2ZvcndhcmRzJ30pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gcmVtb3ZlUmluZygnZmxhc2gnKSwgNzIwKTtcbiAgfTtcblxuICAvLyBMb2NhdGUtb24tcGFnZSBpcyBhIGRlbGliZXJhdGUgdXNlciByZXF1ZXN0IGZyb20gdGhlIHNpZGUgcGFuZWwgKFwid2hlcmVcbiAgLy8gaXMgdGhpcyB0aGluZz9cIiksIHNvIHRoZSB2aXN1YWwgbXVzdCBiZSBsb3VkIGVub3VnaCB0byBmaW5kIG9uIGFcbiAgLy8gY3Jvd2RlZCBwYWdlLiBUaHJlZSBzZXF1ZW50aWFsIHB1bHNlcyB3aXRoIGFuIGV4cGFuZGluZyBzaGFkb3cgaGFsbyxcbiAgLy8gcGx1cyBhIGNlbnRlci1hbmNob3JlZCBzY2FsZSB0aGF0IHBvcHMgdGhlbiBzZXR0bGVzLiBFYWNoIHB1bHNlIHJ1bnNcbiAgLy8gfjUwMG1zOyB0b3RhbCB+MS41cy4gRGlzdGluY3QgY29sb3IgKGVsZWN0cmljIGN5YW4pIHNvIGl0IGRvZXNuJ3RcbiAgLy8gY29uZnVzZSB3aXRoIHRoZSBvcmFuZ2UgaG92ZXIgcmluZyBvciB0aGUgbGltZSBkcmFnIHByZXZpZXcuXG4gIGNvbnN0IGxvY2F0ZUZsYXNoID0gKGVsOiBFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChyLndpZHRoID09PSAwIHx8IHIuaGVpZ2h0ID09PSAwKSByZXR1cm47XG4gICAgZWwuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICdjZW50ZXInfSk7XG4gICAgY29uc3Qgc2xvdCA9IGVuc3VyZVJpbmcoJ2xvY2F0ZScpO1xuICAgIHBvc2l0aW9uUmluZyhzbG90LCBlbCwge30pO1xuICAgIE9iamVjdC5hc3NpZ24oc2xvdC5lbC5zdHlsZSwge1xuICAgICAgYm9yZGVyQ29sb3I6ICcjNWZkMWZmJyxcbiAgICAgIGJvcmRlcldpZHRoOiAnM3B4JyxcbiAgICAgIGJveFNoYWRvdzogJzAgMCAwIDRweCByZ2JhKDk1LDIwOSwyNTUsLjM1KSwgMCAwIDM2cHggcmdiYSg5NSwyMDksMjU1LC43KScsXG4gICAgICBvcGFjaXR5OiAnMScsXG4gICAgfSk7XG4gICAgLy8gVGhyZWUgcHVsc2UgY3ljbGVzOiBicmlnaHRlciBoYWxvICsgc2xpZ2h0IHNjYWxlIHB1bHNlIG9uIGVhY2ggYmVhdC5cbiAgICBzbG90LmVsLmFuaW1hdGUoW1xuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDApJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgNHB4IHJnYmEoOTUsMjA5LDI1NSwuNDUpLCAwIDAgMjBweCByZ2JhKDk1LDIwOSwyNTUsLjU1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDYpJywgb3BhY2l0eTogMSwgYm94U2hhZG93OiAnMCAwIDAgMTJweCByZ2JhKDk1LDIwOSwyNTUsLjE4KSwgMCAwIDYwcHggcmdiYSg5NSwyMDksMjU1LC44NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjAwKScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDRweCByZ2JhKDk1LDIwOSwyNTUsLjQ1KSwgMCAwIDIwcHggcmdiYSg5NSwyMDksMjU1LC41NSknfSxcbiAgICAgIHt0cmFuc2Zvcm06ICdzY2FsZSgxLjA2KScsIG9wYWNpdHk6IDEsIGJveFNoYWRvdzogJzAgMCAwIDEycHggcmdiYSg5NSwyMDksMjU1LC4xOCksIDAgMCA2MHB4IHJnYmEoOTUsMjA5LDI1NSwuODUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wMCknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCA0cHggcmdiYSg5NSwyMDksMjU1LC40NSksIDAgMCAyMHB4IHJnYmEoOTUsMjA5LDI1NSwuNTUpJ30sXG4gICAgICB7dHJhbnNmb3JtOiAnc2NhbGUoMS4wNiknLCBvcGFjaXR5OiAxLCBib3hTaGFkb3c6ICcwIDAgMCAxMnB4IHJnYmEoOTUsMjA5LDI1NSwuMTgpLCAwIDAgNjBweCByZ2JhKDk1LDIwOSwyNTUsLjg1KSd9LFxuICAgICAge3RyYW5zZm9ybTogJ3NjYWxlKDEuMDApJywgb3BhY2l0eTogMH0sXG4gICAgXSwge2R1cmF0aW9uOiAxNjAwLCBlYXNpbmc6ICdlYXNlLWluLW91dCcsIGZpbGw6ICdmb3J3YXJkcyd9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbW92ZVJpbmcoJ2xvY2F0ZScpLCAxNzAwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU3BhY2luZyB2aXN1YWxpemVyIChQbGFzbWljLWluc3BpcmVkKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gNCBtYXJnaW4gc3RyaXBzIChsaWdodCBvcmFuZ2UsIG91dHNpZGUgdGhlIGVsZW1lbnQpICsgNCBwYWRkaW5nIHN0cmlwc1xuICAvLyAobGlnaHQgYmx1ZSwgaW5zaWRlIHRoZSBlbGVtZW50KS4gU2lkZS1wYW5lbCBwdXNoZXMgYSBgc2V0LWNzLXByZWZzYFxuICAvLyBtZXNzYWdlIHRvIHRvZ2dsZS4gV2hlbiBPTiwgZmlyZUhvdmVyIHBhaW50cyB0aGVzZSBzdHJpcGVzIGFyb3VuZCB0aGVcbiAgLy8gY3VycmVudGx5LWhvdmVyZWQgZWxlbWVudCBlYWNoIGZyYW1lLlxuICBsZXQgc3BhY2luZ092ZXJsYXkgPSBmYWxzZTtcbiAgY29uc3Qgc3BhY2luZ0RpdnM6IEhUTUxEaXZFbGVtZW50W10gPSBbXTtcbiAgY29uc3QgZW5zdXJlU3BhY2luZ0RpdnMgPSAoKTogSFRNTERpdkVsZW1lbnRbXSA9PiB7XG4gICAgaWYgKHNwYWNpbmdEaXZzLmxlbmd0aCkgcmV0dXJuIHNwYWNpbmdEaXZzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBPYmplY3QuYXNzaWduKGQuc3R5bGUsIHtcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIGRpc3BsYXk6ICdub25lJyxcbiAgICAgICAgYmFja2dyb3VuZDogaSA8IDQgPyAncmdiYSgyNTUsMTU5LDY0LC4yOCknIDogJ3JnYmEoMTA4LDE3OCwyMzUsLjI4KScsXG4gICAgICB9KTtcbiAgICAgIHNoYWRvdy5hcHBlbmQoZCk7XG4gICAgICBzcGFjaW5nRGl2cy5wdXNoKGQpO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2luZ0RpdnM7XG4gIH07XG4gIGNvbnN0IGNsZWFyU3BhY2luZ092ZXJsYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBkIG9mIHNwYWNpbmdEaXZzKSBkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH07XG4gIGNvbnN0IHBhaW50U3BhY2luZ092ZXJsYXkgPSAoZWw6IEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNwYWNpbmdPdmVybGF5KSB7IGNsZWFyU3BhY2luZ092ZXJsYXkoKTsgcmV0dXJuOyB9XG4gICAgY29uc3QgY3MgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgY29uc3QgciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG10ID0gcGFyc2VGbG9hdChjcy5tYXJnaW5Ub3ApIHx8IDA7XG4gICAgY29uc3QgbXIgPSBwYXJzZUZsb2F0KGNzLm1hcmdpblJpZ2h0KSB8fCAwO1xuICAgIGNvbnN0IG1iID0gcGFyc2VGbG9hdChjcy5tYXJnaW5Cb3R0b20pIHx8IDA7XG4gICAgY29uc3QgbWwgPSBwYXJzZUZsb2F0KGNzLm1hcmdpbkxlZnQpIHx8IDA7XG4gICAgY29uc3QgcHQgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdUb3ApIHx8IDA7XG4gICAgY29uc3QgcHIgPSBwYXJzZUZsb2F0KGNzLnBhZGRpbmdSaWdodCkgfHwgMDtcbiAgICBjb25zdCBwYiA9IHBhcnNlRmxvYXQoY3MucGFkZGluZ0JvdHRvbSkgfHwgMDtcbiAgICBjb25zdCBwbCA9IHBhcnNlRmxvYXQoY3MucGFkZGluZ0xlZnQpIHx8IDA7XG4gICAgY29uc3QgW20xLCBtMiwgbTMsIG00LCBwMSwgcDIsIHAzLCBwNF0gPSBlbnN1cmVTcGFjaW5nRGl2cygpO1xuICAgIC8vIE1hcmdpbiBzdHJpcHMgKGFyb3VuZCB0aGUgZWxlbWVudClcbiAgICBjb25zdCBzZXQgPSAoZDogSFRNTERpdkVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgaWYgKHcgPD0gMCB8fCBoIDw9IDApIHsgZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyByZXR1cm47IH1cbiAgICAgIGQuc3R5bGUubGVmdCA9IHggKyAncHgnO1xuICAgICAgZC5zdHlsZS50b3AgPSB5ICsgJ3B4JztcbiAgICAgIGQuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgICAgIGQuc3R5bGUuaGVpZ2h0ID0gaCArICdweCc7XG4gICAgICBkLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH07XG4gICAgc2V0KG0xISwgci5sZWZ0IC0gbWwsIHIudG9wIC0gbXQsIHIud2lkdGggKyBtbCArIG1yLCBtdCk7ICAgICAgICAgICAgLy8gdG9wXG4gICAgc2V0KG0yISwgci5yaWdodCwgci50b3AsIG1yLCByLmhlaWdodCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHRcbiAgICBzZXQobTMhLCByLmxlZnQgLSBtbCwgci5ib3R0b20sIHIud2lkdGggKyBtbCArIG1yLCBtYik7ICAgICAgICAgICAgICAvLyBib3R0b21cbiAgICBzZXQobTQhLCByLmxlZnQgLSBtbCwgci50b3AsIG1sLCByLmhlaWdodCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0XG4gICAgLy8gUGFkZGluZyBzdHJpcHMgKGluc2lkZSB0aGUgZWxlbWVudClcbiAgICBzZXQocDEhLCByLmxlZnQsIHIudG9wLCByLndpZHRoLCBwdCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b3BcbiAgICBzZXQocDIhLCByLnJpZ2h0IC0gcHIsIHIudG9wICsgcHQsIHByLCByLmhlaWdodCAtIHB0IC0gcGIpOyAgICAgICAgICAvLyByaWdodFxuICAgIHNldChwMyEsIHIubGVmdCwgci5ib3R0b20gLSBwYiwgci53aWR0aCwgcGIpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJvdHRvbVxuICAgIHNldChwNCEsIHIubGVmdCwgci50b3AgKyBwdCwgcGwsIHIuaGVpZ2h0IC0gcHQgLSBwYik7ICAgICAgICAgICAgICAgIC8vIGxlZnRcbiAgfTtcblxuICAvLyDilIDilIDilIAgT24tcGFnZSBhbm5vdGF0aW9uIHRvb2x0aXAg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFubm90YXRpb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBhbm5vdGF0aW9uRWwuY2xhc3NOYW1lID0gJ2Fubm90YXRpb24nO1xuICBPYmplY3QuYXNzaWduKGFubm90YXRpb25FbC5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgYmFja2dyb3VuZDogJ3JnYmEoMTUsMTUsMjAsLjk2KScsXG4gICAgY29sb3I6ICcjZmNmYWY1JyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsOTUsMCwuNSknLFxuICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgIHBhZGRpbmc6ICc4cHggMTBweCcsXG4gICAgZm9udDogXCIxMnB4LzEuNDUgdWktbW9ub3NwYWNlLCdKZXRCcmFpbnMgTW9ubycsTWVubG8sbW9ub3NwYWNlXCIsXG4gICAgbWF4V2lkdGg6ICdtaW4oMzYwcHgsIDcwdncpJyxcbiAgICBib3hTaGFkb3c6ICcwIDhweCAzMnB4IHJnYmEoMCwwLDAsLjU1KScsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgZGlzcGxheTogJ25vbmUnLFxuICAgIC8vIEFubm90YXRpb24gYWx3YXlzIHBhaW50cyBvbiB0b3Agb2YgcmluZ3MvcnViYmVyLWJhbmQvcHJldmlldyByaW5nc1xuICAgIC8vIChyaW5ncyBhcmUgekluZGV4OjE7IHRoaXMgbGlmdHMgdGhlIGNvbW1lbnQgYm94IGNsZWFyKS5cbiAgICB6SW5kZXg6ICcyMTQ3NDgzNjQ3JyxcbiAgfSk7XG4gIHNoYWRvdy5hcHBlbmQoYW5ub3RhdGlvbkVsKTtcbiAgY29uc3QgYW5ub3RhdGlvbiA9IHNldHVwQW5ub3RhdGlvbihhbm5vdGF0aW9uRWwsIHtcbiAgICBzZW5kVG9QYW5lbCxcbiAgICAvLyBGb3IgYW4gdW5jYXB0dXJlZCBlbGVtZW50LCB0aGUgdXNlciB0eXBpbmcgaW50byB0aGUgYm94IGFuZCBwcmVzc2luZ1xuICAgIC8vIEVudGVyIGJvdGggY2FwdHVyZXMgYW5kIGF0dGFjaGVzIHRoZSBjb21tZW50LlxuICAgIGNhcHR1cmVBbmRDb21tZW50OiAoZWwsIHRleHQpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gY2FwdHVyZUVudHJ5KGVsLCBuZXh0U2VxKCkpO1xuICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgIGNvbnN0IHBhZ2UgPSBidWlsZFBhZ2VDb250ZXh0KCk7XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZX0pO1xuICAgICAgdGVzdENhcHR1cmVzPy5wdXNoKHtlbnRyeSwgcGFnZX0pO1xuICAgICAgLy8gcGFyZW50VWlkICsgdXJsIGRpc2FtYmlndWF0ZSB3aGljaCBjYXB0dXJlIHRoZSBjb21tZW50XG4gICAgICAvLyBiZWxvbmdzIHRvIHdoZW4gdGhlIHNhbWUgc2VsZWN0b3IgZXhpc3RzIG9uIG11bHRpcGxlIHBhZ2VzXG4gICAgICAvLyBvciBmb3IgbXVsdGlwbGUgc2libGluZyBlbGVtZW50cyB3aXRoIHRoZSBzYW1lIHRlc3RJZC5cbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnZmVlZGJhY2stYWRkJywgc2VsZWN0b3I6IGVudHJ5LnNlbGVjdG9yLCB0ZXh0LCB1cmw6IHBhZ2UudXJsLCBwYXJlbnRVaWQ6IGVudHJ5LnVpZH0pO1xuICAgICAgcmV0dXJuIGVudHJ5O1xuICAgIH0sXG4gICAgLy8gQm94IGhpZGVzIOKGkiB0ZWFyIGRvd24gdGhlIG1hdGNoaW5nIGhvdmVyIHJpbmcgc28gdGhlIHR3byBnbyB0b2dldGhlci5cbiAgICBvbkhpZGU6ICgpID0+IHJlbW92ZVJpbmcoJ2hvdmVyJyksXG4gICAgLy8gQm94IGFwcGVhcnMgZm9yIGFuIGVsZW1lbnQg4oaSIGVuc3VyZSB0aGUgcmluZyBpcyBvbiB0aGUgc2FtZSBlbGVtZW50LlxuICAgIG9uU2hvdzogKGVsKSA9PiB0cmFja0VsZW1lbnQoJ2hvdmVyJywgZWwsIHtsYWJlbDogY29tcGFjdFRhcmdldChlbCl9KSxcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEFsdC1ob3ZlciBzdGF0ZSBtYWNoaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgYWx0QWN0aXZlID0gZmFsc2U7XG4gIGxldCBhbHRGb3J3YXJkZWQgPSBmYWxzZTtcbiAgbGV0IGxhc3RIb3ZlckVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBsYXN0TW91c2UgPSB7eDogLTEsIHk6IC0xfTtcbiAgbGV0IGtub3duQ2FwdHVyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLy8gSG92ZXIvY2xpY2sgc25hcDogd2hlbiBPTiwgZXZlcnkgYWx0LWhvdmVyIGFuZCBjYXB0dXJlIHdhbGtzIHVwIHRvIHRoZVxuICAvLyBuZWFyZXN0IGNvbXBvbmVudC1tYXJrZXIgYW5jZXN0b3IgKGRhdGEtdGVzdGlkL3JvbGUvaWQvYnV0dG9uL2EvaW5wdXQpXG4gIC8vIHNvIHNpbmdsZS1jbGljayBhbmQgcnViYmVyLWJhbmQgc2VsZWN0aW9uIHBpY2sgY29uc2lzdGVudCBsYXllcnNcbiAgLy8gcmVnYXJkbGVzcyBvZiBwaXhlbC1sZXZlbCBjdXJzb3IgcGxhY2VtZW50LiBQdXNoZWQgYnkgdGhlIHNpZGUgcGFuZWxcbiAgLy8gdmlhIGBzZXQtY3MtcHJlZnNgLlxuICBsZXQgaG92ZXJTbmFwID0gdHJ1ZTtcblxuICBjb25zdCBmaXJlSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgcmVtb3ZlUmluZygnaG92ZXInKTtcbiAgICBjbGVhclNwYWNpbmdPdmVybGF5KCk7XG4gICAgbGFzdEhvdmVyRWwgPSBudWxsO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnaG92ZXItZW5kJ30pO1xuICB9O1xuXG4gIGNvbnN0IHNldEFsdEFjdGl2ZSA9IChvbjogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChhbHRBY3RpdmUgPT09IG9uKSByZXR1cm47XG4gICAgYWx0QWN0aXZlID0gb247XG4gICAgaWYgKCFvbikge1xuICAgICAgLy8gSWYgdGhlIGNvbW1lbnQgYm94IGlzIHZpc2libGUsIHJpbmcgYW5kIGJveCBhcmUgYSB1bml0OiBrZWVwIEJPVEhcbiAgICAgIC8vIG9uIHNjcmVlbiBhbmQgaGFuZCBmb2N1cyB0byB0aGUgdGV4dGFyZWEgc28gdGhlIHVzZXIgY2FuIHR5cGVcbiAgICAgIC8vIGltbWVkaWF0ZWx5LiBJZiB0aGVyZSdzIG5vIGJveCwgbm8gZm9jdXMgdG8gZ2l2ZSDigJQgdGVhciBkb3duIHRoZVxuICAgICAgLy8gcmluZyBhcyBiZWZvcmUuXG4gICAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIHtcbiAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdob3Zlci1lbmQnfSk7IC8vIHBhbmVsLXNpZGUgc3RhdHVzIHJlc2V0XG4gICAgICAgIGFubm90YXRpb24uZm9jdXNUZXh0YXJlYSgpO1xuICAgICAgICAvLyAocmluZyByZW1haW5zOyByQUYga2VlcHMgaXQgdHJhY2tpbmcgdGhlIGN1cnJlbnQgZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpcmVIb3ZlckVuZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobGFzdE1vdXNlLnggPj0gMCkge1xuICAgICAgY29uc3QgdGd0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChsYXN0TW91c2UueCwgbGFzdE1vdXNlLnkpO1xuICAgICAgaWYgKHRndCBpbnN0YW5jZW9mIEVsZW1lbnQpIHsgbGFzdEhvdmVyRWwgPSB0Z3Q7IGZpcmVIb3Zlcih0Z3QpOyB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFRydWUgd2hlbiBhbiBlbGVtZW50IGlzIHRvbyBsYXJnZSB0byBiZSBhIG1lYW5pbmdmdWwgY2FwdHVyZSB0YXJnZXQg4oCUXG4gIC8vIGJvZHkgLyBodG1sIC8gd3JhcHBlcnMgY292ZXJpbmcgbW9zdCBvZiB0aGUgdmlld3BvcnQuIFVzZWQgdG8gcmVqZWN0XG4gIC8vIGFsdC1jbGljayBhbmQgcGVuZGluZy1zdGFnZSBjYXB0dXJlcyBzbyB0aGUgdXNlciBkb2Vzbid0IGFjY2lkZW50YWxseVxuICAvLyBncmFiIHRoZSB3aG9sZSBwYWdlIHdoZW4gdGhleSBjbGljayBvbiBkZWFkIHNwYWNlLlxuICBjb25zdCBpc0h1Z2VFbGVtZW50ID0gKGVsOiBFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gci53aWR0aCA+PSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuOSAmJiByLmhlaWdodCA+PSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjk7XG4gIH07XG5cbiAgY29uc3QgcmVzb2x2ZUhvdmVyVGFyZ2V0ID0gKHRndDogRWxlbWVudCk6IHtlbDogRWxlbWVudDsgc2VsZWN0b3I6IHN0cmluZ30gPT4ge1xuICAgIGNvbnN0IGVsID0gaG92ZXJTbmFwID8gc25hcFRvQ29tcG9uZW50KHRndCwga25vd25DYXB0dXJlZCkgOiB0Z3Q7XG4gICAgLy8gUmV1c2UgYSBrbm93bi1jYXB0dXJlZCBzZWxlY3RvciB2ZXJiYXRpbSBpZiB0aGUgc25hcHBlZCBlbGVtZW50XG4gICAgLy8gbWF0Y2hlcyBvbmUg4oCUIGtlZXBzIHRoZSBjYXB0dXJlZC1zaWRlIGlkZW50aXR5IHN0YWJsZS5cbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBrbm93bkNhcHR1cmVkKSB7XG4gICAgICB0cnkgeyBpZiAoZWwubWF0Y2hlcyhzZWwpKSByZXR1cm4ge2VsLCBzZWxlY3Rvcjogc2VsfTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiB7ZWwsIHNlbGVjdG9yOiBjc3NQYXRoKGVsKX07XG4gIH07XG5cbiAgY29uc3QgZmlyZUhvdmVyID0gKHRndDogRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHtlbCwgc2VsZWN0b3J9ID0gcmVzb2x2ZUhvdmVyVGFyZ2V0KHRndCk7XG4gICAgLy8gUmVqZWN0IGJvZHkgLyBodG1sIC8gYW55IHBhZ2Utc3Bhbm5pbmcgd3JhcHBlciBhdCB0aGUgaG92ZXIgc3RhZ2UgdG9vLlxuICAgIC8vIFRoZSBlYXJsaWVyIGZpbHRlciBvbmx5IHJhbiBvbiBjbGljayArIHN0YWdlUGVuZGluZywgc28gYWx0LWhvdmVyaW5nXG4gICAgLy8gZW1wdHkgcGFnZSBhcmVhIHN0aWxsIHBhaW50ZWQgYSByaW5nIGFyb3VuZCB0aGUgZW50aXJlIHBhZ2UuXG4gICAgaWYgKGlzSHVnZUVsZW1lbnQoZWwpKSB7XG4gICAgICByZW1vdmVSaW5nKCdob3ZlcicpO1xuICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdob3Zlci1lbmQnfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyYWNrRWxlbWVudCgnaG92ZXInLCBlbCwge2xhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKX0pO1xuICAgIHBhaW50U3BhY2luZ092ZXJsYXkoZWwpO1xuICAgIGNvbnN0IHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBzZW5kVG9QYW5lbCh7XG4gICAgICBraW5kOiAnaG92ZXInLFxuICAgICAgc2VsZWN0b3IsXG4gICAgICB0YWc6IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIGxhYmVsOiBjb21wYWN0VGFyZ2V0KGVsKSxcbiAgICAgIHJlY3Q6IHt4OiBNYXRoLnJvdW5kKHIueCksIHk6IE1hdGgucm91bmQoci55KSwgdzogTWF0aC5yb3VuZChyLndpZHRoKSwgaDogTWF0aC5yb3VuZChyLmhlaWdodCl9LFxuICAgIH0pO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBEcmFnIHN0YXRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgc2VxdWVuY2VDb3VudGVyID0gMDtcbiAgY29uc3QgbmV4dFNlcSA9ICgpOiBudW1iZXIgPT4gKytzZXF1ZW5jZUNvdW50ZXI7XG4gIGxldCBsYXN0Q29udGV4dEVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdXBwcmVzc05leHRDbGljayA9IGZhbHNlO1xuICBsZXQgZHJhZ1N0YXJ0OiB7eDogbnVtYmVyOyB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG4gIGxldCBkcmFnUmVjdDogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGRyYWdTYXZlZFVzZXJTZWxlY3QgPSAnJztcbiAgLy8gU3RhYmxlIGNhbmRpZGF0ZSBwb29sIGxvY2tlZCBhdCBkcmFnIHN0YXJ0IOKAlCBldmVyeSBlbGVtZW50c0luUmVjdCBjYWxsXG4gIC8vIGZvciB0aGlzIGRyYWcgdXNlcyB0aGUgc2FtZSBwb29sLCBzbyB0aGUgcnViYmVyLWJhbmQgc2VsZWN0aW9uIGdyb3dzIC9cbiAgLy8gc2hyaW5rcyBtb25vdG9uaWNhbGx5IHdpdGggcmVjdCBzaXplIChubyB0aWVyLXNoaWZ0IGNodXJuKS5cbiAgbGV0IGRyYWdDYW5kaWRhdGVzOiByZWFkb25seSBFbGVtZW50W10gPSBbXTtcblxuICBjb25zdCBjbGVhclByZXZpZXdSaW5ncyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLnJpbmdzLmtleXMoKV0pIGlmIChrLnN0YXJ0c1dpdGgoJ3ByZXZpZXc6JykpIHJlbW92ZVJpbmcoayk7XG4gIH07XG4gIGNvbnN0IGVuc3VyZURyYWdSZWN0ID0gKCk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBpZiAoZHJhZ1JlY3QpIHJldHVybiBkcmFnUmVjdDtcbiAgICBkcmFnUmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRyYWdSZWN0LmNsYXNzTmFtZSA9ICdydWJiZXInO1xuICAgIE9iamVjdC5hc3NpZ24oZHJhZ1JlY3Quc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAvLyBCb3JkZXIgc3R5bGUgaXMgc2V0IGJ5IHVwZGF0ZURyYWdSZWN0IGVhY2ggZnJhbWU6IHNvbGlkIGZvciBcImZ1bGxcbiAgICAgIC8vIGVuY2xvc3VyZVwiIChsZWZ04oaScmlnaHQpLCBkYXNoZWQgZm9yIFwicGFydGlhbCBvdmVybGFwXCIgKHJpZ2h04oaSbGVmdCkuXG4gICAgICBib3JkZXI6ICcycHggc29saWQgI2ZmNWYwMCcsXG4gICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsOTUsMCwuMTQpJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICBib3hTaGFkb3c6ICcwIDAgMCAxcHggcmdiYSgyNTUsOTUsMCwuMzUpLCAwIDAgMThweCByZ2JhKDI1NSw5NSwwLC4yNSknLFxuICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgfSk7XG4gICAgc2hhZG93LmFwcGVuZChkcmFnUmVjdCk7XG4gICAgZHJhZ1NhdmVkVXNlclNlbGVjdCA9IGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdDtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2Nyb3NzaGFpcic7XG4gICAgLy8gRHJhZyBtb2RlOiBoaWRlIHRoZSBjb21tZW50IGJveCBzbyBpdCBkb2Vzbid0IG9ic2N1cmUgdGhlIHJ1YmJlciBiYW5kLlxuICAgIGFubm90YXRpb24uaGlkZSgpO1xuICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgLy8gTG9jayB0aGUgY2FuZGlkYXRlIHBvb2wgT05DRSBwZXIgZHJhZyAocmlnb3JvdXMtM2QtYXBwIGJlaGF2aW9yKS5cbiAgICBkcmFnQ2FuZGlkYXRlcyA9IHBpY2tEcmFnQ2FuZGlkYXRlcyhvdmVybGF5SG9zdCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAnZHJhZyBjYW5kaWRhdGUgcG9vbCBsb2NrZWQ6JywgZHJhZ0NhbmRpZGF0ZXMubGVuZ3RoLCAnZWxlbWVudHMnKTtcbiAgICByZXR1cm4gZHJhZ1JlY3Q7XG4gIH07XG4gIGNvbnN0IHRlYXJkb3duRHJhZ1JlY3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGRyYWdSZWN0KSB7IGRyYWdSZWN0LnJlbW92ZSgpOyBkcmFnUmVjdCA9IG51bGw7IH1cbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBkcmFnU2F2ZWRVc2VyU2VsZWN0O1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICcnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgY2xlYXJQcmV2aWV3UmluZ3MoKTtcbiAgICBkcmFnQ2FuZGlkYXRlcyA9IFtdO1xuICB9O1xuICBsZXQgbGFzdFByZXZpZXdLZXlzID0gbmV3IFNldDxFbGVtZW50PigpO1xuICAvLyBTZWxlY3Rpb24gbW9kZSBpcyBkZWNpZGVkIGJ5IGRyYWcgZGlyZWN0aW9uICgzRC1hcHAgY29udmVudGlvbik6XG4gIC8vICAgbGVmdOKGknJpZ2h0ICA6ICdmdWxsJyAgICDigJQgZWxlbWVudCBtdXN0IGJlIGVudGlyZWx5IGluc2lkZSB0aGUgcmVjdDtcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWJiZXItYmFuZCBoYXMgYSBTT0xJRCBib3JkZXIuXG4gIC8vICAgcmlnaHTihpJsZWZ0ICA6ICdwYXJ0aWFsJyDigJQgYW55IG92ZXJsYXAgc2VsZWN0cztcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWJiZXItYmFuZCBoYXMgYSBET1RURUQgYm9yZGVyLlxuICBjb25zdCBkcmFnTW9kZSA9IChlOiBNb3VzZUV2ZW50KTogJ3BhcnRpYWwnIHwgJ2Z1bGwnID0+XG4gICAgZHJhZ1N0YXJ0ICYmIGUuY2xpZW50WCA+PSBkcmFnU3RhcnQueCA/ICdmdWxsJyA6ICdwYXJ0aWFsJztcblxuICBjb25zdCB1cGRhdGVEcmFnUmVjdCA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFkcmFnU3RhcnQpIHJldHVybjtcbiAgICBjb25zdCBkeCA9IE1hdGguYWJzKGUuY2xpZW50WCAtIGRyYWdTdGFydC54KTtcbiAgICBjb25zdCBkeSA9IE1hdGguYWJzKGUuY2xpZW50WSAtIGRyYWdTdGFydC55KTtcbiAgICBpZiAoIWRyYWdSZWN0ICYmIGR4IDwgMiAmJiBkeSA8IDIpIHJldHVybjtcbiAgICBjb25zdCB4MSA9IE1hdGgubWluKGRyYWdTdGFydC54LCBlLmNsaWVudFgpO1xuICAgIGNvbnN0IHkxID0gTWF0aC5taW4oZHJhZ1N0YXJ0LnksIGUuY2xpZW50WSk7XG4gICAgY29uc3QgeDIgPSBNYXRoLm1heChkcmFnU3RhcnQueCwgZS5jbGllbnRYKTtcbiAgICBjb25zdCB5MiA9IE1hdGgubWF4KGRyYWdTdGFydC55LCBlLmNsaWVudFkpO1xuICAgIGNvbnN0IHIgPSBlbnN1cmVEcmFnUmVjdCgpO1xuICAgIGNvbnN0IG1vZGUgPSBkcmFnTW9kZShlKTtcbiAgICBPYmplY3QuYXNzaWduKHIuc3R5bGUsIHtcbiAgICAgIGxlZnQ6IHgxICsgJ3B4JyxcbiAgICAgIHRvcDogeTEgKyAncHgnLFxuICAgICAgd2lkdGg6ICh4MiAtIHgxKSArICdweCcsXG4gICAgICBoZWlnaHQ6ICh5MiAtIHkxKSArICdweCcsXG4gICAgICBib3JkZXJTdHlsZTogbW9kZSA9PT0gJ2Z1bGwnID8gJ3NvbGlkJyA6ICdkYXNoZWQnLFxuICAgIH0pO1xuICAgIC8vIExpdmUgcHJldmlldzogcGFpbnQgYSB2aXZpZCByaW5nIG9uIGV2ZXJ5IGNhbmRpZGF0ZSB0aGUgcnViYmVyIGJhbmRcbiAgICAvLyB3b3VsZCBjb21taXQgaWYgdGhlIHVzZXIgcmVsZWFzZWQgcmlnaHQgbm93LiBEaWZmIGFnYWluc3QgdGhlIGxhc3RcbiAgICAvLyBmcmFtZSBzbyB3ZSBkb24ndCBjaHVybiByaW5ncyB3aGVuIHRoZSBzZXQgaXMgdW5jaGFuZ2VkLiBUaGVcbiAgICAvLyBjYW5kaWRhdGUgcG9vbCB3YXMgbG9ja2VkIGF0IGRyYWctc3RhcnQgc28gdGhlIHNldCBpcyBtb25vdG9uaWMgd2l0aFxuICAgIC8vIHJlY3Qgc2l6ZSDigJQgbm8gcmFuZG9tIHNlbGVjdC9kZXNlbGVjdCBtaWQtZHJhZy5cbiAgICBjb25zdCBlbHMgPSBlbGVtZW50c0luUmVjdChkcmFnQ2FuZGlkYXRlcywgeDEsIHkxLCB4MiwgeTIsIG1vZGUpO1xuICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KGVscyk7XG4gICAgbGV0IHNhbWUgPSBuZXh0LnNpemUgPT09IGxhc3RQcmV2aWV3S2V5cy5zaXplO1xuICAgIGlmIChzYW1lKSBmb3IgKGNvbnN0IGVsIG9mIG5leHQpIHsgaWYgKCFsYXN0UHJldmlld0tleXMuaGFzKGVsKSkgeyBzYW1lID0gZmFsc2U7IGJyZWFrOyB9IH1cbiAgICBpZiAoIXNhbWUpIHtcbiAgICAgIGNsZWFyUHJldmlld1JpbmdzKCk7XG4gICAgICBlbHMuZm9yRWFjaCgoZWwsIGkpID0+IHRyYWNrRWxlbWVudChgcHJldmlldzoke2l9YCwgZWwsIHtwcmV2aWV3OiB0cnVlfSkpO1xuICAgICAgbGFzdFByZXZpZXdLZXlzID0gbmV4dDtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgYGRyYWcgcHJldmlldyAoJHttb2RlfSk6YCwgZWxzLmxlbmd0aCwgJ3RhcmdldHMnLCBlbHMubWFwKGNvbXBhY3RUYXJnZXQpKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlbmRpbmctbXVsdGkgc3RhZ2luZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBlbmRpbmdNdWx0aTogQXJyYXk8e2VsOiBFbGVtZW50OyBlbnRyeTogRW50cnl9PiA9IFtdO1xuICBjb25zdCBzdGFnZVBlbmRpbmcgPSAocmF3OiBFbGVtZW50LCBjbGlja0F0Pzoge2NsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyfSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gaG92ZXJTbmFwID8gc25hcFRvQ29tcG9uZW50KHJhdywga25vd25DYXB0dXJlZCkgOiByYXc7XG4gICAgaWYgKGlzSHVnZUVsZW1lbnQoZWwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdza2lwcGluZyBodWdlIGVsZW1lbnQgZnJvbSBzdGFnaW5nOicsIGNvbXBhY3RUYXJnZXQoZWwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkoZWwsIG5leHRTZXEoKSwge1xuICAgICAgLi4uKGNsaWNrQXQgPyB7Y2xpY2tBdH0gOiB7fSksXG4gICAgfSk7XG4gICAgaWYgKHBlbmRpbmdNdWx0aS5zb21lKChwKSA9PiBwLmVsID09PSBlbCB8fCBwLmVudHJ5LnNlbGVjdG9yID09PSBlbnRyeS5zZWxlY3RvcikpIHtcbiAgICAgIGZsYXNoRWxlbWVudChlbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlkeCA9IHBlbmRpbmdNdWx0aS5sZW5ndGg7XG4gICAgcGVuZGluZ011bHRpLnB1c2goe2VsLCBlbnRyeX0pO1xuICAgIHRyYWNrRWxlbWVudChgcGVuZGluZzoke2lkeH1gLCBlbCwge2dvbGQ6IHRydWUsIGxhYmVsOiBgIyR7aWR4ICsgMX0gJHtjb21wYWN0VGFyZ2V0KGVsKX1gfSk7XG4gICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3BlbmRpbmctYWRkJywgZW50cnl9KTtcbiAgfTtcbiAgY29uc3QgY29tbWl0UGVuZGluZ011bHRpID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ2NvbW1pdFBlbmRpbmdNdWx0aSDigJQgY29tbWl0dGluZycsIHBlbmRpbmdNdWx0aS5sZW5ndGgsICdzdGFnZWQgZWxlbWVudHMnKTtcbiAgICBjb25zb2xlLnRyYWNlKExPRywgJ2NvbW1pdCBzdGFjayB0cmFjZScpO1xuICAgIHBlbmRpbmdNdWx0aS5mb3JFYWNoKCh7ZWwsIGVudHJ5fSwgaSkgPT4ge1xuICAgICAgY29uc3QgcGFnZSA9IGJ1aWxkUGFnZUNvbnRleHQoKTtcbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAnY2FwdHVyZScsIGVudHJ5LCBwYWdlLCBncm91cGVkOiBpID4gMH0pO1xuICAgICAgdGVzdENhcHR1cmVzPy5wdXNoKHtlbnRyeSwgcGFnZSwgZ3JvdXBlZDogaSA+IDB9KTtcbiAgICAgIHJlbW92ZVJpbmcoYHBlbmRpbmc6JHtpfWApO1xuICAgICAgaWYgKGVsLmlzQ29ubmVjdGVkKSBmbGFzaEVsZW1lbnQoZWwpO1xuICAgIH0pO1xuICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncGVuZGluZy1jbGVhcid9KTtcbiAgfTtcbiAgY29uc3QgY2FuY2VsUGVuZGluZ011bHRpID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSBjb25zb2xlLmxvZyhMT0csICdjYW5jZWxQZW5kaW5nTXVsdGkg4oCUIGRpc2NhcmRpbmcnLCBwZW5kaW5nTXVsdGkubGVuZ3RoLCAnc3RhZ2VkJyk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKF8sIGkpID0+IHJlbW92ZVJpbmcoYHBlbmRpbmc6JHtpfWApKTtcbiAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ3BlbmRpbmctY2xlYXInfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE1vdXNlIGxpc3RlbmVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGxhc3RNb3ZlVHMgPSAwO1xuICBjb25zdCBvbk1vdXNlTW92ZSA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFvcnBoYW5HdWFyZCgpKSByZXR1cm47XG4gICAgaWYgKGUudGltZVN0YW1wID09PSBsYXN0TW92ZVRzKSByZXR1cm47XG4gICAgbGFzdE1vdmVUcyA9IGUudGltZVN0YW1wO1xuICAgIGxhc3RNb3VzZSA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG4gICAgaWYgKGRyYWdTdGFydCkge1xuICAgICAgLy8gSW4gYSBydWJiZXItYmFuZCBkcmFnIHRoZSBvbmx5IGhpZ2hsaWdodCB0aGF0IHNob3VsZCBhcHBlYXIgaXMgdGhlXG4gICAgICAvLyBsaW1lIFBSRVZJRVcgcmluZyBvbiBjYW5kaWRhdGVzIGluc2lkZSB0aGUgcmVjdC4gVGhlIG9yYW5nZSBob3ZlclxuICAgICAgLy8gcmluZyB3b3VsZCBvdGhlcndpc2UgcmVwYWludCBvbiB3aGF0ZXZlciBlbGVtZW50IHRoZSBjdXJzb3IgaXNcbiAgICAgIC8vIG92ZXIsIG1peGluZyB0d28gY29sb3JzIGFuZCBjb25mdXNpbmcgdGhlIHVzZXIuXG4gICAgICB1cGRhdGVEcmFnUmVjdChlKTtcbiAgICAgIHJlbW92ZVJpbmcoJ2hvdmVyJyk7XG4gICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2hvdmVyLWVuZCd9KTtcbiAgICAgIGxhc3RIb3ZlckVsID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgYWx0T24gPSBlLmFsdEtleSB8fCBhbHRGb3J3YXJkZWQ7XG4gICAgaWYgKCFhbHRPbikgeyBpZiAoYWx0QWN0aXZlKSBzZXRBbHRBY3RpdmUoZmFsc2UpOyByZXR1cm47IH1cbiAgICBpZiAoIWFsdEFjdGl2ZSkgc2V0QWx0QWN0aXZlKHRydWUpO1xuICAgIGNvbnN0IHRndCA9IGUudGFyZ2V0O1xuICAgIGlmICghKHRndCBpbnN0YW5jZW9mIEVsZW1lbnQpIHx8IHRndCA9PT0gbGFzdEhvdmVyRWwpIHJldHVybjtcbiAgICBsYXN0SG92ZXJFbCA9IHRndDtcbiAgICBmaXJlSG92ZXIodGd0KTtcbiAgfTtcblxuICBjb25zdCBpc0luc2lkZUFubm90YXRpb24gPSAoZTogRXZlbnQpOiBib29sZWFuID0+IHtcbiAgICBpZiAoYW5ub3RhdGlvbkVsLnN0eWxlLmRpc3BsYXkgIT09ICdibG9jaycpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwYXRoID0gdHlwZW9mIGUuY29tcG9zZWRQYXRoID09PSAnZnVuY3Rpb24nID8gZS5jb21wb3NlZFBhdGgoKSA6IFtdO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBwYXRoKSBpZiAobm9kZSA9PT0gYW5ub3RhdGlvbkVsKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRi4xOCDigJQgbmV2ZXIgY2FwdHVyZSBhbiBlbGVtZW50IHRoYXQncyBwYXJ0IG9mIHBpbmNoZ3JhYidzIG93biBVSS5cbiAgLy8gVGhlIHNoYWRvdyBob3N0IGlzIGAjX19waW5jaGdyYWJfb3ZlcmxheWA7IGV2ZXJ5dGhpbmcgcGFpbnRlZCBpbnNpZGVcbiAgLy8gKHJpbmdzLCBydWJiZXIgYmFuZCwgbm9vZGxlIFNWRywgYW5ub3RhdGlvbiB0ZXh0YXJlYSkgbGl2ZXMgaW4gaXRzXG4gIC8vIHNoYWRvdyByb290LiBPcGVuLW1vZGUgc2hhZG93ICsgY29tcG9zZWRQYXRoKCkgbGV0cyB1cyBzZWUgdGhlIHJlYWxcbiAgLy8gdGFyZ2V0IGV2ZW4gd2hlbiBldmVudCByZXRhcmdldGluZyBpcyBpbiBwbGF5LCBzbyB3ZSB3YWxrIHRoZVxuICAvLyBjb21wb3NlZCBwYXRoIGxvb2tpbmcgZm9yIHRoZSBob3N0LiBUaGUgY2hlYXAgaWQgY2hlY2sgc3RpbGwgcnVuc1xuICAvLyBmaXJzdCBhcyBhIGZhc3QgcGF0aC5cbiAgY29uc3QgaXNQaW5jaGdyYWJPd25VaSA9IChlOiBFdmVudCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldDtcbiAgICBpZiAodCBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgdC5pZCA9PT0gJ19fcGluY2hncmFiX292ZXJsYXknKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBwYXRoID0gdHlwZW9mIGUuY29tcG9zZWRQYXRoID09PSAnZnVuY3Rpb24nID8gZS5jb21wb3NlZFBhdGgoKSA6IFtdO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBwYXRoKSB7XG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5pZCA9PT0gJ19fcGluY2hncmFiX292ZXJsYXknKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChub2RlID09PSBvdmVybGF5SG9zdCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBvbk1vdXNlRG93biA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFvcnBoYW5HdWFyZCgpKSByZXR1cm47XG4gICAgaWYgKGlzSW5zaWRlQW5ub3RhdGlvbihlKSkgcmV0dXJuO1xuICAgIGlmIChhbm5vdGF0aW9uRWwuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJyAmJiAhYW5ub3RhdGlvbi5pc0xvY2tlZCgpKSBhbm5vdGF0aW9uLmhpZGUoKTtcbiAgICBpZiAoIWUuYWx0S2V5IHx8IGRyYWdTdGFydCkgcmV0dXJuO1xuICAgIGlmIChpc1BpbmNoZ3JhYk93blVpKGUpKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZHJhZ1N0YXJ0ID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcbiAgICBjb25zb2xlLmxvZyhMT0csICdkcmFnIGFybWVkIGF0JywgZHJhZ1N0YXJ0KTtcbiAgfTtcblxuICBjb25zdCBvbk1vdXNlVXAgPSAoZTogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghZHJhZ1N0YXJ0KSByZXR1cm47XG4gICAgY29uc3Qgc3RhcnQgPSBkcmFnU3RhcnQ7XG4gICAgY29uc3Qgd2FzRHJhZyA9IEJvb2xlYW4oZHJhZ1JlY3QpO1xuICAgIGRyYWdTdGFydCA9IG51bGw7XG4gICAgdGVhcmRvd25EcmFnUmVjdCgpO1xuICAgIGlmICghd2FzRHJhZykge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZHJhZyB0b28gc2hvcnQsIHRyZWF0ZWQgYXMgc2luZ2xlIGNsaWNrJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHN1cHByZXNzTmV4dENsaWNrID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgc3VwcHJlc3NOZXh0Q2xpY2sgPSBmYWxzZTsgfSwgMjAwKTtcbiAgICBjb25zdCBtb2RlOiAncGFydGlhbCcgfCAnZnVsbCcgPSBlLmNsaWVudFggPj0gc3RhcnQueCA/ICdmdWxsJyA6ICdwYXJ0aWFsJztcbiAgICAvLyBVc2UgdGhlIFNBTUUgY2FuZGlkYXRlIHBvb2wgdGhhdCB3YXMgbG9ja2VkIGF0IGRyYWcgc3RhcnQgc28gdGhlXG4gICAgLy8gY29tbWl0dGVkIHNldCBtYXRjaGVzIHdoYXQgdGhlIHVzZXIgc2F3IGhpZ2hsaWdodGVkIG1vbWVudHMgYmVmb3JlLlxuICAgIGNvbnN0IHBvb2xGb3JDb21taXQgPSBkcmFnQ2FuZGlkYXRlcy5sZW5ndGggPyBkcmFnQ2FuZGlkYXRlcyA6IHBpY2tEcmFnQ2FuZGlkYXRlcyhvdmVybGF5SG9zdCk7XG4gICAgY29uc3QgZWxzID0gZWxlbWVudHNJblJlY3QocG9vbEZvckNvbW1pdCwgc3RhcnQueCwgc3RhcnQueSwgZS5jbGllbnRYLCBlLmNsaWVudFksIG1vZGUpO1xuICAgIGNvbnNvbGUubG9nKExPRywgYGRyYWcgRU5EIOKAlCBtb2RlPSR7bW9kZX0g4oCUIFNUQUdJTkcgKE5PVCBjb21taXR0aW5nKWAsIGVscy5sZW5ndGgsICdlbGVtZW50czonLCBlbHMubWFwKGNvbXBhY3RUYXJnZXQpKTtcbiAgICAvLyBEcmFnIG1pcnJvcnMgQWx0K1NoaWZ0K0NsaWNrIOKAlCBldmVyeSBlbGVtZW50IHN0YWdlcyBpbnRvIHRoZSBwZW5kaW5nXG4gICAgLy8gYmF5LiBUaGUgdXNlciBNVVNUIGNsaWNrIFwiQ29tbWl0IGdyb3VwXCIgaW4gdGhlIHNpZGUgcGFuZWwgdG8gZmluYWxpemU7XG4gICAgLy8gdGhlcmUgaXMgbm8gYXV0by1jb21taXQgdGltZXIuXG4gICAgZm9yIChjb25zdCBlbCBvZiBlbHMpIHN0YWdlUGVuZGluZyhlbCk7XG4gIH07XG5cbiAgY29uc3Qgb25DbGljayA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghb3JwaGFuR3VhcmQoKSkgcmV0dXJuO1xuICAgIGlmIChzdXBwcmVzc05leHRDbGljaykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNJbnNpZGVBbm5vdGF0aW9uKGV2ZW50KSkgcmV0dXJuO1xuICAgIGlmICghZXZlbnQuYWx0S2V5KSByZXR1cm47XG4gICAgaWYgKGlzUGluY2hncmFiT3duVWkoZXZlbnQpKSByZXR1cm47XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCByYXcgPSBldmVudC50YXJnZXQ7XG4gICAgaWYgKCEocmF3IGluc3RhbmNlb2YgRWxlbWVudCkpIHJldHVybjtcbiAgICAvLyBTbmFwIGNsaWNrcyB0aGUgc2FtZSB3YXkgaG92ZXIgZG9lcyBzbyB0aGUgY2FwdHVyZWQgZWxlbWVudCBtYXRjaGVzXG4gICAgLy8gZXhhY3RseSB3aGF0IHRoZSBvcmFuZ2UgcmluZyB3YXMgYXJvdW5kIHdoZW4gdGhlIHVzZXIgY2xpY2tlZC5cbiAgICBjb25zdCBlbCA9IGhvdmVyU25hcCA/IHNuYXBUb0NvbXBvbmVudChyYXcsIGtub3duQ2FwdHVyZWQpIDogcmF3O1xuICAgIGlmIChpc0h1Z2VFbGVtZW50KGVsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2tpcHBpbmcgaHVnZSBjbGljayB0YXJnZXQ6JywgY29tcGFjdFRhcmdldChlbCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHN0YWdlUGVuZGluZyhlbCwge2NsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFl9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkoZWwsIG5leHRTZXEoKSwge1xuICAgICAgY2xpY2tBdDoge2NsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFl9LFxuICAgIH0pO1xuICAgIGZsYXNoRWxlbWVudChlbCk7XG4gICAgY29uc3QgcGFnZSA9IGJ1aWxkUGFnZUNvbnRleHQoKTtcbiAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZX0pO1xuICAgIHRlc3RDYXB0dXJlcz8ucHVzaCh7ZW50cnksIHBhZ2V9KTtcbiAgfTtcblxuICAvLyBCaW5kIG9uIGJvdGggd2luZG93IGFuZCBkb2N1bWVudC4gU29tZSBwYWdlcyBjYWxsIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblxuICAvLyBvbiB0aGVpciBvd24gZG9jdW1lbnQtbGV2ZWwgY2FwdHVyZSBoYW5kbGVyIOKAlCBsaXN0ZW5pbmcgb24gd2luZG93IHBpY2tzIHVwXG4gIC8vIHRob3NlIGV2ZW50cyBmaXJzdC4gQSAxbXMgdGltZXN0YW1wIGRlZHVwZSBwcmV2ZW50cyBkb3VibGUtaGFuZGxpbmcuXG4gIGZvciAoY29uc3QgdGFyZ2V0IG9mIFt3aW5kb3csIGRvY3VtZW50XSkge1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24gYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gIH1cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkgbGFzdENvbnRleHRFbCA9IGUudGFyZ2V0O1xuICB9LCB0cnVlKTtcblxuICAvLyBLZXlib2FyZCBsaXN0ZW5lcnMgKHBhZ2UtZm9jdXNlZCBjYXNlKS4gTmFtZWQgc28gZGVzdHJveSgpIGNhbiByZW1vdmVcbiAgLy8gdGhlbSDigJQgdGhlIG9ycGhhbi10YWtlb3ZlciBwYXRoIG11c3QgbGVhdmUgemVybyBsaXN0ZW5lcnMgYmVoaW5kLlxuICBjb25zdCBvbktleURvd25BbHQgPSAoZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghb3JwaGFuR3VhcmQoKSkgcmV0dXJuO1xuICAgIGlmIChlLmFsdEtleSkge1xuICAgICAgc2V0QWx0QWN0aXZlKHRydWUpO1xuICAgICAgLy8gUHJlLWVtcHQgdGhlIGJyb3dzZXIncyBBbHQg4oaSIG1lbnUtYmFyIGZvY3VzIHNoaWZ0IG9uIFdpbmRvd3MuIElmIHdlXG4gICAgICAvLyBkb24ndCBwcmV2ZW50RGVmYXVsdCBoZXJlLCB0aGUga2V5dXAgdGhhdCBmb2xsb3dzIHdpbGwgc3RlYWwgZm9jdXNcbiAgICAgIC8vIGZyb20gb3VyIG92ZXJsYXkgdGV4dGFyZWEuXG4gICAgICBpZiAoZS5rZXkgPT09ICdBbHQnICYmIGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uS2V5VXBBbHQgPSAoZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghb3JwaGFuR3VhcmQoKSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgIWUuYWx0S2V5KSB7XG4gICAgICAvLyBTYW1lIEFsdC3ihpItbWVudSBzdXBwcmVzc2lvbiBvbiByZWxlYXNlOiBDaHJvbWUgLyBFZGdlIG9uIFdpbmRvd3NcbiAgICAgIC8vIHNoaWZ0IGZvY3VzIHRvIHRoZSBtZW51IGJhciB3aGVuIEFsdCBpcyByZWxlYXNlZCB3aXRob3V0IGFub3RoZXJcbiAgICAgIC8vIGtleSBpbnRlcnZlbmluZy4gQmxvY2sgaXQgc28gb3VyIHRleHRhcmVhIGtlZXBzIGZvY3VzLlxuICAgICAgaWYgKGFubm90YXRpb25FbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBhbHRGb3J3YXJkZWQgPSBmYWxzZTtcbiAgICAgIHNldEFsdEFjdGl2ZShmYWxzZSk7XG4gICAgICAvLyBObyBhdXRvLWNvbW1pdCB0aW1lciDigJQgdGhlIHVzZXIgZXhwbGljaXRseSBjbGlja3MgXCJDb21taXQgZ3JvdXBcIlxuICAgICAgLy8gaW4gdGhlIHNpZGUtcGFuZWwgcGVuZGluZyBiYXkgKG9yIEVzYyB0byBjYW5jZWwpLlxuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25XaW5kb3dCbHVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGFsdEZvcndhcmRlZCA9IGZhbHNlO1xuICAgIHNldEFsdEFjdGl2ZShmYWxzZSk7XG4gICAgLy8gTm90ZTogZG9uJ3QgY2FuY2VsIHBlbmRpbmdNdWx0aSDigJQgY2xpY2tpbmcgdGhlIHNpZGUtcGFuZWwgY29tbWl0IGJ1dHRvblxuICAgIC8vIGJsdXJzIHRoZSBob3N0IHBhZ2UgYW5kIHdlJ2QgbG9zZSB0aGUgc3RhZ2luZyBzdGF0ZSByaWdodCBiZWZvcmUgY29tbWl0LlxuICB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bkFsdCwgdHJ1ZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXBBbHQsIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uV2luZG93Qmx1ciwgdHJ1ZSk7XG5cbiAgLy8g4pSA4pSA4pSAIFNpZGUtcGFuZWwgY29tbWFuZHMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNhZmVRdWVyeSA9IChzZWw6IHN0cmluZyB8IHVuZGVmaW5lZCk6IEVsZW1lbnQgfCBudWxsID0+IHtcbiAgICB0cnkgeyByZXR1cm4gc2VsID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpIDogbnVsbDsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ29tbWFuZCA9IChtc2c6IFBnRW52ZWxvcGU8UGFuZWxUb0NzPiwgcmVzcG9uZDogKHI6IGFueSkgPT4gdm9pZCk6IGJvb2xlYW4gPT4ge1xuICAgIHN3aXRjaCAobXNnLmtpbmQpIHtcbiAgICAgIGNhc2UgJ291dGxpbmUnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmIChlbCkgdHJhY2tFbGVtZW50KCdmcm9tLXBhbmVsJywgZWwsIHtsYWJlbDogY29tcGFjdFRhcmdldChlbCksIGdvbGQ6IG1zZy5nb2xkLCBkYXNoZWQ6IG1zZy5kYXNoZWR9KTtcbiAgICAgICAgZWxzZSByZW1vdmVSaW5nKCdmcm9tLXBhbmVsJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ291dGxpbmUtY2xlYXInOlxuICAgICAgICByZW1vdmVSaW5nKCdmcm9tLXBhbmVsJyk7XG4gICAgICAgIHJlbW92ZVJpbmcoJ211bHRpJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ291dGxpbmUtbXVsdGknOiB7XG4gICAgICAgIHJlbW92ZVJpbmcoJ211bHRpJyk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBzZWwgb2YgbXNnLnNlbGVjdG9ycykge1xuICAgICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KHNlbCk7XG4gICAgICAgICAgaWYgKGVsKSB0cmFja0VsZW1lbnQoYG11bHRpOiR7aSsrfWAsIGVsLCB7Z29sZDogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ291dGxpbmUtbXVsdGktY2xlYXInOiB7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBbLi4ucmluZ3Mua2V5cygpXSkgaWYgKGsuc3RhcnRzV2l0aCgnbXVsdGk6JykpIHJlbW92ZVJpbmcoayk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3Njcm9sbC10byc6IHtcbiAgICAgICAgY29uc3QgZWwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBlbC5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcicsIGlubGluZTogJ2NlbnRlcid9KTtcbiAgICAgICAgaWYgKG1zZy5zdGlja3kpIHRyYWNrRWxlbWVudCgnc3RpY2t5JywgZWwsIHtsYWJlbDogY29tcGFjdFRhcmdldChlbCksIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgZWxzZSBmbGFzaEVsZW1lbnQoZWwpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdsb2NhdGUtZmxhc2gnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghZWwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbG9jYXRlRmxhc2goZWwpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjYXNlICdzdGlja3ktY2xlYXInOlxuICAgICAgICByZW1vdmVSaW5nKCdzdGlja3knKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAndmFsaWRhdGUnOiB7XG4gICAgICAgIGNvbnN0IHZhbGlkOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHNlbCBvZiBtc2cuc2VsZWN0b3JzKSB7XG4gICAgICAgICAgdHJ5IHsgdmFsaWRbc2VsXSA9IEJvb2xlYW4oZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpKTsgfSBjYXRjaCB7IHZhbGlkW3NlbF0gPSBmYWxzZTsgfVxuICAgICAgICB9XG4gICAgICAgIHJlc3BvbmQoe3ZhbGlkfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY2FzZSAnbG9nLWVsZW1lbnQnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gc2FmZVF1ZXJ5KG1zZy5zZWxlY3Rvcik7XG4gICAgICAgIGlmICghZWwpIHsgcmVzcG9uZCh7b2s6IGZhbHNlfSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIHRyeSB7IGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1waW5jaGdyYWItaWQnLCBTdHJpbmcobXNnLm4gPz8gJycpKTsgfSBjYXRjaCB7IC8qIHNhbmRib3ggKi8gfVxuICAgICAgICBjb25zb2xlLmxvZygnJWNbUGluY2hHcmFiXSBlbGVtZW50OicsICdjb2xvcjojZmY1ZjAwO2ZvbnQtd2VpZ2h0OjcwMDsnLCBlbCxcbiAgICAgICAgICBgXFxuICDigKIgUmlnaHQtY2xpY2sg4oaSIFJldmVhbCBpbiBFbGVtZW50cyBwYW5lbFxcbiAg4oCiIE9yIGluIERldlRvb2xzIGNvbnNvbGU6ICQoJ1tkYXRhLXBpbmNoZ3JhYi1pZD1cIiR7bXNnLm4gPz8gJyd9XCJdJylgKTtcbiAgICAgICAgZWwuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInfSk7XG4gICAgICAgIGZsYXNoRWxlbWVudChlbCk7XG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlLCBzbmlwcGV0OiBgJCgnJHttc2cuc2VsZWN0b3J9JylgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY2FzZSAncmVjYXB0dXJlJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWVsKSB7IHJlc3BvbmQoe29rOiBmYWxzZSwgcmVhc29uOiAnbm90LWZvdW5kJ30pOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShlbCwgbXNnLm4gPz8gbmV4dFNlcSgpKTtcbiAgICAgICAgcmVzcG9uZCh7b2s6IHRydWUsIGVudHJ5LCBwYWdlOiBidWlsZFBhZ2VDb250ZXh0KCl9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdjYXB0dXJlLWFuY2VzdG9yJzoge1xuICAgICAgICAvLyBXYWxrIHVwIGBkZXB0aGAgYW5jZXN0b3IgbGV2ZWxzIGZyb20gdGhlIG9yaWdpbmFsIHNlbGVjdG9yIGFuZFxuICAgICAgICAvLyBjYXB0dXJlIHRoYXQgZWxlbWVudC4gVXNlZCBieSB0aGUgYW5jZXN0b3ItYnJlYWRjcnVtYiBjaGlwcyBpblxuICAgICAgICAvLyB0aGUgc2lkZS1wYW5lbCBidWJibGUgc28gdGhlIHVzZXIgY2FuIGVzY2FsYXRlIFwiSSBtZWFudCB0aGUgY2FyZCxcbiAgICAgICAgLy8gbm90IHRoZSBoMyBpbnNpZGUgaXRcIiB3aXRob3V0IHJlLWNsaWNraW5nIG9uIHRoZSBwYWdlLlxuICAgICAgICBsZXQgY3VyOiBFbGVtZW50IHwgbnVsbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWN1cikgeyByZXNwb25kKHtvazogZmFsc2UsIHJlYXNvbjogJ25vdC1mb3VuZCd9KTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc2cuZGVwdGggJiYgY3VyICYmIGN1ci5wYXJlbnRFbGVtZW50ICYmIGN1ciAhPT0gZG9jdW1lbnQuYm9keTsgaSsrKSB7XG4gICAgICAgICAgY3VyID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjdXIgfHwgaXNIdWdlRWxlbWVudChjdXIpKSB7IHJlc3BvbmQoe29rOiBmYWxzZSwgcmVhc29uOiAndG9vLWxhcmdlJ30pOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShjdXIsIG5leHRTZXEoKSk7XG4gICAgICAgIGZsYXNoRWxlbWVudChjdXIpO1xuICAgICAgICBzZW5kVG9QYW5lbCh7a2luZDogJ2NhcHR1cmUnLCBlbnRyeSwgcGFnZTogYnVpbGRQYWdlQ29udGV4dCgpfSk7XG4gICAgICAgIHJlc3BvbmQoe29rOiB0cnVlLCBlbnRyeX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ291dGxpbmUtYW5jZXN0b3InOiB7XG4gICAgICAgIC8vIFByZXZpZXcgdGhlIE50aCBhbmNlc3RvciDigJQgc2FtZSB3YWxrIGFzIGNhcHR1cmUtYW5jZXN0b3IgYnV0XG4gICAgICAgIC8vIG91dGxpbmVzIHRoZSByZXN1bHQgd2l0aCB0aGUgZXhpc3RpbmcgZ29sZC1yaW5nIHRyYWNrZXIgaW5zdGVhZFxuICAgICAgICAvLyBvZiBjYXB0dXJpbmcuIFNpZGUgcGFuZWwgY2FsbHMgdGhpcyBvbiBob3ZlciBvZiBhIGJyZWFkY3J1bWIgY2hpcC5cbiAgICAgICAgbGV0IGN1cjogRWxlbWVudCB8IG51bGwgPSBzYWZlUXVlcnkobXNnLnNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFjdXIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc2cuZGVwdGggJiYgY3VyICYmIGN1ci5wYXJlbnRFbGVtZW50ICYmIGN1ciAhPT0gZG9jdW1lbnQuYm9keTsgaSsrKSB7XG4gICAgICAgICAgY3VyID0gY3VyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjdXIgfHwgaXNIdWdlRWxlbWVudChjdXIpKSB7XG4gICAgICAgICAgcmVtb3ZlUmluZygnZnJvbS1wYW5lbCcpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0cmFja0VsZW1lbnQoJ2Zyb20tcGFuZWwnLCBjdXIsIHtsYWJlbDogY29tcGFjdFRhcmdldChjdXIpLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2FsdC1zdGF0ZSc6XG4gICAgICAgIGFsdEZvcndhcmRlZCA9IG1zZy5vbjtcbiAgICAgICAgc2V0QWx0QWN0aXZlKG1zZy5vbik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ21hbnVhbC1jYXB0dXJlJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoIWVsKSB7IHJlc3BvbmQoe29rOiBmYWxzZSwgcmVhc29uOiAnbm90LWZvdW5kJ30pOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBjb25zdCBlbnRyeSA9IGNhcHR1cmVFbnRyeShlbCwgbXNnLm4gPz8gbmV4dFNlcSgpKTtcbiAgICAgICAgZmxhc2hFbGVtZW50KGVsKTtcbiAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgICByZXNwb25kKHtvazogdHJ1ZSwgZW50cnl9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjYXNlICdhbm5vdGF0aW9uJzoge1xuICAgICAgICBjb25zdCBlbCA9IHNhZmVRdWVyeShtc2cuc2VsZWN0b3IpO1xuICAgICAgICBpZiAoZWwpIGFubm90YXRpb24uc2hvdyhlbCwgey4uLihtc2cucGF5bG9hZCA/PyB7fSksIHNlbGVjdG9yOiBtc2cuc2VsZWN0b3J9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSAnYW5ub3RhdGlvbi1jbGVhcic6XG4gICAgICAgIGFubm90YXRpb24uaGlkZSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdwZW5kaW5nLWNhbmNlbCc6XG4gICAgICAgIGNhbmNlbFBlbmRpbmdNdWx0aSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdwZW5kaW5nLWNvbW1pdCc6XG4gICAgICAgIGNvbW1pdFBlbmRpbmdNdWx0aSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdjb250ZXh0LWNhcHR1cmUnOiB7XG4gICAgICAgIGlmIChsYXN0Q29udGV4dEVsKSB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSBjYXB0dXJlRW50cnkobGFzdENvbnRleHRFbCwgbmV4dFNlcSgpKTtcbiAgICAgICAgICBmbGFzaEVsZW1lbnQobGFzdENvbnRleHRFbCk7XG4gICAgICAgICAgc2VuZFRvUGFuZWwoe2tpbmQ6ICdjYXB0dXJlJywgZW50cnksIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NldC1jYXB0dXJlZCc6XG4gICAgICAgIGtub3duQ2FwdHVyZWQgPSBuZXcgU2V0KG1zZy5zZWxlY3RvcnMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdzZXQtY3MtcHJlZnMnOlxuICAgICAgICBpZiAodHlwZW9mIG1zZy5zcGFjaW5nT3ZlcmxheSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgc3BhY2luZ092ZXJsYXkgPSBtc2cuc3BhY2luZ092ZXJsYXk7XG4gICAgICAgICAgaWYgKCFzcGFjaW5nT3ZlcmxheSkgY2xlYXJTcGFjaW5nT3ZlcmxheSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbXNnLmhvdmVyU25hcCA9PT0gJ2Jvb2xlYW4nKSBob3ZlclNuYXAgPSBtc2cuaG92ZXJTbmFwO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdoaWRlLW92ZXJsYXlzJzoge1xuICAgICAgICAvLyBUaGUgdXNlcidzIGNvbXBsYWludDogUGluY2hHcmFiIHJpbmdzL2JvcmRlcnMgd2VyZSBzdGlsbCB2aXNpYmxlXG4gICAgICAgIC8vIGluIHRoZSBjYXB0dXJlZCBQTkcuIFJvb3QgY2F1c2U6IHRoZSBtZXNzYWdlIGhhbmRsZXIgdXNlZCB0b1xuICAgICAgICAvLyBhY2sgc3luY2hyb25vdXNseSB0aGUgbW9tZW50IHdlIHNldCBgdmlzaWJpbGl0eTogaGlkZGVuYCwgYnV0XG4gICAgICAgIC8vIHRoZSBicm93c2VyJ3MgY29tcG9zaXRvciBoYWRuJ3QgeWV0IHBhaW50ZWQgdGhhdCBmcmFtZSwgc29cbiAgICAgICAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZWQgYWdhaW5zdCBhIHN0aWxsLWNvbXBvc2l0ZWQgb3ZlcmxheS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gRml4OiBzd2l0Y2ggdG8gYGRpc3BsYXk6IG5vbmVgIChyaXBzIGl0IG91dCBvZiBsYXlvdXQgZW50aXJlbHlcbiAgICAgICAgLy8g4oCUIHN0cm9uZ2VyIGd1YXJhbnRlZSB0aGFuIHZpc2liaWxpdHk6aGlkZGVuKSwgZm9yY2UgYSBsYXlvdXRcbiAgICAgICAgLy8gZmx1c2gsIGFuZCB3YWl0IGZvciBUV08gYW5pbWF0aW9uIGZyYW1lcyBiZWZvcmUgYWNraW5nLiBUd29cbiAgICAgICAgLy8gUkFGcyBpcyB0aGUgc3RhbmRhcmQgXCJuZXh0IHBhaW50IGhhcyBoYXBwZW5lZFwiIHNpZ25hbCBpblxuICAgICAgICAvLyBicm93c2Vycy5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gSXRlbSAxNyAoZmxhc2hpbmcpOiBhbHNvIEZSRUVaRSB0aGUgcmluZyByQUYgbG9vcHMgZm9yIHRoZSB3aG9sZVxuICAgICAgICAvLyBjYXB0dXJlIHdpbmRvdy4gVGhlIGJhY2tncm91bmQgaGlkZXMgb3ZlcmxheXMgQkVGT1JFIGl0IHNjcm9sbHNcbiAgICAgICAgLy8gdGhlIHBhZ2UgdG8gZnJhbWUgdGhlIGNhcHR1cmU7IGlmIHRoZSBsb29wcyBrZXB0IHJ1bm5pbmcgdGhleSdkXG4gICAgICAgIC8vIGNoYXNlIHRoZSBzY3JvbGwgb2Zmc2V0IChhIHZpc2libGUganVtcCkgYW5kIHJlcGFpbnQgYSBidXJzdCB3aGVuXG4gICAgICAgIC8vIHRoZSBob3N0IGlzIHNob3duIGFnYWluLiBGcm96ZW4gKyBkaXNwbGF5Om5vbmUgPSB0aGUgcmluZ3MgaG9sZFxuICAgICAgICAvLyB0aGVpciBsYXN0IGZyYW1lIGFuZCB0aGVyZSBpcyBub3RoaW5nIHRvIGZsaWNrZXIuIFRoZSBhbm5vdGF0aW9uXG4gICAgICAgIC8vIGJveCBmcmVlemVzIGltcGxpY2l0bHkgKGl0cyBhbmNob3Igd2F0Y2hkb2cgb25seSByZXBvc2l0aW9ucywgYW5kXG4gICAgICAgIC8vIHRoZSBob3N0IGlzIGhpZGRlbiksIHNvIG5vIGV4dHJhIGhhbmRsaW5nIGlzIG5lZWRlZCB0aGVyZS5cbiAgICAgICAgb3ZlcmxheUZyb3plbiA9IHRydWU7XG4gICAgICAgIGZyZWV6ZVJpbmdzKCk7XG4gICAgICAgIG92ZXJsYXlIb3N0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIC8vIEZvcmNlIGxheW91dCBmbHVzaCBzbyB0aGUgY2hhbmdlIHRha2VzIGVmZmVjdC5cbiAgICAgICAgdm9pZCBvdmVybGF5SG9zdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVzcG9uZCh7b2s6IHRydWV9KSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3Nob3ctb3ZlcmxheXMnOiB7XG4gICAgICAgIG92ZXJsYXlIb3N0LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgb3ZlcmxheUhvc3Quc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgLy8gUmUtZW50ZXIgdGhlIHRvcCBsYXllcjogdGhlIGNhcHR1cmUgd2luZG93IChvciB0aGUgcGFnZSkgbWF5IGhhdmVcbiAgICAgICAgLy8gZGlzbWlzc2VkIG91ciBwb3BvdmVyIHdoaWxlIHRoZSBob3N0IHdhcyBkaXNwbGF5Om5vbmUuXG4gICAgICAgIHByb21vdGVUb1RvcExheWVyKCk7XG4gICAgICAgIC8vIFRoYXc6IHJlLWFybSBldmVyeSByaW5nIGxvb3AgaW4gYSBzaW5nbGUgYmF0Y2ggc28gdGhleSBzbmFwIHRvIHRoZVxuICAgICAgICAvLyAobm93IHJlc3RvcmVkKSBzY3JvbGwgcG9zaXRpb24gb24gdGhlIFNBTUUgZnJhbWUg4oCUIG9uZSBjbGVhblxuICAgICAgICAvLyByZXBvc2l0aW9uIGluc3RlYWQgb2YgYSBzdGFnZ2VyZWQgcmVwYWludCBjYXNjYWRlLlxuICAgICAgICBvdmVybGF5RnJvemVuID0gZmFsc2U7XG4gICAgICAgIHRoYXdSaW5ncygpO1xuICAgICAgICByZXNwb25kKHtvazogdHJ1ZX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIElQQyBicmlkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGZ1bmN0aW9uIHNlbmRUb1BhbmVsKHBheWxvYWQ6IENzVG9QYW5lbCk6IHZvaWQge1xuICAgIGNvbnN0IG1zZyA9IHBnKHBheWxvYWQpO1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgdHJ5IHsgdm9pZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtc2cpLmNhdGNoPy4oKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7IH1cbiAgICAgIGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIHtkZXRhaWw6IG1zZ30pKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICAgIC8vIEl0ZW0gMTg6IHRoZSBmaXJzdCBjYXB0dXJlIG9uIGEgZ2l2ZW4gcGFnZSBVUkwgdHJpZ2dlcnMgYSBvbmUtdGltZVxuICAgIC8vIGZ1bGwtcGFnZSBzbmFwc2hvdCAoc2NyZWVuc2hvdCArIG1ldGFkYXRhKSByb3V0ZWQgdG8gdGhlIHBhbmVsLiBEZWR1cFxuICAgIC8vIGlzIGJ5IFVSTCBpbnNpZGUgbWF5YmVTbmFwc2hvdFBhZ2UuXG4gICAgaWYgKHBheWxvYWQua2luZCA9PT0gJ2NhcHR1cmUnKSB2b2lkIG1heWJlU25hcHNob3RQYWdlKHBheWxvYWQucGFnZS51cmwpO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFBhZ2Utc25hcHNob3QgKGl0ZW0gMTgpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBSb3VuZC10cmlwIHJlcXVlc3QgdG8gdGhlIGJhY2tncm91bmQgd29ya2VyICh3aGljaCBvd25zIGNhcHR1cmVWaXNpYmxlVGFiKS5cbiAgLy8gUmVzb2x2ZXMgdG8gdGhlIHJlcGx5IG9iamVjdCwgb3IgbnVsbCBvbiBhbnkgZmFpbHVyZSAvIG5vbi1leHRlbnNpb24gbW9kZS5cbiAgY29uc3QgcmVxdWVzdEJnID0gPFI+KHBheWxvYWQ6IHtraW5kOiBzdHJpbmd9ICYgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBQcm9taXNlPFIgfCBudWxsPiA9PlxuICAgIG5ldyBQcm9taXNlPFIgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgICAgaWYgKCFpbkV4dGVuc2lvbikgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHBnKHBheWxvYWQgYXMgYW55KSwgKHJlcGx5OiBSKSA9PiB7XG4gICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgICAgICByZXNvbHZlKChyZXBseSA/PyBudWxsKSBhcyBSIHwgbnVsbCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7IHJlc29sdmUobnVsbCk7IH1cbiAgICB9KTtcblxuICAvLyBEZWR1cCBzZXQ6IGF0IG1vc3Qgb25lIHBhZ2Utc25hcHNob3QgcGVyIGRpc3RpbmN0IFVSTCBwZXIgcGFnZSBzZXNzaW9uLlxuICBjb25zdCBzbmFwc2hvdHRlZFVybHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgbGV0IHNuYXBzaG90SW5GbGlnaHQgPSBmYWxzZTtcbiAgY29uc3QgbWF5YmVTbmFwc2hvdFBhZ2UgPSBhc3luYyAodXJsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm47ICAgICAgICAgICAgLy8gdmlld3BvcnQgY2FwdHVyZSBuZWVkcyB0aGUgd29ya2VyXG4gICAgaWYgKHNuYXBzaG90dGVkVXJscy5oYXModXJsKSkgcmV0dXJuO1xuICAgIGlmIChzbmFwc2hvdEluRmxpZ2h0KSByZXR1cm47ICAgICAgICAvLyBzZXJpYWxpemU7IHRoZSBuZXh0IGNhcHR1cmUgcmV0cmllc1xuICAgIHNuYXBzaG90dGVkVXJscy5hZGQodXJsKTsgICAgICAgICAgICAvLyBvcHRpbWlzdGljIOKAlCBhdm9pZHMgYSBkdXBsaWNhdGUgYnVyc3RcbiAgICBzbmFwc2hvdEluRmxpZ2h0ID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgLy8gTWV0YWRhdGEgaXMgcmVhZCBvbiB0aGUgcGFnZSBzaWRlICh0aGUgd29ya2VyIGNhbid0IHNlZSB0aGUgRE9NKS5cbiAgICAgIC8vIGNhcHR1cmVkQXQgaXMgc3RhbXBlZCBiZWZvcmUgdGhlIChzbG93ZXIpIHNjcmVlbnNob3QgcmVxdWVzdCBzbyBpdFxuICAgICAgLy8gcmVmbGVjdHMgd2hlbiB0aGUgc25hcHNob3Qgd2FzIGluaXRpYXRlZC5cbiAgICAgIGNvbnN0IGNhcHR1cmVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICBjb25zdCBtZXRhID0ge1xuICAgICAgICB1cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgdmlld3BvcnQ6IHt3aWR0aDogd2luZG93LmlubmVyV2lkdGgsIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0fSxcbiAgICAgICAgc2Nyb2xsV2lkdGg6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCwgZG9jdW1lbnQuYm9keT8uc2Nyb2xsV2lkdGggPz8gMCksXG4gICAgICAgIHNjcm9sbEhlaWdodDogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuYm9keT8uc2Nyb2xsSGVpZ2h0ID8/IDApLFxuICAgICAgICBkZXZpY2VQaXhlbFJhdGlvOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuICAgICAgICBsYW5nOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZyB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJycsXG4gICAgICB9O1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCByZXF1ZXN0Qmc8UGFnZVNuYXBzaG90UmVwbHk+KHtraW5kOiAncGFnZS1zbmFwc2hvdC1zaG90J30pO1xuICAgICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LnNjcmVlbnNob3QpIHtcbiAgICAgICAgLy8gQ2FwdHVyZSBmYWlsZWQg4oCUIGRyb3AgdGhlIGRlZHVwIGVudHJ5IHNvIGEgbGF0ZXIgY2FwdHVyZSBvbiB0aGlzXG4gICAgICAgIC8vIFVSTCBjYW4gcmV0cnkgcmF0aGVyIHRoYW4gcGVybWFuZW50bHkgc2tpcHBpbmcgdGhlIHNuYXBzaG90LlxuICAgICAgICBzbmFwc2hvdHRlZFVybHMuZGVsZXRlKHVybCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNuYXBzaG90OiBQYWdlU25hcHNob3QgPSB7XG4gICAgICAgIC4uLm1ldGEsXG4gICAgICAgIGNhcHR1cmVkQXQsXG4gICAgICAgIHNjcmVlbnNob3Q6IHJlcGx5LnNjcmVlbnNob3QsXG4gICAgICAgIC4uLihyZXBseS5wYXJ0aWFsID8ge3BhcnRpYWw6IHRydWV9IDoge30pLFxuICAgICAgfTtcbiAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncGFnZS1zbmFwc2hvdCcsIHBheWxvYWQ6IHNuYXBzaG90fSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzbmFwc2hvdHRlZFVybHMuZGVsZXRlKHVybCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNuYXBzaG90SW5GbGlnaHQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2c6IGFueSwgX3NlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobXNnICYmIG1zZy5fX3BnID09PSB0cnVlKSByZXR1cm4gaGFuZGxlQ29tbWFuZChtc2cgYXMgUGdFbnZlbG9wZTxQYW5lbFRvQ3M+LCBzZW5kUmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6dG8tY3MnLCAoZTogRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG1zZyA9IChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWw7XG4gICAgICBjb25zdCByZXFJZCA9IG1zZz8uX19yZXFJZDtcbiAgICAgIGxldCByZXNwb25kZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHJlc3BvbmQgPSAocmVwbHk6IHVua25vd24pOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbmRlZCkgcmV0dXJuO1xuICAgICAgICByZXNwb25kZWQgPSB0cnVlO1xuICAgICAgICBpZiAocmVxSWQpIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOmNzLXJlc3BvbnNlJywge2RldGFpbDoge19fcmVxSWQ6IHJlcUlkLCByZXBseX19KSk7XG4gICAgICB9O1xuICAgICAgaGFuZGxlQ29tbWFuZChtc2csIHJlc3BvbmQpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFJlY2VudC1UYWIgdHJhY2tlciAoZm9yIGFjdGl2ZUZvY3VzLnJlY2VudGx5VGFiYmVkKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gVGhlIHBhZ2UtY29udGV4dCBhY3RpdmVGb2N1cyBmaWVsZCBmbGFncyBmb2N1cyBhcyBcImtleWJvYXJkLWRyaXZlblwiXG4gIC8vIHdoZW4gdGhlIHVzZXIgcHJlc3NlZCBUYWIgLyBTaGlmdCtUYWIgaW4gdGhlIGxhc3Qgc2Vjb25kLiBVc2VmdWwgZm9yXG4gIC8vIGExMXkgYnVnIGNhcHR1cmVzIHdoZXJlIHRoZSB2aXN1YWwgaXNzdWUgb25seSBzaG93cyB1cCB3aGlsZVxuICAvLyB0YWJiaW5nLCBub3Qgb24gY2xpY2suIFdlIGNhcHR1cmUgaW4gdGhlIGNhcHR1cmUgcGhhc2Ugc28gYSBwYWdlJ3NcbiAgLy8gb3duIGtleWRvd24gaGFuZGxlciBjYW4ndCBzdXBwcmVzcyB1cy5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnVGFiJykgbm90ZVRhYlByZXNzZWQoKTtcbiAgfSwgdHJ1ZSk7XG5cbiAgLy8g4pSA4pSA4pSAIFByZWZlcmVuY2UtY2hhbmdlIGxpc3RlbmVyIChkYXJrLW1vZGUgdG9nZ2xlLCBtb3Rpb24gcHJlZikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJyb3dzZXJzIGVtaXQgYGNoYW5nZWAgZXZlbnRzIG9uIGEgTWVkaWFRdWVyeUxpc3Qgd2hlbiB0aGUgT1MgLyBwYWdlXG4gIC8vIHNldHRpbmcgZmxpcHMuIFdlIGZvcndhcmQgdG8gdGhlIHBhbmVsIHNvIHRoZSBleHBvcnQncyBjaHJvbm9sb2d5XG4gIC8vIGNhcHR1cmVzIHRoZSBtb21lbnQgdGhlIHVzZXIgc3dpdGNoZWQgbW9kZXMg4oCUIHdpdGhvdXQgaXQsIGNhcHR1cmVzXG4gIC8vIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGZsaXAgbWl4IGFwcGVhcmFuY2UgdmFsdWVzIHdpdGggbm8gc2lnbmFsIGFzIHRvXG4gIC8vIHdoaWNoIG1vZGUgd2FzIGFjdGl2ZS5cbiAgY29uc3Qgd2lyZVByZWZlcmVuY2VMaXN0ZW5lcnMgPSAoKTogdm9pZCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNzID0gbWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpO1xuICAgICAgY29uc3QgbW90aW9uID0gbWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKTtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gKHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nKTogdm9pZCA9PiB7XG4gICAgICAgIHNlbmRUb1BhbmVsKHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnLCByZWFzb24sIHBhZ2U6IGJ1aWxkUGFnZUNvbnRleHQoKX0pO1xuICAgICAgfTtcbiAgICAgIGNzLmFkZEV2ZW50TGlzdGVuZXI/LignY2hhbmdlJywgKCkgPT4gb25DaGFuZ2UoJ2NvbG9yLXNjaGVtZScpKTtcbiAgICAgIG1vdGlvbi5hZGRFdmVudExpc3RlbmVyPy4oJ2NoYW5nZScsICgpID0+IG9uQ2hhbmdlKCdyZWR1Y2VkLW1vdGlvbicpKTtcbiAgICB9IGNhdGNoIHsgLyogb2xkIGJyb3dzZXIgLyBtYXRjaE1lZGlhIHVuYXZhaWxhYmxlICovIH1cbiAgfTtcbiAgd2lyZVByZWZlcmVuY2VMaXN0ZW5lcnMoKTtcblxuICAvLyDilIDilIDilIAgRE9NLW11dGF0aW9uIHJpbmcgYnVmZmVyIGZvciBjYXB0dXJlIHJlcHJvIGNvbnRleHQgKMKnNC44KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUGFnZXMgd2l0aCBhY3RpdmUgYW5pbWF0aW9uL3BvbGxpbmcgY2FuIGNodXJuIHRocm91Z2ggaHVuZHJlZHMgb2ZcbiAgLy8gbXV0YXRpb25zIHBlciBzZWNvbmQ7IHdlIGNhcCBtZW1vcnkgYXQgTVVUQVRJT05fQlVGRkVSX0NBUCByZWNvcmRzXG4gIC8vIGFuZCBvbmx5IHJldHVybiBtdXRhdGlvbnMgd2l0aGluIHRoZSBsYXN0IE1VVEFUSU9OX1dJTkRPV19NUyB0b1xuICAvLyBjYXB0dXJlRW50cnkuIGNvbXBhY3RUYXJnZXQgaXMgY2hlYXBlciB0aGFuIGNzc1BhdGgsIHVzZWQgaGVyZSB0b1xuICAvLyBhdm9pZCBxdWFkcmF0aWMgY29zdCBvbiBsYXJnZSBET01zLlxuICBjb25zdCBNVVRBVElPTl9CVUZGRVJfQ0FQID0gNTA7XG4gIGNvbnN0IE1VVEFUSU9OX1dJTkRPV19NUyA9IDhfMDAwO1xuICBjb25zdCBTRUNSRVRfQVRUUl9OQU1FX1JFID0gLyhwYXNzd29yZHx0b2tlbnxzZWNyZXR8YXBpW18tXT9rZXl8Y3NyZnx4c3JmfHNlc3Npb258bm9uY2UpL2k7XG4gIGNvbnN0IG11dGF0aW9uQnVmZmVyOiBEb21NdXRhdGlvbltdID0gW107XG4gIGNvbnN0IHRydW5jYXRlID0gKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIG1heCA9IDEyMCk6IHN0cmluZyA9PlxuICAgIFN0cmluZyhzID8/ICcnKS5zbGljZSgwLCBtYXgpO1xuXG4gIGNvbnN0IG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigocmVjb3JkcykgPT4ge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBmb3IgKGNvbnN0IHIgb2YgcmVjb3Jkcykge1xuICAgICAgLy8gU2tpcCBtdXRhdGlvbnMgaW5zaWRlIG91ciBvd24gb3ZlcmxheSDigJQgZXZlcnkgcmluZyByZXBhaW50IGlzIGFcbiAgICAgIC8vIG11dGF0aW9uIGFuZCB3ZSdkIGZsb29kIHRoZSBidWZmZXIgd2l0aCBzZWxmLW5vaXNlLlxuICAgICAgY29uc3QgdE5vZGUgPSByLnRhcmdldDtcbiAgICAgIGlmICh0Tm9kZSBpbnN0YW5jZW9mIE5vZGUgJiYgKG92ZXJsYXlIb3N0ID09PSB0Tm9kZSB8fCBvdmVybGF5SG9zdC5jb250YWlucyh0Tm9kZSkpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHRFbDogRWxlbWVudCB8IG51bGwgPSB0Tm9kZSBpbnN0YW5jZW9mIEVsZW1lbnRcbiAgICAgICAgPyB0Tm9kZVxuICAgICAgICA6ICh0Tm9kZS5wYXJlbnRFbGVtZW50ID8/IG51bGwpO1xuICAgICAgY29uc3QgdGFyZ2V0RGVzYyA9IHRFbCA/IGNvbXBhY3RUYXJnZXQodEVsKSA6IHROb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBsZXQgZW50cnk6IERvbU11dGF0aW9uO1xuICAgICAgaWYgKHIudHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgY29uc3QgYWRkZWQgPSByLmFkZGVkTm9kZXMubGVuZ3RoO1xuICAgICAgICBjb25zdCByZW1vdmVkID0gci5yZW1vdmVkTm9kZXMubGVuZ3RoO1xuICAgICAgICBsZXQgc3VtbWFyeSA9IGAke3RhcmdldERlc2N9OmA7XG4gICAgICAgIGlmIChhZGRlZCA+IDApIHtcbiAgICAgICAgICBjb25zdCBmaXJzdCA9IHIuYWRkZWROb2Rlc1swXTtcbiAgICAgICAgICBzdW1tYXJ5ICs9IGAgKyR7YWRkZWR9ICR7Zmlyc3QgaW5zdGFuY2VvZiBFbGVtZW50ID8gY29tcGFjdFRhcmdldChmaXJzdCkgOiAndGV4dCd9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVtb3ZlZCA+IDApIHtcbiAgICAgICAgICBjb25zdCBmaXJzdCA9IHIucmVtb3ZlZE5vZGVzWzBdO1xuICAgICAgICAgIHN1bW1hcnkgKz0gYCAtJHtyZW1vdmVkfSAke2ZpcnN0IGluc3RhbmNlb2YgRWxlbWVudCA/IGNvbXBhY3RUYXJnZXQoZmlyc3QpIDogJ3RleHQnfWA7XG4gICAgICAgIH1cbiAgICAgICAgZW50cnkgPSB7dHlwZTogJ2NoaWxkTGlzdCcsIHRzOiBub3csIHRhcmdldDogdGFyZ2V0RGVzYywgYWRkZWQsIHJlbW92ZWQsIHN1bW1hcnk6IHRydW5jYXRlKHN1bW1hcnksIDIwMCl9O1xuICAgICAgfSBlbHNlIGlmIChyLnR5cGUgPT09ICdhdHRyaWJ1dGVzJykge1xuICAgICAgICBjb25zdCBuYW1lID0gci5hdHRyaWJ1dGVOYW1lID8/ICcnO1xuICAgICAgICBjb25zdCBpc1NlY3JldCA9IFNFQ1JFVF9BVFRSX05BTUVfUkUudGVzdChuYW1lKTtcbiAgICAgICAgY29uc3QgbmV3VmFsUmF3ID0gKHRFbCA/IHRFbC5nZXRBdHRyaWJ1dGUobmFtZSkgOiBudWxsKSA/PyAnJztcbiAgICAgICAgY29uc3Qgb2xkVmFsUmF3ID0gci5vbGRWYWx1ZSA/PyBudWxsO1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IGlzU2VjcmV0ID8gJ1tyZWRhY3RlZF0nIDogKG9sZFZhbFJhdyA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IHRydW5jYXRlKG9sZFZhbFJhdykpO1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGlzU2VjcmV0ID8gJ1tyZWRhY3RlZF0nIDogdHJ1bmNhdGUobmV3VmFsUmF3KTtcbiAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgdHlwZTogJ2F0dHJpYnV0ZXMnLCB0czogbm93LCB0YXJnZXQ6IHRhcmdldERlc2MsIGF0dHJpYnV0ZU5hbWU6IG5hbWUsXG4gICAgICAgICAgb2xkVmFsdWUsIG5ld1ZhbHVlLFxuICAgICAgICAgIHN1bW1hcnk6IHRydW5jYXRlKGAke3RhcmdldERlc2N9WyR7bmFtZX1dOiAke29sZFZhbHVlID8/ICfiiIUnfSDihpIgJHtuZXdWYWx1ZX1gLCAyMDApLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2hhcmFjdGVyRGF0YVxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHIub2xkVmFsdWUgPz8gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHROb2RlLm5vZGVWYWx1ZSA/PyAnJztcbiAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgdHlwZTogJ2NoYXJhY3RlckRhdGEnLCB0czogbm93LCB0YXJnZXQ6IHRhcmdldERlc2MsXG4gICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlICE9PSB1bmRlZmluZWQgPyB0cnVuY2F0ZShvbGRWYWx1ZSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbmV3VmFsdWU6IHRydW5jYXRlKG5ld1ZhbHVlKSxcbiAgICAgICAgICBzdW1tYXJ5OiB0cnVuY2F0ZShgJHt0YXJnZXREZXNjfSB0ZXh0OiAke3RydW5jYXRlKG9sZFZhbHVlLCAzMCl9IOKGkiAke3RydW5jYXRlKG5ld1ZhbHVlLCAzMCl9YCwgMjAwKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIG11dGF0aW9uQnVmZmVyLnB1c2goZW50cnkpO1xuICAgICAgaWYgKG11dGF0aW9uQnVmZmVyLmxlbmd0aCA+IE1VVEFUSU9OX0JVRkZFUl9DQVApIG11dGF0aW9uQnVmZmVyLnNoaWZ0KCk7XG4gICAgfVxuICB9KTtcbiAgdHJ5IHtcbiAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XG4gICAgICBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLCBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsIGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogdHJ1ZSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkgeyBjb25zb2xlLndhcm4oTE9HLCAnTXV0YXRpb25PYnNlcnZlci5vYnNlcnZlIGZhaWxlZCcsIGUpOyB9XG5cbiAgLy8gSGFuZCBjYXB0dXJlRW50cnkgYSBnZXR0ZXIgc28gaXQgY2FuIHJlYWQgdGhlIGJ1ZmZlciB3aXRob3V0XG4gIC8vIGltcG9ydGluZyBjb250ZW50LXNjcmlwdC1vbmx5IHN0YXRlLlxuICBzZXRNdXRhdGlvbkJ1ZmZlckdldHRlcigoKSA9PiB7XG4gICAgY29uc3QgY3V0b2ZmID0gRGF0ZS5ub3coKSAtIE1VVEFUSU9OX1dJTkRPV19NUztcbiAgICByZXR1cm4gbXV0YXRpb25CdWZmZXIuZmlsdGVyKChtKSA9PiBEYXRlLnBhcnNlKG0udHMpID49IGN1dG9mZik7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBUZXN0L3N0YW5kYWxvbmUgQVBJIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcGk6IFBpbmNoZ3JhYkFwaSA9IHtcbiAgICBjYXB0dXJlRW50cnksXG4gICAgYnVpbGRQYWdlQ29udGV4dCxcbiAgICBjYXB0dXJlczogdGVzdENhcHR1cmVzLFxuICAgIGZsYXNoRWxlbWVudDogKHNlbDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcbiAgICAgIGlmIChlbCkgZmxhc2hFbGVtZW50KGVsKTtcbiAgICB9LFxuICAgIHNldEFsdDogKG9uOiBib29sZWFuKSA9PiB7IHNldEFsdEFjdGl2ZShvbik7IH0sXG4gICAgbmV4dFNlcSxcbiAgICBoYW5kbGVDb21tYW5kLFxuICAgIGRlc3Ryb3k6ICgpID0+IHtcbiAgICAgIGRlc3Ryb3llZCA9IHRydWU7XG4gICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBbd2luZG93LCBkb2N1bWVudF0pIHtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24gYXMgRXZlbnRMaXN0ZW5lciwgdHJ1ZSk7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgfVxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrIGFzIEV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd25BbHQsIHRydWUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25LZXlVcEFsdCwgdHJ1ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uV2luZG93Qmx1ciwgdHJ1ZSk7XG4gICAgICBjbGVhclJpbmdzKCk7XG4gICAgICB0cnkgeyBpZiAob3ZlcmxheUhvc3QubWF0Y2hlcygnOnBvcG92ZXItb3BlbicpKSBvdmVybGF5SG9zdC5oaWRlUG9wb3ZlcigpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIG92ZXJsYXlIb3N0LnJlbW92ZSgpO1xuICAgICAgZGVsZXRlIHdpbmRvd1tLRVldO1xuICAgIH0sXG4gIH07XG4gIHdpbmRvd1tLRVldID0gYXBpO1xuICB3aW5kb3cuX19waW5jaGdyYWIgPSBhcGk7XG4gIC8vIFN1Y2Nlc3NvciB0YWtlb3Zlcjogd2hlbiBhIGZyZXNoIGNvcHkgb2YgdGhpcyBzY3JpcHQgaW5qZWN0cyAoZXh0ZW5zaW9uXG4gIC8vIHJlbG9hZCksIGl0IGZpcmVzIHRoaXMgZXZlbnQgZnJvbSBpdHMgb3duIGlzb2xhdGVkIHdvcmxkIOKAlCB0ZWFyIGRvd24gc29cbiAgLy8gZXhhY3RseSBvbmUgbGl2ZSBjb3B5IG93bnMgdGhlIHBhZ2UuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ19fcGluY2hncmFiLXRha2VvdmVyJywgKCkgPT4ge1xuICAgIHRyeSB7IGFwaS5kZXN0cm95KCk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICB9LCB7b25jZTogdHJ1ZX0pO1xuICBjb25zb2xlLmxvZyhMT0csICdyZWFkeScsIHtpbkV4dGVuc2lvbn0pO1xufVxuXG4vLyDilIDilIDilIAgQW5ub3RhdGlvbiBvdmVybGF5IChzdGlja3kgY29tbWVudCBib3gpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxudHlwZSBBbm5vdGF0aW9uRGVwcyA9IHtcbiAgc2VuZFRvUGFuZWw6IChtOiBDc1RvUGFuZWwpID0+IHZvaWQ7XG4gIGNhcHR1cmVBbmRDb21tZW50OiAoZWw6IEVsZW1lbnQsIHRleHQ6IHN0cmluZykgPT4gRW50cnk7XG4gIC8vIENhbGxlZCB3aGVuIHRoZSBib3ggaGlkZXMg4oCUIHVzZWQgdG8gdGVhciBkb3duIHRoZSBtYXRjaGluZyBob3ZlciByaW5nXG4gIC8vIHNvIHJpbmcgKyBib3ggc3RheSBjb3VwbGVkLlxuICBvbkhpZGU6ICgpID0+IHZvaWQ7XG4gIC8vIENhbGxlZCB3aGVuIHRoZSBib3ggYXBwZWFycyBvciBtb3ZlcyB0byBhIG5ldyBlbGVtZW50IOKAlCB1c2VkIHRvXG4gIC8vIChyZS0pcGFpbnQgdGhlIGhvdmVyIHJpbmcgb24gdGhhdCBlbGVtZW50LiBDb3ZlcnMgdGhlIHJhY2Ugd2hlcmUgYWx0XG4gIC8vIHdhcyByZWxlYXNlZCBiZWZvcmUgdGhlIGFubm90YXRpb24gbWVzc2FnZSByb3VuZC10cmlwcGVkIGJhY2suXG4gIG9uU2hvdzogKGVsOiBFbGVtZW50KSA9PiB2b2lkO1xufTtcbnR5cGUgQW5ub3RhdGlvbkFwaSA9IHtcbiAgc2hvdzogKGVsOiBFbGVtZW50LCBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGwpID0+IHZvaWQ7XG4gIGhpZGU6ICgpID0+IHZvaWQ7XG4gIGlzTG9ja2VkOiAoKSA9PiBib29sZWFuO1xuICBmb2N1c1RleHRhcmVhOiAoKSA9PiB2b2lkO1xuICAvLyByQUYgd2F0Y2hkb2cgdGhhdCBrZWVwcyB0aGUgYm94IHBpbm5lZCB0byBpdHMgYW5jaG9yIGFuZCB0ZWFycyBpdCBkb3duXG4gIC8vIHdoZW4gdGhlIGFuY2hvciBsZWF2ZXMgdGhlIERPTS4gSW50ZXJuYWwgbGlmZWN5Y2xlIGhvb2tzOyB0aGUgcHVibGljXG4gIC8vIHN1cmZhY2UgKHNob3cvaGlkZSkgZHJpdmVzIHRoZW0sIGJ1dCB0aGV5J3JlIGV4cG9zZWQgZm9yIHRoZSBkZXN0cm95KClcbiAgLy8gdGVhcmRvd24gcGF0aC5cbiAgc3RhcnRXYXRjaGRvZzogKCkgPT4gdm9pZDtcbiAgc3RvcFdhdGNoZG9nOiAoKSA9PiB2b2lkO1xufTtcblxuZnVuY3Rpb24gc2V0dXBBbm5vdGF0aW9uKGVsOiBIVE1MRGl2RWxlbWVudCwge3NlbmRUb1BhbmVsLCBjYXB0dXJlQW5kQ29tbWVudCwgb25IaWRlLCBvblNob3d9OiBBbm5vdGF0aW9uRGVwcyk6IEFubm90YXRpb25BcGkge1xuICBsZXQgc2VsZWN0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAvLyBBY3RpdmUgY2FwdHVyZSdzIHN0YWJsZSB1aWQgKHdoZW4gcGF5bG9hZC5jYXB0dXJlZCArIHVpZCkuIFVzZWQgYnlcbiAgLy8gc3VibWl0KCkgc28gdGhlIGNvbW1lbnQgcm91dGVzIHRvIHRoZSBTUEVDSUZJQyBjYXB0dXJlIHJhdGhlciB0aGFuXG4gIC8vIHRvIGFueSBzZWxlY3RvciBtYXRjaCDigJQgcHJldmVudHMgY3Jvc3MtcGFnZSAvIGNyb3NzLXNpYmxpbmdcbiAgLy8gY29udGFtaW5hdGlvbi5cbiAgbGV0IGFjdGl2ZVVpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsb2NrZWRUbzogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBsZXQgbG9ja2VkID0gZmFsc2U7XG4gIGxldCB0ZXh0YXJlYTogSFRNTFRleHRBcmVhRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBsZXQgZmVlZGJhY2tMaXN0OiBIVE1MVUxpc3RFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gQnVpbGRlcnMgd2l0aCBpbmxpbmUgc3R5bGVzIChDU1Atc2FmZTsgbm8gaW5saW5lIDxzdHlsZT4gb3IgY2xhc3MgQ1NTKS5cbiAgY29uc3Qgc3R5bGVkID0gPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4odGFnOiBzdHJpbmcsIHN0eWxlczogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPik6IFQgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZykgYXMgVDtcbiAgICBPYmplY3QuYXNzaWduKG5vZGUuc3R5bGUsIHN0eWxlcyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRCb2R5ID0gKHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkKTogdm9pZCA9PiB7XG4gICAgZWwucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgY29uc3QgY2FwdHVyZWQgPSBCb29sZWFuKHBheWxvYWQuY2FwdHVyZWQpO1xuICAgIC8vIEhlYWRlciDigJQgb25seSB3aGVuIGNhcHR1cmVkLiBKdXN0IGEgdGlueSBvcmFuZ2UgYCNOYCBjaGlwOyBub1xuICAgIC8vIFwiUGluY2hHcmFiXCIgb3IgXCJDYXB0dXJlICsgY29tbWVudFwiIGxhYmVscy5cbiAgICBpZiAoY2FwdHVyZWQpIHtcbiAgICAgIGNvbnN0IGhlYWRlciA9IHN0eWxlZDxIVE1MRGl2RWxlbWVudD4oJ2RpdicsIHtcbiAgICAgICAgY29sb3I6ICcjZmY1ZjAwJywgZm9udFdlaWdodDogJzcwMCcsXG4gICAgICAgIGZvbnQ6IFwiNzAwIDEzcHgvMSAnQnJpY29sYWdlIEdyb3Rlc3F1ZScsJ091dGZpdCcsdWktbW9ub3NwYWNlLG1vbm9zcGFjZVwiLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc0cHgnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wMmVtJyxcbiAgICAgIH0pO1xuICAgICAgaGVhZGVyLnRleHRDb250ZW50ID0gYCMke3BheWxvYWQubiA/PyAnPyd9YDtcbiAgICAgIGVsLmFwcGVuZChoZWFkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSBzdHlsZWQ8SFRNTFVMaXN0RWxlbWVudD4oJ3VsJywge1xuICAgICAgbWFyZ2luOiAnMCAwIDZweCAwJywgcGFkZGluZzogJzAgMCAwIDE2cHgnLCBsaXN0U3R5bGU6ICdkaXNjJyxcbiAgICB9KTtcbiAgICBmZWVkYmFja0xpc3QgPSBsaXN0O1xuICAgIGlmIChwYXlsb2FkLmZlZWRiYWNrPy5sZW5ndGgpIHtcbiAgICAgIC8vIEF0dGFjaCB0aGUgbGlzdCBCRUZPUkUgYXBwZW5kaW5nIGl0ZW1zOiBhcHBlbmRGZWVkYmFjaydzIGxhenlcbiAgICAgIC8vIGluc2VydEJlZm9yZShsaXN0LCBhZGRSb3cpIG90aGVyd2lzZSBkZXJlZmVyZW5jZXMgYGFkZFJvd2Agd2hpbGUgdGhlXG4gICAgICAvLyBjb25zdCBpcyBzdGlsbCBpbiBpdHMgdGVtcG9yYWwgZGVhZCB6b25lIChkZWNsYXJlZCBiZWxvdyksIHRocm93aW5nXG4gICAgICAvLyBSZWZlcmVuY2VFcnJvciBhbmQga2lsbGluZyB0aGUgYm94IGZvciBhbnkgY2FwdHVyZSB0aGF0IGFscmVhZHkgaGFzXG4gICAgICAvLyBjb21tZW50cy4gV2l0aCBhIHBhcmVudCBzZXQsIHRoYXQgYnJhbmNoIG5ldmVyIHJ1bnMgZHVyaW5nIGJ1aWxkLlxuICAgICAgZWwuYXBwZW5kKGxpc3QpO1xuICAgICAgZm9yIChjb25zdCB0IG9mIHBheWxvYWQuZmVlZGJhY2spIGFwcGVuZEZlZWRiYWNrKHQpO1xuICAgIH1cbiAgICAvLyAoTm8gXCJObyBjb21tZW50cyB5ZXQuXCIgZmlsbGVyIOKAlCBlbXB0eSBsaXN0ID0gbm8gbGlzdCBzaG93bi4pXG5cbiAgICBjb25zdCBhZGRSb3cgPSBzdHlsZWQ8SFRNTERpdkVsZW1lbnQ+KCdkaXYnLCB7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzZweCcsIGFsaWduSXRlbXM6ICdzdHJldGNoJyxcbiAgICAgIG1hcmdpblRvcDogJzRweCcsIHBhZGRpbmdUb3A6ICc2cHgnLFxuICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDk1LDAsLjIpJyxcbiAgICB9KTtcbiAgICBjb25zdCB0YSA9IHN0eWxlZDxIVE1MVGV4dEFyZWFFbGVtZW50PigndGV4dGFyZWEnLCB7XG4gICAgICBmbGV4OiAnMScsIG1pbkhlaWdodDogJzI4cHgnLCBtYXhIZWlnaHQ6ICcxMjBweCcsXG4gICAgICByZXNpemU6ICdub25lJyxcbiAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDAsMCwwLC4zNSknLCBjb2xvcjogJyNmY2ZhZjUnLFxuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDk1LDAsLjMpJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICBwYWRkaW5nOiAnNHB4IDZweCcsXG4gICAgICBmb250OiBcIjEycHgvMS40IHVpLW1vbm9zcGFjZSwnSmV0QnJhaW5zIE1vbm8nLE1lbmxvLG1vbm9zcGFjZVwiLFxuICAgICAgb3V0bGluZTogJzAnLFxuICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgfSk7XG4gICAgdGEucGxhY2Vob2xkZXIgPSBjYXB0dXJlZCA/ICdDb21tZW504oCmJyA6ICdDb21tZW50IHRvIGNhcHR1cmXigKYnO1xuICAgIHRhLnJvd3MgPSAyO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4geyB0YS5zdHlsZS5ib3JkZXJDb2xvciA9ICcjZmY1ZjAwJzsgfSk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHsgdGEuc3R5bGUuYm9yZGVyQ29sb3IgPSAncmdiYSgyNTUsOTUsMCwuMyknOyB9KTtcbiAgICB0ZXh0YXJlYSA9IHRhO1xuICAgIC8vIFNlbmQgYnV0dG9uIOKAlCBtdXN0IE1BVENIIHRoZSBzaWRlIHBhbmVsJ3MgbWFpbiBjb21wb3NlciBTZW5kIGJ1dHRvblxuICAgIC8vIChzcmMvc2lkZXBhbmVsLmh0bWwgYC5jb21wb3NlciAuc2VuZGAgKyBzcmMvc2lkZXBhbmVsLmNzcykuIFRoYXQgYnV0dG9uXG4gICAgLy8gaXMgdGhlIGBtZXNzYWdlLXNxdWFyZS1wbHVzYCBsdWNpZGUgaWNvbiArIGEgc2hvcnQgdGV4dCBsYWJlbCBvbiB0aGVcbiAgICAvLyBvcmFuZ2XihpJvcmFuZ2UtMiBwcmltYXJ5IGdyYWRpZW50LiBXZSByZWJ1aWxkIGl0IGhlcmUgd2l0aCBpbmxpbmUgc3R5bGVzXG4gICAgLy8gKENTUC1zYWZlOyBubyBzaGFyZWQgc3R5bGVzaGVldCBhY3Jvc3MgdGhlIHR3byBkb2N1bWVudHMpIHNvIGl0IHJlYWRzIGFzXG4gICAgLy8gdGhlIHNhbWUgY29udHJvbCBldmVuIHRob3VnaCBpdCBsaXZlcyBpbiB0aGUgcGFnZSdzIHNoYWRvdyByb290LlxuICAgIGNvbnN0IHNlbmRCdG4gPSBzdHlsZWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdidXR0b24nLCB7XG4gICAgICBmbGV4OiAnMCAwIGF1dG8nLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgIGdhcDogJzRweCcsXG4gICAgICBwYWRkaW5nOiAnMCAxMHB4JyxcbiAgICAgIC8vIE1hdGNoIHRoZSB0ZXh0YXJlYSBtaW4taGVpZ2h0IHNvIHRoZSBidXR0b24gZG9lc24ndCBkcmFnIHdoZW4gdGhlXG4gICAgICAvLyB0ZXh0YXJlYSBncm93cyAobWlycm9ycyBgLmNvbXBvc2VyIC5zZW5kIHsgaGVpZ2h0OiAzNnB4IH1gLCBzY2FsZWQgdG9cbiAgICAgIC8vIHRoZSBtb3JlIGNvbXBhY3Qgb24tcGFnZSBib3gpLlxuICAgICAgaGVpZ2h0OiAnMjhweCcsXG4gICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI2ZmNWYwMCAwJSwgI2VmNGIwMCAxMDAlKScsXG4gICAgICBjb2xvcjogJyNmZmYnLCBib3JkZXI6ICcwJywgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgIGZvbnQ6IFwiNzAwIDExcHgvMSAnQnJpY29sYWdlIEdyb3Rlc3F1ZScsJ091dGZpdCcsc3lzdGVtLXVpLHNhbnMtc2VyaWZcIixcbiAgICAgIGxldHRlclNwYWNpbmc6ICcuMDFlbScsXG4gICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgYm94U2hhZG93OiAnMCAwIDI0cHggcmdiYSgyNTUsOTUsMCwuMjUpJyxcbiAgICB9KTtcbiAgICBjb25zdCBzZW5kSWNvbiA9IHN0eWxlZDxIVE1MU3BhbkVsZW1lbnQ+KCdzcGFuJywge1xuICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JywgbGluZUhlaWdodDogJzAnLFxuICAgIH0pO1xuICAgIHNlbmRJY29uLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnbWVzc2FnZS1zcXVhcmUtcGx1cycsIDE2KTtcbiAgICBjb25zdCBzZW5kTGFiZWwgPSBzdHlsZWQ8SFRNTFNwYW5FbGVtZW50Pignc3BhbicsIHtmb250U2l6ZTogJzEwcHgnfSk7XG4gICAgc2VuZExhYmVsLnRleHRDb250ZW50ID0gY2FwdHVyZWQgPyAnQWRkJyA6ICdDYXB0dXJlJztcbiAgICBzZW5kQnRuLmFwcGVuZChzZW5kSWNvbiwgc2VuZExhYmVsKTtcbiAgICBzZW5kQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGNhcHR1cmVkID8gJ0FkZCBjb21tZW50JyA6ICdDYXB0dXJlIGFuZCBjb21tZW50Jyk7XG4gICAgYWRkUm93LmFwcGVuZCh0YSwgc2VuZEJ0bik7XG4gICAgZWwuYXBwZW5kKGFkZFJvdyk7XG5cbiAgICBjb25zdCBoaW50ID0gc3R5bGVkPEhUTUxEaXZFbGVtZW50PignZGl2Jywge1xuICAgICAgY29sb3I6ICcjODQ3ZDlhJywgZm9udFNpemU6ICcxMHB4JywgbWFyZ2luVG9wOiAnNHB4JyxcbiAgICB9KTtcbiAgICBoaW50LnRleHRDb250ZW50ID0gY2FwdHVyZWRcbiAgICAgID8gJ0VudGVyIHRvIGFkZCDCtyBTaGlmdCtFbnRlciBuZXdsaW5lIMK3IEVzYyB0byBjbG9zZSdcbiAgICAgIDogJ0VudGVyIHRvIGNhcHR1cmUgJiBzYXZlIMK3IFNoaWZ0K0VudGVyIG5ld2xpbmUgwrcgRXNjIHRvIGNsb3NlJztcbiAgICBlbC5hcHBlbmQoaGludCk7XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRGZWVkYmFjayh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGxpID0gc3R5bGVkPEhUTUxMSUVsZW1lbnQ+KCdsaScsIHtcbiAgICAgICAgbWFyZ2luOiAnMnB4IDAnLCBjb2xvcjogJyNmY2ZhZjUnLCB3b3JkQnJlYWs6ICdicmVhay13b3JkJyxcbiAgICAgIH0pO1xuICAgICAgbGkudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgbGlzdC5hcHBlbmQobGkpO1xuICAgICAgaWYgKCFsaXN0LnBhcmVudE5vZGUpIGVsLmluc2VydEJlZm9yZShsaXN0LCBhZGRSb3cpO1xuICAgIH1cblxuICAgIGNvbnN0IHN1Ym1pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSB0YS52YWx1ZS50cmltKCk7XG4gICAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICAgIGlmIChjYXB0dXJlZCAmJiBzZWxlY3Rvcikge1xuICAgICAgICAvLyBSb3V0ZSBieSBzdGFibGUgdWlkICsgVVJMIHdoZW4gYXZhaWxhYmxlLiBTaWRlLXBhbmVsJ3NcbiAgICAgICAgLy8gb25GZWVkYmFja0FkZCBwcmVmZXJzIHBhcmVudFVpZDsgc2VsZWN0b3IgKyB1cmwgaXMgdGhlXG4gICAgICAgIC8vIGNvbXBvc2l0ZSBmYWxsYmFjay4gVGhlIGJhcmUtc2VsZWN0b3IgcGF0aCB0aGF0IHVzZWQgdG9cbiAgICAgICAgLy8gc2hpcCBjYXVzZWQgY3Jvc3MtcGFnZSBjb21tZW50IGNvbnRhbWluYXRpb24uXG4gICAgICAgIHNlbmRUb1BhbmVsKHtcbiAgICAgICAgICBraW5kOiAnZmVlZGJhY2stYWRkJywgc2VsZWN0b3IsIHRleHQsXG4gICAgICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgICAgICAgIC4uLihhY3RpdmVVaWQgPyB7cGFyZW50VWlkOiBhY3RpdmVVaWR9IDoge30pLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAobG9ja2VkVG8pIHtcbiAgICAgICAgLy8gQ2FwdHVyZSArIGF0dGFjaCB0aGUgY29tbWVudCBpbiBvbmUgbW90aW9uLCB0aGVuIHJlYnVpbGQgdGhlXG4gICAgICAgIC8vIGJvZHkgd2l0aCBjYXB0dXJlZD10cnVlIHNvIHRoZSBvcmFuZ2UgI04gaGVhZGVyIGFwcGVhcnMsIGJ1dHRvblxuICAgICAgICAvLyB0ZXh0IGZsaXBzIHRvIFwiQWRkXCIsIGV0Yy5cbiAgICAgICAgY29uc3QgZW50cnkgPSBjYXB0dXJlQW5kQ29tbWVudChsb2NrZWRUbywgdGV4dCk7XG4gICAgICAgIHBheWxvYWQuY2FwdHVyZWQgPSB0cnVlO1xuICAgICAgICBwYXlsb2FkLnVpZCA9IGVudHJ5LnVpZDtcbiAgICAgICAgcGF5bG9hZC5uID0gZW50cnkubjtcbiAgICAgICAgcGF5bG9hZC5zZWxlY3RvciA9IGVudHJ5LnNlbGVjdG9yO1xuICAgICAgICBwYXlsb2FkLmZlZWRiYWNrID0gWy4uLihwYXlsb2FkLmZlZWRiYWNrID8/IFtdKSwgdGV4dF07XG4gICAgICAgIHNlbGVjdG9yID0gZW50cnkuc2VsZWN0b3I7XG4gICAgICAgIGFjdGl2ZVVpZCA9IGVudHJ5LnVpZDtcbiAgICAgICAgYnVpbGRCb2R5KHBheWxvYWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0YS52YWx1ZSA9ICcnO1xuICAgICAgcGF5bG9hZC5mZWVkYmFjayA9IFsuLi4ocGF5bG9hZC5mZWVkYmFjayA/PyBbXSksIHRleHRdO1xuICAgICAgYXBwZW5kRmVlZGJhY2sodGV4dCk7XG4gICAgfTtcbiAgICBzZW5kQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3VibWl0KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7IGUucHJldmVudERlZmF1bHQoKTsgaGlkZSgpOyB9XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICAgIC8vIElmIGEgZm9jdXMgcmVxdWVzdCBjYW1lIGluIGJlZm9yZSB0aGUgdGV4dGFyZWEgZXhpc3RlZCAoYWx0LXJlbGVhc2VcbiAgICAvLyByYWNlZCBhaGVhZCBvZiB0aGUgYW5ub3RhdGlvbiByb3VuZC10cmlwKSwgY2xhaW0gaXQgbm93LlxuICAgIGlmICh3YW50c0ZvY3VzKSB7XG4gICAgICB3YW50c0ZvY3VzID0gZmFsc2U7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGEuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHRydWV9KSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IEdBUCA9IDg7ICAgICAvLyBnYXAgYmV0d2VlbiBhbmNob3IgZWRnZSBhbmQgYm94XG4gIGNvbnN0IE1BUkdJTiA9IDg7ICAvLyBtaW4gZGlzdGFuY2UgZnJvbSBhbnkgdmlld3BvcnQgZWRnZVxuXG4gIC8vIERldGVybWluaXN0aWMgcGxhY2VtZW50IHJlbGF0aXZlIHRvIGBhbmNob3JgLiBUd28gc3VidGxldGllcyB0aGUgb2xkXG4gIC8vIHZlcnNpb24gZ290IHdyb25nLCB3aGljaCBwcm9kdWNlZCB0aGUgXCJib3ggaW4gYSByYW5kb20gc3BvdFwiIHJlcG9ydHM6XG4gIC8vICAgMS4gSXQgcmVhZCBgZWwub2Zmc2V0SGVpZ2h0YCB3aGlsZSB0aGUgYm94IHdhcyBzdGlsbCBgZGlzcGxheTpub25lYCxcbiAgLy8gICAgICBzbyBoZWlnaHQgbWVhc3VyZWQgYXMgMCBhbmQgdGhlIGFib3ZlL2JlbG93IGRlY2lzaW9uICsgdGhlXG4gIC8vICAgICAgTWF0aC5tYXgoOCwg4oCmKSBjbGFtcCB3ZXJlIGNvbXB1dGVkIGFnYWluc3QgZ2FyYmFnZS5cbiAgLy8gICAyLiBJdCBjbGFtcGVkIHRoZSBsZWZ0IGVkZ2Ugd2l0aCBhIGhhcmRjb2RlZCAzNjBweCB3aWR0aCBpbnN0ZWFkIG9mXG4gIC8vICAgICAgdGhlIGJveCdzIHJlYWwgbWVhc3VyZWQgd2lkdGgsIHNvIGEgbmFycm93ZXIgYm94IChzaG9ydCBjb21tZW50KVxuICAvLyAgICAgIGRyaWZ0ZWQgYW5kIGEgd2lkZXIgYm94IChsb25nIGZlZWRiYWNrIGxpc3QpIG92ZXJmbG93ZWQuXG4gIC8vIFdlIGZvcmNlIHRoZSBib3ggdmlzaWJsZSBidXQgdHJhbnNwYXJlbnQgZm9yIG9uZSBzeW5jaHJvbm91cyBtZWFzdXJlLFxuICAvLyB0aGVuIHBsYWNlIGl0IHVzaW5nIGl0cyByZWFsIHJlbmRlcmVkIHNpemUuIEFsbCBudW1iZXJzIGFyZSBjbGFtcGVkIHNvXG4gIC8vIHRoZSB3aG9sZSBib3ggYWx3YXlzIGxhbmRzIGluc2lkZSB0aGUgdmlld3BvcnQuXG4gIGNvbnN0IHBvc2l0aW9uID0gKGFuY2hvcjogRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHIgPSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgLy8gTWVhc3VyZSB0aGUgcmVhbCBib3ggc2l6ZS4gSXQncyBhbHJlYWR5IGluIHRoZSBET00gKGJ1aWxkQm9keSByYW4pO1xuICAgIC8vIG1ha2luZyBpdCBgYmxvY2tgIGxldHMgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHJlcG9ydCB0cnVlIGRpbWVuc2lvbnMuXG4gICAgLy8gdmlzaWJpbGl0eTpoaWRkZW4ga2VlcHMgdGhlIG1lYXN1cmUgaW52aXNpYmxlIHNvIHRoZXJlJ3Mgbm8gZmxhc2ggYXRcbiAgICAvLyBhIHByZS1wbGFjZW1lbnQgbG9jYXRpb24uXG4gICAgY29uc3QgcHJldlZpcyA9IGVsLnN0eWxlLnZpc2liaWxpdHk7XG4gICAgZWwuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGVsLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICBlbC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICBjb25zdCBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBidyA9IGJveC53aWR0aCB8fCAzMjA7XG4gICAgY29uc3QgYmggPSBib3guaGVpZ2h0IHx8IDE2MDtcbiAgICBlbC5zdHlsZS52aXNpYmlsaXR5ID0gcHJldlZpcyB8fCAndmlzaWJsZSc7XG5cbiAgICAvLyBWZXJ0aWNhbDogcHJlZmVyIGJlbG93IHRoZSBhbmNob3I7IGZsaXAgYWJvdmUgd2hlbiBiZWxvdyB3b3VsZCBjbGlwXG4gICAgLy8gdGhlIGJvdHRvbSBlZGdlIEFORCB0aGVyZSdzIG1vcmUgcm9vbSBhYm92ZS5cbiAgICBjb25zdCByb29tQmVsb3cgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSByLmJvdHRvbSAtIEdBUDtcbiAgICBjb25zdCByb29tQWJvdmUgPSByLnRvcCAtIEdBUDtcbiAgICBjb25zdCB1c2VBYm92ZSA9IGJoID4gcm9vbUJlbG93ICYmIHJvb21BYm92ZSA+IHJvb21CZWxvdztcbiAgICBsZXQgdG9wID0gdXNlQWJvdmUgPyByLnRvcCAtIEdBUCAtIGJoIDogci5ib3R0b20gKyBHQVA7XG4gICAgdG9wID0gTWF0aC5tYXgoTUFSR0lOLCBNYXRoLm1pbih0b3AsIHdpbmRvdy5pbm5lckhlaWdodCAtIGJoIC0gTUFSR0lOKSk7XG5cbiAgICAvLyBIb3Jpem9udGFsOiBsZWZ0LWFsaWduIHRvIHRoZSBhbmNob3IsIHRoZW4gY2xhbXAgdGhlIHdob2xlIGJveCBpbnNpZGVcbiAgICAvLyB0aGUgdmlld3BvcnQgdXNpbmcgaXRzIHJlYWwgd2lkdGguXG4gICAgbGV0IGxlZnQgPSByLmxlZnQ7XG4gICAgbGVmdCA9IE1hdGgubWF4KE1BUkdJTiwgTWF0aC5taW4obGVmdCwgd2luZG93LmlubmVyV2lkdGggLSBidyAtIE1BUkdJTikpO1xuXG4gICAgZWwuc3R5bGUubGVmdCA9IE1hdGgucm91bmQobGVmdCkgKyAncHgnO1xuICAgIGVsLnN0eWxlLnRvcCA9IE1hdGgucm91bmQodG9wKSArICdweCc7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH07XG5cbiAgY29uc3QgaGlkZSA9ICgpOiB2b2lkID0+IHtcbiAgICBzdG9wV2F0Y2hkb2coKTtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICBhY3RpdmVVaWQgPSBudWxsO1xuICAgIGxvY2tlZFRvID0gbnVsbDtcbiAgICBsb2NrZWQgPSBmYWxzZTtcbiAgICB0ZXh0YXJlYSA9IG51bGw7XG4gICAgZmVlZGJhY2tMaXN0ID0gbnVsbDtcbiAgICB3YW50c0ZvY3VzID0gZmFsc2U7XG4gICAgbGFzdEFuY2hvcktleSA9ICcnO1xuICAgIG9uSGlkZSgpO1xuICB9O1xuXG4gIGNvbnN0IGlzVHlwaW5nID0gKCk6IGJvb2xlYW4gPT4gQm9vbGVhbih0ZXh0YXJlYSkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGFyZWE7XG4gIGNvbnN0IHNob3cgPSAoYW5jaG9yOiBFbGVtZW50LCBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGwpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBheWxvYWQpIHtcbiAgICAgIGlmIChsb2NrZWQgfHwgaXNUeXBpbmcoKSkgcmV0dXJuO1xuICAgICAgaGlkZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBTYW1lIGNhcHR1cmUg4oCUIHByZXNlcnZlIHRleHRhcmVhIGNvbnRlbnQgKyBmb2N1cywganVzdCByZWZyZXNoXG4gICAgLy8gdGhlIGZlZWRiYWNrIGxpc3QuIFdlIGNvbXBhcmUgQk9USCB1aWQgYW5kIHNlbGVjdG9yIHNvIGEgc3RhbGVcbiAgICAvLyBwYXlsb2FkIHBvaW50aW5nIGF0IGEgZGlmZmVyZW50IGNhcHR1cmUgKHNhbWUgc2VsZWN0b3IsIGUuZy5cbiAgICAvLyBhbHQtaG92ZXJpbmcgYSBzaWJsaW5nIHdpdGggdGhlIHNhbWUgdGVzdElkKSB0cmlnZ2VycyBhIGZ1bGxcbiAgICAvLyByZWZyZXNoIGluc3RlYWQgb2YgcHJldGVuZGluZyBub3RoaW5nIGNoYW5nZWQuXG4gICAgaWYgKHNlbGVjdG9yID09PSBwYXlsb2FkLnNlbGVjdG9yICYmIChwYXlsb2FkLnVpZCA/PyBudWxsKSA9PT0gYWN0aXZlVWlkKSB7XG4gICAgICBpZiAocGF5bG9hZC5mZWVkYmFjaz8ubGVuZ3RoICYmIGZlZWRiYWNrTGlzdCkge1xuICAgICAgICBmZWVkYmFja0xpc3QucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBwYXlsb2FkLmZlZWRiYWNrKSB7XG4gICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24obGkuc3R5bGUsIHttYXJnaW46ICcycHggMCcsIGNvbG9yOiAnI2ZjZmFmNScsIHdvcmRCcmVhazogJ2JyZWFrLXdvcmQnfSk7XG4gICAgICAgICAgbGkudGV4dENvbnRlbnQgPSB0O1xuICAgICAgICAgIGZlZWRiYWNrTGlzdC5hcHBlbmQobGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIERpZmZlcmVudCBjYXB0dXJlIOKAlCBzd2l0Y2ggZnVsbHkuIEFsdC1ob3ZlciBvbmx5IGZpcmVzIHdoaWxlIEFsdFxuICAgIC8vIGlzIGhlbGQsIHNvIHRoaXMgb25seSBoYXBwZW5zIHdoZW4gdGhlIHVzZXIgZGVsaWJlcmF0ZWx5IG1vdmVzIHRvXG4gICAgLy8gYSBuZXcgdGFyZ2V0OyBsb3NpbmcgaW4tcHJvZ3Jlc3MgdHlwaW5nIGlzIHRoZSBleHBlY3RlZCBjb3N0IG9mXG4gICAgLy8gc3dpdGNoaW5nLiBPbmNlIEFsdCBpcyByZWxlYXNlZCwgbW91c2Vtb3ZlcyBkb24ndCB0cmlnZ2VyIGhvdmVyXG4gICAgLy8gZXZlbnRzLCBzbyB0aGUgYm94IGZyZWV6ZXMgb24gdGhlIGxhc3QgZWxlbWVudCBhbmQgdHlwaW5nIGlzIHNhZmUuXG4gICAgc2VsZWN0b3IgPSBwYXlsb2FkLnNlbGVjdG9yID8/IG51bGw7XG4gICAgYWN0aXZlVWlkID0gcGF5bG9hZC51aWQgPz8gbnVsbDtcbiAgICBsb2NrZWRUbyA9IGFuY2hvcjtcbiAgICBidWlsZEJvZHkocGF5bG9hZCk7XG4gICAgcG9zaXRpb24oYW5jaG9yKTtcbiAgICBzdGFydFdhdGNoZG9nKCk7XG4gICAgb25TaG93KGFuY2hvcik7XG4gIH07XG4gIC8vIFBlbmRpbmctZm9jdXMgZmxhZzogaWYgZm9jdXMgaXMgcmVxdWVzdGVkIGJlZm9yZSB0aGUgdGV4dGFyZWEgZXhpc3RzXG4gIC8vIChlLmcuIGFsdCB3YXMgcmVsZWFzZWQgYmVmb3JlIHRoZSBhbm5vdGF0aW9uIG1lc3NhZ2Ugcm91bmQtdHJpcHBlZFxuICAvLyBiYWNrKSwgd2Ugc2V0IHRoZSBmbGFnIGFuZCB0aGUgYnVpbGRCb2R5IGNvbXBsZXRpb24gcGF0aCBwaWNrcyBpdCB1cC5cbiAgbGV0IHdhbnRzRm9jdXMgPSBmYWxzZTtcbiAgY29uc3QgZG9Gb2N1cyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXRleHRhcmVhKSByZXR1cm47XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGVsIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRhcmVhKSByZXR1cm47XG4gICAgLy8gRGVmZXIgdG8gdGhlIG5leHQgZnJhbWUgc28gd2UgbGFuZCBBRlRFUiBhbnkgZm9jdXMtc3RlYWxpbmcgYnJvd3NlclxuICAgIC8vIGJlaGF2aW91ciAoZS5nLiBBbHQg4oaSIG1lbnUtYmFyIG9uIFdpbmRvd3MpIGhhcyBzZXR0bGVkLlxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBpZiAodGV4dGFyZWEpIHRleHRhcmVhLmZvY3VzKHtwcmV2ZW50U2Nyb2xsOiB0cnVlfSk7XG4gICAgfSk7XG4gIH07XG4gIC8vIFB1YmxpYyBob29rOiBmb2N1cyB0aGUgdGV4dGFyZWEgKGNhbGxlZCBvbiBhbHQtcmVsZWFzZSBzbyB0eXBpbmcgaXNcbiAgLy8gaW1tZWRpYXRlIHdpdGhvdXQgdGhlIHVzZXIgaGF2aW5nIHRvIG1vdXNlIHRvIHRoZSBib3gpLlxuICBjb25zdCBmb2N1c1RleHRhcmVhID0gKCk6IHZvaWQgPT4ge1xuICAgIHdhbnRzRm9jdXMgPSB0cnVlO1xuICAgIGRvRm9jdXMoKTtcbiAgfTtcblxuICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIGxvY2tlZCA9IHRydWU7XG4gICAgaWYgKHRleHRhcmVhICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRleHRhcmVhKSB0ZXh0YXJlYS5mb2N1cygpO1xuICB9KTtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBpZiAodGV4dGFyZWEgJiYgKHRleHRhcmVhLnZhbHVlLmxlbmd0aCA+IDAgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGFyZWEpKSByZXR1cm47XG4gICAgbG9ja2VkID0gZmFsc2U7XG4gIH0pO1xuXG4gIC8vIFRydWUgd2hlbiB0aGUgYW5jaG9yIGhhcyBsZWZ0IHRoZSBET00gb3IgY29sbGFwc2VkIHRvIG5vdGhpbmcgKGRpc3BsYXlcbiAgLy8gdG9nZ2xlZCBvZmYsIHJlbW92ZWQsIGRldGFjaGVkKS4gQSBib3ggYW5jaG9yZWQgdG8gYSB2YW5pc2hlZCBlbGVtZW50IGlzXG4gIC8vIHRoZSBcInRvb2x0aXAgc3RyYW5kZWQgYWZ0ZXIgaXRzIGFuY2hvciBsZWF2ZXNcIiBmYWlsdXJlIOKAlCB0ZWFyIGl0IGRvd24uXG4gIGNvbnN0IGFuY2hvcklzR29uZSA9ICgpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIWxvY2tlZFRvKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoIWxvY2tlZFRvLmlzQ29ubmVjdGVkKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCByID0gbG9ja2VkVG8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHIud2lkdGggPT09IDAgJiYgci5oZWlnaHQgPT09IDA7XG4gIH07XG5cbiAgY29uc3QgcmVwb3NpdGlvbiA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoZWwuc3R5bGUuZGlzcGxheSAhPT0gJ2Jsb2NrJykgcmV0dXJuO1xuICAgIGlmIChhbmNob3JJc0dvbmUoKSkgeyBoaWRlKCk7IHJldHVybjsgfVxuICAgIHBvc2l0aW9uKGxvY2tlZFRvISk7XG4gIH07XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCByZXBvc2l0aW9uLCB0cnVlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlcG9zaXRpb24pO1xuXG4gIC8vIEFuY2hvciB3YXRjaGRvZy4gU2Nyb2xsL3Jlc2l6ZSBjb3ZlciBtb3N0IG1vdmVtZW50LCBidXQgYW4gU1BBIHRoYXRcbiAgLy8gc3dhcHMgdGhlIGFuY2hvcmVkIGVsZW1lbnQgb3V0IChyb3V0ZSBjaGFuZ2UsIGxpc3QgcmUtcmVuZGVyLCBtb2RhbFxuICAvLyBjbG9zZSkgZmlyZXMgbmVpdGhlciDigJQgbGVhdmluZyB0aGUgYm94IHN0cmFuZGVkIGF0IGEgc3RhbGUgcG9zaXRpb24uXG4gIC8vIEEgc2VsZi1jYW5jZWxsaW5nIHJBRiBsb29wIHRoYXQgb25seSBydW5zIHdoaWxlIHRoZSBib3ggaXMgdmlzaWJsZVxuICAvLyBjYXRjaGVzIHRoYXQ6IGl0IHJlcG9zaXRpb25zIG9uIGxheW91dCBkcmlmdCBhbmQgaGlkZXMgdGhlIG1vbWVudCB0aGVcbiAgLy8gYW5jaG9yIGlzIGdvbmUuIEl0IHN0b3BzIGl0c2VsZiB3aGVuIHRoZSBib3ggaGlkZXMgc28gdGhlcmUncyBub1xuICAvLyBhbWJpZW50IGxvb3Agb24gZXZlcnkgcGFnZS5cbiAgbGV0IHdhdGNoZG9nID0gMDtcbiAgY29uc3Qgc3RvcFdhdGNoZG9nID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICh3YXRjaGRvZykgeyBjYW5jZWxBbmltYXRpb25GcmFtZSh3YXRjaGRvZyk7IHdhdGNoZG9nID0gMDsgfVxuICB9O1xuICBsZXQgbGFzdEFuY2hvcktleSA9ICcnO1xuICBjb25zdCBzdGFydFdhdGNoZG9nID0gKCk6IHZvaWQgPT4ge1xuICAgIHN0b3BXYXRjaGRvZygpO1xuICAgIGNvbnN0IHRpY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoZWwuc3R5bGUuZGlzcGxheSAhPT0gJ2Jsb2NrJykgeyB3YXRjaGRvZyA9IDA7IHJldHVybjsgfVxuICAgICAgaWYgKGFuY2hvcklzR29uZSgpKSB7IGhpZGUoKTsgcmV0dXJuOyB9XG4gICAgICAvLyBSZXBvc2l0aW9uIG9ubHkgd2hlbiB0aGUgYW5jaG9yIGFjdHVhbGx5IG1vdmVkLCBzbyB3ZSBkb24ndCBmaWdodFxuICAgICAgLy8gdGhlIHVzZXIncyBjYXJldCAvIHJlLW1lYXN1cmUgZXZlcnkgZnJhbWUuXG4gICAgICBjb25zdCByID0gbG9ja2VkVG8hLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3Qga2V5ID0gYCR7TWF0aC5yb3VuZChyLmxlZnQpfSwke01hdGgucm91bmQoci50b3ApfSwke01hdGgucm91bmQoci53aWR0aCl9LCR7TWF0aC5yb3VuZChyLmhlaWdodCl9YDtcbiAgICAgIGlmIChrZXkgIT09IGxhc3RBbmNob3JLZXkpIHsgbGFzdEFuY2hvcktleSA9IGtleTsgcG9zaXRpb24obG9ja2VkVG8hKTsgfVxuICAgICAgd2F0Y2hkb2cgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgfTtcbiAgICB3YXRjaGRvZyA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgfTtcblxuICAvLyBFc2NhcGUgZnJvbSBhbnl3aGVyZSAobm90IGp1c3QgdGhlIGZvY3VzZWQgdGV4dGFyZWEpIGRpc21pc3NlcyB0aGUgYm94LlxuICAvLyBUaGUgdGV4dGFyZWEncyBvd24ga2V5ZG93biBoYW5kbGVzIEVzY2FwZSB3aGlsZSBmb2N1c2VkOyB0aGlzIGNvdmVycyB0aGVcbiAgLy8gY2FzZSB3aGVyZSB0aGUgYm94IGlzIGxvY2tlZC9vcGVuIGJ1dCBmb2N1cyBpcyBlbHNld2hlcmUgb24gdGhlIHBhZ2UuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgZWwuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJykgeyBoaWRlKCk7IH1cbiAgfSwgdHJ1ZSk7XG5cbiAgcmV0dXJuIHtzaG93LCBoaWRlLCBpc0xvY2tlZDogKCkgPT4gbG9ja2VkIHx8IGlzVHlwaW5nKCksIGZvY3VzVGV4dGFyZWEsIHN0YXJ0V2F0Y2hkb2csIHN0b3BXYXRjaGRvZ307XG59XG5cbi8vIChObyBzaGFkb3cgc3R5bGVzaGVldCDigJQgZXZlcnkgb3ZlcmxheSBlbGVtZW50IGdldHMgaXRzIHN0eWxlIGFwcGxpZWQgdmlhXG4vLyB0aGUgSlMgSFRNTEVsZW1lbnQuc3R5bGUgQVBJLCB3aGljaCBDaHJvbWUgYWxsb3dzIHVuZGVyIHN0cmljdCBDU1AuKVxuIgogIF0sCiAgIm1hcHBpbmdzIjogIjs7RUFVQSxJQUFJLHVCQUFxRDtBQUFBLEVBQ2xELElBQU0sMEJBQTBCLENBQUMsT0FBa0M7QUFBQSxJQUN4RSx1QkFBdUI7QUFBQTtBQUFBLEVBSXpCLElBQU0sV0FBVztBQUFBLEVBQ2pCLElBQU0sY0FBYztBQUFBLEVBQ3BCLElBQU0sV0FBVztBQUFBLEVBQ2pCLElBQU0sWUFBWTtFQUlsQixJQUFNLFlBQVksT0FBTyxRQUFRLGVBQWUsT0FBTyxJQUFJLFdBQVc7QUFBQSxFQUMvRCxJQUFNLFlBQVksQ0FBQyxNQUN4QixZQUFZLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUs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QUFBQSxRQUFRO0FBQUEsUUFHdEMsTUFBTSxJQUFJLFNBQVUsc0JBQXNCO0FBQUEsUUFDMUMsTUFBTSxNQUFNLEdBQUcsS0FBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFLEdBQUcsS0FBSyxLQUFLLE1BQU0sRUFBRSxLQUFLLEtBQUssS0FBSyxNQUFNLEVBQUUsTUFBTTtBQUFBLFFBQ3BHLElBQUksUUFBUSxlQUFlO0FBQUEsVUFBRSxnQkFBZ0I7QUFBQSxVQUFLLFNBQVMsUUFBUztBQUFBLFFBQUc7QUFBQSxRQUN2RSxXQUFXLHNCQUFzQixJQUFJO0FBQUE7QUFBQSxNQUV2QyxXQUFXLHNCQUFzQixJQUFJO0FBQUE7QUFBQSxJQU12QyxTQUFTLGlCQUFpQixXQUFXLENBQUMsTUFBTTtBQUFBLE1BQzFDLElBQUksRUFBRSxRQUFRLFlBQVksR0FBRyxNQUFNLFlBQVksU0FBUztBQUFBLFFBQUUsS0FBSztBQUFBLE1BQUc7QUFBQSxPQUNqRSxJQUFJO0FBQUEsSUFFUCxPQUFPLEVBQUMsTUFBTSxNQUFNLFVBQVUsTUFBTSxVQUFVLFNBQVMsR0FBRyxlQUFlLGVBQWUsYUFBWTtBQUFBOyIsCiAgImRlYnVnSWQiOiAiMDkyMTYyNjlFMkNDMjk3RjY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
