import { TecoTalkBadge, TrackBadge, githubProfileUrl } from '@/entities/member';
import type { MemberDetail } from '@/entities/member';
import { RefreshButton } from '@/features/profile-refresh/RefreshButton';
import { Avatar } from '@/shared/ui';
import { CohortRolePill } from './ui/CohortRolePill';
import { ProfileLinks } from './ui/ProfileLinks';

interface ProfileHeaderProps {
  member: MemberDetail;
  /** 상세 캐시 키의 아이디 (URL의 아이디. 예전 아이디로 들어온 경우 member.githubId와 다르다) */
  detailId: string;
}

// 상세 상단: 아바타 · 닉네임/아이디/새로고침 · 기수별 역할 · 트랙 · 바로가기 · 테코톡
export function ProfileHeader({ member, detailId }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-5 pb-5 sm:pb-8 border-b border-border-dim">
      <a
        href={githubProfileUrl(member.githubId)}
        target="_blank"
        rel="noopener noreferrer"
        className="block shrink-0 transition-transform duration-200 hover:scale-105"
        title={`${member.nickname}의 GitHub 프로필 방문`}
      >
        <Avatar
          src={member.avatarUrl}
          alt={member.nickname}
          size={80}
          responsive
          className="w-12 h-12 sm:w-20 sm:h-20"
        />
      </a>
      <div className="flex flex-col gap-1 sm:gap-2 min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-1.5 sm:gap-2">
            <h1 className="text-title-xs sm:text-headline font-bold text-text leading-tight">{member.nickname}</h1>
            <span className="font-mono text-caption sm:text-body text-text-muted truncate max-w-[140px] sm:max-w-none">
              @{member.githubId}
            </span>
            <RefreshButton githubId={member.githubId} detailId={detailId} />
          </div>
          <ProfileLinks member={member} className="inline-flex sm:hidden" />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {member.cohorts.map((mc) => (
            <CohortRolePill key={mc.cohort} cohort={mc.cohort} roles={mc.roles} />
          ))}
          <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 ml-0.5 sm:ml-1 border-l border-border-dim">
            {member.tracks.map((t) => (
              <TrackBadge key={t} track={t} />
            ))}
          </div>
          <ProfileLinks member={member} className="hidden sm:inline-flex" />
        </div>
        {member.tecoTalks && member.tecoTalks.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5 sm:mt-1">
            <span className="text-caption text-text-muted">테코톡</span>
            {member.tecoTalks.map((talk) => (
              <TecoTalkBadge key={talk.id} talk={talk} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
