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

- 백엔드 API: https://iftype.store
- 웹 배포: Vercel (`who-tech.vercel.app`). **Root Directory = `apps/web`** (Vercel 대시보드 설정)
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
feat/#이슈번호-설명 → develop PR → 머지
```

- 커밋: Conventional Commits, subject 소문자 (commitlint로 강제)
- 구조 이동과 코드 수정을 한 PR에 섞지 않기

## 패키지별 상세

- [apps/web/CLAUDE.md](apps/web/CLAUDE.md)
- [apps/mobile/CLAUDE.md](apps/mobile/CLAUDE.md)

## 모노레포 전환 이력

[`.claude/MONOREPO_MIGRATION.md`](.claude/MONOREPO_MIGRATION.md) — Phase 1~3 계획 및 결정 보류 항목.
