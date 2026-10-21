import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NOW, daysAgo, makeFeedItem } from '@/test/fixtures/post';
import { useFeedSummary } from './useFeedSummary';

describe('useFeedSummary', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('should pick the five newest posts by cohort-8 staff from the last week', () => {
    const items = [
      makeFeedItem(1, { roles: ['coach'] }),
      makeFeedItem(2, { roles: ['reviewer'] }, { publishedAt: daysAgo(7) }),
      makeFeedItem(3, { roles: ['reviewer'] }, { publishedAt: daysAgo(8) }),
      makeFeedItem(4, { roles: ['coach'], cohort: 7 }),
      makeFeedItem(5, { roles: ['crew'] }),
      ...[6, 7, 8, 9, 10].map((n) => makeFeedItem(n, { roles: ['coach'] })),
    ];

    const { result } = renderHook(() => useFeedSummary(items));

    expect(result.current.staffPosts.map((p) => p.id)).toEqual([1, 2, 6, 7, 8]);
  });

  it('should group by the primary cohort and skip members without one', () => {
    const items = [makeFeedItem(1, { cohort: 8 }), makeFeedItem(2, { cohort: 7 }), makeFeedItem(3, { cohort: null })];
    const { result } = renderHook(() => useFeedSummary(items));
    expect([...result.current.grouped.entries()].map(([c, posts]) => [c, posts.map((p) => p.id)])).toEqual([
      [8, [1]],
      [7, [2]],
    ]);
  });

  it('should rank the top four platforms and count unknown hosts as 기타', () => {
    const items = [
      ...[1, 2, 3].map((n) => makeFeedItem(n)),
      makeFeedItem(4, {}, { url: 'https://a.tistory.com/1' }),
      makeFeedItem(5, {}, { url: 'https://a.tistory.com/2' }),
      makeFeedItem(6, {}, { url: 'https://medium.com/@a/1' }),
      makeFeedItem(7, {}, { url: 'https://a.github.io/1' }),
      makeFeedItem(8, {}, { url: 'https://example.com/1' }),
    ];
    const { result } = renderHook(() => useFeedSummary(items));
    expect(result.current.platformStats).toEqual([
      ['Velog', 3],
      ['Tistory', 2],
      ['Medium', 1],
      ['GitHub', 1],
    ]);
  });
});
