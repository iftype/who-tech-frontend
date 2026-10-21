import { useCallback, useMemo } from 'react';
import { parseMissionTab } from '@/features/mission-archive/parse';
import type { MissionTab } from '@/features/mission-archive/types';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';
import { parseProfileTab, type ProfileTab } from './profileTab';

interface Params {
  /** 상세 페이지 경로의 아이디 (URL 소유 판별용) */
  detailId: string;
  initialTab: ProfileTab;
  initialMissionTab: MissionTab;
}

// 프로필 탭·미션 하위 탭. URL(?tab=, ?missionTab=)이 단일 소스다: 상태를 따로 들지 않고 URL에서 계산한다.
// 둘 다 replace (뒤로가기 대상이 아닌 보기 전환). 서버 렌더·하이드레이션은 페이지가 파싱한 값으로 만든 URL을 쓴다
export function useProfileTabs({ detailId, initialTab, initialMissionTab }: Params) {
  const pathname = `/${detailId}`;
  const url = useUrl(buildProfileUrl(pathname, initialTab, initialMissionTab), (p) => p === pathname);

  const { tab, missionTab } = useMemo(() => {
    const params = new URLSearchParams(splitUrl(url).search);
    return { tab: parseProfileTab(params.get('tab')), missionTab: parseMissionTab(params.get('missionTab')) };
  }, [url]);

  const setTab = useCallback((next: ProfileTab) => urlStore.replaceParam('tab', next), []);
  const setMissionTab = useCallback((next: MissionTab) => urlStore.replaceParam('missionTab', next), []);

  return { tab, missionTab, setTab, setMissionTab };
}

// 서버 스냅샷 URL. 페이지가 받은 값을 그대로 쓰므로 명시적 기본값(?tab=mission)이 있어도 되고 없어도 같은 화면이다
function buildProfileUrl(pathname: string, tab: ProfileTab, missionTab: MissionTab): string {
  const params = new URLSearchParams();
  if (tab !== 'mission') params.set('tab', tab);
  if (missionTab !== 'mission') params.set('missionTab', missionTab);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
