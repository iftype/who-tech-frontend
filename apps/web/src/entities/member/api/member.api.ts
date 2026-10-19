import { ApiError, RateLimitError, requestJson, send, withQuery } from '@/shared/api';
import type { Member, MemberDetail, MemberSearchPage, RoleGroup } from '../model/types';

export interface MemberSearchParams {
  q?: string;
  cohort?: number;
  track?: string;
  role?: string;
}

export interface MemberSearchPageParams extends MemberSearchParams {
  roleGroup?: RoleGroup;
  limit?: number;
  offset?: number;
}

export const memberApi = {
  search: (params: MemberSearchParams, init?: RequestInit) =>
    requestJson<Member[]>(withQuery('/members', { ...params }), init),

  // 서버에서 부를 때 Next 데이터 캐시 5분 (브라우저는 next 옵션을 무시한다)
  searchPage: (params: MemberSearchPageParams, init: RequestInit = { next: { revalidate: 300 } }) =>
    requestJson<MemberSearchPage>(withQuery('/members/search', { ...params }), init),

  cohorts: () => requestJson<number[]>('/members/cohorts'),

  detail: (githubId: string) => requestJson<MemberDetail>(`/members/${githubId}`, { next: { revalidate: 300 } }),

  /** 프로필 새로고침. 너무 자주 부르면 RateLimitError(남은 초 포함) */
  refresh: async (githubId: string): Promise<MemberDetail> => {
    const res = await send(`/members/${githubId}/refresh`, { method: 'POST' });
    if (res.status === 429) {
      const body = (await res.json()) as { remainingSeconds: number; message: string };
      throw new RateLimitError(body.remainingSeconds, body.message);
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError(res.status, `API error: ${res.status} ${text}`);
    }
    return res.json() as Promise<MemberDetail>;
  },
};
