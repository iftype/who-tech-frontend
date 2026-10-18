'use client';

import { useTheme } from '@/shared/providers/ThemeProvider';

export function DesignToggle() {
  const { designSystem, setDesign } = useTheme();
  const next = designSystem === 'paper' ? 'apple' : designSystem === 'apple' ? 'sentry' : 'paper';

  return (
    <button
      onClick={() => setDesign(next)}
      className="flex h-8 cursor-pointer items-center justify-center rounded border border-border px-2 text-caption font-semibold text-text-muted transition-colors hover:text-text"
      aria-label="디자인 시스템 전환"
      title={`${next === 'paper' ? 'Next' : next === 'apple' ? 'Apple' : 'Sentry'} 디자인으로 전환`}
    >
      {designSystem === 'paper' ? 'Next' : designSystem === 'apple' ? '' : ''}
    </button>
  );
}
