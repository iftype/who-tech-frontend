# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

우아한테크코스 크루(멤버) 검색 서비스의 프론트엔드. Next.js 15 App Router 기반 다크모드 SPA.

- **조직**: https://github.com/who-tech-course
- **백엔드 API**: https://iftype.store (또는 로컬 http://localhost:3001)
- **프로덕션**: PM2 앱 이름 `frontend`, Nginx reverse proxy

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

- **다크모드 기본값**
- **폰트**: 한글 지원 (Pretendard 또는 Noto Sans KR)
- **Tailwind CSS v4** 사용
- 뱃지: 기수(cohort), 역할(crew/coach/reviewer), 트랙(frontend/backend/android)
- 카드 hover 애니메이션, 드롭다운 fade 애니메이션

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
