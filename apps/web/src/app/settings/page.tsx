import type { Metadata } from 'next';
import { SettingsClient } from './SettingsClient';
import { parseSettingsTab } from './settingsTab';
import { GuideTab } from './tabs/GuideTab';
import { PrivacyTab } from './tabs/PrivacyTab';

export const metadata: Metadata = { title: 'who.tech' };

// 가이드·개인정보 탭은 정적 내용이라 서버에서 그려 슬롯으로 넘긴다.
// ?tab= 은 서버에서 읽어 첫 HTML부터 그 탭을 그린다 (/guide → /settings?tab=guide 가 테마 탭을 먼저 보이지 않도록)
export default async function SettingsPage({ searchParams }: { searchParams?: Promise<{ tab?: string }> }) {
  const initialTab = parseSettingsTab((await searchParams)?.tab);
  return <SettingsClient initialTab={initialTab} guide={<GuideTab />} privacy={<PrivacyTab />} />;
}
