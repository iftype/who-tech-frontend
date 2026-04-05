'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { SearchDropdown } from '@/features/search/SearchDropdown';

const NAV_LINKS = [
  { href: '/cohort/8', label: '기수 목록' },
  { href: '/feed', label: '피드' },
  { href: '/guide', label: '가이드' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();

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

  const linkClass = (href: string, mobile = false) => {
    const active = (optimisticPath ?? pathname) === href;
    return mobile
      ? `px-6 py-3 text-[14px] transition-colors ${
          active ? 'bg-surface text-text' : 'text-text-secondary hover:bg-surface hover:text-text'
        }`
      : `cursor-pointer text-[13px] transition-colors ${active ? 'text-text' : 'text-text-secondary hover:text-text'}`;
  };

  const showHeaderSearch = pathname !== '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-alt/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="who.tech"
            width={28}
            height={28}
            style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
          />
          <span className="font-mono text-[15px] font-semibold text-text">who.tech</span>
          <span className="hidden sm:inline-flex items-center rounded px-1 py-0.5 text-[9px] font-semibold tracking-widest text-text-muted border border-border">
            BETA
          </span>
        </Link>

        {showHeaderSearch && (
          <div className="hidden min-w-0 flex-1 sm:block">
            <SearchDropdown className="max-w-[320px]" compact />
          </div>
        )}

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
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <button key={href} onClick={() => navigate(href)} className={linkClass(href)}>
                {label}
              </button>
            ))}
          </div>

          {/* Desktop theme toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
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
            {NAV_LINKS.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => navigate(href)}
                className={`${linkClass(href, true)} flex items-center justify-start text-left`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={toggle}
              className="flex cursor-pointer items-center justify-start gap-2 px-6 py-3 text-left text-[14px] text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? '라이트 모드' : '다크 모드'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
