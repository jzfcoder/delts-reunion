#!/usr/bin/env bash
# Sends every draft listed in /tmp/reunion-drafts.tsv (id<TAB>to<TAB>subject<TAB>modified).
# Logs successes to /tmp/reunion-sent.log and failures to /tmp/reunion-failed.log.
set -uo pipefail

TSV=/tmp/reunion-drafts.tsv
SENT=/tmp/reunion-sent.log
FAILED=/tmp/reunion-failed.log
: > "$SENT"
: > "$FAILED"

total=$(wc -l < "$TSV" | tr -d ' ')
i=0
ok=0
fail=0

while IFS=$'\t' read -r id to subject modified; do
  i=$((i + 1))
  if outlook send-draft "$id" >/dev/null 2>&1; then
    ok=$((ok + 1))
    printf '[%03d/%03d] OK   %s\n' "$i" "$total" "$to" | tee -a "$SENT"
  else
    fail=$((fail + 1))
    printf '[%03d/%03d] FAIL %s (id=%s)\n' "$i" "$total" "$to" "$id" | tee -a "$FAILED"
  fi
  sleep 0.4
done < "$TSV"

echo
echo "Done. Sent: $ok  Failed: $fail  Total: $total"
