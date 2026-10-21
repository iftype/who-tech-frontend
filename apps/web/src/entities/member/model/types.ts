export type Role = 'crew' | 'coach' | 'reviewer';
export type Track = 'frontend' | 'backend' | 'android';
type TabCategory = 'base' | 'common' | 'excluded' | 'precourse';
/** 기수 목록의 구분: 크루 / 운영진(코치·리뷰어) */
export type RoleGroup = 'crew' | 'staff';

interface MemberCohort {
  cohort: number;
  roles: Role[];
}

export interface Member {
  githubId: string;
  nickname: string;
  avatarUrl: string | null;
  isTeamBlog?: boolean;
  cohort: number | null; // Primary cohort for listing
  roles: Role[]; // Latest roles
  cohorts?: MemberCohort[];
  tracks: Track[];
  blog?: string | null;
  lastPostedAt?: string | null;
}

export type MemberSearchPage = {
  members: Member[];
  totalCount: number;
  counts: { crew: number; staff: number };
  nextOffset: number | null;
};

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

interface ArchiveLevel {
  level: number | null;
  repos: ArchiveRepo[];
}

export interface CohortArchive {
  cohort: number;
  levels: ArchiveLevel[];
}

export interface TecoTalk {
  id: number;
  videoId: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  uploadedAt: string;
  cohort: number | null;
}

export interface MemberDetail extends Omit<Member, 'cohort' | 'roles'> {
  cohorts: MemberCohort[];
  blog: string | null;
  lastPostedAt: string | null;
  archive: CohortArchive[];
  tecoTalks?: TecoTalk[];
}
