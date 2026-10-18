# CLAUDE.md — who-tech monorepo

우아한테크코스 크루 검색 서비스. pnpm workspaces + Turborepo 기반 모노레포.

## 구조

```
who-tech-frontend/
├── apps/
│   ├── web/      # Next.js 15 App Router 웹 (@who-tech/web)
│   └── mobile/   # Expo + react-native-webview 셸 (@who-tech/mobile)
├── package.json          # 워크스페이스 루트, 공통 devDependencies
├── pnpm-workspace.yaml
├── turbo.json
└── .npmrc                # node-linker=hoisted (Metro 호환)
```

- 백엔드 API: https://iftype.site
- 웹 배포: Vercel (`who-tech.vercel.app`). **Root Directory = `apps/web`** (Vercel 대시보드 설정)
  - `main` push → **프로덕션** 배포 (`who-tech.vercel.app`)
  - `develop` push → **스테이징 프리뷰** 자동 배포 (`who-tech-git-develop-<team>.vercel.app`)
- 앱 빌드: 로컬에서 `expo prebuild` + Xcode / Gradle로 직접 수행 (EAS 사용하지 않음). 웹 URL을 로드하는 WebView 셸 → 웹 배포 = 앱 콘텐츠 갱신

## 명령어 (루트)

```bash
pnpm install
pnpm dev:web           # next dev
pnpm dev:app           # expo start (Metro, 플랫폼 선택)
pnpm dev:app-ios       # expo start --ios
pnpm dev:app-android   # expo start --android
pnpm build:web         # next build
pnpm build:app         # iOS + Android dev 빌드 (expo run:ios && expo run:android)
pnpm build:app-ios     # iOS dev 빌드 (시뮬레이터 실행)
pnpm build:app-android # Android dev 빌드 (에뮬레이터 실행)
pnpm lint
pnpm format
```

## 워크스페이스 규칙

- 루트 `package.json` → 공통 도구만 (turbo, prettier, husky, commitlint, lint-staged, typescript)
- 앱별 의존성은 `apps/*/package.json`에 격리
- React 버전은 mobile (Expo)에 맞춰 루트 `pnpm.overrides`로 고정 → web/mobile 동일 React 사용
- `.npmrc`의 `node-linker=hoisted`: Metro가 pnpm 심볼릭 링크를 처리 못해서 필수

## PR/브랜치 규칙

```
<type>/<topic> ──PR──▶ main (squash) ──▶ 프로덕션
        └─(런타임 영향 변경이면 먼저)─▶ develop에 머지 ──▶ Vercel 스테이징에서 확인
```

- **PR은 `main` 대상.** `main`은 보호됨: 직접 푸시 불가, `Web quality gate` 통과 + 최신 main 기준 필수, squash 머지만 허용, 머지 후 브랜치 자동 삭제.
- `vercel.json`이 `main`·`develop` 외 브랜치 빌드를 건너뛰므로 PR 브랜치에는 프리뷰가 없다.
  런타임 영향이 있는 변경(의존성, 렌더링 로직 등)은 PR 브랜치를 `develop`에 머지해 스테이징(`who-tech-git-develop-<team>.vercel.app`)에서 먼저 확인한다 (force push 없이 머지 커밋으로).
- `develop`은 스테이징 전용. 주기적으로 `main`을 머지해 맞춘다.
- 커밋: Conventional Commits (commitlint로 강제, 백엔드와 같은 규칙)
- 구조 이동과 코드 수정을 한 PR에 섞지 않기

## 패키지별 상세

- [apps/web/CLAUDE.md](apps/web/CLAUDE.md)
- [apps/mobile/CLAUDE.md](apps/mobile/CLAUDE.md)

## 모노레포 전환 이력

[`.claude/MONOREPO_MIGRATION.md`](.claude/MONOREPO_MIGRATION.md) — Phase 1~3 계획 및 결정 보류 항목.
