import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeDate } from '@/lib/utils';
import type { FeedItem } from '@/types';

interface Props {
  staffPosts: FeedItem[];
  platformStats: [string, number][];
}

export function FeedSidebar({ staffPosts, platformStats }: Props) {
  const totalPlatformCount = platformStats.reduce((sum, [, c]) => sum + c, 0);

  return (
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
  );
}
