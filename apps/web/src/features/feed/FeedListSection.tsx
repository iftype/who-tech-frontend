import { FeedList } from '@/features/feed/FeedRow';
import type { FeedItem } from '@/types';

interface Props {
  cohort: string | null;
  cohorts: number[];
  filtered: FeedItem[];
  grouped: Map<number, FeedItem[]>;
}

export function FeedListSection({ cohort, cohorts, filtered, grouped }: Props) {
  if (cohort) {
    const matchedCohorts = cohorts.filter((c) => String(c) === cohort);
    const hasItems = matchedCohorts.some((c) => (grouped.get(c) ?? []).length > 0);
    if (!hasItems) return null;

    return (
      <div className="flex flex-col gap-6">
        {matchedCohorts.map((c) => {
          const items = grouped.get(c) ?? [];
          return (
            <div key={c}>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-accent-dm">
                  {c}기
                </span>
                <div className="h-px flex-1 bg-border-dim" />
                <span className="text-[11px] text-text-dim">{items.length}개</span>
              </div>
              <FeedList items={items} />
            </div>
          );
        })}
      </div>
    );
  }

  if (filtered.length === 0) return null;

  return <FeedList items={filtered} />;
}
