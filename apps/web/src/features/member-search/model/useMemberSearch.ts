import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { memberApi, memberKeys } from '@/entities/member';
import type { Member } from '@/entities/member';
import { useDebounce } from '@/shared/lib/useDebounce';

// 멤버 검색 상태: 입력(300ms 디바운스) → 검색, ⌘K/Ctrl+K·Esc 단축키, 바깥 클릭 닫기, 위·아래·Enter 키 탐색
export function useMemberSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [] } = useQuery({
    queryKey: memberKeys.search(debouncedQuery),
    queryFn: () => memberApi.search({ q: debouncedQuery }),
    enabled: debouncedQuery.length >= 1,
  });

  // 쿼리 바뀔 때 activeIndex 초기화
  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback(
    (member: Member) => {
      router.push(`/${member.githubId}`);
      setQuery('');
      setOpen(false);
    },
    [router],
  );

  const showDropdown = open && debouncedQuery.length >= 1;

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]!);
    }
  };

  return {
    query,
    setQuery,
    setOpen,
    activeIndex,
    results,
    showDropdown,
    inputRef,
    containerRef,
    handleSelect,
    handleKeyDown,
  };
}
