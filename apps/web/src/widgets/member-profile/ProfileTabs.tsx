'use client';

import { MissionArchive } from '@/features/mission-archive/MissionArchive';
import type { MissionTab } from '@/features/mission-archive/types';
import { visibleArchive } from '@/entities/member';
import type { MemberDetail } from '@/entities/member';
import { pageTabVariants } from '@/shared/ui';
import { PROFILE_TABS, type ProfileTab } from './model/profileTab';
import { useProfileTabs } from './model/useProfileTabs';
import { BlogSection } from './ui/BlogSection';

interface ProfileTabsProps {
  member: MemberDetail;
  /** 페이지 경로의 아이디 (member.githubId와 다를 수 있다: 예전 아이디로 들어온 경우) */
  detailId: string;
  initialTab: ProfileTab;
  initialMissionTab: MissionTab;
}

// 미션 아카이브 / 블로그 글 탭. 어느 탭인지는 URL이 정한다 (useProfileTabs)
export function ProfileTabs({ member, detailId, initialTab, initialMissionTab }: ProfileTabsProps) {
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
            archive={visibleArchive(member)}
            memberTracks={member.tracks}
            githubId={member.githubId}
            tab={missionTab}
            onTabChange={setMissionTab}
          />
        ) : (
          <BlogSection githubId={member.githubId} lastPostedAt={member.lastPostedAt} />
        )}
      </div>
    </>
  );
}
