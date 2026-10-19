import type { RoleGroup, Track } from '../model/types';

// React Query 키를 한곳에서 만든다. 서버에서 내려준 initialData·prefetch와 맞물리므로 값을 바꾸면 캐시가 어긋난다
export const memberKeys = {
  cohorts: () => ['cohorts'] as const,
  detail: (githubId: string) => ['members', 'detail', githubId] as const,
  search: (query: string) => ['members', 'search', query] as const,
  cohortExplorer: (cohort: number | null, track: Track | 'all', roleGroup: RoleGroup) =>
    ['members', 'cohort-explorer', cohort, track, roleGroup] as const,
};
