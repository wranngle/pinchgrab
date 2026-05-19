// --auth-state replay test — exercises the Playwright storageState
// handoff used by `pinchgrab replay --auth-state <storage.json>` so
// authenticated captures can be replayed against logged-in pages.
//
// What this test covers:
//   1. loadAuthState rejects every malformed-input shape with a clear
//      message (missing file, invalid JSON, non-object, missing both
//      cookies AND origins).
//   2. loadAuthState accepts the canonical Playwright storageState
//      shape (cookies-only, origins-only, and full).
//   3. End-to-end: a mock auth wall returns zero hits without an
//      auth-state file; with a valid auth-state loaded into the
//      replay context, the same fixture resolves all entries.
//
// The auth-wall mock is the testable equivalent of a 401-redirect
// flow: the page's locators only resolve when an authenticated
// storageState has been wired into the context.
//
// Run: `node tests/replay-auth.test.mjs`. Exits 0 on success.

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  authedPlaywrightAdapter,
  loadAuthState,
  parseCaptureJsonl,
  playwrightAdapter,
  replay,
} from "../src/replay.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(here, "fixtures/capture.jsonl");
const fixture = readFileSync(fixturePath, "utf-8");
const entries = parseCaptureJsonl(fixture);

const tmp = mkdtempSync(join(tmpdir(), "pinchgrab-auth-"));
const writeJson = (name, value) => {
  const p = join(tmp, name);
  writeFileSync(p, typeof value === "string" ? value : JSON.stringify(value));
  return p;
};

// ---- loadAuthState error paths -------------------------------------------
{
  assert.throws(
    () => loadAuthState(join(tmp, "does-not-exist.json")),
    /cannot read/,
    "missing file must throw 'cannot read'",
  );
  console.log("ok 1 - loadAuthState rejects missing file");
}

{
  const bad = writeJson("not-json.json", "this is not json {");
  assert.throws(() => loadAuthState(bad), /not valid JSON/);
  console.log("ok 2 - loadAuthState rejects invalid JSON");
}

{
  const arr = writeJson("array.json", []);
  assert.throws(() => loadAuthState(arr), /must be a JSON object/);
  const str = writeJson("string.json", '"hello"');
  assert.throws(() => loadAuthState(str), /must be a JSON object/);
  console.log("ok 3 - loadAuthState rejects non-object payloads");
}

{
  const empty = writeJson("empty.json", { foo: "bar" });
  assert.throws(
    () => loadAuthState(empty),
    /missing both 'cookies' and 'origins'/,
  );
  console.log("ok 4 - loadAuthState rejects shape missing cookies+origins");
}

// ---- loadAuthState happy paths --------------------------------------------
const cookieOnlyPath = writeJson("cookie-only.json", {
  cookies: [
    {
      name: "session",
      value: "abc123",
      domain: "example.com",
      path: "/",
      expires: -1,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    },
  ],
});

const originsOnlyPath = writeJson("origins-only.json", {
  origins: [
    {
      origin: "https://example.com",
      localStorage: [{ name: "auth_token", value: "xyz" }],
    },
  ],
});

const fullStatePath = writeJson("full.json", {
  cookies: [
    {
      name: "session",
      value: "abc123",
      domain: "example.com",
      path: "/",
    },
  ],
  origins: [
    {
      origin: "https://example.com",
      localStorage: [{ name: "auth_token", value: "xyz" }],
    },
  ],
});

{
  const loaded = loadAuthState(cookieOnlyPath);
  assert.equal(loaded.cookies.length, 1);
  assert.equal(loaded.cookies[0].name, "session");
  console.log("ok 5 - loadAuthState accepts cookies-only state");
}

{
  const loaded = loadAuthState(originsOnlyPath);
  assert.equal(loaded.origins.length, 1);
  assert.equal(loaded.origins[0].origin, "https://example.com");
  console.log("ok 6 - loadAuthState accepts origins-only state");
}

