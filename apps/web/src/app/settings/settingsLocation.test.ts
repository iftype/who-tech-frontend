import { describe, expect, it } from 'vitest';
import { buildSettingsUrl, isSettingsPath, parseSettingsSearch } from './settingsLocation';

describe('settings location', () => {
  it('should own /settings only', () => {
    expect(isSettingsPath('/settings')).toBe(true);
    expect(isSettingsPath('/settings/x')).toBe(false);
    expect(isSettingsPath('/')).toBe(false);
  });

  it('should round-trip the tab and omit the default from the query', () => {
    expect(buildSettingsUrl('theme')).toBe('/settings');
    expect(buildSettingsUrl('guide')).toBe('/settings?tab=guide');
    expect(parseSettingsSearch('?tab=guide')).toBe('guide');
    expect(parseSettingsSearch('')).toBe('theme');
    expect(parseSettingsSearch('?tab=zzz')).toBe('theme');
  });
});
