import { useEffect, useRef } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

import type { Palette } from './palette';
import { styles } from './styles';

export function usePulse() {
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

export function Shimmer({
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

export function CohortTabsRow({ palette, pulse }: { palette: Palette; pulse: Animated.Value }) {
  return (
    <View style={[styles.tabsRow, { borderBottomColor: palette.border }]}>
      {[36, 30, 30, 30, 30, 30, 30].map((w, i) => (
        <Shimmer key={i} palette={palette} pulse={pulse} style={{ width: w, height: 14, marginRight: 18 }} />
      ))}
    </View>
  );
}
