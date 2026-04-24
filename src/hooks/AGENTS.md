# src/hooks

## 역할

여러 feature에서 공유하는 React 훅. feature 전용 훅은 `features/<name>/hooks/`에 위치.

## 경계

- ✅ feature 간 공유 로직만 이 폴더에 위치
- ❌ 특정 feature에만 쓰이는 훅은 이 폴더에 두지 않음
- ❌ 서버 컴포넌트에서 직접 호출 금지 (모두 `'use client'` 컨텍스트 전제)

## useFilterState 규약

**우선순위**: localStorage > URL params > defaults  
(localStorage에 저장값 없을 때만 URL params를 읽고, 읽은 값을 localStorage에 저장)

| 반환값        | 타입                          | 설명                                     |
| ------------- | ----------------------------- | ---------------------------------------- |
| `state`       | `T`                           | 현재 필터 값                             |
| `apply`       | `(patch: Partial<T>) => void` | 필터 변경 + localStorage 저장            |
| `getShareUrl` | `() => string`                | 기본값과 다른 필터만 URL params로 직렬화 |
| `hydrated`    | `boolean`                     | localStorage 로드 완료 신호              |

**pageKey 네임스페이스**:

- `'crew'` — cohort 페이지 역할/트랙 필터
- `'feed'` — 피드 페이지 기수/기간/트랙 필터
- 새 페이지 추가 시 고유한 문자열 사용

**저장 키**: `'who-tech:filters'` (단일 JSON 객체, pageKey별 네임스페이스)

## 주의

- `defaults` 객체를 `useRef`로 캡처 — 인라인 객체 리터럴을 deps에 넣으면 무한 루프 발생
- `typeof window === 'undefined'` 분기 필수 (readFilters, writeFilters, readUrlParams)
- 초기 render는 항상 `defaults` 반환 (SSR 안전), `useEffect` 후 localStorage 값으로 업데이트
