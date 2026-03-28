'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Member, Role, Track } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge, TrackBadge } from '@/components/ui/Badge';

const ROLE_OPTIONS: { label: string; value: Role | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '크루', value: 'crew' },
  { label: '코치', value: 'coach' },
  { label: '리뷰어', value: 'reviewer' },
];

const TRACK_OPTIONS: { label: string; value: Track | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '프론트엔드', value: 'frontend' },
  { label: '백엔드', value: 'backend' },
  { label: '안드로이드', value: 'android' },
];

interface Props {
  members: Member[];
  cohort: number;
}

export function CohortFilters({ members }: Props) {
  const [role, setRole] = useState<Role | 'all'>('all');
  const [track, setTrack] = useState<Track | 'all'>('all');

  const filtered = members.filter((m) => {
    if (role !== 'all' && !m.roles.includes(role)) return false;
    if (track !== 'all' && !m.tracks.includes(track)) return false;
    return true;
  });

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {ROLE_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  role === value ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden h-3.5 w-px bg-border sm:block" />

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {TRACK_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTrack(value)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  track === value ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="ml-auto text-[12px] text-text-muted whitespace-nowrap">
          <span className="font-mono text-text">{filtered.length}</span>
          {filtered.length !== members.length && <span className="text-text-dim">/{members.length}</span>}명
        </p>
      </div>

      {/* Mobile: 세로 리스트 */}
      <div className="sm:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-[14px] text-text-muted">
            {members.length === 0 ? '해당 기수의 멤버가 없습니다.' : '조건에 맞는 멤버가 없습니다.'}
          </div>
        ) : (
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
            {filtered.map((member) => (
              <Link
                key={member.githubId}
                href={`/${member.githubId}`}
                className="flex items-center gap-3 border-b border-border-dim px-4 py-3 transition-colors hover:bg-surface-alt last:border-0"
              >
                <Avatar src={member.avatarUrl} alt={member.nickname} size={36} className="flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-text">
                    {member.nickname}
                    <span className="ml-1.5 font-mono text-[11px] font-normal text-text-muted">@{member.githubId}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {member.tracks.map((t) => (
                      <TrackBadge key={t} track={t} />
                    ))}
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

      {/* PC: 격자 그리드 */}
      <div className="hidden sm:grid gap-3 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
        {filtered.map((member) => (
          <Link
            key={member.githubId}
            href={`/${member.githubId}`}
            className="group flex min-h-[148px] flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/30 hover:bg-surface-alt"
          >
            <Avatar src={member.avatarUrl} alt={member.nickname} size={48} />
            <div className="w-full text-center">
              <p className="truncate text-[13px] font-medium text-text">{member.nickname}</p>
              <p className="truncate text-[11px] text-text-dim">@{member.githubId}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {member.roles.map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
              {member.tracks.map((t) => (
                <TrackBadge key={t} track={t} />
              ))}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-surface px-4 py-12 text-center text-[14px] text-text-muted">
            {members.length === 0 ? '해당 기수의 멤버가 없습니다.' : '조건에 맞는 멤버가 없습니다.'}
          </div>
        )}
      </div>
    </>
  );
}
