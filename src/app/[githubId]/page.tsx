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
        <a
          href={`https://github.com/${member.githubId}`} // nickname을 ID로 사용
          target="_blank"
          rel="noopener noreferrer"
          className="block shrink-0 transition-transform duration-200 hover:scale-105"
          title={`${member.nickname}의 GitHub 프로필 방문`}
        >
          <Avatar src={member.avatarUrl} alt={member.nickname} size={80} />
        </a>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[28px] font-bold text-text">{member.nickname}</h1>
            <span className="font-mono text-[14px] text-text-muted">@{member.githubId}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {member.cohorts.map((mc) => (
              <div
                key={mc.cohort}
                className="flex items-center gap-1.5 p-1 bg-surface-alt rounded-lg border border-border-dim shadow-sm animate-fade-in hover:shadow-md transition-all duration-300"
              >
                <CohortBadge cohort={mc.cohort} />
                <div className="flex items-center gap-1">
                  {mc.roles.map((r) => (
                    <RoleBadge key={r} role={r} />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-2 py-1 ml-1 border-l border-border-dim">
              {member.tracks.map((t) => (
                <TrackBadge key={t} track={t} />
              ))}
            </div>
            <a
              href={`https://github.com/${member.githubId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[11px] text-text-muted hover:text-text transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
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
        <ProfileTabs
          archive={member.archive.filter((ca) =>
            member.cohorts.some((mc) => mc.cohort === ca.cohort && mc.roles.includes('crew')),
          )}
          memberTracks={member.tracks}
          blogPosts={member.blogPosts}
          lastPostedAt={member.lastPostedAt}
        />
      </div>
    </div>
  );
}
