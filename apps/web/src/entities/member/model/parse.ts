import type { RoleGroup, Track } from './types';

// URL·쿠키처럼 밖에서 들어온 문자열을 도메인 타입으로 바꾼다. `as` 로 단언하지 않고 값을 확인한다
export const TRACKS = ['frontend', 'backend', 'android'] as const satisfies readonly Track[];

export function isTrack(value: unknown): value is Track {
  return typeof value === 'string' && (TRACKS as readonly string[]).includes(value);
}

/** 알 수 없는 값은 null (트랙 필터 없음) */
export function parseTrack(value: string | null | undefined): Track | null {
  return isTrack(value) ? value : null;
}

/** 'all' 또는 트랙. 알 수 없는 값은 fallback */
export function parseTrackOrAll(value: string | null | undefined, fallback: Track | 'all' = 'all'): Track | 'all' {
  if (value === 'all') return 'all';
  return parseTrack(value) ?? fallback;
}

export function parseRoleGroup(value: string | null | undefined, fallback: RoleGroup = 'crew'): RoleGroup {
  if (value === 'staff' || value === 'crew') return value;
  return fallback;
}
