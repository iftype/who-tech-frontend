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
  cohort/[number]/page.tsx    → /cohort/:number  기수별 크루 목록
  missions/page.tsx           → /missions   미션 아카이브
  feed/page.tsx               → /feed       블로그 피드
  stats/page.tsx              → /stats      통계
  guide/page.tsx              → /guide      서비스 가이드
```

### 렌더링 전략

- 크루 상세(`/:githubId`), 기수 목록 → **Server Component** (SEO, og 메타태그)
- 검색 드롭다운, 필터 탭, 인터랙션 → `'use client'`
- 블로그 피드, 통계 → Server Component + TanStack Query (클라이언트 필터)

### 백엔드 공개 API

```
GET /members                  — 멤버 검색 (?q=&cohort=&track=&role=)
GET /members/feed             — 최근 블로그 피드 (?cohort=&track=)
GET /members/:githubId        — 멤버 상세 (archive, blogPosts 포함)
```

`submissions` 응답: `[{ prUrl, prNumber, title, submittedAt, missionRepo: { name, track, level, tabCategory } }]`
`blogPosts` 응답: BlogPostLatest 최근 10개

### 검색 드롭다운 스펙

- debounce 300ms
- 입력 시 `GET /members?q=` 호출
- 결과: avatar, nickname, githubId, 기수 뱃지, role 뱃지(crew/coach/reviewer), track

### 미션 아카이브 스펙

- tabCategory `base | common` 기준으로 탭 분리
- 레벨(1~4)별 그룹핑, CohortRepo.order 순서
- submission 없으면 빈 상태 표시
- "Copy as Markdown" 버튼으로 전체 목록 클립보드 복사

## 디자인 시스템

- **테마**: 다크모드 기본값, `localStorage` 기반 유지, `html.dark` 클래스 토글
  - `ThemeProvider` + `ThemeToggle` (Navbar 우측 Sun/Moon)
  - CSS 변수 `:root` (라이트) / `html.dark` (다크) — `globals.css` 참고
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
