'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type DesignSystem = 'paper' | 'apple' | 'sentry';

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
  if (ds === 'apple') el.classList.add('apple');
  if (ds === 'sentry') el.classList.add('sentry');
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [designSystem, setDesignSystem] = useState<DesignSystem>('paper');

  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = storedTheme ?? 'dark';
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const storedDs = localStorage.getItem('designSystem') as DesignSystem | null;
    const initialDs = storedDs ?? 'paper';
    setDesignSystem(initialDs);
    applyDesign(initialDs);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const setDesign = (ds: DesignSystem) => {
    applyDesign(ds);
    setDesignSystem(ds);
    localStorage.setItem('designSystem', ds);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggle, designSystem, setDesign }}>{children}</ThemeContext.Provider>;
}
