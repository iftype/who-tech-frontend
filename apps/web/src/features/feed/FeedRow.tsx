'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import type { FeedItem } from '@/types';

export function FeedRow({ item, index }: { item: FeedItem; index?: number }) {
  const source = getBlogSource(item.url);
  return (
    <div
      className="relative flex items-start gap-3 border-b border-border-dim px-4 py-3.5 hover:bg-surface-alt last:border-b-0"
      style={
        index != null
          ? {
              animation: 'feedRowFadeIn 0.3s ease both',
              animationDelay: `${Math.min(index * 30, 300)}ms`,
            }
          : undefined
      }
    >
      <div className="relative z-10 mt-0.5 flex flex-shrink-0">
        <a
          href={item.member.isTeamBlog ? (item.member.blog ?? item.url) : `https://github.com/${item.member.githubId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Avatar src={item.member.avatarUrl} alt={item.member.nickname} size={30} />
        </a>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5">
          <a
            href={`/api/members/blog-posts/${item.id}/visit`}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[14px] text-text hover:underline after:absolute after:inset-0 after:content-['']"
          >
            {item.title}
          </a>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px]">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.member.isTeamBlog ? (
              <a
                href={item.member.blog ?? item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 text-[13px] text-text-secondary hover:underline"
              >
                {item.member.nickname}
              </a>
            ) : (
              <Link
                href={`/${item.member.githubId}`}
                className="relative z-10 text-[13px] text-text-secondary hover:underline"
              >
                {item.member.nickname}
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-1">
              {item.member.isTeamBlog ? (
                <span className="inline-flex items-center rounded-full border border-indigo-900/30 bg-indigo-900/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-950">
                  팀 블로그
                </span>
              ) : (
                <>
                  <TrackBadge track={item.member.tracks[0]} compact />
                  {(item.member.cohorts ?? []).length > 0 ? (
                    item.member.cohorts!.map((c) => {
                      const hasCrew = c.roles.includes('crew');
                      const nonCrewRoles = c.roles.filter((r) => r !== 'crew');
                      return (
                        <span key={c.cohort} className="inline-flex items-center gap-1">
                          <CohortBadge cohort={c.cohort} />
                          {hasCrew && <RoleBadge role="crew" />}
                          {!hasCrew && nonCrewRoles.map((r) => <RoleBadge key={r} role={r} />)}
                        </span>
                      );
                    })
                  ) : (
                    <>
                      {item.member.cohort != null && <CohortBadge cohort={item.member.cohort} />}
                      {(item.member.roles ?? [])
                        .filter((r) => r !== 'crew')
                        .map((r) => (
                          <RoleBadge key={r} role={r} />
                        ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <span className="ml-auto flex-shrink-0 text-text-muted sm:ml-0">{formatRelativeDate(item.publishedAt)}</span>
        </div>
      </div>
      {source && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-0.5 hidden flex-shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-text-muted hover:bg-surface-alt sm:inline-flex"
        >
          {source}
        </a>
      )}
    </div>
  );
}

export function FeedList({ items }: { items: FeedItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface py-16 text-center text-[14px] text-text-muted">
        등록된 블로그 글이 없습니다
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {items.map((item, i) => (
        <FeedRow key={`${item.url}-${item.publishedAt}`} item={item} index={i} />
      ))}
    </div>
  );
}
