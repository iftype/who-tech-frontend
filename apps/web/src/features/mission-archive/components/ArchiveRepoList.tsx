import type { ReactNode } from 'react';
import type { ArchiveRepo, ArchiveStep } from '@/entities/member';
import { cn } from '@/shared/lib/utils';
import { linkVariants } from '@/shared/ui';
import { getForkUrl } from '../utils';

interface ArchiveRepoListProps {
  repos: ArchiveRepo[];
  githubId: string;
}

export function ArchiveRepoList({ repos, githubId }: ArchiveRepoListProps) {
  return (
    <div className="flex flex-col gap-1">
      {repos.map((repo, index) => (
        <ArchiveRepoCard key={repo.name}>
          <ArchiveRepoHeader repoName={repo.name} index={index} githubId={githubId} />
          {repo.submissions === null ? (
            <UnsubmittedRepoRow />
          ) : (
            repo.submissions.map((step, stepIndex) => (
              <ArchiveSubmissionRow key={step.prNumber} step={step} index={stepIndex} />
            ))
          )}
        </ArchiveRepoCard>
      ))}
    </div>
  );
}

interface ArchiveRepoCardProps {
  children: ReactNode;
}

function ArchiveRepoCard({ children }: ArchiveRepoCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm hover:shadow-md">
      {children}
    </div>
  );
}

interface ArchiveRepoHeaderProps {
  repoName: string;
  index: number;
  githubId: string;
}

function ArchiveRepoHeader({ repoName, index, githubId }: ArchiveRepoHeaderProps) {
  const repoNumber = String(index + 1).padStart(2, '0');
  const forkUrl = getForkUrl(githubId, repoName);

  return (
    <div className="flex items-center gap-3 border-b border-border-dim bg-surface-alt/30 px-3 py-2">
      <span className="w-5 shrink-0 font-mono text-caption text-text-dim">{repoNumber}</span>
      <a
        href={forkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkVariants({ variant: 'title', size: 'bodySm' }), 'flex-1')}
      >
        {repoName}
      </a>
    </div>
  );
}

function UnsubmittedRepoRow() {
  return (
    <div className="flex items-center py-1.5 pl-11 pr-3">
      <span className="w-9 shrink-0 font-mono text-tiny text-text-dim">step1</span>
      <span className="ml-auto font-mono text-caption text-text-dim">미제출</span>
    </div>
  );
}

interface ArchiveSubmissionRowProps {
  step: ArchiveStep;
  index: number;
}

function ArchiveSubmissionRow({ step, index }: ArchiveSubmissionRowProps) {
  const stepLabel = `step${index + 1}`;
  const isClosed = step.status === 'closed';

  return (
    <div className="flex items-center border-b border-border-dim py-1.5 pl-11 pr-3 last:border-0 hover:bg-surface-alt/50">
      <span className="w-9 shrink-0 font-mono text-tiny text-text-dim">{stepLabel}</span>
      <a
        href={step.prUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkVariants({ variant: 'title', size: 'label' }), 'min-w-0 flex-1 truncate')}
      >
        {step.title}
        {isClosed && <ClosedBadge />}
      </a>
      <PullRequestLink prUrl={step.prUrl} prNumber={step.prNumber} isClosed={isClosed} />
    </div>
  );
}

function ClosedBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center rounded px-1 py-0.5 text-micro font-medium bg-danger-soft text-danger-strong">
      closed
    </span>
  );
}

interface PullRequestLinkProps {
  prUrl: string;
  prNumber: number;
  isClosed: boolean;
}

function PullRequestLink({ prUrl, prNumber, isClosed }: PullRequestLinkProps) {
  const statusColorClassName = isClosed ? 'text-danger' : 'text-accent-dm';

  return (
    <a
      href={prUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(linkVariants({ variant: 'mono', size: 'caption' }), 'ml-3 shrink-0', statusColorClassName)}
    >
      PR #{prNumber} →
    </a>
  );
}
