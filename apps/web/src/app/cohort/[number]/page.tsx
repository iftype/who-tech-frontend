import type { Metadata } from 'next';
import { memberApi, parseRoleGroup, parseTrackOrAll } from '@/entities/member';
import { CohortExplorer } from '@/widgets/cohort-explorer/CohortExplorer';
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
  const [memberPage, allCohorts] = await Promise.all([
    memberApi
      .searchPage(
        { cohort, ...(track !== 'all' ? { track } : {}), roleGroup, limit: 120 },
        { next: { revalidate: 300 } },
      )
      .catch(() => ({ members: [], totalCount: 0, counts: { crew: 0, staff: 0 }, nextOffset: null })),
    memberApi.cohorts().catch(() => []),
  ]);

  return (
    <PageContainer>
      <CohortExplorer
        initialPage={memberPage}
        allCohorts={allCohorts}
        initialCohort={cohort}
        initialRoleGroup={roleGroup}
        initialTrack={track}
      />
    </PageContainer>
  );
}
