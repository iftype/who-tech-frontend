'use client';

import dynamic from 'next/dynamic';
import { useFilterState } from '@/hooks/useFilterState';
import { FeedListSection } from '@/features/feed/FeedListSection';
import { FeedSidebar } from '@/features/feed/FeedSidebar';
import { getBlogSource } from '@/lib/utils';
import type { FeedItem, Track } from '@/types';

type Range = '7d' | '30d';

const FeedFilterBar = dynamic(() => import('@/features/feed/FeedFilterBar').then((m) => m.FeedFilterBar), {
  ssr: false,
  loading: () => <div className="mb-5 h-[84px] border-b border-border" />,
});

interface Props {
  allItems: FeedItem[];
}

export function FeedClient({ allItems }: Props) {
  const [filters, applyFilters] = useFilterState('feed', {
    range: '7d' as Range,
    cohort: null as string | null,
    track: null as Track | null,
  });

  const { range, cohort, track } = filters;
  const now = Date.now();

  const byRange = allItems.filter((item) => {
    const diffDays = (now - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= (range === '30d' ? 30 : 7);
  });

  const byTrack = track ? byRange.filter((item) => (item.member.tracks ?? []).includes(track)) : byRange;

  const cohorts = [...new Set(allItems.map((item) => item.member.cohort).filter((c): c is number => c !== null))].sort(
    (a, b) => b - a,
  );

  const filtered = cohort ? byTrack.filter((item) => item.member.cohort === Number(cohort)) : byTrack;

  const grouped = new Map<number, FeedItem[]>();
  for (const item of byTrack) {
    const key = item.member.cohort;
    if (key == null) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  const staffPosts = byRange
    .filter((item) => {
      const roles = item.member.roles ?? [];
      return (roles.includes('coach') || roles.includes('reviewer')) && item.member.cohort === 8;
    })
    .slice(0, 5);

  const platformStats = Object.entries(
    filtered.reduce<Record<string, number>>((acc, item) => {
      const source = getBlogSource(item.url) ?? '기타';
      acc[source] = (acc[source] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <section className="min-w-0">
        <FeedFilterBar
          filters={filters}
          applyFilters={applyFilters}
          cohorts={cohorts}
          filteredCount={filtered.length}
        />
        <FeedListSection cohort={cohort} cohorts={cohorts} filtered={filtered} grouped={grouped} />
      </section>
      <FeedSidebar staffPosts={staffPosts} platformStats={platformStats} />
    </div>
  );
}
