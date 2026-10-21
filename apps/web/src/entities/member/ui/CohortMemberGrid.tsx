import Link from 'next/link';
import { staggerFadeIn } from '@/shared/lib/animation';
import { Avatar, EmptyState } from '@/shared/ui';
import { TrackBadge } from './MemberBadges';
import { RoleBadges } from './RoleBadges';
import { memberPath } from '../model/links';
import type { Member } from '../model/types';

interface CohortMemberGridProps {
  members: Member[];
  emptyMessage: string;
}

// 데스크톱(sm 이상) 멤버 카드 그리드. 모바일 목록(CohortMemberList)과 함께 렌더되고 CSS로 하나만 보인다
export function CohortMemberGrid({ members, emptyMessage }: CohortMemberGridProps) {
  return (
    <div className="hidden sm:grid gap-3 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
      {members.map((member, i) => (
        <Link
          key={member.githubId}
          href={memberPath(member.githubId)}
          className="group flex min-h-[148px] flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-surface p-4 hover:border-accent/30 hover:bg-surface-alt"
          style={staggerFadeIn(i)}
        >
          <Avatar src={member.avatarUrl} alt={member.nickname} size={48} />
          <div className="w-full text-center">
            <p className="truncate text-body-sm font-medium text-text">{member.nickname}</p>
            <p className="truncate text-caption text-text-dim">@{member.githubId}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            <RoleBadges roles={member.roles} hideCrew />
            {member.tracks.map((t) => (
              <TrackBadge key={t} track={t} />
            ))}
          </div>
        </Link>
      ))}
      {members.length === 0 && <EmptyState className="col-span-full">{emptyMessage}</EmptyState>}
    </div>
  );
}
