import type { Metadata } from 'next';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cohortMembersQuery, cohortsQuery, parseRoleGroup, parseTrackOrAll } from '@/entities/member';
import { CohortExplorer } from '@/widgets/cohort-explorer/CohortExplorer';
import { makeQueryClient } from '@/shared/api/query-client';
import { PageContainer } from '@/shared/ui';

export const revalidate = 300;

interface CohortPageProps {
  params: Promise<{ number: string }>;
  searchParams?: Promise<{ roleGroup?: string; track?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'who.tech' };
}

export default async function CohortPage({ params, searchParams }: CohortPageProps) {
  const { number } = await params;
  const cohort = Number(number);
  const sp = await searchParams;
  const roleGroup = parseRoleGroup(sp?.roleGroup);
  const track = parseTrackOrAll(sp?.track);

  const queryClient = makeQueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery(cohortMembersQuery(cohort, track, roleGroup)),
    queryClient.prefetchQuery(cohortsQuery()),
  ]);

  return (
    <PageContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CohortExplorer initialCohort={cohort} initialRoleGroup={roleGroup} initialTrack={track} />
      </HydrationBoundary>
    </PageContainer>
  );
}
