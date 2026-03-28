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

export interface MissionRepo {
  name: string;
  track: Track | null;
  level: number | null;
  tabCategory: TabCategory;
}

export interface Submission {
  prUrl: string;
  prNumber: number;
  title: string;
  submittedAt: string;
  missionRepo: MissionRepo;
}

export interface BlogPost {
  url: string;
  title: string;
  publishedAt: string;
}

export interface MemberDetail extends Member {
  blog: string | null;
  lastPostedAt: string | null;
  submissions: Submission[];
  blogPosts: BlogPost[];
}

export interface FeedItem {
  url: string;
  title: string;
  publishedAt: string;
  member: Member;
}
