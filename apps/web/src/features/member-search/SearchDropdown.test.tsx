import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Member } from '@/entities/member';

const push = vi.fn();
const search = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
// 쿼리 옵션(member.queries)이 API 모듈을 직접 쓰므로 그 모듈을 바꿔 끼운다
vi.mock('@/entities/member/api/member.api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/member/api/member.api')>()),
  memberApi: { search: (...args: unknown[]) => search(...args) },
}));

const { SearchDropdown } = await import('./SearchDropdown');

function member(githubId: string, overrides: Partial<Member> = {}): Member {
  return {
    githubId,
    nickname: `${githubId}-닉`,
    avatarUrl: null,
    cohort: 8,
    roles: ['crew'],
    cohorts: [{ cohort: 8, roles: ['crew'] }],
    track: 'backend',
    tracks: ['backend'],
    blog: null,
    lastPostedAt: null,
    ...overrides,
  } as Member;
}

function renderDropdown(props: Parameters<typeof SearchDropdown>[0] = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <div>
        <SearchDropdown {...props} />
        <p>outside</p>
      </div>
    </QueryClientProvider>,
  );
}

describe('SearchDropdown', () => {
  beforeEach(() => {
    push.mockReset();
    search.mockReset();
  });

  it('should search after typing and show results with badges', async () => {
    search.mockResolvedValue([member('garam', { roles: ['crew', 'reviewer'], tracks: ['backend', 'android'] })]);
    renderDropdown();

    await userEvent.type(screen.getByPlaceholderText('닉네임 또는 GitHub ID로 검색...'), '가람');

    expect(await screen.findByText('garam-닉')).toBeInTheDocument();
    expect(screen.getByText('@garam')).toBeInTheDocument();
    expect(search).toHaveBeenLastCalledWith({ q: '가람' });
  });

  it('should show an empty state when nothing matches', async () => {
    search.mockResolvedValue([]);
    renderDropdown();

    await userEvent.type(screen.getByRole('combobox'), 'zzz');

    expect(await screen.findByText('검색 결과가 없습니다')).toBeInTheDocument();
  });

  it('should navigate to the clicked member and clear the input', async () => {
    search.mockResolvedValue([member('garam')]);
    renderDropdown();
    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'ga');
    await userEvent.click(await screen.findByText('garam-닉'));

    expect(push).toHaveBeenCalledWith('/garam');
    expect(input).toHaveValue('');
    expect(screen.queryByText('garam-닉')).not.toBeInTheDocument();
  });

  it('should move the selection with arrow keys (wrapping) and select with Enter', async () => {
    search.mockResolvedValue([member('a'), member('b'), member('c')]);
    renderDropdown();
    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'x');
    await screen.findByText('a-닉');

    await userEvent.keyboard('{ArrowUp}'); // -1 → 마지막(c)
    await userEvent.keyboard('{ArrowDown}'); // c → a (순환)
    await userEvent.keyboard('{ArrowDown}'); // a → b
    await userEvent.keyboard('{Enter}');

    expect(push).toHaveBeenCalledWith('/b');
  });

  it('should ignore Enter before any selection', async () => {
    search.mockResolvedValue([member('a')]);
    renderDropdown();

    await userEvent.type(screen.getByRole('combobox'), 'x');
    await screen.findByText('a-닉');
    await userEvent.keyboard('{Enter}');

    expect(push).not.toHaveBeenCalled();
  });

  it('should close on Escape and outside clicks, and focus with Cmd+K', async () => {
    search.mockResolvedValue([member('a')]);
    renderDropdown();
    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'x');
    await screen.findByText('a-닉');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('a-닉')).not.toBeInTheDocument());
    expect(input).not.toHaveFocus();

    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(input).toHaveFocus();
    expect(await screen.findByText('a-닉')).toBeInTheDocument();

    await userEvent.click(screen.getByText('outside'));
    await waitFor(() => expect(screen.queryByText('a-닉')).not.toBeInTheDocument());
  });

  it('should not search for an empty query', async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole('combobox'));
    expect(search).not.toHaveBeenCalled();
  });

  it('should use compact and mobile header placeholders', () => {
    const { unmount } = renderDropdown({ variant: 'compact' });
    expect(screen.getByPlaceholderText('닉네임 / ID 검색')).toBeInTheDocument();
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
    unmount();

    renderDropdown({ variant: 'mobileHeader' });
    expect(screen.getByPlaceholderText('검색')).toBeInTheDocument();
  });

  it('should expose the combobox pattern to assistive tech', async () => {
    search.mockResolvedValue([member('a'), member('b')]);
    renderDropdown();
    const input = screen.getByRole('combobox', { name: '멤버 검색' });
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await userEvent.type(input, 'x');
    const listbox = await screen.findByRole('listbox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(input).not.toHaveAttribute('aria-activedescendant');

    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', options[0]!.id);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('should let only the visible search box take Cmd+K when two are mounted', async () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <SearchDropdown variant="compact" />
        <SearchDropdown variant="mobileHeader" />
      </QueryClientProvider>,
    );
    const [visible, hidden] = screen.getAllByRole('combobox') as HTMLInputElement[];
    // 브라우저에서 sm:hidden 안의 입력은 checkVisibility()가 false
    Object.defineProperty(hidden!, 'checkVisibility', { value: () => false });
    Object.defineProperty(visible!, 'checkVisibility', { value: () => true });

    await userEvent.keyboard('{Meta>}k{/Meta}');

    expect(visible).toHaveFocus();
  });

  // 세 모드(기본·헤더 compact·모바일 헤더)의 클래스 집합. 모드가 variant prop으로 바뀌어도 집합은 그대로여야 한다
  describe('modes', () => {
    const set = (source: Element | string | null) =>
      new Set(
        (typeof source === 'string' ? source : (source?.getAttribute('class') ?? '')).split(/\s+/).filter(Boolean),
      );
    const box = () => screen.getByRole('combobox').parentElement!.parentElement!;

    it('should style the full search box with the shortcut hint', () => {
      renderDropdown();
      expect(set(box())).toEqual(
        set(
          'flex items-center gap-3 rounded-lg border border-border bg-surface focus-within:border-accent/50 px-4 py-3',
        ),
      );
      expect(set(box().querySelector('svg'))).toEqual(set('text-text-muted flex-shrink-0 h-4 w-4'));
      expect(set(screen.getByRole('combobox'))).toEqual(
        set('w-full bg-transparent text-text placeholder:text-text-muted outline-none text-body-lg sm:text-body'),
      );
      expect(screen.getByText('⌘K')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', '닉네임 또는 GitHub ID로 검색...');
    });

    it('should style the compact header box without the hint', () => {
      renderDropdown({ variant: 'compact' });
      expect(set(box())).toEqual(
        set(
          'flex items-center gap-3 rounded-lg border border-border bg-surface focus-within:border-accent/50 px-2.5 py-2',
        ),
      );
      expect(set(box().querySelector('svg'))).toEqual(set('text-text-muted flex-shrink-0 h-3.5 w-3.5'));
      expect(set(screen.getByRole('combobox'))).toEqual(
        set('w-full bg-transparent text-text placeholder:text-text-muted outline-none text-body-sm'),
      );
      expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', '닉네임 / ID 검색');
    });

    it('should style the mobile header box with the scaled input and a scrollable dropdown', async () => {
      search.mockResolvedValue([member('garam')]);
      renderDropdown({ variant: 'mobileHeader', dropdownClassName: 'fixed z-[70]' });
      const input = screen.getByRole('combobox');

      expect(set(box())).toEqual(
        set(
          'flex items-center gap-3 rounded-lg border border-border bg-surface focus-within:border-accent/50 gap-2 px-2 py-1.5',
        ),
      );
      expect(set(box().querySelector('svg'))).toEqual(set('text-text-muted flex-shrink-0 h-3 w-3'));
      expect(set(input.parentElement)).toEqual(set('min-w-0 flex-1 overflow-hidden'));
      expect(set(input)).toEqual(
        set(
          'w-full bg-transparent text-text placeholder:text-text-muted outline-none origin-left text-body-lg placeholder:text-label sm:text-body-sm',
        ),
      );
      expect(input).toHaveStyle({ transform: 'scale(0.86)' });
      expect(input.style.width).toBe(`${100 / 0.86}%`);
      expect(input).toHaveAttribute('placeholder', '검색');

      await userEvent.type(input, 'ga');
      const dropdown = (await screen.findByRole('listbox')).parentElement!;
      expect(set(dropdown)).toEqual(
        set(
          'absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-xl max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain fixed z-[70]',
        ),
      );
    });
  });
});
