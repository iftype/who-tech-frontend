import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

// 가로로 스크롤되는 밑줄 탭 (기수 탭 등). 탭은 button·Link 어디에나 붙일 수 있게 클래스로 제공한다
export const tabVariants = cva(
  '-mb-px cursor-pointer rounded-t-md border-b-2 px-4 py-2.5 text-body-sm font-medium whitespace-nowrap sm:rounded-none sm:px-4 sm:py-2',
  {
    variants: {
      active: {
        true: 'border-accent-dm text-accent-dm',
        false: 'border-transparent text-text-muted hover:text-text',
      },
    },
  },
);

export function TabBar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 overflow-x-auto border-b border-border overscroll-x-contain overscroll-y-none [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max items-center gap-1 sm:gap-0">{children}</div>
    </div>
  );
}
