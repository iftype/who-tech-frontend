import { describe, expect, it } from 'vitest';
import { PROFILE_TABS, parseProfileTab } from './profileTab';

describe('profile tab', () => {
  it('should accept blog and fall back to mission', () => {
    expect(parseProfileTab('blog')).toBe('blog');
    expect(parseProfileTab('mission')).toBe('mission');
    expect(parseProfileTab('posts')).toBe('mission');
    expect(parseProfileTab(undefined)).toBe('mission');
  });

  it('should list the tabs in render order with their labels', () => {
    expect(PROFILE_TABS.map((t) => [t.id, t.label])).toEqual([
      ['mission', '미션 아카이브'],
      ['blog', '블로그 글'],
    ]);
  });
});
