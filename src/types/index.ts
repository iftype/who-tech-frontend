export type Role = 'crew' | 'coach' | 'reviewer';
export type Track = 'frontend' | 'backend' | 'android';
export type TabCategory = 'base' | 'common' | 'excluded' | 'precourse';

export interface MemberCohort {
  cohort: number;
  roles: Role[];
}

export interface Member {
  githubId: string;
  nickname: string;
  avatarUrl: string | null;
  cohort: number | null; // Primary cohort for listing
  roles: Role[]; // Latest roles
  cohorts?: MemberCohort[];
  tracks: Track[];
  blog?: string | null;
  lastPostedAt?: string | null;
}

export interface ArchiveStep {
  prUrl: string;
  prNumber: number;
  title: string;
  status: string;
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

export interface CohortArchive {
  cohort: number;
  levels: ArchiveLevel[];
}

export interface BlogPost {
  url: string;
  title: string;
  publishedAt: string;
}

export interface MemberDetail extends Omit<Member, 'cohort' | 'roles'> {
  cohorts: MemberCohort[];
  blog: string | null;
  lastPostedAt: string | null;
  archive: CohortArchive[];
  blogPosts: BlogPost[];
}

export interface FeedItem {
  url: string;
  title: string;
  publishedAt: string;
  member: Member;
}
