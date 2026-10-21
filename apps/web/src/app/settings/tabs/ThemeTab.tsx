'use client';

import { Moon, Sun } from 'lucide-react';
import { Fragment } from 'react';
import { DESIGN_SYSTEMS, type DesignSystem } from '@/shared/providers/theme';
import { useTheme } from '@/shared/providers/ThemeProvider';
import { OptionGroup, optionVariants } from '@/shared/ui';

const DESIGN_TEXT: Record<DesignSystem, { label: string; sub: string }> = {
  paper: { label: 'Next', sub: '기본 디자인' },
  apple: { label: ' Apple', sub: 'Apple 스타일' },
  sentry: { label: ' Sentry', sub: 'Sentry 스타일' },
};

// 순서는 DESIGN_SYSTEMS(단일 정의)를 따른다
const DESIGN_OPTIONS = DESIGN_SYSTEMS.map((id) => ({ id, ...DESIGN_TEXT[id] }));

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
            <Fragment key={opt.id}>
              {i > 0 && <div className="w-px bg-border flex-shrink-0" />}
              <button
                onClick={() => setDesign(opt.id)}
                className={optionVariants({ active: designSystem === opt.id, layout: 'stacked' })}
              >
                <span className="font-semibold">{opt.label}</span>
                <span className="text-caption mt-0.5 text-text-muted font-normal">{opt.sub}</span>
              </button>
            </Fragment>
          ))}
        </OptionGroup>
      </div>
    </div>
  );
}
