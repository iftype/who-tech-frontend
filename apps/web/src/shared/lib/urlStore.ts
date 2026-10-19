import { useRef, useSyncExternalStore } from 'react';

// 브라우저 URL을 React 바깥의 저장소로 다룬다.
// - 읽기: useSyncExternalStore 로 pathname+search 를 구독한다 (상태를 useState로 복사해 두지 않는다)
// - 쓰기: push/replace 가 History API를 부른 뒤 구독자에게 알린다. replaceState/pushState 는 popstate를
//   일으키지 않으므로 직접 알려야 같은 이벤트 안에서 화면이 바뀐다
// - 뒤로가기·앞으로가기(popstate)도 같은 구독으로 들어온다
// Next 15는 window.history.pushState/replaceState 호출을 라우터와 동기화한다

type Listener = () => void;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

function currentUrl(): string {
  return window.location.pathname + window.location.search;
}

export const urlStore = {
  subscribe,
  getSnapshot: currentUrl,
  /** 히스토리에 새 항목을 쌓는다 (뒤로가기로 돌아올 수 있는 이동: 기수 탭, 설정 탭) */
  push(url: string): void {
    window.history.pushState(null, '', url);
    emit();
  },
  /** 지금 항목을 바꾼다 (필터처럼 뒤로가기 대상이 아닌 변경) */
  replace(url: string): void {
    window.history.replaceState(null, '', url);
    emit();
  },
  /** 지금 URL의 쿼리 하나만 바꿔 replace 한다 */
  replaceParam(key: string, value: string): void {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    urlStore.replace(`${window.location.pathname}?${params}`);
  },
};

/**
 * 지금 URL(pathname+search). 서버 렌더와 하이드레이션 중에는 serverUrl(페이지가 받은 값으로 만든 URL)을 쓰고,
 * 그 뒤로는 실제 URL을 쓴다 → 하이드레이션 불일치 없이 "URL이 단일 소스" 를 지킨다.
 * owns(pathname)가 false인 URL(다른 페이지로 떠나는 중)은 무시하고 마지막 값을 유지해, 떠나는 화면이
 * 엉뚱한 상태로 다시 그려지지 않게 한다
 */
export function useUrl(serverUrl: string, owns: (pathname: string) => boolean = () => true): string {
  const last = useRef(serverUrl);
  const getSnapshot = () => {
    const url = currentUrl();
    if (owns(window.location.pathname)) last.current = url;
    return last.current;
  };
  return useSyncExternalStore(subscribe, getSnapshot, () => serverUrl);
}

export function splitUrl(url: string): { pathname: string; search: string } {
  const index = url.indexOf('?');
  return index === -1 ? { pathname: url, search: '' } : { pathname: url.slice(0, index), search: url.slice(index) };
}
