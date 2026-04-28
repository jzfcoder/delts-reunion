import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = Array.isArray(val) ? val.join("; ") : String(val);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const { data, error } = await supabase
    .from("attendees")
    .select(
      "first_name, last_name, email, phone, graduation_date, days_attending, willing_to_pay, willing_to_pay_other, plus_one, plus_one_count, donation_amount, paid, created_at"
    )
    .order("paid", { ascending: true })
    .order("last_name", { ascending: true });

  if (error) {
    console.error("Export failed:", error.message);
    process.exit(1);
  }

  const headers = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "graduation_date",
    "days_attending",
    "willing_to_pay",
    "willing_to_pay_other",
    "plus_one",
    "plus_one_count",
    "donation_amount",
    "paid",
    "created_at",
  ];

  const lines = [headers.join(",")];
  for (const row of data ?? []) {
    lines.push(headers.map((h) => csvEscape((row as Record<string, unknown>)[h])).join(","));
  }

  const out = "attendees-export.csv";
  writeFileSync(out, lines.join("\n"));

  const unpaid = (data ?? []).filter((r) => !r.paid).length;
  console.log(`Wrote ${data?.length ?? 0} attendees to ${out} (${unpaid} unpaid).`);
}

main();
