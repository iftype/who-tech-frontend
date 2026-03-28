# frontend

우아한테크코스 크루 검색 서비스의 프론트엔드.

## Tech Stack

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일**: Tailwind CSS v4
- **서버 상태**: TanStack Query v5
- **클라이언트 상태**: Zustand
- **다크모드**: 기본값

## 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 20.18.0 (`.node-version` 참고)
- asdf 또는 nvm 사용 시 자동 버전 전환

```bash
npm install
npm run dev       # http://localhost:3000
```

## 스크립트

| 명령어             | 설명                           |
| ------------------ | ------------------------------ |
| `npm run dev`      | 개발 서버 (Next.js, port 3000) |
| `npm run build`    | 프로덕션 빌드                  |
| `npm run start`    | 프로덕션 서버 실행             |
| `npm run lint`     | ESLint 검사                    |
| `npm run lint:fix` | ESLint 자동 수정               |
| `npm run format`   | Prettier 포맷                  |

## 페이지 구조

```
app/
  page.tsx                    → /           (홈 — 검색 + Pick of the week + 최근 활동)
  [githubId]/page.tsx         → /:githubId  (크루 상세 — 프로필 + 미션 아카이브 + 블로그)
  cohort/[number]/page.tsx    → /cohort/:number (기수별 크루 목록)
  missions/page.tsx           → /missions   (미션 아카이브)
  feed/page.tsx               → /feed       (블로그 피드)
  stats/page.tsx              → /stats      (통계)
  guide/page.tsx              → /guide      (서비스 가이드)
```

## 폴더 구조

```
src/
  app/                    → Next.js App Router 페이지
  components/
    ui/                   → Badge, Avatar 등 공통 UI
    layout/               → Navbar, QueryProvider
  features/               → 기능 단위 모듈
    search/               → 검색 드롭다운
    mission-archive/      → 미션 PR 아카이브
  lib/                    → api.ts, utils.ts
  types/                  → 공유 TypeScript 타입
```

## 디자인 토큰

| 토큰                | 값        | 용도                               |
| ------------------- | --------- | ---------------------------------- |
| `--color-accent`    | `#2AC1BC` | 메인 강조색                        |
| `--color-accent-dm` | `#0CEFD3` | 다크모드 강조 (PR 링크, 레벨 헤더) |
| `--color-bg`        | `#000000` | 전체 배경                          |
| `--color-surface`   | `#0d0d0d` | 카드, 입력창                       |
| `--color-border`    | `#1c1c1c` | 카드 테두리                        |
| `--color-text`      | `#ededed` | 메인 텍스트                        |

## 코드 컨벤션

- ESLint flat config (`eslint.config.mjs`) — next/core-web-vitals + next/typescript
- Prettier: semi true, singleQuote true, printWidth 120
- tsconfig: Next.js 기본 설정 (path alias `@/*`)
- pre-commit: lint-staged (변경 파일만 검사)
- commit-msg: commitlint (Conventional Commits)

## 커밋 단위 가이드

작업 단위를 잘게 나눠서 커밋한다.

```
chore: next.js 초기 설정
feat: 홈 검색 드롭다운 구현
feat: 크루 상세 페이지 미션 아카이브
fix: 검색 결과 렌더링 오류 수정
docs: readme 업데이트
```

- 커밋 메시지는 소문자로 시작
- 한 커밋에 여러 관심사를 섞지 않는다
- subject는 72자 이내

## 브랜치 전략

```
main     ← 배포 브랜치 (PR + 리뷰 1명 필수)
develop  ← 통합 브랜치
feat/#이슈번호-설명
fix/#이슈번호-설명
chore/설명
```

## 버전 로드맵

| 버전 | 주요 기능                                                               |
| ---- | ----------------------------------------------------------------------- |
| v1   | 홈 검색 드롭다운, 크루 상세(미션 아카이브 + 블로그), 기수 목록, 피드 ✅ |
| v2   | 통계 차트, 가이드, 필터 고도화                                          |
| v3   | GitHub 로그인, 팔로우                                                   |
| v4   | 오픈미션 워크스페이스 분리                                              |
| v5   | 워크스페이스 단위 조직 관리 (미정)                                      |
