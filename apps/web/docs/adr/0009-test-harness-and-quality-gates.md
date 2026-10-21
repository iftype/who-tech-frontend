# 0009 테스트 하네스와 품질 게이트: 손대기 전에 고정하고, 규칙은 도구가 지킨다

- 상태: 적용 (2026-10-21, #106 · #118)

## 배경

- 라운드 3는 컴포넌트를 쪼개고 데이터·URL 층을 손대는데, 쪼갤 컴포넌트(`ProfileTabs`·`MemberDetailClient`·`FeedRow`·`Navbar` 메뉴·`ThemeProvider`·`PatchToast`)에 테스트가 없었다. 하이드레이션 렌더 설정은 테스트 2곳에 복사돼 있었다
- 규칙은 문서(AGENTS.md)에만 있었다: 배럴로만 import, import 순서, 슬라이스 경계. `next lint`는 15.5에서 deprecated
- 커밋 훅은 prettier만 돌았다

## 결정

### 테스트 (#106)

1. **동작 고정 테스트를 먼저 쓴다**: 리팩토링 PR마다 "옛 코드로 통과 → 새 코드로 통과". 새 테스트가 옛 코드에서 실패하면 그 PR은 동작을 바꾼 것이다
2. **`src/test/`에 하네스**: `renderHydrated(ui, { seed })`(서버 QueryClient → `dehydrate` → `HydrationBoundary`), `renderWithQuery`, URL 헬퍼(`setUrl`·`popstateTo`), 픽스처(`makeMember`·`makeMemberDetail`·`makeFeedItem`…). `shared/`에 두면 `shared-no-upward` 위반이라 별도 폴더. 커버리지에서 제외
3. **분해할 컴포넌트는 분해 전에 DOM 스냅샷을 찍는다**: `container.innerHTML`을 jsdom의 픽셀 대용으로. 분해가 끝나면 남길 것만 남긴다(FeedRow·MemberDetailClient·Navbar 열림/닫힘). 스켈레톤 스냅샷은 할 일이 끝나 지웠다
4. **클래스는 문자열이 아니라 집합으로 비교**: cva가 순서를 바꿔도 Tailwind 결과는 같다. `variants.test.ts`가 EmptyState·ListCard·navMenuRow·검색창 모드 3개의 집합을 채집해 둔다
5. **WebView 계약은 테스트로**: `header[data-nav]`, `button[aria-label="메뉴"]`, 로고 `a[href="/"]`를 `Navbar.test`가 지킨다. apps/mobile이 주입 스크립트로 읽는 셀렉터라 바꾸면 앱이 조용히 깨진다
6. **커버리지 래칫은 실측으로 올린다**: 67/70 → 88/90(#106) → 93/93(#118). 내려가면 CI가 실패한다

### 품질 게이트 (#118)

7. `lint` = `eslint .`(설정은 `next/core-web-vitals` + `typescript` + `prettier` 그대로), `typecheck` 스크립트, 루트 lint-staged에 web `eslint --fix`
8. `import/order`(외부 → `@/` → 상대, 그룹 사이 빈 줄 없이, 그룹 안 알파벳순) + `no-restricted-imports`(`@/shared/api/*`, `@/entities/*/*` 깊은 import 금지; 테스트는 `vi.mock`을 위해 예외). 자동 수정은 규칙 커밋과 **따로**(38파일, 54줄 ↔ 54줄) — 규칙과 그 결과를 따로 본다
9. **슬라이스 공개 진입점**: `features/*`·`widgets/*`마다 `index.ts`. app·widgets는 그 진입점으로만 import. dependency-cruiser `features-via-index`·`widgets-via-index`·`widgets-no-cross`(`entities-no-cross`와 같은 꼴) — 안쪽 파일 구조를 바꿔도 바깥이 깨지지 않는다
10. `tsconfig` `noUnusedLocals`·`noUnusedParameters`(이미 0 에러라 비용 없음)

### 하지 않은 것

- knip(미사용 export 검사)과 Stryker 대상 확대는 넣지 않았다(사용자 결정). 미사용 export는 #106에서 손으로 정리했다
- `exactOptionalPropertyTypes`는 켜지 않았다

## 결과

- 테스트 파일 18 → 50, 케이스 114 → 217, 커버리지 lines 78.0 → 94.2, functions 78.9 → 94.0
- 하이드레이션 헬퍼 복사본 2 → 0
- 라운드 3 PR 10개 전부 스크린샷 38장 0픽셀, fixture·baseline 변경 0
- CI가 막는 것: 계층 역방향, 슬라이스 안쪽 깊은 import, 위젯끼리 참조, import 순서, 디자인 토큰 위반, 커버리지 하락, 픽셀 변화
