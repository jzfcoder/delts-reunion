"use client";

import type { Attendee } from "@/lib/types";

type Guest = Pick<Attendee, "first_name" | "last_name" | "graduation_date" | "profile_pic_url" | "days_attending">;

const DUMMY_ALUMNI = [
  { name: "Jacob McCarren", year: "'18" },
  { name: "Robert Kucera", year: "'19" },
  { name: "Thomas Schwab", year: "'17" },
  { name: "Brandon White", year: "'20" },
  { name: "Alexander Long", year: "'18" },
  { name: "Daniel Polito", year: "'21" },
  { name: "Christopher Mathew", year: "'19" },
];

const DUMMY_UNDERGRADS = [
  { name: "Ethan Healy", year: "'26" },
  { name: "Nikhil Kini", year: "'27" },
  { name: "Pranav Ganesh", year: "'26" },
  { name: "Will Richardson", year: "'27" },
  { name: "Michael Fried", year: "'26" },
];

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
  isLoggedIn,
  onLogin,
  onSignup,
}: {
  guests: Guest[];
  isLoggedIn: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
}) {
  if (isLoggedIn) {
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

  return (
    <div className="hero-guest-panel">
      <div className="hero-guest-list-wrapper">
        <div className="hero-guest-list hero-guest-blurred">
          <p className="hero-guest-section-label">Alumni</p>
          {DUMMY_ALUMNI.map((person, i) => (
            <div key={i} className="hero-guest-row">
              <div className="hero-guest-avatar">
                <span className="hero-guest-avatar-letter">{person.name.charAt(0)}</span>
              </div>
              <div className="hero-guest-info">
                <p className="hero-guest-name">{person.name}</p>
                <p className="hero-guest-year">Class of {person.year}</p>
              </div>
            </div>
          ))}
          <p className="hero-guest-section-label" style={{ marginTop: "16px" }}>Current Members</p>
          {DUMMY_UNDERGRADS.map((person, i) => (
            <div key={i} className="hero-guest-row">
              <div className="hero-guest-avatar">
                <span className="hero-guest-avatar-letter">{person.name.charAt(0)}</span>
              </div>
              <div className="hero-guest-info">
                <p className="hero-guest-name">{person.name}</p>
                <p className="hero-guest-year">Class of {person.year}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-guest-overlay">
          <p className="hero-guest-overlay-text">RSVP to see who&apos;s coming</p>
          <p className="hero-guest-overlay-deadline">
            <span className="rsvp-pulse-dot" />
            Deadline: April 20, 2026
          </p>
          <div className="hero-guest-overlay-buttons">
            <button onClick={onSignup} className="hero-btn hero-btn-solid hero-guest-overlay-btn">
              RSVP
            </button>
            <button onClick={onLogin} className="hero-btn hero-btn-ghost hero-guest-overlay-btn">
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
