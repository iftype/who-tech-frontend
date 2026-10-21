import { cn } from '@/shared/lib/utils';
import { CloseIcon, MenuIcon, buttonVariants } from '@/shared/ui';

// 모바일 메뉴 여닫기. `button[aria-label="메뉴"]`는 모바일 앱 셸이 숨기려고 찾는 셀렉터다
export function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(buttonVariants({ variant: 'toolbar', size: 'icon' }), 'sm:hidden')}
      aria-label="메뉴"
    >
      {open ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
    </button>
  );
}
