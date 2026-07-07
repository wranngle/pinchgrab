// Per-page snapshot bundling (item 18-BUNDLE).
//
// The panel provides, per page, a PageSnapshot:
//   { url, title, capturedAt, viewport:{width,height}, scrollWidth,
//     scrollHeight, devicePixelRatio, lang, screenshot /* PNG data URL */,
//     partial? }
//
// For each page we emit two tar entries:
//   <page-slug>/page.png   — the screenshot data URL decoded to PNG bytes
//   <page-slug>/page.json  — the metadata WITHOUT the giant screenshot
//                            string (plus `screenshot: "page.png"` pointer
//                            when a PNG was written)
//
// Tolerant of absent/older data: a missing snapshot, a missing screenshot,
// or a malformed data URL degrades gracefully (the JSON is still written;
// the PNG is simply skipped). Output is deterministic for a given input.
//
// Returns TarEntry-shaped objects ({name, data}) so the caller can spread
// them straight into the panel's tar entry list. PNG entries carry a
// Uint8Array; JSON entries carry a string.
//
// Exports:
//   pageSlug(snapshot, index?)            -> string
//   dataUrlToPngBytes(dataUrl)            -> Uint8Array
//   pageMetadata(snapshot, hasPng)        -> object (no screenshot string)
//   buildPageEntries(snapshots)           -> TarEntry[]

// Slugify a URL into a short, filesystem-safe directory name. We base the
// slug on host + pathname so multiple captured pages on the same site stay
// distinguishable, and append the 1-based index to guarantee uniqueness
// even when two snapshots share a URL (re-capture of the same page).
export const pageSlug = (snapshot, index = 0) => {
  const raw = snapshot && typeof snapshot.url === "string" ? snapshot.url : "";
  let host = "";
  let path = "";
  try {
    const u = new URL(raw);
    host = u.host;
    path = u.pathname;
  } catch {
    // Not a parseable URL (about:blank, file://, empty) — slug the raw.
    path = raw;
  }
  const base = `${host}${path}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const stem = base || "page";
  // Index suffix keeps two captures of the same URL from colliding.
  return `${stem}-${index + 1}`;
};

// Decode a `data:image/png;base64,...` URL into raw PNG bytes. Returns an
// empty Uint8Array on anything malformed (no comma, bad base64) so callers
// can treat "no bytes" as "skip the PNG".
export const dataUrlToPngBytes = (dataUrl) => {
  if (typeof dataUrl !== "string") return new Uint8Array();
  const comma = dataUrl.indexOf(",");
  if (comma < 0) return new Uint8Array();
  const b64 = dataUrl.slice(comma + 1);
  try {
    // atob exists in browsers and modern Node (>=16). Buffer is the Node
    // fallback for older runtimes / test environments without atob.
    if (typeof atob === "function") {
      const binary = atob(b64);
      const out = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
      return out;
    }
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(Buffer.from(b64, "base64"));
    }
  } catch {
    return new Uint8Array();
  }
  return new Uint8Array();
};

// Strip the screenshot string out of the snapshot for page.json. When a PNG
// was written we leave a `screenshot: "page.png"` relative pointer so the
// JSON still tells a consumer where the image is.
export const pageMetadata = (snapshot, hasPng) => {
  const out = {};
  if (!snapshot || typeof snapshot !== "object") return out;
  for (const [k, v] of Object.entries(snapshot)) {
    if (k === "screenshot") continue; // never embed the giant data URL
    out[k] = v;
  }
  out.screenshot = hasPng ? "page.png" : null;
  return out;
};

// Build the tar entries for every page snapshot. Skips entries that are not
// objects; always writes page.json; writes page.png only when the snapshot
// carries a decodable screenshot data URL.
export const buildPageEntries = (snapshots) => {
  const entries = [];
  if (!Array.isArray(snapshots)) return entries;
  snapshots.forEach((snapshot, index) => {
    if (!snapshot || typeof snapshot !== "object") return;
    const slug = pageSlug(snapshot, index);
    const png = dataUrlToPngBytes(snapshot.screenshot);
    const hasPng = png.length > 0;
    if (hasPng) {
      entries.push({ name: `${slug}/page.png`, data: png });
    }
    const meta = pageMetadata(snapshot, hasPng);
    entries.push({ name: `${slug}/page.json`, data: JSON.stringify(meta, null, 2) + "\n" });
  });
  return entries;
};
