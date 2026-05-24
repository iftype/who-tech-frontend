# src/hooks

## 역할

여러 feature에서 공유하는 React 훅. feature 전용 훅은 `features/<name>/hooks/`에 위치.

## 경계

- ✅ feature 간 공유 로직만 이 폴���에 위치
- ❌ 특정 feature에만 쓰이는 훅은 이 폴��에 두지 않음
- ❌ 서버 컴포넌트에서 직접 호출 금지 (모두 `'use client'` 컨텍스트 전제)
