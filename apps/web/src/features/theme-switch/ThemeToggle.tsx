'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/providers/ThemeProvider';
import { buttonVariants } from '@/shared/ui';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button onClick={toggle} className={buttonVariants({ variant: 'toolbar', size: 'icon' })} aria-label="테마 전환">
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
