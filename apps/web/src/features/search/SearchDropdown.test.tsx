import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Member } from '@/entities/member';

const push = vi.fn();
const search = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/entities/member', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/member')>()),
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

    await userEvent.type(screen.getByRole('textbox'), 'zzz');

    expect(await screen.findByText('검색 결과가 없습니다')).toBeInTheDocument();
  });

  it('should navigate to the clicked member and clear the input', async () => {
    search.mockResolvedValue([member('garam')]);
    renderDropdown();
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'ga');
    await userEvent.click(await screen.findByText('garam-닉'));

    expect(push).toHaveBeenCalledWith('/garam');
    expect(input).toHaveValue('');
    expect(screen.queryByText('garam-닉')).not.toBeInTheDocument();
  });

  it('should move the selection with arrow keys (wrapping) and select with Enter', async () => {
    search.mockResolvedValue([member('a'), member('b'), member('c')]);
    renderDropdown();
    const input = screen.getByRole('textbox');

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

    await userEvent.type(screen.getByRole('textbox'), 'x');
    await screen.findByText('a-닉');
    await userEvent.keyboard('{Enter}');

    expect(push).not.toHaveBeenCalled();
  });

  it('should close on Escape and outside clicks, and focus with Cmd+K', async () => {
    search.mockResolvedValue([member('a')]);
    renderDropdown();
    const input = screen.getByRole('textbox');

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
    await userEvent.click(screen.getByRole('textbox'));
    expect(search).not.toHaveBeenCalled();
  });

  it('should use compact and mobile header placeholders', () => {
    const { unmount } = renderDropdown({ compact: true });
    expect(screen.getByPlaceholderText('닉네임 / ID 검색')).toBeInTheDocument();
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
    unmount();

    renderDropdown({ compact: true, mobileHeader: true });
    expect(screen.getByPlaceholderText('검색')).toBeInTheDocument();
  });
});
