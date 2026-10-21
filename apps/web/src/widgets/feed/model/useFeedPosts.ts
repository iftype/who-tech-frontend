import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';
import { feedQuery } from '@/entities/post';
import type { FeedFilters } from './useFeedFilters';

interface Params {
  filters: FeedFilters;
  days: number | undefined;
}

// 필터에 맞는 피드 글. 첫 페이지는 서버 page.tsx가 같은 옵션(feedQuery)으로 prefetch해 HydrationBoundary로
// 캐시에 넣어 둔다 → 키가 맞으면 바로 그리고, 다르면(뒤로가기로 다른 필터 URL에 재마운트 등) 여기서 받는다.
// 목록 끝(sentinel)이 보이면 다음 페이지를 불러온다
export function useFeedPosts({ filters, days }: Params) {
  const { cohort, track } = filters;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery(
    feedQuery(days, track, cohort),
  );

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

  // 서버는 대표 트랙(Member.track)으로 거르고 화면은 멤버의 모든 트랙(tracks)으로 한 번 더 거른다 (의도된 이중 필터)
  const items = useMemo(() => {
    const posts = data?.pages.flatMap((page) => page.posts) ?? [];
    return track ? posts.filter((item) => item.member.tracks.includes(track)) : posts;
  }, [data, track]);

  const totalCount = data?.pages[0]?.totalCount ?? items.length;

  return { items, totalCount, isFetching, isFetchingNextPage, sentinelRef };
}
