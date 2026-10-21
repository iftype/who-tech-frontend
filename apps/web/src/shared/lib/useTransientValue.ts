import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 잠깐 보였다 사라지는 값 (복사됨 표시, 실패 안내 문구). show(value)로 켜면 ms 뒤 null로 돌아간다.
 * 다시 show하면 타이머를 새로 잰다. 언마운트 때 타이머를 정리해 사라진 화면에 setState하지 않는다
 */
export function useTransientValue<T>(ms: number): [T | null, (value: T) => void, () => void] {
  const [value, setValue] = useState<T | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const clear = useCallback(() => {
    clearTimeout(timer.current);
    setValue(null);
  }, []);

  const show = useCallback(
    (next: T) => {
      clearTimeout(timer.current);
      setValue(next);
      timer.current = setTimeout(() => setValue(null), ms);
    },
    [ms],
  );

  return [value, show, clear];
}
