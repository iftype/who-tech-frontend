'use client';

import { useTheme } from '@/shared/providers/ThemeProvider';
import { buttonVariants } from '@/shared/ui';

export function DesignToggle() {
  const { designSystem, setDesign } = useTheme();
  const next = designSystem === 'paper' ? 'apple' : designSystem === 'apple' ? 'sentry' : 'paper';

  return (
    <button
      onClick={() => setDesign(next)}
      className={buttonVariants({ variant: 'toolbar', size: 'iconText' })}
      aria-label="디자인 시스템 전환"
      title={`${next === 'paper' ? 'Next' : next === 'apple' ? 'Apple' : 'Sentry'} 디자인으로 전환`}
    >
      {designSystem === 'paper' ? 'Next' : designSystem === 'apple' ? '' : ''}
    </button>
  );
}
