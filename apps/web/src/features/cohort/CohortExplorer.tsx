'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Member, RoleGroup, Track } from '@/entities/member';
import { memberApi, memberKeys, type MemberSearchPage } from '@/entities/member';
import { CohortFilterBar, TRACK_OPTIONS } from './CohortFilterBar';
import { CohortTabBar } from './CohortTabBar';
import { CohortMemberList } from './CohortMemberList';
import { CohortMemberGrid } from './CohortMemberGrid';

interface SkeletonProps {
  cohort: number;
  counts: { crew: number; staff: number };
  visibleTrackOptions: { label: string; value: Track | 'all' }[];
  filteredCount: number;
}

function CohortFilterBarSkeleton({ cohort, counts, visibleTrackOptions, filteredCount }: SkeletonProps) {
  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-text sm:text-[24px]">
            {cohort === 0 ? '전체 크루' : `${cohort}기 크루`}
          </h1>
          <p className="mt-1 text-[12px] text-text-muted">
            우아한테크코스 {cohort === 0 ? '전체' : `${cohort}기`} 멤버 목록
          </p>
        </div>
        <div className="pointer-events-none flex items-center gap-1 rounded-md border border-border bg-surface p-1">
          <div className="rounded px-2.5 py-1.5 text-[11px] text-text-muted">크루 {counts.crew}</div>
          <div className="rounded px-2.5 py-1.5 text-[11px] text-text-muted">운영진 {counts.staff}</div>
        </div>
      </div>
      <div className="pointer-events-none mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-0.5">
          {visibleTrackOptions.map(({ label, value }) => (
            <div key={value} className="rounded-md px-2.5 py-1 text-[12px] font-medium text-text-muted">
              {label}
            </div>
          ))}
        </div>
        <p className="ml-auto whitespace-nowrap text-[12px] text-text-muted">
          <span className="font-mono text-text">{filteredCount}</span>명
        </p>
      </div>
    </>
  );
}

interface Props {
  initialPage: MemberSearchPage;
  allCohorts: number[];
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | 'all';
}

const isStaff = (m: Member) => m.roles.some((r) => r === 'coach' || r === 'reviewer');
const MEMBER_PAGE_SIZE = 120;
const EMPTY_MEMBERS: Member[] = [];

function getCohortFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/cohort\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function getFiltersFromSearch(search: string, initialRoleGroup: RoleGroup, initialTrack: Track | 'all') {
  const params = new URLSearchParams(search);
  const roleGroup: RoleGroup = params.get('roleGroup') === 'staff' ? 'staff' : initialRoleGroup;
  const trackParam = params.get('track') as Track | 'all' | null;
  const track: Track | 'all' =
    trackParam === 'frontend' || trackParam === 'backend' || trackParam === 'android' || trackParam === 'all'
      ? trackParam
      : initialTrack;

  return { roleGroup, track };
}

function buildCohortPath(cohort: number | null, roleGroup: RoleGroup, track: Track | 'all') {
  const params = new URLSearchParams();
  if (roleGroup !== 'crew') params.set('roleGroup', roleGroup);
  if (track !== 'all') params.set('track', track);
  const query = params.toString();
  const path = cohort === null ? '/cohort' : `/cohort/${cohort}`;
  return query ? `${path}?${query}` : path;
}

// 탭 전환은 raw History API로만 URL을 바꾸므로(실제 라우트 이동 아님), 멤버 상세→뒤로가기로
// /cohort 라우트가 remount되면 route props는 전체(null)가 된다. 표시 상태는 항상 URL을
// 단일 소스로 복원해야 8기/트랙 선택이 유지된다. SSR(window 없음)에서는 route props로 폴백
// — 실제 페이지 로드에선 URL과 props가 일치하므로 하이드레이션 불일치가 없다.
function readStateFromLocation(
  initialCohort: number | null,
  initialRoleGroup: RoleGroup,
  initialTrack: Track | 'all',
): { cohort: number | null; roleGroup: RoleGroup; track: Track | 'all' } {
  if (typeof window === 'undefined') {
    return { cohort: initialCohort, roleGroup: initialRoleGroup, track: initialTrack };
  }
  const { roleGroup, track } = getFiltersFromSearch(window.location.search, initialRoleGroup, initialTrack);
  return { cohort: getCohortFromPath(window.location.pathname), roleGroup, track };
}

