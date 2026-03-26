# frontend

우아한테크코스 크루 검색 서비스의 프론트엔드.

## Tech Stack

- **언어**: TypeScript
- **번들러**: Vite
- **스타일**: Tailwind CSS (예정)
- **v3 이후**: React로 마이그레이션 예정

## 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 20.18.0 (`.node-version` 참고)
- asdf 또는 nvm 사용 시 자동 버전 전환

```bash
npm install
npm run dev       # http://localhost:5173
```

## 스크립트

| 명령어             | 설명                        |
| ------------------ | --------------------------- |
| `npm run dev`      | 개발 서버 (Vite, port 5173) |
| `npm run build`    | 프로덕션 빌드               |
| `npm run preview`  | 빌드 결과 미리보기          |
| `npm run lint`     | ESLint 검사                 |
| `npm run lint:fix` | ESLint 자동 수정            |
| `npm run format`   | Prettier 포맷               |

## 코드 컨벤션

- ESLint flat config (`eslint.config.ts`)
- Prettier: semi true, singleQuote true, printWidth 120
- tsconfig: moduleResolution Bundler (Vite 최적화), DOM 타입 포함
- pre-commit: lint-staged (변경 파일만 검사)
- commit-msg: commitlint (Conventional Commits)

## 커밋 단위 가이드

작업 단위를 잘게 나눠서 커밋한다.

```
chore: 프로젝트 초기 설정 (tsconfig, package.json)
chore: eslint + prettier 설정
chore: husky + commitlint 설정
chore: vscode 설정 추가
feat: 로그인 페이지 추가
fix: 검색 결과 렌더링 오류 수정
docs: readme 업데이트
```

- 커밋 메시지는 소문자로 시작
- 한 커밋에 여러 관심사를 섞지 않는다
- subject는 72자 이내

## 브랜치 전략

```
main     ← 배포 브랜치 (PR + 리뷰 1명 필수)
develop  ← 통합 브랜치
feat/#이슈번호-설명
fix/#이슈번호-설명
chore/설명
```

## 버전 로드맵

| 버전 | 주요 기능                                 |
| ---- | ----------------------------------------- |
| v1   | 크루 검색, 미션 레포/PR 조회 (Vanilla TS) |
| v2   | GitHub 로그인, 팔로우, 기수별 리스트      |
| v3   | React 마이그레이션, 블로그 새 글 목록     |
| v4   | 오픈미션 워크스페이스 분리                |
| v5   | 워크스페이스 단위 조직 관리 (미정)        |
