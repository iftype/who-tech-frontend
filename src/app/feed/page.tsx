import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { TrackBadge } from '@/components/ui/Badge';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import Link from 'next/link';
import type { FeedItem } from '@/types';

export const metadata: Metadata = { title: '블로그 피드' };

type SearchParams = {
  cohort?: string;
  track?: string;
  range?: string;
};

function buildFeedHref(current: SearchParams, next: Partial<SearchParams>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...next };
  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `/feed?${query}` : '/feed';
}

function FeedRow({ item }: { item: FeedItem }) {
  const source = getBlogSource(item.url);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 border-b border-border-dim px-4 py-3.5 transition-colors hover:bg-surface-alt last:border-b-0"
    >
      <Avatar src={item.member.avatarUrl} alt={item.member.nickname} size={30} className="mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 line-clamp-2 text-[14px] font-medium leading-5 text-text">{item.title}</p>
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-text-secondary">
          <span>{item.member.nickname}</span>
          <span className="text-text-dim">·</span>
          <span>{formatRelativeDate(item.publishedAt)}</span>
          {(item.member.tracks ?? []).map((t) => (
            <TrackBadge key={t} track={t} />
          ))}
        </div>
      </div>
      {source && (
        <span className="mt-0.5 flex-shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
          {source}
        </span>
      )}
    </a>
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
  const feed = await api.members.feed().catch(() => []);
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
  const topCrew = Object.values(
    statBase.reduce<Record<string, { nickname: string; count: number }>>((acc, item) => {
      const key = item.member.githubId;
      if (acc[key]) acc[key].count++;
      else acc[key] = { nickname: item.member.nickname, count: 1 };
      return acc;
    }, {}),
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

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
          {/* 헤더 */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-text sm:text-[26px]">피드</h1>
              <p className="mt-1 text-[12px] text-text-secondary">모든 크루의 최신 블로그 글</p>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
              <Link
                href={buildFeedHref(current, { range: '7d' })}
                className={`rounded px-2.5 py-1.5 text-[11px] transition-colors ${
                  range === '7d' ? 'bg-border text-text' : 'text-text-muted hover:text-text'
                }`}
              >
                최근 7일
              </Link>
              <Link
                href={buildFeedHref(current, { range: '30d' })}
                className={`rounded px-2.5 py-1.5 text-[11px] transition-colors ${
                  range === '30d' ? 'bg-border text-text' : 'text-text-muted hover:text-text'
                }`}
              >
                30일
              </Link>
            </div>
          </div>

          {/* 기수 탭 + 트랙 필터 */}
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
            {/* 기수 탭 */}
            <div className="flex items-center gap-0.5">
              <Link
                href={buildFeedHref(current, { cohort: undefined })}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  !cohortFilter ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'
                }`}
              >
                전체
              </Link>
              {cohorts.map((c) => (
                <Link
                  key={c}
                  href={buildFeedHref(current, { cohort: String(c) })}
                  className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                    cohortFilter === String(c) ? 'bg-accent-bg text-accent-dm' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {c}기
                </Link>
              ))}
            </div>

            <div className="hidden h-3.5 w-px bg-border sm:block" />

            {/* 트랙 필터 */}
            <div className="flex items-center gap-0.5">
              {[
                [undefined, '전체'],
                ['frontend', '프론트엔드'],
                ['backend', '백엔드'],
                ['android', '안드로이드'],
              ].map(([value, label]) => (
                <Link
                  key={value ?? 'all'}
                  href={buildFeedHref(current, { track: value })}
                  className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                    (trackFilter ?? undefined) === value
                      ? 'bg-accent-bg text-accent-dm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <p className="ml-auto text-[12px] text-text-muted whitespace-nowrap">
              <span className="font-mono text-text">{cohortFilter ? selectedItems.length : filtered.length}</span>개
            </p>
          </div>

          {/* 콘텐츠 */}
          {cohortFilter ? (
            // 특정 기수 선택 → 플랫 리스트
            <FeedList items={selectedItems} />
          ) : // 전체 → 기수별 섹션
          filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface py-16 text-center text-[14px] text-text-muted">
              조건에 맞는 블로그 글이 없습니다
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cohorts.map((cohort) => {
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
              {/* 기수 없는 항목 */}
              {(grouped.get(null) ?? []).length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                      기타
                    </span>
                    <div className="h-px flex-1 bg-border-dim" />
                  </div>
                  <FeedList items={grouped.get(null) ?? []} />
                </div>
              )}
            </div>
          )}
        </section>

        {/* 사이드바 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-7 border-l border-border pl-5">
            <section>
              <h2 className="mb-4 text-[12px] font-semibold text-text-secondary">활발한 크루</h2>
              <div className="space-y-3">
                {topCrew.length === 0 ? (
                  <p className="text-[12px] text-text-muted">데이터 없음</p>
                ) : (
                  topCrew.map((crew, index) => (
                    <div key={crew.nickname} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-text-dim">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[13px] text-text">{crew.nickname}</span>
                      </div>
                      <span className="text-[12px] text-text-muted">{crew.count}글</span>
                    </div>
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
