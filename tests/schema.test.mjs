import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const schemaPath = resolve(root, "docs/capture-schema.json");
const samplePath = resolve(root, "docs/capture-sample.jsonl");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const sampleLines = readFileSync(samplePath, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`docs/capture-sample.jsonl line ${index + 1} is not valid JSON: ${error.message}`);
    }
  });

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

test("docs/capture-schema.json declares draft-07", () => {
  assert.equal(schema.$schema, "http://json-schema.org/draft-07/schema#");
  assert.equal(schema.type, "object");
});

test("docs/capture-schema.json is itself a valid JSON Schema (compiles under Ajv)", () => {
  assert.equal(typeof validate, "function");
});

test("docs/capture-sample.jsonl contains 3 capture lines", () => {
  assert.equal(sampleLines.length, 3);
});

test("every sample capture validates against the schema", () => {
  for (const [index, entry] of sampleLines.entries()) {
    const ok = validate(entry);
    if (!ok) {
      const detail = ajv.errorsText(validate.errors, { separator: "\n  " });
      assert.fail(`sample line ${index + 1} failed validation:\n  ${detail}`);
    }
  }
});

test("schema rejects a capture missing required top-level fields", () => {
  const ok = validate({ schema: "selector-capture-entry", version: 3 });
  assert.equal(ok, false);
  const missingPaths = (validate.errors || [])
    .filter((err) => err.keyword === "required")
    .map((err) => err.params.missingProperty);
  for (const required of ["sequence", "capturedAt", "page", "selectors", "element"]) {
    assert.ok(
      missingPaths.includes(required),
      `expected schema to flag missing '${required}', got: ${missingPaths.join(", ")}`,
    );
  }
});

test("schema rejects a wrong schema discriminator", () => {
  const entry = structuredClone(sampleLines[0]);
  entry.schema = "not-a-capture";
  assert.equal(validate(entry), false);
});
