# features/cohort

## 역할

기수별 크루 목록 + 역할(크루/운영진)/트랙 필터링.

## 컴포넌트 구조

```
CohortExplorer (컨테이너)
  ├── CohortTabBar        — 기수 탭 (전체/1기/2기/...)
  ├── CohortFilterBar     — 역할 토글 + 트랙 버튼 (dynamic ssr:false)
  ├── CohortMemberList    — 모바일 리스트 뷰 (sm:hidden)
  └── CohortMemberGrid    — 데스크톱 카드 그리드 (hidden sm:grid)
```

## 경계

- ✅ `CohortExplorer`가 유일한 상태 owner (`useFilterState('crew', ...)`)
- ✅ `CohortFilterBar`, `CohortMemberList`, `CohortMemberGrid`는 props-only
- ❌ `CohortFilterBar`/`MemberList`/`MemberGrid`에서 `useFilterState` 직접 호출 금지
- ❌ `CohortExplorer` 외 컴포넌트에서 localStorage 접근 금지
- ❌ `CohortFilterBar`를 `dynamic ssr:false` 없이 직접 import 금지

## 컨벤션

- `pageKey`: `'crew'` 고정
- `CohortFilterBar`는 `CohortExplorer`에서 `next/dynamic`으로만 import
- 운영진 판단: `m.roles.some(r => r === 'coach' || r === 'reviewer')`
- `isStaff` 헬퍼는 `CohortExplorer` 모듈 레벨에 정의
- `TRACK_OPTIONS` 상수는 `CohortFilterBar`에서 export, `CohortExplorer`가 import해 `visibleTrackOptions` 계산에 사용

## 주의

- track fallback `useEffect`는 `CohortExplorer`에 있음 (`CohortFilterBar` 아님)
- `useDeferredValue`/`startTransition`은 기수 탭 전환에만 사용, 필터 변경에는 미적용
- TanStack Query `queryKey: ['members', 'cohort-explorer']` — 이 키 변경 시 캐시 무효화됨
