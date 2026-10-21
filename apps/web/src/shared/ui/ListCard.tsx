import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

// 행들을 담는 둥근 카드 (피드 목록, 모바일 멤버 목록). stack이면 행을 세로로 쌓는 flex
export const listCardVariants = cva('overflow-hidden rounded-xl border border-border bg-surface', {
  variants: { stack: { true: 'flex flex-col', false: '' } },
  defaultVariants: { stack: false },
});

interface ListCardProps extends VariantProps<typeof listCardVariants> {
  children: ReactNode;
  /** 레이아웃 위치·반응형 숨김만 (예: sm:hidden). 모양은 variant로 */
  className?: string;
}

export function ListCard({ stack, className, children }: ListCardProps) {
  return <div className={cn(className, listCardVariants({ stack }))}>{children}</div>;
}
