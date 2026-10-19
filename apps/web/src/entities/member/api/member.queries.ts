import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { MemberSearchPage, RoleGroup, Track } from '../model/types';
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
