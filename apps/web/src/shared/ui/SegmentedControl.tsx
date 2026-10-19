import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

// 둘 이상 중 하나를 고르는 묶음 버튼 (크루/운영진, 최근 30일/전체). flush는 테두리 상자에 붙는 모양(미션 탭)
export const segmentVariants = cva('cursor-pointer py-1.5 text-caption', {
  variants: {
    shape: { pill: 'rounded px-2.5', flush: 'px-3' },
    active: { true: 'bg-border text-text', false: 'text-text-muted' },
  },
  compoundVariants: [
    { active: false, shape: 'pill', className: 'hover:text-text' },
    { active: false, shape: 'flush', className: 'hover:text-text-secondary' },
  ],
  defaultVariants: { shape: 'pill' },
});

// 큰 선택지 묶음 (설정의 테마·디자인 선택). OptionGroup 안에 나란히 놓는다
export const optionVariants = cva(
  'cursor-pointer flex flex-1 items-center justify-center text-body-sm transition-colors',
  {
    variants: {
      layout: { row: 'gap-2 px-4 py-2.5', stacked: 'flex-col px-3 py-3' },
      active: {
        true: 'bg-surface text-text font-medium',
        false: 'bg-transparent text-text-muted hover:text-text',
      },
    },
    defaultVariants: { layout: 'row' },
  },
);

export function OptionGroup({ children }: { children: ReactNode }) {
  return <div className="flex rounded-lg border border-border overflow-hidden">{children}</div>;
}

export function SegmentedControl({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">{children}</div>;
}
