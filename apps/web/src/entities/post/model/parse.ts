/** 피드 기간: 최근 30일 또는 전체 */
export type FeedRange = '30d' | 'all';

export function parseRange(value: string | null | undefined): FeedRange {
  return value === 'all' ? 'all' : '30d';
}

export function rangeToDays(range: FeedRange): number | undefined {
  return range === '30d' ? 30 : undefined;
}
