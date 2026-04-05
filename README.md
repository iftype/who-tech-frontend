# who.tech frontend

우아한테크코스 크루 검색 서비스 프론트엔드입니다. Next.js 15 App Router 기반이며, 크루 목록, 상세 페이지, 블로그 피드, 미션 아카이브를 제공합니다.

## Current UI updates

- 모바일 상단 메뉴에서 `기수 목록`, `피드`, `가이드` 이동 시 낙관적 라우팅 적용
- 상단 탭과 테마 토글에 `cursor-pointer` 적용
- 기수 목록 모바일 리스트에서 블로그 등록 멤버에 `블로그` 배지 표시
- 기수 목록 PC 카드에서는 `crew` 역할 배지 제거
- 검색 드롭다운에서도 `crew` 역할 배지 제거
- 미션 아카이브에서 레포 이름 링크, PR 제목 링크, `Markdown 복사` 버튼/탭 포인터 적용
- 모바일 기수 탭 스크롤의 상하 흔들림 완화
- 기수 목록 탭은 클라이언트 상태 전환 + URL 동기화로 즉시 전환되도록 개선

## Cohort tab optimization

- `/cohort`, `/cohort/[number]` 모두 초기 진입 시 전체 멤버 목록을 1회 로드
- 탭 클릭 시 서버 라우팅 대신 클라이언트에서 멤버를 필터링
- URL은 `history.pushState()`로 `/cohort` 또는 `/cohort/:number` 형태를 유지
- 브라우저 뒤로가기/앞으로가기는 `popstate`로 동기화

## Commands

```bash
npm run dev
npm run build
npm run start
```
