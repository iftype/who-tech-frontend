@AGENTS.md

# CLAUDE.md — @who-tech/mobile

Expo + react-native-webview로 web (`https://who-tech.vercel.app`)을 감싼 모바일 셸.
콘텐츠는 전적으로 웹에서 가져오므로 **웹 배포가 곧 앱 콘텐츠 갱신**이다.

## 주요 명령어 (루트에서)

```bash
pnpm dev:mobile                                  # expo start (Metro 데브서버 + Expo Go)
pnpm --filter @who-tech/mobile ios               # expo run:ios  (네이티브 빌드 + 시뮬레이터 실행)
pnpm --filter @who-tech/mobile android           # expo run:android (네이티브 빌드 + 에뮬레이터 실행)
pnpm --filter @who-tech/mobile ios:release       # Release 구성으로 iOS 빌드
pnpm --filter @who-tech/mobile android:release   # release variant로 Android 빌드
pnpm build:mobile                                # expo export --platform all (JS 번들만)
pnpm --filter @who-tech/mobile lint              # tsc --noEmit
```

## 로컬 빌드 (EAS 미사용)

이 프로젝트는 **EAS Build를 사용하지 않는다.** 네이티브 빌드는 전부 로컬에서 수행한다.

```bash
# 0) 네이티브 프로젝트 생성/갱신 (app.json 변경 후 필요)
pnpm --filter @who-tech/mobile prebuild

# 1-a) iOS — Xcode 필요. CocoaPods 의존성 설치 후 빌드
cd apps/mobile/ios && pod install && cd -
pnpm --filter @who-tech/mobile ios:release
#   생성물: apps/mobile/ios/build/.../*.app  (Xcode에서 Archive로 .ipa 추출)

# 1-b) Android — Android SDK 필요
cd apps/mobile/android && ./gradlew assembleRelease
#   생성물: apps/mobile/android/app/build/outputs/apk/release/app-release.apk
#   AAB 필요 시: ./gradlew bundleRelease → app/build/outputs/bundle/release/app-release.aab
```

> `android/`, `ios/` 디렉토리는 `.gitignore`로 제외되어 있으므로, prebuild 결과는 빌드 머신마다 매번 새로 생성된다. 네이티브 코드를 커스터마이즈해야 하면 `.gitignore`에서 해당 항목을 풀고 커밋해야 한다.

## 구조

```
apps/mobile/
  App.tsx           # WebView 컨테이너 (SafeArea, 뒤로가기, 외부 링크, 로딩/오류 fallback)
  app.json          # Expo 설정 (extra.webUrl로 타겟 URL 주입)
  metro.config.js   # watchFolders를 패키지로 제한, 워크스페이스 hoisted node_modules 해결
```

## 핵심 동작

- `app.json` → `extra.webUrl`로 로드할 URL 주입 (기본: `https://who-tech.vercel.app`)
- 외부 도메인 링크는 `Linking.openURL`로 시스템 브라우저 위임 (`onShouldStartLoadWithRequest`)
- Android 하드웨어 뒤로가기 → WebView `goBack()` (스택 없으면 시스템 동작)
- `useColorScheme`로 시스템 다크모드 감지 → SafeArea/로딩 배경 동기화
- 네트워크/HTTP 5xx 에러 → 재시도 fallback UI

## 모노레포 주의사항

- 루트 `.npmrc`의 `node-linker=hoisted` 없으면 Metro가 expo-modules-core 등 심볼릭 의존성을 해결 못한다
- React 버전은 루트 `pnpm.overrides`로 web과 통일됨 (`19.2.3`)
- `metro.config.js`는 watchFolders를 `apps/mobile`로 제한해 워크스페이스 전체 스캔 방지

## 앱스토어 심사 리스크

- 단순 WebView 래퍼는 Apple 4.2 (Minimum Functionality)로 리젝 가능
- 완화책: 푸시 알림, 공유, 오프라인 캐싱, 네이티브 네비 등 네이티브 기능 최소 1개 탑재 후 제출
- 도입 시점은 [.claude/MONOREPO_MIGRATION.md](../../.claude/MONOREPO_MIGRATION.md) Phase 3 / 결정 보류 항목 참고
