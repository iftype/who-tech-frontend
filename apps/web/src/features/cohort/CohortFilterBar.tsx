'use client';

import type { Track } from '@/types';

type RoleGroup = 'crew' | 'staff';

const TRACK_OPTIONS: { label: string; value: Track | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '프론트엔드', value: 'frontend' },
  { label: '백엔드', value: 'backend' },
  { label: '안드로이드', value: 'android' },
];

export { TRACK_OPTIONS };

interface Props {
  cohort: number;
  filters: { roleGroup: RoleGroup; track: Track | 'all' };
  applyFilters: (patch: { roleGroup?: RoleGroup; track?: Track | 'all' }) => void;
  counts: { crew: number; staff: number };
  visibleTrackOptions: { label: string; value: Track | 'all' }[];
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
}: Props) {
  const { roleGroup, track } = filters;

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-text sm:text-[24px]">
            {cohort === 0 ? '전체 크루' : `${cohort}기 크루`}
          </h1>
          <p className="mt-1 text-[12px] text-text-muted">
            우아한테크코스 {cohort === 0 ? '전체' : `${cohort}기`} 멤버 목록
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
          <button
            onClick={() => applyFilters({ roleGroup: 'crew' })}
            className={`rounded px-2.5 py-1.5 text-[11px] transition-colors cursor-pointer ${roleGroup === 'crew' ? 'bg-border text-text' : 'text-text-muted hover:text-text'}`}
          >
            크루 {counts.crew}
          </button>
          <button
            onClick={() => applyFilters({ roleGroup: 'staff' })}
            className={`rounded px-2.5 py-1.5 text-[11px] transition-colors cursor-pointer ${roleGroup === 'staff' ? 'bg-border text-text' : 'text-text-muted hover:text-text'}`}
          >
            운영진 {counts.staff}
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-0.5">
          {visibleTrackOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => applyFilters({ track: value })}
              className={`cursor-pointer rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${track === value ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <p className="text-[12px] text-text-muted whitespace-nowrap">
            <span className="font-mono text-text">{filteredCount}</span>
            {filteredCount !== totalCount && <span className="text-text-dim">/{totalCount}</span>}명
          </p>
        </div>
      </div>
    </>
  );
}
