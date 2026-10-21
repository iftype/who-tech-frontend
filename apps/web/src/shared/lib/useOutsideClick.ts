import { useEffect, type RefObject } from 'react';

/** ref 바깥을 mousedown 하면 handler를 부른다 (드롭다운 닫기). handler는 최신 것을 쓴다 */
export function useOutsideClick(ref: RefObject<HTMLElement | null>, handler: () => void): void {
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [ref, handler]);
}
