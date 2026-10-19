import { cva } from 'class-variance-authority';

// 목록의 한 줄을 통째로 누르는 버튼 (검색 결과). active는 키보드로 고른 줄
export const listItemVariants = cva(
  'flex w-full cursor-pointer items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0',
  {
    variants: {
      active: { true: 'bg-surface-alt', false: 'hover:bg-surface-alt' },
    },
  },
);
