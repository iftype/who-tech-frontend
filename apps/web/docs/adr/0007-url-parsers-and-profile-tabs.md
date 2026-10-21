# 0007 URL 값은 파서로만 읽고, 탭 상태의 주인은 URL 하나

- 상태: 적용 (2026-10-21, #109 · #110)

## 배경

ADR 0005로 피드·기수·설정은 URL을 외부 저장소로 읽게 됐지만, 두 가지가 남았다.

- 프로필 탭(`ProfileTabs`)과 미션 하위 탭(`MissionArchive`)은 아직 `useState(initial*)`로 복사를 들고 `urlStore.replaceParam`만 호출했다. 상태가 두 곳(URL·state)이라 history 조작으로 URL이 바뀌어도 화면이 따라오지 않았다
- URL·쿠키 값 5종이 리터럴 비교로 흩어져 있었다: 피드 `?cohort=`(검증 없이 문자열 그대로), `/cohort/[number]`(`Number()`라 `abc`가 `NaN`으로 API까지 감), 프로필 `tab`·`missionTab`(리터럴 3곳), 설정 `tab`(지역 함수), 테마·디자인 쿠키(`layout.tsx`에 지역 타입 가드, `ThemeProvider`·`ThemeTab`에 같은 목록이 또)
- `SettingsClient`는 `replaceParam`과 같은 로직을 `push`용으로 손으로 다시 짰다

## 결정

1. **값마다 파서 하나, 그 값을 아는 층에**: `parseCohortNumber`(entities, 양의 정수 문자열만), `parseMissionTab`(features/mission-archive), `parseProfileTab`·`PROFILE_TABS`(widgets/member-profile), `parseSettingsTab`·`SETTINGS_TABS`(app/settings), `parseTheme`·`parseDesign`(`shared/providers/theme.ts` — `THEMES`·`DESIGN_SYSTEMS` 단일 정의를 서버 `layout.tsx`와 클라이언트가 함께 쓴다). 모르는 값은 기본값
2. **프로필 탭도 URL에서 계산**: `useProfileTabs({ detailId, initialTab, initialMissionTab })`가 `useUrl(serverUrl, p => p === '/' + detailId)`로 `?tab=`·`?missionTab=`을 읽고 `replaceParam`으로 쓴다. `useCohortUrlState`와 같은 모양(객체 인자·평평한 반환). `MissionArchive`는 controlled(`tab`·`onTabChange`)가 되어 URL을 모른다 — 피처는 자기 상태의 출처를 모르는 편이 재사용하기 쉽다
3. **`urlStore.pushParam`**: `replaceParam`과 `withParam`을 공유. 뒤로가기로 돌아올 탭(설정)은 push, 보기 전환(프로필)은 replace
4. **쓰레기 URL은 없는 값으로** (라운드 3 🔒 결정): `/cohort/abc` → 404, 피드 `?cohort=abc` → 기수 없음. 정상 URL은 화면·요청이 그대로다
5. **멤버 상세의 실패 구분** (🔒 결정): `ApiError` 404만 `notFound()`, 그 밖(백엔드 장애)은 던져 `error.tsx`의 "다시 시도"를 보여 준다. 예전엔 모든 실패가 404 페이지였다
6. **명시적 기본값 쓰기는 유지**: 탭을 되돌릴 때 `?tab=mission`을 지우지 않고 쓴다. URL 출력도 동작이다

## 결과

- `useState` 탭 복사 2 → 0, 파서 없는 searchParams 5종 → 0, `/cohort`·`/cohort/[number]` page.tsx는 공유 `CohortExplorerPage`를 부르는 8줄
- 서버 스냅샷 URL을 페이지가 파싱한 값으로 만들어 SSR HTML 동일. `replace`는 history 항목을 만들지 않으므로 눈에 보이는 뒤로가기 동작도 같다
- 고정 테스트: 파서 5종, `pushParam`(history +1), 프로필 탭 popstate 추종·다른 경로 무시, `/cohort/abc` 404, 상세 503은 던짐·404만 404
