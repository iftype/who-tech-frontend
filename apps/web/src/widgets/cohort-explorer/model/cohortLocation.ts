import { parseRoleGroup, parseTrackOrAll } from '@/entities/member';
import type { RoleGroup, Track } from '@/entities/member';

export function getCohortFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/cohort\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

/** 기수 탐색 화면의 URL인지 (/cohort, /cohort/8) */
export function isCohortPath(pathname: string): boolean {
  return pathname === '/cohort' || /^\/cohort\/\d+$/.test(pathname);
}

// 쿼리가 없으면 기본값(크루·전체 트랙). buildCohortPath가 기본값을 쿼리에서 빼므로 왕복해도 같다
export function getFiltersFromSearch(search: string): { roleGroup: RoleGroup; track: Track | 'all' } {
  const params = new URLSearchParams(search);
  return { roleGroup: parseRoleGroup(params.get('roleGroup')), track: parseTrackOrAll(params.get('track')) };
}

export function buildCohortPath(cohort: number | null, roleGroup: RoleGroup, track: Track | 'all') {
  const params = new URLSearchParams();
  if (roleGroup !== 'crew') params.set('roleGroup', roleGroup);
  if (track !== 'all') params.set('track', track);
  const query = params.toString();
  const path = cohort === null ? '/cohort' : `/cohort/${cohort}`;
  return query ? `${path}?${query}` : path;
}
