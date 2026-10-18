# API_CLIENT.md — API 클라이언트

## 구조

```
src/shared/api/http.ts        공통 요청: requestJson·send, withQuery(빈 파라미터 제외), ApiError·RateLimitError(429)
src/entities/member/          멤버 타입, memberApi(search·searchPage·cohorts·detail·refresh), memberKeys(쿼리 키)
src/entities/post/            블로그 글 타입, postApi(feed·byMember, 제목 HTML 엔티티 디코드), postKeys(쿼리 키)
```

- 서버 환경: `NEXT_PUBLIC_API_URL` 직접 호출
- 브라우저 환경: `/api` 프록시 경로 사용 (CORS 우회, `next.config.ts`의 rewrite로 백엔드로 전달)
- 쿼리 키는 `memberKeys`·`postKeys`로만 만든다. 서버 렌더 `initialData`·prefetch와 맞물리므로 문자열로 직접 쓰지 않는다
- 새로고침 429는 `RateLimitError`(`remainingSeconds`)로 던진다

## 환경변수 (.env.local)

```
NEXT_PUBLIC_API_URL=https://iftype.site
```

## 백엔드 공개 API

```
GET /members                  — 멤버 검색 (?q=&cohort=&track=&role=)
GET /members/feed             — 최근 블로그 피드 (?cohort=&track=)
                                → [{url, title, publishedAt, member: {githubId, nickname, avatarUrl, cohort, roles, tracks}}]
GET /members/:githubId        — 멤버 상세 (archive, blogPosts 포함)
```

- `archive` 응답: `ArchiveLevel[] → { level, repos: ArchiveRepo[] }` → `{ name, track, tabCategory, submissions: ArchiveStep[] | null }`
- `blogPosts` 응답: BlogPostLatest 최근 10개
