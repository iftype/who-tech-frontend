import Link from 'next/link';
import { MemberBadgeSet, githubProfileUrl, memberPath } from '@/entities/member';
import { staggerFadeIn } from '@/shared/lib/animation';
import { formatRelativeDate } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';
import { Avatar, linkVariants } from '@/shared/ui';
import { postVisitPath } from '../model/links';
import { getBlogSource } from '../model/source';
import type { FeedItem } from '../model/types';

// 카드 전체 링크 위에 올라가는 작은 링크(작성자·출처). z-10으로 카드 링크보다 위에 둔다
const META_LINK_CLASS = cn(linkVariants({ variant: 'muted', size: 'bodySm' }), 'relative z-10');

// 피드 한 줄: 아바타 · 제목(카드 전체 링크) · 작성자와 배지 · 날짜 · 출처 칩
export function FeedRow({ item, index }: { item: FeedItem; index?: number }) {
  const source = getBlogSource(item.url);
  return (
    <div
      className="relative flex items-start gap-3 border-b border-border-dim px-4 py-3.5 hover:bg-surface-alt last:border-b-0"
      style={index != null ? staggerFadeIn(index) : undefined}
    >
      <div className="relative z-10 mt-0.5 flex flex-shrink-0">
        <a href={authorHomeUrl(item)} target="_blank" rel="noopener noreferrer">
          <Avatar src={item.member.avatarUrl} alt={item.member.nickname} size={30} />
        </a>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5">
          <a
            href={postVisitPath(item.id)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(linkVariants({ variant: 'text', size: 'body', stretched: true }), 'break-all')}
          >
            {item.title}
          </a>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-label">
          <div className="flex flex-wrap items-center gap-1.5">
            <AuthorName item={item} />
            <div className="flex flex-wrap items-center gap-1">
              <MemberBadgeSet member={item.member} />
            </div>
          </div>
          <span className="ml-auto flex-shrink-0 text-text-muted sm:ml-0">{formatRelativeDate(item.publishedAt)}</span>
        </div>
      </div>
      {source && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            linkVariants({ variant: 'chip', size: 'tiny' }),
            'relative z-10 mt-0.5 hidden flex-shrink-0 sm:inline-flex',
          )}
        >
          {source}
        </a>
      )}
    </div>
  );
}

// 팀 블로그는 블로그 주소(없으면 글 주소), 멤버는 GitHub 프로필
function authorHomeUrl(item: FeedItem): string {
  return item.member.isTeamBlog ? (item.member.blog ?? item.url) : githubProfileUrl(item.member.githubId);
}

// 팀 블로그는 바깥 링크, 멤버는 상세 페이지 링크
function AuthorName({ item }: { item: FeedItem }) {
  if (item.member.isTeamBlog) {
    return (
      <a href={item.member.blog ?? item.url} target="_blank" rel="noopener noreferrer" className={META_LINK_CLASS}>
        {item.member.nickname}
      </a>
    );
  }
  return (
    <Link href={memberPath(item.member.githubId)} className={META_LINK_CLASS}>
      {item.member.nickname}
    </Link>
  );
}
