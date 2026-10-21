import { useCallback, useMemo } from 'react';
import { memberPath } from '@/entities/member';
import type { MissionTab } from '@/features/mission-archive';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';
import { buildProfileUrl, parseProfileSearch } from './profileLocation';
import type { ProfileTab } from './profileTab';

interface Params {
  /** 상세 페이지 경로의 아이디 (URL 소유 판별용) */
  detailId: string;
  initialTab: ProfileTab;
  initialMissionTab: MissionTab;
}

// 프로필 탭·미션 하위 탭. URL(?tab=, ?missionTab=)이 단일 소스다: 상태를 따로 들지 않고 URL에서 계산한다.
// 둘 다 replace (뒤로가기 대상이 아닌 보기 전환). 서버 렌더·하이드레이션은 페이지가 파싱한 값으로 만든 URL을 쓴다
export function useProfileTabs({ detailId, initialTab, initialMissionTab }: Params) {
  const pathname = memberPath(detailId);
  const url = useUrl(
    buildProfileUrl(pathname, { tab: initialTab, missionTab: initialMissionTab }),
    (p) => p === pathname,
  );

  const { tab, missionTab } = useMemo(() => parseProfileSearch(splitUrl(url).search), [url]);

  const setTab = useCallback((next: ProfileTab) => urlStore.replaceParam('tab', next), []);
  const setMissionTab = useCallback((next: MissionTab) => urlStore.replaceParam('missionTab', next), []);

  return { tab, missionTab, setTab, setMissionTab };
}
