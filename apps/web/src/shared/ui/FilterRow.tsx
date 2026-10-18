import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

// 목록 필터 줄과 그 안의 선택 칩 (트랙 필터 등)
export const filterChipVariants = cva('cursor-pointer rounded-md px-2.5 py-1 text-label font-medium', {
  variants: {
    active: {
      true: 'bg-accent-bg text-accent-dm',
      false: 'text-text-muted hover:text-text',
    },
  },
});

export function FilterRow({ children }: { children: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">{children}</div>;
}
