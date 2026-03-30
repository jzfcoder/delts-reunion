"use client";

import { useEffect, useRef } from "react";

// ─── Selectors treated as interactive (trigger ring expansion) ───────────────
const INTERACTIVE =
  "a, button, [role='button'], input, label, select, textarea, " +
  "[tabindex]:not([tabindex='-1']), " +
  ".hero-guest-row, .itinerary-event, .donation-card, .chair-card";

// ─── Ring size configs ────────────────────────────────────────────────────────
const RING = {
  DEFAULT: { size: 32, half: 16 },
  HOVER:   { size: 46, half: 23 },
  DOWN:    { size: 22, half: 11 },
} as const;

function applyRing(
  el: HTMLDivElement,
  cfg: { size: number; half: number },
  borderColor: string,
  bg: string,
) {
  el.style.width           = `${cfg.size}px`;
  el.style.height          = `${cfg.size}px`;
  el.style.marginLeft      = `-${cfg.half}px`;
  el.style.marginTop       = `-${cfg.half}px`;
  el.style.borderColor     = borderColor;
  el.style.backgroundColor = bg;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect touch/stylus devices — don't override the native cursor there.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (!dotRef.current || !ringRef.current) return;

    // Typed non-null aliases so closures below don't need repeated assertions.
    const dot:    HTMLDivElement = dotRef.current;
    const ringEl: HTMLDivElement = ringRef.current;

    // ── State (plain objects; avoids React re-renders on every frame) ──
    const mouse = { x: 0, y: 0 };
    const ring  = { x: 0, y: 0 };
    let visible  = false;
    let hovering = false;
    let pressed  = false;
    let frameId  = 0;

    // ── Inject a <style> tag to hide the browser cursor everywhere ────
    // A class + !important can still be beaten by inline cursor styles
    // (e.g. the globe canvas has cursor:"grab"). An injected stylesheet
    // that targets html/body/* with !important is the only reliable way
    // to fully suppress the system cursor site-wide.
    const styleTag = document.createElement("style");
    styleTag.dataset.customCursor = "1";
    styleTag.textContent = `
      html, body, *, *::before, *::after { cursor: none !important; }
      input[type="text"], input[type="email"], input[type="tel"],
      input[type="number"], input[type="password"], input:not([type]),
      textarea { cursor: text !important; }
    `.trim();
    document.head.appendChild(styleTag);

    // ── Visibility helpers ─────────────────────────────────────────────
    function show() {
      if (visible) return;
      visible = true;
      dot.style.opacity    = "1";
      ringEl.style.opacity = "1";
    }

    function hide() {
      visible = false;
      dot.style.opacity    = "0";
      ringEl.style.opacity = "0";
    }

    // ── Animation loop: lerp ring toward mouse ─────────────────────────
    function tick() {
      ring.x += (mouse.x - ring.x) * 0.12;
      ring.y += (mouse.y - ring.y) * 0.12;

      // Translate from top-left origin; negative margin offsets center the
      // element on the cursor position (updated alongside size via CSS transition).
      dot.style.transform    = `translate(${mouse.x}px,${mouse.y}px)`;
      ringEl.style.transform = `translate(${ring.x}px,${ring.y}px)`;

      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    // ── Mouse events ──────────────────────────────────────────────────
    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      show();
    }

    function onLeave() { hide(); }
    function onEnter() { show(); }

    // ── Press state: ring compresses while dragging ───────────────────
    function onDown() {
      pressed = true;
      applyRing(ringEl, RING.DOWN, "rgba(255,255,255,0.4)", "transparent");
    }

    function onUp() {
      pressed = false;
      if (hovering) {
        applyRing(ringEl, RING.HOVER, "rgba(168,85,247,0.65)", "rgba(168,85,247,0.07)");
      } else {
        applyRing(ringEl, RING.DEFAULT, "rgba(255,255,255,0.5)", "transparent");
      }
    }

    // ── Interactive hover: expand ring & tint purple ──────────────────
    // Event delegation handles all current and future elements including
    // dynamically rendered modal content.
    function onOver(e: MouseEvent) {
      if (!(e.target as Element).closest(INTERACTIVE)) return;
      if (hovering) return;
      hovering = true;
      if (!pressed) {
        applyRing(ringEl, RING.HOVER, "rgba(168,85,247,0.65)", "rgba(168,85,247,0.07)");
      }
    }

    function onOut(e: MouseEvent) {
      if (!(e.target as Element).closest(INTERACTIVE)) return;
      // Only clear if the cursor isn't moving to another interactive element
      if ((e.relatedTarget as Element | null)?.closest(INTERACTIVE)) return;
      hovering = false;
      if (!pressed) {
        applyRing(ringEl, RING.DEFAULT, "rgba(255,255,255,0.5)", "transparent");
      }
    }

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mousedown",  onDown,  { passive: true });
    window.addEventListener("mouseup",    onUp,    { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout",  onOut,  { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      styleTag.remove();
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
    };
  }, []);

  return (
    <>
      {/* Inner dot — snaps to the cursor instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         "6px",
          height:        "6px",
          borderRadius:  "50%",
          background:    "white",
          pointerEvents: "none",
          zIndex:        99999,
          opacity:       0,
          marginLeft:    "-3px",
          marginTop:     "-3px",
          // mix-blend-mode: difference inverts whatever is beneath the dot,
          // making it visible on both the light hero and the dark sections.
          mixBlendMode:  "difference",
          transition:    "opacity 0.3s ease",
          willChange:    "transform",
        }}
      />

      {/* Outer ring — follows with lerp lag */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           `${RING.DEFAULT.size}px`,
          height:          `${RING.DEFAULT.size}px`,
          borderRadius:    "50%",
          border:          "1.5px solid rgba(255,255,255,0.5)",
          backgroundColor: "transparent",
          pointerEvents:   "none",
          zIndex:          99998,
          opacity:         0,
          marginLeft:      `-${RING.DEFAULT.half}px`,
          marginTop:       `-${RING.DEFAULT.half}px`,
          // Only transition the size/color properties — transform is driven
          // directly by rAF for smooth 60fps tracking.
          transition: [
            "width 0.22s ease",
            "height 0.22s ease",
            "margin-left 0.22s ease",
            "margin-top 0.22s ease",
            "border-color 0.22s ease",
            "background-color 0.22s ease",
            "opacity 0.3s ease",
          ].join(", "),
          willChange: "transform",
        }}
      />
    </>
  );
}
