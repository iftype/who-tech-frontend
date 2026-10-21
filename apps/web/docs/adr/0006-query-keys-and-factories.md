# 0006 서버 상태의 모양은 엔티티에 한 번만 (키 네임스페이스·쿼리 팩토리·http 경계)

- 상태: 적용 (2026-10-21, #107)

## 배경

ADR 0004로 "서버 prefetch와 화면 쿼리가 같은 옵션을 쓴다"는 틀은 잡혔지만, 틀 밖에 남은 것이 있었다.

- 인라인 `useQuery({ queryKey, queryFn, ... })`가 2곳(헤더 검색, 블로그 글 탭)에 있어 키·fetch·캐시 설정을 호출하는 쪽이 정했다
- 쿼리 키 2개(`['cohorts']`, `['blogPosts', id]`)가 엔티티 네임스페이스 밖에 있었다. `invalidateQueries({ queryKey: ['members'] })`로 멤버 캐시를 비워도 기수 목록은 남았다
- Next 데이터 캐시 설정(`next: { revalidate: 300 }`)이 기본 인자·하드코딩·없음, 세 가지 표기로 흩어져 있었다
- `requestJson`은 응답 본문을 `as T`로 믿는데, 그 이유가 어디에도 적혀 있지 않았다

## 결정

1. **키는 네임스페이스로 시작한다**: `memberKeys.*`는 모두 `['members', …]`, `postKeys.*`는 모두 `['posts', …]`. `memberKeys.all`·`postKeys.all`을 export해 엔티티 단위 무효화가 한 줄이다
2. **쿼리 옵션은 팩토리로만**: `memberSearchQuery(q)`(빈 검색어면 `enabled: false`), `memberPostsQuery(githubId)`를 추가해 인라인 `useQuery`를 0으로. 화면 훅은 `useQuery(xxxQuery(...))`만 쓴다
3. **같은 쿼리를 여러 화면이 쓰면 훅으로 한 번 감싼다**: `useCohorts()`가 `EMPTY` 배열 상수와 `useQuery(cohortsQuery())`를 한곳에 둔다 (빈 값마다 새 배열을 만들면 의존하는 메모가 매번 다시 돈다)
4. **http 경계**: `serverCache(seconds)`로 데이터 캐시 표기를 하나로. `ApiError`는 상태 코드와 응답 본문(`body`)을 들고, 메시지는 그대로. `requestJson`의 `as T`는 "백엔드 계약 스냅샷(who-tech-backend, 107개)이 응답 모양을 고정하므로 여기서는 타입만 믿는다"는 신뢰 경계로 주석에 남겼다. 런타임 검증 라이브러리를 들이지 않은 이유다
5. **배럴로만 import**: `@/shared/api`가 `makeQueryClient`·`getQueryClient`까지 내보내고, 페이지의 `@/shared/api/query-client` 깊은 import는 ESLint `no-restricted-imports`가 막는다(#118)

## 하지 않은 것

- `cohorts()`에 데이터 캐시를 붙이지 않았다. 네트워크 동작이 바뀐다(최대 5분 묵은 기수 목록). 바꾸려면 따로 결정한다
- 트랙 센티널을 통일하지 않았다. 기수 화면은 `Track | 'all'`(URL `?track=all`을 받는다), 피드는 `Track | null`(쿼리 없음 = 전체). 각 화면의 URL 계약이라 ADR에 이유만 남긴다
- `FeedItem.member`를 DTO로 분리하지 않았다. 팀 블로그 응답에는 `roles`·`cohorts`가 없을 수 있어 `roles ?? []`가 남아 있다. 런타임 검증 없이 타입만 좁히면 `as`와 같다

## 결과

- 인라인 `useQuery` 2 → 0, 네임스페이스 밖 키 2 → 0, `query-client` 깊은 import 4 → 0
- 하이드레이션 키가 바뀌었지만 서버 prefetch와 화면이 같은 팩토리를 쓰므로 함께 바뀐다. 스테이징·운영 첫 로드 재요청 0 유지
- 고정 테스트: 팩토리별 키·`staleTime`·`enabled`, 모든 키가 네임스페이스로 시작, `serverCache` 모양, `ApiError.body`
