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

  const amountChoice = formData.get("amount") as string;
  const amountOther = (formData.get("amount_other") as string)?.trim();
  const amount = amountChoice === "other" ? amountOther : amountChoice;
  if (!amount) return { error: "Please select or enter a contribution amount." };

  const { error } = await supabase.from("contributions").insert({
    first_name: firstName,
    last_name: lastName,
    amount,
  });

  if (error) {
    console.error("contribution insert error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
