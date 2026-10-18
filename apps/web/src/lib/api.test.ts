import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from './api';

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
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

describe('api.members', () => {
  it('should build search query strings without empty params', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await api.members.search({ q: '가람', cohort: 8, track: undefined });
    expect(lastUrl()).toBe('/api/members?q=%EA%B0%80%EB%9E%8C&cohort=8');

    await api.members.search({});
    expect(lastUrl()).toBe('/api/members');
    expect(fetchMock.mock.calls[0]![1].headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should request a search page with pagination', async () => {
    const page = { members: [], totalCount: 0, counts: { crew: 0, staff: 0 }, nextOffset: null };
    fetchMock.mockResolvedValue(jsonResponse(page));

    await expect(api.members.searchPage({ roleGroup: 'staff', limit: 20, offset: 40 })).resolves.toEqual(page);
    expect(lastUrl()).toBe('/api/members/search?roleGroup=staff&limit=20&offset=40');

    await api.members.searchPage({});
    expect(lastUrl()).toBe('/api/members/search');
  });

  it('should throw on non-OK responses', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));
    await expect(api.members.cohorts()).rejects.toThrow('API error: 500 /members/cohorts');
  });

  it('should normalize legacy and current archive formats in member detail', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        githubId: 'crew1',
        archive: [
          {
            cohort: 8,
            levels: [
              {
                level: 1,
                repos: [
                  { name: 'legacy', track: 'backend', submission: { prNumber: 1 } },
                  { name: 'legacy-none', track: null, submission: null },
                  { name: 'current', track: 'backend', tabCategory: 'precourse', submissions: [{ prNumber: 2 }] },
                  { name: 'current-null', track: 'backend', submissions: null },
                ],
              },
            ],
          },
        ],
      }),
    );

    const detail = await api.members.detail('crew1');

    expect(lastUrl()).toBe('/api/members/crew1');
    expect(fetchMock.mock.calls[0]![1].next).toEqual({ revalidate: 300 });
    expect(detail.archive[0]!.levels[0]!.repos).toEqual([
      { name: 'legacy', track: 'backend', tabCategory: 'base', submissions: [{ prNumber: 1 }] },
      { name: 'legacy-none', track: null, tabCategory: 'base', submissions: null },
      { name: 'current', track: 'backend', tabCategory: 'precourse', submissions: [{ prNumber: 2 }] },
      { name: 'current-null', track: 'backend', tabCategory: 'base', submissions: null },
    ]);
  });

  it('should default to an empty archive', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ githubId: 'crew1' }));
    expect((await api.members.detail('crew1')).archive).toEqual([]);
  });

  it('should decode HTML entities in blog post titles', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        latest: [{ title: 'A &amp; B' }],
        archive: [{ title: '&lt;Java&gt;' }],
        page: 1,
        totalPages: 1,
      }),
    );

    const posts = await api.members.blogPosts('crew1');

    expect(lastUrl()).toBe('/api/members/crew1/blog-posts');
    expect(posts.latest[0]!.title).toBe('A & B');
    expect(posts.archive[0]!.title).toBe('<Java>');
    expect(posts.page).toBe(1);
  });

  it('should load the feed with filters and decoded titles', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ posts: [{ id: 1, title: 'Tom &amp; Jerry' }], nextCursor: 'c2', totalCount: 9 }),
    );

    const feed = await api.members.feed({ cohort: 8, days: 7, cursor: 'c1' });
    expect(lastUrl()).toBe('/api/members/feed?cohort=8&days=7&cursor=c1');
    expect(feed).toEqual({ posts: [{ id: 1, title: 'Tom & Jerry' }], nextCursor: 'c2', totalCount: 9 });

    await api.members.feed();
    expect(lastUrl()).toBe('/api/members/feed');
  });

  describe('refresh', () => {
    it('should POST and return the normalized member', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ githubId: 'crew1' }));

      const detail = await api.members.refresh('crew1');

      expect(lastUrl()).toBe('/api/members/crew1/refresh');
      expect(fetchMock.mock.calls[0]![1].method).toBe('POST');
      expect(detail).toEqual({ githubId: 'crew1', archive: [] });
    });

    it('should throw a rate limit object on 429', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ remainingSeconds: 30, message: '30초 후에 다시 시도해주세요' }, 429));

      await expect(api.members.refresh('crew1')).rejects.toEqual({
        rateLimited: true,
        remainingSeconds: 30,
        message: '30초 후에 다시 시도해주세요',
      });
    });

    it('should throw with the response text on other errors', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'boom' }, 500));
      await expect(api.members.refresh('crew1')).rejects.toThrow('API error: 500 {"error":"boom"}');

      fetchMock.mockResolvedValue({ ok: false, status: 502, text: async () => Promise.reject(new Error('x')) });
      await expect(api.members.refresh('crew1')).rejects.toThrow('API error: 502 ');
    });
  });
});
