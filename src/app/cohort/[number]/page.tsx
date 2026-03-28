import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge, TrackBadge } from '@/components/ui/Badge';

interface Props {
  params: Promise<{ number: string }>;
}

const COHORTS = [8, 7, 6, 5, 4, 3, 2, 1];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `${number}기 크루 목록` };
}

export default async function CohortPage({ params }: Props) {
  const { number } = await params;
  const cohort = Number(number);
  const members = await api.members.search({ cohort }).catch(() => []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      {/* Cohort Tab Bar */}
      <div className="mb-5 overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1 sm:gap-0">
          {COHORTS.map((c) => (
            <Link
              key={c}
              href={`/cohort/${c}`}
              className={`-mb-px rounded-t-md border-b-2 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:rounded-none sm:px-4 sm:py-2 ${
                c === cohort ? 'border-accent-dm text-accent-dm' : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {c}기
            </Link>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-text sm:text-[24px]">{cohort}기 크루</h1>
          <p className="mt-1 text-[12px] text-text-muted">우아한테크코스 {cohort}기 멤버 목록</p>
        </div>
        <p className="text-[12px] text-text-muted whitespace-nowrap">
          <span className="font-mono text-text">{members.length}</span>명
        </p>
      </div>

      {/* Crew Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {members.map((member) => (
          <Link
            key={member.githubId}
            href={`/${member.githubId}`}
            className="group rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/30 hover:bg-surface-alt sm:flex sm:min-h-[160px] sm:flex-col sm:items-center sm:justify-center sm:gap-3 sm:p-5"
          >
            <div className="flex items-center gap-4 sm:flex-col sm:gap-3">
              <Avatar src={member.avatarUrl} alt={member.nickname} size={56} />
              <div className="min-w-0 flex-1 sm:w-full">
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:justify-center">
                  <div className="min-w-0 sm:text-center">
                    <p className="truncate text-[15px] font-semibold text-text sm:text-[13px] sm:font-medium">
                      {member.nickname}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-text-muted sm:hidden">@{member.githubId}</p>
                  </div>
                  <span className="font-mono text-[11px] text-text-dim transition-colors group-hover:text-accent-dm sm:hidden">
                    보기 →
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
                  <span className="inline-flex rounded-md border border-accent-border bg-accent-bg px-2 py-0.5 text-[10px] font-semibold text-accent-dm">
                    {cohort}기
                  </span>
                  {member.roles.map((r) => (
                    <RoleBadge key={r} role={r} />
                  ))}
                  {member.tracks.map((t) => (
                    <TrackBadge key={t} track={t} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 hidden w-full flex-wrap justify-center gap-1 sm:flex">
              {member.roles.map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
              {member.tracks.map((t) => (
                <TrackBadge key={t} track={t} />
              ))}
            </div>
            <div className="mt-2 hidden text-[11px] text-text-dim sm:block">@{member.githubId}</div>
          </Link>
        ))}
      </div>

      {members.length === 0 && (
        <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-[14px] text-text-muted">
          해당 기수의 멤버가 없습니다.
        </div>
      )}
    </div>
  );
}
