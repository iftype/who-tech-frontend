import type { Metadata } from 'next';
import { SettingsClient } from './SettingsClient';

export const metadata: Metadata = { title: 'who.tech' };

export default function SettingsPage() {
  return <SettingsClient />;
}
