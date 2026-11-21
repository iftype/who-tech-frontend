// 패치 안내 띠의 "닫음" 기록. 서버(layout.tsx 쿠키 파싱)와 클라이언트(PatchToast)가 같은 값을 쓴다

export const PATCH_TOAST_COOKIE = 'patchToast';
export const PATCH_VERSION = '2026-10-02-team-blog';

/** 쿠키 값 → 이 버전을 닫았는가. 다른 버전이나 모르는 값은 닫지 않은 것 */
export function isPatchDismissed(value: unknown): boolean {
  return value === PATCH_VERSION;
}
