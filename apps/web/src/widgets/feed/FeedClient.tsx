'use client';

import { useCohorts } from '@/entities/member';
import type { Track } from '@/entities/member';
import { FeedFilterBar } from '@/features/feed-filter/FeedFilterBar';
import { FeedListSection } from '@/widgets/feed/FeedListSection';
import { FeedSidebar } from '@/widgets/feed/FeedSidebar';
import { useFeedFilters, type Range } from './model/useFeedFilters';
import { useFeedPosts } from './model/useFeedPosts';
import { useFeedSummary } from './model/useFeedSummary';
import { FeedSkeleton } from './ui/FeedSkeleton';

interface FeedClientProps {
  initialCohort: number | null;
  initialTrack: Track | null;
  initialRange: Range;
}

// 데이터(피드 첫 페이지·기수 목록)는 서버가 HydrationBoundary로 캐시에 넣어 준다. props는 URL 상태의 서버 스냅샷용
export function FeedClient({ initialCohort, initialTrack, initialRange }: FeedClientProps) {
  const { filters, applyFilters, days } = useFeedFilters(initialRange, initialCohort, initialTrack);
  const { cohort } = filters;
  const { items, totalCount, isFetching, isFetchingNextPage, sentinelRef } = useFeedPosts({ filters, days });
  const cohorts = useCohorts();
  const { staffPosts, grouped, platformStats } = useFeedSummary(items);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <section className="min-w-0">
        <FeedFilterBar
          filters={filters}
          applyFilters={applyFilters}
          cohorts={cohorts}
          filteredCount={items.length}
          totalCount={totalCount}
        />
        {items.length > 0 ? (
          <>
            <FeedListSection cohort={cohort} cohorts={cohorts} filtered={items} grouped={grouped} />
            <div ref={sentinelRef} className="h-10" />
            {isFetchingNextPage && <div className="py-4 text-center text-body-sm text-text-muted">로딩 중...</div>}
          </>
        ) : isFetching ? (
          <FeedSkeleton />
        ) : (
          <div className="py-16 text-center text-body text-text-muted">등록된 블로그 글이 없습니다</div>
        )}
      </section>
      <FeedSidebar staffPosts={staffPosts} platformStats={platformStats} />
    </div>
  );
}
