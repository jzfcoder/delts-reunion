"""Create per-attendee Outlook drafts from attendees-export.csv.

For each row, picks the paid vs. unpaid HTML template, substitutes
{{first_name}}, and shells out to `outlook draft --html --body-file ...`.

Usage:
    python scripts/draft-emails.py                # create real drafts
    python scripts/draft-emails.py --dry-run      # print what would happen
    python scripts/draft-emails.py --limit 5      # cap for a small test batch
"""

import argparse
import csv
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "attendees-export.csv"
PAID_HTML = ROOT / "emails" / "rendered" / "headcount-paid.html"
UNPAID_HTML = ROOT / "emails" / "rendered" / "headcount-unpaid.html"

PAID_SUBJECT = "Quick favor — confirm Lobster Trip + Fogo"
UNPAID_SUBJECT = "Quick favor — confirm Lobster Trip + Fogo, and a payment reminder"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()

    paid_template = PAID_HTML.read_text(encoding="utf-8")
    unpaid_template = UNPAID_HTML.read_text(encoding="utf-8")

    raw_rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))

    # Dedupe by lowercased email. If the same email has both a paid and an
    # unpaid row, prefer paid — sending an "unpaid reminder" to someone who
    # has paid is worse than the reverse.
    by_email: dict[str, dict] = {}
    duplicates: list[str] = []
    for row in raw_rows:
        key = (row.get("email") or "").strip().lower()
        if not key:
            by_email[f"_no_email_{id(row)}"] = row
            continue
        if key not in by_email:
            by_email[key] = row
        else:
            duplicates.append(key)
            existing = by_email[key]
            existing_paid = (existing.get("paid") or "").strip().lower() == "true"
            new_paid = (row.get("paid") or "").strip().lower() == "true"
            if new_paid and not existing_paid:
                by_email[key] = row

    rows = list(by_email.values())
    if duplicates:
        print(f"Note: deduped {len(duplicates)} duplicate row(s) for: {', '.join(sorted(set(duplicates)))}")
    if args.limit:
        rows = rows[: args.limit]

    drafted = 0
    skipped = 0
    errors = []

    for i, row in enumerate(rows, 1):
        email = (row.get("email") or "").strip()
        first = (row.get("first_name") or "").strip()
        last = (row.get("last_name") or "").strip()
        is_paid = (row.get("paid") or "").strip().lower() == "true"

        if not email:
            print(f"[{i:03d}] SKIP {first} {last}: no email")
            skipped += 1
            continue

        template = paid_template if is_paid else unpaid_template
        subject = PAID_SUBJECT if is_paid else UNPAID_SUBJECT
        body = template.replace("{{first_name}}", first or "there")
        tag = "PAID  " if is_paid else "UNPAID"

        if args.dry_run:
            print(f"[{i:03d}] {tag} would draft to {email} ({first} {last}) — subject: {subject}")
            drafted += 1
            continue

        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", suffix=".html", delete=False
        ) as tmp:
            tmp.write(body)
            tmp_path = tmp.name

        try:
            result = subprocess.run(
                [
                    "outlook", "draft",
                    "--to", email,
                    "--subject", subject,
                    "--body-file", tmp_path,
                    "--html",
                ],
                capture_output=True,
                text=True,
            )
            if result.returncode != 0:
                err = (result.stderr or result.stdout).strip().splitlines()[-1] if (result.stderr or result.stdout) else "unknown"
                print(f"[{i:03d}] FAIL  {email} ({first} {last}): {err}")
                errors.append((email, err))
            else:
                print(f"[{i:03d}] {tag} drafted → {email} ({first} {last})")
                drafted += 1
        finally:
            Path(tmp_path).unlink(missing_ok=True)

    print()
    print(f"Drafted: {drafted}  Skipped: {skipped}  Failed: {len(errors)}")
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
