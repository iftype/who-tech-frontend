'use client';

import Link from 'next/link';
import type { Member } from '@/entities/member';
import { Avatar } from '@/shared/ui';
import { RoleBadge, TrackBadge } from '@/entities/member';

interface Props {
  members: Member[];
  emptyMessage: string;
}

export function CohortMemberGrid({ members, emptyMessage }: Props) {
  return (
    <div className="hidden sm:grid gap-3 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
      {members.map((member, i) => (
        <Link
          key={member.githubId}
          href={`/${member.githubId}`}
          className="group flex min-h-[148px] flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-surface p-4 hover:border-accent/30 hover:bg-surface-alt"
          style={{ animation: `feedRowFadeIn 0.3s ease both`, animationDelay: `${Math.min(i * 30, 300)}ms` }}
        >
          <Avatar src={member.avatarUrl} alt={member.nickname} size={48} />
          <div className="w-full text-center">
            <p className="truncate text-body-sm font-medium text-text">{member.nickname}</p>
            <p className="truncate text-caption text-text-dim">@{member.githubId}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {member.roles
              .filter((r) => r !== 'crew')
              .map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
            {member.tracks.length > 0 && member.tracks.map((t) => <TrackBadge key={t} track={t} />)}
          </div>
        </Link>
      ))}
      {members.length === 0 && (
        <div className="col-span-full rounded-xl border border-border bg-surface px-4 py-12 text-center text-body text-text-muted">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
