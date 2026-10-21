# src/shared/ui

## 역할

도메인과 무관한 공용 UI. 여러 화면에서 **같은 의미로 반복되는 UI**만 여기에 둔다.

| 컴포넌트·클래스                                                                                                  | 용도                                                                                                |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `PageContainer` (`spacing`: page·detail·plain)                                                                   | 페이지 본문 폭(`--container-max`)과 여백                                                            |
| `TabBar` + `tabVariants({ active })`                                                                             | 가로 스크롤 밑줄 탭 (기수 탭)                                                                       |
| `SegmentedControl` + `segmentVariants({ active, shape })`                                                        | 둘 중 하나 선택 (크루/운영진, 최근 30일/전체, flush: 미션 탭)                                       |
| `FilterRow` + `filterChipVariants({ active })`                                                                   | 목록 필터 줄과 선택 칩 (트랙 필터)                                                                  |
| `linkVariants` (`variant`: text·title·muted·accent·mono·toc·chip·card·row·avatar, `size`, `weight`, `stretched`) | a·Link의 모양. 배치는 호출부 `cn()`에. 토큰 린트가 a·Link의 리터럴 모양 클래스를 막는다             |
| `Badge` (`tone`: accent·neutral), `BADGE_BASE_CLASS`                                                             | 작은 정보 배지. 트랙 색 같은 도메인 색은 `entities/member/ui/trackBadgeVariants`가 바탕 위에 더한다 |
| `buttonVariants({ variant, size })`                                                                              | 버튼 모양 (outline·secondary·subtle·more·toolbar·plain). button·a·Link 어디에나                     |
| `chipButtonVariants({ disabled })`                                                                               | 상태 칩 모양 작은 버튼 (프로필 새로고침)                                                            |
| `pageTabVariants({ active, size, indicator })`                                                                   | 페이지 안 큰 밑줄 탭 (설정·프로필)                                                                  |
| `OptionGroup` + `optionVariants({ active, layout })`                                                             | 큰 선택지 묶음 (테마·디자인 선택)                                                                   |
| `listItemVariants({ active })`                                                                                   | 한 줄을 통째로 누르는 목록 버튼 (검색 결과)                                                         |
| `navLinkVariants({ placement, active })`                                                                         | 상단 이동 링크 (데스크톱 막대·모바일 메뉴)                                                          |
| `Divider`, `SectionLabel`                                                                                        | 구간 이름과 가로선                                                                                  |
| `Avatar`                                                                                                         | 프로필 이미지                                                                                       |
| `EmptyState` (`frame`: card·plain, `size`: tall·box)                                                             | 목록이 비었을 때의 안내 상자. 레이아웃 위치만 `className`                                           |
| `ListCard` (`stack`)                                                                                             | 행들을 담는 둥근 카드 (피드 목록, 모바일 멤버 목록)                                                 |
| `navMenuRowVariants({ active })`                                                                                 | 모바일 메뉴에서 링크 옆에 다른 요소(테마 토글)를 함께 놓는 한 줄                                    |
| `icons/`                                                                                                         | 화면에 인라인으로 그리던 SVG 원문. 라이브러리로 바꾸면 path가 달라 픽셀이 바뀐다                    |
| `CONTAINER_MAX_STYLE`                                                                                            | 본문 폭(`--container-max`). 헤더·패치 띠도 같은 값                                                  |

## 규칙

- variant는 `class-variance-authority`(cva)로 정의한다. 탭·칩처럼 button·Link 양쪽에 쓰는 것은 클래스 함수(`*Variants`)로 제공한다
- 도메인 타입·API를 import하지 않는다 (`@/entities/*`, `@/features/*` 금지 — 의존 규칙 검사가 경고)
- 글자 크기는 `globals.css` `@theme`의 스케일(`text-caption`, `text-body` 등), 색은 의미 토큰(`text-danger`, `text-track-frontend` 등)만 쓴다. 이 폴더 밖에서 임의 px·원시 팔레트 색을 쓰면 `pnpm lint:tokens`가 실패한다
- 배치용 조합(`flex items-center gap-2` 등)은 묶지 않는다. 같은 의미의 UI가 두 화면 이상에서 반복될 때 추가한다
- 단, 누르는 요소(버튼·탭·칩·링크 버튼)의 모양은 한 곳에서만 쓰여도 여기 둔다. 화면의 모든 버튼 모양을 이 폴더에서 한눈에 보고 바꾸기 위해서다. 이 폴더 밖 `<button>`에 className을 문자열·템플릿으로 직접 쓰면 `pnpm lint:tokens`가 실패한다
- 화면에서 쓰던 클래스를 옮길 때는 클래스 집합이 그대로인지 `variants.test.ts`에 고정한다 (화면 변화 0). 레이아웃 위치 클래스(`col-span-full`, `sm:hidden`)는 `className`으로 받아 **앞에** 둔다 — 쓰던 자리의 DOM 문자열이 그대로다
- 같은 의미의 비(非)누름 요소(빈 상태, 카드)도 두 화면 이상에서 반복되면 여기 둔다. props는 CSS가 아니라 의미(`frame`, `size`, `stack`)를 말한다 (ADR 0008)
- 기수 화면의 탭·세그먼트·칩은 기존처럼 `transition-colors`를 덧붙여 쓴다 (`cn(tabVariants(...), 'transition-colors')`). 피드 화면과 다른 이 차이는 디자인 결정으로 남겨 두었다
