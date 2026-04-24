'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import type { FeedItem } from '@/types';

export function FeedRow({ item }: { item: FeedItem }) {
  const source = getBlogSource(item.url);
  return (
    <div className="relative flex items-start gap-3 border-b border-border-dim px-4 py-3.5 hover:bg-surface-alt last:border-b-0">
      <a
        href={`https://github.com/${item.member.githubId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 mt-0.5 flex-shrink-0"
      >
        <Avatar src={item.member.avatarUrl} alt={item.member.nickname} size={30} />
      </a>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[14px] font-medium text-text hover:underline after:absolute after:inset-0 after:content-['']"
          >
            {item.title}
          </a>
          <span className="text-[12px] text-text-muted">- {formatRelativeDate(item.publishedAt)}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px]">
          <Link href={`/${item.member.githubId}`} className="relative z-10 text-[13px] text-text hover:underline">
            {item.member.nickname}
          </Link>
          <div className="flex flex-wrap items-center gap-1">
            {(item.member.tracks ?? []).map((t) => (
              <TrackBadge key={t} track={t} />
            ))}
            {item.member.cohort != null && <CohortBadge cohort={item.member.cohort} />}
            {(item.member.roles ?? [])
              .filter((r) => r !== 'crew')
              .map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
          </div>
        </div>
      </div>
      {source && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-0.5 flex-shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-text-muted hover:bg-surface-alt"
        >
          {source}
        </a>
      )}
    </div>
  );
}

export function FeedList({ items }: { items: FeedItem[] }) {
  if (items.length === 0)
    return (
      <div className="rounded-xl border border-border bg-surface py-16 text-center text-[14px] text-text-muted">
        조건에 맞는 블로그 글이 없습니다
      </div>
    );
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {items.map((item) => (
        <FeedRow key={`${item.url}-${item.publishedAt}`} item={item} />
      ))}
    </div>
  );
}
