import { useState, type KeyboardEvent } from 'react';

interface Params {
  count: number;
  /** 바뀌면 선택을 -1로 되돌린다 (검색어가 바뀌면 이전 선택이 뜻을 잃는다) */
  resetKey: string;
  onSelect: (index: number) => void;
}

// 목록의 키보드 탐색: ↑↓는 순환, Enter는 선택. 선택 초기화는 effect 대신 렌더 중 "이전 키와 다르면" 패턴으로
export function useListNavigation({ count, resetKey, onSelect }: Params) {
  const [state, setState] = useState({ key: resetKey, activeIndex: -1 });
  const activeIndex = state.key === resetKey ? state.activeIndex : -1;

  const setActiveIndex = (update: (prev: number) => number) =>
    setState((prev) => ({ key: resetKey, activeIndex: update(prev.key === resetKey ? prev.activeIndex : -1) }));

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (count === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % count);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      onSelect(activeIndex);
    }
  };

  return { activeIndex, handleKeyDown };
}
