'use client';

import { useState } from 'react';
import { MissionArchive } from '@/features/mission-archive/MissionArchive';
import { formatDate, formatRelativeDate } from '@/lib/utils';
import type { CohortArchive, BlogPost } from '@/types';

interface Props {
  archive: CohortArchive[];
  memberTracks: string[];
  blogPosts: BlogPost[];
  lastPostedAt: string | null;
}

export function ProfileTabs({ archive, memberTracks, blogPosts, lastPostedAt }: Props) {
  const [tab, setTab] = useState<'mission' | 'blog'>('mission');

  return (
    <>
      {/* Mobile tabs */}
      <div className="sm:hidden border-b border-border mb-6">
        <div className="flex">
          {(['mission', 'blog'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-[14px] font-medium border-b-2 -mb-px transition-colors ${
                tab === t
                  ? 'border-accent-dm text-text'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              {t === 'mission' ? '미션 아카이브' : '블로그 글'}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile content */}
      <div className="sm:hidden">
        {tab === 'mission' ? (
          <MissionArchive archive={archive} memberTracks={memberTracks} />
        ) : (
          <BlogSection blogPosts={blogPosts} lastPostedAt={lastPostedAt} />
        )}
      </div>

      {/* Desktop: side-by-side */}
      <div className="hidden sm:flex flex-row gap-8">
        <div className="flex-1 min-w-0">
          <MissionArchive archive={archive} memberTracks={memberTracks} />
        </div>
        <aside className="w-[360px] flex-shrink-0">
          <BlogSection blogPosts={blogPosts} lastPostedAt={lastPostedAt} />
        </aside>
      </div>
    </>
  );
}

function BlogSection({ blogPosts, lastPostedAt }: { blogPosts: BlogPost[]; lastPostedAt: string | null }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[13px] font-semibold text-text hidden sm:block">블로그 글</h2>
      {blogPosts.length === 0 ? (
        <p className="text-[13px] text-text-muted">등록된 블로그 글이 없습니다</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border-dim border border-border rounded-lg overflow-hidden bg-surface">
            {blogPosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 px-4 py-3 hover:bg-surface-alt transition-colors"
              >
                <p className="text-[13px] font-medium text-text line-clamp-2">{post.title}</p>
                <p className="text-[11px] text-text-dim">{formatDate(post.publishedAt)}</p>
              </a>
            ))}
          </div>
          {lastPostedAt && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border-dim bg-surface text-[11px] text-text-muted">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              마지막 게시: {formatRelativeDate(lastPostedAt)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
