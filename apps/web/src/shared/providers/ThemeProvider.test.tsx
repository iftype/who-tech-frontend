import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

function Probe() {
  const { theme, toggle, designSystem, setDesign } = useTheme();
  return (
    <div>
      <output>{`${theme}/${designSystem}`}</output>
      <button onClick={toggle}>toggle</button>
      <button onClick={() => setDesign('apple')}>apple</button>
      <button onClick={() => setDesign('paper')}>paper</button>
    </div>
  );
}

const html = () => document.documentElement;
const click = (name: string) => act(() => screen.getByRole('button', { name }).click());

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    html().className = '';
    html().style.colorScheme = '';
    document.cookie = 'theme=; max-age=0';
    document.cookie = 'designSystem=; max-age=0';
  });
  afterEach(() => vi.useRealTimers());

  it('should expose the initial values from the server cookies without touching the DOM', () => {
    render(
      <ThemeProvider initialTheme="light" initialDesign="sentry">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('light/sentry');
    expect(html().className).toBe('');
  });

  it('should toggle the theme on <html>, the color scheme and the cookie', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    click('toggle');

    expect(screen.getByRole('status')).toHaveTextContent('light/paper');
    expect(html().classList.contains('dark')).toBe(false);
    expect(html().style.colorScheme).toBe('light');
    expect(document.cookie).toContain('theme=light');

    click('toggle');
    expect(html().classList.contains('dark')).toBe(true);
    expect(document.cookie).toContain('theme=dark');
  });

  it('should swap the design class and keep paper as the absence of a class', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    click('apple');
    expect(html().classList.contains('apple')).toBe(true);
    expect(document.cookie).toContain('designSystem=apple');

    click('paper');
    expect(html().classList.contains('apple')).toBe(false);
    expect(html().classList.contains('sentry')).toBe(false);
    expect(document.cookie).toContain('designSystem=paper');
  });

  it('should freeze transitions for two frames while switching', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    click('toggle');
    expect(html().classList.contains('theme-switching')).toBe(true);

    act(() => vi.advanceTimersToNextFrame());
    expect(html().classList.contains('theme-switching')).toBe(true);
    act(() => vi.advanceTimersToNextFrame());
    expect(html().classList.contains('theme-switching')).toBe(false);
  });
});
