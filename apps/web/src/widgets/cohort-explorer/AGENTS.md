# widgets/cohort-explorer

## 역할

기수별 크루 목록 + 역할(크루/운영진)/트랙 필터링.

## 컴포넌트 구조

```
widgets/cohort-explorer/
  index.ts                    공개 진입점: CohortExplorer
  CohortExplorer.tsx          화면 조합 (필터링·빈 상태 문구·더 보기)
  model/useCohortUrlState.ts  기수·구분·트랙 상태 (URL에서 계산. 기수 탭 urlStore.push, 필터 urlStore.replace)
  model/useCohortMembers.ts   기수 목록(useCohorts)·멤버 페이지 쿼리(cohortMembersQuery), 인접 기수 prefetchInfiniteQuery
  model/cohortLocation.ts     URL ↔ 상태 변환 순수 함수
  ui/CohortExplorerSkeleton   로딩 화면 (제목은 CohortHeading을 그대로 쓴다)
사용하는 하위 층:
  features/cohort-filter      CohortTabBar(기수 탭), CohortFilterBar(구분 토글·트랙 칩), CohortHeading
  entities/member             CohortMemberList(모바일), CohortMemberGrid(데스크톱), useCohorts, cohortMembersQuery,
                              TRACK_OPTIONS, matchesRoleGroup
```

## 경계

- ✅ 상태는 URL이 단일 소스다. `useCohortUrlState`가 `useUrl`로 읽어 계산한다 (useState 복사 없음). 화면은 훅이 돌려준 값만 쓴다
- ✅ `CohortFilterBar`, `CohortMemberList`, `CohortMemberGrid`는 props-only
- ✅ 크루/운영진 그룹 판별(`matchesRoleGroup` — 크루 탭은 크루이면서 운영진이 아닌 사람)과 트랙 칩 목록(`TRACK_OPTIONS`)은 엔티티가 정한다. URL 모양은 `model/cohortLocation.ts`(`parseCohortPath`·`parseCohortSearch`·`buildCohortPath`·`isCohortPath`)
- ❌ `CohortFilterBar`/`MemberList`/`MemberGrid`에서 상태 훅 직접 호출 금지
- ❌ 이 위젯은 localStorage를 쓰지 않는다

## 컨벤션

- `CohortFilterBar`/`CohortMemberList`/`CohortMemberGrid`는 정적 import (SSR 렌더). `dynamic ssr:false` 사용 금지 — 첫 페인트에서 스켈레톤→실제 콘텐츠 교체로 인한 WebView 플래시 유발
- "전체 기수"는 `cohort === null`이다 (`0`이 아니다 — `0`은 미션 아카이브의 "미등록 기수")
- 모바일 리스트/데스크톱 그리드는 둘 다 SSR 렌더하고 각자 `sm:hidden`·`hidden sm:grid`로 하나만 보인다 → 첫 페인트 플래시 방지 (JS `isMobile` 분기·하이드레이션 게이트·추가 래퍼 div 없음)

## 주의

- 기수 탭 전환은 `urlStore.push`(뒤로가기로 돌아온다), 구분·트랙은 `urlStore.replace`. popstate는 같은 구독으로 들어온다
- TanStack Query 키는 `memberKeys.cohortExplorer(cohort, track, roleGroup)` — 기수/트랙/구분별 멤버 fetch/cache에 사용
- 인접 기수는 한가할 때(requestIdleCallback) 미리 받는다
- 실제 fetch 중(`isMembersPending`, 캐시 미스 탭 전환)에만 스켈레톤 표시. 첫 페이지는 서버가 같은 옵션으로 prefetch해 하이드레이션 → 즉시 실제 콘텐츠
- 서버 prefetch·화면 쿼리·인접 기수 미리 받기는 반드시 같은 `cohortMembersQuery`를 쓴다 (모양이 다르면 #94처럼 캐시가 깨진다)
- `/cohort/abc`처럼 숫자가 아닌 기수는 페이지가 404로 보낸다(`parseCohortNumber`) — 이 위젯까지 오지 않는다
