import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { selectExecutionPath } from '../src/executionPathSelector.js';

describe('selectExecutionPath', () => {
  it('falls back to raw-api for an unknown toolkit when nothing else available', () => {
    const choice = selectExecutionPath({ toolkit: 'unknown-foo-bar', available: { composio: false, mcp: false } });
    expect(choice.path).toBe('raw-api');
    expect(choice.reason).toMatch(/raw HTTP/i);
  });

  it('returns composio-toolkit for an unknown toolkit when composio is available', () => {
    const choice = selectExecutionPath({ toolkit: 'unknown-foo-bar', available: { composio: true } });
    expect(choice.path).toBe('composio-toolkit');
  });

  it('respects toolkit-specific preference order (perplexityai → raw-api first)', () => {
    const choice = selectExecutionPath({ toolkit: 'perplexityai', available: { composio: true } });
    expect(choice.path).toBe('raw-api');
  });

  // Regression: spawnSync('command', ...) returns null because `command` is a
  // shell builtin, so the cascade silently bypassed local-cli for every
  // toolkit (gh, aws, gcloud, wrangler, docker). Detection must use a real
  // binary like `which`. Skip when neither `which` nor `gh` exist on the
  // sandbox, since this regression assumes a Unix-like dev env.
  const haveWhich = spawnSync('which', ['gh'], { stdio: 'pipe' }).status === 0;
  it.skipIf(!haveWhich)('detects authenticated github via local gh CLI', () => {
    const choice = selectExecutionPath({ toolkit: 'github', available: { composio: true } });
    // Either local-cli (when gh is present and authed) or composio-toolkit
    // (when gh is not authed). The bug we're guarding against is `composio-toolkit`
    // returned WHILE gh exists and is authed — i.e. regress to never picking local-cli.
    const ghAuthed = spawnSync('gh', ['auth', 'status'], { stdio: 'pipe' }).status === 0;
    if (ghAuthed) {
      expect(choice.path).toBe('local-cli');
    } else {
      expect(['local-cli', 'composio-toolkit']).toContain(choice.path);
    }
  });
});
