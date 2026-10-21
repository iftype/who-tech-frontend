import { cva } from 'class-variance-authority';

// 누르는 글자·칩·카드·줄 링크의 모양. a·Link 어디에나 붙인다. 배치(flex·여백·숨김·z)는 className으로 따로 — 모양만 여기서 한눈에 본다
export const linkVariants = cva('', {
  variants: {
    variant: {
      // 본문 글자 링크 (피드 글 제목, 알림 본문)
      text: 'text-text hover:underline',
      // 제목 링크: 호버에 강조색 (아카이브 레포·PR 제목)
      title: 'font-medium text-text hover:text-accent-dm hover:underline',
      // 보조 글자 링크 (피드 작성자)
      muted: 'text-text-secondary hover:underline',
      // 강조색 글자 링크 (404 홈으로)
      accent: 'text-accent-dm transition-opacity hover:opacity-80',
      // 고정폭 상태 링크: 색은 상태가 정한다 (PR #번호)
      mono: 'font-mono font-medium hover:opacity-80',
      // 목차 한 줄 (가이드 탭)
      toc: 'block rounded px-2 py-1.5 text-text-secondary transition-colors hover:bg-surface-alt hover:text-text',
      // 테두리 칩 (피드 출처)
      chip: 'rounded-md border border-border px-1.5 py-0.5 text-text-muted hover:bg-surface-alt',
      // 카드 (멤버 그리드)
      card: 'rounded-xl border border-border bg-surface hover:border-accent/30 hover:bg-surface-alt',
      // 목록 한 줄 (멤버 목록, 블로그 글)
      row: 'px-4 py-3 hover:bg-surface-alt',
      // 아바타 (프로필 상단)
      avatar: 'block shrink-0 transition-transform duration-200 hover:scale-105',
    },
    size: {
      body: 'text-body',
      bodySm: 'text-body-sm',
      label: 'text-label',
      caption: 'text-caption',
      tiny: 'text-tiny',
    },
    weight: { medium: 'font-medium' },
    // 카드 전체를 덮는 링크 (피드 한 줄의 제목)
    stretched: { true: "after:absolute after:inset-0 after:content-['']" },
  },
});
