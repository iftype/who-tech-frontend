import type { Metadata } from 'next';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cohortMembersQuery, cohortsQuery, parseRoleGroup, parseTrackOrAll } from '@/entities/member';
import { CohortExplorer } from '@/widgets/cohort-explorer/CohortExplorer';
import { makeQueryClient } from '@/shared/api/query-client';
import { PageContainer } from '@/shared/ui';

export const metadata: Metadata = { title: 'who.tech' };

export default async function CohortAllPage({
  searchParams,
}: {
  searchParams?: Promise<{ roleGroup?: string; track?: string }>;
}) {
  const sp = await searchParams;
  const roleGroup = parseRoleGroup(sp?.roleGroup);
  const track = parseTrackOrAll(sp?.track);

  const queryClient = makeQueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery(cohortMembersQuery(null, track, roleGroup)),
    queryClient.prefetchQuery(cohortsQuery()),
  ]);

  return (
    <PageContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CohortExplorer initialCohort={null} initialRoleGroup={roleGroup} initialTrack={track} />
      </HydrationBoundary>
    </PageContainer>
  );
}
