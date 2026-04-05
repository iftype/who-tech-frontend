'use client';

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Member } from '@/types';
import { api } from '@/lib/api';
import { CohortFilters } from './CohortFilters';
import { CohortTabBar } from './CohortTabBar';

interface Props {
  members: Member[];
  initialCohort: number | null;
}

function getCohortFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/cohort\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function CohortExplorer({ members, initialCohort }: Props) {
  const [activeCohort, setActiveCohort] = useState<number | null>(initialCohort);
  const deferredActiveCohort = useDeferredValue(activeCohort);

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
    () =>
      [
        ...new Set(allMembers.map((member) => member.cohort).filter((cohort): cohort is number => cohort !== null)),
      ].sort((a, b) => b - a),
    [allMembers],
  );

  const filteredMembers = useMemo(
    () =>
      deferredActiveCohort === null
        ? allMembers
        : allMembers.filter((member) => member.cohort === deferredActiveCohort),
    [deferredActiveCohort, allMembers],
  );

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
      <CohortFilters members={filteredMembers} cohort={activeCohort ?? 0} />
    </>
  );
}
