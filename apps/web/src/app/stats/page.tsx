import type { Metadata } from 'next';
import { PageContainer } from '@/shared/ui';

export const metadata: Metadata = { title: 'who.tech' };

export default function StatsPage() {
  return (
    <PageContainer spacing="plain">
      <h1 className="text-title-sm font-bold text-text mb-2">통계</h1>
      <p className="text-body-sm text-text-muted">v2에서 구현 예정</p>
    </PageContainer>
  );
}
