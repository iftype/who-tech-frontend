import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CohortExplorer } from '@/features/cohort/CohortExplorer';

export const revalidate = 300;

export const metadata: Metadata = { title: '전체 크루 목록' };

export default async function CohortAllPage({
  searchParams,
}: {
  searchParams?: Promise<{ roleGroup?: string; track?: string }>;
}) {
  const [members, allCohorts] = await Promise.all([
    api.members.search({}, { next: { revalidate: 300 } }).catch(() => []),
    api.members.cohorts().catch(() => []),
  ]);
  const sp = await searchParams;
  const roleGroup = sp?.roleGroup === 'staff' ? 'staff' : 'crew';
  const track = (sp?.track as 'frontend' | 'backend' | 'android' | 'all' | undefined) ?? 'all';

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <CohortExplorer
        members={members}
        allCohorts={allCohorts}
        initialCohort={null}
        initialRoleGroup={roleGroup}
        initialTrack={track}
      />
    </div>
  );
}
