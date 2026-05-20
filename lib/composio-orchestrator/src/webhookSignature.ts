import { createHmac, timingSafeEqual } from 'node:crypto';

// Composio v2/V3 webhook signatures: `webhook-signature: v1,<base64>` where
// payload is HMAC-SHA256(rawBody) keyed by the project webhook secret. Composio
// also sends `webhook-id` and `webhook-timestamp` headers; the docs specify a
// 300s tolerance window (configurable via `tolerance` here). When the caller
// supplies the timestamp header, replay is bounded by toleranceSeconds; when
// omitted, replay is unbounded — callers SHOULD always pass it.
//
// Ed25519 mode is documented but not yet wired here — flag for follow-up.

const DEFAULT_TOLERANCE_SECONDS = 300;

export function verifyWebhookSignature(args: {
  rawBody: string;
  signatureHeader: string | undefined;
  secret: string;
  timestampHeader?: string;
  toleranceSeconds?: number;
  now?: Date;
}): boolean {
  if (!args.signatureHeader) return false;
  const [version, providedSignatureBase64] = args.signatureHeader.split(',');
  if (version !== 'v1' || !providedSignatureBase64) return false;

  if (args.timestampHeader !== undefined) {
    const tolerance = args.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
    const ts = Number.parseInt(args.timestampHeader, 10);
    if (!Number.isFinite(ts)) return false;
    const nowMs = (args.now ?? new Date()).getTime();
    const tsMs = ts > 1e12 ? ts : ts * 1000;
    if (Math.abs(nowMs - tsMs) > tolerance * 1000) return false;
  }

  const expected = createHmac('sha256', args.secret).update(args.rawBody, 'utf8').digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(providedSignatureBase64, 'base64');
  } catch {
    return false;
  }
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
