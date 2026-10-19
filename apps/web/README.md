# frontend

우아한테크코스 크루 검색 서비스 프론트엔드. Next.js 15 App Router / TypeScript / Tailwind CSS v4.

## 빠른 시작

```bash
pnpm install          # 저장소 루트에서
pnpm dev:web          # http://localhost:3000
```

## 주요 명령어

```bash
pnpm --filter @who-tech/web dev          # 개발 서버
pnpm --filter @who-tech/web build        # 프로덕션 빌드
pnpm --filter @who-tech/web test         # 단위·통합 테스트
pnpm --filter @who-tech/web lint:tokens  # 디자인 토큰·버튼 모양 검사
pnpm --filter @who-tech/web deps:check   # 계층 의존 규칙 검사
```

## 환경변수 (.env.local)

```
NEXT_PUBLIC_API_URL=https://iftype.site
```

## 구조

- [ARCHITECTURE.md](ARCHITECTURE.md) — 계층과 의존 규칙, 디자인 시스템, 새 기능 추가 방법, 안전망, 구조 개선 전후 수치
- [docs/adr](docs/adr) — 결정 기록 (계층 구조, 스크린샷 비교, 디자인 시스템)

## 상세 문서

`apps/web/.claude/` 참조:

- `overview.md` — 페이지 구조, 렌더링 전략
- `API_CLIENT.md` — API 클라이언트
- `DESIGN_SYSTEM.md`·`design.md` — 디자인 시스템 (Paper/Apple/Sentry 테마)
- `COMPONENTS.md`·`ui.md` — 컴포넌트, UI 변경 이력
- `PAGES.md` — 페이지 구성
