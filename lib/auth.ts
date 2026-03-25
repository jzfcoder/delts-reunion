import { cookies } from "next/headers";
import { supabase } from "./supabase";
import type { Attendee } from "./types";

export async function getSession(): Promise<Attendee | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const { data } = await supabase
    .from("attendees")
    .select("*")
    .eq("session_token", token)
    .single();

  return data as Attendee | null;
}
