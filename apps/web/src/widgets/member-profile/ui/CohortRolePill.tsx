import { CohortBadge, RoleBadges } from '@/entities/member';
import type { Role } from '@/entities/member';

// 기수 하나와 그 기수의 역할들을 한 알약 안에 (8기 · 크루 / 7기 · 코치 리뷰어)
export function CohortRolePill({ cohort, roles }: { cohort: number; roles: Role[] }) {
  return (
    <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-surface-alt rounded-lg border border-border-dim shadow-sm hover:shadow-md transition-all duration-300">
      <CohortBadge cohort={cohort} />
      <div className="flex items-center gap-0.5 sm:gap-1">
        <RoleBadges roles={roles} />
      </div>
    </div>
  );
}
