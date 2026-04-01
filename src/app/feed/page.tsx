import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import Link from 'next/link';
import type { FeedItem } from '@/types';
import { FeedFilters } from '@/features/feed/FeedFilters';

export const metadata: Metadata = { title: '블로그 피드' };

type SearchParams = {
  cohort?: string;
  track?: string;
  range?: string;
};

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
            className="text-[14px] font-medium text-text hover:underline break-all"
          >
            {item.title}
          </a>
          <span className="text-[12px] text-text-muted">- {formatRelativeDate(item.publishedAt)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[12px]">
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
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface py-16 text-center text-[14px] text-text-muted">
        조건에 맞는 블로그 글이 없습니다
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {items.map((item) => (
        <FeedRow key={`${item.url}-${item.publishedAt}`} item={item} />
      ))}
    </div>
  );
}

export default async function FeedPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const current = (await searchParams) ?? {};
  const rangeValue = current.range === '30d' ? 30 : 7;

  const [feed] = await Promise.all([
    api.members
      .feed({
        days: rangeValue,
        track: current.track,
      })
      .catch(() => []),
  ]);
  const staffPosts = feed
    .filter((item) => {
      const roles = item.member.roles ?? [];
      const isStaff = roles.includes('coach') || roles.includes('reviewer');
      const isCohort8 = item.member.cohort === 8;
      return isStaff && isCohort8;
    })
    .slice(0, 5);
  const range = current.range === '30d' ? '30d' : '7d';
  const cohortFilter = current.cohort; // undefined = 전체
  const trackFilter = current.track;

  // 범위 + 트랙 필터
  const now = Date.now();
  const filtered = feed.filter((item) => {
    const diffDays = (now - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (range === '7d' && diffDays > 7) return false;
    if (range === '30d' && diffDays > 30) return false;
    if (trackFilter && !(item.member.tracks ?? []).includes(trackFilter as 'frontend' | 'backend' | 'android'))
      return false;
    return true;
  });

  // 피드에 등장하는 기수 목록 (내림차순)
  const cohorts = [...new Set(filtered.map((item) => item.member.cohort).filter((c): c is number => c !== null))].sort(
    (a, b) => b - a,
  );

  // 기수별 그룹핑
  const grouped = new Map<number | null, FeedItem[]>();
  for (const item of filtered) {
    const key = item.member.cohort ?? null;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  // 선택된 기수의 아이템
  const selectedItems = cohortFilter ? (grouped.get(Number(cohortFilter)) ?? []) : [];

  // 사이드바용 통계 (현재 필터 기준)
  const statBase = cohortFilter ? selectedItems : filtered;

  const platformStats = Object.entries(
    statBase.reduce<Record<string, number>>((acc, item) => {
      const source = getBlogSource(item.url) ?? '기타';
      acc[source] = (acc[source] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const totalPlatformCount = platformStats.reduce((sum, [, c]) => sum + c, 0);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <section className="min-w-0">
          <FeedFilters current={current} cohorts={cohorts} />

          {/* 아이템 수 */}
          <div className="mb-5 flex justify-end border-b border-border pb-4 -mt-4">
            <p className="text-[12px] text-text-muted whitespace-nowrap">
              <span className="font-mono text-text">{cohortFilter ? selectedItems.length : filtered.length}</span>개
            </p>
          </div>

          {/* 콘텐츠 */}
          {cohortFilter ? (
            // 특정 기수 선택 → 기수별 섹션
            <div className="flex flex-col gap-6">
              {cohorts
                .filter((c) => String(c) === cohortFilter)
                .map((cohort) => {
                  const items = grouped.get(cohort) ?? [];
                  if (items.length === 0) return null;
                  return (
                    <div key={cohort}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-accent-dm">
                          {cohort}기
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
            // 전체 → 날짜순 플랫 리스트
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
                      <p className="line-clamp-2 text-[13px] font-medium text-text group-hover:underline leading-relaxed">
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
    </div>
  );
}
