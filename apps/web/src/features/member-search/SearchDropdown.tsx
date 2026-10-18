'use client';

import { cn } from '@/shared/lib/utils';
import { useMemberSearch } from './model/useMemberSearch';
import { SearchResultItem } from './ui/SearchResultItem';

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
  const {
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
  } = useMemberSearch();

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
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={cn(
              'w-full bg-transparent text-text placeholder:text-text-muted outline-none',
              compact
                ? mobileHeader
                  ? 'origin-left text-body-lg placeholder:text-label sm:text-body-sm'
                  : 'text-body-sm'
                : 'text-body-lg sm:text-body',
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
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-tiny font-mono text-text-muted">
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
            <div className="px-4 py-6 text-center text-body-sm text-text-muted">검색 결과가 없습니다</div>
          ) : (
            <ul>
              {results.map((member, idx) => (
                <li key={member.githubId}>
                  <SearchResultItem
                    member={member}
                    active={idx === activeIndex}
                    onSelect={() => handleSelect(member)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
