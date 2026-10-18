import { useCallback, useEffect, useState } from 'react';
import type { Track } from '@/entities/member';

export type Range = '30d' | 'all';
export type FeedFilters = { range: Range; cohort: string | null; track: Track | null };

// 피드 필터(기간·기수·트랙). replaceState로 URL에 기록하고, 외부에서 URL이 바뀌면(popstate) URL 기준으로 되돌린다
export function useFeedFilters(initialRange: Range, initialCohort: string | null, initialTrack: Track | null) {
  const [filters, setFilters] = useState({
    range: initialRange,
    cohort: initialCohort,
    track: initialTrack,
  });

  useEffect(() => {
    setFilters((prev) => {
      const next = { range: initialRange, cohort: initialCohort, track: initialTrack };
      if (prev.range === next.range && prev.cohort === next.cohort && prev.track === next.track) return prev;
      return next;
    });
  }, [initialRange, initialCohort, initialTrack]);

  const { range } = filters;
  const days = range === '30d' ? 30 : undefined;

  const applyFilters = useCallback((patch: Partial<{ range: Range; cohort: string | null; track: Track | null }>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.cohort) params.set('cohort', filters.cohort);
    if (filters.track) params.set('track', filters.track);
    if (filters.range !== '30d') params.set('range', filters.range);
    const query = params.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [filters]);

  // 필터는 replaceState로만 URL에 기록되어 Next 라우터가 추적하지 않는다.
  // 로고 클릭 등으로 URL이 외부에서 바뀌면(popstate) window.location 기준으로 필터를 되돌린다.
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const next = {
        range: (params.get('range') === 'all' ? 'all' : '30d') as Range,
        cohort: params.get('cohort'),
        track: (params.get('track') as Track | null) ?? null,
      };
      setFilters((prev) =>
        prev.range === next.range && prev.cohort === next.cohort && prev.track === next.track ? prev : next,
      );
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  return { filters, applyFilters, days };
}
