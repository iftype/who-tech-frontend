import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

const { default: SettingsPage } = await import('./page');
const props = (sp?: Record<string, string>) => (sp ? { searchParams: Promise.resolve(sp) } : {});

describe('/settings', () => {
  it('should pass the parsed tab from the URL to the client as the server snapshot', async () => {
    const tree = (await SettingsPage(props({ tab: 'guide' }))) as ReactElement;
    expect((tree.props as { initialTab: string }).initialTab).toBe('guide');
  });

  it('should fall back to the theme tab without or with an unknown tab', async () => {
    const none = (await SettingsPage(props())) as ReactElement;
    const unknown = (await SettingsPage(props({ tab: 'x' }))) as ReactElement;
    expect([none.props, unknown.props].map((p) => (p as { initialTab: string }).initialTab)).toEqual([
      'theme',
      'theme',
    ]);
  });
});
