import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransientValue } from './useTransientValue';

describe('useTransientValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should show the value and drop it after the delay', () => {
    const { result } = renderHook(() => useTransientValue<string>(2500));
    expect(result.current[0]).toBeNull();

    act(() => result.current[1]('복사됨'));
    expect(result.current[0]).toBe('복사됨');

    act(() => vi.advanceTimersByTime(2499));
    expect(result.current[0]).toBe('복사됨');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current[0]).toBeNull();
  });

  it('should restart the delay when shown again and clear on demand', () => {
    const { result } = renderHook(() => useTransientValue<string>(1000));

    act(() => result.current[1]('a'));
    act(() => vi.advanceTimersByTime(800));
    act(() => result.current[1]('b'));
    act(() => vi.advanceTimersByTime(800));
    expect(result.current[0]).toBe('b');

    act(() => result.current[2]());
    expect(result.current[0]).toBeNull();
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current[0]).toBeNull();
  });

  it('should cancel the pending reset on unmount', () => {
    const { result, unmount } = renderHook(() => useTransientValue<boolean>(1000));
    act(() => result.current[1](true));
    unmount();
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });
});
