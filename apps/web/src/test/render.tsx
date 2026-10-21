import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { HydrationBoundary, QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';

/** 테스트용 브라우저 QueryClient: 재시도 없이 바로 실패해 테스트가 기다리지 않게 한다 */
export function makeTestQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
}

/** QueryClientProvider만 씌워 그린다 (서버 데이터 없이 시작하는 화면) */
export function renderWithQuery(ui: ReactElement, client: QueryClient = makeTestQueryClient()) {
  return { ...render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>), client };
}

/**
 * 서버 page.tsx처럼 그린다: seed가 서버용 QueryClient에 넣은 데이터를 dehydrate → HydrationBoundary로
 * 브라우저 캐시에 붙인다. 화면 쿼리의 키가 seed와 같으면 요청 없이 바로 그려져야 한다
 */
export function renderHydrated(ui: ReactElement, { seed }: { seed?: (server: QueryClient) => void } = {}) {
  const server = new QueryClient();
  seed?.(server);
  const client = makeTestQueryClient();
  const result = render(
    <QueryClientProvider client={client}>
      <HydrationBoundary state={dehydrate(server)}>{ui}</HydrationBoundary>
    </QueryClientProvider>,
  );
  return { ...result, client };
}
