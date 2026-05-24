'use client';

import { startTransition, useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import type { Member, Track } from '@/types';
import { api } from '@/lib/api';
import { TRACK_OPTIONS } from './CohortFilterBar';

const CohortFilterBar = dynamic(() => import('./CohortFilterBar').then((mod) => ({ default: mod.CohortFilterBar })), {
  ssr: false,
});
import { CohortTabBar } from './CohortTabBar';
const CohortMemberList = dynamic(
  () => import('./CohortMemberList').then((mod) => ({ default: mod.CohortMemberList })),
  { ssr: false },
);
const CohortMemberGrid = dynamic(
  () => import('./CohortMemberGrid').then((mod) => ({ default: mod.CohortMemberGrid })),
  { ssr: false },
);

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
  members: Member[];
  allCohorts: number[];
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | 'all';
}

function getCohortFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/cohort\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

const isStaff = (m: Member) => m.roles.some((r) => r === 'coach' || r === 'reviewer');

export function CohortExplorer({ members, allCohorts, initialCohort, initialRoleGroup, initialTrack }: Props) {
  const [activeCohort, setActiveCohort] = useState<number | null>(initialCohort);
  const deferredActiveCohort = useDeferredValue(activeCohort);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setHydrated(true);
  }, []);

  const [roleGroup, setRoleGroup] = useState<RoleGroup>(initialRoleGroup);
  const [track, setTrack] = useState<Track | 'all'>(initialTrack);

  useEffect(() => {
    setRoleGroup((prev) => (prev === initialRoleGroup ? prev : initialRoleGroup));
  }, [initialRoleGroup]);

  useEffect(() => {
    setTrack((prev) => (prev === initialTrack ? prev : initialTrack));
  }, [initialTrack]);

  useEffect(() => {
    setActiveCohort((prev) => (prev === initialCohort ? prev : initialCohort));
  }, [initialCohort]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveCohort(getCohortFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const applyFilters = useCallback((patch: Partial<{ roleGroup: RoleGroup; track: Track | 'all' }>) => {
    setRoleGroup((prev) => (patch.roleGroup === undefined ? prev : patch.roleGroup));
    setTrack((prev) => (patch.track === undefined ? prev : patch.track));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (roleGroup !== 'crew') params.set('roleGroup', roleGroup);
    else params.delete('roleGroup');
    if (track !== 'all') params.set('track', track);
    else params.delete('track');
    const query = params.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [roleGroup, track]);

  const { data: fetchedCohorts } = useQuery({
    queryKey: ['cohorts'],
    queryFn: () => api.members.cohorts(),
    initialData: allCohorts.length > 0 ? allCohorts : undefined,
    staleTime: 60_000,
  });

  const cohorts = fetchedCohorts?.length ? fetchedCohorts : allCohorts;

  const { data: fetchedMembers } = useQuery({
    queryKey: ['members', 'cohort', deferredActiveCohort],
    queryFn: () => api.members.search(deferredActiveCohort != null ? { cohort: deferredActiveCohort } : {}),
    initialData: deferredActiveCohort === initialCohort ? members : undefined,
    staleTime: 60_000,
  });

  const activeMembers = fetchedMembers ?? members;

  const cohortMembers = useMemo(
    () =>
      deferredActiveCohort === null ? activeMembers : activeMembers.filter((m) => m.cohort === deferredActiveCohort),
    [deferredActiveCohort, activeMembers],
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
    const params = new URLSearchParams(window.location.search);
    if (roleGroup !== 'crew') params.set('roleGroup', roleGroup);
    else params.delete('roleGroup');
    if (track !== 'all') params.set('track', track);
    else params.delete('track');
    const query = params.toString();
    window.history.pushState(null, '', query ? `${nextPath}?${query}` : nextPath);
  };

  return (
    <>
      <CohortTabBar activeCohort={activeCohort} cohorts={cohorts} onChange={handleCohortChange} />
      {!hydrated ? (
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
            totalCount={roleGroup === 'crew' ? crewCount : staffCount}
          />
          <CohortMemberList members={filtered} emptyMessage={emptyMessage} />
          <CohortMemberGrid members={filtered} emptyMessage={emptyMessage} />
        </>
      )}
    </>
  );
}
