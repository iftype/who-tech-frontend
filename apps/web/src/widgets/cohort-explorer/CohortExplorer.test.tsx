import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Member, MemberSearchPage } from '@/entities/member';
import { makeMember, makeSearchPage as page } from '@/test/fixtures/member';
import { renderHydrated } from '@/test/render';

const cohorts = vi.fn();
const searchPage = vi.fn();
// 쿼리 옵션(member.queries)이 API 모듈을 직접 쓰므로 그 모듈을 바꿔 끼운다
vi.mock('@/entities/member/api/member.api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/member/api/member.api')>()),
  memberApi: {
    cohorts: (...args: unknown[]) => cohorts(...args),
    searchPage: (...args: unknown[]) => searchPage(...args),
  },
}));

// Next 라우터 컨텍스트가 없으므로 현재 URL 기준으로 흉내낸다
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(window.location.search) }));

const { CohortExplorer } = await import('./CohortExplorer');
const { cohortMembersQuery, cohortsQuery } = await import('@/entities/member');

function member(githubId: string, roles: string[], tracks: string[]): Member {
  return makeMember(githubId, {
    roles: roles as Member['roles'],
    cohorts: [{ cohort: 8, roles: roles as Member['roles'] }],
    tracks: tracks as Member['tracks'],
  });
}

const INITIAL = page([
  member('fe', ['crew'], ['frontend']),
  member('be', ['crew'], ['backend']),
  member('coach', ['coach'], ['backend']),
]);

type Props = Parameters<typeof CohortExplorer>[0];

// 서버 page.tsx처럼: 첫 페이지·기수 목록을 서버 캐시에 넣고 dehydrate → HydrationBoundary
function renderExplorer({ initialPage = INITIAL, ...props }: Partial<Props> & { initialPage?: MemberSearchPage } = {}) {
  const merged: Props = { initialCohort: 8, initialRoleGroup: 'crew', initialTrack: 'all', ...props };
  return renderHydrated(<CohortExplorer {...merged} />, {
    seed: (server) => {
      server.setQueryData(
        cohortMembersQuery(merged.initialCohort, merged.initialTrack, merged.initialRoleGroup).queryKey,
        { pages: [initialPage], pageParams: [0] },
      );
      server.setQueryData(cohortsQuery().queryKey, [8, 7, 6]);
    },
  });
}

const shown = (githubId: string) => screen.queryAllByText(`${githubId}-닉`).length > 0;

