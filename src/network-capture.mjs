// Records outbound XHR/fetch traffic during a capture session and replays the
// recorded responses against a target page so deterministic replays do not hit
// the live network. Built to slot in alongside the replay CLI shipped in #2:
// a capture JSONL line of type "network" carries the recorded entry, and the
// replay adapter consumes those entries through `installNetworkReplay`.
//
// The runtime adapter is duck-typed (anything with `route(pattern, handler)`
// works) so unit tests can exercise the matcher, fingerprinting, and body
// resolution paths without launching a browser.

const REDACT_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "proxy-authorization",
  "x-api-key",
  "x-auth-token",
]);

const MAX_BODY_BYTES = 64 * 1024;

export function normalizeUrl(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.length === 0) {
    throw new TypeError("normalizeUrl: url must be a non-empty string");
  }
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    return rawUrl;
  }
  const params = [...u.searchParams.entries()].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
  u.search = "";
  for (const [k, v] of params) u.searchParams.append(k, v);
  u.hash = "";
  return u.toString();
}

export function redactHeaders(headers) {
  const out = {};
  if (!headers || typeof headers !== "object") return out;
  for (const [k, v] of Object.entries(headers)) {
    out[k] = REDACT_HEADERS.has(k.toLowerCase()) ? "[redacted]" : v;
  }
  return out;
}

export function fingerprint(entry) {
  if (!entry || typeof entry !== "object") {
    throw new TypeError("fingerprint: entry must be an object");
  }
  const method = (entry.method || "GET").toUpperCase();
  const url = normalizeUrl(entry.url);
  return `${method} ${url}`;
}

export function recordEntry({ method, url, requestBody, response }) {
  if (!url) throw new TypeError("recordEntry: url required");
  const safeMethod = (method || "GET").toUpperCase();
  const body = truncateBody(response?.body ?? "");
  return {
    type: "network",
    method: safeMethod,
    url,
    requestBody: typeof requestBody === "string" ? truncateBody(requestBody) : null,
    response: {
      status: response?.status ?? 200,
      headers: redactHeaders(response?.headers ?? {}),
      body,
      bodyTruncated: (response?.body?.length ?? 0) > MAX_BODY_BYTES,
    },
    capturedAt: new Date().toISOString(),
  };
}

function truncateBody(body) {
  if (typeof body !== "string") return "";
  return body.length > MAX_BODY_BYTES ? body.slice(0, MAX_BODY_BYTES) : body;
}

export function buildReplayIndex(entries) {
  const index = new Map();
  for (const entry of entries) {
    if (!entry || entry.type !== "network") continue;
    const key = fingerprint(entry);
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(entry);
  }
  return index;
}

export function matchRequest(index, request) {
  const key = fingerprint(request);
  const bucket = index.get(key);
  if (!bucket || bucket.length === 0) return null;
  return bucket[0];
}

export async function installNetworkReplay(page, entries, options = {}) {
  if (!page || typeof page.route !== "function") {
    throw new TypeError("installNetworkReplay: page.route() required");
  }
  const onMiss = options.onMiss || "passthrough";
  if (!["passthrough", "fail", "log"].includes(onMiss)) {
    throw new TypeError(`installNetworkReplay: invalid onMiss=${onMiss}`);
  }

  const index = buildReplayIndex(entries);
  const stats = { matched: 0, missed: 0, served: [] };

  await page.route("**/*", async (route, request) => {
    const req = typeof request?.url === "function"
      ? { url: request.url(), method: request.method() }
      : { url: route.request().url(), method: route.request().method() };

    const hit = matchRequest(index, req);
    if (hit) {
      stats.matched += 1;
      stats.served.push({ url: req.url, status: hit.response.status });
      await route.fulfill({
        status: hit.response.status,
        headers: hit.response.headers,
        body: hit.response.body,
      });
      return;
    }

    stats.missed += 1;
    if (onMiss === "fail") {
      await route.abort("failed");
    } else if (onMiss === "log") {
      await route.continue();
    } else {
      await route.continue();
    }
  });

  return stats;
}

export function summarizeStats(stats) {
  const total = stats.matched + stats.missed;
  const pct = total === 0 ? 0 : Math.round((stats.matched / total) * 100);
  return `network replay: ${stats.matched}/${total} requests served from capture (${pct}%)`;
}
