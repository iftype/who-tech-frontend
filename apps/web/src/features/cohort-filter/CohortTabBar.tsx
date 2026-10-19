'use client';

import { cn } from '@/shared/lib/utils';
import { TabBar, tabVariants } from '@/shared/ui';

interface CohortTabBarProps {
  activeCohort: number | null; // null = 전체
  cohorts?: number[];
  onChange: (cohort: number | null) => void;
}

const DEFAULT_COHORTS = [8, 7, 6, 5, 4, 3, 2, 1];

// 기수 탭. 탭 전환은 부모(useCohortUrlState)가 URL과 상태를 함께 바꾼다
export function CohortTabBar({ activeCohort, cohorts = DEFAULT_COHORTS, onChange }: CohortTabBarProps) {
  const tabClass = (active: boolean) => cn(tabVariants({ active }), 'transition-colors');

  return (
    <TabBar label="기수">
      <button
        role="tab"
        aria-selected={activeCohort === null}
        onClick={() => onChange(null)}
        className={tabClass(activeCohort === null)}
      >
        전체
      </button>
      {cohorts.map((c) => (
        <button
          key={c}
          role="tab"
          aria-selected={activeCohort === c}
          onClick={() => onChange(c)}
          className={tabClass(activeCohort === c)}
        >
          {c}기
        </button>
      ))}
    </TabBar>
  );
}
