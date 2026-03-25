"use client";

import { useState, useEffect } from "react";

const TARGET = new Date("2026-05-02T00:00:00").getTime();

function calcTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const LABELS = ["DAYS", "HOURS", "MIN", "SEC"] as const;
const KEYS = ["days", "hours", "minutes", "seconds"] as const;

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof calcTimeLeft> | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="countdown">
      {KEYS.map((key, i) => (
        <span key={key} className="countdown-segment">
          <span className="countdown-number">
            {time ? String(time[key]).padStart(key === "days" ? 1 : 2, "0") : "--"}
          </span>
          {i < KEYS.length - 1 && <span className="countdown-colon">:</span>}
        </span>
      ))}
      <div className="countdown-labels">
        {LABELS.map((label) => (
          <span key={label} className="countdown-label">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
