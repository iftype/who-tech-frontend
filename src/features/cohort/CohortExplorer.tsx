'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Member } from '@/types';
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
      [...new Set(members.map((member) => member.cohort).filter((cohort): cohort is number => cohort !== null))].sort(
        (a, b) => b - a,
      ),
    [members],
  );

  const filteredMembers = useMemo(
    () => (activeCohort === null ? members : members.filter((member) => member.cohort === activeCohort)),
    [activeCohort, members],
  );

  const handleCohortChange = (cohort: number | null) => {
    setActiveCohort(cohort);
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
