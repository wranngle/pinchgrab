import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  researchCascadeViaLlmSh,
  getCachedCascade,
} from '../src/dynamicCascadeResearcher.js';

let tempDir: string;
let cachePath: string;
let llmShPath: string;
let originalCache: string | undefined;
let originalLlmSh: string | undefined;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'composio-cascade-test-'));
  cachePath = join(tempDir, 'cache.json');
  llmShPath = join(tempDir, 'llm.sh');
  originalCache = process.env.COMPOSIO_ORCH_CASCADE_CACHE;
  originalLlmSh = process.env.LLM_SH_PATH;
  process.env.COMPOSIO_ORCH_CASCADE_CACHE = cachePath;
  process.env.LLM_SH_PATH = llmShPath;
});

afterEach(() => {
  if (originalCache === undefined) delete process.env.COMPOSIO_ORCH_CASCADE_CACHE;
  else process.env.COMPOSIO_ORCH_CASCADE_CACHE = originalCache;
  if (originalLlmSh === undefined) delete process.env.LLM_SH_PATH;
  else process.env.LLM_SH_PATH = originalLlmSh;
  rmSync(tempDir, { recursive: true, force: true });
});

function writeFakeLlmSh(stdout: string, exitCode: number = 0): void {
  // Use single-quoted heredoc so bash treats `backticks`, $vars, etc. literally.
  const escaped = stdout.replace(/EOF/g, 'E0F');
  writeFileSync(llmShPath, `#!/usr/bin/env bash\ncat <<'__FAKE_LLM_SH_EOF__'\n${escaped}\n__FAKE_LLM_SH_EOF__\nexit ${exitCode}\n`);
  chmodSync(llmShPath, 0o755);
}

describe('dynamicCascadeResearcher', () => {
  it('returns undefined when llm.sh is missing', async () => {
    const result = await researchCascadeViaLlmSh('mystery-toolkit');
    expect(result).toBeUndefined();
  });

  it('parses + caches strict JSON', async () => {
    writeFakeLlmSh(JSON.stringify({
      toolkit: 'render',
      preferredOrder: ['native-sdk', 'composio-toolkit', 'raw-api'],
      localCli: null,
      nativeSdkPackage: '@render/sdk',
      notes: 'Render has no first-party CLI; SDK is best',
    }));
    const result = await researchCascadeViaLlmSh('render');
    expect(result).toBeDefined();
    expect(result?.preferredOrder).toEqual(['native-sdk', 'composio-toolkit', 'raw-api']);
    expect(result?.nativeSdkPackage).toBe('@render/sdk');
    expect(getCachedCascade('render')?.preferredOrder).toEqual(result?.preferredOrder);
  });

  it('extracts JSON even when wrapped in prose', async () => {
    writeFakeLlmSh('Here is the answer:\n```json\n{"toolkit":"x","preferredOrder":["raw-api"],"localCli":null,"nativeSdkPackage":null,"notes":"trivial"}\n```');
    const result = await researchCascadeViaLlmSh('x');
    expect(result?.preferredOrder).toEqual(['raw-api']);
  });

  it('returns undefined on llm.sh non-zero exit', async () => {
    writeFakeLlmSh('garbage', 1);
    const result = await researchCascadeViaLlmSh('failtest');
    expect(result).toBeUndefined();
  });

  it('returns undefined when JSON has no preferredOrder', async () => {
    writeFakeLlmSh(JSON.stringify({ toolkit: 'broke', localCli: null }));
    const result = await researchCascadeViaLlmSh('broke');
    expect(result).toBeUndefined();
  });

  it('cached result is returned without re-spawning llm.sh', async () => {
    writeFakeLlmSh(JSON.stringify({ toolkit: 'cachehit', preferredOrder: ['raw-api'], localCli: null, nativeSdkPackage: null, notes: '' }));
    await researchCascadeViaLlmSh('cachehit');
    // Make llm.sh now fail; cached value should still be returned.
    writeFakeLlmSh('garbage', 1);
    const result = await researchCascadeViaLlmSh('cachehit');
    expect(result?.preferredOrder).toEqual(['raw-api']);
  });
});
