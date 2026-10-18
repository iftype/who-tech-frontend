import { StyleSheet, View } from 'react-native';

import type { TabKey } from '../config';
import { useAppTheme } from '../contexts/ThemeContext';
import { CohortSkeleton } from './skeleton/CohortSkeleton';
import { FeedSkeleton } from './skeleton/FeedSkeleton';
import { PALETTES } from './skeleton/palette';
import { SettingsSkeleton } from './skeleton/SettingsSkeleton';
import { usePulse } from './skeleton/Shimmer';

// 웹뷰 로딩 중 탭별 스켈레톤. 탭 화면은 skeleton/ 아래 파일로 나뉜다
export function WebSkeleton({ tabKey }: { tabKey: TabKey }) {
  const { isDark, design } = useAppTheme();
  const palette = PALETTES[design][isDark ? 'dark' : 'light'];
  const pulse = usePulse();

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.bg }]} pointerEvents="none">
      {tabKey === 'feed' && <FeedSkeleton palette={palette} pulse={pulse} />}
      {tabKey === 'cohort' && <CohortSkeleton palette={palette} pulse={pulse} />}
      {tabKey === 'settings' && <SettingsSkeleton palette={palette} pulse={pulse} />}
    </View>
  );
}
