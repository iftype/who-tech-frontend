import { parseTrackOrAll } from '@/entities/member';
import type { RoleGroup, Track } from '@/entities/member';

export function getCohortFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/cohort\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function getFiltersFromSearch(search: string, initialRoleGroup: RoleGroup, initialTrack: Track | 'all') {
  const params = new URLSearchParams(search);
  const roleGroup: RoleGroup = params.get('roleGroup') === 'staff' ? 'staff' : initialRoleGroup;
  const track = parseTrackOrAll(params.get('track'), initialTrack);

  return { roleGroup, track };
}

export function buildCohortPath(cohort: number | null, roleGroup: RoleGroup, track: Track | 'all') {
  const params = new URLSearchParams();
  if (roleGroup !== 'crew') params.set('roleGroup', roleGroup);
  if (track !== 'all') params.set('track', track);
  const query = params.toString();
  const path = cohort === null ? '/cohort' : `/cohort/${cohort}`;
  return query ? `${path}?${query}` : path;
}

// 탭 전환은 raw History API로만 URL을 바꾸므로(실제 라우트 이동 아님), 멤버 상세→뒤로가기로
// /cohort 라우트가 remount되면 route props는 전체(null)가 된다. 표시 상태는 항상 URL을
// 단일 소스로 복원해야 8기/트랙 선택이 유지된다. SSR(window 없음)에서는 route props로 폴백
// — 실제 페이지 로드에선 URL과 props가 일치하므로 하이드레이션 불일치가 없다.
export function readStateFromLocation(
  initialCohort: number | null,
  initialRoleGroup: RoleGroup,
  initialTrack: Track | 'all',
): { cohort: number | null; roleGroup: RoleGroup; track: Track | 'all' } {
  if (typeof window === 'undefined') {
    return { cohort: initialCohort, roleGroup: initialRoleGroup, track: initialTrack };
  }
  const { roleGroup, track } = getFiltersFromSearch(window.location.search, initialRoleGroup, initialTrack);
  return { cohort: getCohortFromPath(window.location.pathname), roleGroup, track };
}
