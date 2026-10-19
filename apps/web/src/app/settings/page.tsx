import type { Metadata } from 'next';
import { SettingsClient } from './SettingsClient';
import { GuideTab } from './tabs/GuideTab';
import { PrivacyTab } from './tabs/PrivacyTab';

export const metadata: Metadata = { title: 'who.tech' };

// 가이드·개인정보 탭은 정적 내용이라 서버에서 그려 슬롯으로 넘긴다
export default function SettingsPage() {
  return <SettingsClient guide={<GuideTab />} privacy={<PrivacyTab />} />;
}
