# src/app

## 역할

Next.js App Router 페이지 진입점. **파싱 → prefetch → 하이드레이션** 세 가지만 한다.

## 경계

- ✅ `page.tsx`: 요청마다 `makeQueryClient()`로 `prefetchQuery`/`prefetchInfiniteQuery` → `<HydrationBoundary state={dehydrate(qc)}>`로 위젯을 감싼다. 쿼리 옵션은 엔티티의 `*.queries.ts`(`feedQuery`, `cohortMembersQuery`, `cohortsQuery`, `memberDetailQuery`)만 쓴다
- ✅ URL 값(`params`·`searchParams`)은 파서로만 읽는다. `as` 단언·리터럴 비교 금지
  - 엔티티: `parseTrack`, `parseRoleGroup`, `parseCohortNumber`(`entities/member`), `parseRange`(`entities/post`)
  - 피처·위젯: `parseMissionTab`(`features/mission-archive`), `parseProfileTab`(`widgets/member-profile`)
  - 이 폴더: `parseSettingsTab`(`settings/settingsTab.ts`), URL 모양은 `settings/settingsLocation.ts`(`parseSettingsSearch`·`buildSettingsUrl`·`isSettingsPath`), 탭 상태는 `useSettingsTab({ initialTab })`, 테마·디자인 쿠키는 `parseTheme`·`parseDesign`(`shared/providers/theme`)
- ✅ `'use client'`는 `error.tsx`·`global-error.tsx`와 페이지마다 하나인 `*Client.tsx`, 그리고 테마 탭(`settings/tabs/ThemeTab.tsx`, 테마 전환 상호작용)만
- ✅ 위젯·기능은 공개 진입점으로만 import한다 (`@/widgets/feed`, `@/features/mission-archive` — depcruise가 막는다)
- ❌ 데이터를 props(`initialItems` 등)로 내려보내지 않는다 — 캐시로 넘긴다. props는 URL 상태의 서버 스냅샷용(`initialCohort`·`initialTab` …)만
- ❌ 비즈니스 로직 금지 — 위젯·기능·엔티티에 둔다

## 컨벤션

- prefetch는 실패해도 throw하지 않고, 실패한 쿼리는 dehydrate에 실리지 않는다 → 화면이 마운트 후 다시 받는다 (`.catch(() => 빈 값)`을 쓰지 않는다)
- 같은 요청 안에서 `generateMetadata`와 페이지가 같은 데이터를 쓰면 `React.cache(makeQueryClient)`로 클라이언트를 공유한다 (`[githubId]/page.tsx`)
- 멤버 상세는 `ApiError` 404만 `notFound()`로 보내고, 그 밖의 실패(백엔드 장애)는 던져 `error.tsx`가 "다시 시도"를 보여 준다 (ADR 0007)
- 숫자가 아닌 기수(`/cohort/abc`)는 `notFound()`. 피드의 `?cohort=abc`는 기수 없음
- 두 기수 페이지(`/cohort`, `/cohort/[number]`)는 `cohort/_lib/CohortExplorerPage`(밑줄 = 라우트 아님) 하나를 부른다
- 정적인 내용(설정의 가이드·개인정보 탭)은 서버 컴포넌트로 그려 `*Client`에 슬롯(`ReactNode`)으로 넘긴다
- API는 서버: `NEXT_PUBLIC_API_URL` 직접, 브라우저: `/api` 프록시 (`shared/api/http.ts`가 분기)

## 렌더링과 캐시

- 루트 레이아웃이 테마 쿠키(`cookies()`)를 읽으므로 **모든 라우트가 동적 렌더링**이다. 라우트 단위 `export const revalidate`는 효과가 없어 쓰지 않는다
- 캐시는 fetch 단위 데이터 캐시(`serverCache(300)`, 엔티티 API 함수 안)와 브라우저의 TanStack Query 캐시 두 곳
- 결정 기록: [ADR 0004](../../docs/adr/0004-rendering-and-hydration.md), [ADR 0006](../../docs/adr/0006-query-keys-and-factories.md), [ADR 0007](../../docs/adr/0007-url-parsers-and-profile-tabs.md)
