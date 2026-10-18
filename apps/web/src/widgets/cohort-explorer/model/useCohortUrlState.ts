import { useCallback, useEffect, useState } from 'react';
import type { RoleGroup, Track } from '@/entities/member';
import { buildCohortPath, getCohortFromPath, getFiltersFromSearch, readStateFromLocation } from './cohortLocation';

interface InitialState {
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | 'all';
}

// 기수·구분·트랙 선택 상태. URL을 단일 소스로 삼아 뒤로가기(popstate)와 탭 전환(pushState)을 맞춘다
export function useCohortUrlState({ initialCohort, initialRoleGroup, initialTrack }: InitialState) {
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

  const selectCohort = useCallback(
    (cohort: number | null) => {
      if (cohort === activeCohort) return;
      setActiveCohort(cohort);
      pushUrl(cohort, roleGroup, track);
    },
    [activeCohort, pushUrl, roleGroup, track],
  );

  return { activeCohort, roleGroup, track, applyFilters, selectCohort };
}
