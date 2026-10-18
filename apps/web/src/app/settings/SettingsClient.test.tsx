import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const theme = { theme: 'dark', toggle: vi.fn(), designSystem: 'paper', setDesign: vi.fn() };
vi.mock('@/shared/providers/ThemeProvider', () => ({ useTheme: () => theme }));

const { SettingsClient } = await import('./SettingsClient');

describe('SettingsClient', () => {
  beforeEach(() => {
    theme.toggle.mockReset();
    theme.setDesign.mockReset();
    window.history.replaceState(null, '', '/settings');
  });

  it('should open the theme tab by default', () => {
    render(<SettingsClient />);
    expect(screen.getByText('화면 밝기를 선택합니다')).toBeInTheDocument();
  });

  it('should restore the tab from the query string', () => {
    window.history.replaceState(null, '', '/settings?tab=privacy');
    render(<SettingsClient />);
    expect(screen.getByRole('heading', { name: '개인정보처리방침' })).toBeInTheDocument();
  });

  it('should switch tabs and record the tab in the URL', async () => {
    render(<SettingsClient />);

    await userEvent.click(screen.getByRole('button', { name: '가이드' }));

    expect(screen.getByRole('heading', { name: 'who.tech 사용 가이드' })).toBeInTheDocument();
    expect(window.location.search).toBe('?tab=guide');
  });

  it('should toggle only when choosing the other theme and change the design system', async () => {
    render(<SettingsClient />);

    await userEvent.click(screen.getByRole('button', { name: /다크/ }));
    expect(theme.toggle).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /라이트/ }));
    expect(theme.toggle).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /Apple 스타일/ }));
    expect(theme.setDesign).toHaveBeenCalledWith('apple');
  });
});
