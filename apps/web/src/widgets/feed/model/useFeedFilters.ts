import { useCallback, useMemo } from 'react';
import { parseCohortNumber, parseTrack } from '@/entities/member';
import type { Track } from '@/entities/member';
import { parseRange, rangeToDays, type FeedRange } from '@/entities/post';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';

export type Range = FeedRange;
export type FeedFilters = { range: Range; cohort: number | null; track: Track | null };

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

const isFeedPath = (pathname: string) => pathname === '/';

// 피드 필터(기간·기수·트랙). URL이 단일 소스다: 필터 변경은 replace로 URL에 쓰고, 화면은 URL에서 계산한다.
// 로고 클릭(urlStore.replace('/'))·뒤로가기(popstate)도 같은 구독으로 반영된다
export function useFeedFilters(initialRange: Range, initialCohort: number | null, initialTrack: Track | null) {
  const url = useUrl(
    `/${buildFeedSearch({ range: initialRange, cohort: initialCohort, track: initialTrack })}`,
    isFeedPath,
  );
  const filters = useMemo(() => parseFeedSearch(splitUrl(url).search), [url]);

  const applyFilters = useCallback(
    (patch: Partial<FeedFilters>) => {
      urlStore.replace(`${window.location.pathname}${buildFeedSearch({ ...filters, ...patch })}`);
    },
    [filters],
  );

  return { filters, applyFilters, days: rangeToDays(filters.range) };
}
