"use client";

import type { Attendee } from "@/lib/types";

type Guest = Pick<Attendee, "first_name" | "last_name" | "graduation_date" | "profile_pic_url" | "days_attending">;

const DUMMY_GUESTS = [
  { name: "Jacob McCarren", year: "'18" },
  { name: "Robert Kucera", year: "'19" },
  { name: "Thomas Schwab", year: "'17" },
  { name: "Brandon White", year: "'20" },
  { name: "Alexander Long", year: "'18" },
  { name: "Daniel Polito", year: "'21" },
  { name: "Christopher Mathew", year: "'19" },
  { name: "Ethan Healy", year: "'17" },
  { name: "Nikhil Kini", year: "'20" },
  { name: "Pranav Ganesh", year: "'22" },
  { name: "Will Richardson", year: "'18" },
  { name: "Michael Fried", year: "'21" },
];

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
    return (
      <div className="hero-guest-panel">
        <div className="hero-guest-header">
          <h3 className="hero-guest-title">GUEST LIST</h3>
        </div>
        <div className="hero-guest-list-wrapper">
          <div className="hero-guest-list">
            {guests.map((guest, i) => (
              <div key={i} className="hero-guest-row">
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
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-guest-panel">
      <div className="hero-guest-header">
        <h3 className="hero-guest-title">GUEST LIST</h3>
      </div>
      <div className="hero-guest-list-wrapper">
        <div className="hero-guest-list hero-guest-blurred">
          {DUMMY_GUESTS.map((person, i) => (
            <div key={i} className="hero-guest-row">
              <div className="hero-guest-avatar">
                <span className="hero-guest-avatar-letter">
                  {person.name.charAt(0)}
                </span>
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
