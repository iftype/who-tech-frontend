import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memberDetailQuery } from '@/entities/member';
import { makeArchive, makeMemberDetail } from '@/test/fixtures/member';
import { renderHydrated } from '@/test/render';
import { setUrl } from '@/test/url';
import { MemberDetailClient } from './MemberDetailClient';

const DETAIL = makeMemberDetail('crew', {
  nickname: '하루',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  cohorts: [
    { cohort: 8, roles: ['crew'] },
    { cohort: 7, roles: ['coach', 'reviewer'] },
  ],
  tracks: ['frontend', 'backend'],
  blog: 'https://haru.tistory.com',
  lastPostedAt: '2026-10-10T00:00:00Z',
  archive: [
    makeArchive(8, 'mission-8', 'frontend'),
    makeArchive(6, 'mission-6', 'frontend'),
    makeArchive(0, 'legacy', 'frontend'),
  ],
  tecoTalks: [
    {
      id: 1,
      videoId: 'v1',
      title: '[10분 테코톡] 하루의 리액트',
      url: 'https://youtu.be/v1',
      thumbnailUrl: null,
      uploadedAt: '2026-01-01T00:00:00Z',
      cohort: 8,
    },
  ],
});

function renderDetail(detail = DETAIL, detailId = 'crew') {
  return renderHydrated(<MemberDetailClient githubId={detailId} initialTab="mission" initialMissionTab="mission" />, {
    seed: (server) => server.setQueryData(memberDetailQuery(detailId).queryKey, detail),
  });
}

describe('MemberDetailClient', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-18T12:00:00Z'));
    setUrl('/crew');
  });
  afterEach(() => vi.useRealTimers());

  it('should render nothing until the member is in the cache', () => {
    const { container } = renderHydrated(
      <MemberDetailClient githubId="nobody" initialTab="mission" initialMissionTab="mission" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the header from the hydrated cache: name, id, cohorts with roles, tracks, teco talks', () => {
    renderDetail();

    expect(screen.getByRole('heading', { level: 1, name: '하루' })).toBeInTheDocument();
    expect(screen.getByText('@crew')).toBeInTheDocument();
    expect(screen.getByText('8기')).toBeInTheDocument();
    expect(screen.getByText('7기')).toBeInTheDocument();
    expect(screen.getAllByText('크루')).toHaveLength(1);
    expect(screen.getByText('코치')).toBeInTheDocument();
    expect(screen.getByText('리뷰어')).toBeInTheDocument();
    expect(screen.getByText('프론트엔드')).toBeInTheDocument();
    expect(screen.getByText('백엔드')).toBeInTheDocument();
    expect(screen.getByText('테코톡')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '하루의 리액트' })).toHaveAttribute('href', 'https://youtu.be/v1');
  });

  it('should render the profile links twice (mobile and desktop) with the same targets', () => {
    renderDetail();

    const github = screen.getAllByRole('link', { name: 'GitHub' });
    const blog = screen.getAllByRole('link', { name: '블로그' });
    expect(github).toHaveLength(2);
    expect(blog).toHaveLength(2);
    github.forEach((a) => expect(a).toHaveAttribute('href', 'https://github.com/crew'));
    blog.forEach((a) => expect(a).toHaveAttribute('href', 'https://haru.tistory.com'));
    expect(github[0]!.parentElement!.className).toContain('sm:hidden');
    expect(github[1]!.parentElement!.className).toContain('sm:inline-flex');
    expect(screen.getByTitle('하루의 GitHub 프로필 방문')).toHaveAttribute('href', 'https://github.com/crew');
  });

  it('should hide the blog link when the member has no blog', () => {
    renderDetail(makeMemberDetail('crew', { blog: null }));
    expect(screen.queryByRole('link', { name: '블로그' })).not.toBeInTheDocument();
    expect(screen.queryByText('테코톡')).not.toBeInTheDocument();
  });

  it("should show only the archive of the member's cohorts plus the unregistered one", async () => {
    renderDetail();

    const archive = screen.getByRole('heading', { name: '미션 PR 아카이브' }).closest('div')!.parentElement!;
    expect(within(archive).getByText('8기 미션')).toBeInTheDocument();
    expect(within(archive).queryByText('6기 미션')).not.toBeInTheDocument();
    expect(within(archive).getByRole('link', { name: 'mission-8' })).toBeInTheDocument();
    expect(within(archive).queryByRole('link', { name: 'mission-6' })).not.toBeInTheDocument();

    // 기수 0(미등록)은 확인전 탭에 남는다
    await userEvent.click(screen.getByRole('button', { name: '확인전' }));
    expect(within(archive).getByRole('link', { name: 'legacy' })).toBeInTheDocument();
  });

  it('should keep the same markup (pinned before splitting the header)', () => {
    const { container } = renderDetail();
    expect(container.innerHTML).toMatchSnapshot();
  });
});
