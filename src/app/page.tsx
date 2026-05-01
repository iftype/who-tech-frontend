import { api } from '@/lib/api';
import { FeedClient } from '@/features/feed/FeedClient';

export default async function HomePage(props: {
  searchParams?: Promise<{ cohort?: string; track?: string; range?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cohort = searchParams?.cohort ? Number(searchParams.cohort) : undefined;
  const track = searchParams?.track ?? undefined;
  const range = searchParams?.range;
  const days = range === '30d' ? 30 : 7;

  const [feed, members] = await Promise.all([
    api.members
      .feed({ days, ...(cohort ? { cohort } : {}), ...(track ? { track } : {}), limit: 10 })
      .catch(() => ({ posts: [], nextCursor: null })),
    api.members.search({}).catch(() => []),
  ]);

  const allCohorts = [...new Set(members.map((m) => m.cohort).filter((c): c is number => c !== null))].sort(
    (a, b) => b - a,
  );

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <FeedClient
        initialItems={feed.posts}
        initialCohorts={allCohorts}
        initialCohort={searchParams?.cohort ?? null}
        initialTrack={(searchParams?.track as 'frontend' | 'backend' | 'android' | null) ?? null}
        initialRange={(range as '7d' | '30d') ?? '7d'}
      />
    </div>
  );
}
