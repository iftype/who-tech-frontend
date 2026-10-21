import { ThemeToggle } from '@/features/theme-switch';
import { navMenuRowVariants } from '@/shared/ui';
import { NavLink } from './NavLink';
import { NAV_LINKS, isNavActive } from '../model/navLinks';

interface MobileMenuProps {
  activeHref: string;
  onNavigate: (href: string) => void;
}

// 펼친 모바일 메뉴. 설정 행만 링크 옆에 테마 토글을 같이 둔다 (행이 색을 가지고 링크는 그 안에서 늘어난다)
export function MobileMenu({ activeHref, onNavigate }: MobileMenuProps) {
  return (
    <div className="sm:hidden border-t border-border bg-surface-alt/95 backdrop-blur-sm">
      <div className="flex flex-col py-1">
        {NAV_LINKS.map(({ href, label }) => {
          const active = isNavActive(href, activeHref);
          if (href === '/settings') {
            return (
              <div key={href} className={navMenuRowVariants({ active })}>
                <NavLink href={href} label={label} active={active} placement="menuInRow" onNavigate={onNavigate} />
                <ThemeToggle />
              </div>
            );
          }
          return (
            <NavLink key={href} href={href} label={label} active={active} placement="menu" onNavigate={onNavigate} />
          );
        })}
      </div>
    </div>
  );
}
