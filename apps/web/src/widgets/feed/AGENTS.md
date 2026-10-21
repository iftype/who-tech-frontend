# widgets/feed

## 역할

블로그 피드 목록 + 기수탭/기간/트랙 필터링 + 운영진/플랫폼 사이드바.

## 구조

```
widgets/feed/
  index.ts                 공개 진입점: FeedClient
  FeedClient.tsx           화면 조합
  model/useFeedFilters.ts  기간·기수·트랙 필터 (URL에서 계산, 바꿀 때 urlStore.replace). parseFeedSearch/buildFeedSearch
  model/useFeedPosts.ts    피드 무한 쿼리(feedQuery, 서버가 첫 페이지를 하이드레이션) + 목록 끝(sentinel) 감시
  model/useFeedSummary.ts  운영진 최신 글·플랫폼 통계
  FeedListSection.tsx      목록 (기수 선택 시 그 기수 제목 + 개수, 없으면 평탄)
  FeedSidebar.tsx          운영진 최신 글 + 플랫폼 통계 (lg 이상)
  ui/FeedSkeleton.tsx      로딩 화면
사용하는 하위 층:
  features/feed-filter     FeedFilterBar (기수 탭·기간 세그먼트·트랙 칩, 정적 import)
  entities/post            FeedRow·FeedList, feedQuery
  entities/member          useCohorts, CURRENT_COHORT, isStaff
```

## 경계

- ✅ 필터 상태는 URL이 단일 소스다. `useFeedFilters`가 `shared/lib/urlStore`의 `useUrl`로 읽고 `urlStore.replace`로 쓴다 (useState로 복사하지 않는다)
- ✅ 피드의 기수는 `number | null`이다. `?cohort=abc`처럼 숫자가 아니면 기수 없음으로 읽는다(`parseCohortNumber`)
- ✅ `FeedSidebar`는 `staffPosts`, `platformStats`를 props로만 받음 — 내부 계산 금지
- ❌ `FeedFilterBar`/`FeedListSection`에서 상태 훅 직접 호출 금지

## 컨벤션

- `staffPosts`: 현재 기수(`CURRENT_COHORT`) 운영진(`isStaff`)의 최근 7일 글 상위 5개
- `platformStats`: 화면에 보이는 글 기준 상위 4개 플랫폼
- 기수 탭의 글은 서버가 참여 기수로 거른 것을 **전부** 그린다. 대표 기수(`member.cohort`)로 다시 묶지 않는다 — 다른 기수가 대표인 크루의 글이 빠졌었다(라운드 4)

## 주의

- 사이드바는 `lg:` 이상에서만 표시 (`hidden lg:block`)
- 트랙 필터는 서버(대표 트랙 `Member.track`)와 화면(멤버의 모든 트랙 `tracks`)에서 두 번 거른다. 같은 조건이 아니라 의도된 이중 필터다
- 로고 클릭으로 피드를 초기화할 때는 `urlStore.replace('/')` (가짜 popstate 이벤트를 쏘지 않는다)
- 요청 실패는 빈 상태("등록된 블로그 글이 없습니다")로 보인다. `isError`를 읽는 곳이 없다 — 알려진 한계(ADR 0008)
