import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, TrackBadge } from '@/components/ui/Badge';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import Link from 'next/link';

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
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `/feed?${query}` : '/feed';
}

function isActive(current: string | undefined, value: string | undefined) {
  return (current ?? '') === (value ?? '');
}

export default async function FeedPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const current = (await searchParams) ?? {};
  const feed = await api.members.feed().catch(() => []);
  const range = current.range === '30d' ? '30d' : '7d';
  const cohortFilter = current.cohort;
  const trackFilter = current.track;

  const now = Date.now();
  const filtered = feed.filter((item) => {
    const diffDays = (now - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (range === '7d' && diffDays > 7) return false;
    if (range === '30d' && diffDays > 30) return false;

    if (cohortFilter && String(item.member.cohort ?? '') !== cohortFilter) {
      return false;
    }

    if (trackFilter && !item.member.tracks.includes(trackFilter as 'frontend' | 'backend' | 'android')) {
      return false;
    }

    return true;
  });

  const topCrew = Object.values(
    filtered.reduce<Record<string, { nickname: string; count: number }>>((acc, item) => {
      const key = item.member.githubId;
      const currentCrew = acc[key];
      if (currentCrew) {
        currentCrew.count += 1;
      } else {
        acc[key] = { nickname: item.member.nickname, count: 1 };
      }
      return acc;
    }, {}),
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const platformStats = Object.entries(
    filtered.reduce<Record<string, number>>((acc, item) => {
      const source = getBlogSource(item.url) ?? '기타';
      acc[source] = (acc[source] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const totalPlatformCount = platformStats.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <section className="min-w-0">
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
                최근 30일
              </Link>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5">
            <Link
              href={buildFeedHref(current, { cohort: undefined })}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                !cohortFilter
                  ? 'border-border bg-border text-text'
                  : 'border-border bg-surface text-text-muted hover:text-text'
              }`}
            >
              기수 전체
            </Link>
            {['8', '7'].map((cohort) => (
              <Link
                key={cohort}
                href={buildFeedHref(current, { cohort })}
                className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                  isActive(cohortFilter, cohort)
                    ? 'border-border bg-border text-text'
                    : 'border-border bg-surface text-text-muted hover:text-text'
                }`}
              >
                {cohort}기
              </Link>
            ))}
            <div className="mx-1 hidden h-6 w-px bg-border lg:block" />
            <Link
              href={buildFeedHref(current, { track: undefined })}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                !trackFilter
                  ? 'border-border bg-border text-text'
                  : 'border-border bg-surface text-text-muted hover:text-text'
              }`}
            >
              전체 트랙
            </Link>
            {[
              ['frontend', '프론트엔드'],
              ['backend', '백엔드'],
              ['android', '안드로이드'],
            ].map(([value, label]) => (
              <Link
                key={value}
                href={buildFeedHref(current, { track: value })}
                className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                  isActive(trackFilter, value)
                    ? 'border-border bg-border text-text'
                    : 'border-border bg-surface text-text-muted hover:text-text'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-[14px] text-text-muted">조건에 맞는 블로그 글이 없습니다</div>
            ) : (
              filtered.map((item) => {
                const source = getBlogSource(item.url);
                return (
                  <a
                    key={`${item.url}-${item.publishedAt}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 border-b border-border-dim px-4 py-3.5 transition-colors hover:bg-surface-alt last:border-b-0"
                  >
                    <Avatar
                      src={item.member.avatarUrl}
                      alt={item.member.nickname}
                      size={30}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="mb-1.5 line-clamp-2 text-[14px] font-medium leading-5 text-text">{item.title}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-text-secondary">
                        <span>{item.member.nickname}</span>
                        <span className="text-text-dim">·</span>
                        <span>{formatRelativeDate(item.publishedAt)}</span>
                        {item.member.cohort && <CohortBadge cohort={item.member.cohort} />}
                        {item.member.tracks.map((t) => (
                          <TrackBadge key={t} track={t} />
                        ))}
                      </div>
                    </div>
                    {source && (
                      <span className="mt-0.5 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
                        {source}
                      </span>
                    )}
                  </a>
                );
              })
            )}
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-7 border-l border-border pl-5">
            <section>
              <h2 className="mb-4 text-[12px] font-semibold text-text-secondary">이번 달 활발한 크루</h2>
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
                        <span className="h-7 w-7 rounded-full border border-border bg-surface-alt" />
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
