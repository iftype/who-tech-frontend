'use client';

import { useQuery } from '@tanstack/react-query';
import { memberDetailQuery } from '@/entities/member';
import type { MissionTab } from '@/features/mission-archive/types';
import { ProfileHeader } from '@/widgets/member-profile/ProfileHeader';
import { ProfileTabs } from '@/widgets/member-profile/ProfileTabs';
import type { ProfileTab } from '@/widgets/member-profile/model/profileTab';
import { PageContainer } from '@/shared/ui';

interface MemberDetailClientProps {
  githubId: string;
  initialTab: ProfileTab;
  initialMissionTab: MissionTab;
}

// 멤버 데이터는 서버가 HydrationBoundary로 캐시에 넣어 준다. 새로고침 버튼이 같은 캐시를 갱신한다
export function MemberDetailClient({ githubId, initialTab, initialMissionTab }: MemberDetailClientProps) {
  const { data: member } = useQuery(memberDetailQuery(githubId));
  if (!member) return null;

  return (
    <PageContainer spacing="detail">
      <ProfileHeader member={member} detailId={githubId} />
      <div className="pt-6 sm:pt-8">
        <ProfileTabs
          member={member}
          detailId={githubId}
          initialTab={initialTab}
          initialMissionTab={initialMissionTab}
        />
      </div>
    </PageContainer>
  );
}
