# src/app

## 역할

Next.js App Router 페이지 진입점. 데이터를 서버에서 미리 받고(prefetch) 위젯을 조립한다.

## 경계

- ✅ `page.tsx`: 요청마다 `makeQueryClient()`로 `prefetchQuery`/`prefetchInfiniteQuery` → `<HydrationBoundary state={dehydrate(qc)}>`로 위젯을 감싼다. 쿼리 옵션은 엔티티의 `*.queries.ts`(`feedQuery`, `cohortMembersQuery`, `cohortsQuery`, `memberDetailQuery`)만 쓴다
- ✅ URL 값(`searchParams`)은 엔티티 파서(`parseTrack`, `parseTrackOrAll`, `parseRoleGroup`, `parseRange`)로 읽는다. `as` 단언 금지
- ✅ `'use client'`는 `error.tsx`·`global-error.tsx`와 페이지마다 하나인 `*Client.tsx`만
- ❌ 데이터를 props(`initialItems` 등)로 내려보내지 않는다 — 캐시로 넘긴다
- ❌ 비즈니스 로직 금지 — 위젯·기능·엔티티에 둔다

## 컨벤션

- prefetch는 실패해도 throw하지 않고, 실패한 쿼리는 dehydrate에 실리지 않는다 → 화면이 마운트 후 다시 받는다 (`.catch(() => 빈 값)`을 쓰지 않는다)
- 같은 요청 안에서 `generateMetadata`와 페이지가 같은 데이터를 쓰면 `React.cache(makeQueryClient)`로 클라이언트를 공유한다 (`[githubId]/page.tsx`)
- 정적인 내용(설정의 가이드·개인정보 탭)은 서버 컴포넌트로 그려 `*Client`에 슬롯(`ReactNode`)으로 넘긴다
- API는 서버: `NEXT_PUBLIC_API_URL` 직접, 브라우저: `/api` 프록시 (`shared/api/http.ts`가 분기)

## 렌더링과 캐시

- 루트 레이아웃이 테마 쿠키(`cookies()`)를 읽으므로 **모든 라우트가 동적 렌더링**이다. 라우트 단위 `export const revalidate`는 효과가 없어 쓰지 않는다
- 캐시는 fetch 단위 데이터 캐시(`next: { revalidate: 300 }`, 엔티티 API 함수 안)와 브라우저의 TanStack Query 캐시 두 곳
- 결정 기록: [ADR 0004](../../docs/adr/0004-rendering-and-hydration.md)
