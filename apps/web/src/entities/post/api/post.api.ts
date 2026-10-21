import type { Track } from '@/entities/member';
import { requestJson, serverCache, withQuery } from '@/shared/api';
import { decodeHtml } from '@/shared/lib/utils';
import type { BlogPostDetail, FeedItem, FeedResponse } from '../model/types';

interface FeedParams {
  cohort?: number;
  track?: Track;
  days?: number;
  cursor?: string;
  limit?: number;
}

// 서버 데이터 캐시 시간 (서버 prefetch 경로만 해당)
const CACHE_SECONDS = 300;

// 팀 블로그 글의 작성자에는 roles·tracks가 없을 수 있다(서버 DTO). 여기서 빈 배열로 채워 화면은 `?? []` 없이 믿는다 —
// 런타임 검증 라이브러리 대신 경계에서의 정규화 (ADR 0006의 신뢰 경계와 같은 자리)
function normalizeFeedItem(item: FeedItem): FeedItem {
  return {
    ...item,
    title: decodeHtml(item.title),
    member: { ...item.member, roles: item.member.roles ?? [], tracks: item.member.tracks ?? [] },
  };
}

// 블로그 글 제목은 RSS 원문 그대로라 HTML 엔티티(&amp; 등)를 풀어서 넘긴다
export const postApi = {
  feed: async (params: FeedParams = {}) => {
    const res = await requestJson<FeedResponse>(withQuery('/members/feed', { ...params }), serverCache(CACHE_SECONDS));
    return {
      posts: res.posts.map(normalizeFeedItem),
      nextCursor: res.nextCursor,
      totalCount: res.totalCount,
    };
  },

  byMember: async (githubId: string) => {
    const res = await requestJson<BlogPostDetail>(`/members/${githubId}/blog-posts`);
    return {
      ...res,
      latest: res.latest.map((post) => ({ ...post, title: decodeHtml(post.title) })),
      archive: res.archive.map((post) => ({ ...post, title: decodeHtml(post.title) })),
    };
  },
};
