import { useEffect, useMemo } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { cohortMembersQuery, cohortsQuery } from '@/entities/member';
import type { Member, RoleGroup, Track } from '@/entities/member';

const EMPTY_MEMBERS: Member[] = [];
const EMPTY_COHORTS: number[] = [];

interface Params {
  activeCohort: number | null;
  roleGroup: RoleGroup;
  track: Track | 'all';
}

// 기수 목록과 선택한 기수의 멤버 페이지. 서버 page.tsx가 같은 옵션으로 prefetch해 HydrationBoundary로 넣어 주고,
// 인접 기수는 한가할 때 미리 받는다 (prefetchInfiniteQuery — 화면 쿼리와 같은 캐시 모양)
export function useCohortMembers({ activeCohort, roleGroup, track }: Params) {
  const queryClient = useQueryClient();
  const { data: cohorts = EMPTY_COHORTS } = useQuery(cohortsQuery());

  const {
    data: memberPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isMembersPending,
  } = useInfiniteQuery(cohortMembersQuery(activeCohort, track, roleGroup));

  const firstMemberPage = memberPages?.pages[0];
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
