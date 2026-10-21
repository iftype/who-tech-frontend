# CLAUDE.md — @who-tech/web

Next.js 15 App Router 웹. 모노레포 `apps/web` 패키지.

- **백엔드 API**: https://iftype.site (로컬: http://localhost:3001)
- **프로덕션**: Vercel (`who-tech.vercel.app`), `main` push 시 자동 배포
- **스테이징**: `develop` push 시 프리뷰 자동 배포 (`who-tech-git-develop-<team>.vercel.app`)
- **배포 흐름**: PR → `main`(squash) → 프로덕션. 런타임 영향 변경은 먼저 `develop`에 머지해 스테이징 확인 (루트 CLAUDE.md)
- **Vercel Root Directory**: `apps/web` (대시보드 설정)

## 주요 명령어 (`apps/web/`에서)

```bash
pnpm dev            # http://localhost:3000
pnpm build
pnpm lint           # eslint . (import 순서·깊은 import 금지 포함)
pnpm lint:tokens    # 디자인 토큰·버튼 모양 규칙
pnpm typecheck
pnpm deps:check     # 계층·슬라이스 경계 (dependency-cruiser)
pnpm test           # vitest + 커버리지 래칫
pnpm build:visual && pnpm test:visual   # 스크린샷 38장 (기준은 Linux CI)
```

## 아키텍처

```
src/app/
  page.tsx                   → /            블로그 피드 (?cohort=&track=&range=)
  [githubId]/page.tsx        → /:githubId   크루 상세 (?tab=&missionTab=)
  cohort/page.tsx            → /cohort      전체 크루 목록 (?roleGroup=&track=)
  cohort/[number]/page.tsx   → /cohort/:n   기수별 크루 목록 (숫자 아니면 404)
  settings/page.tsx          → /settings    설정 (?tab=theme|guide|privacy)
  feed → /, guide → /settings 로 리다이렉트. stats는 자리만
```

- 층: app → widgets → features → entities → shared. 바깥에서는 각 슬라이스의 `index.ts`로만 import한다 → [ARCHITECTURE.md](ARCHITECTURE.md)
- 페이지는 파싱 → prefetch → `HydrationBoundary`만 한다. 데이터는 props가 아니라 캐시로 넘긴다 (ADR 0004·0006)
- URL 상태(필터·탭)는 `shared/lib/urlStore`로 URL에서 계산한다. `useState`로 복사하지 않는다 (ADR 0005·0007)
- API: 서버 환경 → `NEXT_PUBLIC_API_URL` 직접, 브라우저 → `/api` 프록시 (CORS). 둘 다 `shared/api`를 거친다

## 컨벤션

- Tailwind CSS v4, 토큰은 `globals.css`의 `@theme`. 글자 크기·색은 토큰만 (`pnpm lint:tokens`)
- 누르는 요소의 모양은 `shared/ui`의 cva variant로만. **`transition-colors` 전역 사용 금지** — 테마 전환 잔상 방지 (기수 화면의 예외는 ADR 0003)
- 테마·디자인은 **쿠키**(`theme`, `designSystem`)로. 서버 `layout.tsx`가 읽어 `<html>` 클래스를 정하므로 첫 화면이 깜빡이지 않는다 (그래서 모든 경로가 동적 렌더링)
- 리팩토링 PR은 동작 고정 테스트를 먼저 쓰고, 스크린샷 fixture·baseline은 바꾸지 않는다 (ADR 0009)
- 모바일 앱(`apps/mobile`)이 읽는 셀렉터는 바꾸지 않는다: `header[data-nav]`, `button[aria-label="메뉴"]`, 로고 `a[href="/"]`, `html.dark/.apple/.sentry`

## 환경변수 (apps/web/.env.local)

```
NEXT_PUBLIC_API_URL=https://iftype.site
```

## 참고 문서

- [아키텍처와 결정 기록(ADR)](ARCHITECTURE.md)
- 폴더별 규칙: `src/app/AGENTS.md`, `src/shared/ui/AGENTS.md`, `src/shared/lib/AGENTS.md`, `src/widgets/*/AGENTS.md`
- [디자인 시스템](.claude/DESIGN_SYSTEM.md) · [디자인 결정](.claude/design.md) · [UI 메모](.claude/ui.md)
