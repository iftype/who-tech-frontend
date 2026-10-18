# src/shared/ui

## 역할

도메인과 무관한 공용 UI. 여러 화면에서 **같은 의미로 반복되는 UI**만 여기에 둔다.

| 컴포넌트·클래스                                           | 용도                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------- |
| `PageContainer` (`spacing`: page·detail·plain)            | 페이지 본문 폭(`--container-max`)과 여백                                  |
| `TabBar` + `tabVariants({ active })`                      | 가로 스크롤 밑줄 탭 (기수 탭)                                             |
| `SegmentedControl` + `segmentVariants({ active })`        | 둘 중 하나 선택 (크루/운영진, 최근 30일/전체)                             |
| `FilterRow` + `filterChipVariants({ active })`            | 목록 필터 줄과 선택 칩 (트랙 필터)                                        |
| `Badge` (`tone`: accent·neutral·frontend·backend·android) | 작은 정보 배지. 도메인 배지는 `entities/member/ui`에서 tone을 정해 감싼다 |
| `buttonVariants({ variant, size })`                       | 버튼 모양 클래스. button·a·Link 어디에나                                  |
| `Divider`, `SectionLabel`                                 | 구간 이름과 가로선                                                        |
| `Avatar`                                                  | 프로필 이미지                                                             |

## 규칙

- variant는 `class-variance-authority`(cva)로 정의한다. 탭·칩처럼 button·Link 양쪽에 쓰는 것은 클래스 함수(`*Variants`)로 제공한다
- 도메인 타입·API를 import하지 않는다 (`@/entities/*`, `@/features/*` 금지 — 의존 규칙 검사가 경고)
- 글자 크기는 `globals.css` `@theme`의 스케일(`text-caption`, `text-body` 등), 색은 의미 토큰(`text-danger`, `text-track-frontend` 등)만 쓴다. 이 폴더 밖에서 임의 px·원시 팔레트 색을 쓰면 `pnpm lint:tokens`가 실패한다
- 배치용 조합(`flex items-center gap-2` 등)은 묶지 않는다. 같은 의미의 UI가 두 화면 이상에서 반복될 때만 추가한다
- 기수 화면의 탭·세그먼트·칩은 기존처럼 `transition-colors`를 덧붙여 쓴다 (`cn(tabVariants(...), 'transition-colors')`). 피드 화면과 다른 이 차이는 디자인 결정으로 남겨 두었다
