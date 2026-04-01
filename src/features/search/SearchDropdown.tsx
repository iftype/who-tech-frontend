'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import type { Member } from '@/types';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function SearchDropdown() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [] } = useQuery({
    queryKey: ['members', 'search', debouncedQuery],
    queryFn: () => api.members.search({ q: debouncedQuery }),
    enabled: debouncedQuery.length >= 1,
  });

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

  return (
    <div ref={containerRef} className="relative w-full max-w-[560px]">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 focus-within:border-accent/50">
        <svg
          className="w-4 h-4 text-text-muted flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="닉네임 또는 GitHub ID로 검색..."
          className="flex-1 bg-transparent text-[16px] sm:text-[14px] text-text placeholder:text-text-muted outline-none"
        />
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
          ⌘K
        </kbd>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-surface shadow-xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-[13px] text-text-muted">검색 결과가 없습니다</div>
          ) : (
            <ul>
              {results.map((member) => (
                <li key={member.githubId}>
                  <button
                    onClick={() => handleSelect(member)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-alt transition-colors text-left border-b border-border last:border-0"
                  >
                    <Avatar src={member.avatarUrl} alt={member.nickname} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-text">{member.nickname}</span>
                        <span className="text-[12px] text-text-muted font-mono">@{member.githubId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {member.cohort && <CohortBadge cohort={member.cohort} />}
                      {member.roles.map((r) => (
                        <RoleBadge key={r} role={r} />
                      ))}
                      {member.tracks.map((t) => (
                        <TrackBadge key={t} track={t} />
                      ))}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
