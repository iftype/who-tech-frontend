'use client';

import { useMemo } from 'react';
import type { Member, RoleGroup, Track } from '@/entities/member';
import { CohortMemberGrid, CohortMemberList } from '@/entities/member';
import { CohortFilterBar, TRACK_OPTIONS } from '@/features/cohort-filter/CohortFilterBar';
import { CohortTabBar } from '@/features/cohort-filter/CohortTabBar';
import { useCohortMembers } from './model/useCohortMembers';
import { useCohortUrlState } from './model/useCohortUrlState';
import { CohortExplorerSkeleton } from './ui/CohortExplorerSkeleton';
import { buttonVariants } from '@/shared/ui';

// 데이터는 서버가 HydrationBoundary로 캐시에 넣어 준다. props는 URL 상태의 서버 스냅샷용
interface CohortExplorerProps {
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | 'all';
}

const isStaff = (m: Member) => m.roles.some((r) => r === 'coach' || r === 'reviewer');

export function CohortExplorer({ initialCohort, initialRoleGroup, initialTrack }: CohortExplorerProps) {
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
  } = useCohortMembers({ activeCohort, roleGroup, track });

  const roleScopedMembers = useMemo(() => {
    if (roleGroup === 'crew') return cohortMembers.filter((m) => m.roles.includes('crew') && !isStaff(m));
    return cohortMembers.filter((m) => isStaff(m));
  }, [cohortMembers, roleGroup]);

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
          visibleTrackOptions={TRACK_OPTIONS}
          filteredCount={filtered.length}
        />
      ) : (
        <>
          <CohortFilterBar
            cohort={activeCohort ?? 0}
            filters={{ roleGroup, track }}
            applyFilters={applyFilters}
            counts={{ crew: crewCount, staff: staffCount }}
            visibleTrackOptions={TRACK_OPTIONS}
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
                className={buttonVariants({ variant: 'more', size: 'lg' })}
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
