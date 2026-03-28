'use client';

import { useState } from 'react';
import type { Submission, TabCategory } from '@/types';

interface MissionGroup {
  repoName: string;
  level: number | null;
  tabCategory: TabCategory;
  steps: Array<{
    title: string;
    prUrl: string;
    prNumber: number;
    submittedAt: string;
  }>;
}

function groupSubmissions(submissions: Submission[], tab: 'base' | 'common'): Record<number, MissionGroup[]> {
  const filtered = submissions.filter((s) => s.missionRepo.tabCategory === tab);

  const repoMap = new Map<string, MissionGroup>();
  for (const sub of filtered) {
    const key = sub.missionRepo.name;
    if (!repoMap.has(key)) {
      repoMap.set(key, {
        repoName: sub.missionRepo.name,
        level: sub.missionRepo.level,
        tabCategory: sub.missionRepo.tabCategory,
        steps: [],
      });
    }
    repoMap.get(key)!.steps.push({
      title: sub.title,
      prUrl: sub.prUrl,
      prNumber: sub.prNumber,
      submittedAt: sub.submittedAt,
    });
  }

  const byLevel: Record<number, MissionGroup[]> = {};
  for (const group of repoMap.values()) {
    const lvl = group.level ?? 0;
    (byLevel[lvl] ??= []).push(group);
  }
  return byLevel;
}

function copyAsMarkdown(submissions: Submission[], tab: 'base' | 'common') {
  const grouped = groupSubmissions(submissions, tab);
  const lines: string[] = ['# 미션 PR 아카이브\n'];
  for (const [level, groups] of Object.entries(grouped).sort()) {
    lines.push(`## Level ${level}\n`);
    groups.forEach((g, i) => {
      lines.push(`### ${i + 1}. ${g.repoName}`);
      g.steps.forEach((s) => {
        lines.push(`- [${s.title}](${s.prUrl})`);
      });
      lines.push('');
    });
  }
  navigator.clipboard.writeText(lines.join('\n'));
}

interface Props {
  submissions: Submission[];
}

export function MissionArchive({ submissions }: Props) {
  const [tab, setTab] = useState<'base' | 'common'>('base');
  const [copied, setCopied] = useState(false);

  const grouped = groupSubmissions(submissions, tab);
  const levels = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  const handleCopy = () => {
    copyAsMarkdown(submissions, tab);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <h2 className="text-[13px] font-semibold text-text">미션 PR 아카이브</h2>
        <div className="flex items-center gap-2">
          {/* Tab */}
          <div className="flex rounded-md overflow-hidden border border-border bg-surface">
            {(['base', 'common'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-[11px] transition-colors ${
                  tab === t ? 'bg-border text-text' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {t === 'base' ? '기준' : '공통'}
              </button>
            ))}
          </div>
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface text-[11px] text-text-muted hover:text-text transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span className="hidden sm:inline">{copied ? '복사됨' : 'Markdown 복사'}</span>
            <span className="sm:hidden">{copied ? '복사됨' : 'MD 복사'}</span>
          </button>
        </div>
      </div>

      {/* Mission levels */}
      {levels.length === 0 ? (
        <p className="text-[13px] text-text-muted py-8 text-center">미션 제출 기록이 없습니다</p>
      ) : (
        levels.map((level) => (
          <div key={level} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[0.06em] text-accent-dm uppercase">
                Level {level || '–'}
              </span>
              <div className="flex-1 h-px bg-border-dim" />
            </div>
            <div className="flex flex-col gap-1">
              {grouped[level].map((group, idx) => (
                <div
                  key={group.repoName}
                  className="flex flex-col rounded-md overflow-hidden border border-border bg-surface"
                >
                  {/* Repo header */}
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-border-dim">
                    <span className="w-5 flex-shrink-0 font-mono text-[11px] text-text-dim">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[13px] text-text">{group.repoName}</span>
                  </div>
                  {/* Step rows */}
                  {group.steps.map((step, si) => (
                    <div
                      key={si}
                      className="flex items-center pl-11 pr-3 py-1.5 border-b border-border-dim last:border-0"
                    >
                      <span className="w-9 flex-shrink-0 font-mono text-[10px] text-text-dim">step{si + 1}</span>
                      <a
                        href={step.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto font-mono text-[11px] text-accent-dm hover:opacity-80 transition-opacity"
                      >
                        PR #{step.prNumber} →
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
