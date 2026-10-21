import { describe, expect, it } from 'vitest';
import { cohortBadgeRoles, isCrewOnly, isStaff, matchesRoleGroup, nonCrewRoles } from './role';

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

  // 기수 화면의 크루 탭: 크루이면서 운영진이 아닌 사람만. 크루 출신 코치는 운영진 탭에만 (CohortExplorer에 있던 규칙)
  it('should put crew-only members in the crew group and staff in the staff group', () => {
    expect(isCrewOnly(['crew'])).toBe(true);
    expect(isCrewOnly(['crew', 'coach'])).toBe(false);
    expect(isCrewOnly(['reviewer'])).toBe(false);
    expect(isCrewOnly([])).toBe(false);
    expect(isCrewOnly(undefined)).toBe(false);
    expect(matchesRoleGroup(['crew'], 'crew')).toBe(true);
    expect(matchesRoleGroup(['crew', 'coach'], 'crew')).toBe(false);
    expect(matchesRoleGroup(['crew', 'coach'], 'staff')).toBe(true);
    expect(matchesRoleGroup(['crew'], 'staff')).toBe(false);
  });

  // 피드 작성자 배지: 기수마다 크루면 '크루' 하나, 아니면 그 기수의 코치·리뷰어 (FeedRow에 있던 규칙)
  it('should show crew alone or the non-crew roles next to a cohort badge', () => {
    expect(cohortBadgeRoles(['crew'])).toEqual(['crew']);
    expect(cohortBadgeRoles(['crew', 'coach'])).toEqual(['crew']);
    expect(cohortBadgeRoles(['coach', 'reviewer'])).toEqual(['coach', 'reviewer']);
    expect(cohortBadgeRoles([])).toEqual([]);
  });
});
