import { HomePage } from "@/components/home-page";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Attendee } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();

  const guests = session
    ? await supabase
        .from("attendees")
        .select("name, graduation_date, profile_pic_url, days_attending")
        .order("created_at", { ascending: true })
        .then(({ data }) =>
          (data ?? []) as Pick<
            Attendee,
            "name" | "graduation_date" | "profile_pic_url" | "days_attending"
          >[]
        )
    : [];

  return (
    <HomePage
      guests={guests}
      isLoggedIn={!!session}
      userName={session?.name.split(" ")[0]}
      profilePicUrl={session?.profile_pic_url ?? undefined}
      referralCode={session?.referral_code}
      referredBy={params.ref}
    />
  );
}
