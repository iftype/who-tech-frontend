import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cohortsQuery, parseCohortNumber, parseTrack } from '@/entities/member';
import { feedQuery, parseRange, rangeToDays } from '@/entities/post';
import { makeQueryClient } from '@/shared/api';
import { PageContainer } from '@/shared/ui';
import { FeedClient } from '@/widgets/feed';

// 피드 첫 페이지와 기수 목록을 서버에서 미리 받아 캐시째(dehydrate) 내려 준다.
// prefetch는 실패해도 throw하지 않고, 실패한 쿼리는 dehydrate에 실리지 않는다 → 화면이 마운트 후 다시 받는다
export default async function HomePage(props: {
  searchParams?: Promise<{ cohort?: string; track?: string; range?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cohort = parseCohortNumber(searchParams?.cohort);
  const track = parseTrack(searchParams?.track);
  const range = parseRange(searchParams?.range);

  const queryClient = makeQueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery(feedQuery(rangeToDays(range), track, cohort)),
    queryClient.prefetchQuery(cohortsQuery()),
  ]);

  return (
    <PageContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FeedClient initialCohort={cohort} initialTrack={track} initialRange={range} />
      </HydrationBoundary>
    </PageContainer>
  );
}
