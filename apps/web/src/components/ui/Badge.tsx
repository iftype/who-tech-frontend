import { cn } from '@/lib/utils';
import type { Role, Track } from '@/entities/member';

interface CohortBadgeProps {
  cohort: number;
}
export function CohortBadge({ cohort }: CohortBadgeProps) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-caption font-mono font-medium text-accent-dm border border-accent-border bg-accent-bg">
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
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-caption font-medium text-text-secondary border border-border bg-surface">
      {roleLabel[role]}
    </span>
  );
}

const trackLabel: Record<Track, string> = { frontend: '프론트엔드', backend: '백엔드', android: '안드로이드' };
const trackShortLabel: Record<Track, string> = { frontend: 'FE', backend: 'BE', android: 'AN' };
interface TrackBadgeProps {
  track: Track;
  compact?: boolean;
}
export function TrackBadge({ track, compact }: TrackBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-caption font-medium border',
        track === 'frontend' && 'text-track-frontend border-track-frontend/20 bg-track-frontend/10',
        track === 'backend' && 'text-track-backend border-track-backend/20 bg-track-backend/10',
        track === 'android' && 'text-track-android border-track-android/20 bg-track-android/10',
      )}
    >
      {compact ? trackShortLabel[track] : trackLabel[track]}
    </span>
  );
}
