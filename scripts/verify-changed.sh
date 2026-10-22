#!/bin/bash
# 바뀐 파일만 빠르게 검사한다 (하네스 L2, 백엔드 scripts/verify-changed.sh와 같은 모양). 어떤 도구에서든 같은 스크립트를 부른다:
#   Claude Code — .claude/hooks/stop-verify.sh (Stop 훅), 그 밖 — 직접 실행 `scripts/verify-changed.sh`
# 성공 0, 실패 1. 실패 내용은 stderr. 실행마다 .git/harness/log.jsonl에 한 줄
# 같은 변경(지문)이 이미 통과했으면 다시 검사하지 않는다. 스크린샷(visual)·빌드는 CI 몫
set -uo pipefail

root="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$root"
state=".git/harness"; mkdir -p "$state"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 && nvm use >/dev/null 2>&1

changed="$( { git diff --name-only HEAD; git ls-files --others --exclude-standard; } | sort -u | while read -r f; do [ -f "$f" ] && echo "$f"; done)"
now_ms() { python3 -c 'import time;print(int(time.time()*1000))'; }
log() { printf '%s\n' "$1" >> "$state/log.jsonl"; }
started="$(now_ms)"

if [ -z "$changed" ]; then
  log "{\"ts\":$started,\"result\":\"skip\",\"reason\":\"no-changes\",\"checks\":[],\"ms\":0}"
  exit 0
fi

fingerprint="$( { git diff HEAD; git ls-files --others --exclude-standard | while read -r f; do [ -f "$f" ] && { echo "$f"; cat "$f"; }; done; } | shasum | cut -c1-16)"
if [ "$(cat "$state/last-pass" 2>/dev/null)" = "$fingerprint" ]; then
  log "{\"ts\":$started,\"fp\":\"$fingerprint\",\"result\":\"skip\",\"reason\":\"already-passed\",\"checks\":[],\"ms\":0}"
  exit 0
fi

# 앱 기준 상대 경로로 바꿔 둔다 (eslint·vitest는 앱 폴더에서 돈다)
web="$(echo "$changed" | grep -E '^apps/web/.*\.(ts|tsx|mts|cjs|mjs)$' | grep -v '^apps/web/e2e/' | sed 's#^apps/web/##' || true)"
web_src="$(echo "$web" | grep -E '^src/' || true)"
mobile="$(echo "$changed" | grep -E '^apps/mobile/.*\.(ts|tsx)$' | sed 's#^apps/mobile/##' || true)"
scripts_sh="$(echo "$changed" | grep -E '\.sh$' || true)"

checks_json=""; failed=0; report=""
run() { # 이름 명령...
  local name="$1"; shift
  local t0 out code; t0="$(now_ms)"
  out="$("$@" 2>&1)"; code=$?
  local ms=$(( $(now_ms) - t0 ))
  local ok=true; [ $code -ne 0 ] && { ok=false; failed=1; report+=$'\n'"### $name 실패"$'\n'"$(echo "$out" | grep -v '^\s*$' | tail -30)"$'\n'; }
  checks_json+="${checks_json:+,}{\"name\":\"$name\",\"ok\":$ok,\"ms\":$ms}"
}
in_app() { local dir="$1"; shift; (cd "$root/$dir" && "$@"); }

if [ -n "$web" ]; then
  # 증분 정보를 .git/harness에 둬 두 번째 실행부터 빠르다 (저장소에는 안 남음)
  run web-typecheck in_app apps/web pnpm exec tsc --noEmit -p . --incremental --tsBuildInfoFile "$root/$state/tsc-web.tsbuildinfo"
  # shellcheck disable=SC2086
  run web-eslint in_app apps/web pnpm exec eslint --no-warn-ignored $web
  if [ -n "$web_src" ]; then
    run web-tokens in_app apps/web node scripts/check-design-tokens.mjs
    run web-deps in_app apps/web pnpm run -s deps:check
    # 훅은 논리 오류를 잡는 용도. 기계가 바쁠 때 5초 타임아웃으로 막지 않게 시간·작업자를 넉넉히 (속도 회귀는 CI 몫)
    # shellcheck disable=SC2086
    run web-vitest in_app apps/web env NODE_OPTIONS=--experimental-require-module pnpm exec vitest related --run $web_src --passWithNoTests --coverage.enabled=false --testTimeout=30000 --maxWorkers=2
  fi
fi
if [ -n "$mobile" ]; then
  run mobile-typecheck in_app apps/mobile pnpm exec tsc --noEmit -p .
  # shellcheck disable=SC2086
  run mobile-vitest in_app apps/mobile pnpm exec vitest related --run $mobile --passWithNoTests --testTimeout=30000 --maxWorkers=2
fi
for f in $scripts_sh; do run "bash-n:$f" bash -n "$f"; done

ms=$(( $(now_ms) - started ))
files=$(echo "$changed" | wc -l | tr -d ' ')
if [ $failed -eq 0 ]; then
  echo "$fingerprint" > "$state/last-pass"
  log "{\"ts\":$started,\"fp\":\"$fingerprint\",\"files\":$files,\"result\":\"pass\",\"checks\":[${checks_json}],\"ms\":$ms}"
  exit 0
fi
log "{\"ts\":$started,\"fp\":\"$fingerprint\",\"files\":$files,\"result\":\"fail\",\"checks\":[${checks_json}],\"ms\":$ms}"
echo "변경 검사 실패 (scripts/verify-changed.sh) — 고친 뒤 끝내세요:$report" >&2
exit 1
