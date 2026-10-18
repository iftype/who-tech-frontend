import type { Member } from '@/entities/member';
import { CohortBadge, RoleBadge, TrackBadge } from '@/entities/member';
import { cn } from '@/shared/lib/utils';
import { Avatar } from '@/shared/ui';

interface SearchResultItemProps {
  member: Member;
  active: boolean;
  onSelect: () => void;
}

// 검색 결과 한 줄: 아바타·닉네임·GitHub ID와 기수·역할·트랙 배지
export function SearchResultItem({ member, active, onSelect }: SearchResultItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0',
        active ? 'bg-surface-alt' : 'hover:bg-surface-alt',
      )}
    >
      <Avatar src={member.avatarUrl} alt={member.nickname} size={32} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-body-sm font-medium text-text">{member.nickname}</span>
          <span className="text-label text-text-muted font-mono">@{member.githubId}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {member.cohort && <CohortBadge cohort={member.cohort} />}
        {member.roles
          .filter((r) => r !== 'crew')
          .map((r) => (
            <RoleBadge key={r} role={r} />
          ))}
        {member.tracks.map((t) => (
          <TrackBadge key={t} track={t} />
        ))}
      </div>
    </button>
  );
}
