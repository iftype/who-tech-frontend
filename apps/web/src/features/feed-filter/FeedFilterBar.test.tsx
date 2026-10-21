import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FeedFilterBar } from './FeedFilterBar';

describe('FeedFilterBar', () => {
  it('should render the track chips in the fixed order and report the picked track', async () => {
    const applyFilters = vi.fn();
    render(
      <FeedFilterBar
        filters={{ range: '30d', cohort: null, track: null }}
        applyFilters={applyFilters}
        cohorts={[8, 7]}
        filteredCount={3}
      />,
    );

    const chips = screen.getAllByRole('button', { name: /전체|프론트엔드|백엔드|안드로이드/ });
    // 기간 "전체"와 트랙 "전체"가 함께 잡히므로 트랙 칩은 뒤의 네 개
    expect(chips.slice(-4).map((b) => b.textContent)).toEqual(['전체', '프론트엔드', '백엔드', '안드로이드']);

    await userEvent.click(screen.getByRole('button', { name: '안드로이드' }));
    expect(applyFilters).toHaveBeenCalledWith({ track: 'android' });
    await userEvent.click(chips.at(-4)!);
    expect(applyFilters).toHaveBeenCalledWith({ track: null });
  });
});
