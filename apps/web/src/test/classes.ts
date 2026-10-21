/** 요소(또는 클래스 문자열)의 클래스 집합. cva가 순서를 바꿔도 Tailwind 결과는 같으므로 문자열이 아니라 집합으로 비교한다 */
export const classSet = (source: Element | string | null): Set<string> =>
  new Set((typeof source === 'string' ? source : (source?.getAttribute('class') ?? '')).split(/\s+/).filter(Boolean));
