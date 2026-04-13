"use client";

import type { Attendee } from "@/lib/types";

type Guest = Pick<Attendee, "first_name" | "last_name" | "graduation_date" | "profile_pic_url" | "days_attending">;

function gradYear(graduation_date: string | null): number {
  if (!graduation_date) return 0;
  const match = graduation_date.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

function GuestRow({ guest }: { guest: Guest }) {
  return (
    <div className="hero-guest-row">
      <div className="hero-guest-avatar">
        {guest.profile_pic_url ? (
          <img
            src={guest.profile_pic_url}
            alt={`${guest.first_name} ${guest.last_name ?? ""}`.trim()}
            className="hero-guest-avatar-img"
          />
        ) : (
          <span className="hero-guest-avatar-letter">
            {guest.first_name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="hero-guest-info">
        <p className="hero-guest-name">{guest.first_name} {guest.last_name}</p>
        {guest.graduation_date && (
          <p className="hero-guest-year">{guest.graduation_date}</p>
        )}
      </div>
    </div>
  );
}

export function GuestListPreview({
  guests,
}: {
  guests: Guest[];
}) {
  const alumni = guests.filter((g) => gradYear(g.graduation_date) <= 2025);
  const undergrads = guests.filter((g) => gradYear(g.graduation_date) > 2025);

  return (
    <div className="hero-guest-panel">
      <div className="hero-guest-list-wrapper">
        <div className="hero-guest-list">
          {alumni.length > 0 && (
            <>
              <p className="hero-guest-section-label">Alumni</p>
              {alumni.map((guest, i) => <GuestRow key={i} guest={guest} />)}
            </>
          )}
          {undergrads.length > 0 && (
            <>
              <p className="hero-guest-section-label" style={{ marginTop: alumni.length > 0 ? "16px" : "0" }}>Current Members</p>
              {undergrads.map((guest, i) => <GuestRow key={i} guest={guest} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
