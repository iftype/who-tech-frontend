# who.tech frontend

우아한테크코스 크루 검색 서비스 프론트엔드입니다. Next.js 15 App Router 기반이며, 크루 목록, 상세 페이지, 블로그 피드, 미션 아카이브를 제공합니다.

## Current UI updates

- 모바일 상단 메뉴에서 `기수 목록`, `피드`, `가이드` 이동 시 낙관적 라우팅 적용
- 상단 탭과 테마 토글에 `cursor-pointer` 적용
- 테마 전환 시 버튼/테두리까지 같은 타이밍에 바뀌도록 `ThemeProvider`와 `color-scheme` 동기화
- 테마 전환 순간에는 전역 transition을 잠깐 끊어 카드/리스트/버튼 색상이 동시에 바뀌도록 조정
- 홈을 제외한 페이지에서는 헤더 검색바를 제공하고, 데스크톱에서는 목록 왼쪽에 배치하며 모바일에서는 헤더 안 compact 검색을 사용
- 기수 목록 모바일 리스트에서 블로그 등록 멤버에 `블로그` 배지 표시
- 기수 목록 PC 카드에서는 `crew` 역할 배지 제거
- 검색 드롭다운에서도 `crew` 역할 배지 제거
- 기수 목록에서는 현재 역할군에 존재하는 트랙만 필터에 표시하고, 트랙이 없는 멤버는 트랙 배지를 숨김
- 피드 헤더 문구는 선택한 기수에 따라 `N기 크루의 최신 블로그 글`로 변경
- 미션 아카이브에서 레포 이름 링크, PR 제목 링크, `Markdown 복사` 버튼/탭 포인터 적용
- 미션 아카이브 탭을 `미션 / 확인전 / 프리코스`로 정리하고, 공통 레포를 `미션` 탭에 합침
- 모바일 기수 탭 스크롤의 상하 흔들림 완화
- 기수 목록 탭은 클라이언트 상태 전환 + URL 동기화로 즉시 전환되도록 개선

## Cohort tab optimization

- `/cohort`, `/cohort/[number]` 모두 초기 진입 시 전체 멤버 목록을 1회 로드
- 페이지는 `revalidate: 300`으로 캐시되어 매 요청마다 `force-dynamic` 렌더를 강제하지 않음
- 탭 클릭 시 서버 라우팅 대신 클라이언트에서 멤버를 필터링
- 클라이언트에서는 `startTransition` + `useDeferredValue`로 기수 전환 렌더 부하를 완화
- URL은 `history.pushState()`로 `/cohort` 또는 `/cohort/:number` 형태를 유지
- 브라우저 뒤로가기/앞으로가기는 `popstate`로 동기화
- 클라이언트에서는 TanStack Query `['members', 'cohort-explorer']` 캐시를 사용
- 서버 fetch는 `revalidate: 300`으로 5분 재검증

## Commands

```bash
npm run dev
npm run build
npm run start
```
