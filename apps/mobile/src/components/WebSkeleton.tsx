import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';

import type { TabKey } from '../config';
import { useAppTheme, type DesignSystem } from '../contexts/ThemeContext';

type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderDim: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accentBg: string;
  shimmerFrom: string;
  shimmerTo: string;
};

const PALETTES: Record<DesignSystem, { light: Palette; dark: Palette }> = {
  paper: {
    light: {
      bg: '#f5f4f0',
      surface: '#ffffff',
      surfaceAlt: '#f0efeb',
      border: '#e0deda',
      borderDim: '#e8e7e3',
      text: '#1a1917',
      textSecondary: '#6b6862',
      textMuted: '#9e9b96',
      accentBg: 'rgba(42, 193, 188, 0.08)',
      shimmerFrom: '#ece9e3',
      shimmerTo: '#f7f6f2',
    },
    dark: {
      bg: '#000000',
      surface: '#0d0d0d',
      surfaceAlt: '#111111',
      border: '#1c1c1c',
      borderDim: '#1a1a1a',
      text: '#ededed',
      textSecondary: '#888888',
      textMuted: '#555555',
      accentBg: 'rgba(42, 193, 188, 0.1)',
      shimmerFrom: '#141414',
      shimmerTo: '#1c1c1c',
    },
  },
  apple: {
    light: {
      bg: '#f5f5f7',
      surface: '#ffffff',
      surfaceAlt: '#f5f5f7',
      border: 'rgba(0, 0, 0, 0.06)',
      borderDim: 'rgba(0, 0, 0, 0.08)',
      text: '#1d1d1f',
      textSecondary: 'rgba(0, 0, 0, 0.8)',
      textMuted: 'rgba(0, 0, 0, 0.48)',
      accentBg: 'rgba(0, 113, 227, 0.08)',
      shimmerFrom: '#e8e8ec',
      shimmerTo: '#f4f4f7',
    },
    dark: {
      bg: '#000000',
      surface: '#272729',
      surfaceAlt: '#1d1d1f',
      border: 'rgba(255, 255, 255, 0.12)',
      borderDim: 'rgba(255, 255, 255, 0.06)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      textMuted: 'rgba(255, 255, 255, 0.48)',
      accentBg: 'rgba(41, 151, 255, 0.1)',
      shimmerFrom: '#2d2d30',
      shimmerTo: '#3a3a3d',
    },
  },
  sentry: {
    light: {
      bg: '#2d2248',
      surface: '#362d59',
      surfaceAlt: '#1f1633',
      border: '#362d59',
      borderDim: '#2a2050',
      text: '#ffffff',
      textSecondary: '#e5e7eb',
      textMuted: 'rgba(255, 255, 255, 0.48)',
      accentBg: 'rgba(106, 95, 193, 0.18)',
      shimmerFrom: '#3d3262',
      shimmerTo: '#4a3f72',
    },
    dark: {
      bg: '#1f1633',
      surface: '#2a1f45',
      surfaceAlt: '#150f23',
      border: '#362d59',
      borderDim: '#2a2050',
      text: '#ffffff',
      textSecondary: '#e5e7eb',
      textMuted: 'rgba(255, 255, 255, 0.48)',
      accentBg: 'rgba(106, 95, 193, 0.18)',
      shimmerFrom: '#332853',
      shimmerTo: '#3d3262',
    },
  },
};

function usePulse() {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 850, useNativeDriver: false }),
        Animated.timing(value, { toValue: 0, duration: 850, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value]);
  return value;
}

function Shimmer({
  style,
  palette,
  pulse,
}: {
  style?: ViewStyle | ViewStyle[];
  palette: Palette;
  pulse: Animated.Value;
}) {
  const backgroundColor = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.shimmerFrom, palette.shimmerTo],
  });
  return <Animated.View style={[{ backgroundColor, borderRadius: 4 }, style]} />;
}

