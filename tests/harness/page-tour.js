// Page-side capture script for the framework tour. Loaded as a raw string
// and passed to Playwright's page.evaluate() to avoid TypeScript /
// tsx-injected helpers (`__name`) that the page context doesn't define.
//
// Receives: probes — Array<{selector, cap, label, custom?}>
// Returns:  Array<Capture> — {entry, page, source, probe}

(function (probes) {
  var cs = window.__pinchgrab;
  if (!cs) throw new Error('window.__pinchgrab missing');
  var captures = [];
  var seenEls = new Set();
  var seenSel = new Map();
  var pageCtx = cs.buildPageContext();
  function isHuge(r) {
    return r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9;
  }
  function capture(el, label) {
    if (seenEls.has(el)) return;
    seenEls.add(el);
    var r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (isHuge(r) && el !== document.documentElement && el !== document.body) return;
    if (el === document.body || el === document.documentElement) return;
    try {
      var entry = cs.captureEntry(el, cs.nextSeq());
      captures.push({entry: entry, page: pageCtx, source: 'probe', probe: label});
      seenSel.set(entry.selector, (seenSel.get(entry.selector) || 0) + 1);
    } catch (e) {
      captures.push({
        entry: {error: String(e && e.message || e), tag: el.tagName.toLowerCase()},
        page: pageCtx, source: 'probe', probe: label + '/THREW',
      });
    }
  }
  function collectAll(root) {
    var out = [];
    function walk(node) {
      try {
        var list = node.querySelectorAll('*');
        for (var i = 0; i < list.length; i++) {
          var el = list[i];
          out.push(el);
          var sr = el.shadowRoot;
          if (sr) walk(sr);
        }
      } catch (_) { /* ignore */ }
    }
    walk(root);
    return out;
  }
  var everyEl = collectAll(document);
  for (var pi = 0; pi < probes.length; pi++) {
    var p = probes[pi];
    if (p.custom === 'shadowHost') {
      for (var i = 0; i < everyEl.length; i++) {
        if (everyEl[i].shadowRoot) capture(everyEl[i], 'shadow-host');
      }
      continue;
    }
    if (p.custom === 'webComponent') {
      var ces = [];
      for (var j = 0; j < everyEl.length; j++) {
        if (everyEl[j].tagName.indexOf('-') !== -1) ces.push(everyEl[j]);
      }
      for (var k = 0; k < ces.length && k < 16; k++) capture(ces[k], 'custom-element');
      continue;
    }
    var nodes = [];
    try {
      var directs = document.querySelectorAll(p.selector);
      for (var d = 0; d < directs.length; d++) nodes.push(directs[d]);
      for (var s = 0; s < everyEl.length; s++) {
        var sr = everyEl[s].shadowRoot;
        if (!sr) continue;
        try {
          var sm = sr.querySelectorAll(p.selector);
          for (var smi = 0; smi < sm.length; smi++) nodes.push(sm[smi]);
        } catch (_) { /* selector invalid in scope */ }
      }
    } catch (_) {
      continue;
    }
    var taken = 0;
    for (var ni = 0; ni < nodes.length; ni++) {
      if (p.cap > 0 && taken >= p.cap) break;
      capture(nodes[ni], p.label);
      taken++;
    }
  }
  // Drag simulation — mirror pickDragCandidates + elementsInRect intent.
  try {
    var overlayHost = document.getElementById('__pinchgrab_overlay') || document.body;
    var allDrag = collectAll(document);
    var ww = window.innerWidth, wh = window.innerHeight;
    var x1 = Math.round(ww * 0.2), y1 = Math.round(wh * 0.2);
    var x2 = Math.round(ww * 0.8), y2 = Math.round(wh * 0.8);
    var inRect = [];
    for (var di = 0; di < allDrag.length; di++) {
      var el = allDrag[di];
      if (overlayHost.contains(el)) continue;
      var rd = el.getBoundingClientRect();
      if (rd.width === 0 || rd.height === 0) continue;
      if (rd.width > ww * 0.9 && rd.height > wh * 0.9) continue;
      if (rd.right >= x1 && rd.left <= x2 && rd.bottom >= y1 && rd.top <= y2) inRect.push(el);
    }
    var innermost = [];
    for (var ii = 0; ii < inRect.length; ii++) {
      var a = inRect[ii];
      var hasDescendant = false;
      for (var ij = 0; ij < inRect.length; ij++) {
        if (a !== inRect[ij] && a.contains(inRect[ij])) { hasDescendant = true; break; }
      }
      if (!hasDescendant) innermost.push(a);
      if (innermost.length >= 12) break;
    }
    for (var mi = 0; mi < innermost.length; mi++) {
      var de = innermost[mi];
      if (seenEls.has(de)) continue;
      seenEls.add(de);
      try {
        var entry2 = cs.captureEntry(de, cs.nextSeq());
        captures.push({entry: entry2, page: pageCtx, source: 'drag'});
        seenSel.set(entry2.selector, (seenSel.get(entry2.selector) || 0) + 1);
      } catch (_) { /* ignore */ }
    }
  } catch (_) { /* ignore drag-sim errors */ }
  return captures;
})
