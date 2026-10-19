import { useCallback, useEffect, useSyncExternalStore } from 'react';

// 프로필 새로고침의 "N초 후 다시" 카운트다운. 만료 시각을 localStorage에 두고 남은 초를 외부 저장소로 읽는다.
// - 서버 렌더·하이드레이션은 0초(getServerSnapshot) → 예전처럼 첫 렌더에서 localStorage를 읽어 생기던 하이드레이션 불일치가 없다
// - 남은 초는 Date.now()로 계산해 탭이 잠들었다 깨어나도 정확하다
// - 1초 타이머는 구독자가 있을 때만 돈다
const keyOf = (githubId: string) => `rateLimit_${githubId}`;

const listeners = new Set<() => void>();
let ticker: ReturnType<typeof setInterval> | undefined;

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  ticker ??= setInterval(emit, 1000);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
    if (listeners.size === 0 && ticker !== undefined) {
      clearInterval(ticker);
      ticker = undefined;
    }
  };
}

function readExpiresAt(githubId: string): number | null {
  try {
    const value = localStorage.getItem(keyOf(githubId));
    return value ? Number(value) : null;
  } catch {
    return null;
  }
}

function remainingSeconds(githubId: string): number {
  const expiresAt = readExpiresAt(githubId);
  if (!expiresAt) return 0;
  const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

export function useRateLimitCountdown(githubId: string) {
  const remaining = useSyncExternalStore(
    subscribe,
    () => remainingSeconds(githubId),
    () => 0,
  );

  // 끝난 카운트다운의 저장값은 지운다. remaining만 보면 안 된다: 하이드레이션 중에는 서버 스냅샷(0)이라
  // 아직 유효한 카운트다운을 지워 버린다 → 저장된 만료 시각이 실제로 지났을 때만 지운다
  useEffect(() => {
    const expiresAt = readExpiresAt(githubId);
    if (remaining === 0 && expiresAt !== null && expiresAt <= Date.now()) {
      try {
        localStorage.removeItem(keyOf(githubId));
      } catch {
        /* 저장소를 못 쓰면 남은 초도 0으로 읽힌다 */
      }
    }
  }, [remaining, githubId]);

  const start = useCallback(
    (seconds: number) => {
      try {
        localStorage.setItem(keyOf(githubId), String(Date.now() + seconds * 1000));
      } catch {
        /* 저장소를 못 쓰면 카운트다운 없이 동작한다 */
      }
      emit();
    },
    [githubId],
  );

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(keyOf(githubId));
    } catch {
      /* noop */
    }
    emit();
  }, [githubId]);

  return { remaining, start, clear };
}
