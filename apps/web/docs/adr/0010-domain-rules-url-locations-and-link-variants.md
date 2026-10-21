# 0010 도메인 규칙은 엔티티에, URL 모양은 Location 모듈에, 링크 모양도 variant로

- 상태: 적용 (2026-10-21, #120 · #121 · #122 · #123 · #124)

## 배경

라운드 3 뒤 전수 감사(웹 2갈래)에서 "자기 PR 안"이 아니라 **경계 사이**에 남은 것이 보였다.

- 동작 버그 3건: 피드 기수 탭이 서버(참여 기수)와 다른 기준(대표 기수 `member.cohort`)으로 다시 묶어 글을 조용히 빠뜨렸다. `/settings?tab=guide`는 페이지가 `searchParams`를 읽지 않아 첫 HTML이 테마 탭이었다. 가이드 탭의 `<p>` 안에 `<ul>`·`<div>`가 있어 브라우저가 `<p>`를 먼저 닫았다
- 도메인 **규칙**이 UI에: 크루/운영진 판별(`CohortExplorer`), 기수별 역할 배지 선택과 팀 블로그 배지(`FeedRow`), 트랙 색(`shared/ui/Badge`), 블로그 플랫폼 판별(`shared/lib`), 방문 경로·상세 경로 리터럴 ×5. 라운드 3는 사실(라벨·상수)만 옮겼다
- URL 훅 4개의 모양이 제각각: 위치 인자 vs 객체, 파서가 훅 안 vs 밖, 지역 `isXPath`, `getCohortFromPath`가 `Number()`
- 링크는 리터럴 className 15곳. 토큰 린트는 `<button>`만 봤다. `Avatar`·`SearchDropdown`·`NavLink`는 `className`으로 모양을 덧대는 탈출구

## 결정 (사용자, 2026-10-21)

1. **기수 탭은 서버가 준 글을 전부** (#120): 클라이언트가 서버의 필터를 다른 기준으로 다시 적용하지 않는다. `FeedListSection({ cohort, items })`, `useFeedSummary.grouped` 삭제. 설정 페이지는 `initialTab`을 서버 스냅샷으로, 가이드 설명은 `<div>`. 새 테스트 7건이 옛 코드에서 실패하고 새 코드에서 통과
2. **규칙도 엔티티에** (#121): `isCrewOnly`·`matchesRoleGroup`·`cohortBadgeRoles`(`entities/member/model/role`), `MemberBadgeSet`·`TeamBlogBadge`·`trackBadgeVariants`(`entities/member/ui`), `getBlogSource`·`postVisitPath`(`entities/post/model`), `memberPath`(`entities/member/model/links`). shared `Badge`의 tone은 도메인을 모르는 accent·neutral만 남기고 `BADGE_BASE_CLASS`를 공개해 엔티티가 색을 더한다
3. **화면마다 `*Location.ts`** (#122): `parse*Search`/`parse*Path`·`build*`·`is*Path`를 서버·클라이언트가 같이 쓴다(`'use client'` 밖). 훅은 `{ initial* }` 객체 인자 — `useCohortUrlState`·`useFeedFilters`·`useProfileTabs`·`useSettingsTab`. `parseCohortPath`는 `parseCohortNumber`를 쓴다(정규식이 이미 숫자만 받아 결과 동일)
4. **링크 모양도 variant, 린트가 `<a>`·`Link`도 본다** (#123): `shared/ui/linkVariants`(variant·size·weight·stretched). **모양**(색·호버·테두리·글자 크기)만 variant, **배치**(`flex-1`·`relative z-10`·`hidden sm:inline-flex`)는 호출부 `cn()`. `check-design-tokens`는 링크 리터럴에 모양 토큰이 있을 때만 위반(배치 리터럴 허용). 도메인 색(테코톡 `video`)은 엔티티의 cva
5. **`className`은 레이아웃 위치만** (#124): `Avatar`는 `size: number | 'lg'` 하나(`responsive`·`className` 삭제), `SearchDropdown`은 Navbar가 덧붙이던 너비·펼침을 `searchContainerVariants`·`searchDropdownVariants.mobileHeader`로, `NavLink`는 `placement: 'menu' | 'menuInRow'`가 배치를 품는다. 충돌하는 클래스(`w-full`+`w-[300px]`)는 집합 그대로 옮긴다 — 정리하면 Tailwind의 CSS 순서에 따라 픽셀이 바뀔 수 있다
6. **죽은 export** (#124): 식별자 집합 스캔으로 다른 소스가 참조하지 않는 export를 찾아 `export`를 떼거나(11) 삭제(1), 배럴에서만 재export되던 것은 배럴에서 뺐다(9). knip은 들이지 않는다(ADR 0009)

## 증거

- 리팩토링 PR은 DOM 스냅샷(FeedRow·MemberDetailClient·Navbar)과 클래스 집합 테스트가 "같다"를 말한다. 스냅샷이 `class` **순서만** 바뀐 경우(#123 ×2, #124 ×1)는 속성별 집합을 비교하는 스크립트로 "순서 외 차이 0"을 확인하고 갱신했다(#111의 스켈레톤과 같은 처리)
- 스크린샷 38장 0픽셀(PR 5개 전부), 스테이징·운영 SSR 탭·기수 탭 30/30·11/11 확인
- 테스트 50 → 60 files, 217 → 246 cases, 래칫 93/93 유지. 토큰 린트 위반 0(링크 규칙 포함)

## 하지 않은 것

- `useFeedFilters` 반환 `{ filters, applyFilters, days }`를 평평하게 펴지 않았다: 소비처가 필터를 한 덩어리로 받는다
- 공개 API 에러 모양·`isError` 표시(ADR 0008)·`FeedItem.member` DTO(ADR 0006)는 그대로
