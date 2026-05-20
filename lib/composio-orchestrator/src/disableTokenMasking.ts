// Thin wrapper retained for back-compat with the original CLI subcommand.
// New code should call setTokenMasking() / withMaskingDisabled() in
// dynamicMasking.ts directly.
import { setTokenMasking } from './dynamicMasking.js';

export async function disableTokenMasking(): Promise<{ alreadyDisabled: boolean }> {
  const result = await setTokenMasking(false);
  return { alreadyDisabled: result.alreadyAtState };
}
