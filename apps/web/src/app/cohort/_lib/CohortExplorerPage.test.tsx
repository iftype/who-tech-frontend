import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { cohortMembersQuery, cohortsQuery } from '@/entities/member';
import { makeMember, makeSearchPage } from '@/test/fixtures/member';

const cohorts = vi.fn();
const searchPage = vi.fn();
vi.mock('@/entities/member/api/member.api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/member/api/member.api')>()),
  memberApi: { cohorts: (...a: unknown[]) => cohorts(...a), searchPage: (...a: unknown[]) => searchPage(...a) },
}));

const { CohortExplorerPage } = await import('./CohortExplorerPage');

// 서버 컴포넌트가 돌려주는 트리에서 HydrationBoundary의 state(dehydrate 결과)를 꺼낸다
function dehydratedKeys(tree: ReactElement): unknown[] {
  const boundary = (tree.props as { children: ReactElement }).children;
  const state = (boundary.props as { state: { queries: { queryKey: unknown }[] } }).state;
  return state.queries.map((q) => q.queryKey);
}

describe('CohortExplorerPage', () => {
  it('should parse the filters and hand both queries to the client cache', async () => {
    cohorts.mockResolvedValue([8, 7]);
    searchPage.mockResolvedValue(makeSearchPage([makeMember('fe')]));

    const tree = await CohortExplorerPage({ cohort: 8, searchParams: { roleGroup: 'staff', track: 'frontend' } });

    expect(searchPage).toHaveBeenCalledWith({
      cohort: 8,
      track: 'frontend',
      roleGroup: 'staff',
      limit: 120,
      offset: 0,
    });
    expect(dehydratedKeys(tree)).toEqual(
      expect.arrayContaining([cohortMembersQuery(8, 'frontend', 'staff').queryKey, cohortsQuery().queryKey]),
    );
  });

  it('should fall back to crew / all tracks for unknown filters and the whole list for cohort null', async () => {
    cohorts.mockResolvedValue([]);
    searchPage.mockResolvedValue(makeSearchPage([]));

    await CohortExplorerPage({ cohort: null, searchParams: { roleGroup: 'boss', track: 'ios' } });

    expect(searchPage).toHaveBeenCalledWith({ roleGroup: 'crew', limit: 120, offset: 0 });
  });

  it('should not throw when a prefetch fails and leave that query out of the cache', async () => {
    cohorts.mockResolvedValue([8]);
    searchPage.mockRejectedValue(new Error('down'));

    const tree = await CohortExplorerPage({ cohort: 8, searchParams: undefined });

    expect(dehydratedKeys(tree)).toEqual([cohortsQuery().queryKey]);
  });
});
