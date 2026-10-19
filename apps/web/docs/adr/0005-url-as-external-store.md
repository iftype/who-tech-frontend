# 0005 URL은 외부 저장소 (useSyncExternalStore)

- 상태: 적용 (2026-10-20, #98)

## 배경

URL과 화면 상태를 맞추는 코드가 화면마다 달랐다.

- 기수 탐색: `useState` 3개에 URL을 복사하고 popstate 리스너로 다시 복사
- 피드: props → state 복사 효과 + 필터 → URL 쓰기 효과 + popstate 리스너(상태가 세 곳)
- 설정: 마운트 뒤 effect로 `?tab=`을 읽어 테마 탭이 먼저 보였다가 바뀜
- 미션 아카이브: `setState` 갱신 함수 안에서 `replaceState` (갱신 함수는 순수해야 하고 StrictMode에서 두 번 불린다)
- Navbar: 피드를 초기화하려고 가짜 `PopStateEvent`를 쏨 (위젯 사이의 숨은 이벤트 버스)

## 결정

`shared/lib/urlStore.ts`

- URL(pathname+search)을 React 바깥의 저장소로 보고 `useSyncExternalStore`로 구독한다
- `push`/`replace`는 History API 호출 뒤 구독자에게 알린다(`replaceState`는 popstate를 일으키지 않는다). 뒤로가기(popstate)도 같은 구독
- 서버 렌더·하이드레이션 스냅샷은 페이지가 받은 값으로 만든 URL → 불일치가 없다. 클라이언트 마운트(뒤로가기로 재마운트 등)는 실제 URL
- 다른 페이지로 떠나는 중의 URL은 무시(`owns(pathname)`)해 떠나는 화면이 엉뚱한 상태로 다시 그려지지 않는다
- 화면 훅(`useCohortUrlState`, `useFeedFilters`, 설정 탭)은 URL에서 상태를 **계산만** 한다. 쿼리가 없으면 기본값

## 결과

- 상태 복사·동기화 효과 0, 가짜 popstate 0, 설정 탭 깜빡임 0
- 기존 피드·기수 URL 테스트(즉시 반영, push로 히스토리 +1, popstate 복원, 마운트 시 실제 URL 우선)가 수정 없이 통과
- 같은 패턴을 프로필 새로고침 카운트다운(localStorage)에도 썼다(`useRateLimitCountdown`, 서버 스냅샷 0초)

## 버린 대안

- **`useSearchParams` + `router.replace`**: 읽기 전용이고 pathname이 없으며, `router.replace`는 서버 컴포넌트를 다시 요청한다(필터마다 RSC 왕복)
- **상태 관리 라이브러리(zustand)**: URL이 이미 진짜 원천이라 저장소를 하나 더 두면 동기화 문제가 다시 생긴다. 설치만 돼 있던 zustand는 지웠다
