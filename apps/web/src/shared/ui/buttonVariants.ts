import { cva } from 'class-variance-authority';

// 버튼 모양 클래스. button·a·Link 어디에나 붙인다
export const buttonVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      // 테두리만 있는 작은 아이콘 링크 (GitHub·블로그 바로가기)
      outline: 'justify-center gap-1 rounded border border-border text-text-muted transition-colors hover:text-text',
      // 면 색이 있는 보조 버튼 (안내 화면의 이동 링크)
      secondary:
        'gap-1.5 rounded-md border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-alt hover:text-text',
    },
    size: {
      sm: 'h-7 min-w-7 px-1.5 text-caption',
      md: 'px-3 py-1.5 text-label',
    },
  },
  defaultVariants: { variant: 'outline', size: 'sm' },
});
