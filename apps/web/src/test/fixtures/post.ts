import type { BlogPost, FeedItem } from '@/entities/post';
import { makeMember, type MemberOverrides } from './member';

export const NOW = new Date('2026-10-18T12:00:00Z');
export const daysAgo = (n: number): string => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

export function makeFeedItem(id: number, member: MemberOverrides = {}, overrides: Partial<FeedItem> = {}): FeedItem {
  return {
    id,
    url: `https://velog.io/@crew/${id}`,
    title: `글 ${id}`,
    publishedAt: daysAgo(1),
    member: makeMember(`crew${id}`, { nickname: `크루${id}`, ...member }),
    ...overrides,
  };
}

export function makeBlogPost(n: number, overrides: Partial<BlogPost> = {}): BlogPost {
  return { url: `https://crew.tistory.com/${n}`, title: `블로그 글 ${n}`, publishedAt: daysAgo(n), ...overrides };
}
