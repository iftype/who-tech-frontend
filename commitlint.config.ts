import type { UserConfig } from '@commitlint/types';

// who-tech-backend / who-tech-frontend 공통 규칙 (두 레포 동일하게 유지)
const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'perf', 'refactor', 'style', 'test', 'docs', 'build', 'ci', 'chore', 'revert'],
    ],
    'subject-max-length': [2, 'always', 72],
    // 한글 제목과 고유명사(Node, CI 등)를 쓰므로 대소문자 규칙은 끈다
    'subject-case': [0],
  },
};

export default config;
