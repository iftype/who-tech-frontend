import { cn } from '@/lib/utils';
import type { Role, Track } from '@/types';

interface CohortBadgeProps {
  cohort: number;
}
export function CohortBadge({ cohort }: CohortBadgeProps) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-accent-dm border border-accent-border bg-accent-bg">
      {cohort}기
    </span>
  );
}

const roleLabel: Record<Role, string> = { crew: '크루', coach: '코치', reviewer: '리뷰어' };
interface RoleBadgeProps {
  role: Role;
}
export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium text-text-secondary border border-border bg-surface">
      {roleLabel[role]}
    </span>
  );
}

const trackLabel: Record<Track, string> = { frontend: '프론트엔드', backend: '백엔드', android: '안드로이드' };
interface TrackBadgeProps {
  track: Track;
}
export function TrackBadge({ track }: TrackBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border',
        track === 'frontend' && 'text-sky-400 border-sky-400/20 bg-sky-400/10',
        track === 'backend' && 'text-violet-400 border-violet-400/20 bg-violet-400/10',
        track === 'android' && 'text-green-400 border-green-400/20 bg-green-400/10',
      )}
    >
      {trackLabel[track]}
    </span>
  );
}
