import { QueryClient, isServer } from '@tanstack/react-query';

// 서버(페이지의 prefetch)와 브라우저가 같은 기본값을 쓰도록 QueryClient를 한곳에서 만든다
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
  });
}

let browserQueryClient: QueryClient | undefined;

// 서버에서는 요청마다 새로 만든다 (모듈 전역에 두면 다른 사용자의 요청과 캐시가 섞인다).
// 브라우저에서는 하나를 계속 쓴다 (Suspense로 다시 그려져도 캐시를 잃지 않게)
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
