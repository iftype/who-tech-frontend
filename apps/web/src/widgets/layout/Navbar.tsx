'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/features/theme-switch';
import { CONTAINER_MAX_STYLE } from '@/shared/ui';
import { NAV_LINKS } from './model/navLinks';
import { useActiveNav } from './model/useActiveNav';
import { Logo } from './ui/Logo';
import { MenuToggle } from './ui/MenuToggle';
import { MobileMenu } from './ui/MobileMenu';
import { NavLink } from './ui/NavLink';

const SearchDropdown = dynamic(
  () => import('@/features/member-search').then((mod) => ({ default: mod.SearchDropdown })),
  { ssr: false },
);

// 상단 바: 로고 · 검색(모바일/데스크톱 하나씩, CSS로 하나만 보임) · 메뉴 링크 · 테마 토글 · 모바일 메뉴.
// `header[data-nav]`는 모바일 앱 셸이 찾는 셀렉터다
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeHref, markActive } = useActiveNav(pathname);
  // 모바일 메뉴는 "어느 경로에서 열었는지"로 기억한다 → 경로가 바뀌면 저절로 닫힌 것으로 계산된다 (effect 없이)
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const menuOpen = openedAt === pathname;

  useEffect(() => {
    NAV_LINKS.forEach(({ href }) => router.prefetch(href));
  }, [router]);

  const onNavigate = (href: string) => {
    markActive(href);
    setOpenedAt(null);
  };

  return (
    <header data-nav className="sticky top-0 z-50 w-full border-b border-border bg-surface-alt/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 items-center gap-2 px-4 sm:px-6" style={CONTAINER_MAX_STYLE}>
        <Logo />

        <div className="min-w-0 flex-1 sm:hidden">
          <SearchDropdown variant="mobileHeader" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <SearchDropdown variant="compact" />
            <div className="flex items-center gap-4 sm:gap-6">
              {NAV_LINKS.map(({ href, label }) => (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  active={activeHref === href}
                  placement="bar"
                  onNavigate={onNavigate}
                />
              ))}
            </div>
            <ThemeToggle />
          </div>

          <MenuToggle open={menuOpen} onToggle={() => setOpenedAt(menuOpen ? null : pathname)} />
        </div>
      </nav>

      {menuOpen && <MobileMenu activeHref={activeHref} onNavigate={onNavigate} />}
    </header>
  );
}
