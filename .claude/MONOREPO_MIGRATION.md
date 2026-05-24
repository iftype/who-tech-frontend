# 모노레포 전환 계획

기존 Next.js 단일 레포를 pnpm 기반 모노레포로 재구조하고, Expo 웹뷰 앱을 추가하기 위한 작업 계획.

## 1. 스택 결정

| 항목             | 선택                                      | 비고                             |
| ---------------- | ----------------------------------------- | -------------------------------- |
| 패키지 매니저    | pnpm workspaces                           | RN/Next 모노레포 사실상 표준     |
| 태스크 러너      | Turborepo                                 | 캐시/병렬 실행, Vercel 통합 양호 |
| 모바일 셸        | Expo (React Native + WebView)             | EAS Build로 iOS/Android 빌드     |
| 웹뷰 콘텐츠      | 배포된 web URL 로드 (who-tech.vercel.app) | 웹 배포 = 앱 자동 업데이트       |
| 초기 패키지 구조 | `apps/web` + `apps/mobile`                | 공유 패키지는 필요 시점에 추출   |
| 이전 방식        | 현재 레포 in-place 재구조                 | git history 유지                 |

## 2. 목표 디렉토리 구조

```
who-tech-frontend/
├── apps/
│   ├── web/              # 기존 Next.js 코드 전체 이동
│   └── mobile/           # Expo 앱 (신규)
├── package.json          # workspace root (private: true)
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
└── .claude/
```

## 3. 단계별 실행 순서

### Phase 1 — 모노레포 기반 구축 (web만)

1. 루트 `pnpm-workspace.yaml`, root `package.json` (private) 추가
2. 현재 Next.js 파일 전체를 `apps/web/`로 `git mv` (히스토리 보존)
3. `apps/web/package.json` name → `@who-tech/web`
4. Turborepo 설치, `turbo.json`에 `dev` / `build` / `lint` / `lint:fix` / `format` 파이프라인 정의
5. **Vercel Root Directory를 `apps/web`으로 변경** (필수, 가장 위험한 단계)
6. 로컬 `pnpm install` → `pnpm dev` 동작 확인
7. CI/배포 경로(존재 시) 수정

### Phase 2 — Expo 앱 추가

1. `apps/mobile`에 `pnpm create expo-app` (TypeScript 템플릿)
2. `react-native-webview` 설치 후 메인 화면에서 `https://who-tech.vercel.app` 로드
3. 처리 항목:
   - SafeArea
   - Android 하드웨어 뒤로가기 → WebView `goBack`
   - 외부 링크는 시스템 브라우저로 (`onShouldStartLoadWithRequest`)
   - 로딩 인디케이터 / 오프라인 fallback
4. Expo Go로 로컬 검증
5. EAS Build 설정 (`eas.json`), iOS/Android 첫 빌드

### Phase 3 — 웹뷰 최적화 (필요 시점에)

- User-Agent로 웹뷰 감지 → 웹의 헤더/하단 네비 등 중복 UI 숨김
- 네이티브↔웹 메시지 브리지 (`window.ReactNativeWebView.postMessage`)
- 다크모드: 시스템 테마 → WebView에 주입
- 브리지 타입 공유 필요해지면 `packages/shared` 추출

## 4. 주의사항

### Vercel 배포

- **Root Directory 변경이 가장 큰 리스크**. Phase 1에서 푸시 직후 배포가 한 번 깨질 수 있으므로, 변경 시점을 정해서 진행할 것.
- preview 배포가 있는 브랜치도 동일하게 영향. 작업 중 PR은 머지 후 진행 권장.
- 환경변수(`NEXT_PUBLIC_API_URL`)는 Vercel 프로젝트 설정 그대로 유지됨 (Root Directory만 바뀌므로).

### 앱스토어 심사 리스크

- 단순히 "웹을 감싼 앱"은 Apple 4.2 (Minimum Functionality)로 리젝될 수 있음.
- 완화책: 푸시 알림, 공유, 오프라인 캐싱, 네이티브 네비 등 네이티브 기능 최소 1개 이상 탑재 후 제출.

### CLAUDE.md / 문서 경로

- 현재 CLAUDE.md는 web 단일 레포 기준. Phase 1 완료 후:
  - 루트 CLAUDE.md → 모노레포 전체 개요로 갱신
  - `apps/web/CLAUDE.md` → 현재 내용 이동
  - `apps/mobile/CLAUDE.md` → 신규 작성
- `.claude/ARCHITECTURE.md`, `COMPONENTS.md` 등 참고 문서도 web 하위로 이동.

### Git 작업

- 파일 이동은 반드시 `git mv` 사용 (단순 이동도 git이 rename으로 추적하지만 명시적으로).
- 한 PR에 "구조 이동"과 "코드 수정"을 섞지 말 것. Phase 1은 이동만, Phase 2부터 신규 코드.

### 의존성

- 루트 `package.json`은 devDependencies만 (turbo, prettier 등 공통 도구).
- 앱별 의존성은 각 `apps/*/package.json`에 격리.
- React 버전: web (Next 15)과 mobile (Expo)의 React 버전이 다를 수 있음 — 공유 패키지 만들 때 peerDependency로 처리.

### Metro / Next 충돌

- Expo의 Metro bundler가 루트에서 모든 파일을 스캔하지 않도록 `metro.config.js`에서 `watchFolders`를 `apps/mobile`로 제한 필요 (Phase 2).

## 5. 결정 보류 항목

- 푸시 알림 도입 시점 (Expo Notifications)
- 딥링크 / Universal Link 설정
- 다크모드 시스템 테마 동기화 방식
- 공유 패키지 (`packages/shared`) 추출 시점 — 브리지 코드가 생기는 시점 권장
- ESLint/TypeScript config 공유 (`packages/config`) 도입 시점

## 6. 롤백 계획

Phase 1에서 문제 발생 시:

1. Vercel Root Directory를 원복 (대시보드에서 즉시)
2. `git revert`로 구조 변경 커밋 되돌리기
3. 로컬 `pnpm-lock.yaml` / `node_modules` 제거 후 `npm install` 재실행
