import { useCallback, useMemo } from 'react';
import type { RoleGroup, Track } from '@/entities/member';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';
import { buildCohortPath, isCohortPath, parseCohortPath, parseCohortSearch } from './cohortLocation';

interface InitialState {
  initialCohort: number | null;
  initialRoleGroup: RoleGroup;
  initialTrack: Track | null;
}

// 기수·구분·트랙 선택 상태. URL이 단일 소스다: 상태를 따로 들고 있지 않고 URL에서 계산한다.
// 기수 탭은 push(뒤로가기로 돌아옴), 구분·트랙은 replace. 뒤로가기(popstate)는 urlStore 구독으로 들어온다.
// 서버 렌더·하이드레이션은 페이지가 받은 값으로 만든 URL을 쓴다
export function useCohortUrlState({ initialCohort, initialRoleGroup, initialTrack }: InitialState) {
  const url = useUrl(
    buildCohortPath(initialCohort, { roleGroup: initialRoleGroup, track: initialTrack }),
    isCohortPath,
  );

  const { activeCohort, roleGroup, track } = useMemo(() => {
    const { pathname, search } = splitUrl(url);
    return { activeCohort: parseCohortPath(pathname), ...parseCohortSearch(search) };
  }, [url]);

  const applyFilters = useCallback(
    (patch: Partial<{ roleGroup: RoleGroup; track: Track | null }>) => {
      urlStore.replace(
        buildCohortPath(activeCohort, { roleGroup: patch.roleGroup ?? roleGroup, track: patch.track ?? track }),
      );
    },
    [activeCohort, roleGroup, track],
  );

  const selectCohort = useCallback(
    (cohort: number | null) => {
      if (cohort === activeCohort) return;
      urlStore.push(buildCohortPath(cohort, { roleGroup, track }));
    },
    [activeCohort, roleGroup, track],
  );

  return { activeCohort, roleGroup, track, applyFilters, selectCohort };
}
