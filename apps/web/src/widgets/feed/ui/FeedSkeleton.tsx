// 피드 글을 불러오는 동안의 자리 표시
export function FeedSkeleton() {
  return (
    <div className="flex flex-col">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-3 border-b border-border-dim px-4 py-3.5 last:border-b-0">
          <div className="mt-0.5 h-[30px] w-[30px] flex-shrink-0 animate-pulse rounded-full bg-surface-alt" />
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 h-4 w-3/4 animate-pulse rounded bg-surface-alt" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-alt" />
          </div>
        </div>
      ))}
    </div>
  );
}
