export function githubProfileUrl(githubId: string): string {
  return `https://github.com/${githubId}`;
}

/** 크루 상세 페이지 경로 (`app/[githubId]`). 링크·라우팅·URL 소유 판정이 같은 모양을 쓴다 */
export function memberPath(githubId: string): string {
  return `/${githubId}`;
}
