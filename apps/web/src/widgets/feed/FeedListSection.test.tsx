import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeFeedItem } from '@/test/fixtures/post';
import { FeedListSection } from './FeedListSection';

describe('FeedListSection', () => {
  // 서버는 참여 기수로 거른다. 7기가 대표 기수인 크루가 8기에도 참여했다면 8기 탭 응답에 그 글이 온다
  it('should show every post the server returned under the selected cohort', () => {
    const items = [makeFeedItem(1, { cohort: 8 }), makeFeedItem(2, { cohort: 7 }), makeFeedItem(3, { cohort: null })];

    render(<FeedListSection cohort={8} items={items} />);

    // 글마다 크루 배지에도 "8기"가 있으므로 개수 옆의 제목으로 찾는다
    expect(screen.getByText('3개').parentElement).toHaveTextContent('8기');
    expect(['글 1', '글 2', '글 3'].map((t) => screen.getAllByText(t).length > 0)).toEqual([true, true, true]);
  });

  it('should render a flat list without a heading when no cohort is selected', () => {
    render(<FeedListSection cohort={null} items={[makeFeedItem(1, { cohort: 8 })]} />);

    expect(screen.queryByText(/^\d+개$/)).not.toBeInTheDocument();
    expect(screen.getAllByText('글 1').length).toBeGreaterThan(0);
  });

  it('should render nothing for an empty page', () => {
    const { container } = render(<FeedListSection cohort={8} items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
