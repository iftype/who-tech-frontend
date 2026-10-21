import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { optionVariants } from '@/shared/ui';

const theme = { theme: 'dark', toggle: vi.fn(), designSystem: 'paper', setDesign: vi.fn() };
vi.mock('@/shared/providers/ThemeProvider', () => ({ useTheme: () => theme }));

const { ThemeTab } = await import('./ThemeTab');

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));

describe('ThemeTab', () => {
  beforeEach(() => {
    theme.theme = 'dark';
    theme.designSystem = 'paper';
    theme.toggle.mockReset();
    theme.setDesign.mockReset();
  });

  it('should highlight the current theme and design', () => {
    render(<ThemeTab />);
    expect(set(screen.getByRole('button', { name: '다크' }).className)).toEqual(set(optionVariants({ active: true })));
    expect(set(screen.getByRole('button', { name: '라이트' }).className)).toEqual(
      set(optionVariants({ active: false })),
    );
    expect(set(screen.getByRole('button', { name: /Next/ }).className)).toEqual(
      set(optionVariants({ active: true, layout: 'stacked' })),
    );
  });

  it('should only toggle when the other theme is picked', async () => {
    render(<ThemeTab />);
    await userEvent.click(screen.getByRole('button', { name: '다크' }));
    expect(theme.toggle).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: '라이트' }));
    expect(theme.toggle).toHaveBeenCalledTimes(1);
  });

  it('should list the three designs with their labels (including the leading space)', async () => {
    render(<ThemeTab />);
    const labels = [...document.querySelectorAll('span.font-semibold')].map((el) => el.textContent);
    expect(labels).toEqual(['Next', ' Apple', ' Sentry']);

    await userEvent.click(screen.getByRole('button', { name: /Apple/ }));
    expect(theme.setDesign).toHaveBeenCalledWith('apple');
  });
});
