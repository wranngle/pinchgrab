// Export-to-Downloads save contract (item 8).
//
// User ask: "Export and copy buttons should already have all files saved
// locally and just copy the path."
//
// A browser extension cannot write arbitrary filesystem paths — it writes
// through the Downloads API (chrome.downloads), which lands files under the
// user's Downloads folder and reports back the on-disk path. So the
// contract is: ON EXPORT, save the bundle via Downloads and return the
// resulting absolute path so the UI can copy it. (Pre-saving on every
// capture-change would re-download on each edit; save-on-export is the
// right cost.)
//
// This module owns the path-returning contract. The actual chrome.downloads
// call lives in the background worker; the panel injects a `save` function
// (its sendToBg bridge) so this layer stays testable without Chrome. The
// background reply shape we normalize against is SaveReply (src/types.ts):
//   { ok, filename?, absPath?, copyPath?, tempPath?, error? }
//
// Manifest permission required: "downloads" (report to manifest owner; not
// edited here).
//
// Exports:
//   saveBundle(bytes, filename, { save, mime? }) -> Promise<SaveResult>
//   SaveResult = { ok, path?, copyPath?, filename?, tempPath?, error? }

const DEFAULT_MIME = "application/zstd";

// Normalize a background SaveReply into a stable SaveResult the UI copies
// from. `copyPath` is what the UI should put on the clipboard (the absolute
// path by default; backgrounds may override with a friendlier display
// path). `path` is the canonical absolute path.
const toResult = (reply) => {
  if (!reply || typeof reply !== "object") {
    return { ok: false, error: "no reply from background" };
  }
  if (!reply.ok) {
    return { ok: false, error: reply.error ?? "save failed" };
  }
  if (!reply.absPath) {
    return { ok: false, error: "background returned no path" };
  }
  return {
    ok: true,
    path: reply.absPath,
    copyPath: reply.copyPath ?? reply.absPath,
    filename: reply.filename ?? null,
    tempPath: Boolean(reply.tempPath),
  };
};

// Save the bundle bytes through the injected Downloads bridge and return
// the on-disk path. `save` is `(req) => Promise<SaveReply>`; the panel wires
// it to sendToBg({kind:'save-bytes', ...}). Bytes are serialized to a plain
// number[] because structured-clone of Uint8Array over chrome.runtime
// messaging isn't reliable across Chrome versions.
export const saveBundle = async (bytes, filename, opts = {}) => {
  const save = opts.save;
  if (typeof save !== "function") {
    throw new Error("saveBundle: opts.save bridge is required");
  }
  if (!filename) {
    throw new Error("saveBundle: filename is required");
  }
  const mime = opts.mime ?? DEFAULT_MIME;
  const byteArray =
    bytes instanceof Uint8Array
      ? Array.from(bytes)
      : Array.isArray(bytes)
        ? bytes
        : Array.from(new Uint8Array(bytes ?? []));
  let reply;
  try {
    reply = await save({
      kind: "save-bytes",
      filename,
      mime,
      bytes: byteArray,
      workspace: opts.workspace,
    });
  } catch (err) {
    return { ok: false, error: err?.message ?? String(err) };
  }
  return toResult(reply);
};
