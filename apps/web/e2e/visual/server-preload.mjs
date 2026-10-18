// 스크린샷 테스트용 next start에 --import로 미리 불러오는 스크립트
// 1. 서버 시각을 녹화 시각으로 고정한다 (SSR의 상대 시간 표시를 녹화 시점과 같게)
// 2. 로컬 fixture-server 외의 주소로 나가는 fetch를 막는다. 빌드가 운영 API 주소로 되어 있으면
//    (build:visual 대신 일반 build를 한 경우) 운영 데이터로 조용히 통과하지 않고 바로 실패한다
import { readFileSync } from 'node:fs';

const { recordedAt } = JSON.parse(readFileSync(new URL('./fixtures/meta.json', import.meta.url), 'utf8'));
const FIXED = Date.parse(recordedAt);
const RealDate = Date;

class FrozenDate extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(FIXED);
    else super(...args);
  }

  static now() {
    return FIXED;
  }
}

globalThis.Date = FrozenDate;

const realFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
    throw new Error(`[visual] 외부 요청 차단: ${url.href} — build:visual로 빌드했는지 확인`);
  }
  return realFetch(input, init);
};
