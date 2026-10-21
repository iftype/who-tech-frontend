import type { Track } from '@/entities/member';

// React Query 키를 한곳에서 만든다. 서버 prefetch(하이드레이션)와 화면 쿼리가 같은 키를 쓰므로 값을 바꾸면 캐시가 어긋난다.
// 모든 키가 all로 시작한다 (memberKeys와 같은 규칙)
const all = ['posts'] as const;

export const postKeys = {
  all,
  feed: (days: number | undefined, track: Track | null, cohort: number | null) =>
    [...all, 'feed', days, track, cohort] as const,
  byMember: (githubId: string) => [...all, 'by-member', githubId] as const,
};
