#!/usr/bin/env node
// Step annotator for pinchgrab JSONL capture streams.
//
// Adds an `annotation` field to a targeted capture entry, keyed by `sequence`
// (the 1-based step index emitted by `captureEntry()` — see PR #1
// docs/capture-schema.json). The capture schema is `additionalProperties:true`
// so the new field is non-breaking; downstream replay / exporter tools can
// ignore it or surface it as a recipe step caption.
//
// Two surfaces:
//   1. annotate(text, ops)              — pure in-memory transform
//   2. headlessRun({ inputPath, ops })  — file in / file or stdout out
//
// CLI:
//   node src/annotator.mjs --input capture.jsonl --note 2:"click upgrade" \
//     [--note 4:"verify modal"] [--output out.jsonl]
//   node src/annotator.mjs --input capture.jsonl --ops ops.json --output out.jsonl
//
// ops.json shape: [{"sequence":2,"annotation":"click upgrade"}, ...]

import { readFileSync, writeFileSync } from "node:fs";
import { argv, stdout, stderr, exit } from "node:process";
import { pathToFileURL } from "node:url";

const SCHEMA_ID = "selector-capture-entry";

const parseOps = (raw) => {
  if (!Array.isArray(raw)) throw new Error("ops must be an array");
  return raw.map((op, idx) => {
    if (!op || typeof op !== "object") throw new Error(`op[${idx}] must be an object`);
    const sequence = Number(op.sequence);
    if (!Number.isInteger(sequence) || sequence < 1) {
      throw new Error(`op[${idx}].sequence must be a positive integer`);
    }
    const annotation = op.annotation;
    if (typeof annotation !== "string") {
      throw new Error(`op[${idx}].annotation must be a string`);
    }
    return { sequence, annotation };
  });
};

const indexOps = (ops) => {
  const byStep = new Map();
  for (const op of ops) byStep.set(op.sequence, op.annotation);
  return byStep;
};

export const annotate = (jsonlText, opsInput) => {
  const ops = parseOps(opsInput);
  const byStep = indexOps(ops);
  const applied = new Set();
  const warnings = [];
  const outLines = [];
  const lines = String(jsonlText ?? "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      outLines.push(line);
      continue;
    }
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (err) {
      warnings.push(`line ${i + 1}: invalid JSON — passthrough (${err.message})`);
      outLines.push(line);
      continue;
    }
    if (entry && typeof entry === "object" && entry.schema === SCHEMA_ID) {
      const note = byStep.get(entry.sequence);
      if (typeof note === "string") {
        entry.annotation = note;
        applied.add(entry.sequence);
      }
    }
    outLines.push(JSON.stringify(entry));
  }
  const unapplied = [...byStep.keys()].filter((s) => !applied.has(s));
  return {
    jsonl: outLines.join("\n"),
    applied: [...applied].sort((a, b) => a - b),
    unapplied,
    warnings,
  };
};

export const headlessRun = ({ inputPath, ops, outputPath } = {}) => {
  if (!inputPath) throw new Error("inputPath is required");
  const text = readFileSync(inputPath, "utf-8");
  const result = annotate(text, ops);
  if (outputPath) writeFileSync(outputPath, result.jsonl);
  return result;
};

const parseCliNote = (raw) => {
  const colon = raw.indexOf(":");
  if (colon < 1) throw new Error(`--note expects "<sequence>:<text>", got "${raw}"`);
  const sequence = Number(raw.slice(0, colon));
  const annotation = raw.slice(colon + 1);
  return { sequence, annotation };
};

const parseArgs = (args) => {
  const out = { notes: [], opsPath: null, inputPath: null, outputPath: null };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = () => args[++i];
    if (arg === "--input" || arg === "-i") out.inputPath = next();
    else if (arg === "--output" || arg === "-o") out.outputPath = next();
    else if (arg === "--note" || arg === "-n") out.notes.push(parseCliNote(next()));
    else if (arg === "--ops") out.opsPath = next();
    else if (arg === "--help" || arg === "-h") out.help = true;
    else throw new Error(`unknown arg: ${arg}`);
  }
  return out;
};

const USAGE = `pinchgrab annotator — add per-step notes to a JSONL capture stream.

usage:
  node src/annotator.mjs --input <jsonl> [--output <jsonl>]
       (--note <seq>:<text> ...)
       [--ops <ops.json>]

flags:
  -i, --input    path to input .jsonl (required)
  -o, --output   path to output .jsonl (default: stdout)
  -n, --note     inline op, e.g. --note 2:"click upgrade" (repeatable)
      --ops      ops file (JSON array of {sequence,annotation})
  -h, --help     show this message
`;

const main = () => {
  let parsed;
  try {
    parsed = parseArgs(argv.slice(2));
  } catch (err) {
    stderr.write(`annotator: ${err.message}\n\n${USAGE}`);
    exit(2);
  }
  if (parsed.help || !parsed.inputPath) {
    stdout.write(USAGE);
    exit(parsed.help ? 0 : 2);
  }
  const ops = [...parsed.notes];
  if (parsed.opsPath) {
    const raw = JSON.parse(readFileSync(parsed.opsPath, "utf-8"));
    for (const op of raw) ops.push(op);
  }
  if (ops.length === 0) {
    stderr.write("annotator: at least one --note or --ops entry is required\n");
    exit(2);
  }
  try {
    const result = headlessRun({
      inputPath: parsed.inputPath,
      ops,
      outputPath: parsed.outputPath,
    });
    if (!parsed.outputPath) stdout.write(result.jsonl);
    for (const w of result.warnings) stderr.write(`warn: ${w}\n`);
    if (result.unapplied.length > 0) {
      stderr.write(`warn: no capture matched sequence(s): ${result.unapplied.join(", ")}\n`);
    }
  } catch (err) {
    stderr.write(`annotator: ${err.message}\n`);
    exit(1);
  }
};

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) main();
