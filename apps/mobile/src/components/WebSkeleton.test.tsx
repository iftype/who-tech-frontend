import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DesignSystem } from '../contexts/ThemeContext';
import { WebSkeleton } from './WebSkeleton';

const theme = { isDark: false, design: 'paper' as DesignSystem };
vi.mock('../contexts/ThemeContext', () => ({ useAppTheme: () => theme }));

const DESIGNS: DesignSystem[] = ['paper', 'apple', 'sentry'];
const TABS = ['feed', 'cohort', 'settings'] as const;

describe('WebSkeleton', () => {
  for (const design of DESIGNS) {
    for (const isDark of [false, true]) {
      for (const tab of TABS) {
        it(`should render the ${tab} skeleton for ${design} ${isDark ? 'dark' : 'light'}`, () => {
          Object.assign(theme, { design, isDark });
          const { container } = render(<WebSkeleton tabKey={tab} />);
          expect(container.innerHTML).toMatchSnapshot();
        });
      }
    }
  }
});
