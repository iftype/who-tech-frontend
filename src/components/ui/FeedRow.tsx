import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { MemberBadges } from '@/components/ui/MemberBadges';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import type { FeedItem } from '@/types';

interface Props {
  item: FeedItem;
}

export function FeedRow({ item }: Props) {
  const source = getBlogSource(item.url);
  return (
    <div className="flex items-start gap-3 border-b border-border-dim px-4 py-3.5 hover:bg-surface-alt last:border-b-0">
      <a
        href={`https://github.com/${item.member.githubId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-0.5 flex-shrink-0"
      >
        <Avatar src={item.member.avatarUrl} alt={item.member.nickname} size={30} />
      </a>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[14px] font-medium text-text hover:underline"
          >
            {item.title}
          </a>
          <span className="text-[12px] text-text-muted">- {formatRelativeDate(item.publishedAt)}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px]">
          <Link href={`/${item.member.githubId}`} className="text-[13px] font-semibold text-text hover:underline">
            {item.member.nickname}
          </Link>
          <MemberBadges tracks={item.member.tracks ?? []} cohort={item.member.cohort} roles={item.member.roles ?? []} />
        </div>
      </div>
      {source && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 flex-shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-text-muted hover:bg-surface-alt"
        >
          {source}
        </a>
      )}
    </div>
  );
}
