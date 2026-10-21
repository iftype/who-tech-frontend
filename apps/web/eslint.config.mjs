import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// `next lint`가 15.5에서 deprecated라 ESLint CLI로 직접 돈다 (설정은 그대로 next/core-web-vitals + typescript + prettier)
const eslintConfig = [
  { ignores: ['next-env.d.ts', '.next/**', 'reports/**', 'coverage/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      // import 순서: 외부 패키지 → 절대 경로(@/) → 상대 경로. 그룹 사이 빈 줄 없이, 그룹 안은 알파벳 순
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // 배럴이 있는 모듈은 배럴로만 (query-client는 shared/api가 내보낸다)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/shared/api/*'], message: "'@/shared/api' 배럴로 import 한다" },
            { group: ['@/entities/*/*'], message: "엔티티는 '@/entities/<name>' 배럴로 import 한다" },
          ],
        },
      ],
    },
  },
  {
    // 테스트는 모듈을 통째로 바꿔 끼우려고(vi.mock) 구현 파일을 직접 가리킨다
    files: ['**/*.test.ts', '**/*.test.tsx', 'src/test/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
];

export default eslintConfig;
