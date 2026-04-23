# design — 디자인 시스템·테마·CSS 토큰

---

## 2026-04-07

**Sentry 디자인 시스템 추가 + 쿠키 기반 FOUC 방지**

**왜**: 디자인 시스템 3종(Paper/Apple/Sentry) + 인라인 `<script>` 방식의 FOUC 방지를 서버 쿠키 방식으로 교체

**핵심 파일**:

- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/layout/ThemeProvider.tsx`
- `src/components/layout/DesignToggle.tsx`

**결정**:

- `DesignSystem` 타입: `'paper' | 'apple' | 'sentry'` (3-way)
- html 클래스 조합: `html.dark` / `html.apple` / `html.sentry` (중첩 가능, paper는 기본)
- Sentry 팔레트: dark purple(`#1f1633` bg, `#6a5fc1` accent) — 라이트/다크 구분 없이 단일 팔레트, 라이트 모드에서만 `--bg/#2d2248`으로 약간 차이
- Sentry 폰트: Rubik (`next/font/google`, `--font-rubik` CSS 변수)
- Sentry nav: `rgba(21,15,35,0.85)` + `blur(18px) saturate(180%)`
- 쿠키 방식: `layout.tsx`에서 `cookies()` 읽어 서버 렌더 시 html 클래스 확정 → FOUC 없음
- `setCookie()` — `Secure`(https 조건부), `SameSite=Lax`, `max-age=31536000`
- `isTheme(v)` / `isDesign(v)` 타입 가드 (unsafe `as` 캐스팅 제거)
- `applyDesign(ds)` — `el.classList.remove('apple','sentry')` 후 추가
- `ThemeProvider` — `useLayoutEffect`/`localStorage` 제거, `initialTheme`/`initialDesign` props 수신
- `DesignToggle` — paper→apple→sentry 순환, 헤더에서는 미사용(설정 페이지 전용)
- 컨테이너 max-width 통일: Apple 980px 제거, 모두 `--container-max: 1200px` (토글 시 레이아웃 shift 방지)

**보안 검토 결과 적용**:

- `Secure` 속성 추가 (https 환경 조건부)
- `as` 캐스팅 → 타입 가드로 교체

---

## 2026-04-07 (앞선 커밋)

**Apple 디자인 시스템 + 토글 버튼**

**왜**: Paper 디자인(teal accent, Geist 폰트, 베이지/블랙)에 Apple 디자인을 병행 지원

**결정**:

- Apple 팔레트: light(`#f5f5f7` bg, `#0071e3` accent) / dark(`#000000` bg, `#2997ff` accent)
- Apple 타이포그래피: `-apple-system, BlinkMacSystemFont, 'SF Pro Text'` 폰트 스택, `letter-spacing: -0.374px`
- `html.apple h1`만 오버라이드(h2/h3/p/li 전역 오버라이드는 카드 등 다른 컴포넌트에 영향 → 제거)
- 히어로 폰트 토큰: `--fs-hero: 38px`, `--fs-hero-sm: 56px`, `--lh-hero`, `--ls-hero` (반응형 유지)
- Apple nav 글래스: `html.apple header[data-nav]` — `rgba(0,0,0,0.8) !important`, `backdrop-filter: blur(20px)`
- 설정 페이지 `ThemeTab`에서 2-way light/dark + 3-way 디자인 셀렉터 제공

**주의**:

- Tailwind `@layer utilities` vs 언레이어드 CSS cascade: 언레이어드 CSS가 우선 → `!important` 없이 오버라이드 가능(nav background는 Tailwind 배경색 shorthand 때문에 `!important` 필요)
- SF Pro는 Apple 기기 전용 시스템 폰트, 타 기기에서는 Helvetica Neue/Arial 폴백

---

## 2026-03-28

**프론트엔드 기술 스택 확정**

- Next.js 15 App Router (Vanilla TS에서 전환 — SEO, og 메타태그, Server Component 개선)
- Tailwind CSS v4, TanStack Query v5
- Paper 디자인 시스템: 다크모드 기본, `html.dark` 클래스 토글
- CSS 변수: `--bg`, `--surface`, `--border`, `--text`, `--accent` 등
- `color-scheme` 동기화 — 토글 버튼·기본 UI 한 번에 전환
- `theme-switching` 클래스로 토글 순간 전역 transition 비활성화 (카드/리스트 지연 전환 방지)
- 폰트: Geist Sans / Geist Mono
