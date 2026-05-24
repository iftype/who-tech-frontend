# API_CLIENT.md — API 클라이언트

## 클라이언트 (`src/lib/api.ts`)

- 서버 환경: `NEXT_PUBLIC_API_URL` 직접 호출
- 브라우저 환경: `/api` 프록시 경로 사용 (CORS 우회, `next.config.ts`의 rewrite로 백엔드로 전달)
- `normalizeDetail()`: 구버전(`submission` 단수) / 신버전(`submissions` 배열) 응답 모두 처리

## 환경변수 (.env.local)

```
NEXT_PUBLIC_API_URL=https://iftype.store
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
