import Link from 'next/link';
import { Avatar } from '@/shared/ui';
import { CohortBadge, RoleBadge, RoleBadges, TrackBadge, githubProfileUrl, nonCrewRoles } from '@/entities/member';
import type { Member } from '@/entities/member';
import { staggerFadeIn } from '@/shared/lib/animation';
import { formatRelativeDate, getBlogSource } from '@/shared/lib/utils';
import type { FeedItem } from '../model/types';

// 카드 전체 링크 위에 올라가는 작은 링크(작성자·출처). z-10으로 카드 링크보다 위에 둔다
const META_LINK_CLASS = 'relative z-10 text-body-sm text-text-secondary hover:underline';

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
            href={`/api/members/blog-posts/${item.id}/visit`}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-body text-text hover:underline after:absolute after:inset-0 after:content-['']"
          >
            {item.title}
          </a>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-label">
          <div className="flex flex-wrap items-center gap-1.5">
            <AuthorName item={item} />
            <div className="flex flex-wrap items-center gap-1">
              <AuthorBadges member={item.member} />
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
          className="relative z-10 mt-0.5 hidden flex-shrink-0 rounded-md border border-border px-1.5 py-0.5 text-tiny text-text-muted hover:bg-surface-alt sm:inline-flex"
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
    <Link href={`/${item.member.githubId}`} className={META_LINK_CLASS}>
      {item.member.nickname}
    </Link>
  );
}

// 팀 블로그 → 팀 배지 하나. 멤버 → 트랙 + 기수별 역할 (cohorts가 없는 예전 응답은 대표 기수·역할로)
function AuthorBadges({ member }: { member: Member }) {
  if (member.isTeamBlog) {
    return (
      <span className="inline-flex items-center rounded-full border border-team-blog/50 bg-team-blog/15 px-1.5 py-0.5 text-tiny font-medium text-team-blog-text">
        팀 블로그
      </span>
    );
  }
  const cohorts = member.cohorts;
  return (
    <>
      <TrackBadge track={member.tracks[0]} compact />
      {cohorts && cohorts.length > 0 ? (
        cohorts.map((c) => {
          const hasCrew = c.roles.includes('crew');
          return (
            <span key={c.cohort} className="inline-flex items-center gap-1">
              <CohortBadge cohort={c.cohort} />
              {hasCrew && <RoleBadge role="crew" />}
              {!hasCrew && nonCrewRoles(c.roles).map((r) => <RoleBadge key={r} role={r} />)}
            </span>
          );
        })
      ) : (
        <>
          {member.cohort != null && <CohortBadge cohort={member.cohort} />}
          <RoleBadges roles={member.roles} hideCrew />
        </>
      )}
    </>
  );
}
