import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, RateLimitError, requestJson, serverCache, withQuery } from './http';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('withQuery', () => {
  it('should drop empty params and encode values', () => {
    expect(withQuery('/members', { q: '가람', cohort: 8, track: undefined, role: null })).toBe(
      '/members?q=%EA%B0%80%EB%9E%8C&cohort=8',
    );
  });

  it('should return the path alone when there are no params', () => {
    expect(withQuery('/members', {})).toBe('/members');
    expect(withQuery('/members', { q: undefined })).toBe('/members');
  });
});

describe('requestJson', () => {
  it('should call the browser proxy with JSON headers and merge init', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => [1] });

    await expect(requestJson('/members/cohorts', { next: { revalidate: 300 } })).resolves.toEqual([1]);
    expect(fetchMock).toHaveBeenCalledWith('/api/members/cohorts', {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should throw ApiError with the status on non-OK responses', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}), text: async () => 'boom' });

    const error = await requestJson('/members/cohorts').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, message: 'API error: 500 /members/cohorts', body: 'boom' });
  });
});

describe('serverCache', () => {
  it('should produce the Next data-cache option the server fetch understands', () => {
    expect(serverCache(300)).toEqual({ next: { revalidate: 300 } });
  });
});

describe('RateLimitError', () => {
  it('should carry the remaining seconds as a 429 ApiError', () => {
    const error = new RateLimitError(30, '30초 후에 다시 시도해주세요');
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 429, rateLimited: true, remainingSeconds: 30 });
  });
});
