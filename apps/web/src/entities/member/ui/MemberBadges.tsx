import { Badge } from '@/shared/ui';
import { ROLE_LABEL, TRACK_LABEL, TRACK_SHORT_LABEL } from '../model/labels';
import type { Role, Track } from '../model/types';

export function CohortBadge({ cohort }: { cohort: number }) {
  return <Badge tone="accent">{cohort}기</Badge>;
}

export function RoleBadge({ role }: { role: Role }) {
  return <Badge tone="neutral">{ROLE_LABEL[role]}</Badge>;
}

// track이 없을 때(트랙 없는 멤버의 첫 트랙)도 지금 화면 그대로 빈 배지를 그린다. 숨길지는 화면 변경으로 따로 판단
export function TrackBadge({ track, compact }: { track: Track | undefined; compact?: boolean }) {
  const label = track ? (compact ? TRACK_SHORT_LABEL[track] : TRACK_LABEL[track]) : undefined;
  return <Badge tone={track}>{label}</Badge>;
}
