// API 호출 공통 계층. 서버(SSR)는 API 주소로 직접, 브라우저는 CORS 우회를 위해 Next rewrite 프록시(/api)로 보낸다
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://iftype.site';
const API_BASE_URL = typeof window === 'undefined' ? SERVER_URL : '/api';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** 서버가 보낸 응답 본문 (있으면). 화면 문구가 아니라 로그·디버깅용 */
    readonly body: string = '',
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

/** 서버(SSR)에서 부를 때 Next 데이터 캐시를 seconds 동안 쓴다. 브라우저 fetch는 next 옵션을 무시한다 */
export function serverCache(seconds: number): RequestInit {
  return { next: { revalidate: seconds } };
}

/** 응답 본문을 읽되, 읽을 수 없으면 빈 문자열 (에러 경로에서 또 다른 예외를 만들지 않게) */
export function readBody(res: Response): Promise<string> {
  return res.text().catch(() => '');
}

/** API로 요청을 보낸다. 상태 코드 처리는 호출하는 쪽이 한다 */
export function send(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
}

/**
 * JSON 응답을 받는다. 2xx가 아니면 ApiError.
 * 응답 모양은 런타임에 검증하지 않는다 — 백엔드 계약 스냅샷(who-tech-backend)이 모양을 고정하므로 여기서는 타입만 믿는다
 */
export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await send(path, init);
  if (!res.ok) throw new ApiError(res.status, `API error: ${res.status} ${path}`, await readBody(res));
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
