'use client';

import { useState } from 'react';
import type { ArchiveLevel } from '@/types';

type Tab = 'base' | 'common' | 'precourse';

const TAB_LABELS: Record<Tab, string> = { base: '기준', common: '공통', precourse: '프리코스' };

function buildMarkdown(archive: ArchiveLevel[], tab: Tab): string {
  const lines: string[] = ['# 미션 PR 아카이브\n'];
  for (const { level, repos } of archive) {
    const filtered = repos.filter((r) => r.tabCategory === tab && r.submissions);
    if (filtered.length === 0) continue;
    lines.push(`## Level ${level ?? '–'}\n`);
    filtered.forEach((repo, i) => {
      lines.push(`### ${i + 1}. ${repo.name}`);
      repo.submissions!.forEach((s, si) => {
        lines.push(`- step${si + 1}: [PR #${s.prNumber}](${s.prUrl})`);
      });
      lines.push('');
    });
  }
  return lines.join('\n');
}

interface Props {
  archive: ArchiveLevel[];
  memberTracks: string[];
}

export function MissionArchive({ archive = [], memberTracks }: Props) {
  const hasPrecourse = archive.some((lvl) => lvl.repos.some((r) => r.tabCategory === 'precourse'));
  const [tab, setTab] = useState<Tab>('base');
  const [copied, setCopied] = useState(false);

  const tabs: Tab[] = ['base', 'common', ...(hasPrecourse ? (['precourse'] as Tab[]) : [])];

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMarkdown(archive, tab));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // base 탭: 멤버 트랙에 해당하는 미션만 표시 (track=null은 항상 포함)
  // common/precourse: tabCategory 기준으로만 필터
  const filteredArchive = archive
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
    .filter((lvl) => lvl.repos.length > 0);

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
                className={`px-3 py-1.5 text-[11px] transition-colors ${
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
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[11px] text-text-muted transition-colors hover:text-text"
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

      {/* Mission levels */}
      {filteredArchive.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-text-muted">미션 제출 기록이 없습니다</p>
      ) : (
        filteredArchive.map(({ level, repos }) => (
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
                  className="flex flex-col overflow-hidden rounded-md border border-border bg-surface"
                >
                  {/* Repo header */}
                  <div className="flex items-center gap-3 border-b border-border-dim px-3 py-2">
                    <span className="w-5 flex-shrink-0 font-mono text-[11px] text-text-dim">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[13px] text-text">{repo.name}</span>
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
                        className="flex items-center border-b border-border-dim py-1.5 pl-11 pr-3 last:border-0"
                      >
                        <span className="w-9 flex-shrink-0 font-mono text-[10px] text-text-dim">step{si + 1}</span>
                        <a
                          href={step.prUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto font-mono text-[11px] text-accent-dm transition-opacity hover:opacity-80"
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
        ))
      )}
    </div>
  );
}
