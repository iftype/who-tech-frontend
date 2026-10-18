import type { ReactNode } from 'react';

// 목록 구간 이름 (예: "LEVEL 1", "8기"). Divider와 함께 줄을 이룬다
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-tiny font-semibold uppercase tracking-[0.06em] text-accent-dm">{children}</span>
  );
}
