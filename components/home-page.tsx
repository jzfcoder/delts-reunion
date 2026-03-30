"use client";

import { useState, useRef, useEffect } from "react";
import { Countdown } from "@/components/countdown";
import { GuestListPreview } from "@/components/guest-list-preview";
import { Globe } from "@/components/globe";
import { Modal } from "@/components/modal";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { logout } from "@/app/logout/actions";
import { ContributionForm } from "@/components/contribution-form";
import { ParticleConstellation } from "@/components/particle-constellation";
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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


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
      {/* Particle constellation — lives between the noise texture (z-index 1)
          and the globe / UI panels (z-index 2+) */}
      <ParticleConstellation />

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
        <span>COMMITTED TO LIVES OF EXCELLENCE SINCE 1889</span>
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
            <p className="mt-1 text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <span className="rsvp-pulse-dot" />
              RSVP deadline: April 20, 2026
            </p>
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
      <div
        className={`hero-scroll-hint${scrolled ? " hero-scroll-hint--hidden" : ""}`}
        onClick={() => document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth" })}
        style={{ pointerEvents: scrolled ? "none" : "auto", cursor: "pointer" }}
      >
        <span className="hero-scroll-hint-text">The Weekend Awaits</span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="hero-scroll-hint-arrow">
          <path d="M1 1L6 6.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>

    {/* ── Itinerary Section ── */}
    <section id="itinerary" className="itinerary-section">
      <div className="itinerary-inner">
        <FadeIn>
          <div className="itinerary-header">
            <p className="itinerary-eyebrow">5th Anniversary — House Renovation</p>
            <h2 className="itinerary-headline">The Weekend</h2>
            <div className="hero-divider" style={{ marginTop: "20px" }} />
          </div>
        </FadeIn>

        <div className="itinerary-days">
          {/* Friday */}
          <FadeIn delay={100}>
            <div className="itinerary-day">
              <p className="itinerary-day-label">Friday — May 1</p>
              <ItineraryEvent time="8:00 PM" title="Opening Night Drinks" detail="We're kicking off the weekend with our own private room at Carrie Nation — the whole crew, cold drinks, and the first round of catching up." />
            </div>
          </FadeIn>

          {/* Saturday */}
          <FadeIn delay={200}>
            <div className="itinerary-day">
              <p className="itinerary-day-label">Saturday — May 2</p>
              <ItineraryEvent time="10:00 AM" title="Return of the Lobster Trip" detail="Vans leave at 10 — we're taking over the beach for a full day of lobster rolls, football, spike ball, and cornhole. This is the one." />
              <ItineraryEvent time="6:00 PM" title="Formal Dinner at Fogo de Chão" detail="Private rooms reserved for the full Churrasco experience — unlimited cuts, exceptional company, and an evening to remember." />
            </div>
          </FadeIn>

          {/* Sunday */}
          <FadeIn delay={300}>
            <div className="itinerary-day">
              <p className="itinerary-day-label">Sunday — May 3</p>
              <ItineraryEvent time="10:00 AM" title="Rooftop Send-Off" detail="Close out the weekend over breakfast with sweeping views of the Boston skyline and the Charles River. A proper goodbye." />
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
    {/* ── Donations Section ── */}
    <section className="donations-section">
      <div className="chairs-inner">
        <p className="itinerary-eyebrow">Support the Weekend</p>
        <h2 className="itinerary-headline">Contribute</h2>
        <div className="hero-divider" style={{ marginTop: "20px" }} />
        <p className="chairs-blurb">
          To help cover the cost of the weekend, we&apos;re suggesting a recommended contribution of <strong>$55 for the Lobster Trip</strong> and <strong>$75 for the Fogo de Chão dinner</strong> — roughly $130 in total (this includes transportation via vans). These are entirely optional, and no one will be turned away. Every contribution, large or small, goes directly toward making this reunion one to remember — and helps cover expenses for current undergraduates joining us for the weekend.
        </p>
        <div className="donations-grid">
          <div className="donation-card">
            <p className="donation-method">Zelle</p>
            <div className="chair-divider" />
            <p className="donation-detail">Send to</p>
            <p className="donation-value">dtd-treasurer@mit.edu</p>
          </div>
          <div className="donation-card">
            <p className="donation-method">Check</p>
            <div className="chair-divider" />
            <p className="donation-detail">Make payable to</p>
            <p className="donation-value">Delta Tau Delta Fraternity</p>
          </div>
        </div>
        <p className="donation-alt-note">
          Prefer a different payment method? Feel free to reach out to one of the alumni chairs and we&apos;ll make it work.
        </p>
        <ContributionForm />
      </div>
    </section>

    {/* ── Alumni Chairs Section ── */}
    <section className="chairs-section">
      <div className="chairs-inner">
        <p className="itinerary-eyebrow">Questions? We&apos;re Here to Help</p>
        <h2 className="itinerary-headline">Alumni Chairs</h2>
        <div className="hero-divider" style={{ marginTop: "20px" }} />
        <p className="chairs-blurb">
          We couldn&apos;t be more excited to bring everyone together for this. If you have any questions about logistics, the schedule, or anything in between, please don&apos;t hesitate to reach out to us directly.
        </p>
        <div className="chairs-grid">
          <ChairCard
            initials="NK"
            name="Nathan Kim"
            email="nkim4724@mit.edu"
            phone="818-696-6854"
            phoneHref="+18186966854"
            photo="/nathan.jpg"
          />
          <ChairCard
            initials="JF"
            name="Jeremy Flint"
            email="jzflint@mit.edu"
            phone="408-648-5530"
            phoneHref="+14086485530"
            photo="/jeremy.png"
          />
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

function ChairCard({
  initials,
  name,
  email,
  phone,
  phoneHref,
  photo,
}: {
  initials: string;
  name: string;
  email: string;
  phone: string;
  phoneHref: string;
  photo?: string;
}) {
  return (
    <div className="chair-card">
      <div className="chair-photo-col">
        {photo ? (
          <img src={photo} alt={name} className="chair-photo" />
        ) : (
          <div className="chair-photo-placeholder">
            <span className="chair-photo-initials">{initials}</span>
          </div>
        )}
      </div>
      <div className="chair-info">
        <p className="chair-name">{name}</p>
        <p className="chair-title">Alumni Chair</p>
        <div className="chair-divider" />
        <a className="chair-contact" href={`mailto:${email}`}>{email}</a>
        <a className="chair-contact" href={`tel:${phoneHref}`}>{phone}</a>
      </div>
    </div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
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
