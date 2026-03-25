import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const csv = readFileSync("form-responses.csv", "utf-8");
const records: Record<string, string>[] = parse(csv, {
  columns: true,
  skip_empty_lines: true,
});

// Only include Yes or Unsure attendance
const attending = records.filter((r) => {
  const status = r["Attendance Status"];
  return (
    status === "Yes, I plan to attend" || status === "I am unsure at the moment"
  );
});

function splitName(full: string): { first: string; last: string | null } {
  const trimmed = full.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: null };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function parseDays(raw: string): string[] {
  if (!raw) return [];
  return raw.split(",").map((d) => d.trim()).filter(Boolean);
}

function parsePlusOne(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return v === "yes" || v.startsWith("maybe");
}

function parseSponsor(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return v === "yes" || v.startsWith("maybe");
}

const rows = attending.map((r) => {
  const { first, last } = splitName(r["Full Name"]);
  return {
    first_name: first,
    last_name: last,
    email: r["Preferred Email Address"] || null,
    phone: r["Phone Number"] || null,
    graduation_date: r["Graduation Year"] || null,
    days_attending: parseDays(r["Which days do you expect to attend"]),
    willing_to_pay: r[Object.keys(r).find((k) => k.startsWith("Taking inspiration"))!] || "no",
    dietary_restrictions: r["Dietary Restrictions"] && r["Dietary Restrictions"] !== "None"
      ? [r["Dietary Restrictions"]]
      : [],
    dietary_other: r["Other dietary restrictions"] || null,
    plus_one: parsePlusOne(r["Will you be bringing a plus one?"] || ""),
    plus_one_count: 0,
    plus_one_names: null,
    wants_to_sponsor: parseSponsor(r["Would you like to support the reunion through a donation or sponsorship?"] || ""),
    sponsorship_interest: r["What would you be interested in sponsoring?"] || null,
    donation_amount: r["If you choose to contribute, approximately how much would you be comfortable donating?"] || null,
    anything_else: r["Anything else we should know?"] || null,
    session_token: randomUUID(),
    referral_code: randomUUID().slice(0, 8),
  };
});

async function main() {
  console.log(`Importing ${rows.length} attendees...`);

  const { data, error } = await supabase.from("attendees").insert(rows).select("id, first_name, last_name");

  if (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }

  console.log(`Successfully imported ${data.length} attendees.`);
}

main();
