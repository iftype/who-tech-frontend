'use client';

import { useEffect, useState } from 'react';

const PATCH_VERSION = '2026-10-02-team-blog';

export function PatchToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem('who-tech.patch-toast') !== PATCH_VERSION);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    window.localStorage.setItem('who-tech.patch-toast', PATCH_VERSION);
    setVisible(false);
  };

  return (
    <aside className="border-b border-border bg-surface-alt/95 px-4 py-2.5 text-[12px] text-text-secondary">
      <div className="mx-auto flex items-center gap-2" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
        <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent-dm">
          PATCH
        </span>
        <p className="min-w-0 flex-1 truncate">
          <a
            href="https://www.rilog.kr/@official"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text hover:underline"
          >
            Rilog 팀 블로그
          </a>{' '}
          RSS 피드가 추가됐어요.
        </p>
        <button onClick={dismiss} className="shrink-0 px-1 text-text-muted hover:text-text" aria-label="패치내역 닫기">
          닫기
        </button>
      </div>
    </aside>
  );
}
