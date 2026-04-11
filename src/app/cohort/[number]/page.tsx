import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CohortExplorer } from '@/features/cohort/CohortExplorer';

export const revalidate = 300;

interface Props {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `${number}기 크루 목록` };
}

export default async function CohortPage({ params }: Props) {
  const { number } = await params;
  const cohort = Number(number);
  const members = await api.members.search({}, { next: { revalidate: 300 } }).catch(() => []);

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 sm:py-10" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
      <CohortExplorer members={members} initialCohort={cohort} />
    </div>
  );
}
