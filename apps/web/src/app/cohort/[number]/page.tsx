import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { parseCohortNumber } from '@/entities/member';
import { CohortExplorerPage, type CohortSearchParams } from '../_lib/CohortExplorerPage';

interface CohortPageProps {
  params: Promise<{ number: string }>;
  searchParams?: Promise<CohortSearchParams>;
}

export const metadata: Metadata = { title: 'who.tech' };

export default async function CohortPage({ params, searchParams }: CohortPageProps) {
  // /cohort/abc 처럼 숫자가 아니면 404 (예전엔 NaN이 API까지 흘러가 "NaN기 크루"를 그렸다)
  const cohort = parseCohortNumber((await params).number);
  if (cohort === null) notFound();

  return <CohortExplorerPage cohort={cohort} searchParams={await searchParams} />;
}
