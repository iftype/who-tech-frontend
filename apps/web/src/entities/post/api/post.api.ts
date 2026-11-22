import type { Track } from '@/entities/member';
import { requestJson, serverCache, withQuery } from '@/shared/api';
import { decodeHtml } from '@/shared/lib/utils';
import type { BlogPostDetail, FeedItem, FeedResponse } from '../model/types';

// 필터 값은 "없음"이 undefined로 넘어온다 (exactOptionalPropertyTypes라 | undefined를 적는다)
interface FeedParams {
  cohort?: number | undefined;
  track?: Track | undefined;
  days?: number | undefined;
  cursor?: string | undefined;
  limit?: number | undefined;
}

// 서버 데이터 캐시 시간 (서버 prefetch 경로만 해당)
const CACHE_SECONDS = 300;

// 블로그 글 제목은 RSS 원문 그대로라 HTML 엔티티(&amp; 등)를 풀어서 넘긴다
function normalizeFeedItem(item: FeedItem): FeedItem {
  return { ...item, title: decodeHtml(item.title) };
}

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
