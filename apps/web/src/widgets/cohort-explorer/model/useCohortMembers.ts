import { useEffect, useMemo } from 'react';
import { infiniteQueryOptions, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { memberApi, memberKeys } from '@/entities/member';
import type { Member, MemberSearchPage, RoleGroup, Track } from '@/entities/member';

const MEMBER_PAGE_SIZE = 120;
const EMPTY_MEMBERS: Member[] = [];

interface Params {
  activeCohort: number | null;
  roleGroup: RoleGroup;
  track: Track | 'all';
  initialPage: MemberSearchPage;
  allCohorts: number[];
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | 'all';
}

// 화면 쿼리와 인접 기수 미리 받기가 같은 캐시 모양(pages·pageParams)을 쓰도록 옵션을 하나로 둔다
function cohortMembersQuery(cohort: number | null, track: Track | 'all', roleGroup: RoleGroup) {
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

// 기수 목록과 선택한 기수의 멤버 페이지. 서버에서 받은 첫 페이지를 initialData로 쓰고, 인접 기수는 한가할 때 미리 받는다
export function useCohortMembers({
  activeCohort,
  roleGroup,
  track,
  initialPage,
  allCohorts,
  initialCohort,
  initialRoleGroup,
  initialTrack,
}: Params) {
  const queryClient = useQueryClient();
  const { data: fetchedCohorts } = useQuery({
    queryKey: memberKeys.cohorts(),
    queryFn: () => memberApi.cohorts(),
    initialData: allCohorts.length > 0 ? allCohorts : undefined,
    staleTime: 60_000,
  });

  const cohorts = fetchedCohorts?.length ? fetchedCohorts : allCohorts;

  const filtersMatchInitial =
    activeCohort === initialCohort && track === initialTrack && roleGroup === initialRoleGroup;

  const {
    data: memberPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isMembersPending,
  } = useInfiniteQuery({
    ...cohortMembersQuery(activeCohort, track, roleGroup),
    initialData: filtersMatchInitial
      ? {
          pages: [initialPage],
          pageParams: [0],
        }
      : undefined,
  });

  const firstMemberPage = memberPages?.pages[0] ?? (filtersMatchInitial ? initialPage : undefined);
  const cohortMembers = useMemo(
    () => memberPages?.pages.flatMap((page) => page.members) ?? EMPTY_MEMBERS,
    [memberPages],
  );

  useEffect(() => {
    if (cohorts.length === 0) return;

    if (activeCohort === null) return;

    const activeIndex = cohorts.indexOf(activeCohort);
    const adjacentCohorts = [cohorts[activeIndex - 1], cohorts[activeIndex + 1]].filter(
      (cohort): cohort is number => cohort != null,
    );

    const prefetch = () => {
      adjacentCohorts.forEach((cohort) => {
        void queryClient.prefetchInfiniteQuery(cohortMembersQuery(cohort, track, roleGroup));
      });
    };

    const scheduleIdle = window.requestIdleCallback;
    const cancelIdle = window.cancelIdleCallback;
    if (typeof scheduleIdle === 'function' && typeof cancelIdle === 'function') {
      const id = scheduleIdle(prefetch, { timeout: 2000 });
      return () => cancelIdle(id);
    }

    const id = globalThis.setTimeout(prefetch, 500);
    return () => globalThis.clearTimeout(id);
  }, [activeCohort, cohorts, queryClient, roleGroup, track]);

  const crewCount = firstMemberPage?.counts.crew ?? 0;

  const staffCount = firstMemberPage?.counts.staff ?? 0;

  return {
    cohorts,
    cohortMembers,
    firstMemberPage,
    crewCount,
    staffCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isMembersPending,
  };
}
