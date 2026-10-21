import type { Role, RoleGroup } from './types';

const STAFF_ROLES: readonly Role[] = ['coach', 'reviewer'];

/** 운영진(코치·리뷰어)인가. 역할이 아예 없는 멤버(팀 블로그 등)는 운영진이 아니다 */
export function isStaff(roles: readonly Role[] | undefined): boolean {
  return roles?.some((role) => STAFF_ROLES.includes(role)) ?? false;
}

/** 배지로 보여 줄 역할: 크루는 기본이라 빼고 나머지만 */
export function nonCrewRoles(roles: readonly Role[] | undefined): Role[] {
  return roles?.filter((role) => role !== 'crew') ?? [];
}

/** 크루 탭의 멤버: 크루 역할이 있고 운영진은 아닌 (크루였다가 코치가 된 사람은 운영진 탭에만) */
export function isCrewOnly(roles: readonly Role[] | undefined): boolean {
  return (roles?.includes('crew') ?? false) && !isStaff(roles);
}

/** 역할 그룹 탭(크루 / 운영진)에 들어가는가 */
export function matchesRoleGroup(roles: readonly Role[] | undefined, group: RoleGroup): boolean {
  return group === 'crew' ? isCrewOnly(roles) : isStaff(roles);
}

/** 기수 배지 옆에 붙는 그 기수의 역할: 크루면 '크루' 하나, 아니면 나머지 역할 */
export function cohortBadgeRoles(roles: readonly Role[]): Role[] {
  return roles.includes('crew') ? ['crew'] : nonCrewRoles(roles);
}
