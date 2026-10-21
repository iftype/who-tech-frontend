import type { RoleGroup, Track } from '../model/types';

// React Query 키를 한곳에서 만든다. 서버 prefetch(하이드레이션)와 화면 쿼리가 같은 키를 쓰므로 값을 바꾸면 캐시가 어긋난다.
// 모든 키가 all로 시작해서 invalidateQueries({ queryKey: memberKeys.all })로 멤버 관련 캐시를 한 번에 비울 수 있다
const all = ['members'] as const;

export const memberKeys = {
  all,
  cohorts: () => [...all, 'cohorts'] as const,
  detail: (githubId: string) => [...all, 'detail', githubId] as const,
  search: (query: string) => [...all, 'search', query] as const,
  cohortExplorer: (cohort: number | null, track: Track | null, roleGroup: RoleGroup) =>
    [...all, 'cohort-explorer', cohort, track, roleGroup] as const,
};
