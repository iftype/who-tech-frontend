import { api } from '@/lib/api';
import { FeedClient } from '@/features/feed/FeedClient';

export default async function HomePage(props: {
  searchParams?: Promise<{ cohort?: string; track?: string; range?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cohort = searchParams?.cohort ? Number(searchParams.cohort) : undefined;
  const track = searchParams?.track ?? undefined;
  const range = searchParams?.range ?? '30d';
  const days = range === '30d' ? 30 : undefined;

  const [feed, allCohorts] = await Promise.all([
    api.members
      .feed({ ...(days ? { days } : {}), ...(cohort ? { cohort } : {}), ...(track ? { track } : {}), limit: 50 })
      .catch(() => ({ posts: [], nextCursor: null, totalCount: 0 })),
    api.members.cohorts().catch(() => []),
  ]);

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <FeedClient
        initialItems={feed.posts}
        initialNextCursor={feed.nextCursor}
        initialTotalCount={feed.totalCount}
        initialCohorts={allCohorts}
        initialCohort={searchParams?.cohort ?? null}
        initialTrack={(searchParams?.track as 'frontend' | 'backend' | 'android' | null) ?? null}
        initialRange={(range as '30d' | 'all') ?? '30d'}
      />
    </div>
  );
}
