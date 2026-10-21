'use client';

import { useId } from 'react';
import { cn } from '@/shared/lib/utils';
import { SearchIcon } from '@/shared/ui';
import { useMemberSearch } from './model/useMemberSearch';
import { SearchResultItem } from './ui/SearchResultItem';
import {
  SEARCH_PLACEHOLDER,
  searchBoxVariants,
  searchDropdownVariants,
  searchIconVariants,
  searchInputVariants,
  type SearchVariant,
} from './ui/searchBoxVariants';

interface SearchDropdownProps {
  variant?: SearchVariant;
  className?: string;
  /** 드롭다운의 위치만 (모바일 헤더는 화면에 고정) */
  dropdownClassName?: string;
}

// 모바일 헤더의 입력은 iOS 자동 확대를 피하려고 16px로 두고 scale로 줄인다 (폭은 그만큼 늘려 자리를 맞춘다)
const MOBILE_HEADER_INPUT_SCALE = 0.86;

export function SearchDropdown({ variant = 'full', className, dropdownClassName }: SearchDropdownProps) {
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

  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;
  const hasOptions = showDropdown && results.length > 0;
  const isMobileHeader = variant === 'mobileHeader';

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-[560px]', className)}>
      <div className={searchBoxVariants({ variant })}>
        <SearchIcon className={searchIconVariants({ variant })} aria-hidden="true" />
        <div className={cn('min-w-0 flex-1', isMobileHeader && 'overflow-hidden')}>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="멤버 검색"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={hasOptions ? listboxId : undefined}
            aria-activedescendant={hasOptions && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            placeholder={SEARCH_PLACEHOLDER[variant]}
            className={searchInputVariants({ variant })}
            style={
              isMobileHeader
                ? { transform: `scale(${MOBILE_HEADER_INPUT_SCALE})`, width: `${100 / MOBILE_HEADER_INPUT_SCALE}%` }
                : undefined
            }
          />
        </div>
        {variant === 'full' && (
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-tiny font-mono text-text-muted">
            ⌘K
          </kbd>
        )}
      </div>

      {showDropdown && (
        <div className={cn(searchDropdownVariants({ variant }), dropdownClassName)}>
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-body-sm text-text-muted">검색 결과가 없습니다</div>
          ) : (
            <ul id={listboxId} role="listbox" aria-label="검색 결과">
              {results.map((member, idx) => (
                <li key={member.githubId} role="none">
                  <SearchResultItem
                    id={optionId(idx)}
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
