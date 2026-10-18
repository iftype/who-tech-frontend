import { decodeHtml } from '@/lib/utils';
import { requestJson, withQuery } from '@/shared/api';
import type { BlogPostDetail, FeedResponse } from '../model/types';

export interface FeedParams {
  cohort?: number;
  track?: string;
  days?: number;
  cursor?: string;
  limit?: number;
}

// 블로그 글 제목은 RSS 원문 그대로라 HTML 엔티티(&amp; 등)를 풀어서 넘긴다
export const postApi = {
  feed: async (params: FeedParams = {}) => {
    const res = await requestJson<FeedResponse>(withQuery('/members/feed', { ...params }), {
      next: { revalidate: 300 },
    });
    return {
      posts: res.posts.map((item) => ({ ...item, title: decodeHtml(item.title) })),
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
