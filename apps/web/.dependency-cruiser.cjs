// 의존 방향 규칙 (ARCHITECTURE_PLAN): app → widgets → features → entities → shared
// 위반하면 CI(Web quality gate)가 실패한다. 같은 층끼리는 공개 진입점(index.ts)이 있는 entities만 서로 참조할 수 있다
const SHARED = '^src/shared/';
const ENTITIES = '^src/entities/';
const FEATURES = '^src/features/';
const WIDGETS = '^src/widgets/';
const APP = '^src/app/';

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '순환 의존 금지',
      from: {},
      to: { circular: true },
    },
    {
      name: 'shared-no-upward',
      severity: 'error',
      comment: 'shared는 어떤 상위 층도 모른다',
      from: { path: SHARED },
      to: { path: [ENTITIES, FEATURES, WIDGETS, APP] },
    },
    {
      name: 'entities-no-upward',
      severity: 'error',
      from: { path: ENTITIES },
      to: { path: [FEATURES, WIDGETS, APP] },
    },
    {
      name: 'entities-no-cross',
      severity: 'error',
      comment: '다른 엔티티는 공개 진입점(index.ts)으로만 참조한다 (예: 피드 글이 작성자 Member 타입을 씀)',
      from: { path: '^src/entities/([^/]+)/' },
      to: { path: ENTITIES, pathNot: ['^src/entities/$1/', '^src/entities/[^/]+/index\\.ts$'] },
    },
    {
      name: 'features-no-upward',
      severity: 'error',
      from: { path: FEATURES },
      to: { path: [WIDGETS, APP] },
    },
    {
      name: 'features-no-cross',
      severity: 'error',
      comment: '기능끼리 직접 참조 금지 (공통은 entities/shared로 내린다)',
      from: { path: '^src/features/([^/]+)/' },
      to: { path: FEATURES, pathNot: '^src/features/$1/' },
    },
    {
      name: 'widgets-no-upward',
      severity: 'error',
      from: { path: WIDGETS },
      to: { path: APP },
    },
    {
      name: 'features-via-index',
      severity: 'error',
      comment: '기능은 공개 진입점(index.ts)으로만 쓴다 — 안쪽 파일 구조를 바꿔도 바깥이 깨지지 않게',
      from: { path: [WIDGETS, APP] },
      to: { path: FEATURES, pathNot: '^src/features/[^/]+/index\\.ts$' },
    },
    {
      name: 'widgets-via-index',
      severity: 'error',
      comment: '위젯도 공개 진입점(index.ts)으로만. 같은 위젯 안에서는 상대 경로',
      from: { path: APP },
      to: { path: WIDGETS, pathNot: '^src/widgets/[^/]+/index\\.ts$' },
    },
    {
      name: 'widgets-no-cross',
      severity: 'error',
      comment: '위젯끼리 직접 참조 금지 (공통은 features/entities/shared로 내린다)',
      from: { path: '^src/widgets/([^/]+)/' },
      to: { path: WIDGETS, pathNot: '^src/widgets/$1/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '\\.test\\.tsx?$|__snapshots__' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
  },
};
