# 프론트엔드 개요

## 스택

- Next.js 15 App Router + TypeScript strict
- Tailwind CSS v4 + TanStack Query v5
- Vercel 자동 배포 (main 브랜치 push)
- 백엔드 API: `https://iftype.store` (로컬: `http://localhost:3001`)

## 페이지 구조

```
app/
  page.tsx               → /           홈 (검색 + Pick of the Week + 최근 활동)
  [githubId]/page.tsx    → /:githubId  크루 상세 + 미션 아카이브
  cohort/page.tsx        → /cohort     전체 크루 목록
  cohort/[number]/page.tsx → /cohort/:n 기수별 크루 목록
  feed/page.tsx          → /feed       블로그 피드
  stats/page.tsx         → /stats      통계
  settings/page.tsx      → /settings   설정 (테마/디자인 + 가이드)
```

## 렌더링 전략

- 상세/기수/피드: Server Component 기반
- 검색 드롭다운, 필터(`CohortFilters`, `FeedClient`), 모바일 메뉴: `'use client'`
- 기수 목록: TanStack Query `['members', 'cohort-explorer']` + `startTransition` + `useDeferredValue`
- URL 동기화: `history.pushState()` + `popstate`
- 피드: 30일치 1회 fetch → 클라이언트 필터링 (기수/기간/트랙)
- revalidate: 300 (5분)

## API 클라이언트 (`src/lib/api.ts`)

- 서버: `NEXT_PUBLIC_API_URL` 직접 호출
- 브라우저: `/api` 프록시 (CORS 우회, next.config.ts rewrite)

## 디자인 시스템

- 3-way: Paper(기본) / Apple / Sentry
- html 클래스: `html.dark` / `html.apple` / `html.sentry`
- 쿠키 기반 FOUC 방지: `layout.tsx`에서 `cookies()` 읽어 서버 렌더 시 html 클래스 확정
- CSS 변수: `--bg`, `--surface`, `--border`, `--text`, `--accent`, `--accent-dm`
- **주의**: 테마 전환 시 `transition-colors` 전역 사용 금지 → `theme-switching` 클래스로 순간 비활성화

## 컴포넌트

- `src/components/ui/MemberBadges.tsx` — 기수/역할/트랙 badge 조합
- `src/components/ui/FeedRow.tsx` — 피드 행 렌더
- `src/components/layout/ThemeProvider.tsx` — 테마/디자인 컨텍스트
- `src/components/ui/Avatar.tsx` — 아바타 (unoptimized, onError 폴백)

## 주요 명령어

```bash
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드
npm run lint:fix
```

## 환경변수

```
NEXT_PUBLIC_API_URL=https://iftype.store
```

## 브랜치 전략

```
main     ← 배포 브랜치 (Vercel 자동 배포)
develop  ← 기능 통합
feat/#이슈번호-설명
```
