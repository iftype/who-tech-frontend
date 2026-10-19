import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { MemberDetail, MemberSearchPage, RoleGroup, Track } from '../model/types';
import { memberApi } from './member.api';
import { memberKeys } from './member.keys';

export const MEMBER_PAGE_SIZE = 120;

export function cohortsQuery() {
  return queryOptions({
    queryKey: memberKeys.cohorts(),
    queryFn: () => memberApi.cohorts(),
    staleTime: 60_000,
  });
}

// 기수 탐색 멤버 페이지. 서버 prefetch, 화면 쿼리, 인접 기수 미리 받기가 같은 옵션(같은 캐시 모양)을 쓴다
export function cohortMembersQuery(cohort: number | null, track: Track | 'all', roleGroup: RoleGroup) {
  return infiniteQueryOptions({
    queryKey: memberKeys.cohortExplorer(cohort, track, roleGroup),
    queryFn: ({ pageParam }) =>
      memberApi.searchPage({
        ...(cohort != null ? { cohort } : {}),
        ...(track !== 'all' ? { track } : {}),
        roleGroup,
        limit: MEMBER_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: MemberSearchPage) => lastPage.nextOffset ?? undefined,
    staleTime: 60_000,
  });
}

// 멤버 상세. 서버 page.tsx가 prefetch해 HydrationBoundary로 넘긴다.
// 예전처럼 화면에서는 다시 받지 않는다(새로고침 버튼이 결과를 캐시에 직접 넣는다)
export function memberDetailQuery(githubId: string) {
  return queryOptions({
    queryKey: memberKeys.detail(githubId),
    queryFn: () => memberApi.detail(githubId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

// 새로고침 결과에 미션 아카이브가 비어 있으면(GitHub 응답이 덜 온 경우) 이전 아카이브를 유지한다
export function mergeRefreshedMember(prev: MemberDetail | undefined, next: MemberDetail): MemberDetail {
  if (prev && next.archive.length === 0 && prev.archive.length > 0) return { ...next, archive: prev.archive };
  return next;
}
