# 0004 렌더링·캐시: 동적 렌더링 + 서버 prefetch 하이드레이션

- 상태: 적용 (2026-10-20, #99 · #100 · #102)

## 배경

- 서버 `page.tsx`가 데이터를 받아 `initialItems`·`initialPage`·`allCohorts` 같은 props로 내렸고, 위젯마다 "지금 필터가 서버 필터와 같고 결과가 비어 있지 않을 때만 `initialData`로 쓴다"는 규칙을 조금씩 다르게 가졌다(피드·기수·기수 목록 3가지)
- 페이지의 `.catch(() => 빈 값)` 때문에 서버 실패와 "정말 비어 있음"을 구분하지 못해, 빈 결과면 클라이언트가 무조건 다시 받았다
- 인접 기수 미리 받기는 `prefetchQuery`(일반 쿼리 모양)로 저장했는데 화면은 같은 키를 `useInfiniteQuery`로 읽어 에러가 났다(#94)
- 루트 레이아웃이 테마 쿠키를 읽어(`cookies()`) 모든 라우트가 동적 렌더링인데, `/cohort` 페이지에는 효과 없는 `export const revalidate = 300`이 남아 있었다

## 결정

1. **쿼리 옵션은 엔티티에 한 번만**: `feedQuery`·`cohortMembersQuery`·`cohortsQuery`·`memberDetailQuery`(`queryOptions`/`infiniteQueryOptions`). 서버 prefetch, 화면 쿼리, 미리 받기가 같은 옵션을 써서 키·캐시 모양이 어긋날 수 없다
2. **첫 데이터는 캐시로 넘긴다**: 요청마다 새 `QueryClient` → `prefetch*` → `<HydrationBoundary state={dehydrate(qc)}>`. 서버에서 모듈 전역 클라이언트는 쓰지 않는다(요청 사이 캐시가 섞인다). 브라우저는 하나를 계속 쓴다
3. **실패는 넘기지 않는다**: `prefetch*`는 throw하지 않고 `dehydrate`는 성공한 쿼리만 싣는다 → 서버가 실패하면 화면이 마운트 후 받는다. 정말 빈 결과는 다시 받지 않는다
4. **피드는 다시 받지 않는다**: `staleTime: Infinity`를 옵션에 둬서 하이드레이션 뒤에도 첫 페이지를 다시 받지 않는다(예전 `initialData` + `Infinity`와 같다)
5. **메타데이터와 페이지는 한 번만 받는다**: 상세 페이지는 `React.cache(makeQueryClient)`로 요청 범위 클라이언트를 공유한다
6. **동적 렌더링을 받아들인다**: 테마를 쿠키로 서버에서 정해 첫 화면 깜빡임이 없다. 대신 라우트 캐시는 쓰지 않고 fetch 단위 데이터 캐시(`next.revalidate`)와 브라우저 캐시만 쓴다. 죽은 `revalidate` 설정은 지웠다
7. **정적 내용은 서버 컴포넌트로**: 설정의 가이드·개인정보 탭은 서버에서 그려 슬롯으로 넘긴다(`/settings` JS 10.7→6.7kB)

## 결과

- `initialData` props 0, "SSR 필터와 같을 때만" 분기 0
- 첫 로드 클라이언트 재요청 0 (스테이징·운영 동일, 인접 기수 미리 받기만)
- 스크린샷 0픽셀. 서버 첫 요청에 `offset=0`이 붙어 녹화 응답 키 2개를 옮겼다(응답·기준 이미지 그대로)

## 버린 대안

- **`useSuspenseQuery` + 스트리밍**: 로딩 화면이 바뀐다(스켈레톤 플래시를 피한다는 WebView 원칙과 충돌)
- **정적 렌더링으로 전환(테마를 클라이언트 스크립트로)**: 첫 화면 테마 깜빡임을 막으려면 인라인 스크립트가 필요하고, `useSearchParams` 쓰는 곳마다 Suspense 경계가 필요하다. 지금 트래픽에서는 이득이 작다
- **`loading.tsx`**: 소프트 내비게이션마다 스켈레톤이 끼어든다
