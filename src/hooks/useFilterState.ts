import { useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'who-tech:filters';

function readFilters(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeFilters(filters: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

function readUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function useFilterState<T extends Record<string, unknown>>(
  pageKey: string,
  defaults: T,
): [T, (patch: Partial<T>) => void, () => string, boolean] {
  const defaultsRef = useRef(defaults);
  const [state, setState] = useState<T>(defaults);
  const [hydrated, setHydrated] = useState(false);

  // 우선순위: localStorage > URL params > defaults
  // localStorage에 저장값 없을 때만 URL params를 읽고, 읽은 값을 localStorage에 저장함
  useEffect(() => {
    const d = defaultsRef.current;
    const stored = readFilters();
    const pageFilters = stored[pageKey] as T | undefined;

    if (pageFilters) {
      setState((prev) => ({ ...prev, ...pageFilters }));
    } else {
      const urlParams = readUrlParams();
      const urlFilters = Object.fromEntries(
        Object.entries(d).map(([key]) => {
          const value = urlParams[key];
          if (value === undefined) return [key, d[key]];
          if (typeof d[key] === 'number') return [key, Number(value)];
          if (typeof d[key] === 'boolean') return [key, value === 'true'];
          return [key, value];
        }),
      ) as T;

      if (Object.keys(urlParams).length > 0) {
        writeFilters({ ...stored, [pageKey]: urlFilters });
      }

      setState((prev) => ({ ...prev, ...urlFilters }));
    }

    setHydrated(true);
  }, [pageKey]);

  const apply = useCallback(
    (patch: Partial<T>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        const stored = readFilters();
        writeFilters({ ...stored, [pageKey]: next });
        return next;
      });
    },
    [pageKey],
  );

  const getShareUrl = useCallback(() => {
    const d = defaultsRef.current;
    const params = new URLSearchParams();
    Object.entries(state).forEach(([key, value]) => {
      if (value !== d[key as keyof T] && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });
    const query = params.toString();
    return query ? `${window.location.pathname}?${query}` : window.location.pathname;
  }, [state]);

  return [state, apply, getShareUrl, hydrated];
}