function CohortTabsRow({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
  return (
    <View style={[styles.tabsRow, { borderBottomColor: palette.border }]}>
      {[36, 30, 30, 30, 30, 30, 30].map((w, i) => (
        <Shimmer key={i} palette={palette} pulse={pulse} style={{ width: w, height: 14, marginRight: 18 }} />
      ))}
    </View>
  );
}

function FeedSkeleton({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <View style={styles.container}>
        <CohortTabsRow palette={palette} pulse={pulse} />

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Shimmer palette={palette} pulse={pulse} style={{ width: 70, height: 26, borderRadius: 6 }} />
            <Shimmer
              palette={palette}
              pulse={pulse}
              style={{ width: 170, height: 12, marginTop: 8, borderRadius: 3 }}
            />
          </View>
          <View style={[styles.rangePill, { borderColor: palette.border, backgroundColor: palette.surface }]}>
            <Shimmer palette={palette} pulse={pulse} style={{ width: 48, height: 14, borderRadius: 4 }} />
            <Shimmer
              palette={palette}
              pulse={pulse}
              style={{ width: 30, height: 14, borderRadius: 4, marginLeft: 6 }}
            />
          </View>
        </View>

        <View style={[styles.trackRow, { borderBottomColor: palette.border }]}>
          {[30, 60, 42, 60].map((w, i) => (
            <Shimmer
              key={i}
              palette={palette}
              pulse={pulse}
              style={{ width: w, height: 18, marginRight: 8, borderRadius: 6 }}
            />
          ))}
          <View style={{ flex: 1 }} />
          <Shimmer palette={palette} pulse={pulse} style={{ width: 38, height: 12, borderRadius: 3 }} />
        </View>

        <View style={[styles.feedCard, { borderColor: palette.border, backgroundColor: palette.surface }]}>
          {[78, 64, 86, 70, 80, 60].map((titleW, i) => (
            <View
              key={i}
              style={[
                styles.feedRow,
                {
                  borderBottomColor: palette.borderDim,
                  borderBottomWidth: i === 5 ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Shimmer
                palette={palette}
                pulse={pulse}
                style={{ width: 30, height: 30, borderRadius: 15, marginTop: 2 }}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Shimmer palette={palette} pulse={pulse} style={{ width: `${titleW}%`, height: 13, borderRadius: 3 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Shimmer palette={palette} pulse={pulse} style={{ width: 50, height: 11, borderRadius: 3 }} />
                  <Shimmer
                    palette={palette}
                    pulse={pulse}
                    style={{ width: 36, height: 14, borderRadius: 7, marginLeft: 6 }}
                  />
                  <Shimmer
                    palette={palette}
                    pulse={pulse}
                    style={{ width: 24, height: 14, borderRadius: 7, marginLeft: 4 }}
                  />
                  <View style={{ flex: 1 }} />
                  <Shimmer palette={palette} pulse={pulse} style={{ width: 28, height: 10, borderRadius: 3 }} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function CohortSkeleton({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <View style={styles.container}>
        <CohortTabsRow palette={palette} pulse={pulse} />

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Shimmer palette={palette} pulse={pulse} style={{ width: 100, height: 24, borderRadius: 6 }} />
            <Shimmer
              palette={palette}
              pulse={pulse}
              style={{ width: 190, height: 11, marginTop: 8, borderRadius: 3 }}
            />
          </View>
          <View style={[styles.rangePill, { borderColor: palette.border, backgroundColor: palette.surface }]}>
            <Shimmer palette={palette} pulse={pulse} style={{ width: 36, height: 12, borderRadius: 3 }} />
            <Shimmer
              palette={palette}
              pulse={pulse}
              style={{ width: 40, height: 12, borderRadius: 3, marginLeft: 8 }}
            />
          </View>
        </View>

        <View style={[styles.trackRow, { borderBottomColor: palette.border }]}>
          {[30, 60, 42, 60].map((w, i) => (
            <Shimmer
              key={i}
              palette={palette}
              pulse={pulse}
              style={{ width: w, height: 18, marginRight: 8, borderRadius: 6 }}
            />
          ))}
          <View style={{ flex: 1 }} />
          <Shimmer palette={palette} pulse={pulse} style={{ width: 30, height: 12, borderRadius: 3 }} />
        </View>

        <View style={[styles.feedCard, { borderColor: palette.border, backgroundColor: palette.surface }]}>
          {[72, 56, 88, 64, 76, 68, 80].map((nameW, i, arr) => (
            <View
              key={i}
              style={[
                styles.memberRow,
                {
                  borderBottomColor: palette.borderDim,
                  borderBottomWidth: i === arr.length - 1 ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Shimmer palette={palette} pulse={pulse} style={{ width: 36, height: 36, borderRadius: 18 }} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Shimmer palette={palette} pulse={pulse} style={{ width: nameW, height: 13, borderRadius: 3 }} />
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                  <Shimmer palette={palette} pulse={pulse} style={{ width: 32, height: 14, borderRadius: 7 }} />
                  <Shimmer
                    palette={palette}
                    pulse={pulse}
                    style={{ width: 52, height: 14, borderRadius: 7, marginLeft: 4 }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function SettingsSkeleton({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <View style={styles.container}>
        <View style={[styles.settingsTabs, { borderBottomColor: palette.border }]}>
          <View style={[styles.settingsTab, { borderBottomColor: palette.text }]}>
            <Shimmer palette={palette} pulse={pulse} style={{ width: 32, height: 13, borderRadius: 3 }} />
          </View>
          <View style={styles.settingsTab}>
            <Shimmer palette={palette} pulse={pulse} style={{ width: 42, height: 13, borderRadius: 3 }} />
          </View>
        </View>

        <View style={{ marginTop: 8 }}>
          <Shimmer palette={palette} pulse={pulse} style={{ width: 50, height: 13, borderRadius: 3 }} />
          <Shimmer palette={palette} pulse={pulse} style={{ width: 130, height: 11, marginTop: 6, borderRadius: 3 }} />
          <View style={[styles.segGroup, { borderColor: palette.border }]}>
            <View style={[styles.segItem, { backgroundColor: palette.surface }]}>
              <Shimmer palette={palette} pulse={pulse} style={{ width: 14, height: 14, borderRadius: 7 }} />
              <Shimmer
                palette={palette}
                pulse={pulse}
                style={{ width: 32, height: 12, borderRadius: 3, marginLeft: 8 }}
              />
            </View>
            <View style={[styles.segDivider, { backgroundColor: palette.border }]} />
            <View style={styles.segItem}>
              <Shimmer palette={palette} pulse={pulse} style={{ width: 14, height: 14, borderRadius: 7 }} />
              <Shimmer
                palette={palette}
                pulse={pulse}
                style={{ width: 24, height: 12, borderRadius: 3, marginLeft: 8 }}
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 28 }}>
          <Shimmer palette={palette} pulse={pulse} style={{ width: 78, height: 13, borderRadius: 3 }} />
          <Shimmer palette={palette} pulse={pulse} style={{ width: 160, height: 11, marginTop: 6, borderRadius: 3 }} />
          <View style={[styles.segGroup, { borderColor: palette.border }]}>
            {['Next', 'Apple', 'Sentry'].map((_, i) => (
              <View key={i} style={{ flex: 1, flexDirection: 'row' }}>
                {i > 0 && <View style={[styles.segDivider, { backgroundColor: palette.border }]} />}
                <View style={[styles.segItemCol, i === 0 ? { backgroundColor: palette.surface } : null]}>
                  <Shimmer palette={palette} pulse={pulse} style={{ width: 38, height: 12, borderRadius: 3 }} />
                  <Shimmer
                    palette={palette}
                    pulse={pulse}
                    style={{ width: 54, height: 9, borderRadius: 3, marginTop: 5 }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 18,
  },
  rangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  feedCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  settingsTabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 22,
  },
  settingsTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: -StyleSheet.hairlineWidth,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  segGroup: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 12,
    maxWidth: 360,
  },
  segItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  segItemCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  segDivider: {
    width: StyleSheet.hairlineWidth,
  },
});
