import { describe, expect, it } from 'vitest';
import { memberKeys } from './member.keys';
import { memberDetailQuery, memberSearchQuery, mergeRefreshedMember } from './member.queries';
import type { MemberDetail } from '../model/types';

const m = (archive: unknown[]) => ({ githubId: 'a', archive }) as unknown as MemberDetail;

describe('member queries', () => {
  it('memberDetailQuery uses the detail key and never refetches by itself', () => {
    const options = memberDetailQuery('crew');
    expect(options.queryKey).toEqual(memberKeys.detail('crew'));
    expect(options.staleTime).toBe(Infinity);
    expect(options.refetchOnWindowFocus).toBe(false);
  });

  it('memberSearchQuery is keyed by the query and disabled while it is empty', () => {
    expect(memberSearchQuery('가람').queryKey).toEqual(memberKeys.search('가람'));
    expect(memberSearchQuery('가람').enabled).toBe(true);
    expect(memberSearchQuery('').enabled).toBe(false);
  });

  it('mergeRefreshedMember keeps the previous archive only when the new one is empty', () => {
    expect(mergeRefreshedMember(m([1]), m([])).archive).toEqual([1]);
    expect(mergeRefreshedMember(m([1]), m([2])).archive).toEqual([2]);
    expect(mergeRefreshedMember(undefined, m([])).archive).toEqual([]);
    expect(mergeRefreshedMember(m([]), m([])).archive).toEqual([]);
  });
});
