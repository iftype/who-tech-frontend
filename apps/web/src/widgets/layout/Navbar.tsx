'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { type MouseEvent, useEffect, useState } from 'react';
import { ThemeToggle } from '@/features/theme-switch/ThemeToggle';
import { CONTAINER_MAX_STYLE, CloseIcon, MenuIcon, buttonVariants, navLinkVariants } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { urlStore } from '@/shared/lib/urlStore';

const SearchDropdown = dynamic(
  () => import('@/features/member-search/SearchDropdown').then((mod) => ({ default: mod.SearchDropdown })),
  { ssr: false },
);

const NAV_LINKS = [
  { href: '/feed', label: '피드' },
  { href: '/cohort', label: '기수 목록' },
  { href: '/settings', label: '설정' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
    setOptimisticPath(pathname);
  }, [pathname]);

  useEffect(() => {
    NAV_LINKS.forEach(({ href }) => router.prefetch(href));
  }, [router]);

  // 메뉴는 <Link>(진짜 링크: 가운데 클릭·새 탭·크롤링). 누르는 즉시 활성 표시를 옮기고 모바일 메뉴를 닫는다
  const onNavigate = (href: string) => {
    setOptimisticPath(href);
    setOpen(false);
  };
  const isActive = (href: string) => (optimisticPath ?? pathname) === href;

  // 홈(피드)에선 필터가 URL 쿼리에만 있어 Next 라우터가 같은 경로로 인식한다.
  // 이미 홈이면 <Link> 이동 대신 URL 저장소를 '/'로 바꿔 피드 필터를 초기화한다 (가짜 popstate 없이)
  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    e.preventDefault();
    urlStore.replace('/');
    window.scrollTo({ top: 0 });
  };

  const linkClass = (href: string, mobile = false) =>
    navLinkVariants({ placement: mobile ? 'menu' : 'bar', active: isActive(href) });

  return (
    <header data-nav className="sticky top-0 z-50 w-full border-b border-border bg-surface-alt/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 items-center gap-2 px-4 sm:px-6" style={CONTAINER_MAX_STYLE}>
        <Link href="/" onClick={handleLogoClick} className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="who.tech"
            width={28}
            height={28}
            unoptimized
            style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
          />
          <span className="font-mono text-body-md font-semibold text-text">who.tech</span>
          <span className="hidden sm:inline-flex items-center rounded px-1 py-0.5 text-micro font-semibold tracking-widest text-text-muted border border-border">
            BETA
          </span>
        </Link>

        <div className="min-w-0 flex-1 sm:hidden">
          <SearchDropdown
            className="max-w-none"
            compact
            mobileHeader
            dropdownClassName="fixed left-2 right-2 top-[3.65rem] z-[70] w-auto max-w-none"
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <SearchDropdown className="w-[300px] max-w-[300px] xl:w-[360px] xl:max-w-[360px]" compact />
            <div className="flex items-center gap-4 sm:gap-6">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => onNavigate(href)}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={linkClass(href)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(buttonVariants({ variant: 'toolbar', size: 'icon' }), 'sm:hidden')}
            aria-label="메뉴"
          >
            {open ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-border bg-surface-alt/95 backdrop-blur-sm">
          <div className="flex flex-col py-1">
            {NAV_LINKS.map(({ href, label }) => {
              if (href === '/settings') {
                const active = isActive(href);
                return (
                  <div
                    key={href}
                    className={`flex items-center gap-3 pr-4 ${
                      active ? 'bg-surface text-text' : 'text-text-secondary hover:bg-surface hover:text-text'
                    }`}
                  >
                    <Link
                      href={href}
                      onClick={() => onNavigate(href)}
                      aria-current={active ? 'page' : undefined}
                      className={navLinkVariants({
                        placement: 'menu',
                        className: 'flex min-w-0 flex-1 cursor-pointer items-center justify-start text-left',
                      })}
                    >
                      {label}
                    </Link>
                    <ThemeToggle />
                  </div>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => onNavigate(href)}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={cn(linkClass(href, true), 'flex items-center justify-start text-left')}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
