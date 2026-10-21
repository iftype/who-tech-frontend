import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let pathname = '/cohort';
const prefetch = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push: vi.fn(), prefetch }),
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('@/features/theme-switch/ThemeToggle', () => ({ ThemeToggle: () => <button>테마</button> }));

const { Navbar } = await import('./Navbar');
const { urlStore } = await import('@/shared/lib/urlStore');

const menuButton = () => screen.getByRole('button', { name: '메뉴' });

describe('Navbar', () => {
  beforeEach(() => {
    pathname = '/cohort';
    prefetch.mockReset();
    vi.restoreAllMocks();
  });

  it('should render navigation as real links (middle click, open in new tab)', () => {
    render(<Navbar />);
    const nav = screen.getByRole('link', { name: '기수 목록' });
    expect(nav.tagName).toBe('A');
    expect(nav).toHaveAttribute('href', '/cohort');
    expect(screen.getByRole('link', { name: '설정' })).toHaveAttribute('href', '/settings');
    expect(screen.getByRole('link', { name: '피드' })).toHaveAttribute('href', '/feed');
  });

  it('should mark the current page', () => {
    pathname = '/settings';
    render(<Navbar />);
    expect(screen.getByRole('link', { name: '설정' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '기수 목록' })).not.toHaveAttribute('aria-current');
  });

  // apps/mobile이 WebView에 주입하는 스크립트가 이 셀렉터로 헤더를 찾는다. 바꾸면 앱이 조용히 깨진다
  it('should keep the selectors the mobile shell depends on', () => {
    render(<Navbar />);
    const header = document.querySelector('header[data-nav]');
    expect(header).not.toBeNull();
    expect(header!.querySelector('button[aria-label="메뉴"]')).not.toBeNull();
    expect(header!.querySelector('a[href="/"]')).not.toBeNull();
  });

  it('should prefetch every menu route on mount', () => {
    render(<Navbar />);
    expect(new Set(prefetch.mock.calls.map(([href]) => href))).toEqual(new Set(['/feed', '/cohort', '/settings']));
  });

  it('should reset the feed URL instead of navigating when the logo is clicked on the home page', async () => {
    pathname = '/';
    const replace = vi.spyOn(urlStore, 'replace').mockImplementation(() => undefined);
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    render(<Navbar />);

    const logo = screen.getByRole('link', { name: /who\.tech/ });
    const prevented = !(await dispatchClick(logo));

    expect(replace).toHaveBeenCalledWith('/');
    expect(prevented).toBe(true);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
    vi.unstubAllGlobals();
  });

  it('should let the logo navigate normally from other pages', async () => {
    const replace = vi.spyOn(urlStore, 'replace').mockImplementation(() => undefined);
    render(<Navbar />);

    const prevented = !(await dispatchClick(screen.getByRole('link', { name: /who\.tech/ })));

    expect(replace).not.toHaveBeenCalled();
    expect(prevented).toBe(false);
  });

  it('should open the mobile menu with the same links plus the theme toggle, then close it', async () => {
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: '설정' })).toHaveLength(1);

    await userEvent.click(menuButton());

    const links = screen.getAllByRole('link', { name: '설정' });
    expect(links).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: '피드' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: '기수 목록' })).toHaveLength(2);
    // 모바일 메뉴의 설정 행에는 테마 토글이 같이 있다
    const settingsRow = links[1]!.parentElement!;
    expect(within(settingsRow).getByRole('button', { name: '테마' })).toBeInTheDocument();

    await userEvent.click(menuButton());
    expect(screen.getAllByRole('link', { name: '설정' })).toHaveLength(1);
  });

  it('should move the active mark to the clicked link before the route changes', async () => {
    render(<Navbar />);
    await userEvent.click(menuButton());

    const [desktop, mobile] = screen.getAllByRole('link', { name: '설정' });
    await dispatchClick(mobile!);

    expect(desktop).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '기수 목록' })).not.toHaveAttribute('aria-current');
    // 이동하면 모바일 메뉴는 닫힌다
    expect(screen.getAllByRole('link', { name: '설정' })).toHaveLength(1);
  });

  it('should keep the same markup closed and open (pinned before splitting)', async () => {
    const { container } = render(<Navbar />);
    expect(container.innerHTML).toMatchSnapshot('closed');
    await userEvent.click(menuButton());
    expect(container.innerHTML).toMatchSnapshot('open');
  });
});

// <Link>의 클릭은 jsdom이 이동을 구현하지 않아 콘솔 오류를 내므로, 기본 동작 여부만 읽고 이동은 막는다
async function dispatchClick(el: HTMLElement): Promise<boolean> {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  let allowed = true;
  const { act } = await import('@testing-library/react');
  await act(async () => {
    allowed = el.dispatchEvent(event);
  });
  return allowed;
}
