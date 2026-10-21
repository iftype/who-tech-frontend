// 뮤테이션 테스트 (pnpm --filter @who-tech/web test:mutation). 느리므로 주간 워크플로에서 실행한다.
// 대상은 테스트가 있는 순수 함수부터 좁게 잡는다 (IMPROVEMENT_PLAN Phase 7)
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: 'pnpm',
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.mts' },
  mutate: [
    'src/shared/lib/utils.ts',
    'src/shared/api/http.ts',
    'src/entities/member/api/member.api.ts',
    'src/entities/post/api/post.api.ts',
    'src/features/mission-archive/utils.ts',
    // 라운드 6: 파서·URL 모양·도메인 규칙 (전부 단위 테스트가 있다)
    'src/entities/member/model/{parse,role,archive,links}.ts',
    'src/entities/post/model/{parse,source,links}.ts',
    'src/widgets/cohort-explorer/model/cohortLocation.ts',
    'src/widgets/feed/model/feedLocation.ts',
    'src/widgets/member-profile/model/profileLocation.ts',
    'src/app/settings/settingsLocation.ts',
    'src/shared/lib/urlStore.ts',
  ],
  coverageAnalysis: 'perTest',
  thresholds: { high: 80, low: 70, break: 70 },
  reporters: ['clear-text', 'progress', 'html', 'json'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  jsonReporter: { fileName: 'reports/mutation/mutation.json' },
  tempDirName: '.stryker-tmp',
  concurrency: 4,
};

export default config;
