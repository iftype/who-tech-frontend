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
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      {/* Cohort Tab Bar */}
      <div className="flex items-center gap-0 border-b border-border mb-8">
        {COHORTS.map((c) => (
          <Link
            key={c}
            href={`/cohort/${c}`}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
              c === cohort ? 'border-accent-dm text-accent-dm' : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {c}기
          </Link>
        ))}
      </div>

      {/* Count */}
      <p className="text-[12px] text-text-muted mb-5">
        <span className="font-mono text-text">{members.length}</span>명
      </p>

      {/* Crew Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {members.map((member) => (
          <Link
            key={member.githubId}
            href={`/${member.githubId}`}
            className="flex flex-col items-center gap-3 p-5 rounded-lg border border-border bg-surface hover:border-accent/30 hover:bg-surface-alt transition-all"
          >
            <Avatar src={member.avatarUrl} alt={member.nickname} size={56} />
            <div className="flex flex-col items-center gap-1.5 w-full">
              <span className="text-[13px] font-medium text-text text-center">{member.nickname}</span>
              <div className="flex flex-wrap justify-center gap-1">
                {member.roles.map((r) => (
                  <RoleBadge key={r} role={r} />
                ))}
                {member.tracks.map((t) => (
                  <TrackBadge key={t} track={t} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
