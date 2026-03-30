"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/login/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {}
  );
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      {state.error && (
        <p className="bg-red-900/50 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col gap-1.5 flex-1">
          <span className="text-sm font-medium">First Name</span>
          <input
            type="text"
            name="first_name"
            required
            placeholder="As you RSVP'd"
            className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 flex-1">
          <span className="text-sm font-medium">Last Name</span>
          <input
            type="text"
            name="last_name"
            placeholder="As you RSVP'd"
            className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Verify with</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMethod("email")}
            className={`px-4 py-2 text-sm transition-colors ${
              method === "email"
                ? "bg-purple-600 text-white"
                : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setMethod("phone")}
            className={`px-4 py-2 text-sm transition-colors ${
              method === "phone"
                ? "bg-purple-600 text-white"
                : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Phone
          </button>
        </div>
      </div>

      {method === "email" ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
          />
        </label>
      ) : (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Phone Number</span>
          <input
            type="tel"
            name="phone"
            required
            className="border border-white/10 bg-white/5 px-4 py-2.5 focus:border-white/40 focus:outline-none"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
      >
        {pending ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
