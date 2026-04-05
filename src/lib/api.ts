import type { Member, MemberDetail, FeedItem, CohortArchive, ArchiveStep, TabCategory } from '@/types';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://iftype.store';
// 브라우저에서는 CORS 우회를 위해 Next.js rewrite 프록시 사용
const BASE_URL = typeof window === 'undefined' ? SERVER_URL : '/api';

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

// 구버전(submission 단수) / 신버전(submissions 배열) 모두 대응
type RawRepo = {
  name: string;
  track: string | null;
  tabCategory?: TabCategory;
  submission?: ArchiveStep | null;
  submissions?: ArchiveStep[] | null;
};
type RawDetail = Omit<MemberDetail, 'archive'> & {
  archive?: Array<{ cohort: number; levels: Array<{ level: number | null; repos: RawRepo[] }> }>;
};

function normalizeDetail(raw: RawDetail): MemberDetail {
  const archive: CohortArchive[] = (raw.archive ?? []).map((cohortArchive) => ({
    cohort: cohortArchive.cohort,
    levels: cohortArchive.levels.map((lvl) => ({
      level: lvl.level,
      repos: lvl.repos.map((r) => ({
        name: r.name,
        track: r.track,
        tabCategory: (r.tabCategory ?? 'base') as TabCategory,
        submissions: r.submissions !== undefined ? r.submissions : r.submission != null ? [r.submission] : null,
      })),
    })),
  }));
  return { ...raw, archive } as MemberDetail;
}

export const api = {
  members: {
    search: (params: { q?: string; cohort?: number; track?: string; role?: string }, init?: RequestInit) => {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)]),
        ),
      ).toString();
      return fetchApi<Member[]>(`/members${qs ? `?${qs}` : ''}`, init);
    },
    detail: async (githubId: string) => {
      const raw = await fetchApi<RawDetail>(`/members/${githubId}`, { next: { revalidate: 300 } }); //dev
      return normalizeDetail(raw);
    },
    feed: (params: { cohort?: number; track?: string; days?: number } = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)]),
        ),
      ).toString();
      return fetchApi<FeedItem[]>(`/members/feed${qs ? `?${qs}` : ''}`, { next: { revalidate: 300 } });
    },
  },
};
