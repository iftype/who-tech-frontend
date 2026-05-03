import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import type { Role, Track } from '@/types';

interface Props {
  tracks: Track[];
  cohort: number | null;
  roles: Role[];
}

interface Props {
  tracks: Track[];
  cohort: number | null;
  roles: Role[];
  cohorts?: { cohort: number; roles: Role[] }[];
}

export function MemberBadges({ tracks, cohort, roles, cohorts }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {tracks.map((t) => (
        <TrackBadge key={t} track={t} />
      ))}
      {(cohorts ?? []).length > 0 ? (
        cohorts!.map((c) => (
          <span key={c.cohort} className="inline-flex items-center gap-1">
            <CohortBadge cohort={c.cohort} />
            {c.roles
              .filter((r) => r !== 'crew')
              .map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
          </span>
        ))
      ) : (
        <>
          {cohort != null && <CohortBadge cohort={cohort} />}
          {roles
            .filter((r) => r !== 'crew')
            .map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
        </>
      )}
    </div>
  );
}
