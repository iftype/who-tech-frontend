import { FeedList } from '@/entities/post';
import type { FeedItem } from '@/entities/post';
import { Divider, SectionLabel } from '@/shared/ui';

interface FeedListSectionProps {
  cohort: number | null;
  items: FeedItem[];
}

// 기수 탭을 고르면 서버가 참여 기수 기준으로 걸러 준 글이 온다. 대표 기수(member.cohort)로 다시 묶으면
// 다른 기수가 대표인 크루의 글이 조용히 빠졌다 → 받은 글을 전부 그 기수 제목 아래 그린다
export function FeedListSection({ cohort, items }: FeedListSectionProps) {
  if (items.length === 0) return null;
  if (cohort === null) return <FeedList items={items} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <SectionLabel>{cohort}기</SectionLabel>
          <Divider />
          <span className="text-caption text-text-dim">{items.length}개</span>
        </div>
        <FeedList items={items} />
      </div>
    </div>
  );
}
