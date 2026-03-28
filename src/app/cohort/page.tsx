import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CohortFilters } from '@/features/cohort/CohortFilters';

export const metadata: Metadata = { title: '전체 크루 목록' };

const COHORTS = [8, 7, 6, 5, 4, 3, 2, 1];

export default async function CohortAllPage() {
  const members = await api.members.search({}).catch(() => []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      {/* Cohort Tab Bar */}
      <div className="mb-5 overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1 sm:gap-0">
          <Link
            href="/cohort"
            className="-mb-px rounded-t-md border-b-2 border-accent-dm px-4 py-2.5 text-[13px] font-medium whitespace-nowrap text-accent-dm transition-colors sm:rounded-none sm:px-4 sm:py-2"
          >
            전체
          </Link>
          {COHORTS.map((c) => (
            <Link
              key={c}
              href={`/cohort/${c}`}
              className="-mb-px rounded-t-md border-b-2 border-transparent px-4 py-2.5 text-[13px] font-medium whitespace-nowrap text-text-muted transition-colors hover:text-text sm:rounded-none sm:px-4 sm:py-2"
            >
              {c}기
            </Link>
          ))}
        </div>
      </div>

      {/* Heading */}
      <div className="mb-5">
        <h1 className="text-[22px] font-bold tracking-tight text-text sm:text-[24px]">전체 크루</h1>
        <p className="mt-1 text-[12px] text-text-muted">우아한테크코스 전체 멤버 목록</p>
      </div>

      <CohortFilters members={members} cohort={0} />
    </div>
  );
}
