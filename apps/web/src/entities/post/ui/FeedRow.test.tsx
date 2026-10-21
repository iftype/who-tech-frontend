import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NOW, daysAgo, makeFeedItem } from '@/test/fixtures/post';
import { FeedList } from './FeedList';
import { FeedRow } from './FeedRow';

// 아바타를 감싼 링크 (아바타 글자가 접근 가능한 이름이라 role 조회 대신 첫 링크)
const avatarLink = () => document.querySelector('a')!;
const badges = () => screen.getAllByText(/^(\d기|크루|코치|리뷰어|FE|BE|AN|팀 블로그)$/).map((el) => el.textContent);

describe('FeedRow', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('should link the title through the visit endpoint and show the source chip', () => {
    render(<FeedRow item={makeFeedItem(1, {}, { publishedAt: daysAgo(3) })} />);

    expect(screen.getByRole('link', { name: '글 1' })).toHaveAttribute('href', '/api/members/blog-posts/1/visit');
    expect(screen.getByRole('link', { name: 'Velog' })).toHaveAttribute('href', 'https://velog.io/@crew/1');
    expect(screen.getByText('3일 전')).toBeInTheDocument();
  });

  it('should drop the source chip for an unknown host', () => {
    render(<FeedRow item={makeFeedItem(1, {}, { url: 'https://example.com/post' })} />);
    expect(screen.queryByRole('link', { name: /Velog|Tistory|Medium|GitHub|Brunch|Notion/ })).not.toBeInTheDocument();
  });

  it('should render a member author with an internal profile link and cohort badges', () => {
    render(
      <FeedRow
        item={makeFeedItem(1, {
          tracks: ['frontend'],
          cohorts: [
            { cohort: 8, roles: ['crew'] },
            { cohort: 7, roles: ['coach', 'reviewer'] },
          ],
        })}
      />,
    );

    expect(screen.getByRole('link', { name: '크루1' })).toHaveAttribute('href', '/crew1');
    expect(avatarLink()).toHaveAttribute('href', 'https://github.com/crew1');
    expect(badges()).toEqual(['FE', '8기', '크루', '7기', '코치', '리뷰어']);
  });

  it('should fall back to the primary cohort and non-crew roles when cohorts are missing', () => {
    render(<FeedRow item={makeFeedItem(1, { cohorts: undefined, cohort: 6, roles: ['crew', 'coach'] })} />);
    expect(badges()).toEqual(['BE', '6기', '코치']);
  });

  it('should render a team blog with external links and a team pill instead of badges', () => {
    render(<FeedRow item={makeFeedItem(1, { isTeamBlog: true, nickname: 'Rilog', blog: 'https://www.rilog.kr' })} />);

    const author = screen.getByRole('link', { name: 'Rilog' });
    expect(author).toHaveAttribute('href', 'https://www.rilog.kr');
    expect(author).toHaveAttribute('target', '_blank');
    expect(avatarLink()).toHaveAttribute('href', 'https://www.rilog.kr');
    expect(badges()).toEqual(['팀 블로그']);
  });

  it('should stagger the fade-in by index and cap it at 300ms', () => {
    const { container, rerender } = render(<FeedRow item={makeFeedItem(1)} index={5} />);
    expect(container.firstElementChild).toHaveStyle({ animationDelay: '150ms' });
    rerender(<FeedRow item={makeFeedItem(1)} index={40} />);
    expect(container.firstElementChild).toHaveStyle({ animationDelay: '300ms' });
    rerender(<FeedRow item={makeFeedItem(1)} />);
    expect(container.firstElementChild!.getAttribute('style') ?? '').toBe('');
  });

  it('should keep the same markup (pinned before splitting the row)', () => {
    const { container } = render(
      <FeedRow
        item={makeFeedItem(1, { cohorts: [{ cohort: 8, roles: ['crew'] }] }, { publishedAt: daysAgo(10) })}
        index={2}
      />,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
});

describe('FeedList', () => {
  it('should explain an empty list', () => {
    render(<FeedList items={[]} />);
    expect(screen.getByText('등록된 블로그 글이 없습니다')).toBeInTheDocument();
  });

  it('should render one row per item inside a card', () => {
    const { container } = render(<FeedList items={[makeFeedItem(1), makeFeedItem(2)]} />);
    expect(screen.getByRole('link', { name: '글 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '글 2' })).toBeInTheDocument();
    expect(container.firstElementChild!.className).toContain('rounded-xl');
  });
});
