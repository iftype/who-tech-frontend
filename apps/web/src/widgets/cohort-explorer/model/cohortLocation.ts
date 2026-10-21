import { parseCohortNumber, parseRoleGroup, parseTrack } from '@/entities/member';
import type { RoleGroup, Track } from '@/entities/member';

// 트랙 없음(전체)은 null — 피드와 같은 센티널. URL 입력 `?track=all`은 parseTrack이 null로 읽고, 출력은 생략한다
type CohortFilters = { roleGroup: RoleGroup; track: Track | null };

/** `/cohort/<숫자>`의 기수. 목록(`/cohort`)이나 다른 경로면 null */
export function parseCohortPath(pathname: string): number | null {
  const match = pathname.match(/^\/cohort\/(\d+)$/);
  return match ? parseCohortNumber(match[1]) : null;
}

/** 기수 탐색 화면의 URL인지 (/cohort, /cohort/8) */
export function isCohortPath(pathname: string): boolean {
  return pathname === '/cohort' || /^\/cohort\/\d+$/.test(pathname);
}

// 쿼리가 없으면 기본값(크루·전체 트랙). buildCohortPath가 기본값을 쿼리에서 빼므로 왕복해도 같다
export function parseCohortSearch(search: string): CohortFilters {
  const params = new URLSearchParams(search);
  return { roleGroup: parseRoleGroup(params.get('roleGroup')), track: parseTrack(params.get('track')) };
}

export function buildCohortPath(cohort: number | null, { roleGroup, track }: CohortFilters): string {
  const params = new URLSearchParams();
  if (roleGroup !== 'crew') params.set('roleGroup', roleGroup);
  if (track) params.set('track', track);
  const query = params.toString();
  const path = cohort === null ? '/cohort' : `/cohort/${cohort}`;
  return query ? `${path}?${query}` : path;
}
