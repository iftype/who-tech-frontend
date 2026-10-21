import { describe, expect, it } from 'vitest';
import { buildCohortPath, getCohortFromPath, getFiltersFromSearch, isCohortPath } from './cohortLocation';

describe('cohort location', () => {
  it('should read the cohort number only from /cohort/<digits>', () => {
    expect(getCohortFromPath('/cohort/8')).toBe(8);
    expect(getCohortFromPath('/cohort')).toBeNull();
    expect(getCohortFromPath('/cohort/abc')).toBeNull();
    expect(getCohortFromPath('/cohort/8/extra')).toBeNull();
  });

  it('should own the list and detail paths only', () => {
    expect(isCohortPath('/cohort')).toBe(true);
    expect(isCohortPath('/cohort/12')).toBe(true);
    expect(isCohortPath('/cohort/abc')).toBe(false);
    expect(isCohortPath('/')).toBe(false);
  });

  it('should round-trip filters and omit the defaults from the query', () => {
    expect(buildCohortPath(null, 'crew', 'all')).toBe('/cohort');
    expect(buildCohortPath(8, 'crew', 'all')).toBe('/cohort/8');
    expect(buildCohortPath(8, 'staff', 'android')).toBe('/cohort/8?roleGroup=staff&track=android');
    expect(getFiltersFromSearch('?roleGroup=staff&track=android')).toEqual({ roleGroup: 'staff', track: 'android' });
    expect(getFiltersFromSearch('')).toEqual({ roleGroup: 'crew', track: 'all' });
    expect(getFiltersFromSearch('?roleGroup=boss&track=ios')).toEqual({ roleGroup: 'crew', track: 'all' });
  });
});
