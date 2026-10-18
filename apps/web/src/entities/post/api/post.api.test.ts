import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { postApi } from './post.api';

const fetchMock = vi.fn();

function jsonResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body };
}

function lastUrl() {
  return fetchMock.mock.calls.at(-1)?.[0] as string;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('postApi', () => {
  it('should decode HTML entities in blog post titles', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ latest: [{ title: 'A &amp; B' }], archive: [{ title: '&lt;Java&gt;' }], page: 1, totalPages: 1 }),
    );

    const posts = await postApi.byMember('crew1');

    expect(lastUrl()).toBe('/api/members/crew1/blog-posts');
    expect(posts.latest[0]!.title).toBe('A & B');
    expect(posts.archive[0]!.title).toBe('<Java>');
    expect(posts.page).toBe(1);
  });

  it('should load the feed with filters and decoded titles', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ posts: [{ id: 1, title: 'Tom &amp; Jerry' }], nextCursor: 'c2', totalCount: 9 }),
    );

    const feed = await postApi.feed({ cohort: 8, days: 7, cursor: 'c1' });
    expect(lastUrl()).toBe('/api/members/feed?cohort=8&days=7&cursor=c1');
    expect(fetchMock.mock.calls[0]![1].next).toEqual({ revalidate: 300 });
    expect(feed).toEqual({ posts: [{ id: 1, title: 'Tom & Jerry' }], nextCursor: 'c2', totalCount: 9 });

    await postApi.feed();
    expect(lastUrl()).toBe('/api/members/feed');
  });
});
