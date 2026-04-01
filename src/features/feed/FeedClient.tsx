'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import type { FeedItem } from '@/types';

type Track = 'frontend' | 'backend' | 'android';
type Range = '7d' | '30d';

function FeedRow({ item }: { item: FeedItem }) {
  const source = getBlogSource(item.url);
  return (
    <div className="flex items-start gap-3 border-b border-border-dim px-4 py-3.5 transition-colors hover:bg-surface-alt last:border-b-0">
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
          className="mt-0.5 flex-shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-text-muted hover:bg-surface-alt"
        >
          {source}
        </a>
      )}
    </div>
  );
}

function FeedList({ items }: { items: FeedItem[] }) {
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

interface Props {
  allItems: FeedItem[];
}

export function FeedClient({ allItems }: Props) {
  const [range, setRange] = useState<Range>('7d');
  const [cohort, setCohort] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  const now = Date.now();

  // 기간 필터
  const byRange = allItems.filter((item) => {
    const diffDays = (now - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= (range === '30d' ? 30 : 7);
  });

  // 트랙 필터
  const byTrack = track ? byRange.filter((item) => (item.member.tracks ?? []).includes(track)) : byRange;

  // 기수 목록 (내림차순)
  const cohorts = [...new Set(byTrack.map((item) => item.member.cohort).filter((c): c is number => c !== null))].sort(
    (a, b) => b - a,
  );

  // 기수 필터
  const filtered = cohort ? byTrack.filter((item) => item.member.cohort === Number(cohort)) : byTrack;

  // 기수별 그룹핑
  const grouped = new Map<number, FeedItem[]>();
  for (const item of byTrack) {
    const key = item.member.cohort;
    if (key == null) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  // 사이드바 — 8기 운영진 최신 글 (range 기준, track 무관)
  const staffPosts = byRange
    .filter((item) => {
      const roles = item.member.roles ?? [];
      return (roles.includes('coach') || roles.includes('reviewer')) && item.member.cohort === 8;
    })
    .slice(0, 5);

  // 플랫폼 통계 (현재 filtered 기준)
  const platformStats = Object.entries(
    filtered.reduce<Record<string, number>>((acc, item) => {
      const source = getBlogSource(item.url) ?? '기타';
      acc[source] = (acc[source] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const totalPlatformCount = platformStats.reduce((sum, [, c]) => sum + c, 0);

  const tabClass = (active: boolean) =>
    `-mb-px cursor-pointer rounded-t-md border-b-2 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:rounded-none sm:px-4 sm:py-2 ${
      active ? 'border-accent-dm text-accent-dm' : 'border-transparent text-text-muted hover:text-text'
    }`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <section className="min-w-0">
        {/* 기수 탭 */}
        <div className="mb-5 overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1 sm:gap-0">
            <button onClick={() => setCohort(null)} className={tabClass(cohort === null)}>
              전체
            </button>
            {cohorts.map((c) => (
              <button key={c} onClick={() => setCohort(String(c))} className={tabClass(cohort === String(c))}>
                {c}기
              </button>
            ))}
          </div>
        </div>

        {/* 헤더 + 기간 필터 */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-text sm:text-[26px]">
              {cohort ? `${cohort}기 피드` : '피드'}
            </h1>
            <p className="mt-1 text-[12px] text-text-secondary">모든 크루의 최신 블로그 글</p>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
            {(['7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`cursor-pointer rounded px-2.5 py-1.5 text-[11px] transition-colors ${
                  range === r ? 'bg-border text-text' : 'text-text-muted hover:text-text'
                }`}
              >
                {r === '7d' ? '최근 7일' : '30일'}
              </button>
            ))}
          </div>
        </div>

        {/* 트랙 필터 */}
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
          <div className="flex items-center gap-0.5">
            {([null, 'frontend', 'backend', 'android'] as (Track | null)[]).map((v) => (
              <button
                key={v ?? 'all'}
                onClick={() => setTrack(v)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  track === v ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'
                }`}
              >
                {v === null ? '전체' : v === 'frontend' ? '프론트엔드' : v === 'backend' ? '백엔드' : '안드로이드'}
              </button>
            ))}
          </div>
          <p className="ml-auto whitespace-nowrap text-[12px] text-text-muted">
            <span className="font-mono text-text">{filtered.length}</span>개
          </p>
        </div>

        {/* 콘텐츠 */}
        {cohort ? (
          <div className="flex flex-col gap-6">
            {cohorts
              .filter((c) => String(c) === cohort)
              .map((c) => {
                const items = grouped.get(c) ?? [];
                if (items.length === 0) return null;
                return (
                  <div key={c}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-accent-dm">
                        {c}기
                      </span>
                      <div className="h-px flex-1 bg-border-dim" />
                      <span className="text-[11px] text-text-dim">{items.length}개</span>
                    </div>
                    <FeedList items={items} />
                  </div>
                );
              })}
          </div>
        ) : (
          <FeedList items={filtered} />
        )}
      </section>

      {/* 사이드바 */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-7 border-l border-border pl-5">
          <section>
            <h2 className="mb-4 text-[12px] font-semibold text-text-secondary">8기 운영진 최신 글</h2>
            <div className="space-y-4">
              {staffPosts.length === 0 ? (
                <p className="text-[12px] text-text-muted">데이터 없음</p>
              ) : (
                staffPosts.map((post) => (
                  <a key={post.url} href={post.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-text group-hover:underline">
                      {post.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Avatar src={post.member.avatarUrl} alt={post.member.nickname} size={16} />
                        <span className="text-[11px] text-text-secondary">{post.member.nickname}</span>
                      </div>
                      <span className="text-[10px] text-text-muted">{formatRelativeDate(post.publishedAt)}</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <h2 className="mb-4 text-[12px] font-semibold text-text-secondary">플랫폼</h2>
            <div className="space-y-2.5">
              {platformStats.length === 0 ? (
                <p className="text-[12px] text-text-muted">데이터 없음</p>
              ) : (
                platformStats.map(([platform, count]) => {
                  const ratio = totalPlatformCount > 0 ? Math.round((count / totalPlatformCount) * 100) : 0;
                  return (
                    <div key={platform} className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="text-text-secondary">{platform}</span>
                      <span className="text-text-muted">{ratio}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
