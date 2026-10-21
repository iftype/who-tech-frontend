export const MISSION_TAB = {
  MISSION: 'mission',
  COMMON: 'common',
  PENDING: 'pending',
} as const;

export const MISSION_TAB_ITEMS = [
  { value: MISSION_TAB.MISSION, label: '미션' },
  { value: MISSION_TAB.COMMON, label: '공통' },
  { value: MISSION_TAB.PENDING, label: '확인전' },
] as const;

export { UNREGISTERED_COHORT } from '@/entities/member';
