import { nonCrewRoles } from '../model/role';
import type { Role } from '../model/types';
import { RoleBadge } from './MemberBadges';

// 역할 배지 묶음. 크루는 기본이라 빼고(hideCrew) 코치·리뷰어만 보여 주는 자리가 네 곳이라 한 번만 쓴다.
// 감싸는 요소 없이(fragment) 배지만 돌려줘 부모 레이아웃이 그대로다
export function RoleBadges({ roles, hideCrew = false }: { roles: Role[] | undefined; hideCrew?: boolean }) {
  const shown = hideCrew ? nonCrewRoles(roles) : (roles ?? []);
  return (
    <>
      {shown.map((role) => (
        <RoleBadge key={role} role={role} />
      ))}
    </>
  );
}
