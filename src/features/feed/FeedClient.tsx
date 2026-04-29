'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useFilterState } from '@/hooks/useFilterState';
import { FeedFilterBar } from '@/features/feed/FeedFilterBar';
import { FeedListSection } from '@/features/feed/FeedListSection';
import { FeedSidebar } from '@/features/feed/FeedSidebar';
import { api } from '@/lib/api';
import { getBlogSource } from '@/lib/utils';
import type { FeedItem, Track } from '@/types';

type Range = '7d' | '30d';

interface FeedSkeletonProps {
  cohorts: number[];
  filteredCount: number;
}

function FeedFilterBarSkeleton({ cohorts, filteredCount }: FeedSkeletonProps) {
  const tabCls = '-mb-px border-b-2 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap sm:py-2';
  return (
    <>
      <div className="pointer-events-none mb-5 overflow-x-auto border-b border-border">
        <div className="flex min-w-max items-center gap-1 sm:gap-0">
          {['전체', ...cohorts.map((c) => `${c}기`)].map((label) => (
            <div key={label} className={`${tabCls} border-transparent text-text-muted`}>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-text sm:text-[26px]">피드</h1>
          <p className="mt-1 text-[12px] text-text-secondary">모든 크루의 최신 블로그 글</p>
        </div>
        <div className="pointer-events-none flex items-center gap-1 rounded-md border border-border bg-surface p-1">
          <div className="rounded px-2.5 py-1.5 text-[11px] text-text-muted">최근 7일</div>
          <div className="rounded px-2.5 py-1.5 text-[11px] text-text-muted">30일</div>
        </div>
      </div>
      <div className="pointer-events-none mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-0.5">
          {(['전체', '프론트엔드', '백엔드', '안드로이드'] as const).map((label) => (
            <div key={label} className="rounded-md px-2.5 py-1 text-[12px] font-medium text-text-muted">
              {label}
            </div>
          ))}
        </div>
        <p className="ml-auto whitespace-nowrap text-[12px] text-text-muted">
          <span className="font-mono text-text">{filteredCount}</span>개
        </p>
      </div>
    </>
  );
}

interface Props {
  initialItems: FeedItem[];
}

export function FeedClient({ initialItems }: Props) {
  const [filters, applyFilters, , hydrated] = useFilterState('feed', {
    range: '7d' as Range,
    cohort: null as string | null,
    track: null as Track | null,
  });

  const { range, cohort, track } = filters;
  const days = range === '30d' ? 30 : 7;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['feed', days, track],
    queryFn: ({ pageParam }) =>
      api.members.feed({
        days,
        track: track ?? undefined,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

  const items = data?.pages.flatMap((page) => page.posts) ?? initialItems;
  const now = Date.now();

  const staffPosts = initialItems
    .filter((item) => {
      const diffDays = (now - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    })
    .filter((item) => {
      const roles = item.member.roles ?? [];
      return (roles.includes('coach') || roles.includes('reviewer')) && item.member.cohort === 8;
    })
    .slice(0, 5);

  const filtered = cohort ? items.filter((item) => item.member.cohort === Number(cohort)) : items;

  const cohorts = [...new Set(items.map((item) => item.member.cohort).filter((c): c is number => c !== null))].sort(
    (a, b) => b - a,
  );

  const grouped = new Map<number, FeedItem[]>();
  for (const item of items) {
    const key = item.member.cohort;
    if (key == null) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  const platformStats = Object.entries(
    filtered.reduce<Record<string, number>>((acc, item) => {
      const source = getBlogSource(item.url) ?? '기타';
      acc[source] = (acc[source] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <section className="min-w-0">
        {!hydrated ? (
          <>
            <FeedFilterBarSkeleton cohorts={cohorts} filteredCount={filtered.length} />
            <div className="flex flex-col">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 border-b border-border-dim px-4 py-3.5 last:border-b-0">
                  <div className="mt-0.5 h-[30px] w-[30px] flex-shrink-0 animate-pulse rounded-full bg-surface-alt" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 h-4 w-3/4 animate-pulse rounded bg-surface-alt" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-surface-alt" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <FeedFilterBar
              filters={filters}
              applyFilters={applyFilters}
              cohorts={cohorts}
              filteredCount={filtered.length}
            />
            <FeedListSection cohort={cohort} cohorts={cohorts} filtered={filtered} grouped={grouped} />
            {hasNextPage && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-md border border-border bg-surface px-4 py-2 text-[13px] font-medium text-text hover:bg-surface-alt disabled:opacity-50"
                >
                  {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <FeedSidebar staffPosts={staffPosts} platformStats={platformStats} />
    </div>
  );
}
