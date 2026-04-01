import { HomePage } from "@/components/home-page";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Attendee } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; welcome?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();

  const [guests, alumniCount] = await Promise.all([
    session
      ? supabase
          .from("attendees")
          .select("first_name, last_name, graduation_date, profile_pic_url, days_attending")
          .order("created_at", { ascending: true })
          .then(({ data }) =>
            (data ?? []) as Pick<
              Attendee,
              "first_name" | "last_name" | "graduation_date" | "profile_pic_url" | "days_attending"
            >[]
          )
      : Promise.resolve([]),
    supabase
      .from("attendees")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => count ?? 0),
  ]);

  return (
    <HomePage
      guests={guests}
      isLoggedIn={!!session}
      userName={session?.first_name}
      profilePicUrl={session?.profile_pic_url ?? undefined}
      referralCode={session?.referral_code}
      referredBy={params.ref}
      showWelcome={params.welcome === "true"}
      alumniCount={alumniCount}
      paid={session?.paid ?? null}
    />
  );
}
