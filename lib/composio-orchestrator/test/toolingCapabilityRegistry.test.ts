import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PREFERENCE_ORDER,
  TOOLKIT_CAPABILITIES,
  getCapability,
  getPreferredOrder,
} from '../src/toolingCapabilityRegistry.js';

describe('toolingCapabilityRegistry', () => {
  it('every entry uses lowercase slug', () => {
    for (const entry of TOOLKIT_CAPABILITIES) {
      expect(entry.toolkit).toBe(entry.toolkit.toLowerCase());
    }
  });

  it('every preferred order ends in raw-api OR provides MCP fallback', () => {
    for (const entry of TOOLKIT_CAPABILITIES) {
      const last = entry.preferredOrder[entry.preferredOrder.length - 1];
      expect(['raw-api', 'mcp', 'composio-toolkit', 'native-sdk']).toContain(last);
    }
  });

  it('getCapability returns default order for unknown toolkit', () => {
    const cap = getCapability('made-up-toolkit-xyz');
    expect(cap.preferredOrder).toEqual(DEFAULT_PREFERENCE_ORDER);
  });

  it('github prefers local CLI over composio toolkit', () => {
    const order = getPreferredOrder('github');
    expect(order.indexOf('local-cli')).toBeLessThan(order.indexOf('composio-toolkit'));
  });

  it('aws prefers local CLI over composio toolkit (do not break SSO chain)', () => {
    const order = getPreferredOrder('aws');
    expect(order[0]).toBe('local-cli');
    expect(order.indexOf('composio-toolkit')).toBeGreaterThan(order.indexOf('local-cli'));
  });
});
