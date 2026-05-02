import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CohortExplorer } from '@/features/cohort/CohortExplorer';

export const revalidate = 300;

interface Props {
  params: Promise<{ number: string }>;
  searchParams?: Promise<{ roleGroup?: string; track?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `${number}기 크루 목록` };
}

export default async function CohortPage({ params, searchParams }: Props) {
  const { number } = await params;
  const cohort = Number(number);
  const [members, allCohorts] = await Promise.all([
    api.members.search({ cohort }, { next: { revalidate: 300 } }).catch(() => []),
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
        initialCohort={cohort}
        initialRoleGroup={roleGroup}
        initialTrack={track}
      />
    </div>
  );
}
