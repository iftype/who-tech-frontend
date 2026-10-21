import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

/** 배지의 바탕 모양. 도메인 배지(트랙 색 등)는 이 위에 자기 색을 더한다 (`entities/member/ui/trackBadgeVariants`) */
export const BADGE_BASE_CLASS = 'inline-flex items-center px-1.5 py-0.5 rounded text-caption font-medium border';

// 작은 정보 표시용 배지. tone은 도메인을 모르는 두 가지뿐이다 — 도메인 색은 entities/*/ui가 정한다
export const badgeVariants = cva(BADGE_BASE_CLASS, {
  variants: {
    tone: {
      accent: 'font-mono text-accent-dm border-accent-border bg-accent-bg',
      neutral: 'text-text-secondary border-border bg-surface',
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
