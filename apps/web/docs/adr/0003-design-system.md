# 0003 디자인 시스템: cva variant와 토큰, 누르는 요소는 모두 shared/ui

- 상태: 적용 (2026-10-19, #87 · #91 · #92)

## 배경

공용 UI 없이 화면마다 Tailwind 클래스를 직접 썼다.

- 임의 글자 크기 `text-[13px]` 같은 값이 148곳
- 원시 팔레트 색(`text-sky-400` 등)이 23곳
- 같은 className 반복이 48종류·127곳
- 모양을 직접 지정한 `<button>`이 19곳

"탭 글자 크기를 바꾸자" 같은 변경이 여러 파일 수정이 되고, 비슷하지만 조금씩 다른 버튼이 늘었다.

## 결정

1. **토큰**: 글자 크기는 `@theme` 스케일(`text-caption`, `text-body` …)로 이름만 붙이고 px 값은 그대로 둔다. 색은 의미 토큰(`text-danger`, `text-track-frontend` …)
2. **variant**: 반복되는 UI는 `shared/ui`에 cva로 둔다. 탭·칩·버튼은 `button`·`a`·`Link` 어디에나 붙도록 클래스 함수(`tabVariants({ active })`)로 준다
3. **누르는 요소는 모두 `shared/ui`**: 한 화면에서만 쓰는 버튼 모양이라도 `shared/ui`에 variant로 둔다(`pageTabVariants`, `optionVariants`, `navLinkVariants` …). 화면의 모든 버튼 모양을 한 폴더에서 보고 바꾸기 위해서다. 배치용 조합(`flex gap-2`)과 글자 스타일은 묶지 않는다
4. **CI가 지킨다**: `lint:tokens`가 임의 px, 원시 팔레트, `shared/ui` 밖 `<button>` 모양 직접 지정을 실패로 막는다
5. **화면 변화 0으로 옮긴다**: 옮긴 variant의 클래스가 원래 문자열과 같은 집합인지 `variants.test.ts`로 고정한다

## 결과

- 임의 px 0, 원시 팔레트 0, 직접 지정 버튼 0
- 반복 className은 31종류·78곳 남았고 모두 배치·글자 스타일이다
- 스크린샷 0픽셀 차이

## 버린 대안

- **컴포넌트 라이브러리(shadcn/ui 등) 도입**: 기존 디자인(Paper·Apple·Sentry 세 테마)을 그대로 유지해야 해서, 새 부품의 기본 모양을 지우는 일이 더 크다
- **"두 번 이상 쓰일 때만 공용화"를 버튼에도 적용**: 처음엔 이 규칙이었다. 그러자 한 번씩만 쓰이는 버튼 16곳이 화면에 흩어져 남았다. 버튼만은 예외로 했다
