import { describe, expect, it } from 'vitest';
import { githubProfileUrl, memberPath } from './links';

describe('member links', () => {
  it('should build the GitHub profile URL and the detail page path from the GitHub id', () => {
    expect(githubProfileUrl('crew9')).toBe('https://github.com/crew9');
    expect(memberPath('crew9')).toBe('/crew9');
  });
});
