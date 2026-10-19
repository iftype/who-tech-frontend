# widgets/feed

## 역할

블로그 피드 목록 + 기수탭/기간/트랙 필터링 + 운영진/플랫폼 사이드바.

## 구조

```
widgets/feed/
  FeedClient.tsx           화면 조합
  model/useFeedFilters.ts  기간·기수·트랙 필터 (URL에서 계산, 바꿀 때 urlStore.replace)
  model/useFeedPosts.ts    피드 무한 쿼리(feedQuery, 서버가 첫 페이지를 하이드레이션) + 목록 끝(sentinel) 감시
  model/useFeedSummary.ts  운영진 최신 글·기수별 묶음·플랫폼 통계
  FeedListSection.tsx      목록 (기수 선택 시 묶음, 없으면 평탄)
  FeedSidebar.tsx          운영진 최신 글 + 플랫폼 통계 (lg 이상)
  ui/FeedSkeleton.tsx      로딩 화면
사용하는 하위 층:
  features/feed-filter     FeedFilterBar (기수 탭·기간 세그먼트·트랙 칩, 정적 import)
  entities/post            FeedRow·FeedList, postApi·postKeys
```

## 경계

- ✅ 필터 상태는 URL이 단일 소스다. `useFeedFilters`가 `shared/lib/urlStore`의 `useUrl`로 읽고 `urlStore.replace`로 쓴다 (useState로 복사하지 않는다)
- ✅ `FeedSidebar`는 `staffPosts`, `platformStats`를 props로만 받음 — 내부 계산 금지
- ❌ `FeedFilterBar`/`FeedListSection`에서 상태 훅 직접 호출 금지

## 컨벤션

- `staffPosts`: 8기 운영진(coach/reviewer) 최신 글 상위 5개
- `platformStats`: `filtered` 기준 상위 4개 플랫폼
- `grouped`는 `byTrack` 기준 (cohort 필터 미적용) — `filtered`와 다름

## 주의

- `cohort` 탭 선택 시 `FeedListSection`이 `grouped` 렌더로 전환됨
- 사이드바는 `lg:` 이상에서만 표시 (`hidden lg:block`)
- `totalPlatformCount`는 `FeedSidebar` 내부에서 계산
- 트랙 필터는 서버(대표 트랙 `Member.track`)와 화면(멤버의 모든 트랙 `tracks`)에서 두 번 거른다. 같은 조건이 아니라 의도된 이중 필터다
- 로고 클릭으로 피드를 초기화할 때는 `urlStore.replace('/')` (가짜 popstate 이벤트를 쏘지 않는다)
