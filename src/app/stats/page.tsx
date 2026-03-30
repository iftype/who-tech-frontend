import type { Metadata } from 'next';

export const metadata: Metadata = { title: '통계' };

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <h1 className="text-[20px] font-bold text-text mb-2">통계</h1>
      <p className="text-[13px] text-text-muted">v2에서 구현 예정</p>
    </div>
  );
}
