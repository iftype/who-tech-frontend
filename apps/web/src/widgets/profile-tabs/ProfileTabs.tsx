'use client';

import { useQuery } from '@tanstack/react-query';
import { MissionArchive } from '@/features/mission-archive/MissionArchive';
import type { MissionTab } from '@/features/mission-archive/types';
import { formatDate, formatRelativeDate, decodeHtml } from '@/shared/lib/utils';
import { memberPostsQuery } from '@/entities/post';
import type { CohortArchive, Track } from '@/entities/member';
import { ClockIcon, pageTabVariants } from '@/shared/ui';
import { PROFILE_TABS, type ProfileTab } from './model/profileTab';
import { useProfileTabs } from './model/useProfileTabs';

interface ProfileTabsProps {
  archive: CohortArchive[];
  memberTracks: Track[];
  githubId: string;
  /** 페이지 경로의 아이디 (githubId와 다를 수 있다: 예전 아이디로 들어온 경우) */
  detailId: string;
  lastPostedAt: string | null;
  initialTab: ProfileTab;
  initialMissionTab: MissionTab;
}

export function ProfileTabs({
  archive,
  memberTracks,
  githubId,
  detailId,
  lastPostedAt,
  initialTab,
  initialMissionTab,
}: ProfileTabsProps) {
  const { tab, missionTab, setTab, setMissionTab } = useProfileTabs({ detailId, initialTab, initialMissionTab });

  return (
    <>
      <div className="border-b border-border mb-6">
        <div role="tablist" aria-label="프로필" className="flex">
          {PROFILE_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={pageTabVariants({ active: tab === t.id, size: 'lg', indicator: 'accent' })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="md:max-w-[800px]">
        {tab === 'mission' ? (
          <MissionArchive
            archive={archive}
            memberTracks={memberTracks}
            githubId={githubId}
            tab={missionTab}
            onTabChange={setMissionTab}
          />
        ) : (
          <BlogSection githubId={githubId} lastPostedAt={lastPostedAt} />
        )}
      </div>
    </>
  );
}

function BlogSection({ githubId, lastPostedAt }: { githubId: string; lastPostedAt: string | null }) {
  const { data: blogPosts, isLoading } = useQuery(memberPostsQuery(githubId));

  if (isLoading) {
    return <p className="py-8 text-body-sm text-text-muted">블로그 글을 불러오는 중...</p>;
  }

  if (!blogPosts) {
    return <p className="py-8 text-body-sm text-text-muted">등록된 블로그 글이 없습니다</p>;
  }

  const { archive: archivePosts } = blogPosts;

  return (
    <div className="flex flex-col gap-4">
      {archivePosts.length === 0 ? (
        <p className="text-body-sm text-text-muted">등록된 블로그 글이 없습니다</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border-dim border border-border rounded-lg overflow-hidden bg-surface">
            {archivePosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 hover:bg-surface-alt"
              >
                <p className="text-body-sm font-medium text-text line-clamp-2">{decodeHtml(post.title)}</p>
                <p className="text-caption text-text-dim sm:shrink-0">{formatDate(post.publishedAt)}</p>
              </a>
            ))}
          </div>

          {lastPostedAt && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border-dim bg-surface text-caption text-text-muted">
              <ClockIcon className="w-3 h-3" />
              마지막 게시: {formatRelativeDate(lastPostedAt)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
