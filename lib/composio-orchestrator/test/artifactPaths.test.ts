import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { resolveArtifactPath, resolveProjectRoot, resolveSystemArtifactDir } from '../src/artifactPaths.js';
import { appendJsonlEvent } from '../src/jsonlAppender.js';

let tempRoot: string;
let nestedDir: string;

beforeEach(() => {
  tempRoot = mkdtempSync(join(tmpdir(), 'artifact-paths-'));
  // Stamp a project-root marker so resolveProjectRoot has something to find.
  writeFileSync(join(tempRoot, 'package.json'), '{}');
  nestedDir = join(tempRoot, 'src', 'deeply', 'nested');
  mkdirSync(nestedDir, { recursive: true });
});

afterEach(() => {
  rmSync(tempRoot, { recursive: true, force: true });
});

describe('artifactPaths: project-root walk-up', () => {
  it('finds package.json from nested cwd', () => {
    expect(resolveProjectRoot(nestedDir)).toBe(tempRoot);
  });

  it('falls back to startDir when no marker exists', () => {
    const orphan = mkdtempSync(join(tmpdir(), 'orphan-'));
    expect(resolveProjectRoot(orphan)).toBe(orphan);
    rmSync(orphan, { recursive: true, force: true });
  });

  it('returns the markered ancestor even when started at it directly', () => {
    expect(resolveProjectRoot(tempRoot)).toBe(tempRoot);
  });
});

describe('artifactPaths: layout invariants', () => {
  it('builds <root>/.artifacts/<system>/<key>.jsonl by default', () => {
    const p = resolveArtifactPath({ projectRoot: tempRoot, system: 'composio', key: 'megatool-attach.agent_x' });
    expect(p).toBe(join(tempRoot, '.artifacts', 'composio', 'megatool-attach.agent_x.jsonl'));
  });

  it('creates the parent directory', () => {
    resolveArtifactPath({ projectRoot: tempRoot, system: 'composio', key: 'gateway-deploy.prod' });
    expect(existsSync(join(tempRoot, '.artifacts', 'composio'))).toBe(true);
  });

  it('honors a custom extension', () => {
    const p = resolveArtifactPath({ projectRoot: tempRoot, system: 'voice-evals', key: 'baseline.run_42', ext: 'wav' });
    expect(p.endsWith('baseline.run_42.wav')).toBe(true);
  });

  it('rejects non-kebab-case system names', () => {
    expect(() => resolveArtifactPath({ projectRoot: tempRoot, system: 'CompoSIO', key: 'x' })).toThrow(/kebab-case/);
    expect(() => resolveArtifactPath({ projectRoot: tempRoot, system: 'composio_orch', key: 'x' })).toThrow(/kebab-case/);
  });

  it('rejects keys with path-traversal characters', () => {
    expect(() => resolveArtifactPath({ projectRoot: tempRoot, system: 'composio', key: '../escape' })).toThrow();
    expect(() => resolveArtifactPath({ projectRoot: tempRoot, system: 'composio', key: 'sub/dir' })).toThrow();
  });

  it('resolveSystemArtifactDir returns the bare dir', () => {
    const d = resolveSystemArtifactDir('composio', tempRoot);
    expect(d).toBe(join(tempRoot, '.artifacts', 'composio'));
    expect(existsSync(d)).toBe(true);
  });
});

describe('jsonlAppender: ECS shape on every line', () => {
  it('appends valid JSON-per-line that parses cleanly', () => {
    const p = resolveArtifactPath({ projectRoot: tempRoot, system: 'composio', key: 'gateway-deploy.test' });
    appendJsonlEvent(p, { level: 'info', action: 'gateway.deploy', outcome: 'success', labels: { version: '1' } });
    appendJsonlEvent(p, { level: 'warn', action: 'gateway.retry', outcome: 'failure', errorMessage: 'rate limit' });
    const lines = readFileSync(p, 'utf8').trim().split('\n');
    expect(lines.length).toBe(2);
    for (const line of lines) {
      const e = JSON.parse(line);
      expect(e['@timestamp']).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(e['service.name']).toBe('composio-orchestrator');
      expect(e['event.id']).toMatch(/-\d+$/);
      expect(typeof e.labels).toBe('object');
    }
  });

  it('rejects file paths that do not end in .jsonl', () => {
    expect(() => appendJsonlEvent(join(tempRoot, 'foo.out'), { level: 'info', action: 'x', outcome: 'success' })).toThrow(/\.jsonl/);
    expect(() => appendJsonlEvent(join(tempRoot, 'foo.log'), { level: 'info', action: 'x', outcome: 'success' })).toThrow(/\.jsonl/);
  });
});
