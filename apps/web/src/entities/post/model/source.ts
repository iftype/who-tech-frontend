/** 글 URL의 호스트로 블로그 플랫폼 이름을 고른다. 모르는 호스트는 null — 출처 칩을 안 그린다 */
export function getBlogSource(url: string): string | null {
  if (url.includes('velog.io')) return 'Velog';
  if (url.includes('tistory.com')) return 'Tistory';
  if (url.includes('medium.com')) return 'Medium';
  if (url.includes('github.io')) return 'GitHub';
  if (url.includes('brunch.co.kr')) return 'Brunch';
  if (url.includes('notion.site') || url.includes('notion.so')) return 'Notion';
  return null;
}
