# 0008 컴포넌트 합성: 같은 의미는 하나로, props는 CSS가 아니라 의미를 말한다

- 상태: 적용 (2026-10-21, #108 · #111 · #112 · #113 · #115 · #117)

## 배경

2026-10-21 전수 조사에서 UI가 손으로 복사된 자리가 많았다.

- 도메인 사실이 UI에: 트랙 라벨 맵 3벌, 운영진 판별 2벌, `.filter(r => r !== 'crew')` 4벌, GitHub URL 3벌, 현재 기수 `8` 하드코딩 3곳, "기수 0 = 전체"와 "기수 0 = 미등록"이 같은 숫자로 다른 뜻
- 같은 모양이 클래스 문자열로: 빈 상태 박스 3벌, 카드 컨테이너 3벌, 페이드인 인라인 style 3벌, `container-max` 인라인 3벌, 인라인 SVG 8개
- 큰 컴포넌트: `Navbar` 178줄(상태를 effect로 되돌림), `MemberDetailClient` 123줄(렌더 함수를 두 번 호출), `ProfileTabs` 122줄(props 6개, 안에 데이터 섹션), `SearchDropdown` 134줄(불리언 2개 × 중첩 삼항 4곳)

## 결정

1. **도메인 사실은 엔티티에** (`entities/member/model/`): `labels`(`TRACK_LABEL`·`ROLE_LABEL`·`TRACK_OPTIONS`), `role`(`isStaff`·`nonCrewRoles`), `links`(`githubProfileUrl`), `constants`(`CURRENT_COHORT`·`UNREGISTERED_COHORT`), `archive`(`visibleArchive`). UI는 읽기만 한다. "전체 기수"는 `0`이 아니라 `null`
2. **같은 의미 → 공용 컴포넌트, props는 의미**: `EmptyState({ frame, size })`, `ListCard({ stack })`, `RoleBadges({ roles, hideCrew })`, `staggerFadeIn(i)`. 레이아웃 위치(`col-span-full`, `sm:hidden`)만 `className`으로 받고 모양은 variant로. 클래스 집합은 `variants.test.ts`가 채집해 고정한다
3. **아이콘은 복사, 라이브러리로 바꾸지 않는다**: `shared/ui/icons`에 인라인 SVG 8개를 **원문 그대로** 옮겼다. lucide 같은 라이브러리는 path·`stroke-linecap`이 달라 픽셀이 바뀌고, GitHub 마크는 없다. 속성 순서(`className` 먼저)도 쓰던 자리와 같아 DOM 스냅샷이 그대로다
4. **불리언이 곱해져 모드가 되면 이름을 붙인다**: `SearchDropdown`의 `compact`·`mobileHeader` → `variant: 'full' | 'compact' | 'mobileHeader'`, 모드별 클래스는 cva(`searchBoxVariants` 등)에
5. **큰 컴포넌트는 역할로 쪼갠다**: `MemberDetailClient` = 쿼리 + `<ProfileHeader>` + `<ProfileTabs>`(123 → 35줄). `ProfileHeader`는 `ProfileLinks`(한 링크 묶음을 모바일·데스크톱 자리에 두 번 렌더 — "렌더 함수를 두 번 호출"의 대체)·`CohortRolePill`로. `ProfileTabs`는 데이터 섹션 `BlogSection`을 밖으로 빼고 props 6 → 4. `Navbar` = `Logo`·`NavLink`·`MobileMenu`·`MenuToggle` + `useActiveNav`(178 → 77줄)
6. **effect로 상태를 되돌리지 않는다**: 낙관적 활성 링크는 `{ href, fromPath }`를 지금 경로와 비교해 계산(파생 상태), 모바일 메뉴는 `openedAt === pathname`. `useListNavigation`의 선택 초기화는 렌더 중 `resetKey` 비교. "잠깐 보이는 값"(복사됨 2초, 실패 문구 2.5초)은 `useTransientValue`가 타이머 정리까지 맡는다
7. **훅은 합성한다**: `useMemberSearch` = `useQuery` + `useSearchShortcut` + `useOutsideClick` + `useListNavigation`. 반환 모양은 그대로라 화면은 모른다
8. **폴더 이름은 역할을 따른다**: `widgets/profile-tabs` → `widgets/member-profile`(이동만 따로 PR #112 — 구조 이동과 코드 수정을 한 PR에 섞지 않는다)

## 결과

- 역할 배지 복사 4 → 0(`RoleBadges`), 트랙 라벨 리터럴 3 → 1, `isStaff` 2 → 1, 인라인 SVG 8 → 0, 페이드인·`container-max` 인라인 각 3 → 0
- 줄 수: Navbar 178 → 77, MemberDetailClient 123 → 35, ProfileTabs 122 → 57, SearchDropdown 134 → 105, useMemberSearch 97 → 58
- 화면은 그대로다: 스크린샷 38장 0픽셀, PR 1에서 찍어 둔 DOM 스냅샷(FeedRow·MemberDetailClient·Navbar 열림/닫힘)이 분해 전후 **그대로** 통과

## 알려진 한계

- 클라이언트 요청 실패(피드·기수·블로그 탭·검색)는 여전히 "없습니다" 빈 상태로 보인다. `isError`를 읽는 곳이 없다. 문구가 바뀌는 UX 변경이라 이 라운드에서 제외했다
- 화면 문구는 통일하지 않았다("불러오는 중..." 3종, "등록된 블로그 글이 없습니다" 4곳). 컴포넌트는 합쳤지만 문구는 그 자리 그대로다
