import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Member } from '@/entities/member';
import type { FeedItem } from '@/entities/post';

const feed = vi.fn();
vi.mock('@/entities/post', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/post')>()),
  postApi: { feed: (...args: unknown[]) => feed(...args) },
}));

const { FeedClient } = await import('./FeedClient');

// jsdom에는 IntersectionObserver가 없다 → 콜백을 잡아 두고 직접 호출해 무한 스크롤을 흉내낸다
let observerCallback: IntersectionObserverCallback | null = null;
class FakeIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

const NOW = new Date('2026-10-18T12:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

function item(id: number, member: Partial<Member>, overrides: Partial<FeedItem> = {}): FeedItem {
  return {
    id,
    url: `https://velog.io/@crew/${id}`,
    title: `글 ${id}`,
    publishedAt: daysAgo(1),
    member: {
      githubId: `crew${id}`,
      nickname: `크루${id}`,
      avatarUrl: null,
      cohort: 8,
      roles: ['crew'],
      cohorts: [{ cohort: 8, roles: ['crew'] }],
      track: 'backend',
      tracks: ['backend'],
      blog: null,
      lastPostedAt: null,
      ...member,
    } as Member,
    ...overrides,
  };
}

const ITEMS = [
  item(1, { cohort: 8, tracks: ['backend'] }),
  item(2, { cohort: 7, tracks: ['frontend'] }, { url: 'https://crew.tistory.com/2' }),
  item(3, { cohort: 8, roles: ['coach'], tracks: ['backend'], nickname: '코치' }, { title: '코치의 글' }),
  item(4, { cohort: 8, roles: ['reviewer'], nickname: '오래된리뷰어' }, { publishedAt: daysAgo(20) }),
];

type Props = Parameters<typeof FeedClient>[0];

function renderFeed(props: Partial<Props> = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <FeedClient
        initialItems={ITEMS}
        initialNextCursor="c1"
        initialTotalCount={40}
        initialCohorts={[8, 7]}
        initialCohort={null}
        initialTrack={null}
        initialRange="30d"
        {...props}
      />
    </QueryClientProvider>,
  );
}

describe('FeedClient', () => {
  beforeEach(() => {
    feed.mockReset();
    feed.mockResolvedValue({ posts: [], nextCursor: null, totalCount: 0 });
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    observerCallback = null;
  });

  it('should render SSR items without fetching, with counts and sidebar stats', () => {
    renderFeed();

    expect(feed).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: '피드' })).toBeInTheDocument();
    expect(screen.getAllByText('글 1').length).toBeGreaterThan(0);
    expect(screen.getByText('/ 전체 40개')).toBeInTheDocument();

    // 8기 운영진(코치·리뷰어)의 최근 7일 글만 사이드바에 노출
    const sidebar = screen.getByText('8기 운영진 최신 글').closest('section')!;
    expect(within(sidebar).getByText('코치의 글')).toBeInTheDocument();
    expect(within(sidebar).queryByText('오래된리뷰어')).not.toBeInTheDocument();

    // 플랫폼 비율: Velog 3 / Tistory 1
    const platforms = screen.getByText('플랫폼').closest('section')!;
    expect(within(platforms).getByText('Velog')).toBeInTheDocument();
    expect(within(platforms).getByText('75%')).toBeInTheDocument();
    expect(within(platforms).getByText('25%')).toBeInTheDocument();
  });

  it('should refetch by cohort and record filters in the URL', async () => {
    feed.mockResolvedValue({ posts: [ITEMS[0]], nextCursor: null, totalCount: 1 });
    renderFeed();

    await userEvent.click(screen.getByRole('button', { name: '8기' }));

    await waitFor(() =>
      expect(feed).toHaveBeenLastCalledWith({ days: 30, cohort: 8, track: undefined, cursor: undefined, limit: 50 }),
    );
    expect(window.location.search).toBe('?cohort=8');
    expect(screen.getByRole('heading', { name: '8기 피드' })).toBeInTheDocument();
    expect(await screen.findByText('1개', { selector: 'span' })).toBeInTheDocument();
  });

  it('should filter by track and drop the day window for the whole range', async () => {
    feed.mockResolvedValue({ posts: ITEMS, nextCursor: null, totalCount: 4 });
    renderFeed();

    await userEvent.click(screen.getByRole('button', { name: '프론트엔드' }));
    await waitFor(() =>
      expect(feed).toHaveBeenLastCalledWith(expect.objectContaining({ track: 'frontend', days: 30 })),
    );
    // 응답에 다른 트랙이 섞여 있어도 화면에는 프론트엔드 글만
    await waitFor(() => expect(screen.queryAllByText('글 1')).toHaveLength(0));
    expect(screen.getAllByText('글 2').length).toBeGreaterThan(0);

    // "전체" 버튼이 기수·기간·트랙에 하나씩 있으므로 기간 그룹 안에서 고른다
    const rangeGroup = screen.getByRole('button', { name: '최근 30일' }).parentElement!;
    await userEvent.click(within(rangeGroup).getByRole('button', { name: '전체' }));
    await waitFor(() => expect(window.location.search).toContain('range=all'));
    expect(feed).toHaveBeenLastCalledWith(expect.not.objectContaining({ days: expect.anything() }));
  });

  it('should load the next page when the sentinel becomes visible', async () => {
    feed.mockResolvedValue({ posts: [item(9, {})], nextCursor: null, totalCount: 5 });
    renderFeed();

    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    await waitFor(() => expect(feed).toHaveBeenCalledWith(expect.objectContaining({ cursor: 'c1', days: 30 })));
    expect(await screen.findAllByText('글 9')).not.toHaveLength(0);
  });

  it('should show the empty state when there are no posts', async () => {
    renderFeed({ initialItems: [], initialNextCursor: null, initialTotalCount: 0 });

    expect(await screen.findByText('등록된 블로그 글이 없습니다')).toBeInTheDocument();
    expect(screen.getAllByText('데이터 없음')).toHaveLength(2);
  });

  it('should sync filters from the URL on popstate', async () => {
    feed.mockResolvedValue({ posts: [ITEMS[1]], nextCursor: null, totalCount: 1 });
    renderFeed();

    await act(async () => {
      window.history.pushState(null, '', '/?cohort=7&track=frontend&range=all');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(await screen.findByRole('heading', { name: '7기 피드' })).toBeInTheDocument();
    await waitFor(() =>
      expect(feed).toHaveBeenLastCalledWith({ cohort: 7, track: 'frontend', cursor: undefined, limit: 50 }),
    );
  });
});
