# ui — 프론트엔드 페이지·컴포넌트·UX

---

## 2026-04-08

**미션 아카이브 레포 링크를 크루 포크 레포로 변경**

- `MissionArchive`의 레포 이름 링크 대상을 woowacourse 원본 레포에서 크루 포크 레포로 변경
  - 변경 전: `getRepoUrl(prUrl)` → `https://github.com/woowacourse/{repoName}`
  - 변경 후: `https://github.com/{githubId}/{repoName}`
- Markdown 복사 기능도 동일하게 포크 레포 URL 사용
- `githubId` prop이 `[githubId]/page.tsx` → `ProfileTabs` → `MissionArchive` 순으로 전달됨

---

## 2026-04-09

**Vercel Analytics 추가**

- **왜**: 페이지뷰 및 방문자 수 추적
- **핵심 파일**: `src/app/layout.tsx`, `package.json`
- **결정**: `@vercel/analytics` 패키지 설치 후 `<Analytics />` 컴포넌트를 RootLayout에 삽입. Vercel 대시보드 → Analytics 탭에서 확인 가능.

---

## 2026-04-07

**설정 페이지 신규 (가이드 → 설정)**

- **왜**: 가이드와 테마 설정을 하나의 페이지에 통합
- **핵심 파일**: `src/app/settings/page.tsx`, `src/app/settings/SettingsClient.tsx`, `src/app/guide/page.tsx`
- **결정**:
  - `/guide` → `redirect('/settings')`
  - 설정 페이지: "가이드" / "테마" 탭 구조
  - 테마 탭: 2-way light/dark + 3-way 디자인 셀렉터(Next / Apple / Sentry)
  - Navbar: `/guide` → `/settings`, "가이드" → "설정"
  - 헤더에 다크모드 토글(`ThemeToggle`) 유지, `DesignToggle`은 헤더에서 제거
  - 모든 버튼 `cursor-pointer` 적용

**Navbar `data-nav` 속성 추가**

- Apple/Sentry nav 글래스 CSS override를 위한 `header[data-nav]` 셀렉터 기준점

**페이지 컨테이너 `--container-max` CSS 변수 적용**

- 대상 7개 파일: `page.tsx`, `[githubId]/page.tsx`, `cohort/page.tsx`, `cohort/[number]/page.tsx`, `feed/page.tsx`, `guide/page.tsx`, `stats/page.tsx`
- `max-w-[1200px]` → `style={{ maxWidth: 'var(--container-max, 1200px)' }}`

---

## 2026-04-03

**기수 목록 페이지 동적 렌더링**

- **왜**: 빌드 타임 정적 렌더링 → 어드민 데이터 변경이 재배포 전까지 미반영
- **핵심 파일**: `cohort/page.tsx`, `cohort/[number]/page.tsx`
- **결정**: `export const dynamic = 'force-dynamic'`

---

## 2026-04-02

**아바타 이미지 로드 실패 수정 (핫픽스)**

- **왜**: Vercel 무료 플랜 Image Optimization 할당량 초과 → 402 오류
- **핵심 파일**: `next.config.ts`, `src/components/ui/Avatar.tsx`
- **결정**: `images.unoptimized: true` (GitHub CDN이 이미 최적화 이미지 서빙), `onError` 폴백으로 텍스트 이니셜 표시

**홈 피드 링크 개선**

- Pick of the Week: 프사 → GitHub, 닉네임 → 상세 페이지, 제목 → 블로그 (카드 분리)
- Recent Activity: 닉네임 → 상세 페이지, 제목 → 블로그

**크루 상세 — crew 역할 기수만 표시**

- **핵심 파일**: `src/app/[githubId]/page.tsx`
- **결정**: `member.archive`를 crew 역할 기수만 필터링 (코치/리뷰어로 참여한 기수 미션 기록 미출력)

**피드 클라이언트 필터링**

- **핵심 파일**: `src/app/feed/FeedClient.tsx`
- **결정**: 30일치 데이터 한 번 fetch 후 기수·기간·트랙 필터 전부 클라이언트 처리
- `revalidate: 300` (30s → 5분)

**기수 목록 성능 개선**

- `CohortTabBar.tsx` — `useTransition` + `router.push` 낙관적 업데이트
- `startTransition` + `useDeferredValue`로 기수 전환 렌더 부하 완화

**모바일 검색창 자동 확대 방지**

- `SearchDropdown.tsx` — 모바일 input font-size 14px → 16px (iOS Safari 자동 줌 방지)

**홈 히어로 태그 → 링크**

- "우아한테크코스" 태그 → "크루 목록 보기 →" `/cohort` 링크

---

## 2026-03-28

**프론트엔드 Next.js 15 v1 구현**

- 페이지: `/`, `/:githubId`, `/cohort/:number`, `/feed`, `/stats`, `/guide`
- Server Component 기반, 검색 드롭다운 / 필터 / 모바일 메뉴 `'use client'`
- `src/lib/api.ts` — 서버: `NEXT_PUBLIC_API_URL` 직접, 브라우저: `/api` 프록시 (CORS 우회)
- 뱃지: 기수(cohort), 역할(crew/coach/reviewer), 트랙(frontend/backend/android)
- Navbar: 데스크톱 검색창 + 네비 링크 + 모바일 햄버거 메뉴

**가이드 페이지**

- 서비스 소개 + 바로가기 링크, 블로그 등록 방법 + RSS 미지원 플랫폼 안내
