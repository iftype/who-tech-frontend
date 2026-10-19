'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/providers/ThemeProvider';
import { OptionGroup, optionVariants } from '@/shared/ui';

const DESIGN_OPTIONS = [
  { id: 'paper' as const, label: 'Next', sub: '기본 디자인' },
  { id: 'apple' as const, label: ' Apple', sub: 'Apple 스타일' },
  { id: 'sentry' as const, label: ' Sentry', sub: 'Sentry 스타일' },
];

export function ThemeTab() {
  const { theme, toggle, designSystem, setDesign } = useTheme();

  return (
    <div className="max-w-sm flex flex-col gap-8">
      {/* 테마 */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-body font-semibold text-text">테마</p>
          <p className="text-label text-text-muted mt-0.5">화면 밝기를 선택합니다</p>
        </div>
        <OptionGroup>
          <button
            onClick={() => theme === 'dark' && toggle()}
            className={optionVariants({ active: theme === 'light' })}
          >
            <Sun size={14} />
            라이트
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => theme === 'light' && toggle()}
            className={optionVariants({ active: theme === 'dark' })}
          >
            <Moon size={14} />
            다크
          </button>
        </OptionGroup>
      </div>

      {/* 디자인 시스템 */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-body font-semibold text-text">디자인 시스템</p>
          <p className="text-label text-text-muted mt-0.5">서비스의 시각 언어를 선택합니다</p>
        </div>
        <OptionGroup>
          {DESIGN_OPTIONS.map((opt, i) => (
            <>
              {i > 0 && <div key={`sep-${opt.id}`} className="w-px bg-border flex-shrink-0" />}
              <button
                key={opt.id}
                onClick={() => setDesign(opt.id)}
                className={optionVariants({ active: designSystem === opt.id, layout: 'stacked' })}
              >
                <span className="font-semibold">{opt.label}</span>
                <span className="text-caption mt-0.5 text-text-muted font-normal">{opt.sub}</span>
              </button>
            </>
          ))}
        </OptionGroup>
      </div>
    </div>
  );
}
