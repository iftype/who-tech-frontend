'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';
import { urlStore } from '@/shared/lib/urlStore';

// 홈(피드)에선 필터가 URL 쿼리에만 있어 Next 라우터가 같은 경로로 인식한다.
// 이미 홈이면 <Link> 이동 대신 URL 저장소를 '/'로 바꿔 피드 필터를 초기화한다 (가짜 popstate 없이).
// `a[href="/"]`는 모바일 앱 셸이 찾는 셀렉터다
export function Logo() {
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    e.preventDefault();
    urlStore.replace('/');
    window.scrollTo({ top: 0 });
  };

  return (
    <Link href="/" onClick={handleClick} className="flex shrink-0 items-center gap-2">
      <Image
        src="/logo.png"
        alt="who.tech"
        width={28}
        height={28}
        unoptimized
        style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
      />
      <span className="font-mono text-body-md font-semibold text-text">who.tech</span>
      <span className="hidden sm:inline-flex items-center rounded px-1 py-0.5 text-micro font-semibold tracking-widest text-text-muted border border-border">
        BETA
      </span>
    </Link>
  );
}
