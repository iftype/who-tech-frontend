'use client';

import { useState } from 'react';
import { MissionArchive } from '@/features/mission-archive/MissionArchive';
import { formatDate, formatRelativeDate, decodeHtml } from '@/lib/utils';
import type { CohortArchive, BlogPost, BlogPostDetail } from '@/types';

interface Props {
  archive: CohortArchive[];
  memberTracks: string[];
  githubId: string;
  blogPosts: BlogPostDetail;
  lastPostedAt: string | null;
}

export function ProfileTabs({ archive, memberTracks, githubId, blogPosts, lastPostedAt }: Props) {
  const [tab, setTab] = useState<'mission' | 'blog'>('mission');

  const { archive: archivePosts } = blogPosts;

  return (
    <>
      <div className="border-b border-border mb-6">
        <div className="flex">
          {(['mission', 'blog'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-[14px] font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
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

      {tab === 'mission' ? (
        <div className="w-full">
          <MissionArchive archive={archive} memberTracks={memberTracks} githubId={githubId} />
        </div>
      ) : (
        <BlogSection archivePosts={archivePosts} lastPostedAt={lastPostedAt} />
      )}
    </>
  );
}

function BlogSection({ archivePosts, lastPostedAt }: { archivePosts: BlogPost[]; lastPostedAt: string | null }) {
  return (
    <div className="flex flex-col gap-4">
      {archivePosts.length === 0 ? (
        <p className="text-[13px] text-text-muted">등록된 블로그 글이 없습니다</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border-dim border border-border rounded-lg overflow-hidden bg-surface">
            {archivePosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 hover:bg-surface-alt transition-colors"
              >
                <p className="text-[13px] font-medium text-text line-clamp-2">{decodeHtml(post.title)}</p>
                <p className="text-[11px] text-text-dim sm:shrink-0">{formatDate(post.publishedAt)}</p>
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
