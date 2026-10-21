'use client';

import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/shared/ui';
import {
  CohortBadge,
  RoleBadge,
  TecoTalkBadge,
  TrackBadge,
  githubProfileUrl,
  memberDetailQuery,
  visibleArchive,
} from '@/entities/member';
import { ProfileTabs } from '@/widgets/member-profile/ProfileTabs';
import type { ProfileTab } from '@/widgets/member-profile/model/profileTab';
import { RefreshButton } from '@/features/profile-refresh/RefreshButton';
import type { MissionTab } from '@/features/mission-archive/types';
import { GitHubIcon, LinkIcon, PageContainer, buttonVariants } from '@/shared/ui';

interface MemberDetailClientProps {
  githubId: string;
  initialTab: ProfileTab;
  initialMissionTab: MissionTab;
}

// 멤버 데이터는 서버가 HydrationBoundary로 캐시에 넣어 준다. 새로고침 버튼이 같은 캐시를 갱신한다
export function MemberDetailClient({ githubId, initialTab, initialMissionTab }: MemberDetailClientProps) {
  const { data: member } = useQuery(memberDetailQuery(githubId));
  if (!member) return null;

  const profileLinks = (className: string) => (
    <div className={`shrink-0 items-center gap-1 ${className}`}>
      <a
        href={githubProfileUrl(member.githubId)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants()}
      >
        <GitHubIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
      {member.blog && (
        <a href={member.blog} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
          <LinkIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">블로그</span>
        </a>
      )}
    </div>
  );

  return (
    <PageContainer spacing="detail">
      <div className="flex items-center gap-3 sm:gap-5 pb-5 sm:pb-8 border-b border-border-dim">
        <a
          href={githubProfileUrl(member.githubId)}
          target="_blank"
          rel="noopener noreferrer"
          className="block shrink-0 transition-transform duration-200 hover:scale-105"
          title={`${member.nickname}의 GitHub 프로필 방문`}
        >
          <Avatar
            src={member.avatarUrl}
            alt={member.nickname}
            size={80}
            responsive
            className="w-12 h-12 sm:w-20 sm:h-20"
          />
        </a>
        <div className="flex flex-col gap-1 sm:gap-2 min-w-0 flex-1">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-baseline gap-1.5 sm:gap-2">
              <h1 className="text-title-xs sm:text-headline font-bold text-text leading-tight">{member.nickname}</h1>
              <span className="font-mono text-caption sm:text-body text-text-muted truncate max-w-[140px] sm:max-w-none">
                @{member.githubId}
              </span>
              <RefreshButton githubId={member.githubId} detailId={githubId} />
            </div>
            {profileLinks('inline-flex sm:hidden')}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {member.cohorts.map((mc) => (
              <div
                key={mc.cohort}
                className="flex items-center gap-1 p-0.5 sm:p-1 bg-surface-alt rounded-lg border border-border-dim shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CohortBadge cohort={mc.cohort} />
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {mc.roles.map((r) => (
                    <RoleBadge key={r} role={r} />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 ml-0.5 sm:ml-1 border-l border-border-dim">
              {member.tracks.map((t) => (
                <TrackBadge key={t} track={t} />
              ))}
            </div>
            {profileLinks('hidden sm:inline-flex')}
          </div>
          {member.tecoTalks && member.tecoTalks.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 sm:mt-1">
              <span className="text-caption text-text-muted">테코톡</span>
              {member.tecoTalks.map((talk) => (
                <TecoTalkBadge key={talk.id} talk={talk} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 sm:pt-8">
        <ProfileTabs
          archive={visibleArchive(member)}
          memberTracks={member.tracks}
          githubId={member.githubId}
          detailId={githubId}
          lastPostedAt={member.lastPostedAt}
          initialTab={initialTab}
          initialMissionTab={initialMissionTab}
        />
      </div>
    </PageContainer>
  );
}
