import { EmptyState, ListCard } from '@/shared/ui';
import { FeedRow } from './FeedRow';
import type { FeedItem } from '../model/types';

export function FeedList({ items }: { items: FeedItem[] }) {
  if (items.length === 0) {
    return <EmptyState size="tall">등록된 블로그 글이 없습니다</EmptyState>;
  }
  return (
    <ListCard>
      {items.map((item, i) => (
        <FeedRow key={item.id} item={item} index={i} />
      ))}
    </ListCard>
  );
}
