export type Role = 'crew' | 'coach' | 'reviewer';
export type Track = 'frontend' | 'backend' | 'android';
export type TabCategory = 'base' | 'common' | 'excluded' | 'precourse';
export type RssStatus = 'unknown' | 'available' | 'unavailable' | 'error';

export interface Member {
  githubId: string;
  nickname: string;
  avatarUrl: string | null;
  cohort: number | null;
  roles: Role[];
  tracks: Track[];
}

export interface ArchiveStep {
  prUrl: string;
  prNumber: number;
  title: string;
  submittedAt: string;
}

export interface ArchiveRepo {
  name: string;
  track: string | null;
  tabCategory: TabCategory;
  submissions: ArchiveStep[] | null;
}

export interface ArchiveLevel {
  level: number | null;
  repos: ArchiveRepo[];
}

export interface BlogPost {
  url: string;
  title: string;
  publishedAt: string;
}

export interface MemberDetail extends Member {
  blog: string | null;
  lastPostedAt: string | null;
  archive: ArchiveLevel[];
  blogPosts: BlogPost[];
}

export interface FeedItem {
  url: string;
  title: string;
  publishedAt: string;
  member: Member;
}
