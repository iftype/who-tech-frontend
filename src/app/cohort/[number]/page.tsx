import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CohortFilters } from '@/features/cohort/CohortFilters';
import { CohortTabBar } from '@/features/cohort/CohortTabBar';

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
  const members = await api.members.search({ cohort }).catch(() => []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      <CohortTabBar activeCohort={cohort} />
      <CohortFilters members={members} cohort={cohort} />
    </div>
  );
}
