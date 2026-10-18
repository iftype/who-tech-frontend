# widgets/cohort-explorer

## 역할

기수별 크루 목록 + 역할(크루/운영진)/트랙 필터링.

## 컴포넌트 구조

```
widgets/cohort-explorer/
  CohortExplorer.tsx          화면 조합 (필터링·빈 상태 문구·더 보기)
  model/useCohortUrlState.ts  기수·구분·트랙 상태 (URL 단일 소스, popstate·pushState)
  model/useCohortMembers.ts   기수 목록·멤버 페이지 쿼리, 인접 기수 prefetch
  model/cohortLocation.ts     URL ↔ 상태 변환 순수 함수
  ui/CohortExplorerSkeleton   로딩 화면
사용하는 하위 층:
  features/cohort-filter      CohortTabBar(기수 탭), CohortFilterBar(구분 토글·트랙 칩, TRACK_OPTIONS)
  entities/member             CohortMemberList(모바일), CohortMemberGrid(데스크톱), memberApi·memberKeys
```

## 경계

- ✅ 상태는 `useCohortUrlState` 한 곳에서만 가진다 (URL 기반). 화면은 훅이 돌려준 값만 쓴다
- ✅ `CohortFilterBar`, `CohortMemberList`, `CohortMemberGrid`는 props-only
- ❌ `CohortFilterBar`/`MemberList`/`MemberGrid`에서 상태 훅 직접 호출 금지
- ❌ `CohortExplorer` 외 컴포넌트에서 localStorage 접근 금지

## 컨벤션

- `CohortFilterBar`/`CohortMemberList`/`CohortMemberGrid`는 정적 import (SSR 렌더). `dynamic ssr:false` 사용 금지 — 첫 페인트에서 스켈레톤→실제 콘텐츠 교체로 인한 WebView 플래시 유발
- 운영진 판단: `m.roles.some(r => r === 'coach' || r === 'reviewer')`
- `isStaff` 헬퍼는 `CohortExplorer` 모듈 레벨에 정의
- `TRACK_OPTIONS` 상수는 `CohortFilterBar`에서 export, `CohortExplorer`가 import해 `visibleTrackOptions` 계산에 사용

## 주의

- track fallback `useEffect`는 `CohortExplorer`에 있음 (`CohortFilterBar` 아님)
- 기수 탭 전환은 `CohortExplorer` local state + TanStack Query cache로 처리하고, URL은 History API로 동기화
- TanStack Query 키는 `memberKeys.cohortExplorer(cohort, track, roleGroup)` (`@/entities/member`) — 기수/트랙/구분별 멤버 fetch/cache에 사용
- numbered cohort 탭 데이터는 현재 기수의 인접 기수만 idle 시점에 prefetch
- 모바일 리스트/데스크톱 그리드는 둘 다 SSR 렌더하고 CSS(`sm:hidden`·`hidden sm:block`)로 전환 → 첫 페인트 플래시 방지 (JS `isMobile` 분기·하이드레이션 게이트 제거)
- 실제 fetch 중(`isMembersPending`, 캐시 미스 탭 전환)에만 스켈레톤 표시. 초기 로드는 `initialPage`로 즉시 실제 콘텐츠 렌더
