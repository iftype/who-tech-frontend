# src/components/ui

## 역할

도메인 무관 UI 프리미티브 컴포넌트. 어느 feature에서도 재사용 가능한 순수 UI 조각.

## 경계

- ✅ 순수 프리미티브 props만 받음 (`string`, `number`, `boolean`, `ReactNode`)
- ❌ `@/types`의 `Member`, `Track`, `Role` 등 도메인 타입 import 금지
- ❌ API 호출 등 사이드이펙트 금지
- ❌ 비즈니스 로직 금지 (cohort === 8이면 특별 처리 같은 것)

## 컨벤션

- `Avatar`: `src`, `alt`, `size`(px), `className`
- `CohortBadge`: `cohort: number`
- `TrackBadge`: `track: Track` (Track 타입은 `@/types`에서 — 예외적으로 타입만 import 허용)
- `RoleBadge`: `role: Role`
- 스타일은 Tailwind + CSS 변수 토큰만 사용 (`bg`, `surface`, `border`, `text`, `accent`)

## 주의

- 도메인 의미를 이 폴더에 넣지 마세요
  - ❌ `if (cohort === 8) return <SpecialBadge />`
  - ✅ feature 컴포넌트에서 조건 처리 후 Badge에 props 전달
- Track/Role 타입 import는 타입 전용(`import type`)으로만 허용
