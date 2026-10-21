import { describe, expect, it } from 'vitest';
import { trackBadgeVariants } from './trackBadgeVariants';

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const BASE = 'inline-flex items-center px-1.5 py-0.5 rounded text-caption font-medium border';

// shared Badge의 frontend·backend·android tone을 옮겨 왔다. 클래스 집합이 그대로여야 화면도 그대로다
describe('trackBadgeVariants', () => {
  it.each([
    ['frontend', 'text-track-frontend border-track-frontend/20 bg-track-frontend/10'],
    ['backend', 'text-track-backend border-track-backend/20 bg-track-backend/10'],
    ['android', 'text-track-android border-track-android/20 bg-track-android/10'],
  ] as const)('should keep the %s track classes', (track, tone) => {
    expect(set(trackBadgeVariants({ track }))).toEqual(set(`${BASE} ${tone}`));
  });

  it('should fall back to the neutral badge when the member has no track', () => {
    expect(set(trackBadgeVariants({ track: undefined }))).toEqual(
      set(`${BASE} text-text-secondary border-border bg-surface`),
    );
  });
});
