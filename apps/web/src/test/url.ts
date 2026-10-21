import { act } from '@testing-library/react';

/** 지금 URL을 바꾼다 (화면을 그리기 전 주소를 맞출 때) */
export function setUrl(url: string): void {
  window.history.replaceState(null, '', url);
}

/** 뒤로가기·앞으로가기처럼 URL을 바꾸고 popstate를 일으킨다 */
export async function popstateTo(url: string): Promise<void> {
  await act(async () => {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

export const currentUrl = (): string => window.location.pathname + window.location.search;
