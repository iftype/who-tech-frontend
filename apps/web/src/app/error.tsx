'use client';

import { useEffect } from 'react';
import { buttonVariants } from '@/shared/ui';

// 페이지를 그리다 예상치 못한 오류가 나면 레이아웃(Navbar)은 남기고 이 화면을 보여 준다.
// 데이터 요청 실패는 여기까지 오지 않는다 (prefetch 실패 → 화면이 다시 받음)
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <p className="font-mono text-display font-bold text-border">Error</p>
      <p className="text-body-lg text-text-secondary">화면을 그리는 중 문제가 생겼습니다</p>
      <button type="button" onClick={reset} className={buttonVariants()}>
        다시 시도
      </button>
    </div>
  );
}
