export const NAV_LINKS = [
  { href: '/feed', label: '피드' },
  { href: '/cohort', label: '기수 목록' },
  { href: '/settings', label: '설정' },
] as const;

/**
 * 메뉴 링크가 지금 경로를 가리키는가. 피드는 `/feed`가 `/`로 리다이렉트되므로 홈(`/`)에서도 활성이다
 * (라운드 2에서 미뤘던 것 → 라운드 6)
 */
export function isNavActive(href: string, activeHref: string): boolean {
  return activeHref === href || (href === '/feed' && activeHref === '/');
}
