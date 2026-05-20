import { describe, expect, it } from 'vitest';
import { validateSlug } from '../src/validateSlug.js';

describe('validateSlug', () => {
  it('accepts a normal slug', () => {
    expect(() => validateSlug('GREP')).not.toThrow();
  });

  it('rejects reserved LOCAL_ prefix', () => {
    expect(() => validateSlug('LOCAL_FOO')).toThrow(/reserved prefix/);
  });

  it('rejects reserved COMPOSIO_ prefix', () => {
    expect(() => validateSlug('COMPOSIO_BAR')).toThrow(/reserved prefix/);
  });

  it('rejects oversize final slug after toolkit prefix', () => {
    const longSlug = 'A'.repeat(60);
    expect(() => validateSlug(longSlug, 'DEV_TOOLS')).toThrow(/too long/);
  });

  it('accepts a slug that just fits', () => {
    // LOCAL_ (6) + DEV_ (4) + slug (50) = 60 chars
    expect(() => validateSlug('A'.repeat(50), 'DEV')).not.toThrow();
  });
});
