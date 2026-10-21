import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeArchive, makeMemberDetail } from '@/test/fixtures/member';
import { makeBlogPost } from '@/test/fixtures/post';
import { renderWithQuery } from '@/test/render';
import { currentUrl, popstateTo, setUrl } from '@/test/url';

const byMember = vi.fn();
vi.mock('@/entities/post/api/post.api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/post/api/post.api')>()),
  postApi: { byMember: (...args: unknown[]) => byMember(...args) },
}));

const { ProfileTabs } = await import('./ProfileTabs');

type Props = Parameters<typeof ProfileTabs>[0];

const MEMBER = makeMemberDetail('crew', { archive: [makeArchive(8)], tracks: ['backend'] });

function renderTabs(props: Partial<Props> & { lastPostedAt?: string | null } = {}) {
  const { lastPostedAt = null, ...rest } = props;
  const merged: Props = {
    member: { ...MEMBER, lastPostedAt },
    detailId: 'crew',
    initialTab: 'mission',
    initialMissionTab: 'mission',
    ...rest,
  };
  return renderWithQuery(<ProfileTabs {...merged} />);
}

const tab = (name: string) => screen.getByRole('tab', { name });

describe('ProfileTabs', () => {
  beforeEach(() => {
    byMember.mockReset();
    byMember.mockResolvedValue({ latest: [], archive: [], page: 1, totalPages: 1 });
    setUrl('/crew');
  });

  it('should open the tab the page parsed from the URL', () => {
    renderTabs();
    expect(tab('미션 아카이브')).toHaveAttribute('aria-selected', 'true');
    expect(tab('블로그 글')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('heading', { name: '미션 PR 아카이브' })).toBeInTheDocument();
    expect(byMember).not.toHaveBeenCalled();
  });

  it('should switch to the blog tab, record it with replace, and fetch the posts once', async () => {
    byMember.mockResolvedValue({ latest: [], archive: [makeBlogPost(1), makeBlogPost(2)], page: 1, totalPages: 1 });
    renderTabs({ lastPostedAt: '2026-10-17T12:00:00Z' });
    const historyLength = window.history.length;

    await userEvent.click(tab('블로그 글'));

    expect(currentUrl()).toBe('/crew?tab=blog');
    expect(window.history.length).toBe(historyLength);
    expect(tab('블로그 글')).toHaveAttribute('aria-selected', 'true');

    expect(await screen.findByRole('link', { name: /블로그 글 1/ })).toHaveAttribute(
      'href',
      'https://crew.tistory.com/1',
    );
    expect(screen.getByRole('link', { name: /블로그 글 2/ })).toBeInTheDocument();
    expect(screen.getByText(/마지막 게시:/)).toBeInTheDocument();
    expect(byMember).toHaveBeenCalledTimes(1);
    expect(byMember).toHaveBeenCalledWith('crew');
  });

  it('should write the default tab explicitly when going back to missions', async () => {
    setUrl('/crew?tab=blog');
    renderTabs({ initialTab: 'blog' });

    await userEvent.click(tab('미션 아카이브'));

    expect(currentUrl()).toBe('/crew?tab=mission');
    expect(screen.getByRole('heading', { name: '미션 PR 아카이브' })).toBeInTheDocument();
  });

  // 클라이언트 마운트 뒤에는 실제 URL이 소스다 → 블로그 탭으로 시작하려면 URL에도 ?tab=blog가 있어야 한다
  it('should show the loading text while the posts are on their way', () => {
    byMember.mockReturnValue(new Promise(() => undefined));
    setUrl('/crew?tab=blog');
    renderTabs({ initialTab: 'blog' });
    expect(screen.getByText('블로그 글을 불러오는 중...')).toBeInTheDocument();
  });

  it('should explain an empty blog archive and hide the last-posted line', async () => {
    setUrl('/crew?tab=blog');
    renderTabs({ initialTab: 'blog', lastPostedAt: '2026-10-17T12:00:00Z' });

    expect(await screen.findByText('등록된 블로그 글이 없습니다')).toBeInTheDocument();
    expect(screen.queryByText(/마지막 게시:/)).not.toBeInTheDocument();
  });

  it('should show the empty text when the posts request fails', async () => {
    byMember.mockRejectedValue(new Error('down'));
    setUrl('/crew?tab=blog');
    renderTabs({ initialTab: 'blog' });

    expect(await screen.findByText('등록된 블로그 글이 없습니다')).toBeInTheDocument();
  });

  it('should follow the URL when history moves (back/forward) instead of a stale copy', async () => {
    renderTabs();
    expect(tab('미션 아카이브')).toHaveAttribute('aria-selected', 'true');

    await popstateTo('/crew?tab=blog');

    expect(tab('블로그 글')).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByText('등록된 블로그 글이 없습니다')).toBeInTheDocument();
  });

  it('should ignore URLs of other pages while this one is leaving', async () => {
    renderTabs();
    await popstateTo('/other?tab=blog');
    expect(tab('미션 아카이브')).toHaveAttribute('aria-selected', 'true');
  });

  it('should keep the mission sub-tab in the URL next to the profile tab', async () => {
    setUrl('/crew?tab=mission');
    renderTabs();

    await userEvent.click(screen.getByRole('button', { name: '공통' }));

    await waitFor(() => expect(currentUrl()).toBe('/crew?tab=mission&missionTab=common'));
  });
});
