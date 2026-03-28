import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, TrackBadge } from '@/components/ui/Badge';
import { formatRelativeDate } from '@/lib/utils';

export const metadata: Metadata = { title: '블로그 피드' };

export default async function FeedPage() {
  const feed = await api.members.feed().catch(() => []);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-[20px] font-bold text-text">블로그 피드</h1>
        <span className="font-mono text-[12px] text-text-muted">{feed.length}개</span>
      </div>

      <div className="flex flex-col divide-y divide-border-dim border border-border rounded-lg overflow-hidden bg-surface">
        {feed.length === 0 ? (
          <div className="py-20 text-center text-[14px] text-text-muted">블로그 글이 없습니다</div>
        ) : (
          feed.map((item) => (
            <a
              key={`${item.url}-${item.publishedAt}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 px-5 py-4 hover:bg-surface-alt transition-colors"
            >
              <Avatar src={item.member.avatarUrl} alt={item.member.nickname} size={36} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text mb-1">{item.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-text-secondary">{item.member.nickname}</span>
                  {item.member.cohort && <CohortBadge cohort={item.member.cohort} />}
                  {item.member.tracks.map((t) => (
                    <TrackBadge key={t} track={t} />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-text-dim flex-shrink-0 mt-1">
                {formatRelativeDate(item.publishedAt)}
              </span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
