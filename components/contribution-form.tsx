"use client";

import { useActionState, useState } from "react";
import { submitContribution, type ContributeState } from "@/app/contribute/actions";

const AMOUNTS = ["$50", "$100", "$130", "$150", "$200", "$250+", "Other"];

export function ContributionForm() {
  const [state, formAction, pending] = useActionState<ContributeState, FormData>(
    submitContribution,
    {}
  );
  const [amount, setAmount] = useState("");

  if (state.success) {
    return (
      <div className="contribution-form-wrapper">
        <p className="text-sm text-white/60 tracking-wide">
          Thank you — we&apos;ve got you down. See you in May!
        </p>
      </div>
    );
  }

  return (
    <div className="contribution-form-wrapper">
      <p className="text-sm text-white/50 mb-6">
        After sending your contribution, please fill out this form so we can keep track — thank you!
      </p>

      <form action={formAction} className="flex flex-col gap-5 max-w-lg">
        {state.error && (
          <p className="bg-red-900/50 px-4 py-3 text-sm text-red-200">
            {state.error}
          </p>
        )}

        {/* Name */}
        <div className="flex gap-4">
          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-sm font-medium">
              First Name <span className="text-red-400">*</span>
            </span>
            <input
              type="text"
              name="first_name"
              required
              className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-sm font-medium">Last Name</span>
            <input
              type="text"
              name="last_name"
              className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
            />
          </label>
        </div>

        {/* Amount */}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium mb-1">
            Amount <span className="text-red-400">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map((val) => (
              <label
                key={val}
                className={`flex items-center px-4 py-2 text-sm border cursor-pointer transition-colors select-none ${
                  amount === val
                    ? "border-purple-400/60 bg-purple-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <input
                  type="radio"
                  name="amount"
                  value={val.toLowerCase() === "other" ? "other" : val}
                  checked={amount === val}
                  onChange={() => setAmount(val)}
                  className="sr-only"
                />
                {val}
              </label>
            ))}
          </div>
          {amount === "Other" && (
            <input
              type="text"
              name="amount_other"
              placeholder="Enter amount (e.g. $175)"
              className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none text-sm"
            />
          )}
        </fieldset>

        <button
          type="submit"
          disabled={pending}
          className="self-start bg-purple-600 px-6 py-3 text-sm font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
