"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  alumniCount,
  paid,
}: {
  guests: Guest[];
  isLoggedIn: boolean;
  userName?: string;
  profilePicUrl?: string;
  referralCode?: string;
  referredBy?: string;
  showWelcome?: boolean;
  alumniCount: number;
  paid: boolean | null;
}) {
  const [modal, setModal] = useState<"login" | "signup" | "welcome" | null>(
    showWelcome ? "welcome" : null
  );
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const stickyNavRef = useRef<HTMLDivElement>(null);
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const globeParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    function handleScroll() {
      const isScrolled = window.scrollY > 80;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));

      // Parallax effect on hero elements (desktop only — on mobile the
      // hero-left panel is position:relative so the -50% offset would
      // push content off-screen)
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          const y = window.scrollY;
          const isMobile = window.innerWidth <= 768;
          if (heroLeftRef.current) {
            heroLeftRef.current.style.opacity = `${Math.max(0, 1 - y / 500)}`;
            heroLeftRef.current.style.transform = isMobile
              ? `translateY(${y * 0.15}px)`
              : `translateY(calc(-50% + ${y * 0.15}px))`;
          }
          if (globeParallaxRef.current) {
            globeParallaxRef.current.style.transform = `translateY(${y * 0.3}px)`;
          }
          rafId = 0;
        });
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAvatarOpen(false);
      }
      if (
        navRef.current &&
        !navRef.current.contains(e.target as Node) &&
        (!stickyNavRef.current || !stickyNavRef.current.contains(e.target as Node))
      ) {
        setNavOpen(false);
      }
    }
    if (avatarOpen || navOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [avatarOpen, navOpen]);

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
      <div ref={globeParallaxRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        <ParticleConstellation />
        {/* Center globe */}
        <Globe />
      </div>

      {/* Top-left greek logo */}
      <div className="hero-logo">ΔΤΔ</div>

      {/* Top-right nav area */}
      <div className="hero-nav" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {/* Section navigation */}
        <div className={`section-nav${scrolled ? " section-nav--dark" : ""}`} ref={navRef}>
          <button
            onClick={() => { setNavOpen((v) => !v); setAvatarOpen(false); }}
            className="section-nav-toggle"
            aria-label="Navigate sections"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
          {navOpen && (
            <div className="section-nav-dropdown">
              {[
                { label: "The Weekend", id: "itinerary" },
                { label: "From the Chairs", id: "chairs-message" },
                { label: "Tickets", id: "tickets" },
                { label: "Payment", id: "payment" },
                { label: "Contact", id: "contact" },
                { label: "Memories", id: "memories" },
              ].map((item) => (
                <button
                  key={item.id}
                  className="section-nav-link"
                  onClick={() => {
                    setNavOpen(false);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className="section-nav-link-dot" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar menu */}
        <div ref={dropdownRef}>
          <button
            onClick={() => { setAvatarOpen((v) => !v); setNavOpen(false); }}
            className="hero-avatar-btn"
            aria-label="Account menu"
          >
            {isLoggedIn && profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={userName ?? ""}
                className="hero-avatar-img"
                width={36}
                height={36}
                decoding="async"
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
      </div>

      {/* Left info panel */}
      <div className="hero-left" ref={heroLeftRef}>
        <div className="hero-divider hero-stagger-1" />
        <p className="hero-label hero-stagger-1" style={{ opacity: 0.6, marginBottom: "4px" }}>5TH ANNIVERSARY — HOUSE RENOVATION</p>
        <h2 className="hero-countdown-title hero-stagger-2">ALUMNI REUNION IN</h2>
        <div className="hero-stagger-2"><Countdown /></div>

        <div className="hero-divider hero-stagger-3" />
        <p className="hero-date hero-stagger-3">MAY 1 – MAY 3, 2026</p>
        <p className="hero-location hero-stagger-3">416 BEACON ST, BOSTON, MA</p>
        <div className="hero-divider hero-stagger-4" />
        {!isLoggedIn ? (
          <div className="hero-rsvp-cta hero-stagger-4">
            <RsvpDeadlineText />
            <div className="hero-rsvp-buttons">
              <button
                onClick={() => setModal("signup")}
                className="hero-btn hero-btn-solid"
              >
                RSVP
              </button>
              <button
                onClick={() => setModal("login")}
                className="hero-btn hero-btn-ghost"
              >
                LOG IN
              </button>
            </div>
          </div>
        ) : (
          <RsvpDeadlineText compact />
        )}
        <div className="hero-stagger-5"><AttendeeCounter count={alumniCount} /></div>
      </div>

      {/* Right guest list panel */}
      <GuestListPreview guests={guests} />

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
              RSVP deadline: April 21, 2026
            </p>
          </div>
          <p className="text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-4 py-3 text-center leading-relaxed">
            If you already RSVP&apos;d via the Google Form, an account has been created for you —{" "}
            <button onClick={() => setModal("login")} className="underline underline-offset-2 hover:text-amber-300 transition-colors">log in here</button>{" "}
            instead.
          </p>
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
        <span className="hero-scroll-hint-text">Explore the Weekend</span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="hero-scroll-hint-arrow">
          <path d="M1 1L6 6.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>

    {/* ── Sticky bar (RSVP for logged-out, nav for everyone) ── */}
    <div className={`sticky-rsvp-bar${scrolled ? " sticky-rsvp-bar--visible" : ""}`}>
      <span className="sticky-rsvp-bar-logo">ΔΤΔ</span>
      <div className="sticky-rsvp-bar-right">
        {!isLoggedIn && (
          <>
            <span className="sticky-rsvp-bar-deadline"><RsvpDeadlineText compact /></span>
            <button onClick={() => setModal("signup")} className="hero-btn hero-btn-solid">RSVP</button>
          </>
        )}
        <div className="section-nav section-nav--dark" ref={stickyNavRef}>
          <button
            onClick={() => { setNavOpen((v) => !v); setAvatarOpen(false); }}
            className="section-nav-toggle"
            aria-label="Navigate sections"
            style={{ width: "36px", height: "36px" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
          {navOpen && scrolled && (
            <div className="section-nav-dropdown">
              {[
                { label: "The Weekend", id: "itinerary" },
                { label: "From the Chairs", id: "chairs-message" },
                { label: "Tickets", id: "tickets" },
                { label: "Payment", id: "payment" },
                { label: "Contact", id: "contact" },
                { label: "Memories", id: "memories" },
              ].map((item) => (
                <button
                  key={item.id}
                  className="section-nav-link"
                  onClick={() => {
                    setNavOpen(false);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className="section-nav-link-dot" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ── Social proof ticker ── */}
    <RSVPTicker guests={guests} />

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
          <div className="itinerary-day">
            <p className="itinerary-day-label">Friday — May 1</p>
            <FadeIn delay={100}>
              <ItineraryEvent
                time="8:00 – 11:00 PM"
                title="Opening Night Drinks"
                detail="We're kicking off the weekend with our own private room at Carrie Nation — the whole crew, cold drinks, and the first round of catching up."
                logisticsDetail="Meet us at Carrie Nation at 8:00 PM. On arrival, mention you're with the Delts Reunion and you'll be guided to the Beacon Room, which we have to ourselves for the night."
                logistics={[
                  { label: "Location", value: "Carrie Nation Restaurant & Cocktail Club" },
                  { label: "Address", value: "6 Beacon St, Boston, MA 02108" },
                ]}
                featured
              />
            </FadeIn>
          </div>

          {/* Saturday */}
          <div className="itinerary-day">
            <p className="itinerary-day-label">Saturday — May 2</p>
            <p className="itinerary-day-note">
              A heads-up — depending on how the day flows, you may want to drop a change of clothes at the house in the morning so you&apos;re ready for dinner and brohood when we return.
            </p>
            <FadeIn delay={150}>
              <ItineraryEvent
                time="9:30 AM – 4:00 PM"
                title="Return of the Lobster Trip"
                detail="A modified take on the classic — we're heading up the coast for lobster rolls, football, spike ball, and cornhole. This is the one."
                logisticsDetail="Transportation is provided — we're all leaving together from the Shelter in vans. Arrive between 9:30 and 10:00 AM; we depart at 10:00 sharp and expect to be back around 4:00 PM. Expect mid-40s and a bit chilly, but we'll have plenty of competitions, lobster rolls, snacks, and drinks to keep us moving. Dress accordingly."
                logistics={[
                  { label: "Meet-up", value: "Delta Tau Delta — 416 Beacon St" },
                  { label: "Destination", value: "Wingaersheek Beach, Gloucester" },
                ]}
                featured
                badge="SIGNATURE EVENT"
              />
            </FadeIn>
            <FadeIn delay={200}>
              <ItineraryEvent
                time="6:00 – 9:00 PM"
                title="Dinner at Fogo de Chão"
                detail="Private rooms reserved for the full Churrasco experience — unlimited cuts, exceptional company, and an evening to remember."
                logisticsDetail="We'll walk over together from the house at 5:45 PM. If you'd rather meet us there, arrive by 6:00 PM and ask for the Delts Reunion. Our private rooms are reserved until 9:00, though we'll head out whenever the table reaches that perfect equilibrium of full and ready for brohood."
                logistics={[
                  { label: "Meet-up", value: "Delta Tau Delta — 416 Beacon St (5:45 PM walk)" },
                  { label: "Venue", value: "Fogo de Chão Brazilian Steakhouse" },
                  { label: "Address", value: "200 Dartmouth St, Boston, MA 02116" },
                  { label: "Dress", value: "Smart Casual" },
                ]}
                featured
                badge="SIGNATURE EVENT"
              />
            </FadeIn>
            <FadeIn delay={250}>
              <ItineraryEvent
                time="9:00 PM – Late"
                title="Back to the House ... Brohood"
                detail="Head back to 416 for a night the way you remember it — drinks flowing, old games revived, and traditions brought back to life. This is your chance to relive the best nights at the house with brothers past and present."
                logisticsDetail="After dinner we'll walk back to the house (around 8–9 PM) for brohood with all generations. Alumni vs. Undergrad competitions are on the docket — start thinking about who's repping your class."
                logistics={[
                  { label: "Location", value: "Throughout the house — 416 Beacon St" },
                ]}
                featured
                badge="SIGNATURE EVENT"
              />
            </FadeIn>
          </div>

          {/* Sunday */}
          <div className="itinerary-day">
            <p className="itinerary-day-label">Sunday — May 3</p>
            <FadeIn delay={300}>
              <ItineraryEvent
                time="10:00 – 11:30 AM"
                title="Rooftop Send-Off"
                detail="Close out the weekend over breakfast with sweeping views of the Boston skyline and the Charles River. A proper goodbye."
                logisticsDetail="A simple breakfast on the roofdeck to mark the close of the weekend. If your class wants extra time together afterward, this is the morning to plan it — we're hoping to have everyone present at Saturday's signature events."
                logistics={[
                  { label: "Location", value: "Delta Tau Delta — 416 Beacon St (Roofdeck)" },
                ]}
                featured
              />
            </FadeIn>
          </div>
        </div>

      </div>
    </section>

    {/* ── Section divider ── */}
    <div className="section-divider" />

    {/* ── Pull Quote + Chairs Message Section ── */}
    <section id="chairs-message" className="chairs-message-section">
      <div className="chairs-inner">
        <FadeIn>
          <p className="itinerary-eyebrow">&ldquo;This is the one.&rdquo;</p>
          <h2 className="itinerary-headline">From the Chairs</h2>
          <div className="hero-divider" style={{ marginTop: "20px" }} />
        </FadeIn>

        <TypewriterMessage paragraphs={[
          { text: "Brothers," },
          { text: "We want to take a moment to share something important with all of you. The current undergraduate chapter has voted not to hold an alumni reunion next year. We know that might come as a surprise, but we genuinely believe this is the right call \u2014 and here\u2019s why." },
          { text: "Our goal has always been to make these reunions truly special. By holding them less frequently, we can build greater momentum between events, encourage broader attendance across alumni classes, and secure the funding needed to make each reunion larger, more memorable, and worthy of the time and travel it takes to bring everyone back together. Rather than stretching resources thin year after year, we want every reunion to feel like an event you can\u2019t afford to miss." },
          { text: "That makes this year\u2019s 5th Anniversary Reunion all the more important. This is the one. We\u2019ve put months of work into planning a weekend that lives up to the history of this house and the bonds we\u2019ve built here \u2014 and we hope to see as many of you as possible at 416 Beacon this May." },
          { text: "If you have any questions about this decision or thoughts on the future of alumni events, we\u2019re always happy to talk. Reach out anytime." },
          { text: "\u2014 Nathan & Jeremy", style: { marginTop: "16px" } },
        ]} />
      </div>
    </section>

    {/* ── Section divider ── */}
    <div className="section-divider" />

    {/* ── Tickets Section ── */}
    <section id="tickets" className="donations-section">
      <div className="chairs-inner">
        <FadeIn>
          <p className="itinerary-eyebrow">Weekend Ticket</p>
          <h2 className="itinerary-headline">Tickets</h2>
          <div className="hero-divider" style={{ marginTop: "20px" }} />
        </FadeIn>
        <p className="chairs-blurb">
          A ticket is required to attend the reunion. Ticket prices are tiered by graduation year — recent graduates are more price-sensitive, and we recognize that. Our goal is to preserve buy-in across the board without letting price suppress turnout among alumni who are earlier in their careers.
        </p>
        <FadeIn>
          <div className="donations-grid" style={{ marginBottom: "24px" }}>
            <div className="donation-card">
              <p className="donation-method">Graduated 2021–2025</p>
              <div className="chair-divider" />
              <p className="donation-value">$100</p>
            </div>
            <div className="donation-card">
              <p className="donation-method">Graduated 2011–2020</p>
              <div className="chair-divider" />
              <p className="donation-value">$150</p>
            </div>
            <div className="donation-card">
              <p className="donation-method">Graduated before 2011</p>
              <div className="chair-divider" />
              <p className="donation-value">$200</p>
            </div>
          </div>
        </FadeIn>
        <p className="chairs-blurb">
          Bringing a plus one? Your ticket price is doubled to cover both guests.
        </p>
        <p className="chairs-blurb">
          Our current undergrads are chipping in too — each brother in the house is contributing $65 toward the weekend. We want to be fully transparent about where every dollar goes, so you can see exactly what your ticket covers. Any remaining difference is being graciously covered by House Corps — a generous gesture made in honor of this being our 5th anniversary celebration.
        </p>
        <p className="chairs-blurb">Here&apos;s the estimated per-person cost breakdown:</p>
        <div className="cost-breakdown">
          <div className="cost-breakdown-row">
            <span className="cost-breakdown-label">Vans (transportation)</span>
            <span className="cost-breakdown-value">$25</span>
          </div>
          <div className="cost-breakdown-row">
            <span className="cost-breakdown-label">Lobster rolls &amp; food (Lobster Trip)</span>
            <span className="cost-breakdown-value">$50</span>
          </div>
          <div className="cost-breakdown-row">
            <span className="cost-breakdown-label">Private room at Carrie Nation (incl. gratuity)</span>
            <span className="cost-breakdown-value">$15</span>
          </div>
          <div className="cost-breakdown-row">
            <span className="cost-breakdown-label">Dinner at Fogo de Chão</span>
            <span className="cost-breakdown-value">$100</span>
          </div>
          <div className="cost-breakdown-row">
            <span className="cost-breakdown-label">Rooftop breakfast send-off</span>
            <span className="cost-breakdown-value">$15</span>
          </div>
          <div className="cost-breakdown-row">
            <span className="cost-breakdown-label">Brohood</span>
            <span className="cost-breakdown-value">$15</span>
          </div>
          <div className="cost-breakdown-row">
            <span className="cost-breakdown-label">Miscellaneous</span>
            <span className="cost-breakdown-value">$25</span>
          </div>
          <div className="cost-breakdown-divider" />
          <div className="cost-breakdown-row cost-breakdown-row--total">
            <span className="cost-breakdown-label">Total per person</span>
            <span className="cost-breakdown-value">$245</span>
          </div>
        </div>
      </div>
    </section>

    {/* ── Section divider ── */}
    <div className="section-divider" />

    {/* ── Payment Section ── */}
    <section id="payment" className="payment-section">
      <div className="chairs-inner">
        <FadeIn>
          <p className="itinerary-eyebrow">Confirm Your Ticket</p>
          <h2 className="itinerary-headline">Payment</h2>
          <div className="hero-divider" style={{ marginTop: "20px" }} />
        </FadeIn>
        {paid !== null ? (
          <div className={`payment-status${paid ? " payment-status--paid" : " payment-status--unpaid"}`} style={{ marginTop: "28px" }}>
            <span className="payment-status-dot" />
            <div className="payment-status-text">
              <span className="payment-status-label">{paid ? "Payment Received" : "Payment Pending"}</span>
              <span className="payment-status-sub">{paid ? "Your ticket is confirmed — see you in May." : "We manually verify payments, so this may take a little time to update. If you\u2019ve already sent it, you\u2019re all set."}</span>
            </div>
          </div>
        ) : (
          <div className="payment-status payment-status--logged-out" onClick={() => setModal("login")} style={{ cursor: "pointer", marginTop: "28px" }}>
            <span className="payment-status-dot" />
            <div className="payment-status-text">
              <span className="payment-status-label">Payment Status</span>
              <span className="payment-status-sub">Log in to view your payment status.</span>
            </div>
          </div>
        )}
        <FadeIn>
          <div className="donations-grid" style={{ marginTop: "32px" }}>
            <div className="donation-card">
              <p className="donation-method">Zelle</p>
              <div className="chair-divider" />
              <p className="donation-detail">Send to</p>
              <p className="donation-value">dtd-treasurer@mit.edu</p>
              <p className="donation-note">In the message, include: Alumni Reunion - [First Name] [Last Name]</p>
            </div>
            <div className="donation-card">
              <p className="donation-method">Venmo</p>
              <div className="chair-divider" />
              <p className="donation-detail">Send to</p>
              <p className="donation-value">@nathankim626</p>
              <p className="donation-note">In the message, include: Alumni Reunion - [First Name] [Last Name]</p>
              <p className="donation-note">The Delta Tau Delta Venmo is currently unavailable — please use this account in the meantime.</p>
            </div>
            <div className="donation-card">
              <p className="donation-method">Check</p>
              <div className="chair-divider" />
              <p className="donation-detail">Make payable to</p>
              <p className="donation-value">Delta Tau Delta Fraternity</p>
            </div>
          </div>
        </FadeIn>
        <p className="donation-alt-note">
          Prefer a different payment method? Feel free to reach out to one of the alumni chairs and we&apos;ll make it work.
        </p>
        <p className="donation-alt-note">
          If the ticket price presents a hardship, please don&apos;t let it stop you from coming — reach out to one of the alumni chairs privately and we&apos;ll figure something out. No one will be turned away.
        </p>
        <p className="chairs-blurb" style={{ marginTop: "20px", marginBottom: "0" }}>
          Once you&apos;ve sent your payment, fill out the form below to confirm your ticket.
        </p>
        <ContributionForm />
      </div>
    </section>

    {/* ── Section divider ── */}
    <div className="section-divider" />

    {/* ── Contact Section (Alumni Chairs) ── */}
    <section id="contact" className="chairs-section">
      <div className="chairs-inner">
        <FadeIn>
          <p className="itinerary-eyebrow">Questions? We&apos;re Here to Help</p>
          <h2 className="itinerary-headline">Contact</h2>
          <div className="hero-divider" style={{ marginTop: "20px" }} />
        </FadeIn>
        <p className="chairs-blurb">
          We couldn&apos;t be more excited to bring everyone together for this. If you have any questions about logistics, the schedule, or anything in between, please don&apos;t hesitate to reach out to us directly.
        </p>
        <FadeIn>
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
              photo="/jeremy.jpg"
            />
          </div>
        </FadeIn>
      </div>
    </section>

    {/* ── Section divider ── */}
    <div className="section-divider" />

    {/* ── Media Section ── */}
    <section id="memories" className="media-section">
      <div className="chairs-inner">
        <FadeIn>
          <p className="itinerary-eyebrow">Photos &amp; Videos</p>
          <h2 className="itinerary-headline">Memories</h2>
          <div className="hero-divider" style={{ marginTop: "20px" }} />
        </FadeIn>
        <p className="chairs-blurb">
          Every moment from the reunion weekend will be captured. Photos, videos, and highlights will live here for years to come.
        </p>
        <FadeIn>
          <div className="media-coming-soon">
            <div className="media-coming-soon-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <p className="media-coming-soon-title">Memories Will Be Captured</p>
            <p className="media-coming-soon-subtitle">
              We'll be documenting the weekend. Check back after May 3 for the full gallery.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>

    {/* ── Section divider ── */}
    <div className="section-divider" />

    {/* ── Footer ── */}
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-left">
          <span className="site-footer-logo">ΔΤΔ — Delta Tau Delta</span>
          <span className="site-footer-detail">416 Beacon St, Boston, MA — Est. 1889</span>
        </div>
        <div className="site-footer-right">
          Made with care by the Alumni Chairs
        </div>
      </div>
    </footer>
    </>
  );
}

function AttendeeCounter({ count }: { count: number }) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count === 0 || hasAnimated) return;
    const el = counterRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 4000;
          const start = performance.now();
          let raf: number;
          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * count));
            if (progress < 1) raf = requestAnimationFrame(tick);
          }
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, hasAnimated]);

  return (
    <div className="attendance-counter" ref={counterRef}>
      <span className="attendance-number">{display}</span>
      <span className="attendance-label">Attendees &amp; Counting</span>
    </div>
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
          <Image
            src={photo}
            alt={name}
            className="chair-photo"
            width={320}
            height={480}
            sizes="(max-width: 768px) 140px, 160px"
            loading="lazy"
          />
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

function RsvpDeadlineText({ compact }: { compact?: boolean } = {}) {
  const deadline = new Date("2026-04-21T23:59:59");
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

  let text: string;
  let urgencyClass = "";
  let fastPulse = false;

  if (diffMs <= 0) {
    text = "LATE RSVP — CONTACT ALUMNI CHAIRS";
    urgencyClass = "urgency-critical";
    fastPulse = true;
  } else if (diffDays <= 3) {
    text = `RSVP CLOSING SOON — ${diffHours} HOURS LEFT`;
    urgencyClass = "urgency-critical";
    fastPulse = true;
  } else if (diffDays <= 7) {
    text = `ONLY ${diffDays} DAYS LEFT TO RSVP`;
    urgencyClass = "urgency-high";
    fastPulse = true;
  } else if (diffDays <= 14) {
    text = `RSVP CLOSES IN ${diffDays} DAYS`;
    urgencyClass = "";
  } else {
    text = "RSVP DEADLINE — APRIL 21, 2026";
    urgencyClass = "";
  }

  if (compact) {
    return (
      <p className={`hero-label ${urgencyClass}`} style={{ fontSize: "0.75rem", opacity: 0.6 }}>
        {text}
      </p>
    );
  }

  return (
    <p className={`hero-rsvp-deadline ${urgencyClass}`}>
      <span className={`rsvp-pulse-dot${fastPulse ? " rsvp-pulse-dot--fast" : ""}`} />
      {text}
    </p>
  );
}

function RSVPTicker({ guests }: { guests: Guest[] }) {
  if (guests.length === 0) return null;

  const items = guests.map((g) => ({
    name: `${g.first_name}${g.graduation_date ? ` '${g.graduation_date.slice(-2)}` : ""}`,
    pic: g.profile_pic_url,
    initial: (g.first_name?.[0] ?? "?").toUpperCase(),
  }));

  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  const duration = Math.max(20, items.length * 1.5);

  return (
    <div className="rsvp-ticker-wrapper">
      <div className="rsvp-ticker" style={{ "--ticker-duration": `${duration}s` } as React.CSSProperties}>
        {doubled.map((item, i) => (
          <span key={i} className="rsvp-ticker-item">
            <span className="rsvp-ticker-avatar">
              {item.pic ? (
                <img src={item.pic} alt="" width={24} height={24} decoding="async" />
              ) : (
                <span className="rsvp-ticker-avatar-letter">{item.initial}</span>
              )}
            </span>
            <span className="rsvp-ticker-name">{item.name}</span>
            {i < doubled.length - 1 && <span className="rsvp-ticker-dot" />}
          </span>
        ))}
      </div>
    </div>
  );
}

function TypewriterMessage({ paragraphs }: { paragraphs: { text: string; style?: React.CSSProperties }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1
  const doneRef = useRef(false);
  const stateRef = useRef({ isVisible: false, lastScrollY: 0, accumulated: 0 });

  // Full reveal over ~800px of scroll — a deliberate, readable pace
  const SCROLL_DISTANCE = 800;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const state = stateRef.current;

    function onScroll() {
      if (!state.isVisible || doneRef.current) return;
      const y = window.scrollY;
      const delta = Math.abs(y - state.lastScrollY);
      state.lastScrollY = y;
      state.accumulated += delta;
      const p = Math.min(state.accumulated / SCROLL_DISTANCE, 1);
      setProgress(p);
      if (p >= 1) doneRef.current = true;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        state.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          state.lastScrollY = window.scrollY;
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use a CSS mask to smoothly reveal text top-to-bottom with a soft
  // gradient edge. The mask moves from covering nothing to covering
  // everything as progress goes 0 → 1.
  const revealPct = progress * 100;
  const maskImage =
    progress >= 1
      ? "none"
      : `linear-gradient(to bottom, #000 ${revealPct}%, transparent ${revealPct + 8}%)`;

  return (
    <div ref={containerRef} className="chairs-message-standalone">
      <h3 className="chairs-message-title">A Message from the Alumni Chairs</h3>
      <div className="chair-divider" />
      <div
        ref={textRef}
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {paragraphs.map((para, pi) => (
          <p key={pi} className="chairs-message-text" style={para.style}>
            {para.text}
          </p>
        ))}
      </div>
      {progress < 1 && progress > 0 && (
        <div className="tw-cursor-line" style={{ opacity: Math.min(progress * 5, 1) }} />
      )}
    </div>
  );
}

function ItineraryEvent({ time, title, note, detail, featured, badge, logistics, logisticsDetail }: { time: string; title: string; note?: string; detail?: string; featured?: boolean; badge?: string; logistics?: { label: string; value: string }[]; logisticsDetail?: string }) {
  const hasLogisticsBlock = Boolean(logisticsDetail) || (logistics && logistics.length > 0);
  return (
    <div className={`itinerary-event${featured ? " itinerary-event--featured" : ""}`}>
      <span className="itinerary-time">{time}</span>
      {badge && <span className="itinerary-event-badge">{badge}</span>}
      <span className="itinerary-event-title">{title}</span>
      {detail && <span className="itinerary-event-detail">{detail}</span>}
      {hasLogisticsBlock && (
        <div className="itinerary-event-logistics">
          {logisticsDetail && <p className="itinerary-event-logistics-detail">{logisticsDetail}</p>}
          {logistics && logistics.length > 0 && (
            <dl className="itinerary-event-logistics-list">
              {logistics.map((row) => (
                <div key={row.label} className="itinerary-event-logistics-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
      {note && <span className="itinerary-event-note">{note}</span>}
    </div>
  );
}
