import { describe, expect, it } from 'vitest';
import { buildFeedSearch, parseFeedSearch } from './useFeedFilters';

describe('feed URL search', () => {
  it('should read the defaults from an empty search', () => {
    expect(parseFeedSearch('')).toEqual({ range: '30d', cohort: null, track: null });
  });

  it('should round-trip every non-default value and omit defaults when building', () => {
    const filters = { range: 'all' as const, cohort: '7', track: 'frontend' as const };
    expect(buildFeedSearch(filters)).toBe('?cohort=7&track=frontend&range=all');
    expect(parseFeedSearch(buildFeedSearch(filters))).toEqual(filters);
    expect(buildFeedSearch({ range: '30d', cohort: null, track: null })).toBe('');
  });

  it('should drop unknown range and track values but pass the cohort through as written', () => {
    // 기수는 아직 검증하지 않는다 (PR 5에서 숫자만 받도록 바뀐다)
    expect(parseFeedSearch('?range=weekly&track=ios&cohort=abc')).toEqual({ range: '30d', cohort: 'abc', track: null });
  });
});
