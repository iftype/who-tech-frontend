import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useListNavigation } from './useListNavigation';

const key = (k: string) => ({ key: k, preventDefault: vi.fn() }) as unknown as KeyboardEvent<HTMLElement>;

describe('useListNavigation', () => {
  it('should wrap around with the arrow keys and select with Enter', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useListNavigation({ count: 3, resetKey: 'q', onSelect }));
    expect(result.current.activeIndex).toBe(-1);

    act(() => result.current.handleKeyDown(key('ArrowUp')));
    expect(result.current.activeIndex).toBe(2);
    act(() => result.current.handleKeyDown(key('ArrowDown')));
    expect(result.current.activeIndex).toBe(0);
    act(() => result.current.handleKeyDown(key('ArrowDown')));
    expect(result.current.activeIndex).toBe(1);

    act(() => result.current.handleKeyDown(key('Enter')));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('should ignore Enter before a selection and every key when the list is empty', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useListNavigation({ count: 0, resetKey: 'q', onSelect }));
    act(() => result.current.handleKeyDown(key('ArrowDown')));
    act(() => result.current.handleKeyDown(key('Enter')));
    expect(result.current.activeIndex).toBe(-1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should reset the selection when the key changes', () => {
    const { result, rerender } = renderHook(
      ({ q }) => useListNavigation({ count: 3, resetKey: q, onSelect: vi.fn() }),
      {
        initialProps: { q: 'a' },
      },
    );
    act(() => result.current.handleKeyDown(key('ArrowDown')));
    expect(result.current.activeIndex).toBe(0);

    rerender({ q: 'ab' });
    expect(result.current.activeIndex).toBe(-1);
  });
});
