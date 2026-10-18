import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <p className="font-mono text-display font-bold text-border">404</p>
      <p className="text-body-lg text-text-secondary">페이지를 찾을 수 없습니다</p>
      <Link href="/" className="text-body-sm text-accent-dm hover:opacity-80 transition-opacity">
        홈으로 돌아가기 →
      </Link>
    </div>
  );
}
