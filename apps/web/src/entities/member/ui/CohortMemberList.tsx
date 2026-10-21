import Link from 'next/link';
import type { Member } from '../model/types';
import { Avatar, EmptyState, ListCard } from '@/shared/ui';
import { staggerFadeIn } from '@/shared/lib/animation';
import { RoleBadges } from './RoleBadges';
import { CohortBadge, TrackBadge } from './MemberBadges';

interface CohortMemberListProps {
  members: Member[];
  emptyMessage: string;
}

// 모바일(sm 미만) 멤버 목록. 데스크톱 그리드(CohortMemberGrid)와 함께 렌더되고 CSS로 하나만 보인다
export function CohortMemberList({ members, emptyMessage }: CohortMemberListProps) {
  return (
    <div className="sm:hidden">
      {members.length === 0 ? (
        <EmptyState>{emptyMessage}</EmptyState>
      ) : (
        <ListCard stack>
          {members.map((member, i) => (
            <Link
              key={member.githubId}
              href={`/${member.githubId}`}
              className="flex items-center gap-3 border-b border-border-dim px-4 py-3 hover:bg-surface-alt last:border-0"
              style={staggerFadeIn(i)}
            >
              <Avatar src={member.avatarUrl} alt={member.nickname} size={36} className="flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 truncate text-body font-semibold text-text">
                    {member.nickname}
                    <span className="ml-1.5 font-mono text-caption font-normal text-text-muted">
                      @{member.githubId}
                    </span>
                  </p>
                  {member.blog && (
                    <span className="flex-shrink-0 rounded-full border border-accent-border bg-accent-bg px-2 py-0.5 text-tiny font-medium text-accent-dm">
                      블로그
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {member.cohort != null && <CohortBadge cohort={member.cohort} />}
                  {member.tracks.map((t) => (
                    <TrackBadge key={t} track={t} />
                  ))}
                  <RoleBadges roles={member.roles} hideCrew />
                </div>
              </div>
            </Link>
          ))}
        </ListCard>
      )}
    </div>
  );
}
