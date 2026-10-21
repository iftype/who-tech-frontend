'use client';

import type { RoleGroup, Track, TrackOption } from '@/entities/member';
import { cn } from '@/shared/lib/utils';
import { FilterRow, SegmentedControl, filterChipVariants, segmentVariants } from '@/shared/ui';

interface CohortFilterBarProps {
  /** null = 전체 기수 */
  cohort: number | null;
  filters: { roleGroup: RoleGroup; track: Track | 'all' };
  applyFilters: (patch: { roleGroup?: RoleGroup; track?: Track | 'all' }) => void;
  counts: { crew: number; staff: number };
  visibleTrackOptions: TrackOption[];
  filteredCount: number;
  totalCount: number;
}

export function CohortFilterBar({
  cohort,
  filters,
  applyFilters,
  counts,
  visibleTrackOptions,
  filteredCount,
  totalCount,
}: CohortFilterBarProps) {
  const { roleGroup, track } = filters;

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-title font-bold tracking-tight text-text sm:text-title-lg">
            {cohort === null ? '전체 크루' : `${cohort}기 크루`}
          </h1>
          <p className="mt-1 text-label text-text-muted">
            우아한테크코스 {cohort === null ? '전체' : `${cohort}기`} 멤버 목록
          </p>
        </div>
        <SegmentedControl>
          <button
            onClick={() => applyFilters({ roleGroup: 'crew' })}
            className={cn(segmentVariants({ active: roleGroup === 'crew' }), 'transition-colors')}
          >
            크루 {counts.crew}
          </button>
          <button
            onClick={() => applyFilters({ roleGroup: 'staff' })}
            className={cn(segmentVariants({ active: roleGroup === 'staff' }), 'transition-colors')}
          >
            운영진 {counts.staff}
          </button>
        </SegmentedControl>
      </div>

      <FilterRow>
        <div className="flex items-center gap-0.5">
          {visibleTrackOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => applyFilters({ track: value })}
              className={cn(filterChipVariants({ active: track === value }), 'transition-colors')}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <p className="text-label text-text-muted whitespace-nowrap">
            <span className="font-mono text-text">{filteredCount}</span>
            {filteredCount !== totalCount && <span className="text-text-dim">/{totalCount}</span>}명
          </p>
        </div>
      </FilterRow>
    </>
  );
}
