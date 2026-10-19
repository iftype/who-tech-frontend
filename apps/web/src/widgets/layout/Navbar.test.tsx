import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

let pathname = '/cohort';
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('@/features/theme-switch/ThemeToggle', () => ({ ThemeToggle: () => null }));

const { Navbar } = await import('./Navbar');

describe('Navbar', () => {
  it('should render navigation as real links (middle click, open in new tab)', () => {
    render(<Navbar />);
    const nav = screen.getByRole('link', { name: '기수 목록' });
    expect(nav.tagName).toBe('A');
    expect(nav).toHaveAttribute('href', '/cohort');
    expect(screen.getByRole('link', { name: '설정' })).toHaveAttribute('href', '/settings');
  });

  it('should mark the current page', () => {
    pathname = '/settings';
    render(<Navbar />);
    expect(screen.getByRole('link', { name: '설정' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '기수 목록' })).not.toHaveAttribute('aria-current');
  });
});
