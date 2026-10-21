import { useCallback, useMemo } from 'react';
import type { Track } from '@/entities/member';
import { rangeToDays } from '@/entities/post';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';
import { buildFeedSearch, isFeedPath, parseFeedSearch } from './feedLocation';
import type { FeedFilters, Range } from './feedLocation';

export type { FeedFilters, Range } from './feedLocation';

interface InitialState {
  initialRange: Range;
  initialCohort: number | null;
  initialTrack: Track | null;
}

// 피드 필터(기간·기수·트랙). URL이 단일 소스다: 필터 변경은 replace로 URL에 쓰고, 화면은 URL에서 계산한다.
// 로고 클릭(urlStore.replace('/'))·뒤로가기(popstate)도 같은 구독으로 반영된다.
// 서버 렌더·하이드레이션은 페이지가 파싱한 값으로 만든 URL을 쓴다 (useCohortUrlState·useProfileTabs와 같은 모양)
export function useFeedFilters({ initialRange, initialCohort, initialTrack }: InitialState) {
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
