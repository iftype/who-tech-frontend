import { cva } from 'class-variance-authority';
import { BADGE_BASE_CLASS } from '@/shared/ui';

// 트랙 배지 색. 트랙은 멤버 도메인의 사실이라 shared Badge의 tone이 아니라 여기서 정한다.
// 트랙이 없으면(none) shared Badge의 neutral과 같은 색 — 지금 화면의 빈 배지 그대로
export const trackBadgeVariants = cva(BADGE_BASE_CLASS, {
  variants: {
    track: {
      frontend: 'text-track-frontend border-track-frontend/20 bg-track-frontend/10',
      backend: 'text-track-backend border-track-backend/20 bg-track-backend/10',
      android: 'text-track-android border-track-android/20 bg-track-android/10',
      none: 'text-text-secondary border-border bg-surface',
    },
  },
  defaultVariants: { track: 'none' },
});
