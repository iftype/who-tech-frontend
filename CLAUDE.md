# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

우아한테크코스 크루(멤버) 검색 서비스의 프론트엔드. Next.js 15 App Router 기반 라이트/다크모드 지원 SPA.

- **조직**: https://github.com/iftype
- **백엔드 API**: https://iftype.store (또는 로컬 http://localhost:3001)
- **프로덕션**: Vercel (`who-tech.vercel.app`), GitHub `main` push 시 자동 배포

## 주요 명령어

```bash
# 개발
npm run dev              # http://localhost:3000

# 빌드
npm run build
npm run start            # 프로덕션 실행

# 린트/포맷
npm run lint:fix
npm run format
```

## 아키텍처

### 페이지 구조

```
app/
  page.tsx                    → /           홈 (검색 드롭다운 + Pick of the week + 최근 활동)
  [githubId]/page.tsx         → /:githubId  크루 상세
  cohort/page.tsx             → /cohort     전체 크루 목록 (역할/트랙 필터)
  cohort/[number]/page.tsx    → /cohort/:number  기수별 크루 목록 (역할/트랙 필터)
  feed/page.tsx               → /feed       블로그 피드 (기수 탭 + 트랙 필터 + 7일/30일)
  stats/page.tsx              → /stats      통계
  guide/page.tsx              → /guide      서비스 가이드
```

### 렌더링 전략

- 크루 상세, 기수 목록, 피드 → **Server Component** 기반 페이지 진입
- 검색 드롭다운, 기수 목록 역할/트랙 필터(`CohortFilters`), 피드 필터(`FeedClient`), 모바일 네비게이션 → `'use client'`
  - 역할 필터: 크루/운영진 2단 토글
  - 운영진 = `coach || reviewer`
  - 피드 탭/기간/트랙 전환은 클라이언트 필터링 중심
  - 모바일 상단 메뉴는 prefetch + optimistic navigation 적용
  - 기수 목록 탭은 `CohortExplorer`에서 클라이언트 필터링 + `history.pushState` 기반 URL 동기화 적용
  - 기수 목록 멤버 데이터는 TanStack Query 캐시(`['members', 'cohort-explorer']`)를 사용하고, 페이지/서버 fetch는 `revalidate: 300`
  - 기수 전환 렌더는 `startTransition` + `useDeferredValue`로 부하를 완화
  - 기수 목록 트랙 필터는 현재 역할군에 실제로 존재하는 트랙만 노출

### 백엔드 공개 API

```
GET /members                  — 멤버 검색 (?q=&cohort=&track=&role=)
GET /members/feed             — 최근 블로그 피드 (?cohort=&track=) → [{url, title, publishedAt, member: {githubId, nickname, avatarUrl, cohort, roles, tracks}}]
GET /members/:githubId        — 멤버 상세 (archive, blogPosts 포함)
```

`archive` 응답: `ArchiveLevel[] → { level, repos: ArchiveRepo[] }` → `{ name, track, tabCategory, submissions: ArchiveStep[] | null }`
`blogPosts` 응답: BlogPostLatest 최근 10개

### API 클라이언트 (`src/lib/api.ts`)

- 서버 환경: `NEXT_PUBLIC_API_URL` 직접 호출
- 브라우저 환경: `/api` 프록시 경로 사용 (CORS 우회, `next.config.ts`의 rewrite로 백엔드로 전달)
- `normalizeDetail()`: 구버전(`submission` 단수) / 신버전(`submissions` 배열) 응답 모두 처리

### 검색 드롭다운 스펙

- debounce 300ms
- 입력 시 `GET /members?q=` 호출
- 결과: avatar, nickname, githubId, 기수 뱃지, 운영진 role 뱃지(coach/reviewer), track
- 홈 이외 페이지에서는 헤더에서도 재사용하며, 데스크톱은 네비 목록 왼쪽에 배치하고 모바일 compact 모드는 헤더 안에서 동작

### 미션 아카이브 스펙

- 탭 구성: `mission` / `pending` / `precourse` (precourse는 데이터 있을 때만 표시)
- `mission` 탭: `base + common` 함께 표시
- `mission` 탭은 `memberTracks` 기반 트랙 필터링 (`track === null`인 공통 미션은 항상 포함)
- `pending` 탭: 현재는 `status === 'closed'` 제출만 표시
- 레벨(1~4)별 그룹핑, CohortRepo.order 순서
- `submissions === null` → "미제출" 표시
- 레포 이름은 저장소 링크, PR 제목/번호는 PR 링크
- "Markdown 복사" 버튼으로 현재 탭 전체 목록 클립보드 복사

## 디자인 시스템

- **테마**: 다크모드 기본값, `localStorage` 기반 유지, `html.dark` 클래스 토글
  - `ThemeProvider` + `ThemeToggle` (Navbar 우측 Sun/Moon)
  - CSS 변수 `:root` (라이트) / `html.dark` (다크) — `globals.css` 참고
  - `color-scheme`도 함께 동기화해서 토글 버튼, 테두리, 기본 UI가 한 번에 전환되도록 유지
  - 테마 토글 순간에는 `theme-switching` 클래스로 전역 transition을 잠깐 비활성화해 카드/리스트 지연 전환을 줄임
- **컬러 토큰**: `bg`, `surface`, `surface-alt`, `border`, `text`, `text-secondary`, `text-muted`, `accent`, `accent-dm`
- **다크모드 팔레트** (Paper 디자인 시스템 기준):
  - bg `#000`, surface `#0d0d0d`, border `#1c1c1c`, text `#ededed`, accent `#2AC1BC`, accent-dm `#0CEFD3`
- **폰트**: Geist Sans / Geist Mono
- **Tailwind CSS v4** — CSS 변수를 `@theme`으로 연결
- 뱃지: 기수(cohort), 역할(crew/coach/reviewer), 트랙(frontend/backend/android)
- 로고: `public/logo.png` (행성 캐릭터), `src/app/icon.png` (파비콘)
- **주의**: 테마 전환 시 잔상 방지를 위해 전역 색상 변경 요소에 `transition-colors` 사용 금지

## PR/브랜치 규칙

```
feat/#이슈번호-설명 → develop PR → 머지
```

- **PR은 기능 완성 시에만** (중간 커밋 PR 금지)
- 커밋 메시지: Conventional Commits, subject 소문자

## 환경변수 (.env.local)

```
NEXT_PUBLIC_API_URL=https://iftype.store
```
