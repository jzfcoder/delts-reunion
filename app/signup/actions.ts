"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type SignupState = {
  error?: string;
  success?: boolean;
  referralCode?: string;
};

export async function signup(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = formData.get("name") as string | null;
  if (!name?.trim()) {
    return { error: "Name is required." };
  }

  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  if (!phone && !email) {
    return { error: "Please provide either a phone number or email address." };
  }

  const daysAttending = formData.getAll("days_attending") as string[];
  if (daysAttending.length === 0) {
    return { error: "Please select at least one day you can attend." };
  }

  const dietaryRestrictions = formData.getAll(
    "dietary_restrictions"
  ) as string[];

  const willingToPay = formData.get("willing_to_pay") as string;
  const wantsToSponsor = formData.get("wants_to_sponsor") === "yes";

  const sessionToken = crypto.randomUUID();
  const referralCode = crypto.randomUUID().slice(0, 8);
  const referredBy = (formData.get("referred_by") as string) || null;

  const { error } = await supabase.from("attendees").insert({
    name: name.trim(),
    address: (formData.get("address") as string)?.trim() || null,
    phone,
    email,
    graduation_date:
      (formData.get("graduation_date") as string)?.trim() || null,
    days_attending: daysAttending,
    willing_to_pay: willingToPay || "no",
    willing_to_pay_other:
      (formData.get("willing_to_pay_other") as string)?.trim() || null,
    dietary_restrictions: dietaryRestrictions,
    dietary_other:
      (formData.get("dietary_other") as string)?.trim() || null,
    plus_one: formData.get("plus_one") === "yes",
    plus_one_count: parseInt(formData.get("plus_one_count") as string) || 0,
    plus_one_names:
      (formData.get("plus_one_names") as string)?.trim() || null,
    wants_to_sponsor: wantsToSponsor,
    sponsorship_interest: wantsToSponsor
      ? (formData.get("sponsorship_interest") as string)?.trim() || null
      : null,
    donation_amount: wantsToSponsor
      ? (formData.get("donation_amount") as string)?.trim() || null
      : null,
    anything_else:
      (formData.get("anything_else") as string)?.trim() || null,
    session_token: sessionToken,
    referral_code: referralCode,
    referred_by: referredBy,
  });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect(`/signup?success=true&ref=${referralCode}`);
}
