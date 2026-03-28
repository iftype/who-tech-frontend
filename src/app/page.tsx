import { SearchDropdown } from '@/features/search/SearchDropdown';
import { api } from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';

export default async function HomePage() {
  const feed = await api.members.feed().catch(() => []);
  const recent = feed.slice(0, 5);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-6 mb-16">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent-border bg-accent-bg text-[11px] font-mono text-accent-dm">
          우아한테크코스
        </span>
        <h1 className="text-[52px] font-bold leading-[1.1] tracking-tight text-text max-w-[700px]">
          크루를 검색하고
          <br />
          여정을 탐색하세요
        </h1>
        <p className="text-[17px] text-text-secondary max-w-[480px] leading-relaxed">
          미션 PR 아카이브, 블로그 피드, 기수별 크루 목록을 한곳에서
        </p>
        <SearchDropdown />
      </div>

      {/* Bottom: Recent Activity */}
      {recent.length > 0 && (
        <div className="max-w-[560px] mx-auto">
          <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-text-muted mb-3">최근 블로그 글</p>
          <div className="flex flex-col divide-y divide-border-dim border border-border rounded-lg overflow-hidden bg-surface">
            {recent.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface-alt transition-colors"
              >
                <Avatar src={item.member.avatarUrl} alt={item.member.nickname} size={28} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text truncate">{item.title}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{item.member.nickname}</p>
                </div>
                <span className="text-[11px] text-text-dim flex-shrink-0 mt-0.5">
                  {formatRelativeDate(item.publishedAt)}
                </span>
              </a>
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link href="/feed" className="text-[12px] text-text-muted hover:text-accent-dm transition-colors">
              전체 피드 보기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
