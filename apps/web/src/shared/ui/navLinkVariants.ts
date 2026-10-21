import { cva } from 'class-variance-authority';

// 상단 이동 링크. bar는 데스크톱 막대, menu는 모바일 펼침 메뉴의 한 줄,
// menuInRow는 메뉴 줄 안에서 다른 요소(테마 토글)와 나란히 놓이는 링크 — 색은 감싼 줄(navMenuRowVariants)이 정한다
export const navLinkVariants = cva('', {
  variants: {
    placement: {
      bar: 'cursor-pointer whitespace-nowrap text-body-sm',
      menu: 'px-6 py-3 text-body flex items-center justify-start text-left',
      menuInRow: 'px-6 py-3 text-body flex min-w-0 flex-1 cursor-pointer items-center justify-start text-left',
    },
    active: { true: '', false: '' },
  },
  compoundVariants: [
    { placement: 'bar', active: true, className: 'text-text' },
    { placement: 'bar', active: false, className: 'text-text-secondary hover:text-text' },
    { placement: 'menu', active: true, className: 'bg-surface text-text' },
    { placement: 'menu', active: false, className: 'text-text-secondary hover:bg-surface hover:text-text' },
  ],
  defaultVariants: { placement: 'bar' },
});

// 모바일 메뉴에서 링크 옆에 다른 요소(테마 토글)를 함께 놓는 한 줄. 색은 menu 링크와 같다
export const navMenuRowVariants = cva('flex items-center gap-3 pr-4', {
  variants: {
    active: { true: 'bg-surface text-text', false: 'text-text-secondary hover:bg-surface hover:text-text' },
  },
});
