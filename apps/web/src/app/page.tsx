import { memberApi, parseTrack } from '@/entities/member';
import { parseRange, postApi, rangeToDays } from '@/entities/post';
import { FeedClient } from '@/widgets/feed/FeedClient';
import { PageContainer } from '@/shared/ui';

export default async function HomePage(props: {
  searchParams?: Promise<{ cohort?: string; track?: string; range?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cohort = searchParams?.cohort ? Number(searchParams.cohort) : undefined;
  const track = parseTrack(searchParams?.track);
  const range = parseRange(searchParams?.range);
  const days = rangeToDays(range);

  const [feed, allCohorts] = await Promise.all([
    postApi
      .feed({ ...(days ? { days } : {}), ...(cohort ? { cohort } : {}), ...(track ? { track } : {}), limit: 50 })
      .catch(() => ({ posts: [], nextCursor: null, totalCount: 0 })),
    memberApi.cohorts().catch(() => []),
  ]);

  return (
    <PageContainer>
      <FeedClient
        initialItems={feed.posts}
        initialNextCursor={feed.nextCursor}
        initialTotalCount={feed.totalCount}
        initialCohorts={allCohorts}
        initialCohort={searchParams?.cohort ?? null}
        initialTrack={track}
        initialRange={range}
      />
    </PageContainer>
  );
}
