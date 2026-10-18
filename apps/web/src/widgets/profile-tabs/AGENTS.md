# features/profile

## 역할

크루원 상세 페이지의 탭 UI. 미션 아카이브와 블로그 글을 탭/사이드바로 구성.

## 컴포넌트 구조

```
ProfileTabs (컨테이너)
  ├── MissionArchive     — 미션 제출 현황 테이블
  └── BlogSection        — 블로그 글 (Latest + Archive 서브탭)
```

## 상태 관리

- `tab`: 'mission' | 'blog' — 메인 탭 (모바일 전용)
- `blogSubTab`: 'latest' | 'archive' — 블로그 내 서브탭

## 데이터 흐름

- `blogPosts`는 `BlogPostDetail` 타입: `{ latest, archive, page, totalPages }`
- Latest: 7일 이내 글
- Archive: 페이지네이션 (10개×10페이지)
- 페이지 변경 시 `onBlogPageChange(page)` 콜백 호출 → 상위에서 API 재요청

## API

- `GET /members/:githubId?blogPage=:page` — 상세 정보 + 블로그 페이지네이션

## 경계

- ✅ ProfileTabs는 순수 presentational (상위에서 blogPage 상태 관리)
- ✅ 페이지네이션 버튼은 10페이지까지만 표시
- ❌ ProfileTabs 낶部에서 직접 API 호출 금지
