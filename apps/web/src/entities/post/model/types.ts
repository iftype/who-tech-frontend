import type { Member } from '@/entities/member';

export interface BlogPost {
  url: string;
  title: string;
  authorName?: string | null;
  publishedAt: string;
}

export interface BlogPostDetail {
  latest: BlogPost[];
  archive: BlogPost[];
  page: number;
  totalPages: number;
}

export interface FeedItem {
  id: number;
  url: string;
  title: string;
  publishedAt: string;
  member: Member;
}

export interface FeedResponse {
  posts: FeedItem[];
  nextCursor: string | null;
  totalCount?: number;
}
