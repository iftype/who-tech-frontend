import { useEffect, useState } from 'react';

// 값이 delay(ms) 동안 바뀌지 않으면 그때 값으로 갱신한다 (검색어 입력 등)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
