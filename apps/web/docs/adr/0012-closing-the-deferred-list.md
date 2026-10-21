# 0012 "하지 않은 것" 목록 닫기: 부분 실패·문구·트랙 센티널·타입 엄격화·knip·피드 활성

- 상태: 적용 (2026-10-22, #130 · #131 · #132 · #134)

## 배경

ADR 0006·0008·0009·0011이 "하지 않은 것"으로 남긴 항목을 사용자 위임("하지 않은 것들 싹 다 처리해")으로 한 번에 판정했다. 판정 기준: **얻는 것이 있으면 한다, 픽셀만 바뀌거나 구조만 뒤집는 것은 안 한다**.

## 결정

1. **다음 페이지만 실패해도 보여 준다** (#130): `useFeedPosts`가 `isFetchNextPageError`·`fetchNextPage`를 내고, 받은 글은 그대로 둔 채 그 아래 `role=alert` "다음 글을 불러오지 못했습니다 · 다시 시도". 첫 페이지 실패는 ADR 0011의 `ErrorState` 그대로
2. **문구는 상수 하나** (#130): `LOADING_TEXT`(shared/ui) · `NO_POSTS_TEXT`(entities/post). 로딩 3종이 1종으로, 빈 글 문구 4곳이 상수 하나로. 스크린샷에 있는 문구는 바이트 동일
3. **트랙 센티널은 `null` 하나** (#134): 기수 화면의 `Track | 'all'`을 피드와 같은 `Track | null`로. `parseTrackOrAll` 삭제, `parseTrack`이 `'all'`·모르는 값을 null로 읽는다. **URL 계약은 그대로** — 예전 링크 `?track=all`은 전체로 읽고(테스트), 전체는 쿼리에 쓰지 않는다
4. **`exactOptionalPropertyTypes`** (#131): 오류가 4건뿐이었다. "없음"이 undefined로 넘어오는 API 파라미터에 `| undefined`, 테스트 픽스처는 "이 필드가 없는 응답"을 흉내내는 `MemberOverrides`
5. **knip이 게이트** (#131): `lint = eslint . && knip`. 첫 실행이 찾은 바깥에서 안 쓰는 export 12개(배럴 재export·타입·테스트 헬퍼)를 같은 PR에서 정리. CSS에서만 쓰는 `tailwindcss`와 루트 워크스페이스가 주는 바이너리는 ignore. 라운드 3에서 "손으로 정리"를 택했던 결정을 뒤집는다 — 손 정리는 한 번이고 도구는 매 PR이다
6. **Stryker 대상 확대** (#131): 파서·URL Location·도메인 규칙 모듈(전부 단위 테스트 있음). 주간 `mutation.yml`에서 돈다
7. **홈에서 피드 메뉴 활성** (#132): `isNavActive(href, activeHref)` — `/feed`는 `/`로 리다이렉트되므로 홈에서도 활성. **화면이 바뀌는 유일한 항목**: 홈 데스크톱 2장(light·dark)의 기준 이미지를 CI `update_snapshots`로 생성해 같은 PR에 커밋. 모바일은 헤더 링크가 메뉴 안이라 변화 없음

## 안 한 것 (이유)

- 아이콘 라이브러리 교체: 픽셀만 바뀌고 얻는 게 없다(GitHub 마크도 없다)
- `useFeedFilters` 반환 평탄화: 소비처가 필터를 덩어리로 받는다
- `FeedAuthor` 타입 분리: 정규화(ADR 0011) 뒤에는 `Member`와 같은 모양

## 결과

- 테스트 61 → 62 files, 252 → 255 cases, 래칫 93/93. knip 0건, 스크린샷 38장 중 2장만 의도한 변화
