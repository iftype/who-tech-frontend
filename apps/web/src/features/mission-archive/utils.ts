import { MISSION_TAB, UNREGISTERED_COHORT } from './constants';
import type { MissionTab } from './types';
import type { ArchiveRepo, ArchiveStep, CohortArchive } from '@/types';

export function getForkUrl(githubId: string, repoName: string) {
  return `https://github.com/${githubId}/${repoName}`;
}

export function buildMarkdown(archives: CohortArchive[], tab: MissionTab, githubId: string): string {
  const lines: string[] = [`# ${new Date().getFullYear()} woowacourse-archive\n`];

  for (const archive of archives) {
    if (archive.cohort !== UNREGISTERED_COHORT) {
      lines.push(`## ${archive.cohort}기 아카이브\n`);
    }

    for (const { level, repos } of archive.levels) {
      const filtered = getFilteredRepos(repos, tab, archive.cohort);

      if (filtered.length === 0) continue;

      lines.push(buildLevelHeading(level));
      lines.push(...buildTableHeader());

      filtered.forEach((repo, index) => {
        if (!repo.submissions || repo.submissions.length === 0) {
          lines.push(buildNoSubmissionRow(repo, index, githubId));
          return;
        }

        repo.submissions.forEach((submission, submissionIndex) => {
          lines.push(buildSubmissionRow(repo, submission, index, submissionIndex, githubId));
        });
      });
      lines.push('\n');
    }
  }
  return lines.join('\n');
}

export function getFilteredArchives(
  archives: CohortArchive[],
  tab: MissionTab,
  memberTracks: string[],
): CohortArchive[] {
  return archives
    .map((archive) => ({
      ...archive,
      levels: archive.levels
        .map((level) => ({
          ...level,
          repos: getFilteredRepos(level.repos, tab, archive.cohort, memberTracks).sort((a, b) =>
            compareReposByLatestSubmission(a, b, tab),
          ),
        }))
        .filter((level) => level.repos.length > 0),
    }))
    .filter((archive) => archive.levels.length > 0);
}

function getFilteredRepos(
  repos: ArchiveRepo[],
  tab: MissionTab,
  cohort: number,
  memberTracks?: string[],
): ArchiveRepo[] {
  return repos
    .map((repo) => ({
      ...repo,
      submissions: getFilteredSubmissions(repo.submissions, tab, cohort),
    }))
    .filter((repo) => shouldIncludeRepo(repo, tab, cohort, memberTracks));
}

function getFilteredSubmissions(submissions: ArchiveStep[] | null, tab: MissionTab, cohort: number) {
  return (
    submissions?.filter((submission) => {
      if (tab === MISSION_TAB.PENDING) return submission.status === 'closed' || cohort === UNREGISTERED_COHORT;
      return submission.status !== 'closed';
    }) ?? null
  );
}

function shouldIncludeRepo(repo: ArchiveRepo, tab: MissionTab, cohort: number, memberTracks?: string[]) {
  if (tab === MISSION_TAB.PENDING) return Boolean(repo.submissions && repo.submissions.length > 0);
  if (cohort === UNREGISTERED_COHORT) return false;
  if (tab === MISSION_TAB.MISSION) {
    if (repo.tabCategory !== 'base') return false;
    if (memberTracks && memberTracks.length > 0) return repo.track === null || memberTracks.includes(repo.track);
    return true;
  }
  if (tab === MISSION_TAB.COMMON) return repo.tabCategory === 'common';
  return true;
}

function latestSubmittedAt(repo: ArchiveRepo): number | null {
  if (!repo.submissions || repo.submissions.length === 0) return null;
  // submissions는 백엔드에서 submittedAt 오름차순(오래된→최신)으로 내려오지만,
  // 순서에 의존하지 않도록 최댓값으로 최신 제출일을 구한다.
  return Math.max(...repo.submissions.map((s) => new Date(String(s.submittedAt)).getTime()));
}

function compareReposByLatestSubmission(a: ArchiveRepo, b: ArchiveRepo, tab: MissionTab) {
  if (tab !== MISSION_TAB.PENDING) return 0;

  const aDate = latestSubmittedAt(a);
  const bDate = latestSubmittedAt(b);

  if (aDate === null) return 1;
  if (bDate === null) return -1;
  return bDate - aDate;
}

function buildLevelHeading(level: number | null) {
  const levelTitle = level === null ? '레벨 미분류' : `레벨${level}`;
  return `### ${levelTitle}\n`;
}

function buildTableHeader() {
  return ['| NO. | PROJECT | REPOSITORY | PR | PAIR |', '| :-: | :---: | :---: | :---: | :---: |'];
}

function buildNoSubmissionRow(repo: ArchiveRepo, index: number, githubId: string) {
  const no = String(index + 1);
  const projectName = repo.name;
  const repoLink = `[${repo.name}](${getForkUrl(githubId, repo.name)})`;
  return `| ${no} | ${projectName} | ${repoLink} | - | - |`;
}

function buildSubmissionRow(
  repo: ArchiveRepo,
  submission: ArchiveStep,
  repoIndex: number,
  submissionIndex: number,
  githubId: string,
) {
  const no = submissionIndex === 0 ? String(repoIndex + 1) : ' ';
  const projectName = submissionIndex === 0 ? repo.name : ' ';
  const repoLink = `[${repo.name}-step${submissionIndex + 1}](${getForkUrl(githubId, repo.name)})`;
  const prLink = `[PR](${submission.prUrl})`;

  return `| ${no} | ${projectName} | ${repoLink} | ${prLink} | - |`;
}
