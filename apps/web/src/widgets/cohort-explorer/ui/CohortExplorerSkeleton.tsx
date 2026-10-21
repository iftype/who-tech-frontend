import type { TrackOption } from '@/entities/member';
import { CohortHeading } from '@/features/cohort-filter/CohortHeading';
import { ListCard } from '@/shared/ui';

interface SkeletonProps {
  /** null = 전체 기수 */
  cohort: number | null;
  counts: { crew: number; staff: number };
  visibleTrackOptions: TrackOption[];
  filteredCount: number;
}

// 크루/운영진 선택 버튼 자리 (누를 수 없는 뼈대)
const SEGMENT_PLACEHOLDER_CLASS = 'rounded px-2.5 py-1.5 text-caption text-text-muted';

function CohortFilterBarSkeleton({ cohort, counts, visibleTrackOptions, filteredCount }: SkeletonProps) {
  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <CohortHeading cohort={cohort} />
        <div className="pointer-events-none flex items-center gap-1 rounded-md border border-border bg-surface p-1">
          <div className={SEGMENT_PLACEHOLDER_CLASS}>크루 {counts.crew}</div>
          <div className={SEGMENT_PLACEHOLDER_CLASS}>운영진 {counts.staff}</div>
        </div>
      </div>
      <div className="pointer-events-none mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-0.5">
          {visibleTrackOptions.map(({ label, value }) => (
            <div key={value} className="rounded-md px-2.5 py-1 text-label font-medium text-text-muted">
              {label}
            </div>
          ))}
        </div>
        <p className="ml-auto whitespace-nowrap text-label text-text-muted">
          <span className="font-mono text-text">{filteredCount}</span>명
        </p>
      </div>
    </>
  );
}

// 멤버 목록을 불러오는 동안의 화면: 필터 바 자리와 목록(모바일)·카드(데스크톱) 자리
export function CohortExplorerSkeleton({ cohort, counts, visibleTrackOptions, filteredCount }: SkeletonProps) {
  return (
    <>
      <CohortFilterBarSkeleton
        cohort={cohort}
        counts={counts}
        visibleTrackOptions={visibleTrackOptions}
        filteredCount={filteredCount}
      />
      <ListCard stack className="sm:hidden">
        {[72, 56, 88, 64, 76].map((w) => (
          <div key={w} className="flex items-center gap-3 border-b border-border-dim px-4 py-3 last:border-0">
            <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-surface-alt" />
            <div className="min-w-0 flex-1">
              <div className="h-3.5 animate-pulse rounded bg-surface-alt" style={{ width: w }} />
              <div className="mt-1 flex gap-1">
                <div className="h-4 w-8 animate-pulse rounded-full bg-surface-alt" />
                <div className="h-4 w-14 animate-pulse rounded-full bg-surface-alt" />
              </div>
            </div>
          </div>
        ))}
      </ListCard>
      <div className="hidden sm:grid gap-3 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div
            key={i}
            className="flex min-h-[148px] flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-surface p-4"
          >
            <div className="h-12 w-12 animate-pulse rounded-full bg-surface-alt" />
            <div className="w-full text-center">
              <div className="mx-auto h-3.5 w-16 animate-pulse rounded bg-surface-alt" />
              <div className="mx-auto mt-1 h-2.5 w-12 animate-pulse rounded bg-surface-alt" />
            </div>
            <div className="h-4 w-10 animate-pulse rounded-full bg-surface-alt" />
          </div>
        ))}
      </div>
    </>
  );
}
