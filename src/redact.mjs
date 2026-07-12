// PII redaction — layer 1 (text). Scrubs personally-identifying and secret
// strings out of exported capture text, accessible names, attribute values,
// and URLs BEFORE they leave the browser. Deterministic and dependency-free.
//
// Detectors are ordered most-specific-first so a token that could match two
// patterns (e.g. a JWT vs a generic long token) is labelled by the narrower
// one. Each replacement is a stable placeholder so an agent still sees THAT
// a value was present (and its kind) without seeing the value itself.
//
// Scope + honesty: this is the TEXT layer. Screenshot redaction (OCR / face
// masking) is a separate, larger layer (#44) not implemented here. This layer
// is gated by a versioned corpus (tests/redact.test.mjs) with per-category
// expectations so regressions are caught in CI.

const CC_RE = /\b(?:\d[ -]?){13,19}\b/g;

// Luhn check keeps the broad credit-card regex from redacting arbitrary long
// digit runs (order numbers, ids). Only sequences that checksum are masked.
const luhnValid = (digits) => {
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (d < 0 || d > 9) return false;
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
};

// [{name, re, replace}] applied in order. `replace` may be a string or a fn.
export const DETECTORS = [
  {name: 'jwt', re: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, replace: '[redacted-jwt]'},
  // Common vendor key/token shapes (OpenAI, Stripe, GitHub, AWS, Slack, Google).
  {name: 'api-key', re: /\b(?:sk-[A-Za-z0-9]{16,}|rk_[A-Za-z0-9]{16,}|pk_(?:live|test)_[A-Za-z0-9]{16,}|sk_(?:live|test)_[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,})\b/g, replace: '[redacted-key]'},
  {name: 'email', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replace: '[redacted-email]'},
  {name: 'ssn', re: /\b\d{3}-\d{2}-\d{4}\b/g, replace: '[redacted-ssn]'},
  {name: 'credit-card', re: CC_RE, replace: (m) => (luhnValid(m.replace(/[ -]/g, '')) ? '[redacted-cc]' : m)},
  // E.164-ish and common separated phone numbers (10-15 digits). Kept last
  // among number types so SSN/CC win their overlaps. Requires a `+` prefix
  // or an internal separator so bare digit runs (order ids, z-index values,
  // timestamps) are NOT mistaken for phone numbers.
  {name: 'phone', re: /(?<!\d)(?:\+\d{1,3}[ .-]?)?(?:\(\d{2,4}\)[ .-]?)?\d{2,4}[ .-]?\d{3,4}(?:[ .-]?\d{3,4})?(?!\d)/g, replace: (m) => {
    const digits = m.replace(/\D/g, '');
    const structured = m.startsWith('+') || /[ .()-]/.test(m);
    return (structured && digits.length >= 10 && digits.length <= 15) ? '[redacted-phone]' : m;
  }},
];

/** Redact PII/secrets from a free-text string. Returns the scrubbed string. */
export const redactText = (input) => {
  if (typeof input !== 'string' || !input) return input;
  let out = input;
  for (const d of DETECTORS) out = out.replace(d.re, d.replace);
  return out;
};

/** Redact secret/PII-looking query-string values from a URL, keeping keys. */
export const redactUrl = (url) => {
  if (typeof url !== 'string' || !url) return url;
  try {
    const u = new URL(url);
    for (const [k, v] of [...u.searchParams.entries()]) {
      const r = redactText(v);
      // Also mask values whose PARAM NAME implies a secret regardless of shape.
      if (r !== v) u.searchParams.set(k, r);
      else if (/(token|secret|key|password|pwd|auth|session|sig|signature)/i.test(k) && v) u.searchParams.set(k, '[redacted]');
    }
    return u.toString();
  } catch {
    return redactText(url);
  }
};

/** Redact a record of attribute values in place-safely (returns a new object). */
export const redactAttrs = (attrs) => {
  if (!attrs || typeof attrs !== 'object') return attrs;
  const out = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v !== 'string') { out[k] = v; continue; }
    // href/src can carry tokens in their query string.
    out[k] = (k === 'href' || k === 'src' || k === 'action') ? redactUrl(v) : redactText(v);
  }
  return out;
};

/** Did redaction change anything? Useful for a per-export diagnostic count. */
export const wouldRedact = (input) => typeof input === 'string' && redactText(input) !== input;
