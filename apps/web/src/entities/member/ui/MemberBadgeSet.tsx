import { CohortBadge, TeamBlogBadge, TrackBadge } from './MemberBadges';
import { RoleBadges } from './RoleBadges';
import { cohortBadgeRoles } from '../model/role';
import type { Member } from '../model/types';

// 멤버 한 사람의 배지 묶음 (피드 작성자 줄). 팀 블로그 → 팀 배지 하나.
// 멤버 → 트랙 + 기수마다 [기수, 그 기수의 역할] (cohorts가 없는 예전 응답은 대표 기수·역할로).
// 감싸는 요소 없이(fragment) 배지만 돌려줘 부모 레이아웃이 그대로다
export function MemberBadgeSet({ member }: { member: Member }) {
  if (member.isTeamBlog) return <TeamBlogBadge />;
  const cohorts = member.cohorts;
  return (
    <>
      <TrackBadge track={member.tracks[0]} compact />
      {cohorts && cohorts.length > 0 ? (
        cohorts.map((c) => (
          <span key={c.cohort} className="inline-flex items-center gap-1">
            <CohortBadge cohort={c.cohort} />
            <RoleBadges roles={cohortBadgeRoles(c.roles)} />
          </span>
        ))
      ) : (
        <>
          {member.cohort != null && <CohortBadge cohort={member.cohort} />}
          <RoleBadges roles={member.roles} hideCrew />
        </>
      )}
    </>
  );
}
