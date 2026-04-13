"use server";

import { supabase } from "@/lib/supabase";

export type ContributeState = {
  error?: string;
  success?: boolean;
};

export async function submitContribution(
  _prev: ContributeState,
  formData: FormData
): Promise<ContributeState> {
  const firstName = (formData.get("first_name") as string)?.trim();
  if (!firstName) return { error: "First name is required." };

  const lastName = (formData.get("last_name") as string)?.trim() || null;
  if (!lastName) return { error: "Last name is required." };

  const amountChoice = formData.get("amount") as string;
  const amountOther = (formData.get("amount_other") as string)?.trim();
  const amount = amountChoice === "other" ? amountOther : amountChoice;
  if (!amount) return { error: "Please select or enter a contribution amount." };

  const paymentMethod = (formData.get("payment_method") as string)?.trim() || null;

  let confirmationUrl: string | null = null;
  const confirmationFile = formData.get("confirmation") as File | null;
  if (confirmationFile && confirmationFile.size > 0) {
    const ext = confirmationFile.name.split(".").pop() ?? "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await confirmationFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("payment-confirmations")
      .upload(path, buffer, { contentType: confirmationFile.type });
    if (uploadError) {
      console.error("upload error:", uploadError);
      return { error: "Failed to upload confirmation. Please try again." };
    }
    const { data: urlData } = supabase.storage
      .from("payment-confirmations")
      .getPublicUrl(path);
    confirmationUrl = urlData.publicUrl;
  }

  const { error } = await supabase.from("contributions").insert({
    first_name: firstName,
    last_name: lastName,
    amount,
    payment_method: paymentMethod,
    confirmation_url: confirmationUrl,
  });

  if (error) {
    console.error("contribution insert error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  // Mark matching attendee(s) as paid (case-insensitive name match)
  const { error: paidError } = await supabase
    .from("attendees")
    .update({ paid: true })
    .ilike("first_name", firstName)
    .ilike("last_name", lastName ?? "");

  if (paidError) {
    console.error("failed to update attendee paid status:", paidError);
  }

  return { success: true };
}
