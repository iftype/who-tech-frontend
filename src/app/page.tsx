import { SearchDropdown } from '@/features/search/SearchDropdown';
import { api } from '@/lib/api';
import { formatRelativeDate, getBlogSource } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge } from '@/components/ui/Badge';
import Link from 'next/link';

export default async function HomePage() {
  const feed = await api.members.feed().catch(() => []);
  const pick = feed[0] ?? null;
  const recent = feed.slice(1, 6);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4 py-14 text-center sm:gap-5 sm:py-24">
        <span className="inline-flex items-center rounded-full border border-accent-border bg-accent-bg px-3 py-1 font-mono text-[11px] text-accent-dm">
          우아한테크코스
        </span>
        <h1 className="max-w-[620px] text-[38px] font-bold leading-[1.1] tracking-tight text-text sm:text-[56px]">
          크루를 찾아보세요
        </h1>
        <p className="hidden max-w-[420px] leading-relaxed text-[15px] text-text-secondary sm:block">
          닉네임 또는 GitHub ID로 크루를 검색하고 미션 PR과 블로그를 한눈에 확인하세요
        </p>
        <SearchDropdown />
      </div>

      {/* Bottom: Pick of the Week + Recent Activity */}
      {feed.length > 0 && (
        <div className="grid gap-6 pb-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10 lg:pb-16">
          {/* Pick of the Week */}
          {pick && (
            <section>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                Pick of the Week
              </p>
              <div className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/30 hover:bg-surface-alt">
                {/* Author row */}
                <div className="mb-5 flex items-center gap-2.5">
                  <a
                    href={`https://github.com/${pick.member.githubId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Avatar src={pick.member.avatarUrl} alt={pick.member.nickname} size={28} />
                  </a>
                  <Link href={`/${pick.member.githubId}`} className="text-[13px] font-medium text-text hover:underline">
                    {pick.member.nickname}
                  </Link>
                  {pick.member.cohort && <CohortBadge cohort={pick.member.cohort} />}
                  {(() => {
                    const src = getBlogSource(pick.url);
                    return src ? (
                      <span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
                        {src}
                      </span>
                    ) : null;
                  })()}
                </div>

                {/* Title */}
                <a href={pick.url} target="_blank" rel="noopener noreferrer">
                  <h2 className="mb-4 text-[20px] font-bold leading-snug tracking-tight text-text line-clamp-3 hover:underline sm:text-[24px]">
                    {pick.title}
                  </h2>
                </a>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <a
                    href={pick.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] text-accent-dm transition-opacity group-hover:opacity-70"
                  >
                    읽기 →
                  </a>
                  <span className="text-[12px] text-text-dim">{formatRelativeDate(pick.publishedAt)}</span>
                </div>
              </div>
            </section>
          )}

          {/* Recent Activity */}
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Recent Activity
            </p>
            <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
              {recent.map((item) => {
                const source = getBlogSource(item.url);
                return (
                  <div
                    key={`${item.url}-${item.publishedAt}`}
                    className="flex items-start gap-3 border-b border-border-dim px-4 py-3 transition-colors hover:bg-surface-alt last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="line-clamp-2 text-[13px] font-medium leading-5 text-text hover:underline"
                      >
                        {item.title}
                      </a>
                      <p className="mt-0.5 text-[11px] text-text-muted">
                        <Link href={`/${item.member.githubId}`} className="hover:underline">
                          {item.member.nickname}
                        </Link>
                        <span className="mx-1 text-text-dim">·</span>
                        {formatRelativeDate(item.publishedAt)}
                      </p>
                    </div>
                    {source && (
                      <span className="mt-0.5 flex-shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
                        {source}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-right">
              <Link href="/feed" className="text-[12px] text-text-muted transition-colors hover:text-accent-dm">
                전체 피드 보기 →
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
