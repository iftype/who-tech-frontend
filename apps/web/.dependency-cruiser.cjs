// 의존 방향 규칙 (ARCHITECTURE_PLAN): app → widgets → features → entities → shared
// 지금은 보고 모드(warn). 구조 이동이 끝나면(B-6) error로 바꿔 CI에서 막는다.
// 이동 전 폴더는 목표 층에 대응시킨다: components/ui·lib·types·hooks = shared, components/layout = widgets
const SHARED = '^src/(shared|lib|types|hooks|components/ui)/';
const ENTITIES = '^src/entities/';
const FEATURES = '^src/features/';
const WIDGETS = '^src/(widgets|components/layout)/';
const APP = '^src/app/';

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment: '순환 의존 금지',
      from: {},
      to: { circular: true },
    },
    {
      name: 'shared-no-upward',
      severity: 'warn',
      comment: 'shared는 어떤 상위 층도 모른다',
      from: { path: SHARED },
      to: { path: [ENTITIES, FEATURES, WIDGETS, APP] },
    },
    {
      name: 'entities-no-upward',
      severity: 'warn',
      from: { path: ENTITIES },
      to: { path: [FEATURES, WIDGETS, APP] },
    },
    {
      name: 'entities-no-cross',
      severity: 'warn',
      comment: '엔티티끼리 직접 참조 금지',
      from: { path: '^src/entities/([^/]+)/' },
      to: { path: ENTITIES, pathNot: '^src/entities/$1/' },
    },
    {
      name: 'features-no-upward',
      severity: 'warn',
      from: { path: FEATURES },
      to: { path: [WIDGETS, APP] },
    },
    {
      name: 'features-no-cross',
      severity: 'warn',
      comment: '기능끼리 직접 참조 금지 (공통은 entities/shared로 내린다)',
      from: { path: '^src/features/([^/]+)/' },
      to: { path: FEATURES, pathNot: '^src/features/$1/' },
    },
    {
      name: 'widgets-no-upward',
      severity: 'warn',
      from: { path: WIDGETS },
      to: { path: APP },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '\\.test\\.tsx?$|__snapshots__' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
  },
};