export function CohortExplorer({ initialPage, allCohorts, initialCohort, initialRoleGroup, initialTrack }: Props) {
  const queryClient = useQueryClient();
  const [activeCohort, setActiveCohort] = useState<number | null>(
    () => readStateFromLocation(initialCohort, initialRoleGroup, initialTrack).cohort,
  );
  const [roleGroup, setRoleGroup] = useState<RoleGroup>(
    () => readStateFromLocation(initialCohort, initialRoleGroup, initialTrack).roleGroup,
  );
  const [track, setTrack] = useState<Track | 'all'>(
    () => readStateFromLocation(initialCohort, initialRoleGroup, initialTrack).track,
  );

  useEffect(() => {
    const handlePopState = () => {
      setActiveCohort(getCohortFromPath(window.location.pathname));
      const next = getFiltersFromSearch(window.location.search, initialRoleGroup, initialTrack);
      setRoleGroup(next.roleGroup);
      setTrack(next.track);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialRoleGroup, initialTrack]);

  const replaceUrl = useCallback((cohort: number | null, nextRoleGroup: RoleGroup, nextTrack: Track | 'all') => {
    window.history.replaceState(null, '', buildCohortPath(cohort, nextRoleGroup, nextTrack));
  }, []);

  const pushUrl = useCallback((cohort: number | null, nextRoleGroup: RoleGroup, nextTrack: Track | 'all') => {
    window.history.pushState(null, '', buildCohortPath(cohort, nextRoleGroup, nextTrack));
  }, []);

  const applyFilters = useCallback(
    (patch: Partial<{ roleGroup: RoleGroup; track: Track | 'all' }>) => {
      const nextRoleGroup = patch.roleGroup ?? roleGroup;
      const nextTrack = patch.track ?? track;
      setRoleGroup(nextRoleGroup);
      setTrack(nextTrack);
      replaceUrl(activeCohort, nextRoleGroup, nextTrack);
    },
    [activeCohort, replaceUrl, roleGroup, track],
  );

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
    queryKey: memberKeys.cohortExplorer(activeCohort, track, roleGroup),
    queryFn: ({ pageParam }) =>
      memberApi.searchPage({
        ...(activeCohort != null ? { cohort: activeCohort } : {}),
        ...(track !== 'all' ? { track } : {}),
        roleGroup,
        limit: MEMBER_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialData: filtersMatchInitial
      ? {
          pages: [initialPage],
          pageParams: [0],
        }
      : undefined,
    staleTime: 60_000,
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
        void queryClient.prefetchQuery({
          queryKey: memberKeys.cohortExplorer(cohort, track, roleGroup),
          queryFn: () =>
            memberApi.searchPage({
              cohort,
              ...(track !== 'all' ? { track } : {}),
              roleGroup,
              limit: MEMBER_PAGE_SIZE,
              offset: 0,
            }),
          staleTime: 60_000,
        });
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

  const roleScopedMembers = useMemo(() => {
    if (roleGroup === 'crew') return cohortMembers.filter((m) => m.roles.includes('crew') && !isStaff(m));
    return cohortMembers.filter((m) => isStaff(m));
  }, [cohortMembers, roleGroup]);

  const visibleTrackOptions = TRACK_OPTIONS;

  useEffect(() => {
    if (track === 'all') return;
    if (visibleTrackOptions.some((o) => o.value === track)) return;
    applyFilters({ track: 'all' });
  }, [track, visibleTrackOptions, applyFilters]);

  const filtered = useMemo(
    () => roleScopedMembers.filter((m) => track === 'all' || m.tracks.includes(track)),
    [roleScopedMembers, track],
  );

  const emptyMessage = roleScopedMembers.length === 0 ? '해당 기수의 멤버가 없습니다.' : '조건에 맞는 멤버가 없습니다.';
  const filteredTotalCount = roleGroup === 'crew' ? crewCount : staffCount;

  const handleCohortChange = useCallback(
    (cohort: number | null) => {
      if (cohort === activeCohort) return;
      setActiveCohort(cohort);
      pushUrl(cohort, roleGroup, track);
    },
    [activeCohort, pushUrl, roleGroup, track],
  );

  return (
    <>
      <CohortTabBar activeCohort={activeCohort} cohorts={cohorts} onChange={handleCohortChange} />
      {isMembersPending ? (
        <>
          <CohortFilterBarSkeleton
            cohort={activeCohort ?? 0}
            counts={{ crew: crewCount, staff: staffCount }}
            visibleTrackOptions={visibleTrackOptions}
            filteredCount={filtered.length}
          />
          <div className="sm:hidden flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
            {[72, 56, 88, 64, 76].map((w) => (
              <div key={w} className="flex items-center gap-3 border-b border-border-dim px-4 py-3 last:border-0">
                <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-surface-alt" />
                <div className="min-w-0 flex-1">
                  <div className="h-3.5 animate-pulse rounded bg-surface-alt" style={{ width: w }} />
                  <div className="mt-1 flex gap-1">
                    <div className="h-4 w-8 animate-pulse rounded-full bg-surface-alt" />
                    <div className="h-4 w-14 animate-pulse rounded-full bg-surface-alt" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:grid gap-3 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex min-h-[148px] flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-surface p-4"
              >
                <div className="h-12 w-12 animate-pulse rounded-full bg-surface-alt" />
                <div className="w-full text-center">
                  <div className="mx-auto h-3.5 w-16 animate-pulse rounded bg-surface-alt" />
                  <div className="mx-auto mt-1 h-2.5 w-12 animate-pulse rounded bg-surface-alt" />
                </div>
                <div className="h-4 w-10 animate-pulse rounded-full bg-surface-alt" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <CohortFilterBar
            cohort={activeCohort ?? 0}
            filters={{ roleGroup, track }}
            applyFilters={applyFilters}
            counts={{ crew: crewCount, staff: staffCount }}
            visibleTrackOptions={visibleTrackOptions}
            filteredCount={filtered.length}
            totalCount={filteredTotalCount}
          />
          <div className="sm:hidden">
            <CohortMemberList members={filtered} emptyMessage={emptyMessage} />
          </div>
          <div className="hidden sm:block">
            <CohortMemberGrid members={filtered} emptyMessage={emptyMessage} />
          </div>
          {hasNextPage && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className="cursor-pointer rounded-md border border-border px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text disabled:cursor-default disabled:opacity-60"
              >
                {isFetchingNextPage
                  ? '불러오는 중...'
                  : `더 보기 (${filtered.length}/${filteredTotalCount || firstMemberPage?.totalCount || filtered.length})`}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
