import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('undici', () => ({ request: vi.fn() }));

import { request } from 'undici';
import { withMaskingDisabled, withMaskingEnabled, setTokenMasking } from '../src/dynamicMasking.js';

const mockRequest = request as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  process.env.COMPOSIO_API_KEY = 'test-key';
  mockRequest.mockReset();
});

afterEach(() => {
  mockRequest.mockReset();
});

function mockGet(maskingState: boolean): void {
  mockRequest.mockResolvedValueOnce({
    statusCode: 200,
    body: { json: async () => ({ mask_secret_keys_in_connected_account: maskingState }) },
  });
}

function mockPatchOk(): void {
  mockRequest.mockResolvedValueOnce({ statusCode: 200, body: { text: async () => '' } });
}

describe('dynamicMasking', () => {
  it('withMaskingDisabled flips off then restores when previous was true', async () => {
    mockGet(true);          // initial state read
    mockPatchOk();          // PATCH off
    mockPatchOk();          // PATCH back on (restore)
    const result = await withMaskingDisabled(async () => 'work-done');
    expect(result).toBe('work-done');
    expect(mockRequest).toHaveBeenCalledTimes(3);
  });

  it('withMaskingDisabled is a no-op when masking already off', async () => {
    mockGet(false);
    const result = await withMaskingDisabled(async () => 'ok');
    expect(result).toBe('ok');
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it('withMaskingEnabled flips on then restores when previous was false', async () => {
    mockGet(false);
    mockPatchOk();
    mockPatchOk();
    await withMaskingEnabled(async () => undefined);
    expect(mockRequest).toHaveBeenCalledTimes(3);
  });

  it('setTokenMasking returns alreadyAtState when no change needed', async () => {
    mockGet(false);
    const result = await setTokenMasking(false);
    expect(result.alreadyAtState).toBe(true);
  });

  it('restores masking even if fn throws', async () => {
    mockGet(true);
    mockPatchOk();
    mockPatchOk();
    await expect(withMaskingDisabled(async () => { throw new Error('boom'); })).rejects.toThrow('boom');
    expect(mockRequest).toHaveBeenCalledTimes(3);
  });
});
