import type { CohortArchive, Member, MemberDetail, MemberSearchPage } from '@/entities/member';

/** 테스트가 "이 필드가 없는 응답"을 흉내내려고 undefined를 넘길 수 있게 (exactOptionalPropertyTypes) */
export type MemberOverrides = { [K in keyof Member]?: Member[K] | undefined };

/** 8기 백엔드 크루 한 명. 테스트가 신경 쓰는 필드만 overrides로 바꾼다 */
export function makeMember(githubId: string, overrides: MemberOverrides = {}): Member {
  return {
    githubId,
    nickname: `${githubId}-닉`,
    avatarUrl: null,
    cohort: 8,
    roles: ['crew'],
    cohorts: [{ cohort: 8, roles: ['crew'] }],
    tracks: ['backend'],
    blog: null,
    lastPostedAt: null,
    ...overrides,
  } as Member;
}

export function makeMemberDetail(githubId: string, overrides: Partial<MemberDetail> = {}): MemberDetail {
  return {
    githubId,
    nickname: `${githubId}-닉`,
    avatarUrl: null,
    cohorts: [{ cohort: 8, roles: ['crew'] }],
    tracks: ['backend'],
    blog: null,
    lastPostedAt: null,
    archive: [],
    ...overrides,
  };
}

export function makeSearchPage(members: Member[], overrides: Partial<MemberSearchPage> = {}): MemberSearchPage {
  return { members, totalCount: members.length, counts: { crew: 2, staff: 1 }, nextOffset: null, ...overrides };
}

/** 제출 한 건이 있는 기본 미션 레포 하나짜리 아카이브 */
export function makeArchive(cohort: number, repoName = `mission-${cohort}`, track = 'backend'): CohortArchive {
  return {
    cohort,
    levels: [
      {
        level: 1,
        repos: [
          {
            name: repoName,
            track,
            tabCategory: 'base',
            submissions: [
              {
                prUrl: `https://github.com/woowacourse/${repoName}/pull/1`,
                prNumber: 1,
                title: `feat: ${repoName} step1`,
                status: 'open',
                submittedAt: '2026-03-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    ],
  };
}
