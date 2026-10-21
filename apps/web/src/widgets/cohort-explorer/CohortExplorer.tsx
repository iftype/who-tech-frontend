'use client';

import { useMemo } from 'react';
import type { RoleGroup, Track } from '@/entities/member';
import { CohortMemberGrid, CohortMemberList, TRACK_OPTIONS, matchesRoleGroup } from '@/entities/member';
import { CohortFilterBar } from '@/features/cohort-filter';
import { CohortTabBar } from '@/features/cohort-filter';
import { buttonVariants } from '@/shared/ui';
import { useCohortMembers } from './model/useCohortMembers';
import { useCohortUrlState } from './model/useCohortUrlState';
import { CohortExplorerSkeleton } from './ui/CohortExplorerSkeleton';

// 데이터는 서버가 HydrationBoundary로 캐시에 넣어 준다. props는 URL 상태의 서버 스냅샷용
interface CohortExplorerProps {
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | 'all';
}

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

  const roleScopedMembers = useMemo(
    () => cohortMembers.filter((m) => matchesRoleGroup(m.roles, roleGroup)),
    [cohortMembers, roleGroup],
  );

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
          cohort={activeCohort}
          counts={{ crew: crewCount, staff: staffCount }}
          visibleTrackOptions={TRACK_OPTIONS}
          filteredCount={filtered.length}
        />
      ) : (
        <>
          <CohortFilterBar
            cohort={activeCohort}
            filters={{ roleGroup, track }}
            applyFilters={applyFilters}
            counts={{ crew: crewCount, staff: staffCount }}
            visibleTrackOptions={TRACK_OPTIONS}
            filteredCount={filtered.length}
            totalCount={filteredTotalCount}
          />
          {/* 둘 다 그리고 CSS 브레이크포인트로 하나만 보인다 (JS 분기 없음 — WebView 첫 화면 플래시 방지) */}
          <CohortMemberList members={filtered} emptyMessage={emptyMessage} />
          <CohortMemberGrid members={filtered} emptyMessage={emptyMessage} />
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
