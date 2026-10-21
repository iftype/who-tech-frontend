import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, RateLimitError } from '@/shared/api';
import { memberApi } from './member.api';

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

describe('memberApi', () => {
  it('should build search query strings without empty params', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await memberApi.search({ q: '가람', cohort: 8, track: undefined });
    expect(lastUrl()).toBe('/api/members?q=%EA%B0%80%EB%9E%8C&cohort=8');

    await memberApi.search({});
    expect(lastUrl()).toBe('/api/members');
    expect(fetchMock.mock.calls[0]![1].headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should request a search page with pagination', async () => {
    const page = { members: [], totalCount: 0, counts: { crew: 0, staff: 0 }, nextOffset: null };
    fetchMock.mockResolvedValue(jsonResponse(page));

    await expect(memberApi.searchPage({ roleGroup: 'staff', limit: 20, offset: 40 })).resolves.toEqual(page);
    expect(lastUrl()).toBe('/api/members/search?roleGroup=staff&limit=20&offset=40');

    await memberApi.searchPage({});
    expect(lastUrl()).toBe('/api/members/search');
  });

  it('should throw on non-OK responses', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));
    await expect(memberApi.cohorts()).rejects.toThrow('API error: 500 /members/cohorts');
  });

  // 기수 목록은 기수가 바뀔 때만 달라진다 → 다른 서버 prefetch와 같은 5분 데이터 캐시 (라운드 5)
  it('should cache the cohort list for 5 minutes on the server', async () => {
    fetchMock.mockResolvedValue(jsonResponse([8, 7]));
    await expect(memberApi.cohorts()).resolves.toEqual([8, 7]);
    expect(fetchMock.mock.calls[0]![1].next).toEqual({ revalidate: 300 });
  });

  it('should return member detail as the API sends it, cached for 5 minutes', async () => {
    const detail = {
      githubId: 'crew1',
      archive: [
        {
          cohort: 8,
          levels: [
            {
              level: 1,
              repos: [{ name: 'current', track: 'backend', tabCategory: 'precourse', submissions: [{ prNumber: 2 }] }],
            },
          ],
        },
      ],
    };
    fetchMock.mockResolvedValue(jsonResponse(detail));

    await expect(memberApi.detail('crew1')).resolves.toEqual(detail);
    expect(lastUrl()).toBe('/api/members/crew1');
    expect(fetchMock.mock.calls[0]![1].next).toEqual({ revalidate: 300 });
  });

  describe('refresh', () => {
    it('should POST and return the member', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ githubId: 'crew1', archive: [] }));

      const detail = await memberApi.refresh('crew1');

      expect(lastUrl()).toBe('/api/members/crew1/refresh');
      expect(fetchMock.mock.calls[0]![1].method).toBe('POST');
      expect(detail).toEqual({ githubId: 'crew1', archive: [] });
    });

    it('should throw RateLimitError with the remaining seconds on 429', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ remainingSeconds: 30, message: '30초 후에 다시 시도해주세요' }, 429));

      const error = await memberApi.refresh('crew1').catch((e: unknown) => e);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error).toMatchObject({ rateLimited: true, remainingSeconds: 30, message: '30초 후에 다시 시도해주세요' });
    });

    it('should throw ApiError with the response text on other errors', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'boom' }, 500));
      await expect(memberApi.refresh('crew1')).rejects.toThrow('API error: 500 {"error":"boom"}');

      fetchMock.mockResolvedValue({ ok: false, status: 502, text: async () => Promise.reject(new Error('x')) });
      const error = await memberApi.refresh('crew1').catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 502, message: 'API error: 502 ' });
    });
  });
});
