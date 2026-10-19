import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { splitUrl, urlStore, useUrl } from './urlStore';

function Probe({ serverUrl = '/server', owns }: { serverUrl?: string; owns?: (p: string) => boolean }) {
  return <span data-testid="url">{useUrl(serverUrl, owns)}</span>;
}

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('urlStore', () => {
  it('should read the real URL on a client mount (not the server URL)', () => {
    window.history.replaceState(null, '', '/cohort/7?track=backend');
    render(<Probe serverUrl="/cohort/8" />);
    expect(screen.getByTestId('url')).toHaveTextContent('/cohort/7?track=backend');
  });

  it('should render the server URL on the server', () => {
    window.history.replaceState(null, '', '/cohort/7');
    expect(renderToString(<Probe serverUrl="/cohort/8" />)).toContain('/cohort/8');
  });

  it('should update synchronously on replace without a history entry', () => {
    render(<Probe />);
    const length = window.history.length;
    act(() => urlStore.replace('/?cohort=8'));
    expect(screen.getByTestId('url')).toHaveTextContent('/?cohort=8');
    expect(window.history.length).toBe(length);
  });

  it('should add a history entry on push', () => {
    render(<Probe />);
    const length = window.history.length;
    act(() => urlStore.push('/cohort/6'));
    expect(screen.getByTestId('url')).toHaveTextContent('/cohort/6');
    expect(window.history.length).toBe(length + 1);
  });

  it('should follow back/forward (popstate)', () => {
    render(<Probe />);
    act(() => {
      window.history.pushState(null, '', '/cohort/5');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByTestId('url')).toHaveTextContent('/cohort/5');
  });

  it('should keep the last owned URL while leaving for another page', () => {
    window.history.replaceState(null, '', '/cohort/8');
    render(<Probe owns={(p) => p.startsWith('/cohort')} />);
    act(() => urlStore.push('/someone'));
    expect(screen.getByTestId('url')).toHaveTextContent('/cohort/8');
  });

  it('should replace a single query param', () => {
    window.history.replaceState(null, '', '/me?tab=blog');
    act(() => urlStore.replaceParam('missionTab', 'common'));
    expect(window.location.pathname + window.location.search).toBe('/me?tab=blog&missionTab=common');
  });

  it('splitUrl separates pathname and search', () => {
    expect(splitUrl('/cohort/8?track=frontend')).toEqual({ pathname: '/cohort/8', search: '?track=frontend' });
    expect(splitUrl('/')).toEqual({ pathname: '/', search: '' });
  });
});
