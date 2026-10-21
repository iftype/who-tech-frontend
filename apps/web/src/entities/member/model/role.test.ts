import { describe, expect, it } from 'vitest';
import { isStaff, nonCrewRoles } from './role';

describe('member roles', () => {
  it('should treat coaches and reviewers as staff, crew and roleless members as not', () => {
    expect(isStaff(['coach'])).toBe(true);
    expect(isStaff(['crew', 'reviewer'])).toBe(true);
    expect(isStaff(['crew'])).toBe(false);
    expect(isStaff([])).toBe(false);
    expect(isStaff(undefined)).toBe(false);
  });

  it('should drop crew from the roles shown as badges', () => {
    expect(nonCrewRoles(['crew', 'coach', 'reviewer'])).toEqual(['coach', 'reviewer']);
    expect(nonCrewRoles(['crew'])).toEqual([]);
    expect(nonCrewRoles(undefined)).toEqual([]);
  });
});
