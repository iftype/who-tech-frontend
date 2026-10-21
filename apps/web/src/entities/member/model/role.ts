import type { Role } from './types';

const STAFF_ROLES: readonly Role[] = ['coach', 'reviewer'];

/** 운영진(코치·리뷰어)인가. 역할이 아예 없는 멤버(팀 블로그 등)는 운영진이 아니다 */
export function isStaff(roles: readonly Role[] | undefined): boolean {
  return roles?.some((role) => STAFF_ROLES.includes(role)) ?? false;
}

/** 배지로 보여 줄 역할: 크루는 기본이라 빼고 나머지만 */
export function nonCrewRoles(roles: readonly Role[] | undefined): Role[] {
  return roles?.filter((role) => role !== 'crew') ?? [];
}
