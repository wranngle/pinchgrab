import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyWebhookSignature } from '../src/webhookSignature.js';

const SECRET = 'super-secret-key';

function signHeaderFor(rawBody: string): string {
  const sig = createHmac('sha256', SECRET).update(rawBody, 'utf8').digest('base64');
  return `v1,${sig}`;
}

describe('verifyWebhookSignature: HMAC verification', () => {
  it('accepts a valid v1 signature', () => {
    const body = JSON.stringify({ type: 'connection.activated', data: { connected_account_id: 'ca_1' } });
    const ok = verifyWebhookSignature({ rawBody: body, signatureHeader: signHeaderFor(body), secret: SECRET });
    expect(ok).toBe(true);
  });

  it('rejects a tampered body', () => {
    const original = '{"a":1}';
    const tampered = '{"a":2}';
    const ok = verifyWebhookSignature({ rawBody: tampered, signatureHeader: signHeaderFor(original), secret: SECRET });
    expect(ok).toBe(false);
  });

  it('rejects an unknown signature version', () => {
    const body = '{"x":1}';
    const sig = createHmac('sha256', SECRET).update(body).digest('base64');
    expect(verifyWebhookSignature({ rawBody: body, signatureHeader: `v2,${sig}`, secret: SECRET })).toBe(false);
  });

  it('rejects when header is missing', () => {
    expect(verifyWebhookSignature({ rawBody: '{}', signatureHeader: undefined, secret: SECRET })).toBe(false);
  });

  it('rejects malformed base64', () => {
    expect(verifyWebhookSignature({ rawBody: '{}', signatureHeader: 'v1,not-a-hash', secret: SECRET })).toBe(false);
  });
});

describe('verifyWebhookSignature: timestamp window blocks replays', () => {
  const REPLAY_SECRET = 'whsec_test';
  const rawBody = JSON.stringify({ event: 'composio.connected_account.expired' });
  const goodSig = `v1,${createHmac('sha256', REPLAY_SECRET).update(rawBody, 'utf8').digest('base64')}`;

  it('accepts a payload signed within the 300s tolerance window', () => {
    const now = new Date('2026-05-13T00:00:00Z');
    const tsHeader = String(Math.floor(now.getTime() / 1000) - 60);
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET, timestampHeader: tsHeader, now })).toBe(true);
  });

  it('rejects a 30-day-old captured payload+signature even with valid HMAC', () => {
    const now = new Date('2026-05-13T00:00:00Z');
    const tsHeader = String(Math.floor(new Date('2026-04-13T00:00:00Z').getTime() / 1000));
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET, timestampHeader: tsHeader, now })).toBe(false);
  });

  it('rejects a future-dated payload outside tolerance', () => {
    const now = new Date('2026-05-13T00:00:00Z');
    const tsHeader = String(Math.floor(now.getTime() / 1000) + 3600);
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET, timestampHeader: tsHeader, now })).toBe(false);
  });

  it('rejects a malformed timestamp', () => {
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET, timestampHeader: 'not-a-number' })).toBe(false);
  });

  it('accepts millisecond-precision timestamps', () => {
    const now = new Date('2026-05-13T00:00:00Z');
    const tsHeader = String(now.getTime() - 30_000);
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET, timestampHeader: tsHeader, now })).toBe(true);
  });

  it('falls back to no-tolerance check when timestampHeader is omitted (backwards-compat)', () => {
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET })).toBe(true);
  });

  it('honors caller-supplied custom tolerance', () => {
    const now = new Date('2026-05-13T00:00:00Z');
    const tsHeader = String(Math.floor(now.getTime() / 1000) - 120);
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET, timestampHeader: tsHeader, toleranceSeconds: 60, now })).toBe(false);
    expect(verifyWebhookSignature({ rawBody, signatureHeader: goodSig, secret: REPLAY_SECRET, timestampHeader: tsHeader, toleranceSeconds: 300, now })).toBe(true);
  });
});
