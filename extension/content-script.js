(() => {
  const KEY = "__selectorCaptureMode";
  const STORE_KEY =
    "__selectorCaptureModeLog:" + location.origin + location.pathname + location.search + location.hash;

  const MAX_TEXT = 140;
  const MAX_SNIPPET = 2600;
  const MAX_ATTR = 140;
  const MAX_ARRAY = 24;
  const MAX_RULES = 12;
  const MAX_CUSTOM_PROPERTIES = 36;
  const MAX_COMPUTED_KEYS = 160;
  const MAX_PREVIEW_CSS = 420;
  const MAX_LISTENERS = 12;

  const STYLE_INTERESTS = [
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
    "animation",
  ];

  const PSEUDO_STATES = [
    "active",
    "focus",
    "focus-visible",
    "focus-within",
    "hover",
    "visited",
    "target",
    "disabled",
    "enabled",
    "required",
    "optional",
    "read-only",
    "read-write",
    "checked",
    "in-range",
    "out-of-range",
    "valid",
    "invalid",
  ];

  const EVENT_HANDLER_PROPS = [
    "onclick",
    "ondblclick",
    "oncontextmenu",
    "onfocus",
    "onfocusin",
    "onfocusout",
    "onblur",
    "onchange",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onmousedown",
    "onmouseup",
    "onmouseenter",
    "onmouseleave",
    "onmouseover",
    "onmouseout",
    "onsubmit",
    "onreset",
  ];

  const EVENT_PROP_SUMMARY = [
    "onclick",
    "onfocus",
    "onblur",
    "onchange",
    "oninput",
    "onsubmit",
    "onkeydown",
    "onkeyup",
    "onmouseover",
    "onmouseenter",
    "onmouseleave",
    "onmouseout",
    "onmousedown",
    "onmouseup",
  ];

  if (window[KEY] && typeof window[KEY].destroy === "function") {
    window[KEY].destroy();
    return;
  }

  const canEscape = window.CSS && typeof CSS.escape === "function";
  const escapeCss = (value) =>
    canEscape
      ? CSS.escape(value)
      : String(value).replace(/([ #;?%&,.+*~':"!^$[\]()=>|/@])/g, "\\$1");

  const trimText = (value, max = MAX_TEXT) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);

  const safeCall = (fn, fallback) => {
    try {
      return fn();
    } catch {
      return fallback;
    }
  };

  const toPositiveInt = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  };

  const lower = (value) => (typeof value === "string" ? value.toLowerCase() : "");

  const asJson = (value) => JSON.stringify(value);

  const isObject = (value) => value !== null && typeof value === "object";

  const serializeValue = (
    value,
    maxDepth = 2,
    maxKeys = 18,
    visited = new Set(),
    maxLen = 300,
  ) => {
    if (value === null || value === undefined) return value;
    if (typeof value === "string") return trimText(value, maxLen);
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "function") return "[Function]";
    if (typeof value === "symbol") return `[Symbol ${String(value)}]`;
    if (!isObject(value)) return String(value);
    if (visited.has(value)) return "[Circular]";
    if (maxDepth <= 0) return "[Object]";

    if (Array.isArray(value)) {
      return value.slice(0, maxKeys).map((item) =>
        serializeValue(item, maxDepth - 1, maxKeys, visited, maxLen),
      );
    }

    if (
      value instanceof Date ||
      value instanceof RegExp ||
      value instanceof Error ||
      value instanceof AbortController
    ) {
      return String(value);
    }

    if (value.nodeType) return "[DOM Node]";

    visited.add(value);
    const out = {};
    const keys = Object.keys(value).slice(0, maxKeys);

    for (const key of keys) {
      out[key] = serializeValue(value[key], maxDepth - 1, maxKeys, visited, maxLen);
    }

    visited.delete(value);
    return Object.keys(out).length > 0 ? out : "[Object]";
  };

  const attr = (el, name) => trimText(el.getAttribute(name), 120);

  const compactTarget = (el) => {
    let out = el.tagName.toLowerCase();
    if (el.id) out += "#" + el.id;
    if (el.classList && el.classList.length) {
      out += "." + Array.from(el.classList).slice(0, 4).join(".");
    }
    return trimText(out, 180);
  };

  const cssPath = (el) => {
    if (!(el instanceof Element)) return "";
    if (el.id) return "#" + escapeCss(el.id);

    const parts = [];
    let current = el;

    while (
      current &&
      current.nodeType === Node.ELEMENT_NODE &&
      current !== document.body
    ) {
      let selector = current.nodeName.toLowerCase();

      if (current.classList && current.classList.length) {
        selector +=
          "." +
          Array.from(current.classList)
            .slice(0, 3)
            .map(escapeCss)
            .join(".");
      }

      const parent = current.parentElement;
      if (parent) {
        const sameTagSiblings = Array.from(parent.children).filter(
          (sibling) => sibling.nodeName === current.nodeName,
        );
        if (sameTagSiblings.length > 1) {
          selector += `:nth-of-type(${sameTagSiblings.indexOf(current) + 1})`;
        }
      }

      parts.unshift(selector);
      current = current.parentElement;
    }

    return "body > " + parts.join(" > ");
  };

  const xpath = (el) => {
    if (!(el instanceof Element)) return "";
    if (el.id) return `//*[@id="${el.id.replace(/"/g, '\\"')}"]`;

    const parts = [];
    let current = el;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 1;
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.nodeName === current.nodeName) index += 1;
        sibling = sibling.previousElementSibling;
      }
      parts.unshift(`${current.nodeName.toLowerCase()}[${index}]`);
      current = current.parentElement;
    }

    return "/" + parts.join("/");
  };

  const jsPath = (el, maxDepth = 14) => {
    if (!(el instanceof Element)) return "";
    const parts = [];
    let current = el;
    let depth = 0;

    while (
      current &&
      current.nodeType === Node.ELEMENT_NODE &&
      depth < maxDepth
    ) {
      let selector = current.tagName.toLowerCase();

      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((child) =>
          child.nodeType === Node.ELEMENT_NODE,
        );
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }

      parts.unshift(selector);
      current = current.parentElement;
      depth += 1;
    }

    return "document > " + parts.join(" > ");
  };

  const accessibleName = (el) =>
    trimText(
      attr(el, "aria-label") ||
        attr(el, "title") ||
        attr(el, "alt") ||
        el.innerText ||
        el.textContent,
      180,
    );

  const dataAttributes = (el) => {
    const output = {};
    if (!el || !el.attributes) return output;

    for (const attribute of Array.from(el.attributes)) {
      const name = attribute.name || "";
      const lower = name.toLowerCase();
      if (!lower.startsWith("data-")) continue;
      output[name.slice(5)] = trimText(attribute.value, MAX_ATTR);
    }

    return output;
  };

  const attributeSet = (el, limit = MAX_ATTR) => {
    const output = {};
    if (!el || !el.attributes) return output;
    let count = 0;

    for (const attribute of Array.from(el.attributes)) {
      if (count >= MAX_ARRAY) break;
      output[attribute.name] = trimText(attribute.value, limit);
      count += 1;
    }

    return output;
  };

  const ariaAttributes = (el) => {
    const output = {};
    if (!el || !el.attributes) return output;

    for (const attribute of Array.from(el.attributes)) {
      const name = attribute.name || "";
      if (name.startsWith("aria-")) {
        output[name] = trimText(attribute.value, MAX_ATTR);
      }
    }

    return output;
  };

  const implicitRole = (el) => {
    if (!(el instanceof Element)) return null;
    if (el instanceof HTMLButtonElement) return "button";
    if (el instanceof HTMLInputElement) return "textbox";
    if (el instanceof HTMLTextAreaElement) return "textbox";
    if (el instanceof HTMLSelectElement) return "listbox";
    if (el instanceof HTMLAnchorElement && el.href) return "link";
    if (el instanceof HTMLMeterElement) return "meter";
    if (el instanceof HTMLProgressElement) return "progressbar";
    if (el instanceof HTMLLIElement) return "listitem";
    if (el instanceof HTMLUListElement || el instanceof HTMLOListElement) return "list";
    if (el instanceof HTMLTableElement) return "table";
    if (el instanceof HTMLTableCellElement) return "cell";
    if (el instanceof HTMLTableRowElement) return "row";
    if (el instanceof HTMLFormElement) return "form";
    return null;
  };

  const relation = (el) => {
    if (!(el instanceof Element)) return {};
    return {
      parent: el.parentElement
        ? {
            tag: el.parentElement.tagName.toLowerCase(),
            id: el.parentElement.id || null,
            role: attr(el.parentElement, "role") || null,
          }
        : null,
      siblingIndex: el.parentElement
        ? Array.from(el.parentElement.children).indexOf(el) + 1
        : null,
      childElementCount: el.childElementCount,
      nodeIndex: toPositiveInt(el.tabIndex) || 0,
      previousSibling: (() => {
        const prev = el.previousElementSibling;
        return prev ? compactTarget(prev) : null;
      })(),
      nextSibling: (() => {
        const next = el.nextElementSibling;
        return next ? compactTarget(next) : null;
      })(),
    };
  };

  const domBreadcrumb = (el, maxDepth = 14) => {
    const out = [];
    let current = el;
    let depth = 0;

    while (
      current &&
      current.nodeType === Node.ELEMENT_NODE &&
      depth < maxDepth
    ) {
      const tag = current.tagName.toLowerCase();
      const item = {
        depth: depth + 1,
        tag,
        compact: compactTarget(current),
        id: current.id || null,
        role: attr(current, "role") || null,
        classes: current.classList
          ? Array.from(current.classList).slice(0, 4)
          : [],
      };

      const testId =
        attr(current, "data-testid") ||
        attr(current, "data-test") ||
        attr(current, "data-cy") ||
        attr(current, "data-qa");

      if (testId) item.testId = testId;
      if (attr(current, "data-component"))
        item.dataComponent = attr(current, "data-component");

      if (current.parentElement === null && current.parentNode instanceof ShadowRoot) {
        const host = current.parentNode.host;
        if (!host) break;
        current = host;
        depth += 1;
        continue;
      }

      current = current.parentElement;
      depth += 1;
      out.unshift(item);
    }

    return out;
  };

  const componentRoot = (el) => {
    let current = el.parentElement;
    let depth = 0;
    const semanticTags = new Set([
      "main",
      "section",
      "article",
      "nav",
      "header",
      "footer",
      "aside",
      "form",
      "table",
      "ul",
      "ol",
    ]);

    while (
      current &&
      current.nodeType === Node.ELEMENT_NODE &&
      current !== document.body &&
      depth < 12
    ) {
      const marker =
        current.id ||
        current.getAttribute("data-component") ||
        current.getAttribute("data-testid") ||
        current.getAttribute("data-test") ||
        current.getAttribute("data-cy") ||
        current.getAttribute("data-qa") ||
        current.getAttribute("role") ||
        semanticTags.has(current.nodeName.toLowerCase());

      if (marker) {
        return {
          compact: compactTarget(current),
          css: cssPath(current),
          xpath: xpath(current),
          tag: current.nodeName.toLowerCase(),
          id: current.id || null,
          role: attr(current, "role") || null,
          testId:
            attr(current, "data-testid") ||
            attr(current, "data-test") ||
            attr(current, "data-cy") ||
            attr(current, "data-qa") ||
            null,
          classes: current.classList
            ? Array.from(current.classList).slice(0, 8)
            : [],
        };
      }

      if (current.parentElement === null && current.parentNode instanceof ShadowRoot) {
        const host = current.parentNode.host;
        current = host || null;
      } else {
        current = current.parentElement;
      }

      depth += 1;
    }

    return null;
  };

  const geometry = (el) => {
    const rect = el.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    return {
      viewportRect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom),
      },
      screenRect: {
        x: Math.round(rect.x + window.scrollX),
        y: Math.round(rect.y + window.scrollY),
      },
      offsetSize: {
        width: el.offsetWidth,
        height: el.offsetHeight,
      },
      clientSize: {
        width: el.clientWidth,
        height: el.clientHeight,
      },
      scroll: {
        left: Math.round(window.scrollX),
        top: Math.round(window.scrollY),
      },
      viewport,
      isInViewport:
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= window.innerHeight &&
        rect.left <= window.innerWidth,
      partiallyVisible:
        rect.width > 0 &&
        rect.height > 0 &&
        (rect.top < 0 ||
          rect.left < 0 ||
          rect.bottom > viewport.height ||
          rect.right > viewport.width),
    };
  };

  const styleSnapshot = (el) => {
    const computed = window.getComputedStyle(el);
    const styleEntries = {};
    for (let i = 0; i < computed.length && i < MAX_COMPUTED_KEYS; i += 1) {
      const prop = computed[i];
      const value = computed.getPropertyValue(prop);
      if (value) {
        styleEntries[prop] = trimText(value, 120);
      }
    }

    const important = {};
    for (const prop of STYLE_INTERESTS) {
      const value = computed.getPropertyValue(prop);
      if (value) important[prop] = trimText(value, 120);
    }

    const margin = {};
    const padding = {};
    const border = {};
    const customProperties = {};
    let customCount = 0;

    for (let i = 0; i < computed.length && customCount < MAX_CUSTOM_PROPERTIES; i += 1) {
      const property = computed[i];
      if (typeof property !== "string" || !property.startsWith("--")) continue;
      customProperties[property] = trimText(
        computed.getPropertyValue(property),
        160,
      );
      customCount += 1;
    }

    const boxModelKeys = [
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth",
    ];

    for (const prop of boxModelKeys) {
      if (!computed[prop]) continue;
      if (prop.startsWith("margin")) margin[prop] = computed[prop];
      else if (prop.startsWith("padding")) padding[prop] = computed[prop];
      else border[prop] = computed[prop];
    }

    const inline = {};
    for (const prop of ["display", "visibility", "content", "position", "zIndex", "top", "left"]) {
      const value = el.style.getPropertyValue(prop);
      if (value) inline[prop] = trimText(value, 120);
    }

    const pseudo = {};
    const pseudoStyles = safeCall(() => {
      const before = getComputedStyle(el, "::before");
      const after = getComputedStyle(el, "::after");
      const marker = getComputedStyle(el, "::marker");
      return {
        before: {
          content: before.getPropertyValue("content"),
          color: before.getPropertyValue("color"),
          font: before.getPropertyValue("font"),
        },
        after: {
          content: after.getPropertyValue("content"),
          color: after.getPropertyValue("color"),
          font: after.getPropertyValue("font"),
        },
        marker: {
          content: marker.getPropertyValue("content"),
          color: marker.getPropertyValue("color"),
        },
      };
    }, {});

    return {
      computed: important,
      computedTail: styleEntries,
      customProperties,
      pseudoStyles: Object.entries(pseudo).reduce((acc, [key, value]) => {
        const out = {};
        for (const [prop, propValue] of Object.entries(value)) {
          if (propValue) out[prop] = trimText(propValue, 120);
        }
        acc[key] = out;
        return acc;
      }, {}),
      boxModel: {
        width: computed.width,
        height: computed.height,
        minWidth: computed.minWidth,
        minHeight: computed.minHeight,
        maxWidth: computed.maxWidth,
        maxHeight: computed.maxHeight,
        margin,
        padding,
        border,
      },
      inlineStyle: inline,
    };
  };

  const ruleSource = (sheet, rule, index) => {
    const ownerNode = sheet?.ownerNode || null;
    const href = sheet?.href || null;
    const mediaText = sheet?.media?.mediaText || null;
    const node = ownerNode;
    return {
      styleSheetHref: href || null,
      styleSheetType: node?.tagName || node?.nodeName || null,
      styleSheetId: node?.id || null,
      media: mediaText,
      origin: href ? "author" : "inline",
      selectorText: rule?.selectorText || null,
      ruleIndex: typeof index === "number" ? index : null,
      sourceLine: toPositiveInt(rule?.style?.srcLine) || null,
      cssText: rule?.cssText ? trimText(rule.cssText, MAX_PREVIEW_CSS) : null,
      hasStyleText: !!rule?.cssText,
    };
  };

  const collectMatchedRules = (el) => {
    const rules = [];
    const mediaStack = [];
    const pushRule = (sheet, rule, index) => {
      if (!rule || !rule.selectorText) return;
      try {
        if (!el.matches(rule.selectorText)) return;
      } catch (error) {
        return;
      }

      const declared = {};
      for (const property of STYLE_INTERESTS) {
        const value = rule.style?.getPropertyValue(property);
        if (value) declared[property] = trimText(value, 140);
      }
      if (Object.keys(declared).length === 0) return;

      rules.push({
        selector: rule.selectorText,
        specificity: null,
        declarations: declared,
        media: mediaStack.join(" && "),
        source: ruleSource(sheet, rule, index),
        declarationPriority: Object.entries(declared).reduce((acc, [key, value]) => {
          if (rule.style?.getPropertyPriority(key) === "important") {
            acc.push(key);
          }
          return acc;
        }, []),
        isInlineStyleRule: !!(rule.style && sheet && !sheet.href),
        selectorText: rule.selectorText,
      });

      if (rules.length >= MAX_RULES) {
        return false;
      }
      return true;
    };

    const walkRules = (sheet, rulesList, indexPrefix = "") => {
      for (let i = 0; i < rulesList.length && rules.length < MAX_RULES; i += 1) {
        const rule = rulesList[i];
        const index = `${indexPrefix}${i}`;
        if (!rule || typeof rule.type !== "number") continue;

        if (rule.type === CSSRule.STYLE_RULE) {
          const keepGoing = pushRule(sheet, rule, index);
          if (keepGoing === false) break;
          continue;
        }

        if (rule.type === CSSRule.MEDIA_RULE || rule.type === CSSRule.SUPPORTS_RULE) {
          const conditionText = rule.conditionText || "";
          const hasCondition = String(conditionText).trim().length > 0;
          if (hasCondition) mediaStack.push(conditionText);
          if (rule.cssRules) {
            walkRules(sheet, rule.cssRules, `${index}.`);
          }
          if (hasCondition) mediaStack.pop();
          continue;
        }

        if (rule.type === CSSRule.IMPORT_RULE && rule.styleSheet) {
          try {
            const importRules = rule.styleSheet.cssRules;
            if (importRules) walkRules(rule.styleSheet, importRules, `${index}.`);
          } catch (error) {
            // Cross-origin imported stylesheet; inaccessible in the current document context.
          }
        }
      }
    };

    if (typeof window.getMatchedCSSRules === "function") {
      try {
        const rawRules = window.getMatchedCSSRules(el);
        if (Array.isArray(rawRules) && rawRules.length > 0) {
          for (const rule of rawRules.slice(0, MAX_RULES)) {
            if (!rule || !rule.styleSheet) continue;
            const kept = pushRule(rule.styleSheet, rule, "matched");
            if (kept === false) break;
          }
          if (rules.length > 0) return rules;
        }
      } catch (error) {
        // Browser blocks or non-support; continue with style-sheet scan fallback.
      }
    }

    const sheets = Array.from(document.styleSheets || []);
    for (const sheet of sheets) {
      const mediaText = sheet.media && sheet.media.mediaText;
      if (mediaText) mediaStack.push(`@media ${mediaText}`);
      let cssRules;
      try {
        cssRules = sheet.cssRules || [];
      } catch (error) {
        if (mediaText) mediaStack.pop();
        continue;
      }

      walkRules(sheet, cssRules, "");
      if (mediaText) mediaStack.pop();
    }

    return rules;
  };

  const eventHandlers = (el) => {
    const attributes = {};
    for (const attribute of Array.from(el.attributes || [])) {
      const name = attribute.name || "";
      if (name.startsWith("on")) attributes[name] = trimText(attribute.value, 220);
    }

    const props = [];
    for (const key of EVENT_PROP_SUMMARY) {
      if (typeof el[key] === "function") {
        props.push({
          type: key,
          assigned: true,
          handlerName: trimText(el[key].name || "anonymous", 80),
        });
      }
    }

    const listeners = safeCall(() => {
      if (typeof window.getEventListeners !== "function") return null;
      const raw = window.getEventListeners(el);
      if (!raw || typeof raw !== "object") return null;

      const out = {};
      const toLine = (v) => {
        if (!v) return null;
        const snippet = trimText(String(v), 220);
        const line = /:(\\d+):(\\d+)/.exec(snippet);
        return line ? Number(line[1]) : null;
      };

      for (const [type, entries] of Object.entries(raw)) {
        if (!Array.isArray(entries)) continue;
        out[type] = entries.slice(0, MAX_LISTENERS).map((entry) => ({
          useCapture: !!entry.useCapture,
          once: !!entry.once,
          passive: !!entry.passive,
          passiveAllowed: !!entry.passive,
          type: String(entry.type || type),
          handlerName: trimText(entry.listener?.name || "anonymous", 80),
          handlerLine: toLine(entry.listener?.toString()),
        }));
      }

      return out;
    }, null);

    return {
      inline: attributes,
      propertyAssigned: props.slice(0, 24),
      devtoolsListeners: listeners,
      handlerPropNames: Object.keys(attributes).filter((key) => key.startsWith("on")).slice(0, 24),
    };
  };

  const interactionStates = (el) => {
    const out = {};
    for (const state of PSEUDO_STATES) {
      try {
        out[state] = el.matches(`:${state}`);
      } catch (error) {
        out[state] = false;
      }
    }

    out.isVisible = window.getComputedStyle(el).visibility !== "hidden";
    out.isEnabled = !el.hasAttribute("disabled");
    return out;
  };

  const accessibility = (el) => {
    const explicitRole = attr(el, "role");
    const explicitName = attr(el, "aria-label") || attr(el, "aria-labelledby") || null;
    const computed = {
      explicitRole: explicitRole || null,
      explicitName: explicitName || null,
      computedRole: explicitRole || implicitRole(el) || null,
      ariaLive: attr(el, "aria-live") || null,
      ariaChecked: attr(el, "aria-checked") || null,
      ariaExpanded: attr(el, "aria-expanded") || null,
      ariaSelected: attr(el, "aria-selected") || null,
      tabIndex: toPositiveInt(el.tabIndex),
      labelledBy: attr(el, "aria-labelledby") || null,
      describedBy: attr(el, "aria-describedby") || null,
      hasPopup: attr(el, "aria-haspopup") || null,
      level: toPositiveInt(attr(el, "aria-level")),
      controls: attr(el, "aria-controls") || null,
    };

    const rawSnapshot = safeCall(() => {
      if (typeof window.getComputedAccessibleNode !== "function") return null;
      const node = window.getComputedAccessibleNode(el);
      return {
        role: node?.role || null,
        name: node?.name || null,
        description: node?.description || null,
      };
    }, null);

    return {
      computed: computed,
      nativeSnapshot: rawSnapshot || null,
    };
  };

  const reactInfo = (el) => {
    const reactKey = Object.keys(el || {}).find(
      (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"),
    );

    if (!reactKey) return null;

    const fiber = el[reactKey];
    let node = fiber;
    const seen = new Set();
    const result = {
      framework: "react",
      componentName: null,
      componentDisplayName: null,
      source: null,
      props: null,
      state: null,
      hooks: null,
    };

    while (node && isObject(node) && !seen.has(node)) {
      seen.add(node);
      const type = node.type || node.elementType;

      if (!result.componentName && type) {
        const candidate = typeof type === "string" ? type : (type.displayName || type.name || null);
        result.componentName = candidate ? trimText(candidate, 120) : "Anonymous";
        result.componentDisplayName = trimText(type?.displayName || result.componentName, 180);
      }

      if (!result.source && node._debugSource) {
        result.source = {
          file: node._debugSource.fileName || node._debugSource.file || null,
          line: node._debugSource.lineNumber || node._debugSource.line || null,
          column: node._debugSource.columnNumber || node._debugSource.column || null,
        };
      }

      if (!result.props && node.memoizedProps) {
        result.props = serializeValue(node.memoizedProps, 2, MAX_ARRAY, new Set(), 260);
      }
      if (!result.state && node.memoizedState) {
        result.state = serializeValue(node.memoizedState, 1, MAX_ARRAY, new Set(), 260);
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

    if (!result.componentName) return null;
    return result;
  };

  const vueInfo = (el) => {
    const vm =
      el?.__vueParentComponent ||
      el?.__vue_app__?._instance ||
      el?.__vnode?.component ||
      el?.__vue__;

    if (!vm) return null;

    const type = vm?.type || vm?.ctx?.type || vm?.type?.ctx?.type || null;
    if (!type) return null;

    const name = type?.name || type?.__name || vm?.type?.__name || null;
    if (!name) return null;

    return {
      framework: "vue",
      componentName: trimText(name, 160),
      source: {
        file: type?.__file || vm?.type?.__file || null,
        uid: vm?.uid || vm?._uid || null,
      },
      props: serializeValue(vm?.props || vm?.exposed || vm?.ctx || null, 2, MAX_ARRAY, new Set(), 260),
      scopeId: vm?.scope?.uid || vm?.scopeId || null,
    };
  };

  const frameworkInfo = (el) => reactInfo(el) || vueInfo(el) || null;

  const pageContext = () => ({
    title: trimText(document.title, 200),
    url: location.href,
    origin: location.origin,
    protocol: location.protocol,
    path: location.pathname,
    search: location.search,
    hash: location.hash,
    route: `${location.pathname}${location.search || ""}${location.hash || ""}`,
    viewport: {
      width: Math.round(window.innerWidth),
      height: Math.round(window.innerHeight),
      devicePixelRatio: window.devicePixelRatio || 1,
      colorScheme:
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      reducedMotion:
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    },
    scroll: {
      x: Math.round(window.scrollX),
      y: Math.round(window.scrollY),
    },
    language: document.documentElement?.lang || null,
    direction: document.documentElement?.dir || "ltr",
    charset: document.characterSet || null,
    documentState: document.readyState,
    referrer: document.referrer || null,
    contentType: document.contentType || null,
  });

  const captureEntry = (el, sequence) => {
    const rect = geometry(el);
    const text = trimText(el.innerText || el.textContent, 250);
    const value = trimText(el.value, 220);
    const title = trimText(el.getAttribute("title"), 220);
    const alt = trimText(el.getAttribute("alt"), 220);
    const role = attr(el, "role");
    const type = attr(el, "type");
    const testId =
      attr(el, "data-testid") ||
      attr(el, "data-test") ||
      attr(el, "data-cy") ||
      attr(el, "data-qa");
    const component = frameworkInfo(el);
    const root = componentRoot(el);
    const breadcrumb = domBreadcrumb(el);
    const selector = cssPath(el);
    const interactions = interactionStates(el);
    const nodeRelation = relation(el);

    return {
      schema: "selector-capture-entry",
      version: 3,
      sequence: sequence,
      capturedAt: new Date().toISOString(),
      page: pageContext(),
      selectors: {
        compact: compactTarget(el),
        css: selector,
        xpath: xpath(el),
        jsPath: jsPath(el),
        domPath: breadcrumb.map((item) => item.compact),
        siblingIndex: nodeRelation.siblingIndex,
        nodeIndex: nodeRelation.nodeIndex,
        id: el.id || null,
        classes: el.classList ? Array.from(el.classList).slice(0, 16) : [],
        dataIds:
          attr(el, "data-testid") ||
          attr(el, "data-test") ||
          attr(el, "data-cy") ||
          attr(el, "data-qa"),
      },
      componentRoot: root,
      component: component,
      element: {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: el.classList ? Array.from(el.classList).slice(0, 12) : [],
        name: attr(el, "name") || null,
        testId: testId || null,
        role: role || null,
        type: type || null,
        title: title || null,
        alt: alt || null,
        href: attr(el, "href") || null,
        src: attr(el, "src") || null,
        target: attr(el, "target") || null,
        placeholder: attr(el, "placeholder") || null,
        aria: ariaAttributes(el),
        value: value || null,
        text: text || null,
        accessibleName: accessibleName(el) || null,
        accessibility: accessibility(el),
        isInteractive:
          el.tabIndex >= 0 ||
          el.closest("a,button,input,textarea,select,option,label,summary") !== null ||
          role === "button" ||
          role === "link" ||
          role === "textbox",
        isEditable: el.isContentEditable || ["INPUT", "TEXTAREA"].includes(el.tagName),
        isDisabled: el.hasAttribute("disabled") || attr(el, "aria-disabled") === "true",
        isRequired: el.required === true || attr(el, "aria-required") === "true",
        validation: {
          minLength: toPositiveInt(safeCall(() => el.minLength, null)),
          maxLength: toPositiveInt(safeCall(() => el.maxLength, null)),
          min: trimText(safeCall(() => el.min, ""), 40),
          max: trimText(safeCall(() => el.max, ""), 40),
        },
        relation: nodeRelation,
        dataset: dataAttributes(el),
        attrs: attributeSet(el),
        outerHTML: trimText(el.outerHTML, MAX_SNIPPET),
        outerHTMLLength: el.outerHTML ? el.outerHTML.length : 0,
        rect: rect.viewportRect,
        bounds: rect,
      },
      styles: {
        computed: styleSnapshot(el),
        matchedRules: collectMatchedRules(el),
      },
      states: interactions,
      events: eventHandlers(el),
      domBreadcrumb: breadcrumb,
      notes: {
        url: location.href,
      },
      feedback: "",
    };
  };

  const host = document.createElement("div");
  host.id = "__selector_capture_mode_panel";
  host.style.all = "initial";
  host.style.position = "fixed";
  host.style.zIndex = "2147483647";
  document.documentElement.appendChild(host);

  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>
      :host { all: initial; }
      .panel {
        position: fixed;
        top: 14px;
        right: 14px;
        width: min(520px, calc(100vw - 28px));
        height: min(640px, calc(100vh - 28px));
        display: grid;
        grid-template-rows: auto 1fr auto;
        background: #ffffff;
        border: 1px solid #c8d0dc;
        border-radius: 8px;
        box-shadow: 0 18px 48px rgba(15, 23, 42, 0.24);
        color: #172033;
        font: 13px/1.35 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        overflow: hidden;
      }
      .panel.minimized {
        height: auto;
        grid-template-rows: auto;
      }
      .panel.hidden {
        display: none;
      }
      .panel.minimized .body,
      .panel.minimized .footer {
        display: none;
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #f5f7fb;
        border-bottom: 1px solid #d8dee9;
      }
      .title {
        min-width: 0;
        flex: 1;
        font-weight: 700;
        color: #172033;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .hint {
        color: #526071;
        font-size: 12px;
      }
      .body {
        display: grid;
        min-height: 0;
      }
      textarea {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        resize: none;
        border: 0;
        outline: 0;
        padding: 10px;
        color: #111827;
        background: #ffffff;
        font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      }
      .footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-top: 1px solid #d8dee9;
        background: #f9fafc;
      }
      button {
        min-height: 30px;
        border: 1px solid #b8c2d1;
        border-radius: 6px;
        background: #ffffff;
        color: #172033;
        font: 600 12px/1 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 0 10px;
        cursor: pointer;
      }
      button.primary {
        background: #1457d9;
        border-color: #1457d9;
        color: #ffffff;
      }
      button.icon {
        width: 30px;
        padding: 0;
      }
      .status {
        min-width: 0;
        flex: 1;
        color: #526071;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    </style>
    <section class="panel hidden" aria-label="Selector Capture Mode">
      <div class="bar">
        <div>
          <div class="title">Selector Capture Mode</div>
          <div class="hint">Alt+Click any element to append one JSONL line.</div>
        </div>
        <button class="icon" type="button" data-action="minimize" title="Minimize">_</button>
        <button class="icon" type="button" data-action="hide" title="Hide">x</button>
      </div>
      <div class="body">
        <textarea spellcheck="true" aria-label="Captured selector notes" placeholder='{"schema":"selector-capture-entry"...}'></textarea>
      </div>
      <div class="footer">
        <button class="primary" type="button" data-action="copy">Copy all</button>
        <button type="button" data-action="clear">Clear</button>
        <div class="status">Ready</div>
      </div>
    </section>
  `;

  const panel = root.querySelector(".panel");
  const textarea = root.querySelector("textarea");
  const status = root.querySelector(".status");

  textarea.value = localStorage.getItem(STORE_KEY) || "";

  const setStatus = (message) => {
    status.textContent = message;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => {
      status.textContent = "Ready";
    }, 1800);
  };

  const showPanel = () => {
    panel.classList.remove("hidden");
    panel.classList.remove("minimized");
    textarea.focus({ preventScroll: true });
  };

  const save = () => localStorage.setItem(STORE_KEY, textarea.value);

  const entryNumber = () => {
    if (!textarea.value) return 1;
    const trimmed = textarea.value.replace(/\r?\n$/, "");
    if (!trimmed) return 1;
    return trimmed.split("\n").filter(Boolean).length + 1;
  };

  const appendBlock = (entry) => {
    const block = asJson(entry);
    const prefix = textarea.value ? "\n" : "";
    const insertAt = textarea.value.length;
    textarea.value = `${textarea.value}${prefix}${block}\n`;
    save();

    const marker = '"feedback":"';
    const markerStart = textarea.value.indexOf(marker, insertAt);
    const cursor =
      markerStart >= 0 ? markerStart + marker.length : textarea.value.length;
    textarea.focus({ preventScroll: true });
    textarea.setSelectionRange(cursor, cursor);
  };

  const flashTarget = (el) => {
    const rect = el.getBoundingClientRect();
    const ring = document.createElement("div");
    ring.style.cssText = [
      "position:fixed",
      `left:${Math.max(0, rect.left - 3)}px`,
      `top:${Math.max(0, rect.top - 3)}px`,
      `width:${Math.max(0, rect.width + 6)}px`,
      `height:${Math.max(0, rect.height + 6)}px`,
      "z-index:2147483646",
      "pointer-events:none",
      "border:3px solid #1457d9",
      "border-radius:6px",
      "box-shadow:0 0 0 3px rgba(20,87,217,.2)",
    ].join(";");
    document.documentElement.appendChild(ring);
    window.setTimeout(() => ring.remove(), 700);
  };

  const isPanelEvent = (event) => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    return path.includes(host) || path.includes(root);
  };

  const onCaptureClick = (event) => {
    if (!event.altKey || isPanelEvent(event)) return;
    event.preventDefault();
    event.stopPropagation();

    const el = event.target;
    if (!(el instanceof Element)) return;

    showPanel();
    appendBlock(captureEntry(el, entryNumber()));
    flashTarget(el);
    setStatus("Captured " + compactTarget(el));
  };

  const onTextareaInput = () => save();

  const copyAll = async () => {
    const payload = textarea.value.endsWith("\n") ? textarea.value : `${textarea.value}\n`;
    textarea.focus({ preventScroll: true });
    textarea.select();
    try {
      await navigator.clipboard.writeText(payload);
      setStatus("Copied notes JSONL");
    } catch {
      document.execCommand("copy");
      setStatus("Copied selected notes");
    }
  };

  const destroy = () => {
    document.removeEventListener("click", onCaptureClick, true);
    textarea.removeEventListener("input", onTextareaInput);
    host.remove();
    delete window[KEY];
  };

  root.addEventListener("click", (event) => {
    const action = event.target && event.target.getAttribute("data-action");
    if (!action) return;

    if (action === "copy") {
      void copyAll();
      return;
    }

    if (action === "clear" && confirm("Clear captured selector notes for this page?")) {
      textarea.value = "";
      save();
      textarea.focus();
      setStatus("Cleared");
      return;
    }

    if (action === "minimize") panel.classList.toggle("minimized");
    if (action === "hide") panel.classList.add("hidden");
  });

  textarea.addEventListener("input", onTextareaInput);
  document.addEventListener("click", onCaptureClick, true);

  window[KEY] = { destroy };
  setStatus("Capture mode on (Alt+Click bootstrap)");
  if (textarea.value.trim().length > 0) showPanel();
})(); 
