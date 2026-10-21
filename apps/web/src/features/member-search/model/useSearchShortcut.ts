import { useEffect, type RefObject } from 'react';

interface Handlers {
  onOpen: () => void;
  onClose: () => void;
}

// ⌘K / Ctrl+K 로 검색창에 포커스, Esc 로 닫기. 헤더에 검색창이 두 개(모바일·데스크톱) 붙어 있으므로
// 화면에 안 보이는 쪽은 단축키를 무시한다 (checkVisibility가 없는 환경은 보이는 것으로 본다)
export function useSearchShortcut(inputRef: RefObject<HTMLInputElement | null>, { onOpen, onClose }: Handlers): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (inputRef.current?.checkVisibility?.() === false) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        onOpen();
      }
      if (e.key === 'Escape') {
        onClose();
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [inputRef, onOpen, onClose]);
}
