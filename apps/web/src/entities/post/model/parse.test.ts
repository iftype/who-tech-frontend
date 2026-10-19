import { describe, expect, it } from 'vitest';
import { parseRange, rangeToDays } from './parse';

describe('post parse', () => {
  it('parseRange defaults to 30d', () => {
    expect(parseRange('all')).toBe('all');
    expect(parseRange('30d')).toBe('30d');
    expect(parseRange('7d')).toBe('30d');
    expect(parseRange(undefined)).toBe('30d');
  });

  it('rangeToDays maps 30d to 30 and all to no limit', () => {
    expect(rangeToDays('30d')).toBe(30);
    expect(rangeToDays('all')).toBeUndefined();
  });
});
