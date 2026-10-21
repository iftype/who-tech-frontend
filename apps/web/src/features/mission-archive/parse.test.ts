import { describe, expect, it } from 'vitest';
import { parseMissionTab } from './parse';

describe('parseMissionTab', () => {
  it('should accept the three tabs and fall back to mission', () => {
    expect(parseMissionTab('mission')).toBe('mission');
    expect(parseMissionTab('common')).toBe('common');
    expect(parseMissionTab('pending')).toBe('pending');
    expect(parseMissionTab('done')).toBe('mission');
    expect(parseMissionTab(null)).toBe('mission');
    expect(parseMissionTab(undefined)).toBe('mission');
  });
});
