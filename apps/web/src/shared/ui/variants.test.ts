import { describe, expect, it } from 'vitest';
import { buttonVariants, chipButtonVariants } from './buttonVariants';
import { emptyStateVariants } from './EmptyState';
import { listCardVariants } from './ListCard';
import { listItemVariants } from './listItemVariants';
import { navLinkVariants, navMenuRowVariants } from './navLinkVariants';
import { optionVariants, segmentVariants } from './SegmentedControl';
import { pageTabVariants } from './TabBar';

// 화면에 손으로 쓰던 클래스를 공용 variant로 옮겼다. 클래스 집합이 그대로여야 화면도 그대로다
const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));

describe('shared/ui variants', () => {
  it('should keep the existing button and segment classes', () => {
    expect(set(buttonVariants())).toEqual(
      set(
        'inline-flex items-center justify-center gap-1 rounded border border-border text-text-muted transition-colors hover:text-text h-7 min-w-7 px-1.5 text-caption',
      ),
    );
    expect(set(buttonVariants({ variant: 'secondary', size: 'md' }))).toEqual(
      set(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-alt hover:text-text px-3 py-1.5 text-label',
      ),
    );
    expect(set(segmentVariants({ active: true }))).toEqual(
      set('cursor-pointer rounded px-2.5 py-1.5 text-caption bg-border text-text'),
    );
    expect(set(segmentVariants({ active: false }))).toEqual(
      set('cursor-pointer rounded px-2.5 py-1.5 text-caption text-text-muted hover:text-text'),
    );
  });

  it('should match the empty states and list cards that used to be styled in place', () => {
    const cases: [string, string][] = [
      // FeedList 빈 상태
      [
        emptyStateVariants({ size: 'tall' }),
        'rounded-xl border border-border bg-surface py-16 text-center text-body text-text-muted',
      ],
      // CohortMemberGrid·List 빈 상태 (Grid는 col-span-full을 className으로 덧붙인다)
      [
        emptyStateVariants(),
        'rounded-xl border border-border bg-surface px-4 py-12 text-center text-body text-text-muted',
      ],
      // FeedClient 빈 상태 (카드 없이)
      [emptyStateVariants({ frame: 'plain', size: 'tall' }), 'py-16 text-center text-body text-text-muted'],
      // FeedList 카드
      [listCardVariants(), 'overflow-hidden rounded-xl border border-border bg-surface'],
      // CohortMemberList·스켈레톤 카드
      [listCardVariants({ stack: true }), 'flex flex-col overflow-hidden rounded-xl border border-border bg-surface'],
    ];
    for (const [actual, expected] of cases) expect(set(actual)).toEqual(set(expected));
  });

  it('should match the buttons that used to be styled in place', () => {
    const cases: [string, string][] = [
      // MissionArchiveHeader 복사 버튼
      [
        buttonVariants({ variant: 'subtle', size: 'caption' }),
        'flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-caption text-text-muted hover:text-text',
      ],
      // CohortExplorer 더 보기
      [
        buttonVariants({ variant: 'more', size: 'lg' }),
        'cursor-pointer rounded-md border border-border px-4 py-2 text-body-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text disabled:cursor-default disabled:opacity-60',
      ],
      // ThemeToggle·Navbar 메뉴, DesignToggle
      [
        buttonVariants({ variant: 'toolbar', size: 'icon' }),
        'flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-border text-text-muted transition-colors hover:text-text',
      ],
      [
        buttonVariants({ variant: 'toolbar', size: 'iconText' }),
        'flex h-8 cursor-pointer items-center justify-center rounded border border-border px-2 text-caption font-semibold text-text-muted transition-colors hover:text-text',
      ],
      // PatchToast 닫기
      [buttonVariants({ variant: 'plain', size: 'inline' }), 'shrink-0 px-1 text-text-muted hover:text-text'],
      // RefreshButton
      [
        chipButtonVariants({ disabled: true }),
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-caption transition-colors border-border text-text-muted cursor-not-allowed opacity-50',
      ],
      [
        chipButtonVariants({ disabled: false }),
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-caption transition-colors border-border text-text-muted hover:text-text hover:bg-surface-alt cursor-pointer',
      ],
      // SettingsClient 탭 (transition-colors는 호출하는 쪽에서 덧붙임)
      [
        pageTabVariants({ active: true }),
        'cursor-pointer px-4 py-2.5 text-body font-medium border-b-2 -mb-px border-text text-text',
      ],
      [
        pageTabVariants({ active: false }),
        'cursor-pointer px-4 py-2.5 text-body font-medium border-b-2 -mb-px border-transparent text-text-muted hover:text-text-secondary',
      ],
      // ProfileTabs
      [
        pageTabVariants({ active: true, size: 'lg', indicator: 'accent' }),
        'px-4 py-3 text-body font-medium border-b-2 -mb-px cursor-pointer border-accent-dm text-text',
      ],
      [
        pageTabVariants({ active: false, size: 'lg', indicator: 'accent' }),
        'px-4 py-3 text-body font-medium border-b-2 -mb-px cursor-pointer border-transparent text-text-muted hover:text-text-secondary',
      ],
      // MissionArchiveHeader 미션 탭
      [
        segmentVariants({ shape: 'flush', active: true }),
        'cursor-pointer px-3 py-1.5 text-caption bg-border text-text',
      ],
      [
        segmentVariants({ shape: 'flush', active: false }),
        'cursor-pointer px-3 py-1.5 text-caption text-text-muted hover:text-text-secondary',
      ],
      // ThemeTab
      [
        optionVariants({ active: true }),
        'cursor-pointer flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-body-sm transition-colors bg-surface text-text font-medium',
      ],
      [
        optionVariants({ active: false, layout: 'stacked' }),
        'cursor-pointer flex flex-1 flex-col items-center justify-center px-3 py-3 text-body-sm transition-colors bg-transparent text-text-muted hover:text-text',
      ],
      // SearchResultItem
      [
        listItemVariants({ active: true }),
        'flex w-full cursor-pointer items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 bg-surface-alt',
      ],
      [
        listItemVariants({ active: false }),
        'flex w-full cursor-pointer items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-surface-alt',
      ],
      // Navbar
      [navLinkVariants({ active: true }), 'cursor-pointer whitespace-nowrap text-body-sm text-text'],
      [
        navLinkVariants({ active: false }),
        'cursor-pointer whitespace-nowrap text-body-sm text-text-secondary hover:text-text',
      ],
      [navLinkVariants({ placement: 'menu', active: true }), 'px-6 py-3 text-body bg-surface text-text'],
      [
        navLinkVariants({ placement: 'menu', active: false }),
        'px-6 py-3 text-body text-text-secondary hover:bg-surface hover:text-text',
      ],
      [navLinkVariants({ placement: 'menu' }), 'px-6 py-3 text-body'],
      // Navbar 모바일 메뉴의 설정 행 (링크 + 테마 토글)
      [navMenuRowVariants({ active: true }), 'flex items-center gap-3 pr-4 bg-surface text-text'],
      [
        navMenuRowVariants({ active: false }),
        'flex items-center gap-3 pr-4 text-text-secondary hover:bg-surface hover:text-text',
      ],
    ];
    for (const [actual, expected] of cases) expect(set(actual)).toEqual(set(expected));
  });
});
