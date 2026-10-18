'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { TabBar, tabVariants } from '@/shared/ui';

interface CohortTabBarProps {
  activeCohort: number | null; // null = 전체
  cohorts?: number[];
  onChange?: (cohort: number | null) => void;
}

const DEFAULT_COHORTS = [8, 7, 6, 5, 4, 3, 2, 1];

export function CohortTabBar({ activeCohort, cohorts = DEFAULT_COHORTS, onChange }: CohortTabBarProps) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  const tabClass = (active: boolean) => cn(tabVariants({ active }), 'transition-colors');

  return (
    <TabBar>
      {onChange ? (
        <button onClick={() => onChange(null)} className={tabClass(activeCohort === null)}>
          전체
        </button>
      ) : (
        <Link href={`/cohort${suffix}`} scroll={false} className={tabClass(activeCohort === null)}>
          전체
        </Link>
      )}
      {cohorts.map((c) =>
        onChange ? (
          <button key={c} onClick={() => onChange(c)} className={tabClass(activeCohort === c)}>
            {c}기
          </button>
        ) : (
          <Link key={c} href={`/cohort/${c}${suffix}`} scroll={false} className={tabClass(activeCohort === c)}>
            {c}기
          </Link>
        ),
      )}
    </TabBar>
  );
}
