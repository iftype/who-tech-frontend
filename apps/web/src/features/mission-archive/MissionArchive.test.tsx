import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { MissionArchive } from './MissionArchive';
import { getFilteredArchives } from './utils';
import type { CohortArchive } from '@/types';

const archive: CohortArchive[] = [
  {
    cohort: 7,
    levels: [
      {
        level: 1,
        repos: [
          {
            name: 'javascript-calculator',
            track: 'frontend',
            tabCategory: 'base',
            submissions: [
              {
                prUrl: 'https://github.com/woowacourse/javascript-calculator/pull/10',
                prNumber: 10,
                title: 'feat: calculator step1',
                status: 'open',
                submittedAt: '2026-03-01T00:00:00.000Z',
              },
              {
                prUrl: 'https://github.com/woowacourse/javascript-calculator/pull/11',
                prNumber: 11,
                title: 'feat: calculator closed step',
                status: 'closed',
                submittedAt: '2026-03-03T00:00:00.000Z',
              },
            ],
          },
          {
            name: 'backend-mission',
            track: 'backend',
            tabCategory: 'base',
            submissions: [
              {
                prUrl: 'https://github.com/woowacourse/backend-mission/pull/20',
                prNumber: 20,
                title: 'feat: backend mission',
                status: 'open',
                submittedAt: '2026-03-02T00:00:00.000Z',
              },
            ],
          },
          {
            name: 'common-mission',
            track: null,
            tabCategory: 'common',
            submissions: [
              {
                prUrl: 'https://github.com/woowacourse/common-mission/pull/30',
                prNumber: 30,
                title: 'docs: common mission',
                status: 'open',
                submittedAt: '2026-03-04T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    cohort: 0,
    levels: [
      {
        level: null,
        repos: [
          {
            name: 'pending-legacy',
            track: null,
            tabCategory: 'base',
            submissions: [
              {
                prUrl: 'https://github.com/woowacourse/pending-legacy/pull/40',
                prNumber: 40,
                title: 'chore: pending legacy',
                status: 'open',
                submittedAt: '2026-03-05T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    ],
  },
];

type MissionTab = 'mission' | 'common' | 'pending';

function renderMissionArchive({
  customArchive = archive,
  initialMissionTab = 'mission',
  memberTracks = ['frontend'],
}: {
  customArchive?: CohortArchive[];
  initialMissionTab?: MissionTab;
  memberTracks?: string[];
} = {}) {
  return render(
    <MissionArchive
      archive={customArchive}
      memberTracks={memberTracks}
      githubId="woody"
      initialMissionTab={initialMissionTab}
    />,
  );
}

function renderMissionArchiveWithArchive(customArchive: CohortArchive[]) {
  return renderMissionArchive({ customArchive });
}

describe('MissionArchive', () => {
  let writeText: MockedFunction<Clipboard['writeText']>;

  beforeEach(() => {
    writeText = vi.fn<Clipboard['writeText']>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    window.history.replaceState(null, '', '/woody');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mission 탭에서 멤버 track에 맞는 기본 미션의 진행 중 PR만 보여준다', () => {
    renderMissionArchive();

    expect(screen.getByRole('heading', { name: '미션 PR 아카이브' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'javascript-calculator' })).toHaveAttribute(
      'href',
      'https://github.com/woody/javascript-calculator',
    );
    expect(screen.getByRole('link', { name: 'feat: calculator step1' })).toBeInTheDocument();
    expect(screen.queryByText('feat: calculator closed step')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'backend-mission' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'common-mission' })).not.toBeInTheDocument();
  });

  it('memberTracks가 비어 있으면 mission 탭에서 모든 track의 기본 미션을 보여준다', () => {
    renderMissionArchive({ memberTracks: [] });

    expect(screen.getByRole('link', { name: 'javascript-calculator' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'backend-mission' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'common-mission' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'pending-legacy' })).not.toBeInTheDocument();
  });

  it('초기 missionTab이 common이면 공통 미션만 보여준다', () => {
    renderMissionArchive({ initialMissionTab: 'common' });

    expect(screen.getByRole('link', { name: 'common-mission' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'javascript-calculator' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'backend-mission' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'pending-legacy' })).not.toBeInTheDocument();
  });

  it('레벨을 아는 기수는 레벨별로, 레벨을 모르는 기수는 Level – 아래의 전달된 repo 순서대로 보여준다', () => {
    renderMissionArchiveWithArchive([
      {
        cohort: 8,
        levels: [
          {
            level: 1,
            repos: [
              {
                name: 'javascript-racingcar',
                track: 'frontend',
                tabCategory: 'base',
                submissions: null,
              },
            ],
          },
          {
            level: 2,
            repos: [
              {
                name: 'react-shopping-cart',
                track: 'frontend',
                tabCategory: 'base',
                submissions: null,
              },
            ],
          },
        ],
      },
      {
        cohort: 5,
        levels: [
          {
            level: null,
            repos: [
              {
                name: 'javascript-lotto',
                track: null,
                tabCategory: 'base',
                submissions: null,
              },
              {
                name: 'react-payments',
                track: null,
                tabCategory: 'base',
                submissions: null,
              },
              {
                name: 'react-modules',
                track: null,
                tabCategory: 'base',
                submissions: null,
              },
            ],
          },
        ],
      },
    ]);

    expect(screen.getByText('8기 미션')).toBeInTheDocument();
    expect(screen.getByText('5기 미션')).toBeInTheDocument();
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
    expect(screen.getByText('Level –')).toBeInTheDocument();

    const repoLinks = screen.getAllByRole('link', {
      name: /javascript-racingcar|react-shopping-cart|javascript-lotto|react-payments|react-modules/,
    });
    expect(repoLinks.map((link) => link.textContent)).toEqual([
      'javascript-racingcar',
      'react-shopping-cart',
      'javascript-lotto',
      'react-payments',
      'react-modules',
    ]);
  });

  it('탭을 바꾸면 URL의 missionTab query와 목록이 함께 갱신된다', async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    renderMissionArchive();

    await user.click(screen.getByRole('button', { name: '공통' }));

    expect(window.location.pathname).toBe('/woody');
    expect(window.location.search).toBe('?missionTab=common');
    expect(screen.getByRole('link', { name: 'common-mission' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'javascript-calculator' })).not.toBeInTheDocument();
  });

  it('pending 탭에서는 closed 제출과 cohort 0 제출을 최신 제출일 순서로 보여준다', async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    renderMissionArchive();

    await user.click(screen.getByRole('button', { name: '확인전' }));

    const repoLinks = screen.getAllByRole('link', { name: /javascript-calculator|pending-legacy/ });
    expect(repoLinks.map((link) => link.textContent)).toEqual(['javascript-calculator', 'pending-legacy']);
    expect(screen.getByRole('link', { name: 'chore: pending legacy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /feat: calculator closed step/ })).toBeInTheDocument();
    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('초기 missionTab이 pending이면 클릭 없이 확인전 제출만 보여준다', () => {
    renderMissionArchive({ initialMissionTab: 'pending' });

    expect(screen.getByRole('link', { name: 'javascript-calculator' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /feat: calculator closed step/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'pending-legacy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'chore: pending legacy' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'feat: calculator step1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'common-mission' })).not.toBeInTheDocument();
  });

  it('현재 탭에서 표시할 레포가 없으면 빈 상태를 보여준다', () => {
    renderMissionArchive({ memberTracks: ['android'] });

    expect(screen.getByText('미션 제출 기록이 없습니다')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'javascript-calculator' })).not.toBeInTheDocument();
  });

  it('현재 탭 기준 Markdown을 클립보드에 복사하고 복사 상태를 표시한다', async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderMissionArchive({ memberTracks: [] });

    await user.click(screen.getByRole('button', { name: /Markdown 복사/ }));

    expect(writeText).toHaveBeenCalledTimes(1);
    const markdown = writeText.mock.calls[0]?.[0] ?? '';
    expect(markdown).toContain(`# ${new Date().getFullYear()} woowacourse-archive`);
    expect(markdown).toContain('## 7기 아카이브');
    expect(markdown).toContain('### 레벨1');
    expect(markdown).not.toContain('### 레벨1 - JavaScript');
    expect(markdown).toContain(
      '| 1 | javascript-calculator | [javascript-calculator-step1](https://github.com/woody/javascript-calculator) | [PR](https://github.com/woowacourse/javascript-calculator/pull/10) | - |',
    );
    expect(markdown).toContain(
      '| 2 | backend-mission | [backend-mission-step1](https://github.com/woody/backend-mission) | [PR](https://github.com/woowacourse/backend-mission/pull/20) | - |',
    );

    const copyButton = screen.getByRole('button', { name: '복사됨복사됨' });
    expect(within(copyButton).getAllByText('복사됨')).toHaveLength(2);
  });

  it('공통 탭에서 Markdown을 복사하면 공통 미션만 포함한다', async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderMissionArchive();

    await user.click(screen.getByRole('button', { name: '공통' }));
    await user.click(screen.getByRole('button', { name: /Markdown 복사/ }));

    const markdown = writeText.mock.calls[0]?.[0] ?? '';
    expect(markdown).toContain('common-mission');
    expect(markdown).toContain('https://github.com/woowacourse/common-mission/pull/30');
    expect(markdown).not.toContain('javascript-calculator');
    expect(markdown).not.toContain('backend-mission');
    expect(markdown).not.toContain('pending-legacy');
  });

  it('mission 탭 Markdown은 화면과 동일하게 memberTracks 필터를 적용한다', async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderMissionArchive();

    expect(screen.getByRole('link', { name: 'javascript-calculator' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'backend-mission' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Markdown 복사/ }));

    const markdown = writeText.mock.calls[0]?.[0] ?? '';
    expect(markdown).toContain('javascript-calculator');
    expect(markdown).not.toContain('backend-mission');
  });
});

describe('getFilteredArchives - 확인전 정렬', () => {
  it('같은 레벨의 repo를 가장 최신(마지막) 제출일 기준 내림차순으로 정렬한다', () => {
    // submissions는 백엔드에서 오름차순(오래된→최신)으로 내려온다.
    // alpha는 [0]=03-08로 더 최근이지만 최신 제출은 03-09,
    // beta는 [0]=03-01로 더 과거이지만 최신 제출은 03-10이라 beta가 먼저 와야 한다.
    const pendingArchive: CohortArchive[] = [
      {
        cohort: 0,
        levels: [
          {
            level: null,
            repos: [
              {
                name: 'alpha-mission',
                track: null,
                tabCategory: 'base',
                submissions: [
                  { prUrl: 'u1', prNumber: 1, title: 't', status: 'open', submittedAt: '2026-03-08T00:00:00.000Z' },
                  { prUrl: 'u2', prNumber: 2, title: 't', status: 'open', submittedAt: '2026-03-09T00:00:00.000Z' },
                ],
              },
              {
                name: 'beta-mission',
                track: null,
                tabCategory: 'base',
                submissions: [
                  { prUrl: 'u3', prNumber: 3, title: 't', status: 'open', submittedAt: '2026-03-01T00:00:00.000Z' },
                  { prUrl: 'u4', prNumber: 4, title: 't', status: 'open', submittedAt: '2026-03-10T00:00:00.000Z' },
                ],
              },
            ],
          },
        ],
      },
    ];

    const result = getFilteredArchives(pendingArchive, 'pending', []);
    const names = result[0]?.levels[0]?.repos.map((repo) => repo.name);

    expect(names).toEqual(['beta-mission', 'alpha-mission']);
  });
});
