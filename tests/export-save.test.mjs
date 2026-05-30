// Export-to-Downloads save contract tests (item 8).
//
// saveBundle writes bundle bytes through an injected Downloads bridge and
// returns the on-disk path the UI copies. The chrome.downloads call itself
// lives in the background worker; here we inject a fake `save` and assert
// the request shape + the normalized SaveResult.

import { strict as assert } from "node:assert";
import { test } from "node:test";

import { saveBundle } from "../src/export-save.mjs";

const bytes = new Uint8Array([1, 2, 3, 4]);

test("saveBundle: serializes bytes to number[] and returns the path", async () => {
  let seen;
  const save = async (req) => {
    seen = req;
    return { ok: true, filename: "export.tar.zst", absPath: "/home/u/Downloads/.pinchgrab/default/export.tar.zst" };
  };
  const res = await saveBundle(bytes, "export.tar.zst", { save });
  assert.equal(res.ok, true);
  assert.equal(res.path, "/home/u/Downloads/.pinchgrab/default/export.tar.zst");
  // copyPath defaults to the absolute path.
  assert.equal(res.copyPath, res.path);
  // request shape the background expects.
  assert.equal(seen.kind, "save-bytes");
  assert.equal(seen.filename, "export.tar.zst");
  assert.equal(seen.mime, "application/zstd");
  assert.ok(Array.isArray(seen.bytes), "bytes serialized to plain array");
  assert.deepEqual(seen.bytes, [1, 2, 3, 4]);
});

test("saveBundle: honors a background-supplied copyPath", async () => {
  const save = async () => ({ ok: true, absPath: "/abs/x.tar.zst", copyPath: "~/Downloads/x.tar.zst" });
  const res = await saveBundle(bytes, "x.tar.zst", { save });
  assert.equal(res.copyPath, "~/Downloads/x.tar.zst");
  assert.equal(res.path, "/abs/x.tar.zst");
});

test("saveBundle: surfaces a failed/empty reply as an error result", async () => {
  assert.deepEqual(await saveBundle(bytes, "x", { save: async () => ({ ok: false, error: "worker dead" }) }), { ok: false, error: "worker dead" });
  assert.deepEqual(await saveBundle(bytes, "x", { save: async () => ({ ok: true }) }), { ok: false, error: "background returned no path" });
  assert.deepEqual(await saveBundle(bytes, "x", { save: async () => null }), { ok: false, error: "no reply from background" });
});

test("saveBundle: catches a throwing bridge", async () => {
  const res = await saveBundle(bytes, "x", { save: async () => { throw new Error("boom"); } });
  assert.equal(res.ok, false);
  assert.equal(res.error, "boom");
});

test("saveBundle: requires a save bridge and a filename", async () => {
  await assert.rejects(() => saveBundle(bytes, "x", {}), /save bridge is required/);
  await assert.rejects(() => saveBundle(bytes, "", { save: async () => ({}) }), /filename is required/);
});

test("saveBundle: accepts an already-serialized number[]", async () => {
  let seen;
  const save = async (req) => { seen = req; return { ok: true, absPath: "/a" }; };
  await saveBundle([9, 8, 7], "x", { save });
  assert.deepEqual(seen.bytes, [9, 8, 7]);
});
