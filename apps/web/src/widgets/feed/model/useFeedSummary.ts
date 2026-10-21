import { useMemo } from 'react';
import { CURRENT_COHORT, isStaff } from '@/entities/member';
import { getBlogSource } from '@/entities/post';
import type { FeedItem } from '@/entities/post';

// 화면 옆 요약: 최근 1주 운영진 글, 블로그 플랫폼 비율
export function useFeedSummary(items: FeedItem[]) {
  const staffPosts = useMemo(() => {
    const now = Date.now();
    return items
      .filter((item) => {
        const diffDays = (now - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      })
      .filter((item) => isStaff(item.member.roles) && item.member.cohort === CURRENT_COHORT)
      .slice(0, 5);
  }, [items]);

  const platformStats = useMemo(
    () =>
      Object.entries(
        items.reduce<Record<string, number>>((acc, item) => {
          const source = getBlogSource(item.url) ?? '기타';
          acc[source] = (acc[source] ?? 0) + 1;
          return acc;
        }, {}),
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4),
    [items],
  );

  return { staffPosts, platformStats };
}
