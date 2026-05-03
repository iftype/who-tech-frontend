'use client';

import { useMemo, useState } from 'react';
import type { CohortArchive } from '@/types';

type Tab = 'mission' | 'common' | 'pending';

const TAB_LABELS: Record<Tab, string> = { mission: '미션', common: '공통', pending: '확인전' };

function getForkUrl(githubId: string, repoName: string) {
  return `https://github.com/${githubId}/${repoName}`;
}

function buildMarkdown(archives: CohortArchive[], tab: Tab, githubId: string): string {
  const lines: string[] = [`# ${new Date().getFullYear()} woowacourse-archive\n`];

  for (const archive of archives) {
    if (archive.cohort > 0) {
      lines.push(`## ${archive.cohort}기 아카이브\n`);
    }

    for (const { level, repos } of archive.levels) {
      const filtered = repos
        .map((repo) => ({
          ...repo,
          submissions:
            repo.submissions?.filter((submission) => {
              if (tab === 'pending') return submission.status === 'closed' || archive.cohort === 0;
              return submission.status !== 'closed';
            }) ?? null,
        }))
        .filter((r) => {
          if (tab === 'pending') return Boolean(r.submissions && r.submissions.length > 0);
          if (archive.cohort === 0) return false;
          if (tab === 'mission') return r.tabCategory === 'base';
          if (tab === 'common') return r.tabCategory === 'common';
          return true;
        });

      if (filtered.length === 0) continue;

      const levelTitle = level === 1 ? '레벨1 - JavaScript' : level === 2 ? '레벨2 - React' : `Level ${level}`;
      lines.push(`### ${levelTitle}\n`);

      lines.push('| NO. | PROJECT | REPOSITORY | PR | PAIR |');
      lines.push('| :-: | :---: | :---: | :---: | :---: |');

      filtered.forEach((repo, i) => {
        if (!repo.submissions || repo.submissions.length === 0) {
          const no = String(i + 1);
          const projectName = repo.name;
          const repoLink = `[${repo.name}](${getForkUrl(githubId, repo.name)})`;
          lines.push(`| ${no} | ${projectName} | ${repoLink} | - | - |`);
          return;
        }

        repo.submissions.forEach((s, si) => {
          const no = si === 0 ? String(i + 1) : ' ';
          const projectName = si === 0 ? repo.name : ' ';
          const repoLink = `[${repo.name}-step${si + 1}](${getForkUrl(githubId, repo.name)})`;
          const prLink = `[PR](${s.prUrl})`;

          lines.push(`| ${no} | ${projectName} | ${repoLink} | ${prLink} | - |`);
        });
      });
      lines.push('\n');
    }
  }
  return lines.join('\n');
}

interface Props {
  archive: CohortArchive[];
  memberTracks: string[];
  githubId: string;
  initialMissionTab: Tab;
}

