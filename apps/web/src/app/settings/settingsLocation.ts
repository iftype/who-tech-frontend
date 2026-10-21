import { parseSettingsTab, type SettingsTab } from './settingsTab';

/** 설정 화면의 URL인지 (/settings) */
export const isSettingsPath = (pathname: string) => pathname === '/settings';

export function parseSettingsSearch(search: string): SettingsTab {
  return parseSettingsTab(new URLSearchParams(search).get('tab'));
}

// 서버 스냅샷 URL. 기본 탭(테마)은 쿼리에 쓰지 않는다
export function buildSettingsUrl(tab: SettingsTab): string {
  return tab === 'theme' ? '/settings' : `/settings?tab=${tab}`;
}
