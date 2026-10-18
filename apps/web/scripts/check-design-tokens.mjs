#!/usr/bin/env node
// 디자인 토큰 검사 (ARCHITECTURE_PLAN B-4). 글자 크기는 globals.css @theme의 스케일(text-caption 등),
// 색은 의미 토큰(text-danger, border-track-frontend 등)만 쓰도록 임의 px·원시 팔레트 색을 막는다.
// 공용 컴포넌트(src/shared/ui)와 테스트는 제외. 위반이 있으면 실패한다 (CI Web quality gate)
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src', import.meta.url).pathname;
const RULES = [
  { name: '임의 글자 크기', pattern: /(^|[\s:'"`])text-\[\d+(\.\d+)?(px|rem)\]/ },
  {
    name: '원시 팔레트 색',
    pattern:
      /(^|[\s:'"`])(text|bg|border|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
  },
];

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(path);
    else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name)) yield path;
  }
}

const violations = [];
for (const file of sourceFiles(ROOT)) {
  const rel = relative(ROOT, file);
  if (rel.startsWith('shared/ui/')) continue;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const rule of RULES) {
        const match = rule.pattern.exec(line);
        if (match) violations.push(`src/${rel}:${i + 1} ${rule.name}: ${match[0].trim()}`);
      }
    });
}

if (violations.length > 0) {
  console.error(`디자인 토큰 위반 ${violations.length}건 (globals.css @theme의 토큰을 쓰거나 먼저 추가하세요)`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log('디자인 토큰 위반 없음');
