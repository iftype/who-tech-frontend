import { QueryClient, dehydrate, hydrate } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { cohortMembersQuery, cohortsQuery, memberKeys } from '@/entities/member';
import { feedQuery, postKeys } from '@/entities/post';
import { makeQueryClient } from './query-client';

// 서버 page.tsx의 prefetch → dehydrate → 브라우저 hydrate 경로를 고정한다
describe('server prefetch and hydration', () => {
  it('should share keys between page prefetch and widget queries', () => {
    expect(cohortMembersQuery(8, 'all', 'crew').queryKey).toEqual(memberKeys.cohortExplorer(8, 'all', 'crew'));
    expect(feedQuery(30, null, '8').queryKey).toEqual(postKeys.feed(30, null, '8'));
    expect(cohortsQuery().queryKey).toEqual(memberKeys.cohorts());
  });

  it('should start every key with its entity namespace so one invalidation clears the entity', () => {
    const memberKeysList = [
      memberKeys.cohorts(),
      memberKeys.detail('a'),
      memberKeys.search('q'),
      memberKeys.cohortExplorer(8, 'all', 'crew'),
    ];
    const postKeysList = [postKeys.feed(30, null, null), postKeys.byMember('a')];
    memberKeysList.forEach((key) => expect(key[0]).toBe(memberKeys.all[0]));
    postKeysList.forEach((key) => expect(key[0]).toBe(postKeys.all[0]));
    expect(memberKeys.all).not.toEqual(postKeys.all);
  });

  it('should store the infinite shape when prefetched (the #94 bug: prefetchQuery stored a plain page)', async () => {
    const server = new QueryClient();
    const options = cohortMembersQuery(8, 'all', 'crew');
    await server.prefetchInfiniteQuery({
      ...options,
      queryFn: async () => ({ members: [], totalCount: 0, counts: { crew: 0, staff: 0 }, nextOffset: null }),
    });
    const data = server.getQueryData(options.queryKey);
    expect(data?.pages).toHaveLength(1);
    expect(data?.pageParams).toEqual([0]);
  });

  it('should hand only successful queries to the browser so a failed server fetch is retried there', async () => {
    const server = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await server.prefetchQuery({ ...cohortsQuery(), queryFn: async () => [8, 7] });
    await server.prefetchInfiniteQuery({
      ...feedQuery(30, null, null),
      queryFn: async () => {
        throw new Error('backend down');
      },
    });

    const browser = new QueryClient();
    hydrate(browser, dehydrate(server));

    expect(browser.getQueryData(cohortsQuery().queryKey)).toEqual([8, 7]);
    expect(browser.getQueryState(feedQuery(30, null, null).queryKey)).toBeUndefined();
  });

  it('should keep the first feed pageParam undefined (cursor-less first page) across hydration', async () => {
    const server = new QueryClient();
    const options = feedQuery(30, null, null);
    await server.prefetchInfiniteQuery({
      ...options,
      queryFn: async () => ({ posts: [], nextCursor: 'c1', totalCount: 0 }),
    });
    const browser = new QueryClient();
    hydrate(browser, dehydrate(server));
    expect(browser.getQueryData(options.queryKey)?.pageParams).toEqual([undefined]);
  });

  it('should not refetch the hydrated feed page (staleTime Infinity)', async () => {
    const server = new QueryClient();
    const options = feedQuery(30, null, null);
    await server.prefetchInfiniteQuery({
      ...options,
      queryFn: async () => ({ posts: [], nextCursor: null, totalCount: 0 }),
    });
    const browser = makeQueryClient();
    hydrate(browser, dehydrate(server));
    const queryFn = vi.fn(async () => ({ posts: [], nextCursor: null, totalCount: 0 }));
    await browser.fetchInfiniteQuery({ ...options, queryFn });
    expect(queryFn).not.toHaveBeenCalled();
  });
});
