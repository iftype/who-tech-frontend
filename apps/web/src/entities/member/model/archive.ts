import { UNREGISTERED_COHORT } from './constants';
import type { CohortArchive, MemberDetail } from './types';

/**
 * 상세 화면에 보여 줄 미션 아카이브: 멤버가 속한 기수의 것과 기수를 모르는 것(미등록).
 * 참여 기록이 지워진 기수의 아카이브는 숨긴다 (백엔드가 아직 지우지 않았을 수 있다)
 */
export function visibleArchive(member: Pick<MemberDetail, 'archive' | 'cohorts'>): CohortArchive[] {
  return member.archive.filter(
    (ca) => ca.cohort === UNREGISTERED_COHORT || member.cohorts.some((mc) => mc.cohort === ca.cohort),
  );
}
