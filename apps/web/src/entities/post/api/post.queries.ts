import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { Track } from '@/entities/member';
import { postApi } from './post.api';
import { postKeys } from './post.keys';

export const FEED_PAGE_SIZE = 50;

// 멤버 상세의 블로그 글 탭. 상세 페이지 안에서만 쓰여 5분 동안 다시 받지 않는다
export function memberPostsQuery(githubId: string) {
  return queryOptions({
    queryKey: postKeys.byMember(githubId),
    queryFn: () => postApi.byMember(githubId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// 피드 무한 쿼리. 서버 page.tsx의 prefetch와 화면의 useInfiniteQuery가 같은 옵션을 써서
// 키·캐시 모양(pages·pageParams)이 어긋나지 않는다.
// staleTime Infinity: 서버가 내려 준 첫 페이지를 화면에 붙인 뒤 다시 받지 않는다
export function feedQuery(days: number | undefined, track: Track | null, cohort: string | null) {
  const cohortNumber = cohort ? Number(cohort) : NaN;
  return infiniteQueryOptions({
    queryKey: postKeys.feed(days, track, cohort),
    queryFn: ({ pageParam }) =>
      postApi.feed({
        ...(days ? { days } : {}),
        track: track ?? undefined,
        cohort: Number.isFinite(cohortNumber) ? cohortNumber : undefined,
        cursor: pageParam,
        limit: FEED_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
