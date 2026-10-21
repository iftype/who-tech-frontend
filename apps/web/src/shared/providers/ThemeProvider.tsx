'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DEFAULT_DESIGN, DEFAULT_THEME, type DesignSystem, type Theme } from './theme';

export type { DesignSystem, Theme } from './theme';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  designSystem: DesignSystem;
  setDesign: (ds: DesignSystem) => void;
}>({
  theme: DEFAULT_THEME,
  toggle: () => {},
  designSystem: DEFAULT_DESIGN,
  setDesign: () => {},
});

function setCookie(name: string, value: string) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax${secure}`;
}

function freezeTransitions() {
  document.documentElement.classList.add('theme-switching');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('theme-switching');
    });
  });
}

function applyTheme(next: Theme) {
  freezeTransitions();
  document.documentElement.classList.toggle('dark', next === 'dark');
  document.documentElement.style.colorScheme = next;
}

function applyDesign(ds: DesignSystem) {
  freezeTransitions();
  const el = document.documentElement;
  el.classList.remove('apple', 'sentry');
  if (ds !== 'paper') el.classList.add(ds);
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
  initialDesign = DEFAULT_DESIGN,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
  initialDesign?: DesignSystem;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [designSystem, setDesignSystem] = useState<DesignSystem>(initialDesign);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    setCookie('theme', next);
  }, [theme]);

  const setDesign = useCallback((ds: DesignSystem) => {
    applyDesign(ds);
    setDesignSystem(ds);
    setCookie('designSystem', ds);
  }, []);

  // 값 객체를 렌더마다 새로 만들면 테마를 쓰는 모든 컴포넌트가 함께 다시 그려진다
  const value = useMemo(() => ({ theme, toggle, designSystem, setDesign }), [theme, toggle, designSystem, setDesign]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
