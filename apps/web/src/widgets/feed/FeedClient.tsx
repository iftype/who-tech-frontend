'use client';

import { useCohorts } from '@/entities/member';
import type { Track } from '@/entities/member';
import { NO_POSTS_TEXT } from '@/entities/post';
import { FeedFilterBar } from '@/features/feed-filter';
import { EmptyState, ErrorState, LOADING_TEXT, buttonVariants } from '@/shared/ui';
import { FeedListSection } from './FeedListSection';
import { FeedSidebar } from './FeedSidebar';
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
  const { filters, applyFilters, days } = useFeedFilters({ initialRange, initialCohort, initialTrack });
  const { cohort } = filters;
  const {
    items,
    totalCount,
    isFetching,
    isFetchingNextPage,
    isError,
    isFetchNextPageError,
    refetch,
    fetchNextPage,
    sentinelRef,
  } = useFeedPosts({ filters, days });
  const cohorts = useCohorts();
  const { staffPosts, platformStats } = useFeedSummary(items);

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
            <FeedListSection cohort={cohort} items={items} />
            <div ref={sentinelRef} className="h-10" />
            {isFetchingNextPage && <div className="py-4 text-center text-body-sm text-text-muted">{LOADING_TEXT}</div>}
            {/* 다음 페이지만 실패하면 받은 글은 두고 그 아래에서 다시 시도한다 (ADR 0011 하지 않은 것 → 라운드 6) */}
            {isFetchNextPageError && !isFetchingNextPage && (
              <div role="alert" className="py-4 text-center text-body-sm text-text-muted">
                다음 글을 불러오지 못했습니다{' '}
                <button
                  type="button"
                  onClick={() => void fetchNextPage()}
                  className={buttonVariants({ variant: 'plain', size: 'inline' })}
                >
                  다시 시도
                </button>
              </div>
            )}
          </>
        ) : isError ? (
          <ErrorState frame="plain" size="tall" onRetry={() => void refetch()} />
        ) : isFetching ? (
          <FeedSkeleton />
        ) : (
          <EmptyState frame="plain" size="tall">
            {NO_POSTS_TEXT}
          </EmptyState>
        )}
      </section>
      <FeedSidebar staffPosts={staffPosts} platformStats={platformStats} />
    </div>
  );
}
