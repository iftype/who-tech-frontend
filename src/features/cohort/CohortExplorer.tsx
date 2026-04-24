'use client';

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import type { Member, Track } from '@/types';
import { api } from '@/lib/api';
import { useFilterState } from '@/hooks/useFilterState';
import { TRACK_OPTIONS } from './CohortFilterBar';
import { CohortTabBar } from './CohortTabBar';
import { CohortMemberList } from './CohortMemberList';
import { CohortMemberGrid } from './CohortMemberGrid';

type RoleGroup = 'crew' | 'staff';

const CohortFilterBar = dynamic(() => import('./CohortFilterBar').then((m) => ({ default: m.CohortFilterBar })), {
  ssr: false,
  loading: () => <div className="mb-5 h-[88px]" />,
});

interface Props {
  members: Member[];
  initialCohort: number | null;
}

function getCohortFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/cohort\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

const isStaff = (m: Member) => m.roles.some((r) => r === 'coach' || r === 'reviewer');

export function CohortExplorer({ members, initialCohort }: Props) {
  const [activeCohort, setActiveCohort] = useState<number | null>(initialCohort);
  const deferredActiveCohort = useDeferredValue(activeCohort);

  const [filters, applyFilters] = useFilterState('crew', {
    roleGroup: 'crew' as RoleGroup,
    track: 'all' as Track | 'all',
  });

  const { roleGroup, track } = filters;

  const { data: allMembers = members } = useQuery({
    queryKey: ['members', 'cohort-explorer'],
    queryFn: () => api.members.search({}),
    initialData: members,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setActiveCohort(initialCohort);
  }, [initialCohort]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveCohort(getCohortFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const cohorts = useMemo(
    () => [...new Set(allMembers.map((m) => m.cohort).filter((c): c is number => c !== null))].sort((a, b) => b - a),
    [allMembers],
  );

  const cohortMembers = useMemo(
    () => (deferredActiveCohort === null ? allMembers : allMembers.filter((m) => m.cohort === deferredActiveCohort)),
    [deferredActiveCohort, allMembers],
  );

  const crewCount = useMemo(
    () => cohortMembers.filter((m) => m.roles.includes('crew') && !isStaff(m)).length,
    [cohortMembers],
  );

  const staffCount = useMemo(() => cohortMembers.filter((m) => isStaff(m)).length, [cohortMembers]);

  const roleScopedMembers = useMemo(() => {
    if (roleGroup === 'crew') return cohortMembers.filter((m) => m.roles.includes('crew') && !isStaff(m));
    return cohortMembers.filter((m) => isStaff(m));
  }, [cohortMembers, roleGroup]);

  const visibleTrackOptions = useMemo(() => {
    const availableTracks = new Set(roleScopedMembers.flatMap((m) => m.tracks));
    return TRACK_OPTIONS.filter(({ value }) => value === 'all' || availableTracks.has(value));
  }, [roleScopedMembers]);

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

  const handleCohortChange = (cohort: number | null) => {
    startTransition(() => {
      setActiveCohort(cohort);
    });
    const nextPath = cohort === null ? '/cohort' : `/cohort/${cohort}`;
    window.history.pushState(null, '', nextPath);
  };

  return (
    <>
      <CohortTabBar activeCohort={activeCohort} cohorts={cohorts} onChange={handleCohortChange} />
      <CohortFilterBar
        cohort={activeCohort ?? 0}
        filters={filters}
        applyFilters={applyFilters}
        counts={{ crew: crewCount, staff: staffCount }}
        visibleTrackOptions={visibleTrackOptions}
        filteredCount={filtered.length}
        totalCount={roleGroup === 'crew' ? crewCount : staffCount}
      />
      <CohortMemberList members={filtered} emptyMessage={emptyMessage} />
      <CohortMemberGrid members={filtered} emptyMessage={emptyMessage} />
    </>
  );
}
