export const PROFILE_TABS = [
  { id: 'mission', label: '미션 아카이브' },
  { id: 'blog', label: '블로그 글' },
] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number]['id'];

/** URL의 tab 값. 모르는 값은 기본 탭(미션 아카이브) */
export function parseProfileTab(value: string | null | undefined): ProfileTab {
  return value === 'blog' ? 'blog' : 'mission';
}
