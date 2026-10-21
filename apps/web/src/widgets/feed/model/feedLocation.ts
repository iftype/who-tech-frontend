import { parseCohortNumber, parseTrack } from '@/entities/member';
import type { Track } from '@/entities/member';
import { parseRange, type FeedRange } from '@/entities/post';

export type Range = FeedRange;
export type FeedFilters = { range: Range; cohort: number | null; track: Track | null };

/** 피드 화면의 URL인지 (/) */
export const isFeedPath = (pathname: string) => pathname === '/';

export function parseFeedSearch(search: string): FeedFilters {
  const params = new URLSearchParams(search);
  return {
    range: parseRange(params.get('range')),
    cohort: parseCohortNumber(params.get('cohort')),
    track: parseTrack(params.get('track')),
  };
}

// 기본값(30일·기수 없음·트랙 없음)은 쿼리에 쓰지 않는다
export function buildFeedSearch({ range, cohort, track }: FeedFilters): string {
  const params = new URLSearchParams();
  if (cohort !== null) params.set('cohort', String(cohort));
  if (track) params.set('track', track);
  if (range !== '30d') params.set('range', range);
  const query = params.toString();
  return query ? `?${query}` : '';
}
