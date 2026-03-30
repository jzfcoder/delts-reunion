"use client";

import { useActionState, useState } from "react";
import { signup, type SignupState } from "@/app/signup/actions";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut Allergy",
  "Shellfish Allergy",
  "Kosher",
  "Halal",
];

export function SignupForm({ referredBy }: { referredBy?: string }) {
  const [state, formAction, pending] = useActionState<SignupState, FormData>(
    signup,
    {}
  );
  const [willingToPay, setWillingToPay] = useState("no");
  const [wantsToSponsor, setWantsToSponsor] = useState(false);
  const [plusOne, setPlusOne] = useState(false);
  const [dietaryNone, setDietaryNone] = useState(true);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-lg w-full">
      {state.error && (
        <p className="bg-red-900/50 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      {referredBy && (
        <input type="hidden" name="referred_by" value={referredBy} />
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

      {/* Address */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Preferred Address</span>
        <span className="text-xs text-gray-400">
          Used for the attendee map
        </span>
        <input
          type="text"
          name="address"
          placeholder="City, State or full address"
          className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
        />
      </label>

      {/* Phone & Email — at least one required */}
      <p className="text-xs text-gray-400 -mb-3">
        Please provide at least one of phone or email <span className="text-red-400">*</span>
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Phone Number</span>
        <input
          type="tel"
          name="phone"
          className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          name="email"
          className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
        />
      </label>

      {/* Graduation Date */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Graduation Date</span>
        <input
          type="text"
          name="graduation_date"
          placeholder="e.g. 2020"
          className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
        />
      </label>

      {/* Days Attending */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium mb-1">
          Days You Can Attend <span className="text-red-400">*</span>
        </legend>
        {["May 1", "May 2", "May 3"].map((day) => (
          <label key={day} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="days_attending"
              value={day}
              className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
            />
            <span className="text-sm">{day}, 2026</span>
          </label>
        ))}
      </fieldset>

      {/* Willing to Pay */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium mb-1">
          Do you plan to contribute to the reunion?
        </legend>
        <p className="text-xs text-gray-400 -mt-1">
          Contribution details and recommended amounts are available on the main page.
        </p>
        {[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "other", label: "Other" },
        ].map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="radio"
              name="willing_to_pay"
              value={value}
              checked={willingToPay === value}
              onChange={() => setWillingToPay(value)}
              className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
        {willingToPay === "other" && (
          <input
            type="text"
            name="willing_to_pay_other"
            placeholder="Please explain..."
            className="mt-1 border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
          />
        )}
      </fieldset>

      {/* Dietary Restrictions */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium mb-1">
          Dietary Restrictions
        </legend>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={dietaryNone}
            onChange={(e) => setDietaryNone(e.target.checked)}
            className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
          />
          <span className="text-sm">None</span>
        </label>
        {!dietaryNone && (
          <>
            {DIETARY_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="dietary_restrictions"
                  value={opt}
                  className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
            <label className="flex flex-col gap-1.5 mt-1">
              <span className="text-xs text-gray-400">Other</span>
              <input
                type="text"
                name="dietary_other"
                placeholder="Any other restrictions..."
                className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
              />
            </label>
          </>
        )}
      </fieldset>

      {/* Plus One */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium mb-1">Plus One?</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="plus_one"
              value="yes"
              checked={plusOne}
              onChange={() => setPlusOne(true)}
              className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
            />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="plus_one"
              value="no"
              checked={!plusOne}
              onChange={() => setPlusOne(false)}
              className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
            />
            <span className="text-sm">No</span>
          </label>
        </div>
        {plusOne && (
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-400">How many?</span>
              <input
                type="number"
                name="plus_one_count"
                min="1"
                defaultValue="1"
                className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none w-24"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-400">Name(s)</span>
              <input
                type="text"
                name="plus_one_names"
                placeholder="Guest name(s)"
                className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
              />
            </label>
          </div>
        )}
      </fieldset>

      {/* Sponsor */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium mb-1">
          Would you like to donate/sponsor the reunion?
        </legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="wants_to_sponsor"
              value="yes"
              checked={wantsToSponsor}
              onChange={() => setWantsToSponsor(true)}
              className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
            />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="wants_to_sponsor"
              value="no"
              checked={!wantsToSponsor}
              onChange={() => setWantsToSponsor(false)}
              className="border-white/20 bg-white/5 text-white accent-white focus:ring-white/40"
            />
            <span className="text-sm">No</span>
          </label>
        </div>
        {wantsToSponsor && (
          <div className="flex flex-col gap-3 mt-1">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-400">
                What would you be interested in sponsoring?
              </span>
              <textarea
                name="sponsorship_interest"
                rows={2}
                className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none resize-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-400">
                How much would you be comfortable donating?
              </span>
              <input
                type="text"
                name="donation_amount"
                placeholder="e.g. $50, $100, $500"
                className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
              />
            </label>
          </div>
        )}
      </fieldset>

      {/* Anything Else */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">
          Anything else we should know?
        </span>
        <textarea
          name="anything_else"
          rows={3}
          className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none resize-none"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Sign Up"}
      </button>
    </form>
  );
}
