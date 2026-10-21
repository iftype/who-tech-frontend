import { describe, expect, it } from 'vitest';
import { DESIGN_SYSTEMS, THEMES, parseDesign, parseTheme } from './theme';

describe('theme values', () => {
  it('should keep the known themes and designs in order', () => {
    expect(THEMES).toEqual(['dark', 'light']);
    expect(DESIGN_SYSTEMS).toEqual(['paper', 'apple', 'sentry']);
  });

  it('should parse cookie values and fall back to dark / paper', () => {
    expect(parseTheme('light')).toBe('light');
    expect(parseTheme('blue')).toBe('dark');
    expect(parseTheme(undefined)).toBe('dark');
    expect(parseDesign('sentry')).toBe('sentry');
    expect(parseDesign('')).toBe('paper');
    expect(parseDesign(3)).toBe('paper');
  });
});
