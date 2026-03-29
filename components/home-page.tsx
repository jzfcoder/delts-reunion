"use client";

import { useState, useRef, useEffect } from "react";
import { Countdown } from "@/components/countdown";
import { GuestListPreview } from "@/components/guest-list-preview";
import { Globe } from "@/components/globe";
import { Modal } from "@/components/modal";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { logout } from "@/app/logout/actions";
import type { Attendee } from "@/lib/types";

type Guest = Pick<
  Attendee,
  "first_name" | "last_name" | "graduation_date" | "profile_pic_url" | "days_attending"
>;

export function HomePage({
  guests,
  isLoggedIn,
  userName,
  profilePicUrl,
  referralCode,
  referredBy,
  showWelcome,
}: {
  guests: Guest[];
  isLoggedIn: boolean;
  userName?: string;
  profilePicUrl?: string;
  referralCode?: string;
  referredBy?: string;
  showWelcome?: boolean;
}) {
  const [modal, setModal] = useState<"login" | "signup" | "welcome" | null>(
    showWelcome ? "welcome" : null
  );
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAvatarOpen(false);
      }
    }
    if (avatarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [avatarOpen]);

  const referralUrl =
    referralCode && typeof window !== "undefined"
      ? `${window.location.origin}?ref=${referralCode}`
      : "";

  function copyReferral() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
    <div className="hero-container">
      {/* Center globe */}
      <Globe />

      {/* Top-left greek logo */}
      <div className="hero-logo">ΔΤΔ</div>

      {/* Top-right avatar menu */}
      <div className="hero-nav" ref={dropdownRef}>
        <button
          onClick={() => setAvatarOpen((v) => !v)}
          className="hero-avatar-btn"
          aria-label="Account menu"
        >
          {isLoggedIn && profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt={userName ?? ""}
              className="hero-avatar-img"
            />
          ) : (
            <svg
              className="hero-avatar-default"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </button>

        {avatarOpen && (
          <div className="hero-avatar-dropdown">
            {isLoggedIn ? (
              <>
                <p className="hero-avatar-dropdown-greeting">
                  Welcome, {userName}
                </p>
                <div className="hero-avatar-dropdown-divider" />
                <p className="hero-avatar-dropdown-label">REFERRAL LINK</p>
                <button
                  onClick={copyReferral}
                  className="hero-avatar-dropdown-copy"
                >
                  {copied ? "Copied!" : "Copy invite link"}
                </button>
                <div className="hero-avatar-dropdown-divider" />
                <button
                  onClick={() => logout()}
                  className="hero-avatar-dropdown-copy"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAvatarOpen(false);
                    setModal("signup");
                  }}
                  className="hero-btn hero-btn-solid hero-avatar-dropdown-btn"
                >
                  RSVP
                </button>
                <button
                  onClick={() => {
                    setAvatarOpen(false);
                    setModal("login");
                  }}
                  className="hero-btn hero-btn-ghost hero-avatar-dropdown-btn"
                >
                  LOG IN
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Left info panel */}
      <div className="hero-left">
        <div className="hero-divider" />
        <p className="hero-label" style={{ opacity: 0.6, marginBottom: "4px" }}>5TH ANNIVERSARY — HOUSE RENOVATION</p>
        <h2 className="hero-countdown-title">ALUMNI REUNION IN</h2>
        <Countdown />

        <div className="hero-divider" />
        <p className="hero-date">MAY 1 – MAY 3, 2026</p>
        <p className="hero-location">416 BEACON ST, CAMBRIDGE, MA</p>
        <div className="hero-divider" />
        <p className="hero-label" style={{ fontSize: "0.75rem", opacity: 0.6 }}>RSVP DEADLINE — APRIL 20, 2026</p>
      </div>

      {/* Right guest list panel */}
      <GuestListPreview
        guests={guests}
        isLoggedIn={isLoggedIn}
        onLogin={() => setModal("login")}
        onSignup={() => setModal("signup")}
      />

      {/* Bottom-left horizontal info */}
      <div className="hero-bottom-left">
        <span>LAT. 42.3519° N &nbsp; LON. 71.0865° W</span>
        <span>COMMITTED TO LIVES OF EXCELLENCE SINCE 1858</span>
      </div>

      {/* Login Modal */}
      <Modal open={modal === "login"} onClose={() => setModal(null)}>
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-400">
              Log in with the name and contact info you used to RSVP.
            </p>
          </div>
          <LoginForm />
          <p className="text-sm text-gray-500">
            Haven&apos;t signed up yet?{" "}
            <button
              onClick={() => setModal("signup")}
              className="text-purple-400 hover:text-purple-300"
            >
              Sign up here
            </button>
          </p>
        </div>
      </Modal>

      {/* RSVP / Signup Modal */}
      <Modal open={modal === "signup"} onClose={() => setModal(null)}>
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Sign Up for the 5th Anniversary Reunion</h2>
            <p className="mt-2 text-sm text-gray-400">May 1 – 3, 2026</p>
            <p className="mt-1 text-xs text-gray-500">RSVP deadline: April 20, 2026</p>
          </div>
          <SignupForm referredBy={referredBy} />
        </div>
      </Modal>

      {/* Welcome Modal (shown after signup) */}
      <Modal open={modal === "welcome"} onClose={() => setModal(null)}>
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">You&apos;re in!</h2>
            <p className="mt-2 text-sm text-gray-400">
              Welcome, {userName}. We&apos;ll see you in May.
            </p>
          </div>
          {referralCode && (
            <div className="w-full">
              <p className="mb-2 text-sm text-gray-400 text-center">
                Spread the word — share your invite link:
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralUrl}
                  className="flex-1 border border-white/10 bg-white/5 px-4 py-2 text-sm"
                />
                <button
                  onClick={copyReferral}
                  className="bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Scroll hint */}
      <div className="hero-scroll-hint">
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="0.75" y="0.75" width="14.5" height="22.5" rx="7.25" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4"/>
          <circle className="hero-scroll-dot" cx="8" cy="7" r="2.5" fill="currentColor" fillOpacity="0.6"/>
        </svg>
      </div>
    </div>

    {/* ── Itinerary Section ── */}
    <section className="itinerary-section">
      <div className="itinerary-inner">
        <div className="itinerary-header">
          <p className="itinerary-eyebrow">5th Anniversary — House Renovation</p>
          <h2 className="itinerary-headline">The Weekend</h2>
          <div className="hero-divider" style={{ marginTop: "20px" }} />
        </div>

        <div className="itinerary-days">
          {/* Friday */}
          <div className="itinerary-day">
            <p className="itinerary-day-label">Friday — May 1</p>
            <ItineraryEvent time="8:00 PM" title="Opening Night Drinks" detail="We're kicking off the weekend with our own private room at Carrie Nation — the whole crew, cold drinks, and the first round of catching up." />
          </div>

          {/* Saturday */}
          <div className="itinerary-day">
            <p className="itinerary-day-label">Saturday — May 2</p>
            <ItineraryEvent time="10:00 AM" title="Return of the Lobster Trip" detail="Vans leave at 10 — we're taking over the beach for a full day of lobster rolls, football, spike ball, and cornhole. This is the one." />
            <ItineraryEvent time="6:00 PM" title="Formal Dinner at Fogo de Chão" detail="Private rooms reserved for the full Churrasco experience — unlimited cuts, exceptional company, and an evening to remember." />
          </div>

          {/* Sunday */}
          <div className="itinerary-day">
            <p className="itinerary-day-label">Sunday — May 3</p>
            <ItineraryEvent time="9:00 AM" title="Rooftop Send-Off" detail="Close out the weekend over breakfast with sweeping views of the Boston skyline and the Charles River. A proper goodbye." />
          </div>
        </div>

      </div>
    </section>
    {/* ── Alumni Chairs Section ── */}
    <section className="chairs-section">
      <div className="chairs-inner">
        <p className="itinerary-eyebrow">Questions? We&apos;re Here to Help</p>
        <h2 className="itinerary-headline">Alumni Chairs</h2>
        <div className="hero-divider" style={{ marginTop: "20px" }} />
        <p className="chairs-blurb">
          Have a question about the weekend, logistics, or anything else? Don&apos;t hesitate to reach out directly to this year&apos;s alumni chairs.
        </p>
        <div className="chairs-grid">
          <div className="chair-card">
            <div className="chair-avatar">NK</div>
            <p className="chair-name">Nathan Kim</p>
            <p className="chair-title">Alumni Chair</p>
            <div className="chair-divider" />
            <a className="chair-contact" href="mailto:nkim4724@mit.edu">nkim4724@mit.edu</a>
            <a className="chair-contact" href="tel:+18186966854">818-696-6854</a>
          </div>
          <div className="chair-card">
            <div className="chair-avatar">JF</div>
            <p className="chair-name">Jeremy Flint</p>
            <p className="chair-title">Alumni Chair</p>
            <div className="chair-divider" />
            <a className="chair-contact" href="mailto:jzflint@mit.edu">jzflint@mit.edu</a>
            <a className="chair-contact" href="tel:+14086485530">408-648-5530</a>
          </div>
        </div>
      </div>
    </section>
    {/* ── Media Section ── */}
    <section className="media-section">
      <div className="chairs-inner">
        <p className="itinerary-eyebrow">Photos & Videos</p>
        <h2 className="itinerary-headline">Memories</h2>
        <div className="hero-divider" style={{ marginTop: "20px" }} />
        <p className="chairs-blurb">
          Photos and videos captured throughout the reunion weekend will be shared here.
        </p>
        <div className="media-coming-soon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <p className="media-coming-soon-title">Coming Soon</p>
        </div>
      </div>
    </section>
    </>
  );
}

function ItineraryEvent({ time, title, note, detail }: { time: string; title: string; note?: string; detail?: string }) {
  return (
    <div className="itinerary-event">
      <span className="itinerary-time">{time}</span>
      <span className="itinerary-event-title">{title}</span>
      {detail && <span className="itinerary-event-detail">{detail}</span>}
      {note && <span className="itinerary-event-note">{note}</span>}
    </div>
  );
}
