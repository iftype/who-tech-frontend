'use client';

import { useMemo, useState } from 'react';
import { ArchiveCohortSection } from './components/ArchiveCohortSection';
import { MissionArchiveHeader } from './components/MissionArchiveHeader';
import { UNREGISTERED_COHORT } from './constants';
import type { MissionTab } from './types';
import { buildMarkdown, getFilteredArchives } from './utils';
import type { CohortArchive, Track } from '@/entities/member';

// 탭은 부모가 가진다 (URL에서 읽는 위젯). 이 피처는 URL을 모른다
interface MissionArchiveProps {
  archive: CohortArchive[];
  memberTracks: Track[];
  githubId: string;
  tab: MissionTab;
  onTabChange: (tab: MissionTab) => void;
}

export function MissionArchive({ archive, memberTracks, githubId, tab, onTabChange }: MissionArchiveProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMarkdown(archive, tab, githubId, memberTracks));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredArchives = useMemo(() => getFilteredArchives(archive, tab, memberTracks), [archive, tab, memberTracks]);

  return (
    <div className="flex flex-col gap-5">
      <MissionArchiveHeader tab={tab} copied={copied} onTabChange={onTabChange} onCopy={handleCopy} />

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
