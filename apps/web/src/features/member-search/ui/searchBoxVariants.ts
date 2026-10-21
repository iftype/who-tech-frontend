import { cva } from 'class-variance-authority';

/** 검색창이 놓이는 자리: 페이지 안(full) · 데스크톱 헤더(compact) · 모바일 헤더(mobileHeader) */
export type SearchVariant = 'full' | 'compact' | 'mobileHeader';

// 모드가 불리언 두 개(compact·mobileHeader)의 조합이던 것을 이름 있는 variant 하나로. 클래스 집합은 그대로다
export const searchBoxVariants = cva(
  'flex items-center gap-3 rounded-lg border border-border bg-surface focus-within:border-accent/50',
  { variants: { variant: { full: 'px-4 py-3', compact: 'px-2.5 py-2', mobileHeader: 'gap-2 px-2 py-1.5' } } },
);

export const searchIconVariants = cva('text-text-muted flex-shrink-0', {
  variants: { variant: { full: 'h-4 w-4', compact: 'h-3.5 w-3.5', mobileHeader: 'h-3 w-3' } },
});

export const searchInputVariants = cva('w-full bg-transparent text-text placeholder:text-text-muted outline-none', {
  variants: {
    variant: {
      full: 'text-body-lg sm:text-body',
      compact: 'text-body-sm',
      mobileHeader: 'origin-left text-body-lg placeholder:text-label sm:text-body-sm',
    },
  },
});

export const searchDropdownVariants = cva(
  'absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-xl',
  {
    variants: {
      variant: { full: '', compact: '', mobileHeader: 'max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain' },
    },
  },
);

export const SEARCH_PLACEHOLDER: Record<SearchVariant, string> = {
  full: '닉네임 또는 GitHub ID로 검색...',
  compact: '닉네임 / ID 검색',
  mobileHeader: '검색',
};
