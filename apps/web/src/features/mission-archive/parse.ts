import { MISSION_TAB, MISSION_TAB_ITEMS } from './constants';
import type { MissionTab } from './types';

/** URL의 missionTab 값. 모르는 값은 기본 탭(미션) */
export function parseMissionTab(value: string | null | undefined): MissionTab {
  const found = MISSION_TAB_ITEMS.find((item) => item.value === value);
  return found ? found.value : MISSION_TAB.MISSION;
}
