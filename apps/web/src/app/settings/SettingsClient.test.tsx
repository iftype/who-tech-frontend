import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const theme = { theme: 'dark', toggle: vi.fn(), designSystem: 'paper', setDesign: vi.fn() };
vi.mock('@/shared/providers/ThemeProvider', () => ({ useTheme: () => theme }));

const { SettingsClient: Client } = await import('./SettingsClient');
const { GuideTab } = await import('./tabs/GuideTab');
const { PrivacyTab } = await import('./tabs/PrivacyTab');
const SettingsClient = ({ initialTab = 'theme' }: { initialTab?: 'theme' | 'guide' | 'privacy' }) => (
  <Client initialTab={initialTab} guide={<GuideTab />} privacy={<PrivacyTab />} />
);

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

    await userEvent.click(screen.getByRole('tab', { name: '가이드' }));

    expect(screen.getByRole('heading', { name: 'who.tech 사용 가이드' })).toBeInTheDocument();
    expect(window.location.search).toBe('?tab=guide');
  });

  it('should add a history entry per tab and follow the back button', async () => {
    render(<SettingsClient />);
    const length = window.history.length;

    await userEvent.click(screen.getByRole('tab', { name: '가이드' }));
    expect(window.history.length).toBe(length + 1);

    await act(async () => {
      window.history.replaceState(null, '', '/settings?tab=privacy');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: '개인정보처리방침' })).toBeInTheDocument();
  });

  // 서버는 window를 모른다. 페이지가 ?tab= 을 파싱해 넘긴 initialTab 이 서버 스냅샷이라 첫 HTML부터 그 탭이다
  it('should render the tab the page parsed on the server, not the theme tab', () => {
    expect(renderToString(<SettingsClient initialTab="guide" />)).toContain('who.tech 사용 가이드');
    expect(renderToString(<SettingsClient initialTab="guide" />)).not.toContain('화면 밝기를 선택합니다');
    expect(renderToString(<SettingsClient />)).toContain('화면 밝기를 선택합니다');
  });

  it('should hydrate the same tab the server rendered when the URL matches', () => {
    window.history.replaceState(null, '', '/settings?tab=guide');
    render(<SettingsClient initialTab="guide" />);
    expect(screen.getByRole('tab', { name: '가이드' })).toHaveAttribute('aria-selected', 'true');
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
