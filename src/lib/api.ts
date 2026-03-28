import type { Member, MemberDetail, FeedItem } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://iftype.store';

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  members: {
    search: (params: { q?: string; cohort?: number; track?: string; role?: string }) => {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)]),
        ),
      ).toString();
      return fetchApi<Member[]>(`/members${qs ? `?${qs}` : ''}`);
    },
    detail: (githubId: string) => fetchApi<MemberDetail>(`/members/${githubId}`, { next: { revalidate: 3600 } }),
    feed: (params: { cohort?: number; track?: string } = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)]),
        ),
      ).toString();
      return fetchApi<FeedItem[]>(`/members/feed${qs ? `?${qs}` : ''}`);
    },
  },
};
