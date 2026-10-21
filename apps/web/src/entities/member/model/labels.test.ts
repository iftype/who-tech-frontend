import { describe, expect, it } from 'vitest';
import { ROLE_LABEL, TRACK_LABEL, TRACK_OPTIONS, TRACK_SHORT_LABEL } from './labels';

// 화면에 손으로 쓰여 있던 이름을 옮겼다. 값과 순서가 그대로여야 화면도 그대로다
describe('member labels', () => {
  it('should keep the names the badges and filters used to spell out', () => {
    expect(TRACK_LABEL).toEqual({ frontend: '프론트엔드', backend: '백엔드', android: '안드로이드' });
    expect(TRACK_SHORT_LABEL).toEqual({ frontend: 'FE', backend: 'BE', android: 'AN' });
    expect(ROLE_LABEL).toEqual({ crew: '크루', coach: '코치', reviewer: '리뷰어' });
  });

  it('should list the track chips as 전체 then frontend, backend, android', () => {
    expect(TRACK_OPTIONS).toEqual([
      { label: '전체', value: 'all' },
      { label: '프론트엔드', value: 'frontend' },
      { label: '백엔드', value: 'backend' },
      { label: '안드로이드', value: 'android' },
    ]);
  });
});
