import { EmptyState, ListCard } from '@/shared/ui';
import { FeedRow } from './FeedRow';
import { NO_POSTS_TEXT } from '../model/messages';
import type { FeedItem } from '../model/types';

export function FeedList({ items }: { items: FeedItem[] }) {
  if (items.length === 0) {
    return <EmptyState size="tall">{NO_POSTS_TEXT}</EmptyState>;
  }
  return (
    <ListCard>
      {items.map((item, i) => (
        <FeedRow key={item.id} item={item} index={i} />
      ))}
    </ListCard>
  );
}
