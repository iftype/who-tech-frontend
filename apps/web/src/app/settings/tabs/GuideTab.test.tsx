import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GuideTab } from './GuideTab';

describe('GuideTab', () => {
  // <p> 안의 <ul>·<div>는 HTML이 허용하지 않아 브라우저가 <p>를 먼저 닫는다 → 서버 HTML과 React 트리가 달라진다
  it('should not nest block elements inside a paragraph', () => {
    const { container } = render(<GuideTab />);
    expect(container.querySelectorAll('p ul, p ol, p div')).toHaveLength(0);
  });

  it('should render the five numbered sections with their lists', () => {
    render(<GuideTab />);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      '크루 검색하기',
      '크루 상세 페이지',
      '기수별 크루 목록',
      '블로그 피드',
      '블로그 등록 방법',
    ]);
    expect(screen.getAllByRole('list').length).toBeGreaterThanOrEqual(5);
  });
});
