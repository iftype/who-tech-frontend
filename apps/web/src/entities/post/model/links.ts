/** 글 방문 경로: 프록시(/api)를 거쳐 백엔드가 조회수를 세고 원문으로 보낸다 */
export function postVisitPath(postId: number): string {
  return `/api/members/blog-posts/${postId}/visit`;
}
