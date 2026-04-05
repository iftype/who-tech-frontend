import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CohortExplorer } from '@/features/cohort/CohortExplorer';

export const revalidate = 300;

export const metadata: Metadata = { title: '전체 크루 목록' };

export default async function CohortAllPage() {
  const members = await api.members.search({}, { next: { revalidate: 300 } }).catch(() => []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      <CohortExplorer members={members} initialCohort={null} />
    </div>
  );
}
