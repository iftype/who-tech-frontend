'use client';

import type { Track } from '@/types';

type Range = '7d' | '30d';

const tabClass = (active: boolean) =>
  `-mb-px cursor-pointer rounded-t-md border-b-2 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:rounded-none sm:px-4 sm:py-2 ${
    active ? 'border-accent-dm text-accent-dm' : 'border-transparent text-text-muted hover:text-text'
  }`;

interface Props {
  filters: { range: Range; cohort: string | null; track: Track | null };
  applyFilters: (patch: Partial<{ range: Range; cohort: string | null; track: Track | null }>) => void;
  cohorts: number[];
  filteredCount: number;
}

export function FeedFilterBar({ filters, applyFilters, cohorts, filteredCount }: Props) {
  const { range, cohort, track } = filters;

  return (
    <>
      <div className="mb-5 overflow-x-auto border-b border-border overscroll-x-contain overscroll-y-none [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1 sm:gap-0">
          <button onClick={() => applyFilters({ cohort: null })} className={tabClass(cohort === null)}>
            전체
          </button>
          {cohorts.map((c) => (
            <button
              key={c}
              onClick={() => applyFilters({ cohort: String(c) })}
              className={tabClass(cohort === String(c))}
            >
              {c}기
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-text sm:text-[26px]">
            {cohort ? `${cohort}기 피드` : '피드'}
          </h1>
          <p className="mt-1 text-[12px] text-text-secondary">
            {cohort ? `${cohort}기 크루의 최신 블로그 글` : '모든 크루의 최신 블로그 글'}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
          {(['7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => applyFilters({ range: r })}
              className={`cursor-pointer rounded px-2.5 py-1.5 text-[11px] transition-colors ${
                range === r ? 'bg-border text-text' : 'text-text-muted hover:text-text'
              }`}
            >
              {r === '7d' ? '최근 7일' : '30일'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-0.5">
          {([null, 'frontend', 'backend', 'android'] as (Track | null)[]).map((v) => (
            <button
              key={v ?? 'all'}
              onClick={() => applyFilters({ track: v })}
              className={`cursor-pointer rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                track === v ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'
              }`}
            >
              {v === null ? '전체' : v === 'frontend' ? '프론트엔드' : v === 'backend' ? '백엔드' : '안드로이드'}
            </button>
          ))}
        </div>
        <p className="ml-auto whitespace-nowrap text-[12px] text-text-muted">
          <span className="font-mono text-text">{filteredCount}</span>개
        </p>
      </div>
    </>
  );
}
