'use client';

import { useTheme } from './ThemeProvider';

export function DesignToggle() {
  const { designSystem, toggleDesign } = useTheme();

  return (
    <button
      onClick={toggleDesign}
      className="flex h-8 cursor-pointer items-center justify-center rounded border border-border px-2 text-[11px] font-semibold text-text-muted transition-colors hover:text-text"
      aria-label="디자인 시스템 전환"
      title={designSystem === 'paper' ? 'Apple 디자인으로 전환' : 'Next 디자인으로 전환'}
    >
      {designSystem === 'paper' ? 'Next' : ''}
    </button>
  );
}
