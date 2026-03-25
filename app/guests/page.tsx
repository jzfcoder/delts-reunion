import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Attendee } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
  const session = await getSession();
  if (!session) redirect("/signup");

  const { data: attendees } = await supabase
    .from("attendees")
    .select("name, graduation_date, profile_pic_url, days_attending")
    .order("created_at", { ascending: true });

  const guests = (attendees ?? []) as Pick<
    Attendee,
    "name" | "graduation_date" | "profile_pic_url" | "days_attending"
  >[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-3xl font-bold mb-2">Guest List</h1>
      <p className="text-gray-400 mb-10">
        {guests.length} {guests.length === 1 ? "brother" : "brothers"} signed
        up
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guests.map((guest, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-600/20">
              {guest.profile_pic_url ? (
                <img
                  src={guest.profile_pic_url}
                  alt={guest.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-purple-400">
                  {guest.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{guest.name}</p>
              {guest.graduation_date && (
                <p className="text-sm text-gray-400">{guest.graduation_date}</p>
              )}
              <p className="text-xs text-gray-500">
                {guest.days_attending.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
