# 0001 계층 구조 (app → widgets → features → entities → shared)

- 상태: 적용 (2026-10-19, #86 · #87 · #88)

## 배경

처음에는 `components/`, `lib/`, `hooks/`, `types/index.ts` 같은 종류별 폴더였다. 화면이 늘자 문제가 생겼다.

- `components/ui/`에 범용 부품과 도메인 배지(기수·트랙)가 섞였다
- 레이아웃이 기능 컴포넌트를 거꾸로 import했다
- 기수 목록 화면(CohortExplorer)이 342줄에 훅 14개로, URL 상태·데이터·화면이 한 파일에 있었다
- 쿼리 키 문자열이 6곳에 흩어져 서버가 미리 받은 데이터와 클라이언트 쿼리가 어긋날 위험이 있었다

어디에 무엇을 둘지 규칙이 없으니 바꿀 때마다 영향 범위를 찾아야 했다.

## 결정

Feature-Sliced Design을 단순화한 5개 층을 쓴다. 위층만 아래층을 import한다.

| 층         | 두는 것                           | 예                                  |
| ---------- | --------------------------------- | ----------------------------------- |
| `app`      | 라우트. 데이터 미리 받기와 조립   | `app/cohort/[number]/page.tsx`      |
| `widgets`  | 여러 기능을 묶은 화면 블록        | `cohort-explorer`, `layout`(Navbar) |
| `features` | 사용자 행동 하나                  | `member-search`, `cohort-filter`    |
| `entities` | 도메인 타입·API·쿼리 키·도메인 UI | `member`, `post`                    |
| `shared`   | 도메인을 모르는 것                | `api`, `ui`, `lib`                  |

- 같은 층끼리 import 금지. 엔티티끼리는 공개 진입점(`index.ts`)만 허용 (피드 글이 작성자 `Member` 타입을 쓰는 경우)
- dependency-cruiser가 CI에서 막는다. 처음엔 경고로 켜고 위반을 0으로 만든 뒤 실패로 바꿨다

## 결과

- 의존 규칙 위반 0, 가장 큰 컴포넌트 342 → 199줄 (CohortExplorer는 URL 상태·데이터 훅·스켈레톤으로 나눠 121줄)
- 쿼리 키는 `memberKeys`·`postKeys`만 쓴다
- 옮기는 동안 스크린샷 38장이 0픽셀 차이였고, 운영에서 기수 탭·필터·뒤로 가기·⌘K 검색이 배포 전과 같았다

## 버린 대안

- **FSD 전체(pages·processes 층, 세그먼트 규칙 전부)**: 화면 수에 비해 층이 많다. Next.js `app/`이 pages 역할을 하므로 5개로 충분하다
- **기능별 폴더만(`features/*`)**: 기능끼리 공유하는 도메인 코드(멤버 타입·배지)를 둘 곳이 애매해져 결국 기능 간 import가 생긴다
