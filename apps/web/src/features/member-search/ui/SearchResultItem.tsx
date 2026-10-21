import type { Member } from '@/entities/member';
import { CohortBadge, RoleBadges, TrackBadge } from '@/entities/member';
import { Avatar, listItemVariants } from '@/shared/ui';

interface SearchResultItemProps {
  id: string;
  member: Member;
  active: boolean;
  onSelect: () => void;
}

// 검색 결과 한 줄: 아바타·닉네임·GitHub ID와 기수·역할·트랙 배지
// listbox의 option. 포커스는 입력창에 두고(aria-activedescendant) 마우스 클릭으로도 고를 수 있게 버튼을 쓴다
export function SearchResultItem({ id, member, active, onSelect }: SearchResultItemProps) {
  return (
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={active}
      tabIndex={-1}
      onClick={onSelect}
      className={listItemVariants({ active })}
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
        <RoleBadges roles={member.roles} hideCrew />
        {member.tracks.map((t) => (
          <TrackBadge key={t} track={t} />
        ))}
      </div>
    </button>
  );
}
