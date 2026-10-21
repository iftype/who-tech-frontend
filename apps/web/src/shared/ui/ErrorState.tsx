import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { buttonVariants } from './buttonVariants';
import { emptyStateVariants } from './EmptyState';

interface ErrorStateProps extends VariantProps<typeof emptyStateVariants> {
  /** 다시 시도 — 보통 쿼리의 refetch */
  onRetry: () => void;
  /** 레이아웃 위치만 (예: 그리드의 col-span-full). 모양은 variant로 */
  className?: string;
}

// 요청이 실패했을 때의 안내 상자. 빈 상태(EmptyState)와 같은 틀에 문구와 다시 시도 버튼.
// 예전에는 실패도 "없습니다"로 보여 사용자가 비어 있는 줄 알았다 (ADR 0008 알려진 한계 → 라운드 5에서 닫음)
export function ErrorState({ frame, size, className, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className={cn(className, emptyStateVariants({ frame, size }))}>
      <p>불러오지 못했습니다</p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(buttonVariants({ variant: 'secondary', size: 'md' }), 'mt-3')}
      >
        다시 시도
      </button>
    </div>
  );
}
