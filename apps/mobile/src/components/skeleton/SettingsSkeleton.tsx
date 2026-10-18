import { Animated, View } from 'react-native';

import type { Palette } from './palette';
import { Shimmer } from './Shimmer';
import { styles } from './styles';

export function SettingsSkeleton({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
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
