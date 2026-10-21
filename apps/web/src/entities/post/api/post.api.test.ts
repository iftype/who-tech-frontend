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
      jsonResponse({ posts: [{ id: 1, title: 'Tom &amp; Jerry', member: {} }], nextCursor: 'c2', totalCount: 9 }),
    );

    const feed = await postApi.feed({ cohort: 8, days: 7, cursor: 'c1' });
    expect(lastUrl()).toBe('/api/members/feed?cohort=8&days=7&cursor=c1');
    expect(fetchMock.mock.calls[0]![1].next).toEqual({ revalidate: 300 });
    expect(feed).toEqual({
      posts: [{ id: 1, title: 'Tom & Jerry', member: { roles: [], tracks: [] } }],
      nextCursor: 'c2',
      totalCount: 9,
    });

    await postApi.feed();
    expect(lastUrl()).toBe('/api/members/feed');
  });

  // 팀 블로그 작성자에는 roles·tracks가 없다 → 경계에서 빈 배열로. 멤버 작성자의 값은 그대로
  it('should fill missing author roles and tracks with empty arrays and keep present ones', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        posts: [
          { id: 1, title: 't', member: { githubId: 'team', isTeamBlog: true } },
          { id: 2, title: 'u', member: { githubId: 'crew', roles: ['crew'], tracks: ['backend'] } },
        ],
        nextCursor: null,
      }),
    );

    const feed = await postApi.feed();

    expect(feed.posts.map((p) => p.member)).toEqual([
      { githubId: 'team', isTeamBlog: true, roles: [], tracks: [] },
      { githubId: 'crew', roles: ['crew'], tracks: ['backend'] },
    ]);
  });
});
