import Constants from 'expo-constants';

const FALLBACK_WEB_URL = 'https://who-tech.vercel.app';

function resolveWebUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_WEB_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, '');
  const fromExtra = (Constants.expoConfig?.extra as { webUrl?: string } | undefined)?.webUrl;
  if (fromExtra && fromExtra.length > 0) return fromExtra.replace(/\/$/, '');
  return FALLBACK_WEB_URL;
}

export const WEB_URL = resolveWebUrl();

export const TAB_PATHS = {
  cohort: '/cohort',
  feed: '/',
  settings: '/settings',
} as const;

export type TabKey = keyof typeof TAB_PATHS;

export function buildUrl(path: string): string {
  if (!path.startsWith('/')) return `${WEB_URL}/${path}`;
  return `${WEB_URL}${path}`;
}

export function isPathAllowedForTab(tabKey: TabKey, pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const isCohortArea = normalized === '/cohort' || normalized.startsWith('/cohort/');
  const isSettingsArea = normalized === '/settings' || normalized.startsWith('/settings/');
  const isFeedRoot = normalized === '/';
  if (tabKey === 'cohort') return !isFeedRoot && !isSettingsArea;
  if (tabKey === 'settings') return !isFeedRoot && !isCohortArea;
  return !isCohortArea && !isSettingsArea;
}

export function getWebHostname(): string {
  try {
    return new URL(WEB_URL).hostname;
  } catch {
    return 'who-tech.vercel.app';
  }
}
