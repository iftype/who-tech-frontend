import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-alt/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-[15px] font-semibold text-text">who.tech</span>
          <span className="inline-flex items-center rounded px-1 py-0.5 text-[9px] font-semibold tracking-widest text-text-muted border border-border">
            BETA
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/cohort/8" className="text-[13px] text-text-secondary hover:text-text transition-colors">
            기수 목록
          </Link>
          <Link href="/feed" className="text-[13px] text-text-secondary hover:text-text transition-colors">
            피드
          </Link>
          <Link href="/stats" className="text-[13px] text-text-secondary hover:text-text transition-colors">
            통계
          </Link>
          <Link href="/guide" className="text-[13px] text-text-secondary hover:text-text transition-colors">
            가이드
          </Link>
        </div>
      </nav>
    </header>
  );
}
