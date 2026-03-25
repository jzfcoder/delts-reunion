import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Attendee } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const session = await getSession();
  if (!session) redirect("/signup");

  const { data: attendees } = await supabase
    .from("attendees")
    .select("first_name, last_name, address, graduation_date, profile_pic_url")
    .not("address", "is", null)
    .order("address", { ascending: true });

  const guests = (attendees ?? []) as Pick<
    Attendee,
    "first_name" | "last_name" | "address" | "graduation_date" | "profile_pic_url"
  >[];

  // Group by address (city-level)
  const grouped = new Map<string, typeof guests>();
  for (const guest of guests) {
    const key = guest.address ?? "Unknown";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(guest);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-3xl font-bold mb-2">Attendee Map</h1>
      <p className="text-gray-400 mb-10">
        {guests.length} {guests.length === 1 ? "attendee" : "attendees"} with
        locations
      </p>

      {grouped.size === 0 ? (
        <p className="text-gray-500">No attendees have shared their location yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {Array.from(grouped.entries()).map(([location, members]) => (
            <div key={location}>
              <h2 className="text-lg font-semibold mb-3 text-purple-400">
                {location}
                <span className="ml-2 text-sm text-gray-500">
                  ({members.length})
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((guest, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-600/20">
                      {guest.profile_pic_url ? (
                        <img
                          src={guest.profile_pic_url}
                          alt={`${guest.first_name} ${guest.last_name ?? ""}`.trim()}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-purple-400">
                          {guest.first_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {guest.first_name} {guest.last_name}
                      </p>
                      {guest.graduation_date && (
                        <p className="text-xs text-gray-500">
                          {guest.graduation_date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
