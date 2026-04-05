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

## Next task

- 기수 목록 탭 전환 속도 개선
- 목표: 탭 클릭 시 서버 재요청 체감을 줄이고 즉시 반응하는 전환 구조로 개선

## Commands

```bash
npm run dev
npm run build
npm run start
```
