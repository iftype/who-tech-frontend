import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

// 작은 정보 표시용 배지. tone으로 의미 색을 고른다 (도메인 배지는 entities/*/ui에서 tone을 정해 감싼다)
export const badgeVariants = cva('inline-flex items-center px-1.5 py-0.5 rounded text-caption font-medium border', {
  variants: {
    tone: {
      accent: 'font-mono text-accent-dm border-accent-border bg-accent-bg',
      neutral: 'text-text-secondary border-border bg-surface',
      frontend: 'text-track-frontend border-track-frontend/20 bg-track-frontend/10',
      backend: 'text-track-backend border-track-backend/20 bg-track-backend/10',
      android: 'text-track-android border-track-android/20 bg-track-android/10',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return <span className={badgeVariants({ tone })}>{children}</span>;
}
