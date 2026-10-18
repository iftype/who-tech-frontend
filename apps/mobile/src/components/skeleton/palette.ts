import type { DesignSystem } from '../../contexts/ThemeContext';

export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderDim: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accentBg: string;
  shimmerFrom: string;
  shimmerTo: string;
};

export const PALETTES: Record<DesignSystem, { light: Palette; dark: Palette }> = {
  paper: {
    light: {
      bg: '#f5f4f0',
      surface: '#ffffff',
      surfaceAlt: '#f0efeb',
      border: '#e0deda',
      borderDim: '#e8e7e3',
      text: '#1a1917',
      textSecondary: '#6b6862',
      textMuted: '#9e9b96',
      accentBg: 'rgba(42, 193, 188, 0.08)',
      shimmerFrom: '#ece9e3',
      shimmerTo: '#f7f6f2',
    },
    dark: {
      bg: '#000000',
      surface: '#0d0d0d',
      surfaceAlt: '#111111',
      border: '#1c1c1c',
      borderDim: '#1a1a1a',
      text: '#ededed',
      textSecondary: '#888888',
      textMuted: '#555555',
      accentBg: 'rgba(42, 193, 188, 0.1)',
      shimmerFrom: '#141414',
      shimmerTo: '#1c1c1c',
    },
  },
  apple: {
    light: {
      bg: '#f5f5f7',
      surface: '#ffffff',
      surfaceAlt: '#f5f5f7',
      border: 'rgba(0, 0, 0, 0.06)',
      borderDim: 'rgba(0, 0, 0, 0.08)',
      text: '#1d1d1f',
      textSecondary: 'rgba(0, 0, 0, 0.8)',
      textMuted: 'rgba(0, 0, 0, 0.48)',
      accentBg: 'rgba(0, 113, 227, 0.08)',
      shimmerFrom: '#e8e8ec',
      shimmerTo: '#f4f4f7',
    },
    dark: {
      bg: '#000000',
      surface: '#272729',
      surfaceAlt: '#1d1d1f',
      border: 'rgba(255, 255, 255, 0.12)',
      borderDim: 'rgba(255, 255, 255, 0.06)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      textMuted: 'rgba(255, 255, 255, 0.48)',
      accentBg: 'rgba(41, 151, 255, 0.1)',
      shimmerFrom: '#2d2d30',
      shimmerTo: '#3a3a3d',
    },
  },
  sentry: {
    light: {
      bg: '#2d2248',
      surface: '#362d59',
      surfaceAlt: '#1f1633',
      border: '#362d59',
      borderDim: '#2a2050',
      text: '#ffffff',
      textSecondary: '#e5e7eb',
      textMuted: 'rgba(255, 255, 255, 0.48)',
      accentBg: 'rgba(106, 95, 193, 0.18)',
      shimmerFrom: '#3d3262',
      shimmerTo: '#4a3f72',
    },
    dark: {
      bg: '#1f1633',
      surface: '#2a1f45',
      surfaceAlt: '#150f23',
      border: '#362d59',
      borderDim: '#2a2050',
      text: '#ffffff',
      textSecondary: '#e5e7eb',
      textMuted: 'rgba(255, 255, 255, 0.48)',
      accentBg: 'rgba(106, 95, 193, 0.18)',
      shimmerFrom: '#332853',
      shimmerTo: '#3d3262',
    },
  },
};
