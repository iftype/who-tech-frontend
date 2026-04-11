import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import type { Role, Track } from '@/types';

interface Props {
  tracks: Track[];
  cohort: number | null;
  roles: Role[];
}

export function MemberBadges({ tracks, cohort, roles }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {tracks.map((t) => (
        <TrackBadge key={t} track={t} />
      ))}
      {cohort != null && <CohortBadge cohort={cohort} />}
      {roles
        .filter((r) => r !== 'crew')
        .map((r) => (
          <RoleBadge key={r} role={r} />
        ))}
    </div>
  );
}
