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
        <h2 className="hero-countdown-title">ALUMNI REUNION IN</h2>
        <Countdown />

        <div className="hero-divider" />
        <p className="hero-date">MAY 2, 2026</p>
        <p className="hero-location">416 BEACON ST, CAMBRIDGE, MA</p>
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
        <span>LAT. 42.3520° N &nbsp; LON. 71.0863° W</span>
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
            <h2 className="text-2xl font-bold">Sign Up for Delts Reunion</h2>
            <p className="mt-2 text-sm text-gray-400">May 1 – 3, 2026</p>
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
    </div>
  );
}
