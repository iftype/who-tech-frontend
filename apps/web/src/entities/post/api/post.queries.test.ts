import { describe, expect, it } from 'vitest';
import { postKeys } from './post.keys';
import { feedQuery, memberPostsQuery } from './post.queries';

describe('post queries', () => {
  it('memberPostsQuery uses the by-member key and stays fresh for five minutes', () => {
    const options = memberPostsQuery('crew');
    expect(options.queryKey).toEqual(postKeys.byMember('crew'));
    expect(options.staleTime).toBe(5 * 60 * 1000);
    expect(options.refetchOnWindowFocus).toBe(false);
  });

  it('feedQuery never refetches the hydrated first page by itself', () => {
    const options = feedQuery(30, 'frontend', 8);
    expect(options.queryKey).toEqual(postKeys.feed(30, 'frontend', 8));
    expect(options.staleTime).toBe(Infinity);
    expect(options.refetchOnWindowFocus).toBe(false);
    expect(options.initialPageParam).toBeUndefined();
  });
});
