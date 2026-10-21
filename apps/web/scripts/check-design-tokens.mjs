#!/usr/bin/env node
// 디자인 토큰 검사 (ARCHITECTURE_PLAN B-4). 글자 크기는 globals.css @theme의 스케일(text-caption 등),
// 색은 의미 토큰(text-danger, border-track-frontend 등)만 쓰도록 임의 px·원시 팔레트 색을 막는다.
// 누르는 요소의 모양도 shared/ui의 variant로만 정한다: <button>은 className을 문자열·템플릿으로 직접 쓰면 위반,
// <a>·<Link>는 그 리터럴에 모양 클래스(색·호버·테두리·글자 크기 등)가 있으면 위반 — 배치만 적는 리터럴("flex shrink-0")은 둔다.
// 공용 컴포넌트(src/shared/ui)와 테스트는 제외. 위반이 있으면 실패한다 (CI Web quality gate)
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

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

// 리터럴 안의 "모양" 클래스: 색·호버·테두리·둥글기·밑줄·투명도·전환·글꼴·글자 크기 (text-left 같은 정렬은 배치)
const LOOK_CLASS =
  /(^|\s)(hover:|focus:|active:|bg-|border(-|\s|$)|rounded|underline|opacity-|transition|font-|shadow|scale-|ring-|text-(?!left|right|center|justify|nowrap|wrap|balance|pretty|ellipsis))/;

// className이 문자열이거나 variant 호출 없는 템플릿이면 그 자리에서 모양을 만든 요소다.
// 버튼은 리터럴이면 바로 위반, 링크는 리터럴에 모양 클래스가 있을 때만 위반
function adHocPressables(file, source) {
  if (!file.endsWith('.tsx')) return [];
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = [];
  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText();
      const kind = tag === 'button' ? 'button' : tag === 'a' || tag === 'Link' ? 'link' : null;
      if (kind) {
        const attr = node.attributes.properties.find((a) => ts.isJsxAttribute(a) && a.name.getText() === 'className');
        const init = attr?.initializer;
        const expr = init && ts.isJsxExpression(init) ? init.expression : init;
        const literal =
          expr &&
          (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr) || ts.isTemplateExpression(expr));
        const text = literal ? expr.getText() : '';
        if (literal && !text.includes('Variants(') && (kind === 'button' || LOOK_CLASS.test(text)))
          found.push({ line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, kind });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

const violations = [];
for (const file of sourceFiles(ROOT)) {
  const rel = relative(ROOT, file);
  if (rel.startsWith('shared/ui/')) continue;
  const source = readFileSync(file, 'utf8');
  source.split('\n').forEach((line, i) => {
    for (const rule of RULES) {
      const match = rule.pattern.exec(line);
      if (match) violations.push(`src/${rel}:${i + 1} ${rule.name}: ${match[0].trim()}`);
    }
  });
  for (const { line, kind } of adHocPressables(file, source)) {
    violations.push(
      kind === 'button'
        ? `src/${rel}:${line} 버튼 모양 직접 지정: shared/ui의 variant를 쓰세요`
        : `src/${rel}:${line} 링크 모양 직접 지정: shared/ui의 linkVariants를 쓰세요 (배치 클래스는 cn()으로 덧붙이기)`,
    );
  }
}

if (violations.length > 0) {
  console.error(`디자인 토큰 위반 ${violations.length}건 (globals.css @theme의 토큰을 쓰거나 먼저 추가하세요)`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log('디자인 토큰 위반 없음');
