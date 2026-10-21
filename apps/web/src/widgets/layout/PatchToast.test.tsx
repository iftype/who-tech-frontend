import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { PatchToast } from './PatchToast';

const KEY = 'who-tech.patch-toast';

describe('PatchToast', () => {
  beforeEach(() => localStorage.clear());

  it('should show the patch note to a visitor who has not dismissed this version', () => {
    render(<PatchToast />);
    expect(screen.getByRole('link', { name: 'Rilog 팀 블로그' })).toHaveAttribute('href', 'https://www.rilog.kr/feeds');
    expect(screen.getByRole('button', { name: '패치내역 닫기' })).toBeInTheDocument();
  });

  it('should remember the dismissal and stay hidden on the next visit', async () => {
    const { unmount } = render(<PatchToast />);

    await userEvent.click(screen.getByRole('button', { name: '패치내역 닫기' }));

    expect(screen.queryByRole('button', { name: '패치내역 닫기' })).not.toBeInTheDocument();
    const stored = localStorage.getItem(KEY);
    expect(stored).toBeTruthy();

    unmount();
    render(<PatchToast />);
    expect(screen.queryByRole('button', { name: '패치내역 닫기' })).not.toBeInTheDocument();
  });

  it('should show again when a different version was dismissed', () => {
    localStorage.setItem(KEY, 'older-version');
    render(<PatchToast />);
    expect(screen.getByRole('button', { name: '패치내역 닫기' })).toBeInTheDocument();
  });
});
