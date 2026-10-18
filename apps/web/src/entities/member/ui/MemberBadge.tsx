import { Badge } from '@/shared/ui';
import type { Role, Track } from '../model/types';

export function CohortBadge({ cohort }: { cohort: number }) {
  return <Badge tone="accent">{cohort}기</Badge>;
}

const roleLabel: Record<Role, string> = { crew: '크루', coach: '코치', reviewer: '리뷰어' };

export function RoleBadge({ role }: { role: Role }) {
  return <Badge tone="neutral">{roleLabel[role]}</Badge>;
}

const trackLabel: Record<Track, string> = { frontend: '프론트엔드', backend: '백엔드', android: '안드로이드' };
const trackShortLabel: Record<Track, string> = { frontend: 'FE', backend: 'BE', android: 'AN' };

export function TrackBadge({ track, compact }: { track: Track; compact?: boolean }) {
  return <Badge tone={track}>{compact ? trackShortLabel[track] : trackLabel[track]}</Badge>;
}
