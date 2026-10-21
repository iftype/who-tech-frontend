'use client';

import { useSyncExternalStore } from 'react';
import { CONTAINER_MAX_STYLE, buttonVariants } from '@/shared/ui';

const STORAGE_KEY = 'who-tech.patch-toast';
const PATCH_VERSION = '2026-10-02-team-blog';

// "이 버전을 닫았는가"를 localStorage를 외부 저장소로 읽는다 (useRateLimitCountdown과 같은 패턴).
// - 서버 렌더·하이드레이션은 숨김(getServerSnapshot) → 첫 그림이 서버와 같다
// - 비공개 창처럼 저장소를 못 쓰면 읽기는 "닫지 않음", 쓰기는 조용히 실패한다
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === PATCH_VERSION;
  } catch {
    return false;
  }
}

function dismiss(): void {
  try {
    localStorage.setItem(STORAGE_KEY, PATCH_VERSION);
  } catch {
    /* 저장소를 못 쓰면 이번 방문에서만 닫힌다 */
  }
  emit();
}

export function PatchToast() {
  const visible = useSyncExternalStore(
    subscribe,
    () => !isDismissed(),
    () => false,
  );

  if (!visible) return null;

  return (
    <aside className="border-b border-border bg-surface-alt/95 px-4 py-2.5 text-label text-text-secondary">
      <div className="mx-auto flex items-center gap-2" style={CONTAINER_MAX_STYLE}>
        <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-tiny font-semibold text-accent-dm">
          PATCH
        </span>
        <p className="min-w-0 flex-1 truncate">
          <a
            href="https://www.rilog.kr/feeds"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text hover:underline"
          >
            Rilog 팀 블로그
          </a>{' '}
          RSS 피드가 추가됐어요.
        </p>
        <button
          onClick={dismiss}
          className={buttonVariants({ variant: 'plain', size: 'inline' })}
          aria-label="패치내역 닫기"
        >
          닫기
        </button>
      </div>
    </aside>
  );
}
