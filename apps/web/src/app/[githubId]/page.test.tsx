import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { memberDetailQuery } from '@/entities/member';
import { ApiError } from '@/shared/api';
import { makeMemberDetail } from '@/test/fixtures/member';

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', () => ({ notFound }));
// React.cache는 서버 요청 컨텍스트 밖(테스트)에서는 기억하지 않는다 → "한 번만 만든다"로 흉내낸다
vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>();
  return {
    ...react,
    cache: <T,>(fn: () => T) => {
      let value: T | undefined;
      return () => (value ??= fn());
    },
  };
});
const detail = vi.fn();
vi.mock('@/entities/member/api/member.api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/member/api/member.api')>()),
  memberApi: { detail: (...a: unknown[]) => detail(...a) },
}));

const { default: DetailPage, generateMetadata } = await import('./page');
const props = (githubId: string, sp: Record<string, string> = {}) => ({
  params: Promise.resolve({ githubId }),
  searchParams: Promise.resolve(sp),
});

describe('/[githubId]', () => {
  beforeEach(() => {
    detail.mockReset();
    notFound.mockClear();
  });

  it('should fetch the member once per request for metadata and page, and hydrate it', async () => {
    detail.mockResolvedValue(makeMemberDetail('crew', { nickname: '하루' }));

    const meta = await generateMetadata(props('crew'));
    const tree = (await DetailPage(props('crew', { tab: 'blog', missionTab: 'pending' }))) as ReactElement;

    expect(meta.description).toBe('하루(@crew) 크루의 미션 아카이브와 블로그');
    const client = (tree.props as { children: ReactElement }).children;
    expect(client.props).toMatchObject({ githubId: 'crew', initialTab: 'blog', initialMissionTab: 'pending' });
    const state = (tree.props as { state: { queries: { queryKey: unknown }[] } }).state;
    expect(state.queries.map((q) => q.queryKey)).toEqual([memberDetailQuery('crew').queryKey]);
    expect(detail).toHaveBeenCalledTimes(1);
  });

  it('should parse unknown tabs to the defaults', async () => {
    detail.mockResolvedValue(makeMemberDetail('crew2'));
    const tree = (await DetailPage(props('crew2', { tab: 'x', missionTab: 'y' }))) as ReactElement;
    const client = (tree.props as { children: ReactElement }).children;
    expect(client.props).toMatchObject({ initialTab: 'mission', initialMissionTab: 'mission' });
  });

  it('should 404 only when the API says the member does not exist', async () => {
    detail.mockRejectedValue(new ApiError(404, 'API error: 404 /members/nobody'));
    await expect(DetailPage(props('nobody'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(await generateMetadata(props('nobody'))).toEqual({});
  });

  it('should surface other failures to error.tsx instead of pretending the member is missing', async () => {
    detail.mockRejectedValue(new ApiError(503, 'API error: 503 /members/crew3'));
    await expect(DetailPage(props('crew3'))).rejects.toMatchObject({ status: 503 });
    expect(notFound).not.toHaveBeenCalled();
  });
});
