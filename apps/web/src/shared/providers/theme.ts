// 테마·디자인 값의 단일 정의. 서버(layout.tsx 쿠키 파싱)와 클라이언트(ThemeProvider·설정 탭)가 같은 목록을 쓴다

export const THEMES = ['dark', 'light'] as const;
export type Theme = (typeof THEMES)[number];

export const DESIGN_SYSTEMS = ['paper', 'apple', 'sentry'] as const;
export type DesignSystem = (typeof DESIGN_SYSTEMS)[number];

export const DEFAULT_THEME: Theme = 'dark';
export const DEFAULT_DESIGN: DesignSystem = 'paper';

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

function isDesign(value: unknown): value is DesignSystem {
  return typeof value === 'string' && (DESIGN_SYSTEMS as readonly string[]).includes(value);
}

/** 쿠키 값 → 테마. 모르는 값은 기본(다크) */
export function parseTheme(value: unknown): Theme {
  return isTheme(value) ? value : DEFAULT_THEME;
}

/** 쿠키 값 → 디자인. 모르는 값은 기본(paper) */
export function parseDesign(value: unknown): DesignSystem {
  return isDesign(value) ? value : DEFAULT_DESIGN;
}
