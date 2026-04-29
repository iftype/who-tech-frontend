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
  onBlogPageChange?: (page: number) => void;
}

export function ProfileTabs({ archive, memberTracks, githubId, blogPosts, lastPostedAt, onBlogPageChange }: Props) {
  const [tab, setTab] = useState<'mission' | 'blog'>('mission');
  const [blogSubTab, setBlogSubTab] = useState<'latest' | 'archive'>('latest');

  const { latest, archive: archivePosts, page, totalPages } = blogPosts;

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
          <MissionArchive archive={archive} memberTracks={memberTracks} githubId={githubId} />
        ) : (
          <BlogSection
            latest={latest}
            archivePosts={archivePosts}
            page={page}
            totalPages={totalPages}
            lastPostedAt={lastPostedAt}
            blogSubTab={blogSubTab}
            setBlogSubTab={setBlogSubTab}
            onPageChange={onBlogPageChange}
          />
        )}
      </div>

      {/* Desktop: side-by-side */}
      <div className="hidden sm:flex flex-row gap-8">
        <div className="flex-1 min-w-0">
          <MissionArchive archive={archive} memberTracks={memberTracks} githubId={githubId} />
        </div>
        <aside className="w-[360px] flex-shrink-0">
          <BlogSection
            latest={latest}
            archivePosts={archivePosts}
            page={page}
            totalPages={totalPages}
            lastPostedAt={lastPostedAt}
            blogSubTab={blogSubTab}
            setBlogSubTab={setBlogSubTab}
            onPageChange={onBlogPageChange}
          />
        </aside>
      </div>
    </>
  );
}

function BlogSection({
  latest,
  archivePosts,
  page,
  totalPages,
  lastPostedAt,
  blogSubTab,
  setBlogSubTab,
  onPageChange,
}: {
  latest: BlogPost[];
  archivePosts: BlogPost[];
  page: number;
  totalPages: number;
  lastPostedAt: string | null;
  blogSubTab: 'latest' | 'archive';
  setBlogSubTab: (tab: 'latest' | 'archive') => void;
  onPageChange?: (page: number) => void;
}) {
  const posts = blogSubTab === 'latest' ? latest : archivePosts;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-text hidden sm:block">블로그 글</h2>
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5">
          {(['latest', 'archive'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setBlogSubTab(t)}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                blogSubTab === t ? 'bg-surface-alt text-text' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {t === 'latest' ? '최신' : '아카이브'}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-[13px] text-text-muted">등록된 블로그 글이 없습니다</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border-dim border border-border rounded-lg overflow-hidden bg-surface">
            {posts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 px-4 py-3 hover:bg-surface-alt transition-colors"
              >
                <p className="text-[13px] font-medium text-text line-clamp-2">{decodeHtml(post.title)}</p>
                <p className="text-[11px] text-text-dim">{formatDate(post.publishedAt)}</p>
              </a>
            ))}
          </div>

          {blogSubTab === 'archive' && totalPages > 1 && onPageChange && (
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`h-7 w-7 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    p === page
                      ? 'bg-accent-dm text-white'
                      : 'border border-border bg-surface text-text-muted hover:bg-surface-alt hover:text-text'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

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
