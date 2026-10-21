# src/shared/lib

## 역할

도메인을 모르는 공용 함수·훅. 어떤 상위 층도 import하지 않는다(`shared-no-upward`).

| 파일                   | 내용                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `utils.ts`             | 순수 함수: `cn`(클래스 이어 붙이기, tailwind-merge 없음 — 의도), `formatRelativeDate`, `formatDate`, `decodeHtml`                      |
| `urlStore.ts`          | URL(pathname+search)을 외부 저장소로: `urlStore.push/replace/pushParam/replaceParam`, `useUrl(serverUrl, owns)`, `splitUrl` (ADR 0005) |
| `animation.ts`         | `staggerFadeIn(i)` — 목록 행 페이드인 지연(30ms 간격, 300ms 상한)                                                                      |
| `useDebounce.ts`       | 값이 delay 동안 안 바뀌면 갱신 (검색어)                                                                                                |
| `useOutsideClick.ts`   | ref 바깥 mousedown → handler (드롭다운 닫기)                                                                                           |
| `useTransientValue.ts` | 잠깐 보였다 사라지는 값(복사됨 2초, 실패 문구 2.5초). 언마운트 때 타이머 정리                                                          |

## 경계

- ✅ 순수 함수와 React 훅 둘 다 둔다. 단, 훅은 도메인을 모르는 것만(`useDebounce`처럼). 도메인 훅은 features/widgets의 `model/`에
- ✅ API 호출은 여기 없다 — `shared/api`(http)와 엔티티의 `*.api.ts`
- ❌ `@/entities/*`, `@/features/*`, `@/widgets/*` import 금지 (depcruise가 막는다)

## 주의

- `cn`은 `filter(Boolean).join(' ')`이다. 충돌하는 클래스를 병합하지 않는다(tailwind-merge를 쓰면 지금 화면의 클래스 우선순위가 바뀔 수 있어 들이지 않았다, ADR 0003)
- `urlStore.replace`는 history 항목을 만들지 않고, `push`는 만든다. 필터·보기 전환은 replace, 뒤로가기로 돌아올 탭(설정·기수 탭)은 push
- 블로그 플랫폼 판별(`getBlogSource`)은 글 도메인의 사실이라 `entities/post/model/source.ts`에 있다 (라운드 4)
