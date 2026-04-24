import { api } from '@/lib/api';
import { FeedClient } from '@/features/feed/FeedClient';

export default async function HomePage() {
  const allItems = await api.members.feed({ days: 30 }).catch(() => []);
  return (
    <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <FeedClient allItems={allItems} />
    </div>
  );
}
