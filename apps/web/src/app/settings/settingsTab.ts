export const SETTINGS_TABS = [
  { id: 'theme', label: '테마' },
  { id: 'guide', label: '가이드' },
  { id: 'privacy', label: '개인정보처리방침' },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]['id'];

/** URL의 tab 값. 모르는 값은 기본 탭(테마) */
export function parseSettingsTab(value: string | null | undefined): SettingsTab {
  return value === 'guide' || value === 'privacy' ? value : 'theme';
}
