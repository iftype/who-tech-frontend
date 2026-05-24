# DESIGN_SYSTEM.md — 디자인 시스템

## 디자인 시스템 (3-way)

`DesignSystem` 타입: `'paper' | 'apple' | 'sentry'`

html 클래스 조합: `html.dark` / `html.apple` / `html.sentry` (중첩 가능, paper는 기본)

쿠키 기반 FOUC 방지: `layout.tsx`에서 `cookies()`로 서버 렌더 시 html 클래스 확정. `localStorage` 방식 사용 안 함.

설정 페이지(`/settings`) 테마 탭에서 2-way light/dark + 3-way 디자인 셀렉터 제공.

## 테마

- 다크모드 기본값, 쿠키(`theme`, `design`) 기반 유지
- `ThemeProvider` — `initialTheme` / `initialDesign` props 수신 (서버에서 쿠키값 전달)
- `ThemeToggle` (Navbar 우측 Sun/Moon), `DesignToggle`은 설정 페이지 전용
- CSS 변수 `:root` (라이트) / `html.dark` (다크) — `globals.css` 참고
- `color-scheme`도 함께 동기화해서 토글 버튼, 테두리, 기본 UI가 한 번에 전환되도록 유지
- 테마 토글 순간에는 `theme-switching` 클래스로 전역 transition을 잠깐 비활성화해 카드/리스트 지연 전환을 줄임

## 컬러 토큰

```
bg, surface, surface-alt, border
text, text-secondary, text-muted
accent, accent-dm
```

## 팔레트

**Paper (기본)**

```
dark:  bg #000, surface #0d0d0d, border #1c1c1c, text #ededed, accent #2AC1BC / #0CEFD3
```

**Apple**

```
light: bg #f5f5f7, accent #0071e3
dark:  bg #000000, accent #2997ff
폰트: -apple-system, BlinkMacSystemFont, 'SF Pro Text' (타 기기 폴백: Helvetica Neue/Arial)
letter-spacing: -0.374px
```

**Sentry**

```
bg #1f1633, accent #6a5fc1 (라이트/다크 구분 없는 단일 팔레트)
폰트: Rubik (next/font/google, --font-rubik CSS 변수)
nav: rgba(21,15,35,0.85) + blur(18px) saturate(180%)
```

## 폰트

- Paper: Geist Sans / Geist Mono
- Apple: SF Pro Text 시스템 폰트 스택
- Sentry: Rubik (`next/font/google`)

## 기술

- **Tailwind CSS v4** — CSS 변수를 `@theme`으로 연결
- 컨테이너 max-width: `--container-max: 1200px` (CSS 변수로 통일)
- Navbar: `header[data-nav]` 속성으로 디자인별 CSS override 기준점

## 뱃지

- 기수(cohort), 역할(crew/coach/reviewer), 트랙(frontend/backend/android)

## 에셋

- 로고: `public/logo.png` (행성 캐릭터)
- 파비콘: `src/app/icon.png`
- 아바타: `next/image` unoptimized (Vercel 할당량 초과 방지), `onError` 폴백으로 텍스트 이니셜 표시

## 주의사항

- 테마 전환 시 잔상 방지를 위해 전역 색상 변경 요소에 `transition-colors` 사용 금지
- Tailwind `@layer utilities` vs 언레이어드 CSS: 언레이어드가 우선 → nav background는 Tailwind shorthand 때문에 `!important` 필요
