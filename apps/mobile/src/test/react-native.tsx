import { createElement, type ReactNode } from 'react';

// 테스트용 react-native 스텁: 각 컴포넌트를 div로, 스타일은 평탄화해 data-style에 기록한다
type Style = Record<string, unknown> | Style[] | undefined | null | false;

function flatten(style: Style): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flatten));
  return style;
}

function host(name: string) {
  return function Host({
    style,
    children,
    pointerEvents,
  }: {
    style?: Style;
    children?: ReactNode;
    pointerEvents?: string;
  }) {
    return createElement(
      'div',
      { 'data-rn': name, 'data-style': JSON.stringify(flatten(style)), 'data-pointer-events': pointerEvents },
      children,
    );
  };
}

class AnimatedValue {
  constructor(public value: number) {}
  interpolate(config: { inputRange: number[]; outputRange: string[] }) {
    return { interpolate: config };
  }
}

const animation = () => ({ start: () => undefined, stop: () => undefined });

export const View = host('View');
export type ViewStyle = Record<string, unknown>;
export const Animated = {
  View: host('Animated.View'),
  Value: AnimatedValue,
  loop: animation,
  sequence: animation,
  timing: animation,
};
export const StyleSheet = {
  create: <T,>(styles: T) => styles,
  hairlineWidth: 0.5,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
};
