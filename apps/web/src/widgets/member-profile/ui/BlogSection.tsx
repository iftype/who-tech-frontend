import { useQuery } from '@tanstack/react-query';
import { memberPostsQuery } from '@/entities/post';
import { cn, formatDate, formatRelativeDate } from '@/shared/lib/utils';
import { ClockIcon, ErrorState, linkVariants } from '@/shared/ui';

interface BlogSectionProps {
  githubId: string;
  lastPostedAt: string | null;
}

// 블로그 글 탭: 글 목록(제목은 API 계층이 이미 HTML 엔티티를 풀어 준다)과 마지막 게시 시각
export function BlogSection({ githubId, lastPostedAt }: BlogSectionProps) {
  const { data: blogPosts, isLoading, isError, refetch } = useQuery(memberPostsQuery(githubId));

  if (isLoading) {
    return <p className="py-8 text-body-sm text-text-muted">블로그 글을 불러오는 중...</p>;
  }

  if (isError) {
    return <ErrorState frame="plain" onRetry={() => void refetch()} />;
  }

  if (!blogPosts) {
    return <p className="py-8 text-body-sm text-text-muted">등록된 블로그 글이 없습니다</p>;
  }

  const { archive: archivePosts } = blogPosts;

  return (
    <div className="flex flex-col gap-4">
      {archivePosts.length === 0 ? (
        <p className="text-body-sm text-text-muted">등록된 블로그 글이 없습니다</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border-dim border border-border rounded-lg overflow-hidden bg-surface">
            {archivePosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  linkVariants({ variant: 'row' }),
                  'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1',
                )}
              >
                <p className="text-body-sm font-medium text-text line-clamp-2">{post.title}</p>
                <p className="text-caption text-text-dim sm:shrink-0">{formatDate(post.publishedAt)}</p>
              </a>
            ))}
          </div>

          {lastPostedAt && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border-dim bg-surface text-caption text-text-muted">
              <ClockIcon className="w-3 h-3" />
              마지막 게시: {formatRelativeDate(lastPostedAt)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