describe('CohortExplorer', () => {
  beforeEach(() => {
    cohorts.mockReset();
    searchPage.mockReset();
    cohorts.mockResolvedValue([8, 7, 6]);
    searchPage.mockResolvedValue(page([]));
    window.history.replaceState(null, '', '/cohort/8');
  });

  it('should render the initial page with crew only and role counts', () => {
    renderExplorer();

    expect(screen.getByRole('heading', { name: '8기 크루' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '크루 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '운영진 1' })).toBeInTheDocument();
    expect(shown('fe')).toBe(true);
    expect(shown('be')).toBe(true);
    expect(shown('coach')).toBe(false);
  });

  it('should filter by track and record it in the URL', async () => {
    searchPage.mockResolvedValue(page([member('fe', ['crew'], ['frontend']), member('be', ['crew'], ['backend'])]));
    renderExplorer();

    await userEvent.click(screen.getByRole('button', { name: '프론트엔드' }));

    expect(window.location.pathname + window.location.search).toBe('/cohort/8?track=frontend');
    await waitFor(() =>
      expect(searchPage).toHaveBeenCalledWith({
        cohort: 8,
        track: 'frontend',
        roleGroup: 'crew',
        limit: 120,
        offset: 0,
      }),
    );
    // 응답에 다른 트랙이 섞여 있어도 화면에는 프론트엔드만
    await waitFor(() => expect(shown('be')).toBe(false));
    expect(shown('fe')).toBe(true);
  });

  it('should switch to staff', async () => {
    searchPage.mockResolvedValue(page([member('coach', ['coach'], ['backend'])]));
    renderExplorer();

    await userEvent.click(screen.getByRole('button', { name: '운영진 1' }));

    expect(window.location.search).toBe('?roleGroup=staff');
    await waitFor(() => expect(shown('coach')).toBe(true));
    expect(shown('fe')).toBe(false);
  });

  it('should push a new history entry when changing the cohort tab', async () => {
    searchPage.mockResolvedValue(page([member('old', ['crew'], ['backend'])], { counts: { crew: 1, staff: 0 } }));
    renderExplorer();
    const historyLength = window.history.length;

    await userEvent.click(screen.getByRole('tab', { name: '7기' }));

    expect(window.location.pathname).toBe('/cohort/7');
    expect(window.history.length).toBe(historyLength + 1);
    expect(await screen.findByRole('heading', { name: '7기 크루' })).toBeInTheDocument();
    expect(searchPage).toHaveBeenCalledWith({ cohort: 7, roleGroup: 'crew', limit: 120, offset: 0 });

    // "전체"는 기수 탭과 트랙 필터에 하나씩 있다 → 앞쪽이 기수 탭
    await userEvent.click(screen.getByRole('tab', { name: '전체' }));
    expect(window.location.pathname).toBe('/cohort');
  });

  it('should load more members with the next offset', async () => {
    searchPage.mockResolvedValue(page([member('more', ['crew'], ['backend'])], { nextOffset: null }));
    renderExplorer({ initialPage: { ...INITIAL, nextOffset: 120, totalCount: 121, counts: { crew: 121, staff: 1 } } });

    await userEvent.click(screen.getByRole('button', { name: '더 보기 (2/121)' }));

    await waitFor(() => expect(searchPage).toHaveBeenCalledWith(expect.objectContaining({ offset: 120 })));
    await waitFor(() => expect(shown('more')).toBe(true));
    expect(screen.queryByRole('button', { name: /더 보기/ })).not.toBeInTheDocument();
  });

  it('should explain empty results', async () => {
    renderExplorer({ initialPage: page([], { counts: { crew: 0, staff: 0 } }) });
    expect(screen.getAllByText('해당 기수의 멤버가 없습니다.').length).toBeGreaterThan(0);
  });

  it('should explain when filters exclude every member', async () => {
    searchPage.mockResolvedValue(page([member('be', ['crew'], ['backend'])]));
    renderExplorer();

    await userEvent.click(screen.getByRole('button', { name: '안드로이드' }));

    expect((await screen.findAllByText('조건에 맞는 멤버가 없습니다.')).length).toBeGreaterThan(0);
  });

  it('should restore the state from the URL on popstate', async () => {
    searchPage.mockResolvedValue(page([member('coach', ['coach'], ['android'])]));
    renderExplorer();

    await act(async () => {
      window.history.pushState(null, '', '/cohort/6?roleGroup=staff&track=android');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    await waitFor(() =>
      expect(searchPage).toHaveBeenCalledWith({
        cohort: 6,
        track: 'android',
        roleGroup: 'staff',
        limit: 120,
        offset: 0,
      }),
    );
    // 로딩 스켈레톤 → 필터 바로 제목 요소가 교체되므로 최종 화면에서 확인
    await waitFor(() => expect(shown('coach')).toBe(true));
    expect(screen.getByRole('heading', { name: '6기 크루' })).toBeInTheDocument();
  });

  it('should restore filters from the URL on mount and prefetch adjacent cohorts', async () => {
    window.history.replaceState(null, '', '/cohort/7?track=backend');
    renderExplorer();

    await waitFor(() =>
      expect(searchPage).toHaveBeenCalledWith({
        cohort: 7,
        track: 'backend',
        roleGroup: 'crew',
        limit: 120,
        offset: 0,
      }),
    );
    // requestIdleCallback이 없는 환경에서는 500ms 뒤 앞뒤 기수(8기, 6기)를 미리 불러온다
    await waitFor(
      () => {
        const prefetched = searchPage.mock.calls.map((c) => (c[0] as { cohort?: number }).cohort);
        expect(prefetched).toEqual(expect.arrayContaining([8, 6]));
      },
      { timeout: 2000 },
    );
  });

  it('should show a prefetched adjacent cohort when moving to it', async () => {
    searchPage.mockImplementation(async ({ cohort }: { cohort?: number }) =>
      page([member(`m${cohort}`, ['crew'], ['backend'])], { counts: { crew: 1, staff: 0 } }),
    );
    renderExplorer();

    // 8기에서 한가할 때 7기를 미리 받는다 → 7기 탭은 그 캐시로 바로 그려야 한다
    await waitFor(() => expect(searchPage).toHaveBeenCalledWith(expect.objectContaining({ cohort: 7 })), {
      timeout: 2000,
    });
    await userEvent.click(screen.getByRole('tab', { name: '7기' }));

    expect(await screen.findByRole('heading', { name: '7기 크루' })).toBeInTheDocument();
    await waitFor(() => expect(shown('m7')).toBe(true));
  });
});
