import { describe, expect, it } from 'vitest';
import { buildProfileUrl, parseProfileSearch } from './profileLocation';

describe('profile location', () => {
  it('should read both tabs with defaults for missing or unknown values', () => {
    expect(parseProfileSearch('')).toEqual({ tab: 'mission', missionTab: 'mission' });
    expect(parseProfileSearch('?tab=blog&missionTab=pending')).toEqual({ tab: 'blog', missionTab: 'pending' });
    expect(parseProfileSearch('?tab=x&missionTab=y')).toEqual({ tab: 'mission', missionTab: 'mission' });
  });

  it('should round-trip and omit the default tabs from the query', () => {
    expect(buildProfileUrl('/crew', { tab: 'mission', missionTab: 'mission' })).toBe('/crew');
    expect(buildProfileUrl('/crew', { tab: 'blog', missionTab: 'pending' })).toBe('/crew?tab=blog&missionTab=pending');
    expect(parseProfileSearch('?tab=blog&missionTab=pending')).toEqual({ tab: 'blog', missionTab: 'pending' });
  });
});
