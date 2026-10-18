# src/lib

## 역할

API 클라이언트, 유틸 함수. React 의존성 없이 서버/클라이언트 모두에서 사용 가능.

## 경계

- ✅ `api.ts`: 백엔드 응답 정규화 유일 지점
- ✅ `utils.ts`: 순수 함수만 (사이드이펙트 없음)
- ❌ React import 금지
- ❌ feature 컴포넌트에서 직접 fetch 금지 — 반드시 `api.ts` 경유

## api.ts 규약

**BASE_URL 분기**:

- 서버 환경: `NEXT_PUBLIC_API_URL` 직접 호출
- 브라우저 환경: `/api` 프록시 (`next.config.ts` rewrite → 백엔드로 전달, CORS 우회)

**응답 정규화**:

- `normalizeDetail()`: `submission`(단수) / `submissions`(배열) 구버전/신버전 모두 처리
- `feed()`: `{ posts: FeedItem[], nextCursor: string | null }` 구조로 반환. cursor 기반 무한스크롤 지원
- `detail()`: `blogPage` 선택적 파라미터 지원. 블로그 아카이브 페이지네이션용
- 새 API 엔드포인트 추가 시 이 파일에 메서드 추가

## utils.ts 주요 함수

- `formatRelativeDate(date)`: 상대 시간 표시 ("3일 전")
- `getBlogSource(url)`: URL에서 플랫폼명 추출 (tistory, velog, github.io 등)
  — 새 플랫폼 추가 시 이 함수만 수정

## 주의

- `api.ts`의 BASE_URL 분기 로직을 다른 곳에서 복제하지 마세요
- `getBlogSource`가 `null`을 반환할 수 있음 — 호출부에서 null 처리 필요
