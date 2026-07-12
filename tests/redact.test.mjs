// PII text-redaction corpus. Each row is (input → expected). This is the
// "pre-tested dataset" gate: adding a detector or tweaking a regex must keep
// every positive redacted and every negative untouched, or CI fails.
//
// Run: node --test tests/redact.test.mjs

import test from 'node:test';
import assert from 'node:assert';
import { redactText, redactUrl, redactAttrs, wouldRedact } from '../src/redact.mjs';

// ─── Positives: must be scrubbed ────────────────────────────────────────────
const POSITIVE = [
  ['email in prose', 'ping me at jane.doe+test@sub.example.co.uk please', '[redacted-email]'],
  ['bare email', 'root@localhost.dev', '[redacted-email]'],
  ['us ssn', 'SSN 123-45-6789 on file', '[redacted-ssn]'],
  ['visa (luhn-valid)', 'card 4242 4242 4242 4242', '[redacted-cc]'],
  ['amex (luhn-valid)', '3782 822463 10005', '[redacted-cc]'],
  ['jwt', 'auth eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.dQw4w9WgXcQ', '[redacted-jwt]'],
  ['openai key', 'OPENAI_API_KEY=sk-abcDEF012345678901234567', '[redacted-key]'],
  ['stripe key', 'sk_live_51HabcDEFghiJKLmnop0123', '[redacted-key]'],
  ['github token', 'ghp_16CharsAtLeastxxxxxxxxxxxxxxxxxxxx', '[redacted-key]'],
  ['aws access key', 'AKIAIOSFODNN7EXAMPLE here', '[redacted-key]'],
  ['phone e164', 'call +1 (415) 555-0132 today', '[redacted-phone]'],
  ['phone dashed', '415-555-0199', '[redacted-phone]'],
];

for (const [name, input, marker] of POSITIVE) {
  test(`redact positive: ${name}`, () => {
    const out = redactText(input);
    assert(out.includes(marker), `expected ${marker} in redaction of "${input}", got "${out}"`);
    assert.notStrictEqual(out, input, `redaction should change the input: "${out}"`);
    assert.strictEqual(wouldRedact(input), true);
  });
}

// ─── Negatives: must be left alone (avoid over-redaction) ────────────────────
const NEGATIVE = [
  ['plain sentence', 'The upgrade button contrast is too low on dark backgrounds.'],
  ['order id (not luhn)', 'order #1234567890123 shipped'],
  ['version + date', 'v1.2.0 released 2026-07-12'],
  ['css hex + rem', 'color #ff5f00; padding 1.5rem; z-index 2147483647'],
  ['short number', 'clicked item 42 in the list'],
  ['selector', 'button[data-testid="cta-upgrade"] main > section.pricing'],
];

for (const [name, input] of NEGATIVE) {
  test(`redact negative: ${name}`, () => {
    assert.strictEqual(redactText(input), input, `should not touch: "${input}"`);
    assert.strictEqual(wouldRedact(input), false);
  });
}

// ─── URL query-string redaction ─────────────────────────────────────────────
test('url: secret-named params masked, path kept', () => {
  const out = redactUrl('https://app.test/dash?token=abc123&user=jane&sig=deadbeef&page=2');
  assert(out.includes('token=%5Bredacted%5D') || out.includes('token=[redacted]'), out);
  assert(out.includes('sig=%5Bredacted%5D') || out.includes('sig=[redacted]'), out);
  assert(out.includes('page=2'), 'non-secret params survive');
});

test('url: email value in query masked by shape', () => {
  const out = redactUrl('https://x.test/verify?email=a@b.com&ref=home');
  assert(!out.includes('a@b.com'), out);
  assert(out.includes('ref=home'), out);
});

// ─── Attribute redaction ─────────────────────────────────────────────────────
test('attrs: href token scrubbed, class untouched', () => {
  const out = redactAttrs({class: 'btn btn--primary', href: 'https://x.test/go?token=sk-XYZ0123456789abcd', 'data-email': 'p@q.io'});
  assert.strictEqual(out.class, 'btn btn--primary');
  assert(!out.href.includes('sk-XYZ0123456789abcd'), out.href);
  assert.strictEqual(out['data-email'], '[redacted-email]');
});

// ─── Determinism ─────────────────────────────────────────────────────────────
test('deterministic: same input → same output', () => {
  const s = 'email jane@x.io key sk-abcDEF012345678901234567 ssn 111-22-3333';
  assert.strictEqual(redactText(s), redactText(s));
});
