'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { CohortBadge, RoleBadge, TrackBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Member } from '@/types';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

interface SearchDropdownProps {
  className?: string;
  compact?: boolean;
  dropdownClassName?: string;
  mobileHeader?: boolean;
}

export function SearchDropdown({
  className,
  compact = false,
  dropdownClassName,
  mobileHeader = false,
}: SearchDropdownProps) {
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

  const placeholder = mobileHeader ? '검색' : compact ? '닉네임 / ID 검색' : '닉네임 또는 GitHub ID로 검색...';
  const mobileHeaderInputScale = 0.86;

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-[560px]', className)}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border border-border bg-surface focus-within:border-accent/50',
          compact ? (mobileHeader ? 'gap-2 px-2 py-1.5' : 'px-2.5 py-2') : 'px-4 py-3',
        )}
      >
        <svg
          className={cn(
            'text-text-muted flex-shrink-0',
            compact ? (mobileHeader ? 'h-3 w-3' : 'h-3.5 w-3.5') : 'h-4 w-4',
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <div className={cn('min-w-0 flex-1', mobileHeader && 'overflow-hidden')}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={cn(
              'w-full bg-transparent text-text placeholder:text-text-muted outline-none',
              compact
                ? mobileHeader
                  ? 'origin-left text-[16px] placeholder:text-[12px] sm:text-[13px]'
                  : 'text-[13px]'
                : 'text-[16px] sm:text-[14px]',
            )}
            style={
              mobileHeader
                ? {
                    transform: `scale(${mobileHeaderInputScale})`,
                    width: `${100 / mobileHeaderInputScale}%`,
                  }
                : undefined
            }
          />
        </div>
        {!compact && (
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
            ⌘K
          </kbd>
        )}
      </div>

      {showDropdown && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-xl',
            mobileHeader && 'max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain',
            dropdownClassName,
          )}
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-[13px] text-text-muted">검색 결과가 없습니다</div>
          ) : (
            <ul>
              {results.map((member) => (
                <li key={member.githubId}>
                  <button
                    onClick={() => handleSelect(member)}
                    className="flex w-full cursor-pointer items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface-alt last:border-0"
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
                      {member.roles
                        .filter((r) => r !== 'crew')
                        .map((r) => (
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
