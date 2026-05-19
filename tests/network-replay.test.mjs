import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeUrl,
  redactHeaders,
  fingerprint,
  recordEntry,
  buildReplayIndex,
  matchRequest,
  installNetworkReplay,
  summarizeStats,
} from "../src/network-capture.mjs";

// --- recording --------------------------------------------------------------

test("recordEntry shapes a network JSONL line with redacted headers", () => {
  const entry = recordEntry({
    method: "post",
    url: "https://api.example.com/users",
    requestBody: '{"name":"alice"}',
    response: {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret-token",
        "Set-Cookie": "sid=abc",
      },
      body: '{"id":1,"name":"alice"}',
    },
  });

  assert.equal(entry.type, "network");
  assert.equal(entry.method, "POST");
  assert.equal(entry.response.status, 201);
  assert.equal(entry.response.headers.Authorization, "[redacted]");
  assert.equal(entry.response.headers["Set-Cookie"], "[redacted]");
  assert.equal(entry.response.headers["Content-Type"], "application/json");
  assert.equal(entry.response.body, '{"id":1,"name":"alice"}');
  assert.equal(entry.response.bodyTruncated, false);
});

test("recordEntry truncates oversized response bodies and flags it", () => {
  const big = "x".repeat(64 * 1024 + 500);
  const entry = recordEntry({
    method: "GET",
    url: "https://api.example.com/big",
    response: { status: 200, body: big },
  });
  assert.equal(entry.response.body.length, 64 * 1024);
  assert.equal(entry.response.bodyTruncated, true);
});

// --- fingerprint + index ----------------------------------------------------

test("fingerprint is method+URL with query params sorted for stable matching", () => {
  const a = fingerprint({ method: "GET", url: "https://x.test/api?b=2&a=1" });
  const b = fingerprint({ method: "get", url: "https://x.test/api?a=1&b=2" });
  assert.equal(a, b);
});

test("fingerprint drops fragment but keeps path identity", () => {
  const a = fingerprint({ method: "GET", url: "https://x.test/api#section" });
  const b = fingerprint({ method: "GET", url: "https://x.test/api" });
  const c = fingerprint({ method: "GET", url: "https://x.test/other" });
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test("buildReplayIndex skips non-network entries silently", () => {
  const entries = [
    { type: "click", selector: "#go" },
    recordEntry({ method: "GET", url: "https://x.test/a", response: { status: 200, body: "a" } }),
    { type: "input", selector: "input", value: "hi" },
    recordEntry({ method: "GET", url: "https://x.test/b", response: { status: 200, body: "b" } }),
  ];
  const idx = buildReplayIndex(entries);
  assert.equal(idx.size, 2);
});

// --- matching ---------------------------------------------------------------

test("matchRequest returns the recorded response for a captured fingerprint", () => {
  const entries = [
    recordEntry({
      method: "GET",
      url: "https://api.example.com/users/1",
      response: { status: 200, body: '{"id":1}' },
    }),
  ];
  const idx = buildReplayIndex(entries);
  const hit = matchRequest(idx, { method: "GET", url: "https://api.example.com/users/1" });
  assert.equal(hit.response.body, '{"id":1}');
});

test("matchRequest returns null for an unrecorded request", () => {
  const idx = buildReplayIndex([
    recordEntry({ method: "GET", url: "https://api.example.com/a", response: { status: 200, body: "a" } }),
  ]);
  const hit = matchRequest(idx, { method: "GET", url: "https://api.example.com/missing" });
  assert.equal(hit, null);
});

// --- installNetworkReplay (mock page) ---------------------------------------

function mockPage() {
  let handler = null;
  return {
    async route(pattern, fn) {
      handler = fn;
    },
    async dispatch(req) {
      let fulfilled = null;
      let aborted = null;
      let continued = false;
      const route = {
        request: () => ({ url: () => req.url, method: () => req.method }),
        fulfill: async (r) => { fulfilled = r; },
        abort: async (reason) => { aborted = reason; },
        continue: async () => { continued = true; },
      };
      const request = { url: () => req.url, method: () => req.method };
      await handler(route, request);
      return { fulfilled, aborted, continued };
    },
  };
}

test("installNetworkReplay serves recorded body to a matching request and does NOT hit the live URL", async () => {
  const page = mockPage();
  const entries = [
    recordEntry({
      method: "GET",
      url: "https://api.live.example.com/users/1",
      response: { status: 200, headers: { "Content-Type": "application/json" }, body: '{"id":1,"mocked":true}' },
    }),
  ];
  const stats = await installNetworkReplay(page, entries);

  const out = await page.dispatch({ method: "GET", url: "https://api.live.example.com/users/1" });
  assert.equal(out.fulfilled.status, 200);
  assert.equal(out.fulfilled.body, '{"id":1,"mocked":true}');
  assert.equal(out.continued, false, "must not pass through to live network");
  assert.equal(stats.matched, 1);
  assert.equal(stats.missed, 0);
});

test("installNetworkReplay onMiss=fail aborts unrecorded requests so live calls cannot leak", async () => {
  const page = mockPage();
  const entries = [
    recordEntry({ method: "GET", url: "https://api.test/recorded", response: { status: 200, body: "ok" } }),
  ];
  const stats = await installNetworkReplay(page, entries, { onMiss: "fail" });

  const out = await page.dispatch({ method: "GET", url: "https://api.test/never-recorded" });
  assert.equal(out.aborted, "failed");
  assert.equal(out.fulfilled, null);
  assert.equal(stats.missed, 1);
});

test("installNetworkReplay onMiss=passthrough continues unrecorded requests", async () => {
  const page = mockPage();
  await installNetworkReplay(page, [], { onMiss: "passthrough" });
  const out = await page.dispatch({ method: "GET", url: "https://anything.test/x" });
  assert.equal(out.continued, true);
  assert.equal(out.fulfilled, null);
});

test("installNetworkReplay rejects an adapter that does not expose route()", async () => {
  await assert.rejects(
    () => installNetworkReplay({}, []),
    /page\.route\(\) required/,
  );
});

test("summarizeStats reports matched/total and percentage", () => {
  assert.equal(
    summarizeStats({ matched: 3, missed: 1, served: [] }),
    "network replay: 3/4 requests served from capture (75%)",
  );
  assert.equal(
    summarizeStats({ matched: 0, missed: 0, served: [] }),
    "network replay: 0/0 requests served from capture (0%)",
  );
});

// --- helpers ----------------------------------------------------------------

test("normalizeUrl preserves opaque (non-URL) strings rather than throwing", () => {
  assert.equal(normalizeUrl("not a url"), "not a url");
});

test("redactHeaders is case-insensitive against the redact list", () => {
  const out = redactHeaders({ AUTHORIZATION: "x", cookie: "y", "X-Trace-Id": "keep" });
  assert.equal(out.AUTHORIZATION, "[redacted]");
  assert.equal(out.cookie, "[redacted]");
  assert.equal(out["X-Trace-Id"], "keep");
});
