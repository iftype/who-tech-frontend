# CLAUDE.md — @who-tech/web

Next.js 15 App Router 기반 SPA. 모노레포 `apps/web` 패키지.

- **백엔드 API**: https://iftype.store (로컬: http://localhost:3001)
- **프로덕션**: Vercel (`who-tech.vercel.app`), `main` push 시 자동 배포
- **Vercel Root Directory**: `apps/web` (대시보드 설정)

## 주요 명령어 (루트에서)

```bash
pnpm dev:web          # http://localhost:3000
pnpm build:web        # next build
pnpm --filter @who-tech/web lint:fix
pnpm --filter @who-tech/web format
```

또는 `apps/web/`에서 직접 `pnpm dev`, `pnpm build` 등.

## 아키텍처

```
src/app/
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

## 환경변수 (apps/web/.env.local)

```
NEXT_PUBLIC_API_URL=https://iftype.store
```

## 참고 문서

- [API 클라이언트](.claude/API_CLIENT.md)
- [컴포넌트 스펙](.claude/COMPONENTS.md)
- [디자인 시스템](.claude/DESIGN_SYSTEM.md)
- [페이지 구성](.claude/PAGES.md)
- [개요](.claude/overview.md)
