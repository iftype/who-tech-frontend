import { describe, expect, it } from 'vitest';
import { buildCohortPath, isCohortPath, parseCohortPath, parseCohortSearch } from './cohortLocation';

describe('cohort location', () => {
  it('should read the cohort number only from /cohort/<digits>', () => {
    expect(parseCohortPath('/cohort/8')).toBe(8);
    expect(parseCohortPath('/cohort')).toBeNull();
    expect(parseCohortPath('/cohort/abc')).toBeNull();
    expect(parseCohortPath('/cohort/8/extra')).toBeNull();
  });

  it('should own the list and detail paths only', () => {
    expect(isCohortPath('/cohort')).toBe(true);
    expect(isCohortPath('/cohort/12')).toBe(true);
    expect(isCohortPath('/cohort/abc')).toBe(false);
    expect(isCohortPath('/')).toBe(false);
  });

  it('should round-trip filters and omit the defaults from the query', () => {
    expect(buildCohortPath(null, { roleGroup: 'crew', track: null })).toBe('/cohort');
    expect(buildCohortPath(8, { roleGroup: 'crew', track: null })).toBe('/cohort/8');
    expect(buildCohortPath(8, { roleGroup: 'staff', track: 'android' })).toBe(
      '/cohort/8?roleGroup=staff&track=android',
    );
    expect(parseCohortSearch('?roleGroup=staff&track=android')).toEqual({ roleGroup: 'staff', track: 'android' });
    expect(parseCohortSearch('')).toEqual({ roleGroup: 'crew', track: null });
    // 예전 URL의 ?track=all 도 전체로 읽는다
    expect(parseCohortSearch('?track=all')).toEqual({ roleGroup: 'crew', track: null });
    expect(parseCohortSearch('?roleGroup=boss&track=ios')).toEqual({ roleGroup: 'crew', track: null });
  });
});
