// 스크린샷 테스트용 고정 API 서버.
// - 재생(기본): fixtures/api.json에 녹화된 응답만 돌려준다. 없는 요청은 404 + 로그로 남겨 테스트가 드러나게 한다
// - 녹화(RECORD=1): 운영 API로 넘겨 받은 응답을 fixtures/api.json에 저장한다.
//   녹화 후 반드시 `node e2e/visual/anonymize-fixtures.mjs`로 다른 크루의 개인 정보를 가짜 값으로 바꾼 뒤 커밋한다
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.FIXTURE_PORT ?? 4010);
const UPSTREAM = process.env.FIXTURE_UPSTREAM ?? 'https://iftype.site';
const RECORD = process.env.RECORD === '1';
const FIXTURE_FILE = fileURLToPath(new URL('./fixtures/api.json', import.meta.url));
const META_FILE = fileURLToPath(new URL('./fixtures/meta.json', import.meta.url));

const fixtures = existsSync(FIXTURE_FILE) ? JSON.parse(readFileSync(FIXTURE_FILE, 'utf8')) : {};

if (RECORD && !existsSync(META_FILE)) {
  // 처음 녹화한 시각이 테스트의 고정 시각이 된다 ("3일 전" 같은 상대 시간이 그대로 재현되도록).
  // 녹화를 처음부터 다시 하려면 fixtures/ 를 비우고 실행한다
  writeFileSync(META_FILE, `${JSON.stringify({ recordedAt: new Date().toISOString() }, null, 2)}\n`);
}

function save() {
  const sorted = Object.fromEntries(Object.entries(fixtures).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(FIXTURE_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
}

createServer(async (req, res) => {
  const key = `${req.method} ${req.url}`;

  if (req.url === '/__ready') {
    res.end('ok');
    return;
  }

  if (RECORD && !(key in fixtures)) {
    const upstream = await fetch(`${UPSTREAM}${req.url}`, { method: req.method });
    const text = await upstream.text();
    fixtures[key] = { status: upstream.status, body: text ? JSON.parse(text) : null };
    save();
  }

  const fixture = fixtures[key];
  if (!fixture) {
    console.error(`[fixture-server] 녹화되지 않은 요청: ${key}`);
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ message: `no fixture for ${key}` }));
    return;
  }
  res.writeHead(fixture.status, { 'content-type': 'application/json' });
  res.end(fixture.body === null ? '' : JSON.stringify(fixture.body));
}).listen(PORT, '127.0.0.1', () => {
  console.log(`[fixture-server] ${RECORD ? 'record' : 'replay'} on http://127.0.0.1:${PORT}`);
});
