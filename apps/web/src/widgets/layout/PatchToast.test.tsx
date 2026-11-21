import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PATCH_TOAST_COOKIE, PATCH_VERSION, isPatchDismissed } from './model/patchToast';

const LEGACY_KEY = 'who-tech.patch-toast';
const CLOSE = { name: '패치내역 닫기' };

function clearCookie() {
  document.cookie = `${PATCH_TOAST_COOKIE}=; path=/; max-age=0`;
}

// 모듈이 "이번 방문에 닫음"을 기억하므로 테스트마다 새로 불러온다
async function loadPatchToast() {
  vi.resetModules();
  return (await import('./PatchToast')).PatchToast;
}

describe('PatchToast', () => {
  beforeEach(() => {
    localStorage.clear();
    clearCookie();
  });

  it('should show the patch note to a visitor who has not dismissed this version', async () => {
    const PatchToast = await loadPatchToast();
    render(<PatchToast initialVisible />);
    expect(screen.getByRole('link', { name: 'Rilog 팀 블로그' })).toHaveAttribute('href', 'https://www.rilog.kr/feeds');
    expect(screen.getByRole('button', CLOSE)).toBeInTheDocument();
  });

  it('should remember the dismissal in a cookie and stay hidden on the next visit', async () => {
    const PatchToast = await loadPatchToast();
    const { unmount } = render(<PatchToast initialVisible />);

    await userEvent.click(screen.getByRole('button', CLOSE));

    expect(screen.queryByRole('button', CLOSE)).not.toBeInTheDocument();
    expect(document.cookie).toContain(`${PATCH_TOAST_COOKIE}=${PATCH_VERSION}`);

    unmount();
    // 다음 방문: 서버가 같은 쿠키를 읽어 숨긴 채로 내려 준다
    const NextVisit = await loadPatchToast();
    render(<NextVisit initialVisible={false} />);
    expect(screen.queryByRole('button', CLOSE)).not.toBeInTheDocument();
  });

  it('should render on the server exactly what the cookie says, so nothing is inserted after hydration', async () => {
    const PatchToast = await loadPatchToast();
    expect(renderToString(<PatchToast initialVisible />)).toContain('Rilog 팀 블로그');
    expect(renderToString(<PatchToast initialVisible={false} />)).toBe('');
  });

  it('should hide for a visitor who dismissed it in localStorage before, and move the record to the cookie', async () => {
    localStorage.setItem(LEGACY_KEY, PATCH_VERSION);
    const PatchToast = await loadPatchToast();
    render(<PatchToast initialVisible />);
    expect(screen.queryByRole('button', CLOSE)).not.toBeInTheDocument();
    expect(document.cookie).toContain(`${PATCH_TOAST_COOKIE}=${PATCH_VERSION}`);
  });

  it('should survive a blocked storage and still close for this visit', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const PatchToast = await loadPatchToast();
    expect(() => render(<PatchToast initialVisible />)).not.toThrow();
    await userEvent.click(screen.getByRole('button', CLOSE));
    expect(screen.queryByRole('button', CLOSE)).not.toBeInTheDocument();
    getItem.mockRestore();
  });

  it('should show again when a different version was dismissed', async () => {
    localStorage.setItem(LEGACY_KEY, 'older-version');
    document.cookie = `${PATCH_TOAST_COOKIE}=older-version; path=/`;
    expect(isPatchDismissed('older-version')).toBe(false);
    const PatchToast = await loadPatchToast();
    render(<PatchToast initialVisible />);
    expect(screen.getByRole('button', CLOSE)).toBeInTheDocument();
  });
});
