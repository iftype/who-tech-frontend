# src/app

## 역할

Next.js App Router 페이지 진입점. 서버 컴포넌트 전용.

## 경계

- ✅ 서버에서 데이터 fetch 후 feature 컴포넌트에 props로 전달
- ✅ `revalidate: 300` 표준
- ❌ `'use client'` 금지 (not-found.tsx 예외)
- ❌ 비즈니스 로직 금지 — features/에 위임
- ❌ feature 컴포넌트 내부 구현 직접 참조 금지

## 컨벤션

- fetch 실패 시 `.catch(() => [])` 또는 빈 배열 기본값
- 각 page.tsx는 feature 컴포넌트 하나를 import해서 렌더
- API는 서버: `NEXT_PUBLIC_API_URL` 직접, 브라우저: `/api` 프록시 (`api.ts`가 분기 처리)

## 주의

- `searchParams`를 읽으면 `revalidate` 캐시 키가 URL별로 달라짐 — 현재 미사용, 도입 시 캐시 전략 재검토 필요
- `app/` 하위 폴더에 `page.tsx`만 있고 컴포넌트가 없어야 함 (컴포넌트는 `features/`에)
