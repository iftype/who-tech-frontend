import type { CSSProperties } from 'react';

const STEP_MS = 30;
const MAX_DELAY_MS = 300;

/** 목록 행이 위에서부터 차례로 나타나는 페이드인 (globals.css의 feedRowFadeIn). 지연은 300ms에서 멈춘다 */
export function staggerFadeIn(index: number): CSSProperties {
  return { animation: 'feedRowFadeIn 0.3s ease both', animationDelay: `${Math.min(index * STEP_MS, MAX_DELAY_MS)}ms` };
}
