import { cva } from 'class-variance-authority';

// 버튼 모양 클래스. button·a·Link 어디에나 붙인다. 화면에 쓰는 모든 버튼 모양을 여기서 한눈에 본다
export const buttonVariants = cva('', {
  variants: {
    variant: {
      // 테두리만 있는 작은 아이콘 링크 (GitHub·블로그 바로가기)
      outline:
        'inline-flex items-center justify-center gap-1 rounded border border-border text-text-muted transition-colors hover:text-text',
      // 면 색이 있는 보조 버튼 (안내 화면의 이동 링크)
      secondary:
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-alt hover:text-text',
      // 면 색이 있는 흐린 버튼 (Markdown 복사)
      subtle:
        'flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface text-text-muted hover:text-text',
      // 목록 아래 "더 보기"
      more: 'cursor-pointer rounded-md border border-border font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text disabled:cursor-default disabled:opacity-60',
      // 상단 막대의 정사각 도구 버튼 (테마·디자인 전환, 메뉴)
      toolbar:
        'flex h-8 cursor-pointer items-center justify-center rounded border border-border text-text-muted transition-colors hover:text-text',
      // 테두리 없는 글자 버튼 (알림 닫기)
      plain: 'text-text-muted hover:text-text',
    },
    size: {
      sm: 'h-7 min-w-7 px-1.5 text-caption',
      md: 'px-3 py-1.5 text-label',
      caption: 'px-3 py-1.5 text-caption',
      lg: 'px-4 py-2 text-body-sm',
      icon: 'w-8',
      iconText: 'px-2 text-caption font-semibold',
      inline: 'shrink-0 px-1',
    },
  },
  defaultVariants: { variant: 'outline', size: 'sm' },
});

// 상태 칩 모양의 작은 버튼 (프로필 새로고침). 막혀 있으면 흐리게 하고 누를 수 없게 보인다
export const chipButtonVariants = cva(
  'inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-caption transition-colors',
  {
    variants: {
      disabled: {
        true: 'border-border text-text-muted cursor-not-allowed opacity-50',
        false: 'border-border text-text-muted hover:text-text hover:bg-surface-alt cursor-pointer',
      },
    },
    defaultVariants: { disabled: false },
  },
);
