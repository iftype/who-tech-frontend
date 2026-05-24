# Design Prompt — who.tech Frontend

Paper MCP로 생성된 디자인 초안의 근거가 되는 디자인 명세.

---

## Design Brief

### Color Palette

| Role               | Hex                    | Usage                 |
| ------------------ | ---------------------- | --------------------- |
| Background         | `#000000`              | 전체 배경             |
| Surface            | `#0d0d0d`              | 카드, 입력창 배경     |
| Surface Alt        | `#111111`              | 네브바, 드롭다운      |
| Card Border        | `#1c1c1c`              | 카드 테두리           |
| Divider            | `#1a1a1a`              | 섹션 구분선           |
| Text Primary       | `#ededed`              | 메인 텍스트           |
| Text Secondary     | `#888888`              | 서브 텍스트           |
| Text Muted         | `#555555`              | 비활성 / 힌트         |
| Text Dim           | `#444444`              | 날짜, 카운트          |
| Accent Teal        | `#2AC1BC`              | 강조, 링크, 기수 뱃지 |
| Accent Teal Bg     | `rgba(42,193,188,0.1)` | 기수 뱃지 배경        |
| Accent Teal Border | `rgba(42,193,188,0.2)` | 기수 뱃지 테두리      |

### Typography

- **Display Font**: Geist (400 / 500 / 600 / 700)
- **Mono Font**: Geist Mono (번호, GitHub ID, 코드, 수치)
- **Size Scale**:
  - 52px / 700 — 홈 Hero 타이틀
  - 28px / 700 — 프로필 이름, 통계 수치
  - 20px / 700 — 페이지 제목
  - 17px / 600 — 카드 제목 (Pick of the week)
  - 16px / 600 — 가이드 섹션 제목
  - 14px / 500 — 피드 글 제목
  - 13px / 400~600 — 본문, 레이블
  - 12px / 400 — 서브 레이블
  - 11px / 400~600 — 뱃지, 캡션, 날짜
  - 10px / 500 — 섹션 헤더 (UPPERCASE, letter-spacing: 0.08em)

### Spacing Rhythm

- **Section gap**: 80px (좌우 padding)
- **Group gap**: 24–32px
- **Element gap**: 8–16px
- **Card padding**: 24px
- **Row padding**: 12–16px 세로, 16–20px 가로

### Visual Direction

Next.js/Vercel 미니멀 개발자 감성 — 순수 다크, 정밀한 타이포 위계, 선명한 `#1c1c1c` 경계선, Geist Mono로 숫자/ID 강조. 색은 Vercel Blue 단 하나만 사용.

---

## Pages

### Home Page (`/`)

- **Navbar**: `who.tech` + BETA 뱃지 / 우측 네브 링크
- **Hero**: 기수 레이블 → 대형 타이틀 → 서브카피 → 검색창 + 드롭다운 (debounce 300ms)
  - 드롭다운 행: 아바타 · 닉네임 · @githubId · 기수뱃지 · 역할뱃지 · 트랙뱃지
- **Bottom**: Pick of the week (좌, flex:1) + Recent Activity 피드 5개 (우, 400px)

### Detail Page (`/:githubId`)

- **Profile Header**: 아바타(80px) + 이름/핸들 + 뱃지 행 (기수/역할/트랙/GitHub링크)
- **Content Area** (2-col):
  - 좌: 미션 PR 아카이브 — 탭(기준/공통) + Markdown 복사 버튼 + 레벨별 그룹 리스트
  - 우 (380px): 블로그 글 목록 + 마지막 게시 표시

### Cohort List Page (`/cohort/:number`)

- **Cohort Tab Bar**: 기수 탭 (underline 스타일)
- **Filter Bar**: 역할 필터 + 트랙 필터 + 인원 수
- **Crew Grid**: 카드 (200px × auto) — 아바타 56px + 닉네임 + 뱃지

### Feed Page (`/feed`)

- **Feed List** (flex:1): 페이지 제목 + 기간 토글(30일/전체) + 기수/트랙 필터 + 피드 리스트
- **Sidebar** (280px): 이번 달 활발한 크루 + 플랫폼 분포

### Stats Page (`/stats`)

- **KPI Cards** (4열): 전체 크루 / 평균 미션 제출률 / 블로그 등록 / 이번 달 글
- **Charts** (2열):
  - 기수별 미션 제출률 바 차트
  - 블로거 랭킹 리스트

### Guide Page (`/guide`)

- **Left Nav** (220px): 목차 사이드바
- **Right Body**: 페이지 제목 + 단계별 섹션 (번호 원 + 텍스트 + 스크린샷 placeholder)

---

## Design Tokens (Tailwind 변환 참고)

```css
/* tailwind.config 또는 globals.css */
--color-bg: #000000;
--color-surface: #0d0d0d;
--color-surface-alt: #111111;
--color-border: #1c1c1c;
--color-border-dim: #1a1a1a;
--color-text: #ededed;
--color-text-secondary: #888888;
--color-text-muted: #555555;
--color-accent: #2ac1bc;
```
