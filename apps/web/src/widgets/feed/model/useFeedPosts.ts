import { useCallback, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { postApi, postKeys } from '@/entities/post';
import type { FeedItem } from '@/entities/post';
import type { FeedFilters, Range } from './useFeedFilters';

interface Params {
  filters: FeedFilters;
  days: number | undefined;
  initialItems: FeedItem[];
  initialNextCursor: string | null;
  initialTotalCount?: number;
  initialCohort: string | null;
  initialTrack: FeedFilters['track'];
  initialRange: Range;
}

// 필터에 맞는 피드 글. 서버에서 받은 첫 페이지를 initialData로 쓰고, 목록 끝(sentinel)이 보이면 다음 페이지를 불러온다
export function useFeedPosts({
  filters,
  days,
  initialItems,
  initialNextCursor,
  initialTotalCount,
  initialCohort,
  initialTrack,
  initialRange,
}: Params) {
  const { range, cohort, track } = filters;
  const filtersMatchSSR = range === initialRange && cohort === initialCohort && track === initialTrack;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: postKeys.feed(days, track, cohort),
    queryFn: ({ pageParam }) =>
      postApi.feed({
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

  // 옵저버는 sentinel 요소가 붙을 때 한 번 만들고 떨어질 때 정리한다(React 19 ref cleanup).
  // 콜백은 ref로 최신 상태를 읽어, 페이지를 받을 때마다 옵저버를 다시 만들지 않는다
  const onIntersectRef = useRef<() => void>(() => {});
  onIntersectRef.current = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  const sentinelRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersectRef.current();
      },
      { rootMargin: '100px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  return { items, totalCount, isFetching, isFetchingNextPage, sentinelRef };
}
