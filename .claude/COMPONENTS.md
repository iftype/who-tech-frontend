# COMPONENTS.md — 컴포넌트 구조 및 상태 관리

## 디렉토리 구조

```
src/
  app/          # Next.js App Router 페이지
  components/   # 공통 컴포넌트
  features/     # 기능별 컴포넌트
  lib/          # 유틸, API 클라이언트
  types/        # 공통 타입 정의
```

## 주요 컴포넌트

- `CohortExplorer` — 기수 목록 + 역할/트랙 필터, 클라이언트 필터링 + URL 동기화
- `CohortFilters` — 역할(크루/운영진) + 트랙 필터 토글 (`'use client'`)
- `FeedClient` — 피드 탭/기간/트랙 클라이언트 필터링 (`'use client'`)
- `ThemeProvider` + `ThemeToggle` — 다크/라이트모드 전환, Navbar 우측 배치
- 검색 드롭다운 — debounce 300ms, 헤더/홈 재사용, 데스크톱/모바일 compact 모드

## 주요 컴포넌트 (추가)

- `src/components/ui/MemberBadges.tsx` — 기수/역할/트랙 badge 조합
- `src/components/ui/FeedRow.tsx` — 피드 행 렌더
- `src/components/ui/Avatar.tsx` — 아바타 (unoptimized, onError 폴백)
- `src/components/layout/DesignToggle.tsx` — paper→apple→sentry 순환 (설정 페이지 전용)

## 상태 관리

- 서버 상태: TanStack Query (기수 탐색 멤버 데이터)
- URL 상태: `history.pushState` + `popstate` (기수 탭 동기화)
- 로컬 상태: `useState` / `useReducer`
- 테마/디자인: 쿠키 기반 (`theme`, `design`), `ThemeProvider`가 서버에서 초기값 수신

## 검색 드롭다운 스펙

- debounce 300ms
- 입력 시 `GET /members?q=` 호출
- 결과: avatar, nickname, githubId, 기수 뱃지, 운영진 role 뱃지(coach/reviewer), track
- 홈 이외 페이지에서는 헤더에서 재사용
- 데스크톱: 네비 목록 왼쪽 배치
- 모바일 compact 모드: 헤더 안에서 동작
