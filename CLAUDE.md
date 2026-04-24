# CLAUDE.md — Frontend

우아한테크코스 크루 검색 서비스의 프론트엔드. Next.js 15 App Router 기반 SPA.

- **백엔드 API**: https://iftype.store (로컬: http://localhost:3001)
- **프로덕션**: Vercel (`who-tech.vercel.app`), `main` push 시 자동 배포

## 주요 명령어

```bash
npm run dev       # http://localhost:3000
npm run build
npm run lint:fix
npm run format
```

## 아키텍처

```
app/
  page.tsx                 → /            홈
  [githubId]/page.tsx      → /:githubId   크루 상세
  cohort/[number]/page.tsx → /cohort/:n   기수별 목록
  feed/page.tsx            → /feed        블로그 피드
  settings/page.tsx        → /settings   설정
```

- 페이지 진입: Server Component. 검색/필터/네비 인터랙션: `'use client'`
- 기수 목록: TanStack Query 캐시 + `startTransition`/`useDeferredValue`
- API: 서버 환경 → `NEXT_PUBLIC_API_URL` 직접, 브라우저 → `/api` 프록시 (CORS)

## 컨벤션

- Tailwind CSS v4 + CSS 변수 `@theme` 연결
- **`transition-colors` 전역 사용 금지** — 테마 전환 잔상 방지
- 다크모드 기본값, `html.dark` 클래스 토글, `localStorage` 유지

## PR/브랜치 규칙

```
feat/#이슈번호-설명 → develop PR → 머지
```

- PR은 기능 완성 시에만, 커밋: Conventional Commits, subject 소문자

## 환경변수 (.env.local)

```
NEXT_PUBLIC_API_URL=https://iftype.store
```

## 참고 문서

- [아키텍처/렌더링 전략](.claude/ARCHITECTURE.md)
- [컴포넌트 스펙](.claude/COMPONENTS.md)
- [API 클라이언트](.claude/API_CLIENT.md)
- [디자인 시스템](.claude/DESIGN_SYSTEM.md)
- [페이지 구성](.claude/PAGES.md)
