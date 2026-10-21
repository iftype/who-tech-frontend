import { describe, expect, it } from 'vitest';
import { isTrack, parseCohortNumber, parseRoleGroup, parseTrack, parseTrackOrAll } from './parse';

describe('member parse', () => {
  it('parseTrack keeps known tracks and drops anything else', () => {
    expect(parseTrack('frontend')).toBe('frontend');
    expect(parseTrack('android')).toBe('android');
    expect(parseTrack('foo')).toBeNull();
    expect(parseTrack('all')).toBeNull();
    expect(parseTrack(undefined)).toBeNull();
    expect(parseTrack(null)).toBeNull();
  });

  it('parseTrackOrAll accepts all and falls back for unknown values', () => {
    expect(parseTrackOrAll('all')).toBe('all');
    expect(parseTrackOrAll('backend')).toBe('backend');
    expect(parseTrackOrAll('foo')).toBe('all');
    expect(parseTrackOrAll(undefined, 'frontend')).toBe('frontend');
  });

  it('parseRoleGroup only accepts staff or crew', () => {
    expect(parseRoleGroup('staff')).toBe('staff');
    expect(parseRoleGroup('crew', 'staff')).toBe('crew');
    expect(parseRoleGroup('coach')).toBe('crew');
    expect(parseRoleGroup(undefined, 'staff')).toBe('staff');
  });

  it('parseCohortNumber accepts digit strings only', () => {
    expect(parseCohortNumber('8')).toBe(8);
    expect(parseCohortNumber('12')).toBe(12);
    expect(parseCohortNumber('abc')).toBeNull();
    expect(parseCohortNumber('1.5')).toBeNull();
    expect(parseCohortNumber('-1')).toBeNull();
    expect(parseCohortNumber('')).toBeNull();
    expect(parseCohortNumber(undefined)).toBeNull();
    expect(parseCohortNumber(null)).toBeNull();
  });

  it('isTrack narrows unknown values', () => {
    expect(isTrack('backend')).toBe(true);
    expect(isTrack(3)).toBe(false);
  });
});
