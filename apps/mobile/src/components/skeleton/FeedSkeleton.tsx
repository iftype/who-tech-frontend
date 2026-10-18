import { Animated, StyleSheet, View } from 'react-native';

import type { Palette } from './palette';
import { CohortTabsRow, Shimmer } from './Shimmer';
import { styles } from './styles';

export function FeedSkeleton({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
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
