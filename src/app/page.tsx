import { api } from '@/lib/api';
import { FeedClient } from '@/features/feed/FeedClient';

export default async function HomePage() {
  const feed = await api.members.feed({ days: 7 }).catch(() => ({ posts: [], nextCursor: null }));
  return (
    <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <FeedClient initialItems={feed.posts} />
    </div>
  );
}
