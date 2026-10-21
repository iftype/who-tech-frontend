import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TRACK_OPTIONS } from '@/features/cohort-filter/CohortFilterBar';
import { CohortExplorerSkeleton } from './CohortExplorerSkeleton';

const props = { counts: { crew: 12, staff: 3 }, visibleTrackOptions: TRACK_OPTIONS, filteredCount: 12 };

describe('CohortExplorerSkeleton', () => {
  it('should title the whole list for cohort 0 and a cohort otherwise', () => {
    const { rerender } = render(<CohortExplorerSkeleton cohort={0} {...props} />);
    expect(screen.getByRole('heading', { name: '전체 크루' })).toBeInTheDocument();
    expect(screen.getByText('우아한테크코스 전체 멤버 목록')).toBeInTheDocument();

    rerender(<CohortExplorerSkeleton cohort={8} {...props} />);
    expect(screen.getByRole('heading', { name: '8기 크루' })).toBeInTheDocument();
    expect(screen.getByText('크루 12')).toBeInTheDocument();
    expect(screen.getByText('운영진 3')).toBeInTheDocument();
    expect(screen.getAllByText(/전체|프론트엔드|백엔드|안드로이드/).map((el) => el.textContent)).toEqual([
      '전체',
      '프론트엔드',
      '백엔드',
      '안드로이드',
    ]);
  });

  it('should keep the same markup (pinned before sharing pieces with the filter bar)', () => {
    const { container } = render(<CohortExplorerSkeleton cohort={8} {...props} />);
    expect(container.innerHTML).toMatchSnapshot();
  });
});
