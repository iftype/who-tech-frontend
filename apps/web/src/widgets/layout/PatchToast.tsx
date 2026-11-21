'use client';

import { useSyncExternalStore } from 'react';
import { CONTAINER_MAX_STYLE, buttonVariants, linkVariants } from '@/shared/ui';
import { PATCH_TOAST_COOKIE, PATCH_VERSION, isPatchDismissed } from './model/patchToast';

// 쿠키로 옮기기 전에 닫은 사람의 기록이 여기 남아 있다
const LEGACY_STORAGE_KEY = 'who-tech.patch-toast';

// "이 버전을 닫았는가"를 쿠키에 둔다 (테마와 같은 방식).
// - 서버가 쿠키를 읽어 띠를 HTML에 같이 그린다 → 하이드레이션 뒤에 띠가 끼어들어 본문을 밀지 않는다
// - 쿠키를 못 쓰면 읽기는 "닫지 않음", 쓰기는 조용히 실패한다
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function readCookie(): boolean {
  try {
    return document.cookie.split('; ').some((pair) => {
      const [name, value] = pair.split('=');
      return name === PATCH_TOAST_COOKIE && isPatchDismissed(value);
    });
  } catch {
    return false;
  }
}

function readLegacyStorage(): boolean {
  try {
    return isPatchDismissed(localStorage.getItem(LEGACY_STORAGE_KEY));
  } catch {
    return false;
  }
}

function writeCookie(): void {
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${PATCH_TOAST_COOKIE}=${PATCH_VERSION}; path=/; max-age=31536000; SameSite=Lax${secure}`;
  } catch {
    /* 쿠키를 못 쓰면 이번 방문에서만 닫힌다 */
  }
}

// 쿠키가 막힌 환경에서도 이번 방문 동안은 닫힌 채로 둔다
let dismissedThisVisit = false;

function isDismissed(): boolean {
  return dismissedThisVisit || readCookie() || readLegacyStorage();
}

function subscribe(listener: () => void): () => void {
  // 예전에 localStorage로 닫은 사람은 쿠키로 옮겨 적는다 → 다음 방문부터 서버가 띠를 그리지 않는다
  if (readLegacyStorage() && !readCookie()) writeCookie();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function dismiss(): void {
  dismissedThisVisit = true;
  writeCookie();
  emit();
}

interface PatchToastProps {
  /** 서버가 쿠키로 판단한 첫 상태. 서버 렌더와 하이드레이션이 이 값으로 같은 그림을 그린다 */
  initialVisible: boolean;
}

export function PatchToast({ initialVisible }: PatchToastProps) {
  const visible = useSyncExternalStore(
    subscribe,
    () => !isDismissed(),
    () => initialVisible,
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
            className={linkVariants({ variant: 'text', weight: 'medium' })}
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
