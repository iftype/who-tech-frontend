import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type AppTheme = 'light' | 'dark';
export type DesignSystem = 'paper' | 'apple' | 'sentry';

const STORAGE_KEY = 'who-tech:theme';
const DESIGN_STORAGE_KEY = 'who-tech:design';

type ThemeContextValue = {
  theme: AppTheme;
  isDark: boolean;
  setTheme: (theme: AppTheme) => void;
  design: DesignSystem;
  setDesign: (design: DesignSystem) => void;
  settingsVersion: number;
  notifySettingsChanged: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<AppTheme | null>(null);
  const [design, setDesignState] = useState<DesignSystem>('paper');
  const [settingsVersion, setSettingsVersion] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') setThemeState(stored);
      })
      .catch(() => undefined);
    AsyncStorage.getItem(DESIGN_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'paper' || stored === 'apple' || stored === 'sentry') setDesignState(stored);
      })
      .catch(() => undefined);
  }, []);

  const notifySettingsChanged = useCallback(() => {
    setSettingsVersion((v) => v + 1);
  }, []);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState((prev) => {
      if (prev === next) return prev;
      setSettingsVersion((v) => v + 1);
      return next;
    });
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const setDesign = useCallback((next: DesignSystem) => {
    setDesignState((prev) => {
      if (prev === next) return prev;
      setSettingsVersion((v) => v + 1);
      return next;
    });
    AsyncStorage.setItem(DESIGN_STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const resolved: AppTheme = theme ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: resolved,
      isDark: resolved === 'dark',
      setTheme,
      design,
      setDesign,
      settingsVersion,
      notifySettingsChanged,
    }),
    [resolved, setTheme, design, setDesign, settingsVersion, notifySettingsChanged],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}
