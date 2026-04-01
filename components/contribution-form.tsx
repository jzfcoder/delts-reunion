"use client";

import { useActionState, useState } from "react";
import { submitContribution, type ContributeState } from "@/app/contribute/actions";

const AMOUNTS = ["$100", "$150", "$200", "Other"];
const PAYMENT_METHODS = ["Zelle", "Venmo", "Check"];

export function ContributionForm() {
  const [state, formAction, pending] = useActionState<ContributeState, FormData>(
    submitContribution,
    {}
  );
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [fileName, setFileName] = useState("");

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
        After sending your ticket payment, please fill out this form so we can confirm your spot — thank you!
      </p>

      <form action={formAction} className="flex flex-col gap-5 max-w-lg">
        {state.error && (
          <p className="bg-red-900/50 px-4 py-3 text-sm text-red-200">
            {state.error}
          </p>
        )}

        {/* Name */}
        <div className="flex flex-col sm:flex-row gap-4">
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
            <span className="text-sm font-medium">Last Name <span className="text-red-400">*</span></span>
            <input
              type="text"
              name="last_name"
              required
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

        {/* Payment Method */}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium mb-1">Payment Method</legend>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method}
                className={`flex items-center px-4 py-2 text-sm border cursor-pointer transition-colors select-none ${
                  paymentMethod === method
                    ? "border-purple-400/60 bg-purple-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="sr-only"
                />
                {method}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Confirmation Upload */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Payment Confirmation</span>
          <p className="text-xs text-white/40 mb-1">
            Optional — upload a screenshot or photo of your payment confirmation.
          </p>
          <label className="contribution-upload-label">
            <input
              type="file"
              name="confirmation"
              accept="image/*,.pdf"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-50">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="text-sm text-white/60 truncate">
              {fileName || "Choose file"}
            </span>
          </label>
        </div>

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
