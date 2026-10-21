import { describe, expect, it } from 'vitest';
import { visibleArchive } from './archive';
import { githubProfileUrl } from './links';

const archive = (cohort: number) => ({ cohort, levels: [] });

describe('visibleArchive', () => {
  it("should keep the member's cohorts and the unregistered archive, dropping the rest", () => {
    const member = {
      cohorts: [{ cohort: 8, roles: ['crew' as const] }],
      archive: [archive(8), archive(7), archive(0)],
    };
    expect(visibleArchive(member).map((ca) => ca.cohort)).toEqual([8, 0]);
  });
});

describe('githubProfileUrl', () => {
  it('should point at the GitHub profile', () => {
    expect(githubProfileUrl('iftype')).toBe('https://github.com/iftype');
  });
});
