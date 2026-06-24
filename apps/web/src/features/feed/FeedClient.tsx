'use client';

import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedFilterBar } from '@/features/feed/FeedFilterBar';
import { FeedListSection } from '@/features/feed/FeedListSection';
import { FeedSidebar } from '@/features/feed/FeedSidebar';
import { api } from '@/lib/api';
import { getBlogSource } from '@/lib/utils';
import type { FeedItem, Track } from '@/types';

type Range = '30d' | 'all';

interface Props {
  initialItems: FeedItem[];
  initialNextCursor: string | null;
  initialTotalCount?: number;
  initialCohorts: number[];
  initialCohort: string | null;
  initialTrack: Track | null;
  initialRange: Range;
}

export function FeedClient({
  initialItems,
  initialNextCursor,
  initialTotalCount,
  initialCohorts,
  initialCohort,
  initialTrack,
  initialRange,
}: Props) {
  const [filters, setFilters] = useState({
    range: initialRange,
    cohort: initialCohort,
    track: initialTrack,
  });

  useEffect(() => {
    setFilters((prev) => {
      const next = { range: initialRange, cohort: initialCohort, track: initialTrack };
      if (prev.range === next.range && prev.cohort === next.cohort && prev.track === next.track) return prev;
      return next;
    });
  }, [initialRange, initialCohort, initialTrack]);

  const { range, cohort, track } = filters;
  const days = range === '30d' ? 30 : undefined;

  const applyFilters = useCallback((patch: Partial<{ range: Range; cohort: string | null; track: Track | null }>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.cohort) params.set('cohort', filters.cohort);
    if (filters.track) params.set('track', filters.track);
    if (filters.range !== '30d') params.set('range', filters.range);
    const query = params.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [filters]);

  // 필터는 replaceState로만 URL에 기록되어 Next 라우터가 추적하지 않는다.
  // 로고 클릭 등으로 URL이 외부에서 바뀌면(popstate) window.location 기준으로 필터를 되돌린다.
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const next = {
        range: (params.get('range') === 'all' ? 'all' : '30d') as Range,
        cohort: params.get('cohort'),
        track: (params.get('track') as Track | null) ?? null,
      };
      setFilters((prev) =>
        prev.range === next.range && prev.cohort === next.cohort && prev.track === next.track ? prev : next,
      );
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const filtersMatchSSR = range === initialRange && cohort === initialCohort && track === initialTrack;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['feed', days, track, cohort],
    queryFn: ({ pageParam }) =>
      api.members.feed({
        ...(days ? { days } : {}),
        track: track ?? undefined,
        cohort: cohort ? Number(cohort) : undefined,
        cursor: pageParam,
        limit: 50,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialData:
      filtersMatchSSR && initialItems.length > 0
        ? {
            pages: [{ posts: initialItems, nextCursor: initialNextCursor, totalCount: initialTotalCount }],
            pageParams: [undefined],
          }
        : undefined,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { rootMargin: '100px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const items = useMemo(() => {
    let posts = data?.pages ? data.pages.flatMap((page) => page.posts) : [];
    if (!data?.pages) {
      if (isFetching && !filtersMatchSSR) return [];
      posts = initialItems;
    }
    if (track) {
      posts = posts.filter((item) => item.member.tracks.includes(track));
    }

    return posts;
  }, [data, isFetching, initialItems, filtersMatchSSR, track]);

  const totalCount = data?.pages?.[0]?.totalCount ?? items.length;

  const staffPosts = useMemo(() => {
    const now = Date.now();
    return items
      .filter((item) => {
        const diffDays = (now - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      })
      .filter((item) => {
        const roles = item.member.roles ?? [];
        return (roles.includes('coach') || roles.includes('reviewer')) && item.member.cohort === 8;
      })
      .slice(0, 5);
  }, [items]);

  const cohorts = initialCohorts;

  const grouped = useMemo(() => {
    const map = new Map<number, FeedItem[]>();
    for (const item of items) {
      const key = item.member.cohort;
      if (key == null) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  const platformStats = useMemo(
    () =>
      Object.entries(
        items.reduce<Record<string, number>>((acc, item) => {
          const source = getBlogSource(item.url) ?? '기타';
          acc[source] = (acc[source] ?? 0) + 1;
          return acc;
        }, {}),
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4),
    [items],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <section className="min-w-0">
        <FeedFilterBar
          filters={filters}
          applyFilters={applyFilters}
          cohorts={cohorts}
          filteredCount={items.length}
          totalCount={totalCount}
        />
        {items.length > 0 ? (
          <>
            <FeedListSection cohort={cohort} cohorts={cohorts} filtered={items} grouped={grouped} />
            <div ref={sentinelRef} className="h-10" />
            {isFetchingNextPage && <div className="py-4 text-center text-[13px] text-text-muted">로딩 중...</div>}
          </>
        ) : isFetching ? (
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
        ) : (
          <div className="py-16 text-center text-[14px] text-text-muted">등록된 블로그 글이 없습니다</div>
        )}
      </section>
      <FeedSidebar staffPosts={staffPosts} platformStats={platformStats} />
    </div>
  );
}
