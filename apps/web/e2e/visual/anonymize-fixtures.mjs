// 녹화한 응답(fixtures/api.json)에서 다른 크루의 개인 정보를 가짜 값으로 바꾼다. 녹화(RECORD=1) 직후 한 번 실행한다.
// 공개 레포에 크루 닉네임·GitHub ID·블로그 글이 영구히 남지 않게 하되, 화면 레이아웃이 같도록
// 글자 수와 문자 종류(한글/영문/숫자)는 유지한다. 저장소 주인(OWNER)의 데이터는 그대로 둔다.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const OWNER = 'iftype';
const FILE = fileURLToPath(new URL('./fixtures/api.json', import.meta.url));
const HANGUL = '가나다라마바사아자차카타파하고노도로모보소오조초코토포호구누두루무부수우주';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';

function seed(value) {
  return createHash('sha256').update(value).digest();
}

// 같은 원본은 항상 같은 가짜 값이 된다 (여러 응답에 같은 사람이 나와도 일관)
function fake(value) {
  const bytes = seed(value);
  return [...value]
    .map((ch, i) => {
      const b = bytes[i % bytes.length] + i;
      if (/[가-힣]/.test(ch)) return HANGUL[b % HANGUL.length];
      if (/[a-z]/.test(ch)) return LOWER[b % 26];
      if (/[A-Z]/.test(ch)) return LOWER[b % 26].toUpperCase();
      return ch;
    })
    .join('');
}

// 도메인(블로그 플랫폼 표시에 쓰임)은 두고 경로만 바꾼다
function fakeUrl(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}/post-${seed(url).toString('hex').slice(0, 12)}`;
  } catch {
    return fake(url);
  }
}

const PERSONAL = {
  githubId: fake,
  nickname: fake,
  manualNickname: fake,
  displayName: fake,
  authorName: fake,
  title: fake,
};
const URLS = new Set(['blog', 'url', 'rssUrl']);

function anonymize(node, ownedByOwner) {
  if (Array.isArray(node)) return node.map((item) => anonymize(item, ownedByOwner));
  if (!node || typeof node !== 'object') return node;

  // 멤버 객체, 또는 member를 품은 피드 항목이면 그 주인 기준으로 판단한다
  const owner = node.githubId ?? node.member?.githubId;
  const isOwner = owner === undefined ? ownedByOwner : owner === OWNER;

  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => {
      if (typeof value === 'string' && !isOwner) {
        if (key in PERSONAL) return [key, PERSONAL[key](value)];
        if (URLS.has(key)) return [key, fakeUrl(value)];
        if (key === 'avatarUrl') return [key, 'https://avatars.githubusercontent.com/u/0?v=4'];
      }
      return [key, anonymize(value, isOwner)];
    }),
  );
}

const fixtures = JSON.parse(readFileSync(FILE, 'utf8'));
for (const [key, fixture] of Object.entries(fixtures)) {
  // 주인의 상세·블로그 응답은 통째로 주인 소유
  const ownedByOwner = key.startsWith(`GET /members/${OWNER}`);
  fixture.body = anonymize(fixture.body, ownedByOwner);
}
writeFileSync(FILE, `${JSON.stringify(fixtures, null, 2)}\n`);
console.log(`[anonymize] ${Object.keys(fixtures).length}개 응답 익명화 완료`);
