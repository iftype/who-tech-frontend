'use client';

// 루트 레이아웃까지 실패했을 때의 마지막 화면. 레이아웃이 없으므로 html·body를 직접 그린다
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 1rem', textAlign: 'center' }}>
        <h1>who.tech</h1>
        <p>문제가 생겼습니다. 잠시 후 다시 시도해 주세요.</p>
        <button type="button" onClick={reset}>
          다시 시도
        </button>
      </body>
    </html>
  );
}
