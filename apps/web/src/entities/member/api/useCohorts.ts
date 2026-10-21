import { useQuery } from '@tanstack/react-query';
import { cohortsQuery } from './member.queries';

// 데이터가 없을 때마다 새 배열을 만들면 이걸 의존하는 메모·효과가 매번 다시 돈다
const EMPTY: number[] = [];

/** 기수 목록 (내림차순). 서버 page.tsx가 prefetch해 두므로 첫 렌더부터 값이 있다 */
export function useCohorts(): number[] {
  const { data = EMPTY } = useQuery(cohortsQuery());
  return data;
}
