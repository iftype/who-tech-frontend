import Link from 'next/link';
import { navLinkVariants } from '@/shared/ui';

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  /** 데스크톱 막대(bar) · 모바일 펼침 메뉴(menu) · 메뉴 줄 안에서 토글과 나란한 링크(menuInRow) */
  placement: 'bar' | 'menu' | 'menuInRow';
  onNavigate: (href: string) => void;
}

// 메뉴는 <Link>(진짜 링크: 가운데 클릭·새 탭·크롤링). 누르는 즉시 활성 표시를 옮긴다
export function NavLink({ href, label, active, placement, onNavigate }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => onNavigate(href)}
      aria-current={active ? 'page' : undefined}
      className={navLinkVariants({ placement, active })}
    >
      {label}
    </Link>
  );
}
