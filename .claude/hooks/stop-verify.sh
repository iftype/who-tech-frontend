#!/bin/bash
# Claude Code Stop 훅: 턴을 끝내기 전에 바뀐 파일을 검사한다 (하네스 L2, 검사 본체는 scripts/verify-changed.sh).
# 실패하면 exit 2 → Claude가 고치고 다시 끝내려 한다. 같은 변경으로 3번 연속 실패하면 막지 않고 경고만(무한 루프 방지)
# 레포는 이 스크립트 위치로 찾는다 — 상위 폴더에서 연 세션(CLAUDE_PROJECT_DIR가 레포 밖)에서도 같은 레포를 검사한다
root="$(cd "$(dirname "$0")/../.." && git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cat >/dev/null # stdin(훅 입력)은 쓰지 않는다
state="$root/.git/harness"; mkdir -p "$state"
if "$root/scripts/verify-changed.sh"; then
  rm -f "$state/fail-count"
  exit 0
fi
count=$(( $(cat "$state/fail-count" 2>/dev/null || echo 0) + 1 ))
echo "$count" > "$state/fail-count"
if [ "$count" -ge 3 ]; then
  rm -f "$state/fail-count"
  printf '{"ts":%s,"result":"gave-up","checks":[],"ms":0}\n' "$(python3 -c 'import time;print(int(time.time()*1000))')" >> "$state/log.jsonl"
  echo "검사가 3번 연속 실패해 이번엔 막지 않습니다. 사람에게 알리세요." >&2
  exit 0
fi
exit 2
