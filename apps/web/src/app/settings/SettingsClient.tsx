'use client';

import { useMemo } from 'react';
import { splitUrl, urlStore, useUrl } from '@/shared/lib/urlStore';
import { GuideTab } from './tabs/GuideTab';
import { PrivacyTab } from './tabs/PrivacyTab';
import { ThemeTab } from './tabs/ThemeTab';
import { PageContainer, pageTabVariants } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

type Tab = 'guide' | 'theme' | 'privacy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'theme', label: '테마' },
  { id: 'guide', label: '가이드' },
  { id: 'privacy', label: '개인정보처리방침' },
];

function parseTab(value: string | null): Tab {
  return value === 'guide' || value === 'privacy' ? value : 'theme';
}

const isSettingsPath = (pathname: string) => pathname === '/settings';

// 탭은 URL(?tab=)에서 계산한다. 마운트 후 effect로 읽던 때는 테마 탭이 먼저 보였다가 바뀌었다
export function SettingsClient() {
  const url = useUrl('/settings', isSettingsPath);
  const activeTab = useMemo(() => parseTab(new URLSearchParams(splitUrl(url).search).get('tab')), [url]);

  const handleTabChange = (tab: Tab) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    urlStore.push(`${window.location.pathname}?${params}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'guide':
        return <GuideTab />;
      case 'privacy':
        return <PrivacyTab />;
      default:
        return <ThemeTab />;
    }
  };

  return (
    <PageContainer>
      {/* 탭 헤더 */}
      <div className="mb-8 border-b border-border">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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
