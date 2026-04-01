'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type SearchParams = {
  cohort?: string;
  track?: string;
  range?: string;
};

function buildFeedHref(current: SearchParams, next: Partial<SearchParams>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...next };
  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `/feed?${query}` : '/feed';
}

interface Props {
  current: SearchParams;
  cohorts: number[];
}

export function FeedFilters({ current, cohorts }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useState(current);

  useEffect(() => {
    setOptimistic(current);
  }, [current]);

  const navigate = (next: Partial<SearchParams>) => {
    const merged = { ...optimistic, ...next };
    // undefined 값은 제거
    if ('cohort' in next && next.cohort === undefined) delete merged.cohort;
    if ('track' in next && next.track === undefined) delete merged.track;
    setOptimistic(merged);
    startTransition(() => {
      router.push(buildFeedHref(current, next));
    });
  };

  const activeCohort = optimistic.cohort;
  const activeRange = optimistic.range === '30d' ? '30d' : '7d';
  const activeTrack = optimistic.track;

  const tabClass = (active: boolean) =>
    `-mb-px rounded-t-md border-b-2 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:rounded-none sm:px-4 sm:py-2 ${
      active ? 'border-accent-dm text-accent-dm' : 'border-transparent text-text-muted hover:text-text'
    }`;

  return (
    <>
      {/* 기수 탭 */}
      <div className="mb-5 overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1 sm:gap-0">
          <button onClick={() => navigate({ cohort: undefined })} className={tabClass(!activeCohort)}>
            전체
          </button>
          {cohorts.map((c) => (
            <button
              key={c}
              onClick={() => navigate({ cohort: String(c) })}
              className={tabClass(activeCohort === String(c))}
            >
              {c}기
            </button>
          ))}
        </div>
      </div>

      {/* 헤더 */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-text sm:text-[26px]">
            {activeCohort ? `${activeCohort}기 피드` : '피드'}
          </h1>
          <p className="mt-1 text-[12px] text-text-secondary">모든 크루의 최신 블로그 글</p>
        </div>
        {/* 기간 필터 */}
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
          {(['7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => navigate({ range: r })}
              className={`rounded px-2.5 py-1.5 text-[11px] transition-colors ${
                activeRange === r ? 'bg-border text-text' : 'text-text-muted hover:text-text'
              }`}
            >
              {r === '7d' ? '최근 7일' : '30일'}
            </button>
          ))}
        </div>
      </div>

      {/* 트랙 필터 */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-0.5">
          {(
            [
              [undefined, '전체'],
              ['frontend', '프론트엔드'],
              ['backend', '백엔드'],
              ['android', '안드로이드'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value ?? 'all'}
              onClick={() => navigate({ track: value })}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                (activeTrack ?? undefined) === value ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
