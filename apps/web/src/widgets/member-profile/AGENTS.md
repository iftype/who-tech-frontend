# widgets/member-profile

## 역할

크루원 상세 페이지 본문: 헤더(아바타·이름·기수별 역할·트랙·바로가기·테코톡)와 탭(미션 아카이브 / 블로그 글).

## 구조

```
widgets/member-profile/
  index.ts                 공개 진입점: ProfileHeader, ProfileTabs, parseProfileTab, ProfileTab
  ProfileHeader.tsx        상세 상단. RefreshButton(features/profile-refresh)을 품는다
  ProfileTabs.tsx          탭 머리 + 본문 (미션 아카이브 | 블로그 글)
  model/profileTab.ts      PROFILE_TABS, parseProfileTab (URL ?tab= 파서)
  model/useProfileTabs.ts  탭·미션 하위 탭을 URL에서 계산, replaceParam으로 쓴다
  ui/ProfileLinks.tsx      GitHub·블로그 바로가기 (모바일·데스크톱 자리에 한 번씩 렌더)
  ui/CohortRolePill.tsx    기수 하나 + 그 역할 배지들
  ui/BlogSection.tsx       블로그 글 탭: memberPostsQuery로 받아 목록·마지막 게시
사용하는 하위 층:
  features/mission-archive  MissionArchive(controlled: tab·onTabChange), parseMissionTab, MissionTab
  features/profile-refresh  RefreshButton
  entities/member           memberDetailQuery 결과(MemberDetail), visibleArchive, 배지
  entities/post             memberPostsQuery
```

## 데이터 흐름

- 멤버 상세는 `app/[githubId]/page.tsx`가 `memberDetailQuery`로 prefetch해 하이드레이션한다. `MemberDetailClient`가 `useQuery`로 읽어 `<ProfileHeader member detailId>`와 `<ProfileTabs member detailId …>`에 넘긴다
- `detailId`는 URL의 아이디(캐시 키), `member.githubId`는 현재 아이디(API 경로). 예전 아이디로 들어오면 둘이 다르다
- 블로그 글은 탭을 열 때 `BlogSection`이 `memberPostsQuery`로 받는다(staleTime 5분). 제목의 HTML 엔티티는 API 계층(`postApi.byMember`)이 이미 풀어 준다

## 경계

- ✅ 탭 상태의 주인은 URL이다. `useProfileTabs`가 `useUrl`로 읽고 `replaceParam`으로 쓴다 (`useState` 복사 없음, ADR 0007). 되돌릴 때도 `?tab=mission`을 명시적으로 쓴다
- ✅ `MissionArchive`는 탭을 props로 받는다 — 피처는 URL을 모른다
- ✅ 바깥에서는 `@/widgets/member-profile`(index)로만 import한다 (depcruise `widgets-via-index`)
- ❌ 이 위젯 안에서 `urlStore`를 직접 부르는 곳은 `useProfileTabs`뿐이다
