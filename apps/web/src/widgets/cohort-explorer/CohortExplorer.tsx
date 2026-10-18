'use client';

import { useEffect, useMemo } from 'react';
import type { Member, MemberSearchPage, RoleGroup, Track } from '@/entities/member';
import { CohortMemberGrid, CohortMemberList } from '@/entities/member';
import { CohortFilterBar, TRACK_OPTIONS } from '@/features/cohort-filter/CohortFilterBar';
import { CohortTabBar } from '@/features/cohort-filter/CohortTabBar';
import { useCohortMembers } from './model/useCohortMembers';
import { useCohortUrlState } from './model/useCohortUrlState';
import { CohortExplorerSkeleton } from './ui/CohortExplorerSkeleton';

interface CohortExplorerProps {
  initialPage: MemberSearchPage;
  allCohorts: number[];
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | 'all';
}

const isStaff = (m: Member) => m.roles.some((r) => r === 'coach' || r === 'reviewer');

export function CohortExplorer({
  initialPage,
  allCohorts,
  initialCohort,
  initialRoleGroup,
  initialTrack,
}: CohortExplorerProps) {
  const { activeCohort, roleGroup, track, applyFilters, selectCohort } = useCohortUrlState({
    initialCohort,
    initialRoleGroup,
    initialTrack,
  });
  const {
    cohorts,
    cohortMembers,
    firstMemberPage,
    crewCount,
    staffCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isMembersPending,
  } = useCohortMembers({
    activeCohort,
    roleGroup,
    track,
    initialPage,
    allCohorts,
    initialCohort,
    initialRoleGroup,
    initialTrack,
  });

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

  return (
    <>
      <CohortTabBar activeCohort={activeCohort} cohorts={cohorts} onChange={selectCohort} />
      {isMembersPending ? (
        <CohortExplorerSkeleton
          cohort={activeCohort ?? 0}
          counts={{ crew: crewCount, staff: staffCount }}
          visibleTrackOptions={visibleTrackOptions}
          filteredCount={filtered.length}
        />
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
                className="cursor-pointer rounded-md border border-border px-4 py-2 text-body-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text disabled:cursor-default disabled:opacity-60"
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
