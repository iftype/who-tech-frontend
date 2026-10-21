import { describe, expect, it } from 'vitest';
import { NAV_LINKS, isNavActive } from './navLinks';

describe('isNavActive', () => {
  it('should mark the feed link active on the home path as well as /feed', () => {
    expect(isNavActive('/feed', '/')).toBe(true);
    expect(isNavActive('/feed', '/feed')).toBe(true);
    expect(isNavActive('/cohort', '/')).toBe(false);
    expect(isNavActive('/settings', '/settings')).toBe(true);
    expect(isNavActive('/cohort', '/cohort/8')).toBe(false);
  });

  it('should keep the three menu links', () => {
    expect(NAV_LINKS.map((l) => l.href)).toEqual(['/feed', '/cohort', '/settings']);
  });
});
