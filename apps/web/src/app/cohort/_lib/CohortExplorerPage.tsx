import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cohortMembersQuery, cohortsQuery, parseRoleGroup, parseTrackOrAll } from '@/entities/member';
import { CohortExplorer } from '@/widgets/cohort-explorer/CohortExplorer';
import { makeQueryClient } from '@/shared/api';
import { PageContainer } from '@/shared/ui';

export type CohortSearchParams = { roleGroup?: string; track?: string };

interface CohortExplorerPageProps {
  /** null = 전체 기수 */
  cohort: number | null;
  searchParams: CohortSearchParams | undefined;
}

// /cohort 와 /cohort/[number] 가 공유하는 페이지 본문: 파싱 → prefetch → 하이드레이션.
// prefetch는 실패해도 throw하지 않고, 실패한 쿼리는 dehydrate에 실리지 않는다 → 화면이 마운트 후 다시 받는다
export async function CohortExplorerPage({ cohort, searchParams }: CohortExplorerPageProps) {
  const roleGroup = parseRoleGroup(searchParams?.roleGroup);
  const track = parseTrackOrAll(searchParams?.track);

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
