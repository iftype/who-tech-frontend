import { useCallback, useMemo } from 'react';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';
import { buildSettingsUrl, isSettingsPath, parseSettingsSearch } from './settingsLocation';
import type { SettingsTab } from './settingsTab';

// 설정 탭. URL(?tab=)이 단일 소스다. 탭은 뒤로가기로 돌아올 대상이라 push.
// 서버 렌더·하이드레이션은 페이지가 파싱한 initialTab으로 만든 URL을 쓴다
export function useSettingsTab({ initialTab }: { initialTab: SettingsTab }) {
  const url = useUrl(buildSettingsUrl(initialTab), isSettingsPath);
  const tab = useMemo(() => parseSettingsSearch(splitUrl(url).search), [url]);
  const setTab = useCallback((next: SettingsTab) => urlStore.pushParam('tab', next), []);
  return { tab, setTab };
}