export function MissionArchive({ archive = [], memberTracks, githubId, initialMissionTab }: Props) {
  const [tab, setTab] = useState<Tab>(initialMissionTab);
  const [copied, setCopied] = useState(false);
  const tabs: Tab[] = ['mission', 'common', 'pending'];

  const applyFilters = (patch: Partial<{ tab: Tab }>) => {
    setTab((prev) => {
      const next = patch.tab ?? prev;
      const params = new URLSearchParams(window.location.search);
      params.set('missionTab', next);
      window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
      return next;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMarkdown(archive, tab, githubId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredArchives = useMemo(
    () =>
      archive
        .map((ca) => ({
          ...ca,
          levels: ca.levels
            .map((lvl) => ({
              ...lvl,
              repos: lvl.repos
                .map((repo) => ({
                  ...repo,
                  submissions:
                    repo.submissions?.filter((submission) => {
                      if (tab === 'pending') return submission.status === 'closed' || ca.cohort === 0;
                      return submission.status !== 'closed';
                    }) ?? null,
                }))
                .filter((r) => {
                  if (tab === 'pending') return Boolean(r.submissions && r.submissions.length > 0);
                  if (ca.cohort === 0) return false;
                  if (tab === 'mission') {
                    if (r.tabCategory !== 'base') return false;
                    if (memberTracks.length > 0) {
                      return r.track === null || memberTracks.includes(r.track);
                    }
                    return true;
                  }
                  if (tab === 'common') return r.tabCategory === 'common';
                  return true;
                })
                .sort((a, b) => {
                  if (tab !== 'pending') return 0;
                  const aDate = a.submissions?.[0]?.submittedAt;
                  const bDate = b.submissions?.[0]?.submittedAt;
                  if (!aDate) return 1;
                  if (!bDate) return -1;
                  return new Date(String(bDate)).getTime() - new Date(String(aDate)).getTime();
                }),
            }))
            .filter((lvl) => lvl.repos.length > 0),
        }))
        .filter((ca) => ca.levels.length > 0),
    [archive, tab, memberTracks],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[13px] font-semibold text-text">미션 PR 아카이브</h2>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-border bg-surface">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => applyFilters({ tab: t })}
                className={`cursor-pointer px-3 py-1.5 text-[11px] ${
                  tab === t ? 'bg-border text-text' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[11px] text-text-muted hover:text-text"
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

      {filteredArchives.length === 0 ? (
        <p className="py-8 text-left text-[13px] text-text-muted">미션 제출 기록이 없습니다</p>
      ) : (
        <div className="flex flex-col gap-10">
          {filteredArchives.map((ca) => (
            <div key={ca.cohort} className="flex flex-col gap-6">
              {ca.cohort > 0 && archive.length > 1 && (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border-dim" />
                  <span className="rounded-full border border-border-dim bg-surface-alt px-3 py-1 text-[12px] font-bold text-text-secondary shadow-sm">
                    {ca.cohort}기 미션
                  </span>
                  <div className="h-px flex-1 bg-border-dim" />
                </div>
              )}

              <div className="flex flex-col gap-5">
                {ca.levels.map(({ level, repos }) => (
                  <div key={level ?? 'null'} className="flex flex-col gap-2">
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
                          className="flex flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-3 border-b border-border-dim bg-surface-alt/30 px-3 py-2">
                            <span className="w-5 flex-shrink-0 font-mono text-[11px] text-text-dim">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <a
                              href={getForkUrl(githubId, repo.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-[13px] font-medium text-text hover:text-accent-dm hover:underline"
                            >
                              {repo.name}
                            </a>
                          </div>

                          {repo.submissions === null ? (
                            <div className="flex items-center py-1.5 pl-11 pr-3">
                              <span className="w-9 flex-shrink-0 font-mono text-[10px] text-text-dim">step1</span>
                              <span className="ml-auto font-mono text-[11px] text-text-dim">미제출</span>
                            </div>
                          ) : (
                            repo.submissions.map((step, si) => (
                              <div
                                key={step.prNumber}
                                className="flex items-center border-b border-border-dim py-1.5 pl-11 pr-3 last:border-0 hover:bg-surface-alt/50"
                              >
                                <span className="w-9 flex-shrink-0 font-mono text-[10px] text-text-dim">
                                  step{si + 1}
                                </span>
                                <a
                                  href={step.prUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="min-w-0 flex-1 truncate text-[12px] font-medium text-text hover:text-accent-dm hover:underline"
                                >
                                  {step.title}
                                  {step.status === 'closed' && (
                                    <span className="ml-1.5 inline-flex items-center rounded px-1 py-0.5 text-[9px] font-medium bg-red-100 text-red-600">
                                      closed
                                    </span>
                                  )}
                                </a>
                                <a
                                  href={step.prUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`ml-3 flex-shrink-0 font-mono text-[11px] font-medium hover:opacity-80 ${
                                    step.status === 'closed' ? 'text-red-400' : 'text-accent-dm'
                                  }`}
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
