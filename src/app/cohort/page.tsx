import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CohortFilters } from '@/features/cohort/CohortFilters';
import { CohortTabBar } from '@/features/cohort/CohortTabBar';

export const metadata: Metadata = { title: '전체 크루 목록' };

export default async function CohortAllPage() {
  const members = await api.members.search({}).catch(() => []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      <CohortTabBar activeCohort={null} />
      <CohortFilters members={members} cohort={0} />
    </div>
  );
}
