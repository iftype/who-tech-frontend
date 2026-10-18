import { Animated, StyleSheet, View } from 'react-native';

import type { Palette } from './palette';
import { CohortTabsRow, Shimmer } from './Shimmer';
import { styles } from './styles';

export function CohortSkeleton({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
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
