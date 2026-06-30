'use client';

import { useMemo, useState } from 'react';
import { ArchiveCohortSection } from './components/ArchiveCohortSection';
import { MissionArchiveHeader } from './components/MissionArchiveHeader';
import { UNREGISTERED_COHORT } from './constants';
import type { MissionTab } from './types';
import { buildMarkdown, getFilteredArchives } from './utils';
import type { CohortArchive } from '@/types';

interface Props {
  archive: CohortArchive[];
  memberTracks: string[];
  githubId: string;
  initialMissionTab: MissionTab;
}

export function MissionArchive({ archive = [], memberTracks, githubId, initialMissionTab }: Props) {
  const [tab, setTab] = useState<MissionTab>(initialMissionTab);
  const [copied, setCopied] = useState(false);

  const applyFilters = (next: MissionTab) => {
    setTab((prev) => {
      const params = new URLSearchParams(window.location.search);
      params.set('missionTab', next);
      window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
      return next ?? prev;
    });
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
        <p className="py-8 text-left text-[13px] text-text-muted">미션 제출 기록이 없습니다</p>
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
