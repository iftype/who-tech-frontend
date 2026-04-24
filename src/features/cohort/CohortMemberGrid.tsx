'use client';

import Link from 'next/link';
import type { Member } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge, TrackBadge } from '@/components/ui/Badge';

interface Props {
  members: Member[];
  emptyMessage: string;
}

export function CohortMemberGrid({ members, emptyMessage }: Props) {
  return (
    <div className="hidden sm:grid gap-3 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
      {members.map((member) => (
        <Link
          key={member.githubId}
          href={`/${member.githubId}`}
          className="group flex min-h-[148px] flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-surface p-4 hover:border-accent/30 hover:bg-surface-alt"
        >
          <Avatar src={member.avatarUrl} alt={member.nickname} size={48} />
          <div className="w-full text-center">
            <p className="truncate text-[13px] font-medium text-text">{member.nickname}</p>
            <p className="truncate text-[11px] text-text-dim">@{member.githubId}</p>
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
        <div className="col-span-full rounded-xl border border-border bg-surface px-4 py-12 text-center text-[14px] text-text-muted">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
