import { ComposioOrchError } from './errors.js';

const RESERVED_PREFIXES = ['LOCAL_', 'COMPOSIO_'];
const MAX_FINAL_SLUG_LENGTH = 60;
const SDK_LOCAL_PREFIX = 'LOCAL_';

export function validateSlug(slug: string, toolkitSlug?: string): void {
  if (!slug || typeof slug !== 'string') {
    throw new ComposioOrchError('SLUG', 'slug must be a non-empty string');
  }
  for (const prefix of RESERVED_PREFIXES) {
    if (slug.toUpperCase().startsWith(prefix)) {
      throw new ComposioOrchError('SLUG', `slug "${slug}" uses reserved prefix "${prefix}"`, {
        hint: `Drop the "${prefix}" — Composio adds it automatically`,
      });
    }
  }
  const finalPrefix = SDK_LOCAL_PREFIX + (toolkitSlug ? `${toolkitSlug.toUpperCase()}_` : '');
  const finalLength = finalPrefix.length + slug.length;
  if (finalLength > MAX_FINAL_SLUG_LENGTH) {
    const allowed = MAX_FINAL_SLUG_LENGTH - finalPrefix.length;
    throw new ComposioOrchError(
      'SLUG',
      `slug "${slug}" too long; final "${finalPrefix}${slug}" is ${finalLength} chars (max ${MAX_FINAL_SLUG_LENGTH})`,
      { hint: `Shorten the slug to at most ${allowed} characters` },
    );
  }
}
