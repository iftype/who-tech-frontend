# PAGES.md — 페이지 구조 및 라우팅

## 페이지 목록

```
app/
  page.tsx                    → /                홈 (검색 드롭다운 + Pick of the week + 최근 활동)
  [githubId]/page.tsx         → /:githubId       크루 상세 + 미션 아카이브
  cohort/page.tsx             → /cohort          전체 크루 목록 (역할/트랙 필터)
  cohort/[number]/page.tsx    → /cohort/:number  기수별 크루 목록 (역할/트랙 필터)
  feed/page.tsx               → /feed            블로그 피드 (기수 탭 + 트랙 필터 + 7일/30일)
  stats/page.tsx              → /stats           통계
  settings/page.tsx           → /settings        설정 (테마/디자인 + 가이드)
  guide/page.tsx              → redirect('/settings')
```

`cohort/page.tsx`, `cohort/[number]/page.tsx`는 `export const dynamic = 'force-dynamic'` 적용 (어드민 데이터 변경 즉시 반영).

## 렌더링 전략

- 크루 상세, 기수 목록, 피드 → **Server Component** 기반 페이지 진입
- 검색 드롭다운, 기수 목록 역할/트랙 필터(`CohortFilters`), 피드 필터(`FeedClient`), 모바일 네비게이션 → `'use client'`

## 클라이언트 인터랙션 상세

- 역할 필터: 크루/운영진 2단 토글
- 운영진 = `coach || reviewer`
- 피드 탭/기간/트랙 전환은 클라이언트 필터링 중심
- 모바일 상단 메뉴는 prefetch + optimistic navigation 적용
- 기수 목록 탭은 `CohortExplorer`에서 클라이언트 필터링 + `history.pushState` 기반 URL 동기화
- 기수 목록 멤버 데이터는 TanStack Query 캐시(`['members', 'cohort-explorer']`) 사용, 페이지/서버 fetch는 `revalidate: 300`
- 기수 전환 렌더는 `startTransition` + `useDeferredValue`로 부하 완화
- 기수 목록 트랙 필터는 현재 역할군에 실제로 존재하는 트랙만 노출

## 미션 아카이브 스펙

- 탭 구성: `mission` / `pending` / `precourse` (precourse는 데이터 있을 때만 표시)
- `mission` 탭: `base + common` 함께 표시
- `mission` 탭은 `memberTracks` 기반 트랙 필터링 (`track === null`인 공통 미션은 항상 포함)
- `pending` 탭: 현재는 `status === 'closed'` 제출만 표시
- 레벨(1~4)별 그룹핑, CohortRepo.order 순서
- `submissions === null` → "미제출" 표시
- 레포 이름은 크루 포크 레포 링크(`github.com/{githubId}/{repoName}`), PR 제목/번호는 원본 레포 PR 링크
- "Markdown 복사" 버튼으로 현재 탭 전체 목록 클립보드 복사
