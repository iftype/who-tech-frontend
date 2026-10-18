# features/feed

## 역할

블로그 피드 목록 + 기수탭/기간/트랙 필터링 + 운영진/플랫폼 사이드바.

## 컴포넌트 구조

```
FeedClient (컨테이너)
  ├── FeedFilterBar     — 기수 탭 + 기간 토글 + 트랙 필터 (dynamic ssr:false)
  ├── FeedListSection   — 피드 목록 (cohort 선택 시 그룹, 없으면 평탄)
  │     └── FeedRow     — 단일 피드 아이템
  └── FeedSidebar       — 운영진 최신 글 + 플랫폼 통계 (lg: 이상)
```

## 경계

- ✅ `FeedClient`가 유일한 상태 owner (URL params 기반)
- ✅ `FeedSidebar`는 `staffPosts`, `platformStats`를 props로만 받음 — 낵부 계산 금지
- ❌ `FeedFilterBar`/`FeedListSection`에서 상태 훅 직접 호출 금지
- ❌ `FeedFilterBar`를 `dynamic ssr:false` 없이 직접 import 금지

## 컨벤션

- `FeedFilterBar`는 `FeedClient`에서 `next/dynamic`으로만 import
- `staffPosts`: 8기 운영진(coach/reviewer) 최신 글 상위 5개
- `platformStats`: `filtered` 기준 상위 4개 플랫폼
- `grouped`는 `byTrack` 기준 (cohort 필터 미적용) — `filtered`와 다름

## 주의

- `cohort` 탭 선택 시 `FeedListSection`이 `grouped` 렌더로 전환됨
- 사이드바는 `lg:` 이상에서만 표시 (`hidden lg:block`)
- `totalPlatformCount`는 `FeedSidebar` 내부에서 계산
