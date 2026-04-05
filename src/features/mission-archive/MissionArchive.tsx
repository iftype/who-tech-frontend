'use client';

import { useState } from 'react';
import type { CohortArchive } from '@/types';

type Tab = 'base' | 'common' | 'precourse';

const TAB_LABELS: Record<Tab, string> = { base: '기준', common: '공통', precourse: '프리코스' };

function getRepoUrl(prUrl: string) {
  return prUrl.split('/pull/')[0] ?? prUrl;
}

function buildMarkdown(archives: CohortArchive[], tab: Tab): string {
  const lines: string[] = [`# ${new Date().getFullYear()} woowacourse-archive\n` || '# woowacourse-archive\n'];

  for (const archive of archives) {
    if (archive.cohort > 0) {
      lines.push(`## ${archive.cohort}기 아카이브\n`);
    }

    for (const { level, repos } of archive.levels) {
      const filtered = repos.filter((r) => r.tabCategory === tab && r.submissions);
      if (filtered.length === 0) continue;

      // 레벨 헤더 (예: 레벨1 - JavaScript)
      const levelTitle = level === 1 ? '레벨1 - JavaScript' : level === 2 ? '레벨2 - React' : `Level ${level}`;
      lines.push(`### ${levelTitle}\n`);

      // 테이블 헤더
      lines.push('| NO. | PROJECT | REPOSITORY | PR | PAIR |');
      lines.push('| :-: | :---: | :---: | :---: | :---: |');

      filtered.forEach((repo, i) => {
        if (!repo.submissions || repo.submissions.length === 0) return;

        repo.submissions.forEach((s, si) => {
          const no = si === 0 ? String(i + 1) : ' '; // 첫 번째 스텝에만 번호 표시
          const projectName = si === 0 ? repo.name : ' '; // 첫 번째 스텝에만 프로젝트명 표시

          // REPOSITORY 링크 (브랜치명은 제출 정보에 없으므로 기본 URL 사용)
          const repoLink = `[${repo.name}-step${si + 1}](${getRepoUrl(s.prUrl)})`;

          // PR 링크
          const prLink = `[PR](${s.prUrl})`;

          lines.push(`| ${no} | ${projectName} | ${repoLink} | ${prLink} | - |`);
        });
      });
      lines.push('\n'); // 레벨 간 간격
    }
  }
  return lines.join('\n');
}
interface Props {
  archive: CohortArchive[];
  memberTracks: string[];
}

export function MissionArchive({ archive = [], memberTracks }: Props) {
  const allLevels = archive.flatMap((a) => a.levels);
  const hasPrecourse = allLevels.some((lvl) => lvl.repos.some((r) => r.tabCategory === 'precourse'));
  const [tab, setTab] = useState<Tab>('base');
  const [copied, setCopied] = useState(false);

  const tabs: Tab[] = ['base', 'common', ...(hasPrecourse ? (['precourse'] as Tab[]) : [])];

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMarkdown(archive, tab));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter logic applied to each cohort's levels
  const filteredArchives = archive
    .map((ca) => ({
      ...ca,
      levels: ca.levels
        .map((lvl) => ({
          ...lvl,
          repos: lvl.repos.filter((r) => {
            if (r.tabCategory !== tab) return false;
            if (tab === 'base' && memberTracks.length > 0) {
              return r.track === null || memberTracks.includes(r.track);
            }
            return true;
          }),
        }))
        .filter((lvl) => lvl.repos.length > 0),
    }))
    .filter((ca) => ca.levels.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[13px] font-semibold text-text">미션 PR 아카이브</h2>
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex overflow-hidden rounded-md border border-border bg-surface">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`cursor-pointer px-3 py-1.5 text-[11px] transition-colors ${
                  tab === t ? 'bg-border text-text' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[11px] text-text-muted transition-colors hover:text-text"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span className="hidden sm:inline">{copied ? '복사됨' : 'Markdown 복사'}</span>
            <span className="sm:hidden">{copied ? '복사됨' : 'MD 복사'}</span>
          </button>
        </div>
      </div>

      {/* Cohort-grouped Mission levels */}
      {filteredArchives.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-text-muted">미션 제출 기록이 없습니다</p>
      ) : (
        <div className="flex flex-col gap-10">
          {filteredArchives.map((ca) => (
            <div key={ca.cohort} className="flex flex-col gap-6">
              {ca.cohort > 0 && archive.length > 1 && (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border-dim" />
                  <span className="px-3 py-1 rounded-full bg-surface-alt border border-border-dim text-[12px] font-bold text-text-secondary shadow-sm">
                    {ca.cohort}기 미션
                  </span>
                  <div className="h-px flex-1 bg-border-dim" />
                </div>
              )}

              <div className="flex flex-col gap-5">
                {ca.levels.map(({ level, repos }) => (
                  <div key={level ?? 'null'} className="flex flex-col gap-2">
                    {/* Level heading */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-accent-dm">
                        Level {level ?? '–'}
                      </span>
                      <div className="h-px flex-1 bg-border-dim" />
                    </div>

                    <div className="flex flex-col gap-1">
                      {repos.map((repo, idx) => (
                        <div
                          key={repo.name}
                          className="flex flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          {/* Repo header */}
                          <div className="flex items-center gap-3 border-b border-border-dim px-3 py-2 bg-surface-alt/30">
                            <span className="w-5 flex-shrink-0 font-mono text-[11px] text-text-dim">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            {repo.submissions && repo.submissions.length > 0 ? (
                              <a
                                href={getRepoUrl(repo.submissions[0].prUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-[13px] font-medium text-text transition-colors hover:text-accent-dm hover:underline"
                              >
                                {repo.name}
                              </a>
                            ) : (
                              <span className="flex-1 text-[13px] font-medium text-text">{repo.name}</span>
                            )}
                          </div>

                          {/* Steps */}
                          {repo.submissions === null ? (
                            <div className="flex items-center py-1.5 pl-11 pr-3">
                              <span className="w-9 flex-shrink-0 font-mono text-[10px] text-text-dim">step1</span>
                              <span className="ml-auto font-mono text-[11px] text-text-dim">미제출</span>
                            </div>
                          ) : (
                            repo.submissions.map((step, si) => (
                              <div
                                key={step.prNumber}
                                className="flex items-center border-b border-border-dim py-1.5 pl-11 pr-3 last:border-0 hover:bg-surface-alt/50 transition-colors"
                              >
                                <span className="w-9 flex-shrink-0 font-mono text-[10px] text-text-dim">
                                  step{si + 1}
                                </span>
                                <a
                                  href={step.prUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="min-w-0 flex-1 truncate text-[12px] font-medium text-text transition-colors hover:text-accent-dm hover:underline"
                                >
                                  {step.title}
                                </a>
                                <a
                                  href={step.prUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-3 flex-shrink-0 font-mono text-[11px] text-accent-dm font-medium transition-opacity hover:opacity-80"
                                >
                                  PR #{step.prNumber} →
                                </a>
                              </div>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
