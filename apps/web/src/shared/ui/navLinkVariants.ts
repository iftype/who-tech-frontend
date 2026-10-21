import { cva } from 'class-variance-authority';

// 상단 이동 링크. bar는 데스크톱 막대, menu는 모바일 펼침 메뉴의 한 줄. active가 없으면 색은 감싼 줄이 정한다
export const navLinkVariants = cva('', {
  variants: {
    placement: { bar: 'cursor-pointer whitespace-nowrap text-body-sm', menu: 'px-6 py-3 text-body' },
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
