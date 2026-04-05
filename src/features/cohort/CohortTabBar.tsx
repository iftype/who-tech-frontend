'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  activeCohort: number | null; // null = 전체
  cohorts?: number[];
  onChange?: (cohort: number | null) => void;
}

const DEFAULT_COHORTS = [8, 7, 6, 5, 4, 3, 2, 1];

export function CohortTabBar({ activeCohort, cohorts = DEFAULT_COHORTS, onChange }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(activeCohort);

  useEffect(() => {
    setOptimistic(activeCohort);
  }, [activeCohort]);

  const navigate = (cohort: number | null) => {
    setOptimistic(cohort);
    if (onChange) {
      onChange(cohort);
      return;
    }
    startTransition(() => {
      router.push(cohort === null ? '/cohort' : `/cohort/${cohort}`);
    });
  };

  const tabClass = (active: boolean) =>
    `-mb-px cursor-pointer rounded-t-md border-b-2 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:rounded-none sm:px-4 sm:py-2 ${
      active ? 'border-accent-dm text-accent-dm' : 'border-transparent text-text-muted hover:text-text'
    }`;

  return (
    <div className="mb-5 overflow-x-auto border-b border-border overscroll-x-contain overscroll-y-none [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max items-center gap-1 sm:gap-0">
        <button onClick={() => navigate(null)} className={tabClass(optimistic === null)}>
          전체
        </button>
        {cohorts.map((c) => (
          <button key={c} onClick={() => navigate(c)} className={tabClass(optimistic === c)}>
            {c}기
          </button>
        ))}
      </div>
    </div>
  );
}
