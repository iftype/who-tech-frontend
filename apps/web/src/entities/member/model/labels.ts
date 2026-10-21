import { TRACKS } from './parse';
import type { Role, Track } from './types';

// 화면에 보이는 도메인 이름. 배지·필터 칩·헤더가 모두 여기서 읽는다 (같은 트랙이 화면마다 다르게 불리지 않게)
export const TRACK_LABEL: Record<Track, string> = { frontend: '프론트엔드', backend: '백엔드', android: '안드로이드' };
export const TRACK_SHORT_LABEL: Record<Track, string> = { frontend: 'FE', backend: 'BE', android: 'AN' };
export const ROLE_LABEL: Record<Role, string> = { crew: '크루', coach: '코치', reviewer: '리뷰어' };

export type TrackOption = { label: string; value: Track | null };

/** 트랙 필터 칩: "전체" 다음에 TRACKS 순서 */
export const TRACK_OPTIONS: TrackOption[] = [
  { label: '전체', value: null },
  ...TRACKS.map((track) => ({ label: TRACK_LABEL[track], value: track })),
];
