// API 호출 공통 계층. 서버(SSR)는 API 주소로 직접, 브라우저는 CORS 우회를 위해 Next rewrite 프록시(/api)로 보낸다
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://iftype.site';
const API_BASE_URL = typeof window === 'undefined' ? SERVER_URL : '/api';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 프로필 새로고침 제한(429). 화면은 남은 시간을 카운트다운으로 보여준다
export class RateLimitError extends ApiError {
  readonly rateLimited = true;

  constructor(
    readonly remainingSeconds: number,
    message: string,
  ) {
    super(429, message);
    this.name = 'RateLimitError';
  }
}

/** API로 요청을 보낸다. 상태 코드 처리는 호출하는 쪽이 한다 */
export function send(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
}

/** JSON 응답을 받는다. 2xx가 아니면 ApiError */
export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await send(path, init);
  if (!res.ok) throw new ApiError(res.status, `API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

type QueryValue = string | number | boolean | null | undefined;

/** 값이 없는(null·undefined) 파라미터는 빼고 쿼리스트링을 붙인다 */
export function withQuery(path: string, params: Record<string, QueryValue>): string {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter((entry): entry is [string, string | number | boolean] => entry[1] != null)
      .map(([key, value]) => [key, String(value)]),
  ).toString();
  return query ? `${path}?${query}` : path;
}
