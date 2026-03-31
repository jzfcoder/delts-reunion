"use client";

import { useState } from "react";

type Contribution = {
  first_name: string;
  last_name: string | null;
  amount: string;
  created_at: string;
};

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

type LeaderEntry = {
  name: string;
  total: number;
};

function buildLeaderboard(contributions: Contribution[]): LeaderEntry[] {
  const map = new Map<string, number>();
  for (const c of contributions) {
    const name = [c.first_name, c.last_name].filter(Boolean).join(" ");
    map.set(name, (map.get(name) ?? 0) + parseAmount(c.amount));
  }
  return Array.from(map, ([name, total]) => ({ name, total }))
    .filter((e) => e.total > 0)
    .sort((a, b) => b.total - a.total);
}

export function DonationLeaderboard({
  contributions,
}: {
  contributions: Contribution[];
}) {
  const [expanded, setExpanded] = useState(false);
  const entries = buildLeaderboard(contributions);

  if (entries.length === 0) return null;

  const totalRaised = entries.reduce((s, e) => s + e.total, 0);
  const visible = expanded ? entries : entries.slice(0, 10);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <p className="leaderboard-title">Donation Leaderboard</p>
        <p className="leaderboard-total">
          ${totalRaised.toLocaleString()} raised
        </p>
      </div>

      <div className="leaderboard-list">
        {visible.map((entry, i) => (
          <div
            key={entry.name}
            className={`leaderboard-row${i < 3 ? " leaderboard-row--top" : ""}`}
          >
            <span className="leaderboard-rank">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
            </span>
            <span className="leaderboard-name">{entry.name}</span>
            <span className="leaderboard-amount">
              ${entry.total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {entries.length > 10 && (
        <button
          className="leaderboard-toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : `Show all ${entries.length} donors`}
        </button>
      )}
    </div>
  );
}
