import { describe, expect, it } from 'vitest';
import { SETTINGS_TABS, parseSettingsTab } from './settingsTab';

describe('settings tab', () => {
  it('should accept guide and privacy and fall back to theme', () => {
    expect(parseSettingsTab('guide')).toBe('guide');
    expect(parseSettingsTab('privacy')).toBe('privacy');
    expect(parseSettingsTab('theme')).toBe('theme');
    expect(parseSettingsTab('other')).toBe('theme');
    expect(parseSettingsTab(null)).toBe('theme');
  });

  it('should list the tabs in render order', () => {
    expect(SETTINGS_TABS.map((t) => t.id)).toEqual(['theme', 'guide', 'privacy']);
  });
});
