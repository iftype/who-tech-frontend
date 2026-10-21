import { githubProfileUrl } from '@/entities/member';
import type { MemberDetail } from '@/entities/member';
import { cn } from '@/shared/lib/utils';
import { GitHubIcon, LinkIcon, buttonVariants } from '@/shared/ui';

interface ProfileLinksProps {
  member: Pick<MemberDetail, 'githubId' | 'blog'>;
  /** 표시 조건만 (모바일은 이름 옆, 데스크톱은 배지 줄 끝에 한 번씩 그린다) */
  className: string;
}

// GitHub·블로그 바로가기. 같은 링크 묶음이 화면 폭에 따라 다른 자리에 놓인다
export function ProfileLinks({ member, className }: ProfileLinksProps) {
  return (
    <div className={cn('shrink-0 items-center gap-1', className)}>
      <a
        href={githubProfileUrl(member.githubId)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants()}
      >
        <GitHubIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
      {member.blog && (
        <a href={member.blog} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
          <LinkIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">블로그</span>
        </a>
      )}
    </div>
  );
}
