'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { type MouseEvent, useEffect, useState, useTransition } from 'react';
import { ThemeToggle } from './ThemeToggle';

const SearchDropdown = dynamic(
  () => import('@/features/search/SearchDropdown').then((mod) => ({ default: mod.SearchDropdown })),
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
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
    setOptimisticPath(pathname);
  }, [pathname]);

  useEffect(() => {
    NAV_LINKS.forEach(({ href }) => router.prefetch(href));
  }, [router]);

  const navigate = (href: string) => {
    setOptimisticPath(href);
    setOpen(false);
    startTransition(() => {
      router.push(href);
    });
  };

  // 홈(피드)에선 필터가 replaceState로만 URL에 남아 Next 라우터가 같은 경로로 인식한다.
  // 이미 홈이면 <Link>의 소프트 내비게이션 대신 직접 URL을 비우고 popstate로 피드를 초기화한다.
  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    e.preventDefault();
    window.history.replaceState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0 });
  };

  const linkClass = (href: string, mobile = false) => {
    const active = (optimisticPath ?? pathname) === href;
    return mobile
      ? `px-6 py-3 text-[14px] ${
          active ? 'bg-surface text-text' : 'text-text-secondary hover:bg-surface hover:text-text'
        }`
      : `cursor-pointer whitespace-nowrap text-[13px] ${active ? 'text-text' : 'text-text-secondary hover:text-text'}`;
  };

  const showHeaderSearch = true;

  return (
    <header data-nav className="sticky top-0 z-50 w-full border-b border-border bg-surface-alt/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-14 items-center gap-2 px-4 sm:px-6"
        style={{ maxWidth: 'var(--container-max, 1200px)' }}
      >
        <Link href="/" onClick={handleLogoClick} className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="who.tech"
            width={28}
            height={28}
            unoptimized
            style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
          />
          <span className="font-mono text-[15px] font-semibold text-text">who.tech</span>
          <span className="hidden sm:inline-flex items-center rounded px-1 py-0.5 text-[9px] font-semibold tracking-widest text-text-muted border border-border">
            BETA
          </span>
        </Link>

        {showHeaderSearch && (
          <div className="min-w-0 flex-1 sm:hidden">
            <SearchDropdown
              className="max-w-none"
              compact
              mobileHeader
              dropdownClassName="fixed left-2 right-2 top-[3.65rem] z-[70] w-auto max-w-none"
            />
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {showHeaderSearch && (
              <SearchDropdown className="w-[300px] max-w-[300px] xl:w-[360px] xl:max-w-[360px]" compact />
            )}
            <div className="flex items-center gap-4 sm:gap-6">
              {NAV_LINKS.map(({ href, label }) => (
                <button key={href} onClick={() => navigate(href)} className={linkClass(href)}>
                  {label}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-border text-text-muted transition-colors hover:text-text"
            aria-label="메뉴"
          >
            {open ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-border bg-surface-alt/95 backdrop-blur-sm">
          <div className="flex flex-col py-1">
            {NAV_LINKS.map(({ href, label }) => {
              if (href === '/settings') {
                const active = (optimisticPath ?? pathname) === href;
                return (
                  <div
                    key={href}
                    className={`flex items-center gap-3 pr-4 ${
                      active ? 'bg-surface text-text' : 'text-text-secondary hover:bg-surface hover:text-text'
                    }`}
                  >
                    <button
                      onClick={() => navigate(href)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center justify-start px-6 py-3 text-left text-[14px]"
                    >
                      {label}
                    </button>
                    <ThemeToggle />
                  </div>
                );
              }

              return (
                <button
                  key={href}
                  onClick={() => navigate(href)}
                  className={`${linkClass(href, true)} flex items-center justify-start text-left`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
