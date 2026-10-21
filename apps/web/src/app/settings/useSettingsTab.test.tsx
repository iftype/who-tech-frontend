import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSettingsTab } from './useSettingsTab';

describe('useSettingsTab', () => {
  beforeEach(() => window.history.replaceState(null, '', '/settings'));

  it('should read the tab from the URL and push a history entry when changing it', () => {
    const { result } = renderHook(() => useSettingsTab({ initialTab: 'theme' }));
    const length = window.history.length;
    expect(result.current.tab).toBe('theme');

    act(() => result.current.setTab('guide'));

    expect(result.current.tab).toBe('guide');
    expect(window.location.search).toBe('?tab=guide');
    expect(window.history.length).toBe(length + 1);
  });

  it('should follow popstate and ignore URLs of other pages', () => {
    const { result } = renderHook(() => useSettingsTab({ initialTab: 'theme' }));

    act(() => {
      window.history.replaceState(null, '', '/settings?tab=privacy');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.tab).toBe('privacy');

    act(() => {
      window.history.replaceState(null, '', '/?tab=guide');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.tab).toBe('privacy');
  });
});
