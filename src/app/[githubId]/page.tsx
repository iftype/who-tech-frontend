import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import { ProfileTabs } from '@/features/profile/ProfileTabs';

interface Props {
  params: Promise<{ githubId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { githubId } = await params;
  const member = await api.members.detail(githubId).catch(() => null);
  if (!member) return {};
  return {
    title: member.nickname,
    description: `${member.nickname}(@${member.githubId}) 크루의 미션 아카이브와 블로그`,
    openGraph: {
      title: `${member.nickname} | who.tech`,
      images: member.avatarUrl ? [{ url: member.avatarUrl }] : [],
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { githubId } = await params;
  const member = await api.members.detail(githubId).catch(() => null);
  if (!member) notFound();

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      {/* Profile Header */}
      <div className="flex items-center gap-5 pb-8 border-b border-border-dim">
        <Avatar src={member.avatarUrl} alt={member.nickname} size={80} />
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[28px] font-bold text-text">{member.nickname}</h1>
            <span className="font-mono text-[14px] text-text-muted">@{member.githubId}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {member.cohort && <CohortBadge cohort={member.cohort} />}
            {member.roles.map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
            {member.tracks.map((t) => (
              <TrackBadge key={t} track={t} />
            ))}
            {member.blog && (
              <a
                href={member.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[11px] text-text-muted hover:text-text transition-colors"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                블로그
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-6 sm:pt-8">
        <ProfileTabs submissions={member.submissions} blogPosts={member.blogPosts} lastPostedAt={member.lastPostedAt} />
      </div>
    </div>
  );
}
