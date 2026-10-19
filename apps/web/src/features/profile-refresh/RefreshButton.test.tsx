import { act, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MemberDetail } from '@/entities/member';
import { RateLimitError } from '@/shared/api';

const refresh = vi.fn();
vi.mock('@/entities/member/api/member.api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/member/api/member.api')>()),
  memberApi: { refresh: (...args: unknown[]) => refresh(...args) },
}));

const { RefreshButton } = await import('./RefreshButton');
const { memberDetailQuery } = await import('@/entities/member');

const NOW = new Date('2026-10-20T00:00:00Z');
const detail = (archive: MemberDetail['archive']) => ({ githubId: 'crew', archive }) as unknown as MemberDetail;
const OLD_ARCHIVE = [{ cohort: 8 }] as unknown as MemberDetail['archive'];

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  client.setQueryData(memberDetailQuery('old-id').queryKey, detail(OLD_ARCHIVE));
  render(
    <QueryClientProvider client={client}>
      <RefreshButton githubId="crew" detailId="old-id" />
    </QueryClientProvider>,
  );
  return client;
}

const button = () => screen.getByRole('button');
const click = async () => {
  await act(async () => {
    button().click();
    await vi.advanceTimersByTimeAsync(0);
  });
};
const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  refresh.mockReset();
  localStorage.clear();
});

afterEach(() => vi.useRealTimers());

describe('RefreshButton', () => {
  it('should start a 60s cooldown immediately and store when it ends', async () => {
    refresh.mockReturnValue(new Promise(() => {}));
    setup();

    await click();

    expect(button()).toHaveTextContent('60초');
    expect(button()).toBeDisabled();
    expect(localStorage.getItem('rateLimit_crew')).toBe(String(NOW.getTime() + 60_000));
    await tick(1000);
    expect(button()).toHaveTextContent('59초');
  });

  it('should put the refreshed member into the detail cache, keeping the archive when the new one is empty', async () => {
    refresh.mockResolvedValue(detail([]));
    const client = setup();

    await click();

    expect(refresh).toHaveBeenCalledWith('crew');
    expect(client.getQueryData(memberDetailQuery('old-id').queryKey)?.archive).toEqual(OLD_ARCHIVE);
  });

  it('should follow the server wait time on 429 and hide the message after 2.5s', async () => {
    refresh.mockRejectedValue(new RateLimitError(42, 'too many'));
    setup();

    await click();

    expect(button()).toHaveTextContent('42초');
    expect(screen.getByText('잠시 후에 시도해주세요')).toBeInTheDocument();
    await tick(2600);
    expect(screen.queryByText('잠시 후에 시도해주세요')).not.toBeInTheDocument();
  });

  it('should drop the cooldown on other failures and say so for 2.5s', async () => {
    refresh.mockRejectedValue(new Error('500'));
    setup();

    await click();

    expect(button()).toHaveTextContent('새로고침');
    expect(button()).not.toBeDisabled();
    expect(localStorage.getItem('rateLimit_crew')).toBeNull();
    expect(screen.getByText('새로고침에 실패했습니다')).toBeInTheDocument();
    await tick(2600);
    expect(screen.queryByText('새로고침에 실패했습니다')).not.toBeInTheDocument();
  });

  it('should resume a stored cooldown after reload and clear it when it ends', async () => {
    localStorage.setItem('rateLimit_crew', String(NOW.getTime() + 3_000));
    setup();
    expect(button()).toHaveTextContent('3초');

    await tick(3100);

    expect(button()).toHaveTextContent('새로고침');
    expect(localStorage.getItem('rateLimit_crew')).toBeNull();
  });

  it('should render no countdown on the server (no hydration mismatch)', () => {
    localStorage.setItem('rateLimit_crew', String(NOW.getTime() + 30_000));
    const client = new QueryClient();
    const html = renderToString(
      <QueryClientProvider client={client}>
        <RefreshButton githubId="crew" detailId="crew" />
      </QueryClientProvider>,
    );
    expect(html).toContain('새로고침');
    expect(html).not.toContain('30초');
  });

  it('should resume a stored cooldown after hydrating server HTML (page reload)', async () => {
    localStorage.setItem('rateLimit_crew', String(NOW.getTime() + 30_000));
    const tree = (client: QueryClient) => (
      <QueryClientProvider client={client}>
        <RefreshButton githubId="crew" detailId="crew" />
      </QueryClientProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(tree(new QueryClient()));
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(container, tree(new QueryClient()));
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(container.querySelector('button')).toHaveTextContent('30초');
    expect(localStorage.getItem('rateLimit_crew')).not.toBeNull();
    container.remove();
  });
});
