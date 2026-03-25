"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type LoginState = {
  error?: string;
};

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!name) {
    return { error: "Name is required." };
  }

  if (!email && !phone) {
    return { error: "Please provide either your email or phone number." };
  }

  // Build query: match name AND (email OR phone)
  let query = supabase
    .from("attendees")
    .select("session_token, referral_code")
    .ilike("name", name);

  if (email) {
    query = query.ilike("email", email);
  } else {
    query = query.eq("phone", phone);
  }

  const { data } = await query.single();

  if (!data) {
    return {
      error:
        "No RSVP found with that name and contact info. Check your spelling or sign up instead.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("session", data.session_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/guests");
}
