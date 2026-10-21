import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoleBadges } from './RoleBadges';

describe('RoleBadges', () => {
  it('should render every role, or only the non-crew ones when hideCrew is set', () => {
    const { container, rerender } = render(<RoleBadges roles={['crew', 'coach', 'reviewer']} />);
    expect(screen.getAllByText(/크루|코치|리뷰어/).map((el) => el.textContent)).toEqual(['크루', '코치', '리뷰어']);

    rerender(<RoleBadges roles={['crew', 'coach', 'reviewer']} hideCrew />);
    expect(screen.getAllByText(/크루|코치|리뷰어/).map((el) => el.textContent)).toEqual(['코치', '리뷰어']);
    // 감싸는 요소 없이 배지만
    expect(container.children).toHaveLength(2);
    expect(container.firstElementChild!.tagName).toBe('SPAN');
  });

  it('should render nothing for an empty role list', () => {
    const { container } = render(<RoleBadges roles={[]} hideCrew />);
    expect(container).toBeEmptyDOMElement();
  });
});
