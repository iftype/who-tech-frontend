import { api } from '@/lib/api';
import { FeedClient } from '@/features/feed/FeedClient';

export default async function HomePage() {
  const [feed, members] = await Promise.all([
    api.members.feed({ days: 7 }).catch(() => ({ posts: [], nextCursor: null })),
    api.members.search({}).catch(() => []),
  ]);

  const allCohorts = [...new Set(members.map((m) => m.cohort).filter((c): c is number => c !== null))].sort(
    (a, b) => b - a,
  );

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <FeedClient initialItems={feed.posts} initialCohorts={allCohorts} />
    </div>
  );
}
