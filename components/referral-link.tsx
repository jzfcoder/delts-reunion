"use client";

import { useState } from "react";

export function ReferralLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}?ref=${code}`
      : `/?ref=${code}`;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Your referral link</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
