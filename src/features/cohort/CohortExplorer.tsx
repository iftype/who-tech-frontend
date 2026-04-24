'use client';

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Member, Track } from '@/types';
import { api } from '@/lib/api';
import { useFilterState } from '@/hooks/useFilterState';
import { CohortFilterBar, TRACK_OPTIONS } from './CohortFilterBar';
import { CohortTabBar } from './CohortTabBar';
import { CohortMemberList } from './CohortMemberList';
import { CohortMemberGrid } from './CohortMemberGrid';

type RoleGroup = 'crew' | 'staff';

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
          <div className="rounded bg-border px-2.5 py-1.5 text-[11px] text-text">크루 {counts.crew}</div>
          <div className="rounded px-2.5 py-1.5 text-[11px] text-text-muted">운영진 {counts.staff}</div>
        </div>
      </div>
      <div className="pointer-events-none mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-0.5">
          {visibleTrackOptions.map(({ label, value }) => (
            <div
              key={value}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${value === 'all' ? 'bg-accent-bg text-accent-dm' : 'text-text-dim'}`}
            >
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

  const [filters, applyFilters, , hydrated] = useFilterState('crew', {
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
      {!hydrated ? (
        <CohortFilterBarSkeleton
          cohort={activeCohort ?? 0}
          counts={{ crew: crewCount, staff: staffCount }}
          visibleTrackOptions={visibleTrackOptions}
          filteredCount={filtered.length}
        />
      ) : (
        <CohortFilterBar
          cohort={activeCohort ?? 0}
          filters={filters}
          applyFilters={applyFilters}
          counts={{ crew: crewCount, staff: staffCount }}
          visibleTrackOptions={visibleTrackOptions}
          filteredCount={filtered.length}
          totalCount={roleGroup === 'crew' ? crewCount : staffCount}
        />
      )}
      <CohortMemberList members={filtered} emptyMessage={emptyMessage} />
      <CohortMemberGrid members={filtered} emptyMessage={emptyMessage} />
    </>
  );
}
