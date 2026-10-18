'use client';

import { useEffect, useState } from 'react';
import { GuideTab } from './tabs/GuideTab';
import { PrivacyTab } from './tabs/PrivacyTab';
import { ThemeTab } from './tabs/ThemeTab';
import { PageContainer } from '@/shared/ui';

type Tab = 'guide' | 'theme' | 'privacy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'theme', label: '테마' },
  { id: 'guide', label: '가이드' },
  { id: 'privacy', label: '개인정보처리방침' },
];

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState<Tab>('theme');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'guide' || tab === 'theme' || tab === 'privacy') {
      setActiveTab(tab);
    }
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState(null, '', url.pathname + url.search);
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
              className={`cursor-pointer px-4 py-2.5 text-body font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-text text-text'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
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
