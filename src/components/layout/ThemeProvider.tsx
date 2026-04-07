'use client';

import { createContext, useContext, useState } from 'react';

export type Theme = 'dark' | 'light';
export type DesignSystem = 'paper' | 'apple' | 'sentry';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  designSystem: DesignSystem;
  setDesign: (ds: DesignSystem) => void;
}>({
  theme: 'dark',
  toggle: () => {},
  designSystem: 'paper',
  setDesign: () => {},
});

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
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
  initialTheme = 'dark',
  initialDesign = 'paper',
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
  initialDesign?: DesignSystem;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [designSystem, setDesignSystem] = useState<DesignSystem>(initialDesign);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    setCookie('theme', next);
  };

  const setDesign = (ds: DesignSystem) => {
    applyDesign(ds);
    setDesignSystem(ds);
    setCookie('designSystem', ds);
  };

  return <ThemeContext.Provider value={{ theme, toggle, designSystem, setDesign }}>{children}</ThemeContext.Provider>;
}
