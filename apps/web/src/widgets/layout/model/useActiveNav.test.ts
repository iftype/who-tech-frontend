import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useActiveNav } from './useActiveNav';

describe('useActiveNav', () => {
  it('should follow the pathname until a link is pressed, then the pressed link until the route catches up', () => {
    const { result, rerender } = renderHook(({ p }) => useActiveNav(p), { initialProps: { p: '/cohort' } });
    expect(result.current.activeHref).toBe('/cohort');

    act(() => result.current.markActive('/settings'));
    expect(result.current.activeHref).toBe('/settings');

    rerender({ p: '/settings' });
    expect(result.current.activeHref).toBe('/settings');
  });

  it('should drop a stale optimistic mark once the route moved somewhere else', () => {
    const { result, rerender } = renderHook(({ p }) => useActiveNav(p), { initialProps: { p: '/cohort' } });
    act(() => result.current.markActive('/settings'));

    rerender({ p: '/iftype' });
    expect(result.current.activeHref).toBe('/iftype');
  });
});
