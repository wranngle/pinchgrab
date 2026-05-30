// Per-page snapshot bundling tests (item 18-BUNDLE).
//
// PageSnapshot -> <page-slug>/page.png + <page-slug>/page.json, with the
// giant screenshot data URL decoded into the PNG and stripped from the
// JSON. Must tolerate absent/older data.

import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  buildPageEntries,
  dataUrlToPngBytes,
  pageMetadata,
  pageSlug,
} from "../src/export-pages.mjs";

// A tiny but real PNG (1x1) as a data URL so decode produces actual bytes.
const PNG_1x1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const snapshot = {
  url: "https://app.example.com/settings/profile",
  title: "Profile",
  capturedAt: "2026-05-14T00:00:00.000Z",
  viewport: { width: 1280, height: 800 },
  scrollWidth: 1280,
  scrollHeight: 2400,
  devicePixelRatio: 2,
  lang: "en",
  screenshot: PNG_1x1,
  partial: false,
};

test("pageSlug: host+path based, index-suffixed, fs-safe", () => {
  assert.equal(pageSlug(snapshot, 0), "app-example-com-settings-profile-1");
  assert.equal(pageSlug({ url: "https://app.example.com/" }, 2), "app-example-com-3");
  assert.equal(pageSlug({ url: "about:blank" }, 0), "blank-1");
  assert.equal(pageSlug({}, 4), "page-5");
});

test("dataUrlToPngBytes: decodes a real PNG, empties on garbage", () => {
  const bytes = dataUrlToPngBytes(PNG_1x1);
  assert.ok(bytes.length > 0);
  // PNG magic: 89 50 4E 47
  assert.deepEqual([...bytes.slice(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  assert.equal(dataUrlToPngBytes("not-a-data-url").length, 0);
  assert.equal(dataUrlToPngBytes(undefined).length, 0);
});

test("pageMetadata: strips screenshot data URL, leaves pointer", () => {
  const meta = pageMetadata(snapshot, true);
  assert.equal(meta.screenshot, "page.png");
  assert.equal(meta.url, snapshot.url);
  assert.equal(meta.scrollHeight, 2400);
  assert.deepEqual(meta.viewport, { width: 1280, height: 800 });
  // The giant data URL must NOT survive into the JSON.
  assert.ok(!JSON.stringify(meta).includes("base64"));
});

test("pageMetadata: null screenshot pointer when no PNG written", () => {
  const meta = pageMetadata({ ...snapshot, screenshot: undefined }, false);
  assert.equal(meta.screenshot, null);
});

test("buildPageEntries: emits page.png + page.json per page", () => {
  const entries = buildPageEntries([snapshot]);
  assert.equal(entries.length, 2);
  const png = entries.find((e) => e.name.endsWith("/page.png"));
  const json = entries.find((e) => e.name.endsWith("/page.json"));
  assert.ok(png, "page.png written");
  assert.ok(json, "page.json written");
  assert.ok(png.data instanceof Uint8Array);
  assert.match(png.name, /^app-example-com-settings-profile-1\/page\.png$/);
  const meta = JSON.parse(json.data);
  assert.equal(meta.screenshot, "page.png");
});

test("buildPageEntries: tolerant of absent / older data", () => {
  // Absent snapshots entirely.
  assert.deepEqual(buildPageEntries(undefined), []);
  assert.deepEqual(buildPageEntries(null), []);
  // A page with no screenshot still gets page.json, no page.png.
  const noShot = buildPageEntries([{ url: "https://x.test/", title: "X" }]);
  assert.equal(noShot.length, 1);
  assert.ok(noShot[0].name.endsWith("/page.json"));
  const meta = JSON.parse(noShot[0].data);
  assert.equal(meta.screenshot, null);
  // Null/garbage entries in the array are skipped.
  assert.deepEqual(buildPageEntries([null, 42, "x"]), []);
});

test("buildPageEntries: two captures of same URL stay distinct", () => {
  const entries = buildPageEntries([snapshot, snapshot]);
  const dirs = entries.map((e) => e.name.split("/")[0]);
  assert.equal(new Set(dirs).size, 2, "slugs are unique per index");
});

test("buildPageEntries: deterministic", () => {
  const a = JSON.stringify(buildPageEntries([snapshot]).map((e) => ({ n: e.name, d: typeof e.data })));
  const b = JSON.stringify(buildPageEntries([snapshot]).map((e) => ({ n: e.name, d: typeof e.data })));
  assert.equal(a, b);
});
