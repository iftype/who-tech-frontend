import { useState } from 'react';

/**
 * 메뉴의 활성 표시. 링크를 누르는 순간(markActive) 라우터가 경로를 바꾸기 전에 먼저 옮겨 놓고,
 * 경로가 실제로 바뀌면 다시 경로를 따른다.
 * 예전에는 effect로 "경로가 바뀌면 낙관값을 지우는" 식이었다. 낙관값에 "어느 경로에서 눌렀는지"를 같이 적어 두면
 * 지금 경로와 비교하는 것만으로 유효한지 알 수 있어 effect가 필요 없다 (파생 상태)
 */
export function useActiveNav(pathname: string) {
  const [optimistic, setOptimistic] = useState<{ href: string; fromPath: string } | null>(null);
  const activeHref = optimistic && optimistic.fromPath === pathname ? optimistic.href : pathname;
  const markActive = (href: string) => setOptimistic({ href, fromPath: pathname });
  return { activeHref, markActive };
}