{
  const loaded = loadAuthState(fullStatePath);
  assert.equal(loaded.cookies.length, 1);
  assert.equal(loaded.origins.length, 1);
  console.log("ok 7 - loadAuthState accepts full cookies+origins state");
}

// ---- mock auth-wall: replay fails without auth, succeeds with auth --------
//
// A `mockBrowser` returns one of two pages depending on whether the
// context was constructed with a storageState. The "denied" page acts
// like a login-wall redirect: every locator resolves to zero hits
// (simulating that we landed on /login, not the captured target).
// The "authed" page resolves the captured CSS selectors.
//
// This mirrors the production wiring in `bin/pinchgrab`: the storage
// state, if present, is handed to `browser.newContext({ storageState })`
// before any locator runs. The mock asserts that wiring without paying
// for a real headless Chromium.

const buildMockBrowser = (validAuthState) => {
  const deniedPage = {
    locator: () => ({ count: async () => 0 }),
    getByRole: () => ({ count: async () => 0 }),
    goto: async () => {},
  };
  const authedPage = {
    locator: (sel) => ({
      count: async () => {
        const validCss = new Set([
          "button.btn.btn--primary",
          "input[data-testid='global-search']",
          "a.link-out",
        ]);
        return validCss.has(sel) ? 1 : 0;
      },
      first: () => ({ tag: "authed-match" }),
    }),
    getByRole: () => ({ count: async () => 0 }),
    goto: async () => {},
  };
  return {
    newContext: async (opts = {}) => {
      const authed =
        opts.storageState &&
        opts.storageState === validAuthState;
      return {
        newPage: async () => (authed ? authedPage : deniedPage),
        close: async () => {},
      };
    },
    close: async () => {},
  };
};

{
  const validState = loadAuthState(fullStatePath);
  const browser = buildMockBrowser(validState);

  // No auth-state — context built without storageState — page is the
  // denied login wall.
  const ctxNoAuth = await browser.newContext({});
  const pageNoAuth = await ctxNoAuth.newPage();
  await pageNoAuth.goto("https://example.com/dashboard");
  const noAuthSummary = await replay(playwrightAdapter(pageNoAuth), entries);
  assert.equal(noAuthSummary.found, 0, "without auth-state, every locator misses");
  assert.equal(noAuthSummary.total, 3);
  await ctxNoAuth.close();
  console.log("ok 8 - replay finds 0/3 against auth-walled page");

  // With auth-state — context built with valid storageState — page is
  // the authenticated target.
  const ctxAuth = await browser.newContext({ storageState: validState });
  const pageAuth = await ctxAuth.newPage();
  await pageAuth.goto("https://example.com/dashboard");
  const authSummary = await replay(authedPlaywrightAdapter(pageAuth), entries);
  assert.equal(authSummary.found, 3, "with auth-state, all locators resolve");
  assert.equal(authSummary.total, 3);
  for (const r of authSummary.results) {
    assert.equal(r.success, true);
    assert.equal(r.strategy, "css");
  }
  await ctxAuth.close();
  await browser.close();
  console.log("ok 9 - replay finds 3/3 with valid auth-state loaded");
}

// ---- stale auth-state behaves like no auth (regression guard) -------------
//
// If the storage-state file is well-formed but the cookies are stale
// (server has invalidated the session), the page still hits the auth
// wall. The mock browser only considers the storageState valid when
// it matches the canonical one — any other parsed-but-stale state is
// treated as denied. This guards the "expired session" scenario from
// silently masquerading as success.
{
  const stale = loadAuthState(cookieOnlyPath);
  const browser = buildMockBrowser(loadAuthState(fullStatePath));
  const ctx = await browser.newContext({ storageState: stale });
  const page = await ctx.newPage();
  await page.goto("https://example.com/dashboard");
  const summary = await replay(playwrightAdapter(page), entries);
  assert.equal(summary.found, 0, "stale auth-state must not silently pass");
  await ctx.close();
  await browser.close();
  console.log("ok 10 - replay finds 0/3 with stale auth-state");
}

rmSync(tmp, { recursive: true, force: true });
console.log("# all replay-auth tests passed");
