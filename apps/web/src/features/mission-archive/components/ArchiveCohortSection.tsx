import type { ReactNode } from 'react';
import type { CohortArchive } from '@/entities/member';
import { ArchiveRepoList } from './ArchiveRepoList';
import { Divider, SectionLabel } from '@/shared/ui';

interface ArchiveCohortSectionProps {
  cohortArchive: CohortArchive;
  showCohortTitle: boolean;
  githubId: string;
}

export function ArchiveCohortSection({ cohortArchive, showCohortTitle, githubId }: ArchiveCohortSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      {showCohortTitle && <CohortTitle cohort={cohortArchive.cohort} />}
      <ArchiveLevelList>
        {cohortArchive.levels.map((level) => (
          <ArchiveLevelSection key={level.level ?? 'null'}>
            <LevelTitle level={level.level} />
            <ArchiveRepoList repos={level.repos} githubId={githubId} />
          </ArchiveLevelSection>
        ))}
      </ArchiveLevelList>
    </div>
  );
}

interface ArchiveLevelListProps {
  children: ReactNode;
}

function ArchiveLevelList({ children }: ArchiveLevelListProps) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

interface ArchiveLevelSectionProps {
  children: ReactNode;
}

function ArchiveLevelSection({ children }: ArchiveLevelSectionProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

interface LevelTitleProps {
  level: number | null;
}

function LevelTitle({ level }: LevelTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <SectionLabel>Level {level ?? '–'}</SectionLabel>
      <Divider />
    </div>
  );
}

interface CohortTitleProps {
  cohort: number;
}

function CohortTitle({ cohort }: CohortTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <Divider />
      <span className="rounded-full border border-border-dim bg-surface-alt px-3 py-1 text-label font-bold text-text-secondary shadow-sm">
        {cohort}기 미션
      </span>
      <Divider />
    </div>
  );
}
