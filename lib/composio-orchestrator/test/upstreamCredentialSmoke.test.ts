// Unit + integration coverage for the smoke-probe registry. Pure-classifier
// tests run unconditionally; the catalog-validation test is gated on
// COMPOSIO_API_KEY because it hits backend.composio.dev to confirm every
// registered slug still exists.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { request } from 'undici';
import { classifyExecuteResponse, smokeProbeUpstreamCredential, VERIFY_TOOLS_BY_TOOLKIT } from '../src/upstreamCredentialSmoke.js';

describe('classifyExecuteResponse', () => {
  it('treats successful=true as success', () => {
    expect(classifyExecuteResponse({ successful: true, data: {} })).toBe('success');
  });

  it('routes "Tool X not found" to registry-misconfig', () => {
    expect(classifyExecuteResponse({
      successful: false,
      error: 'Tool TAVILY_TAVILY_SEARCH not found',
      data: {},
    })).toBe('registry-misconfig');
  });

  it('routes 401/403 status_code to auth-failure', () => {
    expect(classifyExecuteResponse({
      successful: false,
      data: { status_code: 401, message: 'Invalid API Key' },
    })).toBe('auth-failure');
  });

  it('routes "Invalid API Key" body without status_code to auth-failure', () => {
    expect(classifyExecuteResponse({
      successful: false,
      error: { message: 'Failed to list models (HTTP 401): Invalid API Key' },
      data: {},
    })).toBe('auth-failure');
  });

  it('routes generic upstream errors to non-auth-failure', () => {
    expect(classifyExecuteResponse({
      successful: false,
      error: 'Quota exceeded',
      data: { status_code: 429 },
    })).toBe('non-auth-failure');
  });

  it('does NOT mistake a legit "user not found" upstream answer for a misconfig', () => {
    // upstream returning "no such user" is a non-auth failure, not a registry
    // misconfig; must NOT match the "tool .* not found" pattern.
    expect(classifyExecuteResponse({
      successful: false,
      error: 'github user not found',
      data: { status_code: 404 },
    })).toBe('non-auth-failure');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Strict mode: COMPOSIO_REQUIRE_SMOKE_PROBE flips the unregistered-toolkit
// answer from permissive (ok=true skipped) to fail-closed (ok=false skipped).
// ────────────────────────────────────────────────────────────────────────────
describe('smokeProbeUpstreamCredential: strict mode refuses to rubber-stamp unregistered toolkits', () => {
  let originalStrict: string | undefined;
  beforeEach(() => { originalStrict = process.env.COMPOSIO_REQUIRE_SMOKE_PROBE; });
  afterEach(() => {
    if (originalStrict === undefined) delete process.env.COMPOSIO_REQUIRE_SMOKE_PROBE;
    else process.env.COMPOSIO_REQUIRE_SMOKE_PROBE = originalStrict;
  });

  it('returns ok=true (permissive) for unregistered toolkit by default', async () => {
    delete process.env.COMPOSIO_REQUIRE_SMOKE_PROBE;
    const result = await smokeProbeUpstreamCredential({ toolkitSlug: 'stripe', userId: 'cody', connectedAccountId: 'ca_fake' });
    expect(result).toMatchObject({ ok: true, skipped: true });
  });

  it('returns ok=false for unregistered toolkit when COMPOSIO_REQUIRE_SMOKE_PROBE=true', async () => {
    process.env.COMPOSIO_REQUIRE_SMOKE_PROBE = 'true';
    const result = await smokeProbeUpstreamCredential({ toolkitSlug: 'stripe', userId: 'cody', connectedAccountId: 'ca_fake' });
    expect(result).toMatchObject({ ok: false, skipped: true });
  });
});

const HAS_KEY = Boolean(process.env.COMPOSIO_API_KEY);

describe.skipIf(!HAS_KEY)('VERIFY_TOOLS_BY_TOOLKIT — slugs exist in upstream catalog', () => {
  it.each(Object.entries(VERIFY_TOOLS_BY_TOOLKIT))(
    '%s -> %o',
    async (toolkitSlug, descriptor) => {
      const apiKey = process.env.COMPOSIO_API_KEY!;
      const url = `https://backend.composio.dev/api/v3.1/tools?toolkit_slug=${encodeURIComponent(toolkitSlug)}&limit=500`;
      const res = await request(url, { headers: { 'x-api-key': apiKey } });
      const body = (await res.body.json()) as { items?: Array<{ slug?: string }> };
      const slugs = (body.items ?? []).map((i) => i.slug);
      expect(slugs, `toolkit ${toolkitSlug} must list ${descriptor.toolSlug}`)
        .toContain(descriptor.toolSlug);
    },
    30_000,
  );
});

if (!HAS_KEY) {
  console.log('[smoke-registry] catalog-validation skipped — set COMPOSIO_API_KEY to run');
}
