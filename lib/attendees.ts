/**
 * Deduplicate guests by first_name + last_name (case-insensitive).
 * Keeps the first occurrence (earliest when ordered by created_at asc).
 */
export function deduplicateGuests<
  T extends { first_name: string; last_name: string | null },
>(guests: T[]): T[] {
  const seen = new Set<string>();
  return guests.filter((g) => {
    const key = `${g.first_name.toLowerCase()}|${(g.last_name ?? "").toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
