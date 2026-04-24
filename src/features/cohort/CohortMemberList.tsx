'use client';

import Link from 'next/link';
import type { Member } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';

interface Props {
  members: Member[];
  emptyMessage: string;
}

export function CohortMemberList({ members, emptyMessage }: Props) {
  return (
    <div className="sm:hidden">
      {members.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-[14px] text-text-muted">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
          {members.map((member) => (
            <Link
              key={member.githubId}
              href={`/${member.githubId}`}
              className="flex items-center gap-3 border-b border-border-dim px-4 py-3 hover:bg-surface-alt last:border-0"
            >
              <Avatar src={member.avatarUrl} alt={member.nickname} size={36} className="flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 truncate text-[14px] font-semibold text-text">
                    {member.nickname}
                    <span className="ml-1.5 font-mono text-[11px] font-normal text-text-muted">@{member.githubId}</span>
                  </p>
                  {member.blog && (
                    <span className="flex-shrink-0 rounded-full border border-accent-border bg-accent-bg px-2 py-0.5 text-[10px] font-medium text-accent-dm">
                      블로그
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {member.cohort != null && <CohortBadge cohort={member.cohort} />}
                  {member.tracks.length > 0 && member.tracks.map((t) => <TrackBadge key={t} track={t} />)}
                  {member.roles
                    .filter((r) => r !== 'crew')
                    .map((r) => (
                      <RoleBadge key={r} role={r} />
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
