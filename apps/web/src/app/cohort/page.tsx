import type { Metadata } from 'next';
import { memberApi } from '@/entities/member';
import { CohortExplorer } from '@/features/cohort/CohortExplorer';

export const revalidate = 300;

export const metadata: Metadata = { title: 'who.tech' };

export default async function CohortAllPage({
  searchParams,
}: {
  searchParams?: Promise<{ roleGroup?: string; track?: string }>;
}) {
  const sp = await searchParams;
  const roleGroup = sp?.roleGroup === 'staff' ? 'staff' : 'crew';
  const track = (sp?.track as 'frontend' | 'backend' | 'android' | 'all' | undefined) ?? 'all';
  const [memberPage, allCohorts] = await Promise.all([
    memberApi
      .searchPage({ ...(track !== 'all' ? { track } : {}), roleGroup, limit: 120 }, { next: { revalidate: 300 } })
      .catch(() => ({ members: [], totalCount: 0, counts: { crew: 0, staff: 0 }, nextOffset: null })),
    memberApi.cohorts().catch(() => []),
  ]);

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <CohortExplorer
        initialPage={memberPage}
        allCohorts={allCohorts}
        initialCohort={null}
        initialRoleGroup={roleGroup}
        initialTrack={track}
      />
    </div>
  );
}
