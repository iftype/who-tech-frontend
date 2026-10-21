import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

// 목록이 비었을 때의 안내 상자. frame: 카드 테두리 안(card)·맨바닥(plain), size: 세로 여백
export const emptyStateVariants = cva('text-center text-body text-text-muted', {
  variants: {
    frame: { card: 'rounded-xl border border-border bg-surface', plain: '' },
    size: { tall: 'py-16', box: 'px-4 py-12' },
  },
  defaultVariants: { frame: 'card', size: 'box' },
});

interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  children: ReactNode;
  /** 레이아웃 위치만 (예: 그리드의 col-span-full). 모양은 variant로 */
  className?: string;
}

export function EmptyState({ frame, size, className, children }: EmptyStateProps) {
  return <div className={cn(className, emptyStateVariants({ frame, size }))}>{children}</div>;
}
