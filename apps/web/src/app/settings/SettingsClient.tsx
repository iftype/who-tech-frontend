'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';
import { cn } from '@/shared/lib/utils';
import { PageContainer, pageTabVariants } from '@/shared/ui';
import { SETTINGS_TABS, parseSettingsTab } from './settingsTab';
import { ThemeTab } from './tabs/ThemeTab';

const isSettingsPath = (pathname: string) => pathname === '/settings';

interface SettingsClientProps {
  /** 서버 컴포넌트로 그린 정적 탭 (상호작용이 없어 클라이언트 번들에 넣지 않는다) */
  guide: ReactNode;
  privacy: ReactNode;
}

// 탭은 URL(?tab=)에서 계산한다. 마운트 후 effect로 읽던 때는 테마 탭이 먼저 보였다가 바뀌었다.
// 테마 탭만 상호작용(테마 전환)이 있어 클라이언트 컴포넌트다
export function SettingsClient({ guide, privacy }: SettingsClientProps) {
  const url = useUrl('/settings', isSettingsPath);
  const activeTab = useMemo(() => parseSettingsTab(new URLSearchParams(splitUrl(url).search).get('tab')), [url]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'guide':
        return guide;
      case 'privacy':
        return privacy;
      default:
        return <ThemeTab />;
    }
  };

  return (
    <PageContainer>
      {/* 탭 헤더 */}
      <div className="mb-8 border-b border-border">
        <div role="tablist" aria-label="설정" className="flex gap-0">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => urlStore.pushParam('tab', tab.id)}
              className={cn(pageTabVariants({ active: activeTab === tab.id }), 'transition-colors')}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {renderTabContent()}
    </PageContainer>
  );
}
