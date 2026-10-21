'use client';

import { TRACKS, TRACK_LABEL } from '@/entities/member';
import type { Track } from '@/entities/member';
import type { FeedRange as Range } from '@/entities/post';
import { FilterRow, SegmentedControl, TabBar, filterChipVariants, segmentVariants, tabVariants } from '@/shared/ui';

interface FeedFilterBarProps {
  filters: { range: Range; cohort: number | null; track: Track | null };
  applyFilters: (patch: Partial<{ range: Range; cohort: number | null; track: Track | null }>) => void;
  cohorts: number[];
  filteredCount: number;
  totalCount?: number;
}

export function FeedFilterBar({ filters, applyFilters, cohorts, filteredCount, totalCount }: FeedFilterBarProps) {
  const { range, cohort, track } = filters;

  return (
    <>
      <TabBar label="기수">
        <button
          role="tab"
          aria-selected={cohort === null}
          onClick={() => applyFilters({ cohort: null })}
          className={tabVariants({ active: cohort === null })}
        >
          전체
        </button>
        {cohorts.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cohort === c}
            onClick={() => applyFilters({ cohort: c })}
            className={tabVariants({ active: cohort === c })}
          >
            {c}기
          </button>
        ))}
      </TabBar>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-title-lg font-bold tracking-tight text-text sm:text-headline-sm">
            {cohort !== null ? `${cohort}기 피드` : '피드'}
          </h1>
          <p className="mt-1 text-label text-text-secondary">
            {cohort !== null ? `${cohort}기 크루의 최신 블로그 글` : '모든 크루의 최신 블로그 글'}
          </p>
        </div>
        <SegmentedControl>
          {(['30d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => applyFilters({ range: r })}
              className={segmentVariants({ active: range === r })}
            >
              {r === '30d' ? '최근 30일' : '전체'}
            </button>
          ))}
        </SegmentedControl>
      </div>

      <FilterRow>
        <div className="flex items-center gap-0.5">
          {[null, ...TRACKS].map((v: Track | null) => (
            <button
              key={v ?? 'all'}
              onClick={() => applyFilters({ track: v })}
              className={filterChipVariants({ active: track === v })}
            >
              {v === null ? '전체' : TRACK_LABEL[v]}
            </button>
          ))}
        </div>
        <p className="ml-auto whitespace-nowrap text-label text-text-muted">
          <span className="font-mono text-text">{filteredCount}</span>개
          {totalCount != null && totalCount > 0 && (
            <span className="ml-1 text-text-secondary">/ 전체 {totalCount}개</span>
          )}
        </p>
      </FilterRow>
    </>
  );
}
