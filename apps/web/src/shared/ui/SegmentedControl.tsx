import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

// 둘 이상 중 하나를 고르는 묶음 버튼 (크루/운영진, 최근 30일/전체)
export const segmentVariants = cva('cursor-pointer rounded px-2.5 py-1.5 text-caption', {
  variants: {
    active: {
      true: 'bg-border text-text',
      false: 'text-text-muted hover:text-text',
    },
  },
});

export function SegmentedControl({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">{children}</div>;
}
