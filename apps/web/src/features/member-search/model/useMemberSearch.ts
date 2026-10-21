import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { memberSearchQuery } from '@/entities/member';
import type { Member } from '@/entities/member';
import { useDebounce } from '@/shared/lib/useDebounce';
import { useOutsideClick } from '@/shared/lib/useOutsideClick';
import { useListNavigation } from './useListNavigation';
import { useSearchShortcut } from './useSearchShortcut';

// 멤버 검색 상태의 합성: 입력(300ms 디바운스) → 검색 쿼리, 단축키(⌘K·Esc), 바깥 클릭 닫기, 키보드 탐색, 선택 시 이동
export function useMemberSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [] } = useQuery(memberSearchQuery(debouncedQuery));
  const showDropdown = open && debouncedQuery.length >= 1;

  const handleSelect = useCallback(
    (member: Member) => {
      router.push(`/${member.githubId}`);
      setQuery('');
      setOpen(false);
    },
    [router],
  );

  const close = useCallback(() => setOpen(false), []);
  const openDropdown = useCallback(() => setOpen(true), []);
  useSearchShortcut(inputRef, { onOpen: openDropdown, onClose: close });
  useOutsideClick(containerRef, close);

  const { activeIndex, handleKeyDown } = useListNavigation({
    count: showDropdown ? results.length : 0,
    resetKey: debouncedQuery,
    onSelect: (index) => {
      const member = results[index];
      if (member) handleSelect(member);
    },
  });

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
