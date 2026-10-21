import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

/** 본문 폭: 디자인 시스템별 --container-max. 헤더·패치 안내처럼 본문과 폭을 맞춰야 하는 띠도 같은 값을 쓴다 */
export const CONTAINER_MAX_STYLE = { maxWidth: 'var(--container-max, 1200px)' } as const;

// 페이지 본문 폭과 여백. 폭은 디자인 시스템별 --container-max를 따른다
const pageContainerVariants = cva('mx-auto', {
  variants: {
    spacing: {
      page: 'px-4 py-8 sm:px-6 sm:py-10',
      detail: 'px-4 py-6 sm:px-6 sm:py-10',
      plain: 'px-6 py-10',
    },
  },
  defaultVariants: { spacing: 'page' },
});

interface PageContainerProps extends VariantProps<typeof pageContainerVariants> {
  children: ReactNode;
}

export function PageContainer({ spacing, children }: PageContainerProps) {
  return (
    <div className={pageContainerVariants({ spacing })} style={CONTAINER_MAX_STYLE}>
      {children}
    </div>
  );
}
