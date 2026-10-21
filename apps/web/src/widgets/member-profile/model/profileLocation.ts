import { parseMissionTab } from '@/features/mission-archive';
import type { MissionTab } from '@/features/mission-archive';
import { parseProfileTab, type ProfileTab } from './profileTab';

type ProfileTabs = { tab: ProfileTab; missionTab: MissionTab };

export function parseProfileSearch(search: string): ProfileTabs {
  const params = new URLSearchParams(search);
  return { tab: parseProfileTab(params.get('tab')), missionTab: parseMissionTab(params.get('missionTab')) };
}

// 서버 스냅샷 URL. 페이지가 받은 값을 그대로 쓰므로 명시적 기본값(?tab=mission)이 있어도 되고 없어도 같은 화면이다
export function buildProfileUrl(pathname: string, { tab, missionTab }: ProfileTabs): string {
  const params = new URLSearchParams();
  if (tab !== 'mission') params.set('tab', tab);
  if (missionTab !== 'mission') params.set('missionTab', missionTab);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
