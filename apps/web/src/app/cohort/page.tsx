import type { Metadata } from 'next';
import { CohortExplorerPage, type CohortSearchParams } from './_lib/CohortExplorerPage';

export const metadata: Metadata = { title: 'who.tech' };

export default async function CohortAllPage({ searchParams }: { searchParams?: Promise<CohortSearchParams> }) {
  return <CohortExplorerPage cohort={null} searchParams={await searchParams} />;
}
