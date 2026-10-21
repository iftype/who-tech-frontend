import { describe, expect, it } from 'vitest';
import { staggerFadeIn } from './animation';

describe('staggerFadeIn', () => {
  it('should delay 30ms per row and stop at 300ms', () => {
    expect(staggerFadeIn(0)).toEqual({ animation: 'feedRowFadeIn 0.3s ease both', animationDelay: '0ms' });
    expect(staggerFadeIn(5).animationDelay).toBe('150ms');
    expect(staggerFadeIn(10).animationDelay).toBe('300ms');
    expect(staggerFadeIn(40).animationDelay).toBe('300ms');
  });
});
