import { ApiError, RateLimitError, readBody, requestJson, send, serverCache, withQuery } from '@/shared/api';
import type { Member, MemberDetail, MemberSearchPage, Role, RoleGroup, Track } from '../model/types';

interface MemberSearchParams {
  q?: string;
  cohort?: number;
  track?: Track;
  role?: Role;
}

interface MemberSearchPageParams extends MemberSearchParams {
  roleGroup?: RoleGroup;
  limit?: number;
  offset?: number;
}

// 서버 데이터 캐시 시간 (서버 prefetch 경로만 해당)
const CACHE_SECONDS = 300;

export const memberApi = {
  search: (params: MemberSearchParams, init?: RequestInit) =>
    requestJson<Member[]>(withQuery('/members', { ...params }), init),

  searchPage: (params: MemberSearchPageParams, init: RequestInit = serverCache(CACHE_SECONDS)) =>
    requestJson<MemberSearchPage>(withQuery('/members/search', { ...params }), init),

  // 기수 목록은 기수가 바뀔 때만 달라진다 → 다른 서버 prefetch와 같은 5분 캐시 (라운드 5에서 추가)
  cohorts: () => requestJson<number[]>('/members/cohorts', serverCache(CACHE_SECONDS)),

  detail: (githubId: string) => requestJson<MemberDetail>(`/members/${githubId}`, serverCache(CACHE_SECONDS)),

  /** 프로필 새로고침. 너무 자주 부르면 RateLimitError(남은 초 포함) */
  refresh: async (githubId: string): Promise<MemberDetail> => {
    const res = await send(`/members/${githubId}/refresh`, { method: 'POST' });
    if (res.status === 429) {
      const body = (await res.json()) as { remainingSeconds: number; message: string };
      throw new RateLimitError(body.remainingSeconds, body.message);
    }
    if (!res.ok) {
      const text = await readBody(res);
      throw new ApiError(res.status, `API error: ${res.status} ${text}`, text);
    }
    return res.json() as Promise<MemberDetail>;
  },
};
