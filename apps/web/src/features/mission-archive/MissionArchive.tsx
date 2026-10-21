'use client';

import { useMemo, useState } from 'react';
import { ArchiveCohortSection } from './components/ArchiveCohortSection';
import { MissionArchiveHeader } from './components/MissionArchiveHeader';
import { UNREGISTERED_COHORT } from './constants';
import type { MissionTab } from './types';
import { buildMarkdown, getFilteredArchives } from './utils';
import { urlStore } from '@/shared/lib/urlStore';
import type { CohortArchive, Track } from '@/entities/member';

interface MissionArchiveProps {
  archive: CohortArchive[];
  memberTracks: Track[];
  githubId: string;
  initialMissionTab: MissionTab;
}

export function MissionArchive({ archive = [], memberTracks, githubId, initialMissionTab }: MissionArchiveProps) {
  const [tab, setTab] = useState<MissionTab>(initialMissionTab);
  const [copied, setCopied] = useState(false);

  // URL 기록은 setState 갱신 함수 밖에서 한다 (갱신 함수는 순수해야 한다 — StrictMode에서 두 번 불린다)
  const applyFilters = (next: MissionTab) => {
    setTab(next);
    urlStore.replaceParam('missionTab', next);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMarkdown(archive, tab, githubId, memberTracks));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredArchives = useMemo(() => getFilteredArchives(archive, tab, memberTracks), [archive, tab, memberTracks]);

  return (
    <div className="flex flex-col gap-5">
      <MissionArchiveHeader tab={tab} copied={copied} onTabChange={applyFilters} onCopy={handleCopy} />

      {filteredArchives.length === 0 ? (
        <p className="py-8 text-left text-body-sm text-text-muted">미션 제출 기록이 없습니다</p>
      ) : (
        <div className="flex flex-col gap-10">
          {filteredArchives.map((ca) => {
            const isRegisteredCohortArchive = ca.cohort !== UNREGISTERED_COHORT;
            const showCohortTitle = archive.length > 1 && isRegisteredCohortArchive;

            return (
              <ArchiveCohortSection
                key={ca.cohort}
                cohortArchive={ca}
                showCohortTitle={showCohortTitle}
                githubId={githubId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
